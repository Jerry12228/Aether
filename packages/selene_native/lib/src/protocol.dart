import 'dart:async';
import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'protocol_bindings.g.dart';

typedef ProtocolNativeEvent =
    Void Function(Uint64, Uint64, Uint32, Int32, Uint64);

class ProtocolException implements Exception {
  const ProtocolException(this.operation, this.code);
  final String operation;
  final int code;
  @override
  String toString() => '$operation: protocol status $code';
}

enum ProtocolTarget { windows, linux, android, macos, iosStatic }

DynamicLibrary _library(String? path, ProtocolTarget target) {
  if (target == ProtocolTarget.iosStatic) {
    if (!Platform.isIOS || path != null)
      throw ArgumentError('iOS uses statically linked process symbols');
    return DynamicLibrary.process();
  }
  final actual = Platform.isWindows
      ? ProtocolTarget.windows
      : Platform.isAndroid
      ? ProtocolTarget.android
      : Platform.isMacOS
      ? ProtocolTarget.macos
      : ProtocolTarget.linux;
  if (actual != target ||
      path == null ||
      !File(path).isAbsolute ||
      !File(path).existsSync()) {
    throw ArgumentError('An explicit matching target library is required');
  }
  final extension = target == ProtocolTarget.windows
      ? '.dll'
      : target == ProtocolTarget.macos
      ? '.dylib'
      : '.so';
  if (!path.endsWith(extension))
    throw ArgumentError('Target library extension mismatch');
  return DynamicLibrary.open(path);
}

class ProtocolConfig {
  const ProtocolConfig({
    required this.peerControlPort,
    required this.certificateFile,
    required this.privateKeyFile,
    required this.trustFile,
    required this.peerName,
    this.hostId = 1,
    this.instanceId = 2,
    this.displayId = 3,
    this.streamId = 4,
    this.connectionId = 5,
    this.clientId = 6,
    this.leaseEpoch = 1,
    this.configGeneration = 1,
    this.keyGeneration = 1,
    this.deadlineMs = 3000,
  });
  final int peerControlPort,
      hostId,
      instanceId,
      displayId,
      streamId,
      connectionId,
      clientId,
      leaseEpoch,
      configGeneration,
      keyGeneration,
      deadlineMs;
  final String certificateFile, privateKeyFile, trustFile, peerName;
}

class ProtocolEvent {
  const ProtocolEvent(
    this.handle,
    this.sequence,
    this.kind,
    this.status,
    this.operationId,
    this.isolateId,
  );
  final int handle, sequence, kind, status, operationId, isolateId;
  bool get terminal => kind == 11;
}

class StreamSpec {
  const StreamSpec({
    required this.streamId,
    required this.displayId,
    required this.width,
    required this.height,
    required this.fpsNumerator,
    required this.bitrateBps,
    this.mediaKind = 1,
    this.direction = 1,
    this.fpsDenominator = 1,
    this.codec = 1,
    this.colour = 1,
    this.role = 0,
  });
  factory StreamSpec.fromJson(Map<String, dynamic> j) => StreamSpec(
    streamId: j['streamId'],
    displayId: j['displayId'],
    width: j['width'],
    height: j['height'],
    fpsNumerator: j['fpsNumerator'],
    fpsDenominator: j['fpsDenominator'],
    bitrateBps: j['bitrateBps'],
    mediaKind: j['mediaKind'],
    direction: j['direction'],
    codec: j['codec'],
    colour: j['colour'],
    role: j['role'],
  );
  final int streamId,
      displayId,
      width,
      height,
      fpsNumerator,
      fpsDenominator,
      bitrateBps,
      mediaKind,
      direction,
      codec,
      colour,
      role;
  Uint8List encode() => _join([
    _scalar(streamId, 8),
    _scalar(displayId, 8),
    for (final v in [
      mediaKind,
      direction,
      width,
      height,
      fpsNumerator,
      fpsDenominator,
      bitrateBps,
      codec,
      colour,
      role,
    ])
      _scalar(v),
  ]);
}

class CapabilityOption {
  CapabilityOption.fromJson(Map<String, dynamic> j)
    : name = j['name'],
      availability = j['availability'],
      reason = j['reason'],
      requested = j['requested'],
      effective = j['effective'];
  final String name;
  final int availability, reason, requested, effective;
  bool get enabled => availability == 1;
}

