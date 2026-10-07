'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
test('planning CLI retains completed requirements and rejects duplicate or unmapped completed rows',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'aether planning states '));t.after(()=>{assert.equal(path.dirname(path.resolve(dir)),fs.realpathSync(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});});for(const d of ['docs','.planning/research','references'])fs.mkdirSync(path.join(dir,d),{recursive:true});
 for(const p of ['README.md','AGENTS.md','references/UPSTREAM.md','.planning/PROJECT.md','.planning/STATE.md'])fs.writeFileSync(path.join(dir,p),'fixture');
 const req='- [x] **BASE-01**: finished baseline\n- [ ] **ORIG-01**: planned product\n\n| BASE-01 | Phase 1 | Complete |\n| ORIG-01 | Phase 2 | Pending |\n';fs.writeFileSync(path.join(dir,'.planning/REQUIREMENTS.md'),req);
 fs.writeFileSync(path.join(dir,'.planning/ROADMAP.md'),[1,2].map(n=>`### Phase ${n}: fixture\n**Requirements:** ${n===1?'BASE-01':'ORIG-01'}\n**Depends on:** ${n===1?'None':'Phase 1'}\n**Success Criteria**:\n\n1. first criterion\n2. second criterion\n\n**Plans:** 1\n`).join('\n')+'\n## Progress\n');
 fs.writeFileSync(path.join(dir,'.planning/config.json'),JSON.stringify({mode:'interactive',granularity:'fine',commit_docs:true}));fs.writeFileSync(path.join(dir,'references/upstream-lock.json'),JSON.stringify({repositories:[{name:'fixture',commit:'a'.repeat(40),path:'references/upstream/fixture'}]}));
 const run=()=>spawnSync(process.execPath,[path.resolve(__dirname,'../scripts/validate-planning.cjs'),'--root',dir],{encoding:'utf8',windowsHide:true,timeout:5000});let r=run();assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).v1Requirements,2);assert.equal(JSON.parse(r.stdout).mapped,2);
 fs.writeFileSync(path.join(dir,'.planning/REQUIREMENTS.md'),req+'- [x] **BASE-01**: duplicate finished ID\n');assert.notEqual(run().status,0);
 fs.writeFileSync(path.join(dir,'.planning/REQUIREMENTS.md'),req.replace('| BASE-01 | Phase 1 | Complete |\n',''));assert.notEqual(run().status,0);
});
