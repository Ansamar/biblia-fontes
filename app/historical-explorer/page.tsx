import Link from 'next/link';
import AppShell from '../../src/components/AppShell';
import { client } from '../../src/sanity/client';

const datasetsQuery = `*[_type == "historicalExplorerDataset"] | order(book->ordine asc, title asc){
  id,
  title,
  subtitle,
  "bookId": book->_id,
  "bookTitle": book->titolo,
  "bookSlug": string::replace(book->_id, "libro-", ""),
  "entities": count(entities),
  "areas": count(areas),
  "scenarios": count(scenarios)
}`;

export default async function HistoricalExplorerLanding() {
  const datasets = await client.fetch(datasetsQuery).catch(() => []);

  return (
    <AppShell>
      <main>
        <section className="border-b border-papyrus-line bg-paper-card/35">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Biblia Fontes Historical Explorer</p>
            <h1 className="mt-4 max-w-5xl font-serif text-5xl font-bold leading-[.95] md:text-7xl">Interroga la storia intorno al testo.</h1>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">Tempo, spazio, popoli, poteri, eventi, culture e processi di formazione vengono esplorati come relazioni storiche, distinguendo dati attestati, ricostruzioni, ipotesi e memorie. Il testo biblico resta collegato, ma non viene trasformato automaticamente in cronaca storica.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Dataset pubblicati</p>
                  <h2 className="mt-2 font-serif text-3xl font-bold">Esplora per libro</h2>
                </div>
                <span className="text-xs text-ink-faint">{datasets.length} ambienti disponibili</span>
              </div>

              {datasets.length ? datasets.map((dataset: any) => (
                <article key={dataset.id} className="rounded-2xl border border-papyrus-line bg-paper-card p-6 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-bronze">{dataset.bookTitle || dataset.title}</p>
                      <h3 className="mt-2 font-serif text-3xl font-bold">{dataset.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-ink-faint">
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1">{dataset.entities} entità</span>
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1">{dataset.areas} geometrie</span>
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1">{dataset.scenarios} scenari</span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-3xl leading-7 text-ink-soft">{dataset.subtitle}</p>
                  <Link href={`/historical-explorer/${dataset.bookSlug}`} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-papyrus hover:opacity-90">Apri Historical Explorer →</Link>
                </article>
              )) : (
                <div className="rounded-2xl border border-papyrus-line bg-paper-card p-6 text-ink-soft">Nessun dataset Historical Explorer pubblicato in Sanity.</div>
              )}
            </div>

            <aside className="rounded-2xl border border-papyrus-line bg-papyrus/55 p-6 md:p-8 lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Relazione con la Timeline</p>
              <h2 className="mt-3 font-serif text-2xl font-bold">Due prospettive, un contesto.</h2>
              <p className="mt-4 leading-7 text-ink-soft"><strong className="text-ink">Timeline</strong> racconta il testo nel tempo. <strong className="text-ink">Historical Explorer</strong> interroga la storia attestata, ricostruita o discussa intorno al testo.</p>
              <p className="mt-5 border-t border-papyrus-line pt-5 text-sm leading-6 text-ink-faint">Gli ambienti qui elencati provengono direttamente dai dataset pubblicati in Sanity. L’aggiunta di un nuovo libro non richiede una nuova pagina frontend.</p>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
