#include "aether/protocol.h"
#include <cstdint>
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
#ifdef _WIN32
#include <process.h>
#else
#include <unistd.h>
#endif
namespace {
std::atomic<bool> delay_callback{false},callback_started{false},callback_completed{false};
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
}
int main(int argc,char** argv){
 uint64_t token=0;
 try{
  std::map<std::string,std::string> args;
  for(int i=1;i<argc;i+=2){if(i+1>=argc||!args.emplace(argv[i],argv[i+1]).second)throw std::runtime_error("arguments");}
  std::string role=args.at("--role");auto versions=args.contains("--versions")?args.at("--versions"):"1,2";std::vector<uint32_t> local;
  if(role=="kat"){kat(args);return 0;}
  for(size_t begin=0;;){auto end=versions.find(',',begin);auto v=std::stoul(versions.substr(begin,end-begin));if(v==0||v>65535||local.size()==8)throw std::runtime_error("versions");local.push_back(static_cast<uint32_t>(v));if(end==std::string::npos)break;begin=end+1;}
  if(role=="parse") {auto b=from_hex(args.at("--wire"));uint32_t selected=0,upgrade=0;auto s=aether_protocol_negotiate(b.data(),static_cast<uint32_t>(b.size()),local.data(),static_cast<uint32_t>(local.size()),&selected,&upgrade);std::cout<<"{\"status\":"<<s<<",\"selectedVersion\":"<<selected<<",\"upgradeSide\":"<<upgrade<<"}"<<std::endl;return 0;}
  if(role!="host"&&role!="client")throw std::runtime_error("role");
  const auto fixture=args.at("--fixture");auto scenario=args.at("--scenario");
  auto cert=fixture+"/"+(role=="host"?"host":scenario=="wrong-trust"?"untrusted":"client")+".pem";
  auto key=fixture+"/"+(role=="host"?"host":scenario=="wrong-trust"?"untrusted":"client")+".key";
  auto trust=fixture+"/trust.pem";auto peer=role=="host"?"aether-client.local":scenario=="wrong-identity"?"changed-host.local":"aether-host.local";
  AetherProtocolConfig c{};c.abi_version=1;c.struct_size=sizeof(c);c.role=role=="host"?1:2;c.deadline_ms=2000;
  c.peer_control_port=role=="client"?static_cast<uint32_t>(std::stoul(args.at("--peer"))):0;
  c.host_id=101;c.instance_id=102;c.display_id=103;c.stream_id=104;c.connection_id=105;c.client_id=106;c.lease_epoch=1;c.config_generation=1;c.key_generation=1;
  c.certificate_file=cert.c_str();c.private_key_file=key.c_str();c.trust_file=trust.c_str();c.peer_name=peer;c.version_count=static_cast<uint32_t>(local.size());for(size_t i=0;i<local.size();++i)c.versions[i]=local[i];c.permission_read=scenario=="wrong-permission"&&role=="host"?0:1;
  auto status=aether_protocol_create(&c,event,&token);if(status!=AP_OK){std::cout<<"{\"kind\":\"create-failed\",\"status\":"<<status<<"}"<<std::endl;return 1;}
#ifdef _WIN32
  auto pid=_getpid();
#else
  auto pid=getpid();
#endif
  std::cout<<"{\"kind\":\"ready\",\"pid\":"<<pid<<",\"detail\":"<<query(token)<<"}"<<std::endl;
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
  if(aether_protocol_destroy(token)!=AP_OK)throw std::runtime_error("destroy");token=0;return status==AP_OK?0:2;
 }catch(const std::exception&){if(token){uint64_t final=0;if(aether_protocol_stop(token,&final)==AP_OK){aether_protocol_ack(token,final);aether_protocol_destroy(token);}}std::cerr<<"tracer rejected bounded input or lifecycle failure"<<std::endl;return 1;}
}
