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
function atomicWrite(root,relative,content){if(!['docs/baseline/sources.json','docs/SOURCE-AUDIT.md','docs/FEATURE-PARITY.md','docs/BASELINE-REVIEW.md'].includes(relative))throw Error('report/index path is not an allowed artifact');const target=guarded(root,relative);fs.mkdirSync(path.dirname(target),{recursive:true});const temp=`${target}.${process.pid}.tmp`;try{fs.writeFileSync(temp,content,{flag:'wx'});fs.renameSync(temp,target);}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}
const FEATURE_PLATFORMS=['helios-windows10','helios-windows11','selene-windows','selene-macos','selene-ios-ipados','selene-android','selene-linux'];
function inventoryKeys(text,kind){
  if(kind==='qt-properties')return [...text.matchAll(/Q_PROPERTY\(\w+\s+(\w+)/g)].map(m=>m[1]);
  if(kind==='android-preferences')return [...text.matchAll(/android:key="([^"]+)"/g)].map(m=>m[1]);
  if(kind==='objc-properties')return [...text.matchAll(/@property[^;]*\s(\w+)\s*;/g)].map(m=>m[1]);
  if(kind==='json-config')return JSON.parse(text).flatMap(tab=>Object.keys(tab.options));
  if(kind==='qt-cli')return [...text.matchAll(/parser\.add(?:Flag|Value|Toggle|Choice)Option\("([^"]+)"/g)].map(m=>m[1]);
  if(kind==='qt-shortcuts')return [...new Set([...text.matchAll(/m_SpecialKeyCombos\[(\w+)\]\.keyCode/g)].map(m=>m[1]))];
  return null;
}
function validateFeatures({root=ROOT,data,sources,scope,allowUnmapped=false,gitRunner=gitRun}){
  const errors=[],unmapped=[],conflicts=[],counts={features:0,surfaces:0,cases:0,anchors:0,settings:0};
  try{
    if(data?.schemaVersion!==1||!data.capturedAt||!data.purpose||!data.scope)throw Error('invalid feature schema');
    for(const k of ['features','surfaces','cases','conflicts']){if(!Array.isArray(data[k]))throw Error(`missing feature ${k}`);const ids=data[k].map(x=>x.id);if(ids.some(x=>!x)||new Set(ids).size!==ids.length)errors.push(`duplicate/missing ${k} ID`);}
    if(scope&&scope!=='qt-windows')throw Error('unknown feature scope');
    if(scope&&data.scope.complete)errors.push('complete platform scope cannot use tracer scope');
    if(!scope&&(!data.scope.complete||FEATURE_PLATFORMS.some(p=>!data.scope.platforms?.includes(p)||!data.features.some(f=>f.platform===p))))errors.push('full feature platform coverage missing');
    if(!scope){
      for(const p of FEATURE_PLATFORMS){
        const required=p.startsWith('helios')?['setting','input','media','network','management','packaging']:['setting','input','media','network','management','packaging'];
        for(const kind of required)if(!data.surfaces.some(s=>s.platform===p&&s.kind===kind))errors.push(`missing full source surface ${p}/${kind}`);
        const repo=p.startsWith('helios')?'sunshine':p==='selene-android'?'moonlight-android':p==='selene-ios-ipados'?'moonlight-ios':'moonlight-qt';
        const settingPath=repo==='sunshine'?'src_assets/common/assets/web/configs/config_tabs.json':repo==='moonlight-android'?'app/src/main/res/xml/preferences.xml':repo==='moonlight-ios'?'Limelight/Database/TemporarySettings.h':'app/settings/streamingpreferences.h';
        if(!data.surfaces.some(s=>s.platform===p&&s.repo===repo&&s.path===settingPath&&s.extractor))errors.push(`missing complete settings inventory ${p}`);
      }
    }
    if(data.scope.platforms?.some(p=>!FEATURE_PLATFORMS.includes(p)))errors.push('unknown scope platform');
    const lock=readLock(root),contexts=new Map(),anchorSeen=new Set();
    const anchor=a=>{
      counts.anchors++;try{
        if(!a||!sources?.files?.some(f=>f.repo===a.repo&&f.path===a.path&&f.blob===a.blob))throw Error('anchor source/blob not in source inventory');
        const repo=lock.repositories.find(r=>r.name===a.repo);if(!repo)throw Error('unknown source repository');
        if(!contexts.has(repo.name))contexts.set(repo.name,context(root,repo,gitRunner));
        const key=JSON.stringify(a);if(!anchorSeen.has(key)){errors.push(...checkAnchor(contexts.get(repo.name),a).errors.map(e=>`anchor ${a.path}: ${e}`));anchorSeen.add(key);}
      }catch(e){errors.push(e.message);}
    };
    const anchors=(list,where)=>{if(!Array.isArray(list)||!list.length)errors.push(`${where} missing anchor`);else list.forEach(anchor);};
    const featureMap=new Map(data.features.map(f=>[f.id,f])),caseMap=new Map(data.cases.map(c=>[c.id,c]));
    const req=fs.readFileSync(guarded(root,'.planning/REQUIREMENTS.md'),'utf8'),road=fs.readFileSync(guarded(root,'.planning/ROADMAP.md'),'utf8');
    const definitions=[...req.matchAll(/^- \[[ x]\] \*\*([A-Z]+-\d+)\*\*:/gm)].map(m=>m[1]);
    const mappings=[...req.matchAll(/^\| ([A-Z]+-\d+) \| Phase (\d+) \| (?:Pending|Complete|In Progress) \|$/gm)].map(m=>({id:m[1],phase:+m[2]}));
    const roadMappings=[];for(const m of road.matchAll(/^### Phase (\d+):[^\n]*\n([\s\S]*?)(?=^### Phase |^## Progress|$(?![\s\S]))/gm)){const line=m[2].match(/^\*\*Requirements:\*\* (.+)$/m);for(const id of line?.[1].split(/,\s*/)||[])roadMappings.push({id,phase:+m[1]});}
    for(const f of data.features){
      counts.features++;if(!FEATURE_PLATFORMS.includes(f.platform)||!data.scope.platforms?.includes(f.platform))errors.push(`invalid feature platform ${f.id}`);
      if(!f.capability||!f.originalBehavior||!f.aetherBehavior)errors.push(`missing feature behavior ${f.id}`);
      anchors(f.anchors,`feature ${f.id}`);
      if(!['flutter-ui','shared-native','host-native','platform-adapter','development-tool'].includes(f.ownerTier))errors.push(`invalid owner ${f.id}`);
      if(!['os','architecture','hardware'].every(k=>typeof f.conditions?.[k]==='string'&&f.conditions[k]))errors.push(`missing conditions ${f.id}`);
      if(!Array.isArray(f.settingIds)||!Array.isArray(f.blockerIds)||f.blockerIds.some(id=>!sources?.blockers?.some(b=>b.id===id)))errors.push(`invalid setting/blocker references ${f.id}`);
      if(f.mappingState==='needs-requirement'){unmapped.push(f.id);if(!allowUnmapped)errors.push(`unmapped feature ${f.id}`);}else if(f.mappingState!=='mapped'||!f.requirementIds?.length)errors.push(`missing requirement mapping ${f.id}`);
      if(!Number.isInteger(f.primaryPhase)||f.primaryPhase<1||f.primaryPhase>42)errors.push(`invalid primary phase ${f.id}`);
      for(const id of f.requirementIds||[]){const rows=mappings.filter(m=>m.id===id),roads=roadMappings.filter(m=>m.id===id);if(definitions.filter(x=>x===id).length!==1||rows.length!==1||roads.length!==1||rows[0].phase!==f.primaryPhase||roads[0].phase!==f.primaryPhase)errors.push(`requirement phase mapping mismatch ${f.id}/${id}`);}
      if(!f.caseIds?.length||f.caseIds.some(id=>!caseMap.has(id)||!caseMap.get(id).featureIds?.includes(f.id)||caseMap.get(id).platform!==f.platform||caseMap.get(id).verificationPhase!==f.primaryPhase))errors.push(`missing/mismatched case ${f.id}`);
      for(const k of ['implementationEvidence','buildEvidence','automationEvidence','hardwareEvidence'])if(!Array.isArray(f[k]))errors.push(`missing evidence array ${f.id}/${k}`);
      const todo=f.platform==='selene-macos'?'VFY-02':f.platform==='selene-ios-ipados'?'VFY-01':null;
      if((f.hardwareTodoId??null)!==todo)errors.push(`unapproved/missing hardware TODO ${f.id}`);
      if(f.hardwareEvidence?.length||f.implementationEvidence?.length||f.buildEvidence?.length||f.automationEvidence?.length)errors.push(`product/hardware evidence not established in baseline ${f.id}`);
    }
    for(const s of data.surfaces){
      counts.surfaces++;if(!s.reviewed)errors.push(`surface not reviewed ${s.id}`);
      if(!FEATURE_PLATFORMS.includes(s.platform)||!['setting','shortcut','cli','permission','input','media','network','management','packaging'].includes(s.kind))errors.push(`invalid surface platform/kind ${s.id}`);
      anchors(s.anchors,`surface ${s.id}`);
      if(!s.inventoryKeys?.length||new Set(s.inventoryKeys).size!==s.inventoryKeys.length)errors.push(`empty/duplicate surface inventory ${s.id}`);
      const keys=(s.entries||[]).map(e=>e.key);if(new Set(keys).size!==keys.length||keys.length!==s.inventoryKeys?.length||s.inventoryKeys.some(k=>!keys.includes(k)))errors.push(`uncovered surface key coverage ${s.id}`);
      if(s.extractor){try{const ctx=contexts.get(s.repo);if(!ctx)throw Error('missing surface source context');const actual=inventoryKeys(decodeText(ctx.read(s.path)),s.extractor);if(!actual||JSON.stringify([...new Set(actual)].sort())!==JSON.stringify([...s.inventoryKeys].sort()))errors.push(`surface source inventory mismatch ${s.id}`);}catch(e){errors.push(e.message);}}
      for(const e of s.entries||[]){if(!e.reason||!['mapped','implementation-detail','deprecated','outside-target'].includes(e.disposition))errors.push(`invalid surface disposition ${s.id}/${e.key}`);anchors(e.anchors,`surface entry ${s.id}/${e.key}`);if(e.disposition==='mapped'&&(!e.featureIds?.length||e.featureIds.some(id=>!featureMap.has(id)||featureMap.get(id).platform!==s.platform)))errors.push(`surface feature coverage mismatch ${s.id}/${e.key}`);if(s.kind==='setting')counts.settings++;}
    }
    for(const f of data.features)for(const key of f.settingIds||[])if(!data.surfaces.some(s=>s.platform===f.platform&&s.entries?.some(e=>e.key===key&&e.featureIds?.includes(f.id))))errors.push(`setting coverage missing ${f.id}/${key}`);
    for(const c of data.cases){counts.cases++;for(const k of ['featureIds','preconditions','steps','expectedResults','negativeCases','evidenceRequired'])if(!c[k]?.length)errors.push(`case missing ${k} ${c.id}`);if(c.featureIds?.some(id=>!featureMap.has(id)||!featureMap.get(id).caseIds?.includes(c.id)))errors.push(`case feature mismatch ${c.id}`);if(!['planned','blocked'].includes(c.status)||c.evidence?.length)errors.push(`case product evidence not established ${c.id}`);}
    for(const c of data.conflicts){if(!c.description||!c.affectedConstraint||!c.options?.length||!['open','decided'].includes(c.status)||!c.featureIds?.length||c.featureIds.some(id=>!featureMap.has(id)))errors.push(`invalid conflict ${c.id}`);anchors(c.sourceEvidence,`conflict ${c.id}`);if(c.status==='open')conflicts.push(c.id);else if(c.decisionEvidence?.confirmedBy!=='user'||!c.decisionEvidence?.confirmedAt)errors.push(`conflict missing human decision ${c.id}`);}
  }catch(e){errors.push(e.message);}
  return {errors,counts,unmapped,conflicts};
}
function renderFeatureParity(data,result){
  return `# 原功能保留基线\n\n基线日期：${data.capturedAt}。${data.scope.complete?'平台盘点已展开，语义穷尽性仍待最终人审':'Qt Windows 单能力 tracer 子集；未完成全平台审计'}。结构校验 ${result.errors.length?'FAIL':'PASS'}；产品功能均未实现/实测。固定来源见 [来源审计](SOURCE-AUDIT.md)，正式数据见 [features.json](baseline/features.json)。\n\n“不砍功能”以指定五平台及 Windows 10/11 服务端的适用原用户能力为边界。保留 GameStream 重构基础、单一 Flutter UI、原生实时路径、主机唯一控制租约；断连/切换保留实例和显示组，只有显式停止才清理。本阶段不批准源码生产复用。\n\niOS/iPadOS、macOS 仅实机验收分别延后 VFY-01/VFY-02；实现、构建与自动化仍属 v1。源码/API存在不等于平台支持；硬件、OS 和架构条件逐项保留。\n\n## 覆盖摘要\n\n能力 ${data.features.length}，入口 ${data.surfaces.length}，独立案例 ${data.cases.length}；未映射 ${result.unmapped.length}，开放冲突 ${result.conflicts.length}。\n\n## 平台原子能力\n\n| ID / 平台 | 原行为 → Aether | 条件 / 责任层 | 需求 / 主要阶段 / 案例 | 固定证据 |\n|---|---|---|---|---|\n${data.features.map(f=>`| ${f.id} / ${f.platform} | ${md(f.originalBehavior)} → ${md(f.aetherBehavior)} | ${md(Object.values(f.conditions).join('；'))} / ${f.ownerTier} | ${f.requirementIds.join(', ')||'needs-requirement'} / ${f.primaryPhase} / ${f.caseIds.join(', ')} | ${f.anchors.map(a=>`\`${a.repo}@${a.commit.slice(0,12)}:${a.path}:${a.startLine} (${a.symbol})\``).join('<br>')} |`).join('\n')}\n\n## 设置与非设置入口覆盖\n\n${data.surfaces.map(s=>`### ${s.id}\n\n${s.repo} / ${s.platform} / ${s.kind} / \`${s.path}\`；reviewed=${s.reviewed}；inventory=${s.inventoryKeys.length}。\n\n| key | 处置 / 能力 | 依据 |\n|---|---|---|\n${s.entries.map(e=>`| ${md(e.key)} | ${e.disposition} / ${e.featureIds.join(', ')} | ${md(e.reason)} |`).join('\n')}`).join('\n\n')}\n\n## 独立验收案例\n\n${data.cases.map(c=>`### ${c.id}\n\n平台 ${c.platform}；Phase ${c.verificationPhase}；${c.status}，未执行。\n\n- 前提：${c.preconditions.map(md).join('；')}\n- 步骤：${c.steps.map(md).join('；')}\n- 期望：${c.expectedResults.map(md).join('；')}\n- 负例：${c.negativeCases.map(md).join('；')}\n- 证据：${c.evidenceRequired.map(md).join('；')}`).join('\n\n')}\n\n## 原行为与约束冲突\n\n${data.conflicts.map(c=>`- **${c.id}** (${c.status})：${md(c.description)}。约束：${md(c.affectedConstraint)}；选项：${c.options.map(o=>md(typeof o==='string'?o:JSON.stringify(o))).join('；')}。`).join('\n')||'当前子集无已登记冲突。'}\n\nPhase 37 逐行复审，Phase 42 最终验收。BASE-01 edge flag 仍 unclassified/unresolved；descriptor-less prohibitions 仍 flagged-unverified。结构 PASS 不代替语义穷尽性、人审、构建或硬件验证。\n`;
}
const METRICS={'overlay-estimate':'ms','decode-duration':'ms','network-rtt':'ms','glass-to-glass':'ms','frame-drop':'%','jitter':'ms',cpu:'%',gpu:'%',vram:'MiB',power:'W'};
function validateEnvironment({data,requireReview=false}={}){
 const errors=[],add=s=>errors.push(s),array=(x,name)=>{if(!Array.isArray(x))add(`missing array ${name}`);return Array.isArray(x)?x:[];};
 try{if(data?.schemaVersion!==1||!data.capturedAt||!data.purpose||!['Quick','Deep'].includes(data.mode))add('invalid environment schema/mode');
 const probes=array(data.probes,'probes'),platforms=array(data.platforms,'platforms'),gaps=array(data.gaps,'gaps'),machines=array(data.machines,'machines'),decisions=array(data.decisions,'decisions');array(data.scenarios,'scenarios');
 const unique=(xs,kind)=>{const seen=new Set();for(const x of xs){if(!x.id||seen.has(x.id))add(`duplicate/missing ${kind} id`);seen.add(x.id);}};unique(probes,'probe');unique(platforms,'platform');unique(gaps,'gap');unique(machines,'machine');unique(decisions,'decision');
 if(!probes.length||!machines.length||!data.scenarios?.length)add('empty environment evidence/scenarios');
 const gapIds=new Set(gaps.map(g=>g.id));for(const g of gaps)if(!g.component||!g.purpose||!g.evidence?.length||!['open','resolved','todo'].includes(g.status)||!g.followupPhases?.length||!g.resolutionNeeded)add(`invalid gap ${g.id}`);
 for(const p of probes){if(!['available','missing','failed','timeout','empty','not-probed'].includes(p.status))add(`invalid probe status ${p.id}`);for(const k of ['resolvedExecutable','launcher','args','version','exitCode','durationMs','stdout','stderr','truncated','redactions','error','requiredByPhases'])if(!(k in p))add(`probe missing ${k} ${p.id}`);if(!Number.isFinite(p.durationMs)||p.durationMs<0||!Array.isArray(p.args)||!Array.isArray(p.requiredByPhases)||typeof p.stdout!=='string'||typeof p.stderr!=='string')add(`invalid probe fields ${p.id}`);
 if(p.status==='available'&&(p.exitCode!==0||!(p.stdout+p.stderr).trim()||p.error))add(`available probe invalid exit/output/error ${p.id}`);
 if(p.status!=='available'&&p.version!==null)add(`failed/missing probe cannot retain successful version ${p.id}`);
 if(p.status==='available'&&/^windows-(sdk|wdk)$/.test(p.id)&&(!p.components||!['headers','libs','tools'].every(k=>p.components[k]===true)))add(`SDK/WDK components incomplete ${p.id}`);
 if(Buffer.byteLength(p.stdout||'')>65536||Buffer.byteLength(p.stderr||'')>65536)add(`probe output bound exceeded ${p.id}`);}
 if(data.budget&&(data.budget.durationMs>data.budget.budgetMs||data.budget.budgetMs!==(data.mode==='Quick'?25000:45000)))add('collection budget exceeded/invalid');
 const h=data.host||{};if(/Windows 10/.test(h.ProductName||'')&&/Windows 11/.test(h.Caption||'')&&!h.diagnostics?.length)add('OS conflict requires diagnostic');if(!Array.isArray(h.diagnostics))add('host diagnostic array missing');const flutter=probes.find(p=>p.id==='flutter-cache'&&p.status==='available');if(flutter&&platforms.some(p=>p.id.startsWith('selene')&&(p.framework?.version!==flutter.version||(p.framework?.statementVersion&&p.framework.statementVersion!==flutter.version))))add('Flutter cached version differs from historical framework statement; audit version before changing floors');
 for(const id of FEATURE_PLATFORMS)if(platforms.filter(p=>p.id===id).length!==1)add(`missing unique platform ${id}`);
 for(const p of platforms){if(!FEATURE_PLATFORMS.includes(p.id))add(`unknown platform ${p.id}`);if(!p.framework?.version||!/^https:\/\//.test(p.framework?.source||'')||!p.framework?.capturedAt||!p.framework?.os||!p.framework?.architectures?.length||!p.nativeConstraints?.length||!['proposed','confirmed','pending-prototype'].includes(p.minimum?.status)||!p.minimum?.os||!p.minimum?.architectures?.length||!p.minimum?.evidence?.length)add(`missing framework/native/minimum boundary ${p.id}`);
 for(const k of ['buildEvidence','hardwareEvidence','gapIds'])array(p[k],`${p.id}/${k}`);if(p.gapIds?.some(id=>!gapIds.has(id)))add(`unknown build gap ${p.id}`);
 const todo=p.id==='selene-macos'?'VFY-02':p.id==='selene-ios-ipados'?'VFY-01':null;if((p.hardwareTodoId??null)!==todo)add(`unapproved or missing hardware TODO ${p.id}`);
 if(p.id.startsWith('helios')&&(p.minimum?.status!=='pending-prototype'||(p.id==='helios-windows10'&&/Windows 11/.test(p.minimum?.os||''))))add('Win10/11 host floor requires Phase3–5 prototype; cannot raise Win10 floor');
 if(p.hardwareEvidence?.some(e=>e.kind==='build'||e.kind==='simulator'))add(`build/simulator is not hardware evidence ${p.id}`);
 if(todo&&p.hardwareEvidence?.length)add(`Apple hardware remains unverified ${p.id}`);if(todo&&!p.buildEvidence?.length&&!p.gapIds?.length)add(`Apple build obligation requires separate toolchain gap ${p.id}`);}
 for(const m of machines)if(!m.role||!m.os||!m.architecture||!m.gpuVendor||!m.gpuModel||!m.driver||!['verified','unconfirmed','missing','todo'].includes(m.availability)||!m.evidence?.length||!m.requiredByPhases?.length)add(`invalid machine ${m.id}`);
 if(!data.measurementContract?.metrics||Object.keys(data.measurementContract.metrics).length!==Object.keys(METRICS).length||Object.entries(METRICS).some(([k,v])=>data.measurementContract.metrics[k]!==v))add('measurement metric/unit contract mismatch');const method=data.measurementContract?.method;if(!method||!['warmupSeconds','windowSeconds','repeats'].every(k=>Number.isFinite(method[k])&&method[k]>0)||!data.measurementContract?.clockRequirement)add('missing measurement method/clock requirement');
 for(const d of decisions){if(!['pending','selected'].includes(d.status)||!d.options?.length)add(`invalid decision ${d.id}`);if(d.status==='selected'&&(!d.options.some(o=>o.id===d.selected)||d.confirmedBy!=='user'||!d.confirmedAt))add(`decision lacks explicit human selection ${d.id}`);}
 if(requireReview){if(data.review?.status!=='confirmed'||data.review.confirmedBy!=='user'||!data.review.confirmedAt)add('review requires explicit human confirmation');if(decisions.some(d=>d.status!=='selected')||!decisions.length)add('review has pending decisions');if(decisions.some(d=>!data.review?.decisions?.includes(d.id)))add('review must reference every decision');const retained=new Set(data.review?.retainedBlockers||[]);for(const g of gaps.filter(g=>g.status==='open'))if(!retained.has(g.id))add(`review must retain open gap ${g.id}`);for(const id of retained)if(!gapIds.has(id))add(`review references unknown gap ${id}`);}
 }catch(e){add(e.message);}return {errors,counts:{probes:data?.probes?.length||0,platforms:data?.platforms?.length||0,machines:data?.machines?.length||0,gaps:data?.gaps?.length||0},reviewStatus:data?.review?.status||'missing'};
}
function validateMeasurement(data,{compare}={}){
 const errors=[],summary={},unavailable=[];const required=['scenarioId','hostId','clientId','osGpuDriver','network','resolution','fps','codec','hdr','audio','sampling','samples','failures'];
 try{if(data?.schemaVersion!==1)errors.push('invalid measurement schema');for(const k of required)if(!(k in data))errors.push(`missing measurement ${k}`);
 if(!data.reference?.repo||!SHA.test(data.reference?.commit||'')||!/^sha256:[0-9a-f]{64}$/.test(data.reference?.binaryDigest||''))errors.push('reference commit/binary digest required');
 if(!data.osGpuDriver?.host||!data.osGpuDriver?.client||!data.hostId||!data.clientId||!data.network?.type||!Number.isFinite(data.resolution?.width)||data.resolution.width<=0||!Number.isFinite(data.resolution?.height)||data.resolution.height<=0||!Number.isFinite(data.fps)||data.fps<=0||!data.codec||typeof data.hdr!=='boolean'||!data.audio)errors.push('invalid device/OS/network/stream parameter');
 const s=data.sampling;if(!s||!['warmupSeconds','windowSeconds','repeats'].every(k=>Number.isFinite(s[k])&&s[k]>0)||!Number.isInteger(s.repeats)||!s.instrument||!s.accuracy||!['single-clock','calibrated-cross-machine','cross-machine'].includes(s.clockMethod))errors.push('sampling instrument/accuracy/clock parameters required');
 if(s?.clockMethod==='cross-machine'||(s?.clockMethod==='calibrated-cross-machine'&&(!s.calibration?.method||!Number.isFinite(s.calibration?.uncertaintyMs)||s.calibration.uncertaintyMs<0||!s.calibration?.capturedAt)))errors.push('cross-host clock differences require recorded calibration and uncertainty');
 if(!Array.isArray(data.samples)||!Array.isArray(data.failures))errors.push('samples/failures must be arrays');const groups=new Map();for(const sample of data.samples||[]){if(METRICS[sample.metric]!==sample.unit)errors.push(`invalid metric unit ${sample.metric}/${sample.unit}`);if(!Number.isFinite(sample.value)||sample.value<0||(sample.unit==='%'&&sample.value>100))errors.push('invalid measured value');if(!sample.timestamp||Number.isNaN(Date.parse(sample.timestamp))||!sample.origin)errors.push('sample requires timestamp/origin');if(/cross-machine.*(?:difference|timestamp)/i.test(sample.origin||'')&&s?.clockMethod!=='calibrated-cross-machine')errors.push('uncalibrated cross-machine clock sample');const key=sample.metric+'/'+sample.unit;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(sample.value);}
 for(const [key,values]of groups){values.sort((a,b)=>a-b);summary[key]={samples:values.length,p50:values[Math.ceil(values.length*.5)-1],p95:values[Math.ceil(values.length*.95)-1]};}
 for(const metric of Object.keys(METRICS))if(!groups.has(metric+'/'+METRICS[metric]))unavailable.push({metric,reason:data.unavailableMetrics?.find(x=>x.metric===metric)?.reason||'No actual samples supplied; instrument collection pending'});
 for(const f of data.failures||[])if(!f.reason||!f.timestamp||Number.isNaN(Date.parse(f.timestamp)))errors.push('failure requires reason/timestamp');
 if(compare){const r=validateMeasurement(compare);errors.push(...r.errors.map(e=>'comparison: '+e));for(const k of ['scenarioId','hostId','clientId','osGpuDriver','network','resolution','fps','codec','hdr','audio','sampling'])if(JSON.stringify(data[k])!==JSON.stringify(compare[k]))errors.push(`incomparable parameter ${k}`);}
 }catch(e){errors.push(e.message);}return {errors,status:errors.length?'FAIL':data.samples?.length?'available':'unavailable',summary,unavailable,failures:data?.failures?.length||0};
}
function renderBaselineReview({sources,features,environment,sourceResult,featureResult,environmentResult}){
 const e=environment,table=(headers,rows)=>`| ${headers.join(' | ')} |\n|${headers.map(()=>'---').join('|')}|\n${rows.map(r=>'| '+r.map(v=>md(String(v??''))).join(' | ')+' |').join('\n')}`;
 return `# Phase 1 全基线审阅包\n\n日期：${e.capturedAt}。结构门禁 PASS；人审 ${e.review.status}。所有产品实现、目标构建、硬件与性能证据仍未建立。不得将此 PASS 当成生产许可或平台支持结论。\n\n## 已确认的许可与发行意图\n\n${sources.decisions.map(d=>`- ${d.id}：**${d.selected}**，${d.confirmedBy} / ${d.confirmedAt}。原答复：${d.confirmationText}。保留 ${d.retainedBlockers.join(', ')}。`).join('\n')}\n\n固定参考 ${sourceResult.counts.repositories} 个仓库，文件 ${sourceResult.counts.files}、外部项 ${sourceResult.counts.externals}。全部研究用途；生产复制、链接、再分发清单为空。逐文件/资产/二进制/子模块/驱动许可及十四条发行候选见 [SOURCE-AUDIT](SOURCE-AUDIT.md) 和 [sources.json](baseline/sources.json)；${sourceResult.blockers.length} 个来源阻碍仍保留，包含未知子模块、二进制对应源码、具体项目 LICENSE、第三方条款、Apple 组合发行、驱动正式签名与账号。责任：首次生产依赖前 Phase 2，驱动 Phase 3–5/17/21/22/38，发行 Phase 38–42。既有意图无需重选，也不授权未知文件。\n\n## 原能力、映射与验收\n\n七个目标范围的 ${features.features.length} 个平台原子记录、${features.surfaces.length} 个入口、${featureResult.counts.settings} 个设置条目、${features.cases.length} 个独立计划案例、${featureResult.counts.anchors} 个已核验固定源码锚点。平台重复能力分别计数；数量不是独特功能数，也不是语义穷尽证明。完整逐行证据/条件/案例见 [FEATURE-PARITY](FEATURE-PARITY.md)、[features.json](baseline/features.json)。105 项 v1 需求唯一主要阶段映射；新增 ORIG-01–10：语言/列表/封面、CLI、Android PiP、控制器细节、活动/诊断、游戏优化和连接钩子、仅输入会话、只读读流、颜色范围/444/HDR、编码器调参。详见 [需求](../.planning/REQUIREMENTS.md)。这些均属 v1，不是已实现或 TODO。\n\n设置声明/持久化/解析证据覆盖不等于每个动态消费分支已实测；后续主要阶段及 Phase 37/42 按独立案例收集运行证据。保留唯一控制租约、GameStream 基础、Flutter/native 边界和切换/断连保活，显式停 B 不影响 A/C。\n\n### 需要明确处理的 ${features.conflicts.length} 个冲突\n\n${features.conflicts.map(c=>`- **${c.id}**（${c.status}）：${c.description}。选项：${c.options.join('；')}。`).join('\n')}\n\n推荐保留 Apollo 经授权的只读加入能力：观察者禁止输入、设备上行及会话变更，无第二控制租约；每条读流独立协商 GPU/显存/带宽预算，超限解释拒绝。需明确修订现有 SESSION-MODEL 的不引入并行观察者段落，Phase 6/20/37 验证。原 Android API21–23（固定 minSdk21 对照 Flutter API24）及额外 Linux ARM32/RISC-V/板卡能力留在 v1 差异账本，Phase 2 先验证 Flutter/原生适配可行性，Android Phase 14/31、Linux Phase 34–35 构建；若需要超过单一子系统的新工作，在 Phase 2 提出具体阶段拆分，不把原能力自动挪入 TODO。\n\n## 实际环境与证据边界\n\nQuick/Deep：${e.mode}；总耗时 ${e.budget?.durationMs}ms / ${e.budget?.budgetMs}ms，单项最多 5 秒、每流 64KiB。\n\n${table(['查询','状态','版本','证据类型 / 诊断'],e.probes.map(p=>[p.id,p.status,p.version||'无版本结论',p.evidenceType+' / '+(p.error||'查询/元数据证据，不是构建')]))}\n\n原始 OS：ProductName=${e.host.ProductName}；DisplayVersion=${e.host.DisplayVersion}；CurrentBuild=${e.host.CurrentBuild}；UBR=${e.host.UBR}；独立 CIM Caption=${e.host.Caption}；OSArchitecture=${e.host.OSArchitecture}；ProcessArchitecture=${e.host.ProcessArchitecture}。\n\n${e.host.diagnostics.map(d=>'- '+d).join('\n')}\n\nGPU 原字段仅表示设备与驱动被枚举，包含虚拟适配器，不表示硬编/硬解测试：${(e.host.gpus||[]).map(g=>`${g.AdapterCompatibility} / ${g.Name} / ${g.DriverVersion}`).join('；')}。\n\n## 客户端最低范围候选及四层证据\n\n下表是 Flutter **3.44.0** 的历史声明和原型候选，不套用官网当前 3.47。SDK 升级须重新核对最低范围，不能通过升级静默砍掉原能力。\n\n${table(['平台','框架版本 / OS / 架构','最低候选 / 状态','原生限制','构建 / 实机 / TODO'],e.platforms.map(p=>[p.id,p.framework.version+' / '+p.framework.os+' / '+p.framework.architectures.join(', '),p.minimum.os+' / '+p.minimum.architectures.join(', ')+' / '+p.minimum.status,p.nativeConstraints.join('；'),p.buildEvidence.length+' / '+p.hardwareEvidence.length+' / '+(p.hardwareTodoId||'无')]))}\n\n版本化官方来源：${[...new Set(e.platforms.map(p=>p.framework.source))].map(s=>'[官方历史矩阵]('+s+')').join('；')}。最低 CPU 列是指令集架构，性能级别/内存门槛没有实测，留待 Phase 6/10。Win10/11 主机具体 build **pending-prototype**，Phase 3–5 验证；Win11 MF 摄像头 API 的 build22000 不允许抬高 Win10 下限。Apple 仅硬件验收进入 VFY-01/VFY-02，实现与目标工具链构建仍必须完成。\n\n## 机器台账及后续缺口\n\n${table(['机器 / 用途','OS / 架构','GPU / 驱动','可用证据状态','责任阶段'],e.machines.map(m=>[m.id+' / '+m.role,m.os+' / '+m.architecture,m.gpuVendor+' / '+m.gpuModel+' / '+m.driver,m.availability+' / '+m.evidence.join('；'),m.requiredByPhases.join(', ')]))}\n\n${table(['缺口 ID / 组件','用途 / 证据','状态 / 后续阶段','闭合动作'],e.gaps.map(g=>[g.id+' / '+g.component,g.purpose+' / '+g.evidence.join('；'),g.status+' / '+g.followupPhases.join(', '),g.resolutionNeeded]))}\n\n本阶段不要求安装依赖、驱动、限速工具或修改安全/网卡配置；后续依赖请求必须明确组件、用途、版本和官方来源。\n\n## 可复现测量方法候选\n\n推荐 ${e.measurementContract.method.warmupSeconds} 秒预热、${e.measurementContract.method.windowSeconds} 秒采样、${e.measurementContract.method.repeats} 轮；这是方法，不是性能 SLO。必须记录固定参考 commit 与二进制 SHA256、host/client 匿名 ID、OS/GPU/驱动、相同网络/分辨率/fps/codec/HDR/音频以及仪器、精度、时钟。不同参数拒绝比较。按 metric/unit 分组 nearest-rank p50/p95；无样本返回 unavailable，不能填 0 或虚构 p95。\n\n${table(['指标','单位','采集路径/限制'],Object.entries(e.measurementContract.metrics).map(([m,u])=>[m,u,e.measurementContract.collection[m]]))}\n\n${e.measurementContract.clockRequirement}。屏幕统计 overlay-estimate 只作估计，RTT/解码时长/玻璃到玻璃分别记录。缺仪器或校准写 unavailable；Phase 6/10 实测后再确认目标。完整可执行步骤与测量 CLI 见 [DEVELOPMENT](DEVELOPMENT.md)。\n\n${table(['场景','操作'],e.scenarios.map(s=>[s.id,s.description]))}\n\n## 决策选项与建议\n\n${e.decisions.map(d=>`### ${d.id}（${d.status}）\n\n${d.question}\n\n${d.options.map(o=>`- **${o.id}**：${o.description}；收益 ${o.benefits}；代价 ${o.costs}。`).join('\n')}\n\n推荐：${d.recommendation}。当前选择：${d.selected||'pending'}。`).join('\n\n')}\n\n## 仍保留的审计 flags\n\nBASE-01、BASE-02、BASE-03 均为 spec-less 分类 **unclassified/unresolved**；RESEARCH A1 的仪器精度/跨机时钟校准无实测。descriptor-less prohibitions 仍 **flagged-unverified**：工具/API/目录/构建不得伪装硬件支持，不得通过提高 Windows 下限避开 Win10，Apple 构建不能豁免。另外保留来源根许可证/FFI/上架声明不得冒充生产授权，缺子模块/驱动/二进制/签名不得冒充可发行，新增原能力不得默删或擅自转TODO，共有能力族/设置数量不得代替各端全集及独立案例；与前述两条环境 prohibitions 合计六条。人工审阅不会伪装自动分类引擎已经解决。\n\n人审记录：${JSON.stringify(e.review)}。保留阻碍详见来源数据及本报告缺口。最终 --require-review 必须等明确人类答复，所有冲突决定和开放环境缺口可引用后才能通过。Phase 1 只交付基线，不自动启动 Phase 2 或全部产品实现。\n`;
}
function cli(args=process.argv.slice(2)){
 if(!args.length||args.some(a=>['--environment','--review','--require-review','--measurement'].includes(a))){
 const opts={};for(let i=0;i<args.length;i++){const a=args[i];if(['--environment','--review','--require-review'].includes(a)){if(opts[a])throw Error('duplicate flag');opts[a]=true;}else if(['--root','--report','--measurement','--compare'].includes(a)){if(opts[a]||!args[i+1]||args[i+1].startsWith('--'))throw Error('missing/duplicate value');opts[a]=args[++i];}else throw Error(`unknown argument ${a}`);}
 const root=path.resolve(opts['--root']||ROOT),read=p=>JSON.parse(fs.readFileSync(guarded(root,p),'utf8'));if(opts['--measurement']){if(opts['--environment']||opts['--review']||opts['--require-review']||opts['--report'])throw Error('conflicting measurement flags');const input=read(opts['--measurement']),compare=opts['--compare']?read(opts['--compare']):undefined;if(fs.existsSync(guarded(root,'references/upstream-lock.json'))){const lock=readLock(root);for(const record of [input,compare].filter(Boolean))if(!lock.repositories.some(r=>r.name===record.reference?.repo&&r.commit===record.reference?.commit))throw Error('measurement reference must match fixed source lock');}const r=validateMeasurement(input,{compare});if(r.errors.length)throw Error(r.errors.join('\n'));console.log(JSON.stringify({...r,status:'PASS',measurementStatus:r.status}));return;}
 if(opts['--compare'])throw Error('--compare requires --measurement');if(opts['--environment']&&(opts['--review']||opts['--report']))throw Error('conflicting environment flags');if(opts['--report']&&(opts['--report']!=='docs/BASELINE-REVIEW.md'||!opts['--review']))throw Error('invalid baseline review report');
 const environment=read('docs/baseline/environment.json'),environmentResult=validateEnvironment({data:environment,requireReview:!!opts['--require-review']});if(environmentResult.errors.length)throw Error(environmentResult.errors.join('\n'));if(opts['--environment']){console.log(JSON.stringify({status:'PASS',scope:'environment',...environmentResult}));return;}
 const sources=read('docs/baseline/sources.json'),features=read('docs/baseline/features.json'),sourceResult=validateSources({root,data:sources}),featureResult=validateFeatures({root,data:features,sources});const errors=[...sourceResult.errors,...featureResult.errors];if(opts['--require-review']&&(featureResult.conflicts.length||sources.decisions.some(d=>d.status!=='selected')))errors.push('review still has pending source/feature decisions');if(errors.length)throw Error(errors.join('\n'));if(opts['--report'])atomicWrite(root,opts['--report'],renderBaselineReview({sources,features,environment,sourceResult,featureResult,environmentResult}));console.log(JSON.stringify({status:'PASS',scope:'full-baseline',sources:sourceResult.counts,features:featureResult.counts,environment:environmentResult.counts,review:environment.review.status,conflicts:featureResult.conflicts,productionReuseApproved:false,productSupportVerified:false}));return;
 }
  const opts={};for(let i=0;i<args.length;i++){const a=args[i];if(['--sources','--index-sources','--features','--allow-unmapped'].includes(a)){if(opts[a])throw Error(`duplicate argument: ${a}`);opts[a]=true;}else if(['--scope','--report','--root'].includes(a)){if(opts[a]||!args[i+1]||args[i+1].startsWith('--'))throw Error(`invalid argument: ${a}`);opts[a]=args[++i];}else throw Error(`unknown argument: ${a}`);}
  if(opts['--features']){
    if(opts['--sources']||opts['--index-sources'])throw Error('conflicting validation flags');if(opts['--report']&&opts['--report']!=='docs/FEATURE-PARITY.md')throw Error('invalid feature report path');
    const root=path.resolve(opts['--root']||ROOT),read=p=>JSON.parse(fs.readFileSync(guarded(root,p),'utf8')),data=read('docs/baseline/features.json'),sources=read('docs/baseline/sources.json');
    const r=validateFeatures({root,data,sources,scope:opts['--scope'],allowUnmapped:!!opts['--allow-unmapped']});if(r.errors.length)throw Error(r.errors.join('\n'));if(opts['--report'])atomicWrite(root,opts['--report'],renderFeatureParity(data,r));console.log(JSON.stringify({status:'PASS',scope:opts['--scope']||'features',checked:r.counts.features,counts:r.counts,unmapped:r.unmapped,conflicts:r.conflicts,finalMappingGate:!opts['--allow-unmapped']}));return;
  }
  if(opts['--allow-unmapped'])throw Error('--allow-unmapped requires --features');
  if(!opts['--sources']&&!opts['--index-sources'])throw Error('full baseline not yet available; select --sources');if(opts['--report']&&opts['--report']!=='docs/SOURCE-AUDIT.md')throw Error('invalid report path');const root=path.resolve(opts['--root']||ROOT),p=guarded(root,'docs/baseline/sources.json');let data;
  if(opts['--index-sources'])data=indexSources({root,scope:opts['--scope'],data:fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):undefined});else data=JSON.parse(fs.readFileSync(p,'utf8'));
  const result=validateSources({root,scope:opts['--scope'],data});if(result.errors.length)throw Error(result.errors.join('\n'));if(opts['--index-sources'])atomicWrite(root,'docs/baseline/sources.json',JSON.stringify(data,null,2)+'\n');if(opts['--report'])atomicWrite(root,opts['--report'],renderSourceAudit(data,result));console.log(JSON.stringify({status:'PASS',scope:opts['--scope']||'sources',checked:result.counts.files+result.counts.externals,counts:result.counts,errors:0,blockers:result.blockers.length,pendingDecisions:data.decisions.filter(d=>d.status==='pending').length,productionReuseApproved:false}));
}
module.exports={validateEnvironment,validateMeasurement,renderBaselineReview,METRICS,validateFeatures,renderFeatureParity,inventoryKeys,validateSources,validateAnchor,renderSourceAudit,indexSources,gitRun,guarded,atomicWrite,context,readLock,anchorFor,kindOf,spdx,decodeText,cli};
if(require.main===module){try{cli();}catch(e){console.error(JSON.stringify({status:'FAIL',errors:[e.message]}));process.exitCode=1;}}
