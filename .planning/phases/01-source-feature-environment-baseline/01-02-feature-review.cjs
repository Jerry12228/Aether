'use strict';
// Reproducible source curation for Plan 01-02. This reads fixed objects, not checkout text.
// Labels/mappings below are review judgments, not proof of product/platform support.
const fs=require('node:fs'),path=require('node:path'),api=require('../../../scripts/validate-baseline.cjs');
const root=path.resolve(__dirname,'../../..'),lock=api.readLock(root),contexts=new Map();
const ctx=name=>{if(!contexts.has(name))contexts.set(name,api.context(root,lock.repositories.find(r=>r.name===name)));return contexts.get(name);};
const text=(repo,p)=>api.decodeText(ctx(repo).read(p));
function at(repo,p,needle,span=2){const lines=text(repo,p).split(/\r?\n/);const i=lines.findIndex(l=>typeof needle==='string'?l.includes(needle):needle.test(l));if(i<0)throw Error(`missing curation anchor ${repo}/${p}/${needle}`);return api.anchorFor(ctx(repo),p,i+1,Math.min(lines.length,i+1+span),String(needle));}
const data={schemaVersion:1,capturedAt:'2026-10-07',purpose:'Fixed source capability inventory; semantic completeness awaits human review; no implementation/build/hardware claim',scope:{platforms:api.FEATURE_PLATFORMS||['helios-windows10','helios-windows11','selene-windows','selene-macos','selene-ios-ipados','selene-android','selene-linux'],complete:true},features:[],surfaces:[],cases:[],conflicts:[]};
const pending={
 'ORIG-01':[27,'用户能选择界面语言、应用封面/列表呈现偏好与警告呈现，保留各端可用的无障碍/本地化入口。'],
 'ORIG-02':[27,'用户能通过受鉴权且遵循实例生命周期的命令入口配对、列应用、启动/恢复、断开和显式停止，并配置串流偏好。'],
 'ORIG-03':[29,'Android 用户能在系统允许时启用画中画，保留串流与输入权限边界，并在前后台变化时恢复。'],
 'ORIG-04':[16,'用户能配置手柄死区、按钮交换/屏幕布局、手柄鼠标模拟/设备忽略，并使用可用电池、LED、运动、触摸板与分级震动反馈。'],
 'ORIG-05':[36,'用户能选择串流期间保持设备唤醒、游戏活动展示与连接诊断提示，系统或第三方不可用时明确说明。'],
 'ORIG-06':[27,'用户能配置游戏优化与连接/断连准备清理钩子；Aether 钩子不得在普通断连或切换时隐式停止实例/移除显示组。'],
 'ORIG-07':[20,'用户能使用 Apollo 原有纯输入能力，在唯一有效控制租约内注入输入而不消费音视频，保持实例与显示组生命周期。'],
 'ORIG-08':[20,'保留并明确授权原有只读加入已有串流的能力；是否并行观察及其资源/外设权限边界须在实施前按 Phase1 冲突决定，不产生第二控制租约。'],
 'ORIG-09':[15,'用户能配置可用色彩范围与原 HDR/4:4:4 呈现，协商结果和实际输出一致。'],
 'ORIG-10':[13,'用户能配置适用硬编码后端的质量/码控/预设及软件编码参数，无法应用时给出可解释状态。']
};
const reqPhase={AUTH:7,INST:8,VIDEO:9,WIN:10,INPUT:11,AUDIO:12,ENC:13,CODEC:14,COLOR:15,GAME:16,DISPLAY:17,MULTI:19,LEASE:20,RATE:23,CLIP:25,ADMIN:27,ANDROID:28,MAC:30,IOS:32,LINUX:34,OPS:36,SHIP:39,NET:6};
const idPart=s=>s.replace(/[^A-Za-z0-9]+/g,'-').toLowerCase();
function add({platform,key,label,behavior,anchors,req='ADMIN-02',tier='shared-native',setting=false,hardware='依赖实际 OS/API、设备和原生后端能力；尚未产品实测',aether}){
 const id=`${platform}-${idPart(key)}`;if(data.features.some(f=>f.id===id))throw Error(`duplicate curation feature ${id}`);
 if(req.startsWith('WIN-')&&platform!=='selene-windows')req=platform==='selene-macos'?'MAC-02':platform==='selene-linux'?'LINUX-02':platform==='selene-ios-ipados'?'IOS-01':'ANDROID-02';
 const proposed=pending[req],rows=fs.readFileSync(path.join(root,'.planning/REQUIREMENTS.md'),'utf8'),phase=proposed?proposed[0]:+(rows.match(new RegExp('^\\| '+req+' \\| Phase (\\d+) \\|','m'))?.[1]||reqPhase[req.split('-')[0]]);
 const feature={id,capability:label,platform,originalBehavior:behavior,anchors,settingIds:setting?[key]:[],conditions:{os:platform.startsWith('helios')?(platform==='helios-windows10'?'Windows 10；最低 build 待 Phase3–5 原型':'Windows 11；最低 build 待 Phase3–5 原型'):platform==='selene-ios-ipados'?'iOS/iPadOS；按源码 availability/API 分支；最低范围待审':platform==='selene-macos'?'macOS；按 Apple 原生后端/权限分支；最低范围待审':platform==='selene-android'?'Android；API level 与 OEM/输入/codec 条件按固定源码分支':platform==='selene-linux'?'Linux；X11/Wayland/驱动后端分别验证':'Windows 客户端；最低条件待审',architecture:'源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突',hardware},ownerTier:tier,requirementIds:proposed?[]:[req],primaryPhase:phase,mappingState:proposed?'needs-requirement':'mapped',caseIds:[`case-${id}`],aetherBehavior:aether||`保留“${label}”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例`,implementationEvidence:[],buildEvidence:[],automationEvidence:[],hardwareEvidence:[],hardwareTodoId:platform==='selene-macos'?'VFY-02':platform==='selene-ios-ipados'?'VFY-01':null,blockerIds:[]};if(proposed)feature.proposedRequirement={id:req,description:proposed[1],phase};data.features.push(feature);
 data.cases.push({id:feature.caseIds[0],featureIds:[id],platform,preconditions:[`准备 ${feature.conditions.os} 与 ${hardware}`,`使用固定参考提交核对“${label}”原行为；配对并取得所需权限`],steps:[setting?`记录 ${key} 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容`:`执行“${behavior}”的操作并记录实际画面/音频/输入/管理结果`,`针对 ${key} 切换实例、断连重连及撤销权限，分别记录状态`],expectedResults:[`${label} 的用户结果符合固定源码定义：${behavior}`,feature.aetherBehavior],negativeCases:[`拒绝 ${key} 的无效/越界请求；不支持的硬件/OS 显示明确原因`,'旧epoch或无权限操作不作用于新实例；显式停止只清理本实例'],evidenceRequired:['实现','目标工具链构建','契约/错误路径自动化',feature.hardwareTodoId?`实机 TODO ${feature.hardwareTodoId}；不以构建代替`:'目标平台真实设备/应用验收'],verificationPhase:phase,status:'planned',evidence:[]});return feature;
}
function surface(repo,platform,p,kind,extractor){const s={id:`${platform}-${repo}-${idPart(p)}-${kind}`,repo,platform,kind,path:p,extractor,anchors:[],inventoryKeys:[],entries:[],reviewed:true};data.surfaces.push(s);return s;}
function entry(s,key,anchors,f,reason,disposition='mapped'){s.inventoryKeys.push(key);s.entries.push({key,featureIds:f?[f.id]:[],disposition,reason,anchors});if(!s.anchors.length)s.anchors=[anchors[0]];}
// Explicit setting judgments, each setting remains an independent capability/case.
const qt={
 width:['视频宽度','WIN-01'],height:['视频高度','WIN-01'],fps:['目标帧率/高帧率','WIN-02'],bitrateKbps:['目标码率','RATE-01'],unlockBitrate:['解锁高码率选择','RATE-01'],autoAdjustBitrate:['分辨率变化时调整默认码率','RATE-01'],enableVsync:['垂直同步','WIN-02'],gameOptimizations:['主机游戏优化','ORIG-06'],playAudioOnHost:['主机同时播放音频','AUDIO-02'],multiController:['多个控制器独立编号','GAME-01'],enableMdns:['mDNS发现开关','AUTH-01'],quitAppAfter:['断开后退出应用旧偏好','INST-03'],absoluteMouseMode:['桌面绝对鼠标','INPUT-01'],absoluteTouchMode:['绝对/相对触摸','GAME-02'],framePacing:['帧 pacing','WIN-02'],connectionWarnings:['连接警告','OPS-02'],configurationWarnings:['配置警告','ORIG-01'],richPresence:['Discord游戏活动展示','ORIG-05'],gamepadMouse:['手柄鼠标模拟','ORIG-04'],detectNetworkBlocking:['网络阻断检测','OPS-02'],showPerformanceOverlay:['串流统计叠层','OPS-02'],audioConfig:['立体声/5.1/7.1配置','AUDIO-01'],videoCodecConfig:['H.264/HEVC/AV1选择','CODEC-02'],enableHdr:['HDR/10-bit','COLOR-01'],enableYUV444:['YUV 4:4:4','COLOR-02'],videoDecoderSelection:['软解/硬解选择','WIN-02'],rendererSelection:['原生呈现后端选择','WIN-02'],windowMode:['窗口/全屏/无边框','WIN-01'],uiDisplayMode:['界面列表呈现偏好','ORIG-01'],swapMouseButtons:['交换鼠标左右键','INPUT-01'],muteOnFocusLoss:['失焦静音','AUDIO-01'],backgroundGamepad:['后台手柄输入策略','ORIG-04'],reverseScrollDirection:['垂直/水平精确滚轮方向','INPUT-01'],swapFaceButtons:['AB/XY交换','ORIG-04'],keepAwake:['串流期间保持唤醒','ORIG-05'],captureSysKeysMode:['系统快捷键捕获策略','INPUT-02'],language:['界面语言','ORIG-01']};
