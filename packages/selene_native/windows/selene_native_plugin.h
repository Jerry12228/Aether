#ifndef FLUTTER_PLUGIN_SELENE_NATIVE_PLUGIN_H_
#define FLUTTER_PLUGIN_SELENE_NATIVE_PLUGIN_H_

#include <flutter/method_channel.h>
#include <flutter/plugin_registrar_windows.h>

#include <memory>

namespace selene_native {

class SeleneNativePlugin : public flutter::Plugin {
 public:
  static void RegisterWithRegistrar(flutter::PluginRegistrarWindows *registrar);

  SeleneNativePlugin();

  virtual ~SeleneNativePlugin();

  // Disallow copy and assign.
  SeleneNativePlugin(const SeleneNativePlugin&) = delete;
  SeleneNativePlugin& operator=(const SeleneNativePlugin&) = delete;

  // Called when a method is called on this plugin's channel from Dart.
  void HandleMethodCall(
      const flutter::MethodCall<flutter::EncodableValue> &method_call,
      std::unique_ptr<flutter::MethodResult<flutter::EncodableValue>> result);
};

}  // namespace selene_native

#endif  // FLUTTER_PLUGIN_SELENE_NATIVE_PLUGIN_H_
