# 开发环境与依赖

初始化只克隆参考仓库、读取代码并创建文档；没有安装驱动、修改系统启动设置或执行参考项目安装脚本。参考子模块未递归下载，不能把这些 checkout 当作完整可构建上游工程。

## 当前探测

2026-10-07 在当前工作站 PATH 找到 Git、Node（mise shim）、Python（pyenv shim）、Flutter（D:/Program/FlutterSDK/flutter/bin）、CMake。找到命令不等于 SDK 可用；Flutter 版本命令响应情况和 MSVC/SDK/WDK 在 Phase 1 doctor 中进一步核查。当前文档检查以 Node/Git 为基础，不依赖 Flutter 构建。

## 有界只读 doctor

```powershell
pwsh -NoProfile -File scripts/doctor.ps1 -Mode Quick -Output docs/baseline/environment.json
# Deep 扩大总预算，不安装、联网修复或执行 Flutter bootstrap。
pwsh -NoProfile -File scripts/doctor.ps1 -Mode Deep -Output docs/baseline/environment.json
node --test --test-name-pattern="doctor runner" tests/doctor.test.cjs
```

Quick 总预算 25 秒，Deep 45 秒，单项最多 5 秒，每个输出流最多保存 64 KiB；后续项超预算记为 not-probed。超时只取消本次启动的进程树。可执行文件使用绝对路径和参数数组；cmd/bat 仅允许白名单固定版本参数，支持带空格路径并拒绝 shell 元字符。环境变量仅用于白名单工具路径解析，不转储环境；用户名目录及凭据脱敏后才保存。

available 是具体查询或缓存证据可用，missing/failed/timeout/empty/not-probed 均保留原诊断；发现 PATH 命令不等于可用。Flutter 只读已有缓存版本和运行已有 Dart，不运行可能下载的 wrapper。VC 使用 vswhere 的 C++ 组件过滤；SDK/WDK 检查同版本 headers、libs 和 tools，headers 单独存在不算完整。工具检查不是目标构建或实机功能证明。已确认环境快照禁止被 doctor 自动覆盖，须先明确重开审阅。

## 分阶段依赖（准备要求）

| 用途 | 需要 |
|------|------|
| 文档/参考管理 | Git、Node 或 Python |
| Windows UI/共享核心 | 经锁定 Flutter/Dart、CMake/Ninja、Visual Studio C++ 工具链、Windows SDK |
| Windows 虚拟设备原型 | 对应 WDK/SDK、测试环境；正式签名与分发来源独立核实 |
| 媒体 | 锁定 FFmpeg/Opus 候选、GPU SDK/头文件；具体构建特性与来源记录 |
| Android | Android SDK/NDK/JDK/Gradle，真实硬件解码与采集设备 |
| macOS/iOS 实现与构建 | macOS/Xcode/Apple SDK 工具链或 CI、所需签名账户；保留构建与可运行的自动化检查，Windows 本机不能替代目标工具链 |
| macOS/iOS 实机验收（TODO） | 当前无 Mac/iPhone/iPad 实机，VFY-01/VFY-02 延后；不阻塞首版，不宣称硬件结果已验证 |
| Linux | C/C++ 工具链、Flutter desktop 依赖、硬解/音频/窗口系统开发包 |

缺失时提出包含组件、用途、版本/下载来源的安装请求；不批量安装未知工具。driver 原型能运行不代表可在默认安全配置设备上发布。

## 参考代码

当前 clones 在 `references/upstream`，固定提交在 `references/upstream-lock.json`。恢复方式由 `scripts/sync-upstream.ps1` 提供，只克隆缺失 checkout 或检查 SHA，不覆盖已有改动。若需要完整构建某参考工程，另行初始化它实际需要的子模块并记录来源。

产品依赖将锁在主仓库正常构建清单中，不从本地参考目录隐式加载。没有安装 Qt 的需要，除非专门构建 Moonlight Qt 做行为对照。

## 当前文档验证

```powershell
node scripts/validate-planning.cjs
```

该命令检查 v1 需求唯一性、每项恰好映射一个阶段、阶段依赖、验收字段、本地文档链接和参考锁格式。它不能替代产品构建、性能测量或真实平台测试。

## 基线检查与性能记录

```powershell
node scripts/validate-baseline.cjs --environment
node scripts/validate-baseline.cjs --features --report docs/FEATURE-PARITY.md
node scripts/validate-baseline.cjs
node scripts/validate-baseline.cjs --review --report docs/BASELINE-REVIEW.md
# 最终人审记录明确确认后才运行严格门禁。
node scripts/validate-baseline.cjs --review --require-review --report docs/BASELINE-REVIEW.md
node --test tests/baseline-sources.test.cjs tests/baseline-features.test.cjs tests/doctor.test.cjs
# 以下文件由实际仪器采集后创建；仓库目前没有性能样本。
node scripts/validate-baseline.cjs --measurement docs/baseline/measurements/actual-lan.json
node scripts/validate-baseline.cjs --measurement docs/baseline/measurements/actual-lan.json --compare docs/baseline/measurements/previous-lan.json
```

测量输入只能用仓库相对路径（或显式测试 root），禁止绝对路径、`..`、reparse/symlink 逃逸。无参数检查 sources/features/environment 全链；review.pending 可生成报告供审阅，严格门禁必须引用明确的人类决定及保留缺口。测量/比较的失败非零退出并给出诊断；空样本正常返回 measurementStatus=unavailable、空 summary 和逐指标原因，不产生 0ms/p95。p50/p95 使用排序后的 nearest-rank（ceil(n*p)−1 索引），分别按 metric/unit 分组，同时保留样本数和失败数。不可直接把 RTT、overlay 估计、解码时长相加当端到端延迟。

