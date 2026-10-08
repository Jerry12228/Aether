#include "aether/core.h"
#include <iostream>
#include <stdexcept>
void event(uint64_t,uint64_t,uint32_t,int32_t,uint64_t) {}
int main(int argc,char** argv) {
 try {
  if(argc!=2) throw std::runtime_error("Suite required");
  AetherConfig config{1,sizeof(AetherConfig),0,0}; uint64_t token=0;
  if(aether_core_create(&config,event,&token)!=AETHER_OK || token==0)
    throw std::runtime_error("create must initialize the real DLL and return a generation token");
  std::cout<<"PASS "<<argv[1]<<" checks=1\n"; return 0;
 }catch(const std::exception& e){std::cerr<<"FAIL "<<e.what()<<"\n";return 1;}
}
