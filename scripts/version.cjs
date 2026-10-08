'use strict';
const fs=require('node:fs'),path=require('node:path');
function outputs(root=path.resolve(__dirname,'..')){
 const v=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
 if(!/^\d+\.\d+\.\d+$/.test(v.productVersion)||!Number.isSafeInteger(v.buildNumber)||v.buildNumber<0||v.abiVersion!==1)throw Error('Invalid product/ABI version');
 const generated=new Map([
 ['build/native/generated/aether_version.h',`// Generated from version.json.\n#pragma once\n#define AETHER_PRODUCT_VERSION "${v.productVersion}"\n#define AETHER_BUILD_NUMBER ${v.buildNumber}\n#define AETHER_ABI_VERSION ${v.abiVersion}\n`],
 ['packages/selene_native/lib/src/version.g.dart',`// Generated from version.json.\nconst aetherProductVersion = '${v.productVersion}';\nconst aetherBuildNumber = ${v.buildNumber};\nconst aetherAbiVersion = ${v.abiVersion};\n`]
 ]);
 for(const name of ['apps/selene/pubspec.yaml','packages/selene_native/pubspec.yaml']){
  const original=fs.readFileSync(path.join(root,name),'utf8');
  if(!/^version:.*$/m.test(original))throw Error(`Missing package version: ${name}`);
  generated.set(name,original.replace(/^version:.*$/m,`version: ${v.productVersion}+${v.buildNumber}`));
 }
 return generated;
}
function generate(mode,root=path.resolve(__dirname,'..')){
 if(!['--write','--check'].includes(mode))throw Error('Use --write or --check');
 for(const [name,text]of outputs(root)){const file=path.join(root,name);if(mode==='--write'){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);}else if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==text)throw Error(`Version drift: ${name}`);}
 return {status:'PASS',source:'version.json'};
}
module.exports={outputs,generate};
if(require.main===module){try{console.log(JSON.stringify(generate(process.argv[2])));}catch(e){console.error(e.message);process.exitCode=1;}}
