'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const crypto=require('node:crypto');
const dgram=require('node:dgram');
const root=path.resolve(__dirname,'..');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function target(){const m=JSON.parse(fs.readFileSync(path.join(root,'build/phase06/windows-x64/target-manifest-Debug.json'),'utf8'));assert.equal(hash(fs.readFileSync(m.binary)),m.sha256);assert.equal(hash(fs.readFileSync(m.library)),m.librarySha256);for(const s of m.sources)assert.equal(hash(fs.readFileSync(path.join(root,s.file))),s.sha256);return m;}
function child(binary,args){
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
  const openssl=path.join(root,'build/phase06/dependencies/openssl-install/bin/openssl.exe');
  for(const name of ['host','client']){const r=cp.spawnSync(openssl,['req','-x509','-newkey','ED25519','-noenc','-keyout',path.join(dir,name+'.key'),'-out',path.join(dir,name+'.pem'),'-subj',`/CN=aether-${name}.local`,'-addext',`subjectAltName=DNS:aether-${name}.local`,'-days','1'],{shell:false,windowsHide:true,encoding:'utf8',timeout:5000,env:{...process.env,OPENSSL_CONF:'NUL'}});assert.equal(r.status,0);}
  fs.writeFileSync(path.join(dir,'trust.pem'),Buffer.concat(['host','client'].map(n=>fs.readFileSync(path.join(dir,n+'.pem')))));return dir;
}
for(const scenario of ['happy','loss-video1','cross-stream','wrong-direction','tamper-high-sequence','replay'])test('real secure dual video: '+scenario,{timeout:10000},async()=>{
  const m=target(),dir=fixture(),relay=dgram.createSocket('udp4');let host,client,receiver=0;const relayCounts={received:0,forwarded:0,dropped:0,injected:0};let relayError;
  relay.on('error',e=>{relayError=e;});
  try {
    await new Promise(resolve=>relay.bind(0,'127.0.0.1',resolve));
    relay.on('message',packet=>{
      ++relayCounts.received;if(!receiver){relayError=Error('Missing receiver');return;}
      const stream=packet.readUInt32BE(8),seq=packet.readUInt16BE(2);
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
    const wire=Buffer.from('4145544800130102000100020001000102','hex');
    // The destination port is carried as a bounded optional TLV, not a fault hook.
    const port=Buffer.alloc(6);port.writeUInt16BE(2,0);port.writeUInt16BE(2,2);port.writeUInt16BE(relay.address().port,4);
    const request=Buffer.concat([wire,port]);request.writeUInt16BE(request.length,4);fs.writeFileSync(path.join(dir,'request.bin'),request);
    host=child(m.binary,['--role','host','--fixture',dir,'--scenario','multistream']);const ready=await host.wait('ready');
    client=child(m.binary,['--role','client','--peer',String(ready.detail.controlPort),'--fixture',dir,'--scenario','multistream']);receiver=(await client.wait('ready')).detail.udpPort;
    const [h,c]=await Promise.all([host.closed,client.closed]);assert.equal(h.code,0,JSON.stringify(h));assert.equal(c.code,0,JSON.stringify(c));assert.notEqual(h.pid,c.pid);assert.ifError(relayError);
    const hs=h.messages.find(v=>v.kind==='result').detail,cs=c.messages.find(v=>v.kind==='result').detail;
    assert.equal(cs.streams.length,2,'Missing independent native streams');assert.equal(cs.controlProgress,8);assert.equal(hs.controlProgress,8);
    assert.equal(relayCounts.received,16);assert.equal(hs.streams[0].sent,8);assert.equal(hs.streams[1].sent,8);
    for(const s of cs.streams){assert.equal(s.received,scenario==='loss-video1'&&s.id===104?5:8);const rounds=[1,2,3,4,5,6,7,8].filter(r=>!(scenario==='loss-video1'&&s.id===104&&r>=2&&r<=4));assert.equal(s.digest,hash(Buffer.from(rounds.map(r=>`synthetic-phase06:video:${s.id}:${r}`).join(''))));}
    if(scenario==='loss-video1')for(const round of [2,3,4]){const w=cs.windows.find(w=>w.round===round);assert.equal(w.video1,0);assert.equal(w.video2,1);assert.equal(w.control,1);}
    if(relayCounts.injected)assert.ok(cs.streams.reduce((n,s)=>n+s.rejected,0)>=1,'Forged/replayed packet accepted or not sampled');
    for(const r of [h,c]){const clean=r.messages.find(v=>v.kind==='clean').detail;assert.equal(clean.sockets,0);assert.equal(clean.threads,0);assert.equal(clean.stopped,true);assert.equal(clean.persistentIdentity.instanceId,102);assert.equal(clean.persistentIdentity.displayId,103);const sibling=r.messages.find(v=>v.kind==='sibling-survives');assert.ok(sibling&&sibling.detail.stopped===false&&sibling.detail.sockets===2);}
    const out=path.join(root,'artifacts/phase06/multistream');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,scenario+'.json'),JSON.stringify({schema:1,scenario,seed:601,relay:relayCounts,targetSha256:m.sha256,sources:m.sources,host:h,client:c,synthetic:true,systemMutation:false},null,2)+'\n');
  }finally{for(const p of [host,client])if(p?.process.exitCode===null)p.process.kill();await new Promise(resolve=>relay.close(resolve));fs.rmSync(dir,{recursive:true,force:true});}
});
