---
phase: 02-monorepo-flutter
plan: "03"
status: complete
subsystem: repository-tooling-ci
tags: [CMake, Flutter, Windows, GitHub-Actions, provenance]
requires:
  - phase: 02-02
    provides: actual GPU presentation and local shutdown evidence
provides:
  - Explicit single-product build and independent mandatory verification
  - Final committed clean checkout with four product builds and 19 passing groups
  - Audited source/lock/license/binding checks and five-platform duty ledger
  - Actual passing full-SHA minimal-permission Windows Actions evidence
affects: [Phase-2-final-human-checkpoint, Phase-3]
requirements-completed: [CORE-01, CORE-02, CORE-03]
requirements-progress: []
human_approval: confirmed
human_response: 确认
human_recorded_at: "2026-10-08T08:15:03.000Z"
tested_source_commit: 08a005ca5a3e2137345e2dbd2f5153bb6c37cade
key-files:
  created:
    - scripts/build.ps1
    - scripts/verify.ps1
    - scripts/verify.cjs
    - scripts/tool-runner.cjs
    - scripts/check-sources.cjs
    - scripts/clean-checkout.cjs
    - scripts/prepare-generator.ps1
    - scripts/bootstrap-ci.ps1
    - .github/workflows/windows.yml
    - docs/phase02/EVIDENCE.md
    - docs/phase02/EVIDENCE-RESULTS.json
    - docs/phase02/PLATFORM-GAPS.json
    - docs/phase02/PLATFORM-GAPS.md
    - docs/phase02/PLATFORM-RESULTS.json
    - docs/phase02/LICENSE-BYTE-AUDIT.json
  modified:
    - CMakeLists.txt
    - apps/selene/windows/runner/main.cpp
    - packages/selene_native/lib/src/core.dart
    - packages/selene_native/test/core_contract_test.dart
    - toolchains.lock.json
    - docs/DEVELOPMENT.md
    - docs/DEPENDENCIES.md
    - docs/NATIVE-CONTRACT.md
coverage:
  - id: root-build-and-verify
    description: Explicit product targets, real versions and required checks from tracked clean HEAD
    requirement: CORE-01
    verification:
      - kind: command
        ref: pwsh -NoProfile -File scripts/verify.ps1 -Scope All -Automation -CleanCheckout
        status: pass
    human_judgment: false
  - id: actual-windows-ci
    description: Actual Actions run with both products and every mandatory check
    requirement: CORE-03
    verification:
      - kind: ci
        ref: https://github.com/Jerry12228/Aether/actions/runs/37741148365
        status: pass
    human_judgment: false
---

# Plan 02-03 — complete

All three tasks are complete. The human replied exactly “确认” after the final
packet presented actual CI, clean builds, the three unclassified CORE assumptions
and all six descriptor-less prohibitions. Recorded at 2026-10-08T08:15:03.000Z.
This approves the Phase2 repository/native boundary and stated evidence limits;
it does not supply new physical keyboard/device/platform observations. The earlier
publication approval remains a separate decision. Phase3 has not started.
The prior PARTIAL record is preserved as historical resumption evidence.

## Executed evidence

Final source 4a718df passed four explicit Debug/Release Helios/Selene builds and
All verify from a fresh checkout with spaces, no research tree or prior artifacts.
19 required groups passed; the report records 137 actual test cases/native suites,
complete per-group timings, binary versions 0.1.0/ABI1 and binary/log SHA256.
Native worker/callback/ACK/lifecycle, real Dart DLL, real GPU engine/pixels,
fault rollback/retry, repeated WM_CLOSE and real isolated Helios Ctrl+C all passed.
The owned checkout was deleted only after copying evidence back and validating
its absolute ownership. See docs/phase02/EVIDENCE.md and EVIDENCE-RESULTS.json.

22 authored boundary files received an inline standard code review, following the
skill adapter's no-agent fallback. WR-01 reproduced a paused subscription hanging
dispose after native teardown. The actual-DLL TAP witness received RED_EVIDENCE_OK;
the fix initiates stream close without awaiting paused consumers and uses a
monotonic Dart drain clock. Debug/Release regression and the final clean run pass;
no open finding remains in this review scope.

Six actual Android API21/22/23 ARM32/ARM64 ELF core builds pass. Locked Flutter's
minimum API24 remains a separate unresolved UI/engine gap; original APIs stay v1.
Actual Ubuntu probes fail before compiler startup with HCS_E_SERVICE_NOT_AVAILABLE.
Apple implementation, build and automation remain required; only physical VFY01/02
is TODO. Windows floor/ARM/media/HDR/driver/remote-session evidence remains pending.

## Commits and corrections

- d0d9207 / b982d9d: validated root-target/platform RED before implementation.
- 29d03e6: root build/verify/source/platform/CI implementation and development docs.
- efe6618: actual first-clean Flutter plugin privilege failure corrected with a
  metadata-validated local junction retry; no system Developer Mode change.
