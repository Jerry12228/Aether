---
phase: 06-gamestream
plan: "05"
subsystem: protocol-targets
tags: [CMake, CI, Windows, POSIX, XCTest, provenance]
status: halted
checkpoint: 06-05-01
checkpoint_gate: blocking-human
blocked_by: [remote-publication-approval]
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

当前 workflow 仅为 Linux x64 首条执行链，不是已完成五目标矩阵。原 native 测试控制路径、三个 Node suite 的 OpenSSL/文件名适配超出计划列出的精简文件清单，属于 Rule3 必要前置修复。无新依赖、协议实现或公开 header 变化，FEC 准入和历史审阅字节不变。

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

## 环境与实际缺口

本机 WSL Ubuntu24.04.3 是 Linux x64，缺 native CMake/C++ 工具；没有宣称已运行 Linux 合同。Android NDK28.2.13676358 存在，但 adb 无连接目标，没有实际 Android 产物/执行。macOS/iOS 本机无目标工具链，XCTest 代码未编译或运行；目前 XCTest 初始控制/向量适配也尚缺完整媒体/FEC 套件。Android arm32 的原 x64 布局断言仍待按实际 ABI 适配。没有用 SDK、runner label 或源文件存在充当平台通过证据。

Task1：批准发布后先取得实际 Linux socket/安全行为 RED，再完成实际目标矩阵和对应回归；此前准备不计任务 GREEN。Task2：尚未新增独立 `verify-protocol.cjs`、known-bad 行为 RED、TARGETS/EVIDENCE 最终总账。Task3：所有实际构建/运行门槛通过后才开放强制最终人审；不能用本次推送批准代替最终人审或关闭环境缺口。

## 具体发布批准门槛

自动审批拒绝了包含 `git push origin HEAD` 的命令，说明：本地提交范围明确，但执行 06-05 尚未明确授权向具体远端发布多文件源码、CI 工作流及测试。该被拒命令整体未执行；随后只做独立获准的本地提交，没有推送或另行上传。

待批准远端为 `https://github.com/Jerry12228/Aether.git`（公开仓库），工作分支为 `codex/phase-03-virtual-display-feasibility`。远端 main 当前本地已取记录为 `9aff292`；准备提交 `1b703af` 比 origin/main 多 106 个历史提交，包含此前未推送的 Phase3/Phase6 工作。正式请求同时披露最终元数据提交后的数量。需明确批准发布当前整个工作分支和后续同分支 Phase6 CI 修复/证据提交、运行五目标 CI；不合并 main、不 force push。当前初始 workflow 的具体字节在 reviewInputs 中绑定，可先查看实际 diff。

无设备/驱动/证书信任/Apollo/网络配置变更，没有执行或安排重启/关机。Phase3 新固定安装计划的授权仍独立待定；06-04 历史证据、06-03 量测和原 ADR/FEC 批准保持原绑定。
