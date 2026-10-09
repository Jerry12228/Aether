'use strict';
const nativeTest=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const selectedSuite=process.env.AETHER_DISPLAY_SUITE||'';let requiredCases=0;
function test(name,body){if(!selectedSuite||name.startsWith(selectedSuite+':')){++requiredCases;nativeTest(name,body);}}
const {spawnSync,spawn}=require('node:child_process');
const config=process.env.AETHER_DISPLAY_CONFIGURATION||'Debug';
const repo=path.resolve(__dirname,'..');
const binary=path.join(repo,`build/native/${config}/aether_helios_test.exe`),product=path.join(repo,`build/native/${config}/helios.exe`);
function sandbox(){const root=fs.mkdtempSync(path.join(os.tmpdir(),'aether-display-contract-'));return root;}
function run(root,args,code=0){const r=spawnSync(binary,['vdisplay',...args,'--test-provider','--test-root',root,'--json'],{encoding:'utf8',timeout:12000,windowsHide:true});assert.equal(r.status,code,r.error?.message||r.stdout+r.stderr);return code===86?r:JSON.parse(r.stdout);}
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
test('registry: crash leaves pending journal and query does not recover it',()=>{
 const root=sandbox();run(root,['create','A','--fault','crash:1'],86); // abrupt process death, output is checked separately below
 const q=run(root,['query']);assert.equal(q.groups.length,0);assert.equal(q.backendSlotCount,1);assert.equal(q.pending.stage,'creating');assert.equal(run(root,['create','B'],1).status,'pending-recovery');assert.equal(run(root,['query']).backendSlotCount,1);
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
test('topology: four groups have seven unique exact slots and fixed rows without physical screens',()=>{
 const root=sandbox();for(const g of ['D','C','B','A'])run(root,['create',g]);const q=run(root,['query']);assert.equal(q.groups.length,4);assert.equal(slots(q).length,7);assert.equal(new Set(slots(q).map(s=>s.nativeId)).size,7);
 for(const s of slots(q)){assert.equal(s.actual.refreshNumerator/s.actual.refreshDenominator,60);assert.equal(s.actual.y,{A:0,B:1440,C:2520,D:3600}[q.groups.find(g=>g.slots.includes(s))?.groupName]??s.requested.y);}
 const c=q.groups.find(g=>g.groupName==='C');assert.notEqual(c.slots[0].slotId,c.slots[1].slotId);assert.deepEqual(c.slots.map(s=>[s.actual.x,s.actual.y]),[[0,2520],[1920,2520]]);
 const d=q.groups.find(g=>g.groupName==='D');assert.deepEqual(d.slots.map(s=>s.actual.hdr),[false,true]);assert.equal(q.realityDiff.length,0);
});
test('topology: physical anchor and complete foreign metadata survive delete B',()=>{
 const root=sandbox();const a=run(root,['create','A','--fault','physical']);assert.deepEqual(a.groups[0].slots.map(s=>[s.actual.x,s.actual.y]),[[2240,-100],[4160,-100]]);
 for(const g of ['B','C','D'])run(root,['create',g]);const before=run(root,['query']);const backendBefore=JSON.parse(fs.readFileSync(path.join(root,'contract-backend.v1.json'),'utf8'));
 run(root,['delete','B']);const after=run(root,['query']);assert.deepEqual(after.groups,before.groups.filter(g=>g.groupName!=='B'));assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'contract-backend.v1.json'),'utf8')).foreign,backendBefore.foreign);
});
test('topology: Win10 defaults all seven SDR while explicit unsupported HDR rejects entire group',()=>{
 const root=sandbox();run(root,['create','A','--fault','win10']);for(const g of ['B','C','D'])run(root,['create',g]);assert.deepEqual(slots(run(root,['query'])).map(s=>s.actual.hdr),Array(7).fill(false));
 const other=sandbox();assert.equal(run(other,['create','D','--slot','1=1920x1080@60/1:SDR','--slot','2=1920x1080@60/1:HDR','--fault','win10'],1).status,'unsupported');assert.equal(run(other,['query']).backendSlotCount,0);
});
test('failure: exact rational accepts 60000/1000 and refuses 59.94 and false HDR readback',()=>{
 const root=sandbox();assert.equal(run(root,['create','A','--fault','refresh-60000/1000']).status,'ok');
 for(const fault of ['refresh-5994','color-sdr']){const r=sandbox();run(r,['create','B']);assert.equal(run(r,['create',fault==='color-sdr'?'D':'A','--fault',fault],1).status,'unsupported');assert.equal(run(r,['query']).groups[0].groupName,'B');assert.equal(run(r,['query']).backendSlotCount,1);}
});
test('failure: every provider boundary has honest failure and preserves prior groups',()=>{
 for(const fault of ['validate','create:1','create:2','apply','readback','commit','timeout:1']){const root=sandbox();run(root,['create','B']);run(root,['create','A','--fault',fault],1);const q=run(root,['query']);assert.deepEqual(q.groups.map(g=>g.groupName),['B']);if(fault.startsWith('timeout'))assert.equal(q.pending.unresolvedEffects,true);else assert.equal(q.backendSlotCount,1);}
});
test('failure: update keeps last-success and compensates only the specified group',()=>{
 const root=sandbox();run(root,['create','A']);run(root,['create','B']);const before=run(root,['query']);
 run(root,['update','A','--slot','1=1280x720@60/1:SDR','--fault','apply'],1);assert.deepEqual(run(root,['query']).groups,before.groups);
 run(root,['update','A','--slot','1=1280x720@60/1:SDR','--fault','rollback'],1);const failed=run(root,['query']);assert.equal(failed.pending.unresolvedEffects,true);assert.deepEqual(failed.groups[0].slots[0].lastSuccess,before.groups[0].slots[0].lastSuccess);assert.deepEqual(failed.groups[1],before.groups[1]);
});
test('recovery: query reports missing target and recover only the named group preserves logical IDs',()=>{
 const root=sandbox();run(root,['create','A']);run(root,['create','C']);const before=run(root,['query']);const file=path.join(root,'contract-backend.v1.json'),state=JSON.parse(fs.readFileSync(file,'utf8'));state.slots=[];fs.writeFileSync(file,JSON.stringify(state));
 const diff=run(root,['query']);assert.equal(diff.realityDiff.length,4);assert.equal(diff.backendSlotCount,0);const restored=run(root,['recover','C']);assert.equal(restored.backendSlotCount,2);assert.deepEqual(restored.groups[1].slots.map(s=>s.slotId),before.groups[1].slots.map(s=>s.slotId));assert.equal(restored.realityDiff.length,2);
});
test('recovery: crash and uncertain timeout resolve only via matching named recovery',()=>{
 for(const fault of ['crash:1','timeout:1']){const root=sandbox();run(root,['create','B']);const before=run(root,['query']).groups[0];run(root,['create','A','--fault',fault],fault.startsWith('crash')?86:1);assert.equal(run(root,['recover','B'],1).status,'pending-recovery');const proposed=run(root,['query']).pending.proposed;const q=run(root,['recover','A']);assert.equal(q.pending,null);assert.deepEqual(q.groups[0],before);assert.equal(q.backendSlotCount,3);assert.equal(q.groups[1].groupId,proposed.groupId);}
});
test('pattern: dedicated actual HWND loop closes owned windows while groups persist',()=>{
 const root=sandbox();const before=run(root,['create','A']);const p=run(root,['test-pattern','A','--fault','pattern-auto-close']);assert.equal(p.windowsCreated,2);assert.equal(p.windowsDestroyed,2);assert.equal(p.windowsRemaining,0);assert.deepEqual(run(root,['query']).groups,before.groups);
});
test('security: names, numeric overflow, zero rational, duplicate slots and unknown flags fail before journal',()=>{
 for(const args of [['create','../A'],['create','A'.repeat(65)],['create','A','--slot','1=4294967296x1080@60/1:SDR'],['create','A','--slot','1=1920x1080@60000/1001:SDR'],['create','A','--slot','1=1920x1080@60/0:SDR'],['create','A','--slot','1=1920x1080@60/1:SDR','--slot','1=1920x1080@60/1:SDR']]){const root=sandbox(),r=spawnSync(binary,['vdisplay',...args,'--test-provider','--test-root',root,'--json'],{encoding:'utf8',windowsHide:true,timeout:5000});assert.equal(r.status,2);assert.equal(fs.readdirSync(root).length,0);}
});
test('security: hard-linked registry and foreign native identity cannot authorize cleanup',()=>{
 const root=sandbox();run(root,['create','A']);const file=path.join(root,'display-registry.v1.json');fs.linkSync(file,path.join(root,'foreign-link.json'));assert.equal(run(root,['query'],1).status,'access-denied');
 const other=sandbox();run(other,['create','A']);const backend=path.join(other,'contract-backend.v1.json'),j=JSON.parse(fs.readFileSync(backend,'utf8'));j.slots[0].ownerSid='S-1-5-18';fs.writeFileSync(backend,JSON.stringify(j));assert.equal(run(other,['delete','A'],1).status,'identity-conflict');assert.equal(JSON.parse(fs.readFileSync(backend,'utf8')).slots.length,2);
});
test('security: corrupted schema, authentication, desktop, UTF8 and stable identity are refused without provider effects',()=>{
 for(const change of [j=>j.schemaVersion=2,j=>j.loginAuthLuid='foreign',j=>j.desktop='Other',j=>j.groups[0].slots[1].slotId=j.groups[0].slots[0].slotId,j=>j.groups[0].slots[0].requested.width=4294967296]){const root=sandbox();run(root,['create','A']);const file=path.join(root,'display-registry.v1.json'),j=JSON.parse(fs.readFileSync(file));change(j);fs.writeFileSync(file,JSON.stringify(j));run(root,['query'],1);assert.equal(JSON.parse(fs.readFileSync(path.join(root,'contract-backend.v1.json'))).slots.length,2);}
 const root=sandbox();run(root,['create','A']);fs.writeFileSync(path.join(root,'display-registry.v1.json'),Buffer.from([123,34,255,34,58,49,125]));assert.equal(run(root,['query'],1).status,'invalid-argument');
});
test('security: junction root is refused before touching its target',()=>{
 const outer=sandbox(),target=sandbox(),link=path.join(outer,'junction');fs.symlinkSync(target,link,'junction');assert.equal(run(link,['create','A'],1).status,'access-denied');assert.deepEqual(fs.readdirSync(target),[]);
});
test('recovery: changed system identity is reported and remapping preserves logical identity',()=>{
 const root=sandbox();const before=run(root,['create','C']);const file=path.join(root,'contract-backend.v1.json'),j=JSON.parse(fs.readFileSync(file));j.slots[0].systemIdentity.targetId=77;fs.writeFileSync(file,JSON.stringify(j));assert.equal(run(root,['delete','C'],1).status,'identity-conflict');const q=run(root,['recover','C']);assert.equal(q.groups[0].slots[0].slotId,before.groups[0].slots[0].slotId);assert.equal(q.groups[0].slots[0].identityRemap.actual.targetId,77);assert.equal(q.pending,null);
});
test('failure: failed delete retains last-success and requires explicit recovery',()=>{
 const root=sandbox();const before=run(root,['create','A']);run(root,['create','B']);assert.equal(run(root,['delete','A','--fault','remove'],1).status,'pending-recovery');const q=run(root,['query']);assert.deepEqual(q.groups[0],before.groups[0]);assert.equal(q.pending.kind,'delete');assert.equal(run(root,['recover','A']).pending,null);assert.equal(run(root,['query']).backendSlotCount,3);
});
test('topology: successful update preserves other groups and overlapping update is refused',()=>{
 const root=sandbox();run(root,['create','A']);run(root,['create','B']);const b=run(root,['query','--group','B']).groups[0];const q=run(root,['update','A','--slot','1=1280x720@60/1:SDR']);assert.equal(q.groups[0].slots[0].lastSuccess.width,1280);assert.deepEqual(q.groups[1],b);assert.equal(run(root,['update','A','--slot','1=1920x2000@60/1:SDR'],1).status,'unsupported');assert.deepEqual(run(root,['query']).groups,q.groups);
});
test('registry: lock contention returns within 2s and does not mutate the waiting group',async()=>{
 const root=sandbox();run(root,['query']);const p=spawn(binary,['vdisplay','create','A','--test-provider','--test-root',root,'--fault','hold-lock','--json'],{windowsHide:true});const finished=new Promise((resolve,reject)=>{p.on('error',reject);p.on('close',resolve);});let journal=false;for(let i=0;i<100;i++){if(fs.existsSync(path.join(root,'display-registry.v1.json'))){journal=true;break;}await new Promise(r=>setTimeout(r,20));}assert.equal(journal,true);const began=Date.now();assert.equal(run(root,['create','B'],1).status,'timeout');assert.ok(Date.now()-began<2400);assert.equal(await finished,0);assert.deepEqual(run(root,['query']).groups.map(g=>g.groupName),['A']);
});
test('registry: total 10s deadline terminates uncertain provider and retains durable journal',()=>{
 const root=sandbox();const began=Date.now();const r=spawnSync(binary,['vdisplay','create','A','--test-provider','--test-root',root,'--fault','deadline','--json'],{encoding:'utf8',windowsHide:true,timeout:11500});assert.equal(r.status,124);assert.equal(JSON.parse(r.stdout).status,'timeout');assert.ok(Date.now()-began<11000);const q=run(root,['query']);assert.equal(q.pending.stage,'creating');assert.equal(q.backendSlotCount,1);assert.equal(run(root,['recover','A']).backendSlotCount,2);
});
test('topology: whole D rejection preserves A B C and capacity rejects before effects',()=>{
 const root=sandbox();for(const g of ['A','B','C'])run(root,['create',g]);const before=run(root,['query']);assert.equal(run(root,['create','D','--fault','hdr-unsupported'],1).status,'unsupported');assert.deepEqual(run(root,['query']).groups,before.groups);run(root,['create','D']);for(const g of ['E','F','G'])run(root,['create',g,'--slot','1=1920x1080@60/1:SDR']);assert.equal(run(root,['query']).backendSlotCount,10);assert.equal(run(root,['create','H','--slot','1=1920x1080@60/1:SDR'],1).status,'unsupported');assert.equal(run(root,['recover','A']).backendSlotCount,10);
});
test('tracer: real core stop ack destroy does not delete persistent contract display groups',()=>{
 const root=sandbox();const before=run(root,['create','A']);const r=spawnSync(product,['--self-test','--automation'],{encoding:'utf8',windowsHide:true,timeout:5000});assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stdout,/stop=0 ack=0 destroy=0/);assert.deepEqual(run(root,['query']).groups,before.groups);
});
assert.ok(requiredCases>0,'The requested native suite must discover at least one required behavior case');
