import 'dart:async';
import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:selene_native/src/protocol.dart';
import 'package:selene_native/src/protocol_bindings.g.dart';

Future<void> until(bool Function() predicate, {int ms = 4000}) async {
  final clock = Stopwatch()..start();
  while (!predicate()) {
    if (clock.elapsedMilliseconds >= ms)
      throw TimeoutException('Observed state deadline');
    await Future<void>.delayed(const Duration(milliseconds: 2));
  }
}

class Peer {
  Peer(this.dir, this.process, this.output, this.port);
  final Directory dir;
  final Process process;
  final StringBuffer output;
  final int port;
  static Future<Peer> start(String name, {Uint8List? faults}) async {
    final base = Platform.environment['AETHER_PROTOCOL_FIXTURE']!;
    final dir = Directory('$base/$name')..createSync();
    for (final file in [
      'host.key',
      'host.pem',
      'client.key',
      'client.pem',
      'trust.pem',
    ]) {
      File('$base/$file').copySync('${dir.path}/$file');
    }
    File('${dir.path}/scenario.bin').writeAsBytesSync(faults ?? []);
    final provider=ByteData(96);
    provider.buffer.asUint8List().setAll(0,ascii.encode('APFX'));
    provider.setUint32(4,1,Endian.big);
    const capacity=[4,2,4,300000000,67108864,100000000];
    for(var i=0;i<6;i++){provider.setUint64(8+8*i,capacity[i],Endian.big);}
    provider.setUint64(56,7,Endian.big);provider.setUint64(64,9001,Endian.big);provider.setUint64(72,1,Endian.big);
    provider.setUint32(80,15,Endian.big);provider.setUint32(84,3,Endian.big);
    File('${dir.path}/provider.bin').writeAsBytesSync(provider.buffer.asUint8List());
    final process = await Process.start(
      Platform.environment['AETHER_PROTOCOL_HOST']!,
      ['--host', dir.path, 'actions'],
    );
    final out = StringBuffer();
    process.stdout.transform(utf8.decoder).listen(out.write);
    process.stderr.transform(utf8.decoder).listen(out.write);
    try {
      await until(() => File('${dir.path}/ready').existsSync());
      return Peer(
        dir,
        process,
        out,
        int.parse(File('${dir.path}/ready').readAsStringSync()),
      );
    } catch (_) {
      process.kill();
      await process.exitCode;
      rethrow;
    }
  }

  Future<void> finish(ProtocolClient client) async {
    await client.dispose();
    final clean = client.lastStoppedState!;
    expect(clean.stopped, true);
    expect(clean.threads, 0);
    expect(clean.queueBytes, 0);
    await Future<void>.delayed(const Duration(milliseconds: 25));
    expect(client.callbacksAfterDispose, 0);
    File('${dir.path}/client-done').writeAsStringSync('done');
    try {
      expect(await process.exitCode.timeout(const Duration(seconds: 4)), 0);
      final raw = output.toString();
      File('${dir.path}/host.log').writeAsStringSync(raw);
      expect(raw, contains('owned=0'));
      print(
        'FFIRESULT ${jsonEncode({'case': dir.path.split(Platform.pathSeparator).last, 'clientPid': pid, 'hostPid': process.pid, 'port': port, 'callbacksAfterDispose': client.callbacksAfterDispose, 'hostSummary': raw.split('\n').firstWhere((s) => s.startsWith('HOST pid=')), 'eventCount': client.diagnostics.length, 'creatorIsolate': client.creatorIsolate, 'maxQueryBytes': client.maxQueryBytes})}',
      );
    } finally {
      process.kill();
    }
  }

  ProtocolClient client({bool autoAck = true}) => ProtocolClient(
    libraryPath: Platform.environment['AETHER_PROTOCOL_LIBRARY']!,
    autoAck: autoAck,
    config: ProtocolConfig(
      peerControlPort: port,
      certificateFile: '${dir.path}/client.pem',
      privateKeyFile: '${dir.path}/client.key',
      trustFile: '${dir.path}/trust.pem',
      peerName: 'aether-host.local',
    ),
  );
}

