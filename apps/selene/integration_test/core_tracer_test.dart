import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:selene/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('actual Windows engine opens the single panel using the bundled DLL', (tester) async {
    app.main();
    await tester.pumpAndSettle();
    expect(find.textContaining('核心版本：0.1.0'), findsOneWidget);
    expect(find.textContaining('已创建'), findsOneWidget);
    await tester.tap(find.widgetWithText(OutlinedButton, '启动原生探针'));
    await tester.pump(const Duration(milliseconds: 200));
    await tester.tap(find.text('诊断详情与生命周期事件'));
    await tester.pumpAndSettle();
    expect(find.textContaining('kind=2 status=0'), findsOneWidget);
    await tester.tap(find.widgetWithText(OutlinedButton, '释放本地句柄'));
    await tester.pumpAndSettle();
    expect(find.textContaining('句柄状态：未创建'), findsOneWidget);
  });
}
