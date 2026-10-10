'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'build/phase06/windows-x64');
const manifestFile = path.join(directory, 'target-manifest-Debug.json');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

async function prepare() {
  const base = path.join(root, 'build/phase06/dependencies');
  fs.mkdirSync(base, {recursive:true});
  const audit = {schema:1, status:'sources-audited-not-built', observedAt:new Date().toISOString(), dependencies:[]};
  for (const [name, repo, tag, expected] of [
    ['openssl','openssl/openssl','openssl-3.5.9','603f5602e2eef00d77fbd429d34dcd5822bb301757a1bc9cdb24c670f1eb859a'],
    ['libsrtp','cisco/libsrtp','v2.8.0','031bf6c0b38c02c3425bf8b4a24386f953ec4ab3df203adb6c22234d2a63f1ba']]) {
    const json = async url => {const r = await fetch(url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);return r.json();};
    const release = await json(`https://api.github.com/repos/${repo}/releases/tags/${tag}`);
    let ref = await json(`https://api.github.com/repos/${repo}/git/ref/tags/${tag}`);
    while (ref.object.type === 'tag') ref = await json(ref.object.url);
    assert.equal(ref.object.type,'commit');
    const sha = ref.object.sha;
    assert.equal(sha,name==='openssl'?'45e844fa2a14ec92d146bd8f5778ac130b6625fb':'24b3bf8f19b6f5ab4cd2bcceb4f4064efca86fd5','Official tag changed');
    const url = name === 'openssl' ? release.assets.find(a=>a.name===`${tag}.tar.gz`).browser_download_url : `https://api.github.com/repos/${repo}/tarball/${sha}`;
    const archive = path.join(base,`${name}-${sha}.tar.gz`);
    if (!fs.existsSync(archive)) {
      const r = await fetch(url,{signal:AbortSignal.timeout(120000)});assert.equal(r.status,200,url);
      const bytes = Buffer.from(await r.arrayBuffer());assert.ok(bytes.length>10000&&bytes.length<80*1024*1024);
      if(expected) assert.equal(digest(bytes),expected);
      fs.writeFileSync(archive,bytes);
    }
    const archiveSha256 = digest(fs.readFileSync(archive));
    if(expected) assert.equal(archiveSha256,expected);
    const source = path.join(base,name);
    if(!fs.existsSync(source)) {
      fs.mkdirSync(source);
      const r = cp.spawnSync('tar',['-xzf',archive,'--strip-components=1','-C',source],{shell:false,windowsHide:true,timeout:60000,encoding:'utf8'});
      assert.equal(r.status,0,r.stderr);
    }
    const notices = [];
    function walk(dir) {for(const e of fs.readdirSync(dir,{withFileTypes:true})) {const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/^(LICENSE|COPYING|NOTICE|AUTHORS|README)([._-]|$)/i.test(e.name))notices.push({path:path.relative(source,p).replaceAll('\\','/'),sha256:digest(fs.readFileSync(p)),bytes:fs.statSync(p).size});}}
    walk(source);
    assert.ok(notices.some(n=>/^LICENSE/.test(n.path)&&n.bytes>100));
    audit.dependencies.push({name,repo,tag,sourceSha:sha,url,archiveSha256,source,notices,license:name==='openssl'?'Apache-2.0':'BSD-3-Clause',internalDependencies:name==='openssl'?['bundled provider implementations; external zlib disabled']:['OpenSSL backend; bundled AES/SHA test and utility source']});
  }
  fs.writeFileSync(path.join(base,'audit.json'),JSON.stringify(audit,null,2)+'\n');
  console.log(JSON.stringify(audit,null,2));
}

