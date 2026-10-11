'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {validateCounts}=require('../scripts/verify-protocol.cjs');
const fixture=()=>({exitCode:0,elapsedMs:1000,physical:false,synthetic:true,tests:{tests:15,passed:15,failed:0,skipped:0,cancelled:0}});
const observed={tests:15,passed:15,failed:0,skipped:0,cancelled:0,todo:0};
test('validator unit fixture accepts exact positive observed counts; no actual platform claim',()=>assert.equal(validateCounts(fixture(),observed,15).tests,15));
for(const [name,mutate]of [
 ['zero tests',r=>{r.tests.tests=0;r.tests.passed=0;}],
 ['reported skip',r=>{r.tests.skipped=1;}],
 ['reported cancellation',r=>{r.tests.cancelled=1;}],
 ['failed execution',r=>{r.exitCode=1;}],
 ['failed case',r=>{r.tests.failed=1;}],
 ['missing count',r=>{delete r.tests.passed;}],
 ['wrong denominator',r=>{r.tests.tests=14;r.tests.passed=14;}],
 ['synthetic mislabeled physical',r=>{r.physical=true;}],
 ['zero elapsed',r=>{r.elapsedMs=0;}]
])test('known-bad counts rejected: '+name,()=>{const r=fixture();mutate(r);assert.throws(()=>validateCounts(r,observed,15));});
for(const key of ['tests','passed','failed','skipped','cancelled','todo'])test('independent raw count mismatch rejected: '+key,()=>assert.throws(()=>validateCounts(fixture(),{...observed,[key]:1},15)));
