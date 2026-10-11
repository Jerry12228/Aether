'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {validateCounts}=require('../scripts/verify-protocol.cjs');
const v=require('../scripts/verify-protocol.cjs');
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
const junit='<testsuite tests="1" failures="0" skipped="0"><testcase name="actual-unit-case"/></testsuite>';
test('independent JUnit parser requires actual case names and exact denominator',()=>assert.deepEqual(v.parseJUnit(junit,1).names,['actual-unit-case']));
for(const [name,xml]of [['missing tests',junit.replace('tests="1"','')],['zero',junit.replace('tests="1"','tests="0"')],['reported skipped',junit.replace('skipped="0"','skipped="1"')],['failure element',junit.replace('/>','><failure/></testcase>')],['skipped element',junit.replace('/>','><skipped/></testcase>')],['no actual cases',junit.replace('<testcase name="actual-unit-case"/>','')]])test('known-bad JUnit rejected: '+name,()=>assert.throws(()=>v.parseJUnit(xml,1)));
const tap='# Subtest: native-unit-case\n# tests 1\n# pass 1\n# fail 0\n# cancelled 0\n# skipped 0\n# todo 0\n';
test('independent Node parser reads original case names and counters',()=>assert.equal(v.parseNode(tap,1).tests,1));
for(const key of ['tests','pass','fail','cancelled','skipped','todo'])test('missing raw Node counter rejected: '+key,()=>assert.throws(()=>v.parseNode(tap.replace(new RegExp('# '+key+' \\d+\\n'),''),1)));
test('duplicate Node case names rejected',()=>assert.throws(()=>v.parseNode(tap.replace('# tests 1','# tests 2').replace('# pass 1','# pass 2')+'# Subtest: native-unit-case\n',2)));
const elf=()=>{const b=Buffer.alloc(64);b.set([127,69,76,70,2,1]);b.writeUInt16LE(62,18);return b;};
test('binary parser reads ELF CPU bytes independently of reports',()=>assert.equal(v.binaryArch(elf()),'x64'));
for(const [name,bytes]of [['unrecognized object',Buffer.from('success arm64')],['wrong ELF class',(()=>{const b=elf();b[4]=1;return b;})()],['truncated PE',Buffer.from('MZ')],['truncated archive',Buffer.from('!<arch>\npartial')]])test('known-bad native bytes rejected: '+name,()=>assert.throws(()=>v.binaryArch(bytes)));
function ar(members){return Buffer.concat([Buffer.from('!<arch>\n'),...members.flatMap(([name,b])=>{const h=Buffer.from(name.padEnd(16)+'0'.padEnd(12)+'0'.padEnd(6)+'0'.padEnd(6)+'100644'.padEnd(8)+String(b.length).padEnd(10)+'`\n');return [h,b,...(b.length%2?[Buffer.from('\n')]:[])];})]);}
test('every archive code member is checked; malformed code cannot hide beside valid CPU',()=>assert.throws(()=>v.binaryArch(ar([['a.o/',elf()],['bad.o/',Buffer.from('corrupted object')]]))));
test('mixed real CPU headers in one archive rejected',()=>{const other=elf();other.writeUInt16LE(183,18);assert.throws(()=>v.binaryArch(ar([['x.o/',elf()],['a.o/',other]])));});
const matrix=()=>v.requiredTargets.map(k=>{const [target,arch,sdk]=k.split('-');return{target,arch,sdk:sdk||null,sourceCommit:'a'.repeat(40),inputDigest:'b'.repeat(64),physical:false};});
test('matrix unit fixture includes device and both simulator architectures',()=>v.validateMatrix(matrix(),'a'.repeat(40),'b'.repeat(64)));
for(const target of ['ios-arm64-iphoneos','ios-arm64-iphonesimulator','ios-x64-iphonesimulator','android-arm32'])test('required target absence rejected: '+target,()=>assert.throws(()=>v.validateMatrix(matrix().filter(r=>[r.target,r.arch,...(r.sdk?[r.sdk]:[])].join('-')!==target),'a'.repeat(40),'b'.repeat(64))));
for(const [field,value]of [['sourceCommit','c'.repeat(40)],['inputDigest','c'.repeat(64)],['arch','arm32'],['sdk','macosx'],['physical',true]])test('known-bad target identity rejected: '+field,()=>{const rows=matrix();rows[0][field]=value;assert.throws(()=>v.validateMatrix(rows,'a'.repeat(40),'b'.repeat(64)));});
test('tampered retained log rejected against independently bound bytes',()=>assert.throws(()=>v.bound({file:'raw.log',sha256:v.sha(Buffer.from('original'))},()=>Buffer.from('tampered'))));
test('missing retained artifact rejected',()=>assert.throws(()=>v.bound({file:'raw.log',sha256:'a'.repeat(64)},()=>{throw Error('missing original bytes');})));
test('unsafe source/artifact path rejected before reading',()=>assert.throws(()=>v.bound({file:'../raw.log',sha256:'a'.repeat(64)},()=>Buffer.from('x'))));
const xctest=Array.from({length:42},(_,i)=>"Test Case '-[ProtocolContract testUnit"+i+"]' passed\n").join('')+'Executed 42 tests, with 0 failures\n';
test('XCTest parser requires all 42 unique passed method names',()=>assert.equal(v.parseXCTest(xctest).tests,42));
for(const [name,text]of [['zero test summary',xctest.replace('Executed 42','Executed 0')],['failed actual summary',xctest.replace('with 0 failures','with 1 failures')],['missing method',xctest.replace("Test Case '-[ProtocolContract testUnit0]' passed\n",'')],['actual skipped method',xctest.replace('testUnit0]\' passed','testUnit0]\' skipped')]])test('known-bad XCTest rejected: '+name,()=>assert.throws(()=>v.parseXCTest(text)));
const ci=()=>({status:'completed',conclusion:'success',headSha:'a'.repeat(40),jobs:Array.from({length:12},()=>({status:'completed',conclusion:'success'}))});
test('all actual CI jobs must succeed; unit fixture makes no CI claim',()=>v.validateCI(ci(),'a'.repeat(40)));
for(const [name,mutate]of [['pending',r=>{r.status='in_progress';}],['cancelled',r=>{r.conclusion='cancelled';}],['failed target',r=>{r.jobs[0].conclusion='failure';}],['missing target',r=>{r.jobs.pop();}],['different commit',r=>{r.headSha='c'.repeat(40);}]])test('known-bad CI identity rejected: '+name,()=>{const r=ci();mutate(r);assert.throws(()=>v.validateCI(r,'a'.repeat(40)));});
const coverage=()=>({coverage:{decisions:Array.from({length:16},(_,i)=>({id:'D-'+String(i+1).padStart(2,'0'),references:['observed-case']})),requirements:['NET-01','NET-02','NET-03'].map(id=>({id,references:['observed-case']})),threats:[...Array.from({length:22},(_,i)=>'T-06-'+String(i+1).padStart(2,'0')),'T-06-SC'].map(id=>({id,references:['observed-case'],status:'mitigated-synthetic'}))}});
const observedFixture=[{observedCases:['observed-case']}];
for(const [name,mutate]of [['missing D',e=>e.coverage.decisions.pop()],['missing NET',e=>e.coverage.requirements.pop()],['missing threat',e=>e.coverage.threats.pop()],['open high risk',e=>{e.coverage.threats[0].status='open';}],['unobserved case',e=>{e.coverage.decisions[0].references=['not-run'];}],['no concrete case',e=>{e.coverage.decisions[0].references=[];}]])test('known-bad coverage rejected before later fields: '+name,()=>{const e=coverage();mutate(e);assert.throws(()=>v.validateCoverage(e,observedFixture));});
