#include "aether/core.h"
#include "aether/platform.h"
#include "aether_version.h"
#include <atomic>
#include <chrono>
#include <condition_variable>
#include <cstring>
#include <deque>
#include <map>
#include <memory>
#include <mutex>
#include <stdexcept>
#include <thread>
#include <unordered_map>
namespace {
using namespace std::chrono_literals;
constexpr uint32_t max_pending=256, max_operations=32;
std::atomic<uint32_t> live_threads{0};
uint64_t thread_id() noexcept { return static_cast<uint64_t>(std::hash<std::thread::id>{}(std::this_thread::get_id())); }
struct ThreadCount { ThreadCount(){++live_threads;} ~ThreadCount(){--live_threads;} };
struct Operation { uint64_t id; uint32_t delay,flags; bool cancelled=false,terminal=false; uint64_t terminal_sequence=0; };
struct Event { uint64_t sequence; uint32_t kind; int32_t status; uint64_t operation; };
struct Core {
 uint64_t token=0,next_operation=1,next_sequence=1,published=0,acked=0,worker_id=0,dispatcher_id=0;
 AetherEventCallback callback=nullptr;
 std::mutex mutex;
 std::timed_mutex stop_mutex;
 std::condition_variable cv;
 std::map<uint64_t,std::shared_ptr<Operation>> operations;
 std::deque<std::shared_ptr<Operation>> jobs;
 std::deque<Event> outgoing;
 std::map<uint64_t,Event> pending;
 bool stopping=false,worker_done=false,dispatcher_done=false,stopped=false;
 std::thread worker,dispatcher;
 void enqueue(uint32_t kind,int32_t status,const std::shared_ptr<Operation>& op) {
  // Admission reserves three events per operation. Progress may coalesce;
  // terminal delivery is never discarded after operation acceptance.
  if(kind==AETHER_PROGRESS && pending.size()+outgoing.size()>=max_pending-max_operations)return;
  const uint64_t seq=next_sequence++;
  outgoing.push_back({seq,kind,status,op->id});
  if(kind==AETHER_TERMINAL){op->terminal=true;op->terminal_sequence=seq;}
  cv.notify_all();
 }
 void work() noexcept {
  ThreadCount count;
  try{
   std::unique_lock lock(mutex);worker_id=thread_id();
   for(;;){
    cv.wait(lock,[&]{return stopping||!jobs.empty();});
    if(jobs.empty()&&stopping)break;
    auto op=jobs.front();jobs.pop_front();
    enqueue(AETHER_PROGRESS,AETHER_OK,op);
    cv.wait_for(lock,std::chrono::milliseconds(op->delay),[&]{return stopping||op->cancelled;});
    int32_t result=(stopping||op->cancelled)?AETHER_CANCELLED:AETHER_OK;
    if(result==AETHER_OK && op->flags==1)result=AETHER_INTERNAL_ERROR;
    enqueue(AETHER_TERMINAL,result,op);
   }
   worker_done=true;cv.notify_all();
  }catch(...){std::lock_guard lock(mutex);stopping=true;worker_done=true;cv.notify_all();}
 }
 void dispatch() noexcept {
  ThreadCount count;
  try{
   std::unique_lock lock(mutex);dispatcher_id=thread_id();
   for(;;){
    cv.wait(lock,[&]{return !outgoing.empty()||worker_done;});
    if(outgoing.empty()&&worker_done)break;
    auto e=outgoing.front();outgoing.pop_front();pending.emplace(e.sequence,e);published=e.sequence;
    lock.unlock();callback(token,e.sequence,e.kind,e.status,e.operation);lock.lock();
   }
   dispatcher_done=true;cv.notify_all();
  }catch(...){std::lock_guard lock(mutex);stopping=true;dispatcher_done=true;cv.notify_all();}
 }
 ~Core(){if(worker.joinable())worker.join();if(dispatcher.joinable())dispatcher.join();}
};
std::mutex registry_mutex;
std::unordered_map<uint64_t,std::shared_ptr<Core>> registry;
uint64_t next_generation=1;
std::shared_ptr<Core> find(uint64_t token){std::lock_guard lock(registry_mutex);auto it=registry.find(token);return it==registry.end()?nullptr:it->second;}
template<typename F> int32_t boundary(F&& f) noexcept { try{return f();}catch(...){return AETHER_INTERNAL_ERROR;} }
template<typename T> int32_t layout(const T* value) noexcept {
 if(!value || value->struct_size<sizeof(T))return AETHER_INVALID_ARGUMENT;
 return value->abi_version==AETHER_ABI_VERSION?AETHER_OK:AETHER_ABI_MISMATCH;
}
}
extern "C" {
int32_t aether_core_version(uint32_t abi,char* buffer,uint32_t capacity,uint32_t* required){return boundary([&]() -> int32_t {
 if(abi!=AETHER_ABI_VERSION)return AETHER_ABI_MISMATCH;
 if(!required||(!buffer&&capacity))return AETHER_INVALID_ARGUMENT;
 constexpr char text[]=AETHER_PRODUCT_VERSION;*required=sizeof(text);
 if(capacity<sizeof(text)){if(buffer&&capacity){std::memcpy(buffer,text,capacity-1);buffer[capacity-1]=0;}return AETHER_BUFFER_TOO_SMALL;}
 std::memcpy(buffer,text,sizeof(text));return AETHER_OK;
});}
int32_t aether_core_capabilities(uint32_t id,AetherCapabilities* out){return boundary([&]() -> int32_t {
 const auto valid=layout(out);if(valid!=AETHER_OK)return valid;
 const auto* p=aether::platform(id);if(!p)return AETHER_INVALID_ARGUMENT;
 out->platform_id=id;out->interface_version=1;out->capability_bits=p->capabilities;out->implemented=p->implemented;out->reason_code=p->reason;return AETHER_OK;
});}
int32_t aether_core_create(const AetherConfig* config,AetherEventCallback callback,uint64_t* token){return boundary([&]() -> int32_t {
 if(token)*token=0;const auto valid=layout(config);if(valid!=AETHER_OK)return valid;
 if(!callback||!token||config->reserved||config->flags>1)return AETHER_INVALID_ARGUMENT;
 if(config->flags==1)throw std::runtime_error("injected initialization failure");
 auto core=std::make_shared<Core>();core->callback=callback;
 {std::lock_guard lock(registry_mutex);if(registry.size()>=64||next_generation>UINT32_MAX)return AETHER_QUEUE_FULL;core->token=(next_generation++<<32)|1;registry.emplace(core->token,core);}
 try {core->worker=std::thread([core]{core->work();});core->dispatcher=std::thread([core]{core->dispatch();});}
 catch(...){
  {std::lock_guard lock(core->mutex);core->stopping=true;core->cv.notify_all();}
  if(core->worker.joinable())core->worker.join();
  {std::lock_guard lock(registry_mutex);registry.erase(core->token);}throw;
 }
 *token=core->token;return AETHER_OK;
});}
int32_t aether_core_start_probe(uint64_t token,uint32_t delay,uint32_t flags,uint64_t* id){return boundary([&]() -> int32_t {
 if(id)*id=0;if(!id||delay>60000||flags>1)return AETHER_INVALID_ARGUMENT;
 auto core=find(token);if(!core)return AETHER_INVALID_HANDLE;
 std::lock_guard lock(core->mutex);if(core->stopping)return AETHER_STOPPED;
 if(core->operations.size()>=max_operations||core->pending.size()+core->outgoing.size()+3>=max_pending)return AETHER_QUEUE_FULL;
 auto op=std::make_shared<Operation>();op->id=core->next_operation;op->delay=delay;op->flags=flags;
 core->operations.emplace(op->id,op);
 try{core->jobs.push_back(op);}catch(...){core->operations.erase(op->id);throw;}
 ++core->next_operation;*id=op->id;core->cv.notify_all();return AETHER_OK;
});}
int32_t aether_core_cancel(uint64_t token,uint64_t id){return boundary([&]() -> int32_t {
 auto core=find(token);if(!core)return AETHER_INVALID_HANDLE;
 std::lock_guard lock(core->mutex);auto it=core->operations.find(id);
 if(it==core->operations.end())return id>0&&id<core->next_operation?AETHER_ALREADY_COMPLETE:AETHER_NOT_FOUND;
 if(it->second->terminal)return AETHER_ALREADY_COMPLETE;
 it->second->cancelled=true;core->cv.notify_all();return AETHER_OK;
});}
int32_t aether_core_ack(uint64_t token,uint64_t sequence){return boundary([&]() -> int32_t {
 auto core=find(token);if(!core)return AETHER_INVALID_HANDLE;
 std::lock_guard lock(core->mutex);if(sequence<core->acked||sequence>core->published)return AETHER_INVALID_ARGUMENT;
 core->acked=sequence;core->pending.erase(core->pending.begin(),core->pending.upper_bound(sequence));
 for(auto it=core->operations.begin();it!=core->operations.end();)if(it->second->terminal&&it->second->terminal_sequence<=sequence)it=core->operations.erase(it);else ++it;
 return AETHER_OK;
});}
int32_t aether_core_stop(uint64_t token,uint64_t* final_sequence){return boundary([&]() -> int32_t {
 if(!final_sequence)return AETHER_INVALID_ARGUMENT;*final_sequence=0;
 auto core=find(token);if(!core)return AETHER_INVALID_HANDLE;
 auto deadline=std::chrono::steady_clock::now()+2s;
 std::unique_lock stop_lock(core->stop_mutex,std::defer_lock);if(!stop_lock.try_lock_until(deadline))return AETHER_TIMEOUT;
 std::unique_lock lock(core->mutex);
 if(!core->stopped){
  core->stopping=true;for(auto& [id,op]:core->operations){(void)id;op->cancelled=true;}core->cv.notify_all();
  if(!core->cv.wait_until(lock,deadline,[&]{return core->worker_done&&core->dispatcher_done;}))return AETHER_TIMEOUT;
  lock.unlock();core->worker.join();core->dispatcher.join();lock.lock();core->stopped=true;
 }
 *final_sequence=core->published;return AETHER_OK;
});}
int32_t aether_core_destroy(uint64_t token){return boundary([&]() -> int32_t {
 std::lock_guard registry_lock(registry_mutex);auto it=registry.find(token);
 if(it==registry.end())return token&&static_cast<uint32_t>(token)==1&&(token>>32)<next_generation?AETHER_ALREADY_DESTROYED:AETHER_INVALID_HANDLE;
 auto core=it->second;std::lock_guard lock(core->mutex);
 if(!core->stopped||core->acked!=core->published)return AETHER_BUSY;
 registry.erase(it);return AETHER_OK;
});}
int32_t aether_core_stats(uint64_t token,AetherStats* out){return boundary([&]() -> int32_t {
 const auto valid=layout(out);if(valid!=AETHER_OK)return valid;
 uint32_t handles;{std::lock_guard lock(registry_mutex);handles=static_cast<uint32_t>(registry.size());}
 *out={AETHER_ABI_VERSION,sizeof(AetherStats),0,0,0,0,handles,live_threads.load(),0,0,0,0};
 if(token){auto core=find(token);if(!core)return AETHER_INVALID_HANDLE;std::lock_guard lock(core->mutex);
  out->published_sequence=core->published;out->acknowledged_sequence=core->acked;
  out->pending_events=static_cast<uint32_t>(core->pending.size()+core->outgoing.size());out->admitted_operations=static_cast<uint32_t>(core->operations.size());
  out->worker_thread_id=core->worker_id;out->dispatcher_thread_id=core->dispatcher_id;out->stopped=core->stopped?1:0;
 }return AETHER_OK;
});}
uint64_t aether_core_thread_id(void){return thread_id();}
}
