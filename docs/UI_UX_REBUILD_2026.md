# Biblia Fontes · UI/UX Rebuild 2026

## Decisione

La nuova interfaccia non è un refactoring incrementale della UI esistente. È una ricostruzione della presentazione e dell'esperienza utente sopra il corpus e le logiche dati già validate.

### Si conserva

- dataset Sanity e contenuti editoriali;
- testi biblici e testimoni;
- attribuzioni di fonti, bibliografie e apparati;
- Historical Explorer: dataset, query, adapter, tipi e relazioni;
- routing canonico dei 73 libri;
- logica di normalizzazione/deduplicazione dei testimoni, dopo audit;
- preferenze di lettura accessibili.

### Non è vincolante

- AppShell attuale;
- StudyHome attuale;
- StudyContextNav;
- DepthSelector come paradigma di navigazione;
- card, pannelli e CTA attuali;
- LiteraryArchitectureMap, BookNavigator e BookTimeline;
- gerarchia delle sezioni delle pagine libro/capitolo;
- route legacy `/strumenti/*`;
- linguaggio visuale esistente.

## Obiettivo

Biblia Fontes deve sembrare e funzionare come un ambiente accademico digitale, non come una landing page composta da card.

Principio guida:

> Il contenuto determina la forma. L'interfaccia deve orientare, non spiegare se stessa.

## Architettura informativa

La navigazione globale ha quattro sole destinazioni concettuali:

1. **Bibbia** — corpus, libri, capitoli, testo.
2. **Studio** — fonti, formazione, critica, bibliografia; contestuale al testo.
3. **Storia** — Historical Explorer; ambiente parallelo collegato al testo.
4. **Ricerca** — accesso trasversale a riferimenti, libri, fonti, entità.

`Fonti` non è più una destinazione primaria indipendente se non come indice specialistico; dentro il flusso ordinario vive nello Studio.

## Struttura delle superfici

### Home

Funzione: entrare nel corpus, non raccontare il prodotto.

- identità minima;
- ricerca/riferimento in primo piano;
- canone come principale superficie di navigazione;
- accesso secondario a Historical Explorer e ricerca avanzata;
- nessuna Timeline;
- nessuna sezione promozionale a card.

### Pagina libro

Funzione: orientare nel libro.

1. intestazione bibliografica/editoriale;
2. descrizione breve e metadati essenziali;
3. **indice strutturato del libro**, che integra macro-unità e capitoli senza duplicarle;
4. introduzione critica del libro come testo;
5. accesso contestuale a Historical Explorer.

Non contiene pulsanti “inizia dal capitolo 1”, non contiene Timeline, non duplica la struttura in più visualizzazioni.

### Pagina capitolo

Funzione: leggere e studiare un testo senza cambiare pagina mentale.

Layout desktop:

- colonna centrale dominante: testo/Reader;
- rail sinistra: libro, capitoli, riferimento;
- rail destra contestuale: studio del capitolo;
- studio aperto per sezioni, non per una cascata di card;
- confronto/sinossi come modalità del Reader, non strumenti esterni.

Mobile:

- testo dominante;
- navigazione capitoli in drawer;
- studio in pannello/drawer;
- confronto a scorrimento intenzionale.

### Historical Explorer

Funzione: interrogare la storia intorno al testo.

È un workspace distinto ma usa la stessa shell, tipografia e sistema di stato. Il ritorno al testo conserva contesto e selezione.

## Sistema visuale

### Gerarchia

Tre famiglie tipografiche massime:

- serif editoriale per titoli e testo biblico;
- sans leggibile per UI e prosa di servizio;
- mono solo per riferimenti, sigle, coordinate e metadati.

### Regole

- massimo una superficie “card” dominante per viewport; le card non sono il default;
- bordi usati per struttura, non decorazione;
- niente ombre salvo overlay, menu o elementi realmente sopraelevati;
- larghezza di lettura 66–74ch;
- griglia 12 colonne desktop, 6 tablet, 4 mobile;
- ritmo verticale basato su multipli di 8px;
- una sola tinta accentuale principale;
- densità più alta di una landing page, più bassa di un IDE.

## Data/UI boundary

Le route non devono trasformare direttamente documenti Sanity in markup complesso.

Nuovi livelli:

- `src/data-access/` — query e fetch;
- `src/view-models/` — normalizzazione in modelli stabili per UI;
- `src/ui-next/` — componenti della nuova interfaccia;
- `app/rebuild/` — vertical slice di prova fino alla promozione.

Il corpus resta la source of truth. Nessun contenuto viene copiato o riscritto nella UI.

## Criteri di accettazione

Una superficie non viene promossa alle route principali se:

- richiede spiegazioni per capire dove cliccare;
- mostra la stessa informazione due volte;
- usa card solo per separare paragrafi;
- introduce una nuova tassonomia non presente nei dati;
- perde testimoni o contenuti rispetto alla UI precedente;
- rompe scala font, tastiera, mobile o contrasto;
- confonde racconto, formazione testuale e storia.

## Ordine di costruzione

1. design tokens + nuova shell;
2. pagina libro completa;
3. pagina capitolo + Reader;
4. confronto/sinossi;
5. studio critico del capitolo;
6. home/canone;
7. Historical Explorer nella nuova shell;
8. ricerca;
9. sostituzione route legacy;
10. rimozione componenti e CSS obsoleti.
