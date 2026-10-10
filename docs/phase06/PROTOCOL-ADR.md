# ADR-06-01: GameStream-Based Aether Protocol Prototype

Status: candidate, awaiting 06-01-03 real human decision. Date: 2026-10-10.

## Decision Scope

Approve or revise a concrete local replacement within the GameStream-derived layered model: authenticated reliable control over TLS 1.3; independently protected RTP datagrams over SRTP AEAD_AES_256_GCM; versioned Aether negotiation and explicit capability proposals. This is not a switch to WebRTC/QUIC and does not promise compatibility with historical Moonlight/Sunshine endpoints.

Approval covers this contract direction, the tested narrow wire, the mandatory protection disposition, and the two-library native reuse list below. It does not approve a driver installation, system trust changes, a public listener, production pairing, an unreviewed FEC library, or platform support based on an API. Phase 3 remains halted at its separate corrected-install approval gate. Reboot/shutdown, including scheduling either, remains forbidden.

Phase 06-01 has one downlink synthetic packet and one authenticated request/ACK, on loopback in separate native processes. NET-01/02/03 and Phase 6 remain incomplete until all five plans, five-target evidence and final human review pass. Proposal confirmation currently records approval without committing a production budget or altering a running stream.

## Fixed Baseline And Mapping

The complete machine-readable inventory is [dependencies.lock.json](../../protocol/dependencies.lock.json): every `baselineRows` entry records repo/SHA/file/actual line/source-file digest/symbol/disposition/Aether field/parity cases/vector or retained owner. `parity` preserves all 637 original feature records and case IDs, original conditions and owning phase, with a named `capability.<original-id>` extension key. Inventory coverage is not implementation evidence.

| Reference | Fixed SHA | Use |
|---|---|---|
| moonlight-common-c | f900dd4767759c7b9d0e93bcea666b55c69ea62f | RTSP/SDP, RTP/video/FEC/audio/control/input semantics |
| Sunshine | 7c23c32925d26c3ee7c33b25b2b0db75e35d561b | Server negotiation, protection/FEC ordering, settings, management |
| moonlight-qt | de2467e433821664cdd2224aad8c89a625be1ad9 | Native consumer, packet-size/surround/lifecycle mapping |
| moonlight-android | b48494cb96bff23d8886c4775cc4f39a1075495d | HDR/packet-size/audio capability negotiation |
| moonlight-ios | 02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a | Native start, dimensions/FPS/bitrate/protection/audio |

No code from these GPL-family reference trees is copied, linked or redistributed. Their implementation is not an official complete NVIDIA specification. Research checkouts remain ignored and read-only.

