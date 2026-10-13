'use strict';
// Carries forward a tested Windows-managed boundary only when every relevant input is identical.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),oldRoot='artifacts/phase03/derived-research/helios-1791523371087',newRoot='artifacts/phase03/derived-research/helios-1791524690800';
const read=p=>fs.readFileSync(path.join(root,p));
const json=p=>JSON.parse(read(p).toString('utf8').replace(/^\ufeff/,''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const receipt=p=>({path:p,sha256:sha(read(p)),fixture:false});
const check=(ok,message)=>{if(!ok)throw Error(message);};
const oldSource=json(oldRoot+'/research-source.json'),newSource=json(newRoot+'/research-source.json');
const prior=json('docs/phase03/HELIOS-DISPLAY-ACL-AUDIT.json');
check(prior.status==='verified'&&prior.filteredCallerDenied&&prior.zeroAccessIoctlDenied,'Actual predecessor boundary audit required');
const unchanged=[];
for(const f of newSource.files){
 const old=oldSource.files.find(x=>x.outputPath===f.outputPath);
 check(old&&sha(read(oldRoot+'/'+old.outputPath))===old.sha256&&sha(read(newRoot+'/'+f.outputPath))===f.sha256,'Source receipt mismatch');
 if(f.outputPath.endsWith('/Driver.cpp'))continue;
 check(old.sha256===f.sha256,'Non-settings input changed: '+f.outputPath);unchanged.push(f.outputPath);
}
const driverPath='Virtual Display Driver (HDR)/SudoVDA/Driver.cpp';
const oldDriver=read(oldRoot+'/'+driverPath).toString('utf8'),newDriver=read(newRoot+'/'+driverPath).toString('utf8');
const headers=s=>s.split(/\r?\n/).filter(l=>l.startsWith('#include '));
check(JSON.stringify(headers(oldDriver))===JSON.stringify(headers(newDriver)),'Included headers/order changed');
const independentSettings=read('tools/helios-display-research/HeliosDisplaySettings.cpp.inc').toString('utf8');
const declarations=s=>s.slice(s.indexOf('using namespace std;'),s.includes(independentSettings)?s.indexOf(independentSettings):s.indexOf('void LoadSettings() {'));
check(declarations(oldDriver)===declarations(newDriver),'Global/default configuration or callback declarations changed');
const callbacks=s=>{const start=s.indexOf('void DisconnectAllMonitors() {');check(start>0,'Callback boundary absent');return s.slice(start);};
check(callbacks(oldDriver)===callbacks(newDriver),'Device creation/security/IOCTL implementation changed');
check(oldSource.hardwareId===newSource.hardwareId&&oldSource.interfaceGuid===newSource.interfaceGuid&&oldSource.deviceAcl===newSource.deviceAcl,'Boundary identity/ACL changed');
const report={schemaVersion:1,status:'verified',recordedAt:new Date().toISOString(),scope:'source-backed inference carrying forward the identical INF/WDF/private IOCTL access boundary; NOT a claim that the reconstructed DLL was installed',testedPackageRoot:prior.packageRoot,candidatePackageRoot:'artifacts/phase03/selfsigned-research/helios-1791525277849',actualAudit:receipt('docs/phase03/HELIOS-DISPLAY-ACL-AUDIT.json'),oldManifest:receipt(oldRoot+'/research-source.json'),newManifest:receipt(newRoot+'/research-source.json'),unchangedBuildInputs:unchanged,includeOrderUnchanged:true,globalDefaultsAndCallbackDeclarationsUnchanged:true,deviceCreationAndIoctlImplementationUnchanged:true,changedRegions:['independently authored registry settings reader','independently declared identical dependency block'],deviceAcl:newSource.deviceAcl,hardwareId:newSource.hardwareId,interfaceGuid:newSource.interfaceGuid,requiredProfile:{watchdog:0,testMode:0,maxMonitors:10},conclusion:'Actual filtered/elevated denial, zero-access rejection and BA/SY stack DACL apply to the unchanged Windows-managed boundary. Full reconstructed package installation/runtime remains later machine evidence.',limits:['Only GET_PROTOCOL_VERSION was physically probed.','No seven-screen/HDR/Win10/persistence/update result is inferred.','Any change to INF, private IOCTL/header, WDF/security callback suffix, identity or profile invalidates this transfer.']};
fs.writeFileSync(path.join(root,'docs/phase03/HELIOS-DISPLAY-ACL-BRIDGE.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,unchangedInputs:unchanged.length,callbacksUnchanged:true,newDllInstalled:false}));
