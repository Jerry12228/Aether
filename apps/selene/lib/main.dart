import 'dart:async';
import 'package:flutter/material.dart';
import 'package:selene_native/selene_native.dart';

void main() => runApp(const SeleneApp());
class SeleneApp extends StatelessWidget {
  const SeleneApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Aether · Selene',
    theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff5366d8)), useMaterial3: true),
    home: const NativePanel(),
  );
}
class NativePanel extends StatefulWidget {
  const NativePanel({super.key});
  @override
  State<NativePanel> createState() => _NativePanelState();
}
class _NativePanelState extends State<NativePanel> {
  SeleneNativeCore? core;
  StreamSubscription<CoreEvent>? subscription;
  String? error;
  bool busy = false;
  final List<String> events = [];
  @override
  void initState() { super.initState(); initialize(); }
  void initialize() {
    try {
      core = SeleneNativeCore();
      subscription = core!.events.listen((event) {
        if (!mounted) return;
        setState(() {
          events.insert(0, '#${event.sequence} op=${event.operationId} kind=${event.kind} status=${event.status}');
          if (events.length > 100) events.removeLast();
        });
      });
      error = null;
    } catch (failure) { error = failure.toString(); }
    if (mounted) setState(() {});
  }
  Future<void> release() async {
    if (busy || core == null) return;
    setState(() { busy = true; });
    try {
      await core!.dispose();
      await subscription?.cancel();
      core = null; error = null;
    } catch (failure) { error = failure.toString(); }
    if (mounted) setState(() { busy = false; });
  }
  @override
  Widget build(BuildContext context) {
    final capabilities = core == null ? <CoreCapability>[] : [for (var i = 1; i <= 5; i++) core!.capability(i)];
    return Scaffold(
      appBar: AppBar(title: const Text('Selene 原生验证面板')),
      body: ListView(padding: const EdgeInsets.all(24), children: [
        const Text('本地原生核心测试', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        const Text('当前用于验证本地 ABI 与资源生命周期。远程串流能力按后续阶段交付。'),
        const SizedBox(height: 16),
        Text('核心版本：${core?.version ?? "未初始化"} · ABI $aetherAbiVersion'),
        Text('句柄状态：${core == null ? "未创建" : busy ? "正在清理" : "已创建 ${core!.token}"}'),
        const SizedBox(height: 12),
        for (final capability in capabilities)
          Text('${const ["Windows", "macOS", "iOS", "Android", "Linux"][capability.platformId - 1]}：${capability.implemented ? "本地核心已实现" : "未实现"} · capability=${capability.bits} · reason=${capability.reason}'),
        const SizedBox(height: 16),
        Wrap(spacing: 12, runSpacing: 12, children: [
          FilledButton(onPressed: core == null && !busy ? initialize : null, child: Text(error != null ? '重试初始化' : '创建句柄')),
          OutlinedButton(onPressed: core != null && !busy ? release : null, child: const Text('释放本地句柄')),
          OutlinedButton(onPressed: core != null && !busy ? () {
            try { core!.startProbe(); } catch (failure) { setState(() { error = failure.toString(); }); }
          } : null, child: const Text('启动原生探针')),
        ]),
        if (error != null) ...[const SizedBox(height: 16), SelectableText('最近错误：$error', style: TextStyle(color: Theme.of(context).colorScheme.error))],
        const SizedBox(height: 16),
        ExpansionTile(title: const Text('诊断详情与生命周期事件'), children: [
          SelectableText(core?.libraryPath ?? '尚未加载 DLL'),
          for (final event in events) SelectableText(event),
        ]),
      ]),
    );
  }
}
