# Phase 06 协议原型执行证据（未完成）

当前任务为06-05 Task2；Task1已完成，任务1/3。最终人审尚未开始，NET-01–03及Phase6保持未完成。Phase3/plan3/status halted及安装门槛保持，未执行驱动/Apollo/信任策略变更、开发机重启或关机。

## 当前证据绑定与目标门槛

本包当前绑定实际sourceCommit `857943794b431192abc9e70f15d446e7aa11bde3`、inputDigest `30fe2ea71b55fa9c53d499ad4ce9baae4e740595b445df5e079e2bc95d768979`，42个原始Git输入。完整原始产物/编译器/SDK/arch/依赖/命令/日志哈希见[TARGETS.json](TARGETS.json)。这是已结束失败CI的可审记录，不能作为通过包。[实际CI](https://github.com/Jerry12228/Aether/actions/runs/38159407590)为9成功/3Android失败；其中iOS device只有实际构建，其他八个成功目标有真实运行。

| 目标 | scope | 运行exit | 真实已记录tests | 运行耗时ms |
|---|---|---:|---:|---:|
| android/arm32 | actual-runtime-failed | 1 | 28 | 158038 |
| android/arm64 | actual-runtime-failed | 1 | — | 219520 |
| android/x64 | actual-runtime-failed | 1 | 55 | 345212 |
| ios/arm64/iphoneos | actual-device-build-only | — | — | — |
| ios/arm64/iphonesimulator | actual-runtime | 0 | 42 | 380035 |
| ios/x64/iphonesimulator | actual-runtime | 0 | 42 | 341341 |
| linux/arm64 | actual-runtime | 0 | 17 | 81917 |
| linux/x64 | actual-runtime | 0 | 17 | 86665 |
| macos/arm64 | actual-runtime | 0 | 17 | 133525 |
| macos/x64 | actual-runtime | 0 | 17 | 147101 |
| windows/arm64 | actual-runtime | 0 | 15 | 99755 |
| windows/x64 | actual-runtime | 0 | 15 | 93920 |

失败目标的tests字段只保留实际完成前写入的子集（ARM32为28、x64为55，ARM64尚无聚合tests），不冒称其完整115已通过；原始suite失败计数见[真实失败记录](06-05-ANDROID-857-FAILURES.json)。

诊断版本6475aee/input7a45df56正在[新的实际CI](https://github.com/Jerry12228/Aether/actions/runs/38208095100)执行，不能覆盖上表旧source。新版本仅增加test-only策略标量与UDP syscall状态，不记录envelope或synthetic内容，不放宽deadline/断言/权限/epoch。其本机Windows真实15/15、68项独立validator通过，实际运行101327ms；独立归档在build/phase06/06-05/local-windows-6475aeebcc7b。后续validator禁止项修正还须重新绑定全部42输入。

## 原能力、决定与威胁映射

TARGETS.coverage明确列出D-01–16、NET-01–03、T-06-01–22及T-06-SC。各reference对应成功目标原始CTest/Node日志中的实际具名case；当前跨目标失败由顶层securityHighOpen=1及actual失败条目阻断，不能以其他平台相同case通过关闭失败目标。

原features.json全部637case保持；12个NET原设置分别关联自己的Win10/Win11 fec_percentage、lan_encryption_mode、wan_encryption_mode、packetsize、ping_timeout、port具名用例。retained完整复制06-03-PARITY的637个owner/extension/conditions记录。codec/HDR/444/color、多声道、全部input/feedback、input-only、observer、capture等原能力保持既有v1后续owner，不因本协议原型未实现改成TODO或删除。合同测试不等同Win10/11实机设置验证。

当前相同857输入真实Flutter/FFI22/22含21个独立host场景，原始日志及provider/scenario哈希在build/phase06/06-05/local-ffi-run-9KQZfd；原始result及Debug产物SHA见TARGETS.ffi。它不能覆盖随后6475或validator修正源码。每场景不同真实PID、loopback TLS/SRTP、连续ACK、成功dispose后callbacks0、host owned0。

## 独立校验与失败历史

CLI --scope all不隐式build，读取外部CI真实状态和artifact ID/下载receipt，再逐项比较原始Git/当前输入、baseline/compiler/cache/SDK/CPU、依赖notices、批准Botan配置、product/test二进制、实际命令exit/耗时、CTest/Node/XCTest具名case、清理和FFI记录。缺目标、零test、skip/cancel/TODO、错误SDK/arch/source、日志/二进制漂移及安全high未完成均拒绝。当前TARGETS的all入口实际exit1，直接拒绝CI failure。

计数校验初始16项真实RED为14行为失败；857版本68项通过。补充完整parity与原flagged条目校验时76项中73通过、3项真实assert.throws失败，详见[禁止项RED](06-05-VALIDATOR-FLAGS-RED.json)。修正后76/76、零fail/skip/cancel/TODO；这是validator unit测试，不是新增平台证据。首次sandbox spawn EPERM不是行为RED。

Task1最终source9a9e060/inputf7a9101f的[CI38157877824](https://github.com/Jerry12228/Aether/actions/runs/38157877824)真实12/12：Windows各15、Linux/macOS各17、Android三个ABI各115、iOS device实际构建、两个simulator各42。完整归档独立核验及原31控制/27media/60recovery用例检查均通过。该40输入证明Task1完成；新增validator使共同输入42，必须取得新版完整12通过后才能完成Task2。

历史失败均保留原source及原始hash：Linux mTLS23/24、Android取消线性化、iOS构建参数/冻结产物漂移、owned adbd UID准备、原relay清理、Mac D-08健康流窗口、native JSON caller格式，以及当前三个Android失败。见[执行记录](06-05-EXECUTION.json)、[Mac窗口RED/GREEN](06-05-MACOS-STREAM-PROGRESS.json)、[iOS产物漂移](06-05-IOS-ARTIFACT-DRIFT.json)。不将未知原因改写为已确诊；不把取消/编译失败记作行为RED或最终通过。

## 来源、安全和未验证范围

原批准ADR、OpenSSL3.5.9、libSRTP2.8.0、Botan3.13.0固定标量23cpp/78输入/7modules与完整license/notices保持。14项GameStream/Moonlight/Sunshine固定baseline源分别记录官方LF和历史审阅CRLF哈希；研究材料不作为产品代码或submodule。原FEC提案MD/JSON哈希及独立复用决定保持，未新增第二crypto/RNG/TLS provider。

原六条无descriptor禁止项和三个unclassified edge的statement/requirement/source逐项保留在TARGETS.flagged，status为flagged-unverified，verification/resolution/reason为null；手工边界测试不能自动闭合它们。其原计划/edge源哈希绑定。

全部媒体与authority均synthetic/test-only，网络为真实owned loopback；iOS在宿主内独立contexts，其余native/FFI场景为独立PID。build或模拟器不证明真实capture/codec/HDR/安装/产品延迟/SLO。minimum OS实际硬件验收未完成，Android原最低21/Apple deploy13/macOS10.15构建条件不提高既有最低OS。Apple物理功能、性能、安装按VFY-01/02留TODO；device构建与simulator XCTest仍为强制门槛。Win10主机HDR按R1不要求，Win11 D2 HDR与Win10七SDR实机验证仍由Phase3负责。

## 最终人审

humanReview=pending，原文、时间与reviewedMaterials均null。只有所有当前输入强制目标、FFI/根回归和独立all验证通过后，才形成确切材料hash包并请求真人确认。此前发布答复1、Phase2人审和自动exit0均不替代本阶段最终确认。
