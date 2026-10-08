import 'dart:async';
import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'package:ffi/ffi.dart';
import 'core_bindings.g.dart';
import 'version.g.dart';

typedef NativeEvent = Void Function(Uint64, Uint64, Uint32, Int32, Uint64);

class CoreException implements Exception {
  CoreException(this.operation, this.code);
  final String operation;
  final int code;
  @override
  String toString() => '$operation: ${AetherStatus.fromValue(code).name} ($code)';
}

class CoreEvent {
  const CoreEvent(this.token, this.sequence, this.kind, this.status, this.operationId, this.isolateId);
  final int token, sequence, kind, status, operationId, isolateId;
  bool get terminal => kind == AetherEventKind.AETHER_TERMINAL.value;
}

class CoreCapability {
  const CoreCapability(this.platformId, this.interfaceVersion, this.bits, this.implemented, this.reason);
  final int platformId, interfaceVersion, bits, reason;
  final bool implemented;
}

class CoreStats {
  CoreStats(AetherStats source)
      : published = source.published_sequence,
        acknowledged = source.acknowledged_sequence,
        pending = source.pending_events,
        admitted = source.admitted_operations,
        liveHandles = source.live_handles,
        liveThreads = source.live_threads,
        workerThread = source.worker_thread_id,
        dispatcherThread = source.dispatcher_thread_id,
        stopped = source.stopped != 0;
  final int published, acknowledged, pending, admitted, liveHandles, liveThreads, workerThread, dispatcherThread;
  final bool stopped;
}

(int, int) _stopNative(String path, int token) {
  final bindings = AetherBindings(DynamicLibrary.open(path));
  final out = calloc<Uint64>();
  try {
    final status = bindings.aether_core_stop(token, out);
    return (status, out.value);
  } finally {
    calloc.free(out);
  }
}

/// Local ownership only. Dispose never means Disconnect or StopInstance.
class SeleneNativeCore {
  SeleneNativeCore({String? libraryPath, int abiVersion = aetherAbiVersion, bool injectInitFailure = false, this.autoAck = true})
      : libraryPath = File(libraryPath ?? Platform.environment['AETHER_CORE_LIBRARY'] ?? '${File(Platform.resolvedExecutable).parent.path}${Platform.pathSeparator}aether_core.dll').absolute.path {
    if (!Platform.isWindows) throw UnsupportedError('Local core has Windows build evidence only.');
    bindings = AetherBindings(DynamicLibrary.open(this.libraryPath));
    final required = calloc<Uint32>();
    final buffer = calloc<Char>(128);
    try {
      _check(bindings.aether_core_version(abiVersion, buffer, 128, required), 'version/ABI');
      version = buffer.cast<Utf8>().toDartString();
      if (version != aetherProductVersion) throw StateError('Product version mismatch: $version');
    } finally {
      calloc.free(required);
      calloc.free(buffer);
    }
    listener = NativeCallable<NativeEvent>.listener(_receive);
    final config = calloc<AetherConfig>();
    final out = calloc<Uint64>();
    try {
      config.ref
        ..abi_version = abiVersion
        ..struct_size = sizeOf<AetherConfig>()
        ..flags = injectInitFailure ? 1 : 0;
      _check(bindings.aether_core_create(config, listener.nativeFunction, out), 'create');
      token = out.value;
    } catch (_) {
      listener.close();
      rethrow;
    } finally {
      calloc.free(config);
      calloc.free(out);
    }
  }

  final String libraryPath;
  final int creatorIsolate = Isolate.current.hashCode;
  late final AetherBindings bindings;
  late final NativeCallable<NativeEvent> listener;
  late final String version;
  late final int token;
  final StreamController<CoreEvent> _events = StreamController.broadcast(sync: true);
  final List<CoreEvent> diagnostics = [];
  final Set<int> _received = {};
  int _contiguous = 0, _acknowledged = 0;
  bool autoAck, _disposing = false, disposed = false;
  int callbacksAfterDispose = 0;
  Future<void>? _disposal;
  Stream<CoreEvent> get events => _events.stream;

  static void _check(int result, String operation) {
    if (result != AetherStatus.AETHER_OK.value) throw CoreException(operation, result);
  }

  void _receive(int callbackToken, int sequence, int kind, int status, int operationId) {
    if (disposed) { callbacksAfterDispose++; return; }
    if (callbackToken != token || Isolate.current.hashCode != creatorIsolate) throw StateError('Callback ownership mismatch');
    final event = CoreEvent(callbackToken, sequence, kind, status, operationId, Isolate.current.hashCode);
    _received.add(sequence);
    while (_received.remove(_contiguous + 1)) { _contiguous++; }
    diagnostics.add(event);
    if (diagnostics.length > 256) diagnostics.removeAt(0);
    if (autoAck || _disposing) acknowledgeReceived();
    _events.add(event);
  }

  void acknowledgeReceived() {
    if (_contiguous > _acknowledged) {
      _check(bindings.aether_core_ack(token, _contiguous), 'ack');
      _acknowledged = _contiguous;
    }
  }

  CoreCapability capability(int platformId) {
    final out = calloc<AetherCapabilities>();
    try {
      out.ref..abi_version = aetherAbiVersion..struct_size = sizeOf<AetherCapabilities>();
      _check(bindings.aether_core_capabilities(platformId, out), 'capability');
      return CoreCapability(out.ref.platform_id, out.ref.interface_version, out.ref.capability_bits, out.ref.implemented != 0, out.ref.reason_code);
    } finally { calloc.free(out); }
  }

  CoreStats stats({bool global = false}) {
    final out = calloc<AetherStats>();
    try {
      out.ref..abi_version = aetherAbiVersion..struct_size = sizeOf<AetherStats>();
      _check(bindings.aether_core_stats(global ? 0 : token, out), 'stats');
      return CoreStats(out.ref);
    } finally { calloc.free(out); }
  }

  int startProbe({int delayMs = 10, bool injectError = false}) {
    if (disposed || _disposing) throw StateError('Local core is disposing/disposed');
    final out = calloc<Uint64>();
    try {
      _check(bindings.aether_core_start_probe(token, delayMs, injectError ? 1 : 0, out), 'start_probe');
      return out.value;
    } finally { calloc.free(out); }
  }

  int cancel(int operationId) => bindings.aether_core_cancel(token, operationId);

  Future<void> dispose() => _disposal ??= _dispose().catchError((Object error) {
    _disposal = null; // TIMEOUT retains the listener/token and permits safe retry.
    throw error;
  });

  Future<void> _dispose() async {
    if (disposed) return;
    _disposing = true;
    final path = libraryPath, handle = token;
    final (status, finalSequence) = await Isolate.run(() => _stopNative(path, handle));
    _check(status, 'stop');
    acknowledgeReceived();
    final deadline = DateTime.now().add(const Duration(seconds: 2));
    while (_acknowledged < finalSequence) {
      if (DateTime.now().isAfter(deadline)) throw CoreException('Dart event drain', AetherStatus.AETHER_TIMEOUT.value);
      await Future<void>.delayed(const Duration(milliseconds: 1));
    }
    _check(bindings.aether_core_destroy(token), 'destroy');
    disposed = true;
    listener.close();
    await _events.close();
  }
}
