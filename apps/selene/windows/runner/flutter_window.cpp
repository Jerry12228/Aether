#include "flutter_window.h"

#include <optional>
#include <flutter/standard_method_codec.h>

#include "flutter/generated_plugin_registrant.h"

FlutterWindow::FlutterWindow(const flutter::DartProject& project)
    : project_(project) {}

FlutterWindow::~FlutterWindow() {}

bool FlutterWindow::OnCreate() {
  if (!Win32Window::OnCreate()) {
    return false;
  }

  RECT frame = GetClientArea();

  // The size here must match the window dimensions to avoid unnecessary surface
  // creation / destruction in the startup path.
  flutter_controller_ = std::make_unique<flutter::FlutterViewController>(
      frame.right - frame.left, frame.bottom - frame.top, project_);
  // Ensure that basic setup of the controller was successful.
  if (!flutter_controller_->engine() || !flutter_controller_->view()) {
    return false;
  }
  RegisterPlugins(flutter_controller_->engine());
  close_channel_ = std::make_unique<flutter::MethodChannel<flutter::EncodableValue>>(
    flutter_controller_->engine()->messenger(), "aether/window", &flutter::StandardMethodCodec::GetInstance());
  close_channel_->SetMethodCallHandler([this](const auto& call, auto result) {
#ifdef AETHER_ENABLE_TEST_HOOKS
    if (call.method_name() == "test_close" && GetEnvironmentVariableW(L"AETHER_TEST_FAULTS", nullptr, 0)) {
      result->Success(); PostMessage(GetHandle(), WM_CLOSE, 0, 0); return;
    }
#endif
    if (call.method_name() == "close_ready" && close_requested_) {
      result->Success(); KillTimer(GetHandle(), 0xAE7203);
      PostMessage(GetHandle(), WM_APP + 203, 0, 0);
    } else { result->NotImplemented(); }
  });
  SetChildContent(flutter_controller_->view()->GetNativeWindow());

  flutter_controller_->engine()->SetNextFrameCallback([&]() {
    this->Show();
  });

  // Flutter can complete the first frame before the "show window" callback is
  // registered. The following call ensures a frame is pending to ensure the
  // window is shown. It is a no-op if the first frame hasn't completed yet.
  flutter_controller_->ForceRedraw();

  return true;
}

void FlutterWindow::OnDestroy() {
  close_channel_.reset();
  if (flutter_controller_) {
    flutter_controller_ = nullptr;
  }

  Win32Window::OnDestroy();
}

LRESULT
FlutterWindow::MessageHandler(HWND hwnd, UINT const message,
                              WPARAM const wparam,
                              LPARAM const lparam) noexcept {
  // Give Flutter, including plugins, an opportunity to handle window messages.
  if (flutter_controller_) {
    std::optional<LRESULT> result =
        flutter_controller_->HandleTopLevelWindowProc(hwnd, message, wparam,
                                                      lparam);
    if (result) {
      return *result;
    }
  }

  switch (message) {
    case WM_CLOSE:
      if (!close_requested_) {
        close_requested_ = true;
        SetTimer(hwnd, 0xAE7203, 5000, nullptr);
        close_channel_->InvokeMethod("close_requested", nullptr);
      }
      return 0;
    case WM_APP + 203:
      DestroyWindow(hwnd); return 0;
    case WM_TIMER:
      if (wparam == 0xAE7203) {
        OutputDebugStringA("Aether close budget exceeded 5 seconds; unsafe references retained until process teardown\n");
        KillTimer(hwnd, 0xAE7203); DestroyWindow(hwnd); return 0;
      }
      break;
    case WM_FONTCHANGE:
      flutter_controller_->engine()->ReloadSystemFonts();
      break;
  }

  return Win32Window::MessageHandler(hwnd, message, wparam, lparam);
}
