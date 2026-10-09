'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p)),json=p=>JSON.parse(read(p).toString('utf8').replace(/^\ufeff/,''));
const receipt=p=>({path:p,sha256:sha(read(p)),length:read(p).length,fixture:false});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function main(){
 const folder='artifacts/phase03/apollo-install-preflight/',initialPath=folder+'before-fix/snapshot.json',beforePath=folder+'window-before/snapshot.json',afterPath=folder+'window-after/snapshot.json';
 const initial=json(initialPath),before=json(beforePath),after=json(afterPath);
 const keys=['service','processes','files','drivers','umdfGroups','foreign','ownedDevices','groups'];
 const correctionChecks=Object.fromEntries(keys.map(k=>[k,same(initial[k],after[k])]));
 correctionChecks.activeCcd=same(initial.topology.actual,after.topology.actual);correctionChecks.establishedTcp=same(initial.establishedTcp,after.establishedTcp);
 const windowChecks=Object.fromEntries([...keys,'driverStoreFiles','sharedWudfService','establishedTcp'].map(k=>[k,same(before[k],after[k])]));
 windowChecks.activeCcd=same(before.topology.actual,after.topology.actual);windowChecks.planSha256=before.planSha256===after.planSha256;
 const report={schemaVersion:1,status:Object.values({...correctionChecks,...windowChecks}).every(Boolean)?'observations-unchanged':'observation-differences',recordedAt:new Date().toISOString(),scope:'read-only continuity during prerequisite correction; driver installation was not invoked',systemMutation:false,installerInvoked:false,preflightOriginal:'blocked-by-wrong-WUDF-group-subkey',originalAuthorization:receipt('docs/phase03/HELIOS-DISPLAY-APOLLO-CONDITIONAL-AUTHORIZATION.json'),initial:receipt(initialPath),before:receipt(beforePath),after:receipt(afterPath),correctionChecks,windowChecks,observationWindowMs:Date.parse(after.recordedAt)-Date.parse(before.recordedAt),service:after.service,processes:after.processes,establishedTcpCount:after.establishedTcp.length,foreignCount:after.foreign.length,foreignDriverStoreFileCount:after.driverStoreFiles.length,driverStoreLookupDiagnostic:'SetupAPI read-only lookup returned87; identity verified by unique exact published-INF hash match',activeCcd:after.topology.actual,newPlanSha256:after.planSha256,newPackageSha256:after.packageSha256,newInstallerSha256:after.installerSha256,limitations:['No actual installation/noninterference success asserted','TCP tuple identity hashes do not prove UDP/video quality or future behavior','Corrected WUDF grouping remains source/build evidence until approved install and runtime readback','Other machine scenarios and final human review remain untested'],requirementsCompleted:[]};
 const proof='docs/phase03/HELIOS-DISPLAY-APOLLO-PREFLIGHT.json';fs.writeFileSync(path.join(root,proof),JSON.stringify(report,null,2)+'\n');
 const p='docs/phase03/HELIOS-DISPLAY-INSTALL-PLAN.json',plan=json(p);
 plan.authorization={status:'awaiting-new-fixed-plan-approval',priorConditionalAuthorization:receipt('docs/phase03/HELIOS-DISPLAY-APOLLO-CONDITIONAL-AUTHORIZATION.json'),approvedPlanHash:null,gateFileCreated:false,reason:'Original approved fixed bytes failed Apollo isolation preflight; no authorization transfer to new bytes'};
 plan.apolloConstraint={text:'不得影响主机已有的Apollo运行',preflight:receipt(proof),correctedSource:receipt('docs/phase03/HELIOS-DISPLAY-UMDF-ISOLATION-EVIDENCE.json'),requiredBeforeMutation:'Repeat complete immediate baseline and fail closed on differences; verify corrected per-device WUDF group after install',runtimeIsolationVerified:false};
 plan.gaps[0]='New fixed plan installation authorization absent after original preflight was blocked';fs.writeFileSync(path.join(root,p),JSON.stringify(plan,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,systemMutation:false,windowMs:report.observationWindowMs,checks:{correction:correctionChecks,window:windowChecks},newPlanSha256:report.newPlanSha256}));
}
if(require.main===module)main();module.exports={main};
