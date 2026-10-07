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

Phase 1 已生成 [逐文件来源与许可候选](../docs/baseline/sources.json) 和 [来源/发行审计](../docs/SOURCE-AUDIT.md)。固定树共 2,964 个 blob 文件及 42 个 gitlink；索引完整不等于内部依赖或生产授权完整。每个文件有固定 commit/blob、候选许可或明确阻碍；嵌入二进制有 SHA256，未初始化子模块没有虚构内部文件证据。

Aether 项目许可证与生产复用/发行意图待用户具体决定；当前所有上游文件均 research-only，没有生产复制、链接或再分发批准。Qt LGPL 目录、WiX 主题、OpenSSL/FFmpeg 静态库、图片/商标及动态下载分别留有审查记录。Apollo SudoVDA 的固定 INF 引用 DLL，但该 DLL 及完整驱动源码/独立授权未在固定树中核实；CAT/CER 并不等于已验证生产签名。三个虚拟设备候选的包、签名和默认配置安装分别在 Phase 3–5/39 关闭。

这些嵌套 Git checkout 已由根 .gitignore 排除；planning.sub_repos 保持空，产品代码只在 Aether 主仓库维护。[sync-upstream.ps1](../scripts/sync-upstream.ps1) 检查现有 URL、HEAD、独立 checkout 与 dirty 状态，拒绝重解析路径，Git 查询每项限时 15 秒；不覆盖用户改动。没有递归子模块恢复或隐式安装。

从 Aether 根执行离线核验：

```powershell
pwsh -NoProfile -File scripts/sync-upstream.ps1 -VerifyOnly
node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md
node --test tests/baseline-sources.test.cjs
```

`-VerifyOnly` 缺仓库、dirty 或 URL/SHA 不符均非零，绝不联网恢复。需要恢复缺失顶层 checkout 时显式执行 `pwsh -NoProfile -File scripts/sync-upstream.ps1 -RepositoryName moonlight-common-c`；原九个 URL/SHA 保持不变。重新索引固定对象使用 `node scripts/validate-baseline.cjs --index-sources --sources --report docs/SOURCE-AUDIT.md`，保留人工注释/决定与手工未决证据；陈旧锚点会使验证失败，失败不覆盖已有报告。默认无参数全基线入口须等 01-03 完成，当前使用 `--sources`。
