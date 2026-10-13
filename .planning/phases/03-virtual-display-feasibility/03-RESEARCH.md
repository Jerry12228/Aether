# Phase 3: 虚拟显示器可行性 - Research

**研究日期：** 2026-10-08
**领域：** Windows IddCx/UMDF 虚拟显示器 provider、持久身份与安装来源
**置信度：** MEDIUM；规划输入已完成，生产可行性未通过。

<user_constraints>
## User Constraints (from CONTEXT.md)

下列 Implementation Decisions 为原文，包含 D-01–D-16、继承约束和研究职责；没有额外技术裁量授权。[CITED: .planning/phases/03-virtual-display-feasibility/03-CONTEXT.md]

<!-- DATA_4f3a8c19_START -->
## Implementation Decisions

### 原型操作入口

- **D-01:** 使用 Helios 命令行提供虚拟显示组操作，通过 Windows 显示设置和测试窗口观察结果；不增加本阶段可视化操作面板。
- **D-02:** 每条命令执行后退出，分别提供创建、查询、调参、删除等操作，结果留在终端。命令退出不移除显示组；显示组生命周期与命令进程分离。
- **D-03:** 支持显示组名称操作，例如 A/B/C/D；查询结果同时展示稳定 ID，便于核验身份。
- **D-04:** 通过另行执行的显式测试画面命令，在各屏显示组名、屏编号和不同测试图。创建组不隐式启动测试画面；测试窗口/进程与持久显示组的所有权和清理须区分。

### 显示规格与布局

- **D-05:** 四组七屏作为本轮原型目标，不再仅验证 A/B 两组。这是验证拓扑，不构成产品最大组数或屏数承诺。
- **D-06:** 默认请求下表规格，所有屏请求 60 Hz。用户先选择 A 组混合分辨率、B 组单屏，再补充同分辨率双 SDR 屏和同分辨率 SDR/HDR 双屏。

| 组 | slot | 分辨率 | 刷新率 | 色彩模式请求 |
|----|------|--------|--------|--------------|
| A | 1 | 1920×1080 | 60 Hz | SDR |
| A | 2 | 2560×1440 | 60 Hz | SDR |
| B | 1 | 1920×1080 | 60 Hz | SDR |
| C | 1 | 1920×1080 | 60 Hz | SDR |
| C | 2 | 1920×1080 | 60 Hz | SDR |
| D | 1 | 1920×1080 | 60 Hz | SDR |
| D | 2 | 1920×1080 | 60 Hz | HDR |

- **D-07:** A/B/C/D 各占一行，组内横向排列；存在物理屏时，虚拟屏放在其右侧，保留现有物理屏布局。坐标计算及无物理屏时的锚点由研究/规划确定。
- **D-08:** 分别记录请求规格和实际生效结果。HDR 需核验实际显示状态和 provider/OS/GPU 条件，不能仅凭请求被接受或测试图出现判定生效；本阶段证据不替代后续 HDR 捕获、编码、传输和呈现证据。

### 失败与恢复体验

- **D-09:** 四组验证部分失败时保留成功组；失败组只撤销自身本次创建的资源，报告失败，修复原因后可单独重试。修改已有组失败时保留最后成功配置，不能误删已有资源或其他组。
- **D-10:** 严格按请求规格验证，不自动降级，也不增加允许降级路径。无法满足请求时拒绝该组本次操作，说明原因和可用规格，保留已有状态；由用户修改请求后重试。
- **D-11:** 驱动故障或重置导致虚拟屏消失后，通过显式恢复命令处理。先查询并报告现实状态与登记的差异，由用户指定组，再按原稳定身份和最后成功配置尝试恢复；不增加原型后台自动恢复程序。
- **D-12:** 重复创建同名已有组一律报“已存在”，即便请求配置相同也不视为创建成功。已有组使用查询、调参或恢复命令操作。

### 驱动接入体验

- **D-13:** Helios 提供显式驱动安装命令，需要提权或重启时明确提示。显示组操作命令只检查驱动状态，不隐式安装驱动。
- **D-14:** 安装命令从核验过的固定来源下载锁定版本，校验通过后才安装；下载或校验失败则停止。具体 provider、来源、版本、哈希及签名证据由研究核验，不在讨论阶段虚构可用安装包。
- **D-15:** 安装命令支持显式更新选项；只有带该选项才尝试更新。已安装版本与锁定版本不同时，普通安装命令停止并报告差异。现有显示组处理、更新失败恢复及回滚方案由研究/规划具体化。
- **D-16:** 安装或更新需要重启时，提示“需要重启”后退出，由用户手动重启；重启后运行检查命令确认驱动就绪。不增加自动重启或独立重启命令。

### 继承的已确认约束

- Aether 单一 Monorepo、Helios/Selene 单一产品版本；C++20/C ABI/CMake 与 Dart FFI、薄平台通道已获 Phase 2 确认。Dart 不承担设备驱动或逐帧媒体热路径。
- 实例/显示组与临时连接生命周期分离。断连/切换保留最后成功拓扑与显示组；显式停止仅移除本实例拥有资源。原型退出、测试窗口退出也不能隐式删除显示组。
- 同一 Windows 登录桌面共享窗口、焦点、剪切板和系统音频；显示组不能被描述为独立用户桌面或隔离容器。主机控制租约全局唯一，观察者无拓扑修改权限。
- 物理显示器/已有桌面捕获路径保留；既有物理布局和非本次操作拥有的显示资源不得被原型清理误伤。
- Windows 10/11 支持要求和全部适用原功能保留，不能以参考 provider 或新 WDK 的最低版本直接提高产品主机下限。
- Phase 1 的 compatible-open-source / retain-candidates 是复用与发行路线意向，不是具体驱动许可/再分发批准。references/upstream 为固定 SHA、忽略的研究材料，不作为产品依赖链接、编辑或提交为子模块。
- 五客户端仍为 v1；只有 Apple 实机验证为既定 TODO，不能把本阶段 Windows 驱动结果视为其他平台媒体支持证据。
- 研究、计划检查、验证和 Git 文档追踪开启，通常 1–3 个小计划；当前完成讨论，下一步规划，不自动执行全部产品阶段。

### 研究与规划职责及待验证事项

本轮没有“你决定”的额外授权；以下为已有研究/规划职责，不代表用户已选定技术或已验证支持：

