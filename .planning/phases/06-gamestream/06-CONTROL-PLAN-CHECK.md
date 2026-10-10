## VERIFICATION PASSED

**阶段：** Phase 6 — GameStream 协议重构与扩展。
**当前轮次：** Revision 1 定向复查，2026-10-10。
**当前问题：** 0 BLOCKER、0 WARNING、0 INFO。
**范围：** 原首轮取消/提交闭环 BLOCKER、项目合同语言 WARNING，以及修订触及的 06-06/03/04/05 消费边界。首轮完整静态检查与证据保留在下文。

原 BLOCKER 已解决。CONTROL-CONTRACT 将 cancel_operation 的 AP_OK 明确为接受本地意图，区分未发送操作与已经到达 peer 的 CONFIRM/CONFIRM_UPSTREAM。已发送副作用操作保持同 handle TLS 和有界结果 drain，以 opcode3/flags2、target_operation_id/request/digest/current binding 发关联取消；主机同事务域以 transaction_sequence 仲裁。cancel 先于 commit 才有权威 AP_CANCELLED，commit 成立后取消返回 AP_ALREADY_COMPLETE，不能取消撤销 committed grant。客户端按权威回执发布唯一 terminal，取消结果另记 cancelOutcome；deadline 未知使用 AP_TIMEOUT/resultKnown=false/authorityTerminal=null，不伪报取消成功。迟到可信回执只更新 query/state-change，不再生成第二个原操作 terminal。

GRANT/READY/READY_ACK 与 TRANSACTION_STATUS 已规定共同事务 binding、phase、activation_ttl 和最多 3 次有界重查。未激活到期/发布失败的 retire/accounting 清理与取消终态明确分离，迟到 READY 不重启；READY_ACK 丢失可重查 active 而不重复激活。单请求取消不关闭共享 TLS，不自动停止既有健康流；用户 stop 仍是独立操作，已发送但结果未知时也不假装权威取消成功。这些修订消除了首轮“主机已 commit 但 client 尚未读 GRANT”下的本地误判与错误撤销矛盾。

修订已写进执行材料而非只存在于报告：06-06-02 action/behavior/fails_when 要求真实两 PID 的 commit 前后、GRANT/READY/READY_ACK 延迟/丢失、deadline unknown、重复取消/回执重放，观察双方 transaction_sequence、六维 accounting、零重复启动及既有健康流同窗口推进；fixture 只调度 host 故障，client parser/取消/dispatcher 必须来自实际产品 DLL。06-03 方案和上行集合复用同事务语义；06-04 typed FFI 消费 resultKnown/authorityTerminal/activation/cancelOutcome，并增加真实 DLL/host 负例；06-05 五目标证据明确包含新控制事务/unknown 和旧1/2回归。没有缩减用户决策或改成测试客户端判定。

原 WARNING 已解决：CONTROL-CONTRACT 的标题、兼容、帧、provider、取消、query/stop及验收说明现为简体中文，API/字段/数值/状态码保持技术原文。没有改写原 ADR 或历史批准字节，没有新增复用库或系统授权。

定向读取全部 5 份修订材料，重新查询 06-06/04 结构，两份仍 valid=true、errors/warnings=[]。本轮没有执行产品、运行网络或测试，因此结论仅为可进入执行的计划属性；取消闭环及能力支持仍必须由计划中的真实验收证明。STATE/ROADMAP/VALIDATION 的同步仍由父编排器负责，保持 pending-sync，不冒称本轮已更新。

| 当前审阅材料 | SHA256 |
|---|---|
| docs/phase06/CONTROL-CONTRACT.md | fe274627fbb2b1fec0b6941151b0206f29946c6353ef1254e4b4e1f6bd7776b9 |
| 06-06-PLAN.md | b83c81f87ef6d9ff73b61ee83edb70aa296a20cee6eb3da96e61acbf28510ce0 |
| 06-03-PLAN.md | 90db114c82789a0a3d7fa5b588401a35db185069447ebef88623ae5086ebb08f |
| 06-04-PLAN.md | 2adcfa89aa39d93e5f649ad7029f027074f0a59676da0192dc1af4e2e8f14902 |
| 06-05-PLAN.md | 06ddf86f5e241bc034c9fdde9aaf4138495ab2ee9f2f749bcb46dcb827d7864e |

