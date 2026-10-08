param([switch]$Restore)
$ErrorActionPreference='Stop'
$prepareRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$launcher=(Get-Command flutter -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$bin=Split-Path $launcher
$dart=Join-Path $bin 'cache/dart-sdk/bin/dart.exe'
$snapshot=Join-Path $bin 'cache/flutter_tools.snapshot'
if (!(Test-Path -LiteralPath $dart) -or !(Test-Path -LiteralPath $snapshot)) { throw 'Bootstrap the pinned Flutter SDK first' }
$junction=Join-Path $prepareRoot 'apps/selene/windows/flutter/ephemeral/.plugin_symlinks/selene_native'
$target=Join-Path $prepareRoot 'packages/selene_native'
if (!(Test-Path -LiteralPath $junction)) {
  New-Item -ItemType Directory -Path (Split-Path $junction) -Force | Out-Null
  New-Item -ItemType Junction -Path $junction -Target $target | Out-Null
} else {
  $existing=Get-Item -LiteralPath $junction
  if ($existing.LinkType -notin @('Junction','SymbolicLink') -or [IO.Path]::GetFullPath($existing.Target) -ne $target) { throw 'Existing plugin link has an unexpected target/type' }
}
if ($Restore) {
  Push-Location (Join-Path $prepareRoot 'apps/selene')
  try { & $dart $snapshot --suppress-analytics pub get --enforce-lockfile; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
  finally { Pop-Location }
}
Write-Output 'PASS repository-local Flutter plugin link'
