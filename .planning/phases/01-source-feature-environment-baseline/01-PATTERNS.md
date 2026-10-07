# Phase 1: 来源、原功能与环境基线 - Pattern Map

**Mapped:** 2026-10-07
**Files analyzed:** 17 个建议新增/修改文件；最终命名由 planner 确定。
**Analogs found:** 13 / 17（exact 4；role-match 9；无匹配 4）

本阶段无 CONTEXT.md，依据已批准约束和 01-RESEARCH.md。greenfield 仓库没有生产实现模式；以下全部是工具、数据或文档模式。已通过 `git ls-files scripts references/upstream-lock.json docs` 核验所有 analog 均为主仓库 tracked 文件。忽略的参考 checkout 只能作为被审计证据，不能成为产品实现 analog。

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `references/upstream-lock.json` | config | file-I/O | 本文件 | exact |
| `scripts/sync-upstream.ps1`（仅确有需要时修改） | utility | batch/file-I/O | 本文件 | exact |
| `docs/baseline/sources.json`（建议） | model | file-I/O | `references/upstream-lock.json` | role-match |
| `docs/baseline/features.json`（建议，含设置覆盖） | model | file-I/O | `references/upstream-lock.json` | role-match |
| `scripts/validate-baseline.cjs` | utility | batch/transform | `scripts/validate-planning.cjs` | role-match |
| `scripts/doctor.ps1` | utility | batch/file-I/O | `scripts/sync-upstream.ps1` | role-match |
| `docs/baseline/environment.json`（建议） | model | file-I/O | `references/upstream-lock.json` | role-match |
| `docs/baseline/measurement.schema.json`（建议） | model | transform | 无 | none |
| `docs/SOURCE-AUDIT.md`（建议） | utility（文档） | transform | `docs/FEATURE-PARITY.md` | role-match |
| `docs/FEATURE-PARITY.md` | utility（文档） | transform | 本文件 | exact |
| `docs/PLATFORM-MATRIX.md` | utility（文档） | transform | 本文件 | exact |
| `docs/DEVELOPMENT.md` | utility（文档） | transform | `docs/PLATFORM-MATRIX.md` | role-match |
| `docs/MEASUREMENT-PLAN.md`（建议） | utility（文档） | transform | `docs/PLATFORM-MATRIX.md` | role-match |
| `docs/BASELINE-REVIEW.md`（建议） | utility（文档） | transform | `docs/FEATURE-PARITY.md` | role-match |
| `tests/baseline-sources.test.cjs` | test | batch/file-I/O | 无 | none |
| `tests/baseline-features.test.cjs` | test | batch/transform | 无 | none |
| `tests/doctor.test.cjs` | test | batch/event-driven | 无 | none |

## Pattern Assignments

### 来源锁、来源/功能/环境数据

**Analog:** `references/upstream-lock.json:2-4,7-14`。复制 schemaVersion、采集日期、用途和显式待审状态的结构，不能复制根许可证标签作为逐文件批准。

```json
  "schemaVersion": 1,
  "capturedAt": "2026-10-07",
  "purpose": "Local source research; not production dependencies"
```

数据仍使用 JSON；新增条目建议有稳定 ID、repo/commit/path/blob、原文/符号/行范围、证据状态与未决项。来源列表、gitlink、设置覆盖、需求/阶段/测试案例等新增字段遵循 RESEARCH 的设计建议，不冒称已有 schema。输出排序确定；环境数据只记录白名单字段，不提交私密环境值。

### `scripts/validate-baseline.cjs`

**Analog:** `scripts/validate-planning.cjs:1-5`（imports/root）；`:27-31`（唯一主要阶段）；`:46-47`（错误输出）。

```javascript
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
```

```javascript
for(const id of ids){
 const m=mappings.filter(r=>r.id===id), t=rows.filter(r=>r.id===id);
 if(m.length!==1||t.length!==1||m[0]?.phase!==t[0]?.phase)errors.push(`${id} mapping mismatch`);
}
```

```javascript
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
```

沿用 CJS、`node:` 内置 imports、相对脚本确定 root、聚合诊断和非零退出。抽取可测试纯函数再由 CLI 调用；不要原样复制只匹配 Pending 的 Markdown 正则作为永久状态模型。原 validator 的 `path.join`、`startsWith` 与存在性检查不够防路径逃逸：新审计入口必须验证绝对/真实路径边界，并从锁定 Git 对象取证。

### `scripts/doctor.ps1` 与可选同步入口调整

**Analog:** `scripts/sync-upstream.ps1:1-4,11-17`。

```powershell
param([string]$RepositoryName)
$ErrorActionPreference = 'Stop'
$aetherRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$aetherLock = Get-Content -LiteralPath (Join-Path $aetherRoot 'references/upstream-lock.json') -Raw | ConvertFrom-Json
```

