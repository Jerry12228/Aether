import 'package:flutter/services.dart';
enum TestPattern { colorBars, grid, text }
enum PresentationBackend { gpuTexture, nativeSurface }
class PresentationController {
  static const channel = MethodChannel('selene_native/presentation');
  Future<Map<String, Object?>> start(PresentationBackend backend, TestPattern pattern) async {
    final result = await channel.invokeMapMethod<String, Object?>('start', {'backend': backend.name, 'pattern': pattern.name});
    return result ?? <String, Object?>{};
  }
  Future<Map<String, Object?>> stop() async => await channel.invokeMapMethod<String, Object?>('stop') ?? <String, Object?>{};
  Future<Map<String, Object?>> diagnostics() async => await channel.invokeMapMethod<String, Object?>('diagnostics') ?? <String, Object?>{};
  Future<void> pattern(TestPattern pattern) => channel.invokeMethod<void>('pattern', {'pattern': pattern.name});
}
