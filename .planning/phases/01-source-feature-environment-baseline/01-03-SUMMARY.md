---
phase: 01-source-feature-environment-baseline
plan: "03"
subsystem: infra
tags: [doctor, environment, measurement, baseline-review, node-test]
status: halted
halt_reason: awaiting-blocking-human-baseline-review
checkpoint:
  task: 3
  type: decision
  gate: blocking-human
  review: docs/BASELINE-REVIEW.md
completed_tasks: [1, 2]
requires: [01-02]
provides:
  - Bounded redacted local tool and OS snapshot with separate platform/machine gaps
  - Environment and measurement validators plus complete human review package
affects: [02, 03, 04, 05, 06, 10, 14, 20, 31, 32, 33, 34, 35, 37]
tech-stack:
  added: []
  patterns: [bounded probes, fixed batch flags, four evidence layers, nearest-rank metric grouping]
key-files:
  created: [scripts/doctor.cjs, scripts/doctor.ps1, tests/doctor.test.cjs, docs/baseline/environment.json, docs/BASELINE-REVIEW.md]
  modified: [scripts/validate-baseline.cjs, docs/DEVELOPMENT.md, docs/PLATFORM-MATRIX.md, docs/baseline/features.json, docs/FEATURE-PARITY.md]
key-decisions:
  - Existing compatible-open-source and retain-candidates user selections remain unchanged.
  - Flutter3.44 history is distinct from live3.47; OS/architecture minima remain proposed native validation targets.
  - Newly found Android API21–23 difference remains in v1 and needs explicit handling; no capability moved to TODO.
  - Four concrete decisions and four source conflicts remain pending until the user answers Task3.
requirements-completed: []
requirements-pending: [BASE-01, BASE-02, BASE-03]
coverage:
  - id: bounded-environment-tracer
    description: Real versions, status, budgets, own-process cancellation and redacted snapshot
    requirement: BASE-03
    verification:
      - kind: integration
        ref: "node --test tests/doctor.test.cjs (27/27 passed; final 1.84s)"
        status: pass
      - kind: integration
        ref: "pwsh -NoProfile -File scripts/doctor.ps1 -Mode Quick -Output docs/baseline/environment.json (1.406s/25s)"
        status: pass
    human_judgment: false
  - id: full-baseline-review-package
    description: Platform floors, original scope differences, build/machine gaps and repeatable measurement method
    requirement: BASE-03
    verification:
      - kind: integration
        ref: "node scripts/validate-baseline.cjs --review --report docs/BASELINE-REVIEW.md (PASS; review.pending)"
        status: pass
      - kind: integration
        ref: "node scripts/validate-baseline.cjs (PASS full-baseline)"
        status: pass
    human_judgment: true
    rationale: Task3 blocking-human review is pending; structure does not prove production permission, platform support or performance.
  - id: measurement-contract
    description: Guarded CLI, actual record fields, nearest-rank grouping, missing metrics, comparable parameters and calibrated clocks
    requirement: BASE-03
    verification:
      - kind: integration
        ref: "tests/doctor.test.cjs measurement cases and CLI rejection fixtures"
        status: pass
    human_judgment: true
    rationale: Instruments, accuracy and cross-host calibration remain RESEARCH A1 gaps; method awaits user choice and actual Phase6/10 data.
metrics:
  tasks: 2
  total_tasks: 3
  full_suite_tests: 78
  full_suite_seconds: 56.84
---

# Phase 1 Plan 03 — 环境与全基线人审检查点

Task1/2 已完成并提交；Task3 尚未获得答复，不能将本计划、Phase1 或三个 BASE 需求标为完成。本摘要是可恢复的 halted 状态，不是完成摘要。

## 已交付

