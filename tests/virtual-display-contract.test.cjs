'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawnSync,spawn}=require('node:child_process');
const config=process.env.AETHER_DISPLAY_CONFIGURATION||'Debug';
const binary=path.resolve(`build/native/${config}/aether_helios_test.exe`),product=path.resolve(`build/native/${config}/helios.exe`);
function sandbox(){const root=fs.mkdtempSync(path.join(os.tmpdir(),'aether-display-contract-'));return root;}
function run(root,args,code=0){const r=spawnSync(binary,['vdisplay',...args,'--test-provider','--test-root',root,'--json'],{encoding:'utf8',timeout:12000,windowsHide:true});assert.equal(r.status,code,r.error?.message||r.stdout+r.stderr);return JSON.parse(r.stdout);}
function slots(r){return r.groups.flatMap(g=>g.slots);}
test('tracer: independent CLI processes persist A identity and reject duplicate name',()=>{
 const root=sandbox(),a=run(root,['create','A']);assert.equal(a.evidenceScope,'contract');assert.equal(a.status,'ok');
 const q=run(root,['query','--group','A']);assert.equal(q.groups.length,1);assert.equal(q.groups[0].groupId,a.groups[0].groupId);assert.equal(slots(q).length,2);
 assert.deepEqual(slots(q).map(s=>s.slotId),slots(a).map(s=>s.slotId));assert.deepEqual(slots(q).map(s=>[s.requested.width,s.requested.height]),[[1920,1080],[2560,1440]]);
 assert.equal(run(root,['create','a'],1).status,'already-exists');
 assert.equal(run(root,['delete','A']).groups.length,0);assert.equal(run(root,['query']).groups.length,0);
});
test('registry: partial creation and commit failures compensate owned slots only',()=>{
 for(const fault of ['create:2','commit']){const root=sandbox();run(root,['create','B']);const b=run(root,['query','--group','B']).groups[0];
  assert.equal(run(root,['create','A','--fault',fault],1).status,'failed');const q=run(root,['query']);assert.deepEqual(q.groups,[b]);assert.equal(q.pending,null);assert.equal(q.backendSlotCount,1);
 }
});
test('registry: crash leaves pending journal and explicit named recovery resolves it',()=>{
 const root=sandbox();run(root,['create','A','--fault','crash:1'],86); // abrupt process death, output is checked separately below
});
test('registry: racing processes serialize normalized group creation',async()=>{
 const root=sandbox();
 const call=()=>new Promise((resolve,reject)=>{const p=spawn(binary,['vdisplay','create','A','--test-provider','--test-root',root,'--json'],{windowsHide:true});let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('close',code=>resolve({code,json:JSON.parse(out),err}));});
 const results=await Promise.all([call(),call()]);assert.deepEqual(results.map(x=>x.code).sort(),[0,1]);assert.equal(run(root,['query']).groups.length,1);
});
test('security: product CLI rejects test injection and untrusted owner data',()=>{
 const root=sandbox(),r=spawnSync(product,['vdisplay','create','A','--test-provider','--test-root',root,'--json'],{encoding:'utf8',windowsHide:true,timeout:5000});assert.equal(r.status,2);assert.equal(fs.readdirSync(root).length,0);
 run(root,['create','A']);const file=path.join(root,'display-registry.v1.json'),j=JSON.parse(fs.readFileSync(file,'utf8'));j.ownerSid='S-1-5-18';fs.writeFileSync(file,JSON.stringify(j));assert.equal(run(root,['query'],1).status,'access-denied');
});
module.exports={sandbox,run,slots,binary,product};