- ed50626: retained audited-copy license bytes; its commit message overstates raw
  archive extraction. The direct-byte verification was not yet complete at that
  commit and is superseded by the following explicit audit correction.
- eed530d: verified all original package archives, preserved license bodies and
  prior digests, and re-extracted/hash-locked actual LICENSE bytes. Early extraction
  had added/converted terminal newlines; Git exposed the copy/archive difference.
- 8ac234c: actual paused-observer failure witness and code review.
- 4a718df: bounded local dispose fix, tested in final clean checkout.

Failed first and second clean attempts remain failed; the third old-HEAD clean
pass is retained but superseded by the post-review final pass. Raw expanded Flutter
RED could not be parsed by the GSD TAP gate and was not accepted; the actual test
was rerun through a real TAP witness before GREEN. No fabricated test output or
manual CI substitute was used. Initial black-Texture presentation evidence remains
invalid/superseded as recorded in 02-02, with six valid replacement rounds retained.

## CI continuation and completed final checkpoint

The user authorized public publication with exact reply “确认” on 2026-10-08;
origin Jerry12228/Aether main is configured and fixes were pushed without force.
Actual runs 37721726261 / 37732241885 / 37734973473 failed and remain failed;
37734251073 was cancelled to include a software-label correction. Actual API,
image/tools, log and artifact hashes are in docs/phase02/CI-RESULTS.json.
First run proved hosted SDK28000 installation and exposed Flutter link spelling.
Link fix 6d59a78 passed the later local clean 0617a3e (four builds, 19 groups,
138 recorded cases); its raw report/checkout artifacts are retained in clean-history.
Second/fourth runs passed four builds and 18/19 groups; baseline temp-checkout
identity failed. Casing-only fix 8c03b92 reproduced a real defect but did not close
hosted aliases. Native OS canonicalization 9aff292 passed its actual namespace
regression and the full 96 baseline/tool tests locally.
Actual second-run Basic Render Driver softwareAdapter=false was incorrect.
The initial local WARP probe was GREEN, not RED. A hash-verified real CI-record
witness received RED_EVIDENCE_OK; 560e1d2 combines known software identity/flags,
adds vendor/device diagnostics, two real WARP tests and an engine assertion.
Fourth-run actual adapter vendor5140/device140/label=true, both GPU paths, cleanup
and the same witness pass. Its overall failed status remains unchanged.
The latest clean rerun 08a005c passed four explicit product builds, all 19 groups
and 142 recorded cases/native suites (309.474s), versions0.1.0/ABI1 and safe owned
checkout removal after copying evidence. Fifth actual run
https://github.com/Jerry12228/Aether/actions/runs/37741148365 on source
9aff29216833d786b7fc0877ab544fb4df68ce5f passed all four explicit builds and all
19 required groups / 142 recorded cases, actual version0.1.0/ABI1. Exact runner
and tools, software adapter identity, zero resource counters, logs and uploaded
archive digest are retained. Four downloaded Release binary hashes match verify;
git diff proves clean/CI product, tooling, tests and locks are identical.
No required check is missing/skipped. Actual task02-03-02 is complete.

The final human checkpoint can now review patterns,
scaling/DPI/close/retry, real interactive console final-key behavior, local-only
resource boundaries and remaining target duties. Three unclassified CORE assumptions
and all six descriptor-less prohibitions remain flagged-unverified, unchanged.
Final reply “确认” is recorded above; no Phase3 implementation is authorized by this checkpoint.

Final pre-review checks were rerun on 2026-10-08 after synchronizing the packet:
node scripts/check-sources.cjs --check exited0, PASS (49 hosted packages,
50 product source files, real ffigen21/audited libclang18.1.1 generation and
version/lock/license checks). node scripts/validate-planning.cjs exited0,
PASS (42 phases,105/105 v1 requirements mapped, valid local links). `git diff
--check` passed. The canonical summary was created only after the explicit human response.

## Threat Flags

All 14 distinct planned threat controls (including shared T-02-SC) are verified
at configured L1 depth in 02-SECURITY.md, open0; no new risk was accepted.
No production driver/license/remote-authentication assurance is implied.

## Completion evidence

- Technical source: clean08a005c / CI9aff292; four builds,19 groups/142 records.
- Final packet: fbe35f4; human exact response: 确认.
- CORE-01: root build/shared version/one app, explicitly scoped skeleton.
- CORE-02: real native/Dart ownership, scalar events, ACK/cancel/stop barriers.
- CORE-03: actual passing Windows CI and five honest adapter descriptors.
- Existing Phase1 regression files all pass in the final clean/CI baseline group;
  the full group contains96 records and includes the tool/platform additions.
- Win10 floor/ARM/other targets, streaming/HDR/media/driver/production reuse gaps
  retain their original duties; only Apple physical VFY01/02 stays TODO.
