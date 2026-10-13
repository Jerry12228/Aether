# Phase 03：虚拟显示器可行性 — 模式映射

**映射日期：** 2026-10-08；**分类条目：** 18；**有对应模式：** 12/18。
本文件属于当前规划工作流，仅提供可复制的仓库模式。所有新增路径及接口名均为**拟议**，由规划确认；不代表已有实现或 provider 已获生产准入。已存在的对应文件均经 `git ls-files -- <path>` 核验为主仓库跟踪文件；忽略的参考检出不作为产品代码模式。

## 文件分类

| 新增/修改文件 | 角色 | 数据流 | 最接近的已跟踪模式 | 匹配 |
|---|---|---|---|---|
| `apps/helios/main.cpp`（修改） | 控制器 | 请求响应 | 同文件 | 精确 |
| `CMakeLists.txt`（修改） | 配置 | 批处理 | 同文件 | 精确 |
| `native/platform/include/aether/virtual_display.h`（拟议） | 模型 | 请求响应 | `native/core/include/aether/core.h` | 角色 |
| `native/platform/windows/virtual_display_provider.cpp`（拟议） | 服务 | 请求响应 | `native/platform/platform.cpp` | 角色 |
| `apps/helios/display_commands.cpp`（拟议） | 控制器 | 请求响应 | `apps/helios/main.cpp` | 精确 |
| `apps/helios/display_registry.cpp`（拟议） | 存储 | 文件读写 | 无持久登记实现 | 无 |
| `apps/helios/display_transaction.cpp`（拟议） | 服务 | 增删改查 | 无设备事务实现 | 无 |
| `native/platform/windows/display_security.cpp`（拟议） | 工具 | 请求响应 | 无 caller/设备 ACL 实现 | 无 |
| `native/platform/windows/driver_package.cpp`（拟议） | 服务 | 文件读写 | 无驱动信任/安装实现 | 无 |
| `apps/helios/display_test_pattern.cpp`（拟议） | 组件 | 事件驱动 | 无七屏身份测试窗口实现 | 无 |
| `tests/native/virtual_display_contract.cpp`（拟议） | 测试 | 请求响应 | `CMakeLists.txt` 原生合同目标注册 | 角色 |
| `tests/virtual-display-contract.test.cjs`（拟议） | 测试 | 请求响应 | `tests/helios-process.test.cjs` | 精确 |
| `tests/virtual-display-package.test.cjs`（拟议） | 测试 | 变换 | `tests/platform-contract.test.cjs` | 角色 |
| `scripts/check-virtual-display.ps1`（拟议） | 工具 | 批处理 | `scripts/check-core.ps1` | 角色 |
| `scripts/check-virtual-display-evidence.cjs`（拟议） | 工具 | 变换 | `scripts/verify.cjs` | 角色 |
| `scripts/build.cjs`、`scripts/verify.cjs`（修改，合并分类） | 工具 | 批处理 | 同文件、`scripts/tool-runner.cjs` | 精确 |
| `docs/phase03/PROVIDER-ADMISSION.json`（拟议） | 配置 | 变换 | `references/upstream-lock.json`、`docs/SOURCE-AUDIT.md` | 角色 |
| `docs/phase03/MACHINE-RESULTS.json`、`docs/phase03/EVIDENCE.md`（拟议，合并分类） | 模型 | 批处理 | 无显示器实机证明模型 | 无 |

若合并源文件，保持登记、事务、Windows 安全、provider 与包核验职责可独立测试。根 `CMakeLists.txt` 是当前构建入口；仓库没有 `native/CMakeLists.txt` 或 `native/platform/CMakeLists.txt`。

## 模式分配

