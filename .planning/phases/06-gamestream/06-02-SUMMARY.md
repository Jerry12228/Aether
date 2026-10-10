---
phase: 06-gamestream
plan: "02"
subsystem: native-protocol-multistream
tags: [TLS1.3, SRTP, dual-video, TDD, FEC-admission]
status: halted
checkpoint: 06-02-02-Botan-concrete-reuse-decision
checkpoint_gate: blocking-human
requires:
  - phase: 06-01
    provides: Exact real-approved TLS/SRTP ADR and OpenSSL/libSRTP sources
provides:
  - Two independent authenticated video streams over one actual TLS/UDP connection
  - Same-window video2/control progress during video1 loss and owned cleanup evidence
  - Five fixed-source FEC alternatives and tested Botan scalar concrete reuse proposal
affects: [06-03, 06-04, 06-05]
tech-stack:
  added: []
  patterns: [per-stream-SRTP-context, authenticated-RTP-extension, bounded-userspace-relay]
key-files:
  created: [native/protocol/src/internal.h, tests/protocol-multistream.test.cjs, docs/phase06/FEC-ADMISSION.md, docs/phase06/FEC-SOURCE-AUDIT.json]
  modified: [native/protocol/CMakeLists.txt, native/protocol/src/protocol.cpp, native/protocol/tools/tracer.cpp, tests/protocol-tracer.test.cjs]
key-decisions:
  - "The real reply1 approved 06-01 only; new FEC sources remain unapproved and unlinked."
  - "Real response 2,若无则1 authorizes alternative-first research and conditional nanors preparation, not linking."
  - "A qualifying scoped Botan scalar prototype proposal was found; fallback was not triggered and concrete reuse remains unapproved."
requirements-planned: [NET-01, NET-02, NET-03]
requirements-completed: []
actuals:
  tokens: 47687
  tasks: 1
  commits: 5
plan_head_before: 1fe26a2
plan_head_after: a216b42
duration: approximately-71min-from-first-RED-to-current-checkpoint
started: "2026-10-10T04:04:19Z"
checkpoint_recorded: "2026-10-10T05:15:31Z"
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
    description: Real alternative-first research decision with conditional fixed-scalar fallback
    verification:
      - kind: manual
        ref: docs/phase06/FEC-DECISION.json#rawResponse
        status: pass
    human_judgment: true
    rationale: Real response 2,若无则1 recorded with reviewed hashes; only research/preparation scope
  - id: D4
    description: Fixed alternatives and bounded independent scalar candidate evidence
    verification:
      - kind: integration
        ref: tests/protocol-fec-candidate.test.cjs#12-research-cases
        status: pass
    human_judgment: false
  - id: D5
    description: Exact Botan subset and new negotiated FEC profile concrete reuse decision
    verification: []
    human_judgment: true
    rationale: Candidate evidence does not authorize new source reuse; separate actual answer is still absent
---

# Phase 6 Plan 2: Dual Video And FEC Source Checkpoint

**Task1 is complete; Task2 is halted before adding any FEC engine. Task3 and later waves have not run.**

## Accomplishments And Commits

