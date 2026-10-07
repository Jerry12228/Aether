# Phase 2: Monorepo 与 Flutter/原生骨架 - Pattern Map

**Mapped:** 2026-10-07
**Files analyzed:** 16 个文件/文件组（最终文件名由 planner 细化）
**Analogs found:** 4 / 16；5 个已追踪 analog 文件

## File Classification

当前为 greenfield。下表新路径均为规划建议，不能写成已有实现；通配组覆盖生成文件和五平台文件，不预先制造目录或锁定依赖。

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| 根版本元数据与版本生成脚本（名称待定） | config / utility | transform, file-I/O | 无 | none |
| `CMakeLists.txt`、`CMakePresets.json` | config | batch | 无 | none |
| 根 workspace `pubspec.yaml` / `pubspec.lock` | config | batch | 无 | none |
| `native/core/` C 头、生命周期实现、CMake target | service / model | event-driven, request-response | 无 | none |
| `native/platform/` 五端接口、Windows 实现与其余占位 | provider | event-driven | 无 | none |
| `apps/helios/` 控制台、自检、CMake target | controller | event-driven, request-response | 无 | none |
| `packages/selene_native/` Dart FFI wrapper、生成配置与绑定 | utility / service | event-driven, transform | 无 | none |
| `packages/selene_native/` 五平台插件、Windows texture/surface | provider | event-driven | 无 | none |
| `apps/selene/` app、验证面板、平台 runner | component | event-driven | 无 | none |
| `scripts/build.*`（明确 target，名称待定） | utility | batch | `scripts/doctor.cjs`、`scripts/doctor.ps1` | role-match |
| `scripts/verify.*`（独立验证，名称待定） | utility | batch | `scripts/validate-planning.cjs` | role-match |
| `tests/` 构建/自检/退出码工具测试（名称待定） | test | batch | `tests/doctor.test.cjs`、`tests/planning.test.cjs` | exact |
| native CTest contract、真实 Dart DLL contract、widget/integration tests | test | event-driven, request-response | 无 | none |
| `.github/workflows/` Windows build/check workflow（名称待定） | config | event-driven, batch | 无 | none |
| `docs/DEVELOPMENT.md`、版本/依赖来源记录 | config | file-I/O | 无代码 analog | none |
| 呈现对照报告、原目标差异与 executor 责任记录（路径待定） | config | file-I/O | 无代码 analog | none |

## Pattern Assignments

### 目标构建入口：`scripts/build.*`

**Analog:** `scripts/doctor.cjs`（工具执行部分）、`scripts/doctor.ps1`（完整 1–6 行）。Node 导入习惯见 doctor.cjs:1–3：`'use strict'`、`node:` 内建模块、`__dirname` 推导根路径。

**Core process pattern**（doctor.cjs:18–21）：
```javascript
try{child=cp.spawn(launcher,args,{windowsHide:true,windowsVerbatimArguments:!!windowsVerbatimArguments,shell:false,stdio:['ignore','pipe','pipe']});}catch(e){error={code:e.code,message:e.message};finish(null);return;}
child.on('error',e=>{error={code:e.code,message:e.message};finish(null);});child.on('close',finish);
for(const stream of ['stdout','stderr'])child[stream].on('data',b=>{let previous=stream==='stdout'?stdout:stderr;if(previous.length+b.length>maxBytes)truncated=true;previous=Buffer.concat([previous,b.subarray(0,Math.max(0,maxBytes-previous.length))]);if(stream==='stdout')stdout=previous;else stderr=previous;});
timer=setTimeout(()=>{timedOut=true;cancel();},timeoutMs);
```
复用参数数组、独立 error/close、输出上限和超时语义；取消所属进程树见 doctor.cjs:15–17。构建需自行选择合理预算并将详细输出流式落盘；不要照抄环境探测的 5 秒上限，也不能只保存截断输出。

**PowerShell wrapper pattern**（doctor.ps1:2–6）：
```powershell
$ErrorActionPreference = 'Stop'
$doctorScript = Join-Path $PSScriptRoot 'doctor.cjs'
$nodeCommand = Get-Command node -CommandType Application -ErrorAction Stop | Select-Object -First 1
& $nodeCommand.Source $doctorScript '--mode' $Mode '--output' $Output
exit $LASTEXITCODE
```
替换为明确的 Helios/Selene 参数；保留路径参数传递和退出码。doctor 的 `.cmd/.bat` 白名单仅允许固定版本查询（doctor.cjs:10–14），不能直接拿它启动任意 `flutter build`；需另行实现并验证带空格路径和安全参数传递。

