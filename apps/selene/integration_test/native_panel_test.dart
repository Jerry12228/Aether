import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:selene/main.dart' as app;
import 'package:selene_native/src/presentation.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('real Windows GPU Texture and native surface present the same native source', (tester) async {
    app.main(); await tester.pumpAndSettle();
    final presentation = PresentationController();
    bool initialized = false;
    Map<String, Object?> result = {};
    try { result = await presentation.start(PresentationBackend.gpuTexture, TestPattern.colorBars); initialized = true; } catch (_) {}
    expect(initialized, true, reason: 'Real native GPU start must be implemented by the registered plugin');
    expect(result['backend'], 'gpuTexture');
    expect(result['textureId'], greaterThan(0));
    expect(result['sourceWidth'], 1280); expect(result['sourceHeight'], 720);
    await presentation.pattern(TestPattern.grid); await presentation.pattern(TestPattern.text);
    await presentation.stop();
    result = await presentation.start(PresentationBackend.nativeSurface, TestPattern.text);
    expect(result['backend'], 'nativeSurface');
    await presentation.stop(); await presentation.stop();
    final counters = await presentation.diagnostics();
    expect(counters['liveSources'], 0); expect(counters['activeRegistrations'], 0);
  });
}
