---
phase: 06-gamestream
plan: "05"
subsystem: protocol-targets
tags: [CMake, CI, Windows, POSIX, XCTest, provenance]
status: in_progress
checkpoint: 06-05-02
checkpoint_gate: final-matrix-and-review
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

# Phase 06 Plan 05：五目标实际执行与证据核验进行中

**用户已批准当前工作分支的公开发布与后续 Phase6 修复/证据，实际十二目标 CI 持续执行；06-05 三个任务均未完成。最初发布停点及所有旧失败是历史记录，当前状态见文末和 06-05-EXECUTION.json。**

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

## 当前取消竞争修复与有界完整恢复分组

96a49e4的自有API26 Android x64实际115/115，媒体27与恢复60零fail/skip；runner仅在退出清理阶段误判，原回执与日志保留在build/phase06/06-05/android-x64-96a49e4-all-checks-cleanup-failure。Android ARM32 CI原恢复60/59捕获具体取消竞争：AP_OK受理且操作尚未terminal，随后发布AP_TRUST。先封存a270d29的ANDROID-RED，再b6a9ead在同一结果锁内线性化取消与失败发布，不修改原20ms取消输入。旧源码通过不改绑最新输入。

b6 CI38138796842仍整体失败：Windows两架构、Linux两架构、Mac ARM64、iOS device及x64 sim成功；Android部分媒体缺帧、Mac x64 READY睡眠观察竞争、iOS ARM64一项失败。63b3b0e保存Mac实际失败；7618817将test-only宿主观察改为有界明确屏障，保留原150ms延迟及零sink/最终ACK断言；Mac使用同一原生故障中继并隐藏受保护seed字节；只在新建自有Android来宾暂停zygote/surfaceflinger，仍测试真实Bionic/NDK库、双PIDsocket及原25ms媒体期限，不能宣称框架/Flutter或物理支持。开发机配置和重启禁令保持。

当前本地input ce3f5b1bf341cdcd4e1701e49ed7cdf26232498666ca61924fbb4aff8df75ae5（构建时HEAD b6）Windows15/15、92.80秒；fast两组23.30秒。原恢复60项按注册索引分四组各15，完整LastTest.log并集60且互不重复，零fail/skip；每组小于60秒，不再把原90秒恢复写入30秒fast。JUnit stdout自身默认截断，逐项分母从完整原日志核验。见WINDOWS-GROUPED。最新同提交7618817的CI38140035480执行中，所有目标同输入通过前Task1仍in_progress、0/3任务；validator/known-bad RED和最终强制人审未开始。

## 2026-10-11 Android完整原套件与相同输入续跑

CI38149010300/a405的ARM32及x64各115/115、无skip/cancel并完成自有VM清理，ARM64的原生证书fixture失败；该轮input18ef2915，不能合并8b的成功冒称整轮通过。CI38149264704/8b的ARM64首次完整115/115（567153ms）并完成清理，ARM32恢复59/60、x64恢复58/60。对应x64真实host已生成正确容量拒绝proposal后以AP_TIMEOUT结束，client实际返回AP_LENGTH；另一项为adapter在ready尚未同步时公布ready2。独立RED271a14c保存原始恢复日志、具体PID/状态及其SHA256，源码原因推断与日志观察分栏。127f2a3采用已经验证的连接1–3秒响应I/O期限，在序列化之后开始计时；adb保持native端口发布顺序，未改变25ms媒体期限、原用例和断言。当前同输入CI38150341610执行中。

本地历史CRLF与Git/CI LF的输入哈希分别保留，不能以Git语义diff相同重新绑定旧测试。8b的Git LF/input58214d27已经重新构建，本地Release15/15、94425ms和真实Flutter22/22、17120.4255ms通过（21独立host）。127f2a3/input12518317重新构建和完整运行中；最终以同输入全部目标实际运行与独立validator为关口。执行历史汇集于06-05-EXECUTION.json，仍不是Task2总账。

当前任务0/3，Task1未完成；Task2独立validator/known-bad RED、Task3强制真实人审未开始。阶段5/6、NET及Nyquist/未分类flags不提前关闭。无开发机重启/关机、驱动/Apollo/信任或系统安全策略变更。

## 2026-10-11 当前五目标接近闭合但仍未通过

941ad44/input8c6298c0的CI38150920169最终十二作业中十一通过：三Android ABI各115/115、Win/Linux/Mac六桌面及iOS device/x64sim。macOS八轮fixture使用公开连接期限3秒（每轮25ms不变），ARM64 guest异步服务stop改为30秒内观察真正stopped后，均经实际目标运行通过。iOS ARM64五流的一项test中两上行流7/8，保持原始失败，不与x64sim或历史42pass互相替代。

