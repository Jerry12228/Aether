'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {verifyCloseout}=require('../scripts/verify-phase06-closeout.cjs');
const root=path.resolve(__dirname,'..'),file=path.join(root,'docs/phase06/06-CLOSEOUT.json');
const fixture=()=>JSON.parse(fs.readFileSync(file));
test('actual closeout binds all explicit edges and retains autonomous judgment flags',()=>assert.deepEqual(verifyCloseout(fixture()).autonomousJudgmentAdvisories,3));
for(const [name,change]of [
 ['missing category',c=>c.definitions.pop()],
 ['duplicate category',c=>c.definitions[1]=structuredClone(c.definitions[0])],
 ['empty trigger',c=>c.definitions[0].trigger=''],
 ['missing contract',c=>c.definitions[0].contracts=[]],
 ['unknown contract anchor',c=>c.definitions[0].contracts[0].anchor='not-an-existing-approved-contract'],
 ['missing observed behavior',c=>c.definitions[0].observations=[]],
 ['invented observed pass',c=>c.definitions[0].observations[0].case='made-up-pass'],
 ['unresolved current edge',c=>c.canonical.items[0].status='unresolved'],
 ['undocumented dismissal',c=>c.historicalResolution.items[0].reason=''],
 ['changed product input',c=>c.inputDigest='0'.repeat(64)],
 ['unbound original probe',c=>c.originalProbe.sha256='0'.repeat(64)],
 ['unsafe artifact path',c=>c.originalProbe.file='../escape.json'],
 ['hidden judgment warnings',c=>c.advisories=[]],
 ['fabricated human approval',c=>c.authorization.fabricatedHumanApproval=true],
 ['judgment promoted to test',c=>c.prohibitions.find(x=>x.verification==='judgment').verification='test'],
 ['lost phase3 installation gate',c=>c.preserved.status='complete']
 ,['classifier input replaced',c=>c.classifier.requirements[0].text='Changed unapproved requirement']
 ,['duplicated historical dismissal',c=>c.historicalResolution.items[1]=structuredClone(c.historicalResolution.items[0])]
 ,['duplicated canonical category',c=>c.canonical.items[1]=structuredClone(c.canonical.items[0])]
 ,['prohibition owner forged',c=>c.prohibitions[0].requirement_id='NET-03']
 ,['unresolved prohibition',c=>c.prohibitions[0].status='unresolved']
])test('closeout rejects '+name,()=>{const c=fixture();change(c);assert.throws(()=>verifyCloseout(c));});
test('declared pass does not override missing actual log bytes',()=>{const c=fixture();c.passed=true;assert.throws(()=>verifyCloseout(c,{read:f=>f.includes('LastTest.log')?Buffer.from('PASS all tests'):fs.readFileSync(path.join(root,f))}));});
