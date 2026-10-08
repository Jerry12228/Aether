param()
$ErrorActionPreference='Stop'
$generatorRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$generatorLock=Get-Content (Join-Path $generatorRoot 'toolchains.lock.json') -Raw | ConvertFrom-Json
$clangLock=$generatorLock.generator.libclang
$clangLibrary=$env:LIBCLANG_PATH
if (!$clangLibrary) {
  $existingClang=Join-Path $generatorRoot 'build/audited-libclang/libclang.dll'
  $clangLibrary=if(Test-Path -LiteralPath $existingClang){$existingClang}else{Join-Path $generatorRoot 'build/toolchains/libclang/libclang.dll'}
}
if (!(Test-Path -LiteralPath $clangLibrary)) {
  $clangDirectory=Split-Path $clangLibrary
  if (!$clangDirectory.StartsWith(($generatorRoot+[IO.Path]::DirectorySeparatorChar),[StringComparison]::OrdinalIgnoreCase)) { throw 'Missing externally specified libclang; set a verified existing path' }
  New-Item -ItemType Directory -Path $clangDirectory -Force | Out-Null
  $wheelFile=Join-Path $clangDirectory 'libclang.whl'
  Invoke-WebRequest -Uri $clangLock.wheelUrl -OutFile $wheelFile -TimeoutSec 300
  if ((Get-FileHash $wheelFile -Algorithm SHA256).Hash.ToLowerInvariant() -ne $clangLock.wheelSha256) {throw 'libclang wheel digest mismatch'}
  $archive=[IO.Compression.ZipFile]::OpenRead($wheelFile)
  try {
    foreach($selection in @(@{entry=$clangLock.wheelDllPath;file=$clangLibrary},@{entry=$clangLock.wheelLicensePath;file=(Join-Path $clangDirectory 'LICENSE.TXT')})) {
      $entry=$archive.GetEntry($selection.entry);if(!$entry){throw 'Locked wheel entry missing'}
      [IO.Compression.ZipFileExtensions]::ExtractToFile($entry,$selection.file,$true)
    }
    if((Get-FileHash (Join-Path $clangDirectory 'LICENSE.TXT') -Algorithm SHA256).Hash.ToLowerInvariant() -ne $clangLock.licenseSha256){throw 'Clang license drift'}
  } finally {$archive.Dispose()}
}
if((Get-FileHash $clangLibrary -Algorithm SHA256).Hash.ToLowerInvariant() -ne $clangLock.sha256){throw 'libclang DLL drift'}
$vswhere=Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio/Installer/vswhere.exe'
$installation=& $vswhere -latest -products '*' -property installationPath
if(!$installation){throw 'Visual Studio required for generator C include paths'}
$toolsetDirectory=Get-ChildItem (Join-Path $installation 'VC/Tools/MSVC') -Directory | Sort-Object Name -Descending | Select-Object -First 1
$ucrt=Join-Path ${env:ProgramFiles(x86)} "Windows Kits/10/Include/$($generatorLock.windows.sdk)/ucrt"
if(!(Test-Path -LiteralPath $ucrt)){throw 'Locked Windows SDK UCRT include path missing'}
@{libclangPath=$clangLibrary;includes=((Join-Path $toolsetDirectory.FullName 'include')+';'+$ucrt)} | ConvertTo-Json -Compress
