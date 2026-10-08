param([string[]]$Packages = @('ffigen:23.0.0', 'ffi:2.2.0'), [string]$FromDryRun, [switch]$Append)
$ErrorActionPreference = 'Stop'
$auditRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../build/dependency-audit'))
New-Item -ItemType Directory -Path $auditRoot -Force | Out-Null
$records = @()
if ($Append -and (Test-Path -LiteralPath (Join-Path $auditRoot 'audited.json'))) { $records = @(Get-Content -LiteralPath (Join-Path $auditRoot 'audited.json') -Raw | ConvertFrom-Json) }
if ($FromDryRun) {
  $Packages = @(Get-Content -LiteralPath $FromDryRun | ForEach-Object {
    if ($_ -match '^\+ ([_a-z][_a-z0-9]*) ([0-9]+\.[0-9]+\.[0-9]+)($| \([^)]+\)$)') { "$($Matches[1]):$($Matches[2])" }
  })
  if ($Packages.Count -lt 2) { throw 'Empty dependency selection' }
}
foreach ($identity in $Packages) {
  if ($identity -notmatch '^([_a-z][_a-z0-9]*):([0-9]+\.[0-9]+\.[0-9]+(?:[-+][a-z0-9.]+)?)$') { throw 'Invalid package identity' }
  $packageName = $Matches[1]; $packageVersion = $Matches[2]
  $metadata = Invoke-RestMethod -Uri "https://pub.dev/api/packages/$packageName/versions/$packageVersion" -TimeoutSec 30
  if ($metadata.version -ne $packageVersion -or $metadata.pubspec.name -ne $packageName -or $metadata.archive_url -ne "https://pub.dev/api/archives/$packageName-$packageVersion.tar.gz") { throw 'Registry identity mismatch' }
  $archive = Join-Path $auditRoot "$packageName-$packageVersion.tar.gz"
  Invoke-WebRequest -Uri $metadata.archive_url -OutFile $archive -TimeoutSec 60
  $digest = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($digest -ne $metadata.archive_sha256) { throw "Archive hash mismatch: $identity" }
  $inventory = & tar -tzf $archive
  if ($LASTEXITCODE -ne 0 -or ($inventory | Where-Object { $_ -match '(^/|^[A-Za-z]:|(^|/)\.\.(/|$))' })) { throw 'Unsafe archive path' }
  $licenseEntry = @($inventory | Where-Object { $_ -match '^(\./)?LICENSE(?:\.md|\.txt)?$' } | Select-Object -First 1)
  if ($licenseEntry.Count -ne 1) { throw "Missing root LICENSE: $identity" }
  $licenseText = (& tar -xOzf $archive $licenseEntry[0]) -join "`n"
  if ($LASTEXITCODE -ne 0 -or -not $licenseText.Trim()) { throw 'Empty LICENSE' }
  $metadata | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $auditRoot "$packageName-$packageVersion.json") -Encoding utf8
  $licenseText | Set-Content -LiteralPath (Join-Path $auditRoot "$packageName-$packageVersion.LICENSE") -Encoding utf8
  $license = if ($licenseText -match 'Redistribution and use' -and $licenseText -match 'Neither the name') { 'BSD-3-Clause' } elseif ($licenseText -match 'Redistribution and use' -and $licenseText -match 'THIS SOFTWARE IS PROVIDED') { 'BSD-2-Clause' } elseif ($licenseText -match 'Apache License' -and $licenseText -match '2.0') { 'Apache-2.0' } elseif ($licenseText -match 'Permission is hereby granted') { 'MIT' } else { 'REVIEW-REQUIRED' }
  if ($license -eq 'REVIEW-REQUIRED') { throw "Specific LICENSE needs review: $identity" }
  $publisher = (Invoke-RestMethod -Uri "https://pub.dev/api/packages/$packageName/publisher" -TimeoutSec 30).publisherId
  $records += [ordered]@{ name=$packageName; version=$packageVersion; archiveUrl=$metadata.archive_url; sha256=$digest; publisher=$publisher; repository=$metadata.pubspec.repository; homepage=$metadata.pubspec.homepage; sdk=$metadata.pubspec.environment.sdk; license=$license; licenseSha256=(Get-FileHash -LiteralPath (Join-Path $auditRoot "$packageName-$packageVersion.LICENSE")).Hash.ToLowerInvariant(); published=$metadata.published }
}
$records | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $auditRoot 'audited.json') -Encoding utf8
Write-Output "Audited $($records.Count) official pub archives; hashes and license texts saved under build/dependency-audit."
