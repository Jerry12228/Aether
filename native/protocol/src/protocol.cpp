#include "aether/protocol.h"
#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#else
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <fcntl.h>
#endif
#include <openssl/ssl.h>
#include <openssl/x509v3.h>
#include <openssl/crypto.h>
#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/sslerr.h>
#include <srtp.h>
#include "internal.h"
#include <algorithm>
#include <array>
#include <chrono>
#include <cstring>
#include <map>
#include <memory>
#include <mutex>
#include <sstream>
#include <string>
#include <vector>
namespace {
using namespace aether::protocol;
using Context=ConnectionContext;
template<class F> int32_t boundary(F f) noexcept {try{return f();}catch(Failure e){return e.status;}catch(...){return AP_INTERNAL_ERROR;}}
void append64(std::vector<uint8_t>& b,uint64_t v){for(int i=7;i>=0;--i)b.push_back(static_cast<uint8_t>(v>>(i*8)));}
std::string bounded_string(const char* value,size_t maximum){require(value!=nullptr,AP_INVALID_ARGUMENT);size_t n=0;while(n<=maximum&&value[n])++n;require(n>0&&n<=maximum,AP_LENGTH);return std::string(value,n);}
int32_t negotiate(const uint8_t* bytes,uint32_t size,const uint32_t* local,uint32_t count,uint32_t* selected,uint32_t* side){
 if(selected)*selected=0;if(side)*side=0;
 if(!bytes||!local||!selected||!side||!count||count>8)return AP_INVALID_ARGUMENT;
 if(size<8||size>512)return AP_LENGTH;
 if(std::memcmp(bytes,"AETH",4)||bytes[6]!=1)return AP_FIELD;
 if(u16(bytes+4)!=size||!bytes[7]||bytes[7]>8||size<8u+2u*bytes[7])return AP_LENGTH;
 uint32_t remote_max=0,local_max=0,candidate=0;
 std::array<bool,65536> seen{};
 for(uint32_t i=0;i<count;++i){if(!local[i]||local[i]>65535)return AP_FIELD;local_max=std::max(local_max,local[i]);}
 for(uint32_t i=0;i<bytes[7];++i){uint32_t v=u16(bytes+8+2*i);if(!v||seen[v])return AP_FIELD;seen[v]=true;remote_max=std::max(remote_max,v);for(uint32_t j=0;j<count;++j)if(local[j]==v)candidate=std::max(candidate,v);}
 std::array<bool,65536> fields{};uint32_t field_count=0;
 for(uint32_t offset=8+2*bytes[7];offset<size;){if(size-offset<4)return AP_LENGTH;auto type=u16(bytes+offset);auto n=u16(bytes+offset+2);offset+=4;if(n>size-offset)return AP_LENGTH;if(!type||fields[type]||++field_count>32)return AP_FIELD;fields[type]=true;if(type&0x8000)return AP_FIELD;offset+=n;}
 if(!candidate){*side=remote_max<local_max?1:local_max<remote_max?2:3;return AP_VERSION;}
 (void)media_limits(bytes,size);
 *selected=candidate;
 return AP_OK;
}
std::mutex registry_mutex;
std::map<uint64_t,std::shared_ptr<Context>> registry;
uint64_t next_token=1;
std::shared_ptr<Context> find(uint64_t token){std::lock_guard lock(registry_mutex);auto i=registry.find(token);return i==registry.end()?nullptr:i->second;}
uint16_t optional_port(const uint8_t* bytes,uint32_t size){
 for(uint32_t offset=8u+2u*bytes[7];offset<size;){auto type=u16(bytes+offset),length=u16(bytes+offset+2);offset+=4;if(type==2){require(length==2&&u16(bytes+offset)!=0,AP_FIELD);return u16(bytes+offset);}offset+=length;}
 return 0;
}
bool dual_requested(const uint8_t* bytes,uint32_t size){
 for(uint32_t offset=8u+2u*bytes[7];offset<size;){auto type=u16(bytes+offset),length=u16(bytes+offset+2);offset+=4;if(type==1){require(length==1&&(bytes[offset]==2||bytes[offset]==5),AP_FIELD);return bytes[offset]==2;}offset+=length;}
 return false;
}
bool full_requested(const uint8_t* bytes,uint32_t size){
 bool full=false,profile=false,uplink=false;
 for(uint32_t offset=8u+2u*bytes[7];offset<size;){auto type=u16(bytes+offset),length=u16(bytes+offset+2);offset+=4;
  if(type==1){require(length==1&&(bytes[offset]==2||bytes[offset]==5),AP_FIELD);full=bytes[offset]==5;}
  if(type==3){require(length==2,AP_FIELD);require(u16(bytes+offset)==1,AP_VERSION);profile=true;}
  if(type==6){require(length>0&&length<=64,AP_LENGTH);uplink=true;}offset+=length;
 }if(full)require(profile&&uplink,AP_FIELD);return full;
}
std::vector<uint8_t> uplink_payload(const uint8_t* bytes,uint32_t size){
 for(uint32_t offset=8u+2u*bytes[7];offset<size;){auto type=u16(bytes+offset),length=u16(bytes+offset+2);offset+=4;if(type==6)return {bytes+offset,bytes+offset+length};offset+=length;}throw Failure{AP_FIELD};
}
std::vector<uint8_t> control_domain(const Context& c,uint32_t version){
 std::vector<uint8_t> bytes;bytes.reserve(80);
 for(uint64_t value:{c.config.host_id,c.config.instance_id,c.config.display_id,c.config.stream_id,c.config.connection_id,c.config.client_id,c.config.lease_epoch,c.config.config_generation,c.config.key_generation,uint64_t(version)})append64(bytes,value);return bytes;
}
void validate_domain(const Context& c,const uint8_t* received,uint32_t version){
 const auto expected=control_domain(c,version);
 for(size_t field=0;field<10;++field)require(u64(received+8*field)==u64(expected.data()+8*field),field==9?AP_VERSION:field>=6?AP_STALE:AP_IDENTITY);
}
void create_dual_streams(Context& c){
 require(c.config.stream_id<UINT32_MAX&&c.selected==2,AP_FIELD);
 for(uint64_t id:{c.config.stream_id,c.config.stream_id+1}){
  auto stream=std::make_unique<aether::protocol::StreamContext>();
  stream->domain.identity={c.config.host_id,c.config.instance_id,c.config.display_id,id,c.config.connection_id,c.config.client_id,c.config.lease_epoch,c.config.config_generation,c.config.key_generation};
  auto previous=c.config.stream_id;c.config.stream_id=id;
  try{make_srtp(c);}catch(...){c.config.stream_id=previous;throw;}
  c.config.stream_id=previous;stream->crypto=c.srtp;c.srtp=nullptr;c.streams.push_back(std::move(stream));
 }
}
void transmit_dual(Context& c,uint16_t port,const uint8_t* payload,uint32_t size){
 require(size<=128&&c.streams.size()==2,AP_LENGTH);auto remote=endpoint(port);
 for(uint32_t round=1;round<=aether::protocol::dual_video_rounds;++round){
  for(auto& stream:c.streams){
   auto& s=*stream;auto& id=s.domain.identity;std::string data(reinterpret_cast<const char*>(payload),size);data+=":video:"+std::to_string(id.stream)+":"+std::to_string(round);require(data.size()<=aether::protocol::maximum_stream_payload,AP_LENGTH);
   std::vector<uint8_t> packet(aether::protocol::media_header_bytes+data.size()+SRTP_MAX_TRAILER_LEN);
   packet[0]=0x90;packet[1]=96;put16(packet.data()+2,static_cast<uint16_t>(round));put32(packet.data()+4,90000+3000*(round-1));put32(packet.data()+8,static_cast<uint32_t>(id.stream));
   put16(packet.data()+12,0xa37e);put16(packet.data()+14,12);packet[16]=s.domain.direction;packet[17]=s.domain.media;packet[18]=s.domain.role;packet[19]=0;put32(packet.data()+20,round);
   put64(packet.data()+24,id.connection);put64(packet.data()+32,id.lease);put64(packet.data()+40,id.config);put64(packet.data()+48,id.key);put64(packet.data()+56,id.stream);
   std::memcpy(packet.data()+aether::protocol::media_header_bytes,data.data(),data.size());int n=static_cast<int>(aether::protocol::media_header_bytes+data.size());
   require(srtp_protect(s.crypto,packet.data(),&n)==srtp_err_status_ok,AP_PROTECTION);require(sendto(c.udp.value,reinterpret_cast<const char*>(packet.data()),n,0,reinterpret_cast<sockaddr*>(&remote),sizeof(remote))==n,AP_INTERNAL_ERROR);
   ++s.sent;s.sequence=static_cast<uint16_t>(round);s.timestamp=90000+3000*(round-1);
  }
  std::array<uint8_t,4> control{};put32(control.data(),round);write_tls(c,control.data(),control.size());std::array<uint8_t,4> ack{};read_tls(c,ack.data(),ack.size());require(u32(ack.data())==round,AP_FIELD);++c.control_progress;
 }
}
void receive_dual(Context& c){
 create_dual_streams(c);
 for(uint32_t round=1;round<=aether::protocol::dual_video_rounds;++round){
  std::array<uint8_t,4> control{};read_tls(c,control.data(),control.size());require(u32(control.data())==round,AP_FIELD);
  aether::protocol::WindowRecord window{round,0,0,1};
  auto deadline=std::min(c.exchange_deadline,std::chrono::steady_clock::now()+std::chrono::milliseconds(25));uint32_t inspected=0;
  // Each bounded round is a real control-health window. Authentication precedes
  // metadata parsing, counters, digest bytes and delivery into a stream sink.
  while(inspected<32&&datagram_ready(c.udp.value,deadline)){
   ++inspected;std::array<uint8_t,1500> packet{};int n=recv(c.udp.value,reinterpret_cast<char*>(packet.data()),static_cast<int>(packet.size()),0);
#ifdef _WIN32
   if(n<0&&WSAGetLastError()==WSAEMSGSIZE)continue;
#endif
   require(n>=0,AP_INTERNAL_ERROR);if(n<12)continue;
   auto ssrc=u32(packet.data()+8);auto found=std::find_if(c.streams.begin(),c.streams.end(),[&](const auto& s){return s->domain.identity.stream==ssrc;});if(found==c.streams.end())continue;
   auto& s=**found;auto& id=s.domain.identity;
   if(srtp_unprotect(s.crypto,packet.data(),&n)!=srtp_err_status_ok){++s.rejected;continue;}
   if(n<=static_cast<int>(aether::protocol::media_header_bytes)||n>static_cast<int>(aether::protocol::media_header_bytes+aether::protocol::maximum_stream_payload)||packet[0]!=0x90||packet[1]!=96||u16(packet.data()+12)!=0xa37e||u16(packet.data()+14)!=12||packet[16]!=s.domain.direction||packet[17]!=s.domain.media||packet[18]!=s.domain.role||packet[19]||u32(packet.data()+20)!=round||u16(packet.data()+2)!=round||u64(packet.data()+24)!=id.connection||u64(packet.data()+32)!=id.lease||u64(packet.data()+40)!=id.config||u64(packet.data()+48)!=id.key||u64(packet.data()+56)!=id.stream){++s.rejected;continue;}
   auto& received=ssrc==c.config.stream_id?window.video1:window.video2;if(received){++s.rejected;continue;}
   auto bytes=static_cast<size_t>(n)-aether::protocol::media_header_bytes;require(s.authenticated_bytes.size()+bytes<=aether::protocol::dual_video_rounds*aether::protocol::maximum_stream_payload,AP_LENGTH);
   s.authenticated_bytes.append(reinterpret_cast<const char*>(packet.data()+aether::protocol::media_header_bytes),bytes);s.digest=hash(reinterpret_cast<const uint8_t*>(s.authenticated_bytes.data()),s.authenticated_bytes.size());++s.received;s.sequence=u16(packet.data()+2);s.timestamp=u32(packet.data()+4);++received;
  }
  c.windows.push_back(window);write_tls(c,control.data(),control.size());++c.control_progress;
 }
}
int32_t exchange(Context& c,const uint8_t* data,uint32_t size){
 c.exchange_deadline=std::chrono::steady_clock::now()+std::chrono::milliseconds(c.config.deadline_ms);
 handshake(c);
 if(c.config.role==1){
  std::array<uint8_t,4> frame{};read_tls(c,frame.data(),frame.size());uint32_t length=(uint32_t(frame[0])<<24)|(uint32_t(frame[1])<<16)|(uint32_t(frame[2])<<8)|frame[3];
  require(length>=10&&length<=512,AP_LENGTH);
  std::vector<uint8_t> request(length);read_tls(c,request.data(),length);
  require(c.config.permission_read==1,AP_PERMISSION);
  int32_t status=negotiate(request.data(),length,c.config.versions,c.config.version_count,&c.selected,&c.upgrade);
  if(status!=AP_OK){std::array<uint8_t,8> rejection{};put32(rejection.data(),static_cast<uint32_t>(status));put32(rejection.data()+4,c.upgrade);write_tls(c,rejection.data(),rejection.size());c.rejection_sent=true;return status;}
  std::array<uint8_t,2> port{};read_tls(c,port.data(),2);require(u16(port.data())!=0,AP_FIELD);
  if(full_requested(request.data(),length)){
   require(c.selected==2,AP_VERSION);c.media_limits=media_limits(request.data(),length);require(size<=64&&size+30u<=c.media_limits.frame,AP_LENGTH);std::array<uint8_t,80> peer_domain{};read_tls(c,peer_domain.data(),peer_domain.size());validate_domain(c,peer_domain.data(),c.selected);std::array<uint8_t,8> ack{};put32(ack.data()+4,c.selected);write_tls(c,ack.data(),ack.size());const auto domain=control_domain(c,c.selected);write_tls(c,domain.data(),domain.size());++c.grants;run_media(c,u16(port.data()),data,size);return AP_OK;
  }
  if(dual_requested(request.data(),length)){
   require(c.selected==2,AP_VERSION);require(size<=128,AP_LENGTH);create_dual_streams(c);std::array<uint8_t,8> ack{};put32(ack.data()+4,c.selected);write_tls(c,ack.data(),ack.size());++c.grants;transmit_dual(c,u16(port.data()),data,size);return AP_OK;
  }
  make_srtp(c);
  std::array<uint8_t,8> ack{};put32(ack.data()+4,c.selected);write_tls(c,ack.data(),ack.size());
  ++c.grants;
  std::vector<uint8_t> packet(12+size+SRTP_MAX_TRAILER_LEN);packet[0]=0x80;packet[1]=96;put16(packet.data()+2,1);put32(packet.data()+4,90000);put32(packet.data()+8,static_cast<uint32_t>(c.config.stream_id));std::memcpy(packet.data()+12,data,size);
  int n=static_cast<int>(12+size);require(srtp_protect(c.srtp,packet.data(),&n)==srtp_err_status_ok,AP_PROTECTION);
  auto remote=endpoint(u16(port.data()));require(sendto(c.udp.value,reinterpret_cast<const char*>(packet.data()),n,0,reinterpret_cast<sockaddr*>(&remote),sizeof(remote))==n,AP_INTERNAL_ERROR);
  // The control ACK proves the authenticated native sink completed before cleanup.
  std::array<uint8_t,1> done{};read_tls(c,done.data(),1);require(done[0]==1,AP_PROTECTION);return AP_OK;
 }
 std::array<uint8_t,4> frame{};put32(frame.data(),size);write_tls(c,frame.data(),frame.size());write_tls(c,data,size);
 uint32_t parse_version=0,parse_side=0;bool valid=negotiate(data,size,c.config.versions,c.config.version_count,&parse_version,&parse_side)==AP_OK;
 uint16_t redirect=valid?optional_port(data,size):uint16_t{0};
 std::array<uint8_t,2> port{};put16(port.data(),redirect?redirect:static_cast<uint16_t>(c.udp_port));write_tls(c,port.data(),port.size());
 const bool full=valid&&full_requested(data,size);if(full){const auto domain=control_domain(c,parse_version);write_tls(c,domain.data(),domain.size());}
 std::array<uint8_t,8> ack{};read_tls(c,ack.data(),ack.size());uint32_t status=(uint32_t(ack[0])<<24)|(uint32_t(ack[1])<<16)|(uint32_t(ack[2])<<8)|ack[3];
 if(status){c.upgrade=(uint32_t(ack[4])<<24)|(uint32_t(ack[5])<<16)|(uint32_t(ack[6])<<8)|ack[7];return static_cast<int32_t>(status);}
 c.selected=(uint32_t(ack[4])<<24)|(uint32_t(ack[5])<<16)|(uint32_t(ack[6])<<8)|ack[7];
 uint32_t selected=0,side=0;require(negotiate(data,size,c.config.versions,c.config.version_count,&selected,&side)==AP_OK&&selected==c.selected,AP_VERSION);
 if(full){std::array<uint8_t,80> peer_domain{};read_tls(c,peer_domain.data(),peer_domain.size());validate_domain(c,peer_domain.data(),c.selected);++c.grants;c.media_limits=media_limits(data,size);auto uplink=uplink_payload(data,size);run_media(c,redirect,uplink.data(),static_cast<uint32_t>(uplink.size()));return AP_OK;}
 if(dual_requested(data,size)){++c.grants;receive_dual(c);return AP_OK;}
 make_srtp(c);++c.grants;
 wait_socket(c,c.udp.value,false);std::array<uint8_t,1500> packet{};int n=recv(c.udp.value,reinterpret_cast<char*>(packet.data()),static_cast<int>(packet.size()),0);require(n>0,AP_TIMEOUT);
 require(srtp_unprotect(c.srtp,packet.data(),&n)==srtp_err_status_ok&&n>=12,AP_PROTECTION);
 require(packet[0]==0x80&&packet[1]==96,AP_FIELD);
 c.sink_digest=hash(packet.data()+12,static_cast<size_t>(n-12));++c.sink_packets;
 const uint8_t done=1;write_tls(c,&done,1);return AP_OK;
}
std::string summary(const Context& c){std::ostringstream s;s<<"{\"controlPort\":"<<c.tcp_port<<",\"udpPort\":"<<c.udp_port<<",\"status\":"<<c.result<<",\"selectedVersion\":"<<c.selected<<",\"upgradeSide\":"<<c.upgrade<<",\"grants\":"<<c.grants<<",\"sinkPackets\":"<<c.sink_packets<<",\"sinkDigest\":\""<<c.sink_digest<<"\",\"sequence\":"<<c.published<<",\"sockets\":"<<((c.listener.value!=invalid)+(c.tcp.value!=invalid)+(c.udp.value!=invalid))<<",\"threads\":0,\"stopped\":"<<(c.stopped?"true":"false")<<",\"confirmedProposals\":"<<c.confirmed_proposals<<",\"proposal\":"<<(c.proposal_json.empty()?"null":c.proposal_json)<<",\"persistentIdentity\":{\"instanceId\":"<<c.config.instance_id<<",\"displayId\":"<<c.config.display_id<<"},\"controlProgress\":"<<c.control_progress<<",\"streams\":[";
 bool comma=false;for(const auto& stream:c.streams){if(comma)s<<',';comma=true;s<<"{\"id\":"<<stream->domain.identity.stream<<",\"direction\":"<<unsigned(stream->domain.direction)<<",\"sent\":"<<stream->sent<<",\"received\":"<<stream->received<<",\"receivedPackets\":"<<stream->received_packets<<",\"protectionRejectedPackets\":"<<stream->protection_rejected<<",\"rejected\":"<<stream->rejected<<",\"recovered\":"<<stream->recovered<<",\"dropped\":"<<stream->dropped<<",\"expired\":"<<stream->expired<<",\"queueRejected\":"<<stream->queue_rejected<<",\"sequence\":"<<stream->sequence<<",\"timestamp\":"<<stream->timestamp<<",\"digest\":\""<<stream->digest<<"\"}";}s<<"],\"windows\":[";comma=false;for(const auto& w:c.windows){if(comma)s<<',';comma=true;s<<"{\"round\":"<<w.round<<",\"video1\":"<<w.video1<<",\"video2\":"<<w.video2<<",\"control\":"<<w.control<<",\"audio\":"<<w.audio<<",\"mic\":"<<w.mic<<",\"camera\":"<<w.camera<<"}";}s<<"],\"fecProfile\":"<<(c.full_media?"\"rs-vandermonde-gf256-11d-v1\"":"null")<<",\"queueBytes\":"<<c.queue_bytes<<",\"peakQueueBytes\":"<<c.peak_queue_bytes<<",\"queryVersion\":1,\"mediaLimits\":{\"headerBytes\":160,\"frameBytes\":"<<c.media_limits.frame<<",\"effectivePacketBytes\":"<<(176u+c.media_limits.shard)<<",\"k\":"<<c.media_limits.k<<",\"n\":"<<c.media_limits.n<<",\"perStreamQueueBytes\":"<<c.media_limits.per_stream_queue<<",\"deadlineMs\":"<<c.media_limits.ttl_ms<<"}}";return s.str();}
}
extern "C" {
int32_t aether_protocol_validate_media_options(const AetherProtocolMediaOptions* in,AetherProtocolEffectiveMedia* out){return boundary([&]() -> int32_t {
 require(in&&out,AP_INVALID_ARGUMENT);const auto capacity=out->struct_size;require(capacity>=sizeof(*out),AP_INVALID_ARGUMENT);
 require(out->abi_version==1,AP_ABI_MISMATCH);*out={1,sizeof(*out),0,0,0,0,0,0,0,0,0,0};
 require(in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1,AP_ABI_MISMATCH);
 std::vector<uint8_t> request{'A','E','T','H',0,0,1,1,0,2,0,1,0,1,5,0,3,0,2,0,1,0,6,0,1,'x',0,7,0,20};const auto offset=request.size();request.resize(offset+20);
 put16(request.data()+offset,in->packet_size);put16(request.data()+offset+2,in->path_mtu);put16(request.data()+offset+4,in->fec_percent);put16(request.data()+offset+6,in->min_repair);put16(request.data()+offset+8,in->shard_bytes);put16(request.data()+offset+10,in->source_shards);put32(request.data()+offset+12,in->per_stream_queue_bytes);put16(request.data()+offset+16,in->deadline_ms);put16(request.data()+offset+18,in->reserved);put16(request.data()+4,static_cast<uint16_t>(request.size()));
 const auto limits=media_limits(request.data(),static_cast<uint32_t>(request.size()));*out={1,sizeof(*out),1,160,176u+limits.shard,limits.frame,limits.per_stream_queue,limits.ttl_ms,limits.k,limits.n,limits.shard,1};return AP_OK;
});}
int32_t aether_protocol_negotiate(const uint8_t* b,uint32_t n,const uint32_t* local,uint32_t count,uint32_t* v,uint32_t* side){return boundary([&]{return negotiate(b,n,local,count,v,side);});}
int32_t aether_protocol_create(const AetherProtocolConfig* in,AetherProtocolEvent cb,uint64_t* token){return boundary([&]() -> int32_t {
 if(token)*token=0;
 require(in&&token&&cb&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1,AP_ABI_MISMATCH);
 require((in->role==1||in->role==2)&&in->deadline_ms>=1000&&in->deadline_ms<=3000&&in->peer_control_port<=65535&&!in->reserved&&!in->reserved2&&in->permission_read<=1,AP_INVALID_ARGUMENT);
 require(in->host_id&&in->instance_id&&in->display_id&&in->stream_id&&in->stream_id<=UINT32_MAX&&in->connection_id&&in->client_id&&in->lease_epoch&&in->config_generation&&in->key_generation,AP_INVALID_ARGUMENT);
 require(in->certificate_file&&in->private_key_file&&in->trust_file&&in->peer_name&&in->version_count&&in->version_count<=8,AP_INVALID_ARGUMENT);
 auto c=std::make_shared<Context>();c->config=*in;c->cert=bounded_string(in->certificate_file,4096);c->key=bounded_string(in->private_key_file,4096);c->trust=bounded_string(in->trust_file,4096);c->peer=bounded_string(in->peer_name,253);c->callback=cb;
 require(!c->cert.empty()&&!c->key.empty()&&!c->trust.empty()&&!c->peer.empty()&&c->peer.size()<=253,AP_INVALID_ARGUMENT);
 for(uint32_t i=0;i<in->version_count;++i)require(in->versions[i]&&in->versions[i]<=65535,AP_FIELD);
 static std::once_flag init;std::call_once(init,[]{
#ifdef _WIN32
  WSADATA w{};require(WSAStartup(MAKEWORD(2,2),&w)==0,AP_INTERNAL_ERROR);
#endif
  require(srtp_init()==srtp_err_status_ok,AP_INTERNAL_ERROR);
 });
 c->tls_context.reset(SSL_CTX_new(TLS_method()));require(c->tls_context!=nullptr,AP_INTERNAL_ERROR);
 require(SSL_CTX_set_min_proto_version(c->tls_context.get(),TLS1_3_VERSION)==1&&SSL_CTX_set_max_proto_version(c->tls_context.get(),TLS1_3_VERSION)==1,AP_PROTECTION);
 SSL_CTX_set_verify(c->tls_context.get(),SSL_VERIFY_PEER|SSL_VERIFY_FAIL_IF_NO_PEER_CERT,nullptr);
 SSL_CTX_set_max_early_data(c->tls_context.get(),0);SSL_CTX_set_session_cache_mode(c->tls_context.get(),SSL_SESS_CACHE_OFF);
 require(SSL_CTX_load_verify_locations(c->tls_context.get(),c->trust.c_str(),nullptr)==1,AP_TRUST);
 require(SSL_CTX_use_certificate_chain_file(c->tls_context.get(),c->cert.c_str())==1&&SSL_CTX_use_PrivateKey_file(c->tls_context.get(),c->key.c_str(),SSL_FILETYPE_PEM)==1&&SSL_CTX_check_private_key(c->tls_context.get())==1,AP_IDENTITY);
 make_socket(c->udp,SOCK_DGRAM,in->deadline_ms);c->udp_port=bind_socket(c->udp);
 if(in->role==1){make_socket(c->listener,SOCK_STREAM,in->deadline_ms);c->tcp_port=bind_socket(c->listener);require(listen(c->listener.value,1)==0,AP_INTERNAL_ERROR);}
 {std::lock_guard lock(registry_mutex);require(registry.size()<64&&next_token<UINT64_MAX,AP_BUSY);c->token=next_token++;registry.emplace(c->token,c);}
 *token=c->token;return AP_OK;
});}
int32_t aether_protocol_submit(uint64_t token,const uint8_t* bytes,uint32_t n){return boundary([&]() -> int32_t {
 auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);require(bytes&&n&&n<=1024,AP_LENGTH);
 std::unique_lock operation_lock(c->operation_mutex,std::try_to_lock);require(operation_lock.owns_lock(),AP_BUSY);
 std::unique_lock lock(c->mutex,std::try_to_lock);require(lock.owns_lock(),AP_BUSY);require(!c->stopped,AP_STOPPED);require(!c->submitted&&!c->control,AP_BUSY);c->submitted=true;
 c->result=boundary([&]{return exchange(*c,bytes,n);});
 if(c->result!=AP_OK&&c->config.role==1&&c->authenticated&&!c->grants&&!c->rejection_sent){std::array<uint8_t,8> reject{};put32(reject.data(),static_cast<uint32_t>(c->result));boundary([&]{write_tls(*c,reject.data(),reject.size());return AP_OK;});}
 ++c->published;auto status=c->result;auto sequence=c->published;auto cb=c->callback;lock.unlock();cb(token,sequence,2,status,1);return status;
});}
int32_t aether_protocol_query(uint64_t token,char* out,uint32_t capacity,uint32_t* required){return boundary([&]() -> int32_t {
 require(required&&(!capacity||out),AP_INVALID_ARGUMENT);auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);auto s=summary(*c);*required=static_cast<uint32_t>(s.size()+1);
 if(capacity<*required){if(capacity){std::memcpy(out,s.data(),capacity-1);out[capacity-1]=0;}return AP_BUFFER_TOO_SMALL;}std::memcpy(out,s.c_str(),s.size()+1);return AP_OK;
});}
int32_t aether_protocol_ack(uint64_t token,uint64_t sequence){return boundary([&]() -> int32_t {auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(sequence>=c->acked&&sequence<=c->published,AP_INVALID_ARGUMENT);c->acked=sequence;return AP_OK;});}
int32_t aether_protocol_stop(uint64_t token,uint64_t* sequence){return boundary([&]() -> int32_t {require(sequence!=nullptr,AP_INVALID_ARGUMENT);*sequence=0;auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);if(c->control)return control_stop(c,sequence);auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(2);std::unique_lock operation_lock(c->operation_mutex,std::defer_lock);require(operation_lock.try_lock_until(deadline),AP_TIMEOUT);std::unique_lock lock(c->mutex,std::defer_lock);require(lock.try_lock_until(deadline),AP_TIMEOUT);c->cleanup();c->stopped=true;*sequence=c->published;return AP_OK;});}
int32_t aether_protocol_destroy(uint64_t token){return boundary([&]() -> int32_t {std::lock_guard lock(registry_mutex);auto i=registry.find(token);require(i!=registry.end(),AP_INVALID_HANDLE);auto c=i->second;std::lock_guard context_lock(c->mutex);require(c->stopped&&c->acked==c->published,AP_BUSY);registry.erase(i);return AP_OK;});}
int32_t aether_protocol_propose(uint64_t token,const AetherProtocolRequest* in){return boundary([&]() -> int32_t {
 require(in&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1,AP_ABI_MISMATCH);
 require(in->capabilities&&in->capability_count&&in->capability_count<=32&&in->expires_ms&&in->expires_ms<=60000&&in->request_id&&in->budget_revision,AP_INVALID_ARGUMENT);
 auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);require(c->authenticated&&c->result==AP_OK&&c->config.permission_read,AP_PERMISSION);
 require(in->request_id>c->request_id&&in->lease_epoch==c->config.lease_epoch,AP_STALE);
 std::map<std::string,AetherProtocolCapability> caps;
 for(uint32_t i=0;i<in->capability_count;++i){auto cap=in->capabilities[i];auto end=static_cast<const char*>(std::memchr(cap.name,0,sizeof(cap.name)));require(end&&end!=cap.name&&cap.availability<=2&&cap.reason<=3&&cap.requested<=UINT32_MAX&&cap.available<=UINT32_MAX,AP_FIELD);std::string name(cap.name,static_cast<size_t>(end-cap.name));
  require(std::all_of(name.begin(),name.end(),[](char ch){return (ch>='a'&&ch<='z')||(ch>='0'&&ch<='9')||ch=='_';}),AP_FIELD);
  require((cap.availability==1&&cap.requested<=cap.available)||cap.reason!=0,AP_FIELD);require(caps.emplace(name,cap).second,AP_FIELD);
 }
 std::vector<uint8_t> canonical{'A','P','R','O','P',0,1};
 for(uint64_t id:{c->config.host_id,c->config.instance_id,c->config.display_id,c->config.stream_id,c->config.connection_id,c->config.client_id,c->config.config_generation,c->config.key_generation,in->request_id,in->budget_revision,in->lease_epoch})append64(canonical,id);
 append64(canonical,in->expires_ms);append64(canonical,caps.size());
 std::ostringstream items;bool comma=false;
 for(const auto& [name,cap]:caps){append64(canonical,name.size());canonical.insert(canonical.end(),name.begin(),name.end());for(uint64_t v:{uint64_t(cap.availability),uint64_t(cap.reason),cap.requested,cap.available})append64(canonical,v);
  if(comma)items<<',';comma=true;items<<"{\"name\":\""<<name<<"\",\"availability\":"<<cap.availability<<",\"reason\":"<<cap.reason<<",\"requested\":"<<cap.requested<<",\"final\":"<<(cap.availability==1?std::min(cap.requested,cap.available):0)<<",\"disabled\":"<<(cap.availability==1?"false":"true")<<"}";
 }
 auto digest=hash(canonical.data(),canonical.size());std::ostringstream out;out<<"{\"requestId\":"<<in->request_id<<",\"budgetRevision\":"<<in->budget_revision<<",\"leaseEpoch\":"<<in->lease_epoch<<",\"expiresMs\":"<<in->expires_ms<<",\"digest\":\""<<digest<<"\",\"capabilities\":["<<items.str()<<"]}";
 auto json=out.str();c->proposal_digest=std::move(digest);c->proposal_json=std::move(json);c->request_id=in->request_id;c->budget_revision=in->budget_revision;c->proposal_expiry=std::chrono::steady_clock::now()+std::chrono::milliseconds(in->expires_ms);c->proposal_cancelled=false;c->proposal_confirmed=false;return AP_OK;
});}
int32_t aether_protocol_confirm(uint64_t token,uint64_t id,uint64_t budget,const char* digest){return boundary([&]() -> int32_t {
 require(digest!=nullptr,AP_INVALID_ARGUMENT);auto value=bounded_string(digest,64);require(value.size()==64,AP_INVALID_ARGUMENT);auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);
 require(id==c->request_id&&budget==c->budget_revision&&c->proposal_digest.size()==64&&CRYPTO_memcmp(digest,c->proposal_digest.data(),64)==0,AP_STALE);
 require(!c->proposal_cancelled,AP_CANCELLED);require(!c->proposal_confirmed,AP_ALREADY_COMPLETE);require(std::chrono::steady_clock::now()<c->proposal_expiry,AP_EXPIRED);require(c->confirmed_proposals<UINT64_MAX,AP_BUSY);
 c->proposal_confirmed=true;++c->confirmed_proposals;return AP_OK;
});}
int32_t aether_protocol_cancel(uint64_t token,uint64_t id){return boundary([&]() -> int32_t {auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);require(id==c->request_id&&id!=0,AP_STALE);require(!c->proposal_confirmed,AP_ALREADY_COMPLETE);c->proposal_cancelled=true;return AP_OK;});}
}
namespace aether::protocol {
std::shared_ptr<ConnectionContext> find_context(uint64_t token){return find(token);}
int32_t attach_host_services(uint64_t token,std::shared_ptr<HostServices> service){return boundary([&]()->int32_t{
 auto c=find(token);require(c&&service,AP_INVALID_ARGUMENT);std::lock_guard lock(c->mutex);
 require(c->config.role==1&&service->host_id()==c->config.host_id,AP_IDENTITY);
 require(!c->submitted&&!c->control&&!c->stopped,AP_BUSY);c->host_services=std::move(service);return AP_OK;
});}
}
extern "C" {
int32_t aether_protocol_control_open(uint64_t t,const AetherProtocolControlOpen* in){return boundary([&]{return control_open(find(t),in);});}
int32_t aether_protocol_control_send(uint64_t t,const AetherProtocolCommand* in){return boundary([&]{return control_send(find(t),in);});}
int32_t aether_protocol_control_cancel_operation(uint64_t t,uint64_t op){return boundary([&]{return control_cancel(find(t),op);});}
int32_t aether_protocol_control_query(uint64_t t,char* out,uint32_t n,uint32_t* required){return boundary([&]{return control_query(find(t),out,n,required);});}
int32_t aether_protocol_control_ack(uint64_t t,uint64_t seq){return boundary([&]{return control_ack(find(t),seq);});}
}

