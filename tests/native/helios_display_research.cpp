// Standalone research-input verification; no device installation or mutation.
#include "edid.h"
#include <cstdio>

static bool valid(const uint8_t* bytes) {
    if (!bytes) return false;
    for (unsigned block=0; block<2; ++block) {
        unsigned sum=0;
        for (unsigned i=0; i<128; ++i) sum+=bytes[block*128+i];
        if ((sum&255)!=0) return false;
    }
    return true;
}
int main() {
    static_assert(sizeof(edid_base)==256, "EDID size changed");
    auto* sdr=generate_edid(0x12345678, "123456789012EXCESS", "HeliosOne", false);
    auto* hdr=generate_edid(0x87654321, nullptr, "\x01\x7f\xff", true);
    const bool ok=valid(sdr) && valid(hdr) &&
        sdr[12]==0x78 && sdr[15]==0x12 && hdr[12]==0x21 && hdr[15]==0x87 &&
        sdr[95]=='1' && sdr[106]=='2' && sdr[107]==10 &&
        sdr[77]=='H' && sdr[86]==10 && sdr[89]==32 &&
        hdr[77]=='?' && hdr[78]=='?' && hdr[79]=='?' && hdr[80]==10 &&
        sdr[130]==4 && hdr[130]==12 && hdr[138]==5 && hdr[139]==1;
    std::free(sdr);std::free(hdr);
    if (!ok) {std::fputs("EDID native semantic checks failed\n",stderr);return 1;}
    std::puts("PASS native EDID: checksums, serial byte order, bounded strings, sanitation, SDR/HDR separation");
    return 0;
}
