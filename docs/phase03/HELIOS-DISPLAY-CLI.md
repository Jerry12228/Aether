# Helios 显示组原型命令（03-02）

03-02 已实现原生接入代码、持久登记与合同回归。合同通过不等于真实设备功能通过；03-03 的具体安装、拓扑、配置与恢复授权尚未执行。所有组共享同一 Windows 登录桌面，窗口、焦点、输入和音频没有组间隔离。

普通命令均短命，锁等待最多 2 秒，总预算 10 秒。只有显式 `test-pattern` 运行 HWND 事件循环。关闭其中一个图案窗口或 Ctrl+C 会关闭本命令拥有的全部窗口，不删除显示组；core stop/ack/destroy 同样不删除组。

```text
helios vdisplay query --json
helios vdisplay query --group A --json
helios vdisplay driver check --json
helios vdisplay create A --json
helios vdisplay update A --slot 1=1280x720@60/1:SDR --json
helios vdisplay delete B --json
helios vdisplay recover C --json
helios vdisplay test-pattern A --json
```

名字仅接受 1–64 个 ASCII 字母、数字、`_`、`-`，转为大写后唯一。自定义名字需要显式 `--slot SLOT=WIDTHxHEIGHT@NUM/DEN:SDR|HDR`。宽高 1–8192、slot 1–10；必须精确约分为 60/1，60000/1000 可接受，60000/1001 拒绝。重复 slot、零分母、溢出和未知选项均拒绝。

| 组 | 默认 slot | 固定预留行 |
|---|---|---|
| A | 1920×1080 SDR、2560×1440 SDR | y=anchorY |
| B | 1920×1080 SDR | y=anchorY+1440 |
| C | 两个 1920×1080 SDR | y=anchorY+2520 |
| D | 两个 1920×1080；Win11 D2 HDR，Win10 全 SDR | y=anchorY+3600 |

锚点取首次布局观察到的物理屏最右边界与最上边界；没有物理屏时为 (0,0)。一行内横向累加宽度。默认完整 A/B/C/D 请求预留四行，因此失败组留下空行。已成功组不因其他组创建/失败/删除而移动；自定义高度扩大导致重叠时整组拒绝，不能自动搬动其他组。当前 admitted profile 容量为 10，不是产品最终上限。

登记位于当前用户 `LocalAppData/Aether/phase03/display-registry.v1.json`，以真实 OS token SID、登录认证 LUID 和 Default 交互桌面验证调用者。目录、文件和本地 mutex 使用 owner/SYSTEM protected DACL；拒绝 foreign owner、hard link、reparse/junction 与损坏登记。`groupId`、`slotId` 和 driver container GUID 持久保留，系统 PnP/LUID/target/GDI 映射必须重新观察，发生变化在 `realityDiff`/`identityRemap` 显式记录。

设备操作前先 flush 并原子保存 pending journal，最后只有完整精确回读通过才更新 last-success。明确失败仅补偿本次已证明拥有的新 slot；未知、超时、删除失败或补偿失败留下 pending。`query` 只报告现实差异，绝不恢复；存在 pending 时只有匹配 NAME 的显式 recover 可继续。recover 恢复该组 last-success 或未提交创建的原逻辑请求，不借 driver 全局 reset 清除其他组。

生产 CLI 不接受 `--test-provider`、`--test-root`、`--fault`，即使旧 CMake test-hooks cache option 被打开也不将定义传给 helios。合同测试仅使用独立 `aether_helios_test`、隔离 owner 根目录与文件 backend；结果标记 `evidenceScope=contract`。图案合同创建真实但隐藏的 HWND 并发送 WM_CLOSE；它证明窗口所有权清理，不证明七个真实输出或 HDR 显示画质。

每次通过登记验证的命令在同一 private 目录保存脱敏 `display-attempt.<GUID>.json` 并返回 `logPath`，仅记录 command/group/evidenceScope/attempted，不记录 SID、桌面内容或捕获图像，也不把 attempt 当成成功。验证工具的原始日志保存在 ignored `artifacts/phase03/contract`。这样实际用户调用不依赖源码仓库当前目录或可由其他用户写入的 artifacts 路径。

## 03-03 系统授权与原生限制

当前 fixed package 哈希来自 `PROVIDER-ADMISSION-RECONSTRUCTED.json`（其旧版保存在 `PROVIDER-ADMISSION-03-01-HISTORY.json`）；编译时 INF/DLL/package pins 来自 `native/platform/windows/helios_display_pin.h`。原生 backend 要求唯一私有接口、`Root\\Aether\\HeliosDisplay` 硬件 ID、安装 driver-store 中匹配 INF/DLL bytes、协议 0.3.0、watchdog=0、testMode=0、maxMonitors=10、sdrBits=8、hdrBits=10。没有隐式安装、更新、注册表配置或 trust-store 变更路径。

生产 create/update/delete/recover 还要求同一 protected 目录存在 `machine-authorization.v1.json`，其中 status=`authorized`、providerId=`aether-helios-display`、packageSha256=上述固定包哈希、ownerSid/loginAuthLuid/desktop 与 token 一致，commands 数组明确包含该次命令。03-02 不创建这个授权文件。只有 03-03 用户批准具体固定包和系统操作后，执行器才可在同一身份下写入它；更新 package 或登录身份后旧授权失效。此文件是本地执行范围门，不是抵御同一用户自行修改文件的权限隔离。

原生路径使用私有逐 GUID ADD/REMOVE IOCTL，以返回 adapter LUID/target、PnP container 和登记 GUID 证明映射。CCD 保留完整既有路径/模式；拒绝 cloned/shared source、外部拓扑变化和未知映射，使用 SDC_VALIDATE 后 SDC_APPLY，未使用 SDC_ALLOW_CHANGES。比较完整观察到的尺寸、位置、primary、rotation、scaling、path/status flags、refresh 和 advanced-color 字段；validation 后再次读取，应用后检查非拥有目标。Windows CCD 没有原子 compare-and-swap，检查与应用之间的系统竞态仍须由 03-03 真实回读评估，发现异常保留 pending，不能假称全局回滚成功。

创建前可核验整组尺寸、刷新率、OS/profile 和容量；新 target 的真实 GPU/advanced-color 能力只有 arrival 后可观察，仍须严格回读，不满足则不能提交成功。HDR 判定使用启用状态、非强制 wide-color 与至少 10-bit 色深；其与实际 HDR 链路/捕获的对应需 03-03 机器证据，不能仅以 API 字段关闭 Win11 D2 HDR 验收。Win10 七屏 SDR、Win11 七屏含 D2 HDR、持久性、物理/foreign 保持和用户可见图案全部尚待该计划授权验证。
