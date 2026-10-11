'use strict';
const assert=require('node:assert/strict');
// Task2 的首个可执行基线；known-bad 行为测试必须先暴露拒绝门槛缺失。
function validateCounts(record,observed,expected){
 assert.ok(record.tests.tests>0,'Actual test count required');
 return {tests:record.tests.tests};
}
module.exports={validateCounts};
if(require.main===module){console.error('Independent evidence validator is incomplete');process.exitCode=1;}
