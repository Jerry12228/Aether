#ifndef AETHER_PROTOCOL_H
#define AETHER_PROTOCOL_H
#include <stdint.h>
#if defined(_WIN32)
# if defined(AETHER_PROTOCOL_EXPORTS)
#  define AETHER_PROTOCOL_API __declspec(dllexport)
# else
#  define AETHER_PROTOCOL_API __declspec(dllimport)
# endif
#else
# define AETHER_PROTOCOL_API __attribute__((visibility("default")))
#endif
#ifdef __cplusplus
extern "C" {
#endif
enum AetherProtocolStatus {
 AP_OK=0, AP_INVALID_ARGUMENT=1, AP_ABI_MISMATCH=2, AP_INVALID_HANDLE=3,
 AP_BUSY=5, AP_STOPPED=6, AP_TIMEOUT=11, AP_INTERNAL_ERROR=12,
 AP_BUFFER_TOO_SMALL=13, AP_VERSION=20, AP_TRUST=21, AP_IDENTITY=22,
 AP_PERMISSION=23, AP_LENGTH=24, AP_FIELD=25, AP_PROTECTION=26,
 AP_STALE=27, AP_CANCELLED=28, AP_EXPIRED=29, AP_ALREADY_COMPLETE=30
};
typedef void (*AetherProtocolEvent)(uint64_t handle, uint64_t sequence,
 uint32_t kind, int32_t status, uint64_t operation);
/* Borrowed strings are copied at create. Credentials are supplied by the caller;
   the library has no embedded identity, test authority or permissive verifier.
   This isolated prototype binds loopback only; it is not a product listener. */
typedef struct AetherProtocolConfig {
 uint32_t abi_version, struct_size, role, deadline_ms;
 uint32_t peer_control_port, reserved;
 uint64_t host_id, instance_id, display_id, stream_id, connection_id, client_id;
 uint64_t lease_epoch, config_generation, key_generation;
 const char *certificate_file, *private_key_file, *trust_file, *peer_name;
 uint32_t version_count, versions[8];
 uint32_t permission_read, reserved2;
} AetherProtocolConfig;
/* Availability: 0 unsupported, 1 supported, 2 unverified. Numeric reason codes
   remain visible with disabled capabilities. A proposal never alters a stream. */
typedef struct AetherProtocolCapability {
 char name[32];
 uint32_t availability, reason;
 uint64_t requested, available;
} AetherProtocolCapability;
typedef struct AetherProtocolRequest {
 uint32_t abi_version, struct_size;
 uint64_t request_id, budget_revision, lease_epoch;
 uint32_t expires_ms, capability_count;
 const AetherProtocolCapability* capabilities;
} AetherProtocolRequest;
enum AetherProtocolMediaDirection { AP_DOWNLINK=1, AP_UPLINK=2 };
enum AetherProtocolMediaKind { AP_VIDEO=1, AP_AUDIO=2, AP_MICROPHONE=3, AP_CAMERA=4 };
enum AetherProtocolShardRole { AP_SOURCE=0, AP_REPAIR=1 };
enum AetherProtocolFecProfile { AP_RS_VANDERMONDE_GF256_11D_V1=1 };
/* HELLO TLV7 serializes numeric fields in network order, not a memory image.
   The validator checks the ABI/length prefix before reading field values.
   Current bounds are synthetic prototype limits, not product settings removal. */
typedef struct AetherProtocolMediaOptions {
 uint32_t abi_version, struct_size;
 uint16_t packet_size, path_mtu, fec_percent, min_repair;
 uint16_t shard_bytes, source_shards, deadline_ms, reserved;
 uint32_t per_stream_queue_bytes;
} AetherProtocolMediaOptions;
typedef struct AetherProtocolEffectiveMedia {
 uint32_t abi_version, struct_size, query_version, header_bytes;
 uint32_t packet_bytes, frame_bytes, queue_bytes, deadline_ms;
 uint16_t source_shards, total_shards, shard_bytes, profile;
} AetherProtocolEffectiveMedia;
AETHER_PROTOCOL_API int32_t aether_protocol_validate_media_options(
 const AetherProtocolMediaOptions*, AetherProtocolEffectiveMedia*);
/* One bounded synchronous tracer operation per connection. Host input is an
   explicitly synthetic sink payload; client input is a HELLO wire request.
   A second submit is rejected. Native sockets belong to this handle only. */
AETHER_PROTOCOL_API int32_t aether_protocol_create(const AetherProtocolConfig*, AetherProtocolEvent, uint64_t*);
AETHER_PROTOCOL_API int32_t aether_protocol_submit(uint64_t, const uint8_t*, uint32_t);
AETHER_PROTOCOL_API int32_t aether_protocol_query(uint64_t, char*, uint32_t, uint32_t*);
AETHER_PROTOCOL_API int32_t aether_protocol_ack(uint64_t, uint64_t);
AETHER_PROTOCOL_API int32_t aether_protocol_stop(uint64_t, uint64_t*);
AETHER_PROTOCOL_API int32_t aether_protocol_destroy(uint64_t);
AETHER_PROTOCOL_API int32_t aether_protocol_propose(uint64_t, const AetherProtocolRequest*);
AETHER_PROTOCOL_API int32_t aether_protocol_confirm(uint64_t, uint64_t request_id,
 uint64_t budget_revision, const char* proposal_digest);
AETHER_PROTOCOL_API int32_t aether_protocol_cancel(uint64_t, uint64_t request_id);
/* Pure bounded parser: independent golden inputs can exercise the wire oracle. */
AETHER_PROTOCOL_API int32_t aether_protocol_negotiate(const uint8_t*, uint32_t,
 const uint32_t*, uint32_t, uint32_t* selected, uint32_t* upgrade_side);
#ifdef __cplusplus
}
#endif
#endif
