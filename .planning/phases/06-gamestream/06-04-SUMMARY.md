---
phase: 06-gamestream
plan: "04"
subsystem: protocol
tags: [Dart, FFI, gamestream, mTLS, SRTP, ownership]
status: complete
requires:
  - phase: 06-03
    provides: 完整方案、六维预算、恢复与临时 trace 的真实协议状态
  - phase: 06-06
    provides: typed control C ABI、可信 test-only HostServices 与取消/READY 屏障
provides:
  - Selene 真实协议 DLL 的完整低频 typed FFI 消费者
  - 连续 ACK、caller-owned buffer 与有序 stop/drain/destroy/listener-close
  - 独立 host 回执核对、恢复/上行/trace 正负例及批准依赖来源总账
affects: [06-05, 后续Selene界面与媒体平台阶段]
tech-stack:
  added: []
  patterns: [独立协议绑定, creator isolate listener, 主机回执核对, timeout保留引用]
key-files:
  created: [protocol/ffigen.yaml, packages/selene_native/lib/src/protocol_bindings.g.dart, packages/selene_native/lib/src/protocol.dart, packages/selene_native/test/protocol_contract_test.dart, tests/protocol-ffi.test.cjs, docs/phase06/06-04-EVIDENCE.json, docs/phase06/06-04-STATUS-BINDING-RED.json]
  modified: [docs/DEPENDENCIES.md, tests/native/protocol_control.cpp]
key-decisions:
  - AP_OK 仅代表请求接收；取消结果须消费 authorityTerminal、transaction_sequence 和 activationPhase，不把 unknown 当成功。
  - 实际 Flutter client 加载产品 DLL；授权与媒体接收来自不同 PID 的 test-only host，不宣称生产仲裁或真实设备完成。
  - 历史编译失败不计行为 RED；恢复时补真实基线复现，并如实保留原先 TDD 流程偏差。
requirements-completed: []
requirements-contributed: [NET-01, NET-02, NET-03]
coverage:
  - id: typed-ffi-proposals
    description: D-03/04 全方案、禁用原因、confirm/cancel/修改重试真实 FFI
    verification:
      - kind: integration
        ref: tests/protocol-ffi.test.cjs
        status: pass
    human_judgment: false
  - id: recovery-trace-ownership
    description: D-05/07/14–16 恢复、上行另确认、trace 与安全停止/竞态负例
    verification:
      - kind: integration
        ref: docs/phase06/06-04-EVIDENCE.json
        status: pass
    human_judgment: false
  - id: bindings-provenance
    description: 生成绑定与固定 header 一致、批准依赖精确追踪及本地 core 回归
    verification:
      - kind: other
        ref: docs/phase06/06-04-EVIDENCE.json
        status: pass
    human_judgment: false
actuals:
  tokens: 44760
  tasks: 2
  commits: 5
plan_head_before: d9775ecb470ba59aad13c3d290560bf3b67442ff
plan_head_after: 387a0528c6c5c629645246d809b8dc8f23809b67
duration: 37min
completed: 2026-10-11
---

# Phase 06 Plan 04：真实 Dart FFI 消费者执行摘要

**Selene 包现可经真实协议 DLL 与独立 host 的 mTLS/SRTP 连接消费完整方案、恢复、上行选择和临时 trace，并安全停止及核对取消事务结果。**

## 实际交付

1. Task1：独立 `protocol.h` 生成绑定，保持 local core ABI1；opt-in3/schema1 的 `ProtocolClient` 消费全方案、Capability、资源与原因，一次 confirm 后才激活 native sink。每次操作采用唯一 operation/request id；媒体帧与 PCM 留在 native。
2. Task2：typed retryConnection/cancelRetry/recoverStream/proposeUpstream/startTrace/stopTrace/extendTrace；`UpstreamChoice` 单独解析无 proposal digest 的关闭选择。查询缓冲上限 64KiB、结果缓存 32、diagnostics 256；creator isolate listener 连续 ACK，dispose 经辅助 isolate stop、ACK/drain、destroy 后才 close listener。timeout 保留 handle/listener 引用，可重试；并发 dispose 共享 future。
3. Flutter 22 项真实检查及 21 个独立 host 场景覆盖 fresh-auth、manual、逐流恢复、mic/camera 另确认、trace remaining/expiry、坏 ACK、stop timeout、销毁后回调、cancel-before-commit、已 commit 及 READY 延迟/丢失、unknown、重复回执与健康流继续。Dart 从真实 `wire.hex` 独立解析回执，并核对 operation/request/transaction/phase/status 与 host commit/activation 计数；零重复启动、最终 owned 归零。两个认证后拒绝/断开的 retry 场景没有 ACTL 回复，证据明确记 wire absent，不伪造包。
4. [DEPENDENCIES](../../../docs/DEPENDENCIES.md) 同步 OpenSSL3.5.9、libSRTP2.8.0 与已独立批准 Botan3.13.0 标量子集的来源、hash、许可/notices/配置；历史 ADR 与 FEC 批准材料保持，不增加新依赖或改写 Phase2 锁。

## 原子提交与 TDD Gate Compliance

| 交付 | 提交 | 实际情况 |
|---|---|---|
| Task1 原 RED / GREEN | `f4c2f92` / `7d2d501` | 原 RED 为编译/加载失败，不能计作合格行为 RED；GREEN 后真实消费者成立 |
| Task2 原 RED | `2d7c672` | 原失败为缺方法编译失败，保留 TDD 偏差 |
| STATUS/cancel 稳定行为 RED | `d03b278` | pending STATUS 后取消真实返回 AP_STALE；分类器 RED_EVIDENCE_OK，先提交再修复 |
| Task2 与 fixture 修复 GREEN | `387a052` | typed 恢复/trace 消费者、来源总账、test-only 事务绑定及完整最终证据 |

