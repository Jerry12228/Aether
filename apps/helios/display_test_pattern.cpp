#include "display_registry.h"
#include <windows.h>
#include <atomic>
#include <thread>
namespace aether::vdisplay {
namespace {
struct Pattern{std::wstring title;unsigned index;};
std::atomic<bool> patternStop=false;
BOOL WINAPI PatternControl(DWORD signal){if(signal==CTRL_C_EVENT||signal==CTRL_BREAK_EVENT){patternStop=true;return TRUE;}return FALSE;}
LRESULT CALLBACK PatternWindow(HWND window,UINT message,WPARAM wparam,LPARAM lparam){
 if(message==WM_NCCREATE){auto* create=reinterpret_cast<CREATESTRUCTW*>(lparam);SetWindowLongPtrW(window,GWLP_USERDATA,reinterpret_cast<LONG_PTR>(create->lpCreateParams));}
 if(message==WM_PAINT){auto* pattern=reinterpret_cast<Pattern*>(GetWindowLongPtrW(window,GWLP_USERDATA));PAINTSTRUCT paint{};auto dc=BeginPaint(window,&paint);RECT rect{};GetClientRect(window,&rect);const COLORREF colors[]={RGB(30,75,150),RGB(110,45,110),RGB(20,100,65),RGB(145,80,15)};auto brush=CreateSolidBrush(colors[pattern?pattern->index%4:0]);FillRect(dc,&rect,brush);DeleteObject(brush);SetTextColor(dc,RGB(255,255,255));SetBkMode(dc,TRANSPARENT);if(pattern){auto hatch=CreateHatchBrush(static_cast<int>(pattern->index%6),RGB(180,180,180));RECT stripe=rect;stripe.top=rect.bottom/2;FillRect(dc,&stripe,hatch);DeleteObject(hatch);RECT text=rect;text.left+=30;text.top+=30;DrawTextW(dc,pattern->title.c_str(),-1,&text,DT_LEFT|DT_TOP|DT_WORDBREAK|DT_NOPREFIX);}EndPaint(window,&paint);return 0;}
 if(message==WM_CLOSE){patternStop=true;DestroyWindow(window);return 0;}return DefWindowProcW(window,message,wparam,lparam);
}
std::wstring Label(const std::string& s){return std::wstring(s.begin(),s.end());} // Registered names and GUIDs are bounded ASCII.
}
Json RunDisplayTestPattern(const Json& group,bool contract,const std::string& fault){
 patternStop=false;const auto instance=GetModuleHandleW(nullptr);const auto className=L"AetherDisplayPattern-"+std::to_wstring(GetCurrentProcessId());WNDCLASSEXW type{};type.cbSize=sizeof(type);type.lpfnWndProc=PatternWindow;type.hInstance=instance;type.lpszClassName=className.c_str();type.hCursor=LoadCursorW(nullptr,MAKEINTRESOURCEW(32512));
 if(!RegisterClassExW(&type))throw DisplayError("failed","Cannot register owned pattern window class");
 std::vector<Pattern> patterns;std::vector<HWND> windows;patterns.reserve(group.at("slots").array().size());unsigned created=0,destroyed=0;bool controlInstalled=SetConsoleCtrlHandler(PatternControl,TRUE)!=FALSE;
 struct Cleanup{std::vector<HWND>& windows;HINSTANCE instance;const wchar_t* cls;bool control;~Cleanup(){for(auto h:windows)if(IsWindow(h))DestroyWindow(h);if(control)SetConsoleCtrlHandler(PatternControl,FALSE);UnregisterClassW(cls,instance);}}cleanup{windows,instance,className.c_str(),controlInstalled};
 if(!controlInstalled)throw DisplayError("failed","Cannot install pattern Ctrl+C cleanup handler");
 for(const auto& s:group.at("slots").array()){
  const auto& mode=s.at("lastSuccess");patterns.push_back({Label("Group "+group.at("groupName").str()+"\nGroup ID "+group.at("groupId").str()+"\nSlot "+std::to_string(s.at("slot").number())+"\nSlot ID "+s.at("slotId").str()+"\nClose this window or press Ctrl+C to end patterns."),static_cast<unsigned>(s.at("slot").number())});
  HWND window=CreateWindowExW(WS_EX_TOOLWINDOW,className.c_str(),patterns.back().title.c_str(),WS_POPUP|WS_BORDER,static_cast<int>(mode.at("x").number()),static_cast<int>(mode.at("y").number()),static_cast<int>(mode.at("width").number()),static_cast<int>(mode.at("height").number()),nullptr,nullptr,instance,&patterns.back());if(!window)throw DisplayError("failed","Cannot create owned slot pattern window");windows.push_back(window);++created;
#ifdef AETHER_ENABLE_TEST_HOOKS
  if(!contract)ShowWindow(window,SW_SHOWNOACTIVATE);
#else
  (void)contract;ShowWindow(window,SW_SHOWNOACTIVATE);
#endif
  UpdateWindow(window);
 }
 const auto began=std::chrono::steady_clock::now();while(!patternStop){MSG message{};while(PeekMessageW(&message,nullptr,0,0,PM_REMOVE)){if(message.message==WM_QUIT)patternStop=true;TranslateMessage(&message);DispatchMessageW(&message);}
#ifdef AETHER_ENABLE_TEST_HOOKS
  if(contract&&fault=="pattern-auto-close"&&std::chrono::steady_clock::now()-began>std::chrono::milliseconds(80)&&!windows.empty())PostMessageW(windows.front(),WM_CLOSE,0,0);
#else
  (void)fault;
#endif
  MsgWaitForMultipleObjects(0,nullptr,FALSE,10,QS_ALLINPUT);
 }
 for(auto h:windows){if(IsWindow(h))DestroyWindow(h);if(!IsWindow(h))++destroyed;}
 return Json::Object{{"schemaVersion",1},{"status",created==destroyed?"ok":"failed"},{"reason","Only this command's HWND/GDI resources released; persistent displays untouched"},{"evidenceScope",contract?"contract":"machine-observation"},{"windowsCreated",created},{"windowsDestroyed",destroyed},{"windowsRemaining",created-destroyed},{"groupId",group.at("groupId")}};
}
}
