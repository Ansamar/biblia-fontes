# Biblia Fontes 2.0 — UX/IA audit e mappa di migrazione

## Obiettivo
Trasformare Biblia Fontes da insieme di pagine e strumenti separati in un unico ambiente di studio coerente. Testo, studio critico, tempo, storia, spazio, fonti e trasmissione diventano prospettive coordinate sullo stesso contesto.

> L'utente deve poter cambiare prospettiva senza perdere l'oggetto che sta studiando.

## Diagnosi
L'app contiene oggi due architetture sovrapposte:

1. modello precedente: `/strumenti`, `/strumenti/cronologia`, `/strumenti/fonti`, `/strumenti/confronto`, `/strumenti/ricerca`;
2. modello emergente: libro/capitolo + Reader + Timeline testuale + Historical Explorer.

Il secondo deve diventare dominante. Il primo va progressivamente assorbito, rediretto o eliminato.

## Stati di migrazione
- **KEEP**: resta sostanzialmente com'è.
- **REFACTOR**: resta ma cambia responsabilità o UX.
- **ABSORB**: la funzione confluisce altrove.
- **REDIRECT**: route mantenuta temporaneamente per compatibilità.
- **DELETE**: rimozione finale.
- **REVIEW**: verificare usi residui prima della rimozione.

## Route audit

| Route | Stato | Destinazione BF 2.0 |
|---|---|---|
| `/` | REFACTOR | Home, corpus e ricerca globale |
| `/bibbia/[libro]` | KEEP + REFACTOR | Book Study Context |
| `/bibbia/genesi` | ABSORB | template universale del libro |
| `/bibbia/[libro]/[capitolo]` | KEEP + REFACTOR | Chapter Study Context |
| `/historical-explorer/genesi` | REFACTOR | Historical Explorer globale con Study Context |
| `/strumenti` | DELETE | nessun equivalente |
| `/strumenti/cronologia` | ABSORB → REDIRECT → DELETE | Timeline contestuale + Historical Explorer |
| `/strumenti/fonti` | ABSORB → REDIRECT | Fonti contestuali + Inspector + eventuale `/fonti` |
| `/strumenti/confronto` | ABSORB → REDIRECT | Reader / modalità Confronto |
| `/strumenti/ricerca` | REFACTOR → MOVE | ricerca globale `/cerca` |

## Component audit

### Core da consolidare
- `AppShell.tsx` — **REFACTOR**: nuova IA globale; eliminare dalla navbar `Strumenti`, `Cronologia`, `Fonti & modelli` nella forma attuale.
- `StudyHome.tsx` — **REFACTOR**: mantenere corpus e ricerca; rimuovere le card legacy `Cronologia`, `Fonti & modelli`, `Confronta`; introdurre Historical Explorer e percorsi per modalità di studio.
- `BiblicalTextReader.tsx` — **KEEP**: nucleo di lettura; ospiterà single / compare / synopsis.
- `UniversalChapterStudy.tsx` — **KEEP + REFACTOR**: candidato al Chapter Workspace universale. Sostituire la sezione generica `Cronologia` con Timeline contestuale e ponte `Apri nella storia`.
- `BookTimeline.tsx` — **KEEP + REFACTOR**: responsabilità unica: **Biblia Fontes Timeline racconta il testo nel tempo**.
- `HistoricalExplorerShell.tsx` — **KEEP + REFACTOR**: workspace storico globale.
- `HistoricalExplorerMap.tsx` — **KEEP**.
- `HistoricalExplorerOverlay.tsx` — **REFACTOR**: da bridge specifico di Genesi a bridge universale Timeline/Studio → Historical Explorer.
- `DepthSelector.tsx` — **KEEP**: Essenziale / Studio / Critica resta trasversale.
- `ReadingPreferences.tsx` — **KEEP**.
- `TextWitnessCompare.tsx` — **ABSORB** nel Reader.
- `SourcesModelsMap.tsx` — **ABSORB / REFACTOR** in Inspector fonte/modello + viste contestuali + eventuale indice `/fonti`.
- `GlobalTimelineExplorer.tsx` — **ABSORB / DELETE**: il modello globale di cronologia non deve convivere con Timeline contestuali e Historical Explorer.

### Componenti da verificare
- `GenesisHistoryPrototype.tsx` — REVIEW
- `ChapterStudy.tsx` — REVIEW
- `FocusMode.tsx` — REVIEW
- `HomePage.tsx` — REVIEW

## Architettura target

