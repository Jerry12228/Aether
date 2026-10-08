---
phase: 03-virtual-display-feasibility
plan: "01"
status: halted
subsystem: windows-display-provider
tags: [windows, ccd, setupapi, provider-admission, supply-chain]
requires:
  - phase: 02-monorepo-flutter
    provides: Windows C++20 Helios local skeleton and ABI1
provides:
  - Real read-only Helios CCD and present-device enumeration
  - Five-candidate dossier and layered fail-closed admission checks
affects: [03-02, 03-03, 17-display-lifecycle]
tech-stack:
  added: []
  patterns: [Helios-only native provider contract, explicit unknowns and evidence gates]
key-files:
  created: [native/platform/include/aether/virtual_display.h, native/platform/windows/virtual_display_provider.cpp, tests/native/virtual_display_contract.cpp, scripts/check-virtual-display-admission.cjs, tests/virtual-display-package.test.cjs, docs/phase03/PROVIDER-ADMISSION.json, docs/phase03/PROVIDER-ADMISSION.md]
  modified: [apps/helios/main.cpp, CMakeLists.txt, .planning/phases/03-virtual-display-feasibility/COVERAGE.md]
key-decisions:
  - No provider selected; blocking-human decision 03-01-03 awaits actual user response
  - No installation, update, reset, topology change or provider IOCTL performed
requirements-planned: [VDP-01, VDP-02]
requirements-completed: []
actuals:
  tasks: 2
  commits: 4
duration: 23 min measured between first RED commit and checkpoint; preflight not timed
completed: "2026-10-08"
halted_at: "2026-10-08T12:53:53Z"
coverage:
  - id: readonly-probe
    description: Helios query/driver check crosses native Windows enumeration and exits without mutation
    verification:
      - kind: integration
        ref: ctest Debug and Release virtual_display_probe
        status: pass
    human_judgment: false
  - id: dossier-guards
    description: Honest unknowns and five candidates are reviewable; unsafe/missing evidence cannot enter admission
    verification:
      - kind: unit
        ref: tests/virtual-display-package.test.cjs (7 tests)
        status: pass
      - kind: other
        ref: node scripts/check-virtual-display-admission.cjs --stage dossier
        status: pass
    human_judgment: false
  - id: provider-decision
    description: Choose exact admitted provider or no-qualified-provider with concrete next research/evidence action
    verification: []
    human_judgment: true
    rationale: blocking-human 03-01-03 pending; no actual human reply and no admitted candidate
---

# Phase 03 Plan 01 — read-only probe and provider admission checkpoint

**真实Windows枚举与五候选准入档案已完成；没有合格provider，03-01-03等待具体人类路线决定。**

## Completed tasks and commits

| Task | Result | Commits |
|---|---|---|
| 03-01-01 | query / driver check / group-not-found，原生错误/竞态/deadline与mutation拒绝；真实新进程查询现实不变 | RED `8f620ec`; GREEN `7ff47c6` |
| 03-01-02 | 五候选来源/接口/许可/包/安全分层档案，VDD真实archive/CAT成员审计，完整已知方法面 | RED `7b4f785`; GREEN `d08d27f` |
| 03-01-03 | **Pending**；未写用户答复、决定时间或批准hash | none |

10个计划声明文件实际新增/修改。工作分支`codex/phase-03-virtual-display-feasibility`；生产代码不读取、链接或修改references/upstream。

## Evidence and verification

