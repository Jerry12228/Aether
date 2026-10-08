#include "aether/core.h"
_Static_assert(sizeof(AetherConfig)==16,"C ABI config layout");
_Static_assert(sizeof(AetherCapabilities)==32,"C ABI capabilities layout");
_Static_assert(sizeof(AetherStats)==64,"C ABI stats layout");
int aether_c_consumer(void) {
 char buffer[32];uint32_t required=0;
 return aether_core_version(1,buffer,sizeof(buffer),&required)==AETHER_OK && buffer[0]=='0' && required==6;
}
