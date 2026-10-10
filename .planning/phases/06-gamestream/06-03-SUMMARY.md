---
phase: 06-gamestream
plan: "03"
subsystem: protocol
tags: [gamestream, admission, recovery, diagnostics, mTLS, SRTP, ASan]
status: complete
requires:
  - phase: 06-06
    provides: typed control C ABI、可信 HostServices、持续 worker、取消及 READY 屏障
provides:
  - 完整 proposal、六维原子预算与两策略协商
  - fresh-auth 恢复、独立上行确认、逐流恢复及有界临时 trace
  - 三轮真实 socket 限值实测及完整原能力合同映射
affects: [06-04, 06-05, 07-session-authority, 后续媒体与平台阶段]
tech-stack:
  added: []
  patterns: [六资源原子事务, fresh TLS 与新 epoch, 单流 generation 隔离, 标量诊断 allowlist]
key-files:
  created: [native/protocol/src/admission.cpp, native/protocol/src/session_lifecycle.cpp, native/protocol/src/diagnostics.cpp, tests/protocol-recovery.test.cjs, docs/phase06/LIMITS.md, docs/phase06/06-03-PARITY.json, docs/phase06/06-03-03-EVIDENCE.json]
  modified: [native/protocol/CMakeLists.txt, native/protocol/src/control.cpp, native/protocol/src/internal.h, native/protocol/src/media_packetization.cpp, native/protocol/src/secure_transport.cpp, native/protocol/tools/tracer.cpp, tests/native/protocol_control.cpp, docs/FEATURE-PARITY.md]
key-decisions:
  - 六维预算和确认取消以可信主机事务裁定；unknown 不报告成功，已 commit 不因取消撤销。
  - 真正 transport 断开后同 handle 保持 manual，可有界停止、取消和手动 fresh-auth 重试；instance/display 保留。
  - 量测绑定 f853627 归档二进制；最终断线与重复 reset 修正由独立最终回归证明，不改绑旧量测 hash。
requirements-completed: []
requirements-contributed: [NET-01, NET-02, NET-03]
coverage:
  - id: negotiation
    description: D-01–04/D-09–13 的全方案、优先序、禁用原因及六维共享预算事务
    verification:
      - kind: integration
        ref: tests/protocol-recovery.test.cjs
        status: pass
    human_judgment: false
  - id: recovery-diagnostics
    description: D-05–08/D-13–16 的 fresh-auth、上行确认、逐流隔离及临时 trace
    verification:
      - kind: integration
        ref: docs/phase06/06-03-03-EVIDENCE.json
        status: pass
    human_judgment: false
  - id: limits-parity
    description: 三轮真实时间量测及 637 个原 case、12 个 NET 设置合同映射
    verification:
      - kind: other
        ref: docs/phase06/LIMITS.md
        status: pass
    human_judgment: false
actuals:
  tokens: 249962
  tasks: 3
  commits: 6
plan_head_before: 57018702301df87e756263a248f22eb67fba5923
plan_head_after: bce5030c8269a1abc5db0946f70d4d3cc9b08a8b
duration: 108min
completed: 2026-10-10
---

# Phase 06 Plan 03：全方案、恢复与限值实测摘要

**真实双进程控制路径现可一次确认完整六资源方案，fresh-auth 恢复连接并独立确认上行，逐流恢复不阻断健康流；三轮实测与原能力合同均有可核验证据。**

## 实际交付

1. Task1：admission 集中检查 encoder/uplink decoder/downlink decoder/pixel rate/VRAM/bandwidth；全 proposal 返回差异和不可用原因，默认保全部屏，主屏优先可选；桌面保 resolution、游戏保 fps、camera 先让带宽。confirm/reservation/revision/expiry/owner 共享事务域与 GRANT/READY 屏障相连，已有 grant 不被失败或取消请求挤占。
2. Task2：真实 fresh TLS、新 connection/lease/key；原 controller 空闲恢复、占用拒绝、observer 不升权。旧 input/settings/clipboard/media 拒绝；mic/camera 全集合另一次 confirm，提交时重新检查权限/设备/六资源。临时 trace 具备 start/stop/extend/remaining/expiry/实际 64KiB cap，默认与临时模式均无秘密或内容泄漏。
3. Task3：边界与两 OS 标签下六个原设置分别验证；637 个原 case 保留，12 个 NET case 映射，3 个 unclassified 与 6 个 descriptorless 仍 flagged-unverified。独立量测入口完成 30s 预热 + 至少 60s 窗口 × 3，并保存真实双 PID、原始分母、资源取样、日志 hash 与失败历史。

## 原子提交与 TDD Gate Compliance

| 任务 | RED | GREEN | 结果 |
|---|---|---|---|
| 1 全 proposal/六资源 | `5c3d2f6` | `3ec8231` | 首组 18/18，真实五流与共享连接；tracer feedback 重跑通过 |
| 2 恢复/临时 trace | `6ce3ede` | `f853627` | 32/32，43336.5986ms；旧 control 回归通过 |
| 3 限值/原 case 映射 | `842aa20` | `bce5030` | 最终 recovery 60/60，完整回归及三轮量测通过 |

三项 RED 都是目标行为断言失败，对应 `06-03-01/02/03-RED.json` 经 `check tdd-red-evidence` 得到 `RED_EVIDENCE_OK` 后才实现 GREEN。Task3 RED 为缺失 12 个原 NET case 映射的断言；沙盒 EPERM、一次证据写入命令错误不计作 RED。没有独立 REFACTOR 提交，正常 hooks 未绕过。