| Baseline layer/fields | Disposition and Aether interpretation | Owner/evidence |
|---|---|---|
| DESCRIBE, SETUP, ANNOUNCE, PLAY; Session; X-SS-Ping-Payload/Connect-Data | Reconstruct as DescribeCapabilities, PrepareStream, ProposalRequest, ConfirmStart; connection identity and authenticated liveness; do not retain raw RTSP text as the new wire | common-c RtspConnection.c and Sunshine rtsp.cpp rows; 06-01/03 |
| Every fixed SDP x-nv/x-ss/x-ml attribute | Retain semantic capability/format/limit, reconstruct named versioned fields; historical encryption flags become mandatory policy; unsupported/unverified stay visible | All matched attribute rows; 06-01/03 and media 09-15 |
| RTP header, payload type, sequence, timestamp, SSRC | Retain RTP network order, authenticate header before consuming; SSRC is per-stream, not a global connection singleton | vectors.media and real native sink; 06-02 expands streams |
| ENC_VIDEO_HEADER iv/frameNumber/tag; NV_VIDEO_PACKET streamPacketIndex/frameIndex/flags/extraFlags/multiFecFlags/multiFecBlocks/fecInfo | Replace private encryption layout with standard SRTP; retain frame/fragment/FEC semantics in authenticated versioned metadata, not raw inherited nonce state | Video.h field rows; 06-02/09-15 |
| SS_PING, SS_FRAME_FEC_STATUS, SS_LTR_FRAME_ACK, SS_RFI_REQUEST | Retain feedback/liveness/frame-loss/refresh semantics, add stream/config generation and bounded priority | Video.h field rows; 06-02/03 and 09-15 |
| Audio CBC and avRiKeyId + sequence | Replace shared historical CBC/IV derivation with independent direction/media/stream SRTP state and clock/channel capability | AudioStream.c rows; 06-02/11/21 |
| Keyboard, mouse, touch, pen, UTF8, gamepad, sensors, battery, rumble/feedback | Preserve every mapped source field and original platform condition; add lease fencing and independent logical channel/priority, never authorize input with read permission | Input.h/ControlStream.c/Limelight-internal.h rows; 19/23-27 |
| Discovery/pairing/app launch and rikey/uniqueid/appid/mode | Retain management semantics, reconstruct authenticated client identity, instance association and complete specification; no unauthenticated start API | nvhttp.cpp rows; 07/08/18/20 |
| Client stream configuration and callbacks | Retain independent native context and typed low-frequency consumer; no repeated invocation of the global common-c singleton | Qt/Android/iOS rows; 06-04 and original platform owners |
| New instance/display/connection IDs, uplink, multistream, clipboard, epoch/budget/proposal | Extend explicitly; not interpreted as supported merely because fields exist | 06-02/03 and 17-22/34 |

No applicable original capability is silently removed or moved to TODO. R1 specifically makes Win10 host HDR not required; Win10 seven-display proposal is SDR, Win11 D2 HDR remains required. A fixture `hdr=unsupported` is not Win11 HDR validation. The original feature inventory and conditions remain authoritative, including lower Android API and Linux architecture differences.

## Concrete Alternatives

| Local transport option | Security and GameStream impact | Actual evidence and disposition |
|---|---|---|
| TLS 1.3 reliable control + SRTP AEAD RTP | Standard authenticated reliable request/ACK; preserves UDP/RTP media separation and FEC/clock semantics; independent exporter-derived domains. TCP head-of-line blocking must be bounded and measured; does not give independent control priorities automatically | Preferred candidate: real separate-process TLS/TCP plus SRTP/UDP sink, failure and KAT evidence. Only this path is exercised |
| TLS 1.3 control + DTLS 1.2 datagrams | Standard protected unreliable channel; custom media framing and retransmission/MTU handling still required; DTLS version/ciphers/replay/key lifetime need a separate concrete audit | Not implemented or approved. Can replace the datagram subchannel only after equivalent real evidence and revised ADR |
| Fixed ENet fork under an audited standard protection wrapper | Retains reliable logical input/feedback channels; ENet alone supplies neither authentication nor confidentiality. A DTLS/custom transport wrapper must preserve ownership, timers and replay semantics; cannot encrypt ad hoc | Research only, not linked. No drop-in system ENet or invented secure wrapper approval |

Reliable control is for negotiation/confirmation/configuration, not media bytes. Subsequent control scheduling must separate urgent release/revoke/liveness from large clipboard/management work, bound message/queue bytes and age, and demonstrate progress during video faults. A single TCP stream still has transport HOL; 06-03 measurements can force a revised subchannel ADR before production adoption. No latency or throughput SLO has been measured here.

## Native Reuse And Provenance

| Linked candidate | Exact source and archive | License/configuration |
|---|---|---|
| OpenSSL 3.5.9 | tag openssl-3.5.9; commit 45e844fa2a14ec92d146bd8f5778ac130b6625fb; official release archive SHA256 603f5602e2eef00d77fbd429d34dcd5822bb301757a1bc9cdb24c670f1eb859a | Apache-2.0, LICENSE.txt SHA256 7d5450cb2d142651b8afa315b5f238efc805dad827d91ba367d8516bc9d49e7a. Static SSL/Crypto, no shared/module/asm/zlib/comp/legacy/QUIC, no FIPS claim |
| libSRTP 2.8.0 | tag v2.8.0; commit 24b3bf8f19b6f5ab4cd2bcceb4f4064efca86fd5; pinned official tarball SHA256 031bf6c0b38c02c3425bf8b4a24386f953ec4ab3df203adb6c22234d2a63f1ba | BSD-3-Clause, LICENSE SHA256 8e19d42a1eec9561f3f347253ddf2e385c55f392f025bb0fd41b88dbf38db5ae. Static library, OpenSSL backend, upstream independent test apps enabled |