### 独立验证入口：`scripts/verify.*`

**Analog:** `scripts/validate-planning.cjs:46–49`。函数返回结构化结果，CLI 非零表达失败，导出允许测试直接调用。
```javascript
module.exports={validatePlanning,cli};if(require.main===module){try{cli();}catch(e){console.error(JSON.stringify({status:'FAIL',errors:[e.message]}));process.exitCode=1;}}
```
适配为必需检查聚合器；构建与验证分开。保留既有 `node scripts/validate-planning.cjs` 入口，不将 planning PASS 当作 CORE 产品测试通过。

### 工具与 CLI 测试：`tests/` 新 Node 测试

**Analogs:** `tests/doctor.test.cjs:1–4,11–31` 与 `tests/planning.test.cjs:2–12`。
```javascript
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
```
实际进程版本/非零/空输出分别验证（doctor.test.cjs:11–13）；超时只清理自身树（14–18）；日志上限/脱敏（19–21）；shell 输入与空格路径（22–29）；整体预算（30–31）。这些是可迁移的工具行为测试，不是 native lifecycle 测试。

**CLI fixture pattern**（planning.test.cjs:9）：
```javascript
const run=()=>spawnSync(process.execPath,[path.resolve(__dirname,'../scripts/validate-planning.cjs'),'--root',dir],{encoding:'utf8',windowsHide:true,timeout:5000});let r=run();assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).v1Requirements,2);assert.equal(JSON.parse(r.stdout).mapped,2);
```
临时目录含空格、`t.after` 清理前检查父路径见 planning.test.cjs:4。新增 Helios automation/self-test 测试必须真实运行 exe、重定向 stdin、检查退出码与超时；按产品构建耗时另设预算。真实 FFI/CTest/engine 测试不能套用 Node fixture 代替。

## Shared Patterns

- **日志与错误：** `scripts/doctor.cjs:5–8,23–28` 对 stdout/stderr/args/error 做脱敏，分别记录 `timeout`、`failed`、`missing`、`empty`，保留 duration/exitCode/truncated。新 build/verify 应保留这些语义并显示产物与日志路径；当前无原生异常转换或 Dart 错误状态模式。
- **证据分层：** `scripts/doctor.cjs:45,56–61` 将 installed integration、cached metadata、executed query 区分；工具存在不等于构建、实机或性能通过。版本输出不能用正则猜测代替单一产品版本来源。
- **可测试 CLI：** `scripts/validate-planning.cjs:48–49` 与 `tests/planning.test.cjs:9–11` 保留 root 注入、结构化结果及失败退出码；新验证入口按需整合现有 baseline 检查，既有审阅快照不可自动覆盖。
- **Auth/Guard：** 无生产鉴权 analog；本阶段不造假认证。遵守 `docs/SESSION-MODEL.md` 的 Disconnect/StopInstance、唯一 ControlLease 与观察者边界；本地测试资源销毁不可外推为停止远端实例。

## No Analog Found

以上 12 个 none 文件组均需从 `02-RESEARCH.md` 的责任映射、ABI/ownership/stop barrier、验证架构及官方接口资料建立首个模式。重点包括 Flutter/C++ 导入约定、C ABI 异常隔离、Dart isolate 回调、texture/surface 所有权、五平台 adapter、单一版本生成和 Windows CI。

没有现成 CMake、Flutter app/plugin、CTests 或 workflow 可复制。Native contract、真实 DLL FFI、widget、Windows engine integration 分层交付；非 Windows 占位必须明确未实现，Apple 构建责任仍保留。呈现报告分别保存真实测量与 unavailable 原因，不宣称 HDR/零拷贝/性能支持。

## Metadata

**Analog search scope:** 已追踪 `scripts/`、`tests/`、`.github/` 与 Phase 2 直接规范；未进入 `references/upstream`。
**Files scanned/read for extraction:** 5 个 analog（均少于 2,000 行）；`git ls-files` 已确认全部已追踪。
**Project skills:** `.codex/skills/`、`.agents/skills/` 查询无技能目录输出。
**Pattern extraction date:** 2026-10-07；未运行测试、修改产品或提交。
