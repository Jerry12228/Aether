# Phase 2 execution evidence

Local implementation, latest clean checkout and actual Windows Actions passed;
final human checkpoint was confirmed with exact reply “确认” on2026-10-08. No Phase 3
started. Exact commands, durations, counters, binary/log digests and failed attempts
are preserved in [EVIDENCE-RESULTS.json](EVIDENCE-RESULTS.json).

Final tested source: `08a005ca5a3e2137345e2dbd2f5153bb6c37cade`; product `0.1.0`, ABI `1`.
The checkout was `build\clean-checkouts\Aether clean space AmpqVY`, contained only committed tracked inputs,
and had no references/upstream, prior build or app cache. Normal installed SDK,
compiler, SHA-verified external libclang and ordinary locked pub restoration were
used. Four explicit target builds and All verify completed in 309.474s.
All evidence was copied back before the checked owned directory was deleted.

| Mandatory group | Result | Seconds | Test cases / suites |
|---|---|---:|---:|
| source-check | PASS | 4.675 | — |
| platform-check | PASS | 0.064 | — |
| planning-check | PASS | 0.075 | — |
| tool-baseline-tests | PASS | 46.983 | 96 |
| flutter-analyze | PASS | 3.837 | — |
| test-targets-Debug | PASS | 8.728 | — |
| test-targets-Release | PASS | 8.532 | — |
| native-tracer-fixture | PASS | 0.173 | 1 |
| core-Tracer-Debug | PASS | 5.464 | 3 |
| core-Lifecycle-Debug | PASS | 4.565 | 7 |
| core-Adapters-Debug | PASS | 2.245 | 4 |
| core-Tracer-Release | PASS | 2.190 | 3 |
| core-Lifecycle-Release | PASS | 4.658 | 7 |
| core-Adapters-Release | PASS | 2.350 | 4 |
| ui-Panel | PASS | 64.595 | 7 |
| ui-Lifecycle | PASS | 78.876 | 6 |
| helios-Debug | PASS | 0.755 | 2 |
| helios-Release | PASS | 0.768 | 2 |
| binary-versions | PASS | 0.284 | — |

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
| build/native/Debug/aether_core.dll | `4a2c268f354c285874011e7eab00ab5b466d8e011c42a30ad66b791ef66f3ad6` |
| build/native/Release/aether_core.dll | `5d3ef5cd8441815add3990f708f0b6467026181ee1477d66a7886073f868fae6` |
| build/native/Debug/helios.exe | `8d5a8f82c1b42e60328347a76724e8738292fde882bda80df623bf4adfbc0e05` |
| build/native/Release/helios.exe | `af297d7ff9e2d8af9eb31b5b18d6f56637f0e37939113139a300747c0d63f6f2` |
| apps/selene/build/windows/x64/runner/Debug/selene.exe | `9e262f851c68a3a0c7b4c858a3d704fd6d332daa1991b559d886a44fec2b0bdc` |
| apps/selene/build/windows/x64/runner/Debug/aether_core.dll | `a1043db4eb6b80db80e8ac93372262ef74067c7d1e406e7d3aac43d0f59ec662` |
| apps/selene/build/windows/x64/runner/Release/selene.exe | `3a5739f57cfad372bd30eda083de5c7cfcb6630bb1618bc69967d0839c4b7e74` |
| apps/selene/build/windows/x64/runner/Release/aether_core.dll | `c83ba614dd0cebc7a999841fdd8f46a8782fea0f7148632303ca5b5e4b62b4e4` |

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
The latest clean rerun (08a005c, containing all corrections) passed four builds,
all 19 groups and 142 recorded cases/native suites in 309.474s. The local table
above and JSON carry its exact timings, binary versions and SHA256 manifests.
[Actual fifth run](https://github.com/Jerry12228/Aether/actions/runs/37741148365)
passed on 9aff29216833d786b7fc0877ab544fb4df68ce5f. All four explicit Debug/Release
Helios/Selene builds and all 19 mandatory groups / 142 recorded cases pass,
with no missing/skipped required check. Actual binary versions are0.1.0/ABI1.
The verified image is windows-2025-vs2026 / 20260925.250.1; VS18.10.12217.157,
MSVC14.51.36231, SDK10.0.28000.0, Flutter3.44.0/Dart3.12.0, root CMake4.4.3
and Flutter-used CMake4.3.1-msvc1. The runner is Windows Server2025; this does
not prove the Windows10 host floor. Basic Render Driver is software, not local
physical GPU performance. Final sources/registrations/descriptors are zero.
[Uploaded evidence and Release binaries](https://github.com/Jerry12228/Aether/actions/runs/37741148365/artifacts/11534761493)
have archive digest `fac207958cbe0aa8515858223babd5256a670de916cde83236e39034edc9a8f7`.
All four downloaded Release binary SHA256 values match the actual verify report;
git diff confirms clean08a005c and CI9aff292 product/tool/test/lock inputs match.
[CI ledger](CI-RESULTS.json) retains actual API results, image/tool metadata and
downloaded file hashes; the first failure is not changed to a pass.
Complete actual counts/outcomes, run metadata and uploaded artifact/file hashes
are retained. Technical task02-03-02 is complete; final task02-03-03 is now ready.
CORE-01/02/03 meet the scoped skeleton requirements. Final human response is
“确认”, recorded2026-10-08T08:15:03Z, approving the repository/native boundary
and evidence limits. No new physical keyboard/device observations are claimed.

Final pre-review guard, 2026-10-08: `node scripts/check-sources.cjs --check`
exited0/PASS, checking49 hosted packages,50 product source files, real
ffigen21/audited libclang18.1.1 bindings and version/lock/license drift.
`node scripts/validate-planning.cjs` exited0/PASS, with105/105 v1 requirements
mapped across42 phases and valid local links. `git diff --check` passed.

Final human checkpoint (confirmed; retained review scope):
patterns/DPI/resize/retry/close, real console Ctrl+C/final key behavior, local-only
resource boundaries, all five platform duties and the three unclassified CORE
assumptions plus six descriptor-less prohibitions (still flagged-unverified).
Do not automatically start Phase 3.

Review the panel's color bars/grid/text, resize/DPI letterbox, error/retry and
close behavior using the actual screenshots and negative-test logs. For a real
interactive console, run `build/native/Release/helios.exe`, press Ctrl+C after
initialization, check zero counters and the final-key wait, then press a key.
Success final-key can also be checked with `helios.exe --self-test`; failure
final-key uses the test-only `build/native/Release/aether_helios_test.exe --test-init-error`.
Automation and isolated Ctrl+C are already tested; a physical key observation
must not be invented. Confirm this Phase2 repository/native boundary and these
evidence limits, or identify a concrete discrepancy.

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
