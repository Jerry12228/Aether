# Phase 06-03 协议原型限值与实测范围

本记录针对 Windows x64 回环网络上的真实 mTLS/TCP 控制、SRTP/UDP 与五路 synthetic 媒体。它证明协议事务、隔离和有界运行，不代表真实采集、编码、解码、设备或广域网络性能。完整输入、双 PID、原始日志路径和 SHA-256 见 [06-03-03-EVIDENCE.json](06-03-03-EVIDENCE.json)。

## 具名限值与依据

| 项目 | 原型合同 | 验证与选择依据 |
|---|---|---|
| 全量预算 | encoder、uplink decoder、downlink decoder、pixel/s、VRAM bytes、bandwidth bit/s 六项同时 reserve/confirm/commit | 逐维耗尽拒绝；双连接共享 provider 证明 pending/active 的 owner 隔离。降低码率不能替代 encoder 数量。数值来自可信快照，非固定物理 GPU 能力。 |
| control 单操作 deadline | 1–3000ms | 1、3000、3001 边界及原有 timeout/ACK/停止测试；长期媒体工作不延长低频操作期限。 |
| fresh transport | 最多 3 次；每次 250ms 绝对 deadline；退避 50/100/200ms | 真实 refused socket 验证耗尽进入 manual、out-of-band cancel 有界。信任/身份/权限错误不盲重试；手动重试创建新 TLS authentication、connection/lease/key epoch。不是网络恢复成功保证。 |
| 单流重试窗口 | 1–3000ms | 0/1/3000/3001；目标 stream key 每次递增，旧媒体拒绝，其他 video/control/audio 在故障窗口继续。降规格仍须全方案确认。 |
| 持续故障提示 | steady_clock 连续 500ms 后 action-required；窗口结束回到 healthy | 499/500/501ms 邻域及 900ms 窗口用例；瞬态为 transient，不立即要求用户操作。线程调度使观察时间晚于精确边界。 |
| 临时 trace | 1–60000ms；单调倒计时；64KiB 实际字符串上限；每条固定 256 bytes 标量槽 | start/stop/extend/expired/断连及 cap 用例；0/1/60000/60001；上限到达停止。每次 start 清旧记录，重连不继承 trace。所有模式 sentinel 不泄漏 credential/key/clipboard/AV 内容。 |
| packet size | 0 使用安全默认；有效显式值至少 240 bytes，且不超过 MTU 1500 | 同输入分别映射 Win10/Win11 原 packetsize；0/239/240/1501 边界由真实 C ABI 验证。此处是原型分片合同，不宣称通用网络 MTU。 |
| FEC | 原型 fec_percentage 1–255；0 拒绝 | 0/1/255/256 的真实 C ABI 结果；旧 v2 FEC/修复/队列/期限向量继续单独回归。 |
| 媒体队列与期限 | 原型输入 k=2、shard=64、per-stream queue=192 bytes、TTL=25ms；effective packet=240 bytes | 旧向量覆盖边界与有界丢弃；三轮持续运行观测 aggregate peakQueueBytes=384。不能从本次峰值推导真实视频队列需求。 |
| 原设置与能力保留 | 637 个原 case 全部保留；NET 适用 12 个（两 OS × 六设置） | [06-03-PARITY.json](06-03-PARITY.json) 绑定原 features.json hash；关闭保护禁用并解释安全替代；port/ping/FEC/packet 具名合同测试。平台标签不代表两套 OS 实机运行。 |

## 三轮真实时间量测

命令：`node tests/protocol-recovery.test.cjs --measure --evidence artifacts/phase06/limits.json`。量测入口与 fast suite 分开。每轮申请 30000ms 预热与至少 60000ms 观察窗口；每组子进程 deadline=100000ms，总 deadline=330000ms。观察窗口之后另留 2000ms，确保 CPU 取样发生在 owned 进程退出前。三轮总实际耗时 **281648.188ms**。

| 轮次 | host/client PID | 预热 ms | 窗口 ms | control 增量 | aggregate queue 峰值 bytes | trace bytes |
|---|---|---:|---:|---:|---:|---:|
| 1 | 51068 / 57552 | 30495 | 61111 | 988 | 384 | 4608 |
| 2 | 53320 / 14180 | 30483 | 61120 | 989 | 384 | 4608 |
| 3 | 68024 / 55052 | 30506 | 61114 | 988 | 384 | 4608 |

每轮一次全 proposal/confirm 启动 video1/video2/audio/mic/camera，在窗口内开启 1000ms trace、对 video1 执行一次 300ms 单流恢复，再观察健康状态。两路上行的 host sink 每轮均有真实接收；完整 host 终态累计数包含预热，不冒充窗口差值。

