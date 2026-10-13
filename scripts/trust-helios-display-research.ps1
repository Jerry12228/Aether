# Explicit certificate-only authorization, recorded in the current GSD quick task.
# No device, driver, policy or power operations.
$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
$packageRoot=Join-Path $repoRoot 'artifacts/phase03/selfsigned-research/helios-1791521377539'
$pin='E3ED742C3D08188A117AFF7B6C1BB207523EB4DB'
$cert=[Security.Cryptography.X509Certificates.X509Certificate2]::new((Join-Path $packageRoot 'HeliosDisplayResearch.cer'))
if ($cert.Thumbprint -ne $pin -or $cert.HasPrivateKey) { throw 'Expected public research certificate only.' }
$authorization='授权，仅导入该证书并复核'
$records=@()
foreach ($storeName in @('Root','TrustedPublisher')) {
    $store=[Security.Cryptography.X509Certificates.X509Store]::new($storeName,'LocalMachine')
    try {
        $store.Open([Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
        $existed=@($store.Certificates | Where-Object Thumbprint -eq $pin).Count -gt 0
        if (!$existed) { $store.Add($cert) }
        $present=@($store.Certificates | Where-Object Thumbprint -eq $pin).Count -eq 1
        if (!$present) { throw "Exact certificate missing from $storeName" }
        $records+=@{store="LocalMachine\$storeName";existedBefore=$existed;presentAfter=$present;added=!$existed}
    } finally { $store.Close() }
}
$report=@{recordedAt=[DateTime]::UtcNow.ToString('o');userText=$authorization;thumbprint=$pin;stores=$records;driverInstalled=$false;deviceCreated=$false;securityPolicyChanged=$false;powerOperation=$false;rollback="Remove only Cert:\LocalMachine\Root\$pin and Cert:\LocalMachine\TrustedPublisher\$pin if added by this action."}
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $packageRoot 'trust-import.json') -Encoding utf8
$report | ConvertTo-Json -Depth 5 -Compress
