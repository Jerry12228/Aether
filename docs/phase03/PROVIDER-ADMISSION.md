# Phase 03 provider 准入审阅

2026-10-08。状态：**没有合格候选；03-01-03 已确认选项 2，补证完成但准入仍阻断**。来源/接口审计、具体路线决定、具体系统操作授权、生产/实机验证为四个不同门槛。完整字段见 [PROVIDER-ADMISSION.json](PROVIDER-ADMISSION.json)。用户原文 `2` 与记录时间/原档案 hash 已写入 decision；`selectedProviderId=null`。补充结论见 [SUDOVDA-EVIDENCE-FOLLOWUP.md](SUDOVDA-EVIDENCE-FOLLOWUP.md)；原候选行保留为检查点前快照，公开源码现已取得。

## 已完成的只读路径

从仓库根运行 `build/native/Debug/helios.exe vdisplay query --json` 或 `vdisplay driver check --json`。前者枚举成功退出0；后者在没有准入provider时退出1，即使观察到候选设备也只报告`capability_unverified`。`query --group A`由于尚无准入provider/登记返回`not_found`，不能按分辨率认领已有屏。未知命令/参数退出2。

Windows适配调用GetDisplayConfigBufferSizes / QueryDisplayConfig（仅active paths）、DisplayConfigGetDeviceInfo和SetupAPI/CM只读设备元数据。CCD竞态最多3次；错误/拒绝不解释为设备不存在。同步OS调用放在命令工作线程；主命令10秒deadline后报告timeout并结束本进程。任何provider IOCTL均未发出，设备接口未打开。显示组mutation合同全部`not_admitted`；共享C ABI1、Dart、五平台core不链接设备操作。日志在`artifacts/phase03/probe/<PID>.json`；无法保存日志返回非零。普通本地core的前台及stop/ack/destroy逻辑保持原语义。

本机真实CCD看到1条活动路径：2240×1400、30000/1000刷新率、advancedColorSupported=true / enabled=false；`hdrVerified=null`，既不是60/1原型屏，也不证明HDR生效。原生测试在query → driver check → query三个新进程之间比较完整显示/设备现实，状态一致；访问拒绝、竞态耗尽、未知错误、deadline和mutation拒绝为测试注入，不能替代真实驱动功能。

只读CIM：Windows11 Enterprise LTSC 10.0.26100。已有SudoMaker `ROOT\DISPLAY\0000` / `oem44.inf` / `0.22.37.632`；CIM IsSigned=false、Signer=null。已有Oray `ROOT\DISPLAY\0001` / `oem88.inf` / `17.50.19.949`；CIM IsSigned=true、Signer=Microsoft Windows Hardware Compatibility Publisher。CIM字段不是完整签名政策核验，SudoMaker名称也不等于已核验的SudoVDA协议。两者和现有活动屏均为外来/未归属资源；Aether拥有0个显示设备。

## 五候选结论

| ID | 固定事实 | 未闭合的准入门槛 |
|---|---|---|
| apollo-sudovda | Apollo `adc5c5a0bd80831ce495434bb16aee2cd4175fb8`；六IOCTL、GUID add/remove、LUID/target返回，客户端wrapper版本0.2.1 TestBuild=true | 固定树缺DLL/完整driver源码与独立许可；固定CAT本机不受信任，无时间戳证书；all-users设备读写+FILE_ANY_ACCESS为high；watchdog/Ping与短进程持久性、七屏容量未知 |
| virtualdrivers-vdd | VDD `d7244969b2aa8bb38e76d79505eda217996cefea`；17个pipe command，全局count/reload、随机container、共享模式表 | 无逐slot增删隔离合同；pipe/device ACL待核验；旧发行包不等于固定源码，独立notices未闭合；适用签名政策/默认安全配置安装未验证 |
| microsoft-idd-sample | 官方IddCx / software-device教学API，ParentPresent可作为持久枚举研究方向 | 没有固定正式provider包或完整DDI审计；自研/修改驱动需要具体路线决定及签名/许可链 |
| molotovcherry-vdrs | 官方README声明动态显示控制、最多10屏、Win10 2004+ x64 | 未固定源码/完整接口/包；证书导入不等于正式签名；HDR/持久性未实测；没有批准Rust栈 |
| parsec-vdd | 官方产品多屏说明 | 未取得Aether独立接口/源码/包/再分发授权；产品3附加屏限制不推断底层上限，也不满足七屏证据 |

固定SudoVDA INF：DriverVer `07/14/2025,1.10.9.289`、NTamd64、IddCx0102；设备ACL `D:P(A;;GA;;;SY)(A;;GA;;;BA)(A;;GRGW;;;WD)`。固定CAT为2425bytes / SHA256 `2f9189de5604bec9d86f51640cc540639e394d9ad0f8e689129375e95f2d22f8`；Get-AuthenticodeSignature报告信任链终止于不受信任根，Subject=CN=sudovda@su.mk。固定install.bat导入root/TrustedPublisher证书；本次没有运行它。Helios鉴权无法阻止其他进程直接绕过provider设备ACL。

## 已取得VDD资产

