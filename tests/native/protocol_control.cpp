#include "aether/protocol.h"
#include <windows.h>
#include <iostream>
int main(){
 auto module=LoadLibraryW(L"aether_protocol.dll");
 if(!module){std::cerr<<"fixture load failed\n";return 2;}
 const bool present=GetProcAddress(module,"aether_protocol_control_open")!=nullptr;
 FreeLibrary(module);
 std::cout<<"TAP version 13\n"<<(present?"ok":"not ok")<<" 1 - explicit-confirm-control-entry\n";
 if(!present)std::cout<<"  ---\n  error: expected additive control_open for explicit-confirm path; actual missing\n  ...\n";
 std::cout<<"1..1\n# tests 1\n# pass "<<(present?1:0)<<"\n# fail "<<(present?0:1)<<"\n# skipped 0\n";
 return present?0:1;
}
