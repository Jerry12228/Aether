param([string]$RepositoryName, [switch]$VerifyOnly)
$ErrorActionPreference = 'Stop'
$aetherRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$aetherGit = (Get-Command git.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
function Assert-AetherPath([string]$Target) {
    $aetherRelative = [IO.Path]::GetRelativePath($aetherRoot, $Target)
    if ([IO.Path]::IsPathRooted($aetherRelative) -or $aetherRelative -eq '..' -or $aetherRelative.StartsWith('..' + [IO.Path]::DirectorySeparatorChar)) { throw 'Path escapes Aether root' }
    $aetherCursor = $aetherRoot
    foreach ($aetherPart in ($aetherRelative -split '[\\/]')) {
        $aetherCursor = Join-Path $aetherCursor $aetherPart
        if (Test-Path -LiteralPath $aetherCursor) {
            if ((Get-Item -LiteralPath $aetherCursor -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Reparse point rejected: $aetherCursor" }
        }
    }
}
function Invoke-AetherGit([string]$Directory, [string[]]$Arguments) {
    $aetherInfo = [Diagnostics.ProcessStartInfo]::new()
    $aetherInfo.FileName = $aetherGit
    $aetherInfo.UseShellExecute = $false
    $aetherInfo.CreateNoWindow = $true
    $aetherInfo.RedirectStandardOutput = $true
    $aetherInfo.RedirectStandardError = $true
    $aetherInfo.Environment['GIT_OPTIONAL_LOCKS'] = '0'
    $aetherInfo.Environment['GIT_TERMINAL_PROMPT'] = '0'
    foreach ($aetherArg in @('--no-pager', '-c', 'core.fsmonitor=false', '-C', $Directory) + $Arguments) { $aetherInfo.ArgumentList.Add($aetherArg) }
    $aetherProcess = [Diagnostics.Process]::new()
    $aetherProcess.StartInfo = $aetherInfo
    try {
        if (-not $aetherProcess.Start()) { throw 'Git start failed' }
        $aetherOutTask = $aetherProcess.StandardOutput.ReadToEndAsync()
        $aetherErrTask = $aetherProcess.StandardError.ReadToEndAsync()
        if (-not $aetherProcess.WaitForExit(15000)) { $aetherProcess.Kill($true); $aetherProcess.WaitForExit(); throw 'Git exceeded 15 seconds; checkout retained' }
        $aetherOut = $aetherOutTask.GetAwaiter().GetResult()
        $aetherErr = $aetherErrTask.GetAwaiter().GetResult()
        if ($aetherProcess.ExitCode -ne 0) { throw "Git failed: $aetherErr" }
        return $aetherOut.Trim()
    } finally { $aetherProcess.Dispose() }
}
Assert-AetherPath (Join-Path $aetherRoot 'references/upstream-lock.json')
$aetherLock = Get-Content -LiteralPath (Join-Path $aetherRoot 'references/upstream-lock.json') -Raw | ConvertFrom-Json
if ($aetherLock.schemaVersion -ne 1 -or -not $aetherLock.repositories.Count) { throw 'Invalid lock schema' }
$aetherNames = [Collections.Generic.HashSet[string]]::new()
foreach ($aetherEntry in $aetherLock.repositories) {
    if ($aetherEntry.name -cnotmatch '^[a-z0-9-]+$' -or -not $aetherNames.Add($aetherEntry.name) -or $aetherEntry.commit -cnotmatch '^[0-9a-f]{40}$' -or $aetherEntry.url -cnotmatch '^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+\.git$' -or $aetherEntry.path -cne ('references/upstream/' + $aetherEntry.name)) { throw 'Invalid lock name/path/URL/SHA' }
}
$aetherRepos = @($aetherLock.repositories)
if ($RepositoryName) {
    $aetherRepos = @($aetherRepos | Where-Object name -eq $RepositoryName)
    if (-not $aetherRepos.Count) { throw "Unknown repository: $RepositoryName" }
}
foreach ($aetherRepo in $aetherRepos) {
    $aetherExpected = [IO.Path]::GetFullPath((Join-Path $aetherRoot ('references/upstream/' + $aetherRepo.name)))
    $aetherTarget = [IO.Path]::GetFullPath((Join-Path $aetherRoot $aetherRepo.path))
    if ($aetherTarget -ne $aetherExpected -or $aetherRepo.name -notmatch '^[a-z0-9-]+$') { throw 'Invalid lock path' }
    Assert-AetherPath $aetherTarget
    if (Test-Path -LiteralPath $aetherTarget) {
        $aetherTop = Invoke-AetherGit $aetherTarget @('rev-parse', '--show-toplevel')
        if ([IO.Path]::GetFullPath($aetherTop) -ne $aetherTarget) { throw 'Not an independent checkout' }
        $aetherHead = Invoke-AetherGit $aetherTarget @('rev-parse', 'HEAD')
        if ($aetherHead -ne $aetherRepo.commit) { throw "SHA differs: $($aetherRepo.name). Existing checkout retained." }
        $aetherRemote = Invoke-AetherGit $aetherTarget @('remote', 'get-url', 'origin')
        if ($aetherRemote -cne $aetherRepo.url) { throw "Remote differs: $($aetherRepo.name). Existing checkout retained." }
        $aetherChanges = Invoke-AetherGit $aetherTarget @('status', '--porcelain=v1', '--untracked-files=all')
        if ($aetherChanges) { throw "Dirty checkout: $($aetherRepo.name). Local changes retained." }
        Write-Output "Verified $($aetherRepo.name) $aetherHead"
        continue
    }
    if ($VerifyOnly) { throw "Missing checkout: $($aetherRepo.name); -VerifyOnly does not download" }
    if ($aetherRepo.url -notmatch '^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+\.git$') { throw 'Unexpected source URL' }
    New-Item -ItemType Directory -Path $aetherTarget -Force | Out-Null
    Invoke-AetherGit $aetherTarget @('init') | Out-Null
    Invoke-AetherGit $aetherTarget @('remote', 'add', 'origin', $aetherRepo.url) | Out-Null
    Invoke-AetherGit $aetherTarget @('fetch', '--depth', '1', 'origin', $aetherRepo.commit) | Out-Null
    Invoke-AetherGit $aetherTarget @('checkout', '--detach', $aetherRepo.commit) | Out-Null
    Write-Output "Cloned $($aetherRepo.name) $($aetherRepo.commit)"
}
