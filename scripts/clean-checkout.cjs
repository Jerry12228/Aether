'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const {resolveNative,runGroup}=require('./tool-runner.cjs');
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function owned(parent,target){
 const resolvedParent=fs.realpathSync(parent),resolved=fs.realpathSync(target);
 if(!resolved.toLowerCase().startsWith((resolvedParent+path.sep).toLowerCase())||resolved===resolvedParent||fs.lstatSync(target).isSymbolicLink())throw Error('Checkout cleanup ownership violation');
 return resolved;
}
async function run(root){
 const git=resolveNative('git');
 const read=args=>{const r=cp.spawnSync(git,args,{cwd:root,encoding:'utf8',timeout:30000,windowsHide:true,maxBuffer:1024*1024});if(r.status!==0||r.error)throw Error('Git inventory failed');return r.stdout.trim();};
 if(read(['status','--porcelain','--untracked-files=all']))throw Error('Commit the explicitly reviewed phase inputs before clean verification');
 const commit=read(['rev-parse','HEAD']),parent=path.join(root,'build','clean-checkouts');fs.mkdirSync(parent,{recursive:true});
 if(fs.lstatSync(parent).isSymbolicLink()||!fs.realpathSync(parent).toLowerCase().startsWith((fs.realpathSync(root)+path.sep).toLowerCase()))throw Error('Clean checkout parent escaped workspace');
 const destination=fs.mkdtempSync(path.join(parent,'Aether clean space ')),records=[],started=Date.now();
 const execute=async spec=>{const result=await runGroup(spec,{root,logDirectory:'artifacts/phase02/clean'});records.push({...result,output:undefined});return result.exitCode===0;};
 let success=await execute({name:'clone',exe:git,args:['clone','--no-hardlinks','--no-checkout',root,destination],cwd:root,timeoutMs:120000});
 if(success)success=await execute({name:'checkout',exe:git,args:['checkout','--detach',commit],cwd:destination,timeoutMs:60000});
 if(success&&fs.existsSync(path.join(destination,'references','upstream')))throw Error('Research checkouts must be absent');
 if(success)builds:for(const configuration of ['Debug','Release'])for(const target of ['Helios','Selene']){
  success=await execute({name:`clean-${target}-${configuration}`,exe:process.execPath,args:[path.join(destination,'scripts','build.cjs'),'--target',target,'--configuration',configuration],cwd:destination,timeoutMs:950000});
  if(!success)break builds;
 }
 if(success)success=await execute({name:'clean-verify-All',exe:process.execPath,args:[path.join(destination,'scripts','verify.cjs'),'--scope','All','--automation'],cwd:destination,timeoutMs:1800000});
 const evidenceDirectory=path.join(root,'artifacts','phase02','clean','checkout-artifacts');
 if(fs.existsSync(path.join(destination,'artifacts','phase02')))fs.cpSync(path.join(destination,'artifacts','phase02'),evidenceDirectory,{recursive:true});
 const digests=[];
 function inventory(directory){if(!fs.existsSync(directory))return;for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())inventory(file);else if(entry.isFile()&&file!==path.join(root,'artifacts','phase02','clean','report.json'))digests.push({file:path.relative(root,file),sha256:hash(file),bytes:fs.statSync(file).size});}}
 inventory(path.join(root,'artifacts','phase02','clean'));
 const report={status:success?'PASS':'FAIL',commit,diffSha256:crypto.createHash('sha256').update('').digest('hex'),source:'tracked committed HEAD only; no ignored inputs',directory:path.relative(root,destination),durationMs:Date.now()-started,records,digests,actualVerification:success?JSON.parse(fs.readFileSync(path.join(evidenceDirectory,'tooling','verify-All.json'),'utf8')):null};
 const safe=owned(parent,destination);
 const cleanup=cp.spawnSync(resolveNative('pwsh'),['-NoProfile','-File',path.join(root,'scripts','remove-owned-checkout.ps1'),'-Parent',parent,'-Checkout',safe],{cwd:root,encoding:'utf8',timeout:120000,windowsHide:true});
 if(cleanup.status!==0||fs.existsSync(destination)){report.status='FAIL';report.cleanup='failed; owned checkout retained';}else report.cleanup='deleted verified task-owned checkout after evidence copy';
 fs.writeFileSync(path.join(root,'artifacts','phase02','clean','report.json'),JSON.stringify(report,null,2)+'\n');
 if(report.status!=='PASS')process.exitCode=1;return report;
}
module.exports={run,owned};
