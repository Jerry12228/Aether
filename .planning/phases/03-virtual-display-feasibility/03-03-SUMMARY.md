---
phase: 03-virtual-display-feasibility
plan: "03"
subsystem: windows-driver-package
tags: [Windows, SetupAPI, NewDev, Authenticode, virtual-display, TDD]
status: halted
checkpoint: 03-03-02
checkpoint_gate: blocking-human
requires:
  - phase: 03-02
    provides: Pinned provider adapter, protected persistent group registry and seven-slot contracts
provides:
  - Native fixed-package verification and immutable read-only install plan
  - Guarded real install/update/rollback transactions and independent contract backend
  - Concrete current Win11 machine/package/plan authorization review
affects: [03-03-machine-matrix, 17-virtual-display-lifecycle, 39-windows-delivery]
tech-stack:
  added: [SetupAPI, NewDev, WinTrust, Crypt32]
  patterns: [owner-protected staging, shared installation mutex, durable side-effect journal, hash-bound approval]
key-files:
  created:
    - native/platform/windows/driver_package.cpp
    - native/platform/windows/driver_package.h
    - tests/native/driver_package_contract.cpp
    - scripts/virtual-display-package-runner.cjs
    - scripts/record-virtual-display-install-plan.cjs
    - docs/phase03/HELIOS-DISPLAY-INSTALL-PLAN.json
    - docs/phase03/HELIOS-DISPLAY-INSTALL-PLAN.md
  modified:
    - apps/helios/main.cpp
    - apps/helios/display_registry.cpp
    - apps/helios/display_registry.h
    - CMakeLists.txt
    - tests/virtual-display-package.test.cjs
    - scripts/check-virtual-display.ps1
key-decisions:
  - "Use the admitted local derived package with pinned actual bytes; do not fabricate an upstream release URL."
  - "Reuse the protected group store and mutex; bind machine, identity, binary, package, registry and observed resources to approval."
  - "No system mutation is authorized by implementation approval; stop at Task2. Reboot and shutdown remain prohibited."
requirements-planned: [VDP-01, VDP-02]
requirements-completed: []
actuals:
  tokens: 59674
  tasks: 1
  commits: 6
plan_head_before: 841f958b1df459ecacece2963e3abf1eb004f201
plan_head_after: aaeda0e867d111bdcef35758fe8a97fd17c5d3ef
duration: 63min
started: "2026-10-09T09:11:12Z"
checkpoint_recorded: "2026-10-09T10:14:29Z"
completed: null
---

# Phase 3 Plan 3: Native Package Plan and Authorization Checkpoint Summary

**固定包安装代码与合同已完成；用户单独安装授权因 Apollo 隔离前置缺陷被阻断。INF 已修正、重建和重签，新计划可审阅，尚未安装，等待新字节对应的具体授权。**

Latest continuation: RED `5050b4a`, correction/evidence `aaeda0e`. User original text `1\n不得影响主机已有的Apollo运行` is preserved verbatim with its original plan/package/binary hashes in the conditional authorization record. The old install was never invoked. No runtime authorization file was created. The sections below retain Task1's historical checkpoint facts; the latest fixed inputs and continuation results are at the end of this summary.

## Progress and Task Commits

1/4 tasks complete. Task 03-03-01 is complete; Task 03-03-02 awaits a human decision. Tasks 03-03-03/04 have not run. Phase3 and VDP-01/02 remain incomplete.

| Task | Commit | Result |
|---|---|---|
| 03-03-01 RED | `329a2dc7da593b76590b91147ab1f09a8a7ee234` | Real CLI plan behavior assertion failed before implementation |
| 03-03-01 GREEN | `5c7f61776685e9cbb0d145caec3a8386a8bcefbe` | Native package transactions, bounded runner and contract tests |

The persisted ledger measures two production/TDD commits from the recorded base through GREEN. `actuals.tokens` is ceil((74,797 realized diff characters + 21,458 review-document characters)/4), on the plan estimate scale. Summary/state metadata commits are separate. Twelve files are in the measured committed diff, plus the two durable review documents. Duration includes the usage interruption and resumed execution.

## Accomplishments

