'use strict';
// Test-only adb transport. The existing recovery assertions still inspect
// product output; no operation is simulated in this adapter.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {PassThrough}=require('node:stream'),{EventEmitter}=require('node:events');
const assert=require('node:assert/strict'),net=require('node:net');
const active=process.env.AETHER_PROTOCOL_ADB_REMOTE;
const adb=process.env.AETHER_PROTOCOL_ADB,serial=process.env.AETHER_ADB_SERIAL;
if(active){assert.match(active,/^\/data\/local\/tmp\/aether-phase06-[a-f0-9]{12}-\d+$/);assert.ok(path.isAbsolute(adb)&&fs.existsSync(adb));assert.match(serial,/^[\w.:-]+$/);}
const owned=new Map();
function command(args,timeout=5000){const r=cp.spawnSync(adb,['-s',serial,...args],{windowsHide:true,shell:false,encoding:'utf8',timeout,maxBuffer:1024*1024});assert.equal(r.status,0,r.stderr||r.stdout);return r.stdout.replaceAll('\r','');}
function native(exe,args,folder){
 const remote=folder?owned.get(path.resolve(folder))?.remote:active;
 assert.ok(remote,'Owned fixture required');
 const convert=value=>{value=String(value);if(folder&&value.startsWith(path.resolve(folder)))value=remote+value.slice(path.resolve(folder).length).replaceAll('\\','/');assert.match(value,/^[\w./,-]+$/);return value;};
 const binary=path.basename(exe).replace(/\.exe$/,'');assert.match(binary,/^aether_(protocol_tracer|protocol_control_host|protocol_control_client|media_security)$/);
 return 'LD_LIBRARY_PATH='+active+' ./'+binary+' '+args.map(convert).join(' ');
}
function receipt(output){
 const lines=output.replaceAll('\r','').split('\n'),codes=lines.filter(l=>/^AETHER_NATIVE_EXIT=\d+$/.test(l));assert.equal(codes.length,1,'Actual guest exit receipt required');
 return {status:Number(codes[0].split('=')[1]),stdout:lines.filter(l=>!/^AETHER_NATIVE_EXIT=\d+$/.test(l)&&!l.startsWith('WARNING: linker: ')).join('\n'),stderr:lines.filter(l=>l.startsWith('WARNING: linker: ')).join('\n')};
}
function syncFixture(folder){
 folder=path.resolve(folder);let info=owned.get(folder);
 if(!info){assert.match(path.basename(folder),/^(case-|multistream-)[\w-]+$/);info={remote:active+'/recovery-'+path.basename(folder),clients:0,processes:[],hashes:new Map()};owned.set(folder,info);command(['shell','mkdir','-p',info.remote]);}
 for(const name of fs.readdirSync(folder))if(/^(host\.(key|pem)|client\.(key|pem)|trust\.pem|scenario\.bin|request\.bin|provider\.bin|actions\.bin|a\.bin|b\.bin)$/.test(name)){
  const file=path.join(folder,name),bytes=fs.readFileSync(file),digest=require('node:crypto').createHash('sha256').update(bytes).digest('hex');
  if(info.hashes.get(name)!==digest){command(['push',file,info.remote+'/'+name]);info.hashes.set(name,digest);}
 }
 return info;
}
function spawnSync(exe,args,options={}){
 const folder=args.includes('--fixture')?args[args.indexOf('--fixture')+1]:null;if(folder)syncFixture(folder);
 const r=cp.spawnSync(adb,['-s',serial,'shell','cd '+active+'; '+native(exe,args,folder)+'; aether_exit=$?; echo AETHER_NATIVE_EXIT=$aether_exit; exit $aether_exit'],{windowsHide:true,shell:false,encoding:'utf8',timeout:options.timeout||5000,maxBuffer:1024*1024});assert.ok(!r.error&&r.signal===null);const raw=r.stdout+r.stderr;
 const parsed=receipt(raw);assert.ok(r.status===0||r.status===parsed.status,'ADB exit differs from actual guest receipt');return {...parsed,raw};
}
function child(exe,args,folder,name,deadline=15000,onState){
 const proxy=new EventEmitter();proxy.stdout=new PassThrough();proxy.stderr=new PassThrough();proxy.pid=null;proxy.exitCode=null;
 const info=syncFixture(folder),isControlHost=path.basename(exe).startsWith('aether_protocol_control_host'),isHost=isControlHost||(args.includes('--role')&&args[args.indexOf('--role')+1]==='host');if(!isHost)++info.clients;
 let wrapper,raw='',pending='',observerError,closed=false,timer,poll,guestPid=null;
 proxy.kill=()=>{if(closed)return;if(guestPid)try{command(['shell','kill',String(guestPid)]);}catch{}if(wrapper)wrapper.kill();};
 const done=new Promise((resolve,reject)=>{
  const finish=(code,error)=>{if(closed)return;closed=true;clearTimeout(timer);clearInterval(poll);proxy.exitCode=code;fs.writeFileSync(path.join(folder,name+'.log'),raw);if(error||observerError)reject(error||observerError);else resolve({pid:guestPid,code,raw});proxy.emit('close',code);};
  const line=l=>{
   if(l.startsWith('AETHER_NATIVE_PID=')){guestPid=Number(l.slice(18));assert.ok(Number.isInteger(guestPid)&&guestPid>0);proxy.pid=guestPid;return;}
   if(l.startsWith('AETHER_NATIVE_EXIT='))return;
   if(l.startsWith('WARNING: linker: ')){assert.ok(l.startsWith('WARNING: linker: '+active+'/')&&/unsupported flags DT_FLAGS_1=0x8000001$/.test(l));proxy.stderr.write(l+'\n');return;}if(l.startsWith('{')){const nativeState=JSON.parse(l);if(nativeState.kind==='ready')assert.equal(nativeState.pid,guestPid);}
   proxy.stdout.write(l+'\n');
   if(onState&&l.startsWith('{')){const state=JSON.parse(l);if(state.kind==='ready')assert.equal(state.pid,guestPid,'Native process differs from shell PID receipt');if(state.kind==='control-state')try{onState(state,guestPid);syncFixture(folder);}catch(error){observerError=error;proxy.kill();}}
  };
  const shell='cd '+active+'; '+native(exe,args,folder)+' & aether_pid=$!; echo AETHER_NATIVE_PID=$aether_pid; wait $aether_pid; aether_exit=$?; echo AETHER_NATIVE_EXIT=$aether_exit; exit $aether_exit';
  wrapper=cp.spawn(adb,['-s',serial,'shell',shell],{windowsHide:true,shell:false,stdio:['ignore','pipe','pipe']});
  info.processes.push(proxy);timer=setTimeout(()=>{observerError=Error('Owned Android native child deadline');proxy.kill();},deadline);
  wrapper.stdout.on('data',bytes=>{raw+=bytes;pending+=bytes;assert.ok(raw.length<=1024*1024,'Native output bound');let i;while((i=pending.indexOf('\n'))>=0){const l=pending.slice(0,i).replaceAll('\r','');pending=pending.slice(i+1);try{line(l);}catch(error){observerError=error;proxy.kill();}}});
  wrapper.stderr.on('data',bytes=>{raw+=bytes;proxy.stderr.write(bytes);});wrapper.on('error',error=>finish(1,error));
  wrapper.on('close',()=>{try{
   if(pending.trim())line(pending.replaceAll('\r',''));const r=receipt(raw);assert.ok(guestPid,'Observed native guest PID required');if(isControlHost){const actual=raw.match(/HOST pid=(\d+)/);assert.ok(actual,'Actual native host PID summary required');assert.equal(Number(actual[1]),guestPid);}
   if(!isHost&&--info.clients===0)command(['shell','touch',info.remote+'/client-done']);finish(r.status);
  }catch(error){finish(1,error);}});
  if(isControlHost)poll=setInterval(()=>{for(const name of ['ready','ready2']){
   // The shared host publishes ready before ready2. Preserve that ordering
   // across separate adb observations so ready2 implies both local ports.
   if(name==='ready2'&&!fs.existsSync(path.join(folder,'ready')))break;
   if(!fs.existsSync(path.join(folder,name))){try{const output=command(['shell','cat',info.remote+'/'+name]);if(/^\d+\s*$/.test(output)&&Number(output)>0&&Number(output)<65536)fs.writeFileSync(path.join(folder,name),output.trim());}catch{}}
  }},20);
 });done.catch(()=>{});return {p:proxy,done};
}
function cleanup(){for(const [folder,info]of owned){for(const p of info.processes)if(p.exitCode===null)p.kill();assert.ok(info.remote.startsWith(active+'/recovery-'));assert.match(info.remote.slice((active+'/recovery-').length),/^(case-|multistream-)[\w-]+$/);command(['shell','rm','-rf',info.remote]);owned.delete(folder);}}
module.exports={active,child,spawnSync,cleanup,createRelay};
module.exports.releaseMedia=folder=>{const info=owned.get(path.resolve(folder));assert.ok(info);assert.ok(info.remote.startsWith(active+'/'));assert.match(info.remote.slice(active.length),/^\/recovery-multistream-[\w-]+$/);const output=command(['shell','touch '+info.remote+'/submit-host && touch '+info.remote+'/submit-client; aether_exit=$?; echo AETHER_BARRIER_EXIT=$aether_exit; exit $aether_exit']);assert.equal(output.trim(),'AETHER_BARRIER_EXIT=0','Both owned native submissions must be released together');};
module.exports.makeCertificates=folder=>{const info=syncFixture(folder);for(const name of ['host','client']){
 const shell='cd '+active+'; OPENSSL_CONF=/dev/null LD_LIBRARY_PATH='+active+' ./openssl req -x509 -newkey ED25519 -noenc -keyout '+info.remote+'/'+name+'.key -out '+info.remote+'/'+name+'.pem -subj /CN=aether-'+name+'.local -addext subjectAltName=DNS:aether-'+name+'.local -days 1 -config /dev/null; aether_exit=$?; echo AETHER_NATIVE_EXIT=$aether_exit; exit $aether_exit';
 const r=cp.spawnSync(adb,['-s',serial,'shell',shell],{windowsHide:true,shell:false,encoding:'utf8',timeout:20000,maxBuffer:65536});assert.ok(!r.error&&r.signal===null);assert.equal(receipt(r.stdout+r.stderr).status,0,'Actual pinned guest OpenSSL certificate generation');
 for(const extension of ['key','pem'])command(['pull',info.remote+'/'+name+'.'+extension,path.join(folder,name+'.'+extension)]);
}};


