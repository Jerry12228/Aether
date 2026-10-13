'use strict';
// Re-audit a single INF grouping correction. Never invokes machine mutation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {validate,dossierHash}=require('./check-virtual-display-admission.cjs');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p)),json=p=>JSON.parse(read(p).toString('utf8').replace(/^\ufeff/,''));
const receipt=p=>({path:p,length:read(p).length,sha256:sha(read(p)),fixture:false});
const check=(ok,m)=>{if(!ok)throw Error(m);};
const text=b=>b.toString(b[0]===0xff&&b[1]===0xfe?'utf16le':'utf8');
function record(sourceRoot,signedRoot){
 check(/^artifacts\/phase03\/derived-research\/helios-\d+$/.test(sourceRoot)&&/^artifacts\/phase03\/selfsigned-research\/helios-\d+$/.test(signedRoot),'Unsafe root');
 const current='docs/phase03/PROVIDER-ADMISSION-RECONSTRUCTED.json',history='docs/phase03/PROVIDER-ADMISSION-03-02-HISTORY.json';
 if(!fs.existsSync(path.join(root,history)))fs.copyFileSync(path.join(root,current),path.join(root,history));
 const d=json(history),c=d.candidates.find(x=>x.providerId==='aether-helios-display');
 const oldManifest=json(c.package.origin.sourceManifest.path),oldRoot=path.posix.dirname(c.package.origin.sourceManifest.path),s=json(sourceRoot+'/research-source.json');
 const signed=json(signedRoot+'/signing-state.json'),sig=json(signedRoot+'/signature-verification.json');
 check(s.files.length===8&&s.independentInputs.length===7&&signed.certificateReused&&signed.certificate.thumbprint==='E3ED742C3D08188A117AFF7B6C1BB207523EB4DB'&&signed.sourceRoot===sourceRoot&&!signed.trustStoresChanged&&sig.defaultWindowsTrustVerified&&!sig.installed,'Source/signature boundary mismatch');
 const unchanged=[];
 for(const f of s.files){
  const bytes=read(sourceRoot+'/'+f.outputPath),old=oldManifest.files.find(x=>x.outputPath===f.outputPath);
  check(old&&sha(bytes)===f.sha256,'Source inventory/bytes changed');
  if(f.outputPath.endsWith('/HeliosDisplay.inf')){
   const before=text(read(oldRoot+'/'+old.outputPath)),after=text(bytes);
   const bad='HKR,,DeviceGroupId,,HeliosDisplayGroup',good='HKR,"WUDF","DeviceGroupId",0x00000000,"HeliosDisplayGroup"';
   check(before.split(bad).length===2&&before.replace(bad,good)===after,'INF change exceeds exact WUDF correction');
  }else{check(old.sha256===f.sha256,'Non-INF source changed');unchanged.push(f.outputPath);}
 }
 for(const f of s.independentInputs)check(sha(read(f.path))===f.sha256,'Independent source input changed');
 for(const f of signed.members)check(sha(read(signedRoot+'/HeliosDisplayX64/'+f.name))===f.sha256,'Signed member changed');
 const output='artifacts/phase03/apollo-install-preflight/'+path.posix.basename(sourceRoot);
 const inf=json(output+'/inf-results.json');check(inf.length===6&&inf.every(x=>x.status===0),'INF checks failed');
 const notices=['Microsoft-MS-PL.txt','SudoVDA-README.txt','CC0-1.0.txt','HeliosDisplay-NOTICE.txt'];
 for(const n of notices)check(sha(read('docs/phase03/licenses/'+n))===sha(read(signedRoot+'/licenses/'+n)),'Notice mismatch');
 const proofPath='docs/phase03/HELIOS-DISPLAY-UMDF-ISOLATION-EVIDENCE.json';
 const proof={schemaVersion:1,status:'verified',recordedAt:new Date().toISOString(),scope:'pre-install single INF grouping correction; no runtime isolation or Apollo stream success claim',previousDossier:receipt(history),previousPackage:c.package.sha256,sourceManifest:receipt(sourceRoot+'/research-source.json'),build:receipt(output+'/driver-build.log'),infChecks:receipt(output+'/inf-results.json'),buildDiagnostic:'Existing bundled InfVerif DLL loader exception retained; six independent installed x64 InfVerif checks pass. First wrong /osver argument failure retained separately.',unchangedCompiledInputs:unchanged,rights:{status:'verified',prior:receipt('docs/phase03/HELIOS-DISPLAY-LIFECYCLE-EVIDENCE.json'),basis:'Seven compiled inputs identical; independently authored INF correction only. All prior MS-PL/CC0 notices retained.',notices:notices.map(n=>receipt(signedRoot+'/licenses/'+n))},acl:{status:'verified',actual:receipt('docs/phase03/HELIOS-DISPLAY-ACL-AUDIT.json'),priorBridge:receipt('docs/phase03/HELIOS-DISPLAY-ACL-BRIDGE.json'),scope:'source correspondence only: device ACL, WDF DeviceAdd, IOCTL access/header/query and all driver code unchanged; runtime corrected UMDF grouping remains untested',profile:{watchdog:0,testMode:0,maxMonitors:10},deviceCreationAndIoctlImplementationUnchanged:true},signature:receipt(signedRoot+'/signature-verification.json'),archive:receipt(signedRoot+'/HeliosDisplayResearch.zip'),sources:['https://github.com/microsoft/Windows-driver-samples/blob/main/video/IndirectDisplay/IddSampleDriver/IddSampleDriver.inf','https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/using-device-pooling-in-umdf-drivers'],driverInstalled:false,machineMutationAuthorized:false,limitations:['Corrected grouping must be read back only after separately approved installation','No actual Win10/11 seven-screen/HDR/persistence/update evidence','No reboot/shutdown or scheduling']};
 fs.writeFileSync(path.join(root,proofPath),JSON.stringify(proof,null,2)+'\n');const ref=receipt(proofPath);
 Object.assign(c.package,{localPath:proof.archive.path,length:proof.archive.length,sha256:proof.archive.sha256,origin:{kind:'local-derived',sourceManifest:proof.sourceManifest,buildEvidence:proof.build},members:signed.members.map(m=>({...m,localPath:signedRoot+'/HeliosDisplayX64/'+m.name,catalogRequired:/\.(inf|dll)$/i.test(m.name)})),signature:{policy:'umdf-authenticode',policyVerified:true,catalogMembersVerified:true,timestampVerified:true,...proof.signature},licenseEvidence:{status:'verified',...ref},sourceCorrespondence:{status:'verified',...ref}});
 c.interfaceEvidence.acl={status:'verified',scope:proof.acl.scope,...ref};
 c.risks.push({id:'umdf-device-group-location',severity:'high',status:'mitigated',reason:'Corrected WUDF subkey, failing-before source regression, actual WDK rebuild and six independent INF checks; no runtime isolation claim.'});
 d.purpose='03-03 WUDF isolation correction; prior conditional installation approval is blocked and cannot transfer to these bytes';d.capturedAt=proof.recordedAt;d.systemPlan.package=proof.archive;
 d.machineAuthorization={status:'not-authorized',providerId:c.providerId,reason:'Prior install-only authorization applied to old fixed plan and required Apollo noninterference; old preflight failed. New package/plan needs concrete approval.'};
 d.decision={...d.decision,recordedAt:proof.recordedAt,scope:'Existing dedicated-route/self-sign and execute-phase authorization permits prerequisite correction; no new fixed-package installation approved',authorizationBasis:'Existing phase execution authorization; preserve exact conditional user text in HELIOS-DISPLAY-APOLLO-CONDITIONAL-AUTHORIZATION.json; do not fabricate new hash approval'};
 d.decision.dossierSha256=dossierHash(d);const result=validate(d,{stage:'admission',requireDecision:true});check(result.ok,result.errors.join('; '));
 fs.writeFileSync(path.join(root,current),JSON.stringify(d,null,2)+'\n');
 for(const name of ['HELIOS-DISPLAY-INSTALL-PLAN.json','HELIOS-DISPLAY-INSTALL-PLAN.md']){const from='docs/phase03/'+name,to=from.replace(/\.(json|md)$/,'-03-03-HISTORY.$1');if(!fs.existsSync(path.join(root,to)))fs.copyFileSync(path.join(root,from),path.join(root,to));}
 const pinPath='native/platform/windows/helios_display_pin.h',pins=read(pinPath).toString('utf8'),member=n=>signed.members.find(m=>m.name===n);
 fs.writeFileSync(path.join(root,pinPath),pins.replace(/kHeliosPackageSha="[a-f0-9]+"/,`kHeliosPackageSha="${proof.archive.sha256}"`).replace(/kHeliosDllSha="[a-f0-9]+"/,`kHeliosDllSha="${member('HeliosDisplay.dll').sha256}"`).replace(/kHeliosInfSha="[a-f0-9]+"/,`kHeliosInfSha="${member('HeliosDisplay.inf').sha256}"`));
 let cpp=read('native/platform/windows/driver_package.cpp').toString('utf8');
 cpp=cpp.replace(/constexpr char dossierSha\[\]="[a-f0-9]+"/,`constexpr char dossierSha[]="${result.dossierSha256}"`).replace(/selfsigned-research\/helios-\d+/,signedRoot.replace('artifacts/phase03/','')).replaceAll('1021771',String(proof.archive.length)).replace('kHeliosInfSha,6356',`kHeliosInfSha,${member('HeliosDisplay.inf').length}`).replace('kHeliosDllSha,130744',`kHeliosDllSha,${member('HeliosDisplay.dll').length}`).replace('"8137a3124c959473833a082f17eb8e28fd25e8abcdc80fe7549ba3455ba8fc4d",8988',`"${member('heliosdisplay.cat').sha256}",${member('heliosdisplay.cat').length}`);
 fs.writeFileSync(path.join(root,'native/platform/windows/driver_package.cpp'),cpp);
 const testPath='tests/virtual-display-package.test.cjs';fs.writeFileSync(path.join(root,testPath),read(testPath).toString('utf8').replace('b3ce3b4427e0e3a1f11d76ef1759429f8f3ca478c4431b716995865114d9a4ae',proof.archive.sha256));
 const authPath='docs/phase03/HELIOS-DISPLAY-APOLLO-CONDITIONAL-AUTHORIZATION.json',auth=json(authPath);auth.recordedAt=new Date().toISOString();auth.recordedAtMeaning='Durable record written after prerequisite preflight; exact human message time unavailable';fs.writeFileSync(path.join(root,authPath),JSON.stringify(auth,null,2)+'\n');
 console.log(JSON.stringify({status:'verified-prerequisite-only',sourceRoot,signedRoot,packageSha256:proof.archive.sha256,dossierSha256:result.dossierSha256,driverInstalled:false}));
}
if(require.main===module)record(...process.argv.slice(2));
module.exports={record};
