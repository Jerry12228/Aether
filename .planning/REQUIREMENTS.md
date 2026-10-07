# Requirements: Aether

**Defined:** 2026-10-07
**Core Value:** 五端低延迟可靠访问 Windows 主机，桌面和游戏并重，切换/断连不破坏运行实例。

状态：v1 需求与路线图已于 2026-10-07 获用户批准；所有产品项尚未实现。Phase 1 正式原功能审计发现的遗漏必须补入，当前条目不能解释为穷尽承诺。

**Apple 验收例外（用户已确认）：** iOS/iPadOS、macOS 功能实现、构建与可运行的自动化检查仍纳入 v1；实机功能、性能和安装/升级验收列为 VFY-01/VFY-02 TODO，不阻塞 v1。MAC/IOS 条目的 v1 完成证据仅覆盖实现与上述检查，必须另外标记“未经实机验证”；不能用模拟器或构建成功证明真实硬件能力。

## v1 Requirements

### 来源、原功能与环境基线

- [x] **BASE-01**: 维护者能查阅指定平台原功能逐项清单，每项有源码或设置锚点、需求与验收映射。
- [x] **BASE-02**: 维护者能复现固定 SHA 参考源码，并查阅逐文件来源、生产复用许可与各端分发审计结论。
- [x] **BASE-03**: 维护者能运行环境探测，得到缺失依赖、最低 OS/架构、测试机器与性能测量方案。

### Monorepo 与 Flutter/原生骨架

- [ ] **CORE-01**: 维护者能从主仓库入口构建 Helios 和唯一 Selene Flutter 应用，共享模块和版本来源。
- [ ] **CORE-02**: Selene 能通过有所有权/线程/取消契约的 C ABI 获取原生事件和能力，不传递逐帧媒体到 Dart。
- [ ] **CORE-03**: 维护者能运行共享契约检查及 Windows 构建 CI，查看五平台 adapter 的统一接口。

### 虚拟显示器可行性

- [ ] **VDP-01**: 用户能在 Win10/11 原型中创建两个独立标识的虚拟显示器组并观察不同内容。
- [ ] **VDP-02**: 维护者能验证 provider 的稳定 ID、操作接口、签名/再分发路径与失败恢复。

### 系统虚拟麦克风可行性

- [ ] **MIC-01**: Win10/11 普通录音软件能选择虚拟麦克风并收到原型注入的可识别音频。
- [ ] **MIC-02**: 维护者能查阅虚拟麦克风的数据注入、采样格式、签名与更新分发方案。

### Win10/11 系统摄像头可行性

- [ ] **CAM-01**: Win10/11 普通摄像头软件能选择原型虚拟摄像头并显示注入的测试画面。
- [ ] **CAM-02**: 维护者能复现 Win10 与 Win11 接入及安装/移除路径，并查看 MF/DirectShow 消费兼容证据。

### GameStream 协议重构与扩展

- [ ] **NET-01**: 双端使用基于 NVIDIA GameStream 重构扩展的协议，协商 Aether 版本与能力，使用 instance/display/stream ID、租约 epoch 和明确错误码。
- [ ] **NET-02**: 维护者能查阅 GameStream 基线与扩展映射、通道/安全重构 ADR，以及双向媒体、多流、丢包原型和五平台目标构建/可运行的自动化证据；Apple 实机验证另列 TODO。
- [ ] **NET-03**: 连接具有标准安全机制保护的可靠控制与实时媒体通道，错误版本/超限消息被拒绝。

### 配对、发现与设备权限

- [ ] **AUTH-01**: 用户能发现 LAN 主机或手工输入地址，完成有本地确认的配对并持久保存身份。
- [ ] **AUTH-02**: 主机用户能授予/撤销控制、启动、停止、剪切板及上行设备权限，未授权请求被拒绝。
- [ ] **AUTH-03**: 用户能验证重连使用已配对身份，撤销身份后旧连接与凭据失效。

### 持久实例登记与应用生命周期

- [ ] **INST-01**: 用户能创建多个独立 instance_id 的应用会话，配置和进程关联分别保留。
- [ ] **INST-02**: 用户断开全部连接后，未显式停止的实例及其应用继续运行。
- [ ] **INST-03**: 用户能幂等停止指定实例，只清理其拥有资源，其他实例保持运行。

