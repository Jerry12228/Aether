#include <windows.h>
#include <iostream>
#include <string>
int main(int argc,char** argv) {
  if(argc!=2)return 2;
  const auto input=GetStdHandle(STD_INPUT_HANDLE), output=GetStdHandle(STD_OUTPUT_HANDLE), error=GetStdHandle(STD_ERROR_HANDLE);
  FreeConsole(); if(!AllocConsole()){std::cerr<<"AllocConsole failed\n";return 1;}
  const auto console=GetConsoleWindow(); if(console)ShowWindow(console,SW_HIDE);
  const auto event_name="Local\\AetherHeliosSignal-"+std::to_string(GetCurrentProcessId());
  HANDLE ready=CreateEventA(nullptr,TRUE,FALSE,event_name.c_str()); if(!ready)return 1;
  SetHandleInformation(input,HANDLE_FLAG_INHERIT,HANDLE_FLAG_INHERIT);
  SetHandleInformation(output,HANDLE_FLAG_INHERIT,HANDLE_FLAG_INHERIT);
  SetHandleInformation(error,HANDLE_FLAG_INHERIT,HANDLE_FLAG_INHERIT);
  STARTUPINFOA info{};info.cb=sizeof(info);info.dwFlags=STARTF_USESTDHANDLES;
  info.hStdInput=input;info.hStdOutput=output;info.hStdError=error;
  PROCESS_INFORMATION process{};
  std::string command="\""+std::string(argv[1])+"\" --automation --test-ready-event "+event_name;
  if(!CreateProcessA(argv[1],command.data(),nullptr,nullptr,TRUE,0,nullptr,nullptr,&info,&process))return 1;
  CloseHandle(process.hThread);
  // Unique console: the signal cannot reach the caller's or another user's group.
  SetConsoleCtrlHandler(nullptr,TRUE);
  bool passed=WaitForSingleObject(ready,3000)==WAIT_OBJECT_0;
  passed=passed && WaitForSingleObject(process.hProcess,200)==WAIT_TIMEOUT;
  if(passed)std::cout<<"foreground_alive signal=CTRL_C_EVENT"<<std::endl;
  passed=passed && GenerateConsoleCtrlEvent(CTRL_C_EVENT,0);
  passed=passed && WaitForSingleObject(process.hProcess,4000)==WAIT_OBJECT_0;
  DWORD exit_code=1;
  if(passed)GetExitCodeProcess(process.hProcess,&exit_code);
  else {std::cerr<<"Owned console test failed error="<<GetLastError()<<std::endl;TerminateProcess(process.hProcess,1);WaitForSingleObject(process.hProcess,1000);}
  CloseHandle(ready);CloseHandle(process.hProcess);FreeConsole();
  return passed&&exit_code==0?0:1;
}