Official tag/release/archive observations, license texts (including nested notices), every retained C/H/build-input digest and inline copyright/license notices, build options and exact linked artifacts are in the lock. OpenSSL bundled Text::Template 1.56 is build-only, dual GPL-1.0-or-later OR Artistic-1.0-Perl, not linked; its nested LICENSE is retained. Existing Perl/MSVC tools are not bundled. SRTP inline Cisco/David McGrew copyright and redistribution clauses are retained, rather than relying only on a repository license label. No new npm/pip/cargo dependencies were installed.

The file-level ledger also retains OpenSSL's dual Apache/BSD alternatives in LPdir (Richard Levitte) and v3_pci/v3_pcia (Royal Institute of Technology), plus KISA SEED copyright/conditions, instead of calling every file solely Apache from the root label. The no-asm Windows build does not execute/link the assembly generators with other license alternatives. Their script bytes/notices are nevertheless retained for later target review; enabling any platform-specific generator requires reviewing that exact file, not inheriting this Windows build result. Build scripts/Configure/configuration inputs are hashed too. The current OpenSSL source uses Apache licensing on the actual source families above; retained alternative/additional notices are not deleted.

Permissive native candidates fit the already-chosen compatible-open-source direction; the overall product license and release channel are not newly selected here. Approval is for scoped source-built reuse with retained notices. Packaging must include Apache-2.0 and BSD conditions, copyrights/disclaimers and modification attribution; binary notice packaging is not a release already performed. No upstream checkout is used as a submodule or product target. Windows ws2_32/crypt32 and the static MSVC runtime are existing platform/toolchain inputs, not reconstructed crypto.

Builds are confined to `build/phase06/dependencies` and `build/phase06/windows-x64`. Exact headers and libssl/libcrypto paths are set, not taken from PATH. Debug Aether/libSRTP targets use /MT to match the separately built static OpenSSL libraries; this does not claim a fresh Debug OpenSSL build. Upstream OpenSSL conversion warnings are retained in its log, not hidden as an Aether /WX pass.

Historical fork audit: ENet `cgutman/enet@aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1` has sockaddr_storage and a changed host-create signature; fixed ControlStream.c accesses `peer->sentReliableCommands` (lines 679/680). Its MIT license/header bytes are captured. System ENet is not an ABI-equivalent replacement. nanors/OBL `sleepybishop/nanors@b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a` has an MIT root license and embedded OBL files, a global GF2_8_MUL[65536] initialization path, and `-march=native` build assumptions. Root license alone does not close OBL provenance or concurrent initialization/portable SIMD. These candidates are not linked; FEC source reuse is NOT part of this approval. 06-02 must close file-level provenance/concurrency/target evidence or select a separately audited implementation before linking it.

## Tested Wire And Versions

Product version 0.1.0, local core ABI 1, protocol prototype ABI 1 and advertised network version set {1,2} are separate identifiers. Both tested wire versions currently use the same minimal tracer layout; this is not a historical GameStream version claim. Select the highest explicit intersection independent of order. Empty intersection returns AP_VERSION with upgrade-side 1 remote older, 2 local older or 3 both need a common set. No partially selected result survives failure.

