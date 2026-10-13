# HeliosDisplay 正式签名准备

2026-10-09，依据本轮微软官方页面核查。这里只整理输入与依赖，不申请账户、购买证书、上传包、签署协议或授权机器操作。包保持 unsigned，provider 保持未准入；许可未闭合时不提交本研究包作为生产复用。

## 当前可审阅输入

固定源、逐文件变换、Release x64 DLL、平台分支 INF、未签名 CAT、符号 PDB、工具日志与全部成员 hash 已有[记录](HELIOS-DISPLAY-INF-FOLLOWUP.json)。原包有空格/括号的长研究路径，不直接作为 dashboard 提交目录。来源和 EDID [权利缺口](HELIOS-DISPLAY-PROVENANCE.md)仍开放；Win10/11 运行、七屏、ACL和HDR测试记录尚不存在。

## 渠道条件

| 路线 | 正式条件与证据 | 本项目目前状态 |
|---|---|---|
| Microsoft dashboard attestation（受控测试候选） | Hardware Developer Program账户、关联有效EV证书；提交证书须注册、SHA256。微软当前说明此路线用于测试，可处理桌面用户态驱动；不等于Windows Certified，不提供零售Windows Update发布资格 | 未验证账户/EV、未生成已签CAB、未上传；未选择发行路线 |
| WHCP/HLK dashboard（认证/零售Windows Update） | 同样需要账户/有效EV；适用目标OS/架构/设备类别的实际HLK测试、结果包与渠道审查 | 未具备目标机/HLK结果；本轮InfVerif/Inf2Cat不是HLK |
| 其他可信CA的UMDF包签名 | 取得实际证书/签CAT/链/成员证据，并核验适用Windows安装及加载政策 | 未选、未签、未实机核验，保持候选；不把纯内核驱动规则直接套到UMDF |

依据：[签名选项](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/driver-signing-offerings)、[dashboard证书要求](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs)、[UMDF与包签名说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/windows-driver-signing-tutorial)。EV是上述dashboard路线的条件，并不由此推断所有UMDF交付途径都必须EV。preproduction signing要求设备专门配置，不在本机授权范围内。

## Dashboard 路线待备材料

1. **主体与账户：** 发行主体、已批准的 Hardware Developer Program 状态、可管理硬件提交的角色。首次注册涉及组织Entra ID管理员、可签协议的法定联系人及EV；此类协议/购买需要用户自己或授权代表处理。[注册要求](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/hardware-program-register)。目前只记unknown，不需要用户提供密码、令牌、私钥或PFX。
2. **源与权利：** 关闭13输入的实际贡献范围/EDID来源，确定完整许可证/notices；冻结生产输入及版本。研究包存在不代表已批准复用或再分发。
3. **提交容器：** 按官方 attestation 输入说明准备独立短目录（例如 `HeliosDisplayX64`，少于40字符，无特殊字符），同一子目录放DLL/INF/CAT/PDB；固定hash清单与适用OS/架构。完整CAB目录不放驱动文件在根；同一提交各驱动目录架构集合一致。文档列有ADK前提；现有WDK/MakeCab工具不代表全部提交环境已核验。[CAB与提交说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-attestation)。本轮没有生成或提交CAB。
4. **签名动作：** 优先遵循EV提供者的安全签名流程；签CAB使用SHA256，登记实际证书公有标识、有效期、timestamp和CABhash，不记录秘密。是否使用EV或已关联的其他Authenticode提交证书，按dashboard当前规则核查；若流程页面/实际portal限制不同，保留差异，不能默认为已接受。
5. **返回包重审：** Microsoft会重新生成CAT；保存实际submission ID、原/返回资产hash、链/EKU/时间戳、每个INF/DLL的CAT成员核验。验证安装包完整性与UMDF适用策略；不能用单个内核 `/kp` 结果代替用户态政策。签名通过也不证明模式、ACL、保活或更新回滚。[返回签名核验](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-validate)。
6. **实机前门槛：** 生成仅针对Aether身份的具体安装/卸载/更新/回滚影响清单，再取得相应机器授权；开发机严禁重启或关机。需要这些操作的验证保持未执行，不借导入自签根/关闭安全策略跨过门槛。

## 何时需要用户信息

此轮整理和构建无需账户信息，故不提前索取。只有决定进入实际签名提交时，需要用户说明**发行主体、Hardware Developer Program是否已批准、是否有可用且已关联EV证书、签名提供者/授权角色**的非秘密状态；届时再针对真实缺口询问。不把账户未知理解为唯一阻碍：许可/EDID与真实目标机证据仍需继续关闭。providerAdmitted=false，formalSignatureObtained=false，03-02/03-03保持阻断。
