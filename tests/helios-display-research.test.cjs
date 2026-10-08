'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('research entry point rejects machine actions and extra flags without writing output',()=>{
 const output=path.join(root,'artifacts/phase03/derived-research');
 const listing=()=>fs.existsSync(output)?fs.readdirSync(output).sort():[];
 const before=listing();
 for(const args of [[],['--install'],['--restart'],['--shutdown'],['--prepare-unsigned-research','--install']]){
  const result=spawnSync(process.execPath,[path.join(root,'scripts/prepare-helios-display-research.cjs'),...args],{cwd:root,encoding:'utf8',timeout:5000,windowsHide:true});
  assert.equal(result.status,2,result.error?.message||result.stderr);
  assert.equal(result.stdout,'');
  assert.match(result.stderr,/Usage:/);
 }
 assert.deepEqual(listing(),before);
});
