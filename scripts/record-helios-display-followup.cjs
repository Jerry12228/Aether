'use strict';
// Collect immutable evidence receipts. Does not assert admission or operate devices.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceRoot='artifacts/phase03/derived-research/helios-1791523371087';
const signedRoot='artifacts/phase03/selfsigned-research/helios-1791523416599';
const receipt=p=>{const bytes=fs.readFileSync(path.join(root,p));return {path:p,length:bytes.length,sha256:sha(bytes),fixture:false};};
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8').replace(/^\ufeff/,''));
function blame(name){let author,originalLine,finalLine;const rows=[];
 for(const line of fs.readFileSync(path.join(root,`artifacts/phase03/admission-followup/blame-copy-${name}.txt`),'utf8').split(/\r?\n/)){
  const header=/^[a-f0-9]{40} (\d+) (\d+)(?: \d+)?$/.exec(line);
  if(header){originalLine=Number(header[1]);finalLine=Number(header[2]);}
  else if(line.startsWith('author '))author=line.slice(7);
  else if(line.startsWith('\t'))rows.push({author,originalLine,line:finalLine,text:line.slice(1)});
 }return rows;
}
const normalize=s=>s.replace(/\s/g,'');
const lineAudit=['Driver.cpp','Driver.h'].map(name=>{
 const rows=blame(name),microsoft=new Set(fs.readFileSync(path.join(root,`artifacts/phase03/admission-followup/ms-initial-${name}.raw`),'utf8').split(/\r?\n/).map(normalize));
 const karlf=rows.filter(r=>r.author==='karlf');
 return {name,copyDetectionFlags:'-w -M -C -C',authors:rows.reduce((m,r)=>(m[r.author]=(m[r.author]||0)+1,m),{}),karlfLines:karlf.length,karlfExpressionsAbsentFromMicrosoft2020:karlf.filter(r=>!microsoft.has(normalize(r.text))),otherContributorLines:rows.filter(r=>!['karlf','Yukino Song'].includes(r.author)),blame:receipt(`artifacts/phase03/admission-followup/blame-copy-${name}.txt`)};
});
const source=json(sourceRoot+'/research-source.json'),signing=json(signedRoot+'/signing-state.json'),verification=json(signedRoot+'/signature-verification.json');
for(const f of source.files)if(receipt(sourceRoot+'/'+f.outputPath).sha256!==f.sha256)throw Error('Source hash mismatch');
for(const f of source.independentInputs)if(receipt(f.path).sha256!==f.sha256)throw Error('Transform hash mismatch');
for(const f of signing.members)if(receipt(signedRoot+'/HeliosDisplayX64/'+f.name).sha256!==f.sha256)throw Error('Signed member mismatch');
if(!verification.defaultWindowsTrustVerified)throw Error('Windows trust not verified');
const report={schemaVersion:1,recordedAt:new Date().toISOString(),scope:'03-01 bounded self-signed research followup; provider NOT ADMITTED',sourceCommit:source.sourceCommit,sourceManifest:receipt(sourceRoot+'/research-source.json'),build:receipt('artifacts/phase03/admission-followup/access-required-build.log'),nativeEdidBuild:receipt('artifacts/phase03/admission-followup/access-required-native-build.log'),nativeEdidRun:receipt('artifacts/phase03/admission-followup/access-required-native-run.log'),infChecks:receipt('artifacts/phase03/admission-followup/final-inf-results.json'),infUnchangedFromSixCheckedTargets:true,sourceBoundary:{buildInputs:8,independentInputs:source.independentInputs,excluded:source.excludedHistoricalInputs,edid:'independently generated 256-byte SDR/HDR; external 384-byte asset and GPL template excluded',vendorIdentity:'ZZZ is a research placeholder, not an assigned Aether identity'},rights:{closed:false,microsoftLicensedReferenceCommit:'d43983a97c79e5e7eafb4948fd2678f5e709838b',microsoftLicense:receipt('docs/phase03/licenses/Microsoft-MS-PL.txt'),sudoNotice:receipt('docs/phase03/licenses/SudoVDA-README.txt'),lineAudit,limitations:['Matching whitespace-normalized expressions establishes available licensed reference text, not an exact 2017 Git ancestor.','SudoMaker waiver expressly covers its own modifications; no blanket grant is attributed to other contributors.','Remaining source expressions require a bounded independent reconstruction or independent rights evidence before licenseEvidence may be verified.'],productionReuseApproved:false},signing:{state:receipt(signedRoot+'/signing-state.json'),verification:receipt(signedRoot+'/signature-verification.json'),publicCertificate:receipt(signedRoot+'/HeliosDisplayResearch.cer'),trustImport:receipt('artifacts/phase03/selfsigned-research/helios-1791521377539/trust-import.json'),thumbprint:signing.certificate.thumbprint,defaultWindowsTrustVerified:true,policy:'umdf-authenticode; local machine trust only',members:signing.members.map(m=>({...m,localPath:signedRoot+'/HeliosDisplayX64/'+m.name,catalogRequired:/\.(dll|inf)$/i.test(m.name)}))},security:{hardwareId:source.hardwareId,interfaceGuid:source.interfaceGuid,deviceAcl:source.deviceAcl,protocol:'0.3.0 research; incompatible private IOCTL access bits intentionally changed',queryAccess:'FILE_READ_ACCESS',mutationAccess:'FILE_READ_ACCESS | FILE_WRITE_ACCESS',actualAclVerified:false,baselineProbe:receipt('artifacts/phase03/admission-followup/acl-before-install.json'),highRisk:'T-03-02 remains open until actual stack DACL and filtered/elevated caller tests pass'},machine:{certificateTrustChanged:true,driverInstalled:false,deviceCreated:false,securityChecksDisabled:false,rebootOrShutdown:false,phase0302Started:false,phase0303Started:false},remainingGates:['bounded inherited source rights','actual device/IOCTL access boundary','concrete admitted-provider decision after evidence closes']};
report.signing.archive=receipt(signedRoot+'/HeliosDisplayResearch.zip');
report.signing.negativeChecks=receipt('artifacts/phase03/admission-followup/selfsignature-negative-results.json');
report.interfaceAudit=receipt('docs/phase03/HELIOS-DISPLAY-INTERFACE-AUDIT.md');
fs.writeFileSync(path.join(root,'docs/phase03/HELIOS-DISPLAY-SELFSIGNED-FOLLOWUP.json'),JSON.stringify(report,null,2)+'\n');
const auditPath='docs/phase03/HELIOS-DISPLAY-SELFSIGNED-FOLLOWUP.json',audit=receipt(auditPath);
const pending={status:'unverified',evidence:null};
const interfaceEvidence=Object.fromEntries(['perSlotOperations','stableIdentity','sevenSlotCapacity','shortProcessPersistence','strictModes','win10Route','win11Route','acl'].map(name=>[name,structuredClone(pending)]));
for(const name of ['perSlotOperations','stableIdentity','sevenSlotCapacity','shortProcessPersistence','strictModes','win10Route','win11Route'])interfaceEvidence[name]={status:'verified',scope:'pre-install source/build feasibility only; not physical matrix',...report.interfaceAudit};
interfaceEvidence.methods=[
 ['OpenDevice','INTEGRATE','Private GUID only; filtered/elevated access tests pending, no mutation on open in reviewed source.'],
 ['AddVirtualDisplay','INTEGRATE','Per-GUID create; private read/write IOCTL, implementation only after admission.'],
 ['RemoveVirtualDisplay','INTEGRATE','Per-GUID explicit stop; departure status checked, no implicit disconnect deletion.'],
 ['SetRenderAdapter','OPT-OUT','Adapter-wide mutation risks other groups; fixed configured adapter is the Phase03 boundary.'],
 ['GetWatchdogTimeout','INTEGRATE','Read access required; dedicated GET does not refresh watchdog.'],
 ['GetProtocolVersion','INTEGRATE','Read access required; dedicated GET does not refresh watchdog.'],
 ['isProtocolCompatible','INTEGRATE','Private protocol 0.3.0; old 0.2.x access bits are incompatible.'],
 ['CheckProtocolCompatible','INTEGRATE','Read-only private version query then compare; actual runtime pending.'],
 ['PingDriver','OPT-OUT','No persistent ping owner; research/default watchdog is zero.'],
 ['GetAddedDisplayName','INTEGRATE','Match adapter LUID and target ID together; deferred until admitted implementation.']
].map(([name,decision,reason])=>({name,decision,reason}));
const candidate={providerId:'aether-helios-display',officialRepository:'https://github.com/Jerry12228/Aether',sourceCommit:source.sourceCommit,fixture:false,package:{url:null,version:'0.1.0.0',architecture:'x64',kind:'umdf',localPath:report.signing.archive.path,length:report.signing.archive.length,sha256:report.signing.archive.sha256,complete:true,infVersion:'0.1.0.0',origin:{kind:'local-derived',sourceManifest:report.sourceManifest,buildEvidence:report.build},members:report.signing.members,signature:{policy:'umdf-authenticode',policyVerified:true,catalogMembersVerified:true,timestampVerified:true,...report.signing.verification},licenseEvidence:null,sourceCorrespondence:{status:'verified',...audit}},interfaceEvidence,risks:[{id:'T-03-02',severity:'high',status:'open',reason:'Actual stack DACL and filtered/elevated caller evidence absent.'}],admission:{status:'not-admitted'},gaps:[{field:'package.url',reason:'Locally built research artifact, no fabricated upstream release URL.'},{field:'package.licenseEvidence',reason:'Remaining inherited rights/reconstruction gate is open.'},{field:'interfaceEvidence',reason:'Source feasibility is documented; independent interface/security admission audit and actual ACL evidence remain pending.'}]};
const dossier=json('docs/phase03/PROVIDER-ADMISSION-R1.json');
dossier.capturedAt=report.recordedAt;dossier.purpose='03-01 dedicated self-signed research evidence; not production or driver-install authorization';
dossier.candidates.push(candidate);dossier.selectedProviderId=null;dossier.decision=null;
dossier.gaps.push({field:'decision',reason:'No admitted provider exists; prior preparation decision stays in unchanged R1 dossier.'});
dossier.derivedFollowup=audit;
fs.writeFileSync(path.join(root,'docs/phase03/PROVIDER-ADMISSION-SELFSIGNED.json'),JSON.stringify(dossier,null,2)+'\n');
console.log(JSON.stringify({sourceInputs:source.files.length,karlfUnmatched:lineAudit.reduce((n,r)=>n+r.karlfExpressionsAbsentFromMicrosoft2020.length,0),rightsClosed:false,defaultWindowsTrustVerified:true,actualAclVerified:false}));