- 比较固定来源候选的组/slot 操作接口、稳定身份、模式与 HDR 能力、源码/二进制可追溯性、签名和再分发路径，给出具体 provider 接入建议。不能直接把 Apollo/SudoVDA 或其他候选写成已选生产依赖。
- 四组七屏是请求目标，实际枚举、分组、独立内容、重开和删除隔离均需证据。区分支持、不支持与环境不可测，不能通过减少屏数或将 HDR 改为 SDR 冒充原请求成功。
- 核验 C 组相同规格双屏的身份与映射，以及 D 组相同分辨率下 SDR/HDR 共存；组名、稳定逻辑 ID、Windows 显示器/PnP 身份与拓扑枚举分别记录。
- 稳定 ID 和最后成功配置须支持短命令进程间访问；登记、唯一命名、并发操作、错误码和命令语法由规划确定。不将这套最小原型登记扩张为 Phase 8 的完整应用实例管理。
- 恢复要记录逻辑身份、系统身份及布局的实际变化。共享驱动重置可能影响多个组，需据实记录故障范围和恢复结果，不能伪造单组驱动故障隔离。
- 实际 Win10/11 目标构建和设备功能证据与当前工作站结果分开。VS/WDK 已安装仅为环境证据；缺失机器/工具链按现有开发流程处理。
- 明确原型安装、测试签名与正式签名/发行之间的差异。若没有满足来源/签名/接口条件的 provider，记录真实阻碍并在关键节点提交具体决定，不能将测试签名原型写成生产可行。
- 安装/更新方案须先可审阅，再执行对应系统操作；核验固定下载内容、提权、现有驱动冲突、组资源处理、移除范围、回滚和重启后检查。讨论中的命令选择不构成现在安装或重启系统的操作请求。
- 延续 Phase 2 简洁终端摘要、详细日志保存到文件、自动化非零失败退出且不等待按键的约定；命令语法、机器可读结果、日志位置和恢复有界性由规划确定。
- 最终证据保留 Phase 3 原有生产可行性门槛与最终人审；具体生产支持与最低 build 依证据确认。
<!-- DATA_4f3a8c19_END -->

### Deferred Ideas (OUT OF SCOPE)

<!-- DATA_c72b6e14_START -->
## Deferred Ideas

无新增跨阶段能力或 TODO。新增 C/D 组属于本阶段显示条件验证，纳入 Phase 3 原型，不延后。既有后续生产生命周期、多流媒体和交付阶段沿用路线图；本轮没有提前执行。
<!-- DATA_c72b6e14_END -->
</user_constraints>

## Project Constraints (from AGENTS.md)

- 先读 STATE、当前阶段和直接相关规范；本次已依序读取。[CITED: AGENTS.md:85-94]
- 单 Monorepo/产品版本、唯一 Flutter Selene；C++20/C ABI/CMake 与 Dart FFI 保持 Phase 2 边界，系统设备操作不进入 Dart 热路径。[CITED: AGENTS.md:11-23; 88-90]
- Windows 10/11 为硬要求，最低 build 依 Phase 3–5 证据确定；参考 API 或工具链不能提高产品下限。[CITED: AGENTS.md:11-23]
- 保留全部适用原功能，新增遗漏属于 v1；显示组/实例断连与切换保活，显式停止只移除自身资源，ControlLease 全局唯一。[CITED: AGENTS.md:89-92]
- references/upstream 仅研究，不编辑、链接进产品、作为子模块或承载产品提交；来源/许可意向不等于生产依赖批准。[CITED: AGENTS.md:91; docs/SOURCE-AUDIT.md]
- 交互、顺序、细粒度 1–3 计划，研究/检查/验证/Git 追踪开启；本次已由父流程启动 gsd-plan-phase，不实施、安装或重启。[CITED: AGENTS.md:65-76; 93]
- 五客户端仍属 v1；Apple 实现/构建保留，仅其既定实机验收为 TODO；候选、API 事实、构建与实测必须分开。[CITED: AGENTS.md:11-23; 94]
- 资源受 GPU/显存/带宽约束，事前协商并解释拒绝；保持 GameStream 基础，不切换整体协议路线。[CITED: AGENTS.md:11-23]
- 本次项目技能目录查询不存在，配置 agent_skills 为空；graphify status 返回 disabled，不引入图关系作为证据。[VERIFIED: 本次目录/配置/CLI 查询]

<phase_requirements>
## Phase Requirements

| ID | 原始要求 | 研究支持 |
|---|---|---|
| VDP-01 | 用户能在 Win10/11 原型中创建两个独立标识的虚拟显示器组并观察不同内容。 | provider 准入、短 CLI 保活、四组七屏映射与独立测试窗口；新增 C/D 原请求仍须验证 |
| VDP-02 | 维护者能验证 provider 的稳定 ID、操作接口、签名/再分发路径与失败恢复。 | 固定接口审计、来源/签名门禁、最后成功配置、手动差异恢复与真实机器证据 |

两项描述来自 REQUIREMENTS 原文；当前为未完成，规划产物与模拟测试不关闭需求。[VERIFIED: .planning/REQUIREMENTS.md:26-27，原文如表]
</phase_requirements>

## Summary

**主要建议：先设置 provider 准入与具体决策检查点，再接入短命令和最小登记，最后执行获授权的机器验证。** 当前证据不足以选定可生产依赖；不存在本次已核验可直接下载并安装的固定正式包。不得填入猜测的版本、URL、哈希或签名通过状态。[VERIFIED: 本次研究操作记录；CITED: docs/SOURCE-AUDIT.md:31-36]

固定 Apollo 提供逐显示器 GUID 接口，并在 watchdog Timeout 非零时持续 Ping；固定 VDD 按统一数量/模式创建显示器且每次生成随机容器 GUID。二者均不能直接作为已满足 D-02、稳定系统身份和删除隔离的生产方案。微软 API 提供句柄退出后继续枚举的软件设备生命周期选项，因此“短 CLI 持久化根本不可能”也不成立；它需要 provider 支持与实机证据。[VERIFIED: 本文源码附录 S1–S3；CITED: https://learn.microsoft.com/en-us/windows/win32/api/swdevice/nf-swdevice-swdevicesetlifetime]

IddCx 的 HDR DDI 有明确 Win11 下限；Win10 SDR 与 Win11 HDR 必须分别记录。Win10 上严格 D 组 HDR 请求不满足时，拒绝整组本次创建并保留成功组，不能把 D 改 SDR 或把五屏结果记成七屏通过。API 排除不取消 Win10 产品范围；最终必须提交具体支持条件和仍未通过的目标。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iddcx1.10-updates; https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/iddcx/nc-iddcx-evt_idd_cx_monitor_set_default_hdr_metadata; 03-CONTEXT.md D-05/D-08/D-09/D-10]

## Architectural Responsibility Map

以下是规划建议，需在计划/关键检查点确认，不是新增已确认技术。[ASSUMED: A1]

