# Phase 2: Monorepo 与 Flutter/原生骨架 - Context

**Gathered:** 2026-10-07 (Asia/Singapore)
**Status:** Ready for planning
**Requirements:** CORE-01, CORE-02, CORE-03

<domain>
## Phase Boundary

从一个主仓库入口构建 Windows Helios 和唯一 Selene Flutter 应用的骨架，共享模块与单一产品版本来源。共享核心不依赖 Qt 或 Flutter；验证原生边界的句柄创建/释放、错误回调、停止、所有权、线程和取消契约；建立五平台 adapter 的统一接口与 Windows 构建 CI，并记录 texture/surface 原型结论。

本阶段的测试图与自检用于本地骨架验证。实际协议、编解码、驱动、远程会话和五端完整产品功能按已批准路线图逐阶段实现，不能将本地骨架成功写成这些功能已支持。

</domain>

<decisions>
## Implementation Decisions

### Selene 骨架演示

- **D-01:** 首屏采用原生验证面板，展示核心版本、能力和运行状态，提供创建/释放句柄、启动/停止测试画面的操作。
- **D-02:** 打开面板自动初始化原生核心，立即可查看版本与能力；测试画面由用户手动启动。
- **D-03:** 原生测试画面采用可手动切换的静态测试图，包含色条、网格和文字。明确标注为本地原生呈现测试；性能结论由测量记录提供。
- **D-04:** 窗口尺寸变化时保持测试图比例，完整显示并留边。

### Helios 启动与退出

- **D-05:** 开发骨架为前台控制台程序，显示版本、初始化状态与诊断信息，通过 Ctrl+C 请求正常退出。
- **D-06:** 正常启动完成初始化后保持运行，等待退出；自检通过独立入口触发，供本地和 CI 使用。
- **D-07:** 本地运行初始化失败时显示错误并等待按键确认；正常退出完成清理后也保留最终结果并等待按键，再结束进程。
- **D-08:** 自动化运行始终直接退出，成功/失败通过退出码表达，失败为非零；不等待交互输入。

### 生命周期与错误反馈

- **D-09:** Selene 核心初始化失败时保留窗口，在面板内显示原因与诊断详情，提供重试，禁用依赖核心的操作。
- **D-10:** 核心已初始化但画面启动失败时，保留核心，清理失败的呈现资源，允许单独重试画面；版本与能力仍可查看。
- **D-11:** 关闭 Selene 窗口时自动停止本地测试画面、释放原生资源并退出；清理失败留下诊断记录，无额外退出确认框。
- **D-12:** 验证面板默认显示状态和最近错误；错误码、生命周期事件及详细日志可展开查看。
- **D-13:** 上述本地资源清理不改变已批准的主机会话语义：未来客户端断连/切换不得隐式停止实例、应用或显示器组；显式 StopInstance 与 Disconnect 分开。

### 开发与构建体验

- **D-14:** 主仓库提供统一构建入口，日常构建必须明确选择 Helios 或 Selene；共享核心随所选目标构建，不默认构建双端。
- **D-15:** 构建与验证分别执行：构建命令专注所选目标，独立验证入口执行共享契约检查；CI 执行完整必需检查。
- **D-16:** 构建/自检的终端输出为简洁摘要，包含成功/失败、产物及日志路径；详细日志保存到文件，便于排查和留存证据。
- **D-17:** Windows CI 在 PR 和主分支提交时自动构建双端并执行必需检查，同时支持手动触发。

### 继承的已确认约束

- Aether 为单一 Monorepo、Helios/Selene 采用单一产品版本体系；Selene 为一个 Flutter 应用，Dart 负责 UI/设置/会话操作，原生层负责媒体热路径与系统集成，不逐帧传递视频或 PCM 到 Dart。
- Windows 10/11 Helios 是硬要求，不能因为工具链或参考上游提高主机最低版本；具体最低 build 由后续原型证据锁定。
- 五客户端目标及完整原功能范围保留；Flutter 3.44 与客户端最低版本仍为候选，Android API21–23 和 Linux 额外原目标差异仍属 v1。
- Apple 实现、目标构建和可运行的自动化检查仍属 v1；仅实机功能/性能/安装验收为 VFY-01/VFY-02 TODO，本阶段 Windows 骨架不能替代 Apple 构建证据。
- 全主机至多一个有效 ControlLease；授权只读观察者不具有输入、上行设备或实例/拓扑变更权限，各读流独立计入预算。完整仲裁留在对应实施阶段，本阶段契约不能与这些边界冲突。
- 协议基础为 NVIDIA GameStream 重构扩展，无旧端互通要求；本阶段不自行改成 WebRTC/QUIC 整体替代。
- Phase 1 的 compatible-open-source / retain-candidates 是路线意向，具体生产依赖与许可尚未批准；references/upstream 是忽略的研究资料，不隐式链接、复制为产品代码或提交为子模块。
- 研究、计划检查、验证和 Git 文档追踪开启，通常拆为 1–3 个小计划；讨论完成后进入规划，不自动执行产品实现。

