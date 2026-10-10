#ifndef AETHER_PROTOCOL_INTERNAL_H
#define AETHER_PROTOCOL_INTERNAL_H
#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#else
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#endif
#include "aether/protocol.h"
#include <srtp.h>
#include <openssl/ssl.h>
#include <array>
#include <chrono>
#include <cstdint>
#include <memory>
#include <map>
#include <mutex>
#include <string>
#include <vector>
namespace aether::protocol {
struct Failure {int32_t status;};
inline void require(bool ok,int32_t status){if(!ok)throw Failure{status};}
#ifdef _WIN32
using Socket=SOCKET;
constexpr Socket invalid=INVALID_SOCKET;
#else
using Socket=int;
constexpr Socket invalid=-1;
#endif
struct OwnedSocket {
 Socket value=invalid;
 ~OwnedSocket(){reset();}
 void reset(){if(value!=invalid){
#ifdef _WIN32
 closesocket(value);
#else
 close(value);
#endif
 value=invalid;}}
};
inline uint16_t u16(const uint8_t* p){return static_cast<uint16_t>((p[0]<<8)|p[1]);}
inline uint32_t u32(const uint8_t* p){return (uint32_t(p[0])<<24)|(uint32_t(p[1])<<16)|(uint32_t(p[2])<<8)|p[3];}
inline uint64_t u64(const uint8_t* p){return (uint64_t(u32(p))<<32)|u32(p+4);}
inline void put16(uint8_t* p,uint16_t v){p[0]=static_cast<uint8_t>(v>>8);p[1]=static_cast<uint8_t>(v);}
inline void put32(uint8_t* p,uint32_t v){for(int i=3;i>=0;--i){p[i]=static_cast<uint8_t>(v);v>>=8;}}
inline void put64(uint8_t* p,uint64_t v){for(int i=7;i>=0;--i){p[i]=static_cast<uint8_t>(v);v>>=8;}}
struct Identity {
 uint64_t host=0,instance=0,display=0,stream=0,connection=0,client=0;
 uint64_t lease=0,config=0,key=0;
};
struct KeyDomain {Identity identity;uint8_t direction=1,media=1,role=0;};
struct StreamContext {
 KeyDomain domain;
 srtp_t crypto=nullptr;
 srtp_t repair_crypto=nullptr;
 uint32_t sent=0,received=0,rejected=0;
 uint32_t recovered=0,dropped=0,expired=0;
 uint64_t next_source=1,next_repair=1;
 uint16_t sequence=0;
 uint32_t timestamp=0;
 std::string authenticated_bytes,digest;
 ~StreamContext(){if(crypto)srtp_dealloc(crypto);if(repair_crypto)srtp_dealloc(repair_crypto);}
 StreamContext()=default;
 StreamContext(const StreamContext&)=delete;
 StreamContext& operator=(const StreamContext&)=delete;
};
struct WindowRecord {uint32_t round=0,video1=0,video2=0,control=0,audio=0,mic=0,camera=0;};
// Reserved typed seams for the following sequential slices; no authority or
// resource reservation is inferred from these unimplemented service contracts.
struct ResourceVector {uint64_t encoders=0,decoders=0,vram=0,bandwidth=0;};
struct Proposal {uint64_t request=0,budget_revision=0,epoch=0;std::string digest;ResourceVector resources;};
struct Reservation {uint64_t revision=0;ResourceVector resources;bool committed=false;};
class AuthorityAdapter {public:virtual ~AuthorityAdapter()=default;virtual int32_t authorize(const Identity&,uint32_t operation)const=0;};
struct RecoveryController {uint64_t epoch=0;uint32_t attempts=0;bool cancelled=false;};
struct SummaryRecord {uint64_t connection=0,stream=0;int32_t status=AP_OK;uint32_t packets=0,rejected=0;};
struct TraceWindow {uint64_t expires=0,bytes=0;bool enabled=false;};
struct FecBlock;
class MediaScheduler;
struct Transport {
 OwnedSocket listener,tcp,udp;
 std::unique_ptr<SSL_CTX,decltype(&SSL_CTX_free)> tls_context{nullptr,SSL_CTX_free};
 std::unique_ptr<SSL,decltype(&SSL_free)> tls{nullptr,SSL_free};
};
struct MediaLimits {
 uint16_t k=2,n=3,shard=64,packet_size=0,mtu=1500,fec_percent=50,min_repair=1,ttl_ms=25;
 uint32_t frame=128,per_stream_queue=192;
};
struct ConnectionContext : Transport {
 AetherProtocolConfig config{};
 std::string cert,key,trust,peer;
 AetherProtocolEvent callback=nullptr;
 uint64_t token=0,published=0,acked=0;
 uint32_t tcp_port=0,udp_port=0,selected=0,upgrade=0,grants=0,sink_packets=0;
 std::string sink_digest;
 int32_t result=AP_OK;
 bool submitted=false,stopped=false,authenticated=false,rejection_sent=false,full_media=false;
 uint64_t request_id=0,budget_revision=0,confirmed_proposals=0;
 std::string proposal_digest,proposal_json;
 std::chrono::steady_clock::time_point proposal_expiry{},exchange_deadline{};
 bool proposal_cancelled=false,proposal_confirmed=false;
 std::timed_mutex mutex,operation_mutex;
 srtp_t srtp=nullptr;
 std::vector<std::unique_ptr<StreamContext>> streams;
 std::vector<WindowRecord> windows;
 uint32_t control_progress=0,queue_bytes=0,peak_queue_bytes=0;
 MediaLimits media_limits;
 ~ConnectionContext(){cleanup();}
 void cleanup(){for(auto& s:streams){if(s->crypto){srtp_dealloc(s->crypto);s->crypto=nullptr;}if(s->repair_crypto){srtp_dealloc(s->repair_crypto);s->repair_crypto=nullptr;}s->authenticated_bytes.clear();}queue_bytes=0;if(srtp){srtp_dealloc(srtp);srtp=nullptr;}tls.reset();tls_context.reset();listener.reset();tcp.reset();udp.reset();}
};
sockaddr_in endpoint(uint32_t port);
void make_socket(OwnedSocket& socket,int kind,uint32_t ms);
uint32_t bind_socket(OwnedSocket& socket);
void wait_socket(ConnectionContext& context,Socket socket,bool write);
bool datagram_ready(Socket socket,std::chrono::steady_clock::time_point deadline);
void handshake(ConnectionContext& context);
void write_tls(ConnectionContext& context,const uint8_t* bytes,size_t size);
void read_tls(ConnectionContext& context,uint8_t* bytes,size_t size);
void make_srtp(ConnectionContext& context);
void create_crypto(SSL* tls,const KeyDomain& domain,uint32_t version,srtp_t* crypto);
std::string hash(const uint8_t* bytes,size_t size);
std::vector<uint8_t> protect_packet(StreamContext& stream,uint8_t role,std::vector<uint8_t> packet);
bool unprotect_packet(StreamContext& stream,uint8_t role,std::vector<uint8_t>& packet);
void run_media(ConnectionContext& context,uint16_t port,const uint8_t* payload,uint32_t size);
MediaLimits media_limits(const uint8_t* request,uint32_t size);
std::vector<std::vector<uint8_t>> fec_encode(const std::vector<uint8_t>& frame,const MediaLimits& limits);
std::vector<uint8_t> fec_recover(const std::map<size_t,std::vector<uint8_t>>& shards,const MediaLimits& limits);
constexpr uint32_t media_header_bytes=64,dual_video_rounds=8,maximum_stream_payload=1024;
}
#endif
