'use strict';
// Reconstruct a private research tree only. No build, signing, deployment or device operation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifestPath=path.join(root,'docs/phase03/SUDOVDA-SOURCE-EVIDENCE.json');
const expectedCommit='a4b09fa2aa731a964d0cb5d139cb1e6240e4da12';
const output=path.join(root,`artifacts/phase03/derived-research/helios-${Date.now()}`);
function replaceOne(text,from,to){if(text.split(from).length!==2)throw Error('Fixed source edit anchor changed: '+from);return text.replace(from,to);}
function platformInf(text){
 // Replace only the known inherited install sections; keep Version/source/notices intact.
 const found=[...text.matchAll(/^\[([^\]]+)\][^\r\n]*\r?\n([^]*?)(?=^\[|$(?![\s\S]))/gm)];
 const sections=new Map();
 for(const m of found){const key=m[1].toLowerCase();if(sections.has(key))throw Error('Duplicate INF section '+key);sections.set(key,m);}
 const required=['Manufacturer','Standard.NT$ARCH$','HeliosDisplay_Install.NT','HeliosDisplay_Install.NT.hw','HeliosDisplay_Install.NT.Services','HeliosDisplay_Install.NT.Wdf','HeliosDisplay_Install','DestinationDirs','UMDriverCopy','WUDFRD_ServiceInstall','MyDevice_HardwareDeviceSettings'];
 for(const name of required)if(!sections.has(name.toLowerCase()))throw Error('Missing inherited INF section '+name);
 const model=sections.get('standard.nt$arch$')[2].split(/\r?\n/).filter(l=>l.trim()&&!l.trim().startsWith(';'));
 if(model.length!==1||model[0].replaceAll(' ','')!=='%DeviceName%=HeliosDisplay_Install,Root\\Aether\\HeliosDisplay')throw Error('Unexpected inherited hardware identity');
 const values=new Map([
 ['manufacturer','%ManufacturerName%=Standard,NT$ARCH$.10.0,NT$ARCH$.10.0...17134,NT$ARCH$.10.0...22000'],
 ['standard.nt$arch$','%DeviceName%=HeliosDisplay_Win10Legacy, Root\\Aether\\HeliosDisplay\n\n[Standard.NT$ARCH$.10.0...17134]\n%DeviceName%=HeliosDisplay_Win10, Root\\Aether\\HeliosDisplay\n\n[Standard.NT$ARCH$.10.0...22000]\n%DeviceName%=HeliosDisplay_Win11, Root\\Aether\\HeliosDisplay'],
 ['heliosdisplay_install.nt','CopyFiles=UMDriverCopyWin10\n\n[HeliosDisplay_Win10Legacy.NT]\nCopyFiles=UMDriverCopyWin10Legacy\n\n[HeliosDisplay_Win11.NT]\nInclude=WUDFRD.inf\nNeeds=WUDFRD.NT\nCopyFiles=UMDriverCopyWin11'],
 ['heliosdisplay_install.nt.hw','AddReg=MyDevice_HardwareDeviceSettings\n\n[HeliosDisplay_Win10Legacy.NT.hw]\nAddReg=MyDevice_HardwareDeviceSettings\n\n[HeliosDisplay_Win11.NT.hw]\nInclude=WUDFRD.inf\nNeeds=WUDFRD.NT.hw\nAddReg=MyDevice_HardwareDeviceSettings'],
 ['heliosdisplay_install.nt.services','AddService=WUDFRd,0x000001fa,WUDFRD_ServiceInstall\n\n[HeliosDisplay_Win10Legacy.NT.Services]\nAddService=WUDFRd,0x000001fa,WUDFRD_ServiceInstall\n\n[HeliosDisplay_Win11.NT.Services]\nInclude=WUDFRD.inf\nNeeds=WUDFRD.NT.Services'],
 ['heliosdisplay_install.nt.wdf',wdf('Win10')+'\n\n[HeliosDisplay_Win10Legacy.NT.Wdf]\n'+wdf('Win10Legacy')+'\n\n[HeliosDisplay_Win11.NT.Wdf]\n'+wdf('Win11')],
 ['heliosdisplay_install',service('%13%\\HeliosDisplay.dll')+'\n\n[HeliosDisplay_Win10Legacy_Service]\n'+service('%12%\\UMDF\\HeliosDisplay.dll')+'\n\n[HeliosDisplay_Win11_Service]\n'+service('%13%\\HeliosDisplay.dll')],
 ['destinationdirs','UMDriverCopyWin10Legacy=12,UMDF\nUMDriverCopyWin10=13\nUMDriverCopyWin11=13'],
 ['umdrivercopy','HeliosDisplay.dll\n\n[UMDriverCopyWin10Legacy]\nHeliosDisplay.dll\n\n[UMDriverCopyWin11]\nHeliosDisplay.dll']
 ]);
 function wdf(os){return `UmdfService=HeliosDisplay,HeliosDisplay_${os}_Service\nUmdfServiceOrder=HeliosDisplay\nUmdfKernelModeClientPolicy=AllowKernelModeClients`;}
 function service(binary){return `UmdfLibraryVersion=$UMDFVERSION$\nServiceBinary=${binary}\nUmdfExtensions=IddCx0102`;}
 const names=new Map([['standard.nt$arch$','Standard.NT$ARCH$.10.0'],['heliosdisplay_install.nt','HeliosDisplay_Win10.NT'],['heliosdisplay_install.nt.hw','HeliosDisplay_Win10.NT.hw'],['heliosdisplay_install.nt.services','HeliosDisplay_Win10.NT.Services'],['heliosdisplay_install.nt.wdf','HeliosDisplay_Win10.NT.Wdf'],['heliosdisplay_install','HeliosDisplay_Win10_Service'],['umdrivercopy','UMDriverCopyWin10']]);
 for(const m of found.reverse()){const key=m[1].toLowerCase();if(values.has(key))text=text.slice(0,m.index)+`[${names.get(key)||m[1]}]\n${values.get(key)}\n\n`+text.slice(m.index+m[0].length);}
 return text;
}
function transform(relative,text){
 if(relative.endsWith('/Driver.cpp')){
  text=replaceOne(text,'DWORD watchdogTimeout = 3;','DWORD watchdogTimeout = 0;');
  text=replaceOne(text,'L"SOFTWARE\\\\SudoMaker\\\\SudoVDA"','L"SOFTWARE\\\\Aether\\\\HeliosDisplay"');
  text=replaceOne(text,'L"SudoMaker Virtual Display Adapter"','L"Aether Helios Research Display Adapter"');
  text=replaceOne(text,'L"SudoMaker"','L"Aether"');
  text=replaceOne(text,'if (IoControlCode != IOCTL_GET_WATCHDOG)',
   'if (IoControlCode == IOCTL_ADD_VIRTUAL_DISPLAY || IoControlCode == IOCTL_REMOVE_VIRTUAL_DISPLAY || IoControlCode == IOCTL_SET_RENDER_ADAPTER || IoControlCode == IOCTL_DRIVER_PING)');
  const callback=text.indexOf('VOID SudoVDAIoDeviceControl(');if(callback<0)throw Error('Missing callback declaration');
  text=text.slice(0,callback)+'EVT_IDD_CX_DEVICE_IO_CONTROL SudoVDAIoDeviceControl;\n'+text.slice(callback);
  text=replaceOne(text,'AvRevertMmThreadCharacteristics(AvTaskHandle);',
   'if (AvTaskHandle && !AvRevertMmThreadCharacteristics(AvTaskHandle)) {\n\t\tstd::cerr << "Helios research MMCSS revert failed: " << GetLastError() << std::endl;\n\t}');
  text=replaceOne(text,'CoCreateGuid(&containerId);',
   'if (FAILED(CoCreateGuid(&containerId))) {\n\t\tstd::cerr << "Helios research test monitor GUID creation failed" << std::endl;\n\t\treturn;\n\t}');
  const begin=text.indexOf('void DisconnectAllMonitors() {'),end=text.indexOf('\nvoid RunWatchdog()',begin);
  if(begin<0||end<0)throw Error('Watchdog cleanup anchor changed');
  text=text.slice(0,begin)+`void DisconnectAllMonitors() {
 std::lock_guard<std::mutex> lg(monitorListOp);
 for (auto it = monitorCtxList.begin(); it != monitorCtxList.end();) {
  auto* ctx = *it;
  const auto connectorId = ctx->connectorId;
  const NTSTATUS status = IddCxMonitorDeparture(ctx->GetMonitor());
  if (!NT_SUCCESS(status)) {
   std::cerr << "Helios research departure failed: " << status << std::endl;
   ++it;
   continue;
  }
  freeConnectorSlots.push(connectorId);
  it = monitorCtxList.erase(it);
 }
}
`+text.slice(end);
  text=replaceOne(text,'freeConnectorSlots.push(ctx->connectorId);\n\t\t\t\tIddCxMonitorDeparture(ctx->GetMonitor());\n\t\t\t\tmonitorCtxList.erase(it);\n\t\t\t\tStatus = STATUS_SUCCESS;',
   'const auto connectorId = ctx->connectorId;\n\t\t\t\tStatus = IddCxMonitorDeparture(ctx->GetMonitor());\n\t\t\t\tif (!NT_SUCCESS(Status)) { break; }\n\t\t\t\tfreeConnectorSlots.push(connectorId);\n\t\t\t\tmonitorCtxList.erase(it);');
 }
 if(relative==='Common/Include/sudovda-ioctl.h'){
  text=replaceOne(text,'"root\\\\sudomaker\\\\sudovda"','"root\\\\aether\\\\heliosdisplay"');
  text=replaceOne(text,'{ 0xe5bcc234, 0x1e0c, 0x418a, { 0xa0, 0xd4, 0xef, 0x8b, 0x75, 0x01, 0x41, 0x4d } }',
   '{ 0x0d9ecbde, 0x124e, 0x45f0, { 0x9a, 0xe0, 0x3d, 0x71, 0xb1, 0x6a, 0x77, 0x25 } }');
 }
 if(relative.endsWith('/SudoVDA.inf')){
  text=replaceOne(text,'Root\\SudoMaker\\SudoVDA','Root\\Aether\\HeliosDisplay');
  text=replaceOne(text,'CatalogFile=sudovda.cat','CatalogFile=heliosdisplay.cat');
  text=replaceOne(text,'%DeviceName%=SudoVDA_Install, SudoVDA','; No secondary generic hardware ID: only the dedicated Aether root ID is eligible.');
  text=replaceOne(text,'D:P(A;;GA;;;SY)(A;;GA;;;BA)(A;;GRGW;;;WD)','D:P(A;;GA;;;SY)(A;;GA;;;BA)');
  text=text.replaceAll('SudoVDA','HeliosDisplay').replaceAll('SudoMaker','Aether');
  text=replaceOne(text,'DriverVer= ; TODO: set DriverVer in stampinf property pages','DriverVer=10/08/2026,0.1.0.0');
  text=platformInf(text);
 }
 if(relative.endsWith('/Trace.h')){
  text=replaceOne(text,'L"Microsoft\\\\UMDF2.0\\\\IddSampleDriver V1.0"','L"Aether\\\\HeliosDisplay\\\\Research V0.1"');
  text=replaceOne(text,'b254994f-46e6-4718-80a0-0a3aa50d6ce4','f7ac2c18-2967-4d42-9b20-f2d83f6ae2c5');
  text=replaceOne(text,'(b254994f,46e6,4718,80a0,0a3aa50d6ce4)','(f7ac2c18,2967,4d42,9b20,f2d83f6ae2c5)');
 }
 if(relative.endsWith('/SudoVDA.vcxproj')){
  text=replaceOne(text,'<Inf Include="SudoVDA.inf" />','<Inf Include="HeliosDisplay.inf">\n      <SpecifyDriverVerDirectiveDate>true</SpecifyDriverVerDirectiveDate>\n      <DateStamp>10/08/2026</DateStamp>\n      <SpecifyDriverVerDirectiveVersion>true</SpecifyDriverVerDirectiveVersion>\n      <TimeStamp>0.1.0.0</TimeStamp>\n    </Inf>');
  text=replaceOne(text,'<RootNamespace>SudoVDA</RootNamespace>','<RootNamespace>HeliosDisplay</RootNamespace>');
  text=replaceOne(text,'<Import Project="$(VCTargetsPath)\\Microsoft.Cpp.props" />',
   '<Import Project="$(VCTargetsPath)\\Microsoft.Cpp.props" />\n  <PropertyGroup>\n    <TargetName>HeliosDisplay</TargetName>\n    <SignMode>Off</SignMode>\n    <EnableTestSign>false</EnableTestSign>\n    <GenerateTestCertificate>false</GenerateTestCertificate>\n  </PropertyGroup>');
 }
 return text;
}
async function prepare(){
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));if(manifest.sourceCommit!==expectedCommit)throw Error('Pinned research commit changed');
 if(fs.existsSync(output))throw Error('Research output exists; inspect it instead of overwriting');
 const sourceFiles=[];
 for(const f of manifest.files){
  const expectedUrl=`https://raw.githubusercontent.com/SudoMaker/SudoVDA/${expectedCommit}/`;
  if(!f.url.startsWith(expectedUrl)||!f.sha256||path.isAbsolute(f.path)||f.path.split('/').includes('..'))throw Error('Unsafe manifest source');
  const cached=path.join(root,'artifacts/phase03/sudovda-followup',path.posix.basename(f.path));let bytes;
  if(fs.existsSync(cached))bytes=fs.readFileSync(cached);else{const response=await fetch(f.url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Source HTTP '+response.status);bytes=Buffer.from(await response.arrayBuffer());}
  if(bytes.length!==f.length||sha(bytes)!==f.sha256||crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex')!==f.gitBlob)throw Error('Pinned bytes mismatch '+f.path);
  const encoding=bytes[0]===0xff&&bytes[1]===0xfe?'utf16le':'utf8';
  const changed=/\.(cpp|h|inf|vcxproj)$/i.test(f.path)?Buffer.from(transform(f.path,bytes.toString(encoding)),encoding):bytes;
  const outputPath=f.path.endsWith('/SudoVDA.inf')?f.path.replace('/SudoVDA.inf','/HeliosDisplay.inf'):f.path;
  const target=path.resolve(output,outputPath);if(!target.startsWith(output+path.sep))throw Error('Output traversal');
  sourceFiles.push({sourcePath:f.path,sourceSha256:f.sha256,outputPath,sha256:sha(changed),changed:!changed.equals(bytes),bytes:changed,target});
 }
 for(const f of sourceFiles){fs.mkdirSync(path.dirname(f.target),{recursive:true});fs.writeFileSync(f.target,f.bytes);}
 const report={scope:'research-only; inherited license and runtime/security/machine behavior unresolved; not production source reuse or admitted package',sourceCommit:expectedCommit,hardwareId:'Root\\Aether\\HeliosDisplay',interfaceGuid:'0d9ecbde-124e-45f0-9ae0-3d71b16a7725',registryPath:'HKLM\\SOFTWARE\\Aether\\HeliosDisplay',deviceAcl:'D:P(A;;GA;;;SY)(A;;GA;;;BA)',signMode:'Off',files:sourceFiles.map(({bytes,target,...f})=>f)};
 fs.writeFileSync(path.join(output,'research-source.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({output,changedFiles:report.files.filter(f=>f.changed).map(f=>f.sourcePath),signMode:report.signMode}));return report;
}
if(require.main===module){if(process.argv.slice(2).join(' ')!=='--prepare-unsigned-research'){console.error('Usage: node scripts/prepare-helios-display-research.cjs --prepare-unsigned-research');process.exitCode=2;}else prepare().catch(e=>{console.error(e.message);process.exitCode=1;});}
module.exports={transform,replaceOne,platformInf};
