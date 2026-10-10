#include "internal.h"
namespace aether::protocol {
int32_t dispatch_trace(ConnectionContext&,TraceWindow& trace,uint32_t opcode,uint32_t duration){
 const auto now=static_cast<uint64_t>(std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now().time_since_epoch()).count());
 if(trace.enabled&&(now>=trace.expires||trace.bytes>=trace.limit_bytes))trace.enabled=false;
 if(!opcode)return AP_OK;
 if(opcode==11){trace.enabled=false;trace.expires=0;return AP_OK;}
 if(opcode!=10&&opcode!=12)return AP_FIELD;
 if(!duration||duration>60000)return AP_FIELD;
 if(opcode==12&&!trace.enabled)return AP_STALE;
 if(opcode==10){trace.bytes=0;trace.records.clear();}
 trace.expires=now+duration;trace.enabled=true;return AP_OK;
}
}
