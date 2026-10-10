---
phase: 06-gamestream
plan: "02"
subsystem: native-protocol-multistream
tags: [TLS1.3, SRTP, bidirectional-media, FEC, TDD, ASan]
status: complete
requires:
  - phase: 06-01
    provides: Exact real-approved TLS/SRTP ADR and fixed OpenSSL/libSRTP sources
provides:
  - Five independent authenticated synthetic media streams over actual bidirectional TLS/UDP
  - Approved bounded scalar FEC with authentication-before-repair and same-window fault isolation
  - Versioned caller-owned public media options and independent refusal/security vectors
  - Final Windows x64 Debug and separate ASan source/binary/run evidence
affects: [06-03, 06-04, 06-05]
tech-stack:
  added: [Botan3.13.0-approved-scalar-ZFEC-subset]
  patterns: [per-domain-source-repair-SRTP, staged-authentication-before-FEC, bounded-per-stream-owned-shares]
key-files:
  created: [native/protocol/src/internal.h, native/protocol/src/secure_transport.cpp, native/protocol/src/media_packetization.cpp, tests/native/protocol_media_security.cpp, tests/protocol-multistream.test.cjs, docs/phase06/FEC-REUSE-DECISION.json, docs/phase06/MEDIA-CONTRACT.md, docs/phase06/MEDIA-EVIDENCE.json]
  modified: [native/protocol/CMakeLists.txt, native/protocol/include/aether/protocol.h, native/protocol/src/protocol.cpp, native/protocol/tools/tracer.cpp, protocol/vectors.json, tests/protocol-tracer.test.cjs]
key-decisions:
  - "Real reply1 at2026-10-10T05:34:57Z approves only the exact reviewed Botan scalar subset and negotiated profile for the Phase6 synthetic prototype."
  - "Original ADR and conditional alternative-first research approval remain separate immutable historical bytes; nanors fallback was not triggered."
  - "FEC processes only same-domain authenticated shares; reconstructed structure/length/padding/digest is checked without claiming lost original-tag validation."
  - "Fresh TLS/key-generation rejects old packets; nonce exhaustion refuses before protect. Live rekey and connection recovery remain06-03."
  - "NET IDs remain incomplete until all five declaring plans and phase gates finish; Phase3 installation authorization is unchanged."
patterns-established:
  - "Separate candidate context selection from staged authentication, metadata validation, queue insertion and frame publication."
  - "Independent stream/source-repair key, replay, packet index, RTP clock and owned queue domains."
requirements-planned: [NET-01, NET-02, NET-03]
requirements-completed: []
actuals:
  tokens: 78826
  tasks: 3
  commits: 10
plan_head_before: 1fe26a2
plan_head_after: cc35d12
duration: approximately-250min-including-source-review-and-credit-waits
started: "2026-10-10T04:04:19Z"
completed: "2026-10-10T08:14:09Z"
coverage:
  - id: D1
    description: Actual dual-video independent protection and same-window sibling/control progress with owned cleanup
    requirement: NET-02
    verification:
      - kind: integration
        ref: tests/protocol-multistream.test.cjs#six-retained-dual-video-scenarios
        status: pass
    human_judgment: false
  - id: D2
    description: Five bidirectional synthetic streams with authenticated same-domain FEC and threshold/fault/bounded-queue behavior
    requirement: NET-02
    verification:
      - kind: integration
        ref: tests/protocol-multistream.test.cjs#thirteen-full-media-TLS-UDP-scenarios
        status: pass
    human_judgment: false
  - id: D3
    description: Actual independent SRTP rollover/replay/role/fresh-key/exhaustion checks and known FEC answer
    requirement: NET-03
    verification:
      - kind: integration
        ref: tests/native/protocol_media_security.cpp#six-security-and-FEC-cases
        status: pass
    human_judgment: false
  - id: D4
    description: Real conditional research and exact scalar FEC reuse approvals with fixed source/config/notices
    verification:
      - kind: manual_procedural
        ref: docs/phase06/FEC-REUSE-DECISION.json#rawResponse-and-reviewedMaterials
        status: pass
      - kind: integration
        ref: docs/phase06/MEDIA-EVIDENCE.json#inputs-fec-and-targets
        status: pass
    human_judgment: true
    rationale: Actual human approvals are recorded; automatic tests do not substitute for approval or broader real-media/redistribution decisions.
  - id: D5
    description: Independent media boundary/profile/TLV vectors and ABI-prefix/caller-owned versioned effective results
    requirement: NET-03
    verification:
      - kind: integration
        ref: tests/protocol-multistream.test.cjs#independent-parser-and-public-media-options
        status: pass
    human_judgment: false
---

# Phase 6 Plan 2: Authenticated Bidirectional Media And Bounded FEC

