# Phase 6: GameStream 协议重构与扩展 - Pattern Map

**Mapped:** 2026-10-09; 17 proposed groups; 10 have local analogs.

## File Classification

Expand grouped proposals into owned task paths.

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `native/protocol/include/aether/protocol.h` | model | event-driven | `native/core/include/aether/core.h` | role-match |
| `native/protocol/src/context.cpp` | service | event-driven | `native/core/src/core.cpp` | role-match |
| `native/protocol/src/wire.cpp` | utility | transform | none | new |
| `native/protocol/src/negotiation.cpp`, `budget.cpp` | service | request-response | none | new |
| `native/protocol/src/authority.cpp`, `recovery.cpp` | service | event-driven | none | new |
| `native/protocol/src/security.cpp`, `fec.cpp` | service | streaming | none | new |
| `native/protocol/src/diagnostics.cpp` | service | event-driven | `scripts/tool-runner.cjs` | partial |
| `native/protocol/src/socket*.cpp` | provider | streaming | `native/platform/platform.cpp` | partial |
| `native/protocol/CMakeLists.txt` | config | batch | `CMakeLists.txt` | role-match |
| `native/protocol/tools/*tracer*.cpp` | controller | streaming | none | new |
| `tests/native/protocol_*.*` | test | request-response | `tests/core-tracer.test.cjs` | partial |
| `tests/protocol-{negotiation,budget,authority,tracer,recovery,wire,security,loss,diagnostics}.test.cjs` | test | batch | `tests/helios-process.test.cjs` | role-match |
| `packages/selene_native/lib/src/protocol.dart` + generated binding | provider | event-driven | `packages/selene_native/lib/src/core.dart` | role-match |
| `scripts/check-protocol-sources.cjs` + production dependency lock/notices | utility/config | file-I/O | `scripts/check-sources.cjs` | role-match |
| `scripts/verify-protocol.cjs` + evidence JSON | utility | batch | `scripts/verify.cjs` | role-match |
| `.github/workflows/protocol.yml` + five-target runner scripts | config | batch | `.github/workflows/windows.yml` | role-match |
| `protocol/*`, `docs/phase06/*` baseline/ADR/limits/vectors | model | transform | none | new |

## Pattern Assignments

### C ABI and independent context

**Sources:** `native/core/include/aether/core.h:1-60`; `native/core/src/core.cpp:1-169`.

Copy header visibility/`extern "C"`, fixed-width fields, `abi_version` + `struct_size`, explicit status codes and caller-owned output buffers. Concrete existing signatures:

```cpp
typedef void (*AetherEventCallback)(uint64_t token, uint64_t sequence,
 uint32_t kind, int32_t status, uint64_t operation_id);
AETHER_API int32_t aether_core_stop(uint64_t token, uint64_t* final_sequence);
AETHER_API int32_t aether_core_destroy(uint64_t token);
```

`core.cpp:80-84` gives the exception and layout boundary:

```cpp
template<typename F> int32_t boundary(F&& f) noexcept {
 try{return f();}catch(...){return AETHER_INTERNAL_ERROR;}
}
```

Separate protocol API/context from local-core and Instance operations. `Core` lines 23-34 show per-handle state; 99-112 clean partial thread creation; 113-122 reserve admission and undo failed insertion; 130-156 validate ACK and stop/join before destroy. Local registry tokens are not network replay/key state.

Own connection/stream/direction/key/replay/queue/timer state independently. Disconnect never StopInstance/deletes displays. Probe fault flags are not production auth hooks.

### Platform/socket boundary

**Sources:** `native/platform/include/aether/platform.h:1-8`; `native/platform/platform.cpp:1-14`.

```cpp
const PlatformDescriptor* platform(uint32_t id) noexcept;
int32_t platform_init(uint32_t id) noexcept;
void platform_shutdown(uint32_t id) noexcept;
```

Copy thin selection and capability/reason results. Non-Windows descriptors are unsupported local skeletons, not socket implementations. Add POSIX/Winsock adapters; exclude driver/SetupAPI/GPU/Flutter from protocol core.

### Standalone CMake and test separation

**Source:** `CMakeLists.txt:12-18`, `:32-52`, `:66-75`.

