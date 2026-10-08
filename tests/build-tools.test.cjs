'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {planBuild}=require('../scripts/build.cjs');
test('Helios target contains only Helios/native build operations',()=>{
 const plan=planBuild({target:'Helios',configuration:'Release',root:path.resolve(__dirname,'..')});
 assert.equal(plan.commands.length,2,'configure then explicit native target build required');
 assert.ok(plan.commands[1].args.includes('helios'),'must select actual helios target');
 assert.ok(plan.commands.every(command=>!command.args.includes('windows')),'must not launch Flutter');
});
