# 2 Corinzi 1–13 — revisione esplicativa

## Perimetro

Revisione completa delle tredici schede, proseguendo lo standard di Romani e 1 Corinzi. Base: `a2f0c2660c9d2e2a35a2741158e5aa2af70963ac`. Modulo: `src/data/secondCorinthiansEditorialSpecific.ts`. Circa 7035 parole nei sei campi testuali.

Nessuna modifica al testo biblico, al CMS, agli ID, all'interfaccia o alla configurazione di pubblicazione. Le modifiche sospese a Giosuè e gli altri file locali non pertinenti rimangono esclusi. L'approvazione dell'utente comprende il completamento e la pubblicazione senza ulteriori conferme intermedie; non richiede una revisione automatica indiscriminata degli altri libri.

## Standard applicato

- Sintesi di circa cento parole con contenuto e funzione del capitolo nell'argomentazione.
- Strutture complete secondo la numerazione CEI, con raccordi espliciti oltre i confini moderni dei capitoli.
- Contesto, formazione, analisi e note testuali capitolo-specifici; rimossi i paragrafi generici condivisi.
- Distinzione fra dato testuale, interpretazione, ipotesi compositiva, variante manoscritta e ricezione.
- Le ricostruzioni degli avversari sono limitate dalla disponibilità della sola voce paolina.
- La cautela etica non cancella la durezza effettiva della retorica apostolica.
- Cinque commentari preesistenti conservati come bibliografia di riferimento non consultata integralmente; nessuna pagina o citazione puntuale inventata.
- I test di lunghezza e unicità impediscono regressioni verso etichette, ma non certificano la qualità accademica.

## Fonti consultate e mappa del controllo

Consultazione: 31 agosto 2026. NET è una traduzione con note che assumono posizioni esegetiche e testuali: non è un'autorità neutra né sostituisce un apparato critico completo. La revisione sviluppa anche le osservazioni già presenti nel modulo del repository.

| Capitolo | Verifica principale | Fonte di confronto |
| --- | --- | --- |
| 1 | Consolazione, viaggio e variante di 1,12 | [NET 1](https://www.biblegateway.com/passage/?search=2+Corinthians+1&version=NET) |
| 2 | Offensore non identificato, trionfo e raccordo con 7,5 | [NET 2](https://www.biblegateway.com/passage/?search=2+Corinthians+2&version=NET) |
| 3 | Mosè, nuova alleanza e lessico di 3,18 | [NET 3](https://www.biblegateway.com/passage/?search=2+Corinthians+3&version=NET) |
| 4 | Fragilità corporea e titolo in 4,14 | [NET 4](https://www.biblegateway.com/passage/?search=2+Corinthians+4&version=NET) |
| 5 | Dimora, riconciliazione e variante di 5,3 | [NET 5](https://www.biblegateway.com/passage/?search=2+Corinthians+5&version=NET) |
| 6 | 6,14–7,1: composizione distinta dalla copiatura | [NET 6](https://www.biblegateway.com/passage/?search=2+Corinthians+6&version=NET) |
| 7 | Raccordi 6,13–7,2 e 2,13–7,5; dolore e conversione | [NET 7](https://www.biblegateway.com/passage/?search=2+Corinthians+7&version=NET) |
| 8 | Colletta, uguaglianza, gestione e pronomi di 8,7 | [NET 8](https://www.biblegateway.com/passage/?search=2+Corinthians+8&version=NET) |
| 9 | Generosità libera e limiti della metafora economica | [NET 9](https://www.biblegateway.com/passage/?search=2+Corinthians+9&version=NET) |
| 10 | Cambio di tono, autorità e cronologia ipotetica | [NET 10](https://www.biblegateway.com/passage/?search=2+Corinthians+10&version=NET) |
| 11 | Rivali, identità ebraica e vanto paradossale | [NET 11](https://www.biblegateway.com/passage/?search=2+Corinthians+11&version=NET) |
| 12 | Spina non diagnosticabile, visione e trasparenza | [NET 12](https://www.biblegateway.com/passage/?search=2+Corinthians+12&version=NET) |
| 13 | Esame comunitario, benedizione e numerazione CEI | [NET 13](https://www.biblegateway.com/passage/?search=2+Corinthians+13&version=NET) |

Fonti aggiuntive, limitate alle questioni pertinenti:

- [Yale Bible Study, Introduction to the Course](https://yalebiblestudy.org/courses/2-corinthians/lessons/introduction-to-the-course-8/): proposta di ricostruzione composita, confrontata nei capitoli 1–2 e 8–10. La scheda non adotta come certe né tutta la cronologia della guida né una specifica sequenza di frammenti.
- [Yale Bible Study, Interpolation](https://yalebiblestudy.org/courses/2-corinthians/lessons/interpolation-study-guide/): ipotesi su 6,14–7,1 e raccordi del viaggio nei capitoli 6–7. Il termine interpolazione nella guida esprime una ricostruzione, non la presenza di un manoscritto che ometta il passo. Le indicazioni dei versetti sono ricontrollate: il richiamo alla precedente lettera è in 1 Corinzi 5,9, non 6,9.
- [Bibbia CEI 2008, 2 Corinzi 13](https://www.bibbiaedu.it/CEI2008/nt/2Cor/13/): numerazione, saluti e benedizione finale.

## Correzioni concettuali rispetto al modulo precedente

In 3,18 contemplare/riflettere è una discussione sul significato del verbo, non una variante di copiatura. In 13,13 la numerazione alternativa 13,14 non implica contenuto mancante; la presenza o assenza finale di amen è invece una vera variante. I problemi dell'itinerario non vengono automaticamente elencati come varianti manoscritte. Le ipotesi di lettere autonome sono distinte dalla forma effettivamente trasmessa.

## Verifiche prima dell'integrazione

- 30 test superati: sette nuovi per 2 Corinzi e ventitré di regressione.
- Suite ripetuta caricando tutti i moduli dalla base remota indicata, eccetto il nuovo modulo di 2 Corinzi: nessuna dipendenza dalle modifiche locali sospese.
- Tutti i tredici capitoli verificati attraverso registro editoriale e data-access rebuild, per entrambi gli alias `2-corinti` e `2-corinzi`.
- Preservati metadati CMS e testimoni biblici; il client CMS dei test è simulato.
- Controllo TypeScript mirato e `git diff --check` superati.

Comandi ripetibili:

```sh
node --test tests/second-corinthians-editorial.test.cjs tests/first-corinthians-editorial.test.cjs tests/romans-editorial.test.cjs tests/deuteronomy-editorial.test.cjs tests/editorial-routing.test.cjs
node_modules/.bin/tsc --noEmit --skipLibCheck --target es2020 --module commonjs src/data/secondCorinthiansEditorialSpecific.ts
```

## Limiti e verifica di pubblicazione

Non sono una revisione accademica esterna né una lettura integrale dei commentari elencati. Non sono stati eseguiti build completa locale, collaudo visivo o controllo dei log di produzione. La pubblicazione richiede l'esito positivo del build remoto e la verifica HTTP delle nuove sintesi nel markup delle tredici pagine principali e delle tredici rebuild; non basta la presenza dei dati nel codice o nei payload degli script.

Il criterio di chiusura è il completamento di questo libro con verifiche dichiarate. Ulteriori interventi devono rispondere a errori documentati o a nuove richieste precise.
