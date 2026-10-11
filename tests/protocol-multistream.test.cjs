'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const crypto=require('node:crypto');
const dgram=require('node:dgram');
const root=path.resolve(__dirname,'..');const android=require(path.join(root,'scripts/android-protocol-bridge.cjs'));let mobileSequence=0;test.after(()=>{if(android.active)android.cleanup();});const nativeSync=(exe,args,options)=>android.active?android.spawnSync(exe,args,options):cp.spawnSync(exe,args,options);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let priorProtectedSource;
async function auditFec(){
  const repo='sleepybishop/nanors',sha='b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a';
  const base=path.join(root,'build/phase06/fec-audit');fs.mkdirSync(base,{recursive:true});
  const json=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,url);return r.json();};
  const tree=await json(`https://api.github.com/repos/${repo}/git/trees/${sha}?recursive=1`);assert.equal(tree.truncated,false);
  const archiveUrl=`https://api.github.com/repos/${repo}/tarball/${sha}`,archiveFile=path.join(base,'nanors-'+sha+'.tar.gz');
  const response=await fetch(archiveUrl,{signal:AbortSignal.timeout(30000)});assert.equal(response.status,200);const archive=Buffer.from(await response.arrayBuffer());assert.ok(archive.length<8*1024*1024);fs.writeFileSync(archiveFile,archive);
  assert.ok(tree.tree.filter(t=>t.type==='blob').reduce((n,t)=>n+t.size,0)<8*1024*1024);
  const list=cp.spawnSync('tar',['-tzf',archiveFile],{shell:false,windowsHide:true,encoding:'utf8',timeout:30000,maxBuffer:65536});assert.equal(list.status,0,list.stderr);
  const entries=list.stdout.trim().split(/\r?\n/),prefix=entries[0];assert.match(prefix,/^[A-Za-z0-9._-]+\/$/);
  const allowed=new Set(['',...tree.tree.map(t=>t.path+(t.type==='tree'?'/':''))]);
  for(const entry of entries){assert.ok(entry.startsWith(prefix));assert.ok(allowed.has(entry.slice(prefix.length)),entry);}
  const types=cp.spawnSync('tar',['-tvzf',archiveFile],{shell:false,windowsHide:true,encoding:'utf8',timeout:30000,maxBuffer:65536});assert.equal(types.status,0,types.stderr);for(const line of types.stdout.trim().split(/\r?\n/))assert.ok(['-','d'].includes(line[0]),'Archive link/special entry refused');
  const source=path.join(base,'nanors');fs.mkdirSync(source,{recursive:true});const unpack=cp.spawnSync('tar',['-xzf',archiveFile,'--strip-components=1','-C',source],{shell:false,windowsHide:true,encoding:'utf8',timeout:30000});assert.equal(unpack.status,0,unpack.stderr);
  const files=[];
  for(const item of tree.tree.filter(t=>t.type==='blob')){const file=path.resolve(source,item.path);assert.ok(file.startsWith(source+path.sep));const bytes=fs.readFileSync(file);assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest('hex'),item.sha,'Official Git blob mismatch');files.push({path:item.path,blob:item.sha,sha256:hash(bytes),bytes:bytes.length,...(/LICENSE|README|Makefile|\.(c|h)$/.test(item.path)?{text:bytes.toString('utf8')}:{})});}
  const originRepo='sleepybishop/oblas';
  const originCommit=await json(`https://api.github.com/repos/${originRepo}/commits/master`);
  const originTree=await json(`https://api.github.com/repos/${originRepo}/git/trees/${originCommit.sha}?recursive=1`);assert.equal(originTree.truncated,false);
  const originLicenseUrl=`https://raw.githubusercontent.com/${originRepo}/${originCommit.sha}/LICENSE`;
  const licenseResponse=await fetch(originLicenseUrl,{signal:AbortSignal.timeout(30000)});assert.equal(licenseResponse.status,200);
  const licenseBytes=Buffer.from(await licenseResponse.arrayBuffer());assert.ok(licenseBytes.length<65536);
  const licenseBlob=originTree.tree.find(t=>t.path==='LICENSE');assert.ok(licenseBlob);
  assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${licenseBytes.length}\0`),licenseBytes])).digest('hex'),licenseBlob.sha);
  const origin={repo:originRepo,sourceSha:originCommit.sha,licenseUrl:originLicenseUrl,licenseSha256:hash(licenseBytes),licenseText:licenseBytes.toString('utf8'),comparisons:files.filter(f=>f.path.startsWith('deps/obl/')).map(f=>({embeddedPath:f.path,embeddedBlob:f.blob,exactBlobMatches:originTree.tree.filter(t=>t.type==='blob'&&t.sha===f.blob).map(t=>t.path)})),status:'reference-license-only-no-exact-ancestry-claim'};
  const dossier={schema:1,repo,sourceSha:sha,archiveUrl,archiveSha256:hash(archive),archiveBytes:archive.length,observedAt:new Date().toISOString(),status:'research-only-not-linked',files,origin};
  fs.mkdirSync(path.join(root,'artifacts/phase06'),{recursive:true});fs.writeFileSync(path.join(root,'artifacts/phase06/fec-source-audit.json'),JSON.stringify(dossier,null,2)+'\n');
  const ledger={schema:1,repo,sourceSha:sha,archiveUrl,archiveSha256:dossier.archiveSha256,archiveBytes:archive.length,observedAt:dossier.observedAt,status:dossier.status,files:files.map(({text,...file})=>({...file,sourceUrl:`https://raw.githubusercontent.com/${repo}/${sha}/${file.path}`})),rootLicense:files.find(f=>f.path==='LICENSE'),origin};
  fs.writeFileSync(path.join(root,'docs/phase06/FEC-SOURCE-AUDIT.json'),JSON.stringify(ledger,null,2)+'\n');
  console.log(JSON.stringify({sourceSha:sha,archiveSha256:dossier.archiveSha256,files:files.map(f=>f.path),origin,status:dossier.status}));
}
function target(){const m=JSON.parse(fs.readFileSync(process.env.AETHER_PROTOCOL_MANIFEST||path.join(root,'build/phase06/windows-x64/target-manifest-Debug.json'),'utf8'));assert.equal(hash(fs.readFileSync(m.binary)),m.sha256);assert.equal(hash(fs.readFileSync(m.library)),m.librarySha256);for(const s of m.sources)assert.equal(hash(fs.readFileSync(path.join(root,s.file))),s.sha256);if(m.fec){assert.equal(hash(fs.readFileSync(path.join(root,'docs/phase06/FEC-REUSE-DECISION.json'))),m.fec.decisionSha256);for(const s of m.fec.inputs)assert.equal(hash(fs.readFileSync(path.join(root,s.file))),s.sha256);for(const d of m.dependencies)if(d.file)assert.equal(hash(fs.readFileSync(d.file)),d.sha256);assert.equal(hash(fs.readFileSync(m.mediaSecurity.binary)),m.mediaSecurity.sha256);}return m;}
function child(binary,args){if(android.active)return mobileChild(binary,args);
  const process=cp.spawn(binary,args,{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
  let buffer='',stderr='',finished=false;const messages=[],waiters=[];let resolve,reject;
  const closed=new Promise((r,j)=>{resolve=r;reject=j;});closed.catch(()=>{});
  const fail=e=>{if(!finished)process.kill();reject(e);for(const w of waiters)w.reject(e);};
  const timer=setTimeout(()=>fail(Error('Owned multistream child deadline')),5000);
  process.stdout.on('data',b=>{buffer+=b.toString();if(buffer.length>65536)return fail(Error('Native output bound'));let i;while((i=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,i);buffer=buffer.slice(i+1);try{const m=JSON.parse(line);messages.push(m);for(const w of waiters)if(w.kind===m.kind)w.resolve(m);}catch(e){fail(e);}}});
  process.stderr.on('data',b=>{stderr=(stderr+b.toString()).slice(-4096);});process.on('error',fail);
  process.on('close',code=>{finished=true;clearTimeout(timer);resolve({pid:process.pid,code,messages,stderr});for(const w of waiters)w.reject(Error('Closed before '+w.kind));});
  return {process,closed,wait:kind=>{const m=messages.find(m=>m.kind===kind);if(m)return Promise.resolve(m);if(finished)return Promise.reject(Error('Already closed'));return new Promise((resolve,reject)=>waiters.push({kind,resolve,reject}));}};
}
function fixture(){
  const base=path.join(root,'build/phase06/fixtures');fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(path.join(base,'multistream-'));
  const openssl=(process.env.AETHER_OPENSSL_BIN||path.join(root,'build/phase06/dependencies/openssl-install/bin/openssl.exe'));
  if(android.active)android.makeCertificates(dir);else for(const name of ['host','client']){const r=cp.spawnSync(openssl,['req','-x509','-newkey','ED25519','-noenc','-keyout',path.join(dir,name+'.key'),'-out',path.join(dir,name+'.pem'),'-subj',`/CN=aether-${name}.local`,'-addext',`subjectAltName=DNS:aether-${name}.local`,'-days','1'],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000,env:{...process.env,OPENSSL_CONF:process.platform==='win32'?'NUL':'/dev/null'}});assert.equal(r.status,0);}
  fs.writeFileSync(path.join(dir,'trust.pem'),Buffer.concat(['host','client'].map(n=>fs.readFileSync(path.join(dir,n+'.pem')))));return dir;
}
if(process.argv.includes('--audit-fec'))auditFec().catch(e=>{console.error(e);process.exitCode=1;});
else for(const scenario of ['happy','loss-video1','cross-stream','wrong-direction','tamper-high-sequence','replay',
  'fec-happy','fec-threshold','fec-beyond','fec-tamper-repair','fec-cross-role','fec-reorder-replay','fec-late','fec-queue','fec-domain-tamper','fec-burst','fec-fresh-epoch','fec-stale-epoch','fec-contract'])test('real secure media: '+scenario,{timeout:10000},async()=>{
  const full=scenario.startsWith('fec-');
  const m=target(),dir=fixture(),relay=android.active?android.createRelay():dgram.createSocket('udp4');let host,client,receiver=0,hostPort=0;const held=[];const relayCounts={received:0,forwarded:0,dropped:0,injected:0};let relayError;
  relay.on('error',e=>{relayError=e;});
  try {
    await new Promise(resolve=>relay.bind(0,'127.0.0.1',resolve));
    if(!relay.nativeFaults)relay.on('message',packet=>{
      ++relayCounts.received;if(!receiver){relayError=Error('Missing receiver');return;}
      const stream=packet.readUInt32BE(8),seq=packet.readUInt16BE(2);
      if(full){
        const destination=stream>=107?hostPort:receiver,round=packet.readUInt32BE(20),role=packet[18],shard=packet.readUInt16BE(96);
        if(scenario==='fec-happy'&&stream===104&&round===1&&shard===0)priorProtectedSource=Buffer.from(packet);
        if(scenario==='fec-fresh-epoch'&&stream===104&&round===1&&shard===0){assert.ok(priorProtectedSource);relay.send(priorProtectedSource,destination,'127.0.0.1');++relayCounts.injected;}
        if(stream===104&&round>=2&&round<=4){
          if(['fec-threshold','fec-tamper-repair','fec-late'].includes(scenario)&&shard===0){++relayCounts.dropped;return;}
          if(scenario==='fec-beyond'&&shard<2){++relayCounts.dropped;return;}
          if(scenario==='fec-tamper-repair'&&role===1){const bad=Buffer.from(packet);bad[bad.length-1]^=1;relay.send(bad,destination,'127.0.0.1');++relayCounts.injected;return;}
          if(scenario==='fec-late'&&role===1){held.push({packet:Buffer.from(packet),destination});return;}
          if(scenario==='fec-cross-role'&&role===1){const bad=Buffer.from(packet);bad[18]=0;relay.send(bad,destination,'127.0.0.1');++relayCounts.injected;}
        }
        if(scenario==='fec-reorder-replay'&&role===0&&shard===0){held.push({packet:Buffer.from(packet),destination});return;}
        relay.send(packet,destination,'127.0.0.1');++relayCounts.forwarded;
        if(scenario==='fec-reorder-replay'&&role===1){for(const p of held.splice(0)){relay.send(p.packet,p.destination,'127.0.0.1');relay.send(p.packet,p.destination,'127.0.0.1');relayCounts.forwarded++;relayCounts.injected++;}}
        if(scenario==='fec-late'&&stream===104&&round>=3&&shard===1){for(const p of held.splice(0)){relay.send(p.packet,p.destination,'127.0.0.1');++relayCounts.forwarded;}}
        if(scenario==='fec-domain-tamper'&&stream===104&&round===2&&role===1){for(const offset of [2,4,8,16,17,18,19,20,24,32,40,48,56,64,72,80,88,96,98,100,102,104,108,116,120,152,156]){const bad=Buffer.from(packet);bad[offset]^=1;relay.send(bad,destination,'127.0.0.1');++relayCounts.injected;}}
        if(scenario==='fec-burst'&&stream===104&&shard===0){for(let i=0;i<20;i++){relay.send(packet,destination,'127.0.0.1');++relayCounts.injected;}}
        return;
      }
      if(scenario==='loss-video1'&&stream===104&&seq>=2&&seq<=4){++relayCounts.dropped;return;}
      if(stream===104&&seq===2&&['cross-stream','wrong-direction','tamper-high-sequence'].includes(scenario)){
        const bad=Buffer.from(packet);
        if(scenario==='cross-stream')bad.writeUInt32BE(105,8);
        if(scenario==='wrong-direction')bad[16]=2;
        if(scenario==='tamper-high-sequence')bad.writeUInt16BE(60000,2);
        relay.send(bad,receiver,'127.0.0.1');++relayCounts.injected;
      }
      relay.send(packet,receiver,'127.0.0.1');++relayCounts.forwarded;
      if(scenario==='replay'&&stream===104&&seq===2){relay.send(packet,receiver,'127.0.0.1');++relayCounts.injected;}
    });
    const wire=Buffer.from(full?'4145544800130102000100020001000105':'4145544800130102000100020001000102','hex');
    // The destination port is carried as a bounded optional TLV, not a fault hook.
    const port=Buffer.alloc(6);port.writeUInt16BE(2,0);port.writeUInt16BE(2,2);port.writeUInt16BE(relay.address().port,4);
    const profile=full?Buffer.from('000300020001','hex'):Buffer.alloc(0);
    const uplink=full?Buffer.concat([Buffer.from('00060011','hex'),Buffer.from('synthetic-phase06')]):Buffer.alloc(0);
    const limits=scenario==='fec-queue'?Buffer.from('0007001400f000f000320001004000020000008000190000','hex'):Buffer.alloc(0);
    const request=Buffer.concat([wire,port,profile,uplink,limits]);request.writeUInt16BE(request.length,4);fs.writeFileSync(path.join(dir,'request.bin'),request);
    const hostEpoch=scenario==='fec-fresh-epoch'?['--key-generation','2']:[];
    const clientEpoch=['fec-fresh-epoch','fec-stale-epoch'].includes(scenario)?['--key-generation','2']:[];
    host=child(m.binary,['--role','host','--fixture',dir,'--scenario','multistream',...hostEpoch]);const ready=await host.wait('ready');
    hostPort=ready.detail.udpPort;
    client=child(m.binary,['--role','client','--peer',String(ready.detail.controlPort),'--fixture',dir,'--scenario','multistream',...clientEpoch]);receiver=(await client.wait('ready')).detail.udpPort;
    if(relay.nativeFaults){await relay.configure(hostPort,receiver,scenario,priorProtectedSource);android.releaseMedia(dir);}
    const [h,c]=await Promise.all([host.closed,client.closed]);if(relay.nativeFaults){Object.assign(relayCounts,await relay.snapshot());if(relay.seed)priorProtectedSource=relay.seed;fs.mkdirSync(path.join(root,'artifacts/phase06/android-media-attempts'),{recursive:true});fs.writeFileSync(path.join(root,'artifacts/phase06/android-media-attempts',scenario+'.json'),JSON.stringify({scenario,relay:relayCounts,host:h,client:c},null,2));}assert.equal(h.code,scenario==='fec-stale-epoch'?2:0,JSON.stringify(h));assert.equal(c.code,scenario==='fec-stale-epoch'?2:0,JSON.stringify(c));assert.notEqual(h.pid,c.pid);assert.ifError(relayError);
    const hs=h.messages.find(v=>v.kind==='result').detail,cs=c.messages.find(v=>v.kind==='result').detail;
    if(scenario==='fec-stale-epoch'){
      for(const result of [hs,cs]){assert.equal(result.status,27);assert.equal(result.grants,0);assert.equal(result.streams.length,0);assert.equal(result.queueBytes,0);}
      assert.equal(relayCounts.received,0);
    }else if(full){
      assert.equal(cs.streams.length,5,'Missing independent native streams');assert.equal(cs.controlProgress,8);assert.equal(hs.controlProgress,8);
      assert.equal(relayCounts.received,120);
      for(const result of [hs,cs]){
        if(scenario==='fec-contract'){assert.equal(result.queryVersion,1);assert.equal(result.mediaLimits.headerBytes,160);assert.equal(result.mediaLimits.frameBytes,128);assert.equal(result.mediaLimits.effectivePacketBytes,240);}
        assert.equal(result.fecProfile,'rs-vandermonde-gf256-11d-v1');
        assert.equal(result.queueBytes,0);assert.ok(result.peakQueueBytes<=(scenario==='fec-queue'?640:960));
        for(const stream of result.streams){
          const receiving=result===cs?stream.direction===1:stream.direction===2;
          if(!receiving){assert.equal(stream.sent,24);continue;}
          const missing=stream.id===104&&['fec-beyond','fec-tamper-repair','fec-late'].includes(scenario)?[2,3,4]:[];
          assert.equal(stream.received,8-missing.length);
          assert.ok(stream.receivedPackets>=stream.received*2,'Packet and frame denominators must remain distinct');
          const name={104:'video',105:'video',106:'audio',107:'mic',108:'camera'}[stream.id];
          const rounds=[1,2,3,4,5,6,7,8].filter(r=>!missing.includes(r));
          assert.equal(stream.digest,hash(Buffer.from(rounds.map(r=>`synthetic-phase06:${name}:${stream.id}:${r}`).join(''))));
          assert.equal(stream.timestamp,(0xffffffff-3000+(name==='audio'||name==='mic'?960:3000)*7)>>>0);
          if(scenario==='fec-queue')assert.ok(stream.queueRejected>=8,'Full per-stream shard queue did not reject extra repair bytes');
          if(stream.id===104){
            if(scenario==='fec-threshold')assert.equal(stream.recovered,3);
            if(missing.length)assert.equal(stream.dropped,3);
            if(scenario==='fec-tamper-repair')assert.ok(stream.protectionRejectedPackets>=3);
            if(scenario==='fec-late')assert.ok(stream.expired>=2);
          }
        }
      }
      for(const round of [2,3,4]){
        const w=cs.windows.find(w=>w.round===round),up=hs.windows.find(w=>w.round===round);
        assert.equal(w.video2,1);assert.equal(w.audio,1);assert.equal(w.control,1);assert.equal(up.mic,1);assert.equal(up.camera,1);
      }
      if(relayCounts.injected)assert.ok(cs.streams.reduce((n,s)=>n+s.rejected,0)+hs.streams.reduce((n,s)=>n+s.rejected,0)>0);
    }else{
    assert.equal(cs.streams.length,2,'Missing independent native streams');assert.equal(cs.controlProgress,8);assert.equal(hs.controlProgress,8);
    assert.equal(relayCounts.received,16);assert.equal(hs.streams[0].sent,8);assert.equal(hs.streams[1].sent,8);
    for(const s of cs.streams){assert.equal(s.received,scenario==='loss-video1'&&s.id===104?5:8);const rounds=[1,2,3,4,5,6,7,8].filter(r=>!(scenario==='loss-video1'&&s.id===104&&r>=2&&r<=4));assert.equal(s.digest,hash(Buffer.from(rounds.map(r=>`synthetic-phase06:video:${s.id}:${r}`).join(''))));}
    if(scenario==='loss-video1')for(const round of [2,3,4]){const w=cs.windows.find(w=>w.round===round);assert.equal(w.video1,0);assert.equal(w.video2,1);assert.equal(w.control,1);}
    if(relayCounts.injected)assert.ok(cs.streams.reduce((n,s)=>n+s.rejected,0)>=1,'Forged/replayed packet accepted or not sampled');
    }
    for(const r of [h,c]){const clean=r.messages.find(v=>v.kind==='clean').detail;assert.equal(clean.sockets,0);assert.equal(clean.threads,0);assert.equal(clean.stopped,true);assert.equal(clean.persistentIdentity.instanceId,102);assert.equal(clean.persistentIdentity.displayId,103);const sibling=r.messages.find(v=>v.kind==='sibling-survives');assert.ok(sibling&&sibling.detail.stopped===false&&sibling.detail.sockets===2);}
    const out=path.join(root,'artifacts/phase06/multistream');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,scenario+'.json'),JSON.stringify({schema:1,scenario,seed:601,relay:relayCounts,targetSha256:m.sha256,sources:m.sources,host:h,client:c,synthetic:true,systemMutation:false},null,2)+'\n');
  }finally{for(const p of [host,client])if(p?.process.exitCode===null)p.process.kill();await new Promise((resolve,reject)=>relay.close(error=>error?reject(error):resolve()));fs.rmSync(dir,{recursive:true,force:true});}
});
if(!process.argv.includes('--audit-fec'))for(const mode of ['rollover','nonce-exhaustion','high-sequence','role-key-epoch','unchanged-retransmission','fec-golden'])test('actual native media security: '+mode,()=>{
  const m=target();assert.ok(m.mediaSecurity,'Current security test target manifest required');
  const result=nativeSync(m.mediaSecurity.binary,[mode],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000,maxBuffer:4096});
  assert.equal(result.status,0,result.stderr);assert.deepEqual(JSON.parse(result.stdout),{ok:true,case:mode});
});
function optionBytes(options){const b=Buffer.alloc(20);for(const [name,offset] of [['packetSize',0],['mtu',2],['fecPercent',4],['minRepair',6],['shardBytes',8],['k',10],['ttlMs',16],['reserved',18]])b.writeUInt16BE(options[name],offset);b.writeUInt32BE(options.perStreamQueue,12);return b;}
function mediaHello(options,profile=1){
  const b=Buffer.from('41455448000001020001000200010001050003000200010006000178','hex');b.writeUInt16BE(profile,21);
  const tlv=Buffer.alloc(4);tlv.writeUInt16BE(7,0);tlv.writeUInt16BE(20,2);const request=Buffer.concat([b,tlv,optionBytes(options)]);request.writeUInt16BE(request.length,4);return request;
}
if(!process.argv.includes('--audit-fec'))test('independent full-media parser boundaries and profile negotiation',()=>{
  const m=target(),vectors=JSON.parse(fs.readFileSync(path.join(root,'protocol/vectors.json'))).multiMedia;
  for(const vector of vectors.boundaries){const request=mediaHello({...vectors.options,...vector.changes});const r=nativeSync(m.binary,['--role','parse','--wire',request.toString('hex')],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000});assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).status,vector.status,vector.id);}
  const unknown=mediaHello(vectors.options,2),r=nativeSync(m.binary,['--role','parse','--wire',unknown.toString('hex')],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000});assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).status,20,'Unknown FEC profile must fail before allocation');
  for(const delta of [-1,1]){const request=mediaHello(vectors.options);request.writeUInt16BE(20+delta,request.length-22);const result=nativeSync(m.binary,['--role','parse','--wire',request.toString('hex')],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000});assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).status,24,'Exact option TLV length required');}
});
if(!process.argv.includes('--audit-fec'))test('public fixed-width media options validate ABI, prefix length and bounded effective result',()=>{
 const m=target(),vectors=JSON.parse(fs.readFileSync(path.join(root,'protocol/vectors.json'))).multiMedia;
 const run=(options,args=[])=>{const r=nativeSync(m.binary,['--role','media-options','--options',optionBytes(options).toString('hex'),...args],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
 assert.deepEqual(run(vectors.options),{status:0,queryVersion:1,packetBytes:240,k:2,n:3});
 for(const v of vectors.boundaries){const result=run({...vectors.options,...v.changes});assert.equal(result.status,v.status,v.id);if(v.status)assert.equal(result.queryVersion,0,'No partially published effective values');}
 for(const [args,status] of [[['--abi','2'],2],[['--size','27'],1],[['--size','29'],0],[['--out-abi','2'],2],[['--out-size','39'],1],[['--out-size','41'],0]])assert.equal(run(vectors.options,args).status,status);
});

function mobileChild(binary,args){const folder=args[args.indexOf('--fixture')+1],native=android.child(binary,[...args,'--before-submit',path.join(folder,'submit-'+args[args.indexOf('--role')+1])],folder,'media-'+(++mobileSequence),5000),messages=[],waiters=[];let pending='',stderr='',finished=false;native.p.stdout.on('data',b=>{pending+=b;let e;while((e=pending.indexOf('\n'))>=0){const l=pending.slice(0,e);pending=pending.slice(e+1);const row=JSON.parse(l);messages.push(row);for(const w of waiters)if(w.kind===row.kind)w.resolve(row);}});native.p.stderr.on('data',b=>stderr+=b);const closed=native.done.then(r=>{finished=true;for(const w of waiters)w.reject(Error('Closed before '+w.kind));return{pid:r.pid,code:r.code,messages,stderr};});closed.catch(()=>{});return{process:native.p,closed,wait:kind=>{const m=messages.find(m=>m.kind===kind);if(m)return Promise.resolve(m);if(finished)return Promise.reject(Error('Already closed'));return new Promise((resolve,reject)=>waiters.push({kind,resolve,reject}));}};}
