# 1 Corinzi 1–16 — revisione esplicativa

## Perimetro

Revisione completa delle sedici schede nello standard applicato a Romani. Base: `484351faf79e33d86d0dd59a245f1a2154891e85`. Non vengono modificati testo biblico, dati CMS, ID, interfaccia o configurazione di distribuzione. La PR #78 su Giosuè rimane esclusa.

L'autorizzazione a procedere senza ulteriori conferme riguarda la conclusione di questo intervento, inclusi integrazione e verifica della pubblicazione. Non apre automaticamente una revisione di tutti gli altri libri.

## Criteri applicati

- Sintesi di circa cento parole: spiegano che cosa si legge e perché il capitolo occupa quella posizione.
- Strutture con intervalli completi e funzione delle unità; 11,1 è riconosciuto come conclusione del capitolo precedente.
- Contesto, formazione, analisi e note testuali specifici, senza paragrafi condivisi automaticamente fra tutti i capitoli.
- Distinzione fra osservazione del testo, ricostruzione storica, variante manoscritta, traduzione, ricezione e applicazione contemporanea.
- Nessuna ricostruzione dei motivi degli interlocutori o delle condizioni delle vittime viene presentata come dato documentato quando il testo tace.
- Conservati i cinque commentari precedentemente indicati, qualificandoli come bibliografia di riferimento non consultata integralmente. Nessuna pagina o citazione puntuale inventata.
- Le lunghezze sono controlli antiregressione, non indicatori automatici di qualità scientifica.

## Fonti effettivamente confrontate

Consultazione: 31 agosto 2026. Il testo e le note NET servono al confronto capitolo per capitolo: sono scelte di un gruppo di traduttori, non un'edizione critica completa né un consenso neutro. L'ampliamento sviluppa anche il contenuto editoriale già presente nel repository; le risorse online non vengono presentate come fonte esclusiva di ogni frase.

| Capitolo | Questione controllata | Fonte di confronto |
| --- | --- | --- |
| 1 | Divisioni, croce e limiti degli slogan sui gruppi | [NET 1](https://www.biblegateway.com/passage/?search=1+Corinthians+1&version=NET) |
| 2 | Sapienza, governanti e variante di 2,1 | [NET 2](https://www.biblegateway.com/passage/?search=1+Corinthians+2&version=NET) |
| 3 | Campo, edificio, tempio e ricezione del fuoco | [NET 3](https://www.biblegateway.com/passage/?search=1+Corinthians+3&version=NET) |
| 4 | Giudizio, ironia e autorità paterna | [NET 4](https://www.biblegateway.com/passage/?search=1+Corinthians+4&version=NET) |
| 5 | Disciplina, donna non ascoltata e linguaggio della carne | [NET 5](https://www.biblegateway.com/passage/?search=1+Corinthians+5&version=NET) |
| 6 | Tribunali, corpo e lessico sessuale controverso | [NET 6](https://www.biblegateway.com/passage/?search=1+Corinthians+6&version=NET) |
| 7 | Reciprocità, astinenza, schiavitù e casi familiari | [NET 7](https://www.biblegateway.com/passage/?search=1+Corinthians+7&version=NET) |
| 8 | Conoscenza, coscienza e partecipazione cultuale | [NET 8](https://www.biblegateway.com/passage/?search=1+Corinthians+8&version=NET) |
| 9 | Diritto al sostegno e rinuncia apostolica | [NET 9](https://www.biblegateway.com/passage/?search=1+Corinthians+9&version=NET) |
| 10 | Deserto, comunione delle tavole e raccordo con 11,1 | [NET 10](https://www.biblegateway.com/passage/?search=1+Corinthians+10&version=NET) |
| 11 | Preghiera femminile, genere, disuguaglianza e Cena | [NET 11](https://www.biblegateway.com/passage/?search=1+Corinthians+11&version=NET) |
| 12 | Carismi, membra deboli e diversità dei ruoli | [NET 12](https://www.biblegateway.com/passage/?search=1+Corinthians+12&version=NET) |
| 13 | Amore, compimento e variante di 13,3 | [NET 13](https://www.biblegateway.com/passage/?search=1+Corinthians+13&version=NET) |
| 14 | Intelligibilità, silenzio femminile e ipotesi di interpolazione | [NET 14](https://www.biblegateway.com/passage/?search=1+Corinthians+14&version=NET) |
| 15 | Tradizione pasquale, corpo spirituale e testimonianze | [NET 15](https://www.biblegateway.com/passage/?search=1+Corinthians+15&version=NET) |
| 16 | Colletta, collaboratori, autografo e Maranatha | [NET 16](https://www.biblegateway.com/passage/?search=1+Corinthians+16&version=NET) |

Per il capitolo 7 è stata confrontata anche [Yale Bible Study, Marriage and Slavery](https://yalebiblestudy.org/courses/1-corinthians/lessons/marriage-and-slavery-study-guide/): guida didattica che evidenzia l'orizzonte escatologico e i limiti sociali del consiglio paolino. La scheda conserva le alternative interpretative su 7,21, senza attribuire alla guida tutte le possibilità.

Per il capitolo 14 si distingue esplicitamente la difesa dell'autenticità nelle note NET dalla proposta di interpolazione esposta da [Bart D. Ehrman](https://ehrmanblog.org/the-silencing-of-women-1-cor-1434-35-as-an-interpolation/). Il contributo divulgativo dell'autore documenta la sua posizione, non certifica un consenso accademico. La collocazione mobile dei vv. 34–35 non è presentata come attestazione manoscritta della loro omissione.

## Verifiche prima dell'integrazione

- 23 test superati: sette nuovi per 1 Corinzi e sedici di regressione su Romani, Deuteronomio e instradamento editoriale.
- Suite rieseguita caricando i moduli TypeScript dalla base remota sopra indicata, eccetto il nuovo modulo di 1 Corinzi: escluse così le modifiche locali non pertinenti, compresa Giosuè.
- Tutti i sedici capitoli verificati nel registro editoriale e nell'accesso dati rebuild per entrambi gli alias `1-corinti` e `1-corinzi`.
- Metadati CMS e testimoni biblici preservati; nei test il client CMS è simulato.
- Controllo tipi mirato del modulo superato; controllo di spazi e patch superato.
- Comando ripetibile: `node --test tests/first-corinthians-editorial.test.cjs tests/romans-editorial.test.cjs tests/deuteronomy-editorial.test.cjs tests/editorial-routing.test.cjs`.
- Controllo tipi: `node_modules/.bin/tsc --noEmit --skipLibCheck --target es2020 --module commonjs src/data/firstCorinthiansEditorialSpecific.ts`.

## Limiti e chiusura

Non è una revisione accademica esterna né una lettura integrale dei cinque commentari. Il controllo locale non equivale a build completa, verifica visiva nel browser o controllo dei log di produzione. Prima dell'integrazione il sito pubblico può ancora mostrare le schede precedenti.

La verifica successiva deve controllare lo stato del commit e, via HTTP, la presenza delle nuove sintesi nelle sedici pagine principali e nelle sedici viste rebuild. Un risultato live non deve essere anticipato dal semplice superamento dei test locali. Eventuali errori documentati saranno corretti senza riaprire automaticamente il libro in un nuovo ciclo indistinto.
