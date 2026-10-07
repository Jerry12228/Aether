# 开发环境与依赖

初始化只克隆参考仓库、读取代码并创建文档；没有安装驱动、修改系统启动设置或执行参考项目安装脚本。参考子模块未递归下载，不能把这些 checkout 当作完整可构建上游工程。

## 当前探测

2026-10-07 在当前工作站 PATH 找到 Git、Node（mise shim）、Python（pyenv shim）、Flutter（D:/Program/FlutterSDK/flutter/bin）、CMake。找到命令不等于 SDK 可用；Flutter 版本命令响应情况和 MSVC/SDK/WDK 在 Phase 1 doctor 中进一步核查。当前文档检查以 Node/Git 为基础，不依赖 Flutter 构建。

## 分阶段依赖

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
