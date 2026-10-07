param([ValidateSet('Quick','Deep')][string]$Mode = 'Quick', [string]$Output = 'docs/baseline/environment.json')
$ErrorActionPreference = 'Stop'
$doctorScript = Join-Path $PSScriptRoot 'doctor.cjs'
$nodeCommand = Get-Command node -CommandType Application -ErrorAction Stop | Select-Object -First 1
& $nodeCommand.Source $doctorScript '--mode' $Mode '--output' $Output
exit $LASTEXITCODE
