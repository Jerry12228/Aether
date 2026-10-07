param([string]$RepositoryName)
$ErrorActionPreference = 'Stop'
$aetherRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$aetherLock = Get-Content -LiteralPath (Join-Path $aetherRoot 'references/upstream-lock.json') -Raw | ConvertFrom-Json
$aetherRepos = @($aetherLock.repositories)
if ($RepositoryName) {
    $aetherRepos = @($aetherRepos | Where-Object name -eq $RepositoryName)
    if (-not $aetherRepos.Count) { throw "Unknown repository: $RepositoryName" }
}
foreach ($aetherRepo in $aetherRepos) {
    $aetherExpected = [IO.Path]::GetFullPath((Join-Path $aetherRoot ('references/upstream/' + $aetherRepo.name)))
    $aetherTarget = [IO.Path]::GetFullPath((Join-Path $aetherRoot $aetherRepo.path))
    if ($aetherTarget -ne $aetherExpected -or $aetherRepo.name -notmatch '^[a-z0-9-]+$') { throw 'Invalid lock path' }
    if (Test-Path -LiteralPath $aetherTarget) {
        $aetherHead = & git -C $aetherTarget rev-parse HEAD
        if ($LASTEXITCODE -ne 0) { throw "Not a checkout: $aetherTarget" }
        if ($aetherHead -ne $aetherRepo.commit) { throw "SHA differs: $($aetherRepo.name). Existing checkout retained." }
        $aetherChanges = & git -C $aetherTarget status --porcelain
        if ($LASTEXITCODE -ne 0) { throw 'Status failed' }
        if ($aetherChanges) { Write-Warning "Local changes retained: $($aetherRepo.name)" }
        Write-Output "Verified $($aetherRepo.name) $aetherHead"
        continue
    }
    if ($aetherRepo.url -notmatch '^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+\.git$') { throw 'Unexpected source URL' }
    New-Item -ItemType Directory -Path $aetherTarget -Force | Out-Null
    & git -C $aetherTarget init
    if ($LASTEXITCODE -ne 0) { throw 'Init failed' }
    & git -C $aetherTarget remote add origin $aetherRepo.url
    if ($LASTEXITCODE -ne 0) { throw 'Remote failed' }
    & git -C $aetherTarget fetch --depth 1 origin $aetherRepo.commit
    if ($LASTEXITCODE -ne 0) { throw "Fetch failed; partial checkout retained: $aetherTarget" }
    & git -C $aetherTarget checkout --detach $aetherRepo.commit
    if ($LASTEXITCODE -ne 0) { throw 'Checkout failed' }
    Write-Output "Cloned $($aetherRepo.name) $($aetherRepo.commit)"
}
