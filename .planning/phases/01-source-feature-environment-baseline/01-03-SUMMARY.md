---
phase: 01-source-feature-environment-baseline
plan: "03"
subsystem: infra
tags: [doctor, environment, measurement, baseline-review, node-test]
status: complete
completed_tasks: [1, 2, 3]
requires: [01-02]
provides:
  - Bounded redacted local tool and OS snapshot with separate platform/machine gaps
  - Environment and measurement validators plus confirmed full baseline review
  - Verified installed VS2026 WDK component and integration file evidence
affects: [02, 03, 04, 05, 06, 10, 14, 20, 31, 32, 33, 34, 35, 37]
tech-stack:
  added: []
  patterns: [bounded probes, fixed batch flags, four evidence layers, nearest-rank metric grouping]
key-files:
  created: [scripts/doctor.cjs, scripts/doctor.ps1, tests/doctor.test.cjs, docs/baseline/environment.json, docs/BASELINE-REVIEW.md]
  modified: [scripts/validate-baseline.cjs, scripts/validate-planning.cjs, tests/planning.test.cjs, docs/DEVELOPMENT.md, docs/PLATFORM-MATRIX.md, docs/SESSION-MODEL.md, docs/baseline/features.json, docs/FEATURE-PARITY.md]
key-decisions:
  - Existing compatible-open-source and retain-candidates user selections remain; production reuse is blocked.
  - User confirmed authorized readonly observers with one global control lease; SESSION-MODEL updated.
  - Framework floors are candidate targets; original Android API21–23 and Linux extra architectures remain in v1.
  - User confirmed baseline and measurement method, corrected WDK installed and VS2026 integrated.
requirements-completed: [BASE-01, BASE-02, BASE-03]
requirements-pending: []
coverage:
  - id: bounded-environment-tracer
    description: Actual versions, honest status, deadlines, cancellation of own process and descendants, redacted snapshot
    requirement: BASE-03
    verification:
      - kind: integration
        ref: "tests/doctor.test.cjs: 28/28 passed; final 2.135s"
        status: pass
      - kind: integration
        ref: "docs/baseline/environment.json: Quick 1.523s/25s; 15 probes"
        status: pass
    human_judgment: false
  - id: full-baseline-review-package
    description: Fixed source audit, feature/platform differences, target gaps and concrete decisions
    requirement: BASE-03
    verification:
      - kind: integration
        ref: "node scripts/validate-baseline.cjs --review --require-review --report docs/BASELINE-REVIEW.md: PASS; review confirmed; conflicts empty"
        status: pass
      - kind: human
        ref: "environment.review: user answers 1/2/4 confirmed, WDK installed, VS26 integrated; 2026-10-07T13:45:39.459Z"
        status: pass
    human_judgment: true
    rationale: Explicit user answers record baseline decisions; they do not prove production authorization or product support.
  - id: measurement-contract
    description: Units, real record fields, nearest-rank grouping, comparable parameters and calibrated clocks
    requirement: BASE-03
    verification:
      - kind: integration
        ref: "tests/doctor.test.cjs measurement and CLI negative fixtures"
        status: pass
      - kind: human
        ref: "environment.decisions measurement-method: user confirmed"
        status: pass
    human_judgment: true
    rationale: Method confirmed; instruments, accuracy, cross-host calibration and actual Phase6/10 data remain open.
metrics:
  tasks: 3
  total_tasks: 3
  full_suite_tests: 80
  full_suite_seconds: 61.712
---

# Phase 1 Plan 03 — 环境与完整基线审阅完成

三个任务均完成。用户已答复四项具体决定，严格全基线门禁通过。三个 BASE 的审计交付已具备完成证据；阶段完成仍以最终 VERIFICATION 为准。

## 交付结果