**Two video streams, audio, microphone and camera synthetic samples use independent protection domains over real TLS/UDP, with authenticated bounded FEC and a versioned public options contract. All three tasks are complete; Phase6 and NET are not.**

## Performance

Started2026-10-10T04:04:19Z; completed2026-10-10T08:14:09Z, approximately250 elapsed minutes including source-review checkpoints and the credit interruption, not active CPU time. Three tasks, ten task/research/decision commits,23 non-planning paths. Final Debug build6.5472068s and ASan Release rebuild6.696193s passed. No machine restart/shutdown, device/trust/firewall/network configuration or Phase3 installation operation occurred.

## Task Commits

| Task / gate | Commit | Actual result |
|---|---|---|
| Task1 RED | 3f189b7 | Six actual dual-process tests fail missing independent streams, zero skip |
| Task1 GREEN | 5d3effd | Independent dual-video, authenticated identity and same-window loss isolation |
| Initial Task2 source gate | d7f9ec5 | Fixed nanors/embedded-source audit, no link authorization |
| Conditional research decision | 037cafc | Real response `2,若无则1`, exact historical material hashes |
| Alternative research | a216b42 | Five fixed candidates, unmodified scalar Botan MSVC/ASan12/12, concrete proposal |
| Exact reuse approval | 3bc7810 | Real response `1`, separate FEC-REUSE-DECISION, reviewed bytes archived |
| Task2 RED | e6b3e78 | Actual full-media mode cases:6 pass/7 fail, unsupported mode AP_FIELD |
| Task2 GREEN | 5fd2fea | Five bidirectional protected media/FEC domains,43/43 regression |
| Task3 RED | dd74763 | Actual missing queryVersion and unknown-profile refusal fail,2 fail/zero skip |
| Task3 GREEN | cc35d12 | Public ABI/options, independent bounds, deadline/counter closure and final evidence |

Summary/state metadata commits are separate from the ten commits above. Earlier halted summaries remain in Git history; they describe historical stops, not the current status.

## Approval And Source Bindings

The original06-01 response1 at2026-10-10T03:46:30Z and c74cfb1 remains unchanged: reviewed ADR SHA256 `0cdda0d2750ed02e7c873412b41a0033a1fe73d72d9b57f874cf91a4b3e657cc`, approval-record ADR SHA256 `b50607d81ab7de1e4a16832973f3ed866b8855106444f4015a68a7d2afcc4a34`. Original8 materials/14 evidence entries are preserved in owned build/phase06/reviewed-06-01; current product bytes are separately manifest-bound, not resealed as originally reviewed bytes. `--verify-dossier` passed again and reports historical19/9, not current46/10.

The conditional research reply `2,若无则1` at2026-10-10T04:55:09Z remains in [FEC-DECISION.json](../../../docs/phase06/FEC-DECISION.json), reviewed commitdad4d9d. Preparation MD hash `e823f1bdf02ea36b6c374c8855b33d823711ca39d57a1106bbe0f2d9ac54c483` and audit JSON `3b46c3c459545051b3ae9b19246246484283b6d1963c3856d6909f5636a783cd` remain historical bytes. Five alternatives yielded a qualified scoped Botan proposal; fallbackTriggered=false and nanors remains unlinked.

New actual reply `1` at2026-10-10T05:34:57Z independently approves the exact synthetic-prototype reuse in [FEC-REUSE-DECISION.json](../../../docs/phase06/FEC-REUSE-DECISION.json), reviewed commit11f7397. [Reviewed proposal](../../../docs/phase06/FEC-ALTERNATIVES.md) hash `3ebdf494fa77c8262d620e7eb60f874c1546564c6bb866c2c9e816b18ac3fa22`; [reviewed ledger](../../../docs/phase06/FEC-ALTERNATIVES.json) hash `a3157d9e6dc90e921c017d62c9ba3f88241a4aaadd9cf07ace4676fcb02451d8`; both unchanged and archived in build/phase06/reviewed-fec-reuse. Their historical awaiting-decision wording is not overwritten.

Approved Botan3.13.0 pin `2a81eef56c96c237e590c27f9a75e60317c9c700`, archive `714d6c52c6d752808e8784df21c146e176e91c57c99ee72c08eff4439fcff872`: unmodified23cpp scalar base/hex/rng-abstract/utils/zfec subset,78 selected source/header/notice inputs. CMake checks the actual approval and every selected input; required full root/predecessor/per-file notices remain. No concrete Botan crypto/RNG/TLS provider, SIMD/CPUID/asm or shared toolkit is enabled. OpenSSL3.5.9/libSRTP2.8.0 remain fixed standard protection implementations. New negotiated profile `rs-vandermonde-gf256-11d-v1` is not bitwise baseline Cauchy; absent/unknown profiles refuse explicitly. Nonconstant-time FEC is limited to trusted-native synthetic media, never keys/credentials/nonce seeds; real-media side-channel reassessment and redistribution certification remain outstanding.

