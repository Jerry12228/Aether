// Independently authored registry reader for the dedicated research driver.
// Distributed with the standalone driver under the accompanying MS-PL.
void LoadSettings() {
 HKEY settings = nullptr;
 const auto opened = RegOpenKeyExW(HKEY_LOCAL_MACHINE,
  L"SOFTWARE\\Aether\\HeliosDisplay", 0, KEY_QUERY_VALUE, &settings);
 if (opened != ERROR_SUCCESS) { return; }
 struct SettingsLifetime {
  HKEY handle;
  ~SettingsLifetime() { if (handle) { RegCloseKey(handle); } }
 } lifetime{settings};
 const auto dword = [&](const wchar_t* name, DWORD fallback) {
  DWORD result = fallback;
  DWORD bytes = sizeof(result);
  const auto status = RegGetValueW(settings, nullptr, name, RRF_RT_REG_DWORD,
   nullptr, &result, &bytes);
  return status == ERROR_SUCCESS && bytes == sizeof(result) ? result : fallback;
 };
 wchar_t requestedGpu[128]{};
 DWORD stringBytes = sizeof(requestedGpu);
 const auto stringStatus = RegGetValueW(settings, nullptr, L"gpuName", RRF_RT_REG_SZ,
  nullptr, requestedGpu, &stringBytes);
 if (stringStatus == ERROR_SUCCESS && stringBytes >= sizeof(wchar_t) &&
     stringBytes <= sizeof(requestedGpu) && stringBytes % sizeof(wchar_t) == 0 &&
     requestedGpu[stringBytes / sizeof(wchar_t) - 1] == L'\0') {
  AdapterOption selected;
  selected.selectGPU(requestedGpu);
  preferredAdapterLuid = selected.adapterLuid;
  preferredAdapterChanged = selected.hasTargetAdapter;
 }
 testMode = dword(L"testMode", 0) != 0;
 watchdogTimeout = dword(L"watchdog", 0);
 const DWORD capacity = dword(L"maxMonitors", MaxVirtualMonitorCount);
 // An explicit invalid setting fails visibly and retains the safe research default.
 if (capacity >= 7 && capacity <= 64) { MaxVirtualMonitorCount = capacity; }
 else { std::cerr << "Helios research maxMonitors must be between 7 and 64" << std::endl; }
 if (dword(L"sdrBits", 8) == 10) { SDRBITS = IDDCX_BITS_PER_COMPONENT_10; }
 if (dword(L"hdrBits", 10) == 12) { HDRBITS = IDDCX_BITS_PER_COMPONENT_12; }
}