### 1. Helios 命令入口与子进程验证
**来源：** `apps/helios/main.cpp:34–46`，标准头导入见 1–10；未知参数立即退出非零：
```cpp
const std::string arg=argv[i];
if(arg=="--self-test")self_test=true;
else if(arg=="--automation")automation=true;
// 其余分支见原文件
else {std::cerr<<"Unknown argument\n";return 2;}
```
适用主入口和拟议命令分派。显示子命令执行后退出；现有 62–75 行的前台等待和 core 清理只属于旧本地生命周期，不能照搬成显示组析构删除。`Finish` 的交互按键等待（26–31）也不能导致 D-02 单命令阻塞。
**子进程测试来源：** `tests/helios-process.test.cjs:2–6,18–22`：
```javascript
const r=spawnSync(name==='init-failure'?testBinary:binary,args,{input:'',encoding:'utf8',timeout:5000,windowsHide:true});
assert.equal(r.status,expected,JSON.stringify(r));
assert.doesNotMatch(r.stdout,/Press .*exit/);
```
拟议合同测试连续启动不同 CLI 子进程查询持久组；fake 只证明合同，真实设备保活必须另有实机记录。

### 2. Windows 适配与原生构建
**来源：** `CMakeLists.txt:12–24,26–45`：
```cmake
target_compile_features(helios PRIVATE cxx_std_20)
target_link_libraries(helios PRIVATE aether_core)
add_test(NAME core_${SUITE} COMMAND aether_core_contract ${SUITE})
set_tests_properties(core_${SUITE} PROPERTIES TIMEOUT 60)
```
复制显式源文件、目标局部 include/link 和独立合同目标；设备代码只连 Helios/Windows 适配目标，不泄漏到五端共享 core。测试注入参考 32–35 行独立 `aether_helios_test` 目标，保持产品目标无测试 hook。
**能力拒绝来源：** `native/platform/platform.cpp:1–12`：
```cpp
#include "aether/platform.h"
int32_t platform_init(uint32_t id) noexcept { const auto* p=platform(id);return !p?AETHER_INVALID_ARGUMENT:p->implemented?AETHER_OK:AETHER_UNSUPPORTED; }
```
拟议 provider 合同采用明确 implemented/reason，不将声明能力或请求接受写成实际显示支持。

### 3. 边界所有权与返回值
**来源：** `native/core/include/aether/core.h:13–22,27–42,50–55`：
```cpp
typedef struct AetherConfig { uint32_t abi_version; uint32_t struct_size; uint32_t flags; uint32_t reserved; } AetherConfig;
/* Caller owns all output buffers. required includes the UTF-8 terminator. */
AETHER_API int32_t aether_core_version(uint32_t abi_version, char* buffer, uint32_t capacity, uint32_t* required);
```
拟议 `DisplayProvider`、`DisplayRequest`、`DisplayActual` 名称未确认；Windows 内部可用 C++ 合同。只有确需跨 ABI 时复制结构版本、长度检查、调用方缓冲和标量状态码，不自动扩展现有 ABI1。core.h:16 明确现有 core 不修改 Host/Instance/DisplayGroup/ControlLease；原生 core 的 stop/ACK/destroy 不等于持久显示组所有权。

