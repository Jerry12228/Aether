'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {clean}=require('./tool-runner.cjs');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function runAndroid({m,record,run,root,directory,hash}){
 const sdk=process.env.ANDROID_HOME||process.env.ANDROID_SDK_ROOT;assert.ok(sdk,'Actual Android SDK required');
 const adb=path.join(sdk,'platform-tools','adb'+(process.platform==='win32'?'.exe':''));
 const devices=await run('adb-devices',adb,['devices','-l']);record.deviceProbe=devices;
 let serial=process.env.AETHER_ADB_SERIAL,emulator=null,avd=null,remote=null,avdCommand=null,primaryError=null;
 try{
  if(!serial&&(process.env.GITHUB_ACTIONS==='true'||process.env.AETHER_PROTOCOL_EMULATOR==='x64')&&m.arch==='x64'){
   assert.ok(['linux','win32'].includes(process.platform));serial='emulator-5556';assert.ok(!devices.includes(serial),'Owned emulator port is already occupied');
   const manager=path.join(sdk,'cmdline-tools/latest/bin/sdkmanager'),avdManager=path.join(sdk,'cmdline-tools/latest/bin/avdmanager');
   const image=process.platform==='win32'?'system-images;android-26;google_apis;x86_64':'system-images;android-35;google_apis;x86_64';
   if(process.platform==='win32'){const java=process.env.AETHER_JAVA_BIN;assert.ok(java&&path.isAbsolute(java)&&fs.existsSync(java),'Actual native Java executable required');assert.ok(fs.existsSync(path.join(sdk,...image.split(';'))),'Installed local image required');avdCommand={exe:java,args:['-Dcom.android.sdkmanager.toolsdir='+path.join(sdk,'cmdline-tools/latest'),'-classpath',path.join(sdk,'cmdline-tools/latest/lib/avdmanager-classpath.jar'),'com.android.sdklib.tool.AvdManagerCli']};}
   else{await run('android-runtime-install',manager,['emulator',image]);avdCommand={exe:avdManager,args:[]};}
   avd='Aether_Phase06_'+process.pid;process.env.ANDROID_AVD_HOME=path.join(directory,'owned-avd');process.env.ANDROID_USER_HOME=path.join(directory,'owned-android-home');fs.mkdirSync(process.env.ANDROID_AVD_HOME,{recursive:true});fs.mkdirSync(process.env.ANDROID_USER_HOME,{recursive:true});
   await run('android-avd-create',avdCommand.exe,[...avdCommand.args,'create','avd','--force','--name',avd,'--path',path.join(process.env.ANDROID_AVD_HOME,avd+'.avd'),'--package',image,'--device','pixel_2']);
   const exe=path.join(sdk,'emulator','emulator'+(process.platform==='win32'?'.exe':'')),args=['-avd',avd,'-port','5556','-no-window','-no-audio','-no-snapshot','-no-boot-anim','-gpu','swiftshader_indirect'];
   const log=path.join(directory,'run-logs/emulator.log');let outputBytes=0,overflow=false;
   emulator=cp.spawn(exe,args,{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});const owned=emulator;
   const emit=b=>{outputBytes+=b.length;if(outputBytes<=1024*1024)fs.appendFileSync(log,clean(b.toString()));else{overflow=true;owned.kill();}};
   fs.writeFileSync(log,JSON.stringify({executable:exe,args})+'\n');emulator.stdout.on('data',emit);emulator.stderr.on('data',emit);
   let launchError=null;emulator.on('error',e=>{launchError=e;});
   record.destination={serial,avd,owned:true,pid:emulator.pid,image,emulatorSha256:hash(fs.readFileSync(exe))};
   await run('adb-wait',adb,['-s',serial,'wait-for-device'],false,120000);
   let ready=false;for(let i=0;i<90;i++){assert.ok(!launchError&&!overflow&&emulator.exitCode===null,'Owned emulator exited before boot');const boot=await run('adb-boot-'+i,adb,['-s',serial,'shell','getprop','sys.boot_completed']);if(boot.trim()==='1'){ready=true;break;}await pause(2000);}assert.ok(ready,'Actual Android boot deadline');
  }
  assert.ok(serial,'No selected matching adb runtime: supply AETHER_ADB_SERIAL for '+m.arch);assert.match(serial,/^[A-Za-z0-9._:-]+$/);
  const abi={arm32:'armeabi-v7a',arm64:'arm64-v8a',x64:'x86_64'}[m.arch];
  const abilist=(await run('adb-abi',adb,['-s',serial,'shell','getprop','ro.product.cpu.abilist'])).trim();assert.ok(abilist.split(',').includes(abi),'Matching native ABI required');
  const machine=(await run('adb-machine',adb,['-s',serial,'shell','uname','-m'])).trim();assert.ok(m.arch==='x64'?machine==='x86_64':m.arch==='arm64'?machine==='aarch64':['armv7l','armv8l','aarch64'].includes(machine),'CPU architecture differs from native ABI');
  const bridge=(await run('adb-native-bridge',adb,['-s',serial,'shell','getprop','ro.dalvik.vm.native.bridge'])).trim();assert.ok(!bridge||bridge==='0'||m.arch==='x64','A translated app ABI cannot prove standalone native execution');
  const api=Number((await run('adb-api',adb,['-s',serial,'shell','getprop','ro.build.version.sdk'])).trim());assert.ok(api>=21);
  record.destination={...record.destination,serial,abi,abilist,machine,api,nativeBridge:bridge,physical:!serial.startsWith('emulator-')};record.physical=record.destination.physical;
  remote='/data/local/tmp/aether-phase06-'+m.sourceCommit.slice(0,12)+'-'+process.pid;assert.match(remote,/^\/data\/local\/tmp\/aether-phase06-[a-f0-9]{12}-\d+$/);
  await run('adb-owned-create',adb,['-s',serial,'shell','mkdir','-p',remote+'/native/protocol']);
  const files=[...m.artifacts.map(f=>path.join(root,f.file)),path.join(root,m.openssl)];
  for(const file of files)await run('adb-push-'+path.basename(file),adb,['-s',serial,'push',file,remote+'/'+path.basename(file)]);
  await run('adb-root-sentinel',adb,['-s',serial,'push',path.join(root,'native/protocol/CMakeLists.txt'),remote+'/native/protocol/CMakeLists.txt']);
  await run('adb-owned-mode',adb,['-s',serial,'shell','chmod','700',...files.map(f=>remote+'/'+path.basename(f))]);
  const shell=(exe,args=[])=>{for(const arg of [exe,...args])assert.match(arg,/^[\w./,-]+$/,'Native shell argument');return 'cd '+remote+' && LD_LIBRARY_PATH='+remote+' AETHER_OPENSSL_BIN='+remote+'/openssl ./'+exe+' '+args.join(' ');};
  const control=await run('adb-control',adb,['-s',serial,'shell',shell('aether_protocol_control_client',[remote+'/aether_protocol_control_client'])]);
  assert.doesNotMatch(control,/not ok\b/);const counts=[...control.matchAll(/# tests (\d+)/g)];const parentCount=Number(counts.at(-1)?.[1]||0);assert.ok(parentCount>=65);assert.equal((control.match(/two-PID-real-DLL-/g)||[]).length,31);assert.ok(control.includes('owned=0'));
  const cases=[{id:'native-control-31-scenarios',assertions:parentCount}];
  const fixturePid=(await run('adb-control-fixture-owner',adb,['-s',serial,'shell','ls',remote+'/build/phase06/control-fixtures'])).trim();assert.match(fixturePid,/^\d+$/,'One owned control fixture process');
  for(const version of [1,2]){
   const folder=remote+'/legacy-'+version;await run('adb-legacy-'+version+'-create',adb,['-s',serial,'shell','mkdir',folder]);
   for(const name of ['host.pem','host.key','client.pem','client.key','trust.pem'])await run('adb-legacy-'+version+'-'+name,adb,['-s',serial,'shell','cp',remote+'/build/phase06/control-fixtures/'+fixturePid+'/'+name,folder+'/'+name]);
   const request=path.join(directory,'legacy-'+version+'-request.bin');fs.writeFileSync(request,Buffer.from(version===1?'41455448000a01010001':'4145544800110102000100020001000102','hex'));
   await run('adb-legacy-'+version+'-request',adb,['-s',serial,'push',request,folder+'/request.bin']);
   const hostName='adb-legacy-'+version+'-host',hostLog=path.join(directory,'run-logs',hostName+'.log');
   const host=run(hostName,adb,['-s',serial,'shell',shell('aether_protocol_tracer',['--role','host','--fixture',folder,'--scenario','happy','--versions',String(version)])],false,10000).then(output=>({output}),error=>({error}));
   let ready=null;const deadline=Date.now()+4000;
   while(!ready&&Date.now()<deadline){if(fs.existsSync(hostLog)){const row=fs.readFileSync(hostLog,'utf8').split(/\r?\n/).find(l=>l.startsWith('{"kind":"ready"'));if(row)ready=JSON.parse(row);}if(!ready)await pause(10);}
   if(!ready){await host;throw Error('Actual legacy '+version+' host readiness deadline');}
   let clientOutput;try{clientOutput=await run('adb-legacy-'+version+'-client',adb,['-s',serial,'shell',shell('aether_protocol_tracer',['--role','client','--fixture',folder,'--scenario','happy','--versions',String(version),'--peer',String(ready.detail.controlPort)])],false,10000);}catch(error){await host;throw error;}
   const peer=await host;if(peer.error)throw peer.error;
   const parse=output=>output.split(/\r?\n/).filter(l=>l.startsWith('{"kind":')).map(JSON.parse),clientRows=parse(clientOutput),hostRows=parse(peer.output);
   const clientReady=clientRows.find(r=>r.kind==='ready');assert.ok(Number.isInteger(ready.pid)&&Number.isInteger(clientReady?.pid));assert.notEqual(ready.pid,clientReady.pid,'Actual separate Android native PIDs');
   for(const rows of [clientRows,hostRows]){const result=rows.find(r=>r.kind==='result'),clean=rows.find(r=>r.kind==='clean');assert.equal(result?.detail.status,0);assert.equal(result.detail.selectedVersion,version);assert.equal(result.detail.grants,1);assert.equal(clean?.detail.sockets,0);assert.equal(clean.detail.threads,0);assert.equal(clean.detail.queueBytes,0);}
   const received=clientRows.find(r=>r.kind==='result').detail;if(version===1){assert.equal(received.sinkPackets,1);assert.ok(received.sinkDigest);}else{assert.equal(received.streams.length,2);for(const stream of received.streams)assert.ok(stream.received>0);}
   cases.push({id:'legacy-'+version+'-secure-two-native-PID',assertions:version===1?16:17,hostPid:ready.pid,clientPid:clientReady.pid});
  }
  for(const mode of ['fec-golden','rollover','nonce-exhaustion','high-sequence','role-key-epoch','unchanged-retransmission']){const result=JSON.parse((await run('adb-security-'+mode,adb,['-s',serial,'shell',shell('aether_media_security',[mode])])).trim());assert.deepEqual(result,{ok:true,case:mode});cases.push({id:mode,assertions:1});}
  const vectors=JSON.parse(fs.readFileSync(path.join(root,'protocol/vectors.json'),'utf8'));assert.ok(vectors.wire.length>=15);
  for(let i=0;i<vectors.wire.length;i++){const v=vectors.wire[i],result=JSON.parse((await run('adb-vector-'+i,adb,['-s',serial,'shell',shell('aether_protocol_tracer',['--role','parse','--wire',v.hex,'--versions',v.local.join(',')])])).trim());assert.deepEqual(result,v.expected,v.id);cases.push({id:v.id,assertions:3});}
  const v=vectors.cryptographicKnownAnswers[0],kat=JSON.parse((await run('adb-aes-kat',adb,['-s',serial,'shell',shell('aether_protocol_tracer',['--role','kat','--key',v.key,'--iv',v.iv,'--plaintext',v.plaintext])])).trim());assert.deepEqual(kat,{ciphertext:v.ciphertext,tag:v.tag});cases.push({id:'AES-256-GCM-KAT',assertions:2});
  record.tests={tests:cases.length,passed:cases.length,failed:0,skipped:0,cancelled:0,cases,assertions:cases.reduce((n,c)=>n+c.assertions,0)};
  record.coverageGaps=['Android full multistream fault relay and 60 recovery cases remain unexecuted'];
  throw Error('Actual Android native checks passed, but mandatory multistream/recovery coverage remains incomplete');
 }catch(error){primaryError=error;throw error;}finally{
  const cleanupErrors=[];
  if(remote)try{await run('adb-owned-remove',adb,['-s',serial,'shell','rm','-rf',remote],true);}catch(e){cleanupErrors.push(e.message);}
  if(emulator){try{await run('adb-owned-emulator-stop',adb,['-s',serial,'emu','kill'],true);}catch(e){cleanupErrors.push(e.message);}finally{if(emulator.exitCode===null){emulator.kill();await Promise.race([new Promise(resolve=>emulator.once('close',resolve)),pause(5000)]);if(emulator.exitCode===null){emulator.kill('SIGKILL');cleanupErrors.push('Owned emulator required forced termination');}}}const log=path.join(directory,'run-logs/emulator.log');record.emulatorLog={file:path.relative(root,log).replaceAll('\\','/'),sha256:hash(fs.readFileSync(log))};}
  if(avd)try{assert.ok(path.resolve(process.env.ANDROID_AVD_HOME).startsWith(path.resolve(root,'build')+path.sep),'Owned AVD deletion boundary');await run('android-avd-delete',avdCommand.exe,[...avdCommand.args,'delete','avd','--name',avd],true);}catch(e){cleanupErrors.push(e.message);}
  if(cleanupErrors.length){record.cleanupErrors=cleanupErrors;if(!primaryError)throw Error(cleanupErrors.join('; '));}
 }
}
module.exports={runAndroid};
