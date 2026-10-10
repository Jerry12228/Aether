#include "internal.h"
namespace aether::protocol {
int32_t dispatch_recovery(ConnectionContext& c,RecoveryController& recovery,uint32_t opcode,const Binding& binding,uint32_t window){
 if(opcode==6){recovery.cancelled=true;recovery.retry_remaining_ms=0;recovery.state="manual";recovery.reason="cancelled";return AP_CANCELLED;}
 if(opcode==7){if(!window||window>3000)return AP_FIELD;recovery.scope="stream";recovery.failure_started=std::chrono::steady_clock::now();recovery.state="transient";recovery.reason="stream-retry";c.media_fault_stream=binding.identity.stream;c.media_fault_until=recovery.failure_started+std::chrono::milliseconds(window);return reset_stream_generation(c,binding.identity.stream,c.config.key_generation+1);}
 if(opcode!=5)return AP_FIELD;
 if(!c.authenticated||!c.host_services){recovery.state="manual";recovery.reason="fresh-auth-required";return AP_PERMISSION;}
 recovery.previous=binding.identity;recovery.current=binding.identity;recovery.scope="connection";recovery.cancelled=false;recovery.state="reconnecting";
 auto status=c.host_services->fresh_auth_result(binding,recovery.current);recovery.retry_remaining_ms=0;
 if(status!=AP_OK){recovery.state="manual";recovery.reason=status==AP_BUSY?"control-lease-conflict":status==AP_TRUST||status==AP_IDENTITY?"identity-reverification-required":"permission-or-auth-failed";return status;}
 require(recovery.current.connection!=binding.identity.connection&&recovery.current.key>binding.identity.key&&recovery.current.lease>binding.identity.lease,AP_STALE);
 recovery.epoch=recovery.current.lease;auto snapshot=c.host_services->snapshot({recovery.current,binding.operation_id,binding.request_id,{}});recovery.state=snapshot.control_allowed?"restored":"observer";recovery.reason="upstream-confirmation-required";return AP_OK;
}
}
