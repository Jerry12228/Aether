#include "display_registry.h"
#include <windows.h>
#include <aclapi.h>
#include <sddl.h>
#include <shlobj.h>
#include <objbase.h>
#include <algorithm>
#include <iostream>
#include <numeric>
#include <set>
#include <thread>
namespace aether::vdisplay {
namespace {
using O=Json::Object;using A=Json::Array;
struct Handle{HANDLE h=INVALID_HANDLE_VALUE;Handle()=default;explicit Handle(HANDLE v):h(v){}~Handle(){if(h&&h!=INVALID_HANDLE_VALUE)CloseHandle(h);}Handle(const Handle&)=delete;};
std::wstring Wide(const std::string& s){if(s.empty())return {};int n=MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.data(),static_cast<int>(s.size()),nullptr,0);if(n<=0)throw DisplayError("invalid-argument","Invalid UTF-8");std::wstring w(n,0);MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.data(),static_cast<int>(s.size()),w.data(),n);return w;}
std::string Narrow(const std::wstring& w){int n=WideCharToMultiByte(CP_UTF8,WC_ERR_INVALID_CHARS,w.data(),static_cast<int>(w.size()),nullptr,0,nullptr,nullptr);if(n<=0)throw DisplayError("access-denied","Invalid Windows identity");std::string s(n,0);WideCharToMultiByte(CP_UTF8,WC_ERR_INVALID_CHARS,w.data(),static_cast<int>(w.size()),s.data(),n,nullptr,nullptr);return s;}
void Budget(DisplayDeadline d){if(std::chrono::steady_clock::now()>=d)throw DisplayError("timeout","Total 10s command deadline exceeded",true);}
std::string Guid(){GUID g{};if(FAILED(CoCreateGuid(&g)))throw DisplayError("failed","GUID allocation failed");wchar_t s[40]{};StringFromGUID2(g,s,40);return Narrow(s);}
std::string Normalize(std::string s){for(auto& c:s)if(c>='a'&&c<='z')c=static_cast<char>(c-'a'+'A');return s;}
std::string DesktopName(HDESK desk){wchar_t s[256]{};DWORD n=0;if(!GetUserObjectInformationW(desk,UOI_NAME,s,sizeof(s),&n))throw DisplayError("access-denied","Cannot validate desktop");return Narrow(s);}
struct Caller{
 std::vector<BYTE> tokenUser;std::string sid,auth,desktop;PSECURITY_DESCRIPTOR security=nullptr;SECURITY_ATTRIBUTES sa{};
 Caller(){
  Handle token;if(!OpenProcessToken(GetCurrentProcess(),TOKEN_QUERY,&token.h))throw DisplayError("access-denied","No process token");DWORD n=0;GetTokenInformation(token.h,TokenUser,nullptr,0,&n);tokenUser.resize(n);if(!n||!GetTokenInformation(token.h,TokenUser,tokenUser.data(),n,&n))throw DisplayError("access-denied","No token user");
  LPWSTR text=nullptr;if(!ConvertSidToStringSidW(reinterpret_cast<TOKEN_USER*>(tokenUser.data())->User.Sid,&text))throw DisplayError("access-denied","Invalid token SID");sid=Narrow(text);LocalFree(text);
  TOKEN_STATISTICS stats{};DWORD session=0;if(!GetTokenInformation(token.h,TokenStatistics,&stats,sizeof(stats),&n)||!GetTokenInformation(token.h,TokenSessionId,&session,sizeof(session),&n)||session==0||session!=WTSGetActiveConsoleSessionId())throw DisplayError("access-denied","Current interactive console user required; Session0/remote observers refused");
  auth=std::to_string(stats.AuthenticationId.HighPart)+":"+std::to_string(stats.AuthenticationId.LowPart);desktop=DesktopName(GetThreadDesktop(GetCurrentThreadId()));
  HDESK input=OpenInputDesktop(0,FALSE,DESKTOP_READOBJECTS);if(!input)throw DisplayError("access-denied","Input desktop inaccessible");auto inputName=DesktopName(input);CloseDesktop(input);if(desktop!="Default"||inputName!=desktop)throw DisplayError("access-denied","Default interactive desktop required");
  const auto dacl=Wide("O:"+sid+"D:P(A;;GA;;;"+sid+")(A;;GA;;;SY)");if(!ConvertStringSecurityDescriptorToSecurityDescriptorW(dacl.c_str(),SDDL_REVISION_1,&security,nullptr))throw DisplayError("access-denied","Cannot construct owner ACL");sa={sizeof(sa),security,FALSE};
 }
 ~Caller(){if(security)LocalFree(security);}
 PSID user()const{return reinterpret_cast<const TOKEN_USER*>(tokenUser.data())->User.Sid;}
 void Validate(HANDLE handle,SE_OBJECT_TYPE type=SE_FILE_OBJECT)const{
  PSID owner=nullptr;PACL acl=nullptr;PSECURITY_DESCRIPTOR descriptor=nullptr;
  if(GetSecurityInfo(handle,type,OWNER_SECURITY_INFORMATION|DACL_SECURITY_INFORMATION,&owner,nullptr,&acl,nullptr,&descriptor)!=ERROR_SUCCESS)throw DisplayError("access-denied","Cannot read owner ACL");
  struct Free{void* p;~Free(){LocalFree(p);}}free{descriptor};
  if(!owner||!EqualSid(owner,user())||!acl)throw DisplayError("access-denied","Foreign owner or null DACL");
  SECURITY_DESCRIPTOR_CONTROL control{};DWORD revision=0;if(!GetSecurityDescriptorControl(descriptor,&control,&revision)||!(control&SE_DACL_PROTECTED))throw DisplayError("access-denied","Owner DACL must be protected");
  BYTE system[SECURITY_MAX_SID_SIZE]{};DWORD size=sizeof(system);CreateWellKnownSid(WinLocalSystemSid,nullptr,system,&size);bool hasOwner=false;
  for(DWORD i=0;i<acl->AceCount;++i){void* ptr=nullptr;if(!GetAce(acl,i,&ptr))throw DisplayError("access-denied","Invalid DACL");const auto* ace=static_cast<ACCESS_ALLOWED_ACE*>(ptr);if(ace->Header.AceType!=ACCESS_ALLOWED_ACE_TYPE||(!EqualSid(const_cast<DWORD*>(&ace->SidStart),user())&&!EqualSid(const_cast<DWORD*>(&ace->SidStart),system)))throw DisplayError("access-denied","Foreign ACL entry");hasOwner=hasOwner||EqualSid(const_cast<DWORD*>(&ace->SidStart),user());}if(!hasOwner)throw DisplayError("access-denied","Missing owner ACE");
 }
};
void NoReparse(const std::filesystem::path& path){auto p=std::filesystem::absolute(path).lexically_normal();for(auto it=p;!it.empty();){const auto attrs=GetFileAttributesW(it.c_str());if(attrs!=INVALID_FILE_ATTRIBUTES&&(attrs&FILE_ATTRIBUTE_REPARSE_POINT))throw DisplayError("access-denied","Reparse point path refused");auto parent=it.parent_path();if(parent==it)break;it=parent;}}
struct Store{
 Caller& caller;std::filesystem::path root;Handle directory,mutex;bool locked=false;
 Store(Caller& c,const DisplayOptions& options,DisplayDeadline deadline):caller(c){
  if(options.test){
#ifdef AETHER_ENABLE_TEST_HOOKS
   root=std::filesystem::absolute(options.testRoot).lexically_normal();NoReparse(root);if(!std::filesystem::is_directory(root))throw DisplayError("access-denied","Existing isolated test root required");
   // Test roots are made by the test runner. Adopt only a directory already
   // owned by this exact token user; never chmod an arbitrary foreign path.
   PSID owner=nullptr;PSECURITY_DESCRIPTOR sd=nullptr;if(GetNamedSecurityInfoW(root.c_str(),SE_FILE_OBJECT,OWNER_SECURITY_INFORMATION,&owner,nullptr,nullptr,nullptr,&sd)!=ERROR_SUCCESS)throw DisplayError("access-denied","Cannot inspect test root");bool own=owner&&EqualSid(owner,c.user());LocalFree(sd);if(!own)throw DisplayError("access-denied","Foreign test root");PACL acl=nullptr;BOOL present=FALSE,def=FALSE;GetSecurityDescriptorDacl(c.security,&present,&acl,&def);if(SetNamedSecurityInfoW(const_cast<wchar_t*>(root.c_str()),SE_FILE_OBJECT,DACL_SECURITY_INFORMATION|PROTECTED_DACL_SECURITY_INFORMATION,nullptr,nullptr,acl,nullptr)!=ERROR_SUCCESS)throw DisplayError("access-denied","Cannot secure test root");
#else
   throw DisplayError("invalid-argument","Test provider absent from product");
#endif
  }else{
   PWSTR local=nullptr;if(FAILED(SHGetKnownFolderPath(FOLDERID_LocalAppData,KF_FLAG_DEFAULT,nullptr,&local)))throw DisplayError("access-denied","LocalAppData unavailable");root=local;CoTaskMemFree(local);NoReparse(root);
   for(const auto* part:{L"Aether",L"phase03"}){root/=part;if(!CreateDirectoryW(root.c_str(),&c.sa)&&GetLastError()!=ERROR_ALREADY_EXISTS)throw DisplayError("access-denied","Cannot create private registry directory");Handle h(CreateFileW(root.c_str(),READ_CONTROL,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,nullptr,OPEN_EXISTING,FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT,nullptr));if(h.h==INVALID_HANDLE_VALUE)throw DisplayError("access-denied","Cannot open registry directory");NoReparse(root);c.Validate(h.h);}
  }
  directory.h=CreateFileW(root.c_str(),READ_CONTROL,FILE_SHARE_READ|FILE_SHARE_WRITE,nullptr,OPEN_EXISTING,FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT,nullptr);if(directory.h==INVALID_HANDLE_VALUE)throw DisplayError("access-denied","Cannot pin registry directory");c.Validate(directory.h);
  const auto name=Wide("Local\\Aether-Display-"+c.sid+"-"+std::to_string(std::hash<std::wstring>{}(root.native())));mutex.h=CreateMutexW(&c.sa,FALSE,name.c_str());if(!mutex.h)throw DisplayError("access-denied","Cannot create owner mutex");c.Validate(mutex.h,SE_KERNEL_OBJECT);
  Budget(deadline);const auto ms=std::min<int64_t>(2000,std::chrono::duration_cast<std::chrono::milliseconds>(deadline-std::chrono::steady_clock::now()).count());DWORD waited=WaitForSingleObject(mutex.h,static_cast<DWORD>(std::max<int64_t>(0,ms)));if(waited!=WAIT_OBJECT_0&&waited!=WAIT_ABANDONED)throw DisplayError("timeout","Owner mutex wait exceeded 2s");locked=true;
 }
 ~Store(){if(locked)ReleaseMutex(mutex.h);}
 void CheckFile(HANDLE h)const{BY_HANDLE_FILE_INFORMATION info{};if(!GetFileInformationByHandle(h,&info)||info.nNumberOfLinks!=1||(info.dwFileAttributes&FILE_ATTRIBUTE_REPARSE_POINT))throw DisplayError("access-denied","Linked/reparse registry file refused");caller.Validate(h);}
 Json Read(const std::string& name,Json fallback){const auto file=root/Wide(name);Handle h(CreateFileW(file.c_str(),GENERIC_READ|READ_CONTROL,FILE_SHARE_READ,nullptr,OPEN_EXISTING,FILE_FLAG_OPEN_REPARSE_POINT,nullptr));if(h.h==INVALID_HANDLE_VALUE){if(GetLastError()==ERROR_FILE_NOT_FOUND)return fallback;throw DisplayError("access-denied","Cannot read private registry");}CheckFile(h.h);LARGE_INTEGER size{};if(!GetFileSizeEx(h.h,&size)||size.QuadPart<0||size.QuadPart>2*1024*1024)throw DisplayError("identity-conflict","Registry size invalid");std::string bytes(static_cast<size_t>(size.QuadPart),0);DWORD got=0;if(!ReadFile(h.h,bytes.data(),static_cast<DWORD>(bytes.size()),&got,nullptr)||got!=bytes.size())throw DisplayError("failed","Registry read failed");Wide(bytes);try{return Json::parse(bytes);}catch(...){throw DisplayError("identity-conflict","Invalid registry JSON; no mutation performed");}}
 void Save(const std::string& name,const Json& value){const auto target=root/Wide(name);auto existing=Read(name,nullptr);(void)existing;const auto temp=root/Wide(name+"."+Guid()+".tmp");Handle h(CreateFileW(temp.c_str(),GENERIC_WRITE|READ_CONTROL,0,&caller.sa,CREATE_NEW,FILE_ATTRIBUTE_NORMAL|FILE_FLAG_OPEN_REPARSE_POINT,nullptr));if(h.h==INVALID_HANDLE_VALUE)throw DisplayError("failed","Atomic temporary file failed");CheckFile(h.h);const auto bytes=value.dump();DWORD n=0;if(!WriteFile(h.h,bytes.data(),static_cast<DWORD>(bytes.size()),&n,nullptr)||n!=bytes.size()||!FlushFileBuffers(h.h))throw DisplayError("failed","Journal flush failed");CloseHandle(h.h);h.h=INVALID_HANDLE_VALUE;if(!MoveFileExW(temp.c_str(),target.c_str(),MOVEFILE_REPLACE_EXISTING|MOVEFILE_WRITE_THROUGH)){DeleteFileW(temp.c_str());throw DisplayError("failed","Atomic registry replacement failed");}}
};
#ifdef AETHER_ENABLE_TEST_HOOKS
class ContractBackend final:public MutationBackend{
 Store& store_;std::string fault_;int createCount_=0;
 Json State(){return store_.Read("contract-backend.v1.json",O{{"slots",A{}},{"foreign",A{}}});}
 public:ContractBackend(Store& s,std::string f):store_(s),fault_(std::move(f)){}
 Json Snapshot(DisplayDeadline d)override{Budget(d);return State();}
 void Validate(const Json& slots,const Json& reality,DisplayDeadline d)override{Budget(d);if(slots.array().size()+reality.at("slots").array().size()>10)throw DisplayError("unsupported","Provider capacity 10 exceeded");}
 Json Create(const Json& slot,DisplayDeadline d)override{
  Budget(d);++createCount_;if(fault_=="create:"+std::to_string(createCount_))throw DisplayError("failed","Injected per-slot create failure");auto state=State();for(const auto& s:state.at("slots").array())if(s.at("nativeId").str()==slot.at("nativeId").str())return s;
  auto s=slot;s["systemIdentity"]=O{{"containerId",slot.at("nativeId")},{"pnpId","CONTRACT\\"+slot.at("nativeId").str()},{"adapterLuid","contract:1"},{"targetId",static_cast<unsigned>(state.at("slots").array().size()+1)},{"gdiPath","contract-target"}};s["actual"]=s.at("requested");state["slots"].array().push_back(s);store_.Save("contract-backend.v1.json",state);
  if(fault_=="crash:"+std::to_string(createCount_))ExitProcess(86);if(fault_=="timeout:"+std::to_string(createCount_))throw DisplayError("timeout","Injected uncertain create timeout",true);return s;
 }
 void Remove(const Json& slot,DisplayDeadline d)override{Budget(d);if(fault_=="remove")throw DisplayError("failed","Injected remove failure");auto state=State();auto& slots=state["slots"].array();auto it=std::find_if(slots.begin(),slots.end(),[&](const Json& s){return s.at("nativeId").str()==slot.at("nativeId").str();});if(it==slots.end())return;if(it->at("ownerSid").str()!=slot.at("ownerSid").str()||it->at("slotId").str()!=slot.at("slotId").str())throw DisplayError("identity-conflict","Foreign slot refused");slots.erase(it);store_.Save("contract-backend.v1.json",state);}
 void Apply(const Json& slots,const Json&,DisplayDeadline d)override{Budget(d);auto state=State();for(const auto& proposed:slots.array())for(auto& s:state["slots"].array())if(s.at("nativeId").str()==proposed.at("nativeId").str()){s["requested"]=proposed.at("requested");s["actual"]=proposed.at("requested");}store_.Save("contract-backend.v1.json",state);}
};
#endif
Json FindActual(const Json& state,const Json& slot){Json found=nullptr;for(const auto& s:state.at("slots").array())if(s.at("nativeId").str()==slot.at("nativeId").str()){if(!found.null()||s.at("ownerSid").str()!=slot.at("ownerSid").str())throw DisplayError("identity-conflict","Ambiguous or foreign native identity");found=s;}return found;}
bool ModeEqual(const Json& a,const Json& b){if(a.null()||b.null())return false;for(const auto* k:{"width","height","x","y","hdr"})if(a.at(k).dump()!=b.at(k).dump())return false;const auto n=a.at("refreshNumerator").number(),d=a.at("refreshDenominator").number();return n>0&&d>0&&n<=UINT32_MAX&&d<=UINT32_MAX&&ExactRefresh(static_cast<uint32_t>(n),static_cast<uint32_t>(d))&&ExactRefresh(static_cast<uint32_t>(b.at("refreshNumerator").number()),static_cast<uint32_t>(b.at("refreshDenominator").number()));}
void ValidateRegistry(const Json& registry,const Caller& c){if(registry.at("schemaVersion").number()!=1)throw DisplayError("version-mismatch","Registry schema unsupported");if(registry.at("ownerSid").str()!=c.sid||registry.at("loginAuthLuid").str()!=c.auth||registry.at("desktop").str()!=c.desktop)throw DisplayError("access-denied","Registry owner/login/desktop mismatch");if(registry.at("groups").array().size()>64)throw DisplayError("identity-conflict","Group count invalid");std::set<std::string> names,ids;for(const auto& g:registry.at("groups").array()){auto name=g.at("groupName").str();if(!ValidDisplayName(name)||name!=Normalize(name)||!names.insert(name).second||!ids.insert(g.at("groupId").str()).second)throw DisplayError("identity-conflict","Duplicate or invalid registered group");if(g.at("slots").array().empty()||g.at("slots").array().size()>10)throw DisplayError("identity-conflict","Invalid slot count");for(const auto& s:g.at("slots").array()){if(s.at("ownerSid").str()!=c.sid||!ids.insert(s.at("nativeId").str()).second||!ids.insert(s.at("slotId").str()).second)throw DisplayError("identity-conflict","Duplicate or foreign slot identity");const auto& r=s.at("requested");if(r.at("width").number()<1||r.at("width").number()>8192||r.at("height").number()<1||r.at("height").number()>8192||!ExactRefresh(static_cast<uint32_t>(r.at("refreshNumerator").number()),static_cast<uint32_t>(r.at("refreshDenominator").number())))throw DisplayError("identity-conflict","Invalid registered mode");}}}
Json Reply(Json registry,const Json& reality,const std::string& status,const std::string& reason,bool contract,const std::string& name){
 A groups,diffs;for(auto g:registry.at("groups").array()){if(!name.empty()&&g.at("groupName").str()!=name)continue;for(auto& slot:g["slots"].array()){auto actual=FindActual(reality,slot);slot["actual"]=actual.null()?Json(nullptr):actual.at("actual");if(actual.null()||!ModeEqual(actual.at("actual"),slot.at("lastSuccess")))diffs.push_back(O{{"groupId",g.at("groupId")},{"slotId",slot.at("slotId")},{"status",actual.null()?"missing":"mode-diff"}});}groups.push_back(g);}
 registry["groups"]=groups;registry["status"]=status;registry["reason"]=reason;registry["evidenceScope"]=contract?"contract":"machine-observation";registry["providerId"]="aether-helios-display";registry["realityDiff"]=diffs;registry["backendSlotCount"]=static_cast<unsigned>(reality.at("slots").array().size());registry["sharedDesktop"]=true;registry["osEnumeration"]=!contract;registry["actual"]=contract?reality.at("slots"):reality.at("observed");registry["logPath"]=nullptr;return registry;
}
}
bool ExactRefresh(uint32_t n,uint32_t d){return d>0&&n>0&&static_cast<uint64_t>(d)*60==n;}
bool ValidDisplayName(const std::string& name){if(name.empty()||name.size()>64)return false;for(unsigned char c:name)if(!((c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='_'||c=='-'))return false;return true;}
bool IsWindows11(){using Fn=LONG(WINAPI*)(OSVERSIONINFOW*);auto fn=reinterpret_cast<Fn>(GetProcAddress(GetModuleHandleW(L"ntdll.dll"),"RtlGetVersion"));OSVERSIONINFOW os{sizeof(os)};return fn&&fn(&os)==0&&os.dwBuildNumber>=22000;}
Json DefaultRequests(const std::string& name,bool){A a;if(name=="A")a={O{{"slot",1},{"width",1920},{"height",1080},{"refreshNumerator",60},{"refreshDenominator",1},{"hdr",false},{"x",0},{"y",0}},O{{"slot",2},{"width",2560},{"height",1440},{"refreshNumerator",60},{"refreshDenominator",1},{"hdr",false},{"x",1920},{"y",0}}};else if(name=="B")a={O{{"slot",1},{"width",1920},{"height",1080},{"refreshNumerator",60},{"refreshDenominator",1},{"hdr",false},{"x",0},{"y",1440}}};return a;}
int RunRegistryCommand(const DisplayOptions& options){
 Handle deadlineEvent;deadlineEvent.h=CreateEventW(nullptr,TRUE,FALSE,nullptr);if(!deadlineEvent.h)return 1;std::thread watcher([h=deadlineEvent.h]{if(WaitForSingleObject(h,10000)==WAIT_TIMEOUT){std::cout<<"{\"status\":\"timeout\",\"reason\":\"Total command deadline exceeded; any pending journal retained\"}"<<std::endl;ExitProcess(124);}});struct StopWatch{HANDLE h;std::thread& t;~StopWatch(){SetEvent(h);t.join();}}stopWatch{deadlineEvent.h,watcher};
 const auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(10);Json output=O{{"schemaVersion",1},{"status","failed"},{"reason","Unknown registry error"}};int code=1;
 try{
  Caller caller;Store store(caller,options,deadline);Json registry=store.Read("display-registry.v1.json",O{{"schemaVersion",1},{"ownerSid",caller.sid},{"loginAuthLuid",caller.auth},{"desktop",caller.desktop},{"groups",A{}},{"pending",nullptr}});ValidateRegistry(registry,caller);
  std::unique_ptr<MutationBackend> backend;
#ifdef AETHER_ENABLE_TEST_HOOKS
  if(options.test)backend=std::make_unique<ContractBackend>(store,options.fault);else
#endif
  backend=WindowsMutationBackend();
  const auto name=Normalize(options.name);auto reality=backend->Snapshot(deadline);
  auto& groups=registry["groups"].array();auto it=std::find_if(groups.begin(),groups.end(),[&](const Json& g){return g.at("groupName").str()==name;});
  if(options.command=="query"){output=Reply(registry,reality,"ok","Read-only reality comparison; no recovery",options.test,name);code=0;}
  else {
   if(!options.test){const auto auth=store.Read("machine-authorization.v1.json",nullptr);if(auth.null()||auth.at("status").str()!="authorized"||auth.at("providerId").str()!="aether-helios-display"||auth.at("ownerSid").str()!=caller.sid||auth.at("loginAuthLuid").str()!=caller.auth)throw DisplayError("system-authorization-required","03-03 concrete fixed-package system authorization required");}
   if(!registry.at("pending").null())throw DisplayError("pending-recovery","Pending transaction requires explicit named recovery");
   if(options.command=="create"&&it!=groups.end())throw DisplayError("already-exists","Normalized group name already exists");
   if(options.command!="create"&&it==groups.end())throw DisplayError("not-found","Named group does not exist");
   if(options.command!="create"&&options.command!="delete")throw DisplayError("unsupported","Command requires expansion contract");
   Json proposed=options.command=="create"?Json(O{{"groupName",name},{"groupId",Guid()},{"slots",A{}}}):*it;
   if(options.command=="create"){
    Json requests=DefaultRequests(name,IsWindows11());if(!options.requests.empty()){A a;for(const auto& r:options.requests)a.push_back(O{{"slot",r.slot},{"width",r.width},{"height",r.height},{"refreshNumerator",r.refreshNumerator},{"refreshDenominator",r.refreshDenominator},{"hdr",r.hdr},{"x",0},{"y",0}});requests=a;}if(requests.array().empty())throw DisplayError("invalid-argument","Other group names require explicit slots");
    for(const auto& r:requests.array())proposed["slots"].array().push_back(O{{"slot",r.at("slot")},{"slotId",Guid()},{"nativeId",Guid()},{"ownerSid",caller.sid},{"systemIdentity",nullptr},{"requested",r},{"actual",nullptr},{"lastSuccess",nullptr}});
    backend->Validate(proposed.at("slots"),reality,deadline);
   }
   const Json previous=registry;registry["pending"]=O{{"operationId",Guid()},{"groupName",name},{"kind",options.command},{"stage","prepared"},{"proposed",proposed},{"ownedCreated",A{}},{"previous",previous.at("groups")},{"unresolvedEffects",false}};store.Save("display-registry.v1.json",registry);A created;
   try{
    if(options.command=="create"){
     for(auto& slot:proposed["slots"].array()){registry["pending"]["stage"]="creating";store.Save("display-registry.v1.json",registry);slot=backend->Create(slot,deadline);created.push_back(slot);registry["pending"]["ownedCreated"]=created;store.Save("display-registry.v1.json",registry);}
     backend->Apply(proposed.at("slots"),reality,deadline);auto now=backend->Snapshot(deadline);for(auto& s:proposed["slots"].array()){auto a=FindActual(now,s);if(a.null()||!ModeEqual(a.at("actual"),s.at("requested")))throw DisplayError("unsupported","Actual mode does not exactly satisfy request");s["actual"]=a.at("actual");s["lastSuccess"]=a.at("actual");}registry["groups"].array().push_back(proposed);
    }else{for(const auto& slot:proposed.at("slots").array())backend->Remove(slot,deadline);auto& rows=registry["groups"].array();rows.erase(std::remove_if(rows.begin(),rows.end(),[&](const Json& g){return g.at("groupName").str()==name;}),rows.end());}
    registry["pending"]=nullptr;
#ifdef AETHER_ENABLE_TEST_HOOKS
    if(options.fault=="commit")throw DisplayError("failed","Injected last-success commit failure");
#endif
    store.Save("display-registry.v1.json",registry);reality=backend->Snapshot(deadline);output=Reply(registry,reality,"ok","Committed exact group transaction",options.test,"");code=0;
   }catch(const DisplayError& e){
    bool unresolved=e.uncertain||options.command=="delete";if(!unresolved){for(auto c=created.rbegin();c!=created.rend();++c){try{backend->Remove(*c,deadline);}catch(...){unresolved=true;}}}
    registry=previous;if(unresolved){registry["pending"]=store.Read("display-registry.v1.json",nullptr).at("pending");registry["pending"]["unresolvedEffects"]=true;}store.Save("display-registry.v1.json",registry);output=Reply(registry,backend->Snapshot(deadline),unresolved?"pending-recovery":e.status,e.what(),options.test,"");
   }
  }
 }catch(const DisplayError& e){output=O{{"schemaVersion",1},{"status",e.status},{"reason",e.what()},{"evidenceScope",options.test?"contract":"machine-observation"}};}catch(const std::exception&){output=O{{"schemaVersion",1},{"status","identity-conflict"},{"reason","Invalid registry structure; pending journal retained"}};}
 if(options.json)std::cout<<output.dump()<<std::endl;else std::cout<<"vdisplay status="<<output.at("status").str()<<"\n"<<output.at("reason").str()<<std::endl;return code;
}
}
