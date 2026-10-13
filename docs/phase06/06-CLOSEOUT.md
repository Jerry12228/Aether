# Phase 06 规范收尾

用户原文“自行推进完成6”授权自主完成本阶段；前一轮“你自行验证，包括之后项”继续有效。此次补证解决的是分类输入与完成记录，不改变产品协议/媒体实现，也不把自主判断伪造为真人逐项通过。

## 三条占位项的来源与处理

GSD `@opengsd/gsd-core 1.15.0`的edge-probe使用英文word-boundary `SHAPE_CUES`。对原NET-01/02/03中文文字调用官方`classifyShape`均返回空集合，随后`proposeEdges`产生`unclassified — review manually`。官方模型明确该项是soft、dismissible分类提示，并允许`dismissed`且非空reason；它没有定义额外产品失败假设。

前一轮按缺定义保留blocked是保守停点；本轮已进一步检查分类器产生机制，不再把分类器未命中误当一个永远不可验证的产品要求。原`.planning/phases/06-gamestream/06-EDGE-PROBE.json`、PLAN、TARGETS和真人审阅快照保持原字节。三条提示由官方`probe-core.analyzeCoverage`合法退役，并以作者显式shapes补建每个要求8类边界：boundary、adjacency、empty、encoding、ordering、precision、idempotency、concurrency。

24条边界的触发、预期、合同anchor、具名实际测试及rawSHA逐项列于[06-CLOSEOUT.json](06-CLOSEOUT.json)。官方`edge.analyzeCoverage`产生24条resolved/explicit、unresolved0；原三条是dismissed分类提示，不宣称旧空占位本身运行了测试。

NET-01接续版本/身份/编码/资源整数、完整方案与原子确认/重复/并发合同；NET-02接续实际artifact/CPU/SDK/计数/缺目标/幂等审计/完整CI证据；NET-03接续保护后的解析边界、跨流、权限拒绝、独立密码KAT、replay、nonce耗尽、不可变重传与租约冲突。全部来源于现有已批准协议合同和已运行用例，不新增未确认产品行为或视频默认。

## 禁止项与自主判断

六条原禁止项仍按原statement/owner逐项保留。持久实例边界、认证/观察者/租约及协商自主权三项有实际测试核验；证据透明性、开发机操作范围和Apple物理例外边界三项由当前代理依据材料进行judgment review。

后三项明确为`NON-AUTHORITATIVE LLM-judge`，保留`unverified-prohibition — human review recommended`三条advisory；自主关闭是`completed with 3 flagged judgment advisories`。这些不是已知代码缺陷、未执行必需目标或原型功能缺口，用户已授权自主处理本轮判断；不会以原文“确认”替代每项新真人决定，也不把warning隐藏为无限保证。原TARGETS的6+3历史投影仍不回写。

## 新旧门槛与实际执行

新`scripts/verify-phase06-closeout.cjs`独立读取合同和原日志bytes/hash，核对3原件、24唯一完整分类、具名正向case、禁止项owner、源绑定和advisory；不接受JSON自声明pass。负例覆盖缺分类/预期/合同/日志、假case、原件漂移、unsafe路径、重复resolution、伪造人工批准、掩盖judgment及Phase3关口丢失。

本次实际证据见[06-CLOSEOUT-CHECKS.json](06-CLOSEOUT-CHECKS.json)：

| 命令 | 结果 |
|---|---|
| 新关闭校验器 | exit0，24 explicit / 3 classifier dismissals / 3 objective / 3 judgment advisories |
| 新旧独立测试 | 108/108，fail/skip/cancel/TODO均0，418ms |
| 原正式`--scope all` | exit0，8125ms；在线原CI12目标、实际产物/原日志/固定源和FFI核对通过 |

没有修改原validator的未决flag保存合同，也没有改产品42输入；实际产品仍source`4edaf0352ca1b875e3536fe54970e8b85585c794`、input`7ca1594252b56ee2fe36d99d13ad1b63e4f2ca69eead8784a29503d714ce2369`。本次新增gate/测试输入单独录hash，不重标旧二进制或历史量测。

## 完成范围

本阶段只关闭已定义的GameStream重构协议原型：版本/字段/身份、安全双向synthetic媒体及至少两视频、FEC/独立恢复/完整协商/预算、真实Dart FFI和五平台目标证据。生产配对、Windows全局仲裁、真实codec/capture/麦克风摄像头/显示器设备、HDR、产品SLO/非loopback网络、最低OS实机及Apple物理验收仍按既定后续owner/TODO保留，不是Phase6已支持全产品的声明。

原SECURITY的23项登记缓解在synthetic范围closed/open0，UI无本阶段视觉交付为N/A；16任务入口、24显式edge和全部运行证据补齐后Nyquist/Wave0为true。通过UAT+VERIFICATION共同谓词之后才以GSD正式phase.complete关闭阶段/NET，保留Phase3独立安装恢复入口、Apollo条件及禁止执行/安排开发机重启关机。其他会话的Phase7准备文件不被改动。
