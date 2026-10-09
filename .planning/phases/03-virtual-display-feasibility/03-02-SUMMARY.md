---
phase: 03-virtual-display-feasibility
plan: "02"
status: complete
subsystem: windows-display-transactions
tags: [windows, ccd, setupapi, iddcx, transactions, tdd, hwnd]
requires:
  - phase: 03-01
    provides: Admitted dedicated aether-helios-display source and package
provides:
  - Authenticated short CLI with protected persistent groups and atomic journal/last-success
  - Compiled pinned private IOCTL and exact CCD/advanced-color native backend
  - Strict A/B/C/D seven-slot contracts, explicit named recovery and owned HWND patterns
  - Rebuilt lifecycle-correct dedicated package with historical admission hashes retained
affects: [03-03, 17-display-lifecycle]
tech-stack:
  added: []
  patterns: [token-derived ownership, same-directory flush-and-replace journal, exact rational refresh, isolated test binary, bounded Windows calls]
key-files:
  created: [apps/helios/display_commands.cpp, apps/helios/display_json.h, apps/helios/display_registry.h, apps/helios/display_registry.cpp, apps/helios/display_test_pattern.cpp, native/platform/windows/virtual_display_mutation.cpp, native/platform/windows/helios_display_pin.h, tests/virtual-display-contract.test.cjs, tests/helios-display-lifecycle.test.cjs, scripts/record-helios-display-lifecycle.cjs, docs/phase03/HELIOS-DISPLAY-CLI.md, docs/phase03/HELIOS-DISPLAY-CONTRACT-EVIDENCE.json, docs/phase03/HELIOS-DISPLAY-LIFECYCLE-EVIDENCE.json, docs/phase03/PROVIDER-ADMISSION-03-01-HISTORY.json]
  modified: [CMakeLists.txt, native/platform/windows/virtual_display_provider.cpp, tests/native/virtual_display_contract.cpp, scripts/prepare-helios-display-research.cjs, docs/phase03/PROVIDER-ADMISSION-RECONSTRUCTED.json]
key-decisions:
  - New 2026-10-09 execute-phase authorization covers 03-02 implementation; actual installation/topology/config/reset remain 03-03 concrete authorization work
  - Production accepts no test injection even when the legacy test-hooks cache option is enabled
  - Revised provider source/package is rebuilt and re-audited; old dossier and actual hashes remain historical evidence
  - Contract/native-build evidence does not complete VDP-01/02 or Phase 3 machine validation
requirements-planned: [VDP-01, VDP-02]
requirements-completed: []
actuals:
  tokens: 44578
  tasks: 2
  commits: 6
  diff_characters: 178312
  files: 19
  plan_head_before: e821906f21da39dc1752959c7f2310de8886b805
  plan_head_after: eb70bbd531dc1dd5718650c01c5932e9fd415cf5
coverage:
  - id: D-01-03-06-09-12-contract
    description: Persistent A identity, duplicate/concurrent create, owned compensation and core lifetime separation
    requirement: VDP-01
    verification:
      - kind: integration
        ref: tests/virtual-display-contract.test.cjs#tracer and registry suites
        status: pass
    human_judgment: false
  - id: D-05-07-08-10-contract
    description: Seven distinct slots, physical/no-physical rows, Win10 SDR/Win11 mixed HDR, exact refresh, capacity and strict refusal
    requirement: VDP-02
    verification:
      - kind: integration
        ref: tests/virtual-display-contract.test.cjs#topology and failure suites
        status: pass
    human_judgment: false
  - id: D-11-12-contract
    description: Missing/changed mappings, pending crash/deadline and explicitly named recovery preserving stable logical IDs
    verification:
      - kind: integration
        ref: tests/virtual-display-contract.test.cjs#recovery and registry suites
        status: pass
    human_judgment: false
  - id: D-04-owned-window-contract
    description: Real hidden HWND pattern windows close via WM_CLOSE while persistent groups remain
    verification:
      - kind: automated_ui
        ref: tests/virtual-display-contract.test.cjs#pattern suite
        status: pass
    human_judgment: false
  - id: security-and-native-build
    description: Owner/token/desktop/ACL/path bounds and compiled private native integration
    verification:
      - kind: integration
        ref: tests/virtual-display-contract.test.cjs#security suite
        status: pass
      - kind: other
        ref: docs/phase03/HELIOS-DISPLAY-CONTRACT-EVIDENCE.json#builds
        status: pass
    human_judgment: false
  - id: real-device-matrix
    description: Win10 seven SDR, Win11 D2 HDR, persistence and foreign/physical preservation on installed revised package
    verification: []
    human_judgment: true
    rationale: Reserved for 03-03 concrete system authorization and actual machine evidence; no mutation was executed in 03-02
