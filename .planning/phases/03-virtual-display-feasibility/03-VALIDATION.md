---
phase: "03"
slug: "virtual-display-feasibility"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-10-08"
---

# Phase 03 — Validation Strategy
**需求修订优先级（2026-10-08）：** [SudoVDA需求修订R1](../../../docs/phase03/SUDOVDA-REQUIREMENTS-REVISION.md)覆盖旧Win10 HDR必需场景；Win10七屏全SDR，Win11 D2 HDR。SudoVDA是优先候选，允许受控watchdog=0配置与精确60Hz有理数约分核验；许可/签名/ACL/实机门槛仍有效。用户续行后R1准入补证完成，未解锁03-02/03-03系统接入。


本文件是执行时的验证合同。03-01-01/02只读路径与准入档案已实现并通过针对性验证；03-01-03已记录选项2与hash，SudoVDA补证完成仍无provider获准接入。尚无七屏/HDR/driver生命周期实机通过证据，VDP-01/02仍未完成；status/draft与两个false标志保留。

R1后续用户 `1` 已批准独立派生准备并绑定新档案hash；[准备结果](../../../docs/phase03/HELIOS-DISPLAY-PREPARATION.md)记录真实Release x64 unsigned构建、INF2084 warning、许可与签名方案。11/11针对性测试通过，默认require-decision已通过；准入和system authorization仍拒绝。用户严禁重启/关闭开发机，需要此类操作的实机检查保持未执行；不自动请求重复路线批准或重启。

## Test Infrastructure

