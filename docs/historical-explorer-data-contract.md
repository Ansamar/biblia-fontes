# Historical Explorer — contratto dati per Sanity / Next

## Obiettivo

Historical Explorer deve ricevere dati editoriali dal CMS senza incorporare nel componente conoscenza specifica di Genesi o di un particolare periodo storico.

Il motore Next tratta come configurazione del dataset:

- entità storiche;
- relazioni;
- cronologia;
- coordinate puntuali;
- scenari narrativi del periodo;
- anni di accesso rapido;
- geometrie territoriali;
- stato epistemico;
- riferimenti biblici;
- fonti e provenance.

Il repository Next attuale contiene il client Sanity ma non gli schema dello Studio. Questo documento definisce quindi il contratto da implementare nello Studio, senza introdurre schema fittizi nel frontend.

## 1. Dataset storico

Documento concettuale: `historicalExplorerDataset`.

Campi minimi:

- `id` / slug stabile;
- `title`;
- `subtitle`;
- `book` → riferimento al documento `libro`;
- `defaultRange.start`;
- `defaultRange.end`;
- `quickYears[]`;
- `entities[]` → riferimenti a entità storiche;
- `scenarios[]`;
- `areas[]` → riferimenti o oggetti geografici.

Il dataset non deve contenere assunzioni implicite su Assiria, Babilonia, Persia, Genesi o qualunque altro libro.

## 2. Entità storica

Documento concettuale: `historicalEntity`.

Campi:

- `id` stabile;
- `type`: `event | people | empire | city | region | person | text | redaction | witness`;
- `label`;
- `summary`;
- `temporal.start?`;
- `temporal.end?`;
- `temporal.precision`: `year | range | century | unknown`;
- `spatial.lat?`;
- `spatial.lng?`;
- `spatial.region?`;
- `epistemicStatus`: `attested | probable | debated | memory | comparandum | narrative | undatable`;
- `biblicalRefs[]`;
- `relations[]`;
- `sources[]`.

### Regola metodologica

`epistemicStatus` descrive la valutazione dell'entità o dell'affermazione storica. Non descrive la qualità della fonte e non deve essere derivato automaticamente dal tipo di fonte.

## 3. Relazione storica

Oggetto concettuale: `historicalRelation`.

Campi:

- `target` → riferimento a `historicalEntity`;
- `kind`: `context | interaction | memory | composition | transmission | biblical-reference`;
- `label`.

Ogni target deve esistere. Il frontend dispone di diagnostica per rilevare relazioni rotte.

## 4. Provenance / fonte

Oggetto concettuale: `historicalSource`.

Campi:

- `label`;
- `kind?`: `primary | secondary | dataset | bibliography | editorial`;
- `citation?`;
- `locator?`;
- `url?`;
- `note?`.

### Semantica dei tipi

- `primary`: iscrizione, cronaca, documento, testo o altra fonte primaria;
- `secondary`: studio storico, archeologico, filologico o altra letteratura secondaria;
- `dataset`: dataset esterno o corpus strutturato usato come origine dei dati;
- `bibliography`: voce tematica o insieme bibliografico non ancora risolto a una singola fonte;
- `editorial`: elaborazione prodotta da Biblia Fontes, per esempio una geometria didattica di prototipo.

Una fonte non classificata può essere salvata durante la migrazione, ma il frontend deve segnalarla come `da classificare`.

## 5. Geometria storica

Oggetto/documento concettuale: `historicalArea`.

Campi:

- `id` stabile;
- `entity` → riferimento all'entità rappresentata;
- `label`;
- `temporal.start`;
- `temporal.end`;
- `confidence`: `illustrative | approximate | reconstructed`;
- `note` metodologica obbligatoria;
- `sources[]` con provenance della geometria;
- `geometry` GeoJSON Polygon.

### Regola metodologica

La provenance della geometria è distinta dalla provenance dell'entità.

Un impero può essere storicamente attestato mentre il poligono mostrato sulla mappa è soltanto illustrativo. L'interfaccia deve poter mostrare entrambe le informazioni contemporaneamente.

## 6. Scenario storico

Oggetto concettuale: `historicalScenario`.

Campi:

- `id`;
- `start`;
- `end`;
- `title`;
- `summary`.

Uno scenario è una cornice editoriale per orientare l'utente nel periodo selezionato. Non sostituisce le fonti delle singole entità.

## 7. Riferimenti biblici

Nel prototipo i riferimenti sono stringhe (`Gen 6–9`, `2Re 25`, `Esd 1`, `Genesi`) risolte dal frontend.

Per la fase CMS si raccomanda di mantenere:

- `display` — forma editoriale mostrata all'utente;
- `book` — riferimento o slug canonico;
- `chapterStart?`;
- `chapterEnd?`;
- `verseStart?`;
- `verseEnd?`.

Il frontend può continuare a supportare le stringhe durante la migrazione, ma il modello strutturato elimina ambiguità e rende i deep-link indipendenti dalla forma tipografica.

## 8. Diagnostica obbligatoria prima della pubblicazione

`diagnoseHistoricalDataset()` nel frontend controlla attualmente:

- entità senza fonti;
- fonti non classificate;
- relazioni verso entità inesistenti;
- aree riferite a entità inesistenti;
- aree senza provenance;
- intervalli temporali invertiti per entità e geometrie.

In Sanity gli stessi controlli dovrebbero diventare validation rules editoriali, in modo che gli errori siano intercettati prima della pubblicazione.

## 9. Strategia di migrazione

1. mantenere Genesi come dataset di riferimento;
2. creare gli schema nello Studio reale;
3. importare le entità di Genesi preservando gli ID stabili;
4. importare provenance e geometrie separatamente;
5. eseguire la diagnostica e correggere errori/blocchi;
6. sostituire progressivamente `genesisDemoData.ts` con una query Sanity;
7. mantenere il medesimo `HistoricalExplorerDataset` come contratto verso i componenti UI;
8. solo dopo la migrazione di Genesi, creare dataset per altri libri.

Questa sequenza consente di cambiare la sorgente dei dati senza riscrivere mappa, Inspector, Timeline, deep-link o Study Context.