### Windows 捕获与 H.264 基础流

- [ ] **VIDEO-01**: 用户能选择物理显示器或桌面捕获来源，以 H.264 SDR 单流输出实际画面。
- [ ] **VIDEO-02**: 基础软编码路径可供无支持硬编码器的设备使用，捕获失效提供错误与恢复。

### Selene Windows 原生播放闭环

- [ ] **WIN-01**: Windows 用户能在 Selene 连接实例并观看实时视频，选择窗口或全屏及缩放。
- [ ] **WIN-02**: 视频使用原生硬解/软解与帧调度，用户能看到实际延迟、掉帧和 codec 信息。

### 桌面和游戏键鼠输入

- [ ] **INPUT-01**: 用户能切换桌面绝对鼠标与游戏相对鼠标/指针捕获，并正确映射坐标。
- [ ] **INPUT-02**: 用户能发送键盘组合与系统快捷键，失焦或断连时释放按下状态。

### 下行系统音频

- [ ] **AUDIO-01**: 用户能收听主机立体声以及条件允许的 5.1/7.1 音频，并控制音量/静音。
- [ ] **AUDIO-02**: 用户能选择主机音频设备与本地播放策略，设备变化后恢复且音画同步。

### Windows 三厂商硬编码

- [ ] **ENC-01**: 支持的 NVIDIA 主机能使用硬编码输出并报告真实设备/能力。
- [ ] **ENC-02**: 支持的 AMD 主机能使用硬编码输出并报告真实设备/能力。
- [ ] **ENC-03**: 支持的 Intel 主机能使用硬编码输出并报告真实设备/能力。

### HEVC/AV1 与编解码能力协商

- [ ] **CODEC-01**: 用户能在双端支持时使用 HEVC，并在不支持时得到明确协商回退。
- [ ] **CODEC-02**: 用户能在双端支持时使用 AV1，并查看实际编码/解码路径。

### HDR、4:4:4 与色彩呈现

- [ ] **COLOR-01**: 支持的主机/显示器/客户端能传输并正确呈现 HDR/10-bit 与色彩元数据。
- [ ] **COLOR-02**: 支持的双端能使用 YUV 4:4:4，桌面文字和色彩内容正确，条件不足时明确说明。

### 游戏手柄、触摸与高级输入

- [ ] **GAME-01**: 用户能使用原功能基线数量范围的多手柄、震动及支持的运动/触摸板/HID 扩展。
- [ ] **GAME-02**: 用户能使用原基线多点触控、相对/绝对触摸及硬件允许的笔输入。

### 实例显示器组生产生命周期

- [ ] **DISPLAY-01**: 用户能为每个实例创建独立稳定显示器组，按所选尺寸/刷新率使用。
- [ ] **DISPLAY-02**: 用户断连或切换后显示器组保留，重连身份不变，显式停实例仅移除本组。
- [ ] **DISPLAY-03**: 用户能在可用范围调整拓扑并在创建失败时回滚，保留物理捕获选择。

### Helios 多显示器与多流资源预算

- [ ] **MULTI-01**: 客户端能向同一实例请求多个显示器，服务端建立对应虚拟屏与独立 stream_id。
- [ ] **MULTI-02**: 服务端在编码/显存/带宽预算内启动多流，超限给出可解释拒绝或供用户选择的降级。

### Selene 多显示器呈现与映射

- [ ] **MULTI-03**: 用户能选择请求的流数和布局，将至少两条独立流映射到多个本地显示器/窗口。
- [ ] **MULTI-04**: 用户热插拔本地显示器后能调整映射，输入坐标/缩放/窗口焦点保持正确。

### 主机控制权仲裁与无停止切换

- [ ] **LEASE-01**: 主机保持 0–1 个实例拥有控制权，同时多个实例与显示器组持续运行。
- [ ] **LEASE-02**: 用户切换实例时原实例继续运行，新实例获得控制权；准备失败不会产生双持有。
- [ ] **LEASE-03**: 迟到输入/媒体/设置包在切换或断连后被 epoch 拒绝，断开所有客户端不停止实例。

### 真实客户端麦克风上行

