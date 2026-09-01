const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../src/data/joshuaEditorialSpecific.ts');
const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, reportDiagnostics: true,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const loaded = { exports: {} };
vm.runInThisContext('(function(module,exports){' + result.outputText + '\n})', { filename })(loaded, loaded.exports);
const data = loaded.exports.joshuaEditorialSpecific;

test('Joshua has 24 complete profiles and valid TypeScript syntax', () => {
  assert.equal((result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  assert.deepEqual(Object.keys(data), Array.from({ length: 24 }, (_, i) => String(i + 1)));
  for (const profile of Object.values(data)) {
    for (const field of ['summary', 'structure', 'context', 'formation', 'critical', 'textual']) {
      assert.ok(typeof profile[field] === 'string' && profile[field].trim(), field);
      assert.doesNotMatch(profile[field], /in preparazione|da definire|non ancora disponibile/i);
    }
    assert.ok(profile.bibliography.length >= 5);
    assert.ok(profile.bibliography.every(item => typeof item === 'string' && item.trim()));
  }
});

test('summary, formation and textual notes remain chapter-specific', () => {
  for (const field of ['summary', 'formation', 'textual']) {
    assert.equal(new Set(Object.values(data).map(p => p[field])).size, 24, field);
  }
  for (const profile of Object.values(data)) assert.match(profile.textual, /\d+,\d+/);
});

test('six final tribal allocations and documented textual distinctions are preserved', () => {
  assert.match(data[19].summary, /Sei tribù/);
  assert.match(data[19].structure, /19,40–48 Dan/);
  assert.match(data[15].textual, /undici città.*assente nel Testo Masoretico/);
  assert.match(data[24].textual, /Sichem.*Settanta legge Silo/);
  assert.match(data[24].textual, /proposta storico-letteraria/);
  assert.match(data[8].textual, /non sono di per sé varianti manoscritte/);
  assert.match(data[14].critical, /non sono, in quanto tali, varianti manoscritte/);
});

test('bibliography corrects Butler date and keeps consulted resources chapter-local', () => {
  for (const profile of Object.values(data)) {
    const butler = profile.bibliography.find(item => item.startsWith('Butler,'));
    assert.match(butler, /2a ed.*2014\.$/);
    assert.doesNotMatch(butler, /2025/);
  }
  const online = n => data[n].bibliography.filter(item => item.includes('https://'));
  assert.equal(online(1).length, 0);
  assert.ok(online(15).some(item => item.includes('josh-1558-1559')));
  assert.ok(online(20).some(item => item.includes('joshua/20')));
  assert.ok(online(24).some(item => item.includes('2522/1319/11150')));
  assert.ok(!online(15).some(item => item.includes('2522/1319/11150')));
});
