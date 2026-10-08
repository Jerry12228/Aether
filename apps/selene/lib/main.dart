import 'native_panel.dart';
export 'native_panel.dart';
import 'package:flutter/material.dart';

void main() => runApp(const SeleneApp());

class SeleneApp extends StatelessWidget {
  const SeleneApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Aether · Selene',
    theme: ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff5366d8)),
      useMaterial3: true,
    ),
    home: const NativePanel(),
  );
}
