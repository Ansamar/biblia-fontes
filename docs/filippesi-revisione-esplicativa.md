# Filippesi 1–4 — revisione esplicativa

## Perimetro

Quattro profili, 2263 parole nei sei campi testuali; base `26e956055040fa28c5417cbfdbf277c6e0002628`. Continua lo standard di Romani, 1–2 Corinzi, Galati ed Efesini. Modifiche limitate al modulo `src/data/philippiansEditorialSpecific.ts`, al test dedicato e a questa nota. Nessun cambiamento a CMS, testo biblico, ID, interfaccia o configurazione di rilascio. Giosuè e gli altri interventi locali non pertinenti restano esclusi.

## Criteri

Sintesi esplicative di circa cento parole e campi specifici per capitolo. La struttura comprende tutti i versetti, compreso 4,1, con raccordo esplicito a 3,17–21. Le soglie quantitative dei test proteggono da regressioni, non certificano la qualità scientifica.

I cinque commentari della bibliografia precedente restano indicati come riferimenti non consultati integralmente. Le risorse effettivamente consultate sono separate; nessuna citazione di pagina o lettura integrale è simulata.

## Fonti consultate

Consultazione: 31 agosto 2026. L’ampliamento sviluppa anche il modulo precedente. CEI, NET e Yale sono fonti con scelte esegetiche riconoscibili, non un apparato critico completo né una voce unanime.

| Capitolo | Verifiche | Fonti |
| --- | --- | --- |
| 1 | Prigionia, responsabili comunitari, varianti in 1,14 | [NET 1](https://www.biblegateway.com/passage/?search=Philippians+1&version=NET), [CEI 1](https://www.bibbiaedu.it/CEI2008/nt/Fil/1/), [introduzione CEI](https://www.bibbiaedu.it/CEI2008/nt/Fil/), [Yale: lettera dal carcere](https://yalebiblestudy.org/wp-content/uploads/2019/09/Philippians-A-Friendly-Letter-from-Prison-Study-Guide.pdf), [Yale: introduzione](https://yalebiblestudy.org/wp-content/uploads/2019/09/Philippians-Introduction-Study-Guide.pdf) |
| 2 | Genere dell’inno, variante in 2,4, numerazione 2,7–8, collaboratori | [NET 2](https://www.biblegateway.com/passage/?search=Philippians+2&version=NET), [CEI 2](https://www.bibbiaedu.it/CEI2008/nt/Fil/2/) |
| 3 | Identità ebraica, composizione, variante in 3,3 e genitivo in 3,9 | [NET 3](https://www.biblegateway.com/passage/?search=Philippians+3&version=NET), [CEI 3](https://www.bibbiaedu.it/CEI2008/nt/Fil/3/), [Yale: introduzione](https://yalebiblestudy.org/wp-content/uploads/2019/09/Philippians-Introduction-Study-Guide.pdf) |
| 4 | Raccordo iniziale, cooperatore/Sizigo, dono e variante in 4,13 | [NET 4](https://www.biblegateway.com/passage/?search=Philippians+4&version=NET), [CEI 4](https://www.bibbiaedu.it/CEI2008/nt/Fil/4/), [Yale: introduzione](https://yalebiblestudy.org/wp-content/uploads/2019/09/Philippians-Introduction-Study-Guide.pdf) |

## Distinzioni editoriali

- Roma ed Efeso sono ipotesi di localizzazione, non deduzioni obbligate dai riferimenti imperiali.
- Il confronto fra vita e morte non diventa esortazione al suicidio o svalutazione della vita.
- In 2,6 harpagmos è un problema lessicale; l’ipotetico inno prepaolino non è un documento indipendente conservato. La lettura liturgica della nota CEI è attribuita alla fonte e distinta dalla cautela della NET sul genere.
- Svuotamento e obbedienza non sono un elenco di attributi divini perduti, né un mandato ad autoannullarsi davanti all’abuso.
- Le ipotesi di più lettere sono argomenti compositivi, non varianti della tradizione manoscritta.
- In 3,9 fede in Cristo e fedeltà di Cristo sono letture esegetiche. L’invettiva non viene generalizzata contro gli ebrei, ma neppure nascosta.
- Il ruolo missionario di Evodia e Sintiche è documentato; causa del disaccordo e incarichi precisi non vengono inventati.
- 4,13 resta nel contesto di fame e abbondanza. L’aiuto materiale non diventa promessa di prosperità garantita.

## Verifiche eseguite

Sette test dedicati: integrità e sintassi; unicità e dimensioni; strutture complete; distinzioni critiche; fonti; registro editoriale; data-access rebuild. Entrambi i percorsi conservano metadati CMS e testimoni biblici.

Superati 51 test, includendo le regressioni sui libri già revisionati, Deuteronomio e instradamento. La suite è stata eseguita leggendo tutti i moduli TypeScript dal commit base con `git show`, eccetto il nuovo Filippesi, così da escludere dipendenze dalle modifiche locali sospese. Solo il client CMS è simulato.

Su checkout pulito della revisione:

```sh
node --test tests/philippians-editorial.test.cjs tests/ephesians-editorial.test.cjs tests/galatians-editorial.test.cjs tests/second-corinthians-editorial.test.cjs tests/first-corinthians-editorial.test.cjs tests/romans-editorial.test.cjs tests/deuteronomy-editorial.test.cjs tests/editorial-routing.test.cjs
node_modules/.bin/tsc --noEmit --skipLibCheck --target es2020 --module commonjs src/data/philippiansEditorialSpecific.ts
git diff --check
```

Controllo TypeScript mirato e differenze di spaziatura superati. La directory di documentazione Next.js indicata da AGENTS non è presente localmente; non si modificano API o componenti Next.js.

## Limiti e pubblicazione

Il lavoro non equivale a revisione accademica esterna né a lettura integrale dei commentari. Nessuna build locale completa, verifica visiva o scansione dei log è dichiarata.

Prima dell’integrazione si richiede build remoto riuscito. Dopo il merge si verificano le otto pagine pubbliche, principali e rebuild: le nuove sintesi devono comparire nel markup, esclusi i dati serializzati negli script. L’esito viene comunicato solo dopo il controllo.
