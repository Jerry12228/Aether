#include "aether/protocol.h"
#include <cstdint>
#include <fstream>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>
#ifdef _WIN32
#include <process.h>
#else
#include <unistd.h>
#endif
namespace {
void event(uint64_t token,uint64_t seq,uint32_t kind,int32_t status,uint64_t op){std::cout<<"{\"kind\":\"event\",\"handle\":"<<token<<",\"sequence\":"<<seq<<",\"eventKind\":"<<kind<<",\"status\":"<<status<<",\"operation\":"<<op<<"}"<<std::endl;}
std::string query(uint64_t token){uint32_t n=0;auto s=aether_protocol_query(token,nullptr,0,&n);if(s!=AP_BUFFER_TOO_SMALL||n>4096)throw std::runtime_error("query size");std::vector<char> out(n);if(aether_protocol_query(token,out.data(),n,&n)!=AP_OK)throw std::runtime_error("query");return out.data();}
std::vector<uint8_t> from_hex(const std::string& hex){if(hex.size()%2||hex.size()>2048)throw std::runtime_error("hex length");std::vector<uint8_t> b;for(size_t i=0;i<hex.size();i+=2){size_t used=0;auto n=std::stoul(hex.substr(i,2),&used,16);if(used!=2)throw std::runtime_error("hex");b.push_back(static_cast<uint8_t>(n));}return b;}
}
int main(int argc,char** argv){
 uint64_t token=0;
 try{
  std::map<std::string,std::string> args;
  for(int i=1;i<argc;i+=2){if(i+1>=argc||!args.emplace(argv[i],argv[i+1]).second)throw std::runtime_error("arguments");}
  std::string role=args.at("--role");auto versions=args.contains("--versions")?args.at("--versions"):"1,2";std::vector<uint32_t> local;
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
  status=aether_protocol_submit(token,input.data(),static_cast<uint32_t>(input.size()));
  std::cout<<"{\"kind\":\"result\",\"pid\":"<<pid<<",\"detail\":"<<query(token)<<"}"<<std::endl;
  uint64_t final=0;if(aether_protocol_stop(token,&final)!=AP_OK||aether_protocol_ack(token,final)!=AP_OK)throw std::runtime_error("stop/ack");
  std::cout<<"{\"kind\":\"clean\",\"pid\":"<<pid<<",\"detail\":"<<query(token)<<"}"<<std::endl;
  if(aether_protocol_destroy(token)!=AP_OK)throw std::runtime_error("destroy");token=0;return status==AP_OK?0:2;
 }catch(const std::exception&){if(token){uint64_t final=0;if(aether_protocol_stop(token,&final)==AP_OK){aether_protocol_ack(token,final);aether_protocol_destroy(token);}}std::cerr<<"tracer rejected bounded input or lifecycle failure"<<std::endl;return 1;}
}
