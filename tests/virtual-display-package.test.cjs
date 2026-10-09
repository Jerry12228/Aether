'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const checker=path.resolve(__dirname,'../scripts/check-virtual-display-admission.cjs');
test('installer tracer: real read-only plan binds fixed package and exact native actions',()=>{
 const {spawnSync}=require('node:child_process');
 const exe=path.resolve(__dirname,'../build/native',process.env.AETHER_DISPLAY_CONFIGURATION||'Release','helios.exe');
 const r=spawnSync(exe,['vdisplay','driver','install','--plan','--json'],{encoding:'utf8',windowsHide:true,timeout:30000});
 assert.equal(r.status,0,'read-only install plan must succeed without installation or elevation');
 const p=JSON.parse(r.stdout);assert.equal(p.status,'planned');assert.equal(p.systemMutation,false);
 assert.equal(p.package.sha256,'b3ce3b4427e0e3a1f11d76ef1759429f8f3ca478c4431b716995865114d9a4ae');
 assert.match(p.planSha256,/^[a-f0-9]{64}$/);assert.ok(p.actions.length>0);assert.equal(p.rebootPolicy,'prohibited');
 assert.ok(Array.isArray(p.foreignDevices));assert.ok(Array.isArray(p.groups));assert.equal(p.evidenceScope,'machine-readonly');
});
const packageContract=path.resolve(__dirname,'../build/native',process.env.AETHER_DISPLAY_CONFIGURATION||'Release','aether_driver_package_contract.exe');
function installCase(name){const {spawnSync}=require('node:child_process');const r=spawnSync(packageContract,[name],{encoding:'utf8',windowsHide:true,timeout:10000});assert.equal(r.status,0,r.error?.message||r.stderr);return JSON.parse(r.stdout);}
test('native install contract: unregistered private-provider resources cannot be treated as owned',()=>{const r=installCase('unknown-private');assert.equal(r.status,'identity-conflict');assert.equal(r.installs,0);assert.equal(r.writes,0);});
for(const [name,status]of Object.entries({hash:'package-invalid',signature:'package-invalid',arch:'package-invalid','package-version':'package-invalid',truncated:'package-invalid',traversal:'package-invalid',reparse:'package-invalid',version:'version-mismatch','missing-auth':'system-authorization-required',stale:'system-authorization-required',machine:'system-authorization-required',denied:'access-denied',groups:'maintenance-required'}))test(`native install contract: ${name} rejects before any installer side effect`,()=>{const r=installCase(name);assert.equal(r.status,status);assert.equal(r.installs,0);assert.equal(r.backups,0);assert.equal(r.writes,0);assert.equal(r.registryPreserved,true);});
for(const name of ['install','update','maintenance'])test(`native install contract: explicit ${name} verifies and commits without clearing groups`,()=>{const r=installCase(name);assert.equal(r.status,'installed');assert.equal(r.installs,1);assert.equal(r.backups,1);assert.equal(r.journal.status,'complete');assert.equal(r.registryPreserved,true);});
test('native install contract: same version checks readiness without reinstallation',()=>{const r=installCase('same-version');assert.equal(r.status,'already-ready');assert.equal(r.installs,0);assert.equal(r.writes,0);});
test('native install contract: plan is side effect free',()=>{const r=installCase('plan');assert.equal(r.status,'planned');assert.equal(r.installs,0);assert.equal(r.writes,0);assert.equal(r.backups,0);});
test('native install contract: update failure restores verified old package and retains last-success',()=>{const r=installCase('rollback');assert.equal(r.status,'failed-rolled-back');assert.equal(r.rollbacks,1);assert.equal(r.journal.unresolvedEffects,false);assert.equal(r.registryPreserved,true);});
test('native install contract: rollback failure remains pending',()=>{const r=installCase('rollback-fails');assert.equal(r.status,'pending-recovery');assert.equal(r.journal.unresolvedEffects,true);assert.equal(r.rollbackResult.status,'failed');assert.equal(r.registryPreserved,true);});
test('native install contract: reboot requirement exits pending and never schedules restart',()=>{const r=installCase('reboot');assert.equal(r.status,'reboot-required');assert.equal(r.rebootPolicy,'prohibited');assert.equal(r.journal.status,'reboot-required');assert.equal(r.journal.unresolvedEffects,true);});
test('native install contract: timeout retains unknown effects and does not assume rollback',()=>{const r=installCase('timeout');assert.equal(r.status,'timeout');assert.equal(r.rollbacks,0);assert.equal(r.journal.status,'pending-recovery');assert.equal(r.journal.unresolvedEffects,true);});
function api(){assert.ok(fs.existsSync(checker),'provider dossier validator must exist');return require(checker);}
function dossier(){return JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/phase03/PROVIDER-ADMISSION.json'),'utf8'));}
function revisedDossier(){const d=dossier(),crypto=require('node:crypto');d.schemaVersion=2;d.decision=null;d.requirementRevision={id:'R1',path:'docs/phase03/SUDOVDA-REQUIREMENTS-REVISION.md',sha256:crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..','docs/phase03/SUDOVDA-REQUIREMENTS-REVISION.md'))).digest('hex'),fixture:false};d.requestedByPlatform={windows10:structuredClone(d.requested),windows11:structuredClone(d.requested)};d.requestedByPlatform.windows10.at(-1).color='SDR';delete d.requested;return d;}

test('R1 binds the actual revision and distinguishes Win10 SDR from Win11 HDR',()=>{
 const {validate}=api(),d=revisedDossier();assert.equal(validate(d,{stage:'dossier'}).ok,true,'approved R1 platform requests must validate');
 const recorded=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/phase03/PROVIDER-ADMISSION-R1.json'),'utf8'));assert.equal(validate(recorded,{stage:'dossier'}).ok,true);assert.equal(validate(recorded,{stage:'dossier',requireDecision:true}).ok,true,'actual route choice is bound to reviewed R1 dossier');const pending=structuredClone(recorded);pending.decision=null;assert.equal(validate(pending,{stage:'dossier',requireDecision:true}).ok,false,'continue alone cannot approve the changed dossier');
 const changedProposal=structuredClone(recorded);changedProposal.recommendation.proposalEvidence.sha256='f'.repeat(64);assert.equal(validate(changedProposal,{stage:'dossier'}).ok,false,'changed route cannot retain its approval digest');
 for(const mutate of [x=>x.requirementRevision.sha256='a'.repeat(64),x=>x.requirementRevision.fixture=true,x=>x.requirementRevision.path='docs/phase03/SUDOVDA-EVIDENCE-FOLLOWUP.md',x=>x.requestedByPlatform.windows10.at(-1).color='HDR',x=>x.requestedByPlatform.windows11.at(-1).color='SDR',x=>x.requestedByPlatform.windows10.pop(),x=>x.requestedByPlatform.windows11[0].refresh={numerator:60000,denominator:1001},x=>x.requested=[],x=>delete x.requirementRevision]){const changed=structuredClone(d);mutate(changed);assert.equal(validate(changed,{stage:'dossier'}).ok,false);}
 assert.equal(validate(d,{stage:'admission',providerId:'apollo-sudovda'}).ok,false);
 assert.equal(validate(d,{stage:'authorization'}).ok,false);
 const old=dossier();old.requested.at(-1).color='SDR';assert.equal(validate(old,{stage:'dossier'}).ok,false,'R1 cannot silently rewrite legacy history');
 const stale=structuredClone(recorded);stale.decision=dossier().decision;assert.equal(validate(stale,{stage:'dossier',requireDecision:true}).ok,false,'old decision hash cannot approve R1');
});
test('R1 refresh comparison accepts exact rationals and rejects 59.94 or invalid values',()=>{
 const {equivalentRefresh}=api();assert.equal(typeof equivalentRefresh,'function','exact refresh comparator must exist');
 assert.equal(equivalentRefresh({numerator:60000,denominator:1000},{numerator:60,denominator:1}),true);
 assert.equal(equivalentRefresh({numerator:4294967295,denominator:4294967295},{numerator:1,denominator:1}),true);
 for(const actual of [{numerator:60000,denominator:1001},{numerator:60,denominator:0},{numerator:0,denominator:1},{numerator:60.01,denominator:1},{numerator:4294967296,denominator:1},{numerator:'60',denominator:1},null])assert.equal(equivalentRefresh(actual,{numerator:60,denominator:1}),false);
 assert.equal(equivalentRefresh({numerator:60,denominator:1},{numerator:60,denominator:0}),false);
});
test('dossier preserves honest unknown evidence and explicit gaps',()=>{const {validate}=api();assert.equal(validate(dossier(),{stage:'dossier'}).ok,true);});
test('dossier rejects erased topology, unexplained nulls and false machine PASS',()=>{
 const {validate}=api();for(const mutate of [d=>d.requested.pop(),d=>d.candidates[0].gaps=[],d=>d.productionEvidence.status='passed',d=>d.candidates[0].interfaceEvidence.sevenSlotCapacity.status='verified']){const d=dossier();mutate(d);assert.equal(validate(d,{stage:'dossier'}).ok,false);}
});
test('admission rejects missing packages, hash signature architecture source and ACL defects',()=>{
 const {validate}=api();const baseline=dossier();for(const c of baseline.candidates)assert.equal(validate(baseline,{stage:'admission',providerId:c.providerId}).ok,false);
 const id='virtualdrivers-vdd';
 for(const [field,mutate] of [
  ['sha256',c=>c.package.sha256='invalid'],['architecture',c=>c.package.architecture='arm64'],
  ['source',c=>c.sourceCommit='a'.repeat(40)],['source',c=>c.officialRepository='https://github.com/wrong/provider'],['signature',c=>c.package.signature.policyVerified=false],
  ['version',c=>c.package.version='wrong'],['fixture',c=>c.fixture=true],
  ['acl',c=>c.interfaceEvidence.acl.status='high-unmitigated']]){
  const d=structuredClone(baseline);mutate(d.candidates.find(c=>c.providerId===id));const result=validate(d,{stage:'admission',providerId:id});assert.equal(result.ok,false,field);assert.ok(result.errors.some(e=>e.includes(field)),JSON.stringify(result));
 }
});
test('fixture cannot enter real admission even if all declared gates are true',()=>{
 const {validate}=api();const d=dossier();const c=d.candidates[0];c.fixture=true;c.admission.status='admitted';assert.equal(validate(d,{stage:'admission',providerId:c.providerId}).ok,false);
});
test('selection, authorization and no-qualified decision have distinct gates and bound hashes',()=>{
 const {validate,dossierHash}=api();const d=dossier();d.decision=null;assert.equal(validate(d,{stage:'dossier',requireDecision:true}).ok,false);
 d.decision={status:'no-qualified-provider',providerId:null,userText:'no-qualified-provider; research replacement',recordedAt:'2026-10-08T13:00:00Z',dossierSha256:dossierHash(d),nextAction:'research replacement'};
 assert.equal(validate(d,{stage:'dossier',requireDecision:true}).ok,true);
 assert.equal(validate(d,{stage:'admission',requireDecision:true}).ok,false);
 assert.equal(validate(d,{stage:'authorization',requireDecision:true}).ok,false);
 d.requested[0].width=1280;assert.equal(validate(d,{stage:'dossier',requireDecision:true}).ok,false);
});
test('declared admission cannot bypass fixed files or open high risks',()=>{
 const {validate}=api();const d=dossier();d.candidates[0].admission.status='admitted';assert.equal(validate(d,{stage:'dossier'}).ok,false);
});
test('fixture audit distinguishes release tags UTF16 INF versions and real byte mismatches',()=>{
 const {validate}=api(),crypto=require('node:crypto');const d=dossier(),c=d.candidates.find(c=>c.providerId==='virtualdrivers-vdd');
 const relative=`artifacts/phase03/package-test-${process.pid}`,dir=path.resolve(__dirname,'..',relative);fs.mkdirSync(dir,{recursive:true});
 const name='fixture.inf',file=path.join(dir,name),bytes=Buffer.from('\ufeffDriverVer = 12/24/2024,11.30.4.434\r\n[Standard.NTamd64]\r\n','utf16le');fs.writeFileSync(file,bytes);
 try{c.fixture=true;c.package.members=[{name,length:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),localPath:`${relative}/${name}`,catalogRequired:true}];
  const r=validate(d,{stage:'admission',providerId:c.providerId});assert.equal(r.ok,false);assert.ok(!r.errors.some(e=>/version INF bytes|architecture INF bytes|sha256 member/.test(e)),JSON.stringify(r));
  c.package.members[0].sha256='f'.repeat(64);assert.ok(validate(d,{stage:'admission',providerId:c.providerId}).errors.some(e=>e.includes('sha256 member')));
 }finally{fs.unlinkSync(file);fs.rmdirSync(dir);}
});

test('dedicated local derivation has explicit origin and retains license signature and ACL gates',()=>{
 const {admission}=api(),c={providerId:'aether-helios-display',fixture:false,sourceCommit:'a4b09fa2aa731a964d0cb5d139cb1e6240e4da12',officialRepository:'https://github.com/Jerry12228/Aether',package:{origin:{kind:'local-derived'},version:'0.1.0.0',kind:'umdf'}};
 const errors=admission(c);
 assert.ok(!errors.some(e=>e.includes('official fixed release')||e.includes('fixed release URL')),'dedicated derivation must not fabricate an upstream release URL');
 for(const message of ['derived source manifest','derived build evidence','license','signature','acl'])assert.ok(errors.some(e=>e.includes(message)),message);
 const foreign=structuredClone(c);foreign.providerId='foreign-provider';assert.ok(admission(foreign).some(e=>e.includes('dedicated derivation')));
 const spoofed=structuredClone(c);spoofed.sourceCommit='f'.repeat(40);assert.ok(admission(spoofed).some(e=>e.includes('derived base commit')));
 const reused=structuredClone(c);reused.officialRepository='https://github.com/SudoMaker/SudoVDA';assert.ok(admission(reused).some(e=>e.includes('derived repository')));
 const unsigned=structuredClone(c);unsigned.package.origin.kind='unsigned-research';assert.ok(admission(unsigned).some(e=>e.includes('official fixed release')));
});

test('derived origin refuses stale source bytes, omitted inputs, duplicate output and changed identity',()=>{
 const {admission}=api(),crypto=require('node:crypto'),root=path.resolve(__dirname,'..');
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const relative=`artifacts/phase03/derived-research/helios-000${Date.now()}${process.pid}`,dir=path.resolve(root,relative);
 const upstream=JSON.parse(fs.readFileSync(path.join(root,'docs/phase03/SUDOVDA-SOURCE-EVIDENCE.json'),'utf8'));
 const inputPaths=['scripts/prepare-helios-display-research.cjs','scripts/helios-display-inputs.cjs','tools/helios-display-research/AdapterOption.h','tools/helios-display-research/HeliosDisplay.inf','tools/helios-display-research/HeliosDisplay.vcxproj'];
 const files=upstream.files.filter(f=>!/(?:^README\.md$|\.sln$|\.filters$|\.edid$|\/option\.txt$)/i.test(f.path)).map((f,i)=>{
  const outputPath=f.path.replace('/SudoVDA.inf','/HeliosDisplay.inf'),target=path.join(dir,outputPath),bytes=Buffer.from('fixture source '+i);
  fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
  return {sourcePath:f.path,sourceSha256:f.sha256,outputPath,sha256:hash(bytes)};
 });
 const manifest={sourceCommit:upstream.sourceCommit,files,hardwareId:'Root\\Aether\\HeliosDisplay',interfaceGuid:'0d9ecbde-124e-45f0-9ae0-3d71b16a7725',deviceAcl:'D:P(A;;GA;;;SY)(A;;GA;;;BA)',independentInputs:inputPaths.map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(root,p)))}))};
 const log=path.join(dir,'build.log');fs.writeFileSync(log,'fixture build log; cannot admit');
 const candidate={providerId:'aether-helios-display',fixture:true,sourceCommit:upstream.sourceCommit,officialRepository:'https://github.com/Jerry12228/Aether',package:{version:'0.1.0.0',origin:{kind:'local-derived',buildEvidence:{path:relative+'/build.log',sha256:hash(fs.readFileSync(log)),fixture:false}}}};
 function check(m){const bytes=Buffer.from(JSON.stringify(m));fs.writeFileSync(path.join(dir,'research-source.json'),bytes);candidate.package.origin.sourceManifest={path:relative+'/research-source.json',sha256:hash(bytes),fixture:false};return admission(candidate);}
 try{
  const baseline=check(manifest);assert.ok(!baseline.some(e=>e.includes('derived')),baseline.join('\n'));
  assert.ok(baseline.some(e=>e.includes('fixture')),'synthetic evidence never grants real admission');
  const reconstructed=structuredClone(manifest);reconstructed.sourceRevision=2;
  for(const p of ['tools/helios-display-research/HeliosDisplaySettings.cpp.inc','tools/helios-display-research/HeliosDriverIncludes.cpp.inc'])reconstructed.independentInputs.push({path:p,sha256:hash(fs.readFileSync(path.join(root,p)))});
  assert.ok(!check(reconstructed).some(e=>e.includes('derived')),'revision2 binds both independent reconstruction inputs');
  const missingReconstruction=structuredClone(reconstructed);missingReconstruction.independentInputs.pop();assert.ok(check(missingReconstruction).some(e=>e.includes('inventory')));
  const unsupported=structuredClone(reconstructed);unsupported.sourceRevision=3;assert.ok(check(unsupported).some(e=>e.includes('unknown derived source revision')));
  for(const [message,mutate] of [
   ['input bytes',m=>m.files[0].sha256='f'.repeat(64)],['eight build inputs',m=>m.files.pop()],
   ['inventory',m=>m.files[0].sourcePath=m.files[1].sourcePath],['duplicate',m=>m.files[0].outputPath=m.files[1].outputPath],
   ['identity',m=>m.deviceAcl='D:P(A;;GA;;;WD)'],['transformation input bytes',m=>m.independentInputs[0].sha256='a'.repeat(64)],
   ['inventory',m=>m.independentInputs.pop()],['path',m=>m.files[0].outputPath='../../escape.cpp']
  ]){const changed=structuredClone(manifest);mutate(changed);assert.ok(check(changed).some(e=>e.includes(message)),message);}
 }finally{
  assert.equal(path.dirname(dir),path.join(root,'artifacts/phase03/derived-research'));
  fs.rmSync(dir,{recursive:true,force:true});
 }
});