duration: 83min
completed: 2026-10-09
---

# Phase 3 Plan 2: Persistent display transactions and strict topology Summary

**Helios now has protected cross-process display-group transactions, a compiled pinned Windows adapter, strict seven-slot contracts, explicit recovery and independently owned pattern windows.**

## Performance

- Tasks: 2/2, plus necessary dedicated-source lifecycle prerequisites.
- Measured interval: persisted pre-commit ledger creation 2026-10-09T07:30:43.5028298Z through implementation closeout 2026-10-09T08:53:55.1001163Z (83 minutes; initial context-reading time is outside this instrument).
- Actual scale: 178312 characters of `git diff e821906..eb70bbd` / 4 = 44578 tokens. Six commits measured from `.git/gsd-plan-head-before-03-02`, 19 changed paths; SUMMARY/state metadata commits are outside this pre-SUMMARY count.

## Accomplishments

- CLI create/query/update/delete/recover validate the real token SID, authentication LUID, active console/Default desktop, protected owner DACL, bounded names/numbers, registry schema and stable GUIDs. Junctions, reparses, hard links, foreign owner and malformed UTF-8 are refused. Owner mutex wait is 2s and ordinary command budget 10s.
- Same-directory journal files are flushed and atomically replaced before provider effects. Last-success commits only after whole-group exact mode/HDR/rational readback. Partial failures compensate proven newly created slots; uncertain effects or failed restore preserve pending. Query never performs recovery. Matching NAME recovery preserves logical IDs and records changed system mappings.
- Defaults cover A/B/C/D with seven distinct GUIDs, exact 60/1, Win10 all SDR and Win11 D2 HDR contract scenarios. Physical anchor and default complete-request row reservations preserve successful groups; capacity, overlap, HDR or 59.94 failures never silently downgrade. Delete B preserves A/C/D and foreign metadata.
- Real native code enumerates and verifies the sole private hardware/interface, installed driver-store INF/DLL pins, zero-watchdog profile and protocol, sends bounded overlapped per-GUID IOCTLs, and validates/applies full CCD topology with exact advanced-color readback. Foreign snapshots include mode, position, primary and color/rotation/scaling/status fields. Shared cloned sources and detected topology races are refused; uncertain effects retain journal.
- Explicit test-pattern creates actual HWND/GDI resources with per-slot labels and distinct patterns, closes its own windows through WM_CLOSE, and never deletes persistent monitors. Core stop/ack/destroy and prior actual Ctrl+C process tests retain the original lifecycle boundary.

## Task Commits

1. Prerequisite RED — `415a44d`: arrival cleanup and full-capacity duplicate GUID guards.
2. Prerequisite GREEN/re-audit — `77c9697`: dedicated-source lifecycle repairs, rebuild and revised package evidence with old hashes preserved.
3. Task 1 RED — `635ef5f`: actual persistent-A CLI tracer fails before implementation.
4. Task 1 GREEN — `278e7d7`: authenticated transactions and pinned native Windows adapter; tracer feedback gate passed before expansion.
5. Task 2 RED — `192f604`: seven-slot topology, recovery and pattern behavior fails before expansion.
6. Task 2 GREEN — `eb70bbd`: strict topology/recovery, real owned windows, expanded security/budget/capacity regression and CLI/evidence documents.

