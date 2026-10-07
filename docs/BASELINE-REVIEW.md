# Phase 1 全基线审阅包

日期：2026-10-07T13:45:38.938Z。结构门禁 PASS；人审 confirmed。所有产品实现、目标构建、硬件与性能证据仍未建立。不得将此 PASS 当成生产许可或平台支持结论。

## 已确认的许可与发行意图

- distribution-intent：**retain-candidates**，user / 2026-10-07T07:59:36.360Z。原答复：compatible-open-source；暂不考虑发行。保留 distribution-accounts。
- project-reuse-policy：**compatible-open-source**，user / 2026-10-07T07:59:36.360Z。原答复：compatible-open-source；暂不考虑发行。保留 project-license, external-build-scope, apple-foss-channel。

固定参考 9 个仓库，文件 2964、外部项 1332。全部研究用途；生产复制、链接、再分发清单为空。逐文件/资产/二进制/子模块/驱动许可及十四条发行候选见 [SOURCE-AUDIT](SOURCE-AUDIT.md) 和 [sources.json](baseline/sources.json)；1261 个来源阻碍仍保留，包含未知子模块、二进制对应源码、具体项目 LICENSE、第三方条款、Apple 组合发行、驱动正式签名与账号。责任：首次生产依赖前 Phase 2，驱动 Phase 3–5/17/21/22/38，发行 Phase 38–42。既有意图无需重选，也不授权未知文件。

## 原能力、映射与验收

七个目标范围的 637 个平台原子记录、117 个入口、373 个设置条目、637 个独立计划案例、2209 个已核验固定源码锚点。平台重复能力分别计数；数量不是独特功能数，也不是语义穷尽证明。完整逐行证据/条件/案例见 [FEATURE-PARITY](FEATURE-PARITY.md)、[features.json](baseline/features.json)。105 项 v1 需求唯一主要阶段映射；新增 ORIG-01–10：语言/列表/封面、CLI、Android PiP、控制器细节、活动/诊断、游戏优化和连接钩子、仅输入会话、只读读流、颜色范围/444/HDR、编码器调参。详见 [需求](../.planning/REQUIREMENTS.md)。这些均属 v1，不是已实现或 TODO。

设置声明/持久化/解析证据覆盖不等于每个动态消费分支已实测；后续主要阶段及 Phase 37/42 按独立案例收集运行证据。保留唯一控制租约、GameStream 基础、Flutter/native 边界和切换/断连保活，显式停 B 不影响 A/C。

### 已登记的 4 项冲突及当前处理状态

- **helios-windows10-apollo-read-only**（decided）：Apollo固定源码允许view权限客户端加入已有应用会话；Aether现文档不引入并行观察者，原能力保留规则要求具体决定。选项：推荐：显式只读观察者能力，资源预算独立协商、禁止输入/上行/变更，不增加控制租约；修订：说明具体用户范围与替代方案后重新审阅；不得自动删除或塞TODO。
- **helios-windows11-apollo-read-only**（decided）：Apollo固定源码允许view权限客户端加入已有应用会话；Aether现文档不引入并行观察者，原能力保留规则要求具体决定。选项：推荐：显式只读观察者能力，资源预算独立协商、禁止输入/上行/变更，不增加控制租约；修订：说明具体用户范围与替代方案后重新审阅；不得自动删除或塞TODO。
- **qt-linux-extra-architectures**（decided）：Qt README列出Linux ARM32/ARM64、实验RISC-V及特定板卡；Flutter目标声明和可用原生后端未证明同等构建范围，不能静默丢失这些用户目标。选项：推荐：逐架构保留能力/构建差异并在Phase2/34–35验证，暂不宣称支持；需用户明确范围：若确需额外架构，提出具体适配/工具链验证阶段。
- **android-api21-23-framework-floor**（decided）：固定 Android 原构建 minSdk21；Flutter3.44 官方声明从 API24 开始，不能静默删除原 API21–23 用户范围，也不能宣称 Flutter 已支持。选项：推荐：API24作为框架声明候选，同时API21–23保留v1差异；Phase2/14/28–29验证更低API适配与原生路径，未证明前不宣称支持；修订：具体说明最低范围及可执行适配路线；不能自动删除或转TODO。

