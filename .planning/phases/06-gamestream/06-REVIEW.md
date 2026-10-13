---
phase: 06
review_depth: standard
reviewer: 当前Codex内联；无独立agent或外部lane
source_commit: 4edaf0352ca1b875e3536fe54970e8b85585c794
input_digest: 7ca1594252b56ee2fe36d99d13ad1b63e4f2ca69eead8784a29503d714ce2369
status: passed-inline-remediation
resolved: 3
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
files_reviewed_list:
  - native/protocol/include/aether/protocol.h
  - native/protocol/src/internal.h
  - native/protocol/src/protocol.cpp
  - native/protocol/src/control.cpp
  - native/protocol/src/admission.cpp
  - native/protocol/src/secure_transport.cpp
  - native/protocol/src/media_packetization.cpp
  - native/protocol/src/session_lifecycle.cpp
  - native/protocol/src/diagnostics.cpp
  - native/protocol/tools/tracer.cpp
  - native/protocol/tools/test_udp_bridge.cpp
  - scripts/build-protocol.cjs
  - scripts/run-protocol-target.cjs
  - scripts/verify-protocol.cjs
  - scripts/android-protocol-vm.cjs
  - scripts/android-protocol-runner.cjs
  - scripts/android-protocol-bridge.cjs
  - packages/selene_native/lib/src/protocol.dart
  - packages/selene_native/lib/src/protocol_bindings.g.dart
  - tests/protocol-evidence.test.cjs
  - tests/protocol-recovery.test.cjs
  - tests/protocol-tracer.test.cjs
  - tests/protocol-multistream.test.cjs
  - tests/protocol-ffi.test.cjs
  - tests/native/protocol_control.cpp
  - tests/native/protocol_contract.cpp
  - tests/native/protocol_media_security.cpp
  - tests/native/ios/ProtocolContract.mm
  - native/protocol/CMakeLists.txt
  - .github/workflows/protocol.yml
---

# Phase06 标准源码审阅（最终修正复核）

2026-10-12T13:27:47.853Z：复核首轮30文件范围及全部后续差异，当前open critical/warning/info0、resolved3。首轮原字节保留在06-REVIEW-FIRST.md及186a8ba历史提交；中间报告保留Git历史，当前报告绑定实际12/12新矩阵4edaf03/input7ca15942，不重标旧运行。内联执行，不声称独立agent、外部审阅或TSan。

| ID | 原分类 | 修正与实际证据 |
|---|---|---|
| CR-01 | BLOCKER | FPS分母乘15的32位溢出。8fbd20b原D11内真实RED（107374182≠858993462）；e9e61ac先用uint64_t计算，只有阈值小于uint32_t分子时安全窄化。独立PID/TLS同例GREEN，当前全矩阵通过。 |
| CR-02 | BLOCKER | 固定五SSRC空间迟校验。8fbd20b原boundaries公开CABI RED（open0≠25）；e9e61ac在typed3创建worker前和legacy2 full-media GRANT前校验base≤UINT32_MAX-4，通用create/legacy单流范围保留。0685a70修正新fixture未打开control时的通用ACK清理；child34/34、parent4/4 GREEN，当前全矩阵通过。 |
| CR-03 | BLOCKER | 固定quarter-TTL reserve会早于真实deadline关闭接收。a0faff1在现有fec-golden内以独立编码、真实SRTP/UDP排队帧和5ms实际截止取得RED；01b2a8f使用真实deadline接收，解码前后过期检查、TTL25ms/64包/队列上限保持。原同例GREEN，当前全矩阵通过。 |

相关RED/GREEN/source/rawSHA/失败保留见REVIEW-BOUNDARY-RED/GREEN、MEDIA-DEADLINE-RED、MEDIA-WINDOW-GREEN。无参数错误、编译失败或执行器准备超时被计作行为RED。

## 测试观察和执行器复核

e0e2c0a的test-only opcode100避免重复缓存窗口：保留每项请求delay及原action deadline，只读取实际worker新进展，不改原断言、恢复300/500/900ms、产品query或事件。原Mac D08两个快照progress13/video2/audio9重复的真实RED保留；额外本地确定性fail-before-fix注入未做，当前Mac原D08/全部17组实际通过作为GREEN，不能宣称100ms硬SLO。

0a14023对固定官方URL的429/5xx/网络请求最多3次、1/2s退避，并共享原构建总预算；每次仍SHA/size/notice强校验，404/错误hash/cache/过期预算不豁免。6项实际下载函数隔离故障检查通过（不宣称平台运行）。自有guest的zygote/surfaceflinger逐项请求stop并观察真实stopped，所有命令exit0/30s界限/UID恢复与实际退出保留；不捕获255后伪报成功。protocol-full多流27case使用计划允许60s聚合，per-case10s/native安全5s和fast30s不改。Apple执行器30分钟准备总预算仍在原45分钟job内，协议与单case时钟不改；当前两个sim各42项真实XCTest完成。

停止/重连使用atomic和mutex、队列/消息/预算受检界限、mutual TLS证书/SAN/hostname及标准alert拒绝、SRTP逐方向/stream/role/key隔离和认证后FEC边界均未出现新的可证明绕过。test-only authority注册未进入产品DLL，真实FFI21host dispose后callback0/owned0。Root旧Helios/11fixtures隔离回归通过。

最终实际CI38252266760 12/12、正式all exit0、本机Windows15/85、FFI22/21、自有AVD115/85及根11通过；FFI经典路径alias为原清单完全相同字节的新兼容归档，原始归档与receipt保留，无validator或原生输入变更。

Task2自动门槛满足；Task3待真人确认具体材料。原六禁止与三unclassified仍flagged-unverified/null，不吸收为passed；Apple物理/真实codec/设备/生产authority/非loopback网络/minimumOS/SLO及TSan未验证，后续owner保持。Phase3 halted与禁开发机重启/关机保持。
