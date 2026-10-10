'use strict';
// Research-only: no product build or dependency lock is changed here.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'build/phase06/fec-alternatives');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const candidates = [
  {name: 'botan', repo: 'randombit/botan', ref: '3.13.0'},
  {name: 'fecpp', repo: 'randombit/fecpp', ref: 'd7e9b41eaaab3c605be36f282465210d17bc432f'},
  {name: 'cm256', repo: 'catid/cm256', ref: '634d1e36b095dbba937586a7e9843d828762dae4'},
  {name: 'libcorrect', repo: 'quiet/libcorrect', ref: 'ee82e6673a806dfdf0a969b975ab36596ecc5401'},
  {name: 'zfec', repo: 'tahoe-lafs/zfec', ref: '1fede6c166592c98da7f102539f94daf99db4756'},
];
async function download(url, bound) {
  const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
  assert.equal(response.status, 200, url);
  let size = 0;
  const chunks = [];
  for await (const chunk of response.body) {
    size += chunk.length;
    assert.ok(size <= bound, 'Download byte limit');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
async function get(url, bound) {
  for (let attempt = 0; ; ++attempt) {
    try { return await download(url, bound); }
    catch (error) {
      if (attempt >= 2 || !['ECONNRESET', 'ETIMEDOUT'].includes(error.cause?.code)) throw error;
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}
async function json(url) { return JSON.parse(await get(url, 8 * 1024 * 1024)); }
function tar(args) {
  const result = cp.spawnSync('tar', args, {shell: false, windowsHide: true, encoding: 'utf8', timeout: 30000, maxBuffer: 2 * 1024 * 1024});
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}
async function audit(candidate) {
  const commit = await json(`https://api.github.com/repos/${candidate.repo}/commits/${candidate.ref}`);
  const sourceSha = commit.sha;
  const tree = await json(`https://api.github.com/repos/${candidate.repo}/git/trees/${sourceSha}?recursive=1`);
  assert.equal(tree.truncated, false);
  const allBlobs = tree.tree.filter(item => item.type === 'blob');
  const excludedSymlinks = allBlobs.filter(item => item.mode === '120000').map(item => item.path);
  const blobs = allBlobs.filter(item => item.mode === '100644' || item.mode === '100755');
  assert.equal(allBlobs.length, blobs.length + excludedSymlinks.length, 'Unknown source mode');
  assert.ok(blobs.reduce((n, item) => n + item.size, 0) < 64 * 1024 * 1024);
  const archiveUrl = `https://api.github.com/repos/${candidate.repo}/tarball/${sourceSha}`;
  const bytes = await get(archiveUrl, 24 * 1024 * 1024);
  const directory = path.join(base, candidate.name);
  fs.mkdirSync(directory, {recursive: true});
  const archive = path.join(base, `${candidate.name}-${sourceSha}.tar.gz`);
  fs.writeFileSync(archive, bytes);
  const entries = tar(['-tzf', archive]).trim().split(/\r?\n/);
  const prefix = entries[0];
  assert.match(prefix, /^[A-Za-z0-9._-]+\/$/);
  const allowed = new Set(['', ...tree.tree.map(item => item.path + (item.type === 'tree' ? '/' : ''))]);
  for (const entry of entries) {
    assert.ok(entry.startsWith(prefix));
    assert.ok(allowed.has(entry.slice(prefix.length)), entry);
  }
  for (const line of tar(['-tvzf', archive]).trim().split(/\r?\n/)) {
    assert.ok(['-', 'd', 'l'].includes(line[0]), 'Archive special entry refused');
  }
  // Exclude every official symlink instead of following archive-controlled targets.
  tar(['-xzf', archive, '--strip-components=1', ...excludedSymlinks.map(file => `--exclude=${prefix}${file}`), '-C', directory]);
  const archiveTransforms = [];
  if (candidate.name === 'zfec') {
    const attributes = fs.readFileSync(path.join(directory, '.gitattributes'));
    const attributeBlob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${attributes.length}\0`), attributes])).digest('hex');
    assert.equal(attributeBlob, blobs.find(item => item.path === '.gitattributes').sha);
    assert.equal(attributes.toString('utf8').trim(), 'zfec/_version.py export-subst');
    const file = 'zfec/_version.py';
    const archiveContent = fs.readFileSync(path.join(directory, file));
    const original = await get(`https://raw.githubusercontent.com/${candidate.repo}/${sourceSha}/${file}`, 1024 * 1024);
    const originalBlob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${original.length}\0`), original])).digest('hex');
    assert.equal(originalBlob, blobs.find(item => item.path === file).sha);
    archiveTransforms.push({path: file, reason: 'official verified export-subst; restore exact Git blob for research', archiveSha256: hash(archiveContent), sourceSha256: hash(original)});
    fs.writeFileSync(path.join(directory, file), original);
  }
  const files = blobs.map(item => {
    const resolved = path.resolve(directory, item.path);
    assert.ok(resolved.startsWith(directory + path.sep));
    const content = fs.readFileSync(resolved);
    const blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${content.length}\0`), content])).digest('hex');
    assert.equal(blob, item.sha, item.path);
    return {path: item.path, blob, sha256: hash(content), bytes: content.length};
  });
  const result = {...candidate, sourceSha, commitDate: commit.commit.committer.date, archiveUrl, archiveSha256: hash(bytes), archiveBytes: bytes.length, excludedSymlinks, archiveTransforms, fileCount: files.length, inventorySha256: hash(Buffer.from(JSON.stringify(files))), files, status: 'research-only-not-linked'};
  fs.writeFileSync(path.join(base, candidate.name + '-audit.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({...result, files: files.filter(item => /license|copyright|copying|readme|zfec|fecpp|cm256|gf256/i.test(item.path)).map(({path, sha256}) => ({path, sha256}))}));
  return result;
}
async function main() {
  const decision = JSON.parse(fs.readFileSync(path.join(root, 'docs/phase06/FEC-DECISION.json')));
  assert.equal(decision.rawResponse, '2,若无则1');
  for (const material of decision.reviewedMaterials) assert.equal(hash(fs.readFileSync(path.join(root, material.path))), material.sha256);
  fs.mkdirSync(base, {recursive: true});
  if (process.argv.includes('--build-botan')) return buildBotan();
  if (process.argv.includes('--dossier')) return dossier();
  const results = [];
  for (const candidate of candidates) results.push(await audit(candidate));
  fs.writeFileSync(path.join(base, 'audit.json'), JSON.stringify({schema: 1, observedAt: new Date().toISOString(), candidates: results}, null, 2) + '\n');
}
function dossier() {
  assert.ok(!fs.existsSync(path.join(root, 'docs/phase06/FEC-REUSE-DECISION.json')), 'Do not reseal a human-reviewed FEC reuse decision');
  const audit = JSON.parse(fs.readFileSync(path.join(base, 'audit.json')));
  const selected = audit.candidates.find(candidate => candidate.name === 'botan');
  const manifest = JSON.parse(fs.readFileSync(path.join(base, 'candidate-manifest.json')));
  for (const input of manifest.inputs) assert.equal(hash(fs.readFileSync(path.join(root, input.path))), input.sha256, input.path);
  assert.equal(hash(fs.readFileSync(manifest.binary)), manifest.binarySha256);
  assert.equal(hash(fs.readFileSync(manifest.runtime.path)), manifest.runtime.sha256);
  const sourceFiles = manifest.inputs.filter(input => input.path.includes('/botan/src/') || input.path.includes('/botan-build/build/include/')).map(input => {
    const text = fs.readFileSync(path.join(root, input.path), 'utf8');
    const matches = selected.files.filter(file => file.sha256 === input.sha256);
    const notices = [...text.matchAll(/\/\*[\s\S]*?\*\//g)].map(match => match[0]).filter(comment => /copyright|\(C\)|licen[cs]e|permission|public.domain/i.test(comment));
    return {...input, officialMatches: matches.map(file => ({path: file.path, blob: file.blob})), generated: matches.length === 0, notices};
  });
  const build = JSON.parse(fs.readFileSync(path.join(base, 'botan-build-report.json')));
  const result = {
    schema: 1, observedAt: new Date().toISOString(), status: 'alternative-proposal-not-approved', fallbackTriggered: false,
    candidates: audit.candidates.map(({files, ...candidate}) => ({...candidate, relevantFiles: files.filter(file => /(?:license|copyright|copying|readme)|^(?:include\/(?:cm256|gf256)\.h|src\/(?:cm256|gf256)\.cpp|include\/correct\.h|zfec\/fec\.[ch]|fecpp\.[ch]pp?)$/i.test(file.path))})),
    selected: {name: 'Botan ZFEC scalar subset', sourceSha: selected.sourceSha, archiveSha256: selected.archiveSha256, sourceFiles, build, manifest},
    notices: ['botan/license.txt', 'fecpp/license.txt'].map(file => ({path: file, sha256: hash(fs.readFileSync(path.join(base, file))), text: fs.readFileSync(path.join(base, file), 'utf8'), scope: file.startsWith('botan') ? 'selected upstream root license plus per-file author notices' : 'upstream FECpp predecessor notice retained; no FECpp product code copied'})),
    tools: {python: {path: build.interpreter, sha256: hash(fs.readFileSync(build.interpreter)), scope: 'installed build-only interpreter; no package installation or redistribution'}, addressSanitizer: manifest.runtime},
    evidence: ['artifacts/phase06/fec-alternatives-audit.log', 'artifacts/phase06/botan-fec-build.log', 'artifacts/phase06/botan-fec-asan-build.log', 'artifacts/phase06/fec-candidate-tests.log', 'artifacts/phase06/fec-candidate-kat.json'].map(file => ({path: file, sha256: hash(fs.readFileSync(path.join(root, file)))})),
  };
  const target = path.join(root, 'docs/phase06/FEC-ALTERNATIVES.json');
  fs.writeFileSync(target, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({sha256: hash(fs.readFileSync(target)), sourceFiles: sourceFiles.length, generatedHeaders: sourceFiles.filter(file => file.generated).map(file => file.path), candidates: result.candidates.map(candidate => ({name: candidate.name, sourceSha: candidate.sourceSha}))}));
}
function buildBotan() {
  const audit = JSON.parse(fs.readFileSync(path.join(base, 'botan-audit.json')));
  assert.equal(audit.sourceSha, '2a81eef56c96c237e590c27f9a75e60317c9c700');
  for (const file of audit.files) assert.equal(hash(fs.readFileSync(path.join(base, 'botan', file.path))), file.sha256, file.path);
  const vswhere = path.join(process.env['ProgramFiles(x86)'], 'Microsoft Visual Studio/Installer/vswhere.exe');
  const vs = cp.spawnSync(vswhere, ['-latest', '-products', '*', '-property', 'installationPath'], {shell: false, windowsHide: true, encoding: 'utf8'});
  assert.equal(vs.status, 0);
  const dev = path.join(vs.stdout.trim(), 'Common7/Tools/VsDevCmd.bat');
  assert.ok(fs.existsSync(dev));
  const python = cp.spawnSync('py', ['-c', 'import sys; print(sys.executable)'], {shell: false, windowsHide: true, encoding: 'utf8'});
  assert.equal(python.status, 0);
  const interpreter = python.stdout.trim();
  for (const value of [base, dev, interpreter]) assert.ok(!/[\r\n%&|<>^!]/.test(value));
  const options = ['--cc=msvc', '--os=windows', '--cpu=x86_64', '--minimized-build', '--enable-modules=zfec', '--disable-modules=zfec_vperm,zfec_gfni,cpuid', '--disable-asm', '--disable-shared-library', '--build-targets=static', '--without-documentation', '--link-method=copy', '--msvc-runtime=MT', '--werror-mode', '--with-build-dir=../botan-build'];
  const batch = path.join(base, 'build-botan.cmd');
  fs.writeFileSync(batch, `@echo off\r\ncall "${dev}" -arch=x64 -host_arch=x64 >NUL\r\nif errorlevel 1 exit /b 1\r\nset "GIT_CEILING_DIRECTORIES=${base}"\r\ncd /d "${path.join(base, 'botan')}"\r\n"${interpreter}" configure.py ${options.join(' ')}\r\nif errorlevel 1 exit /b 1\r\nnmake /nologo /f ../botan-build/Makefile\r\nexit /b %errorlevel%\r\n`);
  const log = path.join(root, 'artifacts/phase06/botan-fec-build.log');
  const fd = fs.openSync(log, 'w');
  const started = Date.now();
  const result = cp.spawnSync(path.join(process.env.SystemRoot, 'System32/cmd.exe'), ['/d', '/c', batch], {shell: false, windowsHide: true, timeout: 300000, stdio: ['ignore', fd, fd]});
  fs.closeSync(fd);
  assert.equal(result.status, 0, result.error?.message || 'See botan-fec-build.log');
  const config = JSON.parse(fs.readFileSync(path.join(base, 'botan-build/build/build_config.json')));
  assert.ok(!config.module_defines.some(item => /TLS|ZFEC_GFNI|ZFEC_VPERM|CPUID|AEAD/.test(JSON.stringify(item))));
  const library = path.join(base, 'botan-build/botan-3.lib');
  const report = {schema: 1, sourceSha: audit.sourceSha, archiveSha256: audit.archiveSha256, options, interpreter, elapsedMs: Date.now() - started, modules: config.module_defines, compiledSources: config.lib_build_info.map(item => item.src), library, librarySha256: hash(fs.readFileSync(library)), status: 'research-only-not-linked'};
  fs.writeFileSync(path.join(base, 'botan-build-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
