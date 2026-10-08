#include <windows.h>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#if __has_include("aether/virtual_display.h")
#include "aether/virtual_display.h"
#define HAS_DISPLAY_CONTRACT 1
#endif
int main(int argc, char** argv) {
 if(argc!=2)return 2;
 const auto log=std::filesystem::temp_directory_path()/("aether-display-"+std::to_string(GetCurrentProcessId())+".json");
 SECURITY_ATTRIBUTES sa{sizeof(sa),nullptr,TRUE};
 const auto out=CreateFileW(log.c_str(),GENERIC_WRITE,FILE_SHARE_READ,&sa,CREATE_ALWAYS,FILE_ATTRIBUTE_NORMAL,nullptr);
 if(out==INVALID_HANDLE_VALUE)return 2;
 STARTUPINFOA si{};si.cb=sizeof(si);si.dwFlags=STARTF_USESTDHANDLES;si.hStdOutput=out;si.hStdError=out;
 si.hStdInput=GetStdHandle(STD_INPUT_HANDLE);
 PROCESS_INFORMATION pi{};std::string cmd="\""+std::string(argv[1])+"\" vdisplay query --json";
 const auto began=GetTickCount64();
 const bool launched=CreateProcessA(nullptr,cmd.data(),nullptr,nullptr,TRUE,CREATE_NO_WINDOW,nullptr,nullptr,&si,&pi)!=FALSE;
 CloseHandle(out);if(!launched)return 2;
 if(WaitForSingleObject(pi.hProcess,9000)!=WAIT_OBJECT_0){TerminateProcess(pi.hProcess,2);CloseHandle(pi.hThread);CloseHandle(pi.hProcess);return 2;}
 DWORD code=2;GetExitCodeProcess(pi.hProcess,&code);CloseHandle(pi.hThread);CloseHandle(pi.hProcess);
 std::ifstream stream(log);const std::string json((std::istreambuf_iterator<char>(stream)),{});stream.close();std::filesystem::remove(log);
 if(code!=0 || json.find("\"osEnumeration\":true")==std::string::npos || json.find("Press any key")!=std::string::npos || GetTickCount64()-began>=9000){
  std::cerr<<"FAIL actual Helios read-only tracer: expected query exit 0, real OS enumeration, no wait; exit="<<code<<" output="<<json;return 1;
 }
#ifdef HAS_DISPLAY_CONTRACT
 if(!aether::vdisplay::RunContractTests()){std::cerr<<"FAIL injected display contract\n";return 1;}
#else
 std::cerr<<"FAIL native display contract unavailable\n";return 1;
#endif
 std::cout<<"PASS actual Helios read-only tracer and injected display contract\n";return 0;
}