HELLO: TLS outer u32 big-endian size; inner `AETH` (4 bytes), u16 total size, u8 message type 1, u8 version count, followed by count u16 versions. Inner bounds 10..512, versions 1..8, nonzero and unique. Optional TLVs use u16 type/u16 length/value, at most 32; zero/duplicates reject, high-bit required unknown types reject, unknown optional types skip with full length validation. No truncation, trailing bytes or length overflow acceptance. Golden bytes in vectors.json are independent fixed inputs, not encode/decode self-oracles.

Authenticated UDP port uses u16 network order, nonzero. Control response is u32 status + u32 selected version/upgrade hint. Client validates selected version against its original set. One-byte TLS completion ACK follows authenticated native media sink completion. Parse failures close without grant; trust/identity/permission/version/length/field errors remain distinguishable. All native statuses are listed in protocol.h, including protection, timeout, stale/cancelled/expired/already-complete. Tracer fields are not an invitation to expose private test credentials or failures through a product API.

## Protection And Key Domains

TLS min=max 1.3; mutually verified certificates and explicit peer names, no permissive verifier, no embedded private key/authority, no 0-RTT side effects or session-cache resume. Test self-signed credentials are generated in owned temporary fixture directories and removed; nothing is imported into system trust. Caller-provided `permission_read` is a prototype authorization input, NOT a production permission authority. Real pairing/credential storage and host authorization belong to 07/20.

SRTP profile is AEAD_AES_256_GCM with 16-byte authentication tag; no null protection selector is exported even though upstream contains other cipher implementations. Per-handle exporter label is `EXPORTER-Aether-SRTP-v1`. Context bytes are `AETH 00 01`, followed by big-endian u64 host, instance, display, stream, connection, client, lease epoch, config generation, key generation, selected version, then direction byte 1/downlink and media byte 1/video. The 44 exporter bytes supply 32 key + 12 salt, temporary material is cleansed. Per-stream SSRC must fit u32. Library replay window is 128 and repeated transmission of the same SRTP index is disabled.

The six stable IDs and three generations are caller-configured out-of-band in this first tracer, not yet a complete identity metadata wire. RTP carries authenticated SSRC/sequence/timestamp; complete authenticated frame/shard/group/generation headers are 06-02 work. Direction/media are fixed in this single-path prototype; independent audio/uplink/source/repair domains must be tested before they are enabled. A TLS exporter separates connections cryptographically, but does not alone prove all future media/header domain separations.

Candidate 06-02 contract: per direction/media/stream/connection/key generation SRTP session; unique monotonically increasing packet index with standard ROC; never reuse an index/key for a changed header/payload; control-confirmed fresh key generation before packet-index exhaustion; fail closed at exhaustion or failed rekey. No live rekey, rollover, late-generation, cross-domain injection or media tamper experiment is claimed in 06-01. Two-stream/replay/nonce/ROC and independent KAT/failure evidence are mandatory in 06-02.

Candidate FEC ordering: form bounded plaintext source symbols and repair symbols, then independently protect each transmitted source/repair packet with its own unique SRTP packet index and authenticated type/group/shard metadata. On receive, authenticate/decrypt each packet before queue insertion or FEC repair; reject AEAD failures before plaintext use, replay/high-water/queue progress, and separate streams/generations/groups. Bind recovered source to authenticated group metadata; never feed reconstructed unauthenticated ciphertext to a decoder. Scheme, source/repair counts and memory deadlines are negotiated per stream, with bounded drop beyond capacity. Actual loss/reorder/duplicate/threshold evidence, FEC implementation and limits are 06-02/03 work, not tested here.

## Complete Proposal Contract

After successful authenticated exchange, `propose` copies a complete list (1..32 named capabilities, lower-case ASCII/digit/underscore, name at most 31 bytes). Availability is unsupported=0, supported=1, unverified=2. Disabled/different values retain a reason: OS=1, resource=2, unverified=3. Values are bounded to u32. All entries and final values are retained and sorted; disabled/unverified finalize to 0, supported values to min(requested,available). No silent fallback or omission.

