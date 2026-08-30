const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../src/data/deuteronomyEditorialSpecific.ts');
const source = fs.readFileSync(filename, 'utf8');
const result = ts.transpileModule(source, {
  fileName: filename,
  reportDiagnostics: true,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const moduleResult = { exports: {} };
vm.runInThisContext(`(function(module,exports){${result.outputText}\n})`, { filename })(moduleResult, moduleResult.exports);
const data = moduleResult.exports.deuteronomyEditorialSpecific;

test('Deuteronomy has exactly 34 complete chapter profiles and valid TS syntax', () => {
  assert.equal((result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  assert.deepEqual(Object.keys(data), Array.from({ length: 34 }, (_, i) => String(i + 1)));
  for (const [chapter, profile] of Object.entries(data)) {
    for (const field of ['summary', 'structure', 'context', 'formation', 'critical', 'textual']) {
      assert.ok(typeof profile[field] === 'string' && profile[field].trim(), `${chapter}: ${field}`);
      assert.doesNotMatch(profile[field], /in preparazione|da definire|non ancora disponibile/i);
    }
    assert.ok(Array.isArray(profile.bibliography) && profile.bibliography.length >= 5);
    assert.ok(profile.bibliography.every(item => typeof item === 'string' && item.trim()));
  }
});

test('chapter-specific formation and textual notes cannot regress to shared boilerplate', () => {
  for (const field of ['summary', 'formation', 'textual']) {
    assert.equal(new Set(Object.values(data).map(profile => profile[field])).size, 34, field);
  }
  for (const profile of Object.values(data)) assert.match(profile.textual, /\d+,\d+/);
});

test('CEI chapter boundaries and important textual distinctions remain documented', () => {
  assert.match(data[13].structure, /13,1 integrità.*13,2–6/);
  assert.match(data[22].structure, /22,13–29/);
  assert.match(data[23].structure, /23,1 divieto/);
  assert.match(data[28].structure, /28,69/);
  assert.match(data[29].textual, /29,28.*29,29/);
  assert.match(data[27].textual, /MT legge Ebal.*Samaritano Garizim/);
  assert.match(data[32].textual, /32,8.*Qumran.*32,43/);
  assert.match(data[6].textual, /non presuppone consonanti differenti/);
  assert.match(data[26].textual, /Non sono tre varianti manoscritte/);
});

test('online bibliography remains chapter-relevant rather than shared by reference', () => {
  const online = n => data[n].bibliography.filter(item => item.includes('https://'));
  assert.equal(online(1).length, 0);
  assert.ok(online(27).some(item => item.includes('mt-ebal-or-mt-gerizim')));
  assert.ok(online(32).some(item => item.includes('Deuteronomy+32')));
  assert.ok(!online(6).some(item => item.includes('Deuteronomy+32')));
});