实际下载[官方25.7.23 Driver Only包](https://github.com/VirtualDrivers/Virtual-Display-Driver/releases/download/25.7.23/VirtualDisplayDriver-x86.Driver.Only.zip)，仅列包并提取四个确定文件进行只读审计；没有运行DLL、安装器、注册驱动或导入证书。

- Archive：132118bytes，SHA256 `e24210692b442b39af763536330ce78b423f19342b7a7792c26de3944e418b3a`，与官方release API digest一致。
- 文件名含x86，实际INF是NTamd64；发行tag25.7.23与INF DriverVer `12/24/2024,11.30.4.434`分别记录，不要求它们字符串相同。
- 四成员length/hash均在JSON中。INF、DLL通过signtool `/pa /c`成员验证；XML不在CAT，保留archive/member hash。CAT本身Get-AuthenticodeSignature=Valid，SignPath Foundation签名、DigiCert Timestamp 2024时间戳证书。
- SDK28000 x64 signtool `/kp /v` CAT退出1：`Signing Cert does not chain to a Microsoft Root Cert.` 这是一次具体政策测试；UMDF适用安装政策与本机默认安全配置加载尚未验证，不推断所有目标机器兼容/不兼容。包来源对应与许可问题独立保留。
- 下载内容在忽略的`artifacts/phase03/vdd-25.7.23.zip`，成员在`vdd-package/`，逐成员与政策原始输出在`artifacts/phase03/vdd-*.log`。没有将二进制或参考checkout纳入产品依赖。

## 接口与系统方案

JSON及[COVERAGE.md](../../.planning/phases/03-virtual-display-feasibility/COVERAGE.md)列出SudoVDA全部10个wrapper方法/6个IOCTL、VDD全部17个pipe command和其他候选未固定接口的缺口。INTEGRATE表示候选目标；本轮只接入Windows枚举，不代表驱动调用已经实现或获批准。源码指向仅作为研究证据，CMake不读取references/upstream。

严格保留A1 1920×1080 SDR、A2 2560×1440 SDR、B1/C1/C2/D1/D2 1920×1080，全部60/1，D2 HDR其余SDR。七屏/实际HDR/稳定逻辑与系统ID/退出watchdog后保活/创建重开删除隔离/恢复回滚均未证明。微软IddCx1.10 HDR接口的OS条件须单独核验；没有提高Aether Win10主机下限，也没有把D2降为SDR。

具体预备机为当前Win11 26100；独立Win10目标仍缺。安装之前必须固定合格包、完整接口安全、所有外来资源/精确设备ID和rollback包。当前没有任何可执行安装路线。预备预算为单个≤1MiB正式driver-only包、下载30秒、安装60秒；超过预算须重新呈交具体计划。仅显式安装/`--update`，已有登记组或未知所有权时拒绝更新；不得根据friendly name升级/删除现有SudoMaker/Oray。保留已获准旧包的exact hash才能进行更新；现在没有这样的旧包。reset必须另获具体机器/场景授权并记录跨组影响。重启由用户手动完成，随后显式driver check和reality-diff，再按获准组执行恢复；不自动重启、恢复或增加常驻owner。

## 分层门禁与待决定项

`node scripts/check-virtual-display-admission.cjs --stage dossier`通过：档案完整，null均有gap。`--stage admission --provider <ID>`分别对五候选非零：来源/包/独立许可/签名/安全/接口仍有缺口。admission不要求尚未授权执行的七屏机器结果，避免先安装后准入的循环；仍要求完整来源接口合同证据。fixture不能通过真实准入。`--stage dossier --require-decision`现通过，绑定用户原文 `2` / 2026-10-08T13:55:18Z / 原档案 hash；这仅关闭路线决定门槛。authorization还必须绑定确切机器、场景、systemPlan hash和用户原文。

已记录**no-qualified-provider**与选项 2：固定审计 SudoVDA 来源、独立许可、ACL 和持久性。公开实现及作者修改许可声明已取得；源码/正式包对应、继承许可、受限 ACL、对应包的 watchdog=0 保活和 Win10 HDR 仍未闭合。补证详见上述文件，阶段与 VDP-01/02 保持未完成，03-02/03-03 保持阻断；系统操作仍经03-03-02。取得完整新输入后须重新审阅，不泛化本次选择。

证据来源：[固定Apollo接口](https://github.com/ClassicOldSong/Apollo/blob/adc5c5a0bd80831ce495434bb16aee2cd4175fb8/third-party/sudovda/sudovda.h)、[固定INF](https://github.com/ClassicOldSong/Apollo/blob/adc5c5a0bd80831ce495434bb16aee2cd4175fb8/src_assets/windows/drivers/sudovda/SudoVDA.inf)、[固定VDD Driver](https://github.com/VirtualDrivers/Virtual-Display-Driver/blob/d7244969b2aa8bb38e76d79505eda217996cefea/Virtual%20Display%20Driver%20%28HDR%29/MttVDD/Driver.cpp)、[CCD官方合同](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-querydisplayconfig)、[IddCx1.10官方更新](https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iddcx1.10-updates)、[软件设备生命周期](https://learn.microsoft.com/en-us/windows/win32/api/swdevice/nf-swdevice-swdevicesetlifetime)。运行事实以上述实际命令/成员哈希为准。
