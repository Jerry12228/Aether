#ifndef AETHER_CORE_H
#define AETHER_CORE_H
#include <stdint.h>
#if defined(_WIN32)
# if defined(AETHER_CORE_EXPORTS)
#  define AETHER_API __declspec(dllexport)
# else
#  define AETHER_API __declspec(dllimport)
# endif
#else
# define AETHER_API __attribute__((visibility("default")))
#endif
#ifdef __cplusplus
extern "C" {
#endif
/* Local resources only: no host Instance/DisplayGroup/ControlLease mutation. */
enum AetherStatus {
 AETHER_OK=0, AETHER_INVALID_ARGUMENT=1, AETHER_ABI_MISMATCH=2,
 AETHER_INVALID_HANDLE=3, AETHER_ALREADY_DESTROYED=4, AETHER_BUSY=5,
 AETHER_STOPPED=6, AETHER_NOT_FOUND=7, AETHER_ALREADY_COMPLETE=8,
 AETHER_CANCELLED=9, AETHER_QUEUE_FULL=10, AETHER_TIMEOUT=11,
 AETHER_INTERNAL_ERROR=12, AETHER_BUFFER_TOO_SMALL=13, AETHER_UNSUPPORTED=14
};
enum AetherEventKind { AETHER_PROGRESS=1, AETHER_TERMINAL=2 };
enum AetherPlatform { AETHER_WINDOWS=1, AETHER_MACOS=2, AETHER_IOS=3, AETHER_ANDROID=4, AETHER_LINUX=5 };
enum AetherCapability { AETHER_LOCAL_CORE=1, AETHER_PRESENTATION=2 };
/* Scalars copied by NativeCallable.listener. No borrowed asynchronous memory. */
typedef void (*AetherEventCallback)(uint64_t token, uint64_t sequence, uint32_t kind, int32_t status, uint64_t operation_id);
typedef struct AetherConfig { uint32_t abi_version; uint32_t struct_size; uint32_t flags; uint32_t reserved; } AetherConfig;
typedef struct AetherCapabilities {
 uint32_t abi_version; uint32_t struct_size; uint32_t platform_id; uint32_t interface_version;
 uint64_t capability_bits; uint32_t implemented; uint32_t reason_code;
} AetherCapabilities;
typedef struct AetherStats {
 uint32_t abi_version; uint32_t struct_size;
 uint64_t published_sequence; uint64_t acknowledged_sequence;
 uint32_t pending_events; uint32_t admitted_operations; uint32_t live_handles; uint32_t live_threads;
 uint64_t worker_thread_id; uint64_t dispatcher_thread_id;
 uint32_t stopped; uint32_t reserved;
} AetherStats;
/* Caller owns all output buffers. required includes the UTF-8 terminator. */
AETHER_API int32_t aether_core_version(uint32_t abi_version, char* buffer, uint32_t capacity, uint32_t* required);
AETHER_API int32_t aether_core_capabilities(uint32_t platform_id, AetherCapabilities* out);
AETHER_API int32_t aether_core_create(const AetherConfig* config, AetherEventCallback callback, uint64_t* token);
/* Accepted operations receive exactly one terminal event. flags=1 injects an error for tests. */
AETHER_API int32_t aether_core_start_probe(uint64_t token, uint32_t delay_ms, uint32_t flags, uint64_t* operation_id);
AETHER_API int32_t aether_core_cancel(uint64_t token, uint64_t operation_id);
/* ACK must be monotonic and no greater than the published sequence. */
AETHER_API int32_t aether_core_ack(uint64_t token, uint64_t sequence);
/* Synchronous native barrier (<=2s): call from an auxiliary Dart isolate.
   Success joins both producers and returns the final published sequence.
   TIMEOUT retains references and callback lifetime; retry stop safely. */
AETHER_API int32_t aether_core_stop(uint64_t token, uint64_t* final_sequence);
/* Requires stopped producers and ACK through final_sequence. Then listener may close. */
AETHER_API int32_t aether_core_destroy(uint64_t token);
/* token=0 returns global counters, nonzero includes per-core diagnostics. */
AETHER_API int32_t aether_core_stats(uint64_t token, AetherStats* out);
AETHER_API uint64_t aether_core_thread_id(void);
#ifdef __cplusplus
}
#endif
#endif
