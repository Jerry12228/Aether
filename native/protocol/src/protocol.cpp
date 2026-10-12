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
   require(c.selected==2,AP_VERSION);require(c.config.stream_id<=UINT32_MAX-4,AP_FIELD);c.media_limits=media_limits(request.data(),length);require(size<=64&&size+30u<=c.media_limits.frame,AP_LENGTH);std::array<uint8_t,80> peer_domain{};read_tls(c,peer_domain.data(),peer_domain.size());validate_domain(c,peer_domain.data(),c.selected);std::array<uint8_t,8> ack{};put32(ack.data()+4,c.selected);write_tls(c,ack.data(),ack.size());const auto domain=control_domain(c,c.selected);write_tls(c,domain.data(),domain.size());++c.grants;run_media(c,u16(port.data()),data,size);return AP_OK;
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
 const bool full=valid&&full_requested(data,size);if(full){require(c.config.stream_id<=UINT32_MAX-4,AP_FIELD);const auto domain=control_domain(c,parse_version);write_tls(c,domain.data(),domain.size());}
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
 require(required&&(!capacity||out),AP_INVALID_ARGUMENT);auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);if(c->control)return control_query(c,out,capacity,required);std::lock_guard lock(c->mutex);auto s=summary(*c);*required=static_cast<uint32_t>(s.size()+1);
 if(capacity<*required){if(capacity){std::memcpy(out,s.data(),capacity-1);out[capacity-1]=0;}return AP_BUFFER_TOO_SMALL;}std::memcpy(out,s.c_str(),s.size()+1);return AP_OK;
});}
int32_t aether_protocol_ack(uint64_t token,uint64_t sequence){return boundary([&]() -> int32_t {auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);if(c->control)return control_ack(c,sequence);std::lock_guard lock(c->mutex);require(sequence>=c->acked&&sequence<=c->published,AP_INVALID_ARGUMENT);c->acked=sequence;return AP_OK;});}
int32_t aether_protocol_stop(uint64_t token,uint64_t* sequence){return boundary([&]() -> int32_t {require(sequence!=nullptr,AP_INVALID_ARGUMENT);*sequence=0;auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);if(c->control)return control_stop(c,sequence);auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(2);std::unique_lock operation_lock(c->operation_mutex,std::defer_lock);require(operation_lock.try_lock_until(deadline),AP_TIMEOUT);std::unique_lock lock(c->mutex,std::defer_lock);require(lock.try_lock_until(deadline),AP_TIMEOUT);c->cleanup();c->stopped=true;*sequence=c->published;return AP_OK;});}
int32_t aether_protocol_destroy(uint64_t token){return boundary([&]() -> int32_t {std::lock_guard lock(registry_mutex);auto i=registry.find(token);require(i!=registry.end(),AP_INVALID_HANDLE);auto c=i->second;std::lock_guard context_lock(c->mutex);require(c->stopped&&c->acked==c->published,AP_BUSY);registry.erase(i);return AP_OK;});}
int32_t aether_protocol_propose(uint64_t token,const AetherProtocolRequest* in){return boundary([&]() -> int32_t {
 require(in&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1,AP_ABI_MISMATCH);
 require(in->capabilities&&in->capability_count&&in->capability_count<=32&&in->expires_ms&&in->expires_ms<=60000&&in->request_id&&in->budget_revision,AP_INVALID_ARGUMENT);
 auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);require(!c->control,AP_BUSY);require(c->authenticated&&c->result==AP_OK&&c->config.permission_read,AP_PERMISSION);
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
 require(!c->control,AP_BUSY);require(id==c->request_id&&budget==c->budget_revision&&c->proposal_digest.size()==64&&CRYPTO_memcmp(digest,c->proposal_digest.data(),64)==0,AP_STALE);
 require(!c->proposal_cancelled,AP_CANCELLED);require(!c->proposal_confirmed,AP_ALREADY_COMPLETE);require(std::chrono::steady_clock::now()<c->proposal_expiry,AP_EXPIRED);require(c->confirmed_proposals<UINT64_MAX,AP_BUSY);
 c->proposal_confirmed=true;++c->confirmed_proposals;return AP_OK;
});}
int32_t aether_protocol_cancel(uint64_t token,uint64_t id){return boundary([&]() -> int32_t {auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(!c->stopped,AP_STOPPED);require(!c->control,AP_BUSY);require(id==c->request_id&&id!=0,AP_STALE);require(!c->proposal_confirmed,AP_ALREADY_COMPLETE);c->proposal_cancelled=true;return AP_OK;});}
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

