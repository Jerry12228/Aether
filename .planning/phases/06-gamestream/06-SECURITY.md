---
phase: "06"
slug: gamestream
status: verified
threats_open: 0
threats_total: 23
threats_closed: 23
asvs_level: 1
register_authored_at_plan_time: true
created: "2026-10-13"
source_commit: 4edaf0352ca1b875e3536fe54970e8b85585c794
input_digest: 7ca1594252b56ee2fe36d99d13ad1b63e4f2ca69eead8784a29503d714ce2369
scope: synthetic-protocol-prototype
auditor: 当前Codex内联，无独立子代理
---

# Phase 06 安全缓解核验

按gsd-secure-phase复核六份PLAN的原始STRIDE登记，共23个唯一威胁，所有处置为mitigate。ASVS L1采用实现与证据定位；21项high、2项medium在当前协议原型范围closed，open0。不是ASVS认证、生产安全评估、穷尽攻击证明或新一轮原生/ASan测试。三项空edge和五项自主禁止项判断仍独立flag，不被threats_open=0掩盖。

## 信任边界

| 边界 | 实际约束 |
|---|---|
| peer→native | TLS1.3强制证书与peer身份，帧长/版本/序号/域在认证后检查 |
| host authority→connection | 产品缺provider拒绝；预算/权限/租约由native provider提供，客户端不提供权威available |
| media→FEC/消费 | source/repair及方向/stream/key域独立保护，认证成功后进入有界恢复队列 |
| native→Dart | 标量事件、caller-owned查询、连续ACK及stop barrier，媒体不经Dart逐帧传递 |
| 来源/CI→证据 | 固定Git/source/SDK/CPU/dependency/artifact/raw log，独立known-bad校验 |

## 原登记威胁逐项核验

