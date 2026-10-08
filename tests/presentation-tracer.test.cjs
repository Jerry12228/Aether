'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),cp=require('node:child_process'),fs=require('node:fs');
function resolveTool(name){for(const dir of (process.env.PATH||'').split(path.delimiter)){for(const extension of ['.bat','.exe','.cmd']){const file=path.join(dir,name+extension);if(fs.existsSync(file))return file;}}return null;}
test('real Windows GPU Texture and native surface present the same native source',()=>{
 const launcher=resolveTool('flutter');assert.ok(launcher,'Pinned Flutter SDK required');
 const bin=path.dirname(launcher),dart=path.join(bin,'cache/dart-sdk/bin/dart.exe'),snapshot=path.join(bin,'cache/flutter_tools.snapshot');
 const root=path.resolve(__dirname,'..');
 const result=cp.spawnSync(dart,[snapshot,'--suppress-analytics','test','--no-pub','-d','windows','integration_test/native_panel_test.dart','--reporter=expanded'],{cwd:path.join(root,'apps/selene'),encoding:'utf8',timeout:120000,windowsHide:true,maxBuffer:1024*1024});
 fs.mkdirSync(path.join(root,'artifacts/phase02'),{recursive:true});
 fs.writeFileSync(path.join(root,'artifacts/phase02/presentation-tracer.log'),(result.stdout||'')+(result.stderr||''));
 assert.equal(result.status,0,result.stderr||result.stdout||result.error?.message);
 assert.match(result.stdout,/All tests passed!/);
});
