'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync,spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const config = process.env.AETHER_CONFIGURATION || 'Debug';
const binary = path.join(root,'build','native',config,'helios.exe');
const testBinary = path.join(root,'build','native',config,'aether_helios_test.exe');
const logs = path.join(root,'artifacts','phase02','helios'); fs.mkdirSync(logs,{recursive:true});
test('actual Helios success and failure never wait on redirected input',()=>{
  for(const [args,expected,name] of [
    [['--self-test','--automation'],0,'automation'],
    [['--self-test'],0,'redirected'],
    [['--self-test','--automation','--test-init-error'],1,'init-failure'],
  ]) {
    const r=spawnSync(name==='init-failure'?testBinary:binary,args,{input:'',encoding:'utf8',timeout:5000,windowsHide:true});
    fs.writeFileSync(path.join(logs,`${name}-${config}.log`),(r.stdout||'')+(r.stderr||''));
    assert.equal(r.status,expected,JSON.stringify(r));
    assert.match(r.stdout,/Helios 0\.1\.0 ABI 1/);
    assert.doesNotMatch(r.stdout,/Press .*exit/);
  }
});
test('foreground remains alive until an actual Ctrl+C console event',()=>{
  const helper=path.join(root,'build','native',config,'aether_helios_signal.exe');
  const r=spawnSync(helper,[testBinary],{input:'',encoding:'utf8',timeout:10000,windowsHide:true});
  fs.writeFileSync(path.join(logs,`ctrl-c-${config}.log`),(r.stdout||'')+(r.stderr||''));
  assert.equal(r.status,0,JSON.stringify(r));
  assert.match(r.stdout,/foreground_alive/); assert.match(r.stdout,/signal=CTRL_C_EVENT/);
  assert.match(r.stdout,/cleanup handles=0 threads=0/);
  assert.match(r.stdout,/signal_received=1/);
});
