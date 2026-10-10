#ifdef AETHER_CONTROL_HOST
#include "internal.h"
#else
#include "aether/protocol.h"
#endif
#include <windows.h>
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
struct Check {unsigned count=0,failed=0;void operator()(bool ok,const std::string& name){++count;std::cout<<(ok?"ok ":"not ok ")<<count<<" - "<<name<<std::endl;if(!ok)++failed;}int finish(){std::cout<<"1.."<<count<<"\n# tests "<<count<<"\n# pass "<<count-failed<<"\n# fail "<<failed<<"\n# skipped 0\n";return failed?1:0;}};
void need(bool value,const char* reason){if(!value)throw std::runtime_error(reason);}
std::mutex event_mutex;struct Event{uint64_t seq,op;uint32_t kind;int32_t status;};std::vector<Event> events;
void callback(uint64_t,uint64_t seq,uint32_t kind,int32_t status,uint64_t op){std::lock_guard lock(event_mutex);events.push_back({seq,op,kind,status});}
std::string read(const fs::path& p){std::ifstream f(p);return {std::istreambuf_iterator<char>(f),{}};}
void write(const fs::path& p,const std::string& text){std::ofstream(p)<<text;}
void be16(uint8_t* b,uint16_t n){b[0]=static_cast<uint8_t>(n>>8);b[1]=static_cast<uint8_t>(n);}
void be32(uint8_t* b,uint32_t n){for(int i=3;i>=0;--i){b[i]=static_cast<uint8_t>(n);n>>=8;}}
void be64(uint8_t* b,uint64_t n){for(int i=7;i>=0;--i){b[i]=static_cast<uint8_t>(n);n>>=8;}}
using Fields=std::map<uint16_t,std::vector<uint8_t>>;
void scalar(Fields& f,uint16_t t,uint64_t v,size_t size){std::vector<uint8_t> b(size);if(size==4)be32(b.data(),static_cast<uint32_t>(v));else be64(b.data(),v);f[t]=std::move(b);}
std::vector<uint8_t> payload(const Fields& fields){std::vector<uint8_t> b(4);be16(b.data(),1);be16(b.data()+2,static_cast<uint16_t>(fields.size()));for(auto& [t,v]:fields){auto p=b.size();b.resize(p+4+v.size());be16(b.data()+p,t);be16(b.data()+p+2,static_cast<uint16_t>(v.size()));std::copy(v.begin(),v.end(),b.begin()+p+4);}return b;}
std::vector<uint8_t> request(){Fields f;scalar(f,1,2,4);scalar(f,2,1,4);scalar(f,3,3000,4);std::vector<uint8_t> specs(58);be16(specs.data(),1);be64(specs.data()+2,4);be64(specs.data()+10,3);size_t p=18;for(auto n:{1u,1u,640u,480u,60u,1u,4000000u,1u,1u,0u}){be32(specs.data()+p,n);p+=4;}f[4]=std::move(specs);f[5]={0,0};return payload(f);}
std::string string_field(const std::string& json,const std::string& name){auto p=json.find('"'+name+"\":\"");need(p!=std::string::npos,"missing string");p+=name.size()+4;auto end=json.find('"',p);return json.substr(p,end-p);}
uint64_t number_field(const std::string& json,const std::string& name){auto p=json.find('"'+name+"\":");need(p!=std::string::npos,"missing number");return std::stoull(json.substr(p+name.size()+3));}
std::string query(uint64_t h){uint32_t n=0;need(aether_protocol_control_query(h,nullptr,0,&n)==AP_BUFFER_TOO_SMALL&&n<=65536,"query bounds");std::vector<char> b(n);need(aether_protocol_control_query(h,b.data(),n,&n)==AP_OK,"query copy");return b.data();}
bool terminal(uint64_t op,int32_t& status){std::lock_guard lock(event_mutex);for(auto& e:events)if(e.op==op&&e.kind==11){status=e.status;return true;}return false;}
int32_t wait(uint64_t op){auto until=Clock::now()+std::chrono::seconds(4);int32_t status=AP_BUSY;while(Clock::now()<until){if(terminal(op,status))return status;std::this_thread::sleep_for(std::chrono::milliseconds(2));}return AP_TIMEOUT;}
void drain(uint64_t h){std::vector<Event> copy;{std::lock_guard lock(event_mutex);copy=events;}for(auto& e:copy)need(aether_protocol_control_ack(h,e.seq)==AP_OK,"strict ack");}
int32_t send(uint64_t h,uint64_t op,uint64_t req,uint32_t opcode,const std::vector<uint8_t>& b,uint32_t deadline=1000){AetherProtocolCommand command{1,sizeof(command),1,opcode,0,deadline,op,req,4,1,static_cast<uint32_t>(b.size()),0,b.data()};return aether_protocol_control_send(h,&command);}
std::vector<uint8_t> confirmation(const std::string& json){Fields f;auto digest=string_field(json,"digest");std::vector<uint8_t> d;for(size_t i=0;i<digest.size();i+=2)d.push_back(static_cast<uint8_t>(std::stoul(digest.substr(i,2),nullptr,16)));f[6]=std::move(d);scalar(f,7,number_field(json,"hostRevision"),8);scalar(f,8,number_field(json,"expiryToken"),8);return payload(f);}
struct Child {
 HANDLE process=nullptr,thread=nullptr;
 Child()=default;Child(const Child&)=delete;Child& operator=(const Child&)=delete;
 ~Child(){if(process)CloseHandle(process);if(thread)CloseHandle(thread);}
 void launch(const fs::path& exe,const std::vector<std::string>& args,const fs::path& log){
  std::wstring command=L"\""+exe.wstring()+L"\"";for(auto& arg:args){need(arg.find('"')==std::string::npos,"argument quote");command+=L" \""+fs::path(arg).wstring()+L"\"";}
  SECURITY_ATTRIBUTES sa{sizeof(sa),nullptr,TRUE};HANDLE out=CreateFileW(log.c_str(),GENERIC_WRITE,FILE_SHARE_READ|FILE_SHARE_WRITE,&sa,CREATE_ALWAYS,FILE_ATTRIBUTE_NORMAL,nullptr);need(out!=INVALID_HANDLE_VALUE,"log open");STARTUPINFOW start{};start.cb=sizeof(start);start.dwFlags=STARTF_USESTDHANDLES;start.hStdOutput=out;start.hStdError=out;start.hStdInput=GetStdHandle(STD_INPUT_HANDLE);PROCESS_INFORMATION info{};
  auto ok=CreateProcessW(exe.c_str(),command.data(),nullptr,nullptr,TRUE,CREATE_NO_WINDOW,nullptr,nullptr,&start,&info);CloseHandle(out);need(ok!=FALSE,"process create");process=info.hProcess;thread=info.hThread;
 }
 DWORD join(){if(WaitForSingleObject(process,20000)!=WAIT_OBJECT_0){TerminateProcess(process,124);WaitForSingleObject(process,2000);return 124;}DWORD exit=0;need(GetExitCodeProcess(process,&exit)!=FALSE,"process exit");return exit;}
};
AetherProtocolConfig config(const fs::path& base,bool host,unsigned port){static std::array<std::string,4> strings;strings={(base/(host?"host.pem":"client.pem")).string(),(base/(host?"host.key":"client.key")).string(),(base/"trust.pem").string(),host?"aether-client.local":"aether-host.local"};AetherProtocolConfig c{};c.abi_version=1;c.struct_size=sizeof(c);c.role=host?1:2;c.deadline_ms=3000;c.peer_control_port=port;c.host_id=1;c.instance_id=2;c.display_id=3;c.stream_id=4;c.connection_id=5;c.client_id=6;c.lease_epoch=1;c.config_generation=1;c.key_generation=1;c.certificate_file=strings[0].c_str();c.private_key_file=strings[1].c_str();c.trust_file=strings[2].c_str();c.peer_name=strings[3].c_str();c.version_count=1;c.versions[0]=3;c.permission_read=1;return c;}
#ifdef AETHER_CONTROL_HOST
using namespace aether::protocol;
class FixtureServices final:public HostServices {
 std::mutex mutex;std::map<std::pair<uint64_t,uint64_t>,Reservation> reservations;uint64_t sequence=0;
 ResourceVector capacity{4,2,4,300000000,67108864,100000000};
 bool fits(const Reservation& r){auto totals=r.resources.values();for(auto& [key,value]:reservations)if(key!=std::pair{r.binding.identity.connection,r.binding.request_id}&&(value.phase==1||value.phase==3||value.phase==4)){auto v=value.resources.values();for(size_t i=0;i<6;++i){if(v[i]>UINT64_MAX-totals[i])return false;totals[i]+=v[i];}}auto limit=capacity.values();for(size_t i=0;i<6;++i)if(totals[i]>limit[i])return false;return true;}
 Reservation& owned(Reservation& r){auto i=reservations.find({r.binding.identity.connection,r.binding.request_id});require(i!=reservations.end()&&i->second.binding.digest==r.binding.digest,AP_STALE);return i->second;}
public:
 unsigned commits=0,activations=0; bool delayed=false;
 uint64_t host_id()const override{return 1;}
 HostSnapshot snapshot(const Binding& b)override{std::lock_guard lock(mutex);HostSnapshot s;s.host_id=1;s.revision=7;s.expiry_token=9001;s.capacity=capacity;s.controller=b.identity;s.read_allowed=true;s.control_allowed=true;return s;}
 int32_t reserve(Reservation& r,uint32_t)override{std::lock_guard lock(mutex);if(r.revision!=7)return AP_STALE;if(!fits(r))return AP_BUSY;r.transaction_sequence=++sequence;reservations[{r.binding.identity.connection,r.binding.request_id}]=r;return AP_OK;}
 int32_t commit(Reservation& r)override{std::lock_guard lock(mutex);auto& value=owned(r);if(value.phase==2){r=value;return AP_CANCELLED;}if(value.phase>=3){r=value;return AP_OK;}if(Clock::now()>=value.expiry)return AP_EXPIRED;if(!fits(r))return AP_BUSY;value.binding.operation_id=r.binding.operation_id;value.phase=3;value.authority_terminal=AP_OK;value.transaction_sequence=++sequence;value.activation_expiry=Clock::now()+std::chrono::milliseconds(3000);++commits;r=value;if(delayed)std::this_thread::sleep_for(std::chrono::milliseconds(150));return AP_OK;}
 int32_t cancel(Reservation& r)override{std::lock_guard lock(mutex);auto& value=owned(r);if(value.phase>=3){r=value;return AP_ALREADY_COMPLETE;}if(value.phase!=2){value.phase=2;value.authority_terminal=AP_CANCELLED;value.transaction_sequence=++sequence;}r=value;return AP_CANCELLED;}
 int32_t activate(Reservation& r)override{std::lock_guard lock(mutex);auto& value=owned(r);if(value.phase==4){r=value;return AP_OK;}if(value.phase!=3)return AP_STALE;if(Clock::now()>=value.activation_expiry){value.phase=5;value.transaction_sequence=++sequence;r=value;return AP_EXPIRED;}value.phase=4;value.transaction_sequence=++sequence;++activations;r=value;return AP_OK;}
 int32_t status(Reservation& r)override{std::lock_guard lock(mutex);r=owned(r);return r.authority_terminal;}
 void release_connection(uint64_t id)override{std::lock_guard lock(mutex);for(auto& [key,value]:reservations)if(key.first==id&&value.phase!=2&&value.phase!=5){value.phase=5;value.transaction_sequence=++sequence;}}
 int32_t fresh_auth_result(const Binding&,Identity&)override{return AP_VERSION;}
 int32_t check_permission_device(const Binding&,uint32_t)override{return AP_PERMISSION;}
 unsigned owned_count(){std::lock_guard lock(mutex);unsigned count=0;for(auto& [key,value]:reservations)if(value.phase==1||value.phase==3||value.phase==4)++count;return count;}
};
int host(const fs::path& base,const std::string& scenario){uint64_t h=0;auto c=config(base,true,0);need(aether_protocol_create(&c,callback,&h)==AP_OK,"host create");auto provider=std::make_shared<FixtureServices>();provider->delayed=scenario=="cancel-committed";if(scenario!="no-provider")need(attach_host_services(h,provider)==AP_OK,"native attach");uint32_t n=0;aether_protocol_query(h,nullptr,0,&n);std::vector<char> b(n);need(aether_protocol_query(h,b.data(),n,&n)==AP_OK,"port query");write(base/"ready",std::to_string(number_field(b.data(),"controlPort")));AetherProtocolControlOpen open{1,sizeof(open),1,0,0,0,nullptr};need(aether_protocol_control_open(h,&open)==AP_OK,"host open");auto until=Clock::now()+std::chrono::seconds(8);while(Clock::now()<until&&!fs::exists(base/"client-done"))std::this_thread::sleep_for(std::chrono::milliseconds(5));uint64_t final=0;need(aether_protocol_stop(h,&final)==AP_OK,"host stop");drain(h);need(aether_protocol_destroy(h)==AP_OK,"host destroy");std::cout<<"HOST pid="<<GetCurrentProcessId()<<" commits="<<provider->commits<<" activations="<<provider->activations<<" owned="<<provider->owned_count()<<std::endl;return 0;}
#else
int client(const fs::path& base,const std::string& scenario,unsigned port){Check check;uint64_t h=0;auto c=config(base,false,port);need(aether_protocol_create(&c,callback,&h)==AP_OK,"client create");std::vector<uint8_t> hello{'A','E','T','H',0,16,1,1,0,3,0,8,0,2,0,1};AetherProtocolControlOpen open{1,sizeof(open),1,0,static_cast<uint32_t>(hello.size()),0,hello.data()};check(aether_protocol_control_open(h,&open)==AP_OK,"control-open-copies-hello");check(wait(0)==AP_OK,"fresh-TLS3-schema1-open");check(number_field(query(h),"grants")==0&&number_field(query(h),"sinkPackets")==0,"hello-never-grants-media");check(aether_protocol_submit(h,hello.data(),static_cast<uint32_t>(hello.size()))==AP_BUSY,"legacy-submit-control-mode-exclusive");auto req=request();check(send(h,1,100,1,req)==AP_OK,"request-accepted");auto result=wait(1);if(scenario=="no-provider"){check(result==AP_PERMISSION,"product-without-provider-refuses");check(number_field(query(h),"grants")==0,"no-provider-zero-grants");}else{check(result==AP_OK,"exact-supported-proposal");auto state=query(h);check(state.find("\"width\":640")!=std::string::npos&&state.find("\"resources\":[1,0,1,18432000,1228800,4000000]")!=std::string::npos,"proposal-complete-six-dimensional-specs");check(number_field(state,"grants")==0&&number_field(state,"sinkPackets")==0,"proposal-before-confirm-zero-sink");auto confirm=confirmation(state);check(send(h,2,100,2,confirm)==AP_OK,"explicit-confirm-accepted");if(scenario=="cancel-committed"){std::this_thread::sleep_for(std::chrono::milliseconds(20));check(aether_protocol_control_cancel_operation(h,2)==AP_OK,"cancel-operation-accepts-local-intent");}check(wait(2)==AP_OK,"grant-ready-readyack-confirm-terminal");if(scenario=="cancel-committed")check(query(h).find("\"cancelOutcome\":\"already-committed\"")!=std::string::npos,"committed-confirm-cancel-needs-authority-receipt");state=query(h);check(number_field(state,"grants")==1&&number_field(state,"sinkPackets")==1&&!string_field(state,"sinkDigest").empty(),"authenticated-SRTP-video-sink");check(state.find("\"resultKnown\":true")!=std::string::npos&&state.find("\"activationPhase\":4")!=std::string::npos,"authority-active-result-known");}
 uint64_t final=0;check(aether_protocol_stop(h,&final)==AP_OK,"stop-joins-native-worker");drain(h);check(aether_protocol_destroy(h)==AP_OK,"destroy-after-ACK");auto count=events.size();std::this_thread::sleep_for(std::chrono::milliseconds(20));check(events.size()==count,"no-callback-after-destroy");write(base/"client-done","done");std::cout<<"CLIENT pid="<<GetCurrentProcessId()<<std::endl;return check.finish();}
