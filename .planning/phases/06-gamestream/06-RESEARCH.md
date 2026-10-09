# Phase 6: GameStream 协议重构与扩展 - Research

**Researched:** 2026-10-09（Asia/Singapore）
**Domain:** 固定 GameStream 实现、原生安全传输与多流协议原型
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### 版本与能力不匹配

- **D-01:** Helios/Selene 存在共同支持的 Aether 协议版本即可连接；无共同版本时拒绝，并提示需要升级哪一端。不增加旧 Moonlight/Sunshine 互通要求。
- **D-02:** 请求的能力无法满足时，说明原因并展示替代方案，由用户选择确认后继续；不擅自降级。当前连接及已运行的流保留。
- **D-03:** 不可用功能保留选项，禁用并显示具体原因，不能通过隐藏选项掩盖能力差异。
- **D-04:** 多项能力不满足时，优先一次展示并确认完整替代方案；同时允许返回设置修改后重试。方案必须列出差异及最终实际规格，不能先部分执行再要求确认。

### 断线与恢复

- **D-05:** 意外掉线后自动重试一段时间，展示重连状态并允许随时取消；连续失败后转为手动重试，说明失败原因。具体间隔、退避和超时由原型测量确定。
- **D-06:** 重连必须重新鉴权。原控制连接重连后，主机控制权空闲则自动恢复对原实例的控制；若被其他连接占用，提示冲突，由用户选择下一步，不自动抢占。恢复使用新租约 epoch，拒绝旧连接的迟到消息；不向观察者自动授予控制。
- **D-07:** 恢复控制不自动恢复上行外设。一次列出掉线前开启的麦克风/摄像头，由用户确认恢复或继续关闭；恢复仍需权限有效、设备可用。原路由和旧媒体缓冲按既有租约边界清空。
- **D-08:** 单条视频流故障只恢复该流，正常的控制、音频及其他视频流继续运行。故障流展示状态并有界自动重试；需要降低规格时重新让用户选择。连接整体失效按 D-05 处理，不能把全连接故障伪装成单流故障。

### 多流预算与优先级

- **D-09:** 提供两种可选策略：“优先主操作屏”先保主屏体验，再降低辅助屏规格或减少流数；“优先保留全部屏幕”先均衡降低规格，尽量不减少屏数。策略用于生成方案，实际调整仍遵循 D-02/D-04 的用户确认。
- **D-10:** 首次尚无保存偏好时，默认“优先保留全部屏幕”；用户可切换为“优先主操作屏”。
- **D-11:** 提供桌面/游戏两种视频偏好：桌面优先保留分辨率，再降低帧率；游戏优先保留帧率，再降低分辨率。方案展示各屏实际规格。用户未指定桌面/游戏的初始默认值，不能写成已确认默认。
- **D-12:** 下行桌面与摄像头上行竞争带宽时优先远程操作，先降低摄像头规格，控制和音频保持可用。无法满足可用性时明确拒绝/说明，不能宣称任意资源条件下必定可运行。

### 安全与诊断体验

- **D-13:** 身份或连接保护验证失败必须拒绝，不提供绕过验证入口。解释具体原因并引导处理，区分版本不兼容、身份变化、权限失效等；身份变化需重新核验后进入配对流程，具体配对留在 Phase 7。
- **D-14:** 默认记录运行摘要与异常，包含协商结果、连接/流状态、拒绝原因和必要统计；详细网络追踪由用户临时开启。所有模式禁止记录密钥、凭据、剪切板内容或音视频内容。
- **D-15:** 临时追踪到期或连接断开时自动关闭，显示剩余时间，可提前停止或续时。追踪时长、日志上限及具体脱敏字段由研究/原型确定，不自动跨重连继续追踪。
- **D-16:** 短暂丢包或单流故障在状态中提示，恢复后收起，不打断操作；详细经过入日志。持续失败才显示需要处理的提示，判定阈值由原型验证确定。

### 继承的已确认约束

