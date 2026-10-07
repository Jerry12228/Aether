---
phase: "02"
slug: "monorepo-flutter"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-10-07"
---

# Phase 02 — Validation Strategy

本文件是执行时验证契约；当前尚无产品代码、构建结果或测量证据。命令由计划创建对应入口后运行，planner 须同步最终路径与任务编号。

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | CTest native contract executable；Flutter/Dart SDK tests；Node 既有工具检查 |
| Config file | CMakePresets.json、根 pubspec.yaml/pubspec.lock（02-01 tracer 创建） |
| Quick run command | `pwsh -NoProfile -File scripts/check-core.ps1 -Suite Lifecycle -Configuration Debug`；fails_when: native/真实 DLL 生命周期测试失败、未发现测试或停机越界 |
| Full suite command | `pwsh -NoProfile -File scripts/verify.ps1 -Scope All -Automation -CleanCheckout`；fails_when: 任一双端 clean build 或必需检查失败/跳过/无证据 |
| Estimated runtime | 未测；快速组目标 <30s，全量构建/GUI/既有基线套件单独计时 |

## Sampling Rate

- 每个任务提交前运行其 native / Dart / widget / CLI 相关检查；不以 mock 替代真实 DLL 测试。
- 每个 wave 完成后执行该 wave 已提供的完整检查；最终 wave 运行双端 clean checkout 构建与全部必需检查。
- verify-work 前保存实际命令、退出码、测试计数、耗时、工具链和日志路径。
- 快速反馈目标 <30s 尚未验证；全量 CI 允许更长且必须记录实际时间，无 watch 模式。

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | fails_when | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|------------|-------------|--------|
| 02-01-01 | 01 | 1 | CORE-01/02/03 | T-02-01/03 | 核心独立于 Flutter/Qt/研究目录 | configure | `cmake --preset windows-core` | 配置失败或引入研究/框架依赖 | ❌ 02-01 创建 | pending |
| 02-01-01 | 01 | 1 | CORE-01/02/03 | T-02-01/03 | 实际 DLL/Helios/contract 编译 | build | `cmake --build --preset windows-core-debug` | 编译/链接失败或产物缺失 | ❌ 02-01 创建 | pending |
| 02-01-01 | 01 | 1 | CORE-01/02/03 | T-02-01/02/03 | worker→creator isolate、真实停止销毁 | native + real FFI | `pwsh -NoProfile -File scripts/check-core.ps1 -Suite Tracer -Configuration Debug` | 无真实 DLL 测试、版本/线程错误或资源泄漏 | ❌ 02-01 创建 | pending |
| 02-01-02 | 01 | 1 | CORE-02 | T-02-01/02 | 当前生命周期代码进入被测二进制 | build | `cmake --build --preset windows-core-debug` | 变更源码或 native test 未成功重建 | ❌ 02-01 创建 | pending |
| 02-01-02 | 01 | 1 | CORE-02 | T-02-01/02 | ABI/所有权、cancel/stop、ACK/队列界限 | native + real FFI | `pwsh -NoProfile -File scripts/check-core.ps1 -Suite Lifecycle -Configuration Debug` | 迟到回调、缺/重复 terminal、无界排队、stale访问或停机越界无安全TIMEOUT | ❌ 02-01 创建 | pending |
| 02-01-03 | 01 | 1 | CORE-03 | T-02-04 | 五平台共用接口编译 | build | `cmake --build --preset windows-core-debug` | descriptor/interface 编译失败 | ❌ 02-01 创建 | pending |
| 02-01-03 | 01 | 1 | CORE-03 | T-02-04 | unsupported 原因与无分配 | native + FFI | `pwsh -NoProfile -File scripts/check-core.ps1 -Suite Adapters -Configuration Debug` | 缺平台、虚称实现、unsupported 分配或 ABI 泄漏 OS 类型 | ❌ 02-01 创建 | pending |
| 02-01-03 | 01 | 1 | CORE-01/03 | T-02-03 | 已有文档/参考锁回归 | Node | `node scripts/validate-planning.cjs` | 既有需求/阶段/引用校验非零 | ✅ tracked | pending |
| 02-02-01 | 02 | 2 | CORE-01/02/03 | T-02-05 | GPU/真实 surface、回滚保留 core | widget + Windows engine | `pwsh -NoProfile -File scripts/check-ui.ps1 -Suite Panel -Automation` | engine skipped/失败、CPU冒充GPU、自动启动画面、比例或core回滚错误 | ❌ 02-02 创建 | pending |
| 02-02-02 | 02 | 2 | CORE-01/02 | T-02-06 | Helios 新代码实际重建 | build | `cmake --build --preset windows-core-debug` | 编译失败/测试仍用旧产物 | ❌ 02-01 创建 | pending |
| 02-02-02 | 02 | 2 | CORE-01 | T-02-06/07 | automation非零失败、stdin不等、signal cleanup | real process | `pwsh -NoProfile -File scripts/check-helios.ps1 -Automation` | stdin挂起/错误零退出/前台提前退出/停机超时/伪造signal证据 | ❌ 02-02 创建 | pending |
| 02-02-02 | 02 | 2 | CORE-02 | T-02-05/06/07 | in-flight关闭、异步unregister、无销毁后callback | Windows engine | `pwsh -NoProfile -File scripts/check-ui.ps1 -Suite Lifecycle -Automation` | UAF/泄漏/迟到callback/GPU早释放/诊断丢失 | ❌ 02-02 创建 | pending |
| 02-02-03 | 02 | 2 | CORE-02 | T-02-08 | 双真实路径原始证据/限制 | report check | `pwsh -NoProfile -File scripts/measure-presentation.ps1 -CheckReport -Output artifacts/phase02/presentation` | 缺backend真实结果/原因或日志，合成数据/虚称支持 | ❌ 02-02 创建 | pending |
| 02-03-01 | 03 | 3 | CORE-01/03 | T-02-09/10/12 | Target白名单、shell参数、owned tree、失败传播 | Node | `node --test tests/build-tools.test.cjs` | dispatch/quoting/timeout/missing-test guard失败 | ❌ 02-03 创建 | pending |
| 02-03-01 | 03 | 3 | CORE-01 | T-02-09/11 | 只构建Helios/core | real build | `pwsh -NoProfile -File scripts/build.ps1 -Target Helios -Configuration Release` | 失败/隐式另一端/缺版本日志产物 | ❌ 02-03 创建 | pending |
| 02-03-01 | 03 | 3 | CORE-01 | T-02-09/11 | 只构建Selene/plugin/core | real build | `pwsh -NoProfile -File scripts/build.ps1 -Target Selene -Configuration Release` | 失败/隐式Helios/版本不同 | ❌ 02-03 创建 | pending |
| 02-03-01 | 03 | 3 | CORE-01/02/03 | T-02-03/11 | source/lock/hash/generator drift门禁 | source check | `node scripts/check-sources.cjs --check` | 任一来源/锁/许可/散列/版本/绑定漂移，或研究链接 | ❌ 02-03 创建 | pending |
| 02-03-02 | 03 | 3 | CORE-03 | T-02-13 | 不抹掉五端/Apple构建/原目标差异 | Node | `node --test tests/platform-contract.test.cjs` | 平台状态/差异/证据语义guard失败 | ❌ 02-03 创建 | pending |
| 02-03-02 | 03 | 3 | CORE-03 | T-02-13 | viability真实结果或具体executor缺口 | platform check | `node scripts/check-platforms.cjs --check` | 缺尝试/原因/前提/责任/后续阶段，或未实现记支持 | ❌ 02-03 创建 | pending |
| 02-03-02 | 03 | 3 | CORE-01/02/03 | T-02-09/11/12/13 | 无reference clean双端与完整必需检查 | clean build + full suite | `pwsh -NoProfile -File scripts/verify.ps1 -Scope All -Automation -CleanCheckout` | 任一双端build/必需检查失败跳过/缺证据/使用研究树 | ❌ 02-03 创建 | pending |
| 02-03-02 | 03 | 3 | CORE-01/03 | T-02-13 | 文档/要求既有回归 | Node | `node scripts/validate-planning.cjs` | 既有规划校验失败 | ✅ tracked | pending |
| 02-03-02 | 03 | 3 | CORE-01/03 | T-02-13 | 真实planning fixture回归 | Node | `node --test tests/planning.test.cjs` | 测试失败/child-spawn限制被忽略 | ✅ tracked | pending |
| 02-03-03 | 03 | 3 | CORE-01/02/03 | T-02-03/11/13 | 人审前源与已验结果一致 | source check | `node scripts/check-sources.cjs --check` | 审阅来源/绑定/版本/锁漂移 | ❌ 02-03 创建 | pending |