### 4. 构建、验证及预算
**来源：** `scripts/build.cjs:3,25–31`：
```javascript
const remaining=deadline-Date.now();if(remaining<=0)throw Error('Target build budget expired');
const result=await runGroup({...command,timeoutMs:remaining},{root:ROOT});
```
拟议命令和机器 runner 采用总 deadline 的剩余预算，不对每次 provider 调用重新获得完整预算。现有 runner 是进程预算模式，不是设备取消或锁事务实现。
**来源：** `scripts/tool-runner.cjs:39–43,61–65`：
```javascript
try{child=cp.spawn(spec.exe,spec.args,{cwd:spec.cwd||root,env:spec.env||process.env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});}
```
复制绝对 exe、argv 数组、无 shell、隐藏窗口、超时结果和日志；driver 更新/安装单设预算及 reboot-required，超时不能删除其他组。
**来源：** `scripts/check-core.ps1:9,16–19`：
```powershell
if ($LASTEXITCODE -ne 0 -or ($selection -join "`n") -notmatch 'Total Tests: 1') { throw 'Native test discovery must find exactly the requested suite' }
```
复制构建产物缺失即失败、精确 CTest 发现、`--no-tests=error`、独立 Debug/Release 合同检查。机器模式必须显式进入，普通 CI 不安装驱动。

### 5. Fixture、来源准入和证据
**负例来源：** `tests/platform-contract.test.cjs:2–3,8–13`：
```javascript
const android=structuredClone(records);android.find(row=>row.id==='android').interface='supported';assert.throws(()=>validate(android),/product support/);
```
复制“合法基线 + 单字段变异 + 明确拒绝”，用于错误包版本/hash/签名、登记损坏、错 owner、60/1 对 60000/1001、虚假 HDR/七屏通过。
**固定来源模式：** `references/upstream-lock.json:2–9,76–84` 提供 schemaVersion、研究用途与 commit；`docs/SOURCE-AUDIT.md:5` 明确结构校验通过不等于生产复用批准。拟议准入对象另列正式包 URL/version/architecture/hash、CAT/成员签名、许可、默认安全配置和 Windows 目标证明，不能把源码 SHA 当安装包 hash。
**汇总模式：** `scripts/verify.cjs:51–59`：
```javascript
if(result.exitCode===0&&spec.tests){try{tests=validateTests(result.output);}catch(error){guardError=error.message;}}
const status=results.every(row=>row.exitCode===0&&!row.guardError)?'PASS':'FAIL';
```
机器证据校验器可复制错误聚合和 artifact SHA256（56 行），但须新增真实场景完整性校验；结果文件存在或 fixture 通过不代表驱动证明。

## 共享模式

- 导入：C++ 用 `aether/...` 头边界；Node 用 `node:` 内建模块和仓库相对 require。不存在可复制的鉴权中间件。
- 错误：参数/产物/测试发现失败均非零；使用现有 runner 日志脱敏（`scripts/tool-runner.cjs:4–5`），未知与拒绝分开保留。
- 所有权：命令进程、测试窗口、持久逻辑组及真实 provider 设备分开；退出释放临时句柄，不移除持久组。
- 范围：登记是 Phase 3 最小原型登记；不得提前引入 Phase 8 完整实例管理或 Phase 17 自动恢复。

## 无对应模式与规划要求

| 新设计领域 | 需要明确的合同与验证 |
|---|---|
| 持久登记/事务 | 有界互斥、ACL、原子提交、journal、最后成功配置、崩溃恢复；每个 provider/commit 故障注入，只补偿本次拥有资源 |
| 原生 deadline/取消 | 总预算跨锁/枚举/操作传递；无法取消时记录未决副作用，退出非零；进程超时不是设备事务回滚 |
| caller/设备安全 | 登录桌面/owner/管理员检查、fail-closed、UTF-8/整数范围、reparse/路径保护；第三方设备 ACL 绕过独立准入审查 |
| 驱动包 verifier | 固定包来源及完整成员核验、OS 签名策略、解压保护、版本差异/显式更新/手动重启；禁止自签根导入替代正式准入 |
| 测试画面/机器证据 | 各 slot 独立身份/图案及窗口清理；输入SHA、OS/GPU/IddCx/包/签名、请求与 actual、前后拓扑、watchdog、故障范围和人审 |

以上依据 `03-RESEARCH.md` 建立新合同，均尚未实施。Win10/11、精确四组七屏与 D 组实际 SDR/HDR、正式签名/许可缺证据保持 pending/blocked；不得由 fake、降级或 skip 转为通过。

## 元数据

搜索范围：主仓库 `apps/helios`、`native`、根 CMake、`scripts`、`tests` 与来源/架构文档。主要对应模式归为入口、原生边界、构建预算、测试、来源证据五组；已有模式只证明当前本地骨架。
跟踪门禁已核验本文件命名的全部对应源路径；未安装依赖、未改源码/provider、未提交 Git。
