const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
// Actual modules, no network: only the configured CMS client is replaced.
function loader() {
  const cache = new Map();
  const diagnostics = [];
  let response = null;
  function load(relative) {
    const file = path.resolve(root, relative);
    if (file === path.join(root, 'src/sanity/client.ts')) {
      return { client: { fetch: async () => response } };
    }
    if (cache.has(file)) return cache.get(file).exports;
    const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file, reportDiagnostics: true,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    diagnostics.push(...(compiled.diagnostics || []));
    const mod = { exports: {} };
    cache.set(file, mod);
    vm.runInThisContext('(function(require,module,exports){' + compiled.outputText + '\n})', { filename: file })(
      name => {
        assert.ok(name.startsWith('.'), 'Unexpected runtime dependency: ' + name);
        return load(path.resolve(path.dirname(file), name + '.ts'));
      }, mod, mod.exports);
    return mod.exports;
  }
  return { load, diagnostics, setResponse: value => { response = value; } };
}
const runtime = loader();
const profiles = runtime.load('src/data/romansEditorialSpecific.ts').romansEditorialSpecific;
const words = text => text.trim().split(/\s+/).length;
const fields = {
  summary: 'sintesi', structure: 'struttura', context: 'contestoStorico',
  formation: 'tradizione', critical: 'analisiStoricoCritica',
  textual: 'testoCritico', bibliography: 'bibliografia',
};

test('Romans contains exactly sixteen complete, syntactically valid profiles', () => {
  assert.deepEqual(Object.keys(profiles), Array.from({ length: 16 }, (_, i) => String(i + 1)));
  assert.equal(runtime.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  for (const [n, p] of Object.entries(profiles)) {
    for (const field of Object.keys(fields).filter(f => f !== 'bibliography')) {
      assert.ok(typeof p[field] === 'string' && p[field].trim(), n + ': ' + field);
      assert.doesNotMatch(p[field], /in preparazione|da definire|Analisi epistolare, retorica, storica e compositiva/i);
    }
    assert.ok(Array.isArray(p.bibliography) && p.bibliography.every(x => typeof x === 'string' && x.trim()));
  }
});

test('explanatory summaries and chapter-local notes cannot regress to labels or shared boilerplate', () => {
  // Length and uniqueness are regression guards, not scientific-quality scores.
  for (const [n, p] of Object.entries(profiles)) {
    assert.ok(words(p.summary) >= 80 && words(p.summary) <= 140, n + ': summary length');
    assert.ok(words(p.critical) >= 160, n + ': critical explanation');
    assert.match(p.textual, new RegExp('\\b' + n + ',\\d+'));
  }
  for (const field of ['summary', 'context', 'formation', 'critical', 'textual']) {
    assert.equal(new Set(Object.values(profiles).map(p => p[field])).size, 16, field);
  }
});

test('chapter structures cover the full sequence and explicitly handle Romans 16:24', () => {
  const ends = [32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27];
  for (const [key, p] of Object.entries(profiles)) {
    const n = Number(key);
    const spans = [...p.structure.matchAll(new RegExp('\\b' + n + ',(\\d+)–(\\d+)', 'g'))]
      .map(m => [Number(m[1]), Number(m[2])]);
    assert.equal(spans[0][0], 1, key);
    assert.equal(spans.at(-1)[1], ends[n - 1], key);
    for (let i = 1; i < spans.length; i++) {
      const gap = n === 16 && spans[i][0] === 25 ? 2 : 1;
      // Romans 7:13 is a single-verse unit between ranges.
      const singleton = n === 7 && spans[i][0] === 14 ? 2 : gap;
      assert.equal(spans[i][0], spans[i - 1][1] + singleton, key);
    }
  }
  assert.match(profiles[7].structure, /7,13:/);
  assert.match(profiles[16].structure, /v\. 24.*discussione testuale/);
  assert.match(profiles[16].textual, /lasciato senza testo.*CEI 2008/);
});

test('key interpretive distinctions and cross-chapter reasoning remain explicit', () => {
  assert.match(profiles[1].summary, /capitolo 2/);
  assert.match(profiles[3].textual, /fede in Gesù Cristo.*fedeltà di Gesù Cristo/);
  assert.match(profiles[5].textual, /vera variante/);
  assert.match(profiles[8].textual, /8,1.*8,4/);
  assert.match(profiles[9].textual, /punteggiatura/);
  assert.match(profiles[10].textual, /Gl 3,5.*Gl 2,32/);
  assert.match(profiles[11].critical, /Tutto Israele.*discusso/);
  assert.match(profiles[13].critical, /applicazione contemporanea/);
  assert.match(profiles[16].critical, /CEI.*fra gli apostoli.*NET.*agli apostoli/);
  assert.match(profiles[16].textual, /P46.*15,33/);
});

test('consulted sources are distinguished from general bibliography and scoped to chapters', () => {
  for (const [n, p] of Object.entries(profiles)) {
    assert.equal(p.bibliography.filter(x => x.startsWith('Bibliografia di riferimento')).length, 5);
    const sources = p.bibliography.filter(x => x.startsWith('Fonte consultata:'));
    assert.ok(sources.length >= 1);
    assert.ok(sources.some(x => x.includes('search=Romans+' + n + '&version=NET')));
    for (const item of sources) assert.ok(new URL(item.match(/https:\/\/\S+/)[0]).protocol === 'https:');
  }
  assert.notEqual(profiles[1].bibliography, profiles[2].bibliography);
  assert.ok(!profiles[1].bibliography.some(x => x.includes('history-matters')));
  assert.ok(profiles[11].bibliography.some(x => x.includes('history-matters')));
});

test('all sixteen profiles reach the primary editorial registry without overwriting CMS metadata', () => {
  const enrich = runtime.load('src/data/editorialRegistry.ts').enrichEditorialChapter;
  for (const [n, p] of Object.entries(profiles)) {
    const original = Object.freeze({ titolo: 'CMS title', sintesi: 'old label', attribuzioniFonti: ['preserve'] });
    const actual = enrich('romani', original, Number(n));
    for (const [field, mapped] of Object.entries(fields)) assert.deepEqual(actual[mapped], p[field], n + ': ' + field);
    assert.equal(actual.titolo, original.titolo);
    assert.deepEqual(actual.attribuzioniFonti, original.attribuzioniFonti);
    assert.equal(original.sintesi, 'old label');
  }
});

test('rebuild receives all sixteen revised profiles while retaining text witnesses', async () => {
  const fetchView = runtime.load('src/data-access/chapter.ts').fetchChapterView;
  for (const [n, p] of Object.entries(profiles)) {
    const witness = { lingua: 'it', tradizione: 'cei', versetti: [{ numero: '1', testo: 'Fixture' }] };
    runtime.setResponse({
      libro: { titolo: 'Romani', capitoli: 16 },
      capitolo: { titolo: 'CMS title', sintesi: 'old label' },
      capitoli: [{ numero: Number(n) }], testiBiblici: [witness],
    });
    const view = await fetchView('romani', Number(n));
    for (const field of Object.keys(fields)) assert.deepEqual(view[field], p[field], n + ': ' + field);
    assert.deepEqual(view.biblicalText.witnesses, [witness]);
    assert.equal(view.title, 'CMS title');
  }
});
