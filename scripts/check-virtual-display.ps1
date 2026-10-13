param(
 [ValidateSet('Contract','Machine')][string]$Mode='Contract',
 [ValidateSet('Install','Topology','Persistence','DeleteIsolation','ResetRecovery','UpdateRollback','RebootCheck','All')][string]$Scenario='All',
 [ValidateSet('Debug','Release')][string]$Configuration='Release',
 [string]$Authorization='',
 [string]$Output='artifacts/phase03/package-contract'
)
$ErrorActionPreference='Stop'
$taskArguments=@('--mode',$Mode,'--scenario',$Scenario,'--configuration',$Configuration,'--output',$Output)
if($Authorization){$taskArguments+=@('--authorization',$Authorization)}
& node (Join-Path $PSScriptRoot 'virtual-display-package-runner.cjs') @taskArguments
exit $LASTEXITCODE