class Proposal {
  Proposal.fromJson(Map<String, dynamic> j)
    : requestId = j['requestId'],
      digest = j['digest'],
      hostRevision = j['hostRevision'],
      expiryToken = j['expiryToken'],
      supported = j['supported'],
      reason = j['reason'],
      policy = j['policy'],
      preference = j['preference'],
      streams = List.unmodifiable(
        (j['streams'] as List).map((s) => StreamSpec.fromJson(s)),
      ),
      capabilities = List.unmodifiable(
        (j['capabilities'] as List).map((s) => CapabilityOption.fromJson(s)),
      ),
      differences = List<String>.unmodifiable(j['differences']),
      resources = List<int>.unmodifiable(j['resources']);
  final int requestId, hostRevision, expiryToken, policy, preference;
  final String digest, reason;
  final bool supported;
  final List<StreamSpec> streams;
  final List<CapabilityOption> capabilities;
  final List<String> differences;
  final List<int> resources;
}

class OperationResult {
  OperationResult.fromJson(Map<String, dynamic> j)
    : operationId = j['operationId'],
      requestId = j['requestId'],
      status = j['status'],
      terminal = j['terminal'],
      resultKnown = j['resultKnown'],
      authorityTerminal = j['authorityTerminal'],
      transactionSequence = j['transactionSequence'],
      activationPhase = j['activationPhase'],
      cancelOutcome = j['cancelOutcome'];
  final int operationId,
      requestId,
      status,
      transactionSequence,
      activationPhase;
  final int? authorityTerminal;
  final bool terminal, resultKnown;
  final String cancelOutcome;
  bool get cancellationSucceeded =>
      resultKnown && authorityTerminal == 28 && cancelOutcome == 'cancelled';
}

class TraceState {
  TraceState.fromJson(Map<String, dynamic> j)
    : enabled = j['enabled'],
      remainingMs = j['remainingMs'],
      bytes = j['bytes'],
      limitBytes = j['limitBytes'];
  final bool enabled;
  final int remainingMs, bytes, limitBytes;
}

class RecoveryState {
  RecoveryState.fromJson(Map<String, dynamic> j)
    : state = j['state'],
      reason = j['reason'],
      attempts = j['attempts'];
  final String state, reason;
  final int attempts;
  bool get showPersistentAction =>
      state == 'manual' || state == 'action-required';
  bool get transient => state == 'transient';
}

class StreamState {
  StreamState.fromJson(Map<String, dynamic> j)
    : streamId = j['streamId'],
      generation = j['generation'],
      direction = j['direction'],
      sent = j['sent'],
      received = j['received'];
  final int streamId, generation, direction, sent, received;
}

class ProtocolState {
  ProtocolState.fromJson(Map<String, dynamic> j)
    : queryVersion = j['queryVersion'],
      commandVersion = j['commandVersion'],
      selectedVersion = j['selectedVersion'],
      authenticated = j['authenticated'],
      grants = j['grants'],
      sinkPackets = j['sinkPackets'],
      sequence = j['sequence'],
      acked = j['acked'],
      queueBytes = j['queueBytes'],
      threads = j['threads'],
      stopped = j['stopped'],
      connectionId = j['connectionId'],
      leaseEpoch = j['leaseEpoch'],
      keyGeneration = j['keyGeneration'],
      freshAuthentications = j['freshAuthentications'],
      mediaMask = j['mediaMask'],
      lastFailure = j['lastFailure'],
      proposal = j['proposal'] == null
          ? null
          : Proposal.fromJson(j['proposal']),
      trace = TraceState.fromJson(j['trace']),
      recovery = RecoveryState.fromJson(j['recovery']),
      operations = List.unmodifiable(
        (j['operations'] as List).map((o) => OperationResult.fromJson(o)),
      ),
      streams = List.unmodifiable(
        (j['streams'] as List).map((s) => StreamState.fromJson(s)),
      ),
      summaryStatus = j['summary']['status'],
      instanceId = j['persistentIdentity']['instanceId'],
      displayId = j['persistentIdentity']['displayId'] {
    if (queryVersion != 2 || commandVersion != 1)
      throw StateError('Unsupported control query contract');
  }
  final int queryVersion,
      commandVersion,
      selectedVersion,
      grants,
      sinkPackets,
      sequence,
      acked,
      queueBytes,
      threads,
      connectionId,
      leaseEpoch,
      keyGeneration,
      freshAuthentications,
      mediaMask,
      lastFailure,
      summaryStatus,
      instanceId,
      displayId;
  final bool authenticated, stopped;
  final Proposal? proposal;
  final TraceState trace;
  final RecoveryState recovery;
  final List<OperationResult> operations;
  final List<StreamState> streams;
}

