'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {platformRecords,validate}=require('../scripts/check-platforms.cjs');
test('platform report retains five clients and legacy Android/Linux build duties',()=>{
 const records=platformRecords();assert.equal(records.length,5,'all five client interfaces must remain represented');
 assert.deepEqual(records.map(record=>record.id).sort(),['android','ios','linux','macos','windows']);
});
test('platform guard rejects support inflation, Apple build waiver and legacy scope erasure',()=>{
 const records=platformRecords();assert.equal(validate(records).clients,5);
 const android=structuredClone(records);android.find(row=>row.id==='android').interface='supported';assert.throws(()=>validate(android),/product support/);
 const apple=structuredClone(records);apple.find(row=>row.id==='macos').buildDuty='TODO';assert.throws(()=>validate(apple),/Build duty/);
 const legacy=structuredClone(records);legacy.find(row=>row.id==='android').legacyApis=[24];assert.throws(()=>validate(legacy),/API21-23/);
 const linux=structuredClone(records);linux.find(row=>row.id==='linux').legacyArchitectures=['x64'];assert.throws(()=>validate(linux),/Linux target/);
});
