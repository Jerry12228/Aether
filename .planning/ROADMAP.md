# Roadmap: Aether

## Overview

首个完整版本覆盖五客户端与Windows 10/11服务端全部非TODO需求。先验证系统设备/协议，再建立Windows可用闭环，然后扩展多屏与实例仲裁、上行、码率和剪切板，最终完成各平台交付。下列42个阶段及修订后的协议/Apple验证范围已于2026-10-07获用户批准。早期基础/可行性阶段具有原型验收，不宣称已经交付完整用户功能；后续按能力闭环迭代。

**Apple 实机验收例外（用户已确认）：** iOS/iPadOS、macOS 实现与构建仍纳入 v1，实机功能/性能/安装验收移入 VFY-01/VFY-02 TODO，不阻塞本版及后续阶段。Phase 30–33 以功能实现、目标工具链构建与可运行的自动化检查验收；Phase 37–42 区分实现/构建证据与实机 TODO，不能宣称五端均已实测。构建环境缺口需单独解决，不能用该例外豁免编译。

每阶段通常1–3个计划，单计划尽量2–3个任务；超出一个子系统/验收链路时拆阶段。依赖描述技术先决条件；默认按编号推进，不会自行开展并行多agent实施。此粒度刻意超过GSD通用模板的阶段数量建议，以满足用户降低上下文压力的要求。

## Review Gates

- Phase 1：原功能全集、来源/分发与测试环境范围。
- Phase 3–6：虚拟设备可行性、驱动交付途径和 GameStream 重构扩展 ADR；失败需先解决或调整方案。
- Phase 10：Windows初次可用闭环及性能基线门槛。
- Phase 20：全局租约/实例保活语义。
- Phase 37–42：原功能、稳定性和正式发布。

## Phases