### 研究与规划裁量及待验证事项

用户没有新增“你决定”答复；以下是本阶段原有研究/规划职责，不应写成用户已选定或已验证的技术结果：

- C++20 + C ABI + CMake 为核心候选；FFI 与 typed platform channels/Pigeon 的分工、绑定生成方式、依赖锁与单一版本来源形式由研究/规划具体化。
- 定义句柄所有权、线程与事件交付、错误/取消/停止、销毁后回调及重复操作行为；计划必须覆盖 CORE-02 的真实跨边界验证，不能只有 UI 演示。
- 原生 GPU Texture 优先测量，必要时采用原生 surface 与 Flutter 控制界面；必须记录 texture/surface 对照及限制、HDR/多窗风险和证据。静态图选择不取消 roadmap 要求的呈现原型研究，也不构成性能通过。
- 五平台 adapter 接口、组件目录与测试入口按现有架构边界组织；非 Windows 接口/占位不能宣称目标实现或构建通过。
- 交互/自动化模式区分、构建命令名称、日志位置、诊断字段、清理有界性和测试图具体尺寸由规划确定；自动化路径不得因按键等待而挂住。
- 本机 VS2026/WDK 已安装仅是组件存在证据，仍需真实原生构建与干净 checkout 构建；缺失依赖按 docs/DEVELOPMENT.md 给出组件、用途和版本/来源，保留未解决环境 gap。

</decisions>

<canonical_refs>
## Canonical References

**研究与规划必须读取以下规范文件，并按标注定位直接相关内容。** 本轮无新增外部规范引用。

### 范围与工作流

- `.planning/PROJECT.md` — 已确认产品约束、技术候选与五端/Apple 验收例外。
- `.planning/REQUIREMENTS.md` — CORE-01/02/03 与原功能补充需求。
- `.planning/ROADMAP.md` — Phase 2 目标、成功标准与后续阶段边界。
- `.planning/STATE.md` — Phase 1 完成状态、既有决定、阻碍与环境 gap。
- `README.md` — 主仓库目录边界与统一产品入口。

### 架构与生命周期

- `docs/ARCHITECTURE.md` — Flutter/共享核心/平台插件责任表、呈现候选与构建组织。
- `docs/SESSION-MODEL.md` — 实例/连接/租约/显示器生命周期、观察者与资源预算边界。

### 基线与环境

- `docs/DEVELOPMENT.md` — 开发工具、依赖请求、目标构建与实机证据的区别。
- `docs/FEATURE-PARITY.md` — 完整原功能映射；不能以骨架或重构为由删减。
- `docs/PLATFORM-MATRIX.md` — 原目标与 Flutter 候选范围差异及待验证状态。
- `docs/BASELINE-REVIEW.md` — Phase 1 人审决定、未关闭阻碍与基线边界。
- `docs/baseline/environment.json` — 已审阅环境快照、实际工具组件及未验证构建/硬件 gap；禁止自动覆盖已确认快照。

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `scripts/doctor.cjs`、`scripts/doctor.ps1` — 已有有界环境探测与脱敏诊断，可供构建前依赖说明参考；不是原生构建证明。
- `scripts/validate-planning.cjs` — 已有需求、阶段依赖、文档引用和参考锁检查。
- `scripts/validate-baseline.cjs`、`tests/doctor.test.cjs`、`tests/planning.test.cjs` — 已有基线/工具验证入口，产品契约与构建检查需新增。

### Established Patterns

- 当前为 greenfield：没有 Helios、Selene、Flutter 插件或共享原生核心的生产代码模式，没有 codebase map；既有 Node/PowerShell 工具用于文档与基线维护。
- 基线区分来源研究、工具存在、目标构建和实机功能/性能证据，保留 unavailable/待验证原因，不伪造支持结论。
- 生产依赖独立锁定来源，研究 checkout 不进入产品构建。

### Integration Points

- `apps/helios/` 与 `apps/selene/` — 规划中的双端入口，本阶段建立骨架。
- `native/core/`、`native/platform/`、`packages/selene_native/` — 规划中的共享核心、平台薄适配和 Flutter 原生桥。
- `protocol/` — 既定共享契约目录；本阶段不能提前锁定 Phase 6 线协议。
- `scripts/`、`tests/` 及 Windows CI — 接入目标选择、独立验证和干净 checkout 构建。

</code_context>

<specifics>
## Specific Ideas

- 静态色条/网格/文字用于观察颜色、比例、清晰度和窗口缩放；用户明确选择静态方案。
- 本地 Helios 在成功与失败退出后均保留最终结果供按键确认；自动化必须无交互返回。
- Selene 开发验证页面保持简洁，详细诊断按需展开；不提前锁定最终客户端导航与视觉风格。

</specifics>

<deferred>
## Deferred Ideas

无新增跨阶段功能想法，本轮讨论保持在 Phase 2 范围内。既有 TODO 和后续产品能力沿用已批准路线图，不因本轮骨架选择而延后或删除。

</deferred>

---

*Phase: 02-monorepo-flutter*
*Context gathered: 2026-10-07*
