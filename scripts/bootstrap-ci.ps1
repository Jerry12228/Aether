param([switch]$InstallLockedSdk)
$ErrorActionPreference='Stop'
$ciRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$ciLock=Get-Content (Join-Path $ciRoot 'toolchains.lock.json') -Raw | ConvertFrom-Json
$ciTools=Join-Path $ciRoot 'build/ci-tools'
$ciEvidence=Join-Path $ciRoot 'artifacts/phase02/ci'
New-Item -ItemType Directory -Path $ciTools,$ciEvidence -Force | Out-Null
if(Test-Path -LiteralPath (Join-Path $ciRoot 'references/upstream')){throw 'Research checkout present in CI'}
$vswhere=Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio/Installer/vswhere.exe'
$vs=(& $vswhere -latest -products '*' -format json | ConvertFrom-Json | Select-Object -First 1)
if(!$vs -or !$vs.installationVersion.StartsWith('18.')){throw 'Locked Visual Studio 18 generator requires VS 2026 C++ desktop tools'}
$sdk=Join-Path ${env:ProgramFiles(x86)} "Windows Kits/10/Include/$($ciLock.windows.sdk)/ucrt"
$provenance=@{imageOS=$env:ImageOS;imageVersion=$env:ImageVersion;runnerEnvironment=$env:RUNNER_ENVIRONMENT;commit=$env:GITHUB_SHA;runUrl="https://github.com/$($env:GITHUB_REPOSITORY)/actions/runs/$($env:GITHUB_RUN_ID)";visualStudio=$vs.installationVersion;channelId=$vs.channelId;requestedSdk=$ciLock.windows.sdk;sdkPresent=(Test-Path -LiteralPath $sdk);sdkInstall='not requested';actions=$ciLock.ci.actions}
$provenance | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $ciEvidence 'bootstrap.json') -Encoding utf8
if(!(Test-Path -LiteralPath $sdk)){
 if(!$InstallLockedSdk -or $env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_ENVIRONMENT -ne 'github-hosted'){throw 'SDK 10.0.28000.0 missing. Supply a GUI-capable exact-SDK executor; only an ephemeral hosted runner may install it automatically.'}
 $installer=Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio/Installer/setup.exe'
 $signature=Get-AuthenticodeSignature -LiteralPath $installer
 if($signature.Status -ne 'Valid' -or $signature.SignerCertificate.Subject -notmatch 'Microsoft Corporation'){throw 'Visual Studio installer signature is not verified Microsoft'}
 $provenance.installerSha256=(Get-FileHash $installer -Algorithm SHA256).Hash.ToLowerInvariant()
 $start=[Diagnostics.ProcessStartInfo]::new($installer);$start.UseShellExecute=$false;$start.CreateNoWindow=$true;$start.WorkingDirectory=$ciRoot
 foreach($argument in @('modify','--installPath',$vs.installationPath,'--channelId',$vs.channelId,'--add','Microsoft.VisualStudio.Component.Windows11SDK.28000','--quiet','--norestart','--nocache')){$start.ArgumentList.Add($argument)}
 $process=[Diagnostics.Process]::Start($start)
 if(!$process.WaitForExit(900000)){$process.Kill($true);throw 'Locked SDK installation timed out'}
 $provenance.sdkInstall="exit=$($process.ExitCode) via signed Microsoft VS Installer; component Windows11SDK.28000"
 $provenance.sdkPresent=Test-Path -LiteralPath $sdk
 $provenance | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $ciEvidence 'bootstrap.json') -Encoding utf8
 if($process.ExitCode -ne 0 -or !$provenance.sdkPresent){throw 'Locked SDK install failed or requires reboot; exact CI executor is still required'}
}
function Get-LockedArchive([string]$Url,[string]$Digest,[string]$File){
 if(!(Test-Path -LiteralPath $File)){Invoke-WebRequest -Uri $Url -OutFile $File -TimeoutSec 600}
 if((Get-FileHash -LiteralPath $File -Algorithm SHA256).Hash.ToLowerInvariant() -ne $Digest){throw 'CI archive SHA256 mismatch'}
}
$flutterZip=Join-Path $ciTools 'flutter.zip'
Get-LockedArchive $ciLock.flutter.archiveUrl $ciLock.flutter.archiveSha256 $flutterZip
$flutterDirectory=Join-Path $ciTools 'flutter'
if(!(Test-Path (Join-Path $flutterDirectory 'bin/cache/flutter_tools.snapshot'))){Expand-Archive -LiteralPath $flutterZip -DestinationPath $ciTools -Force}
$flutterActual=Get-Content (Join-Path $flutterDirectory 'bin/cache/flutter.version.json') -Raw | ConvertFrom-Json
if($flutterActual.frameworkRevision -ne $ciLock.flutter.frameworkRevision -or $flutterActual.engineRevision -ne $ciLock.flutter.engineRevision -or $flutterActual.dartSdkVersion -ne $ciLock.flutter.dart){throw 'Pinned Flutter/engine/Dart metadata mismatch'}
$cmakeZip=Join-Path $ciTools 'cmake.zip'
Get-LockedArchive $ciLock.ci.cmakeArchive.url $ciLock.ci.cmakeArchive.sha256 $cmakeZip
$cmakeBin=Join-Path $ciTools 'cmake-4.4.3-windows-x86_64/bin'
if(!(Test-Path (Join-Path $cmakeBin 'cmake.exe'))){Expand-Archive -LiteralPath $cmakeZip -DestinationPath $ciTools -Force}
$flutterBin=Join-Path $flutterDirectory 'bin'
$env:PATH="$cmakeBin;$flutterBin;$env:PATH"
if($env:GITHUB_PATH){Add-Content -LiteralPath $env:GITHUB_PATH -Value $cmakeBin;Add-Content -LiteralPath $env:GITHUB_PATH -Value $flutterBin}
$provenance.flutter=$flutterActual
$provenance.cmake=(& (Join-Path $cmakeBin 'cmake.exe') --version | Select-Object -First 1)
$provenance.flutterBundledCmake=(& (Join-Path $vs.installationPath 'Common7/IDE/CommonExtensions/Microsoft/CMake/CMake/bin/cmake.exe') --version | Select-Object -First 1)
$provenance.msvcTools=(Get-ChildItem (Join-Path $vs.installationPath 'VC/Tools/MSVC') -Directory | Sort-Object Name -Descending | Select-Object -First 1).Name
$provenance.sdkInstalledVersion=$ciLock.windows.sdk
$provenance.flutterArchiveSha256=$ciLock.flutter.archiveSha256
$provenance.cmakeArchiveSha256=$ciLock.ci.cmakeArchive.sha256
$provenance | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $ciEvidence 'bootstrap.json') -Encoding utf8
Write-Output 'PASS pinned CI tools; actual image/tool metadata saved'
