param([Parameter(Mandatory)][ValidateSet('Helios','Selene')][string]$Target,[ValidateSet('Debug','Release')][string]$Configuration='Release',[ValidateRange(1,3600)][int]$BudgetSeconds=900)
$ErrorActionPreference='Stop'
& node (Join-Path $PSScriptRoot 'build.cjs') --target $Target --configuration $Configuration --budget-seconds $BudgetSeconds
exit $LASTEXITCODE
