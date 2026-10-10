# Phase 6 Synthetic Multistream Contract

Scope: 06-02 native synthetic prototype, not real capture/codec/device/platform or latency certification. Actual reuse approval is [FEC-REUSE-DECISION.json](FEC-REUSE-DECISION.json), raw response1 at2026-10-10T05:34:57Z. The reviewed FEC-ALTERNATIVES documents remain unchanged historical bytes. The original TLS/SRTP approval and conditional research decision remain independent.

## Channels And Domains

Two actual processes use one mutually authenticated TLS1.3 control connection and one UDP socket each. Streams104/105 are downlink video,106 downlink audio,107 uplink microphone and108 uplink camera. IDs are synthetic fixtures derived from the caller's base stream ID, not persistent Windows display/instance objects. All media samples are caller-supplied synthetic bytes; no microphone/camera is opened. The client sample comes from its bounded authenticated HELLO TLV6, not a hardcoded product fixture.

Both peers agree all nine identity/generation values plus selected version over TLS before any full-media grant. Mismatched identity returns AP_IDENTITY, generation AP_STALE, version AP_VERSION. Fresh TLS plus fresh configured key generation establishes fresh crypto state; an old protected packet rejects. This is not live mid-connection rekey. Exhaustion fails closed before a new protect call; connection replacement/recovery remains06-03.

Each direction/media/stream/source-or-repair/key-generation has a separate libSRTP context, including its own replay window128 and packet index. AES-256-GCM uses a16-byte tag. Exporter label remains EXPORTER-Aether-SRTP-v1; full-media context is AETH 00 02 followed by big-endian u64 host/instance/display/stream/connection/client/lease/config/key/selected-version, then direction/media/role bytes. Temporary44-byte key/salt material is cleansed. Legacy narrow/dual-video context bytes are unchanged. Index is monotonically advanced, with standard SRTP ROC across16-bit sequence wrap. Changed payload is never protected at a reused index; duplicate transmission can only repeat already protected bytes, and receiver replay checks reject the duplicate.

No production permission provider, pairing or key storage is introduced. Caller permission_read remains an explicitly synthetic authorization input, not a host authority or an observer uplink grant. Real permissions and global lease arbitration remain07/20 and the next protocol slice.

## Wire

Full-media mode is HELLO TLV1 value5. TLV3 must explicitly select profile1, rs-vandermonde-gf256-11d-v1; missing or unsupported profiles refuse, never interpret Cauchy bytes as Vandermonde. TLV2 optionally names a nonzero UDP relay/destination port. TLV6 is1..64 bytes of caller synthetic upstream sample. TLV7 is exactly20 bytes:

| Offset | Width | Value |
|---|---|---|
|0|u16|requested packet-size cap,0 automatic|
|2|u16|path MTU|
|4|u16|FEC percentage,1..255 retained|
|6|u16|minimum repair shares|
|8|u16|share bytes|
|10|u16|source K|
|12|u32|per-stream owned share queue byte cap|
|16|u16|queue deadline milliseconds|
|18|u16|reserved, must be0|

All numeric wire fields are network order. Unknown optional TLVs outside explicit full-media mode retain the prior parser behavior. Profile/config values are copied from the authenticated bounded request. N=K+max(min-repair,ceil(K*fec-percent/100)); no silent settings deletion. Infeasible counts, MTU or memory reject before allocation; later full proposals must expose alternatives/effective values.

RTP has an authenticated160-byte header:12-byte RTP,4-byte extension prefix,144-byte extension. Extension profile0xa37e and36 words are fixed. Offsets16/17/18/19 are direction/media/role/FEC-profile;20 block-round;24/32/40/48/56 connection/lease/config/key/stream;64/72/80/88 host/instance/display/client;96/98/100/102 share/K/N/share-bytes;104 frame-bytes;108 frame ID;116 reserved;120 SHA256 frame digest;152 deadline;156 reserved. Standard RTP sequence/timestamp/SSRC and all extension bytes authenticate. Untrusted SSRC/role only select an existing candidate context; they cannot create a context or mutate a sink.

A frame is u32 data length followed by sample bytes and zero padding to K*share-bytes. Systematic firstK shares preserve source data; repair shares use the exact approved unmodified Botan scalar module. On receive, AEAD/replay succeeds into a private staged buffer before metadata validation, queue insertion or repair. All headers in a block must agree, with only sequence/role/share-ID canonicalized. Recovered frame length, zero padding and authenticated frame digest must all match before publication. This does not validate a lost packet's original authentication tag. Failed AEAD plaintext is never used or published. FEC itself is not authentication or constant-time secret processing.

