const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

function load(filename) {
  const file = path.resolve(root, filename);
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
    fileName: file,
  }).outputText;
  const module = { exports: {} };
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`, { filename: file })(require, module, module.exports);
  return module.exports;
}

test('workspace links remain inside rebuild and preserve chapter context', () => {
  const { bookHref, chapterHref, historyHref, perspectiveHref } = load('src/ui-next/workspace.ts');
  const context = { bookSlug: 'genesi', chapter: 3, year: -586, entityId: 'babylon' };

  assert.equal(bookHref('genesi'), '/rebuild/bibbia/genesi');
  assert.equal(chapterHref('genesi', 3), '/rebuild/bibbia/genesi/3');
  assert.equal(perspectiveHref(context, 'text'), '/rebuild/bibbia/genesi/3');
  assert.equal(perspectiveHref(context, 'study'), '/rebuild/bibbia/genesi/3?view=study');
  assert.equal(perspectiveHref(context, 'sources'), '/rebuild/bibbia/genesi/3?view=sources');
  assert.equal(historyHref(context), '/rebuild/historical-explorer/genesi?chapter=3&year=-586&entity=babylon');
});

test('workspace helpers can still target the legacy shell explicitly', () => {
  const { bookHref, historyHref } = load('src/ui-next/workspace.ts');
  assert.equal(bookHref('genesi', ''), '/bibbia/genesi');
  assert.equal(historyHref({ bookSlug: 'genesi', chapter: 1 }, ''), '/historical-explorer/genesi?chapter=1');
});

test('chapter history narrows to direct entities and their relations', () => {
  const { historicalDatasetForChapter } = load('src/historical-explorer/chapterContext.ts');
  const dataset = {
    subtitle: 'Rete generale.',
    entities: [
      { id: 'direct', biblicalRefs: [{ bookSlug: 'genesi', chapterStart: 1 }], relations: [{ targetId: 'related' }] },
      { id: 'related', biblicalRefs: [], relations: [] },
      { id: 'unrelated', biblicalRefs: [{ bookSlug: 'genesi', chapterStart: 2 }], relations: [] },
    ],
    areas: [{ entityId: 'direct' }, { entityId: 'unrelated' }],
  };

  const result = historicalDatasetForChapter(dataset, 'genesi', 1);
  assert.equal(result.contextualized, true);
  assert.deepEqual(result.primaryEntityIds, ['direct']);
  assert.deepEqual(result.dataset.entities.map((entity) => entity.id), ['direct', 'related']);
  assert.deepEqual(result.dataset.areas.map((area) => area.entityId), ['direct']);
});

test('missing chapter relations are reported without hiding the book dataset', () => {
  const { historicalDatasetForChapter } = load('src/historical-explorer/chapterContext.ts');
  const dataset = { subtitle: 'Rete generale.', entities: [{ id: 'only', biblicalRefs: [] }] };
  const result = historicalDatasetForChapter(dataset, 'genesi', 9);
  assert.equal(result.contextualized, false);
  assert.equal(result.dataset, dataset);
  assert.deepEqual(result.primaryEntityIds, []);
});
