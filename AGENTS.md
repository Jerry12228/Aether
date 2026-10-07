<!-- GSD:project-start source:PROJECT.md -->

## Project

**Aether**

Aether 从零重构 Moonlight/Sunshine 所覆盖的远程桌面与游戏串流体验，以一个 Monorepo 维护 Helios 服务端、Selene Flutter 客户端、共享原生核心和平台适配。它服务需要跨设备访问 Windows 主机、使用本地麦克风/摄像头、扩展多个远程显示器并切换长期运行应用会话的用户。

**Core Value:** 让用户在五类客户端上低延迟、可靠地控制 Windows 主机，桌面工作和游戏都可用，断连或切换不破坏仍在运行的实例。

### Constraints

- **仓库**：Aether 单主仓库，Helios/Selene 单一产品版本体系；平台差异在仓库内适配。
- **技术**：Selene Flutter；Dart 负责界面、设置、会话操作；媒体热路径和系统集成在原生层。
- **协议**：在 NVIDIA GameStream 基础上重构扩展，以固定版本 Moonlight/Sunshine 源码核验基线；不可自行切换为从零选择 WebRTC/QUIC 整体替代。
- **兼容**：服务端 Windows 10/11 是硬要求；具体最低 build 在 Phase 1/3–5 验证后锁定，不能借参考上游提高最低版本。
- **能力**：不能以“重构”为由删除原功能；设备/OS 不支持时需能力协商、说明与证据。
- **资源**：并行流数受 GPU 编码会话、解码器、显存和带宽限制；需事前协商和可解释拒绝。
- **工作流**：细粒度阶段，通常每阶段 1–3 个计划；超过单一子系统或验收链路就拆阶段。
- **环境**：当前 Windows 工作站，无 iOS/macOS 实机。Apple 构建需 macOS/Xcode 工具链或 CI；实机功能/性能/安装验证进入 TODO，不作为 v1 发布阻碍。构建证据与实机证据分别记录，可请求用户安装依赖。
- **流程**：源码研究、计划检查、完成验证、Git 文档追踪开启；关键节点确认，不自动开始全部产品实现。

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

| 部件 | 建议 | 证据与置信度 | 决定阶段 |
|------|------|--------------|----------|
| 客户端 UI | Flutter/Dart 单应用 | 用户硬要求；官方支持五目标平台；高 | 已确认 |
| 核心 | C++20 + C ABI，CMake | 本地 Sunshine/Moonlight 原生代码与媒体 SDK 适配减少新语言边界；中 | 2 |
| 控制桥 | FFI + typed platform channels/Pigeon 候选 | [官方 FFI](https://docs.flutter.dev/platform-integration/bind-native-code)、[平台通道](https://docs.flutter.dev/platform-integration/platform-channels)；高 | 2 |
| 呈现 | 原生 GPU surface，Flutter 控制界面；Texture 优先测量 | 五平台零拷贝、HDR与多窗行为没有原型证据；中 | 2、10、15 |
| 媒体 | 系统硬解/硬编 + FFmpeg、Opus 候选 | 本地 Sunshine video/audio，Moonlight 各端后端；高方向，具体版本未锁 | 9–15 |
| 协议/传输 | 基于 NVIDIA GameStream 重构扩展，研究 RTSP、UDP/RTP/FEC 与控制/输入通道 | 用户已锁定基础；Moonlight/Sunshine源码可核验，具体多流/上行/安全细节待原型 | 基础已确认；细节6 |
| 虚拟显示器 | IddCx/IDD adapter，可替换 provider | [微软 IDD 模型](https://learn.microsoft.com/en-us/windows-hardware/drivers/display/indirect-display-driver-model-overview)，Apollo 调用 SudoVDA；高方向，provider 未定 | 3、17 |
| 虚拟麦克风 | 可注入 PCM 的 Windows capture endpoint | Virtual Audio Driver 源码仅候选；README 声明 beta/test-signing，不能直接作为发布依赖；中 | 4、21 |
| 虚拟摄像头 | Win11 MF MediaSource；Win10 独立方案 | [微软 API 最低 22000](https://learn.microsoft.com/en-us/windows/win32/api/mfvirtualcamera/nf-mfvirtualcamera-mfcreatevirtualcamera)，本地微软示例；高 | 5、22 |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `$gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `$gsd-debug` for investigation and bug fixing
- `$gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `$gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

## Aether Repository Rules

- Start with [.planning/STATE.md](.planning/STATE.md), then the current phase and its directly relevant documents. The user approved the roadmap on 2026-10-07; Phase 1 baseline audit and final human review are complete. Phase 2 is ready to plan; no product implementation phase has run.
- Use [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/SESSION-MODEL.md](docs/SESSION-MODEL.md) for design boundaries. This is a greenfield repo, so there are no production code patterns to infer yet.
- Preserve the entire applicable [original feature matrix](docs/FEATURE-PARITY.md). Newly discovered missing original abilities enter v1, not the TODO backlog by default.
- Keep Flutter UI and native realtime/system paths separate; one Selene app and shared contracts live in the Aether monorepo.
- Reference checkouts under references/upstream are ignored research material. Do not commit them as submodules, edit them as product code, or route GSD product commits to them.
- All virtual display groups and instances persist across disconnect/switch until explicit stop; host control lease is globally unique in the shared Windows login desktop.
- Work in small phases and request only concrete critical decisions. Current workflow is interactive, sequential, with research, plan checks and verification enabled; do not automatically start all phases or spawn agents without applicable authorization.
- Keep candidate technologies distinguishable from user-confirmed constraints and tested outcomes. Do not mark a platform/driver supported solely because an API exists or a Flutter skeleton runs.
