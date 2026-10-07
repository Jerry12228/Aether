---
phase: 01-source-feature-environment-baseline
plan: "02"
subsystem: infra
tags: [feature-parity, fixed-source, requirements, node-test]
status: complete
requires: [01-01]
provides:
  - Seven target scopes with 637 platform capability records and independent planned cases
  - 117 setting and non-setting surfaces with 2208 checked anchors
  - Ten original-ability v1 requirements with one primary phase each
affects: [01-03, 13, 15, 16, 20, 27, 29, 36, 37]
tech-stack:
  added: []
  patterns: [fixed Git objects, independent setting inventory extraction, separate evidence layers]
key-files:
  created: [docs/baseline/features.json, tests/baseline-features.test.cjs, .planning/phases/01-source-feature-environment-baseline/01-02-feature-review.cjs]
  modified: [scripts/validate-baseline.cjs, docs/FEATURE-PARITY.md, .planning/REQUIREMENTS.md, .planning/ROADMAP.md]
key-decisions:
  - Newly found original capabilities stay in v1; no new TODO or roadmap phase was introduced.
  - Apollo view-only joining and Qt Linux extra architectures remain open conflicts for 01-03 human review.
  - Product implementation/build/automation/hardware arrays remain empty; all cases are planned.
requirements-completed: [BASE-01]
requirements-pending: []
coverage:
  - id: fixed-feature-tracer
    description: Fixed settings/consumer anchors and CLI/report with rejection tests
    requirement: BASE-01
    verification:
      - kind: integration
        ref: "node --test tests/baseline-features.test.cjs (20/20 passed)"
        status: pass
    human_judgment: false
  - id: platform-feature-inventory
    description: Platform atoms, setting/non-setting coverage, conditions and planned cases
    requirement: BASE-01
    verification:
      - kind: integration
        ref: "node scripts/validate-baseline.cjs --features --report docs/FEATURE-PARITY.md"
        status: pass
    human_judgment: true
    rationale: Structural counts/anchors do not prove semantic exhaustiveness or platform support; final review is in 01-03.
  - id: original-requirement-mapping
    description: ORIG-01 through ORIG-10 mapped to unique existing primary phases
    requirement: BASE-01
    verification:
      - kind: integration
        ref: "node scripts/validate-planning.cjs (105 requirements, 42 phases, unmapped=0)"
        status: pass
    human_judgment: true
    rationale: Scope additions are mandated by the approved parity rule; the observer/architecture handling still requires concrete final decisions.
completed: 2026-10-07
metrics:
  tasks: 3
  files: 7
---

# Phase 1 Plan 02 — 原能力、独立案例与本版映射

已完成来源锚点到功能数据、报告、需求/阶段及案例的可复现链；BASE-01 已通过 01-03 的共享最终人审，不宣称产品能力已实现。

## Accomplishments

- Qt Windows 反向滚轮 tracer 从设置声明，经 input.cpp 偏好消费与 mouse.cpp 精确垂直/水平滚轮分支，映射 INPUT-01/Phase11。
- 展开 Win10/11 主机与五客户端七个 scope：637 条平台能力、117 个入口、373 个设置覆盖项、637 个独立 planned 案例，2208 次锚点检查。计数含不同平台同类行为，不能解释为 637 个独特产品功能或穷尽性证明。
- Qt Q_PROPERTY、CLI 参数和本地快捷键；Android XML 偏好/分类与偏好读取、屏幕手柄重置、媒体/输入；iOS 独立设置、网络/控制器/触摸/笔及 AVSampleBufferDisplayLayer；Sunshine Windows 配置、实际解析与 provider；Apollo 权限、纯输入、剪切板、钩子与读流分别列证据。
- 非 Windows 主机的 VideoToolbox、VA-API、Vulkan 编码参数按构建/实现来源单独 outside-target；用户已批准 Linux/macOS 服务端 TODO，未将目标客户端能力推迟。
- ORIG-01–10 增加界面偏好/命令入口/PiP/高级手柄选项/唤醒与活动展示/钩子/纯输入/只读加入/色彩范围/编码调参；唯一实施阶段为 13、15、16、20、27、29、36，保持42阶段。全部产品需求仍 Pending。

## Task Commits

| Task | Commit | Result |
|---|---|---|
| 1 RED | `0a5cd99` | 实际 assertion：feature validator must exist；沙箱 EPERM 不算 RED |
| 1 GREEN | `6795e26` | 固定源 tracer、功能校验与报告闭环 |
| 2 | `57623c2` | 全平台盘点及清晰 needs-requirement 债务/冲突 |
| 3 | See matching `feat(01-02): map discovered original abilities` commit | 严格门禁先真实拒绝228条未映射能力，再补齐需求与唯一阶段 |

## Verification

- 功能套件20/20通过；扩展后一次实测10.36秒。包含真实临时Git对象与CLI、错误blob/原文、重复ID、无设置覆盖/案例/条件、错误阶段、擅自TODO、Apple伪实机证据及失败不覆盖报告。
- 最终 --features --report docs/FEATURE-PARITY.md PASS：checked=637，anchors=2208，unmapped=[]，开放冲突3。
- `validate-planning.cjs` PASS：42 phases，105 v1 requirements，mapped=105，unmapped=0，localLinks=valid。
- 来源fixture全套不在本计划重复运行；CLI/验证器的跨链回归由01-03最终全套检查覆盖。

## Deviations and Limits

- 增加可复现固定对象 curation helper，避免只留下不可复现的手工大JSON；它拒绝覆盖已确认冲突或已经闭合的需求映射。生成后不默认重跑，单次人审/修订应保留现有数据。
- 客户端特有最低OS/架构、硬件profile与权限条件仍待01-03具体证据包；Qt源码共同设置不证明平台实际后端具备同等行为。
- 部分配置条目通过声明与偏好读取/解析取证，行为实现和动态条件仍由目标阶段案例验证。扫描/自动枚举不能保证发现所有动态入口或语义边缘。
- 两个Win版本的Apollo只读加入冲突及Linux ARM32/RISC-V额外目标冲突保持open。没有替用户批准并行观察者或删除架构。
- 所有产品证据数组为空；Apple hardwareTodoId分别VFY-01/VFY-02。驱动/libvirtualhid/VIGEm/SudoVDA实际来源阻碍关联到相应主机能力。
- BASE-01 unclassified/unresolved 与 descriptor-less prohibitions flagged-unverified 保留。

## Self-Check

**PASSED for the implemented structural audit chain.** Deliverables, real task commits, strict mapping/report and rejection cases exist. Semantic completeness, platform support and Phase1 completion await the final human review.

Next: 01-03 bounded environment doctor, four evidence layers, comparable measurement records and concrete full review package.

## Shared final review resolved — 2026-10-07

01-03已收到真实用户四项答复与VS2026/WDK补充，严格全包人审PASS。上述pending、三冲突和2208锚点描述为本计划完成时的历史状态；最终四冲突均decided、2209功能锚点。BASE-01审计交付已满足最终人审，生产复用/支持仍未批准，未知阻碍保留。
