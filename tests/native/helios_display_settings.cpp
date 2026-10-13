// Exercises the actual independent reader against malformed registry replies.
// Registry calls are mocked in this test binary; no machine keys are written.
#include <windows.h>
#include <map>
#include <vector>
#include <string>
#include <iostream>
#include <cstring>
struct Setting { DWORD kind; std::vector<unsigned char> bytes; };
static std::map<std::wstring,Setting> values;
static unsigned closes=0,gpuSelections=0;
static bool missing=false,testMode=false,preferredAdapterChanged=false;
static DWORD watchdogTimeout=0,MaxVirtualMonitorCount=10,SDRBITS=8,HDRBITS=10;
static LUID preferredAdapterLuid{};
constexpr DWORD IDDCX_BITS_PER_COMPONENT_10=10,IDDCX_BITS_PER_COMPONENT_12=12;
struct AdapterOption { LUID adapterLuid{7,0};bool hasTargetAdapter=true;
 void selectGPU(const wchar_t* name){if(std::wstring(name)==L"TEST GPU")++gpuSelections;}
};
static LSTATUS mockOpen(HKEY,const wchar_t*,DWORD,REGSAM,HKEY* handle){
 if(missing)return ERROR_FILE_NOT_FOUND;*handle=reinterpret_cast<HKEY>(static_cast<uintptr_t>(1));return ERROR_SUCCESS;
}
static LSTATUS mockClose(HKEY){++closes;return ERROR_SUCCESS;}
static LSTATUS mockGet(HKEY,const wchar_t*,const wchar_t* name,DWORD flags,DWORD*,void* data,DWORD* size){
 const auto it=values.find(name);if(it==values.end())return ERROR_FILE_NOT_FOUND;
 const auto& v=it->second;
 if((flags==RRF_RT_REG_SZ&&v.kind!=REG_SZ)||(flags==RRF_RT_REG_DWORD&&v.kind!=REG_DWORD))return ERROR_UNSUPPORTED_TYPE;
 if(v.bytes.size()>*size)return ERROR_MORE_DATA;
 *size=static_cast<DWORD>(v.bytes.size());std::memcpy(data,v.bytes.data(),v.bytes.size());return ERROR_SUCCESS;
}
#define RegOpenKeyExW mockOpen
#define RegGetValueW mockGet
#define RegCloseKey mockClose
#include "../../tools/helios-display-research/HeliosDisplaySettings.cpp.inc"
static void number(const wchar_t* name,DWORD value,DWORD kind=REG_DWORD,unsigned count=4){
 Setting setting{kind,std::vector<unsigned char>(count)};
 std::memcpy(setting.bytes.data(),&value,(std::min)(count,4u));values[name]=setting;
}
int main(){
 number(L"watchdog",999,REG_SZ);number(L"testMode",1,REG_DWORD,1);number(L"maxMonitors",0);
 values[L"gpuName"]={REG_SZ,std::vector<unsigned char>(300,0)};
 LoadSettings();
 if(watchdogTimeout!=0||testMode||MaxVirtualMonitorCount!=10||gpuSelections!=0||closes!=1)return 1;
 values.clear();number(L"watchdog",0);number(L"testMode",0);number(L"maxMonitors",7);number(L"sdrBits",10);number(L"hdrBits",12);
 const wchar_t gpu[]=L"TEST GPU";
 Setting text{REG_SZ,std::vector<unsigned char>(sizeof(gpu))};std::memcpy(text.bytes.data(),gpu,sizeof(gpu));values[L"gpuName"]=text;
 LoadSettings();
 if(MaxVirtualMonitorCount!=7||SDRBITS!=10||HDRBITS!=12||gpuSelections!=1||!preferredAdapterChanged||preferredAdapterLuid.LowPart!=7||closes!=2)return 2;
 number(L"maxMonitors",65);LoadSettings();if(MaxVirtualMonitorCount!=7||closes!=3)return 3;
 missing=true;LoadSettings();if(closes!=3)return 4;
 std::cout<<"PASS native settings: malformed types/sizes, bounded string/capacity, valid GPU/bits, exact handle cleanup"<<std::endl;
 return 0;
}