## Delivered Contract

[MEDIA-CONTRACT.md](../../../docs/phase06/MEDIA-CONTRACT.md) is the complete current wire/ownership/public contract; [MEDIA-EVIDENCE.json](../../../docs/phase06/MEDIA-EVIDENCE.json) binds final sources, decisions, FEC inputs, manifests, actual EXE/DLL/static-library hashes, logs and raw scenarios.

Two distinct native PIDs use one mutually authenticated TLS1.3 connection and actual bidirectional UDP through a test-owned userspace relay. Stream104/105 down-video,106 down-audio,107 up-mic and108 up-camera each have independent source/repair SRTP contexts, packet indices/replay windows, synthetic RTP timestamps, sink digests and owned queues. All samples are caller-provided; upstream bytes come from authenticated HELLO TLV6. No physical device is opened. Instance102/display103 are stable identity fixtures, not real device persistence.

Both peers compare canonical identity/generation/version values over TLS before grant. Full exporter domain covers host/instance/display/stream/connection/client/lease/config/key/version plus direction/media/role. AES256-GCM standard SRTP uses a16-byte tag and replay window128. Failed unprotect uses private staged bytes and never enters sink/queue/FEC; authentication then metadata agreement precedes repair. Source and repair headers are authenticated, including the160-byte RTP/extension header, block parameters, frame digest, domain IDs and deadline. Recovery validates structure/length/padding/frame digest, not a missing original tag.

Eight rounds normally send120 packets and deliver40 frames across five streams, K2/N3,64-byte shares,128-byte frames,240 actual packet bytes. Explicit packet/MTU/frame/shard/parse/count/per-stream queue/deadline bounds refuse before allocation. Original packet-cap/FEC-percentage/min-repair semantics remain; FEC255% works when resources fit. Frame publication occurs immediately at K valid shares with pre/post steady deadline checks, independent of another stream's loss window. Healthy video2/audio/control progress is sampled in rounds2..4 while video1 fails. Queue ownership is bounded and returns0; sibling context retains its own sockets until separately stopped.

Counter denominators are explicit: sent/receivedPackets/rejected/protectionRejectedPackets/expired are packets; received/recovered/dropped are frames; queueRejected is a capacity-specific subset. receivedPackets includes candidates before authentication; protectionRejectedPackets counts actual libSRTP failures. Synthetic32-bit RTP timestamp wrap and native16-bit sequence/ROC wrap are tested, not physical clocks/SLO evidence.

Fresh TLS plus new configured key generation rejects old packets; mismatched epochs refuse before grant. Index exhaustion at2^48 refuses before protect, and changed payload advances the index. No live mid-connection rekey or complete reconnect state machine is claimed. Local ABI remains1; fixed28-byte options/40-byte caller-owned effective struct layouts are tested on x64 only. The public validator checks ABI/size prefixes, publishes no partial effective values on failure and shares the bounded wire validation. queryVersion1 exposes current limits/counters/windows. Actual DLL exports only11 public protocol functions; fixture keys/fault/authority inputs live in the separate test target.

## Verification

| Final exact sources | Result | Actual duration | Log |
|---|---|---|---|
| Debug direct Node | 46/46, fail/cancel/skip/TODO0 | 14,213.3037ms | artifacts/phase06/media-final-tests.log |
| Debug full CTest | 10/10 | 24.48s | artifacts/phase06/media-final-debug-ctest.log |
| Separate ASan Release Node | 46/46, fail/cancel/skip/TODO0 | 16,892.4128ms | artifacts/phase06/media-final-asan-tests.log |
| Separate ASan Release CTest | 10/10 | 26.72s | artifacts/phase06/media-final-asan-ctest.log |

Node denominator:19 original tracer +6 retained dual-video +13 actual full-media scenarios +6 separate native protection/FEC cases +2 independent parser/public-ABI groups. CTest denominator is2 Node harness registrations and8 pinned libSRTP tests, not ten application multistream scenarios. The two independent groups consume22 settings boundary vectors plus unknown profile, exact TLV length±1, ABI2, input sizes27/29 and output sizes39/41. Original `media` vectors are retained; new section is `multiMedia`.

Full-media scenarios cover happy, threshold recovery, beyond-threshold loss, corrupted repair, cross-role, reorder/replay, delayed expiry, full queue, identity-header tamper, bounded burst, fresh epoch, stale epoch and current contract. Native helper exercises actual ROC wrap/replay, high-sequence tamper without later honest high-water poisoning, source/repair/fresh-key mismatch, unchanged retransmission/changed next-index and pre-call exhaustion; closed-form GF256 known answer0..7 -> parity8,9,10,11 is independent of encode outputs.

