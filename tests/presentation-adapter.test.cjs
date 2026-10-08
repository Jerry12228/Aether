'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{spawnSync}=require('node:child_process');
test('actual WARP presentation source is labeled software and cleans its resources',()=>{
 const root=path.resolve(__dirname,'..');
 const result=spawnSync(path.join(root,'build/native/Debug/aether_presentation_contract.exe'),[],{cwd:root,encoding:'utf8',windowsHide:true,timeout:15000});
 assert.ifError(result.error);
 assert.equal(result.status,0,result.stdout+result.stderr);
 assert.match(result.stdout,/PASS actual software adapter classification/);
});
