'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const checker=path.resolve(__dirname,'../scripts/check-virtual-display-admission.cjs');
function api(){assert.ok(fs.existsSync(checker),'provider dossier validator must exist');return require(checker);}
function dossier(){return JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/phase03/PROVIDER-ADMISSION.json'),'utf8'));}
test('dossier preserves honest unknown evidence and explicit gaps',()=>{const {validate}=api();assert.equal(validate(dossier(),{stage:'dossier'}).ok,true);});
test('dossier rejects erased topology, unexplained nulls and false machine PASS',()=>{
 const {validate}=api();for(const mutate of [d=>d.requested.pop(),d=>d.candidates[0].gaps=[],d=>d.productionEvidence.status='passed']){const d=dossier();mutate(d);assert.equal(validate(d,{stage:'dossier'}).ok,false);}
});
test('admission rejects missing packages, hash signature architecture source and ACL defects',()=>{
 const {validate}=api();const baseline=dossier();for(const c of baseline.candidates)assert.equal(validate(baseline,{stage:'admission',providerId:c.providerId}).ok,false);
 const id='virtualdrivers-vdd';
 for(const [field,mutate] of [
  ['sha256',c=>c.package.sha256='invalid'],['architecture',c=>c.package.architecture='arm64'],
  ['source',c=>c.sourceCommit='not-fixed'],['signature',c=>c.package.signature.policyVerified=false],
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
