const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const dossierPath = path.join(process.cwd(), 'src/ui-next/genesisTextualDossiers.ts');
const source = fs.readFileSync(dossierPath, 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleShim = { exports: {} };
new Function('module', 'exports', compiled)(moduleShim, moduleShim.exports);
const { genesisOneTextualDossiers: dossiers } = moduleShim.exports;

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

console.log('Genesis textual dossier regression checks passed.');
