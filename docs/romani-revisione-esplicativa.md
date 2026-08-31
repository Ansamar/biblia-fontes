# Romani 1–16 — revisione esplicativa
## Perimetro
Revisione completa del contenuto editoriale dei sedici capitoli, richiesta dopo l'audit della copertura. Non aggiunge capitoli, non cambia il testo biblico, gli ID del CMS o l'interfaccia. La PR #78 su Giosuè resta separata e non viene unita.

Base: `974bb97b7f996eab438b2820ce99fb13c09f5c48`. Modulo: `src/data/romansEditorialSpecific.ts`.

## Criteri editoriali applicati
- Una sintesi di circa cento parole risponde a «Che cosa sto leggendo?» e orienta nell'argomento.
- Le strutture spiegano la funzione dei passaggi oltre a indicarne i versetti.
- Contesto e formazione distinguono ambiente storico, architettura letteraria e ricostruzioni ipotetiche.
- Le analisi esplicitano i problemi principali e il collegamento con il resto della lettera.
- Le note distinguono lessico, sintassi, numerazione, varianti manoscritte e ricezione.
- I limiti quantitativi proposti sono orientativi, non quote da riempire. I test di lunghezza non certificano la qualità.
- I cinque riferimenti bibliografici già presenti sono conservati e qualificati come non consultati integralmente. Le risorse effettivamente consultate sono elencate separatamente nella bibliografia di ciascuna scheda.
- Nessuna pagina di commentario è citata senza verifica. Le alternative non vengono tutte attribuite indistintamente a tutti i commentari.

## Mappa della revisione e fonti di confronto
La NET è una traduzione con note dei traduttori, non un'autorità neutra o un'edizione critica completa: se ne dichiarano le scelte, soprattutto in 3,22 e 16,7. Le guide Yale sono risorse didattiche accademiche, non una revisione specialistica indipendente del nostro testo. Le interpretazioni originali della scheda restano distinguibili dalla fonte citata.

