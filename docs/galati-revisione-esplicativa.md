# Galati 1–6 — revisione esplicativa

## Perimetro

Revisione dei sei capitoli nello standard di Romani e delle due lettere ai Corinzi. Base: `f9997009a77a722ec96b68447059049e46b5a834`. Modulo: `src/data/galatiansEditorialSpecific.ts`. 3322 parole nei sei campi testuali.

Non modifica testo biblico, CMS, ID, interfaccia o configurazione del rilascio. Gli interventi sospesi su Giosuè e gli altri file locali non pertinenti restano esclusi. L'approvazione include la pubblicazione di questa revisione senza conferme intermedie; non apre una revisione automatica indistinta dell'intero corpus.

## Criteri editoriali

- Sintesi di circa cento parole che spiegano il contenuto e la funzione di ciascun capitolo.
- Strutture complete con intervalli e funzione dei passaggi; raccordo esplicito fra 4,28–31 e 5,1.
- Contesto, formazione, analisi e note specifici: eliminati i paragrafi identici ripetuti.
- Distinzione fra dati storici, ricostruzioni degli avversari, retorica, traduzione, numerazione e varianti manoscritte.
- La polemica sulla Torah non diventa una caricatura del giudaismo, ma non viene neppure privata della sua durezza.
- Bibliografia precedente conservata come riferimento non consultato integralmente; nessuna pagina o citazione puntuale inventata.
- Controlli quantitativi usati come protezioni contro regressioni, non come certificazione di qualità accademica.

## Fonti confrontate

Consultazione: 31 agosto 2026. L'ampliamento sviluppa anche le osservazioni del modulo precedente. NET, CEI e guide Yale sono risorse con scelte interpretative riconoscibili, non un'unica voce neutra né un apparato critico completo.

| Capitolo | Questione principale | Fonti consultate |
| --- | --- | --- |
| 1 | Destinatari, autoritratto e grazia in 1,6 | [NET 1](https://www.biblegateway.com/passage/?search=Galatians+1&version=NET) |
| 2 | Antiochia, giustificazione, pistis Christou e numerazione 2,19–20 | [NET 2](https://www.biblegateway.com/passage/?search=Galatians+2&version=NET), [CEI 2](https://www.bibbiaedu.it/CEI2008/nt/Gal/2/) |
| 3 | Promessa, funzione della Legge e unità battesimale | [NET 3](https://www.biblegateway.com/passage/?search=Galatians+3&version=NET), [Yale: The Law](https://yalebiblestudy.org/courses/galatians-philippians/lessons/arguments-about-the-law-study-guide/) |
| 4 | Figliolanza, elementi del mondo e allegoria di Agar e Sara | [NET 4](https://www.biblegateway.com/passage/?search=Galatians+4&version=NET), [Yale: Hagar and Sarah](https://yalebiblestudy.org/courses/galatians-philippians/lessons/hagar-and-sarah-study-guide/) |
| 5 | Libertà, invettiva e vita nello Spirito | [NET 5](https://www.biblegateway.com/passage/?search=Galatians+5&version=NET), [Yale: Faith through Love](https://yalebiblestudy.org/courses/galatians-philippians/lessons/faith-working-through-love-study-guide/) |
| 6 | Solidarietà, responsabilità e Israele di Dio | [NET 6](https://www.biblegateway.com/passage/?search=Galatians+6&version=NET), [Yale: Faith through Love](https://yalebiblestudy.org/courses/galatians-philippians/lessons/faith-working-through-love-study-guide/) |

## Distinzioni documentate

In 2,16 «fede in Cristo» (CEI) e «fedeltà di Cristo» (NET) interpretano la stessa espressione: non sono due varianti manoscritte. La collocazione di «sono stato crocifisso con Cristo» in 2,19 o 2,20 riguarda la numerazione, non contenuto mancante. Le note selezionano varianti verificabili, fra cui 1,6; 2,20; 4,7; 5,21; 6,15, senza riproporre un catalogo generico.

L'interpretazione più ampia dell'Israele di Dio in 6,16 è attribuita alla guida Yale, accanto alle letture riferite all'insieme dei credenti o ai credenti ebrei: non viene presentata come consenso. L'allegoria di Agar non esaurisce il personaggio della Genesi e non autorizza espulsioni etniche. Il significato della Legge non è ridotto alle sole pratiche identitarie né a una generica ricerca di meriti.

## Verifiche prima dell'integrazione

- Sette nuovi test di Galati: completezza, unicità e lunghezze minime; copertura dei versetti; distinzioni interpretative; fonti; registro editoriale; data-access rebuild.
- Suite di 37 test con regressioni su Romani, 1–2 Corinzi, Deuteronomio e instradamento.
- Suite eseguita con i moduli TypeScript della base remota, eccetto il nuovo modulo di Galati, per escludere dipendenze dalle modifiche locali sospese.
- Tutti i capitoli attraversano registro e rebuild; metadati CMS e testimoni biblici sono preservati. Il client CMS è simulato nei test.
- Controllo TypeScript mirato e controllo delle differenze di spaziatura.

```sh
node --test tests/galatians-editorial.test.cjs tests/second-corinthians-editorial.test.cjs tests/first-corinthians-editorial.test.cjs tests/romans-editorial.test.cjs tests/deuteronomy-editorial.test.cjs tests/editorial-routing.test.cjs
node_modules/.bin/tsc --noEmit --skipLibCheck --target es2020 --module commonjs src/data/galatiansEditorialSpecific.ts
git diff --check
```

## Limiti e chiusura

Il lavoro non costituisce revisione accademica esterna né lettura integrale dei cinque riferimenti bibliografici. Non include build locale completa, collaudo visivo o scansione dei log di produzione.

Il rilascio richiede build remoto riuscito, integrazione e verifica delle sei pagine principali e delle sei rebuild: le nuove sintesi devono comparire nel markup HTML, non soltanto nei dati serializzati. L'eventuale risultato positivo di tale controllo sarà comunicato dopo la verifica, senza anticiparlo dal solo superamento dei test.
