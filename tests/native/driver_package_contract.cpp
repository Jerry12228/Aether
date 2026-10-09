#include "driver_package.h"
#include "helios_display_pin.h"
#include <iostream>
using namespace aether::vdisplay;
using O=Json::Object;using A=Json::Array;
class ContractPackage final:public DriverPackageBackend{
public:
 std::string fault;int installs=0,backups=0,rollbacks=0;bool ready=false;Json state;
 explicit ContractPackage(std::string f):fault(std::move(f)),state(O{{"machineId","contract-machine"},{"osBuild",26100},{"installedVersion",nullptr},{"ownedDevices",A{}},{"foreignDevices",A{O{{"instanceId","foreign-keep"}}}},{"oldPackage",nullptr},{"privatePaths",A{}},{"topology",O{{"actual",A{}}}}}){
  if(fault=="version"||fault=="update"||fault=="groups"||fault=="maintenance"||fault=="rollback"||fault=="rollback-fails"||fault=="same-version"){state["installedVersion"]=fault=="same-version"?"0.1.0.0":"0.0.9.0";state["ownedDevices"]=A{O{{"instanceId","private-contract"}}};state["oldPackage"]=O{{"inf","old verified package"}};ready=fault=="same-version";}
 }
 Json Inspect()override{if(fault=="unknown-private")state["privatePaths"]=A{"foreign-private-monitor"};return state;}
 Json Verify()override{if(fault=="signature"||fault=="truncated"||fault=="traversal"||fault=="reparse")throw DisplayError("package-invalid","Contract verification rejected "+fault);return O{{"status","verified"},{"sha256",fault=="hash"?std::string(64,'f'):kHeliosPackageSha},{"version",fault=="package-version"?"9.9.9.9":"0.1.0.0"},{"architecture",fault=="arch"?"arm64":"x64"}};}
 void Backup(const Json&)override{++backups;}
 Json Install(const Json&)override{++installs;if(fault=="rollback"||fault=="rollback-fails")throw DisplayError("failed","Known install failure");if(fault=="timeout")throw DisplayError("timeout","Unknown install effects",true);ready=true;return O{{"status",fault=="reboot"?"reboot-required":"installed"},{"rebootRequired",fault=="reboot"}};}
 Json Rollback(const Json&)override{++rollbacks;if(fault=="rollback-fails")throw DisplayError("failed","Rollback failed",true);return O{{"status","rolled-back"},{"rebootRequired",false}};}
 bool Ready()override{return ready;}
};
int main(int argc,char** argv){if(argc!=2)return 2;ContractPackage backend(argv[1]);Json journal=nullptr;int writes=0;DriverStore store{std::filesystem::temp_directory_path(),O{{"ownerSid","contract-owner"},{"loginAuthLuid","contract-login"},{"desktop","Default"}},O{{"groups",A{}},{"pending",nullptr}},nullptr,nullptr,[&](const std::string& name,const Json& j){if(name=="driver-install.v1.json")journal=j;++writes;}};
 auto& fault=backend.fault;if(fault=="groups"||fault=="maintenance")store.registry["groups"]=A{O{{"groupName","A"},{"lastSuccess","preserved"}}};const auto before=store.registry.dump();InstallOptions options;options.update=fault=="update"||fault=="groups"||fault=="maintenance"||fault=="rollback"||fault=="rollback-fails";options.plan=fault=="plan";
 Json result;
 try{auto plan=PlanDriverInstall(options,store,backend);options.approval=plan.at("planSha256").str();store.authorization=O{{"status","authorized"},{"providerId","aether-helios-display"},{"packageSha256",kHeliosPackageSha},{"machineId","contract-machine"},{"approvedPlanHash",options.approval},{"identity",store.identity},{"commands",A{"driver-install","driver-update"}},{"userText","contract approval only"},{"recordedAt","2026-10-09T09:00:00Z"},{"elevated",fault!="denied"}};
 if(fault=="missing-auth")store.authorization=nullptr;if(fault=="stale")options.approval=std::string(64,'a');if(fault=="machine")store.authorization["machineId"]="other-machine";if(fault=="maintenance")store.authorization["maintenancePlan"]=O{{"groupsHash",plan.at("maintenance").at("groupsHash")},{"allowSharedInterruption",true},{"explicitRecovery",true}};
 result=ExecuteDriverInstall(options,store,backend);
 }catch(const DisplayError& e){result=O{{"status",e.status},{"reason",e.what()},{"uncertain",e.uncertain}};}catch(const std::exception& e){result=O{{"status","failed"},{"reason",e.what()}};}
 result["installs"]=backend.installs;result["backups"]=backend.backups;result["rollbacks"]=backend.rollbacks;result["writes"]=writes;result["journal"]=journal;result["registryPreserved"]=before==store.registry.dump();result["evidenceScope"]="contract";std::cout<<result.dump()<<std::endl;return 0;
}