经人审确认的路线保留 Apollo 经授权的只读加入能力：观察者禁止输入、设备上行及会话变更，无第二控制租约；每条读流独立协商 GPU/显存/带宽预算，超限解释拒绝。已依据确认修订 SESSION-MODEL 的观察者及断连边界段落，Phase 6/20/37 验证。原 Android API21–23（固定 minSdk21 对照 Flutter API24）及额外 Linux ARM32/RISC-V/板卡能力留在 v1 差异账本，Phase 2 先验证 Flutter/原生适配可行性，Android Phase 14/28–29、Linux Phase 34–35 构建；若需要超过单一子系统的新工作，在 Phase 2 提出具体阶段拆分，不把原能力自动挪入 TODO。

## 实际环境与证据边界

Quick/Deep：Quick；总耗时 1523ms / 25000ms，单项最多 5 秒、每流 64KiB。

| 查询 | 状态 | 版本 | 证据类型 / 诊断 |
|---|---|---|---|
| android-ndk | available | 28.2.13676358 | cached-metadata / 查询/元数据证据，不是构建 |
| android-sdk | available | 36.1.0 | sdk-components / 查询/元数据证据，不是构建 |
| cmake | available | 4.4.3 | executed / 查询/元数据证据，不是构建 |
| dart | available | 3.12.0 | executed / 查询/元数据证据，不是构建 |
| flutter-cache | available | 3.44.0 | cached-metadata / 查询/元数据证据，不是构建 |
| git | available | 2.54.0 | executed / 查询/元数据证据，不是构建 |
| java | available | 17.0.2 | executed / 查询/元数据证据，不是构建 |
| ninja | available | 1.12.0 | executed / 查询/元数据证据，不是构建 |
| node | available | 24.14.0 | executed / 查询/元数据证据，不是构建 |
| powershell | available | 7.6.3 | executed / 查询/元数据证据，不是构建 |
| visual-cpp | available | 18.10.12201.205 | executed / 查询/元数据证据，不是构建 |
| visual-wdk-integration | available | 2026 | installed-integration-files / 查询/元数据证据，不是构建 |
| windows-host | available | 无版本结论 | os-query / 查询/元数据证据，不是构建 |
| windows-sdk | available | 10.0.28000.0 | sdk-components / 查询/元数据证据，不是构建 |
| windows-wdk | available | 10.0.28000.0 | sdk-components / 查询/元数据证据，不是构建 |

原始 OS：ProductName=Windows 10 Enterprise LTSC 2024；DisplayVersion=24H2；CurrentBuild=26100；UBR=9168；独立 CIM Caption=Microsoft Windows 11 企业版 LTSC；OSArchitecture=64-bit；ProcessArchitecture=X64。

- Registry ProductName says Windows 10; independent CIM Caption says Windows 11. Preserve both; this is not a Win10 test machine.

GPU 原字段仅表示设备与驱动被枚举，包含虚拟适配器，不表示硬编/硬解测试：SudoMaker / SudoMaker Virtual Display Adapter / 0.22.37.632；Shanghai Best Oray Information Technology Co., Ltd. / OrayIddDriver Device / 17.50.19.949；NVIDIA / NVIDIA GeForce RTX 5080 / 32.0.15.9579；Advanced Micro Devices, Inc. / AMD Radeon(TM) Graphics / 32.0.13036.4。

## 客户端最低范围候选及四层证据

下表是 Flutter **3.44.0** 的历史声明和原型候选，不套用官网当前 3.47。SDK 升级须重新核对最低范围，不能通过升级静默砍掉原能力。

