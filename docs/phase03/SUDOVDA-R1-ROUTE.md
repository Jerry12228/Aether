# R1 准入续行与 SudoVDA 路线提案

2026-10-08。用户「继续，需求已更新」授权恢复 Phase 3 的准入工作。当前 [需求 R1](SUDOVDA-REQUIREMENTS-REVISION.md)已经进入校验器；[新档案](PROVIDER-ADMISSION-R1.json)区分 Win10 七屏 SDR 和 Win11 D2 HDR。旧档案、用户 `2` 的决定和旧摘要保留为历史记录，新档案需要独立路线审阅。

## 本轮取得的实际证据

官方 SudoMaker/SudoVDA HEAD 仍为 `a4b09fa2aa731a964d0cb5d139cb1e6240e4da12`；2026-10-08T14:23:46Z 的 releases API 返回空数组。Apollo 官方 release v0.4.6 提供完整 NSIS 安装器，没有单独 driver-only asset。本轮将**只读审计**下载预算从 1 MiB 调整为 20 MiB、仍限制 30 秒：实际 17529901 bytes / 28741ms，SHA256 `42b2aefaacb3474511517a56b96ee9f0517f30ac38b5dd2fda9fd5b478f5021a` 与官方 asset digest 一致。此调整不授权安装下载或系统动作。

使用已安装的 7-Zip 静态提取六个指定 SudoVDA 文件；未运行安装器、DLL 或脚本，也未提取/运行设备安装工具。DLL 为 83216 bytes / SHA256 `47ee263cb5de9382c6630a2d7f3dafec4a49419f953beec869ca5dd0c460ff63`。INF DriverVer 为 `07/14/2025,1.10.9.289`；INF/CAT/CER/安装与卸载脚本与固定 Apollo 参考树逐字节对应，驱动实现与这些二进制的构建对应关系仍缺。

INF 与 DLL 分别执行 SDK28000 signtool `verify /pa /v /c`，均退出 1：证书链终止于不受信任根，签名主体 CN=sudovda@su.mk，没有时间戳。静态可见签名不代表通过信任策略；本轮不将 CAT 成员或政策标为 verified。安装脚本仍导入 Root/TrustedPublisher，并按通用硬件 ID 删除旧 SudoVDA 设备。它不满足当前「不改信任策略、不碰 foreign 资源」方案，不能直接作为 Helios 安装器使用。

新增固定许可来源：微软 Windows-driver-samples `2dc3fd3a0cc84a2933f2194e7ec0871584979071` 的 LICENSE 为 MS-PL；被 SudoVDA README 致谢的 edid-generator `476a016d8b488df749bf6d6efbf7b9fbfb2e3cb8` 的 LICENSE 为 GPLv3。SudoVDA 作者对自身修改给出许可声明，并不自动覆盖继承代码或生成内容。上述仓库许可事实只定位后续逐文件来源/notice 审计入口；未证明生成的 EDID 必然适用何种许可，也未作项目兼容性或整包再分发结论。API/包/文件/签名日志摘要见 [证据清单](SUDOVDA-R1-AUDIT.json)。

## 推荐的独立派生路线（待用户决定）

直接使用当前原包仍受不可信签名、WD 读写 ACL、缺源码对应与完整 notices 阻断。建议从固定 SudoVDA 源码准备 **Aether 专属派生驱动**，修改范围仅限下面的显示 provider 与包维护边界；不改用其他传输栈，也不增加常驻 Ping：

| 边界 | 具体拟议修改 | 需要的证明 |
|---|---|---|
| 设备/包身份 | 新硬件 ID `Root\Aether\HeliosDisplay`、新 INF/DLL/service、独立接口 GUID 与 WUDF DeviceGroupId；不匹配 SudoMaker/Oray | install plan 和负例证明不能更新/删除 foreign ID；实机仍待授权 |
| 配置 | 独立 `HKLM\SOFTWARE\Aether\HeliosDisplay`，首次启用前显式 watchdog=0，保存旧值/回滚方案 | 源码读取专属路径；对应包回读及有界跨进程保活实证 |
| 安全 | INF ACL 初始限制为 SYSTEM/Administrators，去掉 WD；原型 mutation 明确要求提权，OS SID 与登记所有权仍校验 | 非管理员不能直接打开/发送 mutation；管理员属于主机可信边界，不把 GUID 当密钥。后续普通客户端权限经 Helios 协调器承接，不承诺当前原型已完成该功能 |
| 接口 | 查询协议不刷新 watchdog；有界 IOCTL/错误与逐 GUID 增删合同；保留完整接口清单 | 真实构建、接口负例及故障证据；不提前批准开启未知接口 |
| 来源/许可 | 逐文件比对微软样例/其他来源、保留 notices；未闭合范围先停复用或提出明确重写替代 | 完整来源清单及具体生产复用依据；不把 README 作者修改许可扩张到全部文件 |
| 包/签名 | 固定构建输入、版本、全部成员hash与签名流程；正式渠道包满足适用默认安全策略 | 本地 unsigned/test 包只算研究构建，不能准入安装或关闭 VDP。不得导入自签根或关闭系统安全策略作为正式结论 |

该路线会增加自有驱动维护与签名责任，属于原 03-01-03 的关键技术决定；当前只是可审阅提案，没有复制上游源码到产品或修改驱动。批准该路线只允许准备上述源码/许可/构建方案，不等于允许安装、重载、registry 写入、reset、更新或宣称生产支持。

另一个选项是继续等待/审计上游提供**受限 ACL、完整源码/包对应与默认可信签名**的包，保持当前纯查询实现。未获得新材料时不会产生可接入候选；单独取消 Win10 HDR 无法关闭这些门槛。

## 当前执行状态

R1 校验支持两个平台完整七屏请求，精确有理数比较采用整数交叉乘积，接受 60000/1000，拒绝 60000/1001、零分母、非整数与越界输入。所有 schema1 历史门禁和安全/来源负例保留；R1 文档 hash 不匹配或 Win11 HDR 被抹掉均拒绝。

仍无合格 provider，03-02/03-03 保持阻断；VDP-01/02 与 Phase 3 未完成。下一步在本新档案摘要上记录「独立派生路线」或「继续上游补证」的具体决定，再按获准范围准备准入证据。默认安全实机安装、四组独立内容/删除隔离、实际保活、Win10/Win11 与 Win11 HDR仍留在对应系统授权和最终验收门槛中。

官方来源：[Apollo v0.4.6](https://github.com/ClassicOldSong/Apollo/releases/tag/v0.4.6)、[固定 SudoVDA](https://github.com/SudoMaker/SudoVDA/tree/a4b09fa2aa731a964d0cb5d139cb1e6240e4da12)、[固定微软许可](https://github.com/microsoft/Windows-driver-samples/blob/2dc3fd3a0cc84a2933f2194e7ec0871584979071/LICENSE)、[固定 EDID 工具许可](https://github.com/akatrevorjay/edid-generator/blob/476a016d8b488df749bf6d6efbf7b9fbfb2e3cb8/LICENSE)。具体运行事实以清单记录的包字节和审计日志为准。
