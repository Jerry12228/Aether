#include "display_registry.h"
#include <charconv>
#include <iostream>
namespace aether::vdisplay {
int RunProbeCommand(int,char**);
namespace {
uint32_t Number(const std::string& s,uint32_t limit){uint32_t n=0;const auto r=std::from_chars(s.data(),s.data()+s.size(),n);if(s.empty()||r.ec!=std::errc{}||r.ptr!=s.data()+s.size()||n==0||n>limit)throw DisplayError("invalid-argument","Invalid or overflowing numeric value");return n;}
DisplayRequest Slot(const std::string& s){DisplayRequest r;auto equal=s.find('='),x=s.find('x'),at=s.find('@'),slash=s.find('/'),color=s.find(':');if(equal==std::string::npos||x==std::string::npos||at==std::string::npos||slash==std::string::npos||color==std::string::npos||!(equal<x&&x<at&&at<slash&&slash<color))throw DisplayError("invalid-argument","Expected SLOT=WIDTHxHEIGHT@NUM/DEN:SDR|HDR");r.slot=Number(s.substr(0,equal),10);r.width=Number(s.substr(equal+1,x-equal-1),8192);r.height=Number(s.substr(x+1,at-x-1),8192);r.refreshNumerator=Number(s.substr(at+1,slash-at-1),UINT32_MAX);r.refreshDenominator=Number(s.substr(slash+1,color-slash-1),UINT32_MAX);if(!ExactRefresh(r.refreshNumerator,r.refreshDenominator))throw DisplayError("unsupported","Exact 60/1 refresh required; no downgrade");auto c=s.substr(color+1);if(c!="SDR"&&c!="HDR")throw DisplayError("invalid-argument","Expected SDR or HDR");r.hdr=c=="HDR";return r;}
}
int RunDisplayCommand(int argc,char** argv){
 if(argc>2&&std::string(argv[2])=="driver")return RunProbeCommand(argc,argv);
 DisplayOptions o;try{
  if(argc<3)throw DisplayError("invalid-argument","Display command missing");o.command=argv[2];if(o.command!="create"&&o.command!="query"&&o.command!="delete"&&o.command!="update"&&o.command!="recover"&&o.command!="test-pattern")throw DisplayError("invalid-argument","Unknown display command");int i=3;if(o.command!="query"){if(i>=argc)throw DisplayError("invalid-argument","Group name required");o.name=argv[i++];}
  for(;i<argc;++i){std::string a=argv[i];if(a=="--json"&&!o.json)o.json=true;else if(a=="--group"&&o.command=="query"&&o.name.empty()&&i+1<argc)o.name=argv[++i];else if(a=="--slot"&&(o.command=="create"||o.command=="update")&&i+1<argc){auto s=Slot(argv[++i]);for(const auto& r:o.requests)if(r.slot==s.slot)throw DisplayError("invalid-argument","Duplicate slot index");o.requests.push_back(s);}
#ifdef AETHER_ENABLE_TEST_HOOKS
   else if(a=="--test-provider"&&!o.test)o.test=true;else if(a=="--test-root"&&o.testRoot.empty()&&i+1<argc)o.testRoot=argv[++i];else if(a=="--fault"&&o.fault.empty()&&i+1<argc)o.fault=argv[++i];
#endif
   else throw DisplayError("invalid-argument","Unknown or duplicate argument");
  }
  if(!o.name.empty()&&!ValidDisplayName(o.name))throw DisplayError("invalid-argument","Group name must contain 1-64 ASCII letters, digits, underscore or hyphen");
  if(o.test!=!o.testRoot.empty()||(!o.fault.empty()&&!o.test))throw DisplayError("invalid-argument","Test arguments require isolated provider and root");
  return RunRegistryCommand(o);
 }catch(const DisplayError& e){if(o.json)std::cout<<Json(Json::Object{{"schemaVersion",1},{"status",e.status},{"reason",e.what()}}).dump()<<std::endl;else std::cerr<<e.what()<<std::endl;return 2;}
}
}
