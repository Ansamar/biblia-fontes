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
const profiles = runtime.load('src/data/philippiansEditorialSpecific.ts').philippiansEditorialSpecific;
const words = text => text.trim().split(/\s+/).length;
const fields = {
  summary: 'sintesi', structure: 'struttura', context: 'contestoStorico',
  formation: 'tradizione', critical: 'analisiStoricoCritica',
  textual: 'testoCritico', bibliography: 'bibliografia',
};

test('Philippians contains exactly four complete, syntactically valid profiles', () => {
  assert.deepEqual(Object.keys(profiles), Array.from({ length: 4 }, (_, i) => String(i + 1)));
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
    assert.equal(new Set(Object.values(profiles).map(p => p[field])).size, 4, field);
  }
});

test('structures cover all CEI verses and retain argumentative boundaries', () => {
  const ends=[30,30,21,23];
  for(const[key,p]of Object.entries(profiles)){
    const n=Number(key);
    const spans=[...p.structure.matchAll(new RegExp('\\b'+n+',(\\d+)(?:–(\\d+))?:','g'))]
      .map(m=>[Number(m[1]),Number(m[2]||m[1])]);
    assert.equal(spans[0][0],1,key);
    assert.equal(spans.at(-1)[1],ends[n-1],key);
    for(let i=1;i<spans.length;i++)assert.equal(spans[i][0],spans[i-1][1]+1,key);
  }
  assert.match(profiles[3].structure,/4,1/);
  assert.match(profiles[4].structure,/4,1:.*3,17–21/);
});

test('prison, hymn, Jewish identity and financial support are explained without conflation', () => {
  assert.match(profiles[1].context,/pretorio.*non localizza da solo/);
  assert.match(profiles[1].critical,/Non è un’esortazione al suicidio/);
  assert.match(profiles[1].textual,/forma breve, presente anche nella CEI 2008/);
  assert.match(profiles[2].formation,/non possediamo una copia indipendente/);
  assert.match(profiles[2].textual,/harpagmos.*lessicale, non una variante manoscritta/);
  assert.match(profiles[2].textual,/numerazione.*non la presenza del contenuto/);
  assert.match(profiles[3].formation,/ipotesi.*più lettere/);
  assert.match(profiles[3].textual,/CEI 2008.*NET.*non una variante manoscritta/);
  assert.match(profiles[4].critical,/non promette riuscita illimitata/);
  assert.match(profiles[4].critical,/non è un contratto di prosperità/);
  assert.match(profiles[4].textual,/Sizigo.*interpretazione/);
});

test('consulted sources are chapter-specific and reference works disclose their status', () => {
  for(const[n,p]of Object.entries(profiles)){
    const refs=p.bibliography.filter(x=>x.startsWith('Bibliografia di riferimento'));
    assert.equal(refs.length,5);
    assert.ok(refs.every(x=>x.includes('non consultata integralmente')));
    const sources=p.bibliography.filter(x=>x.startsWith('Fonte consultata:'));
    assert.ok(sources.some(x=>x.includes('search=Philippians+'+n+'&version=NET')));
    assert.ok(sources.some(x=>x.includes('/CEI2008/nt/Fil/'+n+'/')));
    for(const item of sources)assert.equal(new URL(item.match(/https:\/\/\S+/)[0]).protocol,'https:');
  }
  assert.notEqual(profiles[1].bibliography,profiles[2].bibliography);
  assert.ok(profiles[1].bibliography.some(x=>x.includes('introduzione a Filippesi')));
});

test('all four profiles reach the primary editorial registry without overwriting CMS metadata', () => {
  const enrich = runtime.load('src/data/editorialRegistry.ts').enrichEditorialChapter;
  for (const slug of ['filippesi']) for (const [n, p] of Object.entries(profiles)) {
    const original = Object.freeze({ titolo: 'CMS title', sintesi: 'old label', attribuzioniFonti: ['preserve'] });
    const actual = enrich(slug, original, Number(n));
    for (const [field, mapped] of Object.entries(fields)) assert.deepEqual(actual[mapped], p[field], n + ': ' + field);
    assert.equal(actual.titolo, original.titolo);
    assert.deepEqual(actual.attribuzioniFonti, original.attribuzioniFonti);
    assert.equal(original.sintesi, 'old label');
  }
});

test('rebuild receives all four revised profiles while retaining text witnesses', async () => {
  const fetchView = runtime.load('src/data-access/chapter.ts').fetchChapterView;
  for (const slug of ['filippesi']) for (const [n, p] of Object.entries(profiles)) {
    const witness = { lingua: 'it', tradizione: 'cei', versetti: [{ numero: '1', testo: 'Fixture' }] };
    runtime.setResponse({
      libro: { titolo: 'Filippesi', capitoli: 4 },
      capitolo: { titolo: 'CMS title', sintesi: 'old label' },
      capitoli: [{ numero: Number(n) }], testiBiblici: [witness],
    });
    const view = await fetchView(slug, Number(n));
    for (const field of Object.keys(fields)) assert.deepEqual(view[field], p[field], n + ': ' + field);
    assert.deepEqual(view.biblicalText.witnesses, [witness]);
    assert.equal(view.title, 'CMS title');
  }
});
