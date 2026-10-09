# 03-01 专属研究设备 ACL 补证方案

状态：**待具体系统授权，未执行**。仅补 T-03-02 准入证据；03-02/03-03 不启动。源码许可门仍 open，研究包不作为生产发布依赖。

## 固定对象

- 研究源：`artifacts/phase03/derived-research/helios-1791523371087`，SudoVDA 基线 `a4b09fa2aa731a964d0cb5d139cb1e6240e4da12`，八项实际构建输入。
- 已签名包：`artifacts/phase03/selfsigned-research/helios-1791523416599/HeliosDisplayX64`，逐成员摘要见本目录的 `HELIOS-DISPLAY-SELFSIGNED-FOLLOWUP.json`。
- 硬件 ID：`Root\Aether\HeliosDisplay`；接口 GUID：`0d9ecbde-124e-45f0-9ae0-3d71b16a7725`；协议 0.3.0 research。
- 证书：`E3ED742C3D08188A117AFF7B6C1BB207523EB4DB`，已按用户授权导入 LocalMachine Root/TrustedPublisher。本方案不增加其他证书。
- Windows SDK devcon：`C:\Program Files (x86)\Windows Kits\10\Tools\10.0.28000.0\x64\devcon.exe`，已观察签名 Valid / Microsoft Corporation；执行前再次核验。
- 只读探针：[probe-helios-display-acl.ps1](../../scripts/probe-helios-display-acl.ps1)，只枚举专属接口、读取设备 Security，并发送 GET_PROTOCOL_VERSION。逐句柄测试 desiredAccess=0 / READ / READ|WRITE。

## 限定动作及停止条件

1. 再核验全部源/包摘要、签名、专属设备不存在和主机当前外来设备清单。旧 SudoMaker/Oray 包及其设备都保留。若专属 ID 或专属 HKLM 配置已存在，停止并审阅，不覆盖已有配置。
2. 只在 `HKLM\SOFTWARE\Aether\HeliosDisplay` 临时设置 `watchdog=0`、`testMode=0`。现代码默认也为 0/false；明确避免测试显示器自动出现。记录原值及该键是否新建。
3. 管理员执行 `devcon install <固定 HeliosDisplay.inf 绝对路径> Root\Aether\HeliosDisplay`，不加 `/r`。这会把该包放入 Driver Store 并建立一个研究显示适配器；不创建 monitor，不发送添加/删除/改适配器/Ping IOCTL。
4. 用当前未提升令牌执行探针，再用管理员令牌执行同一探针，分别记录身份和输出。普通令牌不得获得可查询协议的句柄；管理员 READ 句柄须返回 0.3.0；零访问句柄不得成功查询。设备栈 DACL 必须仅允许 SY/BA，不得有 WD/BU/AU 通用允许项。任一条件不符，风险保持 high，不准入。
5. 比较前后活动显示拓扑；不得增加显示屏。记录确切新设备 instance ID 和确切新 `oemNN.inf` 后，仅移除本次创建的设备及对应新增包；恢复本次改动的专属配置。若删除提示需要重启，记录未完成清理，停止，不执行或安排重启/关机，不禁用安全检查。

## 影响与边界

安装/移除显示适配器可能触发系统驱动加载或显示重新枚举；即使不创建显示屏也不能承诺零影响。权限探针不验证七屏、HDR、保活、更新或恢复；这些仍留在未启动的后续计划。本机通过也不代表 Win10 实机通过。

精确回滚以实际安装产生的 instance ID / OEM INF 为准；禁止按 Display 类或旧 SudoMaker ID 批量删除。移除本次设备后保留已经另行授权的研究证书信任；如用户要求撤销信任，另按确切指纹删除两个证书库中的对应项。

微软说明 UMDF 应通过 INF 指定设备栈安全描述符：[WDF device access](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/controlling-device-access)。本次测试核验实际应用结果，不将 INF 声明直接当成 ACL PASS。
