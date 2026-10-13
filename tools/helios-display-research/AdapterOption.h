// Independently authored Aether research GPU selector.
#pragma once
#include <dxgi.h>
#include <wrl/client.h>
#include <cwchar>

class AdapterOption {
public:
    LUID adapterLuid{};
    bool hasTargetAdapter = false;

    void selectGPU(const wchar_t* requestedName) {
        adapterLuid = {};
        hasTargetAdapter = false;
        Microsoft::WRL::ComPtr<IDXGIFactory1> factory;
        if (FAILED(CreateDXGIFactory1(IID_PPV_ARGS(&factory)))) return;
        SIZE_T bestMemory = 0;
        for (UINT ordinal = 0; ; ++ordinal) {
            Microsoft::WRL::ComPtr<IDXGIAdapter1> adapter;
            if (FAILED(factory->EnumAdapters1(ordinal, &adapter))) break;
            DXGI_ADAPTER_DESC1 description{};
            if (FAILED(adapter->GetDesc1(&description))) continue;
            if (description.Flags & DXGI_ADAPTER_FLAG_SOFTWARE) continue;
            if (requestedName && _wcsicmp(requestedName, description.Description) == 0) {
                adapterLuid = description.AdapterLuid;
                hasTargetAdapter = true;
                return;
            }
            if (!hasTargetAdapter || description.DedicatedVideoMemory > bestMemory) {
                adapterLuid = description.AdapterLuid;
                hasTargetAdapter = true;
                bestMemory = description.DedicatedVideoMemory;
            }
        }
    }
};
