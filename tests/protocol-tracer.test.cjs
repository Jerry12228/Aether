'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'build/phase06/windows-x64');
const manifestFile = path.join(directory, 'target-manifest-Debug.json');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

test('different native processes exchange authenticated control and protected UDP media', async () => {
  assert.ok(fs.existsSync(manifestFile), 'Build the audited protocol tracer first');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  assert.equal(manifest.configuration, 'Debug');
  assert.equal(manifest.target, 'aether_protocol_tracer');
  assert.ok(fs.existsSync(manifest.binary));
  assert.equal(digest(fs.readFileSync(manifest.binary)), manifest.sha256);
  assert.fail('Native secure process oracle has not been implemented');
});
