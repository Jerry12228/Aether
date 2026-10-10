---
phase: "06"
slug: gamestream
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-10-09"
---

# Phase 06 — Validation Strategy

本文件是执行期验证契约。06-01具体ADR与06-02独立Botan复用原答复1均已记录。06-02全三任务完成，最终Debug node46/46（14,213.3037ms）/CTest10/10（24.48s），独立ASan Release node46/46（16,892.4128ms）/CTest10/10（26.72s），fail/cancel/skip/TODO0。实际保护双向五synthetic流、认证后FEC、公开边界和同窗口隔离已运行；候选原12/12/81KAT/42组合/1,600并发保留独立历史研究。ASan不覆盖预编译OpenSSL，非leak/TSan认证。06-06/03/04/05未执行，尚不存在入口仍是目标；阶段2/6及NET未完成，保留draft/false直到全阶段执行与审计取证。

## Test Infrastructure

| Property | Value |
|---|---|
| Framework | C++20/CMake/CTest native contracts; Node built-in test process/evidence harness; iOS XCTest |
| Config file | native/protocol/CMakeLists.txt（Wave 0 新建，独立于 Windows driver） |
| Quick run command | node --test tests/protocol-tracer.test.cjs（06-01-01创建后；其余任务使用对应定向suite） |
| Full suite command | node --test tests/protocol-tracer.test.cjs tests/protocol-multistream.test.cjs tests/protocol-recovery.test.cjs tests/protocol-ffi.test.cjs tests/protocol-evidence.test.cjs；五目标证据另运行独立verify |
| Estimated runtime | 当前02 Debug node14.213s/CTest24.48s、ASan node16.892s/CTest26.72s；快速目标30秒，完整恢复/平台/量测仍未运行 |

## Sampling Rate

- 每任务提交：相关 native contract 或过程测试；每波运行截至该波已经创建的完整协议检查，不能运行尚不存在的下波入口。
- 人审和最终验证前：完整协议检查与五目标真实 CI 成功，零测试/跳过不能作为通过。
- 每命令非零、missing target、超时、缺case、skip、无成功摘要都是失败；声明所有预期case和分母。
- 尚无入口先完成 Wave 0；不使用 watch，不将假时钟或模拟吞吐当作端到端性能。

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---|---|---|---|---|---|---|---|---|---|
| 06-01-01 | 01 | 1 | NET-01/02/03 | T-06-01–04/SC | 双PID真实安全socket、共同版本/身份/长度拒绝、资源停止 | native+process | node --test tests/protocol-tracer.test.cjs | yes | pass scoped prototype |
| 06-01-02 | 01 | 1 | NET-01/02/03 | T-06-01/02/SC | 独立golden/KAT、完整字段/原设置、D01–04/13 | vectors+process | node --test tests/protocol-tracer.test.cjs | yes | pass automated19/19; ADR candidate |
| 06-01-03 | 01 | 1 | NET-01/02/03 | T-06-01–04/SC | 具体ADR/来源/原设置决定绑定hash | process+真人决定 | node --test tests/protocol-tracer.test.cjs | yes | pass19/19 + real reply1; reviewed hash0cdda0d2 |
| 06-02-01 | 02 | 2 | NET-01/02/03 | T-06-05/09 | 真实双video、独立安全域/故障/owned清理 | process+fault | node --test tests/protocol-tracer.test.cjs tests/protocol-multistream.test.cjs | yes | pass scoped; finalDebug/ASan46/46, fullCTest10/10 each |
| 06-02-02 | 02 | 2 | NET-01/02/03 | T-06-05/06/09/SC | audio/双向synthetic、认证后FEC、replay/key epoch/nonce exhaustion | process+fault | node --test tests/protocol-tracer.test.cjs tests/protocol-multistream.test.cjs | yes | pass integrated synthetic; real reuse reply1; Debug/ASan46/46 |
| 06-02-03 | 02 | 2 | NET-01/02/03 | T-06-05/06/09 | 独立golden/KAT、±1/头篡改/seqwrap与公开结构 | vectors+process | node --test tests/protocol-tracer.test.cjs tests/protocol-multistream.test.cjs | yes | pass public ABI/options,22 boundaries and exact TLV/profile refusal |
| 06-06-01 | 06 | 3 | NET-01/02/03 | T-06-20/21/SC | typed兼容合同/真实产品client/fixture host/confirm前零媒体 | native+process | ctest --test-dir build/phase06/windows-x64 -C Debug -R "^protocol_control$" --output-on-failure --no-tests=error | W0:06-06-01 | pending |
| 06-06-02 | 06 | 3 | NET-01/02/03 | T-06-20/21/22 | 双PID取消仲裁/GRANT READY闭环、背压/ACK/query/stop/健康流 | native+process | ctest --test-dir build/phase06/windows-x64 -C Debug -R "^protocol_control$" --output-on-failure --no-tests=error | W0:06-06-01 | pending |
| 06-03-01 | 03 | 4 | NET-01/02/03 | T-06-07/08/SC | 完整proposal/资源向量/原子confirm/observer预算 | process+state | node --test tests/protocol-recovery.test.cjs | W0:06-03-01 | pending |
| 06-03-02 | 03 | 4 | NET-01/02/03 | T-06-08/10/11/18 | fresh auth/旧epoch/上行另确认/独立恢复/临时trace | process+state | node --test tests/protocol-recovery.test.cjs | W0:06-03-01 | pending |
| 06-03-03 | 03 | 4 | NET-01/02/03 | T-06-07/10/11/18 | 真实限值量测、D阈值/全原case映射/R1 | measure+state | node --test tests/protocol-recovery.test.cjs；node tests/protocol-recovery.test.cjs --measure --evidence artifacts/phase06/limits.json | W0:06-03-01 | pending |
| 06-04-01 | 04 | 5 | NET-01/02/03 | T-06-12/19/SC | 真实Dart FFI/独立host/socket/完整proposal | FFI+process | dart run ffigen --config protocol/ffigen.yaml；node --test tests/protocol-ffi.test.cjs | W0:06-04-01 | pending |
| 06-04-02 | 04 | 5 | NET-01/02/03 | T-06-12/19/SC | 恢复/trace消费者、ACK/timeout/stop负例和来源总账 | FFI+process | node --test tests/protocol-ffi.test.cjs | W0:06-04-01 | pending |
| 06-05-01 | 05 | 6 | NET-01/02/03 | T-06-13/15/17/SC | 五目标native实际build/run，iOS device与simulator分证据 | target+CI | ctest --test-dir build/phase06/windows-x64 -C Release -R protocol --output-on-failure --no-tests=error（其余目标匹配runner） | W0:06-05-01 | pending |
| 06-05-02 | 05 | 6 | NET-01/02/03 | T-06-13–17 | 独立证据判定，known-bad/0test/skip/hash漂移拒绝 | evidence | node --test tests/protocol-evidence.test.cjs；node scripts/verify-protocol.cjs --scope all --evidence docs/phase06/TARGETS.json | W0:06-05-02 | pending |
| 06-05-03 | 05 | 6 | NET-01/02/03 | T-06-01–19 | 所有门槛先过，真实最终人审精确hash | evidence+真人审阅 | node scripts/verify-protocol.cjs --scope all --evidence docs/phase06/TARGETS.json | W0:06-05-02 | pending |

