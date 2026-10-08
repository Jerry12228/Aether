#include "aether/virtual_display.h"
#include <windows.h>
#include <setupapi.h>
#include <devguid.h>
#include <cfgmgr32.h>
#include <filesystem>
#include <fstream>
#include <future>
#include <iostream>
#include <sstream>
#include <thread>
namespace aether::vdisplay {
namespace {
std::string Utf8(const wchar_t* value) {
 const int n=WideCharToMultiByte(CP_UTF8,0,value,-1,nullptr,0,nullptr,nullptr);if(n<=1)return {};
 std::string s(static_cast<size_t>(n),'\0');WideCharToMultiByte(CP_UTF8,0,value,-1,s.data(),n,nullptr,nullptr);s.pop_back();return s;
}
std::string Escape(const std::string& value){std::ostringstream s;s<<'"';for(const unsigned char c:value){switch(c){case '"':s<<"\\\"";break;case '\\':s<<"\\\\";break;case '\n':s<<"\\n";break;case '\r':s<<"\\r";break;case '\t':s<<"\\t";break;default:if(c<32){const char* hex="0123456789abcdef";s<<"\\u00"<<hex[c>>4]<<hex[c&15];}else s<<c;}}s<<'"';return s.str();}
std::string Bool(std::optional<bool> value){return value?(*value?"true":"false"):"null";}
class WindowsBackend final:public DisplayBackend {
 public:uint32_t Read(DisplayResult& r,DisplayDeadline deadline) override {
  if(std::chrono::steady_clock::now()>=deadline)return ERROR_TIMEOUT;
  UINT32 np=0,nm=0;LONG error=GetDisplayConfigBufferSizes(QDC_ONLY_ACTIVE_PATHS,&np,&nm);if(error!=ERROR_SUCCESS)return error;
  if(np>4096 || nm>8192)return ERROR_NOT_ENOUGH_MEMORY;
  // The API requires non-null storage even when the current estimate is zero.
  std::vector<DISPLAYCONFIG_PATH_INFO> paths(np?np:1);std::vector<DISPLAYCONFIG_MODE_INFO> modes(nm?nm:1);
  error=QueryDisplayConfig(QDC_ONLY_ACTIVE_PATHS,&np,paths.data(),&nm,modes.data(),nullptr);if(error!=ERROR_SUCCESS)return error;
  paths.resize(np);modes.resize(nm);r.osEnumeration=true;
  for(const auto& p:paths){
   if(std::chrono::steady_clock::now()>=deadline)return ERROR_TIMEOUT;
   DisplayActual a;std::ostringstream luid;luid<<p.targetInfo.adapterId.HighPart<<':'<<p.targetInfo.adapterId.LowPart;a.identity.adapterLuid=luid.str();
   a.identity.sourceId=p.sourceInfo.id;a.identity.targetId=p.targetInfo.id;a.outputTechnology=static_cast<uint32_t>(p.targetInfo.outputTechnology);
   a.refreshNumerator=p.targetInfo.refreshRate.Numerator;a.refreshDenominator=p.targetInfo.refreshRate.Denominator;
   const auto index=p.sourceInfo.modeInfoIdx;if(index<modes.size() && modes[index].infoType==DISPLAYCONFIG_MODE_INFO_TYPE_SOURCE){const auto& m=modes[index].sourceMode;a.width=m.width;a.height=m.height;a.x=m.position.x;a.y=m.position.y;}
   DISPLAYCONFIG_TARGET_DEVICE_NAME target{};target.header={DISPLAYCONFIG_DEVICE_INFO_GET_TARGET_NAME,sizeof(target),p.targetInfo.adapterId,p.targetInfo.id};
   a.identityError=DisplayConfigGetDeviceInfo(&target.header);if(a.identityError==ERROR_SUCCESS)a.identity.monitorPath=Utf8(target.monitorDevicePath);
   DISPLAYCONFIG_SOURCE_DEVICE_NAME source{};source.header={DISPLAYCONFIG_DEVICE_INFO_GET_SOURCE_NAME,sizeof(source),p.sourceInfo.adapterId,p.sourceInfo.id};
   const auto sourceError=DisplayConfigGetDeviceInfo(&source.header);if(sourceError==ERROR_SUCCESS)a.identity.deviceName=Utf8(source.viewGdiDeviceName);else if(!a.identityError)a.identityError=sourceError;
   DISPLAYCONFIG_GET_ADVANCED_COLOR_INFO color{};color.header={DISPLAYCONFIG_DEVICE_INFO_GET_ADVANCED_COLOR_INFO,sizeof(color),p.targetInfo.adapterId,p.targetInfo.id};
   a.colorError=DisplayConfigGetDeviceInfo(&color.header);if(a.colorError==ERROR_SUCCESS){a.advancedColorSupported=color.advancedColorSupported!=0;a.advancedColorEnabled=color.advancedColorEnabled!=0;}
   r.actual.push_back(a);
  }
  const auto set=SetupDiGetClassDevsW(&GUID_DEVCLASS_DISPLAY,nullptr,nullptr,DIGCF_PRESENT);if(set==INVALID_HANDLE_VALUE)return GetLastError();
  struct Guard{HDEVINFO h;~Guard(){SetupDiDestroyDeviceInfoList(h);}} guard{set};
  for(DWORD i=0;;++i){
   if(std::chrono::steady_clock::now()>=deadline)return ERROR_TIMEOUT;
   SP_DEVINFO_DATA dev{};dev.cbSize=sizeof(dev);if(!SetupDiEnumDeviceInfo(set,i,&dev)){const auto e=GetLastError();if(e==ERROR_NO_MORE_ITEMS)break;return e;}
   DisplayDevice d;wchar_t id[MAX_DEVICE_ID_LEN]{};if(!SetupDiGetDeviceInstanceIdW(set,&dev,id,MAX_DEVICE_ID_LEN,nullptr))return GetLastError();d.instanceId=Utf8(id);
   wchar_t property[2048]{};
   if(SetupDiGetDeviceRegistryPropertyW(set,&dev,SPDRP_DEVICEDESC,nullptr,reinterpret_cast<BYTE*>(property),sizeof(property),nullptr))d.description=Utf8(property);
   else if(GetLastError()!=ERROR_INVALID_DATA)return GetLastError();
   property[0]=0;if(SetupDiGetDeviceRegistryPropertyW(set,&dev,SPDRP_SERVICE,nullptr,reinterpret_cast<BYTE*>(property),sizeof(property),nullptr))d.service=Utf8(property);
   else if(GetLastError()!=ERROR_INVALID_DATA)return GetLastError();
   ULONG nodeStatus=0,problem=0;const auto cr=CM_Get_DevNode_Status(&nodeStatus,&problem,dev.DevInst,0);if(cr!=CR_SUCCESS)return CM_MapCrToWin32Err(cr,ERROR_GEN_FAILURE);d.status=nodeStatus;d.problem=problem;
   if(_stricmp(d.service.c_str(),"SudoVDA")==0 || d.description=="SudoVDA" || d.description=="SudoMaker Virtual Display Adapter")d.providerId="apollo-sudovda";
   else if(_stricmp(d.service.c_str(),"MttVDD")==0 || d.description.find("Mtt")!=std::string::npos)d.providerId="virtualdrivers-vdd";
   // Metadata is a candidate hint only; no device interface is opened or trusted.
   r.devices.push_back(d);
  }
  return ERROR_SUCCESS;
 }
};
DisplayResult Refused(){DisplayResult r;r.status="not_admitted";r.reason="No provider admitted; device operations are unavailable";return r;}
}
DisplayResult DisplayProvider::Enumerate(DisplayDeadline deadline){
 const auto start=std::chrono::steady_clock::now();DisplayResult r;
 for(uint32_t i=1;i<=3;++i){r=DisplayResult{};r.attempts=i;if(std::chrono::steady_clock::now()>=deadline){r.osError=ERROR_TIMEOUT;break;}r.osError=backend_.Read(r,deadline);if(std::chrono::steady_clock::now()>=deadline)r.osError=ERROR_TIMEOUT;if(r.osError!=ERROR_INSUFFICIENT_BUFFER)break;}
 r.status=r.osError==ERROR_SUCCESS?"ok":r.osError==ERROR_ACCESS_DENIED?"access_denied":r.osError==ERROR_TIMEOUT?"timeout":"unknown";
 r.reason=r.osError==ERROR_SUCCESS?"Read-only Windows CCD and present display-class devices; no ownership inferred":"Windows enumeration failed; partial observations are not absence";
 r.durationMs=std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now()-start).count();return r;
}
DisplayResult DisplayProvider::Probe(DisplayDeadline deadline){auto r=Enumerate(deadline);if(r.status!="ok")return r;bool known=false;for(const auto& d:r.devices)known=known||!d.providerId.empty();r.status=known?"capability_unverified":"no_known_provider_detected";r.reason=known?"Candidate device metadata observed; package/protocol/ACL/capacity/persistence not verified":"No known provider in present device metadata; unknown/disabled packages are not classified absent";return r;}
DisplayResult DisplayProvider::CreateSlot(const DisplayRequest&,DisplayDeadline){return Refused();}
DisplayResult DisplayProvider::UpdateSlot(const DisplayRequest&,const DisplayIdentity&,DisplayDeadline){return Refused();}
DisplayResult DisplayProvider::RemoveSlot(const DisplayIdentity&,DisplayDeadline){return Refused();}
DisplayResult EnumerateWindows(DisplayDeadline deadline,bool probe){WindowsBackend backend;DisplayProvider provider(backend);return probe?provider.Probe(deadline):provider.Enumerate(deadline);}
std::string ToJson(const DisplayResult& r,const std::string& logPath,const std::string& group){
 std::ostringstream s;s<<"{\"schemaVersion\":1,\"status\":"<<Escape(r.status)<<",\"reason\":"<<Escape(r.reason)<<",\"osError\":"<<r.osError<<",\"osEnumeration\":"<<(r.osEnumeration?"true":"false")<<",\"attempts\":"<<r.attempts<<",\"requested\":null,\"group\":"<<(group.empty()?"null":Escape(group))<<",\"identity\":null,\"realityDiff\":null,\"providerStatus\":\"not_admitted\",\"protocol\":null,\"watchdog\":null,\"capacity\":null,\"actual\":[";
 bool first=true;for(const auto& a:r.actual){if(!first)s<<',';first=false;s<<"{\"identity\":{\"adapterLuid\":"<<Escape(a.identity.adapterLuid)<<",\"sourceId\":"<<a.identity.sourceId<<",\"targetId\":"<<a.identity.targetId<<",\"monitorPath\":"<<Escape(a.identity.monitorPath)<<",\"deviceName\":"<<Escape(a.identity.deviceName)<<"},\"width\":"<<a.width<<",\"height\":"<<a.height<<",\"refresh\":{\"numerator\":"<<a.refreshNumerator<<",\"denominator\":"<<a.refreshDenominator<<"},\"x\":"<<a.x<<",\"y\":"<<a.y<<",\"outputTechnology\":"<<a.outputTechnology<<",\"advancedColorSupported\":"<<Bool(a.advancedColorSupported)<<",\"advancedColorEnabled\":"<<Bool(a.advancedColorEnabled)<<",\"hdrVerified\":null,\"identityError\":"<<a.identityError<<",\"colorError\":"<<a.colorError<<",\"ownedByAether\":false}";}
 s<<"],\"devices\":[";first=true;for(const auto& d:r.devices){if(!first)s<<',';first=false;s<<"{\"instanceId\":"<<Escape(d.instanceId)<<",\"description\":"<<Escape(d.description)<<",\"service\":"<<Escape(d.service)<<",\"providerHint\":"<<(d.providerId.empty()?"null":Escape(d.providerId))<<",\"devNodeStatus\":"<<d.status<<",\"problem\":"<<d.problem<<'}';}
 s<<"],\"logPath\":"<<(logPath.empty()?"null":Escape(logPath))<<",\"durationMs\":"<<r.durationMs<<'}';return s.str();
}
int RunDisplayCommand(int argc,char** argv){
 bool probe=false,json=false;int i=2;std::string group;
 if(i<argc && std::string(argv[i])=="query")++i;
 else if(i+1<argc && std::string(argv[i])=="driver" && std::string(argv[i+1])=="check"){probe=true;i+=2;}
 else {std::cerr<<"Usage: helios vdisplay query [--group NAME] [--json] | driver check [--json]\n";return 2;}
 for(;i<argc;++i){const std::string arg=argv[i];if(arg=="--json" && !json)json=true;else if(arg=="--group" && !probe && group.empty() && i+1<argc && std::string(argv[i+1]).rfind("--",0)!=0)group=argv[++i];else {std::cerr<<"Invalid display argument\n";return 2;}}
 const auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(10);
 std::promise<DisplayResult> promise;auto result=promise.get_future();
 std::thread worker([deadline,probe,p=std::move(promise)]()mutable{try{p.set_value(EnumerateWindows(deadline,probe));}catch(...){DisplayResult r;r.status="unknown";r.reason="Enumeration exception; no absence inferred";p.set_value(r);}});
 DisplayResult r;bool timedOut=result.wait_until(deadline)!=std::future_status::ready;
 if(timedOut){r.status="timeout";r.reason="10s read-only command deadline exceeded";r.osError=ERROR_TIMEOUT;r.durationMs=10000;worker.detach();}
 else {r=result.get();worker.join();}
 if(!group.empty() && r.status=="ok"){r.status="not_found";r.reason="No admitted provider/group registry; observed displays cannot be attributed to this name";}
 std::string log;try{const auto directory=std::filesystem::current_path()/"artifacts"/"phase03"/"probe";std::filesystem::create_directories(directory);log=(directory/(std::to_string(GetCurrentProcessId())+".json")).string();std::ofstream file(log);file<<ToJson(r,log,group)<<'\n';if(!file)throw std::runtime_error("log");}catch(...){log.clear();r.status="log_error";r.reason+="; could not persist detailed log";}
 if(json)std::cout<<ToJson(r,log,group)<<std::endl;else std::cout<<"vdisplay status="<<r.status<<" displays="<<r.actual.size()<<" provider=not_admitted duration_ms="<<r.durationMs<<"\n"<<r.reason<<"\nlog="<<log<<std::endl;
 const int code=r.status=="ok"?0:1;if(timedOut)ExitProcess(static_cast<UINT>(code));return code;
}
}
