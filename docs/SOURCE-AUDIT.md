# 来源与发行审计

证据采集：2026-10-07T07:21:36.613Z。范围：子集；未完成全九仓。

结构校验 PASS；生产复用批准：无。逐文件索引见 [sources.json](baseline/sources.json)，固定来源见 [upstream-lock.json](../references/upstream-lock.json)。

| 仓库 | 固定 SHA | blob 文件 | gitlinks | 工作树 |
|---|---|---|---|---|
| moonlight-common-c | f900dd4767759c7b9d0e93bcea666b55c69ea62f | 43 | 2 | clean |

所有文件为 research-only；根许可仅候选证据，未知范围及缺失子模块内部源码保持阻断。FFI/C ABI 边界不自动免除组合义务。

## 固定锚点

- moonlight-common-c:root-license：`moonlight-common-c@f900dd4767759c7b9d0e93bcea666b55c69ea62f:LICENSE.txt:1`，blob `03dfa3ef8f18c254968ccccd2df010f74d6344eb`；GPL-3.0-or-later，unresolved。

## 外部来源

| ID | 类型 | 路径 | URL / 固定值 | 状态 |
|---|---|---|---|---|
| moonlight-common-c:gitlink:enet | gitlink | enet | https://github.com/cgutman/enet.git / aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1 | absent |
| moonlight-common-c:gitlink:nanors | gitlink | nanors | https://github.com/sleepybishop/nanors.git / b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a | absent |

## 发行候选



## 人类决定



## 未决阻碍

- **moonlight-common-c:gitlink:enet:unverified**：enet gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-common-c:gitlink:nanors:unverified**：nanors gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-common-c:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。

## 复现

从 Aether 根运行 `pwsh -NoProfile -File scripts/sync-upstream.ps1 -VerifyOnly` 和 `node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md`。缺 checkout 时显式恢复；不初始化子模块、不 reset 用户改动。

BASE-02 边缘穷尽性仍 unclassified/unresolved；两条 descriptor-less prohibitions 仍 flagged-unverified。结构 PASS 不等于法律、组合发行或平台支持判断。
