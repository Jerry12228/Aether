#include "internal.h"
#include <openssl/crypto.h>
#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/sslerr.h>
#include <openssl/x509v3.h>
#include <algorithm>
#ifndef _WIN32
#include <fcntl.h>
#endif
namespace aether::protocol {
using Context=ConnectionContext;
void append64(std::vector<uint8_t>& b,uint64_t v){for(int i=7;i>=0;--i)b.push_back(static_cast<uint8_t>(v>>(i*8)));}
sockaddr_in endpoint(uint32_t port){sockaddr_in a{};a.sin_family=AF_INET;a.sin_addr.s_addr=htonl(INADDR_LOOPBACK);a.sin_port=htons(static_cast<uint16_t>(port));return a;}
void nonblocking(Socket s){
#ifdef _WIN32
 u_long enabled=1;require(ioctlsocket(s,FIONBIO,&enabled)==0,AP_INTERNAL_ERROR);
#else
 require(s<FD_SETSIZE,AP_BUSY);auto flags=fcntl(s,F_GETFL,0);require(flags>=0&&fcntl(s,F_SETFL,flags|O_NONBLOCK)==0,AP_INTERNAL_ERROR);
#endif
}
void wait_socket(Context& c,Socket s,bool write){
#ifndef _WIN32
 require(s>=0&&s<FD_SETSIZE,AP_BUSY);
#endif
 auto remaining=std::chrono::duration_cast<std::chrono::microseconds>(c.exchange_deadline-std::chrono::steady_clock::now()).count();require(remaining>0,AP_TIMEOUT);
 fd_set fds;FD_ZERO(&fds);FD_SET(s,&fds);timeval timeout{static_cast<long>(remaining/1000000),static_cast<long>(remaining%1000000)};
 require(select(static_cast<int>(s)+1,write?nullptr:&fds,write?&fds:nullptr,nullptr,&timeout)>0,AP_TIMEOUT);
}
bool retry_tls(Context& c,int result,int32_t otherwise){
 auto error=SSL_get_error(c.tls.get(),result);
 if(error==SSL_ERROR_WANT_READ||error==SSL_ERROR_WANT_WRITE){wait_socket(c,c.tcp.value,error==SSL_ERROR_WANT_WRITE);return true;}
 auto reason=ERR_GET_REASON(ERR_peek_last_error());throw Failure{reason==SSL_R_TLSV1_ALERT_UNKNOWN_CA||reason==SSL_R_SSLV3_ALERT_BAD_CERTIFICATE||reason==SSL_R_TLSV13_ALERT_CERTIFICATE_REQUIRED?AP_TRUST:otherwise};
}
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
  wait_socket(c,c.listener.value,false);
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
 nonblocking(c.tcp.value);
 c.tls.reset(SSL_new(c.tls_context.get()));require(c.tls!=nullptr,AP_INTERNAL_ERROR);
 require(SSL_set_fd(c.tls.get(),static_cast<int>(c.tcp.value))==1,AP_INTERNAL_ERROR);
 if(c.config.role==2){require(SSL_set1_host(c.tls.get(),c.peer.c_str())==1,AP_INTERNAL_ERROR);SSL_set_tlsext_host_name(c.tls.get(),c.peer.c_str());}
 for(;;){ERR_clear_error();int ok=c.config.role==1?SSL_accept(c.tls.get()):SSL_connect(c.tls.get());if(ok==1)break;auto e=SSL_get_verify_result(c.tls.get());retry_tls(c,ok,e==X509_V_ERR_HOSTNAME_MISMATCH?AP_IDENTITY:AP_TRUST);}
 require(SSL_version(c.tls.get())==TLS1_3_VERSION,AP_PROTECTION);
 require(SSL_get_verify_result(c.tls.get())==X509_V_OK,AP_TRUST);
 std::unique_ptr<X509,decltype(&X509_free)> peer{SSL_get1_peer_certificate(c.tls.get()),X509_free};
 require(peer&&X509_check_host(peer.get(),c.peer.c_str(),c.peer.size(),X509_CHECK_FLAG_NO_PARTIAL_WILDCARDS,nullptr)==1,AP_IDENTITY);
 c.authenticated=true;
}
void write_tls(Context& c,const uint8_t* b,size_t n){while(n){require(std::chrono::steady_clock::now()<c.exchange_deadline,AP_TIMEOUT);size_t written=0;ERR_clear_error();auto result=SSL_write_ex(c.tls.get(),b,n,&written);if(result!=1){retry_tls(c,result,AP_PROTECTION);continue;}require(written>0,AP_PROTECTION);b+=written;n-=written;}}
void read_tls(Context& c,uint8_t* b,size_t n){while(n){require(std::chrono::steady_clock::now()<c.exchange_deadline,AP_TIMEOUT);size_t got=0;ERR_clear_error();auto result=SSL_read_ex(c.tls.get(),b,n,&got);if(result!=1){retry_tls(c,result,AP_LENGTH);continue;}require(got>0,AP_LENGTH);b+=got;n-=got;}}
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
void create_crypto(SSL* tls,const KeyDomain& domain,uint32_t version,srtp_t* crypto){
 const auto& id=domain.identity;
 std::vector<uint8_t> context{'A','E','T','H',0,2};
 for(uint64_t v:{id.host,id.instance,id.display,id.stream,id.connection,id.client,id.lease,id.config,id.key})append64(context,v);
 append64(context,version);context.push_back(domain.direction);context.push_back(domain.media);context.push_back(domain.role);
 std::array<unsigned char,44> material{};
 constexpr char label[]="EXPORTER-Aether-SRTP-v1";
 require(SSL_export_keying_material(tls,material.data(),material.size(),label,sizeof(label)-1,context.data(),context.size(),1)==1,AP_PROTECTION);
 srtp_policy_t policy{};srtp_crypto_policy_set_aes_gcm_256_16_auth(&policy.rtp);srtp_crypto_policy_set_aes_gcm_256_16_auth(&policy.rtcp);
 policy.ssrc.type=ssrc_specific;policy.ssrc.value=static_cast<uint32_t>(id.stream);policy.key=material.data();policy.window_size=128;policy.allow_repeat_tx=0;
 const auto result=srtp_create(crypto,&policy);OPENSSL_cleanse(material.data(),material.size());require(result==srtp_err_status_ok,AP_PROTECTION);
}
std::vector<uint8_t> protect_packet(StreamContext& stream,uint8_t role,std::vector<uint8_t> packet){
 require(role<=1&&packet.size()>=12&&packet.size()<=1484,AP_LENGTH);
 auto& index=role?stream.next_repair:stream.next_source;
 require(index>0&&index<(uint64_t{1}<<48),AP_PROTECTION);
 put16(packet.data()+2,static_cast<uint16_t>(index));++index;
 int length=static_cast<int>(packet.size());packet.resize(packet.size()+SRTP_MAX_TRAILER_LEN);
 require(srtp_protect(role?stream.repair_crypto:stream.crypto,packet.data(),&length)==srtp_err_status_ok,AP_PROTECTION);
 packet.resize(static_cast<size_t>(length));stream.sequence=u16(packet.data()+2);return packet;
}
bool unprotect_packet(StreamContext& stream,uint8_t role,std::vector<uint8_t>& packet){
 if(role>1||packet.size()<28||packet.size()>1500){++stream.rejected;return false;}
 auto staged=packet;int length=static_cast<int>(staged.size());
 if(srtp_unprotect(role?stream.repair_crypto:stream.crypto,staged.data(),&length)!=srtp_err_status_ok){++stream.rejected;return false;}
 staged.resize(static_cast<size_t>(length));packet=std::move(staged);return true;
}
bool datagram_ready(Socket socket,std::chrono::steady_clock::time_point deadline){
#ifndef _WIN32
 require(socket>=0&&socket<FD_SETSIZE,AP_BUSY);
#endif
 auto remaining=std::chrono::duration_cast<std::chrono::microseconds>(deadline-std::chrono::steady_clock::now()).count();if(remaining<=0)return false;
 fd_set fds;FD_ZERO(&fds);FD_SET(socket,&fds);timeval timeout{static_cast<long>(remaining/1000000),static_cast<long>(remaining%1000000)};auto result=select(static_cast<int>(socket)+1,&fds,nullptr,nullptr,&timeout);require(result>=0,AP_INTERNAL_ERROR);return result>0;
}
}
