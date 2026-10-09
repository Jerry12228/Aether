param([Parameter(Mandatory=$true)][ValidatePattern('^artifacts/phase03/derived-research/helios-[0-9]+$')][string]$SourceRoot)
$ErrorActionPreference='Stop'
$repo=Split-Path -Parent $PSScriptRoot
if ((git -C $repo rev-parse --show-toplevel) -ne (git -C 'D:/WorkSpace/Aether' rev-parse --show-toplevel)) {throw 'FATAL supplied root pin mismatch'}
$out=Join-Path $repo "artifacts/phase03/apollo-install-preflight/$(Split-Path $SourceRoot -Leaf)"
New-Item -ItemType Directory -Path $out -Force | Out-Null
$project=Join-Path $repo "$SourceRoot/Virtual Display Driver (HDR)/SudoVDA/SudoVDA.vcxproj"
& 'C:/Program Files/Microsoft Visual Studio/18/Enterprise/MSBuild/Current/Bin/MSBuild.exe' $project /t:Build /p:Configuration=Release /p:Platform=x64 /p:SignMode=Off /p:DriverDeployment=false /nologo *> (Join-Path $out 'driver-build.log')
if($LASTEXITCODE -ne 0){throw 'WDK build failed'}
# Bundled MSBuild InfVerif reports an existing loader exception despite exit0.
# Run the installed x64 verifier independently for each applicable target.
$inf=Join-Path $repo "$SourceRoot/Virtual Display Driver (HDR)/SudoVDA/x64/Release/SudoVDA/HeliosDisplay.inf"
$checks=@()
foreach($build in @('16299','17134','19045','22000','26100','global')){
 $args=@('/w','/v'); if($build -ne 'global'){$args+=@('/osver',"NTamd64.10.0...$build")};$args+=$inf
 $log=Join-Path $out "inf-$build.log"
 & 'C:/Program Files (x86)/Windows Kits/10/Tools/10.0.28000.0/x64/infverif.exe' @args *> $log
 $checks+=@{label=$build;status=$LASTEXITCODE;log=[IO.Path]::GetRelativePath($repo,$log).Replace('\','/')}
 if($LASTEXITCODE -ne 0){throw "Independent INF check failed $build"}
}
$checks | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $out 'inf-results.json') -Encoding utf8
$members=@('HeliosDisplay.dll','HeliosDisplay.inf','heliosdisplay.cat','HeliosDisplay.pdb') | ForEach-Object {
 $p=if($_ -eq 'HeliosDisplay.pdb'){Join-Path $repo "$SourceRoot/Virtual Display Driver (HDR)/SudoVDA/x64/Release/$_"}else{Join-Path (Split-Path $inf -Parent) $_}
 if(!(Test-Path -LiteralPath $p)){throw "Missing required output $_"}
 @{name=$_;path=[IO.Path]::GetRelativePath($repo,$p).Replace('\','/');length=(Get-Item -LiteralPath $p).Length;sha256=(Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant()}
}
$submission=Join-Path $repo "artifacts/phase03/signing-preparation/$(Split-Path $SourceRoot -Leaf)"
New-Item -ItemType Directory -Path $submission -Force | Out-Null
@{sourceRoot=$SourceRoot;members=@($members);scope='unsigned WUDF isolation correction; no deployment'} | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $submission 'submission-manifest.json') -Encoding utf8
Write-Output (@{status='verified';sourceRoot=$SourceRoot;infChecks=$checks.Count;systemMutation=$false;buildEvidence=[IO.Path]::GetRelativePath($repo,(Join-Path $out 'driver-build.log')).Replace('\','/')} | ConvertTo-Json -Compress)
