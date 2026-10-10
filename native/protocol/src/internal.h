#ifndef AETHER_PROTOCOL_INTERNAL_H
#define AETHER_PROTOCOL_INTERNAL_H
#include "aether/protocol.h"
#include <srtp.h>
#include <cstdint>
#include <string>
#include <vector>
namespace aether::protocol {
struct Identity {
 uint64_t host=0,instance=0,display=0,stream=0,connection=0,client=0;
 uint64_t lease=0,config=0,key=0;
};
struct KeyDomain {Identity identity;uint8_t direction=1,media=1,role=0;};
struct StreamContext {
 KeyDomain domain;
 srtp_t crypto=nullptr;
 uint32_t sent=0,received=0,rejected=0;
 uint16_t sequence=0;
 uint32_t timestamp=0;
 std::string authenticated_bytes,digest;
 ~StreamContext(){if(crypto)srtp_dealloc(crypto);}
 StreamContext()=default;
 StreamContext(const StreamContext&)=delete;
 StreamContext& operator=(const StreamContext&)=delete;
};
struct WindowRecord {uint32_t round=0,video1=0,video2=0,control=0;};
// Reserved typed seams for the following sequential slices; no authority or
// resource reservation is inferred from these unimplemented service contracts.
struct ResourceVector {uint64_t encoders=0,decoders=0,vram=0,bandwidth=0;};
struct Proposal {uint64_t request=0,budget_revision=0,epoch=0;std::string digest;ResourceVector resources;};
struct Reservation {uint64_t revision=0;ResourceVector resources;bool committed=false;};
class AuthorityAdapter {public:virtual ~AuthorityAdapter()=default;virtual int32_t authorize(const Identity&,uint32_t operation)const=0;};
struct RecoveryController {uint64_t epoch=0;uint32_t attempts=0;bool cancelled=false;};
struct SummaryRecord {uint64_t connection=0,stream=0;int32_t status=AP_OK;uint32_t packets=0,rejected=0;};
struct TraceWindow {uint64_t expires=0,bytes=0;bool enabled=false;};
struct FecBlock;
class MediaScheduler;
struct Transport;
struct ConnectionContext;
constexpr uint32_t media_header_bytes=64,dual_video_rounds=8,maximum_stream_payload=1024;
}
#endif
