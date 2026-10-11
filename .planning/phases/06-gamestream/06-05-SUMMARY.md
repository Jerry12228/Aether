---
phase: 06-gamestream
plan: "05"
subsystem: protocol-targets
tags: [CMake, CI, Windows, POSIX, XCTest, provenance]
status: in_progress
checkpoint: 06-05-01
checkpoint_gate: target-execution
blocked_by: []
requires:
  - phase: 06-04
    provides: 真实 Dart FFI、独立主机与固定协议依赖
provides:
  - 明确目标的隔离构建入口和初始 Linux CI 准备
  - POSIX 子进程测试宿主及 iOS XCTest 初始适配
  - 本地 Windows Debug/Release 与真实 FFI 准备证据
affects: [06-05-target-matrix, 06-05-evidence-validator, 06-05-human-review]
tech-stack:
  added: []
  patterns: [目标隔离依赖, 固定标量输入, 真实运行证据与准备状态分离]
key-files:
  created: [scripts/build-protocol.cjs, .github/workflows/protocol.yml, tests/native/protocol_contract.cpp, tests/native/ios/ProtocolContract.mm, docs/phase06/06-05-PREPARATION.json]
  modified: [native/protocol/CMakeLists.txt, tests/native/protocol_control.cpp, tests/protocol-tracer.test.cjs, tests/protocol-multistream.test.cjs, tests/protocol-recovery.test.cjs]
key-decisions:
  - 自动审批拒绝远端发布后只完成本地准备，不以其他入口上传。
  - 编译错误不计行为 RED；五目标、独立 validator 和最终人审均未通过。
  - 仅固定上游 SRTP KAT 驱动使用 /Od，保留 /WX 与生产 Release 优化。
requirements-completed: []
requirements-contributed: [NET-01, NET-02, NET-03]
coverage:
  - id: local-preparation-regression
    description: 已准备入口的本地 Windows Release 和原 Debug/FFI 回归
    verification:
      - kind: integration
        ref: docs/phase06/06-05-PREPARATION.json
        status: pass
    human_judgment: false
  - id: five-target-closure
    description: 五目标实际产物、运行、独立 validator 与最终人审
    verification:
      - kind: other
        ref: .planning/phases/06-gamestream/06-05-PLAN.md
        status: unknown
    human_judgment: true
    rationale: 当前仅本地准备通过；必须先取得实际目标证据，不能以人工承认缺口代替自动门槛。
actuals:
  tokens: 18872
  tasks: 0
  commits: 2
plan_head_before: b598ee92b87cf4547fff51854a738ed152710afc
plan_head_after: 1b703afd1267b07aeaec412c38d27a9d3f404f95
checkpoint_recorded: "2026-10-11T04:55:00Z"
---

# Phase 06 Plan 05：五目标执行准备与发布批准停点

**目标构建入口和可移植测试宿主已准备，本地 Debug/Release 与真实 FFI 回归通过；06-05 三个任务均未完成，等待具体远端发布批准。**

用户本会话原答复 `1` 选择执行 06-05。此选择不改写 Phase3 的独立安装批准门槛。Phase6 仍为 5/6、全项目 13/15 计划及 2/42 阶段，NET-01/02/03 未完成。

## 当前准备与提交

| 准备 | 本地提交 | 内容 |
|---|---|---|
| 目标入口与测试适配 | `ff3d776` | 明确 target/arch/configuration，目标目录隔离 OpenSSL/libSRTP，固定批准 Botan 23cpp/78输入；POSIX fork/exec 宿主、桌面 wrapper、iOS device/simulator 初始配置与 XCTest |
| Release 测试编译修复 | `1b703af` | 固定上游 SRTP `srtp_driver` 的 Release 优化告警，保留生产优化及所有 `/WX` |