SHA256 proposal canonical prefix is `APROP 00 01`; all identity/config/key/request/budget/lease/expiry/count fields are u64 big-endian, then sorted name-length/name/availability/reason/requested/available entries. The exact order is independently reproduced in the Node oracle. `confirm` requires matching request ID, full 64-hex digest, budget revision, live expiry and lease epoch; stale, cancelled, expired and duplicate confirmations reject. Changed settings/budget/identity require a new complete higher request ID and recomputation, not patching a previously approved digest. Cancel is idempotent for the pending request. Retry does not implicitly commit or start a stream.

Native fixture: camera unverified -> 0 with reason; fps requested120/available60 -> 60 with resource reason; hdr unsupported -> SDR with OS reason. Nine actual native checks cover pending/old-budget/cancel/cancelled reject/expiry/expired reject/new full plan/confirm/duplicate reject. Node independently recomputes digest. Existing synthetic sink and historical grant counters stay unchanged through proposal/confirm/cancel. `confirmedProposals` is an approval counter, not a resource grant. No actual encoder/GPU/display/camera reservation is present. Production budget CAS/arbitration, observer independent read budgets, host unique control lease and atomic all-or-nothing multi-stream confirmation are required in 06-03/20.

## Original Setting Disposition

All twelve original cases remain visible below. This is the proposed contract and source verification, not twelve newly implemented product settings tests. Independent proposal/wire boundary tests exist now; per-setting MTU/FEC/timeout/port bounds and invalid +/-1 native tests belong to 06-02/03. No test claims original products were modified.

| Original case | Proposed disposition and safe alternative | Source/validation owner |
|---|---|---|
| case-helios-windows10-fec-percentage | Retain setting name and requested value; source accepts 1..255, Aether requires per-stream scheme/count/bandwidth limits and an explicit feasible proposal instead of accepting arbitrary percentages | Sunshine config.cpp:1805; FEC +/-1/repair budget 06-02/03 |
| case-helios-windows11-fec-percentage | Same retained setting and full proposal, not a Win11-specific encryption exception | Same source/owner |
| case-helios-windows10-lan-encryption-mode | Mode0 Disabled: conflicts with D-13; mode1 plaintext fallback Disabled: conflicts with D-13; mode2 retained mandatory TLS/SRTP. Preserve name/value/reason, offer mode2 instead of a hidden fallback | config.cpp:1788/config.h:239,243,247; current real protection; setting rejection 06-03 |
| case-helios-windows11-lan-encryption-mode | Same mode0/1 disabled reasons and mode2 safe alternative, even on LAN | Same source/owner |
| case-helios-windows10-wan-encryption-mode | Mode0 Disabled: conflicts with D-13; mode1 plaintext fallback Disabled: conflicts with D-13; mode2 retained mandatory TLS/SRTP, no trust/identity bypass | config.cpp:1789/config.h:239,243,247; current trust failures; setting rejection 06-03 |
| case-helios-windows11-wan-encryption-mode | Same preserved modes/reasons/mandatory alternative; location never authorizes plaintext | Same source/owner |
| case-helios-windows10-packetsize | Retain 0 automatic or explicit bound; effective payload must fit negotiated path MTU after RTP/auth/FEC metadata overhead, fragmentation is explicit application-level bounded frames, not uncontrolled IP fragmentation | config.cpp:1790/rtsp.cpp:1156-1181; actual production MTU and +/-1 06-02/03 |
| case-helios-windows11-packetsize | Same capability and complete recalculation; reject/offer feasible limit, not a silently changed packet | Same source/owner |
| case-helios-windows10-ping-timeout | Retain name and source -1 infinite intent; infinite admission/cleanup is disabled for bounded-operation safety, with explicit finite alternative. Persistent Instance lifetime is separate and may remain indefinite | config.cpp:1783; prototype 1000..3000ms, monotonic absolute deadline; measured production liveness limits 06-03 |
| case-helios-windows11-ping-timeout | Same complete proposal and reason; stopping a connection cannot stop a persistent display/application | Same source/owner |
| case-helios-windows10-port | Retain configurable base-port intent and explicit per-channel offsets; validate base plus all offsets within 1..65535 and configured policy. Prototype ephemeral loopback ports are not a production port default | config.cpp:1869; production base/offset +/-1 and collisions 06-03/07 |
| case-helios-windows11-port | Same retained setting; no system firewall/network reconfiguration authorization from this ADR | Same source/owner |

