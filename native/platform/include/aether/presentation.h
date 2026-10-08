#pragma once
// Windows GPU ownership is deliberately outside the portable core ABI.
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#include <d3d11.h>
#include <wrl/client.h>
#include <atomic>
#include <memory>
#include <mutex>
#include <string>

namespace aether::presentation {
enum class Pattern { color_bars, grid, text };
struct Frame {
  Microsoft::WRL::ComPtr<ID3D11Texture2D> texture;
  HANDLE shared_handle = nullptr;
};
class Source {
 public:
  explicit Source(IDXGIAdapter* adapter = nullptr);
  ~Source();
  void Draw(Pattern pattern);
  std::shared_ptr<Frame> Snapshot();
  void OpenSurface(HWND owner);
  void CloseSurface();
  void Resize(unsigned width, unsigned height);
  void ResizeWindow(unsigned width, unsigned height);
  void Present();
  void SaveCapture(const std::wstring& path, bool native_surface);
  std::string adapter;
  bool software_adapter = false;
  unsigned target_width = 0, target_height = 0;
  static std::atomic<unsigned> live_sources;
 private:
  static LRESULT CALLBACK WindowProc(HWND, UINT, WPARAM, LPARAM);
  Microsoft::WRL::ComPtr<ID3D11Device> device_;
  Microsoft::WRL::ComPtr<ID3D11DeviceContext> context_;
  Microsoft::WRL::ComPtr<IDXGISwapChain> swapchain_;
  Microsoft::WRL::ComPtr<ID3D11RenderTargetView> target_;
  Microsoft::WRL::ComPtr<ID3D11VertexShader> vertex_;
  Microsoft::WRL::ComPtr<ID3D11PixelShader> pixel_;
  Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler_;
  std::mutex mutex_;
  std::shared_ptr<Frame> frame_;
  HWND window_ = nullptr;
};
}
