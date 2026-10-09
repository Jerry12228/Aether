#pragma once
#include "display_json.h"
#include "aether/virtual_display.h"
#include <filesystem>
#include <memory>
namespace aether::vdisplay {
struct DisplayError:std::runtime_error{std::string status;bool uncertain=false;DisplayError(std::string s,std::string r,bool u=false):runtime_error(r),status(std::move(s)),uncertain(u){}};
struct DisplayOptions{std::string command,name;std::vector<DisplayRequest> requests;bool json=false,test=false;std::filesystem::path testRoot;std::string fault;};
class MutationBackend{
 public:virtual ~MutationBackend()=default;
 virtual Json Snapshot(DisplayDeadline)=0;
 virtual void Validate(const Json& slots,const Json& reality,DisplayDeadline)=0;
 virtual Json Create(const Json& slot,DisplayDeadline)=0;
 virtual void Remove(const Json& slot,DisplayDeadline)=0;
 virtual void Apply(const Json& slots,const Json& before,DisplayDeadline)=0;
};
std::unique_ptr<MutationBackend> WindowsMutationBackend();
int RunRegistryCommand(const DisplayOptions&);
bool IsWindows11();
Json DefaultRequests(const std::string&,bool);
bool ExactRefresh(uint32_t,uint32_t);
bool ValidDisplayName(const std::string&);
}
