# Phase06 — API、假设与多来源覆盖审计

本文件前半部分为原规划记录；当时pending状态仅代表历史。当前实际执行审计见文末、EVIDENCE/TARGETS及06-VERIFICATION.md；最终真人与6+3flagged仍pending。API detector已对非空06-CONTEXT运行：detected=true，唯一signal为中文“不能当作网络/实例 API”的内部C ABI描述。没有远程第三方服务API集成；鉴于候选本地native库有实际外部调用面，仍明确记录其计划覆盖，不以false-positive作为忽略依赖审计理由。计划仅落实06-01具体ADR批准方案，未批准候选不自动选定。

| capability | decision | reason |
|---|---|---|
| 批准标准库的可靠安全handshake/身份/trust/关闭 | INTEGRATE | 06-01真实TLS候选tracer；批准后06-02多流、06-05全目标验证 |
| key exporter/canonical context/方向stream角色key epoch/rekey | INTEGRATE | 06-01ADR；06-02标准调用/KAT/nonce exhaustion/replay负例 |
| 标准SRTP或批准datagram封装的RTP保护/ROC/replay | INTEGRATE | 06-02实际多流/双向/FEC认证边界 |
| 固定批准FEC源/repair编解码 | INTEGRATE | 官方source/hash/license/内部依赖审计后，阈值内外与跨域篡改验证 |
| DTLS/ENet未选备选的并行生产集成 | OPT-OUT | CONTEXT只要求一个证据支持的具体方案；保留比较与备选，未批准路线不并行生产集成 |
| OpenSSL非协议需求的CA运营/签发服务/密码工具/第三方provider | OPT-OUT | 本阶段为协议原型，完整配对/身份持久化属Phase7；不运营外部服务、不改系统信任 |
| native库QUIC/WebRTC整体传输替代 | OPT-OUT | 已锁GameStream基础，仅证据支持的局部替换可审 |
| 真实capture/codec/系统设备/生产仲裁/自动码率API | OPT-OUT | ROADMAP后续phase职责；此处保留contract/owner，仅synthetic和test-only authority |

## Assumption / Schema Gates

`query assumption-delta scan 6`：detected=false/signals=[]，英文探测未触发；不能解释为没有中文需求假设。主要模型按确认源拆ConnectionContext/StreamContext/ResourceVector/Proposal及稳定InstanceIdentity，方向/key/config/lease epoch分开，没有重复调用全局单流API。无数据库/数据库schema或迁移任务；JSON wire/vector/证据合同由独立解析/版本/golden测试覆盖，不假装数据库schema gate完成。

三条unclassified NET-01/02/03必须继续flagged unresolved，源06-EDGE-PROBE.json不改；手工实质edge覆盖见VALIDATION。六条值/安全/透明度禁止项descriptorless/unresolved，verification/resolution/reason=null，执行验证必须显示flagged-unverified，不自动dismiss或伪造check_*。

## Multi-Source Coverage Audit

