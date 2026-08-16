# Biblia Fontes — stato corpus

Aggiornamento: 16 agosto 2026.

Il frontend `biblia-fontes` utilizza Sanity project `jc1k65lj`, dataset `production`.

## Corpus latino Vulgata Stuttgartensia

- 73 libri biblici complessivi nel progetto
- 1178 documenti `testoBiblicoCapitolo` con `tradizione == "vulgata"`
- 33196 versetti/segmenti latini
- 0 reference rotte
- 0 testi vuoti
- 0 anomalie strutturali non dichiarate
- 23 casi di numerazione/lacuna del file sorgente documentati esplicitamente

I casi speciali di versificazione e struttura sono stati allineati al Reader CEI 2008 mantenendo la provenienza Vulgata tramite riferimenti alternativi, inclusi Malachia, Gioele, Giosuè ed Ester.

I Salmi latini sono gestiti separatamente nelle tradizioni Gallicanum e iuxta Hebraeos.

## Sincronizzazione

Sanity `production` → GitHub `Ansamar/biblia-fontes` → Vercel production.

Questo file registra lo stato consolidato del corpus e forza un nuovo deployment del frontend per riallineare le pagine prerenderizzate ai dati correnti di Sanity.
