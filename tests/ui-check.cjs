'use strict';
const fs=require('node:fs'),path=require('node:path');
const {flutterCommand,runGroup,clean}=require('../scripts/tool-runner.cjs');
const root=path.resolve(__dirname,'..');
const suite=process.argv[2]; if(!['Panel','Lifecycle'].includes(suite))throw Error('Suite must be Panel or Lifecycle');
const logs=path.join(root,'artifacts','phase02','ui');fs.mkdirSync(logs,{recursive:true});
let count=0;
async function run(name,args,timeoutMs=120000){
 const result=await runGroup({name:`${suite}-${name}`,...flutterCommand(root,args),timeoutMs,env:{...process.env,AETHER_ENABLE_TEST_HOOKS:'1',AETHER_TEST_FAULTS:'1',AETHER_ARTIFACT_DIR:logs}},{root,logDirectory:'artifacts/phase02/ui'});
 if(result.exitCode!==0)throw Error(`${name} exit=${result.exitCode} log=${result.log}\n${result.output.slice(-3000)}`);
 if(args[0]==='test'){
  const passed=result.output.match(/\+(\d+): All tests passed!/);
  if(!passed||+passed[1]<1||/skipped/i.test(result.output))throw Error('Missing/empty/skipped UI tests');
  count+=+passed[1];
 }
 console.log(`PASS ${suite}/${name} duration_ms=${result.durationMs} log=${result.log}`);
}
async function main(){
await run('build',['build','windows','--debug','--no-pub']);
await run('widget',['test','--no-pub','test/native_panel_test.dart','--reporter=expanded']);
await run('engine',['test','--no-pub','-d','windows','integration_test/native_panel_test.dart','--reporter=expanded']);
if(suite==='Lifecycle'){
 await run('close-build',['build','windows','--debug','--no-pub','--dart-define=AETHER_CLOSE_TEST=true']);
 const binary=path.join(root,'apps','selene','build','windows','x64','runner','Debug','selene.exe');
 const closed=await runGroup({name:'window-close',exe:binary,args:[],cwd:root,timeoutMs:7000,env:{...process.env,AETHER_TEST_FAULTS:'1'}},{root,logDirectory:'artifacts/phase02/ui'});
 const output=closed.output;
 if(closed.exitCode!==0||!output.includes('close_ready')||!output.includes('liveSources: 0')||!output.includes('handles=0 threads=0')||output.includes('close_timeout'))throw Error('Actual window-close barrier failed: '+output);
 count++;
 console.log('PASS actual WM_CLOSE repeated with in-flight native work; zero render resources');
 await run('restore-normal',['build','windows','--debug','--no-pub']);
}
console.log(`PASS ${suite}/mandatory tests=${count}`);
}
main().catch(error=>{console.error(clean(error.message));process.exitCode=1;});
