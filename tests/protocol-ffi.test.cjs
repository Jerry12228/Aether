'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {flutterCommand,runGroup}=require('../scripts/tool-runner.cjs');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifestFile=path.resolve(process.env.AETHER_PROTOCOL_MANIFEST||path.join(root,'build/phase06/windows-x64/target-manifest-Debug.json'));
function checkedInputs(){
 const m=JSON.parse(fs.readFileSync(manifestFile));assert.equal(m.configuration,'Debug');
 for(const x of m.sources)assert.equal(sha(fs.readFileSync(path.resolve(root,x.file))),x.sha256,x.file+' drift');
 assert.equal(sha(fs.readFileSync(m.library)),m.librarySha256,'DLL drift');
 const host=path.join(path.dirname(m.library),'aether_protocol_control_host.exe');assert.ok(fs.existsSync(host));
 const lock=JSON.parse(fs.readFileSync(path.join(root,'toolchains.lock.json')));assert.equal(lock.generator.version,'21.0.0');
 assert.match(fs.readFileSync(path.join(root,'pubspec.lock'),'utf8'),/version: "2\.2\.0"/);
 return {m,host};
}
test('06-04 actual Flutter client loads exact production DLL and uses independent authority PID',{timeout:180000},async()=>{
 const {m,host}=checkedInputs(),base=path.join(root,'build/phase06/ffi-runs');fs.mkdirSync(base,{recursive:true});
 const dir=fs.mkdtempSync(path.join(base,'run-'));
 const openssl=path.join(root,'build/phase06/dependencies/openssl-install/bin/openssl.exe');
 for(const id of ['host','client']){const r=cp.spawnSync(openssl,['req','-x509','-newkey','ED25519','-noenc','-keyout',path.join(dir,id+'.key'),'-out',path.join(dir,id+'.pem'),'-subj','/CN=aether-'+id+'.local','-addext','subjectAltName=DNS:aether-'+id+'.local','-days','1','-config','NUL'],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000});assert.equal(r.status,0,r.stderr);}
 fs.writeFileSync(path.join(dir,'trust.pem'),Buffer.concat(['host','client'].map(id=>fs.readFileSync(path.join(dir,id+'.pem')))));
 const command=flutterCommand(root,['test','--no-pub','--reporter','json','test/protocol_contract_test.dart']);
 const result=await runGroup({...command,name:'flutter-protocol',cwd:path.join(root,'packages/selene_native'),timeoutMs:150000,env:{...process.env,AETHER_PROTOCOL_LIBRARY:m.library,AETHER_PROTOCOL_HOST:host,AETHER_PROTOCOL_FIXTURE:dir,AETHER_PROTOCOL_FFI_SCOPE:process.env.AETHER_PROTOCOL_FFI_SCOPE||'tracer'}},{root,logDirectory:path.relative(root,dir)});
 const log=fs.readFileSync(path.join(root,result.log),'utf8'),messages=[];
 for(const line of log.split(/\r?\n/)){try{messages.push(JSON.parse(line));}catch{}}
 const done=messages.filter(x=>x.type==='testDone'&&!x.hidden);assert.ok(done.length>0,'actual Flutter test count');
 const observations=messages.filter(x=>x.type==='print'&&x.message.startsWith('FFIRESULT ')).map(x=>JSON.parse(x.message.slice(10)));
 fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify({observedAt:new Date().toISOString(),scope:process.env.AETHER_PROTOCOL_FFI_SCOPE||'tracer',...result,output:undefined,tests:done.length,observations,manifestSha256:sha(fs.readFileSync(manifestFile)),librarySha256:m.librarySha256,hostSha256:sha(fs.readFileSync(host)),headerSha256:sha(fs.readFileSync(path.join(root,'native/protocol/include/aether/protocol.h'))),rawLogSha256:sha(fs.readFileSync(path.join(root,result.log)))},null,2)+'\n');
 assert.equal(result.exitCode,0,log.slice(-16000));assert.equal(result.timeout,false);
 assert.ok(done.every(x=>x.result==='success'&&x.skipped===false),'zero failures/skip');
 assert.ok(observations.length>=1,'real PID/socket/cleanup evidence');
 for(const x of observations){assert.notEqual(x.clientPid,x.hostPid);assert.ok(x.port>0&&x.port<65536);assert.equal(x.callbacksAfterDispose,0);assert.match(x.hostSummary,/owned=0/);}
 for(const sentinel of ['AV-CONTENT-SENTINEL','CLIPBOARD-SENTINEL','CREDENTIAL-SENTINEL'])assert.equal(log.includes(sentinel),false,'content leak');
 console.log('FFI evidence '+path.relative(root,path.join(dir,'result.json'))+' tests='+done.length);
});
