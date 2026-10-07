// Execution evidence: curated fixed-source observations, not a production dependency or legal clearance.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const v=require(path.join(root,'scripts/validate-baseline.cjs'));
const target=path.join(root,'docs/baseline/sources.json');
const data=JSON.parse(fs.readFileSync(target,'utf8'));
if(data.decisions.some(d=>d.status==='selected'))throw Error('Do not regenerate manual observations after human selection without reviewing the recorded decisions.');
const lock=v.readLock(root),cache=new Map();
const context=id=>{if(!cache.has(id))cache.set(id,v.context(root,lock.repositories.find(r=>r.name===id)));return cache.get(id);};
const findings=[
  ['scope-no-implicit-gpl','moonlight-common-c','README.md','requires the','common-c 要求指定 ENet fork；两个 gitlink 已锁，内部源码未审计；GPL根文本不是逐文件/or-later授权证据',[2]],
  ['qt-lgpl-directory','moonlight-qt','h264bitstream/LICENSE','Version 2.1','h264bitstream 有独立LGPL2.1文本；目录范围、源/包与链接义务单独审查',[2,10]],
  ['qt-wix-reciprocal','moonlight-qt','wix/MoonlightSetup/RtfTheme.xml','Microsoft Reciprocal License','WiX RtfTheme 明示Microsoft Reciprocal License与复制来源；引用的LICENSE.TXT未随该路径提供；主题不纳入拟生产复用',[39]],
  ['android-openssl','moonlight-android','app/src/main/jni/moonlight-core/openssl/include/openssl/opensslv.h','Apache License','OpenSSL头部为Apache2.0候选；四架构libcrypto.a已锁blob/SHA256，头部版本不证明预编译库完整对应源码',[2,28]],
  ['ios-ffmpeg-static','moonlight-ios','libs/FFmpeg/include/libavutil/ffversion.h','FFMPEG_VERSION','FFmpeg头部声明N-112686-g3f890fbfd9；iOS/tvOS静态库摘要已锁，实际配置/对应源码及LGPL/GPL状态仍待查',[2,32]],
  ['ios-opus-script','moonlight-ios','BuildScripts/build-libopus.sh','curl -LO','Opus脚本变量下载不等于包已锁；脚本Apache通知不替代库自身许可',[2,32]],
  ['apollo-sudovda-package','apollo','src_assets/windows/drivers/sudovda/SudoVDA.inf','SudoVDA.dll=1','INF引用SudoVDA.dll；固定树含接口、INF/CAT/CER和安装脚本，缺驱动DLL及完整源码/独立授权；签名未验证',[3,17,39]],
  ['apollo-third-party-assets','apollo','NOTICE','Valve','NOTICE含Valve商标提示；图标/生成资源不因根GPL自动获准；Aether拟独立制作品牌资源',[2,39]],
  ['apollo-vigembus-download','apollo','cmake/packaging/windows.cmake','EXPECTED_HASH','ViGEmBus下载入口声明SHA256；未下载/认证原包，不是已验证签名或再分发许可',[16,39]],
  ['virtual-audio-beta','virtual-audio-driver','README.md','test signing','音频驱动README明示beta/test signing；默认安全配置生产路线阻断，PCM注入仍需Phase4原型',[4,21,39]],
  ['virtual-display-arm64','virtual-display-driver','README.md','ARM64 Support in Windows','VDD称Win11 24H2+ ARM64可能需要test signing；Signed/HDR表为上游声明，实际包/默认配置安装未验证',[3,17,39]],
  ['virtual-display-microsoft-origin','virtual-display-driver','Virtual Display Driver (HDR)/MttVDD/Driver.cpp','Copyright','VDD源码有Microsoft版权头部；样例来源范围独立追溯，根MIT不等于整个provider包已批准',[3,39]],
  ['camera-independent-mit','windows-camera','Samples/NetworkMediaStreamer/LICENSE','MIT License','NetworkMediaStreamer独立MIT文本已单列；VirtualCamera样例、运行系统组件和Win10方案/发布包分别审查',[5,22,39]],
  ['gnu-combination-source','moonlight-common-c','LICENSE.txt','5. Conveying','GPLv3的5/6/10条按锁定许可对象核对；C ABI/FFI不自动免除组合与对应源码义务。官网抓取超时，官方FAQ检索可查',[2]]
];
data.manualFindings=[];
for(const [id,repo,p,needle,description,phases] of findings){
  const ctx=context(repo),lines=v.decodeText(ctx.read(p)).split(/\r?\n/),index=lines.findIndex(l=>l.includes(needle));
  if(index<0)throw Error(id+' missing fixed evidence');
  const eid='manual:'+id,bid='review:'+id;
  data.licenseEvidence=data.licenseEvidence.filter(x=>x.id!==eid);data.blockers=data.blockers.filter(x=>x.id!==bid);
  data.licenseEvidence.push({id:eid,origin:'manual',anchor:v.anchorFor(ctx,p,index+1,index+1,'manual source review'),scopePaths:[p],spdxExpression:null,obligations:['按实际复用产物核对完整范围；保留此未决项'],reviewState:'unresolved',blockerIds:[bid]});
  data.blockers.push({id:bid,origin:'manual',description,evidenceIds:[eid],affectedRouteIds:data.routes.filter(r=>r.sourceIds.includes(repo)).map(r=>r.id),requiredByPhases:phases,resolutionNeeded:'在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围',status:'open'});
  data.manualFindings.push({id,description,evidenceIds:[eid],blockerId:bid,requiredByPhases:phases,status:'blocked'});
}
const drivers=[
  ['apollo','src_assets/windows/drivers/sudovda/SudoVDA.dll','apollo-sudovda-package',[3,17,39]],
  ['virtual-display-driver','Virtual Display Driver (HDR)/MttVDD','virtual-display-microsoft-origin',[3,17,39]],
  ['virtual-audio-driver','Source','virtual-audio-beta',[4,21,39]],
  ['windows-camera','Samples/VirtualCamera','camera-independent-mit',[5,22,39]]
];
for(const [repo,p,fid,phases] of drivers){const id=repo+':driver-candidate';data.externals=data.externals.filter(x=>x.id!==id);data.externals.push({id,origin:'manual',parentRepo:repo,kind:'driver',path:p,url:null,commit:context(repo).repo.commit,digest:null,materialization:'absent',licenseEvidenceIds:['manual:'+fid],blockerIds:['review:'+fid,'driver-production-signing'],requiredByPhases:phases,notes:'精确生产设备包未获取/签名核验；源码候选存在不代表交付包可用。'});}
data.reviewNotes={reviewedBy:'Codex fixed source inspection; human/legal clearance pending',date:'2026-10-07',productionCopyList:[],productionLinkList:[],productionRedistributionList:[],futureCandidates:{compatibleOpenSource:['common-c 协议实现，逐项clearance后再复制/链接','Sunshine Windows媒体/捕获行为；不搬旧UI'],independentImplementation:['Aether自写GameStream扩展契约；codec/crypto/driver另审']},excludedCandidates:['旧Qt/Android/iOS UI作为产品UI','无完整来源/授权/签名的SudoVDA包','未闭合WiX主题','上游标志/商标'],onlineTerms:['Apple/Android/Microsoft/Debian/Apache官方页面已取回','GNU官网许可超时；固定许可文本和官方FAQ检索核查'],flags:['BASE-02 unclassified/unresolved','根许可/缺依赖prohibitions flagged-unverified']};
for(const key of ['externals','licenseEvidence','blockers'])data[key].sort((a,b)=>Buffer.from(a.id).compare(Buffer.from(b.id)));
const result=v.validateSources({root,data});if(result.errors.length)throw Error(result.errors.join('\n'));
v.atomicWrite(root,'docs/baseline/sources.json',JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({manualFindings:findings.length,deviceCandidates:drivers.length,productionClearances:0}));
