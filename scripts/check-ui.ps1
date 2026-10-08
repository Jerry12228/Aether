param([Parameter(Mandatory)][ValidateSet('Panel','Lifecycle')][string]$Suite,[switch]$Automation)
$ErrorActionPreference='Stop'
& node (Join-Path $PSScriptRoot '../tests/ui-check.cjs') $Suite
exit $LASTEXITCODE
