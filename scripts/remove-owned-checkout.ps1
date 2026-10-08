param([Parameter(Mandatory)][string]$Parent,[Parameter(Mandatory)][string]$Checkout)
$ErrorActionPreference='Stop'
$ownedParent=(Resolve-Path -LiteralPath $Parent).Path
$ownedCheckout=(Resolve-Path -LiteralPath $Checkout).Path
if(!$ownedCheckout.StartsWith(($ownedParent+[IO.Path]::DirectorySeparatorChar),[StringComparison]::OrdinalIgnoreCase) -or (Get-Item -LiteralPath $Checkout).LinkType){throw 'Checkout cleanup ownership violation'}
Remove-Item -LiteralPath $ownedCheckout -Recurse -Force
