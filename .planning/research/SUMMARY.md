# Aether research summary

2026-10-07，内联研究完成初步建议；未编译参考项目或验证硬件/驱动性能。

已克隆九个参考仓库，完整列表与固定提交见 references/UPSTREAM.md 和 upstream-lock.json。主项目为空仓库，从零建立产品实现；不继续维护旧多端产品仓库。

核心建议是 Flutter 统一客户端交互，共享 C++ 原生核心候选处理实时路径，薄平台 adapter 接系统 codec、surface、设备和输入。Helios 用主机级协调器拥有唯一控制租约、实例登记和显示器资源，再委派工作进程。

用户审阅后明确协议在 NVIDIA GameStream 基础上重构扩展，放弃此前整体 WebRTC/QUIC 选型方向。以固定 Moonlight/Sunshine 开源实现核验会话、媒体、控制与输入基线，扩展双向媒体、多流、码率和租约；无需旧端兼容。具体方案见 docs/PROTOCOL.md。

用户进一步明确：iOS/iPadOS、macOS 实现与构建保留在 v1，仅实机功能/性能/安装验收延后到 VFY-01/VFY-02 TODO。两端不得声称已实测；Apple 构建工具链与自动化证据仍须准备，实机验证缺口不阻塞本版。

必须先消除三个高成本未知：虚拟显示器 provider 的稳定多组/签名能力；能向 Windows capture endpoint 注入 PCM 的麦克风路径；Windows 10/11 对普通软件可见的虚拟摄像头路径。摄像头现代 API 最低 Windows build 22000，因此 Windows 10 独立验证不可省略。[微软 API 说明](https://learn.microsoft.com/en-us/windows/win32/api/mfvirtualcamera/nf-mfvirtualcamera-mfcreatevirtualcamera)。

同一 Windows 桌面没有实例间窗口/音频/焦点隔离；虚拟显示器组提供资源所有权和捕获映射。断连/切换保留实例及显示器组，显式停止才清理；Windows 重启/注销不属于普通断连。

推荐路线图先做早期可行性与 Windows 单流闭环，再依次扩展原功能、多屏、控制权、上行、码率与剪切板，最后完成五端适配和正式交付。每阶段目标小、验收明确；原能力清单与 TODO 都被独立追踪。

尚待锁定：生产依赖版本、核心具体语言/ABI方案、GameStream通道/安全/多流与上行重构细节、驱动 provider、来源许可与分发路径、各端最低 OS/架构、真实性能门槛、可用 GPU/Android/Linux 测试环境与 Apple 构建工具链/CI。Apple 实机验证已批准延后。初始化不把剩余假设表述为已经实现或已经验证。
