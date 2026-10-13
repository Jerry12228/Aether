---
phase: quick
plan: 261013-neh
type: execute
autonomous: true
must_haves:
  truths:
    - Phase6工作在codex/phase-06-gamestream独立分支，继承859507d完成状态而不重写原混合历史。
    - 原Phase3分支指针和所有切换前用户未提交/暂存/未跟踪文件保持，不混入迁移提交。
    - Phase6共同完成谓词及关闭gate仍通过，NET三个Complete，主Phase3检查点仍halted。
---

# Phase6独立分支迁移

用户原文“迁移phase6到新规则要求的独立分支；完成phase6”。按gsd-quick --validate内联执行，无子代理。

规则来自当前AGENTS.md：阶段号两位，各阶段独立codex/phase-{phase}-{slug}；可以继承依赖历史，已有混合历史不自动重写。

<tasks>
<task type="auto"><name>安全迁移分支</name><action>在规划编辑前从859507d创建并切换codex/phase-06-gamestream；内存比较diff/index，核对用户未跟踪checkpoint哈希，记录源分支不变。</action><verify><automated>git branch --show-current</automated><fails_when>分支不符或原分支/用户工作改变；不自动stash/reset/cherry-pick。</fails_when></verify></task>
<task type="auto"><name>复核完成状态并留档</name><action>核对原42产品输入、独立关闭gate、GSD共同完成谓词及NET/Phase3状态；新建迁移记录、quick摘要与验证，仅提交列出的规划证据文件。</action><verify><automated>node scripts/verify-phase06-closeout.cjs</automated><fails_when>hash漂移、完成谓词非true或Phase3安装关口丢失；迁移不能冒充新CI/产品测试。</fails_when></verify></task>
</tasks>
