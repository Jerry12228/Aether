# HeliosDisplay 来源与 EDID 补证

2026-10-09，03-01 已批准独立派生路线的研究续行。固定 SudoVDA `a4b09fa2aa731a964d0cb5d139cb1e6240e4da12`，不修改参考树、旧准入决定或档案摘要。13 个输入的 hash、GitHub 固定 ref 的逐路径历史、改名之前历史及原响应 hash 见 [机器记录](HELIOS-DISPLAY-PROVENANCE.json)。历史提交作者是追踪线索，不自动证明版权或重许可权。

## 已取得的来源事实

| 输入 | 取得的历史 | 仍需关闭的具体事项 |
|---|---|---|
| Driver.cpp / Driver.h / Trace.h / INF / vcxproj / filters | `46a04eb` 从 HDR/IddSampleDriver 改名；`85c56c3` 从根 IddSampleDriver 重组；原路径回到 `8ca800d`（2017）。Trace.h 与该最早历史字节完全相同；其他文件历经多位贡献者修改 | 微软准确祖先及其当时授权、后续贡献范围与 notices；不可把改名者算成全部作者 |
| SudoVDA.sln | 改名提交添加新 solution，前代 solution 历史也已取得 | 新建/复制构建结构的来源范围仍需核对 |
| AdapterOption.h | 起始 `3e911fa`（Sajid），随后 Joakim Sandström 三个修改提交、Yukino Song 的 Track upstream | 早期贡献不能仅凭 SudoMaker 对自己修改的声明统一重许可 |
| sudovda-ioctl.h | 当前路径三个提交均为 Yukino Song，最早 `f56946d` | 更名前结构/复制来源仍未逐行闭合；保留作者声明，不推断全部独创 |
| README.md | 当前许可声明只针对作者自己的 changes；历史延伸到原样例 | 保留完整 README、原署名和适用许可文本；历史/致谢不等于完整授权 |
| option.txt | 重组之前回到 ge9 的 `218cdbb`（2021） | 贡献归属和可分发依据，不能计入 SudoMaker 的 blanket grant |
| 8K240HzHDR.edid | `963c13e`（Mike Rodriguez，2023）添加，`85c56c3` 仅改路径；当前 384 字节与最早文件完全相同 | 生成输入和模板来源未附于该提交；致谢工具不是精确生成证据 |
| edid.h | `772a05f`（2024 Track upstream）添加 helper，后有改名、serial 字符串与模板/HDR 修改 | 实際模板来源及 helper 贡献边界；当前内嵌数组与独立文件不同 |

GitHub per-path API 当前路径每页均未出现 next 链接，但 API 不自动 follow rename。因此记录额外查询的前代路径；“分页取得完整”仅指该路径 API 结果，不能理解为整仓库逐行权利审计完成。原响应留在忽略的 artifacts；历史和 hash 摘要进入 Git。没有调用联系人或提交 issue 请求授权。

## EDID 的新证据

驱动 `Driver.cpp` 实际调用 `generate_edid`，并按 `sizeof(edid_base)` 提交/核对描述；编译的是 `edid.h` 中 **256 字节**数组。独立 `8K240HzHDR.edid` 是 **384 字节**，二者不同。当前数组两个 128 字节块校验和均为 0，这只证明结构的这一项检查，不证明显示模式/HDR功能或许可。

固定工具 [edid-generator](https://github.com/akatrevorjay/edid-generator/tree/476a016d8b488df749bf6d6efbf7b9fbfb2e3cb8) 的树没有对应 8K240HzHDR 模板。根 LICENSE 是 GPLv3，而实际 `edid.S` 文件保留 Copyright 2012 Carsten Emde 与 **GPL-2.0-or-later** 文件声明。README 说明生成程序会汇编模板并填入参数，故需辨别实际输出是否含有受保护模板内容，不能只引用“工具输出通常不受 GPL”关闭此项。[GNU 的输出说明](https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL)。

完整工具 LICENSE、模板声明和固定微软 MS-PL 已保存并 hash 固定；旧研究树原 notices 保留。研究材料可用于审阅，尚未自动进入产品包。微软 [MS-PL](https://github.com/microsoft/Windows-driver-samples/blob/2dc3fd3a0cc84a2933f2194e7ec0871584979071/LICENSE) 与 [GNU 兼容性说明](https://www.gnu.org/licenses/license-list.html#ms-pl) 不支持用项目 GPL 候选覆盖混合派生代码。独立包装仍需实际文件贡献/义务闭合。

## 结论与可继续路径

来源追踪更具体，**licenseClosed=false，productionReuseApproved=false**。不要把历史作者列表、校验和、README 的声明或完整许可文本存在记为整包授权。剩余动作是逐行贡献核验与 notices，及 EDID 精确生成输入补证；如无法取得，可在同一研究路线中独立编写替代 EDID/helper，再针对完整 SDR/HDR 契约验证，避免继承不明模板。替代将改变实际驱动输入，应另外留下源/模式证据，不能凭一个“独立编写”标签宣称完成。

provider 保持未准入，03-01 SUMMARY 保持 halted，03-02/03-03 不启动；本次没有安装、设备 IOCTL、registry/证书/安全策略或机器电源操作。
