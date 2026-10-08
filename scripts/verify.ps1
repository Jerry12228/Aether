param([ValidateSet('Core','UI','All')][string]$Scope='All',[switch]$Automation,[switch]$CleanCheckout)
$ErrorActionPreference='Stop'
$verifyArguments=@((Join-Path $PSScriptRoot 'verify.cjs'),'--scope',$Scope)
if($Automation){$verifyArguments+='--automation'}
if($CleanCheckout){$verifyArguments+='--clean-checkout'}
& node @verifyArguments
exit $LASTEXITCODE
