import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import ExplorerShareButton from '../../../src/components/ExplorerShareButton';
import HistoricalDatasetMethodology from '../../../src/components/HistoricalDatasetMethodology';
import HistoricalExplorerShell from '../../../src/components/HistoricalExplorerShell';
import StudyContextNav from '../../../src/components/StudyContextNav';
import { diagnoseHistoricalDataset } from '../../../src/historical-explorer/diagnostics';
import { historicalExplorerDatasetFromSanity } from '../../../src/historical-explorer/sanityAdapter';
import { historicalExplorerDatasetQuery } from '../../../src/historical-explorer/sanityQuery';
import { bookIdFromSlug } from '../../../src/lib/bibleRouting';
import { client } from '../../../src/sanity/client';
import { parseStudyContext } from '../../../src/study-context/context';

const bookQuery = `*[_id == $bookId][0]{_id,titolo,capitoli}`;
const resolverQuery = `*[_type == "historicalExplorerDataset" && (bookRef._ref == $bookId || id == $legacyId)]{id,"direct":bookRef._ref == $bookId}`;

export default async function DynamicHistoricalExplorerPage({
  params,
  searchParams,
}: {
  params: Promise<{ libro: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { libro: slug } = await params;
  if (slug === 'genesi') notFound();

  const context = parseStudyContext(await searchParams);
  const bookId = bookIdFromSlug(slug);
  const legacyId = `${slug}-history`;

  const [libro, candidates] = await Promise.all([
    client.fetch(bookQuery, { bookId }),
    client.fetch(resolverQuery, { bookId, legacyId }).catch(() => []),
  ]);

  const options = Array.isArray(candidates) ? candidates : [];
  const resolved = options.find((item: any) => item?.direct) || options[0];
  const datasetId = resolved?.id;
  const sanityDocument = datasetId ? await client.fetch(historicalExplorerDatasetQuery, { datasetId }).catch(() => null) : null;

  if (!libro || !sanityDocument) notFound();

  let dataset;
  try {
    dataset = historicalExplorerDatasetFromSanity(sanityDocument);
  } catch {
    notFound();
  }

  const diagnostics = diagnoseHistoricalDataset(dataset);
  const bookTitle = libro.titolo || slug;

  const entryLabel = context.source === 'chapter'
    ? `Aperto dal capitolo ${context.chapter ?? ''}`.trim()
    : context.source === 'history'
      ? 'Ripristino della scena storica'
      : 'Aperto dal contesto del libro';

  return (
    <AppShell>
      <StudyContextNav bookSlug={slug} bookTitle={bookTitle} firstChapter={1} active="history" historyAvailable />
      <main className="bg-paper-card/35">
        <section className="border-b border-papyrus-line bg-paper-card">
          <div className="mx-auto max-w-[1580px] px-5 py-8 md:px-8 md:py-10">
            <nav className="text-sm text-ink-faint" aria-label="Percorso">
              <Link href="/" className="hover:text-bronze">Bibbia</Link>
              <span className="mx-2">/</span>
              <Link href={`/bibbia/${slug}`} className="hover:text-bronze">{bookTitle}</Link>
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Storia</span>
            </nav>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Prospettiva · Storia</p>
                <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">Esploratore storico · {bookTitle}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-soft">{dataset.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-faint">
                  <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">{entryLabel}</span>
                  <span className="rounded-full border border-bronze/45 bg-bronze/5 px-3 py-1.5 text-bronze">Origine dati: archivio Sanity</span>
                  {context.year !== undefined && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">Anno richiesto: {Math.abs(context.year)} {context.year < 0 ? 'a.C.' : 'd.C.'}</span>}
                  {context.entity && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">Entità: {context.entity}</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ExplorerShareButton />
                <Link href={`/bibbia/${slug}#studio`} className="rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze">← Torna allo studio del libro</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1580px] px-3 pt-5 md:px-6 md:pt-8">
          <HistoricalDatasetMethodology diagnostics={diagnostics} />
        </section>

        <section className="mx-auto max-w-[1580px] px-3 py-5 md:px-6 md:py-8">
          <HistoricalExplorerShell dataset={dataset} originBookSlug={slug} initialYear={context.year} initialEntityId={context.entity} syncUrlState />
        </section>
      </main>
    </AppShell>
  );
}
