// Test-only loopback fault relay. Mutations mirror protocol-multistream.test.cjs;
// the parent retains the original product-result and packet-count assertions.
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <unistd.h>
#include <cerrno>
#include <chrono>
#include <array>
#include <vector>
#include <iostream>
#include <stdexcept>
#include <algorithm>
#include <string>

namespace {
struct Socket {int fd=-1;~Socket(){if(fd>=0)close(fd);}};
void need(bool value){if(!value)throw std::runtime_error("owned UDP bridge failure");}
uint16_t port(int fd){sockaddr_in a{};a.sin_family=AF_INET;a.sin_addr.s_addr=htonl(INADDR_LOOPBACK);need(bind(fd,reinterpret_cast<sockaddr*>(&a),sizeof(a))==0);socklen_t size=sizeof(a);need(getsockname(fd,reinterpret_cast<sockaddr*>(&a),&size)==0);return ntohs(a.sin_port);}
uint32_t u32(const uint8_t* p){return(uint32_t(p[0])<<24)|(uint32_t(p[1])<<16)|(uint32_t(p[2])<<8)|p[3];}
uint16_t u16(const uint8_t* p){return(uint16_t(p[0])<<8)|p[1];}
struct Held {std::vector<uint8_t> packet;uint16_t destination;};
struct FaultRelay {
 int fd;unsigned mode=0;uint16_t host=0,client=0;size_t received=0,forwarded=0,dropped=0,injected=0,bytes=0;
 std::vector<uint8_t> seed;std::vector<Held> held;
 void send_packet(const std::vector<uint8_t>& packet,uint16_t destination,bool inject=false){sockaddr_in a{};a.sin_family=AF_INET;a.sin_addr.s_addr=htonl(INADDR_LOOPBACK);a.sin_port=htons(destination);need(destination&&sendto(fd,packet.data(),packet.size(),0,reinterpret_cast<sockaddr*>(&a),sizeof(a))==static_cast<ssize_t>(packet.size()));if(inject)++injected;else ++forwarded;need(forwarded+injected<=4096);}
 void flush(bool replay){auto pending=std::move(held);held.clear();for(const auto& p:pending){send_packet(p.packet,p.destination);if(replay)send_packet(p.packet,p.destination,true);}}
 void stats(const char* kind)const{std::cout<<"{\"kind\":\""<<kind<<"\",\"pid\":"<<getpid()<<",\"detail\":{\"received\":"<<received<<",\"forwarded\":"<<forwarded<<",\"dropped\":"<<dropped<<",\"injected\":"<<injected<<",\"bytes\":"<<bytes<<",\"queueBytes\":"<<held.size()*1500<<"}}"<<std::endl;}
 void packet(const std::vector<uint8_t>& p){need(mode&&p.size()>=12&&++received<=2048);bytes+=p.size();need(bytes<=4*1024*1024);const auto stream=u32(p.data()+8);const auto seq=u16(p.data()+2);
  if(mode>=7){need(p.size()>=160);const auto round=u32(p.data()+20);const auto role=p[18];const auto shard=u16(p.data()+96);const auto destination=stream>=107?host:client;
   if(mode==7&&stream==104&&round==1&&shard==0){seed=p;const char* digits="0123456789abcdef";std::string hex;for(auto b:p){hex+=digits[b>>4];hex+=digits[b&15];}std::cout<<"{\"kind\":\"seed\",\"hex\":\""<<hex<<"\"}"<<std::endl;}
   if(mode==17&&stream==104&&round==1&&shard==0){need(!seed.empty());send_packet(seed,destination,true);}
   if(stream==104&&round>=2&&round<=4){
    if((mode==8||mode==10||mode==13)&&shard==0){++dropped;return;}
    if(mode==9&&shard<2){++dropped;return;}
    if(mode==10&&role==1){auto bad=p;bad.back()^=1;send_packet(bad,destination,true);return;}
    if(mode==13&&role==1){held.push_back({p,destination});need(held.size()<=128);return;}
    if(mode==11&&role==1){auto bad=p;bad[18]=0;send_packet(bad,destination,true);}
   }
   if(mode==12&&role==0&&shard==0){held.push_back({p,destination});need(held.size()<=128);return;}
   send_packet(p,destination);if(mode==12&&role==1)flush(true);if(mode==13&&stream==104&&round>=3&&shard==1)flush(false);
   if(mode==15&&stream==104&&round==2&&role==1){for(auto offset:{2,4,8,16,17,18,19,20,24,32,40,48,56,64,72,80,88,96,98,100,102,104,108,116,120,152,156}){need(static_cast<size_t>(offset)<p.size());auto bad=p;bad[offset]^=1;send_packet(bad,destination,true);}}
   if(mode==16&&stream==104&&shard==0)for(int i=0;i<20;++i)send_packet(p,destination,true);return;
  }
  if(mode==2&&stream==104&&seq>=2&&seq<=4){++dropped;return;}
  if(stream==104&&seq==2&&(mode==3||mode==4||mode==5)){auto bad=p;if(mode==3){bad[8]=0;bad[9]=0;bad[10]=0;bad[11]=105;}if(mode==4){need(p.size()>16);bad[16]=2;}if(mode==5){bad[2]=0xea;bad[3]=0x60;}send_packet(bad,client,true);}
  send_packet(p,client);if(mode==6&&stream==104&&seq==2)send_packet(p,client,true);
 }
 void control(const uint8_t* p,size_t n){need(n>=4);if(n==4&&std::equal(p,p+4,"ABST")){stats("stats");return;}need(n>=16&&std::equal(p,p+4,"ABCF")&&!mode);host=u16(p+4);client=u16(p+6);mode=u32(p+8);const auto size=u32(p+12);need(host&&client&&mode>=1&&mode<=19&&size==n-16&&size<=1484);seed.assign(p+16,p+n);if(mode==17)need(!seed.empty());std::cout<<"{\"kind\":\"configured\",\"pid\":"<<getpid()<<"}"<<std::endl;}
};
}
int main(){try{
 Socket udp,tcp,channel;udp.fd=socket(AF_INET,SOCK_DGRAM,0);tcp.fd=socket(AF_INET,SOCK_STREAM,0);need(udp.fd>=0&&tcp.fd>=0&&udp.fd<FD_SETSIZE&&tcp.fd<FD_SETSIZE);
 const auto udp_port=port(udp.fd),tcp_port=port(tcp.fd);need(listen(tcp.fd,1)==0);
 timeval timeout{5,0};need(setsockopt(tcp.fd,SOL_SOCKET,SO_RCVTIMEO,&timeout,sizeof(timeout))==0);
 std::cout<<"{\"kind\":\"ready\",\"pid\":"<<getpid()<<",\"detail\":{\"udpPort\":"<<udp_port<<",\"controlPort\":"<<tcp_port<<"}}"<<std::endl;
 channel.fd=accept(tcp.fd,nullptr,nullptr);need(channel.fd>=0&&channel.fd<FD_SETSIZE);
 timeout={1,0};need(setsockopt(channel.fd,SOL_SOCKET,SO_SNDTIMEO,&timeout,sizeof(timeout))==0);
 std::array<uint8_t,1500> packet{};std::vector<uint8_t> input;FaultRelay fault{udp.fd,0,0,0,0,0,0,0,0,{},{}};
 const auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(15);
 bool done=false;while(!done&&std::chrono::steady_clock::now()<deadline){
  fd_set fds;FD_ZERO(&fds);FD_SET(udp.fd,&fds);FD_SET(channel.fd,&fds);timeval slice{0,10000};const auto count=select(std::max(udp.fd,channel.fd)+1,&fds,nullptr,nullptr,&slice);if(count<0&&errno==EINTR)continue;need(count>=0);
  if(FD_ISSET(udp.fd,&fds)){
   const auto size=recv(udp.fd,packet.data(),packet.size(),0);need(size>0&&size<=1500);fault.packet(std::vector<uint8_t>(packet.begin(),packet.begin()+size));
  }
  if(FD_ISSET(channel.fd,&fds)){
   const auto size=recv(channel.fd,packet.data(),packet.size(),0);if(size==0){done=true;break;}if(size<0&&errno==EINTR)continue;need(size>0);input.insert(input.end(),packet.begin(),packet.begin()+size);need(input.size()<=65536);
   while(input.size()>=6){const uint16_t destination=u16(input.data());const auto n=u32(input.data()+2);need(!destination&&n>0&&n<=1500);if(input.size()<n+6)break;
    fault.control(input.data()+6,n);input.erase(input.begin(),input.begin()+6+n);
   }
  }
 }
 need(done&&input.empty());fault.held.clear();fault.stats("clean");return 0;
 }catch(const std::exception& e){std::cerr<<e.what()<<std::endl;return 1;}}
