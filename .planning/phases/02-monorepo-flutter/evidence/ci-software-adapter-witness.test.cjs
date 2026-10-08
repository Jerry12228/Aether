'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
test('actual recorded CI Basic Render Driver must be labeled software',()=>{
 const root=path.resolve(__dirname,'../../../..');
 const ledger=JSON.parse(fs.readFileSync(path.join(root,'docs/phase02/CI-RESULTS.json'),'utf8'));
 const run=ledger.runs.find(row=>row.runId===Number(process.env.AETHER_CI_ADAPTER_RUN||37732241885));
 assert.ok(run,'actual recorded run required');
 const file=run.downloadedFiles.find(row=>row.path.endsWith('/presentation-correctness.json'));
 assert.ok(file,'actual engine diagnostics required');
 const bytes=fs.readFileSync(path.join(root,file.path));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256,'actual downloaded bytes must match retained CI manifest');
 const actual=JSON.parse(bytes);
 assert.equal(actual.texture.adapter,'Microsoft Basic Render Driver');
 assert.equal(actual.texture.softwareAdapter,true,'actual CI software rendering must not be labeled hardware');
 assert.equal(actual.nativeSurface.softwareAdapter,true);
 assert.equal(actual.final.liveSources,0);
});
