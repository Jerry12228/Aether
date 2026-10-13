---
phase: "02"
slug: monorepo-flutter
status: verified
threats_open: 0
threats_total: 14
asvs_level: 1
block_on: high
register_authored_at_plan_time: true
created: "2026-10-08"
mode: inline skill adapter
source_commit: 9aff29216833d786b7fc0877ab544fb4df68ce5f
---

# Phase 02 — Security

This is the configured L1 verification of controls authored in the three plans.
Shared T-02-SC is counted once. It verifies the local skeleton, not remote
authentication, production drivers, distribution licenses or full ASVS compliance.
The source inputs equal clean08a005c and the approved packet fbe35f4.

## Trust Boundaries

| Boundary | Data crossing |
|---|---|
| Dart → C ABI / native threads → creator isolate | Generation token, sized structs and acknowledged scalar events |
| GPU source → Flutter texture / owned native window | D3D resources and descriptor/unregister ownership |
| Window/console → local shutdown | Close/signal requests, deadlines and diagnostic status |
| CLI/source/dependencies → processes/build/CI | Arguments, paths, owned checkouts, locked archives/actions |
| Results → capability/evidence claims | Actual outcomes, hashes, adapter identity and platform gaps |

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation / evidence | Status |
|---|---|---|---|---|---|---|
| T-02-01 | Tampering | C ABI/core | high | mitigate | core.cpp validates ABI/size/enum/token; boundary catches exceptions; core_contract.cpp invalid/stale/size/exception negatives in both configurations | closed |
| T-02-02 | Denial of service | core/Dart | high | mitigate | 64 handles/32 operations/256 pending; stop producer barrier, sequence ACK, timeout retention; real DLL flood/100-cycle/paused-observer tests | closed |
| T-02-03 | Spoofing | SDK/pub/bindings | high | mitigate | toolchains.lock.json archive/action/49 pub hashes and raw licenses; check-sources.cjs regenerates real bindings and version; clean/CI source check PASS | closed |
| T-02-04 | Elevation of privilege | adapters | medium | mitigate | platform.cpp exposes local-only Windows descriptor and four unsupported descriptors; native/FFI adapter tests; no remote input/lease/session export | closed |
| T-02-05 | Tampering | GPU/plugin | high | mitigate | RAII source resources, weak callback acquisition, per-frame owned descriptor and strong unregister completion; actual engine fault/resize/unregister and WARP tests PASS/zero counters | closed |
| T-02-06 | Denial of service | window/console | high | mitigate | unregister2s, core2s and window5s retention/diagnostics; automation bypasses final key wait; actual repeated WM_CLOSE and isolated CTRL_C_EVENT PASS | closed |
| T-02-07 | Information disclosure | diagnostics | medium | mitigate | Local scalar events with bounded histories; safeError/diagnostic sanitization; tool runner redacts credentials/debug URLs and discards oversized lines; real redaction/oversized-log negatives PASS | closed |
| T-02-08 | Repudiation | presentation evidence | low | mitigate | Six valid static raw rounds/hash manifests, explicit unavailable GPU/VRAM metrics; prior black-Texture evidence invalidated; software identity preserved; no streaming/HDR claims | closed |
| T-02-09 | Tampering | build/verify | high | mitigate | Explicit target/config allowlists, shell:false argument arrays, mandatory discovery/count/skip guards; build-tools argument/foreign-link/no-test negatives PASS | closed |
| T-02-10 | Information disclosure | tool runner | medium | mitigate | clean/redact,64KiB tail and line limit, discard through newline; credential/debug endpoint/oversized-tail tests PASS | closed |
| T-02-11 | Spoofing | CI/locks | high | mitigate | Full-SHA checkout/upload actions, contents:read, persist-credentials:false, no submodules; SHA-locked tool bootstrap and actual metadata; source drift PASS | closed |
| T-02-12 | Denial of service | process/clean checkout | medium | mitigate | Per-group/total deadlines, PID-owned taskkill tree; verified absolute cleanup ownership followed by Remove-Item -LiteralPath; exact owned checkout removed after evidence copy | closed |
| T-02-13 | Repudiation | evidence/platforms | medium | mitigate | Actual run37741148365 four builds/19 groups/142 records; four downloaded Release hashes match; platform guard keeps five duties, API21–23/extra Linux/Apple build obligations; gaps retained | closed |
| T-02-SC | Tampering | package selection | high | mitigate | Selected audited ffigen21/libclang18.1.1/49 pub archives, raw-license byte correction retained; no research product linkage/submodules; no unreviewed production selection admitted | closed |

## Accepted Risks Log

No newly accepted security risk. User final “确认” approves scoped boundaries and
evidence limits; it is not a waiver of missing controls or unknown production reuse.
Existing target/driver/license/device gaps remain in the baseline/platform ledgers.
Three unclassified CORE assumptions and six descriptor-less prohibitions remain
unresolved/null in their machine records; this audit does not invent descriptors.

## Security Audit Trail

| Audit date | Threats total | Closed | Open | Run by |
|---|---|---|---|---|
| 2026-10-08 | 14 | 14 | 0 | Inline L1 artifact/source inspection, Codex skill adapter |

Implementation inspected: native/core/src/core.cpp, core.h, platform.cpp,
presentation.cpp, selene_native_plugin.cpp, core.dart, native_panel.dart,
flutter_window.cpp, apps/helios/main.cpp, build/verify/tool-runner/clean-checkout/
check-sources/check-platforms scripts and windows.yml. Existing focused review
has0 open findings; WR-01 is fixed by4a718df. Existing clean/actual CI outcomes
are reused because completion edits change only documents, not these inputs.

## Sign-Off

- [x] Every authored threat has disposition mitigate and concrete control evidence.
- [x] No unrecorded risk acceptance substitutes for implementation.
- [x] threats_open0 confirmed at configured high threshold; lower-severity open0 too.
- [x] status verified; L1 depth and local-only scope stated.

Approval: verified2026-10-08; final boundary response “确认” recorded separately.
