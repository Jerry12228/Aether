'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const categories=['boundary','adjacency','empty','encoding','ordering','precision','idempotency','concurrency'];
const requirements=['NET-01','NET-02','NET-03'];
const sourceCommit='4edaf0352ca1b875e3536fe54970e8b85585c794';
const inputDigest='7ca1594252b56ee2fe36d99d13ad1b63e4f2ca69eead8784a29503d714ce2369';
function safe(file){assert.equal(typeof file,'string');assert.ok(file&&!path.isAbsolute(file)&&!file.includes('\\')&&!file.split('/').some(x=>['','..','.'].includes(x)),'Unsafe evidence path');return file;}
function verifyCloseout(c,{read=file=>fs.readFileSync(path.join(root,safe(file)))}={}){
 assert.equal(c.schema,1);assert.equal(c.sourceCommit,sourceCommit);assert.equal(c.inputDigest,inputDigest);
 assert.equal(c.authorization.statement,'自行推进完成6');assert.equal(c.authorization.mode,'autonomous-scoped-closeout');
 assert.equal(c.authorization.fabricatedHumanApproval,false);assert.equal(c.scope,'Phase6 synthetic protocol prototype');
 const bound=row=>{const bytes=read(safe(row.file));assert.equal(sha(bytes),row.sha256,'Evidence drift: '+row.file);return bytes;};
 const original=JSON.parse(bound(c.originalProbe));assert.equal(original.items.length,3);assert.deepEqual(original.items.map(x=>x.requirement_id),requirements);
 assert.ok(original.items.every(x=>x.status==='unresolved'&&x.category==='unclassified'&&x.verification===null&&x.resolution===null&&x.reason===null));
 const targets=JSON.parse(bound(c.originalTargets));assert.equal(targets.sourceCommit,sourceCommit);assert.equal(targets.inputDigest,inputDigest);
 assert.equal(c.classifier.explanation,'English-only shape cues did not classify the Chinese input');assert.equal(c.classifier.originalShapeCount,0);
 const classifier=bound(c.classifier.module).toString();assert.ok(classifier.includes('SHAPE_CUES')&&classifier.includes('unclassified — review manually'));
 assert.equal(c.classifier.researchOnly,true);assert.deepEqual(c.classifier.requirements.map(x=>x.id),requirements);
 const requirementDoc=read('.planning/REQUIREMENTS.md').toString();for(const r of c.classifier.requirements){assert.ok(requirementDoc.includes('**'+r.id+'**: '+r.text),'Original approved requirement changed');}
 assert.equal(c.historicalResolution.items.length,3);assert.equal(c.historicalResolution.coverage.unresolved,0);
 assert.equal(new Set(c.historicalResolution.items.map(x=>x.requirement_id)).size,3);
 for(const row of c.historicalResolution.items){assert.ok(requirements.includes(row.requirement_id));assert.equal(row.category,'unclassified');assert.equal(row.status,'dismissed');assert.equal(row.verification,null);assert.ok(row.reason.length>30);}
 assert.equal(c.definitions.length,24);assert.equal(new Set(c.definitions.map(x=>x.requirement+'::'+x.category)).size,24);
 const checked=new Map();const bindCached=row=>{const key=row.file+'::'+row.sha256;if(!checked.has(key))checked.set(key,bound(row));return checked.get(key);};
 for(const id of requirements){assert.deepEqual(c.definitions.filter(x=>x.requirement===id).map(x=>x.category).sort(),[...categories].sort());}
 for(const d of c.definitions){assert.equal(d.verification,'explicit');assert.ok(d.trigger.length>8&&d.expected.length>8,'Concrete condition required');assert.ok(d.contracts.length>0&&d.observations.length>0);
  for(const row of d.contracts){const body=bindCached(row).toString();assert.ok(row.anchor&&body.includes(row.anchor),'Contract anchor missing');}
  for(const row of d.observations){const body=bindCached(row).toString();assert.ok(row.case&&body.split(/\r?\n/).some(l=>l.startsWith('✔ '+row.case+' (')||new RegExp('^ok \\d+ - '+row.case.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$').test(l)),'Actual passing case missing: '+row.case);}
 }
 assert.equal(c.prohibitions.length,6);assert.equal(c.prohibitions.filter(x=>x.verification==='test').length,3);assert.equal(c.prohibitions.filter(x=>x.verification==='judgment').length,3);
 assert.deepEqual(c.prohibitions.map(x=>x.statement),targets.flagged.prohibitions.map(x=>x.statement));
 c.prohibitions.forEach((p,i)=>{const o=targets.flagged.prohibitions[i];assert.equal(p.requirement_id,o.requirement_id);assert.equal(p.category,o.category);assert.equal(p.source,o.source);assert.equal(p.originalStatus,o.status);assert.equal(p.status,'resolved');assert.ok(p.resolution.includes(p.statement));});
 for(const p of c.prohibitions){assert.ok(p.scope&&p.evidence.length);for(const row of p.evidence)bindCached(row);if(p.verification==='judgment'){assert.equal(p.authority,'NON-AUTHORITATIVE LLM-judge');assert.equal(p.review,'reviewed-autonomously');assert.equal(p.flag,'unverified-prohibition — human review recommended');}else {assert.equal(p.result,'verified-scoped-test');assert.ok(p.cases.length);for(const name of p.cases)assert.ok(c.definitions.some(d=>d.observations.some(x=>x.case===name)));}}
 assert.equal(c.advisories.length,3);assert.deepEqual(c.advisories,c.prohibitions.filter(x=>x.verification==='judgment').map(x=>({statement:x.statement,flag:x.flag})));
 assert.equal(c.canonical.coverage.unresolved,0);assert.equal(c.canonical.coverage.resolved,24);assert.equal(c.canonical.items.length,24);
 assert.equal(new Set(c.canonical.items.map(x=>x.requirement_id+'::'+x.category)).size,24);
 for(const row of c.canonical.items){assert.equal(row.status,'resolved');assert.equal(row.verification,'explicit');const d=c.definitions.find(x=>x.requirement===row.requirement_id&&x.category===row.category);assert.ok(d&&row.resolution===d.expected);}
 assert.deepEqual(c.preserved,{phase3:3,plan3:3,status:'halted',systemMutation:false,productInputChanged:false});
 return {passed:true,explicitEdges:24,dismissedClassifierWarnings:3,objectiveProhibitions:3,autonomousJudgmentAdvisories:3,sourceCommit,inputDigest};
}
module.exports={verifyCloseout,sha};
if(require.main===module){try{console.log(JSON.stringify(verifyCloseout(JSON.parse(fs.readFileSync(path.join(root,'docs/phase06/06-CLOSEOUT.json'))))));}catch(e){console.error(e.message);process.exitCode=1;}}
