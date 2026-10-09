# 独立研究接口：03-01 安装前可行性审计

范围：`helios-1791523371087` 八输入研究树、最终签名包 `helios-1791523416599`。源摘要及实际构建收据绑定在 `HELIOS-DISPLAY-SELFSIGNED-FOLLOWUP.json`。本表仅关闭 03-01 所允许的接口设计/源码可行性门；不代表 03-03 的七屏、HDR、保活或恢复实机通过。

| 门 | 固定源/构建证据 | 结论与后续实际证明 |
|---|---|---|
| perSlotOperations | Driver.cpp 1505–1604：输入/输出长度检查；ADD/REMOVE 以 MonitorGuid 选择；CreateMonitor 独立 context；删除检查 Departure 返回状态 | 支持逐 slot，而非只能切全局屏数。03-02 仍须事务与失败清理 |
| stableIdentity | Driver.cpp 866–900、1532–1536：调用者 GUID 用于 ContainerId/context；重复 GUID 返回已有 AdapterLuid/TargetId | 能实现持久登记和双字段 identity。不承诺 OS 重建后 target ID 不变 |
| sevenSlotCapacity | MaxVirtualMonitorCount 默认 10，初始化 connector 队列；AdapterCaps.MaxMonitorsSupported 使用该值；容量耗尽明确返回错误 | 源合同容纳七个并发 slot，不等于实机成功七屏。配置须固定至少 7，超限须明确拒绝 |
| shortProcessPersistence | monitor/context 由 WDF/IDD 对象持有；watchdog 默认 0，GET 不刷新倒计时；无按 caller 句柄关闭删除的文件清理回调；显式 REMOVE/设备清理负责销毁 | 可实现短 CLI 退出后保留。安装须明确 watchdog=0；关闭/卸载驱动的清理不是普通 caller 断连 |
| strictModes | ADD 保存 requested Width/Height/VSync 为 preferredMode；monitor/target callbacks 使用该 mode；FillSignalInfo：60000 在旧路为 60/1，在新路为 60000/1000 | R1 七屏要求均精确 60Hz，宽高直传。59.94 旧路会四舍五入，不能扩张成分数刷新率普遍支持；产品须比对 actual/requested，不能默默降级 |
| win10Route | INF Legacy/1803+ 安装分支保留，六目标 InfVerif 通过；UMDF/IddCx project 保留 minimum 1.4；HDR callback 字段不可用时用原 mode callbacks、独立 SDR EDID | Win10 SDR 安装前路线成立。实际 OS build 下限、driver load、七屏待后续实机证据 |
| win11Route | 字段可用时注册 HDR/mode2 callbacks；独立 HDR CTA；实际 WDK x64 构建，Win11 INF 分支验证及四 OS CAT 重建通过 | Win11 D2 HDR 路线存在。HDR callback 可用性、颜色/亮度和实际 10bit/HDR 激活仍须实测，不能只以 EDID 宣告通过 |

## 安全与剩余实施问题

BA/SY 受保护 INF DACL 与私有 IOCTL READ/READ|WRITE access bits 同时存在。专属 GUID/硬件 ID 避免访问旧 SudoMaker provider。**实际 ACL gate 尚未关闭**：安装前探针显示专属接口不存在，普通/elevated 实际打开与零访问 IOCTL 拒绝仍需 [限定方案](HELIOS-DISPLAY-ACL-PROBE-PLAN.md)。ACL 高风险保持 open。

完整方法清单在 `PROVIDER-ADMISSION-SELFSIGNED.json` 重新逐项记录，未静默继承旧候选 OPT-OUT。SetRenderAdapter 是全 adapter 作用，Phase03 不接入；Ping 不接入，以零 watchdog 满足无需常驻 owner 的合同。

已知需要实施修正的失败边界：容量检查在 GUID 查找之前，满容量时重复创建可能先报超限；MonitorArrival 失败后的 connector/context 回收仍需加强；非零 watchdog 的并发/生命周期路径未认证，本路线只允许 0。它们保留为 03-02 provider 适配前的明确验收项，不编造已修复或失败矩阵 PASS。普通 caller 边界的 high 风险只能由实际 ACL 证据关闭。