Disabled original encryption behaviors are a concrete safety-driven modification requiring this human decision. They are not removed from the inventory or silently described as supported. Original settings outside these twelve cases retain their feature IDs, conditions, extension names and original owning phases in the lock; content/UI for these settings has not been implemented yet.

## Limits And Ownership

| Bound | Tested prototype value | Not a production/performance claim |
|---|---|---|
| Contexts / network versions / TLVs | 64 registry handles / 8 / 32 | Capacity/resource arbitration needs 06-03 evidence |
| Control frame / synthetic payload / receive buffer | 512 / 1024 / 1500 bytes | No negotiated path MTU/real encoded frame/FEC memory limit yet |
| Operation timeout | 1000..3000ms, fixtures 2000ms, monotonic absolute TLS/accept/receive deadline | Trickle test cannot extend it; loopback client connect remains blocking; remote connect redesign is required before non-loopback support |
| Proposal size / expiry | 32 caps; names31; u32 values; 1..60000ms | Production request retries/backoff/queue budget pending |
| SRTP replay | window128, repeat_tx=0 | Actual rollover/replay/cross-stream tests pending 06-02 |
| Node child / output / CTest | owned-child5s / stdout64KiB / suite30s | Fast test feedback, not streaming latency |
| Stop | absolute2s waits in-flight operation and callback, then zero sockets; timeout retains safe references | No forced foreign process termination |

Each context owns sockets/TLS/SRTP/config/proposal state. Only libSRTP library initialization and the bounded token registry are global, not media key/queue state. Native callbacks are scalar; query writes caller-owned JSON; event ACK precedes final destroy. Stop success means no future in-flight submit callback and no sockets; the tracer creates its own submit thread for a concurrent callback-barrier test. No library background threads are claimed. Resource/grant counts in query are historical counters, not active persistent instances. The isolated protocol library has no instance/display/app/driver deletion API and no SetupAPI/Flutter/Qt linkage. A connection stop never invokes a persistent object stop.

## Evidence And Remaining Gates

Actual Windows x64 Debug standalone CMake build: Aether C++20 /W4 /WX, explicit static dependencies. Real test processes have different OS PIDs, distinct ephemeral TCP/UDP ports, valid mTLS request/ACK, one SRTP authenticated packet and a native SHA256 sink checked by independent Node. Wrong trust/identity/permission/version, malformed/oversize/required/duplicate fields produce explicit failures; stop reports zero sockets/threads. Independent fixed golden bytes include ordering/intersection, optional/required TLVs, truncation/tail/overflow, and 511/512/513-byte boundaries. Linked OpenSSL passes independent AES-256-GCM zero-block KAT; upstream libSRTP cipher/SRTP/replay/ROC/datatype/kernel tests also run.

Inline review found callback disposal and slow authenticated-byte-trickle risks; the operation mutex now covers the callback and TLS read/write uses an absolute monotonic deadline. Real concurrent callback and slow TLS peer regressions exercise these fixes. These fixes are not falsely labeled separate RED-first work. Main planned TDD RED commits c1bd244 and 9aee05d preserve the actual missing-target and missing-proposal/vector failures; sandbox EPERM is an environment failure, not behavioral RED evidence.

The bound manifest below includes source/test/lock/vector/binary and raw process/log digests; final counts/durations are in the halted SUMMARY. `--verify-dossier` rejects changed material/evidence bytes; a known-bad digest regression must fail validation. Whole ADR digest is stored externally to avoid a self-hash loop. Private keys, credentials and media content are not logged; synthetic payload identity is deliberate test data.

