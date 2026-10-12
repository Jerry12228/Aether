#include "aether/protocol.h"
#include <cstdint>
#include <cstddef>
#include <fstream>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>
#include <thread>
#include <chrono>
#include <cstring>
#include <openssl/evp.h>
#include <memory>
#include <atomic>
#include <mutex>
#ifdef __APPLE__
#include <pthread.h>
#include <pthread/qos.h>
#endif
#ifdef _WIN32
#include <process.h>
#else
#include <unistd.h>
#endif
namespace {
std::atomic<bool> delay_callback{false},callback_started{false},callback_completed{false};
std::vector<uint8_t> from_hex(const std::string&);
std::string proposal_digest(const std::string&);
std::mutex control_mutex;std::map<uint64_t,int32_t> control_results;std::atomic<uint64_t> control_sequence{0};
void control_event(uint64_t,uint64_t seq,uint32_t kind,int32_t status,uint64_t op){control_sequence=seq;if(kind==11){std::lock_guard lock(control_mutex);control_results[op]=status;}}
std::string control_query(uint64_t token){uint32_t n=0;if(aether_protocol_control_query(token,nullptr,0,&n)!=AP_BUFFER_TOO_SMALL||n>65536)throw std::runtime_error("control bounds");std::vector<char> out(65536);if(aether_protocol_control_query(token,out.data(),static_cast<uint32_t>(out.size()),&n)!=AP_OK)throw std::runtime_error("control query");return out.data();}
uint32_t read32(const uint8_t* p){return (uint32_t(p[0])<<24)|(uint32_t(p[1])<<16)|(uint32_t(p[2])<<8)|p[3];}
uint64_t read64(const uint8_t* p){return (uint64_t(read32(p))<<32)|read32(p+4);}
void write64(uint8_t* p,uint64_t n){for(int i=7;i>=0;--i){p[i]=static_cast<uint8_t>(n);n>>=8;}}
std::vector<uint8_t> control_confirmation(const std::string& s){auto value=[&](const char* field){std::string marker=std::string("\"")+field+"\":";auto p=s.find(marker);if(p==std::string::npos)throw std::runtime_error("confirm field");return std::stoull(s.substr(p+marker.size()));};auto digest=from_hex(proposal_digest(s));std::vector<uint8_t> b{0,1,0,3,0,6,0,32};b.insert(b.end(),digest.begin(),digest.end());for(auto field:{7,8}){auto p=b.size();b.resize(p+12);b[p+1]=static_cast<uint8_t>(field);b[p+3]=8;write64(b.data()+p+4,value(field==7?"hostRevision":"expiryToken"));}return b;}
void event(uint64_t token,uint64_t seq,uint32_t kind,int32_t status,uint64_t op){if(delay_callback){callback_started=true;std::this_thread::sleep_for(std::chrono::milliseconds(100));}std::cout<<"{\"kind\":\"event\",\"handle\":"<<token<<",\"sequence\":"<<seq<<",\"eventKind\":"<<kind<<",\"status\":"<<status<<",\"operation\":"<<op<<"}"<<std::endl;callback_completed=true;}
std::string query(uint64_t token){uint32_t n=0;auto s=aether_protocol_query(token,nullptr,0,&n);if(s!=AP_BUFFER_TOO_SMALL||n>4096)throw std::runtime_error("query size");std::vector<char> out(n);if(aether_protocol_query(token,out.data(),n,&n)!=AP_OK)throw std::runtime_error("query");return out.data();}
std::vector<uint8_t> from_hex(const std::string& hex){if(hex.size()%2||hex.size()>2048)throw std::runtime_error("hex length");std::vector<uint8_t> b;for(size_t i=0;i<hex.size();i+=2){size_t used=0;auto n=std::stoul(hex.substr(i,2),&used,16);if(used!=2)throw std::runtime_error("hex");b.push_back(static_cast<uint8_t>(n));}return b;}
std::string proposal_digest(const std::string& summary){auto marker=summary.find("\"digest\":\"");if(marker==std::string::npos)throw std::runtime_error("proposal missing");return summary.substr(marker+10,64);}
void proposal_contract(uint64_t token){
 auto check=[](bool ok){if(!ok)throw std::runtime_error("proposal contract");};
 AetherProtocolCapability caps[3]{};
 std::strcpy(caps[0].name,"hdr");caps[0].availability=0;caps[0].reason=1;caps[0].requested=1;
 std::strcpy(caps[1].name,"fps");caps[1].availability=1;caps[1].reason=2;caps[1].requested=120;caps[1].available=60;
 std::strcpy(caps[2].name,"camera");caps[2].availability=2;caps[2].reason=3;caps[2].requested=1;
 AetherProtocolRequest r{1,sizeof(AetherProtocolRequest),1,7,1,1000,3,caps};
 check(aether_protocol_propose(token,&r)==AP_OK);auto pending=query(token);auto digest=proposal_digest(pending);
 check(aether_protocol_confirm(token,1,8,digest.c_str())==AP_STALE);
 check(aether_protocol_cancel(token,1)==AP_OK);
 check(aether_protocol_confirm(token,1,7,digest.c_str())==AP_CANCELLED);
 r.request_id=2;r.expires_ms=1;check(aether_protocol_propose(token,&r)==AP_OK);digest=proposal_digest(query(token));std::this_thread::sleep_for(std::chrono::milliseconds(3));
 check(aether_protocol_confirm(token,2,7,digest.c_str())==AP_EXPIRED);
 r.request_id=3;r.expires_ms=1000;check(aether_protocol_propose(token,&r)==AP_OK);digest=proposal_digest(query(token));
 check(aether_protocol_confirm(token,3,7,digest.c_str())==AP_OK);
 check(aether_protocol_confirm(token,3,7,digest.c_str())==AP_ALREADY_COMPLETE);
 // Fixture-only contract output: production query has no expected verdicts.
 std::cout<<"{\"kind\":\"proposal-contract\",\"checks\":9,\"pendingState\":"<<pending<<",\"finalState\":"<<query(token)<<"}"<<std::endl;
}
void kat(const std::map<std::string,std::string>& args){
 auto key=from_hex(args.at("--key")),iv=from_hex(args.at("--iv")),plain=from_hex(args.at("--plaintext"));
 if(key.size()!=32||iv.size()!=12||plain.size()>1024)throw std::runtime_error("KAT length");
 std::unique_ptr<EVP_CIPHER_CTX,decltype(&EVP_CIPHER_CTX_free)> ctx{EVP_CIPHER_CTX_new(),EVP_CIPHER_CTX_free};
 std::vector<uint8_t> cipher(plain.size()+16);uint8_t tag[16]{};int n=0,final=0;
 if(!ctx||EVP_EncryptInit_ex(ctx.get(),EVP_aes_256_gcm(),nullptr,key.data(),iv.data())!=1||EVP_EncryptUpdate(ctx.get(),cipher.data(),&n,plain.data(),static_cast<int>(plain.size()))!=1||EVP_EncryptFinal_ex(ctx.get(),cipher.data()+n,&final)!=1||EVP_CIPHER_CTX_ctrl(ctx.get(),EVP_CTRL_GCM_GET_TAG,16,tag)!=1)throw std::runtime_error("KAT encrypt");
 auto hex=[](const uint8_t* p,size_t size){std::string s;const char* digits="0123456789abcdef";for(size_t i=0;i<size;++i){s.push_back(digits[p[i]>>4]);s.push_back(digits[p[i]&15]);}return s;};
 std::cout<<"{\"ciphertext\":\""<<hex(cipher.data(),static_cast<size_t>(n+final))<<"\",\"tag\":\""<<hex(tag,16)<<"\"}"<<std::endl;
}
int control_actions(const std::map<std::string,std::string>& args,AetherProtocolConfig config){
#ifdef __APPLE__
 if(pthread_set_qos_class_self_np(QOS_CLASS_USER_INITIATED,0)!=0)throw std::runtime_error("test control observer QoS");
#endif
 std::ifstream f(args.at("--control-actions"),std::ios::binary);std::vector<uint8_t> actions(std::istreambuf_iterator<char>(f),{});if(actions.size()<12||actions.size()>1048576||std::memcmp(actions.data(),"APAC",4)||read32(actions.data()+4)!=1||read32(actions.data()+8)>512)throw std::runtime_error("actions bounds");
 uint64_t token=0;config.host_id=1;config.instance_id=2;config.display_id=3;config.stream_id=4;config.connection_id=args.contains("--connection")?std::stoull(args.at("--connection")):5;config.client_id=args.contains("--client-id")?std::stoull(args.at("--client-id")):6;config.deadline_ms=3000;if(aether_protocol_create(&config,control_event,&token)!=AP_OK)throw std::runtime_error("control create");
 auto drain=[&]{auto s=control_query(token);auto p=s.find("\"acked\":");if(p==std::string::npos)throw std::runtime_error("acked");auto ack=std::stoull(s.substr(p+8));while(ack<control_sequence.load()){if(aether_protocol_control_ack(token,++ack)!=AP_OK)throw std::runtime_error("control ack");}};
 auto wait=[&](uint64_t op,uint32_t ms){auto until=std::chrono::steady_clock::now()+std::chrono::milliseconds(ms);while(std::chrono::steady_clock::now()<until){{std::lock_guard lock(control_mutex);auto i=control_results.find(op);if(i!=control_results.end())return i->second;}std::this_thread::sleep_for(std::chrono::milliseconds(1));}return int32_t{AP_TIMEOUT};};
 try{std::vector<uint8_t> hello{'A','E','T','H',0,16,1,1,0,3,0,8,0,2,0,1};AetherProtocolControlOpen open{1,sizeof(open),1,0,static_cast<uint32_t>(hello.size()),0,hello.data()};if(aether_protocol_control_open(token,&open)!=AP_OK||wait(0,3500)!=AP_OK)throw std::runtime_error("control open");drain();auto action_started=std::chrono::steady_clock::now();uint64_t operation=0,last_observed_progress=0;size_t offset=12;uint64_t total_wait=0;
  for(unsigned step=0;step<read32(actions.data()+8);++step){if(offset+40>actions.size())throw std::runtime_error("action header");auto p=actions.data()+offset;auto opcode=read32(p),delay=read32(p+4),size=read32(p+32),deadline=read32(p+36);auto request=read64(p+8),stream=read64(p+16),generation=read64(p+24);bool asynchronous=(deadline&0x80000000u)!=0;deadline&=0x7fffffffu;offset+=40;if(size>8192||size>actions.size()-offset||delay>90000||total_wait+delay>300000)throw std::runtime_error("action payload");total_wait+=delay;std::vector<uint8_t> payload(actions.begin()+offset,actions.begin()+offset+size);offset+=size;int32_t status=AP_OK;
   if(opcode==103){status=aether_protocol_control_cancel_operation(token,request);if(status==AP_OK&&delay&&wait(request,deadline)==AP_TIMEOUT)throw std::runtime_error("cancel terminal receipt deadline");}
   else if(opcode<=13){if(payload.empty())payload=opcode==2||opcode==9?control_confirmation(control_query(token)):std::vector<uint8_t>{0,1,0,0};AetherProtocolCommand command{1,sizeof(command),1,opcode,0,deadline,++operation,request,stream,generation,static_cast<uint32_t>(payload.size()),0,payload.data()};status=aether_protocol_control_send(token,&command);if(status==AP_OK&&!asynchronous)status=wait(operation,deadline+500);}
   else if(opcode!=100)throw std::runtime_error("action opcode");
   const auto observation_deadline=std::chrono::steady_clock::now()+std::chrono::milliseconds(deadline);
   if(delay)std::this_thread::sleep_for(std::chrono::milliseconds(delay));
   auto observed=control_query(token);const auto observed_number=[](const std::string& text,const char* name){const auto marker=std::string("\"")+name+"\":";const auto at=text.find(marker);if(at==std::string::npos)throw std::runtime_error("observation field");return std::stoull(text.substr(at+marker.size()));};
   // Opcode100 is a test observer, not a production operation. A repeated
   // cached window is not a second observation of healthy media. Wait for a
   // real worker window within the existing action deadline, while preserving
   // every requested delay, recovery clock and original assertion.
   while(opcode==100&&last_observed_progress&&observed_number(observed,"grants")&&observed_number(observed,"mediaMask")&&observed.find("\"authenticated\":true")!=std::string::npos&&observed_number(observed,"controlProgress")==last_observed_progress){
    if(std::chrono::steady_clock::now()>=observation_deadline)throw std::runtime_error("actual media observation deadline");std::this_thread::sleep_for(std::chrono::milliseconds(1));observed=control_query(token);
   }
   last_observed_progress=observed_number(observed,"controlProgress");
   std::cout<<"{\"kind\":\"control-state\",\"step\":"<<step<<",\"elapsedMs\":"<<std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now()-action_started).count()<<",\"opcode\":"<<opcode<<",\"status\":"<<status<<",\"detail\":"<<observed<<"}"<<std::endl;drain();
  }if(offset!=actions.size())throw std::runtime_error("actions tail");uint64_t seq=0;if(aether_protocol_stop(token,&seq)!=AP_OK)throw std::runtime_error("control stop");drain();std::cout<<"{\"kind\":\"control-clean\",\"detail\":"<<control_query(token)<<"}"<<std::endl;if(aether_protocol_destroy(token)!=AP_OK)throw std::runtime_error("control destroy");return 0;
 }catch(...){uint64_t seq=0;if(aether_protocol_stop(token,&seq)==AP_OK){drain();aether_protocol_destroy(token);}throw;}
}
}
int main(int argc,char** argv){
 uint64_t token=0,sibling=0;
 try{
  std::map<std::string,std::string> args;
  for(int i=1;i<argc;i+=2){if(i+1>=argc||!args.emplace(argv[i],argv[i+1]).second)throw std::runtime_error("arguments");}
  std::string role=args.at("--role");auto versions=args.contains("--versions")?args.at("--versions"):"1,2";std::vector<uint32_t> local;
  if(role=="media-options"){
   static_assert(sizeof(AetherProtocolMediaOptions)==28&&offsetof(AetherProtocolMediaOptions,per_stream_queue_bytes)==24);
   static_assert(sizeof(AetherProtocolEffectiveMedia)==40);
   const auto bytes=from_hex(args.at("--options"));if(bytes.size()!=20)throw std::runtime_error("media options size");
   const auto read16=[&](size_t i){return static_cast<uint16_t>((uint16_t(bytes[i])<<8)|bytes[i+1]);};
   AetherProtocolMediaOptions options{1,sizeof(AetherProtocolMediaOptions),read16(0),read16(2),read16(4),read16(6),read16(8),read16(10),read16(16),read16(18),(uint32_t(bytes[12])<<24)|(uint32_t(bytes[13])<<16)|(uint32_t(bytes[14])<<8)|bytes[15]};
   if(args.contains("--abi"))options.abi_version=static_cast<uint32_t>(std::stoul(args.at("--abi")));
   if(args.contains("--size"))options.struct_size=static_cast<uint32_t>(std::stoul(args.at("--size")));
   AetherProtocolEffectiveMedia out{};out.abi_version=1;out.struct_size=sizeof(out);
   if(args.contains("--out-size"))out.struct_size=static_cast<uint32_t>(std::stoul(args.at("--out-size")));
   if(args.contains("--out-abi"))out.abi_version=static_cast<uint32_t>(std::stoul(args.at("--out-abi")));
   const auto status=aether_protocol_validate_media_options(&options,&out);
   std::cout<<"{\"status\":"<<status<<",\"queryVersion\":"<<out.query_version<<",\"packetBytes\":"<<out.packet_bytes<<",\"k\":"<<out.source_shards<<",\"n\":"<<out.total_shards<<"}"<<std::endl;return 0;
  }
  if(role=="kat"){kat(args);return 0;}
  for(size_t begin=0;;){auto end=versions.find(',',begin);auto v=std::stoul(versions.substr(begin,end-begin));if(v==0||v>65535||local.size()==8)throw std::runtime_error("versions");local.push_back(static_cast<uint32_t>(v));if(end==std::string::npos)break;begin=end+1;}
  if(role=="parse") {auto b=from_hex(args.at("--wire"));uint32_t selected=0,upgrade=0;auto s=aether_protocol_negotiate(b.data(),static_cast<uint32_t>(b.size()),local.data(),static_cast<uint32_t>(local.size()),&selected,&upgrade);std::cout<<"{\"status\":"<<s<<",\"selectedVersion\":"<<selected<<",\"upgradeSide\":"<<upgrade<<"}"<<std::endl;return 0;}
  if(role!="host"&&role!="client")throw std::runtime_error("role");
  const auto fixture=args.at("--fixture");auto scenario=args.at("--scenario");
  auto cert=fixture+"/"+(role=="host"?"host":scenario=="wrong-trust"?"untrusted":"client")+".pem";
  auto key=fixture+"/"+(role=="host"?"host":scenario=="wrong-trust"?"untrusted":"client")+".key";
  auto trust=fixture+"/trust.pem";auto peer=role=="host"?"aether-client.local":scenario=="wrong-identity"?"changed-host.local":"aether-host.local";
  AetherProtocolConfig c{};c.abi_version=1;c.struct_size=sizeof(c);c.role=role=="host"?1:2;
  // The full synthetic fixture includes TLS and eight bidirectional rounds.
  // Use the supported 3s exchange bound; each media window remains 25ms.
  c.deadline_ms=scenario=="multistream"?3000:2000;
  c.peer_control_port=role=="client"?static_cast<uint32_t>(std::stoul(args.at("--peer"))):0;
  c.host_id=101;c.instance_id=102;c.display_id=103;c.stream_id=104;c.connection_id=105;c.client_id=106;c.lease_epoch=1;c.config_generation=1;c.key_generation=1;
  if(args.contains("--key-generation")){c.key_generation=std::stoull(args.at("--key-generation"));if(c.key_generation==0)throw std::runtime_error("key generation");}
  c.certificate_file=cert.c_str();c.private_key_file=key.c_str();c.trust_file=trust.c_str();c.peer_name=peer;c.version_count=static_cast<uint32_t>(local.size());for(size_t i=0;i<local.size();++i)c.versions[i]=local[i];c.permission_read=scenario=="wrong-permission"&&role=="host"?0:1;
  if(args.contains("--control-actions"))return control_actions(args,c);
  auto status=aether_protocol_create(&c,event,&token);if(status!=AP_OK){std::cout<<"{\"kind\":\"create-failed\",\"status\":"<<status<<"}"<<std::endl;return 1;}
  if(scenario=="multistream"){auto other=c;other.role=1;other.connection_id=205;other.stream_id=204;if(aether_protocol_create(&other,event,&sibling)!=AP_OK)throw std::runtime_error("sibling");}
#ifdef _WIN32
  auto pid=_getpid();
#else
  auto pid=getpid();
#endif
  std::cout<<"{\"kind\":\"ready\",\"pid\":"<<pid<<",\"detail\":"<<query(token)<<"}"<<std::endl;
  if(args.contains("--before-submit")){
   if(scenario!="multistream"||args.at("--before-submit")!=fixture+"/submit-"+role)throw std::runtime_error("owned submit barrier");
   const auto until=std::chrono::steady_clock::now()+std::chrono::seconds(5);
   while(!std::ifstream(args.at("--before-submit")).good()){if(std::chrono::steady_clock::now()>=until)throw std::runtime_error("submit barrier deadline");std::this_thread::sleep_for(std::chrono::milliseconds(1));}
  }
  std::vector<uint8_t> input;
  if(role=="host"){const std::string synthetic="synthetic-phase06";input.assign(synthetic.begin(),synthetic.end());}
  else{std::ifstream f(fixture+"/request.bin",std::ios::binary);input.assign(std::istreambuf_iterator<char>(f),{});if(input.empty()||input.size()>1024)throw std::runtime_error("fixture size");}
  if(role=="client"&&scenario=="callback-barrier"){
   delay_callback=true;
   std::thread submit([&]{status=aether_protocol_submit(token,input.data(),static_cast<uint32_t>(input.size()));});
   auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(3);
   while(!callback_started&&std::chrono::steady_clock::now()<deadline)std::this_thread::sleep_for(std::chrono::milliseconds(1));
   auto started=std::chrono::steady_clock::now();uint64_t final=0;auto stop=aether_protocol_stop(token,&final);
   auto waited=std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now()-started).count();submit.join();
   if(stop!=AP_OK||!callback_completed||waited<50)throw std::runtime_error("callback barrier");
   std::cout<<"{\"kind\":\"callback-barrier\",\"stopStatus\":"<<stop<<",\"waitMs\":"<<waited<<",\"callbackCompleted\":"<<(callback_completed?"true":"false")<<"}"<<std::endl;
  }else status=aether_protocol_submit(token,input.data(),static_cast<uint32_t>(input.size()));
  if(status==AP_OK&&role=="client"&&scenario=="proposal")proposal_contract(token);
  std::cout<<"{\"kind\":\"result\",\"pid\":"<<pid<<",\"detail\":"<<query(token)<<"}"<<std::endl;
  uint64_t final=0;if(aether_protocol_stop(token,&final)!=AP_OK||aether_protocol_ack(token,final)!=AP_OK)throw std::runtime_error("stop/ack");
  std::cout<<"{\"kind\":\"clean\",\"pid\":"<<pid<<",\"detail\":"<<query(token)<<"}"<<std::endl;
  if(sibling){std::cout<<"{\"kind\":\"sibling-survives\",\"detail\":"<<query(sibling)<<"}"<<std::endl;uint64_t other_final=0;if(aether_protocol_stop(sibling,&other_final)!=AP_OK||aether_protocol_ack(sibling,other_final)!=AP_OK||aether_protocol_destroy(sibling)!=AP_OK)throw std::runtime_error("sibling cleanup");sibling=0;}
  if(aether_protocol_destroy(token)!=AP_OK)throw std::runtime_error("destroy");token=0;return status==AP_OK?0:2;
 }catch(const std::exception&){for(auto owned:{token,sibling})if(owned){uint64_t final=0;if(aether_protocol_stop(owned,&final)==AP_OK){aether_protocol_ack(owned,final);aether_protocol_destroy(owned);}}std::cerr<<"tracer rejected bounded input or lifecycle failure"<<std::endl;return 1;}
}
