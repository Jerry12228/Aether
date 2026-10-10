# Phase 6 增量控制合同

2026-10-10 规划修订。用户已选择具体前置缺口修复。本合同规定先执行06-06、再执行06-03的要求，尚不代表实现或实测支持。原ADR/复用批准、ABI1结构及版本1/2 tracer字节保留；新增控制模式显式选择协议版本**3**、命令schema**1**。沿用已批准TLS1.3、SRTP及synthetic FEC profile，不变更依赖、设备、信任、网络配置或Phase3授权。

## 兼容与入口

保留现有public结构size/offset、函数签名、one-shot submit拒绝第二次调用、旧local propose/confirm/cancel行为及queryVersion1。仅追加声明。handle首次操作前只能选择legacy submit或control_open；混用返回AP_BUSY且不改状态。旧permission_read仅保留旧测试含义，不能授权control-mode grant。

新增AetherProtocolControlOpen，字段顺序：u32 abi_version=1、struct_size、command_version=1、reserved=0；u32 hello_bytes、reserved2=0；借用const uint8_t* hello。client传已验证HELLO，含版本3/TLV8（u16 schema=1）；host传hello_bytes0/null hello。HELLO沿用AETH封装、512字节/8版本/32TLV上限；仅新路径识别TLV8。双方均声明3/schema1才选择3；无交集返回AP_VERSION和upgrade side，仅提供1/2的peer不能静默进入未确认grant。旧negotiator结果和版本1/2黄金向量保持。

新增aether_protocol_control_open(handle,const AetherProtocolControlOpen*)、aether_protocol_control_send(handle,const AetherProtocolCommand*)、aether_protocol_control_cancel_operation(handle,operation_id)、aether_protocol_control_query(handle,char*,capacity,required*)、aether_protocol_control_ack(handle,sequence)。现有stop/destroy同样管理control handle。新AetherProtocolCommand字段顺序：u32 abi_version=1、struct_size、command_version=1、opcode、flags=0、deadline_ms；u64 operation_id、request_id、stream_id、expected_generation；u32 payload_bytes、reserved=0；借用const uint8_t* payload。新结构使用native C对齐供FFI消费，不作为wire内存映像；每目标验证旧ABI1布局和新增offsetof/sizeof。

open/send返回前拷贝有界caller输入。AP_OK只代表接受，不代表commit。open使用operation0完成事件。send要求deadline_ms1..3000、每handle严格递增非零operation_id；最多32个未ACK命令、每命令8192字节payload、聚合队列256KiB。越界在接受前返回AP_BUSY/AP_LENGTH。每accepted命令恰有一个terminal event，含operation_id/AP status；远端副作用结果另带resultKnown及authorityTerminal，未知结果不能伪报取消成功。未知opcode/flags/reserved/enum、重复字段、错误schema、溢出或尾随字节在分配/grant前拒绝；复用AP状态和结构化reason/scope，无绕过验证opcode。open handshake沿config deadline；idle控制每service-window最多20ms轮询自有socket/timer，partial frame/accepted command另有deadline，idle不把旧单次exchange超时施加于60秒量测连接。

## 认证后的控制帧与payload

fresh双向TLS身份验证及HELLO/schema协商成功后才交换控制记录，无0-RTT副作用。TLS应用帧：big-endian u32 record_bytes（120..8312）、120字节header、最多8192字节payload。header offset：0 magic ACTL[4]；4 u16 schema1；6 u16 opcode；8 u32 flags（0=request、1=response、2=status，其他值拒绝）；12 u32 payload_bytes；16 u64 operation_id；24 u64 request_id；32 u64单调message_sequence；40起十个u64依次为host、instance、display、stream、connection、client、lease_epoch、config_generation、key_generation、selected_protocol_version。完整TLS认证后核对身份/current generation/sequence再dispatch；stream_id0代表connection scope。分配payload前执行读取deadline与聚合解析预算；旧connection/epoch不能进入recovery/input/settings/clipboard。

payload显式序列化big-endian标量和有界length-prefix字节串，不序列化native struct或递归值。前缀u16 payload_schema=1、u16 field_count<=32；字段为u16 type、u16 byte_length、value。重复/零type拒绝；未知type高位为1拒绝，其余未知optional字段在相同界限内跳过。必需字段恰出现一次；省略policy/preference不能静默成为已确认选择。空payload指保留schema前缀且field_count0。

