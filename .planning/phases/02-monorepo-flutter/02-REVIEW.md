---
phase: 02-monorepo-flutter
reviewed: 2026-10-08T02:31:00Z
depth: standard
mode: inline (Codex skill adapter; no sub-agent authorization)
source_commit: eed530d
files_reviewed: 18
files_reviewed_list:
  - native/core/src/core.cpp
  - native/core/include/aether/core.h
  - native/platform/windows/presentation.cpp
  - packages/selene_native/windows/selene_native_plugin.cpp
  - packages/selene_native/lib/src/core.dart
  - packages/selene_native/lib/src/presentation.dart
  - apps/helios/main.cpp
  - apps/selene/lib/native_panel.dart
  - apps/selene/windows/runner/main.cpp
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
  warning: 1
  info: 0
  total: 1
status: issues_found
---

# Phase 02 Code Review

## Narrative Findings (AI reviewer)

### WR-01 — WARNING: paused external observers can prevent dispose completion

File: packages/selene_native/lib/src/core.dart, final `await _events.close()` in
`_dispose` (line 174 at reviewed commit). After stop, ACK, native destroy and
listener closure, StreamController.close still waits for a paused subscriber to
consume its done notification. An external observer can therefore prevent the
public local dispose Future completing indefinitely even though native counters
are zero. The window's five-second fallback does not fix explicit API disposal.

Fix: close the controller after the native/ACK/listener barriers, but do not await
external subscribers' done delivery; each observer remains responsible for its
own resume/cancel. Add an actual-DLL paused-subscription regression that requires
dispose to complete and zero counters before the subscription resumes/cancels.
Use monotonic elapsed time for the existing Dart callback-drain budget.

Disposition: reproduced test and fix pending. This report is the focused review
of authored lifecycle/source/tooling boundaries; generated non-Windows runners
retain inventory/source checks and unsupported statuses. It is not a target
support, actual-CI or final human-review sign-off.
