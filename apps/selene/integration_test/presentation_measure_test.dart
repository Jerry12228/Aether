import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:selene_native/selene_native.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets(
    'actual static GPU backend measurements',
    (tester) async {
      final directory = Directory(
        Platform.environment['AETHER_MEASUREMENT_DIR']!,
      );
      directory.createSync(recursive: true);
      final presentation = PresentationController();
      final reports = <String, Object?>{};
      final core = SeleneNativeCore();
      for (final backend in PresentationBackend.values) {
        final rounds = <Object?>[];
        for (var round = 0; round < 3; round++) {
          final started = await presentation.start(backend, TestPattern.text);
          final key = GlobalKey();
          await tester.pumpWidget(
            MaterialApp(
              home: Scaffold(
                body: Center(
                  child: RepaintBoundary(
                    key: key,
                    child: backend == PresentationBackend.gpuTexture
                        ? SizedBox(
                            width: 640,
                            height: 360,
                            child: Texture(
                              textureId: started['textureId'] as int,
                            ),
                          )
                        : const Text('Native surface is in its owned HWND'),
                  ),
                ),
              ),
            ),
          );
          await tester.pump();
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(seconds: 30)),
          );
          final before = await presentation.diagnostics();
          final watch = Stopwatch()..start();
          final samples = <Object?>[];
          for (var i = 0; i < 60; i++) {
            await tester.runAsync(
              () => Future<void>.delayed(const Duration(seconds: 1)),
            );
            samples.add({
              'elapsedMs': watch.elapsedMilliseconds,
              'cpu100ns': (await presentation.diagnostics())['processCpu100ns'],
              'rssBytes': ProcessInfo.currentRss,
            });
          }
          final after = await presentation.diagnostics();
          if (round == 0) {
            await PresentationController.channel
                .invokeMethod<void>('testCapture', {
                  'kind': backend == PresentationBackend.gpuTexture
                      ? 'source'
                      : 'nativeSurface',
                });
          }
          if (round == 0 && backend == PresentationBackend.gpuTexture) {
            final boundary =
                key.currentContext!.findRenderObject() as RenderRepaintBoundary;
            final picture = await boundary.toImage();
            final rgba = await picture.toByteData(
              format: ui.ImageByteFormat.rawRgba,
            );
            var bright = 0;
            for (var offset = 0; offset < rgba!.lengthInBytes; offset += 4) {
              if (rgba.getUint8(offset) > 80 ||
                  rgba.getUint8(offset + 1) > 80 ||
                  rgba.getUint8(offset + 2) > 80)
                bright++;
            }
            expect(
              bright,
              greaterThan(1000),
              reason: 'Benchmark requires actual visible GPU text pixels',
            );
            final png = await picture.toByteData(
              format: ui.ImageByteFormat.png,
            );
            File(
              '${directory.path}/gpu-texture.png',
            ).writeAsBytesSync(png!.buffer.asUint8List());
            picture.dispose();
          }
          await tester.pumpWidget(const SizedBox());
          await tester.pump();
          final stopped = await presentation.stop();
          expect(stopped['liveSources'], 0);
          expect(stopped['activeRegistrations'], 0);
          expect(stopped['outstandingDescriptors'], 0);
          rounds.add({
            'round': round + 1,
            'warmupSeconds': 30,
            'measurementMs': watch.elapsedMilliseconds,
            'before': before,
            'after': after,
            'samples': samples,
            'cleanup': stopped,
            'cpuPercentOneLogicalCore':
                ((after['processCpu100ns'] as int) -
                    (before['processCpu100ns'] as int)) /
                watch.elapsedMicroseconds /
                10 *
                100,
          });
          File(
            '${directory.path}/${backend.name}-round-${round + 1}.json',
          ).writeAsStringSync(
            const JsonEncoder.withIndent('  ').convert(rounds.last),
          );
        }
        reports[backend.name] = {
          'outcome': 'passed',
          'rounds': rounds,
          'gpuUtilization': {
            'available': false,
            'reason': 'No per-process GPU utilization instrument integrated',
          },
          'vram': {
            'available': false,
            'reason':
                'DXGI video memory budget instrumentation not implemented; RSS is process memory only',
          },
        };
      }
      await core.dispose();
      File('${directory.path}/report.json').writeAsStringSync(
        const JsonEncoder.withIndent('  ').convert({
          'schema': 1,
          'source': 'native D3D11/D2D/DirectWrite 1280x720 BGRA8 static text',
          'backends': reports,
          'limitations': [
            'not media decode',
            'not 60fps',
            'HDR unverified',
            'multiwindow unverified',
            'engine copy/import unmeasured',
          ],
        }),
      );
    },
    timeout: const Timeout(Duration(minutes: 12)),
  );
}
