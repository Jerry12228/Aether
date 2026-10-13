// Shared contract driver. Product C ABI and the independent host fixture stay in
// separate executables on desktop/Android. iOS calls separate contexts in one
// XCTest process; it does not claim a second process or a production authority.
#ifdef AETHER_CONTROL_HOST
#define main aether_fixture_host_entry
#else
#define main aether_fixture_client_entry
#endif
#include "protocol_control.cpp"
#undef main
#ifdef AETHER_IOS_CONTRACT
#ifdef AETHER_CONTROL_HOST
extern "C" int aether_contract_host(const char* directory,const char* scenario){
 {std::lock_guard lock(event_mutex);events.clear();}
 {std::lock_guard lock(fault_mutex);fault_rules.clear();}
 try{return host(directory,scenario);}catch(...){return 2;}
}
#else
extern "C" int aether_contract_client(const char* directory,const char* scenario,unsigned port){
 {std::lock_guard lock(event_mutex);events.clear();}
 try{return control_client(directory,scenario,port);}catch(...){return 2;}
}
extern "C" void aether_contract_scenario(const char* directory,const char* scenario){scenario_rules(directory,scenario);}
#endif
#else
int main(int argc,char** argv){
#ifdef AETHER_CONTROL_HOST
 return aether_fixture_host_entry(argc,argv);
#else
 return aether_fixture_client_entry(argc,argv);
#endif
}
#endif