- Production CLI queries the current machine, installed/foreign resources, registry/groups, profile and caller identity, then verifies pinned ZIP length/hash/nine-member allowlist, INF/DLL/CAT, licensing inputs and native Windows catalog/signature policy. Read-only plan does not create the store, invoke UAC, write configuration, import trust or install devices.
- Real SetupAPI/NewDev installation is compiled behind exact plan, machine, package, identity, protected authorization-file and administrator-token checks. Same-version readiness checks avoid reinstall; version differences require explicit update. Registered groups require a bound maintenance interruption and explicit recovery plan; unknown private monitors block updates.
- Shared owner mutex, individually protected staged/backup files, hash readback, durable journal and effect ledger preserve registry/last-success and verified old package. Known failure compensates only proven new resources or restores and verifies the old package. Timeout, failed rollback, unknown effects and reboot-required retain pending state. There is no reboot/shutdown API or upstream installer execution.
- Current Win11 machine review and exact command are durable in [HELIOS-DISPLAY-INSTALL-PLAN.md](../../../docs/phase03/HELIOS-DISPLAY-INSTALL-PLAN.md) and its JSON. The independent native contract executable drives the same transaction engine without production test injection.

## TDD Gate Compliance

Task1 is a behavior-adding TDD tracer. RED exercised the real production CLI before implementation: `vdisplay driver install --plan --json` returned 2 where success 0 was required. Evidence: `03-03-RED-01.json`; `check tdd-red-evidence` returned `RED_EVIDENCE_OK` / `target_test_failed`, one target failure and zero skips. RED commit contains only the behavior test and evidence. GREEN implements the required behavior and extends negative/transaction coverage. No refactor-only commit was needed.

## Verification and Evidence Limits

| Verification | Latest result |
|---|---|
| Helios Release required build | PASS; 5,663ms total (configure352ms/build5,308ms) |
| Package Contract runner / package tests | PASS; 35/35, failures0, skips0, todo0; TAP1,040.4829ms, tool1,107ms |
| Independent native regression CTest | PASS; 11/11, 25.14s (display8/core3) |
| Actual production read-only install plan | PASS; `systemMutation=false`, fixed canonical plan and binary hashes |
| Admission fixed-package prerequisite | PASS on identical approved unsandboxed read-only verification; digest below |
| Actual install/update/rollback/topology/HDR/persistence/reset | UNTESTED; no machine authorization or machine execution |
| Final humanReview | null; Task4 not reached |

The final CTest round covered the functional staging/file-protection changes. The subsequent plan-action-label correction was rebuilt and covered by the final 35 package tests. Native contract failures/rollback successes are contract evidence, not machine installation evidence. Full Task3 clean-checkout All verification and actual Win10/11 matrix remain future required checks.

Ignored local raw receipts/logs are under `artifacts/phase03/package-contract/` and `artifacts/phase02/tooling/`; the durable JSON retains their exact file digests, redacted observations, classifications, package facts and input commit. No fake machine PASS, authorization or human review was generated.

## Historical Task1 Fixed Checkpoint Inputs — superseded for execution

| Input | Value |
|---|---|
| Machine | `win-5f5cc5dd3cf310b6`, Win11 Enterprise LTSC10.0.26100 |
| Source / signed package | `helios-1791531076814` / `helios-1791531228575`,0.1.0.0/x64 |
| ZIP SHA256 | `b3ce3b4427e0e3a1f11d76ef1759429f8f3ca478c4431b716995865114d9a4ae` |
| Admission dossier SHA256 | `47fe64f8396b75a9072b84f8347b97d2934192c6d44a7502774390327fcd48b0` |
| Plan SHA256 | `2df29cc5eac710f30e142a27178a7a23ca36f3083abe42fe423822934d66f8c0` |
| Release binary SHA256 | `c9f214a654d8866f539d55144c9402486aace631c839157845e73c503c807c2b` |

Executable: `D:\WorkSpace\Aether\build\native\Release\helios.exe`; argv: `["vdisplay","driver","install","--approve-plan","2df29cc5eac710f30e142a27178a7a23ca36f3083abe42fe423822934d66f8c0","--json"]`. The command has not run. Any change to bound observations/input requires a new plan and matching approval. Existing Root/TrustedPublisher trust of `E3ED742C3D08188A117AFF7B6C1BB207523EB4DB` is retained; this is bounded local self-sign admission, not Microsoft certification or universal distribution approval.

## Deviations from Plan