- [ ] **Phase 1: 来源、原功能与环境基线** - 建立可追溯的原功能全集和真实工具/平台验证矩阵
- [ ] **Phase 2: Monorepo 与 Flutter/原生骨架** - 从一个主仓库构建 Helios 和 Selene Windows 骨架
- [ ] **Phase 3: 虚拟显示器可行性** - 在 Win10/11 验证可生产接入的多组虚拟屏 provider
- [ ] **Phase 4: 系统虚拟麦克风可行性** - 证明 PCM 可注入 Win10/11 普通软件的 capture endpoint
- [ ] **Phase 5: Win10/11 系统摄像头可行性** - 证明两个 Windows 版本上的普通软件能选择虚拟摄像头
- [ ] **Phase 6: GameStream 协议重构与扩展** - 基于 GameStream 验证双向、多流、安全与版本化扩展
- [ ] **Phase 7: 配对、发现与设备权限** - 用户可安全添加、配对并撤销 Helios
- [ ] **Phase 8: 持久实例登记与应用生命周期** - 用户能独立创建、运行和显式停止多个应用会话
- [ ] **Phase 9: Windows 捕获与 H.264 基础流** - Helios 可捕获真实桌面并发送基础 H.264 视频
- [ ] **Phase 10: Selene Windows 原生播放闭环** - Windows Selene 能播放 Helios 的实时单流桌面
- [ ] **Phase 11: 桌面和游戏键鼠输入** - Windows 客户端可操作桌面和使用游戏相对输入
- [ ] **Phase 12: 下行系统音频** - 用户可收听桌面/游戏音频并选择音频行为
- [ ] **Phase 13: Windows 三厂商硬编码** - Helios 可使用 NVIDIA/AMD/Intel 可用的硬编码后端
- [ ] **Phase 14: HEVC/AV1 与编解码能力协商** - 按双端硬件选择基础 codec 并保留 H.264 回退
- [ ] **Phase 15: HDR、4:4:4 与色彩呈现** - 保留原高质量视频能力且输出内容正确
- [ ] **Phase 16: 游戏手柄、触摸与高级输入** - 保留游戏及触摸输入能力并追踪平台扩展
- [ ] **Phase 17: 实例显示器组生产生命周期** - 每实例拥有可恢复、断连保留的稳定虚拟屏组
- [ ] **Phase 18: Helios 多显示器与多流资源预算** - 一个实例可按请求提供多个独立显示器视频流
- [ ] **Phase 19: Selene 多显示器呈现与映射** - Windows 多屏用户可选择多流映射到本地屏幕
- [ ] **Phase 20: 主机控制权仲裁与无停止切换** - 任意并发客户端操作下整机最多一个实例被控
- [ ] **Phase 21: 真实客户端麦克风上行** - 客户端麦克风可被主机普通软件实时使用
- [ ] **Phase 22: 真实客户端摄像头上行** - 客户端摄像头可被主机 Win10/11 普通软件使用
- [ ] **Phase 23: 连接内手动码率修改** - 用户可以保持连接与实例不变更改码率
- [ ] **Phase 24: 可选自动码率与多流分配** - 用户可启用基于真实反馈的码率修正
- [ ] **Phase 25: 文本剪切板同步** - 用户可授权在双端同步文本
- [ ] **Phase 26: 富文本与图片剪切板** - 在平台允许范围保留常用非文本复制粘贴
- [ ] **Phase 27: 应用管理与 Helios 管理入口** - 保留原主机管理和应用配置能力
- [ ] **Phase 28: Android 播放与交互** - Android Selene 在同一共享核心上完成桌面/游戏闭环
- [ ] **Phase 29: Android 外设、多屏与系统集成** - Android 支持全部新增功能及可用平台高级能力
- [ ] **Phase 30: macOS 播放与交互** - macOS 原生音视频/交互实现与构建，实机验证 TODO
- [ ] **Phase 31: macOS 外设、多屏与系统集成** - macOS 支持全部新增功能及平台高级能力
- [ ] **Phase 32: iOS/iPadOS 播放与交互** - iOS/Pad 原生串流实现与构建，实机验证 TODO
- [ ] **Phase 33: iOS/iPadOS 外设、外屏与系统集成** - iOS/Pad 支持全部新增功能及硬件允许的多屏
- [ ] **Phase 34: Linux 播放与交互** - Linux Selene 完成音视频和桌面/游戏闭环
- [ ] **Phase 35: Linux 外设、多屏与系统集成** - Linux 支持全部新增功能及可用系统能力
- [ ] **Phase 36: 网络、唤醒与诊断** - 保留跨网络连接能力并提供可定位故障的信息
- [ ] **Phase 37: 原功能全量对照复审** - 完成固定来源原功能矩阵的逐项保留验证
- [ ] **Phase 38: 故障恢复与性能收敛** - 桌面和游戏负载下达到经确认的稳定与性能门槛
- [ ] **Phase 39: Windows 产品与虚拟设备交付** - Windows 双端可干净安装、升级、服务运行与卸载
- [ ] **Phase 40: macOS 与 Linux 桌面客户端交付** - 桌面两端有可安装、升级及验证的包
- [ ] **Phase 41: Android 与 iOS/Pad 客户端交付** - 移动两端具有明确签名与分发渠道
- [ ] **Phase 42: 完整版本端到端验收与文档** - 交付全部非TODO能力与五端，并完成用户验收

## Phase Details

### Phase 1: 来源、原功能与环境基线

**Goal:** 建立可追溯的原功能全集和真实工具/平台验证矩阵
**Depends on:** Nothing (first phase)
**Requirements:** BASE-01, BASE-02, BASE-03
**Success Criteria**:

1. 原功能表覆盖各端设置/媒体/输入/管理，遗漏能力补入 v1 需求，不自动延后。
2. 工具探测和来源审计有可复现记录；性能数值明确为待基线测量后确认。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 2: Monorepo 与 Flutter/原生骨架

**Goal:** 从一个主仓库构建 Helios 和 Selene Windows 骨架
**Depends on:** Phase 1
**Requirements:** CORE-01, CORE-02, CORE-03
**Success Criteria**:

1. Windows 双端骨架从干净 checkout 可构建，核心不依赖 Qt 或 Flutter。
2. 跨边界句柄创建/释放、错误回调和停止均有契约验证，记录 texture/surface 原型结论。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 3: 虚拟显示器可行性

**Goal:** 在 Win10/11 验证可生产接入的多组虚拟屏 provider
**Depends on:** Phase 1, Phase 2
**Requirements:** VDP-01, VDP-02
**Success Criteria**:

1. 两组创建、重开、删一组不影响另一组；记录分辨率/刷新率/HDR条件。
2. 原型与正式分发差异清楚；仅测试签名或来源不明不能通过生产可行性结论。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 4: 系统虚拟麦克风可行性

**Goal:** 证明 PCM 可注入 Win10/11 普通软件的 capture endpoint
**Depends on:** Phase 1, Phase 2
**Requirements:** MIC-01, MIC-02
**Success Criteria**:

1. 普通 capture consumer 录音内容正确，证明有可用数据入口而非仅枚举设备。
2. 默认安全配置下的发布途径有依据；不可行时登记阻碍，不能用虚拟扬声器冒充麦克风。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 5: Win10/11 系统摄像头可行性

**Goal:** 证明两个 Windows 版本上的普通软件能选择虚拟摄像头
**Depends on:** Phase 1, Phase 2
**Requirements:** CAM-01, CAM-02
**Success Criteria**:

1. Win10 与 Win11 分别记录 MF/DirectShow consumer 和代表会议软件结果。
2. Win10 不调用仅 Win11 支持的创建 API；若需要驱动，签名分发方案与失败清理明确。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 6: GameStream 协议重构与扩展

**Goal:** 基于 NVIDIA GameStream 重构协议，验证双向、多流、安全与 Aether 版本化扩展
**Depends on:** Phase 2
**Requirements:** NET-01, NET-02, NET-03
**Success Criteria**:

1. 固定 GameStream 开源实现基线与字段/通道映射，说明保留、重构和扩展项；Aether 版本/能力协商、独立连接/流上下文和测试向量可复现。
2. 双向模拟媒体和至少两条独立视频流通过；包大小、时间戳、FEC/丢包恢复、安全密钥/nonce边界及有界队列明确，覆盖五端原生核心构建与可运行的自动化检查，Apple 实机验证另列 TODO；不要求旧端互通。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 7: 配对、发现与设备权限

**Goal:** 用户可安全添加、配对并撤销 Helios
**Depends on:** Phase 6
**Requirements:** AUTH-01, AUTH-02, AUTH-03
**Success Criteria**:

1. 两台设备可发现/手工配对；新设备默认权限清楚且不自动获得上行设备授权。
2. 撤销、错误身份、权限不足与重放均被拒绝；密钥不写入普通日志。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 8: 持久实例登记与应用生命周期

**Goal:** 用户能独立创建、运行和显式停止多个应用会话
**Depends on:** Phase 2, Phase 7
**Requirements:** INST-01, INST-02, INST-03
**Success Criteria**:

1. A/B/C 实例运行、全断连、再连接，记录同一实例身份和进程存活。
2. 停止 B 不影响 A/C；持久配置与重启恢复策略区别于进程跨重启保活。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 9: Windows 捕获与 H.264 基础流

**Goal:** Helios 可捕获真实桌面并发送基础 H.264 视频
**Depends on:** Phase 6, Phase 8
**Requirements:** VIDEO-01, VIDEO-02
**Success Criteria**:

1. 真实桌面变化到接收端解码样本，分辨率/帧率/时间戳正确。
2. 捕获来源丢失和桌面尺寸变化不会无界排队或终止实例。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 10: Selene Windows 原生播放闭环

**Goal:** Windows Selene 能播放 Helios 的实时单流桌面
**Depends on:** Phase 9, Phase 7
**Requirements:** WIN-01, WIN-02
**Success Criteria**:

1. 干净安装环境完成配对→连接→看真实桌面→断开→重连。
2. 记录解码/presentation 与 UI 响应性能，不逐帧跨 Dart 通道搬运视频。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 11: 桌面和游戏键鼠输入

**Goal:** Windows 客户端可操作桌面和使用游戏相对输入
**Depends on:** Phase 10
**Requirements:** INPUT-01, INPUT-02
**Success Criteria**:

1. 桌面点击、拖拽、滚轮、键盘组合与游戏转向均正确。
2. 未授权/过期输入拒绝，焦点变化和断连无卡键。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 12: 下行系统音频

**Goal:** 用户可收听桌面/游戏音频并选择音频行为
**Depends on:** Phase 10
**Requirements:** AUDIO-01, AUDIO-02
**Success Criteria**:

1. 声道映射、音画同步、无物理音频设备与设备切换场景有结果。
2. 共享系统音频边界明确，不把显示器组宣传为音频隔离。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 13: Windows 三厂商硬编码

**Goal:** Helios 可使用 NVIDIA/AMD/Intel 可用的硬编码后端
**Depends on:** Phase 9
**Requirements:** ENC-01, ENC-02, ENC-03
**Success Criteria**:

1. 三厂商各有实机或可追溯测试证据，无支持设备时明确未验证。
2. 编码失败/设备重置可解释回退，不静默改变实例或控制连接。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 14: HEVC/AV1 与编解码能力协商

**Goal:** 按双端硬件选择基础 codec 并保留 H.264 回退
**Depends on:** Phase 10, Phase 13
**Requirements:** CODEC-01, CODEC-02
**Success Criteria**:

1. H.264/HEVC/AV1 真实码流可播放，协商结果与实际后端一致。
2. 未知 profile、硬解资源不足或不支持时错误/回退可观测。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 15: HDR、4:4:4 与色彩呈现

**Goal:** 保留原高质量视频能力且输出内容正确
**Depends on:** Phase 14
**Requirements:** COLOR-01, COLOR-02
**Success Criteria**:

1. HDR与SDR切换、色阶/亮度、4:4:4测试内容通过；记录虚拟/物理屏限制。
2. 原生呈现方案满足颜色条件，不能以 UI 开关存在作为支持证据。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 16: 游戏手柄、触摸与高级输入

**Goal:** 保留游戏及触摸输入能力并追踪平台扩展
**Depends on:** Phase 11
**Requirements:** GAME-01, GAME-02
**Success Criteria**:

1. 手柄类型/数量、回传反馈、断连清零、触摸和笔逐项验证。
2. Windows 虚拟 HID provider 许可/签名/维护路径明确，未验证扩展不假称完成。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 17: 实例显示器组生产生命周期

**Goal:** 每实例拥有可恢复、断连保留的稳定虚拟屏组
**Depends on:** Phase 3, Phase 8, Phase 9
**Requirements:** DISPLAY-01, DISPLAY-02, DISPLAY-03
**Success Criteria**:

1. A/B 各组可创建/调参，断连重连 Windows 布局身份稳定。
2. 停止/创建失败/驱动重置清理范围正确，没有幽灵屏或其他实例屏被误删。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 18: Helios 多显示器与多流资源预算

**Goal:** 一个实例可按请求提供多个独立显示器视频流
**Depends on:** Phase 13, Phase 14, Phase 17
**Requirements:** MULTI-01, MULTI-02
**Success Criteria**:

1. 至少两屏不同内容独立编码/传输，时间戳和显示器映射正确。
2. 部分启动失败整体回滚或报告明确部分结果，不占用泄漏资源。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 19: Selene 多显示器呈现与映射

**Goal:** Windows 多屏用户可选择多流映射到本地屏幕
**Depends on:** Phase 10, Phase 11, Phase 18
**Requirements:** MULTI-03, MULTI-04
**Success Criteria**:

1. 双本地屏显示两个独立远程屏，用户可单流或多流选择。
2. DPI差异、旋转、负坐标和拔屏后映射/输入不串屏。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 20: 主机控制权仲裁与无停止切换

