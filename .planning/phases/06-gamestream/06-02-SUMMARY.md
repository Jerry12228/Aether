---
phase: 06-gamestream
plan: "02"
subsystem: native-protocol-multistream
tags: [TLS1.3, SRTP, dual-video, TDD, FEC-admission]
status: halted
checkpoint: 06-02-02-new-FEC-source-preparation-decision
checkpoint_gate: blocking-human
requires:
  - phase: 06-01
    provides: Exact real-approved TLS/SRTP ADR and OpenSSL/libSRTP sources
provides:
  - Two independent authenticated video streams over one actual TLS/UDP connection
  - Same-window video2/control progress during video1 loss and owned cleanup evidence
  - Fixed-source FEC research ledger and concrete isolated-preparation checkpoint
affects: [06-03, 06-04, 06-05]
tech-stack:
  added: []
  patterns: [per-stream-SRTP-context, authenticated-RTP-extension, bounded-userspace-relay]
key-files:
  created: [native/protocol/src/internal.h, tests/protocol-multistream.test.cjs, docs/phase06/FEC-ADMISSION.md, docs/phase06/FEC-SOURCE-AUDIT.json]
  modified: [native/protocol/CMakeLists.txt, native/protocol/src/protocol.cpp, native/protocol/tools/tracer.cpp, tests/protocol-tracer.test.cjs]
key-decisions:
  - "The real reply1 approved 06-01 only; new FEC sources remain unapproved and unlinked."
  - "Default fixed nanors source has open lineage and implementation risks; request preparation, not premature reuse approval."
requirements-planned: [NET-01, NET-02, NET-03]
requirements-completed: []
actuals:
  tokens: 14517
  tasks: 1
  commits: 3
plan_head_before: 1fe26a2
plan_head_after: d7f9ec5
duration: approximately-38min-from-first-RED-to-checkpoint
started: "2026-10-10T04:04:19Z"
checkpoint_recorded: "2026-10-10T04:40:54Z"
completed: null
coverage:
  - id: D1
    description: Actual dual video with independent key/sequence/timestamp/sink and authenticated-domain rejection
    requirement: NET-02
    verification:
      - kind: integration
        ref: tests/protocol-multistream.test.cjs#six-real-secure-dual-video-cases
        status: pass
    human_judgment: false
  - id: D2
    description: Same loss windows preserve video2/control progress; stop frees owned resources and leaves sibling context alive
    verification:
      - kind: integration
        ref: tests/protocol-multistream.test.cjs#loss-video1-and-sibling-survives
        status: pass
    human_judgment: false
  - id: D3
    description: Concrete new FEC isolated-preparation decision
    verification: []
    human_judgment: true
    rationale: New source was not included in 06-01 approval; actual user response is required and still absent
---

# Phase 6 Plan 2: Dual Video And FEC Source Checkpoint

**Task1 is complete; Task2 is halted before adding any FEC engine. Task3 and later waves have not run.**

## Accomplishments And Commits

| Task | Commit | Actual result |
|---|---|---|
| 06-02-01 RED | 3f189b7 | Six actual native two-process TLS/UDP tests failed at missing independent `streams` assertions, 0 skip; not missing executable/environment failures |
| 06-02-01 GREEN | 5d3effd | Two independent protected streams, authenticated identity extension, bounded relay, same-window fault isolation and sibling ownership |
| Task2 source gate only | d7f9ec5 | Official fixed FEC source/hash/embedded-license audit and concrete preparation choices; no FEC product source/link/approval |

The 06-01 real reply `1` was recorded in c74cfb1; completed summary c2200d8 and metadata 1fe26a2 unlock this plan. This plan does not repeat or revoke that decision. Original reviewed ADR SHA256 `0cdda0d2750ed02e7c873412b41a0033a1fe73d72d9b57f874cf91a4b3e657cc`; approval-record ADR SHA256 `b50607d81ab7de1e4a16832973f3ed866b8855106444f4015a68a7d2afcc4a34`. Reviewed bytes are preserved in owned `build/phase06/reviewed-06-01` and original tracked commit3fc54a7. Current sources/binaries are separately manifest-verified; they are not represented as the original approved binary bytes.

## Implementation Scope

One actual TLS control connection and one UDP transport carry stream104/105, each with separate libSRTP context, sequence1-8, timestamp, counters and payload digest. The standard SRTP authentication covers a 64-byte RTP/identity extension. Untrusted SSRC selects a candidate context only; unprotect/authentication occurs before metadata validation or sink mutation. Wrong stream, changed direction, forged high sequence and replay do not deliver payload or poison the later honest packets. Direction/media/role currently remain downlink/video/source; the full bidirectional/source-repair domain and rekey implementation are Task2, not claimed complete.

The Node userspace relay is outside the product library, uses ephemeral loopback ports and fixed stream/sequence fault positions. It drops video1 packets2-4; native windows2-4 each show video1=0, video2=1, control=1. Independently computed SHA256 of expected payload bytes matches both sinks. Each run uses distinct real native PIDs and fixture-only certificates; no system trust store is changed. Native receive windows are bounded to25ms/32 datagrams, payload≤1024, stream aggregate≤8*1024; these are prototype bounds, not product performance targets or the full Task2 queue/frame/FEC limits.