| Opcode | 必需字段与操作语义 |
|---|---|
| 1 REQUEST | field1 u32 policy（0首用/all-screens、1 main-screen、2 all-screens）；field2 u32 video preference（0需选择、1 desktop、2 game）；field3 u32 proposal ttl_ms1..60000；field4 stream-spec list；field5 capability list。生成完整proposal，不启新媒体。 |
| 2 CONFIRM | field6 digest[32]、field7 u64 host_revision、field8 u64 expiry_token；request_id绑定完整proposal，主机原子复核后只commit一次。 |
| 3 CANCEL_REQUEST | field20 u64 target_operation_id；0仅取消request_id的pending reservation，其余关联正在进行的操作。按下面主机事务仲裁返回取消/已commit回执。 |
| 4 RETRY_SETTINGS | REQUEST同字段及新request_id，仅替换caller pending request，保留committed和其他client grant。 |
| 5 RETRY_CONNECTION | 空payload；有界fresh-auth恢复原instance，使用新connection/key/lease epoch；占用返回冲突，不抢占。 |
| 6 CANCEL_RETRY | 空payload；中断recovery timer/socket wait，转manual/cancelled，保留persistent instance/display。 |
| 7 RECOVER_STREAM | 非零stream_id、expected_generation=current、field9 u32 requested_retry_window_ms；只作用该流，降规格必须新完整proposal/CONFIRM。 |
| 8 PROPOSE_UPSTREAM | field10 u32 selected_mask（mic1/camera2），0继续关闭；control恢复后一次生成上行集合proposal，列permission/device availability/reason。 |
| 9 CONFIRM_UPSTREAM | CONFIRM同绑定字段；任一source启动前同时复查permission/device/budget。 |
| 10 TRACE_START | field11 u32 duration_ms1..60000，仅显式用户操作开启。 |
| 11 TRACE_STOP | 空payload；立即关闭trace，保留summary。 |
| 12 TRACE_EXTEND | field11 duration_ms1..60000，从单调now更新expiry，不跨重连。 |
| 13 POLICY_MESSAGE | field16 u32 message_kind（input1/settings2/clipboard3）、field17 synthetic envelope<=1024字节；进入synthetic boundary sink前核对current controller permission/connection/epoch/generation，旧消息拒绝，不实现系统input/settings/clipboard。 |
| 14 TRANSACTION_STATUS | 内部transport status记录，field20 target_operation_id及已知时field18 transaction_sequence；查询同一主机事务结果，无新grant副作用，供有界drain/READY回执重查。 |

stream-spec list：u16 count1..8，后接固定record u64 stream/display及u32 media_kind/direction/width/height/fps_numerator/fps_denominator/bitrate_bps/codec/colour/role。ID/fps denominator非零，所有乘积先checked u64再比较provider limit。capability list：u16 count<=32，后接u16 ASCII name长度1..31、name、u64 requested。client不携权威available值；host返回supported/unsupported/unverified及reason/requested/effective和各流最终规格。capability name/extension保留全部原parity case，未知硬件不声称支持；codec/colour/role数值固定于实现向量并对应extension map。

response/status payload：field12 u32 AP status、field13 u32 reason、field14 u32 scope（connection1/stream2/proposal3）、optional field15完整UTF-8 proposal JSON<=6144字节。事务回执追加field18 u64 transaction_sequence、field19 u32 phase（pending1/cancelled2/committed3/active4/retired5）、field20 u64 target_operation_id；GRANT还携field21 u32 activation_ttl_ms1..3000。proposal JSON只展示，digest绑定canonical request/effective specs/identity/epoch/host revision/expiry/resource vector；展示字段顺序不改变绑定。完整proposal过大则AP_LENGTH且不部分执行、不截断差异；encoder集成前有独立golden framing/长度/截断/版本/sequence测试。

## 权威资源事务与provider生命周期

内部ResourceVector为六个checked u64维度：host_encoder_sessions、host_uplink_decoder_sessions、client_downlink_decoder_sessions、pixel_rate_per_second、vram_bytes、bandwidth_bits_per_second。视频/camera像素率逐路累计ceiling(width*height*fps_num/fps_den)；audio/control基础成本由provider显式预留。编码/解码并发是独立计数，不能靠降码率解决；所有维度原子核对，不部分可见更新。

以可信C++ HostServices及明确Binding/Snapshot/Reservation替换reserved AuthorityAdapter seam。attach_host_services(handle,shared_ptr<HostServices>)仅native coordinator内部调用，要求matching host_id且在control_open前；不导出C ABI，无JSON/Dart/env注册入口，也不能由远端消息触达。缺provider在新grant前返回AP_PERMISSION。client不能安装provider或断言权威revision/capacity/lease/permission/device state。

