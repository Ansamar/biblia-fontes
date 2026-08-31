# Efesini 1–6 — revisione esplicativa

## Perimetro

Sei profili completi, 3394 parole nei sei campi testuali. Base consolidata: `651c550169bcc8354734227e4594b25cc333b20b`. La revisione continua Romani, 1–2 Corinzi e Galati senza modificare i libri conclusi.

Modifica soltanto `src/data/ephesiansEditorialSpecific.ts`, il test dedicato e questa nota. Nessuna modifica a testo biblico, CMS, ID, interfaccia o configurazione di pubblicazione. Le modifiche sospese su Giosuè e gli altri file locali restano escluse.

## Standard

Sintesi di circa cento parole; strutture che coprono tutti i versetti CEI; contesto, formazione, analisi e note testuali specifici per capitolo. Le soglie quantitative dei test sono protezioni contro regressioni, non certificazioni accademiche.

Sono distinti: affermazioni del testo, ipotesi storiche, critica dei manoscritti, scelte di traduzione e applicazioni contemporanee. Le opere della bibliografia preesistente restano riferimenti dichiarati non consultati integralmente, senza pagine o citazioni puntuali inventate.

## Fonti effettivamente consultate

Consultazione: 31 agosto 2026. La revisione sviluppa anche il modulo preesistente. Le note NET e CEI sono consultate come risorse con scelte esegetiche identificabili, non come apparato critico completo o consenso unanime.

| Capitolo | Verifica mirata | Testo e note |
| --- | --- | --- |
| 1 | Destinazione; punteggiatura; origine discussa | [NET 1](https://www.biblegateway.com/passage/?search=Ephesians+1&version=NET), [CEI 1](https://www.bibbiaedu.it/CEI2008/nt/Ef/1/), [introduzione CEI](https://www.bibbiaedu.it/CEI2008/nt/Ef/) |
| 2 | Grazia e opere; Legge; articolo con fede | [NET 2](https://www.biblegateway.com/passage/?search=Ephesians+2&version=NET), [CEI 2](https://www.bibbiaedu.it/CEI2008/nt/Ef/2/) |
| 3 | Ripresa della preghiera; genitivo in 3,12; espansione in 3,14 | [NET 3](https://www.biblegateway.com/passage/?search=Ephesians+3&version=NET), [CEI 3](https://www.bibbiaedu.it/CEI2008/nt/Ef/3/) |
| 4 | Citazione del salmo; discesa; ministeri | [NET 4](https://www.biblegateway.com/passage/?search=Ephesians+4&version=NET), [CEI 4](https://www.bibbiaedu.it/CEI2008/nt/Ef/4/) |
| 5 | Raccordo 5,21–22; espansione in 5,30; ricezione matrimoniale | [NET 5](https://www.biblegateway.com/passage/?search=Ephesians+5&version=NET), [CEI 5](https://www.bibbiaedu.it/CEI2008/nt/Ef/5/) |
| 6 | Variante in 6,1; schiavitù; armatura; chiusa | [NET 6](https://www.biblegateway.com/passage/?search=Ephesians+6&version=NET), [CEI 6](https://www.bibbiaedu.it/CEI2008/nt/Ef/6/) |

## Decisioni editoriali

- La preferenza dell’introduzione CEI per una stesura paolina con collaborazione è attribuita alla fonte; l’ipotesi postpaolina resta esplicita. Non vengono presentate percentuali di consenso non verificate.
- L’omissione della destinazione in 1,1 sostiene la circolarità ma non la dimostra.
- La riconciliazione in 2,14–18 non attenua il riferimento esplicito alla Legge; non si attribuisce al capitolo una trattazione completa dell’Israele non credente in Cristo.
- In 3,12 fede rivolta a Cristo e fedeltà di Cristo sono interpretazioni del genitivo, non varianti manoscritte.
- In 4,8 l’adattamento del salmo è distinto dalla trasmissione di Efesini; in 4,9 sono separati variante e sintassi.
- In 5,22 l’assenza del verbo riguarda testimoni precisi, non tutti i manoscritti antichi. Il raccordo con 5,21 non prova da solo la parità sociale moderna.
- In 5,31–32 la ricezione sacramentale è distinta dal primo livello letterario. Le tutele contro l’abuso sono indicate come cautela applicativa, non attribuite anacronisticamente all’autore.
- Il codice domestico non è presentato come abolizionista; gli schiavi non diventano genericamente dipendenti. La lotta spirituale non autorizza demonizzazione di persone.

## Verifiche

Sette test dedicati: completezza e sintassi; unicità e dimensione dei campi; copertura consecutiva dei versetti; distinzioni critiche; provenienza delle fonti; registro editoriale; data-access rebuild.

Superati 44 test, includendo Galati, 1–2 Corinzi, Romani, Deuteronomio e instradamento. Per questa esecuzione tutti i moduli TypeScript, eccetto il nuovo Efesini, sono letti dal commit base remoto tramite `git show`; ciò esclude dipendenze dalle modifiche locali sospese. Il client CMS è simulato, mentre i moduli di registro e data-access sono reali.

Comandi riproducibili su checkout pulito della revisione:

```sh
node --test tests/ephesians-editorial.test.cjs tests/galatians-editorial.test.cjs tests/second-corinthians-editorial.test.cjs tests/first-corinthians-editorial.test.cjs tests/romans-editorial.test.cjs tests/deuteronomy-editorial.test.cjs tests/editorial-routing.test.cjs
node_modules/.bin/tsc --noEmit --skipLibCheck --target es2020 --module commonjs src/data/ephesiansEditorialSpecific.ts
git diff --check
```

Controllo TypeScript mirato e controllo delle spaziature superati. La guida Next.js indicata in AGENTS non è presente nell’installazione locale; non sono cambiate API o componenti Next.js.

## Limiti e rilascio

Non è una revisione accademica esterna e non implica lettura integrale dei cinque commentari. Non include build locale completa, collaudo visivo, scansione log o verifica del monitoraggio.

Il rilascio richiede build remoto riuscito, integrazione e verifica HTTP delle sei pagine principali e delle sei rebuild. Le nuove sintesi devono essere presenti nel markup HTML effettivo, esclusi gli script con dati serializzati. Il risultato di produzione viene comunicato soltanto dopo il controllo.
