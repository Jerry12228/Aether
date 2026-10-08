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
  - User no-qualified-provider decision and pinned SudoMaker source followup
affects: [03-02, 03-03, 17-display-lifecycle]
tech-stack:
  added: []
  patterns: [Helios-only native provider contract, explicit unknowns and evidence gates]
key-files:
  created: [native/platform/include/aether/virtual_display.h, native/platform/windows/virtual_display_provider.cpp, tests/native/virtual_display_contract.cpp, scripts/check-virtual-display-admission.cjs, tests/virtual-display-package.test.cjs, docs/phase03/PROVIDER-ADMISSION.json, docs/phase03/PROVIDER-ADMISSION.md, docs/phase03/SUDOVDA-EVIDENCE-FOLLOWUP.md, docs/phase03/SUDOVDA-SOURCE-EVIDENCE.json]
  modified: [apps/helios/main.cpp, CMakeLists.txt, .planning/phases/03-virtual-display-feasibility/COVERAGE.md]
key-decisions:
  - No provider selected; user chose no-qualified-provider plus SudoVDA evidence followup (original response 2)
  - No installation, update, reset, topology change or provider IOCTL performed
requirements-planned: [VDP-01, VDP-02]
requirements-completed: []
actuals:
  tasks: 3
  commits: 7
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
    verification:
      - kind: other
        ref: node scripts/check-virtual-display-admission.cjs --stage dossier --require-decision --file docs/phase03/PROVIDER-ADMISSION.json
        status: pass
    human_judgment: true
    rationale: User response 2 recorded with original dossier hash; no-qualified-provider intentionally blocks dependent implementation
---

# Phase 03 Plan 01 — read-only probe and provider admission checkpoint

**R1续行当前状态：** 用户“继续，需求已更新”已执行R1准入补证；新schema2档案/官方包审计/精确刷新率校验通过，具体派生源码/上游路线仍待决定。旧人审证据保留；status: halted仍阻断03-02/03-03。

**真实Windows枚举、五候选档案及03-01-03路线决定已完成；用户选择2补SudoVDA证据，无合格provider，后续实施仍暂停。**

## Completed tasks and commits

| Task | Result | Commits |
|---|---|---|
| 03-01-01 | query / driver check / group-not-found，原生错误/竞态/deadline与mutation拒绝；真实新进程查询现实不变 | RED `8f620ec`; GREEN `7ff47c6` |
| 03-01-02 | 五候选来源/接口/许可/包/安全分层档案，VDD真实archive/CAT成员审计，完整已知方法面 | RED `7b4f785`; GREEN `d08d27f` |
| 03-01-03 | 用户原文 `2`：no-qualified-provider + SudoVDA补证；时间与原档案hash已绑定 | 本次文档提交 |

10个计划声明文件实际新增/修改。工作分支`codex/phase-03-virtual-display-feasibility`；生产代码不读取、链接或修改references/upstream。

## Evidence and verification

- Native RED：实际Helios `vdisplay query --json`退出2/Unknown argument，对目标行为断言失败；CTest JUnit为1项failed。`check tdd-red-evidence`=RED_EVIDENCE_OK。
- Package RED：目标`dossier preserves honest unknown evidence and explicit gaps`因不存在准入checker触发明确断言；实际6项failed，TAP解析=RED_EVIDENCE_OK。原始RED XML/TAP与记录在忽略的`artifacts/phase03/native-red.*`和`package-red.*`；不是构建/语法错误当RED。
- `cmake --preset windows-core`、Debug/Release build通过。Debug virtual_display_probe 1/1（0.11s）；Release CTest 4/4（2.45s），含core tracer/lifecycle/adapters。真实query → check → query完整actual/devices一致；访问拒绝、3次竞态、有界超时、unknown和未准入mutation拒绝为合同注入，产品无此显示测试hook。
- 现有Helios实际进程回归Debug2/2、Release2/2通过，包括Ctrl+C和原core清理。没有重新跑完整Phase2 GPU/FFI/clean CI套餐，本阶段尚未到最终验证。
- 包测试最终7/7，无skip；规划fixture1/1，`validate-planning.cjs` PASS：42 phases / 105需求映射与local links。针对性包反馈约0.10s。
- 选项2补证回归：包7项+planning1项合计8/8，无skip，279ms；dossier --require-decision通过；规划42阶段/105需求/local links仍通过。依赖引擎返回runnable=[]，03-02/03-03均blocked_by03-01。13份源码共86396bytes逐一匹配官方Git blob和SHA256；未重跑未改变的native代码。
- dossier门通过，digest `fe4ab0c03e59eda9a0b3ee655ca0152900b3d20d24e775cae2d6972b501e6ea8`。五候选admission分别拒绝；初次 `--require-decision` 非零是当时的人类检查点缺口；收到 `2` 后 `--stage dossier --require-decision` 已通过。admission/authorization 仍按预期拒绝。
- 本机Win11 26100、1条foreign/unattributed活动路径2240×1400 @30000/1000，advanced color enabled=false、HDR未核验。已有SudoMaker0.22.37.632与Oray17.50.19.949；不认领、升级或删除。详情和命令合同见`docs/phase03/PROVIDER-ADMISSION.md`。
- VDD官方25.7.23小包实测132118bytes及SHA256与release digest相同；NTamd64 INF DriverVer11.30.4.434与release tag分开。CAT Authenticode Valid、INF/DLL /pa CAT成员通过，XML不在CAT；/kp为1只是具体kernel-policy诊断，UMDF适用政策/默认安全安装未验证。