- doctor 默认 Quick25秒、Deep45秒，单项5秒/每流64KiB；清理预留总预算，超时只终止本次启动树。绝对路径、shell=false 参数数组、白名单 batch 固定 flags、带空格路径、shim/非零/空/超时、输出截断、凭据及 JSON 路径脱敏均有测试。导入模块不执行 CLI；快照写入受 root 守卫，确认快照拒绝自动覆盖。
- 实际快照14项查询、7个平台、11个机器/GPU条目、11个缺口。Node24.14、Git2.54、pwsh7.6.3、CMake4.4.3、Ninja1.12、Flutter3.44缓存/Dart3.12、VC组件、JDK17、SDK/NDK可查；WDK配套未验证。SDK19041/22621/26100 headers/libs/tools匹配存在，但没有 Aether 构建/实机验证。
- 原始注册表 Windows10 LTSC2024/build26100 与独立 CIM Windows11 Caption 冲突保留；不能将本机记作 Win10测试。NVIDIA RTX5080、AMD Radeon及驱动仅枚举；虚拟适配器不计物理GPU测试，Intel、独立Win10/客户端、Linux/Apple executor缺口仍保留。
- 官方 Flutter3.44 历史 commit a43b0e7d3092b64db4933397aaddaed41f333ba1 给出候选 Windows10/11 x64+arm64、macOS10.15 x64+arm64、iOS13 arm64、AndroidAPI24 arm32+arm64+x64、Debian10/Ubuntu20.04 x64+arm64。原生 backend、构建和实机数组为空，主机Win10/11 build仍 pending-prototype，Apple只延期实机。
- 测量记录/CLI支持 nearest-rank p50/p95、metric/unit 分组、无样本unavailable、比较参数一致性、真实参考SHA/二进制digest、时钟校准和失败。真实根CLI要求参考匹配lock；没有采集或编造任何产品性能样本。30s/60s/3轮及8小时稳定性场景都是待审方法，不是产品SLO。

## 提交与验证

- `23fd138`：预写runner与环境/测量负例。真实 RED：runner缺导出8项失败；Task2缺环境/测量导出15项失败。另一次 shell shim丢引用失败不算RED。
- `b291686`：Task1工具查询→规范化→实际报告链。早期taskkill自身启动窗口过短导致挂起测试树没有清理，修正并清理已确认测试PID；最终测试额外断言超时进程真实消失、无关进程存活，不将早期耗时算作合格有界结果。
- 本摘要前的 `feat(01-03): validate environment and measurements and prepare full baseline review`：Task2全包、额外边界与测量CLI；完整测试78/78通过（56.84秒）。之后测量比较CLI增强仅重跑doctor27/27（1.84秒）。缓存Flutter版本漂移负例先真实RED后GREEN。
- 全链 review/report与默认无参数入口 PASS：9参考、2964文件、1332外部项、637平台记录、117入口、373设置、637计划案例、2209固定功能锚点，unmapped=0；人审pending、四冲突open、productionReuseApproved=false、productSupportVerified=false。
- validate-planning PASS：42阶段、105 v1需求/105唯一主要阶段映射，本地链接有效。
- 实际严格pending审阅命令按预期非零拒绝，报告SHA256保持不变；fixture验证明确人审/保留缺口后严格环境门禁通过。没有用fixture答复批准真实项目。

## 偏差与未决问题

Task2核对官方版本发现固定 Android app/build.gradle minSdk21 与 Flutter3.44 API24差异；在同一 GSD执行中增加第四个冲突 android-api21-23-framework-floor 和责任 Phase2/14/31 环境缺口，补到features/报告。没有改原能力数量、额外需求、42阶段结构或忽略参考。01-02摘要中的三冲突/2208锚点是该计划完成时观测，本次追加后为四冲突/2209锚点。

三个BASE分类flags仍 unclassified/unresolved，RESEARCH A1精度/跨机校准无实测；六条descriptor-less prohibitions仍flagged-unverified。所有来源许可、子模块、二进制、驱动生产签名及发行阻碍保留。当前没有生产代码、驱动安装、系统配置变更、上游checkout变更或子代理。

## 恢复 Task3

读取docs/BASELINE-REVIEW.md及environment.decisions：original-scope-observers、client-minimum-architectures、environment-gaps-host-floor、measurement-method。请用户确认报告推荐并保留明列缺口，或指出具体修改；既有许可/暂缓发行选择无需重问。

明确答复后记录四决定的 selected/confirmedBy/confirmedAt，处理四feature conflicts并附decisionEvidence；如确认观察者路线，通过同一GSD工作流修订SESSION-MODEL相关段落。记录review.confirmed及全部开放环境缺口、来源阻碍引用；重生成FEATURE-PARITY和BASELINE-REVIEW并运行--require-review。所有未知支持/许可事实保持未知，Apple构建不得豁免。然后才完成01-03摘要、状态、Phase1代码审阅/验证与必要要求勾选；不自动开始Phase2。

## Self-Check: PASSED for Tasks1/2; Task3 pending

列出的新文件和已提交任务存在，完整测试/结构链通过；人审未完成、无最终Phase1 VERIFICATION。禁止将此halted状态当作phase complete。
