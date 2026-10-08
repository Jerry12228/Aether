param([switch]$Automation,[ValidateSet('Debug','Release')][string]$Configuration='Debug')
$ErrorActionPreference='Stop'
$heliosRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$env:AETHER_CONFIGURATION=$Configuration
Push-Location $heliosRoot
try { & node --test --test-reporter=tap tests/helios-process.test.cjs; exit $LASTEXITCODE } finally { Pop-Location }