| 轮次 | video1 接收/拒绝/丢弃增量 | video2 与 audio 各自接收/拒绝/丢弃增量 | mic 与 camera 各自发送增量 |
|---|---|---|---:|
| 1 | 982 / 982 / 6 | 986 / 989 / 2 | 2964 |
| 2 | 983 / 983 / 6 | 987 / 990 / 2 | 2967 |
| 3 | 982 / 982 / 6 | 986 / 989 / 2 | 2964 |

分母是各轮实际窗口毫秒与相同 stream 在窗口首尾的累计计数差；不是吞吐请求值。synthetic service 主动注入重复/损坏/恢复场景，`rejected` 是协议拒绝计数，不能换算为物理链路丢包率。上行客户端发送量不等于 host 接收量；两者在证据中分别保存。

| 轮次 | host CPU 增量 ms / 单核等效占比 | client CPU 增量 ms / 单核等效占比 | host/client 峰值 working set bytes |
|---|---|---|---|
| 1 | 828.125 / 1.3551% | 515.625 / 0.8438% | 12812288 / 13508608 |
| 2 | 1453.125 / 2.3775% | 656.25 / 1.0737% | 12812288 / 13512704 |
| 3 | 1171.875 / 1.9175% | 656.25 / 1.0738% | 12832768 / 13500416 |

CPU 来源为 Windows `Get-Process TotalProcessorTime`，占比=CPU 增量/实际窗口 ms，是单核等效；整机占比还须除以逻辑处理器数。原始计数粒度在本次记录中表现为 15.625ms，native elapsed 分辨率为 1ms，Node 外层 elapsed 使用 `hrtime.bigint`。同步 PowerShell 查询带来采样偏差，三次采样的 native/外层时间与 private memory 均保存。峰值 working set 是从进程启动起累计的峰值，不仅窗口内峰值；不含 codec 或 GPU 资源成本。

## 输入与代码绑定

量测绑定提交 **f853627** 的 Debug 原生实现。首次最终重建前已把原 tracer、DLL、host fixture、media helper、原 manifest 及其中全部源码的精确字节保存至 `build/phase06/measure-06-03-f853627/`。原 hash 保持不变。原 DLL SHA-256 为 `19c5acb19f2023ec8e90ac9f9c27a22473afd734d1fb9583297e231fd94cda06`，tracer 为 `6d19a91f8c015cbac1ce790050355de7b4b9cf698c8685e62c38038d6039bed5`。

最终修正新增真正失去 transport 后的同 handle manual 重试，并把连续第二次及之后的单流恢复改为递增当前 stream key。它们分别改变断线恢复分支与重复 reset 分支；三轮量测没有 transport 断线，且每轮只有首次 key1→2 reset，健康服务/trace/采样输入未改变。因此保留上述指定版本量测，最终新代码通过独立 Debug/ASan 完整恢复回归，不把旧数值或旧 hash 标为最终二进制量测。断线保留的诊断快照只有标量计数，旧 key/route/buffer 仍清除。

首次量测曾在首轮末端 CPU 取样时发现 owned client 已退出，未进入有效三轮统计。失败原始日志与 hash 保留在 `failedHistory`；增加明确的窗口后等待及 callback 错误捕获后才重新完成三轮。此失败不隐去、不与通过的窗口合并。

## 支持声明边界

短 suite 中的 ±1 和 native fixture 人工 revision/权限/时钟变化用于证明合同边界；上面的三轮 elapsed 使用真实 steady clock 和真实 socket，二者分别记录。HostServices 是 test-only 可信仲裁 fixture，产品 DLL 无 provider 时拒绝授权。测试不执行真实 input/settings/clipboard；POLICY gateway 仅处理 synthetic 标量边界。

Win10 原 HDR 请求获得 R1 SDR 替代原因；Win11 HDR、444/color/codec、多声道、完整输入/反馈、input-only/observer/capture-source 等原能力保留 extension、理由和原 owner，但尚未验证真实设备支持。三个 unclassified、六个 descriptorless 禁止项仍 flagged-unverified。五目标同输入运行归 06-05；生产配对/仲裁及采集/codec/设备归原后续阶段。Phase3 安装 gate 保持 halted。本计划未执行或安排机器重启、关机。

ASan 使用本次进程 PATH 指向 MSVC runtime；预编译 OpenSSL 不插桩，本证据不构成 TSan 或 leak 认证，也不构成 Windows10/11 两 OS 或 Apple 实机支持声明。
