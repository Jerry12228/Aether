# Phase06 协议原型最终自动验证证据

06-05 Task1/Task2已完成，任务2/3；全部自动门槛通过，Task3最终人审待真实答复。Phase6仍5/6，NET-01/02/03未关闭。Phase3仍phase3/plan3/status halted，原独立安装门槛不变。

## 精确输入和实际矩阵

原生构建/运行sourceCommit：`4edaf0352ca1b875e3536fe54970e8b85585c794`；共同42输入SHA256：`7ca1594252b56ee2fe36d99d13ad1b63e4f2ca69eead8784a29503d714ce2369`。后续证据文档提交保留这个实际编译source，不改标为文档HEAD。

[实际CI38252266760](https://github.com/Jerry12228/Aether/actions/runs/38252266760) completed/success，精确12jobs均success；产物全部下载并核对外部ID/name/digest/head、真实原生CPU/SDK/compiler/cache/命令/日志/二进制/计数与自有清理。正式`node scripts/verify-protocol.cjs --scope all --evidence docs/phase06/TARGETS.json`实际exit0，rawSHA：`8db63d1d3e502713789ebd7f39f32a1c5c2bc34fe3be98dd329a285e06df01ee`。具体完整哈希和观察计数在[TARGETS](TARGETS.json)，不是依据workflow存在或自报告success。

| 目标/arch/SDK | 构建耗时ms | 实际测试数 | 运行耗时ms | manifest SHA前缀 |
|---|---:|---:|---:|---|
| android/arm32 | 99817 | 115 | 355507 | 676f6223c8f7 |
| android/arm64 | 102223 | 115 | 592865 | ccfa9c9ace79 |
| android/x64 | 81166 | 115 | 346621 | 3c0357942c75 |
| ios/arm64/iphoneos | 166645 | 实际device构建 | — | babaf301722f |
| ios/arm64/iphonesimulator | 318687 | 42 | 321644 | 30cfee082abd |
| ios/x64/iphonesimulator | 528183 | 42 | 442393 | c8342db9897f |
| linux/arm64 | 83524 | 17 | 82089 | 4ab6fd1872f4 |
| linux/x64 | 117562 | 17 | 82113 | 12c24e72a13c |
| macos/arm64 | 94322 | 17 | 111414 | f60028ef4505 |
| macos/x64 | 305023 | 17 | 133109 | 6fab8a79bec2 |
| windows/arm64 | 743406 | 15 | 100728 | 3688d52aa7e2 |
| windows/x64 | 570132 | 15 | 96885 | 2a0a4175f02d |

Windows各15、Linux/macOS各17是CTest总数；桌面/Android原31个control场景、27个media、60个recovery具名case均保留，独立parser核验完整原日志。Android各ABI115在匹配自有guest真实执行；iOS device仅minimum13真实构建，不宣称device运行，两个simulator各42项真实XCTest/xcresult。每目标还实际执行85项known-bad/合法证据validator，零失败/skip/cancel/TODO。fast/full耗时分栏见manifest/commands及LIMITS，不将CI/build时间作为产品性能。

## 本机同输入回归

Windows x64 Release15/15，运行93001ms，独立validator85/85；Flutter/Dart FFI22/22和21个独立host场景，实际18538ms。每场景不同真实PID、loopback TLS/SRTP、连续ACK；dispose后callback0及host owned0。封存原始Debug产物、42Git blob及21场景日志/provider/scenario SHA见[当前本地记录](06-05-CURRENT-LOCAL.json)。

旧Helios Release实际exit0（3318ms）、根Debug CTest11/11（27015ms），与隔离协议输入分别绑定，见[根回归](06-05-ROOT-REGRESSION.json)。没有启动设备安装probe。GSD schema/UI检查未阻断；codebase drift因缺STRUCTURE.md明确skipped，不当成已验证，见[原始检查](06-05-FINAL-HOOKS.json)。

新输入本机Android自有AVD回归及清理另见[当前Android](06-05-LOCAL-ANDROID-4EDAF03.json)，不是物理设备或生产能力。旧038输入的115/115和CI38214118510/12通过保持独立历史，不覆盖当前输入。

## D-01–16、原能力和威胁

下表为用户确认的合同原文及一项实际观察case；全部多项reference见TARGETS.coverage，正式all已逐项核对。

| 决定 | 原确认合同 | 实际具名case之一 |
|---|---|---|
| D-01 | Helios/Selene 存在共同支持的 Aether 协议版本即可连接；无共同版本时拒绝，并提示需要升级哪一端。不增加旧 Moonlight/Sunshine 互通要求。 | D-01 complete original NET case contract mapping retains all source cases |
| D-02 | 请求的能力无法满足时，说明原因并展示替代方案，由用户选择确认后继续；不擅自降级。当前连接及已运行的流保留。 | D-02 one complete confirmation runs all five synthetic streams through real sockets |
| D-03 | 不可用功能保留选项，禁用并显示具体原因，不能通过隐藏选项掩盖能力差异。 | D-03 protection cannot be disabled and Win10 HDR returns SDR reason |
| D-04 | 多项能力不满足时，优先一次展示并确认完整替代方案；同时允许返回设置修改后重试。方案必须列出差异及最终实际规格，不能先部分执行再要求确认。 | D-04 full multi-stream proposal is returned before any grant |
| D-05 | 意外掉线后自动重试一段时间，展示重连状态并允许随时取消；连续失败后转为手动重试，说明失败原因。具体间隔、退避和超时由原型测量确定。 | D-05 actual transport loss preserves bounded manual wait and same handle fresh retry |
| D-06 | 重连必须重新鉴权。原控制连接重连后，主机控制权空闲则自动恢复对原实例的控制；若被其他连接占用，提示冲突，由用户选择下一步，不自动抢占。恢复使用新租约 epoch，拒绝旧连接的迟到消息；不向观察者自动授予控制。 | D-06 observer fresh authentication never gains controller permission |
| D-07 | 恢复控制不自动恢复上行外设。一次列出掉线前开启的麦克风/摄像头，由用户确认恢复或继续关闭；恢复仍需权限有效、设备可用。原路由和旧媒体缓冲按既有租约边界清空。 | D-07 upstream cancel uses host transaction before commit |
| D-08 | 单条视频流故障只恢复该流，正常的控制、音频及其他视频流继续运行。故障流展示状态并有界自动重试；需要降低规格时重新让用户选择。连接整体失效按 D-05 处理，不能把全连接故障伪装成单流故障。 | D-08 repeated stream recovery advances only that stream key |
| D-09 | 提供两种可选策略：“优先主操作屏”先保主屏体验，再降低辅助屏规格或减少流数；“优先保留全部屏幕”先均衡降低规格，尽量不减少屏数。策略用于生成方案，实际调整仍遵循 D-02/D-04 的用户确认。 | D-09 six-dimensional capacity zero 0 |
| D-10 | 首次尚无保存偏好时，默认“优先保留全部屏幕”；用户可切换为“优先主操作屏”。 | D-04 full multi-stream proposal is returned before any grant |
| D-11 | 提供桌面/游戏两种视频偏好：桌面优先保留分辨率，再降低帧率；游戏优先保留帧率，再降低分辨率。方案展示各屏实际规格。用户未指定桌面/游戏的初始默认值，不能写成已确认默认。 | D-11 desktop preserves resolution |
| D-12 | 下行桌面与摄像头上行竞争带宽时优先远程操作，先降低摄像头规格，控制和音频保持可用。无法满足可用性时明确拒绝/说明，不能宣称任意资源条件下必定可运行。 | D-12 camera reduces first and inadequate audio reserve explains refusal |
| D-13 | 身份或连接保护验证失败必须拒绝，不提供绕过验证入口。解释具体原因并引导处理，区分版本不兼容、身份变化、权限失效等；身份变化需重新核验后进入配对流程，具体配对留在 Phase 7。 | D-13 all three old policy scopes reject while current synthetic envelopes contain no logged content |
| D-14 | 默认记录运行摘要与异常，包含协商结果、连接/流状态、拒绝原因和必要统计；详细网络追踪由用户临时开启。所有模式禁止记录密钥、凭据、剪切板内容或音视频内容。 | D-13 all three old policy scopes reject while current synthetic envelopes contain no logged content |
| D-15 | 临时追踪到期或连接断开时自动关闭，显示剩余时间，可提前停止或续时。追踪时长、日志上限及具体脱敏字段由研究/原型确定，不自动跨重连继续追踪。 | D-15 trace duration boundary 0 |
| D-16 | 短暂丢包或单流故障在状态中提示，恢复后收起，不打断操作；详细经过入日志。持续失败才显示需要处理的提示，判定阈值由原型验证确定。 | D-16 threshold neighboring requested retry windows 499 |

NET-01/02/03、T-06-01–22及T-06-SC共23威胁均有实际具名case引用；仅mitigated-synthetic，不宣称标准认证。原features.json完整637case/既有v1 owner/extension/conditions保留；Win10/11各fec_percentage、lan_encryption_mode、wan_encryption_mode、packetsize、ping_timeout、port共12设置均有自己的原具名合同用例。不能由OS标签推定两OS实机运行。codec/HDR/444/color、多声道、全部input/feedback/input-only/observer/capture等原能力按[PARITY](06-03-PARITY.json)保持后续owner，不删减或默认转TODO。

原六条无描述符禁止项与三条unclassified edge仍flagged-unverified，verification/resolution/reason为null；来源文件与内容SHA在TARGETS.flagged。新增边界负例不替代这些条目的分类或验证。

| 原禁止项 | requirement/category | 保留状态 |
|---|---|---|
| MUST NOT 将断连/切换清理变成停止持久实例、应用、显示组或删除外来资源。 | NET-01/safety | flagged-unverified；verification/resolution/reason=null |
| MUST NOT 以测试身份/authority 给产品增加认证绕过、观察者上行或第二控制租约。 | NET-03/safety | flagged-unverified；verification/resolution/reason=null |
| MUST NOT 把synthetic媒体、假时钟、build或模拟器记录宣传为真实设备/HDR/产品性能通过。 | NET-02/transparency | flagged-unverified；verification/resolution/reason=null |
| MUST NOT 静默降级、先部分执行再求同意、隐藏不可用功能或挤占其他连接已有资源。 | NET-01/values | flagged-unverified；verification/resolution/reason=null |
| MUST NOT 执行或安排开发机重启/关机，或借协议验证安装驱动、改Apollo、信任及安全策略。 | NET-02/safety | flagged-unverified；verification/resolution/reason=null |
| MUST NOT 把Apple实机TODO扩展成目标构建/可运行自动检查豁免，或将缺证据、零测试、跳过记为已通过。 | NET-02/transparency | flagged-unverified；verification/resolution/reason=null |

| 原edge | 原probe | 保留状态 |
|---|---|---|
| NET-01 | unclassified — review manually | unclassified；flagged-unverified；verification/resolution/reason=null |
| NET-02 | unclassified — review manually | unclassified；flagged-unverified；verification/resolution/reason=null |
| NET-03 | unclassified — review manually | unclassified；flagged-unverified；verification/resolution/reason=null |

## 审阅、修复和失败保留

[首轮审阅](../../.planning/phases/06-gamestream/06-REVIEW-FIRST.md)CR-01为FPS分母乘15发生32位溢出，CR-02为固定五stream空间迟校验。8fbd20b真实行为RED；e9e61ac宽乘法/安全窄化并在typed3、legacy2 full-media授权前拒绝非法base；0685a70修正新fixture未打开control时的通用ACK清理。当前全部矩阵实际运行，原D11内1/1及native boundaries child34/34、parent4/4 GREEN。见[RED](06-05-REVIEW-BOUNDARY-RED.json)、[GREEN](06-05-REVIEW-BOUNDARY-GREEN.json)、[修正复核](../../.planning/phases/06-gamestream/06-REVIEW.md)与[处置](../../.planning/phases/06-gamestream/06-REVIEW-DISPOSITION.md)。内联标准审阅open critical/warning/info0、resolved3；无独立agent、外部审阅或TSan。

新增CR-03为提前quarter-TTL接收截止：a0faff1在现有fec-golden内真实独立SRTP/UDP排队5ms截止负例先RED，01b2a8f在实际deadline内继续接收、解码前后仍严格拒绝过期，原TTL25/64包/队列上限保持，当前完整矩阵通过。test-only opcode100只在原action deadline内等下一真实window，不改原断言/延迟/恢复300/500/900ms，不宣称100ms硬SLO；原Mac重复window RED保留，新增本地确定性fail-before-fix注入缺失如实记录。执行器另有HTTP504有界三次重试与6种独立故障检查、owned guest逐项stopped核验、protocol-full组60s聚合和Apple总30分钟准备预算；每Node10s/native5s、fast30s和所有协议时钟保持，旧全部失败单独保留。详见MEDIA-DEADLINE-RED/MEDIA-WINDOW-GREEN/INFRA-REPAIR/DOWNLOAD-RETRY-CHECK。

Linux mTLS、Android取消线性化、iOS构建/产物冻结、owned relay/adbd、Mac D08/D16、控制序号、TLS关闭分类、ready空文件及完成通知顺序等历史失败保留各实际source/rawSHA和RED/GREEN，详见[EXECUTION](06-05-EXECUTION.json)。编译或工具封装失败不计行为RED；旧857 Android失败原因未完全确诊，不倒改为已确定或通过。独立validator原16/68/76/85项RED/GREEN保留，当前85项覆盖错误counts/log/hash/CPU/SDK/source、CI缺/重/错jobs、637parity、六禁止与三edge篡改和秘密sentinel。

下载receipt仅由自有adapter将原artifact.id复制到正式顶层ID；原始回执/原始SHA和外部id/name/digest/head核验保留，未改原生输入或放宽验证。见[本轮转换](06-05-DOWNLOAD-RECEIPT-NORMALIZATION-38252266760.json)。FFI独立Debug路径在正式all首次被拒；兼容新归档仅新增经典路径alias，清单字节/原始receipt SHA完全相同，原归档及失败日志保留，见[FFI归档转换](06-05-FFI-ARCHIVE-CANONICALIZATION.json)。无validator或原生输入修改。公开推送历史auto-review拒绝保留，当前真人明确[重新授权](06-05-PUBLICATION-REAFFIRMATION.json)解除发布阻断，不能代替最终人审。

## 来源与范围

固定GameStream基线/字段/通道映射及保留、重构、扩展判断见[ADR](PROTOCOL-ADR.md)与[原批准快照](06-01-REVIEW-SNAPSHOT.json)。OpenSSL3.5.9/libSRTP2.8.0/批准Botan3.13.0标量23cpp、78输入、7modules，official archive/SHA/license/notices与target headers均核验；FEC-ALTERNATIVES原审阅MD/JSON hash保持，[FEC批准](FEC-REUSE-DECISION.json)未改。协议3/schema1与旧1/2、公开C ABI1及legacy queryVersion1保持，typed control queryVersion2为已批准的增量合同，无第二crypto/RNG/TLS provider。

覆盖synthetic媒体/test-only authority和真实loopback TLS/SRTP/FFI；真实codec/capture/HDR/设备、生产authority、非loopback网络、minimum OS实机、产品SLO未验证，后续owner保留。Apple物理功能/性能/安装仍VFY-01/02 TODO；实际Apple构建/XCTest已完成，不能以物理TODO豁免。本阶段真实三轮量测仍绑定f853627的原源/产物，详见[LIMITS](LIMITS.md)，不重标当前source。无驱动/Apollo/系统信任/防火墙更改，未执行或安排开发机重启/关机。

## 强制最终人审

humanReview：pending；response/recordedAt/reviewedMaterials为null。具体最终材料SHA256封存清单见[FINAL-REVIEW-PACKAGE](FINAL-REVIEW-PACKAGE.json)。06-05 Task3必须取得真人对该包已测范围的确认，不复用历史选项1或Phase2确认；确认只覆盖协议原型，不授权Phase3安装或自动开始后续实现。六禁止与三edge仍flagged，Apple物理及其余范围按以上证据限制保留。