| 平台 | 框架版本 / OS / 架构 | 最低候选 / 状态 | 原生限制 | 构建 / 实机 / TODO |
|---|---|---|---|---|
| helios-windows10 | native-host / Flutter N/A / not applicable: native host / x64 proposed; native validation pending | Windows 10 / x64 / pending-prototype | Build floor, IddCx/virtual mic/Win10 camera require Phase3–5 prototypes; source APIs are not support evidence. | 0 / 0 / 无 |
| helios-windows11 | native-host / Flutter N/A / not applicable: native host / x64 proposed; native validation pending | Windows 11 / x64 / pending-prototype | MFCreateVirtualCamera requires build22000 for that route only; host floor stays pending Phase3–5. | 0 / 0 / 无 |
| selene-windows | 3.44.0 / Windows 10/11 / x64, arm64 | Windows 10/11 / x64, arm64 / proposed | Native decoder/render/input/capture and Windows ARM64 dependency builds await Phase2/10–16/19/21–22. | 0 / 0 / 无 |
| selene-macos | 3.44.0 / macOS 10.15–26 / x64, arm64 | macOS 10.15 / x64, arm64 / proposed | Framework deployment floor only; native media/Metal/HDR/input and x64+arm64 target builds await Phase2/30–31. | 0 / 0 / VFY-02 |
| selene-ios-ipados | 3.44.0 / iOS 13–26 / arm64 | iOS/iPadOS 13 / arm64 / proposed | Framework floor only; AVSampleBufferDisplayLayer/Metal, controllers, capture and external display await Phase2/32–33. x64 simulator is not shipping hardware. | 0 / 0 / VFY-01 |
| selene-android | 3.44.0 / Android API24–36 / arm32, arm64, x64 | Android API24 (7.0) / arm32, arm64, x64 / proposed | MediaCodec/Surface codec+HDR, camera/audio permissions and lifecycle require Phase14/28–29 target checks. | 0 / 0 / 无 |
| selene-linux | 3.44.0 / Debian10–13; Ubuntu20.04–24.04 LTS / x64, arm64 | Debian10 / Ubuntu20.04 LTS / x64, arm64 / proposed | Wayland/X11, VAAPI/Vulkan/audio/input dependencies await Phase34–35. Qt ARM32/RISC-V and board-specific paths remain v1 differences; Flutter matrix does not prove them. | 0 / 0 / 无 |

