# Aether

Aether 是面向远程桌面和游戏串流的 Monorepo。服务端 **Helios** 首期支持 Windows 10/11；客户端 **Selene** 使用 Flutter，目标平台为 Windows、macOS、iOS/iPadOS、Android、Linux。

当前处于项目初始化与架构研究阶段，尚无可运行的产品。所有功能要求均待实现和验证。

iOS/iPadOS、macOS 的实现与构建仍属首版范围；由于没有实机，两端的实机功能、性能及安装验收进入 TODO。交付时必须标记“未经实机验证”，不能声称五端均已实测通过。

## 文档入口

- [项目定义](.planning/PROJECT.md)
- [可验收需求与阶段映射](.planning/REQUIREMENTS.md)
- [阶段路线图](.planning/ROADMAP.md)
- [当前状态](.planning/STATE.md)
- [架构与 Flutter 边界](docs/ARCHITECTURE.md)
- [实例、连接、控制权与显示器生命周期](docs/SESSION-MODEL.md)
- [原功能保留对照](docs/FEATURE-PARITY.md)
- [平台与验证矩阵](docs/PLATFORM-MATRIX.md)
- [开发环境与依赖](docs/DEVELOPMENT.md)
- [后续 TODO](docs/BACKLOG.md)
- [研究摘要](.planning/research/SUMMARY.md)
- [参考源码清单](references/UPSTREAM.md)

## 仓库结构

```text
apps/helios/                 服务端协调器、会话工作进程与管理入口
apps/selene/                 唯一 Flutter 客户端应用
native/core/                共享协议、传输、媒体调度与输入模型
native/platform/            Windows/Apple/Android/Linux 薄适配
packages/selene_native/     Flutter 插件、C ABI 与生成绑定
protocol/                   Aether 协议契约与测试向量
drivers/windows/            经过验证的虚拟设备接入与打包
tests/                      契约、端到端、性能与平台验证
scripts/                    开发与发布工具
docs/                       设计、验收和运维文档
.planning/                  GSD 项目与阶段记录
references/upstream/        本地参考 clone，Git 忽略
```

上述产品目录为规划边界，Phase 2 建立可构建骨架。参考目录已提前建立并克隆；参考仓库不作为多个独立产品仓库维护。

协议在 NVIDIA GameStream 基础上重构扩展，以 Moonlight/Sunshine 的开源实现为可核验基线；Aether 扩展版本不承诺与旧端互通。详见 [协议方向与扩展边界](docs/PROTOCOL.md)。原有用户能力通过功能对照表保留。VPN、文件互传、打印机重定向及 Linux/macOS 服务端是后续 TODO。
