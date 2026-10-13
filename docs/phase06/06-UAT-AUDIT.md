# Phase 06 自行验收审计（2026-10-13）

用户原文“你自行验证，包括之后项”授权当前代理处理第3项及后续验收，不继续逐项询问。第1项精确包确认与第2项“通过”保留真实原文；第3–7项标记为代理依据证据的范围内判定，不伪造真人答复。

结果：10项中7项通过、3项因缺少定义阻断，未发现新增产品行为缺陷。UAT为partial，Phase6和NET不关闭。原六条无描述符禁止项及三条edge投影、原始计划、探针、TARGETS和人审快照保持原字节；本报告是独立后续记录。

## 本次实际执行

| 检查 | 结果 | 本次日志SHA256 |
|---|---|---|
| `node scripts/verify-protocol.cjs --scope all --evidence docs/phase06/TARGETS.json` | exit0，7670ms；在线核对原CI状态及artifact，12目标和本机FFI证据通过 | `47bb2b7fea5fbab6c407722433571746dcab66ad0285a59dcef33de7e187c495` |
| `node --test tests/protocol-evidence.test.cjs` | 85/85，324ms；fail/skip/cancel/TODO均0 | `d3e5a9bb7de1559609efbd45f819127691065697324fa636fade493c612b6b00` |
| 源码/编译命令/PE/日志收集 | 34项材料摘要、16任务自动入口、23已登记威胁、8具名行为观察、16个实际DLL导出 | [机器记录](06-UAT-AUDIT.json) |

实际源仍为`4edaf0352ca1b875e3536fe54970e8b85585c794`，42输入摘要`7ca1594252b56ee2fe36d99d13ad1b63e4f2ca69eead8784a29503d714ce2369`；证据文档的新提交不冒充重新编译的源码。没有重跑原生媒体、Flutter或CI，使用正式all验证已归档原始运行与当前源码绑定；新执行的是上述独立证据检查。

首次沙箱内子进程启动被`spawn EPERM`阻止，两个命令未运行；失败日志保留于`build/phase06/uat-20261013/*-spawn-denied.log`和`checks-spawn-denied.json`。正常沙箱提权后实际执行通过，不计行为RED。收集脚本首次使用CommonJS保留标识导致语法失败，修正后执行；这属于审计工具错误，不是产品缺陷。

## 逐项判定

| UAT | 判定 | 直接依据 | 适用边界 |
|---|---|---|---|
| 1 | pass，原真人决定 | FINAL-HUMAN-REVIEW真实“确认”及固定包 | 原100项材料及当时范围 |
| 2 | pass，原真人答复 | 两连接stop后另一连接继续收流；fresh-auth持久身份保持 | 协议原型；真实应用/显示组后续验证 |
| 3 | pass，delegated-evidence | 实际产品compile命令无AETHER_CONTROL_FIXTURE；DLL16导出无fixture/inject/test authority，未嵌PEM；TLS强制peer cert；不可信客户端无流，observer上行/控制AP_PERMISSION，占用租约不抢占具名通过 | 当前协议产品client/独立synthetic authority；生产配对/主机全局仲裁后续验证 |
| 4 | pass，delegated-evidence | 正式all核对physical=false、synthetic运行/目标构建分栏；EVIDENCE/LIMITS明确设备、HDR、真实网络和SLO未测；三轮量测保留原f853627绑定 | 审计已列材料和现有范围声明；不是外部宣传的全量证明 |
| 5 | pass，delegated-evidence | 全方案confirm前grants/sink=0；不可用capability仍返回reason；缺偏好返回待选；六维共享预算不挤占owner；取消/expiry/retry保留运行grant | 原生协商/FFI合同；未提供完整产品设置界面的可用性结论 |
| 6 | pass，delegated-evidence | 本次执行命令只有read-only CI/Git/产物查询和unit tests；native无设备安装/重启API；原CURRENT-LOCAL/ROOT-REGRESSION明确systemMutation=false；Phase3独立入口保持halted | 本次操作及已记录的Phase6边界；不是开发机全部历史操作的取证保证 |
| 7 | pass，delegated-evidence | 实际iOS device ARM64仅build；ARM64/x64 simulator各42 XCTest；macOS双架构各17；三Android各115；桌面全矩阵通过；85项known-bad校验拒绝零测试、skip、错source/SDK/hash等 | Apple实机TODO仍独立，未豁免构建/可运行检查 |
| 8 | blocked，insufficient_spec | 原NET-01 probe只有`unclassified — review manually`和null字段 | 缺触发条件/预期/可观测判据，不能反推原假设 |
| 9 | blocked，insufficient_spec | 原NET-02同上 | 同上 |
| 10 | blocked，insufficient_spec | 原NET-03同上 | 同上 |

第3–7项是证据支持的scoped verdict。其中涉及价值、透明性和操作范围的判断由代理作出，属于NON-AUTHORITATIVE LLM-judge，保留`unverified-prohibition — human review recommended`标记；没有将该判定改写为逐项真人审阅或原flagged投影的resolved。第2项已经获得真实人工答复。

## 三条定义不足的定位

`06-EDGE-PROBE.json`自`be1d809`创建时即为三个占位项，当前verification/resolution/reason均null。研究、计划检查及执行材料虽提供实质边界测试，但均明确这些测试不替代原探针分类。因此三项不能凭要求ID或现有成功测试自动通过，也没有依据创造原本未描述的失败场景。

恢复条件是为每项补入来源支持的具体触发条件、预期边界、可观测判据和对应证据。若历史项没有实际假设，可按规划修订流程明确将其认定为无描述符占位并退出验收清单；该修订需保持历史原件并更新正式validator合同，不能直接改原JSON或伪造通过。本次不将空定义当作产品代码缺陷，不创建没有行为目标的修复测试。

## 收尾与限制

`gsd-validate-phase`复核16任务均有自动入口；现有行为用例及目标证据已通过，无可从具体规格生成的缺失行为测试。三项缺定义另列，Nyquist仍partial/false；Wave0实际入口完整。

`gsd-secure-phase`对计划登记的23项威胁做ASVS L1实现/证据复核，当前synthetic范围closed23/open0；不新增风险接受或生产安全认证。`gsd-ui-review`本阶段无新增可视UI，FFI库是纯Dart API，六柱N/A，不编造24分通过。

Phase3的phase/plan/status、Apollo安装关口、开发机禁重启/关机和其他平台实机义务保持。已有用户修改`references/upstream-lock.json`不属于此次验收提交。
