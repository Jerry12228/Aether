# API Coverage — Phase 2 local native SDK boundary

探测器命中 `integration + sdk`，对应 Windows/Flutter 本地 engine/plugin 集成。这里记录本阶段实际采用的 SDK 能力面；无远端服务或云 API。范围来自已批准 Phase 2，不能将整个 Flutter/Windows SDK 的功能自动扩展为本阶段产品任务。OPT-OUT 仅指本阶段没有选用的 SDK 机制，不删减已批准 v1 产品能力。

| capability | decision | reason |
|---|---|---|
| Flutter Windows GPU Texture registration / texture ID | INTEGRATE | 02-02 native GPU 测试图 |
| Texture frame-available notification | INTEGRATE | 静态图首次提交与手动切换 |
| GPU descriptor / release callback ownership | INTEGRATE | engine 使用资源期间的引用存活 |
| Asynchronous Texture unregister completion | INTEGRATE | 完成后释放 GPU 资源；失败/关闭负向检查 |
| CPU PixelBuffer Texture backend | OPT-OUT | 本阶段不作为 GPU 成功回退；仅在解释失败时可记录对照，不能替代 GPU 与 native surface 实验 |
| Typed MethodChannel presentation / close control | INTEGRATE | Dart 低频控制、窗口关闭握手；不得逐帧传媒体 |
| EventChannel for core events | OPT-OUT | 同一事件需求采用真实 C ABI + NativeCallable.listener，不建立第二条重复事件实现 |
| dart:ffi DLL loading / generated C binding / ABI checks | INTEGRATE | 02-01 真正跨边界 tracer |
| NativeCallable.listener async callback / close lifecycle | INTEGRATE | scalar events、ACK drain、producer stop/join 后关闭 |
| D3D11 native test source / shared GPU texture | INTEGRATE | 本地色条/网格/文字与明确资源路径 |
| Native HWND / swapchain surface comparison | INTEGRATE | 与 Texture 同源对照及 resize/stop/close 证据 |
| Win32 console control handler / foreground process | INTEGRATE | Ctrl+C 请求有界清理与交互/自动化模式区别 |
| Network/authentication/media codecs/virtual device SDKs | OPT-OUT | 已批准后续阶段实现；Phase 2 骨架不提前选用或宣称支持，完整 v1 范围保留 |

具体生产来源、版本、许可与 hash 由 02-01 依赖任务和 02-03 source gate 核验；本矩阵不是构建、运行或许可批准证据。