## Admission limits and threats

SudoVDA公开driver实现现已取得并固定hash；作者修改许可声明已定位。源码/正式DLL对应、继承许可/完整notices、正式信任链仍开放；all-users设备读写+FILE_ANY_ACCESS high未缓解。默认3秒watchdog移除全部屏，GET_PROTOCOL_VERSION也会重置它；启动前禁用选项存在，但对应包短命令保活未实测。详见docs/phase03/SUDOVDA-EVIDENCE-FOLLOWUP.md。VDD全局count/reload与随机container不足以满足逐组生命周期，pipe/device ACL、源码/二进制对应和独立包许可开放。Microsoft样例、Rust候选与Parsec完整来源/接口/正式包均不齐。

T-03-01/02/SC通过**拒绝未准入接入**约束当前边界；没有把上游风险写成已修复。T-03-03的错误/unknown与fixture/实际证据分层负例已执行。原03-EDGE-PROBE的2条unclassified和descriptorless prohibitions均未改写。

七屏全规格、D2真实HDR、Win10/11原型、driver persistence、隔离恢复/更新/回滚均未证明，VDP-01/02保持Pending。Nyquist/wave0保持false；构建/只读观察不等于支持。

## Deviations and issues

- [Rule 3 — workflow protection] 起始HEAD在master；GSD提交协议禁止protected/default branch写提交，建立codex/phase-03-virtual-display-feasibility承载本轮执行。没有修改项目branching_strategy。
- [Rule 3 — environment] 默认沙箱禁止Git元数据、Node隔离/子进程和CIM；具体Git/只读查询/测试经自动审批后通过。原始EPERM和受限planning spawn不是产品回归；完全相同测试在获准环境重跑通过。
- [Rule 1 — implementation correction] CM_Get_DevNode_Status使用SDK ULONG输出再赋值uint32_t；真实VDD INF是UTF16LE，解析按BOM；release tag与DriverVer不能字符串强制相等。修正后native/包/规划检查通过。UMDF和kernel签名政策分开，不以/kp诊断单独判断UMDF生产支持。

未扩张架构、未引入常驻owner或安装器。`requirements-completed`保持空（需求仍未完成），避免按模板复制VDP数组制造已完成结论；原计划覆盖保存在requirements-planned。

## R1 continuation evidence

- RED `58b524a`：两个R1测试因缺平台schema/精确刷新率API真实断言失败；首次默认沙箱EPERM不算RED。原始日志artifacts/phase03/r1-red.log。
- GREEN `29bbff1`：校验器默认schema2 R1档案，绑定批准文档hash；Win10七屏SDR/Win11 D2 HDR与精确60/1请求。等价刷新率整数交叉比较接受60000/1000，拒绝59.94近似、零分母、越界和非法值。schema1仍保留原严格请求，旧决定hash不能批准新档案。
- 实际回归包9项+planning1项，10/10无skip，296.7ms；新dossier、历史显式--file决定和42阶段/105映射通过。未修改native，不重复之前native/机器测试。
- Apollo v0.4.6 archive17529901bytes/28.741s，官方asset SHA256匹配；提取六确定文件，DLL83216bytes，其他五文件逐字节匹配固定参考。INF/DLL /pa /c均退出1（untrusted root，无timestamp），成员/政策不标verified；设备ACL仍high。
- 固定微软/EDID工具许可入口和独立派生范围已准备；没有生产源码复制、构建/安装driver、导入证书或系统配置/拓扑动作。实际资产在忽略artifacts，持久摘要在docs/phase03/SUDOVDA-R1-AUDIT.json。
- 新档案hash `0e2010bd2143013fbbc62d0be3cad622020024594562c8521370ff36bcf0d116`；proposalEvidence绑定SUDOVDA-R1-ROUTE.md内容。decision=null，不将“继续”当作已审新路线。具体派生准备路线或继续上游补证需03-01-03人审；VDP与阶段未完成。

## Checkpoint and resume

**Gate answered:** 03-01-03 / checkpoint:decision / blocking-human。用户原文 `2`，记录时间2026-10-08T13:55:18Z，绑定原档案hash；选择no-qualified-provider和SudoVDA补证。来源补证完成，仍无合格候选。

实际答复/时间/hash已记录，`--stage dossier --require-decision`已通过。无合格候选时保持03-02/03-03阻断与VDP/Phase3未完成；不要把本SUMMARY存在解释为已获得准入或批准安装。若后来出现合格provider，必须通过真实admission并重新审阅具体路线，才可重写halted状态。

## Self-check

**PASSED for original readonly/dossier/decision and R1 checker/audit scope.** 原三任务证据和用户`2`保留；R1真实包审计/校验完成，新的派生路线决定尚待答复。**Plan intentionally HALTED on no-qualified-provider branch; Phase3 NOT COMPLETE.** 保留status: halted使依赖引擎阻断03-02/03-03，不因历史决定已答复而打开未准入实施。
