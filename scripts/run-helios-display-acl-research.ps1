# User authorization: only this fixed research adapter, read-only probes and exact cleanup.
param([Parameter(Mandatory=$true)][ValidateSet('Install','Probe','Cleanup')][string]$Action)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
$output=Join-Path $repoRoot 'artifacts/phase03/admission-followup'
$statePath=Join-Path $output 'acl-install-state.json'
$identity=[Security.Principal.WindowsIdentity]::GetCurrent()
if (![Security.Principal.WindowsPrincipal]::new($identity).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { throw 'Administrator token required.' }
$hardwareId='Root\Aether\HeliosDisplay'
$config='HKLM:\SOFTWARE\Aether\HeliosDisplay'
$devcon='C:\Program Files (x86)\Windows Kits\10\Tools\10.0.28000.0\x64\devcon.exe'
$pnputil=Join-Path $env:WINDIR 'System32/pnputil.exe'
$package=Join-Path $repoRoot 'artifacts/phase03/selfsigned-research/helios-1791523416599'
$state=$null
Start-Transcript -LiteralPath (Join-Path $output "acl-$Action-transcript.log") | Out-Null
try {
 if ($Action -eq 'Probe') {
  & (Join-Path $PSScriptRoot 'probe-helios-display-acl.ps1') -OutputPath 'artifacts/phase03/admission-followup/acl-elevated.json'
 } elseif ($Action -eq 'Install') {
  if (Test-Path -LiteralPath $statePath) { throw 'Research state already exists; inspect before reusing.' }
  if (Test-Path -LiteralPath $config) { throw 'Existing dedicated configuration; do not overwrite.' }
  if ((Get-FileHash -LiteralPath (Join-Path $package 'HeliosDisplayResearch.zip') -Algorithm SHA256).Hash.ToLowerInvariant() -ne 'f275b1421de1f237e3b4e38bc740c3cb90280c9cfc809f9635eb1efe199fcc36') { throw 'Authorized archive changed.' }
  $signing=Get-Content -LiteralPath (Join-Path $package 'signing-state.json') -Raw | ConvertFrom-Json
  if (!$signing.signingCompleted -or $signing.certificate.thumbprint -ne 'E3ED742C3D08188A117AFF7B6C1BB207523EB4DB') { throw 'Wrong signed package.' }
  foreach ($member in $signing.members) {
   if ((Get-FileHash -LiteralPath (Join-Path $package "HeliosDisplayX64/$($member.name)") -Algorithm SHA256).Hash.ToLowerInvariant() -ne $member.sha256) { throw 'Package member changed.' }
  }
  $toolSignature=Get-AuthenticodeSignature -LiteralPath $devcon
  if ($toolSignature.Status -ne 'Valid' -or $toolSignature.SignerCertificate.Subject -notmatch 'O=Microsoft Corporation') { throw 'Devcon signature invalid.' }
  $before=@(Get-CimInstance Win32_PnPEntity -Filter "PNPClass='Display'")
  if (@($before | Where-Object {$_.HardwareID -contains $hardwareId}).Count) { throw 'Dedicated device already exists.' }
  $before | Select-Object Name,PNPDeviceID,HardwareID,ConfigManagerErrorCode | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $output 'acl-display-devices-before.json') -Encoding utf8
  & $pnputil /enum-drivers *> (Join-Path $output 'acl-driver-store-before.log')
  if ($LASTEXITCODE -ne 0) { throw 'Cannot inventory Driver Store.' }
  $beforeInfs=@([regex]::Matches((Get-Content -LiteralPath (Join-Path $output 'acl-driver-store-before.log') -Raw),'(?i)oem[0-9]+\.inf') | ForEach-Object {$_.Value.ToLowerInvariant()} | Sort-Object -Unique)
  $state=[ordered]@{recordedAt=[DateTime]::UtcNow.ToString('o');userText='授权，仅执行该 ACL 研究安装、只读测试及清理';hardwareId=$hardwareId;packageRoot=$package;beforeInfs=$beforeInfs;aetherParentExisted=(Test-Path -LiteralPath 'HKLM:\SOFTWARE\Aether');configCreated=$false;installed=$false;instanceId=$null;infName=$null;rebootOrShutdown=$false}
  $state | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $statePath -Encoding utf8
  New-Item -Path $config -Force | Out-Null
  New-ItemProperty -LiteralPath $config -Name watchdog -Value 0 -PropertyType DWord | Out-Null
  New-ItemProperty -LiteralPath $config -Name testMode -Value 0 -PropertyType DWord | Out-Null
  $state.configCreated=$true
  $state | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $statePath -Encoding utf8
  & $devcon install (Join-Path $package 'HeliosDisplayX64/HeliosDisplay.inf') $hardwareId *> (Join-Path $output 'acl-devcon-install.log')
  $state.installExit=$LASTEXITCODE
  $after=@(Get-CimInstance Win32_PnPEntity -Filter "PNPClass='Display'")
  $after | Select-Object Name,PNPDeviceID,HardwareID,ConfigManagerErrorCode | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $output 'acl-display-devices-installed.json') -Encoding utf8
  $devices=@($after | Where-Object {$_.HardwareID -contains $hardwareId})
  if ($devices.Count -eq 1) {
   $state.instanceId=$devices[0].PNPDeviceID
   $state.configManagerError=$devices[0].ConfigManagerErrorCode
   $classDriver=(Get-ItemProperty -LiteralPath "HKLM:\SYSTEM\CurrentControlSet\Enum\$($state.instanceId)").Driver
   $state.infName=(Get-ItemProperty -LiteralPath "HKLM:\SYSTEM\CurrentControlSet\Control\Class\$classDriver").InfPath
   $state.installed=$state.installExit -eq 0 -and $state.configManagerError -eq 0
  }
  $state | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $statePath -Encoding utf8
  if (!$state.installed) { throw 'Install/load not verified; inspect state and perform exact cleanup, no reboot.' }
 } else {
  $state=Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json -AsHashtable
  if ($state.hardwareId -ne $hardwareId -or $state.packageRoot -ne $package) { throw 'Cleanup identity mismatch.' }
  if ($state.instanceId) {
   $devices=@(Get-CimInstance Win32_PnPEntity | Where-Object {$_.PNPDeviceID -eq $state.instanceId})
   if ($devices.Count -ne 1 -or $devices[0].HardwareID -notcontains $hardwareId) { throw 'Exact cleanup device mismatch.' }
   & $devcon remove "@$($state.instanceId)" *> (Join-Path $output 'acl-devcon-remove.log')
   $state.removeExit=$LASTEXITCODE
  }
  if ($state.infName) {
   if ($state.infName -notmatch '^oem[0-9]+\.inf$' -or $state.beforeInfs -contains $state.infName.ToLowerInvariant()) { throw 'Cleanup package was not uniquely added by this run.' }
   & $pnputil /delete-driver $state.infName /uninstall *> (Join-Path $output 'acl-pnputil-delete.log')
   $state.deletePackageExit=$LASTEXITCODE
  }
  if ($state.configCreated -and (Test-Path -LiteralPath $config)) {
   Remove-Item -LiteralPath $config
   if (!$state.aetherParentExisted) {
    $parent=Get-Item -LiteralPath 'HKLM:\SOFTWARE\Aether'
    if ($parent.SubKeyCount -eq 0 -and $parent.ValueCount -eq 0) { Remove-Item -LiteralPath 'HKLM:\SOFTWARE\Aether' }
   }
  }
  $after=@(Get-CimInstance Win32_PnPEntity -Filter "PNPClass='Display'")
  $after | Select-Object Name,PNPDeviceID,HardwareID,ConfigManagerErrorCode | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $output 'acl-display-devices-after-cleanup.json') -Encoding utf8
  $state.cleanedDeviceAbsent=@($after | Where-Object {$_.HardwareID -contains $hardwareId}).Count -eq 0
  $state.cleanedConfigAbsent=!(Test-Path -LiteralPath $config)
  $state.cleanedAt=[DateTime]::UtcNow.ToString('o')
  $state | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $statePath -Encoding utf8
 }
} catch {
 if ($state) {$state.error=$_.Exception.Message;$state | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $statePath -Encoding utf8}
 $_ | Out-String | Set-Content -LiteralPath (Join-Path $output "acl-$Action-error.log") -Encoding utf8
 throw
} finally { Stop-Transcript | Out-Null }
