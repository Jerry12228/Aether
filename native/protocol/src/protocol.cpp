#include "aether/protocol.h"
#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#else
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#endif
#include <openssl/ssl.h>
#include <openssl/x509v3.h>
#include <openssl/crypto.h>
#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/sslerr.h>
#include <srtp.h>
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
#ifdef _WIN32
using Socket=SOCKET;
constexpr Socket invalid=INVALID_SOCKET;
void close_socket(Socket s){closesocket(s);}
#else
using Socket=int;
constexpr Socket invalid=-1;
void close_socket(Socket s){close(s);}
#endif
struct Failure {int32_t status;};
void require(bool ok,int32_t status){if(!ok)throw Failure{status};}
template<class F> int32_t boundary(F f) noexcept {try{return f();}catch(Failure e){return e.status;}catch(...){return AP_INTERNAL_ERROR;}}
struct OwnedSocket {
 Socket value=invalid;
 ~OwnedSocket(){reset();}
 void reset(){if(value!=invalid){close_socket(value);value=invalid;}}
};
uint16_t u16(const uint8_t* p){return static_cast<uint16_t>((p[0]<<8)|p[1]);}
void put16(uint8_t* p,uint16_t v){p[0]=static_cast<uint8_t>(v>>8);p[1]=static_cast<uint8_t>(v);}
void put32(uint8_t* p,uint32_t v){for(int i=3;i>=0;--i){p[i]=static_cast<uint8_t>(v);v>>=8;}}
void append64(std::vector<uint8_t>& b,uint64_t v){for(int i=7;i>=0;--i)b.push_back(static_cast<uint8_t>(v>>(i*8)));}
int32_t negotiate(const uint8_t* bytes,uint32_t size,const uint32_t* local,uint32_t count,uint32_t* selected,uint32_t* side){
 if(selected)*selected=0;if(side)*side=0;
 if(!bytes||!local||!selected||!side||!count||count>8)return AP_INVALID_ARGUMENT;
 if(size<8||size>512)return AP_LENGTH;
 if(std::memcmp(bytes,"AETH",4)||bytes[6]!=1)return AP_FIELD;
 if(u16(bytes+4)!=size||!bytes[7]||bytes[7]>8||size!=8u+2u*bytes[7])return AP_LENGTH;
 uint32_t remote_max=0,local_max=0;
 std::array<bool,65536> seen{};
 for(uint32_t i=0;i<count;++i){if(!local[i]||local[i]>65535)return AP_FIELD;local_max=std::max(local_max,local[i]);}
 for(uint32_t i=0;i<bytes[7];++i){uint32_t v=u16(bytes+8+2*i);if(!v||seen[v])return AP_FIELD;seen[v]=true;remote_max=std::max(remote_max,v);for(uint32_t j=0;j<count;++j)if(local[j]==v)*selected=std::max(*selected,v);}
 if(!*selected){*side=remote_max<local_max?1:local_max<remote_max?2:3;return AP_VERSION;}
 return AP_OK;
}
struct Context {
 AetherProtocolConfig config{};
 std::string cert,key,trust,peer;
 AetherProtocolEvent callback=nullptr;
 uint64_t token=0,published=0,acked=0;
 uint32_t tcp_port=0,udp_port=0,selected=0,upgrade=0,grants=0,sink_packets=0;
 std::string sink_digest;
 int32_t result=AP_OK;
 bool submitted=false,stopped=false,authenticated=false,rejection_sent=false;
 std::timed_mutex mutex;
 OwnedSocket listener,tcp,udp;
 std::unique_ptr<SSL_CTX,decltype(&SSL_CTX_free)> tls_context{nullptr,SSL_CTX_free};
 std::unique_ptr<SSL,decltype(&SSL_free)> tls{nullptr,SSL_free};
 srtp_t srtp=nullptr;
 ~Context(){if(srtp)srtp_dealloc(srtp);}
 void cleanup(){if(srtp){srtp_dealloc(srtp);srtp=nullptr;}tls.reset();tls_context.reset();listener.reset();tcp.reset();udp.reset();}
};
std::mutex registry_mutex;
std::map<uint64_t,std::shared_ptr<Context>> registry;
uint64_t next_token=1;
std::shared_ptr<Context> find(uint64_t token){std::lock_guard lock(registry_mutex);auto i=registry.find(token);return i==registry.end()?nullptr:i->second;}
sockaddr_in endpoint(uint32_t port){sockaddr_in a{};a.sin_family=AF_INET;a.sin_addr.s_addr=htonl(INADDR_LOOPBACK);a.sin_port=htons(static_cast<uint16_t>(port));return a;}
void make_socket(OwnedSocket& s,int kind,uint32_t ms){
 s.value=socket(AF_INET,kind,0);require(s.value!=invalid,AP_INTERNAL_ERROR);
#ifdef _WIN32
 DWORD timeout=ms;
 require(setsockopt(s.value,SOL_SOCKET,SO_RCVTIMEO,reinterpret_cast<char*>(&timeout),sizeof(timeout))==0,AP_INTERNAL_ERROR);
 require(setsockopt(s.value,SOL_SOCKET,SO_SNDTIMEO,reinterpret_cast<char*>(&timeout),sizeof(timeout))==0,AP_INTERNAL_ERROR);
#else
 timeval timeout{static_cast<long>(ms/1000),static_cast<long>((ms%1000)*1000)};
 require(setsockopt(s.value,SOL_SOCKET,SO_RCVTIMEO,&timeout,sizeof(timeout))==0,AP_INTERNAL_ERROR);
 require(setsockopt(s.value,SOL_SOCKET,SO_SNDTIMEO,&timeout,sizeof(timeout))==0,AP_INTERNAL_ERROR);
#endif
}
uint32_t bind_socket(OwnedSocket& s){auto a=endpoint(0);require(bind(s.value,reinterpret_cast<sockaddr*>(&a),sizeof(a))==0,AP_INTERNAL_ERROR);
#ifdef _WIN32
 int n=sizeof(a);
#else
 socklen_t n=sizeof(a);
#endif
 require(getsockname(s.value,reinterpret_cast<sockaddr*>(&a),&n)==0,AP_INTERNAL_ERROR);return ntohs(a.sin_port);
}
void handshake(Context& c){
 if(c.config.role==1){
  fd_set reads;FD_ZERO(&reads);FD_SET(c.listener.value,&reads);timeval timeout{static_cast<long>(c.config.deadline_ms/1000),0};
  require(select(static_cast<int>(c.listener.value)+1,&reads,nullptr,nullptr,&timeout)>0,AP_TIMEOUT);
  c.tcp.value=accept(c.listener.value,nullptr,nullptr);require(c.tcp.value!=invalid,AP_INTERNAL_ERROR);
#ifdef _WIN32
  DWORD ms=c.config.deadline_ms;
  setsockopt(c.tcp.value,SOL_SOCKET,SO_RCVTIMEO,reinterpret_cast<char*>(&ms),sizeof(ms));
  setsockopt(c.tcp.value,SOL_SOCKET,SO_SNDTIMEO,reinterpret_cast<char*>(&ms),sizeof(ms));
#else
  timeval ms{static_cast<long>(c.config.deadline_ms/1000),0};
  setsockopt(c.tcp.value,SOL_SOCKET,SO_RCVTIMEO,&ms,sizeof(ms));setsockopt(c.tcp.value,SOL_SOCKET,SO_SNDTIMEO,&ms,sizeof(ms));
#endif
 }else{make_socket(c.tcp,SOCK_STREAM,c.config.deadline_ms);auto a=endpoint(c.config.peer_control_port);require(connect(c.tcp.value,reinterpret_cast<sockaddr*>(&a),sizeof(a))==0,AP_TIMEOUT);}
 c.tls.reset(SSL_new(c.tls_context.get()));require(c.tls!=nullptr,AP_INTERNAL_ERROR);
 require(SSL_set_fd(c.tls.get(),static_cast<int>(c.tcp.value))==1,AP_INTERNAL_ERROR);
 if(c.config.role==2){require(SSL_set1_host(c.tls.get(),c.peer.c_str())==1,AP_INTERNAL_ERROR);SSL_set_tlsext_host_name(c.tls.get(),c.peer.c_str());}
 int ok=c.config.role==1?SSL_accept(c.tls.get()):SSL_connect(c.tls.get());
 if(ok!=1){long e=SSL_get_verify_result(c.tls.get());throw Failure{e==X509_V_ERR_HOSTNAME_MISMATCH?AP_IDENTITY:AP_TRUST};}
 require(SSL_version(c.tls.get())==TLS1_3_VERSION,AP_PROTECTION);
 require(SSL_get_verify_result(c.tls.get())==X509_V_OK,AP_TRUST);
 std::unique_ptr<X509,decltype(&X509_free)> peer{SSL_get1_peer_certificate(c.tls.get()),X509_free};
 require(peer&&X509_check_host(peer.get(),c.peer.c_str(),c.peer.size(),X509_CHECK_FLAG_NO_PARTIAL_WILDCARDS,nullptr)==1,AP_IDENTITY);
 c.authenticated=true;
}
void write_tls(Context& c,const uint8_t* b,size_t n){while(n){size_t written=0;require(SSL_write_ex(c.tls.get(),b,n,&written)==1&&written,AP_PROTECTION);b+=written;n-=written;}}
void read_tls(Context& c,uint8_t* b,size_t n){while(n){size_t got=0;if(SSL_read_ex(c.tls.get(),b,n,&got)!=1||!got){auto reason=ERR_GET_REASON(ERR_peek_last_error());throw Failure{reason==SSL_R_TLSV1_ALERT_UNKNOWN_CA||reason==SSL_R_SSLV3_ALERT_BAD_CERTIFICATE||reason==SSL_R_TLSV13_ALERT_CERTIFICATE_REQUIRED?AP_TRUST:AP_LENGTH};}b+=got;n-=got;}}
void make_srtp(Context& c){
 std::vector<uint8_t> domain{'A','E','T','H',0,1};
 for(uint64_t id:{c.config.host_id,c.config.instance_id,c.config.display_id,c.config.stream_id,c.config.connection_id,c.config.client_id,c.config.lease_epoch,c.config.config_generation,c.config.key_generation})append64(domain,id);
 // Version, direction and media type are canonical, network-order domain fields.
 append64(domain,c.selected);domain.push_back(1);domain.push_back(1);
 std::array<unsigned char,44> material{};
 constexpr char label[]="EXPORTER-Aether-SRTP-v1";
 require(SSL_export_keying_material(c.tls.get(),material.data(),material.size(),label,sizeof(label)-1,domain.data(),domain.size(),1)==1,AP_PROTECTION);
 srtp_policy_t policy{};srtp_crypto_policy_set_aes_gcm_256_16_auth(&policy.rtp);srtp_crypto_policy_set_aes_gcm_256_16_auth(&policy.rtcp);
 policy.ssrc.type=ssrc_specific;policy.ssrc.value=static_cast<uint32_t>(c.config.stream_id);policy.key=material.data();policy.window_size=128;policy.allow_repeat_tx=0;
 auto result=srtp_create(&c.srtp,&policy);OPENSSL_cleanse(material.data(),material.size());require(result==srtp_err_status_ok,AP_PROTECTION);
}
std::string hash(const uint8_t* bytes,size_t size){std::array<unsigned char,32> out{};unsigned int n=0;require(EVP_Digest(bytes,size,out.data(),&n,EVP_sha256(),nullptr)==1&&n==32,AP_INTERNAL_ERROR);constexpr char hex[]="0123456789abcdef";std::string s;for(auto b:out){s.push_back(hex[b>>4]);s.push_back(hex[b&15]);}return s;}
int32_t exchange(Context& c,const uint8_t* data,uint32_t size){
 handshake(c);
 if(c.config.role==1){
  std::array<uint8_t,4> frame{};read_tls(c,frame.data(),frame.size());uint32_t length=(uint32_t(frame[0])<<24)|(uint32_t(frame[1])<<16)|(uint32_t(frame[2])<<8)|frame[3];
  require(length>=10&&length<=512,AP_LENGTH);
  std::vector<uint8_t> request(length);read_tls(c,request.data(),length);
  require(c.config.permission_read==1,AP_PERMISSION);
  int32_t status=negotiate(request.data(),length,c.config.versions,c.config.version_count,&c.selected,&c.upgrade);
  if(status!=AP_OK){std::array<uint8_t,8> rejection{};put32(rejection.data(),static_cast<uint32_t>(status));put32(rejection.data()+4,c.upgrade);write_tls(c,rejection.data(),rejection.size());c.rejection_sent=true;return status;}
  std::array<uint8_t,2> port{};read_tls(c,port.data(),2);require(u16(port.data())!=0,AP_FIELD);
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
 std::array<uint8_t,2> port{};put16(port.data(),static_cast<uint16_t>(c.udp_port));write_tls(c,port.data(),port.size());
 std::array<uint8_t,8> ack{};read_tls(c,ack.data(),ack.size());uint32_t status=(uint32_t(ack[0])<<24)|(uint32_t(ack[1])<<16)|(uint32_t(ack[2])<<8)|ack[3];
 if(status){c.upgrade=(uint32_t(ack[4])<<24)|(uint32_t(ack[5])<<16)|(uint32_t(ack[6])<<8)|ack[7];return static_cast<int32_t>(status);}
 c.selected=(uint32_t(ack[4])<<24)|(uint32_t(ack[5])<<16)|(uint32_t(ack[6])<<8)|ack[7];
 uint32_t selected=0,side=0;require(negotiate(data,size,c.config.versions,c.config.version_count,&selected,&side)==AP_OK&&selected==c.selected,AP_VERSION);
 make_srtp(c);++c.grants;
 std::array<uint8_t,1500> packet{};int n=recv(c.udp.value,reinterpret_cast<char*>(packet.data()),static_cast<int>(packet.size()),0);require(n>0,AP_TIMEOUT);
 require(srtp_unprotect(c.srtp,packet.data(),&n)==srtp_err_status_ok&&n>=12,AP_PROTECTION);
 require(packet[0]==0x80&&packet[1]==96,AP_FIELD);
 c.sink_digest=hash(packet.data()+12,static_cast<size_t>(n-12));++c.sink_packets;
 const uint8_t done=1;write_tls(c,&done,1);return AP_OK;
}
std::string summary(const Context& c){std::ostringstream s;s<<"{\"controlPort\":"<<c.tcp_port<<",\"udpPort\":"<<c.udp_port<<",\"status\":"<<c.result<<",\"selectedVersion\":"<<c.selected<<",\"upgradeSide\":"<<c.upgrade<<",\"grants\":"<<c.grants<<",\"sinkPackets\":"<<c.sink_packets<<",\"sinkDigest\":\""<<c.sink_digest<<"\",\"sequence\":"<<c.published<<",\"sockets\":"<<((c.listener.value!=invalid)+(c.tcp.value!=invalid)+(c.udp.value!=invalid))<<",\"threads\":0,\"stopped\":"<<(c.stopped?"true":"false")<<"}";return s.str();}
}
extern "C" {
int32_t aether_protocol_negotiate(const uint8_t* b,uint32_t n,const uint32_t* local,uint32_t count,uint32_t* v,uint32_t* side){return boundary([&]{return negotiate(b,n,local,count,v,side);});}
int32_t aether_protocol_create(const AetherProtocolConfig* in,AetherProtocolEvent cb,uint64_t* token){return boundary([&]() -> int32_t {
 if(token)*token=0;
 require(in&&token&&cb&&in->struct_size>=sizeof(*in),AP_INVALID_ARGUMENT);require(in->abi_version==1,AP_ABI_MISMATCH);
 require((in->role==1||in->role==2)&&in->deadline_ms>=1000&&in->deadline_ms<=3000&&in->peer_control_port<=65535&&!in->reserved&&!in->reserved2&&in->permission_read<=1,AP_INVALID_ARGUMENT);
 require(in->host_id&&in->instance_id&&in->display_id&&in->stream_id&&in->stream_id<=UINT32_MAX&&in->connection_id&&in->client_id&&in->lease_epoch&&in->config_generation&&in->key_generation,AP_INVALID_ARGUMENT);
 require(in->certificate_file&&in->private_key_file&&in->trust_file&&in->peer_name&&in->version_count&&in->version_count<=8,AP_INVALID_ARGUMENT);
 auto c=std::make_shared<Context>();c->config=*in;c->cert=in->certificate_file;c->key=in->private_key_file;c->trust=in->trust_file;c->peer=in->peer_name;c->callback=cb;
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
 std::unique_lock lock(c->mutex,std::try_to_lock);require(lock.owns_lock(),AP_BUSY);require(!c->stopped,AP_STOPPED);require(!c->submitted,AP_BUSY);c->submitted=true;
 c->result=boundary([&]{return exchange(*c,bytes,n);});
 if(c->result!=AP_OK&&c->config.role==1&&c->authenticated&&!c->grants&&!c->rejection_sent){std::array<uint8_t,8> reject{};put32(reject.data(),static_cast<uint32_t>(c->result));boundary([&]{write_tls(*c,reject.data(),reject.size());return AP_OK;});}
 ++c->published;auto status=c->result;auto sequence=c->published;auto cb=c->callback;lock.unlock();cb(token,sequence,2,status,1);return status;
});}
int32_t aether_protocol_query(uint64_t token,char* out,uint32_t capacity,uint32_t* required){return boundary([&]() -> int32_t {
 require(required&&(!capacity||out),AP_INVALID_ARGUMENT);auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);auto s=summary(*c);*required=static_cast<uint32_t>(s.size()+1);
 if(capacity<*required){if(capacity){std::memcpy(out,s.data(),capacity-1);out[capacity-1]=0;}return AP_BUFFER_TOO_SMALL;}std::memcpy(out,s.c_str(),s.size()+1);return AP_OK;
});}
int32_t aether_protocol_ack(uint64_t token,uint64_t sequence){return boundary([&]() -> int32_t {auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::lock_guard lock(c->mutex);require(sequence>=c->acked&&sequence<=c->published,AP_INVALID_ARGUMENT);c->acked=sequence;return AP_OK;});}
int32_t aether_protocol_stop(uint64_t token,uint64_t* sequence){return boundary([&]() -> int32_t {require(sequence!=nullptr,AP_INVALID_ARGUMENT);*sequence=0;auto c=find(token);require(c!=nullptr,AP_INVALID_HANDLE);std::unique_lock lock(c->mutex,std::defer_lock);require(lock.try_lock_for(std::chrono::seconds(2)),AP_TIMEOUT);c->cleanup();c->stopped=true;*sequence=c->published;return AP_OK;});}
int32_t aether_protocol_destroy(uint64_t token){return boundary([&]() -> int32_t {std::lock_guard lock(registry_mutex);auto i=registry.find(token);require(i!=registry.end(),AP_INVALID_HANDLE);auto c=i->second;std::lock_guard context_lock(c->mutex);require(c->stopped&&c->acked==c->published,AP_BUSY);registry.erase(i);return AP_OK;});}
}