## Bounds And Ownership

Default K2/N3,64-byte shares,128-byte frame,240 actual packet bytes, path MTU1500, FEC50%, minimum repair1,192 owned share bytes per stream,25ms deadline. Explicit packet-size is a cap; automatic derives actual176+share-bytes overhead, not IP fragmentation. Prototype source K1..16, N<=255 and three-downlink N*3<=64 datagrams per receive window; share1..1024, frame65..8192, per-stream queue frame..13107, MTU177..1500, deadline1..100ms. These are measured/bounded synthetic choices, not permanent product limits or a new OS floor. FEC255% is accepted where counts/resources fit; excessive repair count has an explainable AP_BUSY refusal.

Only one frame/block per stream is owned in a round, at most five independent blocks. Receive buffer1500 bytes, at most64 datagrams per window; metadata, duplicate and capacity checks precede owned share insertion. Each queue has its own cap, so one stream cannot consume a sibling's share budget. Shares retained for the bounded round are released with the scheduler; the aggregate counter returns0. Additional repair at a full queue has a separate queueRejected counter. Parse scratch,160-byte canonical metadata and reconstructed frame scratch are also fixed by the above buffer/frame/count bounds; queueBytes specifically counts retained share bytes, not total allocator memory.

Frames publish immediately after reaching K valid shares, not after another stream's loss timeout. Repair has pre/post steady-clock deadline checks, and the receive wait reserves a quarter of the configured interval for processing. Expired/incomplete/invalid frames drop without partial delivery. Counter denominators are explicit: sent/receivedPackets/rejected/protectionRejectedPackets/expired count packets (receivedPackets includes candidates before authentication); received/recovered/dropped count frames. queueRejected is a capacity-specific packet subset. RTP timestamps are synthetic per-stream counters with explicit32-bit wrap: video/camera3000 ticks/round, audio/mic960; they are not physical device clocks or product latency measurements. Control health and all healthy media are recorded inside the same loss rounds2..4, not after recovery.

Stop/destroy keep ACK and callback barriers; only owned sockets/crypto/queues are released. A separate native sibling keeps its two sockets until separately stopped. Instance102/display103 are identity fixtures, not proof of real device persistence. No device, trust, firewall/network configuration, restart or shutdown operation occurs.

## Public Contract And Evidence

Local ABI remains1. Media direction/kind/role/profile enums use fixed numeric values. AetherProtocolMediaOptions is28 bytes; caller-owned AetherProtocolEffectiveMedia is40 bytes on the tested x64 target. aether_protocol_validate_media_options checks ABI/struct prefixes before reading fields and uses the same bounded wire validator. Failed validation publishes no partial effective result into a valid output buffer. Versioned query JSON has queryVersion1, per-stream counters, actual mediaLimits and bounded same-window health records. Other target layouts remain build/test obligations, not assumed from this Windows result.

Independent multiMedia vectors are appended without overwriting original media vectors. They include a closed-form GF256 parity answer,22 setting-boundary cases, exact TLV lengths and profile refusal; public ABI/size/output cases consume the same values independently. Native tests exercise actual SRTP rollover/ROC/replay/high-sequence/role/fresh-key rejection and pre-call exhaustion refusal. Real TLS/UDP cases cover13 full-media scenarios plus6 retained dual-video scenarios. Research81-vector/42-subset/1,600-concurrency evidence remains separately bound to the approved candidate dossier.

Actual Debug and separate instrumented Release evidence is recorded in06-02-SUMMARY and MEDIA-EVIDENCE.json. The ASan build instruments Aether modules, all23 FEC sources and libSRTP, not the prebuilt OpenSSL archive. Its installed runtime is exposed only in owned test children, not installed or redistributed. No valid-case ASan finding is not leak/TSan/complete security certification. The deliberately faulty research-only ASan probe is not in the product DLL. Actual DLL exports contain only the11 public protocol functions, no fixture key/fault/authority entry point.

Outstanding: complete admission/budgets/recovery/permissions/diagnostics06-03, real Dart FFI06-04, five-target builds/runnable native evidence and final human review06-05. Phase3 remains independently halted at its corrected install-only approval. NET requirements and Phase6 as a whole remain incomplete.
