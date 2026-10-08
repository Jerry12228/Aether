#include "aether/core.h"
#include <chrono>
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <string>
namespace {
std::mutex mutex;
std::condition_variable cv;
bool terminal=false;
uint64_t acknowledged=0;
void event(uint64_t,uint64_t seq,uint32_t kind,int32_t,uint64_t){
 std::lock_guard lock(mutex);acknowledged=seq;if(kind==AETHER_TERMINAL)terminal=true;cv.notify_all();
}
}
int main(int argc,char** argv) {
 bool self_test=false,automation=false;
 for(int i=1;i<argc;i++){
  const std::string arg=argv[i];
  if(arg=="--self-test")self_test=true;
  else if(arg=="--automation")automation=true;
  else {std::cerr<<"Unknown argument\n";return 2;}
 }
 char version[128]{};uint32_t required=0;
 if(aether_core_version(1,version,sizeof(version),&required)!=AETHER_OK)return 1;
 std::cout<<"Helios "<<version<<" ABI 1\n";
 if(!self_test){std::cerr<<"Foreground lifecycle is pending plan 02-02; use --self-test --automation.\n";return 2;}
 AetherConfig config{1,sizeof(AetherConfig),0,0};uint64_t token=0,operation=0,final=0;
 if(aether_core_create(&config,event,&token)!=AETHER_OK)return 1;
 const auto started=aether_core_start_probe(token,1,0,&operation);
 bool delivered=false;
 {std::unique_lock lock(mutex);if(started==AETHER_OK)delivered=cv.wait_for(lock,std::chrono::seconds(2),[]{return terminal;});}
 const auto stopped=aether_core_stop(token,&final);
 const auto ack=stopped==AETHER_OK?aether_core_ack(token,final):AETHER_TIMEOUT;
 const auto destroyed=ack==AETHER_OK?aether_core_destroy(token):AETHER_BUSY;
 AetherStats stats{1,sizeof(AetherStats)};
 const bool passed=delivered&&destroyed==AETHER_OK&&aether_core_stats(0,&stats)==AETHER_OK&&stats.live_handles==0&&stats.live_threads==0;
 std::cout<<(passed?"PASS":"FAIL")<<" self-test handles="<<stats.live_handles<<" threads="<<stats.live_threads<<" final_sequence="<<final<<"\n";
 if(!automation){std::cout<<"Press Enter to exit.\n";std::cin.get();}
 return passed?0:1;
}