- [ ] **MIC-03**: 用户授权后能选择客户端麦克风，实时传至 Helios 虚拟麦克风供普通软件录音/通话。
- [ ] **MIC-04**: 用户能静音/撤权/切换设备，切换实例后旧路由清空，音频时钟和抖动受控。

### 真实客户端摄像头上行

- [ ] **CAM-03**: 用户授权后能选择客户端摄像头，视频上行至 Helios 系统摄像头供普通软件使用。
- [ ] **CAM-04**: 用户能调整支持的视频规格/方向并关闭或撤权，断连/切换后旧画面队列清空。

### 连接内手动码率修改

- [ ] **RATE-01**: 用户能在连接过程中设置单流目标或会话总码率预算，收到实际生效值与版本 ACK。
- [ ] **RATE-02**: 修改码率保持连接/实例/输入/音频会话不变，后端重配失败返回明确状态。

### 可选自动码率与多流分配

- [ ] **RATE-03**: 用户能启用/关闭自动码率并设置上下限，系统依据丢包/RTT/排队/解码反馈调整。
- [ ] **RATE-04**: 多流按总预算与优先级分配码率，用户可查看原因和实际结果，避免持续振荡。

### 文本剪切板同步

- [ ] **CLIP-01**: 用户能开关双向 Unicode 文本剪切板同步并正常粘贴。
- [ ] **CLIP-02**: 并发更新不产生回环，超大内容受限，断连/切换不把旧实例内容投递给新实例。

### 富文本与图片剪切板

- [ ] **CLIP-03**: 支持的平台能双向同步 HTML/图片等协商格式，不支持的格式给出明确说明。
- [ ] **CLIP-04**: 剪切板格式/大小/解析受限且不自动执行内容，文件复制明确提示文件传输尚为 TODO。

### 应用管理与 Helios 管理入口

- [ ] **ADMIN-01**: 用户能管理应用/游戏列表、封面、启动/恢复/显式停止及支持的准备/清理命令。
- [ ] **ADMIN-02**: 主机用户能配置设备/编码/权限与实例，导入导出设置并查看日志和错误。
- [ ] **ADMIN-03**: 管理入口具有独立授权和命令执行边界，所有生命周期操作与实例模型一致。

### Android 播放与交互

- [ ] **ANDROID-01**: Android 用户能配对、连接、音视频播放与键鼠/触摸/屏幕手柄/实体手柄交互。
- [ ] **ANDROID-02**: Android 采用原生 MediaCodec/Surface 并正确处理旋转、前后台、音频焦点和解码失败。

### Android 外设、多屏与系统集成

- [ ] **ANDROID-03**: Android 用户能使用麦克风/摄像头上行、码率修改、剪切板和实例切换。
- [ ] **ANDROID-04**: 支持的 Android 设备能外屏/多流呈现并协商 HDR/高级音频等能力，系统限制清楚报告。

### macOS 播放与交互

- [ ] **MAC-01**: macOS 用户能配对、连接、音视频播放与键鼠/控制器交互。
- [ ] **MAC-02**: macOS 使用原生 VideoToolbox/Metal 与音频路径，窗口/全屏、焦点和睡眠恢复正确。

### macOS 外设、多屏与系统集成

- [ ] **MAC-03**: macOS 用户能使用上行麦克风/摄像头、剪切板、动态码率与实例切换。
- [ ] **MAC-04**: macOS 多屏用户能独立呈现多流，支持的 HDR/色彩/音频能力正确协商。

### iOS/iPadOS 播放与交互

- [ ] **IOS-01**: iPhone/iPad 用户能配对、连接、音视频播放与触摸/屏幕手柄/外接输入交互。
- [ ] **IOS-02**: iOS 正确管理音频会话、旋转、安全区与前后台，系统限制显示为明确状态。

### iOS/iPadOS 外设、外屏与系统集成

- [ ] **IOS-03**: iOS/Pad 用户能使用上行麦克风/摄像头、剪切板、动态码率及实例切换。
- [ ] **IOS-04**: 支持外屏的 iPad 能选择多流/外屏呈现，HDR和系统剪切板访问依 OS 条件协商。

### Linux 播放与交互

- [ ] **LINUX-01**: Linux 用户能配对、连接、音视频播放和键鼠/控制器交互。
- [ ] **LINUX-02**: Linux 提供可验证的硬解/软解与音频路径，Wayland/X11差异明确且窗口/全屏可用。