Final raw relay/PID/socket/source/hash results are separately preserved under artifacts/phase06/media-debug-multistream and media-asan-multistream. Every test checks current manifest/input/binary hashes; synthetic=true and systemMutation=false. ASan instruments all Aether modules,23 Botan sources and libSRTP, not the prebuilt OpenSSL archive. Actual DLL imports show the installed ASan runtime; PATH/options affect owned test children only, no install/copy/persistent environment change. No valid-case finding is not leak freedom, TSan/race freedom or complete security certification.

Historical evidence remains correctly dated: Task1 final25/25 (4,752.2043ms), fullCTest10/10 (13.04s); research product25/25 (4,764.4872ms); Task2 GREEN43/43 (11,470.7488ms); initial Task3 GREEN46/46 (14,596.735ms). Candidate research ASan12/12 (7,458.4689ms),81 independent KATs/42 survivor combinations/1,600 concurrent checks and deliberately faulty research-only heap access diagnostic/exit86 remain in immutable FEC-ALTERNATIVES. These candidate/historical binaries are not represented as current integrated targets.

## Deviations And Issues Encountered

1. Rule3 source-binding blocker: the tracer test manifest needed all internal modules, the new security target and current ASan manifest selection. Necessary tests/protocol-tracer.test.cjs and manifest-tool changes outside task-level path lists bind actual code/binaries; no unrelated refactor.
2. Rule1/3 ownership/security test closure: internal.h and the manifest helper were necessary for real module extraction; separate tests/native/protocol_media_security.cpp isolates deterministic fixture keys and boundary calls from product exports. Task3 necessarily updates coordinator/tracer/internal/source paths to implement actual public prefix validation and versioned results, rather than testing only a header declaration.
3. Rule4 source reuse correctly stopped for separate human approval. Initial source/preparation/research artifacts and decisions are preserved; exact Botan reuse is a distinct actual approval, not inferred from passing candidate tests.
4. Rule1 deadline correctness: repair initially waited until a loss window ended. Adding the deadline check exposed Windows select overshoot,34 pass/12 fail. Immediate per-stream publication plus pre/post steady checks and processing reserve corrected this; final Debug/ASan suites were rerun on the exact sources. No physical latency target is claimed.
5. Compile/test failures were retained, not disguised: MSVC /WX C4456 shadow/C3493 lambda capture were corrected; a failed build caused stale manifest rejection; an optional TLV7 regression was corrected by explicit full-mode parsing. Task3's duplicate JSON `media` fixture key was corrected to `multiMedia`, then actual behavior RED rerun before commit.
6. Separate ASan first configure was unfinished when a premature build saw no cache; waited and reran. Explicit CXX flags initially omitted /EHsc and failed /WX C4530; restored /EHsc with no vendor patch/warning disable. Earlier candidate missing runtime/Ctrl-Z stdin/oracle issues remain historical, not current passes.
7. Credit-related auto-review failure did not execute the requested command. After the user said `继续，用量恢复`, the normal approval path resumed; no bypass, system privilege or safety exception was used.

`actuals.tokens` = ceil(315,303 diff characters/4) =78,826 over1fe26a2..cc35d12 for23 non-planning paths, including source/research/decision/evidence files. It replaces the earlier partial47,687 metric; it is an estimateTokens calibration measure, never model token usage. Metadata commits are excluded.

## Readiness And Self-Check

All three06-02 tasks are complete and source/binary/evidence bindings pass; no active FEC reuse checkpoint remains. Phase6 is2/5 plans, total10/14 plans and2/42 phases. NET-01/02/03 remain incomplete because all five plans declare them. VALIDATION remainsdraft, nyquist/wave0 false; three unclassified edge probes and six descriptorless prohibitions are not auto-resolved. Original637 capability/case/condition/owner records and296 source mappings are unchanged.

06-03 is ready for the interactive next-plan confirmation: admission/proposal/resource budgets, fresh-auth recovery/authority/uplink re-confirmation, diagnostics and actual limit measurement. Existing internal interfaces are contracts, not proof these modules already exist. 06-04 real Dart FFI and06-05 five-target actual runs/independent evidence/final human review remain unexecuted. Apple physical-only TODO does not waive Apple build/simulator obligations.

Phase3 remains independently halted at03-03-02 corrected install-plan authorization, preserving Apollo/foreign devices and all installation conditions. Nothing here authorizes driver/system operations, restarting or shutting down the workstation. User setup required: none for this scoped completed plan.

Self-check: committed product/test artifacts exist; final46/46 and10/10 pass for Debug and ASan; original approvals verify; product exports are only public functions; all limitations remain explicit.
