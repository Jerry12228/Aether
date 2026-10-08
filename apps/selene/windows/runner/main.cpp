#include <flutter/dart_project.h>
#include <flutter/flutter_view_controller.h>
#include <windows.h>
#include <aether/core.h>
#include <aether_version.h>
#include <string>

#include "flutter_window.h"
#include "utils.h"

int APIENTRY wWinMain(_In_ HINSTANCE instance, _In_opt_ HINSTANCE prev,
                      _In_ wchar_t *command_line, _In_ int show_command) {
  // Attach to console when present (e.g., 'flutter run') or create a
  // new console when running with a debugger.
  if (!::AttachConsole(ATTACH_PARENT_PROCESS) && ::IsDebuggerPresent()) {
    CreateAndAttachConsole();
  }

  // Initialize COM, so that it is available for use in the library and/or
  // plugins.
  ::CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED);

  flutter::DartProject project(L"data");

  std::vector<std::string> command_line_arguments =
      GetCommandLineArguments();
  if (command_line_arguments.size()==1 && command_line_arguments[0]=="--version") {
    wchar_t executable[32768]{};
    const auto length=GetModuleFileNameW(nullptr,executable,32768);
    if(!length || length>=32768)return EXIT_FAILURE;
    const std::wstring full(executable);
    const auto library_path=full.substr(0,full.find_last_of(L"\\/")+1)+L"aether_core.dll";
    const auto library=LoadLibraryExW(library_path.c_str(),nullptr,LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR|LOAD_LIBRARY_SEARCH_DEFAULT_DIRS);
    if(!library)return EXIT_FAILURE;
    const auto query=reinterpret_cast<decltype(&aether_core_version)>(GetProcAddress(library,"aether_core_version"));
    char version[128]{};uint32_t required=0;
    const bool valid=query && query(AETHER_ABI_VERSION,version,sizeof(version),&required)==AETHER_OK && std::string(version)==AETHER_PRODUCT_VERSION;
    if(valid){const auto text=std::string("Selene ")+version+" ABI "+std::to_string(AETHER_ABI_VERSION)+"\n";DWORD written=0;WriteFile(GetStdHandle(STD_OUTPUT_HANDLE),text.data(),static_cast<DWORD>(text.size()),&written,nullptr);}
    FreeLibrary(library);CoUninitialize();return valid?EXIT_SUCCESS:EXIT_FAILURE;
  }

  project.set_dart_entrypoint_arguments(std::move(command_line_arguments));

  FlutterWindow window(project);
  Win32Window::Point origin(10, 10);
  Win32Window::Size size(1280, 720);
  if (!window.Create(L"selene", origin, size)) {
    return EXIT_FAILURE;
  }
  window.SetQuitOnClose(true);

  ::MSG msg;
  while (::GetMessage(&msg, nullptr, 0, 0)) {
    ::TranslateMessage(&msg);
    ::DispatchMessage(&msg);
  }

  ::CoUninitialize();
  return EXIT_SUCCESS;
}
