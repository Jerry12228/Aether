#pragma once
#include <flutter/method_channel.h>
#include <flutter/encodable_value.h>
#include <flutter/plugin_registrar_windows.h>
#include <flutter/texture_registrar.h>
#include <aether/presentation.h>
#include <memory>
namespace selene_native {
struct RenderState;
class SeleneNativePlugin : public flutter::Plugin {
 public:
  static void RegisterWithRegistrar(flutter::PluginRegistrarWindows* registrar);
  explicit SeleneNativePlugin(flutter::PluginRegistrarWindows* registrar);
  ~SeleneNativePlugin() override;
  void HandleMethodCall(const flutter::MethodCall<flutter::EncodableValue>& call,
    std::unique_ptr<flutter::MethodResult<flutter::EncodableValue>> result);
 private:
  flutter::EncodableMap Diagnostics() const;
  void BeginStop(std::unique_ptr<flutter::MethodResult<flutter::EncodableValue>> result);
  void PollStop();
  flutter::PluginRegistrarWindows* registrar_;
  HWND owner_;
  int delegate_;
  std::shared_ptr<RenderState> state_;
  std::unique_ptr<flutter::MethodResult<flutter::EncodableValue>> pending_;
  ULONGLONG stop_started_ = 0;
  std::string fault_;
  std::string stop_error_;
  uint64_t generation_ = 0;
};
}
