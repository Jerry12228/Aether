---
phase: "06"
slug: gamestream
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-10-09"
---

# Phase 06 — Validation Strategy

本文件是执行期验证契约。06-01/02批准与历史证据、06-06前置交付保留。06-03三任务已完成，最终Debug Node106/106、Debug/ASan CTest12/12（108.14s/109.00s）；父级构建/CTest12/12（108.16s）及658项证据摘要匹配。三轮真实socket量测281648.188ms绑定f853627归档；最终恢复修正另经完整回归。ASan不覆盖预编译OpenSSL，非leak/TSan认证。06-04已完成：当前完整Node107/107、真实Flutter22/22及21独立host场景，协议Debug CTest12/12、根CTest11/11和local core/绑定生成通过。06-05五目标及最终人审尚未完成，尚不存在入口仍是目标；阶段5/6及NET未完成，保留draft/false直到全阶段执行与审计取证。

## Test Infrastructure

| Property | Value |
|---|---|
| Framework | C++20/CMake/CTest native contracts; Node built-in test process/evidence harness; iOS XCTest |
| Config file | native/protocol/CMakeLists.txt（Wave 0 新建，独立于 Windows driver） |
| Quick run command | node --test tests/protocol-tracer.test.cjs（06-01-01创建后；其余任务使用对应定向suite） |
| Full suite command | node --test tests/protocol-tracer.test.cjs tests/protocol-multistream.test.cjs tests/protocol-recovery.test.cjs tests/protocol-ffi.test.cjs tests/protocol-evidence.test.cjs；五目标证据另运行独立verify |
| Estimated runtime | 当前04完整Node101.948s、FFI20.423s、协议CTest107.06s；快速目标30秒；03历史量测281.648s，五目标检查尚未运行 |

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
| 06-06-01 | 06 | 3 | NET-01/02/03 | T-06-20/21/SC | typed兼容合同/真实产品client/fixture host/confirm前零媒体 | native+process | ctest --test-dir build/phase06/windows-x64 -C Debug -R "^protocol_control$" --output-on-failure --no-tests=error | yes | 已通过；06-06-01-EVIDENCE及最终旧ABI/版本1和2回归 |
| 06-06-02 | 06 | 3 | NET-01/02/03 | T-06-20/21/22 | 双PID取消仲裁/GRANT READY闭环、背压/ACK/query/stop/健康流 | native+process | ctest --test-dir build/phase06/windows-x64 -C Debug -R "^protocol_control$" --output-on-failure --no-tests=error | yes | 已通过；Debug/ASan各27场景、client445及父57断言；共享provider与最终证据 |
| 06-03-01 | 03 | 4 | NET-01/02/03 | T-06-07/08/SC | 完整proposal/资源向量/原子confirm/observer预算 | process+state | node --test tests/protocol-recovery.test.cjs | yes | 已通过；首组18/18、最终恢复60/60；全方案及六维共享事务 |
| 06-03-02 | 03 | 4 | NET-01/02/03 | T-06-08/10/11/18 | fresh auth/旧epoch/上行另确认/独立恢复/临时trace | process+state | node --test tests/protocol-recovery.test.cjs | yes | 已通过；真实断线/手动重试/逐流key，完整Debug/ASan恢复60/60 |
| 06-03-03 | 03 | 4 | NET-01/02/03 | T-06-07/10/11/18 | 真实限值量测、D阈值/全原case映射/R1 | measure+state | node --test tests/protocol-recovery.test.cjs；node tests/protocol-recovery.test.cjs --measure --evidence artifacts/phase06/limits.json | yes | 已通过；三轮281648.188ms归档量测、637原case保留及12NET设置映射 |
| 06-04-01 | 04 | 5 | NET-01/02/03 | T-06-12/19/SC | 真实Dart FFI/独立host/socket/完整proposal | FFI+process | dart run ffigen --config protocol/ffigen.yaml；node --test tests/protocol-ffi.test.cjs | yes | 已通过；生成绑定不漂移，真实产品DLL/双PID方案交互；最终Flutter22/22 |
| 06-04-02 | 04 | 5 | NET-01/02/03 | T-06-12/19/SC | 恢复/trace消费者、ACK/timeout/stop负例和来源总账 | FFI+process | node --test tests/protocol-ffi.test.cjs | yes | 已通过；真实22检查/21host、实际STATUS/cancel回执核对，完整Node107/107及local core1+6 |
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
- [ ] Node process/evidence测试入口和有界进程清理；Selene低频FFI消费者合同。（04的process/FFI部分已通过；05独立evidence入口仍待建。）

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

06-01局部验证见[completed SUMMARY](06-01-SUMMARY.md)和[批准ADR](../../../docs/phase06/PROTOCOL-ADR.md)；06-02双向五流、认证后FEC/nonce/epoch/queue/public options已完成，见[completed SUMMARY](06-02-SUMMARY.md)、[MEDIA-CONTRACT](../../../docs/phase06/MEDIA-CONTRACT.md)和[实际源码二进制证据](../../../docs/phase06/MEDIA-EVIDENCE.json)。新复用原答复1与历史FEC候选账本不互相覆盖。独立候选ASan12/12及known-bad检测保留；当前Debug/ASan46/46和CTest10/10各通过，无有效用例发现并非leak/TSan/穷尽安全证明。当时完整权限/预算/恢复/重试/trace/FFI/五目标/最终人审仍未执行；03/04的后续交付见下方独立记录；三条edge probe和六条descriptorless禁止项不自动resolved，不因局部通过设置nyquist或wave0 true。


