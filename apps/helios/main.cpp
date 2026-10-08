#include "aether/core.h"
#include <windows.h>
#include <conio.h>
#include <atomic>
#include <chrono>
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <string>
#include <thread>
namespace {
std::mutex mutex;
std::condition_variable cv;
bool terminal=false;
std::atomic<bool> shutdown_requested{false};
std::atomic<bool> signal_received{false};
void event(uint64_t,uint64_t,uint32_t kind,int32_t,uint64_t){
 std::lock_guard lock(mutex); if(kind==AETHER_TERMINAL)terminal=true; cv.notify_all();
}
BOOL WINAPI control(DWORD kind) {
 if(kind==CTRL_C_EVENT || kind==CTRL_BREAK_EVENT) {
  signal_received.store(true); shutdown_requested.store(true); return TRUE;
 }
 return FALSE;
}
int Finish(int code, bool automation) {
 DWORD input_mode=0,output_mode=0;
 const bool interactive=GetConsoleMode(GetStdHandle(STD_INPUT_HANDLE),&input_mode) && GetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE),&output_mode);
 std::cout << "result=" << (code==0?"PASS":"FAIL") << " exit=" << code << std::endl;
 if(!automation && interactive) { std::cout<<"Press any key to exit."<<std::endl; (void)_getch(); }
 return code;
}
}
int main(int argc,char** argv) {
 bool self_test=false,automation=false,init_error=false;
 std::string ready_event;
 for(int i=1;i<argc;i++) {
  const std::string arg=argv[i];
  if(arg=="--self-test")self_test=true;
  else if(arg=="--automation")automation=true;
#ifdef AETHER_ENABLE_TEST_HOOKS
  else if(arg=="--test-init-error")init_error=true;
  else if(arg=="--test-ready-event" && i+1<argc)ready_event=argv[++i];
#endif
  else {std::cerr<<"Unknown argument\n";return 2;}
 }
 char version[128]{};uint32_t required=0;
 if(aether_core_version(1,version,sizeof(version),&required)!=AETHER_OK)return Finish(1,automation);
 std::cout<<"Helios "<<version<<" ABI 1"<<std::endl;
 if(!SetConsoleCtrlHandler(control,TRUE)) {std::cerr<<"control handler failed\n";return Finish(1,automation);}
 AetherConfig config{1,sizeof(AetherConfig),init_error?1u:0u,0}; uint64_t token=0,operation=0,final=0;
 const auto created=aether_core_create(&config,event,&token);
 if(created!=AETHER_OK){std::cerr<<"init code="<<created<<std::endl;return Finish(1,automation);}
 AetherCapabilities capability{1,sizeof(AetherCapabilities)};
 aether_core_capabilities(1,&capability);
 std::cout<<"initialized local_core token="<<token<<" capability="<<capability.capability_bits<<std::endl;
 if(!ready_event.empty()) { const auto ready=OpenEventA(EVENT_MODIFY_STATE,FALSE,ready_event.c_str()); if(!ready) return Finish(1,automation); SetEvent(ready);CloseHandle(ready); }
 bool work_passed=true;
 if(self_test) {
  const auto started=aether_core_start_probe(token,1,0,&operation);
  std::unique_lock lock(mutex); work_passed=started==AETHER_OK&&cv.wait_for(lock,std::chrono::seconds(2),[]{return terminal;});
 } else {
  std::cout<<"foreground waiting; Ctrl+C requests local cleanup"<<std::endl;
  while(!shutdown_requested.load())std::this_thread::sleep_for(std::chrono::milliseconds(10));
 }
 const auto began=std::chrono::steady_clock::now();
 const auto stopped=aether_core_stop(token,&final);
 const auto ack=stopped==AETHER_OK?aether_core_ack(token,final):AETHER_TIMEOUT;
 const auto destroyed=ack==AETHER_OK?aether_core_destroy(token):AETHER_BUSY;
 AetherStats stats{1,sizeof(AetherStats)};
 const bool passed=work_passed&&destroyed==AETHER_OK&&aether_core_stats(0,&stats)==AETHER_OK&&stats.live_handles==0&&stats.live_threads==0;
 std::cout<<"cleanup handles="<<stats.live_handles<<" threads="<<stats.live_threads<<" stop="<<stopped<<" ack="<<ack<<" destroy="<<destroyed
  <<" final_sequence="<<final<<" signal_received="<<signal_received.load()<<" duration_ms="<<std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now()-began).count()<<std::endl;
 if(stopped==AETHER_TIMEOUT)std::cerr<<"Cleanup timeout: native producer references retained until process teardown\n";
 return Finish(passed?0:1,automation);
}
