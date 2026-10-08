# Aether 专属 SudoVDA 派生准备结果

2026-10-08。用户原文 `1` 已选择 [R1 提案](SUDOVDA-R1-ROUTE.md)中的独立派生准备路线；[决定](PROVIDER-ADMISSION-R1.json)记录于 2026-10-08T15:18:55Z，仍绑定档案摘要 `0e2010bd2143013fbbc62d0be3cad622020024594562c8521370ff36bcf0d116`。原提案及其 hash 保持不变，本文件记录批准后的实际工作。

用户另明确「严禁重启、关闭开发机」。该限制持续适用；本轮没有安装、重载、停止驱动/服务、发送 provider IOCTL、修改 registry、导入证书、更改安全策略、重启或关机。需要重启的后续检查保持未执行，不自动安排重启。

## 已完成的研究准备

[准备脚本](../../scripts/prepare-helios-display-research.cjs)从固定 SudoVDA `a4b09fa2aa731a964d0cb5d139cb1e6240e4da12` 重建私有研究树。13 个输入均核对长度、SHA256、Git blob SHA1；所有变换先在内存核验固定锚点，再写入新的 `artifacts/phase03/derived-research/helios-*` 目录。原参考树和原下载字节未修改；上游源码、生成的 DLL/CAT 没有进入产品或 Git 提交。脚本只接受 `--prepare-unsigned-research`，不提供安装或系统操作入口。

五个文件发生变换，输入与输出逐文件 hash 及实际包/日志 hash 见 [准备证据](HELIOS-DISPLAY-PREPARATION.json)。这是当前研究构建的来源追踪，不承诺不同机器构建得到相同二进制 hash。

| 范围 | 研究树中的实际修改 | 证据边界 |
|---|---|---|
| 身份 | 唯一 root hardware ID `Root\Aether\HeliosDisplay`；去掉第二个通用 ID；DLL/service/DeviceGroupId/CAT 使用 HeliosDisplay；新设备接口 GUID `0d9ecbde-124e-45f0-9ae0-3d71b16a7725`，独立 ETW GUID | 源码、INF 和编译产物已核对；未安装验证 |
| 配置与保活 | 改读 `HKLM\SOFTWARE\Aether\HeliosDisplay`；watchdog 默认 0；查询不再刷新 watchdog | 未写 registry；配置回读、跨进程保活仍待授权实机证据；其他已公开 mutation 接口仍须后续策略控制 |
| ACL | INF 使用 `D:P(A;;GA;;;SY)(A;;GA;;;BA)`，去掉 WD 普通用户读写 grant | 只证明包声明；非管理员打开/IOCTL、实际 OS ACL、组所有权隔离尚未验证；管理员属于可信边界 |
| 错误处理 | Departure 失败时保留登记/connector；MMCSS handle 非空检查及撤销失败记录；测试 monitor GUID 生成失败提前返回；补齐 IddCx callback 类型声明 | 真实静态分析编译通过；设备故障注入仍待执行 |
| 版本与构建 | 显式 `0.1.0.0`、INF 日期 10/08/2026；SignMode Off、EnableTestSign false、GenerateTestCertificate false | 没有生成/导入测试证书；未取得正式签名 |

## 实际构建结果

固定原源码的首次构建失败有两层原因：32 位 MSBuild 尝试加载本机 WDK 缺少的 x86 InfVerif.dll；换成现有 64 位 MSBuild 后工具正常，但原源码忽略 `IddCxMonitorDeparture` 返回值，C6031 被 /WX 拒绝。无需重装 WDK。派生研究构建随后暴露 callback SAL、MMCSS 空 handle、CoCreateGuid 返回值问题，已逐项修正；失败日志保留，未关闭告警检查冒充成功。

最终使用 MSBuild **18.10.1.42706 amd64**、WDK **10.0.28000.0**（assembly 10.0.28000.2526）、现有 MSVC 工具链完成 **Release x64**，退出 0。编译命令日志含 `/WX` 和 `/analyze`；项目 EnablePREfast 保持 true。MSBuild 的 `RunCodeAnalysis=false` 没有关闭项目这一静态分析入口。Inf2Cat signability 与目录生成报告 errors/warnings 均为 0。

