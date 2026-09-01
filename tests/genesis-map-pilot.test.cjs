const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('the rebuild history surface has one map filter system and an accessible entity focus control', () => {
  const source = read('src/ui-next/HistorySurface.tsx');
  assert.match(source, /Entità nella scena/);
  assert.match(source, /La selezione apre la scheda e porta la carta sull’entità/);
  assert.match(source, /contextTitle=/);
  assert.match(source, /contextSummary=/);
  assert.doesNotMatch(source, /const layerLabels/);
  assert.doesNotMatch(source, /toggleLayer/);
});

test('the map guide explains every epistemic status separately', () => {
  const source = read('src/components/historical-map/HistoricalMapV2.tsx');
  for (const status of ['attested', 'probable', 'debated', 'memory', 'comparandum', 'narrative', 'undatable']) {
    assert.match(source, new RegExp(`status: '${status}'`), status);
  }
  assert.match(source, /Lo statuto non giudica l’importanza teologica del testo/);
  assert.match(source, /non una frontiera certa/);
  assert.match(source, /aria-expanded=\{guideOpen\}/);
});

test('map selection connects provenance and biblical text without conflating evidence', () => {
  const source = read('src/ui-next/HistorySurface.tsx');
  assert.match(source, /Dal dato storico al testo/);
  assert.match(source, /senza confondere il collegamento testuale con una prova storica/);
  assert.match(source, /Fonti e provenienza/);
  assert.match(source, /HistoricalProvenance sources=\{selected\.sources\}/);
});