1. 选择 lock 中的固定 Moonlight/Sunshine 来源；构建参考时先核实完整子模块/依赖及许可，不运行未知安装脚本。记录 repo、40位 commit、真实二进制 SHA256（`Get-FileHash -Algorithm SHA256`）和构建/下载来源。二进制版本名字不能代替源码对应关系。本阶段只有 checkout 研究证据，没有已核实参考性能二进制。
2. 给 host/client 使用匿名稳定 ID；记录双方 OS/build、GPU/驱动、分辨率、实际 fps、codec、HDR、音频格式及网络拓扑、RTT/带宽/丢包设置。A/B 对照保持相同设备、网络和所有流参数；网卡状态变化、热降频、后台负载、异常停止作为失败或不可比较证据保存。
3. 方法候选为 30 秒预热后 60 秒采样，独立运行 3 轮。每轮原始日志单独保存，注明 repeat ID、实际采样间隔/窗口和失败；统计前保留逐轮结果，不能用汇总隐藏某轮失败。长时稳定性另做拟议 8 小时场景，其时长仍需后续验收节点确认。上述方法没有批准任何性能阈值。
4. overlay-estimate：抄录参考客户端原统计定义、更新周期和截图时间，仅标注估计。decode-duration：同一单调时钟记录帧提交到解码输出时间与帧 ID。network-rtt：单端 send/echo 的单调时钟差值，并保存探测周期与未响应计数。jitter：接收端同一时钟的相邻帧间隔相对标称帧周期的绝对偏差，记录 fps/定义；若采用 RTP jitter 估计器，另记录公式/单位，定义不同的结果不互比。
5. glass-to-glass：一台高速摄像机同时拍到主机物理显示事件和客户端真实显示，逐帧定位变化并计帧；记录相机 fps、曝光和仪器精度/校准。名义时间分辨率为 1/cameraFPS，实际不确定度须实测而非假定。没有相机写 unavailable。两个机器墙钟之差不构成延迟证据；跨机时间差需 calibration{method,uncertaintyMs,capturedAt} 和 calibrated-cross-machine，否则门禁拒绝。
6. frame-drop 为同窗口缺失/丢弃帧数除以实际期望/发送帧数，保存分母及接收/解码边界；不能只用请求 fps 推算。每秒采集 CPU（说明全机/单核归一化）、GPU 引擎利用率、显存 MiB（专用/共享区分）。功耗 W 优先用外置功率计，说明测量系统边界与校准精度；驱动功耗估计须明确标识。无计数器、仪器或精度证据的指标分别写 unavailable 及原因。
7. 执行 environment.json 的场景：有线 LAN、Wi-Fi 抖动、隔离实验网络的受控丢包/RTT/带宽、1080p60 桌面、高帧率游戏、HDR、至少两屏独立画面、协商资源上限、热插拔、睡眠唤醒、长时运行、A/B/C 切换断连保活/显式停 B 不影响 A/C、抢租约及迟到输入。受控网络由已有授权实验设备/隔离网络提供；本阶段不安装限速工具或修改当前工作站网卡。每条流分开记录 ID、采样和预算拒绝原因。
8. Phase 6/10 有真实参考和原型后，再确认产品阈值。Windows/Android/Linux 实机门禁仍必须完成；Apple 保留完整采集接口/场景，真实结果在 VFY-01/02 补齐，实现和目标构建仍属 v1。

记录模板如下。所有尖括号值必须由实际证据替换；这是契约示例，不是可通过的样本，更没有合成产品数值。采集脚本需从仪器/原日志转换 samples，不能把示例时间或统计结果当真实记录。

```json
{
  "schemaVersion": 1,
  "scenarioId": "lan-desktop",
  "reference": {"repo": "moonlight-qt", "commit": "<固定40位SHA>", "binaryDigest": "sha256:<实际64位散列>"},
  "hostId": "<匿名主机ID>", "clientId": "<匿名客户端ID>",
  "osGpuDriver": {"host": "<OS/build/GPU/driver>", "client": "<OS/build/GPU/driver>"},
  "network": {"type": "LAN", "profile": "<实际拓扑/RTT/丢包/带宽>"},
  "resolution": {"width": 1920, "height": 1080},
  "fps": 60, "codec": "h264", "hdr": false, "audio": "stereo",
  "sampling": {"warmupSeconds": 30, "windowSeconds": 60, "repeats": 3, "clockMethod": "single-clock", "instrument": "<仪器/日志来源>", "accuracy": "<精度与校准证据>"},
  "samples": [], "failures": [],
  "unavailableMetrics": [{"metric": "glass-to-glass", "reason": "<缺仪器或校准的真实原因>"}]
}
```

实际 sample 必须包含 metric、unit、非负实际 value、timestamp、origin；单位固定为延迟/RTT/jitter `ms`，丢帧/CPU/GPU `%`（0–100），显存 `MiB`、功耗 `W`。failure 为 reason/timestamp；样本原始日志保留采样轮次、帧ID和计数边界，汇总不能抹去失败。本机已观测 CUDA/AMD 名称与驱动、缓存 SDK，并未测试编码并发、解码、HDR、功耗或上述场景。
