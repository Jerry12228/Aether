# 参考源码清单

2026-10-07 已克隆九个参考仓库。完整 SHA 见 [upstream-lock.json](upstream-lock.json)。浅克隆，无递归子模块，仅源码研究，尚未构建。

| 目录 | 来源 | 固定提交 | 根许可文件（逐文件审计待完成） |
|------|------|----------|------------------------------|
| apollo | [upstream](https://github.com/ClassicOldSong/Apollo) | adc5c5a0bd80831ce495434bb16aee2cd4175fb8 | GPL-3.0-family; file-level audit pending |
| moonlight-android | [upstream](https://github.com/moonlight-stream/moonlight-android) | b48494cb96bff23d8886c4775cc4f39a1075495d | GPL-3.0-family; file-level audit pending |
| moonlight-common-c | [upstream](https://github.com/moonlight-stream/moonlight-common-c) | f900dd4767759c7b9d0e93bcea666b55c69ea62f | GPL-3.0-family; file-level audit pending |
| moonlight-ios | [upstream](https://github.com/moonlight-stream/moonlight-ios) | 02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a | GPL-3.0-family; file-level audit pending |
| moonlight-qt | [upstream](https://github.com/moonlight-stream/moonlight-qt) | de2467e433821664cdd2224aad8c89a625be1ad9 | GPL-3.0-family; file-level audit pending |
| sunshine | [upstream](https://github.com/LizardByte/Sunshine) | 7c23c32925d26c3ee7c33b25b2b0db75e35d561b | GPL-3.0-family; file-level audit pending |
| virtual-audio-driver | [upstream](https://github.com/VirtualDrivers/Virtual-Audio-Driver) | bb34fba15faf569a6ae9bdea360bc1cf4821354e | MIT; file-level audit pending |
| virtual-display-driver | [upstream](https://github.com/itsmikethetech/Virtual-Display-Driver) | d7244969b2aa8bb38e76d79505eda217996cefea | MIT; file-level audit pending |
| windows-camera | [upstream](https://github.com/microsoft/Windows-Camera) | 626f8b19c5f367602f2e89c6b314573d3776c9df | MIT; file-level audit pending |

生产复用前在 Phase 1 逐文件确认来源、许可和渠道分发条件。Aether 当前仅文档，项目许可证待来源与复用方案确定。Apollo 内 SudoVDA 接口和打包资产不能作为完整驱动源码或独立授权的证据。

这些嵌套 Git checkout 已由根 .gitignore 排除；planning.sub_repos 保持空，产品代码只在 Aether 主仓库维护。恢复使用 scripts/sync-upstream.ps1，它检查现有 SHA，不覆盖已有改动；需要构建参考工程时再初始化其所需子模块。
