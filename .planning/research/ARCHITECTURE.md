# Architecture research

完整组件边界见 docs/ARCHITECTURE.md，行为契约见 docs/SESSION-MODEL.md。

本地参考体现 Sunshine 捕获/编码与 Moonlight 平台解码/输入的分层；用户已明确在 NVIDIA GameStream 基础上重构扩展，因此 moonlight-common-c 与 Sunshine 同时是协议与共享原生核心的主要基线。须审计具体复用范围、特定 ENet、全局连接状态及历史单流假设；重构为 Aether 版本、独立上下文、多流和上行扩展，不要求旧端互通。详见 docs/PROTOCOL.md。

Apollo `src/platform/windows/virtual_display.h/.cpp` 显示创建/删除显示器和固定身份接入的模式；头文件与打包产物存在不等于 SudoVDA 驱动实现源码及独立再分发许可已得到确认。Virtual Display Driver 是可研究的替代 provider。

关键顺序：来源与功能清单→小骨架与 ABI→显示/麦克风/摄像头可行性→GameStream重构扩展原型→Windows 单流→输入音频→硬编与进阶媒体→显示器生命周期/多流→全局切换→完整上行/码率/剪切板→五端适配→原功能复审/稳定性/发布。

早期虚拟设备阶段只证明系统设备与可分发路径，不提前承担整个上行链路；后续阶段再接真实客户端媒体。各阶段留短输出/契约及测试证据，避免后续 planner 一次读完所有参考源码。