所有命令均在 checkout root 执行；包装器设置真实 DLL 路径并在所属 Flutter workspace package 运行对应测试。Node child-spawn EPERM 必须在可运行环境重跑，不能记通过。Windows CI 还须保存实际 run URL/commit/runner/结果；仅 workflow 文件存在不能当实际 CI 通过。

## Wave 0 Requirements

- [ ] 02-01-01 创建 CMakePresets.json 的 windows-core / windows-core-debug / windows-core-release；CTest 测试名 core_tracer/core_lifecycle/core_adapters；Release 检查不用可被 NDEBUG 移除的 assert。
- [ ] 02-01-01 创建 scripts/check-core.ps1、C头、programmatic ffigen 配置、实际 DLL fixture 与 packages/selene_native/test/core_contract_test.dart；02-01-02 加完整 ownership/ACK/cancel/stop/destroy 反例。
- [ ] 02-02-01 创建唯一 app/plugin、apps/selene/test/native_panel_test.dart、apps/selene/integration_test/native_panel_test.dart 和 scripts/check-ui.ps1；02-02-02 加 close/故障注入/资源计数。
- [ ] 02-02-02 创建 tests/helios-process.test.cjs 和 scripts/check-helios.ps1；02-02-03 创建 measure-presentation.ps1/报告及真实测量引用。
- [ ] 02-03-01 创建 build/verify/source-check 和 tests/build-tools.test.cjs；02-03-02 创建平台 guard/tests 与 Windows CI/证据包。
- [ ] version.json、toolchains.lock.json、pub workspace单锁、单一版本生成和binding drift完整；libclang与精确pub包来源/许可在首次解析前核验。

