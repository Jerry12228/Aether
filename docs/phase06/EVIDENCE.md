# Phase06 协议原型执行证据

06-05 Task1完成；Task2仍未完成，任务1/3。源码审阅发现的两项边界均已真实RED→修复→GREEN，当前本地完整回归通过；新的共同输入仍需完整12目标CI和独立all。最终人审未开始，humanReview为pending/null，NET-01/02/03与Phase6未关闭。Phase3仍halted，独立安装授权不变。

## 当前修正输入与本地实际结果

sourceCommit：`b734e8f6b5139372a62737f500cd50783c6afd1b`；共同42输入摘要：`2c2aefc244810f7662704d4395aa8b4e42db88892cb95daf5390256bdc3cd58b`。具体产物、原始日志及封存回执SHA见[当前本地记录](06-05-CURRENT-LOCAL.json)、[执行记录](06-05-EXECUTION.json)和[根回归](06-05-ROOT-REGRESSION.json)。

| 实际检查 | 通过数量 | 实际耗时ms | 范围 |
|---|---:|---:|---|
| Windows x64 Release原生合同 | 15/15 | 92728 | 原31control/27media/60recovery及具名安全合同，独立真实PID/socket |
| 独立validator known-bad/合法证据 | 85/85 | 原始receipt记录 | 正式target CLI独立运行；零fail/skip/cancel/TODO |
| Flutter/Dart FFI | 22/22 | 18201 | Debug真实产品DLL、21个独立host场景；每场景不同PID，dispose后callback0/owned0 |
| Helios Release构建 | 成功exit0 | 3140 | 原Helios，无设备安装调用 |
| 根Debug CTest | 11/11 | 27194 | 与隔离native/protocol共同输入分别记录 |

公开推送已被自动审批两次拒绝，第二次不接受历史read_thread授权证据；已发出具体重新授权问题，没有绕过发布。当前新输入的CI尚未触发，不能以旧矩阵替代。

## 完整历史矩阵：03858c1输入，已实际通过

