param([ValidateSet('Both')][string]$Backend='Both',[string]$Output='artifacts/phase02/presentation',[switch]$CheckReport)
$ErrorActionPreference='Stop'
$measureRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$measureOutput=[IO.Path]::GetFullPath((Join-Path $measureRoot $Output))
if (!$measureOutput.StartsWith(($measureRoot+[IO.Path]::DirectorySeparatorChar),[StringComparison]::OrdinalIgnoreCase)) { throw 'Output must stay inside the workspace' }
New-Item -ItemType Directory -Path $measureOutput -Force | Out-Null
if (!$CheckReport) {
  $launcher=(Get-Command flutter -CommandType Application | Select-Object -First 1).Source
  $bin=Split-Path $launcher
  $env:AETHER_MEASUREMENT_DIR=$measureOutput
  $env:AETHER_ARTIFACT_DIR=$measureOutput
  $measureSources=@('native/platform/windows/presentation.cpp','native/platform/include/aether/presentation.h','packages/selene_native/windows/selene_native_plugin.cpp','apps/selene/integration_test/presentation_measure_test.dart') | ForEach-Object { @{file=$_;sha256=(Get-FileHash (Join-Path $measureRoot $_) -Algorithm SHA256).Hash} }
  $measureSources | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $measureOutput 'source-hashes-at-launch.json')
  $env:AETHER_ENABLE_TEST_HOOKS='1'; $env:AETHER_TEST_FAULTS='1'
  Push-Location (Join-Path $measureRoot 'apps/selene')
  try {
    & (Join-Path $bin 'cache/dart-sdk/bin/dart.exe') (Join-Path $bin 'cache/flutter_tools.snapshot') --suppress-analytics test --no-pub -d windows integration_test/presentation_measure_test.dart --reporter=expanded 2>&1 | Tee-Object (Join-Path $measureOutput 'engine.log')
    $measureExit=$LASTEXITCODE
  } finally { Pop-Location }
  if($measureExit -ne 0) { throw "Measurement engine failed exit=$measureExit; partial rounds retained" }
  $lock=Get-Content (Join-Path $measureRoot 'toolchains.lock.json') -Raw | ConvertFrom-Json
  @{schema=1;os=[Environment]::OSVersion.Version.ToString();gpu=@(Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion);sdk=$lock.flutter;sources=$measureSources;timestamp=(Get-Date).ToUniversalTime().ToString('o')} | ConvertTo-Json -Depth 12 | Set-Content (Join-Path $measureOutput 'provenance.json')
}
$report=Get-Content (Join-Path $measureOutput 'report.json') -Raw | ConvertFrom-Json
if($report.schema -ne 1 -or !(Test-Path (Join-Path $measureOutput 'engine.log')) -or !(Test-Path (Join-Path $measureOutput 'provenance.json'))) { throw 'Missing schema/provenance/engine log' }
foreach($mode in 'gpuTexture','nativeSurface') {
  $entry=$report.backends.$mode
  if($entry.outcome -ne 'passed' -or $entry.rounds.Count -ne 3) { throw "Missing actual $mode outcome/rounds" }
  foreach($round in $entry.rounds) {
    if($round.warmupSeconds -ne 30 -or $round.measurementMs -lt 60000 -or $round.samples.Count -ne 60) { throw 'Invalid measurement duration/sample count' }
    if($round.cleanup.liveSources -ne 0 -or $round.cleanup.activeRegistrations -ne 0 -or $round.cleanup.outstandingDescriptors -ne 0) {throw 'Resource leak in round'}
    $raw=Join-Path $measureOutput "$mode-round-$($round.round).json"
    if (!(Test-Path $raw) -or (Get-Content $raw -Raw | ConvertFrom-Json).measurementMs -ne $round.measurementMs) {throw 'Missing/mismatched raw round'}
  }
  foreach($metric in 'gpuUtilization','vram') { if(!$entry.$metric.available -and !$entry.$metric.reason) {throw 'Unavailable metric needs a reason'} }
}
if (!$CheckReport) {
  Get-ChildItem $measureOutput -File | Where-Object Name -ne 'hashes.json' | ForEach-Object { @{file=$_.Name;sha256=(Get-FileHash $_.FullName -Algorithm SHA256).Hash} } | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $measureOutput 'hashes.json')
} else {
  foreach ($record in (Get-Content (Join-Path $measureOutput 'hashes.json') -Raw | ConvertFrom-Json)) {
    if ($record.file -ne [IO.Path]::GetFileName($record.file) -or $record.sha256 -notmatch '^[0-9A-Fa-f]{64}$') {throw 'Invalid evidence hash record'}
    if ((Get-FileHash (Join-Path $measureOutput $record.file) -Algorithm SHA256).Hash -ne $record.sha256) {throw "Evidence drift: $($record.file)"}
  }
}
Write-Output "PASS Both: 30s warmup + 60s window x3 per backend. Report=$measureOutput/report.json"
