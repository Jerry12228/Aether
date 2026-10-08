import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:selene_native/selene_native.dart';

class NativePanel extends StatefulWidget {
  const NativePanel({super.key, this.coreFactory});
  final SeleneNativeCore Function()? coreFactory;
  @override
  State<NativePanel> createState() => _NativePanelState();
}

class _NativePanelState extends State<NativePanel> {
  SeleneNativeCore? core;
  StreamSubscription<CoreEvent>? subscription;
  String? error;
  bool busy = false;
  bool closing = false;
  final PresentationController presentation = PresentationController();
  PresentationBackend backend = PresentationBackend.gpuTexture;
  TestPattern pattern = TestPattern.colorBars;
  Map<String, Object?>? rendering;
  Map<String, Object?> diagnostics = {};
  static const closeChannel = MethodChannel('aether/window');
  final List<String> events = [];
  @override
  void initState() {
    super.initState();
    initialize();
    if (const bool.fromEnvironment('AETHER_CLOSE_TEST')) {
      Future<void>(() async {
        core?.startProbe(delayMs: 30000);
        await startPresentation();
        await Future<void>.delayed(const Duration(milliseconds: 100));
        await closeChannel.invokeMethod<void>('test_close');
        await closeChannel.invokeMethod<void>('test_close');
      });
    }
    closeChannel.setMethodCallHandler((call) async {
      if (call.method != 'close_requested' || closing) return;
      closing = true;
      if (mounted)
        setState(() {
          busy = true;
        });
      try {
        await detachPreview();
        // Render completion and native producer/ACK barriers precede destruction.
        await Future.wait<void>([
          presentation.stop().then((_) {
            rendering = null;
          }),
          core?.dispose() ?? Future<void>.value(),
        ]);
        await subscription?.cancel();
        final stats = core?.stats(global: true);
        core = null;
        diagnostics = await presentation.diagnostics();
        debugPrint(
          'close_ready $diagnostics core=disposed handles=${stats?.liveHandles} threads=${stats?.liveThreads}',
        );
      } catch (failure) {
        debugPrint(
          'close_timeout retained native references: ${safeError(failure)}',
        );
      }
      await closeChannel.invokeMethod<void>('close_ready');
    });
  }

  String safeError(Object failure) => failure is PlatformException
      ? '${failure.code}: ${failure.message ?? "Native failure"}'
      : failure is CoreException
      ? failure.toString()
      : 'Local operation failed (${failure.runtimeType})';
  void initialize() {
    try {
      core = widget.coreFactory?.call() ?? SeleneNativeCore();
      subscription = core!.events.listen((event) {
        if (!mounted) return;
        setState(() {
          events.insert(
            0,
            '#${event.sequence} op=${event.operationId} kind=${event.kind} status=${event.status}',
          );
          if (events.length > 100) events.removeLast();
        });
      });
      error = null;
    } catch (failure) {
      error = safeError(failure);
    }
    if (mounted) setState(() {});
  }

  Future<void> release() async {
    if (busy || core == null) return;
    setState(() {
      busy = true;
    });
    try {
      await detachPreview();
      await presentation.stop();
      rendering = null;
      await core!.dispose();
      await subscription?.cancel();
      core = null;
      error = null;
    } catch (failure) {
      error = safeError(failure);
    }
    if (mounted)
      setState(() {
        busy = false;
      });
  }

  Future<void> startPresentation() async {
    if (core == null || busy || closing) return;
    setState(() {
      busy = true;
      error = null;
    });
    try {
      rendering = await presentation.start(backend, pattern);
      diagnostics = rendering!;
    } catch (failure) {
      error = safeError(failure);
      diagnostics = await presentation.diagnostics();
    }
    if (mounted)
      setState(() {
        busy = false;
      });
  }

  Future<void> stopPresentation() async {
    if (busy || closing) return;
    setState(() {
      busy = true;
    });
    try {
      await detachPreview();
      diagnostics = await presentation.stop();
      rendering = null;
      error = null;
    } catch (failure) {
      error = safeError(failure);
      diagnostics = await presentation.diagnostics();
    }
    if (mounted)
      setState(() {
        busy = false;
      });
  }

  Future<void> detachPreview() async {
    if (rendering != null && mounted) {
      setState(() {
        rendering = null;
      });
      // Remove the Texture consumer before retiring the registrar entry.
      await WidgetsBinding.instance.endOfFrame;
    }
  }

  @override
  void dispose() {
    closeChannel.setMethodCallHandler(null);
    // Normal window close uses the awaited handshake above.
    // Widget removal still requests cleanup; timeouts keep native ownership.
    if (core != null && !closing) unawaited(releaseOnRemoval());
    super.dispose();
  }