| Task | Commit | Actual result |
|---|---|---|
| 06-02-01 RED | 3f189b7 | Six actual native two-process TLS/UDP tests failed at missing independent `streams` assertions, 0 skip; not missing executable/environment failures |
| 06-02-01 GREEN | 5d3effd | Two independent protected streams, authenticated identity extension, bounded relay, same-window fault isolation and sibling ownership |
| Task2 source gate only | d7f9ec5 | Official fixed FEC source/hash/embedded-license audit and concrete preparation choices; no FEC product source/link/approval |
| Real research decision | 037cafc | Actual response `2,若无则1`, exact reviewed material hashes/archive and alternative-first conditional preparation scope |
| Alternative research only | a216b42 | Five official fixed-source audits, minimal unmodified Botan build, 12/12 ASan candidate cases and concrete reuse dossier; no FEC product linking |

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
- Initial fixed nanors research:36 blobs matched official Git objects; archive verified; embedded OBL comparison10 files, one exact match. At that historical checkpoint no FEC native build/test result existed; nanors remains unprepared and unlinked.
- This continuation: five alternatives audited at official fixed pins. Botan archive SHA256 `714d6c52c6d752808e8784df21c146e176e91c57c99ee72c08eff4439fcff872`;4,041 regular files matched official Git blobs. One symlink excluded without following it. zfec export-subst archive difference was detected and explicitly recorded, not ignored. Full relevant source/license hashes and notices are in FEC-ALTERNATIVES.json.
- Botan3.13.0 scalar official MSVC x64 static build: PASS,14,718ms;23cpp, modules base/hex/rng/utils/zfec, `/MT /W4 /WX`, no vendor source patch. SIMD/CPUID/asm/shared library disabled; no concrete crypto/RNG/TLS/socket provider enabled. Library SHA256 `03cff010ad57fed0e78f1f46eecb035196beadfde72eb277e0d53d0b5db83ac3`.
- Separate AddressSanitizer research build instruments all23 sources and caller. Candidate suite **12/12**, fail/cancel/skip/TODO0, **7,458.4689ms**;81 independent parity KATs,42 threshold survivor combinations,1,600 concurrent checks/16 joined threads, malformed/bounds/atomic rejection cases. A deliberately faulty research-only heap access produces actual ASan diagnostic/exit86; valid cases produce no finding. No leak/TSan/exhaustive race proof is claimed. Research EXE SHA256 `b22ea47b03cdd9276f12ec304d0e633c9582714fc32403cee854cc0280ce9bcf`;85 input paths are hash-bound.
- Candidate corruption limitation is tested honestly: unauthenticated corruption changes recovered bytes, not FEC authentication. Auth-before-repair and complete-domain validation remain Task2 obligations.
- Continuation product regression: **25/25**, fail/cancel/skip/TODO0, **4,764.4872ms**, artifacts/phase06/fec-research-product-regression.log. The prior full CTest10/10/13.04s is retained historical evidence, not rerun in this continuation. No Aether product source/binary changed.
- `git diff --check`: PASS before checkpoint commit. A diff-size metric attempted through sandboxed Node could not spawn git (EPERM); equivalent read-only PowerShell measurement succeeded. This is not a native/test failure.

Current manifest EXE SHA256 `3162958f73e9f9ee1469b09d3700ab7eaaee73f2d51be5751c96b9291dc11a41`; DLL `f0f7e3a4989703fbdf5059e3e4242e0b6ea4993b8f268c4fde6c457e9afd0ea0`. Full input hashes are in `build/phase06/windows-x64/target-manifest-Debug.json`. OpenSSL3.5.9 and libSRTP2.8.0 remain the only linked native candidates approved for this scope. `protocol/dependencies.lock.json` and original vectors retain reviewed historical bytes/status; actual adoption is recorded by the ADR decision.

## Deviations And Issues

1. Rule3 blocker fix: `tests/protocol-tracer.test.cjs` source manifest now includes all internal cpp/h files. This one path is outside the nine-plan-path list, but is necessary to bind the added internal header and future modules to actual binaries. No unrelated subsystem or abstraction was changed; committed5d3effd.
2. Rule4/source gate: new FEC source is explicitly subject to 06-02-02/T-06-SC admission. Added two concrete review artifacts rather than silently linking nanors. The approved ADR did not contain this concrete reuse list. Default source has unsynchronized initialization, incomplete MSVC/SIMD dispatch checks, shared mutable codec scratch and allocation-bound concerns; exact embedded-source lineage is only partly matched. Findings remain open, not runtime exploits or proof of license incompatibility.
3. Authenticated high-sequence/foreign-domain packet tests do not replace full nonce exhaustion, ROC/key-generation/FEC tests. Native libSRTP upstream replay/ROC tests pass, but the planned multistream/source-repair cases remain unexecuted.
4. Candidate preparation failures are retained: missing ASan DLL in the test child's environment, Windows text-mode Ctrl-Z stdin truncation, then an incorrect additional closed-form oracle assumption. Fixed only the research environment/caller/oracle; all81 external vector bytes and vendor algorithms were unchanged. Installed ASan is child-PATH-only, not installed/redistributed. The upstream configure process uses a local Git discovery ceiling; provenance is the audited pin, not a falsely inferred parent Git version.
5. Proposed profile `rs-vandermonde-gf256-11d-v1` is not bitwise-compatible with baseline nanors Cauchy. Explicit profile negotiation and explainable no-intersection rejection are required; no legacy-peer compatibility requirement is invented. Original packet-size/FEC settings and capabilities remain obligations. Botan table arithmetic is not constant-time: proposal is limited to synthetic Phase6 trusted-native processing with SRTP on all source/repair packets, no keys/credentials/nonce seeds in FEC input, and no local cache-side-channel claim. Real-media adoption must reassess that boundary, not silently switch to ciphertext FEC.

