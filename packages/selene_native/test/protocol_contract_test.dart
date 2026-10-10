import 'dart:async';
import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:selene_native/src/protocol.dart';

Future<void> until(bool Function() predicate, {int ms = 4000}) async {
  final clock = Stopwatch()..start();
  while (!predicate()) {
    if (clock.elapsedMilliseconds >= ms) throw TimeoutException('Observed state deadline');
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
    for (final file in ['host.key','host.pem','client.key','client.pem','trust.pem']) {
      File('$base/$file').copySync('${dir.path}/$file');
    }
    File('${dir.path}/scenario.bin').writeAsBytesSync(faults ?? []);
    final process = await Process.start(Platform.environment['AETHER_PROTOCOL_HOST']!, ['--host', dir.path, 'actions']);
    final out = StringBuffer();
    process.stdout.transform(utf8.decoder).listen(out.write);
    process.stderr.transform(utf8.decoder).listen(out.write);
    try {
      await until(() => File('${dir.path}/ready').existsSync());
      return Peer(dir, process, out, int.parse(File('${dir.path}/ready').readAsStringSync()));
    } catch (_) { process.kill(); await process.exitCode; rethrow; }
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
      print('FFIRESULT ${jsonEncode({'case': dir.path.split(Platform.pathSeparator).last, 'clientPid': pid, 'hostPid': process.pid, 'port': port, 'callbacksAfterDispose':client.callbacksAfterDispose,'hostSummary':raw.split('\n').firstWhere((s)=>s.startsWith('HOST pid=')), 'eventCount':client.diagnostics.length,'creatorIsolate':client.creatorIsolate,'maxQueryBytes':client.maxQueryBytes})}');
    } finally { process.kill(); }
  }
  ProtocolClient client({bool autoAck=true}) => ProtocolClient(
    libraryPath: Platform.environment['AETHER_PROTOCOL_LIBRARY']!, autoAck:autoAck,
    config: ProtocolConfig(peerControlPort:port,certificateFile:'${dir.path}/client.pem',privateKeyFile:'${dir.path}/client.key',trustFile:'${dir.path}/trust.pem',peerName:'aether-host.local'));
}

Future<ProtocolState> command(ProtocolClient c, int op) => c.waitTerminal(op).then((_)=>c.query());
List<StreamSpec> videos() => [for (var i=0;i<2;i++) StreamSpec(streamId:4+i,displayId:3,width:640,height:480,fpsNumerator:60,bitrateBps:2000000)];
Future<ProtocolState> proposal(ProtocolClient c, {int id=100, bool retry=false}) => command(c,c.request(requestId:id,streams:videos(),capabilities:const ['disable-protection','win10-hdr','hdr','synthetic-video'],retrySettings:retry));

void main() {
  test('D-03/D-04 real FFI complete proposal, one confirm, native sink and safe ACK disposal', () async {
    final peer=await Peer.start('proposal');final c=peer.client();
    try {
      await c.connect();
      expect(c.query().queryVersion,2);expect(c.query().selectedVersion,3);
      final p=(await proposal(c)).proposal!;
      expect(p.streams.where((s)=>s.mediaKind==1).length,2);
      expect(p.capabilities.map((s)=>s.availability).toList(),[0,0,2,1]);
      expect(p.capabilities.map((s)=>s.reason).toList(),[26,1,3,0]);
      expect(c.query().sinkPackets,0);expect(c.query().grants,0);
      final state=await command(c,c.confirm(p));expect(state.grants,1);
      await until(()=>c.query().streams.any((s)=>s.streamId==5&&s.received>0));
      expect(c.diagnostics.every((e)=>e.isolateId==Isolate.current.hashCode),true);
      expect(c.diagnostics.where((e)=>e.operationId==2&&e.terminal).length,1);
      expect(c.legacyQuery()['queryVersion'],1);
    } finally {await peer.finish(c);}
  });
  test('D-04 cancel and modify proposal preserve running grant', () async {
    final peer=await Peer.start('modify');final c=peer.client();
    try {
      await c.connect();await command(c,c.confirm((await proposal(c)).proposal!));
      await proposal(c,id:101,retry:true);final cancelled=await command(c,c.cancelRequest(101));
      expect(cancelled.operations.last.status,28);expect(cancelled.grants,1);
      final next=(await proposal(c,id:102,retry:true)).proposal!;expect(next.requestId,102);
      expect(c.query().grants,1);
    } finally {await peer.finish(c);}
  });
}
