# 03-01 独立输入与自签补证

**本机可信自签已经通过；provider 仍未准入。** 用户「证书自签即可，效仿Apollo」替代本次研究的 HDP/EV 路线；用户随后明确授权仅导入指定证书并复核。不是生产渠道准入，也不授权设备安装。03-02/03-03 未启动，开发机禁重启/关机继续有效。

## 实际完成

八项编译输入替代原十三项研究输入；AdapterOption、EDID 数组及生成函数、INF、项目文件独立编写。外部 384 字节 EDID、solution、filters、option.txt 和 README 不进入驱动构建。新 256 字节 EDID 明确区分 SDR/HDR CTA 能力，原生测试验证校验和、序列号字节序、定长字符串、非 ASCII 清洗与边界。ZZZ 仅为研究占位，不宣称是 Aether 获分配的厂商身份或通过 VESA 认证。

固定研究树 `helios-1791523371087` 的 Release x64 实际 WDK 构建通过，保留 /WX、/analyze；INF 与已通过六个目标检查的版本逐字节相同，明确 Win10/11 OS 清单的 CAT 重建通过。ARM64 尚未构建；INF 分支通过不锁定 Win10 最低实际支持 build，也不证明 HDR、容量或安装。

接口使用专属 hardware ID/GUID、BA/SY 受保护 DACL；查询不触发 watchdog。追加权限修正：GET IOCTL 要求 READ，其余 mutation/Ping 要求 READ|WRITE；私有协议更新至 0.3.0，避免 FILE_ANY_ACCESS 句柄绕过。实际设备 ACL 与未提升 caller 拒绝结果仍未知，不能仅靠 CLI 权限或源代码声明关闭 T-03-02。

## 自签与本机信任

最终包位于 `artifacts/phase03/selfsigned-research/helios-1791523416599/HeliosDisplayX64`，CER 指纹 `E3ED742C3D08188A117AFF7B6C1BB207523EB4DB`。RSA3072/SHA256，六个月研究证书，私钥 NonExportable 留在 CurrentUser\My；没有 PFX、密码或私钥导出。DLL 签名后重新生成 CAT，再签 CAT，附 DigiCert RFC3161 时间戳。

Apollo 固定提交的 install.bat 先导入 Root/TrustedPublisher 再安装设备，本轮只效仿前两项证书信任动作。非提升导入先被 Windows Access denied 拒绝；随后 UAC 管理员运行证书专用脚本成功，两项都是此前不存在、此次新增。导入前 INF/DLL `/pa /c` 均失败 untrusted root，失败记录保留；导入后最终 INF/DLL 均退出 0，CAT 成员、签名、证书 pin、时间戳绑定通过。DLL 篡改与错 pin 两个独立负例均退出 1，原包未修改。时间戳内存链验证明确使用 NoCheck revocation，不冒充在线吊销验证。

这只建立本机研究信任，其他机器仍须明确部署自己的信任策略。微软区分本机 TrustedPublisher 与 Root：[Trusted publisher store](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/trusted-publishers-certificate-store)。没有关闭安全检查、修改 testsigning 或进行重启/关机。

## 来源与许可剩余项

完整 `-w -M -C -C` 拷贝跟踪完成。Driver.cpp 中 karlf 552 行、Driver.h 94 行，经去空白表达式比较全部能在微软 2020 固定样例找到；Microsoft commit `d43983a97c79e5e7eafb4948fd2678f5e709838b` 的完整 MS-PL 和版权声明已保存。该结果说明存在有许可的参考表达式，不证明 2017 的 Git 祖先相同。非 Yukino/karlf 的剩余 27 行逐行保留在 JSON，而不把仓库根许可扩张成这些作者的许可。

SudoMaker 的声明只覆盖其本人修改。较大的早期 AdapterOption、EDID 模板及继承 INF/project 已被替换或排除；剩余继承表达式仍需通过受限独立重构或独立权利证据闭合。`rights.closed=false`、`productionReuseApproved=false`，没有把自签成功写成独立再分发许可。原 R1 档案与决定 hash 保留。

## 下一步

继续完成剩余源码权利闭环；实际设备 ACL 补证需要新增具体系统授权。已经准备 [ACL 方案](HELIOS-DISPLAY-ACL-PROBE-PLAN.md)，只装一个零显示屏研究适配器、做只读权限检查并精确清理；不执行七屏/HDR/持久登记，也不启动 03-02/03-03。所有 gates 关闭后才提交具体准入结果。构建、原生测试、签名、来源与系统边界的实际摘要见 [JSON 收据](HELIOS-DISPLAY-SELFSIGNED-FOLLOWUP.json)。
