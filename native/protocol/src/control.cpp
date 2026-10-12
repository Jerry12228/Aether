#include "internal.h"
#include <algorithm>
#include <cstring>
#include <sstream>
#include <optional>
#include <openssl/err.h>
#ifdef __APPLE__
#include <pthread.h>
#include <pthread/qos.h>
#endif
#ifdef AETHER_CONTROL_FIXTURE
#include <iostream>
#endif
namespace aether::protocol {
using Clock=std::chrono::steady_clock;
namespace ctl {
using Fields=std::map<uint16_t,std::vector<uint8_t>>;
Fields fields(const std::vector<uint8_t>& b){
 require(b.size()>=4&&b.size()<=8192,AP_LENGTH);require(u16(b.data())==1&&u16(b.data()+2)<=32,AP_FIELD);
 Fields out;std::set<uint16_t> seen;size_t offset=4;for(unsigned i=0;i<u16(b.data()+2);++i){require(offset+4<=b.size(),AP_LENGTH);auto t=u16(b.data()+offset),n=u16(b.data()+offset+2);offset+=4;require(t&&!(t&0x8000)&&seen.insert(t).second,AP_FIELD);require(n<=b.size()-offset,AP_LENGTH);if(t<=21)out.emplace(t,std::vector<uint8_t>(b.begin()+offset,b.begin()+offset+n));offset+=n;}require(offset==b.size(),AP_LENGTH);return out;
}
const std::vector<uint8_t>& item(const Fields& f,uint16_t t,size_t n){auto i=f.find(t);require(i!=f.end()&&i->second.size()==n,AP_FIELD);return i->second;}
uint32_t number(const Fields& f,uint16_t t){return u32(item(f,t,4).data());}
uint64_t wide(const Fields& f,uint16_t t){return u64(item(f,t,8).data());}
void add(Fields& f,uint16_t t,uint64_t v,size_t n){std::vector<uint8_t> b(n);if(n==4)put32(b.data(),static_cast<uint32_t>(v));else put64(b.data(),v);f[t]=std::move(b);}
std::vector<uint8_t> encode(const Fields& f){std::vector<uint8_t> b(4);put16(b.data(),1);put16(b.data()+2,static_cast<uint16_t>(f.size()));for(const auto& [t,v]:f){require(v.size()<=6144,AP_LENGTH);auto p=b.size();b.resize(p+4+v.size());put16(b.data()+p,t);put16(b.data()+p+2,static_cast<uint16_t>(v.size()));std::copy(v.begin(),v.end(),b.begin()+p+4);}require(b.size()<=8192,AP_LENGTH);return b;}
std::string hex(const std::vector<uint8_t>& b){constexpr char h[]="0123456789abcdef";std::string s;for(auto v:b){s+=h[v>>4];s+=h[v&15];}return s;}
Identity identity(const ConnectionContext& c){const auto& x=c.config;return {x.host_id,x.instance_id,x.display_id,x.stream_id,x.connection_id,x.client_id,x.lease_epoch,x.config_generation,x.key_generation};}
uint64_t mul(uint64_t a,uint64_t b){require(!a||b<=UINT64_MAX/a,AP_LENGTH);return a*b;}
uint64_t plus(uint64_t a,uint64_t b){require(b<=UINT64_MAX-a,AP_LENGTH);return a+b;}
std::string resources(const ResourceVector& r){std::ostringstream s;s<<'[';bool first=true;for(auto v:r.values()){if(!first)s<<',';first=false;s<<v;}s<<']';return s.str();}
void hello(const std::vector<uint8_t>& b){uint32_t version=0,side=0,local=3;require(aether_protocol_negotiate(b.data(),static_cast<uint32_t>(b.size()),&local,1,&version,&side)==AP_OK&&version==3,AP_VERSION);bool schema=false;for(size_t p=8+2*b[7];p<b.size();){auto t=u16(b.data()+p),n=u16(b.data()+p+2);p+=4;if(t==8){require(n==2&&u16(b.data()+p)==1,AP_VERSION);schema=true;}p+=n;}require(schema,AP_VERSION);}
struct Record {uint16_t opcode=0;uint32_t flags=0;uint64_t operation=0,request=0,sequence=0;Identity identity;std::vector<uint8_t> payload;};
std::vector<uint8_t> record(const Record& r){require(r.payload.size()<=8192,AP_LENGTH);std::vector<uint8_t> b(124+r.payload.size());put32(b.data(),static_cast<uint32_t>(b.size()-4));auto h=b.data()+4;std::memcpy(h,"ACTL",4);put16(h+4,1);put16(h+6,r.opcode);put32(h+8,r.flags);put32(h+12,static_cast<uint32_t>(r.payload.size()));put64(h+16,r.operation);put64(h+24,r.request);put64(h+32,r.sequence);const auto& i=r.identity;size_t p=40;for(auto v:{i.host,i.instance,i.display,i.stream,i.connection,i.client,i.lease,i.config,i.key,uint64_t{3}}){put64(h+p,v);p+=8;}std::copy(r.payload.begin(),r.payload.end(),b.begin()+124);return b;}
Record receive(ConnectionContext& c,uint64_t& sequence){std::array<uint8_t,4> n{};read_tls(c,n.data(),4);auto size=u32(n.data());require(size>=120&&size<=8312,AP_LENGTH);std::array<uint8_t,120> h{};read_tls(c,h.data(),120);require(!std::memcmp(h.data(),"ACTL",4)&&u16(h.data()+4)==1,AP_FIELD);Record r;r.opcode=u16(h.data()+6);r.flags=u32(h.data()+8);require(r.opcode>=1&&r.opcode<=14&&r.flags<=2,AP_FIELD);require(u32(h.data()+12)==size-120,AP_LENGTH);r.operation=u64(h.data()+16);r.request=u64(h.data()+24);r.sequence=u64(h.data()+32);require(r.sequence==sequence+1,AP_STALE);const auto current=identity(c);std::array<uint64_t,10> expected{current.host,current.instance,current.display,u64(h.data()+64),current.connection,current.client,current.lease,current.config,current.key,3};for(size_t i=0;i<10;++i)require(u64(h.data()+40+8*i)==expected[i],i==9?AP_VERSION:i>=6?AP_STALE:AP_IDENTITY);r.identity=current;r.identity.stream=u64(h.data()+64);require(!r.identity.stream||r.identity.stream==current.stream,AP_IDENTITY);r.payload.resize(size-120);read_tls(c,r.payload.data(),r.payload.size());(void)fields(r.payload);sequence=r.sequence;return r;}
void transmit(ConnectionContext& c,Record r,uint64_t& seq){write_control_sequence(seq,[&](uint64_t next){r.sequence=next;auto b=record(r);write_tls(c,b.data(),b.size());});}
}
struct ControlState {
 struct Command {AetherProtocolCommand meta{};std::vector<uint8_t> payload;};
 struct Result {uint64_t operation=0,request=0,event=0,transaction=0;int32_t status=AP_BUSY,authority=AP_BUSY;uint32_t opcode=0;bool terminal=false,known=false;uint32_t phase=1;std::string cancel="none",digest;};
 std::mutex mutex;std::condition_variable wake;std::thread worker;
 std::atomic<bool> stopping{false};bool finished=false,opened=false;uint64_t last_operation=0,published=0,acked=0,tx=0,rx=0;
 uint32_t queued_bytes=0,grants=0,sinks=0,peer_udp=0;std::string proposal="null",digest,sink_digest;uint64_t revision=0,expiry=0;
 std::deque<Command> commands;std::map<uint64_t,Result> results;std::deque<std::pair<uint64_t,uint64_t>> events;std::set<uint64_t> cancellations;
 struct Outgoing {ctl::Record record;Clock::time_point due;bool replay=false;uint32_t mutation=0;};
 struct Deferred {ctl::Record record;Clock::time_point due;};
 std::deque<Outgoing> outgoing;std::deque<Deferred> deferred;
 std::vector<uint8_t> incoming;Clock::time_point frame_deadline{};
 std::map<uint64_t,Command> unresolved;
 std::map<uint64_t,Result> retired_results;
 RecoveryController recovery;TraceWindow trace;std::atomic<bool> retry_cancel{false};bool reattached=false;int32_t reattach_status=AP_OK;std::vector<uint8_t> hello_bytes;uint32_t fresh_authentications=1,policy_accepted=0,policy_rejected=0;std::string recovery_state="manual",recovery_reason="none";uint64_t current_connection=0,current_lease=0,current_key=0,authority_connection=0;uint32_t retry_attempts=0;uint64_t trace_remaining=0;
 uint64_t media_index=1,rejected_frames=0;uint32_t active_mask=0,round=1,media_progress=0,peak_queue=0;bool multi=false;std::string media_stats="[]";int32_t failure_status=AP_OK;
 Clock::time_point next_media{};
 std::timed_mutex transport_mutex,stop_mutex;
 std::map<uint64_t,Reservation> reservations;std::string snapshot;
 ~ControlState(){if(worker.joinable())worker.join();}
};
namespace ctl {
void snapshot(ConnectionContext& c,ControlState& s){std::ostringstream j;j<<"{\"connectionId\":"<<s.current_connection<<",\"leaseEpoch\":"<<s.current_lease<<",\"keyGeneration\":"<<s.current_key<<",\"freshAuthentications\":"<<s.fresh_authentications<<",\"policyAccepted\":"<<s.policy_accepted<<",\"policyRejected\":"<<s.policy_rejected<<",\"recovery\":{\"state\":\""<<s.recovery_state<<"\",\"reason\":\""<<s.recovery_reason<<"\",\"attempts\":"<<s.retry_attempts<<"},\"trace\":{\"enabled\":"<<(s.trace.enabled?"true":"false")<<",\"remainingMs\":"<<s.trace_remaining<<",\"bytes\":"<<s.trace.bytes<<",\"limitBytes\":"<<s.trace.limit_bytes<<"},\"summary\":{\"mode\":\"allowlist\",\"status\":"<<s.failure_status<<"},";j<<"\"mediaMask\":"<<s.active_mask<<",\"controlProgress\":"<<s.media_progress<<",\"peakQueueBytes\":"<<s.peak_queue<<",\"streams\":"<<s.media_stats<<",\"lastFailure\":"<<s.failure_status<<",\"queryVersion\":2,\"commandVersion\":1,\"selectedVersion\":"<<(s.opened?3:0)<<",\"authenticated\":"<<(s.opened?"true":"false")<<",\"grants\":"<<s.grants<<",\"sinkPackets\":"<<s.sinks<<",\"sinkDigest\":\""<<s.sink_digest<<"\",\"sequence\":"<<s.published<<",\"acked\":"<<s.acked<<",\"queueBytes\":"<<s.queued_bytes<<",\"proposal\":"<<s.proposal<<",\"hostRevision\":"<<s.revision<<",\"expiryToken\":"<<s.expiry<<",\"persistentIdentity\":{\"instanceId\":"<<c.config.instance_id<<",\"displayId\":"<<c.config.display_id<<"},\"operations\":[";bool comma=false;for(auto& [id,r]:s.results){if(comma)j<<',';comma=true;j<<"{\"operationId\":"<<id<<",\"requestId\":"<<r.request<<",\"status\":"<<r.status<<",\"terminal\":"<<(r.terminal?"true":"false")<<",\"resultKnown\":"<<(r.known?"true":"false")<<",\"authorityTerminal\":"<<(r.known?std::to_string(r.authority):"null")<<",\"transactionSequence\":"<<r.transaction<<",\"activationPhase\":"<<r.phase<<",\"cancelOutcome\":\""<<r.cancel<<"\"}";}j<<"],\"threads\":"<<(s.finished?0:1)<<",\"stopped\":"<<(c.stopped?"true":"false")<<'}';s.snapshot=j.str();require(s.snapshot.size()<=65535,AP_LENGTH);}
void event(ConnectionContext& c,ControlState& s,uint64_t op,int32_t status,bool known,uint64_t transaction=0,uint32_t phase=1,uint32_t kind=11){uint64_t seq;{std::lock_guard lock(s.mutex);if(kind==11){auto& r=s.results[op];if(r.terminal)return;if(r.opcode==5&&status!=AP_OK&&s.cancellations.count(op)){status=AP_CANCELLED;s.active_mask=0;s.recovery_state="manual";s.recovery_reason="cancelled";r.cancel="cancelled";}r.operation=op;r.status=status;r.known=r.known||known;if(known&&r.authority==AP_BUSY)r.authority=status;r.transaction=transaction;r.phase=phase;r.terminal=true;}size_t pending=0;for(auto& [id,result]:s.results){(void)id;if(!result.terminal)++pending;}if(kind!=11&&kind!=15&&s.events.size()+pending+2>=256)return;seq=++s.published;if(kind==11)s.results[op].event=seq;s.events.emplace_back(seq,kind==11?op:UINT64_MAX);snapshot(c,s);}c.callback(c.token,seq,kind,status,op);}
Record response(ConnectionContext& c,const Record& request,int32_t status,const Reservation* r=nullptr,const std::string& proposal=""){Record out=request;out.identity=identity(c);out.identity.stream=request.identity.stream;out.flags=1;Fields f;add(f,12,status,4);add(f,13,status,4);add(f,14,3,4);if(!proposal.empty())f[15]={proposal.begin(),proposal.end()};if(r){std::vector<uint8_t> digest;for(size_t i=0;i<r->binding.digest.size();i+=2)digest.push_back(static_cast<uint8_t>(std::stoul(r->binding.digest.substr(i,2),nullptr,16)));f[6]=std::move(digest);add(f,18,r->transaction_sequence,8);add(f,19,r->phase,4);add(f,20,request.operation,8);if(r->phase==3)add(f,21,3000,4);}out.payload=encode(f);return out;}
bool ready(ConnectionContext& c){return SSL_pending(c.tls.get())>0||datagram_ready(c.tcp.value,Clock::now()+std::chrono::milliseconds(20));}
void negotiate_control(ConnectionContext& c,ControlState& s,const std::vector<uint8_t>& data){c.exchange_deadline=Clock::now()+std::chrono::milliseconds(c.config.deadline_ms);handshake(c);std::array<uint8_t,4> n{};if(c.config.role==2){put32(n.data(),static_cast<uint32_t>(data.size()));write_tls(c,n.data(),4);write_tls(c,data.data(),data.size());}else{read_tls(c,n.data(),4);auto size=u32(n.data());require(size>=10&&size<=512,AP_LENGTH);std::vector<uint8_t> b(size);read_tls(c,b.data(),b.size());hello(b);bool local=false;for(unsigned i=0;i<c.config.version_count;++i)if(c.config.versions[i]==3)local=true;require(local,AP_VERSION);}
 if(c.config.role==1){put32(n.data(),3);write_tls(c,n.data(),4);}else{read_tls(c,n.data(),4);require(u32(n.data())==3,AP_VERSION);}
 c.selected=3;std::array<uint8_t,82> binding{};auto id=identity(c);size_t p=0;for(auto v:{id.host,id.instance,id.display,id.stream,id.connection,id.client,id.lease,id.config,id.key,uint64_t{3}}){put64(binding.data()+p,v);p+=8;}put16(binding.data()+80,static_cast<uint16_t>(c.udp_port));auto local=binding;if(c.config.role==1){write_tls(c,local.data(),82);read_tls(c,binding.data(),82);}else{read_tls(c,binding.data(),82);write_tls(c,local.data(),82);}require(!std::memcmp(binding.data(),local.data(),80),AP_IDENTITY);s.peer_udp=u16(binding.data()+80);require(s.peer_udp!=0,AP_FIELD);{std::lock_guard lock(s.mutex);s.opened=true;s.current_connection=id.connection;s.current_lease=id.lease;s.current_key=id.key;snapshot(c,s);}event(c,s,0,AP_OK,true,0,1,s.recovery_state=="reconnecting"?10:11);
}
void retire_transport(ConnectionContext& c,ControlState& s){
 c.streams.clear();if(c.srtp){srtp_dealloc(c.srtp);c.srtp=nullptr;}c.tls.reset();c.tcp.reset();c.authenticated=false;c.queue_bytes=0;
 while(datagram_ready(c.udp.value,Clock::now()+std::chrono::milliseconds(1))){std::array<char,1500> old{};recv(c.udp.value,old.data(),static_cast<int>(old.size()),0);}
 s.incoming.clear();s.outgoing.clear();s.deferred.clear();s.reservations.clear();s.tx=s.rx=0;s.round=1;s.media_index=1;s.active_mask&=7;s.multi=s.active_mask!=1;c.media_fault_stream=0;
 std::lock_guard lock(s.mutex);s.opened=false;s.trace={};s.trace_remaining=0;s.media_stats="[]";s.recovery_state="reconnecting";s.recovery_reason="fresh-auth-required";snapshot(c,s);
}
int32_t reconnect(ConnectionContext& c,ControlState& s){
 require(c.config.connection_id<=UINT64_MAX-100&&c.config.lease_epoch<UINT64_MAX&&c.config.key_generation<UINT64_MAX,AP_STALE);
 retire_transport(c,s);c.config.connection_id+=100;++c.config.lease_epoch;++c.config.key_generation;const auto original_deadline=c.config.deadline_ms;c.config.deadline_ms=600;
 int32_t status=AP_TIMEOUT;for(unsigned attempt=0;attempt<s.recovery.maximum_attempts;++attempt){if(s.stopping||s.retry_cancel){status=AP_CANCELLED;break;}s.recovery.attempts=attempt+1;{std::lock_guard lock(s.mutex);s.retry_attempts=attempt+1;}
  try{negotiate_control(c,s,s.hello_bytes);++s.fresh_authentications;status=AP_OK;break;}catch(Failure e){status=e.status;c.tls.reset();c.tcp.reset();c.authenticated=false;if(status==AP_TRUST||status==AP_IDENTITY||status==AP_PERMISSION)break;}
  auto until=Clock::now()+std::chrono::milliseconds(std::min(s.recovery.maximum_backoff_ms,s.recovery.initial_backoff_ms*(1u<<attempt)));while(Clock::now()<until&&!s.stopping&&!s.retry_cancel)std::this_thread::sleep_for(std::chrono::milliseconds(1));
 }
 c.config.deadline_ms=original_deadline;if(s.retry_cancel)status=AP_CANCELLED;{std::lock_guard lock(s.mutex);if(status!=AP_OK){s.active_mask=0;s.recovery_state="manual";s.recovery_reason=status==AP_CANCELLED?"cancelled":status==AP_TRUST||status==AP_IDENTITY?"identity-reverification-required":"retry-exhausted";}snapshot(c,s);}return status;
}
void connection_lost(ConnectionContext& c,ControlState& s,int32_t status){std::string final_stats;{std::lock_guard lock(s.mutex);final_stats=s.media_stats;}retire_transport(c,s);{std::lock_guard lock(s.mutex);s.media_stats=std::move(final_stats);s.recovery.scope="connection";s.recovery_state="manual";s.recovery_reason="connection-lost";s.failure_status=status;snapshot(c,s);}event(c,s,0,status,false,0,1,10);}
int32_t restore_authority(ConnectionContext& c,ControlState& s,const Identity& old){Identity next;auto status=c.host_services->fresh_auth_result({old,0,0,{}},next);if(status==AP_OK){require(next.connection==c.config.connection_id&&next.lease==c.config.lease_epoch&&next.key==c.config.key_generation,AP_STALE);s.authority_connection=next.connection;auto authority=c.host_services->snapshot({next,0,0,{}});std::lock_guard lock(s.mutex);s.recovery_state=authority.control_allowed?"restored":"observer";s.recovery_reason="upstream-confirmation-required";s.failure_status=AP_OK;snapshot(c,s);}else{std::lock_guard lock(s.mutex);s.active_mask=0;s.grants=0;s.recovery_state="manual";s.recovery_reason=status==AP_BUSY?"control-lease-conflict":"permission-or-auth-failed";snapshot(c,s);}return status;}
std::optional<Record> pump(ConnectionContext& c,ControlState& s){
 if(s.incoming.empty())s.frame_deadline=Clock::now()+std::chrono::seconds(3);else require(Clock::now()<s.frame_deadline,AP_TIMEOUT);
 // Drain an already available frame without placing a media window between
 // its length, fixed header and payload. Fragmented peers still have a bounded
 // number of reads per pump and the original three-second frame deadline.
 auto read_fragment=[&](size_t target){
  if(SSL_pending(c.tls.get())==0&&!datagram_ready(c.tcp.value,Clock::now()+std::chrono::milliseconds(2)))return false;
  require(Clock::now()<s.frame_deadline,AP_TIMEOUT);std::array<uint8_t,8316> b{};size_t got=0;ERR_clear_error();auto result=SSL_read_ex(c.tls.get(),b.data(),target-s.incoming.size(),&got);
  if(result!=1){auto error=SSL_get_error(c.tls.get(),result);if(error==SSL_ERROR_WANT_READ||error==SSL_ERROR_WANT_WRITE)return false;throw Failure{AP_LENGTH};}
  require(got>0,AP_LENGTH);s.incoming.insert(s.incoming.end(),b.begin(),b.begin()+got);
  return true;
 };
 for(unsigned fragment=0;fragment<2&&s.incoming.size()<124;++fragment){
  if(s.incoming.size()>=4){auto size=u32(s.incoming.data());require(size>=120&&size<=8312,AP_LENGTH);}
  if(!read_fragment(s.incoming.size()<4?4:124))return {};
 }
 if(s.incoming.size()<124)return {};
 auto h=s.incoming.data()+4;auto size=u32(s.incoming.data());require(size>=120&&size<=8312,AP_LENGTH);require(!std::memcmp(h,"ACTL",4)&&u16(h+4)==1,AP_FIELD);require(u16(h+6)>=1&&u16(h+6)<=14&&u32(h+8)<=2,AP_FIELD);require(u32(h+12)==size-120,AP_LENGTH);
 const auto id=identity(c);std::array<uint64_t,10> expected{id.host,id.instance,id.display,u64(h+64),id.connection,id.client,id.lease,id.config,id.key,3};for(size_t i=0;i<10;++i)require(u64(h+40+8*i)==expected[i],i==9?AP_VERSION:i>=6?AP_STALE:AP_IDENTITY);
 require(!u64(h+64)||u64(h+64)==id.stream,AP_IDENTITY);
 for(unsigned fragment=0;fragment<2&&s.incoming.size()<size+4;++fragment)if(!read_fragment(size+4))return {};
 if(s.incoming.size()!=size+4)return {};
 h=s.incoming.data()+4;
 Record r;r.opcode=u16(h+6);r.flags=u32(h+8);r.operation=u64(h+16);r.request=u64(h+24);r.sequence=u64(h+32);r.identity=id;r.identity.stream=u64(h+64);r.payload.assign(s.incoming.begin()+124,s.incoming.end());s.incoming.clear();
 if(r.sequence<=s.rx){++s.rejected_frames;return {};}
 require(r.sequence==s.rx+1,AP_STALE);s.rx=r.sequence;(void)fields(r.payload);return r;
}
void command_fields(uint32_t opcode,const Fields& f){
 switch(opcode){
 case 1:case 4:require(number(f,1)<=2&&number(f,2)<=2&&number(f,3)>=1&&number(f,3)<=60000&&f.count(4)&&f.count(5),AP_FIELD);break;
 case 2:case 9:(void)item(f,6,32);(void)wide(f,7);(void)wide(f,8);break;
 case 3:(void)wide(f,20);break;
 case 5:case 6:case 11:require(f.empty(),AP_FIELD);break;
 case 7:require(number(f,9)>=1&&number(f,9)<=3000,AP_FIELD);break;
 case 8:require(number(f,10)<=3,AP_FIELD);break;
 case 10:case 12:require(number(f,11)>=1&&number(f,11)<=60000,AP_FIELD);break;
 case 13:require(number(f,16)>=1&&number(f,16)<=3&&f.count(17)&&f.at(17).size()<=1024,AP_FIELD);break;
 case 14:(void)wide(f,20);break;
 default:throw Failure{AP_FIELD};
 }
}
void video_window(ConnectionContext& c,ControlState& s){
 {std::lock_guard lock(s.mutex);dispatch_trace(c,s.trace,0,0);auto now=static_cast<uint64_t>(std::chrono::duration_cast<std::chrono::milliseconds>(Clock::now().time_since_epoch()).count());s.trace_remaining=s.trace.enabled&&s.trace.expires>now?s.trace.expires-now:0;if(s.trace.enabled){auto record=std::string("{\"kind\":\"trace\",\"status\":")+std::to_string(s.failure_status)+",\"packets\":"+std::to_string(s.sinks)+"}\n";record.resize(256,' ');if(record.size()<=s.trace.limit_bytes-s.trace.bytes){s.trace.records+=record;s.trace.bytes=s.trace.records.size();}else s.trace.enabled=false;}if(s.recovery.scope=="stream"&&s.recovery_state!="manual"){if(Clock::now()>=c.media_fault_until){s.recovery_state="healthy";s.recovery_reason="none";}else if(Clock::now()-s.recovery.failure_started>=std::chrono::milliseconds(s.recovery.persistent_threshold_ms))s.recovery_state="action-required";}snapshot(c,s);}
 if(!c.authenticated)return;
 if(s.multi&&s.grants){c.exchange_deadline=Clock::now()+std::chrono::milliseconds(100);c.media_enabled_mask=s.active_mask;const std::string payload="synthetic-phase06";auto w=media_service_window(c,static_cast<uint16_t>(s.peer_udp),reinterpret_cast<const uint8_t*>(payload.data()),static_cast<uint32_t>(payload.size()),s.round++);(void)w;uint32_t sinks=0;std::ostringstream stats;stats<<'[';bool comma=false;for(auto& stream:c.streams){sinks+=stream->received;if(comma)stats<<',';comma=true;stats<<"{\"streamId\":"<<stream->domain.identity.stream<<",\"mediaKind\":"<<unsigned(stream->domain.media)<<",\"direction\":"<<unsigned(stream->domain.direction)<<",\"generation\":"<<stream->domain.identity.key<<",\"sent\":"<<stream->sent<<",\"received\":"<<stream->received<<",\"rejected\":"<<stream->rejected<<",\"dropped\":"<<stream->dropped<<",\"expired\":"<<stream->expired<<'}';}stats<<']';{std::lock_guard lock(s.mutex);s.sinks=sinks;s.media_stats=stats.str();s.media_progress=c.control_progress;s.peak_queue=c.peak_queue_bytes;snapshot(c,s);}return;}
 if(!c.srtp||!s.grants)return;
 if(c.config.role==1){if(!s.grants||Clock::now()<s.next_media)return;s.next_media=Clock::now()+std::chrono::milliseconds(20);require(s.media_index<65536,AP_PROTECTION);const std::string data="confirmed-synthetic-video";std::vector<uint8_t> b(12+data.size()+SRTP_MAX_TRAILER_LEN);b[0]=0x80;b[1]=96;put16(b.data()+2,static_cast<uint16_t>(s.media_index));put32(b.data()+4,static_cast<uint32_t>(90000+3000*s.media_index));put32(b.data()+8,static_cast<uint32_t>(c.config.stream_id));++s.media_index;std::memcpy(b.data()+12,data.data(),data.size());int n=static_cast<int>(12+data.size());require(srtp_protect(c.srtp,b.data(),&n)==srtp_err_status_ok,AP_PROTECTION);auto remote=endpoint(s.peer_udp);require(sendto(c.udp.value,reinterpret_cast<const char*>(b.data()),n,0,reinterpret_cast<sockaddr*>(&remote),sizeof(remote))==n,AP_INTERNAL_ERROR);
 }else{for(unsigned inspected=0;inspected<16&&datagram_ready(c.udp.value,Clock::now()+std::chrono::milliseconds(1));++inspected){std::array<uint8_t,1500> b{};int n=recv(c.udp.value,reinterpret_cast<char*>(b.data()),static_cast<int>(b.size()),0);if(n<28||srtp_unprotect(c.srtp,b.data(),&n)!=srtp_err_status_ok||n<12||b[0]!=0x80||b[1]!=96||u32(b.data()+8)!=c.config.stream_id)continue;std::lock_guard lock(s.mutex);++s.sinks;s.sink_digest=hash(b.data()+12,static_cast<size_t>(n-12));snapshot(c,s);}}
}
void schedule(ConnectionContext& c,ControlState& s,Record out,const Reservation* reservation){
 uint32_t delay=0,mutation=0;bool drop=false,replay=false;(void)reservation;
#ifdef AETHER_CONTROL_FIXTURE
 auto fault=control_fixture_fault(out.opcode,reservation?reservation->phase:0,out.request,false);delay=fault.delay_ms;drop=fault.drop;replay=fault.replay;mutation=fault.mutation;
#endif
 if(drop)return;require(s.outgoing.size()<64,AP_BUSY);s.outgoing.push_back({std::move(out),Clock::now()+std::chrono::milliseconds(delay),replay,mutation});(void)c;
}
void flush(ConnectionContext& c,ControlState& s){for(auto i=s.outgoing.begin();i!=s.outgoing.end();){if(Clock::now()<i->due){++i;continue;}auto out=std::move(i->record);bool replay=i->replay;auto mutation=i->mutation;i=s.outgoing.erase(i);out.sequence=++s.tx;auto b=record(out);
#ifdef AETHER_CONTROL_FIXTURE
 control_fixture_wire(b.data(),b.size());
 if(mutation==1)put32(b.data(),8313);
 if(mutation==2)put16(b.data()+8,2);
 if(mutation==3)put64(b.data()+36,out.sequence+1);
 if(mutation==4){auto p=b.size();b.resize(p+8);put16(b.data()+p,0x8001);put16(b.data()+p+2,4);put32(b.data()+p+4,1);put16(b.data()+126,static_cast<uint16_t>(u16(b.data()+126)+1));put32(b.data(),static_cast<uint32_t>(b.size()-4));put32(b.data()+16,static_cast<uint32_t>(b.size()-124));}
 if(mutation==5){auto p=b.size();b.resize(p+8);put16(b.data()+p,12);put16(b.data()+p+2,4);put32(b.data()+p+4,0);put16(b.data()+126,static_cast<uint16_t>(u16(b.data()+126)+1));put32(b.data(),static_cast<uint32_t>(b.size()-4));put32(b.data()+16,static_cast<uint32_t>(b.size()-124));}
 if(mutation==6)b.resize(124);
 if(mutation==7){for(size_t p=128;p+4<=b.size();){auto type=u16(b.data()+p),length=u16(b.data()+p+2);p+=4;require(length<=b.size()-p,AP_FIELD);if(type==6&&length){b[p]^=1;break;}p+=length;}}
#else
 (void)mutation;
#endif
 // Control response I/O uses the validated connection deadline (1-3s).
 // Serialization and fixture observation must not consume a 100ms media
 // scheduling interval and turn a valid proposal into a disconnected peer.
 c.exchange_deadline=Clock::now()+std::chrono::milliseconds(c.config.deadline_ms);
 write_tls(c,b.data(),b.size());if(replay)write_tls(c,b.data(),b.size());}}
void host_dispatch(ConnectionContext& c,ControlState& s,const Record& in,bool resumed=false){
 auto f=fields(in.payload);command_fields(in.opcode,f);require(in.operation&&in.request,AP_FIELD);require(in.flags==0||((in.opcode==3||in.opcode==14)&&in.flags==2),AP_FIELD);
 if(in.flags==0&&!resumed){require(in.operation>s.last_operation,AP_STALE);s.last_operation=in.operation;}
 int32_t status=AP_VERSION;Reservation* r=nullptr;std::string proposal;AdmissionEngine engine(c.host_services);
 try{
  if(in.opcode==1||in.opcode==4){require(!s.reservations.count(in.request),AP_STALE);if(in.opcode==4){for(auto& [id,pending]:s.reservations)if(pending.phase==1)engine.cancel(pending);}Reservation next;next.binding={in.identity,in.operation,in.request,{}};status=engine.request(next,in.payload,number(f,3),proposal);if(status==AP_OK){auto pos=s.reservations.emplace(in.request,std::move(next));r=&pos.first->second;}}
  else if(in.opcode==8){require(!s.reservations.count(in.request),AP_STALE);Reservation next;next.binding={in.identity,in.operation,in.request,{}};auto mask=number(f,10);status=engine.upstream(next,mask,proposal);if(status==AP_OK&&mask){auto pos=s.reservations.emplace(in.request,std::move(next));r=&pos.first->second;}}
  else if(in.opcode==2||in.opcode==9){auto i=s.reservations.find(in.request);require(i!=s.reservations.end(),AP_STALE);r=&i->second;require(in.opcode==2||r->upstream_mask,AP_FIELD);
#ifdef AETHER_CONTROL_FIXTURE
   require(hex(item(f,6,32))==r->binding.digest&&wide(f,7)==r->revision&&wide(f,8)==r->expiry_token,AP_STALE);
   if(!resumed){auto fault=control_fixture_fault(in.opcode,0,in.request,true);if(fault.delay_ms||fault.drop){require(s.deferred.size()<32,AP_BUSY);r->binding.operation_id=in.operation;if(!fault.drop)s.deferred.push_back({in,Clock::now()+std::chrono::milliseconds(fault.delay_ms)});return;}}
#endif
   Binding binding{in.identity,in.operation,in.request,hex(item(f,6,32))};status=engine.confirm(*r,binding,wide(f,7),wide(f,8));
  }else if(in.opcode==3||in.opcode==14){auto i=s.reservations.find(in.request);require(i!=s.reservations.end()&&c.host_services,AP_STALE);r=&i->second;const auto target=wide(f,20);if(in.flags==2){require(target==in.operation&&target==r->binding.operation_id,AP_STALE);require(hex(item(f,6,32))==r->binding.digest,AP_STALE);}
   if(in.opcode==3)status=engine.cancel(*r);else{status=c.host_services->status(*r);if(f.count(19)){require(number(f,19)==3&&f.count(18)&&wide(f,18)<=r->transaction_sequence,AP_STALE);
#ifdef AETHER_CONTROL_FIXTURE
    if(!resumed){auto fault=control_fixture_fault(in.opcode,0,in.request,true);if(fault.delay_ms||fault.drop){require(s.deferred.size()<32,AP_BUSY);if(!fault.drop)s.deferred.push_back({in,Clock::now()+std::chrono::milliseconds(fault.delay_ms)});return;}}
#endif
    auto before=r->phase;status=c.host_services->activate(*r);if(status==AP_OK&&before!=4){if(!c.srtp)make_srtp(c);std::lock_guard lock(s.mutex);s.active_mask|=r->media_mask;s.multi=s.active_mask!=1;++s.grants;}}}
  }else if(in.opcode==5&&s.reattached){s.reattached=false;auto out=response(c,in,s.reattach_status);auto result=fields(out.payload);add(result,16,s.recovery_state=="observer"?1:2,4);out.payload=encode(result);schedule(c,s,std::move(out),nullptr);return;}
  else if(in.opcode==5){require(c.host_services!=nullptr,AP_PERMISSION);auto authority=c.host_services->snapshot({in.identity,in.operation,in.request,{}});require(authority.read_allowed,AP_PERMISSION);if(authority.controller.client==in.identity.client&&authority.controller.lease!=in.identity.lease){std::lock_guard lock(s.mutex);s.recovery_state="manual";s.recovery_reason="control-lease-conflict";status=AP_BUSY;}else{transmit(c,response(c,in,AP_OK),s.tx);
#ifdef AETHER_CONTROL_FIXTURE
if(control_fixture_fault(5,0,in.request,true).drop)c.listener.reset();
#endif
status=reconnect(c,s);if(status==AP_OK){Identity next;status=c.host_services->fresh_auth_result({in.identity,in.operation,in.request,{}},next);if(status==AP_OK){require(next.connection==c.config.connection_id&&next.lease==c.config.lease_epoch&&next.key==c.config.key_generation,AP_STALE);s.authority_connection=next.connection;auto restored=c.host_services->snapshot({next,in.operation,in.request,{}});std::lock_guard lock(s.mutex);s.recovery_state=restored.control_allowed?"restored":"observer";s.recovery_reason="upstream-confirmation-required";}}if(status!=AP_OK){std::lock_guard lock(s.mutex);s.recovery_state="manual";s.recovery_reason=status==AP_BUSY?"control-lease-conflict":"retry-exhausted";}if(!c.authenticated)return;auto out=response(c,in,status);auto result=fields(out.payload);add(result,16,s.recovery_state=="observer"?1:2,4);out.payload=encode(result);schedule(c,s,std::move(out),nullptr);return;}}
  else if(in.opcode>=10&&in.opcode<=12){std::lock_guard lock(s.mutex);status=dispatch_trace(c,s.trace,in.opcode,in.opcode==11?0:number(f,11));}
  else if(in.opcode==6){std::lock_guard lock(s.mutex);status=dispatch_recovery(c,s.recovery,6,{in.identity,in.operation,in.request,{}},0);s.recovery_state=s.recovery.state;s.recovery_reason=s.recovery.reason;}
  else if(in.opcode==7){status=dispatch_recovery(c,s.recovery,7,{in.identity,in.operation,in.request,{}},number(f,9));std::lock_guard lock(s.mutex);s.recovery_state=s.recovery.state;s.recovery_reason=s.recovery.reason;}
  else if(in.opcode==13){
#ifdef AETHER_CONTROL_FIXTURE
if(control_fixture_fault(13,0,in.request,true).drop)throw Failure{AP_LENGTH};
#endif
require(c.host_services!=nullptr,AP_PERMISSION);auto authority=c.host_services->snapshot({in.identity,in.operation,in.request,{}});const auto& envelope=f.at(17);status=AP_OK;if(!authority.control_allowed)status=AP_PERMISSION;else if(envelope.size()<24||u64(envelope.data())!=c.config.connection_id||u64(envelope.data()+8)!=c.config.lease_epoch||u64(envelope.data()+16)!=c.config.config_generation)status=AP_STALE;
#ifdef AETHER_CONTROL_FIXTURE
// Test host scalars only: never print the envelope or its content.
std::cerr<<"# POLICY-HOST operation="<<in.operation<<" allowed="<<authority.control_allowed<<" bytes="<<envelope.size()<<" connection="<<(envelope.size()>=24?u64(envelope.data()):0)<<" lease="<<(envelope.size()>=24?u64(envelope.data()+8):0)<<" generation="<<(envelope.size()>=24?u64(envelope.data()+16):0)<<" expected="<<c.config.connection_id<<','<<c.config.lease_epoch<<','<<c.config.config_generation<<" status="<<status<<std::endl;
#endif
std::lock_guard lock(s.mutex);if(status==AP_OK)++s.policy_accepted;else ++s.policy_rejected;}
 }catch(Failure e){if(in.opcode==13&&e.status==AP_LENGTH)throw;status=e.status;}
 schedule(c,s,response(c,in,status,r,proposal),r);{std::lock_guard lock(s.mutex);if(!proposal.empty()){s.proposal=proposal;if(r){s.revision=r->revision;s.expiry=r->expiry_token;}}snapshot(c,s);}
}
void receipt(ConnectionContext& c,ControlState& s,const Record& r){auto f=fields(r.payload);auto status=static_cast<int32_t>(number(f,12));require(status>=AP_OK&&status<=AP_ALREADY_COMPLETE,AP_FIELD);(void)number(f,13);(void)number(f,14);uint64_t transaction=f.count(18)?wide(f,18):0;uint32_t phase=f.count(19)?number(f,19):1;require(phase>=1&&phase<=5,AP_FIELD);
 std::lock_guard lock(s.mutex);auto i=s.results.find(r.operation);if(i==s.results.end()){auto old=s.retired_results.find(r.operation);require(old!=s.retired_results.end()&&old->second.request==r.request,AP_STALE);if(!old->second.digest.empty())require(f.count(6)&&hex(item(f,6,32))==old->second.digest,AP_STALE);++s.rejected_frames;return;}require(i->second.request==r.request,AP_STALE);auto& result=i->second;if(transaction&&transaction<result.transaction){++s.rejected_frames;return;}
 if(transaction){require(wide(f,20)==r.operation,AP_STALE);if(!result.digest.empty())require(hex(item(f,6,32))==result.digest,AP_STALE);result.transaction=transaction;result.phase=phase;result.known=true;result.authority=(phase==2?AP_CANCELLED:(phase>=3?AP_OK:status));}
 if(r.opcode==3){result.cancel=status==AP_ALREADY_COMPLETE?"already-committed":status==AP_CANCELLED?"cancelled":"unknown";}
 if(f.count(15)&&(r.opcode==1||r.opcode==4||r.opcode==8)){std::string proposal(f.at(15).begin(),f.at(15).end());require(proposal.size()<=6144&&proposal.front()=='{'&&proposal.back()=='}',AP_FIELD);s.proposal=proposal;auto marker=proposal.find("\"digest\":\"");if(marker!=std::string::npos)s.digest=proposal.substr(marker+10,64);}
 snapshot(c,s);
}
Record status_request(ConnectionContext& c,const ControlState::Command& command,uint16_t opcode,uint64_t transaction=0,bool activation=false){auto f=fields(command.payload);Fields out;add(out,20,command.meta.operation_id,8);out[6]=item(f,6,32);if(transaction)add(out,18,transaction,8);if(activation)add(out,19,3,4);Record r{opcode,2,command.meta.operation_id,command.meta.request_id,0,identity(c),encode(out)};r.identity.stream=command.meta.stream_id;return r;}
void client_dispatch(ConnectionContext& c,ControlState& s,ControlState::Command command){
 auto& m=command.meta;bool cancellation=false;{std::lock_guard lock(s.mutex);cancellation=s.cancellations.count(m.operation_id)>0;if(m.opcode==5){s.retry_cancel=cancellation;if(cancellation){s.recovery_state="manual";s.recovery_reason="cancelled";}}}if(cancellation){event(c,s,m.operation_id,AP_CANCELLED,true);return;}if(m.opcode==6&&!s.opened){{std::lock_guard lock(s.mutex);s.recovery_state="manual";s.recovery_reason="cancelled";}event(c,s,m.operation_id,AP_CANCELLED,true);return;}
 bool manual_reconnect=false;if(m.opcode==5){if(!s.opened){manual_reconnect=true;auto fresh=reconnect(c,s);if(fresh!=AP_OK){event(c,s,m.operation_id,fresh,true);return;}}}
 const auto deadline=Clock::now()+std::chrono::milliseconds(m.deadline_ms);c.exchange_deadline=deadline;Record r{static_cast<uint16_t>(m.opcode),0,m.operation_id,m.request_id,0,identity(c),command.payload};r.identity.stream=m.stream_id;transmit(c,r,s.tx);
 const bool side_effect=m.opcode==2||m.opcode==9;bool reconnect_started=manual_reconnect,cancel_sent=false,activation_sent=false,authority=false,completed=false;unsigned retries=0;auto next_status=Clock::now()+std::chrono::milliseconds(100);uint64_t transaction=0;uint32_t phase=1;int32_t terminal_status=AP_TIMEOUT;
 while(Clock::now()<deadline&&!s.stopping){
  video_window(c,s);{std::lock_guard lock(s.mutex);cancellation=s.cancellations.count(m.operation_id)>0;}
  if(cancellation&&m.opcode==5)s.retry_cancel=true;
  if(cancellation&&side_effect&&!cancel_sent){c.exchange_deadline=deadline;transmit(c,status_request(c,command,3),s.tx);cancel_sent=true;}
  auto incoming=pump(c,s);if(incoming){require(incoming->flags==1,AP_FIELD);if(incoming->operation!=m.operation_id){receipt(c,s,*incoming);continue;}require(incoming->request==m.request_id,AP_STALE);auto f=fields(incoming->payload);auto status=static_cast<int32_t>(number(f,12));receipt(c,s,*incoming);if(f.count(18)){transaction=wide(f,18);phase=number(f,19);authority=true;}
   if(!side_effect){if(m.opcode==5){if(status==AP_OK&&!reconnect_started){reconnect_started=true;auto fresh=reconnect(c,s);if(fresh!=AP_OK){terminal_status=fresh;completed=true;break;}continue;}std::lock_guard lock(s.mutex);s.recovery_state=status==AP_OK?(f.count(16)&&number(f,16)==1?"observer":"restored"):"manual";s.recovery_reason=status==AP_OK?"upstream-confirmation-required":status==AP_BUSY?"control-lease-conflict":"retry-exhausted";}if(status==AP_OK&&m.opcode>=10&&m.opcode<=12){std::lock_guard lock(s.mutex);dispatch_trace(c,s.trace,m.opcode,m.opcode==11?0:number(fields(command.payload),11));}if(status==AP_OK&&m.opcode==7){dispatch_recovery(c,s.recovery,7,{r.identity,m.operation_id,m.request_id,{}},number(fields(command.payload),9));std::lock_guard lock(s.mutex);s.recovery_state=s.recovery.state;s.recovery_reason=s.recovery.reason;}if(m.opcode==13){std::lock_guard lock(s.mutex);if(status==AP_OK)++s.policy_accepted;else ++s.policy_rejected;}if(m.opcode==6){std::lock_guard lock(s.mutex);s.recovery_state="manual";s.recovery_reason="cancelled";}terminal_status=status;completed=true;break;}
   if(incoming->opcode==3){if(status==AP_CANCELLED){terminal_status=AP_CANCELLED;completed=true;break;}require(status==AP_ALREADY_COMPLETE||status==AP_STALE,AP_FIELD);}
   if(status!=AP_OK&&status!=AP_BUSY&&phase<3&&incoming->opcode!=3){terminal_status=status;completed=true;break;}
   if(phase==3&&status==AP_OK&&!activation_sent){require(f.count(21)||incoming->opcode==14||incoming->opcode==3,AP_FIELD);if(f.count(21))require(number(f,21)>=1&&number(f,21)<=3000,AP_FIELD);if(!c.srtp)make_srtp(c);c.exchange_deadline=deadline;transmit(c,status_request(c,command,14,transaction,true),s.tx);activation_sent=true;next_status=Clock::now()+std::chrono::milliseconds(100);}
   if(phase==4){if(cancel_sent){std::lock_guard lock(s.mutex);if(s.results.at(m.operation_id).cancel=="none")continue;}if(!c.srtp)make_srtp(c);{std::lock_guard lock(s.mutex);auto p=s.proposal.find("\"mediaMask\":");if(p!=std::string::npos)s.active_mask|=static_cast<uint32_t>(std::stoul(s.proposal.substr(p+12)));else s.active_mask|=1;s.multi=s.active_mask!=1;++s.grants;}terminal_status=AP_OK;completed=true;break;}
   if(phase==5){terminal_status=AP_EXPIRED;completed=true;break;}
  }
  if(side_effect&&Clock::now()>=next_status&&retries<3){c.exchange_deadline=deadline;transmit(c,status_request(c,command,14,transaction,activation_sent),s.tx);++retries;next_status=Clock::now()+std::chrono::milliseconds(100);}
  std::this_thread::sleep_for(std::chrono::milliseconds(1));
 }
 if(completed){auto until=std::min(deadline,Clock::now()+std::chrono::milliseconds(25));while(Clock::now()<until){video_window(c,s);std::this_thread::sleep_for(std::chrono::milliseconds(1));}event(c,s,m.operation_id,terminal_status,true,transaction,phase);}
 else{{std::lock_guard lock(s.mutex);s.results.at(m.operation_id).cancel=cancel_sent?"unknown":"none";s.unresolved.emplace(m.operation_id,command);}event(c,s,m.operation_id,s.stopping?AP_STOPPED:AP_TIMEOUT,false,transaction,phase);}
 (void)authority;
}
void control_worker(std::shared_ptr<ConnectionContext> context,std::vector<uint8_t> hello_bytes){auto& c=*context;auto& s=*c.control;s.hello_bytes=hello_bytes;
 try{
#ifdef __APPLE__
  require(pthread_set_qos_class_self_np(QOS_CLASS_USER_INITIATED,0)==0,AP_INTERNAL_ERROR);
#endif
  {std::lock_guard transport(s.transport_mutex);negotiate_control(c,s,hello_bytes);}
  while(!s.stopping){
   try{
    video_window(c,s);
    if(c.config.role==1){
     if(!s.opened){
      if(c.listener.value!=invalid&&datagram_ready(c.listener.value,Clock::now()+std::chrono::milliseconds(2))){const auto old=identity(c);s.retry_cancel=false;auto fresh=reconnect(c,s);if(fresh==AP_OK){s.reattach_status=restore_authority(c,s,old);s.reattached=true;}}
      std::this_thread::sleep_for(std::chrono::milliseconds(1));continue;
     }
     for(auto i=s.deferred.begin();i!=s.deferred.end();){if(Clock::now()<i->due){++i;continue;}auto record=std::move(i->record);i=s.deferred.erase(i);host_dispatch(c,s,record,true);}
     flush(c,s);auto record=pump(c,s);if(record){c.exchange_deadline=Clock::now()+std::chrono::milliseconds(c.config.deadline_ms);host_dispatch(c,s,*record);}
    }else{
     ControlState::Command command;bool available=false;{std::lock_guard lock(s.mutex);if(!s.commands.empty()){command=std::move(s.commands.front());s.commands.pop_front();s.queued_bytes-=static_cast<uint32_t>(command.payload.size());available=true;}}
     if(available){try{client_dispatch(c,s,command);}catch(Failure e){event(c,s,command.meta.operation_id,e.status,false);if(e.status==AP_LENGTH||e.status==AP_PROTECTION){connection_lost(c,s,e.status);}else if(e.status!=AP_TIMEOUT)break;}}
     else if(s.opened){auto record=pump(c,s);if(record){receipt(c,s,*record);event(c,s,record->operation,AP_OK,true,0,1,10);}}
    }
   }catch(Failure e){if(!s.stopping&&(e.status==AP_LENGTH||e.status==AP_PROTECTION)){connection_lost(c,s,e.status);}else throw;}
   std::this_thread::sleep_for(std::chrono::milliseconds(1));
  }
 }catch(Failure e){{std::lock_guard lock(s.mutex);s.failure_status=e.status;}if(!s.stopping)event(c,s,0,e.status,false);}catch(...){if(!s.stopping)event(c,s,0,AP_INTERNAL_ERROR,false);}
 std::vector<uint64_t> pending;{std::lock_guard lock(s.mutex);for(auto& [id,result]:s.results)if(!result.terminal)pending.push_back(id);}for(auto id:pending){bool sent=false;{std::lock_guard lock(s.mutex);sent=s.unresolved.count(id)>0;}event(c,s,id,sent?AP_STOPPED:AP_CANCELLED,!sent);}
 if(c.host_services){c.host_services->release_connection(s.authority_connection?s.authority_connection:c.config.connection_id);if(s.authority_connection&&s.authority_connection!=c.config.connection_id)c.host_services->release_connection(c.config.connection_id);}{std::lock_guard lock(s.mutex);s.trace.enabled=false;s.trace_remaining=0;s.commands.clear();s.queued_bytes=0;s.cancellations.clear();s.unresolved.clear();s.incoming.clear();s.outgoing.clear();s.deferred.clear();}{std::lock_guard transport(s.transport_mutex);c.cleanup();}
 event(c,s,0,AP_OK,true,0,1,15);{std::lock_guard lock(s.mutex);s.opened=false;s.finished=true;snapshot(c,s);}s.wake.notify_all();
}
}
int32_t control_open(std::shared_ptr<ConnectionContext> c,const AetherProtocolControlOpen* in){require(c!=nullptr,AP_INVALID_HANDLE);require(in&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1&&in->command_version==1,AP_ABI_MISMATCH);require(!in->reserved&&!in->reserved2&&in->hello_bytes<=512,AP_FIELD);bool version3=false;for(unsigned i=0;i<c->config.version_count;++i)version3|=c->config.versions[i]==3;require(version3,AP_VERSION);std::vector<uint8_t> data;if(c->config.role==2){require(in->hello&&in->hello_bytes>=10,AP_LENGTH);data.assign(in->hello,in->hello+in->hello_bytes);ctl::hello(data);}else require(!in->hello_bytes&&!in->hello,AP_FIELD);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);require(!c->submitted&&!c->control,AP_BUSY);c->control=std::make_shared<ControlState>();c->control->authority_connection=c->config.connection_id;{std::lock_guard state(c->control->mutex);ctl::snapshot(*c,*c->control);}c->control->worker=std::thread(ctl::control_worker,c,std::move(data));return AP_OK;}
int32_t control_send(std::shared_ptr<ConnectionContext> c,const AetherProtocolCommand* in){require(c!=nullptr,AP_INVALID_HANDLE);require(in&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1&&in->command_version==1,AP_ABI_MISMATCH);require(in->opcode>=1&&in->opcode<=13&&!in->flags&&!in->reserved&&in->operation_id&&in->deadline_ms&&in->deadline_ms<=3000,AP_FIELD);require(in->payload&&in->payload_bytes>=4&&in->payload_bytes<=8192,AP_LENGTH);ControlState::Command cmd;cmd.meta=*in;cmd.meta.payload=nullptr;cmd.payload.assign(in->payload,in->payload+in->payload_bytes);auto inputFields=ctl::fields(cmd.payload);ctl::command_fields(in->opcode,inputFields);require(!in->stream_id||in->stream_id==c->config.stream_id,AP_IDENTITY);require(in->expected_generation==c->config.config_generation,AP_STALE);require(c->control&&c->config.role==2,AP_BUSY);auto& s=*c->control;std::lock_guard lock(s.mutex);require(!s.stopping&&!s.finished,AP_STOPPED);require(s.opened||in->opcode==5||in->opcode==6,AP_BUSY);if(in->opcode==6)s.retry_cancel=true;require(in->operation_id>s.last_operation,AP_STALE);require(s.results.size()-(s.results.count(0)?1:0)<32&&s.events.size()+2*s.results.size()<254&&s.queued_bytes<=262144-in->payload_bytes,AP_BUSY);s.last_operation=in->operation_id;ControlState::Result result;result.operation=in->operation_id;result.request=in->request_id;result.opcode=in->opcode;if(inputFields.count(6))result.digest=ctl::hex(inputFields.at(6));s.results.emplace(in->operation_id,result);s.queued_bytes+=in->payload_bytes;s.commands.push_back(std::move(cmd));ctl::snapshot(*c,s);s.wake.notify_all();return AP_OK;}
int32_t control_cancel(std::shared_ptr<ConnectionContext> c,uint64_t op){require(c&&c->control,AP_INVALID_HANDLE);auto& s=*c->control;std::lock_guard lock(s.mutex);require(!s.stopping,AP_STOPPED);require(op==0||s.results.count(op),AP_STALE);if(op&&s.results.at(op).terminal)return AP_ALREADY_COMPLETE;s.cancellations.insert(op);if(s.recovery_state=="reconnecting"||(op&&s.results.at(op).opcode==5))s.retry_cancel=true;s.wake.notify_all();return AP_OK;}
int32_t control_query(std::shared_ptr<ConnectionContext> c,char* out,uint32_t n,uint32_t* required){require(c&&c->control,AP_INVALID_HANDLE);require(required&&(!n||out),AP_INVALID_ARGUMENT);auto& s=*c->control;std::lock_guard lock(s.mutex);auto& b=s.snapshot;*required=static_cast<uint32_t>(b.size()+1);if(n<*required){if(n){std::memcpy(out,b.data(),n-1);out[n-1]=0;}return AP_BUFFER_TOO_SMALL;}std::memcpy(out,b.c_str(),b.size()+1);return AP_OK;}
int32_t control_ack(std::shared_ptr<ConnectionContext> c,uint64_t seq){require(c&&c->control,AP_INVALID_HANDLE);auto& s=*c->control;std::lock_guard lock(s.mutex);require(seq==s.acked||seq==s.acked+1,AP_INVALID_ARGUMENT);require(seq<=s.published,AP_INVALID_ARGUMENT);s.acked=seq;if(!s.events.empty()&&s.events.front().first==seq){auto op=s.events.front().second;s.events.pop_front();auto i=s.results.find(op);if(i!=s.results.end()&&i->second.terminal&&i->second.event==seq){s.retired_results[op]=i->second;if(s.retired_results.size()>32)s.retired_results.erase(s.retired_results.begin());s.results.erase(i);}}c->acked=seq;ctl::snapshot(*c,s);return AP_OK;}
int32_t control_stop(std::shared_ptr<ConnectionContext> c,uint64_t* seq){require(seq,AP_INVALID_ARGUMENT);auto& s=*c->control;const auto deadline=Clock::now()+std::chrono::seconds(2);std::unique_lock serial(s.stop_mutex,std::defer_lock);require(serial.try_lock_until(deadline),AP_TIMEOUT);s.stopping=true;s.wake.notify_all();std::unique_lock transport(s.transport_mutex,std::defer_lock);require(transport.try_lock_until(deadline),AP_TIMEOUT);if(c->tcp.value!=invalid){
#ifdef _WIN32
 shutdown(c->tcp.value,SD_BOTH);
#else
 shutdown(c->tcp.value,SHUT_RDWR);
#endif
 }transport.unlock();std::unique_lock lock(s.mutex);require(s.wake.wait_until(lock,deadline,[&]{return s.finished;}),AP_TIMEOUT);lock.unlock();if(s.worker.joinable())s.worker.join();lock.lock();c->stopped=true;c->published=s.published;*seq=s.published;ctl::snapshot(*c,s);return AP_OK;}
}
