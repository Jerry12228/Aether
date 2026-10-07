# 原功能保留基线

基线日期：2026-10-07。平台盘点已展开，语义穷尽性仍待最终人审。结构校验 PASS；产品功能均未实现/实测。固定来源见 [来源审计](SOURCE-AUDIT.md)，正式数据见 [features.json](baseline/features.json)。

“不砍功能”以指定五平台及 Windows 10/11 服务端的适用原用户能力为边界。保留 GameStream 重构基础、单一 Flutter UI、原生实时路径、主机唯一控制租约；断连/切换保留实例和显示组，只有显式停止才清理。本阶段不批准源码生产复用。

iOS/iPadOS、macOS 仅实机验收分别延后 VFY-01/VFY-02；实现、构建与自动化仍属 v1。源码/API存在不等于平台支持；硬件、OS 和架构条件逐项保留。

## 覆盖摘要

能力 637，入口 117，独立案例 637；未映射 0，开放冲突 3。

## 平台原子能力

| ID / 平台 | 原行为 → Aether | 条件 / 责任层 | 需求 / 主要阶段 / 案例 | 固定证据 |
|---|---|---|---|---|
| helios-windows10-adapter-name / helios-windows10 | Windows 主机配置 adapter_name 控制“GPU适配器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“GPU适配器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-01 / 9 / case-helios-windows10-adapter-name | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:45 ("adapter_name":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1710 ("adapter_name")` |
| helios-windows10-address-family / helios-windows10 | Windows 主机配置 address_family 控制“IPv4/IPv6”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“IPv4/IPv6”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows10-address-family | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:70 ("address_family":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1879 ("address_family")` |
| helios-windows10-always-send-scancodes / helios-windows10 | Windows 主机配置 always_send_scancodes 控制“扫描码策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“扫描码策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-always-send-scancodes | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:29 ("always_send_scancodes":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1860 ("always_send_scancodes")` |
| helios-windows10-amd-coder / helios-windows10 | Windows 主机配置 amd_coder 控制“amd后端参数 amd_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-coder | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:142 ("amd_coder":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1652 ("amd_coder")` |
| helios-windows10-amd-enforce-hrd / helios-windows10 | Windows 主机配置 amd_enforce_hrd 控制“amd后端参数 amd_enforce_hrd”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_enforce_hrd”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-enforce-hrd | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:137 ("amd_enforce_hrd":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1669 ("amd_enforce_hrd")` |
| helios-windows10-amd-max-au-size / helios-windows10 | Windows 主机配置 amd_max_au_size 控制“amd后端参数 amd_max_au_size”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_max_au_size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-max-au-size | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:138 ("amd_max_au_size":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1672 ("amd_max_au_size")` |
| helios-windows10-amd-preanalysis / helios-windows10 | Windows 主机配置 amd_preanalysis 控制“amd后端参数 amd_preanalysis”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_preanalysis”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-preanalysis | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:140 ("amd_preanalysis":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1667 ("amd_preanalysis")` |
| helios-windows10-amd-quality / helios-windows10 | Windows 主机配置 amd_quality 控制“amd后端参数 amd_quality”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_quality”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-quality | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:139 ("amd_quality":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1643 ("amd_quality")` |
| helios-windows10-amd-rc / helios-windows10 | Windows 主机配置 amd_rc 控制“amd后端参数 amd_rc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_rc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-rc | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:136 ("amd_rc":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1651 ("amd_rc")` |
| helios-windows10-amd-usage / helios-windows10 | Windows 主机配置 amd_usage 控制“amd后端参数 amd_usage”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_usage”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-usage | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:135 ("amd_usage":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1660 ("amd_usage")` |
| helios-windows10-amd-vbaq / helios-windows10 | Windows 主机配置 amd_vbaq 控制“amd后端参数 amd_vbaq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_vbaq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-amd-vbaq | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:141 ("amd_vbaq":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1668 ("amd_vbaq")` |
| helios-windows10-apps / helios-windows10 | 应用进程/准备/清理命令 → 保留“应用进程/准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ADMIN-01 / 27 / case-helios-windows10-apps | `sunshine@7c23c32925d2:src/process.cpp:152 (prep)` |
| helios-windows10-audio / helios-windows10 | Windows系统音频捕获与Opus → 保留“Windows系统音频捕获与Opus”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | AUDIO-01 / 12 / case-helios-windows10-audio | `sunshine@7c23c32925d2:src/audio.cpp:9 (opus)` |
| helios-windows10-audio-sink / helios-windows10 | Windows 主机配置 audio_sink 控制“系统音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“系统音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows10-audio-sink | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:41 ("audio_sink":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1750 ("audio_sink")` |
| helios-windows10-av1-mode / helios-windows10 | Windows 主机配置 av1_mode 控制“AV1协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“AV1协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | CODEC-02 / 14 / case-helios-windows10-av1-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:102 ("av1_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1610 ("av1_mode")` |
| helios-windows10-back-button-timeout / helios-windows10 | Windows 主机配置 back_button_timeout 控制“Back长按策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“Back长按策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-back-button-timeout | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:25 ("back_button_timeout":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1819 ("back_button_timeout")` |
| helios-windows10-bind-address / helios-windows10 | Windows 主机配置 bind_address 控制“监听地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“监听地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows10-bind-address | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:71 ("bind_address":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1880 ("bind_address")` |
| helios-windows10-capture / helios-windows10 | Windows 主机配置 capture 控制“捕获provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“捕获provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows10-capture | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:103 ("capture":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1708 ("capture")` |
| helios-windows10-capture-frame / helios-windows10 | Windows物理显示器/GPU捕获 → 保留“Windows物理显示器/GPU捕获”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | VIDEO-01 / 9 / case-helios-windows10-capture-frame | `sunshine@7c23c32925d2:src/platform/windows/display_vram.cpp:174 (DXGI)` |
| helios-windows10-cert / helios-windows10 | Windows 主机配置 cert 控制“证书路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“证书路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-cert | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:90 ("cert":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1738 ("cert")` |
| helios-windows10-clipboard / helios-windows10 | 剪切板同步 → 保留“剪切板同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | CLIP-01 / 25 / case-helios-windows10-clipboard | `apollo@adc5c5a0bd80:README.md:9 (Clipboard sync)` |
| helios-windows10-clipboard-permission / helios-windows10 | 剪切板入站单独检查clipboard_set权限 → 保留“剪切板入站单独检查clipboard_set权限”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | CLIP-02 / 25 / case-helios-windows10-clipboard-permission | `apollo@adc5c5a0bd80:src/stream.cpp:1040 (PERM::clipboard_set)` |
| helios-windows10-connection-hooks / helios-windows10 | 连接/断连命令钩子 → 保留“连接/断连命令钩子”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-06 / 27 / case-helios-windows10-connection-hooks | `apollo@adc5c5a0bd80:README.md:10 (Commands for client)` |
| helios-windows10-controller / helios-windows10 | Windows 主机配置 controller 控制“控制器输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“控制器输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-controller | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:18 ("controller":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1858 ("controller")` |
| helios-windows10-controller-motion / helios-windows10 | 控制器运动/触摸/电池消费 → 保留“控制器运动/触摸/电池消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | GAME-01 / 16 / case-helios-windows10-controller-motion | `sunshine@7c23c32925d2:src/input.cpp:659 (controller motion)` |
| helios-windows10-credentials-file / helios-windows10 | Windows 主机配置 credentials_file 控制“管理凭据路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“管理凭据路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-credentials-file | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:87 ("credentials_file":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1745 ("credentials_file")` |
| helios-windows10-csrf-allowed-origins / helios-windows10 | Windows 主机配置 csrf_allowed_origins 控制“CSRF允许来源”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“CSRF允许来源”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-03 / 27 / case-helios-windows10-csrf-allowed-origins | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:74 ("csrf_allowed_origins":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1759 ("csrf_allowed_origins")` |
| helios-windows10-dd-config-revert-delay / helios-windows10 | Windows 主机配置 dd_config_revert_delay 控制“显示恢复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“显示恢复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-config-revert-delay | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:54 ("dd_config_revert_delay":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1721 ("dd_config_revert_delay")` |
| helios-windows10-dd-config-revert-on-disconnect / helios-windows10 | Windows 主机配置 dd_config_revert_on_disconnect 控制“断连恢复显示旧策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 普通断连/切换保留实例显示组及拓扑；显式StopInstance才清理本组，旧自动恢复策略仅能作用于非实例拥有资源 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-config-revert-on-disconnect | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:55 ("dd_config_revert_on_disconnect":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1726 ("dd_config_revert_on_disconnect")` |
| helios-windows10-dd-configuration-option / helios-windows10 | Windows 主机配置 dd_configuration_option 控制“显示设备拓扑配置”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“显示设备拓扑配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-configuration-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:47 ("dd_configuration_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1713 ("dd_configuration_option")` |
| helios-windows10-dd-hdr-option / helios-windows10 | Windows 主机配置 dd_hdr_option 控制“显示HDR匹配”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“显示HDR匹配”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-hdr-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:52 ("dd_hdr_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1718 ("dd_hdr_option")` |
| helios-windows10-dd-manual-refresh-rate / helios-windows10 | Windows 主机配置 dd_manual_refresh_rate 控制“手动刷新率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“手动刷新率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-manual-refresh-rate | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:51 ("dd_manual_refresh_rate":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1717 ("dd_manual_refresh_rate")` |
| helios-windows10-dd-manual-resolution / helios-windows10 | Windows 主机配置 dd_manual_resolution 控制“手动分辨率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“手动分辨率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-manual-resolution | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:49 ("dd_manual_resolution":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1715 ("dd_manual_resolution")` |
| helios-windows10-dd-mode-remapping / helios-windows10 | Windows 主机配置 dd_mode_remapping 控制“分辨率/刷新率映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“分辨率/刷新率映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-mode-remapping | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:56 ("dd_mode_remapping":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1727 ("dd_mode_remapping")` |
| helios-windows10-dd-refresh-rate-option / helios-windows10 | Windows 主机配置 dd_refresh_rate_option 控制“刷新率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“刷新率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-refresh-rate-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:50 ("dd_refresh_rate_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1716 ("dd_refresh_rate_option")` |
| helios-windows10-dd-resolution-option / helios-windows10 | Windows 主机配置 dd_resolution_option 控制“分辨率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“分辨率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-resolution-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:48 ("dd_resolution_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1714 ("dd_resolution_option")` |
| helios-windows10-dd-wa-hdr-toggle-delay / helios-windows10 | Windows 主机配置 dd_wa_hdr_toggle_delay 控制“HDR切换延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“HDR切换延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows10-dd-wa-hdr-toggle-delay | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:53 ("dd_wa_hdr_toggle_delay":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1730 ("dd_wa_hdr_toggle_delay")` |
| helios-windows10-ds4-back-as-touchpad-click / helios-windows10 | Windows 主机配置 ds4_back_as_touchpad_click 控制“Back转触摸板点击”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“Back转触摸板点击”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-ds4-back-as-touchpad-click | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:21 ("ds4_back_as_touchpad_click":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1851 ("ds4_back_as_touchpad_click")` |
| helios-windows10-encode / helios-windows10 | 硬件/软件编码与codec能力 → 保留“硬件/软件编码与codec能力”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | VIDEO-02 / 9 / case-helios-windows10-encode | `sunshine@7c23c32925d2:src/video.cpp:153 (H264)` |
| helios-windows10-encoder / helios-windows10 | Windows 主机配置 encoder 控制“编码provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“编码provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows10-encoder | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:104 ("encoder":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1709 ("encoder")` |
| helios-windows10-external-ip / helios-windows10 | Windows 主机配置 external_ip 控制“外网地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“外网地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows10-external-ip | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:75 ("external_ip":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1747 ("external_ip")` |
| helios-windows10-fec-percentage / helios-windows10 | Windows 主机配置 fec_percentage 控制“FEC冗余”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“FEC冗余”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-02 / 6 / case-helios-windows10-fec-percentage | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:98 ("fec_percentage":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1805 ("fec_percentage")` |
| helios-windows10-file-apps / helios-windows10 | Windows 主机配置 file_apps 控制“应用清单路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“应用清单路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-file-apps | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:86 ("file_apps":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1792 ("file_apps")` |
| helios-windows10-file-state / helios-windows10 | Windows 主机配置 file_state 控制“状态保存路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“状态保存路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-file-state | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:91 ("file_state":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1741 ("file_state")` |
| helios-windows10-gamepad / helios-windows10 | Windows 主机配置 gamepad 控制“手柄类型”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“手柄类型”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-gamepad | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:20 ("gamepad":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1844 ("gamepad")` |
| helios-windows10-gamepad-driver / helios-windows10 | Windows 主机配置 gamepad_driver 控制“虚拟控制器provider选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“虚拟控制器provider选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-gamepad-driver | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:19 ("gamepad_driver":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1065 ("gamepad_driver")` |
| helios-windows10-global-prep-cmd / helios-windows10 | Windows 主机配置 global_prep_cmd 控制“全局准备/清理命令”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“全局准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-06 / 27 / case-helios-windows10-global-prep-cmd | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:9 ("global_prep_cmd":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1748 ("global_prep_cmd")` |
| helios-windows10-granular-permission / helios-windows10 | 输入/查看/启动/剪切板/命令分级授权 → 保留“输入/查看/启动/剪切板/命令分级授权”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | AUTH-02 / 7 / case-helios-windows10-granular-permission | `apollo@adc5c5a0bd80:src/crypto.h:49 (input_controller)` |
| helios-windows10-hevc-mode / helios-windows10 | Windows 主机配置 hevc_mode 控制“HEVC协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“HEVC协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | CODEC-01 / 14 / case-helios-windows10-hevc-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:101 ("hevc_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1609 ("hevc_mode")` |
| helios-windows10-high-resolution-scrolling / helios-windows10 | Windows 主机配置 high_resolution_scrolling 控制“高精度滚轮”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“高精度滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-01 / 11 / case-helios-windows10-high-resolution-scrolling | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:32 ("high_resolution_scrolling":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1862 ("high_resolution_scrolling")` |
| helios-windows10-host-battery-consume / helios-windows10 | 控制器电池实际平台消费 → 保留“控制器电池实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-04 / 16 / case-helios-windows10-host-battery-consume | `sunshine@7c23c32925d2:src/input.cpp:1580 (platf::gamepad_battery)` |
| helios-windows10-host-motion-consume / helios-windows10 | 控制器运动实际平台消费 → 保留“控制器运动实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | GAME-01 / 16 / case-helios-windows10-host-motion-consume | `sunshine@7c23c32925d2:src/input.cpp:1548 (platf::gamepad_motion)` |
| helios-windows10-input-only / helios-windows10 | 纯输入模式不启动音视频消费 → 保留“纯输入模式不启动音视频消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-07 / 20 / case-helios-windows10-input-only | `apollo@adc5c5a0bd80:src/nvhttp.cpp:1170 (bool is_input_only)`<br>`apollo@adc5c5a0bd80:src/audio.cpp:132 (config.input_only)` |
| helios-windows10-install-steam-audio-drivers / helios-windows10 | Windows 主机配置 install_steam_audio_drivers 控制“可选Steam音频驱动安装策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“可选Steam音频驱动安装策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows10-install-steam-audio-drivers | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:44 ("install_steam_audio_drivers":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1753 ("install_steam_audio_drivers")` |
| helios-windows10-key-repeat-delay / helios-windows10 | Windows 主机配置 key_repeat_delay 控制“按键重复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“按键重复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows10-key-repeat-delay | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:27 ("key_repeat_delay":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1833 ("key_repeat_delay")` |
| helios-windows10-key-repeat-frequency / helios-windows10 | Windows 主机配置 key_repeat_frequency 控制“按键重复频率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“按键重复频率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows10-key-repeat-frequency | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:28 ("key_repeat_frequency":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1826 ("key_repeat_frequency")` |
| helios-windows10-key-rightalt-to-key-win / helios-windows10 | Windows 主机配置 key_rightalt_to_key_win 控制“右Alt映射Win”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“右Alt映射Win”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows10-key-rightalt-to-key-win | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:30 ("key_rightalt_to_key_win":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1812 ("key_rightalt_to_key_win")` |
| helios-windows10-keybindings / helios-windows10 | Windows 主机配置 keybindings 控制“键位映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“键位映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-keybindings | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:34 ("keybindings":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1807 ("keybindings")` |
| helios-windows10-keyboard / helios-windows10 | Windows 主机配置 keyboard 控制“键盘输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“键盘输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows10-keyboard | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:26 ("keyboard":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1857 ("keyboard")` |
| helios-windows10-lan-encryption-mode / helios-windows10 | Windows 主机配置 lan_encryption_mode 控制“LAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“LAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows10-lan-encryption-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:76 ("lan_encryption_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1788 ("lan_encryption_mode")` |
| helios-windows10-locale / helios-windows10 | Windows 主机配置 locale 控制“管理语言”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“管理语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-01 / 27 / case-helios-windows10-locale | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:6 ("locale":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1889 ("locale")` |
| helios-windows10-log-path / helios-windows10 | Windows 主机配置 log_path 控制“日志路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“日志路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-02 / 36 / case-helios-windows10-log-path | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:88 ("log_path":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1740 ("log_path")` |
| helios-windows10-manage / helios-windows10 | Web管理/应用配置/凭据/日志 → 保留“Web管理/应用配置/凭据/日志”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ADMIN-03 / 27 / case-helios-windows10-manage | `sunshine@7c23c32925d2:src/confighttp.cpp:957 (/api)` |
| helios-windows10-max-bitrate / helios-windows10 | Windows 主机配置 max_bitrate 控制“主机最大码率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“主机最大码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | RATE-01 / 23 / case-helios-windows10-max-bitrate | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:61 ("max_bitrate":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1734 ("max_bitrate")` |
| helios-windows10-min-log-level / helios-windows10 | Windows 主机配置 min_log_level 控制“日志级别”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“日志级别”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-02 / 36 / case-helios-windows10-min-log-level | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:8 ("min_log_level":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1915 ("min_log_level")` |
| helios-windows10-min-threads / helios-windows10 | Windows 主机配置 min_threads 控制“软件编码线程”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“软件编码线程”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows10-min-threads | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:100 ("min_threads":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1611 ("min_threads")` |
| helios-windows10-minimum-fps-target / helios-windows10 | Windows 主机配置 minimum_fps_target 控制“最小目标帧率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“最小目标帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-01 / 9 / case-helios-windows10-minimum-fps-target | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:62 ("minimum_fps_target":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1735 ("minimum_fps_target")` |
| helios-windows10-motion-as-ds4 / helios-windows10 | Windows 主机配置 motion_as_ds4 控制“运动映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“运动映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-motion-as-ds4 | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:22 ("motion_as_ds4":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1852 ("motion_as_ds4")` |
| helios-windows10-mouse / helios-windows10 | Windows 主机配置 mouse 控制“鼠标输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“鼠标输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-01 / 11 / case-helios-windows10-mouse | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:31 ("mouse":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1856 ("mouse")` |
| helios-windows10-native-pen-touch / helios-windows10 | Windows 主机配置 native_pen_touch 控制“原生笔/触摸”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“原生笔/触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-02 / 16 / case-helios-windows10-native-pen-touch | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:33 ("native_pen_touch":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1863 ("native_pen_touch")` |
| helios-windows10-notify-pre-releases / helios-windows10 | Windows 主机配置 notify_pre_releases 控制“预发布更新通知”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“预发布更新通知”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-notify-pre-releases | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:10 ("notify_pre_releases":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1865 ("notify_pre_releases")` |
| helios-windows10-nvenc-h264-cavlc / helios-windows10 | Windows 主机配置 nvenc_h264_cavlc 控制“nv后端参数 nvenc_h264_cavlc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_h264_cavlc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-h264-cavlc | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:119 ("nvenc_h264_cavlc":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1622 ("nvenc_h264_cavlc")` |
| helios-windows10-nvenc-latency-over-power / helios-windows10 | Windows 主机配置 nvenc_latency_over_power 控制“nv后端参数 nvenc_latency_over_power”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_latency_over_power”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-latency-over-power | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:117 ("nvenc_latency_over_power":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1626 ("nvenc_latency_over_power")` |
| helios-windows10-nvenc-opengl-vulkan-on-dxgi / helios-windows10 | Windows 主机配置 nvenc_opengl_vulkan_on_dxgi 控制“nv后端参数 nvenc_opengl_vulkan_on_dxgi”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_opengl_vulkan_on_dxgi”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-opengl-vulkan-on-dxgi | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:118 ("nvenc_opengl_vulkan_on_dxgi":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1625 ("nvenc_opengl_vulkan_on_dxgi")` |
| helios-windows10-nvenc-preset / helios-windows10 | Windows 主机配置 nvenc_preset 控制“nv后端参数 nvenc_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-preset | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:111 ("nvenc_preset":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1618 ("nvenc_preset")` |
| helios-windows10-nvenc-realtime-hags / helios-windows10 | Windows 主机配置 nvenc_realtime_hags 控制“nv后端参数 nvenc_realtime_hags”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_realtime_hags”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-realtime-hags | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:115 ("nvenc_realtime_hags":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1624 ("nvenc_realtime_hags")` |
| helios-windows10-nvenc-spatial-aq / helios-windows10 | Windows 主机配置 nvenc_spatial_aq 控制“nv后端参数 nvenc_spatial_aq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_spatial_aq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-spatial-aq | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:113 ("nvenc_spatial_aq":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1620 ("nvenc_spatial_aq")` |
| helios-windows10-nvenc-split-encode / helios-windows10 | Windows 主机配置 nvenc_split_encode 控制“nv后端参数 nvenc_split_encode”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_split_encode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-split-encode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:116 ("nvenc_split_encode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1623 ("nvenc_split_encode")` |
| helios-windows10-nvenc-twopass / helios-windows10 | Windows 主机配置 nvenc_twopass 控制“nv后端参数 nvenc_twopass”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_twopass”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-twopass | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:112 ("nvenc_twopass":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1621 ("nvenc_twopass")` |
| helios-windows10-nvenc-vbv-increase / helios-windows10 | Windows 主机配置 nvenc_vbv_increase 控制“nv后端参数 nvenc_vbv_increase”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_vbv_increase”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-nvenc-vbv-increase | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:114 ("nvenc_vbv_increase":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1619 ("nvenc_vbv_increase")` |
| helios-windows10-old-auto-terminate / helios-windows10 | 旧主机全部客户端断连时自动结束应用策略 → Aether覆盖旧自动结束策略：断开全部连接也不StopInstance；应用及显示组一直保留至用户显式停止 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | INST-02 / 8 / case-helios-windows10-old-auto-terminate | `apollo@adc5c5a0bd80:src/process.cpp:655 (Terminating app)` |
| helios-windows10-origin-web-ui-allowed / helios-windows10 | Windows 主机配置 origin_web_ui_allowed 控制“管理入口来源范围”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“管理入口来源范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-03 / 27 / case-helios-windows10-origin-web-ui-allowed | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:73 ("origin_web_ui_allowed":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1755 ("origin_web_ui_allowed")` |
| helios-windows10-output-name / helios-windows10 | Windows 主机配置 output_name 控制“物理显示器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“物理显示器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-01 / 9 / case-helios-windows10-output-name | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:46 ("output_name":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1711 ("output_name")` |
| helios-windows10-packetsize / helios-windows10 | Windows 主机配置 packetsize 控制“媒体包大小”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“媒体包大小”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows10-packetsize | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:79 ("packetsize":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1790 ("packetsize")` |
| helios-windows10-pair / helios-windows10 | Windows配对/应用/恢复控制入口 → 保留“Windows配对/应用/恢复控制入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | AUTH-01 / 7 / case-helios-windows10-pair | `sunshine@7c23c32925d2:src/nvhttp.cpp:51 (pair)` |
| helios-windows10-persistent-display-id / helios-windows10 | 虚拟屏原固定客户端身份 → 保留“虚拟屏原固定客户端身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | DISPLAY-01 / 17 / case-helios-windows10-persistent-display-id | `apollo@adc5c5a0bd80:README.md:36 (assigns a fixed identity)` |
| helios-windows10-ping-timeout / helios-windows10 | Windows 主机配置 ping_timeout 控制“连接保活截止时间”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“连接保活截止时间”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows10-ping-timeout | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:78 ("ping_timeout":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1783 ("ping_timeout")` |
| helios-windows10-pkey / helios-windows10 | Windows 主机配置 pkey 控制“私钥路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“私钥路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-pkey | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:89 ("pkey":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1737 ("pkey")` |
| helios-windows10-port / helios-windows10 | Windows 主机配置 port 控制“基础端口”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“基础端口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows10-port | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:72 ("port":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1869 ("port")` |
| helios-windows10-qp / helios-windows10 | Windows 主机配置 qp 控制“编码量化参数”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“编码量化参数”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows10-qp | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:99 ("qp":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1608 ("qp")` |
| helios-windows10-qsv-coder / helios-windows10 | Windows 主机配置 qsv_coder 控制“qsv后端参数 qsv_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“qsv后端参数 qsv_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-qsv-coder | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:127 ("qsv_coder":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1639 ("qsv_coder")` |
| helios-windows10-qsv-preset / helios-windows10 | Windows 主机配置 qsv_preset 控制“qsv后端参数 qsv_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“qsv后端参数 qsv_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-qsv-preset | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:126 ("qsv_preset":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1638 ("qsv_preset")` |
| helios-windows10-qsv-slow-hevc / helios-windows10 | Windows 主机配置 qsv_slow_hevc 控制“qsv后端参数 qsv_slow_hevc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“qsv后端参数 qsv_slow_hevc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows10-qsv-slow-hevc | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:128 ("qsv_slow_hevc":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1640 ("qsv_slow_hevc")` |
| helios-windows10-read-stream / helios-windows10 | 有View权限可加入已有应用/纯输入会话 → 保留“有View权限可加入已有应用/纯输入会话”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-08 / 20 / case-helios-windows10-read-stream | `apollo@adc5c5a0bd80:src/nvhttp.cpp:1184 (perm = PERM::_allow_view)`<br>`apollo@adc5c5a0bd80:src/crypto.h:66 (view             =)`<br>`apollo@adc5c5a0bd80:README.md:24 (View Streams)` |
| helios-windows10-service / helios-windows10 | Windows服务安装入口 → 保留“Windows服务安装入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | SHIP-02 / 39 / case-helios-windows10-service | `sunshine@7c23c32925d2:src_assets/windows/misc/service/install-service.bat:4 (sunshine)` |
| helios-windows10-stream-audio / helios-windows10 | Windows 主机配置 stream_audio 控制“音频传输开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“音频传输开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows10-stream-audio | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:43 ("stream_audio":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1752 ("stream_audio")` |
| helios-windows10-sunshine-name / helios-windows10 | Windows 主机配置 sunshine_name 控制“主机名称”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“主机名称”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows10-sunshine-name | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:7 ("sunshine_name":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1739 ("sunshine_name")` |
| helios-windows10-sw-preset / helios-windows10 | Windows 主机配置 sw_preset 控制“sw后端参数 sw_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“sw后端参数 sw_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-10 / 13 / case-helios-windows10-sw-preset | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:177 ("sw_preset":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1612 ("sw_preset")` |
| helios-windows10-sw-tune / helios-windows10 | Windows 主机配置 sw_tune 控制“sw后端参数 sw_tune”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“sw后端参数 sw_tune”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-10 / 13 / case-helios-windows10-sw-tune | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:178 ("sw_tune":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1616 ("sw_tune")` |
| helios-windows10-system-tray / helios-windows10 | Windows 主机配置 system_tray 控制“系统托盘”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“系统托盘”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | SHIP-02 / 39 / case-helios-windows10-system-tray | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:11 ("system_tray":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1866 ("system_tray")` |
| helios-windows10-touchpad-as-ds4 / helios-windows10 | Windows 主机配置 touchpad_as_ds4 控制“触摸板映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“触摸板映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-touchpad-as-ds4 | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:23 ("touchpad_as_ds4":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1853 ("touchpad_as_ds4")` |
| helios-windows10-upnp / helios-windows10 | Windows 主机配置 upnp 控制“UPnP自动映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“UPnP自动映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows10-upnp | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:69 ("upnp":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1883 ("upnp")` |
| helios-windows10-virtual-sink / helios-windows10 | Windows 主机配置 virtual_sink 控制“虚拟音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“虚拟音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows10-virtual-sink | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:42 ("virtual_sink":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1751 ("virtual_sink")` |
| helios-windows10-virtualhid-randomize-mac / helios-windows10 | Windows 主机配置 virtualhid_randomize_mac 控制“虚拟HID身份策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“虚拟HID身份策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows10-virtualhid-randomize-mac | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:24 ("virtualhid_randomize_mac":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1854 ("virtualhid_randomize_mac")` |
| helios-windows10-wan-encryption-mode / helios-windows10 | Windows 主机配置 wan_encryption_mode 控制“WAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“WAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows10-wan-encryption-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:77 ("wan_encryption_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1789 ("wan_encryption_mode")` |
| helios-windows10-wgc / helios-windows10 | Windows Graphics Capture候选捕获与失败状态 → 保留“Windows Graphics Capture候选捕获与失败状态”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | VIDEO-01 / 9 / case-helios-windows10-wgc | `sunshine@7c23c32925d2:src/platform/windows/display_wgc.cpp:108 (GraphicsCapture)` |
| helios-windows10-windows-injection / helios-windows10 | Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider） → 保留“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 10；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | INPUT-02 / 11 / case-helios-windows10-windows-injection | `sunshine@7c23c32925d2:src/platform/virtualhid_input.cpp:307 (keyboard)` |
| helios-windows11-adapter-name / helios-windows11 | Windows 主机配置 adapter_name 控制“GPU适配器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“GPU适配器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-01 / 9 / case-helios-windows11-adapter-name | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:45 ("adapter_name":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1710 ("adapter_name")` |
| helios-windows11-address-family / helios-windows11 | Windows 主机配置 address_family 控制“IPv4/IPv6”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“IPv4/IPv6”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows11-address-family | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:70 ("address_family":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1879 ("address_family")` |
| helios-windows11-always-send-scancodes / helios-windows11 | Windows 主机配置 always_send_scancodes 控制“扫描码策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“扫描码策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-always-send-scancodes | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:29 ("always_send_scancodes":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1860 ("always_send_scancodes")` |
| helios-windows11-amd-coder / helios-windows11 | Windows 主机配置 amd_coder 控制“amd后端参数 amd_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-coder | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:142 ("amd_coder":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1652 ("amd_coder")` |
| helios-windows11-amd-enforce-hrd / helios-windows11 | Windows 主机配置 amd_enforce_hrd 控制“amd后端参数 amd_enforce_hrd”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_enforce_hrd”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-enforce-hrd | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:137 ("amd_enforce_hrd":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1669 ("amd_enforce_hrd")` |
| helios-windows11-amd-max-au-size / helios-windows11 | Windows 主机配置 amd_max_au_size 控制“amd后端参数 amd_max_au_size”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_max_au_size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-max-au-size | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:138 ("amd_max_au_size":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1672 ("amd_max_au_size")` |
| helios-windows11-amd-preanalysis / helios-windows11 | Windows 主机配置 amd_preanalysis 控制“amd后端参数 amd_preanalysis”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_preanalysis”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-preanalysis | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:140 ("amd_preanalysis":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1667 ("amd_preanalysis")` |
| helios-windows11-amd-quality / helios-windows11 | Windows 主机配置 amd_quality 控制“amd后端参数 amd_quality”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_quality”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-quality | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:139 ("amd_quality":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1643 ("amd_quality")` |
| helios-windows11-amd-rc / helios-windows11 | Windows 主机配置 amd_rc 控制“amd后端参数 amd_rc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_rc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-rc | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:136 ("amd_rc":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1651 ("amd_rc")` |
| helios-windows11-amd-usage / helios-windows11 | Windows 主机配置 amd_usage 控制“amd后端参数 amd_usage”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_usage”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-usage | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:135 ("amd_usage":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1660 ("amd_usage")` |
| helios-windows11-amd-vbaq / helios-windows11 | Windows 主机配置 amd_vbaq 控制“amd后端参数 amd_vbaq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“amd后端参数 amd_vbaq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-amd-vbaq | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:141 ("amd_vbaq":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1668 ("amd_vbaq")` |
| helios-windows11-apps / helios-windows11 | 应用进程/准备/清理命令 → 保留“应用进程/准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ADMIN-01 / 27 / case-helios-windows11-apps | `sunshine@7c23c32925d2:src/process.cpp:152 (prep)` |
| helios-windows11-audio / helios-windows11 | Windows系统音频捕获与Opus → 保留“Windows系统音频捕获与Opus”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | AUDIO-01 / 12 / case-helios-windows11-audio | `sunshine@7c23c32925d2:src/audio.cpp:9 (opus)` |
| helios-windows11-audio-sink / helios-windows11 | Windows 主机配置 audio_sink 控制“系统音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“系统音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows11-audio-sink | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:41 ("audio_sink":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1750 ("audio_sink")` |
| helios-windows11-av1-mode / helios-windows11 | Windows 主机配置 av1_mode 控制“AV1协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“AV1协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | CODEC-02 / 14 / case-helios-windows11-av1-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:102 ("av1_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1610 ("av1_mode")` |
| helios-windows11-back-button-timeout / helios-windows11 | Windows 主机配置 back_button_timeout 控制“Back长按策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“Back长按策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-back-button-timeout | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:25 ("back_button_timeout":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1819 ("back_button_timeout")` |
| helios-windows11-bind-address / helios-windows11 | Windows 主机配置 bind_address 控制“监听地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“监听地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows11-bind-address | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:71 ("bind_address":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1880 ("bind_address")` |
| helios-windows11-capture / helios-windows11 | Windows 主机配置 capture 控制“捕获provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“捕获provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows11-capture | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:103 ("capture":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1708 ("capture")` |
| helios-windows11-capture-frame / helios-windows11 | Windows物理显示器/GPU捕获 → 保留“Windows物理显示器/GPU捕获”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | VIDEO-01 / 9 / case-helios-windows11-capture-frame | `sunshine@7c23c32925d2:src/platform/windows/display_vram.cpp:174 (DXGI)` |
| helios-windows11-cert / helios-windows11 | Windows 主机配置 cert 控制“证书路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“证书路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-cert | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:90 ("cert":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1738 ("cert")` |
| helios-windows11-clipboard / helios-windows11 | 剪切板同步 → 保留“剪切板同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | CLIP-01 / 25 / case-helios-windows11-clipboard | `apollo@adc5c5a0bd80:README.md:9 (Clipboard sync)` |
| helios-windows11-clipboard-permission / helios-windows11 | 剪切板入站单独检查clipboard_set权限 → 保留“剪切板入站单独检查clipboard_set权限”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | CLIP-02 / 25 / case-helios-windows11-clipboard-permission | `apollo@adc5c5a0bd80:src/stream.cpp:1040 (PERM::clipboard_set)` |
| helios-windows11-connection-hooks / helios-windows11 | 连接/断连命令钩子 → 保留“连接/断连命令钩子”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-06 / 27 / case-helios-windows11-connection-hooks | `apollo@adc5c5a0bd80:README.md:10 (Commands for client)` |
| helios-windows11-controller / helios-windows11 | Windows 主机配置 controller 控制“控制器输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“控制器输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-controller | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:18 ("controller":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1858 ("controller")` |
| helios-windows11-controller-motion / helios-windows11 | 控制器运动/触摸/电池消费 → 保留“控制器运动/触摸/电池消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | GAME-01 / 16 / case-helios-windows11-controller-motion | `sunshine@7c23c32925d2:src/input.cpp:659 (controller motion)` |
| helios-windows11-credentials-file / helios-windows11 | Windows 主机配置 credentials_file 控制“管理凭据路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“管理凭据路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-credentials-file | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:87 ("credentials_file":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1745 ("credentials_file")` |
| helios-windows11-csrf-allowed-origins / helios-windows11 | Windows 主机配置 csrf_allowed_origins 控制“CSRF允许来源”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“CSRF允许来源”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-03 / 27 / case-helios-windows11-csrf-allowed-origins | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:74 ("csrf_allowed_origins":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1759 ("csrf_allowed_origins")` |
| helios-windows11-dd-config-revert-delay / helios-windows11 | Windows 主机配置 dd_config_revert_delay 控制“显示恢复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“显示恢复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-config-revert-delay | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:54 ("dd_config_revert_delay":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1721 ("dd_config_revert_delay")` |
| helios-windows11-dd-config-revert-on-disconnect / helios-windows11 | Windows 主机配置 dd_config_revert_on_disconnect 控制“断连恢复显示旧策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 普通断连/切换保留实例显示组及拓扑；显式StopInstance才清理本组，旧自动恢复策略仅能作用于非实例拥有资源 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-config-revert-on-disconnect | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:55 ("dd_config_revert_on_disconnect":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1726 ("dd_config_revert_on_disconnect")` |
| helios-windows11-dd-configuration-option / helios-windows11 | Windows 主机配置 dd_configuration_option 控制“显示设备拓扑配置”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“显示设备拓扑配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-configuration-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:47 ("dd_configuration_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1713 ("dd_configuration_option")` |
| helios-windows11-dd-hdr-option / helios-windows11 | Windows 主机配置 dd_hdr_option 控制“显示HDR匹配”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“显示HDR匹配”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-hdr-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:52 ("dd_hdr_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1718 ("dd_hdr_option")` |
| helios-windows11-dd-manual-refresh-rate / helios-windows11 | Windows 主机配置 dd_manual_refresh_rate 控制“手动刷新率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“手动刷新率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-manual-refresh-rate | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:51 ("dd_manual_refresh_rate":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1717 ("dd_manual_refresh_rate")` |
| helios-windows11-dd-manual-resolution / helios-windows11 | Windows 主机配置 dd_manual_resolution 控制“手动分辨率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“手动分辨率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-manual-resolution | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:49 ("dd_manual_resolution":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1715 ("dd_manual_resolution")` |
| helios-windows11-dd-mode-remapping / helios-windows11 | Windows 主机配置 dd_mode_remapping 控制“分辨率/刷新率映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“分辨率/刷新率映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-mode-remapping | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:56 ("dd_mode_remapping":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1727 ("dd_mode_remapping")` |
| helios-windows11-dd-refresh-rate-option / helios-windows11 | Windows 主机配置 dd_refresh_rate_option 控制“刷新率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“刷新率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-refresh-rate-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:50 ("dd_refresh_rate_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1716 ("dd_refresh_rate_option")` |
| helios-windows11-dd-resolution-option / helios-windows11 | Windows 主机配置 dd_resolution_option 控制“分辨率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“分辨率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-resolution-option | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:48 ("dd_resolution_option":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1714 ("dd_resolution_option")` |
| helios-windows11-dd-wa-hdr-toggle-delay / helios-windows11 | Windows 主机配置 dd_wa_hdr_toggle_delay 控制“HDR切换延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“HDR切换延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | DISPLAY-03 / 17 / case-helios-windows11-dd-wa-hdr-toggle-delay | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:53 ("dd_wa_hdr_toggle_delay":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1730 ("dd_wa_hdr_toggle_delay")` |
| helios-windows11-ds4-back-as-touchpad-click / helios-windows11 | Windows 主机配置 ds4_back_as_touchpad_click 控制“Back转触摸板点击”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“Back转触摸板点击”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-ds4-back-as-touchpad-click | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:21 ("ds4_back_as_touchpad_click":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1851 ("ds4_back_as_touchpad_click")` |
| helios-windows11-encode / helios-windows11 | 硬件/软件编码与codec能力 → 保留“硬件/软件编码与codec能力”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | VIDEO-02 / 9 / case-helios-windows11-encode | `sunshine@7c23c32925d2:src/video.cpp:153 (H264)` |
| helios-windows11-encoder / helios-windows11 | Windows 主机配置 encoder 控制“编码provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“编码provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows11-encoder | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:104 ("encoder":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1709 ("encoder")` |
| helios-windows11-external-ip / helios-windows11 | Windows 主机配置 external_ip 控制“外网地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“外网地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows11-external-ip | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:75 ("external_ip":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1747 ("external_ip")` |
| helios-windows11-fec-percentage / helios-windows11 | Windows 主机配置 fec_percentage 控制“FEC冗余”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“FEC冗余”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-02 / 6 / case-helios-windows11-fec-percentage | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:98 ("fec_percentage":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1805 ("fec_percentage")` |
| helios-windows11-file-apps / helios-windows11 | Windows 主机配置 file_apps 控制“应用清单路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“应用清单路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-file-apps | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:86 ("file_apps":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1792 ("file_apps")` |
| helios-windows11-file-state / helios-windows11 | Windows 主机配置 file_state 控制“状态保存路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“状态保存路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-file-state | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:91 ("file_state":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1741 ("file_state")` |
| helios-windows11-gamepad / helios-windows11 | Windows 主机配置 gamepad 控制“手柄类型”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“手柄类型”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-gamepad | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:20 ("gamepad":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1844 ("gamepad")` |
| helios-windows11-gamepad-driver / helios-windows11 | Windows 主机配置 gamepad_driver 控制“虚拟控制器provider选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“虚拟控制器provider选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-gamepad-driver | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:19 ("gamepad_driver":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1065 ("gamepad_driver")` |
| helios-windows11-global-prep-cmd / helios-windows11 | Windows 主机配置 global_prep_cmd 控制“全局准备/清理命令”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“全局准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-06 / 27 / case-helios-windows11-global-prep-cmd | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:9 ("global_prep_cmd":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1748 ("global_prep_cmd")` |
| helios-windows11-granular-permission / helios-windows11 | 输入/查看/启动/剪切板/命令分级授权 → 保留“输入/查看/启动/剪切板/命令分级授权”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | AUTH-02 / 7 / case-helios-windows11-granular-permission | `apollo@adc5c5a0bd80:src/crypto.h:49 (input_controller)` |
| helios-windows11-hevc-mode / helios-windows11 | Windows 主机配置 hevc_mode 控制“HEVC协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“HEVC协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | CODEC-01 / 14 / case-helios-windows11-hevc-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:101 ("hevc_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1609 ("hevc_mode")` |
| helios-windows11-high-resolution-scrolling / helios-windows11 | Windows 主机配置 high_resolution_scrolling 控制“高精度滚轮”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“高精度滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-01 / 11 / case-helios-windows11-high-resolution-scrolling | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:32 ("high_resolution_scrolling":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1862 ("high_resolution_scrolling")` |
| helios-windows11-host-battery-consume / helios-windows11 | 控制器电池实际平台消费 → 保留“控制器电池实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-04 / 16 / case-helios-windows11-host-battery-consume | `sunshine@7c23c32925d2:src/input.cpp:1580 (platf::gamepad_battery)` |
| helios-windows11-host-motion-consume / helios-windows11 | 控制器运动实际平台消费 → 保留“控制器运动实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | GAME-01 / 16 / case-helios-windows11-host-motion-consume | `sunshine@7c23c32925d2:src/input.cpp:1548 (platf::gamepad_motion)` |
| helios-windows11-input-only / helios-windows11 | 纯输入模式不启动音视频消费 → 保留“纯输入模式不启动音视频消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-07 / 20 / case-helios-windows11-input-only | `apollo@adc5c5a0bd80:src/nvhttp.cpp:1170 (bool is_input_only)`<br>`apollo@adc5c5a0bd80:src/audio.cpp:132 (config.input_only)` |
| helios-windows11-install-steam-audio-drivers / helios-windows11 | Windows 主机配置 install_steam_audio_drivers 控制“可选Steam音频驱动安装策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“可选Steam音频驱动安装策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows11-install-steam-audio-drivers | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:44 ("install_steam_audio_drivers":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1753 ("install_steam_audio_drivers")` |
| helios-windows11-key-repeat-delay / helios-windows11 | Windows 主机配置 key_repeat_delay 控制“按键重复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“按键重复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows11-key-repeat-delay | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:27 ("key_repeat_delay":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1833 ("key_repeat_delay")` |
| helios-windows11-key-repeat-frequency / helios-windows11 | Windows 主机配置 key_repeat_frequency 控制“按键重复频率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“按键重复频率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows11-key-repeat-frequency | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:28 ("key_repeat_frequency":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1826 ("key_repeat_frequency")` |
| helios-windows11-key-rightalt-to-key-win / helios-windows11 | Windows 主机配置 key_rightalt_to_key_win 控制“右Alt映射Win”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“右Alt映射Win”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows11-key-rightalt-to-key-win | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:30 ("key_rightalt_to_key_win":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1812 ("key_rightalt_to_key_win")` |
| helios-windows11-keybindings / helios-windows11 | Windows 主机配置 keybindings 控制“键位映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“键位映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-keybindings | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:34 ("keybindings":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1807 ("keybindings")` |
| helios-windows11-keyboard / helios-windows11 | Windows 主机配置 keyboard 控制“键盘输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“键盘输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-02 / 11 / case-helios-windows11-keyboard | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:26 ("keyboard":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1857 ("keyboard")` |
| helios-windows11-lan-encryption-mode / helios-windows11 | Windows 主机配置 lan_encryption_mode 控制“LAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“LAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows11-lan-encryption-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:76 ("lan_encryption_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1788 ("lan_encryption_mode")` |
| helios-windows11-locale / helios-windows11 | Windows 主机配置 locale 控制“管理语言”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“管理语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-01 / 27 / case-helios-windows11-locale | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:6 ("locale":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1889 ("locale")` |
| helios-windows11-log-path / helios-windows11 | Windows 主机配置 log_path 控制“日志路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“日志路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-02 / 36 / case-helios-windows11-log-path | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:88 ("log_path":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1740 ("log_path")` |
| helios-windows11-manage / helios-windows11 | Web管理/应用配置/凭据/日志 → 保留“Web管理/应用配置/凭据/日志”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ADMIN-03 / 27 / case-helios-windows11-manage | `sunshine@7c23c32925d2:src/confighttp.cpp:957 (/api)` |
| helios-windows11-max-bitrate / helios-windows11 | Windows 主机配置 max_bitrate 控制“主机最大码率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“主机最大码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | RATE-01 / 23 / case-helios-windows11-max-bitrate | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:61 ("max_bitrate":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1734 ("max_bitrate")` |
| helios-windows11-min-log-level / helios-windows11 | Windows 主机配置 min_log_level 控制“日志级别”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“日志级别”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-02 / 36 / case-helios-windows11-min-log-level | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:8 ("min_log_level":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1915 ("min_log_level")` |
| helios-windows11-min-threads / helios-windows11 | Windows 主机配置 min_threads 控制“软件编码线程”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“软件编码线程”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows11-min-threads | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:100 ("min_threads":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1611 ("min_threads")` |
| helios-windows11-minimum-fps-target / helios-windows11 | Windows 主机配置 minimum_fps_target 控制“最小目标帧率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“最小目标帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-01 / 9 / case-helios-windows11-minimum-fps-target | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:62 ("minimum_fps_target":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1735 ("minimum_fps_target")` |
| helios-windows11-motion-as-ds4 / helios-windows11 | Windows 主机配置 motion_as_ds4 控制“运动映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“运动映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-motion-as-ds4 | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:22 ("motion_as_ds4":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1852 ("motion_as_ds4")` |
| helios-windows11-mouse / helios-windows11 | Windows 主机配置 mouse 控制“鼠标输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“鼠标输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | INPUT-01 / 11 / case-helios-windows11-mouse | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:31 ("mouse":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1856 ("mouse")` |
| helios-windows11-native-pen-touch / helios-windows11 | Windows 主机配置 native_pen_touch 控制“原生笔/触摸”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“原生笔/触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-02 / 16 / case-helios-windows11-native-pen-touch | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:33 ("native_pen_touch":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1863 ("native_pen_touch")` |
| helios-windows11-notify-pre-releases / helios-windows11 | Windows 主机配置 notify_pre_releases 控制“预发布更新通知”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“预发布更新通知”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-notify-pre-releases | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:10 ("notify_pre_releases":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1865 ("notify_pre_releases")` |
| helios-windows11-nvenc-h264-cavlc / helios-windows11 | Windows 主机配置 nvenc_h264_cavlc 控制“nv后端参数 nvenc_h264_cavlc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_h264_cavlc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-h264-cavlc | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:119 ("nvenc_h264_cavlc":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1622 ("nvenc_h264_cavlc")` |
| helios-windows11-nvenc-latency-over-power / helios-windows11 | Windows 主机配置 nvenc_latency_over_power 控制“nv后端参数 nvenc_latency_over_power”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_latency_over_power”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-latency-over-power | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:117 ("nvenc_latency_over_power":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1626 ("nvenc_latency_over_power")` |
| helios-windows11-nvenc-opengl-vulkan-on-dxgi / helios-windows11 | Windows 主机配置 nvenc_opengl_vulkan_on_dxgi 控制“nv后端参数 nvenc_opengl_vulkan_on_dxgi”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_opengl_vulkan_on_dxgi”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-opengl-vulkan-on-dxgi | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:118 ("nvenc_opengl_vulkan_on_dxgi":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1625 ("nvenc_opengl_vulkan_on_dxgi")` |
| helios-windows11-nvenc-preset / helios-windows11 | Windows 主机配置 nvenc_preset 控制“nv后端参数 nvenc_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-preset | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:111 ("nvenc_preset":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1618 ("nvenc_preset")` |
| helios-windows11-nvenc-realtime-hags / helios-windows11 | Windows 主机配置 nvenc_realtime_hags 控制“nv后端参数 nvenc_realtime_hags”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_realtime_hags”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-realtime-hags | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:115 ("nvenc_realtime_hags":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1624 ("nvenc_realtime_hags")` |
| helios-windows11-nvenc-spatial-aq / helios-windows11 | Windows 主机配置 nvenc_spatial_aq 控制“nv后端参数 nvenc_spatial_aq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_spatial_aq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-spatial-aq | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:113 ("nvenc_spatial_aq":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1620 ("nvenc_spatial_aq")` |
| helios-windows11-nvenc-split-encode / helios-windows11 | Windows 主机配置 nvenc_split_encode 控制“nv后端参数 nvenc_split_encode”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_split_encode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-split-encode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:116 ("nvenc_split_encode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1623 ("nvenc_split_encode")` |
| helios-windows11-nvenc-twopass / helios-windows11 | Windows 主机配置 nvenc_twopass 控制“nv后端参数 nvenc_twopass”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_twopass”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-twopass | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:112 ("nvenc_twopass":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1621 ("nvenc_twopass")` |
| helios-windows11-nvenc-vbv-increase / helios-windows11 | Windows 主机配置 nvenc_vbv_increase 控制“nv后端参数 nvenc_vbv_increase”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“nv后端参数 nvenc_vbv_increase”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-nvenc-vbv-increase | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:114 ("nvenc_vbv_increase":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1619 ("nvenc_vbv_increase")` |
| helios-windows11-old-auto-terminate / helios-windows11 | 旧主机全部客户端断连时自动结束应用策略 → Aether覆盖旧自动结束策略：断开全部连接也不StopInstance；应用及显示组一直保留至用户显式停止 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | INST-02 / 8 / case-helios-windows11-old-auto-terminate | `apollo@adc5c5a0bd80:src/process.cpp:655 (Terminating app)` |
| helios-windows11-origin-web-ui-allowed / helios-windows11 | Windows 主机配置 origin_web_ui_allowed 控制“管理入口来源范围”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“管理入口来源范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-03 / 27 / case-helios-windows11-origin-web-ui-allowed | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:73 ("origin_web_ui_allowed":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1755 ("origin_web_ui_allowed")` |
| helios-windows11-output-name / helios-windows11 | Windows 主机配置 output_name 控制“物理显示器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“物理显示器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-01 / 9 / case-helios-windows11-output-name | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:46 ("output_name":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1711 ("output_name")` |
| helios-windows11-packetsize / helios-windows11 | Windows 主机配置 packetsize 控制“媒体包大小”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“媒体包大小”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows11-packetsize | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:79 ("packetsize":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1790 ("packetsize")` |
| helios-windows11-pair / helios-windows11 | Windows配对/应用/恢复控制入口 → 保留“Windows配对/应用/恢复控制入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | AUTH-01 / 7 / case-helios-windows11-pair | `sunshine@7c23c32925d2:src/nvhttp.cpp:51 (pair)` |
| helios-windows11-persistent-display-id / helios-windows11 | 虚拟屏原固定客户端身份 → 保留“虚拟屏原固定客户端身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | DISPLAY-01 / 17 / case-helios-windows11-persistent-display-id | `apollo@adc5c5a0bd80:README.md:36 (assigns a fixed identity)` |
| helios-windows11-ping-timeout / helios-windows11 | Windows 主机配置 ping_timeout 控制“连接保活截止时间”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“连接保活截止时间”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows11-ping-timeout | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:78 ("ping_timeout":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1783 ("ping_timeout")` |
| helios-windows11-pkey / helios-windows11 | Windows 主机配置 pkey 控制“私钥路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“私钥路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-pkey | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:89 ("pkey":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1737 ("pkey")` |
| helios-windows11-port / helios-windows11 | Windows 主机配置 port 控制“基础端口”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“基础端口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows11-port | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:72 ("port":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1869 ("port")` |
| helios-windows11-qp / helios-windows11 | Windows 主机配置 qp 控制“编码量化参数”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“编码量化参数”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | VIDEO-02 / 9 / case-helios-windows11-qp | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:99 ("qp":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1608 ("qp")` |
| helios-windows11-qsv-coder / helios-windows11 | Windows 主机配置 qsv_coder 控制“qsv后端参数 qsv_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“qsv后端参数 qsv_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-qsv-coder | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:127 ("qsv_coder":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1639 ("qsv_coder")` |
| helios-windows11-qsv-preset / helios-windows11 | Windows 主机配置 qsv_preset 控制“qsv后端参数 qsv_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“qsv后端参数 qsv_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-qsv-preset | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:126 ("qsv_preset":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1638 ("qsv_preset")` |
| helios-windows11-qsv-slow-hevc / helios-windows11 | Windows 主机配置 qsv_slow_hevc 控制“qsv后端参数 qsv_slow_hevc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“qsv后端参数 qsv_slow_hevc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测 / host-native | ORIG-10 / 13 / case-helios-windows11-qsv-slow-hevc | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:128 ("qsv_slow_hevc":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1640 ("qsv_slow_hevc")` |
| helios-windows11-read-stream / helios-windows11 | 有View权限可加入已有应用/纯输入会话 → 保留“有View权限可加入已有应用/纯输入会话”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | ORIG-08 / 20 / case-helios-windows11-read-stream | `apollo@adc5c5a0bd80:src/nvhttp.cpp:1184 (perm = PERM::_allow_view)`<br>`apollo@adc5c5a0bd80:src/crypto.h:66 (view             =)`<br>`apollo@adc5c5a0bd80:README.md:24 (View Streams)` |
| helios-windows11-service / helios-windows11 | Windows服务安装入口 → 保留“Windows服务安装入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | SHIP-02 / 39 / case-helios-windows11-service | `sunshine@7c23c32925d2:src_assets/windows/misc/service/install-service.bat:4 (sunshine)` |
| helios-windows11-stream-audio / helios-windows11 | Windows 主机配置 stream_audio 控制“音频传输开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“音频传输开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows11-stream-audio | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:43 ("stream_audio":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1752 ("stream_audio")` |
| helios-windows11-sunshine-name / helios-windows11 | Windows 主机配置 sunshine_name 控制“主机名称”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“主机名称”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ADMIN-02 / 27 / case-helios-windows11-sunshine-name | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:7 ("sunshine_name":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1739 ("sunshine_name")` |
| helios-windows11-sw-preset / helios-windows11 | Windows 主机配置 sw_preset 控制“sw后端参数 sw_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“sw后端参数 sw_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-10 / 13 / case-helios-windows11-sw-preset | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:177 ("sw_preset":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1612 ("sw_preset")` |
| helios-windows11-sw-tune / helios-windows11 | Windows 主机配置 sw_tune 控制“sw后端参数 sw_tune”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“sw后端参数 sw_tune”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | ORIG-10 / 13 / case-helios-windows11-sw-tune | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:178 ("sw_tune":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1616 ("sw_tune")` |
| helios-windows11-system-tray / helios-windows11 | Windows 主机配置 system_tray 控制“系统托盘”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“系统托盘”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | SHIP-02 / 39 / case-helios-windows11-system-tray | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:11 ("system_tray":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1866 ("system_tray")` |
| helios-windows11-touchpad-as-ds4 / helios-windows11 | Windows 主机配置 touchpad_as_ds4 控制“触摸板映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“触摸板映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-touchpad-as-ds4 | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:23 ("touchpad_as_ds4":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1853 ("touchpad_as_ds4")` |
| helios-windows11-upnp / helios-windows11 | Windows 主机配置 upnp 控制“UPnP自动映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“UPnP自动映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | OPS-01 / 36 / case-helios-windows11-upnp | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:69 ("upnp":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1883 ("upnp")` |
| helios-windows11-virtual-sink / helios-windows11 | Windows 主机配置 virtual_sink 控制“虚拟音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“虚拟音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | AUDIO-02 / 12 / case-helios-windows11-virtual-sink | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:42 ("virtual_sink":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1751 ("virtual_sink")` |
| helios-windows11-virtualhid-randomize-mac / helios-windows11 | Windows 主机配置 virtualhid_randomize_mac 控制“虚拟HID身份策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“虚拟HID身份策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | GAME-01 / 16 / case-helios-windows11-virtualhid-randomize-mac | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:24 ("virtualhid_randomize_mac":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1854 ("virtualhid_randomize_mac")` |
| helios-windows11-wan-encryption-mode / helios-windows11 | Windows 主机配置 wan_encryption_mode 控制“WAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端 → 保留“WAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Windows交互登录桌面及适用provider；驱动/签名仍未核验 / host-native | NET-03 / 6 / case-helios-windows11-wan-encryption-mode | `sunshine@7c23c32925d2:src_assets/common/assets/web/configs/config_tabs.json:77 ("wan_encryption_mode":)`<br>`sunshine@7c23c32925d2:src/config.cpp:1789 ("wan_encryption_mode")` |
| helios-windows11-wgc / helios-windows11 | Windows Graphics Capture候选捕获与失败状态 → 保留“Windows Graphics Capture候选捕获与失败状态”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | VIDEO-01 / 9 / case-helios-windows11-wgc | `sunshine@7c23c32925d2:src/platform/windows/display_wgc.cpp:108 (GraphicsCapture)` |
| helios-windows11-windows-injection / helios-windows11 | Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider） → 保留“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 11；最低 build 待 Phase3–5 原型；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / host-native | INPUT-02 / 11 / case-helios-windows11-windows-injection | `sunshine@7c23c32925d2:src/platform/virtualhid_input.cpp:307 (keyboard)` |
| selene-android-analog-scrolling / selene-android | 用户可配置 analog_scrolling：模拟摇杆滚轮轴；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“模拟摇杆滚轮轴”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-analog-scrolling | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:89 (android:key="analog_scrolling")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:54 ("analog_scrolling")` |
| selene-android-apk-abis / selene-android | Android原APK/ABI构建入口 → 保留“Android原APK/ABI构建入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ANDROID-01 / 28 / case-selene-android-apk-abis | `moonlight-android@b48494cb96bf:app/build.gradle:10 (defaultConfig)` |
| selene-android-apps / selene-android | Android应用列表/封面/恢复/退出 → 保留“Android应用列表/封面/恢复/退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-android-apps | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/AppView.java:205 (quit)` |
| selene-android-audio-route / selene-android | Android音频输出声道/焦点/设备 → 保留“Android音频输出声道/焦点/设备”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ANDROID-02 / 28 / case-selene-android-audio-route | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/audio/AndroidAudioRenderer.java:8 (AudioTrack)` |
| selene-android-av1 / selene-android | Android AV1解码与能力查询 → 保留“Android AV1解码与能力查询”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件 / platform-adapter | CODEC-02 / 14 / case-selene-android-av1 | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/video/MediaCodecDecoderRenderer.java:186 (video/av01)` |
| selene-android-battery / selene-android | 控制器电池/Android S API分支 → 保留“控制器电池/Android S API分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-android-battery | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/input/ControllerHandler.java:1101 (sendControllerBatteryPacket)` |
| selene-android-checkbox-absolute-mouse-mode / selene-android | 用户可配置 checkbox_absolute_mouse_mode：绝对鼠标；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-android-checkbox-absolute-mouse-mode | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:143 (android:key="checkbox_absolute_mouse_mode")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:64 ("checkbox_absolute_mouse_mode")` |
| selene-android-checkbox-disable-warnings / selene-android | 用户可配置 checkbox_disable_warnings：警告展示开关；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“警告展示开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-01 / 27 / case-selene-android-checkbox-disable-warnings | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:240 (android:key="checkbox_disable_warnings")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:35 ("checkbox_disable_warnings")` |
| selene-android-checkbox-enable-audiofx / selene-android | 用户可配置 checkbox_enable_audiofx：Android音频效果；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“Android音频效果”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-02 / 12 / case-selene-android-checkbox-enable-audiofx | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:53 (android:key="checkbox_enable_audiofx")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:65 ("checkbox_enable_audiofx")` |
| selene-android-checkbox-enable-hdr / selene-android | 用户可配置 checkbox_enable_hdr：HDR；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“HDR”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-01 / 15 / case-selene-android-checkbox-enable-hdr | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:252 (android:key="checkbox_enable_hdr")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:49 ("checkbox_enable_hdr")` |
| selene-android-checkbox-enable-perf-overlay / selene-android | 用户可配置 checkbox_enable_perf_overlay：性能叠层；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“性能叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-android-checkbox-enable-perf-overlay | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:262 (android:key="checkbox_enable_perf_overlay")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:51 ("checkbox_enable_perf_overlay")` |
| selene-android-checkbox-enable-pip / selene-android | 用户可配置 checkbox_enable_pip：画中画；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“画中画”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-03 / 29 / case-selene-android-checkbox-enable-pip | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:211 (android:key="checkbox_enable_pip")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:50 ("checkbox_enable_pip")` |
| selene-android-checkbox-enable-post-stream-toast / selene-android | 用户可配置 checkbox_enable_post_stream_toast：结束后延迟统计；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“结束后延迟统计”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-android-checkbox-enable-post-stream-toast | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:267 (android:key="checkbox_enable_post_stream_toast")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:62 ("checkbox_enable_post_stream_toast")` |
| selene-android-checkbox-enable-sops / selene-android | 用户可配置 checkbox_enable_sops：主机游戏优化；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-06 / 27 / case-selene-android-checkbox-enable-sops | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:198 (android:key="checkbox_enable_sops")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:34 ("checkbox_enable_sops")` |
| selene-android-checkbox-flip-face-buttons / selene-android | 用户可配置 checkbox_flip_face_buttons：AB/XY交换；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-flip-face-buttons | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:110 (android:key="checkbox_flip_face_buttons")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:60 ("checkbox_flip_face_buttons")` |
| selene-android-checkbox-full-range / selene-android | 用户可配置 checkbox_full_range：全/有限色彩范围；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“全/有限色彩范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-09 / 15 / case-selene-android-checkbox-full-range | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:257 (android:key="checkbox_full_range")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:67 ("checkbox_full_range")` |
| selene-android-checkbox-gamepad-motion-fallback / selene-android | 用户可配置 checkbox_gamepad_motion_fallback：手机运动传感器回退；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“手机运动传感器回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-gamepad-motion-fallback | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:125 (android:key="checkbox_gamepad_motion_fallback")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:70 ("checkbox_gamepad_motion_fallback")` |
| selene-android-checkbox-gamepad-motion-sensors / selene-android | 用户可配置 checkbox_gamepad_motion_sensors：手柄运动传感器；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“手柄运动传感器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-android-checkbox-gamepad-motion-sensors | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:120 (android:key="checkbox_gamepad_motion_sensors")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:69 ("checkbox_gamepad_motion_sensors")` |
| selene-android-checkbox-gamepad-touchpad-as-mouse / selene-android | 用户可配置 checkbox_gamepad_touchpad_as_mouse：手柄触摸板鼠标；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“手柄触摸板鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-gamepad-touchpad-as-mouse | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:115 (android:key="checkbox_gamepad_touchpad_as_mouse")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:68 ("checkbox_gamepad_touchpad_as_mouse")` |
| selene-android-checkbox-host-audio / selene-android | 用户可配置 checkbox_host_audio：主机播放音频；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“主机播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-02 / 12 / case-selene-android-checkbox-host-audio | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:203 (android:key="checkbox_host_audio")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:36 ("checkbox_host_audio")` |
| selene-android-checkbox-mouse-emulation / selene-android | 用户可配置 checkbox_mouse_emulation：手柄鼠标模拟；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-mouse-emulation | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:84 (android:key="checkbox_mouse_emulation")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:53 ("checkbox_mouse_emulation")` |
| selene-android-checkbox-mouse-nav-buttons / selene-android | 用户可配置 checkbox_mouse_nav_buttons：鼠标前进/后退键；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“鼠标前进/后退键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-android-checkbox-mouse-nav-buttons | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:138 (android:key="checkbox_mouse_nav_buttons")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:55 ("checkbox_mouse_nav_buttons")` |
| selene-android-checkbox-multi-controller / selene-android | 用户可配置 checkbox_multi_controller：多控制器；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“多控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-android-checkbox-multi-controller | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:68 (android:key="checkbox_multi_controller")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:41 ("checkbox_multi_controller")` |
| selene-android-checkbox-only-show-l3r3 / selene-android | 用户可配置 checkbox_only_show_L3R3：屏幕只显示L3/R3；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“屏幕只显示L3/R3”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-only-show-l3r3 | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:164 (android:key="checkbox_only_show_L3R3")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:46 ("checkbox_only_show_L3R3")` |
| selene-android-checkbox-reduce-refresh-rate / selene-android | 用户可配置 checkbox_reduce_refresh_rate：降低屏幕刷新率匹配；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“降低屏幕刷新率匹配”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-02 / 28 / case-selene-android-checkbox-reduce-refresh-rate | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:235 (android:key="checkbox_reduce_refresh_rate")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:66 ("checkbox_reduce_refresh_rate")` |
| selene-android-checkbox-show-guide-button / selene-android | 用户可配置 checkbox_show_guide_button：屏幕Guide按钮；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“屏幕Guide按钮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-show-guide-button | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:172 (android:key="checkbox_show_guide_button")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:47 ("checkbox_show_guide_button")` |
| selene-android-checkbox-show-onscreen-controls / selene-android | 用户可配置 checkbox_show_onscreen_controls：屏幕控制器；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“屏幕控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-01 / 28 / case-selene-android-checkbox-show-onscreen-controls | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:152 (android:key="checkbox_show_onscreen_controls")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:45 ("checkbox_show_onscreen_controls")` |
| selene-android-checkbox-small-icon-mode / selene-android | 用户可配置 checkbox_small_icon_mode：小图标列表；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“小图标列表”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-01 / 27 / case-selene-android-checkbox-small-icon-mode | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:223 (android:key="checkbox_small_icon_mode")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:40 ("checkbox_small_icon_mode")` |
| selene-android-checkbox-stretch-video / selene-android | 用户可配置 checkbox_stretch_video：拉伸视频；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“拉伸视频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-02 / 28 / case-selene-android-checkbox-stretch-video | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:40 (android:key="checkbox_stretch_video")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:33 ("checkbox_stretch_video")` |
| selene-android-checkbox-touchscreen-trackpad / selene-android | 用户可配置 checkbox_touchscreen_trackpad：相对/绝对触摸；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“相对/绝对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-02 / 16 / case-selene-android-checkbox-touchscreen-trackpad | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:133 (android:key="checkbox_touchscreen_trackpad")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:61 ("checkbox_touchscreen_trackpad")` |
| selene-android-checkbox-unlock-fps / selene-android | 用户可配置 checkbox_unlock_fps：解锁高帧率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“解锁高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-02 / 28 / case-selene-android-checkbox-unlock-fps | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:230 (android:key="checkbox_unlock_fps")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:56 ("checkbox_unlock_fps")` |
| selene-android-checkbox-usb-bind-all / selene-android | 用户可配置 checkbox_usb_bind_all：USB设备接管范围；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“USB设备接管范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-android-checkbox-usb-bind-all | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:78 (android:key="checkbox_usb_bind_all")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:52 ("checkbox_usb_bind_all")` |
| selene-android-checkbox-usb-driver / selene-android | 用户可配置 checkbox_usb_driver：USB控制器驱动；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“USB控制器驱动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-android-checkbox-usb-driver | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:73 (android:key="checkbox_usb_driver")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:43 ("checkbox_usb_driver")` |
| selene-android-checkbox-vibrate-fallback / selene-android | 用户可配置 checkbox_vibrate_fallback：机身震动回退；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“机身震动回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-vibrate-fallback | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:97 (android:key="checkbox_vibrate_fallback")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:58 ("checkbox_vibrate_fallback")` |
| selene-android-checkbox-vibrate-osc / selene-android | 用户可配置 checkbox_vibrate_osc：屏幕控制器震动；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“屏幕控制器震动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-checkbox-vibrate-osc | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:156 (android:key="checkbox_vibrate_osc")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:57 ("checkbox_vibrate_osc")` |
| selene-android-frame-pacing / selene-android | 用户可配置 frame_pacing：帧节奏策略；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“帧节奏策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-02 / 28 / case-selene-android-frame-pacing | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:33 (android:key="frame_pacing")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:63 ("frame_pacing")` |
| selene-android-h264 / selene-android | Android H.264解码 → 保留“Android H.264解码”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件 / platform-adapter | ANDROID-02 / 28 / case-selene-android-h264 | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/video/MediaCodecDecoderRenderer.java:130 (video/avc)` |
| selene-android-hevc / selene-android | Android HEVC解码与能力查询 → 保留“Android HEVC解码与能力查询”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件 / platform-adapter | CODEC-01 / 14 / case-selene-android-hevc | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/video/MediaCodecDecoderRenderer.java:180 (video/hevc)` |
| selene-android-list-audio-config / selene-android | 用户可配置 list_audio_config：立体声/5.1/7.1；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“立体声/5.1/7.1”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-android-list-audio-config | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:46 (android:key="list_audio_config")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:42 ("list_audio_config")` |
| selene-android-list-fps / selene-android | 用户可配置 list_fps：帧率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-02 / 28 / case-selene-android-list-fps | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:15 (android:key="list_fps")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:30 ("list_fps")` |
| selene-android-list-languages / selene-android | 用户可配置 list_languages：语言；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-01 / 27 / case-selene-android-list-languages | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:216 (android:key="list_languages")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:39 ("list_languages")` |
| selene-android-list-resolution / selene-android | 用户可配置 list_resolution：分辨率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“分辨率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ANDROID-02 / 28 / case-selene-android-list-resolution | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:8 (android:key="list_resolution")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:29 ("list_resolution")` |
| selene-android-manual-host / selene-android | Android主机/发现/手工添加 → 保留“Android主机/发现/手工添加”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | AUTH-01 / 7 / case-selene-android-manual-host | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/PcView.java:141 (add)` |
| selene-android-mediacodec / selene-android | MediaCodec硬解/codec协商/重建 → 保留“MediaCodec硬解/codec协商/重建”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ANDROID-02 / 28 / case-selene-android-mediacodec | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/video/MediaCodecDecoderRenderer.java:26 (MediaCodec)` |
| selene-android-motion / selene-android | 手柄运动/机身运动回退 → 保留“手柄运动/机身运动回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-android-motion | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/input/ControllerHandler.java:2218 (sendControllerMotion)` |
| selene-android-mouse-wheel / selene-android | Android高精度滚轮 → 保留“Android高精度滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-01 / 11 / case-selene-android-mouse-wheel | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/Game.java:1900 (sendMouseHighResScroll)` |
| selene-android-osc-layout / selene-android | 屏幕手柄布局/编辑/重置 → 保留“屏幕手柄布局/编辑/重置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-android-osc-layout | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/input/virtual_controller/VirtualController.java:23 (VirtualController)` |
| selene-android-osc-reset / selene-android | 重置屏幕手柄自定义布局 → 保留“重置屏幕手柄自定义布局”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-04 / 16 / case-selene-android-osc-reset | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/ConfirmDeleteOscPreference.java:34 (clear)` |
| selene-android-pair / selene-android | Android配对身份 → 保留“Android配对身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-android-pair | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/nvstream/http/PairingManager.java:70 (pair)` |
| selene-android-pen / selene-android | Android笔压力/倾斜输入 → 保留“Android笔压力/倾斜输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-02 / 16 / case-selene-android-pen | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/Game.java:1665 (sendPenEvent)` |
| selene-android-permissions / selene-android | Android网络/USB/前后台/PiP权限入口 → 保留“Android网络/USB/前后台/PiP权限入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ANDROID-02 / 28 / case-selene-android-permissions | `moonlight-android@b48494cb96bf:app/src/main/AndroidManifest.xml:4 (uses-permission)` |
| selene-android-rumble / selene-android | 控制器震动与触发器震动 → 保留“控制器震动与触发器震动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-android-rumble | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/binding/input/ControllerHandler.java:1897 (rumble)` |
| selene-android-seekbar-bitrate-kbps / selene-android | 用户可配置 seekbar_bitrate_kbps：码率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-android-seekbar-bitrate-kbps | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:22 (android:key="seekbar_bitrate_kbps")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:31 ("seekbar_bitrate_kbps")` |
| selene-android-seekbar-deadzone / selene-android | 用户可配置 seekbar_deadzone：控制器死区；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“控制器死区”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-seekbar-deadzone | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:61 (android:key="seekbar_deadzone")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:37 ("seekbar_deadzone")` |
| selene-android-seekbar-osc-opacity / selene-android | 用户可配置 seekbar_osc_opacity：屏幕手柄透明度；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“屏幕手柄透明度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-seekbar-osc-opacity | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:176 (android:key="seekbar_osc_opacity")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:38 ("seekbar_osc_opacity")` |
| selene-android-seekbar-vibrate-fallback-strength / selene-android | 用户可配置 seekbar_vibrate_fallback_strength：震动回退强度；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“震动回退强度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-android-seekbar-vibrate-fallback-strength | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:102 (android:key="seekbar_vibrate_fallback_strength")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:59 ("seekbar_vibrate_fallback_strength")` |
| selene-android-shortcut / selene-android | Android应用桌面快捷方式启动 → 保留“Android应用桌面快捷方式启动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-android-shortcut | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/ShortcutTrampoline.java:273 (onCreate)` |
| selene-android-video-format / selene-android | 用户可配置 video_format：H.264/HEVC/AV1选择；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力 → 保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CODEC-02 / 14 / case-selene-android-video-format | `moonlight-android@b48494cb96bf:app/src/main/res/xml/preferences.xml:245 (android:key="video_format")`<br>`moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/preferences/PreferenceConfiguration.java:44 ("video_format")` |
| selene-android-wake / selene-android | Android Wake-on-LAN → 保留“Android Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Android；API level 与 OEM/输入/codec 条件按固定源码分支；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | OPS-01 / 36 / case-selene-android-wake | `moonlight-android@b48494cb96bf:app/src/main/java/com/limelight/nvstream/wol/WakeOnLanSender.java:24 (send)` |
| selene-ios-ipados-absolute-touch / selene-ios-ipados | iOS绝对触控 → 保留“iOS绝对触控”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-02 / 16 / case-selene-ios-ipados-absolute-touch | `moonlight-ios@02dc9780496e:Limelight/Input/AbsoluteTouchHandler.m:43 (LiSend)` |
| selene-ios-ipados-absolutetouchmode / selene-ios-ipados | iOS 独立设置 absoluteTouchMode：相对/绝对触摸，保留 Apple 可用性/设备分支 → 保留“相对/绝对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-02 / 16 / case-selene-ios-ipados-absolutetouchmode | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:35 (/\babsoluteTouchMode\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:243 (absoluteTouchMode)` |
| selene-ios-ipados-apps / selene-ios-ipados | iOS应用列表/启动/恢复/退出 → 保留“iOS应用列表/启动/恢复/退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-ios-ipados-apps | `moonlight-ios@02dc9780496e:Limelight/Network/HttpManager.m:233 (applist)` |
| selene-ios-ipados-audioconfig / selene-ios-ipados | iOS 独立设置 audioConfig：音频声道，保留 Apple 可用性/设备分支 → 保留“音频声道”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-ios-ipados-audioconfig | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:19 (/\baudioConfig\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:545 (audioConfig)` |
| selene-ios-ipados-av1 / selene-ios-ipados | iOS AV1视频分支 → 保留“iOS AV1视频分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01 / platform-adapter | CODEC-02 / 14 / case-selene-ios-ipados-av1 | `moonlight-ios@02dc9780496e:Limelight/Stream/Connection.m:109 (VIDEO_FORMAT_AV1)` |
| selene-ios-ipados-battery / selene-ios-ipados | iOS控制器电池事件 → 保留“iOS控制器电池事件”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-ios-ipados-battery | `moonlight-ios@02dc9780496e:Limelight/Input/ControllerSupport.m:459 (LiSendControllerBatteryEvent)` |
| selene-ios-ipados-bitrate / selene-ios-ipados | iOS 独立设置 bitrate：码率，保留 Apple 可用性/设备分支 → 保留“码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-ios-ipados-bitrate | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:15 (/\bbitrate\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:17 (bitrate)` |
| selene-ios-ipados-box-art / selene-ios-ipados | iOS应用封面 → 保留“iOS应用封面”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-ios-ipados-box-art | `moonlight-ios@02dc9780496e:Limelight/Network/AppAssetManager.m:9 (AppAsset)` |
| selene-ios-ipados-btmousesupport / selene-ios-ipados | iOS 独立设置 btMouseSupport：蓝牙鼠标，保留 Apple 可用性/设备分支 → 保留“蓝牙鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-ios-ipados-btmousesupport | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:34 (/\bbtMouseSupport\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:246 (btMouseSupport)` |
| selene-ios-ipados-discover / selene-ios-ipados | iOS发现/主机登记 → 保留“iOS发现/主机登记”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-ios-ipados-discover | `moonlight-ios@02dc9780496e:Limelight/Network/DiscoveryManager.m:2 (Discovery)` |
| selene-ios-ipados-enablehdr / selene-ios-ipados | iOS 独立设置 enableHdr：HDR，保留 Apple 可用性/设备分支 → 保留“HDR”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-01 / 15 / case-selene-ios-ipados-enablehdr | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:33 (/\benableHdr\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:240 (enableHdr)` |
| selene-ios-ipados-feedback / selene-ios-ipados | iOS控制器震动/触发器/光效能力 → 保留“iOS控制器震动/触发器/光效能力”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-ios-ipados-feedback | `moonlight-ios@02dc9780496e:Limelight/Input/ControllerSupport.m:57 (rumble)` |
| selene-ios-ipados-framerate / selene-ios-ipados | iOS 独立设置 framerate：帧率，保留 Apple 可用性/设备分支 → 保留“帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | IOS-01 / 32 / case-selene-ios-ipados-framerate | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:16 (/\bframerate\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:168 (framerate)` |
| selene-ios-ipados-h264 / selene-ios-ipados | iOS H.264视频分支 → 保留“iOS H.264视频分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01 / platform-adapter | IOS-01 / 32 / case-selene-ios-ipados-h264 | `moonlight-ios@02dc9780496e:Limelight/Stream/Connection.m:87 (VIDEO_FORMAT_H264)` |
| selene-ios-ipados-height / selene-ios-ipados | iOS 独立设置 height：视频高度，保留 Apple 可用性/设备分支 → 保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | IOS-01 / 32 / case-selene-ios-ipados-height | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:17 (/\bheight\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:88 (height)` |
| selene-ios-ipados-hevc / selene-ios-ipados | iOS HEVC视频分支 → 保留“iOS HEVC视频分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01 / platform-adapter | CODEC-01 / 14 / case-selene-ios-ipados-hevc | `moonlight-ios@02dc9780496e:Limelight/Stream/Connection.m:91 (VIDEO_FORMAT_H265)` |
| selene-ios-ipados-high-res-wheel / selene-ios-ipados | iOS高精度双轴滚轮 → 保留“iOS高精度双轴滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-01 / 11 / case-selene-ios-ipados-high-res-wheel | `moonlight-ios@02dc9780496e:Limelight/Input/StreamView.m:721 (LiSendHighResHScrollEvent)` |
| selene-ios-ipados-motion / selene-ios-ipados | iOS控制器运动 → 保留“iOS控制器运动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-ios-ipados-motion | `moonlight-ios@02dc9780496e:Limelight/Input/ControllerSupport.m:122 (LiSendControllerMotionEvent)` |
| selene-ios-ipados-mouse-capture / selene-ios-ipados | iOS外接键鼠/捕获可用性分支 → 保留“iOS外接键鼠/捕获可用性分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | IOS-01 / 32 / case-selene-ios-ipados-mouse-capture | `moonlight-ios@02dc9780496e:Limelight/Input/StreamView.m:91 (GC)` |
| selene-ios-ipados-multicontroller / selene-ios-ipados | iOS 独立设置 multiController：多控制器，保留 Apple 可用性/设备分支 → 保留“多控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-ios-ipados-multicontroller | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:29 (/\bmultiController\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:249 (multiController)` |
| selene-ios-ipados-onscreencontrols / selene-ios-ipados | iOS 独立设置 onscreenControls：屏幕控制器，保留 Apple 可用性/设备分支 → 保留“屏幕控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | IOS-01 / 32 / case-selene-ios-ipados-onscreencontrols | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:20 (/\bonscreenControls\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:252 (onscreenControls)` |
| selene-ios-ipados-optimizegames / selene-ios-ipados | iOS 独立设置 optimizeGames：游戏优化，保留 Apple 可用性/设备分支 → 保留“游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-06 / 27 / case-selene-ios-ipados-optimizegames | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:32 (/\boptimizeGames\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:247 (optimizeGames)` |
| selene-ios-ipados-pair / selene-ios-ipados | iOS配对/证书 → 保留“iOS配对/证书”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-ios-ipados-pair | `moonlight-ios@02dc9780496e:Limelight/Network/PairManager.m:44 (pair)` |
| selene-ios-ipados-pen / selene-ios-ipados | Apple Pencil压力/倾斜/方位与hover → 保留“Apple Pencil压力/倾斜/方位与hover”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-02 / 16 / case-selene-ios-ipados-pen | `moonlight-ios@02dc9780496e:Limelight/Input/StreamView.m:272 (LiSendPenEvent)` |
| selene-ios-ipados-permissions / selene-ios-ipados | iOS本地网络/输入与目标声明 → 保留“iOS本地网络/输入与目标声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | IOS-02 / 32 / case-selene-ios-ipados-permissions | `moonlight-ios@02dc9780496e:Limelight/Limelight-Info.plist:46 (NS)` |
| selene-ios-ipados-playaudioonpc / selene-ios-ipados | iOS 独立设置 playAudioOnPC：主机播放音频，保留 Apple 可用性/设备分支 → 保留“主机播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-02 / 12 / case-selene-ios-ipados-playaudioonpc | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:31 (/\bplayAudioOnPC\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:251 (playAudioOnPC)` |
| selene-ios-ipados-preferredcodec / selene-ios-ipados | iOS 独立设置 preferredCodec：codec偏好，保留 Apple 可用性/设备分支 → 保留“codec偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CODEC-02 / 14 / case-selene-ios-ipados-preferredcodec | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:27 (/\bpreferredCodec\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:216 (preferredCodec)` |
| selene-ios-ipados-relative-touch / selene-ios-ipados | iOS相对触摸板 → 保留“iOS相对触摸板”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-02 / 16 / case-selene-ios-ipados-relative-touch | `moonlight-ios@02dc9780496e:Limelight/Input/RelativeTouchHandler.m:57 (LiSend)` |
| selene-ios-ipados-screen-controller / selene-ios-ipados | iOS屏幕手柄/布局 → 保留“iOS屏幕手柄/布局”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | IOS-01 / 32 / case-selene-ios-ipados-screen-controller | `moonlight-ios@02dc9780496e:Limelight/Input/OnScreenControls.m:2 (OnScreenControls)` |
| selene-ios-ipados-statsoverlay / selene-ios-ipados | iOS 独立设置 statsOverlay：统计叠层，保留 Apple 可用性/设备分支 → 保留“统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-ios-ipados-statsoverlay | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:36 (/\bstatsOverlay\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:245 (statsOverlay)` |
| selene-ios-ipados-surround / selene-ios-ipados | iOS Opus多声道音频与统计 → 保留“iOS Opus多声道音频与统计”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUDIO-01 / 12 / case-selene-ios-ipados-surround | `moonlight-ios@02dc9780496e:Limelight/Stream/Connection.m:18 (opus)` |
| selene-ios-ipados-swapabxybuttons / selene-ios-ipados | iOS 独立设置 swapABXYButtons：AB/XY交换，保留 Apple 可用性/设备分支 → 保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-ios-ipados-swapabxybuttons | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:30 (/\bswapABXYButtons\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:250 (swapABXYButtons)` |
| selene-ios-ipados-useframepacing / selene-ios-ipados | iOS 独立设置 useFramePacing：帧节奏，保留 Apple 可用性/设备分支 → 保留“帧节奏”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | IOS-01 / 32 / case-selene-ios-ipados-useframepacing | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:28 (/\buseFramePacing\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:248 (useFramePacing)` |
| selene-ios-ipados-video-toolbox / selene-ios-ipados | iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现 → 保留“iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | IOS-01 / 32 / case-selene-ios-ipados-video-toolbox | `moonlight-ios@02dc9780496e:Limelight/Stream/VideoDecoderRenderer.m:27 (AVSampleBufferDisplayLayer)` |
| selene-ios-ipados-wake / selene-ios-ipados | iOS Wake-on-LAN → 保留“iOS Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | OPS-01 / 36 / case-selene-ios-ipados-wake | `moonlight-ios@02dc9780496e:Limelight/Network/WakeOnLanManager.m:40 (wake)` |
| selene-ios-ipados-width / selene-ios-ipados | iOS 独立设置 width：视频宽度，保留 Apple 可用性/设备分支 → 保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | IOS-01 / 32 / case-selene-ios-ipados-width | `moonlight-ios@02dc9780496e:Limelight/Database/TemporarySettings.h:18 (/\bwidth\b/)`<br>`moonlight-ios@02dc9780496e:Limelight/ViewControllers/SettingsViewController.m:95 (width)` |
| selene-ios-ipados-xcode-target / selene-ios-ipados | iOS/iPadOS Xcode构建/架构入口 → 保留“iOS/iPadOS Xcode构建/架构入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | iOS/iPadOS；按源码 availability/API 分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | IOS-01 / 32 / case-selene-ios-ipados-xcode-target | `moonlight-ios@02dc9780496e:Moonlight.xcodeproj/project.pbxproj:999 (IPHONEOS_DEPLOYMENT_TARGET)` |
| selene-linux-absolutemousemode / selene-linux | 用户可配置 absoluteMouseMode：桌面绝对鼠标；固定声明与实际读取/消费入口分别附锚点 → 保留“桌面绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-linux-absolutemousemode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:134 (/Q_PROPERTY\(\w+\s+absoluteMouseMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:979 (absoluteMouseMode)` |
| selene-linux-absolutetouchmode / selene-linux | 用户可配置 absoluteTouchMode：绝对/相对触摸；固定声明与实际读取/消费入口分别附锚点 → 保留“绝对/相对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-02 / 16 / case-selene-linux-absolutetouchmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:135 (/Q_PROPERTY\(\w+\s+absoluteTouchMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:30 (absoluteTouchMode)` |
| selene-linux-action-list / selene-linux | 命令动作 list → 保留“命令动作 list”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-action-list | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:193 (action == "list")` |
| selene-linux-action-pair / selene-linux | 命令动作 pair → 保留“命令动作 pair”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-action-pair | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:191 (action == "pair")` |
| selene-linux-action-quit / selene-linux | 命令动作 quit → 保留“命令动作 quit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-action-quit | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:187 (action == "quit")` |
| selene-linux-action-stream / selene-linux | 命令动作 stream → 保留“命令动作 stream”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-action-stream | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:189 (action == "stream")` |
| selene-linux-audioconfig / selene-linux | 用户可配置 audioConfig：立体声/5.1/7.1配置；固定声明与实际读取/消费入口分别附锚点 → 保留“立体声/5.1/7.1配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-linux-audioconfig | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:143 (/Q_PROPERTY\(\w+\s+audioConfig\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:707 (audioConfig)` |
| selene-linux-autoadjustbitrate / selene-linux | 用户可配置 autoAdjustBitrate：分辨率变化时调整默认码率；固定声明与实际读取/消费入口分别附锚点 → 保留“分辨率变化时调整默认码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-linux-autoadjustbitrate | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:127 (/Q_PROPERTY\(\w+\s+autoAdjustBitrate\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:284 (autoAdjustBitrate)` |
| selene-linux-av1 / selene-linux | AV1独立解码分支 → 保留“AV1独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | CODEC-02 / 14 / case-selene-linux-av1 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:612 (VIDEO_FORMAT_AV1)` |
| selene-linux-backgroundgamepad / selene-linux | 用户可配置 backgroundGamepad：后台手柄输入策略；固定声明与实际读取/消费入口分别附锚点 → 保留“后台手柄输入策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-linux-backgroundgamepad | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:154 (/Q_PROPERTY\(\w+\s+backgroundGamepad\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:57 (backgroundGamepad)` |
| selene-linux-bitratekbps / selene-linux | 用户可配置 bitrateKbps：目标码率；固定声明与实际读取/消费入口分别附锚点 → 保留“目标码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-linux-bitratekbps | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:125 (/Q_PROPERTY\(\w+\s+bitrateKbps\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:682 (bitrateKbps)` |
| selene-linux-box-art / selene-linux | 应用封面缓存/展示 → 保留“应用封面缓存/展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-linux-box-art | `moonlight-qt@de2467e43382:app/backend/boxartmanager.cpp:7 (BoxArtManager)` |
| selene-linux-capturesyskeysmode / selene-linux | 用户可配置 captureSysKeysMode：系统快捷键捕获策略；固定声明与实际读取/消费入口分别附锚点 → 保留“系统快捷键捕获策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-linux-capturesyskeysmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:158 (/Q_PROPERTY\(\w+\s+captureSysKeysMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:24 (captureSysKeysMode)` |
| selene-linux-cli-1080 / selene-linux | 受控命令入口允许配置 1080；参数语义和允许值来自固定 parser → 保留“命令参数 1080”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-1080 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:345 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("1080"/)` |
| selene-linux-cli-1440 / selene-linux | 受控命令入口允许配置 1440；参数语义和允许值来自固定 parser → 保留“命令参数 1440”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-1440 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:346 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("1440"/)` |
| selene-linux-cli-4k / selene-linux | 受控命令入口允许配置 4K；参数语义和允许值来自固定 parser → 保留“命令参数 4K”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-4k | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:347 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("4K"/)` |
| selene-linux-cli-720 / selene-linux | 受控命令入口允许配置 720；参数语义和允许值来自固定 parser → 保留“命令参数 720”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-720 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:344 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("720"/)` |
| selene-linux-cli-absolute-mouse / selene-linux | 受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser → 保留“命令参数 absolute-mouse”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-absolute-mouse | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:357 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("absolute-mouse"/)` |
| selene-linux-cli-audio-config / selene-linux | 受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser → 保留“命令参数 audio-config”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-audio-config | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:354 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("audio-config"/)` |
| selene-linux-cli-audio-on-host / selene-linux | 受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser → 保留“命令参数 audio-on-host”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-audio-on-host | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:361 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("audio-on-host"/)` |
| selene-linux-cli-background-gamepad / selene-linux | 受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser → 保留“命令参数 background-gamepad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-background-gamepad | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:364 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("background-gamepad"/)` |
| selene-linux-cli-bitrate / selene-linux | 受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser → 保留“命令参数 bitrate”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-bitrate | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:351 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("bitrate"/)` |
| selene-linux-cli-capture-system-keys / selene-linux | 受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser → 保留“命令参数 capture-system-keys”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-capture-system-keys | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:371 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("capture-system-keys"/)` |
| selene-linux-cli-csv / selene-linux | 受控命令入口允许配置 csv；参数语义和允许值来自固定 parser → 保留“命令参数 csv”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-csv | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:555 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("csv"/)` |
| selene-linux-cli-display-mode / selene-linux | 受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser → 保留“命令参数 display-mode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-display-mode | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:353 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("display-mode"/)` |
| selene-linux-cli-fps / selene-linux | 受控命令入口允许配置 fps；参数语义和允许值来自固定 parser → 保留“命令参数 fps”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-fps | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:350 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("fps"/)` |
| selene-linux-cli-frame-pacing / selene-linux | 受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser → 保留“命令参数 frame-pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-frame-pacing | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:362 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("frame-pacing"/)` |
| selene-linux-cli-game-optimization / selene-linux | 受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser → 保留“命令参数 game-optimization”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-game-optimization | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:360 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("game-optimization"/)` |
| selene-linux-cli-hdr / selene-linux | 受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser → 保留“命令参数 hdr”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-hdr | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:369 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("hdr"/)` |
| selene-linux-cli-keep-awake / selene-linux | 受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser → 保留“命令参数 keep-awake”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-keep-awake | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:367 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("keep-awake"/)` |
| selene-linux-cli-mouse-buttons-swap / selene-linux | 受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser → 保留“命令参数 mouse-buttons-swap”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-mouse-buttons-swap | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:358 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("mouse-buttons-swap"/)` |
| selene-linux-cli-multi-controller / selene-linux | 受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser → 保留“命令参数 multi-controller”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-multi-controller | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:355 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("multi-controller"/)` |
| selene-linux-cli-mute-on-focus-loss / selene-linux | 受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser → 保留“命令参数 mute-on-focus-loss”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-mute-on-focus-loss | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:363 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("mute-on-focus-loss"/)` |
| selene-linux-cli-packet-size / selene-linux | 受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser → 保留“命令参数 packet-size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-packet-size | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:352 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("packet-size"/)` |
| selene-linux-cli-performance-overlay / selene-linux | 受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser → 保留“命令参数 performance-overlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-performance-overlay | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:368 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("performance-overlay"/)` |
| selene-linux-cli-pin / selene-linux | 受控命令入口允许配置 pin；参数语义和允许值来自固定 parser → 保留“命令参数 pin”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-pin | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:262 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("pin"/)` |
| selene-linux-cli-quit-after / selene-linux | 受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser → 保留“命令参数 quit-after”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-quit-after | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:356 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("quit-after"/)` |
| selene-linux-cli-resolution / selene-linux | 受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser → 保留“命令参数 resolution”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-resolution | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:348 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("resolution"/)` |
| selene-linux-cli-reverse-scroll-direction / selene-linux | 受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser → 保留“命令参数 reverse-scroll-direction”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-reverse-scroll-direction | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:365 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("reverse-scroll-direction"/)` |
| selene-linux-cli-swap-gamepad-buttons / selene-linux | 受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser → 保留“命令参数 swap-gamepad-buttons”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-swap-gamepad-buttons | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:366 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("swap-gamepad-buttons"/)` |
| selene-linux-cli-touchscreen-trackpad / selene-linux | 受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser → 保留“命令参数 touchscreen-trackpad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-touchscreen-trackpad | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:359 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("touchscreen-trackpad"/)` |
| selene-linux-cli-verbose / selene-linux | 受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser → 保留“命令参数 verbose”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-verbose | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:556 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("verbose"/)` |
| selene-linux-cli-video-codec / selene-linux | 受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser → 保留“命令参数 video-codec”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-video-codec | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:372 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("video-codec"/)` |
| selene-linux-cli-video-decoder / selene-linux | 受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser → 保留“命令参数 video-decoder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-video-decoder | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:373 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("video-decoder"/)` |
| selene-linux-cli-vsync / selene-linux | 受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser → 保留“命令参数 vsync”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-vsync | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:349 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("vsync"/)` |
| selene-linux-cli-yuv444 / selene-linux | 受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser → 保留“命令参数 yuv444”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-linux-cli-yuv444 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:370 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("yuv444"/)` |
| selene-linux-configurationwarnings / selene-linux | 用户可配置 configurationWarnings：配置警告；固定声明与实际读取/消费入口分别附锚点 → 保留“配置警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-01 / 27 / case-selene-linux-configurationwarnings | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:138 (/Q_PROPERTY\(\w+\s+configurationWarnings\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:965 (configurationWarnings)` |
| selene-linux-connectionwarnings / selene-linux | 用户可配置 connectionWarnings：连接警告；固定声明与实际读取/消费入口分别附锚点 → 保留“连接警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-linux-connectionwarnings | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:137 (/Q_PROPERTY\(\w+\s+connectionWarnings\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:178 (connectionWarnings)` |
| selene-linux-controller-battery / selene-linux | 控制器电量上报 → 保留“控制器电量上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-linux-controller-battery | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:154 (LiSendControllerBatteryEvent)` |
| selene-linux-controller-count / selene-linux | 原README最多16玩家/控制器声明 → 保留“原README最多16玩家/控制器声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商 / platform-adapter | GAME-01 / 16 / case-selene-linux-controller-count | `moonlight-qt@de2467e43382:README.md:20 (up to 16 players)` |
| selene-linux-controller-motion / selene-linux | 控制器运动上报 → 保留“控制器运动上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-linux-controller-motion | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:443 (LiSendControllerMotionEvent)` |
| selene-linux-controller-touchpad / selene-linux | 控制器触摸板上报 → 保留“控制器触摸板上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-linux-controller-touchpad | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:485 (LiSendControllerTouchEvent)` |
| selene-linux-decoder-fallback / selene-linux | FFmpeg软/硬解路径与失败回退 → 保留“FFmpeg软/硬解路径与失败回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | LINUX-02 / 34 / case-selene-linux-decoder-fallback | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:1499 (AV_CODEC_ID_H264)` |
| selene-linux-detectnetworkblocking / selene-linux | 用户可配置 detectNetworkBlocking：网络阻断检测；固定声明与实际读取/消费入口分别附锚点 → 保留“网络阻断检测”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-linux-detectnetworkblocking | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:141 (/Q_PROPERTY\(\w+\s+detectNetworkBlocking\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1786 (detectNetworkBlocking)` |
| selene-linux-discover / selene-linux | 发现/手工主机管理 → 保留“发现/手工主机管理”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-linux-discover | `moonlight-qt@de2467e43382:app/backend/computermanager.cpp:32 (add)` |
| selene-linux-distribution-architectures / selene-linux | 平台原包与ARM32/ARM64/RISC-V入口 → 保留“平台原包与ARM32/ARM64/RISC-V入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审 / platform-adapter | SHIP-04 / 40 / case-selene-linux-distribution-architectures | `moonlight-qt@de2467e43382:README.md:30 (Generic ARM)` |
| selene-linux-enablehdr / selene-linux | 用户可配置 enableHdr：HDR/10-bit；固定声明与实际读取/消费入口分别附锚点 → 保留“HDR/10-bit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-01 / 15 / case-selene-linux-enablehdr | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:145 (/Q_PROPERTY\(\w+\s+enableHdr\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:758 (enableHdr)` |
| selene-linux-enablemdns / selene-linux | 用户可配置 enableMdns：mDNS发现开关；固定声明与实际读取/消费入口分别附锚点 → 保留“mDNS发现开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUTH-01 / 7 / case-selene-linux-enablemdns | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:132 (/Q_PROPERTY\(\w+\s+enableMdns\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1765 (enableMdns)` |
| selene-linux-enablevsync / selene-linux | 用户可配置 enableVsync：垂直同步；固定声明与实际读取/消费入口分别附锚点 → 保留“垂直同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-enablevsync | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:128 (/Q_PROPERTY\(\w+\s+enableVsync\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:281 (enableVsync)` |
| selene-linux-enableyuv444 / selene-linux | 用户可配置 enableYUV444：YUV 4:4:4；固定声明与实际读取/消费入口分别附锚点 → 保留“YUV 4:4:4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-02 / 15 / case-selene-linux-enableyuv444 | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:146 (/Q_PROPERTY\(\w+\s+enableYUV444\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:757 (enableYUV444)` |
| selene-linux-fps / selene-linux | 用户可配置 fps：目标帧率/高帧率；固定声明与实际读取/消费入口分别附锚点 → 保留“目标帧率/高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-fps | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:124 (/Q_PROPERTY\(\w+\s+fps\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:526 (fps)` |
| selene-linux-framepacing / selene-linux | 用户可配置 framePacing：帧 pacing；固定声明与实际读取/消费入口分别附锚点 → 保留“帧 pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-framepacing | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:136 (/Q_PROPERTY\(\w+\s+framePacing\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:2216 (framePacing)` |
| selene-linux-gameoptimizations / selene-linux | 用户可配置 gameOptimizations：主机游戏优化；固定声明与实际读取/消费入口分别附锚点 → 保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-06 / 27 / case-selene-linux-gameoptimizations | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:129 (/Q_PROPERTY\(\w+\s+gameOptimizations\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1599 (gameOptimizations)` |
| selene-linux-gamepadmouse / selene-linux | 用户可配置 gamepadMouse：手柄鼠标模拟；固定声明与实际读取/消费入口分别附锚点 → 保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-linux-gamepadmouse | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:140 (/Q_PROPERTY\(\w+\s+gamepadMouse\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:14 (gamepadMouse)` |
| selene-linux-h264 / selene-linux | H.264基础视频与回退 → 保留“H.264基础视频与回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | LINUX-02 / 34 / case-selene-linux-h264 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:600 (VIDEO_FORMAT_H264)` |
| selene-linux-hdr-main10 / selene-linux | HDR10-bit/色彩元数据 → 保留“HDR10-bit/色彩元数据”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | COLOR-01 / 15 / case-selene-linux-hdr-main10 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:608 (VIDEO_FORMAT_H265_MAIN10)` |
| selene-linux-height / selene-linux | 用户可配置 height：视频高度；固定声明与实际读取/消费入口分别附锚点 → 保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-height | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:123 (/Q_PROPERTY\(\w+\s+height\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:280 (height)` |
| selene-linux-hevc / selene-linux | HEVC独立解码分支 → 保留“HEVC独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | CODEC-01 / 14 / case-selene-linux-hevc | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:604 (VIDEO_FORMAT_H265)` |
| selene-linux-keepawake / selene-linux | 用户可配置 keepAwake：串流期间保持唤醒；固定声明与实际读取/消费入口分别附锚点 → 保留“串流期间保持唤醒”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-05 / 36 / case-selene-linux-keepawake | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:157 (/Q_PROPERTY\(\w+\s+keepAwake\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1934 (keepAwake)` |
| selene-linux-keycombopastetext / selene-linux | 通过 KeyComboPasteText 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboPasteText”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CLIP-01 / 25 / case-selene-linux-keycombopastetext | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:119 (m_SpecialKeyCombos[KeyComboPasteText].keyCode)` |
| selene-linux-keycomboquit / selene-linux | 通过 KeyComboQuit 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboQuit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LEASE-03 / 20 / case-selene-linux-keycomboquit | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:84 (m_SpecialKeyCombos[KeyComboQuit].keyCode)` |
| selene-linux-keycomboquitandexit / selene-linux | 通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboQuitAndExit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INST-03 / 8 / case-selene-linux-keycomboquitandexit | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:129 (m_SpecialKeyCombos[KeyComboQuitAndExit].keyCode)` |
| selene-linux-keycombotogglecursorhide / selene-linux | 通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleCursorHide”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-linux-keycombotogglecursorhide | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:109 (m_SpecialKeyCombos[KeyComboToggleCursorHide].keyCode)` |
| selene-linux-keycombotogglefullscreen / selene-linux | 通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleFullScreen”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-keycombotogglefullscreen | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:94 (m_SpecialKeyCombos[KeyComboToggleFullScreen].keyCode)` |
| selene-linux-keycombotogglekeyboardgrab / selene-linux | 通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleKeyboardGrab”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-linux-keycombotogglekeyboardgrab | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:134 (m_SpecialKeyCombos[KeyComboToggleKeyboardGrab].keyCode)` |
| selene-linux-keycombotoggleminimize / selene-linux | 通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleMinimize”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-keycombotoggleminimize | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:114 (m_SpecialKeyCombos[KeyComboToggleMinimize].keyCode)` |
| selene-linux-keycombotogglemousemode / selene-linux | 通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleMouseMode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-linux-keycombotogglemousemode | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:104 (m_SpecialKeyCombos[KeyComboToggleMouseMode].keyCode)` |
| selene-linux-keycombotogglepointerregionlock / selene-linux | 通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboTogglePointerRegionLock”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-linux-keycombotogglepointerregionlock | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:124 (m_SpecialKeyCombos[KeyComboTogglePointerRegionLock].keyCode)` |
| selene-linux-keycombotogglestatsoverlay / selene-linux | 通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleStatsOverlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-linux-keycombotogglestatsoverlay | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:99 (m_SpecialKeyCombos[KeyComboToggleStatsOverlay].keyCode)` |
| selene-linux-keycomboungrabinput / selene-linux | 通过 KeyComboUngrabInput 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboUngrabInput”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-linux-keycomboungrabinput | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:89 (m_SpecialKeyCombos[KeyComboUngrabInput].keyCode)` |
| selene-linux-language / selene-linux | 用户可配置 language：界面语言；固定声明与实际读取/消费入口分别附锚点 → 保留“界面语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-01 / 27 / case-selene-linux-language | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:159 (/Q_PROPERTY\(\w+\s+language\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:15 (language)` |
| selene-linux-list-apps / selene-linux | 应用列表/启动/恢复/显式退出 → 保留“应用列表/启动/恢复/显式退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-linux-list-apps | `moonlight-qt@de2467e43382:app/backend/nvhttp.cpp:304 (applist)` |
| selene-linux-multicontroller / selene-linux | 用户可配置 multiController：多个控制器独立编号；固定声明与实际读取/消费入口分别附锚点 → 保留“多个控制器独立编号”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-linux-multicontroller | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:131 (/Q_PROPERTY\(\w+\s+multiController\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1620 (multiController)` |
| selene-linux-multitouch / selene-linux | 原生多点触摸（声明最多10点，设备及主机条件须实测） → 保留“原生多点触摸（声明最多10点，设备及主机条件须实测）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；最多10点为README声明；需多点输入设备与主机native touch支持 / platform-adapter | GAME-02 / 16 / case-selene-linux-multitouch | `moonlight-qt@de2467e43382:app/streaming/input/abstouch.cpp:136 (LiSendTouchEvent)`<br>`moonlight-qt@de2467e43382:README.md:19 (10-point)` |
| selene-linux-muteonfocusloss / selene-linux | 用户可配置 muteOnFocusLoss：失焦静音；固定声明与实际读取/消费入口分别附锚点 → 保留“失焦静音”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-linux-muteonfocusloss | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:153 (/Q_PROPERTY\(\w+\s+muteOnFocusLoss\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:2048 (muteOnFocusLoss)` |
| selene-linux-pair / selene-linux | 配对确认与证书身份 → 保留“配对确认与证书身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-linux-pair | `moonlight-qt@de2467e43382:app/backend/nvpairingmanager.cpp:1 (pair)` |
| selene-linux-pen / selene-linux | 原生笔压力/方向输入 → 保留“原生笔压力/方向输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；触控笔、SDL平台输入及Windows注入provider分别验证 / platform-adapter | GAME-02 / 16 / case-selene-linux-pen | `moonlight-qt@de2467e43382:app/streaming/input/abstouch.cpp:130 (LiSendPenEvent)`<br>`sunshine@7c23c32925d2:src/input.cpp:617 (penButtons)` |
| selene-linux-playaudioonhost / selene-linux | 用户可配置 playAudioOnHost：主机同时播放音频；固定声明与实际读取/消费入口分别附锚点 → 保留“主机同时播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-02 / 12 / case-selene-linux-playaudioonhost | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:130 (/Q_PROPERTY\(\w+\s+playAudioOnHost\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1618 (playAudioOnHost)` |
| selene-linux-precise-horizontal-wheel / selene-linux | 高精度水平滚轮 → 保留“高精度水平滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-01 / 11 / case-selene-linux-precise-horizontal-wheel | `moonlight-qt@de2467e43382:app/streaming/input/mouse.cpp:229 (LiSendHighResHScrollEvent)`<br>`moonlight-common-c@f900dd476775:src/Limelight.h:852 (LiSendHighResHScrollEvent)`<br>`sunshine@7c23c32925d2:src/input.cpp:537 (scrollAmount)` |
| selene-linux-quitappafter / selene-linux | 用户可配置 quitAppAfter：断开后退出应用旧偏好；固定声明与实际读取/消费入口分别附锚点 → 普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INST-03 / 8 / case-selene-linux-quitappafter | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:133 (/Q_PROPERTY\(\w+\s+quitAppAfter\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1276 (quitAppAfter)` |
| selene-linux-rendererselection / selene-linux | 用户可配置 rendererSelection：原生呈现后端选择；固定声明与实际读取/消费入口分别附锚点 → 保留“原生呈现后端选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-rendererselection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:148 (/Q_PROPERTY\(\w+\s+rendererSelection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:521 (rendererSelection)` |
| selene-linux-reversescrolldirection / selene-linux | 用户可配置 reverseScrollDirection：垂直/水平精确滚轮方向；固定声明与实际读取/消费入口分别附锚点 → 保留“垂直/水平精确滚轮方向”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-linux-reversescrolldirection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:155 (/Q_PROPERTY\(\w+\s+reverseScrollDirection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:16 (reverseScrollDirection)` |
| selene-linux-rgb-led / selene-linux | 控制器RGB LED反馈 → 保留“控制器RGB LED反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-linux-rgb-led | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:950 (setControllerLED)` |
| selene-linux-richpresence / selene-linux | 用户可配置 richPresence：Discord游戏活动展示；固定声明与实际读取/消费入口分别附锚点 → 保留“Discord游戏活动展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-05 / 36 / case-selene-linux-richpresence | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:139 (/Q_PROPERTY\(\w+\s+richPresence\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1282 (richPresence)` |
| selene-linux-rumble-feedback / selene-linux | 低/高频控制器震动反馈 → 保留“低/高频控制器震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-linux-rumble-feedback | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:843 (void SdlInputHandler::rumble)` |
| selene-linux-showperformanceoverlay / selene-linux | 用户可配置 showPerformanceOverlay：串流统计叠层；固定声明与实际读取/消费入口分别附锚点 → 保留“串流统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-linux-showperformanceoverlay | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:142 (/Q_PROPERTY\(\w+\s+showPerformanceOverlay\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1958 (showPerformanceOverlay)` |
| selene-linux-surround / selene-linux | 多声道音频解码/输出 → 保留“多声道音频解码/输出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUDIO-01 / 12 / case-selene-linux-surround | `moonlight-qt@de2467e43382:app/streaming/audio/audio.cpp:60 (Opus)` |
| selene-linux-swapfacebuttons / selene-linux | 用户可配置 swapFaceButtons：AB/XY交换；固定声明与实际读取/消费入口分别附锚点 → 保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-linux-swapfacebuttons | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:156 (/Q_PROPERTY\(\w+\s+swapFaceButtons\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:17 (swapFaceButtons)` |
| selene-linux-swapmousebuttons / selene-linux | 用户可配置 swapMouseButtons：交换鼠标左右键；固定声明与实际读取/消费入口分别附锚点 → 保留“交换鼠标左右键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-linux-swapmousebuttons | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:152 (/Q_PROPERTY\(\w+\s+swapMouseButtons\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:15 (swapMouseButtons)` |
| selene-linux-trigger-rumble / selene-linux | 左右扳机震动反馈 → 保留“左右扳机震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-linux-trigger-rumble | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:602 (SDL_GameControllerRumbleTriggers)` |
| selene-linux-uidisplaymode / selene-linux | 用户可配置 uiDisplayMode：界面列表呈现偏好；固定声明与实际读取/消费入口分别附锚点 → 保留“界面列表呈现偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-01 / 27 / case-selene-linux-uidisplaymode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:151 (/Q_PROPERTY\(\w+\s+uiDisplayMode\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1202 (uiDisplayMode)` |
| selene-linux-unlockbitrate / selene-linux | 用户可配置 unlockBitrate：解锁高码率选择；固定声明与实际读取/消费入口分别附锚点 → 保留“解锁高码率选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-linux-unlockbitrate | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:126 (/Q_PROPERTY\(\w+\s+unlockBitrate\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:696 (unlockBitrate)` |
| selene-linux-utf8-text / selene-linux | UTF-8文本输入 → 保留“UTF-8文本输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-02 / 11 / case-selene-linux-utf8-text | `moonlight-qt@de2467e43382:app/streaming/input/keyboard.cpp:126 (LiSendUtf8TextEvent)` |
| selene-linux-vaapi / selene-linux | Linux VA-API硬解/interop → 保留“Linux VA-API硬解/interop”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；VA-API驱动及X11/Wayland互操作条件 / platform-adapter | LINUX-02 / 34 / case-selene-linux-vaapi | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg-renderers/vaapi.cpp:12 (VA)` |
| selene-linux-videocodecconfig / selene-linux | 用户可配置 videoCodecConfig：H.264/HEVC/AV1选择；固定声明与实际读取/消费入口分别附锚点 → 保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CODEC-02 / 14 / case-selene-linux-videocodecconfig | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:144 (/Q_PROPERTY\(\w+\s+videoCodecConfig\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:745 (videoCodecConfig)` |
| selene-linux-videodecoderselection / selene-linux | 用户可配置 videoDecoderSelection：软解/硬解选择；固定声明与实际读取/消费入口分别附锚点 → 保留“软解/硬解选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-videodecoderselection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:147 (/Q_PROPERTY\(\w+\s+videoDecoderSelection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:520 (videoDecoderSelection)` |
| selene-linux-wake / selene-linux | Wake-on-LAN → 保留“Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | OPS-01 / 36 / case-selene-linux-wake | `moonlight-qt@de2467e43382:app/backend/nvcomputer.cpp:216 (wake)` |
| selene-linux-wayland-pacing / selene-linux | Wayland垂直同步/权限路径 → 保留“Wayland垂直同步/权限路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；Wayland compositor协议/扩展，不与X11等同 / platform-adapter | LINUX-02 / 34 / case-selene-linux-wayland-pacing | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg-renderers/pacer/waylandvsyncsource.cpp:6 (Wayland)` |
| selene-linux-width / selene-linux | 用户可配置 width：视频宽度；固定声明与实际读取/消费入口分别附锚点 → 保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-width | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:122 (/Q_PROPERTY\(\w+\s+width\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:280 (width)` |
| selene-linux-windowmode / selene-linux | 用户可配置 windowMode：窗口/全屏/无边框；固定声明与实际读取/消费入口分别附锚点 → 保留“窗口/全屏/无边框”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Linux；X11/Wayland/驱动后端分别验证；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LINUX-02 / 34 / case-selene-linux-windowmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:149 (/Q_PROPERTY\(\w+\s+windowMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:569 (windowMode)` |
| selene-macos-absolutemousemode / selene-macos | 用户可配置 absoluteMouseMode：桌面绝对鼠标；固定声明与实际读取/消费入口分别附锚点 → 保留“桌面绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-macos-absolutemousemode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:134 (/Q_PROPERTY\(\w+\s+absoluteMouseMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:979 (absoluteMouseMode)` |
| selene-macos-absolutetouchmode / selene-macos | 用户可配置 absoluteTouchMode：绝对/相对触摸；固定声明与实际读取/消费入口分别附锚点 → 保留“绝对/相对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-02 / 16 / case-selene-macos-absolutetouchmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:135 (/Q_PROPERTY\(\w+\s+absoluteTouchMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:30 (absoluteTouchMode)` |
| selene-macos-action-list / selene-macos | 命令动作 list → 保留“命令动作 list”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-action-list | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:193 (action == "list")` |
| selene-macos-action-pair / selene-macos | 命令动作 pair → 保留“命令动作 pair”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-action-pair | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:191 (action == "pair")` |
| selene-macos-action-quit / selene-macos | 命令动作 quit → 保留“命令动作 quit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-action-quit | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:187 (action == "quit")` |
| selene-macos-action-stream / selene-macos | 命令动作 stream → 保留“命令动作 stream”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-action-stream | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:189 (action == "stream")` |
| selene-macos-audioconfig / selene-macos | 用户可配置 audioConfig：立体声/5.1/7.1配置；固定声明与实际读取/消费入口分别附锚点 → 保留“立体声/5.1/7.1配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-macos-audioconfig | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:143 (/Q_PROPERTY\(\w+\s+audioConfig\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:707 (audioConfig)` |
| selene-macos-autoadjustbitrate / selene-macos | 用户可配置 autoAdjustBitrate：分辨率变化时调整默认码率；固定声明与实际读取/消费入口分别附锚点 → 保留“分辨率变化时调整默认码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-macos-autoadjustbitrate | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:127 (/Q_PROPERTY\(\w+\s+autoAdjustBitrate\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:284 (autoAdjustBitrate)` |
| selene-macos-av1 / selene-macos | AV1独立解码分支 → 保留“AV1独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | CODEC-02 / 14 / case-selene-macos-av1 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:612 (VIDEO_FORMAT_AV1)` |
| selene-macos-backgroundgamepad / selene-macos | 用户可配置 backgroundGamepad：后台手柄输入策略；固定声明与实际读取/消费入口分别附锚点 → 保留“后台手柄输入策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-macos-backgroundgamepad | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:154 (/Q_PROPERTY\(\w+\s+backgroundGamepad\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:57 (backgroundGamepad)` |
| selene-macos-bitratekbps / selene-macos | 用户可配置 bitrateKbps：目标码率；固定声明与实际读取/消费入口分别附锚点 → 保留“目标码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-macos-bitratekbps | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:125 (/Q_PROPERTY\(\w+\s+bitrateKbps\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:682 (bitrateKbps)` |
| selene-macos-box-art / selene-macos | 应用封面缓存/展示 → 保留“应用封面缓存/展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-macos-box-art | `moonlight-qt@de2467e43382:app/backend/boxartmanager.cpp:7 (BoxArtManager)` |
| selene-macos-capturesyskeysmode / selene-macos | 用户可配置 captureSysKeysMode：系统快捷键捕获策略；固定声明与实际读取/消费入口分别附锚点 → 保留“系统快捷键捕获策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-macos-capturesyskeysmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:158 (/Q_PROPERTY\(\w+\s+captureSysKeysMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:24 (captureSysKeysMode)` |
| selene-macos-cli-1080 / selene-macos | 受控命令入口允许配置 1080；参数语义和允许值来自固定 parser → 保留“命令参数 1080”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-1080 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:345 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("1080"/)` |
| selene-macos-cli-1440 / selene-macos | 受控命令入口允许配置 1440；参数语义和允许值来自固定 parser → 保留“命令参数 1440”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-1440 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:346 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("1440"/)` |
| selene-macos-cli-4k / selene-macos | 受控命令入口允许配置 4K；参数语义和允许值来自固定 parser → 保留“命令参数 4K”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-4k | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:347 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("4K"/)` |
| selene-macos-cli-720 / selene-macos | 受控命令入口允许配置 720；参数语义和允许值来自固定 parser → 保留“命令参数 720”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-720 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:344 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("720"/)` |
| selene-macos-cli-absolute-mouse / selene-macos | 受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser → 保留“命令参数 absolute-mouse”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-absolute-mouse | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:357 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("absolute-mouse"/)` |
| selene-macos-cli-audio-config / selene-macos | 受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser → 保留“命令参数 audio-config”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-audio-config | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:354 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("audio-config"/)` |
| selene-macos-cli-audio-on-host / selene-macos | 受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser → 保留“命令参数 audio-on-host”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-audio-on-host | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:361 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("audio-on-host"/)` |
| selene-macos-cli-background-gamepad / selene-macos | 受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser → 保留“命令参数 background-gamepad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-background-gamepad | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:364 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("background-gamepad"/)` |
| selene-macos-cli-bitrate / selene-macos | 受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser → 保留“命令参数 bitrate”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-bitrate | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:351 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("bitrate"/)` |
| selene-macos-cli-capture-system-keys / selene-macos | 受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser → 保留“命令参数 capture-system-keys”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-capture-system-keys | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:371 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("capture-system-keys"/)` |
| selene-macos-cli-csv / selene-macos | 受控命令入口允许配置 csv；参数语义和允许值来自固定 parser → 保留“命令参数 csv”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-csv | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:555 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("csv"/)` |
| selene-macos-cli-display-mode / selene-macos | 受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser → 保留“命令参数 display-mode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-display-mode | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:353 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("display-mode"/)` |
| selene-macos-cli-fps / selene-macos | 受控命令入口允许配置 fps；参数语义和允许值来自固定 parser → 保留“命令参数 fps”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-fps | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:350 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("fps"/)` |
| selene-macos-cli-frame-pacing / selene-macos | 受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser → 保留“命令参数 frame-pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-frame-pacing | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:362 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("frame-pacing"/)` |
| selene-macos-cli-game-optimization / selene-macos | 受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser → 保留“命令参数 game-optimization”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-game-optimization | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:360 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("game-optimization"/)` |
| selene-macos-cli-hdr / selene-macos | 受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser → 保留“命令参数 hdr”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-hdr | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:369 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("hdr"/)` |
| selene-macos-cli-keep-awake / selene-macos | 受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser → 保留“命令参数 keep-awake”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-keep-awake | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:367 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("keep-awake"/)` |
| selene-macos-cli-mouse-buttons-swap / selene-macos | 受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser → 保留“命令参数 mouse-buttons-swap”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-mouse-buttons-swap | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:358 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("mouse-buttons-swap"/)` |
| selene-macos-cli-multi-controller / selene-macos | 受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser → 保留“命令参数 multi-controller”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-multi-controller | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:355 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("multi-controller"/)` |
| selene-macos-cli-mute-on-focus-loss / selene-macos | 受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser → 保留“命令参数 mute-on-focus-loss”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-mute-on-focus-loss | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:363 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("mute-on-focus-loss"/)` |
| selene-macos-cli-packet-size / selene-macos | 受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser → 保留“命令参数 packet-size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-packet-size | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:352 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("packet-size"/)` |
| selene-macos-cli-performance-overlay / selene-macos | 受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser → 保留“命令参数 performance-overlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-performance-overlay | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:368 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("performance-overlay"/)` |
| selene-macos-cli-pin / selene-macos | 受控命令入口允许配置 pin；参数语义和允许值来自固定 parser → 保留“命令参数 pin”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-pin | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:262 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("pin"/)` |
| selene-macos-cli-quit-after / selene-macos | 受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser → 保留“命令参数 quit-after”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-quit-after | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:356 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("quit-after"/)` |
| selene-macos-cli-resolution / selene-macos | 受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser → 保留“命令参数 resolution”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-resolution | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:348 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("resolution"/)` |
| selene-macos-cli-reverse-scroll-direction / selene-macos | 受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser → 保留“命令参数 reverse-scroll-direction”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-reverse-scroll-direction | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:365 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("reverse-scroll-direction"/)` |
| selene-macos-cli-swap-gamepad-buttons / selene-macos | 受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser → 保留“命令参数 swap-gamepad-buttons”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-swap-gamepad-buttons | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:366 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("swap-gamepad-buttons"/)` |
| selene-macos-cli-touchscreen-trackpad / selene-macos | 受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser → 保留“命令参数 touchscreen-trackpad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-touchscreen-trackpad | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:359 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("touchscreen-trackpad"/)` |
| selene-macos-cli-verbose / selene-macos | 受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser → 保留“命令参数 verbose”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-verbose | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:556 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("verbose"/)` |
| selene-macos-cli-video-codec / selene-macos | 受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser → 保留“命令参数 video-codec”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-video-codec | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:372 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("video-codec"/)` |
| selene-macos-cli-video-decoder / selene-macos | 受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser → 保留“命令参数 video-decoder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-video-decoder | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:373 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("video-decoder"/)` |
| selene-macos-cli-vsync / selene-macos | 受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser → 保留“命令参数 vsync”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-vsync | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:349 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("vsync"/)` |
| selene-macos-cli-yuv444 / selene-macos | 受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser → 保留“命令参数 yuv444”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-macos-cli-yuv444 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:370 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("yuv444"/)` |
| selene-macos-configurationwarnings / selene-macos | 用户可配置 configurationWarnings：配置警告；固定声明与实际读取/消费入口分别附锚点 → 保留“配置警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-01 / 27 / case-selene-macos-configurationwarnings | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:138 (/Q_PROPERTY\(\w+\s+configurationWarnings\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:965 (configurationWarnings)` |
| selene-macos-connectionwarnings / selene-macos | 用户可配置 connectionWarnings：连接警告；固定声明与实际读取/消费入口分别附锚点 → 保留“连接警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-macos-connectionwarnings | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:137 (/Q_PROPERTY\(\w+\s+connectionWarnings\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:178 (connectionWarnings)` |
| selene-macos-controller-battery / selene-macos | 控制器电量上报 → 保留“控制器电量上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-macos-controller-battery | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:154 (LiSendControllerBatteryEvent)` |
| selene-macos-controller-count / selene-macos | 原README最多16玩家/控制器声明 → 保留“原README最多16玩家/控制器声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商 / platform-adapter | GAME-01 / 16 / case-selene-macos-controller-count | `moonlight-qt@de2467e43382:README.md:20 (up to 16 players)` |
| selene-macos-controller-motion / selene-macos | 控制器运动上报 → 保留“控制器运动上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-macos-controller-motion | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:443 (LiSendControllerMotionEvent)` |
| selene-macos-controller-touchpad / selene-macos | 控制器触摸板上报 → 保留“控制器触摸板上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-macos-controller-touchpad | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:485 (LiSendControllerTouchEvent)` |
| selene-macos-decoder-fallback / selene-macos | FFmpeg软/硬解路径与失败回退 → 保留“FFmpeg软/硬解路径与失败回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | MAC-02 / 30 / case-selene-macos-decoder-fallback | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:1499 (AV_CODEC_ID_H264)` |
| selene-macos-detectnetworkblocking / selene-macos | 用户可配置 detectNetworkBlocking：网络阻断检测；固定声明与实际读取/消费入口分别附锚点 → 保留“网络阻断检测”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-macos-detectnetworkblocking | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:141 (/Q_PROPERTY\(\w+\s+detectNetworkBlocking\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1786 (detectNetworkBlocking)` |
| selene-macos-discover / selene-macos | 发现/手工主机管理 → 保留“发现/手工主机管理”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-macos-discover | `moonlight-qt@de2467e43382:app/backend/computermanager.cpp:32 (add)` |
| selene-macos-distribution-architectures / selene-macos | 平台原包与ARM32/ARM64/RISC-V入口 → 保留“平台原包与ARM32/ARM64/RISC-V入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审 / platform-adapter | SHIP-03 / 40 / case-selene-macos-distribution-architectures | `moonlight-qt@de2467e43382:README.md:30 (Generic ARM)` |
| selene-macos-enablehdr / selene-macos | 用户可配置 enableHdr：HDR/10-bit；固定声明与实际读取/消费入口分别附锚点 → 保留“HDR/10-bit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-01 / 15 / case-selene-macos-enablehdr | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:145 (/Q_PROPERTY\(\w+\s+enableHdr\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:758 (enableHdr)` |
| selene-macos-enablemdns / selene-macos | 用户可配置 enableMdns：mDNS发现开关；固定声明与实际读取/消费入口分别附锚点 → 保留“mDNS发现开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUTH-01 / 7 / case-selene-macos-enablemdns | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:132 (/Q_PROPERTY\(\w+\s+enableMdns\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1765 (enableMdns)` |
| selene-macos-enablevsync / selene-macos | 用户可配置 enableVsync：垂直同步；固定声明与实际读取/消费入口分别附锚点 → 保留“垂直同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-enablevsync | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:128 (/Q_PROPERTY\(\w+\s+enableVsync\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:281 (enableVsync)` |
| selene-macos-enableyuv444 / selene-macos | 用户可配置 enableYUV444：YUV 4:4:4；固定声明与实际读取/消费入口分别附锚点 → 保留“YUV 4:4:4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-02 / 15 / case-selene-macos-enableyuv444 | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:146 (/Q_PROPERTY\(\w+\s+enableYUV444\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:757 (enableYUV444)` |
| selene-macos-fps / selene-macos | 用户可配置 fps：目标帧率/高帧率；固定声明与实际读取/消费入口分别附锚点 → 保留“目标帧率/高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-fps | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:124 (/Q_PROPERTY\(\w+\s+fps\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:526 (fps)` |
| selene-macos-framepacing / selene-macos | 用户可配置 framePacing：帧 pacing；固定声明与实际读取/消费入口分别附锚点 → 保留“帧 pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-framepacing | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:136 (/Q_PROPERTY\(\w+\s+framePacing\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:2216 (framePacing)` |
| selene-macos-gameoptimizations / selene-macos | 用户可配置 gameOptimizations：主机游戏优化；固定声明与实际读取/消费入口分别附锚点 → 保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-06 / 27 / case-selene-macos-gameoptimizations | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:129 (/Q_PROPERTY\(\w+\s+gameOptimizations\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1599 (gameOptimizations)` |
| selene-macos-gamepadmouse / selene-macos | 用户可配置 gamepadMouse：手柄鼠标模拟；固定声明与实际读取/消费入口分别附锚点 → 保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-macos-gamepadmouse | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:140 (/Q_PROPERTY\(\w+\s+gamepadMouse\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:14 (gamepadMouse)` |
| selene-macos-h264 / selene-macos | H.264基础视频与回退 → 保留“H.264基础视频与回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | MAC-02 / 30 / case-selene-macos-h264 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:600 (VIDEO_FORMAT_H264)` |
| selene-macos-hdr-main10 / selene-macos | HDR10-bit/色彩元数据 → 保留“HDR10-bit/色彩元数据”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | COLOR-01 / 15 / case-selene-macos-hdr-main10 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:608 (VIDEO_FORMAT_H265_MAIN10)` |
| selene-macos-height / selene-macos | 用户可配置 height：视频高度；固定声明与实际读取/消费入口分别附锚点 → 保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-height | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:123 (/Q_PROPERTY\(\w+\s+height\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:280 (height)` |
| selene-macos-hevc / selene-macos | HEVC独立解码分支 → 保留“HEVC独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | CODEC-01 / 14 / case-selene-macos-hevc | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:604 (VIDEO_FORMAT_H265)` |
| selene-macos-keepawake / selene-macos | 用户可配置 keepAwake：串流期间保持唤醒；固定声明与实际读取/消费入口分别附锚点 → 保留“串流期间保持唤醒”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-05 / 36 / case-selene-macos-keepawake | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:157 (/Q_PROPERTY\(\w+\s+keepAwake\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1934 (keepAwake)` |
| selene-macos-keycombopastetext / selene-macos | 通过 KeyComboPasteText 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboPasteText”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CLIP-01 / 25 / case-selene-macos-keycombopastetext | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:119 (m_SpecialKeyCombos[KeyComboPasteText].keyCode)` |
| selene-macos-keycomboquit / selene-macos | 通过 KeyComboQuit 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboQuit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LEASE-03 / 20 / case-selene-macos-keycomboquit | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:84 (m_SpecialKeyCombos[KeyComboQuit].keyCode)` |
| selene-macos-keycomboquitandexit / selene-macos | 通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboQuitAndExit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INST-03 / 8 / case-selene-macos-keycomboquitandexit | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:129 (m_SpecialKeyCombos[KeyComboQuitAndExit].keyCode)` |
| selene-macos-keycombotogglecursorhide / selene-macos | 通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleCursorHide”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-macos-keycombotogglecursorhide | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:109 (m_SpecialKeyCombos[KeyComboToggleCursorHide].keyCode)` |
| selene-macos-keycombotogglefullscreen / selene-macos | 通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleFullScreen”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-keycombotogglefullscreen | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:94 (m_SpecialKeyCombos[KeyComboToggleFullScreen].keyCode)` |
| selene-macos-keycombotogglekeyboardgrab / selene-macos | 通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleKeyboardGrab”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-macos-keycombotogglekeyboardgrab | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:134 (m_SpecialKeyCombos[KeyComboToggleKeyboardGrab].keyCode)` |
| selene-macos-keycombotoggleminimize / selene-macos | 通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleMinimize”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-keycombotoggleminimize | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:114 (m_SpecialKeyCombos[KeyComboToggleMinimize].keyCode)` |
| selene-macos-keycombotogglemousemode / selene-macos | 通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleMouseMode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-macos-keycombotogglemousemode | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:104 (m_SpecialKeyCombos[KeyComboToggleMouseMode].keyCode)` |
| selene-macos-keycombotogglepointerregionlock / selene-macos | 通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboTogglePointerRegionLock”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-macos-keycombotogglepointerregionlock | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:124 (m_SpecialKeyCombos[KeyComboTogglePointerRegionLock].keyCode)` |
| selene-macos-keycombotogglestatsoverlay / selene-macos | 通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleStatsOverlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-macos-keycombotogglestatsoverlay | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:99 (m_SpecialKeyCombos[KeyComboToggleStatsOverlay].keyCode)` |
| selene-macos-keycomboungrabinput / selene-macos | 通过 KeyComboUngrabInput 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboUngrabInput”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-macos-keycomboungrabinput | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:89 (m_SpecialKeyCombos[KeyComboUngrabInput].keyCode)` |
| selene-macos-language / selene-macos | 用户可配置 language：界面语言；固定声明与实际读取/消费入口分别附锚点 → 保留“界面语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-01 / 27 / case-selene-macos-language | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:159 (/Q_PROPERTY\(\w+\s+language\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:15 (language)` |
| selene-macos-list-apps / selene-macos | 应用列表/启动/恢复/显式退出 → 保留“应用列表/启动/恢复/显式退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-macos-list-apps | `moonlight-qt@de2467e43382:app/backend/nvhttp.cpp:304 (applist)` |
| selene-macos-metal / selene-macos | macOS Metal/VideoToolbox呈现入口 → 保留“macOS Metal/VideoToolbox呈现入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；需要macOS/Xcode工具链及GPU/OS支持；VFY-02仅实机延期 / platform-adapter | MAC-02 / 30 / case-selene-macos-metal | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg-renderers/vt_metal.mm:18 (Metal)` |
| selene-macos-multicontroller / selene-macos | 用户可配置 multiController：多个控制器独立编号；固定声明与实际读取/消费入口分别附锚点 → 保留“多个控制器独立编号”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-macos-multicontroller | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:131 (/Q_PROPERTY\(\w+\s+multiController\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1620 (multiController)` |
| selene-macos-multitouch / selene-macos | 原生多点触摸（声明最多10点，设备及主机条件须实测） → 保留“原生多点触摸（声明最多10点，设备及主机条件须实测）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；最多10点为README声明；需多点输入设备与主机native touch支持 / platform-adapter | GAME-02 / 16 / case-selene-macos-multitouch | `moonlight-qt@de2467e43382:app/streaming/input/abstouch.cpp:136 (LiSendTouchEvent)`<br>`moonlight-qt@de2467e43382:README.md:19 (10-point)` |
| selene-macos-muteonfocusloss / selene-macos | 用户可配置 muteOnFocusLoss：失焦静音；固定声明与实际读取/消费入口分别附锚点 → 保留“失焦静音”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-macos-muteonfocusloss | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:153 (/Q_PROPERTY\(\w+\s+muteOnFocusLoss\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:2048 (muteOnFocusLoss)` |
| selene-macos-pair / selene-macos | 配对确认与证书身份 → 保留“配对确认与证书身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-macos-pair | `moonlight-qt@de2467e43382:app/backend/nvpairingmanager.cpp:1 (pair)` |
| selene-macos-pen / selene-macos | 原生笔压力/方向输入 → 保留“原生笔压力/方向输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；触控笔、SDL平台输入及Windows注入provider分别验证 / platform-adapter | GAME-02 / 16 / case-selene-macos-pen | `moonlight-qt@de2467e43382:app/streaming/input/abstouch.cpp:130 (LiSendPenEvent)`<br>`sunshine@7c23c32925d2:src/input.cpp:617 (penButtons)` |
| selene-macos-playaudioonhost / selene-macos | 用户可配置 playAudioOnHost：主机同时播放音频；固定声明与实际读取/消费入口分别附锚点 → 保留“主机同时播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-02 / 12 / case-selene-macos-playaudioonhost | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:130 (/Q_PROPERTY\(\w+\s+playAudioOnHost\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1618 (playAudioOnHost)` |
| selene-macos-precise-horizontal-wheel / selene-macos | 高精度水平滚轮 → 保留“高精度水平滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-01 / 11 / case-selene-macos-precise-horizontal-wheel | `moonlight-qt@de2467e43382:app/streaming/input/mouse.cpp:229 (LiSendHighResHScrollEvent)`<br>`moonlight-common-c@f900dd476775:src/Limelight.h:852 (LiSendHighResHScrollEvent)`<br>`sunshine@7c23c32925d2:src/input.cpp:537 (scrollAmount)` |
| selene-macos-quitappafter / selene-macos | 用户可配置 quitAppAfter：断开后退出应用旧偏好；固定声明与实际读取/消费入口分别附锚点 → 普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INST-03 / 8 / case-selene-macos-quitappafter | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:133 (/Q_PROPERTY\(\w+\s+quitAppAfter\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1276 (quitAppAfter)` |
| selene-macos-rendererselection / selene-macos | 用户可配置 rendererSelection：原生呈现后端选择；固定声明与实际读取/消费入口分别附锚点 → 保留“原生呈现后端选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-rendererselection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:148 (/Q_PROPERTY\(\w+\s+rendererSelection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:521 (rendererSelection)` |
| selene-macos-reversescrolldirection / selene-macos | 用户可配置 reverseScrollDirection：垂直/水平精确滚轮方向；固定声明与实际读取/消费入口分别附锚点 → 保留“垂直/水平精确滚轮方向”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-macos-reversescrolldirection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:155 (/Q_PROPERTY\(\w+\s+reverseScrollDirection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:16 (reverseScrollDirection)` |
| selene-macos-rgb-led / selene-macos | 控制器RGB LED反馈 → 保留“控制器RGB LED反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-macos-rgb-led | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:950 (setControllerLED)` |
| selene-macos-richpresence / selene-macos | 用户可配置 richPresence：Discord游戏活动展示；固定声明与实际读取/消费入口分别附锚点 → 保留“Discord游戏活动展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-05 / 36 / case-selene-macos-richpresence | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:139 (/Q_PROPERTY\(\w+\s+richPresence\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1282 (richPresence)` |
| selene-macos-rumble-feedback / selene-macos | 低/高频控制器震动反馈 → 保留“低/高频控制器震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-macos-rumble-feedback | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:843 (void SdlInputHandler::rumble)` |
| selene-macos-showperformanceoverlay / selene-macos | 用户可配置 showPerformanceOverlay：串流统计叠层；固定声明与实际读取/消费入口分别附锚点 → 保留“串流统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-macos-showperformanceoverlay | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:142 (/Q_PROPERTY\(\w+\s+showPerformanceOverlay\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1958 (showPerformanceOverlay)` |
| selene-macos-surround / selene-macos | 多声道音频解码/输出 → 保留“多声道音频解码/输出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUDIO-01 / 12 / case-selene-macos-surround | `moonlight-qt@de2467e43382:app/streaming/audio/audio.cpp:60 (Opus)` |
| selene-macos-swapfacebuttons / selene-macos | 用户可配置 swapFaceButtons：AB/XY交换；固定声明与实际读取/消费入口分别附锚点 → 保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-macos-swapfacebuttons | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:156 (/Q_PROPERTY\(\w+\s+swapFaceButtons\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:17 (swapFaceButtons)` |
| selene-macos-swapmousebuttons / selene-macos | 用户可配置 swapMouseButtons：交换鼠标左右键；固定声明与实际读取/消费入口分别附锚点 → 保留“交换鼠标左右键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-macos-swapmousebuttons | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:152 (/Q_PROPERTY\(\w+\s+swapMouseButtons\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:15 (swapMouseButtons)` |
| selene-macos-trigger-rumble / selene-macos | 左右扳机震动反馈 → 保留“左右扳机震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-macos-trigger-rumble | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:602 (SDL_GameControllerRumbleTriggers)` |
| selene-macos-uidisplaymode / selene-macos | 用户可配置 uiDisplayMode：界面列表呈现偏好；固定声明与实际读取/消费入口分别附锚点 → 保留“界面列表呈现偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-01 / 27 / case-selene-macos-uidisplaymode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:151 (/Q_PROPERTY\(\w+\s+uiDisplayMode\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1202 (uiDisplayMode)` |
| selene-macos-unlockbitrate / selene-macos | 用户可配置 unlockBitrate：解锁高码率选择；固定声明与实际读取/消费入口分别附锚点 → 保留“解锁高码率选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-macos-unlockbitrate | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:126 (/Q_PROPERTY\(\w+\s+unlockBitrate\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:696 (unlockBitrate)` |
| selene-macos-utf8-text / selene-macos | UTF-8文本输入 → 保留“UTF-8文本输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-02 / 11 / case-selene-macos-utf8-text | `moonlight-qt@de2467e43382:app/streaming/input/keyboard.cpp:126 (LiSendUtf8TextEvent)` |
| selene-macos-videocodecconfig / selene-macos | 用户可配置 videoCodecConfig：H.264/HEVC/AV1选择；固定声明与实际读取/消费入口分别附锚点 → 保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CODEC-02 / 14 / case-selene-macos-videocodecconfig | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:144 (/Q_PROPERTY\(\w+\s+videoCodecConfig\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:745 (videoCodecConfig)` |
| selene-macos-videodecoderselection / selene-macos | 用户可配置 videoDecoderSelection：软解/硬解选择；固定声明与实际读取/消费入口分别附锚点 → 保留“软解/硬解选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-videodecoderselection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:147 (/Q_PROPERTY\(\w+\s+videoDecoderSelection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:520 (videoDecoderSelection)` |
| selene-macos-wake / selene-macos | Wake-on-LAN → 保留“Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | OPS-01 / 36 / case-selene-macos-wake | `moonlight-qt@de2467e43382:app/backend/nvcomputer.cpp:216 (wake)` |
| selene-macos-width / selene-macos | 用户可配置 width：视频宽度；固定声明与实际读取/消费入口分别附锚点 → 保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-width | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:122 (/Q_PROPERTY\(\w+\s+width\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:280 (width)` |
| selene-macos-windowmode / selene-macos | 用户可配置 windowMode：窗口/全屏/无边框；固定声明与实际读取/消费入口分别附锚点 → 保留“窗口/全屏/无边框”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | macOS；按 Apple 原生后端/权限分支；最低范围待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | MAC-02 / 30 / case-selene-macos-windowmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:149 (/Q_PROPERTY\(\w+\s+windowMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:569 (windowMode)` |
| selene-windows-absolutemousemode / selene-windows | 用户可配置 absoluteMouseMode：桌面绝对鼠标；固定声明与实际读取/消费入口分别附锚点 → 保留“桌面绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-windows-absolutemousemode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:134 (/Q_PROPERTY\(\w+\s+absoluteMouseMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:979 (absoluteMouseMode)` |
| selene-windows-absolutetouchmode / selene-windows | 用户可配置 absoluteTouchMode：绝对/相对触摸；固定声明与实际读取/消费入口分别附锚点 → 保留“绝对/相对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-02 / 16 / case-selene-windows-absolutetouchmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:135 (/Q_PROPERTY\(\w+\s+absoluteTouchMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:30 (absoluteTouchMode)` |
| selene-windows-action-list / selene-windows | 命令动作 list → 保留“命令动作 list”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-action-list | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:193 (action == "list")` |
| selene-windows-action-pair / selene-windows | 命令动作 pair → 保留“命令动作 pair”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-action-pair | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:191 (action == "pair")` |
| selene-windows-action-quit / selene-windows | 命令动作 quit → 保留“命令动作 quit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-action-quit | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:187 (action == "quit")` |
| selene-windows-action-stream / selene-windows | 命令动作 stream → 保留“命令动作 stream”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-action-stream | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:189 (action == "stream")` |
| selene-windows-audioconfig / selene-windows | 用户可配置 audioConfig：立体声/5.1/7.1配置；固定声明与实际读取/消费入口分别附锚点 → 保留“立体声/5.1/7.1配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-windows-audioconfig | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:143 (/Q_PROPERTY\(\w+\s+audioConfig\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:707 (audioConfig)` |
| selene-windows-autoadjustbitrate / selene-windows | 用户可配置 autoAdjustBitrate：分辨率变化时调整默认码率；固定声明与实际读取/消费入口分别附锚点 → 保留“分辨率变化时调整默认码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-windows-autoadjustbitrate | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:127 (/Q_PROPERTY\(\w+\s+autoAdjustBitrate\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:284 (autoAdjustBitrate)` |
| selene-windows-av1 / selene-windows | AV1独立解码分支 → 保留“AV1独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | CODEC-02 / 14 / case-selene-windows-av1 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:612 (VIDEO_FORMAT_AV1)` |
| selene-windows-backgroundgamepad / selene-windows | 用户可配置 backgroundGamepad：后台手柄输入策略；固定声明与实际读取/消费入口分别附锚点 → 保留“后台手柄输入策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-windows-backgroundgamepad | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:154 (/Q_PROPERTY\(\w+\s+backgroundGamepad\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:57 (backgroundGamepad)` |
| selene-windows-bitratekbps / selene-windows | 用户可配置 bitrateKbps：目标码率；固定声明与实际读取/消费入口分别附锚点 → 保留“目标码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-windows-bitratekbps | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:125 (/Q_PROPERTY\(\w+\s+bitrateKbps\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:682 (bitrateKbps)` |
| selene-windows-box-art / selene-windows | 应用封面缓存/展示 → 保留“应用封面缓存/展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-windows-box-art | `moonlight-qt@de2467e43382:app/backend/boxartmanager.cpp:7 (BoxArtManager)` |
| selene-windows-capturesyskeysmode / selene-windows | 用户可配置 captureSysKeysMode：系统快捷键捕获策略；固定声明与实际读取/消费入口分别附锚点 → 保留“系统快捷键捕获策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-windows-capturesyskeysmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:158 (/Q_PROPERTY\(\w+\s+captureSysKeysMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:24 (captureSysKeysMode)` |
| selene-windows-cli-1080 / selene-windows | 受控命令入口允许配置 1080；参数语义和允许值来自固定 parser → 保留“命令参数 1080”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-1080 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:345 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("1080"/)` |
| selene-windows-cli-1440 / selene-windows | 受控命令入口允许配置 1440；参数语义和允许值来自固定 parser → 保留“命令参数 1440”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-1440 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:346 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("1440"/)` |
| selene-windows-cli-4k / selene-windows | 受控命令入口允许配置 4K；参数语义和允许值来自固定 parser → 保留“命令参数 4K”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-4k | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:347 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("4K"/)` |
| selene-windows-cli-720 / selene-windows | 受控命令入口允许配置 720；参数语义和允许值来自固定 parser → 保留“命令参数 720”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-720 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:344 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("720"/)` |
| selene-windows-cli-absolute-mouse / selene-windows | 受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser → 保留“命令参数 absolute-mouse”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-absolute-mouse | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:357 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("absolute-mouse"/)` |
| selene-windows-cli-audio-config / selene-windows | 受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser → 保留“命令参数 audio-config”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-audio-config | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:354 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("audio-config"/)` |
| selene-windows-cli-audio-on-host / selene-windows | 受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser → 保留“命令参数 audio-on-host”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-audio-on-host | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:361 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("audio-on-host"/)` |
| selene-windows-cli-background-gamepad / selene-windows | 受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser → 保留“命令参数 background-gamepad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-background-gamepad | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:364 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("background-gamepad"/)` |
| selene-windows-cli-bitrate / selene-windows | 受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser → 保留“命令参数 bitrate”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-bitrate | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:351 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("bitrate"/)` |
| selene-windows-cli-capture-system-keys / selene-windows | 受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser → 保留“命令参数 capture-system-keys”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-capture-system-keys | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:371 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("capture-system-keys"/)` |
| selene-windows-cli-csv / selene-windows | 受控命令入口允许配置 csv；参数语义和允许值来自固定 parser → 保留“命令参数 csv”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-csv | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:555 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("csv"/)` |
| selene-windows-cli-display-mode / selene-windows | 受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser → 保留“命令参数 display-mode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-display-mode | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:353 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("display-mode"/)` |
| selene-windows-cli-fps / selene-windows | 受控命令入口允许配置 fps；参数语义和允许值来自固定 parser → 保留“命令参数 fps”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-fps | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:350 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("fps"/)` |
| selene-windows-cli-frame-pacing / selene-windows | 受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser → 保留“命令参数 frame-pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-frame-pacing | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:362 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("frame-pacing"/)` |
| selene-windows-cli-game-optimization / selene-windows | 受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser → 保留“命令参数 game-optimization”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-game-optimization | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:360 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("game-optimization"/)` |
| selene-windows-cli-hdr / selene-windows | 受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser → 保留“命令参数 hdr”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-hdr | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:369 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("hdr"/)` |
| selene-windows-cli-keep-awake / selene-windows | 受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser → 保留“命令参数 keep-awake”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-keep-awake | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:367 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("keep-awake"/)` |
| selene-windows-cli-mouse-buttons-swap / selene-windows | 受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser → 保留“命令参数 mouse-buttons-swap”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-mouse-buttons-swap | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:358 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("mouse-buttons-swap"/)` |
| selene-windows-cli-multi-controller / selene-windows | 受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser → 保留“命令参数 multi-controller”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-multi-controller | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:355 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("multi-controller"/)` |
| selene-windows-cli-mute-on-focus-loss / selene-windows | 受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser → 保留“命令参数 mute-on-focus-loss”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-mute-on-focus-loss | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:363 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("mute-on-focus-loss"/)` |
| selene-windows-cli-packet-size / selene-windows | 受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser → 保留“命令参数 packet-size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-packet-size | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:352 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("packet-size"/)` |
| selene-windows-cli-performance-overlay / selene-windows | 受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser → 保留“命令参数 performance-overlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-performance-overlay | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:368 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("performance-overlay"/)` |
| selene-windows-cli-pin / selene-windows | 受控命令入口允许配置 pin；参数语义和允许值来自固定 parser → 保留“命令参数 pin”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-pin | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:262 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("pin"/)` |
| selene-windows-cli-quit-after / selene-windows | 受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser → 保留“命令参数 quit-after”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-quit-after | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:356 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("quit-after"/)` |
| selene-windows-cli-resolution / selene-windows | 受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser → 保留“命令参数 resolution”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-resolution | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:348 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("resolution"/)` |
| selene-windows-cli-reverse-scroll-direction / selene-windows | 受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser → 保留“命令参数 reverse-scroll-direction”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-reverse-scroll-direction | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:365 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("reverse-scroll-direction"/)` |
| selene-windows-cli-swap-gamepad-buttons / selene-windows | 受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser → 保留“命令参数 swap-gamepad-buttons”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-swap-gamepad-buttons | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:366 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("swap-gamepad-buttons"/)` |
| selene-windows-cli-touchscreen-trackpad / selene-windows | 受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser → 保留“命令参数 touchscreen-trackpad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-touchscreen-trackpad | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:359 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("touchscreen-trackpad"/)` |
| selene-windows-cli-verbose / selene-windows | 受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser → 保留“命令参数 verbose”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-verbose | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:556 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("verbose"/)` |
| selene-windows-cli-video-codec / selene-windows | 受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser → 保留“命令参数 video-codec”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-video-codec | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:372 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("video-codec"/)` |
| selene-windows-cli-video-decoder / selene-windows | 受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser → 保留“命令参数 video-decoder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-video-decoder | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:373 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("video-decoder"/)` |
| selene-windows-cli-vsync / selene-windows | 受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser → 保留“命令参数 vsync”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-vsync | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:349 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("vsync"/)` |
| selene-windows-cli-yuv444 / selene-windows | 受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser → 保留“命令参数 yuv444”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-02 / 27 / case-selene-windows-cli-yuv444 | `moonlight-qt@de2467e43382:app/cli/commandlineparser.cpp:370 (/parser\.add(?:Flag|Value|Toggle|Choice)Option\("yuv444"/)` |
| selene-windows-configurationwarnings / selene-windows | 用户可配置 configurationWarnings：配置警告；固定声明与实际读取/消费入口分别附锚点 → 保留“配置警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-01 / 27 / case-selene-windows-configurationwarnings | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:138 (/Q_PROPERTY\(\w+\s+configurationWarnings\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:965 (configurationWarnings)` |
| selene-windows-connectionwarnings / selene-windows | 用户可配置 connectionWarnings：连接警告；固定声明与实际读取/消费入口分别附锚点 → 保留“连接警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-windows-connectionwarnings | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:137 (/Q_PROPERTY\(\w+\s+connectionWarnings\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:178 (connectionWarnings)` |
| selene-windows-controller-battery / selene-windows | 控制器电量上报 → 保留“控制器电量上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-windows-controller-battery | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:154 (LiSendControllerBatteryEvent)` |
| selene-windows-controller-count / selene-windows | 原README最多16玩家/控制器声明 → 保留“原README最多16玩家/控制器声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商 / platform-adapter | GAME-01 / 16 / case-selene-windows-controller-count | `moonlight-qt@de2467e43382:README.md:20 (up to 16 players)` |
| selene-windows-controller-motion / selene-windows | 控制器运动上报 → 保留“控制器运动上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-windows-controller-motion | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:443 (LiSendControllerMotionEvent)` |
| selene-windows-controller-touchpad / selene-windows | 控制器触摸板上报 → 保留“控制器触摸板上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-windows-controller-touchpad | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:485 (LiSendControllerTouchEvent)` |
| selene-windows-decoder-fallback / selene-windows | FFmpeg软/硬解路径与失败回退 → 保留“FFmpeg软/硬解路径与失败回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | WIN-02 / 10 / case-selene-windows-decoder-fallback | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:1499 (AV_CODEC_ID_H264)` |
| selene-windows-detectnetworkblocking / selene-windows | 用户可配置 detectNetworkBlocking：网络阻断检测；固定声明与实际读取/消费入口分别附锚点 → 保留“网络阻断检测”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-windows-detectnetworkblocking | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:141 (/Q_PROPERTY\(\w+\s+detectNetworkBlocking\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1786 (detectNetworkBlocking)` |
| selene-windows-discover / selene-windows | 发现/手工主机管理 → 保留“发现/手工主机管理”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-windows-discover | `moonlight-qt@de2467e43382:app/backend/computermanager.cpp:32 (add)` |
| selene-windows-distribution-architectures / selene-windows | 平台原包与ARM32/ARM64/RISC-V入口 → 保留“平台原包与ARM32/ARM64/RISC-V入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审 / platform-adapter | SHIP-01 / 39 / case-selene-windows-distribution-architectures | `moonlight-qt@de2467e43382:README.md:30 (Generic ARM)` |
| selene-windows-enablehdr / selene-windows | 用户可配置 enableHdr：HDR/10-bit；固定声明与实际读取/消费入口分别附锚点 → 保留“HDR/10-bit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-01 / 15 / case-selene-windows-enablehdr | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:145 (/Q_PROPERTY\(\w+\s+enableHdr\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:758 (enableHdr)` |
| selene-windows-enablemdns / selene-windows | 用户可配置 enableMdns：mDNS发现开关；固定声明与实际读取/消费入口分别附锚点 → 保留“mDNS发现开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUTH-01 / 7 / case-selene-windows-enablemdns | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:132 (/Q_PROPERTY\(\w+\s+enableMdns\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1765 (enableMdns)` |
| selene-windows-enablevsync / selene-windows | 用户可配置 enableVsync：垂直同步；固定声明与实际读取/消费入口分别附锚点 → 保留“垂直同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-02 / 10 / case-selene-windows-enablevsync | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:128 (/Q_PROPERTY\(\w+\s+enableVsync\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:281 (enableVsync)` |
| selene-windows-enableyuv444 / selene-windows | 用户可配置 enableYUV444：YUV 4:4:4；固定声明与实际读取/消费入口分别附锚点 → 保留“YUV 4:4:4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | COLOR-02 / 15 / case-selene-windows-enableyuv444 | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:146 (/Q_PROPERTY\(\w+\s+enableYUV444\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:757 (enableYUV444)` |
| selene-windows-fps / selene-windows | 用户可配置 fps：目标帧率/高帧率；固定声明与实际读取/消费入口分别附锚点 → 保留“目标帧率/高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-02 / 10 / case-selene-windows-fps | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:124 (/Q_PROPERTY\(\w+\s+fps\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:526 (fps)` |
| selene-windows-framepacing / selene-windows | 用户可配置 framePacing：帧 pacing；固定声明与实际读取/消费入口分别附锚点 → 保留“帧 pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-02 / 10 / case-selene-windows-framepacing | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:136 (/Q_PROPERTY\(\w+\s+framePacing\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:2216 (framePacing)` |
| selene-windows-gameoptimizations / selene-windows | 用户可配置 gameOptimizations：主机游戏优化；固定声明与实际读取/消费入口分别附锚点 → 保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-06 / 27 / case-selene-windows-gameoptimizations | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:129 (/Q_PROPERTY\(\w+\s+gameOptimizations\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1599 (gameOptimizations)` |
| selene-windows-gamepadmouse / selene-windows | 用户可配置 gamepadMouse：手柄鼠标模拟；固定声明与实际读取/消费入口分别附锚点 → 保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-windows-gamepadmouse | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:140 (/Q_PROPERTY\(\w+\s+gamepadMouse\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:14 (gamepadMouse)` |
| selene-windows-h264 / selene-windows | H.264基础视频与回退 → 保留“H.264基础视频与回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | WIN-02 / 10 / case-selene-windows-h264 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:600 (VIDEO_FORMAT_H264)` |
| selene-windows-hdr-main10 / selene-windows | HDR10-bit/色彩元数据 → 保留“HDR10-bit/色彩元数据”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | COLOR-01 / 15 / case-selene-windows-hdr-main10 | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:608 (VIDEO_FORMAT_H265_MAIN10)` |
| selene-windows-height / selene-windows | 用户可配置 height：视频高度；固定声明与实际读取/消费入口分别附锚点 → 保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-01 / 10 / case-selene-windows-height | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:123 (/Q_PROPERTY\(\w+\s+height\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:280 (height)` |
| selene-windows-hevc / selene-windows | HEVC独立解码分支 → 保留“HEVC独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测 / platform-adapter | CODEC-01 / 14 / case-selene-windows-hevc | `moonlight-qt@de2467e43382:app/streaming/video/ffmpeg.cpp:604 (VIDEO_FORMAT_H265)` |
| selene-windows-keepawake / selene-windows | 用户可配置 keepAwake：串流期间保持唤醒；固定声明与实际读取/消费入口分别附锚点 → 保留“串流期间保持唤醒”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-05 / 36 / case-selene-windows-keepawake | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:157 (/Q_PROPERTY\(\w+\s+keepAwake\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1934 (keepAwake)` |
| selene-windows-keycombopastetext / selene-windows | 通过 KeyComboPasteText 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboPasteText”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CLIP-01 / 25 / case-selene-windows-keycombopastetext | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:119 (m_SpecialKeyCombos[KeyComboPasteText].keyCode)` |
| selene-windows-keycomboquit / selene-windows | 通过 KeyComboQuit 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboQuit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | LEASE-03 / 20 / case-selene-windows-keycomboquit | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:84 (m_SpecialKeyCombos[KeyComboQuit].keyCode)` |
| selene-windows-keycomboquitandexit / selene-windows | 通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboQuitAndExit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INST-03 / 8 / case-selene-windows-keycomboquitandexit | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:129 (m_SpecialKeyCombos[KeyComboQuitAndExit].keyCode)` |
| selene-windows-keycombotogglecursorhide / selene-windows | 通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleCursorHide”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-windows-keycombotogglecursorhide | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:109 (m_SpecialKeyCombos[KeyComboToggleCursorHide].keyCode)` |
| selene-windows-keycombotogglefullscreen / selene-windows | 通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleFullScreen”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-01 / 10 / case-selene-windows-keycombotogglefullscreen | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:94 (m_SpecialKeyCombos[KeyComboToggleFullScreen].keyCode)` |
| selene-windows-keycombotogglekeyboardgrab / selene-windows | 通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleKeyboardGrab”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-windows-keycombotogglekeyboardgrab | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:134 (m_SpecialKeyCombos[KeyComboToggleKeyboardGrab].keyCode)` |
| selene-windows-keycombotoggleminimize / selene-windows | 通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleMinimize”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-01 / 10 / case-selene-windows-keycombotoggleminimize | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:114 (m_SpecialKeyCombos[KeyComboToggleMinimize].keyCode)` |
| selene-windows-keycombotogglemousemode / selene-windows | 通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleMouseMode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-windows-keycombotogglemousemode | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:104 (m_SpecialKeyCombos[KeyComboToggleMouseMode].keyCode)` |
| selene-windows-keycombotogglepointerregionlock / selene-windows | 通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboTogglePointerRegionLock”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-windows-keycombotogglepointerregionlock | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:124 (m_SpecialKeyCombos[KeyComboTogglePointerRegionLock].keyCode)` |
| selene-windows-keycombotogglestatsoverlay / selene-windows | 通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboToggleStatsOverlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-windows-keycombotogglestatsoverlay | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:99 (m_SpecialKeyCombos[KeyComboToggleStatsOverlay].keyCode)` |
| selene-windows-keycomboungrabinput / selene-windows | 通过 KeyComboUngrabInput 快捷键触发对应本地控制行为 → 保留“本地快捷键 KeyComboUngrabInput”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-02 / 11 / case-selene-windows-keycomboungrabinput | `moonlight-qt@de2467e43382:app/streaming/input/input.cpp:89 (m_SpecialKeyCombos[KeyComboUngrabInput].keyCode)` |
| selene-windows-language / selene-windows | 用户可配置 language：界面语言；固定声明与实际读取/消费入口分别附锚点 → 保留“界面语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-01 / 27 / case-selene-windows-language | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:159 (/Q_PROPERTY\(\w+\s+language\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:15 (language)` |
| selene-windows-list-apps / selene-windows | 应用列表/启动/恢复/显式退出 → 保留“应用列表/启动/恢复/显式退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ADMIN-01 / 27 / case-selene-windows-list-apps | `moonlight-qt@de2467e43382:app/backend/nvhttp.cpp:304 (applist)` |
| selene-windows-multicontroller / selene-windows | 用户可配置 multiController：多个控制器独立编号；固定声明与实际读取/消费入口分别附锚点 → 保留“多个控制器独立编号”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | GAME-01 / 16 / case-selene-windows-multicontroller | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:131 (/Q_PROPERTY\(\w+\s+multiController\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1620 (multiController)` |
| selene-windows-multitouch / selene-windows | 原生多点触摸（声明最多10点，设备及主机条件须实测） → 保留“原生多点触摸（声明最多10点，设备及主机条件须实测）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；最多10点为README声明；需多点输入设备与主机native touch支持 / platform-adapter | GAME-02 / 16 / case-selene-windows-multitouch | `moonlight-qt@de2467e43382:app/streaming/input/abstouch.cpp:136 (LiSendTouchEvent)`<br>`moonlight-qt@de2467e43382:README.md:19 (10-point)` |
| selene-windows-muteonfocusloss / selene-windows | 用户可配置 muteOnFocusLoss：失焦静音；固定声明与实际读取/消费入口分别附锚点 → 保留“失焦静音”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-01 / 12 / case-selene-windows-muteonfocusloss | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:153 (/Q_PROPERTY\(\w+\s+muteOnFocusLoss\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:2048 (muteOnFocusLoss)` |
| selene-windows-pair / selene-windows | 配对确认与证书身份 → 保留“配对确认与证书身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUTH-01 / 7 / case-selene-windows-pair | `moonlight-qt@de2467e43382:app/backend/nvpairingmanager.cpp:1 (pair)` |
| selene-windows-pen / selene-windows | 原生笔压力/方向输入 → 保留“原生笔压力/方向输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；触控笔、SDL平台输入及Windows注入provider分别验证 / platform-adapter | GAME-02 / 16 / case-selene-windows-pen | `moonlight-qt@de2467e43382:app/streaming/input/abstouch.cpp:130 (LiSendPenEvent)`<br>`sunshine@7c23c32925d2:src/input.cpp:617 (penButtons)` |
| selene-windows-playaudioonhost / selene-windows | 用户可配置 playAudioOnHost：主机同时播放音频；固定声明与实际读取/消费入口分别附锚点 → 保留“主机同时播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | AUDIO-02 / 12 / case-selene-windows-playaudioonhost | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:130 (/Q_PROPERTY\(\w+\s+playAudioOnHost\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1618 (playAudioOnHost)` |
| selene-windows-precise-horizontal-wheel / selene-windows | 高精度水平滚轮 → 保留“高精度水平滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-01 / 11 / case-selene-windows-precise-horizontal-wheel | `moonlight-qt@de2467e43382:app/streaming/input/mouse.cpp:229 (LiSendHighResHScrollEvent)`<br>`moonlight-common-c@f900dd476775:src/Limelight.h:852 (LiSendHighResHScrollEvent)`<br>`sunshine@7c23c32925d2:src/input.cpp:537 (scrollAmount)` |
| selene-windows-quitappafter / selene-windows | 用户可配置 quitAppAfter：断开后退出应用旧偏好；固定声明与实际读取/消费入口分别附锚点 → 普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INST-03 / 8 / case-selene-windows-quitappafter | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:133 (/Q_PROPERTY\(\w+\s+quitAppAfter\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1276 (quitAppAfter)` |
| selene-windows-rendererselection / selene-windows | 用户可配置 rendererSelection：原生呈现后端选择；固定声明与实际读取/消费入口分别附锚点 → 保留“原生呈现后端选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-02 / 10 / case-selene-windows-rendererselection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:148 (/Q_PROPERTY\(\w+\s+rendererSelection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:521 (rendererSelection)` |
| selene-windows-reversescrolldirection / selene-windows | 用户可配置 reverseScrollDirection：垂直/水平精确滚轮方向；固定声明与实际读取/消费入口分别附锚点 → 保留“垂直/水平精确滚轮方向”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-windows-reversescrolldirection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:155 (/Q_PROPERTY\(\w+\s+reverseScrollDirection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:16 (reverseScrollDirection)` |
| selene-windows-rgb-led / selene-windows | 控制器RGB LED反馈 → 保留“控制器RGB LED反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-windows-rgb-led | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:950 (setControllerLED)` |
| selene-windows-richpresence / selene-windows | 用户可配置 richPresence：Discord游戏活动展示；固定声明与实际读取/消费入口分别附锚点 → 保留“Discord游戏活动展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-05 / 36 / case-selene-windows-richpresence | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:139 (/Q_PROPERTY\(\w+\s+richPresence\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1282 (richPresence)` |
| selene-windows-rumble-feedback / selene-windows | 低/高频控制器震动反馈 → 保留“低/高频控制器震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | GAME-01 / 16 / case-selene-windows-rumble-feedback | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:843 (void SdlInputHandler::rumble)` |
| selene-windows-showperformanceoverlay / selene-windows | 用户可配置 showPerformanceOverlay：串流统计叠层；固定声明与实际读取/消费入口分别附锚点 → 保留“串流统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | OPS-02 / 36 / case-selene-windows-showperformanceoverlay | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:142 (/Q_PROPERTY\(\w+\s+showPerformanceOverlay\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:1958 (showPerformanceOverlay)` |
| selene-windows-surround / selene-windows | 多声道音频解码/输出 → 保留“多声道音频解码/输出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | AUDIO-01 / 12 / case-selene-windows-surround | `moonlight-qt@de2467e43382:app/streaming/audio/audio.cpp:60 (Opus)` |
| selene-windows-swapfacebuttons / selene-windows | 用户可配置 swapFaceButtons：AB/XY交换；固定声明与实际读取/消费入口分别附锚点 → 保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | ORIG-04 / 16 / case-selene-windows-swapfacebuttons | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:156 (/Q_PROPERTY\(\w+\s+swapFaceButtons\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:17 (swapFaceButtons)` |
| selene-windows-swapmousebuttons / selene-windows | 用户可配置 swapMouseButtons：交换鼠标左右键；固定声明与实际读取/消费入口分别附锚点 → 保留“交换鼠标左右键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | INPUT-01 / 11 / case-selene-windows-swapmousebuttons | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:152 (/Q_PROPERTY\(\w+\s+swapMouseButtons\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/input/input.cpp:15 (swapMouseButtons)` |
| selene-windows-trigger-rumble / selene-windows | 左右扳机震动反馈 → 保留“左右扳机震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | ORIG-04 / 16 / case-selene-windows-trigger-rumble | `moonlight-qt@de2467e43382:app/streaming/input/gamepad.cpp:602 (SDL_GameControllerRumbleTriggers)` |
| selene-windows-uidisplaymode / selene-windows | 用户可配置 uiDisplayMode：界面列表呈现偏好；固定声明与实际读取/消费入口分别附锚点 → 保留“界面列表呈现偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / flutter-ui | ORIG-01 / 27 / case-selene-windows-uidisplaymode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:151 (/Q_PROPERTY\(\w+\s+uiDisplayMode\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:1202 (uiDisplayMode)` |
| selene-windows-unlockbitrate / selene-windows | 用户可配置 unlockBitrate：解锁高码率选择；固定声明与实际读取/消费入口分别附锚点 → 保留“解锁高码率选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | RATE-01 / 23 / case-selene-windows-unlockbitrate | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:126 (/Q_PROPERTY\(\w+\s+unlockBitrate\b/)`<br>`moonlight-qt@de2467e43382:app/gui/SettingsView.qml:696 (unlockBitrate)` |
| selene-windows-utf8-text / selene-windows | UTF-8文本输入 → 保留“UTF-8文本输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | INPUT-02 / 11 / case-selene-windows-utf8-text | `moonlight-qt@de2467e43382:app/streaming/input/keyboard.cpp:126 (LiSendUtf8TextEvent)` |
| selene-windows-videocodecconfig / selene-windows | 用户可配置 videoCodecConfig：H.264/HEVC/AV1选择；固定声明与实际读取/消费入口分别附锚点 → 保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | CODEC-02 / 14 / case-selene-windows-videocodecconfig | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:144 (/Q_PROPERTY\(\w+\s+videoCodecConfig\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:745 (videoCodecConfig)` |
| selene-windows-videodecoderselection / selene-windows | 用户可配置 videoDecoderSelection：软解/硬解选择；固定声明与实际读取/消费入口分别附锚点 → 保留“软解/硬解选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-02 / 10 / case-selene-windows-videodecoderselection | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:147 (/Q_PROPERTY\(\w+\s+videoDecoderSelection\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:520 (videoDecoderSelection)` |
| selene-windows-wake / selene-windows | Wake-on-LAN → 保留“Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / platform-adapter | OPS-01 / 36 / case-selene-windows-wake | `moonlight-qt@de2467e43382:app/backend/nvcomputer.cpp:216 (wake)` |
| selene-windows-width / selene-windows | 用户可配置 width：视频宽度；固定声明与实际读取/消费入口分别附锚点 → 保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-01 / 10 / case-selene-windows-width | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:122 (/Q_PROPERTY\(\w+\s+width\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:280 (width)` |
| selene-windows-windowmode / selene-windows | 用户可配置 windowMode：窗口/全屏/无边框；固定声明与实际读取/消费入口分别附锚点 → 保留“窗口/全屏/无边框”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例 | Windows 客户端；最低条件待审；源码构建目标不自动等于 Aether 支持；ARM32/RISC-V 等差异见开放冲突；依赖实际 OS/API、设备和原生后端能力；尚未产品实测 / shared-native | WIN-01 / 10 / case-selene-windows-windowmode | `moonlight-qt@de2467e43382:app/settings/streamingpreferences.h:149 (/Q_PROPERTY\(\w+\s+windowMode\b/)`<br>`moonlight-qt@de2467e43382:app/streaming/session.cpp:569 (windowMode)` |

## 设置与非设置入口覆盖

### helios-windows10-apollo-readme-md-management

apollo / helios-windows10 / management / `README.md`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| connection-hooks | mapped / helios-windows10-connection-hooks | 独立非设置行为/平台消费入口 |
| persistent-display-id | mapped / helios-windows10-persistent-display-id | 独立非设置行为/平台消费入口 |
| clipboard | mapped / helios-windows10-clipboard | 独立非设置行为/平台消费入口 |

### helios-windows10-apollo-src-crypto-h-management

apollo / helios-windows10 / management / `src/crypto.h`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| granular-permission | mapped / helios-windows10-granular-permission | 独立非设置行为/平台消费入口 |

### helios-windows10-apollo-src-nvhttp-cpp-input

apollo / helios-windows10 / input / `src/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| input-only | mapped / helios-windows10-input-only | 独立非设置行为/平台消费入口 |

### helios-windows10-apollo-src-nvhttp-cpp-management

apollo / helios-windows10 / management / `src/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| read-stream | mapped / helios-windows10-read-stream | 独立非设置行为/平台消费入口 |

### helios-windows10-apollo-src-process-cpp-management

apollo / helios-windows10 / management / `src/process.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| old-auto-terminate | mapped / helios-windows10-old-auto-terminate | 独立非设置行为/平台消费入口 |

### helios-windows10-apollo-src-stream-cpp-management

apollo / helios-windows10 / management / `src/stream.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| clipboard-permission | mapped / helios-windows10-clipboard-permission | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-assets-common-assets-web-configs-config-tabs-json-setting

sunshine / helios-windows10 / setting / `src_assets/common/assets/web/configs/config_tabs.json`；reviewed=true；inventory=97。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| locale | mapped / helios-windows10-locale | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| sunshine_name | mapped / helios-windows10-sunshine-name | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| min_log_level | mapped / helios-windows10-min-log-level | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| global_prep_cmd | mapped / helios-windows10-global-prep-cmd | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| notify_pre_releases | mapped / helios-windows10-notify-pre-releases | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| system_tray | mapped / helios-windows10-system-tray | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| controller | mapped / helios-windows10-controller | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| gamepad_driver | mapped / helios-windows10-gamepad-driver | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| gamepad | mapped / helios-windows10-gamepad | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| ds4_back_as_touchpad_click | mapped / helios-windows10-ds4-back-as-touchpad-click | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| motion_as_ds4 | mapped / helios-windows10-motion-as-ds4 | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| touchpad_as_ds4 | mapped / helios-windows10-touchpad-as-ds4 | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| virtualhid_randomize_mac | mapped / helios-windows10-virtualhid-randomize-mac | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| back_button_timeout | mapped / helios-windows10-back-button-timeout | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| keyboard | mapped / helios-windows10-keyboard | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| key_repeat_delay | mapped / helios-windows10-key-repeat-delay | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| key_repeat_frequency | mapped / helios-windows10-key-repeat-frequency | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| always_send_scancodes | mapped / helios-windows10-always-send-scancodes | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| key_rightalt_to_key_win | mapped / helios-windows10-key-rightalt-to-key-win | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| mouse | mapped / helios-windows10-mouse | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| high_resolution_scrolling | mapped / helios-windows10-high-resolution-scrolling | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| native_pen_touch | mapped / helios-windows10-native-pen-touch | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| keybindings | mapped / helios-windows10-keybindings | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| audio_sink | mapped / helios-windows10-audio-sink | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| virtual_sink | mapped / helios-windows10-virtual-sink | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| stream_audio | mapped / helios-windows10-stream-audio | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| install_steam_audio_drivers | mapped / helios-windows10-install-steam-audio-drivers | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| adapter_name | mapped / helios-windows10-adapter-name | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| output_name | mapped / helios-windows10-output-name | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_configuration_option | mapped / helios-windows10-dd-configuration-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_resolution_option | mapped / helios-windows10-dd-resolution-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_manual_resolution | mapped / helios-windows10-dd-manual-resolution | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_refresh_rate_option | mapped / helios-windows10-dd-refresh-rate-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_manual_refresh_rate | mapped / helios-windows10-dd-manual-refresh-rate | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_hdr_option | mapped / helios-windows10-dd-hdr-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_wa_hdr_toggle_delay | mapped / helios-windows10-dd-wa-hdr-toggle-delay | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_config_revert_delay | mapped / helios-windows10-dd-config-revert-delay | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_config_revert_on_disconnect | mapped / helios-windows10-dd-config-revert-on-disconnect | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_mode_remapping | mapped / helios-windows10-dd-mode-remapping | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| max_bitrate | mapped / helios-windows10-max-bitrate | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| minimum_fps_target | mapped / helios-windows10-minimum-fps-target | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| upnp | mapped / helios-windows10-upnp | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| address_family | mapped / helios-windows10-address-family | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| bind_address | mapped / helios-windows10-bind-address | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| port | mapped / helios-windows10-port | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| origin_web_ui_allowed | mapped / helios-windows10-origin-web-ui-allowed | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| csrf_allowed_origins | mapped / helios-windows10-csrf-allowed-origins | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| external_ip | mapped / helios-windows10-external-ip | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| lan_encryption_mode | mapped / helios-windows10-lan-encryption-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| wan_encryption_mode | mapped / helios-windows10-wan-encryption-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| ping_timeout | mapped / helios-windows10-ping-timeout | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| packetsize | mapped / helios-windows10-packetsize | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| file_apps | mapped / helios-windows10-file-apps | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| credentials_file | mapped / helios-windows10-credentials-file | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| log_path | mapped / helios-windows10-log-path | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| pkey | mapped / helios-windows10-pkey | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| cert | mapped / helios-windows10-cert | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| file_state | mapped / helios-windows10-file-state | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| fec_percentage | mapped / helios-windows10-fec-percentage | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qp | mapped / helios-windows10-qp | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| min_threads | mapped / helios-windows10-min-threads | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| hevc_mode | mapped / helios-windows10-hevc-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| av1_mode | mapped / helios-windows10-av1-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| capture | mapped / helios-windows10-capture | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| encoder | mapped / helios-windows10-encoder | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_preset | mapped / helios-windows10-nvenc-preset | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_twopass | mapped / helios-windows10-nvenc-twopass | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_spatial_aq | mapped / helios-windows10-nvenc-spatial-aq | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_vbv_increase | mapped / helios-windows10-nvenc-vbv-increase | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_realtime_hags | mapped / helios-windows10-nvenc-realtime-hags | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_split_encode | mapped / helios-windows10-nvenc-split-encode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_latency_over_power | mapped / helios-windows10-nvenc-latency-over-power | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_opengl_vulkan_on_dxgi | mapped / helios-windows10-nvenc-opengl-vulkan-on-dxgi | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_h264_cavlc | mapped / helios-windows10-nvenc-h264-cavlc | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qsv_preset | mapped / helios-windows10-qsv-preset | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qsv_coder | mapped / helios-windows10-qsv-coder | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qsv_slow_hevc | mapped / helios-windows10-qsv-slow-hevc | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_usage | mapped / helios-windows10-amd-usage | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_rc | mapped / helios-windows10-amd-rc | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_enforce_hrd | mapped / helios-windows10-amd-enforce-hrd | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_max_au_size | mapped / helios-windows10-amd-max-au-size | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_quality | mapped / helios-windows10-amd-quality | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_preanalysis | mapped / helios-windows10-amd-preanalysis | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_vbaq | mapped / helios-windows10-amd-vbaq | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_coder | mapped / helios-windows10-amd-coder | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| vt_coder | outside-target /  | vt 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vt_software | outside-target /  | vt 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vt_realtime | outside-target /  | vt 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_blbrc | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_quality | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_rc | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_strict_rc_buffer | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vk_tune | outside-target /  | vulkan 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vk_rc_mode | outside-target /  | vulkan 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vk_quality | outside-target /  | vulkan 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| sw_preset | mapped / helios-windows10-sw-preset | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| sw_tune | mapped / helios-windows10-sw-tune | Windows主机配置→实际解析；provider/API条件不冒称已支持 |

### helios-windows10-sunshine-src-assets-windows-misc-service-install-service-bat-packaging

sunshine / helios-windows10 / packaging / `src_assets/windows/misc/service/install-service.bat`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| service | mapped / helios-windows10-service | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-audio-cpp-media

sunshine / helios-windows10 / media / `src/audio.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| audio | mapped / helios-windows10-audio | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-confighttp-cpp-management

sunshine / helios-windows10 / management / `src/confighttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| manage | mapped / helios-windows10-manage | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-input-cpp-input

sunshine / helios-windows10 / input / `src/input.cpp`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-motion | mapped / helios-windows10-controller-motion | 独立非设置行为/平台消费入口 |
| host-motion-consume | mapped / helios-windows10-host-motion-consume | 独立非设置行为/平台消费入口 |
| host-battery-consume | mapped / helios-windows10-host-battery-consume | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-nvhttp-cpp-network

sunshine / helios-windows10 / network / `src/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / helios-windows10-pair | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-platform-virtualhid-input-cpp-input

sunshine / helios-windows10 / input / `src/platform/virtualhid_input.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| windows-injection | mapped / helios-windows10-windows-injection | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-platform-windows-display-vram-cpp-media

sunshine / helios-windows10 / media / `src/platform/windows/display_vram.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| capture-frame | mapped / helios-windows10-capture-frame | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-platform-windows-display-wgc-cpp-media

sunshine / helios-windows10 / media / `src/platform/windows/display_wgc.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wgc | mapped / helios-windows10-wgc | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-process-cpp-management

sunshine / helios-windows10 / management / `src/process.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| apps | mapped / helios-windows10-apps | 独立非设置行为/平台消费入口 |

### helios-windows10-sunshine-src-video-cpp-media

sunshine / helios-windows10 / media / `src/video.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| encode | mapped / helios-windows10-encode | 独立非设置行为/平台消费入口 |

### helios-windows11-apollo-readme-md-management

apollo / helios-windows11 / management / `README.md`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| connection-hooks | mapped / helios-windows11-connection-hooks | 独立非设置行为/平台消费入口 |
| persistent-display-id | mapped / helios-windows11-persistent-display-id | 独立非设置行为/平台消费入口 |
| clipboard | mapped / helios-windows11-clipboard | 独立非设置行为/平台消费入口 |

### helios-windows11-apollo-src-crypto-h-management

apollo / helios-windows11 / management / `src/crypto.h`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| granular-permission | mapped / helios-windows11-granular-permission | 独立非设置行为/平台消费入口 |

### helios-windows11-apollo-src-nvhttp-cpp-input

apollo / helios-windows11 / input / `src/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| input-only | mapped / helios-windows11-input-only | 独立非设置行为/平台消费入口 |

### helios-windows11-apollo-src-nvhttp-cpp-management

apollo / helios-windows11 / management / `src/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| read-stream | mapped / helios-windows11-read-stream | 独立非设置行为/平台消费入口 |

### helios-windows11-apollo-src-process-cpp-management

apollo / helios-windows11 / management / `src/process.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| old-auto-terminate | mapped / helios-windows11-old-auto-terminate | 独立非设置行为/平台消费入口 |

### helios-windows11-apollo-src-stream-cpp-management

apollo / helios-windows11 / management / `src/stream.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| clipboard-permission | mapped / helios-windows11-clipboard-permission | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-assets-common-assets-web-configs-config-tabs-json-setting

sunshine / helios-windows11 / setting / `src_assets/common/assets/web/configs/config_tabs.json`；reviewed=true；inventory=97。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| locale | mapped / helios-windows11-locale | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| sunshine_name | mapped / helios-windows11-sunshine-name | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| min_log_level | mapped / helios-windows11-min-log-level | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| global_prep_cmd | mapped / helios-windows11-global-prep-cmd | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| notify_pre_releases | mapped / helios-windows11-notify-pre-releases | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| system_tray | mapped / helios-windows11-system-tray | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| controller | mapped / helios-windows11-controller | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| gamepad_driver | mapped / helios-windows11-gamepad-driver | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| gamepad | mapped / helios-windows11-gamepad | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| ds4_back_as_touchpad_click | mapped / helios-windows11-ds4-back-as-touchpad-click | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| motion_as_ds4 | mapped / helios-windows11-motion-as-ds4 | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| touchpad_as_ds4 | mapped / helios-windows11-touchpad-as-ds4 | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| virtualhid_randomize_mac | mapped / helios-windows11-virtualhid-randomize-mac | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| back_button_timeout | mapped / helios-windows11-back-button-timeout | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| keyboard | mapped / helios-windows11-keyboard | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| key_repeat_delay | mapped / helios-windows11-key-repeat-delay | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| key_repeat_frequency | mapped / helios-windows11-key-repeat-frequency | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| always_send_scancodes | mapped / helios-windows11-always-send-scancodes | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| key_rightalt_to_key_win | mapped / helios-windows11-key-rightalt-to-key-win | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| mouse | mapped / helios-windows11-mouse | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| high_resolution_scrolling | mapped / helios-windows11-high-resolution-scrolling | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| native_pen_touch | mapped / helios-windows11-native-pen-touch | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| keybindings | mapped / helios-windows11-keybindings | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| audio_sink | mapped / helios-windows11-audio-sink | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| virtual_sink | mapped / helios-windows11-virtual-sink | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| stream_audio | mapped / helios-windows11-stream-audio | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| install_steam_audio_drivers | mapped / helios-windows11-install-steam-audio-drivers | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| adapter_name | mapped / helios-windows11-adapter-name | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| output_name | mapped / helios-windows11-output-name | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_configuration_option | mapped / helios-windows11-dd-configuration-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_resolution_option | mapped / helios-windows11-dd-resolution-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_manual_resolution | mapped / helios-windows11-dd-manual-resolution | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_refresh_rate_option | mapped / helios-windows11-dd-refresh-rate-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_manual_refresh_rate | mapped / helios-windows11-dd-manual-refresh-rate | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_hdr_option | mapped / helios-windows11-dd-hdr-option | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_wa_hdr_toggle_delay | mapped / helios-windows11-dd-wa-hdr-toggle-delay | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_config_revert_delay | mapped / helios-windows11-dd-config-revert-delay | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_config_revert_on_disconnect | mapped / helios-windows11-dd-config-revert-on-disconnect | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| dd_mode_remapping | mapped / helios-windows11-dd-mode-remapping | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| max_bitrate | mapped / helios-windows11-max-bitrate | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| minimum_fps_target | mapped / helios-windows11-minimum-fps-target | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| upnp | mapped / helios-windows11-upnp | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| address_family | mapped / helios-windows11-address-family | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| bind_address | mapped / helios-windows11-bind-address | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| port | mapped / helios-windows11-port | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| origin_web_ui_allowed | mapped / helios-windows11-origin-web-ui-allowed | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| csrf_allowed_origins | mapped / helios-windows11-csrf-allowed-origins | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| external_ip | mapped / helios-windows11-external-ip | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| lan_encryption_mode | mapped / helios-windows11-lan-encryption-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| wan_encryption_mode | mapped / helios-windows11-wan-encryption-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| ping_timeout | mapped / helios-windows11-ping-timeout | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| packetsize | mapped / helios-windows11-packetsize | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| file_apps | mapped / helios-windows11-file-apps | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| credentials_file | mapped / helios-windows11-credentials-file | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| log_path | mapped / helios-windows11-log-path | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| pkey | mapped / helios-windows11-pkey | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| cert | mapped / helios-windows11-cert | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| file_state | mapped / helios-windows11-file-state | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| fec_percentage | mapped / helios-windows11-fec-percentage | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qp | mapped / helios-windows11-qp | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| min_threads | mapped / helios-windows11-min-threads | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| hevc_mode | mapped / helios-windows11-hevc-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| av1_mode | mapped / helios-windows11-av1-mode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| capture | mapped / helios-windows11-capture | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| encoder | mapped / helios-windows11-encoder | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_preset | mapped / helios-windows11-nvenc-preset | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_twopass | mapped / helios-windows11-nvenc-twopass | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_spatial_aq | mapped / helios-windows11-nvenc-spatial-aq | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_vbv_increase | mapped / helios-windows11-nvenc-vbv-increase | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_realtime_hags | mapped / helios-windows11-nvenc-realtime-hags | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_split_encode | mapped / helios-windows11-nvenc-split-encode | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_latency_over_power | mapped / helios-windows11-nvenc-latency-over-power | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_opengl_vulkan_on_dxgi | mapped / helios-windows11-nvenc-opengl-vulkan-on-dxgi | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| nvenc_h264_cavlc | mapped / helios-windows11-nvenc-h264-cavlc | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qsv_preset | mapped / helios-windows11-qsv-preset | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qsv_coder | mapped / helios-windows11-qsv-coder | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| qsv_slow_hevc | mapped / helios-windows11-qsv-slow-hevc | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_usage | mapped / helios-windows11-amd-usage | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_rc | mapped / helios-windows11-amd-rc | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_enforce_hrd | mapped / helios-windows11-amd-enforce-hrd | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_max_au_size | mapped / helios-windows11-amd-max-au-size | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_quality | mapped / helios-windows11-amd-quality | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_preanalysis | mapped / helios-windows11-amd-preanalysis | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_vbaq | mapped / helios-windows11-amd-vbaq | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| amd_coder | mapped / helios-windows11-amd-coder | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| vt_coder | outside-target /  | vt 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vt_software | outside-target /  | vt 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vt_realtime | outside-target /  | vt 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_blbrc | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_quality | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_rc | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vaapi_strict_rc_buffer | outside-target /  | vaapi 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vk_tune | outside-target /  | vulkan 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vk_rc_mode | outside-target /  | vulkan 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| vk_quality | outside-target /  | vulkan 原后端属于非Windows主机路径；Linux/macOS服务端已获用户批准TODO；不转为Windows支持 |
| sw_preset | mapped / helios-windows11-sw-preset | Windows主机配置→实际解析；provider/API条件不冒称已支持 |
| sw_tune | mapped / helios-windows11-sw-tune | Windows主机配置→实际解析；provider/API条件不冒称已支持 |

### helios-windows11-sunshine-src-assets-windows-misc-service-install-service-bat-packaging

sunshine / helios-windows11 / packaging / `src_assets/windows/misc/service/install-service.bat`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| service | mapped / helios-windows11-service | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-audio-cpp-media

sunshine / helios-windows11 / media / `src/audio.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| audio | mapped / helios-windows11-audio | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-confighttp-cpp-management

sunshine / helios-windows11 / management / `src/confighttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| manage | mapped / helios-windows11-manage | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-input-cpp-input

sunshine / helios-windows11 / input / `src/input.cpp`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-motion | mapped / helios-windows11-controller-motion | 独立非设置行为/平台消费入口 |
| host-motion-consume | mapped / helios-windows11-host-motion-consume | 独立非设置行为/平台消费入口 |
| host-battery-consume | mapped / helios-windows11-host-battery-consume | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-nvhttp-cpp-network

sunshine / helios-windows11 / network / `src/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / helios-windows11-pair | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-platform-virtualhid-input-cpp-input

sunshine / helios-windows11 / input / `src/platform/virtualhid_input.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| windows-injection | mapped / helios-windows11-windows-injection | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-platform-windows-display-vram-cpp-media

sunshine / helios-windows11 / media / `src/platform/windows/display_vram.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| capture-frame | mapped / helios-windows11-capture-frame | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-platform-windows-display-wgc-cpp-media

sunshine / helios-windows11 / media / `src/platform/windows/display_wgc.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wgc | mapped / helios-windows11-wgc | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-process-cpp-management

sunshine / helios-windows11 / management / `src/process.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| apps | mapped / helios-windows11-apps | 独立非设置行为/平台消费入口 |

### helios-windows11-sunshine-src-video-cpp-media

sunshine / helios-windows11 / media / `src/video.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| encode | mapped / helios-windows11-encode | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-build-gradle-packaging

moonlight-android / selene-android / packaging / `app/build.gradle`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| apk-abis | mapped / selene-android-apk-abis | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-androidmanifest-xml-permission

moonlight-android / selene-android / permission / `app/src/main/AndroidManifest.xml`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| permissions | mapped / selene-android-permissions | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-appview-java-management

moonlight-android / selene-android / management / `app/src/main/java/com/limelight/AppView.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| apps | mapped / selene-android-apps | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-binding-audio-androidaudiorenderer-java-media

moonlight-android / selene-android / media / `app/src/main/java/com/limelight/binding/audio/AndroidAudioRenderer.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| audio-route | mapped / selene-android-audio-route | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-binding-input-controllerhandler-java-input

moonlight-android / selene-android / input / `app/src/main/java/com/limelight/binding/input/ControllerHandler.java`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| battery | mapped / selene-android-battery | 独立非设置行为/平台消费入口 |
| motion | mapped / selene-android-motion | 独立非设置行为/平台消费入口 |
| rumble | mapped / selene-android-rumble | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-binding-input-virtual-controller-virtualcontroller-java-input

moonlight-android / selene-android / input / `app/src/main/java/com/limelight/binding/input/virtual_controller/VirtualController.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| osc-layout | mapped / selene-android-osc-layout | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-binding-video-mediacodecdecoderrenderer-java-media

moonlight-android / selene-android / media / `app/src/main/java/com/limelight/binding/video/MediaCodecDecoderRenderer.java`；reviewed=true；inventory=4。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| mediacodec | mapped / selene-android-mediacodec | 独立非设置行为/平台消费入口 |
| h264 | mapped / selene-android-h264 | 独立非设置行为/平台消费入口 |
| hevc | mapped / selene-android-hevc | 独立非设置行为/平台消费入口 |
| av1 | mapped / selene-android-av1 | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-game-java-input

moonlight-android / selene-android / input / `app/src/main/java/com/limelight/Game.java`；reviewed=true；inventory=2。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| mouse-wheel | mapped / selene-android-mouse-wheel | 独立非设置行为/平台消费入口 |
| pen | mapped / selene-android-pen | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-nvstream-http-pairingmanager-java-network

moonlight-android / selene-android / network / `app/src/main/java/com/limelight/nvstream/http/PairingManager.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / selene-android-pair | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-nvstream-wol-wakeonlansender-java-network

moonlight-android / selene-android / network / `app/src/main/java/com/limelight/nvstream/wol/WakeOnLanSender.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wake | mapped / selene-android-wake | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-pcview-java-management

moonlight-android / selene-android / management / `app/src/main/java/com/limelight/PcView.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| manual-host | mapped / selene-android-manual-host | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-preferences-confirmdeleteoscpreference-java-management

moonlight-android / selene-android / management / `app/src/main/java/com/limelight/preferences/ConfirmDeleteOscPreference.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| osc-reset | mapped / selene-android-osc-reset | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-java-com-limelight-shortcuttrampoline-java-management

moonlight-android / selene-android / management / `app/src/main/java/com/limelight/ShortcutTrampoline.java`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| shortcut | mapped / selene-android-shortcut | 独立非设置行为/平台消费入口 |

### selene-android-moonlight-android-app-src-main-res-xml-preferences-xml-setting

moonlight-android / selene-android / setting / `app/src/main/res/xml/preferences.xml`；reviewed=true；inventory=47。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| category_basic_settings | implementation-detail /  | 分类标题/布局组织，不是用户能力 |
| list_resolution | mapped / selene-android-list-resolution | Android独立设置与实际偏好读取，未用Qt替代 |
| list_fps | mapped / selene-android-list-fps | Android独立设置与实际偏好读取，未用Qt替代 |
| seekbar_bitrate_kbps | mapped / selene-android-seekbar-bitrate-kbps | Android独立设置与实际偏好读取，未用Qt替代 |
| frame_pacing | mapped / selene-android-frame-pacing | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_stretch_video | mapped / selene-android-checkbox-stretch-video | Android独立设置与实际偏好读取，未用Qt替代 |
| list_audio_config | mapped / selene-android-list-audio-config | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_enable_audiofx | mapped / selene-android-checkbox-enable-audiofx | Android独立设置与实际偏好读取，未用Qt替代 |
| category_gamepad_settings | implementation-detail /  | 分类标题/布局组织，不是用户能力 |
| seekbar_deadzone | mapped / selene-android-seekbar-deadzone | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_multi_controller | mapped / selene-android-checkbox-multi-controller | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_usb_driver | mapped / selene-android-checkbox-usb-driver | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_usb_bind_all | mapped / selene-android-checkbox-usb-bind-all | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_mouse_emulation | mapped / selene-android-checkbox-mouse-emulation | Android独立设置与实际偏好读取，未用Qt替代 |
| analog_scrolling | mapped / selene-android-analog-scrolling | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_vibrate_fallback | mapped / selene-android-checkbox-vibrate-fallback | Android独立设置与实际偏好读取，未用Qt替代 |
| seekbar_vibrate_fallback_strength | mapped / selene-android-seekbar-vibrate-fallback-strength | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_flip_face_buttons | mapped / selene-android-checkbox-flip-face-buttons | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_gamepad_touchpad_as_mouse | mapped / selene-android-checkbox-gamepad-touchpad-as-mouse | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_gamepad_motion_sensors | mapped / selene-android-checkbox-gamepad-motion-sensors | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_gamepad_motion_fallback | mapped / selene-android-checkbox-gamepad-motion-fallback | Android独立设置与实际偏好读取，未用Qt替代 |
| category_input_settings | implementation-detail /  | 分类标题/布局组织，不是用户能力 |
| checkbox_touchscreen_trackpad | mapped / selene-android-checkbox-touchscreen-trackpad | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_mouse_nav_buttons | mapped / selene-android-checkbox-mouse-nav-buttons | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_absolute_mouse_mode | mapped / selene-android-checkbox-absolute-mouse-mode | Android独立设置与实际偏好读取，未用Qt替代 |
| category_onscreen_controls | implementation-detail /  | 分类标题/布局组织，不是用户能力 |
| checkbox_show_onscreen_controls | mapped / selene-android-checkbox-show-onscreen-controls | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_vibrate_osc | mapped / selene-android-checkbox-vibrate-osc | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_only_show_L3R3 | mapped / selene-android-checkbox-only-show-l3r3 | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_show_guide_button | mapped / selene-android-checkbox-show-guide-button | Android独立设置与实际偏好读取，未用Qt替代 |
| seekbar_osc_opacity | mapped / selene-android-seekbar-osc-opacity | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_enable_sops | mapped / selene-android-checkbox-enable-sops | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_host_audio | mapped / selene-android-checkbox-host-audio | Android独立设置与实际偏好读取，未用Qt替代 |
| category_ui_settings | implementation-detail /  | 分类标题/布局组织，不是用户能力 |
| checkbox_enable_pip | mapped / selene-android-checkbox-enable-pip | Android独立设置与实际偏好读取，未用Qt替代 |
| list_languages | mapped / selene-android-list-languages | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_small_icon_mode | mapped / selene-android-checkbox-small-icon-mode | Android独立设置与实际偏好读取，未用Qt替代 |
| category_advanced_settings | implementation-detail /  | 分类标题/布局组织，不是用户能力 |
| checkbox_unlock_fps | mapped / selene-android-checkbox-unlock-fps | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_reduce_refresh_rate | mapped / selene-android-checkbox-reduce-refresh-rate | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_disable_warnings | mapped / selene-android-checkbox-disable-warnings | Android独立设置与实际偏好读取，未用Qt替代 |
| video_format | mapped / selene-android-video-format | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_enable_hdr | mapped / selene-android-checkbox-enable-hdr | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_full_range | mapped / selene-android-checkbox-full-range | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_enable_perf_overlay | mapped / selene-android-checkbox-enable-perf-overlay | Android独立设置与实际偏好读取，未用Qt替代 |
| checkbox_enable_post_stream_toast | mapped / selene-android-checkbox-enable-post-stream-toast | Android独立设置与实际偏好读取，未用Qt替代 |
| category_help | implementation-detail /  | 注释中的旧帮助分类，没有活动设置入口 |

### selene-ios-ipados-moonlight-ios-limelight-database-temporarysettings-h-setting

moonlight-ios / selene-ios-ipados / setting / `Limelight/Database/TemporarySettings.h`；reviewed=true；inventory=18。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| parent | implementation-detail /  | CoreData关系或身份元数据，不是独立用户设置；配对身份在网络入口另列 |
| bitrate | mapped / selene-ios-ipados-bitrate | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| framerate | mapped / selene-ios-ipados-framerate | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| height | mapped / selene-ios-ipados-height | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| width | mapped / selene-ios-ipados-width | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| audioConfig | mapped / selene-ios-ipados-audioconfig | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| onscreenControls | mapped / selene-ios-ipados-onscreencontrols | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| uniqueId | implementation-detail /  | CoreData关系或身份元数据，不是独立用户设置；配对身份在网络入口另列 |
| preferredCodec | mapped / selene-ios-ipados-preferredcodec | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| useFramePacing | mapped / selene-ios-ipados-useframepacing | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| multiController | mapped / selene-ios-ipados-multicontroller | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| swapABXYButtons | mapped / selene-ios-ipados-swapabxybuttons | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| playAudioOnPC | mapped / selene-ios-ipados-playaudioonpc | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| optimizeGames | mapped / selene-ios-ipados-optimizegames | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| enableHdr | mapped / selene-ios-ipados-enablehdr | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| btMouseSupport | mapped / selene-ios-ipados-btmousesupport | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| absoluteTouchMode | mapped / selene-ios-ipados-absolutetouchmode | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |
| statsOverlay | mapped / selene-ios-ipados-statsoverlay | iOS设置→独立实际读取/配置；实机VFY-01不替代构建 |

### selene-ios-ipados-moonlight-ios-limelight-input-absolutetouchhandler-m-input

moonlight-ios / selene-ios-ipados / input / `Limelight/Input/AbsoluteTouchHandler.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| absolute-touch | mapped / selene-ios-ipados-absolute-touch | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-input-controllersupport-m-input

moonlight-ios / selene-ios-ipados / input / `Limelight/Input/ControllerSupport.m`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| battery | mapped / selene-ios-ipados-battery | 独立非设置行为/平台消费入口 |
| motion | mapped / selene-ios-ipados-motion | 独立非设置行为/平台消费入口 |
| feedback | mapped / selene-ios-ipados-feedback | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-input-onscreencontrols-m-input

moonlight-ios / selene-ios-ipados / input / `Limelight/Input/OnScreenControls.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| screen-controller | mapped / selene-ios-ipados-screen-controller | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-input-relativetouchhandler-m-input

moonlight-ios / selene-ios-ipados / input / `Limelight/Input/RelativeTouchHandler.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| relative-touch | mapped / selene-ios-ipados-relative-touch | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-input-streamview-m-input

moonlight-ios / selene-ios-ipados / input / `Limelight/Input/StreamView.m`；reviewed=true；inventory=3。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pen | mapped / selene-ios-ipados-pen | 独立非设置行为/平台消费入口 |
| high-res-wheel | mapped / selene-ios-ipados-high-res-wheel | 独立非设置行为/平台消费入口 |
| mouse-capture | mapped / selene-ios-ipados-mouse-capture | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-limelight-info-plist-permission

moonlight-ios / selene-ios-ipados / permission / `Limelight/Limelight-Info.plist`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| permissions | mapped / selene-ios-ipados-permissions | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-network-appassetmanager-m-management

moonlight-ios / selene-ios-ipados / management / `Limelight/Network/AppAssetManager.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| box-art | mapped / selene-ios-ipados-box-art | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-network-discoverymanager-m-network

moonlight-ios / selene-ios-ipados / network / `Limelight/Network/DiscoveryManager.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| discover | mapped / selene-ios-ipados-discover | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-network-httpmanager-m-management

moonlight-ios / selene-ios-ipados / management / `Limelight/Network/HttpManager.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| apps | mapped / selene-ios-ipados-apps | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-network-pairmanager-m-network

moonlight-ios / selene-ios-ipados / network / `Limelight/Network/PairManager.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / selene-ios-ipados-pair | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-network-wakeonlanmanager-m-network

moonlight-ios / selene-ios-ipados / network / `Limelight/Network/WakeOnLanManager.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wake | mapped / selene-ios-ipados-wake | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-stream-connection-m-media

moonlight-ios / selene-ios-ipados / media / `Limelight/Stream/Connection.m`；reviewed=true；inventory=4。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| surround | mapped / selene-ios-ipados-surround | 独立非设置行为/平台消费入口 |
| h264 | mapped / selene-ios-ipados-h264 | 独立非设置行为/平台消费入口 |
| hevc | mapped / selene-ios-ipados-hevc | 独立非设置行为/平台消费入口 |
| av1 | mapped / selene-ios-ipados-av1 | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-limelight-stream-videodecoderrenderer-m-media

moonlight-ios / selene-ios-ipados / media / `Limelight/Stream/VideoDecoderRenderer.m`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| video-toolbox | mapped / selene-ios-ipados-video-toolbox | 独立非设置行为/平台消费入口 |

### selene-ios-ipados-moonlight-ios-moonlight-xcodeproj-project-pbxproj-packaging

moonlight-ios / selene-ios-ipados / packaging / `Moonlight.xcodeproj/project.pbxproj`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| xcode-target | mapped / selene-ios-ipados-xcode-target | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-backend-boxartmanager-cpp-management

moonlight-qt / selene-linux / management / `app/backend/boxartmanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| box-art | mapped / selene-linux-box-art | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-backend-computermanager-cpp-network

moonlight-qt / selene-linux / network / `app/backend/computermanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| discover | mapped / selene-linux-discover | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-backend-nvcomputer-cpp-network

moonlight-qt / selene-linux / network / `app/backend/nvcomputer.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wake | mapped / selene-linux-wake | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-backend-nvhttp-cpp-management

moonlight-qt / selene-linux / management / `app/backend/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| list-apps | mapped / selene-linux-list-apps | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-backend-nvpairingmanager-cpp-network

moonlight-qt / selene-linux / network / `app/backend/nvpairingmanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / selene-linux-pair | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-cli-commandlineparser-cpp-cli

moonlight-qt / selene-linux / cli / `app/cli/commandlineparser.cpp`；reviewed=true；inventory=33。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pin | mapped / selene-linux-cli-pin | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 720 | mapped / selene-linux-cli-720 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 1080 | mapped / selene-linux-cli-1080 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 1440 | mapped / selene-linux-cli-1440 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 4K | mapped / selene-linux-cli-4k | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| resolution | mapped / selene-linux-cli-resolution | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| vsync | mapped / selene-linux-cli-vsync | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| fps | mapped / selene-linux-cli-fps | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| bitrate | mapped / selene-linux-cli-bitrate | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| packet-size | mapped / selene-linux-cli-packet-size | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| display-mode | mapped / selene-linux-cli-display-mode | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| audio-config | mapped / selene-linux-cli-audio-config | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| multi-controller | mapped / selene-linux-cli-multi-controller | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| quit-after | mapped / selene-linux-cli-quit-after | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| absolute-mouse | mapped / selene-linux-cli-absolute-mouse | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| mouse-buttons-swap | mapped / selene-linux-cli-mouse-buttons-swap | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| touchscreen-trackpad | mapped / selene-linux-cli-touchscreen-trackpad | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| game-optimization | mapped / selene-linux-cli-game-optimization | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| audio-on-host | mapped / selene-linux-cli-audio-on-host | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| frame-pacing | mapped / selene-linux-cli-frame-pacing | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| mute-on-focus-loss | mapped / selene-linux-cli-mute-on-focus-loss | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| background-gamepad | mapped / selene-linux-cli-background-gamepad | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| reverse-scroll-direction | mapped / selene-linux-cli-reverse-scroll-direction | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| swap-gamepad-buttons | mapped / selene-linux-cli-swap-gamepad-buttons | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| keep-awake | mapped / selene-linux-cli-keep-awake | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| performance-overlay | mapped / selene-linux-cli-performance-overlay | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| hdr | mapped / selene-linux-cli-hdr | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| yuv444 | mapped / selene-linux-cli-yuv444 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| capture-system-keys | mapped / selene-linux-cli-capture-system-keys | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| video-codec | mapped / selene-linux-cli-video-codec | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| video-decoder | mapped / selene-linux-cli-video-decoder | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| csv | mapped / selene-linux-cli-csv | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| verbose | mapped / selene-linux-cli-verbose | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |

### selene-linux-moonlight-qt-app-cli-commandlineparser-cpp-management

moonlight-qt / selene-linux / management / `app/cli/commandlineparser.cpp`；reviewed=true；inventory=4。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| action-list | mapped / selene-linux-action-list | 独立非设置行为/平台消费入口 |
| action-pair | mapped / selene-linux-action-pair | 独立非设置行为/平台消费入口 |
| action-stream | mapped / selene-linux-action-stream | 独立非设置行为/平台消费入口 |
| action-quit | mapped / selene-linux-action-quit | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-settings-streamingpreferences-h-setting

moonlight-qt / selene-linux / setting / `app/settings/streamingpreferences.h`；reviewed=true；inventory=38。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| width | mapped / selene-linux-width | 声明→实际读取/消费；平台差异分别验收 |
| height | mapped / selene-linux-height | 声明→实际读取/消费；平台差异分别验收 |
| fps | mapped / selene-linux-fps | 声明→实际读取/消费；平台差异分别验收 |
| bitrateKbps | mapped / selene-linux-bitratekbps | 声明→实际读取/消费；平台差异分别验收 |
| unlockBitrate | mapped / selene-linux-unlockbitrate | 声明→实际读取/消费；平台差异分别验收 |
| autoAdjustBitrate | mapped / selene-linux-autoadjustbitrate | 声明→实际读取/消费；平台差异分别验收 |
| enableVsync | mapped / selene-linux-enablevsync | 声明→实际读取/消费；平台差异分别验收 |
| gameOptimizations | mapped / selene-linux-gameoptimizations | 声明→实际读取/消费；平台差异分别验收 |
| playAudioOnHost | mapped / selene-linux-playaudioonhost | 声明→实际读取/消费；平台差异分别验收 |
| multiController | mapped / selene-linux-multicontroller | 声明→实际读取/消费；平台差异分别验收 |
| enableMdns | mapped / selene-linux-enablemdns | 声明→实际读取/消费；平台差异分别验收 |
| quitAppAfter | mapped / selene-linux-quitappafter | 声明→实际读取/消费；平台差异分别验收 |
| absoluteMouseMode | mapped / selene-linux-absolutemousemode | 声明→实际读取/消费；平台差异分别验收 |
| absoluteTouchMode | mapped / selene-linux-absolutetouchmode | 声明→实际读取/消费；平台差异分别验收 |
| framePacing | mapped / selene-linux-framepacing | 声明→实际读取/消费；平台差异分别验收 |
| connectionWarnings | mapped / selene-linux-connectionwarnings | 声明→实际读取/消费；平台差异分别验收 |
| configurationWarnings | mapped / selene-linux-configurationwarnings | 声明→实际读取/消费；平台差异分别验收 |
| richPresence | mapped / selene-linux-richpresence | 声明→实际读取/消费；平台差异分别验收 |
| gamepadMouse | mapped / selene-linux-gamepadmouse | 声明→实际读取/消费；平台差异分别验收 |
| detectNetworkBlocking | mapped / selene-linux-detectnetworkblocking | 声明→实际读取/消费；平台差异分别验收 |
| showPerformanceOverlay | mapped / selene-linux-showperformanceoverlay | 声明→实际读取/消费；平台差异分别验收 |
| audioConfig | mapped / selene-linux-audioconfig | 声明→实际读取/消费；平台差异分别验收 |
| videoCodecConfig | mapped / selene-linux-videocodecconfig | 声明→实际读取/消费；平台差异分别验收 |
| enableHdr | mapped / selene-linux-enablehdr | 声明→实际读取/消费；平台差异分别验收 |
| enableYUV444 | mapped / selene-linux-enableyuv444 | 声明→实际读取/消费；平台差异分别验收 |
| videoDecoderSelection | mapped / selene-linux-videodecoderselection | 声明→实际读取/消费；平台差异分别验收 |
| rendererSelection | mapped / selene-linux-rendererselection | 声明→实际读取/消费；平台差异分别验收 |
| windowMode | mapped / selene-linux-windowmode | 声明→实际读取/消费；平台差异分别验收 |
| recommendedFullScreenMode | implementation-detail /  | 派生推荐值，不是可独立控制的用户设置 |
| uiDisplayMode | mapped / selene-linux-uidisplaymode | 声明→实际读取/消费；平台差异分别验收 |
| swapMouseButtons | mapped / selene-linux-swapmousebuttons | 声明→实际读取/消费；平台差异分别验收 |
| muteOnFocusLoss | mapped / selene-linux-muteonfocusloss | 声明→实际读取/消费；平台差异分别验收 |
| backgroundGamepad | mapped / selene-linux-backgroundgamepad | 声明→实际读取/消费；平台差异分别验收 |
| reverseScrollDirection | mapped / selene-linux-reversescrolldirection | 声明→实际读取/消费；平台差异分别验收 |
| swapFaceButtons | mapped / selene-linux-swapfacebuttons | 声明→实际读取/消费；平台差异分别验收 |
| keepAwake | mapped / selene-linux-keepawake | 声明→实际读取/消费；平台差异分别验收 |
| captureSysKeysMode | mapped / selene-linux-capturesyskeysmode | 声明→实际读取/消费；平台差异分别验收 |
| language | mapped / selene-linux-language | 声明→实际读取/消费；平台差异分别验收 |

### selene-linux-moonlight-qt-app-streaming-audio-audio-cpp-media

moonlight-qt / selene-linux / media / `app/streaming/audio/audio.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| surround | mapped / selene-linux-surround | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-input-abstouch-cpp-input

moonlight-qt / selene-linux / input / `app/streaming/input/abstouch.cpp`；reviewed=true；inventory=2。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| multitouch | mapped / selene-linux-multitouch | 独立非设置行为/平台消费入口 |
| pen | mapped / selene-linux-pen | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-input-gamepad-cpp-input

moonlight-qt / selene-linux / input / `app/streaming/input/gamepad.cpp`；reviewed=true；inventory=6。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-battery | mapped / selene-linux-controller-battery | 独立非设置行为/平台消费入口 |
| controller-motion | mapped / selene-linux-controller-motion | 独立非设置行为/平台消费入口 |
| controller-touchpad | mapped / selene-linux-controller-touchpad | 独立非设置行为/平台消费入口 |
| rumble-feedback | mapped / selene-linux-rumble-feedback | 独立非设置行为/平台消费入口 |
| trigger-rumble | mapped / selene-linux-trigger-rumble | 独立非设置行为/平台消费入口 |
| rgb-led | mapped / selene-linux-rgb-led | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-input-input-cpp-shortcut

moonlight-qt / selene-linux / shortcut / `app/streaming/input/input.cpp`；reviewed=true；inventory=11。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| KeyComboQuit | mapped / selene-linux-keycomboquit | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboUngrabInput | mapped / selene-linux-keycomboungrabinput | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleFullScreen | mapped / selene-linux-keycombotogglefullscreen | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleStatsOverlay | mapped / selene-linux-keycombotogglestatsoverlay | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleMouseMode | mapped / selene-linux-keycombotogglemousemode | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleCursorHide | mapped / selene-linux-keycombotogglecursorhide | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleMinimize | mapped / selene-linux-keycombotoggleminimize | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboPasteText | mapped / selene-linux-keycombopastetext | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboTogglePointerRegionLock | mapped / selene-linux-keycombotogglepointerregionlock | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboQuitAndExit | mapped / selene-linux-keycomboquitandexit | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleKeyboardGrab | mapped / selene-linux-keycombotogglekeyboardgrab | 快捷键定义；保留功能，Aether可重设键位 |

### selene-linux-moonlight-qt-app-streaming-input-keyboard-cpp-input

moonlight-qt / selene-linux / input / `app/streaming/input/keyboard.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| utf8-text | mapped / selene-linux-utf8-text | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-input-mouse-cpp-input

moonlight-qt / selene-linux / input / `app/streaming/input/mouse.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| precise-horizontal-wheel | mapped / selene-linux-precise-horizontal-wheel | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-video-ffmpeg-cpp-media

moonlight-qt / selene-linux / media / `app/streaming/video/ffmpeg.cpp`；reviewed=true；inventory=5。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| decoder-fallback | mapped / selene-linux-decoder-fallback | 独立非设置行为/平台消费入口 |
| h264 | mapped / selene-linux-h264 | 独立非设置行为/平台消费入口 |
| hevc | mapped / selene-linux-hevc | 独立非设置行为/平台消费入口 |
| av1 | mapped / selene-linux-av1 | 独立非设置行为/平台消费入口 |
| hdr-main10 | mapped / selene-linux-hdr-main10 | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-video-ffmpeg-renderers-pacer-waylandvsyncsource-cpp-media

moonlight-qt / selene-linux / media / `app/streaming/video/ffmpeg-renderers/pacer/waylandvsyncsource.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wayland-pacing | mapped / selene-linux-wayland-pacing | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-app-streaming-video-ffmpeg-renderers-vaapi-cpp-media

moonlight-qt / selene-linux / media / `app/streaming/video/ffmpeg-renderers/vaapi.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| vaapi | mapped / selene-linux-vaapi | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-readme-md-input

moonlight-qt / selene-linux / input / `README.md`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-count | mapped / selene-linux-controller-count | 独立非设置行为/平台消费入口 |

### selene-linux-moonlight-qt-readme-md-packaging

moonlight-qt / selene-linux / packaging / `README.md`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| distribution-architectures | mapped / selene-linux-distribution-architectures | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-backend-boxartmanager-cpp-management

moonlight-qt / selene-macos / management / `app/backend/boxartmanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| box-art | mapped / selene-macos-box-art | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-backend-computermanager-cpp-network

moonlight-qt / selene-macos / network / `app/backend/computermanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| discover | mapped / selene-macos-discover | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-backend-nvcomputer-cpp-network

moonlight-qt / selene-macos / network / `app/backend/nvcomputer.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wake | mapped / selene-macos-wake | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-backend-nvhttp-cpp-management

moonlight-qt / selene-macos / management / `app/backend/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| list-apps | mapped / selene-macos-list-apps | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-backend-nvpairingmanager-cpp-network

moonlight-qt / selene-macos / network / `app/backend/nvpairingmanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / selene-macos-pair | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-cli-commandlineparser-cpp-cli

moonlight-qt / selene-macos / cli / `app/cli/commandlineparser.cpp`；reviewed=true；inventory=33。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pin | mapped / selene-macos-cli-pin | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 720 | mapped / selene-macos-cli-720 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 1080 | mapped / selene-macos-cli-1080 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 1440 | mapped / selene-macos-cli-1440 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 4K | mapped / selene-macos-cli-4k | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| resolution | mapped / selene-macos-cli-resolution | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| vsync | mapped / selene-macos-cli-vsync | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| fps | mapped / selene-macos-cli-fps | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| bitrate | mapped / selene-macos-cli-bitrate | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| packet-size | mapped / selene-macos-cli-packet-size | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| display-mode | mapped / selene-macos-cli-display-mode | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| audio-config | mapped / selene-macos-cli-audio-config | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| multi-controller | mapped / selene-macos-cli-multi-controller | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| quit-after | mapped / selene-macos-cli-quit-after | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| absolute-mouse | mapped / selene-macos-cli-absolute-mouse | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| mouse-buttons-swap | mapped / selene-macos-cli-mouse-buttons-swap | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| touchscreen-trackpad | mapped / selene-macos-cli-touchscreen-trackpad | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| game-optimization | mapped / selene-macos-cli-game-optimization | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| audio-on-host | mapped / selene-macos-cli-audio-on-host | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| frame-pacing | mapped / selene-macos-cli-frame-pacing | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| mute-on-focus-loss | mapped / selene-macos-cli-mute-on-focus-loss | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| background-gamepad | mapped / selene-macos-cli-background-gamepad | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| reverse-scroll-direction | mapped / selene-macos-cli-reverse-scroll-direction | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| swap-gamepad-buttons | mapped / selene-macos-cli-swap-gamepad-buttons | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| keep-awake | mapped / selene-macos-cli-keep-awake | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| performance-overlay | mapped / selene-macos-cli-performance-overlay | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| hdr | mapped / selene-macos-cli-hdr | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| yuv444 | mapped / selene-macos-cli-yuv444 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| capture-system-keys | mapped / selene-macos-cli-capture-system-keys | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| video-codec | mapped / selene-macos-cli-video-codec | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| video-decoder | mapped / selene-macos-cli-video-decoder | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| csv | mapped / selene-macos-cli-csv | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| verbose | mapped / selene-macos-cli-verbose | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |

### selene-macos-moonlight-qt-app-cli-commandlineparser-cpp-management

moonlight-qt / selene-macos / management / `app/cli/commandlineparser.cpp`；reviewed=true；inventory=4。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| action-list | mapped / selene-macos-action-list | 独立非设置行为/平台消费入口 |
| action-pair | mapped / selene-macos-action-pair | 独立非设置行为/平台消费入口 |
| action-stream | mapped / selene-macos-action-stream | 独立非设置行为/平台消费入口 |
| action-quit | mapped / selene-macos-action-quit | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-settings-streamingpreferences-h-setting

moonlight-qt / selene-macos / setting / `app/settings/streamingpreferences.h`；reviewed=true；inventory=38。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| width | mapped / selene-macos-width | 声明→实际读取/消费；平台差异分别验收 |
| height | mapped / selene-macos-height | 声明→实际读取/消费；平台差异分别验收 |
| fps | mapped / selene-macos-fps | 声明→实际读取/消费；平台差异分别验收 |
| bitrateKbps | mapped / selene-macos-bitratekbps | 声明→实际读取/消费；平台差异分别验收 |
| unlockBitrate | mapped / selene-macos-unlockbitrate | 声明→实际读取/消费；平台差异分别验收 |
| autoAdjustBitrate | mapped / selene-macos-autoadjustbitrate | 声明→实际读取/消费；平台差异分别验收 |
| enableVsync | mapped / selene-macos-enablevsync | 声明→实际读取/消费；平台差异分别验收 |
| gameOptimizations | mapped / selene-macos-gameoptimizations | 声明→实际读取/消费；平台差异分别验收 |
| playAudioOnHost | mapped / selene-macos-playaudioonhost | 声明→实际读取/消费；平台差异分别验收 |
| multiController | mapped / selene-macos-multicontroller | 声明→实际读取/消费；平台差异分别验收 |
| enableMdns | mapped / selene-macos-enablemdns | 声明→实际读取/消费；平台差异分别验收 |
| quitAppAfter | mapped / selene-macos-quitappafter | 声明→实际读取/消费；平台差异分别验收 |
| absoluteMouseMode | mapped / selene-macos-absolutemousemode | 声明→实际读取/消费；平台差异分别验收 |
| absoluteTouchMode | mapped / selene-macos-absolutetouchmode | 声明→实际读取/消费；平台差异分别验收 |
| framePacing | mapped / selene-macos-framepacing | 声明→实际读取/消费；平台差异分别验收 |
| connectionWarnings | mapped / selene-macos-connectionwarnings | 声明→实际读取/消费；平台差异分别验收 |
| configurationWarnings | mapped / selene-macos-configurationwarnings | 声明→实际读取/消费；平台差异分别验收 |
| richPresence | mapped / selene-macos-richpresence | 声明→实际读取/消费；平台差异分别验收 |
| gamepadMouse | mapped / selene-macos-gamepadmouse | 声明→实际读取/消费；平台差异分别验收 |
| detectNetworkBlocking | mapped / selene-macos-detectnetworkblocking | 声明→实际读取/消费；平台差异分别验收 |
| showPerformanceOverlay | mapped / selene-macos-showperformanceoverlay | 声明→实际读取/消费；平台差异分别验收 |
| audioConfig | mapped / selene-macos-audioconfig | 声明→实际读取/消费；平台差异分别验收 |
| videoCodecConfig | mapped / selene-macos-videocodecconfig | 声明→实际读取/消费；平台差异分别验收 |
| enableHdr | mapped / selene-macos-enablehdr | 声明→实际读取/消费；平台差异分别验收 |
| enableYUV444 | mapped / selene-macos-enableyuv444 | 声明→实际读取/消费；平台差异分别验收 |
| videoDecoderSelection | mapped / selene-macos-videodecoderselection | 声明→实际读取/消费；平台差异分别验收 |
| rendererSelection | mapped / selene-macos-rendererselection | 声明→实际读取/消费；平台差异分别验收 |
| windowMode | mapped / selene-macos-windowmode | 声明→实际读取/消费；平台差异分别验收 |
| recommendedFullScreenMode | implementation-detail /  | 派生推荐值，不是可独立控制的用户设置 |
| uiDisplayMode | mapped / selene-macos-uidisplaymode | 声明→实际读取/消费；平台差异分别验收 |
| swapMouseButtons | mapped / selene-macos-swapmousebuttons | 声明→实际读取/消费；平台差异分别验收 |
| muteOnFocusLoss | mapped / selene-macos-muteonfocusloss | 声明→实际读取/消费；平台差异分别验收 |
| backgroundGamepad | mapped / selene-macos-backgroundgamepad | 声明→实际读取/消费；平台差异分别验收 |
| reverseScrollDirection | mapped / selene-macos-reversescrolldirection | 声明→实际读取/消费；平台差异分别验收 |
| swapFaceButtons | mapped / selene-macos-swapfacebuttons | 声明→实际读取/消费；平台差异分别验收 |
| keepAwake | mapped / selene-macos-keepawake | 声明→实际读取/消费；平台差异分别验收 |
| captureSysKeysMode | mapped / selene-macos-capturesyskeysmode | 声明→实际读取/消费；平台差异分别验收 |
| language | mapped / selene-macos-language | 声明→实际读取/消费；平台差异分别验收 |

### selene-macos-moonlight-qt-app-streaming-audio-audio-cpp-media

moonlight-qt / selene-macos / media / `app/streaming/audio/audio.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| surround | mapped / selene-macos-surround | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-streaming-input-abstouch-cpp-input

moonlight-qt / selene-macos / input / `app/streaming/input/abstouch.cpp`；reviewed=true；inventory=2。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| multitouch | mapped / selene-macos-multitouch | 独立非设置行为/平台消费入口 |
| pen | mapped / selene-macos-pen | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-streaming-input-gamepad-cpp-input

moonlight-qt / selene-macos / input / `app/streaming/input/gamepad.cpp`；reviewed=true；inventory=6。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-battery | mapped / selene-macos-controller-battery | 独立非设置行为/平台消费入口 |
| controller-motion | mapped / selene-macos-controller-motion | 独立非设置行为/平台消费入口 |
| controller-touchpad | mapped / selene-macos-controller-touchpad | 独立非设置行为/平台消费入口 |
| rumble-feedback | mapped / selene-macos-rumble-feedback | 独立非设置行为/平台消费入口 |
| trigger-rumble | mapped / selene-macos-trigger-rumble | 独立非设置行为/平台消费入口 |
| rgb-led | mapped / selene-macos-rgb-led | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-streaming-input-input-cpp-shortcut

moonlight-qt / selene-macos / shortcut / `app/streaming/input/input.cpp`；reviewed=true；inventory=11。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| KeyComboQuit | mapped / selene-macos-keycomboquit | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboUngrabInput | mapped / selene-macos-keycomboungrabinput | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleFullScreen | mapped / selene-macos-keycombotogglefullscreen | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleStatsOverlay | mapped / selene-macos-keycombotogglestatsoverlay | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleMouseMode | mapped / selene-macos-keycombotogglemousemode | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleCursorHide | mapped / selene-macos-keycombotogglecursorhide | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleMinimize | mapped / selene-macos-keycombotoggleminimize | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboPasteText | mapped / selene-macos-keycombopastetext | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboTogglePointerRegionLock | mapped / selene-macos-keycombotogglepointerregionlock | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboQuitAndExit | mapped / selene-macos-keycomboquitandexit | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleKeyboardGrab | mapped / selene-macos-keycombotogglekeyboardgrab | 快捷键定义；保留功能，Aether可重设键位 |

### selene-macos-moonlight-qt-app-streaming-input-keyboard-cpp-input

moonlight-qt / selene-macos / input / `app/streaming/input/keyboard.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| utf8-text | mapped / selene-macos-utf8-text | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-streaming-input-mouse-cpp-input

moonlight-qt / selene-macos / input / `app/streaming/input/mouse.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| precise-horizontal-wheel | mapped / selene-macos-precise-horizontal-wheel | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-streaming-video-ffmpeg-cpp-media

moonlight-qt / selene-macos / media / `app/streaming/video/ffmpeg.cpp`；reviewed=true；inventory=5。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| decoder-fallback | mapped / selene-macos-decoder-fallback | 独立非设置行为/平台消费入口 |
| h264 | mapped / selene-macos-h264 | 独立非设置行为/平台消费入口 |
| hevc | mapped / selene-macos-hevc | 独立非设置行为/平台消费入口 |
| av1 | mapped / selene-macos-av1 | 独立非设置行为/平台消费入口 |
| hdr-main10 | mapped / selene-macos-hdr-main10 | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-app-streaming-video-ffmpeg-renderers-vt-metal-mm-media

moonlight-qt / selene-macos / media / `app/streaming/video/ffmpeg-renderers/vt_metal.mm`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| metal | mapped / selene-macos-metal | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-readme-md-input

moonlight-qt / selene-macos / input / `README.md`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-count | mapped / selene-macos-controller-count | 独立非设置行为/平台消费入口 |

### selene-macos-moonlight-qt-readme-md-packaging

moonlight-qt / selene-macos / packaging / `README.md`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| distribution-architectures | mapped / selene-macos-distribution-architectures | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-backend-boxartmanager-cpp-management

moonlight-qt / selene-windows / management / `app/backend/boxartmanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| box-art | mapped / selene-windows-box-art | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-backend-computermanager-cpp-network

moonlight-qt / selene-windows / network / `app/backend/computermanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| discover | mapped / selene-windows-discover | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-backend-nvcomputer-cpp-network

moonlight-qt / selene-windows / network / `app/backend/nvcomputer.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| wake | mapped / selene-windows-wake | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-backend-nvhttp-cpp-management

moonlight-qt / selene-windows / management / `app/backend/nvhttp.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| list-apps | mapped / selene-windows-list-apps | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-backend-nvpairingmanager-cpp-network

moonlight-qt / selene-windows / network / `app/backend/nvpairingmanager.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pair | mapped / selene-windows-pair | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-cli-commandlineparser-cpp-cli

moonlight-qt / selene-windows / cli / `app/cli/commandlineparser.cpp`；reviewed=true；inventory=33。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| pin | mapped / selene-windows-cli-pin | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 720 | mapped / selene-windows-cli-720 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 1080 | mapped / selene-windows-cli-1080 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 1440 | mapped / selene-windows-cli-1440 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| 4K | mapped / selene-windows-cli-4k | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| resolution | mapped / selene-windows-cli-resolution | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| vsync | mapped / selene-windows-cli-vsync | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| fps | mapped / selene-windows-cli-fps | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| bitrate | mapped / selene-windows-cli-bitrate | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| packet-size | mapped / selene-windows-cli-packet-size | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| display-mode | mapped / selene-windows-cli-display-mode | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| audio-config | mapped / selene-windows-cli-audio-config | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| multi-controller | mapped / selene-windows-cli-multi-controller | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| quit-after | mapped / selene-windows-cli-quit-after | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| absolute-mouse | mapped / selene-windows-cli-absolute-mouse | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| mouse-buttons-swap | mapped / selene-windows-cli-mouse-buttons-swap | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| touchscreen-trackpad | mapped / selene-windows-cli-touchscreen-trackpad | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| game-optimization | mapped / selene-windows-cli-game-optimization | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| audio-on-host | mapped / selene-windows-cli-audio-on-host | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| frame-pacing | mapped / selene-windows-cli-frame-pacing | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| mute-on-focus-loss | mapped / selene-windows-cli-mute-on-focus-loss | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| background-gamepad | mapped / selene-windows-cli-background-gamepad | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| reverse-scroll-direction | mapped / selene-windows-cli-reverse-scroll-direction | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| swap-gamepad-buttons | mapped / selene-windows-cli-swap-gamepad-buttons | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| keep-awake | mapped / selene-windows-cli-keep-awake | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| performance-overlay | mapped / selene-windows-cli-performance-overlay | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| hdr | mapped / selene-windows-cli-hdr | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| yuv444 | mapped / selene-windows-cli-yuv444 | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| capture-system-keys | mapped / selene-windows-cli-capture-system-keys | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| video-codec | mapped / selene-windows-cli-video-codec | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| video-decoder | mapped / selene-windows-cli-video-decoder | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| csv | mapped / selene-windows-cli-csv | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |
| verbose | mapped / selene-windows-cli-verbose | 命令参数；Aether需显式鉴权和实例ID，不直接执行上游CLI |

### selene-windows-moonlight-qt-app-cli-commandlineparser-cpp-management

moonlight-qt / selene-windows / management / `app/cli/commandlineparser.cpp`；reviewed=true；inventory=4。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| action-list | mapped / selene-windows-action-list | 独立非设置行为/平台消费入口 |
| action-pair | mapped / selene-windows-action-pair | 独立非设置行为/平台消费入口 |
| action-stream | mapped / selene-windows-action-stream | 独立非设置行为/平台消费入口 |
| action-quit | mapped / selene-windows-action-quit | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-settings-streamingpreferences-h-setting

moonlight-qt / selene-windows / setting / `app/settings/streamingpreferences.h`；reviewed=true；inventory=38。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| width | mapped / selene-windows-width | 声明→实际读取/消费；平台差异分别验收 |
| height | mapped / selene-windows-height | 声明→实际读取/消费；平台差异分别验收 |
| fps | mapped / selene-windows-fps | 声明→实际读取/消费；平台差异分别验收 |
| bitrateKbps | mapped / selene-windows-bitratekbps | 声明→实际读取/消费；平台差异分别验收 |
| unlockBitrate | mapped / selene-windows-unlockbitrate | 声明→实际读取/消费；平台差异分别验收 |
| autoAdjustBitrate | mapped / selene-windows-autoadjustbitrate | 声明→实际读取/消费；平台差异分别验收 |
| enableVsync | mapped / selene-windows-enablevsync | 声明→实际读取/消费；平台差异分别验收 |
| gameOptimizations | mapped / selene-windows-gameoptimizations | 声明→实际读取/消费；平台差异分别验收 |
| playAudioOnHost | mapped / selene-windows-playaudioonhost | 声明→实际读取/消费；平台差异分别验收 |
| multiController | mapped / selene-windows-multicontroller | 声明→实际读取/消费；平台差异分别验收 |
| enableMdns | mapped / selene-windows-enablemdns | 声明→实际读取/消费；平台差异分别验收 |
| quitAppAfter | mapped / selene-windows-quitappafter | 声明→实际读取/消费；平台差异分别验收 |
| absoluteMouseMode | mapped / selene-windows-absolutemousemode | 声明→实际读取/消费；平台差异分别验收 |
| absoluteTouchMode | mapped / selene-windows-absolutetouchmode | 声明→实际读取/消费；平台差异分别验收 |
| framePacing | mapped / selene-windows-framepacing | 声明→实际读取/消费；平台差异分别验收 |
| connectionWarnings | mapped / selene-windows-connectionwarnings | 声明→实际读取/消费；平台差异分别验收 |
| configurationWarnings | mapped / selene-windows-configurationwarnings | 声明→实际读取/消费；平台差异分别验收 |
| richPresence | mapped / selene-windows-richpresence | 声明→实际读取/消费；平台差异分别验收 |
| gamepadMouse | mapped / selene-windows-gamepadmouse | 声明→实际读取/消费；平台差异分别验收 |
| detectNetworkBlocking | mapped / selene-windows-detectnetworkblocking | 声明→实际读取/消费；平台差异分别验收 |
| showPerformanceOverlay | mapped / selene-windows-showperformanceoverlay | 声明→实际读取/消费；平台差异分别验收 |
| audioConfig | mapped / selene-windows-audioconfig | 声明→实际读取/消费；平台差异分别验收 |
| videoCodecConfig | mapped / selene-windows-videocodecconfig | 声明→实际读取/消费；平台差异分别验收 |
| enableHdr | mapped / selene-windows-enablehdr | 声明→实际读取/消费；平台差异分别验收 |
| enableYUV444 | mapped / selene-windows-enableyuv444 | 声明→实际读取/消费；平台差异分别验收 |
| videoDecoderSelection | mapped / selene-windows-videodecoderselection | 声明→实际读取/消费；平台差异分别验收 |
| rendererSelection | mapped / selene-windows-rendererselection | 声明→实际读取/消费；平台差异分别验收 |
| windowMode | mapped / selene-windows-windowmode | 声明→实际读取/消费；平台差异分别验收 |
| recommendedFullScreenMode | implementation-detail /  | 派生推荐值，不是可独立控制的用户设置 |
| uiDisplayMode | mapped / selene-windows-uidisplaymode | 声明→实际读取/消费；平台差异分别验收 |
| swapMouseButtons | mapped / selene-windows-swapmousebuttons | 声明→实际读取/消费；平台差异分别验收 |
| muteOnFocusLoss | mapped / selene-windows-muteonfocusloss | 声明→实际读取/消费；平台差异分别验收 |
| backgroundGamepad | mapped / selene-windows-backgroundgamepad | 声明→实际读取/消费；平台差异分别验收 |
| reverseScrollDirection | mapped / selene-windows-reversescrolldirection | 声明→实际读取/消费；平台差异分别验收 |
| swapFaceButtons | mapped / selene-windows-swapfacebuttons | 声明→实际读取/消费；平台差异分别验收 |
| keepAwake | mapped / selene-windows-keepawake | 声明→实际读取/消费；平台差异分别验收 |
| captureSysKeysMode | mapped / selene-windows-capturesyskeysmode | 声明→实际读取/消费；平台差异分别验收 |
| language | mapped / selene-windows-language | 声明→实际读取/消费；平台差异分别验收 |

### selene-windows-moonlight-qt-app-streaming-audio-audio-cpp-media

moonlight-qt / selene-windows / media / `app/streaming/audio/audio.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| surround | mapped / selene-windows-surround | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-streaming-input-abstouch-cpp-input

moonlight-qt / selene-windows / input / `app/streaming/input/abstouch.cpp`；reviewed=true；inventory=2。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| multitouch | mapped / selene-windows-multitouch | 独立非设置行为/平台消费入口 |
| pen | mapped / selene-windows-pen | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-streaming-input-gamepad-cpp-input

moonlight-qt / selene-windows / input / `app/streaming/input/gamepad.cpp`；reviewed=true；inventory=6。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-battery | mapped / selene-windows-controller-battery | 独立非设置行为/平台消费入口 |
| controller-motion | mapped / selene-windows-controller-motion | 独立非设置行为/平台消费入口 |
| controller-touchpad | mapped / selene-windows-controller-touchpad | 独立非设置行为/平台消费入口 |
| rumble-feedback | mapped / selene-windows-rumble-feedback | 独立非设置行为/平台消费入口 |
| trigger-rumble | mapped / selene-windows-trigger-rumble | 独立非设置行为/平台消费入口 |
| rgb-led | mapped / selene-windows-rgb-led | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-streaming-input-input-cpp-shortcut

moonlight-qt / selene-windows / shortcut / `app/streaming/input/input.cpp`；reviewed=true；inventory=11。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| KeyComboQuit | mapped / selene-windows-keycomboquit | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboUngrabInput | mapped / selene-windows-keycomboungrabinput | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleFullScreen | mapped / selene-windows-keycombotogglefullscreen | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleStatsOverlay | mapped / selene-windows-keycombotogglestatsoverlay | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleMouseMode | mapped / selene-windows-keycombotogglemousemode | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleCursorHide | mapped / selene-windows-keycombotogglecursorhide | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleMinimize | mapped / selene-windows-keycombotoggleminimize | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboPasteText | mapped / selene-windows-keycombopastetext | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboTogglePointerRegionLock | mapped / selene-windows-keycombotogglepointerregionlock | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboQuitAndExit | mapped / selene-windows-keycomboquitandexit | 快捷键定义；保留功能，Aether可重设键位 |
| KeyComboToggleKeyboardGrab | mapped / selene-windows-keycombotogglekeyboardgrab | 快捷键定义；保留功能，Aether可重设键位 |

### selene-windows-moonlight-qt-app-streaming-input-keyboard-cpp-input

moonlight-qt / selene-windows / input / `app/streaming/input/keyboard.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| utf8-text | mapped / selene-windows-utf8-text | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-streaming-input-mouse-cpp-input

moonlight-qt / selene-windows / input / `app/streaming/input/mouse.cpp`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| precise-horizontal-wheel | mapped / selene-windows-precise-horizontal-wheel | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-app-streaming-video-ffmpeg-cpp-media

moonlight-qt / selene-windows / media / `app/streaming/video/ffmpeg.cpp`；reviewed=true；inventory=5。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| decoder-fallback | mapped / selene-windows-decoder-fallback | 独立非设置行为/平台消费入口 |
| h264 | mapped / selene-windows-h264 | 独立非设置行为/平台消费入口 |
| hevc | mapped / selene-windows-hevc | 独立非设置行为/平台消费入口 |
| av1 | mapped / selene-windows-av1 | 独立非设置行为/平台消费入口 |
| hdr-main10 | mapped / selene-windows-hdr-main10 | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-readme-md-input

moonlight-qt / selene-windows / input / `README.md`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| controller-count | mapped / selene-windows-controller-count | 独立非设置行为/平台消费入口 |

### selene-windows-moonlight-qt-readme-md-packaging

moonlight-qt / selene-windows / packaging / `README.md`；reviewed=true；inventory=1。

| key | 处置 / 能力 | 依据 |
|---|---|---|
| distribution-architectures | mapped / selene-windows-distribution-architectures | 独立非设置行为/平台消费入口 |

## 独立验收案例

### case-helios-windows10-adapter-name

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“GPU适配器选择”原行为；配对并取得所需权限
- 步骤：记录 adapter_name 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 adapter_name 切换实例、断连重连及撤销权限，分别记录状态
- 期望：GPU适配器选择 的用户结果符合固定源码定义：Windows 主机配置 adapter_name 控制“GPU适配器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“GPU适配器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 adapter_name 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-address-family

平台 helios-windows10；Phase 36；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“IPv4/IPv6”原行为；配对并取得所需权限
- 步骤：记录 address_family 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 address_family 切换实例、断连重连及撤销权限，分别记录状态
- 期望：IPv4/IPv6 的用户结果符合固定源码定义：Windows 主机配置 address_family 控制“IPv4/IPv6”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“IPv4/IPv6”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 address_family 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-always-send-scancodes

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“扫描码策略”原行为；配对并取得所需权限
- 步骤：记录 always_send_scancodes 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 always_send_scancodes 切换实例、断连重连及撤销权限，分别记录状态
- 期望：扫描码策略 的用户结果符合固定源码定义：Windows 主机配置 always_send_scancodes 控制“扫描码策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“扫描码策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 always_send_scancodes 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-coder

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_coder”原行为；配对并取得所需权限
- 步骤：记录 amd_coder 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_coder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_coder 的用户结果符合固定源码定义：Windows 主机配置 amd_coder 控制“amd后端参数 amd_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_coder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-enforce-hrd

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_enforce_hrd”原行为；配对并取得所需权限
- 步骤：记录 amd_enforce_hrd 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_enforce_hrd 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_enforce_hrd 的用户结果符合固定源码定义：Windows 主机配置 amd_enforce_hrd 控制“amd后端参数 amd_enforce_hrd”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_enforce_hrd”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_enforce_hrd 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-max-au-size

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_max_au_size”原行为；配对并取得所需权限
- 步骤：记录 amd_max_au_size 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_max_au_size 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_max_au_size 的用户结果符合固定源码定义：Windows 主机配置 amd_max_au_size 控制“amd后端参数 amd_max_au_size”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_max_au_size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_max_au_size 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-preanalysis

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_preanalysis”原行为；配对并取得所需权限
- 步骤：记录 amd_preanalysis 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_preanalysis 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_preanalysis 的用户结果符合固定源码定义：Windows 主机配置 amd_preanalysis 控制“amd后端参数 amd_preanalysis”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_preanalysis”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_preanalysis 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-quality

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_quality”原行为；配对并取得所需权限
- 步骤：记录 amd_quality 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_quality 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_quality 的用户结果符合固定源码定义：Windows 主机配置 amd_quality 控制“amd后端参数 amd_quality”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_quality”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_quality 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-rc

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_rc”原行为；配对并取得所需权限
- 步骤：记录 amd_rc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_rc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_rc 的用户结果符合固定源码定义：Windows 主机配置 amd_rc 控制“amd后端参数 amd_rc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_rc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_rc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-usage

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_usage”原行为；配对并取得所需权限
- 步骤：记录 amd_usage 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_usage 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_usage 的用户结果符合固定源码定义：Windows 主机配置 amd_usage 控制“amd后端参数 amd_usage”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_usage”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_usage 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-amd-vbaq

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_vbaq”原行为；配对并取得所需权限
- 步骤：记录 amd_vbaq 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_vbaq 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_vbaq 的用户结果符合固定源码定义：Windows 主机配置 amd_vbaq 控制“amd后端参数 amd_vbaq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_vbaq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_vbaq 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-apps

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用进程/准备/清理命令”原行为；配对并取得所需权限
- 步骤：执行“应用进程/准备/清理命令”的操作并记录实际画面/音频/输入/管理结果；针对 apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用进程/准备/清理命令 的用户结果符合固定源码定义：应用进程/准备/清理命令；保留“应用进程/准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-audio

平台 helios-windows10；Phase 12；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows系统音频捕获与Opus”原行为；配对并取得所需权限
- 步骤：执行“Windows系统音频捕获与Opus”的操作并记录实际画面/音频/输入/管理结果；针对 audio 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows系统音频捕获与Opus 的用户结果符合固定源码定义：Windows系统音频捕获与Opus；保留“Windows系统音频捕获与Opus”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audio 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-audio-sink

平台 helios-windows10；Phase 12；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“系统音频端点选择”原行为；配对并取得所需权限
- 步骤：记录 audio_sink 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 audio_sink 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统音频端点选择 的用户结果符合固定源码定义：Windows 主机配置 audio_sink 控制“系统音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“系统音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audio_sink 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-av1-mode

平台 helios-windows10；Phase 14；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“AV1协商策略”原行为；配对并取得所需权限
- 步骤：记录 av1_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 av1_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AV1协商策略 的用户结果符合固定源码定义：Windows 主机配置 av1_mode 控制“AV1协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“AV1协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-back-button-timeout

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“Back长按策略”原行为；配对并取得所需权限
- 步骤：记录 back_button_timeout 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 back_button_timeout 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Back长按策略 的用户结果符合固定源码定义：Windows 主机配置 back_button_timeout 控制“Back长按策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“Back长按策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 back_button_timeout 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-bind-address

平台 helios-windows10；Phase 36；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“监听地址”原行为；配对并取得所需权限
- 步骤：记录 bind_address 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 bind_address 切换实例、断连重连及撤销权限，分别记录状态
- 期望：监听地址 的用户结果符合固定源码定义：Windows 主机配置 bind_address 控制“监听地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“监听地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 bind_address 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-capture

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“捕获provider”原行为；配对并取得所需权限
- 步骤：记录 capture 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 capture 切换实例、断连重连及撤销权限，分别记录状态
- 期望：捕获provider 的用户结果符合固定源码定义：Windows 主机配置 capture 控制“捕获provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“捕获provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 capture 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-capture-frame

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows物理显示器/GPU捕获”原行为；配对并取得所需权限
- 步骤：执行“Windows物理显示器/GPU捕获”的操作并记录实际画面/音频/输入/管理结果；针对 capture-frame 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows物理显示器/GPU捕获 的用户结果符合固定源码定义：Windows物理显示器/GPU捕获；保留“Windows物理显示器/GPU捕获”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 capture-frame 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-cert

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“证书路径”原行为；配对并取得所需权限
- 步骤：记录 cert 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 cert 切换实例、断连重连及撤销权限，分别记录状态
- 期望：证书路径 的用户结果符合固定源码定义：Windows 主机配置 cert 控制“证书路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“证书路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cert 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-clipboard

平台 helios-windows10；Phase 25；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“剪切板同步”原行为；配对并取得所需权限
- 步骤：执行“剪切板同步”的操作并记录实际画面/音频/输入/管理结果；针对 clipboard 切换实例、断连重连及撤销权限，分别记录状态
- 期望：剪切板同步 的用户结果符合固定源码定义：剪切板同步；保留“剪切板同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 clipboard 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-clipboard-permission

平台 helios-windows10；Phase 25；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“剪切板入站单独检查clipboard_set权限”原行为；配对并取得所需权限
- 步骤：执行“剪切板入站单独检查clipboard_set权限”的操作并记录实际画面/音频/输入/管理结果；针对 clipboard-permission 切换实例、断连重连及撤销权限，分别记录状态
- 期望：剪切板入站单独检查clipboard_set权限 的用户结果符合固定源码定义：剪切板入站单独检查clipboard_set权限；保留“剪切板入站单独检查clipboard_set权限”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 clipboard-permission 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-connection-hooks

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“连接/断连命令钩子”原行为；配对并取得所需权限
- 步骤：执行“连接/断连命令钩子”的操作并记录实际画面/音频/输入/管理结果；针对 connection-hooks 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接/断连命令钩子 的用户结果符合固定源码定义：连接/断连命令钩子；保留“连接/断连命令钩子”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 connection-hooks 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-controller

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“控制器输入开关”原行为；配对并取得所需权限
- 步骤：记录 controller 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器输入开关 的用户结果符合固定源码定义：Windows 主机配置 controller 控制“控制器输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“控制器输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-controller-motion

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动/触摸/电池消费”原行为；配对并取得所需权限
- 步骤：执行“控制器运动/触摸/电池消费”的操作并记录实际画面/音频/输入/管理结果；针对 controller-motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动/触摸/电池消费 的用户结果符合固定源码定义：控制器运动/触摸/电池消费；保留“控制器运动/触摸/电池消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-credentials-file

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“管理凭据路径”原行为；配对并取得所需权限
- 步骤：记录 credentials_file 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 credentials_file 切换实例、断连重连及撤销权限，分别记录状态
- 期望：管理凭据路径 的用户结果符合固定源码定义：Windows 主机配置 credentials_file 控制“管理凭据路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“管理凭据路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 credentials_file 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-csrf-allowed-origins

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“CSRF允许来源”原行为；配对并取得所需权限
- 步骤：记录 csrf_allowed_origins 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 csrf_allowed_origins 切换实例、断连重连及撤销权限，分别记录状态
- 期望：CSRF允许来源 的用户结果符合固定源码定义：Windows 主机配置 csrf_allowed_origins 控制“CSRF允许来源”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“CSRF允许来源”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 csrf_allowed_origins 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-config-revert-delay

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“显示恢复延迟”原行为；配对并取得所需权限
- 步骤：记录 dd_config_revert_delay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_config_revert_delay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：显示恢复延迟 的用户结果符合固定源码定义：Windows 主机配置 dd_config_revert_delay 控制“显示恢复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“显示恢复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_config_revert_delay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-config-revert-on-disconnect

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“断连恢复显示旧策略”原行为；配对并取得所需权限
- 步骤：记录 dd_config_revert_on_disconnect 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_config_revert_on_disconnect 切换实例、断连重连及撤销权限，分别记录状态
- 期望：断连恢复显示旧策略 的用户结果符合固定源码定义：Windows 主机配置 dd_config_revert_on_disconnect 控制“断连恢复显示旧策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；普通断连/切换保留实例显示组及拓扑；显式StopInstance才清理本组，旧自动恢复策略仅能作用于非实例拥有资源
- 负例：拒绝 dd_config_revert_on_disconnect 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-configuration-option

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“显示设备拓扑配置”原行为；配对并取得所需权限
- 步骤：记录 dd_configuration_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_configuration_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：显示设备拓扑配置 的用户结果符合固定源码定义：Windows 主机配置 dd_configuration_option 控制“显示设备拓扑配置”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“显示设备拓扑配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_configuration_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-hdr-option

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“显示HDR匹配”原行为；配对并取得所需权限
- 步骤：记录 dd_hdr_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_hdr_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：显示HDR匹配 的用户结果符合固定源码定义：Windows 主机配置 dd_hdr_option 控制“显示HDR匹配”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“显示HDR匹配”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_hdr_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-manual-refresh-rate

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“手动刷新率”原行为；配对并取得所需权限
- 步骤：记录 dd_manual_refresh_rate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_manual_refresh_rate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手动刷新率 的用户结果符合固定源码定义：Windows 主机配置 dd_manual_refresh_rate 控制“手动刷新率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“手动刷新率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_manual_refresh_rate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-manual-resolution

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“手动分辨率”原行为；配对并取得所需权限
- 步骤：记录 dd_manual_resolution 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_manual_resolution 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手动分辨率 的用户结果符合固定源码定义：Windows 主机配置 dd_manual_resolution 控制“手动分辨率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“手动分辨率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_manual_resolution 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-mode-remapping

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“分辨率/刷新率映射”原行为；配对并取得所需权限
- 步骤：记录 dd_mode_remapping 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_mode_remapping 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率/刷新率映射 的用户结果符合固定源码定义：Windows 主机配置 dd_mode_remapping 控制“分辨率/刷新率映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“分辨率/刷新率映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_mode_remapping 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-refresh-rate-option

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“刷新率匹配策略”原行为；配对并取得所需权限
- 步骤：记录 dd_refresh_rate_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_refresh_rate_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：刷新率匹配策略 的用户结果符合固定源码定义：Windows 主机配置 dd_refresh_rate_option 控制“刷新率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“刷新率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_refresh_rate_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-resolution-option

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“分辨率匹配策略”原行为；配对并取得所需权限
- 步骤：记录 dd_resolution_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_resolution_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率匹配策略 的用户结果符合固定源码定义：Windows 主机配置 dd_resolution_option 控制“分辨率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“分辨率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_resolution_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-dd-wa-hdr-toggle-delay

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“HDR切换延迟”原行为；配对并取得所需权限
- 步骤：记录 dd_wa_hdr_toggle_delay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_wa_hdr_toggle_delay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR切换延迟 的用户结果符合固定源码定义：Windows 主机配置 dd_wa_hdr_toggle_delay 控制“HDR切换延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“HDR切换延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_wa_hdr_toggle_delay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-ds4-back-as-touchpad-click

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“Back转触摸板点击”原行为；配对并取得所需权限
- 步骤：记录 ds4_back_as_touchpad_click 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 ds4_back_as_touchpad_click 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Back转触摸板点击 的用户结果符合固定源码定义：Windows 主机配置 ds4_back_as_touchpad_click 控制“Back转触摸板点击”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“Back转触摸板点击”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 ds4_back_as_touchpad_click 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-encode

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“硬件/软件编码与codec能力”原行为；配对并取得所需权限
- 步骤：执行“硬件/软件编码与codec能力”的操作并记录实际画面/音频/输入/管理结果；针对 encode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：硬件/软件编码与codec能力 的用户结果符合固定源码定义：硬件/软件编码与codec能力；保留“硬件/软件编码与codec能力”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 encode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-encoder

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“编码provider”原行为；配对并取得所需权限
- 步骤：记录 encoder 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 encoder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：编码provider 的用户结果符合固定源码定义：Windows 主机配置 encoder 控制“编码provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“编码provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 encoder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-external-ip

平台 helios-windows10；Phase 36；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“外网地址”原行为；配对并取得所需权限
- 步骤：记录 external_ip 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 external_ip 切换实例、断连重连及撤销权限，分别记录状态
- 期望：外网地址 的用户结果符合固定源码定义：Windows 主机配置 external_ip 控制“外网地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“外网地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 external_ip 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-fec-percentage

平台 helios-windows10；Phase 6；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“FEC冗余”原行为；配对并取得所需权限
- 步骤：记录 fec_percentage 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 fec_percentage 切换实例、断连重连及撤销权限，分别记录状态
- 期望：FEC冗余 的用户结果符合固定源码定义：Windows 主机配置 fec_percentage 控制“FEC冗余”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“FEC冗余”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 fec_percentage 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-file-apps

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“应用清单路径”原行为；配对并取得所需权限
- 步骤：记录 file_apps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 file_apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用清单路径 的用户结果符合固定源码定义：Windows 主机配置 file_apps 控制“应用清单路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“应用清单路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 file_apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-file-state

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“状态保存路径”原行为；配对并取得所需权限
- 步骤：记录 file_state 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 file_state 切换实例、断连重连及撤销权限，分别记录状态
- 期望：状态保存路径 的用户结果符合固定源码定义：Windows 主机配置 file_state 控制“状态保存路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“状态保存路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 file_state 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-gamepad

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“手柄类型”原行为；配对并取得所需权限
- 步骤：记录 gamepad 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄类型 的用户结果符合固定源码定义：Windows 主机配置 gamepad 控制“手柄类型”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“手柄类型”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-gamepad-driver

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“虚拟控制器provider选择”原行为；配对并取得所需权限
- 步骤：记录 gamepad_driver 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepad_driver 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟控制器provider选择 的用户结果符合固定源码定义：Windows 主机配置 gamepad_driver 控制“虚拟控制器provider选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“虚拟控制器provider选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepad_driver 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-global-prep-cmd

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“全局准备/清理命令”原行为；配对并取得所需权限
- 步骤：记录 global_prep_cmd 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 global_prep_cmd 切换实例、断连重连及撤销权限，分别记录状态
- 期望：全局准备/清理命令 的用户结果符合固定源码定义：Windows 主机配置 global_prep_cmd 控制“全局准备/清理命令”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“全局准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 global_prep_cmd 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-granular-permission

平台 helios-windows10；Phase 7；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“输入/查看/启动/剪切板/命令分级授权”原行为；配对并取得所需权限
- 步骤：执行“输入/查看/启动/剪切板/命令分级授权”的操作并记录实际画面/音频/输入/管理结果；针对 granular-permission 切换实例、断连重连及撤销权限，分别记录状态
- 期望：输入/查看/启动/剪切板/命令分级授权 的用户结果符合固定源码定义：输入/查看/启动/剪切板/命令分级授权；保留“输入/查看/启动/剪切板/命令分级授权”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 granular-permission 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-hevc-mode

平台 helios-windows10；Phase 14；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“HEVC协商策略”原行为；配对并取得所需权限
- 步骤：记录 hevc_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 hevc_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HEVC协商策略 的用户结果符合固定源码定义：Windows 主机配置 hevc_mode 控制“HEVC协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“HEVC协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-high-resolution-scrolling

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“高精度滚轮”原行为；配对并取得所需权限
- 步骤：记录 high_resolution_scrolling 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 high_resolution_scrolling 切换实例、断连重连及撤销权限，分别记录状态
- 期望：高精度滚轮 的用户结果符合固定源码定义：Windows 主机配置 high_resolution_scrolling 控制“高精度滚轮”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“高精度滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 high_resolution_scrolling 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-host-battery-consume

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器电池实际平台消费”原行为；配对并取得所需权限
- 步骤：执行“控制器电池实际平台消费”的操作并记录实际画面/音频/输入/管理结果；针对 host-battery-consume 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器电池实际平台消费 的用户结果符合固定源码定义：控制器电池实际平台消费；保留“控制器电池实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 host-battery-consume 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-host-motion-consume

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动实际平台消费”原行为；配对并取得所需权限
- 步骤：执行“控制器运动实际平台消费”的操作并记录实际画面/音频/输入/管理结果；针对 host-motion-consume 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动实际平台消费 的用户结果符合固定源码定义：控制器运动实际平台消费；保留“控制器运动实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 host-motion-consume 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-input-only

平台 helios-windows10；Phase 20；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“纯输入模式不启动音视频消费”原行为；配对并取得所需权限
- 步骤：执行“纯输入模式不启动音视频消费”的操作并记录实际画面/音频/输入/管理结果；针对 input-only 切换实例、断连重连及撤销权限，分别记录状态
- 期望：纯输入模式不启动音视频消费 的用户结果符合固定源码定义：纯输入模式不启动音视频消费；保留“纯输入模式不启动音视频消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 input-only 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-install-steam-audio-drivers

平台 helios-windows10；Phase 12；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“可选Steam音频驱动安装策略”原行为；配对并取得所需权限
- 步骤：记录 install_steam_audio_drivers 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 install_steam_audio_drivers 切换实例、断连重连及撤销权限，分别记录状态
- 期望：可选Steam音频驱动安装策略 的用户结果符合固定源码定义：Windows 主机配置 install_steam_audio_drivers 控制“可选Steam音频驱动安装策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“可选Steam音频驱动安装策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 install_steam_audio_drivers 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-key-repeat-delay

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“按键重复延迟”原行为；配对并取得所需权限
- 步骤：记录 key_repeat_delay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 key_repeat_delay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：按键重复延迟 的用户结果符合固定源码定义：Windows 主机配置 key_repeat_delay 控制“按键重复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“按键重复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 key_repeat_delay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-key-repeat-frequency

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“按键重复频率”原行为；配对并取得所需权限
- 步骤：记录 key_repeat_frequency 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 key_repeat_frequency 切换实例、断连重连及撤销权限，分别记录状态
- 期望：按键重复频率 的用户结果符合固定源码定义：Windows 主机配置 key_repeat_frequency 控制“按键重复频率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“按键重复频率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 key_repeat_frequency 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-key-rightalt-to-key-win

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“右Alt映射Win”原行为；配对并取得所需权限
- 步骤：记录 key_rightalt_to_key_win 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 key_rightalt_to_key_win 切换实例、断连重连及撤销权限，分别记录状态
- 期望：右Alt映射Win 的用户结果符合固定源码定义：Windows 主机配置 key_rightalt_to_key_win 控制“右Alt映射Win”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“右Alt映射Win”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 key_rightalt_to_key_win 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-keybindings

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“键位映射”原行为；配对并取得所需权限
- 步骤：记录 keybindings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keybindings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：键位映射 的用户结果符合固定源码定义：Windows 主机配置 keybindings 控制“键位映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“键位映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keybindings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-keyboard

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“键盘输入开关”原行为；配对并取得所需权限
- 步骤：记录 keyboard 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keyboard 切换实例、断连重连及撤销权限，分别记录状态
- 期望：键盘输入开关 的用户结果符合固定源码定义：Windows 主机配置 keyboard 控制“键盘输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“键盘输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keyboard 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-lan-encryption-mode

平台 helios-windows10；Phase 6；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“LAN加密策略”原行为；配对并取得所需权限
- 步骤：记录 lan_encryption_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 lan_encryption_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：LAN加密策略 的用户结果符合固定源码定义：Windows 主机配置 lan_encryption_mode 控制“LAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“LAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 lan_encryption_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-locale

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“管理语言”原行为；配对并取得所需权限
- 步骤：记录 locale 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 locale 切换实例、断连重连及撤销权限，分别记录状态
- 期望：管理语言 的用户结果符合固定源码定义：Windows 主机配置 locale 控制“管理语言”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“管理语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 locale 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-log-path

平台 helios-windows10；Phase 36；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“日志路径”原行为；配对并取得所需权限
- 步骤：记录 log_path 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 log_path 切换实例、断连重连及撤销权限，分别记录状态
- 期望：日志路径 的用户结果符合固定源码定义：Windows 主机配置 log_path 控制“日志路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“日志路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 log_path 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-manage

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Web管理/应用配置/凭据/日志”原行为；配对并取得所需权限
- 步骤：执行“Web管理/应用配置/凭据/日志”的操作并记录实际画面/音频/输入/管理结果；针对 manage 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Web管理/应用配置/凭据/日志 的用户结果符合固定源码定义：Web管理/应用配置/凭据/日志；保留“Web管理/应用配置/凭据/日志”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 manage 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-max-bitrate

平台 helios-windows10；Phase 23；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“主机最大码率”原行为；配对并取得所需权限
- 步骤：记录 max_bitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 max_bitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机最大码率 的用户结果符合固定源码定义：Windows 主机配置 max_bitrate 控制“主机最大码率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“主机最大码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 max_bitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-min-log-level

平台 helios-windows10；Phase 36；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“日志级别”原行为；配对并取得所需权限
- 步骤：记录 min_log_level 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 min_log_level 切换实例、断连重连及撤销权限，分别记录状态
- 期望：日志级别 的用户结果符合固定源码定义：Windows 主机配置 min_log_level 控制“日志级别”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“日志级别”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 min_log_level 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-min-threads

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“软件编码线程”原行为；配对并取得所需权限
- 步骤：记录 min_threads 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 min_threads 切换实例、断连重连及撤销权限，分别记录状态
- 期望：软件编码线程 的用户结果符合固定源码定义：Windows 主机配置 min_threads 控制“软件编码线程”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“软件编码线程”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 min_threads 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-minimum-fps-target

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“最小目标帧率”原行为；配对并取得所需权限
- 步骤：记录 minimum_fps_target 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 minimum_fps_target 切换实例、断连重连及撤销权限，分别记录状态
- 期望：最小目标帧率 的用户结果符合固定源码定义：Windows 主机配置 minimum_fps_target 控制“最小目标帧率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“最小目标帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 minimum_fps_target 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-motion-as-ds4

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“运动映射DS4”原行为；配对并取得所需权限
- 步骤：记录 motion_as_ds4 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 motion_as_ds4 切换实例、断连重连及撤销权限，分别记录状态
- 期望：运动映射DS4 的用户结果符合固定源码定义：Windows 主机配置 motion_as_ds4 控制“运动映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“运动映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 motion_as_ds4 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-mouse

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“鼠标输入开关”原行为；配对并取得所需权限
- 步骤：记录 mouse 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 mouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：鼠标输入开关 的用户结果符合固定源码定义：Windows 主机配置 mouse 控制“鼠标输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“鼠标输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 mouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-native-pen-touch

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“原生笔/触摸”原行为；配对并取得所需权限
- 步骤：记录 native_pen_touch 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 native_pen_touch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生笔/触摸 的用户结果符合固定源码定义：Windows 主机配置 native_pen_touch 控制“原生笔/触摸”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“原生笔/触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 native_pen_touch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-notify-pre-releases

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“预发布更新通知”原行为；配对并取得所需权限
- 步骤：记录 notify_pre_releases 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 notify_pre_releases 切换实例、断连重连及撤销权限，分别记录状态
- 期望：预发布更新通知 的用户结果符合固定源码定义：Windows 主机配置 notify_pre_releases 控制“预发布更新通知”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“预发布更新通知”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 notify_pre_releases 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-h264-cavlc

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_h264_cavlc”原行为；配对并取得所需权限
- 步骤：记录 nvenc_h264_cavlc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_h264_cavlc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_h264_cavlc 的用户结果符合固定源码定义：Windows 主机配置 nvenc_h264_cavlc 控制“nv后端参数 nvenc_h264_cavlc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_h264_cavlc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_h264_cavlc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-latency-over-power

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_latency_over_power”原行为；配对并取得所需权限
- 步骤：记录 nvenc_latency_over_power 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_latency_over_power 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_latency_over_power 的用户结果符合固定源码定义：Windows 主机配置 nvenc_latency_over_power 控制“nv后端参数 nvenc_latency_over_power”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_latency_over_power”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_latency_over_power 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-opengl-vulkan-on-dxgi

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_opengl_vulkan_on_dxgi”原行为；配对并取得所需权限
- 步骤：记录 nvenc_opengl_vulkan_on_dxgi 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_opengl_vulkan_on_dxgi 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_opengl_vulkan_on_dxgi 的用户结果符合固定源码定义：Windows 主机配置 nvenc_opengl_vulkan_on_dxgi 控制“nv后端参数 nvenc_opengl_vulkan_on_dxgi”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_opengl_vulkan_on_dxgi”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_opengl_vulkan_on_dxgi 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-preset

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_preset”原行为；配对并取得所需权限
- 步骤：记录 nvenc_preset 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_preset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_preset 的用户结果符合固定源码定义：Windows 主机配置 nvenc_preset 控制“nv后端参数 nvenc_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_preset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-realtime-hags

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_realtime_hags”原行为；配对并取得所需权限
- 步骤：记录 nvenc_realtime_hags 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_realtime_hags 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_realtime_hags 的用户结果符合固定源码定义：Windows 主机配置 nvenc_realtime_hags 控制“nv后端参数 nvenc_realtime_hags”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_realtime_hags”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_realtime_hags 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-spatial-aq

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_spatial_aq”原行为；配对并取得所需权限
- 步骤：记录 nvenc_spatial_aq 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_spatial_aq 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_spatial_aq 的用户结果符合固定源码定义：Windows 主机配置 nvenc_spatial_aq 控制“nv后端参数 nvenc_spatial_aq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_spatial_aq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_spatial_aq 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-split-encode

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_split_encode”原行为；配对并取得所需权限
- 步骤：记录 nvenc_split_encode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_split_encode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_split_encode 的用户结果符合固定源码定义：Windows 主机配置 nvenc_split_encode 控制“nv后端参数 nvenc_split_encode”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_split_encode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_split_encode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-twopass

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_twopass”原行为；配对并取得所需权限
- 步骤：记录 nvenc_twopass 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_twopass 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_twopass 的用户结果符合固定源码定义：Windows 主机配置 nvenc_twopass 控制“nv后端参数 nvenc_twopass”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_twopass”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_twopass 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-nvenc-vbv-increase

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_vbv_increase”原行为；配对并取得所需权限
- 步骤：记录 nvenc_vbv_increase 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_vbv_increase 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_vbv_increase 的用户结果符合固定源码定义：Windows 主机配置 nvenc_vbv_increase 控制“nv后端参数 nvenc_vbv_increase”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_vbv_increase”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_vbv_increase 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-old-auto-terminate

平台 helios-windows10；Phase 8；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“旧主机全部客户端断连时自动结束应用策略”原行为；配对并取得所需权限
- 步骤：执行“旧主机全部客户端断连时自动结束应用策略”的操作并记录实际画面/音频/输入/管理结果；针对 old-auto-terminate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：旧主机全部客户端断连时自动结束应用策略 的用户结果符合固定源码定义：旧主机全部客户端断连时自动结束应用策略；Aether覆盖旧自动结束策略：断开全部连接也不StopInstance；应用及显示组一直保留至用户显式停止
- 负例：拒绝 old-auto-terminate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-origin-web-ui-allowed

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“管理入口来源范围”原行为；配对并取得所需权限
- 步骤：记录 origin_web_ui_allowed 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 origin_web_ui_allowed 切换实例、断连重连及撤销权限，分别记录状态
- 期望：管理入口来源范围 的用户结果符合固定源码定义：Windows 主机配置 origin_web_ui_allowed 控制“管理入口来源范围”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“管理入口来源范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 origin_web_ui_allowed 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-output-name

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“物理显示器选择”原行为；配对并取得所需权限
- 步骤：记录 output_name 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 output_name 切换实例、断连重连及撤销权限，分别记录状态
- 期望：物理显示器选择 的用户结果符合固定源码定义：Windows 主机配置 output_name 控制“物理显示器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“物理显示器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 output_name 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-packetsize

平台 helios-windows10；Phase 6；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“媒体包大小”原行为；配对并取得所需权限
- 步骤：记录 packetsize 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 packetsize 切换实例、断连重连及撤销权限，分别记录状态
- 期望：媒体包大小 的用户结果符合固定源码定义：Windows 主机配置 packetsize 控制“媒体包大小”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“媒体包大小”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 packetsize 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-pair

平台 helios-windows10；Phase 7；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows配对/应用/恢复控制入口”原行为；配对并取得所需权限
- 步骤：执行“Windows配对/应用/恢复控制入口”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows配对/应用/恢复控制入口 的用户结果符合固定源码定义：Windows配对/应用/恢复控制入口；保留“Windows配对/应用/恢复控制入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-persistent-display-id

平台 helios-windows10；Phase 17；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“虚拟屏原固定客户端身份”原行为；配对并取得所需权限
- 步骤：执行“虚拟屏原固定客户端身份”的操作并记录实际画面/音频/输入/管理结果；针对 persistent-display-id 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟屏原固定客户端身份 的用户结果符合固定源码定义：虚拟屏原固定客户端身份；保留“虚拟屏原固定客户端身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 persistent-display-id 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-ping-timeout

平台 helios-windows10；Phase 6；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“连接保活截止时间”原行为；配对并取得所需权限
- 步骤：记录 ping_timeout 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 ping_timeout 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接保活截止时间 的用户结果符合固定源码定义：Windows 主机配置 ping_timeout 控制“连接保活截止时间”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“连接保活截止时间”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 ping_timeout 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-pkey

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“私钥路径”原行为；配对并取得所需权限
- 步骤：记录 pkey 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 pkey 切换实例、断连重连及撤销权限，分别记录状态
- 期望：私钥路径 的用户结果符合固定源码定义：Windows 主机配置 pkey 控制“私钥路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“私钥路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pkey 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-port

平台 helios-windows10；Phase 6；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“基础端口”原行为；配对并取得所需权限
- 步骤：记录 port 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 port 切换实例、断连重连及撤销权限，分别记录状态
- 期望：基础端口 的用户结果符合固定源码定义：Windows 主机配置 port 控制“基础端口”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“基础端口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 port 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-qp

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“编码量化参数”原行为；配对并取得所需权限
- 步骤：记录 qp 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qp 切换实例、断连重连及撤销权限，分别记录状态
- 期望：编码量化参数 的用户结果符合固定源码定义：Windows 主机配置 qp 控制“编码量化参数”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“编码量化参数”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qp 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-qsv-coder

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“qsv后端参数 qsv_coder”原行为；配对并取得所需权限
- 步骤：记录 qsv_coder 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qsv_coder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：qsv后端参数 qsv_coder 的用户结果符合固定源码定义：Windows 主机配置 qsv_coder 控制“qsv后端参数 qsv_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“qsv后端参数 qsv_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qsv_coder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-qsv-preset

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“qsv后端参数 qsv_preset”原行为；配对并取得所需权限
- 步骤：记录 qsv_preset 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qsv_preset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：qsv后端参数 qsv_preset 的用户结果符合固定源码定义：Windows 主机配置 qsv_preset 控制“qsv后端参数 qsv_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“qsv后端参数 qsv_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qsv_preset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-qsv-slow-hevc

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“qsv后端参数 qsv_slow_hevc”原行为；配对并取得所需权限
- 步骤：记录 qsv_slow_hevc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qsv_slow_hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：qsv后端参数 qsv_slow_hevc 的用户结果符合固定源码定义：Windows 主机配置 qsv_slow_hevc 控制“qsv后端参数 qsv_slow_hevc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“qsv后端参数 qsv_slow_hevc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qsv_slow_hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-read-stream

平台 helios-windows10；Phase 20；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“有View权限可加入已有应用/纯输入会话”原行为；配对并取得所需权限
- 步骤：执行“有View权限可加入已有应用/纯输入会话”的操作并记录实际画面/音频/输入/管理结果；针对 read-stream 切换实例、断连重连及撤销权限，分别记录状态
- 期望：有View权限可加入已有应用/纯输入会话 的用户结果符合固定源码定义：有View权限可加入已有应用/纯输入会话；保留“有View权限可加入已有应用/纯输入会话”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 read-stream 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-service

平台 helios-windows10；Phase 39；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows服务安装入口”原行为；配对并取得所需权限
- 步骤：执行“Windows服务安装入口”的操作并记录实际画面/音频/输入/管理结果；针对 service 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows服务安装入口 的用户结果符合固定源码定义：Windows服务安装入口；保留“Windows服务安装入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 service 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-stream-audio

平台 helios-windows10；Phase 12；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“音频传输开关”原行为；配对并取得所需权限
- 步骤：记录 stream_audio 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 stream_audio 切换实例、断连重连及撤销权限，分别记录状态
- 期望：音频传输开关 的用户结果符合固定源码定义：Windows 主机配置 stream_audio 控制“音频传输开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“音频传输开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 stream_audio 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-sunshine-name

平台 helios-windows10；Phase 27；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“主机名称”原行为；配对并取得所需权限
- 步骤：记录 sunshine_name 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 sunshine_name 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机名称 的用户结果符合固定源码定义：Windows 主机配置 sunshine_name 控制“主机名称”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“主机名称”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 sunshine_name 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-sw-preset

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“sw后端参数 sw_preset”原行为；配对并取得所需权限
- 步骤：记录 sw_preset 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 sw_preset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：sw后端参数 sw_preset 的用户结果符合固定源码定义：Windows 主机配置 sw_preset 控制“sw后端参数 sw_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“sw后端参数 sw_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 sw_preset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-sw-tune

平台 helios-windows10；Phase 13；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“sw后端参数 sw_tune”原行为；配对并取得所需权限
- 步骤：记录 sw_tune 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 sw_tune 切换实例、断连重连及撤销权限，分别记录状态
- 期望：sw后端参数 sw_tune 的用户结果符合固定源码定义：Windows 主机配置 sw_tune 控制“sw后端参数 sw_tune”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“sw后端参数 sw_tune”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 sw_tune 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-system-tray

平台 helios-windows10；Phase 39；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“系统托盘”原行为；配对并取得所需权限
- 步骤：记录 system_tray 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 system_tray 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统托盘 的用户结果符合固定源码定义：Windows 主机配置 system_tray 控制“系统托盘”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“系统托盘”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 system_tray 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-touchpad-as-ds4

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“触摸板映射DS4”原行为；配对并取得所需权限
- 步骤：记录 touchpad_as_ds4 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 touchpad_as_ds4 切换实例、断连重连及撤销权限，分别记录状态
- 期望：触摸板映射DS4 的用户结果符合固定源码定义：Windows 主机配置 touchpad_as_ds4 控制“触摸板映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“触摸板映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 touchpad_as_ds4 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-upnp

平台 helios-windows10；Phase 36；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“UPnP自动映射”原行为；配对并取得所需权限
- 步骤：记录 upnp 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 upnp 切换实例、断连重连及撤销权限，分别记录状态
- 期望：UPnP自动映射 的用户结果符合固定源码定义：Windows 主机配置 upnp 控制“UPnP自动映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“UPnP自动映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 upnp 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-virtual-sink

平台 helios-windows10；Phase 12；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“虚拟音频端点选择”原行为；配对并取得所需权限
- 步骤：记录 virtual_sink 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 virtual_sink 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟音频端点选择 的用户结果符合固定源码定义：Windows 主机配置 virtual_sink 控制“虚拟音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“虚拟音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 virtual_sink 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-virtualhid-randomize-mac

平台 helios-windows10；Phase 16；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“虚拟HID身份策略”原行为；配对并取得所需权限
- 步骤：记录 virtualhid_randomize_mac 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 virtualhid_randomize_mac 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟HID身份策略 的用户结果符合固定源码定义：Windows 主机配置 virtualhid_randomize_mac 控制“虚拟HID身份策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“虚拟HID身份策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 virtualhid_randomize_mac 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-wan-encryption-mode

平台 helios-windows10；Phase 6；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“WAN加密策略”原行为；配对并取得所需权限
- 步骤：记录 wan_encryption_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 wan_encryption_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：WAN加密策略 的用户结果符合固定源码定义：Windows 主机配置 wan_encryption_mode 控制“WAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“WAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wan_encryption_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-wgc

平台 helios-windows10；Phase 9；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows Graphics Capture候选捕获与失败状态”原行为；配对并取得所需权限
- 步骤：执行“Windows Graphics Capture候选捕获与失败状态”的操作并记录实际画面/音频/输入/管理结果；针对 wgc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows Graphics Capture候选捕获与失败状态 的用户结果符合固定源码定义：Windows Graphics Capture候选捕获与失败状态；保留“Windows Graphics Capture候选捕获与失败状态”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wgc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows10-windows-injection

平台 helios-windows10；Phase 11；planned，未执行。

- 前提：准备 Windows 10；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”原行为；配对并取得所需权限
- 步骤：执行“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”的操作并记录实际画面/音频/输入/管理结果；针对 windows-injection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider） 的用户结果符合固定源码定义：Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）；保留“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 windows-injection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-adapter-name

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“GPU适配器选择”原行为；配对并取得所需权限
- 步骤：记录 adapter_name 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 adapter_name 切换实例、断连重连及撤销权限，分别记录状态
- 期望：GPU适配器选择 的用户结果符合固定源码定义：Windows 主机配置 adapter_name 控制“GPU适配器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“GPU适配器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 adapter_name 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-address-family

平台 helios-windows11；Phase 36；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“IPv4/IPv6”原行为；配对并取得所需权限
- 步骤：记录 address_family 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 address_family 切换实例、断连重连及撤销权限，分别记录状态
- 期望：IPv4/IPv6 的用户结果符合固定源码定义：Windows 主机配置 address_family 控制“IPv4/IPv6”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“IPv4/IPv6”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 address_family 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-always-send-scancodes

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“扫描码策略”原行为；配对并取得所需权限
- 步骤：记录 always_send_scancodes 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 always_send_scancodes 切换实例、断连重连及撤销权限，分别记录状态
- 期望：扫描码策略 的用户结果符合固定源码定义：Windows 主机配置 always_send_scancodes 控制“扫描码策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“扫描码策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 always_send_scancodes 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-coder

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_coder”原行为；配对并取得所需权限
- 步骤：记录 amd_coder 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_coder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_coder 的用户结果符合固定源码定义：Windows 主机配置 amd_coder 控制“amd后端参数 amd_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_coder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-enforce-hrd

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_enforce_hrd”原行为；配对并取得所需权限
- 步骤：记录 amd_enforce_hrd 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_enforce_hrd 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_enforce_hrd 的用户结果符合固定源码定义：Windows 主机配置 amd_enforce_hrd 控制“amd后端参数 amd_enforce_hrd”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_enforce_hrd”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_enforce_hrd 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-max-au-size

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_max_au_size”原行为；配对并取得所需权限
- 步骤：记录 amd_max_au_size 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_max_au_size 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_max_au_size 的用户结果符合固定源码定义：Windows 主机配置 amd_max_au_size 控制“amd后端参数 amd_max_au_size”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_max_au_size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_max_au_size 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-preanalysis

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_preanalysis”原行为；配对并取得所需权限
- 步骤：记录 amd_preanalysis 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_preanalysis 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_preanalysis 的用户结果符合固定源码定义：Windows 主机配置 amd_preanalysis 控制“amd后端参数 amd_preanalysis”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_preanalysis”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_preanalysis 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-quality

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_quality”原行为；配对并取得所需权限
- 步骤：记录 amd_quality 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_quality 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_quality 的用户结果符合固定源码定义：Windows 主机配置 amd_quality 控制“amd后端参数 amd_quality”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_quality”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_quality 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-rc

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_rc”原行为；配对并取得所需权限
- 步骤：记录 amd_rc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_rc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_rc 的用户结果符合固定源码定义：Windows 主机配置 amd_rc 控制“amd后端参数 amd_rc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_rc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_rc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-usage

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_usage”原行为；配对并取得所需权限
- 步骤：记录 amd_usage 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_usage 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_usage 的用户结果符合固定源码定义：Windows 主机配置 amd_usage 控制“amd后端参数 amd_usage”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_usage”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_usage 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-amd-vbaq

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 AMD 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“amd后端参数 amd_vbaq”原行为；配对并取得所需权限
- 步骤：记录 amd_vbaq 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 amd_vbaq 切换实例、断连重连及撤销权限，分别记录状态
- 期望：amd后端参数 amd_vbaq 的用户结果符合固定源码定义：Windows 主机配置 amd_vbaq 控制“amd后端参数 amd_vbaq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“amd后端参数 amd_vbaq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 amd_vbaq 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-apps

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用进程/准备/清理命令”原行为；配对并取得所需权限
- 步骤：执行“应用进程/准备/清理命令”的操作并记录实际画面/音频/输入/管理结果；针对 apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用进程/准备/清理命令 的用户结果符合固定源码定义：应用进程/准备/清理命令；保留“应用进程/准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-audio

平台 helios-windows11；Phase 12；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows系统音频捕获与Opus”原行为；配对并取得所需权限
- 步骤：执行“Windows系统音频捕获与Opus”的操作并记录实际画面/音频/输入/管理结果；针对 audio 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows系统音频捕获与Opus 的用户结果符合固定源码定义：Windows系统音频捕获与Opus；保留“Windows系统音频捕获与Opus”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audio 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-audio-sink

平台 helios-windows11；Phase 12；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“系统音频端点选择”原行为；配对并取得所需权限
- 步骤：记录 audio_sink 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 audio_sink 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统音频端点选择 的用户结果符合固定源码定义：Windows 主机配置 audio_sink 控制“系统音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“系统音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audio_sink 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-av1-mode

平台 helios-windows11；Phase 14；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“AV1协商策略”原行为；配对并取得所需权限
- 步骤：记录 av1_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 av1_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AV1协商策略 的用户结果符合固定源码定义：Windows 主机配置 av1_mode 控制“AV1协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“AV1协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-back-button-timeout

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“Back长按策略”原行为；配对并取得所需权限
- 步骤：记录 back_button_timeout 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 back_button_timeout 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Back长按策略 的用户结果符合固定源码定义：Windows 主机配置 back_button_timeout 控制“Back长按策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“Back长按策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 back_button_timeout 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-bind-address

平台 helios-windows11；Phase 36；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“监听地址”原行为；配对并取得所需权限
- 步骤：记录 bind_address 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 bind_address 切换实例、断连重连及撤销权限，分别记录状态
- 期望：监听地址 的用户结果符合固定源码定义：Windows 主机配置 bind_address 控制“监听地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“监听地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 bind_address 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-capture

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“捕获provider”原行为；配对并取得所需权限
- 步骤：记录 capture 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 capture 切换实例、断连重连及撤销权限，分别记录状态
- 期望：捕获provider 的用户结果符合固定源码定义：Windows 主机配置 capture 控制“捕获provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“捕获provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 capture 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-capture-frame

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows物理显示器/GPU捕获”原行为；配对并取得所需权限
- 步骤：执行“Windows物理显示器/GPU捕获”的操作并记录实际画面/音频/输入/管理结果；针对 capture-frame 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows物理显示器/GPU捕获 的用户结果符合固定源码定义：Windows物理显示器/GPU捕获；保留“Windows物理显示器/GPU捕获”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 capture-frame 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-cert

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“证书路径”原行为；配对并取得所需权限
- 步骤：记录 cert 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 cert 切换实例、断连重连及撤销权限，分别记录状态
- 期望：证书路径 的用户结果符合固定源码定义：Windows 主机配置 cert 控制“证书路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“证书路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cert 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-clipboard

平台 helios-windows11；Phase 25；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“剪切板同步”原行为；配对并取得所需权限
- 步骤：执行“剪切板同步”的操作并记录实际画面/音频/输入/管理结果；针对 clipboard 切换实例、断连重连及撤销权限，分别记录状态
- 期望：剪切板同步 的用户结果符合固定源码定义：剪切板同步；保留“剪切板同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 clipboard 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-clipboard-permission

平台 helios-windows11；Phase 25；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“剪切板入站单独检查clipboard_set权限”原行为；配对并取得所需权限
- 步骤：执行“剪切板入站单独检查clipboard_set权限”的操作并记录实际画面/音频/输入/管理结果；针对 clipboard-permission 切换实例、断连重连及撤销权限，分别记录状态
- 期望：剪切板入站单独检查clipboard_set权限 的用户结果符合固定源码定义：剪切板入站单独检查clipboard_set权限；保留“剪切板入站单独检查clipboard_set权限”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 clipboard-permission 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-connection-hooks

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“连接/断连命令钩子”原行为；配对并取得所需权限
- 步骤：执行“连接/断连命令钩子”的操作并记录实际画面/音频/输入/管理结果；针对 connection-hooks 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接/断连命令钩子 的用户结果符合固定源码定义：连接/断连命令钩子；保留“连接/断连命令钩子”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 connection-hooks 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-controller

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“控制器输入开关”原行为；配对并取得所需权限
- 步骤：记录 controller 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器输入开关 的用户结果符合固定源码定义：Windows 主机配置 controller 控制“控制器输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“控制器输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-controller-motion

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动/触摸/电池消费”原行为；配对并取得所需权限
- 步骤：执行“控制器运动/触摸/电池消费”的操作并记录实际画面/音频/输入/管理结果；针对 controller-motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动/触摸/电池消费 的用户结果符合固定源码定义：控制器运动/触摸/电池消费；保留“控制器运动/触摸/电池消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-credentials-file

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“管理凭据路径”原行为；配对并取得所需权限
- 步骤：记录 credentials_file 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 credentials_file 切换实例、断连重连及撤销权限，分别记录状态
- 期望：管理凭据路径 的用户结果符合固定源码定义：Windows 主机配置 credentials_file 控制“管理凭据路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“管理凭据路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 credentials_file 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-csrf-allowed-origins

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“CSRF允许来源”原行为；配对并取得所需权限
- 步骤：记录 csrf_allowed_origins 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 csrf_allowed_origins 切换实例、断连重连及撤销权限，分别记录状态
- 期望：CSRF允许来源 的用户结果符合固定源码定义：Windows 主机配置 csrf_allowed_origins 控制“CSRF允许来源”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“CSRF允许来源”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 csrf_allowed_origins 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-config-revert-delay

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“显示恢复延迟”原行为；配对并取得所需权限
- 步骤：记录 dd_config_revert_delay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_config_revert_delay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：显示恢复延迟 的用户结果符合固定源码定义：Windows 主机配置 dd_config_revert_delay 控制“显示恢复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“显示恢复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_config_revert_delay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-config-revert-on-disconnect

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“断连恢复显示旧策略”原行为；配对并取得所需权限
- 步骤：记录 dd_config_revert_on_disconnect 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_config_revert_on_disconnect 切换实例、断连重连及撤销权限，分别记录状态
- 期望：断连恢复显示旧策略 的用户结果符合固定源码定义：Windows 主机配置 dd_config_revert_on_disconnect 控制“断连恢复显示旧策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；普通断连/切换保留实例显示组及拓扑；显式StopInstance才清理本组，旧自动恢复策略仅能作用于非实例拥有资源
- 负例：拒绝 dd_config_revert_on_disconnect 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-configuration-option

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“显示设备拓扑配置”原行为；配对并取得所需权限
- 步骤：记录 dd_configuration_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_configuration_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：显示设备拓扑配置 的用户结果符合固定源码定义：Windows 主机配置 dd_configuration_option 控制“显示设备拓扑配置”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“显示设备拓扑配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_configuration_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-hdr-option

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“显示HDR匹配”原行为；配对并取得所需权限
- 步骤：记录 dd_hdr_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_hdr_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：显示HDR匹配 的用户结果符合固定源码定义：Windows 主机配置 dd_hdr_option 控制“显示HDR匹配”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“显示HDR匹配”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_hdr_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-manual-refresh-rate

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“手动刷新率”原行为；配对并取得所需权限
- 步骤：记录 dd_manual_refresh_rate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_manual_refresh_rate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手动刷新率 的用户结果符合固定源码定义：Windows 主机配置 dd_manual_refresh_rate 控制“手动刷新率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“手动刷新率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_manual_refresh_rate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-manual-resolution

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“手动分辨率”原行为；配对并取得所需权限
- 步骤：记录 dd_manual_resolution 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_manual_resolution 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手动分辨率 的用户结果符合固定源码定义：Windows 主机配置 dd_manual_resolution 控制“手动分辨率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“手动分辨率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_manual_resolution 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-mode-remapping

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“分辨率/刷新率映射”原行为；配对并取得所需权限
- 步骤：记录 dd_mode_remapping 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_mode_remapping 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率/刷新率映射 的用户结果符合固定源码定义：Windows 主机配置 dd_mode_remapping 控制“分辨率/刷新率映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“分辨率/刷新率映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_mode_remapping 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-refresh-rate-option

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“刷新率匹配策略”原行为；配对并取得所需权限
- 步骤：记录 dd_refresh_rate_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_refresh_rate_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：刷新率匹配策略 的用户结果符合固定源码定义：Windows 主机配置 dd_refresh_rate_option 控制“刷新率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“刷新率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_refresh_rate_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-resolution-option

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“分辨率匹配策略”原行为；配对并取得所需权限
- 步骤：记录 dd_resolution_option 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_resolution_option 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率匹配策略 的用户结果符合固定源码定义：Windows 主机配置 dd_resolution_option 控制“分辨率匹配策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“分辨率匹配策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_resolution_option 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-dd-wa-hdr-toggle-delay

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“HDR切换延迟”原行为；配对并取得所需权限
- 步骤：记录 dd_wa_hdr_toggle_delay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 dd_wa_hdr_toggle_delay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR切换延迟 的用户结果符合固定源码定义：Windows 主机配置 dd_wa_hdr_toggle_delay 控制“HDR切换延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“HDR切换延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 dd_wa_hdr_toggle_delay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-ds4-back-as-touchpad-click

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“Back转触摸板点击”原行为；配对并取得所需权限
- 步骤：记录 ds4_back_as_touchpad_click 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 ds4_back_as_touchpad_click 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Back转触摸板点击 的用户结果符合固定源码定义：Windows 主机配置 ds4_back_as_touchpad_click 控制“Back转触摸板点击”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“Back转触摸板点击”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 ds4_back_as_touchpad_click 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-encode

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“硬件/软件编码与codec能力”原行为；配对并取得所需权限
- 步骤：执行“硬件/软件编码与codec能力”的操作并记录实际画面/音频/输入/管理结果；针对 encode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：硬件/软件编码与codec能力 的用户结果符合固定源码定义：硬件/软件编码与codec能力；保留“硬件/软件编码与codec能力”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 encode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-encoder

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“编码provider”原行为；配对并取得所需权限
- 步骤：记录 encoder 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 encoder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：编码provider 的用户结果符合固定源码定义：Windows 主机配置 encoder 控制“编码provider”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“编码provider”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 encoder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-external-ip

平台 helios-windows11；Phase 36；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“外网地址”原行为；配对并取得所需权限
- 步骤：记录 external_ip 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 external_ip 切换实例、断连重连及撤销权限，分别记录状态
- 期望：外网地址 的用户结果符合固定源码定义：Windows 主机配置 external_ip 控制“外网地址”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“外网地址”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 external_ip 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-fec-percentage

平台 helios-windows11；Phase 6；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“FEC冗余”原行为；配对并取得所需权限
- 步骤：记录 fec_percentage 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 fec_percentage 切换实例、断连重连及撤销权限，分别记录状态
- 期望：FEC冗余 的用户结果符合固定源码定义：Windows 主机配置 fec_percentage 控制“FEC冗余”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“FEC冗余”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 fec_percentage 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-file-apps

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“应用清单路径”原行为；配对并取得所需权限
- 步骤：记录 file_apps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 file_apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用清单路径 的用户结果符合固定源码定义：Windows 主机配置 file_apps 控制“应用清单路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“应用清单路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 file_apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-file-state

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“状态保存路径”原行为；配对并取得所需权限
- 步骤：记录 file_state 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 file_state 切换实例、断连重连及撤销权限，分别记录状态
- 期望：状态保存路径 的用户结果符合固定源码定义：Windows 主机配置 file_state 控制“状态保存路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“状态保存路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 file_state 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-gamepad

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“手柄类型”原行为；配对并取得所需权限
- 步骤：记录 gamepad 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄类型 的用户结果符合固定源码定义：Windows 主机配置 gamepad 控制“手柄类型”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“手柄类型”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-gamepad-driver

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“虚拟控制器provider选择”原行为；配对并取得所需权限
- 步骤：记录 gamepad_driver 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepad_driver 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟控制器provider选择 的用户结果符合固定源码定义：Windows 主机配置 gamepad_driver 控制“虚拟控制器provider选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“虚拟控制器provider选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepad_driver 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-global-prep-cmd

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“全局准备/清理命令”原行为；配对并取得所需权限
- 步骤：记录 global_prep_cmd 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 global_prep_cmd 切换实例、断连重连及撤销权限，分别记录状态
- 期望：全局准备/清理命令 的用户结果符合固定源码定义：Windows 主机配置 global_prep_cmd 控制“全局准备/清理命令”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“全局准备/清理命令”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 global_prep_cmd 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-granular-permission

平台 helios-windows11；Phase 7；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“输入/查看/启动/剪切板/命令分级授权”原行为；配对并取得所需权限
- 步骤：执行“输入/查看/启动/剪切板/命令分级授权”的操作并记录实际画面/音频/输入/管理结果；针对 granular-permission 切换实例、断连重连及撤销权限，分别记录状态
- 期望：输入/查看/启动/剪切板/命令分级授权 的用户结果符合固定源码定义：输入/查看/启动/剪切板/命令分级授权；保留“输入/查看/启动/剪切板/命令分级授权”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 granular-permission 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-hevc-mode

平台 helios-windows11；Phase 14；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“HEVC协商策略”原行为；配对并取得所需权限
- 步骤：记录 hevc_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 hevc_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HEVC协商策略 的用户结果符合固定源码定义：Windows 主机配置 hevc_mode 控制“HEVC协商策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“HEVC协商策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-high-resolution-scrolling

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“高精度滚轮”原行为；配对并取得所需权限
- 步骤：记录 high_resolution_scrolling 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 high_resolution_scrolling 切换实例、断连重连及撤销权限，分别记录状态
- 期望：高精度滚轮 的用户结果符合固定源码定义：Windows 主机配置 high_resolution_scrolling 控制“高精度滚轮”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“高精度滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 high_resolution_scrolling 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-host-battery-consume

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器电池实际平台消费”原行为；配对并取得所需权限
- 步骤：执行“控制器电池实际平台消费”的操作并记录实际画面/音频/输入/管理结果；针对 host-battery-consume 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器电池实际平台消费 的用户结果符合固定源码定义：控制器电池实际平台消费；保留“控制器电池实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 host-battery-consume 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-host-motion-consume

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动实际平台消费”原行为；配对并取得所需权限
- 步骤：执行“控制器运动实际平台消费”的操作并记录实际画面/音频/输入/管理结果；针对 host-motion-consume 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动实际平台消费 的用户结果符合固定源码定义：控制器运动实际平台消费；保留“控制器运动实际平台消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 host-motion-consume 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-input-only

平台 helios-windows11；Phase 20；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“纯输入模式不启动音视频消费”原行为；配对并取得所需权限
- 步骤：执行“纯输入模式不启动音视频消费”的操作并记录实际画面/音频/输入/管理结果；针对 input-only 切换实例、断连重连及撤销权限，分别记录状态
- 期望：纯输入模式不启动音视频消费 的用户结果符合固定源码定义：纯输入模式不启动音视频消费；保留“纯输入模式不启动音视频消费”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 input-only 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-install-steam-audio-drivers

平台 helios-windows11；Phase 12；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“可选Steam音频驱动安装策略”原行为；配对并取得所需权限
- 步骤：记录 install_steam_audio_drivers 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 install_steam_audio_drivers 切换实例、断连重连及撤销权限，分别记录状态
- 期望：可选Steam音频驱动安装策略 的用户结果符合固定源码定义：Windows 主机配置 install_steam_audio_drivers 控制“可选Steam音频驱动安装策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“可选Steam音频驱动安装策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 install_steam_audio_drivers 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-key-repeat-delay

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“按键重复延迟”原行为；配对并取得所需权限
- 步骤：记录 key_repeat_delay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 key_repeat_delay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：按键重复延迟 的用户结果符合固定源码定义：Windows 主机配置 key_repeat_delay 控制“按键重复延迟”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“按键重复延迟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 key_repeat_delay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-key-repeat-frequency

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“按键重复频率”原行为；配对并取得所需权限
- 步骤：记录 key_repeat_frequency 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 key_repeat_frequency 切换实例、断连重连及撤销权限，分别记录状态
- 期望：按键重复频率 的用户结果符合固定源码定义：Windows 主机配置 key_repeat_frequency 控制“按键重复频率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“按键重复频率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 key_repeat_frequency 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-key-rightalt-to-key-win

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“右Alt映射Win”原行为；配对并取得所需权限
- 步骤：记录 key_rightalt_to_key_win 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 key_rightalt_to_key_win 切换实例、断连重连及撤销权限，分别记录状态
- 期望：右Alt映射Win 的用户结果符合固定源码定义：Windows 主机配置 key_rightalt_to_key_win 控制“右Alt映射Win”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“右Alt映射Win”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 key_rightalt_to_key_win 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-keybindings

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“键位映射”原行为；配对并取得所需权限
- 步骤：记录 keybindings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keybindings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：键位映射 的用户结果符合固定源码定义：Windows 主机配置 keybindings 控制“键位映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“键位映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keybindings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-keyboard

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“键盘输入开关”原行为；配对并取得所需权限
- 步骤：记录 keyboard 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keyboard 切换实例、断连重连及撤销权限，分别记录状态
- 期望：键盘输入开关 的用户结果符合固定源码定义：Windows 主机配置 keyboard 控制“键盘输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“键盘输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keyboard 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-lan-encryption-mode

平台 helios-windows11；Phase 6；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“LAN加密策略”原行为；配对并取得所需权限
- 步骤：记录 lan_encryption_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 lan_encryption_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：LAN加密策略 的用户结果符合固定源码定义：Windows 主机配置 lan_encryption_mode 控制“LAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“LAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 lan_encryption_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-locale

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“管理语言”原行为；配对并取得所需权限
- 步骤：记录 locale 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 locale 切换实例、断连重连及撤销权限，分别记录状态
- 期望：管理语言 的用户结果符合固定源码定义：Windows 主机配置 locale 控制“管理语言”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“管理语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 locale 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-log-path

平台 helios-windows11；Phase 36；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“日志路径”原行为；配对并取得所需权限
- 步骤：记录 log_path 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 log_path 切换实例、断连重连及撤销权限，分别记录状态
- 期望：日志路径 的用户结果符合固定源码定义：Windows 主机配置 log_path 控制“日志路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“日志路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 log_path 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-manage

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Web管理/应用配置/凭据/日志”原行为；配对并取得所需权限
- 步骤：执行“Web管理/应用配置/凭据/日志”的操作并记录实际画面/音频/输入/管理结果；针对 manage 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Web管理/应用配置/凭据/日志 的用户结果符合固定源码定义：Web管理/应用配置/凭据/日志；保留“Web管理/应用配置/凭据/日志”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 manage 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-max-bitrate

平台 helios-windows11；Phase 23；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“主机最大码率”原行为；配对并取得所需权限
- 步骤：记录 max_bitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 max_bitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机最大码率 的用户结果符合固定源码定义：Windows 主机配置 max_bitrate 控制“主机最大码率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“主机最大码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 max_bitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-min-log-level

平台 helios-windows11；Phase 36；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“日志级别”原行为；配对并取得所需权限
- 步骤：记录 min_log_level 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 min_log_level 切换实例、断连重连及撤销权限，分别记录状态
- 期望：日志级别 的用户结果符合固定源码定义：Windows 主机配置 min_log_level 控制“日志级别”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“日志级别”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 min_log_level 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-min-threads

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“软件编码线程”原行为；配对并取得所需权限
- 步骤：记录 min_threads 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 min_threads 切换实例、断连重连及撤销权限，分别记录状态
- 期望：软件编码线程 的用户结果符合固定源码定义：Windows 主机配置 min_threads 控制“软件编码线程”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“软件编码线程”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 min_threads 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-minimum-fps-target

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“最小目标帧率”原行为；配对并取得所需权限
- 步骤：记录 minimum_fps_target 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 minimum_fps_target 切换实例、断连重连及撤销权限，分别记录状态
- 期望：最小目标帧率 的用户结果符合固定源码定义：Windows 主机配置 minimum_fps_target 控制“最小目标帧率”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“最小目标帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 minimum_fps_target 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-motion-as-ds4

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“运动映射DS4”原行为；配对并取得所需权限
- 步骤：记录 motion_as_ds4 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 motion_as_ds4 切换实例、断连重连及撤销权限，分别记录状态
- 期望：运动映射DS4 的用户结果符合固定源码定义：Windows 主机配置 motion_as_ds4 控制“运动映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“运动映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 motion_as_ds4 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-mouse

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“鼠标输入开关”原行为；配对并取得所需权限
- 步骤：记录 mouse 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 mouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：鼠标输入开关 的用户结果符合固定源码定义：Windows 主机配置 mouse 控制“鼠标输入开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“鼠标输入开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 mouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-native-pen-touch

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“原生笔/触摸”原行为；配对并取得所需权限
- 步骤：记录 native_pen_touch 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 native_pen_touch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生笔/触摸 的用户结果符合固定源码定义：Windows 主机配置 native_pen_touch 控制“原生笔/触摸”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“原生笔/触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 native_pen_touch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-notify-pre-releases

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“预发布更新通知”原行为；配对并取得所需权限
- 步骤：记录 notify_pre_releases 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 notify_pre_releases 切换实例、断连重连及撤销权限，分别记录状态
- 期望：预发布更新通知 的用户结果符合固定源码定义：Windows 主机配置 notify_pre_releases 控制“预发布更新通知”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“预发布更新通知”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 notify_pre_releases 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-h264-cavlc

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_h264_cavlc”原行为；配对并取得所需权限
- 步骤：记录 nvenc_h264_cavlc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_h264_cavlc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_h264_cavlc 的用户结果符合固定源码定义：Windows 主机配置 nvenc_h264_cavlc 控制“nv后端参数 nvenc_h264_cavlc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_h264_cavlc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_h264_cavlc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-latency-over-power

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_latency_over_power”原行为；配对并取得所需权限
- 步骤：记录 nvenc_latency_over_power 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_latency_over_power 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_latency_over_power 的用户结果符合固定源码定义：Windows 主机配置 nvenc_latency_over_power 控制“nv后端参数 nvenc_latency_over_power”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_latency_over_power”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_latency_over_power 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-opengl-vulkan-on-dxgi

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_opengl_vulkan_on_dxgi”原行为；配对并取得所需权限
- 步骤：记录 nvenc_opengl_vulkan_on_dxgi 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_opengl_vulkan_on_dxgi 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_opengl_vulkan_on_dxgi 的用户结果符合固定源码定义：Windows 主机配置 nvenc_opengl_vulkan_on_dxgi 控制“nv后端参数 nvenc_opengl_vulkan_on_dxgi”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_opengl_vulkan_on_dxgi”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_opengl_vulkan_on_dxgi 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-preset

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_preset”原行为；配对并取得所需权限
- 步骤：记录 nvenc_preset 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_preset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_preset 的用户结果符合固定源码定义：Windows 主机配置 nvenc_preset 控制“nv后端参数 nvenc_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_preset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-realtime-hags

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_realtime_hags”原行为；配对并取得所需权限
- 步骤：记录 nvenc_realtime_hags 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_realtime_hags 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_realtime_hags 的用户结果符合固定源码定义：Windows 主机配置 nvenc_realtime_hags 控制“nv后端参数 nvenc_realtime_hags”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_realtime_hags”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_realtime_hags 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-spatial-aq

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_spatial_aq”原行为；配对并取得所需权限
- 步骤：记录 nvenc_spatial_aq 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_spatial_aq 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_spatial_aq 的用户结果符合固定源码定义：Windows 主机配置 nvenc_spatial_aq 控制“nv后端参数 nvenc_spatial_aq”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_spatial_aq”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_spatial_aq 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-split-encode

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_split_encode”原行为；配对并取得所需权限
- 步骤：记录 nvenc_split_encode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_split_encode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_split_encode 的用户结果符合固定源码定义：Windows 主机配置 nvenc_split_encode 控制“nv后端参数 nvenc_split_encode”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_split_encode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_split_encode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-twopass

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_twopass”原行为；配对并取得所需权限
- 步骤：记录 nvenc_twopass 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_twopass 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_twopass 的用户结果符合固定源码定义：Windows 主机配置 nvenc_twopass 控制“nv后端参数 nvenc_twopass”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_twopass”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_twopass 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-nvenc-vbv-increase

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 NVIDIA 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“nv后端参数 nvenc_vbv_increase”原行为；配对并取得所需权限
- 步骤：记录 nvenc_vbv_increase 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 nvenc_vbv_increase 切换实例、断连重连及撤销权限，分别记录状态
- 期望：nv后端参数 nvenc_vbv_increase 的用户结果符合固定源码定义：Windows 主机配置 nvenc_vbv_increase 控制“nv后端参数 nvenc_vbv_increase”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“nv后端参数 nvenc_vbv_increase”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 nvenc_vbv_increase 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-old-auto-terminate

平台 helios-windows11；Phase 8；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“旧主机全部客户端断连时自动结束应用策略”原行为；配对并取得所需权限
- 步骤：执行“旧主机全部客户端断连时自动结束应用策略”的操作并记录实际画面/音频/输入/管理结果；针对 old-auto-terminate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：旧主机全部客户端断连时自动结束应用策略 的用户结果符合固定源码定义：旧主机全部客户端断连时自动结束应用策略；Aether覆盖旧自动结束策略：断开全部连接也不StopInstance；应用及显示组一直保留至用户显式停止
- 负例：拒绝 old-auto-terminate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-origin-web-ui-allowed

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“管理入口来源范围”原行为；配对并取得所需权限
- 步骤：记录 origin_web_ui_allowed 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 origin_web_ui_allowed 切换实例、断连重连及撤销权限，分别记录状态
- 期望：管理入口来源范围 的用户结果符合固定源码定义：Windows 主机配置 origin_web_ui_allowed 控制“管理入口来源范围”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“管理入口来源范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 origin_web_ui_allowed 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-output-name

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“物理显示器选择”原行为；配对并取得所需权限
- 步骤：记录 output_name 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 output_name 切换实例、断连重连及撤销权限，分别记录状态
- 期望：物理显示器选择 的用户结果符合固定源码定义：Windows 主机配置 output_name 控制“物理显示器选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“物理显示器选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 output_name 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-packetsize

平台 helios-windows11；Phase 6；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“媒体包大小”原行为；配对并取得所需权限
- 步骤：记录 packetsize 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 packetsize 切换实例、断连重连及撤销权限，分别记录状态
- 期望：媒体包大小 的用户结果符合固定源码定义：Windows 主机配置 packetsize 控制“媒体包大小”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“媒体包大小”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 packetsize 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-pair

平台 helios-windows11；Phase 7；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows配对/应用/恢复控制入口”原行为；配对并取得所需权限
- 步骤：执行“Windows配对/应用/恢复控制入口”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows配对/应用/恢复控制入口 的用户结果符合固定源码定义：Windows配对/应用/恢复控制入口；保留“Windows配对/应用/恢复控制入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-persistent-display-id

平台 helios-windows11；Phase 17；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“虚拟屏原固定客户端身份”原行为；配对并取得所需权限
- 步骤：执行“虚拟屏原固定客户端身份”的操作并记录实际画面/音频/输入/管理结果；针对 persistent-display-id 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟屏原固定客户端身份 的用户结果符合固定源码定义：虚拟屏原固定客户端身份；保留“虚拟屏原固定客户端身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 persistent-display-id 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-ping-timeout

平台 helios-windows11；Phase 6；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“连接保活截止时间”原行为；配对并取得所需权限
- 步骤：记录 ping_timeout 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 ping_timeout 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接保活截止时间 的用户结果符合固定源码定义：Windows 主机配置 ping_timeout 控制“连接保活截止时间”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“连接保活截止时间”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 ping_timeout 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-pkey

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“私钥路径”原行为；配对并取得所需权限
- 步骤：记录 pkey 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 pkey 切换实例、断连重连及撤销权限，分别记录状态
- 期望：私钥路径 的用户结果符合固定源码定义：Windows 主机配置 pkey 控制“私钥路径”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“私钥路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pkey 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-port

平台 helios-windows11；Phase 6；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“基础端口”原行为；配对并取得所需权限
- 步骤：记录 port 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 port 切换实例、断连重连及撤销权限，分别记录状态
- 期望：基础端口 的用户结果符合固定源码定义：Windows 主机配置 port 控制“基础端口”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“基础端口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 port 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-qp

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“编码量化参数”原行为；配对并取得所需权限
- 步骤：记录 qp 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qp 切换实例、断连重连及撤销权限，分别记录状态
- 期望：编码量化参数 的用户结果符合固定源码定义：Windows 主机配置 qp 控制“编码量化参数”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“编码量化参数”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qp 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-qsv-coder

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“qsv后端参数 qsv_coder”原行为；配对并取得所需权限
- 步骤：记录 qsv_coder 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qsv_coder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：qsv后端参数 qsv_coder 的用户结果符合固定源码定义：Windows 主机配置 qsv_coder 控制“qsv后端参数 qsv_coder”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“qsv后端参数 qsv_coder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qsv_coder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-qsv-preset

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“qsv后端参数 qsv_preset”原行为；配对并取得所需权限
- 步骤：记录 qsv_preset 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qsv_preset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：qsv后端参数 qsv_preset 的用户结果符合固定源码定义：Windows 主机配置 qsv_preset 控制“qsv后端参数 qsv_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“qsv后端参数 qsv_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qsv_preset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-qsv-slow-hevc

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 分别需要 Intel 硬件/驱动/编码会话；可用参数待目标设备实测；使用固定参考提交核对“qsv后端参数 qsv_slow_hevc”原行为；配对并取得所需权限
- 步骤：记录 qsv_slow_hevc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 qsv_slow_hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：qsv后端参数 qsv_slow_hevc 的用户结果符合固定源码定义：Windows 主机配置 qsv_slow_hevc 控制“qsv后端参数 qsv_slow_hevc”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“qsv后端参数 qsv_slow_hevc”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 qsv_slow_hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-read-stream

平台 helios-windows11；Phase 20；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“有View权限可加入已有应用/纯输入会话”原行为；配对并取得所需权限
- 步骤：执行“有View权限可加入已有应用/纯输入会话”的操作并记录实际画面/音频/输入/管理结果；针对 read-stream 切换实例、断连重连及撤销权限，分别记录状态
- 期望：有View权限可加入已有应用/纯输入会话 的用户结果符合固定源码定义：有View权限可加入已有应用/纯输入会话；保留“有View权限可加入已有应用/纯输入会话”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 read-stream 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-service

平台 helios-windows11；Phase 39；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows服务安装入口”原行为；配对并取得所需权限
- 步骤：执行“Windows服务安装入口”的操作并记录实际画面/音频/输入/管理结果；针对 service 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows服务安装入口 的用户结果符合固定源码定义：Windows服务安装入口；保留“Windows服务安装入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 service 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-stream-audio

平台 helios-windows11；Phase 12；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“音频传输开关”原行为；配对并取得所需权限
- 步骤：记录 stream_audio 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 stream_audio 切换实例、断连重连及撤销权限，分别记录状态
- 期望：音频传输开关 的用户结果符合固定源码定义：Windows 主机配置 stream_audio 控制“音频传输开关”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“音频传输开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 stream_audio 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-sunshine-name

平台 helios-windows11；Phase 27；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“主机名称”原行为；配对并取得所需权限
- 步骤：记录 sunshine_name 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 sunshine_name 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机名称 的用户结果符合固定源码定义：Windows 主机配置 sunshine_name 控制“主机名称”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“主机名称”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 sunshine_name 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-sw-preset

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“sw后端参数 sw_preset”原行为；配对并取得所需权限
- 步骤：记录 sw_preset 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 sw_preset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：sw后端参数 sw_preset 的用户结果符合固定源码定义：Windows 主机配置 sw_preset 控制“sw后端参数 sw_preset”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“sw后端参数 sw_preset”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 sw_preset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-sw-tune

平台 helios-windows11；Phase 13；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“sw后端参数 sw_tune”原行为；配对并取得所需权限
- 步骤：记录 sw_tune 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 sw_tune 切换实例、断连重连及撤销权限，分别记录状态
- 期望：sw后端参数 sw_tune 的用户结果符合固定源码定义：Windows 主机配置 sw_tune 控制“sw后端参数 sw_tune”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“sw后端参数 sw_tune”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 sw_tune 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-system-tray

平台 helios-windows11；Phase 39；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“系统托盘”原行为；配对并取得所需权限
- 步骤：记录 system_tray 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 system_tray 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统托盘 的用户结果符合固定源码定义：Windows 主机配置 system_tray 控制“系统托盘”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“系统托盘”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 system_tray 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-touchpad-as-ds4

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“触摸板映射DS4”原行为；配对并取得所需权限
- 步骤：记录 touchpad_as_ds4 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 touchpad_as_ds4 切换实例、断连重连及撤销权限，分别记录状态
- 期望：触摸板映射DS4 的用户结果符合固定源码定义：Windows 主机配置 touchpad_as_ds4 控制“触摸板映射DS4”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“触摸板映射DS4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 touchpad_as_ds4 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-upnp

平台 helios-windows11；Phase 36；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“UPnP自动映射”原行为；配对并取得所需权限
- 步骤：记录 upnp 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 upnp 切换实例、断连重连及撤销权限，分别记录状态
- 期望：UPnP自动映射 的用户结果符合固定源码定义：Windows 主机配置 upnp 控制“UPnP自动映射”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“UPnP自动映射”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 upnp 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-virtual-sink

平台 helios-windows11；Phase 12；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“虚拟音频端点选择”原行为；配对并取得所需权限
- 步骤：记录 virtual_sink 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 virtual_sink 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟音频端点选择 的用户结果符合固定源码定义：Windows 主机配置 virtual_sink 控制“虚拟音频端点选择”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“虚拟音频端点选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 virtual_sink 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-virtualhid-randomize-mac

平台 helios-windows11；Phase 16；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“虚拟HID身份策略”原行为；配对并取得所需权限
- 步骤：记录 virtualhid_randomize_mac 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 virtualhid_randomize_mac 切换实例、断连重连及撤销权限，分别记录状态
- 期望：虚拟HID身份策略 的用户结果符合固定源码定义：Windows 主机配置 virtualhid_randomize_mac 控制“虚拟HID身份策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“虚拟HID身份策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 virtualhid_randomize_mac 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-wan-encryption-mode

平台 helios-windows11；Phase 6；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 Windows交互登录桌面及适用provider；驱动/签名仍未核验；使用固定参考提交核对“WAN加密策略”原行为；配对并取得所需权限
- 步骤：记录 wan_encryption_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 wan_encryption_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：WAN加密策略 的用户结果符合固定源码定义：Windows 主机配置 wan_encryption_mode 控制“WAN加密策略”；实际取值/转换来自固定 config.cpp；可用范围按对应后端；保留“WAN加密策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wan_encryption_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-wgc

平台 helios-windows11；Phase 9；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows Graphics Capture候选捕获与失败状态”原行为；配对并取得所需权限
- 步骤：执行“Windows Graphics Capture候选捕获与失败状态”的操作并记录实际画面/音频/输入/管理结果；针对 wgc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows Graphics Capture候选捕获与失败状态 的用户结果符合固定源码定义：Windows Graphics Capture候选捕获与失败状态；保留“Windows Graphics Capture候选捕获与失败状态”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wgc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-helios-windows11-windows-injection

平台 helios-windows11；Phase 11；planned，未执行。

- 前提：准备 Windows 11；最低 build 待 Phase3–5 原型 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”原行为；配对并取得所需权限
- 步骤：执行“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”的操作并记录实际画面/音频/输入/管理结果；针对 windows-injection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider） 的用户结果符合固定源码定义：Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）；保留“Windows键鼠/笔/触摸虚拟HID注入（Windows选择provider）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 windows-injection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-analog-scrolling

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“模拟摇杆滚轮轴”原行为；配对并取得所需权限
- 步骤：记录 analog_scrolling 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 analog_scrolling 切换实例、断连重连及撤销权限，分别记录状态
- 期望：模拟摇杆滚轮轴 的用户结果符合固定源码定义：用户可配置 analog_scrolling：模拟摇杆滚轮轴；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“模拟摇杆滚轮轴”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 analog_scrolling 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-apk-abis

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android原APK/ABI构建入口”原行为；配对并取得所需权限
- 步骤：执行“Android原APK/ABI构建入口”的操作并记录实际画面/音频/输入/管理结果；针对 apk-abis 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android原APK/ABI构建入口 的用户结果符合固定源码定义：Android原APK/ABI构建入口；保留“Android原APK/ABI构建入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 apk-abis 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-apps

平台 selene-android；Phase 27；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android应用列表/封面/恢复/退出”原行为；配对并取得所需权限
- 步骤：执行“Android应用列表/封面/恢复/退出”的操作并记录实际画面/音频/输入/管理结果；针对 apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android应用列表/封面/恢复/退出 的用户结果符合固定源码定义：Android应用列表/封面/恢复/退出；保留“Android应用列表/封面/恢复/退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-audio-route

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android音频输出声道/焦点/设备”原行为；配对并取得所需权限
- 步骤：执行“Android音频输出声道/焦点/设备”的操作并记录实际画面/音频/输入/管理结果；针对 audio-route 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android音频输出声道/焦点/设备 的用户结果符合固定源码定义：Android音频输出声道/焦点/设备；保留“Android音频输出声道/焦点/设备”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audio-route 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-av1

平台 selene-android；Phase 14；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件；使用固定参考提交核对“Android AV1解码与能力查询”原行为；配对并取得所需权限
- 步骤：执行“Android AV1解码与能力查询”的操作并记录实际画面/音频/输入/管理结果；针对 av1 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android AV1解码与能力查询 的用户结果符合固定源码定义：Android AV1解码与能力查询；保留“Android AV1解码与能力查询”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-battery

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器电池/Android S API分支”原行为；配对并取得所需权限
- 步骤：执行“控制器电池/Android S API分支”的操作并记录实际画面/音频/输入/管理结果；针对 battery 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器电池/Android S API分支 的用户结果符合固定源码定义：控制器电池/Android S API分支；保留“控制器电池/Android S API分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 battery 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-absolute-mouse-mode

平台 selene-android；Phase 11；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“绝对鼠标”原行为；配对并取得所需权限
- 步骤：记录 checkbox_absolute_mouse_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_absolute_mouse_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：绝对鼠标 的用户结果符合固定源码定义：用户可配置 checkbox_absolute_mouse_mode：绝对鼠标；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_absolute_mouse_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-disable-warnings

平台 selene-android；Phase 27；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“警告展示开关”原行为；配对并取得所需权限
- 步骤：记录 checkbox_disable_warnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_disable_warnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：警告展示开关 的用户结果符合固定源码定义：用户可配置 checkbox_disable_warnings：警告展示开关；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“警告展示开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_disable_warnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-enable-audiofx

平台 selene-android；Phase 12；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android音频效果”原行为；配对并取得所需权限
- 步骤：记录 checkbox_enable_audiofx 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_enable_audiofx 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android音频效果 的用户结果符合固定源码定义：用户可配置 checkbox_enable_audiofx：Android音频效果；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“Android音频效果”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_enable_audiofx 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-enable-hdr

平台 selene-android；Phase 15；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“HDR”原行为；配对并取得所需权限
- 步骤：记录 checkbox_enable_hdr 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_enable_hdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR 的用户结果符合固定源码定义：用户可配置 checkbox_enable_hdr：HDR；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“HDR”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_enable_hdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-enable-perf-overlay

平台 selene-android；Phase 36；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“性能叠层”原行为；配对并取得所需权限
- 步骤：记录 checkbox_enable_perf_overlay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_enable_perf_overlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：性能叠层 的用户结果符合固定源码定义：用户可配置 checkbox_enable_perf_overlay：性能叠层；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“性能叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_enable_perf_overlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-enable-pip

平台 selene-android；Phase 29；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“画中画”原行为；配对并取得所需权限
- 步骤：记录 checkbox_enable_pip 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_enable_pip 切换实例、断连重连及撤销权限，分别记录状态
- 期望：画中画 的用户结果符合固定源码定义：用户可配置 checkbox_enable_pip：画中画；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“画中画”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_enable_pip 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-enable-post-stream-toast

平台 selene-android；Phase 36；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“结束后延迟统计”原行为；配对并取得所需权限
- 步骤：记录 checkbox_enable_post_stream_toast 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_enable_post_stream_toast 切换实例、断连重连及撤销权限，分别记录状态
- 期望：结束后延迟统计 的用户结果符合固定源码定义：用户可配置 checkbox_enable_post_stream_toast：结束后延迟统计；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“结束后延迟统计”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_enable_post_stream_toast 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-enable-sops

平台 selene-android；Phase 27；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机游戏优化”原行为；配对并取得所需权限
- 步骤：记录 checkbox_enable_sops 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_enable_sops 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机游戏优化 的用户结果符合固定源码定义：用户可配置 checkbox_enable_sops：主机游戏优化；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_enable_sops 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-flip-face-buttons

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“AB/XY交换”原行为；配对并取得所需权限
- 步骤：记录 checkbox_flip_face_buttons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_flip_face_buttons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AB/XY交换 的用户结果符合固定源码定义：用户可配置 checkbox_flip_face_buttons：AB/XY交换；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_flip_face_buttons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-full-range

平台 selene-android；Phase 15；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“全/有限色彩范围”原行为；配对并取得所需权限
- 步骤：记录 checkbox_full_range 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_full_range 切换实例、断连重连及撤销权限，分别记录状态
- 期望：全/有限色彩范围 的用户结果符合固定源码定义：用户可配置 checkbox_full_range：全/有限色彩范围；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“全/有限色彩范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_full_range 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-gamepad-motion-fallback

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手机运动传感器回退”原行为；配对并取得所需权限
- 步骤：记录 checkbox_gamepad_motion_fallback 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_gamepad_motion_fallback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手机运动传感器回退 的用户结果符合固定源码定义：用户可配置 checkbox_gamepad_motion_fallback：手机运动传感器回退；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“手机运动传感器回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_gamepad_motion_fallback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-gamepad-motion-sensors

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄运动传感器”原行为；配对并取得所需权限
- 步骤：记录 checkbox_gamepad_motion_sensors 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_gamepad_motion_sensors 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄运动传感器 的用户结果符合固定源码定义：用户可配置 checkbox_gamepad_motion_sensors：手柄运动传感器；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“手柄运动传感器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_gamepad_motion_sensors 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-gamepad-touchpad-as-mouse

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄触摸板鼠标”原行为；配对并取得所需权限
- 步骤：记录 checkbox_gamepad_touchpad_as_mouse 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_gamepad_touchpad_as_mouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄触摸板鼠标 的用户结果符合固定源码定义：用户可配置 checkbox_gamepad_touchpad_as_mouse：手柄触摸板鼠标；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“手柄触摸板鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_gamepad_touchpad_as_mouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-host-audio

平台 selene-android；Phase 12；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机播放音频”原行为；配对并取得所需权限
- 步骤：记录 checkbox_host_audio 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_host_audio 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机播放音频 的用户结果符合固定源码定义：用户可配置 checkbox_host_audio：主机播放音频；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“主机播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_host_audio 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-mouse-emulation

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄鼠标模拟”原行为；配对并取得所需权限
- 步骤：记录 checkbox_mouse_emulation 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_mouse_emulation 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄鼠标模拟 的用户结果符合固定源码定义：用户可配置 checkbox_mouse_emulation：手柄鼠标模拟；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_mouse_emulation 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-mouse-nav-buttons

平台 selene-android；Phase 11；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“鼠标前进/后退键”原行为；配对并取得所需权限
- 步骤：记录 checkbox_mouse_nav_buttons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_mouse_nav_buttons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：鼠标前进/后退键 的用户结果符合固定源码定义：用户可配置 checkbox_mouse_nav_buttons：鼠标前进/后退键；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“鼠标前进/后退键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_mouse_nav_buttons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-multi-controller

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多控制器”原行为；配对并取得所需权限
- 步骤：记录 checkbox_multi_controller 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_multi_controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多控制器 的用户结果符合固定源码定义：用户可配置 checkbox_multi_controller：多控制器；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“多控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_multi_controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-only-show-l3r3

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕只显示L3/R3”原行为；配对并取得所需权限
- 步骤：记录 checkbox_only_show_L3R3 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_only_show_L3R3 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕只显示L3/R3 的用户结果符合固定源码定义：用户可配置 checkbox_only_show_L3R3：屏幕只显示L3/R3；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“屏幕只显示L3/R3”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_only_show_L3R3 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-reduce-refresh-rate

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“降低屏幕刷新率匹配”原行为；配对并取得所需权限
- 步骤：记录 checkbox_reduce_refresh_rate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_reduce_refresh_rate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：降低屏幕刷新率匹配 的用户结果符合固定源码定义：用户可配置 checkbox_reduce_refresh_rate：降低屏幕刷新率匹配；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“降低屏幕刷新率匹配”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_reduce_refresh_rate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-show-guide-button

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕Guide按钮”原行为；配对并取得所需权限
- 步骤：记录 checkbox_show_guide_button 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_show_guide_button 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕Guide按钮 的用户结果符合固定源码定义：用户可配置 checkbox_show_guide_button：屏幕Guide按钮；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“屏幕Guide按钮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_show_guide_button 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-show-onscreen-controls

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕控制器”原行为；配对并取得所需权限
- 步骤：记录 checkbox_show_onscreen_controls 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_show_onscreen_controls 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕控制器 的用户结果符合固定源码定义：用户可配置 checkbox_show_onscreen_controls：屏幕控制器；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“屏幕控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_show_onscreen_controls 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-small-icon-mode

平台 selene-android；Phase 27；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“小图标列表”原行为；配对并取得所需权限
- 步骤：记录 checkbox_small_icon_mode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_small_icon_mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：小图标列表 的用户结果符合固定源码定义：用户可配置 checkbox_small_icon_mode：小图标列表；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“小图标列表”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_small_icon_mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-stretch-video

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“拉伸视频”原行为；配对并取得所需权限
- 步骤：记录 checkbox_stretch_video 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_stretch_video 切换实例、断连重连及撤销权限，分别记录状态
- 期望：拉伸视频 的用户结果符合固定源码定义：用户可配置 checkbox_stretch_video：拉伸视频；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“拉伸视频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_stretch_video 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-touchscreen-trackpad

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“相对/绝对触摸”原行为；配对并取得所需权限
- 步骤：记录 checkbox_touchscreen_trackpad 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_touchscreen_trackpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：相对/绝对触摸 的用户结果符合固定源码定义：用户可配置 checkbox_touchscreen_trackpad：相对/绝对触摸；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“相对/绝对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_touchscreen_trackpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-unlock-fps

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“解锁高帧率”原行为；配对并取得所需权限
- 步骤：记录 checkbox_unlock_fps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_unlock_fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：解锁高帧率 的用户结果符合固定源码定义：用户可配置 checkbox_unlock_fps：解锁高帧率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“解锁高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_unlock_fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-usb-bind-all

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“USB设备接管范围”原行为；配对并取得所需权限
- 步骤：记录 checkbox_usb_bind_all 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_usb_bind_all 切换实例、断连重连及撤销权限，分别记录状态
- 期望：USB设备接管范围 的用户结果符合固定源码定义：用户可配置 checkbox_usb_bind_all：USB设备接管范围；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“USB设备接管范围”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_usb_bind_all 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-usb-driver

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“USB控制器驱动”原行为；配对并取得所需权限
- 步骤：记录 checkbox_usb_driver 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_usb_driver 切换实例、断连重连及撤销权限，分别记录状态
- 期望：USB控制器驱动 的用户结果符合固定源码定义：用户可配置 checkbox_usb_driver：USB控制器驱动；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“USB控制器驱动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_usb_driver 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-vibrate-fallback

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“机身震动回退”原行为；配对并取得所需权限
- 步骤：记录 checkbox_vibrate_fallback 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_vibrate_fallback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：机身震动回退 的用户结果符合固定源码定义：用户可配置 checkbox_vibrate_fallback：机身震动回退；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“机身震动回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_vibrate_fallback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-checkbox-vibrate-osc

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕控制器震动”原行为；配对并取得所需权限
- 步骤：记录 checkbox_vibrate_osc 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 checkbox_vibrate_osc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕控制器震动 的用户结果符合固定源码定义：用户可配置 checkbox_vibrate_osc：屏幕控制器震动；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“屏幕控制器震动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 checkbox_vibrate_osc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-frame-pacing

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧节奏策略”原行为；配对并取得所需权限
- 步骤：记录 frame_pacing 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 frame_pacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧节奏策略 的用户结果符合固定源码定义：用户可配置 frame_pacing：帧节奏策略；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“帧节奏策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 frame_pacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-h264

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件；使用固定参考提交核对“Android H.264解码”原行为；配对并取得所需权限
- 步骤：执行“Android H.264解码”的操作并记录实际画面/音频/输入/管理结果；针对 h264 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android H.264解码 的用户结果符合固定源码定义：Android H.264解码；保留“Android H.264解码”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 h264 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-hevc

平台 selene-android；Phase 14；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 MediaCodec MIME/profile及OEM/硬件能力，软件回退按后端实际条件；使用固定参考提交核对“Android HEVC解码与能力查询”原行为；配对并取得所需权限
- 步骤：执行“Android HEVC解码与能力查询”的操作并记录实际画面/音频/输入/管理结果；针对 hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android HEVC解码与能力查询 的用户结果符合固定源码定义：Android HEVC解码与能力查询；保留“Android HEVC解码与能力查询”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-list-audio-config

平台 selene-android；Phase 12；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“立体声/5.1/7.1”原行为；配对并取得所需权限
- 步骤：记录 list_audio_config 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 list_audio_config 切换实例、断连重连及撤销权限，分别记录状态
- 期望：立体声/5.1/7.1 的用户结果符合固定源码定义：用户可配置 list_audio_config：立体声/5.1/7.1；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“立体声/5.1/7.1”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list_audio_config 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-list-fps

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧率”原行为；配对并取得所需权限
- 步骤：记录 list_fps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 list_fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧率 的用户结果符合固定源码定义：用户可配置 list_fps：帧率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list_fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-list-languages

平台 selene-android；Phase 27；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“语言”原行为；配对并取得所需权限
- 步骤：记录 list_languages 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 list_languages 切换实例、断连重连及撤销权限，分别记录状态
- 期望：语言 的用户结果符合固定源码定义：用户可配置 list_languages：语言；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list_languages 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-list-resolution

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“分辨率”原行为；配对并取得所需权限
- 步骤：记录 list_resolution 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 list_resolution 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率 的用户结果符合固定源码定义：用户可配置 list_resolution：分辨率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“分辨率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list_resolution 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-manual-host

平台 selene-android；Phase 7；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android主机/发现/手工添加”原行为；配对并取得所需权限
- 步骤：执行“Android主机/发现/手工添加”的操作并记录实际画面/音频/输入/管理结果；针对 manual-host 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android主机/发现/手工添加 的用户结果符合固定源码定义：Android主机/发现/手工添加；保留“Android主机/发现/手工添加”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 manual-host 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-mediacodec

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“MediaCodec硬解/codec协商/重建”原行为；配对并取得所需权限
- 步骤：执行“MediaCodec硬解/codec协商/重建”的操作并记录实际画面/音频/输入/管理结果；针对 mediacodec 切换实例、断连重连及撤销权限，分别记录状态
- 期望：MediaCodec硬解/codec协商/重建 的用户结果符合固定源码定义：MediaCodec硬解/codec协商/重建；保留“MediaCodec硬解/codec协商/重建”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 mediacodec 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-motion

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄运动/机身运动回退”原行为；配对并取得所需权限
- 步骤：执行“手柄运动/机身运动回退”的操作并记录实际画面/音频/输入/管理结果；针对 motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄运动/机身运动回退 的用户结果符合固定源码定义：手柄运动/机身运动回退；保留“手柄运动/机身运动回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-mouse-wheel

平台 selene-android；Phase 11；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android高精度滚轮”原行为；配对并取得所需权限
- 步骤：执行“Android高精度滚轮”的操作并记录实际画面/音频/输入/管理结果；针对 mouse-wheel 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android高精度滚轮 的用户结果符合固定源码定义：Android高精度滚轮；保留“Android高精度滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 mouse-wheel 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-osc-layout

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕手柄布局/编辑/重置”原行为；配对并取得所需权限
- 步骤：执行“屏幕手柄布局/编辑/重置”的操作并记录实际画面/音频/输入/管理结果；针对 osc-layout 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕手柄布局/编辑/重置 的用户结果符合固定源码定义：屏幕手柄布局/编辑/重置；保留“屏幕手柄布局/编辑/重置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 osc-layout 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-osc-reset

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“重置屏幕手柄自定义布局”原行为；配对并取得所需权限
- 步骤：执行“重置屏幕手柄自定义布局”的操作并记录实际画面/音频/输入/管理结果；针对 osc-reset 切换实例、断连重连及撤销权限，分别记录状态
- 期望：重置屏幕手柄自定义布局 的用户结果符合固定源码定义：重置屏幕手柄自定义布局；保留“重置屏幕手柄自定义布局”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 osc-reset 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-pair

平台 selene-android；Phase 7；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android配对身份”原行为；配对并取得所需权限
- 步骤：执行“Android配对身份”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android配对身份 的用户结果符合固定源码定义：Android配对身份；保留“Android配对身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-pen

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android笔压力/倾斜输入”原行为；配对并取得所需权限
- 步骤：执行“Android笔压力/倾斜输入”的操作并记录实际画面/音频/输入/管理结果；针对 pen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android笔压力/倾斜输入 的用户结果符合固定源码定义：Android笔压力/倾斜输入；保留“Android笔压力/倾斜输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-permissions

平台 selene-android；Phase 28；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android网络/USB/前后台/PiP权限入口”原行为；配对并取得所需权限
- 步骤：执行“Android网络/USB/前后台/PiP权限入口”的操作并记录实际画面/音频/输入/管理结果；针对 permissions 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android网络/USB/前后台/PiP权限入口 的用户结果符合固定源码定义：Android网络/USB/前后台/PiP权限入口；保留“Android网络/USB/前后台/PiP权限入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 permissions 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-rumble

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器震动与触发器震动”原行为；配对并取得所需权限
- 步骤：执行“控制器震动与触发器震动”的操作并记录实际画面/音频/输入/管理结果；针对 rumble 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器震动与触发器震动 的用户结果符合固定源码定义：控制器震动与触发器震动；保留“控制器震动与触发器震动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rumble 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-seekbar-bitrate-kbps

平台 selene-android；Phase 23；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“码率”原行为；配对并取得所需权限
- 步骤：记录 seekbar_bitrate_kbps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 seekbar_bitrate_kbps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：码率 的用户结果符合固定源码定义：用户可配置 seekbar_bitrate_kbps：码率；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 seekbar_bitrate_kbps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-seekbar-deadzone

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器死区”原行为；配对并取得所需权限
- 步骤：记录 seekbar_deadzone 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 seekbar_deadzone 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器死区 的用户结果符合固定源码定义：用户可配置 seekbar_deadzone：控制器死区；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“控制器死区”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 seekbar_deadzone 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-seekbar-osc-opacity

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕手柄透明度”原行为；配对并取得所需权限
- 步骤：记录 seekbar_osc_opacity 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 seekbar_osc_opacity 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕手柄透明度 的用户结果符合固定源码定义：用户可配置 seekbar_osc_opacity：屏幕手柄透明度；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“屏幕手柄透明度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 seekbar_osc_opacity 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-seekbar-vibrate-fallback-strength

平台 selene-android；Phase 16；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“震动回退强度”原行为；配对并取得所需权限
- 步骤：记录 seekbar_vibrate_fallback_strength 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 seekbar_vibrate_fallback_strength 切换实例、断连重连及撤销权限，分别记录状态
- 期望：震动回退强度 的用户结果符合固定源码定义：用户可配置 seekbar_vibrate_fallback_strength：震动回退强度；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“震动回退强度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 seekbar_vibrate_fallback_strength 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-shortcut

平台 selene-android；Phase 27；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android应用桌面快捷方式启动”原行为；配对并取得所需权限
- 步骤：执行“Android应用桌面快捷方式启动”的操作并记录实际画面/音频/输入/管理结果；针对 shortcut 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android应用桌面快捷方式启动 的用户结果符合固定源码定义：Android应用桌面快捷方式启动；保留“Android应用桌面快捷方式启动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 shortcut 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-video-format

平台 selene-android；Phase 14；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“H.264/HEVC/AV1选择”原行为；配对并取得所需权限
- 步骤：记录 video_format 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 video_format 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264/HEVC/AV1选择 的用户结果符合固定源码定义：用户可配置 video_format：H.264/HEVC/AV1选择；读取入口为 PreferenceConfiguration，实际媒体/输入分支另列非设置能力；保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 video_format 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-android-wake

平台 selene-android；Phase 36；planned，未执行。

- 前提：准备 Android；API level 与 OEM/输入/codec 条件按固定源码分支 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Android Wake-on-LAN”原行为；配对并取得所需权限
- 步骤：执行“Android Wake-on-LAN”的操作并记录实际画面/音频/输入/管理结果；针对 wake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Android Wake-on-LAN 的用户结果符合固定源码定义：Android Wake-on-LAN；保留“Android Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-ios-ipados-absolute-touch

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS绝对触控”原行为；配对并取得所需权限
- 步骤：执行“iOS绝对触控”的操作并记录实际画面/音频/输入/管理结果；针对 absolute-touch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS绝对触控 的用户结果符合固定源码定义：iOS绝对触控；保留“iOS绝对触控”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absolute-touch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-absolutetouchmode

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“相对/绝对触摸”原行为；配对并取得所需权限
- 步骤：记录 absoluteTouchMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteTouchMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：相对/绝对触摸 的用户结果符合固定源码定义：iOS 独立设置 absoluteTouchMode：相对/绝对触摸，保留 Apple 可用性/设备分支；保留“相对/绝对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteTouchMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-apps

平台 selene-ios-ipados；Phase 27；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS应用列表/启动/恢复/退出”原行为；配对并取得所需权限
- 步骤：执行“iOS应用列表/启动/恢复/退出”的操作并记录实际画面/音频/输入/管理结果；针对 apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS应用列表/启动/恢复/退出 的用户结果符合固定源码定义：iOS应用列表/启动/恢复/退出；保留“iOS应用列表/启动/恢复/退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-audioconfig

平台 selene-ios-ipados；Phase 12；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“音频声道”原行为；配对并取得所需权限
- 步骤：记录 audioConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 audioConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：音频声道 的用户结果符合固定源码定义：iOS 独立设置 audioConfig：音频声道，保留 Apple 可用性/设备分支；保留“音频声道”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audioConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-av1

平台 selene-ios-ipados；Phase 14；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01；使用固定参考提交核对“iOS AV1视频分支”原行为；配对并取得所需权限
- 步骤：执行“iOS AV1视频分支”的操作并记录实际画面/音频/输入/管理结果；针对 av1 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS AV1视频分支 的用户结果符合固定源码定义：iOS AV1视频分支；保留“iOS AV1视频分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-battery

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS控制器电池事件”原行为；配对并取得所需权限
- 步骤：执行“iOS控制器电池事件”的操作并记录实际画面/音频/输入/管理结果；针对 battery 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS控制器电池事件 的用户结果符合固定源码定义：iOS控制器电池事件；保留“iOS控制器电池事件”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 battery 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-bitrate

平台 selene-ios-ipados；Phase 23；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“码率”原行为；配对并取得所需权限
- 步骤：记录 bitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 bitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：码率 的用户结果符合固定源码定义：iOS 独立设置 bitrate：码率，保留 Apple 可用性/设备分支；保留“码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 bitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-box-art

平台 selene-ios-ipados；Phase 27；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS应用封面”原行为；配对并取得所需权限
- 步骤：执行“iOS应用封面”的操作并记录实际画面/音频/输入/管理结果；针对 box-art 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS应用封面 的用户结果符合固定源码定义：iOS应用封面；保留“iOS应用封面”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 box-art 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-btmousesupport

平台 selene-ios-ipados；Phase 11；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“蓝牙鼠标”原行为；配对并取得所需权限
- 步骤：记录 btMouseSupport 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 btMouseSupport 切换实例、断连重连及撤销权限，分别记录状态
- 期望：蓝牙鼠标 的用户结果符合固定源码定义：iOS 独立设置 btMouseSupport：蓝牙鼠标，保留 Apple 可用性/设备分支；保留“蓝牙鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 btMouseSupport 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-discover

平台 selene-ios-ipados；Phase 7；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS发现/主机登记”原行为；配对并取得所需权限
- 步骤：执行“iOS发现/主机登记”的操作并记录实际画面/音频/输入/管理结果；针对 discover 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS发现/主机登记 的用户结果符合固定源码定义：iOS发现/主机登记；保留“iOS发现/主机登记”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 discover 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-enablehdr

平台 selene-ios-ipados；Phase 15；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“HDR”原行为；配对并取得所需权限
- 步骤：记录 enableHdr 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableHdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR 的用户结果符合固定源码定义：iOS 独立设置 enableHdr：HDR，保留 Apple 可用性/设备分支；保留“HDR”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableHdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-feedback

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS控制器震动/触发器/光效能力”原行为；配对并取得所需权限
- 步骤：执行“iOS控制器震动/触发器/光效能力”的操作并记录实际画面/音频/输入/管理结果；针对 feedback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS控制器震动/触发器/光效能力 的用户结果符合固定源码定义：iOS控制器震动/触发器/光效能力；保留“iOS控制器震动/触发器/光效能力”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 feedback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-framerate

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧率”原行为；配对并取得所需权限
- 步骤：记录 framerate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 framerate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧率 的用户结果符合固定源码定义：iOS 独立设置 framerate：帧率，保留 Apple 可用性/设备分支；保留“帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 framerate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-h264

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01；使用固定参考提交核对“iOS H.264视频分支”原行为；配对并取得所需权限
- 步骤：执行“iOS H.264视频分支”的操作并记录实际画面/音频/输入/管理结果；针对 h264 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS H.264视频分支 的用户结果符合固定源码定义：iOS H.264视频分支；保留“iOS H.264视频分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 h264 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-height

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频高度”原行为；配对并取得所需权限
- 步骤：记录 height 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 height 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频高度 的用户结果符合固定源码定义：iOS 独立设置 height：视频高度，保留 Apple 可用性/设备分支；保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 height 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-hevc

平台 selene-ios-ipados；Phase 14；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 Apple硬解能力、OS availability、profile和显示设备分别核验，实机VFY-01；使用固定参考提交核对“iOS HEVC视频分支”原行为；配对并取得所需权限
- 步骤：执行“iOS HEVC视频分支”的操作并记录实际画面/音频/输入/管理结果；针对 hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS HEVC视频分支 的用户结果符合固定源码定义：iOS HEVC视频分支；保留“iOS HEVC视频分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-high-res-wheel

平台 selene-ios-ipados；Phase 11；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS高精度双轴滚轮”原行为；配对并取得所需权限
- 步骤：执行“iOS高精度双轴滚轮”的操作并记录实际画面/音频/输入/管理结果；针对 high-res-wheel 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS高精度双轴滚轮 的用户结果符合固定源码定义：iOS高精度双轴滚轮；保留“iOS高精度双轴滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 high-res-wheel 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-motion

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS控制器运动”原行为；配对并取得所需权限
- 步骤：执行“iOS控制器运动”的操作并记录实际画面/音频/输入/管理结果；针对 motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS控制器运动 的用户结果符合固定源码定义：iOS控制器运动；保留“iOS控制器运动”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-mouse-capture

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS外接键鼠/捕获可用性分支”原行为；配对并取得所需权限
- 步骤：执行“iOS外接键鼠/捕获可用性分支”的操作并记录实际画面/音频/输入/管理结果；针对 mouse-capture 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS外接键鼠/捕获可用性分支 的用户结果符合固定源码定义：iOS外接键鼠/捕获可用性分支；保留“iOS外接键鼠/捕获可用性分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 mouse-capture 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-multicontroller

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多控制器”原行为；配对并取得所需权限
- 步骤：记录 multiController 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 multiController 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多控制器 的用户结果符合固定源码定义：iOS 独立设置 multiController：多控制器，保留 Apple 可用性/设备分支；保留“多控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multiController 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-onscreencontrols

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“屏幕控制器”原行为；配对并取得所需权限
- 步骤：记录 onscreenControls 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 onscreenControls 切换实例、断连重连及撤销权限，分别记录状态
- 期望：屏幕控制器 的用户结果符合固定源码定义：iOS 独立设置 onscreenControls：屏幕控制器，保留 Apple 可用性/设备分支；保留“屏幕控制器”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 onscreenControls 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-optimizegames

平台 selene-ios-ipados；Phase 27；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“游戏优化”原行为；配对并取得所需权限
- 步骤：记录 optimizeGames 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 optimizeGames 切换实例、断连重连及撤销权限，分别记录状态
- 期望：游戏优化 的用户结果符合固定源码定义：iOS 独立设置 optimizeGames：游戏优化，保留 Apple 可用性/设备分支；保留“游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 optimizeGames 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-pair

平台 selene-ios-ipados；Phase 7；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS配对/证书”原行为；配对并取得所需权限
- 步骤：执行“iOS配对/证书”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS配对/证书 的用户结果符合固定源码定义：iOS配对/证书；保留“iOS配对/证书”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-pen

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Apple Pencil压力/倾斜/方位与hover”原行为；配对并取得所需权限
- 步骤：执行“Apple Pencil压力/倾斜/方位与hover”的操作并记录实际画面/音频/输入/管理结果；针对 pen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Apple Pencil压力/倾斜/方位与hover 的用户结果符合固定源码定义：Apple Pencil压力/倾斜/方位与hover；保留“Apple Pencil压力/倾斜/方位与hover”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-permissions

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS本地网络/输入与目标声明”原行为；配对并取得所需权限
- 步骤：执行“iOS本地网络/输入与目标声明”的操作并记录实际画面/音频/输入/管理结果；针对 permissions 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS本地网络/输入与目标声明 的用户结果符合固定源码定义：iOS本地网络/输入与目标声明；保留“iOS本地网络/输入与目标声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 permissions 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-playaudioonpc

平台 selene-ios-ipados；Phase 12；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机播放音频”原行为；配对并取得所需权限
- 步骤：记录 playAudioOnPC 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 playAudioOnPC 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机播放音频 的用户结果符合固定源码定义：iOS 独立设置 playAudioOnPC：主机播放音频，保留 Apple 可用性/设备分支；保留“主机播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 playAudioOnPC 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-preferredcodec

平台 selene-ios-ipados；Phase 14；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“codec偏好”原行为；配对并取得所需权限
- 步骤：记录 preferredCodec 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 preferredCodec 切换实例、断连重连及撤销权限，分别记录状态
- 期望：codec偏好 的用户结果符合固定源码定义：iOS 独立设置 preferredCodec：codec偏好，保留 Apple 可用性/设备分支；保留“codec偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 preferredCodec 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-relative-touch

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS相对触摸板”原行为；配对并取得所需权限
- 步骤：执行“iOS相对触摸板”的操作并记录实际画面/音频/输入/管理结果；针对 relative-touch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS相对触摸板 的用户结果符合固定源码定义：iOS相对触摸板；保留“iOS相对触摸板”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 relative-touch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-screen-controller

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS屏幕手柄/布局”原行为；配对并取得所需权限
- 步骤：执行“iOS屏幕手柄/布局”的操作并记录实际画面/音频/输入/管理结果；针对 screen-controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS屏幕手柄/布局 的用户结果符合固定源码定义：iOS屏幕手柄/布局；保留“iOS屏幕手柄/布局”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 screen-controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-statsoverlay

平台 selene-ios-ipados；Phase 36；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“统计叠层”原行为；配对并取得所需权限
- 步骤：记录 statsOverlay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 statsOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：统计叠层 的用户结果符合固定源码定义：iOS 独立设置 statsOverlay：统计叠层，保留 Apple 可用性/设备分支；保留“统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 statsOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-surround

平台 selene-ios-ipados；Phase 12；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS Opus多声道音频与统计”原行为；配对并取得所需权限
- 步骤：执行“iOS Opus多声道音频与统计”的操作并记录实际画面/音频/输入/管理结果；针对 surround 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS Opus多声道音频与统计 的用户结果符合固定源码定义：iOS Opus多声道音频与统计；保留“iOS Opus多声道音频与统计”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 surround 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-swapabxybuttons

平台 selene-ios-ipados；Phase 16；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“AB/XY交换”原行为；配对并取得所需权限
- 步骤：记录 swapABXYButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapABXYButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AB/XY交换 的用户结果符合固定源码定义：iOS 独立设置 swapABXYButtons：AB/XY交换，保留 Apple 可用性/设备分支；保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapABXYButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-useframepacing

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧节奏”原行为；配对并取得所需权限
- 步骤：记录 useFramePacing 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 useFramePacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧节奏 的用户结果符合固定源码定义：iOS 独立设置 useFramePacing：帧节奏，保留 Apple 可用性/设备分支；保留“帧节奏”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 useFramePacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-video-toolbox

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现”原行为；配对并取得所需权限
- 步骤：执行“iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现”的操作并记录实际画面/音频/输入/管理结果；针对 video-toolbox 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现 的用户结果符合固定源码定义：iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现；保留“iOS AVSampleBufferDisplayLayer硬件解码/HDR/呈现”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 video-toolbox 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-wake

平台 selene-ios-ipados；Phase 36；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS Wake-on-LAN”原行为；配对并取得所需权限
- 步骤：执行“iOS Wake-on-LAN”的操作并记录实际画面/音频/输入/管理结果；针对 wake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS Wake-on-LAN 的用户结果符合固定源码定义：iOS Wake-on-LAN；保留“iOS Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-width

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频宽度”原行为；配对并取得所需权限
- 步骤：记录 width 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 width 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频宽度 的用户结果符合固定源码定义：iOS 独立设置 width：视频宽度，保留 Apple 可用性/设备分支；保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 width 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-ios-ipados-xcode-target

平台 selene-ios-ipados；Phase 32；planned，未执行。

- 前提：准备 iOS/iPadOS；按源码 availability/API 分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“iOS/iPadOS Xcode构建/架构入口”原行为；配对并取得所需权限
- 步骤：执行“iOS/iPadOS Xcode构建/架构入口”的操作并记录实际画面/音频/输入/管理结果；针对 xcode-target 切换实例、断连重连及撤销权限，分别记录状态
- 期望：iOS/iPadOS Xcode构建/架构入口 的用户结果符合固定源码定义：iOS/iPadOS Xcode构建/架构入口；保留“iOS/iPadOS Xcode构建/架构入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 xcode-target 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-01；不以构建代替

### case-selene-linux-absolutemousemode

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“桌面绝对鼠标”原行为；配对并取得所需权限
- 步骤：记录 absoluteMouseMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteMouseMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：桌面绝对鼠标 的用户结果符合固定源码定义：用户可配置 absoluteMouseMode：桌面绝对鼠标；固定声明与实际读取/消费入口分别附锚点；保留“桌面绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteMouseMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-absolutetouchmode

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“绝对/相对触摸”原行为；配对并取得所需权限
- 步骤：记录 absoluteTouchMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteTouchMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：绝对/相对触摸 的用户结果符合固定源码定义：用户可配置 absoluteTouchMode：绝对/相对触摸；固定声明与实际读取/消费入口分别附锚点；保留“绝对/相对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteTouchMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-action-list

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 list”原行为；配对并取得所需权限
- 步骤：执行“命令动作 list”的操作并记录实际画面/音频/输入/管理结果；针对 action-list 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 list 的用户结果符合固定源码定义：命令动作 list；保留“命令动作 list”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-list 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-action-pair

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 pair”原行为；配对并取得所需权限
- 步骤：执行“命令动作 pair”的操作并记录实际画面/音频/输入/管理结果；针对 action-pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 pair 的用户结果符合固定源码定义：命令动作 pair；保留“命令动作 pair”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-action-quit

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 quit”原行为；配对并取得所需权限
- 步骤：执行“命令动作 quit”的操作并记录实际画面/音频/输入/管理结果；针对 action-quit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 quit 的用户结果符合固定源码定义：命令动作 quit；保留“命令动作 quit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-quit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-action-stream

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 stream”原行为；配对并取得所需权限
- 步骤：执行“命令动作 stream”的操作并记录实际画面/音频/输入/管理结果；针对 action-stream 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 stream 的用户结果符合固定源码定义：命令动作 stream；保留“命令动作 stream”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-stream 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-audioconfig

平台 selene-linux；Phase 12；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“立体声/5.1/7.1配置”原行为；配对并取得所需权限
- 步骤：记录 audioConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 audioConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：立体声/5.1/7.1配置 的用户结果符合固定源码定义：用户可配置 audioConfig：立体声/5.1/7.1配置；固定声明与实际读取/消费入口分别附锚点；保留“立体声/5.1/7.1配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audioConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-autoadjustbitrate

平台 selene-linux；Phase 23；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“分辨率变化时调整默认码率”原行为；配对并取得所需权限
- 步骤：记录 autoAdjustBitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 autoAdjustBitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率变化时调整默认码率 的用户结果符合固定源码定义：用户可配置 autoAdjustBitrate：分辨率变化时调整默认码率；固定声明与实际读取/消费入口分别附锚点；保留“分辨率变化时调整默认码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 autoAdjustBitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-av1

平台 selene-linux；Phase 14；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“AV1独立解码分支”原行为；配对并取得所需权限
- 步骤：执行“AV1独立解码分支”的操作并记录实际画面/音频/输入/管理结果；针对 av1 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AV1独立解码分支 的用户结果符合固定源码定义：AV1独立解码分支；保留“AV1独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-backgroundgamepad

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“后台手柄输入策略”原行为；配对并取得所需权限
- 步骤：记录 backgroundGamepad 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 backgroundGamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：后台手柄输入策略 的用户结果符合固定源码定义：用户可配置 backgroundGamepad：后台手柄输入策略；固定声明与实际读取/消费入口分别附锚点；保留“后台手柄输入策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 backgroundGamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-bitratekbps

平台 selene-linux；Phase 23；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“目标码率”原行为；配对并取得所需权限
- 步骤：记录 bitrateKbps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 bitrateKbps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：目标码率 的用户结果符合固定源码定义：用户可配置 bitrateKbps：目标码率；固定声明与实际读取/消费入口分别附锚点；保留“目标码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 bitrateKbps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-box-art

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用封面缓存/展示”原行为；配对并取得所需权限
- 步骤：执行“应用封面缓存/展示”的操作并记录实际画面/音频/输入/管理结果；针对 box-art 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用封面缓存/展示 的用户结果符合固定源码定义：应用封面缓存/展示；保留“应用封面缓存/展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 box-art 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-capturesyskeysmode

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“系统快捷键捕获策略”原行为；配对并取得所需权限
- 步骤：记录 captureSysKeysMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 captureSysKeysMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统快捷键捕获策略 的用户结果符合固定源码定义：用户可配置 captureSysKeysMode：系统快捷键捕获策略；固定声明与实际读取/消费入口分别附锚点；保留“系统快捷键捕获策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 captureSysKeysMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-1080

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 1080”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 1080；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-1080 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 1080 的用户结果符合固定源码定义：受控命令入口允许配置 1080；参数语义和允许值来自固定 parser；保留“命令参数 1080”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-1080 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-1440

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 1440”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 1440；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-1440 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 1440 的用户结果符合固定源码定义：受控命令入口允许配置 1440；参数语义和允许值来自固定 parser；保留“命令参数 1440”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-1440 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-4k

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 4K”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 4K；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-4K 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 4K 的用户结果符合固定源码定义：受控命令入口允许配置 4K；参数语义和允许值来自固定 parser；保留“命令参数 4K”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-4K 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-720

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 720”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 720；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-720 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 720 的用户结果符合固定源码定义：受控命令入口允许配置 720；参数语义和允许值来自固定 parser；保留“命令参数 720”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-720 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-absolute-mouse

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 absolute-mouse”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-absolute-mouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 absolute-mouse 的用户结果符合固定源码定义：受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser；保留“命令参数 absolute-mouse”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-absolute-mouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-audio-config

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 audio-config”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-audio-config 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 audio-config 的用户结果符合固定源码定义：受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser；保留“命令参数 audio-config”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-audio-config 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-audio-on-host

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 audio-on-host”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-audio-on-host 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 audio-on-host 的用户结果符合固定源码定义：受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser；保留“命令参数 audio-on-host”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-audio-on-host 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-background-gamepad

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 background-gamepad”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-background-gamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 background-gamepad 的用户结果符合固定源码定义：受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser；保留“命令参数 background-gamepad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-background-gamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-bitrate

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 bitrate”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-bitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 bitrate 的用户结果符合固定源码定义：受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser；保留“命令参数 bitrate”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-bitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-capture-system-keys

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 capture-system-keys”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-capture-system-keys 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 capture-system-keys 的用户结果符合固定源码定义：受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser；保留“命令参数 capture-system-keys”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-capture-system-keys 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-csv

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 csv”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 csv；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-csv 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 csv 的用户结果符合固定源码定义：受控命令入口允许配置 csv；参数语义和允许值来自固定 parser；保留“命令参数 csv”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-csv 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-display-mode

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 display-mode”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-display-mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 display-mode 的用户结果符合固定源码定义：受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser；保留“命令参数 display-mode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-display-mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-fps

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 fps”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 fps；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 fps 的用户结果符合固定源码定义：受控命令入口允许配置 fps；参数语义和允许值来自固定 parser；保留“命令参数 fps”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-frame-pacing

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 frame-pacing”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-frame-pacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 frame-pacing 的用户结果符合固定源码定义：受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser；保留“命令参数 frame-pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-frame-pacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-game-optimization

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 game-optimization”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-game-optimization 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 game-optimization 的用户结果符合固定源码定义：受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser；保留“命令参数 game-optimization”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-game-optimization 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-hdr

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 hdr”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-hdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 hdr 的用户结果符合固定源码定义：受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser；保留“命令参数 hdr”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-hdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-keep-awake

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 keep-awake”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-keep-awake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 keep-awake 的用户结果符合固定源码定义：受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser；保留“命令参数 keep-awake”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-keep-awake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-mouse-buttons-swap

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 mouse-buttons-swap”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-mouse-buttons-swap 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 mouse-buttons-swap 的用户结果符合固定源码定义：受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser；保留“命令参数 mouse-buttons-swap”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-mouse-buttons-swap 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-multi-controller

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 multi-controller”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-multi-controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 multi-controller 的用户结果符合固定源码定义：受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser；保留“命令参数 multi-controller”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-multi-controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-mute-on-focus-loss

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 mute-on-focus-loss”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-mute-on-focus-loss 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 mute-on-focus-loss 的用户结果符合固定源码定义：受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser；保留“命令参数 mute-on-focus-loss”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-mute-on-focus-loss 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-packet-size

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 packet-size”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-packet-size 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 packet-size 的用户结果符合固定源码定义：受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser；保留“命令参数 packet-size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-packet-size 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-performance-overlay

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 performance-overlay”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-performance-overlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 performance-overlay 的用户结果符合固定源码定义：受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser；保留“命令参数 performance-overlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-performance-overlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-pin

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 pin”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 pin；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-pin 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 pin 的用户结果符合固定源码定义：受控命令入口允许配置 pin；参数语义和允许值来自固定 parser；保留“命令参数 pin”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-pin 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-quit-after

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 quit-after”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-quit-after 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 quit-after 的用户结果符合固定源码定义：受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser；保留“命令参数 quit-after”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-quit-after 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-resolution

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 resolution”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-resolution 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 resolution 的用户结果符合固定源码定义：受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser；保留“命令参数 resolution”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-resolution 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-reverse-scroll-direction

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 reverse-scroll-direction”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-reverse-scroll-direction 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 reverse-scroll-direction 的用户结果符合固定源码定义：受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser；保留“命令参数 reverse-scroll-direction”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-reverse-scroll-direction 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-swap-gamepad-buttons

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 swap-gamepad-buttons”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-swap-gamepad-buttons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 swap-gamepad-buttons 的用户结果符合固定源码定义：受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser；保留“命令参数 swap-gamepad-buttons”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-swap-gamepad-buttons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-touchscreen-trackpad

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 touchscreen-trackpad”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-touchscreen-trackpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 touchscreen-trackpad 的用户结果符合固定源码定义：受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser；保留“命令参数 touchscreen-trackpad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-touchscreen-trackpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-verbose

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 verbose”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-verbose 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 verbose 的用户结果符合固定源码定义：受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser；保留“命令参数 verbose”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-verbose 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-video-codec

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 video-codec”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-video-codec 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 video-codec 的用户结果符合固定源码定义：受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser；保留“命令参数 video-codec”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-video-codec 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-video-decoder

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 video-decoder”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-video-decoder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 video-decoder 的用户结果符合固定源码定义：受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser；保留“命令参数 video-decoder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-video-decoder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-vsync

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 vsync”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-vsync 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 vsync 的用户结果符合固定源码定义：受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser；保留“命令参数 vsync”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-vsync 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-cli-yuv444

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 yuv444”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-yuv444 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 yuv444 的用户结果符合固定源码定义：受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser；保留“命令参数 yuv444”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-yuv444 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-configurationwarnings

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“配置警告”原行为；配对并取得所需权限
- 步骤：记录 configurationWarnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 configurationWarnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：配置警告 的用户结果符合固定源码定义：用户可配置 configurationWarnings：配置警告；固定声明与实际读取/消费入口分别附锚点；保留“配置警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 configurationWarnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-connectionwarnings

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“连接警告”原行为；配对并取得所需权限
- 步骤：记录 connectionWarnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 connectionWarnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接警告 的用户结果符合固定源码定义：用户可配置 connectionWarnings：连接警告；固定声明与实际读取/消费入口分别附锚点；保留“连接警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 connectionWarnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-controller-battery

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器电量上报”原行为；配对并取得所需权限
- 步骤：执行“控制器电量上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-battery 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器电量上报 的用户结果符合固定源码定义：控制器电量上报；保留“控制器电量上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-battery 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-controller-count

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商；使用固定参考提交核对“原README最多16玩家/控制器声明”原行为；配对并取得所需权限
- 步骤：执行“原README最多16玩家/控制器声明”的操作并记录实际画面/音频/输入/管理结果；针对 controller-count 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原README最多16玩家/控制器声明 的用户结果符合固定源码定义：原README最多16玩家/控制器声明；保留“原README最多16玩家/控制器声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-count 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-controller-motion

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动上报”原行为；配对并取得所需权限
- 步骤：执行“控制器运动上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动上报 的用户结果符合固定源码定义：控制器运动上报；保留“控制器运动上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-controller-touchpad

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器触摸板上报”原行为；配对并取得所需权限
- 步骤：执行“控制器触摸板上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-touchpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器触摸板上报 的用户结果符合固定源码定义：控制器触摸板上报；保留“控制器触摸板上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-touchpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-decoder-fallback

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“FFmpeg软/硬解路径与失败回退”原行为；配对并取得所需权限
- 步骤：执行“FFmpeg软/硬解路径与失败回退”的操作并记录实际画面/音频/输入/管理结果；针对 decoder-fallback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：FFmpeg软/硬解路径与失败回退 的用户结果符合固定源码定义：FFmpeg软/硬解路径与失败回退；保留“FFmpeg软/硬解路径与失败回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 decoder-fallback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-detectnetworkblocking

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“网络阻断检测”原行为；配对并取得所需权限
- 步骤：记录 detectNetworkBlocking 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 detectNetworkBlocking 切换实例、断连重连及撤销权限，分别记录状态
- 期望：网络阻断检测 的用户结果符合固定源码定义：用户可配置 detectNetworkBlocking：网络阻断检测；固定声明与实际读取/消费入口分别附锚点；保留“网络阻断检测”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 detectNetworkBlocking 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-discover

平台 selene-linux；Phase 7；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“发现/手工主机管理”原行为；配对并取得所需权限
- 步骤：执行“发现/手工主机管理”的操作并记录实际画面/音频/输入/管理结果；针对 discover 切换实例、断连重连及撤销权限，分别记录状态
- 期望：发现/手工主机管理 的用户结果符合固定源码定义：发现/手工主机管理；保留“发现/手工主机管理”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 discover 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-distribution-architectures

平台 selene-linux；Phase 40；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审；使用固定参考提交核对“平台原包与ARM32/ARM64/RISC-V入口”原行为；配对并取得所需权限
- 步骤：执行“平台原包与ARM32/ARM64/RISC-V入口”的操作并记录实际画面/音频/输入/管理结果；针对 distribution-architectures 切换实例、断连重连及撤销权限，分别记录状态
- 期望：平台原包与ARM32/ARM64/RISC-V入口 的用户结果符合固定源码定义：平台原包与ARM32/ARM64/RISC-V入口；保留“平台原包与ARM32/ARM64/RISC-V入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 distribution-architectures 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-enablehdr

平台 selene-linux；Phase 15；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“HDR/10-bit”原行为；配对并取得所需权限
- 步骤：记录 enableHdr 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableHdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR/10-bit 的用户结果符合固定源码定义：用户可配置 enableHdr：HDR/10-bit；固定声明与实际读取/消费入口分别附锚点；保留“HDR/10-bit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableHdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-enablemdns

平台 selene-linux；Phase 7；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“mDNS发现开关”原行为；配对并取得所需权限
- 步骤：记录 enableMdns 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableMdns 切换实例、断连重连及撤销权限，分别记录状态
- 期望：mDNS发现开关 的用户结果符合固定源码定义：用户可配置 enableMdns：mDNS发现开关；固定声明与实际读取/消费入口分别附锚点；保留“mDNS发现开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableMdns 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-enablevsync

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“垂直同步”原行为；配对并取得所需权限
- 步骤：记录 enableVsync 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableVsync 切换实例、断连重连及撤销权限，分别记录状态
- 期望：垂直同步 的用户结果符合固定源码定义：用户可配置 enableVsync：垂直同步；固定声明与实际读取/消费入口分别附锚点；保留“垂直同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableVsync 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-enableyuv444

平台 selene-linux；Phase 15；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“YUV 4:4:4”原行为；配对并取得所需权限
- 步骤：记录 enableYUV444 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableYUV444 切换实例、断连重连及撤销权限，分别记录状态
- 期望：YUV 4:4:4 的用户结果符合固定源码定义：用户可配置 enableYUV444：YUV 4:4:4；固定声明与实际读取/消费入口分别附锚点；保留“YUV 4:4:4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableYUV444 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-fps

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“目标帧率/高帧率”原行为；配对并取得所需权限
- 步骤：记录 fps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：目标帧率/高帧率 的用户结果符合固定源码定义：用户可配置 fps：目标帧率/高帧率；固定声明与实际读取/消费入口分别附锚点；保留“目标帧率/高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-framepacing

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧 pacing”原行为；配对并取得所需权限
- 步骤：记录 framePacing 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 framePacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧 pacing 的用户结果符合固定源码定义：用户可配置 framePacing：帧 pacing；固定声明与实际读取/消费入口分别附锚点；保留“帧 pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 framePacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-gameoptimizations

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机游戏优化”原行为；配对并取得所需权限
- 步骤：记录 gameOptimizations 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gameOptimizations 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机游戏优化 的用户结果符合固定源码定义：用户可配置 gameOptimizations：主机游戏优化；固定声明与实际读取/消费入口分别附锚点；保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gameOptimizations 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-gamepadmouse

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄鼠标模拟”原行为；配对并取得所需权限
- 步骤：记录 gamepadMouse 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepadMouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄鼠标模拟 的用户结果符合固定源码定义：用户可配置 gamepadMouse：手柄鼠标模拟；固定声明与实际读取/消费入口分别附锚点；保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepadMouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-h264

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“H.264基础视频与回退”原行为；配对并取得所需权限
- 步骤：执行“H.264基础视频与回退”的操作并记录实际画面/音频/输入/管理结果；针对 h264 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264基础视频与回退 的用户结果符合固定源码定义：H.264基础视频与回退；保留“H.264基础视频与回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 h264 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-hdr-main10

平台 selene-linux；Phase 15；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“HDR10-bit/色彩元数据”原行为；配对并取得所需权限
- 步骤：执行“HDR10-bit/色彩元数据”的操作并记录实际画面/音频/输入/管理结果；针对 hdr-main10 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR10-bit/色彩元数据 的用户结果符合固定源码定义：HDR10-bit/色彩元数据；保留“HDR10-bit/色彩元数据”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hdr-main10 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-height

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频高度”原行为；配对并取得所需权限
- 步骤：记录 height 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 height 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频高度 的用户结果符合固定源码定义：用户可配置 height：视频高度；固定声明与实际读取/消费入口分别附锚点；保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 height 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-hevc

平台 selene-linux；Phase 14；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“HEVC独立解码分支”原行为；配对并取得所需权限
- 步骤：执行“HEVC独立解码分支”的操作并记录实际画面/音频/输入/管理结果；针对 hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HEVC独立解码分支 的用户结果符合固定源码定义：HEVC独立解码分支；保留“HEVC独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keepawake

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“串流期间保持唤醒”原行为；配对并取得所需权限
- 步骤：记录 keepAwake 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keepAwake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：串流期间保持唤醒 的用户结果符合固定源码定义：用户可配置 keepAwake：串流期间保持唤醒；固定声明与实际读取/消费入口分别附锚点；保留“串流期间保持唤醒”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keepAwake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombopastetext

平台 selene-linux；Phase 25；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboPasteText”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboPasteText 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboPasteText 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboPasteText 的用户结果符合固定源码定义：通过 KeyComboPasteText 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboPasteText”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboPasteText 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycomboquit

平台 selene-linux；Phase 20；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboQuit”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboQuit 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboQuit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboQuit 的用户结果符合固定源码定义：通过 KeyComboQuit 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboQuit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboQuit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycomboquitandexit

平台 selene-linux；Phase 8；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboQuitAndExit”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboQuitAndExit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboQuitAndExit 的用户结果符合固定源码定义：通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboQuitAndExit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboQuitAndExit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotogglecursorhide

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleCursorHide”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleCursorHide 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleCursorHide 的用户结果符合固定源码定义：通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleCursorHide”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleCursorHide 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotogglefullscreen

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleFullScreen”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleFullScreen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleFullScreen 的用户结果符合固定源码定义：通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleFullScreen”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleFullScreen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotogglekeyboardgrab

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleKeyboardGrab”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleKeyboardGrab 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleKeyboardGrab 的用户结果符合固定源码定义：通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleKeyboardGrab”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleKeyboardGrab 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotoggleminimize

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleMinimize”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleMinimize 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleMinimize 的用户结果符合固定源码定义：通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleMinimize”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleMinimize 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotogglemousemode

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleMouseMode”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleMouseMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleMouseMode 的用户结果符合固定源码定义：通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleMouseMode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleMouseMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotogglepointerregionlock

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboTogglePointerRegionLock”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboTogglePointerRegionLock 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboTogglePointerRegionLock 的用户结果符合固定源码定义：通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboTogglePointerRegionLock”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboTogglePointerRegionLock 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycombotogglestatsoverlay

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleStatsOverlay”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleStatsOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleStatsOverlay 的用户结果符合固定源码定义：通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleStatsOverlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleStatsOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-keycomboungrabinput

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboUngrabInput”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboUngrabInput 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboUngrabInput 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboUngrabInput 的用户结果符合固定源码定义：通过 KeyComboUngrabInput 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboUngrabInput”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboUngrabInput 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-language

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“界面语言”原行为；配对并取得所需权限
- 步骤：记录 language 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 language 切换实例、断连重连及撤销权限，分别记录状态
- 期望：界面语言 的用户结果符合固定源码定义：用户可配置 language：界面语言；固定声明与实际读取/消费入口分别附锚点；保留“界面语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 language 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-list-apps

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用列表/启动/恢复/显式退出”原行为；配对并取得所需权限
- 步骤：执行“应用列表/启动/恢复/显式退出”的操作并记录实际画面/音频/输入/管理结果；针对 list-apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用列表/启动/恢复/显式退出 的用户结果符合固定源码定义：应用列表/启动/恢复/显式退出；保留“应用列表/启动/恢复/显式退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list-apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-multicontroller

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多个控制器独立编号”原行为；配对并取得所需权限
- 步骤：记录 multiController 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 multiController 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多个控制器独立编号 的用户结果符合固定源码定义：用户可配置 multiController：多个控制器独立编号；固定声明与实际读取/消费入口分别附锚点；保留“多个控制器独立编号”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multiController 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-multitouch

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 最多10点为README声明；需多点输入设备与主机native touch支持；使用固定参考提交核对“原生多点触摸（声明最多10点，设备及主机条件须实测）”原行为；配对并取得所需权限
- 步骤：执行“原生多点触摸（声明最多10点，设备及主机条件须实测）”的操作并记录实际画面/音频/输入/管理结果；针对 multitouch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生多点触摸（声明最多10点，设备及主机条件须实测） 的用户结果符合固定源码定义：原生多点触摸（声明最多10点，设备及主机条件须实测）；保留“原生多点触摸（声明最多10点，设备及主机条件须实测）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multitouch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-muteonfocusloss

平台 selene-linux；Phase 12；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“失焦静音”原行为；配对并取得所需权限
- 步骤：记录 muteOnFocusLoss 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 muteOnFocusLoss 切换实例、断连重连及撤销权限，分别记录状态
- 期望：失焦静音 的用户结果符合固定源码定义：用户可配置 muteOnFocusLoss：失焦静音；固定声明与实际读取/消费入口分别附锚点；保留“失焦静音”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 muteOnFocusLoss 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-pair

平台 selene-linux；Phase 7；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“配对确认与证书身份”原行为；配对并取得所需权限
- 步骤：执行“配对确认与证书身份”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：配对确认与证书身份 的用户结果符合固定源码定义：配对确认与证书身份；保留“配对确认与证书身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-pen

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 触控笔、SDL平台输入及Windows注入provider分别验证；使用固定参考提交核对“原生笔压力/方向输入”原行为；配对并取得所需权限
- 步骤：执行“原生笔压力/方向输入”的操作并记录实际画面/音频/输入/管理结果；针对 pen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生笔压力/方向输入 的用户结果符合固定源码定义：原生笔压力/方向输入；保留“原生笔压力/方向输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-playaudioonhost

平台 selene-linux；Phase 12；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机同时播放音频”原行为；配对并取得所需权限
- 步骤：记录 playAudioOnHost 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 playAudioOnHost 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机同时播放音频 的用户结果符合固定源码定义：用户可配置 playAudioOnHost：主机同时播放音频；固定声明与实际读取/消费入口分别附锚点；保留“主机同时播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 playAudioOnHost 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-precise-horizontal-wheel

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“高精度水平滚轮”原行为；配对并取得所需权限
- 步骤：执行“高精度水平滚轮”的操作并记录实际画面/音频/输入/管理结果；针对 precise-horizontal-wheel 切换实例、断连重连及撤销权限，分别记录状态
- 期望：高精度水平滚轮 的用户结果符合固定源码定义：高精度水平滚轮；保留“高精度水平滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 precise-horizontal-wheel 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-quitappafter

平台 selene-linux；Phase 8；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“断开后退出应用旧偏好”原行为；配对并取得所需权限
- 步骤：记录 quitAppAfter 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 quitAppAfter 切换实例、断连重连及撤销权限，分别记录状态
- 期望：断开后退出应用旧偏好 的用户结果符合固定源码定义：用户可配置 quitAppAfter：断开后退出应用旧偏好；固定声明与实际读取/消费入口分别附锚点；普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance
- 负例：拒绝 quitAppAfter 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-rendererselection

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“原生呈现后端选择”原行为；配对并取得所需权限
- 步骤：记录 rendererSelection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 rendererSelection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生呈现后端选择 的用户结果符合固定源码定义：用户可配置 rendererSelection：原生呈现后端选择；固定声明与实际读取/消费入口分别附锚点；保留“原生呈现后端选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rendererSelection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-reversescrolldirection

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“垂直/水平精确滚轮方向”原行为；配对并取得所需权限
- 步骤：记录 reverseScrollDirection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 reverseScrollDirection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：垂直/水平精确滚轮方向 的用户结果符合固定源码定义：用户可配置 reverseScrollDirection：垂直/水平精确滚轮方向；固定声明与实际读取/消费入口分别附锚点；保留“垂直/水平精确滚轮方向”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 reverseScrollDirection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-rgb-led

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器RGB LED反馈”原行为；配对并取得所需权限
- 步骤：执行“控制器RGB LED反馈”的操作并记录实际画面/音频/输入/管理结果；针对 rgb-led 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器RGB LED反馈 的用户结果符合固定源码定义：控制器RGB LED反馈；保留“控制器RGB LED反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rgb-led 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-richpresence

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Discord游戏活动展示”原行为；配对并取得所需权限
- 步骤：记录 richPresence 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 richPresence 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Discord游戏活动展示 的用户结果符合固定源码定义：用户可配置 richPresence：Discord游戏活动展示；固定声明与实际读取/消费入口分别附锚点；保留“Discord游戏活动展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 richPresence 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-rumble-feedback

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“低/高频控制器震动反馈”原行为；配对并取得所需权限
- 步骤：执行“低/高频控制器震动反馈”的操作并记录实际画面/音频/输入/管理结果；针对 rumble-feedback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：低/高频控制器震动反馈 的用户结果符合固定源码定义：低/高频控制器震动反馈；保留“低/高频控制器震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rumble-feedback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-showperformanceoverlay

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“串流统计叠层”原行为；配对并取得所需权限
- 步骤：记录 showPerformanceOverlay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 showPerformanceOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：串流统计叠层 的用户结果符合固定源码定义：用户可配置 showPerformanceOverlay：串流统计叠层；固定声明与实际读取/消费入口分别附锚点；保留“串流统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 showPerformanceOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-surround

平台 selene-linux；Phase 12；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多声道音频解码/输出”原行为；配对并取得所需权限
- 步骤：执行“多声道音频解码/输出”的操作并记录实际画面/音频/输入/管理结果；针对 surround 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多声道音频解码/输出 的用户结果符合固定源码定义：多声道音频解码/输出；保留“多声道音频解码/输出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 surround 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-swapfacebuttons

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“AB/XY交换”原行为；配对并取得所需权限
- 步骤：记录 swapFaceButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapFaceButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AB/XY交换 的用户结果符合固定源码定义：用户可配置 swapFaceButtons：AB/XY交换；固定声明与实际读取/消费入口分别附锚点；保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapFaceButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-swapmousebuttons

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“交换鼠标左右键”原行为；配对并取得所需权限
- 步骤：记录 swapMouseButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapMouseButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：交换鼠标左右键 的用户结果符合固定源码定义：用户可配置 swapMouseButtons：交换鼠标左右键；固定声明与实际读取/消费入口分别附锚点；保留“交换鼠标左右键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapMouseButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-trigger-rumble

平台 selene-linux；Phase 16；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“左右扳机震动反馈”原行为；配对并取得所需权限
- 步骤：执行“左右扳机震动反馈”的操作并记录实际画面/音频/输入/管理结果；针对 trigger-rumble 切换实例、断连重连及撤销权限，分别记录状态
- 期望：左右扳机震动反馈 的用户结果符合固定源码定义：左右扳机震动反馈；保留“左右扳机震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 trigger-rumble 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-uidisplaymode

平台 selene-linux；Phase 27；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“界面列表呈现偏好”原行为；配对并取得所需权限
- 步骤：记录 uiDisplayMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 uiDisplayMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：界面列表呈现偏好 的用户结果符合固定源码定义：用户可配置 uiDisplayMode：界面列表呈现偏好；固定声明与实际读取/消费入口分别附锚点；保留“界面列表呈现偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 uiDisplayMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-unlockbitrate

平台 selene-linux；Phase 23；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“解锁高码率选择”原行为；配对并取得所需权限
- 步骤：记录 unlockBitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 unlockBitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：解锁高码率选择 的用户结果符合固定源码定义：用户可配置 unlockBitrate：解锁高码率选择；固定声明与实际读取/消费入口分别附锚点；保留“解锁高码率选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 unlockBitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-utf8-text

平台 selene-linux；Phase 11；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“UTF-8文本输入”原行为；配对并取得所需权限
- 步骤：执行“UTF-8文本输入”的操作并记录实际画面/音频/输入/管理结果；针对 utf8-text 切换实例、断连重连及撤销权限，分别记录状态
- 期望：UTF-8文本输入 的用户结果符合固定源码定义：UTF-8文本输入；保留“UTF-8文本输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 utf8-text 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-vaapi

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 VA-API驱动及X11/Wayland互操作条件；使用固定参考提交核对“Linux VA-API硬解/interop”原行为；配对并取得所需权限
- 步骤：执行“Linux VA-API硬解/interop”的操作并记录实际画面/音频/输入/管理结果；针对 vaapi 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Linux VA-API硬解/interop 的用户结果符合固定源码定义：Linux VA-API硬解/interop；保留“Linux VA-API硬解/interop”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 vaapi 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-videocodecconfig

平台 selene-linux；Phase 14；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“H.264/HEVC/AV1选择”原行为；配对并取得所需权限
- 步骤：记录 videoCodecConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 videoCodecConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264/HEVC/AV1选择 的用户结果符合固定源码定义：用户可配置 videoCodecConfig：H.264/HEVC/AV1选择；固定声明与实际读取/消费入口分别附锚点；保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 videoCodecConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-videodecoderselection

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“软解/硬解选择”原行为；配对并取得所需权限
- 步骤：记录 videoDecoderSelection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 videoDecoderSelection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：软解/硬解选择 的用户结果符合固定源码定义：用户可配置 videoDecoderSelection：软解/硬解选择；固定声明与实际读取/消费入口分别附锚点；保留“软解/硬解选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 videoDecoderSelection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-wake

平台 selene-linux；Phase 36；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Wake-on-LAN”原行为；配对并取得所需权限
- 步骤：执行“Wake-on-LAN”的操作并记录实际画面/音频/输入/管理结果；针对 wake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Wake-on-LAN 的用户结果符合固定源码定义：Wake-on-LAN；保留“Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-wayland-pacing

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 Wayland compositor协议/扩展，不与X11等同；使用固定参考提交核对“Wayland垂直同步/权限路径”原行为；配对并取得所需权限
- 步骤：执行“Wayland垂直同步/权限路径”的操作并记录实际画面/音频/输入/管理结果；针对 wayland-pacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Wayland垂直同步/权限路径 的用户结果符合固定源码定义：Wayland垂直同步/权限路径；保留“Wayland垂直同步/权限路径”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wayland-pacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-width

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频宽度”原行为；配对并取得所需权限
- 步骤：记录 width 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 width 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频宽度 的用户结果符合固定源码定义：用户可配置 width：视频宽度；固定声明与实际读取/消费入口分别附锚点；保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 width 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-linux-windowmode

平台 selene-linux；Phase 34；planned，未执行。

- 前提：准备 Linux；X11/Wayland/驱动后端分别验证 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“窗口/全屏/无边框”原行为；配对并取得所需权限
- 步骤：记录 windowMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 windowMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：窗口/全屏/无边框 的用户结果符合固定源码定义：用户可配置 windowMode：窗口/全屏/无边框；固定声明与实际读取/消费入口分别附锚点；保留“窗口/全屏/无边框”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 windowMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-macos-absolutemousemode

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“桌面绝对鼠标”原行为；配对并取得所需权限
- 步骤：记录 absoluteMouseMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteMouseMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：桌面绝对鼠标 的用户结果符合固定源码定义：用户可配置 absoluteMouseMode：桌面绝对鼠标；固定声明与实际读取/消费入口分别附锚点；保留“桌面绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteMouseMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-absolutetouchmode

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“绝对/相对触摸”原行为；配对并取得所需权限
- 步骤：记录 absoluteTouchMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteTouchMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：绝对/相对触摸 的用户结果符合固定源码定义：用户可配置 absoluteTouchMode：绝对/相对触摸；固定声明与实际读取/消费入口分别附锚点；保留“绝对/相对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteTouchMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-action-list

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 list”原行为；配对并取得所需权限
- 步骤：执行“命令动作 list”的操作并记录实际画面/音频/输入/管理结果；针对 action-list 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 list 的用户结果符合固定源码定义：命令动作 list；保留“命令动作 list”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-list 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-action-pair

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 pair”原行为；配对并取得所需权限
- 步骤：执行“命令动作 pair”的操作并记录实际画面/音频/输入/管理结果；针对 action-pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 pair 的用户结果符合固定源码定义：命令动作 pair；保留“命令动作 pair”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-action-quit

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 quit”原行为；配对并取得所需权限
- 步骤：执行“命令动作 quit”的操作并记录实际画面/音频/输入/管理结果；针对 action-quit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 quit 的用户结果符合固定源码定义：命令动作 quit；保留“命令动作 quit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-quit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-action-stream

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 stream”原行为；配对并取得所需权限
- 步骤：执行“命令动作 stream”的操作并记录实际画面/音频/输入/管理结果；针对 action-stream 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 stream 的用户结果符合固定源码定义：命令动作 stream；保留“命令动作 stream”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-stream 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-audioconfig

平台 selene-macos；Phase 12；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“立体声/5.1/7.1配置”原行为；配对并取得所需权限
- 步骤：记录 audioConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 audioConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：立体声/5.1/7.1配置 的用户结果符合固定源码定义：用户可配置 audioConfig：立体声/5.1/7.1配置；固定声明与实际读取/消费入口分别附锚点；保留“立体声/5.1/7.1配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audioConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-autoadjustbitrate

平台 selene-macos；Phase 23；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“分辨率变化时调整默认码率”原行为；配对并取得所需权限
- 步骤：记录 autoAdjustBitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 autoAdjustBitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率变化时调整默认码率 的用户结果符合固定源码定义：用户可配置 autoAdjustBitrate：分辨率变化时调整默认码率；固定声明与实际读取/消费入口分别附锚点；保留“分辨率变化时调整默认码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 autoAdjustBitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-av1

平台 selene-macos；Phase 14；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“AV1独立解码分支”原行为；配对并取得所需权限
- 步骤：执行“AV1独立解码分支”的操作并记录实际画面/音频/输入/管理结果；针对 av1 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AV1独立解码分支 的用户结果符合固定源码定义：AV1独立解码分支；保留“AV1独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-backgroundgamepad

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“后台手柄输入策略”原行为；配对并取得所需权限
- 步骤：记录 backgroundGamepad 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 backgroundGamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：后台手柄输入策略 的用户结果符合固定源码定义：用户可配置 backgroundGamepad：后台手柄输入策略；固定声明与实际读取/消费入口分别附锚点；保留“后台手柄输入策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 backgroundGamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-bitratekbps

平台 selene-macos；Phase 23；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“目标码率”原行为；配对并取得所需权限
- 步骤：记录 bitrateKbps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 bitrateKbps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：目标码率 的用户结果符合固定源码定义：用户可配置 bitrateKbps：目标码率；固定声明与实际读取/消费入口分别附锚点；保留“目标码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 bitrateKbps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-box-art

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用封面缓存/展示”原行为；配对并取得所需权限
- 步骤：执行“应用封面缓存/展示”的操作并记录实际画面/音频/输入/管理结果；针对 box-art 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用封面缓存/展示 的用户结果符合固定源码定义：应用封面缓存/展示；保留“应用封面缓存/展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 box-art 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-capturesyskeysmode

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“系统快捷键捕获策略”原行为；配对并取得所需权限
- 步骤：记录 captureSysKeysMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 captureSysKeysMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统快捷键捕获策略 的用户结果符合固定源码定义：用户可配置 captureSysKeysMode：系统快捷键捕获策略；固定声明与实际读取/消费入口分别附锚点；保留“系统快捷键捕获策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 captureSysKeysMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-1080

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 1080”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 1080；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-1080 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 1080 的用户结果符合固定源码定义：受控命令入口允许配置 1080；参数语义和允许值来自固定 parser；保留“命令参数 1080”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-1080 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-1440

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 1440”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 1440；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-1440 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 1440 的用户结果符合固定源码定义：受控命令入口允许配置 1440；参数语义和允许值来自固定 parser；保留“命令参数 1440”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-1440 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-4k

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 4K”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 4K；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-4K 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 4K 的用户结果符合固定源码定义：受控命令入口允许配置 4K；参数语义和允许值来自固定 parser；保留“命令参数 4K”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-4K 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-720

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 720”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 720；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-720 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 720 的用户结果符合固定源码定义：受控命令入口允许配置 720；参数语义和允许值来自固定 parser；保留“命令参数 720”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-720 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-absolute-mouse

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 absolute-mouse”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-absolute-mouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 absolute-mouse 的用户结果符合固定源码定义：受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser；保留“命令参数 absolute-mouse”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-absolute-mouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-audio-config

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 audio-config”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-audio-config 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 audio-config 的用户结果符合固定源码定义：受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser；保留“命令参数 audio-config”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-audio-config 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-audio-on-host

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 audio-on-host”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-audio-on-host 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 audio-on-host 的用户结果符合固定源码定义：受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser；保留“命令参数 audio-on-host”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-audio-on-host 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-background-gamepad

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 background-gamepad”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-background-gamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 background-gamepad 的用户结果符合固定源码定义：受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser；保留“命令参数 background-gamepad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-background-gamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-bitrate

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 bitrate”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-bitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 bitrate 的用户结果符合固定源码定义：受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser；保留“命令参数 bitrate”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-bitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-capture-system-keys

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 capture-system-keys”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-capture-system-keys 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 capture-system-keys 的用户结果符合固定源码定义：受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser；保留“命令参数 capture-system-keys”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-capture-system-keys 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-csv

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 csv”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 csv；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-csv 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 csv 的用户结果符合固定源码定义：受控命令入口允许配置 csv；参数语义和允许值来自固定 parser；保留“命令参数 csv”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-csv 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-display-mode

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 display-mode”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-display-mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 display-mode 的用户结果符合固定源码定义：受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser；保留“命令参数 display-mode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-display-mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-fps

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 fps”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 fps；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 fps 的用户结果符合固定源码定义：受控命令入口允许配置 fps；参数语义和允许值来自固定 parser；保留“命令参数 fps”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-frame-pacing

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 frame-pacing”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-frame-pacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 frame-pacing 的用户结果符合固定源码定义：受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser；保留“命令参数 frame-pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-frame-pacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-game-optimization

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 game-optimization”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-game-optimization 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 game-optimization 的用户结果符合固定源码定义：受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser；保留“命令参数 game-optimization”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-game-optimization 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-hdr

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 hdr”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-hdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 hdr 的用户结果符合固定源码定义：受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser；保留“命令参数 hdr”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-hdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-keep-awake

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 keep-awake”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-keep-awake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 keep-awake 的用户结果符合固定源码定义：受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser；保留“命令参数 keep-awake”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-keep-awake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-mouse-buttons-swap

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 mouse-buttons-swap”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-mouse-buttons-swap 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 mouse-buttons-swap 的用户结果符合固定源码定义：受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser；保留“命令参数 mouse-buttons-swap”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-mouse-buttons-swap 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-multi-controller

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 multi-controller”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-multi-controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 multi-controller 的用户结果符合固定源码定义：受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser；保留“命令参数 multi-controller”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-multi-controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-mute-on-focus-loss

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 mute-on-focus-loss”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-mute-on-focus-loss 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 mute-on-focus-loss 的用户结果符合固定源码定义：受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser；保留“命令参数 mute-on-focus-loss”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-mute-on-focus-loss 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-packet-size

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 packet-size”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-packet-size 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 packet-size 的用户结果符合固定源码定义：受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser；保留“命令参数 packet-size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-packet-size 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-performance-overlay

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 performance-overlay”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-performance-overlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 performance-overlay 的用户结果符合固定源码定义：受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser；保留“命令参数 performance-overlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-performance-overlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-pin

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 pin”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 pin；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-pin 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 pin 的用户结果符合固定源码定义：受控命令入口允许配置 pin；参数语义和允许值来自固定 parser；保留“命令参数 pin”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-pin 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-quit-after

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 quit-after”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-quit-after 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 quit-after 的用户结果符合固定源码定义：受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser；保留“命令参数 quit-after”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-quit-after 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-resolution

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 resolution”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-resolution 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 resolution 的用户结果符合固定源码定义：受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser；保留“命令参数 resolution”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-resolution 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-reverse-scroll-direction

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 reverse-scroll-direction”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-reverse-scroll-direction 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 reverse-scroll-direction 的用户结果符合固定源码定义：受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser；保留“命令参数 reverse-scroll-direction”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-reverse-scroll-direction 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-swap-gamepad-buttons

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 swap-gamepad-buttons”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-swap-gamepad-buttons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 swap-gamepad-buttons 的用户结果符合固定源码定义：受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser；保留“命令参数 swap-gamepad-buttons”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-swap-gamepad-buttons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-touchscreen-trackpad

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 touchscreen-trackpad”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-touchscreen-trackpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 touchscreen-trackpad 的用户结果符合固定源码定义：受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser；保留“命令参数 touchscreen-trackpad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-touchscreen-trackpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-verbose

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 verbose”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-verbose 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 verbose 的用户结果符合固定源码定义：受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser；保留“命令参数 verbose”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-verbose 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-video-codec

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 video-codec”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-video-codec 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 video-codec 的用户结果符合固定源码定义：受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser；保留“命令参数 video-codec”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-video-codec 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-video-decoder

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 video-decoder”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-video-decoder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 video-decoder 的用户结果符合固定源码定义：受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser；保留“命令参数 video-decoder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-video-decoder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-vsync

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 vsync”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-vsync 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 vsync 的用户结果符合固定源码定义：受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser；保留“命令参数 vsync”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-vsync 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-cli-yuv444

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 yuv444”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-yuv444 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 yuv444 的用户结果符合固定源码定义：受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser；保留“命令参数 yuv444”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-yuv444 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-configurationwarnings

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“配置警告”原行为；配对并取得所需权限
- 步骤：记录 configurationWarnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 configurationWarnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：配置警告 的用户结果符合固定源码定义：用户可配置 configurationWarnings：配置警告；固定声明与实际读取/消费入口分别附锚点；保留“配置警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 configurationWarnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-connectionwarnings

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“连接警告”原行为；配对并取得所需权限
- 步骤：记录 connectionWarnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 connectionWarnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接警告 的用户结果符合固定源码定义：用户可配置 connectionWarnings：连接警告；固定声明与实际读取/消费入口分别附锚点；保留“连接警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 connectionWarnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-controller-battery

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器电量上报”原行为；配对并取得所需权限
- 步骤：执行“控制器电量上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-battery 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器电量上报 的用户结果符合固定源码定义：控制器电量上报；保留“控制器电量上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-battery 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-controller-count

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商；使用固定参考提交核对“原README最多16玩家/控制器声明”原行为；配对并取得所需权限
- 步骤：执行“原README最多16玩家/控制器声明”的操作并记录实际画面/音频/输入/管理结果；针对 controller-count 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原README最多16玩家/控制器声明 的用户结果符合固定源码定义：原README最多16玩家/控制器声明；保留“原README最多16玩家/控制器声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-count 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-controller-motion

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动上报”原行为；配对并取得所需权限
- 步骤：执行“控制器运动上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动上报 的用户结果符合固定源码定义：控制器运动上报；保留“控制器运动上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-controller-touchpad

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器触摸板上报”原行为；配对并取得所需权限
- 步骤：执行“控制器触摸板上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-touchpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器触摸板上报 的用户结果符合固定源码定义：控制器触摸板上报；保留“控制器触摸板上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-touchpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-decoder-fallback

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“FFmpeg软/硬解路径与失败回退”原行为；配对并取得所需权限
- 步骤：执行“FFmpeg软/硬解路径与失败回退”的操作并记录实际画面/音频/输入/管理结果；针对 decoder-fallback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：FFmpeg软/硬解路径与失败回退 的用户结果符合固定源码定义：FFmpeg软/硬解路径与失败回退；保留“FFmpeg软/硬解路径与失败回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 decoder-fallback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-detectnetworkblocking

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“网络阻断检测”原行为；配对并取得所需权限
- 步骤：记录 detectNetworkBlocking 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 detectNetworkBlocking 切换实例、断连重连及撤销权限，分别记录状态
- 期望：网络阻断检测 的用户结果符合固定源码定义：用户可配置 detectNetworkBlocking：网络阻断检测；固定声明与实际读取/消费入口分别附锚点；保留“网络阻断检测”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 detectNetworkBlocking 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-discover

平台 selene-macos；Phase 7；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“发现/手工主机管理”原行为；配对并取得所需权限
- 步骤：执行“发现/手工主机管理”的操作并记录实际画面/音频/输入/管理结果；针对 discover 切换实例、断连重连及撤销权限，分别记录状态
- 期望：发现/手工主机管理 的用户结果符合固定源码定义：发现/手工主机管理；保留“发现/手工主机管理”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 discover 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-distribution-architectures

平台 selene-macos；Phase 40；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审；使用固定参考提交核对“平台原包与ARM32/ARM64/RISC-V入口”原行为；配对并取得所需权限
- 步骤：执行“平台原包与ARM32/ARM64/RISC-V入口”的操作并记录实际画面/音频/输入/管理结果；针对 distribution-architectures 切换实例、断连重连及撤销权限，分别记录状态
- 期望：平台原包与ARM32/ARM64/RISC-V入口 的用户结果符合固定源码定义：平台原包与ARM32/ARM64/RISC-V入口；保留“平台原包与ARM32/ARM64/RISC-V入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 distribution-architectures 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-enablehdr

平台 selene-macos；Phase 15；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“HDR/10-bit”原行为；配对并取得所需权限
- 步骤：记录 enableHdr 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableHdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR/10-bit 的用户结果符合固定源码定义：用户可配置 enableHdr：HDR/10-bit；固定声明与实际读取/消费入口分别附锚点；保留“HDR/10-bit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableHdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-enablemdns

平台 selene-macos；Phase 7；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“mDNS发现开关”原行为；配对并取得所需权限
- 步骤：记录 enableMdns 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableMdns 切换实例、断连重连及撤销权限，分别记录状态
- 期望：mDNS发现开关 的用户结果符合固定源码定义：用户可配置 enableMdns：mDNS发现开关；固定声明与实际读取/消费入口分别附锚点；保留“mDNS发现开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableMdns 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-enablevsync

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“垂直同步”原行为；配对并取得所需权限
- 步骤：记录 enableVsync 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableVsync 切换实例、断连重连及撤销权限，分别记录状态
- 期望：垂直同步 的用户结果符合固定源码定义：用户可配置 enableVsync：垂直同步；固定声明与实际读取/消费入口分别附锚点；保留“垂直同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableVsync 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-enableyuv444

平台 selene-macos；Phase 15；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“YUV 4:4:4”原行为；配对并取得所需权限
- 步骤：记录 enableYUV444 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableYUV444 切换实例、断连重连及撤销权限，分别记录状态
- 期望：YUV 4:4:4 的用户结果符合固定源码定义：用户可配置 enableYUV444：YUV 4:4:4；固定声明与实际读取/消费入口分别附锚点；保留“YUV 4:4:4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableYUV444 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-fps

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“目标帧率/高帧率”原行为；配对并取得所需权限
- 步骤：记录 fps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：目标帧率/高帧率 的用户结果符合固定源码定义：用户可配置 fps：目标帧率/高帧率；固定声明与实际读取/消费入口分别附锚点；保留“目标帧率/高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-framepacing

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧 pacing”原行为；配对并取得所需权限
- 步骤：记录 framePacing 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 framePacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧 pacing 的用户结果符合固定源码定义：用户可配置 framePacing：帧 pacing；固定声明与实际读取/消费入口分别附锚点；保留“帧 pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 framePacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-gameoptimizations

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机游戏优化”原行为；配对并取得所需权限
- 步骤：记录 gameOptimizations 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gameOptimizations 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机游戏优化 的用户结果符合固定源码定义：用户可配置 gameOptimizations：主机游戏优化；固定声明与实际读取/消费入口分别附锚点；保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gameOptimizations 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-gamepadmouse

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄鼠标模拟”原行为；配对并取得所需权限
- 步骤：记录 gamepadMouse 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepadMouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄鼠标模拟 的用户结果符合固定源码定义：用户可配置 gamepadMouse：手柄鼠标模拟；固定声明与实际读取/消费入口分别附锚点；保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepadMouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-h264

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“H.264基础视频与回退”原行为；配对并取得所需权限
- 步骤：执行“H.264基础视频与回退”的操作并记录实际画面/音频/输入/管理结果；针对 h264 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264基础视频与回退 的用户结果符合固定源码定义：H.264基础视频与回退；保留“H.264基础视频与回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 h264 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-hdr-main10

平台 selene-macos；Phase 15；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“HDR10-bit/色彩元数据”原行为；配对并取得所需权限
- 步骤：执行“HDR10-bit/色彩元数据”的操作并记录实际画面/音频/输入/管理结果；针对 hdr-main10 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR10-bit/色彩元数据 的用户结果符合固定源码定义：HDR10-bit/色彩元数据；保留“HDR10-bit/色彩元数据”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hdr-main10 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-height

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频高度”原行为；配对并取得所需权限
- 步骤：记录 height 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 height 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频高度 的用户结果符合固定源码定义：用户可配置 height：视频高度；固定声明与实际读取/消费入口分别附锚点；保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 height 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-hevc

平台 selene-macos；Phase 14；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“HEVC独立解码分支”原行为；配对并取得所需权限
- 步骤：执行“HEVC独立解码分支”的操作并记录实际画面/音频/输入/管理结果；针对 hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HEVC独立解码分支 的用户结果符合固定源码定义：HEVC独立解码分支；保留“HEVC独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keepawake

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“串流期间保持唤醒”原行为；配对并取得所需权限
- 步骤：记录 keepAwake 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keepAwake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：串流期间保持唤醒 的用户结果符合固定源码定义：用户可配置 keepAwake：串流期间保持唤醒；固定声明与实际读取/消费入口分别附锚点；保留“串流期间保持唤醒”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keepAwake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombopastetext

平台 selene-macos；Phase 25；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboPasteText”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboPasteText 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboPasteText 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboPasteText 的用户结果符合固定源码定义：通过 KeyComboPasteText 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboPasteText”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboPasteText 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycomboquit

平台 selene-macos；Phase 20；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboQuit”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboQuit 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboQuit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboQuit 的用户结果符合固定源码定义：通过 KeyComboQuit 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboQuit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboQuit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycomboquitandexit

平台 selene-macos；Phase 8；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboQuitAndExit”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboQuitAndExit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboQuitAndExit 的用户结果符合固定源码定义：通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboQuitAndExit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboQuitAndExit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotogglecursorhide

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleCursorHide”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleCursorHide 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleCursorHide 的用户结果符合固定源码定义：通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleCursorHide”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleCursorHide 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotogglefullscreen

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleFullScreen”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleFullScreen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleFullScreen 的用户结果符合固定源码定义：通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleFullScreen”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleFullScreen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotogglekeyboardgrab

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleKeyboardGrab”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleKeyboardGrab 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleKeyboardGrab 的用户结果符合固定源码定义：通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleKeyboardGrab”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleKeyboardGrab 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotoggleminimize

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleMinimize”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleMinimize 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleMinimize 的用户结果符合固定源码定义：通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleMinimize”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleMinimize 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotogglemousemode

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleMouseMode”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleMouseMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleMouseMode 的用户结果符合固定源码定义：通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleMouseMode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleMouseMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotogglepointerregionlock

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboTogglePointerRegionLock”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboTogglePointerRegionLock 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboTogglePointerRegionLock 的用户结果符合固定源码定义：通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboTogglePointerRegionLock”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboTogglePointerRegionLock 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycombotogglestatsoverlay

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleStatsOverlay”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleStatsOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleStatsOverlay 的用户结果符合固定源码定义：通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleStatsOverlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleStatsOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-keycomboungrabinput

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboUngrabInput”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboUngrabInput 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboUngrabInput 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboUngrabInput 的用户结果符合固定源码定义：通过 KeyComboUngrabInput 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboUngrabInput”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboUngrabInput 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-language

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“界面语言”原行为；配对并取得所需权限
- 步骤：记录 language 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 language 切换实例、断连重连及撤销权限，分别记录状态
- 期望：界面语言 的用户结果符合固定源码定义：用户可配置 language：界面语言；固定声明与实际读取/消费入口分别附锚点；保留“界面语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 language 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-list-apps

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用列表/启动/恢复/显式退出”原行为；配对并取得所需权限
- 步骤：执行“应用列表/启动/恢复/显式退出”的操作并记录实际画面/音频/输入/管理结果；针对 list-apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用列表/启动/恢复/显式退出 的用户结果符合固定源码定义：应用列表/启动/恢复/显式退出；保留“应用列表/启动/恢复/显式退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list-apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-metal

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 需要macOS/Xcode工具链及GPU/OS支持；VFY-02仅实机延期；使用固定参考提交核对“macOS Metal/VideoToolbox呈现入口”原行为；配对并取得所需权限
- 步骤：执行“macOS Metal/VideoToolbox呈现入口”的操作并记录实际画面/音频/输入/管理结果；针对 metal 切换实例、断连重连及撤销权限，分别记录状态
- 期望：macOS Metal/VideoToolbox呈现入口 的用户结果符合固定源码定义：macOS Metal/VideoToolbox呈现入口；保留“macOS Metal/VideoToolbox呈现入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 metal 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-multicontroller

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多个控制器独立编号”原行为；配对并取得所需权限
- 步骤：记录 multiController 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 multiController 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多个控制器独立编号 的用户结果符合固定源码定义：用户可配置 multiController：多个控制器独立编号；固定声明与实际读取/消费入口分别附锚点；保留“多个控制器独立编号”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multiController 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-multitouch

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 最多10点为README声明；需多点输入设备与主机native touch支持；使用固定参考提交核对“原生多点触摸（声明最多10点，设备及主机条件须实测）”原行为；配对并取得所需权限
- 步骤：执行“原生多点触摸（声明最多10点，设备及主机条件须实测）”的操作并记录实际画面/音频/输入/管理结果；针对 multitouch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生多点触摸（声明最多10点，设备及主机条件须实测） 的用户结果符合固定源码定义：原生多点触摸（声明最多10点，设备及主机条件须实测）；保留“原生多点触摸（声明最多10点，设备及主机条件须实测）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multitouch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-muteonfocusloss

平台 selene-macos；Phase 12；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“失焦静音”原行为；配对并取得所需权限
- 步骤：记录 muteOnFocusLoss 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 muteOnFocusLoss 切换实例、断连重连及撤销权限，分别记录状态
- 期望：失焦静音 的用户结果符合固定源码定义：用户可配置 muteOnFocusLoss：失焦静音；固定声明与实际读取/消费入口分别附锚点；保留“失焦静音”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 muteOnFocusLoss 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-pair

平台 selene-macos；Phase 7；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“配对确认与证书身份”原行为；配对并取得所需权限
- 步骤：执行“配对确认与证书身份”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：配对确认与证书身份 的用户结果符合固定源码定义：配对确认与证书身份；保留“配对确认与证书身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-pen

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 触控笔、SDL平台输入及Windows注入provider分别验证；使用固定参考提交核对“原生笔压力/方向输入”原行为；配对并取得所需权限
- 步骤：执行“原生笔压力/方向输入”的操作并记录实际画面/音频/输入/管理结果；针对 pen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生笔压力/方向输入 的用户结果符合固定源码定义：原生笔压力/方向输入；保留“原生笔压力/方向输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-playaudioonhost

平台 selene-macos；Phase 12；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机同时播放音频”原行为；配对并取得所需权限
- 步骤：记录 playAudioOnHost 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 playAudioOnHost 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机同时播放音频 的用户结果符合固定源码定义：用户可配置 playAudioOnHost：主机同时播放音频；固定声明与实际读取/消费入口分别附锚点；保留“主机同时播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 playAudioOnHost 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-precise-horizontal-wheel

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“高精度水平滚轮”原行为；配对并取得所需权限
- 步骤：执行“高精度水平滚轮”的操作并记录实际画面/音频/输入/管理结果；针对 precise-horizontal-wheel 切换实例、断连重连及撤销权限，分别记录状态
- 期望：高精度水平滚轮 的用户结果符合固定源码定义：高精度水平滚轮；保留“高精度水平滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 precise-horizontal-wheel 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-quitappafter

平台 selene-macos；Phase 8；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“断开后退出应用旧偏好”原行为；配对并取得所需权限
- 步骤：记录 quitAppAfter 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 quitAppAfter 切换实例、断连重连及撤销权限，分别记录状态
- 期望：断开后退出应用旧偏好 的用户结果符合固定源码定义：用户可配置 quitAppAfter：断开后退出应用旧偏好；固定声明与实际读取/消费入口分别附锚点；普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance
- 负例：拒绝 quitAppAfter 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-rendererselection

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“原生呈现后端选择”原行为；配对并取得所需权限
- 步骤：记录 rendererSelection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 rendererSelection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生呈现后端选择 的用户结果符合固定源码定义：用户可配置 rendererSelection：原生呈现后端选择；固定声明与实际读取/消费入口分别附锚点；保留“原生呈现后端选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rendererSelection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-reversescrolldirection

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“垂直/水平精确滚轮方向”原行为；配对并取得所需权限
- 步骤：记录 reverseScrollDirection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 reverseScrollDirection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：垂直/水平精确滚轮方向 的用户结果符合固定源码定义：用户可配置 reverseScrollDirection：垂直/水平精确滚轮方向；固定声明与实际读取/消费入口分别附锚点；保留“垂直/水平精确滚轮方向”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 reverseScrollDirection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-rgb-led

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器RGB LED反馈”原行为；配对并取得所需权限
- 步骤：执行“控制器RGB LED反馈”的操作并记录实际画面/音频/输入/管理结果；针对 rgb-led 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器RGB LED反馈 的用户结果符合固定源码定义：控制器RGB LED反馈；保留“控制器RGB LED反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rgb-led 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-richpresence

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Discord游戏活动展示”原行为；配对并取得所需权限
- 步骤：记录 richPresence 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 richPresence 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Discord游戏活动展示 的用户结果符合固定源码定义：用户可配置 richPresence：Discord游戏活动展示；固定声明与实际读取/消费入口分别附锚点；保留“Discord游戏活动展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 richPresence 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-rumble-feedback

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“低/高频控制器震动反馈”原行为；配对并取得所需权限
- 步骤：执行“低/高频控制器震动反馈”的操作并记录实际画面/音频/输入/管理结果；针对 rumble-feedback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：低/高频控制器震动反馈 的用户结果符合固定源码定义：低/高频控制器震动反馈；保留“低/高频控制器震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rumble-feedback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-showperformanceoverlay

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“串流统计叠层”原行为；配对并取得所需权限
- 步骤：记录 showPerformanceOverlay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 showPerformanceOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：串流统计叠层 的用户结果符合固定源码定义：用户可配置 showPerformanceOverlay：串流统计叠层；固定声明与实际读取/消费入口分别附锚点；保留“串流统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 showPerformanceOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-surround

平台 selene-macos；Phase 12；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多声道音频解码/输出”原行为；配对并取得所需权限
- 步骤：执行“多声道音频解码/输出”的操作并记录实际画面/音频/输入/管理结果；针对 surround 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多声道音频解码/输出 的用户结果符合固定源码定义：多声道音频解码/输出；保留“多声道音频解码/输出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 surround 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-swapfacebuttons

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“AB/XY交换”原行为；配对并取得所需权限
- 步骤：记录 swapFaceButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapFaceButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AB/XY交换 的用户结果符合固定源码定义：用户可配置 swapFaceButtons：AB/XY交换；固定声明与实际读取/消费入口分别附锚点；保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapFaceButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-swapmousebuttons

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“交换鼠标左右键”原行为；配对并取得所需权限
- 步骤：记录 swapMouseButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapMouseButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：交换鼠标左右键 的用户结果符合固定源码定义：用户可配置 swapMouseButtons：交换鼠标左右键；固定声明与实际读取/消费入口分别附锚点；保留“交换鼠标左右键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapMouseButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-trigger-rumble

平台 selene-macos；Phase 16；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“左右扳机震动反馈”原行为；配对并取得所需权限
- 步骤：执行“左右扳机震动反馈”的操作并记录实际画面/音频/输入/管理结果；针对 trigger-rumble 切换实例、断连重连及撤销权限，分别记录状态
- 期望：左右扳机震动反馈 的用户结果符合固定源码定义：左右扳机震动反馈；保留“左右扳机震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 trigger-rumble 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-uidisplaymode

平台 selene-macos；Phase 27；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“界面列表呈现偏好”原行为；配对并取得所需权限
- 步骤：记录 uiDisplayMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 uiDisplayMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：界面列表呈现偏好 的用户结果符合固定源码定义：用户可配置 uiDisplayMode：界面列表呈现偏好；固定声明与实际读取/消费入口分别附锚点；保留“界面列表呈现偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 uiDisplayMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-unlockbitrate

平台 selene-macos；Phase 23；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“解锁高码率选择”原行为；配对并取得所需权限
- 步骤：记录 unlockBitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 unlockBitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：解锁高码率选择 的用户结果符合固定源码定义：用户可配置 unlockBitrate：解锁高码率选择；固定声明与实际读取/消费入口分别附锚点；保留“解锁高码率选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 unlockBitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-utf8-text

平台 selene-macos；Phase 11；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“UTF-8文本输入”原行为；配对并取得所需权限
- 步骤：执行“UTF-8文本输入”的操作并记录实际画面/音频/输入/管理结果；针对 utf8-text 切换实例、断连重连及撤销权限，分别记录状态
- 期望：UTF-8文本输入 的用户结果符合固定源码定义：UTF-8文本输入；保留“UTF-8文本输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 utf8-text 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-videocodecconfig

平台 selene-macos；Phase 14；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“H.264/HEVC/AV1选择”原行为；配对并取得所需权限
- 步骤：记录 videoCodecConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 videoCodecConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264/HEVC/AV1选择 的用户结果符合固定源码定义：用户可配置 videoCodecConfig：H.264/HEVC/AV1选择；固定声明与实际读取/消费入口分别附锚点；保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 videoCodecConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-videodecoderselection

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“软解/硬解选择”原行为；配对并取得所需权限
- 步骤：记录 videoDecoderSelection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 videoDecoderSelection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：软解/硬解选择 的用户结果符合固定源码定义：用户可配置 videoDecoderSelection：软解/硬解选择；固定声明与实际读取/消费入口分别附锚点；保留“软解/硬解选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 videoDecoderSelection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-wake

平台 selene-macos；Phase 36；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Wake-on-LAN”原行为；配对并取得所需权限
- 步骤：执行“Wake-on-LAN”的操作并记录实际画面/音频/输入/管理结果；针对 wake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Wake-on-LAN 的用户结果符合固定源码定义：Wake-on-LAN；保留“Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-width

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频宽度”原行为；配对并取得所需权限
- 步骤：记录 width 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 width 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频宽度 的用户结果符合固定源码定义：用户可配置 width：视频宽度；固定声明与实际读取/消费入口分别附锚点；保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 width 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-macos-windowmode

平台 selene-macos；Phase 30；planned，未执行。

- 前提：准备 macOS；按 Apple 原生后端/权限分支；最低范围待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“窗口/全屏/无边框”原行为；配对并取得所需权限
- 步骤：记录 windowMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 windowMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：窗口/全屏/无边框 的用户结果符合固定源码定义：用户可配置 windowMode：窗口/全屏/无边框；固定声明与实际读取/消费入口分别附锚点；保留“窗口/全屏/无边框”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 windowMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；实机 TODO VFY-02；不以构建代替

### case-selene-windows-absolutemousemode

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“桌面绝对鼠标”原行为；配对并取得所需权限
- 步骤：记录 absoluteMouseMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteMouseMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：桌面绝对鼠标 的用户结果符合固定源码定义：用户可配置 absoluteMouseMode：桌面绝对鼠标；固定声明与实际读取/消费入口分别附锚点；保留“桌面绝对鼠标”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteMouseMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-absolutetouchmode

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“绝对/相对触摸”原行为；配对并取得所需权限
- 步骤：记录 absoluteTouchMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 absoluteTouchMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：绝对/相对触摸 的用户结果符合固定源码定义：用户可配置 absoluteTouchMode：绝对/相对触摸；固定声明与实际读取/消费入口分别附锚点；保留“绝对/相对触摸”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 absoluteTouchMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-action-list

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 list”原行为；配对并取得所需权限
- 步骤：执行“命令动作 list”的操作并记录实际画面/音频/输入/管理结果；针对 action-list 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 list 的用户结果符合固定源码定义：命令动作 list；保留“命令动作 list”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-list 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-action-pair

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 pair”原行为；配对并取得所需权限
- 步骤：执行“命令动作 pair”的操作并记录实际画面/音频/输入/管理结果；针对 action-pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 pair 的用户结果符合固定源码定义：命令动作 pair；保留“命令动作 pair”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-action-quit

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 quit”原行为；配对并取得所需权限
- 步骤：执行“命令动作 quit”的操作并记录实际画面/音频/输入/管理结果；针对 action-quit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 quit 的用户结果符合固定源码定义：命令动作 quit；保留“命令动作 quit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-quit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-action-stream

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令动作 stream”原行为；配对并取得所需权限
- 步骤：执行“命令动作 stream”的操作并记录实际画面/音频/输入/管理结果；针对 action-stream 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令动作 stream 的用户结果符合固定源码定义：命令动作 stream；保留“命令动作 stream”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 action-stream 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-audioconfig

平台 selene-windows；Phase 12；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“立体声/5.1/7.1配置”原行为；配对并取得所需权限
- 步骤：记录 audioConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 audioConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：立体声/5.1/7.1配置 的用户结果符合固定源码定义：用户可配置 audioConfig：立体声/5.1/7.1配置；固定声明与实际读取/消费入口分别附锚点；保留“立体声/5.1/7.1配置”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 audioConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-autoadjustbitrate

平台 selene-windows；Phase 23；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“分辨率变化时调整默认码率”原行为；配对并取得所需权限
- 步骤：记录 autoAdjustBitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 autoAdjustBitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：分辨率变化时调整默认码率 的用户结果符合固定源码定义：用户可配置 autoAdjustBitrate：分辨率变化时调整默认码率；固定声明与实际读取/消费入口分别附锚点；保留“分辨率变化时调整默认码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 autoAdjustBitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-av1

平台 selene-windows；Phase 14；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“AV1独立解码分支”原行为；配对并取得所需权限
- 步骤：执行“AV1独立解码分支”的操作并记录实际画面/音频/输入/管理结果；针对 av1 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AV1独立解码分支 的用户结果符合固定源码定义：AV1独立解码分支；保留“AV1独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 av1 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-backgroundgamepad

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“后台手柄输入策略”原行为；配对并取得所需权限
- 步骤：记录 backgroundGamepad 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 backgroundGamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：后台手柄输入策略 的用户结果符合固定源码定义：用户可配置 backgroundGamepad：后台手柄输入策略；固定声明与实际读取/消费入口分别附锚点；保留“后台手柄输入策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 backgroundGamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-bitratekbps

平台 selene-windows；Phase 23；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“目标码率”原行为；配对并取得所需权限
- 步骤：记录 bitrateKbps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 bitrateKbps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：目标码率 的用户结果符合固定源码定义：用户可配置 bitrateKbps：目标码率；固定声明与实际读取/消费入口分别附锚点；保留“目标码率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 bitrateKbps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-box-art

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用封面缓存/展示”原行为；配对并取得所需权限
- 步骤：执行“应用封面缓存/展示”的操作并记录实际画面/音频/输入/管理结果；针对 box-art 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用封面缓存/展示 的用户结果符合固定源码定义：应用封面缓存/展示；保留“应用封面缓存/展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 box-art 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-capturesyskeysmode

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“系统快捷键捕获策略”原行为；配对并取得所需权限
- 步骤：记录 captureSysKeysMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 captureSysKeysMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：系统快捷键捕获策略 的用户结果符合固定源码定义：用户可配置 captureSysKeysMode：系统快捷键捕获策略；固定声明与实际读取/消费入口分别附锚点；保留“系统快捷键捕获策略”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 captureSysKeysMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-1080

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 1080”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 1080；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-1080 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 1080 的用户结果符合固定源码定义：受控命令入口允许配置 1080；参数语义和允许值来自固定 parser；保留“命令参数 1080”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-1080 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-1440

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 1440”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 1440；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-1440 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 1440 的用户结果符合固定源码定义：受控命令入口允许配置 1440；参数语义和允许值来自固定 parser；保留“命令参数 1440”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-1440 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-4k

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 4K”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 4K；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-4K 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 4K 的用户结果符合固定源码定义：受控命令入口允许配置 4K；参数语义和允许值来自固定 parser；保留“命令参数 4K”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-4K 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-720

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 720”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 720；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-720 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 720 的用户结果符合固定源码定义：受控命令入口允许配置 720；参数语义和允许值来自固定 parser；保留“命令参数 720”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-720 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-absolute-mouse

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 absolute-mouse”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-absolute-mouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 absolute-mouse 的用户结果符合固定源码定义：受控命令入口允许配置 absolute-mouse；参数语义和允许值来自固定 parser；保留“命令参数 absolute-mouse”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-absolute-mouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-audio-config

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 audio-config”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-audio-config 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 audio-config 的用户结果符合固定源码定义：受控命令入口允许配置 audio-config；参数语义和允许值来自固定 parser；保留“命令参数 audio-config”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-audio-config 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-audio-on-host

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 audio-on-host”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-audio-on-host 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 audio-on-host 的用户结果符合固定源码定义：受控命令入口允许配置 audio-on-host；参数语义和允许值来自固定 parser；保留“命令参数 audio-on-host”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-audio-on-host 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-background-gamepad

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 background-gamepad”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-background-gamepad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 background-gamepad 的用户结果符合固定源码定义：受控命令入口允许配置 background-gamepad；参数语义和允许值来自固定 parser；保留“命令参数 background-gamepad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-background-gamepad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-bitrate

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 bitrate”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-bitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 bitrate 的用户结果符合固定源码定义：受控命令入口允许配置 bitrate；参数语义和允许值来自固定 parser；保留“命令参数 bitrate”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-bitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-capture-system-keys

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 capture-system-keys”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-capture-system-keys 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 capture-system-keys 的用户结果符合固定源码定义：受控命令入口允许配置 capture-system-keys；参数语义和允许值来自固定 parser；保留“命令参数 capture-system-keys”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-capture-system-keys 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-csv

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 csv”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 csv；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-csv 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 csv 的用户结果符合固定源码定义：受控命令入口允许配置 csv；参数语义和允许值来自固定 parser；保留“命令参数 csv”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-csv 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-display-mode

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 display-mode”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-display-mode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 display-mode 的用户结果符合固定源码定义：受控命令入口允许配置 display-mode；参数语义和允许值来自固定 parser；保留“命令参数 display-mode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-display-mode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-fps

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 fps”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 fps；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 fps 的用户结果符合固定源码定义：受控命令入口允许配置 fps；参数语义和允许值来自固定 parser；保留“命令参数 fps”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-frame-pacing

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 frame-pacing”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-frame-pacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 frame-pacing 的用户结果符合固定源码定义：受控命令入口允许配置 frame-pacing；参数语义和允许值来自固定 parser；保留“命令参数 frame-pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-frame-pacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-game-optimization

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 game-optimization”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-game-optimization 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 game-optimization 的用户结果符合固定源码定义：受控命令入口允许配置 game-optimization；参数语义和允许值来自固定 parser；保留“命令参数 game-optimization”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-game-optimization 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-hdr

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 hdr”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-hdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 hdr 的用户结果符合固定源码定义：受控命令入口允许配置 hdr；参数语义和允许值来自固定 parser；保留“命令参数 hdr”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-hdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-keep-awake

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 keep-awake”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-keep-awake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 keep-awake 的用户结果符合固定源码定义：受控命令入口允许配置 keep-awake；参数语义和允许值来自固定 parser；保留“命令参数 keep-awake”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-keep-awake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-mouse-buttons-swap

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 mouse-buttons-swap”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-mouse-buttons-swap 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 mouse-buttons-swap 的用户结果符合固定源码定义：受控命令入口允许配置 mouse-buttons-swap；参数语义和允许值来自固定 parser；保留“命令参数 mouse-buttons-swap”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-mouse-buttons-swap 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-multi-controller

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 multi-controller”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-multi-controller 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 multi-controller 的用户结果符合固定源码定义：受控命令入口允许配置 multi-controller；参数语义和允许值来自固定 parser；保留“命令参数 multi-controller”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-multi-controller 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-mute-on-focus-loss

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 mute-on-focus-loss”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-mute-on-focus-loss 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 mute-on-focus-loss 的用户结果符合固定源码定义：受控命令入口允许配置 mute-on-focus-loss；参数语义和允许值来自固定 parser；保留“命令参数 mute-on-focus-loss”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-mute-on-focus-loss 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-packet-size

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 packet-size”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-packet-size 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 packet-size 的用户结果符合固定源码定义：受控命令入口允许配置 packet-size；参数语义和允许值来自固定 parser；保留“命令参数 packet-size”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-packet-size 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-performance-overlay

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 performance-overlay”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-performance-overlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 performance-overlay 的用户结果符合固定源码定义：受控命令入口允许配置 performance-overlay；参数语义和允许值来自固定 parser；保留“命令参数 performance-overlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-performance-overlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-pin

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 pin”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 pin；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-pin 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 pin 的用户结果符合固定源码定义：受控命令入口允许配置 pin；参数语义和允许值来自固定 parser；保留“命令参数 pin”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-pin 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-quit-after

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 quit-after”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-quit-after 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 quit-after 的用户结果符合固定源码定义：受控命令入口允许配置 quit-after；参数语义和允许值来自固定 parser；保留“命令参数 quit-after”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-quit-after 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-resolution

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 resolution”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-resolution 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 resolution 的用户结果符合固定源码定义：受控命令入口允许配置 resolution；参数语义和允许值来自固定 parser；保留“命令参数 resolution”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-resolution 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-reverse-scroll-direction

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 reverse-scroll-direction”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-reverse-scroll-direction 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 reverse-scroll-direction 的用户结果符合固定源码定义：受控命令入口允许配置 reverse-scroll-direction；参数语义和允许值来自固定 parser；保留“命令参数 reverse-scroll-direction”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-reverse-scroll-direction 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-swap-gamepad-buttons

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 swap-gamepad-buttons”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-swap-gamepad-buttons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 swap-gamepad-buttons 的用户结果符合固定源码定义：受控命令入口允许配置 swap-gamepad-buttons；参数语义和允许值来自固定 parser；保留“命令参数 swap-gamepad-buttons”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-swap-gamepad-buttons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-touchscreen-trackpad

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 touchscreen-trackpad”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-touchscreen-trackpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 touchscreen-trackpad 的用户结果符合固定源码定义：受控命令入口允许配置 touchscreen-trackpad；参数语义和允许值来自固定 parser；保留“命令参数 touchscreen-trackpad”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-touchscreen-trackpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-verbose

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 verbose”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-verbose 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 verbose 的用户结果符合固定源码定义：受控命令入口允许配置 verbose；参数语义和允许值来自固定 parser；保留“命令参数 verbose”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-verbose 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-video-codec

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 video-codec”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-video-codec 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 video-codec 的用户结果符合固定源码定义：受控命令入口允许配置 video-codec；参数语义和允许值来自固定 parser；保留“命令参数 video-codec”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-video-codec 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-video-decoder

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 video-decoder”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-video-decoder 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 video-decoder 的用户结果符合固定源码定义：受控命令入口允许配置 video-decoder；参数语义和允许值来自固定 parser；保留“命令参数 video-decoder”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-video-decoder 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-vsync

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 vsync”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-vsync 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 vsync 的用户结果符合固定源码定义：受控命令入口允许配置 vsync；参数语义和允许值来自固定 parser；保留“命令参数 vsync”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-vsync 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-cli-yuv444

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“命令参数 yuv444”原行为；配对并取得所需权限
- 步骤：执行“受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser”的操作并记录实际画面/音频/输入/管理结果；针对 cli-yuv444 切换实例、断连重连及撤销权限，分别记录状态
- 期望：命令参数 yuv444 的用户结果符合固定源码定义：受控命令入口允许配置 yuv444；参数语义和允许值来自固定 parser；保留“命令参数 yuv444”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 cli-yuv444 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-configurationwarnings

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“配置警告”原行为；配对并取得所需权限
- 步骤：记录 configurationWarnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 configurationWarnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：配置警告 的用户结果符合固定源码定义：用户可配置 configurationWarnings：配置警告；固定声明与实际读取/消费入口分别附锚点；保留“配置警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 configurationWarnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-connectionwarnings

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“连接警告”原行为；配对并取得所需权限
- 步骤：记录 connectionWarnings 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 connectionWarnings 切换实例、断连重连及撤销权限，分别记录状态
- 期望：连接警告 的用户结果符合固定源码定义：用户可配置 connectionWarnings：连接警告；固定声明与实际读取/消费入口分别附锚点；保留“连接警告”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 connectionWarnings 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-controller-battery

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器电量上报”原行为；配对并取得所需权限
- 步骤：执行“控制器电量上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-battery 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器电量上报 的用户结果符合固定源码定义：控制器电量上报；保留“控制器电量上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-battery 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-controller-count

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 客户端声明不等于Windows虚拟HID/VIGEm运行数量；按provider资源能力协商；使用固定参考提交核对“原README最多16玩家/控制器声明”原行为；配对并取得所需权限
- 步骤：执行“原README最多16玩家/控制器声明”的操作并记录实际画面/音频/输入/管理结果；针对 controller-count 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原README最多16玩家/控制器声明 的用户结果符合固定源码定义：原README最多16玩家/控制器声明；保留“原README最多16玩家/控制器声明”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-count 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-controller-motion

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器运动上报”原行为；配对并取得所需权限
- 步骤：执行“控制器运动上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-motion 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器运动上报 的用户结果符合固定源码定义：控制器运动上报；保留“控制器运动上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-motion 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-controller-touchpad

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器触摸板上报”原行为；配对并取得所需权限
- 步骤：执行“控制器触摸板上报”的操作并记录实际画面/音频/输入/管理结果；针对 controller-touchpad 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器触摸板上报 的用户结果符合固定源码定义：控制器触摸板上报；保留“控制器触摸板上报”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 controller-touchpad 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-decoder-fallback

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“FFmpeg软/硬解路径与失败回退”原行为；配对并取得所需权限
- 步骤：执行“FFmpeg软/硬解路径与失败回退”的操作并记录实际画面/音频/输入/管理结果；针对 decoder-fallback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：FFmpeg软/硬解路径与失败回退 的用户结果符合固定源码定义：FFmpeg软/硬解路径与失败回退；保留“FFmpeg软/硬解路径与失败回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 decoder-fallback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-detectnetworkblocking

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“网络阻断检测”原行为；配对并取得所需权限
- 步骤：记录 detectNetworkBlocking 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 detectNetworkBlocking 切换实例、断连重连及撤销权限，分别记录状态
- 期望：网络阻断检测 的用户结果符合固定源码定义：用户可配置 detectNetworkBlocking：网络阻断检测；固定声明与实际读取/消费入口分别附锚点；保留“网络阻断检测”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 detectNetworkBlocking 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-discover

平台 selene-windows；Phase 7；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“发现/手工主机管理”原行为；配对并取得所需权限
- 步骤：执行“发现/手工主机管理”的操作并记录实际画面/音频/输入/管理结果；针对 discover 切换实例、断连重连及撤销权限，分别记录状态
- 期望：发现/手工主机管理 的用户结果符合固定源码定义：发现/手工主机管理；保留“发现/手工主机管理”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 discover 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-distribution-architectures

平台 selene-windows；Phase 39；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 原 Qt Linux 包含 ARM32/64、RISC-V 实验包；Aether Flutter目标差异必须人审；使用固定参考提交核对“平台原包与ARM32/ARM64/RISC-V入口”原行为；配对并取得所需权限
- 步骤：执行“平台原包与ARM32/ARM64/RISC-V入口”的操作并记录实际画面/音频/输入/管理结果；针对 distribution-architectures 切换实例、断连重连及撤销权限，分别记录状态
- 期望：平台原包与ARM32/ARM64/RISC-V入口 的用户结果符合固定源码定义：平台原包与ARM32/ARM64/RISC-V入口；保留“平台原包与ARM32/ARM64/RISC-V入口”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 distribution-architectures 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-enablehdr

平台 selene-windows；Phase 15；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“HDR/10-bit”原行为；配对并取得所需权限
- 步骤：记录 enableHdr 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableHdr 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR/10-bit 的用户结果符合固定源码定义：用户可配置 enableHdr：HDR/10-bit；固定声明与实际读取/消费入口分别附锚点；保留“HDR/10-bit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableHdr 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-enablemdns

平台 selene-windows；Phase 7；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“mDNS发现开关”原行为；配对并取得所需权限
- 步骤：记录 enableMdns 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableMdns 切换实例、断连重连及撤销权限，分别记录状态
- 期望：mDNS发现开关 的用户结果符合固定源码定义：用户可配置 enableMdns：mDNS发现开关；固定声明与实际读取/消费入口分别附锚点；保留“mDNS发现开关”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableMdns 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-enablevsync

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“垂直同步”原行为；配对并取得所需权限
- 步骤：记录 enableVsync 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableVsync 切换实例、断连重连及撤销权限，分别记录状态
- 期望：垂直同步 的用户结果符合固定源码定义：用户可配置 enableVsync：垂直同步；固定声明与实际读取/消费入口分别附锚点；保留“垂直同步”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableVsync 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-enableyuv444

平台 selene-windows；Phase 15；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“YUV 4:4:4”原行为；配对并取得所需权限
- 步骤：记录 enableYUV444 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 enableYUV444 切换实例、断连重连及撤销权限，分别记录状态
- 期望：YUV 4:4:4 的用户结果符合固定源码定义：用户可配置 enableYUV444：YUV 4:4:4；固定声明与实际读取/消费入口分别附锚点；保留“YUV 4:4:4”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 enableYUV444 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-fps

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“目标帧率/高帧率”原行为；配对并取得所需权限
- 步骤：记录 fps 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 fps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：目标帧率/高帧率 的用户结果符合固定源码定义：用户可配置 fps：目标帧率/高帧率；固定声明与实际读取/消费入口分别附锚点；保留“目标帧率/高帧率”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 fps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-framepacing

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“帧 pacing”原行为；配对并取得所需权限
- 步骤：记录 framePacing 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 framePacing 切换实例、断连重连及撤销权限，分别记录状态
- 期望：帧 pacing 的用户结果符合固定源码定义：用户可配置 framePacing：帧 pacing；固定声明与实际读取/消费入口分别附锚点；保留“帧 pacing”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 framePacing 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-gameoptimizations

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机游戏优化”原行为；配对并取得所需权限
- 步骤：记录 gameOptimizations 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gameOptimizations 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机游戏优化 的用户结果符合固定源码定义：用户可配置 gameOptimizations：主机游戏优化；固定声明与实际读取/消费入口分别附锚点；保留“主机游戏优化”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gameOptimizations 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-gamepadmouse

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“手柄鼠标模拟”原行为；配对并取得所需权限
- 步骤：记录 gamepadMouse 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 gamepadMouse 切换实例、断连重连及撤销权限，分别记录状态
- 期望：手柄鼠标模拟 的用户结果符合固定源码定义：用户可配置 gamepadMouse：手柄鼠标模拟；固定声明与实际读取/消费入口分别附锚点；保留“手柄鼠标模拟”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 gamepadMouse 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-h264

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“H.264基础视频与回退”原行为；配对并取得所需权限
- 步骤：执行“H.264基础视频与回退”的操作并记录实际画面/音频/输入/管理结果；针对 h264 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264基础视频与回退 的用户结果符合固定源码定义：H.264基础视频与回退；保留“H.264基础视频与回退”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 h264 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-hdr-main10

平台 selene-windows；Phase 15；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“HDR10-bit/色彩元数据”原行为；配对并取得所需权限
- 步骤：执行“HDR10-bit/色彩元数据”的操作并记录实际画面/音频/输入/管理结果；针对 hdr-main10 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HDR10-bit/色彩元数据 的用户结果符合固定源码定义：HDR10-bit/色彩元数据；保留“HDR10-bit/色彩元数据”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hdr-main10 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-height

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频高度”原行为；配对并取得所需权限
- 步骤：记录 height 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 height 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频高度 的用户结果符合固定源码定义：用户可配置 height：视频高度；固定声明与实际读取/消费入口分别附锚点；保留“视频高度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 height 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-hevc

平台 selene-windows；Phase 14；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 codec/profile和实际GPU/驱动/显示器条件独立协商；原生后端分支尚未实测；使用固定参考提交核对“HEVC独立解码分支”原行为；配对并取得所需权限
- 步骤：执行“HEVC独立解码分支”的操作并记录实际画面/音频/输入/管理结果；针对 hevc 切换实例、断连重连及撤销权限，分别记录状态
- 期望：HEVC独立解码分支 的用户结果符合固定源码定义：HEVC独立解码分支；保留“HEVC独立解码分支”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 hevc 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keepawake

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“串流期间保持唤醒”原行为；配对并取得所需权限
- 步骤：记录 keepAwake 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 keepAwake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：串流期间保持唤醒 的用户结果符合固定源码定义：用户可配置 keepAwake：串流期间保持唤醒；固定声明与实际读取/消费入口分别附锚点；保留“串流期间保持唤醒”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 keepAwake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombopastetext

平台 selene-windows；Phase 25；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboPasteText”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboPasteText 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboPasteText 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboPasteText 的用户结果符合固定源码定义：通过 KeyComboPasteText 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboPasteText”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboPasteText 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycomboquit

平台 selene-windows；Phase 20；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboQuit”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboQuit 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboQuit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboQuit 的用户结果符合固定源码定义：通过 KeyComboQuit 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboQuit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboQuit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycomboquitandexit

平台 selene-windows；Phase 8；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboQuitAndExit”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboQuitAndExit 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboQuitAndExit 的用户结果符合固定源码定义：通过 KeyComboQuitAndExit 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboQuitAndExit”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboQuitAndExit 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotogglecursorhide

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleCursorHide”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleCursorHide 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleCursorHide 的用户结果符合固定源码定义：通过 KeyComboToggleCursorHide 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleCursorHide”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleCursorHide 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotogglefullscreen

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleFullScreen”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleFullScreen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleFullScreen 的用户结果符合固定源码定义：通过 KeyComboToggleFullScreen 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleFullScreen”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleFullScreen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotogglekeyboardgrab

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleKeyboardGrab”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleKeyboardGrab 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleKeyboardGrab 的用户结果符合固定源码定义：通过 KeyComboToggleKeyboardGrab 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleKeyboardGrab”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleKeyboardGrab 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotoggleminimize

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleMinimize”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleMinimize 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleMinimize 的用户结果符合固定源码定义：通过 KeyComboToggleMinimize 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleMinimize”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleMinimize 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotogglemousemode

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleMouseMode”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleMouseMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleMouseMode 的用户结果符合固定源码定义：通过 KeyComboToggleMouseMode 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleMouseMode”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleMouseMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotogglepointerregionlock

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboTogglePointerRegionLock”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboTogglePointerRegionLock 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboTogglePointerRegionLock 的用户结果符合固定源码定义：通过 KeyComboTogglePointerRegionLock 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboTogglePointerRegionLock”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboTogglePointerRegionLock 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycombotogglestatsoverlay

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboToggleStatsOverlay”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboToggleStatsOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboToggleStatsOverlay 的用户结果符合固定源码定义：通过 KeyComboToggleStatsOverlay 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboToggleStatsOverlay”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboToggleStatsOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-keycomboungrabinput

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“本地快捷键 KeyComboUngrabInput”原行为；配对并取得所需权限
- 步骤：执行“通过 KeyComboUngrabInput 快捷键触发对应本地控制行为”的操作并记录实际画面/音频/输入/管理结果；针对 KeyComboUngrabInput 切换实例、断连重连及撤销权限，分别记录状态
- 期望：本地快捷键 KeyComboUngrabInput 的用户结果符合固定源码定义：通过 KeyComboUngrabInput 快捷键触发对应本地控制行为；保留“本地快捷键 KeyComboUngrabInput”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 KeyComboUngrabInput 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-language

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“界面语言”原行为；配对并取得所需权限
- 步骤：记录 language 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 language 切换实例、断连重连及撤销权限，分别记录状态
- 期望：界面语言 的用户结果符合固定源码定义：用户可配置 language：界面语言；固定声明与实际读取/消费入口分别附锚点；保留“界面语言”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 language 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-list-apps

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“应用列表/启动/恢复/显式退出”原行为；配对并取得所需权限
- 步骤：执行“应用列表/启动/恢复/显式退出”的操作并记录实际画面/音频/输入/管理结果；针对 list-apps 切换实例、断连重连及撤销权限，分别记录状态
- 期望：应用列表/启动/恢复/显式退出 的用户结果符合固定源码定义：应用列表/启动/恢复/显式退出；保留“应用列表/启动/恢复/显式退出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 list-apps 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-multicontroller

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多个控制器独立编号”原行为；配对并取得所需权限
- 步骤：记录 multiController 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 multiController 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多个控制器独立编号 的用户结果符合固定源码定义：用户可配置 multiController：多个控制器独立编号；固定声明与实际读取/消费入口分别附锚点；保留“多个控制器独立编号”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multiController 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-multitouch

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 最多10点为README声明；需多点输入设备与主机native touch支持；使用固定参考提交核对“原生多点触摸（声明最多10点，设备及主机条件须实测）”原行为；配对并取得所需权限
- 步骤：执行“原生多点触摸（声明最多10点，设备及主机条件须实测）”的操作并记录实际画面/音频/输入/管理结果；针对 multitouch 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生多点触摸（声明最多10点，设备及主机条件须实测） 的用户结果符合固定源码定义：原生多点触摸（声明最多10点，设备及主机条件须实测）；保留“原生多点触摸（声明最多10点，设备及主机条件须实测）”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 multitouch 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-muteonfocusloss

平台 selene-windows；Phase 12；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“失焦静音”原行为；配对并取得所需权限
- 步骤：记录 muteOnFocusLoss 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 muteOnFocusLoss 切换实例、断连重连及撤销权限，分别记录状态
- 期望：失焦静音 的用户结果符合固定源码定义：用户可配置 muteOnFocusLoss：失焦静音；固定声明与实际读取/消费入口分别附锚点；保留“失焦静音”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 muteOnFocusLoss 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-pair

平台 selene-windows；Phase 7；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“配对确认与证书身份”原行为；配对并取得所需权限
- 步骤：执行“配对确认与证书身份”的操作并记录实际画面/音频/输入/管理结果；针对 pair 切换实例、断连重连及撤销权限，分别记录状态
- 期望：配对确认与证书身份 的用户结果符合固定源码定义：配对确认与证书身份；保留“配对确认与证书身份”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pair 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-pen

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 触控笔、SDL平台输入及Windows注入provider分别验证；使用固定参考提交核对“原生笔压力/方向输入”原行为；配对并取得所需权限
- 步骤：执行“原生笔压力/方向输入”的操作并记录实际画面/音频/输入/管理结果；针对 pen 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生笔压力/方向输入 的用户结果符合固定源码定义：原生笔压力/方向输入；保留“原生笔压力/方向输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 pen 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-playaudioonhost

平台 selene-windows；Phase 12；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“主机同时播放音频”原行为；配对并取得所需权限
- 步骤：记录 playAudioOnHost 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 playAudioOnHost 切换实例、断连重连及撤销权限，分别记录状态
- 期望：主机同时播放音频 的用户结果符合固定源码定义：用户可配置 playAudioOnHost：主机同时播放音频；固定声明与实际读取/消费入口分别附锚点；保留“主机同时播放音频”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 playAudioOnHost 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-precise-horizontal-wheel

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“高精度水平滚轮”原行为；配对并取得所需权限
- 步骤：执行“高精度水平滚轮”的操作并记录实际画面/音频/输入/管理结果；针对 precise-horizontal-wheel 切换实例、断连重连及撤销权限，分别记录状态
- 期望：高精度水平滚轮 的用户结果符合固定源码定义：高精度水平滚轮；保留“高精度水平滚轮”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 precise-horizontal-wheel 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-quitappafter

平台 selene-windows；Phase 8；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“断开后退出应用旧偏好”原行为；配对并取得所需权限
- 步骤：记录 quitAppAfter 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 quitAppAfter 切换实例、断连重连及撤销权限，分别记录状态
- 期望：断开后退出应用旧偏好 的用户结果符合固定源码定义：用户可配置 quitAppAfter：断开后退出应用旧偏好；固定声明与实际读取/消费入口分别附锚点；普通断连只断开；保留用户显式停止实例操作并明确确认，不将旧quit-after回调移植为自动StopInstance
- 负例：拒绝 quitAppAfter 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-rendererselection

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“原生呈现后端选择”原行为；配对并取得所需权限
- 步骤：记录 rendererSelection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 rendererSelection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：原生呈现后端选择 的用户结果符合固定源码定义：用户可配置 rendererSelection：原生呈现后端选择；固定声明与实际读取/消费入口分别附锚点；保留“原生呈现后端选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rendererSelection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-reversescrolldirection

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“垂直/水平精确滚轮方向”原行为；配对并取得所需权限
- 步骤：记录 reverseScrollDirection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 reverseScrollDirection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：垂直/水平精确滚轮方向 的用户结果符合固定源码定义：用户可配置 reverseScrollDirection：垂直/水平精确滚轮方向；固定声明与实际读取/消费入口分别附锚点；保留“垂直/水平精确滚轮方向”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 reverseScrollDirection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-rgb-led

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“控制器RGB LED反馈”原行为；配对并取得所需权限
- 步骤：执行“控制器RGB LED反馈”的操作并记录实际画面/音频/输入/管理结果；针对 rgb-led 切换实例、断连重连及撤销权限，分别记录状态
- 期望：控制器RGB LED反馈 的用户结果符合固定源码定义：控制器RGB LED反馈；保留“控制器RGB LED反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rgb-led 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-richpresence

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Discord游戏活动展示”原行为；配对并取得所需权限
- 步骤：记录 richPresence 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 richPresence 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Discord游戏活动展示 的用户结果符合固定源码定义：用户可配置 richPresence：Discord游戏活动展示；固定声明与实际读取/消费入口分别附锚点；保留“Discord游戏活动展示”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 richPresence 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-rumble-feedback

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“低/高频控制器震动反馈”原行为；配对并取得所需权限
- 步骤：执行“低/高频控制器震动反馈”的操作并记录实际画面/音频/输入/管理结果；针对 rumble-feedback 切换实例、断连重连及撤销权限，分别记录状态
- 期望：低/高频控制器震动反馈 的用户结果符合固定源码定义：低/高频控制器震动反馈；保留“低/高频控制器震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 rumble-feedback 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-showperformanceoverlay

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“串流统计叠层”原行为；配对并取得所需权限
- 步骤：记录 showPerformanceOverlay 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 showPerformanceOverlay 切换实例、断连重连及撤销权限，分别记录状态
- 期望：串流统计叠层 的用户结果符合固定源码定义：用户可配置 showPerformanceOverlay：串流统计叠层；固定声明与实际读取/消费入口分别附锚点；保留“串流统计叠层”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 showPerformanceOverlay 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-surround

平台 selene-windows；Phase 12；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“多声道音频解码/输出”原行为；配对并取得所需权限
- 步骤：执行“多声道音频解码/输出”的操作并记录实际画面/音频/输入/管理结果；针对 surround 切换实例、断连重连及撤销权限，分别记录状态
- 期望：多声道音频解码/输出 的用户结果符合固定源码定义：多声道音频解码/输出；保留“多声道音频解码/输出”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 surround 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-swapfacebuttons

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“AB/XY交换”原行为；配对并取得所需权限
- 步骤：记录 swapFaceButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapFaceButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：AB/XY交换 的用户结果符合固定源码定义：用户可配置 swapFaceButtons：AB/XY交换；固定声明与实际读取/消费入口分别附锚点；保留“AB/XY交换”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapFaceButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-swapmousebuttons

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“交换鼠标左右键”原行为；配对并取得所需权限
- 步骤：记录 swapMouseButtons 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 swapMouseButtons 切换实例、断连重连及撤销权限，分别记录状态
- 期望：交换鼠标左右键 的用户结果符合固定源码定义：用户可配置 swapMouseButtons：交换鼠标左右键；固定声明与实际读取/消费入口分别附锚点；保留“交换鼠标左右键”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 swapMouseButtons 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-trigger-rumble

平台 selene-windows；Phase 16；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“左右扳机震动反馈”原行为；配对并取得所需权限
- 步骤：执行“左右扳机震动反馈”的操作并记录实际画面/音频/输入/管理结果；针对 trigger-rumble 切换实例、断连重连及撤销权限，分别记录状态
- 期望：左右扳机震动反馈 的用户结果符合固定源码定义：左右扳机震动反馈；保留“左右扳机震动反馈”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 trigger-rumble 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-uidisplaymode

平台 selene-windows；Phase 27；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“界面列表呈现偏好”原行为；配对并取得所需权限
- 步骤：记录 uiDisplayMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 uiDisplayMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：界面列表呈现偏好 的用户结果符合固定源码定义：用户可配置 uiDisplayMode：界面列表呈现偏好；固定声明与实际读取/消费入口分别附锚点；保留“界面列表呈现偏好”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 uiDisplayMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-unlockbitrate

平台 selene-windows；Phase 23；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“解锁高码率选择”原行为；配对并取得所需权限
- 步骤：记录 unlockBitrate 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 unlockBitrate 切换实例、断连重连及撤销权限，分别记录状态
- 期望：解锁高码率选择 的用户结果符合固定源码定义：用户可配置 unlockBitrate：解锁高码率选择；固定声明与实际读取/消费入口分别附锚点；保留“解锁高码率选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 unlockBitrate 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-utf8-text

平台 selene-windows；Phase 11；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“UTF-8文本输入”原行为；配对并取得所需权限
- 步骤：执行“UTF-8文本输入”的操作并记录实际画面/音频/输入/管理结果；针对 utf8-text 切换实例、断连重连及撤销权限，分别记录状态
- 期望：UTF-8文本输入 的用户结果符合固定源码定义：UTF-8文本输入；保留“UTF-8文本输入”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 utf8-text 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-videocodecconfig

平台 selene-windows；Phase 14；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“H.264/HEVC/AV1选择”原行为；配对并取得所需权限
- 步骤：记录 videoCodecConfig 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 videoCodecConfig 切换实例、断连重连及撤销权限，分别记录状态
- 期望：H.264/HEVC/AV1选择 的用户结果符合固定源码定义：用户可配置 videoCodecConfig：H.264/HEVC/AV1选择；固定声明与实际读取/消费入口分别附锚点；保留“H.264/HEVC/AV1选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 videoCodecConfig 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-videodecoderselection

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“软解/硬解选择”原行为；配对并取得所需权限
- 步骤：记录 videoDecoderSelection 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 videoDecoderSelection 切换实例、断连重连及撤销权限，分别记录状态
- 期望：软解/硬解选择 的用户结果符合固定源码定义：用户可配置 videoDecoderSelection：软解/硬解选择；固定声明与实际读取/消费入口分别附锚点；保留“软解/硬解选择”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 videoDecoderSelection 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-wake

平台 selene-windows；Phase 36；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“Wake-on-LAN”原行为；配对并取得所需权限
- 步骤：执行“Wake-on-LAN”的操作并记录实际画面/音频/输入/管理结果；针对 wake 切换实例、断连重连及撤销权限，分别记录状态
- 期望：Wake-on-LAN 的用户结果符合固定源码定义：Wake-on-LAN；保留“Wake-on-LAN”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 wake 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-width

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“视频宽度”原行为；配对并取得所需权限
- 步骤：记录 width 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 width 切换实例、断连重连及撤销权限，分别记录状态
- 期望：视频宽度 的用户结果符合固定源码定义：用户可配置 width：视频宽度；固定声明与实际读取/消费入口分别附锚点；保留“视频宽度”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 width 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

### case-selene-windows-windowmode

平台 selene-windows；Phase 10；planned，未执行。

- 前提：准备 Windows 客户端；最低条件待审 与 依赖实际 OS/API、设备和原生后端能力；尚未产品实测；使用固定参考提交核对“窗口/全屏/无边框”原行为；配对并取得所需权限
- 步骤：记录 windowMode 关闭/默认值及实际结果，再设置另一合法值并重复相同输入/内容；针对 windowMode 切换实例、断连重连及撤销权限，分别记录状态
- 期望：窗口/全屏/无边框 的用户结果符合固定源码定义：用户可配置 windowMode：窗口/全屏/无边框；固定声明与实际读取/消费入口分别附锚点；保留“窗口/全屏/无边框”的用户可观察结果；协商不支持时说明条件；所有控制操作校验唯一租约及 epoch，断连/切换不隐式停止实例
- 负例：拒绝 windowMode 的无效/越界请求；不支持的硬件/OS 显示明确原因；旧epoch或无权限操作不作用于新实例；显式停止只清理本实例
- 证据：实现；目标工具链构建；契约/错误路径自动化；目标平台真实设备/应用验收

## 原行为与约束冲突

- **helios-windows10-apollo-read-only** (open)：Apollo固定源码允许view权限客户端加入已有应用会话；Aether现文档不引入并行观察者，原能力保留规则要求具体决定。约束：主机全局至多一个ControlLease；首版原文无并行观察者；新增缺失原能力默认进入v1；选项：推荐：显式只读观察者能力，资源预算独立协商、禁止输入/上行/变更，不增加控制租约；修订：说明具体用户范围与替代方案后重新审阅；不得自动删除或塞TODO。
- **helios-windows11-apollo-read-only** (open)：Apollo固定源码允许view权限客户端加入已有应用会话；Aether现文档不引入并行观察者，原能力保留规则要求具体决定。约束：主机全局至多一个ControlLease；首版原文无并行观察者；新增缺失原能力默认进入v1；选项：推荐：显式只读观察者能力，资源预算独立协商、禁止输入/上行/变更，不增加控制租约；修订：说明具体用户范围与替代方案后重新审阅；不得自动删除或塞TODO。
- **qt-linux-extra-architectures** (open)：Qt README列出Linux ARM32/ARM64、实验RISC-V及特定板卡；Flutter目标声明和可用原生后端未证明同等构建范围，不能静默丢失这些用户目标。约束：五客户端范围与原功能保留；框架支持不等于原生或板卡支持；选项：推荐：逐架构保留能力/构建差异并在Phase2/34–35验证，暂不宣称支持；需用户明确范围：若确需额外架构，提出具体适配/工具链验证阶段。

Phase 37 逐行复审，Phase 42 最终验收。BASE-01 edge flag 仍 unclassified/unresolved；descriptor-less prohibitions 仍 flagged-unverified。结构 PASS 不代替语义穷尽性、人审、构建或硬件验证。