Future<ProtocolState> command(ProtocolClient c, int op) =>
    c.waitTerminal(op).then((e) {
      if (e.status != 0 && e.status != 28)
        throw ProtocolException('terminal $op', e.status);
      return c.query();
    });
List<StreamSpec> videos() => [
  for (var i = 0; i < 2; i++)
    StreamSpec(
      streamId: 4 + i,
      displayId: 3,
      width: 640,
      height: 480,
      fpsNumerator: 60,
      bitrateBps: 2000000,
    ),
];
Future<ProtocolState> proposal(
  ProtocolClient c, {
  int id = 100,
  bool retry = false,
}) => command(
  c,
  c.request(
    requestId: id,
    streams: videos(),
    capabilities: const [
      'disable-protection',
      'win10-hdr',
      'hdr',
      'synthetic-video',
    ],
    retrySettings: retry,
  ),
);

void main() {
  test(
    'D-03/D-04 real FFI complete proposal, one confirm, native sink and safe ACK disposal',
    () async {
      final peer = await Peer.start('proposal');
      final c = peer.client();
      try {
        expect(c.legacyQuery()['queryVersion'], 1);
        await c.connect();
        expect(c.query().queryVersion, 2);
        expect(c.query().selectedVersion, 3);
        final p = (await proposal(c)).proposal!;
        expect(p.streams.where((s) => s.mediaKind == 1).length, 2);
        expect(p.capabilities.map((s) => s.availability).toList(), [
          0,
          0,
          2,
          1,
        ]);
        expect(p.capabilities.map((s) => s.reason).toList(), [26, 1, 3, 0]);
        expect(c.query().sinkPackets, 0);
        expect(c.query().grants, 0);
        final state = await command(c, c.confirm(p));
        expect(state.grants, 1);
        await until(
          () => c.query().streams.any((s) => s.streamId == 5 && s.received > 0),
        );
        expect(
          c.diagnostics.every((e) => e.isolateId == Isolate.current.hashCode),
          true,
        );
        expect(
          c.diagnostics.where((e) => e.operationId == 2 && e.terminal).length,
          1,
        );
      } finally {
        await peer.finish(c);
      }
    },
  );
  test('D-04 cancel and modify proposal preserve running grant', () async {
    final peer = await Peer.start('modify');
    final c = peer.client();
    try {
      await c.connect();
      await command(c, c.confirm((await proposal(c)).proposal!));
      await proposal(c, id: 101, retry: true);
      final cancelled = await command(c, c.cancelRequest(101));
      expect(c.resultFor(4)!.status, 28);
      expect(cancelled.grants, 1);
      final next = (await proposal(c, id: 102, retry: true)).proposal!;
      expect(next.requestId, 102);
      expect(c.query().grants, 1);
    } finally {
      await peer.finish(c);
    }
  });
  if(Platform.environment['AETHER_PROTOCOL_FFI_SCOPE']=='expanded')expandedTests();
}

Uint8List fault(int opcode,int phase,{bool before=false,int delay=0,int flags=0,int count=1,int request=100}) {
  final b=ByteData(32);b.setUint32(0,opcode,Endian.big);b.setUint32(4,phase,Endian.big);b.setUint64(8,request,Endian.big);
  b.setUint32(16,before?1:0,Endian.big);b.setUint32(20,delay,Endian.big);b.setUint32(24,flags,Endian.big);b.setUint32(28,count,Endian.big);
  return b.buffer.asUint8List();
}
Uint8List joined(List<List<int>> b)=>Uint8List.fromList(b.expand((s)=>s).toList());

