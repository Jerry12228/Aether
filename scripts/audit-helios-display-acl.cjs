'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const prefix='artifacts/phase03/admission-followup/';
const read=name=>JSON.parse(fs.readFileSync(path.join(root,prefix+name),'utf8').replace(/^\ufeff/,''));
const receipt=name=>{const b=fs.readFileSync(path.join(root,prefix+name));return {path:prefix+name,sha256:crypto.createHash('sha256').update(b).digest('hex'),fixture:false};};
const requireTrue=(condition,message)=>{if(!condition)throw Error(message);};
const filtered=read('acl-filtered.json'),elevated=read('acl-elevated.json'),state=read('acl-install-state.json');
requireTrue(filtered.elevatedAdministrator===false&&elevated.elevatedAdministrator===true,'Both actual token identities required');
requireTrue(filtered.records.length===1&&elevated.records.length===1,'Exactly one dedicated interface required');
const ordinary=filtered.records[0],admin=elevated.records[0],expectedAcl='D:P(A;;GA;;;SY)(A;;GA;;;BA)';
requireTrue(ordinary.path===admin.path&&ordinary.sddl===expectedAcl&&admin.sddl===expectedAcl,'Actual dedicated stack ACL mismatch');
for(const access of [0,0x80000000,0xc0000000]){
 const result=ordinary.opens.find(r=>r.access===access);
 requireTrue(result&&!result.opened&&result.error===5&&!result.protocolQuerySucceeded,'Filtered caller was not denied');
}
const zero=admin.opens.find(r=>r.access===0);
requireTrue(zero?.opened===true&&zero.protocolQuerySucceeded===false&&zero.queryError===5,'Zero-access IOCTL did not fail');
for(const access of [0x80000000,0xc0000000]){
 const result=admin.opens.find(r=>r.access===access);
 requireTrue(result?.opened===true&&result.protocolQuerySucceeded===true&&result.protocol==='00-03-00-01','Admin private read protocol mismatch');
}
requireTrue(state.hardwareId==='Root\\Aether\\HeliosDisplay'&&state.instanceId==='ROOT\\DISPLAY\\0002'&&state.infName==='oem89.inf','Experiment identity changed');
requireTrue(state.installExit===0&&state.configManagerError===0&&state.removeExit===0&&state.deletePackageExit===0,'Install/remove package operations not successful');
requireTrue(state.cleanedDeviceAbsent&&state.cleanedConfigAbsent&&state.cleanedNewParentAbsent&&state.cleanupErrorResolved&&!state.rebootOrShutdown,'Cleanup or power boundary not verified');
const normalize=rows=>rows.map(r=>({id:r.PNPDeviceID,hardware:r.HardwareID,error:r.ConfigManagerErrorCode})).sort((a,b)=>a.id.localeCompare(b.id));
requireTrue(JSON.stringify(normalize(read('acl-display-devices-before.json')))===JSON.stringify(normalize(read('acl-display-devices-after-cleanup.json'))),'Foreign display devices differ after cleanup');
const report={scope:'03-01 actual Win11 local device/IOCTL boundary; no seven-screen/HDR/mutation matrix',recordedAt:new Date().toISOString(),status:'verified',packageRoot:state.packageRoot,hardwareId:state.hardwareId,instanceId:state.instanceId,infName:state.infName,deviceAcl:expectedAcl,filteredCallerDenied:true,adminReadProtocolVerified:true,zeroAccessIoctlDenied:true,raw:[receipt('acl-filtered.json'),receipt('acl-elevated.json'),receipt('acl-install-state.json'),receipt('acl-display-devices-before.json'),receipt('acl-display-devices-after-cleanup.json')],cleanup:{deviceRemoved:true,addedPackageDeleted:true,createdConfigAndParentRemoved:true,foreignDisplayDevicesUnchanged:true},limits:['Probe sent only GET_PROTOCOL_VERSION; it never sent add/remove/render-adapter/ping requests.','No immediate paired CCD snapshots were captured; no actual display-topology comparison PASS is asserted.','Later seven-screen/HDR/persistence/Win10 machine evidence remains unperformed.'],powerOperation:false,phase0302Started:false,phase0303Started:false};
fs.writeFileSync(path.join(root,'docs/phase03/HELIOS-DISPLAY-ACL-AUDIT.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,filteredCallerDenied:true,zeroAccessIoctlDenied:true,exactCleanupVerified:true}));
