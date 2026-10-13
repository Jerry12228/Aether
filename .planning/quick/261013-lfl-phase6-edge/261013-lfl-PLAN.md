---
phase: quick
plan: 261013-lfl
type: execute
autonomous: true
files_modified: [scripts/verify-phase06-closeout.cjs, tests/phase06-closeout.test.cjs, docs/phase06/06-CLOSEOUT.json, docs/phase06/06-CLOSEOUT.md]
must_haves:
  truths:
    - 三个中文需求的分类器未命中有可复现原因，原探针和人审快照保持原字节。
    - 新显式边界只来自已批准合同和实际具名测试，缺证据/错hash/篡改/advisory隐藏均拒绝。
    - 新旧证据门槛都通过后才关闭Phase6与NET；Phase3当前入口不被覆盖。
---

# 快速任务：Phase6分类补证与规范关闭

授权：用户原文“自行推进完成6”；之前“你自行验证，包括之后项”持续有效。按gsd-quick --validate内联执行，无子代理、无新产品实现、无系统操作。

<tasks>
<task type="auto"><name>追溯分类根因并补建显式边界</name><action>复现GSD英文shape cues对原中文需求的未命中；给NET01/02/03列出合同支持的分类/触发/预期/具名日志。新sidecar经官方probe-core验证，原06-EDGE-PROBE/PLAN/TARGETS/快照保持。</action><verify><automated>node scripts/verify-phase06-closeout.cjs</automated><fails_when>缺少原件hash、分类定义、真实正向case、实际日志或正确源绑定；三原占位无合法后续resolution。</fails_when></verify></task>
<task type="auto"><name>独立关闭门槛与负例</name><action>新增只读closeout verifier和有意义known-bad测试；禁止凭JSON的pass字段通过，禁止假人体批准/隐藏autonomous advisories。保留original flags作历史；当前自主范围判断和持续能力边界明确。</action><verify><automated>node --test tests/phase06-closeout.test.cjs tests/protocol-evidence.test.cjs</automated><fails_when>任一negative未被拒绝、零测试/skip/fail或来源漂移；正式all不通过。</fails_when></verify></task>
<task type="auto"><name>通过共同谓词后关闭阶段</name><action>更新UAT/VERIFICATION/VALIDATION、安全/范围记录，先执行原formal all和新gate；共同UAT+verification谓词通过后以phase.complete完成，保留Phase3/plan3/halted及其他会话Phase7资料。更新NET三项与小任务追踪、提交。</action><verify><automated>node scripts/validate-planning.cjs</automated><fails_when>阶段未规范complete、NET不一致、原Phase3关口丢失或产品/原件被修改。</fails_when></verify></task>
</tasks>
