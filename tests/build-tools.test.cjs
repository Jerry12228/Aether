'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {planBuild}=require('../scripts/build.cjs');
const {runGroup,validateTests,flutterCommand,clean}=require('../scripts/tool-runner.cjs');
const fs=require('node:fs'),os=require('node:os');
const {parsePub,validatePub,validateCi}=require('../scripts/check-sources.cjs');
const {requireArtifacts}=require('../scripts/verify.cjs');
test('Helios target contains only Helios/native build operations',()=>{
 const plan=planBuild({target:'Helios',configuration:'Release',root:path.resolve(__dirname,'..')});
 assert.equal(plan.commands.length,2,'configure then explicit native target build required');
 assert.ok(plan.commands[1].args.includes('helios'),'must select actual helios target');
 assert.ok(plan.commands.every(command=>!command.args.includes('windows')),'must not launch Flutter');
});
test('missing/malicious targets and invalid configuration reject before launch',()=>{
 for(const target of [undefined,'Both','Helios & echo injected','Selene;evil','`whoami`','"Helios"','Helios>file'])assert.throws(()=>planBuild({target}),/Target/);
 assert.throws(()=>planBuild({target:'Helios',configuration:'Release;evil'}),/Configuration/);
});
test('Selene uses cached official tool through native argv and never Helios',()=>{
 const root=path.resolve(__dirname,'..'),plan=planBuild({target:'Selene',configuration:'Debug',root});
 assert.ok(plan.commands[1].exe.endsWith('dart.exe'));assert.ok(plan.commands[1].args.includes('flutter_tools.snapshot')||plan.commands[1].args[0].endsWith('flutter_tools.snapshot'));
 assert.ok(plan.commands[1].args.includes('--debug'));assert.ok(plan.commands.every(command=>!command.args.includes('helios')));
 assert.throws(()=>flutterCommand(root,['exec','bad']),/Invalid/);
});
test('mandatory test guard rejects empty, zero, failed and skipped tests',()=>{
 for(const output of ['', '# tests 0\n# fail 0\n# skipped 0','# tests 1\n# fail 1\n# skipped 0','# tests 2\n# fail 0\n# skipped 1','# tests 2\n# fail 0\n# skipped 0\n# cancelled 1','PASS Panel/build','PASS Panel/mandatory tests=0','Everything looks good'])assert.throws(()=>validateTests(output));
 assert.equal(validateTests('# tests 2\n# fail 0\n# skipped 0'),2);
});
test('native argv preserves spaces, quotes, ampersand, backtick and redirection as data',async t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'aether tooling space '));t.after(()=>{assert.ok(directory.startsWith(path.join(os.tmpdir(),'aether tooling space ')));fs.rmSync(directory,{recursive:true,force:true});});
 const script=path.join(directory,'arguments script.cjs');fs.writeFileSync(script,'console.log(JSON.stringify(process.argv.slice(2)));');
 const values=['a b','x&y','"quoted"','`tick`','>redirect','$(whoami)'];
 const result=await runGroup({name:'argument-data',exe:process.execPath,args:[script,...values],cwd:directory,timeoutMs:5000},{root:directory});
 assert.equal(result.exitCode,0);assert.ok(result.output.includes(JSON.stringify(values)));assert.ok(fs.existsSync(path.join(directory,result.log)));
});
test('failure and owned-process timeout remain nonzero with bounded logs',async t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'aether timeout '));t.after(()=>{assert.ok(directory.startsWith(path.join(os.tmpdir(),'aether timeout ')));fs.rmSync(directory,{recursive:true,force:true});});
 const failed=await runGroup({name:'failed',exe:process.execPath,args:['-e','console.error("intentional failure");process.exit(7)'],timeoutMs:5000},{root:directory});
 assert.equal(failed.exitCode,7);assert.match(failed.output,/intentional failure/);
 const timeout=await runGroup({name:'timeout',exe:process.execPath,args:['-e','setInterval(()=>{},1000)'],timeoutMs:100},{root:directory});
 assert.equal(timeout.exitCode,124);assert.equal(timeout.timeout,true);assert.ok(timeout.durationMs<3500);
});
test('logs redact credentials and local debug endpoints',()=>{
 const output=clean('token=privatevalue Bearer value http://127.0.0.1:1234/randomAuth/');
 assert.doesNotMatch(output,/privatevalue|randomAuth|Bearer value/);
});
test('source lock guard rejects package version/digest/license drift',()=>{
 const root=path.resolve(__dirname,'..'),lock=JSON.parse(fs.readFileSync(path.join(root,'toolchains.lock.json'),'utf8'));
 assert.equal(parsePub(fs.readFileSync(path.join(root,'pubspec.lock'),'utf8')).size,49);assert.equal(validatePub(root,lock),49);
 for(const field of ['version','sha256','licenseSha256']){const changed=structuredClone(lock);changed.pub.packages[0][field]=field==='version'?'999.0.0':'0'.repeat(64);assert.throws(()=>validatePub(root,changed),/drift/);}
});
test('independent verification rejects absent products before test launch',t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'aether missing artifacts '));
 t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 for(const scope of ['Core','UI','All'])assert.throws(()=>requireArtifacts(directory,scope),/Required built artifact missing/);
 assert.throws(()=>requireArtifacts(directory,'All;evil'),/Invalid/);
});
test('oversized credential lines are omitted through the newline, including chunk suffix',async t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'aether bounded logs '));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 const result=await runGroup({name:'oversized',exe:process.execPath,args:['-e','process.stdout.write("token="+"s".repeat(100000));setTimeout(()=>process.stdout.write("PRIVATE_SUFFIX\\nnormal line\\n"),50)'],timeoutMs:5000},{root:directory});
 assert.equal(result.exitCode,0);assert.match(result.output,/oversized line omitted/);assert.match(result.output,/normal line/);assert.doesNotMatch(result.output,/PRIVATE_SUFFIX/);
});
test('CI guard rejects mutable actions, missing required checks and privileged PR workflows',t=>{
 const root=path.resolve(__dirname,'..'),lock=JSON.parse(fs.readFileSync(path.join(root,'toolchains.lock.json'),'utf8'));
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'aether CI guard '));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 const target=path.join(directory,'.github/workflows/windows.yml');fs.mkdirSync(path.dirname(target),{recursive:true});
 const source=fs.readFileSync(path.join(root,'.github/workflows/windows.yml'),'utf8');
 fs.writeFileSync(target,source);assert.equal(validateCi(directory,lock),2);
 for(const changed of [source.replace(lock.ci.actions.checkout.sha,'v4'),source.replace('-Scope All -Automation','-Scope Core -Automation'),source.replace('pull_request:','pull_request_target:')]){fs.writeFileSync(target,changed);assert.throws(()=>validateCi(directory,lock));}
});