int orchestrate(const fs::path& exe){Check check;fs::path root=fs::current_path();while(!fs::exists(root/"native/protocol/CMakeLists.txt")&&root.has_parent_path()&&root!=root.parent_path())root=root.parent_path();need(fs::exists(root/"native/protocol/CMakeLists.txt"),"workspace root");auto base=root/"build/phase06/control-fixtures";fs::create_directories(base);auto run=base/std::to_string(GetCurrentProcessId());fs::create_directories(run);auto openssl=root/"build/phase06/dependencies/openssl-install/bin/openssl.exe";for(auto id:{"host","client"}){Child child;std::string hostname=std::string("aether-")+id+".local";child.launch(openssl,{"req","-x509","-newkey","ED25519","-noenc","-keyout",(run/(std::string(id)+".key")).string(),"-out",(run/(std::string(id)+".pem")).string(),"-subj","/CN="+hostname,"-addext","subjectAltName=DNS:"+hostname,"-days","1","-config","NUL"},run/(std::string(id)+"-cert.log"));need(child.join()==0,"fixture certificate");}write(run/"trust.pem",read(run/"host.pem")+read(run/"client.pem"));
 for(auto scenario:{"exact","no-provider","cancel-committed"}){auto dir=run/scenario;fs::create_directories(dir);for(auto file:{"host.pem","host.key","client.pem","client.key","trust.pem"})fs::copy_file(run/file,dir/file,fs::copy_options::overwrite_existing);Child host_child,client_child;host_child.launch(exe.parent_path()/"aether_protocol_control_host.exe",{"--host",dir.string(),scenario},dir/"host.log");auto until=Clock::now()+std::chrono::seconds(4);while(Clock::now()<until&&!fs::exists(dir/"ready"))std::this_thread::sleep_for(std::chrono::milliseconds(2));need(fs::exists(dir/"ready"),"host ready deadline");client_child.launch(exe,{"--client",dir.string(),scenario,read(dir/"ready")},dir/"client.log");auto client_exit=client_child.join();write(dir/"client-done","done");auto host_exit=host_child.join();auto client_log=read(dir/"client.log"),host_log=read(dir/"host.log");std::cout<<client_log<<host_log;check(client_exit==0&&host_exit==0&&client_log.find("# tests 0")==std::string::npos&&client_log.find("not ok")==std::string::npos,std::string("two-PID-real-DLL-")+scenario);check(host_log.find("owned=0")!=std::string::npos,std::string("host-six-dimensional-owned-cleanup-")+scenario);if(std::string(scenario)=="exact")check(host_log.find("commits=1 activations=1")!=std::string::npos,"provider-one-commit-one-activation");}
 check(sizeof(AetherProtocolConfig)==176&&offsetof(AetherProtocolConfig,certificate_file)==96&&sizeof(AetherProtocolControlOpen)==32&&sizeof(AetherProtocolCommand)==72,"x64-ABI1-preserved-additive-layout");return check.finish();}
#endif
}
int main(int argc,char** argv){try{std::cout<<"TAP version 13\n";
#ifdef AETHER_CONTROL_HOST
 need(argc==4&&std::string(argv[1])=="--host","host arguments");return host(argv[2],argv[3]);
#else
 if(argc==5&&std::string(argv[1])=="--client")return client(argv[2],argv[3],static_cast<unsigned>(std::stoul(argv[4])));wchar_t path[MAX_PATH];need(GetModuleFileNameW(nullptr,path,MAX_PATH)>0,"exe path");return orchestrate(path);
#endif
 }catch(const std::exception& e){std::cerr<<"fixture failure: "<<e.what()<<std::endl;return 2;}catch(...){std::cerr<<"fixture failure: native boundary\n";return 2;}}