| 能力 | 主责层 | 次责层 | 理由 |
|---|---|---|---|
| 名称/逻辑 ID、最后成功配置、并发互斥 | Helios 原生本地协调入口 | 受 ACL 保护的登记存储 | 与短命令进程分离，不引入 Phase 8 应用管理 |
| monitor 创建/删除/持有 | Windows provider/UMDF 驱动 | 原生适配 | CLI 退出不得释放持久屏 |
| 模式/坐标/HDR 查询与应用 | 交互 Windows 登录会话中的原生适配 | Windows CCD/显示栈 | 操作整个共享桌面时保留其他资源 |
| 下载/校验/安装/更新 | 显式提权安装入口 | OS 安装与签名工具 | 与普通组操作、手动重启分离 |
| 组名/slot 不同内容 | 独立测试画面进程 | 原生窗口/GPU | 其退出仅清理测试窗口 |
| 独立视频流/实例仲裁 | 后续阶段 | — | Phase 8/17/18/19/20 边界保留 |

## Standard Stack

继续使用已确认 C++20/C ABI/CMake 与 Windows API；本阶段不推荐新增 npm/PyPI/crates 包。[CITED: 03-CONTEXT.md 继承约束]

| 项目 | 已知固定值/版本 | 用途与证据边界 |
|---|---|---|
| Windows 构建入口 | CMake 4.4.3、SDK 10.0.28000.0 | 已有工具，不证明驱动构建或 Win10 运行 |
| IddCx/UMDF | 按 OS 运行时能力检查 | 驱动系统枚举、模式与 swapchain；不锁一个高版本作为主机下限 |
| CCD API | QueryDisplayConfig、DisplayConfigGetDeviceInfo、SetDisplayConfig | 查询现实拓扑/颜色、验证并应用准确布局 |
| Node 原生测试框架 | Node v24.14.0，本轮实际版本查询 | 来源/登记/事务/CLI fixture；不替代真实显示器 |
| provider | 未选定 | 只有准入门禁通过并经具体批准后才进入产品依赖 |

锁定工具原文为：DATA_9854a3db_START “"cmake": "4.4.3",” 和 “"sdk": "10.0.28000.0",” DATA_9854a3db_END。[VERIFIED: toolchains.lock.json:20-29；本次 cmake --version 输出亦为 4.4.3]
CCD 用途与 console-session 权限边界来自官方文档。[CITED: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-querydisplayconfig; https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setdisplayconfig]

### Package Legitimacy Audit

不安装生态 registry 包，因此 npm/PyPI/crates legitimacy gate 不适用。驱动是独立供应链对象，必须完成下述准入；注册表“存在”、上游 Signed 勾选或可信下载站均不能代替包核验。[VERIFIED: 本次操作记录；CITED: docs/SOURCE-AUDIT.md]

## Provider 对比与准入结论

| 候选 | 已取得事实 | 对本阶段的结论/剩余门槛 |
|---|---|---|
| Apollo/SudoVDA 固定参考 | GUID add/remove、逐次 width/height/fps；watchdog 查询+持续 Ping；Apollo 按客户端固定身份，原生命周期跟串流/app | 优先审查其逐屏 API，但不选为生产依赖；须证明七屏容量、短命令无常驻 Ping 保活、按 slot GUID 映射/重复拒绝/删除隔离、真实包对应源码与独立授权 |
| VirtualDrivers VDD 固定参考 | count 统一创建、共享模式/EDID、ConnectorIndex=index、CoCreateGuid；SETDISPLAYCOUNT 调用 ReloadDriver | 可作为公开源码能力参照；固定代码不能直接证明稳定容器身份/按组独立生命周期，不能用修改全局数量冒充删除一组；适配或修改驱动会形成新来源/签名工作 |
| Microsoft IndirectDisplay 样例 | IddCx 样例含 driver 与 software-device app；app 默认持句柄等待按键，关闭时卸载 | API/模式/ownership 教学基线，非正式 provider；可研究 ParentPresent 路线，但不能直接安装样例并称生产可行 |
| MolotovCherry virtual-display-rs | 官方 README 声明 Win10 2004+ x64、最多 10 monitors、逐 monitor 模式和独立启用/禁用；安装要求证书导入 | SDR 动态接口的候选对照；尚未固定 SHA/包核验，没有本次 HDR/生产签名/持久证据，不新增 Rust 栈或批准安装 |
| Parsec VDD | 官方产品页面描述付费多屏/最多 3 additional virtual displays | 产品路径有明确限制与授权背景；不把产品 3 屏上限推断成底层驱动上限。本次未取得 Aether 七屏/HDR/独立再分发许可，不能推荐 |