恢复选择原答复 `1` 保存在 [EVIDENCE](../../../docs/phase06/06-04-EVIDENCE.json)。恢复时隔离 `7d2d501` 历史消费者，先真实认证，再以 runtime `expect(callFailure,isNull)` 断言复现缺 startTrace，得到 RED_EVIDENCE_OK；当前实现对同一目标通过。此项是事后基线复现，不倒置时间或替换原编译错误记录；Task1 原先先 RED 后 GREEN 的流程缺陷仍存在。新 fixture 缺陷的正式 [STATUS RED](../../../docs/phase06/06-04-STATUS-BINDING-RED.json) 则确实先于修复提交。EPERM、遥测写入失败和格式不足的 RED 文件均为环境/证据格式问题，不计行为 RED。

`before..after` 实际为 5 个任务提交、9 个文件，摘要和规划元数据不计其中。`actuals.tokens=ceil(179037/4)=44760` 来自 PowerShell `git diff | Out-String` 字符尺度估算，非模型实际用量。恢复统计窗口从首轮日志 2026-10-11T03:31:17Z 至 04:08:27Z，约 37 分钟，包含环境处理及回归；Task1 首提交在前一天，原计划跨中断总时长不能以此冒充连续工作或 CPU 时间。

## 最终验证与精确输入

| 验证 | 实际结果 |
|---|---|
| 当前四套协议 Node 完整回归 | 107/107，101947.7632ms；fail/cancel/skip/TODO 全 0 |
| 上述完整运行内 Flutter FFI | 22/22，21 独立 host 场景，20423ms |
| 修复后独立 FFI 定向运行 | Node wrapper 1/1，内部 Flutter 22/22 |
| 当前协议 Debug CTest | 12/12，107.06s |
| 根原生 CTest | 11/11，27.00s |
| local core Lifecycle | 1 native suite + 6 Dart tests，通过 |
| ffigen 独立绑定生成 | 成功；与 Task1 绑定字节一致，未覆盖 core 绑定 |

完整证据文件 SHA-256 `f4af383b5f1f03d465102aaaf00ce675cb1394ba3160804505d2a79284d73082`；输入 digest `7a5085bf2816f6dd9aa6b8e41e944f62dd3941fd339f558f348192edf2481854`。固定 header SHA-256 `3e8c36e70fbfe5fd0f92b096f9702956a72a6caf87f069b1d13d07e6735eaef4`，产品 DLL `2176a44c8f45e7bb0a1eb2172582a1606ef11adac3eae3f43e531dd649353dd1`，独立 host `cc08bd3d9037ec5327f6bf898db00c236c04f9514e26bd16364eaa44b8ee1480`。EVIDENCE 收录 manifest、源码、生成工具日志、raw logs、Flutter JSON、双 PID 及逐场景实际回执的路径/hash。ignored build 保存原始失败/成功日志与临时历史基线；没有提交证书密钥、reference checkout 或 scratch。

## 必要偏差与修复

- **Rule1：test-only STATUS/cancel 事务绑定。** authority reservation 的旧 proposal operation 覆盖 deferred CONFIRM operation，使 STATUS 之后合法取消误判 stale。`FixtureServices.status` 在 phase1 保留当前操作，cancel 在线性化前绑定该操作。用实际 pending STATUS 回执稳定复现后修复；仅 `AETHER_CONTROL_HOST` fixture 改变，产品 DLL 未改。
- **Rule3：有界竞态观测。** test host CONFIRM marker 扩展到上行 opcode9；测试等待明确 marker/真实 STATUS，而非固定短 sleep。1500ms bounded defer 与 3000ms confirm deadline 保持先后顺序；trace 主窗口改为 3000/6000ms 抵御负载，60ms expiry 检查保留。
- **恢复记录纠正。** STATE 原称 04 未开始，但已有三提交和未提交 Task2；按用户恢复选择核对当前字节、保留历史错误并补齐最终证据及摘要，没有重写旧批准或旧量测。

## 未测范围与交接

证据限定 Windows x64 Debug、真实 loopback mTLS/SRTP、产品 client DLL 与 test-only authority/synthetic media。没有生产 HostServices、真实 capture/codec/HDR/设备或五端支持结论；没有新增 ASan 运行，06-03 ASan 和绑定 f853627 的量测仍是独立历史。其余目标的实际构建/执行证据、独立 validator 与强制最终人审属于 06-05。

本计划 2/2 完成；Phase6 为 5/6，NET-01/02/03 仍未完成，VALIDATION draft、nyquist/wave0 false、3 个 unclassified 与 6 个 descriptorless 原样保留。阶段最终人审尚未发生。Phase3 保持 halted 与独立安装批准门槛；没有设备/信任/Apollo 操作，未执行或安排重启/关机。下一 06-05 依交互配置等待选择，不自动启动其他产品阶段。

## Self-Check: PASSED

九个任务文件及五个提交对象存在；最终证据生成器已逐项核对当前 source/header/library/host/raw logs、107 项完整回归及 22 个 Flutter case，`git diff --check` 通过。摘要及其 commit 原子封存后由父级更新 STATE/ROADMAP/VALIDATION，共享 NET 不提前关闭。