`actuals.tokens` retains the initial14,517 diff-size estimate and adds33,170 = ceil(132,679 diff characters/4) overdad4d9d..a216b42, including this continuation's decision/research ledger; total47,687 is not model token usage. Metadata summary/state commits are separate. Plan/phase/NET completion is not inferred from test counts or existence of this halted summary.

## Blocking Checkpoint And Resume

The initial [FEC preparation choices](../../../docs/phase06/FEC-ADMISSION.md) and [fixed source ledger](../../../docs/phase06/FEC-SOURCE-AUDIT.json) were actually reviewed and answered; their bytes remain unchanged. [FEC-DECISION.json](../../../docs/phase06/FEC-DECISION.json) records response `2,若无则1` at2026-10-10T04:55:09Z, reviewed commitdad4d9d and owned archive build/phase06/reviewed-fec-preparation. This grants research first, fallback preparation only if no qualifying alternative is found. A qualifying scoped Botan proposal was found, so fallbackTriggered=false. Neither this response nor the earlier TLS/SRTP approval grants FEC reuse.

Historical preparation SHA256 bindings:

- FEC-ADMISSION.md: `e823f1bdf02ea36b6c374c8855b33d823711ca39d57a1106bbe0f2d9ac54c483`.
- FEC-SOURCE-AUDIT.json: `3b46c3c459545051b3ae9b19246246484283b6d1963c3856d6909f5636a783cd`.

Current review: [concrete Botan proposal](../../../docs/phase06/FEC-ALTERNATIVES.md) and [fixed sources/configuration/notices/evidence](../../../docs/phase06/FEC-ALTERNATIVES.json). Exact new bindings:

- FEC-ALTERNATIVES.md: `3ebdf494fa77c8262d620e7eb60f874c1546564c6bb866c2c9e816b18ac3fa22`.
- FEC-ALTERNATIVES.json: `a3157d9e6dc90e921c017d62c9ba3f88241a4aaadd9cf07ace4676fcb02451d8`.

Awaiting separate real choice1 `approve-botan-prototype-reuse`,2 `prepare-fixed-nanors-instead`, or3 `hold-reuse`. New reuse response/choice/time remain null; FEC-REUSE-DECISION does not exist. Choice1 approves exact Botan pin `2a81eef56c96c237e590c27f9a75e60317c9c700`,23 selected sources/required headers/notices and explicitly negotiated profile for synthetic Phase6 Task2 integration, not a second crypto provider, redistribution certification or real-device/five-platform support. Choice2 is isolated preparation only, not linking. No silent upgrade or transport/protocol reselection.

On response: verify the two new hashes and original ADR snapshot, archive reviewed bytes, record a separate FEC-REUSE-DECISION with actual answer/time/scope, then resume the selected action. Do not overwrite the research decision or rerun completed Task1 RED/GREEN, and do not treat candidate tests as Task2 completion. Audio/uplink/FEC/rekey/nonce/full queue limits and public types/vectors remain Tasks2/3. 06-03/04/05 remain blocked. Phase6 stays1/5 complete; total9/14 plans and2/42 phases; NET requirements remain incomplete. VALIDATION staysdraft, nyquist/wave0 false.

Phase3 remains independently halted at its corrected install-only approval gate. Apollo/foreign devices and system configuration are untouched; no driver, trust, network, restart or shutdown operation was executed or scheduled.
