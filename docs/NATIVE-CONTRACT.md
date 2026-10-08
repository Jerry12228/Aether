# Local core ABI 1

Status: in progress, 2026-10-08. Tracer is tested with actual native/Dart DLL
consumers. Debug/Release lifecycle and adapters suites plus the actual Windows engine tracer passed;
presentation/window-close integration and final CI/phase acceptance remain pending.

The public [C header](../native/core/include/aether/core.h) is the shared contract.
C++20 code remains independent of Flutter/Qt. All exported status functions
catch exceptions and return INTERNAL_ERROR. Function arguments use fixed-width
integers, pointer outputs and C layouts; platform/engine types stay outside it.
C static assertions check 16-byte configuration, 32-byte capabilities and
64-byte statistics layouts. ABI mismatch and undersized structures are rejected.

## Ownership and events

Tokens combine an increasing 32-bit generation with local slot 1; the registry
never dereferences token data. A new generation cannot be confused with an old
one. Maximum live local cores is 64. Invalid/stale tokens fail. Successful
destroy retires a generation; repeated destroy reports ALREADY_DESTROYED.
Output UTF-8 belongs to the caller; required size includes the terminator and
truncation returns BUFFER_TOO_SMALL with a terminated prefix. Config input is
borrowed only during create and copied state survives asynchronously.

Each core owns one serial worker and one serial dispatcher. An accepted probe
has a native operation ID and receives progress and exactly one terminal
status. Callback fields are copied scalars: token, sequence, kind, status and
operation ID. Dart NativeCallable.listener receives them on its creator isolate.
No video frame, GPU resource or PCM crosses this callback.

Admission is bounded at 32 operations including terminal events waiting for
ACK. The pending-event bound is 256, with reserved terminal capacity; excess
admission returns QUEUE_FULL. Only progress can coalesce. Dart diagnostics and
native memory counters are bounded independently. Operation IDs increase;
cancel requests work cancellation, repeats are safe, completed cancel reports
ALREADY_COMPLETE and unknown operation reports NOT_FOUND.

## Stop and disposal

Stop rejects new work, cancels admitted work and joins worker/dispatcher with a
two-second deadline. Success returns the final published sequence. It is called
from an auxiliary Dart isolate to keep the UI isolate available for callbacks.
ACK must be monotonic and no greater than the published sequence. Dart tracks
contiguous received sequences, rather than assuming cross-thread arrival order.

After stop, Dart drains/ACKs through the final sequence; destroy remains BUSY
until both native quiescence and ACK hold. Only then does it close the listener
and stream. TIMEOUT retains safe native/listener references and supports retry;
it never frees a callback still in use. Consumer code must release local cores
before process exit. Window-close integration and its five-second aggregate
budget are now implemented by plan 02-02. Dart removes the Texture consumer
before unregister, awaits registrar completion and concurrently stops/ACKs the
core; the runner enforces a five-second aggregate close budget. Timeout retains
unsafe references through completion or process teardown.

## Capabilities and product boundaries

The same query contains Windows/macOS/iOS/Android/Linux descriptors. Windows
reports LOCAL_CORE only; the Windows presentation plugin advertises a separate
runtime PRESENTATION bit only for an initialized active backend. The four other adapters
report unimplemented with UNSUPPORTED reason. Compiling these descriptors on
Windows does not establish corresponding target support.

LocalCoreDispose/TestRenderStop do not implement Disconnect or StopInstance.
No export changes persistent instances, applications, display groups, host
ControlLease or observer permissions. Future disconnect/switch must preserve
instances and display groups; host control lease is globally unique and
observers cannot inject input, upload devices or mutate sessions. Arbitration
remains assigned to later roadmap phases. No GameStream transport or Phase 6
wire format is changed by this local ABI.

