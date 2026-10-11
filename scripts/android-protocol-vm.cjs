'use strict';
// Phase06 test-only CPU-emulated Android runtimes, owned by one target runner.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {clean}=require('./tool-runner.cjs');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const digest=(bytes,algorithm='sha256')=>crypto.createHash(algorithm).update(bytes).digest('hex');
const revision='b728a257b2a06f1d18b7349dc2e90bebd013bbd4';
const classicBase='https://android.googlesource.com/platform/prebuilts/android-emulator/+/'+revision+'/';
const images={
 arm32:{url:'https://dl.google.com/android/repository/sys-img/android/armeabi-v7a-21_r04.zip',bytes:187163871,sha1:'8c606f81306564b65e41303d2603e4c42ded0d10',sha256:'4f20bb4abff1fcda7fdde510993d2004b0ca330ae6e7a798ffecc3fbf6d48520',abi:'armeabi-v7a',cpu:'arm',api:21,tag:'default',catalog:'https://dl.google.com/android/repository/sys-img/android/sys-img2-3.xml'},
 arm64:{url:'https://dl.google.com/android/repository/sys-img/google_apis/arm64-v8a-24_r29.zip',bytes:709604485,sha1:'d264adca13330b5e50665ab44726e4fecc1ddd1f',sha256:'9587ca047b0f7334e6fe70380e4f99b3611805e8ab45f46e267d8b858e9a0939',abi:'arm64-v8a',cpu:'arm64',api:24,tag:'google_apis',catalog:'https://dl.google.com/android/repository/sys-img/google_apis/sys-img2-3.xml'},
 x64:{url:'https://dl.google.com/android/repository/sys-img/android/x86_64-24_r08.zip',bytes:419261998,sha1:'f6559e1949a5879f31a9662f4f0e50ad60181684',abi:'x86_64',cpu:'x86_64',api:24,tag:'default',catalog:'https://dl.google.com/android/repository/sys-img/android/sys-img2-3.xml'}
};
async function fetchBytes(url,max){const r=await fetch(url,{signal:AbortSignal.timeout(120000)});assert.equal(r.status,200,url);const chunks=[];let size=0;for await(const chunk of r.body){size+=chunk.length;assert.ok(size<=max,'Owned download size limit');chunks.push(chunk);}return Buffer.concat(chunks);}
async function prepareAndroidVm({sdk,directory,arch,run,record}){
 assert.equal(process.platform,'linux','CI CPU-emulated bootstrap currently requires Linux');assert.equal(process.arch,'x64');const image=images[arch];assert.ok(image);
 const base=path.resolve(directory,'owned-runtime');assert.ok(base.startsWith(path.resolve(process.cwd(),'build')+path.sep));fs.mkdirSync(base,{recursive:true});
 const receipt={schema:1,arch,owned:true,acceleration:'off',physical:false,downloads:[],startedAt:new Date().toISOString()};record.vmPreparation=receipt;
 async function file(url,name,bytes,sha256,sha1){const out=path.join(base,name);let b=fs.existsSync(out)?fs.readFileSync(out):await fetchBytes(url,bytes);assert.equal(b.length,bytes);if(sha256)assert.equal(digest(b),sha256);if(sha1)assert.equal(digest(b,'sha1'),sha1);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,b);receipt.downloads.push({url,file:out,bytes:b.length,sha256:digest(b),officialSha1:sha1||null});return out;}
 let exe;
 if(arch==='arm32'){
  const entries=[['linux-x86_64/emulator64-arm','1cb2247bc5811fcaad25d8df1d9e7282ba5a018e'],['README','3131294d22e8dfe552eb4c668499aa8f297d4a11'],['linux-x86_64/lib64/lib64EGL_translator.so','745513487842605acdda6e46d3d8451aa3837806'],['linux-x86_64/lib64/lib64GLES_CM_translator.so','12966519b9a35f4105457999b1d03b367664d80f'],['linux-x86_64/lib64/lib64GLES_V2_translator.so','fc79cad46ee427d9819b5b1a929895010a4d3e1e'],['linux-x86_64/lib64/lib64OpenglRender.so','a5bdfdda381016230181b405a335ab8235d20936']];
  for(const [name,blob]of entries){const url=classicBase+name+'?format=TEXT',encoded=await fetchBytes(url,64*1024*1024),bytes=Buffer.from(encoded.toString().trim(),'base64');assert.equal(digest(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes]),'sha1'),blob,'Fixed official Git blob');const out=path.join(base,'classic',name);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);fs.chmodSync(out,0o700);receipt.downloads.push({url,commit:revision,blob,file:out,bytes:bytes.length,sha256:digest(bytes)});}
  exe=path.join(base,'classic/linux-x86_64/emulator64-arm');
 }else{
  const zip=await file('https://dl.google.com/android/repository/emulator-linux_x64-10086546.zip','emulator.zip',270166131,'d77e1751b1586a4298e3df4441bcfe5e34b05cdf7f18547876802d8bd4260b02');
  const tools=path.join(base,'tools');fs.mkdirSync(tools,{recursive:true});await run('vm-tool-extract','unzip',['-q','-o',zip,'-d',tools]);exe=path.join(tools,'emulator/emulator');assert.ok(fs.existsSync(exe));
 }
 const zip=await file(image.url,'image.zip',image.bytes,image.sha256,image.sha1),imageRoot=path.join(base,'image');fs.mkdirSync(imageRoot,{recursive:true});await run('vm-image-extract','unzip',['-q','-o',zip,'-d',imageRoot]);
 const imageDir=path.join(imageRoot,image.abi);assert.ok(fs.existsSync(path.join(imageDir,'system.img')));const name='Aether_Phase06_'+arch+'_'+process.pid,avdHome=path.join(base,'avd'),avd=path.join(avdHome,name+'.avd');fs.mkdirSync(avd,{recursive:true});
 const config=['AvdId='+name,'abi.type='+image.abi,'hw.cpu.arch='+image.cpu,'hw.cpu.ncore=2','hw.ramSize='+(arch==='arm32'?1024:2048),'hw.lcd.width=480','hw.lcd.height=800','hw.lcd.density=240','hw.gpu.enabled=no','disk.dataPartition.size=512M','image.sysdir.1='+imageDir+'/','tag.id='+image.tag,'target=android-'+image.api].join('\n')+'\n';
 fs.writeFileSync(path.join(avd,'config.ini'),config);fs.writeFileSync(path.join(avdHome,name+'.ini'),'avd.ini.encoding=UTF-8\npath='+avd+'\ntarget=android-'+image.api+'\n');
 const serial='emulator-5558',adb=path.join(sdk,'platform-tools/adb');const occupied=await run('vm-devices-before',adb,['devices','-l']);assert.ok(!occupied.includes(serial),'Owned serial already occupied');
 const env={...process.env,ANDROID_HOME:sdk,ANDROID_SDK_ROOT:sdk,ANDROID_AVD_HOME:avdHome,ANDROID_USER_HOME:path.join(base,'home'),LD_LIBRARY_PATH:arch==='arm32'?path.join(base,'classic/linux-x86_64/lib64'):process.env.LD_LIBRARY_PATH||''};fs.mkdirSync(env.ANDROID_USER_HOME,{recursive:true});
 const args=['-avd',name,'-port','5558','-no-window','-no-audio','-no-snapshot','-no-boot-anim','-gpu','off',...(arch==='arm32'?[]:['-accel','off']),'-show-kernel'];const log=path.join(directory,'run-logs/owned-emulator.log');fs.writeFileSync(log,JSON.stringify({exe,args})+'\n');
 const processVm=cp.spawn(exe,args,{env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});let launchError=null,bytes=0;processVm.on('error',e=>launchError=e);const emit=b=>{bytes+=b.length;if(bytes<=8*1024*1024)fs.appendFileSync(log,clean(b.toString()));else{launchError=Error('Owned emulator output limit');processVm.kill();}};processVm.stdout.on('data',emit);processVm.stderr.on('data',emit);
 receipt.runtime={serial,name,exe,sha256:digest(fs.readFileSync(exe)),pid:processVm.pid,args,image:{...image},configSha256:digest(Buffer.from(config))};let stopped=false;
 const stop=async()=>{if(stopped)return;stopped=true;try{if(processVm.exitCode===null&&processVm.signalCode===null)await run('vm-owned-stop',adb,['-s',serial,'emu','kill'],true,30000);}finally{if(processVm.exitCode===null&&processVm.signalCode===null){processVm.kill();await Promise.race([new Promise(resolve=>processVm.once('close',resolve)),pause(5000)]);}receipt.stoppedAt=new Date().toISOString();receipt.logSha256=digest(fs.readFileSync(log));fs.writeFileSync(path.join(directory,'android-vm.json'),JSON.stringify(receipt,null,2)+'\n');}};
 try{let ready=false;for(let i=0;i<120;i++){assert.ok(!launchError&&processVm.exitCode===null&&processVm.signalCode===null,'Owned emulator exited before native ABI readiness');try{const abi=(await run('vm-native-ready-'+i,adb,['-s',serial,'shell','getprop','ro.product.cpu.abilist'],false,5000)).trim();if(abi.split(',').includes(image.abi)){ready=true;break;}}catch{}await pause(5000);}assert.ok(ready,'Owned native Android readiness deadline');receipt.nativeReadyAt=new Date().toISOString();
  receipt.frameworkBootCompleted=(await run('vm-framework-boot',adb,['-s',serial,'shell','getprop','sys.boot_completed'])).trim()==='1';if(arch==='arm64')for(let i=0;i<18;i++){assert.ok(!launchError&&processVm.exitCode===null&&processVm.signalCode===null);await pause(5000);}return{serial,stop,destination:receipt.runtime};
 }catch(error){await stop();throw error;}
}
module.exports={prepareAndroidVm};
