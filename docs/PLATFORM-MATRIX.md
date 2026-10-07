# 平台与验证矩阵

所有单元格描述目标或待验证路径，不表示功能已完成。最低客户端 OS/CPU 架构在 Phase 1 冻结，参考 [Flutter 支持平台](https://docs.flutter.dev/reference/supported-platforms)，同时审查所选媒体 SDK 的限制。

| 角色/平台 | 首版 | 原生职责 | 构建/验收环境 |
|------------|------|----------|--------------|
| Helios Windows 10 | 必须 | 捕获/编码、虚拟屏、输入、虚拟麦克风/摄像头、协调器 | Windows 10 独立实机/VM；GPU 场景需实机 |
| Helios Windows 11 | 必须 | 同上，验证现代摄像头路径及 HDR 条件 | Windows 11 实机 |
| Selene Windows | 必须 | 硬解、音频、输入、多窗多屏、采集、剪切板 | 当前 Windows + 客户端测试机器 |
| Selene macOS | 实现/构建必须；实机验证 TODO | VideoToolbox/Metal、设备采集、输入、外屏 | macOS/Xcode 工具链或 CI；Mac 实机验证 VFY-02 延后 |
| Selene iOS/iPadOS | 实现/构建必须；实机验证 TODO | 移动生命周期/权限、音视频、控制器、外屏能力 | macOS/Xcode 工具链或 CI；iPhone/iPad 实机验证 VFY-01 延后 |
| Selene Android | 必须 | MediaCodec/Surface、输入、采集、多 Display | SDK/NDK + 手机/平板实机 |
| Selene Linux | 必须 | 硬解/软解、音频、输入、Wayland/X11、多屏 | Linux CI + GPU 实机 |
| Helios Linux/macOS | TODO | 未来服务端平台实现 | 不计入 v1 完成 |

五端的实现范围都包含：配对、连接/重连、桌面和游戏、设备上行、动态码率、剪切板、实例切换、单流/设备允许的多流以及后台生命周期。Windows/Android/Linux 保留实机端到端验收；iOS/iPadOS、macOS 无实机，仅完成实现、目标工具链构建及可运行的自动化检查，实机功能/性能/安装验收延后到 VFY-01/VFY-02，不阻塞 v1。

证据必须区分“已实现”“构建/自动化检查通过”和“实机验证通过”。Apple 两端必须显示“未经实机验证”；模拟器和构建成功不能证明真实硬解、HDR、摄像头/麦克风、外屏或性能。缺少 Apple 构建工具链时记录独立环境缺口，不能将实机验证延期当作构建豁免。

## 能力条件

- 单屏设备可选择单流，也可在界面查看多个远程显示器；真实多物理显示器输出只在 OS 与设备提供对应接口时验证。iPad 外屏、Android 多 Display 与桌面多窗口分别设计，不能复制 Windows 行为。
- HDR/4:4:4/AV1/多声道依赖编解码器、输出 surface 和硬件；支持项需真实内容正确呈现，不支持项明确协商并说明。
- Linux Wayland 的全局输入/剪切板和移动系统后台采集限制需能力报告，遇到限制暂停并说明，不能后台无声失效。
- Windows 10 服务端能力不能整体被 Windows 11 API 绑定。MFCreateVirtualCamera [最低 build 22000](https://learn.microsoft.com/en-us/windows/win32/api/mfvirtualcamera/nf-mfvirtualcamera-mfcreatevirtualcamera)；Windows 10 摄像头接入需独立原型。
- 所有平台共享协议、租约、实例状态机和业务逻辑；OS 适配代码仍然必要，Monorepo 减少重复而非消除平台差异。

## 性能验收方法

Phase 1 固定同设备、同网络、同分辨率/帧率/codec 的参考测量脚本，Phase 6 和 10 收集基线后由关键节点确认 p50/p95 延迟、帧丢失、jitter、CPU/GPU、显存和功耗目标。初始化阶段不编造“低于 X ms”保证。

场景包括有线 LAN、Wi-Fi 抖动、受控丢包/RTT/带宽、1080p60 桌面、原功能允许的高帧率游戏、HDR 内容及至少两屏独立变化画面。能力范围内做多流资源上限、热插拔、睡眠唤醒和长时运行。

本版实机性能门禁覆盖 Windows/Android/Linux；iOS/macOS 保留测量接口与上述场景清单，真实性能结果在 VFY TODO 中补齐。

实例不停止验收：启动 A/B/C→控制 A→切 B→全断连→重新连接 C，检查应用继续运行与显示器组身份；显式停 B 后检查 A/C 不受影响。并发抢租约和迟到包必须验证。
