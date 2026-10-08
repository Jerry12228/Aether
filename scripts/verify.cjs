'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {resolveNative,flutterCommand,runGroup,validateTests,clean}=require('./tool-runner.cjs');
const ROOT=path.resolve(__dirname,'..');
function requireArtifacts(root,scope){
 if(!['Core','UI','All'].includes(scope))throw Error('Invalid verification scope');
 const files=[];
 if(scope!=='UI')for(const config of ['Debug','Release'])files.push(`build/native/${config}/aether_core.dll`);
 if(scope!=='Core')for(const config of ['Debug','Release'])files.push(`build/native/${config}/helios.exe`);
 if(scope!=='Core')for(const config of ['Debug','Release'])files.push(`apps/selene/build/windows/x64/runner/${config}/selene.exe`,`apps/selene/build/windows/x64/runner/${config}/aether_core.dll`);
 for(const file of files){const full=path.join(root,file);if(!fs.existsSync(full)||!fs.statSync(full).isFile()||fs.statSync(full).size<1)throw Error('Required built artifact missing/empty: '+file);}
 return files;
}
function groups(scope,root=ROOT){
 const node=(name,args,tests=false,timeoutMs=120000)=>({name,exe:process.execPath,args,cwd:root,tests,timeoutMs});
 const ps=(name,file,args=[],tests=false,timeoutMs=180000)=>({name,exe:resolveNative('pwsh'),args:['-NoProfile','-File',path.join(root,'scripts',file),...args],cwd:root,tests,timeoutMs});
 const result=[];
 if(scope==='All'){
  result.push(node('source-check',['scripts/check-sources.cjs','--check'],false,420000));
  result.push(node('platform-check',['scripts/check-platforms.cjs','--check']));
  result.push(node('planning-check',['scripts/validate-planning.cjs']));
  result.push(node('tool-baseline-tests',['--test','--test-reporter=tap',...['baseline-features','baseline-sources','doctor','planning','build-tools','platform-contract'].map(name=>`tests/${name}.test.cjs`)],true,240000));
  result.push({name:'flutter-analyze',...flutterCommand(root,['analyze','--no-pub']),timeoutMs:180000});
 }
 // Explicit test-only targets consume the already-built DLL/product configs.
 for(const config of ['Debug','Release'])result.push({name:`test-targets-${config}`,exe:resolveNative('cmake'),args:['--build','--preset',`windows-core-${config.toLowerCase()}`,'--target',...(scope==='UI'?[]:['aether_core_contract']),...(scope==='Core'?[]:['aether_helios_test','aether_helios_signal'])],cwd:root,timeoutMs:180000});
 if(scope==='All')result.push(node('native-tracer-fixture',['--test','--test-reporter=tap','tests/core-tracer.test.cjs'],true));
 if(scope!=='UI')for(const config of ['Debug','Release'])for(const suite of ['Tracer','Lifecycle','Adapters'])result.push(ps(`core-${suite}-${config}`,'check-core.ps1',['-Suite',suite,'-Configuration',config],true));
 if(scope!=='Core'){
  for(const suite of ['Panel','Lifecycle'])result.push(ps(`ui-${suite}`,'check-ui.ps1',['-Suite',suite,'-Automation'],true,600000));
  for(const config of ['Debug','Release'])result.push(ps(`helios-${config}`,'check-helios.ps1',['-Configuration',config,'-Automation'],true));
  result.push(node('binary-versions',['scripts/check-binary-versions.cjs']));
 }
 return result;
}
async function cli(argv=process.argv.slice(2)){
 let scope='All',automation=false,checkout=false;
 for(let i=0;i<argv.length;i++){
  if(argv[i]==='--scope'&&i+1<argv.length)scope=argv[++i];
  else if(argv[i]==='--automation')automation=true;
  else if(argv[i]==='--clean-checkout')checkout=true;
  else throw Error('Unknown/missing verification option');
 }
 if(!['Core','UI','All'].includes(scope))throw Error('Invalid verification scope');
 if(checkout){if(scope!=='All')throw Error('Clean checkout requires All');return require('./clean-checkout.cjs').run(ROOT);}
 const files=requireArtifacts(ROOT,scope),started=Date.now(),results=[];
 for(const spec of groups(scope)){
  process.stdout.write(`RUN ${spec.name}\n`);
  const result=await runGroup(spec,{root:ROOT});
  let tests=null,guardError=null;
  if(result.exitCode===0&&spec.tests){try{tests=validateTests(result.output);}catch(error){guardError=error.message;}}
  results.push({...result,output:undefined,tests,guardError});
  process.stdout.write(`${result.exitCode===0&&!guardError?'PASS':'FAIL'} ${spec.name} ${result.durationMs}ms ${result.log}\n`);
 }
 const status=results.every(row=>row.exitCode===0&&!row.guardError)?'PASS':'FAIL';
 const report={status,scope,automation,version:JSON.parse(fs.readFileSync(path.join(ROOT,'version.json'),'utf8')),durationMs:Date.now()-started,results,artifacts:files.map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,file))).digest('hex')}))};
 fs.mkdirSync(path.join(ROOT,'artifacts','phase02','tooling'),{recursive:true});
 fs.writeFileSync(path.join(ROOT,'artifacts','phase02','tooling',`verify-${scope}.json`),JSON.stringify(report,null,2)+'\n');
 if(status!=='PASS')process.exitCode=1;return report;
}
module.exports={requireArtifacts,groups,cli};
if(require.main===module)cli().then(report=>console.log(JSON.stringify(report))).catch(error=>{console.error(JSON.stringify({status:'FAIL',error:clean(error.message)}));process.exitCode=1;});
