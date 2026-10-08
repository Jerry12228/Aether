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