前两项引用本文 S1–S3。其他候选为官方声明，不是测试结果：[CITED: https://raw.githubusercontent.com/microsoft/Windows-driver-samples/main/video/IndirectDisplay/README.md; https://raw.githubusercontent.com/microsoft/Windows-driver-samples/main/video/IndirectDisplay/IddSampleApp/main.cpp; https://github.com/MolotovCherry/virtual-display-rs; https://support.parsec.app/hc/en-us/articles/32381733729044-Multiple-Monitors-and-Virtual-Displays]
上游 VDD README 的 Signed/HDR/ARM64 表及 Apollo release 签名更新说明仅能定位待审包，不构成本次正式签名证据。[CITED: https://github.com/VirtualDrivers/Virtual-Display-Driver; https://github.com/ClassicOldSong/Apollo/releases]

### G0：生产依赖与执行准入

以下执行门禁为建议，需在 03-01 形成具体可审阅决定。[ASSUMED: A2]

1. 固定官方来源、tag/commit、不可变资产、文件长度/SHA256、INF/CAT/DLL/工具清单、架构/DriverVer、对应源码和第三方 notices；未取得值保留 unknown，不构造可用安装 URL。
2. 实际核验签名链/时间戳、CAT 成员哈希与政策；包在目标 OS 默认安全配置下安装/运行证据单列。自签证书导入与测试签名路线只允许明确测试环境，不能宣称正式发布。
3. 取得 provider/包独立许可及再分发依据；MIT/GPL 根文本或 compatible-open-source 意向不覆盖未知 DLL/证书/安装工具。
4. 证明 CLI 关闭全部自身句柄后显示器仍在；SudoVDA 查询实际 Timeout/Countdown，等待超过实际 watchdog 周期。若需常驻持有/Ping，提交具体常驻所有者/崩溃范围方案确认，不能暗中加自动恢复后台。
5. 七 slot 的稳定逻辑身份、系统映射、容量、不同规格、SDR/HDR 同时生效、操作隔离得到明确接口或实验支撑；每组严格预检和回滚有界。
6. 给出安装/显式更新/冲突/回滚/重启后的步骤与移除对象；只有用户批准具体系统操作后才执行。

**当前 G0 未通过：** 固定生产包、对应源码/独立再分发依据、正式签名/默认安全配置运行、短 CLI 保活、七屏与混合 HDR 的真实证据，以及 Win10 实机均仍有缺口。[VERIFIED: 本次研究记录；CITED: docs/SOURCE-AUDIT.md; docs/PLATFORM-MATRIX.md]
这不阻止写计划或开展不改系统的合同测试；会阻止生产选用/相关机器操作与阶段通过。若没有候选通过，应留下 blocked 可行性报告、未完成 VDP 和具体待决定项，不能将 fake 结果替代 VDP 成功。[ASSUMED: A2]

## Architecture Patterns

### System Architecture Diagram

~~~mermaid
flowchart TD
  CLI[Helios 单次命令] --> CHECK[驱动与现实状态查询]
  CHECK --> ADMIT{来源/能力/所有权准入}
  ADMIT -->|失败| ERROR[解释拒绝并退出]
  ADMIT -->|通过| LOCK[登记互斥与最后成功快照]
  LOCK --> PROVIDER[原生 provider 操作]
  PROVIDER --> OS[Windows monitor/模式/HDR/布局]
  OS --> VERIFY{实际结果严格匹配}
  VERIFY -->|是| COMMIT[原子提交登记并退出 CLI]
  VERIFY -->|否| ROLLBACK[仅撤销本次资源/恢复上次成功配置]
  TEST[显式测试画面命令] --> WINDOWS[各 slot 独立窗口]
  WINDOWS --> OS
  RECOVER[显式指定组恢复命令] --> CHECK
~~~

图为建议架构。[ASSUMED: A1]

### 身份、事务和恢复

保留四层身份：组逻辑 ID、组内稳定 slot ID、provider 原生 GUID/connector、Windows PnP/container/adapter LUID+target ID/GDI 路径；不要以友好名、分辨率或枚举顺序当主键。创建登记与 pending journal 先落盘，实际核验后才提交 last-success；异常恢复先比较现实和登记再由用户指定组处理。相同规格 C 两屏也须不同稳定 ID；D 两屏色彩状态独立。[ASSUMED: A1；CITED: 03-CONTEXT.md D-03/D-09/D-11/D-12]
官方 ConnectorIndex 为 adapter 内从 0 开始的唯一值，跨 reboot/upgrade 保持不变，范围小于 MaxMonitorsSupported；后者是同时连接屏数上限，另有总 pipeline rate 限制。七屏请求不证明产品任意容量。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/iddcx/ns-iddcx-iddcx_monitor_info; https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/iddcx/ns-iddcx-iddcx_adapter_caps]
显示对象由 UMDF adapter/monitor 持有；adapter 到 UMDF device 停止时失效。这与 CLI/测试窗口生命周期是不同层。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iddcx-objects]
布局建议以非 Aether 现实物理屏矩形集合最右边界为 x 锚点，各组行高取本组最大请求高度；无物理屏取 (0,0)，保留非本次资源的 mode/位置/主屏。使用有界重查与验证，精确 60 Hz 用有理数记录，不能四舍五入掩盖 59.94 Hz。[ASSUMED: A3]
QueryDisplayConfig 的 buffer-size/query 之间可发生拓扑变化，应重试 ERROR_INSUFFICIENT_BUFFER；访问 console session 的权限不足会报 ERROR_ACCESS_DENIED。SetDisplayConfig 验证与实际应用后均需回读，不允许自动改成可用近似规格。[CITED: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-querydisplayconfig; https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setdisplayconfig]

### Win10/11 与 HDR

IddCx 1.10 新增 HDR10/SDR WCG；HDR 驱动须使用新版 mode、target、buffer 等 DDI，并在较旧 OS 检查函数/字段可用性。官方明确允许一个 1.10 构建的二进制通过运行时检查在 Win10 1803+ 运行，但不意味着其 HDR DDI 在旧 OS 可用。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iddcx1.10-updates]
版本表列 Win10 19045 为 1.5，Win11 22631 为 1.10；HDR metadata callback 明确最低 Windows11 22H2 September Update。应同时记录实际 OS build/补丁、IddCxGetVersion、provider/GPU 和颜色查询；不要仅靠营销版本号或新版 WDK 推断支持。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iddcx-versions; https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/iddcx/nc-iddcx-evt_idd_cx_monitor_set_default_hdr_metadata]
固定 Apollo README 也明确 Win10/低于23H2无 HDR 选项；这是 provider 声明，与微软 DDI 下限区分。当前严格七屏默认请求不能在已知 Win10 IddCx 路线被宣布全通过，须记录 D 组拒绝/未验证及可用 SDR 能力，Win10 主机仍保留。[VERIFIED: references/upstream/apollo/README.md:46-50，原文 “Any system lower than 23H2/Windows 10 will not have HDR option available.”]
SDR/HDR 的“能力”与“已启用”分别记录，D-2 请求 HDR 后核验实际 advanced-color/HDR 状态与截图/系统页面；D-1 保持 SDR。测试图出现不是颜色正确或后续 capture/encode/stream/presentation 通过。[CITED: 03-CONTEXT.md D-08；ASSUMED: A4 具体机器证据方法]

## Don't Hand-Roll

| 问题 | 不自行构造 | 使用 |
|---|---|---|
| 驱动签名/信任 | 导入任意根证书即“正式签名” | Windows 信任策略、SignTool、实际包/CAT 核验 |
| 显示现实状态 | 从登记或名字猜测 active monitor | CCD/设备枚举与 provider native identity |
| 模式自动修正 | 静默降低分辨率/刷新率/HDR | 严格 capability admission、精确回读 |
| 显示生命周期 | CLI 退出触发 driver/global teardown | 明确持久 owner 与按组 ownership |
| 安装工具执行 | 拼接用户参数为 shell/batch | 已有 executable+argv runner、固定 manifest |

上表是规划建议，继承 D-02/D-09/D-10/D-14。[ASSUMED: A1/A2；CITED: 03-CONTEXT.md]
SignTool 官方提供签名/验证功能；硬件提交要求 EV 关联等条件，attestation 面向零售用户不能发布到 Windows Update，不将 attestation、WHCP、应用安装器 Authenticode 混为一项。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/signtool; https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs; https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-attestation]

## Common Pitfalls

