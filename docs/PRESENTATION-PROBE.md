# Windows local presentation probe

Phase 02-02 implements a local static 1280×720 BGRA8 source. D3D11 hardware
device creation on Flutter's actual adapter, Direct2D drawing and DirectWrite text remain native. Software adapter status is explicit. Dart
receives bounded control fields, texture IDs, errors and counters only.

## Paths and ownership

GPU Texture registers a DXGI shared handle with Flutter's pinned Windows GPU
descriptor API. Each pattern redraw publishes a new immutable texture after a
bounded GPU producer completion query. A descriptor owns the source and frame
until the engine's release callback. Descriptor storage itself remains in the
registration state until unregister completion: the pinned engine reads its
visible dimensions after calling release_callback. Unregister is asynchronous: its completion
closure retains the TextureVariant/source; the platform window timer replies
to Dart after completion. A two-second timeout retains that state and rejects
another start until stop succeeds. No CPU image fallback is used for rendering.

The native surface is an owned HWND and D3D11 swapchain. A shader samples the
same source implementation and computes a centered 16:9 viewport over a black
backbuffer. WM_SIZE and WM_DPICHANGED resize that surface; Dart uses AspectRatio
inside a black preview. The panel auto-initializes only the local core. Starting
images, selecting color bars/grid/text and selecting a backend remain manual.
Closing the surface's decoration hides it; the panel's stop releases ownership.

Observed copy stages: native GPU draw; shared handle import by Flutter; native
surface shader sampling. Engine import/internal copies have not been measured.
Diagnostic screenshots alone use a staging readback and native WIC PNG encoding;
that readback is a test capture, not the rendering path. Pixel data never enters
the Dart method channel.

## Checks and evidence

Commands from the repository root:

```powershell
pwsh -NoProfile -File scripts/check-ui.ps1 -Suite Panel -Automation
pwsh -NoProfile -File scripts/check-ui.ps1 -Suite Lifecycle -Automation
pwsh -NoProfile -File scripts/check-helios.ps1 -Automation -Configuration Debug
pwsh -NoProfile -File scripts/check-helios.ps1 -Automation -Configuration Release
pwsh -NoProfile -File scripts/measure-presentation.ps1 -Backend Both
pwsh -NoProfile -File scripts/measure-presentation.ps1 -CheckReport
```

Panel tests cover no automatic presentation, initialization retry, redacted
errors, actual engine descriptor consumption, both backends, device/texture/
register/first-frame acquisition failure rollback and delayed unregister
retention/retry. The core token survives render failure. Runtime presentation
capability appears only while an initialized backend is active; the portable
core descriptor still advertises LOCAL_CORE alone.

The lifecycle wrapper additionally builds a test-only close launch, starts an
in-flight native probe and Texture, sends actual repeated WM_CLOSE and requires
the close_ready log with zero core/render counters. It restores a normal app
afterward. Fault/close/capture channel commands require a test build and explicit
test launch environment. Ordinary builds have no fault controls.

Core stop/ACK and render unregister run concurrently. Normal close has a
five-second aggregate budget and no extra confirmation dialog. Timeout logs
retained ownership before process teardown. Local shutdown never calls host
instance/application/display-group/lease mutations.

Helios stays foreground after initialization. Its Ctrl+C handler sets atomic
flags; main performs cleanup. Genuine console success/failure waits for one key.
--automation and redirected stdin bypass that wait. The signal test creates a
unique console and child, waits for initialization, verifies foreground liveness,
sends real CTRL_C_EVENT and checks zero counters and a non-hanging exit.

Logs, screenshot PNGs, per-round JSON and hash manifests are under ignored
`artifacts/phase02`. Tracked result indexes link their identities. The measurement
uses 30-second warmup/60-second window/three rounds for each backend; available
process CPU and RSS are actual samples. GPU utilization/VRAM are unavailable
with instrumentation reasons. A static test does not establish decode, 60fps,
glass-to-glass latency, power, HDR, multiwindow or remote streaming behavior.

## Conditions and remaining review

Observed actual engine adapter: NVIDIA GeForce RTX 5080; DPI 144. Full OS/driver/
SDK identity is in the measurement provenance. This does not validate Windows
10, Windows ARM or the other four client platforms. Minimum host build remains
pending Phases 3–5. BGRA8 is SDR; HDR and additional window/adapter behavior
remain unverified.

The first exploratory run had a descriptor lifetime defect and its Texture
capture was black. Those CPU/RSS rounds remain as failed evidence under
artifacts/phase02/presentation and cannot count as a working comparison. Persistent
descriptor storage fixed the defect; the engine integration now checks actual
bright text pixels and records gpu-preview.png. GDI capture of the Flutter view
was unreliable/black and is not success evidence. Native
GPU source/backbuffer captures and actual engine preview pixels complement,
but do not replace, final human observation of Texture, all patterns, resize,
letterboxing and DPI. Texture remains the provisional integrated-panel default;
no media-performance superiority is inferred from static CPU/RSS samples.

Actual UI close, final capture and measurement statuses are recorded in the
plan summary after the corresponding commands finish. Final visual and genuine
interactive-console observations remain at the complete-evidence checkpoint in
02-03; required CI cannot be waived by that review.
