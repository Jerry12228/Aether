---
phase: "01"
slug: source-feature-environment-baseline
status: verified
verdict: SECURED
threats_total: 12
threats_closed: 12
threats_open: 0
register_authored_at_plan_time: true
asvs_level: 1
block_on: high
created: "2026-10-07"
verified: 2026-10-07T14:02:28.544Z
audit_mode: inline
---

# Phase 1 — Security

## Trust Boundaries

| Boundary | Data Crossing | Control |
|---|---|---|
| 固定研究checkout → baseline | URL/SHA/path、Git对象、上游文本 | 锁白名单、root/reparse、原文/字节摘要；文本不作指令执行 |
| 本机工具 → committed snapshot | PATH启动器、版本/OS/GPU、输出诊断 | 固定查询、参数数组、截止/上限/自身树清理、脱敏 |
| 候选证据 → 用户决定 | 许可/能力/平台/测量方案 | blocking-human真实选择；production reuse/support仍false |
| 测量记录 → 统计比较 | 仪器/单位/时钟/参考与参数 | 真实记录字段、匹配参数及校准门禁；零样本unavailable |

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-01 | Tampering/Elevation | sync-upstream/validateSources | high | mitigate | 真实root/reparse及锁URL/SHA/path白名单、参数数组；source越界/元字符/重解析fixture失败且不执行 | closed |
| T-01-02 | Spoofing | Git对象/remote/dirty | high | mitigate | 独立checkout/remote/HEAD/dirty、固定blob内容hash与原文；错SHA/remote/blob/字节及dirty负例，真实九仓核验 | closed |
| T-01-03 | Repudiation | 文件许可和发行台账 | medium | mitigate | 逐文件证据或open blocker、1332外部候选和14发行路线；禁止无依据reuse/clearance；两项明确用户选择和全包人审，未知生产范围继续blocked | closed |
| T-01-04 | Denial of service | Git查询/fixture | medium | mitigate | Git单次15秒/maxBuffer及超时错误，无自动重试；注入失败/超时与真实CLI负例 | closed |
| T-01-SC | Tampering | package-manager installs | high | mitigate | 当前实施无package-manager/driver安装，无依赖升级或外部脚本执行；已装组件只核验；新增安装仍须重新合法性研究与适用门禁 | closed |
| T-01-05 | Tampering | validateFeatures/anchor | high | mitigate | 功能anchor复用固定对象/路径/原文检查；错blob/excerpt/缺anchor负例 | closed |
| T-01-06 | Repudiation | 设置覆盖/需求映射 | medium | mitigate | 117surface/373setting覆盖、637独立planned案例、ORIG需求单一主要阶段；遗漏/错映射/无case负例及真实人审 | closed |
| T-01-07 | Spoofing | 平台证据/TODO | high | mitigate | implementation/build/automation/hardware分列且当前为空；未批准TODO、伪Applehardware/产品case负例失败；仅VFY01/02延期 | closed |
| T-01-08 | Tampering/Elevation | doctor launcher | high | mitigate | 绝对路径与shell=false、bat固定参数白名单、root守卫；元字符不执行、含空格wrapper正确启动、CLI拒绝越界 | closed |
| T-01-09 | Denial of service | runProbe/process tree | high | mitigate | 单项5秒/每流64KiB、Quick25/Deep45秒并预留清理预算；实际父子PID均消失而无关进程存活，洪泛截断和总预算not-probed负例 | closed |
| T-01-10 | Information disclosure | environment output | high | mitigate | 固定只读查询字段、凭据/Bearer/用户目录和JSON输出/诊断脱敏；fixture秘密不进入结果，本机报告仅允许字段 | closed |
| T-01-11 | Spoofing/Repudiation | 平台/测量报告 | medium | mitigate | 真实状态/SDK配套组件、framework/native/build/hardware边界、单位/参数可比性/时钟校准负例；四项真实人审，不编造样本或SLO | closed |

## Accepted Risks Log

No accepted risks. 没有将未实现控制改成accept；12项只核验本阶段计划中的审计/启动/证据边界。源许可/外部包/签名、工具实际build、硬件与性能未决项持续阻断对应后续生产选用，不能从本阶段SECURED推导发布许可或产品安全。

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-10-07T14:02:28.544Z | 12 | 12 | 0 | Codex inline L1 planned-register verification |

T-01-SC在三计划共用，去重后12项；计划阶段已有register。L1逐控制/负例核验，未执行产品渗透测试。80项全套及最终28项doctor通过，严格真实全包门禁PASS。六条无check描述符的prohibition人工约束保留，未伪造wired检查。

## Sign-Off

- [x] All threats have a disposition.
- [x] No accepted risks or implicit transfer.
- [x] threats_open: 0 at/above high (also zero below threshold).
- [x] status: verified; verdict SECURED for Phase1 audit scope.

**Approval:** verified 2026-10-07T14:02:28.544Z。
