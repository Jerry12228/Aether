# 03-03 具体系统操作授权计划

状态：用户原文 `1\n不得影响主机已有的Apollo运行` 已条件性批准旧计划的 Win11 单独安装。旧固定 INF 的 UMDF DeviceGroupId 层级错误导致前置检查阻断，安装器未调用。缺陷现已修正、重建及使用原有证书签名；本页是新的固定包/二进制/计划，旧批准不能转移到新字节。尚未安装、未创建可执行授权文件，未改系统设备、显示拓扑、provider 配置或信任策略。VDP-01/02 与 Phase 3 未完成。

权威机器可读记录见 [HELIOS-DISPLAY-INSTALL-PLAN.json](HELIOS-DISPLAY-INSTALL-PLAN.json)。完整原生只读计划保存在本机 `artifacts/phase03/package-contract-isolation/install-plan.json`；JSON 记录其文件摘要和原生 canonical plan hash。用户目录在可读记录中用 `${LOCALAPPDATA}` 表示，原始计划仍固定实际路径。摘要绑定二进制、包、机器、身份、登记、现实显示状态及操作；任一项改变都必须重新生成计划，旧批准不能执行新计划。

Apollo 前置检查与修复：旧包写 `HKR,,DeviceGroupId`，无法建立预期 UMDF 分组。新包只改这一项为 `HKR,"WUDF","DeviceGroupId",0x00000000,"HeliosDisplayGroup"`；其余七个编译输入完全相同，设备 ACL、接口 GUID、IOCTL access、DeviceAdd、查询及默认 profile 不变。[微软 IDD INF](https://github.com/microsoft/Windows-driver-samples/blob/main/video/IndirectDisplay/IddSampleDriver/IddSampleDriver.inf) 使用 WUDF 子键；[微软 UMDF pooling 文档](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/using-device-pooling-in-umdf-drivers)说明 pooled 故障会重启同宿主设备。实际 Apollo WUDF 组为 SudoVDAGroup，Oray 为 OrayIddDriverGroup；修正只是源码/构建隔离证据，安装后须回读 HeliosDisplayGroup 和单独宿主身份，不能预先宣称运行时隔离成功。

本次准备前后 ApolloService Running/PID6820 与 sunshine.exe/PID15176 的启动时间、WUDFHost 四个既有 PID、配置/二进制、外来设备/驱动和活动 CCD 均相同。另一次 45,957ms 有界只读观察中，全部上述项目、8个外来 driver-store 文件摘要、WUDFRd 服务配置以及 TCP tuple 摘要均未变化（两次均未观察到 established TCP，不推断没有 UDP 串流）。证据：[原条件授权](HELIOS-DISPLAY-APOLLO-CONDITIONAL-AUTHORIZATION.json)、[只读对比](HELIOS-DISPLAY-APOLLO-PREFLIGHT.json)、[修正补证](HELIOS-DISPLAY-UMDF-ISOLATION-EVIDENCE.json)。这些结果只说明准备期间观察不变，没有安装结果或视频/UDP质量证明。原计划与旧档案已独立保留。

| 项目 | 本次事实 |
|---|---|
| 匿名机器 | `win-5f5cc5dd3cf310b6` |
| OS | Windows 11 企业版 LTSC，10.0.26100；补丁 KB5120710、KB5121003、KB5123304 |
| GPU | RTX 5080，32.0.15.9579；AMD Radeon(TM) Graphics，32.0.13036.4 |
| 已有外来 provider | SudoMaker 0.22.37.632 / `ROOT\DISPLAY\0000`；Oray 17.50.19.949 / `ROOT\DISPLAY\0001` |
| 专属 provider / 登记组 | 尚未安装 / 0 组；20 条既有 Display/Monitor PnP 记录保留 |
| 当前活动路径 | 外来 SudoMaker 2240×1400，30000/1000 Hz，advanced-color 未启用；保留其 identity、布局和模式 |
| 安全观察 | Secure Boot registry=1；HVCI registry=0、VBS=0 是既有观察，未改变任何开关；BCD 查询 access denied，安全结论为 partial |
| 既有信任 | 用户已批准的 E3ED742C3D08188A117AFF7B6C1BB207523EB4DB 在 Root/TrustedPublisher；本次没有导入证书 |
| 专属 profile | 当前配置键不存在；锁定编译默认 watchdog=0、testMode=0、maxMonitors=10、SDR8/HDR10；安装前重新核对，安装后须实际回读 |
| Win10 | 未提供独立获准机器；七屏 SDR 仍是阶段必需验收，不用本机结果代替 |

锁定 source `helios-1791547416299`，本地派生自签包 `helios-1791547543587`，version 0.1.0.0 / x64。ZIP SHA256：

```text
da25eeab4bdba29f440a89ec698aa8c5e66811001e3976ef47d93bba15eeaa12
```

准入 dossier hash 为 `78324da77c8ff2936337e3da948d8358105c7392792cecb679ccc92b948ea00d`。本地派生源没有上游 release URL，不虚构下载地址。原生入口校验实际 ZIP 长度/摘要/九成员安全清单、已解包固定 INF/DLL/CAT/许可文本、当前 Windows Authenticode 与 CAT 全部必需成员策略，随后只复制固定字节到 owner/SYSTEM 保护的私有 stage。不会执行 ZIP 中证书或未知程序，不运行参考安装脚本。自签准入限于已批准本机信任，不能表述为 Microsoft 认证或通用机器发行批准。

当前安装计划 hash：

```text
4fa13eea427d0a90b3075f85e6813d2f246463dadb41e259d309660e4e77a60a
```

Helios Release SHA256：`824a6b8b2158c9d713dc2a5eeee88721ae7eccf18786d7096d7258e94f532994`。若用户批准此新固定计划的单独安装，并且即时 Apollo 前置条件仍通过，执行器只在匹配授权文件和管理员令牌齐备后运行下列绝对程序与参数；此命令当前未执行：

```text
exe: D:\WorkSpace\Aether\build\native\Release\helios.exe
argv: ["vdisplay","driver","install","--approve-plan","4fa13eea427d0a90b3075f85e6813d2f246463dadb41e259d309660e4e77a60a","--json"]
```

提权由执行器安排用户可见的系统授权；Helios 不隐式触发 UAC。安装在进程内使用 SetupAPI/NewDev，无 shell 命令拼接：`SetupCopyOEMInfW(SP_COPY_NOOVERWRITE)` → 仅不存在专属 root 时以固定硬件 ID `Root\Aether\HeliosDisplay` 注册新设备 → `UpdateDriverForPlugAndPlayDevicesW(INSTALLFLAG_FORCE|INSTALLFLAG_NONINTERACTIVE)`。真实私有 stage 路径、发布 INF、是否新增 OEM 包以及本次新 root ID 在副作用日志中记录。已存在 OEM 包不当成新包删除。组操作与安装共用同一 owner mutex；锁等待 2 秒，包验证 120 秒，安装入口总预算 180 秒，日志有界。

可分别批准的当前场景：

| 场景 | 明确操作范围 |
|---|---|
| Win11 Install | 安装上述唯一固定专属 root/provider；不改 SudoMaker、Oray、物理 GPU、不写 provider 配置、不导入信任 |
| Win11 Topology / Persistence / DeleteIsolation | 安装成功后显式创建 A/B/C/D；七屏精确 60/1，A=1080p+1440p SDR，B=1080p SDR，C=两个独立 1080p SDR，D=1080p SDR+实际 HDR；按四行保留外来活动路径；显式测试画面退出不删组；所有 caller/pattern owner 退出后记录有界观察；删除/重建 B 并比较 A/C/D 与 foreign；只对用户指定组显式 recover |
| Win11 ResetRecovery | 当前暂不执行：安装后先取得新 root 的实际 ID 和全部组/slot ID，再提交精确 reset 清单；共享 adapter 故障会影响它的所有组 |
| Win11 UpdateRollback | 当前暂不执行：尚无本 provider 的已安装旧包；先取得核验旧包、登记/system mapping 备份和具体维护 plan，再单独批准更新与故障场景 |
| Win10 matrix | 当前不可测：提供独立 Win10 机器及相应计划授权后验证七屏全 SDR；显式 HDR 拒绝不能算 HDR PASS |
| reboot / shutdown | 禁止执行或安排；任何 reboot-required 返回 pending，相关验收保持未执行 |

安装失败仅补偿本次可证明新建的 root/OEM 资源。更新先保存登记、last-success、系统映射和完整旧 driver-store 包；存在组必须绑定批准的共享中断与显式恢复方案，未知专属 monitor 也拒绝认领。明确安装失败尝试恢复核验旧包，并回读旧版本及每文件摘要；回滚失败/超时/未知副作用保留 pending，登记不清空。任何 foreign 变化不能声称成功或自动应用全局回滚。所有重启/关闭操作持续禁止。

授权文件将位于 protected `${LOCALAPPDATA}/Aether/phase03/machine-authorization.v1.json`，需同时包含 native identity binding、机器/package/plan hash、用户原文/时间、逐项 commands 与必要 maintenancePlan；03-02 所需 ownerSid/loginAuthLuid/desktop 扁平字段也保留。当前不存在此文件；仅提供 `--approve-plan` 不能绕过授权。合同后端是独立二进制，生产 CLI 不接受测试身份、故障或路径注入。

Release 构建、包合同 35/35 与既有 CTest 11/11 已通过。合同覆盖真实无副作用 plan、坏 hash/signature/version/arch、断流/穿越/reparse 拒绝、缺授权/拒绝提权/版本差异/未知资源/维护方案、回滚失败/超时及 reboot-required；系统安装、七屏/HDR、保活/恢复/更新等机器结果均未测试，最终 humanReview 为 null。

自动审批审查拒绝了拟用假授权进入 Machine/Install 的负例，原因是该入口可执行真实安装，而当前授权不包含系统安装。该命令未执行，未绕过重试；相应拒绝行为由独立合同后端验证。BCD 的只读权限缺口也原样保留。

原生 API 依据：[微软 UpdateDriverForPlugAndPlayDevicesW](https://learn.microsoft.com/en-us/windows/win32/api/newdev/nf-newdev-updatedriverforplugandplaydevicesw)、[DIF_REGISTERDEVICE](https://learn.microsoft.com/en-us/previous-versions/windows/drivers/install/dif-registerdevice)。API 可用与代码编译不构成实机安装成功证明。
