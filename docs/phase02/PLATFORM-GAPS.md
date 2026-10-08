# Phase 2 platform evidence and duties

The five common ABI descriptors exist. Windows implements local core resources;
the other four descriptors return UNSUPPORTED, with no target-support claim.
The single app keeps all five scaffold runners. Machine-checked responsibilities
are in PLATFORM-GAPS.json; actual attempts are in PLATFORM-RESULTS.json.

| Client | Observed outcome | Prerequisite and owner | Follow-up |
|---|---|---|---|
| Windows | Actual x64 Debug/Release core/FFI/engine and static GPU paths pass | Executor/maintainer: independent Win10/11 and ARM systems; minimum host build pending | 3–5, 10, 15, 19 |
| Android | NDK 28.2.13676358 compiled six actual API21/22/23 ARM32/ARM64 ELF core libraries; no runtime/UI pass | Executor/maintainer: reconcile locked Flutter minSdk24 with original API21–23, audited Gradle restore and device/emulator | 28–29, proposed earlier feasibility preflight |
| Linux | Actual Ubuntu startup/which probes fail before compiler with HCS_E_SERVICE_NOT_AVAILABLE | Executor/maintainer: functioning Linux executor, GNU ARM32/RISC-V sysroots, GTK/desktop and Flutter artifacts, boards/GPU | 34–35, proposed architecture preflight |
| macOS | No macOS/Xcode executor; no implementation/build pass | Executor/maintainer: Apple SDK/Xcode; x64 and arm64 builds and automation remain required | 30–31; only hardware VFY-02 is TODO |
| iOS/iPadOS | No macOS/Xcode/iOS SDK executor; no implementation/build pass | Executor/maintainer: iOS arm64 build, simulator automation and installation/signing path | 32–33; only hardware VFY-01 is TODO |

Native Android feasibility used the installed NDK compiler, core/platform
sources and generated version header, without installing or executing Gradle
packages. ELF header/digest records distinguish compile-only evidence from
Android runtime or Flutter UI. The fixed SDK's FlutterExtension.kt states API24;
lower APIs have not been erased or promoted to TODO. Compatibility adaptation
exceeds this local Windows resource chain. A small Android API21–23 Flutter
engine feasibility phase before the Android product phases is proposed for
human consideration; no roadmap insertion or SDK replacement was made.

The Linux distribution is registered, but its VM service cannot start. The
sandbox-only Access Denied result was not counted: an approved normal probe
obtained the actual HCS error. Android/Bionic libraries are not GNU Linux
ARM/RISC-V build evidence. A functioning Linux executor and matching sysroots
are required to resume. Nothing was installed or enabled on the workstation.

Concrete target commands and architecture/SDK prerequisites are listed per row
in PLATFORM-GAPS.json. They are future execution paths, not already-run target
builds. Apple implementation, build and automation duties remain v1; only the
explicit physical validation TODOs are deferred. All applicable original feature
matrix capabilities remain in scope. Windows static tests do not close host-floor,
codec, driver, HDR, input, upstream-device or remote-session gaps.

Required Windows CI remains separate: the current repository has no remote.
The audited windows-2025-vs2026 image lists SDK 26100, while the build contract
requires 28000. bootstrap-ci.ps1 requests that exact component only on an ephemeral
hosted runner using the signature-verified Microsoft installer, then checks the
actual SDK. That installation has not been exercised. A trusted manually selected
self-hosted Windows x64 GUI executor with existing VS2026/SDK28000 is the alternative;
it also must execute the real workflow, and is not automatically installed/registered.
A real workflow run with dual builds and every mandatory check is required
before CORE-03/D-17 or the phase can complete; local evidence or human approval
cannot replace it.