```powershell
$aetherExpected = [IO.Path]::GetFullPath((Join-Path $aetherRoot ('references/upstream/' + $aetherRepo.name)))
$aetherTarget = [IO.Path]::GetFullPath((Join-Path $aetherRoot $aetherRepo.path))
if ($aetherTarget -ne $aetherExpected -or $aetherRepo.name -notmatch '^[a-z0-9-]+$') { throw 'Invalid lock path' }
```

doctor 复制脚本根路径、`aether` 变量前缀、LiteralPath、明确参数的模式；参数应改为 doctor 自己的模式/输出选择。sync 的 `& git -C ...` 与 `$LASTEXITCODE` 检查（15-19）证明必须记录真实退出，但没有超时/输出上限/取消实现。按 RESEARCH Pattern 4 新建可注入、有界 runner；失败、缺失、超时、未测分别报告。sync 20 行仅警告 dirty：不能把警告视作正式来源审计通过；不得 reset 改动。doctor 不复制 sync 25-33 行下载行为。

### 功能、来源审计与阶段审阅文档

**Analog:** `docs/FEATURE-PARITY.md:3-7,9-10,26-30`。

```markdown
| 能力族 | 初步来源锚点 | 规划验收阶段 |
|--------|--------------|--------------|
```

沿用开头日期/状态说明和 Markdown 表格，正式矩阵必须展开平台原子行、固定 SHA 锚点、适用条件、责任层、需求/阶段/测试案例和证据。SOURCE-AUDIT 与 BASELINE-REVIEW 沿用“初步/待审/已证实”的明确状态，再分别展示逐文件复用/发行结论和待用户审阅的具体决定；不要把能力族表当完成结果。遗漏原能力补入 v1，Apple 实机仅 VFY-01/02 延后。

### 平台、开发环境与测量方案文档

**Analog:** `docs/PLATFORM-MATRIX.md:5-18,28-36`；开发执行命令入口参照 `docs/DEVELOPMENT.md:30-36`。

```markdown
| 角色/平台 | 首版 | 原生职责 | 构建/验收环境 |
|------------|------|----------|--------------|
```

平台文档保留框架声明、原生条件、工具链构建、实机证据的区别。MEASUREMENT-PLAN 展开同设备/网络/分辨率/帧率/codec 的场景、采样步骤、原始记录、仪器缺口和 p50/p95/丢帧/jitter/资源指标；指标含义不能混用 RTT、overlay 和玻璃到玻璃。数值门槛留 Phase 6/10，schema 新建且未采集时不得填虚构值。DEVELOPMENT 写可执行命令、用途和限制，而非 PATH 找到即支持。

## Shared Patterns

- **错误/状态：** validator 46-47 行使用 stderr + exitCode；sync 16-20 行显式检测命令失败与 dirty。新增工具保留原始观测和标准化状态，未知不得转 PASS。
- **鉴权/守卫：** 此阶段是本地审计工具，无 HTTP/controller auth analog；守卫是白名单命令、锁定来源、路径边界与仅显式产物写入。不要建立产品认证或会话实现。
- **架构约束：** `docs/ARCHITECTURE.md:30-35,64-66` 保持 Flutter UI 与原生路径分离，参考目录不链接入产品；`docs/SESSION-MODEL.md:23-30` 的唯一租约及断连保活仅作为功能追踪约束。
- **文档证据：** 同期日期、固定来源、待验证状态、构建/实机分列；自动链接/计数成功不代表功能穷尽、法律批准或平台支持。

## No Analog Found

测量 schema 与三个测试文件没有现有 analog。按 RESEARCH 使用 Node `node:test` / `node:assert/strict`，纯函数注入、临时 Git fixture 和离线命令输出；测试错误 SHA、越界、dirty/gitlink 缺审计、无证据许可通过、重复能力/无锚点/错映射、超时/非零/shim/空输出及 Apple 伪实机完成。runner 超时与进程树取消也没有现成实现，不能从同步脚本推断已具备。

## Verification / Metadata

规划验收入口：`node scripts/validate-planning.cjs`；建议新增 `node scripts/validate-baseline.cjs --sources` / `--features`、三个 `node --test tests/*.test.cjs` 明确文件入口，以及 `pwsh -NoProfile -File scripts/doctor.ps1` 本机 smoke。fixture 离线；真实 deep probe 独立有界。阶段人审确认功能完整性、许可/发行未决项、平台范围和测量方法。

**Analog search scope:** tracked `scripts/`、`references/upstream-lock.json`、`docs/`；完整读取 8 个 analog/约束文件。无项目 `.codex/skills` 或 `.agents/skills` 可读索引。**Extraction date:** 2026-10-07。本文件只提供规划建议，未执行安装、产品实现或性能测量。
