const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const dossierPath = path.join(process.cwd(), 'src/ui-next/genesisTextualDossiers.ts');
const source = fs.readFileSync(dossierPath, 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleShim = { exports: {} };
new Function('module', 'exports', compiled)(moduleShim, moduleShim.exports);
const { genesisOneTextualDossiers: dossiers, genesisTextualDossiersByChapter: chapters } = moduleShim.exports;

assert.deepEqual(dossiers.map((item) => [item.startVerse, item.endVerse]), [[1, 3], [14, 18], [26, 28]]);
assert.equal(new Set(dossiers.map((item) => item.id)).size, 3);
for (const dossier of dossiers) {
  assert.ok(dossier.question.length > 80);
  assert.ok(dossier.witnessComparison.length > 250);
  assert.ok(dossier.interpretation.length > 250);
  assert.ok(dossier.methodologicalNote.length > 150);
  assert.ok(dossier.bibliography.length >= 3);
}

assert.match(dossiers[0].witnessComparison, /MT.*LXX.*Vulgata/s);
assert.match(dossiers[0].methodologicalNote, /non sono varianti manoscritte/i);
assert.match(dossiers[1].methodologicalNote, /non prova dipendenza letteraria/i);
assert.match(dossiers[2].reception, /non deve essere retroproiettata/i);

assert.deepEqual(Object.keys(chapters), ['1', '2', '3']);
assert.deepEqual(chapters[2].map((item) => [item.startVerse, item.endVerse]), [[1, 3], [4, 7], [18, 24]]);
assert.deepEqual(chapters[3].map((item) => [item.startVerse, item.endVerse]), [[1, 7], [14, 15], [16, 19], [22, 24]]);
assert.match(chapters[2][0].witnessComparison, /MT.*Vulgata.*LXX/s);
assert.match(chapters[2][0].methodologicalNote, /diversa Vorlage.*chiarificazione/s);
assert.match(chapters[2][1].interpretation, /non sacerdotale/i);
assert.match(chapters[2][2].methodologicalNote, /né giustifica/i);
assert.match(chapters[3][0].methodologicalNote, /non lo chiama Satana|non alla caratterizzazione/s);
assert.match(chapters[3][1].witnessComparison, /MT.*LXX.*Vulgata/s);
assert.match(chapters[3][1].methodologicalNote, /protovangelo/i);
assert.match(chapters[3][2].methodologicalNote, /subordinazione femminile/i);
assert.match(chapters[3][3].reception, /Ap 22/);

console.log('Genesis textual dossier regression checks passed.');
