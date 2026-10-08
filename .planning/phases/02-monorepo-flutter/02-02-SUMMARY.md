---
phase: 02-monorepo-flutter
plan: "02"
status: complete
subsystem: windows-presentation-lifecycle
tags: [D3D11, Direct2D, DirectWrite, Flutter, Windows]
requires:
  - phase: 02-01
    provides: real DLL ABI and acknowledged local core ownership
provides:
  - Real native GPU Texture and owned HWND surface with pixel and resize evidence
  - Manual validation panel, retained core on render failure and bounded close
  - Actual Helios foreground, redirected input and isolated Ctrl+C evidence
  - Six valid static measurement rounds and retained failed exploratory evidence
affects: [02-03]
key-files:
  created: [native/platform/windows/presentation.cpp, apps/selene/lib/native_panel.dart, scripts/check-ui.ps1, scripts/check-helios.ps1, scripts/measure-presentation.ps1, docs/PRESENTATION-PROBE.md, docs/phase02/PRESENTATION-RESULTS.json]
  modified: [packages/selene_native/windows/selene_native_plugin.cpp, apps/helios/main.cpp]
requirements-completed: []
requirements-progress: [CORE-01, CORE-02, CORE-03]
coverage:
  - id: gpu-presentation
    description: Actual engine pixels and same-source native surface, full 16:9 resize
    requirement: CORE-02
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/check-ui.ps1 -Suite Panel -Automation
        status: pass
    human_judgment: false
  - id: local-shutdown
    description: Actual repeated WM_CLOSE with in-flight core work; zero core/render counters
    requirement: CORE-02
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/check-ui.ps1 -Suite Lifecycle -Automation
        status: pass
    human_judgment: false
  - id: helios-exit
    description: Debug/Release foreground liveness, actual CTRL_C_EVENT and redirected stdin
    requirement: CORE-01
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/check-helios.ps1 -Automation -Configuration Release
        status: pass
    human_judgment: false
  - id: static-comparison
    description: Both actual backends have 30s warmup/60s sampling/3 rounds, actual pixel gate and honest unavailable metrics
    requirement: CORE-02
    verification:
      - kind: integration
        ref: pwsh -NoProfile -File scripts/measure-presentation.ps1 -CheckReport -Output artifacts/phase02/presentation-final
        status: pass
    human_judgment: false
completed: 2026-10-08
---

# Phase 02-02 — Presentation and local exit

D3D11/D2D/DirectWrite static images now reach a real Flutter GPU Texture and an
owned native swapchain window. Core initialization is automatic; images and
backend selection are manual. Both contain the complete 1280×720 source.

## Evidence

- Panel: two widget state/redaction tests and three actual Windows engine tests.
  Real initialization failure/retry, device/texture/register/first-frame rollback,
  delayed unregister TIMEOUT/retry and actual bright-text pixel assertion pass.
- Lifecycle: same engine group plus actual repeated WM_CLOSE with a 30-second
  in-flight probe. close_ready reports native core handles=0, threads=0,
  liveSources=0, activeRegistrations=0, outstandingDescriptors=0. A normal app
  build is restored afterward. No host session/display-group/lease API exists.
- Helios Debug and Release: two actual process tests per configuration; self-test
  and redirected stdin exit without a key prompt; forced init failure is nonzero.
  A unique owned console sends real CTRL_C_EVENT after proving foreground
  liveness; signal_received=1 and all core resources return to zero.
- Final same-source measurement: 542 seconds, 30s warmup + 60s window x3 per
  backend. Texture CPU (one logical core) 0.47/0.26/0.34%; surface
  0.47/0.52/0.62%. CPU/RSS are actual OS/process samples, static and instrumented;
  these numbers establish no media performance superiority. GPU/VRAM unavailable
  with reasons. Six rounds each clean up to zero.
- Actual adapter RTX 5080, softwareAdapter=false, DPI144. Driver/OS/SDK/revisions,
  source digests, raw samples, logs and screenshot hashes are in
  docs/phase02/PRESENTATION-RESULTS.json. Raw logs/rounds remain under ignored
  artifacts/phase02/presentation-final and artifacts/phase02/ui/helios.
- Tracked PNGs show the full GPU Texture preview and native portrait/wide
  letterboxing. Genuine interactive console, manual all-pattern/DPI observations
  remain queued for 02-03's final evidence review.
- Static analysis, binding/version drift, 29 existing doctor/planning tests and
  native Debug/Release 3/3 regressions also pass.

## Commits and deviations

- 0564dc6: actual Windows engine presentation RED; validated RED_EVIDENCE_OK.
- 6f58069 / 62fb241 / 76f1d56: Helios RED. Initial human-readable Node reporter
  could not be parsed by the GSD validator; TAP rerun against the unchanged
  pre-GREEN executable verified the actual redirected-input assertion failure.
  Initial implementation text was drafted before that parser correction; no
  changed executable had run. The invalid record was replaced and retained in
  Git history rather than counted as authorization evidence.
- 020bfff: tightly coupled rendering/consumer/close ownership and Helios changes
  committed together. Window-close and expanded acquisition tests were added
  during implementation; RED directly covers the engine tracer and Helios prompt,
  not every later expanded case. No artificial post-implementation RED was made.
- Counter-only tests initially missed black Texture pixels. Source review of the
  fixed engine showed it reads descriptor dimensions AFTER release_callback.
  Persistent descriptor storage plus separately released frame payload fixes the
  actual use-after-free. Pixel regression and PNGs now verify visible text.
  The initial six CPU/RSS rounds are explicitly failed/superseded, not a pass.
- Native producer completion is bounded before publishing a new immutable frame;
  unregister completion owns descriptor/TextureVariant lifetime. The Flutter
  Texture consumer is removed before retiring the registration.
- Test-only native capture uses GPU staging/WIC. GDI Flutter view capture was
  unreliable/black and is excluded from visual success evidence.

## Remaining phase gates

CORE-01/02/03 remain open: root build/verify/source/platform guards, clean checkout,
actual passing Windows Actions run and final human evidence review are 02-03.
No remote has been configured. Required CI cannot be replaced by these local
results. Win10, ARM, other platform implementation/hardware, HDR, multiwindow,
media/zero-copy, driver and production-license conclusions remain unverified.
Three unclassified assumptions and six descriptor-less prohibitions are retained.
No Phase 3 or broader product implementation was started.