### Linux 外设、多屏与系统集成

- [ ] **LINUX-03**: Linux 用户能使用上行麦克风/摄像头、剪切板、动态码率与实例切换。
- [ ] **LINUX-04**: Linux 多屏用户能呈现多条独立流，热插拔和Wayland/X11系统访问条件被验证。

### 网络、唤醒与诊断

- [ ] **OPS-01**: 用户能使用适用的 IPv4/IPv6、手工互联网直连及原基线 Wake-on-LAN。
- [ ] **OPS-02**: 用户能查看网络/媒体/设备瓶颈统计，连接失败和重连给出可操作原因。

### 原功能全量对照复审

- [ ] **PARITY-01**: 用户能查阅原功能每项在五客户端/Windows服务端的实现、适用条件及证据层级；iOS/macOS 实机结果明确标记 TODO。
- [ ] **PARITY-02**: 所有未保留且适用的原功能都有补齐计划，并完成本版规定的实现/构建/测试检查，不用泛化能力替代具体原功能或冒充 Apple 实机验证。

### 故障恢复与性能收敛

- [ ] **QUALITY-01**: 用户经历丢包/网络切换/睡眠/设备变化/worker故障后能恢复，实例保活规则保持。
- [ ] **QUALITY-02**: Windows/Android/Linux 客户端在确定硬件/网络场景达到经基线确认的延迟、画质、帧时、资源和长时运行门槛；iOS/macOS 保留指标与测量接口，实机测量延后至 VFY TODO。
- [ ] **QUALITY-03**: 异常输入、畸形消息、竞争切换和资源耗尽不破坏权限、租约或有界队列。

### Windows 产品与虚拟设备交付

- [ ] **SHIP-01**: 用户能在 Windows 10/11 安装、升级和卸载 Helios/Selene，设备依赖有明确来源与回滚。
- [ ] **SHIP-02**: Helios 服务/交互会话代理、托盘和自启动工作，配置/实例登记升级兼容且卸载清理正确。

### macOS 与 Linux 桌面客户端交付

- [ ] **SHIP-03**: 维护者能构建 macOS Selene 候选包并核验签名/公证及支持架构/最低系统记录，安装/升级实机验收延后至 VFY-02。
- [ ] **SHIP-04**: 用户能安装/升级 Linux Selene，依赖、桌面入口和包格式覆盖选定发行版。

### Android 与 iOS/Pad 客户端交付

- [ ] **SHIP-05**: 用户能安装/升级 Android Selene，权限、签名和分发渠道符合选定交付方案。
- [ ] **SHIP-06**: 维护者能构建 iOS/iPadOS Selene 候选包，核验 Apple 签名与所选源码/依赖的分发路径；安装/升级实机验收延后至 VFY-01。

### 完整版本端到端验收与文档

- [ ] **RELEASE-01**: 用户可依据文档在 Windows/Android/Linux 完成全部能力闭环；iOS/macOS 交付对应实现、构建产物和操作说明，并列明实机验证 TODO。
- [ ] **RELEASE-02**: 维护者能从主仓库复现正式构建和验证，用户能获取安装、权限、兼容、故障恢复及TODO说明。
- [ ] **RELEASE-03**: 全部 v1 需求有可追溯的本版验收证据且用户确认发布，Apple 实机验证延后状态、未实现 TODO 与能力限制明确。

### Phase 1 发现的原能力补充（v1，待实现）

- [ ] **ORIG-01**: 用户能选择界面语言、应用封面/列表呈现偏好与警告呈现，保留各端可用的无障碍/本地化入口。
- [ ] **ORIG-02**: 用户能通过受鉴权且遵循实例生命周期的命令入口配对、列应用、启动/恢复、断开和显式停止，并配置串流偏好。
- [ ] **ORIG-03**: Android 用户能在系统允许时启用画中画，保留串流与输入权限边界，并在前后台变化时恢复。
- [ ] **ORIG-04**: 用户能配置手柄死区、按钮交换/屏幕布局、手柄鼠标模拟/设备忽略，并使用可用电池、LED、运动、触摸板与分级震动反馈。
- [ ] **ORIG-05**: 用户能选择串流期间保持设备唤醒、游戏活动展示与连接诊断提示，系统或第三方不可用时明确说明。
- [ ] **ORIG-06**: 用户能配置游戏优化与连接/断连准备清理钩子；Aether 钩子不得在普通断连或切换时隐式停止实例/移除显示组。
- [ ] **ORIG-07**: 用户能使用 Apollo 原有纯输入能力，在唯一有效控制租约内注入输入而不消费音视频，保持实例与显示组生命周期。
- [ ] **ORIG-08**: 保留并明确授权原有只读加入已有串流的能力；是否并行观察及其资源/外设权限边界须在实施前按 Phase1 冲突决定，不产生第二控制租约。
- [ ] **ORIG-09**: 用户能配置可用色彩范围与原 HDR/4:4:4 呈现，协商结果和实际输出一致。
- [ ] **ORIG-10**: 用户能配置适用硬编码后端的质量/码控/预设及软件编码参数，无法应用时给出可解释状态。

