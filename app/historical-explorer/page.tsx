import Link from 'next/link';
import AppShell from '../../src/components/AppShell';

export default function HistoricalExplorerLanding() {
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
            <article className="rounded-2xl border border-papyrus-line bg-paper-card p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Prototipo attivo</p>
              <h2 className="mt-3 font-serif text-4xl font-bold">Genesi</h2>
              <p className="mt-4 max-w-2xl leading-7 text-ink-soft">Il primo ambiente integra cursore temporale, mappa interattiva, città e poteri, eventi datati, relazioni e Inspector. Serve a validare il modello prima dell’estensione all’intero corpus.</p>
              <Link href="/historical-explorer/genesi" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-papyrus hover:opacity-90">Apri Historical Explorer →</Link>
            </article>
            <aside className="rounded-2xl border border-papyrus-line bg-papyrus/55 p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Relazione con la Timeline</p>
              <h2 className="mt-3 font-serif text-2xl font-bold">Due prospettive, un contesto.</h2>
              <p className="mt-4 leading-7 text-ink-soft"><strong className="text-ink">Timeline</strong> racconta il testo nel tempo. <strong className="text-ink">Historical Explorer</strong> interroga la storia attestata, ricostruita o discussa intorno al testo.</p>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