历史准备时 workflow 仅为 Linux x64 首条执行链；当前已扩展为12作业矩阵，仍不是五目标全部通过。原 native 测试控制路径、三个 Node suite 的 OpenSSL/文件名适配超出计划列出的精简文件清单，属于 Rule3 必要前置修复。无新依赖、协议实现或公开 header 变化，FEC 准入和历史审阅字节不变。

`actuals.tokens=ceil(75487/4)=18872` 为上述两个准备提交 Git diff 字符尺度估算，非模型实际用量；9 个文件、0 个完成任务。摘要/证据/规划提交不计任务提交。

## 本地真实验证

| 检查 | 结果 |
|---|---|
| 适配后的原协议 Debug CTest | 12/12，110.04s，零失败/跳过 |
| 新入口 Windows x64 Release CTest | 12/12，103.43s，零失败/跳过 |
| 真实 Flutter/FFI | 22/22，20601ms；21 个独立 host/client PID 场景，回调停止、最终 owned=0 |
| 新 Release 产物 | 5 个实际 DLL/EXE，来源提交 `1b703af`，源码/依赖/产物摘要核对通过 |
| CLI 错误输入 | 4 组拒绝，未写错误目标目录；语法及 diff 检查通过 |

完整记录见 [准备证据](../../../docs/phase06/06-05-PREPARATION.json)，SHA256 `fcf1db314ae695a6f9be59ea95d47a922e3dc02c76fa36b220a259a0c129fbee`。Release inputDigest 为 `2a60c360b9102367f1c7dcdc44f8376ae6daff76f5dd757e849443a8a5bb9164`。此摘要覆盖 manifest 声明的输入；workflow、工具入口和 Dart 测试/锁等另列 reviewInputs，尚不是最终五目标全部输入总账。Debug/FFI 为 KAT 编译选项修复前的回归，Release 为修复后的新入口运行，二者不能互相改绑。

首次全新固定 OpenSSL 编译实际 326766ms；缓存依赖后的成功构建 3515ms不代表冷构建性能。首次 Release 编译的 C2220/C4701 原始日志保留。检查固定源码可见 `tmp_policy` 在同一 `extension_header` 分支初始化再使用，因此只给测试驱动 `/Od`，不关闭警告或改变上游源码。早期 conditional guard 编译失败及此次优化告警均是构建失败，不是 Task1 Linux socket 行为 RED。准备记录解析时 CTest 摘要格式不匹配及 sandbox spawn EPERM 分别修正/正常申请提权，均不计产品失败或 TDD RED。

## 历史准备时环境与缺口（后续实际进展见下文）

本机 WSL Ubuntu24.04.3 是 Linux x64，缺 native CMake/C++ 工具；没有宣称已运行 Linux 合同。Android NDK28.2.13676358 存在，但 adb 无连接目标，没有实际 Android 产物/执行。macOS/iOS 本机无目标工具链，XCTest 代码未编译或运行；目前 XCTest 初始控制/向量适配也尚缺完整媒体/FEC 套件。Android arm32 的原 x64 布局断言仍待按实际 ABI 适配。没有用 SDK、runner label 或源文件存在充当平台通过证据。

Task1：批准发布后先取得实际 Linux socket/安全行为 RED，再完成实际目标矩阵和对应回归；此前准备不计任务 GREEN。Task2：尚未新增独立 `verify-protocol.cjs`、known-bad 行为 RED、TARGETS/EVIDENCE 最终总账。Task3：所有实际构建/运行门槛通过后才开放强制最终人审；不能用本次推送批准代替最终人审或关闭环境缺口。

## 历史具体发布批准门槛（已由后续真实答复解除）

自动审批拒绝了包含 `git push origin HEAD` 的命令，说明：本地提交范围明确，但执行 06-05 尚未明确授权向具体远端发布多文件源码、CI 工作流及测试。该被拒命令整体未执行；随后只做独立获准的本地提交，没有推送或另行上传。

