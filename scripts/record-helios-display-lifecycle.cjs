'use strict';
// Re-audit the bounded 03-02 driver revision; no device, registry or trust mutation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {transform}=require('./prepare-helios-display-research.cjs');
const {validate,dossierHash}=require('./check-virtual-display-admission.cjs');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p)),json=p=>JSON.parse(read(p).toString('utf8').replace(/^\ufeff/,''));
const receipt=p=>({path:p,length:read(p).length,sha256:sha(read(p)),fixture:false});
const check=(v,m)=>{if(!v)throw Error(m);};
function record(sourceRoot,signedRoot){
 check(/^artifacts\/phase03\/derived-research\/helios-\d+$/.test(sourceRoot)&&/^artifacts\/phase03\/selfsigned-research\/helios-\d+$/.test(signedRoot),'Unsafe root');
 const current='docs/phase03/PROVIDER-ADMISSION-RECONSTRUCTED.json',history='docs/phase03/PROVIDER-ADMISSION-03-01-HISTORY.json';
 if(!fs.existsSync(path.join(root,history)))fs.copyFileSync(path.join(root,current),path.join(root,history));
 const d=json(history),prior=d.candidates.find(c=>c.providerId==='aether-helios-display');
 const oldManifest=json(prior.package.origin.sourceManifest.path),s=json(sourceRoot+'/research-source.json');
 const oldRoot=path.posix.dirname(prior.package.origin.sourceManifest.path);
 const sig=json(signedRoot+'/signature-verification.json'),signed=json(signedRoot+'/signing-state.json');
 check(sig.defaultWindowsTrustVerified&&signed.certificateReused&&signed.sourceRoot===sourceRoot&&!sig.installed&&!signed.trustStoresChanged,'Signature gate');
 const unchanged=[];
 for(const f of s.files){
  check(sha(read(sourceRoot+'/'+f.outputPath))===f.sha256,'Source bytes changed');
  const old=oldManifest.files.find(x=>x.outputPath===f.outputPath);check(old,'Inventory changed');
  if(!f.outputPath.endsWith('/Driver.cpp')){check(f.sha256===old.sha256,'Non-lifecycle source changed');unchanged.push(f.outputPath);}
  else {
   const original=read('artifacts/phase03/sudovda-followup/Driver.cpp').toString('utf8');
   check(read(sourceRoot+'/'+f.outputPath).toString('utf8')===transform(f.sourcePath,original),'Compiled driver does not equal reviewed transform');
   const before=read(oldRoot+'/'+f.outputPath).toString('utf8'),after=read(sourceRoot+'/'+f.outputPath).toString('utf8');
   const region=(t,a,b)=>t.slice(t.indexOf(a),t.indexOf(b,t.indexOf(a)));
   // Actual ACL evidence transfers only the precise Windows-managed boundary,
   // never the entire changed IOCTL implementation or runtime monitor behavior.
   for(const [a,b] of [['NTSTATUS SudoVDADeviceAdd(', 'NTSTATUS SudoVDADeviceD0Entry(']]){
    check(before.includes(a)&&before.includes(b)&&region(before,a,b)===region(after,a,b),'WDF device security boundary changed');
   }
   check(region(before,'case IOCTL_GET_WATCHDOG:', 'default:')===region(after,'case IOCTL_GET_WATCHDOG:', 'default:'),'Query access behavior changed');
  }
 }
 check(s.files.length===8&&unchanged.length===7,'Build boundary changed');
 for(const f of s.independentInputs)check(sha(read(f.path))===f.sha256,'Independent input bytes changed');
 for(const f of signed.members)check(sha(read(signedRoot+'/HeliosDisplayX64/'+f.name))===f.sha256,'Signed bytes changed');
 const inf=json('artifacts/phase03/contract/inf-results.json');check(inf.length===6&&inf.every(x=>x.status===0),'INF matrix failed');
 const notices=['Microsoft-MS-PL.txt','SudoVDA-README.txt','CC0-1.0.txt','HeliosDisplay-NOTICE.txt'];
 for(const name of notices)check(sha(read('docs/phase03/licenses/'+name))===sha(read(signedRoot+'/licenses/'+name)),'Notice differs');
 const report={schemaVersion:1,status:'verified',recordedAt:new Date().toISOString(),scope:'03-02 bounded lifecycle source/build/signature re-audit; no installed revised DLL or machine functionality claim',previousDossier:receipt(history),previousPackage:prior.package.sha256,sourceManifest:receipt(sourceRoot+'/research-source.json'),build:receipt('artifacts/phase03/contract/driver-build.log'),infChecks:receipt('artifacts/phase03/contract/inf-results.json'),buildDiagnostic:'MSBuild returns 0 but bundled InfVerif task emits a load-DLL exception. Explicit installed x64 InfVerif independently passed all six targets; original diagnostic retained.',unchangedInputs:unchanged,rights:{status:'verified',prior:receipt('docs/phase03/HELIOS-DISPLAY-RIGHTS-CLOSED.json'),basis:'Seven compiled inputs unchanged. Driver.cpp differs only by independently authored lifecycle cleanup/locking transform; fixed source notices/MS-PL/CC0 obligations retained.',notices:notices.map(n=>receipt(signedRoot+'/licenses/'+n))},acl:{status:'verified',scope:'source-backed inference for identical private header/access bits, INF, hardware/interface identity, WDF DeviceAdd and read-query bodies only; changed monitor lifetime callback is reviewed source, not physically retested',actual:receipt('docs/phase03/HELIOS-DISPLAY-ACL-AUDIT.json'),priorBridge:receipt('docs/phase03/HELIOS-DISPLAY-ACL-BRIDGE.json'),profile:{watchdog:0,testMode:0,maxMonitors:10}},signature:receipt(signedRoot+'/signature-verification.json'),archive:receipt(signedRoot+'/HeliosDisplayResearch.zip'),driverInstalled:false,machineMutationAuthorized:false,limitations:['No Win10/11 seven-screen/HDR/persistence/update result inferred.','Arrival/duplicate boundary regressions are source transform checks plus actual WDK compilation; installed-driver failure injection remains 03-03.','No reboot or shutdown executed or scheduled.']};
 const proofPath='docs/phase03/HELIOS-DISPLAY-LIFECYCLE-EVIDENCE.json';fs.writeFileSync(path.join(root,proofPath),JSON.stringify(report,null,2)+'\n');
 const proof=receipt(proofPath),c=d.candidates.find(c=>c.providerId==='aether-helios-display'),archive=report.archive;
 Object.assign(c.package,{localPath:archive.path,length:archive.length,sha256:archive.sha256,origin:{kind:'local-derived',sourceManifest:report.sourceManifest,buildEvidence:report.build},members:signed.members.map(m=>({...m,localPath:signedRoot+'/HeliosDisplayX64/'+m.name,catalogRequired:/\.(inf|dll)$/i.test(m.name)})),signature:{policy:'umdf-authenticode',policyVerified:true,catalogMembersVerified:true,timestampVerified:true,...report.signature},licenseEvidence:{status:'verified',...proof},sourceCorrespondence:{status:'verified',...proof}});
 c.interfaceEvidence.acl={status:'verified',scope:report.acl.scope,...proof};
 c.risks.filter(r=>['arrival-cleanup','full-capacity-idempotence'].includes(r.id)).forEach(r=>{r.status='mitigated';r.reason='Reviewed independent lifecycle patch, failing-before source guards and actual WDK rebuild; machine behavior still pending.';});
 c.admission.scope='03-02 source implementation admitted; no system mutation authorized';
 d.purpose='03-02 lifecycle revision admission; historical hashes preserved, machine operations require 03-03 checkpoint';d.capturedAt=report.recordedAt;d.systemPlan.package=archive;
 d.decision={...d.decision,userText:d.decision.userText+'\n$gsd-execute-phase 3',recordedAt:report.recordedAt,scope:'03-02 implementation and prerequisite repair; no new system-operation authorization',authorizationBasis:'Existing dedicated-route/self-sign authorization plus explicit phase execution on 2026-10-09; no manual revised-hash review claimed'};
 d.gaps=d.gaps.filter(x=>x.field!=='phase03');d.gaps.push({field:'phase03',reason:'03-02 in progress; VDP-01/02 and Phase3 incomplete pending 03-03 machine validation.'});
 d.decision.dossierSha256=dossierHash(d);
 const result=validate(d,{stage:'admission',requireDecision:true});check(result.ok,result.errors.join('; '));
 fs.writeFileSync(path.join(root,current),JSON.stringify(d,null,2)+'\n');
 console.log(JSON.stringify({sourceRoot,signedRoot,packageSha256:archive.sha256,dossierSha256:result.dossierSha256,driverInstalled:false}));
}
if(require.main===module)record(...process.argv.slice(2));
module.exports={record};
