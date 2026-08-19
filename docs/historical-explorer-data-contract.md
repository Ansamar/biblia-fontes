# Historical Explorer — contratto dati Sanity / Next

## Obiettivo

Historical Explorer riceve dal CMS dati editoriali strutturati senza incorporare nel componente conoscenza specifica di Genesi o di un particolare periodo storico.

Il motore Next tratta come configurazione del dataset: entità storiche, relazioni, cronologia, spazio, scenari, anni rapidi, geometrie territoriali, stato epistemico, riferimenti biblici e provenance.

## 1. Dataset storico

Documento Sanity: `historicalExplorerDataset`.

Campi:

- `id` stabile;
- `title`;
- `subtitle`;
- `book` → riferimento a `libro`;
- `defaultRange.start` / `defaultRange.end`;
- `quickYears[]`;
- `scenarios[]`;
- `entities[]` → riferimenti a `historicalEntity`;
- `areas[]` → riferimenti a `historicalArea`.

Il dataset non contiene assunzioni implicite su Assiria, Babilonia, Persia o qualunque libro specifico.

## 2. Entità storica

Documento Sanity: `historicalEntity`.

Campi principali:

- `id` stabile;
- `type`: `event | people | empire | city | region | person | text | redaction | witness`;
- `label`;
- `summary`;
- `temporal.start?`, `temporal.end?`, `temporal.precision`;
- `spatial.point` → `geopoint` Sanity;
- `spatial.region?`;
- `epistemicStatus`: `attested | probable | debated | memory | comparandum | narrative | undatable`;
- `biblicalRefs[]`;
- `relations[]`;
- `sources[]`.

Nel frontend l’adapter converte `spatial.point.lat/lng` nel formato cartografico utilizzato dal motore.

### Regola metodologica

`epistemicStatus` valuta l’entità o l’affermazione storica. Non misura la qualità della fonte e non viene derivato automaticamente dal tipo di provenance.

## 3. Relazione storica

Oggetto Sanity: `historicalRelation`.

- `target` → reference a `historicalEntity`;
- `kind`: `context | interaction | memory | composition | transmission | biblical-reference`;
- `label`.

Il GROQ risolve `target->{id}`: il frontend usa quindi l’`id` editoriale stabile dell’entità, non l’`_id` tecnico Sanity.

## 4. Provenance / fonte

Oggetto Sanity: `historicalSource`.

- `label`;
- `kind`: `primary | secondary | dataset | bibliography | editorial`;
- `citation?`;
- `locator?`;
- `url?`;
- `note?`.

Semantica:

- `primary`: iscrizione, cronaca, documento o altra fonte primaria;
- `secondary`: studio storico, archeologico o filologico;
- `dataset`: corpus o dataset strutturato esterno;
- `bibliography`: insieme bibliografico ancora da risolvere puntualmente;
- `editorial`: elaborazione prodotta da Biblia Fontes.

## 5. Geometria storica

Documento Sanity: `historicalArea`.

- `id` stabile;
- `entity` → reference all’entità rappresentata;
- `label`;
- `temporal.start` / `temporal.end`;
- `confidence`: `illustrative | approximate | reconstructed`;
- `note` metodologica obbligatoria;
- `sources[]` con provenance specifica della geometria;
- `geometry.type = Polygon`;
- `geometry.rings[].points[]` → array di `geopoint`.

Sanity non salva il poligono come array numerico tridimensionale. L’adapter Next converte gli anelli di geopoint in GeoJSON `Polygon` e chiude automaticamente ogni ring se necessario.

### Regola metodologica

La provenance della geometria è distinta dalla provenance dell’entità. Un impero può essere `attested` mentre il suo poligono è soltanto `illustrative`.

## 6. Scenario storico

Oggetto Sanity: `historicalScenario`.

- `id`;
- `start`;
- `end`;
- `title`;
- `summary`.

È una cornice editoriale di orientamento e non sostituisce le fonti delle singole entità.

## 7. Riferimenti biblici strutturati

Oggetto Sanity: `historicalBiblicalReference`.

- `display` — forma mostrata all’utente;
- `bookSlug` — slug canonico Biblia Fontes;
- `chapterStart?`;
- `chapterEnd?`;
- `verseStart?`;
- `verseEnd?`.

Genesi è già migrato internamente a questo modello. Il frontend continua temporaneamente a leggere anche stringhe legacy, ma la diagnostica le segnala come incomplete per la migrazione CMS.

## 8. Diagnostica

`diagnoseHistoricalDataset()` controlla:

- entità senza fonti;
- fonti non classificate;
- relazioni rotte;
- target cartografici mancanti;
- aree senza provenance;
- intervalli temporali invertiti;
- riferimenti biblici legacy;
- riferimenti biblici strutturati non validi.

Il pannello “Trasparenza del dataset” rende visibile la completezza della provenance e la quota di riferimenti biblici già strutturati. Non è una percentuale di verità storica.

## 9. Contratto eseguibile

Nel frontend:

- `src/historical-explorer/sanityQuery.ts` contiene il GROQ canonico;
- `src/historical-explorer/sanityAdapter.ts` converte il documento Sanity nel contratto `HistoricalExplorerDataset`;
- mappa, Inspector, Timeline e Study Context continuano a consumare lo stesso modello indipendentemente dalla sorgente.

Nel repository Studio, branch `feat/historical-explorer-sanity`:

- `schemas/historicalExplorer.ts` definisce gli schema;
- `sanity.config.ts` registra gli schema e un Structure Tool dedicato;
- `sanity.config.legacy.ts` conserva integralmente la configurazione precedente;
- `scripts/historical-explorer/seed-genesis.mjs` prepara il dataset Genesi con dry-run e commit esplicito.

## 10. Migrazione di Genesi

Sequenza prevista:

1. validare il branch Studio;
2. eseguire il seed in dry-run;
3. verificare conteggi e riferimenti;
4. eseguire il seed con `--commit` solo dopo la validazione;
5. eseguire l’audit del dataset Sanity;
6. sostituire in Next `genesisDemoData.ts` con `historicalExplorerDatasetQuery + historicalExplorerDatasetFromSanity`;
7. mantenere il fallback TypeScript durante la prima validazione comparativa;
8. rimuovere il fallback solo dopo equivalenza funzionale verificata.

Questa sequenza permette di cambiare la sorgente dei dati senza riscrivere l’esperienza Historical Explorer.
