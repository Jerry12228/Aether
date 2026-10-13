'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'build/phase06/fec-alternatives');
const manifestFile = path.join(base, 'candidate-manifest.json');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function verify(manifest) {
  assert.equal(manifest.sourceSha, '2a81eef56c96c237e590c27f9a75e60317c9c700');
  assert.equal(manifest.addressSanitizer, true);
  for (const file of manifest.inputs) assert.equal(hash(fs.readFileSync(path.join(root, file.path))), file.sha256, file.path);
  assert.equal(hash(fs.readFileSync(manifest.binary)), manifest.binarySha256);
  assert.equal(hash(fs.readFileSync(manifest.runtime.path)), manifest.runtime.sha256);
}
function target() { const manifest = JSON.parse(fs.readFileSync(manifestFile)); verify(manifest); return manifest; }
function run(mode, k, n, input = Buffer.alloc(0)) {
  const manifest = target();
  const args = ['concurrent', 'asan-probe'].includes(mode) ? [mode] : [mode, String(k), String(n)];
  const env = {...process.env};
  const pathKey = Object.keys(env).find(key => key.toLowerCase() === 'path') || 'Path';
  env[pathKey] = path.dirname(manifest.runtime.path) + path.delimiter + (env[pathKey] || '');
  env.ASAN_OPTIONS = 'abort_on_error=0:halt_on_error=1:exitcode=86:symbolize=0';
  const result = cp.spawnSync(manifest.binary, args, {shell: false, windowsHide: true, input, encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024, env});
  assert.ifError(result.error);
  if(mode === 'asan-probe') {
    assert.equal(result.status, 86, result.stderr);
    assert.match(result.stderr, /AddressSanitizer: heap-use-after-free/);
    return {ok: false, sanitizerDetected: true};
  }
  assert.ok([0, 2].includes(result.status), JSON.stringify({status: result.status, signal: result.signal, stderr: result.stderr}));
  assert.equal(result.stderr, '', 'Unexpected sanitizer/native diagnostic');
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, result.status === 0);
  return output;
}
function records(shares) {
  return Buffer.concat(shares.map(([id, data]) => {
    const bytes = typeof data === 'string' ? Buffer.from(data, 'hex') : data;
    const header = Buffer.alloc(4); header.writeUInt16BE(id); header.writeUInt16BE(bytes.length, 2);
    return Buffer.concat([header, bytes]);
  }));
}
function combinations(n, k, prefix = [], start = 0, result = []) {
  if (prefix.length === k) { result.push(prefix); return result; }
  for (let i = start; i <= n - (k - prefix.length); ++i) combinations(n, k, [...prefix, i], i + 1, result);
  return result;
}
function vectors() {
  const rows = []; let row;
  for (const line of fs.readFileSync(path.join(base, 'botan/src/tests/data/zfec.vec'), 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue;
    const match = /^(K|N|Data|Code) = ([0-9a-f]+)$/.exec(line); assert.ok(match, 'Unexpected upstream vector syntax');
    if (match[1] === 'K') { row = {}; rows.push(row); }
    row[match[1]] = ['K', 'N'].includes(match[1]) ? Number(match[2]) : Buffer.from(match[2], 'hex');
  }
  assert.ok(rows.length > 0); return rows;
}
function manifest() {
  const audit = JSON.parse(fs.readFileSync(path.join(base, 'botan-audit.json')));
  const config = JSON.parse(fs.readFileSync(path.join(base, 'botan-build/build/build_config.json')));
  const paths = new Set(config.lib_build_info.map(item => 'build/phase06/fec-alternatives/botan/' + item.src));
  for (const subdirectory of ['public/botan', 'internal/botan/internal']) {
    const prefix = 'build/phase06/fec-alternatives/botan-build/build/include/' + subdirectory;
    for (const file of fs.readdirSync(path.join(root, prefix))) paths.add(prefix + '/' + file);
  }
  for (const file of ['license.txt', 'configure.py', 'src/tests/data/zfec.vec', 'src/lib/misc/zfec/info.txt']) paths.add('build/phase06/fec-alternatives/botan/' + file);
  for (const file of ['tests/native/fec-candidate/CMakeLists.txt', 'tests/native/fec-candidate/candidate.cpp', 'tests/protocol-fec-candidate.test.cjs']) paths.add(file);
  for (const file of ['fec_research.vcxproj', 'fec_candidate.vcxproj']) {
    const relative = 'build/phase06/fec-alternatives/candidate-build/' + file;
    assert.match(fs.readFileSync(path.join(root, relative), 'utf8'), /\/fsanitize=address/);
    paths.add(relative);
  }
  const cmakeFiles = path.join(base, 'candidate-build/CMakeFiles');
  const version = fs.readdirSync(cmakeFiles).find(name => /^\d+\.\d+\.\d+$/.test(name)); assert.ok(version);
  const compilerConfig = fs.readFileSync(path.join(cmakeFiles, version, 'CMakeCXXCompiler.cmake'), 'utf8');
  const compiler = /set\(CMAKE_CXX_COMPILER "([^"]+)"\)/.exec(compilerConfig); assert.ok(compiler);
  const runtimePath = path.join(path.dirname(compiler[1]), 'clang_rt.asan_dynamic-x86_64.dll');
  const runtime = {path: runtimePath, sha256: hash(fs.readFileSync(runtimePath)), scope: 'installed compiler runtime; owned child PATH only; not redistributed'};
  const binary = path.join(base, 'candidate-build/Release/fec_candidate.exe');
  const value = {schema: 1, sourceSha: audit.sourceSha, archiveSha256: audit.archiveSha256, binary, binarySha256: hash(fs.readFileSync(binary)), addressSanitizer: true, runtime, inputs: [...paths].sort().map(file => ({path: file, sha256: hash(fs.readFileSync(path.join(root, file)))})), synthetic: true, systemMutation: false, productLinked: false};
  fs.writeFileSync(manifestFile, JSON.stringify(value, null, 2) + '\n');
  console.log(JSON.stringify({binarySha256: value.binarySha256, inputs: value.inputs.length, addressSanitizer: true}));
}
if (process.argv.includes('--manifest')) manifest();
else {
  test('research executable and every selected source/header are hash-bound', () => {
    const good = target(); const bad = structuredClone(good); bad.inputs[0].sha256 = '0'.repeat(64);
    assert.throws(() => verify(bad));
  });
  test('known-bad research-only memory access is rejected by the actual ASan runtime', () => {
    assert.equal(run('asan-probe').sanitizerDetected, true);
  });
  test('native scalar parity matches every upstream independently zfec-generated KAT', {timeout: 30000}, () => {
    const rows = vectors();
    for (const row of rows) {
      const output = run('encode', row.K, row.N, row.Data); assert.equal(output.ok, true);
      assert.equal(output.shares.length, row.N);
      assert.equal(output.shares.slice(row.K).join(''), row.Code.toString('hex'));
      assert.equal(output.shares.slice(0, row.K).join(''), row.Data.toString('hex'));
    }
    const out = path.join(root, 'artifacts/phase06/fec-candidate-kat.json');
    fs.writeFileSync(out, JSON.stringify({vectors: rows.length, source: 'Botan pinned zfec.vec; generated by independent zfec', vectorSha256: hash(fs.readFileSync(path.join(base, 'botan/src/tests/data/zfec.vec'))), matched: rows.length, binarySha256: target().binarySha256}) + '\n');
  });
  test('k2 parity matches independent polynomial arithmetic, not library encode-as-oracle', () => {
    const a = Buffer.from(Array.from({length: 256}, (_, i) => i));
    const b = Buffer.from(Array.from({length: 256}, (_, i) => 255 - i));
    const mul2 = x => ((x << 1) ^ (x & 128 ? 0x11d : 0)) & 255;
    // Independent interpolation at zfec points 0,2,4 gives coefficients (3,2).
    const expected = Buffer.from(a.map((x, i) => mul2(x) ^ x ^ mul2(b[i])));
    const output = run('encode', 2, 3, Buffer.concat([a, b]));
    assert.equal(output.shares[2], expected.toString('hex'));
  });
  test('every exact-threshold survivor subset recovers k2n4, k4n6 and k5n7', {timeout: 30000}, () => {
    for (const [k, n] of [[2, 4], [4, 6], [5, 7]]) {
      const bytes = Buffer.from(Array.from({length: k * 16}, (_, i) => (i * 13 + 7) & 255));
      const shares = run('encode', k, n, bytes).shares;
      for (const ids of combinations(n, k)) {
        const output = run('decode', k, n, records(ids.map(id => [id, shares[id]])));
        assert.equal(output.ok, true); assert.equal(output.shares.join(''), bytes.toString('hex'));
      }
    }
  });
  test('fewer than K survivors are rejected without a partial output sink', () => {
    for (const ids of [[], [[0, Buffer.alloc(16)]], [[0, Buffer.alloc(16)], [1, Buffer.alloc(16)], [2, Buffer.alloc(16)]]]) {
      const output = run('decode', 4, 6, records(ids)); assert.equal(output.ok, false); assert.equal(output.shares, undefined);
    }
  });
  test('invalid constructor dimensions are checked before upstream allocation', () => {
    for (const [k, n] of [[0, 3], [3, 0], [4, 3], [1, 256], [256, 256], ['18446744073709551615', 2], [-1, 3]]) assert.equal(run('encode', k, n, Buffer.alloc(16)).ok, false);
  });
  test('share-size 1024 boundary passes and zero/1025/inexact-K input rejects', () => {
    assert.equal(run('encode', 2, 3, Buffer.alloc(2048)).ok, true);
    for (const size of [0, 3, 2050]) assert.equal(run('encode', 2, 3, Buffer.alloc(size)).ok, false);
  });
  test('K=N=255 remains bounded and preserves each source byte', () => {
    const bytes = Buffer.from(Array.from({length: 255}, (_, i) => i));
    const output = run('encode', 255, 255, bytes); assert.equal(output.shares.length, 255); assert.equal(output.shares.join(''), bytes.toString('hex'));
  });
  test('duplicate/out-of-range/truncated/unequal/oversized decode shares reject atomically', () => {
    const good = [[0, Buffer.alloc(16)], [1, Buffer.alloc(16)]];
    const invalid = [
      records([[0, Buffer.alloc(16)], [0, Buffer.alloc(16)]]),
      records([[0, Buffer.alloc(16)], [3, Buffer.alloc(16)]]),
      records([[0, Buffer.alloc(16)], [1, Buffer.alloc(15)]]),
      records([[0, Buffer.alloc(1025)], [1, Buffer.alloc(1025)]]),
      records([[0, Buffer.alloc(0)], [1, Buffer.alloc(0)]]),
      records(good).subarray(0, 3), records(good).subarray(0, -1),
    ];
    for (const input of invalid) { const output = run('decode', 2, 3, input); assert.equal(output.ok, false); assert.equal(output.shares, undefined); }
  });
  test('FEC does not authenticate shares: corruption changes recovered bytes', () => {
    const bytes = Buffer.from('0001020304050607', 'hex'); const shares = run('encode', 2, 3, bytes).shares;
    const corrupt = Buffer.from(shares[2], 'hex'); corrupt[0] ^= 128;
    const output = run('decode', 2, 3, records([[1, shares[1]], [2, corrupt]]));
    assert.equal(output.ok, true); assert.notEqual(output.shares.join(''), bytes.toString('hex'));
  });
  test('concurrent first initialization, per-object and shared-const operations join all threads', () => {
    const output = run('concurrent'); assert.equal(output.checks, 1600); assert.equal(output.threadsJoined, 16);
  });
}
