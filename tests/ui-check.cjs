'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {redact}=require('../scripts/doctor.cjs');
function cleanOutput(value){return redact(value).text.replace(/http:\/\/127\.0\.0\.1:\d+\/[^\s]+/g,'<local-debug-endpoint>');}
const root=path.resolve(__dirname,'..');
const suite=process.argv[2]; if(!['Panel','Lifecycle'].includes(suite))throw Error('Suite must be Panel or Lifecycle');
const launcher=(process.env.PATH||'').split(path.delimiter).map(dir=>path.join(dir,'flutter.bat')).find(file=>fs.existsSync(file));
if(!launcher)throw Error('Flutter SDK required');
const bin=path.dirname(launcher),dart=path.join(bin,'cache/dart-sdk/bin/dart.exe'),snapshot=path.join(bin,'cache/flutter_tools.snapshot');
const logs=path.join(root,'artifacts','phase02','ui');fs.mkdirSync(logs,{recursive:true});
function run(name,args,timeout=120000){
 const result=cp.spawnSync(dart,[snapshot,'--suppress-analytics',...args],{cwd:path.join(root,'apps','selene'),env:{...process.env,AETHER_ENABLE_TEST_HOOKS:'1',AETHER_TEST_FAULTS:'1',AETHER_ARTIFACT_DIR:logs},input:'',encoding:'utf8',windowsHide:true,timeout,maxBuffer:2*1024*1024});
 const output=(result.stdout||'')+(result.stderr||'');fs.writeFileSync(path.join(logs,`${suite}-${name}.log`),cleanOutput(output));
 if(result.status!==0||result.error)throw Error(`${name} exit=${result.status} ${result.error?.code||''}\n${redact(output).text.slice(-3000)}`);
 if(args[0]==='test'&&(!/\+[1-9][0-9]*: All tests passed!/.test(output)||/skipped/i.test(output)))throw Error('Missing/empty/skipped UI tests');
 console.log(`PASS ${suite}/${name} log=artifacts/phase02/ui/${suite}-${name}.log`);
}
run('build',['build','windows','--debug','--no-pub']);
run('widget',['test','--no-pub','test/native_panel_test.dart','--reporter=expanded']);
run('engine',['test','--no-pub','-d','windows','integration_test/native_panel_test.dart','--reporter=expanded']);
if(suite==='Lifecycle'){
 run('close-build',['build','windows','--debug','--no-pub','--dart-define=AETHER_CLOSE_TEST=true']);
 const binary=path.join(root,'apps','selene','build','windows','x64','runner','Debug','selene.exe');
 const closed=cp.spawnSync(binary,[],{cwd:root,input:'',encoding:'utf8',windowsHide:true,timeout:7000,env:{...process.env,AETHER_TEST_FAULTS:'1'}});
 const output=(closed.stdout||'')+(closed.stderr||'');fs.writeFileSync(path.join(logs,'window-close.log'),cleanOutput(output));
 if(closed.status!==0||closed.error||!output.includes('close_ready')||!output.includes('liveSources: 0')||!output.includes('handles=0 threads=0')||output.includes('close_timeout'))throw Error('Actual window-close barrier failed: '+redact(output).text);
 console.log('PASS actual WM_CLOSE repeated with in-flight native work; zero render resources');
 run('restore-normal',['build','windows','--debug','--no-pub']);
}
