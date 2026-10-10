---
phase: 06-gamestream
plan: "06"
subsystem: protocol
tags: [C-ABI, TLS, SRTP, control, cancellation, HostServices]
status: complete
requires:
  - phase: 06-gamestream/02
    provides: 固定依赖、身份绑定的媒体保护和共享 scheduler
provides:
  - additive control ABI、协议3/schema1显式确认视频路径
  - 可信共享 HostServices 事务接口和持续 dispatcher
  - 关联权威取消回执、READY 屏障、有界 query/ACK/stop
  - 实际产品 DLL client 与 fixture-only host 的27个双进程场景
affects: [06-03, 06-04, 06-05]
tech-stack:
  added: []
  patterns: [copied typed commands, shared native authority, transaction receipts, bounded worker]
key-files:
  created:
    - native/protocol/src/control.cpp
    - tests/native/protocol_control.cpp
    - docs/phase06/06-06-01-RED.json
    - docs/phase06/06-06-01-EVIDENCE.json
    - docs/phase06/06-06-02-RED.json
    - docs/phase06/06-06-02-EVIDENCE.json
    - docs/phase06/06-06-CONTROL-VECTORS.json
  modified:
    - native/protocol/include/aether/protocol.h
    - native/protocol/src/internal.h
    - native/protocol/src/protocol.cpp
    - native/protocol/src/media_packetization.cpp
    - native/protocol/CMakeLists.txt
key-decisions:
  - "协议3仅通过新 control_open opt-in；既有ABI1结构及版本1/2路径保持。"
  - "HostServices 只由可信 native pre-open attach；实际产品 DLL 无 fixture authority 注册入口。"
  - "cancel_operation 接受本地意图；远端 commit/cancel/activation 由同事务域回执仲裁。"
  - "收到 committed 回执后，本地 activation timeout 保留已知权威结果；未收到结果才保持 unknown。"
requirements-completed: []
coverage:
  - id: CONTROL-ABI
    description: "新增typed控制ABI，旧布局/one-shot/版本1和2保持"
    verification:
      - kind: integration
        ref: "tests/native/protocol_control.cpp#x64-ABI1-preserved-additive-layout"
        status: pass
      - kind: integration
        ref: "tests/protocol-tracer.test.cjs; tests/protocol-multistream.test.cjs"
        status: pass
    human_judgment: false
  - id: CONTROL-CONFIRM
    description: "HELLO和proposal零启流，显式确认及READY_ACK后实际SRTP sink"
    verification:
      - kind: integration
        ref: "protocol_control#exact; protocol_control#no-provider; protocol_control#digest"
        status: pass
    human_judgment: false
  - id: CONTROL-LIFECYCLE
    description: "权威取消、丢失延迟收敛、背压ACK及stop引用屏障"
    verification:
      - kind: integration
        ref: "docs/phase06/06-06-02-EVIDENCE.json#finalDebug/control; asan/finalControl"
        status: pass
    human_judgment: false
  - id: CONTROL-PROVIDER
    description: "两个handle共享provider，释放一个不破坏另一个和持久身份"
    verification:
      - kind: integration
        ref: "protocol_control#shared-provider"
        status: pass
    human_judgment: false
actuals:
  tokens: 42738
  tasks: 2
  commits: 4
commits: 4
plan_head_before: 4bc7f58224507628e66954f3b0c6fd1e5c947d25
plan_head_after: ff081cf601f59e0fd3705f0df786f1d553d021e2
duration: 126.24min
completed: 2026-10-10
---

# Phase 6 Plan 6：显式确认和持续控制前置合同执行摘要

协议3/schema1通过实际产品 DLL 实现显式请求、proposal、CONFIRM 和 READY_ACK 后的认证视频 sink，并用共享可信 provider 的事务回执处理并发取消及引用生命周期。

本计划是06-03的前置。两个任务均已交付；NET-01/02/03仍是跨计划共享要求，未在此关闭。STATE、ROADMAP、REQUIREMENTS、VALIDATION交由父执行器更新；Phase3 halted/install授权、Apollo保存及禁止重启/关机约束保持。

## 已交付行为

