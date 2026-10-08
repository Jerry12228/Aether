import 'dart:io';
import 'package:ffigen/ffigen.dart';

void main(List<String> args) {
  final root = File.fromUri(Platform.script).parent.parent;
  final output = args.isEmpty
      ? Uri.file('${root.path}/packages/selene_native/lib/src/core_bindings.g.dart')
      : Uri.file(File(args.single).absolute.path);
  final clang = Platform.environment['LIBCLANG_PATH'];
  if (clang == null || !File(clang).existsSync()) {
    throw StateError('Set LIBCLANG_PATH to an audited libclang dynamic library.');
  }
  FfiGenerator(
    headers: Headers(
      entryPoints: [Uri.file('${root.path}/native/core/include/aether/core.h')],
      include: (uri) => uri.path.endsWith('/aether/core.h'),
      compilerOptions: [
        '-x', 'c',
        for (final dir in (Platform.environment['LIBCLANG_INCLUDE_DIRS'] ?? '').split(';').where((dir) => dir.isNotEmpty)) '-I$dir',
      ],
    ),
    functions: Functions(include: (declaration) => declaration.originalName.startsWith('aether_core_')),
    structs: Structs(include: (declaration) => declaration.originalName.startsWith('Aether')),
    enums: Enums(include: (declaration) => declaration.originalName.startsWith('Aether')),
    typedefs: Typedefs(include: (declaration) => declaration.originalName.startsWith('Aether')),
    output: Output(dartFile: output, style: DynamicLibraryBindings(wrapperName: 'AetherBindings')),
  ).generate(libclangDylib: Uri.file(clang));
}