| 陷阱 | 具体证据/检查 |
|---|---|
| 一次 CLI 创建后立即宣布保活 | 持有句柄/Ping 的后台进程全部关闭，再越过真实 watchdog 等待；不能借已运行 Apollo 帮忙 Ping |
| 全局屏数修改当作按组删除 | VDD count reload 路径；删除 B 后验证 A/C/D 的身份、mode、窗口/布局，无隐式重建 |
| 随机容器 ID 被逻辑登记掩盖 | 同名/同规格 C slot 逐个比对 Windows identity 和恢复变化 |
| HDR enabled 或彩色图等于 HDR 正确 | 独立能力与实际状态；Win10 缺 DDI 拒绝，不降低请求 |
| 命令失败只回滚登记 | 注入 provider 半成功/提交失败/进程崩溃，查询现实幽灵屏与 pending journal |
| “已安装”意味着锁定包可更新 | 历史本机版本与参考 INF 不同；普通安装仅报告差异，更新须显式及可恢复 |
| 沿用上游安装脚本误删他人驱动 | 其 remove-node、证书导入范围需独立审阅，不执行参考脚本 |
| CI/fake 通过等于实机通过 | 两类报告拆分；缺机器/签名/颜色证据不记 PASS |

这些检查建议对应源码附录和锁定决定。[ASSUMED: A4；VERIFIED: 本文 S1–S4]

## Code Examples

以下只展示已读接口/API，不是产品实现，也不能复制参考 GPL 接口进入产品而省略许可审查。

~~~cpp
// Apollo 接口事实，原文签名
static const bool AddVirtualDisplay(HANDLE hDevice, UINT Width, UINT Height, UINT RefreshRate, const GUID& MonitorGuid, const CHAR* DeviceName, const CHAR* SerialNumber, VIRTUAL_DISPLAY_ADD_OUT& output);
static const bool RemoveVirtualDisplay(HANDLE hDevice, const GUID& MonitorGuid);
~~~