**Goal:** 任意并发客户端操作下整机最多一个实例被控
**Depends on:** Phase 8, Phase 11, Phase 16, Phase 17, Phase 19
**Requirements:** LEASE-01, LEASE-02, LEASE-03
**Success Criteria**:

1. A/B/C切换、同时争用、断连/重连、租约超时及协调器异常验证不变量。
2. 旧按键/手柄状态释放；显式 Stop 与 Disconnect 操作明显分开。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 21: 真实客户端麦克风上行

**Goal:** 客户端麦克风可被主机普通软件实时使用
**Depends on:** Phase 4, Phase 6, Phase 12, Phase 20
**Requirements:** MIC-03, MIC-04
**Success Criteria**:

1. 实际客户端采集→上行→系统capture consumer完整闭环，测量延迟/漂移。
2. 权限拒绝、断连、切换及与下行同时工作不串音，提供回声处理策略。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 22: 真实客户端摄像头上行

**Goal:** 客户端摄像头可被主机 Win10/11 普通软件使用
**Depends on:** Phase 5, Phase 6, Phase 20
**Requirements:** CAM-03, CAM-04
**Success Criteria**:

1. 实际摄像头→上行codec→Win10/11虚拟设备→代表应用显示完整闭环。
2. 隐私开关/权限拒绝/设备拔除/多流竞争可见，无旧会话画面泄漏。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 23: 连接内手动码率修改

**Goal:** 用户可以保持连接与实例不变更改码率
**Depends on:** Phase 13, Phase 18
**Requirements:** RATE-01, RATE-02
**Success Criteria**:

1. 连续上下调与重复/过期请求测试，连接ID与实例ID不变。
2. 三硬编后端分别记录重配/内部替换路径及短暂卡顿预算。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 24: 可选自动码率与多流分配

**Goal:** 用户可启用基于真实反馈的码率修正
**Depends on:** Phase 23, Phase 18
**Requirements:** RATE-03, RATE-04
**Success Criteria**:

1. 阶跃带宽/丢包/RTT场景中降速和恢复受控，媒体队列不会持续增长。
2. 关闭自动模式后手动值保持；单流瓶颈不拖垮所有流。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 25: 文本剪切板同步

**Goal:** 用户可授权在双端同步文本
**Depends on:** Phase 7, Phase 20
**Requirements:** CLIP-01, CLIP-02
**Success Criteria**:

1. 中文/多行/空文本双向同步，revision去重与冲突策略一致。
2. 关闭/撤权和过期租约均阻止更新，日志不记录剪切板正文。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 26: 富文本与图片剪切板

**Goal:** 在平台允许范围保留常用非文本复制粘贴
**Depends on:** Phase 25
**Requirements:** CLIP-03, CLIP-04
**Success Criteria**:

1. 代表应用复制HTML与图片到另一端，格式/大小/回环和错误输入验证通过。
2. 本地文件路径不伪装成已完成文件互传。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 27: 应用管理与 Helios 管理入口

**Goal:** 保留原主机管理和应用配置能力
**Depends on:** Phase 8, Phase 7
**Requirements:** ADMIN-01, ADMIN-02, ADMIN-03
**Success Criteria**:

1. 原配置/应用管理基线条目逐项对应新入口，脚本绑定正确实例。
2. 非管理客户端不能任意改配置或执行命令，停止清理不影响其他实例。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 28: Android 播放与交互

**Goal:** Android Selene 在同一共享核心上完成桌面/游戏闭环
**Depends on:** Phase 10, Phase 11, Phase 12, Phase 14, Phase 16
**Requirements:** ANDROID-01, ANDROID-02
**Success Criteria**:

1. 手机/平板实机桌面和游戏闭环，硬解/软解与原输入能力有证据。
2. 生命周期变化不误停主机实例，共享协议不在 Kotlin/Java 重写。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 29: Android 外设、多屏与系统集成