## 2026-10-10 操作合同修订

用户本会话1已授权修订并继续；06-06为wave3新增前置，独立Revision1计划检查0blocker/0warning。CONTROL-CONTRACT明确API/网络版本、权威取消/提交/READY闭环及双PID实际产品DLL client证据。此处pending仍为实施状态，计划检查不是产品通过；旧ABI1/v1/2回归必需。Nyquist/wave0保留false。

## 2026-10-10 06-06交付记录

06-06两任务及中文摘要已提交：RED7853203/e50c978、GREEN2282dcb/ff081cf、摘要d68b2a6。具名协议向量与最终源码/二进制/原始日志摘要见docs/phase06/06-06-02-EVIDENCE.json及06-06-CONTROL-VECTORS.json。最终Debug/ASan控制各27场景、client445/445和父57/57、fail/skip0；完整Debug11/11（47.71s）、ASan11/11（48.22s），后续受影响control重跑各21.05s/22.89s。父级另核验8个源码hash匹配、构建及CTest11/11（44.36s），schema/UI门槛未阻断，codebase-drift因无STRUCTURE.md跳过。首ASan缺runtime路径导致的环境失败单独保留，未当作行为RED。以上只关闭前置任务，完整预算/恢复/trace由06-03交付，FFI/五目标/最终人审由04/05交付；NET、Nyquist及wave0保持未完成。

## 2026-10-10 06-03交付记录

三任务RED5c3d2f6/6ce3ede/842aa20、GREEN3ec8231/f853627/bce5030、中文摘要23b814e完成。最终Debug Node106/106（旧46+恢复60）、Debug/ASan完整CTest12/12（108.14s/109.00s），控制27场景回归均通过，零fail/skip/cancel/TODO。父级独立集成构建/CTest12/12（108.16s），按各运行dir解析的658项证据路径/hash全匹配；schema/UI门槛未阻断，codebase-drift仍因无STRUCTURE.md跳过。三轮真实socket预热30495/30483/30506ms、窗口61111/61120/61114ms，总281648.188ms，绑定独立保存f853627的13源码/4二进制；最终断线/重复reset/标量统计修正另经完整回归，不改绑量测hash。实际CPU/资源分母与失败历史见LIMITS及06-03-03-EVIDENCE.json。完整637原case与12NET合同保留，两OS标签不是两OS实机证据。此处仅完成06-03，04真实FFI、05五目标与最终人审尚未执行；NET、Nyquist、wave0及3个unclassified/6个descriptorless仍不关闭。

## 2026-10-11 06-04交付记录

用户恢复原答复`1`授权核对并接续已有实现；两任务及摘要adffc87完成，GREEN387a052。完整当前四suite Node107/107（101947.7632ms）包含真实Flutter22/22（20423ms）与21个独立host场景；协议Debug CTest12/12（107.06s）、根CTest11/11（27.00s）、local core1 native+6 Dart及ffigen生成一致，fail/skip/cancel/TODO均0。精确输入/产物及raw logs见[06-04-EVIDENCE](../../../docs/phase06/06-04-EVIDENCE.json)，交付细节见[06-04-SUMMARY](06-04-SUMMARY.md)。Dart独立解析实际wire回执核对事务与host计数；pending STATUS→cancel缺陷先以正式行为RED d03b278复现/提交，再修复test-only FixtureServices绑定，产品DLL未变。原Task1/2编译错误不计合格行为RED，历史Task2运行断言是事后基线复现，保留原TDD偏差。无新增ASan或真实设备/全平台证据，03量测仍绑定f853627。当前5/6，05五目标/独立validator及强制最终人审未执行；NET、Nyquist、wave0及3个unclassified/6个descriptorless不关闭，Phase3独立安装门槛不变。

父级wave5收尾检查：validate-planning为PASS（42阶段、105需求映射、0缺口、链接有效）；coverage分类3/3自动覆盖，无错误；ready-ids仍阻断全部NET，phase-plan-index唯一剩余06-05 ready。schema gate未检测漂移，UI gate无frontend且未阻断；codebase-drift因缺STRUCTURE.md明确skipped。索引将两个历史PLAN-CHECK文档识别为非规范计划名并跳过，它们是审阅报告，不是可执行计划。

## 2026-10-11 06-05准备停点

用户最新`1`已选06-05，准备ff3d776/1b703af、摘要951af81已保存。Task1文件存在仅证明准备：当前workflow为Linux x64首链，其余目标/架构实际运行缺失，Android arm32与iOS完整媒体/FEC适配未完成。Task1行为RED尚未执行，构建失败不计RED；Task2独立validator/known-bad证据及Task3最终人审未执行。表中06-05-01/02/03仍pending，任务0/3，Phase6为5/6，NET/nyquist/wave0和3个unclassified/6个descriptorless不关闭。

本地Debug CTest12/12（110.04s）、新入口Windows x64 Release12/12（103.43s）和真实Flutter22/22（20601ms、21独立host场景）通过。精确Release输入/5产物及本地日志摘要见[准备证据](../../../docs/phase06/06-05-PREPARATION.json)，不是最终TARGETS.json；Debug/FFI早于KAT编译选项修复，不与Release输入改绑。自动审批拒绝远端`git push origin HEAD`，要求具体目的地发布授权；未推送。当前等待公开Jerry12228/Aether整分支及同分支Phase6 CI提交/运行批准，获准后继续实际目标门槛，不能用本次批准关闭Task3。Phase3安装授权独立保持。
