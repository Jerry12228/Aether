#include "internal.h"
#include <botan/zfec.h>
#include <openssl/crypto.h>
#include <algorithm>
#include <cstring>
#include <map>

namespace aether::protocol {
namespace {
constexpr uint32_t header_bytes=160;
using Bytes=std::vector<uint8_t>;
using Shares=std::vector<Bytes>;
}
Shares fec_encode(const Bytes& bytes,const MediaLimits& limits){
 const auto sources=limits.k,total=limits.n,shard_bytes=limits.shard;const auto frame_bytes=limits.frame;
 require(sources>=1&&sources<=total&&total<=255&&shard_bytes>=1&&shard_bytes<=1024&&frame_bytes==uint32_t(sources)*shard_bytes&&frame_bytes<=8192,AP_LENGTH);
 require(bytes.size()==frame_bytes,AP_LENGTH);
 const Botan::ZFEC codec(sources,total);require(codec.provider()=="base",AP_PROTECTION);
 Shares staged(total);
 codec.encode(bytes.data(),bytes.size(),[&](size_t id,const uint8_t* data,size_t n){require(id<total&&n==shard_bytes&&staged[id].empty(),AP_LENGTH);staged[id].assign(data,data+n);});
 require(std::all_of(staged.begin(),staged.end(),[shard_bytes](const auto& s){return s.size()==shard_bytes;}),AP_INTERNAL_ERROR);return staged;
}
Bytes fec_recover(const std::map<size_t,Bytes>& owned,const MediaLimits& limits){
 const auto sources=limits.k,total=limits.n,shard_bytes=limits.shard;const auto frame_bytes=limits.frame;
 require(sources>=1&&sources<=total&&total<=255&&shard_bytes>=1&&shard_bytes<=1024&&frame_bytes==uint32_t(sources)*shard_bytes&&frame_bytes<=8192,AP_LENGTH);
 require(owned.size()>=sources&&owned.size()<=total,AP_LENGTH);
 std::map<size_t,const uint8_t*> inputs;
 for(const auto& [id,bytes]:owned){require(id<total&&bytes.size()==shard_bytes,AP_LENGTH);inputs.emplace(id,bytes.data());}
 const Botan::ZFEC codec(sources,total);Shares staged(sources);
 codec.decode_shares(inputs,shard_bytes,[&](size_t id,const uint8_t* bytes,size_t n){require(id<sources&&n==shard_bytes&&staged[id].empty(),AP_LENGTH);staged[id].assign(bytes,bytes+n);});
 Bytes result;result.reserve(frame_bytes);for(const auto& s:staged){require(s.size()==shard_bytes,AP_LENGTH);result.insert(result.end(),s.begin(),s.end());}return result;
}
namespace {
uint32_t clock_step(uint8_t media){return media==2||media==3?960:3000;}
const char* media_name(uint8_t media){return media==1?"video":media==2?"audio":media==3?"mic":"camera";}
bool sending(const ConnectionContext& c,const StreamContext& s){return s.domain.direction==c.config.role;}
void create_streams(ConnectionContext& c){
 require(c.config.stream_id<=UINT32_MAX-4&&c.selected==2&&c.streams.empty(),AP_FIELD);
 for(uint32_t offset=0;offset<5;++offset){
  auto s=std::make_unique<StreamContext>();
  s->domain.identity={c.config.host_id,c.config.instance_id,c.config.display_id,c.config.stream_id+offset,c.config.connection_id,c.config.client_id,c.config.lease_epoch,c.config.config_generation,c.config.key_generation};
  s->domain.direction=offset<3?1:2;s->domain.media=offset<2?1:static_cast<uint8_t>(offset);
  create_crypto(c.tls.get(),s->domain,c.selected,&s->crypto);
  auto repair=s->domain;repair.role=1;create_crypto(c.tls.get(),repair,c.selected,&s->repair_crypto);
  c.streams.push_back(std::move(s));
 }
 c.full_media=true;
}
Bytes header(const StreamContext& s,uint32_t round,uint16_t share,const std::string& digest,const MediaLimits& limits){
 const auto sources=limits.k,total=limits.n,shard_bytes=limits.shard;const auto frame_bytes=limits.frame;
 const auto& id=s.domain.identity;Bytes bytes(header_bytes);
 bytes[0]=0x90;bytes[1]=96;put32(bytes.data()+4,UINT32_MAX-3000+clock_step(s.domain.media)*(round-1));put32(bytes.data()+8,static_cast<uint32_t>(id.stream));
 put16(bytes.data()+12,0xa37e);put16(bytes.data()+14,36);
 bytes[16]=s.domain.direction;bytes[17]=s.domain.media;bytes[18]=share<sources?0:1;bytes[19]=1;put32(bytes.data()+20,round);
 for(const auto& [position,value]:std::array<std::pair<size_t,uint64_t>,9>{{{24,id.connection},{32,id.lease},{40,id.config},{48,id.key},{56,id.stream},{64,id.host},{72,id.instance},{80,id.display},{88,id.client}}})put64(bytes.data()+position,value);
 put16(bytes.data()+96,share);put16(bytes.data()+98,sources);put16(bytes.data()+100,total);put16(bytes.data()+102,shard_bytes);put32(bytes.data()+104,frame_bytes);put64(bytes.data()+108,round);
 // SHA256 is carried inside the authenticated extension, not an unauthenticated checksum.
 for(size_t i=0;i<32;++i){const auto digit=[](char c){return c<='9'?c-'0':c-'a'+10;};bytes[120+i]=static_cast<uint8_t>((digit(digest[2*i])<<4)|digit(digest[2*i+1]));}
 put32(bytes.data()+152,limits.ttl_ms);return bytes;
}
void transmit(ConnectionContext& c,uint16_t port,const uint8_t* payload,uint32_t size,uint32_t round){
 const auto sources=c.media_limits.k,total=c.media_limits.n;const auto frame_bytes=c.media_limits.frame;
 const auto destination=endpoint(port);
 for(auto& stream:c.streams){auto& s=*stream;if(!sending(c,s))continue;
  std::string data(reinterpret_cast<const char*>(payload),size);data+=':';data+=media_name(s.domain.media);data+=':';data+=std::to_string(s.domain.identity.stream);data+=':';data+=std::to_string(round);
  require(data.size()<=frame_bytes-4,AP_LENGTH);Bytes frame(frame_bytes);put32(frame.data(),static_cast<uint32_t>(data.size()));std::memcpy(frame.data()+4,data.data(),data.size());
  const auto digest=hash(frame.data(),frame.size());const auto shares=fec_encode(frame,c.media_limits);
  for(uint16_t share=0;share<total;++share){auto packet=header(s,round,share,digest,c.media_limits);packet.insert(packet.end(),shares[share].begin(),shares[share].end());packet=protect_packet(s,share<sources?0:1,std::move(packet));
   require(sendto(c.udp.value,reinterpret_cast<const char*>(packet.data()),static_cast<int>(packet.size()),0,reinterpret_cast<const sockaddr*>(&destination),sizeof(destination))==static_cast<int>(packet.size()),AP_INTERNAL_ERROR);++s.sent;
  }s.timestamp=UINT32_MAX-3000+clock_step(s.domain.media)*(round-1);
 }
}
}
MediaLimits media_limits(const uint8_t* request,uint32_t size){
 require(request&&size>=8,AP_LENGTH);MediaLimits limits;
 bool full=false;
 for(uint32_t offset=8u+2u*request[7];offset<size;){require(size-offset>=4,AP_LENGTH);const auto type=u16(request+offset),length=u16(request+offset+2);offset+=4;require(length<=size-offset,AP_LENGTH);if(type==1&&length==1&&request[offset]==5)full=true;offset+=length;}
 if(!full)return limits;
 for(uint32_t offset=8u+2u*request[7];offset<size;){require(size-offset>=4,AP_LENGTH);const auto type=u16(request+offset),length=u16(request+offset+2);offset+=4;require(length<=size-offset,AP_LENGTH);
  if(type==7){require(length==20,AP_LENGTH);limits.packet_size=u16(request+offset);limits.mtu=u16(request+offset+2);limits.fec_percent=u16(request+offset+4);limits.min_repair=u16(request+offset+6);limits.shard=u16(request+offset+8);limits.k=u16(request+offset+10);limits.per_stream_queue=u32(request+offset+12);limits.ttl_ms=u16(request+offset+16);require(u16(request+offset+18)==0,AP_FIELD);}
  offset+=length;
 }
 require(limits.k>=1&&limits.k<=16&&limits.shard>=1&&limits.shard<=1024,AP_LENGTH);
 require(limits.fec_percent>=1&&limits.fec_percent<=255&&limits.min_repair<=254,AP_LENGTH);
 const auto repair=std::max<uint32_t>(limits.min_repair,(uint32_t(limits.k)*limits.fec_percent+99)/100);
 require(uint32_t(limits.k)+repair<=255,AP_LENGTH);limits.n=static_cast<uint16_t>(limits.k+repair);limits.frame=uint32_t(limits.k)*limits.shard;
 require(uint32_t(limits.n)*3<=64,AP_BUSY);
 require(limits.frame>=65&&limits.frame<=8192&&limits.per_stream_queue>=limits.frame&&limits.per_stream_queue<=13107,AP_LENGTH);
 require(limits.ttl_ms>=1&&limits.ttl_ms<=100&&limits.mtu>=177&&limits.mtu<=1500,AP_LENGTH);
 const auto packet_limit=limits.packet_size?limits.packet_size:limits.mtu;
 require(packet_limit<=limits.mtu&&packet_limit>=header_bytes+16+limits.shard,AP_LENGTH);return limits;
}
struct FecBlock {
 std::map<size_t,Bytes> owned;
 Bytes canonical_header;
 uint16_t last_sequence=0;
 bool delivered=false;
};
class MediaScheduler {
 ConnectionContext& context;
 uint32_t round;
 std::chrono::steady_clock::time_point deadline;
 std::array<FecBlock,5> blocks;
public:
 MediaScheduler(ConnectionContext& c,uint32_t r):context(c),round(r),deadline(std::min(c.exchange_deadline,std::chrono::steady_clock::now()+std::chrono::milliseconds(c.media_limits.ttl_ms))){}
 ~MediaScheduler(){context.queue_bytes=0;}
 WindowRecord receive(){
  const auto sources=context.media_limits.k,total=context.media_limits.n,shard_bytes=context.media_limits.shard;const auto frame_bytes=context.media_limits.frame;
  WindowRecord window{round,0,0,1};uint32_t inspected=0;
  while(inspected<64&&datagram_ready(context.udp.value,deadline)){
   ++inspected;std::array<uint8_t,1500> buffer{};int n=recv(context.udp.value,reinterpret_cast<char*>(buffer.data()),static_cast<int>(buffer.size()),0);
#ifdef _WIN32
   if(n<0&&WSAGetLastError()==WSAEMSGSIZE)continue;
#endif
   require(n>=0,AP_INTERNAL_ERROR);if(n<28)continue;
   const auto id=u32(buffer.data()+8);auto found=std::find_if(context.streams.begin(),context.streams.end(),[&](const auto& stream){return stream->domain.identity.stream==id;});if(found==context.streams.end())continue;
   auto& s=**found;const auto role=buffer[18];Bytes packet(buffer.begin(),buffer.begin()+n);
   if(!unprotect_packet(s,role,packet))continue;
   if(sending(context,s)){++s.rejected;continue;}
   if(packet.size()!=header_bytes+shard_bytes){++s.rejected;continue;}
   if(u32(packet.data()+20)!=round){++s.expired;continue;}
   const auto share=u16(packet.data()+96);if(share>=total||(share<sources?0:1)!=role){++s.rejected;continue;}
   // Every field, including reserved bytes, is validated against the local domain after AEAD.
   auto expected=header(s,round,share,std::string(64,'0'),context.media_limits);std::copy(packet.begin()+120,packet.begin()+152,expected.begin()+120);put16(expected.data()+2,u16(packet.data()+2));
   if(std::memcmp(expected.data(),packet.data(),header_bytes)!=0){++s.rejected;continue;}
   auto& block=blocks[static_cast<size_t>(found-context.streams.begin())];
   Bytes canonical(packet.begin(),packet.begin()+header_bytes);put16(canonical.data()+2,0);canonical[18]=0;put16(canonical.data()+96,0);
   if(!block.canonical_header.empty()&&block.canonical_header!=canonical){++s.rejected;continue;}
   if(block.delivered||block.owned.contains(share)){++s.rejected;continue;}
   if(std::chrono::steady_clock::now()>=deadline){++s.expired;continue;}
   if(block.owned.size()*shard_bytes>context.media_limits.per_stream_queue-shard_bytes){++s.rejected;continue;}
   block.last_sequence=u16(packet.data()+2);block.canonical_header=std::move(canonical);block.owned.emplace(share,Bytes(packet.begin()+header_bytes,packet.end()));context.queue_bytes+=shard_bytes;context.peak_queue_bytes=std::max(context.peak_queue_bytes,context.queue_bytes);
  }
  for(size_t i=0;i<blocks.size();++i){
   auto& s=*context.streams[i];auto& block=blocks[i];if(sending(context,s))continue;
   if(block.owned.size()<sources){++s.dropped;continue;}
   const auto& packet=block.canonical_header;const auto id=s.domain.identity.stream;
   const auto frame=fec_recover(block.owned,context.media_limits);const auto frame_digest=hash(frame.data(),frame.size());bool digest_ok=true;
   constexpr char hex[]="0123456789abcdef";std::string expected_digest;for(size_t byte=120;byte<152;++byte){expected_digest+=hex[packet[byte]>>4];expected_digest+=hex[packet[byte]&15];}
   digest_ok=frame_digest==expected_digest;const auto length=u32(frame.data());
   if(!digest_ok||length==0||length>frame_bytes-4||!std::all_of(frame.begin()+4+std::min<uint32_t>(length,frame_bytes-4),frame.end(),[](auto byte){return byte==0;})){++s.rejected;++s.dropped;continue;}
   require(s.authenticated_bytes.size()+length<=dual_video_rounds*maximum_stream_payload,AP_LENGTH);
   s.authenticated_bytes.append(reinterpret_cast<const char*>(frame.data()+4),length);s.digest=hash(reinterpret_cast<const uint8_t*>(s.authenticated_bytes.data()),s.authenticated_bytes.size());++s.received;
   for(size_t source=0;source<sources;++source)if(!block.owned.contains(source)){++s.recovered;break;}
   s.timestamp=u32(packet.data()+4);s.sequence=block.last_sequence;block.delivered=true;
   context.queue_bytes-=static_cast<uint32_t>(block.owned.size())*shard_bytes;block.owned.clear();
   auto& progress=s.domain.media==1?(id==context.config.stream_id?window.video1:window.video2):s.domain.media==2?window.audio:s.domain.media==3?window.mic:window.camera;++progress;
  }
  context.queue_bytes=0;return window;
 }
};
void run_media(ConnectionContext& c,uint16_t port,const uint8_t* payload,uint32_t size){
 require(payload&&size>0&&size<=64,AP_LENGTH);create_streams(c);
 std::array<uint8_t,2> local{};put16(local.data(),static_cast<uint16_t>(c.udp_port));
 if(c.config.role==1){write_tls(c,local.data(),local.size());read_tls(c,local.data(),local.size());port=u16(local.data());require(port!=0,AP_FIELD);}
 else{read_tls(c,local.data(),local.size());const auto host_port=u16(local.data());require(host_port!=0,AP_FIELD);put16(local.data(),port?port:static_cast<uint16_t>(c.udp_port));write_tls(c,local.data(),local.size());port=port?port:host_port;}
 for(uint32_t round=1;round<=dual_video_rounds;++round){
  std::array<uint8_t,4> control{};put32(control.data(),round);
  if(c.config.role==1){transmit(c,port,payload,size,round);write_tls(c,control.data(),control.size());read_tls(c,control.data(),control.size());require(u32(control.data())==round,AP_FIELD);c.windows.push_back(MediaScheduler(c,round).receive());write_tls(c,control.data(),control.size());}
  else{read_tls(c,control.data(),control.size());require(u32(control.data())==round,AP_FIELD);transmit(c,port,payload,size,round);c.windows.push_back(MediaScheduler(c,round).receive());write_tls(c,control.data(),control.size());read_tls(c,control.data(),control.size());require(u32(control.data())==round,AP_FIELD);}
  ++c.control_progress;
 }
}
}