1. **Authorized local origin adjustment:** The admitted package is an actual local derived/self-signed artifact, without an upstream release URL. Validate fixed bytes and native current-machine trust rather than fabricate HTTPS download or reopen the user-approved self-sign route. No download or new trust import occurred.
2. **User prohibition overrides stale reboot language:** All reboot/shutdown actions, including scheduling and the plan's earlier manual-reboot option, remain prohibited. Reboot-required is pending/untested.
3. **[Rule2 - Missing critical functionality] Shared protected store and per-file staging:** Added the header, registry callback and shared runner/recorder files beyond Task1's initial five-file list to enforce the same caller identity/mutex and prevent writable/reparse staging or incomplete rollback state. Included in GREEN; scope remains package correctness and reviewability.
4. **Environment setup applied at the concrete gate:** Missing Win10 does not prevent no-side-effect implementation. It remains a mandatory Task2/3 environment decision and cannot be replaced by Win11 evidence.

## Issues Encountered and Approval Review

Initial source include/build and RED-evidence schema/quoting issues were corrected before final checks. Initial sandbox Windows trust queries could not launch required independent children; the same read-only admission verification succeeded with approved execution. No admission dossier bytes were altered.

Automatic approval review rejected the proposed Machine/Install negative invocation with a fake authorization hash because that entry can perform real installation and the current user scope excludes system installation. The command was never executed and was not retried/bypassed. Missing-authorization rejection is tested through the independent native contract backend; an actual Machine fail-closed result is not claimed.

BCD read-only query was denied for the current nonadmin caller. Current observed SecureBoot registry1, HVCI registry0/VBS0 remain unchanged; default-security evidence is partial. Foreign SudoMaker/Oray/physical resources,20 existing Display/Monitor PnP records and one active2240x1400@30000/1000 SudoMaker path remain preserved.

## Known Stubs

None in the completed Task1 implementation. Actual installation/readiness, update/rollback, seven-screen/HDR, persistence, reset/recovery, Win10 matrix and final review remain untested future tasks. Task3's evidence checker and expanded machine scenarios are not implemented or claimed complete by this partial summary.

## Awaiting Task2 Decision

The latest durable plan offers corrected Win11 Install separately from subsequent Topology/Persistence/DeleteIsolation. The old specific install-only approval remains genuine but its Apollo precondition failed; it does not approve the rebuilt package/plan. ResetRecovery first requires the installed private root and complete group/slot IDs; UpdateRollback requires a verified installed old package, backup and separate maintenance plan. Win10 needs a separate available/approved test machine and plan. No runtime authorization file exists. Only after concrete approval of the new fixed plan and a fresh passing preflight may the protected identity-bound install-only file be created. Do not mark VDP or Phase3 complete.

Resume at **03-03-02**, then execute only individually approved Task3 operations and stop again at Task4's mandatory human review. Phase3 validation/Nyquist remain draft/false and requirements remain incomplete.

## Self-Check: PASSED

Historical Task1 self-check: all eight implementation/review/RED-evidence files and RED/GREEN objects existed and matched its then-recorded input commit. Required Task1 build/Contract tests passed with no skipped tests. The unrun matrix/review remains retained.

## Apollo Constraint Continuation — 2026-10-09

**Gate:** blocking-human, new fixed-plan approval. **Progress:** Task1 complete; Task2 original conditional authorization recorded, new package approval pending; Task3 only prerequisite evidence collected, installation/matrix unperformed; Task4 unreached.

The old INF put DeviceGroupId at `HKR` root. The installed Apollo/Oray registry readbacks put their groups under Device Parameters/WUDF. The new independent test failed at the real wrong-line assertion before the fix (exit1, tests1/fail1/skip0); the corrected template and generated INF now place the group under WUDF. Exactly seven of eight compiled source inputs match the previously admitted revision. The only INF change is `HKR,"WUDF","DeviceGroupId",0x00000000,"HeliosDisplayGroup"`; device ACL, private hardware/interface, IOCTL access, DeviceAdd and the entire Driver.cpp remain unchanged. Prior MS-PL/CC0/notices and precise ACL correspondence are re-audited without claiming runtime corrected grouping.

