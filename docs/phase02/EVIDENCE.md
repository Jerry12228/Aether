# Phase 2 execution evidence

Local implementation and final clean checkout passed; phase completion is pending
a real passing Windows Actions run and the final human checkpoint. No Phase 3
started. Exact commands, durations, counters, binary/log digests and failed attempts
are preserved in [EVIDENCE-RESULTS.json](EVIDENCE-RESULTS.json).

Final tested source: `0617a3e6e3d3ce7bc30e2908bda65ea257d3260b`; product `0.1.0`, ABI `1`.
The checkout was `build\clean-checkouts\Aether clean space 7ZGhCb`, contained only committed tracked inputs,
and had no references/upstream, prior build or app cache. Normal installed SDK,
compiler, SHA-verified external libclang and ordinary locked pub restoration were
used. Four explicit target builds and All verify completed in 312.807s.
All evidence was copied back before the checked owned directory was deleted.

| Mandatory group | Result | Seconds | Test cases / suites |
|---|---|---:|---:|
| source-check | PASS | 5.024 | — |
| platform-check | PASS | 0.065 | — |
| planning-check | PASS | 0.077 | — |
| tool-baseline-tests | PASS | 48.345 | 94 |
| flutter-analyze | PASS | 3.607 | — |
| test-targets-Debug | PASS | 7.343 | — |
| test-targets-Release | PASS | 7.530 | — |
| native-tracer-fixture | PASS | 0.166 | 1 |
| core-Tracer-Debug | PASS | 5.683 | 3 |
| core-Lifecycle-Debug | PASS | 4.781 | 7 |
| core-Adapters-Debug | PASS | 2.343 | 4 |
| core-Tracer-Release | PASS | 2.227 | 3 |
| core-Lifecycle-Release | PASS | 4.678 | 7 |
| core-Adapters-Release | PASS | 2.314 | 4 |
| ui-Panel | PASS | 66.702 | 5 |
| ui-Lifecycle | PASS | 79.660 | 6 |
| helios-Debug | PASS | 0.774 | 2 |
| helios-Release | PASS | 0.736 | 2 |
| binary-versions | PASS | 0.280 | — |

Core counts combine one real native suite with the actual Dart cases per group.
Native suite assertions are separately counted by the contract binary; they are
not presented as separate test cases. The UI totals contain widget, actual-engine
cases and the Lifecycle actual WM_CLOSE check. No mandatory group was skipped.
Versions were queried from running Debug/Release Helios and Selene binaries.
Debug UI tests use compile/runtime-gated fault hooks; uploaded product Release
binaries use normal build flags. Full raw logs remain in artifacts/phase02/clean;
the tracked JSON retains their SHA256 manifest and executable hashes.

| Executable / actual DLL | SHA256 |
|---|---|
| build/native/Debug/aether_core.dll | `279a1d9a1b9c5c8f508e8de9840d53c913909d800417e12574466eee3d2f3a94` |
| build/native/Release/aether_core.dll | `922f42ccb30affef54541e00ae1d95a3a936a066fd3a26166483558cb04aced0` |
| build/native/Debug/helios.exe | `1b004ed1e8a61375fa0705fcca6ed0eeefcc83f11b763fbbed77d01947c41954` |
| build/native/Release/helios.exe | `77c1a988c84112b2b5693cd32f110ed16024e7a7f245341ad8090c1ea23f3070` |
| apps/selene/build/windows/x64/runner/Debug/selene.exe | `298222ceeb7a1132326317026d19ceb59193d94b9cd5f9623da677b93d1a4cf8` |
| apps/selene/build/windows/x64/runner/Debug/aether_core.dll | `efcc3c97bbe8ef915bf471f7bd14ac7010fa17e5adf35d27aa25b67af19ca2da` |
| apps/selene/build/windows/x64/runner/Release/selene.exe | `1bcc89bc4680db53f8569b90edf6d85035d2677cf3fcba2c673617e8a38e4015` |
| apps/selene/build/windows/x64/runner/Release/aether_core.dll | `4b6cc5cb94fe0e9e988c4fc5dd0d31c1466af1138d6390f18d875c975062e036` |

## Lifecycle and presentation

Worker/serial dispatcher delivery returns to the creator Dart isolate. Opaque
generation tokens, bounded admissions/queues, cancel/error/terminal events,
monotonic ACK/drain, repeated stop/destroy and safe TIMEOUT retention passed
in Debug and Release. Review reproduced a paused external observer blocking
Dart dispose after native teardown. A real-DLL fail-first TAP witness was validated
by GSD, the closure/drain fix passed both configs, and this final clean run includes
that fix. No open finding remains in the focused [code review](../../.planning/phases/02-monorepo-flutter/02-REVIEW.md).

Actual engine pixel checks validate GPU Texture and a same-source owned native
surface, four acquisition/first-frame faults, retained core on render error,
unregister TIMEOUT/retry, scaling/full-frame letterbox, and repeated window close
with in-flight core work. Final core handles/threads and render sources/registrations/
descriptors are zero. Helios redirected automation returns without waiting; the
separate test executable and isolated console helper validate real foreground
Ctrl+C. Genuine interactive final-key behavior remains in the final human checklist.

