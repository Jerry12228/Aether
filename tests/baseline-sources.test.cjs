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
  ['path traversal',f=>{f.data.files[0].path='../escape';},/path/i],
  ['shell syntax in lock',f=>{f.lock.repositories[0].name='moonlight-common-c; echo injected';fs.writeFileSync(path.join(f.root,'references/upstream-lock.json'),JSON.stringify(f.lock));},/lock|name/i],
  ['unsupported legal approval',f=>{f.data.files[0].auditState='approved';},/state|approv/i],
  ['wrong blob',f=>{f.data.files[0].blob='b'.repeat(40);},/blob|tree/i],
  ['missing legal evidence and blocker',f=>{f.data.files[0].licenseEvidenceIds=[];f.data.files[0].blockerIds=[];},/evidence|block/i],
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