上述命令失败方向：非零exit、零tests、skip/cancel/TODO、缺具名case/目标/真实log或artifact、source/SDK/arch/dependency/binary hash漂移、timeout、资源未归零。坏证据fixture必须被拒绝；退出0但缺证明亦失败。自动化通过不能代替06-01-03具体决定和06-05-03强制真人审阅。每计划各命令立即附`fails_when`为权威细则。六个顺序wave的已创建suite依次为tracer；+multistream；+protocol_control native；+recovery；+FFI；+evidence与五目标独立verify。长量测实际30秒预热/60秒窗口/3轮，不计作fast用时。

## Substantive Edge Coverage（06-01/02局部实测，其余仍规划）

| Edge | Task/test | Expected boundary |
|---|---|---|
| versions/parse | 06-01-01/02 tracer | 空交集、排序、±1长度、截断/尾随/溢出/重复/未知必需字段明确拒绝；可选字段按明示规则 |
| proposal/资源 | 06-03-01 recovery | stale/replayed/cancelled/expired或预算revision竞争零grant；encoder count不能靠低码率满足；observer不挤占已有资源 |
| 保护/FEC | 06-02-02/03 multistream | source/repair头篡改、跨流/方向/key generation、replay/nonce exhaustion/seqwrap；认证失败不推进高水位/queue |
| 丢包/独立故障 | 06-02-01/02/03、06-03-02 | 阈值内修复、阈值外有界drop、重排/延迟/重复、queue满；video2/audio/control在video1故障窗口健康计数增长 |
| reconnect/epoch | 06-03-02 | fresh auth、空闲/占用/observer、旧input/settings/clipboard/media到达但拒绝；上行另confirm，permission/device失效拒绝 |
| trace/FFI | 06-03-02/03、06-04-01/02 | 到期/bytes/断连关闭、不跨重连、secret/content sentinel；乱序ACK/stop timeout保留安全引用 |
| target/evidence | 06-05-01/02 | iOS device库与XCTest分别；matching ABI/SDK执行；缺log/0test/skip/错误hash的known-bad证据非零 |

06-EDGE-PROBE.json的NET-01/02/03仍3条`unclassified/unresolved`（verification/resolution/reason=null）。本表增加实质测试，不能更改探针分类或自动解决其假设。六条prohibitions仍在各PLAN的must_haves中以无描述符unresolved投影，flagged-unverified；禁止项召回覆盖范围/用户自主/能力证据边界，通用OWASP问题进入threat register而不重复铸造禁止项。

