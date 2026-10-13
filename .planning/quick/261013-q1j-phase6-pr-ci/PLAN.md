---
type: quick
phase: "06"
status: executing
workflow: gsd-ship
---

# Phase6主线集成

用户于2026-10-13授权执行已说明的分支推送、PR、冲突解决、CI验证及主线合并。主线为远程main，本地master跟踪origin/main；使用merge commit保留原始证据提交，不重写已有混合历史。

1. 在仓库内干净的临时工作树整合本地master的独立分支规则提交；保留Phase6完成状态及Phase3独立安装关口。
2. 复核验证和安全门槛、正式证据与关闭校验；推送codex/phase-06-gamestream并创建main目标PR，说明Phase3继承范围。
3. 内联审阅集成差异、等待PR的实际CI通过后合并；同步本地master与origin/main，核验用户未提交文件保持原字节，移除临时工作树。

验收：PR merged且主线包含完整Phase6；阶段验证passed，Phase3 halted保持，用户修改未提交且字节不变。CI失败须先修复并重新验证。原始源码/日志/人审快照不改绑至新的集成提交。