声明行原文见 S1；示例省略函数体，不能证明其底层驱动的持久/容量语义。[VERIFIED: references/upstream/apollo/third-party/sudovda/sudovda.h:64-88]
微软生命周期方向为在 creation callback 之后设置 SWDeviceLifetimeParentPresent，再关闭句柄仍继续枚举；后续可重新打开同一 software device，移除时推荐改回 Handle。不要把 ParentPresent 当成重启后自动恢复应用/组的保证。[CITED: https://learn.microsoft.com/en-us/windows/win32/api/swdevice/nf-swdevice-swdevicesetlifetime]
建议 provider 接入合同包含 probe/enumerate/create-slot/update-slot/remove-slot、版本/capability、last-success、ownership、deadline 和 reality-diff；这些名称尚未存在，均为拟定接口。[ASSUMED: A1]

## 建议的 3 个顺序计划

| 计划 | 范围 | 完成条件/阻断点 |
|---|---|---|
| 03-01 | 固定候选来源/包/签名/许可/接口/机器准入记录；复用只读环境方法；形成 provider 决策及具体安装/更新/回滚方案 | G0 缺口逐项有证据和责任；checkpoint:decision 审阅具体候选或“无候选可生产接入”。不自动选 provider/造哈希 |
| 03-02 | 获选路线的原生 adapter 与 Helios 单次命令、最小持久登记/互斥/事务、严格规格/布局、独立测试画面；真实入口+fake deterministic tests | D-01–D-12 合同覆盖；只有准入路线确定才实现该 provider 接入。provider 阻断时可保留合同研究/诊断，不宣布 VDP 实现 |
| 03-03 | 获具体授权的安装/显式更新/手动重启后检查；Win10/11 四组七屏、跨 CLI/删组/同规格/HDR/恢复和最终人审 | D-13–D-16；完整来源+真实机器+所请求能力+人审才通过，保留成功/拒绝/失败/环境不可测分类 |

这是计划拆分建议。[ASSUMED: A2]
03-03 必须先展示包/哈希/签名结果、现有驱动/组影响、管理员动作、回滚/移除范围及重启提示，用户批准后执行。D-14 讨论授权不等于现在安装；reboot 必须手动。无法通过 G0 或 Win10/HDR/七屏门槛时，交付真实阻碍与未完成验证，保留 Phase 3 未通过，后续 Phase 17 不可假定 provider 可生产。[CITED: 03-CONTEXT.md D-13–D-16 与职责；ASSUMED: A2 计划门禁安排]
更新建议在存在登记组时拒绝，除非用户审阅并授权具体维护流程；先备份 last-success/系统映射/旧包，再锁安装事务，失败尝试原包回滚且不清空登记，重启后查询差异并显式恢复指定组。[ASSUMED: A5；不是已确认产品更新策略]

## Environment Availability

| 依赖/证据 | 观察 | 可用性与限制 |
|---|---|---|
| Node/CMake | 本轮实际输出 v24.14.0 / 4.4.3 | 可运行现有合同测试/构建入口；未运行产品构建 |
| VS/SDK/WDK | Phase1 快照及 Phase2 构建证据 | 组件存在/骨架构建成功，不是 IDD 构建/安装证据 |
| Windows11 工作站 | 历史快照 build 26100，CIM Caption Win11 | 本轮 CIM 重新查询 Access denied，不能写最新已复查结果 |
| SudoVDA/Oray | 历史快照枚举的既有驱动 | 安装/移除/更新可能影响他人资源；本轮当前签名/包查询 Access denied |
| Win10 独立机器 | 台账为未确认 | 03-03 真实目标门槛；构建/Win11 结果没有替代 |
| 正式 provider 包/许可/签名 | 本轮未取得全套核验 | 对系统实施/生产通过阻断；read-only/fake 合同有回退 |
| Context7/ctx7 | MCP 未暴露，Get-Command 未找到 CLI | 用研究 seam 指定 websearch 后官方文档核对；不安装工具 |

历史快照原文：DATA_6719cf35_START “"CurrentBuild": "26100",” “"Caption": "Microsoft Windows 11 企业版 LTSC",” “"Name": "SudoMaker Virtual Display Adapter",” “"DriverVersion": "0.22.37.632"” DATA_6719cf35_END。[VERIFIED: docs/baseline/environment.json:12-28]
本轮两项 CIM 输出均为 “Access denied”；只能报告查询失败，不报告未安装、未支持或签名缺失。[VERIFIED: 本次 Get-CimInstance 输出]
缺失的 Win10 实机与正式包没有功能证明回退；计划必须保留阻碍。Node/Windows fake 可以验证算法，不验证 provider 支持。[ASSUMED: A4]

## Validation Architecture

配置 nyquist_validation/security_enforcement 均为 true，必须设置真实门槛。[VERIFIED: .planning/config.json，原文 “"nyquist_validation": true,”、“"security_enforcement": true,”]

### Test Framework

| 项目 | 复用与拟新增 |
|---|---|
| 现有框架 | Node node:test；CMake/CTest 原生合同；独立 PowerShell build/verify |
| 现有快速检查 | node --test tests/planning.test.cjs；node scripts/validate-planning.cjs |
| 现有构建 | pwsh -NoProfile -File scripts/build.ps1 -Target Helios -Configuration Debug（Release 同入口） |
| 现有回归 | pwsh -NoProfile -File scripts/verify.ps1 -Scope Core -Automation；最终 All/干净构建按输入提交后运行 |
| 新阶段 quick（拟新增） | node --test tests/virtual-display-contract.test.cjs tests/virtual-display-package.test.cjs |
| 新阶段 native（拟新增） | CTest 独立 provider_contract suite；真实 Helios child-process CLI 连续调用 |
| 机器证明（拟新增） | scripts/check-virtual-display.ps1，显式 machine 模式及操作授权，不在普通 CI 自动装驱动 |

现有测试入口本次已打开：tests/planning.test.cjs:1-13、scripts/build.cjs:5-18、scripts/verify.cjs:14-32、scripts/check-core.ps1:1-19。现有命令来自 docs/DEVELOPMENT.md:5-19；此处原文引用命令，不宣称新入口已经存在。[CITED: docs/DEVELOPMENT.md:5-19]
拟新增文件/命令全部为建议，不是已存在路径。[ASSUMED: A4]

### Phase Requirements → Test Map

| 要求/决定 | 行为 | 确定性测试 | 必需实机/人类证明 |
|---|---|---|---|
| VDP-01；D-01–D-07 | 四组七 slot、同规格区别、独立内容/布局 | 请求 fixture、slot identity、坐标/physical snapshot、CLI 分进程登记；quick <30s | Win10/11 枚举/实际不同内容与 Windows 设置；七屏不降级 |
| VDP-01；D-08/D-10 | 精确模式、D 混合 SDR/HDR、拒绝不满足规格 | 60/1 对 60000/1001、unsupported/partial backend 返回、无静默降级；quick <30s | provider/GPU/OS/IddCx+actual color、D1 SDR/D2 HDR；拒绝是拒绝，不是七屏 PASS |
| VDP-02；D-02/D-03/D-12 | 退出后保活、稳定 ID、同名重复失败 | 三次独立 CLI、登记损坏/并发同名竞争；quick <30s | 所有 CLI/Ping owner 关闭后超过实测 watchdog 周期，重开身份/布局 |
| VDP-02；D-09/D-11 | 事务/删一组隔离、手动恢复 | 每个 provider 调用失败、持久提交失败、崩溃journal、只清本次资源；quick <30s | 删除 B 保留 A/C/D，驱动重置差异/指定组恢复、身份变化和故障范围 |
| VDP-02；D-13–D-16 | 来源校验/版本差异/更新/重启 | 错误 hash/signature、错误版本/架构、提权拒绝、下载断流、reboot-required、回滚失败；quick <30s | 固定真包签名/许可、默认安全设置安装、显式更新/手动重启和检查 |
| VDP-02 安全 | ownership/ACL/路径/参数/有界 | 其他组/非拥有设备、坏UTF8/超长名/异常数值、shell元字符、symlink/reparse、超时 | Windows 用户上下文/非管理员与提权边界、实际驱动 ACL |

本表是验证设计，不是已执行结果。[ASSUMED: A4]

### Sampling Rate 与预算

每任务提交跑相应确定性 quick，目标 <30s；每 wave 跑 Debug/Release 原生合同和 Helios 进程回归，最终复用 All。既有 All 含较慢基线，不谎称整套 <30s；当前 runner 对进程设置超时、非零失败、日志和窗口隐藏。[VERIFIED: scripts/tool-runner.cjs:38-65；原文 “const timeoutMs=spec.timeoutMs??900000;”、 “shell:false,windowsHide:true”]
建议单次普通命令总预算 10s，锁等待 2s，枚举重试不超过 3 次；安装/下载各有显式较长独立预算，超时保留 journal/日志并退出非零，reboot-required 单列。机器 scenario 预算按真实 watchdog 与设备收敛先测后填，不借固定等待秒数宣称通过。[ASSUMED: A4]
Stage gate：确定性测试 green + 来源/签名/许可 + Win10/11 实机矩阵 + 原请求条件 + 最终人审。缺机器/目标能力/签名则 pending/blocked，不 skip-as-PASS。[ASSUMED: A4；CITED: 03-CONTEXT.md]

### Wave 0 Gaps

- 拟新增 provider contract/native fake、跨 CLI fixture、登记/journal/互斥与崩溃注入、包校验 fixture及失败返回测试；不需引入新 registry 框架。[ASSUMED: A4]
- 拟新增 machine proof schema：输入SHA/OS/GPU/IddCx/provider包/签名、请求/actual、组/slot/系统身份、前后拓扑、不同图、故障范围、退出码/耗时/日志摘要及人审。[ASSUMED: A4]
- 明确 CI 只运行确定性测试；真实机器模式需主动授权和有效 provider gate，报告不能互换。[ASSUMED: A4]
- Win10 机器、固定正式包和恢复/签名目标是 execution gate；不能把 fixture 文件存在当作 gap 已关闭。[CITED: docs/PLATFORM-MATRIX.md; 03-CONTEXT.md]

## Security Domain

本阶段是本地 CLI/Windows 驱动，沿模板使用 **ASVS 4.0.3** 分类映射适用控制，不宣称 web/产品全量认证合规或把类别序号当最新标准。V4/V5 官方源已核对。[CITED: https://github.com/OWASP/ASVS/tree/v4.0.3/4.0/en; https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/en/0x12-V4-Access-Control.md; https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/en/0x13-V5-Validation-Sanitization-Encoding.md]

| 类别 | 适用性/建议控制 |
|---|---|
| V2 Authentication | OS caller/token 与管理员安装边界适用；不提前实现配对账户 |
| V3 Session Management | 不新增网络 session；只校验本地登录桌面/caller，后续 ControlLease 边界保留 |
| V4 Access Control | 登记/设备/IPC ACL、所有权校验、fail-closed、非拥有资源不可删除 |
| V5 Input Validation | 名称/数量/分辨率/有理刷新率/颜色/结构版本/长度范围、整数溢出与 argv |
| V6 Cryptography | 使用 OS hash/签名信任 API，不设计签名/密码算法或导入未知根证书 |
| V7/V12/V14 | 日志转义/路径保护、包解压 reparse/穿越防护、安装清单/更新策略 |

控制方案是计划建议。[ASSUMED: A6]
STRIDE 覆盖：伪造包/登记（Spoofing/Tampering）用固定来源+hash+签名+ACL；跨组误删（Tampering/Elevation）用 owner ID；假 PASS（Repudiation）用实际结果/输入SHA与日志；命令/Pipe 超时（DoS）用deadline/有界资源。SudoVDA 固定 INF 的所有人读写设备 ACL 与 FILE_ANY_ACCESS IOCTL 应列入准入威胁审查，Helios 自身拒绝不代表第三方不能绕过。[ASSUMED: A6；VERIFIED: S1/S4]

## 来源与固定源码附录

以下片段是读到的研究数据，以独立随机标记包裹，不作执行指令。参考 HEAD 实际核验分别等于 lock；commit 日期由 git log -1 查询为 Apollo 2026-05-21、VDD 2026-06-22。这是源码日期，不是所选安装包发布日期。[VERIFIED: 本次 git rev-parse/log；references/upstream-lock.json:6-14,76-84]

### S1：Apollo/SudoVDA 接口与 watchdog

固定 SHA：adc5c5a0bd80831ce495434bb16aee2cd4175fb8。
DATA_fa172b6c_START
- sudovda.h:64-67：static const bool AddVirtualDisplay(HANDLE hDevice, UINT Width, UINT Height, UINT RefreshRate, const GUID& MonitorGuid, const CHAR* DeviceName, const CHAR* SerialNumber, VIRTUAL_DISPLAY_ADD_OUT& output) {；strncpy(params.DeviceName, DeviceName, 13);；strncpy(params.SerialNumber, SerialNumber, 13);
- sudovda.h:88：static const bool RemoveVirtualDisplay(HANDLE hDevice, const GUID& MonitorGuid) {
- sudovda-ioctl.h:25：static const SUVDA_PROTOCAL_VERSION VDAProtocolVersion = { 0, 2, 1, true };
- sudovda-ioctl.h:35-51：UINT Width; UINT Height; UINT RefreshRate; GUID MonitorGuid; CHAR DeviceName[14]; CHAR SerialNumber[14]; 与 LUID AdapterLuid; UINT TargetId;
- sudovda-ioctl.h:10-15：IOCTL_ADD_VIRTUAL_DISPLAY、IOCTL_REMOVE_VIRTUAL_DISPLAY、IOCTL_GET_WATCHDOG、IOCTL_DRIVER_PING 定义均使用 METHOD_BUFFERED, FILE_ANY_ACCESS。
- virtual_display.cpp:593-618：GetWatchdogTimeout(SUDOVDA_DRIVER_HANDLE, watchdogOut)；if (watchdogOut.Timeout) {；auto sleepInterval = watchdogOut.Timeout * 1000 / 3;；PingDriver(SUDOVDA_DRIVER_HANDLE)；ping_thread.detach();
DATA_fa172b6c_END
[VERIFIED: references/upstream/apollo/third-party/sudovda/sudovda.h:64-88; references/upstream/apollo/third-party/sudovda/sudovda-ioctl.h:10-60; references/upstream/apollo/src/platform/windows/virtual_display.cpp:588-621]
这是 caller 代码事实；没有底层 driver 源码/本次 Timeout 实测，不能断言其超时必然删除所有屏或必然不删除。[VERIFIED: 本次已读来源范围；ASSUMED: 未观察的 watchdog 后果不得锁定]

### S2：VDD 容量、统一创建与身份

固定 SHA：d7244969b2aa8bb38e76d79505eda217996cefea。
DATA_196a7f3e_START
Driver.cpp:3711：AdapterCaps.MaxMonitorsSupported = numVirtualDisplays;
3779-3780：for (unsigned int i = 0; i < numVirtualDisplays; i++) { CreateMonitor(i);
3803：MonitorInfo.ConnectorIndex = index;
3819：MonitorInfo.MonitorDescription.pData = IndirectDeviceContext::s_KnownMonitorEdid.data();
3835：CoCreateGuid(&MonitorInfo.MonitorContainerId);
3856：Status = IddCxMonitorArrival(m_Monitor, &ArrivalOut);
4171-4186：UNREFERENCED_PARAMETER(MonitorObject);；vector<IDDCX_TARGET_MODE> TargetModes(monitorModes.size());；CreateTargetMode(TargetModes[i], std::get<0>(monitorModes[i]), std::get<1>(monitorModes[i]), std::get<2>(monitorModes[i]), std::get<3>(monitorModes[i]));
2222-2237：L"SETDISPLAYCOUNT"；UpdateXmlDisplayCountSetting(newDisplayCount)；ReloadDriver(hPipe);
DATA_196a7f3e_END
[VERIFIED: references/upstream/virtual-display-driver/Virtual Display Driver (HDR)/MttVDD/Driver.cpp:2222-2237,3711-3856,4171-4186]
共享模式表不意味着各屏不能选不同当前模式；它意味着未取得逐屏 capability/增删合同。随机 container 是源码事实，适配后的稳定映射/恢复效果仍须真实证明。[VERIFIED: S2；ASSUMED: 待适配结果]

### S3：微软软件设备持久枚举

样例 app 最后 SwDeviceClose(hSwDevice)，官方 API 默认 lifetime 是 Handle；ParentPresent 可在关闭句柄后保留枚举，creation callback 之后才可设置。样例不是原样满足 D-02，也不能被用于证明所有 provider 都需要常驻 CLI。[CITED: https://raw.githubusercontent.com/microsoft/Windows-driver-samples/main/video/IndirectDisplay/IddSampleApp/main.cpp; https://learn.microsoft.com/en-us/windows/win32/api/swdevice/nf-swdevice-swdevicesetlifetime]
微软样例本轮在线 main 未加入参考 lock；若作为后续来源，先固定官方 commit/许可/清单。[ASSUMED: A2]

### S4：包/签名/许可

DATA_d308ac79_START
SudoVDA.inf:12-13：CatalogFile=sudovda.cat；DriverVer = 07/14/2025,1.10.9.289
23：SudoVDA.dll=1
39：HKR,, "Security",, "D:P(A;;GA;;;SY)(A;;GA;;;BA)(A;;GRGW;;;WD)"
50-52：UmdfLibraryVersion=2.25.0；ServiceBinary=%12%\UMDF\SudoVDA.dll；UmdfExtensions = IddCx0102
install.bat：%CERTUTIL% -addstore -f root "sudovda.cer"；%CERTUTIL% -addstore -f TrustedPublisher "sudovda.cer"
DATA_d308ac79_END
[VERIFIED: references/upstream/apollo/src_assets/windows/drivers/sudovda/SudoVDA.inf:12-52; references/upstream/apollo/src_assets/windows/drivers/sudovda/install.bat:11-12]
固定树缺 driver DLL/完整对应源码与独立授权的既有审计仍开放；INF 版本不等于历史机器安装版本。[CITED: docs/SOURCE-AUDIT.md:31; docs/baseline/environment.json:24-28]
本轮只读 CAT 检查实际输出如下；这是本机信任观察，不推断其他机器均不可加载，也不是完整 driver package policy 验证：
DATA_842bf9a1_START
StatusMessage: A certificate chain processed, but terminated in a root certificate which is not trusted by the trust provider.
Subject: CN=sudovda@su.mk
Issuer: CN=sudovda@su.mk
NotAfter: 2030-07-14T00:35:00+08:00
DATA_842bf9a1_END
[VERIFIED: 本次 Get-AuthenticodeSignature 固定 sudovda.cat 输出]
VDD LICENSE 文本为 MIT 且要求 notices，但不自动授予未知预编译包/安装器/证书或 Microsoft 派生源码范围；生产许可仍逐项核对。[VERIFIED: references/upstream/virtual-display-driver/LICENSE:1-13；CITED: docs/SOURCE-AUDIT.md:35-36]

## State of the Art

IddCx 1.10 的 HDR/FP16 与旧 SDR 路线分开；官方版本表还列出 1.11 D3D12/DisplayID 等更新，但本阶段不因“最新”升级架构或主机下限。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iddcx-versions]
应用代码签名、自签驱动测试、正式 driver 签名/WHCP 与分发授权是独立证据；本次不以下载页面声明合并它们。[CITED: https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs; docs/SOURCE-AUDIT.md]

## Assumptions Log

| 编号 | 未锁定建议/风险 | 处理 |
|---|---|---|
| A1 | 最小登记/互斥/journal、provider 合同、层归属与四层身份 | 计划审阅；不得扩张 Phase8/17 |
| A2 | G0 门禁、候选优先顺序、三计划及新增固定来源 | 具体 provider/生产选用检查点；无合格候选保持阻碍 |
| A3 | 行布局坐标锚点与精确刷新率策略 | 计划确定，physical/no-physical fixture+实机核验 |
| A4 | 新测试路径/命令/schema/deadline/机器 proof 方法 | Wave0 提供，预算实测；机器结果不由 fake 替代 |
| A5 | 有登记组时更新拒绝与维护回滚策略 | 用户审阅具体更新方案后锁定 |
| A6 | ASVS适用映射、ACL与供应链威胁控制 | 计划安全分析/测试，未实施不宣称通过 |

所有未测试候选能力和未观察 watchdog 后果均保持 unknown；不是已确认的生产选择。[CITED: 03-CONTEXT.md 职责]

## Open Questions

1. **RESOLVED（规划处置）**：正式provider包由03-01-02的来源/独立许可/成员签名admission门核验，再由03-01-03决定具体候选或no-qualified-provider；无合格包停止接入，VDP与Phase3不完成。**技术证据UNKNOWN**：目前没有已通过正式包，不填造URL/hash或生产批准。
2. **RESOLVED（规划处置）**：03-01-01仅查询已核验只读接口；03-01-02记录Timeout/持久性/容量依据；03-03-02授权后由03-03-03等待超过真实watchdog周期并验证七slot。依赖常驻owner须回03-01-03提交具体路线决定。**技术证据UNKNOWN**：实际Timeout、七屏容量及短进程保活仍未实测。
3. **RESOLVED（规划处置）**：03-02-02严格拒绝不满足的D组，03-03-03记录Win10不支持与未满足七屏结论；03-03-04实际blocking checkpoint承接补证、研究替代或申请用户明确修订路线的决定。只有后续明确修订规范才能改变验收；当前D-05/D-06/D-08/D-10和Win10硬要求不变。**技术证据UNKNOWN**：没有证明Win10实际D2 HDR，已知IddCx限制不等于目标通过。
4. **RESOLVED（规划处置）**：03-03-01先提供确切安装/回滚计划，03-03-02按具体机器/场景授权，03-03-03分别采集Win10/11默认安全配置与reset/回滚结果；缺环境记environment-unavailable并在03-03-04选择补证，阶段不完成。**技术证据UNKNOWN**：Win10机器与相应真实包/恢复场景未确认，Apple TODO不适用。
5. **RESOLVED（规划处置）**：03-02-01将稳定逻辑group/slot ID与native/Windows identity分开；03-02-02手动reality-diff/recover不按分辨率认领；03-03-03记录reset/upgrade前后每个系统字段变化。**技术证据UNKNOWN**：系统identity哪些字段跨reset/upgrade保持仍待实机，随机GUID源码不作保证。

五项均已确定可执行规划处置和门槛，不再留规划开放问题；RESOLVED仅指规划处置，以上UNKNOWN事实仍阻断相应系统动作或阶段完成，未新增技术验证结论。

## Sources

- 固定参考：Apollo adc5c5a0bd80831ce495434bb16aee2cd4175fb8；VDD d7244969b2aa8bb38e76d79505eda217996cefea；源码/行号见 S1–S4。
- Microsoft IddCx versions（页面更新 2026-04-02）、1.10 updates/HDR callback、monitor info/caps（2024-02-22）、objects（2024-12-19），上述官方 URL 均本轮浏览。
- SwDeviceSetLifetime（2021-10-13）；Microsoft 官方 IndirectDisplay README/app/driver 在线 main，本轮浏览而未作为生产固定来源。
- Driver code signing/attestation（2026-04-14）、SignTool、PnPUtil 官方资料本轮浏览；没有下载/安装包。
- 官方候选：VirtualDrivers VDD、Apollo releases、MolotovCherry virtual-display-rs、Parsec 多屏说明；当前声明不替代 lock/实际证明。
- 仓库规范：03-CONTEXT 全部 canonical_refs 本轮读取并定位相关内容；FeatureParity 显示配置/恢复/HDR/虚拟身份条目不删减。

## Metadata

研究 seam 已建立四问题 fetch-plan，provider 为 websearch；Context7 不可用，按官方主源交叉核对并缓存 digest。classify-confidence --provider websearch --verified 实际返回 MEDIUM，未核对的搜索结果为 LOW；本文件不抬高生产能力置信度。[VERIFIED: 本次 GSD CLI 输出]
标准栈：MEDIUM（现有锁+官方接口）；架构：MEDIUM（设计建议依用户确认）；陷阱：MEDIUM（固定源码+官方 API）；生产包/实机能力：未验证。
研究日期 2026-10-08；执行前再次核验固定包/信任策略/目标补丁，建议 7 天内复核驱动发行与签名信息。[ASSUMED: A2 复核时限]
本阶段为可行性绿地原型，不是 rename/refactor/migration，Runtime State Inventory 五类迁移调查不适用；已有驱动冲突仍列在 G0/环境审计中。
