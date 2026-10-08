# Phase03 外部能力覆盖

2026-10-08：实际API detector对计划正文返回detected:false，signals为空；因此自动API检查点未触发。以下是Windows/provider实际接入范围的补充矩阵。provider未选定；03-01固定接口审计须补齐获选provider全部方法，不能将此矩阵当作来源、实现或支持批准。

| capability | decision | reason |
|---|---|---|
| Windows CCD QueryDisplayConfig / GetDisplayConfigBufferSizes | INTEGRATE | 03-01真实查询；03-02有界枚举与精确回读 |
| Windows DisplayConfigGetDeviceInfo / advanced-color查询 | INTEGRATE | 实际identity/颜色/HDR与请求分开 |
| Windows SetDisplayConfig校验/应用 | INTEGRATE | 03-02精确布局，保留physical/foreign/其他组 |
| provider版本/协议/容量/模式枚举 | INTEGRATE | 03-01固定来源完整接口审计，03-02准入与拒绝 |
| provider逐slot创建/更新/删除 | INTEGRATE | 03-02稳定native identity与事务补偿 |
| provider watchdog状态查询 | INTEGRATE | 03-01只读探测，03-03越过真实周期验证退出保活 |
| provider持续Ping/隐式常驻owner | OPT-OUT | D-02短命令；若候选依赖此功能，03-01提交替代架构具体决定，不偷偷引入 |
| provider全局count/reload当组删除 | OPT-OUT | D-09隔离要求，固定VDD该路径不能用于单组操作 |
| 显式driver reset故障验证 | INTEGRATE | 03-03具体机器授权后记录全部实际影响范围 |
| Windows包hash/成员CAT/信任策略/安装/更新 | INTEGRATE | 03-01准入、03-03显式安装及旧包回滚 |
| 软件设备ParentPresent生命周期 | OPT-OUT | 研究候选方向；获选provider无该合同则不新增自研驱动，若选用需补齐全接口/签名证据 |
| 后台自动恢复 | OPT-OUT | D-11明确显式恢复 |
| 自动重启/独立重启命令 | OPT-OUT | D-16手动重启 |
| 捕获/编码/传输/HDR媒体呈现 | OPT-OUT | 已批准Phase9/15/18/19责任；本阶段只验证OS显示状态 |

INTEGRATE是计划范围，不代表已实现。Win10与Win11同一完整基线逐项核验，不沿用另一OS的未验证结论。选定provider如有额外方法必须在准入档案和此表逐项决定，所有OPT-OUT保留具体原因。