| Property | Value |
|---|---|
| Framework | 现有 Node node:test、CMake/CTest 与独立 PowerShell build/verify |
| Config file | CMakePresets.json、tests/*.test.cjs；新增阶段测试由 Wave 0 建立 |
| Existing planning check | `node --test tests/planning.test.cjs`；`node scripts/validate-planning.cjs` |
| Proposed quick run | `node --test tests/virtual-display-contract.test.cjs tests/virtual-display-package.test.cjs` |
| Proposed machine entry | `pwsh -NoProfile -File scripts/check-virtual-display.ps1 -Mode Machine -Scenario All -Configuration Release -Authorization HASH -Output PATH`；HASH/PATH必须来自具体获准计划与本次实际输出，不是可直接执行的示例 |
| Existing build | `pwsh -NoProfile -File scripts/build.ps1 -Target Helios -Configuration Debug`（Release 同入口） |
| Existing full regression | `pwsh -NoProfile -File scripts/verify.ps1 -Scope All -Automation -CleanCheckout` |
| Runtime budget | 确定性 quick 目标 <30s，执行后记录实测；既有 All 与机器场景独立计时，不宣称 <30s |

## Sampling Rate

- 每个任务提交后运行针对性 quick；每个 wave 运行该 wave 原生合同与 Helios 子进程测试。
- 新增脚本/测试须先创建再执行；不得以不存在路径、0 tests、跳过或 fake 报告作为通过。
- 最终验证前完成 Debug/Release 构建、原有回归、包准入、Win10/11 实机矩阵和人审。
- 普通命令拟定总预算 10s、锁等待 2s、现实枚举最多 3 次。安装/下载/机器等待使用独立有界预算；watchdog 等待必须超过实际查询周期，不能凭固定短等待推断保活。

## Per-Task Verification Map

任务号与03-01/02/03计划一致；每条命令的observable失败方向在任务verify中紧邻声明。checkpoint后才验证匹配的具体决定，不运行未授权机器动作。

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---|---|---|---|---|---|---|---|---|---|
| 03-01-01 | 01 | 1 | VDP-01/02 | T-03-03 | 真实只读OS查询，拒绝未知/访问错误推断支持 | native+CLI | `ctest --test-dir build/native -C Debug -R "^virtual_display_probe$" --output-on-failure --no-tests=error` | ✅ 已创建 | passed Debug/Release只读范围 |
| 03-01-02 | 01 | 1 | VDP-01/02 | T-03-01/02/SC | 固定包/成员签名/许可/设备ACL，分层门禁无循环 | package | `node --test tests/virtual-display-package.test.cjs`；`node scripts/check-virtual-display-admission.cjs --stage dossier` | ✅ 已创建 | passed 包9/9及R1 dossier；原candidate准入仍拒绝 |
| 03-01-03 | 01 | 1 | VDP-01/02 | T-03-01/02 | 具体路线或无候选决定；无系统操作授权 | decision | `node scripts/check-virtual-display-admission.cjs --stage dossier --require-decision` | ✅ 01-02已创建 | 历史决定与R1用户1均通过；派生研究准备完成，仍无合格provider或系统授权 |
| 03-02-01 | 02 | 2 | VDP-01/02 | T-03-04/05/06/07 | 跨CLI稳定ID/OS caller/锁/journal/last-success/拥有资源 | native+child-process | `ctest --test-dir build/native -C Debug -R "^virtual_display_(tracer\|registry)$" --output-on-failure --no-tests=error` | ❌ 本任务创建 | pending |
| 03-02-02 | 02 | 2 | VDP-01/02 | T-03-06/08/09 | 七slot/严格60/1/HDR/物理布局/手动恢复/窗口独立 | native+CLI | `node --test tests/virtual-display-contract.test.cjs`；计划内5项精确CTest | ❌ 本任务创建 | pending |
| 03-03-01 | 03 | 3 | VDP-01/02 | T-03-10/11/12/SC | 无副作用install plan、仅显式更新、旧包回滚/手动重启 | package+CLI | `node --test tests/virtual-display-package.test.cjs`；`pwsh -NoProfile -File scripts/check-virtual-display.ps1 -Mode Contract -Configuration Release` | ❌ 本任务扩展/创建 | pending |
| 03-03-02 | 03 | 3 | VDP-01/02 | T-03-11/12 | 精确机器/场景/包hash授权；不泛化许可 | decision | `node scripts/check-virtual-display-admission.cjs --stage authorization --require-decision` | ❌ 01-02创建 | pending |
| 03-03-03 | 03 | 3 | VDP-01/02 | T-03-12/13 | Win10/11机器与合同分开；诚实记录未完成，不先验人审 | evidence+machine | `node --test tests/virtual-display-evidence.test.cjs`；`node scripts/check-virtual-display-evidence.cjs --allow-incomplete` | ❌ 本任务创建 | pending |
| 03-03-04 | 03 | 3 | VDP-01/02 | T-03-13 | checkpoint_protocol强制暂停；阻碍具体决定，原目标不变 | blocking-human+evidence | 用户回应后：`node scripts/check-virtual-display-evidence.cjs --allow-incomplete --require-review`；`node scripts/check-virtual-display-evidence.cjs --require-complete` | ❌ 03-03创建 | pending |

## Wave 0 Requirements

T-03-SC唯一规范登记位于03-01-PLAN.md；03-02/03-03 threat_model明确引用同一控制，表中SC均定位这一共享记录。03-03共4任务：两个≤5文件实现切片与两个协议检查点，最终require-complete只在03-03-04真实用户回应后运行。

- [ ] package test：错误来源/hash/签名/版本/架构、下载断流、提权拒绝、重启与回滚失败。
- [ ] contract test：四组七 slot、不同规格/同规格身份、严格拒绝、跨进程保活、并发同名、pending journal、每个 provider 调用/登记提交失败与崩溃注入。
- [ ] 原生 fake 与真实 CLI 子进程验证：fake 仅证明合同，不证明 driver 支持。
- [ ] machine proof schema/checker：输入 SHA、OS/GPU/IddCx/provider/签名、request/actual、四层身份、前后拓扑、独立图、影响范围、日志/退出码/耗时、人审。
- [ ] 不引入新 registry 测试框架；CI 不自动安装驱动。

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| 正式包/默认安全配置安装、更新/回滚 | VDP-02；D-13–16 | 管理员系统动作需具体方案和实际包 | 先审阅来源/签名/许可/影响/回滚范围并获准；用户严禁重启/关闭开发机，开发机需要这些操作时退出并记录未执行；其他测试环境须单独授权 |
| 四组七屏独立内容与 SDR/HDR 共存 | VDP-01；D-05–08 | OS/GPU/provider 条件不能由 fixture 证明 | Win10/11 分开记录 A1 1080p、A2 1440p、B1/C1/C2/D1/D2 1080p，全部 60/1；Win10 D2 SDR、Win11 D2 HDR，其余 SDR；原始refresh约分后须为60/1，查询实际颜色并观察独立图 |
| CLI 全退出后保活、删除 B 保留 A/C/D | VDP-01/02；D-02/09/12 | 持久驱动行为/共享故障需要观察 | 关闭所有 CLI/Ping owner 后超过实际 watchdog 周期，再从新 CLI 查询；已获准watchdog=0需记录禁用、配置回读、owner退出与明确有界观察窗口；删除 B 前后比对身份、配置、内容和物理布局 |
| 驱动重置与显式恢复 | VDP-02；D-11 | 故障会影响共享设备，须受控授权 | 保存最后成功状态；故障后查询差异，只按指定组恢复；记录逻辑/系统身份和布局变化及实际故障范围 |
| 最终生产可行性/支持条件人审 | VDP-01/02 | 签名/许可/Win10/11 功能证据需具体决定 | supported/unsupported/environment-unavailable 分列；按R1区分Win10七屏SDR和Win11 D2 HDR，不减少屏数或将显式HDR请求改SDR冒充通过；缺门槛保持需求未完成 |

## Validation Sign-Off

- [ ] 全部任务有 automated verify 或明确 Wave 0 依赖。
- [ ] 不连续三个任务缺自动检查；所有命令陈述非零退出/缺记录等失败信号。
- [ ] 新测试入口实际存在且有非零用例，非 watch 模式。
- [ ] 来源/签名/许可、短 CLI、严格模式、七屏与 Win10/11 证据门槛满足。
- [ ] quick 实测预算记录；机器证据没有由 fake 替代。
- [ ] 实现与验证实际完成后才能设置 nyquist_compliant/wave_0_complete。

**Approval:** pending execution；本次仅规划。