| SOURCE | ID | Feature/Requirement | Plan/Task | Status | Notes |
|---|---|---|---|---|---|
| GOAL | Phase6 | GameStream基础双向、多流、安全、版本化 | 01-01→02-01/02/03→03-01/02/03→04-01/02→05-01/02 | COVERED | 单一协议原型验收链 |
| GOAL | SC1 | 固定基线/字段映射/独立上下文/向量 | 01-01/02 | COVERED | 原源SHA/许可和复用仍gate |
| GOAL | SC2 | 双向≥2video、FEC/key/queue、五目标run | 02-01/02/03，05-01/02 | COVERED | Apple仅物理TODO |
| REQ | NET-01 | 版本能力/ID/epoch/错误 | 01-01/02，03-01/02，04-01/02 | COVERED | 五份frontmatter均列NET-01 |
| REQ | NET-02 | 映射/ADR/多流/丢包/五目标证据 | 01-02/03，02-01/02/03，05-01/02/03 | COVERED | 缺target不能人审豁免 |
| REQ | NET-03 | 标准保护的可靠控制与实时媒体/拒绝 | 01-01，02-01/02/03，03-01/02，05-01/02 | COVERED | 成熟crypto/high阻断 |
| CONTEXT | D-01 | 共同版本即可，无交集升级端 | 01-01/02，03-01 | COVERED | wire规则先审 |
| CONTEXT | D-02 | 不能满足时方案确认且保留已有流 | 01-02，03-01 | COVERED | confirm前零grant |
| CONTEXT | D-03 | 不可用保留禁用理由 | 01-02，03-01，04-01 | COVERED | 包括原加密设置安全处置 |
| CONTEXT | D-04 | 全方案一次确认/返回修改 | 01-02，03-01，04-01 | COVERED | request/digest/revision/epoch/expiry |
| CONTEXT | D-05 | 有界自动重试/取消/手动原因 | 03-02/03，04-02 | COVERED | 阈值实测 |
| CONTEXT | D-06 | fresh auth/空闲恢复/冲突/新epoch | 03-02 | COVERED | observer不升权 |
| CONTEXT | D-07 | 上行集合另confirm/权限设备复查/清空 | 03-02，04-02 | COVERED | synthetic，非真实设备 |
| CONTEXT | D-08 | 单流故障独立恢复 | 02-01/02/03，03-02 | COVERED | 同窗口其他流健康计数 |
| CONTEXT | D-09 | 两种多屏策略 | 03-01 | COVERED | 调整仍confirm |
| CONTEXT | D-10 | 初次默认保所有屏 | 03-01 | COVERED | 可切主屏 |
| CONTEXT | D-11 | 桌面resolution/游戏fps | 03-01 | COVERED | 视频初始偏好未选 |
| CONTEXT | D-12 | 操作优先/camera降规格/不足拒绝 | 03-01 | COVERED | control/audio保留预算 |
| CONTEXT | D-13 | 保护失败拒绝/无绕过/身份变化 | 01-01/02，02-01/02/03，03-01/02 | COVERED | pairingPhase7 |
| CONTEXT | D-14 | 摘要/异常与秘密内容排除 | 03-02，04-02，05-02 | COVERED | 所有模式sentinel |
| CONTEXT | D-15 | 临时trace倒计时/关闭/续时 | 03-02/03，04-02 | COVERED | 不跨重连 |
| CONTEXT | D-16 | 瞬态收起/持续才action-needed | 03-02/03，04-02 | COVERED | 阈值量测 |
| RESEARCH | baseline/ENet/global | 固定逐字段/指定forkABI/拆全局 | 01-01/02，02-01/02 | COVERED | references只读研究 |
| RESEARCH | security/FEC | key域/认证后queue/修复/重放/nonce | 01-02/03，02-02/03 | COVERED | KAT与独立golden |
| RESEARCH | parser/bounds | framing/MTU/time/parse/queue/deadline | 01-01/02，02-01/02/03 | COVERED | 边界±1与wrap |
| RESEARCH | native/FFI | C++20/C ABI/所有权/标量 | 01-01，04-01/02 | COVERED | no frame/PCM crossing |
| RESEARCH | budget/authority | 向量/reservation/epoch/observer | 03-01/02 | COVERED | test-only不作生产仲裁 |
| RESEARCH | five-target | standalone CMake/NDK/XCTest/实际run | 05-01/02 | COVERED | SDK/arch/source/hash实证 |
| RESEARCH | parity/R1 | 完整适用原功能与六设置/Win10SDR | 01-02，03-03，05-02 | COVERED | 原能力contract/后续owner全保留 |
| RESEARCH | limits/evidence | 真实量测/失败/fast目标与实际耗时 | 03-03，05-02/03 | COVERED | 不冒称产品SLO |
| RESEARCH | native provenance | 固定source/hash/notices/配置及总账 | 01-01/02/03，04-02，05-01/02 | COVERED | 01准入先行，04只同步总文档 |
| RESEARCH | project constraints | Phase3halt/no-reboot/no-shutdown/no外来删除 | 所有task及prohibitions | COVERED | 不执行系统变更 |