Stop clears owned sockets/threads/SRTP contexts. A separate dormant sibling native context retains two owned sockets until separately stopped/destroyed. Stable instance102/display103 are **identity fixtures**, not actual persistent Windows instance/display objects. No physical capture/codec/device is exercised. Private TLS identities and fault relay remain test-owned. Public ABI exports are unchanged; Task3 public type/structure work remains outstanding.

## Verification

- Final Windows x64 Debug native build: PASS, 3.1129466s, `/WX` retained. First build correctly failed C4244 on inferred relay-port integer type; changed to explicit uint16_t, then rebuilt.
- Final direct regression: **25/25**, fail/cancel/skip/TODO0, **4,752.2043ms**; `artifacts/phase06/multistream-closeout.log`. Includes existing19 tracer/canonical vectors/KAT/refusal/deadline tests and new6 multistream cases. Earlier Task1 GREEN25/25 took4,782.2119ms; raw RED6fail is retained.
- Final full standalone CTest: **10/10**, **13.04s**; `artifacts/phase06/multistream-closeout-full-ctest.log`. This includes tracer, multistream and eight pinned libSRTP tests, not ten application multistream cases.
- Label-only `protocol-fast`:2/2,7.65s; `artifacts/phase06/multistream-closeout-ctest.log`. Distinct denominator from the full native suite.
- `--verify-dossier`: PASS,8 original materials/14 original evidence entries; output reports original19/9 and approved-concrete, not today's25/10. No resealing of approval.
- Native manifest checks source SHA256 and actual EXE/DLL before each test. Raw per-case relay/PID/result/source/hash evidence: `artifacts/phase06/multistream/*.json`; synthetic=true, systemMutation=false.
- Fixed FEC research:36 blobs matched official Git objects; archive verified; embedded OBL comparison10 files, one exact match. No FEC native build/test result exists.
- `git diff --check`: PASS before checkpoint commit. A diff-size metric attempted through sandboxed Node could not spawn git (EPERM); equivalent read-only PowerShell measurement succeeded. This is not a native/test failure.

Current manifest EXE SHA256 `3162958f73e9f9ee1469b09d3700ab7eaaee73f2d51be5751c96b9291dc11a41`; DLL `f0f7e3a4989703fbdf5059e3e4242e0b6ea4993b8f268c4fde6c457e9afd0ea0`. Full input hashes are in `build/phase06/windows-x64/target-manifest-Debug.json`. OpenSSL3.5.9 and libSRTP2.8.0 remain the only linked native candidates approved for this scope. `protocol/dependencies.lock.json` and original vectors retain reviewed historical bytes/status; actual adoption is recorded by the ADR decision.

## Deviations And Issues

1. Rule3 blocker fix: `tests/protocol-tracer.test.cjs` source manifest now includes all internal cpp/h files. This one path is outside the nine-plan-path list, but is necessary to bind the added internal header and future modules to actual binaries. No unrelated subsystem or abstraction was changed; committed5d3effd.
2. Rule4/source gate: new FEC source is explicitly subject to 06-02-02/T-06-SC admission. Added two concrete review artifacts rather than silently linking nanors. The approved ADR did not contain this concrete reuse list. Default source has unsynchronized initialization, incomplete MSVC/SIMD dispatch checks, shared mutable codec scratch and allocation-bound concerns; exact embedded-source lineage is only partly matched. Findings remain open, not runtime exploits or proof of license incompatibility.
3. Authenticated high-sequence/foreign-domain packet tests do not replace full nonce exhaustion, ROC/key-generation/FEC tests. Native libSRTP upstream replay/ROC tests pass, but the planned multistream/source-repair cases remain unexecuted.

`actuals.tokens` is ceil(58,067 diff characters /4) over1fe26a2..d7f9ec5, including the research ledger; not model token usage. Eight code/review paths changed; summary/state metadata are separate. Plan/phase/NET completion is not inferred from test counts or existence of this halted summary.

## Blocking Checkpoint And Resume

Review [FEC preparation choices](../../../docs/phase06/FEC-ADMISSION.md) and [fixed source ledger](../../../docs/phase06/FEC-SOURCE-AUDIT.json).

Exact SHA256 bindings:

- FEC-ADMISSION.md: `e823f1bdf02ea36b6c374c8855b33d823711ca39d57a1106bbe0f2d9ac54c483`.
- FEC-SOURCE-AUDIT.json: `3b46c3c459545051b3ae9b19246246484283b6d1963c3856d6909f5636a783cd`.

Awaiting real choice1 `prepare-fixed-scalar`,2 `research-alternative`, or3 `hold-fec`. Response/choice/time are null; no FEC authorization exists. Choice1 approves isolated minimal fixed-pin scalar preparation, complete lineage/notices and independent native tests, **not product reuse/linking**. A prepared source/evidence dossier must return for concrete reuse approval only if its source/security gates close. No automatic version/library upgrade or contract reselection.

On response: verify both hashes and original ADR snapshot, archive reviewed bytes, record the actual answer/time/scope, then resume the selected action. Do not rerun completed Task1 RED/GREEN or treat preparation as Task2 completion. Audio/uplink/FEC/rekey/nonce/full queue limits and public types/vectors remain Tasks2/3. 06-03/04/05 remain blocked. Phase6 stays1/5 complete; total9/14 plans and2/42 phases; NET requirements remain incomplete. VALIDATION staysdraft, nyquist/wave0 false.

Phase3 remains independently halted at its corrected install-only approval gate. Apollo/foreign devices and system configuration are untouched; no driver, trust, network, restart or shutdown operation was executed or scheduled.