function buildOpenSSL() {
  const base = path.join(root,'build/phase06/dependencies');
  const audit=JSON.parse(fs.readFileSync(path.join(base,'audit.json'),'utf8'));
  assert.equal(audit.dependencies[0].archiveSha256,'603f5602e2eef00d77fbd429d34dcd5822bb301757a1bc9cdb24c670f1eb859a');
  const installer=path.join(process.env['ProgramFiles(x86)'],'Microsoft Visual Studio/Installer/vswhere.exe');
  const vs=cp.spawnSync(installer,['-latest','-products','*','-property','installationPath'],{encoding:'utf8',shell:false,windowsHide:true});
  assert.equal(vs.status,0);
  const dev=path.join(vs.stdout.trim(),'Common7/Tools/VsDevCmd.bat');assert.ok(fs.existsSync(dev));
  for(const p of [root,dev]) assert.ok(!/[\r\n%&|<>^!]/.test(p));
  const batch=path.join(base,'build-openssl.cmd');
  const prefix=path.join(base,'openssl-install').replaceAll('\\','/');
  const options=['VC-WIN64A','no-shared','no-tests','no-module','no-asm','no-zlib','no-comp','no-legacy','no-quic',`--prefix=${prefix}`];
  fs.writeFileSync(batch,`@echo off\r\ncall "${dev}" -arch=x64 -host_arch=x64 >NUL\r\nif errorlevel 1 exit /b 1\r\ncd /d "${path.join(base,'openssl')}"\r\nperl Configure ${options.map(v=>'"'+v+'"').join(' ')}\r\nif errorlevel 1 exit /b 1\r\nnmake /nologo build_sw\r\nif errorlevel 1 exit /b 1\r\nnmake /nologo install_sw\r\nexit /b %errorlevel%\r\n`);
  fs.mkdirSync(path.join(root,'artifacts/phase06'),{recursive:true});
  const fd=fs.openSync(path.join(root,'artifacts/phase06/openssl-build.log'),'w');
  const start=Date.now();
  const r=cp.spawnSync(path.join(process.env.SystemRoot,'System32/cmd.exe'),['/d','/c',batch],{shell:false,windowsHide:true,timeout:900000,stdio:['ignore',fd,fd]});
  fs.closeSync(fd);assert.equal(r.status,0,r.error?.message||'See openssl-build.log');
  audit.dependencies[0].build={options,elapsedMs:Date.now()-start,exitCode:r.status};
  fs.writeFileSync(path.join(base,'audit.json'),JSON.stringify(audit,null,2)+'\n');
  console.log(JSON.stringify(audit.dependencies[0].build));
}
if(process.argv.includes('--prepare')) prepare().catch(e=>{console.error(e);process.exitCode=1;});
else if(process.argv.includes('--build-openssl')) buildOpenSSL();
else if(process.argv.includes('--manifest')) {
  const [binary,configuration,out]=process.argv.slice(process.argv.indexOf('--manifest')+1);
  assert.ok(path.resolve(out).startsWith(path.join(root,'build')+path.sep));
  const library=path.join(path.dirname(binary),'aether_protocol.dll');
  const dependencies=['libssl.lib','libcrypto.lib'].map(name=>{const p=path.join(root,'build/phase06/dependencies/openssl-install/lib',name);return {name,sha256:digest(fs.readFileSync(p))};});
  const manifest={schema:1,target:'aether_protocol_tracer',configuration,binary,sha256:digest(fs.readFileSync(binary)),library,librarySha256:digest(fs.readFileSync(library)),dependencies,
    sources:['native/protocol/CMakeLists.txt','native/protocol/include/aether/protocol.h','native/protocol/src/protocol.cpp','native/protocol/tools/tracer.cpp'].map(file=>({file,sha256:digest(fs.readFileSync(path.join(root,file)))}))};
  fs.writeFileSync(path.join(out,`target-manifest-${configuration}.json`),JSON.stringify(manifest,null,2)+'\n');
} else {
  function loadTarget() {
    assert.ok(fs.existsSync(manifestFile),'Build the audited protocol tracer first');
    const m=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
    assert.equal(m.configuration,'Debug');assert.equal(m.target,'aether_protocol_tracer');
    assert.equal(digest(fs.readFileSync(m.binary)),m.sha256);assert.equal(digest(fs.readFileSync(m.library)),m.librarySha256);
    for(const s of m.sources)assert.equal(digest(fs.readFileSync(path.join(root,s.file))),s.sha256,'Source drift');
    return m;
  }
  let fixture;
  function certificates() {
    if(fixture)return fixture;
    const base=path.join(root,'build/phase06/fixtures');fs.mkdirSync(base,{recursive:true});
    fixture=fs.mkdtempSync(path.join(base,'tracer-'));
    const openssl=path.join(root,'build/phase06/dependencies/openssl-install/bin/openssl.exe');
    for(const [id,hostname] of [['host','aether-host.local'],['client','aether-client.local'],['untrusted','aether-client.local']]) {
      const r=cp.spawnSync(openssl,['req','-x509','-newkey','ED25519','-noenc','-keyout',path.join(fixture,id+'.key'),'-out',path.join(fixture,id+'.pem'),'-subj','/CN='+hostname,'-addext','subjectAltName=DNS:'+hostname,'-days','1'],{encoding:'utf8',shell:false,windowsHide:true,timeout:5000,env:{...process.env,OPENSSL_CONF:'NUL'}});
      assert.equal(r.status,0,'Test-only certificate generation failed');
    }
    fs.writeFileSync(path.join(fixture,'trust.pem'),Buffer.concat(['host','client'].map(id=>fs.readFileSync(path.join(fixture,id+'.pem')))));
    return fixture;
  }
  function child(binary,args) {
    const process=cp.spawn(binary,args,{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
    const messages=[];let output='',error='',done=false;
    const waiters=[];
    let resolveClose,rejectClose;
    const closed=new Promise((resolve,reject)=>{resolveClose=resolve;rejectClose=reject;});
    const timer=setTimeout(()=>{process.kill();rejectClose(Error('Owned tracer exceeded five-second deadline'));},5000);
    process.stdout.on('data',chunk=>{
      output+=chunk.toString();if(output.length>65536){process.kill();rejectClose(Error('Output limit'));return;}
      let newline;while((newline=output.indexOf('\n'))>=0){const line=output.slice(0,newline).trim();output=output.slice(newline+1);if(!line)continue;
        try {messages.push(JSON.parse(line));for(const w of waiters)if(messages.some(m=>m.kind===w.kind))w.resolve(messages.find(m=>m.kind===w.kind));}catch{process.kill();rejectClose(Error('Invalid native evidence'));}
      }
    });
    process.stderr.on('data',b=>{error=(error+b.toString()).slice(-4096);});
    process.on('error',rejectClose);process.on('close',code=>{done=true;clearTimeout(timer);resolveClose({code,messages,error,pid:process.pid});for(const w of waiters)w.reject(Error('Child closed before '+w.kind));});
    return {process,closed,wait:kind=>{const m=messages.find(m=>m.kind===kind);if(m)return Promise.resolve(m);if(done)return Promise.reject(Error('Closed'));return new Promise((resolve,reject)=>waiters.push({kind,resolve,reject}));}};
  }
  const cases=[
    {name:'different native processes exchange authenticated control and protected UDP media',scenario:'happy',wire:'41455448000c010200010002',expected:0},
    {name:'version set ordering leaves selection unchanged',scenario:'happy',wire:'41455448000c010200020001',expected:0},
    {name:'untrusted client receives no stream or sink',scenario:'wrong-trust',wire:'41455448000a01010001',expected:21},
    {name:'changed host identity is rejected',scenario:'wrong-identity',wire:'41455448000a01010001',clientExpected:22,expected:21},
    {name:'read permission denial cannot grant a stream',scenario:'wrong-permission',wire:'41455448000a01010001',expected:23},
    {name:'no common version explains the older peer',scenario:'happy',wire:'41455448000a01010003',expected:20},
    {name:'truncated hello is rejected before grant',scenario:'happy',wire:'41455448000c01020001',expected:24},
    {name:'oversized control frame is rejected before allocation/grant',scenario:'happy',wire:'00'.repeat(513),expected:24},
    {name:'unknown required message type is rejected',scenario:'happy',wire:'41455448000a02010001',expected:25},
    {name:'duplicate versions are rejected',scenario:'happy',wire:'41455448000c010200010001',expected:25}
  ];
  for(const spec of cases) test(spec.name,{timeout:10000},async()=>{
    const manifest=loadTarget(),base=certificates(),dir=fs.mkdtempSync(path.join(base,'case-'));
    for(const f of ['host.pem','host.key','client.pem','client.key','untrusted.pem','untrusted.key','trust.pem'])fs.copyFileSync(path.join(base,f),path.join(dir,f));
    fs.writeFileSync(path.join(dir,'request.bin'),Buffer.from(spec.wire,'hex'));
    let host,client;
    const started=Date.now();
    try {
      host=child(manifest.binary,['--role','host','--fixture',dir,'--scenario',spec.scenario]);
      const ready=await host.wait('ready');assert.ok(ready.detail.controlPort>0&&ready.detail.udpPort>0);
      client=child(manifest.binary,['--role','client','--peer',String(ready.detail.controlPort),'--fixture',dir,'--scenario',spec.scenario]);
      const [h,c]=await Promise.all([host.closed,client.closed]);assert.notEqual(h.pid,c.pid);
      const hr=h.messages.find(m=>m.kind==='result'),cr=c.messages.find(m=>m.kind==='result');assert.ok(hr&&cr,JSON.stringify({h,c}));
      assert.equal(hr.detail.status,spec.expected);assert.equal(cr.detail.status,spec.clientExpected??spec.expected);
      if(spec.expected===0){assert.equal(h.code,0);assert.equal(c.code,0);assert.equal(cr.detail.sinkPackets,1);assert.equal(cr.detail.sinkDigest,digest('synthetic-phase06'));assert.equal(hr.detail.grants,1);}
      else {assert.equal(h.code,2);assert.equal(c.code,2);assert.equal(hr.detail.grants,0);assert.equal(cr.detail.grants,0);assert.equal(cr.detail.sinkPackets,0);assert.equal(cr.detail.sinkDigest,'');}
      for(const r of [h,c]){const clean=r.messages.find(m=>m.kind==='clean');assert.ok(clean);assert.equal(clean.detail.sockets,0);assert.equal(clean.detail.threads,0);assert.equal(clean.detail.stopped,true);}
      const evidence=path.join(root,'artifacts/phase06/tracer');fs.mkdirSync(evidence,{recursive:true});
      fs.writeFileSync(path.join(evidence,spec.name.replaceAll(/[^a-zA-Z0-9]+/g,'-')+'.json'),JSON.stringify({schema:1,scenario:spec.scenario,elapsedMs:Date.now()-started,targetSha256:manifest.sha256,sourceHashes:manifest.sources,host:h,client:c,synthetic:true,systemMutation:false},null,2)+'\n');
    } finally {for(const p of [host,client])if(p&&p.process.exitCode===null)p.process.kill();fs.rmSync(dir,{recursive:true,force:true});}
  });
  test.after(()=>{if(fixture)fs.rmSync(fixture,{recursive:true,force:true});});
}