```yaml
status: passed
revision: 1
issues: []
resolved_initial:
  blocker: 1
  warning: 1
```

本轮无需继续合同修订；原先首轮两项问题已由可执行计划语义闭合。可在父编排器完成当前规划状态同步后，按用户既有授权顺序执行 06-06 → 06-03 → 06-04 → 06-05；原末尾强制真人证据审阅、Phase3 独立门槛及禁止重启/关机仍有效。

---

## 首轮历史：ISSUES FOUND（下列问题已于 Revision 1 解决）

**阶段：** Phase 6 — GameStream 协议重构与扩展。
**本轮：** 操作合同修订的独立首轮静态检查，2026-10-10。
**计划：** 06-06、06-03、06-04、06-05，共 4 份尚未执行计划。
**问题：** 1 BLOCKER、1 WARNING、0 INFO。

本检查只读取合同、计划和直接相关现有源码，运行只读 GSD 结构/估算查询；没有编译、运行产品、修改产品、更新 STATE/ROADMAP 或提交。本报告由已授权的计划修订检查流程产生。

### 已闭合的前置与覆盖

原 06-03-PRECONDITION 的缺口已经成为 06-06 的明确输出：公开新增 ControlOpen/Command 与五个 control_* 接口、完整内部 HostServices/Binding/Reservation、六维预算、持续 dispatcher、媒体 service-window/reset 钩子。当前 protocol.h 的 one-shot submit、protocol.cpp 的直接 exchange/grant 和 internal.h 的 reserved seams 均已读取；修订没有将这些旧类型当成现有完整操作合同。

| 属性 | 本轮证据 | 结论 |
|---|---|---|
| NET-01/02/03 | 四计划 frontmatter 全部声明；任务涵盖协商、身份/epoch、保护、双向/多流、量测及五端证据 | 已规划覆盖 |
| D-01–04 | 06-06-01、06-03-01、06-04-01：共同版本、完整差异、禁用原因、显式确认和修改重试 | 未削减 |
| D-05–08 | 06-03-02/03、06-04-02：有界重试/fresh auth/占用冲突/上行另确认/同窗口独立恢复 | 未削减 |
| D-09–12 | 06-03-01：两策略、首用保全部屏、桌面/游戏顺序、摄像头先让带宽；未指定视频默认仍要求选择 | 未削减 |
| D-13–16 | 06-06、06-03-02/03、06-04-02：保护拒绝、摘要与临时 trace、瞬态/持续状态及阈值实测 | 未削减 |
| 兼容与授权边界 | opt-in 协议3/schema1，旧 ABI1 原结构/符号、1/2 窄 wire、legacy local proposal/queryVersion1 独立回归；无新外部库 | 不重复原 ADR/来源批准 |
| 可信主机权威 | HostServices 仅 native pre-open attach，强引用、host-wide 事务、client 无 provider 注册入口；无 provider 拒绝 grant | 责任与隔离明确 |
| 资源预算 | host encoder、host uplink decoder、client downlink decoder、pixel rate、VRAM、bandwidth 分开；reserve/commit 核对其他 grants/pending | 不以降码率假解会话数 |
| 真实媒体确认屏障 | HELLO 零 grant/sink；真实产品 DLL client 对 test-only static host，经 proposal/CONFIRM/GRANT/ready 后启流 | 真实 peer 验收已规划 |
| 后续消费者 | 06-04 直接生成新 header 的 FFI，真实 Flutter/DLL/独立 host；06-05 每目标真实运行并保留 legacy 回归 | 没有本地 fake 替代 |
| 退出与事件 | 连续 control_ack、256 events、32 未 ACK 命令、唯一 terminal、2 秒 stop timeout 保活 | 本地所有权已规划；远端取消见 BLOCKER |