提交数从 `.git/gsd-plan-head-before-06-03` 测量，`before..after` 为 6，覆盖 20 个文件；摘要元数据提交不计入上述产品任务区间。`tokens=ceil(diff 字符数/4)=249962`，字符数 999847，与计划估算采用同尺度，主要包含完整 case 映射和原始结构化证据，非模型 token 用量。108min 为计划基线提交 13:22:41Z 至统计时间 15:10:56Z 的墙钟覆盖范围，包含中断/恢复等待，不是 CPU 时间。

## 最终验证与量测绑定

| 验证 | 实际结果 |
|---|---|
| Debug Node 三文件 | 106/106，63980.8152ms；旧协议 46 + recovery 60 |
| Debug CTest | 12/12，108.14s |
| ASan Release CTest | 12/12，109.00s；recovery 60/60，63707.0285ms |
| 原控制回归 | 27 个场景、parent 57/57、native client 总断言 445/445；Debug/ASan 均通过 |
| 最后两个新增恢复场景 | 真实 transport 丢失后同 handle manual 重试；重复恢复仅目标流 key 递增；连同五流终态统计复验 3/3 |
| 三轮量测 | 预热 30495/30483/30506ms，窗口 61111/61120/61114ms，总 281648.188ms < 330000ms deadline |

所有最终测试零失败、零 skip/cancel/todo。最后两项修正后重新构建 Debug/ASan，并重新运行受影响完整 suite。证据：[01](../../../docs/phase06/06-03-01-EVIDENCE.json)、[02](../../../docs/phase06/06-03-02-EVIDENCE.json)、[03](../../../docs/phase06/06-03-03-EVIDENCE.json)；阈值、CPU/资源/流计数分母和精度见 [LIMITS](../../../docs/phase06/LIMITS.md)。原始日志与测试运行目录在 ignored build 中保留路径及 SHA-256，结构化证据入库。

量测明确绑定 `f853627`，原 4 个二进制、manifest 及其 13 个源码精确字节已在首次最终重建前固化到 `build/phase06/measure-06-03-f853627/` 并核验 hash。最终变化作用于 transport loss/manual 重试、第二次及之后 stream reset，以及断线前标量统计保留；量测无 transport loss、每轮仅首次 key1→2 reset，健康服务/trace/采样输入未变。因此保留指定旧版本量测，不把旧结果或旧 hash 绑定最终二进制。首轮旧取样失败和最终旧统计失败均保存失败日志，修正后才记录通过。

## 必要偏差

- **Rule3：selected3 持续媒体服务。** 原 one-shot 服务不能支持要求的持续五流/量测；最小扩展 `media_packetization.cpp`，有界 payload/队列，selected2 精确回归保留（`3ec8231`）。
- **Rule2/3：最小 internal/fixture 合同。** 在 `internal.h` 与独立 `tests/native/protocol_control.cpp` 增补六维共享预算、fresh-auth/epoch/lease/权限设备复查；provider 只编入 fixture static target，不进入产品 DLL（Task1/2 GREEN）。原边界测试的保留 opcode 改用无副作用 TRACE_STOP，保留边界验收目的。
- **Rule1/3：fresh 生命周期与 deadline。** 实测发现重复 crypto 释放、Windows 阻塞 connect 不能满足 250ms；消除双重释放，selected3 使用非阻塞 connect/select/SO_ERROR 与同一绝对 deadline，旧 v1/v2 行为保留（`f853627`）。
- **Rule1：Task3 最终直接要求缺口。** 真正断线后 worker 原先结束、同 handle 无法手动恢复；重复 stream recovery 原先固定 key+1。补 manual 等待/fresh reattach、当前 stream key 递增；旧 key/route/buffer 清空，统计只保留标量快照；完整 Debug/ASan 回归通过（`bce5030`）。
- **量测观测修正。** 首次末端 CPU 查询遇 owned client 已退出；增加明确 2000ms 清理等待与 callback 错误捕获，保留失败历史后重做有效三轮。未修改测量 hash 冒充新代码。

上述偏差由当前任务正确性/可执行性直接要求，已获原计划与父级必要性授权；未新增依赖、生产仲裁、设备/驱动/配对实现或其他阶段。

## 未测范围与交接

产品 DLL 无可信 HostServices 时拒绝授权；实际 authority 是 test-only fixture。所有媒体和 POLICY sink 为 synthetic 边界，真实 input/settings/clipboard、capture/codec/设备及生产配对/仲裁仍归原后续 owner。Win10 HDR 按 R1 返回 SDR 原因；Win11 HDR、其他 codec/color/444/多声道/输入反馈等保留 extension 与 owner，未宣称真实支持。两 OS case 标签在当前 Windows x64 同输入合同测试，不等于两套 OS 实机；五目标证据归 06-05。

ASan runtime 仅本进程 PATH；预编译 OpenSSL 不插桩，非 TSan/leak 认证。无新建 endpoint 或计划之外的 trust/auth/schema 边界。未发现阻止本计划目标的未接线 stub。未执行或安排重启/关机，Phase3 独立安装 gate 仍 halted。

**本计划 3/3 完成，NET-01/02/03 仅贡献协议合同，不关闭跨计划要求。** STATE/ROADMAP/REQUIREMENTS/VALIDATION 按父级 ownership 留待父级最终统一更新；未推进 06-04/05 或全部产品实现。

## Self-Check: PASSED

摘要、LIMITS、01/02/03 证据和原 case 映射文件均存在；六个 RED/GREEN commit 对象均存在；`git diff --check` 通过。三轮原归档、最终 manifest sources、输入及 raw logs hash 已在 Task3 证据生成时逐项核验。
