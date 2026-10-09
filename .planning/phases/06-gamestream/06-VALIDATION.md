---
phase: "06"
slug: gamestream
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-10-09"
---

# Phase 06 — Validation Strategy

本文件是执行期验证契约；所有新入口尚未创建，命令是计划目标，不是本轮已运行证据。规划代理应同步实际任务编号、测试名和命令，保留 draft/false 直到执行和审计取得证据。

## Test Infrastructure

| Property | Value |
|---|---|
| Framework | C++20/CMake/CTest native contracts; Node built-in test process/evidence harness; iOS XCTest |
| Config file | native/protocol/CMakeLists.txt（Wave 0 新建，独立于 Windows driver） |
| Quick run command | ctest --test-dir build/phase06/windows-x64 -C Release -R protocol --output-on-failure --no-tests=error |
| Full suite command | node --test tests/protocol-process.test.cjs tests/protocol-evidence.test.cjs |
| Estimated runtime | 未测；快速反馈目标30秒，完整故障/平台矩阵单独记录实际时长 |

## Sampling Rate

- 每任务提交：相关 native contract 或过程测试；每波运行完整协议检查。
- 人审和最终验证前：完整协议检查与五目标真实 CI 成功，零测试/跳过不能作为通过。
- 每命令非零、missing target、超时、缺case、skip、无成功摘要都是失败；声明所有预期case和分母。
- 尚无入口先完成 Wave 0；不使用 watch，不将假时钟或模拟吞吐当作端到端性能。

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---|---|---|---|---|---|---|---|---|---|
| 06-01 | 01 | 1 | NET-01/02/03 | 由计划唯一编号 | 身份校验、共同版本、拒绝超限和错误认证 | native+process | ctest --test-dir build/phase06/windows-x64 -C Release -R protocol --output-on-failure --no-tests=error | W0 | pending |
| 06-02 | 02 | 2 | NET-01/02/03 | 由计划唯一编号 | 两流双向、确认前零grant、auth/replay/FEC边界、独立恢复 | process | node --test tests/protocol-process.test.cjs | W0 | pending |
| 06-03 | 03 | 3 | NET-02/03 | 由计划唯一编号 | 五目标真实构建与可运行检查；秘密零日志 | evidence | node --test tests/protocol-evidence.test.cjs | W0 | pending |

## Wave 0 Requirements

- [ ] 独立 native/protocol 合同构建根、真实 socket 双进程 tracer 与独立 golden wire/密码已知答案向量。
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
