#pragma once
#include "display_registry.h"
namespace aether::vdisplay {
struct InstallOptions{bool update=false,plan=false;std::string approval;};
class DriverPackageBackend {
public:
 virtual ~DriverPackageBackend()=default;
 virtual Json Inspect()=0;
 virtual Json Verify()=0;
 virtual void Backup(const Json&)=0;
 virtual Json Install(const Json&)=0;
 virtual Json Rollback(const Json&)=0;
 virtual bool Ready()=0;
};
Json PlanDriverInstall(const InstallOptions&,DriverStore&,DriverPackageBackend&);
Json ExecuteDriverInstall(const InstallOptions&,DriverStore&,DriverPackageBackend&);
std::string DriverHash(const std::string&);
int RunDriverPackageCommand(int,char**);
}
