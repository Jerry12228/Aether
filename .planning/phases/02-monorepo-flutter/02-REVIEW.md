---
phase: 02-monorepo-flutter
reviewed: 2026-10-08T02:31:00Z
depth: standard
mode: inline (Codex skill adapter; no sub-agent authorization)
source_commit: eed530d
files_reviewed: 22
files_reviewed_list:
  - native/core/src/core.cpp
  - native/core/include/aether/core.h
  - native/platform/platform.cpp
  - native/platform/include/aether/platform.h
  - native/platform/include/aether/presentation.h
  - native/platform/windows/presentation.cpp
  - packages/selene_native/windows/selene_native_plugin.cpp
  - packages/selene_native/lib/src/core.dart
  - packages/selene_native/lib/src/presentation.dart
  - apps/helios/main.cpp
  - apps/selene/lib/native_panel.dart
  - apps/selene/windows/runner/main.cpp
  - apps/selene/windows/runner/flutter_window.cpp
  - scripts/tool-runner.cjs
  - scripts/build.cjs
  - scripts/verify.cjs
  - scripts/clean-checkout.cjs
  - scripts/check-sources.cjs
  - scripts/check-platforms.cjs
  - scripts/prepare-flutter.ps1
  - scripts/prepare-generator.ps1
  - scripts/bootstrap-ci.ps1
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
resolved_findings: 1
status: clean
---

# Phase 02 Code Review

## Narrative Findings (AI reviewer)

### WR-01 — WARNING (fixed): paused external observers can prevent dispose completion

File: packages/selene_native/lib/src/core.dart, final `await _events.close()` in
`_dispose` (line 179 at reviewed commit). After stop, ACK, native destroy and
listener closure, StreamController.close still waits for a paused subscriber to
consume its done notification. An external observer can therefore prevent the
public local dispose Future completing indefinitely even though native counters
are zero. The window's five-second fallback does not fix explicit API disposal.

Fix: close the controller after the native/ACK/listener barriers, but do not await
external subscribers' done delivery; each observer remains responsible for its
own resume/cancel. Add an actual-DLL paused-subscription regression that requires
dispose to complete and zero counters before the subscription resumes/cancels.
Use monotonic elapsed time for the existing Dart callback-drain budget.

Disposition: real DLL reproduced the paused-observer timeout; GSD validated
the actual TAP witness as RED_EVIDENCE_OK. The implementation now initiates
controller closure without awaiting externally paused done delivery, and uses
Stopwatch for the drain budget. Actual Debug and Release Lifecycle suites pass
(six Dart cases plus one native suite per configuration), and the TAP witness
passes after the fix. The final clean rerun of 4a718df passed all 19 mandatory
groups and includes this regression; evidence records its exact source/hash.
No open finding remains in this review scope. This report is the focused review
of authored lifecycle/source/tooling boundaries; generated non-Windows runners
retain inventory/source checks and unsupported statuses. It is not a target
support, actual-CI or final human-review sign-off.