| Capitolo | Punto esplicativo e controllo principale | Fonti consultate |
| --- | --- | --- |
| 1 | Vangelo e percorso 1,18–2,1; contesto e limiti delle applicazioni di 1,26–27 | [NET 1](https://www.biblegateway.com/passage/?search=Romans+1&version=NET), [CEI 1](https://www.bibbiaedu.it/CEI2008/nt/Rm/1/) |
| 2 | Interlocutore retorico, giudizio, Torah e coscienza | [NET 2](https://www.biblegateway.com/passage/?search=Romans+2&version=NET) |
| 3 | Giustificazione, opere della legge, pistis Christou e hilasterion | [NET 3](https://www.biblegateway.com/passage/?search=Romans+3&version=NET) |
| 4 | Abramo: promessa, circoncisione e famiglia dei credenti | [NET 4](https://www.biblegateway.com/passage/?search=Romans+4&version=NET), [Yale: Faith’s Poster Boy](https://yalebiblestudy.org/courses/romans/lessons/faiths-poster-boy-study-guide/) |
| 5 | Adamo–Cristo e ricezione; variante del modo verbale in 5,1 | [NET 5](https://www.biblegateway.com/passage/?search=Romans+5&version=NET), [Yale: Living in Hope](https://yalebiblestudy.org/courses/romans/lessons/living-in-hope-study-guide/) |
| 6 | Battesimo, nuova appartenenza e limiti della metafora schiavistica | [NET 6](https://www.biblegateway.com/passage/?search=Romans+6&version=NET), [Yale: New Lord, New Life](https://yalebiblestudy.org/courses/romans/lessons/new-lord-new-life-study-guide/) |
| 7 | Identità discussa dell'io; bontà della legge e potere del peccato | [NET 7](https://www.biblegateway.com/passage/?search=Romans+7&version=NET), [Yale: From Flesh to Spirit](https://yalebiblestudy.org/courses/romans/lessons/from-flesh-to-spirit-study-guide/) |
| 8 | Spirito, creazione e predestinazione; espansioni in 8,1 | [NET 8](https://www.biblegateway.com/passage/?search=Romans+8&version=NET), [Yale: From Flesh to Spirit](https://yalebiblestudy.org/courses/romans/lessons/from-flesh-to-spirit-study-guide/) |
| 9 | Fedeltà delle promesse, elezione; punteggiatura di 9,5 | [NET 9](https://www.biblegateway.com/passage/?search=Romans+9&version=NET), [Yale: History Matters!](https://yalebiblestudy.org/courses/romans/lessons/history-matters-study-guide/) |
| 10 | Rilettura delle Scritture, telos e parola vicina | [NET 10](https://www.biblegateway.com/passage/?search=Romans+10&version=NET), [Yale: History Matters!](https://yalebiblestudy.org/courses/romans/lessons/history-matters-study-guide/) |
| 11 | Olivo, «tutto Israele» e chiamata irrevocabile | [NET 11](https://www.biblegateway.com/passage/?search=Romans+11&version=NET), [CEI 11](https://www.bibbiaedu.it/CEI2008/nt/Rm/11/), [Yale: History Matters!](https://yalebiblestudy.org/courses/romans/lessons/history-matters-study-guide/) |
| 12 | Culto corporeo, carismi e rifiuto della vendetta | [NET 12](https://www.biblegateway.com/passage/?search=Romans+12&version=NET), [Yale: Transformed Community](https://yalebiblestudy.org/courses/romans/lessons/the-transformed-community-study-guide/) |
| 13 | Comando sulle autorità distinto dall'applicazione politica contemporanea | [NET 13](https://www.biblegateway.com/passage/?search=Romans+13&version=NET), [CEI 13](https://www.bibbiaedu.it/CEI2008/nt/Rm/13/), [Yale: Transformed Community](https://yalebiblestudy.org/courses/romans/lessons/the-transformed-community-study-guide/) |
| 14 | Differenze pratiche, coscienza, scandalo e collegamento con 15,1–13 | [NET 14](https://www.biblegateway.com/passage/?search=Romans+14&version=NET), [CEI 14](https://www.bibbiaedu.it/CEI2008/nt/Rm/14/) |
| 15 | Accoglienza, colletta e Spagna come progetto, non viaggio già dimostrato | [NET 15](https://www.biblegateway.com/passage/?search=Romans+15&version=NET), [CEI 15](https://www.bibbiaedu.it/CEI2008/nt/Rm/15/) |
| 16 | Febe e Giunia; v. 24 e collocazioni della dossologia | [NET 16](https://www.biblegateway.com/passage/?search=Romans+16&version=NET), [CEI 16](https://www.bibbiaedu.it/CEI2008/nt/Rm/16/) |

## Verifiche
- `node --test tests/romans-editorial.test.cjs tests/deuteronomy-editorial.test.cjs tests/editorial-routing.test.cjs`: 16 test superati.
- Controllo tipi mirato: `node_modules/.bin/tsc --noEmit --skipLibCheck --target es2020 --module commonjs src/data/romansEditorialSpecific.ts`: superato.
- `git diff --check`: superato.
- I sette test nuovi verificano completezza, regressioni verso etichette, sequenza delle strutture, distinzioni interpretative chiave, bibliografie e passaggio dei sedici capitoli al registro e al data-access rebuild.
- Nei test Sanity è simulato: metadati e testimoni sono conservati, ma non si accede al contenuto live.
- La pagina principale usa già `enrichEditorialChapter`; il componente «In breve» mostra `chapter.sintesi`. Non occorre cambiare il renderer per esporre il nuovo testo.

## Limiti e criterio di chiusura
Il lavoro conclude la revisione esplicativa richiesta per Romani 1–16. Non costituisce una revisione accademica esterna né una verifica bibliografica integrale dei cinque commentari. Non sono stati eseguiti build completa, controllo tipi dell'intera app o collaudo browser/produzione.

L'aggiornamento nel codice non dimostra che il sito pubblico mostri già le nuove schede. La frase segnalata dall'utente non coincideva con la sintesi del modulo corrente: non viene attribuita senza verifica a cache, deployment o CMS. Dopo approvazione e pubblicazione occorre verificare il sito effettivamente usato.

Ulteriori modifiche devono riguardare errori documentati o richieste precise; non è previsto un nuovo ciclo automatico su tutti i libri.
