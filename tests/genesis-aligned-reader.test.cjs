const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const sourcePath = path.join(process.cwd(), 'src/ui-next/alignedWitnesses.ts');
const source = fs.readFileSync(sourcePath, 'utf8').replace(/^import type .*;$/m, '');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleShim = { exports: {} };
new Function('module', 'exports', compiled)(moduleShim, moduleShim.exports);
const { alignWitnessVerses } = moduleShim.exports;

const witness = (verses) => ({ numero: 1, versetti: verses.map(([numero, testo, marcatoreAlfabetico]) => ({ numero, testo, marcatoreAlfabetico })) });

const direct = alignWitnessVerses([
  witness([[1, 'uno'], [2, 'due'], [3, 'tre']]),
  witness([[1, 'one'], [2, 'two'], [3, 'three']]),
]);
assert.deepEqual(direct.map((row) => row.label), ['1', '2', '3']);
assert.equal(direct[1].verses[0].testo, 'due');
assert.equal(direct[1].verses[1].testo, 'two');

const lacuna = alignWitnessVerses([
  witness([[1, 'uno'], [2, 'due'], [3, 'tre']]),
  witness([[1, 'one'], [3, 'three']]),
]);
assert.equal(lacuna[1].verses[1], null);
assert.equal(lacuna[2].verses[1].testo, 'three');

const marked = alignWitnessVerses([
  witness([[2, 'b', 'b'], [2, 'a', 'a'], [3, 'tre']]),
]);
assert.deepEqual(marked.map((row) => row.label), ['2a', '2b', '3']);

console.log('Genesis aligned reader regression checks passed.');