- GameStream 是协议基础；从 RTSP、UDP/RTP/FEC 与控制/输入通道出发重构，不自行切换为整套 WebRTC/QUIC。开源实现不是 NVIDIA 官方完整规范。局部替换若确有必要，必须给出证据和具体关键决定。
- C++20/C ABI/CMake 已在 Phase 2 确认；原生层承担传输/媒体热路径，Dart 承担界面、设置和会话操作，不逐帧传递视频或 PCM。单仓库、单 Selene、统一产品版本体系沿用。
- Connection 与 Instance 生命周期分离。断连/切换不停止实例、应用或持久显示器组，只有显式 StopInstance 清理其拥有资源；主机全局至多一个有效 ControlLease。
- 已授权观察者仅有读流权限，不输入、不上行、不改剪切板/拓扑/实例；每条读流独立计入预算，观察者请求不能改变其他会话。旧 connection/epoch 的输入、媒体、设置和剪切板必须拒绝。
- 预算包含 GPU 编码并发、上行解码、客户端解码、显存和带宽；不能只降低码率就声称解决编码会话数量超限。方案不得擅自挤占其他连接的已授予资源。
- 控制可靠、媒体实时且有界；不能把全部实时视频装入单个可靠有序流，不自行设计密码算法。多方向/多流密钥和 nonce 边界必须独立核验，不能直接复制历史单流共享状态。
- Windows 10/11 主机硬要求及 Win10 不要求 HDR 的 R1 修订沿用。能力协商必须区分“不支持”“未验证/不可测”及实际支持，不能把占位接口或构建成功写成媒体支持。
- 五客户端实现、目标构建与可运行自动检查保留；Apple 仅实机功能/性能/安装证据延期。源码/构建/模拟流与真实设备/性能证据分别记录。
- 固定参考源码在 references/upstream，属于忽略的研究材料；不直接链接、复制为产品代码或提交子模块。compatible-open-source/retain-candidates 是路线意向，具体生产复用、许可和依赖仍须审核。
- 严禁执行或安排开发机重启/关机。讨论不授权安装驱动、变更 Apollo、信任或安全策略，不解除 Phase 3 当前检查点。
- 研究、计划检查、完成验证和 Git 文档追踪开启，通常 1–3 个小计划；当前交互顺序不自动开始规划或执行全部阶段。

### 研究与规划职责及待验证事项

用户没有新增“你决定”授权；以下属于已有研究/规划职责，不是已选技术或已通过结果：

- 核验固定 Moonlight/Sunshine 基线，逐层/字段记录保留、重构、扩展和移除原因。分析 ENet fork/子模块/ABI、全局状态拆分、生产复用与替代范围，不直接选系统 ENet。
- 定义版本兼容规则和确定性协商、必需/可选能力、共同版本选择、能力原因与结构化错误、替代方案及确认/重试契约；用户只确认共同版本可连接，没有指定 major/minor 规则或字段编码。
- 定义 host/instance/display/stream/connection 身份、租约 epoch、序号、时间戳、格式/方向和独立上下文；限制消息/包大小、解析预算、队列及资源生命周期。
- 研究成熟安全库和通道封装，明确鉴权、密钥生命周期、每方向/流 nonce、防重放及 FEC 与认证的顺序/恢复边界。具体 TLS/DTLS/AEAD、端口、密码库和线格式尚未选定。
- 用模拟身份/授权与模拟媒体验证两条独立视频流、双向路径、独立故障、预算竞争、迟到包、重连和有界丢包恢复；不能宣称完成 Phase 7 配对、Phase 20 生产仲裁或真实设备上行。
- 把已确认交互偏好落到可测协议状态和原型输出，不扩展成完整 UI 阶段；后续真实媒体/动态码率阶段沿用策略，不提前宣称生产自动调整能力。
- 测量重试、恢复、队列和追踪上限，记录协议原型数据的测量范围；不能以模拟结果声明产品端到端性能 SLO 通过。
- 五平台构建路径及 Apple CI 工具链需具体证据，缺环境如实保留；Phase 2 的 Windows 构建和 Android 原生片段不能关闭 Phase 6 五目标要求。


### the agent's Discretion

CONTEXT 没有额外“你决定”授权；上面研究职责原文是裁量边界。下文技术推荐均供原型/ADR和具体人审使用，不是用户已选技术。

### Deferred Ideas (OUT OF SCOPE)

无新增跨阶段能力或 TODO。具体配对/权限 UI、真实捕获编解码/上行设备、生产仲裁、动态与自动码率沿用既有后续阶段。本轮决定为这些阶段提供协议行为约束，不追加其实现到 Phase 6；Apple 实机 TODO 和 Phase 3 原检查点保留。

</user_constraints>

## Summary

本阶段是同一“原生安全协议原型”验收链路：固定基线与真实 tracer → 双向多流/故障 → 五目标构建与运行。推荐三个顺序小计划；不叠加完整配对、真实编解码/设备、生产仲裁或动态码率实现。若任一计划跨入这些子系统，应拆到已有后续阶段，不能为压缩计划数堆大计划。[依据：06-CONTEXT Phase Boundary；ROADMAP Phase6]

