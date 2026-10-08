#pragma once
#include "aether/core.h"
namespace aether {
struct PlatformDescriptor { uint32_t id; uint64_t capabilities; uint32_t implemented; uint32_t reason; };
const PlatformDescriptor* platform(uint32_t id) noexcept;
int32_t platform_init(uint32_t id) noexcept;
void platform_shutdown(uint32_t id) noexcept;
}
