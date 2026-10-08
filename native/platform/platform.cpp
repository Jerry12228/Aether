#include "aether/platform.h"
namespace aether {
constexpr PlatformDescriptor descriptors[] = {
 {AETHER_WINDOWS,AETHER_LOCAL_CORE,1,0},
 {AETHER_MACOS,0,0,AETHER_UNSUPPORTED}, {AETHER_IOS,0,0,AETHER_UNSUPPORTED},
 {AETHER_ANDROID,0,0,AETHER_UNSUPPORTED}, {AETHER_LINUX,0,0,AETHER_UNSUPPORTED}
};
const PlatformDescriptor* platform(uint32_t id) noexcept {
 for (const auto& descriptor: descriptors) if (descriptor.id==id) return &descriptor;
 return nullptr;
}
int32_t platform_init(uint32_t id) noexcept { const auto* p=platform(id);return !p?AETHER_INVALID_ARGUMENT:p->implemented?AETHER_OK:AETHER_UNSUPPORTED; }
void platform_shutdown(uint32_t) noexcept {}
}
