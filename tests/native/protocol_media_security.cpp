#include "internal.h"
#include <openssl/crypto.h>
#include <iostream>
#include <stdexcept>
#include <string>

using namespace aether::protocol;
using Bytes=std::vector<uint8_t>;
void check(bool result){if(!result)throw std::runtime_error("contract");}
void fixture_crypto(srtp_t* context,uint8_t key_byte){
 std::array<uint8_t,44> key{};key.fill(key_byte);
 srtp_policy_t policy{};srtp_crypto_policy_set_aes_gcm_256_16_auth(&policy.rtp);srtp_crypto_policy_set_aes_gcm_256_16_auth(&policy.rtcp);
 policy.ssrc.type=ssrc_specific;policy.ssrc.value=104;policy.key=key.data();policy.window_size=128;policy.allow_repeat_tx=0;
 check(srtp_create(context,&policy)==srtp_err_status_ok);OPENSSL_cleanse(key.data(),key.size());
}
void fixture(StreamContext& stream){fixture_crypto(&stream.crypto,3);fixture_crypto(&stream.repair_crypto,7);}
Bytes packet(){Bytes bytes(32);bytes[0]=0x80;bytes[1]=96;put32(bytes.data()+4,90000);put32(bytes.data()+8,104);for(size_t i=12;i<bytes.size();++i)bytes[i]=static_cast<uint8_t>(i);return bytes;}
void security(const std::string& mode){
 StreamContext sender,receiver;fixture(sender);fixture(receiver);
 if(mode=="rollover"){
  sender.next_source=65535;const auto first=protect_packet(sender,0,packet()),second=protect_packet(sender,0,packet());
  check(u16(first.data()+2)==65535&&u16(second.data()+2)==0);auto a=first,b=second;check(unprotect_packet(receiver,0,a)&&unprotect_packet(receiver,0,b));
  uint32_t roc=0;check(srtp_get_stream_roc(receiver.crypto,104,&roc)==srtp_err_status_ok&&roc==1);a=first;check(!unprotect_packet(receiver,0,a));
 }else if(mode=="nonce-exhaustion"){
  sender.next_source=(uint64_t{1}<<48);bool rejected=false;try{(void)protect_packet(sender,0,packet());}catch(Failure f){rejected=f.status==AP_PROTECTION;}check(rejected&&sender.next_source==(uint64_t{1}<<48));
 }else if(mode=="high-sequence"){
  const auto honest=protect_packet(sender,0,packet());auto bad=honest;put16(bad.data()+2,60000);const auto preserved=bad;check(!unprotect_packet(receiver,0,bad)&&bad==preserved);auto good=honest;check(unprotect_packet(receiver,0,good));
 }else if(mode=="role-key-epoch"){
  const auto honest=protect_packet(sender,0,packet());auto other=honest;check(!unprotect_packet(receiver,1,other)&&other==honest);
  StreamContext fresh;fixture_crypto(&fresh.crypto,13);fixture_crypto(&fresh.repair_crypto,17);other=honest;check(!unprotect_packet(fresh,0,other));auto good=honest;check(unprotect_packet(receiver,0,good));
 }else if(mode=="unchanged-retransmission"){
  const auto honest=protect_packet(sender,0,packet());auto one=honest;check(unprotect_packet(receiver,0,one));one=honest;check(!unprotect_packet(receiver,0,one));
  auto changed=packet();changed[20]^=1;const auto next=protect_packet(sender,0,changed);check(u16(next.data()+2)==2);one=next;check(unprotect_packet(receiver,0,one));
 }else throw std::runtime_error("mode");
}
void realtime_frames(){
#ifdef _WIN32
 WSADATA sockets{};check(WSAStartup(MAKEWORD(2,2),&sockets)==0);
 struct SocketRuntime {~SocketRuntime(){WSACleanup();}} runtime;
#endif
 ConnectionContext receiver;receiver.config.role=2;receiver.config.stream_id=104;receiver.selected=3;receiver.media_enabled_mask=0;
 make_socket(receiver.udp,SOCK_DGRAM,100);const auto port=bind_socket(receiver.udp);
 OwnedSocket outgoing;make_socket(outgoing,SOCK_DGRAM,100);const auto peer=bind_socket(outgoing);
 StreamContext sender;sender.domain.identity.stream=104;sender.domain.direction=1;sender.domain.media=1;fixture(sender);
 auto stream=std::make_unique<StreamContext>();stream->domain=sender.domain;fixture(*stream);receiver.streams.push_back(std::move(stream));
 for(uint64_t i=1;i<5;++i){auto other=std::make_unique<StreamContext>();other->domain.identity.stream=104+i;other->domain.direction=i<3?1:2;other->domain.media=i<2?1:static_cast<uint8_t>(i);receiver.streams.push_back(std::move(other));}
 const auto send_frame=[&](uint32_t round,uint16_t begin,uint16_t end){
  const auto& limits=receiver.media_limits;Bytes frame(limits.frame);put32(frame.data(),1);frame[4]=static_cast<uint8_t>(round);
  const auto digest=hash(frame.data(),frame.size());const auto shards=fec_encode(frame,limits);
  for(uint16_t share=begin;share<end;++share){
   // Independent wire layout, then real SRTP and UDP; no scheduler helper builds the expected frame.
   Bytes bytes(160);bytes[0]=0x90;bytes[1]=96;put32(bytes.data()+4,UINT32_MAX-3000+3000*(round-1));put32(bytes.data()+8,104);
   put16(bytes.data()+12,0xa37e);put16(bytes.data()+14,36);bytes[16]=1;bytes[17]=1;bytes[18]=share<limits.k?0:1;bytes[19]=1;
   put32(bytes.data()+20,round);put64(bytes.data()+56,104);put16(bytes.data()+96,share);put16(bytes.data()+98,limits.k);put16(bytes.data()+100,limits.n);put16(bytes.data()+102,limits.shard);put32(bytes.data()+104,limits.frame);put64(bytes.data()+108,round);put32(bytes.data()+152,limits.ttl_ms);
   const auto digit=[](char c){return c<='9'?c-'0':c-'a'+10;};for(size_t i=0;i<32;++i)bytes[120+i]=static_cast<uint8_t>((digit(digest[2*i])<<4)|digit(digest[2*i+1]));
   bytes.insert(bytes.end(),shards[share].begin(),shards[share].end());const auto role=bytes[18];bytes=protect_packet(sender,role,std::move(bytes));
   auto remote=endpoint(port);check(sendto(outgoing.value,reinterpret_cast<const char*>(bytes.data()),static_cast<int>(bytes.size()),0,reinterpret_cast<sockaddr*>(&remote),sizeof(remote))==static_cast<int>(bytes.size()));
  }
 };
 send_frame(1,0,3);send_frame(2,0,3);receiver.exchange_deadline=std::chrono::steady_clock::now()+std::chrono::milliseconds(100);
 const uint8_t payload=1;auto first=media_service_window(receiver,static_cast<uint16_t>(peer),&payload,1,1);
 if(receiver.streams[0]->received!=2||first.video1!=2)throw std::runtime_error("realtime queued frames must both reach healthy sink");
 send_frame(2,2,3);send_frame(3,0,3);receiver.exchange_deadline=std::chrono::steady_clock::now()+std::chrono::milliseconds(100);
 auto second=media_service_window(receiver,static_cast<uint16_t>(peer),&payload,1,2);
 check(receiver.streams[0]->received==3&&second.video1==1&&receiver.streams[0]->authenticated_bytes==std::string(1,'\3'));
}
void fec(){
 MediaLimits limits;limits.shard=4;limits.frame=8;const Bytes original{0,1,2,3,4,5,6,7};const auto encoded=fec_encode(original,limits);
 check(encoded[0]==Bytes({0,1,2,3})&&encoded[1]==Bytes({4,5,6,7})&&encoded[2]==Bytes({8,9,10,11}));
 check(fec_recover({{1,encoded[1]},{2,Bytes{8,9,10,11}}},limits)==original);
 bool rejected=false;try{(void)fec_recover({{2,encoded[2]}},limits);}catch(Failure f){rejected=f.status==AP_LENGTH;}check(rejected);
 limits.k=0;rejected=false;try{(void)fec_encode(original,limits);}catch(Failure f){rejected=f.status==AP_LENGTH;}check(rejected);
 realtime_frames();
}
int main(int argc,char** argv){try{
 check(argc==2&&srtp_init()==srtp_err_status_ok);const std::string mode(argv[1]);if(mode=="fec-golden")fec();else security(mode);
 std::cout<<"{\"ok\":true,\"case\":\""<<mode<<"\"}\n";return 0;
 }catch(const std::exception& e){std::cerr<<"native media contract failure: "<<e.what()<<"\n";return 2;}catch(...){std::cerr<<"native media contract failure\n";return 2;}}
