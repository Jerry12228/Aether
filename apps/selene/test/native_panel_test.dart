import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:selene/native_panel.dart';
import 'package:selene_native/selene_native.dart';

void main() {
  testWidgets(
    'initialization failure is visible and only initialization can retry',
    (tester) async {
      var calls = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: NativePanel(
            coreFactory: () {
              calls++;
              throw CoreException('create', 12);
            },
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(calls, 1);
      expect(find.textContaining('最近错误：create'), findsOneWidget);
      expect(
        tester
            .widget<FilledButton>(find.widgetWithText(FilledButton, '启动呈现'))
            .onPressed,
        isNull,
      );
      expect(find.byType(Texture), findsNothing);
      await tester.tap(find.text('重试初始化'));
      await tester.pumpAndSettle();
      expect(calls, 2);
    },
  );
  testWidgets(
    'arbitrary initialization exception does not expose sensitive text',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: NativePanel(
            coreFactory: () =>
                throw StateError('token=secret C:\\Users\\Other\\private'),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.textContaining('token=secret'), findsNothing);
      expect(
        find.textContaining('Local operation failed (StateError)'),
        findsOneWidget,
      );
    },
  );
}