// CONTROL_IMPLEMENTATION_BEGIN: moved into control.cpp by the dispatcher task.
namespace aether::protocol {
using Clock=std::chrono::steady_clock;
namespace ctl {
using Fields=std::map<uint16_t,std::vector<uint8_t>>;
Fields fields(const std::vector<uint8_t>& b){
 require(b.size()>=4&&b.size()<=8192,AP_LENGTH);require(u16(b.data())==1&&u16(b.data()+2)<=32,AP_FIELD);
 Fields out;size_t offset=4;for(unsigned i=0;i<u16(b.data()+2);++i){require(offset+4<=b.size(),AP_LENGTH);auto t=u16(b.data()+offset),n=u16(b.data()+offset+2);offset+=4;require(t&&!(t&0x8000)&&!out.count(t),AP_FIELD);require(n<=b.size()-offset,AP_LENGTH);out.emplace(t,std::vector<uint8_t>(b.begin()+offset,b.begin()+offset+n));offset+=n;}require(offset==b.size(),AP_LENGTH);return out;
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
void transmit(ConnectionContext& c,Record r,uint64_t& seq){r.sequence=++seq;auto b=record(r);write_tls(c,b.data(),b.size());}
}
int32_t AdmissionEngine::request(Reservation& r,const std::vector<uint8_t>& payload,uint32_t ttl,std::string& json){
 require(services!=nullptr,AP_PERMISSION);auto f=ctl::fields(payload);auto policy=ctl::number(f,1),preference=ctl::number(f,2);require(policy<=2&&preference>=1&&preference<=2&&ttl&&ttl<=60000,AP_FIELD);
 auto streams=f.find(4),caps=f.find(5);require(streams!=f.end()&&caps!=f.end(),AP_FIELD);auto& b=streams->second;require(b.size()>=2&&u16(b.data())>=1&&u16(b.data())<=8&&b.size()==2+56u*u16(b.data()),AP_LENGTH);
 r.resources={};std::set<uint64_t> ids;std::ostringstream specs;for(size_t p=2;p<b.size();p+=56){auto stream=u64(b.data()+p),display=u64(b.data()+p+8);auto kind=u32(b.data()+p+16),direction=u32(b.data()+p+20),w=u32(b.data()+p+24),h=u32(b.data()+p+28),fn=u32(b.data()+p+32),fd=u32(b.data()+p+36),rate=u32(b.data()+p+40),codec=u32(b.data()+p+44),colour=u32(b.data()+p+48),role=u32(b.data()+p+52);
  require(stream&&display&&ids.insert(stream).second&&fd&&fn&&w&&h&&rate,AP_FIELD);require(kind==AP_VIDEO&&direction==AP_DOWNLINK&&codec==1&&colour==1&&role==0,AP_VERSION);require(stream==r.binding.identity.stream&&display==r.binding.identity.display,AP_IDENTITY);
  auto pixels=ctl::mul(ctl::mul(w,h),fn);pixels=pixels/fd+(pixels%fd!=0);r.resources.host_encoder_sessions=ctl::plus(r.resources.host_encoder_sessions,1);r.resources.client_downlink_decoder_sessions=ctl::plus(r.resources.client_downlink_decoder_sessions,1);r.resources.pixel_rate_per_second=ctl::plus(r.resources.pixel_rate_per_second,pixels);r.resources.vram_bytes=ctl::plus(r.resources.vram_bytes,ctl::mul(ctl::mul(w,h),4));r.resources.bandwidth_bits_per_second=ctl::plus(r.resources.bandwidth_bits_per_second,rate);
  if(p!=2)specs<<',';specs<<"{\"streamId\":"<<stream<<",\"displayId\":"<<display<<",\"mediaKind\":"<<kind<<",\"direction\":"<<direction<<",\"width\":"<<w<<",\"height\":"<<h<<",\"fpsNumerator\":"<<fn<<",\"fpsDenominator\":"<<fd<<",\"bitrateBps\":"<<rate<<",\"codec\":"<<codec<<",\"colour\":"<<colour<<",\"role\":"<<role<<'}';
 }
 auto& cap=caps->second;require(cap.size()>=2&&u16(cap.data())<=32,AP_LENGTH);size_t p=2;std::set<std::string> names;std::ostringstream capabilities;for(unsigned n=0;n<u16(cap.data());++n){require(p+2<=cap.size(),AP_LENGTH);auto len=u16(cap.data()+p);p+=2;require(len&&len<=31&&p+len+8<=cap.size(),AP_LENGTH);std::string name(cap.begin()+p,cap.begin()+p+len);p+=len;require(std::all_of(name.begin(),name.end(),[](unsigned char ch){return ch>=33&&ch<=126&&ch!='"'&&ch!='\\';})&&names.insert(name).second,AP_FIELD);auto requested=u64(cap.data()+p);p+=8;if(n)capabilities<<',';capabilities<<"{\"name\":\""<<name<<"\",\"availability\":2,\"reason\":3,\"requested\":"<<requested<<",\"effective\":0}";}require(p==cap.size(),AP_LENGTH);
 auto snapshot=services->snapshot(r.binding);require(snapshot.host_id==r.binding.identity.host&&snapshot.read_allowed,AP_PERMISSION);r.revision=snapshot.revision;r.expiry_token=snapshot.expiry_token;r.expiry=Clock::now()+std::chrono::milliseconds(ttl);
 auto canonical=payload;for(auto v:{r.binding.identity.host,r.binding.identity.instance,r.binding.identity.display,r.binding.identity.stream,r.binding.identity.connection,r.binding.identity.client,r.binding.identity.lease,r.binding.identity.config,r.binding.identity.key,r.binding.request_id,r.revision,r.expiry_token}){auto k=canonical.size();canonical.resize(k+8);put64(canonical.data()+k,v);}for(auto v:r.resources.values()){auto k=canonical.size();canonical.resize(k+8);put64(canonical.data()+k,v);}r.binding.digest=hash(canonical.data(),canonical.size());auto status=services->reserve(r,ttl);if(status!=AP_OK)return status;
 std::ostringstream s;s<<"{\"requestId\":"<<r.binding.request_id<<",\"hostRevision\":"<<r.revision<<",\"expiryToken\":"<<r.expiry_token<<",\"digest\":\""<<r.binding.digest<<"\",\"policy\":"<<policy<<",\"preference\":"<<preference<<",\"resources\":"<<ctl::resources(r.resources)<<",\"streams\":["<<specs.str()<<"],\"capabilities\":["<<capabilities.str()<<"],\"supported\":true}";json=s.str();require(json.size()<=6144,AP_LENGTH);return AP_OK;
}
int32_t AdmissionEngine::confirm(Reservation& r,const Binding& b,uint64_t revision,uint64_t expiry){require(services!=nullptr,AP_PERMISSION);require(b.request_id==r.binding.request_id&&b.digest==r.binding.digest&&revision==r.revision&&expiry==r.expiry_token,AP_STALE);require(Clock::now()<r.expiry,AP_EXPIRED);r.binding.operation_id=b.operation_id;return services->commit(r);}
int32_t AdmissionEngine::cancel(Reservation& r){require(services!=nullptr,AP_PERMISSION);return services->cancel(r);}
int32_t dispatch_recovery(ConnectionContext&,RecoveryController&,uint32_t,const Binding&,uint32_t){return AP_VERSION;}
int32_t dispatch_trace(ConnectionContext&,TraceWindow&,uint32_t,uint32_t){return AP_VERSION;}
struct ControlState {
 struct Command {AetherProtocolCommand meta{};std::vector<uint8_t> payload;};
 struct Result {uint64_t operation=0,request=0,event=0,transaction=0;int32_t status=AP_BUSY,authority=AP_BUSY;bool terminal=false,known=false;uint32_t phase=1;std::string cancel="none";};
 std::mutex mutex;std::condition_variable wake;std::thread worker;
 std::atomic<bool> stopping{false};bool finished=false,opened=false;uint64_t last_operation=0,published=0,acked=0,tx=0,rx=0;
 uint32_t queued_bytes=0,grants=0,sinks=0,peer_udp=0;std::string proposal="null",digest,sink_digest;uint64_t revision=0,expiry=0;
 std::deque<Command> commands;std::map<uint64_t,Result> results;std::deque<std::pair<uint64_t,uint64_t>> events;std::set<uint64_t> cancellations;
 std::map<uint64_t,Reservation> reservations;std::string snapshot;
 ~ControlState(){if(worker.joinable())worker.join();}
};
namespace ctl {
void snapshot(ConnectionContext& c,ControlState& s){std::ostringstream j;j<<"{\"queryVersion\":2,\"commandVersion\":1,\"selectedVersion\":"<<(s.opened?3:0)<<",\"authenticated\":"<<(s.opened?"true":"false")<<",\"grants\":"<<s.grants<<",\"sinkPackets\":"<<s.sinks<<",\"sinkDigest\":\""<<s.sink_digest<<"\",\"sequence\":"<<s.published<<",\"acked\":"<<s.acked<<",\"queueBytes\":"<<s.queued_bytes<<",\"proposal\":"<<s.proposal<<",\"hostRevision\":"<<s.revision<<",\"expiryToken\":"<<s.expiry<<",\"persistentIdentity\":{\"instanceId\":"<<c.config.instance_id<<",\"displayId\":"<<c.config.display_id<<"},\"operations\":[";bool comma=false;for(auto& [id,r]:s.results){if(comma)j<<',';comma=true;j<<"{\"operationId\":"<<id<<",\"requestId\":"<<r.request<<",\"status\":"<<r.status<<",\"terminal\":"<<(r.terminal?"true":"false")<<",\"resultKnown\":"<<(r.known?"true":"false")<<",\"authorityTerminal\":"<<(r.known?std::to_string(r.authority):"null")<<",\"transactionSequence\":"<<r.transaction<<",\"activationPhase\":"<<r.phase<<",\"cancelOutcome\":\""<<r.cancel<<"\"}";}j<<"],\"threads\":"<<(s.finished?0:1)<<",\"stopped\":"<<(c.stopped?"true":"false")<<'}';s.snapshot=j.str();require(s.snapshot.size()<=65535,AP_LENGTH);}
void event(ConnectionContext& c,ControlState& s,uint64_t op,int32_t status,bool known,uint64_t transaction=0,uint32_t phase=1,uint32_t kind=11){uint64_t seq;{std::lock_guard lock(s.mutex);auto& r=s.results[op];if(kind==11&&r.terminal)return;r.operation=op;r.status=status;r.known=known;r.authority=status;r.transaction=transaction;r.phase=phase;r.terminal=kind==11;seq=++s.published;r.event=seq;s.events.emplace_back(seq,op);snapshot(c,s);}c.callback(c.token,seq,kind,status,op);}
Record response(ConnectionContext& c,const Record& request,int32_t status,const Reservation* r=nullptr,const std::string& proposal=""){Record out=request;out.identity=identity(c);out.flags=1;Fields f;add(f,12,status,4);add(f,13,status,4);add(f,14,3,4);if(!proposal.empty())f[15]={proposal.begin(),proposal.end()};if(r){add(f,18,r->transaction_sequence,8);add(f,19,r->phase,4);add(f,20,request.operation,8);if(r->phase==3)add(f,21,3000,4);}out.payload=encode(f);return out;}
bool ready(ConnectionContext& c){return SSL_pending(c.tls.get())>0||datagram_ready(c.tcp.value,Clock::now()+std::chrono::milliseconds(20));}
void negotiate_control(ConnectionContext& c,ControlState& s,const std::vector<uint8_t>& data){c.exchange_deadline=Clock::now()+std::chrono::milliseconds(c.config.deadline_ms);handshake(c);std::array<uint8_t,4> n{};if(c.config.role==2){put32(n.data(),static_cast<uint32_t>(data.size()));write_tls(c,n.data(),4);write_tls(c,data.data(),data.size());}else{read_tls(c,n.data(),4);auto size=u32(n.data());require(size>=10&&size<=512,AP_LENGTH);std::vector<uint8_t> b(size);read_tls(c,b.data(),b.size());hello(b);bool local=false;for(unsigned i=0;i<c.config.version_count;++i)if(c.config.versions[i]==3)local=true;require(local,AP_VERSION);}
 if(c.config.role==1){put32(n.data(),3);write_tls(c,n.data(),4);}else{read_tls(c,n.data(),4);require(u32(n.data())==3,AP_VERSION);}
 c.selected=3;std::array<uint8_t,82> binding{};auto id=identity(c);size_t p=0;for(auto v:{id.host,id.instance,id.display,id.stream,id.connection,id.client,id.lease,id.config,id.key,uint64_t{3}}){put64(binding.data()+p,v);p+=8;}put16(binding.data()+80,static_cast<uint16_t>(c.udp_port));auto local=binding;if(c.config.role==1){write_tls(c,local.data(),82);read_tls(c,binding.data(),82);}else{read_tls(c,binding.data(),82);write_tls(c,local.data(),82);}require(!std::memcmp(binding.data(),local.data(),80),AP_IDENTITY);s.peer_udp=u16(binding.data()+80);require(s.peer_udp!=0,AP_FIELD);{std::lock_guard lock(s.mutex);s.opened=true;snapshot(c,s);}event(c,s,0,AP_OK,true);
}
void video(ConnectionContext& c,ControlState& s){if(!c.srtp)make_srtp(c);auto remote=endpoint(s.peer_udp);if(c.config.role==1){const std::string data="confirmed-synthetic-video";std::vector<uint8_t> b(12+data.size()+SRTP_MAX_TRAILER_LEN);b[0]=0x80;b[1]=96;put16(b.data()+2,static_cast<uint16_t>(s.grants));put32(b.data()+4,90000*s.grants);put32(b.data()+8,static_cast<uint32_t>(c.config.stream_id));std::memcpy(b.data()+12,data.data(),data.size());int n=static_cast<int>(12+data.size());require(srtp_protect(c.srtp,b.data(),&n)==srtp_err_status_ok,AP_PROTECTION);require(sendto(c.udp.value,reinterpret_cast<const char*>(b.data()),n,0,reinterpret_cast<sockaddr*>(&remote),sizeof(remote))==n,AP_INTERNAL_ERROR);}else{wait_socket(c,c.udp.value,false);std::array<uint8_t,1500> b{};int n=recv(c.udp.value,reinterpret_cast<char*>(b.data()),static_cast<int>(b.size()),0);require(n>=28&&srtp_unprotect(c.srtp,b.data(),&n)==srtp_err_status_ok&&n>=12&&b[0]==0x80&&b[1]==96&&u32(b.data()+8)==c.config.stream_id,AP_PROTECTION);std::lock_guard lock(s.mutex);++s.sinks;s.sink_digest=hash(b.data()+12,static_cast<size_t>(n-12));snapshot(c,s);}}
void host_record(ConnectionContext& c,ControlState& s,const Record& in){auto f=fields(in.payload);int32_t status=AP_VERSION;Reservation* r=nullptr;std::string proposal;AdmissionEngine engine(c.host_services);try{
 if(in.opcode==1||in.opcode==4){require(in.operation>s.last_operation&&in.request&&!s.reservations.count(in.request),AP_STALE);s.last_operation=in.operation;Reservation next;next.binding={in.identity,in.operation,in.request,{}};status=engine.request(next,in.payload,number(f,3),proposal);if(status==AP_OK){auto pos=s.reservations.emplace(in.request,std::move(next));r=&pos.first->second;}}
 else if(in.opcode==2){require(in.operation>s.last_operation,AP_STALE);s.last_operation=in.operation;auto i=s.reservations.find(in.request);require(i!=s.reservations.end(),AP_STALE);r=&i->second;Binding b{in.identity,in.operation,in.request,hex(item(f,6,32))};status=engine.confirm(*r,b,wide(f,7),wide(f,8));}
 else if(in.opcode==3){auto i=s.reservations.find(in.request);require(i!=s.reservations.end(),AP_STALE);r=&i->second;status=engine.cancel(*r);}
 else if(in.opcode==14){auto i=s.reservations.find(in.request);require(i!=s.reservations.end()&&c.host_services,AP_STALE);r=&i->second;status=c.host_services->status(*r);if(f.count(19)&&number(f,19)==3){status=c.host_services->activate(*r);if(status==AP_OK){std::lock_guard lock(s.mutex);s.grants=static_cast<uint32_t>(std::count_if(s.reservations.begin(),s.reservations.end(),[](const auto& value){return value.second.phase==4;}));}}}
 }catch(Failure e){status=e.status;}auto out=response(c,in,status,r,proposal);transmit(c,out,s.tx);if(in.opcode==14&&r&&r->phase==4&&status==AP_OK)video(c,s);{std::lock_guard lock(s.mutex);if(!proposal.empty())s.proposal=proposal;snapshot(c,s);}}
void client_command(ConnectionContext& c,ControlState& s,ControlState::Command command){auto& m=command.meta;bool cancelled=false;{std::lock_guard lock(s.mutex);cancelled=s.cancellations.count(m.operation_id)>0;}if(cancelled){event(c,s,m.operation_id,AP_CANCELLED,true);return;}
 c.exchange_deadline=Clock::now()+std::chrono::milliseconds(m.deadline_ms);Record r{static_cast<uint16_t>(m.opcode),0,m.operation_id,m.request_id,0,identity(c),command.payload};r.identity.stream=m.stream_id;transmit(c,r,s.tx);auto response_record=receive(c,s.rx);require(response_record.operation==m.operation_id&&response_record.request==m.request_id&&response_record.flags==1,AP_STALE);auto f=fields(response_record.payload);auto status=static_cast<int32_t>(number(f,12));uint64_t transaction=f.count(18)?wide(f,18):0;uint32_t phase=f.count(19)?number(f,19):1;
 if(f.count(15)){std::string proposal(f.at(15).begin(),f.at(15).end());require(proposal.find('"')!=std::string::npos,AP_FIELD);std::lock_guard lock(s.mutex);s.proposal=proposal;auto marker=proposal.find("\"digest\":\"");if(marker!=std::string::npos)s.digest=proposal.substr(marker+10,64);snapshot(c,s);}
 if(m.opcode==2&&status==AP_OK&&phase==3){make_srtp(c);Fields ready_fields;add(ready_fields,20,m.operation_id,8);add(ready_fields,18,transaction,8);add(ready_fields,19,3,4);r.opcode=14;r.flags=2;r.payload=encode(ready_fields);transmit(c,r,s.tx);auto ack=receive(c,s.rx);require(ack.operation==m.operation_id&&ack.request==m.request_id,AP_STALE);auto af=fields(ack.payload);status=static_cast<int32_t>(number(af,12));phase=number(af,19);require(wide(af,18)>=transaction&&phase==4&&status==AP_OK,AP_STALE);transaction=wide(af,18);{std::lock_guard lock(s.mutex);++s.grants;}video(c,s);}
 event(c,s,m.operation_id,status,true,transaction,phase);
}
void worker(std::shared_ptr<ConnectionContext> context,std::vector<uint8_t> hello_bytes){auto& c=*context;auto& s=*c.control;try{negotiate_control(c,s,hello_bytes);while(!s.stopping){if(c.config.role==1){if(!ready(c))continue;c.exchange_deadline=Clock::now()+std::chrono::milliseconds(3000);auto r=receive(c,s.rx);host_record(c,s,r);}else{ControlState::Command command;{std::unique_lock lock(s.mutex);s.wake.wait_for(lock,std::chrono::milliseconds(20),[&]{return s.stopping||!s.commands.empty();});if(s.stopping)break;if(s.commands.empty())continue;command=std::move(s.commands.front());s.commands.pop_front();s.queued_bytes-=static_cast<uint32_t>(command.payload.size());}try{client_command(c,s,command);}catch(Failure e){event(c,s,command.meta.operation_id,e.status,false);if(e.status!=AP_TIMEOUT)break;}}}}
 catch(Failure e){event(c,s,0,e.status,false);}catch(...){event(c,s,0,AP_INTERNAL_ERROR,false);}
 if(c.host_services)c.host_services->release_connection(c.config.connection_id);c.cleanup();{std::lock_guard lock(s.mutex);s.opened=false;s.finished=true;snapshot(c,s);}s.wake.notify_all();
}
}
int32_t control_open(std::shared_ptr<ConnectionContext> c,const AetherProtocolControlOpen* in){require(c!=nullptr,AP_INVALID_HANDLE);require(in&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1&&in->command_version==1,AP_ABI_MISMATCH);require(!in->reserved&&!in->reserved2&&in->hello_bytes<=512,AP_FIELD);std::vector<uint8_t> data;if(c->config.role==2){require(in->hello&&in->hello_bytes>=10,AP_LENGTH);data.assign(in->hello,in->hello+in->hello_bytes);ctl::hello(data);}else require(!in->hello_bytes&&!in->hello,AP_FIELD);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);require(!c->submitted&&!c->control,AP_BUSY);c->control=std::make_shared<ControlState>();{std::lock_guard state(c->control->mutex);ctl::snapshot(*c,*c->control);}c->control->worker=std::thread(ctl::worker,c,std::move(data));return AP_OK;}
int32_t control_send(std::shared_ptr<ConnectionContext> c,const AetherProtocolCommand* in){require(c!=nullptr,AP_INVALID_HANDLE);require(in&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1&&in->command_version==1,AP_ABI_MISMATCH);require(in->opcode>=1&&in->opcode<=13&&!in->flags&&!in->reserved&&in->operation_id&&in->deadline_ms&&in->deadline_ms<=3000,AP_FIELD);require(in->payload&&in->payload_bytes>=4&&in->payload_bytes<=8192,AP_LENGTH);ControlState::Command cmd;cmd.meta=*in;cmd.meta.payload=nullptr;cmd.payload.assign(in->payload,in->payload+in->payload_bytes);(void)ctl::fields(cmd.payload);require(c->control&&c->config.role==2,AP_BUSY);auto& s=*c->control;std::lock_guard lock(s.mutex);require(!s.stopping&&!s.finished,AP_STOPPED);require(s.opened,AP_BUSY);require(in->operation_id>s.last_operation,AP_STALE);require(s.results.size()<32&&s.events.size()+2*s.results.size()<254&&s.queued_bytes<=262144-in->payload_bytes,AP_BUSY);s.last_operation=in->operation_id;ControlState::Result result;result.operation=in->operation_id;result.request=in->request_id;s.results.emplace(in->operation_id,result);s.queued_bytes+=in->payload_bytes;s.commands.push_back(std::move(cmd));ctl::snapshot(*c,s);s.wake.notify_all();return AP_OK;}
int32_t control_cancel(std::shared_ptr<ConnectionContext> c,uint64_t op){require(c&&c->control,AP_INVALID_HANDLE);auto& s=*c->control;std::lock_guard lock(s.mutex);require(!s.stopping,AP_STOPPED);require(op==0||s.results.count(op),AP_STALE);if(op&&s.results.at(op).terminal)return AP_ALREADY_COMPLETE;s.cancellations.insert(op);s.wake.notify_all();return AP_OK;}
int32_t control_query(std::shared_ptr<ConnectionContext> c,char* out,uint32_t n,uint32_t* required){require(c&&c->control,AP_INVALID_HANDLE);require(required&&(!n||out),AP_INVALID_ARGUMENT);auto& s=*c->control;std::lock_guard lock(s.mutex);auto& b=s.snapshot;*required=static_cast<uint32_t>(b.size()+1);if(n<*required){if(n){std::memcpy(out,b.data(),n-1);out[n-1]=0;}return AP_BUFFER_TOO_SMALL;}std::memcpy(out,b.c_str(),b.size()+1);return AP_OK;}
int32_t control_ack(std::shared_ptr<ConnectionContext> c,uint64_t seq){require(c&&c->control,AP_INVALID_HANDLE);auto& s=*c->control;std::lock_guard lock(s.mutex);require(seq==s.acked||seq==s.acked+1,AP_INVALID_ARGUMENT);require(seq<=s.published,AP_INVALID_ARGUMENT);s.acked=seq;if(!s.events.empty()&&s.events.front().first==seq){auto op=s.events.front().second;s.events.pop_front();auto i=s.results.find(op);if(i!=s.results.end()&&i->second.terminal&&i->second.event==seq)s.results.erase(i);}c->acked=seq;ctl::snapshot(*c,s);return AP_OK;}
int32_t control_stop(std::shared_ptr<ConnectionContext> c,uint64_t* seq){require(seq,AP_INVALID_ARGUMENT);auto& s=*c->control;s.stopping=true;s.wake.notify_all();if(c->tcp.value!=invalid){
#ifdef _WIN32
 shutdown(c->tcp.value,SD_BOTH);
#else
 shutdown(c->tcp.value,SHUT_RDWR);
#endif
 }std::unique_lock lock(s.mutex);require(s.wake.wait_for(lock,std::chrono::seconds(2),[&]{return s.finished;}),AP_TIMEOUT);lock.unlock();if(s.worker.joinable())s.worker.join();lock.lock();c->stopped=true;c->published=s.published;*seq=s.published;ctl::snapshot(*c,s);return AP_OK;}
}