### Navigazione globale
- **Bibbia**
- **Historical Explorer**
- **Fonti** (solo se utile come indice generale)
- **Cerca**

Timeline, confronto testuale, apparato e bibliografia non sono destinazioni globali: sono modalità contestuali.

### Study Context

```ts
export type StudyContext = {
  book?: string;
  chapter?: number;
  passage?: string;
  person?: string;
  place?: string;
  historicalEntity?: string;
  source?: string;
  witness?: string;
  timeRange?: [number, number];
  activeMode?: 'text' | 'study' | 'timeline' | 'history';
};
```

Il contesto deve sopravvivere al passaggio tra modalità.

### Quattro modalità cognitive

**Testo**
- Reader
- testimoni
- confronto
- sinossi
- note testuali

**Studio**
- struttura
- sintesi
- fonti
- redazione
- critica testuale
- bibliografia

**Timeline**
- il testo nel tempo
- mondo narrato
- sequenza interna
- formazione
- trasmissione
- ponte verso la storia

**Storia**
- Historical Explorer
- storia attestata, ricostruita o discussa intorno al testo
- mappa
- tempo
- popoli/poteri
- eventi
- culture
- ponte verso i testi

## Gerarchia target

### Libro
```text
LIBRO
├── Panoramica
├── Testo / Capitoli
├── Studio
├── Timeline
└── Storia → Historical Explorer
```

### Capitolo
```text
CAPITOLO / PASSO
├── Testo
├── Studio
├── Timeline
└── Storia
```

La profondità `Essenziale / Studio / Critica` resta ortogonale alle modalità.

## Vecchio → nuovo

| Vecchio | Nuovo |
|---|---|
| Strumenti | eliminato come categoria; funzioni contestuali |
| Cronologia globale | Timeline contestuale + Historical Explorer |
| Cronologia nel capitolo | Timeline del testo + `Apri nella storia` |
| Mappa Fonti & modelli | Inspector + Studio + indice Fonti |
| Confronto testuale separato | Reader / modalità confronto |
| Ricerca sotto Strumenti | ricerca globale |
| Genesi prototipo separato | template universale libro + Study Context |
| Historical Explorer Genesi | Historical Explorer globale contestuale |
| pagine isolate | viste dello stesso oggetto di studio |

## Sequenza di migrazione

### BF2-01 — Surface migration
1. Rifattorizzare `AppShell`.
2. Togliere dalla navbar le voci legacy.
3. Introdurre navigazione globale minima.
4. Rifattorizzare `StudyHome` eliminando i percorsi-card legacy.
5. Tenere le vecchie route raggiungibili solo per compatibilità.
6. Non aggiungere nuovi layer Historical Explorer finché la nuova shell globale non è in uso.

### BF2-02 — Study Context
1. Definire `StudyContext`.
2. Serializzarlo in URL/query params.
3. Bridge universale `Timeline → Historical Explorer`.
4. Bridge `Historical Explorer → Vedi nei testi`.

### BF2-03 — Migrazione Cronologia
1. Inventariare `GlobalTimelineExplorer`.
2. Spostare la parte testuale/compositiva nelle Timeline dei libri.
3. Spostare la parte storica nell'Historical Explorer.
4. Redirect `/strumenti/cronologia`.
5. Eliminare `GlobalTimelineExplorer` quando non resta contenuto esclusivo.

### BF2-04 — Migrazione Fonti
1. Fonte/modello come entità interrogabile.
2. Attribuzioni cliccabili nei capitoli.
3. Inspector fonte.
4. Eventuale `/fonti` come indice, non silo.
5. Redirect `/strumenti/fonti`.

### BF2-05 — Confronto testuale
1. Consolidare single / compare / synopsis nel Reader.
2. Eliminare CTA verso `/strumenti/confronto`.
3. Redirect e successiva rimozione del workspace placeholder.

### BF2-06 — Pulizia finale
- eliminare `app/strumenti/page.tsx`;
- eliminare route obsolete;
- eliminare componenti prototipali orfani;
- unificare pagina Genesi e pagina libro dinamica;
- documentare l'architettura definitiva.

## Regola per ogni nuova feature
Ogni nuova funzione deve rispondere a quattro domande:

1. Quale bisogno dell'utente soddisfa?
2. In quale Study Context compare?
3. Quale componente/route precedente assorbe o sostituisce?
4. Quale collegamento semantico offre verso le altre modalità?

Se non ha una risposta chiara, non va aggiunta come nuova pagina o nuovo silo.
