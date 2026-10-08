'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const checker=path.resolve(__dirname,'../scripts/check-virtual-display-admission.cjs');
function api(){assert.ok(fs.existsSync(checker),'provider dossier validator must exist');return require(checker);}
function dossier(){return JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/phase03/PROVIDER-ADMISSION.json'),'utf8'));}
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
 const {validate,dossierHash}=api();const d=dossier();assert.equal(validate(d,{stage:'dossier',requireDecision:true}).ok,false);
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
