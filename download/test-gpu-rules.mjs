// Checks gpu-rules.js against redfox-os's rules and test cases, the same
// cases RedFox Hub's helper is tested on.
//
//   node download/test-gpu-rules.mjs [path to a redfox-os checkout | branch]
//
// With no argument it reads them from the main branch on GitHub.
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { recommend, parseCode } = require('./gpu-rules.js');

const where = process.argv[2] || 'main';
async function load(file) {
  if (existsSync(where)) return JSON.parse(await readFile(path.join(where, file), 'utf8'));
  const url = `https://raw.githubusercontent.com/snakeeyes021/redfox-os/${where}/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
}

const rules = await load('files/system/usr/share/redfox/gpu-rules.json');
const cases = await load('tests/gpu-cases.json');

let failed = 0;
for (const c of cases) {
  const got = recommend(rules, c.devices);
  // The code the detectors print, round-tripped.
  const code = c.devices.length ? `RFX1 ${c.devices.map((d) => d.join(':')).join(' ')}` : 'RFX1 none';
  const parsed = parseCode(code);
  const ok = got.image === c.image && got.hybrid === Boolean(c.hybrid)
    && JSON.stringify(parsed) === JSON.stringify(c.devices);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${c.name}: ${got.image} (${got.why})${got.hybrid ? ', hybrid' : ''}`);
  if (!ok) failed++;
}
for (const bad of ['', 'hello', 'RFX1 10de', 'RFX2 10de:1c03']) {
  if (parseCode(bad) !== null) { console.log(`FAIL parseCode accepted ${JSON.stringify(bad)}`); failed++; }
}
console.log(failed ? `${failed} failed` : 'All good.');
process.exit(failed ? 1 : 0);