  Future<void> releaseOnRemoval() async {
    try {
      await presentation.stop();
      await core?.dispose();
      await subscription?.cancel();
    } catch (failure) {
      debugPrint('panel removal retained references: ${safeError(failure)}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final capabilities = core == null
        ? <CoreCapability>[]
        : [for (var i = 1; i <= 5; i++) core!.capability(i)];
    return Scaffold(
      appBar: AppBar(title: const Text('Selene 原生验证面板')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text(
            '本地原生核心测试',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          const Text('当前用于验证本地 ABI 与资源生命周期。远程串流能力按后续阶段交付。'),
          const SizedBox(height: 16),
          Text('核心版本：${core?.version ?? "未初始化"} · ABI $aetherAbiVersion'),
          Text(
            '句柄状态：${core == null
                ? "未创建"
                : busy
                ? "正在清理"
                : "已创建 ${core!.token}"}',
          ),
          const SizedBox(height: 12),
          for (final capability in capabilities)
            Text(
              '${const ["Windows", "macOS", "iOS", "Android", "Linux"][capability.platformId - 1]}：${capability.implemented ? "本地核心已实现" : "未实现"} · capability=${capability.bits} · reason=${capability.reason}',
            ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              FilledButton(
                onPressed: core == null && !busy ? initialize : null,
                child: Text(error != null ? '重试初始化' : '创建句柄'),
              ),
              OutlinedButton(
                onPressed: core != null && !busy ? release : null,
                child: const Text('释放本地句柄'),
              ),
              OutlinedButton(
                onPressed: core != null && !busy
                    ? () {
                        try {
                          core!.startProbe();
                        } catch (failure) {
                          setState(() {
                            error = failure.toString();
                          });
                        }
                      }
                    : null,
                child: const Text('启动原生探针'),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            '本地原生呈现测试',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
          ),
          Text(
            '呈现状态：${rendering == null
                ? "已停止"
                : busy
                ? "正在操作"
                : "运行中 · ${backend.name}"}',
          ),
          const Text('1280 × 720 · BGRA8 · 静态测试图'),
          Wrap(
            spacing: 16,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              DropdownButton<PresentationBackend>(
                value: backend,
                items: [
                  for (final value in PresentationBackend.values)
                    DropdownMenuItem(value: value, child: Text(value.name)),
                ],
                onChanged: !busy && core != null
                    ? (value) async {
                        await stopPresentation();
                        if (rendering == null && mounted)
                          setState(() {
                            backend = value!;
                          });
                      }
                    : null,
              ),
              DropdownButton<TestPattern>(
                value: pattern,
                items: [
                  for (final value in TestPattern.values)
                    DropdownMenuItem(value: value, child: Text(value.name)),
                ],
                onChanged: !busy && core != null
                    ? (value) async {
                        try {
                          if (rendering != null)
                            await presentation.pattern(value!);
                          if (mounted)
                            setState(() {
                              pattern = value!;
                            });
                        } catch (failure) {
                          if (mounted)
                            setState(() {
                              error = safeError(failure);
                            });
                        }
                      }
                    : null,
              ),
              FilledButton(
                onPressed: core != null && !busy && rendering == null
                    ? startPresentation
                    : null,
                child: const Text('启动呈现'),
              ),
              OutlinedButton(
                onPressed:
                    !busy &&
                        (rendering != null || diagnostics['stopping'] == true)
                    ? stopPresentation
                    : null,
                child: const Text('停止呈现'),
              ),
            ],
          ),
          if (rendering != null && backend == PresentationBackend.gpuTexture)
            RepaintBoundary(
              key: const ValueKey('native-render-view'),
              child: SizedBox(
                height: 360,
                child: ColoredBox(
                  color: Colors.black,
                  child: Center(
                    child: AspectRatio(
                      aspectRatio: 16 / 9,
                      child: Texture(textureId: rendering!['textureId'] as int),
                    ),
                  ),
                ),
              ),
            ),
          if (rendering != null && backend == PresentationBackend.nativeSurface)
            const Text('原生 GPU 窗口已打开；可调整窗口大小观察完整图像与留边。'),
          if (error != null) ...[
            const SizedBox(height: 16),
            SelectableText(
              '最近错误：$error',
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ],
          const SizedBox(height: 16),
          ExpansionTile(
            title: const Text('诊断详情与生命周期事件'),
            children: [
              SelectableText(
                '核心 ABI $aetherAbiVersion · 已接收 ${core?.diagnostics.length ?? 0} 条事件',
              ),
              SelectableText(diagnostics.toString()),
              for (final event in events) SelectableText(event),
            ],
          ),
        ],
      ),
    );
  }
}
