'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {StringDecoder}=require('node:string_decoder');
const {redact}=require('./doctor.cjs');
function clean(value){return redact(value).text.replace(/http:\/\/127\.0\.0\.1:\d+\/[^\s]+/g,'<local-debug-endpoint>');}
function resolveNative(name){
 for(const dir of (process.env.PATH||'').split(path.delimiter)){
  const candidate=path.resolve(dir,process.platform==='win32'?name+'.exe':name);
  if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile())return candidate;
 }
 throw Error(`Native executable required: ${name}`);
}
function flutterCommand(root,args){
 const allowed=new Set(['build','test','analyze','pub']);
 if(!Array.isArray(args)||!allowed.has(args[0])||args.some(arg=>typeof arg!=='string'||/[\r\n]/.test(arg)))throw Error('Invalid Flutter command');
 const launcher=(process.env.PATH||'').split(path.delimiter).map(dir=>path.join(dir,'flutter.bat')).find(file=>fs.existsSync(file));
 if(!launcher)throw Error('Pinned Flutter SDK missing');
 const bin=path.dirname(launcher),exe=path.join(bin,'cache/dart-sdk/bin/dart.exe'),snapshot=path.join(bin,'cache/flutter_tools.snapshot');
 if(!fs.existsSync(exe)||!fs.existsSync(snapshot))throw Error('Bootstrap the pinned Flutter cached tool first');
 const actual=JSON.parse(fs.readFileSync(path.join(bin,'cache/flutter.version.json'),'utf8'));
 const locked=JSON.parse(fs.readFileSync(path.join(root,'toolchains.lock.json'),'utf8')).flutter;
 if(actual.frameworkRevision!==locked.frameworkRevision||actual.engineRevision!==locked.engineRevision||actual.dartSdkVersion!==locked.dart)throw Error('Flutter framework/engine/Dart drift');
 // Read the .bat location, then call the official cached tool directly. No cmd
 // parser participates, so quoted paths/metacharacters remain argument data.
 return {exe,args:[snapshot,'--suppress-analytics',...args],cwd:path.join(root,'apps','selene')};
}
function validateTests(output){
 if(typeof output!=='string'||!output.trim())throw Error('Empty mandatory test output');
 const node=output.match(/(?:#\s*tests|ℹ tests)\s+(\d+)/);
 const fail=output.match(/(?:#\s*fail|ℹ fail)\s+(\d+)/);
 const skip=output.match(/(?:#\s*skipped|ℹ skipped)\s+(\d+)/);
 const cancelled=output.match(/(?:#\s*cancelled|ℹ cancelled)\s+(\d+)/),todo=output.match(/(?:#\s*todo|ℹ todo)\s+(\d+)/);
 if(node){if(+node[1]<1||!fail||+fail[1]!==0||!skip||+skip[1]!==0||+(cancelled?.[1]||0)>0||+(todo?.[1]||0)>0)throw Error('Missing/failing/skipped mandatory tests');return +node[1];}
 const wrapped=output.match(/PASS (?:Core\/[^\r\n]*|(?:Panel|Lifecycle)\/mandatory) tests=(\d+)/);
 if(wrapped&&+wrapped[1]>0)return +wrapped[1];
 throw Error('Missing mandatory test result');
}
async function runGroup(spec,{root,logDirectory='artifacts/phase02/tooling'}={}){
 if(!path.isAbsolute(spec.exe)||!Array.isArray(spec.args)||spec.args.some(arg=>typeof arg!=='string'||/[\r\n]/.test(arg)))throw Error('Invalid executable/argument array');
 const timeoutMs=spec.timeoutMs??900000;if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>3600000)throw Error('Invalid process budget');
 const directory=path.resolve(root,logDirectory);if(!directory.startsWith(path.resolve(root)+path.sep))throw Error('Logs must stay in workspace');
 fs.mkdirSync(directory,{recursive:true}); const log=path.join(directory,spec.name+'.log');
 if(!/^[a-zA-Z0-9_.-]+$/.test(spec.name))throw Error('Invalid group name');
 const started=Date.now(),file=fs.createWriteStream(log,{flags:'w'});
 file.write(clean(JSON.stringify({executable:spec.exe,args:spec.args,cwd:spec.cwd,timeoutMs}))+'\n');
 return await new Promise(resolve=>{
  let child,tail='',timedOut=false,error=null,finished=false,timer,forcedTimer;
  const decoders={stdout:new StringDecoder('utf8'),stderr:new StringDecoder('utf8')},pending={stdout:'',stderr:''},discarding={stdout:false,stderr:false};
  const line=value=>{const text=clean(value);file.write(text+'\n');tail=(tail+text+'\n').slice(-65536);};
  const cancel=()=>{
   if(!child?.pid||child.exitCode!==null)return;
   if(process.platform==='win32'){
    const killer=cp.spawn(path.join(process.env.SystemRoot||'C:\\Windows','System32','taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    killer.on('error',()=>child.kill());
   }else child.kill('SIGKILL');
   forcedTimer=setTimeout(()=>{child.kill();child.stdout?.destroy();child.stderr?.destroy();finish(null);},2000);
  };
  const finish=code=>{
   if(finished)return;finished=true;clearTimeout(timer);clearTimeout(forcedTimer);
   for(const stream of ['stdout','stderr']){pending[stream]+=decoders[stream].end();if(pending[stream]&&!discarding[stream])line(pending[stream]);}
   const result={name:spec.name,exitCode:timedOut?124:code??1,durationMs:Date.now()-started,timeout:timedOut,error:error?clean(error):null,log:path.relative(root,log),output:tail};
   file.end(JSON.stringify({...result,output:undefined})+'\n',()=>resolve(result));
  };
  try{child=cp.spawn(spec.exe,spec.args,{cwd:spec.cwd||root,env:spec.env||process.env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});}
  catch(failure){error=failure.message;finish(1);return;}
  child.on('error',failure=>{error=failure.message;finish(1);});child.on('close',finish);
  for(const stream of ['stdout','stderr'])child[stream].on('data',chunk=>{
   let decoded=decoders[stream].write(chunk);
   if(discarding[stream]){const end=decoded.indexOf('\n');if(end<0)return;decoded=decoded.slice(end+1);discarding[stream]=false;}
   pending[stream]+=decoded;let newline;
   while((newline=pending[stream].indexOf('\n'))>=0){const complete=pending[stream].slice(0,newline);line(complete.length>65536?'<oversized line omitted>':complete);pending[stream]=pending[stream].slice(newline+1);}
   if(pending[stream].length>65536){line('<oversized line omitted>');pending[stream]='';discarding[stream]=true;}
  });
  timer=setTimeout(()=>{timedOut=true;cancel();},timeoutMs);
 });
}
module.exports={clean,resolveNative,flutterCommand,validateTests,runGroup};