待批准远端为 `https://github.com/Jerry12228/Aether.git`（公开仓库），工作分支为 `codex/phase-03-virtual-display-feasibility`。远端 main 当前本地已取记录为 `9aff292`；准备提交 `1b703af` 比 origin/main 多 106 个历史提交，包含此前未推送的 Phase3/Phase6 工作。正式请求同时披露最终元数据提交后的数量。需明确批准发布当前整个工作分支和后续同分支 Phase6 CI 修复/证据提交、运行五目标 CI；不合并 main、不 force push。当前初始 workflow 的具体字节在 reviewInputs 中绑定，可先查看实际 diff。

无设备/驱动/证书信任/Apollo/网络配置变更，没有执行或安排重启/关机。Phase3 新固定安装计划的授权仍独立待定；06-04 历史证据、06-03 量测和原 ADR/FEC 批准保持原绑定。

## 2026-10-11 发布批准后续记录

用户真实原答复`1`批准公开Jerry12228/Aether完整当前分支（审阅327132c、比origin/main多108提交）和同分支Phase6五目标CI/修复/证据后续提交。见[独立发布决定](../../../docs/phase06/06-05-PUBLICATION-DECISION.json)。历史自动审批拒绝和准备证据保持原样，此新批准解除具体发布门槛，继续Task1；不代替最终人审或Phase3安装批准。当前status为in_progress，0/3任务；实际完整目标证据、独立validator和强制最终人审尚未完成。

实际Linux行为RED先保存7432175：固定来源49850e5的mTLS拒绝读权限案例期望`AP_PERMISSION=23`、实际`AP_LENGTH=24`，CTest退出8、19项tracer中12通过7失败，GSD检查明确`RED_EVIDENCE_OK`。见[原始RED记录](../../../docs/phase06/06-05-LINUX-RED.json)。先前孤立用例输出缺全套计数被判invalid，不冒充有效RED。生产6e4cb48修正有界TLS关闭及Linux/Android `MSG_NOSIGNAL`、Apple逐socket `SO_NOSIGPIPE`；无进程全局信号/信任策略变更。后续真实Linux拒绝用例通过；历史审阅归档与研究源码改为独立固定审计快照，原批准哈希不变。

当前CI矩阵包含六桌面架构、三个Android ABI、iOS device arm64和两个simulator架构。`38117210669`的Linux x64/arm64各14/14；`38117546197`的Linux两架构通过、macOS arm64通过、Android三个ABI及iOS device实际构建通过。它们绑定各自旧source/inputDigest，不能冒充最新d387538已测。Apple字段窄化编译失败、Xcode额外注入SRTP精度警告、Android宿主编译器探测错误已修正f0096ad；保留固定依赖原始源码、其余原警告和-Werror，只对SRTP目标关闭Xcode额外64→32诊断；所有自有SRTP policy仅一个master key，完整安全运行仍需实际目标证据。新d387538提供adb ABI/CPU/native-bridge核验、真实27双PID控制场景、安全及独立向量入口与自有x64 emulator。Android完整多流故障/60恢复仍明确失败并保留gap；ARM目标不以交叉构建代替运行。

本地新增回归为Windows Debug12/12（111.36s）、Flutter22/22（26,457ms；21独立host）且零skip，明确在Apple字段类型修复前，不改绑后续源码。此前测试期间修改源文件导致tracer/multistream source drift失败，重新构建后才通过，失败日志保留。Task1范围外的必需辅助文件用于真实来源审计和runner记录，按Rule3补充；没有删除原637case、旧ABI1或legacy1/2。恢复组是60个有各自deadline的用例，实际组约90秒，不能写成30秒fast结果或隐去原计划反馈预算差异。

## 2026-10-11 Android虚拟机授权与当前真实回归

用户原文「Android Studio就绪，qemu就绪；自行创建虚拟机进行测试」授权自有目录虚拟机，后续「用量恢复」继续既有执行。仅在ignored build/保存固定官方镜像/工具、自有AVD和测试文件；无需驱动或开发机重启。官方API24 ARM64 r29与Emulator32.1.13、官方API21 ARM32 r4与固定Gitiles classic工具已下载并逐字节校验；来源与SHA在[部分执行记录](../../../docs/phase06/06-05-EXECUTION.json)引用的实际receipt，不作为产品依赖。