## v2 Requirements / TODO

- **VPN-01**: Helios/Selene 内置 WireGuard。
- **VPN-02**: Helios/Selene 内置 OpenVPN。
- **VPN-03**: Selene 可配置连接其他 WireGuard。
- **FILE-01**: 双向文件互传。
- **PRINT-01**: 主机打印重定向到客户端 PC/Pad 打印机。
- **HOST-01**: Linux Helios。
- **HOST-02**: macOS Helios。
- **VFY-01**: iOS/iPadOS 客户端实机功能、性能、设备/外屏及安装/升级验证；实现与构建仍在 v1。
- **VFY-02**: macOS 客户端实机功能、性能、多屏/设备及安装/升级验证；实现与构建仍在 v1。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 旧协议互通 | 基于 GameStream 重构扩展，但用户明确不要求旧端兼容 |
| 多用户隔离桌面与多实例同时被控 | 用户明确同Windows登录桌面，最多一个实例被控 |
| 额外客户端OS | 当前目标五平台；原平台特有功能盘点后标记适用性 |

## Acceptance Criteria

逐阶段验收见 ROADMAP.md；已进入实机验收范围的平台上，系统设备必须普通软件消费，多屏必须独立画面，实例必须断连后保活，码率修改必须连接ID不变。Apple 两端的实现检查与实机验收分别记录；实机结果保持 TODO，不能宣称已实测支持。

## Definition of Done