[CI38214118510](https://github.com/Jerry12228/Aether/actions/runs/38214118510)真实12/12成功；sourceCommit：`03858c115dd215feaa260e73ea14a62be57df7be`，共同摘要：`aceb57872dd46c4decce3cda2f0fe1bbfb5baf36ce67287e61eb4a922fe38fe1`。下表和[TARGETS](TARGETS.json)绑定该历史输入，不能覆盖上面的修正输入。官方artifact ID/name/digest/head、manifest、实际测试/清理和独立85项日志逐一核验，正式all实际exit0，原始日志SHA `2d8c884960955323492db54fd2c1b5a9908dd49c760fe2626bb9de440dbf4aaa`。

| 目标/arch/SDK | 实际测试 | 运行耗时ms | manifest SHA256前缀 |
|---|---:|---:|---|
| android/arm32 | 115 | 360644 | 5118702859f7 |
| android/arm64 | 115 | 554425 | f34311867e27 |
| android/x64 | 115 | 242489 | f84fba7edcad |
| ios/arm64/iphoneos | 构建；无运行宣称 | — | 6eac3435d6aa |
| ios/arm64/iphonesimulator | 42 | 274263 | e809ff492ce5 |
| ios/x64/iphonesimulator | 42 | 561983 | 70f7192a780d |
| linux/arm64 | 17 | 80235 | 09a7f8b8010a |
| linux/x64 | 17 | 78784 | 5f4101dcb7bc |
| macos/arm64 | 17 | 130222 | 1a83a705d7ff |
| macos/x64 | 17 | 129741 | d99a6aab9436 |
| windows/arm64 | 15 | 98540 | 90c33c6acb47 |
| windows/x64 | 15 | 89080 | 665f24750a49 |

桌面真实原生执行；Android各ABI使用匹配自有CPU guest执行115项；iOS device arm64仅真实minimum13构建，两个simulator分别真实42项XCTest/xcresult，不冒称Apple物理设备。共同输入包含validator和85项known-bad tests，构建/测试架构与原生库逐项核验。

本机Android Studio自有AVD曾导入完全相同03858c1 x64 ELF并实际115/115（194316ms）、validator85/85，owned目录删除/模拟器停止/AVD删除均exit0。见[本地Android原始证据](06-05-LOCAL-ANDROID-03858C1.json)。它是旧输入的已测结果；新输入须重跑，不因用户提供环境而自动判定通过。

## 原能力、决定与风险

TARGETS.coverage列出D-01–16、NET-01–03、T-06-01–22及T-06-SC，每条reference关联真实日志的具名case。原features.json完整637case保留；12个NET设置各有独立Win10/Win11 fec_percentage、lan_encryption_mode、wan_encryption_mode、packetsize、ping_timeout、port具名用例。这些是合同测试，minimum OS/真实Windows10设备能力未由此证明。codec/HDR/444/color、多声道、全部input/feedback/input-only/observer/capture等仍按06-03-PARITY保留既有v1 owner与条件。

原六条无描述符禁止项和三条unclassified edge均保持flagged-unverified，verification/resolution/reason为null；分类原文和来源hash见TARGETS.flagged。没有用新增手工负例代替它们的分类或验证。

## 源码审阅与失败历史

[首轮审阅](../../.planning/phases/06-gamestream/06-REVIEW-FIRST.md)发现CR-01 FPS分母乘15发生32位溢出；CR-02固定五stream空间检查晚于控制/授权。8fbd20b取得真实D11和公开CABI行为RED；e9e61ac修正宽乘法/安全窄化与typed3及legacy2 full-media授权前检查。0685a70修正测试未打开control的通用ACK清理后，D11 1/1及native boundaries child34/34、parent4/4实际GREEN；原失败清理日志保留。见[RED](06-05-REVIEW-BOUNDARY-RED.json)、[GREEN](06-05-REVIEW-BOUNDARY-GREEN.json)、[修正复核](../../.planning/phases/06-gamestream/06-REVIEW.md)及[处置](../../.planning/phases/06-gamestream/06-REVIEW-DISPOSITION.md)。当前open critical/warning/info0、resolved2；这是内联标准审阅，没有独立agent/外部审阅或TSan。

历史Linux mTLS23/24、Android取消线性化、iOS构建/产物漂移、relay/owned adbd、Mac D08/D16时序、控制发送序号、TLS前关闭分类、ready空文件及完成通知顺序均保留实际失败、来源和RED/GREEN，详见EXECUTION及各专门JSON。编译失败/工具封装错误不计行为RED。旧857输入Android失败原因仍未完全确诊；后续成功与单独修正不倒改该失败为已确诊或通过。

独立validator会拒绝零test、skip/cancel/TODO、日志/二进制/source/SDK/CPU漂移、未匹配目标、非owned清理、缺任一12目标、CI失败、缺具名D/NET/parity/threat或安全high缺口。下载adapter嵌套ID规范化保留原始回执和SHA，并对照外部GitHub ID/name/digest/head；没有改原生输入或放宽验证。见[回执转换](06-05-DOWNLOAD-RECEIPT-NORMALIZATION.json)。

## 来源和未测范围

OpenSSL3.5.9、libSRTP2.8.0及批准Botan3.13.0标量23cpp/78输入/7modules、上游baseline/archive/license/notices均在实际manifest核验；[原复用决定](FEC-REUSE-DECISION.json)及FEC-ALTERNATIVES原审阅字节/两hash保持。协议3/schema1及旧1/2、C ABI/queryVersion1保持。无第二crypto/RNG/TLS provider。

证据覆盖synthetic媒体、test-only authority和真实loopback TLS/SRTP/FFI；真实codec/capture/HDR/设备、生产authority、非loopback网络、minimum OS实机和产品SLO未验证，后续owner不删除。Apple物理功能/性能/安装保留VFY-01/02 TODO；实际Apple构建/XCTest仍是当前输入的强制门槛。没有更改驱动/Apollo/系统信任/防火墙，也没有执行或安排开发机重启/关机。

## 最终人审

humanReview：pending；response/recordedAt/reviewedMaterials均null。当前新完整矩阵未完成，因此尚不呈现最终批准包。自动门槛全部通过后，06-05 Task3必须由真人确认绑定的source/inputDigest/ADR/evidence/vectors/dependency/LIMITS及flagged材料，不复用历史选项1或Phase2确认。
