---
phase: 06-gamestream
plan: "01"
subsystem: native-protocol-prototype
tags: [GameStream, TLS1.3, SRTP, OpenSSL, libSRTP, C-ABI, TDD]
status: halted
checkpoint: 06-01-03
checkpoint_gate: blocking-human
requires:
  - phase: 02-monorepo-flutter
    provides: Approved monorepo/native C ABI and lifecycle boundaries
provides:
  - Real independent-process loopback TLS control and SRTP UDP native sink
  - Complete native pending capability proposal and independent digest oracle
  - Pinned source/license/artifact inventory and concrete unapproved protocol ADR
affects: [06-02, 06-03, 06-04, 06-05, pairing, media, session-control]
tech-stack:
  added: [OpenSSL-3.5.9-candidate, libSRTP-2.8.0-candidate]
  patterns: [per-handle-socket-key-state, bounded-wire-parser, hash-bound-human-decision]
key-files:
  created:
    - native/protocol/CMakeLists.txt
    - native/protocol/include/aether/protocol.h
    - native/protocol/src/protocol.cpp
    - native/protocol/tools/tracer.cpp
    - tests/protocol-tracer.test.cjs
    - protocol/dependencies.lock.json
    - protocol/vectors.json
    - docs/phase06/PROTOCOL-ADR.md
  modified: [docs/PROTOCOL.md]
key-decisions:
  - "TLS1.3/SRTP and native reuse remain candidates, not user-approved production choices."
  - "No reference code, ENet or nanors/OBL is copied/linked; FEC reuse needs its own closed source audit."
  - "Actual five-target build/run remains required; only Apple physical evidence has a TODO exception."
requirements-planned: [NET-01, NET-02, NET-03]
requirements-completed: []
actuals:
  tokens: 867358
  tasks: 2
  commits: 4
plan_head_before: b25b555
plan_head_after: 3fc54a79ed4c609e8ac9538ee1d52d11b48efcb3
duration: approximately-60min-from-first-RED
started: "2026-10-10T02:27:48Z"
checkpoint_recorded: "2026-10-10T03:27:00Z"
completed: null
coverage:
  - id: D1
    description: Real secure two-process synthetic packet path, refusal vectors and owned cleanup
    requirement: NET-01
    verification:
      - kind: integration
        ref: node --test tests/protocol-tracer.test.cjs
        status: pass
    human_judgment: false
  - id: D2
    description: Complete native pending proposal and independent identity/budget/digest checks
    requirement: NET-03
    verification:
      - kind: integration
        ref: tests/protocol-tracer.test.cjs#complete capability plan
        status: pass
    human_judgment: false
  - id: D3
    description: Concrete ADR, original setting safety dispositions and scoped native reuse decision
    verification: []
    human_judgment: true
    rationale: Mandatory 06-01-03 blocking-human architecture and reuse decision has no real response yet
---

# Phase 6 Plan 1: Secure Tracer And Concrete ADR Checkpoint

**Two of three tasks complete; real Windows x64 prototype evidence is committed, but the concrete ADR has not been approved.**

The `started` value is the first durable RED commit time, not a fabricated initialization timestamp. Duration is approximate wall time from that point to this checkpoint. `actuals.tokens` is ceil(3,469,432 committed diff characters / 4), the workflow estimate scale, not model token consumption. The generated full source/notice/parity ledger dominates this number; it should not be used as handwritten-code calibration. Nine planned production/document paths changed. Summary/state metadata commits are separate.

## Progress And Commits

| Task | Commit | Actual result |
|---|---|---|
| 06-01-01 RED | c1bd244 | Actual target-dependent assertion failed because the audited target manifest did not exist |
| 06-01-01 GREEN | 02903c4 | Source-built crypto, separate native TLS/UDP processes, independent sink digest; 10/10 tests and CTest9/9 |
| 06-01-02 RED | 9aee05d | 12 tests: 10 pass, 2 actual failures for missing native proposal evidence and missing independent vectors |
| 06-01-02 GREEN | 3fc54a7 | Complete proposal, independent vectors/KAT, 296 source rows, 637 preserved records/cases, exact concrete ADR and source/notice/artifact ledger |
| 06-01-03 | not executed | blocking-human; choice/raw response/time remain null |

Tasks1/2 are complete within their scoped prototype contract. 06-01 itself is NOT complete, Phase6 is 0/5 plans complete, and NET-01/02/03 remain incomplete. 06-02 is blocked by halted06-01; 06-03,06-04,06-05 are transitively blocked and have not started.

## Verification

| Command / evidence | Final result |
|---|---|
| cmake -S native/protocol -B build/phase06/windows-x64 -G "Visual Studio 18 2026" -A x64 | PASS; standalone Windows target, pinned local headers/static libraries; initial configure approximately26.4s |
| cmake --build build/phase06/windows-x64 --config Debug | PASS; own /W4 /WX C++20 target, source/binary manifest from actual final rebuilt target |
| node --test tests/protocol-tracer.test.cjs | PASS19/19; fail0/cancelled0/skipped0/todo0; 5,038.0752ms |
| ctest --test-dir build/phase06/windows-x64 -C Debug --output-on-failure --no-tests=error | PASS9/9; 10.48s; includes protocol_tracer, datatypes/cipher/kernel/rdbx/replay/ROC/SRTP/test_srtp |
| node tests/protocol-tracer.test.cjs --verify-dossier | PASS; 8 material digests,14 process/log digests, native source/dependency/archive/binary checks and19/9 report counts |
| node scripts/validate-planning.cjs | PASS; 42 phases,105/105 requirements mapped,0 unmapped,9 reference repositories, valid local links |
| git diff --check | PASS |
| dumpbin /exports aether_protocol.dll | Actual10 exports: ack,cancel,confirm,create,destroy,negotiate,propose,query,stop,submit; no fixture authority/fault export |
| OpenSSL local source build | PASS; 386,536ms; existing Perl/MSVC, repository-only install, upstream conversion warnings retained |

