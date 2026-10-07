---
phase: "1"
slug: "source-feature-environment-baseline"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-10-07"
---

# Phase 1 — Validation Strategy

这是执行时的验证契约。01-01 Task 1/2 已验证，其余任务及人工签署 pending。自动检查证明结构、引用与失败处理；源码能力穷尽性、生产复用许可和发布渠道结论仍需人工审阅。

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Node 内置 node:test 与 node:assert/strict；PowerShell 有界本机探测 |
| Config file | 无外部测试依赖；现有 scripts/validate-planning.cjs |
| Quick run command | `node scripts/validate-planning.cjs` 加当前任务的针对性验证 |
| Full suite command | 分别运行 `node --test tests/baseline-sources.test.cjs tests/baseline-features.test.cjs tests/doctor.test.cjs`、`node scripts/validate-baseline.cjs --review --report docs/BASELINE-REVIEW.md`、`node scripts/validate-planning.cjs`，每个命令独立检查退出码和非空摘要 |
| Estimated runtime | 目标 30 秒；来源全套 31 项实测 62.45 秒，最终针对性 3 项 6.23 秒；feature/doctor 尚未实现，完整阶段耗时待测 |

## Sampling Rate

- 每任务提交前运行现有 planning validator 及相应新增检查。
- 每计划完成运行该验收链的全部正负例和真实数据验证；仅运行已由前序任务创建的入口。
- 阶段人工审阅前全套检查必须通过，生成真实 doctor 快照。
- 快速反馈目标 30 秒；工具深探测独立设置总预算、单项截止时间和输出上限。
- 每条运行命令退出非零或未出现有效非空摘要即不通过；missing/unknown/timeout 可作为真实环境缺口，但不能冒充工具可用。

## Per-Task Verification Map

任务编号与三个最终 PLAN 对齐。三波顺序执行；01-01和01-03各有具体blocking-human决定。W0表示由该链首个tracer创建后运行，并非已经存在或测试通过。

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|--------|
| 01-01-01 | 01 | 1 | BASE-02 | T-01-01,02,04,SC | common-c真对象tracer、参数/真实路径、dirty/SHA/remote负例 | Git fixture + CLI | `node --test tests/baseline-sources.test.cjs`；独立运行`node scripts/validate-baseline.cjs --sources --scope moonlight-common-c --report docs/SOURCE-AUDIT.md` | yes | pass — committed tracer/full fixtures |
| 01-01-02 | 01 | 1 | BASE-02 | T-01-01,02,03,04,SC | 九仓逐文件、gitlink/资产/驱动及五端发行，未知保持blocked | 数据/引用 | `node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md` | yes | pass — structural audit; human decision pending |
| 01-01-03 | 01 | 1 | BASE-02 | T-01-03 | 先展示具体许可/复用/渠道选项再记录明确选择 | 决定前后门禁 | `node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md` | W0 | pending |
| 01-02-01 | 02 | 2 | BASE-01 | T-01-05,06,07,SC | Qt Windows真能力tracer，固定锚点与错映射负例 | 数据/CLI | `node --test tests/baseline-features.test.cjs`；独立运行`node scripts/validate-baseline.cjs --features --scope qt-windows --report docs/FEATURE-PARITY.md` | W0 | pending |
| 01-02-02 | 02 | 2 | BASE-01 | T-01-05,06,07,SC | 五端/主机设置和非设置覆盖；未映射明确显示，Apple证据诚实 | 数据/引用 | `node scripts/validate-baseline.cjs --features --allow-unmapped --report docs/FEATURE-PARITY.md` | W0 | pending |
| 01-02-03 | 02 | 2 | BASE-01 | T-01-06,07 | 新发现原能力进入本版需求，唯一实施阶段与案例 | 严格映射门禁 | `node scripts/validate-baseline.cjs --features --report docs/FEATURE-PARITY.md` | W0 | pending |
| 01-03-01 | 03 | 3 | BASE-03 | T-01-08,09,10,SC | 真实doctor tracer，有界launcher/树取消/脱敏及诚实失败 | Runner负例 + smoke | `node --test --test-name-pattern="doctor runner" tests/doctor.test.cjs`；独立运行`pwsh -NoProfile -File scripts/doctor.ps1 -Mode Quick -Output docs/baseline/environment.json` | W0 | pending |
| 01-03-02 | 03 | 3 | BASE-03 | T-01-08,09,10,11,SC | 版本化平台/机器、测量单位/时钟/可比性负例及完整报告 | 全套/全基线 | `node --test tests/baseline-sources.test.cjs tests/baseline-features.test.cjs tests/doctor.test.cjs`；独立运行`node scripts/validate-baseline.cjs --review --report docs/BASELINE-REVIEW.md` | W0 | pending |
| 01-03-03 | 03 | 3 | BASE-01, BASE-02, BASE-03 | T-01-03,06,07,11 | 全包人审、具体范围/方法决定、flags与阻碍保留 | 人审后自动门禁 | `node scripts/validate-baseline.cjs --review --require-review --report docs/BASELINE-REVIEW.md` | W0 | pending |