依赖为已完成 06-02 → 06-06(wave3) → 06-03(wave4) → 06-04(wave5) → 06-05(wave6)，无环，同 wave 没有计划对，因此无未声明的同波共享资源竞争。编号 06-06 是插入前置而非 06-05 后置。跨计划依赖的 wire/query 保留原始协议3/schema1状态，不存在一个计划清洗另一个计划所需原始输入的冲突。

四份 verify.plan-structure 均 valid=true，errors/warnings=[]，各 task 均有 files/action/verify/done。任务数与独有文件数为 2/7、3/9、2/6、3/9，每个实现任务最多 5 个路径。estimate-check --calibrated 分别为 27000、42000、22000、43000 / 100000，均未超预算；confidence=low、sample_count=0、factor=1，只是未校准估算。长量测明确独立于短 suite，不当成快速反馈。

架构责任图匹配：协商/时钟/传输/恢复在 shared native，权限/lease/资源在可信主机接口，Dart 只消费低频状态，持久实例/显示器仍由原 owner 负责。配对、生产仲裁、真实编解码/设备没有被加入本阶段。原适用能力、Win10/Win11 原六设置、R1、Apple 仅物理 TODO、Phase3 独立安装停点及禁重启/关机均保留。

### BLOCKER：远端提交与本地取消必须产生同一个权威终态

**计划：** 06-06；**任务：** 2；**维度：** key_links_planned / cross_plan_data_contracts。

**必须满足的属性：** 已发送到真实 peer 的 CONFIRM/CONFIRM_UPSTREAM，其取消结果、grant 激活/撤销和唯一 terminal 必须由同一主机权威事务判定；客户端在尚未得知主机结果时不能声称已取消，也不能将本地 token 检查当成远端 commit 的判定。

**证据：** CONTROL-CONTRACT.md:63 把 cancel_operation 定义为设置匹配操作的 cancellation token 并唤醒自有 socket/timer，同时承诺“Cancellation before commit wins”以及“once commit linearizes, return AP_ALREADY_COMPLETE and retain its completion”。06-06-PLAN.md:98 对此只要求本地 out-of-band token/wake 与 provider commit 线性化，没有定义 peer 取消操作的关联消息、回执及丢失结果处置。合同 opcode 表只有按 request_id 取消 pending reservation 的 CANCEL_REQUEST；未规定它如何与正在等待结果的 CONFIRM operation_id、唯一 terminal 或 READY 激活状态关联。

具体验收缺口是：host 已 commit、GRANT 尚未被 client 读取时，client 调用 cancel_operation。client 的本地状态无法区分“主机尚未提交”和“主机已提交但回包延迟”；仅检查本地 token 不能满足合同规定的 AP_ALREADY_COMPLETE。若关闭共享 TLS socket 作为取消，则会停止同连接已有健康流，违反本合同及 D-02/D-08；若不关闭，则需由 peer 权威终态决定该新 grant 的处置。CONTROL-CONTRACT.md:53 已要求发布失败时仅撤销未激活 grant，但尚未定义取消/READY/回包丢失与该撤销路径的共同判定。当前“commit-cancel 竞态”测试描述没有要求延迟真实 GRANT 或在两 PID 中观察同一终态。

**一种最小修订示例（非强制路线）：** 明确客户端取消调用首先只是接受取消意图；给现有 CANCEL_REQUEST 增加目标 operation_id 及对 CONFIRM 的关联语义，或增加独立 cancellation record。host 在同一事务域按收到并线性化的取消与 commit/activation 顺序返回 cancel-won / already-committed 结果，client 用该权威回执发布唯一 terminal。定义 GRANT/READY 的事务绑定、未激活失败回收与断线未知结果的有界终态；不得因取消一个新请求关闭已有健康流。加入真实两 PID 用例：取消先被主机接受、主机已提交但 GRANT 延迟、READY 延迟/丢失、响应 deadline、重复取消/回包重放；独立检查双方 terminal、六维 accounting、零重复启动及原健康流同窗口推进。绑定行为需进入 06-06 action/verify，再由 06-04 真实 FFI 负例消费。

