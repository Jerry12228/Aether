import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:selene/main.dart' as app;
import 'package:selene_native/selene_native.dart';
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/rendering.dart';
import 'package:flutter/material.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets(
    'real Windows GPU Texture and native surface present the same native source',
    (tester) async {
      app.main();
      await tester.pumpAndSettle();
      final presentation = PresentationController();
      bool initialized = false;
      Map<String, Object?> result = {};
      await tester.ensureVisible(find.text('启动呈现'));
      await tester.tap(find.text('启动呈现'));
      await tester.pumpAndSettle();
      result = await presentation.diagnostics();
      initialized = result['backend'] == 'gpuTexture';
      expect(
        initialized,
        true,
        reason:
            'Real native GPU start must be implemented by the registered plugin',
      );
      expect(result['backend'], 'gpuTexture');
      if (result['adapter'] == 'Microsoft Basic Render Driver') {
        expect(
          result['softwareAdapter'],
          true,
          reason: 'Microsoft Basic Render Driver is software rendering',
        );
      }
      expect(result['textureId'], greaterThan(0));
      expect(result['sourceWidth'], 1280);
      expect(result['sourceHeight'], 720);
      expect(find.byType(Texture), findsOneWidget);
      await tester.pump(const Duration(milliseconds: 200));
      result = await presentation.diagnostics();
      expect(result['descriptorCalls'], greaterThan(0));
      await presentation.pattern(TestPattern.grid);
      await tester.pump(const Duration(milliseconds: 100));
      await presentation.pattern(TestPattern.text);
      await tester.pump(const Duration(milliseconds: 100));
      if (Platform.environment['AETHER_ARTIFACT_DIR'] != null) {
        await PresentationController.channel.invokeMethod<void>('testCapture', {
          'kind': 'source',
        });
        await tester.ensureVisible(find.byType(Texture));
        await tester.pumpAndSettle();
        await PresentationController.channel.invokeMethod<void>('testCapture', {
          'kind': 'view',
        });
        final boundary = tester.renderObject<RenderRepaintBoundary>(
          find.byKey(const ValueKey('native-render-view')),
        );
        final capture = await boundary.toImage();
        final rgba = await capture.toByteData(
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
          reason:
              'GPU Texture must produce actual visible text pixels, not merely invoke its descriptor',
        );
        final pixels = await capture.toByteData(format: ui.ImageByteFormat.png);
        File(
          '${Platform.environment['AETHER_ARTIFACT_DIR']}/gpu-preview.png',
        ).writeAsBytesSync(pixels!.buffer.asUint8List());
        capture.dispose();
      }
      final textureResult = await presentation.diagnostics();
      await tester.tap(find.text('停止呈现'));
      await settleNative(tester);
      result = await presentation.start(
        PresentationBackend.nativeSurface,
        TestPattern.text,
      );
      expect(result['backend'], 'nativeSurface');
      if (Platform.environment['AETHER_ARTIFACT_DIR'] != null) {
        await PresentationController.channel.invokeMethod<void>('testCapture', {
          'kind': 'nativeSurface',
        });
        for (final size in ['portrait', 'wide']) {
          await PresentationController.channel.invokeMethod<void>(
            'testResize',
            {'size': size},
          );
          await PresentationController.channel.invokeMethod<void>(
            'testCapture',
            {'kind': 'nativeSurface'},
          );
          File(
            '${Platform.environment['AETHER_ARTIFACT_DIR']}/native-surface.png',
          ).copySync(
            '${Platform.environment['AETHER_ARTIFACT_DIR']}/native-surface-$size.png',
          );
        }
      }
      await presentation.stop();
      await presentation.stop();
      final counters = await presentation.diagnostics();
      expect(counters['liveSources'], 0);
      expect(counters['activeRegistrations'], 0);
      expect(counters['outstandingDescriptors'], 0);
      Directory('../../artifacts/phase02').createSync(recursive: true);
      File(
        '../../artifacts/phase02/presentation-correctness.json',
      ).writeAsStringSync(
        jsonEncode({
          'texture': textureResult,
          'nativeSurface': result,
          'final': counters,
        }),
      );
      await tester.ensureVisible(find.text('释放本地句柄'));
      await tester.tap(find.text('释放本地句柄'));
      await tester.pumpAndSettle();
    },
  );
  testWidgets(
    'GPU acquisition failures retain core and unregister timeout retains ownership',
    (tester) async {
      app.main();
      await tester.pumpAndSettle();
      final presentation = PresentationController();
      final handleBefore = tester
          .widget<Text>(find.textContaining('句柄状态：'))
          .data;
      for (final stage in ['device', 'texture', 'register', 'firstFrame']) {
        await PresentationController.channel.invokeMethod<void>('testFault', {
          'stage': stage,
        });
        await tester.ensureVisible(find.text('启动呈现'));
        await tester.tap(find.text('启动呈现'));
        await settleNative(tester);
        expect(find.textContaining('最近错误：'), findsOneWidget);
        expect(
          tester.widget<Text>(find.textContaining('句柄状态：')).data,
          handleBefore,
        );
        final counters = await presentation.diagnostics();
        expect(counters['liveSources'], 0);
        expect(counters['activeRegistrations'], 0);
      }
      await PresentationController.channel.invokeMethod<void>('testFault', {
        'stage': '',
      });
      await tester.tap(find.text('启动呈现'));
      await tester.pumpAndSettle();
      await PresentationController.channel.invokeMethod<void>('testFault', {
        'stage': 'unregister',
      });
      await tester.tap(find.text('停止呈现'));
      await settleNative(tester);
      // pumpAndSettle does not advance wall time used by the native barrier.
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 2100)),
      );
      await tester.pumpAndSettle();
      await tester.drag(find.byType(ListView), const Offset(0, -350));
      await tester.pumpAndSettle();
      expect(find.textContaining('TIMEOUT'), findsOneWidget);
      var counters = await presentation.diagnostics();
      expect(counters['liveSources'], 1);
      await PresentationController.channel.invokeMethod<void>('testFault', {
        'stage': '',
      });
      await tester.ensureVisible(find.text('停止呈现'));
      await tester.tap(find.text('停止呈现'));
      await settleNative(tester);
      counters = await presentation.diagnostics();
      expect(counters['liveSources'], 0);
      await tester.ensureVisible(find.text('释放本地句柄'));
      await tester.tap(find.text('释放本地句柄'));
      await tester.pumpAndSettle();
    },
  );
  testWidgets(
    'actual DLL initialization failure retries without removing the window',
    (tester) async {
      var calls = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: app.NativePanel(
            coreFactory: () =>
                SeleneNativeCore(injectInitFailure: calls++ == 0),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.textContaining('最近错误：create'), findsOneWidget);
      expect(find.byType(Texture), findsNothing);
      await tester.tap(find.text('重试初始化'));
      await tester.pumpAndSettle();
      expect(find.textContaining('核心版本：0.1.0'), findsOneWidget);
      expect(calls, 2);
      await tester.ensureVisible(find.text('释放本地句柄'));
      await tester.tap(find.text('释放本地句柄'));
      await settleNative(tester);
      expect(find.text('句柄状态：未创建'), findsOneWidget);
    },
  );
}

Future<void> settleNative(WidgetTester tester) async {
  // Native WM_TIMER/registrar completion uses real wall time, not test clocks.
  for (var i = 0; i < 12; i++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 200)),
    );
    await tester.pump();
  }
  await tester.pumpAndSettle();
}
