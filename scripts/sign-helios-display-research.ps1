# Dedicated self-signed research package. Creates a CurrentUser\My signing key only;
# no trust-root/publisher imports, installation, security-policy or device operations.
param(
    [Parameter(Mandatory=$true)]
    [ValidatePattern('^artifacts/phase03/derived-research/helios-[0-9]+$')]
    [string]$SourceRoot,
    [switch]$SelfSignResearch,
    [switch]$ReuseAuthorizedCertificate
)
$ErrorActionPreference = 'Stop'
if (!$SelfSignResearch) { throw 'Explicit -SelfSignResearch is required.' }
$repoRoot = Split-Path -Parent $PSScriptRoot
$source = [IO.Path]::GetFullPath((Join-Path $repoRoot $SourceRoot))
$sourceManifest = Get-Content -LiteralPath (Join-Path $source 'research-source.json') -Raw | ConvertFrom-Json
if ($sourceManifest.sourceCommit -ne 'a4b09fa2aa731a964d0cb5d139cb1e6240e4da12') { throw 'Unexpected source pin.' }
$unsigned = Get-Content -LiteralPath (Join-Path $repoRoot "artifacts/phase03/signing-preparation/$(Split-Path $source -Leaf)/submission-manifest.json") -Raw | ConvertFrom-Json
$expectedNames=@('HeliosDisplay.dll','HeliosDisplay.inf','HeliosDisplay.pdb','heliosdisplay.cat') | Sort-Object
if ((@($unsigned.members.name | Sort-Object) -join '|') -cne ($expectedNames -join '|')) { throw 'Unexpected submission member inventory.' }
if ($sourceManifest.files.Count -ne 8) { throw 'Unexpected source inventory.' }
foreach ($entry in $sourceManifest.files) {
    $inputPath=[IO.Path]::GetFullPath((Join-Path $source $entry.outputPath))
    if (!$inputPath.StartsWith($source+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase) -or (Get-FileHash -LiteralPath $inputPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $entry.sha256) { throw 'Prepared source bytes changed.' }
}
foreach ($entry in $sourceManifest.independentInputs) {
    $inputPath=[IO.Path]::GetFullPath((Join-Path $repoRoot $entry.path))
    if (!$inputPath.StartsWith($repoRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase) -or (Get-FileHash -LiteralPath $inputPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $entry.sha256) { throw 'Transform input bytes changed.' }
}
foreach ($entry in $unsigned.members) {
    $inputPath = [IO.Path]::GetFullPath((Join-Path $repoRoot $entry.path))
    if (!$inputPath.StartsWith($source + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Unexpected package input path.' }
    if ((Get-FileHash -LiteralPath $inputPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $entry.sha256) { throw 'Unsigned package input mismatch.' }
}
$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$output = Join-Path $repoRoot "artifacts/phase03/selfsigned-research/helios-$stamp"
if (Test-Path -LiteralPath $output) { throw 'Output already exists.' }
$packageDir = Join-Path $output 'HeliosDisplayX64'
New-Item -ItemType Directory -Path $packageDir | Out-Null
foreach ($entry in $unsigned.members) {
    Copy-Item -LiteralPath (Join-Path $repoRoot $entry.path) -Destination (Join-Path $packageDir $entry.name)
}
if ($ReuseAuthorizedCertificate) {
    $certificate=Get-Item -LiteralPath 'Cert:\CurrentUser\My\E3ED742C3D08188A117AFF7B6C1BB207523EB4DB'
    if (!$certificate.HasPrivateKey -or $certificate.NotAfter -lt (Get-Date)) { throw 'Authorized signing certificate unavailable.' }
} else {
    $certificate = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=Aether Helios Research $stamp" -CertStoreLocation 'Cert:\CurrentUser\My' -Provider 'Microsoft Software Key Storage Provider' -KeyExportPolicy NonExportable -KeyAlgorithm RSA -KeyLength 3072 -HashAlgorithm SHA256 -NotAfter (Get-Date).AddMonths(6)
}
Export-Certificate -Cert $certificate -FilePath (Join-Path $output 'HeliosDisplayResearch.cer') | Out-Null
$metadata = [ordered]@{
    scope='self-signed research only; no Windows default trust or provider admission'
    sourceRoot=$SourceRoot
    certificateReused=[bool]$ReuseAuthorizedCertificate
    signingScriptSha256=(Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()
    certificate=[ordered]@{store='CurrentUser\My';thumbprint=$certificate.Thumbprint;subject=$certificate.Subject;notBefore=$certificate.NotBefore.ToUniversalTime().ToString('o');notAfter=$certificate.NotAfter.ToUniversalTime().ToString('o');privateKeyExported=$false;keyExportPolicy='NonExportable';rsaBits=3072;publicCertificate='HeliosDisplayResearch.cer'}
    trustStoresChanged=$false
    installed=$false
    signingCompleted=$false
}
$metadata | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $output 'signing-state.json') -Encoding utf8
$signTool = 'C:\Program Files (x86)\Windows Kits\10\bin\10.0.28000.0\x64\signtool.exe'
$inf2cat = 'C:\Program Files (x86)\Windows Kits\10\bin\10.0.28000.0\x86\Inf2Cat.exe'
& $signTool sign /s My /sha1 $certificate.Thumbprint /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 /v (Join-Path $packageDir 'HeliosDisplay.dll') *> (Join-Path $output 'sign-dll.log')
if ($LASTEXITCODE -ne 0) { throw "DLL signing failed; inspect $output/sign-dll.log." }
# Signing changes DLL bytes. Regenerate CAT before signing it; preserve the unsigned package.
& $inf2cat "/driver:$packageDir" /os:10_VB_X64,10_CO_X64,10_NI_X64,10_GE_X64 /verbose *> (Join-Path $output 'inf2cat.log')
if ($LASTEXITCODE -ne 0) { throw "CAT generation failed; inspect $output/inf2cat.log." }
& $signTool sign /s My /sha1 $certificate.Thumbprint /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 /v (Join-Path $packageDir 'heliosdisplay.cat') *> (Join-Path $output 'sign-cat.log')
if ($LASTEXITCODE -ne 0) { throw "CAT signing failed; inspect $output/sign-cat.log." }
$metadata.signingCompleted=$true
$metadata.members=@(Get-ChildItem -LiteralPath $packageDir -File | ForEach-Object { [ordered]@{name=$_.Name;length=$_.Length;sha256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()} })
$metadata | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $output 'signing-state.json') -Encoding utf8
Write-Output ([ordered]@{output=$output;thumbprint=$certificate.Thumbprint;signingCompleted=$true;trustStoresChanged=$false;installed=$false} | ConvertTo-Json -Compress)
