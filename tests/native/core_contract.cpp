#include "aether/core.h"
#include <iostream>
#include <stdexcept>
#include <chrono>
#include <condition_variable>
#include <mutex>
#include <vector>
#include <atomic>
#include <thread>
#include <map>
#include "aether/platform.h"
extern "C" int aether_c_consumer(void);
namespace {
std::mutex event_mutex;
std::condition_variable event_cv;
struct Event {uint64_t token,sequence;uint32_t kind;int32_t status;uint64_t operation,thread;};
std::vector<Event> events;
int checks=0;
void require(bool value,const char* message){++checks;if(!value)throw std::runtime_error(message);}
void event(uint64_t token,uint64_t seq,uint32_t kind,int32_t status,uint64_t op){
 std::lock_guard lock(event_mutex);events.push_back({token,seq,kind,status,op,aether_core_thread_id()});event_cv.notify_all();
}
void tracer(){
 require(aether_c_consumer()==1,"real C consumer links the exported DLL ABI");
 char version[128]{};uint32_t required=0;
 require(aether_core_version(1,version,sizeof(version),&required)==AETHER_OK,"version C consumer");
 require(std::string(version)=="0.1.0","single generated product version");
 AetherConfig config{1,sizeof(AetherConfig),0,0};uint64_t token=0;
 require(aether_core_create(&config,event,&token)==AETHER_OK&&token!=0,"create must initialize the real DLL and return a generation token");
 uint64_t op=0;
 require(aether_core_start_probe(token,50,0,&op)==AETHER_OK,"native worker accepted probe");
 require(aether_core_cancel(token,op)==AETHER_OK,"cancel accepted");
 {std::unique_lock lock(event_mutex);require(event_cv.wait_for(lock,std::chrono::seconds(2),[]{return events.size()>=2;}),"worker delivers terminal event");
 require(events.back().status==AETHER_CANCELLED,"terminal cancellation status");
 require(events.back().operation==op&&events.back().token==token,"scalar callback identity");
 require(events.back().thread!=aether_core_thread_id(),"callback on native dispatcher thread");}
 uint64_t final=0;
 require(aether_core_stop(token,&final)==AETHER_OK,"native stop barrier");
 require(final==2,"published sequence proof");
 require(aether_core_destroy(token)==AETHER_BUSY,"unacked callbacks cannot release ownership");
 require(aether_core_ack(token,final)==AETHER_OK,"consumer ACK through final sequence");
 require(aether_core_destroy(token)==AETHER_OK,"local release after barrier");
 AetherStats stats{1,sizeof(AetherStats)};
 require(aether_core_stats(0,&stats)==AETHER_OK&&stats.live_handles==0&&stats.live_threads==0,"resources return to zero");
}
uint64_t create(){AetherConfig config{1,sizeof(AetherConfig),0,0};uint64_t token=0;require(aether_core_create(&config,event,&token)==AETHER_OK,"create generation");return token;}
void cleanup(uint64_t token){uint64_t final=0;require(aether_core_stop(token,&final)==AETHER_OK,"bounded stop");require(aether_core_ack(token,final)==AETHER_OK,"drain ACK");require(aether_core_destroy(token)==AETHER_OK,"destroy");}
std::atomic<bool> slow_entered{false};
void slow_event(uint64_t token,uint64_t sequence,uint32_t kind,int32_t status,uint64_t op){
 if(!slow_entered.exchange(true))std::this_thread::sleep_for(std::chrono::milliseconds(2300));event(token,sequence,kind,status,op);
}
void lifecycle(){
 AetherConfig config{1,sizeof(AetherConfig),0,0};uint64_t token=0,id=0,final=0;uint32_t size=0;char tiny[2]{};
 require(aether_core_create(nullptr,event,&token)==AETHER_INVALID_ARGUMENT,"null config");
 config.abi_version=2;require(aether_core_create(&config,event,&token)==AETHER_ABI_MISMATCH,"wrong ABI");
 config.abi_version=1;config.struct_size=1;require(aether_core_create(&config,event,&token)==AETHER_INVALID_ARGUMENT,"small struct");
 config.struct_size=sizeof(config);config.flags=1;require(aether_core_create(&config,event,&token)==AETHER_INTERNAL_ERROR,"exception boundary");config.flags=0;
 require(aether_core_create(&config,nullptr,&token)==AETHER_INVALID_ARGUMENT,"null callback");
 require(aether_core_create(&config,event,nullptr)==AETHER_INVALID_ARGUMENT,"null token output");
 require(aether_core_version(1,nullptr,0,&size)==AETHER_BUFFER_TOO_SMALL&&size==6,"required UTF8 size");
 require(aether_core_version(1,tiny,2,&size)==AETHER_BUFFER_TOO_SMALL&&tiny[1]==0,"truncation terminates prefix");
 require(aether_core_stop(0,&final)==AETHER_INVALID_HANDLE,"null token");
 require(aether_core_cancel(UINT64_MAX,1)==AETHER_INVALID_HANDLE,"forged token");
 uint64_t previous=0;
 for(int cycle=0;cycle<100;cycle++){
  token=create();require(token!=previous,"generation changes");
  if(previous)require(aether_core_cancel(previous,1)==AETHER_INVALID_HANDLE,"stale generation rejected");
  require(aether_core_start_probe(token,60001,0,&id)==AETHER_INVALID_ARGUMENT,"bounded configuration");
  require(aether_core_start_probe(token,100,0,&id)==AETHER_OK,"operation accepted");
  require(aether_core_cancel(token,id)==AETHER_OK,"cancel while active/queued");
  require(aether_core_cancel(token,999999)==AETHER_NOT_FOUND,"unknown operation");
  require(aether_core_stop(token,&final)==AETHER_OK,"in-flight shutdown");
  require(aether_core_stop(token,&final)==AETHER_OK,"stop idempotent");
  require(aether_core_cancel(token,id)==AETHER_ALREADY_COMPLETE,"cancel after terminal");
  require(aether_core_start_probe(token,0,0,&id)==AETHER_STOPPED,"stop rejects admission");
  require(aether_core_ack(token,final+1)==AETHER_INVALID_ARGUMENT,"ACK cannot jump to unposted event");
  require(aether_core_destroy(token)==AETHER_BUSY,"no destroy before drain");
  require(aether_core_ack(token,final)==AETHER_OK,"drain sequence");
  require(aether_core_ack(token,0)==AETHER_INVALID_ARGUMENT,"ACK cannot go backwards");
  require(aether_core_destroy(token)==AETHER_OK,"release cycle");
  require(aether_core_destroy(token)==AETHER_ALREADY_DESTROYED,"destroy idempotent");
  AetherStats stats{1,sizeof(AetherStats)};require(aether_core_stats(0,&stats)==AETHER_OK&&stats.live_handles==0&&stats.live_threads==0,"cycle resources zero");previous=token;
 }
 token=create();{std::lock_guard lock(event_mutex);events.clear();}
 for(int n=0;n<32;n++)require(aether_core_start_probe(token,0,n==0?1:0,&id)==AETHER_OK,"saturation admission");
 require(aether_core_start_probe(token,0,0,&id)==AETHER_QUEUE_FULL,"slow consumer bounded admission");
 require(aether_core_stop(token,&final)==AETHER_OK,"saturation stop");
 std::map<uint64_t,int> terminal_counts;
 {std::lock_guard lock(event_mutex);for(auto e:events)if(e.kind==AETHER_TERMINAL)terminal_counts[e.operation]++;}
 require(terminal_counts.size()==32,"all admitted operations terminal");for(auto [operation,count]:terminal_counts){(void)operation;require(count==1,"exactly one terminal");}
 AetherStats stats{1,sizeof(AetherStats)};require(aether_core_stats(token,&stats)==AETHER_OK&&stats.pending_events<=256&&stats.admitted_operations==32,"bounded delayed ACK counters");
 cleanup(token);
 // A consumer that holds a callback cannot permit memory to be reclaimed.
 require(aether_core_create(&config,slow_event,&token)==AETHER_OK,"timeout core");
 require(aether_core_start_probe(token,0,0,&id)==AETHER_OK,"timeout operation");
 const auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(2);
 while(!slow_entered){require(std::chrono::steady_clock::now()<deadline,"callback begins");std::this_thread::sleep_for(std::chrono::milliseconds(1));}
 require(aether_core_stop(token,&final)==AETHER_TIMEOUT,"stop timeout reported");
 require(aether_core_destroy(token)==AETHER_BUSY,"TIMEOUT safely retains references");
 cleanup(token);
 token=create();require(aether_core_start_probe(token,100,0,&id)==AETHER_OK,"race operation");
 int32_t stop_status=AETHER_INTERNAL_ERROR;
 std::thread stopper([&]{stop_status=aether_core_stop(token,&final);});
 const auto cancelled=aether_core_cancel(token,id);stopper.join();
 require(stop_status==AETHER_OK&&(cancelled==AETHER_OK||cancelled==AETHER_ALREADY_COMPLETE),"stop races cancel safely");cleanup(token);
}
void adapters(){
 AetherStats before{1,sizeof(AetherStats)},after{1,sizeof(AetherStats)};require(aether_core_stats(0,&before)==AETHER_OK,"adapter baseline");
 for(uint32_t id=1;id<=5;id++){
  AetherCapabilities cap{1,sizeof(AetherCapabilities)};
  require(aether_core_capabilities(id,&cap)==AETHER_OK&&cap.platform_id==id&&cap.interface_version==1,"uniform descriptor");
  require(cap.implemented==(id==1?1u:0u)&&cap.capability_bits==(id==1?1u:0u),"honest capabilities");
  require(cap.reason_code==(id==1?0u:static_cast<uint32_t>(AETHER_UNSUPPORTED)),"unsupported reason");
  require(aether::platform_init(id)==(id==1?AETHER_OK:AETHER_UNSUPPORTED),"same adapter init interface");aether::platform_shutdown(id);
 }
 AetherCapabilities cap{1,sizeof(AetherCapabilities)};
 require(aether_core_capabilities(6,&cap)==AETHER_INVALID_ARGUMENT,"unknown platform");
 cap.abi_version=2;require(aether_core_capabilities(1,&cap)==AETHER_ABI_MISMATCH,"descriptor ABI");
 cap.abi_version=1;cap.struct_size=1;require(aether_core_capabilities(1,&cap)==AETHER_INVALID_ARGUMENT,"descriptor size");
 require(aether_core_stats(0,&after)==AETHER_OK&&before.live_handles==after.live_handles&&before.live_threads==after.live_threads,"unsupported adapters allocate nothing");
}
}
int main(int argc,char** argv) {
 try {
  if(argc!=2) throw std::runtime_error("Suite required");
  const std::string suite=argv[1];
  if(suite=="tracer")tracer();else if(suite=="lifecycle")lifecycle();else if(suite=="adapters")adapters();else throw std::runtime_error("Unknown suite");
  std::cout<<"PASS "<<argv[1]<<" checks="<<checks<<"\n"; return 0;
 }catch(const std::exception& e){std::cerr<<"FAIL "<<e.what()<<"\n";return 1;}
}
