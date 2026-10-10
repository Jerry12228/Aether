# Phase 6 FEC Source Gate: Isolated Preparation Decision

Status: awaiting-real-user-decision. No FEC implementation is admitted or linked.

This is a new source gate required by 06-02-02/T-06-SC, not a repeat of the approved 06-01 ADR. The real reply `1` at 2026-10-10T03:46:30Z approved the exact TLS/SRTP proposal and OpenSSL/libSRTP reuse only. That approval remains unchanged. FEC semantics were approved; a concrete FEC implementation was not.

## Fixed Research Inputs

- nanors: `sleepybishop/nanors@b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a`, the fixed implementation referenced by the studied GameStream baseline.
- Official archive SHA256: `da130dba8643ad08a6af18866f94d3bf7574339496ba249d81ac2f34cc313a2d`.
- [Source ledger](FEC-SOURCE-AUDIT.json): all 36 archive files verified against official Git blob IDs, with SHA256, byte counts and pinned source URLs. Archive entries were checked against the official tree before extraction; links/special entries were refused. These are research files under owned `build/phase06/fec-audit`, not product or reference-checkout edits.
- The [pinned nanors license](https://raw.githubusercontent.com/sleepybishop/nanors/b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a/LICENSE) declares MIT, Joseph Calderon, 2021. This root declaration alone does not close the embedded-source audit.
- The [pinned OBL license](https://raw.githubusercontent.com/sleepybishop/oblas/73830b455855a4f8e2746c37403be1c721fe9fad/LICENSE) declares MIT, Joseph Calderon, 2018; SHA256 `9abac3a567b2ca6994037a9e549e847c1fbf85988b857cf0691b5447aa3a2ae9`. Only embedded `gf2_8_tables.h` matches a blob in this OBL tree. Nine other embedded files have no exact match in this comparison. This is not proof of an incompatible license, but neither is it proof of their precise ancestry or complete inherited notices. Historical/source-level provenance remains open.

Raw full-text research report: `artifacts/phase06/fec-source-audit.json`. Running `node tests/protocol-multistream.test.cjs --audit-fec` performs research only; ordinary test execution does not fetch or link this candidate. The tracked ledger records research observations, not approval.

## Why Default Integration Is Blocked

Static inspection of the pinned source identified these unresolved implementation risks. They are source findings, not observed exploit or runtime results:

| Finding | Exact source | Required disposition before admission |
|---|---|---|
| Mutable global multiply table and unsynchronized initialization flag | `deps/obl/oblas_lite.c:11-28`; every `oblas_get_impl` initializes it | Remove the mutable initialization path in a scalar derivative or prove serialization; independently test concurrent construction |
| MSVC CPUID helper lacks OSXSAVE/XGETBV checks; dispatch checks fewer AVX512 features than selected functions require | `deps/obl/oblas_common.h:42-78`, `oblas_lite.c:156-173,439-485` | Exclude SIMD implementations and dispatch from the prepared candidate, not merely select a runtime flag |
| `OBLAS_TINY` does not itself disable initialization or architecture dispatch | `oblas_lite.c:31` and `oblas_get_impl` | Explicit source-level scalar-only configuration; do not claim this macro closes the issue |
| Codec has mutable matrix scratch and no operation lock at this pin | `rs.h`, `rs.c` | One owned codec per bounded block/operation or explicitly serialized access; no cross-stream shared scratch |
| Allocation arithmetic and aligned allocator behavior need a bounded caller contract | `deps/obl/oblas_common.c`, `rs.c` | Checked shard counts/bytes/products before allocation, exact ownership/free pairs, allocation-failure tests |
| Embedded notices/source lineage only partly matched | source ledger and the comparison above | Close file-level provenance/notice audit, preserve applicable MIT texts; unresolved material blocks production reuse |

There is no native FEC compile, independent parity/recovery KAT, sanitizer/concurrency result or five-target build evidence yet. No upstream version upgrade is proposed implicitly. This is not a hand-written replacement for a proven FEC engine.

## Concrete Choices

1. **prepare-fixed-scalar (recommended)**: authorize isolated preparation of a minimal GF(256) Cauchy Reed-Solomon derivative from the exact nanors pin above. Scope: `rs.c/.h`, required OBL common/lite/table files only; exclude GF(65536), FFT and SIMD. Keep the coding algorithm, record each deterministic source modification and resulting hash, remove unsafe initialization/dispatch, bound ownership/allocation, complete inherited-notice research and run independent native parity/recovery, malformed-input, concurrency and cleanup tests. This approval authorizes preparation/research, **not product linking or redistribution**. Present a new exact prepared-source/license/configuration/evidence dossier for concrete reuse approval only after its admission gates pass. If provenance cannot be closed, stop and report it; do not infer rights from the author's name.
2. **research-alternative**: do not derive this pin; research another established FEC implementation and return with a fixed source/configuration/license proposal before any product use. No automatic protocol or transport reselection.
3. **hold-fec**: leave 06-02 halted at Task2, with the passing Task1 dual-video implementation intact.

No choice authorizes device/driver operations, trust or firewall/network configuration changes, restart/shutdown, Phase3 installation, or claims of device/codec/HDR/performance/five-target support. None completes NET-01/02/03. Task2's audio/uplink/FEC/key-generation work and Task3's vectors/ABI checks remain unexecuted. Later waves remain blocked by incomplete 06-02.

## Decision Binding

The next real response must bind the exact SHA256 of this document and the source ledger recorded in 06-02-SUMMARY. Do not manufacture a response, overwrite the 06-01 decision, or equate preparation approval with admission. Archive the reviewed bytes before subsequent edits. Current raw response, choice and recordedAt are null; no authorization record exists.
