# Phase 2 dependency provenance

Status: 2026-10-08 execution in progress. Exact identities, official archive SHA256,
SDK revisions and observed tool versions are in [toolchains.lock.json](../toolchains.lock.json).
No dependency is read from references/upstream. Project license intent remains
compatible-open-source / retain-candidates; this audit does not select a final
project license or approve driver/media redistribution.

## Pub packages

All 49 hosted packages in the single root pubspec.lock were fetched from official
pub.dev archives, compared to the registry SHA256 and checked for a nonempty root
LICENSE. Registry publisher/repository, SDK constraint and LICENSE digest are
retained in the lock. Exact texts are under [phase02/dependency-licenses](phase02/dependency-licenses).
Clean-checkout verification exposed a byte-audit error: the first extraction
added or converted the final newline to CRLF before hashing each retained text. All 49 original
archives were rechecked against the official package digest, then each LICENSE
was extracted directly as bytes. Notice bodies match after newline normalization;
the corrected licenseSha256 now hashes actual archive bytes. Prior retained
digests and the comparison are preserved in LICENSE-BYTE-AUDIT.json and the lock.
Git's no-text attribute preserves those exact bytes on every checkout.
The selected licenses are BSD-3-Clause, BSD-2-Clause, MIT or Apache-2.0;
license notices must accompany redistribution of the corresponding components.
The executable package hooks were not run until their archive/license audit.

- Runtime direct dependency: ffi 2.2.0, dart.dev, BSD-3-Clause.
- Development generator: ffigen 21.0.0, tools.dart.dev, BSD-3-Clause.
- ffigen 23.0.0 and 22.0.0 were rejected by real dry-run resolution: their
  code_assets/hooks/record_use chain requires meta 1.19 whereas Flutter 3.44.0
  pins meta 1.18. No dependency override or SDK upgrade was used.
- flutter, flutter_test, integration_test, flutter_driver,
  fuchsia_remote_debug_protocol and sky_engine are SDK packages tied to the
  fixed framework/engine, rather than independently resolved pub archives.
- Typed platform messages do not require Pigeon at this boundary. No npm/pip
  or cargo packages were installed.

## SDK and generation

The developer libclang source has now been independently reproduced: the exact
18.1.1 Windows wheel was downloaded from files.pythonhosted.org, its SHA256
matched the registry record, and only the locked DLL and LICENSE entries were
extracted. Both entry digests match the recorded existing DLL/license. The full
Apache-2.0 WITH LLVM-exception and retained LLVM notices are tracked. The wheel
was not installed and no package hook ran. prepare-generator.ps1 repeats the
archive/DLL/license checks and resolves VS/UCRT include directories dynamically.

