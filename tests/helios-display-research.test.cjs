'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const {platformInf}=require('../scripts/prepare-helios-display-research.cjs');
// Synthetic inherited layout, no third-party source fixture or ignored artifact dependency.
function legacyInf(){return [
 '[Manufacturer]','%ManufacturerName%=Standard,NT$ARCH$',
 '[Standard.NT$ARCH$]','%DeviceName%=HeliosDisplay_Install, Root\\Aether\\HeliosDisplay',
 '[HeliosDisplay_Install.NT]','CopyFiles=UMDriverCopy',
 '[HeliosDisplay_Install.NT.hw]','AddReg=MyDevice_HardwareDeviceSettings',
 '[HeliosDisplay_Install.NT.Services]','AddService=WUDFRd,0x000001fa,WUDFRD_ServiceInstall',
 '[HeliosDisplay_Install.NT.Wdf]','UmdfService=HeliosDisplay,HeliosDisplay_Install','UmdfServiceOrder=HeliosDisplay','UmdfKernelModeClientPolicy=AllowKernelModeClients',
 '[HeliosDisplay_Install]','UmdfLibraryVersion=$UMDFVERSION$','ServiceBinary=%12%\\UMDF\\HeliosDisplay.dll','UmdfExtensions=IddCx0102',
 '[DestinationDirs]','UMDriverCopy=12,UMDF',
 '[UMDriverCopy]','HeliosDisplay.dll',
 '[WUDFRD_ServiceInstall]','ServiceBinary=%12%\\WUDFRd.sys',
 '[MyDevice_HardwareDeviceSettings]','HKR,,"Security",,"D:P(A;;GA;;;SY)(A;;GA;;;BA)"',
 '[Strings]','ManufacturerName="Aether"'
 ].join('\n');}
