---
phase: 03-virtual-display-feasibility
plan: "01"
status: complete
subsystem: windows-display-provider
tags: [windows, ccd, setupapi, provider-admission, supply-chain]
requires:
  - phase: 02-monorepo-flutter
    provides: Windows C++20 Helios local skeleton and ABI1
provides:
  - Real read-only Helios CCD and present-device enumeration
  - Five-candidate dossier and layered fail-closed admission checks
  - User no-qualified-provider decision and pinned SudoMaker source followup
  - Admitted dedicated aether-helios-display source/package with bounded rights, signature and ACL evidence
affects: [03-02, 03-03, 17-display-lifecycle]
tech-stack:
  added: []
  patterns: [Helios-only native provider contract, explicit unknowns and evidence gates]
key-files:
  created: [native/platform/include/aether/virtual_display.h, native/platform/windows/virtual_display_provider.cpp, tests/native/virtual_display_contract.cpp, scripts/check-virtual-display-admission.cjs, tests/virtual-display-package.test.cjs, docs/phase03/PROVIDER-ADMISSION.json, docs/phase03/PROVIDER-ADMISSION.md, docs/phase03/SUDOVDA-EVIDENCE-FOLLOWUP.md, docs/phase03/SUDOVDA-SOURCE-EVIDENCE.json]
  modified: [apps/helios/main.cpp, CMakeLists.txt, .planning/phases/03-virtual-display-feasibility/COVERAGE.md]
key-decisions:
  - Initial no-qualified-provider response 2 retained as history; approved dedicated route now admits aether-helios-display
  - Earlier explicitly authorized ACL experiment completed and cleaned; final reconstructed DLL not installed
  - Standing instructions authorize admission only; 03-02/03-03 remain unstarted
requirements-planned: [VDP-01, VDP-02]
requirements-completed: []
actuals:
  tasks: 3
  initial_commits: 7
  followup: quick 261009-f0f and 261009-fns
duration: Original 23 min to initial checkpoint; total followup duration not measured
completed: "2026-10-09"
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
        ref: tests/virtual-display-package.test.cjs (11 tests; complete targeted suite 18 tests)
        status: pass
      - kind: other
        ref: node scripts/check-virtual-display-admission.cjs --stage dossier
        status: pass
    human_judgment: false
  - id: provider-decision
    description: Choose exact admitted provider or no-qualified-provider with concrete next research/evidence action
    verification:
      - kind: other
        ref: node scripts/check-virtual-display-admission.cjs --stage admission --require-decision --file docs/phase03/PROVIDER-ADMISSION-RECONSTRUCTED.json
        status: pass
    human_judgment: true
    rationale: Initial response 2 retained; later explicit dedicated-route and self-sign instructions authorize scoped admission after closed gates, not a new manual final-hash review or subsequent plan execution
---

# Phase 03 Plan 01 — read-only probe and provider admission checkpoint

**当前状态（2026-10-09）：03-01 完成，`aether-helios-display` 已准入。** 固定档案 `PROVIDER-ADMISSION-RECONSTRUCTED.json` 摘要 `03953899ea81654daa6f0fd144f8ff3dd8e060103284f933d374763e66d2c3ba`；最终 ZIP `c5f085cba2fec999fabf141038dc7530bc61b5b489807d485e612b615c59783a`。用户「推进直到准入」「证书自签即可，效仿Apollo」承接已批准专属派生路线，不声称用户重新人工审阅最终 hash。18/18 针对性测试、实际 x64 WDK 与原生 EDID/settings、默认 Windows 签名策略和许可/ACL 对应门通过。默认 checker 已指向当前档案；旧 R1 与决定/hash 不改写。

安装先行研究包的 ACL 实验已经精确清理。最终 DLL 未安装；实际权限边界通过相同 INF/header/WDF/security/IOCTL 源体的逐字节对应承接，属于明确的源码推断。只保留用户授权的研究证书 Root/TrustedPublisher 信任。03-02/03-03 仍未启动：技术依赖就绪不构成新的执行/系统授权；VDP-01/02、七屏/HDR/保活/更新实机与 Phase3 仍未完成。严禁执行或安排重启/关机。

详见[准入范围](../../../docs/phase03/HELIOS-DISPLAY-ADMISSION.md)、[许可闭合](../../../docs/phase03/HELIOS-DISPLAY-RIGHTS-CLOSED.json)、[实际 ACL](../../../docs/phase03/HELIOS-DISPLAY-ACL-AUDIT.json)、[对应证明](../../../docs/phase03/HELIOS-DISPLAY-ACL-BRIDGE.json)。源码与完整 notice 提交 `d9ed040`；准入证据与收据提交 `1488cf4`。03-02 开始 monitor mutation 前必须先修复 MonitorArrival 失败清理及满容量重复 GUID 幂等边界。

## Historical checkpoints and evidence

以下按发生时的实际结果保留，旧「halted / 未准入」不代表上述当前状态。

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

