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
extern "C" int aether_contract_host(const char*,const char*);
extern "C" int aether_contract_client(const char*,const char*,unsigned);
extern "C" void aether_contract_scenario(const char*,const char*);
@interface ProtocolContract : XCTestCase
@end
@implementation ProtocolContract
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
- (void)testIndependentWireVectors {
 NSURL* file=[[NSBundle bundleForClass:self.class] URLForResource:@"vectors" withExtension:@"json"];
 NSDictionary* vectors=[NSJSONSerialization JSONObjectWithData:[NSData dataWithContentsOfURL:file] options:0 error:nil];
 NSArray* cases=vectors[@"wire"];XCTAssertGreaterThanOrEqual(cases.count,15u);
 for(NSDictionary* item in cases){NSString* hex=item[@"hex"];std::vector<uint8_t> bytes;for(NSUInteger i=0;i<hex.length;i+=2){unsigned value=0;[[NSScanner scannerWithString:[hex substringWithRange:NSMakeRange(i,2)]] scanHexInt:&value];bytes.push_back(static_cast<uint8_t>(value));}
  std::vector<uint32_t> versions;for(NSNumber* v in item[@"local"])versions.push_back(v.unsignedIntValue);uint32_t selected=0,side=0;
  XCTAssertEqual(aether_protocol_negotiate(bytes.data(),static_cast<uint32_t>(bytes.size()),versions.data(),static_cast<uint32_t>(versions.size()),&selected,&side),[item[@"expected"][@"status"] intValue],@"%@",item[@"id"]);
 }
}
@end
#endif
