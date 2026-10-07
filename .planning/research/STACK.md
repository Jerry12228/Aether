# Stack research

研究日期：2026-10-07。方式：当前 agent 内联研究、本地固定 SHA 源码及官方文档；未运行产品原型。

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

版本原则：固定已验证版本及构建选项。初始化不把参考 HEAD 或网上最新版本直接定义为生产依赖，也不填未经验证的库版本。Phase 1 工具清单，Phase 2/6 后依赖锁定。

避免：Dart 逐帧搬运数据、Qt 与 Flutter 双 UI、每平台重写协议、自己实现密码学/codec、使用仅 Windows 11 的 API 覆盖整个 Windows 10/11、未评估许可的二进制驱动。