let relaySequence=0;
function createRelay(){
 const relay=new EventEmitter();relay.nativeFaults=true;let port=null,forward=null,wrapper,channel,raw='',pending='',ended=false,closed=false,exit=null,closeCallback;const waits=new Map();
 const control=packet=>{assert.ok(packet.length>0&&packet.length<=1500);const h=Buffer.alloc(6);h.writeUInt32BE(packet.length,2);channel.write(Buffer.concat([h,packet]));};
 const wait=kind=>new Promise((resolve,reject)=>{assert.ok(!waits.has(kind));const timer=setTimeout(()=>{waits.delete(kind);reject(Error('Native relay '+kind+' deadline'));},3000);waits.set(kind,{resolve:row=>{clearTimeout(timer);waits.delete(kind);resolve(row);},reject});});
 relay.configure=async(host,client,scenario,seed)=>{const modes=['happy','loss-video1','cross-stream','wrong-direction','tamper-high-sequence','replay','fec-happy','fec-threshold','fec-beyond','fec-tamper-repair','fec-cross-role','fec-reorder-replay','fec-late','fec-queue','fec-domain-tamper','fec-burst','fec-fresh-epoch','fec-stale-epoch','fec-contract'];const mode=modes.indexOf(scenario)+1;assert.ok(mode>0);const b=Buffer.alloc(16);b.write('ABCF');b.writeUInt16BE(host,4);b.writeUInt16BE(client,6);b.writeUInt32BE(mode,8);seed=mode===17?seed:Buffer.alloc(0);assert.ok(Buffer.isBuffer(seed));b.writeUInt32BE(seed.length,12);const waiting=wait('configured');control(Buffer.concat([b,seed]));await waiting;};
 relay.snapshot=async()=>{const waiting=wait('stats');control(Buffer.from('ABST'));return(await waiting).detail;};
 const fail=error=>{relay.emit('error',error);if(channel)channel.destroy();if(wrapper&&wrapper.exitCode===null&&wrapper.signalCode===null)wrapper.kill();};
 const finish=()=>{if(!ended||!closed)return;try{if(forward)command(['forward','--remove','tcp:'+forward]);assert.equal(active?receipt(raw).status:exit,0,'Native relay cleanup failed');if(closeCallback)closeCallback();}catch(error){if(closeCallback)closeCallback(error);else fail(error);}};
 relay.address=()=>({port});relay.send=()=>{throw Error('Native fault engine owns packet forwarding');};
 relay.bind=(requested,address,callback)=>{assert.equal(requested,0);assert.equal(address,'127.0.0.1');if(!active)assert.equal(process.platform,'darwin');
  const id=++relaySequence,exe=active?adb:path.join(process.env.AETHER_PROTOCOL_BUILD,'aether_protocol_udp_bridge'),args=active?['-s',serial,'shell','cd '+active+'; ./aether_protocol_udp_bridge; aether_exit=$?; echo AETHER_NATIVE_EXIT=$aether_exit; exit $aether_exit']:[];
  wrapper=cp.spawn(exe,args,{windowsHide:true,shell:false,stdio:['ignore','pipe','pipe']});const timer=setTimeout(()=>fail(Error('Owned relay deadline')),20000);
  wrapper.stdout.on('data',bytes=>{pending+=bytes;try{assert.ok(pending.length<65536&&raw.length<65536);let e;while((e=pending.indexOf('\n'))>=0){const line=pending.slice(0,e).replaceAll('\r','');pending=pending.slice(e+1);if(line.startsWith('{')){const row=JSON.parse(line);if(row.kind==='seed'){assert.match(row.hex,/^[a-f0-9]+$/);relay.seed=Buffer.from(row.hex,'hex');assert.ok(relay.seed.length<=1500);raw+=JSON.stringify({kind:'seed',bytes:relay.seed.length,sha256:require('node:crypto').createHash('sha256').update(relay.seed).digest('hex'),redacted:true})+'\n';continue;}
    if(row.kind==='ready'){assert.ok(row.pid>0);if(!active)assert.equal(row.pid,wrapper.pid,'Actual local native relay PID');relay.nativePid=row.pid;port=row.detail.udpPort;let connectionPort=row.detail.controlPort;if(active){const output=command(['forward','tcp:0','tcp:'+connectionPort]);assert.match(output.trim(),/^\d+$/);forward=Number(output.trim());connectionPort=forward;}channel=net.connect({host:'127.0.0.1',port:connectionPort},callback);channel.on('error',fail);}else if(waits.has(row.kind)){assert.equal(row.pid,relay.nativePid);waits.get(row.kind).resolve(row);}}
    raw+=line+'\n';}}catch(error){fail(error);}});
  wrapper.stderr.on('data',bytes=>{raw+=bytes;});wrapper.on('error',fail);wrapper.on('close',code=>{exit=code;closed=true;clearTimeout(timer);const dir=process.env.AETHER_PROTOCOL_RELAY_LOGS||path.join(process.env.AETHER_PROTOCOL_BUILD,'run-logs/native-relays');assert.ok(path.isAbsolute(dir));fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'relay-'+id+'.log'),raw);finish();});
 };
 relay.close=callback=>{ended=true;closeCallback=callback;if(channel)channel.end();else if(wrapper&&wrapper.exitCode===null&&wrapper.signalCode===null)wrapper.kill();finish();};return relay;
}