CI pins the official Flutter archive and CMake 4.4.3 zip by independently
verified release digests, and checkout/upload-artifact by full commit SHA.
Windows SDK 28000 and VS18 generator are build prerequisites, while local VS
patch/toolset observations are recorded separately from the actual runner.
The SDK addition uses the installed, signature-verified Microsoft VS Installer
and its official component channel; its executable hash, channel and observed
SDK are recorded at run time. This path has not yet run in Actions.
Primary source references: [runner image](https://github.com/actions/runner-images/blob/main/images/windows/Windows2025-VS2026-Readme.md),
[CMake release](https://github.com/Kitware/CMake/releases/tag/v4.4.3),
[Microsoft installer CLI](https://learn.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=visualstudio).

Flutter 3.44.0 / Dart 3.12.0 was verified by executing the installed SDK. The
official release manifest supplies its archive SHA256; this does not prove the
installed directory was extracted from that archive. SDK cached metadata,
framework/engine revisions and observed tool versions are recorded separately
from target build evidence. No SDK update was performed.

Existing libclang 18.1.1 was located in an installed Python package and actually
parsed the public C header through ffigen. Its DLL SHA256 and wheel metadata
provenance are recorded. It is a developer tool, not linked or bundled into either
product. LIBCLANG_PATH and LIBCLANG_INCLUDE_DIRS are runtime inputs; no workstation
path is checked into the generator. A clean executor must provide a verified
compatible libclang and C standard include directories.

The fixed SDK mechanically generated one Selene app and a Windows standard
plugin using --no-pub. The plugin example was removed before tracking to retain
one application. The generated mock platform-version example/tests, unused
plugin_platform_interface and flutter_lints dependencies were removed; tests
now load the real DLL. The current file inventory, including all runner resources
and metadata, is [SCAFFOLD-INVENTORY.json](phase02/SCAFFOLD-INVENTORY.json).
FFI bindings and Dart/native versions are generated from the C header and
version.json respectively. Non-Windows runners are scaffold inputs, with no
target build or implementation claim.

## Actual gates

Independent MSVC/CMake Debug core and Helios self-test build and run. Real Dart
tracer passes. Flutter dependency resolution produced the root lock, then plugin
symlink generation failed with ERROR_PRIVILEGE_NOT_HELD. Windows Developer Mode
or a verified symlink-capable execution context is required before the Selene
application build. Git remote inventory is empty; a real passing Windows Actions
run remains mandatory for Phase 02-03 and cannot be replaced by local results.

The symlink prerequisite was resolved without a system setting change: a
repository-local Windows junction points the ignored plugin link to the single
tracked plugin directory. The fixed Flutter tool accepted it, app-local
pub get --enforce-lockfile succeeded, Selene Debug built and its actual Windows
engine panel/worker/disposal tracer passed. scripts/prepare-flutter.ps1 makes
this narrow, checked-target workaround reproducible. Root workspace restoration
alone does not generate the app runner plugin registrant; restore from the app.

## Phase 6 协议原型实际复用与 FFI

2026-10-11：本节记录已批准的 synthetic 协议原型复用。固定输入见
[协议依赖锁](../protocol/dependencies.lock.json)、[原 ADR 批准](phase06/PROTOCOL-ADR.md)
和[独立 FEC 复用决定](phase06/FEC-REUSE-DECISION.json)。锁中的历史
`candidate-unapproved` 字样和旧 Windows manifest 保留审阅时字节；实际批准及后续
运行证据由上述决定和各计划摘要分别绑定。不能拿历史 manifest 代替当前加载产物。

| 组件 | 固定源码 commit | 官方 archive SHA-256 | 许可与实际用途 |
|---|---|---|---|
| OpenSSL 3.5.9 | `45e844fa2a14ec92d146bd8f5778ac130b6625fb` | `603f5602e2eef00d77fbd429d34dcd5822bb301757a1bc9cdb24c670f1eb859a` | Apache-2.0；唯一 TLS 1.3/crypto provider，静态 SSL/Crypto |
| libSRTP 2.8.0 | `24b3bf8f19b6f5ab4cd2bcceb4f4064efca86fd5` | `031bf6c0b38c02c3425bf8b4a24386f953ec4ab3df203adb6c22234d2a63f1ba` | BSD-3-Clause；OpenSSL backend、AEAD_AES_256_GCM |
| Botan 3.13.0 固定 scalar 子集 | `2a81eef56c96c237e590c27f9a75e60317c9c700` | `714d6c52c6d752808e8784df21c146e176e91c57c99ee72c08eff4439fcff872` | BSD-2-Clause 及已审 predecessor notices；23 cpp、78 输入，只用于 ZFEC profile |

OpenSSL 的实际 Windows 配置为 `VC-WIN64A no-shared no-tests no-module no-asm
no-zlib no-comp no-legacy no-quic`，安装在自有 `build/phase06/dependencies/openssl-install`。
libSRTP 为 `ENABLE_OPENSSL=ON LIBSRTP_TEST_APPS=ON ENABLE_WARNINGS_AS_ERRORS=ON
BUILD_SHARED_LIBS=OFF`，MSVC runtime 为 `MultiThreaded`。Botan 子集配置与逐文件
来源在[FEC 备选审阅快照](phase06/FEC-ALTERNATIVES.json)，不包含第二个具体
crypto/RNG/TLS provider、SIMD、CPUID、assembly 或共享 toolkit。profile 必须显式协商，
认证后才修复，队列和期限有界；非恒定时间处理仅在已批准 synthetic 媒体边界内，
真实媒体仍需重新核验边界。

完整 notices 的字节、路径及 SHA-256 分别保留在依赖锁与 FEC 审阅快照。
OpenSSL `LICENSE.txt` 的 SHA-256 是
`7d5450cb2d142651b8afa315b5f238efc805dad827d91ba367d8516bc9d49e7a`；
构建工具 `external/perl/Text-Template-1.56/LICENSE` 为
`9837f05336ef3cbacb6a96e1672a0426d81ad01191f214b8d48e22ca62338181`，
其 Perl/Artistic/GPL 选择文本与 crypto 库许可分别保留。
libSRTP `LICENSE` 为 `8e19d42a1eec9561f3f347253ddf2e385c55f392f025bb0fd41b88dbf38db5ae`。
Botan root、ZFEC predecessor、所选源与生成头的原 notices 全部按独立决定随相应产物保留。

原 ADR 的真人批准绑定 reviewed SHA-256
`0cdda0d2750ed02e7c873412b41a0033a1fe73d72d9b57f874cf91a4b3e657cc`，
原文 `1`、时间 `2026-10-10T03:46:30Z`。Botan 另以原文 `1`、
`2026-10-10T05:34:57Z` 批准；其 MD/JSON reviewed hashes 分别为
`3ebdf494fa77c8262d620e7eb60f874c1546564c6bb866c2c9e816b18ac3fa22` 和
`a3157d9e6dc90e921c017d62c9ba3f88241a4aaadd9cf07ace4676fcb02451d8`。
本次 FFI 接入未更换这些依赖或改写任何原批准。

Dart 沿用唯一根锁中的 `ffigen 21.0.0`、`ffi 2.2.0` 和固定 Flutter 3.44.0/Dart 3.12.0。
[独立配置](../protocol/ffigen.yaml) 从当前 `protocol.h` 生成协议绑定；header/output
按配置位置解析，libclang 指向已审核的仓库内开发工具路径。执行前运行
`scripts/prepare-generator.ps1` 核验 libclang/SDK，并把返回的 includes 放入本进程
`CPATH`，在仓库根执行 `dart run ffigen --config protocol/ffigen.yaml`。
这是 ffigen 21 CLI 对带空格 include 参数的适配，不涉及系统环境设置。
生成文件保留 header SHA-256，测试拒绝 header 漂移及空绑定。local core ABI 1 的绑定保持独立。

实际 Flutter 消费检查由 [protocol-ffi.test.cjs](../tests/protocol-ffi.test.cjs) 调用：
使用 manifest 指定的产品 DLL、不同 PID 的 test-only authority host 与真实 loopback
mTLS/SRTP，不加载研究 checkout 或 test client DLL；逐帧媒体和 PCM 仍在 native。
最新运行摘要、产物/source/header/log hashes 见[06-04 摘要](../.planning/phases/06-gamestream/06-04-SUMMARY.md)。

目前这条 FFI 验收限 Windows x64。Linux、Android、macOS、iOS 的对应 loader/static-link
合同已表达，实际目标构建与匹配执行器运行仍归 `06-05`，状态保持 pending。
Apple 仅物理功能/性能/安装验证为 VFY-01/02 TODO，构建和可运行检查仍必需。
原 637 case、原设置和后续 codec/设备 owner 保留；本节不宣称生产配对、真实 capture、
codec/HDR、通用再分发认证或平台支持。Phase3 的修正安装授权继续独立等待。
