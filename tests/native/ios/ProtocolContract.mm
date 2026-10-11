#ifdef AETHER_IOS_APP
#import <UIKit/UIKit.h>
int main(int argc,char** argv){@autoreleasepool{return UIApplicationMain(argc,argv,nil,nil);}}
#else
#import <XCTest/XCTest.h>
#include "aether/protocol.h"
#include <thread>
#include <fstream>
#include <filesystem>
#include <chrono>
#include <vector>
#include <atomic>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <openssl/evp.h>
#define main aether_ios_media_entry
#include "../protocol_media_security.cpp"
#undef main
extern "C" int aether_contract_host(const char*,const char*);
extern "C" int aether_contract_client(const char*,const char*,unsigned);
extern "C" void aether_contract_scenario(const char*,const char*);
@interface ProtocolContract : XCTestCase
@end
@implementation ProtocolContract
- (NSDictionary*)mediaQuery:(uint64_t)handle {
 uint32_t size=0;XCTAssertEqual(aether_protocol_query(handle,nullptr,0,&size),AP_BUFFER_TOO_SMALL);XCTAssertLessThanOrEqual(size,65536u);
 std::vector<char> bytes(size);XCTAssertEqual(aether_protocol_query(handle,bytes.data(),size,&size),AP_OK);
 return [NSJSONSerialization JSONObjectWithData:[NSData dataWithBytes:bytes.data() length:size-1] options:0 error:nil];
}
- (void)runMedia:(unsigned)kind {
 NSURL* resources=[[NSBundle bundleForClass:self.class] resourceURL];std::string folder=resources.path.UTF8String;
 std::string hostCert=folder+"/host.pem",hostKey=folder+"/host.key",clientCert=folder+"/client.pem",clientKey=folder+"/client.key",trust=folder+"/trust.pem";
 AetherProtocolConfig host{};host.abi_version=1;host.struct_size=sizeof(host);host.role=1;host.deadline_ms=3000;host.host_id=101;host.instance_id=102;host.display_id=103;host.stream_id=104;host.connection_id=105;host.client_id=106;host.lease_epoch=host.config_generation=host.key_generation=1;host.certificate_file=hostCert.c_str();host.private_key_file=hostKey.c_str();host.trust_file=trust.c_str();host.peer_name="aether-client.local";host.version_count=2;host.versions[0]=1;host.versions[1]=2;host.permission_read=1;
 uint64_t server=0,client=0;auto callback=[](uint64_t,uint64_t,uint32_t,int32_t,uint64_t){};
 XCTAssertEqual(aether_protocol_create(&host,callback,&server),AP_OK);if(!server)return;
 NSDictionary* serverReady=[self mediaQuery:server];auto clientConfig=host;clientConfig.role=2;clientConfig.peer_control_port=[serverReady[@"controlPort"] unsignedIntValue];clientConfig.certificate_file=clientCert.c_str();clientConfig.private_key_file=clientKey.c_str();clientConfig.peer_name="aether-host.local";
 XCTAssertEqual(aether_protocol_create(&clientConfig,callback,&client),AP_OK);if(!client){uint64_t last=0;aether_protocol_stop(server,&last);aether_protocol_ack(server,last);aether_protocol_destroy(server);return;}
 NSDictionary* clientReady=[self mediaQuery:client];
 std::vector<uint8_t> request=kind==0?std::vector<uint8_t>{0x41,0x45,0x54,0x48,0,10,1,1,0,1}:std::vector<uint8_t>{0x41,0x45,0x54,0x48,0,17,1,2,0,1,0,2,0,1,0,1,static_cast<uint8_t>(kind==1?2:5)};
 int relay=-1;std::atomic<bool> done{false};std::atomic<unsigned> relayed{0};std::thread routing;
 if(kind==2){
  relay=socket(AF_INET,SOCK_DGRAM,0);sockaddr_in local{};local.sin_family=AF_INET;local.sin_addr.s_addr=htonl(INADDR_LOOPBACK);XCTAssertEqual(bind(relay,reinterpret_cast<sockaddr*>(&local),sizeof(local)),0);socklen_t size=sizeof(local);XCTAssertEqual(getsockname(relay,reinterpret_cast<sockaddr*>(&local),&size),0);timeval timeout{0,100000};setsockopt(relay,SOL_SOCKET,SO_RCVTIMEO,&timeout,sizeof(timeout));
  uint16_t port=ntohs(local.sin_port);request.insert(request.end(),{0,2,0,2,static_cast<uint8_t>(port>>8),static_cast<uint8_t>(port),0,3,0,2,0,1,0,6,0,17});std::string payload="synthetic-phase06";request.insert(request.end(),payload.begin(),payload.end());request[4]=static_cast<uint8_t>(request.size()>>8);request[5]=static_cast<uint8_t>(request.size());
  const unsigned serverPort=[serverReady[@"udpPort"] unsignedIntValue],clientPort=[clientReady[@"udpPort"] unsignedIntValue];
  routing=std::thread([&,serverPort,clientPort]{std::array<uint8_t,1500> packet{};while(!done){int size=static_cast<int>(recv(relay,packet.data(),packet.size(),0));if(size<12)continue;auto stream=(uint32_t(packet[8])<<24)|(uint32_t(packet[9])<<16)|(uint32_t(packet[10])<<8)|packet[11];sockaddr_in destination{};destination.sin_family=AF_INET;destination.sin_addr.s_addr=htonl(INADDR_LOOPBACK);destination.sin_port=htons(static_cast<uint16_t>(stream>=107?serverPort:clientPort));if(sendto(relay,packet.data(),static_cast<size_t>(size),0,reinterpret_cast<sockaddr*>(&destination),sizeof(destination))==size)++relayed;}});
 }
 std::atomic<int> hostResult{-1};std::string payload="synthetic-phase06";
 std::thread exchange([&]{hostResult=aether_protocol_submit(server,reinterpret_cast<const uint8_t*>(payload.data()),static_cast<uint32_t>(payload.size()));});
 auto clientResult=aether_protocol_submit(client,request.data(),static_cast<uint32_t>(request.size()));exchange.join();done=true;if(routing.joinable())routing.join();if(relay>=0)close(relay);
 XCTAssertEqual(clientResult,AP_OK);XCTAssertEqual(hostResult.load(),AP_OK);
 NSDictionary* received=[self mediaQuery:client];XCTAssertEqual([received[@"grants"] unsignedIntValue],1u);
 if(kind==0)XCTAssertEqual([received[@"sinkPackets"] unsignedIntValue],1u);
 else if(kind==1)XCTAssertEqual([received[@"streams"] count],2u);
 else{XCTAssertEqual([received[@"streams"] count],5u);XCTAssertEqual([received[@"controlProgress"] unsignedIntValue],8u);XCTAssertEqual(relayed.load(),120u);XCTAssertEqual([received[@"queueBytes"] unsignedIntValue],0u);for(NSDictionary* stream in received[@"streams"]){if([stream[@"direction"] unsignedIntValue]==1)XCTAssertEqual([stream[@"received"] unsignedIntValue],8u);}NSDictionary* sent=[self mediaQuery:server];for(NSDictionary* stream in sent[@"streams"]){if([stream[@"direction"] unsignedIntValue]==2)XCTAssertEqual([stream[@"received"] unsignedIntValue],8u);}}
 for(auto handle:{client,server}){uint64_t sequence=0;XCTAssertEqual(aether_protocol_stop(handle,&sequence),AP_OK);XCTAssertEqual(aether_protocol_ack(handle,sequence),AP_OK);NSDictionary* stopped=[self mediaQuery:handle];XCTAssertEqual([stopped[@"sockets"] unsignedIntValue],0u);XCTAssertEqual([stopped[@"threads"] unsignedIntValue],0u);XCTAssertEqual(aether_protocol_destroy(handle),AP_OK);}
}
- (void)testLegacyV1SecureMedia { [self runMedia:0]; }
- (void)testLegacyV2IndependentVideos { [self runMedia:1]; }
- (void)testBidirectionalFiveStreamFec { [self runMedia:2]; }
- (void)runScenario:(NSString*)scenario {
 NSURL* resources=[[NSBundle bundleForClass:self.class] resourceURL];
 NSURL* folder=[NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:NSUUID.UUID.UUIDString] isDirectory:YES];
 NSError* error=nil;XCTAssertTrue([[NSFileManager defaultManager] createDirectoryAtURL:folder withIntermediateDirectories:YES attributes:nil error:&error]);
 for(NSString* name in @[@"host.pem",@"host.key",@"client.pem",@"client.key",@"trust.pem"]){
  XCTAssertTrue([[NSFileManager defaultManager] copyItemAtURL:[resources URLByAppendingPathComponent:name] toURL:[folder URLByAppendingPathComponent:name] error:&error]);
 }
 std::string directory=folder.path.UTF8String,mode=scenario.UTF8String; aether_contract_scenario(directory.c_str(),mode.c_str());
 std::atomic<int> hostExit{-1};std::thread server([&]{hostExit=aether_contract_host(directory.c_str(),mode.c_str());});
 auto ready=std::filesystem::path(directory)/"ready";auto deadline=std::chrono::steady_clock::now()+std::chrono::seconds(4);
 while(!std::filesystem::exists(ready)&&std::chrono::steady_clock::now()<deadline)std::this_thread::sleep_for(std::chrono::milliseconds(2));
 if(std::filesystem::exists(ready)){unsigned port=0;std::ifstream(ready)>>port;XCTAssertGreaterThan(port,0u);XCTAssertEqual(aether_contract_client(directory.c_str(),mode.c_str(),port),0);}
 else XCTFail(@"Native host did not expose its real loopback socket");
 std::ofstream(std::filesystem::path(directory)/"client-done")<<"done";server.join();XCTAssertEqual(hostExit.load(),0);
 [[NSFileManager defaultManager] removeItemAtURL:folder error:nil];
}
- (void)testExactSecureSocket { [self runScenario:@"exact"]; }
- (void)testUnattachedAuthorityDenied { [self runScenario:@"no-provider"]; }
- (void)testCancelBeforeCommit { [self runScenario:@"cancel-before"]; }
- (void)testCancelAfterCommit { [self runScenario:@"cancel-committed"]; }
- (void)testGrantLoss { [self runScenario:@"grant-loss"]; }
- (void)testReadyLoss { [self runScenario:@"ready-loss"]; }
- (void)testReadyDeadline { [self runScenario:@"readyall-loss"]; }
- (void)testReadyAckLoss { [self runScenario:@"readyack-loss"]; }
- (void)testUnknownAuthorityResult { [self runScenario:@"unknown"]; }
- (void)testReplayKeepsMediaProgress { [self runScenario:@"replay"]; }
- (void)testGrantDigestBinding { [self runScenario:@"digest"]; }
- (void)testControlBoundaries { [self runScenario:@"boundaries"]; }
- (void)testStopTimeout { [self runScenario:@"stop-timeout"]; }
- (void)testCancelKeepsHealthyStream { [self runScenario:@"healthy-cancel"]; }
- (void)testReadPermission { [self runScenario:@"authority-read-deny"]; }
- (void)testCapacity { [self runScenario:@"authority-capacity"]; }
- (void)testRevision { [self runScenario:@"authority-revision"]; }
- (void)testExpiry { [self runScenario:@"authority-clock"]; }
- (void)testReadyDelay { [self runScenario:@"ready-delay"]; }
- (void)testReadyAckDelay { [self runScenario:@"readyack-delay"]; }
- (void)testOversize { [self runScenario:@"oversize"]; }
- (void)testUnsupportedSchema { [self runScenario:@"schema"]; }
- (void)testWrongSequence { [self runScenario:@"sequence"]; }
- (void)testRequiredField { [self runScenario:@"required"]; }
- (void)testDuplicateField { [self runScenario:@"duplicate"]; }
- (void)testTruncatedField { [self runScenario:@"truncated"]; }
- (void)testSharedAuthority { [self runScenario:@"shared-provider"]; }
- (void)runSecurity:(NSString*)mode {
 static const auto initialized=srtp_init();XCTAssertEqual(initialized,srtp_err_status_ok);
 try{if([mode isEqualToString:@"fec-golden"])fec();else security(mode.UTF8String);}catch(...){XCTFail(@"Independent native security contract failed: %@",mode);}
}
- (void)testFecGolden { [self runSecurity:@"fec-golden"]; }
- (void)testRocRollover { [self runSecurity:@"rollover"]; }
- (void)testNonceExhaustion { [self runSecurity:@"nonce-exhaustion"]; }
- (void)testUnauthenticatedHighSequence { [self runSecurity:@"high-sequence"]; }
- (void)testRoleKeyEpoch { [self runSecurity:@"role-key-epoch"]; }
- (void)testReplayAndChangedPlaintext { [self runSecurity:@"unchanged-retransmission"]; }
- (void)testIndependentWireVectors {
 NSURL* file=[[NSBundle bundleForClass:self.class] URLForResource:@"vectors" withExtension:@"json"];
 NSDictionary* vectors=[NSJSONSerialization JSONObjectWithData:[NSData dataWithContentsOfURL:file] options:0 error:nil];
 NSArray* cases=vectors[@"wire"];XCTAssertGreaterThanOrEqual(cases.count,15u);
 for(NSDictionary* item in cases){NSString* hex=item[@"hex"];std::vector<uint8_t> bytes;for(NSUInteger i=0;i<hex.length;i+=2){unsigned value=0;[[NSScanner scannerWithString:[hex substringWithRange:NSMakeRange(i,2)]] scanHexInt:&value];bytes.push_back(static_cast<uint8_t>(value));}
  std::vector<uint32_t> versions;for(NSNumber* v in item[@"local"])versions.push_back(v.unsignedIntValue);uint32_t selected=0,side=0;
  XCTAssertEqual(aether_protocol_negotiate(bytes.data(),static_cast<uint32_t>(bytes.size()),versions.data(),static_cast<uint32_t>(versions.size()),&selected,&side),[item[@"expected"][@"status"] intValue],@"%@",item[@"id"]);
  XCTAssertEqual(selected,[item[@"expected"][@"selectedVersion"] unsignedIntValue]);
  XCTAssertEqual(side,[item[@"expected"][@"upgradeSide"] unsignedIntValue]);
 }
}
@end
#endif