版本化官方来源：[官方历史矩阵](https://github.com/flutter/website/commit/a43b0e7d3092b64db4933397aaddaed41f333ba1)。最低 CPU 列是指令集架构，性能级别/内存门槛没有实测，留待 Phase 6/10。Win10/11 主机具体 build **pending-prototype**，Phase 3–5 验证；Win11 MF 摄像头 API 的 build22000 不允许抬高 Win10 下限。Apple 仅硬件验收进入 VFY-01/VFY-02，实现与目标工具链构建仍必须完成。

## 机器台账及后续缺口

| 机器 / 用途 | OS / 架构 | GPU / 驱动 | 可用证据状态 | 责任阶段 |
|---|---|---|---|---|
| android-client / client | Android API24+ / arm32/arm64/x64 | unconfirmed / unconfirmed / unconfirmed | unconfirmed / SDK metadata only; no phone/tablet test | 14, 28, 29 |
| apple-build-executor / build/automation | macOS/Xcode / x64/arm64 | unconfirmed / unconfirmed / unconfirmed | unconfirmed / No macOS executor or CI verified | 2, 30, 31, 32, 33 |
| intel-gpu-target / GPU coverage | Windows 10/11 / x64 | unconfirmed / unconfirmed / unconfirmed | unconfirmed / No Intel GPU verified | 10, 13, 14, 15 |
| ios-hardware / physical client | iOS/iPadOS13+ / arm64 | unconfirmed / unconfirmed / unconfirmed | todo / Approved VFY-01; builds remain mandatory | 32, 33, 42 |
| linux-client / client | Debian10+/Ubuntu20.04+ / x64/arm64; extra architectures pending | unconfirmed / unconfirmed / unconfirmed | unconfirmed / No Linux executor/device query | 34, 35 |
| local-gpu-0 / GPU device enumeration | Microsoft Windows 11 企业版 LTSC / 64-bit | NVIDIA / NVIDIA GeForce RTX 5080 / 32.0.15.9579 | verified / CIM device/driver enumeration only; codec/session/HDR/power tests unperformed | 10, 12, 13 |
| local-gpu-1 / GPU device enumeration | Microsoft Windows 11 企业版 LTSC / 64-bit | Advanced Micro Devices, Inc. / AMD Radeon(TM) Graphics / 32.0.13036.4 | verified / CIM device/driver enumeration only; codec/session/HDR/power tests unperformed | 10, 12, 13 |
| local-windows11 / host/development | Microsoft Windows 11 企业版 LTSC / 64-bit | unconfirmed / unconfirmed / unconfirmed | verified / OS/tool query only; no product runtime validated | 1, 2, 3, 4, 5 |
| mac-hardware / physical client | macOS10.15+ / x64/arm64 | unconfirmed / unconfirmed / unconfirmed | todo / Approved VFY-02; builds remain mandatory | 30, 31, 42 |
| windows-client / client | Windows 10/11 / x64/arm64 | unconfirmed / unconfirmed / unconfirmed | unconfirmed / No separate client E2E or ARM64 device evidence | 10, 11, 12, 15, 16, 19, 21, 22 |
| windows10-target / host | Windows 10 / x64 | unconfirmed / unconfirmed / unconfirmed | unconfirmed / No independent Win10 device queried | 3, 4, 5, 12, 38 |

| 缺口 ID / 组件 | 用途 / 证据 | 状态 / 后续阶段 | 闭合动作 |
|---|---|---|---|
| android-api21-23 / Original Android API21–23 vs Flutter API24 | Preserve original Android deployment difference / Fixed moonlight-android app/build.gradle minSdk21; official Flutter3.44 starts API24 | open / 2, 14, 28, 29 | Keep v1 difference; prototype lower-API Flutter/native viability before confirming support or proposing precise small phase adaptation |
| apple-hardware / Mac/iPhone/iPad | Physical feature/performance/install verification / User-approved absence of Apple physical devices | todo / 30, 31, 32, 33, 42 | Collect VFY-01/VFY-02 later; keep all Apple implementation and build obligations |
| apple-toolchain / macOS/Xcode/Apple SDK or CI | Mandatory Apple implementation/build/automation / Windows host; no accessible Apple build executor verified | open / 2, 30, 31, 32, 33 | Arrange macOS/Xcode target executor or CI; pin supported Xcode/SDK and build both Apple targets |
| client-machines / Windows/Android/Linux target devices and Intel GPU | Client end-to-end and three GPU vendors / No client test or Intel device verified; local NVIDIA/AMD only enumerated | open / 6, 10, 14, 28, 29, 34, 35 | Inventory separate target devices/architectures then collect E2E/codec/HDR/capture/driver evidence |
| host-floor / Windows minimum build | Win10 and Win11 full host function floors / No display/mic/camera prototype evidence yet | open / 3, 4, 5 | Lock actual minimum builds using prototypes without replacing Win10 with Win11 |
| linux-extra-architectures / ARM32/RISC-V/board-specific original Linux paths | Preserve original user abilities and explain framework gap / Fixed Qt README vs Flutter3.44 x64/arm64 statement | open / 2, 34, 35 | Keep in v1 differences; prototype Flutter/native feasibility then propose specific small phase split if needed |
| linux-toolchain / Linux compiler/Flutter desktop/media SDK | Linux x64/arm64 builds and Wayland/X11 backends / No Linux executor queried | open / 2, 34, 35 | Verify toolchain/native packages on Linux build executor and GPU device |
| measurement-instruments / Reference binary and calibrated measurement instruments | Comparable performance observations / No source-matched binary digest, high speed camera, instrument accuracy or calibration measured | open / 6, 10 | Build/select source-matched reference and record SHA256; collect raw logs and calibrate or mark unavailable |
| native-build / Native/toolchain integration | All five target builds and dependency pinning / Version queries/cache components only; no Aether binary exists | open / 2, 10, 14, 28, 29, 30, 31, 32, 33, 34, 35 | Pin versions and perform target smoke build; request exact official dependencies if missing |
| windows-wdk / Installed SDK/WDK and Visual Studio integration files | Installation evidence only; target driver build belongs to native-build / WDK 10.0.28000.0 paired headers/libs/tools; VS 2026 kernel/user toolset props/targets present | resolved / 3, 4, 5 | Installation verified; Phase3–5 still pin exact kit/toolchain versions and validate target builds/signing; no installation request needed |
| windows10-machine / Win10 machine | Independent Win10 OS/driver/media tests / Current machine CIM is Win11; registry name is not Win10 evidence | open / 3, 4, 5, 12, 38 | Prepare separate Win10 target; GPU functionality requires physical device |

本阶段不要求安装依赖、驱动、限速工具或修改安全/网卡配置；后续依赖请求必须明确组件、用途、版本和官方来源。

## 可复现测量方法候选

推荐 30 秒预热、60 秒采样、3 轮；这是方法，不是性能 SLO。必须记录固定参考 commit 与二进制 SHA256、host/client 匿名 ID、OS/GPU/驱动、相同网络/分辨率/fps/codec/HDR/音频以及仪器、精度、时钟。不同参数拒绝比较。按 metric/unit 分组 nearest-rank p50/p95；无样本返回 unavailable，不能填 0 或虚构 p95。

| 指标 | 单位 | 采集路径/限制 |
|---|---|---|
| overlay-estimate | ms | Record reference client overlay statistics with capture time; estimate only, preserve definition and update period. |
| decode-duration | ms | Instrument decoder submit-to-output on one monotonic clock; record actual hardware/software path and frame IDs. |
| network-rtt | ms | One endpoint monotonic send/echo timing; preserve probe cadence and loss. |
| glass-to-glass | ms | High-speed camera sees host+client physical event/display together; count frames, record camera fps/exposure and resolution ±1 frame or measured uncertainty. |
| frame-drop | % | Count missing/dropped frame IDs against expected frames over recorded window; preserve denominator. |
| jitter | ms | Record inter-arrival variation on one receiving monotonic clock with exact definition/interval. |
| cpu | % | OS process CPU sampled every second; record normalization to whole machine vs one core. |
| gpu | % | GPU engine utilization counter per process/adapter and cadence; absence unavailable. |
| vram | MiB | Per-process/adapter dedicated allocation counter in MiB; shared memory separate. |
| power | W | External wattmeter preferred, record host/client/system boundary and calibrated accuracy; driver estimate explicitly identified. |

Same-clock RTT/decode durations only. Cross-machine timestamp differences require documented calibration, uncertainty and capture date; glass-to-glass uses one camera/clock observing both physical displays.。屏幕统计 overlay-estimate 只作估计，RTT/解码时长/玻璃到玻璃分别记录。缺仪器或校准写 unavailable；Phase 6/10 实测后再确认目标。完整可执行步骤与测量 CLI 见 [DEVELOPMENT](DEVELOPMENT.md)。

| 场景 | 操作 |
|---|---|
| lan-desktop | Wired LAN,1080p60 desktop; same host/client/codec/audio/HDR params |
| wifi-jitter | Wi-Fi repeat runs; record channel/link quality and jitter, do not change system settings |
| controlled-impairment | Isolated lab network/device with authorized loss/RTT/bandwidth profile; record exact profile, no workstation NIC modification |
| high-fps-game | Source-supported high-fps game at actual display/codec limits; record achieved rather than requested fps |
| hdr | Known HDR pattern/content, record metadata/output capability and SDR fallback |
| dual-display | At least two independent changing displays, separate frame IDs and sync |
| resource-limit | Increase independent streams to negotiated encode/decode/VRAM/bandwidth limits; explain rejection |
| hotplug | Physical output/input device unplug/replug under active session, capability changes |
| sleep-wake | Host/client suspend+resume, reconnect and lease/instance/display persistence |
| long-run | Proposed 8-hour stability run after baseline capture; record failures/thermal/resource drift, not an approved SLO |
| instance-persistence | Start A/B/C, control A, switch B, disconnect all, reconnect C; confirm apps/displays persist; explicitly stop B, A/C survive |
| lease-race | Two authorized clients race lease; reject second controller and stale input; authorized read-only join independent of control |

## 决策选项与建议

### original-scope-observers（selected）

确认全部原能力/ORIG01–10与Apollo授权只读加入路线

- **retain-evidence**：保留全部原能力；授权只读观察者可加入，禁止输入/设备上行/会话变更，独立协商资源，主机仍唯一控制租约；收益 保留全部适用原能力及真实证据边界；代价 确认后修订SESSION-MODEL观察者段落；Phase6/20/37验证授权、隔离和资源拒绝。
- **revise**：指出具体行/范围/方法，修订后再确认；收益 产品实施前纠正基线；代价 相关门禁须重跑；不自动删能力或转TODO。

推荐：retain-evidence。当前选择：retain-evidence。

### client-minimum-architectures（selected）

确认Flutter3.44最低OS/架构候选及原目标差异的验证路线

- **retain-evidence**：Windows10/11 x64+arm64；macOS10.15 x64+arm64；iOS13 arm64；AndroidAPI24 arm32+arm64+x64；Debian10/Ubuntu20.04 x64+arm64。原生限制未证实；AndroidAPI21–23及LinuxARM32/RISC-V/板卡保留v1差异；收益 保留全部适用原能力及真实证据边界；代价 Phase2原型验证更低AndroidAPI、额外架构与原生最低范围；需要时提出具体小阶段拆分，当前不宣称支持。
- **revise**：指出具体行/范围/方法，修订后再确认；收益 产品实施前纠正基线；代价 相关门禁须重跑；不自动删能力或转TODO。

推荐：retain-evidence。当前选择：retain-evidence。

### environment-gaps-host-floor（selected）

确认实际工具/OS结果与保留机器及构建缺口

- **retain-evidence**：Win10/11主机build待Phase3–5原型；WDK与VS2026集成已安装并经文件核验；保留原生构建、目标设备和Apple构建缺口，只有Apple实机验收VFY01/02延期；收益 保留全部适用原能力及真实证据边界；代价 在责任阶段准备明确依赖、构建执行器和设备；本阶段不安装。
- **revise**：指出具体行/范围/方法，修订后再确认；收益 产品实施前纠正基线；代价 相关门禁须重跑；不自动删能力或转TODO。

推荐：retain-evidence。当前选择：retain-evidence。

### measurement-method（selected）

确认可复现测量方法，真实基线后再定产品目标

- **retain-evidence**：30秒预热/60秒采样/3轮；按metric/unit计算nearest-rank p50/p95；依文档记录场景、仪器与精度，缺指标写unavailable；收益 保留全部适用原能力及真实证据边界；代价 仪器/精度/时钟校准尚未实测；无产品性能保证；Phase6/10实测后定阈值。
- **revise**：指出具体行/范围/方法，修订后再确认；收益 产品实施前纠正基线；代价 相关门禁须重跑；不自动删能力或转TODO。

推荐：retain-evidence。当前选择：retain-evidence。

## 仍保留的审计 flags

BASE-01、BASE-02、BASE-03 均为 spec-less 分类 **unclassified/unresolved**；RESEARCH A1 的仪器精度/跨机时钟校准无实测。descriptor-less prohibitions 仍 **flagged-unverified**：工具/API/目录/构建不得伪装硬件支持，不得通过提高 Windows 下限避开 Win10，Apple 构建不能豁免。另外保留来源根许可证/FFI/上架声明不得冒充生产授权，缺子模块/驱动/二进制/签名不得冒充可发行，新增原能力不得默删或擅自转TODO，共有能力族/设置数量不得代替各端全集及独立案例；与前述两条环境 prohibitions 合计六条。人工审阅不会伪装自动分类引擎已经解决。

人审记录：{"status":"confirmed","confirmedBy":"user","confirmedAt":"2026-10-07T13:45:39.459Z","confirmationText":"1. 确认；2. 确认；3. wdk已安装；4. 确认。后续补充：vs26 已集成wdk。","decisions":["original-scope-observers","client-minimum-architectures","environment-gaps-host-floor","measurement-method"],"retainedBlockers":["android-api21-23","apple-toolchain","client-machines","host-floor","linux-extra-architectures","linux-toolchain","measurement-instruments","native-build","windows10-machine"],"retainedTodos":["apple-hardware"],"retainedSourceBlockers":["project-license","external-build-scope","apple-foss-channel","driver-production-signing","distribution-accounts"],"scope":"Phase1 baseline and method review; no product support or production reuse approval"}。保留阻碍详见来源数据及本报告缺口。最终 --require-review 检查明确人类答复、冲突决定和所有开放环境缺口引用，本次人审已确认。Phase 1 只交付基线，不自动启动 Phase 2 或全部产品实现。