## Wave 0 Requirements

- 在使用之前创建 `scripts/validate-baseline.cjs`、三套 test 文件及其fixtures；分别由三个首个可运行tracer负责。新增doctor入口为`scripts/doctor.cjs`和`scripts/doctor.ps1`，新增机器数据为`docs/baseline/sources.json`、`features.json`、`environment.json`。
- doctor runner测试在01-03-01按名称前缀选择；environment/measurement负例在同一test文件预写，由01-03-02实现验证并运行全套。测量契约保存在environment，完整协议保存在DEVELOPMENT，不另造未计划schema文件。
- `--sources`不读取尚未创建的features/environment；`--features`不读取environment；tracer用明确scope、能力展开可用明确allow-unmapped，最终严格门禁移除这些选项。默认全链命令仅在01-03-02全部数据已创建后运行。
- 人审前`--review`允许review.pending以生成真实选择包；最终答复记录后`--require-review`才强制确认。负例分别证明pending被此严格选项拒绝、明确确认记录通过。现有planning validator只判断其实际JSON字段status/unmapped/localLinks，不要求baseline专属checked字段。
- doctor runner 提供缺失、非零、空输出、挂起、输出洪泛及取消的可注入 fixture；临时 Git fixture 验证错 SHA、dirty、gitlink 和路径越界，不改真实参考 checkout。
- 来源/功能数据负例覆盖缺锚点、重复 ID、未覆盖设置、无依据许可通过、擅自 TODO、Apple 实机伪完成。
- 不安装测试框架，不安装驱动，不修改系统安全配置。

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 原功能全集与范围差异 | BASE-01 | 结构验证不能证明能力穷尽性 | 按各端设置/媒体/输入/管理覆盖台账审阅，逐条查看固定源码锚点与新增 v1 映射 |
| 项目许可证、文件复用及渠道结论 | BASE-02 | 许可文本扫描不能自动授权产品复用和分发 | 阅读逐文件证据、候选路线/义务/阻碍和具体建议后确认；未知项显式阻挡相关后续复用 |
| 平台/测试环境和测量方法 | BASE-03 | 工具存在不等于目标构建或实机可用 | 阅读真实探测、工具用途、OS/架构依据与机器缺口；保留 Win10/11，Apple仅实机延期 |
| 性能阈值 | BASE-03 | 当前无产品原型测量 | 本阶段确认场景/统计方法；Phase 6/10 采集可比基线后再确认产品阈值 |

## Flagged Assumptions and Security

- BASE-01、BASE-02、BASE-03的spec-less edge结果均为unclassified/unresolved；三条计划显式保留，未声称自动解决。RESEARCH A1测量精度/时钟假设保留具体审阅。
- 六条bespoke prohibitions经projectProhibitions投影，无check_*描述符，仍flagged-unverified；人工判断与结构PASS分开。通用injection/path-traversal威胁交各计划threat_model及后续secure-phase，不伪造wired checks。
- ASVS5.0.0 L1；阻断阈值high。T-01-01至T-01-11各自唯一；T-01-SC为各计划共有保留ID。所有安装任务均不在范围，新增安装必须重新合法性审计。
- 许可决定在01-01证据完成后；完整功能/平台/测量决定在01-03完整报告后。缺工具/机器可作为后续阶段gap，不自动使BASE失败或伪称平台通过。

## Validation Sign-Off

- [ ] 每任务有自动验证或显式前序验证入口创建依赖
- [ ] 不连续三个任务缺少自动验证
- [ ] Wave 0 覆盖所有新入口
- [ ] 无 watch 模式，探测均有界
- [ ] 快速反馈时间经过执行验证
- [ ] 威胁引用与最终计划对应
- [ ] 全套检查及具体人工审阅通过后再更新验证状态

**Approval:** pending；规划不代表执行完成或 nyquist 合规已验证。
