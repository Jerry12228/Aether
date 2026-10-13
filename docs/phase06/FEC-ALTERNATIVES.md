# Phase 6 FEC Alternatives And Concrete Reuse Proposal

Status: awaiting-real-concrete-reuse-decision. FEC remains unlinked in Aether.

The real response `2,若无则1` at2026-10-10T04:55:09Z is recorded in [FEC-DECISION.json](FEC-DECISION.json). It authorizes alternative-first research and conditional fixed-nanors scalar preparation, not product reuse. The reviewed preparation document/ledger remain byte-identical and archived. This research found a qualifying **prototype reuse proposal**, so the conditional nanors fallback has not been triggered. This does not mean a production-ready five-platform FEC system has been delivered.

## Recommendation

Use the unmodified **Botan3.13.0 scalar ZFEC subset**, fixed source `randombit/botan@2a81eef56c96c237e590c27f9a75e60317c9c700`, for the Phase6 synthetic protocol prototype after a real concrete reuse approval.

Official archive SHA256: `714d6c52c6d752808e8784df21c146e176e91c57c99ee72c08eff4439fcff872`. Size14,867,751bytes;4,041 regular files verified against official Git blob IDs. The one upstream `.github/codecov.yml` symlink was explicitly excluded, not followed. [Exact audit/configuration/notices/evidence](FEC-ALTERNATIVES.json) records all selected input hashes, original-source matches, generated headers, local binaries and evidence digests. The full research inventory is retained under owned `build/phase06/fec-alternatives`; no reference checkout is modified.