本机941自有AVD已经真实创建和启动，但首个getprop boot probe挂起数分钟。严格核验runner74872/唯一子adb63896/自有emulator-5556后结束该probe，runner finally记录exit1/tests null、emu kill/AVD delete0并确认adb列表空。本轮没有native运行证据；导入产物附带的CI日志曾被进度解读为本机结果，现明确更正，不能记为本机115通过。

1deb371先封存iOS/local原始失败；0b6467d将本地boot probe限定5秒并在3分钟内重试，为iOS test-only中继及host thread设置显式user-initiated QoS并增加仅标量/摘要的逐流日志，原因推断与实际结果分开。CI38152495945/source0b6467d/input2a355218执行中；本地Windows15/15、93159ms及真实FFI22/22、16460.2249ms、21host通过。现有Helios Release2758ms和root Debug11/11、26.65s通过，未进行真实设备操作。

当前仍任务0/3、Task1未完成，Task2独立validator/known-bad RED及Task3真实最终人审尚未开始。Phase3独立修正安装关口、5/6阶段计划计数及NET未完成不变。

## 2026-10-12 当前实际 AVD 通过与 XCTest 产物绑定修复

0b6467d/input2a355218 的本机自建 API26 x64 AVD 实际通过115/115（175004ms，媒体27、恢复60、控制/旧版本/向量检查完整，fail/skip/cancel0），emu kill与AVD delete均退出0，后续独立adb devices为空。此回执已独立归档，不沿用导入的CI日志。该轮十二CI作业最终十一通过；iOS两模拟器各42/42，但Android x64 fec-beyond 在relay cleanup阶段失败，原始异常可能被清理异常覆盖。6aef328先封存真实失败与本机通过，15020c0仅增加原始异常/进程摘要/relay位置与observed errno诊断，原5秒child/3秒observation/25ms媒体期限及全部断言不变。

15020c0/input63035efe 的本机Windows15/15、93746ms，原始产物和日志已归档；该轮Android三个ABI实际CI通过。独立归档核验随后发现0b的iOS x64 libSRTP字节与测试前构建清单不符：真实xcodebuild test执行CompileC/Libtool后再运行42项测试。a292c98记录原始摘要漂移，不能以XCTest通过关闭来源/产物绑定。固定上游源码、Botan生成build_config.json及实际XCTest可执行文件也需补齐归档。

4300b35/input4a83a142 在build阶段先build-for-testing并绑定host/test实际可执行文件，run阶段使用test-without-building，所有源码/依赖/产物均在运行前后核验hash；补齐只读来源和生成配置归档，排除fixture PEM/key资源。当前实际CI38154393149执行中，本机同输入回归进行中。旧通过与失败保持各自source/inputDigest，不合并成最新矩阵通过。

当前Task1仍未完成，任务0/3；独立validator的known-bad行为RED及最终真实人审未开始。Phase6仍5/6、NET与未分类/禁止项旗标不提前关闭；开发机无重启/关机、驱动/Apollo/信任或系统策略变更。

## 2026-10-12 Task1 同输入十二目标闭合，Task2 正在执行

9a9e060/input `f7a9101f6b82670e413569ccac37d49b80d5230b375851fd2d48f78f159939f9` 的 CI38157877824 十二作业全部成功。完整产物已下载，独立核验40个精确Git输入、实际CPU/依赖/编译配置与所有命令原始日志；固定研究源码与Botan生成配置零归档缺口。Windows两架构各15、Linux/macOS各两架构17、Android三ABI各115、iOS device arm64实际构建和两模拟器各42 XCTest均完成；桌面/Android原31控制场景、27媒体、60恢复全部按原始日志核验，没有删改分母。iOS测试前后库与host/test可执行文件哈希一致，先build-for-testing、后test-without-building。本机同输入Windows15/15、94957ms和真实Flutter22/22、16798.7126ms及21独立host已独立归档。

8addc26的macOS x64实际D-08失败仍保留：健康video2/audio在100ms观察中6→6，control11→14，随后媒体恢复。44f97f2独立真实SRTP/UDP排队多帧先行为RED退出2；da0cc17修复实时窗口首帧阻塞及迟到repair重复交付，新帧仅在认证和完整域校验后替换旧block，保持25ms/64包/逐流queue上限。新增测试最初未建立五个StreamContext的访问异常不计RED；完整调用回归随后揭示两条JSON输出不兼容，fd5b93a/9a9e060恢复原单一严格JSON回执。旧失败与取消运行不计最终通过；原D-08观察、期限与断言未放宽。