- Native RED：实际Helios `vdisplay query --json`退出2/Unknown argument，对目标行为断言失败；CTest JUnit为1项failed。`check tdd-red-evidence`=RED_EVIDENCE_OK。
- Package RED：目标`dossier preserves honest unknown evidence and explicit gaps`因不存在准入checker触发明确断言；实际6项failed，TAP解析=RED_EVIDENCE_OK。原始RED XML/TAP与记录在忽略的`artifacts/phase03/native-red.*`和`package-red.*`；不是构建/语法错误当RED。
- `cmake --preset windows-core`、Debug/Release build通过。Debug virtual_display_probe 1/1（0.11s）；Release CTest 4/4（2.45s），含core tracer/lifecycle/adapters。真实query → check → query完整actual/devices一致；访问拒绝、3次竞态、有界超时、unknown和未准入mutation拒绝为合同注入，产品无此显示测试hook。
- 现有Helios实际进程回归Debug2/2、Release2/2通过，包括Ctrl+C和原core清理。没有重新跑完整Phase2 GPU/FFI/clean CI套餐，本阶段尚未到最终验证。
- 包测试最终7/7，无skip；规划fixture1/1，`validate-planning.cjs` PASS：42 phases / 105需求映射与local links。针对性包反馈约0.10s。
- dossier门通过，digest `fe4ab0c03e59eda9a0b3ee655ca0152900b3d20d24e775cae2d6972b501e6ea8`。五候选admission分别拒绝；`--require-decision`非零为**预期的人类检查点缺口**，不是已通过。
- 本机Win11 26100、1条foreign/unattributed活动路径2240×1400 @30000/1000，advanced color enabled=false、HDR未核验。已有SudoMaker0.22.37.632与Oray17.50.19.949；不认领、升级或删除。详情和命令合同见`docs/phase03/PROVIDER-ADMISSION.md`。
- VDD官方25.7.23小包实测132118bytes及SHA256与release digest相同；NTamd64 INF DriverVer11.30.4.434与release tag分开。CAT Authenticode Valid、INF/DLL /pa CAT成员通过，XML不在CAT；/kp为1只是具体kernel-policy诊断，UMDF适用政策/默认安全安装未验证。

## Admission limits and threats

SudoVDA对应源码/DLL/独立许可/正式信任链缺口、all-users设备读写+FILE_ANY_ACCESS high风险、watchdog短命令持久性均开放。VDD全局count/reload与随机container不足以满足逐组生命周期，pipe/device ACL、源码/二进制对应和独立包许可开放。Microsoft样例、Rust候选与Parsec完整来源/接口/正式包均不齐。

T-03-01/02/SC通过**拒绝未准入接入**约束当前边界；没有把上游风险写成已修复。T-03-03的错误/unknown与fixture/实际证据分层负例已执行。原03-EDGE-PROBE的2条unclassified和descriptorless prohibitions均未改写。

七屏全规格、D2真实HDR、Win10/11原型、driver persistence、隔离恢复/更新/回滚均未证明，VDP-01/02保持Pending。Nyquist/wave0保持false；构建/只读观察不等于支持。

## Deviations and issues

- [Rule 3 — workflow protection] 起始HEAD在master；GSD提交协议禁止protected/default branch写提交，建立codex/phase-03-virtual-display-feasibility承载本轮执行。没有修改项目branching_strategy。
- [Rule 3 — environment] 默认沙箱禁止Git元数据、Node隔离/子进程和CIM；具体Git/只读查询/测试经自动审批后通过。原始EPERM和受限planning spawn不是产品回归；完全相同测试在获准环境重跑通过。
- [Rule 1 — implementation correction] CM_Get_DevNode_Status使用SDK ULONG输出再赋值uint32_t；真实VDD INF是UTF16LE，解析按BOM；release tag与DriverVer不能字符串强制相等。修正后native/包/规划检查通过。UMDF和kernel签名政策分开，不以/kp诊断单独判断UMDF生产支持。

未扩张架构、未引入常驻owner或安装器。`requirements-completed`保持空（需求仍未完成），避免按模板复制VDP数组制造已完成结论；原计划覆盖保存在requirements-planned。

## Checkpoint and resume

**Gate:** 03-01-03 / checkpoint:decision / blocking-human。建议当前no-qualified-provider，需用户明确选择后续补SudoVDA来源/独立许可/ACL/持久性证据，或进一步固定审计替代公开源码provider并提出可审阅架构/签名方案。

收到实际答复后：保留原文与时间，在JSON中记录决定及当前dossier hash；按`--stage dossier --require-decision`核验。无合格候选时保持03-02/03-03阻断与VDP/Phase3未完成；不要把本SUMMARY存在解释为已获得准入或批准安装。若后来出现合格provider，必须通过真实admission并重新审阅具体路线，才可重写halted状态。

## Self-check

**PASSED for tasks 03-01-01/02 only.** 两任务已提交、文件存在、针对性验证通过、来源/未知状态未虚构。**Plan intentionally HALTED; human task pending; Phase3 NOT COMPLETE.**
