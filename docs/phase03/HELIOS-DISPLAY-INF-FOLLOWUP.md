# HeliosDisplay Win10/11 INF 补证

2026-10-09，03-01 研究准备续行。只在新的私有研究输出树构建，不改写 2026-10-08 的研究包/hash 或 R1 决定。本轮 [来源记录](HELIOS-DISPLAY-PROVENANCE.md) 与 [构建/工具证据](HELIOS-DISPLAY-INF-FOLLOWUP.json)分别保留；provider 未准入。

## INF 修正

[准备脚本](../../scripts/prepare-helios-display-research.cjs)仍只接受 `--prepare-unsigned-research`。固定原输入 length/SHA256/Git blob 核验在写文件前执行；保留 notices、独立 Root\\Aether\\HeliosDisplay、独立接口/ETW GUID、Aether registry 路径、管理员/SYSTEM ACL 与 watchdog=0 研究修改。

| Models 的适用选择 | reflector | Helios DLL 位置 |
|---|---|---|
| `NTamd64.10.0`，被更高 build 节优先覆盖 | Win10 Legacy：AddService，保留原路径 | DIRID12/UMDF |
| `NTamd64.10.0...17134` | Win10 1803+：AddService，保持 Win10 不依赖 WudfRd.inf | DIRID13（Driver Store） |
| `NTamd64.10.0...22000` | Win11：在 NT/HW/Services 三节 Include/Needs 系统 WudfRd.inf | DIRID13（Driver Store） |

这些是 INF 包结构分支，不是已支持 OS 清单。微软说明 [UMDF 从 Driver Store 运行](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/restricting-the-loading-location-of-umdf-drivers)从 Win10 1803 起适用；[reflector 引用](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/adding-the-reflector)在 Win10 与 Win11 不同。没有将 DLL 位置一律改成新路径而删除早期分支，也没有复制 inbox WUDFRd.sys。沿用 UmdfLibraryVersion=2.25.0、IddCx0102 以及原项目的编译版本参数；实际 IddCx 动态绑定、UMDF 与 API 下限仍需后续目标机核验，**win10FloorLocked=false**。

第一次修正仅让 Win11 DLL 使用 Driver Store，Win10 `/w` 真实返回 1627、诊断1322。随后增加 Win10 1803+ 分支，保留失败日志。最终 DLL 内容/编译逻辑没有新的媒体或显示生命周期改动；不同构建产物 hash 不当作二进制可重复性证明。

## 实际结果

工具：MSBuild 18.10.1.42706 amd64、WDK 10.0.28000.0 / assembly 10.0.28000.2526；本机 Win11 x64。

- **Release x64 编译退出0**。Tlog 实际包含 `/WX`、`/analyze`；EnablePREfast 保持 true。SignMode Off、EnableTestSign false、GenerateTestCertificate false、DriverDeployment false。
- InfVerif 的 legacy 16299/default、Win10 17134/default、Win10 19045 `/w`、Win11 22000 `/w`、Win11 26100 `/w`、全局 `/w` 共 **6/6 退出0，INF is VALID**。这是工具模拟目标 OS 选择，没有在这些 OS 上安装/运行。单 OS 查询留下14或15个2083“其他分支未使用”告警；全局 `/w` 0告警；全部没有2084。
- Inf2Cat 明确 `/os:10_VB_X64,10_CO_X64,10_NI_X64,10_GE_X64`（Win10 2004系列、Win11 21H2/22H2/24H2工具标识）目录生成退出0，errors/warnings 均0。签名渠道是否批准这些 OS/架构仍待真实提交，不将 CAT 生成当正式签名。
- INF 6608bytes、DLL129536bytes、CAT1263bytes，完整 SHA256 见 JSON；DLL/CAT NotSigned，INF UnknownError，三者无可信签名结论。另固定 HeliosDisplay.pdb 的4083712bytes与hash供未来提交审阅。
- 研究准备3项、包准入9项、planning1项，**13/13** 无skip，400.88ms。测试使用手写合成 INF，不依赖 ignored upstream 或源代码 fixture。目标涵盖 Win10/Win11 服务分支、Driver Store/legacy路径、唯一身份、缺节/重节/外来身份拒绝与系统操作入口拒绝。

重建时沿用[原构建命令](HELIOS-DISPLAY-PREPARATION.md)，每次生成新的目录；最终本轮路径与逐条命令/日志/hash在 JSON。工具检查可复核：

```powershell
# $inf 为新构建包的 HeliosDisplay.inf；以下命令仅验证文件，不安装设备。
& 'C:/Program Files (x86)/Windows Kits/10/Tools/10.0.28000.0/x64/infverif.exe' /w /v /osver NTAMD64.10.0...19045 $inf
& 'C:/Program Files (x86)/Windows Kits/10/Tools/10.0.28000.0/x64/infverif.exe' /w /v /osver NTAMD64.10.0...26100 $inf
& 'C:/Program Files (x86)/Windows Kits/10/Tools/10.0.28000.0/x64/infverif.exe' /w /v $inf
```

**限定关闭：** 研究 INF 的平台分支与原2084结构问题已取得本地 WDK 工具证据。**仍开放：** 全量许可/notices、正式可信签名、Win10实际加载/最低build、非管理员ACL/IOCTL、七屏保活/HDR、更新/回滚。03-01保持 halted；03-02/03-03未启动，VDP未完成。没有执行任何设备/registry/证书/安全策略变更；严禁开发机重启或关机持续适用。
