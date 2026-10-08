param([Parameter(Mandatory)][ValidateSet('absolute','flutter-trailing-separator','relative','foreign')][string]$Mode)
$ErrorActionPreference='Stop'
$probeRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$probeLink=Join-Path $probeRoot 'apps/selene/windows/flutter/ephemeral/.plugin_symlinks/selene_native'
$probeTarget=Join-Path $probeRoot 'packages/selene_native'
# Exercise the actual prepare entry point with the link metadata produced by
# Flutter. No symlink privilege, package restore or target replacement is needed.
function Get-Item {
 param([string]$LiteralPath)
 if($LiteralPath -eq $probeLink){
  $reported=switch($Mode){
   'absolute' {$probeTarget}
   'flutter-trailing-separator' {$probeTarget + [IO.Path]::DirectorySeparatorChar}
   'relative' {[IO.Path]::GetRelativePath((Split-Path $probeLink),$probeTarget)}
   'foreign' {(Join-Path $probeRoot 'references/upstream')}
  }
  return [pscustomobject]@{LinkType='SymbolicLink';Target=$reported}
 }
 Microsoft.PowerShell.Management\Get-Item -LiteralPath $LiteralPath
}
& (Join-Path $probeRoot 'scripts/prepare-flutter.ps1')