Excluded按原已批准phase边界：生产配对/codec/真实设备/生产仲裁/动态码率为对应后续phase实现；不是删功能或新增TODO。无未计划源项。5计划/5waves严格顺序，共14任务、2具体真人关口（01-03和05-03）。这仍为同一原生协议原型子系统/验收链，是“通常1–3”的容量例外，不增加产品阶段、不减少源项。原02按安全媒体→状态事务→FFI顺序切片，原03目标证据移到05；parity文档在03更新，依赖总文档在04同步。路径数9/9/9/6/9，任务数3/3/3/2/3，各任务最多5文件，factor=1/sample_count=0/confidence=low如实保留。规划检查后才进入用户选择执行步骤。


## 2026-10-10 前置合同修订

历史五计划规划条目保留。当前6计划/6wave、16任务：已完成01/02，新增06-06（2任务）在03之前；03/04/05依赖同步。六份frontmatter共同声明NET01/02/03，必须全部完成且最终验证/人审通过才关闭。06-06新增typed schema、HostServices六维权威预算、真实产品client/test-only host、确认屏障与有界dispatcher；取消使用主机transaction_sequence权威终态，不将本地token当远端commit。D01–16归属仍完整，03/04/05真实socket/FFI/目标证据消费同合同。独立06-CONTROL-PLAN-CHECK Revision1通过，不代表代码/平台通过。原edge/prohibitions unresolved与Phase3门槛保持。

## 当前多来源实证覆盖审计

固定GameStream字段/通道来源、actual target/source/Git/official dependencies/compiler/artifacts和真实socket/PID/FFI日志已由正式all对照，不以SUMMARY或API存在替代行为。共同42输入实际12目标成功，原31/27/60/42具名case保留；12设置/637原能力及全部16D/23威胁对应独立观察case，NET三项仍等待Task3真人。06-01已批准方案、Botan复用批准及原FEC材料保持；未选DTLS/ENet/QUIC/WebRTC、生产authority/codec/设备不进入本原型。原六禁止/三edge descriptor不完整，继续flagged-unverified/null；新增负例不改变其分类。证据和范围见docs/phase06/EVIDENCE.md、TARGETS.json，原文和hash可复查。

## 2026-10-13 最终材料包真实批准

真实用户原文“确认”，记录时间2026-10-13T04:58:32.036Z；批准包SHA256为`48271d2aed1e62fa22af9d988681c5909e673a1a3fe87c15f8aace7445d48dbc`，100项材料摘要为`494fb0d931e585e0ea4fb83c911272890aa5cf70e72b316806fdd9e654304708`。写入批准前100原件及100独立快照长度/SHA256全部匹配。独立决定见[FINAL-HUMAN-REVIEW](../../../docs/phase06/FINAL-HUMAN-REVIEW.json)，决定SHA256 `ab6d9cdeeb766860e2d0619eb42072472dbf987883117f3cacfe6bb91e128861`。原包和原快照保持原字节；批准后的TARGETS/EVIDENCE及规划状态是新记录，不回写审阅快照。

06-05三个任务全部完成，Phase6计划6/6、全项目14/15计划；规范目标验证保持human_needed，Phase6与NET未关闭。六条无描述符禁止项和三条unclassified edge仍flagged-unverified，verification/resolution/reason仍null；没有将范围确认解释为逐项验证通过。已保存[06-UAT](06-UAT.md)，其中精确包审阅1项pass、九项flags pending，后续通过`$gsd-verify-work 6`逐项处理。Phase3/plan3/status halted保持，未启动Phase7。