## Target Execution Contract

Windows/Linux/macOS：matching native CTest及不同process socket tracer；Android：NDK按ABI构建+匹配adb目标实际native退出码/count及双process；iOS：iphoneos arm64库构建+独立iphonesimulator XCTest host真实socket/context/向量。每目标build-protocol明确target/arch/config/build-dir，verify-protocol独立执行，不隐式build。缺可运行executor阻断，只有Apple物理功能/性能/安装列VFY-01/02 TODO。完整架构/最低OS差异继续保留原owner，不能靠本阶段一个目标成功提高下限。

## Security Traceability

T-06-01–04→tracer；05/06/09→multistream；07/08/10/11/18→recovery；12/19→FFI；13–17→native target+evidence。T-06-SC每计划沿同一固定依赖来源门槛；新增20–22→control；编号01–22全阶段唯一（原01–17语义保留迁移，新增18有界retry、19 Dart内容边界）。ASVS5 Level1，high/critical未缓解阻断；native官方archive/hash/license/notices审计，不以不支持native的package-legitimacy CLI伪造OK。新增npm/pip/cargo安装才适用其正式gate。

## Wave 0 Requirements

- [x] 独立 native/protocol 合同构建根、真实 socket 双进程 tracer 与独立 golden wire/密码已知答案向量（Windows x64 Debug scoped；不代表五端完成）。
- [ ] 正式库准入：official SHA、archive hash、LICENSE/NOTICE、平台构建选项和产物；引用源码不能进入产品构建。
- [ ] test-only authority/设备 fixture、单调假时钟、有限 userspace loss relay；固定seed及丢包位置，不改系统网络。
- [ ] packet/frame/shard/queue/parse/deadline界限、重试和trace上限；native sink digest、丢失/恢复/认证失败统计。
- [ ] Android runner/emulator 与 Apple SDK/XCTest simulator；iOS device库真实构建；Windows/Linux/macOS native运行。
- [ ] Node process/evidence测试入口和有界进程清理；Selene低频FFI消费者合同。

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| 具体通道替换、安全/wire/依赖和原加密设置处置 | NET-01/02/03 | 关键架构及许可决定 | 审阅真实tracer、固定来源、字段映射、完整ADR/选项后绑定具体材料确认；未选不推进锁定 |
| 最终协议原型证据范围 | NET-01/02/03 | 强制阶段人审 | 审阅五目标run与失败历史、限值测量、D-01–16覆盖及open清单；不能用承认缺口关闭需求 |
| Apple实机功能/性能/安装 | NET-02 | 当前无实机，用户已有TODO例外 | 记录VFY-01/02；仅物理验收延期，Apple目标构建/simulator运行仍为完成门槛 |

## Validation Sign-Off

- [ ] 所有任务有 automated 或已安排 Wave 0。
- [ ] 无连续三个任务缺自动验证；命令都说明可观察失败方向。
- [ ] Wave 0 覆盖所有缺失入口；五目标证据分别追踪，不伪造通过。
- [ ] 无 watch-mode；真实反馈时长已测。
- [ ] 执行后完成审计才设置 nyquist_compliant/wave_0_complete。

**Approval:** pending

06-01具体ADR批准已完成：真实原答复1、recordedAt2026-10-10T03:46:30Z，历史材料摘要已绑定，续跑19/19（4,749.1274ms）。本处Approval pending指全阶段验证/最终人审，不是重复请求同一ADR批准。

06-01局部验证见[completed SUMMARY](06-01-SUMMARY.md)和[批准ADR](../../../docs/phase06/PROTOCOL-ADR.md)；06-02双向五流、认证后FEC/nonce/epoch/queue/public options已完成，见[completed SUMMARY](06-02-SUMMARY.md)、[MEDIA-CONTRACT](../../../docs/phase06/MEDIA-CONTRACT.md)和[实际源码二进制证据](../../../docs/phase06/MEDIA-EVIDENCE.json)。新复用原答复1与历史FEC候选账本不互相覆盖。独立候选ASan12/12及known-bad检测保留；当前Debug/ASan46/46和CTest10/10各通过，无有效用例发现并非leak/TSan/穷尽安全证明。完整权限/预算/恢复/重试/trace/FFI/五目标/最终人审仍未执行；三条edge probe和六条descriptorless禁止项不自动resolved，不因局部通过设置nyquist或wave0 true。


## 2026-10-10 操作合同修订

用户本会话1已授权修订并继续；06-06为wave3新增前置，独立Revision1计划检查0blocker/0warning。CONTROL-CONTRACT明确API/网络版本、权威取消/提交/READY闭环及双PID实际产品DLL client证据。此处pending仍为实施状态，计划检查不是产品通过；旧ABI1/v1/2回归必需。Nyquist/wave0保留false。