- 新增 `AetherProtocolControlOpen`、`AetherProtocolCommand` 和五个 `control_*` 入口；输入在调用内复制，网络操作由有界 worker 处理。x64旧Config仍为176字节、certificate_file偏移96；新结构分别32/72字节。旧1/2黄金字节、queryVersion1和one-shot行为通过46个原用例。
- HELLO只协商协议3/schema1；proposal含完整规格、六维需求、revision/token和digest。产品没有HostServices时拒绝。HostServices拥有六维reservation及原子commit/cancel/activate/status/release_connection；client输入不能注册或充当authority。
- ACTL验证长度、120字节header、版本、身份/epoch/generation、连续transport序列及payload TLV；unknown optional字段跳过，unknown mandatory、duplicate和坏digest拒绝。GRANT/READY回执绑定原确认digest、request/operation和transaction_sequence。客户端在READY_ACK之前保持sink关闭。
- 已发送CONFIRM的取消使用同TLS连接上的关联记录；取消先commit时为AP_CANCELLED，已commit时另记already-committed并继续READY。GRANT/READY/READY_ACK丢失或延迟通过最多3次内部status/READY收敛，重复回执不重复启动。未获权威结果的deadline是AP_TIMEOUT/resultKnown=false；已获commit的activation timeout保留resultKnown=true/authorityTerminal=AP_OK。
- 32个未ACK命令、256个事件及256KiB队列有事前背压和terminal预留；ACK只能下一条或重复最后ACK。query/cancel在网络等待期间使用短锁。stop采用2秒屏障，timeout保留handle/provider/listener供retry，成功join后无callback，随后ACK/drain再destroy。
- 两个实际handle共享同provider；关闭首连接只释放其六维消费，第二连接继续收到媒体且instance/display身份保持。外部provider引用释放后由第二context保活，最后destroy后释放。
- `media_packetization.cpp`新增接受selected3的service-window和stream-generation/reset钩子，保留selected2防护与字节；完整五流、恢复、策略及诊断行为仍由06-03启用。本计划的实际sink是一条synthetic视频。

## TDD Gate Compliance

| 任务 | 行为RED | GREEN | 证据 |
|---|---|---|---|
| 06-06-01 | `7853203`：实际DLL缺少explicit-confirm入口，目标用例1/1失败 | `2282dcb`：真实控制CTest通过，client25/25、父6/6；旧46/46 | `06-06-01-RED.json`、`06-06-01-EVIDENCE.json` |
| 06-06-02 | `e50c978`：实际host已commit，取消后client仍无already-committed回执；17个断言16通过1失败 | `ff081cf`：最终27场景，client445/445、父57/57，Debug/ASan均通过 | `06-06-02-RED.json`、`06-06-02-EVIDENCE.json` |

两次RED均由实际子进程非零exit和具名行为失败产生，已通过原始TAP的 `tdd-red-evidence` 检查。Task1 tracer端到端反馈通过后才扩展Task2。Windows sandbox的nested-process EPERM以及ASan runtime遗漏均属于环境问题，未记成行为RED。未执行独立REFACTOR提交；控制实现移入control.cpp属于Task2的计划内工作。

## 实际验证

| 验证 | 结果 | 时间 | 原始日志 |
|---|---|---|---|
| 最终产品 Debug 完整构建 | exit0，固定dependency/source/notices gates通过 | 日志记录 | `build/phase06/06-06-debug-build-final.log` |
| Debug全量CTest | 11/11、fail0 | 47.71s | `06-06-debug-ctest-final.log` |
| 最后fixture边界后Debug control | 27场景；client445/445、父57/57；fail/skip0 | 21.05s；CTest总21.06s | `06-06-debug-fixture-ctest.log` |
| Debug旧Node套件 | tracer19/19、multistream27/27；fail/cancel/skip/TODO0 | 5294.3821ms + 15687.5149ms | `06-06-debug-legacy-raw.log` |
| ASan Release全量CTest | 11/11、fail0；当时26控制场景 | 48.22s | `06-06-asan-ctest-bound.log` |
| ASan旧Node套件 | tracer19/19、multistream27/27；fail/cancel/skip/TODO0 | 6040.2713ms + 16750.5698ms | `06-06-asan-legacy-raw.log` |
| 最后fixture边界后ASan control | 27场景；client445/445、父57/57；fail/skip0 | 22.89s；CTest总22.90s | `06-06-asan-fixture-ctest.log` |

