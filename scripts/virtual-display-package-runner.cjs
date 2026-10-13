'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {runGroup,validateTests,clean}=require('./tool-runner.cjs');
const ROOT=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(argv){
 const o={mode:'Contract',scenario:'All',configuration:'Release',authorization:'',output:'artifacts/phase03/package-contract'};
 for(let i=0;i<argv.length;i++){const key={'--mode':'mode','--scenario':'scenario','--configuration':'configuration','--authorization':'authorization','--output':'output'}[argv[i]];if(!key||i+1>=argv.length)throw Error('Unknown/missing runner option');o[key]=argv[++i];}
 if(!['Contract','Machine'].includes(o.mode)||!['Debug','Release'].includes(o.configuration)||!['Install','Topology','Persistence','DeleteIsolation','ResetRecovery','UpdateRollback','RebootCheck','All'].includes(o.scenario))throw Error('Invalid runner enum');
 const out=path.resolve(ROOT,o.output),allowed=path.join(ROOT,'artifacts','phase03');if(!out.startsWith(allowed+path.sep))throw Error('Output must stay inside phase03 artifacts');
 const product=path.join(ROOT,'build','native',o.configuration,'helios.exe'),contract=path.join(ROOT,'build','native',o.configuration,'aether_driver_package_contract.exe');
 for(const file of [product,contract])if(!fs.statSync(file).isFile()||fs.statSync(file).size<1)throw Error('Missing nonempty built artifact');
 fs.mkdirSync(out,{recursive:true});const records=[];
 async function run(name,exe,args,ms){const r=await runGroup({name,exe,args,cwd:ROOT,timeoutMs:ms,env:{...process.env,AETHER_DISPLAY_CONFIGURATION:o.configuration}},{root:ROOT});records.push({...r,output:undefined});if(r.exitCode!==0)throw Error(`${name} exited ${r.exitCode}; ${r.log}`);return r;}
 // Keep the exact native plan in ignored local artifacts; redact only its log.
 // Generic tool-runner redacts profile paths in stdout and cannot preserve an
 // approval digest's canonical body. This read-only capture has its own bounds.
 const began=Date.now(),planRun=require('node:child_process').spawnSync(product,['vdisplay','driver','install','--plan','--json'],{encoding:'utf8',windowsHide:true,timeout:120000,maxBuffer:2*1024*1024});
 const log=path.join(out,'readonly-plan.log');fs.writeFileSync(log,clean(planRun.stdout||'')+clean(planRun.stderr||''));if(planRun.status!==0)throw Error(`Readonly plan failed ${planRun.status}`);
 records.push({name:`Display-${o.configuration}-readonly-plan`,exitCode:planRun.status,durationMs:Date.now()-began,log:path.relative(ROOT,log),sha256:sha(fs.readFileSync(log))});
 const plan=JSON.parse(planRun.stdout.trim());if(plan.status!=='planned'||plan.systemMutation!==false||!/^[a-f0-9]{64}$/.test(plan.planSha256)||plan.rebootPolicy!=='prohibited')throw Error('No valid real read-only plan');
 if(o.mode==='Machine'){
  // Authorization is the exact protected native gate file, not a caller boolean.
  const authFile=path.join(process.env.LOCALAPPDATA||'','Aether','phase03','machine-authorization.v1.json');
  if(!/^[a-f0-9]{64}$/.test(o.authorization)||!fs.existsSync(authFile)||sha(fs.readFileSync(authFile))!==o.authorization)throw Error('Concrete protected machine authorization hash required');
  const auth=JSON.parse(fs.readFileSync(authFile,'utf8'));
  if(auth.status!=='authorized'||auth.approvedPlanHash!==plan.planSha256||auth.packageSha256!==plan.package.sha256||auth.machineId!==plan.machineId)throw Error('Authorization machine/package/plan mismatch');
  if(o.scenario!=='Install')throw Error('Scenario collection belongs to 03-03-03; no implied All/reset/topology authorization');
  try{await run(`Display-${o.configuration}-authorized-install`,product,['vdisplay','driver','install','--approve-plan',plan.planSha256,'--json'],180000);}catch(e){e.systemMutation=true;throw e;}
 }else{
  const tests=await run(`Display-${o.configuration}-package-contract`,process.execPath,['--test',path.join(ROOT,'tests','virtual-display-package.test.cjs')],60000);const count=validateTests(tests.output);if(count<35)throw Error('Required package tests missing');
 }
 const planFile=path.join(out,'install-plan.json');fs.writeFileSync(planFile,JSON.stringify(plan,null,2)+'\n');
 const report={schemaVersion:1,status:'PASS',evidenceScope:o.mode==='Contract'?'contract-plus-machine-readonly':'authorized-install-only',mode:o.mode,configuration:o.configuration,systemMutation:o.mode==='Machine',planSha256:plan.planSha256,planFile:path.relative(ROOT,planFile),packageSha256:plan.package.sha256,inputDigests:{product:sha(fs.readFileSync(product)),contract:sha(fs.readFileSync(contract)),runner:sha(fs.readFileSync(__filename))},records,unperformed:['Win10 seven SDR','Win11 seven including D2 actual HDR','Persistence','DeleteIsolation','ResetRecovery','UpdateRollback','final human review'],rebootPolicy:'prohibited'};
 fs.writeFileSync(path.join(out,'runner-result.json'),JSON.stringify(report,null,2)+'\n');return report;
}
module.exports={main};
if(require.main===module)main(process.argv.slice(2)).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(JSON.stringify({status:'FAIL',systemMutation:e.systemMutation===true,error:e.message}));process.exitCode=1;});
