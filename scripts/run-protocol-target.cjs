'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {runGroup,resolveNative}=require('./tool-runner.cjs');
const {hash,root}=require('./build-protocol.cjs');
function options(args){const out={};for(let i=0;i<args.length;i+=2){assert.ok(['--manifest','--budget-seconds'].includes(args[i])&&args[i+1]);out[args[i].slice(2)]=args[i+1];}assert.ok(out.manifest);out.budget=Number(out['budget-seconds']||900)*1000;assert.ok(Number.isInteger(out.budget)&&out.budget>=1000&&out.budget<=1800000);return out;}
async function runTarget(o){
 const manifestFile=path.resolve(root,o.manifest);assert.ok(manifestFile.startsWith(path.join(root,'build')+path.sep));
 const m=JSON.parse(fs.readFileSync(manifestFile,'utf8')),directory=path.resolve(root,m.buildDirectory),began=Date.now(),commands=[];
 for(const f of [...m.sources,...m.artifacts,...m.fec.inputs,...(m.fec.targetConfiguration?.headers||[])])assert.equal(hash(fs.readFileSync(path.join(root,f.file))),f.sha256,'Exact target input drift');
 const record={schema:1,target:m.target,arch:m.arch,sdk:m.sdk,sourceCommit:m.sourceCommit,inputDigest:m.inputDigest,buildManifest:{file:o.manifest,sha256:hash(fs.readFileSync(manifestFile))},runURL:m.runURL,commands,tests:null,exitCode:null,elapsedMs:null,physical:false,synthetic:true};
 async function run(name,exe,args,cleanup=false){const remaining=cleanup?60000:o.budget-(Date.now()-began);assert.ok(remaining>0,'Target run deadline');const r=await runGroup({name,exe:resolveNative(exe),args,cwd:root,timeoutMs:remaining},{root,logDirectory:path.relative(root,path.join(directory,'run-logs'))});const log=path.join(root,r.log);commands.push({...r,output:undefined,executable:exe,args,sha256:hash(fs.readFileSync(log))});assert.equal(r.exitCode,0,`${name}: ${r.output.slice(-4000)}`);assert.ok(fs.statSync(log).size<=16*1024*1024,'Target output byte bound');return fs.readFileSync(log,'utf8').split(/\r?\n/).slice(1,-2).join('\n');}
 let simulator=null;
 try{
  if(['windows','linux','macos'].includes(m.target)){
   const platform={windows:'win32',linux:'linux',macos:'darwin'}[m.target];assert.equal(process.platform,platform);assert.equal(process.arch,m.arch);
   const junit=path.join(directory,'target-ctest.xml');
   await run('ctest','ctest',['--test-dir',directory,'-C',m.configuration,'--output-on-failure','--no-tests=error','--output-junit',junit]);
   const xml=fs.readFileSync(junit,'utf8'),header=xml.match(/<testsuite\b[^>]*>/)[0],number=name=>Number(header.match(new RegExp(`\\b${name}="(\\d+)"`))?.[1]||0);
   const tests=number('tests'),failures=number('failures'),skipped=number('skipped');assert.ok(tests>=12);assert.equal(failures,0);assert.equal(skipped,0);assert.doesNotMatch(xml,/<(?:failure|skipped)\b/);
   record.tests={tests,passed:tests,failed:0,skipped:0,cancelled:0,junit:{file:path.relative(root,junit).replaceAll('\\','/'),sha256:hash(fs.readFileSync(junit))}};
   if(m.target==='macos')for(const f of m.artifacts){await run('arch-'+path.basename(f.file),'lipo',['-archs',path.join(root,f.file)]);await run('load-'+path.basename(f.file),'otool',['-l',path.join(root,f.file)]);}
  }else if(m.target==='ios'&&m.sdk==='iphonesimulator'){
   assert.equal(process.platform,'darwin');assert.equal(process.arch,m.arch);
   const available=JSON.parse(await run('simulators','xcrun',['simctl','list','--json']));
   const runtime=available.runtimes.filter(r=>r.isAvailable&&r.identifier.includes('.iOS-')).sort((a,b)=>a.version.localeCompare(b.version,undefined,{numeric:true})).at(-1);assert.ok(runtime,'Actual available iOS runtime required');
   const version=runtime.version.split('.').map(Number),encoded=(version[0]*65536)+(version[1]||0)*256+(version[2]||0);
   const device=available.devicetypes.find(d=>d.productFamily==='iPhone'&&Number(d.minRuntimeVersion||0)<=encoded&&Number(d.maxRuntimeVersion||0xffffffff)>=encoded);assert.ok(device,'Compatible iPhone device type required');
   simulator=(await run('simulator-create','xcrun',['simctl','create','Aether-Phase06-'+process.pid,device.identifier,runtime.identifier])).trim();assert.match(simulator,/^[0-9A-F-]{36}$/i);
   record.destination={uuid:simulator,runtime:runtime.identifier,runtimeVersion:runtime.version,deviceType:device.identifier,owned:true};
   await run('simulator-boot','xcrun',['simctl','boot',simulator]);await run('simulator-ready','xcrun',['simctl','bootstatus',simulator,'-b']);
   const result=path.join(directory,'ProtocolContract.xcresult');assert.ok(!fs.existsSync(result),'A fresh result bundle is required');
   await run('xctest','xcodebuild',['test','-project',path.join(directory,'AetherProtocol.xcodeproj'),'-scheme','ProtocolContract','-configuration',m.configuration,'-destination','id='+simulator,'-parallel-testing-enabled','NO','-resultBundlePath',result,'CODE_SIGNING_ALLOWED=NO']);
   const summary=JSON.parse(await run('xcresult-summary','xcrun',['xcresulttool','get','test-results','summary','--path',result]));
   assert.ok(summary.totalTestCount>=37);assert.equal(summary.failedTests,0);assert.equal(summary.skippedTests,0);assert.equal(summary.passedTests,summary.totalTestCount);
   record.tests={tests:summary.totalTestCount,passed:summary.passedTests,failed:summary.failedTests,skipped:summary.skippedTests,cancelled:0,xcresult:path.relative(root,result).replaceAll('\\','/')};
  }else throw Error('Matching Android runtime runner is required; a build is insufficient');
  record.exitCode=0;
 }catch(error){record.exitCode=1;record.error=error.message;throw error;}
 finally{
  if(simulator){for(const action of ['shutdown','delete']){try{await run('simulator-'+action,'xcrun',['simctl',action,simulator],true);}catch(error){record.cleanupError=error.message;record.exitCode=1;}}}
  record.elapsedMs=Date.now()-began;fs.writeFileSync(path.join(directory,'protocol-run.json'),JSON.stringify(record,null,2)+'\n');
 }
 assert.equal(record.exitCode,0);console.log(JSON.stringify({target:m.target,arch:m.arch,tests:record.tests,elapsedMs:record.elapsedMs}));return record;
}
module.exports={options,runTarget};
if(require.main===module)runTarget(options(process.argv.slice(2))).catch(e=>{console.error(e.stack);process.exitCode=1;});
