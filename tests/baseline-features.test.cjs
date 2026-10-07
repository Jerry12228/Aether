'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const api=require('../scripts/validate-baseline.cjs');
const script=path.resolve(__dirname,'../scripts/validate-baseline.cjs');
let base;
test.before(()=>{
  if(typeof api.validateFeatures!=='function')return;
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'aether-feature-'));
  const repo=path.join(root,'references/upstream/moonlight-qt');fs.mkdirSync(repo,{recursive:true});
  for(const d of ['docs/baseline','.planning'])fs.mkdirSync(path.join(root,d),{recursive:true});
  const git=(...args)=>{const r=spawnSync('git',['-C',repo,...args],{encoding:'utf8',windowsHide:true,timeout:15000});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
  const url='https://github.com/moonlight-stream/moonlight-qt.git';git('remote','add','origin',url);
  fs.writeFileSync(path.join(repo,'settings.h'),'Q_PROPERTY(bool reverseScrollDirection MEMBER reverseScrollDirection)\n');
  fs.writeFileSync(path.join(repo,'mouse.cpp'),'if (reverseScrollDirection) delta = -delta;\n');
  git('add','.');git('commit','-qm','fixture');const commit=git('rev-parse','HEAD');
  const lock={schemaVersion:1,repositories:[{name:'moonlight-qt',url,commit,path:'references/upstream/moonlight-qt'}]};
  fs.writeFileSync(path.join(root,'references/upstream-lock.json'),JSON.stringify(lock));
  fs.writeFileSync(path.join(root,'.planning/REQUIREMENTS.md'),'- [ ] **INPUT-01**: 滚动输入。\n| INPUT-01 | Phase 11 | Pending |\n');
  fs.writeFileSync(path.join(root,'.planning/ROADMAP.md'),'### Phase 11: Input\n**Requirements:** INPUT-01\n');
  const ctx=api.context(root,lock.repositories[0]);const a=api.anchorFor(ctx,'settings.h',1,1,'reverseScrollDirection'),b=api.anchorFor(ctx,'mouse.cpp',1,1,'scroll consumption');
  const f={id:'scroll-windows',capability:'滚轮方向',platform:'selene-windows',originalBehavior:'设置反向后滚动方向反转',anchors:[a,b],settingIds:['reverseScrollDirection'],conditions:{os:'Windows',architecture:'x64',hardware:'鼠标'},ownerTier:'shared-native',requirementIds:['INPUT-01'],primaryPhase:11,mappingState:'mapped',caseIds:['scroll-case'],aetherBehavior:'租约内发送滚动事件',implementationEvidence:[],buildEvidence:[],automationEvidence:[],hardwareEvidence:[],hardwareTodoId:null,blockerIds:[]};
  const data={schemaVersion:1,capturedAt:'2026-10-07',purpose:'fixture',scope:{platforms:['selene-windows'],complete:false},features:[f],surfaces:[{id:'settings',repo:'moonlight-qt',platform:'selene-windows',kind:'setting',path:'settings.h',anchors:[a],inventoryKeys:['reverseScrollDirection'],entries:[{key:'reverseScrollDirection',featureIds:[f.id],disposition:'mapped',reason:'方向设置',anchors:[a]}],reviewed:true}],cases:[{id:'scroll-case',featureIds:[f.id],platform:f.platform,preconditions:['配对并取得租约'],steps:['启用反向滚动后向上滚轮'],expectedResults:['主机收到向下滚动'],negativeCases:['旧epoch事件拒绝'],evidenceRequired:['实现','构建','自动化','实机'],verificationPhase:11,status:'planned',evidence:[]}],conflicts:[]};
  const sources={files:[{repo:'moonlight-qt',path:'settings.h',blob:a.blob,commit},{repo:'moonlight-qt',path:'mouse.cpp',blob:b.blob,commit}],blockers:[]};
  base={root,data,sources};
});
test.after(()=>{if(base){const resolved=path.resolve(base.root);assert.equal(path.dirname(resolved),fs.realpathSync(os.tmpdir()));fs.rmSync(resolved,{recursive:true,force:true});}});
const fixture=()=>{assert.equal(typeof api.validateFeatures,'function','feature validator must exist');return structuredClone(base);};
test('feature tracer validates a fixed Git behavior and renders through CLI',()=>{
  const f=fixture();assert.deepEqual(api.validateFeatures({...f,scope:'qt-windows'}).errors,[]);
  fs.writeFileSync(path.join(f.root,'docs/baseline/features.json'),JSON.stringify(f.data));fs.writeFileSync(path.join(f.root,'docs/baseline/sources.json'),JSON.stringify(f.sources));
  const r=spawnSync(process.execPath,[script,'--root',f.root,'--features','--scope','qt-windows','--report','docs/FEATURE-PARITY.md'],{encoding:'utf8',timeout:15000,windowsHide:true});assert.equal(r.status,0,r.stderr);assert.ok(JSON.parse(r.stdout).checked>0);assert.match(fs.readFileSync(path.join(f.root,'docs/FEATURE-PARITY.md'),'utf8'),/reverseScrollDirection/);
});
for(const [name,mutate,match]of[
  ['no behavior anchor',f=>f.data.features[0].anchors=[],/anchor/],
  ['wrong blob',f=>f.data.features[0].anchors[0].blob='b'.repeat(40),/blob/],
  ['forged excerpt',f=>f.data.features[0].anchors[0].excerpt='forged',/excerpt/],
  ['duplicate ID',f=>f.data.features.push(structuredClone(f.data.features[0])),/duplicate/],
  ['uncovered setting',f=>f.data.surfaces[0].entries=[],/coverage|uncovered/],
  ['inventory omission',f=>{f.data.surfaces[0].entries=[];f.data.surfaces[0].inventoryKeys=[];},/inventory|coverage/],
  ['unreviewed surface',f=>f.data.surfaces[0].reviewed=false,/review/],
  ['wrong phase',f=>f.data.features[0].primaryPhase=37,/phase|mapping/],
  ['no case',f=>f.data.features[0].caseIds=[],/case/],
  ['empty negative case',f=>f.data.cases[0].negativeCases=[],/case/],
  ['unknown owner',f=>f.data.features[0].ownerTier='dart-frames',/owner/],
  ['unapproved TODO',f=>f.data.features[0].hardwareTodoId='DROP-01',/TODO/],
  ['Apple false hardware evidence',f=>{f.data.features[0].platform='selene-macos';f.data.scope.platforms=['selene-macos'];f.data.features[0].hardwareTodoId='VFY-02';f.data.features[0].hardwareEvidence=[{kind:'build',status:'passed'}];},/hardware|platform/],
  ['passed product case',f=>f.data.cases[0].status='passed',/evidence|case/],
  ['no conditions',f=>f.data.features[0].conditions={},/condition/],
  ['unknown source',f=>f.data.features[0].anchors[0].repo='unknown',/source|repository/],
  ['full scope missing platforms',f=>f.data.scope.complete=true,/platform/]
])test(`features reject ${name}`,()=>{const f=fixture();mutate(f);const r=api.validateFeatures({...f,scope:'qt-windows'});assert.ok(r.errors.length);assert.match(r.errors.join('\n'),match);});
test('feature unmapped mode reports debt but strict mode fails',()=>{const f=fixture();f.data.features[0].mappingState='needs-requirement';f.data.features[0].requirementIds=[];assert.equal(api.validateFeatures({...f,scope:'qt-windows',allowUnmapped:true}).unmapped.length,1);assert.ok(api.validateFeatures({...f,scope:'qt-windows'}).errors.length);});
test('feature CLI fails without replacing an existing report',()=>{const f=fixture();f.data.features[0].anchors=[];fs.writeFileSync(path.join(f.root,'docs/baseline/features.json'),JSON.stringify(f.data));fs.writeFileSync(path.join(f.root,'docs/baseline/sources.json'),JSON.stringify(f.sources));const p=path.join(f.root,'docs/FEATURE-PARITY.md');fs.writeFileSync(p,'preserve');const r=spawnSync(process.execPath,[script,'--root',f.root,'--features','--scope','qt-windows','--report','docs/FEATURE-PARITY.md'],{encoding:'utf8',timeout:15000,windowsHide:true});assert.notEqual(r.status,0);assert.equal(fs.readFileSync(p,'utf8'),'preserve');});
