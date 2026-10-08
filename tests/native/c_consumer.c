#include "aether/core.h"
_Static_assert(sizeof(AetherConfig)==16,"C ABI config layout");
_Static_assert(sizeof(AetherCapabilities)==32,"C ABI capabilities layout");
_Static_assert(sizeof(AetherStats)==64,"C ABI stats layout");
int aether_c_consumer(void) { return sizeof(uint64_t)==8; }