| Threat ID | Category | Component | Severity | Disposition | 实现与实际测试定位 | Status |
|---|---|---|---|---|---|---|
| T-06-01 | S | secure handshake | high | mitigate | [native/protocol/src/secure_transport.cpp](../../../native/protocol/src/secure_transport.cpp)；[native/protocol/src/protocol.cpp](../../../native/protocol/src/protocol.cpp)；protocol_tracer | closed-scoped-synthetic |
| T-06-02 | T | parser/negotiation | high | mitigate | [native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；[native/protocol/src/protocol.cpp](../../../native/protocol/src/protocol.cpp)；independent full-media parser boundaries and profile negotiation, schema, oversize | closed-scoped-synthetic |
| T-06-03 | E | fixture/C ABI | high | mitigate | [native/protocol/CMakeLists.txt](../../../native/protocol/CMakeLists.txt)；[native/protocol/include/aether/protocol.h](../../../native/protocol/include/aether/protocol.h)；no-provider, boundaries | closed-scoped-synthetic |
| T-06-04 | D | control admission | high | mitigate | [native/protocol/src/internal.h](../../../native/protocol/src/internal.h)；[native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；boundaries, stop-timeout | closed-scoped-synthetic |
| T-06-05 | T | key/replay domain | high | mitigate | [native/protocol/src/secure_transport.cpp](../../../native/protocol/src/secure_transport.cpp)；[native/protocol/src/media_packetization.cpp](../../../native/protocol/src/media_packetization.cpp)；actual native media security: nonce-exhaustion, actual native media security: role-key-epoch, real secure media: replay | closed-scoped-synthetic |
| T-06-06 | T | FEC queue | high | mitigate | [native/protocol/src/media_packetization.cpp](../../../native/protocol/src/media_packetization.cpp)；real secure media: fec-tamper-repair, real secure media: fec-cross-role, real secure media: fec-threshold | closed-scoped-synthetic |
| T-06-07 | E | admission | high | mitigate | [native/protocol/src/admission.cpp](../../../native/protocol/src/admission.cpp)；[native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；cancel-before, cancel-committed, digest, authority-revision | closed-scoped-synthetic |
| T-06-08 | E | session_lifecycle | high | mitigate | [native/protocol/src/session_lifecycle.cpp](../../../native/protocol/src/session_lifecycle.cpp)；[native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；D-06 observer fresh authentication never gains controller permission, D-06 occupied control lease explains conflict without stealing, D-06 fresh TLS authentication rotates connection lease key and preserves persistent identity, D-07 upstream cancel uses host transaction before commit, D-07 upstream cancel uses host transaction after commit, D-07 entire upstream confirmation rechecks {"permissions":3}, D-07 entire upstream confirmation rechecks {"devices":0}, D-07 entire upstream confirmation rechecks {"revision":8}, D-07 upstream selected mask zero remains closed and a separate confirm starts mic camera | closed-scoped-synthetic |
| T-06-09 | D | media/queue | high | mitigate | [native/protocol/src/media_packetization.cpp](../../../native/protocol/src/media_packetization.cpp)；[native/protocol/src/internal.h](../../../native/protocol/src/internal.h)；real secure media: fec-queue, real secure media: fec-burst, public fixed-width media options validate ABI, prefix length and bounded effective result | closed-scoped-synthetic |
| T-06-10 | I | route/log/trace | high | mitigate | [native/protocol/src/diagnostics.cpp](../../../native/protocol/src/diagnostics.cpp)；[native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；D-13 all three old policy scopes reject while current synthetic envelopes contain no logged content, D-15 trace stop extend cap and all trace modes redact sentinels, D-15 trace duration boundary 0, D-15 trace duration boundary 1, D-15 trace duration boundary 60000, D-15 trace duration boundary 60001, D-15 trace stop extend cap and all trace modes redact sentinels, D-15 explicit trace reports monotonic remaining and expires | closed-scoped-synthetic |
| T-06-11 | R | diagnostic evidence | medium | mitigate | [tests/protocol-recovery.test.cjs](../../../tests/protocol-recovery.test.cjs)；[docs/phase06/LIMITS.md](../../../docs/phase06/LIMITS.md)；D-16 threshold neighboring requested retry windows 499, D-16 threshold neighboring requested retry windows 500, D-16 threshold neighboring requested retry windows 501, D-16 persistent action appears only after 500ms and then clears, protocol_multistream | closed-scoped-synthetic |
| T-06-12 | D | C ABI/Dart disposal | high | mitigate | [packages/selene_native/lib/src/protocol.dart](../../../packages/selene_native/lib/src/protocol.dart)；[native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；stop-timeout, boundaries | closed-scoped-synthetic |
| T-06-13 | T | CI source/build inputs | high | mitigate | [scripts/build-protocol.cjs](../../../scripts/build-protocol.cjs)；[scripts/verify-protocol.cjs](../../../scripts/verify-protocol.cjs)；protocol_tracer | closed-scoped-synthetic |
| T-06-14 | R | evidence validator | high | mitigate | [scripts/verify-protocol.cjs](../../../scripts/verify-protocol.cjs)；[tests/protocol-evidence.test.cjs](../../../tests/protocol-evidence.test.cjs)；protocol_tracer | closed-scoped-synthetic |
| T-06-15 | E | mobile/child runner | high | mitigate | [scripts/run-protocol-target.cjs](../../../scripts/run-protocol-target.cjs)；stop-timeout, protocol_control | closed-scoped-synthetic |
| T-06-16 | I | CI diagnostic artifacts | high | mitigate | [scripts/tool-runner.cjs](../../../scripts/tool-runner.cjs)；[scripts/verify-protocol.cjs](../../../scripts/verify-protocol.cjs)；D-13 all three old policy scopes reject while current synthetic envelopes contain no logged content, D-15 trace stop extend cap and all trace modes redact sentinels | closed-scoped-synthetic |
| T-06-17 | D | full matrix completion | medium | mitigate | [scripts/run-protocol-target.cjs](../../../scripts/run-protocol-target.cjs)；[scripts/verify-protocol.cjs](../../../scripts/verify-protocol.cjs)；protocol_control, protocol_multistream | closed-scoped-synthetic |
| T-06-18 | D | recovery retry | high | mitigate | [native/protocol/src/session_lifecycle.cpp](../../../native/protocol/src/session_lifecycle.cpp)；[native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；D-05 actual transport loss preserves bounded manual wait and same handle fresh retry, D-05 real refused fresh socket three attempts exhaust to manual, D-05 real refused fresh socket retry cancellation, D-08 repeated stream recovery advances only that stream key, D-08 stream retry window boundary 0, D-08 stream retry window boundary 1, D-08 stream retry window boundary 3000, D-08 stream retry window boundary 3001, D-08 isolated stream fault preserves healthy video2 audio control and transient disappears, real secure media: loss-video1 | closed-scoped-synthetic |
| T-06-19 | I | Dart status consumer | high | mitigate | [packages/selene_native/lib/src/protocol.dart](../../../packages/selene_native/lib/src/protocol.dart)；D-13 all three old policy scopes reject while current synthetic envelopes contain no logged content, D-15 trace stop extend cap and all trace modes redact sentinels | closed-scoped-synthetic |
| T-06-20 | E | control mode/provider | high | mitigate | [native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；[native/protocol/src/internal.h](../../../native/protocol/src/internal.h)；no-provider | closed-scoped-synthetic |
| T-06-21 | T | ACTL framing/binding | high | mitigate | [native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；schema, sequence, digest, replay, required, truncated | closed-scoped-synthetic |
| T-06-22 | D | dispatcher/stop barrier | high | mitigate | [native/protocol/src/control.cpp](../../../native/protocol/src/control.cpp)；boundaries, stop-timeout | closed-scoped-synthetic |
| T-06-SC | Tampering | native source-build dependencies | high | mitigate | [native/protocol/CMakeLists.txt](../../../native/protocol/CMakeLists.txt)；[protocol/dependencies.lock.json](../../../protocol/dependencies.lock.json)；actual native media security: fec-golden, cipher_driver, test_srtp | closed-scoped-synthetic |

## 实际证据与接受风险

本次formal all实际exit0，在线核对原CI12目标、固定源与产物、具名control/media/recovery及FFI；独立证据85/85通过。当前DLL16导出无fixture/inject入口，实际compile无AETHER_CONTROL_FIXTURE，TLS拒绝/observer/occupied-lease具名原日志通过。完整命令/rawSHA及来源清单见[UAT机器审计](../../../docs/phase06/06-UAT-AUDIT.json)。没有仅依靠SUMMARY声明关闭威胁。

未新增或推定任何接受风险；所有原登记项以实现和现有原型行为证据关闭。生产authority、真实codec/设备/HDR、非loopback网络、Apple实机和TSan仍是既有后续验证义务。

## 审计记录

| 日期 | 登记威胁 | 当前范围closed | blocking open | 执行者 |
|---|---:|---:|---:|---|
| 2026-10-13 | 23 | 23 | 0 | 当前Codex内联，gsd-secure-phase L1 |

安全post-hook完成；Phase6整体仍受UAT第8–10项insufficient_spec及原flag边界约束，不自动推进。
