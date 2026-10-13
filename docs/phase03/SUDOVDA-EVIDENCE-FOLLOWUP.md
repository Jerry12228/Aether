# SudoVDA 补证 — 选项 2

2026-10-08。用户原文 `2` 对应「无合格 provider；补 SudoVDA 来源、独立许可、ACL 与持久性证据」。决定绑定原档案摘要 `fe4ab0c03e59eda9a0b3ee655ca0152900b3d20d24e775cae2d6972b501e6ea8`；[原档案](PROVIDER-ADMISSION.json)只更新 decision，原五候选事实保留为当时快照。本补充是研究证据，不替代准入，也不授权驱动修改或系统操作。

## 固定来源与对应关系

已取得 [SudoMaker/SudoVDA 官方源码](https://github.com/SudoMaker/SudoVDA/tree/a4b09fa2aa731a964d0cb5d139cb1e6240e4da12)，固定提交 `a4b09fa2aa731a964d0cb5d139cb1e6240e4da12`（提交时间 2025-04-14T16:21:36Z）。13 个非隐藏文件均从固定 raw URL 下载，逐文件重算 Git blob SHA-1 与官方树比对，并记录 SHA-256/长度，见 [来源清单](SUDOVDA-SOURCE-EVIDENCE.json)。源码文件保存在忽略的 artifacts/phase03/sudovda-followup/；没有复制到产品、编译或执行。

这关闭「无法取得公开驱动实现」这一研究缺口。之前缺源码的事实限定于固定 Apollo 参考树；不能推导整个上游没有公开实现。新源码 INF 仍含待构建替换的 DriverVer/ARCH/UMDFVERSION，API 协议为 0.2.1/TestBuild=true。没有对应此提交的 DLL/CAT、构建输入与产物证明；本次官方 releases API 返回空数组，表示观察时该仓库未发布 release 资产，不排除其他发行渠道。

因此，新源码既不能自动等同 Apollo 固定 INF `1.10.9.289`，也不能等同本机既有 `0.22.37.632`。原固定 CAT 信任缺口没有关闭；未读取或操作既有设备接口。

## 四项补证结果

| 门槛 | 新的固定源码事实 | 结论与剩余证据 |
|---|---|---|
| 来源 | 官方树包含 Driver.cpp、Driver.h、IOCTL 定义、INF 与项目文件；文件 blob/hash 全部匹配 | 实现来源已获得；对应正式包及精确构建 provenance 尚缺 |
| 独立许可 | 固定 README 的 License 段对作者自身修改给出 MIT/CC0/Public Domain 选择，并明确要求核验微软部分；树中没有独立 LICENSE 文件；代码保留微软版权及其他来源致谢 | 存在授权声明，不能再记成完全无声明；逐文件继承、完整 notices、具体编译包再分发依据仍未闭合 |
| ACL | INF 的 Security 包含 WD 的 GRGW；六个 IOCTL 为 FILE_ANY_ACCESS。handler 未见调用者所有权校验，remove 按传入 GUID 找 monitor；SET_RENDER_ADAPTER 改共享状态 | 原 high 风险仍未缓解。Helios 登记/鉴权不能阻止其他进程直接访问 provider；需要受限设备 ACL 与驱动边界所有权合同及负例证据 |
| 短命令保活 | watchdog 默认 3 秒；倒计时耗尽调用 DisconnectAllMonitors。启动前 registry watchdog=0 可使 RunWatchdog 不启动线程；README 要求重载/重启才生效 | 默认策略与 CLI 全退出后持续保留显示器相冲突；0 是候选配置依据，尚未在对应包上证明。更改配置/重载是系统操作，本轮未做 |

许可只记录已观察的授权范围和证据缺口，不宣称 Microsoft 或其他贡献者的代码已被重新许可。微软样例仓库当前 [LICENSE](https://github.com/microsoft/Windows-driver-samples/blob/main/LICENSE) 为 MS-PL；该动态来源仅是继承审计入口，未证明 SudoVDA 每个文件从哪个样例版本派生。EDID 生成器等贡献仍需固定来源与 notices。没有新增产品复用/再分发条目。

## IOCTL 与生命周期的具体影响

[Driver.cpp](https://github.com/SudoMaker/SudoVDA/blob/a4b09fa2aa731a964d0cb5d139cb1e6240e4da12/Virtual%20Display%20Driver%20%28HDR%29/SudoVDA/Driver.cpp) 的 handler 在分派前，对 GET_WATCHDOG 之外的所有 IOCTL 重置 watchdogCountdown（包括 GET_PROTOCOL_VERSION 和未知码）。所以查询协议版本会影响设备生命周期，不能列入无副作用探测。GET_WATCHDOG 例外不重置，但仍需对应正式包核验；当前 Helios 只调用 Windows CCD/SetupAPI/CM，没有发这些 IOCTL。

source 中 add/remove 有逐 GUID 逻辑，add 返回 adapter LUID/target ID；重复 GUID 返回已有结果。默认 maxMonitors=10 是容量配置，不能代替真实七屏证明。源码的 60 Hz 路径在 HDR 分支表示为 60000/1000，SDR 分支可为 60/1，数学值相同；合同要求的规范化 60/1 与实际 CCD 结果仍需核验。Helios 同名创建拒绝不能依赖上游重复 GUID 成功的行为。

monitor 表驻留驱动进程内存；watchdog 超时是全表移除，不按 Aether 显示组隔离。启动前禁用 watchdog 与运行中 timeout 变为 0 不同，后者的 worker 分支也会移除全表；不得用模糊的「设 0」承诺保活。重载/设备故障后需单独的显式恢复合同。原有外来 SudoMaker/Oray 设备不能被用于设置此全局选项。

固定 [README](https://github.com/SudoMaker/SudoVDA/blob/a4b09fa2aa731a964d0cb5d139cb1e6240e4da12/README.md) 明确声明 Win10 不支持 HDR，Win11 24H2 才是其完整 HDR 支持目标，较旧 Win11 的开关不确定。这是上游声明，尚非 Aether 实机支持结果。项目文件的 Windows10/UMDF2.25/IddCx1.10 minimum1.4 配置也不能证明 Win10 HDR。

## 当前处置与下一次可审阅输入

结论仍是 **no-qualified-provider**；03-01-03 已答复，03-02/03-03 保持 halted，VDP-01/02 与 Phase 3 未完成。四组七屏、全部 60/1、D2 HDR、Windows10/11 要求原样保留。

下一次准入审阅至少需要以下具体材料；取得新材料后生成新档案摘要重新审阅，不能把本次 `2` 泛化为批准 provider：

1. 与上述固定提交对应的正式 INF/DLL/CAT、构建输入/产物 hash、适用签名与默认安全安装证据，以及逐文件许可与完整 notices。
2. 上游受限 ACL/所有权修正的固定提交与包，证明非授权 caller 不能增删屏或改变共享 adapter。若转为 Aether 修改驱动，先提出修改范围、许可/签名渠道和维护影响，再作具体路线决定。
3. 对隔离目标机/精确新包提出 watchdog=0 与回滚方案；获具体系统授权后，证明所有 CLI/Ping 均退出且超过 watchdog 周期仍保留七屏，删除 B 不影响 A/C/D。安装前源码合同证据与安装后机器证据分开。
4. 对 Win10 HDR 缺口给出符合原要求的 provider 方案；当前源码不能补齐它。若必须更换/修改 driver 或修订规范，需具体决定，不降低屏数、HDR 或提高 Windows 下限。

本次没有运行安装器、导入证书、写注册表、重载/重置驱动或改变显示拓扑，也没有联系上游维护者。补证不引入常驻 Ping/owner。
