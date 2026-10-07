# GameStream 基础上的 Aether 协议重构扩展

2026-10-07 用户确认：协议在 NVIDIA GameStream 的基础上重构扩展。此前“不考虑原协议兼容”继续成立。本文固定方向，具体线格式与库选择待 Phase 6 原型；没有已经实现的协议声明。

## 可核验基线

以固定 SHA 的 Moonlight/Sunshine 实现为主要依据，[moonlight-common-c](https://github.com/moonlight-stream/moonlight-common-c) 是 GameStream 核心实现参考。不能将开源实现的行为自动称为 NVIDIA 官方完整规范，也不依赖 NVIDIA 主机程序运行。

本地源码锚点：

| 层 | 初步锚点 | 重构关注点 |
|----|----------|------------|
| 发现、配对、启动/管理 | Sunshine src/nvhttp.cpp；Moonlight 各端主机管理 | 与实例/权限绑定，认证管理与实时控制边界明确 |
| 会话协商 | moonlight-common-c src/RtspConnection.c；Sunshine src/rtsp.cpp | 保留可用协商语义，支持多流、双向媒体、能力与 Aether 版本 |
| 视频和音频 | src/VideoStream.c、AudioStream.c、RtpVideoQueue.c/.h、RtpAudioQueue.c | UDP/RTP、分片、FEC、时钟、pacing、有界队列与每流资源独立 |
| 控制/输入/反馈 | src/ControlStream.c、InputStream.c | 通道可靠性与优先级、重配置 ACK、租约 epoch、过期包拒绝 |
| 连接生命周期 | src/Connection.c；Moonlight platform/thread 层 | 从全局状态改为独立上下文，支持多流与明确所有权 |

这些文件是当前已克隆实现的研究入口，不能据此推断所有历史 GameStream 版本都有完全相同的通道行为。Phase 6 必须记录选用版本的真实基线。

## 扩展契约

| 扩展 | 必须定义的行为 |
|------|----------------|
| Aether 握手与能力 | 协议标识/版本、能力清单、明确拒绝原因；旧端不能被误识别为已支持扩展 |
| 实例/多显示器/多流 | host/instance/display/stream ID、关联关系、每流 codec/尺寸/刷新率、资源预算、事务启动和拓扑变更 |
| 麦克风/摄像头上行 | 独立方向和媒体类型、能力/格式、时钟、授权、队列、系统设备路由和撤权清空 |
| 动态码率 | stream目标与会话总预算、请求版本、ACK/实际生效值、自动反馈；连接与实例不重建 |
| 控制权切换 | 主机唯一租约、epoch fencing、输入释放、旧包/旧媒体拒绝；Connection与Instance生命周期分离 |
| 剪切板 | 协商格式、大小上限、revision/去重、冲突策略、方向权限与租约绑定 |
| 安全和丢包恢复 | 标准密码实现、鉴权、防重放、媒体保护、每方向/流的密钥/nonce生命周期与FEC恢复边界 |

扩展必须在 GameStream 基础上形成明确的差异映射和可复现测试向量；无需原样保留历史端口、单流假设、旧版本分支或不适合新需求的包布局。

## 原生核心和安全约束

`Connection.c` 的 StreamConfig、callback、端口和连接状态等当前大量为全局状态，不能简单启动多次原连接API来实现独立流。需要提取连接/实例/流上下文，定义线程、队列、停止与释放顺序；后台实例不被连接关闭流程误停止。

若复用 moonlight-common-c 的 ENet 路径，先核验它指定的 fork/固定子模块版本与 ABI；不能随意换系统 ENet。代码复用范围与许可在 Phase 1/6 明确，参考 checkout 不直接成为生产依赖。

双向、多流和重连会改变密码状态边界。不得直接复制单流历史 nonce/序号规则并在多流共享同一状态；认证控制、媒体方向与租约撤销都需独立审查。优先使用成熟密码库，具体安全封装和通道实现由原型/ADR锁定。

## Phase 6 验收输出

1. GameStream 基线清单，逐层/逐字段标记保留、修改、新增和移除，并说明原因。
2. Aether 握手、通道/包契约、测试向量及失败状态；五平台原生核心构建或明确环境缺口。
3. 双向模拟媒体、至少两条独立视频流、重连/切换迟到包、受控丢包与资源超限验证。
4. 安全与传输 ADR：加密/密钥/nonce、防重放、FEC、可靠控制及低延迟媒体的边界。

后续功能阶段再接真实设备、编码器、显示器和 UI。若原型证明某个子通道必须替换底层实现，先给出具体证据及对 GameStream 扩展结构的影响；不能自行改回整套 WebRTC/QUIC 协议选型。