void expandedTests() {
  test('D-05/D-07/D-14/15/16 native recovery, trace, fresh auth and explicit upstream set',() async {
    final peer=await Peer.start('recovery-trace'),c=peer.client();
    try{
      await c.connect();await command(c,c.confirm((await proposal(c)).proposal!));
      expect(c.query().summaryStatus,0);expect(c.query().trace.enabled,false);
      final before=c.query().streams.firstWhere((s)=>s.streamId==5).received;
      await command(c,c.recoverStream(4,windowMs:100));expect(c.query().recovery.transient,true);
      await until(()=>c.query().recovery.state=='healthy');
      expect(c.query().streams.firstWhere((s)=>s.streamId==4).generation,2);
      expect(c.query().streams.firstWhere((s)=>s.streamId==5).received,greaterThan(before));
      await command(c,c.recoverStream(4,windowMs:900));await until(()=>c.query().recovery.state=='action-required');
      expect(c.query().recovery.showPersistentAction,true);await until(()=>c.query().recovery.state=='healthy');
      await command(c,c.startTrace(400));expect(c.query().trace.remainingMs,inInclusiveRange(1,400));
      await command(c,c.extendTrace(600));expect(c.query().trace.enabled,true);
      await command(c,c.stopTrace());expect(c.query().trace.enabled,false);
      await command(c,c.startTrace(60));await until(()=>!c.query().trace.enabled);
      await command(c,c.startTrace(600));await command(c,c.retryConnection());
      final fresh=c.query();expect(fresh.connectionId,105);expect(fresh.freshAuthentications,2);expect(fresh.leaseEpoch,2);expect(fresh.keyGeneration,2);
      expect(fresh.trace.enabled,false);expect(fresh.mediaMask&24,0);expect(fresh.instanceId,2);expect(fresh.displayId,3);
      final up=(await command(c,c.proposeUpstream(3,requestId:101))).proposal!;
      expect(up.streams.map((s)=>s.streamId).toSet(),{7,8});expect(c.query().mediaMask&24,0);
      await command(c,c.confirm(up,upstream:true));await until(()=>c.query().streams.where((s)=>s.direction==2).every((s)=>s.sent>0));
      expect(c.query().mediaMask&24,24);
    }finally{await peer.finish(c);}
  });
  test('D-07 keep upstream closed is a native explicit selection',() async {
    final peer=await Peer.start('upstream-closed'),c=peer.client();
    try{await c.connect();await command(c,c.proposeUpstream(0,requestId:100));expect(c.query().upstreamChoice!.selectedMask,0);expect(c.query().upstreamChoice!.reason,'remain-closed');expect(c.query().mediaMask&24,0);}
    finally{await peer.finish(c);}
  });
  for(final cancel in [false,true])test('D-05 refused fresh socket ${cancel?'cancel':'exhaust'} retains manual state',() async {
    final peer=await Peer.start('retry-$cancel',faults:fault(5,0,before:true,flags:1)),c=peer.client();
    try{
      await c.connect();final op=c.retryConnection(requestId:100);
      if(cancel){await until(()=>c.query().recovery.state=='reconnecting');expect(c.cancelOperation(op),0);}
      final e=await c.waitTerminal(op);expect(e.status,cancel?28:11);final s=c.query();
      expect(s.recovery.state,'manual');expect(s.recovery.reason,cancel?'cancelled':'retry-exhausted');expect(s.instanceId,2);expect(s.displayId,3);
      if(!cancel)expect(s.recovery.attempts,3);
      await command(c,c.cancelRetry());expect(c.query().recovery.reason,'cancelled');
    }finally{await peer.finish(c);}
  });
  const races=['cancel-before','cancel-committed','grant-loss','ready-delay','ready-loss','readyack-delay','readyack-loss','unknown','replay'];
  for(final race in races)test('authority race $race uses actual DLL receipts and one terminal',() async {
    final rules=<Uint8List>[];
    if(race=='cancel-before')rules.add(fault(2,0,before:true,delay:250));
    if(race=='cancel-committed')rules.add(fault(2,3,delay:250));
    if(race=='grant-loss')rules.add(fault(2,3,flags:1));
    if(race=='ready-delay')rules.add(fault(14,0,before:true,delay:150));
    if(race=='ready-loss')rules.add(fault(14,0,before:true,flags:1));
    if(race=='readyack-delay')rules.add(fault(14,4,delay:150));
    if(race=='readyack-loss')rules.add(fault(14,4,flags:1));
    if(race=='replay')rules.add(fault(2,3,flags:2));
    if(race=='unknown')rules.addAll([fault(2,3,flags:1),fault(14,3,flags:1,count:32),fault(3,3,flags:1,count:32)]);
    final peer=await Peer.start('race-$race',faults:joined(rules)),c=peer.client(autoAck:false);
    try{
      await c.connect();final p=(await proposal(c)).proposal!;
      final op=c.confirm(p,deadlineMs:race=='unknown'?700:1500);
      if(race=='cancel-before'||race=='cancel-committed'||race=='unknown'){
        final marker=race=='cancel-before'?'confirm-received':'committed';
        await until(()=>File('${peer.dir.path}/$marker').existsSync());
        expect(c.cancelOperation(op),0);expect(c.cancelOperation(op),0);
        if(race=='cancel-before')expect(File('${peer.dir.path}/committed').existsSync(),false);
      }
      if(race=='ready-delay'||race=='readyack-delay'){await Future<void>.delayed(const Duration(milliseconds:45));expect(c.query().sinkPackets,0);}
      final e=await c.waitTerminal(op),r=c.resultFor(op)!;
      if(race=='unknown'){expect(e.status,11);expect(r.resultKnown,false);expect(r.authorityTerminal,isNull);expect(r.cancelOutcome,'unknown');expect(r.cancellationSucceeded,false);}
      else if(race=='cancel-before'){expect(e.status,28);expect(r.cancellationSucceeded,true);expect(r.transactionSequence,2);expect(c.query().grants,0);}
      else{expect(e.status,0);expect(r.resultKnown,true);expect(r.authorityTerminal,0);expect(r.activationPhase,4);expect(r.transactionSequence,3);expect(c.query().grants,1);
        if(race=='cancel-committed')expect(r.cancelOutcome,'already-committed');
        final count=c.query().sinkPackets;await until(()=>c.query().sinkPackets>count);}
      expect(c.diagnostics.where((e)=>e.operationId==op&&e.terminal).length,1);
      c.acknowledgeReceived();
    }finally{await peer.finish(c);}
  });
  test('T-06-12 ACK gaps, real drain timeout, retry disposal and paused observer',() async {
    final peer=await Peer.start('drain'),c=peer.client(autoAck:false);
    StreamSubscription<ProtocolEvent>? observer;
    try{
      await c.connect();observer=c.events.listen((_){});observer.pause();
      await proposal(c);
      expect(c.bindings.aether_protocol_control_ack(c.handle,2),1);
      final small=calloc<Char>(2),required=calloc<Uint32>();
      try{expect(c.bindings.aether_protocol_control_query(c.handle,small,2,required),13);expect(required.value,greaterThan(2));expect(small.cast<Uint8>()[1],0);}finally{calloc.free(small);calloc.free(required);}
      await expectLater(c.dispose(automaticDrain:false,drainBudget:const Duration(milliseconds:30)),throwsA(isA<ProtocolException>().having((e)=>e.code,'timeout',11)));
      expect(c.disposed,false);expect(c.bindings.aether_protocol_destroy(c.handle),5);
      expect(()=>c.startTrace(20),throwsStateError);
      final first=c.dispose(),second=c.dispose();expect(identical(first,second),true);await Future.wait([first,second]);
      expect(c.disposed,true);expect(c.bindings.aether_protocol_control_ack(c.handle,1),3);
      expect(c.callbacksAfterDispose,0);
    }finally{await observer?.cancel();await peer.finish(c);}
  });
  test('protocol ABI and independent local core layout preserve native contract',(){
    expect(sizeOf<AetherProtocolConfig>(),176);expect(sizeOf<AetherProtocolControlOpen>(),32);expect(sizeOf<AetherProtocolCommand>(),72);
  });
}