Task1完成，当前任务1/3。Task2的独立拒绝检查先形成16项中14项真实行为失败，f0a5dd1保存RED；随后68项计数/JUnit/Node/XCTest/CPU/archive/来源/目标/覆盖缺失负例全部通过。正式target CLI已实际核验Windows15/15、94708ms及68独立检查。8579437将validator和负例测试绑定进42文件共同输入并接入实际CI38159407590；input `30fe2ea71b55fa9c53d499ad4ce9baae4e740595b445df5e079e2bc95d768979` 的本机Release/Debug实际构建2315/2657ms。新输入矩阵、TARGETS/EVIDENCE完整映射与all验证仍在执行，旧40文件成功不冒称新42文件已测。

Task3强制真实人审尚未开始。Phase6仍5/6、NET未完成；六条禁止项与三个未分类edge仍flagged-unverified，Phase3修正安装关口保持halted。未执行开发机重启/关机、驱动/Apollo/系统信任或安全策略变更。

### 2026-10-12 接续：当前42输入Android真实失败

CI38159407590/source8579437实际结束：9目标成功、三个Android失败。ARM32原fec-threshold的test-only UDP发送失败（errno1）；ARM64 policy-scopes当前scope也拒绝，父64/65、子20/24；x64原Win10 ping_timeout第二步24而期望0。原因未确认，详见docs/phase06/06-05-ANDROID-857-FAILURES.json及原始SHA。只补test-only标量状态/作用域和UDP syscall诊断，原断言、时间界限、生产权限与scope检查不变。Task1历史9a同输入12成功保留，Task2未完成；任务1/3，Phase6/NET及Phase3 halted不变。

### 2026-10-12 接续：独立校验85项与实际映射

诊断版本6475aee/input7a45df56本机Windows15/15（101327ms），独立68项通过，完整归档local-windows-6475aeebcc7b。CI38208095100三个Android ABI各115/115，当前11目标成功、iOS x64 simulator仍执行；不改写857三项失败或猜测原因。TARGETS/EVIDENCE已经按857实际归档创建12条，明确9成功/3失败、637原owner和12个逐设置case、D01–16、NET01–03、23威胁与6+3原flagged；独立all实际exit1拒绝失败CI，当前包不是最终审阅。

发现validator只比较flagged数量/来源SHA，未比条目内容，先76项/3真实行为失败，RED d76bd38，修正a3cc660。另先85项/4真实行为失败证明无关/重复/缺CI job目标及原combined content sentinel被接受，RED1a1273e，GREEN修正85/85、fail/skip/cancel/TODO0，258.5619ms。证据见06-05-VALIDATOR-FLAGS-RED/MAPPING-RED/GREEN.json。首次sandbox spawn EPERM不是行为RED。当前85测试与validator改动属于新共同输入，必须重建完整12目标、FFI及最终all后才能完成Task2。Task3原文仍null；1/3，Phase3 halted保持。

诊断CI38208095100现完整12/12真实成功，三个Android各115，原857三失败不改写，原因未确认。最终source7bcfbc1/inpute198aeef（42输入、85独立项）CI38209356614执行中。当前本机Release2536ms/Debug10683ms、正式Windows15/15（94991ms）、validator85/85、Flutter22/22及21host（20659ms）、Helios Release3537ms、根Debug重建2809ms及11/11（27666ms）真实通过且已独立归档。临时根记录脚本两个包装参数错误未启动任何产品命令，不记为原生失败或行为RED；修正后正式命令/输出哈希见06-05-ROOT-REGRESSION.json。TARGETS当前仍绑定857失败历史，后续完整当前CI通过才生成最终包与all；1/3/NET未关闭。

### 2026-10-12 接续：运行缺陷复现与修正

7bc输入实际CI38209356614出现macOS x64 D16、Android x64原ping_timeout/拒绝重试及Windows ARM64原healthy-cancel失败；不以同产物本机新自有AVD115/115（192066ms、85独立项、实际关闭/删除后adb为空）覆盖CI。见06-05-7BC-RUNTIME-FAILURES、LOCAL-ANDROID-7BC.json。Android客户端1ms为AP_TIMEOUT11，下一合法3000ms为AP_LENGTH24，对应host AP_STALE27；写前++ACTL序号独立native确定RED后修正0b3b918，仅完整写成功才提交。真实bare TCP-close在未证书验证时AP_TRUST21而非AP_LENGTH24形成第二合格RED，标准X509/hostname/unknown-CA alert拒绝保持。两次缺request.bin、尚未握手的1!=2尝试不计行为RED；最终21!=24才合格。

Windows ARM64原invalid stoul/healthy-cancel失败以相同场景确定空ready到有效端口负例RED e37de89复现；test-only消费者03d935d在原4s核验完整1..65535端口，05760b0先释放读取句柄再在既有预算内有界原子rename。首次consumer GREEN遇Windows读句柄阻止rename实际exit2，未计GREEN；修正后4/4。核心ABI/wire/父65/31场景、media27/recovery60、637原能力和所有既定deadline未改变。

