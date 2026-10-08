#include <aether/presentation.h>
#include <dxgi1_4.h>
#include <cstdio>
#include <exception>

int main() {
  using Microsoft::WRL::ComPtr;
  try {
    ComPtr<IDXGIFactory4> factory;
    if (FAILED(CreateDXGIFactory1(IID_PPV_ARGS(&factory)))) return 2;
    ComPtr<IDXGIAdapter> warp;
    if (FAILED(factory->EnumWarpAdapter(IID_PPV_ARGS(&warp)))) return 3;
    {
      aether::presentation::Source source(warp.Get());
      std::printf("actual WARP adapter=%s software=%d\n",source.adapter.c_str(),source.software_adapter);
      if (!source.software_adapter) {
        std::fprintf(stderr,"FAIL actual WARP source must be labeled software\n");
        return 1;
      }
      source.Draw(aether::presentation::Pattern::text);
      if (!source.Snapshot() || !source.Snapshot()->texture) return 4;
    }
    if (aether::presentation::Source::live_sources.load()!=0) return 5;
    std::puts("PASS actual software adapter classification, drawing and zero source cleanup");
    return 0;
  } catch(const std::exception& error) {
    std::fprintf(stderr,"FAIL %s\n",error.what());
    return 6;
  }
}
