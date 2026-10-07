'use strict';
const fs=require('node:fs'), path=require('node:path'), {spawnSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'), SHA=/^[0-9a-f]{40}$/, URL=/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/;
const sorted=xs=>xs.sort((a,b)=>Buffer.from(a.id||a.name).compare(Buffer.from(b.id||b.name)));
function decodeText(buffer){
  if(buffer[0]===0xff&&buffer[1]===0xfe)return buffer.subarray(2).toString('utf16le');
  if(buffer[0]===0xfe&&buffer[1]===0xff)return Buffer.from(buffer.subarray(2)).swap16().toString('utf16le');
  return buffer.toString('utf8').replace(/^\uFEFF/,'');
}
function safeRelative(p){if(typeof p!=='string'||!p||/[\\:\x00-\x1f]/.test(p)||p.startsWith('/')||p.split('/').some(s=>!s||s==='.'||s==='..'))throw Error(`invalid path: ${p}`);return p;}
function inside(base,target){const rel=path.relative(base,target);return !path.isAbsolute(rel)&&rel!=='..'&&!rel.startsWith(`..${path.sep}`);}
function guarded(root,relative){
  safeRelative(relative);const base=fs.realpathSync(root),target=path.resolve(base,relative);if(!inside(base,target))throw Error('path escape');
  let cursor=base;for(const part of relative.split('/')){cursor=path.join(cursor,part);if(fs.existsSync(cursor)&&!inside(base,fs.realpathSync(cursor)))throw Error(`symlink/reparse escape: ${relative}`);}return target;
}
function gitRun(cwd,args,input){
  const r=spawnSync('git',['--no-pager','-c','core.fsmonitor=false','-c','core.untrackedCache=false','-C',cwd,...args],{input,timeout:15000,maxBuffer:128*1024*1024,windowsHide:true,env:{...process.env,GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'}});
  if(r.error||r.status!==0)throw Error(`Git ${args[0]} failed: ${r.error?.message||r.stderr?.toString().slice(0,1000)||r.status}`);return r.stdout;
}
function readLock(root){
  const lock=JSON.parse(fs.readFileSync(guarded(root,'references/upstream-lock.json'),'utf8'));
  if(lock.schemaVersion!==1||!Array.isArray(lock.repositories)||!lock.repositories.length)throw Error('invalid lock schema');const names=new Set();
  for(const r of lock.repositories){if(!/^[a-z0-9-]+$/.test(r.name)||names.has(r.name)||!URL.test(r.url)||!SHA.test(r.commit)||r.path!==`references/upstream/${r.name}`)throw Error(`invalid lock name/path/URL/SHA: ${r.name}`);names.add(r.name);guarded(root,r.path);}return lock;
}
function selectRepos(lock,scope){const repos=scope?lock.repositories.filter(r=>r.name===scope):lock.repositories;if(!repos.length)throw Error(`unknown repository scope: ${scope}`);return repos;}
function context(root,repo,runner=gitRun){
  const cwd=guarded(root,repo.path);if(!fs.existsSync(cwd))throw Error(`missing checkout: ${repo.name}; restore explicitly`);
  const run=(args,input)=>{const out=runner(cwd,args,input);return Buffer.isBuffer(out)?out:Buffer.from(out);};
  if(fs.realpathSync(run(['rev-parse','--show-toplevel']).toString().trim())!==fs.realpathSync(cwd))throw Error(`not an independent checkout: ${repo.name}`);
  const head=run(['rev-parse','HEAD']).toString().trim();if(head!==repo.commit)throw Error(`HEAD SHA mismatch: ${repo.name}`);
  const remote=run(['remote','get-url','origin']).toString().trim();if(remote!==repo.url)throw Error(`remote mismatch: ${repo.name}`);
  const status=run(['status','--porcelain=v1','--untracked-files=all']).toString();if(status.trim())throw Error(`dirty checkout: ${repo.name}; retained changes`);
  const entries=run(['ls-tree','-r','-z',repo.commit]).toString().split('\0').filter(Boolean).map(row=>{const m=/^(\d{6}) (blob|commit) ([0-9a-f]{40})\t([\s\S]+)$/.exec(row);if(!m)throw Error('invalid Git tree entry');safeRelative(m[4]);return {mode:m[1],type:m[2],blob:m[3],path:m[4]};});
  const tree=new Map(entries.map(e=>[e.path,e])),cache=new Map();
  function blobs(ids){
    const pending=[...new Set(ids)].filter(id=>!cache.has(id));
    for(let n=0;n<pending.length;n+=100){
      const chunk=pending.slice(n,n+100),out=run(['cat-file','--batch'],Buffer.from(chunk.join('\n')+'\n'));let off=0;
      for(const id of chunk){
        const end=out.indexOf(10,off),m=/^([0-9a-f]{40}) blob (\d+)$/.exec(out.subarray(off,end).toString());
        if(end<0||!m||m[1]!==id)throw Error(`missing/invalid blob: ${id}`);
        const size=Number(m[2]);off=end+1;if(off+size>=out.length||out[off+size]!==10)throw Error('truncated blob');
        const content=out.subarray(off,off+size);
        const digest=createHash('sha1').update(Buffer.from(`blob ${size}\0`)).update(content).digest('hex');
        if(digest!==id)throw Error(`Git blob content hash mismatch: ${id}`);
        cache.set(id,content);off+=size+1;
      }
    }
  }
  const read=p=>{const e=tree.get(p);if(!e||e.type!=='blob')throw Error(`missing file: ${p}`);blobs([e.blob]);return cache.get(e.blob);};return {repo,cwd,head,remote,status,entries,tree,blobs,read};
}
function anchorFor(ctx,p,line=1,end=line,symbol='license evidence'){const lines=decodeText(ctx.read(p)).split(/\r?\n/);return {repo:ctx.repo.name,commit:ctx.repo.commit,path:p,blob:ctx.tree.get(p).blob,symbol,startLine:line,endLine:end,excerpt:lines.slice(line-1,end).join('\n')};}
function checkAnchor(ctx,a){const errors=[];try{safeRelative(a.path);if(a.repo!==ctx.repo.name||a.commit!==ctx.repo.commit)throw Error('anchor repository/commit mismatch');const e=ctx.tree.get(a.path);if(!e||e.type!=='blob'||e.blob!==a.blob)throw Error('anchor blob mismatch/file missing');if(!a.symbol||!Number.isInteger(a.startLine)||!Number.isInteger(a.endLine)||a.startLine<1||a.endLine<a.startLine||a.endLine-a.startLine>200)throw Error('invalid anchor lines/symbol');const lines=decodeText(ctx.read(a.path)).split(/\r?\n/);if(a.endLine>lines.length||!a.excerpt||lines.slice(a.startLine-1,a.endLine).join('\n')!==a.excerpt)throw Error('anchor excerpt mismatch');}catch(e){errors.push(e.message);}return {errors,blob:a?.blob};}
function validateAnchor({root=ROOT,anchor,gitRunner=gitRun}){try{const repo=readLock(root).repositories.find(r=>r.name===anchor?.repo);if(!repo)throw Error('unknown anchor repository');return checkAnchor(context(root,repo,gitRunner),anchor);}catch(e){return {errors:[e.message],blob:null};}}
function kindOf(p,mode){if(mode==='120000')return 'symlink';if(/(?:^|\/)(?:licen[cs]e|copying|notice|copyright)(?:[._-]|$)/i.test(p))return 'license';if(/\.(?:exe|dll|sys|cat|cer|pdb|bin|zip|jar|aar|so|dylib|a|lib|apk|pfx|ico|png|jpe?g|gif|webp|ttf|woff2?|pdf|mp4|wav|res|icns|pak)$/i.test(p))return 'binary';if(/(?:^|\/)(?:CMakeLists\.txt|.*\.(?:cmake|gradle|ps1|bat|cmd|sh|yml|yaml|vcxproj|csproj|pbxproj|pro))$/i.test(p))return 'build';if(/\.(?:md|rst|txt)$/i.test(p))return 'docs';if(/\.(?:h|hpp|hxx)$/i.test(p))return 'header';if(/\.(?:c|cpp|cc|cxx|m|mm|java|kt|swift|cs|py|js|ts|dart)$/i.test(p))return 'source';if(/\.(?:svg|xml|html|css|json|plist|rc|inf)$/i.test(p))return 'asset';return 'generated';}
function spdx(text){
  // A stock GPL license includes a suggested application notice in its appendix.
  // That template is not an upstream declaration of GPL-only vs GPL-or-later.
  if(/^\s*GNU (?:LESSER )?GENERAL PUBLIC LICENSE\s*\r?\n\s*Version/.test(text))return null;
  const explicit=/SPDX-License-Identifier:\s*([A-Za-z0-9.+-]+)(?:\s|$)/.exec(text);
  if(explicit&&/^(MIT|Apache-2\.0|BSL-1\.0|BSD-[23]-Clause|GPL-[23]\.0-(only|or-later))$/.test(explicit[1]))return explicit[1];
  if(/Permission is hereby granted, free of charge/.test(text))return 'MIT';
  if(/Licensed under the Apache License,? (?:Version )?2\.0/.test(text))return 'Apache-2.0';
  if(/either version 3 of the License, or/.test(text)&&/any later version/.test(text))return 'GPL-3.0-or-later';return null;
}
function externalCandidates(ctx){
  const result=[];
  for(const e of ctx.entries.filter(e=>e.type==='blob')){
    const kind=kindOf(e.path,e.mode);
    if(kind==='binary')result.push({id:`${ctx.repo.name}:binary:${e.path}`,kind:'binary',path:e.path,url:null,commit:ctx.repo.commit,digest:`sha256:${createHash('sha256').update(ctx.read(e.path)).digest('hex')}`,blob:e.blob,anchor:null,usage:'embedded-content'});
    if(kind==='build'||/(?:gradle-wrapper\.properties|packages\.config|Package\.resolved|package\.json|package-lock\.json|\.gitmodules)$/i.test(e.path)){
      const lines=decodeText(ctx.read(e.path)).split(/\r?\n/);
      lines.forEach((line,i)=>{
        const urls=[...line.matchAll(/https?:\/\/[^\s"'<>\)]+/g)].map(m=>m[0]);
        for(let n=0;n<urls.length;n++){
          const url=urls[n];const ref=/schemas\.microsoft\.com|licenses\/|\/issues\/|\/discussions\/|docs\.|documentation|probot\.github|discord|aka\.ms\/codeql|gh\.io|github\.blog|cmake\.org\/cmake\/help|gcc\.gnu\.org\/bugzilla/.test(url);
          result.push({id:`${ctx.repo.name}:locator:${e.path}:${i+1}:${n}`,kind:'download',path:e.path,url,commit:null,digest:null,blob:e.blob,anchor:anchorFor(ctx,e.path,i+1,i+1,'external locator'),usage:ref?'reference-only':'download-candidate'});
        }
        if(!urls.length&&/CPMAddPackage|FetchContent_Declare|find_package\s*\(|implementation\s+['"]|<PackageReference\s|<package\s|github:|uses:\s*[^.\s]+\//.test(line))result.push({id:`${ctx.repo.name}:declaration:${e.path}:${i+1}`,kind:'download',path:e.path,url:null,commit:null,digest:null,blob:e.blob,anchor:anchorFor(ctx,e.path,i+1,i+1,'dependency declaration'),usage:'implicit-dependency'});
      });
    }
  }
  return result;
}
function enrichRepository(ctx,data){
  const files=data.files.filter(f=>f.repo===ctx.repo.name);ctx.blobs(files.map(f=>f.blob));
  for(const f of files){if(f.kind==='binary')continue;const text=decodeText(ctx.read(f.path));const lines=text.split(/\r?\n/),pre=lines.slice(0,100).join('\n');
    f.copyright=lines.filter(l=>/copyright|©/i.test(l)).slice(0,12).map(l=>l.trim());
    const at=lines.slice(0,100).findIndex(l=>/SPDX-License|General Public License|Apache License|Redistribution and use|Permission is hereby granted|Creative Commons|Microsoft Reciprocal License|copyright|©/i.test(l));
    if(at>=0&&f.path!==ctx.repo.licenseFile){const id=`${f.id}:notice`,expr=spdx(pre),end=Math.min(at+12,lines.length);data.licenseEvidence.push({id,anchor:anchorFor(ctx,f.path,at+1,end,'file notice / exception candidate'),scopePaths:[f.path],spdxExpression:expr,obligations:['保留独立头部/版权；核实完整条款和组合兼容，根许可证不覆盖此候选例外。'],reviewState:expr?'identified':'unresolved',blockerIds:expr?[]:[`${ctx.repo.name}:license-scope`]});f.licenseEvidenceIds.push(id);f.exceptionEvidenceIds.push(id);}
    if(f.kind==='license'&&/(?:^|\/)(?:licen[cs]e|copying)(?:[._-]|$)/i.test(f.path)&&f.path!==ctx.repo.licenseFile){const id=`${f.id}:directory-license`;data.licenseEvidence.push({id,anchor:anchorFor(ctx,f.path,1,Math.min(8,lines.length)),scopePaths:[path.posix.dirname(f.path)+'/** (candidate scope; file exceptions remain blocked)'],spdxExpression:spdx(text),obligations:['核对目录范围和上游原始条款；不得从目录文本批准全部文件。'],reviewState:'unresolved',blockerIds:[`${ctx.repo.name}:license-scope`]});for(const child of files.filter(x=>x.path.startsWith(path.posix.dirname(f.path)+'/'))){child.licenseEvidenceIds.push(id);child.exceptionEvidenceIds.push(id);}}
  }
  for(const x of externalCandidates(ctx)){const bid=`${x.id}:unverified`;data.externals.push({...x,parentRepo:ctx.repo.name,materialization:x.kind==='binary'?'present':'absent',licenseEvidenceIds:data.files.find(f=>f.path===x.path&&f.repo===ctx.repo.name)?.licenseEvidenceIds||[],blockerIds:x.usage==='reference-only'?[]:[bid],requiredByPhases:[2]});if(x.usage!=='reference-only')data.blockers.push({id:bid,description:x.kind==='binary'?'已锁 Git blob 和 SHA256；原始源码/生成过程、许可及包签名未核实。':'外部 URL/动态依赖入口已登记；未下载，版本/摘要/许可及产物关系仍需核实。',evidenceIds:[x.id],affectedRouteIds:[],requiredByPhases:[2],resolutionNeeded:'生产选用前锁完整源/包版本及摘要，审查许可证据和实际构建路径。',status:'open'});}
  data.repositories.find(r=>r.name===ctx.repo.name).scanEvidence={fixedObjects:true,allFilesEnumerated:true,textHeadersScanned:true,externalCandidatesEnumerated:true,exhaustiveness:'dynamic build behavior remains unresolved; no install scripts executed'};
}
function prepareDistribution(data){
  const term=(url,title,version,sections)=>({url,title,version,capturedAt:'2026-10-07',relevantSections:sections});
  const gpl=term('https://www.gnu.org/licenses/gpl-3.0.html','GPLv3','Version 3, 2007-06-29; online fetch timeout, sections checked against locked license blobs',['5','6','10']);
  const apple=term('https://developer.apple.com/support/terms/apple-developer-program-license-agreement/','Apple Developer Program License Agreement','public English web text as retrieved 2026-10-07; account-accepted revision unknown',['Purpose','3.3.4(A)(v)','5.1','5.3']);
  const android=term('https://developer.android.com/studio/publish/app-signing','Android app signing','updated 2026-03-06',['App signing','Play App Signing']);
  const microsoft=term('https://learn.microsoft.com/en-us/windows-hardware/drivers/install/kernel-mode-code-signing-policy--windows-vista-and-later-','Driver Signing Policy','updated 2024-08-19',['Windows 10 version 1607','Signing drivers for client versions','PnP']);
  const dashboard=term('https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs','Driver code signing requirements','updated 2026-04-14',['EV certificate signed drivers','SHA-2 submissions']);
  const msix=term('https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview','Sign an MSIX package','web revision retrieved 2026-10-07',['Signing options','Production distribution']);
  const devID=term('https://developer.apple.com/developer-id/','Signing Mac Software with Developer ID','web revision retrieved 2026-10-07',['Developer ID','Notarization']);
  const deb=term('https://www.debian.org/doc/debian-policy/ch-docs.html#copyright-information','Debian Policy','v4.7.4.1',['12.5 Copyright information']);
  const play=term('https://play.google/developer-distribution-agreement.html','Google Play Developer Distribution Agreement','public web text retrieved 2026-10-07; accepted account revision unknown',['2 Accepting Agreement','4 Product requirements','5 License grants']);
  const globalBlockers=[
    ['project-license','项目许可证/拟复制链接清单及组合义务尚未决定；所有上游文件仍 research-only。',[2], '取得用户路线决定；实际生产依赖逐项闭合许可，GPL-only/or-later 不能由根文本推断。'],
    ['apple-foss-channel','Apple 账户实际协议、FOSS组合与签名条款尚未核对；Moonlight 上架不证明 Aether 可上架。',[30,32,40,41],'在真实 Apple 构建/依赖图确定后逐项核验；不因硬件TODO省略构建或渠道审查。'],
    ['driver-production-signing','驱动源码/二进制对应关系、发布签名和默认安全配置安装未验证；测试签名不能代替生产签名。',[3,4,5,39],'确认 provider 与精确包摘要/目录签名，验证 Win10/11 与 Secure Boot/HVCI 默认配置；确定开发者账户/证书及认证路径。'],
    ['distribution-accounts','最终账户、证书、更新身份及接受的商店协议未确认；未购买、登录或发布。',[39,40,41],'在交付阶段由用户选定账户与签名保管，核对实际协议和费用。'],
    ['external-build-scope','动态下载/包管理器/构建工具的传递依赖与资产并不由顶层 SHA 完整锁定。',[2],'生产选用前按实际构建图锁定与审计；本次只扫描固定文本，不执行上游安装脚本。']
  ];
  for(const [id,description,phases,resolutionNeeded] of globalBlockers)if(!data.blockers.some(b=>b.id===id))data.blockers.push({id,description,evidenceIds:[],affectedRouteIds:[],requiredByPhases:phases,resolutionNeeded,status:'open'});
  if(!data.routes.length){
    const sources=(...names)=>data.repositories.filter(r=>names.includes(r.name)).map(r=>r.name);
    const route=(id,platform,artifactKind,channel,sourceIds,terms,obligations,blockerIds)=>({id,platform,artifactKind,channel,sourceIds:sourceIds.length?sourceIds:data.repositories.map(r=>r.name),terms,obligations,evidenceState:'blocked',blockerIds:['project-license','distribution-accounts','external-build-scope',...blockerIds]});
    const notices='随实际发行清单保留 notices、版权、对应许可；GPL 组合及对应源码义务单独核对。';
    data.routes=[
      route('windows-host-direct','windows-host','Helios + device packages','EXE/MSI direct',sources('sunshine','apollo'),[gpl,microsoft],[notices,'主机安装器与驱动包分开核验，普通程序签名不能代替驱动签名。'],['driver-production-signing']),
      route('windows-host-msix','windows-host','Helios packaged service candidate','MSIX candidate',sources('sunshine'),[msix],['检查签名/发布者身份，以及服务和外部设备安装的实际包限制；尚未证明本产物适合MSIX。'],['driver-production-signing']),
      route('windows-client-direct','windows-client','Selene desktop','ZIP/EXE direct',sources('moonlight-qt','moonlight-common-c'),[gpl],[notices,'代码签名与升级来源身份需固定。'],[]),
      route('windows-client-msix','windows-client','Selene packaged desktop','MSIX / Microsoft Store candidate',sources('moonlight-qt'),[msix],['生产可信签名；Store或直接包路线需核对各自发布者与依赖规则。'],[]),
      route('macos-direct','macos','Selene desktop','Developer ID / notarized DMG',sources('moonlight-qt','moonlight-common-c'),[apple,devID],[notices,'Developer ID、公证、权限和全部内嵌原生库须验证。'],['apple-foss-channel']),
      route('macos-store','macos','Selene desktop','Mac App Store candidate',sources('moonlight-qt'),[apple],['账户与实际包审查条件待闭合，不能从技术可构建推导上架许可。'],['apple-foss-channel']),
      route('linux-direct','linux','Selene desktop','tarball / AppImage candidate',sources('moonlight-qt','moonlight-common-c'),[gpl],[notices,'锁定内嵌动态库及实际目标发行版的依赖。'],[]),
      route('linux-distro','linux','Selene distro package','deb / distribution package candidate',sources('moonlight-qt'),[deb],['按发行包记录上游来源、版权和许可；尚未申请进入发行版。'],[]),
      route('android-apk','android','Selene mobile','direct APK',sources('moonlight-android','moonlight-common-c'),[android],[notices,'签名身份和更新密钥必须持续保管。'],[]),
      route('android-play','android','Selene mobile','Google Play / AAB candidate',sources('moonlight-android'),[android,play],['Play开发者账户、签名和实际接受的发布协议待确认。'],[]),
      route('ios-testflight','ios-ipados','Selene mobile','TestFlight beta',sources('moonlight-ios','moonlight-common-c'),[apple],['TestFlight用于测试；账户、依赖授权和签名组合仍需闭合。'],['apple-foss-channel']),
      route('ios-store','ios-ipados','Selene mobile','App Store candidate',sources('moonlight-ios'),[apple],['实际账户英文协议、FOSS依赖/对应源码提供方式和签名条件须逐项核对。'],['apple-foss-channel']),
      route('windows-devices-whcp','windows-devices','display / capture audio / camera','Hardware Dev Center / WHCP + HLK',sources('virtual-display-driver','virtual-audio-driver','windows-camera','apollo'),[microsoft,dashboard],['核对驱动类型、目录、目标OS及HLK日志；账户需有效EV关联，提交须符合SHA-2要求。'],['driver-production-signing']),
      route('windows-devices-attestation','windows-devices','device evaluation packages','attestation candidate / test signing development only',sources('virtual-display-driver','virtual-audio-driver'),[microsoft,dashboard],['Attestation的适用目标及发行能力须另核验；不把测试签名包作为默认安全配置生产依赖。'],['driver-production-signing'])
    ];
  }
  for(const b of data.blockers)b.affectedRouteIds=data.routes.filter(r=>r.blockerIds.includes(b.id)).map(r=>r.id);
  if(!data.decisions.length){const all=['project-license','external-build-scope'], option=(id,description,benefits,costs,blockedBy=all)=>({id,description,benefits,costs,blockedBy});data.decisions=[
    {id:'project-reuse-policy',question:'决定 Aether 项目许可意图与生产复用路线。全部上游文件当前 research-only；选择意图不会批准未知文件。',options:[
      option('compatible-open-source','以 GPL-3.0-or-later 为项目候选；common-c 等实现文件仅作为未来复制/链接候选，逐项审查后才纳入生产。',['允许后续核实后复用协议核心，避免重新实现全部协议细节'],['对应源码、版权/通知、修改说明和组合发行义务','Apple渠道组合兼容未闭合；独立第三方条款不被GPL根文本覆盖'],[...all,'apple-foss-channel']),
      option('independent-implementation','独立实现 Aether，自写代码以 Apache-2.0 为候选；只研究现有行为，媒体/驱动依赖另审。',['明确自写实现范围与依赖边界'],['协议行为仍基于GameStream；需要更多实现与核验工作','独立意图不是已取得法律结论，不能搬代码后改许可']),
      option('research-only','本阶段只确认来源证据；暂不锁项目LICENSE，禁止生产复制/链接/再分发，继续原能力和环境审计。',['可立即推进01-02/03证据工作，未知授权保持阻断'],['Phase2或首个生产依赖前必须闭合具体许可/复用问题'])
    ],recommendation:'research-only（当前证据完成但所有生产清单/渠道尚未闭合）；若已确定开源意图，可选前两条并保留阻碍。',selected:null,status:'pending',confirmedBy:null,confirmedAt:null},
    {id:'distribution-intent',question:'确认候选渠道组合或明确全部暂缓；本阶段不发布、不购买证书。',options:[
      option('direct-plus-apple-beta','Windows主机/客户端直接包；macOS Developer ID+公证；Linux直接包；Android APK；iOS TestFlight→App Store候选；Windows设备WHCP/HLK生产评估。',['优先直接发行路线，保留五端与正式设备交付'],['Apple组合/账户、公证、驱动认证与所有源码义务待核验；商店候选均未获批准'],['apple-foss-channel','driver-production-signing','distribution-accounts']),
      option('retain-candidates','保留14条比较，所有渠道暂不选定；在交付阶段决定。',['不提前锁尚无实际产物的发行路径'],['交付阶段必须重新核对条款与账号，不改变五端v1义务'],['distribution-accounts'])
    ],recommendation:'retain-candidates',selected:null,status:'pending',confirmedBy:null,confirmedAt:null}
  ];}
}
function indexSources({root=ROOT,scope,gitRunner=gitRun,data:previous}){
  const lock=readLock(root),selected=selectRepos(lock,scope),data={schemaVersion:1,capturedAt:previous?.capturedAt||new Date().toISOString(),purpose:'Fixed source evidence; structure PASS is not production authorization',scope:{repoIds:selected.map(r=>r.name).sort(),complete:!scope},repositories:[],files:[],externals:[],licenseEvidence:[],routes:previous?.routes||[],decisions:previous?.decisions||[],blockers:[]};
  for(const repo of selected){const ctx=context(root,repo,gitRunner),id=repo.name,uncertain=`${id}:license-scope`,rootId=`${id}:root-license`,rootText=ctx.read(repo.licenseFile).toString();
    data.blockers.push({id:uncertain,description:'根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。',evidenceIds:[rootId],affectedRouteIds:[],requiredByPhases:[2],resolutionNeeded:'按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。',status:'open'});
    data.licenseEvidence.push({id:rootId,anchor:anchorFor(ctx,repo.licenseFile,1,Math.min(rootText.split(/\r?\n/).length,8)),scopePaths:['** (candidate only; exceptions require review)'],spdxExpression:spdx(rootText),obligations:['保留版权与许可；复核对应源码/组合发行义务及范围。'],reviewState:'unresolved',blockerIds:[uncertain]});
    const moduleText=ctx.tree.has('.gitmodules')?ctx.read('.gitmodules').toString():'',modules=new Map();for(const s of moduleText.split(/(?=\[submodule )/)){const p=/^\s*path\s*=\s*(.+)$/m.exec(s)?.[1]?.trim(),u=/^\s*url\s*=\s*(.+)$/m.exec(s)?.[1]?.trim();if(p)modules.set(p,u||null);}const gitlinkIds=[];
    for(const e of ctx.entries){if(e.type==='commit'){const extId=`${id}:gitlink:${e.path}`,bid=`${extId}:unverified`;gitlinkIds.push(extId);data.externals.push({id:extId,parentRepo:id,kind:'gitlink',path:e.path,url:modules.get(e.path)||null,commit:e.blob,digest:null,materialization:'absent',licenseEvidenceIds:[],blockerIds:[bid],requiredByPhases:[2]});data.blockers.push({id:bid,description:`${e.path} gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。`,evidenceIds:[extId],affectedRouteIds:[],requiredByPhases:[2],resolutionNeeded:'显式获取固定提交并另审源码、许可与资产。',status:'open'});}else data.files.push({id:`${id}:${e.path}`,repo:id,commit:repo.commit,path:e.path,blob:e.blob,mode:e.mode,kind:kindOf(e.path,e.mode),licenseEvidenceIds:[rootId],copyright:[],exceptionEvidenceIds:[],reuseIntent:'research-only',auditState:'blocked',blockerIds:[uncertain]});}
    data.repositories.push({name:id,url:repo.url,commit:repo.commit,head:ctx.head,remote:ctx.remote,checkoutState:'clean',statusEvidence:{command:'git status --porcelain=v1 --untracked-files=all',output:ctx.status},gitlinkIds});
    enrichRepository(ctx,data);
  }
  if(previous){
    for(const f of data.files){const old=previous.files?.find(x=>x.id===f.id&&x.blob===f.blob);if(old)for(const key of ['reuseIntent','notes'])if(old[key]!==undefined)f[key]=old[key];}
    for(const key of ['routes','decisions','reviewNotes','manualFindings'])if(previous[key]!==undefined)data[key]=previous[key];
    for(const key of ['licenseEvidence','externals','blockers'])for(const item of previous[key]||[]){if(item.origin==='manual'&&!data[key].some(x=>x.id===item.id))data[key].push(item);else{const next=data[key].find(x=>x.id===item.id);if(next&&item.notes!==undefined)next.notes=item.notes;}}
  }
  if(!scope)prepareDistribution(data);
  for(const key of ['repositories','files','externals','licenseEvidence','routes','decisions','blockers'])sorted(data[key]);return data;
}
function validateSources({root=ROOT,scope,data,gitRunner=gitRun}){
  const errors=[],counts={repositories:0,files:0,externals:0,anchors:0};let lock,repos;try{lock=readLock(root);repos=selectRepos(lock,scope);}catch(e){return {errors:[e.message],counts,blockers:[]};}
  try{if(data?.schemaVersion!==1||!data.capturedAt||!data.purpose||!data.scope)throw Error('invalid sources schema');
    for(const key of ['repositories','files','externals','licenseEvidence','routes','decisions','blockers']){if(!Array.isArray(data[key]))throw Error(`missing ${key} array`);const ids=data[key].map(x=>x.id||x.name);if(ids.some(x=>!x)||new Set(ids).size!==ids.length)errors.push(`duplicate/missing ${key} IDs`);}
    const evidence=new Map(data.licenseEvidence.map(e=>[e.id,e])),blockers=new Map(data.blockers.map(b=>[b.id,b]));const refs=(ids,map,label)=>{if(!Array.isArray(ids)||ids.some(id=>!map.has(id)))errors.push(`missing ${label} reference`);};
    for(const repo of repos){let ctx;try{ctx=context(root,repo,gitRunner);}catch(e){errors.push(e.message);continue;}counts.repositories++;const record=data.repositories.find(r=>r.name===repo.name);
      if(!record||record.commit!==repo.commit||record.head!==repo.commit||record.url!==repo.url||record.remote!==repo.url||record.checkoutState!=='clean'||!Array.isArray(record.gitlinkIds)||!record.statusEvidence?.command||typeof record.statusEvidence?.output!=='string'||record.statusEvidence.output.trim())errors.push(`repository commit/remote/state mismatch: ${repo.name}`);
      const actualFiles=ctx.entries.filter(e=>e.type==='blob'),files=data.files.filter(f=>f.repo===repo.name);if(files.length!==actualFiles.length||new Set(files.map(f=>f.path)).size!==actualFiles.length)errors.push(`file tree coverage mismatch: ${repo.name}`);
      ctx.blobs(actualFiles.map(e=>e.blob));
      for(const f of files){counts.files++;try{safeRelative(f.path);guarded(ctx.cwd,f.path);}catch(e){errors.push(e.message);}const e=ctx.tree.get(f.path);if(!e||e.type!=='blob'||e.blob!==f.blob||e.mode!==f.mode||f.commit!==repo.commit)errors.push(`file blob/tree mismatch: ${f.id}`);
        if(!['source','header','license','docs','asset','generated','binary','build','symlink'].includes(f.kind)||e&&f.kind!==kindOf(e.path,e.mode)||!['identified','blocked'].includes(f.auditState))errors.push(`unsupported file kind/audit state/approval: ${f.id}`);
        if(!['research-only','excluded'].includes(f.reuseIntent))errors.push(`production reuse requires reviewed decision and clearance: ${f.id}`);
        refs(f.licenseEvidenceIds,evidence,'license evidence');refs(f.exceptionEvidenceIds,evidence,'exception evidence');refs(f.blockerIds,blockers,'blocker');if(!f.licenseEvidenceIds?.length&&!f.blockerIds?.length)errors.push(`file lacks evidence/blocker: ${f.id}`);if(f.auditState==='blocked'&&!f.blockerIds?.some(id=>blockers.get(id)?.status==='open'))errors.push(`blocked file lacks open blocker: ${f.id}`);if(f.auditState==='identified'&&(!f.licenseEvidenceIds?.length||f.licenseEvidenceIds.some(id=>evidence.get(id)?.reviewState!=='identified')))errors.push(`identified file has unresolved evidence: ${f.id}`);
        if(f.mode==='120000'&&e&&!inside(ctx.cwd,path.resolve(ctx.cwd,path.dirname(f.path),ctx.read(f.path).toString())))errors.push(`symlink object escape: ${f.id}`);
      }
      const links=ctx.entries.filter(e=>e.type==='commit'),ext=data.externals.filter(x=>x.parentRepo===repo.name&&x.kind==='gitlink');
      const moduleUrls=new Map();
      if(ctx.tree.has('.gitmodules'))for(const section of decodeText(ctx.read('.gitmodules')).split(/(?=\[submodule )/)){const p=/^\s*path\s*=\s*(.+)$/m.exec(section)?.[1]?.trim(),u=/^\s*url\s*=\s*(.+)$/m.exec(section)?.[1]?.trim();if(p)moduleUrls.set(p,u||null);}
      if(ext.length!==links.length||new Set(ext.map(x=>x.path)).size!==links.length)errors.push(`gitlink external coverage mismatch: ${repo.name}`);
      for(const link of links){const x=ext.find(x=>x.path===link.path);if(!x||x.commit!==link.blob||x.url!==(moduleUrls.get(link.path)||null)||!x.blockerIds?.length)errors.push(`gitlink external identity/URL/blocker mismatch: ${link.path}`);}
      if(record&&JSON.stringify([...record.gitlinkIds||[]].sort())!==JSON.stringify(ext.map(x=>x.id).sort()))errors.push(`repository gitlink reference mismatch: ${repo.name}`);
      const expectedExternal=externalCandidates(ctx),recorded=data.externals.filter(x=>x.parentRepo===repo.name&&x.kind!=='gitlink'&&x.origin!=='manual');
      if(recorded.length!==expectedExternal.length)errors.push(`external asset/download coverage mismatch: ${repo.name}`);
      for(const expected of expectedExternal){const x=recorded.find(x=>x.id===expected.id);if(!x||x.path!==expected.path||x.kind!==expected.kind||x.url!==expected.url||x.blob!==expected.blob||x.digest!==expected.digest||x.usage!==expected.usage)errors.push(`external asset/download identity mismatch: ${expected.id}`);}
      for(const x of data.externals.filter(x=>x.parentRepo===repo.name)){
        refs(x.licenseEvidenceIds,evidence,'external license evidence');refs(x.blockerIds,blockers,'external blocker');
        if(!['absent','present','verified'].includes(x.materialization))errors.push(`invalid external materialization: ${x.id}`);
        if(x.usage!=='reference-only'&&!x.blockerIds?.some(id=>blockers.get(id)?.status==='open'))errors.push(`unverified external lacks open blocker: ${x.id}`);
        if(x.materialization==='verified')errors.push(`external production verification not evidenced: ${x.id}`);
        if(x.anchor){counts.anchors++;errors.push(...checkAnchor(ctx,x.anchor).errors.map(s=>`${x.id}: ${s}`));}
      }
      for(const ev of data.licenseEvidence.filter(x=>x.anchor?.repo===repo.name)){counts.anchors++;errors.push(...checkAnchor(ctx,ev.anchor).errors.map(s=>`${ev.id}: ${s}`));if(!['identified','unresolved'].includes(ev.reviewState))errors.push('unsupported legal approval state');refs(ev.blockerIds,blockers,'evidence blocker');if(ev.reviewState==='unresolved'&&!ev.blockerIds?.length)errors.push(`unresolved evidence lacks blocker: ${ev.id}`);}counts.externals+=data.externals.filter(x=>x.parentRepo===repo.name).length;
    }
    if(!scope){if(!data.scope.complete||data.repositories.length!==lock.repositories.length||JSON.stringify([...data.scope.repoIds].sort())!==JSON.stringify(lock.repositories.map(r=>r.name).sort()))errors.push('full source scope does not cover lock');if(data.files.some(f=>!lock.repositories.some(r=>r.name===f.repo)))errors.push('file references unknown repository');}else if(!data.scope.repoIds.includes(scope))errors.push('source scope is not indexed');
    if(!scope){
      for(const platform of ['windows-host','windows-client','macos','linux','android','ios-ipados','windows-devices'])if(data.routes.filter(r=>r.platform===platform).length<2)errors.push(`distribution route coverage missing comparison: ${platform}`);
      for(const id of ['project-reuse-policy','distribution-intent'])if(!data.decisions.some(d=>d.id===id))errors.push(`missing project decision: ${id}`);
      if(!data.decisions.find(d=>d.id==='project-reuse-policy')?.options?.every(o=>o.description&&o.benefits?.length&&o.costs?.length&&Array.isArray(o.blockedBy)))errors.push('project reuse decision options lack concrete costs/evidence');
    }
    for(const r of data.routes){
      if(!r.platform||!r.artifactKind||!r.channel||!r.sourceIds?.length||!r.obligations?.length||!r.terms?.length||!['identified','blocked'].includes(r.evidenceState))errors.push(`invalid distribution route: ${r.id}`);
      if(r.sourceIds?.some(id=>!data.repositories.some(x=>x.name===id)&&!data.files.some(x=>x.id===id)))errors.push(`unknown distribution source: ${r.id}`);
      refs(r.blockerIds,blockers,'route blocker');if(r.evidenceState==='blocked'&&!r.blockerIds?.some(id=>blockers.get(id)?.status==='open'))errors.push(`blocked route lacks open blocker: ${r.id}`);
      if(r.evidenceState==='identified')errors.push(`route clearance requires actual product/accepted terms: ${r.id}`);
      if(r.terms?.some(t=>!/^https:\/\//.test(t.url)||!t.title||!t.version||!t.capturedAt||!t.relevantSections?.length))errors.push(`distribution terms missing version/date/sections: ${r.id}`);
    }
    for(const b of data.blockers)if(!['open','resolved'].includes(b.status)||!b.description||!b.resolutionNeeded)errors.push(`invalid blocker: ${b.id}`);
    for(const ev of data.licenseEvidence)if(!lock.repositories.some(r=>r.name===ev.anchor?.repo))errors.push(`unknown license evidence repository: ${ev.id}`);
    for(const f of data.manualFindings||[]){refs(f.evidenceIds,evidence,'manual evidence');if(!blockers.has(f.blockerId)||!f.description||!f.requiredByPhases?.length)errors.push(`invalid manual finding: ${f.id}`);}
    for(const d of data.decisions){if(!['pending','selected','blocked'].includes(d.status)||!d.question||!d.options?.length)errors.push(`invalid decision: ${d.id}`);if(d.status==='selected'&&(!d.options.some(o=>o.id===d.selected)||d.confirmedBy!=='user'||!d.confirmedAt))errors.push(`decision lacks human evidence: ${d.id}`);}
  }catch(e){errors.push(e.message);}return {errors,counts,blockers:(data?.blockers||[]).filter(b=>b.status==='open')};
}
const md=s=>String(s??'').replace(/[|\r\n]/g,' ').replace(/</g,'&lt;');
function renderSourceAuditDetail(data,result){
  const rows=data.repositories.map(r=>`| ${r.name} | ${r.commit} | ${data.files.filter(f=>f.repo===r.name).length} | ${r.gitlinkIds.length} | ${r.checkoutState} |`);
  return `# 来源与发行审计\n\n证据采集：${data.capturedAt}。范围：${data.scope.complete?'九仓完整固定树':'子集；未完成全九仓'}。\n\n结构校验 ${result.errors.length?'FAIL':'PASS'}；生产复用批准：无。逐文件索引见 [sources.json](baseline/sources.json)，固定来源见 [upstream-lock.json](../references/upstream-lock.json)。\n\n| 仓库 | 固定 SHA | blob 文件 | gitlinks | 工作树 |\n|---|---|---|---|---|\n${rows.join('\n')}\n\n所有文件为 research-only；根许可仅候选证据，未知范围及缺失子模块内部源码保持阻断。FFI/C ABI 边界不自动免除组合义务。\n\n## 固定锚点\n\n${data.licenseEvidence.map(e=>`- ${md(e.id)}：\`${e.anchor.repo}@${e.anchor.commit}:${md(e.anchor.path)}:${e.anchor.startLine}\`，blob \`${e.anchor.blob}\`；${e.spdxExpression||'许可表达式未决'}，${e.reviewState}。`).join('\n')}\n\n## 外部来源\n\n| ID | 类型 | 路径 | URL / 固定值 | 状态 |\n|---|---|---|---|---|\n${data.externals.map(x=>`| ${md(x.id)} | ${x.kind} | ${md(x.path)} | ${md(x.url)} / ${x.digest||x.commit||'未锁包摘要'} | ${x.materialization} |`).join('\n')}\n\n## 发行候选\n\n${data.routes.map(r=>`### ${md(r.id)}\n\n平台 ${md(r.platform)}；${md(r.artifactKind)}；${md(r.channel)}；${r.evidenceState}。\n\n${r.obligations.map(o=>`- ${md(o)}`).join('\n')}\n\n${r.terms.map(t=>`- [${md(t.title)}](${t.url})；${md(t.version)}；核查 ${t.capturedAt}；章节 ${md(t.relevantSections.join(', '))}。`).join('\n')}\n\n阻碍：${r.blockerIds.join(', ')}。`).join('\n\n')}\n\n## 人类决定\n\n${data.decisions.map(d=>`### ${md(d.id)}\n\n${md(d.question)}\n\n${d.options.map(o=>`- **${o.id}**：${md(o.description)}。收益：${md(o.benefits.join('；'))}。代价：${md(o.costs.join('；'))}。阻碍：${o.blockedBy.join(', ')}。`).join('\n')}\n\n推荐：${d.recommendation}；状态：${d.status}；选择：${d.selected||'待用户决定'}；确认：${d.confirmedBy||'无'} / ${d.confirmedAt||'无'}。`).join('\n\n')}\n\n## 未决阻碍\n\n${result.blockers.map(b=>`- **${md(b.id)}**：${md(b.description)} 阶段 ${b.requiredByPhases.join('/')}；处理：${md(b.resolutionNeeded)}。`).join('\n')}\n\n## 复现\n\n从 Aether 根运行 \`pwsh -NoProfile -File scripts/sync-upstream.ps1 -VerifyOnly\` 和 \`node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md\`。缺 checkout 时显式恢复；不初始化子模块、不 reset 用户改动。\n\nBASE-02 边缘穷尽性仍 unclassified/unresolved；两条 descriptor-less prohibitions 仍 flagged-unverified。结构 PASS 不等于法律、组合发行或平台支持判断。\n`;
}
function renderSourceAudit(data,result){
  const evidence=data.licenseEvidence.filter(e=>e.id.endsWith(':root-license')||e.id.endsWith(':directory-license')||e.origin==='manual');
  const focused=data.externals.filter(x=>x.kind==='gitlink'||x.origin==='manual'||(x.kind==='binary'&&/\.(a|lib|dll|exe|sys|cat|jar|zip|aar|cer)$/i.test(x.path))||(x.kind==='download'&&x.usage!=='reference-only'&&/download|\/releases\/|\/archive\/|jitpack|\.git(?:@|$)/i.test(x.url||'')));
  const important=result.blockers.filter(b=>!b.id.includes(':binary:')&&!b.id.includes(':locator:')&&!b.id.includes(':declaration:'));
  const findings=(data.manualFindings||[]).map(f=>`- **${md(f.id)}**：${md(f.description)}。固定证据 ${f.evidenceIds.map(id=>`\`${md(id)}\``).join(', ')}；阻碍 \`${md(f.blockerId)}\`，责任阶段 ${f.requiredByPhases.join('/')}。`).join('\n');
  const scope=`本次实际核验 ${result.counts.repositories} 个仓库、${result.counts.files} 个文件；${result.counts.repositories===data.repositories.length?'所列来源链均重核。':'仅子集；其余既有索引记录未在本次重核。'}完整数据含 ${data.files.length} 个 blob 文件、${data.externals.length} 个外部来源/定位符、${data.licenseEvidence.length} 条许可/通知候选；${result.blockers.length} 个未决记录。下表展示子模块、库/驱动二进制及重点下载；图片/字体等嵌入内容与全部动态声明仍在 JSON 中，不省略其阻碍。只有固定对象身份、枚举与锚点经机器校验；扫描不是法律批准或动态构建穷尽证明。`;
  return renderSourceAuditDetail({...data,licenseEvidence:evidence,externals:focused},{...result,blockers:important}).replace('## 固定锚点',`${scope}\n\n## 重点审查发现\n\n${findings||'该子集尚无额外人工结论；许可范围保持未决。'}\n\n## 固定锚点`);
}
function atomicWrite(root,relative,content){if(!['docs/baseline/sources.json','docs/SOURCE-AUDIT.md'].includes(relative))throw Error('report/index path is not an allowed artifact');const target=guarded(root,relative);fs.mkdirSync(path.dirname(target),{recursive:true});const temp=`${target}.${process.pid}.tmp`;try{fs.writeFileSync(temp,content,{flag:'wx'});fs.renameSync(temp,target);}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}
function cli(args=process.argv.slice(2)){
  const opts={};for(let i=0;i<args.length;i++){const a=args[i];if(['--sources','--index-sources'].includes(a)){if(opts[a])throw Error(`duplicate argument: ${a}`);opts[a]=true;}else if(['--scope','--report','--root'].includes(a)){if(opts[a]||!args[i+1]||args[i+1].startsWith('--'))throw Error(`invalid argument: ${a}`);opts[a]=args[++i];}else throw Error(`unknown argument: ${a}`);}
  if(!opts['--sources']&&!opts['--index-sources'])throw Error('full baseline not yet available; select --sources');if(opts['--report']&&opts['--report']!=='docs/SOURCE-AUDIT.md')throw Error('invalid report path');const root=path.resolve(opts['--root']||ROOT),p=guarded(root,'docs/baseline/sources.json');let data;
  if(opts['--index-sources'])data=indexSources({root,scope:opts['--scope'],data:fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):undefined});else data=JSON.parse(fs.readFileSync(p,'utf8'));
  const result=validateSources({root,scope:opts['--scope'],data});if(result.errors.length)throw Error(result.errors.join('\n'));if(opts['--index-sources'])atomicWrite(root,'docs/baseline/sources.json',JSON.stringify(data,null,2)+'\n');if(opts['--report'])atomicWrite(root,opts['--report'],renderSourceAudit(data,result));console.log(JSON.stringify({status:'PASS',scope:opts['--scope']||'sources',checked:result.counts.files+result.counts.externals,counts:result.counts,errors:0,blockers:result.blockers.length,pendingDecisions:data.decisions.filter(d=>d.status==='pending').length,productionReuseApproved:false}));
}
module.exports={validateSources,validateAnchor,renderSourceAudit,indexSources,gitRun,guarded,atomicWrite,context,readLock,anchorFor,kindOf,spdx,decodeText,cli};
if(require.main===module){try{cli();}catch(e){console.error(JSON.stringify({status:'FAIL',errors:[e.message]}));process.exitCode=1;}}