全部 v1 需求实现并完成本版规定的验收：Windows/Android/Linux 及 Windows 服务端保留实机端到端门禁；iOS/macOS 完成实现、目标工具链构建和可运行的自动化检查，实机功能/性能/安装验收作为 VFY-01/VFY-02 TODO 延后。原功能矩阵逐行列明实现与证据层级，构建/安装说明可操作，用户完成关键发布确认。Apple 实机 TODO 不阻塞本版，但无硬件证据不得标记相应能力已实测验证；构建环境缺口不能冒充实机验证例外。

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BASE-01 | Phase 1 | Complete |
| BASE-02 | Phase 1 | Complete |
| BASE-03 | Phase 1 | Complete |
| CORE-01 | Phase 2 | Pending |
| CORE-02 | Phase 2 | Pending |
| CORE-03 | Phase 2 | Pending |
| VDP-01 | Phase 3 | Pending |
| VDP-02 | Phase 3 | Pending |
| MIC-01 | Phase 4 | Pending |
| MIC-02 | Phase 4 | Pending |
| CAM-01 | Phase 5 | Pending |
| CAM-02 | Phase 5 | Pending |
| NET-01 | Phase 6 | Pending |
| NET-02 | Phase 6 | Pending |
| NET-03 | Phase 6 | Pending |
| AUTH-01 | Phase 7 | Pending |
| AUTH-02 | Phase 7 | Pending |
| AUTH-03 | Phase 7 | Pending |
| INST-01 | Phase 8 | Pending |
| INST-02 | Phase 8 | Pending |
| INST-03 | Phase 8 | Pending |
| VIDEO-01 | Phase 9 | Pending |
| VIDEO-02 | Phase 9 | Pending |
| WIN-01 | Phase 10 | Pending |
| WIN-02 | Phase 10 | Pending |
| INPUT-01 | Phase 11 | Pending |
| INPUT-02 | Phase 11 | Pending |
| AUDIO-01 | Phase 12 | Pending |
| AUDIO-02 | Phase 12 | Pending |
| ENC-01 | Phase 13 | Pending |
| ENC-02 | Phase 13 | Pending |
| ENC-03 | Phase 13 | Pending |
| CODEC-01 | Phase 14 | Pending |
| CODEC-02 | Phase 14 | Pending |
| COLOR-01 | Phase 15 | Pending |
| COLOR-02 | Phase 15 | Pending |
| GAME-01 | Phase 16 | Pending |
| GAME-02 | Phase 16 | Pending |
| DISPLAY-01 | Phase 17 | Pending |
| DISPLAY-02 | Phase 17 | Pending |
| DISPLAY-03 | Phase 17 | Pending |
| MULTI-01 | Phase 18 | Pending |
| MULTI-02 | Phase 18 | Pending |
| MULTI-03 | Phase 19 | Pending |
| MULTI-04 | Phase 19 | Pending |
| LEASE-01 | Phase 20 | Pending |
| LEASE-02 | Phase 20 | Pending |
| LEASE-03 | Phase 20 | Pending |
| MIC-03 | Phase 21 | Pending |
| MIC-04 | Phase 21 | Pending |
| CAM-03 | Phase 22 | Pending |
| CAM-04 | Phase 22 | Pending |
| RATE-01 | Phase 23 | Pending |
| RATE-02 | Phase 23 | Pending |
| RATE-03 | Phase 24 | Pending |
| RATE-04 | Phase 24 | Pending |
| CLIP-01 | Phase 25 | Pending |
| CLIP-02 | Phase 25 | Pending |
| CLIP-03 | Phase 26 | Pending |
| CLIP-04 | Phase 26 | Pending |
| ADMIN-01 | Phase 27 | Pending |
| ADMIN-02 | Phase 27 | Pending |
| ADMIN-03 | Phase 27 | Pending |
| ANDROID-01 | Phase 28 | Pending |
| ANDROID-02 | Phase 28 | Pending |
| ANDROID-03 | Phase 29 | Pending |
| ANDROID-04 | Phase 29 | Pending |
| MAC-01 | Phase 30 | Pending |
| MAC-02 | Phase 30 | Pending |
| MAC-03 | Phase 31 | Pending |
| MAC-04 | Phase 31 | Pending |
| IOS-01 | Phase 32 | Pending |
| IOS-02 | Phase 32 | Pending |
| IOS-03 | Phase 33 | Pending |
| IOS-04 | Phase 33 | Pending |
| LINUX-01 | Phase 34 | Pending |
| LINUX-02 | Phase 34 | Pending |
| LINUX-03 | Phase 35 | Pending |
| LINUX-04 | Phase 35 | Pending |
| OPS-01 | Phase 36 | Pending |
| OPS-02 | Phase 36 | Pending |
| PARITY-01 | Phase 37 | Pending |
| PARITY-02 | Phase 37 | Pending |
| QUALITY-01 | Phase 38 | Pending |
| QUALITY-02 | Phase 38 | Pending |
| QUALITY-03 | Phase 38 | Pending |
| SHIP-01 | Phase 39 | Pending |
| SHIP-02 | Phase 39 | Pending |
| SHIP-03 | Phase 40 | Pending |
| SHIP-04 | Phase 40 | Pending |
| SHIP-05 | Phase 41 | Pending |
| SHIP-06 | Phase 41 | Pending |
| RELEASE-01 | Phase 42 | Pending |
| RELEASE-02 | Phase 42 | Pending |
| RELEASE-03 | Phase 42 | Pending |
| ORIG-01 | Phase 27 | Pending |
| ORIG-02 | Phase 27 | Pending |
| ORIG-03 | Phase 29 | Pending |
| ORIG-04 | Phase 16 | Pending |
| ORIG-05 | Phase 36 | Pending |
| ORIG-06 | Phase 27 | Pending |
| ORIG-07 | Phase 20 | Pending |
| ORIG-08 | Phase 20 | Pending |
| ORIG-09 | Phase 15 | Pending |
| ORIG-10 | Phase 13 | Pending |

**Coverage:**
- v1 requirements: 105
- Mapped to exactly one phase: 105
- Unmapped: 0

*Last updated: 2026-10-07 after Phase 1 source feature inventory (ORIG-01–10 added; all product requirements remain Pending)*
