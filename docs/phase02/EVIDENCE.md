# Phase 2 execution evidence

Local implementation and final clean checkout passed; phase completion is pending
a real passing Windows Actions run and the final human checkpoint. No Phase 3
started. Exact commands, durations, counters, binary/log digests and failed attempts
are preserved in [EVIDENCE-RESULTS.json](EVIDENCE-RESULTS.json).

Final tested source: `4a718df4972a59842814140678a5c86f584c7ed8`; product `0.1.0`, ABI `1`.
The checkout was `build\clean-checkouts\Aether clean space FjrxlY`, contained only committed tracked inputs,
and had no references/upstream, prior build or app cache. Normal installed SDK,
compiler, SHA-verified external libclang and ordinary locked pub restoration were
used. Four explicit target builds and All verify completed in 304.585s.
All evidence was copied back before the checked owned directory was deleted.

| Mandatory group | Result | Seconds | Test cases / suites |
|---|---|---:|---:|
| source-check | PASS | 5.161 | — |
| platform-check | PASS | 0.062 | — |
| planning-check | PASS | 0.071 | — |
| tool-baseline-tests | PASS | 46.288 | 93 |
| flutter-analyze | PASS | 3.382 | — |
| test-targets-Debug | PASS | 7.177 | — |
| test-targets-Release | PASS | 7.041 | — |
| native-tracer-fixture | PASS | 0.166 | 1 |
| core-Tracer-Debug | PASS | 5.454 | 3 |
| core-Lifecycle-Debug | PASS | 4.685 | 7 |
| core-Adapters-Debug | PASS | 2.233 | 4 |
| core-Tracer-Release | PASS | 2.267 | 3 |
| core-Lifecycle-Release | PASS | 4.620 | 7 |
| core-Adapters-Release | PASS | 2.276 | 4 |
| ui-Panel | PASS | 64.866 | 5 |
| ui-Lifecycle | PASS | 78.492 | 6 |
| helios-Debug | PASS | 0.766 | 2 |
| helios-Release | PASS | 0.773 | 2 |
| binary-versions | PASS | 0.296 | — |

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
| build/native/Debug/aether_core.dll | `a8f194dbd5854afe6759ff353714f12f7c2fb08ee00a5311187deb862a39f979` |
| build/native/Release/aether_core.dll | `c6237e4dcd823e2bcd3fe8de422f98576301e8fa2ee03ba3dafb6c94fe781abd` |
| build/native/Debug/helios.exe | `48a634d21fee0fbf79ffcb1445432180c9bccab43eae0a924d35c6988391207e` |
| build/native/Release/helios.exe | `128191c65b631fc92dc65892564c14aabb4f02ee32e4cd7f236331a294ea4975` |
| apps/selene/build/windows/x64/runner/Debug/selene.exe | `9724980d2ebd9111859bbc220549aa7aa25052b535c6faa971421153763af202` |
| apps/selene/build/windows/x64/runner/Debug/aether_core.dll | `210c01a93bd2a7ce943abbe2a7dd05121296b8b74789a3861f770059a6da706b` |
| apps/selene/build/windows/x64/runner/Release/selene.exe | `cefb2795b108f20b23f3648fc7217174ddf23ddcba49f1f24b93287f2f5fcb43` |
| apps/selene/build/windows/x64/runner/Release/aether_core.dll | `96d3e92aaa73674caec8c53a0f017b884811dbc6cf6aca008197429931c3d745` |

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
is in progress on 6d59a78734a457f2cdb1b6d11c399c344f45775e.
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

[Platform duties](PLATFORM-GAPS.md) preserve original Android API21–23, Linux
ARM32/RISC-V/boards, Win10/11 floor pending Phases3–5, Windows ARM and Apple
implementation/build/automation. Six Android lower-API ELF cross-compiles passed;
locked Flutter minSdk24 remains unresolved. Linux WSL actually failed with
HCS_E_SERVICE_NOT_AVAILABLE. No Apple executor was available; only VFY01/02
physical tests are TODO. No feature or required target was silently removed.
