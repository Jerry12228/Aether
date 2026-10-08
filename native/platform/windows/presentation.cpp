#include <aether/presentation.h>
#include <d2d1.h>
#include <dwrite.h>
#include <d3dcompiler.h>
#include <dxgi.h>
#include <dxgi1_2.h>
#include <wincodec.h>
#include <algorithm>
#include <cstdio>
#include <stdexcept>

namespace aether::presentation {
using Microsoft::WRL::ComPtr;
std::atomic<unsigned> Source::live_sources{0};
static void Check(HRESULT hr, const char* operation) {
  if (FAILED(hr)) {
    char message[128];
    sprintf_s(message, "%s HRESULT=0x%08X", operation, static_cast<unsigned>(hr));
    throw std::runtime_error(message);
  }
}
Source::Source(IDXGIAdapter* preferred) {
  D3D_FEATURE_LEVEL obtained{};
  const D3D_FEATURE_LEVEL requested[]{D3D_FEATURE_LEVEL_11_0, D3D_FEATURE_LEVEL_10_1};
  Check(D3D11CreateDevice(preferred, preferred ? D3D_DRIVER_TYPE_UNKNOWN : D3D_DRIVER_TYPE_HARDWARE, nullptr,
    D3D11_CREATE_DEVICE_BGRA_SUPPORT, requested, 2, D3D11_SDK_VERSION,
    &device_, &obtained, &context_), "D3D11CreateDevice(matched Flutter adapter)");
  ComPtr<IDXGIDevice> dxgi_device;
  ComPtr<IDXGIAdapter> dxgi_adapter;
  Check(device_.As(&dxgi_device), "Query DXGI device");
  Check(dxgi_device->GetAdapter(&dxgi_adapter), "GetAdapter");
  DXGI_ADAPTER_DESC description{};
  Check(dxgi_adapter->GetDesc(&description), "GetDesc");
  char utf8[512]{};
  WideCharToMultiByte(CP_UTF8, 0, description.Description, -1, utf8, 512, nullptr, nullptr);
  adapter = utf8;
  adapter_vendor_id = description.VendorId;
  adapter_device_id = description.DeviceId;
  // Microsoft documents Basic Render Driver as software. Some legacy adapter
  // interfaces report zero Flags, so do not overwrite its known identity.
  // https://learn.microsoft.com/windows/win32/direct3ddxgi/d3d10-graphics-programming-guide-dxgi
  software_adapter = (adapter_vendor_id == 0x1414 && adapter_device_id == 0x8c) || adapter == "Microsoft Basic Render Driver";
  ComPtr<IDXGIAdapter1> adapter1;
  if (SUCCEEDED(dxgi_adapter.As(&adapter1))) {
    DXGI_ADAPTER_DESC1 description1{};
    if (SUCCEEDED(adapter1->GetDesc1(&description1))) software_adapter |= (description1.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)!=0;
  }
  ++live_sources;
}
Source::~Source() { CloseSurface(); --live_sources; }
std::shared_ptr<Frame> Source::Snapshot() { std::lock_guard lock(mutex_); return frame_; }
void Source::Draw(Pattern pattern) {
  auto frame = std::make_shared<Frame>();
  D3D11_TEXTURE2D_DESC desc{};
  desc.Width = 1280; desc.Height = 720; desc.MipLevels = 1; desc.ArraySize = 1;
  desc.Format = DXGI_FORMAT_B8G8R8A8_UNORM; desc.SampleDesc.Count = 1;
  desc.BindFlags = D3D11_BIND_RENDER_TARGET | D3D11_BIND_SHADER_RESOURCE;
  desc.MiscFlags = D3D11_RESOURCE_MISC_SHARED;
  Check(device_->CreateTexture2D(&desc, nullptr, &frame->texture), "Create shared BGRA texture");
  ComPtr<IDXGIResource> resource;
  Check(frame->texture.As(&resource), "Query shared resource");
  Check(resource->GetSharedHandle(&frame->shared_handle), "GetSharedHandle");
  ComPtr<IDXGISurface> surface;
  Check(frame->texture.As(&surface), "Query DXGI surface");
  ComPtr<ID2D1Factory> factory;
  Check(D2D1CreateFactory(D2D1_FACTORY_TYPE_SINGLE_THREADED, factory.GetAddressOf()), "D2D factory");
  ComPtr<ID2D1RenderTarget> painter;
  const auto properties = D2D1::RenderTargetProperties(D2D1_RENDER_TARGET_TYPE_HARDWARE,
    D2D1::PixelFormat(desc.Format, D2D1_ALPHA_MODE_PREMULTIPLIED), 96, 96);
  Check(factory->CreateDxgiSurfaceRenderTarget(surface.Get(), &properties, &painter), "D2D GPU target");
  ComPtr<ID2D1SolidColorBrush> brush;
  Check(painter->CreateSolidColorBrush(D2D1::ColorF(D2D1::ColorF::White), &brush), "D2D brush");
  ComPtr<IDWriteFactory> writer;
  Check(DWriteCreateFactory(DWRITE_FACTORY_TYPE_SHARED, __uuidof(IDWriteFactory),
    reinterpret_cast<IUnknown**>(writer.GetAddressOf())), "DirectWrite factory");
  ComPtr<IDWriteTextFormat> font;
  Check(writer->CreateTextFormat(L"Segoe UI", nullptr, DWRITE_FONT_WEIGHT_NORMAL,
    DWRITE_FONT_STYLE_NORMAL, DWRITE_FONT_STRETCH_NORMAL, 36, L"en-US", &font), "DirectWrite font");
  painter->BeginDraw();
  painter->Clear(D2D1::ColorF(0.06f, 0.08f, 0.12f));
  if (pattern == Pattern::color_bars) {
    const UINT32 colors[]{0xffffff, 0xffff00, 0x00ffff, 0x00ff00, 0xff00ff, 0xff0000, 0x0000ff, 0x101010};
    for (unsigned i = 0; i < 8; ++i) {
      brush->SetColor(D2D1::ColorF(colors[i]));
      painter->FillRectangle(D2D1::RectF(i * 160.f, 100, (i + 1) * 160.f, 620), brush.Get());
    }
  } else if (pattern == Pattern::grid) {
    brush->SetColor(D2D1::ColorF(0.2f, 0.7f, 0.9f));
    for (unsigned x = 0; x <= 1280; x += 80)
      painter->DrawLine(D2D1::Point2F(static_cast<float>(x), 0), D2D1::Point2F(static_cast<float>(x), 720), brush.Get(), 2);
    for (unsigned y = 0; y <= 720; y += 80)
      painter->DrawLine(D2D1::Point2F(0, static_cast<float>(y)), D2D1::Point2F(1280, static_cast<float>(y)), brush.Get(), 2);
  }
  brush->SetColor(D2D1::ColorF(D2D1::ColorF::White));
  painter->DrawRectangle(D2D1::RectF(3, 3, 1277, 717), brush.Get(), 4);
  const wchar_t* title = pattern == Pattern::text ? L"Aether native DirectWrite / BGRA8 / 1280 x 720" :
    pattern == Pattern::grid ? L"Native GPU grid / 1280 x 720" : L"Native GPU color bars / 1280 x 720";
  painter->DrawText(title, static_cast<UINT32>(wcslen(title)), font.Get(), D2D1::RectF(24, 24, 1256, 96), brush.Get());
  const wchar_t* footer = L"FULL FRAME - 16:9 - TOP / BOTTOM / LEFT / RIGHT";
  painter->DrawText(footer, static_cast<UINT32>(wcslen(footer)), font.Get(), D2D1::RectF(24, 640, 1256, 704), brush.Get());
  if (pattern == Pattern::text) {
    const wchar_t* center = L"Static local source\nNative pixels remain on the GPU\nResize: contain with black letterbox";
    painter->DrawText(center, static_cast<UINT32>(wcslen(center)), font.Get(), D2D1::RectF(120, 200, 1160, 560), brush.Get());
  }
  Check(painter->EndDraw(), "D2D EndDraw");
  ComPtr<ID3D11Query> completed;
  const D3D11_QUERY_DESC event_query{D3D11_QUERY_EVENT, 0};
  Check(device_->CreateQuery(&event_query, &completed), "GPU producer barrier");
  context_->End(completed.Get());
  context_->Flush();
  const auto deadline = GetTickCount64() + 2000;
  HRESULT ready = S_FALSE;
  while ((ready = context_->GetData(completed.Get(), nullptr, 0, 0)) == S_FALSE) {
    if (GetTickCount64() >= deadline) throw std::runtime_error("GPU producer barrier exceeded 2 seconds");
    Sleep(1);
  }
  Check(ready, "GPU producer completion");
  // Publish immutable textures: engine-held frames are never overwritten.
  { std::lock_guard lock(mutex_); frame_ = std::move(frame); }
  if (window_) Present();
}
void Source::OpenSurface(HWND owner) {
  WNDCLASSW wc{}; wc.lpfnWndProc = WindowProc; wc.hInstance = GetModuleHandleW(nullptr);
  wc.lpszClassName = L"AetherNativePresentation"; wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
  if (!RegisterClassW(&wc) && GetLastError() != ERROR_CLASS_ALREADY_EXISTS)
    throw std::runtime_error("Register native surface window failed");
  window_ = CreateWindowExW(0, wc.lpszClassName, L"Aether local native surface / BGRA8",
    WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, 960, 600, owner, nullptr, wc.hInstance, this);
  if (!window_) throw std::runtime_error("Create native surface window failed");
  ComPtr<IDXGIDevice> dxgi_device; ComPtr<IDXGIAdapter> adapter_object; ComPtr<IDXGIFactory> factory;
  Check(device_.As(&dxgi_device), "Surface DXGI device");
  Check(dxgi_device->GetAdapter(&adapter_object), "Surface adapter");
  Check(adapter_object->GetParent(IID_PPV_ARGS(&factory)), "Surface factory");
  DXGI_SWAP_CHAIN_DESC desc{};
  desc.BufferDesc.Format = DXGI_FORMAT_B8G8R8A8_UNORM; desc.SampleDesc.Count = 1;
  desc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT; desc.BufferCount = 2;
  desc.OutputWindow = window_; desc.Windowed = TRUE; desc.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;
  Check(factory->CreateSwapChain(device_.Get(), &desc, &swapchain_), "Create native swapchain");
  Check(factory->MakeWindowAssociation(window_, DXGI_MWA_NO_ALT_ENTER), "Window association");
  const char* shader =
    "Texture2D image:register(t0); SamplerState linearSampler:register(s0);"
    "struct V { float4 pos:SV_POSITION; float2 uv:TEXCOORD0; };"
    "V vs(uint id:SV_VertexID) { V v; v.uv=float2(id&1,id>>1); v.pos=float4(v.uv.x*2-1,1-v.uv.y*2,0,1); return v; }"
    "float4 ps(V v):SV_TARGET { return image.Sample(linearSampler,v.uv); }";
  ComPtr<ID3DBlob> vs, ps, error;
  Check(D3DCompile(shader, strlen(shader), nullptr, nullptr, nullptr, "vs", "vs_4_0", 0, 0, &vs, &error), "Compile vertex shader");
  Check(D3DCompile(shader, strlen(shader), nullptr, nullptr, nullptr, "ps", "ps_4_0", 0, 0, &ps, &error), "Compile pixel shader");
  Check(device_->CreateVertexShader(vs->GetBufferPointer(), vs->GetBufferSize(), nullptr, &vertex_), "Create vertex shader");
  Check(device_->CreatePixelShader(ps->GetBufferPointer(), ps->GetBufferSize(), nullptr, &pixel_), "Create pixel shader");
  D3D11_SAMPLER_DESC sampler{};
  sampler.Filter = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
  sampler.AddressU = sampler.AddressV = sampler.AddressW = D3D11_TEXTURE_ADDRESS_CLAMP;
  sampler.MaxLOD = D3D11_FLOAT32_MAX; sampler.ComparisonFunc = D3D11_COMPARISON_NEVER;
  Check(device_->CreateSamplerState(&sampler, &sampler_), "Create sampler");
  RECT rect{}; GetClientRect(window_, &rect); Resize(rect.right, rect.bottom);
  ShowWindow(window_, SW_SHOWNOACTIVATE);
  Present();
}
void Source::Resize(unsigned width, unsigned height) {
  if (!swapchain_ || !width || !height) return;
  context_->OMSetRenderTargets(0, nullptr, nullptr); target_.Reset();
  Check(swapchain_->ResizeBuffers(0, width, height, DXGI_FORMAT_UNKNOWN, 0), "Resize native buffers");
  ComPtr<ID3D11Texture2D> buffer;
  Check(swapchain_->GetBuffer(0, IID_PPV_ARGS(&buffer)), "Native backbuffer");
  Check(device_->CreateRenderTargetView(buffer.Get(), nullptr, &target_), "Native target");
  target_width = width; target_height = height;
  Present();
}
void Source::ResizeWindow(unsigned width, unsigned height) {
  if (!window_ || width<320 || width>1920 || height<240 || height>1200) throw std::runtime_error("Invalid test surface resize");
  if (!SetWindowPos(window_,nullptr,0,0,width,height,SWP_NOMOVE|SWP_NOZORDER|SWP_NOACTIVATE)) throw std::runtime_error("Native resize failed");
}
void Source::Present() {
  if (!target_) return;
  const auto frame = Snapshot(); if (!frame) return;
  ComPtr<ID3D11ShaderResourceView> image;
  Check(device_->CreateShaderResourceView(frame->texture.Get(), nullptr, &image), "Surface source view");
  const float scale = (std::min)(target_width / 1280.f, target_height / 720.f);
  D3D11_VIEWPORT viewport{(target_width - 1280 * scale) / 2, (target_height - 720 * scale) / 2,
    1280 * scale, 720 * scale, 0, 1};
  const float black[]{0, 0, 0, 1};
  context_->ClearRenderTargetView(target_.Get(), black);
  ID3D11RenderTargetView* targets[]{target_.Get()}; context_->OMSetRenderTargets(1, targets, nullptr);
  context_->RSSetViewports(1, &viewport); context_->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLESTRIP);
  context_->VSSetShader(vertex_.Get(), nullptr, 0); context_->PSSetShader(pixel_.Get(), nullptr, 0);
  ID3D11ShaderResourceView* views[]{image.Get()}; ID3D11SamplerState* samplers[]{sampler_.Get()};
  context_->PSSetShaderResources(0, 1, views); context_->PSSetSamplers(0, 1, samplers); context_->Draw(4, 0);
  ID3D11ShaderResourceView* empty[]{nullptr}; context_->PSSetShaderResources(0, 1, empty);
  Check(swapchain_->Present(1, 0), "Native surface Present");
}
void Source::CloseSurface() {
  if (window_) { SetWindowLongPtrW(window_, GWLP_USERDATA, 0); DestroyWindow(window_); window_ = nullptr; }
  target_.Reset(); swapchain_.Reset();
}
void Source::SaveCapture(const std::wstring& path, bool native_surface) {
  ComPtr<ID3D11Texture2D> input;
  if (native_surface) {
    if (!swapchain_) throw std::runtime_error("No native surface to capture");
    Present(); Check(swapchain_->GetBuffer(0, IID_PPV_ARGS(&input)), "Capture native backbuffer");
  } else { input = Snapshot()->texture; }
  D3D11_TEXTURE2D_DESC desc{}; input->GetDesc(&desc);
  desc.Usage = D3D11_USAGE_STAGING; desc.BindFlags = 0; desc.MiscFlags = 0; desc.CPUAccessFlags = D3D11_CPU_ACCESS_READ;
  ComPtr<ID3D11Texture2D> staging;
  Check(device_->CreateTexture2D(&desc, nullptr, &staging), "Capture staging texture");
  context_->CopyResource(staging.Get(), input.Get());
  D3D11_MAPPED_SUBRESOURCE pixels{};
  Check(context_->Map(staging.Get(), 0, D3D11_MAP_READ, 0, &pixels), "Capture GPU readback");
  struct Unmap { ID3D11DeviceContext* context; ID3D11Texture2D* texture; ~Unmap(){context->Unmap(texture,0);} } unmap{context_.Get(),staging.Get()};
  ComPtr<IWICImagingFactory> factory;
  Check(CoCreateInstance(CLSID_WICImagingFactory, nullptr, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(&factory)), "WIC capture factory");
  ComPtr<IWICStream> stream; Check(factory->CreateStream(&stream), "WIC stream");
  Check(stream->InitializeFromFilename(path.c_str(), GENERIC_WRITE), "Capture file");
  ComPtr<IWICBitmapEncoder> encoder;
  Check(factory->CreateEncoder(GUID_ContainerFormatPng, nullptr, &encoder), "PNG encoder");
  Check(encoder->Initialize(stream.Get(), WICBitmapEncoderNoCache), "PNG initialize");
  ComPtr<IWICBitmapFrameEncode> frame; ComPtr<IPropertyBag2> options;
  Check(encoder->CreateNewFrame(&frame,&options), "PNG frame"); Check(frame->Initialize(options.Get()), "PNG frame initialize");
  Check(frame->SetSize(desc.Width,desc.Height), "PNG dimensions");
  auto format=GUID_WICPixelFormat32bppBGRA; Check(frame->SetPixelFormat(&format), "PNG pixel format");
  if(format!=GUID_WICPixelFormat32bppBGRA) throw std::runtime_error("Unexpected capture encoder format");
  Check(frame->WritePixels(desc.Height,pixels.RowPitch,pixels.RowPitch*desc.Height,static_cast<BYTE*>(pixels.pData)), "PNG pixels");
  Check(frame->Commit(), "PNG frame commit"); Check(encoder->Commit(), "PNG commit");
}
LRESULT CALLBACK Source::WindowProc(HWND hwnd, UINT message, WPARAM wp, LPARAM lp) {
  Source* self = reinterpret_cast<Source*>(GetWindowLongPtrW(hwnd, GWLP_USERDATA));
  if (message == WM_NCCREATE) {
    self = static_cast<Source*>(reinterpret_cast<CREATESTRUCTW*>(lp)->lpCreateParams);
    SetWindowLongPtrW(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(self));
  }
  try {
    if (self && message == WM_SIZE) { self->Resize(LOWORD(lp), HIWORD(lp)); return 0; }
    if (self && message == WM_PAINT) {
      PAINTSTRUCT ps{}; BeginPaint(hwnd, &ps);
      try { self->Present(); } catch (...) { EndPaint(hwnd, &ps); throw; }
      EndPaint(hwnd, &ps); return 0;
    }
    // Owned surface closes through the panel's resource barrier.
    if (self && message == WM_CLOSE) { ShowWindow(hwnd, SW_HIDE); return 0; }
    if (self && message == WM_DPICHANGED) {
      const auto* rect = reinterpret_cast<RECT*>(lp);
      SetWindowPos(hwnd, nullptr, rect->left, rect->top, rect->right - rect->left, rect->bottom - rect->top, SWP_NOZORDER); return 0;
    }
  } catch (const std::exception& error) { OutputDebugStringA(error.what()); }
  return DefWindowProcW(hwnd, message, wp, lp);
}
}