## TDD Gate Compliance

| Work | Intentional RED | Gate | GREEN |
|---|---|---|---|
| Dedicated-source prerequisites | Lifecycle transformation assertions fail before the repair | Actual behavior assertions, not a sandbox EPERM result | 2 lifecycle guards and targeted 19-case regression pass |
| Task 1 | 5 tests, 5 failures; target A create expected exit0 but unsupported command refused | `task1-red.json`, `RED_EVIDENCE_OK` | Initial five cases + exact 2 tracer/registry CTest pass |
| Task 2 | 16 tests, 7 pass/9 fail; target seven-slot request fails because C/D defaults absent | `task2-red.json`, `RED_EVIDENCE_OK` | Final 25 display cases in Debug/Release plus all 8 display CTest suites pass |

Both RED evidence checks were rerun successfully at closeout. Global TDD default false did not exempt either task's `tdd=true`. Cleanup and module separation occurred inside GREEN without changing contract behavior; no separate REFACTOR commit was necessary.

## Verification

| Actual command/result | Scope |
|---|---|
| Debug and Release CMake native builds: exit0 each | Real production and isolated-test adapter/registry/window code compiled and linked |
| Debug CTest 11/11, 26.54s | Eight display suites plus three prior core suites |
| Release CTest 11/11, 25.32s | Same eight display suites and core regression |
| Debug Node 27/27, 23.2867s, zero skip/todo | 25 display behavior cases + 2 prior actual process cases |
| Release Node 27/27, 21.4822s, zero skip/todo | Same complete cases |
| Admission/research/input/lifecycle Node 19/19, 475.8736ms, zero skip | Dedicated source/package correctness and truthful gates |
| Current admission `--stage admission --require-decision`: PASS | Concrete selected revised aether-helios-display dossier |
| `git diff --check` and modified-source TODO/FIXME/skip scan: clean | Commit hygiene and no blocking implementation stubs |

Native suite dispatch registers only its matching required cases, rejects zero-case discovery and does not use filtered skip results as proof. CTest's machine probe is read-only; Node backend state is isolated and labelled contract. These are repeated instruments over the same cases, not independent proofs of device support. Durable records and raw-log hashes: `docs/phase03/HELIOS-DISPLAY-CONTRACT-EVIDENCE.json`; ignored raw logs and RED records: `artifacts/phase03/contract`.

## Decisions Made

- The user's new execute-phase instruction authorizes implementation after the earlier 03-01 stop; its historical text is preserved as prior scope, not used to block this plan.
- Production accepts no test injection regardless of legacy CMake test-hooks option. A same-owner protected `machine-authorization.v1.json` bound to package/SID/login/desktop/commands is required for production mutations and is not created by 03-02.
- Use the current admitted reconstructed dossier, not historical provider references. The revised fixed package is separately rebuilt, signed with the already authorized certificate and re-audited; final driver remains uninstalled.

## Deviations from Plan

### Auto-fixed Issues

1. **[Rule 1 — Bug] Arrival failure leaked provisional monitor resources and capacity rejected an existing GUID before lookup.** The independent source preparation now installs WDF context cleanup, removes only the provisional list entry/connector/object on failed arrival, and checks GUID idempotence under the monitor lock before capacity. No ignored upstream checkout was edited. Commits `415a44d`, `77c9697`.
2. **[Rule 2 — Missing critical evidence] Source repairs invalidate old package hashes.** Rebuilt x64 research package, reused existing authorized local trust without trust-store changes, rechecked signature/catalog/notices/ACL-source correspondence and source-input manifest, copied the prior dossier byte-for-byte, and updated only affected current admission evidence. Historical hashes remain in `PROVIDER-ADMISSION-03-01-HISTORY.json`. Commit `77c9697`.
3. **[Rule 3 — Blocking stale context] PLAN references the initial provider dossier and combines routing/adapter/window source paths.** Current admitted dossier was authoritative; implementation is split into owned Helios command/registry/pattern modules and a separate real mutation backend while the original read-only facade continues refusing untrusted direct mutation. Commits `278e7d7`, `eb70bbd`.
4. **[Rule 2 — Protected logging] Actual caller logs must not depend on a writable repository CWD.** Redacted attempted-command logs use the protected per-user registry directory and returned logPath; ignored verification logs remain artifacts/phase03. Attempts never claim operation success. Commit `eb70bbd`.

