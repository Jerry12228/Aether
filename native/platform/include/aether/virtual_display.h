#pragma once
#include <chrono>
#include <cstdint>
#include <optional>
#include <string>
#include <vector>
namespace aether::vdisplay {
using DisplayDeadline=std::chrono::steady_clock::time_point;
struct DisplayRequest {std::string group;uint32_t slot=0,width=0,height=0,refreshNumerator=60,refreshDenominator=1;bool hdr=false;};
struct DisplayIdentity {std::string adapterLuid,monitorPath,deviceName;uint32_t sourceId=0,targetId=0;};
struct DisplayActual {DisplayIdentity identity;uint32_t width=0,height=0,refreshNumerator=0,refreshDenominator=0,outputTechnology=0;int32_t x=0,y=0;std::optional<bool> advancedColorSupported,advancedColorEnabled;uint32_t identityError=0,colorError=0;};
struct DisplayDevice {std::string instanceId,description,service,providerId;uint32_t status=0,problem=0;};
struct DisplayResult {std::string status="unknown",reason;uint32_t osError=0,attempts=0;bool osEnumeration=false;std::vector<DisplayActual> actual;std::vector<DisplayDevice> devices;uint64_t durationMs=0;};
// Backend injection belongs to the native contract test; no CLI/environment test hook.
class DisplayBackend {public:virtual ~DisplayBackend()=default;virtual uint32_t Read(DisplayResult&,DisplayDeadline)=0;};
class DisplayProvider {
 public:
 explicit DisplayProvider(DisplayBackend& backend):backend_(backend){}
 DisplayResult Enumerate(DisplayDeadline deadline);
 DisplayResult Probe(DisplayDeadline deadline);
 DisplayResult CreateSlot(const DisplayRequest&,DisplayDeadline);
 DisplayResult UpdateSlot(const DisplayRequest&,const DisplayIdentity&,DisplayDeadline);
 DisplayResult RemoveSlot(const DisplayIdentity&,DisplayDeadline);
 private:DisplayBackend& backend_;
};
DisplayResult EnumerateWindows(DisplayDeadline deadline,bool probe);
std::string ToJson(const DisplayResult&,const std::string& logPath,const std::string& group="");
int RunDisplayCommand(int argc,char** argv);
}