Safety register for this linked narrow path: T-06-01 trust/identity -> actual TLS failures; T-06-02 parser -> independent bounded vectors; T-06-03 test authority/lifecycle -> external ephemeral fixture, exported symbols, callback/ACK/stop; T-06-04 admission deadline -> bounds and slow-peer regression; T-06-SC -> fixed official source/archive/notices/artifact digests. These mitigations support this loopback prototype decision, not full ASVS certification or a full phase security verdict. Unimplemented remote admission, FEC, rekey, production permissions, priority, resource/epoch/retry/trace/FFI and target behavior cannot be marked secured merely by design text.

Required next gates: 06-02 two-video + audio/uplink + FEC/protection/replay/KAT; 06-03 production-like complete proposal/recovery/budget/epoch/diagnostics/limits; 06-04 real Dart FFI; 06-05 actual build AND native runnable evidence for Windows/Linux/macOS/Android/iOS. Apple requires iphoneos library build and independent simulator XCTest; only physical functionality/performance/installation may stay VFY-01/02 TODO. Current CMake dependency paths are Windows-specific; portable source-build adapters and executors do not exist yet. No OS/build/architecture minimum is raised from upstream assumptions.

Decision options: `approve-concrete` (scoped candidate above); `revise-concrete` (name changes, then regenerate/retest/rebind); `hold` (retain candidate, no 06-02). No real response has been received. A future approval records original response, choice, UTC time and reviewed ADR/material/binary digests, and must not reinterpret that approval as system-operation permission.

<!-- AETHER-BOUND-EVIDENCE -->
## Bound Evidence And Decision

The following exact bytes are the checkpoint materials. The whole ADR digest is recorded externally in the halted SUMMARY; it cannot hash itself. No approval is inferred from test success.

