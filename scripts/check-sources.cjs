'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const {resolveNative,flutterCommand,runGroup,clean}=require('./tool-runner.cjs');
const ROOT=path.resolve(__dirname,'..');
function hash(file){return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');}
function parsePub(text){
 text=text.replace(/\r/g,'');
 const records=new Map();for(const match of text.matchAll(/^  ([a-zA-Z0-9_]+):\r?\n([\s\S]*?)(?=^  [a-zA-Z0-9_]+:|^sdks:|$(?![\s\S]))/gm)){
  const body=match[2];if(!/^    source: hosted$/m.test(body.replace(/\r/g,'')))continue;
  records.set(match[1],{version:body.match(/^    version: "?([^"\r\n]+)"?$/m)?.[1],sha256:body.match(/^      sha256: "?([a-f0-9]{64})"?$/m)?.[1]});
 }return records;
}
function validatePub(root,lock){
 const parsed=parsePub(fs.readFileSync(path.join(root,'pubspec.lock'),'utf8'));
 if(parsed.size!==49||lock.pub.packages.length!==49||lock.pub.hostedCount!==49)throw Error('Hosted dependency inventory drift');
 for(const record of lock.pub.packages){
  if(!/^[a-zA-Z0-9_]+$/.test(record.name)||!/^\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.]+)?$/.test(record.version))throw Error('Invalid locked package identity');
  const actual=parsed.get(record.name);
  if(!actual||actual.version!==record.version||actual.sha256!==record.sha256)throw Error('Pub package/version/archive digest drift: '+record.name);
  if(record.archiveUrl!==`https://pub.dev/api/archives/${record.name}-${record.version}.tar.gz`||!['BSD-3-Clause','BSD-2-Clause','MIT','Apache-2.0'].includes(record.license))throw Error('Unreviewed dependency source/license');
  const license=path.join(root,'docs','phase02','dependency-licenses',`${record.name}-${record.version}.LICENSE`);
  if(!fs.existsSync(license)||hash(license)!==record.licenseSha256)throw Error('Dependency license drift: '+record.name);
 }return parsed.size;
}
function validateCi(root,lock){
 const workflow=fs.readFileSync(path.join(root,'.github/workflows/windows.yml'),'utf8');
 const actions=[...workflow.matchAll(/uses:\s*([^\s]+)\s/g)].map(match=>match[1]);
 if(actions.length!==2||actions[0]!==`actions/checkout@${lock.ci.actions.checkout.sha}`||actions[1]!==`actions/upload-artifact@${lock.ci.actions.uploadArtifact.sha}`||actions.some(value=>!/@[a-f0-9]{40}$/.test(value)))throw Error('Unreviewed CI action source/pin');
 for(const required of ['pull_request:','branches: [main]','workflow_dispatch:','contents: read','persist-credentials: false','submodules: false','-Scope All -Automation',"@('Helios','Selene')","@('Debug','Release')",'windows-2025-vs2026','if: always()'])if(!workflow.includes(required))throw Error('Mandatory CI coverage/permission missing');
 if(/secrets\.|pull_request_target/.test(workflow))throw Error('Unreviewed privileged CI');
 return actions.length;
}
function validateStatic(root=ROOT){
 const lock=JSON.parse(fs.readFileSync(path.join(root,'toolchains.lock.json'),'utf8'));
 if(!/^[a-f0-9]{40}$/.test(lock.flutter.frameworkRevision)||!/^[a-f0-9]{40}$/.test(lock.flutter.engineRevision)||!/^https:\/\/storage.googleapis.com\/flutter_infra_release\/releases\//.test(lock.flutter.archiveUrl)||!/^[a-f0-9]{64}$/.test(lock.flutter.archiveSha256))throw Error('Flutter source/archive lock malformed');
 if(lock.generator.version!=='21.0.0'||lock.generator.libclang.sha256!=='b13ec96d9a036d6c6c36dd09e00415ead7acc7fcfd40e721bf33ea86b3490f9d')throw Error('Unreviewed generator/toolchain selection');
 if(hash(path.join(root,'docs/phase02/dependency-licenses/libclang-18.1.1.LICENSE'))!==lock.generator.libclang.licenseSha256)throw Error('Generator license drift');
 const hosted=validatePub(root,lock);
 validateCi(root,lock);
 const sources=[];for(const folder of ['native','apps','packages']){
  function visit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   if(['build','.dart_tool','ephemeral','.git'].includes(entry.name))continue;
   const file=path.join(dir,entry.name);if(entry.isSymbolicLink())throw Error('Unreviewed product source symlink');
   if(entry.isDirectory())visit(file);else if(/\.(cpp|h|cc|dart|cmake)$/.test(entry.name)||entry.name==='CMakeLists.txt')sources.push(file);
  }}visit(path.join(root,folder));
 }
 sources.push(path.join(root,'CMakeLists.txt'));
 for(const file of sources){const text=fs.readFileSync(file,'utf8');if(/(?:references[\\/]upstream|\.\.[\\/].*references[\\/])/i.test(text))throw Error('Research dependency in product source');}
 if(fs.existsSync(path.join(root,'.gitmodules')))throw Error('Unreviewed submodules');
 const tracked=cp.spawnSync(resolveNative('git'),['ls-files','-z'],{cwd:root,encoding:'utf8',windowsHide:true});if(tracked.status!==0)throw Error('Tracked-input inventory failed');
 const names=new Set(tracked.stdout.split('\0'));
 for(const file of JSON.parse(fs.readFileSync(path.join(root,'docs','phase02','SCAFFOLD-INVENTORY.json'),'utf8'))){if(!names.has(file)||!fs.existsSync(path.join(root,file)))throw Error('Missing tracked runner input: '+file);}
 return {hosted,sourceFiles:sources.length,lock};
}
async function cli(argv=process.argv.slice(2)){
 if(argv.length!==1||argv[0]!=='--check')throw Error('Use --check');
 const observed=validateStatic();
 const generated=cp.spawnSync(resolveNative('pwsh'),['-NoProfile','-File',path.join(ROOT,'scripts','prepare-generator.ps1')],{cwd:ROOT,encoding:'utf8',timeout:360000,windowsHide:true,maxBuffer:65536});
 if(generated.status!==0)throw Error(clean(generated.stderr||generated.stdout||'Generator prerequisite failed'));
 const prerequisites=JSON.parse(generated.stdout),temporary=path.join(ROOT,'build','source-check','bindings.dart');fs.mkdirSync(path.dirname(temporary),{recursive:true});
 const command=flutterCommand(ROOT,['analyze']);
 const result=await runGroup({name:'binding-drift',exe:command.exe,args:['run',path.join(ROOT,'scripts','generate-bindings.dart'),temporary],cwd:ROOT,timeoutMs:60000,env:{...process.env,LIBCLANG_PATH:prerequisites.libclangPath,LIBCLANG_INCLUDE_DIRS:prerequisites.includes}},{root:ROOT});
 if(result.exitCode!==0)throw Error('Binding generation failed: '+result.log);
 const normalize=value=>value.replace(/\r\n/g,'\n');
 if(normalize(fs.readFileSync(temporary,'utf8'))!==normalize(fs.readFileSync(path.join(ROOT,'packages','selene_native','lib','src','core_bindings.g.dart'),'utf8')))throw Error('Generated binding drift');
 const version=cp.spawnSync(process.execPath,[path.join(ROOT,'scripts','version.cjs'),'--check'],{cwd:ROOT,encoding:'utf8',windowsHide:true,timeout:10000});if(version.status!==0)throw Error('Generated version drift');
 return {status:'PASS',hosted:observed.hosted,sourceFiles:observed.sourceFiles,generator:'ffigen 21 / audited libclang 18.1.1',version:'version.json',mutation:'temporary artifacts only'};
}
module.exports={hash,parsePub,validatePub,validateCi,validateStatic,cli};
if(require.main===module)cli().then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error(JSON.stringify({status:'FAIL',error:clean(error.message)}));process.exitCode=1;});