function sections(inf){return Object.fromEntries([...inf.matchAll(/^\[([^\]]+)\]\s*\n([^]*?)(?=^\[|$(?![\s\S]))/gm)].map(m=>[m[1].toLowerCase(),m[2]]));}
test('dedicated INF places UMDF isolation group under the WUDF device subkey',()=>{
 const template=fs.readFileSync(path.join(root,'tools/helios-display-research/HeliosDisplay.inf'),'utf8');
 for(const inf of [template,platformInf(template)]){
  const hw=sections(inf)['mydevice_hardwaredevicesettings'];
  assert.match(hw,/^HKR,\s*"?WUDF"?,\s*"?DeviceGroupId"?,\s*(?:0x00000000)?,\s*"?HeliosDisplayGroup"?\s*$/mi);
  assert.doesNotMatch(hw,/^HKR,\s*,\s*"?DeviceGroupId"?/mi);
 }
});
test('platform INF retains Win10 reflector and selects separate Win11 inbox services',()=>{
 const inf=platformInf(legacyInf()),s=sections(inf);
 assert.match(s.manufacturer,/Standard,NT\$ARCH\$\.10\.0,NT\$ARCH\$\.10\.0\.\.\.17134,NT\$ARCH\$\.10\.0\.\.\.22000/);
 assert.match(s['standard.nt$arch$.10.0'],/HeliosDisplay_Win10Legacy,/);
 assert.match(s['standard.nt$arch$.10.0...17134'],/HeliosDisplay_Win10,/);
 assert.match(s['standard.nt$arch$.10.0...22000'],/HeliosDisplay_Win11,/);
 assert.match(s['heliosdisplay_win10.nt.services'],/AddService=WUDFRd,0x000001fa,WUDFRD_ServiceInstall/);
 assert.doesNotMatch(s['heliosdisplay_win10.nt'],/WUDFRD.inf/i);
 for(const suffix of ['', '.hw','.services']){
  const value=s['heliosdisplay_win11.nt'+suffix];
  assert.match(value,/Include=WUDFRD.inf/i);
  assert.match(value,new RegExp('Needs=WUDFRD\\.NT'+suffix.replaceAll('.','\\.'),'i'));
  assert.doesNotMatch(value,/AddService|ServiceBinary=.*WUDFRd\.sys/i);
 }
 assert.match(s['heliosdisplay_win10legacy_service'],/ServiceBinary=%12%\\UMDF\\HeliosDisplay.dll/);
 assert.match(s['heliosdisplay_win10_service'],/ServiceBinary=%13%\\HeliosDisplay.dll/);
 assert.match(s['heliosdisplay_win11_service'],/ServiceBinary=%13%\\HeliosDisplay.dll/);
 assert.match(s.destinationdirs,/UMDriverCopyWin11=13/);
 assert.equal((inf.match(/Root\\Aether\\HeliosDisplay/g)||[]).length,3);
 assert.doesNotMatch(inf,/CopyFiles=.*WUDFRd|Root\\SudoMaker|;;;WD\)/i);
 assert.equal((inf.match(/UmdfExtensions=IddCx0102/g)||[]).length,3);
});
test('platform INF refuses incomplete or duplicate inherited sections before generation',()=>{
 assert.throws(()=>platformInf(legacyInf().replace('[HeliosDisplay_Install.NT.Services]','[Unexpected.Services]')),/section/i);
 assert.throws(()=>platformInf(legacyInf()+'\n[Manufacturer]\nInjected=yes'),/duplicate/i);
 assert.throws(()=>platformInf(legacyInf().replace('Root\\Aether\\HeliosDisplay','Root\\Foreign')),/identity/i);
});
test('research entry point rejects machine actions and extra flags without writing output',()=>{
 const output=path.join(root,'artifacts/phase03/derived-research');
 // Admission tests use the reserved 000 prefix for temporary fixtures in another worker.
 const listing=()=>fs.existsSync(output)?fs.readdirSync(output).filter(name=>!name.startsWith('helios-000')).sort():[];
 const before=listing();
 for(const args of [[],['--install'],['--restart'],['--shutdown'],['--prepare-unsigned-research','--install']]){
  const result=spawnSync(process.execPath,[path.join(root,'scripts/prepare-helios-display-research.cjs'),...args],{cwd:root,encoding:'utf8',timeout:5000,windowsHide:true});
  assert.equal(result.status,2,result.error?.message||result.stderr);
  assert.equal(result.stdout,'');
  assert.match(result.stderr,/Usage:/);
 }
 assert.deepEqual(listing(),before);
});

test('dedicated IOCTL protocol requires read access for queries and read/write for mutations',()=>{
 const {transform}=require('../scripts/prepare-helios-display-research.cjs');
 const names=['ADD_VIRTUAL_DISPLAY','REMOVE_VIRTUAL_DISPLAY','SET_RENDER_ADAPTER','GET_WATCHDOG','DRIVER_PING','GET_PROTOCOL_VERSION'];
 const input=names.map((name,i)=>`#define IOCTL_${name} CTL_CODE(FILE_DEVICE_UNKNOWN, ${0x800+i}, METHOD_BUFFERED, FILE_ANY_ACCESS)`).join('\n')+'\n'+
  String.raw`"root\\sudomaker\\sudovda"`+'\n{ 0xe5bcc234, 0x1e0c, 0x418a, { 0xa0, 0xd4, 0xef, 0x8b, 0x75, 0x01, 0x41, 0x4d } }\n{ 0, 2, 1, true }';
 const output=transform('Common/Include/sudovda-ioctl.h',input);
 assert.doesNotMatch(output,/FILE_ANY_ACCESS/);
 for(const name of names){const line=output.split('\n').find(l=>l.startsWith(`#define IOCTL_${name} `));
  assert.ok(line.endsWith(name.startsWith('GET_')?'FILE_READ_ACCESS)':'(FILE_READ_ACCESS | FILE_WRITE_ACCESS))'),line);
 }
 assert.match(output,/\{ 0, 3, 0, true \}/);
 assert.throws(()=>transform('Common/Include/sudovda-ioctl.h',input.replace('IOCTL_DRIVER_PING','IOCTL_UNKNOWN')),/anchor changed/);
});