```cmake
target_compile_features(aether_core PRIVATE cxx_std_20)
target_compile_definitions(aether_core PRIVATE AETHER_CORE_EXPORTS)
include(CTest)
set_tests_properties(core_${SUITE} PROPERTIES TIMEOUT 60)
```

Copy target-scoped settings and C11 consumer validation. Keep authority/key/fault hooks test-only. Add `protocol-fast` labels, deadlines and nonzero counts.

Use standalone `native/protocol` CMake: root lines 19-31 link Windows devices and CTest is inside `if(NOT AETHER_CORE_ONLY)`. Neither mode supplies portable protocol tests. Define standalone version-generation inputs.

### Process and evidence harness

**Sources:** `tests/core-tracer.test.cjs:1-9`; `tests/helios-process.test.cjs:1-36`; `scripts/tool-runner.cjs:27-77`; `scripts/verify.cjs:14-60`.

```js
const r=spawnSync(binary,args,{input:'',encoding:'utf8',timeout:5000,windowsHide:true});
assert.equal(r.status,expected,JSON.stringify(r));
```

Copy actual-child/exit/output/timeout/log/count checks. Replace Windows `.exe`/Debug/Ctrl+C assumptions with explicit target paths. Tracer requires actual secure-control/datagram sockets between distinct contexts/processes.

`runGroup(spec,{root,logDirectory})`: absolute executable, argument array, `shell:false`, bounded redacted logs, owned-child timeout. `validateTests(output)` rejects empty/fail/skip/cancel/TODO. Add CTest/XCTest/Android count parsers; relay cleans owned PIDs only, no system mutation.

`verify.cjs:49-59`: exit/duration/count/log/artifact hash. Add source/dependency SHA, compiler/SDK/arch/command/seed/packet counters/run URL; distinguish run, cross-build, synthetic and physical evidence.

### Selene low-frequency consumer

**Source:** `packages/selene_native/lib/src/core.dart:1-7`, `:46-89`, `:110-129`, `:158-183`.

```dart
listener = NativeCallable<NativeEvent>.listener(_receive);
final (status, finalSequence) = await Isolate.run(() => _stopNative(path, handle));
```

Copy imports, `calloc`/`finally free`, typed errors, token/isolate guards, bounded diagnostics, contiguous ACK and stop/drain/destroy/listener-close. Timeout retains callback for retry. Replace Windows-only loader/guard. Events carry state/reasons/proposals, never per-frame video/PCM; generate bindings from header.

### Dependency/source checks and CI

**Sources:** `scripts/check-sources.cjs:5-22`, `:25-53`, `:60-65`; `.github/workflows/windows.yml:13-58`.

Copy archive/license hashes, tracked input/binding checks, pinned actions, read-only permissions, no credentials/submodules, deadlines and always-upload/missing-artifact failure. Source gate rejects research imports. Extend fixed Pub/action-count assumptions deliberately.

Crypto/FEC/ENet has no admitted analog. PATH OpenSSL is not a product dependency. Add reviewed lock/notices/target builds; candidates remain subject to ADR gate.

## Shared Patterns

- Validate before mutation; no C++ exception crosses C ABI. Reserve bounded resources, undo own reservation, drain ACK before release.
- Explicit unsupported/unverified reasons; bounded redacted logs need secret/content sentinel and trace-expiry checks.
- Preserve local ABI; fresh auth/lease/observer fixtures are test-only, not production pairing/arbitration.
- All analogs confirmed tracked by `git ls-files`; no ignored mirrors.

## No Analog Found

Use RESEARCH/ADR plus independent vectors for wire, negotiation/budget, authority/reconnect, crypto/replay/FEC, two-stream relay and baseline mapping. No product network implementation exists.

Five-target checks require Windows/Linux/macOS socket CTest, Android adb native execution, iOS device-library build plus simulator XCTest with the same core. Apple physical checks alone may remain TODO. Cross-build/scaffolding cannot substitute execution; iOS device binaries cannot run as macOS tests.

## Metadata

12 tracked analogs read. No builds/tests/system operations. Phase 3 halted; restart/shutdown forbidden.
