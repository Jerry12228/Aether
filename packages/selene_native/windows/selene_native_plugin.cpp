#include "selene_native_plugin.h"
#include <flutter/standard_method_codec.h>
#include <atomic>
#include <stdexcept>
#include <wincodec.h>
namespace selene_native {
using flutter::EncodableValue;
using flutter::EncodableMap;
using Result = flutter::MethodResult<EncodableValue>;
using aether::presentation::Source;
using aether::presentation::Pattern;
static constexpr UINT_PTR kStopTimer = 0xAE7202;
static std::atomic<unsigned> registrations{0}, descriptors{0};
static std::atomic<uint64_t> descriptor_calls{0}, descriptor_releases{0};
static unsigned WindowDpi(HWND window) {
  using GetDpi = UINT(WINAPI*)(HWND);
  const auto get_dpi = reinterpret_cast<GetDpi>(GetProcAddress(GetModuleHandleW(L"user32.dll"), "GetDpiForWindow"));
  if (get_dpi) return get_dpi(window);
  const auto dc = GetDC(window); const unsigned dpi = dc ? GetDeviceCaps(dc, LOGPIXELSX) : 96;
  if (dc) ReleaseDC(window, dc); return dpi;
}
#ifdef AETHER_ENABLE_TEST_HOOKS
static void CaptureOwnedView(HWND window, const std::wstring& path) {
  RECT bounds{}; if (!GetClientRect(window,&bounds) || bounds.right<=0 || bounds.bottom<=0 || bounds.right>8192 || bounds.bottom>8192)
    throw std::runtime_error("Invalid owned view capture dimensions");
  const auto original=GetDC(window); const auto memory=CreateCompatibleDC(original);
  const auto bitmap=CreateCompatibleBitmap(original,bounds.right,bounds.bottom);
  const auto previous=SelectObject(memory,bitmap);
  const bool copied=BitBlt(memory,0,0,bounds.right,bounds.bottom,original,0,0,SRCCOPY)!=0;
  SelectObject(memory,previous); DeleteDC(memory); ReleaseDC(window,original);
  struct BitmapRelease{HBITMAP value;~BitmapRelease(){DeleteObject(value);}} cleanup{bitmap};
  if (!copied) throw std::runtime_error("Owned view GDI capture failed");
  using Microsoft::WRL::ComPtr;
  const auto check=[](HRESULT status){if(FAILED(status))throw std::runtime_error("Owned view WIC capture failed");};
  ComPtr<IWICImagingFactory> factory; check(CoCreateInstance(CLSID_WICImagingFactory,nullptr,CLSCTX_INPROC_SERVER,IID_PPV_ARGS(&factory)));
  ComPtr<IWICBitmap> image; check(factory->CreateBitmapFromHBITMAP(bitmap,nullptr,WICBitmapIgnoreAlpha,&image));
  ComPtr<IWICStream> stream; check(factory->CreateStream(&stream)); check(stream->InitializeFromFilename(path.c_str(),GENERIC_WRITE));
  ComPtr<IWICBitmapEncoder> encoder; check(factory->CreateEncoder(GUID_ContainerFormatPng,nullptr,&encoder)); check(encoder->Initialize(stream.Get(),WICBitmapEncoderNoCache));
  ComPtr<IWICBitmapFrameEncode> frame; ComPtr<IPropertyBag2> properties;
  check(encoder->CreateNewFrame(&frame,&properties)); check(frame->Initialize(properties.Get())); check(frame->SetSize(bounds.right,bounds.bottom));
  auto format=GUID_WICPixelFormat32bppBGRA; check(frame->SetPixelFormat(&format));
  ComPtr<IWICFormatConverter> converted; check(factory->CreateFormatConverter(&converted));
  check(converted->Initialize(image.Get(),format,WICBitmapDitherTypeNone,nullptr,0,WICBitmapPaletteTypeCustom));
  check(frame->WriteSource(converted.Get(),nullptr)); check(frame->Commit()); check(encoder->Commit());
}
#endif
struct RenderState {
  std::shared_ptr<Source> source;
  std::unique_ptr<flutter::TextureVariant> texture;
  std::string backend;
  int64_t id = -1;
  std::atomic<bool> done{false};
  bool unregister_requested = false;
  bool delayed = false;
  std::atomic<ULONGLONG> completed_at{0};
  // Pinned engine PopulateTexture reads dimensions AFTER release_callback.
  // Keep descriptor storage until registrar completion; release only its payload.
  FlutterDesktopGpuSurfaceDescriptor descriptor{};
};
struct Descriptor {
  std::shared_ptr<Source> source;
  std::shared_ptr<aether::presentation::Frame> frame;
  explicit Descriptor(std::shared_ptr<Source> input) : source(std::move(input)), frame(source->Snapshot()) {
    ++descriptors; ++descriptor_calls;
  }
};
static std::string StringArgument(const flutter::MethodCall<EncodableValue>& call, const char* key) {
  if (!call.arguments() || !std::holds_alternative<EncodableMap>(*call.arguments()))
    throw std::runtime_error("Expected bounded control map");
  const auto& map = std::get<EncodableMap>(*call.arguments());
  if (map.size() > 3) throw std::runtime_error("Too many control fields");
  const auto it = map.find(EncodableValue(key));
  if (it == map.end() || !std::holds_alternative<std::string>(it->second))
    throw std::runtime_error("Missing string control");
  const auto text = std::get<std::string>(it->second);
  if (text.size() > 32) throw std::runtime_error("Control too long");
  return text;
}
static Pattern ParsePattern(const std::string& text) {
  if (text == "colorBars") return Pattern::color_bars;
  if (text == "grid") return Pattern::grid;
  if (text == "text") return Pattern::text;
  throw std::runtime_error("Unknown test pattern");
}
void SeleneNativePlugin::RegisterWithRegistrar(flutter::PluginRegistrarWindows* registrar) {
  auto channel = std::make_unique<flutter::MethodChannel<EncodableValue>>(
    registrar->messenger(), "selene_native/presentation", &flutter::StandardMethodCodec::GetInstance());
  auto plugin = std::make_unique<SeleneNativePlugin>(registrar);
  channel->SetMethodCallHandler([pointer = plugin.get()](const auto& call, auto result) {
    pointer->HandleMethodCall(call, std::move(result));
  });
  registrar->AddPlugin(std::move(plugin));
}
SeleneNativePlugin::SeleneNativePlugin(flutter::PluginRegistrarWindows* registrar) : registrar_(registrar) {
  owner_ = GetAncestor(registrar_->GetView()->GetNativeWindow(), GA_ROOT);
  delegate_ = registrar_->RegisterTopLevelWindowProcDelegate(
    [this](HWND, UINT message, WPARAM wp, LPARAM) -> std::optional<LRESULT> {
      if (message == WM_TIMER && wp == kStopTimer) { PollStop(); return 0; }
      return std::nullopt;
    });
}
SeleneNativePlugin::~SeleneNativePlugin() {
  KillTimer(owner_, kStopTimer);
  registrar_->UnregisterTopLevelWindowProcDelegate(delegate_);
  if (state_) {
    state_->source->CloseSurface();
    if (state_->id >= 0 && !state_->unregister_requested) {
      auto retained = state_;
      registrar_->texture_registrar()->UnregisterTexture(retained->id, [retained] {
        --registrations; retained->done = true;
      });
    }
  }
}
EncodableMap SeleneNativePlugin::Diagnostics() const {
  FILETIME created{}, exited{}, kernel{}, user{};
  GetProcessTimes(GetCurrentProcess(), &created, &exited, &kernel, &user);
  ULARGE_INTEGER cpu_kernel{}, cpu_user{};
  cpu_kernel.LowPart=kernel.dwLowDateTime; cpu_kernel.HighPart=kernel.dwHighDateTime;
  cpu_user.LowPart=user.dwLowDateTime; cpu_user.HighPart=user.dwHighDateTime;
  EncodableMap map{
    {EncodableValue("processCpu100ns"), EncodableValue(static_cast<int64_t>(cpu_kernel.QuadPart+cpu_user.QuadPart))},
    {EncodableValue("processId"), EncodableValue(static_cast<int32_t>(GetCurrentProcessId()))},
    {EncodableValue("liveSources"), EncodableValue(static_cast<int32_t>(Source::live_sources.load()))},
    {EncodableValue("activeRegistrations"), EncodableValue(static_cast<int32_t>(registrations.load()))},
    {EncodableValue("outstandingDescriptors"), EncodableValue(static_cast<int32_t>(descriptors.load()))},
    {EncodableValue("descriptorCalls"), EncodableValue(static_cast<int64_t>(descriptor_calls.load()))},
    {EncodableValue("descriptorReleases"), EncodableValue(static_cast<int64_t>(descriptor_releases.load()))},
    {EncodableValue("generation"), EncodableValue(static_cast<int64_t>(generation_))},
    {EncodableValue("stopping"), EncodableValue(state_ && state_->unregister_requested)},
    {EncodableValue("capabilityBits"), EncodableValue(state_ && !state_->unregister_requested ? 2 : 0)},
    {EncodableValue("width"), EncodableValue(1280)}, {EncodableValue("height"), EncodableValue(720)},
    {EncodableValue("sourceWidth"), EncodableValue(1280)}, {EncodableValue("sourceHeight"), EncodableValue(720)},
    {EncodableValue("format"), EncodableValue("BGRA8")},
    {EncodableValue("copyPath"), EncodableValue("D2D GPU render; immutable DXGI shared texture; engine import unmeasured; native surface GPU shader sample")},
    {EncodableValue("dpi"), EncodableValue(static_cast<int32_t>(WindowDpi(owner_)))}
  };
  if (state_) {
    map[EncodableValue("backend")] = EncodableValue(state_->backend);
    map[EncodableValue("textureId")] = EncodableValue(state_->id);
    map[EncodableValue("adapter")] = EncodableValue(state_->source->adapter);
    map[EncodableValue("softwareAdapter")] = EncodableValue(state_->source->software_adapter);
    map[EncodableValue("targetWidth")] = EncodableValue(static_cast<int32_t>(state_->source->target_width));
    map[EncodableValue("targetHeight")] = EncodableValue(static_cast<int32_t>(state_->source->target_height));
  }
  return map;
}
void SeleneNativePlugin::BeginStop(std::unique_ptr<Result> result) {
  owner_ = GetAncestor(registrar_->GetView()->GetNativeWindow(), GA_ROOT);
  if (!state_) { result->Success(EncodableValue(Diagnostics())); return; }
  if (pending_) { result->Error("BUSY", "A stop barrier is already pending"); return; }
  pending_ = std::move(result); stop_started_ = GetTickCount64();
  state_->source->CloseSurface();
  state_->delayed = fault_ == "unregister";
  if (state_->id >= 0 && !state_->unregister_requested) {
    state_->unregister_requested = true;
    auto retained = state_;
    registrar_->texture_registrar()->UnregisterTexture(retained->id, [retained] {
      --registrations; retained->completed_at = GetTickCount64(); retained->done = true;
    });
  } else if (state_->id < 0) { state_->unregister_requested = true; state_->done = true; }
  SetTimer(owner_, kStopTimer, 10, nullptr); PollStop();
}
void SeleneNativePlugin::PollStop() {
  if (!pending_) return;
  const auto now = GetTickCount64();
  if (state_->done && (!state_->delayed || now - state_->completed_at >= 2200)) {
    state_.reset(); KillTimer(owner_, kStopTimer);
    auto result = std::move(pending_);
    if (!stop_error_.empty()) { auto error = std::move(stop_error_); stop_error_.clear(); result->Error("PRESENTATION", error); }
    else result->Success(EncodableValue(Diagnostics()));
  } else if (now - stop_started_ >= 2000) {
    KillTimer(owner_, kStopTimer);
    auto result = std::move(pending_); result->Error("TIMEOUT", "Unregister barrier exceeded 2 seconds; references retained; retry stop");
  }
}
void SeleneNativePlugin::HandleMethodCall(const flutter::MethodCall<EncodableValue>& call, std::unique_ptr<Result> result) {
  // Registration precedes runner SetChildContent; resolve its current root now.
  owner_ = GetAncestor(registrar_->GetView()->GetNativeWindow(), GA_ROOT);
  try {
    const auto& name = call.method_name();
    if (name == "diagnostics") { result->Success(EncodableValue(Diagnostics())); return; }
    if (name == "stop") { BeginStop(std::move(result)); return; }
#ifdef AETHER_ENABLE_TEST_HOOKS
    if (name=="testResize") {
      if (!GetEnvironmentVariableW(L"AETHER_TEST_FAULTS",nullptr,0) || !state_ || state_->backend!="nativeSurface") throw std::runtime_error("No test surface");
      const auto size=StringArgument(call,"size");
      if(size=="portrait") state_->source->ResizeWindow(640,800);
      else if(size=="wide") state_->source->ResizeWindow(1200,600);
      else throw std::runtime_error("Invalid resize case");
      result->Success(EncodableValue(Diagnostics())); return;
    }
    if (name == "testCapture") {
      if (!GetEnvironmentVariableW(L"AETHER_TEST_FAULTS", nullptr, 0) || !state_ || state_->unregister_requested)
        throw std::runtime_error("No test capture source");
      wchar_t directory[32768]{};
      const auto length = GetEnvironmentVariableW(L"AETHER_ARTIFACT_DIR", directory, 32768);
      if (!length || length >= 32768) throw std::runtime_error("Test artifact directory missing");
      const auto kind=StringArgument(call,"kind");
      if(kind=="view") {
        CaptureOwnedView(registrar_->GetView()->GetNativeWindow(),std::wstring(directory)+L"/gpu-view.png"); result->Success();return;
      }
      if(kind!="source" && kind!="nativeSurface") throw std::runtime_error("Invalid capture kind");
      const auto path=std::wstring(directory)+(kind=="source"?L"/native-source.png":L"/native-surface.png");
      state_->source->SaveCapture(path,kind=="nativeSurface"); result->Success();return;
    }
    if (name == "testFault") {
      if (!GetEnvironmentVariableW(L"AETHER_TEST_FAULTS", nullptr, 0)) throw std::runtime_error("Test launch not enabled");
      fault_ = StringArgument(call, "stage");
      if (fault_ != "" && fault_ != "device" && fault_ != "texture" && fault_ != "register" && fault_ != "firstFrame" && fault_ != "unregister")
        throw std::runtime_error("Unknown test fault");
      result->Success(); return;
    }
#endif
    if (name == "start") {
      if (state_) { result->Error("BUSY", "Stop the existing presentation before starting another"); return; }
      const auto backend = StringArgument(call, "backend");
      const auto pattern = ParsePattern(StringArgument(call, "pattern"));
      if (backend != "gpuTexture" && backend != "nativeSurface") throw std::runtime_error("Unknown backend");
      auto next = std::make_shared<RenderState>(); next->backend = backend;
      if (fault_ == "device") throw std::runtime_error("Injected device acquisition failure");
      auto* adapter=registrar_->GetView()->GetGraphicsAdapter();
      if (!adapter) throw std::runtime_error("Flutter graphics adapter unavailable");
      next->source = std::make_shared<Source>(adapter);
      if (fault_ == "texture") throw std::runtime_error("Injected texture acquisition failure");
      next->source->Draw(pattern);
      if (backend == "gpuTexture") {
        std::weak_ptr<RenderState> weak = next;
        next->texture = std::make_unique<flutter::TextureVariant>(flutter::GpuSurfaceTexture(
          kFlutterDesktopGpuSurfaceTypeDxgiSharedHandle, [weak](size_t, size_t) -> const FlutterDesktopGpuSurfaceDescriptor* {
            auto current = weak.lock(); if (!current) return nullptr;
            auto* payload = new Descriptor(current->source);
            auto& descriptor=current->descriptor;
            descriptor.struct_size=sizeof(descriptor); descriptor.handle=payload->frame->shared_handle;
            descriptor.width=descriptor.visible_width=1280; descriptor.height=descriptor.visible_height=720;
            descriptor.format=kFlutterDesktopPixelFormatBGRA8888;
            descriptor.release_context=payload;
            descriptor.release_callback=[](void* context){delete static_cast<Descriptor*>(context);--descriptors;++descriptor_releases;};
            return &descriptor;
          }));
        if (fault_ == "register") throw std::runtime_error("Injected register failure");
        next->id = registrar_->texture_registrar()->RegisterTexture(next->texture.get());
        if (next->id < 0) throw std::runtime_error("RegisterTexture rejected GPU surface");
        ++registrations;
      } else { next->source->OpenSurface(owner_); }
      state_ = next; ++generation_;
      if (fault_ == "firstFrame" || (next->id >= 0 && !registrar_->texture_registrar()->MarkTextureFrameAvailable(next->id))) {
        stop_error_ = "First frame submission failed; rolling back presentation";
        BeginStop(std::move(result)); return;
      }
      result->Success(EncodableValue(Diagnostics())); return;
    }
    if (name == "pattern") {
      if (!state_ || state_->unregister_requested) throw std::runtime_error("No active presentation");
      state_->source->Draw(ParsePattern(StringArgument(call, "pattern")));
      if (state_->id >= 0 && !registrar_->texture_registrar()->MarkTextureFrameAvailable(state_->id))
        throw std::runtime_error("MarkTextureFrameAvailable failed");
      result->Success(); return;
    }
    result->NotImplemented();
  } catch (const std::exception& error) {
    if (call.method_name() == "pattern" && state_ && !state_->unregister_requested) {
      stop_error_ = error.what(); BeginStop(std::move(result));
    } else { result->Error("PRESENTATION", error.what()); }
  }
    catch (...) { result->Error("PRESENTATION", "Unhandled native presentation failure"); }
}
}