const qpaths=['app/streaming/session.cpp','app/streaming/input/input.cpp','app/streaming/input/mouse.cpp','app/streaming/input/gamepad.cpp','app/streaming/input/keyboard.cpp','app/streaming/video/ffmpeg.cpp','app/streaming/audio/audio.cpp','app/gui/SettingsView.qml','app/settings/streamingpreferences.cpp'];
function consumer(repo,paths,needle){for(const p of paths){if(!ctx(repo).tree.has(p))continue;try{return at(repo,p,needle);}catch{}}throw Error(`missing consumer ${repo}/${needle}`);}
for(const platform of ['selene-windows','selene-macos','selene-linux']){
 const p='app/settings/streamingpreferences.h',s=surface('moonlight-qt',platform,p,'setting','qt-properties');
 for(const key of api.inventoryKeys(text('moonlight-qt',p),'qt-properties')){
  const a=at('moonlight-qt',p,new RegExp(`Q_PROPERTY\\(\\w+\\s+${key}\\b`),0);
  if(key==='recommendedFullScreenMode'){entry(s,key,[a],null,'派生推荐值，不是可独立控制的用户设置','implementation-detail');continue;}
  const spec=qt[key];if(!spec)throw Error(`unclassified Qt key ${key}`);const b=consumer('moonlight-qt',qpaths,key);
  const f=add({platform,key,label:spec[0],behavior:`用户可配置 ${key}：${spec[0]}；固定声明与实际读取/消费入口分别附锚点`,anchors:[a,b],req:spec[1],tier:/language|uiDisplay/.test(key)?'flutter-ui':'shared-native',setting:true,aether:key==='quitAppAfter'?'普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance':undefined});entry(s,key,f.anchors,f,'声明→实际读取/消费；平台差异分别验收');
 }
 // Every literal CLI option and shortcut is independently inventoried.
 const cp='app/cli/commandlineparser.cpp',cs=surface('moonlight-qt',platform,cp,'cli','qt-cli');
 for(const key of [...new Set(api.inventoryKeys(text('moonlight-qt',cp),'qt-cli'))]){const a=at('moonlight-qt',cp,new RegExp(`parser\\.add(?:Flag|Value|Toggle|Choice)Option\\("${key}"`),0);const f=add({platform,key:`cli-${key}`,label:`命令参数 ${key}`,behavior:`受控命令入口允许配置 ${key}；参数语义和允许值来自固定 parser`,anchors:[a],req:'ORIG-02',tier:'flutter-ui'});entry(cs,key,[a],f,'命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI');}
 const ip='app/streaming/input/input.cpp',is=surface('moonlight-qt',platform,ip,'shortcut','qt-shortcuts');
 for(const key of api.inventoryKeys(text('moonlight-qt',ip),'qt-shortcuts')){const a=at('moonlight-qt',ip,`m_SpecialKeyCombos[${key}].keyCode`,0);const req=/QuitAndExit/.test(key)?'INST-03':/Quit/.test(key)?'LEASE-03':/Paste/.test(key)?'CLIP-01':/Stats/.test(key)?'OPS-02':/FullScreen|Minimize/.test(key)?'WIN-01':'INPUT-02';const f=add({platform,key,label:`本地快捷键 ${key}`,behavior:`通过 ${key} 快捷键触发对应本地控制行为`,anchors:[a],req});entry(is,key,[a],f,'快捷键定义；保留功能，Aether可重设键位');}
}
const android={list_resolution:['分辨率','WIN-01'],list_fps:['帧率','WIN-02'],seekbar_bitrate_kbps:['码率','RATE-01'],frame_pacing:['帧节奏策略','WIN-02'],checkbox_stretch_video:['拉伸视频','ANDROID-02'],list_audio_config:['立体声/5.1/7.1','AUDIO-01'],checkbox_enable_audiofx:['Android音频效果','AUDIO-02'],seekbar_deadzone:['控制器死区','ORIG-04'],checkbox_multi_controller:['多控制器','GAME-01'],checkbox_usb_driver:['USB控制器驱动','GAME-01'],checkbox_usb_bind_all:['USB设备接管范围','GAME-01'],checkbox_mouse_emulation:['手柄鼠标模拟','ORIG-04'],analog_scrolling:['模拟摇杆滚轮轴','ORIG-04'],checkbox_vibrate_fallback:['机身震动回退','ORIG-04'],seekbar_vibrate_fallback_strength:['震动回退强度','ORIG-04'],checkbox_flip_face_buttons:['AB/XY交换','ORIG-04'],checkbox_gamepad_touchpad_as_mouse:['手柄触摸板鼠标','ORIG-04'],checkbox_gamepad_motion_sensors:['手柄运动传感器','GAME-01'],checkbox_gamepad_motion_fallback:['手机运动传感器回退','ORIG-04'],checkbox_touchscreen_trackpad:['相对/绝对触摸','GAME-02'],checkbox_mouse_nav_buttons:['鼠标前进/后退键','INPUT-01'],checkbox_absolute_mouse_mode:['绝对鼠标','INPUT-01'],checkbox_show_onscreen_controls:['屏幕控制器','ANDROID-01'],checkbox_vibrate_osc:['屏幕控制器震动','ORIG-04'],checkbox_only_show_L3R3:['屏幕只显示L3/R3','ORIG-04'],checkbox_show_guide_button:['屏幕Guide按钮','ORIG-04'],seekbar_osc_opacity:['屏幕手柄透明度','ORIG-04'],checkbox_enable_sops:['主机游戏优化','ORIG-06'],checkbox_host_audio:['主机播放音频','AUDIO-02'],checkbox_enable_pip:['画中画','ORIG-03'],list_languages:['语言','ORIG-01'],checkbox_small_icon_mode:['小图标列表','ORIG-01'],checkbox_unlock_fps:['解锁高帧率','WIN-02'],checkbox_reduce_refresh_rate:['降低屏幕刷新率匹配','ANDROID-02'],checkbox_disable_warnings:['警告展示开关','ORIG-01'],video_format:['H.264/HEVC/AV1选择','CODEC-02'],checkbox_enable_hdr:['HDR','COLOR-01'],checkbox_full_range:['全/有限色彩范围','ORIG-09'],checkbox_enable_perf_overlay:['性能叠层','OPS-02'],checkbox_enable_post_stream_toast:['结束后延迟统计','OPS-02']};
{
 const platform='selene-android',p='app/src/main/res/xml/preferences.xml',repo='moonlight-android',s=surface(repo,platform,p,'setting','android-preferences'),pref='app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java';
 for(const key of api.inventoryKeys(text(repo,p),'android-preferences')){const a=at(repo,p,`android:key="${key}"`,0);if(key.startsWith('category_')){entry(s,key,[a],null,key==='category_help'?'注释中的旧帮助分类，没有活动设置入口':'分类标题/布局组织，不是用户能力','implementation-detail');continue;}const spec=android[key];if(!spec)throw Error(`unclassified Android key ${key}`);const b=at(repo,pref,`"${key}"`,0);const f=add({platform,key,label:spec[0],behavior:`用户可配置 ${key}：${spec[0]}；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力`,anchors:[a,b],req:spec[1],setting:true});entry(s,key,f.anchors,f,'Android独立设置与实际偏好读取，未用Qt替代');}
}
const ios={bitrate:['码率','RATE-01'],framerate:['帧率','WIN-02'],height:['视频高度','WIN-01'],width:['视频宽度','WIN-01'],audioConfig:['音频声道','AUDIO-01'],onscreenControls:['屏幕控制器','IOS-01'],preferredCodec:['codec偏好','CODEC-02'],useFramePacing:['帧节奏','WIN-02'],multiController:['多控制器','GAME-01'],swapABXYButtons:['AB/XY交换','ORIG-04'],playAudioOnPC:['主机播放音频','AUDIO-02'],optimizeGames:['游戏优化','ORIG-06'],enableHdr:['HDR','COLOR-01'],btMouseSupport:['蓝牙鼠标','INPUT-01'],absoluteTouchMode:['相对/绝对触摸','GAME-02'],statsOverlay:['统计叠层','OPS-02']};
{
 const platform='selene-ios-ipados',repo='moonlight-ios',p='Limelight/Database/TemporarySettings.h',s=surface(repo,platform,p,'setting','objc-properties');
 for(const key of api.inventoryKeys(text(repo,p),'objc-properties')){const a=at(repo,p,new RegExp(`\\b${key}\\b`),0);if(['parent','uniqueId'].includes(key)){entry(s,key,[a],null,'CoreData关系或身份元数据，不是独立用户设置；配对身份在网络入口另列','implementation-detail');continue;}const spec=ios[key];if(!spec)throw Error(`unclassified iOS key ${key}`);const b=consumer(repo,['Limelight/ViewControllers/SettingsViewController.m','Limelight/Stream/Connection.m','Limelight/Stream/StreamConfiguration.h'],key);const f=add({platform,key,label:spec[0],behavior:`iOS 独立设置 ${key}：${spec[0]}，保留 Apple 可用性/设备分支`,anchors:[a,b],req:spec[1],setting:true});entry(s,key,f.anchors,f,'iOS设置→独立实际读取/配置；实机VFY-01不替代构建');}
}
const hostLabels={locale:'管理语言',sunshine_name:'主机名称',min_log_level:'日志级别',global_prep_cmd:'全局准备/清理命令',notify_pre_releases:'预发布更新通知',system_tray:'系统托盘',controller:'控制器输入开关',gamepad_driver:'虚拟控制器provider选择',gamepad:'手柄类型',ds4_back_as_touchpad_click:'Back转触摸板点击',motion_as_ds4:'运动映射DS4',touchpad_as_ds4:'触摸板映射DS4',virtualhid_randomize_mac:'虚拟HID身份策略',back_button_timeout:'Back长按策略',keyboard:'键盘输入开关',key_repeat_delay:'按键重复延迟',key_repeat_frequency:'按键重复频率',always_send_scancodes:'扫描码策略',key_rightalt_to_key_win:'右Alt映射Win',mouse:'鼠标输入开关',high_resolution_scrolling:'高精度滚轮',native_pen_touch:'原生笔/触摸',keybindings:'键位映射',audio_sink:'系统音频端点选择',virtual_sink:'虚拟音频端点选择',stream_audio:'音频传输开关',install_steam_audio_drivers:'可选Steam音频驱动安装策略',adapter_name:'GPU适配器选择',output_name:'物理显示器选择',dd_configuration_option:'显示设备拓扑配置',dd_resolution_option:'分辨率匹配策略',dd_manual_resolution:'手动分辨率',dd_refresh_rate_option:'刷新率匹配策略',dd_manual_refresh_rate:'手动刷新率',dd_hdr_option:'显示HDR匹配',dd_wa_hdr_toggle_delay:'HDR切换延迟',dd_config_revert_delay:'显示恢复延迟',dd_config_revert_on_disconnect:'断连恢复显示旧策略',dd_mode_remapping:'分辨率/刷新率映射',max_bitrate:'主机最大码率',minimum_fps_target:'最小目标帧率',upnp:'UPnP自动映射',address_family:'IPv4/IPv6',bind_address:'监听地址',port:'基础端口',origin_web_ui_allowed:'管理入口来源范围',csrf_allowed_origins:'CSRF允许来源',external_ip:'外网地址',lan_encryption_mode:'LAN加密策略',wan_encryption_mode:'WAN加密策略',ping_timeout:'连接保活截止时间',packetsize:'媒体包大小',file_apps:'应用清单路径',credentials_file:'管理凭据路径',log_path:'日志路径',pkey:'私钥路径',cert:'证书路径',file_state:'状态保存路径',fec_percentage:'FEC冗余',qp:'编码量化参数',min_threads:'软件编码线程',hevc_mode:'HEVC协商策略',av1_mode:'AV1协商策略',capture:'捕获provider',encoder:'编码provider'};
for(const platform of ['helios-windows10','helios-windows11']){
 const repo='sunshine',p='src_assets/common/assets/web/configs/config_tabs.json',s=surface(repo,platform,p,'setting','json-config');
 for(const tab of JSON.parse(text(repo,p)))for(const key of Object.keys(tab.options)){
  const a=at(repo,p,`"${key}":`,0),b=at(repo,'src/config.cpp',`"${key}"`,0);
  if(['vt','vaapi','vulkan'].includes(tab.id)){const backend=tab.id==='vt'?'src/platform/macos/av_video.m':tab.id==='vaapi'?'src/platform/linux/vaapi.cpp':'src/platform/linux/vulkan_encode.cpp';const c=at(repo,backend,/./,0),build=at(repo,tab.id==='vt'?'cmake/compile_definitions/macos.cmake':'cmake/compile_definitions/linux.cmake',tab.id==='vulkan'?'SUNSHINE_BUILD_VULKAN':tab.id==='vaapi'?'VAAPI':'av_video');entry(s,key,[a,b,c,build],null,`${tab.id} 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持`, 'outside-target');continue;}
  let req='ADMIN-02',tier='host-native';if(tab.id==='input')req=/native_pen_touch/.test(key)?'GAME-02':/keyboard|key_/.test(key)?'INPUT-02':/mouse|scroll/.test(key)?'INPUT-01':'GAME-01';else if(tab.id==='nv')req='ENC-01';else if(tab.id==='amd')req='ENC-02';else if(tab.id==='qsv')req='ENC-03';else if(tab.id==='sw')req='VIDEO-02';else if(tab.id==='network')req=/upnp|address|external/.test(key)?'OPS-01':/origin|csrf/.test(key)?'ADMIN-03':'NET-03';else if(tab.id==='av')req=/audio|sink/.test(key)?'AUDIO-02':/^dd_/.test(key)?'DISPLAY-03':/bitrate/.test(key)?'RATE-01':'VIDEO-01';else if(tab.id==='advanced')req=/hevc/.test(key)?'CODEC-01':/av1/.test(key)?'CODEC-02':/fec/.test(key)?'NET-02':'VIDEO-02';else if(key==='global_prep_cmd')req='ORIG-06';else if(key==='locale')req='ORIG-01';else if(key==='system_tray')req='SHIP-02';else if(key==='min_log_level'||key==='log_path')req='OPS-02';
  if(['nv','amd','qsv','sw'].includes(tab.id))req='ORIG-10';
  const label=hostLabels[key]||`${tab.id}后端参数 ${key}`;
  const f=add({platform,key,label,behavior:`Windows 主机配置 ${key} 控制“${label}”；实际取值/转换来自固定 config.cpp；可用范围按对应后端`,anchors:[a,b],req,tier,setting:true,hardware:['nv','amd','qsv'].includes(tab.id)?`分别需要 ${tab.id==='nv'?'NVIDIA':tab.id==='amd'?'AMD':'Intel'} 硬件/驱动/编码会话；可用参数待目标设备实测`:'Windows交互登录桌面及适用provider；驱动/签名仍未核验',aether:key==='dd_config_revert_on_disconnect'?'普通断连/切换保留实例显示组及拓扑；显式StopInstance才清理本组，旧自动恢复策略仅能作用于非实例拥有资源':undefined});entry(s,key,f.anchors,f,'Windows主机配置→实际解析；provider/API条件不冒称已支持');
 }
}
// Non-setting behaviors are curated separately; symbols come from actual consumption paths.
function behavior(repo,platform,p,key,label,needle,req,kind='input',hardware,extra=[]){const a=at(repo,p,needle);const f=add({platform,key,label,behavior:label,anchors:[a,...extra],req,tier:platform.startsWith('helios')?'host-native':kind==='management'?'flutter-ui':'platform-adapter',hardware});let s=data.surfaces.find(s=>s.repo===repo&&s.platform===platform&&s.path===p&&s.kind===kind);if(!s)s=surface(repo,platform,p,kind);entry(s,key,f.anchors,f,'独立非设置行为/平台消费入口');return f;}
for(const platform of ['selene-windows','selene-macos','selene-linux']){
 const r='moonlight-qt';
 behavior(r,platform,'app/streaming/input/gamepad.cpp','controller-battery','控制器电量上报','LiSendControllerBatteryEvent','ORIG-04');
 behavior(r,platform,'app/streaming/input/gamepad.cpp','controller-motion','控制器运动上报','LiSendControllerMotionEvent','GAME-01');
 behavior(r,platform,'app/streaming/input/gamepad.cpp','controller-touchpad','控制器触摸板上报','LiSendControllerTouchEvent','GAME-01');
 behavior(r,platform,'app/streaming/input/mouse.cpp','precise-horizontal-wheel','高精度水平滚轮','LiSendHighResHScrollEvent','INPUT-01','input',undefined,[at('moonlight-common-c','src/Limelight.h','LiSendHighResHScrollEvent'),at('sunshine','src/input.cpp','scrollAmount')]);
 behavior(r,platform,'app/streaming/input/keyboard.cpp','utf8-text','UTF-8文本输入','LiSendUtf8TextEvent','INPUT-02');
 behavior(r,platform,'app/streaming/input/abstouch.cpp','multitouch','原生多点触摸（声明最多10点，设备及主机条件须实测）','LiSendTouchEvent','GAME-02','input','最多10点为README声明；需多点输入设备与主机native touch支持',[at(r,'README.md','10-point')]);
 behavior(r,platform,'app/streaming/input/abstouch.cpp','pen','原生笔压力/方向输入','LiSendPenEvent','GAME-02','input','触控笔、SDL平台输入及Windows注入provider分别验证',[at('sunshine','src/input.cpp','penButtons')]);
 behavior(r,platform,'app/streaming/video/ffmpeg.cpp','decoder-fallback','FFmpeg软/硬解路径与失败回退','AV_CODEC_ID_H264','WIN-02','media');
 behavior(r,platform,'app/streaming/audio/audio.cpp','surround','多声道音频解码/输出','Opus','AUDIO-01','media');
 behavior(r,platform,'app/backend/nvpairingmanager.cpp','pair','配对确认与证书身份','pair','AUTH-01','network');
 behavior(r,platform,'app/backend/computermanager.cpp','discover','发现/手工主机管理','add','AUTH-01','network');
 behavior(r,platform,'app/backend/nvhttp.cpp','list-apps','应用列表/启动/恢复/显式退出','applist','ADMIN-01','management');
 behavior(r,platform,'app/backend/boxartmanager.cpp','box-art','应用封面缓存/展示','BoxArtManager','ADMIN-01','management');
 behavior(r,platform,'app/backend/nvcomputer.cpp','wake','Wake-on-LAN','wake','OPS-01','network');
 behavior(r,platform,'README.md','distribution-architectures','平台原包与ARM32/ARM64/RISC-V入口','Generic ARM',platform==='selene-linux'?'SHIP-04':platform==='selene-macos'?'SHIP-03':'SHIP-01','packaging','原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审');
}
const androidRoot='app/src/main/java/com/limelight/';
for(const [p,key,label,needle,req,kind]of[
 ['binding/input/ControllerHandler.java','battery','控制器电池/Android S API分支','sendControllerBatteryPacket','ORIG-04','input'],
 ['binding/input/ControllerHandler.java','motion','手柄运动/机身运动回退','sendControllerMotion','GAME-01','input'],
 ['binding/input/ControllerHandler.java','rumble','控制器震动与触发器震动','rumble','GAME-01','input'],
 ['Game.java','mouse-wheel','Android高精度滚轮','sendMouseHighResScroll','INPUT-01','input'],
 ['Game.java','pen','Android笔压力/倾斜输入','sendPenEvent','GAME-02','input'],
 ['binding/input/virtual_controller/VirtualController.java','osc-layout','屏幕手柄布局/编辑/重置','VirtualController','ORIG-04','input'],
 ['binding/video/MediaCodecDecoderRenderer.java','mediacodec','MediaCodec硬解/codec协商/重建','MediaCodec','ANDROID-02','media'],
 ['binding/audio/AndroidAudioRenderer.java','audio-route','Android音频输出声道/焦点/设备','AudioTrack','ANDROID-02','media'],
 ['nvstream/http/PairingManager.java','pair','Android配对身份','pair','AUTH-01','network'],
 ['nvstream/wol/WakeOnLanSender.java','wake','Android Wake-on-LAN','send','OPS-01','network'],
 ['PcView.java','manual-host','Android主机/发现/手工添加','add','AUTH-01','management'],
 ['AppView.java','apps','Android应用列表/封面/恢复/退出','quit','ADMIN-01','management'],
 ['ShortcutTrampoline.java','shortcut','Android应用桌面快捷方式启动','onCreate','ORIG-02','management']
])behavior('moonlight-android','selene-android',androidRoot+p,key,label,needle,req,kind);
behavior('moonlight-android','selene-android','app/src/main/AndroidManifest.xml','permissions','Android网络/USB/前后台/PiP权限入口','uses-permission','ANDROID-02','permission');
behavior('moonlight-android','selene-android','app/build.gradle','apk-abis','Android原APK/ABI构建入口','defaultConfig','ANDROID-01','packaging');
for(const [p,key,label,needle,req,kind]of[
 ['Input/ControllerSupport.m','battery','iOS控制器电池事件','LiSendControllerBatteryEvent','ORIG-04','input'],
 ['Input/ControllerSupport.m','motion','iOS控制器运动','LiSendControllerMotionEvent','GAME-01','input'],
 ['Input/ControllerSupport.m','feedback','iOS控制器震动/触发器/光效能力','rumble','GAME-01','input'],
 ['Input/StreamView.m','pen','Apple Pencil压力/倾斜/方位与hover','LiSendPenEvent','GAME-02','input'],
 ['Input/StreamView.m','high-res-wheel','iOS高精度双轴滚轮','LiSendHighResHScrollEvent','INPUT-01','input'],
 ['Input/StreamView.m','mouse-capture','iOS外接键鼠/捕获可用性分支','GC','IOS-01','input'],
 ['Input/AbsoluteTouchHandler.m','absolute-touch','iOS绝对触控','LiSend','GAME-02','input'],
 ['Input/RelativeTouchHandler.m','relative-touch','iOS相对触摸板','LiSend','GAME-02','input'],
 ['Input/OnScreenControls.m','screen-controller','iOS屏幕手柄/布局','OnScreenControls','IOS-01','input'],
 ['Stream/VideoDecoderRenderer.m','video-toolbox','iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现','AVSampleBufferDisplayLayer','IOS-01','media'],
 ['Stream/Connection.m','surround','iOS Opus多声道音频与统计','opus','AUDIO-01','media'],
 ['Network/PairManager.m','pair','iOS配对/证书','pair','AUTH-01','network'],
 ['Network/DiscoveryManager.m','discover','iOS发现/主机登记','Discovery','AUTH-01','network'],
 ['Network/WakeOnLanManager.m','wake','iOS Wake-on-LAN','wake','OPS-01','network'],
 ['Network/HttpManager.m','apps','iOS应用列表/启动/恢复/退出','applist','ADMIN-01','management'],
 ['Network/AppAssetManager.m','box-art','iOS应用封面','AppAsset','ADMIN-01','management']
])behavior('moonlight-ios','selene-ios-ipados','Limelight/'+p,key,label,needle,req,kind);
behavior('moonlight-ios','selene-ios-ipados','Limelight/Limelight-Info.plist','permissions','iOS本地网络/输入与目标声明','NS','IOS-02','permission');
behavior('moonlight-ios','selene-ios-ipados','Moonlight.xcodeproj/project.pbxproj','xcode-target','iOS/iPadOS Xcode构建/架构入口','IPHONEOS_DEPLOYMENT_TARGET','IOS-01','packaging');
for(const platform of ['helios-windows10','helios-windows11']){
 const r='sunshine';
 for(const [p,key,label,needle,req,kind]of[
  ['src/input.cpp','controller-motion','控制器运动/触摸/电池消费','controller motion','GAME-01','input'],
  ['src/platform/virtualhid_input.cpp','windows-injection','Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）','keyboard','INPUT-02','input'],
  ['src/video.cpp','encode','硬件/软件编码与codec能力','H264','VIDEO-02','media'],
  ['src/audio.cpp','audio','Windows系统音频捕获与Opus','opus','AUDIO-01','media'],
  ['src/platform/windows/display_vram.cpp','capture-frame','Windows物理显示器/GPU捕获','DXGI','VIDEO-01','media'],
  ['src/nvhttp.cpp','pair','Windows配对/应用/恢复控制入口','pair','AUTH-01','network'],
  ['src/confighttp.cpp','manage','Web管理/应用配置/凭据/日志','/api','ADMIN-03','management'],
  ['src/process.cpp','apps','应用进程/准备/清理命令','prep','ADMIN-01','management'],
  ['src_assets/windows/misc/service/install-service.bat','service','Windows服务安装入口','sunshine','SHIP-02','packaging']
 ])behavior(r,platform,p,key,label,needle,req,kind);
 const ar='apollo';
 const readOnly=behavior(ar,platform,'src/nvhttp.cpp','read-stream','有View权限可加入已有应用/纯输入会话','perm = PERM::_allow_view','ORIG-08','management',undefined,[at(ar,'src/crypto.h','view             ='),at(ar,'README.md','View Streams')]);
 behavior(ar,platform,'src/nvhttp.cpp','input-only','纯输入模式不启动音视频消费','bool is_input_only','ORIG-07','input',undefined,[at(ar,'src/audio.cpp','config.input_only')]);
 behavior(ar,platform,'src/crypto.h','granular-permission','输入/查看/启动/剪切板/命令分级授权','input_controller','AUTH-02','management');
 behavior(ar,platform,'README.md','connection-hooks','连接/断连命令钩子','Commands for client','ORIG-06','management');
 behavior(ar,platform,'README.md','persistent-display-id','虚拟屏原固定客户端身份','assigns a fixed identity','DISPLAY-01','management');
 behavior(ar,platform,'README.md','clipboard','剪切板同步','Clipboard sync','CLIP-01','management');
 data.conflicts.push({id:`${platform}-apollo-read-only`,featureIds:[readOnly.id],description:'Apollo固定源码允许view权限客户端加入已有应用会话；Aether现文档不引入并行观察者，原能力保留规则要求具体决定',sourceEvidence:readOnly.anchors,affectedConstraint:'主机全局至多一个ControlLease；首版原文无并行观察者；新增缺失原能力默认进入v1',options:['推荐：显式只读观察者能力，资源预算独立协商、禁止输入/上行/变更，不增加控制租约','修订：说明具体用户范围与替代方案后重新审阅；不得自动删除或塞TODO'],status:'open',decisionEvidence:null});
}
// Explicit codec, feedback, lifecycle and platform backend paths supplement preference rows.
for(const platform of ['selene-windows','selene-macos','selene-linux']){
 const r='moonlight-qt';
 for(const [key,label,needle,req]of[['h264','H.264基础视频与回退','VIDEO_FORMAT_H264','WIN-02'],['hevc','HEVC独立解码分支','VIDEO_FORMAT_H265','CODEC-01'],['av1','AV1独立解码分支','VIDEO_FORMAT_AV1','CODEC-02'],['hdr-main10','HDR10-bit/色彩元数据','VIDEO_FORMAT_H265_MAIN10','COLOR-01']])behavior(r,platform,'app/streaming/video/ffmpeg.cpp',key,label,needle,req,'media','codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测');
 behavior(r,platform,'app/streaming/input/gamepad.cpp','rumble-feedback','低/高频控制器震动反馈','void SdlInputHandler::rumble','GAME-01');
 behavior(r,platform,'app/streaming/input/gamepad.cpp','trigger-rumble','左右扳机震动反馈','SDL_GameControllerRumbleTriggers','ORIG-04');
 behavior(r,platform,'app/streaming/input/gamepad.cpp','rgb-led','控制器RGB LED反馈','setControllerLED','ORIG-04');
 behavior(r,platform,'README.md','controller-count','原README最多16玩家/控制器声明','up to 16 players','GAME-01','input','客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商');
 for(const action of ['list','pair','stream','quit'])behavior(r,platform,'app/cli/commandlineparser.cpp',`action-${action}`,`命令动作 ${action}`,`action == "${action}"`,'ORIG-02','management');
 if(platform==='selene-macos')behavior(r,platform,'app/streaming/video/ffmpeg-renderers/vt_metal.mm','metal','macOS Metal/VideoToolbox呈现入口','Metal','MAC-02','media','需要macOS/Xcode工具链及GPU/OS支持；VFY-02仅实机延期');
 if(platform==='selene-linux'){behavior(r,platform,'app/streaming/video/ffmpeg-renderers/vaapi.cpp','vaapi','Linux VA-API硬解/interop','VA','LINUX-02','media','VA-API驱动及X11/Wayland互操作条件');behavior(r,platform,'app/streaming/video/ffmpeg-renderers/pacer/waylandvsyncsource.cpp','wayland-pacing','Wayland垂直同步/权限路径','Wayland','LINUX-02','media','Wayland compositor协议/扩展，不与X11等同');}
}
behavior('moonlight-android','selene-android',androidRoot+'preferences/ConfirmDeleteOscPreference.java','osc-reset','重置屏幕手柄自定义布局','clear','ORIG-04','management');
for(const [key,label,needle,req]of[['h264','Android H.264解码','video/avc','ANDROID-02'],['hevc','Android HEVC解码与能力查询','video/hevc','CODEC-01'],['av1','Android AV1解码与能力查询','video/av01','CODEC-02']])behavior('moonlight-android','selene-android',androidRoot+'binding/video/MediaCodecDecoderRenderer.java',key,label,needle,req,'media','MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件');
for(const [key,label,needle,req]of[['h264','iOS H.264视频分支','VIDEO_FORMAT_H264','IOS-01'],['hevc','iOS HEVC视频分支','VIDEO_FORMAT_H265','CODEC-01'],['av1','iOS AV1视频分支','VIDEO_FORMAT_AV1','CODEC-02']])behavior('moonlight-ios','selene-ios-ipados','Limelight/Stream/Connection.m',key,label,needle,req,'media','Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01');
for(const platform of ['helios-windows10','helios-windows11']){
 behavior('apollo',platform,'src/stream.cpp','clipboard-permission','剪切板入站单独检查clipboard_set权限','PERM::clipboard_set','CLIP-02','management');
 behavior('apollo',platform,'src/process.cpp','old-auto-terminate','旧主机全部客户端断连时自动结束应用策略','Terminating app','INST-02','management');
 const f=data.features.at(-1);f.aetherBehavior='Aether覆盖旧自动结束策略：断开全部连接也不StopInstance；应用及显示组一直保留至用户显式停止';data.cases.find(c=>c.featureIds.includes(f.id)).expectedResults[1]=f.aetherBehavior;
 behavior('sunshine',platform,'src/input.cpp','host-motion-consume','控制器运动实际平台消费','platf::gamepad_motion','GAME-01','input');
 behavior('sunshine',platform,'src/input.cpp','host-battery-consume','控制器电池实际平台消费','platf::gamepad_battery','ORIG-04','input');
 behavior('sunshine',platform,'src/platform/windows/display_wgc.cpp','wgc','Windows Graphics Capture候选捕获与失败状态','GraphicsCapture','VIDEO-01','media');
}
const sourceData=JSON.parse(fs.readFileSync(path.join(root,'docs/baseline/sources.json'),'utf8'));
for(const f of data.features){if(f.platform.startsWith('helios')&&/gamepad|controller|input|touch|pen|windows-injection/.test(f.id))f.blockerIds=sourceData.blockers.filter(b=>/sunshine:gitlink:.*(libvirtualhid|ViGEmClient)|review:apollo-vigembus/.test(b.id)).map(b=>b.id);if(f.id.includes('persistent-display-id'))f.blockerIds=['review:apollo-sudovda-package'];}
const linuxArchive=data.features.find(f=>f.platform==='selene-linux'&&f.id.endsWith('distribution-architectures'));
data.conflicts.push({id:'qt-linux-extra-architectures',featureIds:[linuxArchive.id],description:'Qt README列出Linux ARM32/ARM64、实验RISC-V及特定板卡；Flutter目标声明和可用原生后端未证明同等构建范围，不能静默丢失这些用户目标',sourceEvidence:linuxArchive.anchors,affectedConstraint:'五客户端范围与原功能保留；框架支持不等于原生或板卡支持',options:['推荐：逐架构保留能力/构建差异并在Phase2/34–35验证，暂不宣称支持','需用户明确范围：若确需额外架构，提出具体适配/工具链验证阶段'],status:'open',decisionEvidence:null});
for(const list of [data.features,data.surfaces,data.cases,data.conflicts])list.sort((a,b)=>a.id.localeCompare(b.id));
const out=path.join(root,'docs/baseline/features.json');if(fs.existsSync(out)){const old=JSON.parse(fs.readFileSync(out,'utf8'));if(old.conflicts?.some(c=>c.status==='decided'))throw Error('refuse overwrite human conflict decision');if(old.features?.some(f=>f.proposedRequirement&&f.mappingState==='mapped'))throw Error('refuse overwrite completed requirement mappings');}
fs.writeFileSync(out,JSON.stringify(data,null,2)+'\n');console.log(JSON.stringify({status:'CURATED',features:data.features.length,surfaces:data.surfaces.length,cases:data.cases.length,conflicts:data.conflicts.length,pendingRequirements:Object.keys(pending)}));
