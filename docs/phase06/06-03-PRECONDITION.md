# 06-03 execution preflight and proposed repair

Observed: 2026-10-10T10:35:07Z (18:35 Asia/Singapore). HEAD before this report: `4534d6b`.
Status: `blocking-human`, before Task 06-03-01. Tasks completed: 0/3. No implementation, RED test or task commit was started.

The user's current reply `1` selects execution of 06-03. It is not a new library, driver-install or system-operation approval. The original ADR and Botan reuse decisions remain valid and need no repeat approval.

## Read-only evidence

The 06-02 Debug manifest, tracer/DLL, source inputs, dependency artifacts, approved FEC inputs and native security executable passed 93 SHA256 comparisons with zero mismatches. Completed suites were not rerun. There is no interrupted agent, async job, earlier 06-03 production commit or dirty product file.

| Input | SHA256 |
|---|---|
| `.planning/phases/06-gamestream/06-03-PLAN.md` | `0416f37e1970a8533c8585c99492c492ee6a5ab54b803f7f2ee04ea9a41e406b` |
| `native/protocol/src/internal.h` | `43c35b8d52367ef3deeceba59cb5c2c12be99e966755a70e3f9319ae84b7e020` |
| `native/protocol/include/aether/protocol.h` | `f3a9a988594cbb61ec3549a98c83262c9b531db919697c32448f94f2c89e7bde` |
| `native/protocol/src/protocol.cpp` | `490f4cdfd1c769c527196babe3c801fc182874048ccf48724606119f527f1e6f` |

## Unmet prerequisite

06-03-01 assumes that the internal interfaces and versioned query/submit fields already exist. Its ownership section explicitly excludes header changes and directs later recovery/diagnostic actions through those existing fields. Query version 1 exists, but an operation schema and dispatch contract for these actions do not.

- `protocol.h:70` documents one bounded synchronous operation per connection and rejection of a second submit. `protocol.cpp:220` enforces `!submitted` before setting it permanently true.
- `protocol.cpp:146` and `:169` grant/run full media in the first exchange. They do not wait for a later resource proposal/confirmation. Moving confirmation ahead of media requires a defined control exchange and lifecycle contract.
- `protocol.cpp:256` confirms a local proposal by incrementing an approval counter. This was correctly recorded as the narrow 06-01 behavior; it is not yet a trusted budget commit or peer confirmation.
- `internal.h:74` explicitly calls the types reserved seams. `AuthorityAdapter` defines only `authorize`; there is no provider attachment/ownership/host revision or reservation interface. `RecoveryController` contains only epoch/attempt/cancel fields. These placeholders are expected future work, but do not supply the existing command contract claimed by 06-03.
- A single `decoders` field does not distinguish host upstream decoders from client downlink decoders, and pixel-rate is absent from the reserved resource vector. The plan's complete resource model needs an explicit representation.
- The public request/capability structs can express named scalar proposals. They do not define retry/cancel of an in-flight exchange, independent stream recovery, upstream set confirmation, trace start/stop/extend or trusted-authority installation. No test-only registration contract is present either.

This is a planning prerequisite mismatch, not a failing 06-02 test or a defect in its scoped completion claim. New module absence alone is not the blocker: those modules are explicitly 06-03 outputs. The missing assumption is the command/service contract those modules must consume while header changes are excluded.

## Concrete repair proposed for planning

Revise the unexecuted 06-03 plan and check its dependent 06-04 plan before production changes. Preserve all D-01–16 deliverables, original feature cases and NET requirements.

1. Add a small prerequisite slice defining the low-frequency operation/state schema and its bounded dispatch, cancellation and ownership rules. Prefer an additive API/contract that preserves existing ABI-1 layouts and the narrow tracer path. Specify how proposals/confirmations travel over authenticated control before new media starts; do not infer a new wire encoding from placeholder types.
2. Include `native/protocol/include/aether/protocol.h` and `native/protocol/src/internal.h` in explicit ownership where the chosen contract needs them. Define host/client decoder and pixel-rate budgets separately, trusted host revision and authority-provider lifetime, reservation/confirm atomicity, and fresh-auth/reset hooks. Keep fixture authority/clock/device registration only in a separately built test target; the product must refuse operations without a trusted provider.
3. Then execute budget/proposal, recovery/diagnostics and measurement slices with their RED/GREEN evidence. If the extra contract slice exceeds the project's small-plan boundary, split it into a prerequisite plan and update dependencies instead of silently expanding a task.

Planning must determine exact compatibility, framing and cancellation behavior and run plan checks. If a selected encoding changes the reviewed narrow wire or approved dependency sources, return that concrete delta for its applicable decision; this report grants no such change. A safe compatible extension does not require reapproving unchanged OpenSSL/libSRTP/Botan reuse.

Alternative: review the current plan and this evidence first. Continuing the unchanged plan would assume a nonexistent action contract or silently exceed its header ownership; neither is a valid preflight pass. Returning to Phase 3 remains a separate option and does not authorize installation.

## Workflow basis and retained state

`gsd-execute-phase/SKILL.md` requires preserving workflow gates. Its execute-plan workflow delegates deviation handling to the executor definition: unmet task preconditions stop before partial task commits, and structural/API changes require a concrete decision. Resume by selecting the proposed planning repair, not by approving a false prerequisite.

Phase 6 remains 2/5 plans; total completed plans 10/14 and stages 2/42. 06-04/05 have not run. NET remains incomplete. No 06-03 SUMMARY is created because no task began; `.continue-here.md` records this preflight checkpoint without making summary-count tooling count an unexecuted plan as complete.

Phase 3/03-03-02 and its corrected install-plan approval remain independently halted. Apollo preservation, no device/trust/network configuration change and the prohibition on executing or scheduling restart/shutdown remain in force.