这是每个对应 tracer/task 的先建测试再实现要求，无独立空目录 Wave 0 计划；当前所有新增入口均未创建、未执行，wave_0_complete 仍 false。

## Four-Source Coverage Audit

| SOURCE | ID | Feature / Constraint | Plan / Task | Status | Notes |
|--------|----|----------------------|-------------|--------|-------|
| GOAL | Phase 2 | 单仓 Windows 双端骨架与干净构建 | 01 tracer + 03-01/02 | COVERED | 独立core，不读reference |
| GOAL | SC-2 | 跨边界句柄/错误/停止、Texture/surface结论 | 01-01/02 + 02-01/03 | COVERED | native+真实DLL+engine证据 |
| REQ | CORE-01 | 主入口双端/共享模块/版本 | 01-01 + 02-02 + 03-01/02 | COVERED | single version source |
| REQ | CORE-02 | 所有权/线程/取消/事件/能力，无Dart媒体 | 01-01/02/03 + 02-01/02/03 | COVERED | ACK、队列/并发界限、dispose barrier |
| REQ | CORE-03 | 共享契约/Windows CI/五平台接口 | 01-03 + 03-01/02 | COVERED | unsupported解释与证据分层 |
| RESEARCH | A1 | C++20/CMake、standard plugin、责任边界 | 01-01/03 + 02-01 | COVERED | 研究选择，等待真实构建 |
| RESEARCH | A2 | ABI/ownership/exception/callback/thread/ACK/queue | 01-01/02 + 02-02 | COVERED | 不依赖异步消息隐含顺序 |
| RESEARCH | A3 | version/SDK/generator/source/hash/locks/CI | 01-01 + 03-01/02 | COVERED | 实际工具链日志、full SHA |
| RESEARCH | A4 | ffigen/ffi合法性/许可/libclang/绑定drift | 01-01 + 03-01 | COVERED | pub未审计状态保留到具体核验；Pigeon非所选分工必需 |
| RESEARCH | A5 | 前台/自检/automation/输入重定向/退出 | 02-02 | COVERED | 真exe和交互证据分别留存 |
| RESEARCH | A6 | 同源GPUTexture/native surface/比例/失败/HDR风险 | 02-01/02/03 | COVERED | 真实原生路径，缺指标明确unavailable |
| RESEARCH | A7 | native/realFFI/widget/engine/CLI/基线分层 | 全三计划 | COVERED | 包装器存在后运行，零发现不能green |
| RESEARCH | ENV | 原Android/Linux差异、Apple/Linux/ARM/Win10 executor | 03-02 | COVERED | viability尝试、具体前提责任与保留范围 |
| CONTEXT | D-01 | 原生验证首屏/版本能力状态/句柄与测试图操作 | 01-01/03 + 02-01 | COVERED | native真实状态 |
| CONTEXT | D-02 | 自动core初始化、手动画面 | 01-01 + 02-01 | COVERED | 不自动启动图 |
| CONTEXT | D-03 | 静态可切换色条/网格/文字、本地标识 | 02-01/03 | COVERED | 性能由真实记录给出 |
| CONTEXT | D-04 | 完整等比留边 | 02-01 | COVERED | Flutter与native viewport |
| CONTEXT | D-05 | 前台版本/初始化/诊断/Ctrl+C | 02-02 | COVERED | handler仅发request |
| CONTEXT | D-06 | init后保留前台、独立self-test | 02-02 | COVERED | liveness与self-test分开 |
| CONTEXT | D-07 | 本地成功/失败最终按键 | 02-02 | COVERED | genuine terminal判断 |
| CONTEXT | D-08 | automation无交互/退出码 | 02-02 | COVERED | stdin EOF不挂 |
| CONTEXT | D-09 | core失败保留窗口/详情/retry/禁用 | 02-01 | COVERED | widget+engine负向 |
| CONTEXT | D-10 | render失败保留core/rollback/retry | 02-01/02 | COVERED | 故障注入每个资源步 |
| CONTEXT | D-11 | window close自动有界清理/日志/无确认框 | 02-02 | COVERED | drain+unregister barrier |
| CONTEXT | D-12 | 默认状态最近错误、展开events/logs | 02-01/02 | COVERED | 敏感字段脱敏 |
| CONTEXT | D-13 | 本地清理不停止主机持久实例、独立Stop/Disconnect | 01-02/03 + 02-02 | COVERED | unique lease/observer限制保留 |
| CONTEXT | D-14 | Target Helios OR Selene | 03-01 | COVERED | 无默认双端 |
| CONTEXT | D-15 | build/verify分离、CI必需全量 | 03-01/02 | COVERED | build不隐式测试 |
| CONTEXT | D-16 | 简洁summary、完整日志路径 | 02-02 + 03-01 | COVERED | 失败非零/超时明确 |
| CONTEXT | D-17 | PR/main/manual Windows双端CI | 03-02 | COVERED | clean、full-SHA、最小权限 |
| CONTEXT | inherited | GameStream、research-only、完整原功能、Apple例外、关键节点 | 01-03 + 03-02/03 | COVERED | 不提前锁Phase6、最后人审不自动启动 |

