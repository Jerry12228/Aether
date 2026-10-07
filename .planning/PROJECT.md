# Aether

## What This Is

Aether 从零重构 Moonlight/Sunshine 所覆盖的远程桌面与游戏串流体验，以一个 Monorepo 维护 Helios 服务端、Selene Flutter 客户端、共享原生核心和平台适配。它服务需要跨设备访问 Windows 主机、使用本地麦克风/摄像头、扩展多个远程显示器并切换长期运行应用会话的用户。

## Core Value

让用户在五类客户端上低延迟、可靠地控制 Windows 主机，桌面工作和游戏都可用，断连或切换不破坏仍在运行的实例。

## Requirements

### Validated

- ✓ BASE-01/02/03：固定来源与逐文件许可/渠道审计、七平台原功能与独立计划案例、真实环境及测量方法、两个人审检查点 — Phase 1。

这是基线审计交付；所有产品功能仍未实现，生产复用许可、目标构建、硬件和性能支持尚无批准或实测结果。

### Active

- [ ] Windows 10/11 Helios 与 Windows/macOS/iOS/Android/Linux Selene。
- [ ] 保留原串流、桌面、游戏、管理、输入、发现及诊断能力，逐项建立验收证据。
- [ ] 客户端麦克风与摄像头上行，并在 Windows 普通软件中作为系统设备使用。
- [ ] Apollo 式虚拟显示器体验；每实例独立稳定显示器组；多客户端显示器可请求多条独立视频流。
- [ ] 同一 Windows 登录桌面允许多个长期运行应用会话，主机同时只有 0–1 个实例被控。
- [ ] 切换、断连不会停止实例；只有显式停止请求结束实例及其拥有资源。
- [ ] 会话不中断的手动码率修改和可选自动修正。
- [ ] 双向剪切板同步。
- [ ] 在 NVIDIA GameStream 基础上重构并扩展协议，覆盖双向媒体、多流与实例控制；不要求旧端互通。
- [ ] 明确 Flutter/原生责任，统一产品代码、契约、测试和发布，降低多端维护成本。

### Out of Scope

- 旧 Moonlight/Sunshine/GameStream 协议互通：不要求旧端兼容；基于 GameStream 的 Aether 重构扩展独立版本化。
- 首版 Linux/macOS 服务端：保留平台接口，进入 TODO。
- 首版 iOS/iPadOS、macOS 客户端实机验证：用户没有实机，实机功能/性能/安装验收进入 TODO；实现、构建和可运行的自动化检查仍属 v1。
- 首版内置 WireGuard/OpenVPN、文件互传、打印机重定向：用户明确标记 TODO。
- 多 Windows 登录桌面、虚拟机/沙箱隔离和多个实例同时远程被控：用户明确同桌面且主机最多一个实例被控。
- 浏览器、tvOS 等额外客户端目标：未列入指定五平台；原功能对照中的设备特有能力单独标识，不静默删除。

## Context

- 原问题：功能分散在多个端仓库、缺少上行外设、多屏和会话管理能力。
- 参考：Sunshine、Moonlight Qt/common-c/Android/iOS、Apollo、Virtual Display Driver、Virtual Audio Driver、微软 Windows-Camera。固定 SHA 见 references/upstream-lock.json。
- 项目是 greenfield；参考 clone 是研究资料，不是 brownfield 产品代码。
- 用户已确认上行外设必须可供普通 Windows 软件选择；实例是独立应用会话，由主机协调器仲裁。
- 用户已确认全部非 TODO 功能和五端纳入首个完整版本；开发顺序先打通 Windows。
- 用户补充确认 iOS/iPadOS、macOS 仅实机验证延后，保留两端实现与构建；不能把验证延后解释为取消客户端支持。
- 研究发现：虚拟显示器不隔离窗口/焦点/音频；Windows 10 虚拟摄像头不能直接沿用 Windows 11 MFCreateVirtualCamera；虚拟设备签名与合法分发必须早期验证。

## Constraints

