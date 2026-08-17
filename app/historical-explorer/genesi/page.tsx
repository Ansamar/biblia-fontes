import Link from 'next/link';
import AppShell from '../../../src/components/AppShell';
import ExplorerShareButton from '../../../src/components/ExplorerShareButton';
import HistoricalExplorerShell from '../../../src/components/HistoricalExplorerShell';
import StudyContextNav from '../../../src/components/StudyContextNav';
import { genesisDemoData } from '../../../src/historical-explorer/genesisDemoData';
import { genesisQuickYears, genesisScenarios } from '../../../src/historical-explorer/genesisScenarios';
import { client } from '../../../src/sanity/client';
import { parseStudyContext } from '../../../src/study-context/context';

const query = `*[_id == "libro-genesi"][0]{
  titolo,
  datazione
}`;

export default async function GenesisHistoricalExplorerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const libro = await client.fetch(query);
  const context = parseStudyContext(await searchParams);
  const formationLabel = [libro?.datazione?.etichettaInizio, libro?.datazione?.etichettaFine]
    .filter(Boolean)
    .join(' — ') || 'Processo compositivo pluristratificato, con fasi e datazioni discusse.';

  const dataset = {
    ...genesisDemoData,
    scenarios: genesisScenarios,
    quickYears: genesisQuickYears,
    entities: genesisDemoData.entities.map((entity) => entity.id === 'genesis-formation'
      ? { ...entity, summary: `${entity.summary} Dataset Biblia Fontes: ${formationLabel}` }
      : entity),
  };

  const entryLabel = context.source === 'timeline'
    ? 'Aperto dalla Timeline del testo'
    : context.source === 'chapter'
      ? `Aperto dal capitolo ${context.chapter ?? ''}`.trim()
      : context.source === 'history'
        ? 'Ripristino della scena storica'
        : 'Aperto dal contesto del libro';

  return (
    <AppShell>
      <StudyContextNav bookSlug="genesi" bookTitle={libro?.titolo || 'Genesi'} firstChapter={1} active="history" historyAvailable />
      <main className="bg-paper-card/35">
        <section className="border-b border-papyrus-line bg-paper-card">
          <div className="mx-auto max-w-[1580px] px-5 py-8 md:px-8 md:py-10">
            <nav className="text-sm text-ink-faint" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-bronze">Bibbia</Link>
              <span className="mx-2">/</span>
              <Link href="/bibbia/genesi" className="hover:text-bronze">Genesi</Link>
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Storia</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Modalità · Storia</p>
                <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">Historical Explorer · Genesi</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-soft">Interroga la storia attestata, ricostruita o discussa intorno a Genesi. Il libro resta il contesto; tempo, spazio, entità e relazioni cambiano la prospettiva.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-faint"><span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">{entryLabel}</span>{context.year !== undefined && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">Anno richiesto: {Math.abs(context.year)} {context.year < 0 ? 'a.C.' : 'd.C.'}</span>}{context.entity && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">Entità: {context.entity}</span>}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ExplorerShareButton />
                <Link href="/bibbia/genesi#timeline" className="rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze">← Torna alla Timeline del testo</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1580px] px-3 py-5 md:px-6 md:py-8">
          <HistoricalExplorerShell dataset={dataset} originBookSlug="genesi" initialYear={context.year} initialEntityId={context.entity} syncUrlState />
        </section>
      </main>
    </AppShell>
  );
}
