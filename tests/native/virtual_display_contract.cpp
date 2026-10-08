#include <windows.h>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#if __has_include("aether/virtual_display.h")
#include "aether/virtual_display.h"
#define HAS_DISPLAY_CONTRACT 1
#endif
#ifdef HAS_DISPLAY_CONTRACT
bool RunContractTests(){
 using namespace aether::vdisplay;
 struct Fake:DisplayBackend {uint32_t code=ERROR_SUCCESS,calls=0,races=0;uint32_t Read(DisplayResult& r,DisplayDeadline)override{++calls;if(calls<=races)return ERROR_INSUFFICIENT_BUFFER;r.osEnumeration=true;return code;}};
 const auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(1);
 Fake denied;denied.code=ERROR_ACCESS_DENIED;DisplayProvider p(denied);auto r=p.Probe(deadline);
 if(r.status!="access_denied" || r.osError!=ERROR_ACCESS_DENIED || denied.calls!=1)return false;
 Fake race;race.races=2;DisplayProvider q(race);r=q.Enumerate(deadline);if(r.status!="ok" || r.attempts!=3)return false;
 Fake endless;endless.races=9;DisplayProvider e(endless);r=e.Enumerate(deadline);if(r.status!="unknown" || endless.calls!=3)return false;
 Fake expired;DisplayProvider x(expired);if(x.Enumerate(std::chrono::steady_clock::now()).status!="timeout" || expired.calls!=0)return false;
 Fake unknown;unknown.code=ERROR_GEN_FAILURE;DisplayProvider u(unknown);if(u.Probe(deadline).status!="unknown")return false;
 Fake absent;DisplayProvider a(absent);if(a.Probe(deadline).status!="no_known_provider_detected")return false;
 if(a.CreateSlot({},deadline).status!="not_admitted" || a.UpdateSlot({}, {},deadline).status!="not_admitted" || a.RemoveSlot({},deadline).status!="not_admitted")return false;
 return ToJson(r,"quote\"\n\\").find("quote\\\"\\n\\\\")!=std::string::npos;
}
#endif
int main(int argc, char** argv) {
 if(argc!=2)return 2;
 std::string baseline;
 for(const bool probe:{false,true,false}){
 const auto log=std::filesystem::temp_directory_path()/("aether-display-"+std::to_string(GetCurrentProcessId())+".json");
 SECURITY_ATTRIBUTES sa{sizeof(sa),nullptr,TRUE};
 const auto out=CreateFileW(log.c_str(),GENERIC_WRITE,FILE_SHARE_READ,&sa,CREATE_ALWAYS,FILE_ATTRIBUTE_NORMAL,nullptr);
 if(out==INVALID_HANDLE_VALUE)return 2;
 STARTUPINFOA si{};si.cb=sizeof(si);si.dwFlags=STARTF_USESTDHANDLES;si.hStdOutput=out;si.hStdError=out;
 si.hStdInput=GetStdHandle(STD_INPUT_HANDLE);
 PROCESS_INFORMATION pi{};std::string cmd="\""+std::string(argv[1])+"\" vdisplay "+(probe?"driver check":"query")+" --json";
 const auto began=GetTickCount64();
 const bool launched=CreateProcessA(nullptr,cmd.data(),nullptr,nullptr,TRUE,CREATE_NO_WINDOW,nullptr,nullptr,&si,&pi)!=FALSE;
 CloseHandle(out);if(!launched)return 2;
 if(WaitForSingleObject(pi.hProcess,9000)!=WAIT_OBJECT_0){TerminateProcess(pi.hProcess,2);CloseHandle(pi.hThread);CloseHandle(pi.hProcess);return 2;}
 DWORD code=2;GetExitCodeProcess(pi.hProcess,&code);CloseHandle(pi.hThread);CloseHandle(pi.hProcess);
 std::ifstream stream(log);const std::string json((std::istreambuf_iterator<char>(stream)),{});stream.close();std::filesystem::remove(log);
 if(code!=(probe?1u:0u) || json.find("\"osEnumeration\":true")==std::string::npos || json.find("Press any key")!=std::string::npos || GetTickCount64()-began>=9000 || (probe && json.find("\"providerStatus\":\"not_admitted\"")==std::string::npos)){
  std::cerr<<"FAIL actual Helios read-only tracer: expected query exit 0, real OS enumeration, no wait; exit="<<code<<" output="<<json;return 1;
 }
 const auto actual=json.find("\"actual\":");const auto end=json.find(",\"logPath\":");
 if(actual==std::string::npos || end==std::string::npos)return 1;
 const auto reality=json.substr(actual,end-actual);
 if(baseline.empty())baseline=reality;else if(reality!=baseline){std::cerr<<"FAIL observed display/device state changed across read-only CLI calls\n";return 1;}
 }
#ifdef HAS_DISPLAY_CONTRACT
 if(!RunContractTests()){std::cerr<<"FAIL injected display contract\n";return 1;}
#else
 std::cerr<<"FAIL native display contract unavailable\n";return 1;
#endif
 std::cout<<"PASS actual Helios read-only tracer and injected display contract\n";return 0;
}
