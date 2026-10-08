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
function Ensure-LocalPluginLink {
 if (!(Test-Path -LiteralPath $junction)) {
   New-Item -ItemType Directory -Path (Split-Path $junction) -Force | Out-Null
   New-Item -ItemType Junction -Path $junction -Target $target | Out-Null
 } else {
   $existing=Get-Item -LiteralPath $junction
   if ($existing.LinkType -notin @('Junction','SymbolicLink') -or [IO.Path]::GetFullPath($existing.Target) -ne $target) { throw 'Existing plugin link has an unexpected target/type' }
 }
}
Ensure-LocalPluginLink
if ($Restore) {
  Push-Location (Join-Path $prepareRoot 'apps/selene')
  try {
    & $dart $snapshot --suppress-analytics pub get --enforce-lockfile 2>&1 | Tee-Object -Variable restoreOutput
    $restoreExit=$LASTEXITCODE
    if ($restoreExit -ne 0) {
      # The locked SDK deletes links when its generated plugin list changes.
      # Retry only its exact privilege diagnostic, after validating that actual
      # generated metadata names the single reviewed repository-local plugin.
      $metadataPath=Join-Path $prepareRoot 'apps/selene/.flutter-plugins-dependencies'
      if(($restoreOutput -join "`n") -notmatch 'Building with plugins requires symlink support\.' -or !(Test-Path -LiteralPath $metadataPath)){exit $restoreExit}
      $metadata=Get-Content -LiteralPath $metadataPath -Raw | ConvertFrom-Json
      $windowsPlugins=@($metadata.plugins.windows)
      if($windowsPlugins.Count -ne 1 -or $windowsPlugins[0].name -ne 'selene_native' -or [IO.Path]::GetFullPath($windowsPlugins[0].path).TrimEnd('\','/') -ne $target.TrimEnd('\','/')){throw 'Unreviewed plugin metadata; privilege recovery refused'}
      Ensure-LocalPluginLink
      Write-Output 'RECOVERY: first restore emitted locked plugin metadata; recreate verified local junction and retry once'
      & $dart $snapshot --suppress-analytics pub get --enforce-lockfile
      if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
    }
  }
  finally { Pop-Location }
}
Write-Output 'PASS repository-local Flutter plugin link'
