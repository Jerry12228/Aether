'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'build/phase06/windows-x64');
const manifestFile = process.env.AETHER_PROTOCOL_MANIFEST || path.join(directory, 'target-manifest-Debug.json');
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
async function lockDossier() {
  const base=path.join(root,'build/phase06/dependencies');
  const audit=JSON.parse(fs.readFileSync(path.join(base,'audit.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'references/upstream-lock.json'),'utf8'));
  const features=JSON.parse(fs.readFileSync(path.join(root,'docs/baseline/features.json'),'utf8'));
  const lock={schema:1,status:'candidate-unapproved',nativeReuse:['OpenSSL 3.5.9 static SSL/Crypto','libSRTP 2.8.0 static OpenSSL backend'],researchCodeCopiedOrLinked:[],dependencies:[],baselineRows:[],parity:[],historicalCandidates:[],targets:[]};
  for(const dep of audit.dependencies){
    const notices=dep.notices.filter(n=>/(^|\/)(LICENSE|COPYING|NOTICE)/.test(n.path)).map(n=>({...n,text:fs.readFileSync(path.join(dep.source,n.path),'utf8')}));
    const sources=[];
    const collect=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){if(!['.git','CMakeFiles'].includes(e.name))collect(p);}else if(/\.(c|h|in|cmake|info|pl|pm|conf)$/.test(e.name)||['CMakeLists.txt','Configure','makefile'].includes(e.name)){const bytes=fs.readFileSync(p),prefix=bytes.toString('utf8').slice(0,16384);sources.push({path:path.relative(dep.source,p).replaceAll('\\','/'),sha256:digest(bytes),inlineNotices:[...prefix.matchAll(/\/\*[\s\S]*?\*\/|^(?:#[^\n]*\n)+/gm)].map(m=>m[0]).filter(t=>/copyright|licen[sc]e|redistribution|permission/i.test(t))});}}};
    collect(dep.source);
    const artifacts=dep.name==='openssl'?['lib/libssl.lib','lib/libcrypto.lib','bin/openssl.exe'].map(p=>{const file=path.join(base,'openssl-install',p);return {path:'build/phase06/dependencies/openssl-install/'+p,sha256:digest(fs.readFileSync(file))};}):[{path:'build/phase06/windows-x64/libsrtp/Debug/srtp2.lib',sha256:digest(fs.readFileSync(path.join(directory,'libsrtp/Debug/srtp2.lib')))}];
    lock.dependencies.push({name:dep.name,repo:dep.repo,tag:dep.tag,sourceSha:dep.sourceSha,archiveSha256:dep.archiveSha256,url:dep.url,license:dep.license,notices,sourceFiles:sources,buildOptions:dep.build?.options??['ENABLE_OPENSSL=ON','LIBSRTP_TEST_APPS=ON','ENABLE_WARNINGS_AS_ERRORS=ON','BUILD_SHARED_LIBS=OFF','MSVC_RUNTIME_LIBRARY=MultiThreaded'],targetArtifacts:artifacts,internalDependencies:dep.name==='openssl'?['bundled provider source under Apache-2.0','Text::Template 1.56 build-only (GPL-1.0-or-later OR Artistic-1.0-Perl), not linked','Perl/MSVC existing build tools, not bundled']:dep.internalDependencies});
  }
  const repos=new Map(baseline.repositories.map(r=>[r.name,r]));
  for(const name of ['moonlight-common-c','sunshine','moonlight-qt','moonlight-android','moonlight-ios']){const r=repos.get(name);const result=cp.spawnSync('git',['-C',path.join(root,r.path),'rev-parse','HEAD'],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000});assert.equal(result.status,0);assert.equal(result.stdout.trim(),r.commit);}
  function add(repo,file,line,symbol,group,aetherField,owner,disposition='reconstruct'){
    const r=repos.get(repo),bytes=fs.readFileSync(path.join(root,r.path,file));
    lock.baselineRows.push({repo,sha:r.commit,file,line,sourceSha256:digest(bytes),symbol,group,disposition,aetherField,owner,parityCases:features.features.filter(f=>f.requirementIds.some(id=>group==='input'?['INPUT-01','INPUT-02','GAME-01'].includes(id):group==='audio'?id.startsWith('AUDIO'):group==='video'?id.startsWith('VIDEO'):f.primaryPhase===6)).flatMap(f=>f.caseIds),vector:group==='rtp'?'protocol/vectors.json#media':group==='control'||group==='negotiation'?'protocol/vectors.json#wire':'preserved owner contract; implementation evidence pending'});
  }
  function symbols(repo,file,entries,group,owner){const r=repos.get(repo),lines=fs.readFileSync(path.join(root,r.path,file),'utf8').split(/\r?\n/);for(const [symbol,mapping] of entries){const n=lines.findIndex(l=>l.includes(symbol));assert.ok(n>=0,`${file}:${symbol}`);add(repo,file,n+1,symbol,group,mapping,owner);}}
  symbols('moonlight-common-c','src/RtspConnection.c',[['"DESCRIBE"','DescribeCapabilities'],['"SETUP"','PrepareStream'],['"ANNOUNCE"','ProposalRequest'],['"PLAY"','ConfirmStart'],['"Session"','connection_id'],['"X-SS-Ping-Payload"','authenticated liveness'],['"X-SS-Connect-Data"','authenticated connection context'],['"x-ss-general.encryptionSupported"','mandatory standard protection'],['"x-ss-general.encryptionRequested"','mandatory protection policy']],'negotiation','06-01/06-03');
  const sdp=repos.get('moonlight-common-c'),sdpFile='src/SdpGenerator.c';
  fs.readFileSync(path.join(root,sdp.path,sdpFile),'utf8').split(/\r?\n/).forEach((line,i)=>{for(const match of line.matchAll(/"(x-(?:nv|ss|ml)-[^"\r\n]+)"/g))add('moonlight-common-c',sdpFile,i+1,match[1],'negotiation',/encryption/.test(match[1])?'mandatory TLS/SRTP policy':/fec/i.test(match[1])?'per-stream FEC config':/audio|aqos/.test(match[1])?'audio format/clock/channel capability':/video|vqos|Hevc/.test(match[1])?'named per-stream codec/format/limit capability':'versioned named capability','06-01/06-02/06-03; production media 09-15');});
  for(const [file,group,owner] of [['src/Video.h','video','06-02; 09-15'],['src/Input.h','input','19/23-27'],['src/ControlStream.c','control','06-01/06-03; 19/20']]){
    const lines=fs.readFileSync(path.join(root,sdp.path,file),'utf8').split(/\r?\n/);let structure=null;
    lines.forEach((line,i)=>{const begin=line.match(/^typedef struct (_\w+)/);if(begin)structure=begin[1];else if(structure&&/^}/.test(line))structure=null;else if(structure){const field=line.match(/^\s*(?:unsigned\s+)?(?:char|short|int|bool|u?int\d+_t|netfloat|NV_INPUT_HEADER)\s+(\w+)(?:\[[^\]]*\])?\s*;/);if(field){const isRtp=structure==='_RTP_PACKET';add('moonlight-common-c',file,i+1,structure+'.'+field[1],isRtp?'rtp':group,isRtp?'RTP network-order '+field[1]:group==='input'?'lease-fenced '+structure+'.'+field[1]:'authenticated per-stream '+field[1],owner);}}});
  }
  symbols('moonlight-common-c','src/AudioStream.c',[['ALGORITHM_AES_CBC','SRTP AEAD replaces CBC'],['avRiKeyId + rtp->sequenceNumber','independent direction/stream key and ROC']],'audio','06-02; 11/21');
  symbols('moonlight-common-c','src/Limelight-internal.h',['GENERIC','URGENT','KEYBOARD','MOUSE','PEN','TOUCH','UTF8','GAMEPAD_BASE','SENSOR_BASE'].map(n=>['CTRL_CHANNEL_'+n,'logical priority/channel '+n]),'input','19/23-27');
  symbols('sunshine','src/nvhttp.cpp',[['"rikey"','Phase7 authenticated exporter key establishment'],['"uniqueid"','client_id'],['"appid"','instance/application association'],['"mode"','complete stream proposal']],'management','07/08/18/20');
  symbols('sunshine','src/stream.cpp',[['fec::encode','source/repair FEC before protection'],['video.cipher->encrypt','standard SRTP protect each source/repair']],'video','06-02');
  symbols('sunshine','src/rtsp.cpp',[['server.map("DESCRIBE"','DescribeCapabilities'],['server.map("SETUP"','PrepareStream'],['server.map("ANNOUNCE"','ProposalRequest'],['server.map("PLAY"','ConfirmStart'],['config.packetsize =','per-path datagram limit'],['ENCRYPTION_MODE_MANDATORY','mandatory standard protection']],'negotiation','06-01/06-02/06-03');
  symbols('sunshine','src/config.cpp',['fec_percentage','lan_encryption_mode','wan_encryption_mode','packetsize','ping_timeout'].map(n=>['"'+n+'"','setting.'+n]),'negotiation','06-02/06-03');
  symbols('sunshine','src/config.cpp',[['"port"s, port','setting.port']],'negotiation','06-03');
  symbols('sunshine','src/config.h',['NEVER','OPPORTUNISTIC','MANDATORY'].map(n=>['constexpr int ENCRYPTION_MODE_'+n,'setting encryption disposition in ADR']),'negotiation','06-01/06-03');
  symbols('moonlight-qt','app/streaming/session.cpp',[['LiStartConnection(&hostInfo','Selene native consumer lifecycle'],['m_StreamConfig.audioConfiguration','retained surround capability'],['m_StreamConfig.packetSize','per-path datagram limit']],'consumer','10-16/19; 06-04');
  symbols('moonlight-android','app/src/main/java/com/limelight/nvstream/NvConnection.java',[['context.negotiatedHdr','explicit complete HDR alternative'],['context.negotiatedPacketSize','per-path datagram limit'],['context.streamConfig.getAudioConfiguration().toInt()','named audio channels/clock']],'consumer','14/28-29; 06-04');
  symbols('moonlight-ios','Limelight/Stream/Connection.m',[['_streamConfig.width','per-stream width'],['_streamConfig.height','per-stream height'],['_streamConfig.fps','per-stream fps'],['_streamConfig.bitrate','per-stream bitrate'],['_streamConfig.encryptionFlags','mandatory standard protection'],['_streamConfig.audioConfiguration','retained surround capability'],['LiStartConnection(&_serverInfo','Selene native lifecycle']],'consumer','15/30-33; 06-04');
  lock.parity=features.features.map(f=>({id:f.id,caseIds:f.caseIds,ownerPhase:f.primaryPhase,aetherField:'capability.'+f.id,requirements:f.requirementIds,settings:f.settingIds,conditions:f.conditions,disposition:f.platform==='helios-windows10'&&/hdr/i.test(f.capability)?'not-required-by-R1; original history retained':f.primaryPhase===6?'protocol reconstruction; concrete setting mapping in ADR':'preserved-v1; named capability extension and original phase owner',implementation:'unperformed; prototype is not product support'}));
  for(const [name,repo,sha,files] of [
    ['enet','cgutman/enet','aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1',['LICENSE','include/enet/enet.h']],
    ['nanors','sleepybishop/nanors','b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a',['LICENSE','Makefile','deps/obl/oblas_common.h','deps/obl/oblas_lite.c']]]){
    const observations=[];for(const file of files){const url=`https://raw.githubusercontent.com/${repo}/${sha}/${file}`,r=await fetch(url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);const bytes=Buffer.from(await r.arrayBuffer());observations.push({file,url,sha256:digest(bytes),text:bytes.toString('utf8')});}
    lock.historicalCandidates.push({name,repo,sha,status:'research-only-not-linked',observations});
  }
  for(const target of ['windows-x64','linux','macos','android','ios-device','ios-simulator'])lock.targets.push({target,status:target==='windows-x64'?'Debug-native-run-only':'not-built-not-run',buildContract:target==='windows-x64'?'actual standalone CMake + Node + CTest':target.startsWith('ios')?'pinned source-build; matching iphoneos/iphonesimulator SDK; device library plus independent simulator XCTest':'pinned source-build + matching toolchain/ABI native process run; no Windows device link',physicalEvidence:target.startsWith('ios')||target==='macos'?'VFY-01/02 only physical evidence deferred':'not-performed'});
  lock.windowsManifest={...manifest,binary:path.relative(root,manifest.binary).replaceAll('\\','/'),library:path.relative(root,manifest.library).replaceAll('\\','/')};
  fs.mkdirSync(path.join(root,'protocol'),{recursive:true});fs.writeFileSync(path.join(root,'protocol/dependencies.lock.json'),JSON.stringify(lock,null,2)+'\n');
  console.log(JSON.stringify({dependencies:lock.dependencies.length,baselineRows:lock.baselineRows.length,parityCases:lock.parity.length,historicalCandidates:lock.historicalCandidates.length,status:lock.status}));
}
const dossierMarker='<!-- AETHER-BOUND-EVIDENCE -->';
function readDossier() {
  const adr=fs.readFileSync(path.join(root,'docs/phase06/PROTOCOL-ADR.md'),'utf8');
  const section=adr.slice(adr.indexOf(dossierMarker));
  const match=section.match(/```json\s*([\s\S]*?)\s*```/);
  assert.ok(match,'Missing bound evidence');return JSON.parse(match[1]);
}
function verifyBindings(m,includeLogs=false) {
  assert.equal(m.schema,1);assert.ok(m.materials.length>=8);
  if(m.decision.choice==='approve-concrete') {
    assert.equal(m.status,'approved-concrete');assert.ok(m.decision.rawResponse&&m.decision.recordedAt);
    const archive=path.resolve(root,m.decision.reviewedArchive);assert.ok(archive.startsWith(path.join(root,'build')+path.sep));
    const originalBytes=fs.readFileSync(path.join(archive,'docs/phase06/PROTOCOL-ADR.md'));
    assert.equal(digest(originalBytes),m.decision.reviewedAdrSha256,'Reviewed ADR drift');
    const original=JSON.parse(originalBytes.toString('utf8').split(dossierMarker)[1].match(/```json\s*([\s\S]*?)\s*```/)[1]);
    assert.deepEqual(m.materials,original.materials,'Material drift');assert.deepEqual(m.evidenceManifest,original.evidenceManifest,'Evidence drift');
    assert.equal(m.binarySha256,original.binarySha256);assert.equal(m.librarySha256,original.librarySha256);
    for(const item of [...m.materials,...(includeLogs?m.evidenceManifest:[])]) {
      const file=path.resolve(archive,item.path);assert.ok(file.startsWith(archive+path.sep));
      assert.equal(digest(fs.readFileSync(file)),item.sha256,'Material drift: '+item.path);
    }
    assert.equal(digest(fs.readFileSync(path.join(archive,'build/phase06/windows-x64/Debug/aether_protocol_tracer.exe'))),m.binarySha256);
    assert.equal(digest(fs.readFileSync(path.join(archive,'build/phase06/windows-x64/Debug/aether_protocol.dll'))),m.librarySha256);
    return;
  }
  for(const item of [...m.materials,...(includeLogs?m.evidenceManifest:[])]) {
    const resolved=path.resolve(root,item.path);assert.ok(resolved.startsWith(root+path.sep));
    assert.equal(digest(fs.readFileSync(resolved)),item.sha256,'Material drift: '+item.path);
  }
  const target=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  assert.equal(m.binarySha256,target.sha256);assert.equal(m.librarySha256,target.librarySha256);
  assert.equal(digest(fs.readFileSync(target.binary)),m.binarySha256);
  assert.equal(digest(fs.readFileSync(target.library)),m.librarySha256);
  const lock=JSON.parse(fs.readFileSync(path.join(root,'protocol/dependencies.lock.json'),'utf8'));
  assert.equal(lock.windowsManifest.sha256,m.binarySha256);
  assert.equal(lock.windowsManifest.librarySha256,m.librarySha256);
  for(const dep of lock.dependencies){
    const archive=path.join(root,'build/phase06/dependencies',`${dep.name}-${dep.sourceSha}.tar.gz`);
    assert.equal(digest(fs.readFileSync(archive)),dep.archiveSha256);
    for(const item of dep.sourceFiles)assert.equal(digest(fs.readFileSync(path.join(root,'build/phase06/dependencies',dep.name,item.path))),item.sha256,'Dependency source drift');
    for(const item of dep.targetArtifacts)assert.equal(digest(fs.readFileSync(path.join(root,item.path))),item.sha256);
  }
}
function sealDossier() {
  const adrFile=path.join(root,'docs/phase06/PROTOCOL-ADR.md');
  assert.equal(readDossier().decision.choice,null,'Never reseal or erase an approved historical decision');
  const adr=fs.readFileSync(adrFile,'utf8').split(dossierMarker)[0].trimEnd();
  const target=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  const materials=[...target.sources.map(s=>s.file),'tests/protocol-tracer.test.cjs','protocol/dependencies.lock.json','protocol/vectors.json','docs/PROTOCOL.md'].map(p=>({path:p,sha256:digest(fs.readFileSync(path.join(root,p)))}));
  const dir=path.join(root,'artifacts/phase06/tracer');
  const files=fs.readdirSync(dir).filter(n=>n.endsWith('.json')).map(n=>'artifacts/phase06/tracer/'+n);
  for(const name of ['tracer-final.tap','ctest-final.log'])if(fs.existsSync(path.join(root,'artifacts/phase06',name)))files.push('artifacts/phase06/'+name);
  const evidenceManifest=files.map(p=>{const bytes=fs.readFileSync(path.join(root,p));const e=p.endsWith('.json')?JSON.parse(bytes):null;return {path:p,sha256:digest(bytes),...(e?{elapsedMs:e.elapsedMs,hostPid:e.host?.pid,clientPid:e.client?.pid,synthetic:e.synthetic,systemMutation:e.systemMutation}:{} )};});
  const bound={schema:1,status:'awaiting-real-user-decision',sealedAt:new Date().toISOString(),binarySha256:target.sha256,librarySha256:target.librarySha256,materials,evidenceManifest,decision:{choice:null,rawResponse:null,recordedAt:null,reviewedAdrSha256:null}};
  verifyBindings(bound,true);
  fs.writeFileSync(adrFile,adr+'\n\n'+dossierMarker+'\n## Bound Evidence And Decision\n\nThe following exact bytes are the checkpoint materials. The whole ADR digest is recorded externally in the halted SUMMARY; it cannot hash itself. No approval is inferred from test success.\n\n```json\n'+JSON.stringify(bound,null,2)+'\n```\n');
  console.log(JSON.stringify({adrSha256:digest(fs.readFileSync(adrFile)),materials:materials.length,evidence:evidenceManifest.length,status:bound.status}));
}
if(process.argv.includes('--seal-dossier')) sealDossier();
else if(process.argv.includes('--verify-dossier')) {
  const bound=readDossier();verifyBindings(bound,true);assert.ok(bound.evidenceManifest.length>=14);
  const reportRoot=bound.decision.choice==='approve-concrete'?path.join(root,bound.decision.reviewedArchive):root;
  const report=fs.readFileSync(path.join(reportRoot,'artifacts/phase06/tracer-final.tap'),'utf8');
  for(const [label,count] of [['tests',19],['pass',19],['fail',0],['cancelled',0],['skipped',0],['todo',0]])assert.match(report,new RegExp('(?:#|\u2139) '+label+' '+count+'\\r?\\n'));
  assert.match(fs.readFileSync(path.join(reportRoot,'artifacts/phase06/ctest-final.log'),'utf8'),/100% tests passed out of 9/);
  console.log(JSON.stringify({adrSha256:digest(fs.readFileSync(path.join(root,'docs/phase06/PROTOCOL-ADR.md'))),status:bound.status,materialsVerified:bound.materials.length,evidenceVerified:bound.evidenceManifest.length,tests:19,ctest:9}));
}
else if(process.argv.includes('--prepare')) prepare().catch(e=>{console.error(e);process.exitCode=1;});
else if(process.argv.includes('--build-openssl')) buildOpenSSL();
else if(process.argv.includes('--lock-dossier')) lockDossier().catch(e=>{console.error(e);process.exitCode=1;});
else if(process.argv.includes('--manifest')) {
  const [binary,configuration,out]=process.argv.slice(process.argv.indexOf('--manifest')+1);
  assert.ok(path.resolve(out).startsWith(path.join(root,'build')+path.sep));
  const library=path.join(path.dirname(binary),'aether_protocol.dll');
  const dependencies=['libssl.lib','libcrypto.lib'].map(name=>{const p=path.join(root,'build/phase06/dependencies/openssl-install/lib',name);return {name,sha256:digest(fs.readFileSync(p))};});
  const manifest={schema:1,target:'aether_protocol_tracer',configuration,binary,sha256:digest(fs.readFileSync(binary)),library,librarySha256:digest(fs.readFileSync(library)),dependencies,
    sources:['native/protocol/CMakeLists.txt','native/protocol/include/aether/protocol.h',...fs.readdirSync(path.join(root,'native/protocol/src')).filter(n=>/\.(cpp|h)$/.test(n)).sort().map(n=>'native/protocol/src/'+n),'native/protocol/tools/tracer.cpp'].map(file=>({file,sha256:digest(fs.readFileSync(path.join(root,file)))}))};
  if(fs.existsSync(path.join(root,'docs/phase06/FEC-REUSE-DECISION.json'))){
    const ledger=JSON.parse(fs.readFileSync(path.join(root,'docs/phase06/FEC-ALTERNATIVES.json')));
    manifest.fec={decisionSha256:digest(fs.readFileSync(path.join(root,'docs/phase06/FEC-REUSE-DECISION.json'))),sourceSha:ledger.selected.sourceSha,inputs:ledger.selected.sourceFiles.map(s=>({file:s.path,sha256:s.sha256}))};
    manifest.mediaSecurity={binary:path.join(path.dirname(binary),'aether_media_security.exe'),sources:['tests/native/protocol_media_security.cpp','tests/protocol-multistream.test.cjs']};
    manifest.mediaSecurity.sha256=digest(fs.readFileSync(manifest.mediaSecurity.binary));
    manifest.sources.push(...manifest.mediaSecurity.sources.map(file=>({file,sha256:digest(fs.readFileSync(path.join(root,file)))})));
    for(const name of ['aether_fec.lib','libsrtp/'+configuration+'/srtp2.lib']){const file=path.join(out,name.startsWith('libsrtp/')?name:configuration+'/'+name);dependencies.push({name,file,sha256:digest(fs.readFileSync(file))});}
  }
  fs.writeFileSync(path.join(out,`target-manifest-${configuration}.json`),JSON.stringify(manifest,null,2)+'\n');
} else {
  function loadTarget() {
    assert.ok(fs.existsSync(manifestFile),'Build the audited protocol tracer first');
    const m=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
    assert.equal(m.configuration,process.env.AETHER_PROTOCOL_CONFIGURATION||'Debug');assert.equal(m.target,'aether_protocol_tracer');
    assert.equal(digest(fs.readFileSync(m.binary)),m.sha256);assert.equal(digest(fs.readFileSync(m.library)),m.librarySha256);
    for(const s of m.sources)assert.equal(digest(fs.readFileSync(path.join(root,s.file))),s.sha256,'Source drift');
    return m;
  }
  let fixture;
  function certificates() {
    if(fixture)return fixture;
    const base=path.join(root,'build/phase06/fixtures');fs.mkdirSync(base,{recursive:true});
    fixture=fs.mkdtempSync(path.join(base,'tracer-'));
    const openssl=(process.env.AETHER_OPENSSL_BIN||path.join(root,'build/phase06/dependencies/openssl-install/bin/openssl.exe'));
    for(const [id,hostname] of [['host','aether-host.local'],['client','aether-client.local'],['untrusted','aether-client.local']]) {
      const r=cp.spawnSync(openssl,['req','-x509','-newkey','ED25519','-noenc','-keyout',path.join(fixture,id+'.key'),'-out',path.join(fixture,id+'.pem'),'-subj','/CN='+hostname,'-addext','subjectAltName=DNS:'+hostname,'-days','1'],{encoding:'utf8',shell:false,windowsHide:true,timeout:5000,env:{...process.env,OPENSSL_CONF:process.platform==='win32'?'NUL':'/dev/null'}});
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
    closed.catch(()=>{});
    const timer=setTimeout(()=>{process.kill();const e=Error('Owned tracer exceeded five-second deadline');rejectClose(e);for(const w of waiters)w.reject(e);},5000);
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
    {name:'concurrent stop waits for an in-flight native callback before consumer disposal',scenario:'callback-barrier',wire:'41455448000c010200010002',expected:0,lifecycle:true},
    {name:'complete capability plan requires explicit confirmation and preserves the active stream',scenario:'proposal',wire:'41455448000c010200010002',expected:0,proposal:true},
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
      if(spec.proposal){const p=c.messages.find(m=>m.kind==='proposal-contract');assert.ok(p,'Missing native proposal contract');assert.equal(p.checks,9);assert.equal(p.pendingState.grants,p.finalState.grants);assert.equal(p.pendingState.sinkPackets,p.finalState.sinkPackets);assert.equal(p.pendingState.confirmedProposals,0);assert.equal(p.finalState.confirmedProposals,1);const pending=p.pendingState.proposal;assert.equal(pending.capabilities.length,3);assert.deepEqual(pending.capabilities.map(v=>v.name),['camera','fps','hdr']);assert.deepEqual(pending.capabilities.map(v=>v.availability),[2,1,0]);assert.ok(pending.capabilities.every(v=>v.reason));}
      if(spec.lifecycle){const e=c.messages.find(m=>m.kind==='callback-barrier');assert.ok(e);assert.equal(e.stopStatus,0);assert.equal(e.callbackCompleted,true);assert.ok(e.waitMs>=50&&e.waitMs<2000);}
      const evidence=path.join(root,'artifacts/phase06/tracer');fs.mkdirSync(evidence,{recursive:true});
      fs.writeFileSync(path.join(evidence,spec.name.replaceAll(/[^a-zA-Z0-9]+/g,'-')+'.json'),JSON.stringify({schema:1,scenario:spec.scenario,elapsedMs:Date.now()-started,targetSha256:manifest.sha256,sourceHashes:manifest.sources,host:h,client:c,synthetic:true,systemMutation:false},null,2)+'\n');
    } finally {for(const p of [host,client])if(p&&p.process.exitCode===null)p.process.kill();fs.rmSync(dir,{recursive:true,force:true});}
  });
  test('independent golden vectors and source lock exist and are consumed by the native parser',()=>{
    const vectors=JSON.parse(fs.readFileSync(path.join(root,'protocol/vectors.json'),'utf8'));
    const m=loadTarget();assert.ok(vectors.wire.length>=15);
    for(const v of vectors.wire){const r=cp.spawnSync(m.binary,['--role','parse','--wire',v.hex,'--versions',v.local.join(',')],{encoding:'utf8',shell:false,windowsHide:true,timeout:5000});assert.equal(r.status,0,v.id);assert.deepEqual(JSON.parse(r.stdout),v.expected,v.id);}
    for(const delta of [-1,0,1]){const b=Buffer.alloc(512+delta);Buffer.from('41455448','hex').copy(b);b.writeUInt16BE(b.length,4);b[6]=1;b[7]=1;b.writeUInt16BE(1,8);b.writeUInt16BE(7,10);b.writeUInt16BE(b.length-14,12);const r=cp.spawnSync(m.binary,['--role','parse','--wire',b.toString('hex'),'--versions','1,2'],{encoding:'utf8',shell:false,windowsHide:true,timeout:5000});assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).status,delta===1?24:0);}
  });
  test('actual pinned native crypto matches independent AES-256-GCM known answer',()=>{
    const vectors=JSON.parse(fs.readFileSync(path.join(root,'protocol/vectors.json'),'utf8'));const v=vectors.cryptographicKnownAnswers[0],m=loadTarget();
    const r=cp.spawnSync(m.binary,['--role','kat','--key',v.key,'--iv',v.iv,'--plaintext',v.plaintext],{encoding:'utf8',shell:false,windowsHide:true,timeout:5000});assert.equal(r.status,0);assert.deepEqual(JSON.parse(r.stdout),{ciphertext:v.ciphertext,tag:v.tag});
  });
  test('proposal digest independently binds every identity, capability and request revision',()=>{
    const vectors=JSON.parse(fs.readFileSync(path.join(root,'protocol/vectors.json'),'utf8')),p=vectors.proposal;
    const e=JSON.parse(fs.readFileSync(path.join(root,'artifacts/phase06/tracer/complete-capability-plan-requires-explicit-confirmation-and-preserves-the-active-stream.json'),'utf8'));
    const native=e.client.messages.find(m=>m.kind==='proposal-contract').pendingState.proposal;
    const chunks=[Buffer.from('4150524f500001','hex')];const append=n=>{const b=Buffer.alloc(8);b.writeBigUInt64BE(BigInt(n));chunks.push(b);};
    for(const n of [p.hostId,p.instanceId,p.displayId,p.streamId,p.connectionId,p.clientId,p.configGeneration,p.keyGeneration,p.requestId,p.budgetRevision,p.leaseEpoch,p.expiresMs,p.capabilities.length])append(n);
    for(const c of p.capabilities){append(c.name.length);chunks.push(Buffer.from(c.name));for(const n of [c.availability,c.reason,c.requested,c.available])append(n);}
    assert.equal(native.digest,digest(Buffer.concat(chunks)));assert.deepEqual(native.capabilities.map(c=>c.final),p.capabilities.map(c=>c.final));
  });
  test('an authenticated peer cannot extend the operation deadline by trickling bytes',{timeout:10000},async()=>{
    const m=loadTarget(),dir=certificates(),tls=require('node:tls');let h,socket,timer;
    const started=Date.now();
    try {h=child(m.binary,['--role','host','--fixture',dir,'--scenario','happy']);const ready=await h.wait('ready');
      socket=tls.connect({host:'127.0.0.1',port:ready.detail.controlPort,servername:'aether-host.local',cert:fs.readFileSync(path.join(dir,'client.pem')),key:fs.readFileSync(path.join(dir,'client.key')),ca:fs.readFileSync(path.join(dir,'trust.pem')),minVersion:'TLSv1.3',maxVersion:'TLSv1.3'});
      socket.on('error',()=>{});
      await new Promise((resolve,reject)=>{socket.once('secureConnect',resolve);socket.once('error',reject);});
      const frame=Buffer.from('0000000a41455448000a01010001','hex');let offset=0;timer=setInterval(()=>{if(!socket.destroyed&&offset<frame.length)socket.write(frame.subarray(offset,++offset));},250);
      const result=await h.closed;assert.equal(result.code,2);const e=result.messages.find(v=>v.kind==='result');assert.equal(e.detail.status,11);assert.equal(e.detail.grants,0);assert.equal(result.messages.find(v=>v.kind==='clean').detail.sockets,0);assert.ok(Date.now()-started<3500);
    } finally {clearInterval(timer);socket?.destroy();if(h&&h.process.exitCode===null)h.process.kill();}
  });
  test('the source dossier preserves every original case and exact linked dependency bytes',()=>{
    const lock=JSON.parse(fs.readFileSync(path.join(root,'protocol/dependencies.lock.json'),'utf8'));
    const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/baseline/features.json'),'utf8'));
    assert.equal(lock.status,'candidate-unapproved');assert.deepEqual(lock.researchCodeCopiedOrLinked,[]);
    assert.equal(lock.parity.length,637);assert.deepEqual(lock.parity.map(p=>p.id),baseline.features.map(p=>p.id));
    assert.deepEqual(lock.parity.flatMap(p=>p.caseIds),baseline.features.flatMap(p=>p.caseIds));
    assert.ok(lock.baselineRows.length>=250);
    for(const row of lock.baselineRows){const repo=JSON.parse(fs.readFileSync(path.join(root,'references/upstream-lock.json'),'utf8')).repositories.find(r=>r.name===row.repo);assert.equal(row.sha,repo.commit);assert.equal(digest(fs.readFileSync(path.join(root,repo.path,row.file))),row.sourceSha256);assert.ok(row.disposition&&row.aetherField&&row.owner&&row.vector);}
    for(const dep of lock.dependencies){assert.ok(dep.notices.length>0);for(const n of dep.notices)assert.equal(digest(Buffer.from(n.text)),n.sha256);for(const a of dep.targetArtifacts)assert.equal(digest(fs.readFileSync(path.join(root,a.path))),a.sha256);}
  });
  test('the concrete ADR binds native source, target, vectors, licenses and original settings',()=>{
    const adr=fs.readFileSync(path.join(root,'docs/phase06/PROTOCOL-ADR.md'),'utf8');
    for(const name of ['fec-percentage','lan-encryption-mode','wan-encryption-mode','packetsize','ping-timeout','port'])for(const os of ['windows10','windows11'])assert.ok(adr.includes(`case-helios-${os}-${name}`));
    const bound=readDossier();verifyBindings(bound);
    if(bound.decision.choice===null)assert.equal(bound.decision.rawResponse,null);
    else {assert.equal(bound.decision.choice,'approve-concrete');assert.equal(bound.decision.rawResponse,'1');assert.equal(bound.decision.reviewedAdrSha256,'0cdda0d2750ed02e7c873412b41a0033a1fe73d72d9b57f874cf91a4b3e657cc');}
    assert.ok(adr.includes('nanors/OBL')&&adr.includes('not linked'));
    assert.ok(adr.includes('Disabled: conflicts with D-13'));
    const lock=JSON.parse(fs.readFileSync(path.join(root,'protocol/dependencies.lock.json'),'utf8'));
    assert.ok(lock.dependencies[0].notices.some(n=>n.path==='external/perl/Text-Template-1.56/LICENSE'));
    assert.ok(lock.dependencies[1].sourceFiles.some(s=>s.inlineNotices.some(n=>n.includes('Cisco Systems'))));
  });
  test('a known-bad material digest is rejected instead of silently using stale evidence',()=>{
    const bound=readDossier();bound.materials[0].sha256='0'.repeat(64);
    assert.throws(()=>verifyBindings(bound),/Material drift/);
  });
  test.after(()=>{if(fixture)fs.rmSync(fixture,{recursive:true,force:true});});
}