**Goal:** Android 支持全部新增功能及可用平台高级能力
**Depends on:** Phase 28, Phase 19, Phase 20, Phase 21, Phase 22, Phase 24, Phase 26
**Requirements:** ANDROID-03, ANDROID-04
**Success Criteria**:

1. Android新增功能逐项端到端，权限撤销与后台限制明确。
2. 外屏和多Display在支持实机验证，不支持设备给出能力状态。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 30: macOS 播放与交互

**Goal:** macOS Selene 完成原生音视频、桌面/游戏交互实现与构建，实机验证 TODO
**Depends on:** Phase 10, Phase 11, Phase 12, Phase 14, Phase 16
**Requirements:** MAC-01, MAC-02
**Success Criteria**:

1. 桌面/游戏、VideoToolbox/Metal、音频及输入实现完整，macOS 目标构建与可运行的契约/自动化检查有证据；实机结果列 VFY-02 TODO。
2. Apple adapter 与共享核心在同仓库集成，窗口/全屏、焦点与睡眠恢复路径有实现检查和实机验证清单，不冒充硬件通过。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 31: macOS 外设、多屏与系统集成

**Goal:** macOS 支持全部新增功能及平台高级能力
**Depends on:** Phase 30, Phase 19, Phase 20, Phase 21, Phase 22, Phase 24, Phase 26
**Requirements:** MAC-03, MAC-04
**Success Criteria**:

1. 权限、外屏/多窗/DPI、上行、剪切板/码率/切换实现并通过目标构建及可运行的自动化检查；对应实机结果列 VFY-02 TODO。
2. 授权前不采集、睡眠/恢复不误停实例等控制路径有契约证据；真实设备、HDR、热插拔与性能仍标记未经实机验证。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 32: iOS/iPadOS 播放与交互

**Goal:** iOS/iPadOS Selene 完成移动原生串流实现与构建，实机验证 TODO
**Depends on:** Phase 30, Phase 11, Phase 12, Phase 14, Phase 16
**Requirements:** IOS-01, IOS-02
**Success Criteria**:

1. iPhone/iPad 音视频与触摸/外接输入实现完整，目标构建及可运行的自动化/模拟器检查有证据；真实设备结果列 VFY-01 TODO。
2. Apple 共享模块与平台生命周期路径有实现/契约检查，恢复不重建实例、断连不停止；硬解/音频会话/前后台实机行为留待验证。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 33: iOS/iPadOS 外设、外屏与系统集成

**Goal:** iOS/Pad 支持全部新增功能及硬件允许的多屏
**Depends on:** Phase 32, Phase 19, Phase 20, Phase 21, Phase 22, Phase 24, Phase 26
**Requirements:** IOS-03, IOS-04
**Success Criteria**:

1. 上行采集/权限、剪切板、动态码率和切换路径实现并完成目标构建与可运行的自动化检查；真实采集→Windows设备闭环列 VFY-01 TODO。
2. iPad 独立外屏/多流和 HDR 能力路径已实现，实机外屏/权限/性能场景列 VFY-01 TODO；不能用模拟器或镜像结果声称独立多流已验证。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 34: Linux 播放与交互

**Goal:** Linux Selene 完成音视频和桌面/游戏闭环
**Depends on:** Phase 10, Phase 11, Phase 12, Phase 14, Phase 16
**Requirements:** LINUX-01, LINUX-02
**Success Criteria**:

1. 指定Linux发行版实机桌面和游戏闭环，实际decoder/audio后端可见。
2. 窗口系统权限/输入限制有功能级状态，不仅运行Flutter界面。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 35: Linux 外设、多屏与系统集成

**Goal:** Linux 支持全部新增功能及可用系统能力
**Depends on:** Phase 34, Phase 19, Phase 20, Phase 21, Phase 22, Phase 24, Phase 26
**Requirements:** LINUX-03, LINUX-04
**Success Criteria**:

1. 两种窗口系统上的新增功能和受限行为分别留证据。
2. 多屏坐标/DPI映射与设备权限正确，UI层不复制协议实现。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 36: 网络、唤醒与诊断

**Goal:** 保留跨网络连接能力并提供可定位故障的信息
**Depends on:** Phase 7, Phase 24, Phase 29, Phase 31, Phase 33, Phase 35
**Requirements:** OPS-01, OPS-02
**Success Criteria**:

1. LAN/IPv6/互联网直连/已配置外部VPN网络测试，WoL条件说明与结果一致。
2. 诊断和配置输出脱敏；内置VPN/TURN服务不被误报已实现。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 37: 原功能全量对照复审

**Goal:** 完成固定来源原功能矩阵的逐项保留验证
**Depends on:** Phase 15, Phase 16, Phase 27, Phase 29, Phase 31, Phase 33, Phase 35, Phase 36
**Requirements:** PARITY-01, PARITY-02
**Success Criteria**:

1. 功能矩阵逐行对应需求和测试，按本版验收层级记录通过或待修；实现缺失与已批准的 Apple 实机 TODO 分别标识。
2. Apple 两端实现/构建检查必须完成，实机结果明确列已批准的 VFY TODO；不以库存功能计数或构建成功冒充实机支持，新增遗漏拆阶段补齐。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 38: 故障恢复与性能收敛

**Goal:** 桌面和游戏负载下达到经确认的稳定与性能门槛
**Depends on:** Phase 20, Phase 24, Phase 37
**Requirements:** QUALITY-01, QUALITY-02, QUALITY-03
**Success Criteria**:

1. 故障注入与长时运行报告含进程/显示器/租约状态和资源趋势。
2. Windows/Android/Linux 与固定 Moonlight/Sunshine 基线比较，桌面文字与游戏帧时分别有验收结论；Apple 保留测量接口/场景，实机性能与长时运行列 VFY TODO。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 39: Windows 产品与虚拟设备交付

**Goal:** Windows 双端可干净安装、升级、服务运行与卸载
**Depends on:** Phase 27, Phase 38, Phase 3, Phase 4, Phase 5
**Requirements:** SHIP-01, SHIP-02
**Success Criteria**:

1. 默认安全配置设备进行安装/升级/卸载，不能要求发布用户开启测试签名。
2. 服务Session0不误捕获；用户注销/重启的恢复语义明确，现有运行实例不被升级偷偷终止。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 40: macOS 与 Linux 桌面客户端交付

**Goal:** 桌面两端有可安装、升级及验证的包
**Depends on:** Phase 31, Phase 35, Phase 38
**Requirements:** SHIP-03, SHIP-04
**Success Criteria**:

1. Linux 在干净目标环境安装后完成连接与核心新功能抽验；macOS 完成目标构建、候选包/签名/公证检查，实机安装/升级与功能抽验列 VFY-02 TODO。
2. 包不依赖references目录，依赖/SBOM/来源说明随产品可追溯。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 41: Android 与 iOS/Pad 客户端交付

**Goal:** 移动两端具有明确签名与分发渠道
**Depends on:** Phase 29, Phase 33, Phase 38, Phase 1
**Requirements:** SHIP-05, SHIP-06
**Success Criteria**:

1. Android 真实安装包完成串流和上行设备抽验；iOS/Pad 完成目标构建、候选包/签名检查，实机安装/升级与设备抽验列 VFY-01 TODO。
2. 来源许可与渠道审计无悬而未决项；不能用未验证App Store兼容性完成发布。

**Plans:** TBD（规划时拆为1–3个小计划）

### Phase 42: 完整版本端到端验收与文档

**Goal:** 交付全部非TODO能力与五端，并完成用户验收
**Depends on:** Phase 39, Phase 40, Phase 41, Phase 37
**Requirements:** RELEASE-01, RELEASE-02, RELEASE-03
**Success Criteria**:

1. Windows/Android/Linux、Win10/11 系统设备、A/B/C实例与适用双屏故事实机验收通过；iOS/macOS 完成实现/构建/可运行的自动化检查，实机结果逐项列 VFY TODO。
2. 所有 v1 需求和原功能满足本版规定的验收层级，Apple 候选产物与说明标明未经实机验证；VFY TODO 不阻塞本版，用户确认后才发布，当前初始化不计功能完成。

**Plans:** TBD（规划时拆为1–3个小计划）

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 来源、原功能与环境基线 | 0/TBD | Not started | - |
| 2. Monorepo 与 Flutter/原生骨架 | 0/TBD | Not started | - |
| 3. 虚拟显示器可行性 | 0/TBD | Not started | - |
| 4. 系统虚拟麦克风可行性 | 0/TBD | Not started | - |
| 5. Win10/11 系统摄像头可行性 | 0/TBD | Not started | - |
| 6. GameStream 协议重构与扩展 | 0/TBD | Not started | - |
| 7. 配对、发现与设备权限 | 0/TBD | Not started | - |
| 8. 持久实例登记与应用生命周期 | 0/TBD | Not started | - |
| 9. Windows 捕获与 H.264 基础流 | 0/TBD | Not started | - |
| 10. Selene Windows 原生播放闭环 | 0/TBD | Not started | - |
| 11. 桌面和游戏键鼠输入 | 0/TBD | Not started | - |
| 12. 下行系统音频 | 0/TBD | Not started | - |
| 13. Windows 三厂商硬编码 | 0/TBD | Not started | - |
| 14. HEVC/AV1 与编解码能力协商 | 0/TBD | Not started | - |
| 15. HDR、4:4:4 与色彩呈现 | 0/TBD | Not started | - |
| 16. 游戏手柄、触摸与高级输入 | 0/TBD | Not started | - |
| 17. 实例显示器组生产生命周期 | 0/TBD | Not started | - |
| 18. Helios 多显示器与多流资源预算 | 0/TBD | Not started | - |
| 19. Selene 多显示器呈现与映射 | 0/TBD | Not started | - |
| 20. 主机控制权仲裁与无停止切换 | 0/TBD | Not started | - |
| 21. 真实客户端麦克风上行 | 0/TBD | Not started | - |
| 22. 真实客户端摄像头上行 | 0/TBD | Not started | - |
| 23. 连接内手动码率修改 | 0/TBD | Not started | - |
| 24. 可选自动码率与多流分配 | 0/TBD | Not started | - |
| 25. 文本剪切板同步 | 0/TBD | Not started | - |
| 26. 富文本与图片剪切板 | 0/TBD | Not started | - |
| 27. 应用管理与 Helios 管理入口 | 0/TBD | Not started | - |
| 28. Android 播放与交互 | 0/TBD | Not started | - |
| 29. Android 外设、多屏与系统集成 | 0/TBD | Not started | - |
| 30. macOS 播放与交互 | 0/TBD | Not started | - |
| 31. macOS 外设、多屏与系统集成 | 0/TBD | Not started | - |
| 32. iOS/iPadOS 播放与交互 | 0/TBD | Not started | - |
| 33. iOS/iPadOS 外设、外屏与系统集成 | 0/TBD | Not started | - |
| 34. Linux 播放与交互 | 0/TBD | Not started | - |
| 35. Linux 外设、多屏与系统集成 | 0/TBD | Not started | - |
| 36. 网络、唤醒与诊断 | 0/TBD | Not started | - |
| 37. 原功能全量对照复审 | 0/TBD | Not started | - |
| 38. 故障恢复与性能收敛 | 0/TBD | Not started | - |
| 39. Windows 产品与虚拟设备交付 | 0/TBD | Not started | - |
| 40. macOS 与 Linux 桌面客户端交付 | 0/TBD | Not started | - |
| 41. Android 与 iOS/Pad 客户端交付 | 0/TBD | Not started | - |
| 42. 完整版本端到端验收与文档 | 0/TBD | Not started | - |

*Last updated: 2026-10-07; approved by user*
