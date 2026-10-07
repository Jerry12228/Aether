# 平台与验证矩阵

所有单元格描述目标或待验证路径，不表示功能已完成。Phase 1 提出最低客户端 OS/CPU 架构候选供完整人审；框架声明、原生限制、目标构建与实机证据分开记录，具体媒体路径仍须后续原型验证。

## 版本化最低范围候选

本机缓存 Flutter 3.44.0 / Dart 3.12.0；采用 [Flutter 3.44 官方历史矩阵](https://github.com/flutter/website/commit/a43b0e7d3092b64db4933397aaddaed41f333ba1)，不将 [当前官网 3.47](https://docs.flutter.dev/reference/supported-platforms) 的 iOS15/macOS12 下限套给本机3.44。未来升级需重新审阅范围。

| 平台 | 3.44框架声明 / 候选最低 OS | 架构候选 | 原生/构建/硬件证据与责任 |
|---|---|---|---|
| Windows 客户端 | Windows 10/11 | x64、arm64 | Phase2/12/23/30 后端与双架构构建；无产品构建/实机证据 |
| macOS 客户端 | 10.15；框架范围至26 | x64、arm64 | Phase2/33 媒体/Metal/输入与目标构建；无构建执行器，硬件VFY-02 |
| iOS/iPadOS 客户端 | 13；框架范围至26 | arm64 | 固定Moonlight app构建target为15，不能证明Aether原生路径在13工作；Phase2/32验证；构建执行器缺口，硬件VFY-01 |
| Android 客户端 | API24；框架范围24–36 | arm32、arm64、x64 | 原Moonlight minSdk21：API21–23仍为v1差异，Phase2/14/31原型适配，未证实前不宣称支持 |
| Linux 客户端 | Debian10 / Ubuntu20.04 LTS；框架范围Debian10–13、Ubuntu20.04–24.04LTS | x64、arm64 | Phase2/34–35验证native工具链/VAAPI/窗口系统；原ARM32/实验RISC-V/板卡保留v1差异，不能因框架表没有就删掉 |
| Windows 10/11 主机 | 硬要求保留两代OS；具体最低build pending-prototype | x64候选，原生依赖待验证 | Phase3–5驱动/麦克风/摄像头验证后锁build；不能借Win11摄像头API或参考上游提高Win10下限 |

架构列指CPU指令集，性能级别、内存门槛和各codec/HDR最低硬件未实测。历史来源是官方框架范围声明，不是Aether端到端支持；最低候选不授权删除较旧原用户范围。原Qt Windows manifest的7/8/8.1兼容标签也不等于已验证其最低版本。本次平台差异必须在 [全基线审阅](BASELINE-REVIEW.md) 明确处理。

## 当前环境与机器缺口

[environment.json](baseline/environment.json) 记录14项只读查询、7个平台、11个机器/GPU条目及明确缺口；所有平台 buildEvidence/hardwareEvidence 为空。Quick约1.3秒完成，Node24.14/Git2.54/pwsh7.6.3/CMake4.4.3/Ninja1.12、VC组件、缓存Flutter/Dart、JDK17及AndroidSDK/NDK可查询；SDK19041/22621/26100同版本headers/libs/tools配套存在，WDK配套未验证。以上不是完成目标构建或许可审计。

原始注册表 ProductName 为Windows10 Enterprise LTSC2024，CurrentBuild26100，独立CIM Caption为Windows11企业版LTSC；保留诊断，当前机器不算Win10实机。NVIDIA RTX5080与AMD Radeon及驱动已枚举；虚拟适配器另保留原字段，没有编码/解码/三厂GPU验证。Win10目标、独立Windows/Android/Linux客户端、IntelGPU及ARM目标仍unconfirmed；macOS/Xcode/CI构建缺口独立于Apple硬件TODO。准备用途和责任阶段见环境台账，本阶段不安装缺失依赖。

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
