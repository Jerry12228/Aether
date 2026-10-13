---
quick_id: 261009-f0f
status: complete
completed: 2026-10-09
phase_context: 03-01
task_commits: [062ebec, 632c63a, 7546574, 565c5d8]
requirements_completed: []
provider_admitted: false
---

# 03-01 来源、INF 与签名补证完成

用户明确授权已批准 SudoVDA 独立派生路线的顺序补证；按 gsd-quick inline 执行。没有重问路线、派生代理、设备/registry/证书/安全策略变更或机器电源操作。03-02/03-03不启动；本quick完成不代表Phase3或VDP完成。

## 三项任务

1. **来源/EDID审计**（062ebec）：固定13源输入及45官方网络观察，追踪两次重组/改名之前历史，明确AdapterOption早期贡献与option.txt作者；原独立384bytes EDID与编译256bytes数组不同。工具edid.S的GPL-2.0-or-later文件声明与根GPLv3分开；完整许可研究材料固定hash。准确微软祖先、逐行贡献和EDID实际生成来源仍open，无生产复用批准。见[来源记录](../../../docs/phase03/HELIOS-DISPLAY-PROVENANCE.md)。
2. **INF修正/真实工具验证**（RED632c63a，GREEN7546574）：准备脚本保持固定字节核验和危险参数拒绝。新增Win10 Legacy DIRID12、Win10 1803+ DIRID13+AddService、Win11 DIRID13+WudfRd.inf三分支。保留旧分支而不锁定最低build，保持独立身份/ACL/watchdog、IddCx0102及unsigned属性。Release x64构建成功，真实Tlog含/WX及/analyze；6/6 InfVerif退出0（全局/w无告警，单OS14/15项2083），显式Win10/Win11 Inf2Cat退出0且errors/warnings0，新INF无2084。第一次Win10/w DLL目录1322失败保留并修复。见[构建记录](../../../docs/phase03/HELIOS-DISPLAY-INF-FOLLOWUP.md)。
3. **正式签名准备**（565c5d8）：固定DLL/INF/CAT/PDB与hash，整理dashboard账户/EV、CAB/符号、测试attestation与认证HLK区别、返回包重审及UMDF其他可信CA政策候选。此轮无需账户信息，没有申请/购买/上传；见[签名条件](../../../docs/phase03/HELIOS-DISPLAY-SIGNING-READINESS.md)。

## 验证

- 研究3项+包9项+planning1项：13/13，无skip，400.88ms；纯文件/文档变化未重跑无关GPU/FFI/原生生命周期套件。
- 最终89个唯一源/产物/日志摘要及19个本地链接核验通过。首次摘要巡检误把上游README相对路径当仓库README，修正解析上下文后全部通过；没有修改来源hash迁就检查。
- validate-planning.cjs：42阶段/105需求映射及本地链接PASS。R1决定digest仍0e2010bd2143013fbbc62d0be3cad622020024594562c8521370ff36bcf0d116；dossier/require-decision通过，admission/authorization继续拒绝。依赖引擎runnable=[]，03-01 summary halted仍阻断03-02/03-03。
- WDK构建与工具验证仅当前Win11工作站x64研究包文件证据，不是Win10/11运行、设备ACL、七屏保活/HDR或安装更新回滚证据。DLL/CAT NotSigned；INF UnknownError，没有可信签名。
- 原沙箱Node子进程EPERM、GSD staging_failed属于环境限制；相同命令经自动审批后执行。未将EPERM算成RED，真正RED为缺platformInf行为的两项测试失败。

## 剩余门槛

许可贡献/模板来源或独立替代仍需技术审计；账户/证书未知不等于仅剩签名。之后实际申请/提交才需要用户提供主体、Hardware Developer Program与EV的非秘密状态。正式签名、实际ACL/IOCTL、Win10加载/最低build、七屏/HDR/保活和更新回滚均未关闭。严禁开发机重启或关闭，providerAdmitted=false；未更新ROADMAP或需求完成状态。