优先原型建议为 **TLS1.3可靠控制 + UDP/RTP/FEC + 标准SRTP AEAD媒体**。它只局部替换历史控制传输/媒体保护，必须保留并解释GameStream协商、输入/反馈、实时媒体和FEC语义映射；首计划提供具体ADR人审后才锁。成熟DTLS1.2可作为媒体封装备选，固定ENet可作为历史控制对照或经审阅保留。端口、wire编码、major/minor规则、库和阈值均未选定。[CITED: https://docs.openssl.org/3.5/man3/SSL_CTX_set_min_proto_version/ ; https://github.com/cisco/libsrtp/blob/main/README.md；依据：CONTEXT研究职责]

固定common-c的连接/音频/视频/控制大量是全局状态，不能重复调用旧API实现多流。模拟结果不能证明完整媒体支持、虚拟设备、生产配对或端到端SLO。五目标真实native build和可运行自动检查是完成门槛；Apple仅物理验收TODO。[VERIFIED: references/upstream/moonlight-common-c/src/Connection.c:9-38；.planning/ROADMAP.md:162-170]

## Project Constraints (from AGENTS.md)

本轮完整读取AGENTS，以下必须进入计划检查：

- 先STATE和当前相关文档；通过GSD工作流写仓库。本次仅计划研究，Phase3具体安装检查点保留。
- 单Monorepo/统一版本/单Selene Flutter；Dart管UI设置会话，native管媒体热路径与系统，不逐帧传递视频/PCM。
- GameStream固定源码基础；不整体替换WebRTC/QUIC；reference checkout研究用途，不链接/复制为产品或提交子模块。
- Windows10/11硬要求，最低build不得从上游推定；R1 Win10 SDR、Win11 HDR目标。
- 原功能全部保留；发现遗漏默认v1；候选、约束、构建、模拟、实际能力证据分别记录。
- Connection/Instance/DisplayGroup分离，断连切换保活，显式stop仅清理自身；主机ControlLease唯一；观察者只读。
- 编码会话/解码/显存/带宽事前预算，拒绝可解释，不侵占既有grant。
- 五端实现/构建保留，Apple只有实机功能/性能/安装TODO；构建不可豁免。
- 交互顺序、小阶段通常1–3计划、源码研究/计划检查/完成验证/Git追踪开启，关键决定确认；不自动实现全部阶段/擅自并行。
- 严禁执行或安排开发机重启/关机；不操作Apollo、驱动、信任或安全策略。
- 按ARCHITECTURE/SESSION-MODEL与已形成的C ABI所有权/ACK/stop模式；简洁终端摘要、详细文件日志，自动化失败非零且不等按键。[VERIFIED: AGENTS.md；02-CONTEXT.md:26-68]

<phase_requirements>
## Phase Requirements

| ID | Description（原文） | Research Support |
|---|---|---|
| NET-01 | 双端使用基于 NVIDIA GameStream 重构扩展的协议，协商 Aether 版本与能力，使用 instance/display/stream ID、租约 epoch 和明确错误码。 | 基线映射、身份/epoch、协商与确认、实际双端tracer |
| NET-02 | 维护者能查阅 GameStream 基线与扩展映射、通道/安全重构 ADR，以及双向媒体、多流、丢包原型和五平台目标构建/可运行的自动化证据；Apple 实机验证另列 TODO。 | 固定源码、FEC顺序、两video及模拟上行、目标证据 |
| NET-03 | 连接具有标准安全机制保护的可靠控制与实时媒体通道，错误版本/超限消息被拒绝。 | 标准保护库、认证后状态更新、重放/长度/队列负例 |
</phase_requirements>

[VERIFIED: .planning/REQUIREMENTS.md GameStream小节；ROADMAP:162-184]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| 版本/能力/proposal/confirm | Shared native protocol | Dart/CLI低频展示 | 双端一致判定，明确差异和确认 |
| 权限、lease epoch、预算 | Helios coordinator authority interface | client能力输入 | 主机判断；本阶段test-only模拟authority |
| socket/密码/RTP/FEC/时钟/queue | Shared native per-stream context | 薄OS适配 | 热路径不穿Dart |
| 恢复/错误/trace倒计时 | native state + summary logger | Dart/CLI事件 | 原型交互输出可测，完整UI留后续 |
| 持久Instance/display | 后续instance owner | test identity fixture | 网络关闭仅释放连接消费资源 |
| 五端target证据 | Build/CI | target native harness | Windows设备模块不进跨平台合同根 |

这是基于已确认ARCHITECTURE与SESSION-MODEL的规划建议，不是已实现声明。[依据：canonical architecture/session docs]

## Standard Stack

| Component | Verified version / purpose | Status |
|---|---|---|
| C++20 / C ABI | 原文 `target_compile_features(aether_core PRIVATE cxx_std_20)`；本地文档 `# Local core ABI 1` | 已确认；网络wire version另定义。[VERIFIED: CMakeLists.txt:12-17；docs/NATIVE-CONTRACT.md:1-12] |
| CMake / CTest | 根原文 `cmake_minimum_required(VERSION 3.31)`；本轮CMake4.4.3 | 延续native检查。[VERIFIED: CMakeLists.txt:1,34-40；cmake --version] |
| Node built-in tests | 本轮v24.14.0；既有 `require('node:test')` | process harness/证据，不新增Jest。[VERIFIED: tests/core-tracer.test.cjs:1-8；node --version] |
| Flutter/Dart/ffigen | 原文 `"version": "3.44.0"`、`"dart": "3.12.0"`、`"name": "ffigen"`/`"version": "21.0.0"` | 沿锁，低频网络事件；不为协议升级框架。[VERIFIED: toolchains.lock.json:8-18,31-33] |
| OpenSSL candidate | 官方3.5.9 LTS，2026-09-29；本机PATH命令3.6.1不能当产品库 | TLS/exporter/AEAD；待固定源码/target/ADR准入。[CITED: https://openssl-library.org/source/ ; https://github.com/openssl/openssl/releases/tag/openssl-3.5.9] |
| libSRTP candidate | 官方v2.8.0；release API published_at=2026-03-14T09:59:22Z | 标准RTP保护/replay/ROC；待固定源/配置/target审核。[CITED: https://github.com/cisco/libsrtp/releases/tag/v2.8.0] |
| ENet candidate | gitlink `aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1` | 指定fork，不能换系统lib。[VERIFIED: git ls-tree common-c HEAD enet；README:9] |
| nanors candidate | gitlink `b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a` | RS FEC；OBL依赖与逐文件审计待补。[VERIFIED: git ls-tree common-c HEAD nanors；CMakeLists:19-23] |

**Installation:** 本轮不安装包。native库不经同名npm/pip/cargo包验证；执行前单独锁official tag/SHA、archive摘要、LICENSE/NOTICE、构建参数和每目标产物。OpenSSL官方archive metadata摘要为 `sha256:603f5602e2eef00d77fbd429d34dcd5822bb301757a1bc9cdb24c670f1eb859a`，本轮没有下载该archive验真。[CITED: https://api.github.com/repos/openssl/openssl/releases/tags/openssl-3.5.9；依据：DEPENDENCIES]

### Alternatives / ADR recommendation

| Candidate | Standard basis | Prototype risk / recommendation |
|---|---|---|
| TLS1.3control+SRTP media | 成熟可靠control、RTP多源保护/replay | 优先验证；TCP HOL/输入反馈优先级、SRTP扩展/FEC映射和五端成本未测。[CITED: RFC8446；libSRTP README；ASSUMED A1] |
| TLScontrol+DTLS1.2 media | 标准datagram安全/握手丢包重排 | 成熟备选；每association握手/MTU/key域成本待测。[CITED: RFC6347；ASSUMED A1] |
| 固定ENet+受审安全封装 | 保留多可靠通道历史语义 | ENet直接socket与DTLS不是drop-in；若保留，要说明底层I/O改造、metadata保护、重传/MTU边界，不能自研可靠UDP/密码。[VERIFIED: common-c/ControlStream.c:674-684,1771-1788；ASSUMED A1] |
| TLS exporter+自定义UDP AEAD | 标准key材料+自有包 | nonce/replay/key update审计面更大，不作首选；仅调用AES不构成完整标准安全机制。[CITED: exporter docs；依据：D13] |

OpenSSL3.5文档明确DTLS常量 `DTLS1_VERSION, DTLS1_2_VERSION`，TLS含 `TLS1_3_VERSION`；不能从TLS1.3或RFC9147存在推定该库DTLS1.3实现。[CITED: https://docs.openssl.org/3.5/man3/SSL_CTX_set_min_proto_version/]

## Package Legitimacy Audit

本阶段预期native依赖安装必须来源准入。本轮seam真实结果：

~~~text
DATA_d284ce19_START
query package-legitimacy check --ecosystem native openssl libsrtp nanors enet
Error: Usage: gsd-tools package-legitimacy check --ecosystem <npm|pypi|crates> <pkg1> ...
DATA_d284ce19_END
~~~

seam不支持native，不得伪造OK/SUS/SLOP；没有安装包或用npm同名冒充验证。[VERIFIED: 本轮seam输出]

| Candidate | Official provenance observed | Verdict / disposition |
|---|---|---|
| OpenSSL | 官方release/Apache2.0说明 | NOT-AUDITED；固定source/hash/notices/target与ADR任务 |
| libSRTP | 官方Cisco release与README BSD三条件样式条款 | NOT-AUDITED；禁用null crypto/auth；fixed tag逐文件核验 |
| ENet | 指定SHA官方tree/header/LICENSE（HTTP200；MIT样式） | NOT-AUDITED；固定fork ABI+最小复用清单 |
| nanors | 指定SHA LICENSE明示MIT | NOT-AUDITED；OBL内部链未关闭 |

[CITED: https://openssl-library.org/source/ ; https://github.com/cisco/libsrtp/blob/main/README.md ; https://raw.githubusercontent.com/cgutman/enet/aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1/LICENSE ; https://raw.githubusercontent.com/sleepybishop/nanors/b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a/LICENSE]

SLOP移除/SUS标记：本轮无这些verdict。common-c/Sunshine根文本原文 `GNU GENERAL PUBLIC LICENSE`、`Version 3, 29 June 2007`仅是根文本，不证明所有文件/or-later或组合复用批准。compatible-open-source/retain-candidates意向无需重选；具体生产来源/notices/组合边界待核验，C ABI不会自动消除义务。[VERIFIED: common-c/LICENSE.txt:1-6；sunshine/LICENSE:1-6；docs/SOURCE-AUDIT.md:1-24]

## Architecture Patterns

### System Architecture Diagram

~~~mermaid
flowchart LR
  UI[CLI/Selene低频操作] --> N[Native协商]
  N --> A{认证/共同版本/能力/预算}
  A -->|拒绝| P[完整proposal/原因]
  P -->|用户confirm+复查| A
  A -->|成功| C[Connection secure control]
  C --> S[独立video1/video2/audio/模拟上行]
  S --> F[FEC source+repair + 标准媒体保护]
  F --> T[UDP socket/有限丢包relay]
  T --> V{认证/replay/identity+epoch}
  V -->|通过| Q[Per-stream有限queue/reassembly]
  V -->|失败| D[Drop+脱敏计数]
  Q --> O[Native synthetic sink/digest]
  C --> H[Test-only authority/持久身份fixture]
  H --> K[断连只释放connection资源]
~~~

建议图，保护方案待ADR，不是已选技术。[依据：06-CONTEXT；RFC6363]

### Fixed baseline / field-channel map

本轮HEAD与锁逐一一致，原文SHA：common-c `f900dd4767759c7b9d0e93bcea666b55c69ea62f`，Sunshine `7c23c32925d26c3ee7c33b25b2b0db75e35d561b`，Qt `de2467e433821664cdd2224aad8c89a625be1ad9`，Android `b48494cb96bff23d8886c4775cc4f39a1075495d`，iOS `02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a`。[VERIFIED: references/upstream-lock.json:16-64；git rev-parse HEAD]

Sunshine嵌入common-c gitlink也是f900dd；ENet/nanors gitlink如上。锁原文 `"submodulesInitialized": false`；本轮git submodule status因Git sh Win32 error5失败，未当“无缺口”；未初始化或编辑checkout。[VERIFIED: lock:27-34；git ls-tree HEAD/submodule command]

| Layer | 原文定义/源码 | Mapping recommendation |
|---|---|---|
| launch管理 | `get_arg(args, "rikey")`→`launch_session->gcm_key`；`uniqueid`、`appid`、`mode`。[VERIFIED: sunshine/src/nvhttp.cpp:476-506] | 重构认证session/key建立及instance/display；不把key当identity；生产pairing后续 |
| RTSP/SDP | 方法 `DESCRIBE`/`SETUP`/`PLAY`/`ANNOUNCE`；`streamid=video/0/0`；`X-SS-Ping-Payload`、`X-SS-Connect-Data`。[VERIFIED: common-c/src/RtspConnection.c:550-655,1190-1325] | 保留协商/setup/start语义，重构encoding；新增完整提案confirm/多流；不要求旧fallback/端口 |
| capability | `x-ss-general.featureFlags`、`x-ss-general.encryptionSupported`、`x-ss-general.encryptionRequested`、`x-ml-general.featureFlags`、`x-ss-general.encryptionEnabled`。[VERIFIED: common-c/src/RtspConnection.c:1138-1156；src/SdpGenerator.c:270-304] | 必需/可选、实际支持/不支持/未验证、原因/参数域，缺字段不默认安全可选 |
| RTP | `uint8_t header; uint8_t packetType; uint16_t sequenceNumber; uint32_t timestamp; uint32_t ssrc;`。[VERIFIED: common-c/src/Video.h:42-48] | 保留RTP基础，明确clock/字节序/SSRC到stream映射；16bit seq不足以单独防重放 |
| video/FEC | `streamPacketIndex`、`frameIndex`、`flags`、`extraFlags`、`multiFecFlags`、`multiFecBlocks`、`fecInfo`。[VERIFIED: common-c/src/Video.h:27-35] | 保留frame/分片/repair语义；重构长度/layout/每流认证归属；不用native packed cast |
| crypto video | `uint8_t iv[12]; uint32_t frameNumber; uint8_t tag[16];`。[VERIFIED: common-c/src/Video.h:15-19] | 标准envelope替代；外部frame字段认证前不能改state |
| control | `unsigned short type; unsigned short payloadLength;`；`encryptedHeaderType`、`length`、`seq`。[VERIFIED: common-c/src/ControlStream.c:11-32] | bounded framing/request/ACK、connection/epoch/scope/error；旧ptype不必兼容 |
| input header | `uint32_t size; // ... Big Endian`、`uint32_t magic; // ... Little Endian`。[VERIFIED: common-c/src/Input.h:11-14] | 统一显式byte order，保留全部键鼠/手柄/触摸/笔/UTF8/反馈语义 |
| input channels | `CTRL_CHANNEL_GENERIC 0x00`、`CTRL_CHANNEL_URGENT 0x01`、`CTRL_CHANNEL_KEYBOARD 0x02`、`CTRL_CHANNEL_MOUSE 0x03`、`CTRL_CHANNEL_PEN 0x04`、`CTRL_CHANNEL_TOUCH 0x05`、`CTRL_CHANNEL_UTF8 0x06`、`CTRL_CHANNEL_GAMEPAD_BASE 0x10`、`CTRL_CHANNEL_SENSOR_BASE 0x20`、`CTRL_CHANNEL_COUNT 0x30`。[VERIFIED: common-c/src/Limelight-internal.h:56-66] | 功能/优先级保留，域与调度重构；边沿可靠/位移合并规则明确，本阶段不真实输入 |
| audio | `ALGORITHM_AES_CBC`，IV基于`BE32(avRiKeyId + rtp->sequenceNumber)`，key来自`StreamConfig.remoteInputAesKey`。[VERIFIED: common-c/src/AudioStream.c:178-197] | 保留clock/packet/PLC/多声道，替换保护；双向密钥域独立 |

以上`common-c`均指固定`references/upstream/moonlight-common-c`，`sunshine`指固定`references/upstream/sunshine`。这是明确来源锚点缩写，不是新product路径。首计划交付完整逐字段清单：SHA+file+line、byte order/limit、保留/重构/扩展/移除及原因、Aether字段、parity case、向量、后续owner；本表不宣称穷尽所有历史版本。[依据：PROTOCOL；NET02]

ENet README明确 `breaking API/ABI changes`，IPv6/重传理由；固定fork实际header含 `struct sockaddr_storage address;`与`enet_host_create (int, const ENetAddress *, size_t, size_t, enet_uint32, enet_uint32)`；common-c直接访问`peer->sentReliableCommands`。固定header+library不可拆换。[VERIFIED: common-c/README.md:9；src/ControlStream.c:674-684；CITED: https://raw.githubusercontent.com/cgutman/enet/aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1/include/enet/enet.h]

### Independent contexts / parser / security boundary

以下名字/目录是PROPOSED，不是已有API：HostAuthority（test-only认证/权限/预算入口）、ConnectionContext（secure peer/session、控制queue、stop barrier）、StreamContext（direction/media/config、key域、SSRC/seq/FEC/queue/恢复）、InstanceIdentity fixture（稳定identity）、Transport adapter（薄socket/标准保护）、Native event bridge（标量状态/错误/统计）。不复制静态callback/queue/key单例。[依据：ARCHITECTURE；NET01/02]

全局定义原文 `STREAM_CONFIGURATION StreamConfig;`、`ListenerCallbacks`、`ControlPortNumber`/`AudioPortNumber`/`VideoPortNumber`；`static RTP_VIDEO_QUEUE rtpQueue;`、`static PPLT_CRYPTO_CONTEXT decryptionCtx;`、`static ENetHost* client;`、`static ENetPeer* peer;`、`static uint32_t currentEnetSequenceNumber;`。[VERIFIED: common-c/src/Connection.c:9-38；src/VideoStream.c:8-17；src/ControlStream.c:90-123]

分开持久host/instance/display、配对client、临时connection、stream、lease epoch、stream config generation与key generation。控制epoch不是所有observer read-stream的epoch；撤controller不能停仍授权observer。stream同ID恢复也必须新crypto state。媒体type/direction/sequence/time/config/frame/fragment/FEC身份认证后一致性判断。[依据：SESSION-MODEL；D06/08/13]

parser在分配/授权前检查消息、字符串/数组、递归、整数/枚举、字段重复、未知必需字段、尾随/截断、frame/shard/block预算；可选未知字段跳过规则明确。control body/datagram/frame/queue bytes+time/replay window/proposals均显式上限，数值待测。fixed bytes头+length-delimited扩展是优先原型，不擅自锁major/minor。产品version、本地ABI与wire version不同；错误码不能直接拷贝ABI枚举。[依据：NET03；研究职责；NATIVE-CONTRACT]

stop禁止admission、取消并join生产者、drain标量/ACK、释放安全state；失败保留callback必要引用；按connection/stream独立所有权清理，不调用StopInstance。test key/authority/fault输入仅独立test target，产品无逃生flag；不导入system trust或操作外来service。[依据：core.h:45-55；CMakeLists.txt:32-33；AGENTS]

### FEC / authentication / keys

固定Sunshine先`auto shards = fec::encode(...)`，后`session->video.cipher->encrypt(...)`逐shard；common-c接收先`PltDecryptMessage(... ALGORITHM_AES_GCM ...)`后`RtpvAddPacket(...)`。固定路径是FEC→每source/repair AEAD→网络→认证→FEC，不泛化所有GameStream版本。[VERIFIED: sunshine/src/stream.cpp:1701-1766；common-c/src/VideoStream.c:184-230]

优先保留该顺序的原型语义，标准媒体保护包裹每data/repair datagram，认证所有FEC参数/身份/长度。认证失败当erasure，认证前不更新replay high-water/queue/epoch；仅同connection/key/config/stream/block的已认证shards修复。恢复plaintext是受认证shards的计算结果，不声称自带丢失包原AEAD tag，仍做结构/frame digest校验。不跨权限流FEC。ciphertext-first FEC备选必须保护repair/参数，并定义恢复ciphertext后再验source tag。[CITED: https://www.rfc-editor.org/rfc/rfc6363.html §9.2.2–9.4]

首计划输出key-domain表：handshake connection、direction、media/repair role、stream、key generation。exporter context是双端同一canonical已确认契约，persistent ID不能当key；fresh auth后新key，rekey/counter exhaustion拒绝必须测。重新发送相同nonce只允许相同受保护字节，payload变更新packet index。副作用请求不开0RTT。AEAD final失败的所有提前plaintext禁止使用。[CITED: https://docs.openssl.org/3.5/man3/SSL_export_keying_material/ ; https://docs.openssl.org/3.5/man3/EVP_EncryptInit/ ; RFC7714 §13；RFC8446 §8]

### D-01–16 mapping and original parity

| Decision | Measurable contract / negative evidence |
|---|---|
| D01 | 显式version集合共同选择确定性；无交集说明待升级端，无grant；顺序扰动不改变结果 |
| D02/03/04 | 全proposal含所有差异/每屏最终规格/禁用理由；confirm绑定request+proposal digest+budget revision+身份/epoch；commit复查，stale/replayed/cancelled不改existing资源 |
| D05 | bounded retry状态/可随时cancel/失败转manual；interval/backoff/window实测；auth failure不盲重试 |
| D06 | fresh authentication，新connection/lease epoch；空闲原controller可恢复，occupied冲突不抢；observer不升级；旧input/settings/clipboard/media到达但reject；identity不变 |
| D07 | control恢复不启动mic/camera；一次恢复集合confirm后权限/device再查；旧route/buffer清空；只用synthetic sink |
| D08 | stream1 bounded retry不影响stream2/control/audio；whole secure session失效不能伪装single stream；健康计数在故障窗口持续推进 |
| D09/10 | two policy方案生成；first-use默认保全部屏；不挤占existing grant；调整需confirm |
| D11 | 桌面先resolution、游戏先fps；无已确认first-use默认，输入显式偏好或待选择，不自行设默认 |
| D12 | 操作优先，camera先生成降规格方案；control/audio reserve；最低可用性也不足则拒绝 |
| D13 | version/auth/identity/permission/replay/size/resource原因分开；无verify-off；identity-change导向Phase7核验 |
| D14/15 | summary默认、trace显式start/remaining/stop/extend，monotonic expiry/byte cap/disconnect关闭；secret/content sentinel零泄漏，不跨重连 |
| D16 | transient提示恢复后收起，持续failure才action-required，阈值实测，不sticky打断 |

[依据：06-CONTEXT D01–16；不新增字段enum数值/默认]

预算是向量：host编码会话/上行解码、client解码、显存/像素率/带宽分开；降低码率不能解决encoder session数量。预检+reservation/expiry+confirm原子commit，预算变更重新proposal；不侵占别人资源，失败只release本次reservation。Phase6 capability fixture必须标synthetic，未知实际能力标未验证。[依据：D02/04/09–12]

FEATURE-PARITY直接NET映射原名 `fec_percentage`、`lan_encryption_mode`、`wan_encryption_mode`、`packetsize`、`ping_timeout`、`port`（Win10/Win11各一组）。从完整case数据生成NET相关覆盖，而非只列三需求。旧加密关闭选项与D13/NET03冲突时应具体映射为禁用+理由/安全替代并人审，不能静默删设置或保留绕过。[VERIFIED: docs/FEATURE-PARITY.md:60,78,102,105,107,123及Win11对应行；依据：D03/13]

codec/HDR/444/color、音频多声道、键鼠/手柄/触摸/笔/传感器/反馈、input-only、observer、capture source等适用原能力contract保留extension/理由/后续owner；不在本阶段提前实现设备。Win10明确HDR请求给原因，Win11模拟HDRflag非真实HDR证据。[依据：完整FEATURE-PARITY；R1；PLATFORM-MATRIX]

## Validation Architecture

配置nyquist_validation/security_enforcement均为true；本节是待创建检查，不能记为已通过。[VERIFIED: .planning/config.json workflow]

使用已有Node24 node:test、CMake/CTest；iOS新增XCTest宿主。新文件/targets/labels/目录/命令以下均PROPOSED。Fast目标<30秒需实际计时，非产品SLO。[ASSUMED A2]

需求映射：NET01协商/完整proposal/资源及authority/epoch；NET02真实socket双向两video/FEC/独立恢复/五端运行；NET03版本/长度/认证/nonce/replay/日志拒绝。新增Node文件PROPOSED：protocol-negotiation、budget、authority、tracer、recovery、wire、security、loss、diagnostics.test.cjs；执行 node --test tests/protocol-*.test.cjs（runner需显式展开清单）。

Fast：native构建后运行ctest --test-dir <owned target build> -C Debug -L protocol-fast --output-on-failure --no-tests=error。Full：上述Node套件+Release native suite+五目标jobs+证据checker。每任务fast、每wave full、最终五端真实证据人审；同seed RED/GREEN，无设备mutation。[依据：NET01–03/CONTEXT]

### Wave 0 Gaps

- [ ] 独立native/protocol CMake根与真实native合同/双进程tracer；现根if(NOT AETHER_CORE_ONLY)内链接Windows设备库，不能作五端合同根。[VERIFIED: CMakeLists.txt:19-35]
- [ ] 固定native依赖源/hash/notices、每目标build；官方密码已知答案向量+独立wire golden bytes（不能全用自身encode当oracle）。
- [ ] test-only authority、单调fake clock与有限userspace loss relay；固定seed/丢包位置/乱序/延迟/source+repair计数，无系统网卡变更。
- [ ] 原型限值测量：packet/frame/shard/queue bytes+deadline、retry/trace；fake-clock结果不能作真实性能；每stream digest及send/receive/recovered/drop/auth-failed分母。
- [ ] Android runner、Apple XCTest scheme/SDK/simulator、Linux/macOS/Windows匹配executor；进程超时及仅自有进程清理，零case/skip拒绝。
- [ ] Selene低频FFI实际消费者；新网络接口不能破坏现local ABI所有权/ACK/stop。[依据：NATIVE-CONTRACT]

### Five-target build / run paths

全部为PROPOSED。cmake --build <dir> --config Release；desktop再ctest --test-dir <dir> -C Release -R protocol --output-on-failure --no-tests=error。native/protocol只含协议/薄socket，不含driver。[依据：NET02]

| Target | Configure / runnable evidence |
|---|---|
| Windows | cmake -S native/protocol -B build/phase06/windows-x64 -G "Visual Studio 18 2026" -A x64；ARM64独立-A ARM64目录/runner；真实双进程TLS/UDP+CTest |
| Linux | cmake -S native/protocol -B build/phase06/linux -G Ninja；Linux x64/arm64匹配CI实际CTest；原ARM32/RISC-V差异保留 |
| Android | cmake -S native/protocol -B build/phase06/android-arm64 -DCMAKE_TOOLCHAIN_FILE=<NDK>/build/cmake/android.toolchain.cmake -DANDROID_ABI=arm64-v8a -DANDROID_PLATFORM=android-24；每ABI独立；adb push <native test> /data/local/tmp/aether-phase06/后adb shell执行并保留native exit/count；emulator/device必须存在；API21–23差异不删除 |
| macOS | cmake -S native/protocol -B build/phase06/macos -G Xcode -DCMAKE_OSX_ARCHITECTURES="x86_64;arm64" -DCMAKE_OSX_DEPLOYMENT_TARGET=10.15；Intel/arm64分别CTest+socket，lipo/otool记录target |
| iOS | cmake -S native/protocol -B build/phase06/ios -G Xcode -DCMAKE_SYSTEM_NAME=iOS -DCMAKE_OSX_SYSROOT=iphoneos -DCMAKE_OSX_ARCHITECTURES=arm64 -DCMAKE_OSX_DEPLOYMENT_TARGET=13.0；device library build；独立iphonesimulator目录+XCTest宿主link同库；xcodebuild test -project <ProtocolContract.xcodeproj> -scheme ProtocolContract -destination 'platform=iOS Simulator,id=<observed UUID>' -resultBundlePath <owned path>；不能在macOS直接运行device二进制 |

记录actual SHA/dependency digest/compiler/SDK/arch/command/exit/count/run URL；crosscompile不等于运行。Apple device build+simulator检查必须，物理功能/性能/安装独立TODO。[依据：NET02/D01–16]

## Open Questions / Environment / Sources

- 本轮Node24.14/CMake4.4.3可执行；OpenSSL PATH3.6.1非审阅product库；adb无连接目标；WSL枚举E_ACCESSDENIED不证明无distro。Apple无本机Xcode，远端CI未核验；必须补真实target run，不能用Apple hardware TODO豁免。[VERIFIED: 本轮命令；docs/phase02/PLATFORM-GAPS.md]
- [ASSUMED A1] 候选TLS/SRTP/DTLS/fixed ENet的五端最低OS、HOL/MTU/成本尚未测；首计划真实tracer+官方依赖审计后，具体人审局部替换范围、wire/版本/errors、FEC/key域和旧加密设置映射。重试/queue/trace阈值及桌面/游戏默认未锁。
- 3计划属于同一协议原型验收链：①基线+真实单包安全tracer+ADR关口；②同路径双向多流/预算/恢复；③同产物五端证据/最终人审。任何真实配对、设备、编解码、生产仲裁新增均超范围，应留既有后续阶段。
- 安全控制使用ASVS5实际类别：V2 validation、V6 auth、V7 session、V8 authorization、V11 crypto、V12 communication、V14 data protection/V16 logging；不套旧模板编号，不宣称全标准认证。[CITED: https://cornucopia.owasp.org/taxonomy/asvs-5.0]

官方构建来源：[CMake](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html)、[NDK](https://developer.android.com/ndk/guides/cmake)、[Apple](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/08-automation.html)、[GitHub runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)。安全来源：[RFC7714](https://www.rfc-editor.org/rfc/rfc7714.html)、[RFC6363](https://www.rfc-editor.org/rfc/rfc6363.html)、[RFC8446](https://www.rfc-editor.org/rfc/rfc8446.html)。全部为本轮官方检索。[CITED: 上列URL]

research-plan与官方web检索完成；classify-confidence实际MEDIUM。仅研究，未commit/branch/STATE/product/system变更。动态版本执行前重核。
