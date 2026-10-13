# Read-only probe for the dedicated Aether interface. No create/remove/ping IOCTL.
param([Parameter(Mandatory=$true)][string]$OutputPath)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
$target=[IO.Path]::GetFullPath((Join-Path $repoRoot $OutputPath))
if (!$target.StartsWith((Join-Path $repoRoot 'artifacts/phase03/') ,[StringComparison]::OrdinalIgnoreCase)) { throw 'Evidence must stay in phase03 artifacts.' }
Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using Microsoft.Win32.SafeHandles;
public static class HeliosAclProbe {
 [StructLayout(LayoutKind.Sequential)] struct InterfaceData {public uint size; public Guid guid; public uint flags; public IntPtr reserved;}
 [StructLayout(LayoutKind.Sequential)] struct DeviceData {public uint size;public Guid guid;public uint devInst;public IntPtr reserved;}
 [DllImport("setupapi.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr SetupDiGetClassDevs(ref Guid guid,string enumerator,IntPtr parent,uint flags);
 [DllImport("setupapi.dll",SetLastError=true)] static extern bool SetupDiEnumDeviceInterfaces(IntPtr set,IntPtr device,ref Guid guid,uint index,ref InterfaceData data);
 [DllImport("setupapi.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool SetupDiGetDeviceInterfaceDetail(IntPtr set,ref InterfaceData data,IntPtr detail,uint size,out uint required,ref DeviceData device);
 [DllImport("setupapi.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool SetupDiGetDeviceRegistryProperty(IntPtr set,ref DeviceData device,uint property,out uint type,byte[] buffer,uint size,out uint required);
 [DllImport("setupapi.dll")] static extern bool SetupDiDestroyDeviceInfoList(IntPtr set);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern SafeFileHandle CreateFile(string path,uint access,uint share,IntPtr security,uint creation,uint flags,IntPtr template);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool DeviceIoControl(SafeFileHandle file,uint code,IntPtr input,uint inputSize,byte[] output,uint outputSize,out uint returned,IntPtr overlapped);
 public static object[] Run() {
  var guid=new Guid("0d9ecbde-124e-45f0-9ae0-3d71b16a7725");
  var set=SetupDiGetClassDevs(ref guid,null,IntPtr.Zero,18);
  if(set==new IntPtr(-1))throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
  var records=new List<object>();
  try {for(uint i=0;;i++) {
   var data=new InterfaceData{size=(uint)Marshal.SizeOf<InterfaceData>()};
   if(!SetupDiEnumDeviceInterfaces(set,IntPtr.Zero,ref guid,i,ref data)){int error=Marshal.GetLastWin32Error();if(error==259)break;throw new System.ComponentModel.Win32Exception(error);}
   var device=new DeviceData{size=(uint)Marshal.SizeOf<DeviceData>()};uint required;
   SetupDiGetDeviceInterfaceDetail(set,ref data,IntPtr.Zero,0,out required,ref device);
   if(required<8 || required>65536)throw new InvalidOperationException("Invalid detail size");
   var detail=Marshal.AllocHGlobal((int)required);
   try {Marshal.WriteInt32(detail,IntPtr.Size==8?8:6);
    if(!SetupDiGetDeviceInterfaceDetail(set,ref data,detail,required,out required,ref device))throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
    string path=Marshal.PtrToStringUni(IntPtr.Add(detail,4));
    var security=new byte[65536];uint type,length;
    bool readSecurity=SetupDiGetDeviceRegistryProperty(set,ref device,23,out type,security,(uint)security.Length,out length);
    int securityError=readSecurity?0:Marshal.GetLastWin32Error();
    string sddl=readSecurity?new RawSecurityDescriptor(security,0).GetSddlForm(AccessControlSections.All):null;
    var opens=new List<object>();
    foreach(uint access in new uint[]{0,0x80000000,0xC0000000}){
     using(var file=CreateFile(path,access,3,IntPtr.Zero,3,0,IntPtr.Zero)){
      int error=file.IsInvalid?Marshal.GetLastWin32Error():0; bool query=false;int queryError=0;string protocol=null;
      if(!file.IsInvalid){var bytes=new byte[4];uint returned;
       query=DeviceIoControl(file,0x2263FC,IntPtr.Zero,0,bytes,4,out returned,IntPtr.Zero);
       queryError=query?0:Marshal.GetLastWin32Error();if(query&&returned==4)protocol=BitConverter.ToString(bytes);
      }
      opens.Add(new{access,opened=!file.IsInvalid,error,protocolQuerySucceeded=query,queryError,protocol});
     }
    }
    records.Add(new{path,sddl,securityError,opens});
   }finally{Marshal.FreeHGlobal(detail);}
  }}finally{SetupDiDestroyDeviceInfoList(set);}
  return records.ToArray();
 }
}
'@
$identity=[Security.Principal.WindowsIdentity]::GetCurrent()
$principal=[Security.Principal.WindowsPrincipal]::new($identity)
$report=@{recordedAt=[DateTime]::UtcNow.ToString('o');elevatedAdministrator=$principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator);interfaceGuid='0d9ecbde-124e-45f0-9ae0-3d71b16a7725';records=@([HeliosAclProbe]::Run());deviceOperations=$false;ioctl='GET_PROTOCOL_VERSION only; access=0 tests read-access IOCTL enforcement';scriptSha256=(Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()}
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $target -Encoding utf8
$report | ConvertTo-Json -Depth 8 -Compress
