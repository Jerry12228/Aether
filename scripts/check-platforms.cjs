'use strict';
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
function platformRecords(root=ROOT){return JSON.parse(fs.readFileSync(path.join(root,'docs','phase02','PLATFORM-GAPS.json'),'utf8')).clients;}
function validate(records,root=ROOT){
 if(!Array.isArray(records)||records.length!==5||new Set(records.map(row=>row.id)).size!==5)throw Error('Five unique client rows required');
 for(const id of ['windows','macos','ios','android','linux']){
  const row=records.find(row=>row.id===id);if(!row)throw Error('Missing platform');
  if(row.interface!==(id==='windows'?'implemented-local-core':'unsupported'))throw Error('Unsupported adapter cannot become product support');
  if(row.buildDuty!=='required-v1'||!row.owner||!row.followup||!row.prerequisite||!row.outcome)throw Error('Build duty/prerequisite/owner/follow-up missing');
  if(['macos','ios'].includes(id)&&(!row.hardwareEvidence.startsWith('TODO VFY-')||!Array.isArray(row.commands)||row.commands.length<2))throw Error('Apple build duties remain required; only hardware is TODO');
 }
 const android=records.find(row=>row.id==='android'),linux=records.find(row=>row.id==='linux');
 if(JSON.stringify(android.legacyApis)!=='[21,22,23]'||android.lockedFlutterMinApi!==24)throw Error('Original Android API21-23 duty erased');
 if(!['ARM32','RISC-V','board targets'].every(value=>linux.legacyArchitectures?.includes(value)))throw Error('Original Linux target duty erased');
 const evidence=JSON.parse(fs.readFileSync(path.join(root,'docs','phase02','PLATFORM-RESULTS.json'),'utf8'));
 if(evidence.androidNative.length!==6||evidence.androidNative.some(row=>row.exit!==0||!row.sha256||!row.headers.includes('ELF')||!row.runtime.includes('not tested')))throw Error('Missing honest Android native feasibility evidence');
 if(!evidence.linuxExecutor.some(row=>row.exit!==0&&row.output.includes('HCS_E_SERVICE_NOT_AVAILABLE')))throw Error('Linux executor outcome/reason missing');
 const source=fs.readFileSync(path.join(root,'native','platform','platform.cpp'),'utf8');
 for(const id of ['WINDOWS','MACOS','IOS','ANDROID','LINUX'])if(!source.includes('AETHER_'+id))throw Error('Missing common adapter descriptor');
 return {status:'PASS',clients:5,androidNativeCrossCompiles:6,linuxExecutor:'unavailable: HCS_E_SERVICE_NOT_AVAILABLE',platformSupportClaimed:false};
}
module.exports={platformRecords,validate};
if(require.main===module){try{if(JSON.stringify(process.argv.slice(2))!=='["--check"]')throw Error('Use --check');console.log(JSON.stringify(validate(platformRecords())));}catch(error){console.error(JSON.stringify({status:'FAIL',error:error.message}));process.exitCode=1;}}