### WARNING：新增项目合同应使用简体中文说明

**计划：** 06-06 及其合同上下文；**维度：** agents_md_compliance。

**应满足的属性：** 本轮新增或实质更新的项目设计说明采用简体中文，保留机器字段、枚举、代码、命令及原始外部证据。

**证据：** CONTROL-CONTRACT.md 是本轮新操作合同，Compatibility、Authenticated control framing、Provider lifetime、Query/cancellation 等解释全文为英文。它不是外部来源引用、固定历史审阅快照或原始日志，不属于新 AGENTS.md“项目语言规则”的例外。该问题不影响 wire 计算，但会使审阅/后续执行合同违反项目文档约束。

**一种修订示例（非强制路线）：** 仅将合同说明、标题和表格语义翻译为简体中文，保留 API、字段、状态码、数值、wire offset 和版本精确不变；涉及核心取消修订的段落同时补齐。

### 首轮历史结构化问题（已解决，不作为当前问题输入）

```yaml
historical_issues:
  - plan: "06-06"
    task: 2
    dimension: "key_links_planned"
    severity: "blocker"
    required_property: "已到达真实peer的confirm/cancel、grant激活/撤销及唯一terminal共享同一主机权威事务判定，client未知结果不伪报取消成功。"
    description: "CONTROL-CONTRACT.md:63及06-06-PLAN.md:98仅定义本地token/wake，却承诺host commit前取消胜/commit后AP_ALREADY_COMPLETE；opcode3未定义与in-flight CONFIRM operation_id/terminal/READY的关联。host commit后GRANT延迟时，本地client无法作出所承诺判定；当前竞态验收未要求真实双PID延迟GRANT及双方一致终态。"
    fix_hint: "例如定义按目标operation_id关联的peer取消/权威回执和activation事务语义，client调用只接受意图、等待权威唯一terminal；真实双PID测试commit前/后及GRANT/READY延迟丢失且旧健康流继续。"
  - plan: "06-06"
    dimension: "agents_md_compliance"
    severity: "warning"
    required_property: "本轮新增或实质更新的项目设计说明默认简体中文，机器字段和固定证据原样。"
    description: "新建CONTROL-CONTRACT.md的兼容、framing、provider、cancel/stop语义说明全文英文，不属于外部引用/许可证/原始日志/历史固定快照例外。"
    fix_hint: "例如将说明翻译成简体中文并保持API/字段/状态码/数值/offset精确不变。"
```

### 协调中的文档同步与检查边界

STATE/ROADMAP/VALIDATION 的计划数、wave 和新增 06-06 任务映射由父编排器在本轮检查后同步；当前旧值标记为 **pending-sync**，不另铸造核心合同 blocker。既有 06-PLAN-CHECK.md 是先前历史检查，不能用其旧“全部通过”替代本轮结果。父编排器同步完成后再确认当前版本来源表和 Nyquist 任务表。

本输入没有 failing_direction_probe / verify_command_path_probe，两个确定性维度按参考规则保持静默，不重跑、不臆造结果。一般 task 验证存在性、创建先于消费和失败信号语义已静态阅读；这些不能称为命令路径引擎通过或实际测试成功。研究历史候选/环境缺口由后续真实验证任务承接，本轮 appendix 明确新的操作合同方向；不要求在规划期伪造五目标实际结果。

本轮返回生产者修订上述 1 BLOCKER、1 WARNING；最多 3 次检查修订循环，问题数不减少时提前升级，达到上限仍未闭合则呈现具体剩余属性与证据。复检只追踪修订及受影响边界，不重开已解决的原 ADR/固定库批准。报告不授权系统操作，不启动执行。
