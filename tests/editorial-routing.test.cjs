const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
// Transpile the actual TS modules; isolate only Sanity to keep tests offline.
function loader(response) {
  const cache = new Map();
  const calls = [];
  function load(filename) {
    const file = path.resolve(root, filename);
    if (file === path.join(root, 'src/sanity/client.ts')) {
      return { client: { fetch: async (...args) => { calls.push(args); return response; } } };
    }
    if (cache.has(file)) return cache.get(file).exports;
    const source = fs.readFileSync(file, 'utf8');
    const compiled = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: file,
    }).outputText;
    const module = { exports: {} };
    cache.set(file, module);
    const localRequire = (name) => {
      assert.ok(name.startsWith('.'), `Unexpected runtime dependency: ${name}`);
      return load(path.resolve(path.dirname(file), name + '.ts'));
    };
    vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`, { filename: file })(localRequire, module, module.exports);
    return module.exports;
  }
  return { load, calls };
}

test('all canonical books resolve an editorial profile and enrich chapter one', () => {
  const { load } = loader();
  const { catholicCanonSlugs } = load('src/lib/canon.ts');
  const { enrichEditorialChapter, hasCanonicalEditorialProfile } = load('src/data/editorialRegistry.ts');
  assert.equal(catholicCanonSlugs.length, 73);
  for (const slug of catholicCanonSlugs) {
    assert.ok(hasCanonicalEditorialProfile(slug), slug);
    const chapter = enrichEditorialChapter(slug, {}, 1);
    for (const field of ['sintesi', 'struttura', 'contestoStorico', 'tradizione', 'analisiStoricoCritica', 'testoCritico']) {
      assert.ok(typeof chapter[field] === 'string' && chapter[field].trim(), `${slug}: ${field}`);
    }
    assert.ok(chapter.bibliografia.length, slug);
  }
});

test('both Corinthian spellings enrich every chapter without mutating input', () => {
  const { load } = loader();
  const { enrichEditorialChapter, hasCanonicalEditorialProfile } = load('src/data/editorialRegistry.ts');
  for (const [book, chapters] of [[1, 16], [2, 13]]) {
    for (let n = 1; n <= chapters; n++) {
      const raw = Object.freeze({ titolo: 'CMS title', sintesi: 'CMS summary', custom: 42 });
      const a = enrichEditorialChapter(`${book}-corinti`, raw, n);
      const b = enrichEditorialChapter(`${book}-corinzi`, raw, n);
      assert.deepEqual(a, b);
      assert.notEqual(a.sintesi, raw.sintesi);
      assert.equal(a.titolo, raw.titolo);
      assert.equal(a.custom, 42);
      assert.ok(hasCanonicalEditorialProfile(`${book}-corinti`));
      assert.ok(hasCanonicalEditorialProfile(`${book}-corinzi`));
    }
  }
});

test('ordering and reference lookup accept both spellings without rewriting IDs', () => {
  const { load } = loader();
  const { canonicalBookOrder, canonicalBookCategory } = load('src/lib/canon.ts');
  const { bookAbbreviation, bookIdFromSlug, matchReference, referenceAliases } = load('src/lib/bibleRouting.ts');
  const before = JSON.stringify(referenceAliases);
  for (const book of [1, 2]) {
    for (const spelling of ['corinti', 'corinzi']) {
      const slug = `${book}-${spelling}`;
      assert.equal(canonicalBookOrder(slug), 52 + book);
      assert.equal(canonicalBookCategory(slug), 'Lettere Paoline');
      assert.equal(bookAbbreviation(slug), `${book}Cor`);
      assert.equal(bookIdFromSlug(slug), `libro-${slug}`);
      for (const input of [`${book} Cor 3`, `${book} Corinti 3`, `${book} Corinzi 3`]) {
        assert.equal(matchReference(input, [{ id: `libro-${slug}`, titolo: 'Lettera', capitoli: 13 }]).slug, slug);
      }
    }
  }
  assert.equal(JSON.stringify(referenceAliases), before);
});

test('rebuild exposes the same editorial fields and preserves CMS metadata and witnesses', async () => {
  for (const slug of ['deuteronomio', '1-corinti', '1-corinzi', '2-corinti', '2-corinzi', 'apocalisse']) {
    const raw = { titolo: 'CMS title', sintesi: 'CMS summary', attribuzioniFonti: [{ sigla: 'test' }] };
    const witness = { lingua: 'it', tradizione: 'cei', versetti: [{ numero: '1', testo: 'Fixture' }] };
    const response = { libro: { titolo: 'Book', capitoli: 40 }, capitolo: raw, capitoli: [{ numero: 1 }], testiBiblici: [witness] };
    const before = JSON.stringify(response);
    const { load, calls } = loader(response);
    const expected = load('src/data/editorialRegistry.ts').enrichEditorialChapter(slug, raw, 1);
    const view = await load('src/data-access/chapter.ts').fetchChapterView(slug, 1);
    for (const [field, editorial] of Object.entries({ summary: 'sintesi', structure: 'struttura', context: 'contestoStorico', formation: 'tradizione', critical: 'analisiStoricoCritica', textual: 'testoCritico', bibliography: 'bibliografia' })) {
      assert.deepEqual(view[field], expected[editorial], `${slug}: ${field}`);
    }
    assert.equal(view.title, raw.titolo);
    assert.deepEqual(view.sourceLayers, raw.attribuzioniFonti);
    assert.deepEqual(view.biblicalText.witnesses, [witness]);
    assert.equal(JSON.stringify(response), before);
    assert.deepEqual(calls[0][1], { bookId: `libro-${slug}`, numero: 1 });
  }
});

test('missing CMS records still return null; unknown editorial slugs are unchanged', async () => {
  for (const response of [null, { libro: {} }, { capitolo: {} }]) {
    const { load } = loader(response);
    assert.equal(await load('src/data-access/chapter.ts').fetchChapterView('deuteronomio', 1), null);
  }
  const { load } = loader();
  const registry = load('src/data/editorialRegistry.ts');
  const raw = { sintesi: 'Existing' };
  assert.equal(registry.enrichEditorialChapter('unknown', raw, 1), raw);
  assert.equal(registry.hasCanonicalEditorialProfile('unknown'), false);
  assert.equal(registry.enrichEditorialChapter('1-corinti', raw, 17), raw);
});