Uint8List _scalar(int v, [int bytes = 4]) {
  if (v < 0 || (bytes == 4 && v > 0xffffffff) || (bytes == 2 && v > 0xffff))
    throw ArgumentError('Unsigned scalar bound');
  final data = ByteData(bytes);
  if (bytes == 8) {
    data.setUint64(0, v, Endian.big);
  } else if (bytes == 2) {
    data.setUint16(0, v, Endian.big);
  } else {
    data.setUint32(0, v, Endian.big);
  }
  return data.buffer.asUint8List();
}

Uint8List _join(List<List<int>> values) =>
    Uint8List.fromList(values.expand((b) => b).toList());
Uint8List _payload(Map<int, Uint8List> fields) {
  if (fields.length > 32) throw ArgumentError('Field count bound');
  final result = _join([
    _scalar(1, 2),
    _scalar(fields.length, 2),
    for (final e in fields.entries) ...[
      _scalar(e.key, 2),
      _scalar(e.value.length, 2),
      e.value,
    ],
  ]);
  if (result.length > 8192) throw ArgumentError('Control payload bound');
  return result;
}

(int, int) _stopProtocol(String? path, ProtocolTarget target, int handle) {
  final b = ProtocolBindings(_library(path, target)), out = calloc<Uint64>();
  try {
    return (b.aether_protocol_stop(handle, out), out.value);
  } finally {
    calloc.free(out);
  }
}

/// Low-frequency protocol control only. Media/PCM stays in the native worker.
class ProtocolClient {
  ProtocolClient({
    required this.config,
    String? libraryPath,
    ProtocolTarget? target,
    this.autoAck = true,
  }) : libraryPath = libraryPath,
       target =
           target ??
           (Platform.isWindows
               ? ProtocolTarget.windows
               : Platform.isIOS
               ? ProtocolTarget.iosStatic
               : Platform.isMacOS
               ? ProtocolTarget.macos
               : Platform.isAndroid
               ? ProtocolTarget.android
               : ProtocolTarget.linux) {
    bindings = ProtocolBindings(_library(libraryPath, this.target));
    listener = NativeCallable<ProtocolNativeEvent>.listener(_receive);
    final native = calloc<AetherProtocolConfig>(), out = calloc<Uint64>();
    final strings = [
      config.certificateFile,
      config.privateKeyFile,
      config.trustFile,
      config.peerName,
    ].map((s) => s.toNativeUtf8()).toList();
    try {
      if (config.peerControlPort < 1 ||
          config.peerControlPort > 65535 ||
          config.deadlineMs < 1 ||
          config.deadlineMs > 3000)
        throw ArgumentError('Connection bounds');
      native.ref
        ..abi_version = 1
        ..struct_size = sizeOf<AetherProtocolConfig>()
        ..role = 2
        ..deadline_ms = config.deadlineMs
        ..peer_control_port = config.peerControlPort
        ..host_id = config.hostId
        ..instance_id = config.instanceId
        ..display_id = config.displayId
        ..stream_id = config.streamId
        ..connection_id = config.connectionId
        ..client_id = config.clientId
        ..lease_epoch = config.leaseEpoch
        ..config_generation = config.configGeneration
        ..key_generation = config.keyGeneration
        ..certificate_file = strings[0].cast()
        ..private_key_file = strings[1].cast()
        ..trust_file = strings[2].cast()
        ..peer_name = strings[3].cast()
        ..version_count = 1
        ..permission_read = 1;
      native.ref.versions[0] = 3;
      _check(
        bindings.aether_protocol_create(native, listener.nativeFunction, out),
        'create',
      );
      handle = out.value;
    } catch (_) {
      listener.close();
      rethrow;
    } finally {
      for (final s in strings) {
        calloc.free(s);
      }
      calloc.free(native);
      calloc.free(out);
    }
  }
  final ProtocolConfig config;
  final String? libraryPath;
  final ProtocolTarget target;
  final bool autoAck;
  final int creatorIsolate = Isolate.current.hashCode;
  late final ProtocolBindings bindings;
  late final NativeCallable<ProtocolNativeEvent> listener;
  late final int handle;
  final StreamController<ProtocolEvent> _events = StreamController.broadcast(
    sync: true,
  );
  final List<ProtocolEvent> diagnostics = [];
  final Map<int, ProtocolEvent> _waitingEvents = {};
  final Map<int, Completer<ProtocolEvent>> _waiters = {};
  final Map<int, ProtocolEvent> _completed = {};
  final Map<int, OperationResult> _results = {};
  int _received = 0, _acked = 0, _nextOperation = 1;
  bool disposed = false, _disposing = false, _opened = false;
  int callbacksAfterDispose = 0, maxQueryBytes = 0;
  Future<void>? _disposal;
  ProtocolState? lastStoppedState;
  Stream<ProtocolEvent> get events => _events.stream;
  static void _check(int code, String op) {
    if (code != 0) throw ProtocolException(op, code);
  }