HostServices对同host多个handle拥有同一mutex/transaction domain：snapshot（revision、capacity、committed/pending totals、owner/lease/authority）、reserve(binding,demand,ttl)、commit(reservation,digest/binding)、cancel、release_connection、fresh_auth_result和permission/device检查。在reserve及commit同时对照其他owner committed grant和pending reservation，只排除自身本次计数；revision/generation/authority/permission/device变化返回AP_STALE、取消本次pending事务并生成完整替代proposal。Reservation含owner身份、六维demand、expiry、digest；commit在同provider锁内只转换一次。取消只释放尚未commit的自有reservation；commit后的grant不能由取消撤销。expiry/activation失败/disconnect的自有预算清理另有权威状态，不混同取消成功。observer只读且逐流独立预算，撤controller不误停其他授权observer，不存在StopInstance/delete-display操作。

每目标操作用(connection_id,operation_id,request_id,digest)唯一标识。host在同一事务域生成严格递增transaction_sequence，记录commit/cancel/activation/retire顺序；重复CONFIRM/cancel/READY回同一结果，不重复加预算或启动。权威操作终态写一次，activation phase后续可转移，但不能把committed终态改为cancelled。至少保留32个未ACK操作及其回执，ACK后才回收结果；有界expiry/断连清理关联owned consumption，保留持久instance/display及其他handle。

handle强持有provider直至worker/media shutdown和release_connection完成；registry移除不销毁其他handle使用中的provider。锁序：worker命令串行化→provider事务→短状态发布；callback前释放provider/state锁，provider调用不持registry/event/callback锁，持provider锁不回调dispatcher。产品只定义接口和默认拒绝；capacity/authority/device/clock fixture仅位于tests/native/protocol_control.cpp及单独static contract target，不进入production library。host合同程序链接fixture，client链接实际production library；证明synthetic权威边界，不声称Phase7配对或Phase20生产仲裁完成。

## 确认屏障、取消仲裁与媒体恢复

认证HELLO只打开控制，显式CONFIRM前grants/media/sink为零。host在事务域commit后发GRANT，绑定target_operation_id、request/digest、identity/epoch、transaction_sequence和activation_ttl_ms。client验证GRANT后配置SRTP、发READY；host在同事务域核对绑定和未过期grant，至多激活一次并发READY_ACK。client验证READY_ACK后才标active/开放sink。READY/READY_ACK/TRANSACTION_STATUS为opcode14、flags2的内部状态记录，以field19声明phase：READY使用committed3、READY_ACK使用active4；同binding重复是幂等，不是第二次commit。既有媒体字节/profile保持，版本3 exporter使用selected3/current identity/generation，避免跨版本密钥。

aether_protocol_control_cancel_operation返回AP_OK仅表示本地接受取消意图，**不表示主机取消成功，也不声称可同步判断远端commit前后**。operation0可取消尚无远端副作用的open；未发送操作可在本地完成AP_CANCELLED/resultKnown=true。已发送CONFIRM/CONFIRM_UPSTREAM必须在同handle保持TLS/drain原操作结果，不能关闭共享socket、停止健康媒体或先发布AP_CANCELLED。本地token唤醒worker后优先发opcode3/flags2 cancellation record，header operation_id及field20均关联原target_operation_id，request/digest/identity/generation绑定原事务。此内部记录不占新用户operation_id，也不重复分配grant；message_sequence仍严格递增。主机允许该关联记录绕过“新命令ID严格递增”规则，但不绕过认证/binding/replay检查；直接用户CANCEL_REQUEST使用flags0及新operation_id。

主机收到取消后与commit/READY在同provider事务域仲裁：取消先线性化且未commit，记录cancelled/AP_CANCELLED、释放本次pending reservation，原CONFIRM及取消回执均指向同transaction_sequence/唯一权威终态；若commit已成立，回already-committed/AP_ALREADY_COMPLETE及原committed/AP_OK结果，取消不能撤销grant。client按主机回执发布原操作唯一terminal；取消回执只更新cancelOutcome，不再发第二个原操作terminal。即使GRANT晚于取消回执或乱序重放，也按主机事务binding合并，不采用本地时钟猜测。committed时继续原READY收敛，query明确取消未生效；用户显式stop是独立动作，不自动代做。

GRANT/READY/READY_ACK延迟或逻辑丢失时，在原command deadline内最多重发3次内部TRANSACTION_STATUS/同binding READY，transport序列更新，provider副作用不重复。host activation期限从commit单调时刻起，最长3000ms；期限内READY成功即active。到期或publication失败只能将本次未激活grant标retired并释放其owned六维消费，这是activation失败清理，**不能写成取消撤销committed grant**，既有健康流继续。迟到READY对retired事务拒绝，不重新启流；READY_ACK丢失时status查询可返回active，不能重复激活。

