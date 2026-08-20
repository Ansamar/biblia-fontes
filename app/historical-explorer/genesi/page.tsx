import Link from 'next/link';
import AppShell from '../../../src/components/AppShell';
import ExplorerShareButton from '../../../src/components/ExplorerShareButton';
import HistoricalDatasetMethodology from '../../../src/components/HistoricalDatasetMethodology';
import HistoricalExplorerShell from '../../../src/components/HistoricalExplorerShell';
import StudyContextNav from '../../../src/components/StudyContextNav';
import { diagnoseHistoricalDataset } from '../../../src/historical-explorer/diagnostics';
import { historicalDatasetForChapter } from '../../../src/historical-explorer/chapterContext';
import { genesisDemoData } from '../../../src/historical-explorer/genesisDemoData';
import { genesisHistoricalAreas } from '../../../src/historical-explorer/historicalAreas';
import { genesisQuickYears, genesisScenarios } from '../../../src/historical-explorer/genesisScenarios';
import { historicalExplorerDatasetFromSanity } from '../../../src/historical-explorer/sanityAdapter';
import { historicalExplorerDatasetQuery } from '../../../src/historical-explorer/sanityQuery';
import type { HistoricalExplorerDataset } from '../../../src/historical-explorer/types';
import { client } from '../../../src/sanity/client';
import { parseStudyContext } from '../../../src/study-context/context';

const bookQuery = `*[_id == "libro-genesi"][0]{
  titolo,
  datazione
}`;

function fallbackDataset(formationLabel: string): HistoricalExplorerDataset {
  return {
    ...genesisDemoData,
    scenarios: genesisScenarios,
    quickYears: genesisQuickYears,
    areas: genesisHistoricalAreas,
    entities: genesisDemoData.entities.map((entity) => entity.id === 'genesis-formation'
      ? { ...entity, summary: `${entity.summary} Dati Biblia Fontes: ${formationLabel}` }
      : entity),
  };
}

export default async function GenesisHistoricalExplorerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = parseStudyContext(await searchParams);

  const [libro, sanityDocument] = await Promise.all([
    client.fetch(bookQuery),
    client.fetch(historicalExplorerDatasetQuery, { datasetId: 'genesis-history' }).catch(() => null),
  ]);

  const formationLabel = [libro?.datazione?.etichettaInizio, libro?.datazione?.etichettaFine]
    .filter(Boolean)
    .join(' — ') || 'Processo compositivo pluristratificato, con fasi e datazioni discusse.';

  let dataset: HistoricalExplorerDataset;
  let dataSource: 'sanity' | 'fallback' = 'fallback';

  if (sanityDocument) {
    try {
      dataset = historicalExplorerDatasetFromSanity(sanityDocument);
      dataSource = 'sanity';
    } catch {
      dataset = fallbackDataset(formationLabel);
    }
  } else {
    dataset = fallbackDataset(formationLabel);
  }

  const diagnostics = diagnoseHistoricalDataset(dataset);
  const chapterContext = historicalDatasetForChapter(dataset, 'genesi', context.chapter);
  const displayDataset = chapterContext.dataset;
  const bookTitle = libro?.titolo || 'Genesi';
  const returnHref = context.chapter ? `/bibbia/genesi/${context.chapter}` : '/bibbia/genesi#studio';

  const entryLabel = chapterContext.contextualized
    ? `Contesto di Genesi ${context.chapter}`
    : context.source === 'chapter'
      ? `Aperto dal capitolo ${context.chapter ?? ''}`.trim()
      : context.source === 'history'
        ? 'Ripristino della scena storica'
        : 'Aperto dal contesto del libro';

  return (
    <AppShell>
      <StudyContextNav bookSlug="genesi" bookTitle={bookTitle} firstChapter={context.chapter || 1} active="history" historyAvailable />
      <main className="bg-paper-card/35">
        <section className="border-b border-papyrus-line bg-paper-card">
          <div className="mx-auto max-w-[1580px] px-5 py-8 md:px-8 md:py-10">
            <nav className="text-sm text-ink-faint" aria-label="Percorso">
              <Link href="/" className="hover:text-bronze">Bibbia</Link>
              <span className="mx-2">/</span>
              <Link href="/bibbia/genesi" className="hover:text-bronze">Genesi</Link>
              {context.chapter && <><span className="mx-2">/</span><Link href={`/bibbia/genesi/${context.chapter}`} className="hover:text-bronze">Capitolo {context.chapter}</Link></>}
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Storia</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Prospettiva · Storia</p>
                <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">{context.chapter ? `Genesi ${context.chapter} nella storia` : 'Esploratore storico · Genesi'}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-soft">{displayDataset.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-faint">
                  <span className={`rounded-full border px-3 py-1.5 ${chapterContext.contextualized ? 'border-bronze/45 bg-bronze/5 text-bronze' : 'border-papyrus-line bg-papyrus/60'}`}>{entryLabel}</span>
                  <span className={`rounded-full border px-3 py-1.5 ${dataSource === 'sanity' ? 'border-bronze/45 bg-bronze/5 text-bronze' : 'border-papyrus-line bg-papyrus/60 text-ink-faint'}`}>
                    Origine dati: {dataSource === 'sanity' ? 'archivio Sanity' : 'copia locale di riserva'}
                  </span>
                  {chapterContext.contextualized && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">{chapterContext.primaryEntityIds.length} relazioni direttamente collegate</span>}
                  {context.year !== undefined && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">Anno: {Math.abs(context.year)} {context.year < 0 ? 'a.C.' : 'd.C.'}</span>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ExplorerShareButton />
                <Link href={returnHref} className="rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze">← {context.chapter ? `Torna a Genesi ${context.chapter}` : 'Torna allo studio del libro'}</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1580px] px-3 pt-5 md:px-6 md:pt-8">
          <HistoricalDatasetMethodology diagnostics={diagnostics} />
        </section>

        <section className="mx-auto max-w-[1580px] px-3 py-5 md:px-6 md:py-8">
          <HistoricalExplorerShell dataset={displayDataset} originBookSlug="genesi" initialYear={context.year} initialEntityId={context.entity || chapterContext.primaryEntityIds[0]} syncUrlState />
        </section>
      </main>
    </AppShell>
  );
}