## Issues Encountered

- Restricted sandbox child-process/Git metadata access produced EPERM or fail-closed branch lookup. Authorized elevated tool runs supplied actual tests/builds and verified nonprotected branch; these environment failures were never counted as intentional RED or passing evidence.
- Existing STATE used prose without a parseable Current Plan counter. Closeout restored the labeled 2-of-3 position and reran the GSD advance handler successfully to plan 3; historical admission scope remains labeled history.
- The WDK build returned success but its bundled InfVerif emitted a DLL-loading exception. The original log is retained; independently invoked installed x64 InfVerif passed all six configured checks. Lifecycle evidence states this diagnostic instead of calling the entire build diagnostic-free.
- Windows SDK macro collisions/Windows integral JSON types and CTest working-directory dispatch were repaired during Task 1. The final guard supports integer/enum serialization and repository-resolved test files.

## Known Stubs

None that prevent 03-02's contract and native-code objective. Null actual/system mappings describe unobserved/pending state; the read-only facade's refusal is intentional, with the real transaction backend wired separately. No required test was skipped. Actual device validation is the explicitly separate 03-03 gate, not an invented passing test.

## Threat Flags

| Flag | File | Description and control |
|---|---|---|
| threat_flag: local-authorization-file | apps/helios/display_registry.cpp | A new local scope record gates device mutation; same protected owner directory, token/package/login/desktop checks and explicit command array. It is not a security boundary against the same user editing their own file. |

T-03-04/05/06/07/08 have implemented token/ACL/path/journal/owned-ID/budget/exact-mode controls and contract evidence. Actual native driver and global CCD side-effect mitigations still need 03-03 machine validation. T-03-09 logs contain command/group only and patterns capture no desktop contents. Shared source/supply-chain control remains bound to revised admission. No new network endpoint or capture path is introduced.

## Remaining Evidence and Next Readiness

- No final-package installation, topology apply, registry profile mutation, driver reset, new trust action, reboot or shutdown was performed. Foreign SudoMaker/Oray devices were not changed.
- Win10 seven SDR, Win11 seven with D2 HDR, installed-driver persistence, actual foreign/physical preservation and visible per-slot pattern placement are unperformed 03-03 machine checks. Native HDR preflight can prove OS/profile/capacity before effects; new target GPU/advanced-color capability is observable only after arrival and must pass strict readback before success. HDR field correspondence/quality remains machine evidence.
- CCD exposes no atomic compare-and-swap: before/after/validation-adjacent comparisons reduce races but do not prove zero global side effects under outside system actors. Uncertain operations preserve pending; no global rollback is asserted.
- VDP-01/VDP-02 remain incomplete, Phase 3 is 2/3 plans complete, and 03-03 must stop at its concrete system authorization checkpoint. No automatic later-plan execution is authorized by this executor result.

## Self-Check: PASSED

- All 19 committed changed paths exist; task commit hashes `415a44d`, `77c9697`, `635ef5f`, `278e7d7`, `192f604`, `eb70bbd` exist in the phase branch.
- Measured base/count/end are e821906f21da39dc1752959c7f2310de8886b805 / 6 / eb70bbd531dc1dd5718650c01c5932e9fd415cf5.
- Actual tests, log counts/hashes and both RED gate records were checked before this SUMMARY. No unexpected tracked deletion; only orchestrator-generated untracked `.gsd/` sentinel remains intentionally outside commits.
