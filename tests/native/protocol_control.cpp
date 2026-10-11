#ifdef AETHER_CONTROL_HOST
#include "internal.h"
#else
#include "aether/protocol.h"
#endif
#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <signal.h>
#include <dlfcn.h>
#include <cstdlib>
#define GetCurrentProcessId getpid
#endif
#include <iostream>
#include <fstream>
#include <filesystem>
#include <thread>
#include <chrono>
#include <mutex>
#include <vector>
#include <array>
#include <map>
#include <sstream>
#include <cstring>
#include <stdexcept>
#include <atomic>
namespace {
using Clock=std::chrono::steady_clock;
namespace fs=std::filesystem;
void need(bool value,const char* reason);
#ifdef AETHER_CONTROL_HOST
struct FaultRule {uint16_t opcode=0,phase=0;uint64_t request=0;uint32_t before=0,delay=0,flags=0,remaining=0;};
std::vector<FaultRule> fault_rules;fs::path fixture_path;std::mutex fault_mutex;
void load_faults(const fs::path& base){fixture_path=base;auto bytes=fs::file_size(base/"scenario.bin");need(bytes<=1024&&bytes%32==0,"bounded complete fixture records");std::ifstream f(base/"scenario.bin",std::ios::binary);std::array<uint8_t,32> b{};while(f.read(reinterpret_cast<char*>(b.data()),b.size())){auto get32=[&](size_t p){return (uint32_t(b[p])<<24)|(uint32_t(b[p+1])<<16)|(uint32_t(b[p+2])<<8)|b[p+3];};FaultRule rule;rule.opcode=static_cast<uint16_t>(get32(0));rule.phase=static_cast<uint16_t>(get32(4));rule.request=(uint64_t(get32(8))<<32)|get32(12);rule.before=get32(16);rule.delay=get32(20);rule.flags=get32(24);rule.remaining=get32(28);need(rule.delay<=3000&&rule.remaining<=32,"scenario bounds");fault_rules.push_back(rule);} }
#endif
struct Check {unsigned count=0,failed=0;void operator()(bool ok,const std::string& name){++count;std::cout<<(ok?"ok ":"not ok ")<<count<<" - "<<name<<std::endl;if(!ok)++failed;}int finish(){std::cout<<"1.."<<count<<"\n# tests "<<count<<"\n# pass "<<count-failed<<"\n# fail "<<failed<<"\n# skipped 0\n";return failed?1:0;}};
void need(bool value,const char* reason){if(!value)throw std::runtime_error(reason);}
std::mutex event_mutex;struct Event{uint64_t seq,op;uint32_t kind;int32_t status;uint64_t handle;};std::vector<Event> events;
std::atomic<unsigned> callback_delay{0};std::atomic<bool> callback_entered{false};
void callback(uint64_t handle,uint64_t seq,uint32_t kind,int32_t status,uint64_t op){if(kind==11&&op==2&&callback_delay){callback_entered=true;std::this_thread::sleep_for(std::chrono::milliseconds(callback_delay.load()));}std::lock_guard lock(event_mutex);events.push_back({seq,op,kind,status,handle});}
std::string read(const fs::path& p){std::ifstream f(p);return {std::istreambuf_iterator<char>(f),{}};}
void write(const fs::path& p,const std::string& text){std::ofstream(p)<<text;}
void be16(uint8_t* b,uint16_t n){b[0]=static_cast<uint8_t>(n>>8);b[1]=static_cast<uint8_t>(n);}
void be32(uint8_t* b,uint32_t n){for(int i=3;i>=0;--i){b[i]=static_cast<uint8_t>(n);n>>=8;}}
void be64(uint8_t* b,uint64_t n){for(int i=7;i>=0;--i){b[i]=static_cast<uint8_t>(n);n>>=8;}}
void provider_input(const fs::path& base,uint64_t revision=7,uint32_t permissions=3,uint64_t clock_ms=0,bool zero_capacity=false){std::array<uint8_t,96> b{};std::memcpy(b.data(),"APFX",4);be32(b.data()+4,1);std::array<uint64_t,6> capacity{4,2,4,300000000,67108864,100000000};for(size_t i=0;i<6;++i)be64(b.data()+8+8*i,zero_capacity?0:capacity[i]);be64(b.data()+56,revision);be64(b.data()+64,9001);be64(b.data()+72,1);be32(b.data()+80,permissions);be32(b.data()+84,0);be64(b.data()+88,clock_ms);std::ofstream f(base/"provider.bin",std::ios::binary);f.write(reinterpret_cast<char*>(b.data()),b.size());}
using Fields=std::map<uint16_t,std::vector<uint8_t>>;
void scalar(Fields& f,uint16_t t,uint64_t v,size_t size){std::vector<uint8_t> b(size);if(size==4)be32(b.data(),static_cast<uint32_t>(v));else be64(b.data(),v);f[t]=std::move(b);}
std::vector<uint8_t> payload(const Fields& fields){std::vector<uint8_t> b(4);be16(b.data(),1);be16(b.data()+2,static_cast<uint16_t>(fields.size()));for(auto& [t,v]:fields){auto p=b.size();b.resize(p+4+v.size());be16(b.data()+p,t);be16(b.data()+p+2,static_cast<uint16_t>(v.size()));std::copy(v.begin(),v.end(),b.begin()+p+4);}return b;}
std::vector<uint8_t> request(){Fields f;scalar(f,1,2,4);scalar(f,2,1,4);scalar(f,3,3000,4);std::vector<uint8_t> specs(58);be16(specs.data(),1);be64(specs.data()+2,4);be64(specs.data()+10,3);size_t p=18;for(auto n:{1u,1u,640u,480u,60u,1u,4000000u,1u,1u,0u}){be32(specs.data()+p,n);p+=4;}f[4]=std::move(specs);f[5]={0,0};return payload(f);}
std::string string_field(const std::string& json,const std::string& name){auto p=json.find('"'+name+"\":\"");need(p!=std::string::npos,"missing string");p+=name.size()+4;auto end=json.find('"',p);return json.substr(p,end-p);}
uint64_t number_field(const std::string& json,const std::string& name){auto p=json.find('"'+name+"\":");need(p!=std::string::npos,"missing number");return std::stoull(json.substr(p+name.size()+3));}
std::string query(uint64_t h){uint32_t n=0;need(aether_protocol_control_query(h,nullptr,0,&n)==AP_BUFFER_TOO_SMALL&&n<=65536,"query bounds");std::vector<char> b(65536);need(aether_protocol_control_query(h,b.data(),static_cast<uint32_t>(b.size()),&n)==AP_OK,"query copy");return b.data();}
bool terminal(uint64_t op,int32_t& status){std::lock_guard lock(event_mutex);for(auto& e:events)if(e.op==op&&e.kind==11){status=e.status;return true;}return false;}
int32_t wait_operation(uint64_t op){auto until=Clock::now()+std::chrono::seconds(4);int32_t status=AP_BUSY;while(Clock::now()<until){if(terminal(op,status))return status;std::this_thread::sleep_for(std::chrono::milliseconds(2));}return AP_TIMEOUT;}
int32_t wait_handle(uint64_t handle,uint64_t op){auto until=Clock::now()+std::chrono::seconds(4);while(Clock::now()<until){{std::lock_guard lock(event_mutex);for(auto& e:events)if(e.handle==handle&&e.op==op&&e.kind==11)return e.status;}std::this_thread::sleep_for(std::chrono::milliseconds(2));}return AP_TIMEOUT;}
void drain(uint64_t h){std::vector<Event> copy;{std::lock_guard lock(event_mutex);copy=events;}auto acknowledged=number_field(query(h),"acked");for(auto& e:copy)if(e.handle==h&&e.seq>acknowledged)need(aether_protocol_control_ack(h,e.seq)==AP_OK,"strict ack");}
int32_t send(uint64_t h,uint64_t op,uint64_t req,uint32_t opcode,const std::vector<uint8_t>& b,uint32_t deadline=1000){AetherProtocolCommand command{1,sizeof(command),1,opcode,0,deadline,op,req,4,1,static_cast<uint32_t>(b.size()),0,b.data()};return aether_protocol_control_send(h,&command);}
std::vector<uint8_t> confirmation(const std::string& json){Fields f;auto digest=string_field(json,"digest");std::vector<uint8_t> d;for(size_t i=0;i<digest.size();i+=2)d.push_back(static_cast<uint8_t>(std::stoul(digest.substr(i,2),nullptr,16)));f[6]=std::move(d);scalar(f,7,number_field(json,"hostRevision"),8);scalar(f,8,number_field(json,"expiryToken"),8);return payload(f);}
#ifndef AETHER_IOS_CONTRACT
struct Child {
#ifdef _WIN32
 HANDLE process=nullptr,thread=nullptr;
 Child()=default;Child(const Child&)=delete;Child& operator=(const Child&)=delete;
 ~Child(){if(process)CloseHandle(process);if(thread)CloseHandle(thread);}
 void launch(const fs::path& exe,const std::vector<std::string>& args,const fs::path& log){
  std::wstring command=L"\""+exe.wstring()+L"\"";for(auto& arg:args){need(arg.find('"')==std::string::npos,"argument quote");command+=L" \""+fs::path(arg).wstring()+L"\"";}
  SECURITY_ATTRIBUTES sa{sizeof(sa),nullptr,TRUE};HANDLE out=CreateFileW(log.c_str(),GENERIC_WRITE,FILE_SHARE_READ|FILE_SHARE_WRITE,&sa,CREATE_ALWAYS,FILE_ATTRIBUTE_NORMAL,nullptr);need(out!=INVALID_HANDLE_VALUE,"log open");STARTUPINFOW start{};start.cb=sizeof(start);start.dwFlags=STARTF_USESTDHANDLES;start.hStdOutput=out;start.hStdError=out;start.hStdInput=GetStdHandle(STD_INPUT_HANDLE);PROCESS_INFORMATION info{};
  auto ok=CreateProcessW(exe.c_str(),command.data(),nullptr,nullptr,TRUE,CREATE_NO_WINDOW,nullptr,nullptr,&start,&info);CloseHandle(out);need(ok!=FALSE,"process create");process=info.hProcess;thread=info.hThread;
 }
 DWORD join(){if(WaitForSingleObject(process,20000)!=WAIT_OBJECT_0){TerminateProcess(process,124);WaitForSingleObject(process,2000);return 124;}DWORD exit=0;need(GetExitCodeProcess(process,&exit)!=FALSE,"process exit");return exit;}
#else
 pid_t process=-1;
 Child()=default;Child(const Child&)=delete;Child& operator=(const Child&)=delete;
 ~Child(){if(process>0){kill(process,SIGKILL);waitpid(process,nullptr,0);}}
 void launch(const fs::path& exe,const std::vector<std::string>& args,const fs::path& log){
  std::vector<std::string> storage{exe.string()};storage.insert(storage.end(),args.begin(),args.end());
  std::vector<char*> arguments;for(auto& arg:storage)arguments.push_back(arg.data());arguments.push_back(nullptr);
  auto fd=open(log.c_str(),O_WRONLY|O_CREAT|O_TRUNC,0600);need(fd>=0,"log open");
  process=fork();if(process==0){dup2(fd,STDOUT_FILENO);dup2(fd,STDERR_FILENO);close(fd);execv(exe.c_str(),arguments.data());_exit(127);}close(fd);need(process>0,"process create");
 }
 unsigned join(){auto until=Clock::now()+std::chrono::seconds(20);int status=0;while(Clock::now()<until){auto result=waitpid(process,&status,WNOHANG);if(result==process){process=-1;return WIFEXITED(status)?static_cast<unsigned>(WEXITSTATUS(status)):128u;}need(result>=0,"process wait");std::this_thread::sleep_for(std::chrono::milliseconds(2));}kill(process,SIGKILL);waitpid(process,&status,0);process=-1;return 124;}
#endif
};
#endif
AetherProtocolConfig config(const fs::path& base,bool host,unsigned port){static std::array<std::string,4> strings;strings={(base/(host?"host.pem":"client.pem")).string(),(base/(host?"host.key":"client.key")).string(),(base/"trust.pem").string(),host?"aether-client.local":"aether-host.local"};AetherProtocolConfig c{};c.abi_version=1;c.struct_size=sizeof(c);c.role=host?1:2;c.deadline_ms=3000;c.peer_control_port=port;c.host_id=1;c.instance_id=2;c.display_id=3;c.stream_id=4;c.connection_id=5;c.client_id=6;c.lease_epoch=1;c.config_generation=1;c.key_generation=1;c.certificate_file=strings[0].c_str();c.private_key_file=strings[1].c_str();c.trust_file=strings[2].c_str();c.peer_name=strings[3].c_str();c.version_count=1;c.versions[0]=3;c.permission_read=1;return c;}
void scenario_rules(const fs::path& dir,const std::string& name){
 if(name=="authority-read-deny")provider_input(dir,7,0);
 if(name=="authority-capacity")provider_input(dir,7,3,0,true);
 std::ofstream output(dir/"scenario.bin",std::ios::binary);
 auto rule=[&](uint32_t opcode,uint32_t phase,bool before,uint32_t delay,uint32_t flags,uint32_t remaining=1,uint64_t request_id=100){std::array<uint8_t,32> b{};be32(b.data(),opcode);be32(b.data()+4,phase);be64(b.data()+8,request_id);be32(b.data()+16,before?1:0);be32(b.data()+20,delay);be32(b.data()+24,flags);be32(b.data()+28,remaining);output.write(reinterpret_cast<const char*>(b.data()),b.size());};
 if(name=="cancel-committed")rule(2,3,false,250,0);
 if(name=="cancel-before")rule(2,0,true,250,0);
 if(name=="grant-loss")rule(2,3,false,0,1);
 if(name=="ready-delay")rule(14,0,true,150,0);
 if(name=="ready-loss")rule(14,0,true,0,1);if(name=="readyall-loss")rule(14,0,true,0,1,32);
 if(name=="readyack-delay")rule(14,4,false,150,0);
 if(name=="readyack-loss")rule(14,4,false,0,1);
 if(name=="unknown"){rule(2,3,false,0,1);rule(14,3,false,0,1,32);rule(3,3,false,0,1,32);}
 if(name=="replay")rule(2,3,false,0,2);
 if(name=="digest")rule(2,3,false,0,7u<<8);
 if(name=="oversize")rule(1,1,false,0,1u<<8);
 if(name=="schema")rule(1,1,false,0,2u<<8);
 if(name=="sequence")rule(1,1,false,0,3u<<8);
 if(name=="required")rule(1,1,false,0,4u<<8);
 if(name=="duplicate")rule(1,1,false,0,5u<<8);
 if(name=="truncated")rule(1,1,false,0,6u<<8);
 if(name=="healthy-cancel")rule(2,0,true,250,0,1,200);
}
#ifdef AETHER_CONTROL_HOST
using namespace aether::protocol;
class FixtureServices final:public HostServices {
 std::mutex mutex;std::map<std::pair<uint64_t,uint64_t>,Reservation> reservations;uint64_t sequence=0;
 ResourceVector capacity{4,2,4,300000000,67108864,100000000};
 uint64_t revision=7,expiry_token=9001,lease=1,clock_ms=0,controller_connection=5,controller_epoch=1;std::map<uint64_t,uint64_t> epochs{{5,1},{7,1}};uint32_t permissions=3,devices=0;
 void input(){std::ifstream file(fixture_path/"provider.bin",std::ios::binary);std::string text{std::istreambuf_iterator<char>(file),{}};if(text.empty())return;need(text.size()==96&&text.substr(0,4)=="APFX","provider fixture bounds");auto b=reinterpret_cast<const uint8_t*>(text.data());need(u32(b+4)==1,"provider fixture schema");capacity={u64(b+8),u64(b+16),u64(b+24),u64(b+32),u64(b+40),u64(b+48)};revision=u64(b+56);expiry_token=u64(b+64);lease=u64(b+72);permissions=u32(b+80);devices=u32(b+84);clock_ms=u64(b+88);need(clock_ms<=60000&&permissions<=15&&devices<=3,"provider fixture action bounds");}
 bool fits(const Reservation& r){auto totals=r.resources.values();for(auto& [key,value]:reservations)if(key!=std::pair{r.binding.identity.connection,r.binding.request_id}&&(value.phase==1||value.phase==3||value.phase==4)){auto v=value.resources.values();for(size_t i=0;i<6;++i){if(v[i]>UINT64_MAX-totals[i])return false;totals[i]+=v[i];}}auto limit=capacity.values();for(size_t i=0;i<6;++i)if(totals[i]>limit[i])return false;return true;}
 Reservation& owned(Reservation& r){auto i=reservations.find({r.binding.identity.connection,r.binding.request_id});require(i!=reservations.end()&&i->second.binding.digest==r.binding.digest,AP_STALE);return i->second;}
public:
 unsigned commits=0,activations=0;
 uint64_t host_id()const override{return 1;}
 HostSnapshot snapshot(const Binding& binding)override{std::lock_guard lock(mutex);input();HostSnapshot s;s.host_id=1;s.revision=revision;s.expiry_token=expiry_token;s.capacity=capacity;s.controller={1,2,3,4,controller_connection,6,std::max(lease,controller_epoch),1,1};s.read_allowed=(permissions&1)!=0;s.control_allowed=(permissions&2)!=0&&binding.identity.client==6&&binding.identity.connection==controller_connection;s.microphone_allowed=(permissions&4)!=0;s.camera_allowed=(permissions&8)!=0;s.microphone_available=(devices&1)!=0;s.camera_available=(devices&2)!=0;std::array<uint64_t,6> pending{},committed{};for(auto& [key,r]:reservations){(void)key;auto v=r.resources.values();auto& target=r.phase==1?pending:committed;if(r.phase==1||r.phase==3||r.phase==4)for(size_t i=0;i<6;++i)target[i]+=v[i];}s.pending={pending[0],pending[1],pending[2],pending[3],pending[4],pending[5]};s.committed={committed[0],committed[1],committed[2],committed[3],committed[4],committed[5]};return s;}
 int32_t reserve(Reservation& r,uint32_t)override{std::lock_guard lock(mutex);input();if(!(permissions&1))return AP_PERMISSION;if(r.revision!=revision||r.expiry_token!=expiry_token||(r.binding.identity.lease!=epochs[r.binding.identity.connection]||(r.binding.identity.client==6&&r.binding.identity.lease!=std::max(lease,controller_epoch))))return AP_STALE;if(!fits(r))return AP_BUSY;r.transaction_sequence=++sequence;reservations[{r.binding.identity.connection,r.binding.request_id}]=r;return AP_OK;}
 int32_t commit(Reservation& r)override{std::lock_guard lock(mutex);input();auto& value=owned(r);if(value.phase==2){r=value;return AP_CANCELLED;}if(value.phase>=3){r=value;return AP_OK;}if(!(permissions&1))return AP_PERMISSION;if(r.revision!=revision||r.expiry_token!=expiry_token||(r.binding.identity.lease!=epochs[r.binding.identity.connection]||(r.binding.identity.client==6&&r.binding.identity.lease!=std::max(lease,controller_epoch))))return AP_STALE;if(Clock::now()+std::chrono::milliseconds(clock_ms)>=value.expiry)return AP_EXPIRED;if(r.upstream_mask&&(!(permissions&2)||r.binding.identity.client!=6||r.binding.identity.connection!=controller_connection||((r.upstream_mask&1)&&(!(permissions&4)||!(devices&1)))||((r.upstream_mask&2)&&(!(permissions&8)||!(devices&2)))))return AP_PERMISSION;if(!fits(r))return AP_BUSY;value.binding.operation_id=r.binding.operation_id;value.phase=3;value.authority_terminal=AP_OK;value.transaction_sequence=++sequence;value.activation_expiry=Clock::now()+std::chrono::milliseconds(3000);++commits;r=value;return AP_OK;}
 int32_t cancel(Reservation& r)override{std::lock_guard lock(mutex);auto& value=owned(r);if(value.phase>=3){r=value;return AP_ALREADY_COMPLETE;}if(value.phase!=2){value.binding.operation_id=r.binding.operation_id;value.phase=2;value.authority_terminal=AP_CANCELLED;value.transaction_sequence=++sequence;}r=value;return AP_CANCELLED;}
 int32_t activate(Reservation& r)override{std::lock_guard lock(mutex);auto& value=owned(r);if(value.phase==4){r=value;return AP_OK;}if(value.phase!=3)return AP_STALE;if(Clock::now()>=value.activation_expiry){value.phase=5;value.transaction_sequence=++sequence;r=value;return AP_EXPIRED;}value.phase=4;value.transaction_sequence=++sequence;++activations;r=value;return AP_OK;}
 int32_t status(Reservation& r)override{std::lock_guard lock(mutex);const auto operation=r.binding.operation_id;r=owned(r);if(r.phase==1)r.binding.operation_id=operation;return r.authority_terminal;}
 void release_connection(uint64_t id)override{std::lock_guard lock(mutex);for(auto& [key,value]:reservations)if(key.first==id&&value.phase!=2&&value.phase!=5){value.phase=5;value.transaction_sequence=++sequence;}}
 int32_t fresh_auth_result(const Binding& old,Identity& next)override{std::lock_guard lock(mutex);input();if(!(permissions&1))return AP_PERMISSION;if(old.identity.client==6&&std::max(lease,controller_epoch)!=old.identity.lease)return AP_BUSY;next=old.identity;next.connection+=100;++next.lease;++next.key;epochs[next.connection]=next.lease;if(old.identity.client==6){controller_connection=next.connection;controller_epoch=next.lease;}std::vector<Reservation> retained;for(auto& [key,value]:reservations)if(key.first==old.identity.connection){if(value.phase==4&&value.media_mask&7){auto r=value;r.binding.identity=next;r.media_mask&=7;r.upstream_mask=0;r.resources.host_uplink_decoder_sessions=0;r.specs.erase(std::remove_if(r.specs.begin(),r.specs.end(),[](const auto& spec){return spec.direction==2;}),r.specs.end());r.resources={};for(auto& spec:r.specs){if(spec.kind==AP_VIDEO){++r.resources.host_encoder_sessions;++r.resources.client_downlink_decoder_sessions;r.resources.pixel_rate_per_second+=uint64_t(spec.width)*spec.height*spec.fps/spec.denominator;r.resources.vram_bytes+=uint64_t(spec.width)*spec.height*4;}r.resources.bandwidth_bits_per_second+=spec.bitrate;}retained.push_back(r);}value.phase=5;}for(auto& r:retained)reservations[{next.connection,r.binding.request_id}]=r;return AP_OK;}
 int32_t check_permission_device(const Binding& binding,uint32_t mask)override{std::lock_guard lock(mutex);input();if(!(permissions&2)||binding.identity.client!=6||binding.identity.connection!=controller_connection||((mask&1)&&(!(permissions&4)||!(devices&1)))||((mask&2)&&(!(permissions&8)||!(devices&2))))return AP_PERMISSION;return AP_OK;}
 unsigned owned_count(){std::lock_guard lock(mutex);unsigned count=0;for(auto& [key,value]:reservations)if(value.phase==1||value.phase==3||value.phase==4)++count;return count;}
};
int host(const fs::path& base,const std::string& scenario){
 load_faults(base);auto provider=std::make_shared<FixtureServices>();std::weak_ptr<FixtureServices> weak=provider;uint64_t h=0,h2=0;
 auto start=[&](uint64_t& handle,const char* marker,bool second){auto c=config(base,true,0);if(second){c.connection_id=7;c.client_id=8;}need(aether_protocol_create(&c,callback,&handle)==AP_OK,"host create");if(scenario!="no-provider")need(attach_host_services(handle,provider)==AP_OK,"native attach");uint32_t n=0;aether_protocol_query(handle,nullptr,0,&n);std::vector<char> b(n);need(aether_protocol_query(handle,b.data(),n,&n)==AP_OK,"port query");write(base/marker,std::to_string(number_field(b.data(),"controlPort")));AetherProtocolControlOpen open{1,sizeof(open),1,0,0,0,nullptr};need(aether_protocol_control_open(handle,&open)==AP_OK,"host open");};
 auto stop=[&](uint64_t handle){uint64_t final=0;need(aether_protocol_stop(handle,&final)==AP_OK,"host stop");drain(handle);need(aether_protocol_destroy(handle)==AP_OK,"host destroy");};
 start(h,"ready",false);if(scenario=="actions-shared")start(h2,"ready2",true);if(scenario=="shared-provider"){start(h2,"ready2",true);auto until=Clock::now()+std::chrono::seconds(8);while(Clock::now()<until&&!fs::exists(base/"first-done"))std::this_thread::sleep_for(std::chrono::milliseconds(2));need(fs::exists(base/"first-done"),"first handle deadline");stop(h);need(provider->owned_count()==1,"release only first connection");provider.reset();need(!weak.expired(),"second context retains provider");write(base/"first-host-stopped","retained");}
 auto until=Clock::now()+std::chrono::seconds(scenario=="actions"?320:8);while(Clock::now()<until&&!fs::exists(base/"client-done"))std::this_thread::sleep_for(std::chrono::milliseconds(5));std::cout<<"# HOSTSTATE "<<query(h2?h2:h)<<std::endl;
 if(h2){auto retained=weak.lock();need(retained!=nullptr,"provider lifetime");if(scenario=="actions-shared"){stop(h);provider.reset();}stop(h2);need(retained->owned_count()==0,"final connection release");std::cout<<"HOST pid="<<GetCurrentProcessId()<<" commits="<<retained->commits<<" activations="<<retained->activations<<" owned=0"<<std::endl;retained.reset();need(weak.expired(),"provider released after final destroy");std::cout<<"SHARED provider-retained=1 provider-released=1"<<std::endl;}
 else{stop(h);std::cout<<"HOST pid="<<GetCurrentProcessId()<<" commits="<<provider->commits<<" activations="<<provider->activations<<" owned="<<provider->owned_count()<<std::endl;}return 0;
}
#else
#ifndef AETHER_IOS_CONTRACT
int orchestrate(const fs::path& exe,const std::string& selected){Check check;fs::path root=fs::current_path();while(!fs::exists(root/"native/protocol/CMakeLists.txt")&&root.has_parent_path()&&root!=root.parent_path())root=root.parent_path();need(fs::exists(root/"native/protocol/CMakeLists.txt"),"workspace root");auto base=root/"build/phase06/control-fixtures";fs::create_directories(base);auto run=base/std::to_string(GetCurrentProcessId());fs::create_directories(run);auto openssl=std::getenv("AETHER_OPENSSL_BIN")?fs::path(std::getenv("AETHER_OPENSSL_BIN")):root/"build/phase06/dependencies/openssl-install/bin/openssl.exe";for(auto id:{"host","client"}){Child child;std::string hostname=std::string("aether-")+id+".local";child.launch(openssl,{"req","-x509","-newkey","ED25519","-noenc","-keyout",(run/(std::string(id)+".key")).string(),"-out",(run/(std::string(id)+".pem")).string(),"-subj","/CN="+hostname,"-addext","subjectAltName=DNS:"+hostname,"-days","1","-config",
#ifdef _WIN32
 "NUL"
#else
 "/dev/null"
#endif
},run/(std::string(id)+"-cert.log"));need(child.join()==0,"fixture certificate");}write(run/"trust.pem",read(run/"host.pem")+read(run/"client.pem"));
 for(auto scenario:{"exact","no-provider","cancel-committed","cancel-before","grant-loss","readyall-loss","ready-delay","ready-loss","readyack-delay","readyack-loss","unknown","replay","digest","oversize","schema","sequence","required","duplicate","truncated","boundaries","stop-timeout","healthy-cancel","shared-provider","authority-read-deny","authority-capacity","authority-revision","authority-clock"}){if(!selected.empty()&&selected!=scenario)continue;auto dir=run/scenario;fs::create_directories(dir);for(auto file:{"host.pem","host.key","client.pem","client.key","trust.pem"})fs::copy_file(run/file,dir/file,fs::copy_options::overwrite_existing);scenario_rules(dir,scenario);Child host_child,client_child;host_child.launch(exe.parent_path()/("aether_protocol_control_host"+std::string(
#ifdef _WIN32
 ".exe"
#else
 ""
#endif
 )),{"--host",dir.string(),scenario},dir/"host.log");auto until=Clock::now()+std::chrono::seconds(4);while(Clock::now()<until&&!fs::exists(dir/"ready"))std::this_thread::sleep_for(std::chrono::milliseconds(2));need(fs::exists(dir/"ready"),"host ready deadline");client_child.launch(exe,{"--client",dir.string(),scenario,read(dir/"ready")},dir/"client.log");auto client_exit=client_child.join();write(dir/"client-done","done");auto host_exit=host_child.join();auto client_log=read(dir/"client.log"),host_log=read(dir/"host.log");std::cout<<client_log<<host_log;check(client_exit==0&&host_exit==0&&client_log.find("# tests 0")==std::string::npos&&client_log.find("not ok")==std::string::npos,std::string("two-PID-real-DLL-")+scenario);check(host_log.find("owned=0")!=std::string::npos,std::string("host-six-dimensional-owned-cleanup-")+scenario);if(std::string(scenario)=="exact")check(host_log.find("commits=1 activations=1")!=std::string::npos,"provider-one-commit-one-activation");}
 check(check.count>0,"selected-scenario-has-nonzero-cases");check(sizeof(AetherProtocolConfig)==176&&offsetof(AetherProtocolConfig,certificate_file)==96&&sizeof(AetherProtocolControlOpen)==32&&sizeof(AetherProtocolCommand)==72,"x64-ABI1-preserved-additive-layout");return check.finish();}
#endif
#endif
}
#ifdef AETHER_CONTROL_HOST
namespace aether::protocol {
ControlFixtureFault control_fixture_fault(uint16_t opcode,uint32_t phase,uint64_t request,bool before){
 if(before&&(opcode==2||opcode==9))write(fixture_path/"confirm-received",std::to_string(request));if(!before&&phase==3)write(fixture_path/"committed",std::to_string(request));
 std::lock_guard lock(fault_mutex);for(auto& rule:fault_rules)if(rule.remaining&&rule.opcode==opcode&&rule.phase==phase&&rule.request==request&&rule.before==unsigned(before)){--rule.remaining;return {rule.delay,(rule.flags&1)!=0,(rule.flags&2)!=0,rule.flags>>8};}return {};
}
void control_fixture_wire(const uint8_t* b,size_t n){need(n>=128&&u32(b)==n-4&&std::memcmp(b+4,"ACTL",4)==0&&u16(b+8)==1&&u64(b+116)==3,"ACTL-independent-header-layout");std::ofstream log(fixture_path/"wire.hex",std::ios::app);constexpr char digits[]="0123456789abcdef";for(size_t i=0;i<n;++i)log<<digits[b[i]>>4]<<digits[b[i]&15];log<<'\n';}
}
#endif
#ifndef AETHER_CONTROL_HOST
int control_client(const fs::path& base,const std::string& scenario,unsigned port){
 Check check;uint64_t h=0;auto c=config(base,false,port);need(aether_protocol_create(&c,callback,&h)==AP_OK,"client create");

#ifdef _WIN32
 auto dll=GetModuleHandleW(L"aether_protocol.dll");check(dll&&GetProcAddress(dll,"aether_protocol_control_open")&&!GetProcAddress(dll,"control_fixture_fault")&&!GetProcAddress(dll,"aether_protocol_attach_host_services"),"product-DLL-fixture-registration-not-exported");
#elif !defined(AETHER_IOS_CONTRACT)
 check(dlsym(RTLD_DEFAULT,"aether_protocol_control_open")&&!dlsym(RTLD_DEFAULT,"control_fixture_fault")&&!dlsym(RTLD_DEFAULT,"aether_protocol_attach_host_services"),"product-library-fixture-registration-not-exported");
#endif

 const std::vector<uint8_t> hello{'A','E','T','H',0,16,1,1,0,3,0,8,0,2,0,1};AetherProtocolControlOpen open{1,sizeof(open),1,0,static_cast<uint32_t>(hello.size()),0,hello.data()};
 check(aether_protocol_control_open(h,&open)==AP_OK,"control-open-copies-hello");check(wait_operation(0)==AP_OK,"fresh-TLS3-schema1-open");
 check(number_field(query(h),"grants")==0&&number_field(query(h),"sinkPackets")==0,"hello-never-grants-media");check(aether_protocol_submit(h,hello.data(),static_cast<uint32_t>(hello.size()))==AP_BUSY,"legacy-submit-control-mode-exclusive");
 if(scenario=="shared-provider"){
  uint64_t h2=0;auto c2=config(base,false,static_cast<unsigned>(std::stoul(read(base/"ready2"))));c2.connection_id=7;c2.client_id=8;check(aether_protocol_create(&c2,callback,&h2)==AP_OK&&aether_protocol_control_open(h2,&open)==AP_OK&&wait_handle(h2,0)==AP_OK,"two-handles-fresh-independent-TLS");auto req=request();
  for(auto handle:{h,h2}){check(send(handle,1,100,1,req)==AP_OK&&wait_handle(handle,1)==AP_OK,"shared-authority-independent-proposal");auto confirm=confirmation(query(handle));check(send(handle,2,100,2,confirm)==AP_OK&&wait_handle(handle,2)==AP_OK,"shared-authority-independent-activation");}
  uint64_t final=0;check(aether_protocol_stop(h,&final)==AP_OK,"first-handle-stop");drain(h);check(aether_protocol_destroy(h)==AP_OK,"first-handle-destroy");write(base/"first-done","done");auto until=Clock::now()+std::chrono::seconds(3);while(Clock::now()<until&&!fs::exists(base/"first-host-stopped"))std::this_thread::sleep_for(std::chrono::milliseconds(2));check(fs::exists(base/"first-host-stopped"),"host-releases-only-first-owned-budget");auto before=number_field(query(h2),"sinkPackets");std::this_thread::sleep_for(std::chrono::milliseconds(150));auto state=query(h2);check(number_field(state,"sinkPackets")>before&&number_field(state,"grants")==1&&state.find("\"instanceId\":2,\"displayId\":3")!=std::string::npos,"second-provider-reference-keeps-media-persistent-identity");check(aether_protocol_stop(h2,&final)==AP_OK,"second-handle-stop");drain(h2);check(aether_protocol_destroy(h2)==AP_OK,"second-handle-destroy");write(base/"client-done","done");return check.finish();
 }
 if(scenario=="stop-timeout")callback_delay=2300;
 auto req=request();check(send(h,1,100,1,req)==AP_OK,"request-accepted");auto result=wait_operation(1);
 const bool malformed=scenario=="oversize"||scenario=="schema"||scenario=="sequence"||scenario=="required"||scenario=="duplicate"||scenario=="truncated";
 if(scenario=="no-provider"||scenario=="authority-read-deny"||scenario=="authority-capacity"){check(result==(scenario=="authority-capacity"?AP_BUSY:AP_PERMISSION),"authority-refuses-unsupported-request");check(number_field(query(h),"grants")==0,"authority-denied-zero-grants");}
 else if(malformed){auto expected=scenario=="oversize"?AP_LENGTH:scenario=="sequence"?AP_STALE:scenario=="truncated"?AP_TIMEOUT:AP_FIELD;check(result==expected,"authenticated-malformed-frame-rejected-"+scenario);check(number_field(query(h),"grants")==0&&number_field(query(h),"sinkPackets")==0,"malformed-response-zero-grants-and-sink");}
 else{
  check(result==AP_OK,"exact-supported-proposal");auto state=query(h);check(state.find("\"width\":640")!=std::string::npos&&state.find("\"resources\":[1,0,1,18432000,1228800,4000000]")!=std::string::npos,"proposal-complete-six-dimensional-specs");check(number_field(state,"grants")==0&&number_field(state,"sinkPackets")==0,"proposal-before-confirm-zero-sink");
  if(scenario=="authority-revision")provider_input(base,8);if(scenario=="authority-clock")provider_input(base,7,3,4000);
  auto confirm=confirmation(state);check(send(h,2,100,2,confirm,(scenario=="unknown"||scenario=="readyall-loss")?700:scenario=="stop-timeout"?3000:1500)==AP_OK,"explicit-confirm-accepted");
  if(scenario=="ready-delay"||scenario=="readyack-delay"){std::this_thread::sleep_for(std::chrono::milliseconds(50));check(number_field(query(h),"sinkPackets")==0,"client-sink-stays-closed-before-READY-ACK");}
  if(scenario=="cancel-committed"||scenario=="unknown"){auto until=Clock::now()+std::chrono::seconds(2);while(Clock::now()<until&&!fs::exists(base/"committed"))std::this_thread::sleep_for(std::chrono::milliseconds(2));check(fs::exists(base/"committed"),"host-commit-observed-before-cancel");auto start=Clock::now();check(aether_protocol_control_cancel_operation(h,2)==AP_OK,"cancel-operation-accepts-local-intent");check(aether_protocol_control_cancel_operation(h,2)==AP_OK,"duplicate-local-cancel-intent-idempotent");auto snapshot=query(h);check(Clock::now()-start<std::chrono::milliseconds(50),"query-cancel-short-lock-during-network-wait");(void)snapshot;}
  if(scenario=="cancel-before"){auto until=Clock::now()+std::chrono::seconds(2);while(Clock::now()<until&&!fs::exists(base/"confirm-received"))std::this_thread::sleep_for(std::chrono::milliseconds(2));check(fs::exists(base/"confirm-received")&&!fs::exists(base/"committed"),"received-confirm-not-yet-committed");check(aether_protocol_control_cancel_operation(h,2)==AP_OK,"cancel-before-commit-local-intent");}
  if(scenario=="stop-timeout"){auto until=Clock::now()+std::chrono::seconds(3);while(Clock::now()<until&&!callback_entered)std::this_thread::sleep_for(std::chrono::milliseconds(2));check(callback_entered,"inflight-real-product-callback");auto start=Clock::now();uint64_t final=0;check(aether_protocol_stop(h,&final)==AP_TIMEOUT,"stop-timeout-retains-handle-and-listener");check(Clock::now()-start>=std::chrono::milliseconds(1900)&&Clock::now()-start<std::chrono::milliseconds(2200),"stop-two-second-barrier-bounded");check(aether_protocol_destroy(h)==AP_BUSY,"destroy-refuses-timeout-live-reference");std::this_thread::sleep_for(std::chrono::milliseconds(350));callback_delay=0;}
  else{
   auto status=wait_operation(2);state=query(h);
   if(scenario=="cancel-before"){check(status==AP_CANCELLED,"host-linearized-cancel-before-commit");check(state.find("\"cancelOutcome\":\"cancelled\"")!=std::string::npos&&state.find("\"transactionSequence\":2")!=std::string::npos,"cancelled-authority-receipt-and-transaction");check(number_field(state,"grants")==0&&number_field(state,"sinkPackets")==0,"cancelled-reservation-never-activates");}
   else if(scenario=="unknown"){check(status==AP_TIMEOUT,"deadline-without-authority-result-timeout");check(state.find("\"operationId\":2,\"requestId\":100,\"status\":11,\"terminal\":true,\"resultKnown\":false,\"authorityTerminal\":null")!=std::string::npos&&state.find("\"cancelOutcome\":\"unknown\"")!=std::string::npos,"unknown-never-fabricates-cancel-success");check(number_field(state,"grants")==0,"unknown-result-no-client-activation");}
   else if(scenario=="authority-revision"||scenario=="authority-clock"){check(status==(scenario=="authority-revision"?AP_STALE:AP_EXPIRED),"fixture-authority-rechecks-before-atomic-commit");check(number_field(state,"grants")==0&&number_field(state,"sinkPackets")==0,"changed-authority-never-activates");}
   else if(scenario=="readyall-loss"){check(status==AP_TIMEOUT,"activation-deadline-is-local-timeout");check(state.find("\"resultKnown\":true,\"authorityTerminal\":0,\"transactionSequence\":2,\"activationPhase\":3")!=std::string::npos,"received-commit-stays-known-after-activation-timeout");check(number_field(state,"grants")==0&&number_field(state,"sinkPackets")==0,"unacknowledged-activation-keeps-client-sink-closed");}else if(scenario=="digest"){check(status==AP_STALE,"GRANT-digest-must-match-confirmed-binding");check(number_field(state,"grants")==0&&number_field(state,"sinkPackets")==0,"unbound-GRANT-never-opens-client-sink");}
   else{check(status==AP_OK,"grant-ready-readyack-confirm-terminal");if(scenario=="cancel-committed")check(state.find("\"cancelOutcome\":\"already-committed\"")!=std::string::npos,"committed-confirm-cancel-needs-authority-receipt");auto until=Clock::now()+std::chrono::milliseconds(300);while(Clock::now()<until&&!number_field(query(h),"sinkPackets"))std::this_thread::sleep_for(std::chrono::milliseconds(2));state=query(h);check(number_field(state,"grants")==1&&number_field(state,"sinkPackets")>=1&&!string_field(state,"sinkDigest").empty(),"authenticated-SRTP-video-sink");check(state.find("\"resultKnown\":true")!=std::string::npos&&state.find("\"activationPhase\":4")!=std::string::npos,"authority-active-result-known");}
   if(scenario=="replay"||scenario=="cancel-committed"){auto prior=number_field(query(h),"sinkPackets");std::this_thread::sleep_for(std::chrono::milliseconds(300));check(number_field(query(h),"sinkPackets")>prior,"late-receipt-replay-keeps-healthy-media-progress");}
  }
  if(scenario=="healthy-cancel"){
   auto prior=number_field(query(h),"sinkPackets");check(send(h,3,200,1,req)==AP_OK&&wait_operation(3)==AP_OK,"second-independent-pending-proposal");auto second=confirmation(query(h));check(send(h,4,200,2,second,1500)==AP_OK,"second-confirm-sent");auto until=Clock::now()+std::chrono::seconds(2);while(Clock::now()<until&&read(base/"confirm-received")!="200")std::this_thread::sleep_for(std::chrono::milliseconds(2));check(aether_protocol_control_cancel_operation(h,4)==AP_OK&&wait_operation(4)==AP_CANCELLED,"second-confirm-cancelled-before-commit");check(number_field(query(h),"grants")==1&&number_field(query(h),"sinkPackets")>prior,"cancel-new-request-keeps-existing-health-window");}
  if(scenario=="boundaries"){
   check(aether_protocol_control_ack(h,3)==AP_INVALID_ARGUMENT,"ACK-cannot-jump");check(aether_protocol_control_ack(h,1)==AP_OK&&aether_protocol_control_ack(h,1)==AP_OK,"ACK-next-or-repeat-only");drain(h);
   const std::vector<uint8_t> empty{0,1,0,0};check(send(h,2,100,5,empty)==AP_STALE,"operation-id-replay-rejected");auto duplicate=payload(Fields{{20,std::vector<uint8_t>(8)}});be16(duplicate.data()+2,2);duplicate.insert(duplicate.end(),duplicate.begin()+4,duplicate.end());check(send(h,3,100,3,duplicate)==AP_FIELD,"duplicate-payload-field-rejected");auto mandatory=empty;be16(mandatory.data()+2,1);mandatory.insert(mandatory.end(),{0x80,1,0,0});check(send(h,3,100,5,mandatory)==AP_FIELD,"unknown-required-payload-field-rejected");std::vector<uint8_t> oversized(8193);check(send(h,3,100,5,oversized)==AP_LENGTH,"payload-8193-rejected-before-accept");
   AetherProtocolCommand bad{1,sizeof(bad),1,5,0,1000,3,100,4,2,4,0,empty.data()};check(aether_protocol_control_send(h,&bad)==AP_STALE,"wrong-config-generation-rejected");bad.expected_generation=1;bad.flags=1;check(aether_protocol_control_send(h,&bad)==AP_FIELD,"unknown-command-flags-rejected");bad.flags=0;bad.opcode=14;check(aether_protocol_control_send(h,&bad)==AP_FIELD,"internal-status-not-user-opcode");
   char one='x';uint32_t needed=0;check(aether_protocol_control_query(h,&one,1,&needed)==AP_BUFFER_TOO_SMALL&&one==0&&needed<=65536,"caller-owned-query-NUL-size-bound");
   check(aether_protocol_ack(h,number_field(query(h),"acked")+2)==AP_INVALID_ARGUMENT,"legacy-ACK-cannot-bypass-control-contiguity");auto optional=payload(Fields{{100,{1,2}}});check(send(h,3,1003,11,optional)==AP_OK&&wait_operation(3)==AP_OK,"unknown-optional-field-skipped");drain(h);
   unsigned accepted=0;for(uint64_t op=4;op<36;++op)if(send(h,op,op+1000,11,empty,3000)==AP_OK)++accepted;check(accepted==32,"32-unACKed-commands-retained");check(send(h,36,1036,11,empty)==AP_BUSY,"33rd-command-backpressure-before-accept");check(number_field(query(h),"queueBytes")<=262144,"aggregate-queue-256KiB-bound");
  }
 }
 uint64_t final=0;check(aether_protocol_stop(h,&final)==AP_OK,"stop-joins-native-worker-or-retries-timeout");drain(h);check(aether_protocol_destroy(h)==AP_OK,"destroy-after-contiguous-ACK");size_t count;{std::lock_guard lock(event_mutex);count=events.size();unsigned terminals=0;for(auto& e:events)if(e.op==2&&e.kind==11)++terminals;check(malformed||scenario=="no-provider"||scenario=="authority-read-deny"||scenario=="authority-capacity"||terminals==1,"one-terminal-per-accepted-confirm");}std::this_thread::sleep_for(std::chrono::milliseconds(20));{std::lock_guard lock(event_mutex);check(events.size()==count,"no-callback-after-successful-stop-destroy");}
 write(base/"client-done","done");std::cout<<"CLIENT pid="<<GetCurrentProcessId()<<std::endl;return check.finish();
}
#endif
int main(int argc,char** argv){try{std::cout<<"TAP version 13\n";
#ifdef AETHER_CONTROL_HOST
 need(argc==4&&std::string(argv[1])=="--host","host arguments");return host(argv[2],argv[3]);
#else
 #ifdef AETHER_IOS_CONTRACT
 (void)argc;(void)argv;return 2;
#else
 if(argc==5&&std::string(argv[1])=="--client")return control_client(argv[2],argv[3],static_cast<unsigned>(std::stoul(argv[4])));
#ifdef _WIN32
 wchar_t path[MAX_PATH];need(GetModuleFileNameW(nullptr,path,MAX_PATH)>0,"exe path");
#else
 auto path=fs::canonical(argv[0]);
#endif
need(argc==2||argc==4,"orchestrator arguments");std::string selected;if(argc==4){need(std::string(argv[2])=="--scenario","scenario option");selected=argv[3];}return orchestrate(path,selected);
#endif
#endif
 }catch(const std::exception& e){std::cerr<<"fixture failure: "<<e.what()<<std::endl;return 2;}catch(...){std::cerr<<"fixture failure: native boundary\n";return 2;}}
