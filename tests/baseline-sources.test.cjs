const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const script = path.resolve(__dirname, '../scripts/validate-baseline.cjs');
const api = fs.existsSync(script) ? require(script) : {};
function git(cwd, ...args) {
  const r = spawnSync('git', ['-C', cwd, ...args], {encoding:'utf8', timeout:15000, windowsHide:true});
  assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aether-sources-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const repo = path.join(root,'references/upstream/moonlight-common-c');
  fs.mkdirSync(repo,{recursive:true}); fs.mkdirSync(path.join(root,'docs/baseline'),{recursive:true});
  git(repo,'init','-q'); git(repo,'config','user.name','Fixture'); git(repo,'config','user.email','fixture@example.invalid');
  const url='https://github.com/moonlight-stream/moonlight-common-c.git'; git(repo,'remote','add','origin',url);
  fs.writeFileSync(path.join(repo,'LICENSE.txt'),'MIT License\nCopyright Fixture\nPermission is hereby granted, free of charge\n');
  fs.writeFileSync(path.join(repo,'core.c'),'// SPDX-License-Identifier: MIT\nint core(void) { return 1; }\n');
  fs.writeFileSync(path.join(repo,'.gitmodules'),'[submodule "enet"]\n path = enet\n url = https://github.com/cgutman/enet.git\n');
  git(repo,'add','LICENSE.txt','core.c','.gitmodules'); git(repo,'commit','-qm','fixture');
  const dependency = git(repo,'rev-parse','HEAD'); git(repo,'update-index','--add','--cacheinfo',`160000,${dependency},enet`);
  git(repo,'commit','-qm','gitlink');
  fs.mkdirSync(path.join(repo,'enet'));
  const commit = git(repo,'rev-parse','HEAD');
  const lock = {schemaVersion:1,capturedAt:'2026-10-07',purpose:'fixture',repositories:[{name:'moonlight-common-c',url,commit,path:'references/upstream/moonlight-common-c',licenseFile:'LICENSE.txt'}]};
  fs.writeFileSync(path.join(root,'references/upstream-lock.json'),JSON.stringify(lock));
  return {root,repo,lock,commit};
}
function indexed(t) {
  const f=fixture(t); assert.equal(typeof api.indexSources,'function','source indexer must exist');
  f.data=api.indexSources({root:f.root,scope:'moonlight-common-c'}); return f;
}
test('independent checkout accepts Windows drive casing but rejects a parent repository',t=>{
  const f=fixture(t),record=f.lock.repositories[0];
  const spelling=(cwd,args,input)=>{
    const output=api.gitRun(cwd,args,input);
    if(args.join(' ')==='rev-parse --show-toplevel'&&process.platform==='win32'){
      const actual=output.toString().trim();
      const changed=actual[0]===actual[0].toUpperCase()?actual[0].toLowerCase():actual[0].toUpperCase();
      return Buffer.from(changed+actual.slice(1)+'\n');
    }
    return output;
  };
  assert.doesNotThrow(()=>api.context(f.root,record,spelling),'same Windows checkout identity must survive drive-letter casing');
  assert.throws(()=>api.context(f.root,record,(cwd,args,input)=>args.join(' ')==='rev-parse --show-toplevel'?Buffer.from(f.root+'\n'):api.gitRun(cwd,args,input)),/not an independent checkout/);
});
test('independent checkout accepts Win32 namespace aliases for the same directory',t=>{
  const f=fixture(t),record=f.lock.repositories[0];
  const spelling=(cwd,args,input)=>{
    const output=api.gitRun(cwd,args,input);
    return args.join(' ')==='rev-parse --show-toplevel'?Buffer.from(path.toNamespacedPath(output.toString().trim())+'\n'):output;
  };
  assert.doesNotThrow(()=>api.context(f.root,record,spelling),'real directory identity must survive a Windows path alias');
});
test('source tracer indexes fixed blobs and missing gitlink evidence, then renders via CLI',t=>{
  const f=indexed(t); assert.equal(f.data.files.length,3); assert.equal(f.data.externals.filter(x=>x.kind==='gitlink').length,1);
  assert.equal(f.data.externals[0].materialization,'absent');
  assert.equal(api.validateSources({root:f.root,scope:'moonlight-common-c',data:f.data}).errors.length,0);
  fs.writeFileSync(path.join(f.root,'docs/baseline/sources.json'),JSON.stringify(f.data));
  const r=spawnSync(process.execPath,[script,'--root',f.root,'--sources','--scope','moonlight-common-c','--report','docs/SOURCE-AUDIT.md'],{encoding:'utf8',timeout:15000,windowsHide:true});
  assert.equal(r.status,0,r.stderr); const summary=JSON.parse(r.stdout); assert.equal(summary.status,'PASS'); assert.ok(summary.checked>0);
  assert.match(fs.readFileSync(path.join(f.root,'docs/SOURCE-AUDIT.md'),'utf8'),new RegExp(f.commit));
});
for (const [name,mutate,match] of [
  ['wrong SHA',f=>{f.data.repositories[0].commit='a'.repeat(40);},/commit|SHA/i],
  ['forged remote',f=>{git(f.repo,'remote','set-url','origin','https://github.com/attacker/fake.git');},/remote/i],
  ['missing file',f=>{f.data.files.pop();},/file|tree|coverage/i],
  ['dirty checkout',f=>{fs.appendFileSync(path.join(f.repo,'core.c'),'changed');},/dirty/i],
  ['unregistered gitlink',f=>{f.data.externals=[];},/gitlink|external/i],
  ['forged gitlink URL',f=>{f.data.externals.find(x=>x.kind==='gitlink').url='https://github.com/attacker/fake.git';},/gitlink.*URL/],
  ['path traversal',f=>{f.data.files[0].path='../escape';},/path/i],
  ['shell syntax in lock',f=>{f.lock.repositories[0].name='moonlight-common-c; echo injected';fs.writeFileSync(path.join(f.root,'references/upstream-lock.json'),JSON.stringify(f.lock));},/lock|name/i],
  ['unsupported legal approval',f=>{f.data.files[0].auditState='approved';},/state|approv/i],
  ['wrong blob',f=>{f.data.files[0].blob='b'.repeat(40);},/blob|tree/i],
  ['missing legal evidence and blocker',f=>{f.data.files[0].licenseEvidenceIds=[];f.data.files[0].blockerIds=[];},/evidence|block/i],
  ['unknown license evidence repository',f=>{f.data.licenseEvidence[0].anchor.repo='unknown-repository';},/unknown.*repository/],
  ['unexplained copy intent',f=>{f.data.files[0].reuseIntent='copy';},/reuse|decision/i]
]) test(`sources reject ${name}`,t=>{ const f=indexed(t); mutate(f); const r=api.validateSources({root:f.root,scope:'moonlight-common-c',data:f.data}); assert.ok(r.errors.length,r); assert.match(r.errors.join('\n'),match); });
test('anchor reads commit object and rejects mismatched excerpt',t=>{
  const f=indexed(t); const a=f.data.licenseEvidence[0].anchor;
  assert.equal(api.validateAnchor({root:f.root,anchor:a}).errors.length,0);
  assert.ok(api.validateAnchor({root:f.root,anchor:{...a,excerpt:'forged content'}}).errors.length);
});
test('source CLI failures preserve report and reject unknown/conflicting flags',t=>{
  const f=indexed(t); fs.writeFileSync(path.join(f.root,'docs/baseline/sources.json'),JSON.stringify({...f.data,files:[]}));
  const report=path.join(f.root,'docs/SOURCE-AUDIT.md'); fs.writeFileSync(report,'existing report');
  for(const args of [['--sources','--scope','moonlight-common-c','--report','docs/SOURCE-AUDIT.md'],['--sources','--wat'],['--sources','--features']]){
    const r=spawnSync(process.execPath,[script,'--root',f.root,...args],{encoding:'utf8',timeout:15000,windowsHide:true}); assert.notEqual(r.status,0); assert.equal(fs.readFileSync(report,'utf8'),'existing report');
  }
});
test('checkout reparse-point escape is rejected before Git is invoked',t=>{
  const f=fixture(t); const outside=fs.mkdtempSync(path.join(os.tmpdir(),'aether-outside-'));t.after(()=>fs.rmSync(outside,{recursive:true,force:true}));
  fs.renameSync(f.repo,path.join(f.root,'saved')); fs.symlinkSync(outside,f.repo,process.platform==='win32'?'junction':'dir');
  assert.equal(typeof api.validateSources,'function','source validator must exist');
  const r=api.validateSources({root:f.root,scope:'moonlight-common-c',data:{}}); assert.match(r.errors.join('\n'),/escape|reparse|symlink/i);
});
test('full sources reject missing platform distribution routes',t=>{
  const f=indexed(t);f.data.scope.complete=true;f.data.routes=[];
  const result=api.validateSources({root:f.root,data:f.data});
  assert.match(result.errors.join('\n'),/distribution.*route|route.*coverage/i);
});
test('sources preserve manual notes while refusing stale legal approval',t=>{
  const f=indexed(t);f.data.files[0].notes='Human review note';
  const next=api.indexSources({root:f.root,scope:'moonlight-common-c',data:f.data});assert.equal(next.files[0].notes,'Human review note');
  next.licenseEvidence[0].reviewState='approved';assert.match(api.validateSources({root:f.root,scope:'moonlight-common-c',data:next}).errors.join('\n'),/approv/i);
});
test('sources report injected Git failures and timeouts as errors',t=>{
  const f=indexed(t);
  for(const message of ['ETIMEDOUT: Git exceeded 15000ms','Git cat-file failed: nonzero']) {
    const r=api.validateSources({root:f.root,scope:'moonlight-common-c',data:f.data,gitRunner:()=>{throw Error(message);}});assert.match(r.errors.join('\n'),new RegExp(message.split(':')[0]));
  }
});
function materialFixture(t){
  const f=fixture(t);
  fs.writeFileSync(path.join(f.repo,'artifact.cat'),Buffer.from([0,1,2,3,0xff]));
  fs.writeFileSync(path.join(f.repo,'vendor.cmake'),'file(DOWNLOAD "https://example.invalid/archive.zip" output)\n');
  fs.writeFileSync(path.join(f.repo,'driver.inf'),Buffer.concat([Buffer.from([0xff,0xfe]),Buffer.from('; SPDX-License-Identifier: MIT\n; Manufacturer=示例\n','utf16le')]));
  git(f.repo,'add','artifact.cat','vendor.cmake','driver.inf');git(f.repo,'commit','-qm','binary and download fixture');
  f.commit=git(f.repo,'rev-parse','HEAD');f.lock.repositories[0].commit=f.commit;
  fs.writeFileSync(path.join(f.root,'references/upstream-lock.json'),JSON.stringify(f.lock));
  f.data=api.indexSources({root:f.root});return f;
}
for(const [name,mutate,pattern] of [
  ['omitted embedded binary',f=>{f.data.externals=f.data.externals.filter(x=>x.kind!=='binary');},/external.*coverage|external.*identity/],
  ['omitted download locator',f=>{f.data.externals=f.data.externals.filter(x=>x.path!=='vendor.cmake');},/external.*coverage|external.*identity/],
  ['forged binary digest',f=>{f.data.externals.find(x=>x.kind==='binary').digest='sha256:'+'0'.repeat(64);},/identity/],
  ['missing channel terms',f=>{f.data.routes[0].terms=[];},/route/],
  ['unsupported channel approval',f=>{f.data.routes[0].evidenceState='approved';},/route/],
  ['decision without confirmation',f=>{f.data.decisions[0].status='selected';f.data.decisions[0].selected=f.data.decisions[0].options[0].id;},/human/],
  ['missing decision options',f=>{f.data.decisions.find(d=>d.id==='project-reuse-policy').options=[];},/decision/]
])test(`full sources reject ${name}`,t=>{const f=materialFixture(t);assert.equal(api.validateSources({root:f.root,data:f.data}).errors.length,0);mutate(f);assert.match(api.validateSources({root:f.root,data:f.data}).errors.join('\n'),pattern);});
test('fixed UTF16 INF anchors round trip decoded evidence without changing blob identity',t=>{
  const f=materialFixture(t),ctx=api.context(f.root,f.lock.repositories[0]),anchor=api.anchorFor(ctx,'driver.inf',2,2,'UTF16 manufacturer');
  assert.match(anchor.excerpt,/示例/);assert.equal(api.validateAnchor({root:f.root,anchor}).errors.length,0);
  assert.ok(api.validateAnchor({root:f.root,anchor:{...anchor,blob:'0'.repeat(40)}}).errors.length);
});
test('stock GPL application template cannot classify upstream files as or-later',t=>{
  const f=fixture(t);
  fs.writeFileSync(path.join(f.repo,'LICENSE.txt'),'GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\nHow to Apply These Terms\neither version 3 of the License, or\nany later version\n');
  git(f.repo,'add','LICENSE.txt');git(f.repo,'commit','-qm','stock license application template');f.lock.repositories[0].commit=git(f.repo,'rev-parse','HEAD');
  fs.writeFileSync(path.join(f.root,'references/upstream-lock.json'),JSON.stringify(f.lock));
  const data=api.indexSources({root:f.root,scope:'moonlight-common-c'});
  assert.equal(data.licenseEvidence.find(e=>e.id.endsWith(':root-license')).spdxExpression,null);
  assert.equal(data.files.find(e=>e.path==='core.c').licenseEvidenceIds.length,2);
  assert.equal(api.validateSources({root:f.root,scope:'moonlight-common-c',data}).errors.length,0);
});
test('source validator rejects corrupt fixed blob content even when batch header claims its original id',t=>{
  const f=indexed(t);
  const gitRunner=(cwd,args,input)=>{
    const out=api.gitRun(cwd,args,input);
    if(args[0]==='cat-file'){const altered=Buffer.from(out),start=altered.indexOf(10)+1;altered[start]^=1;return altered;}
    return out;
  };
  assert.match(api.validateSources({root:f.root,scope:'moonlight-common-c',data:f.data,gitRunner}).errors.join('\n'),/hash mismatch/);
});
test('source sync VerifyOnly verifies clean fixture and fails dirty, remote, missing and unsafe lock without restoring',t=>{
  const f=fixture(t);fs.mkdirSync(path.join(f.root,'scripts'));fs.copyFileSync(path.resolve(__dirname,'../scripts/sync-upstream.ps1'),path.join(f.root,'scripts/sync-upstream.ps1'));
  const run=()=>spawnSync('pwsh',['-NoProfile','-File',path.join(f.root,'scripts/sync-upstream.ps1'),'-VerifyOnly','-RepositoryName','moonlight-common-c'],{encoding:'utf8',timeout:15000,windowsHide:true});
  assert.equal(run().status,0);
  fs.appendFileSync(path.join(f.repo,'core.c'),'dirty');assert.notEqual(run().status,0);assert.match(fs.readFileSync(path.join(f.repo,'core.c'),'utf8'),/dirty/);
  git(f.repo,'checkout','--','core.c');git(f.repo,'remote','set-url','origin','https://github.com/attacker/fake.git');assert.notEqual(run().status,0);
  fs.renameSync(f.repo,path.join(f.root,'saved'));assert.notEqual(run().status,0);assert.equal(fs.existsSync(f.repo),false);
  f.lock.repositories[0].commit='x; echo injected';fs.writeFileSync(path.join(f.root,'references/upstream-lock.json'),JSON.stringify(f.lock));assert.notEqual(run().status,0);
});
