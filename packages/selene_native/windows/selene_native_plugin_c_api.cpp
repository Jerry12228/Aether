#include "include/selene_native/selene_native_plugin_c_api.h"

#include <flutter/plugin_registrar_windows.h>

#include "selene_native_plugin.h"

void SeleneNativePluginCApiRegisterWithRegistrar(
    FlutterDesktopPluginRegistrarRef registrar) {
  selene_native::SeleneNativePlugin::RegisterWithRegistrar(
      flutter::PluginRegistrarManager::GetInstance()
          ->GetRegistrar<flutter::PluginRegistrarWindows>(registrar));
}
