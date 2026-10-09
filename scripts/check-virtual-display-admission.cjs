'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const upstream=JSON.parse(fs.readFileSync(path.join(root,'references/upstream-lock.json'),'utf8')).repositories;
const fixedSources={'apollo-sudovda':'apollo','virtualdrivers-vdd':'virtual-display-driver'};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const digest=/^[a-f0-9]{64}$/i,commit=/^[a-f0-9]{40}$/i;
const requested=[['A',1,1920,1080,'SDR'],['A',2,2560,1440,'SDR'],['B',1,1920,1080,'SDR'],['C',1,1920,1080,'SDR'],['C',2,1920,1080,'SDR'],['D',1,1920,1080,'SDR'],['D',2,1920,1080,'HDR']].map(([group,slot,width,height,color])=>({group,slot,width,height,refresh:{numerator:60,denominator:1},color}));
const requestedByPlatform={windows10:requested.map(r=>({...r,refresh:{...r.refresh},color:'SDR'})),windows11:structuredClone(requested)};
const revisionPath='docs/phase03/SUDOVDA-REQUIREMENTS-REVISION.md';
function equivalentRefresh(actual,expected){const valid=r=>r&&[r.numerator,r.denominator].every(n=>Number.isSafeInteger(n)&&n>0&&n<=0xffffffff);return Boolean(valid(actual)&&valid(expected)&&BigInt(actual.numerator)*BigInt(expected.denominator)===BigInt(expected.numerator)*BigInt(actual.denominator));}
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value;}
function dossierHash(d){const copy=structuredClone(d);delete copy.decision;return sha(JSON.stringify(canonical(copy)));}
function localFile(relative){if(typeof relative!=='string'||path.isAbsolute(relative))throw Error('relative evidence path required');const p=fs.realpathSync(path.resolve(root,relative));const rel=path.relative(root,p);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('evidence outside repository');return p;}
function evidence(record){try{return record?.fixture===false && digest.test(record.sha256||'') && sha(fs.readFileSync(localFile(record.path)))===record.sha256.toLowerCase();}catch{return false;}}
function admission(c){
 const errors=[],bad=(condition,message)=>{if(!condition)errors.push(`${c?.providerId||'provider'}: ${message}`);};
 if(!c)return ['provider: no selected candidate'];
 bad(c.fixture===false,'fixture must never enter real admission');bad(commit.test(c.sourceCommit||''),'source commit must be fixed');
 const locked=upstream.find(r=>r.name===fixedSources[c.providerId]);if(locked){bad(c.sourceCommit===locked.commit,'source commit differs from fixed repository');bad(c.officialRepository===locked.url.replace(/\.git$/,''),'source official repository mismatch');}
 const p=c.package||{},s=p.signature||{};
 if(p.origin?.kind==='local-derived'){
  bad(c.providerId==='aether-helios-display','local origin only permitted for dedicated derivation');
  bad(c.sourceCommit==='a4b09fa2aa731a964d0cb5d139cb1e6240e4da12','derived base commit must match approved SudoVDA pin');
  bad(c.officialRepository==='https://github.com/Jerry12228/Aether','derived repository must be the Aether repository');
  bad(p.url===null||p.url===undefined,'derived origin cannot masquerade as upstream release URL');
  bad(/^\d+\.\d+\.\d+\.\d+$/.test(p.version||''),'derived version must be a fixed INF version');
  bad(evidence(p.origin.sourceManifest),'derived source manifest evidence required');
  bad(evidence(p.origin.buildEvidence),'derived build evidence required');
  bad(/^artifacts\/phase03\/derived-research\/helios-\d+\/research-source\.json$/.test(p.origin.sourceManifest?.path||''),'derived source manifest must be a distinct research tree');
  try{
   const source=JSON.parse(fs.readFileSync(localFile(p.origin.sourceManifest.path),'utf8'));
   const sourceRoot=path.dirname(localFile(p.origin.sourceManifest.path));
   const original=JSON.parse(fs.readFileSync(path.join(root,'docs/phase03/SUDOVDA-SOURCE-EVIDENCE.json'),'utf8'));
   bad(source.sourceCommit===c.sourceCommit&&source.sourceCommit===original.sourceCommit,'derived manifest base mismatch');
   bad(source.hardwareId==='Root\\Aether\\HeliosDisplay'&&source.interfaceGuid==='0d9ecbde-124e-45f0-9ae0-3d71b16a7725'&&source.deviceAcl==='D:P(A;;GA;;;SY)(A;;GA;;;BA)','derived identity and ACL mismatch');
   bad(Array.isArray(source.files)&&source.files.length===8,'derived source manifest must contain exactly eight build inputs');
   const paths=new Set();
   const expectedSources=original.files.filter(f=>!/(?:^README\.md$|\.sln$|\.filters$|\.edid$|\/option\.txt$)/i.test(f.path)).map(f=>f.path).sort();
   bad(JSON.stringify((source.files||[]).map(f=>f.sourcePath).sort())===JSON.stringify(expectedSources),'derived source inventory differs from approved build boundary');
   for(const file of source.files||[]){
    const upstreamFile=original.files.find(f=>f.path===file.sourcePath);
    bad(upstreamFile&&upstreamFile.sha256===file.sourceSha256,'derived original input mismatch');
    bad(typeof file.outputPath==='string'&&!path.isAbsolute(file.outputPath)&&!file.outputPath.split(/[\\/]/).includes('..')&&!paths.has(file.outputPath),'derived source path invalid or duplicate');paths.add(file.outputPath);
    const relative=path.relative(root,path.resolve(sourceRoot,file.outputPath));
    bad(evidence({path:relative,sha256:file.sha256,fixture:false}),'derived transformed input bytes mismatch');
   }
   const expectedInputs=['scripts/prepare-helios-display-research.cjs','scripts/helios-display-inputs.cjs','tools/helios-display-research/AdapterOption.h','tools/helios-display-research/HeliosDisplay.inf','tools/helios-display-research/HeliosDisplay.vcxproj'];
   bad(JSON.stringify((source.independentInputs||[]).map(x=>x.path).sort())===JSON.stringify(expectedInputs.sort()),'derived transformation input inventory mismatch');
   for(const input of source.independentInputs||[])bad(evidence({...input,fixture:false}),'derived transformation input bytes mismatch');
  }catch{bad(false,'derived source manifest unavailable or malformed');}
 }else{
  bad(typeof p.url==='string' && p.url.startsWith(`${c.officialRepository}/releases/download/`),'source package URL must be official fixed release');
  bad(typeof p.version==='string' && p.url?.includes(`/releases/download/${p.version}/`),'version must match fixed release URL');
 }
 bad(p.architecture==='x64','architecture must be audited x64 prototype');bad(digest.test(p.sha256||''),'sha256 must be a real locked digest');
 bad(Number.isSafeInteger(p.length)&&p.length>0,'package length required');bad(p.complete===true,'complete package required');
 bad(p.sourceCorrespondence?.status==='verified' && evidence(p.sourceCorrespondence),'source correspondence audit required');
 bad(p.licenseEvidence?.status==='verified' && evidence(p.licenseEvidence),'independent package license audit required');
 bad(s.policyVerified===true && s.catalogMembersVerified===true && s.timestampVerified===true && evidence(s),'signature policy, CAT members and timestamp evidence required');
 bad((p.kind==='umdf' && s.policy==='umdf-authenticode') || (p.kind==='kernel' && s.policy==='kernel-microsoft'),'signature policy must match audited driver kind');
 const ie=c.interfaceEvidence||{};
 for(const cap of ['perSlotOperations','stableIdentity','sevenSlotCapacity','shortProcessPersistence','strictModes','win10Route','win11Route'])bad(ie[cap]?.status==='verified' && evidence(ie[cap]),`interface ${cap} evidence required`);
 bad(ie.acl?.status==='verified' && evidence(ie.acl),'acl must close provider device/IOCTL bypass risk');
 bad(Array.isArray(c.risks) && !c.risks.some(r=>['high','critical'].includes(r.severity)&&r.status!=='mitigated'),'acl/security high risks remain open');
 try{const bytes=fs.readFileSync(localFile(p.localPath));bad(bytes.length===p.length,'package length mismatch');bad(sha(bytes)===p.sha256?.toLowerCase(),'sha256 package mismatch');}catch{errors.push(`${c.providerId}: package artifact unavailable`);}
 bad(Array.isArray(p.members)&&p.members.some(m=>/\.inf$/i.test(m.name))&&p.members.some(m=>/\.cat$/i.test(m.name))&&p.members.some(m=>/\.dll$/i.test(m.name)),'INF CAT DLL members required');
 for(const m of p.members||[])if(/\.(inf|dll|sys)$/i.test(m.name))bad(m.catalogRequired===true,`signature CAT policy cannot exclude ${m.name}`);
 for(const m of p.members||[]){try{const b=fs.readFileSync(localFile(m.localPath));bad(b.length===m.length && sha(b)===m.sha256?.toLowerCase(),`sha256 member ${m.name}`);if(/\.inf$/i.test(m.name)){const text=b.toString(b[0]===0xff&&b[1]===0xfe?'utf16le':'utf8');bad(text.includes(p.infVersion||'IMPOSSIBLE'),'version INF bytes mismatch');bad(/NTamd64/i.test(text),'architecture INF bytes mismatch');}}catch{errors.push(`${c.providerId}: member artifact missing ${m.name}`);}}
 // Recheck Windows catalog trust/member policy only after every prerequisite closes.
 if(!errors.length){
  const tool='C:/Program Files (x86)/Windows Kits/10/bin/10.0.28000.0/x64/signtool.exe';
  try{const cat=p.members.find(m=>/\.cat$/i.test(m.name));for(const m of p.members.filter(m=>m.catalogRequired)){const r=spawnSync(tool,['verify',s.policy==='umdf-authenticode'?'/pa':'/kp','/v','/c',localFile(cat.localPath),localFile(m.localPath)],{encoding:'utf8',timeout:10000,windowsHide:true});bad(r.status===0,'signature independent Windows policy recheck failed');}}catch{errors.push(`${c.providerId}: signature verifier unavailable`);}
 }
 return errors;
}
function validate(d,{stage='dossier',requireDecision=false,providerId}={}){
 const errors=[],bad=(condition,message)=>{if(!condition)errors.push(message);};
 if(!d || typeof d!=='object')return {ok:false,stage,errors:['dossier object required']};
 bad(['dossier','admission','authorization'].includes(stage),'unknown stage');bad([1,2].includes(d.schemaVersion),'schemaVersion 1 or 2 required');
 if(d.schemaVersion===2){
  bad(d.requirementRevision?.id==='R1'&&d.requirementRevision?.path===revisionPath&&evidence(d.requirementRevision),'R1 requirement revision must bind actual approved document hash');
  if(d.recommendation?.proposal)bad(d.recommendation.proposalEvidence?.path===d.recommendation.proposal&&evidence(d.recommendation.proposalEvidence),'R1 route proposal must bind actual review document hash');
  bad(!Object.hasOwn(d,'requested'),'R1 uses platform requests only; ambiguous legacy requested field refused');
  bad(JSON.stringify(canonical(d.requestedByPlatform))===JSON.stringify(canonical(requestedByPlatform)),'R1 requires Win10 seven SDR slots and Win11 D2 HDR at exact requested 60/1');
 }else{
  bad(!Object.hasOwn(d,'requestedByPlatform')&&!Object.hasOwn(d,'requirementRevision'),'legacy schema cannot assert revised platform requirements');
  bad(JSON.stringify(d.requested)===JSON.stringify(requested),'original four groups seven slots exact 60/1 SDR/HDR requests required');
 }
 bad(d.constraints?.strictNoDowngrade===true && d.constraints?.windows10And11===true,'original constraints required');
 bad(Array.isArray(d.candidates)&&d.candidates.length>=5,'all five researched candidates required');
 const ids=new Set();for(const c of d.candidates||[]){
  bad(typeof c.providerId==='string'&&!ids.has(c.providerId),'unique providerId required');ids.add(c.providerId);
  bad(typeof c.officialRepository==='string'&&c.officialRepository.startsWith('https://'),'official source required');
  bad(typeof c.fixture==='boolean','fixture classification required');bad(Array.isArray(c.gaps)&&(c.gaps.length>0||c.admission?.status==='admitted'),`${c.providerId}: explicit gaps required`);
  function walk(v,prefix){if(v===null)bad(c.gaps?.some(g=>g.field && (prefix===g.field||prefix.startsWith(g.field+'.')) && g.reason),`${c.providerId}: unexplained null ${prefix}`);else if(Array.isArray(v))v.forEach((x,i)=>walk(x,`${prefix}.${i}`));else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v))walk(x,prefix?`${prefix}.${k}`:k);}
  walk(c,'');bad(Array.isArray(c.interfaceEvidence?.methods)&&c.interfaceEvidence.methods.length>0,`${c.providerId}: complete known method inventory required`);
  for(const [name,record]of Object.entries(c.interfaceEvidence||{}))if(record?.status==='verified')bad(evidence(record),`${c.providerId}: ungrounded verified interface ${name}`);
  if(c.admission?.status==='admitted')bad(admission(c).length===0,`${c.providerId}: declared admission has unclosed gates`);
 }
 bad(d.productionEvidence?.status==='pending' && Array.isArray(d.productionEvidence.records) && d.productionEvidence.records.length===0,'machine PASS cannot be asserted by this pre-install dossier; use later machine verifier');
 bad(d.machineAuthorization?.status==='not-authorized' || d.machineAuthorization?.status==='authorized','machineAuthorization must be explicit');
 bad(Array.isArray(d.systemPlan?.conflicts)&&d.systemPlan?.rollback && d.systemPlan?.reboot==='manual-only','concrete conflicts rollback and manual reboot plan required');
 bad(Array.isArray(d.gaps)&&d.gaps.length>0,'top-level remaining gates required');
 const selected=d.candidates?.find(c=>c.providerId===(providerId||d.selectedProviderId));
 const eligible=(d.candidates||[]).filter(c=>admission(c).length===0).map(c=>c.providerId);
 bad(JSON.stringify(d.admission?.eligibleProviderIds)===JSON.stringify(eligible),'global admission eligible list must match independent gates');
 bad(eligible.length?d.admission?.status==='eligible-candidate':d.admission?.status==='no-qualified-candidate','global admission status must match independent gates');
 if(stage!=='dossier')errors.push(...admission(selected));
 if(requireDecision){const v=d.decision;bad(v && ['admitted-provider','no-qualified-provider'].includes(v.status),'concrete user decision required');bad(typeof v?.userText==='string'&&v.userText.trim().length>0 && Number.isFinite(Date.parse(v?.recordedAt)),'decision user original text and time required');bad(v?.dossierSha256===dossierHash(d),'decision dossier hash mismatch');
  if(v?.status==='no-qualified-provider'){bad(stage==='dossier','no-qualified-provider only satisfies dossier decision gate');bad(v.providerId===null && d.selectedProviderId===null && typeof v.nextAction==='string'&&v.nextAction.length>0,'no-qualified-provider requires concrete next action');bad(d.candidates?.every(c=>admission(c).length>0),'no-qualified-provider inconsistent with eligible candidate');}
  else if(v?.status==='admitted-provider'){bad(v.providerId===d.selectedProviderId,'selected provider decision mismatch');errors.push(...admission(d.candidates?.find(c=>c.providerId===v.providerId)));}
 }
 if(stage==='authorization'){const a=d.machineAuthorization;bad(a?.status==='authorized'&&a?.providerId===d.selectedProviderId && typeof a?.machineId==='string'&&a.machineId.length>0 && Array.isArray(a?.scenarios)&&a.scenarios.length>0 && digest.test(a?.planSha256||'') && a.planSha256===sha(JSON.stringify(canonical(d.systemPlan))) && typeof a?.userText==='string'&&a.userText.length>0 && Number.isFinite(Date.parse(a?.recordedAt)),'machineAuthorization requires concrete machine scenarios plan hash user text and time');bad(d.decision?.status==='admitted-provider','authorization needs admitted-provider decision');}
 return {ok:errors.length===0,stage,selectedProviderId:selected?.providerId||null,errors,dossierSha256:dossierHash(d)};
}
if(require.main===module){try{const args=process.argv.slice(2);let stage='dossier',requireDecision=false,file='docs/phase03/PROVIDER-ADMISSION-R1.json',providerId;for(let i=0;i<args.length;i++){if(args[i]==='--stage')stage=args[++i];else if(args[i]==='--require-decision')requireDecision=true;else if(args[i]==='--file')file=args[++i];else if(args[i]==='--provider')providerId=args[++i];else throw Error('Unknown argument');}const result=validate(JSON.parse(fs.readFileSync(path.resolve(root,file),'utf8')),{stage,requireDecision,providerId});console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;}catch(e){console.error(JSON.stringify({ok:false,error:e.message}));process.exitCode=1;}}
module.exports={validate,dossierHash,admission,requested,requestedByPlatform,equivalentRefresh};