`d647664`/inputDigest `bfef80f6c489a61ab6706d1d2cc88b0c6093b1fb1a44f89ad10a39605f1a25f7`的CI `38128868716`：Windows x64/arm64各12/12，Linux x64/arm64各14/14，iOS device arm64实际构建及两种simulator各42/42通过，零skip。Mac x64恢复60/59、arm64恢复60/57，各CTest13/14；取消被接受后实际仍retry-exhausted，arm64另有确认超时及健康流短窗不前进。先提交[MACOS-RED](../../../docs/phase06/06-05-MACOS-RED.json) `bfd28fb`，未修改原60断言或将失败豁免。

ARM64实际API24/aarch64/nativeBridge0 guest中31双PID控制场景、parent65/65及legacy1/2真实安全交换通过；随后FEC golden原生退出0，但旧linker前缀警告导致JSON解析失败，整体target仍失败。ARM32实际API21已sys.boot_completed=1；初始CRLF/首行回执解析错误已保存，独立target因旧系统没有uname提前失败；实读/proc/cpuinfo为ARMv7、architecture7。两种架构原始partial/失败均保留，不宣称Android全部运行通过或完整产品OS支持。

`4f2a50d`修复受理取消被worker复位的竞争、为控制socket设置TCP_NODELAY、严格识别自有路径下已观察到的linker警告（原始日志保留）、API21内核CPU核验和独立guest退出回执，逐项保存部分通过计数。修复后真实Windows Release12/12，108.66s，target入口108785ms，inputDigest `7d0cef465c072384f54d424541dc27994372cef79ec3f5d61dacc0a4c2ef3558`；本地构建前HEAD为证据提交bfd28fb，此未提交源绑定不得伪装已测Git提交。修复已按既有分支授权推送，新实际CI `38132980639`执行中，将提供4f2a50d准确提交绑定。

Android完整19多流故障与60恢复仍未运行；五目标同输入CI尚未通过，独立validator/known-bad RED与最终强制人审未开始。Task1 in_progress，0/3任务，Phase6仍5/6、NET未关闭；Phase3/plan3/halted独立安装关口保持。实际fast标签整组105.50s不是30秒结果。

## 后续实际虚拟机与 CI（2026-10-11）

上述4f2a50d停点为历史结果。05ec0e2的API24 ARM64已实际通过28项/160断言（含31控制场景和legacy1/2），完整目标当时仍退出1。4f2a50d的API21 ARM32原有恢复60/60通过、150787.2576ms另有固定记录。fc14fde/input21c7da3b媒体中继首轮实际27项8通过19失败，API21 touch只接受单文件导致屏障未创建；此轮是适配失败，不冒充产品行为RED。原始日志和hash见[VM2记录](../../../docs/phase06/06-05-ANDROID-VM2.json)，旧通过和失败绑定保留。

2c24053有界TLS同轮分段读取修复后，实际CI38136106760的Mac ARM64恢复60/60通过，媒体27/26仍有fec-domain-tamper整体截止超时，CTest13/14；当前没有将其豁免。96a49e4接入固定官方CPU虚拟机、自有guest OpenSSL证书、逐一创建屏障及未删减恢复60项，CI38137338723正在运行。最新Windows本地12/12、92.69s，target92801ms，input7761dd7c2f95c4d44b57d8ba8f0c431fca3000cc0598ad2a9af418c95f33a229；构建时HEAD为fc14fde，CI会核验实际96a49e4。

Task1仍in_progress，0/3任务；原有27媒体/60恢复断言、25ms媒体期限、637能力case及既定来源保持。protocol-fast标签89.55s的实际差异仍未解决，不能写成30秒通过。五目标同输入、独立证据validator/known-bad RED和最后真人确认尚未完成。