**R1 gate answered:** 用户原文 `1`，2026-10-08T15:18:55Z，绑定R1档案摘要 `0e2010bd2143013fbbc62d0be3cad622020024594562c8521370ff36bcf0d116`；只批准准备，不批准安装或系统变更。决定提交 `d515499`，准备提交 `2079041`。13个原源核验、五文件研究变换、真实未签名Release x64编译和目录生成通过；保留原失败日志与INF2084 warning。DLL/CAT NotSigned；INF无signer且UnknownError，不冒充签名PASS。编译保留/WX与/analyze；Departure前保存connector，避免成功移除后读取可能已销毁context。微软共享文本与EDID/贡献者许可缺口逐文件记录，生产复用清单仍空；最终11/11针对性测试364.90ms、47摘要与11本地链接核验通过。详情见[派生准备结果](../../../docs/phase03/HELIOS-DISPLAY-PREPARATION.md)。开发机禁重启/关机已记录，当前及后续需要这些动作的检查不执行。

**Gate answered:** 03-01-03 / checkpoint:decision / blocking-human。用户原文 `2`，记录时间2026-10-08T13:55:18Z，绑定原档案hash；选择no-qualified-provider和SudoVDA补证。来源补证完成，仍无合格候选。

实际答复/时间/hash已记录，`--stage dossier --require-decision`已通过。无合格候选时保持03-02/03-03阻断与VDP/Phase3未完成；不要把本SUMMARY存在解释为已获得准入或批准安装。若后来出现合格provider，必须通过真实admission并重新审阅具体路线，才可重写halted状态。

## Self-check

### 2026-10-09 self-signed and actual ACL followup (quick 261009-fns, still executing)

用户明确「证书自签即可，效仿Apollo」，随后批准指定 CER 的 LocalMachine Root/TrustedPublisher 导入，再批准固定研究包 helios-1791523416599 的单适配器 ACL 实验及精确清理。独立 helper/EDID/INF/project 与排除资产使实际输入缩为八项；Win10/11 INF 和原生 EDID/Release x64 构建通过。私有 IOCTL query 要求 READ、mutation 要求 READ|WRITE，协议 0.3.0。实际默认签名策略、CAT成员、可信时间戳及两项签名负例通过；18/18 针对性测试无 skip。

实际设备 ROOT\DISPLAY\0002 使用唯一 Aether ID/GUID：普通未提升令牌三种访问都拒绝，管理员 READ/READ|WRITE 返回 0.3.0，零访问句柄 IOCTL 拒绝；实际 stack DACL 仅 SY/BA。新增 oem89.inf、设备和专属配置/新建父键均清理完成；外来 display device 清单前后相同。失败 UAC/清理日志保留，无重启/关机、安全检查关闭或 monitor mutation。仅安装一个研究适配器，不执行 03-02/03-03 或七屏/HDR/保活矩阵；未捕获成对即时 CCD 快照，不宣称拓扑比较 PASS。

提交 e683b35/281154f 记录工具和固定包授权。旧 R1 hash 保留；新自签档案 dossier 合法，admission 目前仅拒绝 independent package license audit。剩余继承表达式继续独立重构；SUMMARY仍 halted，不把实际 ACL 或可信自签写成 provider 已准入或 Phase3完成。见[续行收据](../../../docs/phase03/HELIOS-DISPLAY-SELFSIGNED-FOLLOWUP.md)。

### 2026-10-09 approved followup (quick 261009-f0f)

用户明确继续已批准的独立派生路线，通过GSD依次补来源/EDID、INF结构与正式签名条件。Quick来源任务提交 `062ebec`，INF边界RED提交 `632c63a`；本轮没有重问路线，也没有启动03-02/03-03。来源13输入/45网络观察均固定hash；追踪两次重组/改名、早期贡献者、384字节独立EDID与256字节编译数组，工具edid.S文件GPL-2.0-or-later声明与根LICENSE分开，完整许可材料在忽略研究树中。权利总门保持open，无生产复用批准。

INF实际修正为Win10 Legacy DIRID12、Win10 1803+ DIRID13+AddService、Win11 DIRID13+WudfRd.inf Include/Needs三分支，保留原低版本路径而不锁最低build。Release x64未签名构建退出0，真实Tlog保留/WX与/analyze；6/6 InfVerif（全局/w零告警，按OS出现14/15项2083未使用分支告警）、明确Win10/Win11 Inf2Cat退出0且errors/warnings0；新的研究包无2084。早期Win10/w 1322失败日志保留。DLL/CAT NotSigned、INF UnknownError，不标可信签名。

最终针对性研究3项/包9项/planning1项 **13/13** 无skip，400.88ms；42阶段/105需求映射通过，原R1决定hash未变，runnable=[]。正式签名清单包含PDB/CAB/EV/dashboard或其他可信CA政策候选，账户、提交与返回包仍未取得；此轮不需要账户信息。没有设备/registry/证书/安全策略变更、重启或关机。详情见[INF续行证据](../../../docs/phase03/HELIOS-DISPLAY-INF-FOLLOWUP.md)、[来源记录](../../../docs/phase03/HELIOS-DISPLAY-PROVENANCE.md)、[签名准备](../../../docs/phase03/HELIOS-DISPLAY-SIGNING-READINESS.md)。SUMMARY保持halted，VDP-01/02与Phase3保持未完成。

**Historical self-check:** 原只读、档案、R1 和派生准备范围通过；当时 no-qualified-provider 分支保持 halted。该历史停止点于上述 2026-10-09 准入补证后关闭。当前仅 03-01 complete；Phase3 和 VDP 不完成，用户范围继续禁止启动 03-02/03-03。
