param([ValidatePattern('^[a-z0-9-]+$')][string]$Label='preflight')
$ErrorActionPreference='Stop'
$repo=Split-Path -Parent $PSScriptRoot
$actual=git -C $repo rev-parse --show-toplevel
$pinned=git -C 'D:/WorkSpace/Aether' rev-parse --show-toplevel
if (!$actual -or $actual -ne $pinned) { throw 'FATAL supplied root pin mismatch' }
# Observation only. No commands/traffic/config contents or endpoint addresses are emitted.
$out=Join-Path $repo "artifacts/phase03/apollo-install-preflight/$Label"
New-Item -ItemType Directory -Path $out -Force | Out-Null
function HashFile($p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
function HashText($s) { [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($s))).ToLowerInvariant() }
$svc=Get-CimInstance Win32_Service -Filter "Name='ApolloService'"
if ($svc.State -ne 'Running' -or $svc.PathName -ne 'C:\Program Files\Apollo\tools\sunshinesvc.exe') { throw 'Unexpected Apollo service identity/state' }
$procs=@(Get-CimInstance Win32_Process | Where-Object {$_.Name -in @('sunshine.exe','sunshinesvc.exe','WUDFHost.exe')} | Sort-Object ProcessId | Select-Object Name,ProcessId,ParentProcessId,CreationDate)
$apolloPids=@($procs | Where-Object {$_.Name -ne 'WUDFHost.exe'} | ForEach-Object {$_.ProcessId})
$connections=@(Get-NetTCPConnection | Where-Object {$_.OwningProcess -in $apolloPids -and $_.State -eq 'Established'} | ForEach-Object {[ordered]@{pid=$_.OwningProcess;state=[string]$_.State;tupleSha256=HashText("$($_.LocalAddress):$($_.LocalPort)|$($_.RemoteAddress):$($_.RemotePort)")}} | Sort-Object tupleSha256)
$files=@('C:/Program Files/Apollo/tools/sunshinesvc.exe','C:/Program Files/Apollo/sunshine.exe','C:/Program Files/Apollo/config/sunshine.conf','C:/Program Files/Apollo/config/apps.json','C:/Program Files/Apollo/config/sunshine_state.json','C:/Windows/INF/oem44.inf','C:/Windows/INF/oem88.inf','C:/Windows/System32/drivers/UMDF/SudoVDA.dll','C:/Windows/System32/drivers/UMDF/OrayIddDriver.sys','C:/Windows/System32/drivers/WUDFRd.sys') | ForEach-Object {if (!(Test-Path -LiteralPath $_)){throw "Required observation file missing: $_"}; [ordered]@{path=$_;length=(Get-Item -LiteralPath $_).Length;sha256=HashFile $_}}
$drivers=@(Get-CimInstance Win32_PnPSignedDriver | Where-Object {$_.DeviceID -in @('ROOT\DISPLAY\0000','ROOT\DISPLAY\0001')} | Sort-Object DeviceID | Select-Object DeviceName,DeviceID,DriverVersion,InfName,DriverProviderName)
if (!('ApolloDriverStoreLookup' -as [type])) {
 Add-Type -TypeDefinition @'
using System; using System.Text; using System.Runtime.InteropServices;
public static class ApolloDriverStoreLookup {
 [DllImport("setupapi.dll",CharSet=CharSet.Unicode,SetLastError=true)]
 public static extern bool SetupGetInfDriverStoreLocationW(string inf,IntPtr context,string alternate,StringBuilder result,uint size,out uint required);
}
'@
}
$storeFiles=@(foreach($d in $drivers){
 $buffer=[Text.StringBuilder]::new(32768);[uint32]$needed=0
 $published=[IO.Path]::GetFullPath("C:/Windows/INF/$($d.InfName)")
 $method='SetupGetInfDriverStoreLocationW';$lookupError=$null
 if(![ApolloDriverStoreLookup]::SetupGetInfDriverStoreLocationW($published,[IntPtr]::Zero,$null,$buffer,32768,[ref]$needed)){
  $lookupError=[Runtime.InteropServices.Marshal]::GetLastWin32Error();$method='unique exact published-INF byte hash match'
  $infName=if($d.DeviceID -eq 'ROOT\DISPLAY\0000'){'sudovda.inf'}else{'orayidddriver.inf'}
  $publishedHash=HashFile $published
  $matches=@(Get-ChildItem 'C:/Windows/System32/DriverStore/FileRepository' -Directory -Filter "$infName*" | Where-Object {(HashFile (Join-Path $_.FullName $infName)) -eq $publishedHash})
  if($matches.Count -ne 1){throw 'Foreign driver store cannot be uniquely proved by exact INF bytes'}
  $folder=$matches[0].FullName
 }else{$folder=Split-Path $buffer.ToString() -Parent}
 foreach($file in Get-ChildItem -LiteralPath $folder -File -Recurse){[ordered]@{instanceId=$d.DeviceID;path=$file.FullName;length=$file.Length;sha256=HashFile $file.FullName;lookupMethod=$method;setupApiLookupError=$lookupError}}
})
$sharedService=Get-ItemProperty 'HKLM:/SYSTEM/CurrentControlSet/Services/WUDFRd' | Select-Object Start,Type,ImagePath,ErrorControl
$groups=@('0000','0001') | ForEach-Object {[ordered]@{instanceId="ROOT\DISPLAY\$_";deviceGroupId=(Get-ItemProperty -LiteralPath "HKLM:/SYSTEM/CurrentControlSet/Enum/ROOT/DISPLAY/$_/Device Parameters/WUDF").DeviceGroupId}}
$foreign=@(Get-PnpDevice | Where-Object {$_.Class -in @('Display','Monitor')} | Sort-Object InstanceId | Select-Object Class,InstanceId,Status,Problem)
$planText=& (Join-Path $repo 'build/native/Release/helios.exe') vdisplay driver install --plan --json
if ($LASTEXITCODE -ne 0) { throw 'Native readonly plan failed' }
$plan=$planText | ConvertFrom-Json
$planText | Set-Content -LiteralPath (Join-Path $out 'native-plan.json') -Encoding utf8
$snapshot=[ordered]@{schemaVersion=1;recordedAt=[DateTimeOffset]::UtcNow.ToString('o');systemMutation=$false;scope='read-only Apollo continuity; no stream traffic sampled';service=($svc | Select-Object Name,State,ProcessId,StartMode);processes=$procs;establishedTcp=$connections;files=$files;drivers=$drivers;driverStoreFiles=$storeFiles;sharedWudfService=$sharedService;umdfGroups=$groups;foreign=$foreign;topology=$plan.topology;planSha256=$plan.planSha256;installerSha256=$plan.installer.sha256;packageSha256=$plan.package.sha256;ownedDevices=$plan.ownedDevices;groups=$plan.groups;observationLimits=@('TCP connection identity does not prove stream quality or UDP continuity','No machine installation occurred; this is a prerequisite baseline')}
$snapshot | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath (Join-Path $out 'snapshot.json') -Encoding utf8
Write-Output ([ordered]@{path="artifacts/phase03/apollo-install-preflight/$Label/snapshot.json";sha256=HashFile (Join-Path $out 'snapshot.json');apolloPids=$apolloPids;planSha256=$plan.planSha256;systemMutation=$false} | ConvertTo-Json -Compress)
