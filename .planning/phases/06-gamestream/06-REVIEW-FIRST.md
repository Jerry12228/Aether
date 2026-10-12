---
phase: 06
review_depth: standard
reviewer: 当前Codex内联；按skill spawn restriction，无子代理或外部lane
source_commit: 03858c115dd215feaa260e73ea14a62be57df7be
input_digest: aceb57872dd46c4decce3cda2f0fe1bbfb5baf36ce67287e61eb4a922fe38fe1
status: findings
findings:
  critical: 2
  warning: 0
  info: 0
  total: 2
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

# Phase06 标准源码审阅（首轮）

当前038输入真实CI12/12和完整独立all已通过；本机Windows15/15、FFI22/22及21host、自有AVD115/115（194316ms）也通过。通过结果不能替代整数边界和准入链的源码检查。当前发现两项明确代码路径问题，Task2保持未完成；修正后的输入须重跑必需矩阵，不请求用户认可已知缺陷。

本轮依照gsd-code-review内联标准模式，不声称独立agent、外部审阅或TSan。Phase3相关安装/显示器脚本不属本次范围。所有引用行号绑定上述source。

## Critical Issues

### CR-01：FPS分母的32位乘法可破坏15fps调整下限

**Classification:** BLOCKER（错误行为）  
**文件：** `native/protocol/src/admission.cpp:34`

`StreamSpec.denominator`是允许非零的`uint32_t`，表达式`15*s.denominator`按32位运算。在`denominator=286331154`时真实下限乘积4294967310被截为14。因此分子858993462所代表的3fps，在带宽不足的desktop提案中会被错误作为高于15fps而反复减半，未按现有下限规则选择分辨率替代。`demand`的64位受检运算并不能防止此处独立溢出。

**建议：** 先用64位计算并比较下限；仅当下限小于当前32位分子时做已证明安全的窄化。将该输入作为现有D-11具名case内额外真实socket断言，保持原60个case；先RED再GREEN，不抬高或删改既有字段范围。

### CR-02：五stream的SSRC空间检查晚于typed open/GRANT

**Classification:** BLOCKER（错误准入顺序）  
**文件：** `native/protocol/src/protocol.cpp:194`、`native/protocol/src/control.cpp:control_open`、`native/protocol/src/media_packetization.cpp:38`

通用create只要求base stream不超过`UINT32_MAX`；version3 fixed profile使用base..base+4，而control_open未提前核验该空间。实际媒体初始化才检查`base<=UINT32_MAX-4`，可能先接受控制/提案/确认后再因不可表示的SSRC拒绝媒体；version2完整媒体分支也在`++grants`之后进入该检查。无效ID必须在准入/授权前明确拒绝，不能依赖晚期初始化异常。

**建议：** 仅对version3 fixed-five-stream control入口及version2明确full-media分支提前应用已有范围规则，不缩小legacy单stream合法范围、不改ABI/wire。在原native boundaries场景加入公开API的错误base open负例；保留31场景/parent65/115分母，先RED再GREEN。

## 其他核验结果与范围

停止意图和重试取消已使用atomic；stop串行mutex/两秒引用保留、结果和ACK队列mutex、固定消息/队列/时钟界限及fixture产品隔离仍存在。X509/hostname/标准certificate alert拒绝没有被TCP关闭分类修正移除；SRTP逐方向/stream/role/key、nonce拒绝及认证后FEC未出现新的绕过。无已证明的跨进程安装/信任/重启副作用。

自有下载adapter的nested ID转正式顶层ID属于证据转换，不改变原始产物；原回执、外部ID/name/digest/head及转换SHA均保留。完整all入口先拒绝不合格回执，规范化后实际exit0。尚未测TSan、Apple物理硬件、生产authority/codec/设备或产品SLO；原六禁止项与三unclassified条目不被本审阅关闭。