完整ASan回归后新增的v3 resultKnown边界和fixture输入/共享计数检查已在Debug、ASan各重跑全部control场景；其余未受影响套件未重复。全量回归manifest和raw日志独立保存，证据区分对应源码版本。最后产品二进制、host/client目标、源码、raw logs、每场景输入及实际计数的SHA256由 `docs/phase06/06-06-02-EVIDENCE.json` 绑定；实际HELLO、proposal、committed GRANT和active READY_ACK具名字节在 `06-06-CONTROL-VECTORS.json`。

27场景覆盖exact、no-provider、取消前/后、GRANT/READY/READY_ACK延迟丢失、activation已知timeout、deadline unknown、replay、坏digest、oversize/schema/sequence/mandatory/duplicate/truncated、命令/ACK边界、stop真实callback超时重试、同窗口healthy-cancel、shared-provider及authority read/capacity/revision/clock。共享场景client早返回未单独打印PID，证据明确记录该日志限制；两个原生Child的CreateProcess/exit由父具名场景验收，未补造PID值。

ASan插桩Aether、Botan和libSRTP；固定预编译OpenSSL未插桩。首次遗漏现有runtime的临时PATH造成control timeout与0xc0000135，恢复进程局部runtime路径及Release manifest后通过，未安装或持久改变环境。通过结果不等同TSan、泄漏自由或完整安全认证。

## Generic fixture交接

`aether_protocol_control_client.exe --orchestrate [--scenario NAME]`可供后续Node用例启动相同test-host和实际DLL client。直接入口为host `--host DIRECTORY NAME`、client `--client DIRECTORY NAME PORT`；未知选定场景导致零case检查失败。

仅test-host读取 `provider.bin`：96字节APFX/schema1，network endian，六维capacity、revision、expiryToken、lease、permission/device bit及最多60000ms单调时钟推进。`scenario.bin`每条32字节，最多32条/1024字节，包含opcode/phase/request、before、最多3000msdelay、drop/replay/mutation及最多32次remaining；共享fault计数受mutex保护。client控制payload不携带这些authority字段。fixture提供数据与故障调度，判定/取消/parser/READY仍由产品源码执行。格式与offset详列在Task2证据，未实现06-03的策略或恢复场景。

## 偏差与问题处理

1. **[Rule 2：隔离必需接口]** Task2补充internal.h的fixture-only故障声明及共享media钩子，确保独立host static目标链接而实际产品DLL不含fixture注册。此文件已在计划总ownership内；未引入库或系统操作。提交：`ff081cf`。
2. **[Rule 1：测试快照竞态]** 双handle验收暴露两次query之间快照增长，测试按旧required精确分配会错误失败。改用合同65536字节caller-owned上限，保留size/NUL检查；产品query合同不变。共享场景随后通过。提交：`ff081cf`。
3. **[Rule 1：权威已知状态]** 已commit的activation等待timeout不能把可信已知结果降为unknown；保留known并加入readyall-loss真实peer场景。Debug/ASan分别27场景通过。提交：`ff081cf`。

没有认证人工gate、包安装、意外删除或计划外网络/设备配置。stub扫描未发现阻碍本计划交付的TODO/placeholder；恢复/trace及尚未启用的扩展操作按计划明确AP_VERSION且无副作用，由06-03实现。新增trust surface均在本计划threat_model内：FFI/ACTL输入界限、native authority隔离及callback/stop生命周期；未发现额外端点或凭据记录。

## 提交与范围

| 提交 | 内容 |
|---|---|
| `7853203` | Task1行为RED |
| `2282dcb` | Task1显式确认GREEN |
| `e50c978` | Task2权威取消回执RED |
| `ff081cf` | Task2持续dispatcher、屏障与最终证据GREEN |

actuals.tokens按ledger基线至产品GREEN的realized diff字符数/4测量，包含证据JSON；4个提交由 `git rev-list --count plan_head_before..plan_head_after` 实测，SUMMARY文档提交在此区间之外。耗时126.24分钟从persisted ledger基线提交至产品交付测量，包含中断和环境处理。

证据限Windows x64、synthetic authority/media及真实loopback TLS/SRTP。生产配对、真实capture/codec、真实provider设备、五平台实机、性能阈值及完整预算/恢复/parity保持原后续计划，不从本结果推断已支持。未执行机器重启或关机。

## Self-Check: PASSED

交付源码、Task1/2 RED与GREEN证据、具名向量及本SUMMARY存在；四个任务提交均可在Git查询。产品GREEN后工作区无其他未提交文件；未改动父拥有的规划账本。
