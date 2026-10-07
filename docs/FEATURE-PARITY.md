# 原功能保留基线

基线日期：2026-10-07。Qt Windows 单能力 tracer 子集；未完成全平台审计。结构校验 PASS；产品功能均未实现/实测。固定来源见 [来源审计](SOURCE-AUDIT.md)，正式数据见 [features.json](baseline/features.json)。

“不砍功能”以指定五平台及 Windows 10/11 服务端的适用原用户能力为边界。保留 GameStream 重构基础、单一 Flutter UI、原生实时路径、主机唯一控制租约；断连/切换保留实例和显示组，只有显式停止才清理。本阶段不批准源码生产复用。

iOS/iPadOS、macOS 仅实机验收分别延后 VFY-01/VFY-02；实现、构建与自动化仍属 v1。源码/API存在不等于平台支持；硬件、OS 和架构条件逐项保留。

## 覆盖摘要

能力 1，入口 1，独立案例 1；未映射 0，开放冲突 0。

## 平台原子能力

| ID / 平台 | 原行为 → Aether | 条件 / 责任层 | 需求 / 主要阶段 / 案例 | 固定证据 |
|---|---|---|---|---|
| qt-windows-reverse-scroll / selene-windows | 启用 reverseScrollDirection 后垂直及水平鼠标滚轮方向反转，精确滚轮保持精度 → 在唯一有效租约内按偏好发送滚轮；迟到epoch拒绝；断连不停止实例 | Windows；实际最低版本待平台基线；Qt 构建目标；Aether 候选架构待审阅；提供垂直/水平及精确滚轮的鼠标 / shared-native | INPUT-01 / 11 / case-qt-windows-reverse-scroll | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:155 (reverseScrollDirection)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:16 (preference consumption)`<br>`moonlight-qt@de2467e43382:app/streaming/input/mouse.cpp:204 (high-resolution reverse wheel)` |

## 设置与非设置入口覆盖

### qt-windows-scroll-setting

moonlight-qt / selene-windows / setting / `app/settings/streamingpreferences.h`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| reverseScrollDirection | mapped / qt-windows-reverse-scroll | 真实设置经 input.cpp 进入 mouse.cpp 滚轮分支 |

## 独立验收案例

### case-qt-windows-reverse-scroll

平台 selene-windows；Phase 11；planned，未执行。

- 前提：使用具备垂直/水平滚轮的鼠标连接已配对实例并取得租约
- 步骤：关闭反向滚动，测试上下/左右及精确滚轮；开启反向滚动，对同一可滚动桌面应用重复动作；切换实例后投递旧epoch事件
- 期望：开启后各轴方向与关闭时相反，精确事件保留亚步进精度；旧epoch事件不影响新实例；原实例继续运行
- 负例：无控制权滚轮拒绝；断连不触发StopInstance；不支持精确滚轮的设备明确按整数回退
- 证据：原生实现；Windows构建；协议输入自动化；Windows真实鼠标测试

## 原行为与约束冲突

当前子集无已登记冲突。

Phase 37 逐行复审，Phase 42 最终验收。BASE-01 edge flag 仍 unclassified/unresolved；descriptor-less prohibitions 仍 flagged-unverified。结构 PASS 不代替语义穷尽性、人审、构建或硬件验证。
