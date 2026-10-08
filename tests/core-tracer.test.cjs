'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),cp=require('node:child_process');
test('real DLL creates a generation token and delivers the native tracer',()=>{
 const binary=path.resolve(__dirname,'../build/native/Debug/aether_core_contract.exe');
 assert.ok(fs.existsSync(binary),'Build the native tracer before this test');
 const result=cp.spawnSync(binary,['tracer'],{encoding:'utf8',timeout:10000,windowsHide:true});
 assert.equal(result.status,0,result.stderr||result.error?.message);
 assert.match(result.stdout,/PASS tracer checks=\d+/);
});