- doctor Quick25秒、Deep45秒，单项5秒/每流64KiB，预留进程清理预算。绝对路径、shell=false 参数数组、白名单 batch 固定 flags、空格路径、shim/非零/空/超时、洪泛、凭据/JSON路径脱敏和原子写入均有负例。最终超时测试验证父进程及实际派生子进程均消失，无关进程存活。已确认快照拒绝自动覆盖。
- 最终 Quick 1.523秒，15项查询、7个平台、11个机器/GPU条目。VS2026 Enterprise 18.10.12201.205 与 WDK10.0.28000.0 同版本 headers/libs/tools、IddCx1.11、x64 stampinf 与 x86 Inf2Cat 已枚举；v180内核/用户驱动及ImportBefore/After六个集成文件存在。安装缺口 resolved；没有实际驱动构建、安装或产品支持结论。
- 最终11条环境缺口为1 resolved、9 open、1 Apple hardware TODO。独立Win10、客户端/架构/IntelGPU、Linux/Apple executor、原生构建、主机build下限及测量仪器仍待后续阶段。注册表Windows10 LTSC2024/build26100与CIM Windows11名称冲突保留；GPU/驱动仅枚举。
- Flutter3.44历史依据仍是候选OS/架构下限，五端build/hardware数组为空。原Android API21–23及Linux ARM32/RISC-V/板卡差异留在v1；Apple只延期VFY-01/02实机，构建与实现仍必须完成。
- 用户明确确认授权只读观察者路线：观察者禁止输入、设备上行和会话变更，无第二控制租约；读流独立资源协商，断连仅释放自己的流。SESSION-MODEL与四项原行为冲突已同步，Phase6/20/37验证实际实现。
- nearest-rank p50/p95、metric/unit分组、缺样本unavailable、参考SHA/产物digest、参数可比性与跨机校准拒绝规则通过测试。30秒预热、60秒窗口、3轮及8小时稳定性方法获确认；零产品性能样本，未制定虚构SLO。

## 提交与验证

- 23fd138：Task1/2预写runner与环境/测量负例；真实RED为缺导出（8项及15项）。shell shim丢引用的失败不算RED。
- b291686：Task1可运行探测链。早期taskkill窗口过短的清理问题已修复并清理已确认测试PID；不把该早期运行记为合格有界结果。
- 9b75ab6：Task2全包及CLI。历史完整套件78/78（56.84秒），doctor27/27（1.84秒）；HALTED摘要e91f3e5/状态84299a8准确记录当时待人审。
- c080dec：新增真实WDK目录布局RED；x86 Inf2Cat/IddCx版本化导致旧检测错误。
- c16a94f：已完成需求仍应纳入planning验证的RED；旧CLI忽略fixture根且漏计完成checkbox。
- 157e44b：WDK检测GREEN、本机组件/VS集成核验、四项真实人审记录、SESSION-MODEL修订、最终报告；加强实际进程子树断言及完成需求映射验证。
- 全套80/80（61.712秒）；最终加强子树测试后doctor28/28（2.135秒）。严格真实全链PASS：9参考、2964文件、1332外部项、1698来源锚点、637平台原子记录、117入口、373设置、637计划案例、2209功能锚点；review confirmed、冲突空、productionReuseApproved=false、productSupportVerified=false。
- 历史pending严格人审按预期拒绝且保留既有报告；最终真实用户答复后才通过，fixture答复未用于批准项目。

## 偏差与证据边界

Task2发现Android minSdk21对照Flutter API24差异并增加第四项冲突/2209锚点；01-02的三冲突/2208锚点是历史观察。Task3响应用户WDK纠正，补同版本x86工具检测及VS2026集成证据。阶段收尾发现planning只匹配未完成需求，添加fixture并修正，保证后续完成状态不丢105需求映射。以上均在本GSD执行内，未扩大产品实现范围。

用户答复原文：“1. 确认；2. 确认；3. wdk已安装；4. 确认”，补充“vs26 已集成wdk”；2026-10-07T13:45:39.459Z记录。既有许可/暂缓发行选择保持不变，九项开放环境阻碍及Apple实机TODO显式保留。三个spec-less分类flags、RESEARCH A1仪器精度/时钟实测、六条descriptor-less prohibitions仍保留；未声称分类引擎自动解决。637记录不是637个独立产品功能或已通过产品案例。

来源许可、缺失子模块、外部/二进制、签名和渠道阻碍仍限制后续生产选用。本阶段无安装、系统配置变更、产品实现、参考checkout修改或子代理。接下来只完成Phase1审阅、安全、覆盖及目标验证，不自动开始Phase2。

## Self-Check: PASSED

交付文件与任务提交存在；80项全套、28项最终doctor及真实严格全基线门禁通过，四项人审决定已有用户证据。