Primary evidence: [Microsoft IDD INF](https://github.com/microsoft/Windows-driver-samples/blob/main/video/IndirectDisplay/IddSampleDriver/IddSampleDriver.inf) and [UMDF device pooling](https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/using-device-pooling-in-umdf-drivers). Shared UMDF process failure can restart other pooled devices; corrected source grouping supports a constrained attempt but is not a guarantee of zero impact. Runtime WUDF grouping, separate hosting and installation noninterference remain untested.

| Input | Latest value |
|---|---|
| Machine | win-5f5cc5dd3cf310b6, Win11 build26100 |
| Source / signed package | helios-1791547416299 / helios-1791547543587 |
| ZIP SHA256 | da25eeab4bdba29f440a89ec698aa8c5e66811001e3976ef47d93bba15eeaa12 |
| Dossier SHA256 | 78324da77c8ff2936337e3da948d8358105c7392792cecb679ccc92b948ea00d |
| Native plan SHA256 | 4fa13eea427d0a90b3075f85e6813d2f246463dadb41e259d309660e4e77a60a |
| Helios Release SHA256 | 824a6b8b2158c9d713dc2a5eeee88721ae7eccf18786d7096d7258e94f532994 |

Latest checks: required Helios Release build PASS9,185ms; actual WDK x64 build exit0 with the existing bundled InfVerif loader exception retained; six independent installed x64 INF checks PASS; original wrong /osver invocation failure retained separately then corrected to documented NTamd64 target syntax. Existing E3ED742C3D08188A117AFF7B6C1BB207523EB4DB signing certificate reused, no new certificate/trust import; catalog members, timestamp, embedded signer/default Windows policy PASS. Source/lifecycle7/7 PASS427–443ms, package Contract35/35 PASS1,052.0039ms TAP, native CTest11/11 PASS25.31s; zero skipped tests.

Preparation-wide and additional45,957ms bounded read-only observations are unchanged: ApolloService Running/PID6820 start2026-10-08T22:45:44.799770+08; sunshine.exe PID15176/parent6820 start22:45:47.820787+08; WUDFHost2388/2660/3708/4420 retain identities. Apollo config/binaries, SudoVDA0.22.37.632/oem44.inf and Oray17.50.19.949/oem88.inf,20foreign records,8foreign driver-store file hashes, shared WUDFRd policy, zero observed establishedTCP tuple count and active2240×1400@30000/1000 x0y0 SDR/LUID0:145065/UID256/\\.\DISPLAY10 remain identical. ZeroTCP does not assert absence of UDP streams or unchanged media quality. Read-only SetupAPI store lookup returned87; unique exact published-INF hash correspondence established the store identity and the diagnostic remains recorded.

Durable evidence: `HELIOS-DISPLAY-APOLLO-CONDITIONAL-AUTHORIZATION.json`, `HELIOS-DISPLAY-APOLLO-PREFLIGHT.json`, `HELIOS-DISPLAY-UMDF-ISOLATION-EVIDENCE.json`, new `HELIOS-DISPLAY-INSTALL-PLAN.md/json`. Old plan/dossier are separately preserved in `*-03-03-HISTORY.*` and `PROVIDER-ADMISSION-03-02-HISTORY.json`; ignored raw artifacts retain all failure logs. No machine authorization carries forward, no installed/readiness PASS is fabricated, no provider config/topology/reset/update/trust or power action occurred. Full Task3 matrix, Win10, All clean-checkout verification and final human review remain unrun; existing ledger entries remain open.

**[Rule1 - Bug]** Wrong INF WUDF group path was directly found by the newly required Apollo preflight. Fixed exact field and rebuilt/re-audited all changed package/pin inputs; RED5050b4a/GREENaaeda0e. **[Rule2 - correctness]** Added durable read-only continuity and conditional-authorization evidence so the new constraint is reviewable. No new architecture, network endpoint, auth path or privileged machine operation introduced; file access is limited to prerequisite evidence under existing phase ownership.

Measured actuals now use the persisted03-03 ledger base through aaeda0e: commits6 (including historical metadata commits in that range), tokens59,674=ceil(realized committed diff chars/4). Tasks remain1/4; metadata closeout is separate. No completion metric or requirement waiver is inferred.

## Continuation Self-Check: PASSED

New scripts, corrected INF, pins, RED evidence, current/historical dossiers and exact review artifacts exist; 5050b4a and aaeda0e commit objects exist. Admission and nativeplan match the new digests. All comparison flags are true. Actual install/UMDF-host readback and the remaining matrix/human gates are explicitly unperformed, with Phase3/VDP incomplete.
