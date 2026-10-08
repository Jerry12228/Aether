'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const root=process.cwd();
const {flutterCommand,runGroup}=require(path.join(root,'scripts/tool-runner.cjs'));
test('actual DLL paused observer disposal completes without resume',async()=>{
 const command=flutterCommand(root,['test','--no-pub','test/core_contract_test.dart','--plain-name','Lifecycle: paused external observer cannot block local disposal','--reporter=expanded']);
 const result=await runGroup({...command,name:'paused-observer-witness',cwd:path.join(root,'packages/selene_native'),timeoutMs:60000,env:{...process.env,AETHER_CORE_LIBRARY:path.join(root,'build/native/Debug/aether_core.dll'),AETHER_TEST_SUITE:'Lifecycle'}},{root});
 assert.equal(result.exitCode,0,result.output);
 assert.match(result.output,/\+1: All tests passed!/);
});
