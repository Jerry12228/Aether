'use strict';
const fs=require('node:fs'),path=require('node:path');
const {resolveNative,flutterCommand,runGroup,clean}=require('./tool-runner.cjs');
const ROOT=path.resolve(__dirname,'..');
function planBuild({target,configuration='Release',root=ROOT}){
 if(!['Helios','Selene'].includes(target))throw Error('Target is required: Helios or Selene');
 if(!['Debug','Release'].includes(configuration))throw Error('Configuration must be Debug or Release');
 const commands=target==='Helios'?[
  {name:`Helios-${configuration}-configure`,exe:resolveNative('cmake'),args:['--preset','windows-core','-DAETHER_ENABLE_TEST_HOOKS=OFF'],cwd:root},
  {name:`Helios-${configuration}-build`,exe:resolveNative('cmake'),args:['--build','--preset',`windows-core-${configuration.toLowerCase()}`,'--target','helios'],cwd:root},
 ]:[
  {name:`Selene-${configuration}-prepare`,exe:resolveNative('pwsh'),args:['-NoProfile','-File',path.join(root,'scripts','prepare-flutter.ps1'),'-Restore'],cwd:root},
  {name:`Selene-${configuration}-build`,...flutterCommand(root,['build','windows',`--${configuration.toLowerCase()}`,'--no-pub'])},
 ];
 const directory=target==='Helios'?path.join(root,'build','native',configuration):path.join(root,'apps','selene','build','windows','x64','runner',configuration);
 return {commands,artifacts:[path.join(directory,target==='Helios'?'helios.exe':'selene.exe'),path.join(directory,'aether_core.dll')]};
}
async function cli(argv=process.argv.slice(2)){
 const options={target:null,configuration:'Release',budgetSeconds:900};
 for(let index=0;index<argv.length;index++){
  const field={'--target':'target','--configuration':'configuration','--budget-seconds':'budgetSeconds'}[argv[index]];
  if(!field||index+1>=argv.length)throw Error('Unknown/missing build option');options[field]=argv[++index];
 }
 const seconds=Number(options.budgetSeconds);if(!Number.isInteger(seconds)||seconds<1||seconds>3600)throw Error('Budget must be 1..3600 seconds');
 const plan=planBuild(options),started=Date.now(),deadline=started+seconds*1000,results=[];
 for(const command of plan.commands){
  const remaining=deadline-Date.now();if(remaining<=0)throw Error('Target build budget expired');
  const result=await runGroup({...command,timeoutMs:remaining},{root:ROOT});results.push({...result,output:undefined});
  if(result.exitCode!==0){process.exitCode=result.exitCode;return {status:'FAIL',target:options.target,...result,output:undefined};}
 }
 for(const artifact of plan.artifacts)if(!fs.existsSync(artifact)||!fs.statSync(artifact).isFile()||fs.statSync(artifact).size<1)throw Error('Build artifact missing/empty');
 const version=JSON.parse(fs.readFileSync(path.join(ROOT,'version.json'),'utf8'));
 return {status:'PASS',target:options.target,configuration:options.configuration,durationMs:Date.now()-started,version,artifacts:plan.artifacts,commands:results};
}
module.exports={planBuild,cli};
if(require.main===module)cli().then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error(JSON.stringify({status:'FAIL',error:clean(error.message)}));process.exitCode=1;});