InfVerif 仍报告 **2084 warning**：继承 INF 直接声明 Windows inbox `WUDFRd.sys`。微软说明 Win11 有系统 `WudfRd.inf` 的 Include/Needs 方式，Win10 没有该 INF，仍需 AddService 方式；生产包必须保留 Win10 路径并核验平台区分，不能直接采用仅 Win11 的模板提高主机下限。本次没有复制系统 SYS 或绕过警告。[微软 2084 说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/inf-verif-error-2084)、[reflector 平台差异](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/adding-the-reflector)。

| 实际包成员 | 字节数 | SHA256 |
|---|---:|---|
| HeliosDisplay.inf | 3886 | `9c31e7430585af2422044d80ba9525d26f587cd64b2f31ef82544645685a6a00` |
| HeliosDisplay.dll | 129536 | `40db0d38b0e838d67c0514737a85fd383e39311ac010784671f238278db8f203` |
| heliosdisplay.cat | 1336 | `302e70d60cd869f3effaeee3b0eb67f9e636a670dd80f658ac4060209cca57d0` |

Get-AuthenticodeSignature 对 DLL/CAT 返回 NotSigned，对 INF 返回 UnknownError，三者均无 signer；不将 INF 的 UnknownError 改写成签名通过。目录生成不是签名或可信安装证据。IDD 是第三方 UMDF/IddCx 用户态驱动，WUDFRd/IndirectKmd 为 Windows 系统组件，不新增 Aether 自有内核驱动。[微软 IDD 模型](https://learn.microsoft.com/en-us/windows-hardware/drivers/display/indirect-display-driver-model-overview)。

可复现研究步骤（只生成新目录和编译，不执行生成物）：

```powershell
$prep = node scripts/prepare-helios-display-research.cjs --prepare-unsigned-research
if ($LASTEXITCODE -ne 0) { throw 'Source preparation failed' }
$tree = ($prep | ConvertFrom-Json).output
& 'C:/Program Files/Microsoft Visual Studio/18/Enterprise/MSBuild/Current/Bin/amd64/MSBuild.exe' `
  (Join-Path $tree 'Virtual Display Driver (HDR)/SudoVDA/SudoVDA.vcxproj') `
  /t:Build /p:Configuration=Release /p:Platform=x64 `
  /p:WindowsTargetPlatformVersion=10.0.28000.0 /p:SignMode=Off `
  /p:EnableTestSign=false /p:GenerateTestCertificate=false `
  /p:RunCodeAnalysis=false /p:DriverDeployment=false /m:1 /nologo /v:minimal
if ($LASTEXITCODE -ne 0) { throw 'Research build failed' }
```

仅当前 Win11 工作站 x64 Release 构建获得证据；Win10 运行、Debug/ARM64 构建、七屏真实模式、Win11 HDR、故障/更新/回滚不由此次构建证明。

## 逐文件许可处置

[JSON 清单](HELIOS-DISPLAY-PREPARATION.json)包含全部 13 文件的输入 hash、作者声明适用边界、匹配块位置/摘要和生产复用未批准标志。与固定微软样例 `2dc3fd3a0cc84a2933f2194e7ec0871584979071` 比较连续非空行、只归一化空白：Driver.cpp 最长匹配 55 行（568–634 / 样例289–355），Driver.h 33 行（40–78 / 51–89），Trace.h 44 行（1–59 / 1–59）。匹配证明存在共享文本，不证明此微软提交就是准确祖先，也不替代完整版权归属审计。

| 文件集合（完整 13 项） | 当前许可证据 | 生产前具体处置 |
|---|---|---|
| Driver.cpp、Driver.h、Trace.h | 微软共享文本；Driver.cpp 保留 Microsoft copyright；固定微软 LICENSE 为 MS-PL | 确定实际继承提交/修改贡献范围；完整附带 MS-PL 与原 notices；不要仅按 SudoVDA 作者声明重许可 |
| SudoVDA.inf、SudoVDA.vcxproj、SudoVDA.sln、SudoVDA.filters | 微软样例构建/包结构及 SudoVDA 修改；逐行祖先未闭合 | 保留原 notice，追踪实际贡献；生产模板调整与 Win10/11 分支单独审阅 |
| Common/Include/AdapterOption.h、Common/Include/sudovda-ioctl.h、option.txt、README.md | 固定 README 声明其作者修改可选择 MIT/CC0/Public Domain；没有完整逐文件贡献映射 | 固定历史归属，选择并附带适用的完整许可/署名，不扩张作者授权范围 |
| 8K240HzHDR.edid、edid.h | README 致谢 edid-generator；固定工具 LICENSE 为 GPLv3；生成输入和 helper 来源未闭合 | 明确模板/生成数据/辅助代码来源，或独立编写合规 EDID；工具 GPL 不能直接推断全部生成物 GPL 或无需许可 |

微软 [MS-PL 原文](https://github.com/microsoft/Windows-driver-samples/blob/2dc3fd3a0cc84a2933f2194e7ec0871584979071/LICENSE)要求保留 notices，源代码分发附完整 MS-PL。GNU 将 [MS-PL 列为 GPL 不兼容](https://www.gnu.org/licenses/license-list.html.html#ms-pl)；因此项目的 GPL 候选不能自动覆盖这份派生驱动，也不能直接把 GPL 代码链接进此 DLL。驱动独立许可/独立打包、协议边界是否适用仍需具体生产方案核验，本轮未作整包兼容性或发布结论。[GNU 对生成输出的说明](https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL)区分工具和实际复制进入输出的内容；这份 EDID 的归属仍待查明。

上游 README 同时致谢 roshkins、baloukj、MTT 及 helper/build 贡献者，并声称途中重写。致谢不能证明当前文件含其代码，重写声明也不能免除逐文件追踪；研究树保留 README 和现有署名。生产复用/再分发清单仍为空，没有将未知贡献写成已获许可。

## 签名与交付准备清单

本轮完成渠道和输入方案，不申请账户、不购买证书、不上传包或公开源码。现有 Apollo 自签根不采用；研究产物保持 unsigned。

1. 关闭逐文件继承/EDID/license/notices，固定生产源与构建输入；解决平台适用的 INF 包结构。保持 Win10 七屏 SDR / Win11 D2 HDR，最低 build 由实测锁定。
2. 确认发行主体、Hardware Dev Center/Partner Center 账户及关联的有效 EV 证书。微软要求 dashboard 账户关联 EV；提交可用关联的 Authenticode 证书，签名用 SHA256。账户/证书目前未验证，不记录私钥或口令。[微软签名条件](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs)。
3. 为受控原型准备 attestation 提交候选输入：短且无特殊字符的包目录、固定 INF/DLL/未签名 CAT、成员 hash、适用 OS/架构、完整 notices、安装/回滚影响清单。当前微软文档把 attestation 限定于测试场景；它不等于 Windows Certified，也不支持面向零售用户的 Windows Update 发布。正式发布按适用 WHCP/HLK 途径准备测试和签名材料。[微软渠道说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/driver-signing-offerings)。
4. 获得返回的实际签名包后重新固定全部成员 hash，验证 CAT 成员/链/时间戳和 UMDF 适用政策；不能直接套用内核 /kp 诊断判定 UMDF。其他可信 CA 渠道也须取得适用政策和实际包证据，未预先排除或宣布通过。
5. 接入前生成具体安装/配置/更新/回滚方案，只针对 Aether 身份，列明风险与影响资源；经对应机器授权后才执行。开发机禁重启/关机持续有效，需要重启的安装或验证先退出并记录未完成，不能自动继续。也不能通过导入自签根、关闭安全策略或删除 foreign 驱动补齐证据。

上述 1–4 是可审阅的签名准备依赖；当前没有正式可信签名包，不能把方案当作执行通过。

## 验证与阶段状态

最终针对性测试：research 入口边界 1 项、包准入/R1 9 项、planning 1 项，共 **11/11**，无 skip，364.90ms。入口拒绝空参数、install、restart、shutdown 和附加 install flag，退出 2 且不生成输出。原案与 R1 require-decision 均通过；五候选 admission 和 system authorization 仍按预期拒绝。实际核验47个源/包/日志等摘要、11个本地链接，并验证输入锚点漂移会拒绝变换；全规划42阶段/105需求映射通过。

用户 `1` 的路线决定已经完成，不再等待同一批准；本次研究准备完成，**provider 仍未准入**。03-01 SUMMARY 保持 halted，03-02/03-03 未启动，VDP-01/02 和 Phase 3 保持未完成。后续工作的具体缺口是许可来源/EDID、正式签名条件、平台 INF 和受控实机证据；机器操作必须遵守已记录授权范围及禁重启/关机限制。