This is the maintained successor identified by [FECpp's official notice](https://github.com/randombit/fecpp/blob/d7e9b41eaaab3c605be36f282465210d17bc432f/readme.txt), not an invented erasure engine. [Botan's ZFEC API](https://botan.randombit.net/handbook/api_ref/zfec.html) supports systematic equal-size packet shares and recovery from any K of N. Its source has an immutable encoding matrix after construction, operation-local scratch and a C++ thread-safe function-local static table initializer. The existing Aether native boundary is already C++20; no new language bridge is required.

## Compared Candidates

All pins, archive hashes, regular-file counts and relevant-source/license hashes are in the JSON ledger. Static findings are not runtime exploit claims. Only the preferred subset was compiled/tested; the others were not falsely marked incompatible or failed native tests.

| Candidate | Fixed pin | Assessment for this prototype |
|---|---|---|
| Botan3.13.0 ZFEC | `2a81eef56c96c237e590c27f9a75e60317c9c700` | Preferred: documented maintained module, explicit per-file BSD notices, supported minimal scalar configuration, real MSVC/KAT/ASan/concurrency evidence |
| FECpp | `d7e9b41eaaab3c605be36f282465210d17bc432f` | BSD-2 predecessor,20 files; official README says no longer maintained and directs users to Botan3. Avoid adopting the abandoned branch when the successor passes |
| catid/cm256 | `634d1e36b095dbba937586a7e9843d828762dae4` | BSD-3 direct Cauchy packet API,19 files; global `GF256Ctx`, unsynchronized `Initialized` flag set before table completion, platform-specific SIMD paths and startup serialization would need additional preparation. Viable secondary candidate, not proven unsupported |
| quiet/libcorrect | `ee82e6673a806dfdf0a969b975ab36596ecc5401` | BSD-3,76 files; API works on255-byte RS codewords and byte erasure positions, not directly equal-size packet shards. Would require a byte-wise/interleaving adaptation and new cost/format evidence; less direct fit, no performance rejection without measurement |
| tahoe-lafs/zfec | `1fede6c166592c98da7f102539f94daf99db4756` |43 files, mature systematic packet API; official GPL-2-or-later/TGPPL alternatives and mutable global C initialization add obligations. No claim GPL is incompatible with Aether's open-source intent. Prefer the separately BSD-licensed C++ implementation for a smaller obligation/initialization surface |

Source anchors: [cm256 initialization](https://github.com/catid/cm256/blob/634d1e36b095dbba937586a7e9843d828762dae4/src/gf256.cpp), [libcorrect API](https://github.com/quiet/libcorrect/blob/ee82e6673a806dfdf0a969b975ab36596ecc5401/include/correct.h), [zfec license/API description](https://github.com/tahoe-lafs/zfec/blob/1fede6c166592c98da7f102539f94daf99db4756/README.rst). zfec's verified `.gitattributes` applies export-subst to `_version.py`; archive-vs-Git byte differences were detected, retained and explicitly recorded before restoring the exact official Git blob for research. No mismatch was silently ignored.

## Exact Configuration And Notices

The official configure command uses:

```text
--cc=msvc --os=windows --cpu=x86_64 --minimized-build
--enable-modules=zfec --disable-modules=zfec_vperm,zfec_gfni,cpuid
--disable-asm --disable-shared-library --build-targets=static
--without-documentation --link-method=copy --msvc-runtime=MT --werror-mode
--with-build-dir=../botan-build
```

Loaded modules are `base hex rng utils zfec`;23cpp files compile. `rng` is the base abstraction, with no concrete RNG/entropy provider enabled. TLS, certificate parsing, AEAD/cipher/hash algorithms, sockets, compression, FFI and FEC SIMD modules are not enabled. No external native libraries are selected by this configuration (`libs_used=[]`). This is not a second TLS/crypto provider selection and does not replace OpenSSL/libSRTP. A static archive is built, not the full toolkit or CLI.

[Botan's pinned license](https://github.com/randombit/botan/blob/2a81eef56c96c237e590c27f9a75e60317c9c700/license.txt) is BSD-2. Every selected original source/header has a pinned-byte mapping and retained license/author blocks in the ledger. The three generated headers (`build.h`, `target_info.h`, `version_info.h`) are explicitly marked generated, not attributed to nonexistent Git blobs. Retain the full Botan root license, all selected file notices and the [BSD-2 FECpp predecessor notice](https://github.com/randombit/fecpp/blob/d7e9b41eaaab3c605be36f282465210d17bc432f/license.txt), including Rizzo, Lloyd, Brumley, Karn, Morelos-Zaragoza and Thirumoorthy where applicable. Preserve the INRIA/Projet SECRET and other utility-header author notices. No GPL zfec implementation code, CM256, libcorrect or FECpp code is proposed for product copying/linking. zfec-generated opaque test vectors are from the pinned Botan test data; they are test-only.

This inventory is a concrete scoped reuse/notice proposal, not legal certification or a choice of Aether's final distribution channel/project license. Existing MSVC/SDK and Python are build tools. Python installed no pip package; no interpreter is shipped. The installed Microsoft ASan DLL is hash-bound and exposed only through the owned test child's PATH. Neither ASan runtime nor deliberately faulty research code is proposed for Aether linkage or redistribution.

## Independent Evidence

- Official MSVC19.51 x64 static build: PASS,14,718ms; `/W4 /WX`, runtimeMT. Library SHA256 `03cff010ad57fed0e78f1f46eecb035196beadfde72eb277e0d53d0b5db83ac3`.
- Separate CMake research build compiles all23 selected sources and caller with AddressSanitizer, `/W4 /WX`, `/DEBUG`, `/INCREMENTAL:NO`. No vendor source patch is needed. Current research EXE SHA256 `b22ea47b03cdd9276f12ec304d0e633c9582714fc32403cee854cc0280ce9bcf`;85 source/header/project/test inputs are hash-bound.
- Candidate suite **12/12**, fail/cancel/skip/TODO0, **7,458.4689ms**. All81 independent zfec-generated parity KATs match; vector SHA256 `61ea41ea10d9a23b949f83e3e8063ad0b83ad8d45bd93ee7997f9bc2acd80e83`. An additional closed-form GF(256) oracle is independent of library encode output.
- All exact-threshold survivor subsets for k2n4/k4n6/k5n7 pass:6+15+21=42 combinations. Below threshold rejects without a published partial result. Zero/oversized/inexact sizes, invalid dimensions, duplicate/out-of-range IDs and truncated/unequal shares reject in the bounded research caller.
- Share bytes1024 pass/1025 reject; K=N=255 with one-byte shares passes. Constructor dimensions are checked **before** Botan's `m_enc_matrix(N*K)` allocation. Direct untrusted calls to the raw constructor are not allowed by the proposed adapter.
- Concurrent first table initialization, separate objects and shared-const operations:1,600 valid encode/recover checks;16 threads explicitly joined. This is a stress test, not a ThreadSanitizer or exhaustive race proof. Static C++ initialization/const ownership analysis is also recorded.
- The deliberately faulty research-only heap access is caught by the actual ASan runtime with the expected diagnostic and exit86. It proves instrumentation is active; it is not in the product library. No ASan finding occurs on valid cases. Windows ASan does not establish leak/TSan coverage.
- Corruption of an unauthenticated share changes recovered bytes: a **known limitation** test passes by detecting the mismatch, not by pretending FEC authenticates it. Protocol auth-before-repair, complete-domain validation and frame digest checks remain mandatory Task2 work.

Logs: `artifacts/phase06/botan-fec-build.log`, `botan-fec-asan-build.log`, `fec-candidate-tests.log`, `fec-candidate-kat.json`. Earlier failures are retained: missing installed ASan runtime in the child environment (1pass/10fail), Windows text-mode Ctrl-Z input truncation (7pass/4fail), then an incorrect additional oracle evaluation-point assumption (9pass/2fail). Fixed the **research caller/environment/oracle**, not Botan. The actual zfec evaluation points0,2,4 give parity coefficients3,2. All81 external KAT bytes were unchanged throughout. Initial configure without the MSVC environment also detected the parent Aether Git revision; the final build uses VsDevCmd and a process-local Git discovery ceiling. Source provenance comes from the audited pin, not a generated version string (`unknown` is honest for a source archive).

## Wire And Security Scope

Proposed explicit new profile: `rs-vandermonde-gf256-11d-v1`. Polynomial0x11d, systematic firstK shares, anyK ofN;1<=K<=N<=255, equally sized bounded shards. It is **not bitwise-compatible with the baseline nanors Cauchy profile**. The product has no legacy-peer compatibility requirement, but a new peer must explicitly negotiate this profile; no shared profile means explainable rejection, not silently interpreting old bytes. Existing non-FEC TLS/SRTP wire remains unchanged. Before media delivery, all source/repair metadata must authenticate profile/block/K/N/length/frame identity alongside connection/direction/stream/config/key generations.

Preserve GameStream packet/FEC/frame/feedback intent and original auto/explicit packet-size, FEC percentage and minimum repair settings. Recompute actualK/N and payload+metadata+SRTP overhead against negotiated MTU/resource limits, show effective values in the full proposal and reject/offer alternatives before allocation. The research caller's1024-byte shard limit is a **synthetic prototype bound**, not a new minimum OS build, permanent packet limit or removal of an original feature. Full queue/frame/packet/deadline/nonce and original-setting cases are still Tasks2/3 and06-03; candidate tests do not close them.

ZFEC is not encryption or constant-time secret processing. Its firstK shares are raw input; table arithmetic is data-dependent. Proposed reuse is for the current **synthetic Phase6 prototype** in the trusted native media boundary, with mandatory SRTP protection on every transmitted source/repair packet. Never FEC-encode credentials, keys or nonce seeds; never expose unauthenticated/plaintext shares or intermediate callbacks to the network/consumer. No local cache-side-channel resistance is claimed. Before real-media/device phases, reassess the trusted processing/side-channel boundary; a ciphertext-FEC change would require its own concrete wire/security revision, not an automatic switch here.

## Decision

1. **approve-botan-prototype-reuse (recommended)**: approve this exact pin/configuration/notice inventory for Phase6 synthetic native prototype reuse and the explicitly negotiated profile above; proceed with Task2 RED/GREEN integration. Keep crypto selection, auth-before-repair, bounded/staged ownership, original capabilities and all outstanding tests/gates. Only23 selected source files and their required headers are compiled; no full-toolkit/other crypto-provider adoption. Future platform/real-media obligations remain.
2. **prepare-fixed-nanors-instead**: explicitly prefer the previously reviewed fallback, authorize isolated fixed-pin scalar preparation/lineage research/testing, not product linkage. No silent version upgrade.
3. **hold-reuse**: keep this passing alternative proposal and Task1 intact; no FEC integration.

Raw reuse response/choice/recordedAt are null. Bind the next real response to SHA256 of this document and FEC-ALTERNATIVES.json, archive those reviewed bytes, and record a separate FEC-REUSE-DECISION. The research decision `2,若无则1` and prior TLS/SRTP approval must not be overwritten or expanded. No source/security admission or user approval is inferred merely from the test counts.

No choice authorizes driver/device/trust/firewall/network configuration mutation, restart/shutdown, Phase3 installation, or five-platform/real-device/HDR/performance claims. Phase6 remains1/5 complete; NET requirements and Task2/3/later waves remain incomplete until their actual work and gates pass.
