'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
try{
 const records=[];
 for(const config of ['Debug','Release'])for(const product of ['Helios','Selene']){
  const binary=product==='Helios'?path.join(root,'build','native',config,'helios.exe'):path.join(root,'apps','selene','build','windows','x64','runner',config,'selene.exe');
  const args=product==='Helios'?['--self-test','--automation']:['--version'];
  const result=cp.spawnSync(binary,args,{cwd:root,input:'',encoding:'utf8',timeout:10000,windowsHide:true,maxBuffer:65536});
  if(result.status!==0||result.error||!result.stdout.includes(version.productVersion)||!result.stdout.includes(`ABI ${version.abiVersion}`))throw Error(`${product}/${config} version probe failed: ${result.stderr||result.stdout||result.error}`);
  records.push({product,config,version:result.stdout.trim()});
 }
 console.log(JSON.stringify({status:'PASS',version,records}));
}catch(error){console.error(error.message);process.exitCode=1;}
