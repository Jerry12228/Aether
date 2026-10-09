# Verifies bytes and an explicitly pinned research certificate in memory.
# Also observes Windows default trust; it never imports certificates or installs devices.
param(
    [Parameter(Mandatory=$true)]
    [ValidatePattern('^artifacts/phase03/selfsigned-research/helios-[0-9]+$')]
    [string]$PackageRoot
)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
$output=Join-Path $repoRoot $PackageRoot
$state=Get-Content -LiteralPath (Join-Path $output 'signing-state.json') -Raw | ConvertFrom-Json
$cert=[Security.Cryptography.X509Certificates.X509Certificate2]::new((Join-Path $output 'HeliosDisplayResearch.cer'))
if ($cert.Thumbprint -ne $state.certificate.thumbprint -or !$state.signingCompleted) { throw 'Certificate pin or signing state mismatch.' }
Add-Type -AssemblyName System.Security.Cryptography.Pkcs
Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class HeliosCatalogVerifier {
 [StructLayout(LayoutKind.Sequential)] public struct Member {
  public uint size; public IntPtr tag; public IntPtr file; public Guid subject;
  public uint flags; public IntPtr indirect; public uint certVersion; public uint reserved;
  public IntPtr handle; public IntPtr encoded; public uint encodedSize;
 }
 [DllImport("wintrust.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CryptCATOpen(string name,uint flags,IntPtr provider,uint version,uint encoding);
 [DllImport("wintrust.dll",SetLastError=true)] static extern IntPtr CryptCATEnumerateMember(IntPtr cat,IntPtr previous);
 [DllImport("wintrust.dll")] static extern bool CryptCATClose(IntPtr cat);
 [DllImport("wintrust.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool CryptCATAdminAcquireContext2(out IntPtr admin,IntPtr subsystem,string algorithm,IntPtr policy,uint flags);
 [DllImport("wintrust.dll",SetLastError=true)] static extern bool CryptCATAdminCalcHashFromFileHandle2(IntPtr admin,IntPtr file,ref uint size,byte[] bytes,uint flags);
 [DllImport("wintrust.dll")] static extern bool CryptCATAdminReleaseContext(IntPtr admin,uint flags);
 public static string[] Tags(string filename) {
  var cat=CryptCATOpen(filename,0,IntPtr.Zero,0,0);
  if(cat==IntPtr.Zero || cat==new IntPtr(-1))throw new InvalidOperationException("Cannot open catalog");
  try {var tags=new List<string>();var previous=IntPtr.Zero;
   while((previous=CryptCATEnumerateMember(cat,previous))!=IntPtr.Zero){var m=Marshal.PtrToStructure<Member>(previous);tags.Add(Marshal.PtrToStringUni(m.tag));}
   return tags.ToArray();
  }finally{CryptCATClose(cat);}
 }
 public static string Hash(string filename) {
  IntPtr admin;
  if(!CryptCATAdminAcquireContext2(out admin,IntPtr.Zero,"SHA256",IntPtr.Zero,0))throw new InvalidOperationException("Cannot acquire catalog hash context");
  try{using(var file=File.OpenRead(filename)){uint size=0;var handle=file.SafeFileHandle.DangerousGetHandle();
   if(!CryptCATAdminCalcHashFromFileHandle2(admin,handle,ref size,null,0))throw new InvalidOperationException("Cannot size catalog member hash");
   var bytes=new byte[size];if(!CryptCATAdminCalcHashFromFileHandle2(admin,handle,ref size,bytes,0))throw new InvalidOperationException("Cannot calculate catalog member hash");
   return BitConverter.ToString(bytes).Replace("-","");
  }}finally{CryptCATAdminReleaseContext(admin,0);}
 }
}
'@
$packageDir=Join-Path $output 'HeliosDisplayX64'
$catPath=Join-Path $packageDir 'heliosdisplay.cat'
$cms=[Security.Cryptography.Pkcs.SignedCms]::new()
$cms.Decode([IO.File]::ReadAllBytes($catPath))
$cms.CheckSignature($true)
if ($cms.SignerInfos.Count -ne 1 -or $cms.SignerInfos[0].Certificate.Thumbprint -ne $cert.Thumbprint) { throw 'Catalog signer mismatch.' }
$pinnedChain=[Security.Cryptography.X509Certificates.X509Chain]::new()
$pinnedChain.ChainPolicy.TrustMode=[Security.Cryptography.X509Certificates.X509ChainTrustMode]::CustomRootTrust
$null=$pinnedChain.ChainPolicy.CustomTrustStore.Add($cert)
$pinnedChain.ChainPolicy.RevocationMode=[Security.Cryptography.X509Certificates.X509RevocationMode]::NoCheck
$null=$pinnedChain.ChainPolicy.ApplicationPolicy.Add([Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.3'))
if (!$pinnedChain.Build($cert)) { throw 'Pinned in-memory code-signing chain failed.' }
$tags=[HeliosCatalogVerifier]::Tags($catPath)
$members=@()
foreach ($name in @('HeliosDisplay.inf','HeliosDisplay.dll')) {
    $hash=[HeliosCatalogVerifier]::Hash((Join-Path $packageDir $name))
    if ($tags -notcontains $hash) { throw "Catalog member mismatch: $name" }
    $members+=@{name=$name;catalogHash=$hash;matches=$true}
}
$signer=$cms.SignerInfos[0]
$timestampAttribute=@($signer.UnsignedAttributes | Where-Object {$_.Oid.Value -eq '1.3.6.1.4.1.311.3.3.1'})
if ($timestampAttribute.Count -ne 1) { throw 'RFC3161 timestamp required.' }
$token=[Security.Cryptography.Pkcs.SignedCms]::new()
$token.Decode($timestampAttribute[0].Values[0].RawData)
$token.CheckSignature($true)
$asn=[System.Formats.Asn1.AsnReader]::new([ReadOnlyMemory[byte]]::new($token.ContentInfo.Content),[System.Formats.Asn1.AsnEncodingRules]::DER)
$sequence=$asn.ReadSequence()
$null=$sequence.ReadInteger();$null=$sequence.ReadObjectIdentifier()
$imprint=$sequence.ReadSequence();$algorithm=$imprint.ReadSequence()
if ($algorithm.ReadObjectIdentifier() -ne '2.16.840.1.101.3.4.2.1') { throw 'Timestamp hash must be SHA256.' }
$expected=[Security.Cryptography.SHA256]::HashData($signer.GetSignature())
$actual=$imprint.ReadOctetString()
if ([Convert]::ToHexString($expected) -ne [Convert]::ToHexString($actual)) { throw 'Timestamp does not bind catalog signature.' }
$null=$sequence.ReadInteger();$timestamp=$sequence.ReadGeneralizedTime()
$timestampChain=[Security.Cryptography.X509Certificates.X509Chain]::new()
$timestampChain.ChainPolicy.RevocationMode=[Security.Cryptography.X509Certificates.X509RevocationMode]::NoCheck
$null=$timestampChain.ChainPolicy.ApplicationPolicy.Add([Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.8'))
if (!$timestampChain.Build($token.SignerInfos[0].Certificate)) { throw 'Timestamp signer default chain failed.' }
$tool='C:\Program Files (x86)\Windows Kits\10\bin\10.0.28000.0\x64\signtool.exe'
$policy=@()
foreach ($name in @('HeliosDisplay.inf','HeliosDisplay.dll')) {
    & $tool verify /pa /v /c $catPath (Join-Path $packageDir $name) *> (Join-Path $output "default-policy-$name.log")
    $policy+=@{name=$name;exitCode=$LASTEXITCODE}
}
$embedded=Get-AuthenticodeSignature -LiteralPath (Join-Path $packageDir 'HeliosDisplay.dll')
if ($embedded.SignerCertificate.Thumbprint -ne $cert.Thumbprint) { throw 'DLL embedded signer mismatch.' }
$report=[ordered]@{
    scope='pinned cryptography and observed Windows default Authenticode trust; no installation test'
    signerThumbprint=$cert.Thumbprint
    catalogCryptographicSignatureVerified=$true
    pinnedCodeSigningChainVerified=$true
    catalogMembers=$members
    timestamp=@{verified=$true;timestampUtc=$timestamp.ToUniversalTime().ToString('o');signerThumbprint=$token.SignerInfos[0].Certificate.Thumbprint;defaultChainVerified=$true;revocationMode='NoCheck';bindsCatalogSignature=$true}
    dllEmbeddedSignerMatches=$true
    defaultWindowsPolicy=$policy
    defaultWindowsTrustVerified=(@($policy | Where-Object {$_.exitCode -ne 0}).Count -eq 0)
    trustStoresChanged=$false
    verificationScriptSha256=(Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()
    observedAt=[DateTime]::UtcNow.ToString('o')
    installed=$false
}
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $output 'signature-verification.json') -Encoding utf8
Write-Output ($report | ConvertTo-Json -Depth 8 -Compress)