无新增 deferred idea。相关真实协议/媒体/驱动/远程仲裁由既定后续阶段承担，本地核心/呈现清理不得改变其已确认约束。全部 source items 已有实施或约束任务；COVERED 表示规划覆盖，不表示执行通过。

## SPECless Fallback and Prohibition Recall

02-EDGE-PROBE.json 对 CORE-01、CORE-02、CORE-03 均为 category=unclassified/status=unresolved、verification/resolution/reason=null；3/3 未分类未解决。三个计划均携带明确 flagged assumptions，不能自动改为 resolved/backstop 或伪造引擎通过。

按 prohibition-probe 两阶段逐项 recall：普通正确性（句柄/排队/输入/日志/锁）归契约测试；通用注入/内存/来源/权限安全归 ASVS 威胁模型，不额外铸造合规禁止项。保留六个产品意图/透明度项，按 projectProhibitions 的 flat scalar shape 分布在三个计划 must_haves.prohibitions：每项 status=unresolved、verification/resolution/reason=null，无 check_* 描述符。数量相等（6 recall → 6 authored），均为 flagged-unverified，最终具体证据人工审阅；不静默丢弃、不 auto-dismiss。

六项分别是：CORE-02本地销毁不能停止持久主机会话；CORE-02不能隐含第二租约/观察者变更权限；CORE-02测试图不能声称流/HDR/性能；CORE-01当前构建不能声称五平台/最低版本实测；CORE-01开源意向不能批准未知研究复制/链接；CORE-03缺口不能砍原能力/Apple构建或挪TODO。

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 静态色条/网格/文字与比例留边 | CORE-02 + D-03/04 | GUI 视觉与实际 GPU/backend 需要观察 | 切换图、缩放/DPI、启停/关闭；记录截图、GPU/driver/backend和资源计数 |
| GPU Texture / native surface 对照 | CORE-02 | 静态画面及 CI 不证明零拷贝或性能 | 同源静态图、明确 GPU/CPU 路径、按既定测量窗口记录数据与限制；HDR/多窗未测则保持待测 |
| 交互 Ctrl+C、成功/失败按键等待 | CORE-01 + D-05–08 | 控制台交互路径需实际运行 | 与 automation 无输入超时测试分开；保留清理诊断 |
| Phase 2 完整骨架人审 | CORE-01/02/03 | 仓库关键节点确认 | 查看双端 clean build、契约负向测试与原型报告后确认；不自动进入后续阶段 |

## Validation Sign-Off

- [ ] 所有任务有自动检查或明确 Wave 0 前提，且每个 runnable command 有 fails_when。
- [ ] 无连续三个任务缺自动验证；没有空测试通过或未运行记 green。
- [ ] Wave 0 创建所有计划引用的测试入口，最终命令与本文件一致。
- [ ] 无 watch 模式；快速反馈实际耗时与全量 CI 耗时分开记录。
- [ ] 真实 Dart/native 回调与 shutdown 负向证据完成。
- [ ] 五端接口未实现状态、Apple 构建义务与原平台差异均保留。
- [ ] `nyquist_compliant: true` 仅在执行验证后设置；当前保持 false。

**Approval:** pending；本次规划没有执行产品验证。
