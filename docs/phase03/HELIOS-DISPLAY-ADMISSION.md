# 03-01 HeliosDisplay 准入范围

候选：`aether-helios-display`，固定 SudoVDA 基线 `a4b09fa2aa731a964d0cb5d139cb1e6240e4da12`。研究源 `helios-1791524690800`；最终自签包 `helios-1791525277849`；ZIP SHA256 `c5f085cba2fec999fabf141038dc7530bc61b5b489807d485e612b615c59783a`。版本 0.1.0.0 / x64，私有协议 0.3.0。

## 门槛证据

- 来源/许可：八项编译输入和七项独立变换输入逐项摘要固定。较大早期 helper、配置读取体、依赖块、EDID 模板、INF/project 已独立替换或排除；残存早期共享表达式全部对应固定 Microsoft MS-PL 样例，未匹配表达式为零。Yukino 的修改仅按本人 CC0/public-domain 声明使用，不扩展到其他作者。完整 MS-PL/CC0、版权和声明已随包保存。独立驱动源遵守 MS-PL，不选择 Aether 主仓库的整体许可。精确 2017 Git 祖先仍不宣称找到；许可依据是可取得的微软授权表达式与独立重构，而非伪造祖先关系。见 [许可审计](HELIOS-DISPLAY-RIGHTS-CLOSED.json)。
- 构建/签名：实际 WDK Release x64、/WX、/analyze；六目标检查的 INF 与最终 INF 字节一致，四 OS CAT 重建。最终 INF/DLL 默认 `/pa /c`、CAT 成员、SHA256/RSA3072 和 RFC3161 时间戳通过。用户批准的自签 CER 已导入本机 Root/TrustedPublisher；私钥 NonExportable，未导出。不是 Microsoft 正式认证或通用机器默认信任。
- 接口：逐 GUID ADD/REMOVE、稳定 ContainerId 与 LUID/TargetId、默认十 slot 容量、零 watchdog 短 caller 保留、精确 60Hz、Win10 SDR / Win11 HDR callback 路线均已做安装前源码与构建审计。独立配置读取器实际原生测试覆盖错误类型/尺寸、过长字符串、容量边界、GPU/bits 与句柄清理。源可行性不代表七屏/HDR实机通过。
- ACL：用户批准的先行包实际研究设备完成了 BA/SY 栈 DACL、普通令牌拒绝、管理员 READ 成功与零访问 IOCTL 拒绝测试；设备/新增 OEM 包/配置和父键均精确清理。最终包只独立重构配置读取/依赖声明，另外七输入、include 顺序、默认值及完整 WDF/security/IOCTL callback 源体逐字节相同；INF 也完全相同。因此对同一 Windows 管理的访问边界沿用实际测试，是明确标注的源码推断，**不是最终 DLL 已安装的声明**。见 [实际 ACL](HELIOS-DISPLAY-ACL-AUDIT.json)、[对应证明](HELIOS-DISPLAY-ACL-BRIDGE.json)。

UMDF 的设备安全通过 INF 指定栈描述符，私有 IOCTL access bits 同时限制句柄权限：[微软 WDF 设备访问说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/controlling-device-access)。继承 ACL 结论只针对逐项对应的相同边界；改 INF、IOCTL/header、WDF/security callbacks、身份或准入 profile 必须重新审计。

## 必须保留的接入条件

准入只允许后续计划选择该独立 provider；当前用户范围停在准入，**03-02/03-03 不执行**。实例登记、创建屏、七屏/HDR、CLI 退出保活及更新/恢复矩阵尚未实施/实测，VDP-01/02 和 Phase3 不完成。

受控 profile：watchdog=0、testMode=0、maxMonitors=10，隔离 hardware ID / interface GUID / registry。不接入全 adapter SetRenderAdapter 或持续 Ping；设备 IOCTL query 要求 READ、mutation 要求 READ|WRITE。不把旧 SudoMaker/Oray 资源认领或改写。

03-02 必须先处理 MonitorArrival 失败清理和满容量重复 GUID 的幂等边界，并在产品层核对 requested/actual 和隔离资源。59.94 旧路不精确，不扩大为所有分数刷新率支持。ZZZ EDID 厂商字段仅为研究占位；正式厂商身份、其他架构、实际 OS build 下限、Win10/11 实机和发行渠道仍属后续门槛。

只保留已经明确授权的研究证书信任；先行实验安装授权已经完成并清理，不是最终新包或后续安装的长期授权。任何需要重启/关机的步骤均不执行或安排。

依据用户已选独立派生路线、原文「推进直到准入」「证书自签即可，效仿Apollo」，在技术 gate 全部通过后记录该范围的准入；不把它描述为用户重新人工审阅了最终 hash。固定档案及校验结果记录在 `PROVIDER-ADMISSION-RECONSTRUCTED.json`。