  void _admit() {
    if (disposed || _disposing)
      throw StateError('Protocol client is disposing/disposed');
  }

  void _receive(int token, int sequence, int kind, int status, int op) {
    if (disposed) {
      callbacksAfterDispose++;
      return;
    }
    if (token != handle || Isolate.current.hashCode != creatorIsolate)
      throw StateError('Callback ownership mismatch');
    final e = ProtocolEvent(
      token,
      sequence,
      kind,
      status,
      op,
      Isolate.current.hashCode,
    );
    _waitingEvents[sequence] = e;
    while (_waitingEvents.remove(_received + 1) != null) {
      _received++;
    }
    diagnostics.add(e);
    if (diagnostics.length > 256) diagnostics.removeAt(0);
    if (e.terminal) {
      query();
      _completed[op] = e;
      if (_completed.length > 32) _completed.remove(_completed.keys.first);
      _waiters.remove(op)?.complete(e);
    }
    if (autoAck) acknowledgeReceived();
    _events.add(e);
  }

  void acknowledgeReceived() {
    if (disposed) throw StateError('Disposed protocol client');
    // Unlike the local core, control ACK admits exactly the next event.
    while (_acked < _received) {
      _check(
        bindings.aether_protocol_control_ack(handle, _acked + 1),
        'control_ack',
      );
      _acked++;
    }
  }

  Future<ProtocolEvent> waitTerminal(
    int op, {
    Duration timeout = const Duration(seconds: 4),
  }) {
    if (_completed.containsKey(op)) return Future.value(_completed[op]);
    return (_waiters[op] ??= Completer<ProtocolEvent>()).future.timeout(
      timeout,
    );
  }

  Future<void> connect() async {
    _admit();
    if (_opened) throw StateError('Control open already requested');
    // Independent fixed HELLO: AETH/16 bytes/type1/version3/TLV8/schema1.
    final hello = Uint8List.fromList([
      65,
      69,
      84,
      72,
      0,
      16,
      1,
      1,
      0,
      3,
      0,
      8,
      0,
      2,
      0,
      1,
    ]);
    final bytes = calloc<Uint8>(hello.length),
        open = calloc<AetherProtocolControlOpen>();
    try {
      bytes.asTypedList(hello.length).setAll(0, hello);
      open.ref
        ..abi_version = 1
        ..struct_size = sizeOf<AetherProtocolControlOpen>()
        ..command_version = 1
        ..hello_bytes = hello.length
        ..hello = bytes;
      _check(
        bindings.aether_protocol_control_open(handle, open),
        'control_open',
      );
      _opened = true;
    } finally {
      calloc.free(bytes);
      calloc.free(open);
    }
    final event = await waitTerminal(0);
    _check(event.status, 'authenticated control open');
  }

  Map<String, dynamic> _query(bool control) {
    if (disposed) throw StateError('Disposed protocol client');
    final required = calloc<Uint32>();
    try {
      final query = control
          ? bindings.aether_protocol_control_query
          : bindings.aether_protocol_query;
      final probe = query(handle, nullptr, 0, required);
      if (probe != 13) _check(probe, 'query probe');
      for (var attempt = 0; attempt < 4; attempt++) {
        final size = required.value;
        if (size < 1 || size > 65536)
          throw StateError('Query exceeds bounded UTF-8 contract');
        final buffer = calloc<Char>(size);
        try {
          final code = query(handle, buffer, size, required);
          if (code == 13) continue;
          _check(code, 'query');
          final length = required.value;
          if (length < 1 ||
              length > size ||
              buffer.cast<Uint8>()[length - 1] != 0)
            throw StateError('Invalid query length/terminator');
          maxQueryBytes = size > maxQueryBytes ? size : maxQueryBytes;
          return jsonDecode(
                utf8.decode(buffer.cast<Uint8>().asTypedList(length - 1)),
              )
              as Map<String, dynamic>;
        } finally {
          calloc.free(buffer);
        }
      }
      throw const ProtocolException('query changed during bounded probe', 5);
    } finally {
      calloc.free(required);
    }
  }

  ProtocolState query() {
    final state = ProtocolState.fromJson(_query(true));
    for (final result in state.operations) {
      _results[result.operationId] = result;
    }
    while (_results.length > 32) {
      _results.remove(_results.keys.first);
    }
    return state;
  }