```json
{
  "schema": 1,
  "status": "awaiting-real-user-decision",
  "sealedAt": "2026-10-10T03:25:11.269Z",
  "binarySha256": "73318800dd1e632e36992d1f6bad912f0fc4c42ab3f2adeceaad21b11cb177bf",
  "librarySha256": "10df1288d07e31b40bbce83bfb67ae3bb1d20e492df91267343b820e4791f8e2",
  "materials": [
    {
      "path": "native/protocol/CMakeLists.txt",
      "sha256": "7fa4582ead6c28c6bb491454faa016581f9cb2f0623fb4329c2d545e796b913d"
    },
    {
      "path": "native/protocol/include/aether/protocol.h",
      "sha256": "0c49ea194573c0a628415f8599792502d4b50fbbac7e147dd5a579a01b7c091b"
    },
    {
      "path": "native/protocol/src/protocol.cpp",
      "sha256": "82bde9923dbca03fc5358a6484191cbe69c9af8b42c74920dd0d87210b074a9b"
    },
    {
      "path": "native/protocol/tools/tracer.cpp",
      "sha256": "5723e5d3b1f24c899cf70a0c08fbbf57d021c698eaf59a8ec88178b4d80d556a"
    },
    {
      "path": "tests/protocol-tracer.test.cjs",
      "sha256": "f142cbdabf57fd29bf72366e75fb0382874c7e59408617c2b6b9ba5ce65d959f"
    },
    {
      "path": "protocol/dependencies.lock.json",
      "sha256": "770ecca238ba813cad0e13ae735ed0bc79d1e072c00bba78656563ef6df3fec4"
    },
    {
      "path": "protocol/vectors.json",
      "sha256": "7eeb3cc28bc4b82dbdfaf19a00a780edcef78d69cb4361119a57ef774bf1e238"
    },
    {
      "path": "docs/PROTOCOL.md",
      "sha256": "b706440f9be4db4643ccfbdffa5a154db745c21eb11002f6cc4f9e10cd2d8f8e"
    }
  ],
  "evidenceManifest": [
    {
      "path": "artifacts/phase06/tracer/changed-host-identity-is-rejected.json",
      "sha256": "b7696acdd5a53b196bc1aa7202972f08d4bc84e7ef7355a97ce4afe79226d8bb",
      "elapsedMs": 100,
      "hostPid": 15612,
      "clientPid": 38828,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/complete-capability-plan-requires-explicit-confirmation-and-preserves-the-active-stream.json",
      "sha256": "184b11f5b19a1a3647a363e98d7f32083f5e6468d5afd605f6c760fad152d4d3",
      "elapsedMs": 103,
      "hostPid": 44112,
      "clientPid": 39436,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/concurrent-stop-waits-for-an-in-flight-native-callback-before-consumer-disposal.json",
      "sha256": "4adb4a69666a0ec8798292b7f8100cfca42c359b0944eb5b9b98cf150867f99e",
      "elapsedMs": 211,
      "hostPid": 34740,
      "clientPid": 54880,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/different-native-processes-exchange-authenticated-control-and-protected-UDP-media.json",
      "sha256": "75fae7dcc27defc2e5ed20c130403605752a4c89f8c1daa98ca9af52b98d2266",
      "elapsedMs": 92,
      "hostPid": 52932,
      "clientPid": 9936,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/duplicate-versions-are-rejected.json",
      "sha256": "090dfe661317fbe1a6f32466b7adf3d426f6175f0738cd03fabb234f86008ca8",
      "elapsedMs": 92,
      "hostPid": 66980,
      "clientPid": 63096,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/no-common-version-explains-the-older-peer.json",
      "sha256": "5f76262370e108bb79aa6ebe8bec340a1012041b3a2c19b742473080610f1520",
      "elapsedMs": 95,
      "hostPid": 56976,
      "clientPid": 52576,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/oversized-control-frame-is-rejected-before-allocation-grant.json",
      "sha256": "281bdd4e3e5bed1a6deb20ea74bdbfef160237de7f0653da102b820cf5ccf1f2",
      "elapsedMs": 98,
      "hostPid": 42612,
      "clientPid": 63556,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/read-permission-denial-cannot-grant-a-stream.json",
      "sha256": "2789521cb06d373b55c68c2e9874d336005e8e4fbdd5d834ea88f908bdd43e45",
      "elapsedMs": 92,
      "hostPid": 60956,
      "clientPid": 14864,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/truncated-hello-is-rejected-before-grant.json",
      "sha256": "9a24d0fd9f71b1f5fe69534eaa8826c736c5ca5c5db95de83ca700d57db792f4",
      "elapsedMs": 93,
      "hostPid": 35508,
      "clientPid": 42876,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/unknown-required-message-type-is-rejected.json",
      "sha256": "4206bbd557e5d221501fda44c7cab6acbad678d867871738e3b0e39fd9d7fb98",
      "elapsedMs": 92,
      "hostPid": 60096,
      "clientPid": 60764,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/untrusted-client-receives-no-stream-or-sink.json",
      "sha256": "9f627fec2c78f1a0141ed8e92c6aafa917b2c06a9857cb97e8a76340a0687e17",
      "elapsedMs": 96,
      "hostPid": 56416,
      "clientPid": 55512,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer/version-set-ordering-leaves-selection-unchanged.json",
      "sha256": "f95c14193b632075b02de1e8e58a4ccdcbddda4e882f2a638ea24038546b852b",
      "elapsedMs": 97,
      "hostPid": 65264,
      "clientPid": 50968,
      "synthetic": true,
      "systemMutation": false
    },
    {
      "path": "artifacts/phase06/tracer-final.tap",
      "sha256": "11465a6b33f512e581c40e3cbfa94adbe34aa706b31dc317ba6fe9f4c6717abe"
    },
    {
      "path": "artifacts/phase06/ctest-final.log",
      "sha256": "f4f10f87bc9f603ebdef6475a16cd2bf9f26789306d57648bd79cbcca40589be"
    }
  ],
  "decision": {
    "choice": null,
    "rawResponse": null,
    "recordedAt": null,
    "reviewedAdrSha256": null
  }
}
```
