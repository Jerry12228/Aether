param(
  [Parameter(Mandatory)][ValidateSet('Tracer','Lifecycle','Adapters')][string]$Suite,
  [ValidateSet('Debug','Release')][string]$Configuration='Debug'
)
$ErrorActionPreference='Stop'
$coreRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$coreLibrary=Join-Path $coreRoot "build/native/$Configuration/aether_core.dll"
$contractBinary=Join-Path $coreRoot "build/native/$Configuration/aether_core_contract.exe"
if (!(Test-Path -LiteralPath $coreLibrary) -or !(Test-Path -LiteralPath $contractBinary)) { throw 'Build the selected configuration first; tests never synthesize missing artifact success.' }
$logs=Join-Path $coreRoot 'artifacts/phase02'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$timer=[Diagnostics.Stopwatch]::StartNew()
Push-Location $coreRoot
try {
  $nativeLog=Join-Path $logs "core-$Suite-$Configuration-native.log"
  $selection=& ctest --test-dir build/native -C $Configuration -N -R "^core_$($Suite.ToLowerInvariant())$" 2>&1
  if ($LASTEXITCODE -ne 0 -or ($selection -join "`n") -notmatch 'Total Tests: 1') { throw 'Native test discovery must find exactly the requested suite' }
  & ctest --test-dir build/native -C $Configuration -R "^core_$($Suite.ToLowerInvariant())$" --no-tests=error --output-on-failure --timeout 60 2>&1 | Tee-Object -FilePath $nativeLog
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  $env:AETHER_CORE_LIBRARY=$coreLibrary
  $env:AETHER_TEST_SUITE=$Suite
  $dartLog=Join-Path $logs "core-$Suite-$Configuration-dart.log"
  Push-Location (Join-Path $coreRoot 'packages/selene_native')
  try {
    $flutterLauncher=(Get-Command flutter -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
    $flutterBin=Split-Path $flutterLauncher
    $flutterDart=Join-Path $flutterBin 'cache/dart-sdk/bin/dart.exe'
    $flutterSnapshot=Join-Path $flutterBin 'cache/flutter_tools.snapshot'
    if (!(Test-Path -LiteralPath $flutterDart) -or !(Test-Path -LiteralPath $flutterSnapshot)) { throw 'Bootstrap the locked Flutter SDK first' }
    & $flutterDart $flutterSnapshot --suppress-analytics test --no-pub test/core_contract_test.dart --reporter=expanded --timeout=60s 2>&1 | Tee-Object -FilePath $dartLog
    $testExit=$LASTEXITCODE
  } finally { Pop-Location }
  if ($testExit -ne 0) { exit $testExit }
  if ((Get-Content -LiteralPath $dartLog -Raw) -notmatch '\+[1-9][0-9]*: All tests passed!') { throw 'Missing/empty Dart test result' }
  Write-Output "PASS Core/$Suite/$Configuration duration=$($timer.Elapsed.TotalSeconds.ToString('F3'))s DLL=$coreLibrary logs=$logs"
} finally { Pop-Location }