deadline内无法取得权威结果，原操作仅发一次本地terminal AP_TIMEOUT（断连时按原因）、resultKnown=false、authorityTerminal=null和cancelOutcome=unknown；不声称AP_CANCELLED或取消成功。迟到可信回执只能更新query权威结果/state-change，不发第二次原操作terminal。host原权威terminal保留，查询能对照同transaction_sequence；没有回执的unknown保持unknown，重连必须fresh auth。断线/stop释放自有connection消费但不删除persistent instance/display、不挤占他人预算。不得以cancel一个新请求为由关闭全连接。

06-06证明一条exact supported视频确认路径及上述真实peer竞态；06-03启用持续synthetic两video/audio/mic/camera。新增/调整先独立pending proposal，原grant继续。native媒体以有界service-window推进，网络等待不长持command/state/provider锁。单流恢复仅清自身queue/crypto并换generation，同窗口健康video/control/audio计数继续。重连清旧transport/key/route/buffer并fresh auth；空闲原controller可获新lease，observer不升权。上行保持关闭，另行完整集合CONFIRM_UPSTREAM并复查permission/device/budget；不声称真实capture/codec/system input完成。

## 查询、事件与停止

control_query返回caller-owned、NUL终止UTF-8 JSON<=65536字节，queryVersion2/commandVersion1。required含NUL，null/capacity0探测；太小写有界NUL并AP_BUFFER_TOO_SMALL。仅发布短锁snapshot，不等待network。字段包含connection/stream状态、完整差异/规格、pending request/digest/revision/expiry remaining、六维budget、最后32个操作结果、resultKnown/authorityTerminal/transaction_sequence/activation phase/cancelOutcome、retry remaining/manual reason、upstream availability、trace remaining/bytes、stream counters和summary。日志仅allowlist state/reason/statistics、上限64KiB；trace每窗口64KiB、到期/触顶/断连关闭，任何模式不记key/credential/clipboard/audio/video内容。

沿用scalar callback，kind10 state-change、11 command-terminal、12 transient-stream、13 action-required、14 trace-change、15 stopped。handle event sequence单调；control_ack仅接受下一sequence或重复最后ACK，不可跳跃。最多256未ACK记录，接受命令前预留；只coalesce非terminal progress，不丢terminal/stopped，背压AP_BUSY。callback出锁，callback期间caller不能destroy。32命令上限包含已terminal但未ACK的命令，query保留每个未ACK结果，不ring eviction。取消意图与原操作权威结果分开，不能重复terminal。

cancel_operation不等待忙的operation锁，可唤醒自有timer/socket等待，但已发往peer的副作用操作继续有界drain和关联取消/回执，不以关TLS实现单请求取消。CANCEL_REQUEST、CANCEL_RETRY、cancel_operation和stop含义不同；不能静默停止健康流。

stop关闭admission、打断自有wait、停止媒体/join producer和callback publication、清connection queue/crypto/socket，仍使用2秒barrier返回final sequence。未发送命令可terminal cancelled；已发送但未知远端副作用按resultKnown=false/unknown完成本地stop，不伪报权威取消成功。ACK/drain至final sequence再destroy；AP_TIMEOUT保留handle/provider/listener引用供retry，成功stop/destroy之后无callback。host disconnect只释放自有connection消费，持久instance/display/foreign资源保留。旧stop/ack回归保留；仅操作自有loopback socket/child，禁止机器重启/关机或系统配置操作。

## 执行顺序与覆盖

完成06-02→06-06 wave3（合同/dispatcher）→06-03 wave4（完整预算/恢复/diagnostics/量测/parity）→06-04 wave5（真实typed FFI）→06-05 wave6（五目标/最终真人审阅）。06-06是新增序号的前置，不在05后执行。D-01–16和旧1/2独立回归完整保留。证据区分source build、synthetic authority/media、真实双进程socket、wall-clock量测及未执行真实设备/产品性能。真实双PID负例必须包含取消先于commit、commit已成立但GRANT延迟/丢失、READY/READY_ACK延迟/丢失、deadline unknown、重复取消/回执重放；分别观察双方权威结果/transaction_sequence、六维accounting、零重复启动和同窗口既有健康流持续推进。fixture仅调度故障/authority，判定/取消/READY/client parser仍来自product代码，禁止test-only客户端实现替代真实DLL。
