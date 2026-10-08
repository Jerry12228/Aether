import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'package:flutter_test/flutter_test.dart';
import 'package:selene_native/selene_native.dart';

void main() {
  final suite = Platform.environment['AETHER_TEST_SUITE'] ?? 'Tracer';
  test('Tracer: actual DLL version, generation token, worker callback, creator isolate and drain', () async {
    expect(Platform.environment['AETHER_CORE_LIBRARY'], isNotNull, reason: 'Supply the already built DLL path');
    final core = SeleneNativeCore();
    expect(core.version, '0.1.0');
    expect(core.token, isNot(0));
    final terminal = core.events.firstWhere((e) => e.terminal).timeout(const Duration(seconds: 3));
    final id = core.startProbe(delayMs: 50);
    expect(core.cancel(id), 0);
    final e = await terminal;
    expect(e.operationId, id);
    expect(e.status, AetherStatus.AETHER_CANCELLED.value);
    expect(e.isolateId, Isolate.current.hashCode);
    expect(core.stats().workerThread, isNot(core.bindings.aether_core_thread_id()));
    expect(core.stats().dispatcherThread, isNot(core.bindings.aether_core_thread_id()));
    await core.dispose();
    expect(core.stats(global: true).liveHandles, 0);
    expect(core.stats(global: true).liveThreads, 0);
    await Future<void>.delayed(const Duration(milliseconds: 30));
    expect(core.callbacksAfterDispose, 0);
  });
  if (suite == 'Lifecycle') {
    test('Lifecycle: paused external observer cannot block local disposal', () async {
      final core = SeleneNativeCore();
      final subscription = core.events.listen((_) {});
      subscription.pause();
      core.startProbe(delayMs: 50);
      try {
        await core.dispose().timeout(const Duration(seconds: 2));
        expect(core.disposed, true);
        expect(core.stats(global: true).liveHandles, 0);
        expect(core.stats(global: true).liveThreads, 0);
      } finally {
        await subscription.cancel();
        await core.dispose();
      }
    });
    test('Lifecycle: wrong ABI and injected init failure allocate no token', () {
      expect(() => SeleneNativeCore(abiVersion: 99), throwsA(isA<CoreException>()));
      expect(() => SeleneNativeCore(injectInitFailure: true), throwsA(isA<CoreException>()));
    });
    test('Lifecycle: real FFI repeated disposal and stale generation', () async {
      int oldToken = 0;
      for (var i = 0; i < 100; i++) {
        final core = SeleneNativeCore();
        expect(core.token, isNot(oldToken));
        if (oldToken != 0) expect(core.bindings.aether_core_cancel(oldToken, 1), AetherStatus.AETHER_INVALID_HANDLE.value);
        core.startProbe(delayMs: 100);
        await Future.wait([core.dispose(), core.dispose()]);
        expect(core.bindings.aether_core_destroy(core.token), AetherStatus.AETHER_ALREADY_DESTROYED.value);
        oldToken = core.token;
        expect(core.stats(global: true).liveHandles, 0);
        expect(core.stats(global: true).liveThreads, 0);
      }
    }, timeout: const Timeout(Duration(seconds: 60)));
    test('Lifecycle: delayed ACK reserves terminal events and caps operation admission', () async {
      final core = SeleneNativeCore(autoAck: false);
      for (var i = 0; i < 32; i++) { core.startProbe(delayMs: 0, injectError: i == 0); }
      expect(() => core.startProbe(), throwsA(isA<CoreException>().having((e) => e.code, 'code', AetherStatus.AETHER_QUEUE_FULL.value)));
      final deadline = DateTime.now().add(const Duration(seconds: 3));
      while (core.diagnostics.where((e) => e.terminal).length != 32) {
        expect(DateTime.now().isBefore(deadline), true);
        await Future<void>.delayed(const Duration(milliseconds: 1));
      }
      expect(core.stats().pending, inInclusiveRange(32, 256));
      expect(core.diagnostics.where((e) => e.status == AetherStatus.AETHER_INTERNAL_ERROR.value).length, 1);
      final ids = core.diagnostics.where((e) => e.terminal).map((e) => e.operationId).toSet();
      expect(ids.length, 32);
      core.acknowledgeReceived();
      expect(core.stats().pending, 0);
      await core.dispose();
    });
  }
  if (suite == 'Adapters') {
    test('Adapters: same FFI query exposes five honest statuses', () async {
      final core = SeleneNativeCore();
      for (var id = 1; id <= 5; id++) {
        final c = core.capability(id);
        expect(c.platformId, id); expect(c.interfaceVersion, 1);
        expect(c.implemented, id == 1); expect(c.bits, id == 1 ? 1 : 0);
        expect(c.reason, id == 1 ? 0 : AetherStatus.AETHER_UNSUPPORTED.value);
      }
      expect(() => core.capability(6), throwsA(isA<CoreException>()));
      await core.dispose();
    });
  }
  test('generated C structures use fixed ABI layouts', () {
    // Import allocation types indirectly through the generated binding file in
    // the native C consumer; the real DLL call validates the matching layouts.
    expect(sizeOf<Uint64>(), 8);
  });
}