- **仓库**：Aether 单主仓库，Helios/Selene 单一产品版本体系；平台差异在仓库内适配。
- **技术**：Selene Flutter；Dart 负责界面、设置、会话操作；媒体热路径和系统集成在原生层。
- **协议**：在 NVIDIA GameStream 基础上重构扩展，以固定版本 Moonlight/Sunshine 源码核验基线；不可自行切换为从零选择 WebRTC/QUIC 整体替代。
- **兼容**：服务端 Windows 10/11 是硬要求；具体最低 build 在 Phase 1/3–5 验证后锁定，不能借参考上游提高最低版本。
- **能力**：不能以“重构”为由删除原功能；设备/OS 不支持时需能力协商、说明与证据。
- **资源**：并行流数受 GPU 编码会话、解码器、显存和带宽限制；需事前协商和可解释拒绝。
- **工作流**：细粒度阶段，通常每阶段 1–3 个计划；超过单一子系统或验收链路就拆阶段。
- **环境**：当前 Windows 工作站，无 iOS/macOS 实机。Apple 构建需 macOS/Xcode 工具链或 CI；实机功能/性能/安装验证进入 TODO，不作为 v1 发布阻碍。构建证据与实机证据分别记录，可请求用户安装依赖。
- **流程**：源码研究、计划检查、完成验证、Git 文档追踪开启；关键节点确认，不自动开始全部产品实现。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Aether Monorepo；Helios/Selene 命名 | 用户指定，减少仓库与契约分叉 | 已确认 |
| Flutter UI + 共享原生核心 + 薄平台层 | 统一交互，同时保留低延迟和平台硬件能力 | 边界已确认；技术原型待验证 |
| 基于 NVIDIA GameStream 重构扩展，无旧端兼容承诺 | 用户于审阅时明确协议基础；在现有串流分层上扩展双向媒体、多流及控制权 | 已确认 |
| 实例生命周期独立于连接生命周期 | 断连、切换后继续运行 | 已确认 |
| 主机全局控制租约，0–1 实例被控 | 同一登录桌面的系统输入/焦点共享 | 已确认 |
| 麦克风和摄像头均接入系统设备 | 会议软件和游戏能直接使用 | 已确认 |
| 先 Windows 垂直闭环，五端均为 v1 必须项 | 降低前期集成风险，不缩小最终范围 | 已确认 |
| iOS/iPadOS、macOS 仅实机验证延后 | 用户无实机；两端实现、构建和可运行的自动化检查保留，真实硬件结果不冒充完成 | 已确认 |
| 原生核心候选 C++20 + C ABI | 参考实现和 Windows/媒体 SDK 复用成本低 | 建议；Phase 2 锁定 |
| GameStream 重构细节、驱动供应、具体生产许可证/渠道 | 协议基础已确定；Phase1已提供来源证据及路线意向，实际通道/驱动/生产选用仍待原型和清单核验 | 待 Phase 2–6及生产选用前决定 |
| compatible-open-source与retain-candidates | 用户选择兼容开源复用路线、暂不考虑发行；GPL-3.0-or-later仍候选，未知许可/签名/渠道阻碍保留 | Phase1已确认意向，未批准具体生产复用 |
| 经授权只读观察者、唯一控制租约 | 保留Apollo适用原能力；观察者不输入/上行/改变会话，预算独立协商，断连仅释放本流 | Phase1人审确认；Phase6/20/37实施验证 |
| 最低客户端候选与额外原目标 | Flutter3.44范围仅候选，AndroidAPI21–23及Linux额外架构保留v1差异；Win10/11主机build待原型 | Phase1人审确认候选，原生支持未验证 |
| VS2026集成WDK已安装、测量方法已审阅 | 本机WDK28000同版本组件与集成文件核验；零产品测量，性能SLO待Phase6/10实测 | Phase1安装证据已核验，构建/硬件/精度仍待验证 |

## Evolution

每个阶段完成后更新已验证需求、阶段证据、关键决策和阻碍；不能把源码研究当作产品验证。里程碑结束时完整审视范围和原功能对照。新增差异必须同时更新需求、路线图、能力矩阵及测试，TODO 进入 docs/BACKLOG.md。

---
*Last updated: 2026-10-07 after Phase 1 baseline execution and final human review*
