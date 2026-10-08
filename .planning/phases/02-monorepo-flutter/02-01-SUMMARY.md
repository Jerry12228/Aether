---
phase: 02-monorepo-flutter
plan: "01"
status: complete
subsystem: native-boundary
tags: [C++, C-ABI, Flutter, Dart, FFI, Windows]
requires:
  - phase: "01"
    provides: approved baseline and local-only ownership boundaries
provides:
  - Real shared DLL with generation tokens and scalar acknowledged events
  - Single Flutter app, audited workspace lock and generated bindings/version
  - Debug/Release native and real-Dart lifecycle/adapters evidence
affects: [02-02, 02-03]
tech-stack:
  added: [C++20, CMake, ffigen-21.0.0, ffi-2.2.0]
  patterns: [generation-token, serial-worker-dispatcher, sequence-ACK-drain]
key-files:
  created: [native/core/include/aether/core.h, native/core/src/core.cpp, packages/selene_native/lib/src/core.dart, apps/selene/lib/main.dart, toolchains.lock.json, docs/NATIVE-CONTRACT.md]
  modified: [.gitignore]
key-decisions:
  - "ffigen 23 and 22 conflict with fixed Flutter meta 1.18; audited compatible 21 selected without overrides"
  - "Repository-local plugin junction resolves missing symlink privilege without changing system settings"
requirements-completed: []
requirements-progress: [CORE-01, CORE-02, CORE-03]
coverage:
  - id: native-tracer
    description: Real native worker callback reaches the creator Dart isolate and disposes after ACK
    requirement: CORE-02
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/check-core.ps1 -Suite Tracer -Configuration Debug
        status: pass
    human_judgment: false
  - id: lifecycle
    description: Actual Debug and Release DLL negative, queue, cancellation, TIMEOUT and 100-cycle tests
    requirement: CORE-02
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/check-core.ps1 -Suite Lifecycle -Configuration Release
        status: pass
    human_judgment: false
  - id: adapters
    description: Same ABI for five honest platform descriptors, with no target-support inference
    requirement: CORE-03
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/check-core.ps1 -Suite Adapters -Configuration Debug
        status: pass
    human_judgment: false
  - id: panel-tracer
    description: Actual Windows engine panel loads bundled DLL, probes and releases local core
    requirement: CORE-01
    verification:
      - kind: automated_ui
        ref: flutter test --no-pub -d windows integration_test/core_tracer_test.dart
        status: pass
    human_judgment: false
duration: approximately 45min
completed: 2026-10-08
---

# Phase 02-01 — Native boundary summary

Independent C++20 core, Helios self-test and one Selene Flutter app consume ABI 1
and generated product version 0.1.0. This plan completes its scoped boundary;
the Phase 2 CORE requirements remain open until presentation, build/CI and final
review evidence from 02-02/03 exists.

## Accomplishments

- Actual MSVC/CMake Debug and Release DLL/Helios/contract builds; C consumer
  links the exported C ABI. The core has no Flutter/Qt/reference dependency.
- Scalar NativeCallable.listener event reaches its creator isolate; stop runs
  off the UI isolate, joins producers and waits for contiguous Dart ACK before
  destroy/listener.close. Native and Dart resources return to zero.
- Native tracer: 16 checks. Lifecycle: over 1,890 checks including 100 cycles,
  stale/forged/null tokens, wrong ABI/small layouts, repeated operations,
  delayed ACK, 32-operation saturation, stop/cancel race and an actual blocking
  callback that proves two-second TIMEOUT retention and safe retry. Check count
  varies slightly with bounded polling. Adapter suite: 25 checks.
- Real Dart Tracer/Lifecycle/Adapters: 2/5/3 tests respectively in both Debug and
  Release. Windows engine tracer: 1 test passed against the bundled DLL/panel.
  Native lifecycle took ~2.33s; combined Lifecycle wrapper ~4.3–4.5s. Existing
  planning fixture and Node DLL tracer: 2/2. Static analysis: no issues.
- Official archive hashes/licenses/publishers were audited before executing
  package hooks; root lock has 49 hosted and six SDK packages. Full license
  texts, scaffold inventory and exact tool identities are tracked.

## Commits

| Task | Commit | Outcome |
|---|---|---|
| RED tracer | 18538ea, 3cbb7f2 | Initial sandbox test could not spawn; corrected evidence verifies intentional real-DLL assertion failure before GREEN |
| 02-01-01/02/03 | 593c9a7 | Shared source/ownership implementation and corresponding native/Dart/engine tests were committed together |

The three tasks share the initial ABI/implementation commit; native/Dart
Tracer was verified before expanding negative/adapters coverage. No commit
claims Phase 2 or complete CORE requirements.

## Evidence

- Logs: artifacts/phase02/core-{Tracer,Lifecycle,Adapters}-{Debug,Release}-{native,dart}.log.
- Native exact results: docs/phase02/CORE-RESULTS.json.
- Debug core SHA256: 92c99e4e487b61b48e126f212974771bb71a1246bd0cf92a6c650ec81057d385.
- Release core SHA256: 09b783c2b1746c9cad9db11d0f7b6629e7e01d85487ee046504cd9d337fa5a26.
- Selene Debug tracer binary SHA256: 6b9def4845a11be04b34da7bf3dc35fc967299aba3f4236422c072f7bcf1432c.
- Native exports, docs and generated FFI define ownership, status, UTF-8
  truncation, generation, queue/admission bounds and stop/ACK barriers.

## Deviations from Plan

- [Rule 3 — dependency conflict] ffigen 23.0.0 and 22.0.0 fail real resolution:
  code_assets 2/hooks 2.2/record_use 1 require meta 1.19, fixed Flutter requires
  1.18. Audited exact ffigen 21.0.0 resolves successfully. Candidate replacement
  is explicitly authorized by the plan; no SDK upgrade or override.
- [Rule 3 — environment] Windows sandbox TLS/test process creation/cache-lock
  restrictions required approved external execution for network and test tools.
  Initial Node INVALID_RED was replaced by verified RED_EVIDENCE_OK before GREEN.
- [Rule 3 — symlink privilege] app-local plugin junction was accepted by Flutter.
  prepare-flutter.ps1 validates its target and recreates only this owned link.
  The earlier Developer Mode request is superseded by this verified workaround.
- Lifecycle/adapters shared implementation was already present in the tracer;
  expansion added real tests and confirmed behavior instead of manufacturing a
  failing test for existing code. This is a TDD sequencing deviation.
- requirements-completed remains empty because all three CORE requirements
  also depend on mandatory 02-02/03 evidence and actual Windows Actions results.

## Retained gates

Presentation, window close, Helios foreground, independent root build/verify,
clean checkout, actual Windows Actions and final human review remain 02-02/03
work. No remote is configured, so actual CI will require an accessible repository.
Non-Windows descriptors are unimplemented, host Win10 runtime/minimum build is
unverified, and Apple target build duties remain distinct from physical TODOs.
The three edge assumptions and six descriptor-less prohibitions remain flagged
unverified for the final node. Local disposal mutates no host instance/lease.

## Self-Check: PASSED

All three core suites passed against actual Debug/Release binaries and Dart;
actual Windows engine tracer passed; generated version drift, planning links
and static analysis pass. Referenced production sources and commits exist.
Phase completion remains pending by design.