当前针对性三个GREEN实际绑定05760b0/inputd3a4eb39，详见06-05-CONTROL-SEQUENCE-TLS-RED、READY-PORT-RED及CONTROL-RUNTIME-GREEN.json。Mac500ms请求实际632ms、采样已healthy为真实记录；21b4d3a设置自有控制与test-only observer QOS_CLASS_USER_INITIATED，遵循Apple官方API，仅调整线程调度，原500/900ms/25ms不变。Apple当前结果仍pending，不能以WindowsGREEN或QoS存在宣称解决。后续同输入完整CI、FFI/root/all及真正最终人审仍需完成，任务1/3/NET未关闭，Phase3 halted保持。

### 2026-10-12 接续：控制终态不等待无关媒体

a89/inputd3a4本机Windows15/15（94392ms）/85独立项、真实FFI22/22及21host（19460ms）、Helios Release2979ms、根Debug重建2596ms/11项27173ms通过并归档。CI38212553828 Android x64实际115通过、其他目标继续；macOS x64仍失败，QoS后D16通过但原control stream-recovery和recovery D08的首次故障采样已经healthy。原case-MN9xmq op7与100ms等待合计635ms，原query回执/日志保持。QoS不能单独作为修复结论。

原所有completed操作先媒体warm再终态的实际内部helper确定行为RED2c77d6a（真实native exit2），不冒称这个unit是网络/性能。d3e88b4只对非GRANT已完成操作取消无关25ms warm，立即从真实已有counter和当前monotonic状态刷新原query schema后发布终态；GRANT的实际sink/warm仍先执行，31控制/27media/60recovery和所有25/300/500/900ms/安全门槛不变。实际native GREEN见CONTROL-MEDIA-ORDER-RED/GREEN.json，当前完整矩阵仍须重测；1/3/NET未关闭，Phase3 halted保持。

## 恢复执行：源码审阅边界修正

03858c1/input aceb5787 的实际CI38214118510已12/12成功，独立all实际exit0；该通过记录作为历史保留。标准内联审阅CR-01/CR-02各在原具名case内取得真实RED（8fbd20b），e9e61ac修复FPS宽乘法/安全窄化和typed3、legacy2 full-media授权前的固定五SSRC空间检查。通用legacy单流范围保持。新测试清理修正0685a70后实际D11 1/1及native boundaries34/34、父4/4通过，详见REVIEW-BOUNDARY-RED/GREEN。没有改变31/27/60、Android115或XCTest42分母。Task1已完成，Task2等待新共同输入完整12目标矩阵和独立all，任务仍1/3，Task3真人关口尚未开始。Phase3 halt、637原能力、六禁止及三unclassified保留。

## 当前本地收尾与发布阻断

当前b734e8f/input2c2aefc2 Release Windows15/15（92728ms）、独立validator85/85、Flutter22/22与21host（18201ms），根CTest11/11（27194ms）及Helios Release（3140ms）实际通过。完整本地归档和SHA见CURRENT-LOCAL/ROOT-REGRESSION，标准审阅2项已修正、open0；首轮报告原字节另存。Task2仍1/3，当前新12目标CI尚未触发：自动审批两次拒绝公开git push，第二次不接受历史会话工具取证中的明确选项1。具体重新授权问题已发出，无间接发布或绕过；旧03858c1完整12/12和all0作为独立历史保留。EVIDENCE/TARGETS明确分离历史与当前；最终人审尚未开始，Phase3 halted与禁重启/关机保持。

## 后续实际媒体窗口与执行器修正

feb4ee3/input2c2aefc2前一矩阵实际CI38246782490为9/12、Windows fec-burst7/8、Mac D08重复window、iOS x64 cold-start总预算耗尽均保留。独立标准SRTP/UDP排队5ms负例先a0faff1真实RED、01b2a8f修复提前quarter-TTL cutoff，e0e2c0a仅调整test-only opcode100采样在原action deadline内等实际window，原断言/延迟/300/500/900ms保持；Windows15/85 GREEN。5e2418c/input70738a6c CI38250428509已通过Macx64原D08和Windowsx64，但又遇HTTP504、guest stop255和MacARM64 full组30s聚合timeout；所有失败仍独立记录。0a14023最多三次固定源下载重试、逐项owned服务stopped核验、full组60s（原计划单CTest60s，fast30和每Node10s/native5s保持）；6项隔离实际下载函数检查与Windows15/85通过。源/日志/实际数量见MEDIA-DEADLINE-RED、MEDIA-WINDOW-GREEN、INFRA-REPAIR。新共同输入完整12目标与all未完成，仍1/3，不开启最终人审或关闭NET；Phase3 halt和禁重启/关机保持。