Node test reporter selected the human-readable format, despite the retained `.tap` log filename. It is not misrepresented as TAP parsing: the dossier verifier checks the explicit reporter totals. Raw logs/owned-process JSON are ignored under artifacts/phase06; their exact digests are durable in the ADR.

Actual tests cover separate native PIDs/ports, mTLS trust/peer identity/read permission, versions/ordering/upgrade hint, malformed/oversize/required/duplicate fields, 18 independent static wire vectors plus511/512/513-byte boundaries, real linked AES256GCM known answer, full proposal/digest/cancel/expiry/duplicate confirmation, callback-stop synchronization and authenticated byte-trickle absolute deadline. Slow peer result was approximately2,070ms, native status11, zero grant and zero sockets. No performance threshold is inferred from this operation timeout.

## Checkpoint Materials

| Material | Exact SHA256 |
|---|---|
| docs/phase06/PROTOCOL-ADR.md | 0cdda0d2750ed02e7c873412b41a0033a1fe73d72d9b57f874cf91a4b3e657cc |
| protocol/dependencies.lock.json | 770ecca238ba813cad0e13ae735ed0bc79d1e072c00bba78656563ef6df3fec4 |
| protocol/vectors.json | 7eeb3cc28bc4b82dbdfaf19a00a780edcef78d69cb4361119a57ef774bf1e238 |
| tests/protocol-tracer.test.cjs | f142cbdabf57fd29bf72366e75fb0382874c7e59408617c2b6b9ba5ce65d959f |
| Debug tracer EXE | 73318800dd1e632e36992d1f6bad912f0fc4c42ab3f2adeceaad21b11cb177bf |
| Debug protocol DLL | 10df1288d07e31b40bbce83bfb67ae3bb1d20e492df91267343b820e4791f8e2 |

The ADR binds all four native source files, test/lock/vectors/PROTOCOL documentation, exact source-built libraries and14 raw evidence/logs. The external whole-ADR digest above avoids circular hashing. No approval is inferred from auto-review tool authorization or automatic tests. After future real approval, retain this reviewed digest and original response/time separately; do not overwrite history with a newly edited ADR self-hash.

Read [concrete ADR](../../../docs/phase06/PROTOCOL-ADR.md). Options: approve-concrete / revise-concrete / hold. Exact awaited decision: scoped TLS1.3 reliable control and SRTP media; narrow version/wire/errors and complete proposal contract; key/FEC direction; original encryption mode0 and plaintext mode1 disabled with visible reasons and mandatory mode2 alternative; only OpenSSL3.5.9/libSRTP2.8.0 scoped reuse. No broader transport replacement, unreviewed FEC reuse, system operation or Phase3 install approval is bundled.

## Deviations And Limits

Task2's five declared paths were insufficient to implement its required native D02-04 contract. The necessary four native paths were extended within the plan's existing nine-path boundary. Inline review also fixed two defects: stop must wait for an in-flight callback before disposal, and blocking per-read timeouts must not permit unbounded authenticated trickling. Actual regressions pass; these extra fixes are not falsely labeled RED-first commits. No new subsystem or product implementation was added.

Sandbox child spawning initially returned EPERM; identical owned-process checks were rerun with approved escalation. EPERM is retained as an environment failure, not the behavioral RED. A batch-shim quoting attempt produced an empty untracked `({path` artifact; it was inspected and removed as this run's own zero-byte output. No user changes were reverted. Independent SHA verification and official secure fetch succeeded; failed browser/PowerShell TLS lookups were not bypassed with insecure certificate handling.

The native library is loopback-only, one synchronous synthetic exchange per handle, no worker threads or persistent instance cleanup APIs. Caller-supplied identity and read permission are not production pairing/permission validation. TLS peer certificates are real test-only identities, not a system trust installation. Proposal confirm changes only an approval counter, not a production reservation/stream. Five-target builds/run, real remote connect, multistream/audio/uplink/FEC/nonce/rekey/recovery/priority/budget/FFI remain unperformed. CMake currently pins Windows-specific library paths; portable adapters must be implemented later. Apple physical TODO does not waive device-library/simulator build/run obligations. No OS minimum/support claim follows from this Win11 x64 prototype.

Original637 cases/conditions/owners remain; Win10 HDR follows approved R1 SDR alternative, Win11 D2 HDR stays required. Six descriptorless prohibitions and three unresolved edge probes retain their original unresolved status; substantive tests do not falsely turn an absent generic verifier into PASS. ASVS is not a certification claim.

## Resume

On a real user reply, resume at06-01-03, read this SUMMARY and ADR/lock/vectors, verify all exact bytes and reports before binding choice/raw response/UTC time. approve-concrete may finish06-01 and permit06-02; revise/hold may not. Revisit locks/ADR and repeat relevant tests when material changes. Preserve the separate Phase3 03-03-02 corrected plan4fa13eea gate, Apollo and existing resources. No system mutation, device/trust/firewall/network configuration change, restart/shutdown or scheduling occurred in this run.
