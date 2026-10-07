# 原功能保留基线

基线日期：2026-10-07，参考 SHA 见 upstream-lock.json。下表为初步盘点，不是完整审计，也不是已实现声明。Phase 1 必须结合所有目标平台的源代码、设置项和文档扩充逐项条目，并将新增用户能力补入 v1 需求与路线图。

“不砍功能”以指定五平台与 Windows 服务端上的原用户能力为边界，不要求旧 wire protocol、旧 UI、旧内部组织结构原样保留。硬件/OS 特有功能需明确标记适用范围，不能静默删除或用模糊“降级”关闭需求。

用户已批准仅延后 iOS/iPadOS、macOS 实机验证。两端功能仍逐项实现并记录构建/自动化证据，硬件对应结果标记 VFY-01/VFY-02 TODO，不以“实机验证通过”闭合；该验证例外不允许删除功能或豁免构建。

| 能力族 | 初步来源锚点 | 规划验收阶段 |
|--------|--------------|--------------|
| 桌面/应用/游戏启动、恢复和显式退出 | Sunshine src/process.cpp；Moonlight app/backend | 8、27、37 |
| 配对、发现、手工添加主机、权限撤销 | Sunshine src/nvhttp.cpp、confighttp.cpp；Moonlight backend | 7、27、36 |
| 物理/虚拟显示器捕获、分辨率/刷新率 | Sunshine src/platform/windows；Apollo virtual_display.cpp | 9、17–19 |
| H.264/HEVC/AV1，软解/硬解、软编码/硬编码 | Sunshine video.cpp/nvenc；Moonlight app/streaming/video | 9、10、13、14、28–35 |
| HDR/10-bit、YUV 4:4:4、色彩元数据与呈现 | Moonlight Qt README 和视频后端 | 15、28–35 |
| 立体声/5.1/7.1，音频设备与静音选择 | Moonlight app/streaming/audio；Sunshine audio.cpp | 12、28–35 |
| 游戏相对鼠标/捕获、桌面绝对坐标、键盘快捷键 | Moonlight app/streaming/input | 11、28–35 |
| 多手柄、震动、运动、触摸板、特殊 HID 扩展 | Moonlight input/gamepad；Android ControllerHandler；Sunshine libvirtualhid | 1、16、28–35、37 |
| 多点触控、屏幕手柄、外接键鼠、笔能力 | Moonlight Qt 输入；Android touch/virtual_controller；iOS Input | 16、28、32、37 |
| 窗口/全屏、缩放、帧 pacing、V-sync、统计 | Moonlight Qt session/video/pacer；移动视频呈现 | 10、19、28–35、36 |
| 应用封面/列表、设置、托盘/服务、自启动、准备/清理命令 | Sunshine 配置/管理；Moonlight backend/settings | 8、27、39 |
| IPv4/IPv6、互联网直连、WoL、网络诊断 | Moonlight common-c、Moonlight 各端网络层 | 7、36 |
| 配置导入导出、日志、升级/卸载和故障排查 | Sunshine/Moonlight 文档及打包脚本 | 27、36、39–42 |
| Apollo 自动匹配虚拟屏、固定身份、剪切板 | Apollo README 与 src/platform/windows | 17、20、25、26 |

Phase 1 的正式矩阵需包含：功能 ID、平台、原源码/设置位置、最低 OS/硬件条件、Helios/Selene 所属层、需求 ID、阶段、测试案例与最终证据。存在许可/驱动不可用时登记阻碍，不能标记已保留。

Moonlight Qt 初步检查可见 H.264/HEVC/AV1、HDR、4:4:4、7.1、多点触控和最多 16 手柄的声明，实际可用性受平台/硬件影响。此处信息来自本地已克隆 README 与源码；发布前验证承诺，不能用支持一种手柄取代全部原输入能力。

Phase 37 做逐行原功能复审，Phase 42 做最终发布门禁。每条必须满足本版规定的实现/构建/测试验收、明确平台不适用且有证据，或记录已批准的 Apple 实机 TODO；不允许留下无说明的功能缺失项。Apple 实机验证后续独立闭合。
