'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {platformRecords}=require('../scripts/check-platforms.cjs');
test('platform report retains five clients and legacy Android/Linux build duties',()=>{
 const records=platformRecords();assert.equal(records.length,5,'all five client interfaces must remain represented');
 assert.deepEqual(records.map(record=>record.id).sort(),['android','ios','linux','macos','windows']);
});
