---
phase: 01-source-feature-environment-baseline
plan: "01"
subsystem: infra
tags: [source-audit, git-objects, licensing, distribution, node-test]
status: complete
requires: []
provides:
  - Fixed-object source audit and offline recovery verification for nine upstream repositories
  - Per-file evidence, external-source blockers, and fourteen distribution candidates
affects: [01-02, 01-03, production-reuse, platform-delivery]
tech-stack:
  added: []
  patterns: [fixed Git blob evidence, bounded argument-array processes, offline Git fixtures]
key-files:
  created: [scripts/validate-baseline.cjs, tests/baseline-sources.test.cjs, docs/baseline/sources.json, docs/SOURCE-AUDIT.md]
  modified: [scripts/sync-upstream.ps1, references/UPSTREAM.md]
key-decisions:
  - "User selected compatible-open-source and deferred distribution via retain-candidates; production clearance remains blocked."
  - "All upstream files remain research-only; production clearance lists are empty."
requirements-completed: []
requirements-pending: [BASE-02]
coverage:
  - id: source-identity
    description: Fixed URL/HEAD/blob and offline recovery verification with failure fixtures
    requirement: BASE-02
    verification:
      - kind: integration
        ref: "node --test tests/baseline-sources.test.cjs (31 passed)"
        status: pass
      - kind: integration
        ref: "pwsh -NoProfile -File scripts/sync-upstream.ps1 -VerifyOnly (nine repositories passed)"
        status: pass
    human_judgment: false
  - id: source-evidence
    description: Nine-tree inventory and anchored evidence with explicit unresolved external sources
    requirement: BASE-02
    verification:
      - kind: integration
        ref: "node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md"
        status: pass
    human_judgment: true
    rationale: "Structural completeness does not establish legal scope or authorize production reuse."
  - id: reuse-distribution-decision
    description: Concrete project license/reuse choices and fourteen platform/device distribution candidates
    requirement: BASE-02
    verification: []
    human_judgment: true
    rationale: "Both actual human choices are recorded with confirmation text/time and retained blockers."
---

# Phase 1 / Plan 01 — Source audit decision checkpoint

**Tasks 1–3 complete. Human route choices are recorded; BASE-02 remains pending the shared final review in 01-03. This is source evidence and route intent, not production reuse authorization.**

## Accomplishments

- Indexed all nine fixed trees: 2,964 blobs and 42 gitlinks. Independent checkout, remote, HEAD, dirty-state and blob-content checks fail closed.
- Recorded 1,332 external entries, 1,698 validated anchors and fourteen distribution candidates. There are 1,261 retained blocker records, including generated unresolved external candidates; these are not 1,261 separate user questions.
- Built a reproducible source report with fourteen curated findings, official channel terms, candidate project licenses and explicit pending decisions. Missing submodule contents, binary correspondence, driver signing and channel compatibility remain unresolved.
- Kept every upstream file research-only and all production copy/link/redistribution clearance lists empty. No product source or reference checkout was modified; no driver, package or submodule was installed/downloaded.

## Task Commits

| Task | Commit | Result |
|------|--------|--------|
| 1 RED fixtures | `a4dff69` | Actual missing-indexer assertion failure; accepted RED evidence |
| 1 tracer/recovery | `d4f4b9b` | Fixed-object tracer, CLI and offline recovery verification |
| 2 RED route coverage | `2e403a5` | Actual missing-platform-route failure; accepted RED evidence |
| 2 full audit | `5fadbf4` | Nine-tree inventory, curated evidence and distribution review package |
| 3 human decision | `c8029be` | compatible-open-source + retain-candidates; retained blockers, no production clearance |

## Verification

- Full offline fixture suite: **31/31 passed**, elapsed **62.45 seconds**. Covers real temporary Git objects, CLI/report integrity, injected Git failures/timeouts, malformed identities, traversal/junction escape, unapproved reuse, missing binary/download/route evidence and PowerShell recovery failures.
- After final evidence guards: targeted tracer, omitted-binary and GPL-template checks **3/3 passed**, **6.23 seconds**; the real nine-tree source audit passed again.
- Full real source audit: `status=PASS`, `checked=4296`, repositories=9, files=2964, externals=1332, anchors=1698, pendingDecisions=2, productionReuseApproved=false.
- `pwsh -NoProfile -File scripts/sync-upstream.ps1 -VerifyOnly`: nine repositories passed.
- `node scripts/validate-planning.cjs`: PASS, unmapped=0, localLinks=valid.
- Automated PASS proves the stated structural checks. It does not prove legal permission, exhaustive legal interpretation, platform builds, signing or hardware support.

## Deviations and Limits

- Fixed-source decoding needed UTF-16 BOM handling for SudoVDA INF evidence. GPL template appendix text is explicitly excluded as evidence that an upstream chose GPL-or-later.
- Added `.planning/phases/01-source-feature-environment-baseline/01-01-source-review.cjs` as a reproducible fixed-object curation helper (supporting Task 2 evidence). It refuses to overwrite already-selected human decisions; this adds no product scope.
- Windows sandbox Git child processes and repository metadata writes required approved tool escalation. Initial sandbox spawn failure was not counted as a RED test; genuine assertion failures were captured separately.
- The full source suite exceeded the planning target of 30 seconds (actual 62.45 seconds). The quick targeted check remains 6.23 seconds; feature and doctor suites do not exist yet, so phase-wide runtime and Nyquist compliance remain unverified.
- Apple build/toolchain evidence and Apple hardware evidence remain separate under the approved project scope. This audit establishes neither.

## Confirmed Human Decision / Handoff

User response already recorded: “compatible-open-source；暂不考虑发行”, confirmed by user at `2026-10-07T07:59:36.360Z`.

- Project reuse policy: compatible-open-source; GPL-3.0-or-later candidate intent. Specific production dependency/license obligations remain open.
- Distribution: retain-candidates; no channel selected.
- Retained blockers: project-license, external-build-scope, apple-foss-channel and distribution-accounts; all other source/package/signing blockers remain.
- Resume verification: `node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md` PASS, checked=4296, pendingDecisions=0, productionReuseApproved=false. `node scripts/validate-planning.cjs` PASS.
- Report matches rendered machine data. No product source, driver or dependency installation performed. Full fixtures were not rerun because only human-choice metadata changed; prior 31/31 results remain historical evidence.

Next: 01-02 platform feature inventory, then 01-03 environment and full human review. BASE-02 is shared with 01-03 and remains Pending until that plan completes.

## Self-Check

**PASSED.** All deliverables and task commits exist; both recorded choices match available options. Source structure/route intent verified; production clearance, platform support and Phase 1 completion are not claimed.