[Presentation results](../PRESENTATION-PROBE.md) retain six valid rounds with real
pixels and original records: 30s warmup / 60s sample / three repeats per backend.
Texture one-core CPU percentages were 0.47/0.26/0.34; surface 0.47/0.52/0.62.
These are static local patterns, not streaming performance or a backend superiority
claim. GPU utilization/VRAM are unavailable with specific instrumentation reasons.
The initial black-Texture run is retained as invalid/superseded.

![Actual Flutter GPU preview](screenshots/gpu-preview.png)

## Reproducibility corrections and retained failures

First clean attempt failed when the locked SDK rebuilt links during its initial
restore. The helper now validates actual single-plugin metadata and recreates
the owned local junction, then retries only that privilege failure once. Other
restore failures remain failures; system Developer Mode was not changed.
Second attempt failed license-byte guards. All 49 official archives were checked
again and LICENSE extracted directly as bytes; early copied texts only differed
in terminal newline representation. Bodies and prior digests are retained in
[LICENSE-BYTE-AUDIT.json](LICENSE-BYTE-AUDIT.json). The no-text attribute preserves
raw notices. A third old-HEAD clean pass preceded the paused-observer finding;
the final pass above supersedes it. Failed runs remain failures in the ledger.

## Actual CI and remaining checkpoint

[Windows workflow](../../.github/workflows/windows.yml) covers PR/main/manual with
full-SHA actions, contents:read, no submodules/persistent credentials, four explicit
builds, All including mandatory real Windows engine tests, and always-uploaded logs.
The audited image has SDK26100; bootstrap adds exact SDK28000 only on an ephemeral
hosted runner through the signed Microsoft installer and checks its outcome.
The first actual Actions run installed exact SDK28000 successfully. A manual trusted
self-hosted Windows x64 GUI executor must already supply VS2026/SDK28000.
Software adapters must remain labeled and cannot become physical performance evidence.

The user authorized public publication with the exact reply “确认” on 2026-10-08.
Remote origin is [Jerry12228/Aether](https://github.com/Jerry12228/Aether); committed
HEAD 2d0e5e18935d8334f9c81e7bce6036b034a51cee was pushed to main without force.
[Actual first run](https://github.com/Jerry12228/Aether/actions/runs/37721726261)
failed Selene Release preparation after three successful builds. Flutter-generated
local symlink target spelling was rejected; a trailing-separator regression was
reproduced as a real TAP failure and accepted by the GSD RED gate. Fix 6d59a78
normalizes link-parent-relative full paths and trailing separators, while rejecting
foreign targets. Twelve tooling tests and two actual sequential restores passed.
[Actual second run](https://github.com/Jerry12228/Aether/actions/runs/37732241885)
passed all four builds and 18/19 verification groups, but failed baseline fixture
checkout identity. Drive-casing normalization reproduced a separate real path
comparison defect; it alone did not resolve hosted path aliases. Third run
37734251073 was cancelled before completion to include a discovered software
adapter-label correction. Fourth run 37734973473 again passed four builds and
18/19 groups, including actual Debug/Release WARP, GPU pixels and software labels;
baseline alias rejection remained. Native OS realpath normalization (9aff292)
passed a real namespace-alias regression and all 96 baseline/tool tests locally.
The final clean rerun of this latest correction remains pending; the local table
above retains its exact earlier source until the new clean result is collected.
[Actual fifth run](https://github.com/Jerry12228/Aether/actions/runs/37741148365)
is in progress on 9aff29216833d786b7fc0877ab544fb4df68ce5f.
[CI ledger](CI-RESULTS.json) retains actual API results, image/tool metadata and
downloaded file hashes; the first failure is not changed to a pass.
Complete passing counts/outcomes and uploaded
log/artifact links are still required. No local result or human approval waives that requirement.
02-03-02/CORE-03/D-17 and the phase therefore remain incomplete.

After actual CI passes, present the full evidence for the final human checkpoint:
patterns/DPI/resize/retry/close, real console Ctrl+C/final key behavior, local-only
resource boundaries, all five platform duties and the three unclassified CORE
assumptions plus six descriptor-less prohibitions (still flagged-unverified).
Do not automatically start Phase 3.

Actual fourth-run Microsoft Basic Render Driver (vendor 5140/device 140) is
software rendering, now correctly reported as softwareAdapter=true. Known Basic
Render identity is retained even when the legacy adapter interface reports zero
software flags. Its real engine record passed the same hash-verified TAP witness
that failed on second-run output. The local WARP probe was initially GREEN and
was not accepted as RED; a sandbox spawn failure was also not accepted. Only the
distinct actual-CI-record assertion failure received RED_EVIDENCE_OK. Both local
WARP configurations render and release all sources; both CI paths and counters
pass. These are software functional checks, not physical GPU performance evidence.
Microsoft's identity/flags reference is the [DXGI overview](https://learn.microsoft.com/en-us/windows/win32/direct3ddxgi/d3d10-graphics-programming-guide-dxgi).

[Platform duties](PLATFORM-GAPS.md) preserve original Android API21–23, Linux
ARM32/RISC-V/boards, Win10/11 floor pending Phases3–5, Windows ARM and Apple
implementation/build/automation. Six Android lower-API ELF cross-compiles passed;
locked Flutter minSdk24 remains unresolved. Linux WSL actually failed with
HCS_E_SERVICE_NOT_AVAILABLE. No Apple executor was available; only VFY01/02
physical tests are TODO. No feature or required target was silently removed.
