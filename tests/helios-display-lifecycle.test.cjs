'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {transform}=require('../scripts/prepare-helios-display-research.cjs');
// Fixed research source is never linked to a product. These are transformation guards,
// not installed-driver evidence; the resulting source must also pass the WDK build.
function driver(){return transform('Virtual Display Driver (HDR)/SudoVDA/Driver.cpp',fs.readFileSync('artifacts/phase03/sudovda-followup/Driver.cpp','utf8'));}
test('arrival failure releases only the new context object and connector',()=>{
 const text=driver(),body=text.slice(text.indexOf('NTSTATUS IndirectDeviceContext::CreateMonitor('),text.indexOf('IndirectMonitorContext::IndirectMonitorContext('));
 assert.match(body,/Attr\.EvtCleanupCallback/,'monitor context requires WDF cleanup');
 const failure=body.slice(body.indexOf('Status = IddCxMonitorArrival'));
 assert.match(failure,/monitorCtxList\.remove\(pMonitorContext\)/,'failed arrival must remove its provisional context');
 assert.match(failure,/freeConnectorSlots\.push\(MonitorInfo\.ConnectorIndex\)/);
 assert.match(failure,/WdfObjectDelete\(MonitorCreateOut\.MonitorObject\)/);
 assert.match(failure,/pMonitorContext = nullptr/);
 assert.doesNotMatch(failure,/DisconnectAllMonitors/);
});
test('duplicate GUID succeeds at full capacity under the same monitor lock',()=>{
 const text=driver(),body=text.slice(text.indexOf('case IOCTL_ADD_VIRTUAL_DISPLAY:'),text.indexOf('case IOCTL_REMOVE_VIRTUAL_DISPLAY:'));
 assert.ok(body.indexOf('if (guidFound)')<body.indexOf('if (freeConnectorSlots.empty())'),'existing GUID lookup must precede capacity rejection');
 assert.ok(body.indexOf('std::lock_guard<std::mutex> lg(monitorListOp)')<body.indexOf('bool guidFound'),'lookup and creation share the monitor lock');
 assert.equal((body.match(/std::lock_guard<std::mutex> lg\(monitorListOp\)/g)||[]).length,1);
});
