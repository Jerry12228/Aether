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
void fec(){
 MediaLimits limits;limits.shard=4;limits.frame=8;const Bytes original{0,1,2,3,4,5,6,7};const auto encoded=fec_encode(original,limits);
 check(encoded[0]==Bytes({0,1,2,3})&&encoded[1]==Bytes({4,5,6,7})&&encoded[2]==Bytes({8,9,10,11}));
 check(fec_recover({{1,encoded[1]},{2,Bytes{8,9,10,11}}},limits)==original);
 bool rejected=false;try{(void)fec_recover({{2,encoded[2]}},limits);}catch(Failure f){rejected=f.status==AP_LENGTH;}check(rejected);
 limits.k=0;rejected=false;try{(void)fec_encode(original,limits);}catch(Failure f){rejected=f.status==AP_LENGTH;}check(rejected);
}
int main(int argc,char** argv){try{
 check(argc==2&&srtp_init()==srtp_err_status_ok);const std::string mode(argv[1]);if(mode=="fec-golden")fec();else security(mode);
 std::cout<<"{\"ok\":true,\"case\":\""<<mode<<"\"}\n";return 0;
 }catch(...){std::cerr<<"native media contract failure\n";return 2;}}