  /// Latest native receipt, retained before ACK removes its native event slot.
  OperationResult? resultFor(int op) {
    if (!disposed) query();
    return _results[op];
  }

  Map<String, dynamic> legacyQuery() => _query(false);
  int send(
    int opcode, {
    int requestId = 0,
    int? streamId,
    int? expectedGeneration,
    int deadlineMs = 1500,
    Uint8List? payload,
  }) {
    _admit();
    final data = payload ?? _payload({});
    if (data.length > 8192) throw ArgumentError('Payload bound');
    final bytes = calloc<Uint8>(data.length),
        cmd = calloc<AetherProtocolCommand>(),
        op = _nextOperation++;
    try {
      bytes.asTypedList(data.length).setAll(0, data);
      cmd.ref
        ..abi_version = 1
        ..struct_size = sizeOf<AetherProtocolCommand>()
        ..command_version = 1
        ..opcode = opcode
        ..deadline_ms = deadlineMs
        ..operation_id = op
        ..request_id = requestId
        ..stream_id = streamId ?? config.streamId
        ..expected_generation = expectedGeneration ?? config.configGeneration
        ..payload_bytes = data.length
        ..payload = bytes;
      _check(
        bindings.aether_protocol_control_send(handle, cmd),
        'control_send',
      );
      return op;
    } finally {
      calloc.free(bytes);
      calloc.free(cmd);
    }
  }

  int request({
    required int requestId,
    required List<StreamSpec> streams,
    List<String> capabilities = const [],
    int policy = 2,
    int preference = 1,
    int ttlMs = 3000,
    bool retrySettings = false,
  }) {
    if (streams.isEmpty || streams.length > 8 || capabilities.length > 32)
      throw ArgumentError('Request list bounds');
    final names = <Uint8List>[];
    for (final name in capabilities) {
      if (!RegExp(r'^[a-z0-9_-]{1,31}$').hasMatch(name))
        throw ArgumentError('Capability name bound');
      names.add(
        _join([_scalar(name.length, 2), ascii.encode(name), _scalar(1, 8)]),
      );
    }
    return send(
      retrySettings ? 4 : 1,
      requestId: requestId,
      payload: _payload({
        1: _scalar(policy),
        2: _scalar(preference),
        3: _scalar(ttlMs),
        4: _join([
          _scalar(streams.length, 2),
          ...streams.map((s) => s.encode()),
        ]),
        5: _join([_scalar(names.length, 2), ...names]),
      }),
    );
  }

  int confirm(Proposal p, {bool upstream = false}) {
    if (!RegExp(r'^[a-f0-9]{64}$').hasMatch(p.digest))
      throw ArgumentError('Proposal digest bound');
    final digest = Uint8List.fromList([
      for (var i = 0; i < 64; i += 2)
        int.parse(p.digest.substring(i, i + 2), radix: 16),
    ]);
    return send(
      upstream ? 9 : 2,
      requestId: p.requestId,
      payload: _payload({
        6: digest,
        7: _scalar(p.hostRevision, 8),
        8: _scalar(p.expiryToken, 8),
      }),
    );
  }

  int cancelRequest(int requestId, {int targetOperation = 0}) => send(
    3,
    requestId: requestId,
    payload: _payload({20: _scalar(targetOperation, 8)}),
  );
  int cancelOperation(int op) {
    _admit();
    return bindings.aether_protocol_control_cancel_operation(handle, op);
  }

  Future<void> dispose({
    Duration drainBudget = const Duration(seconds: 2),
    bool automaticDrain = true,
  }) => _disposal ??= _dispose(drainBudget, automaticDrain).catchError((
    Object e,
  ) {
    _disposal = null;
    throw e;
  });
  Future<void> _dispose(Duration budget, bool automaticDrain) async {
    if (disposed) return;
    _disposing = true;
    final path = libraryPath, targetCopy = target, token = handle;
    final (status, finalSequence) = await Isolate.run(
      () => _stopProtocol(path, targetCopy, token),
    );
    _check(status, 'stop');
    final clock = Stopwatch()..start();
    while (true) {
      if (automaticDrain) acknowledgeReceived();
      if (_acked >= finalSequence) break;
      if (clock.elapsed >= budget)
        throw const ProtocolException('Dart event drain', 11);
      await Future<void>.delayed(const Duration(milliseconds: 1));
    }
    lastStoppedState = query();
    _check(bindings.aether_protocol_destroy(handle), 'destroy');
    disposed = true;
    listener.close();
    unawaited(_events.close());
  }
}
