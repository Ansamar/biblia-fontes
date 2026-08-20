import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import ExplorerShareButton from '../../../src/components/ExplorerShareButton';
import HistoricalDatasetMethodology from '../../../src/components/HistoricalDatasetMethodology';
import HistoricalExplorerShell from '../../../src/components/HistoricalExplorerShell';
import StudyContextNav from '../../../src/components/StudyContextNav';
import { diagnoseHistoricalDataset } from '../../../src/historical-explorer/diagnostics';
import { historicalDatasetForChapter } from '../../../src/historical-explorer/chapterContext';
import { historicalExplorerDatasetFromSanity } from '../../../src/historical-explorer/sanityAdapter';
import { historicalExplorerDatasetQuery } from '../../../src/historical-explorer/sanityQuery';
import { bookIdFromSlug } from '../../../src/lib/bibleRouting';
import { historicalDatasetIdCandidates } from '../../../src/lib/historicalRouting';
import { italianizeVisibleCopy } from '../../../src/lib/italianUi';
import { client } from '../../../src/sanity/client';
import { parseStudyContext } from '../../../src/study-context/context';

const bookQuery = `*[_id == $bookId][0]{_id,titolo,capitoli}`;
const resolverQuery = `*[_type == "historicalExplorerDataset" && (bookRef._ref == $bookId || id in $candidateIds)]{id,"direct":bookRef._ref == $bookId}`;

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
  const candidateIds = historicalDatasetIdCandidates(slug);

  const [libro, candidates] = await Promise.all([
    client.fetch(bookQuery, { bookId }),
    client.fetch(resolverQuery, { bookId, candidateIds }).catch(() => []),
  ]);

  const options = Array.isArray(candidates) ? candidates : [];
  const resolved = options.find((item: any) => item?.direct) || options[0];
  const datasetId = resolved?.id;
  const sanityDocument = datasetId ? await client.fetch(historicalExplorerDatasetQuery, { datasetId }).catch(() => null) : null;

  if (!libro || !sanityDocument) notFound();

  let dataset;
  try {
    const raw = historicalExplorerDatasetFromSanity(sanityDocument);
    dataset = {
      ...raw,
      title: italianizeVisibleCopy(raw.title),
      subtitle: italianizeVisibleCopy(raw.subtitle),
      entities: raw.entities.map((entity) => ({
        ...entity,
        label: italianizeVisibleCopy(entity.label),
        summary: italianizeVisibleCopy(entity.summary),
        relations: entity.relations.map((relation) => ({ ...relation, label: italianizeVisibleCopy(relation.label) })),
      })),
      scenarios: raw.scenarios?.map((scenario) => ({ ...scenario, title: italianizeVisibleCopy(scenario.title), summary: italianizeVisibleCopy(scenario.summary) })),
    };
  } catch {
    notFound();
  }

  const diagnostics = diagnoseHistoricalDataset(dataset);
  const chapterContext = historicalDatasetForChapter(dataset, slug, context.chapter);
  const displayDataset = chapterContext.dataset;
  const bookTitle = italianizeVisibleCopy(libro.titolo || slug);
  const returnHref = context.chapter ? `/bibbia/${slug}/${context.chapter}` : `/bibbia/${slug}#studio`;

  const entryLabel = chapterContext.contextualized
    ? `Contesto di ${bookTitle} ${context.chapter}`
    : context.source === 'chapter'
      ? `Aperto dal capitolo ${context.chapter ?? ''}`.trim()
      : context.source === 'history'
        ? 'Ripristino della scena storica'
        : 'Aperto dal contesto del libro';

  return (
    <AppShell>
      <StudyContextNav bookSlug={slug} bookTitle={bookTitle} firstChapter={context.chapter || 1} active="history" historyAvailable />
      <main className="bg-paper-card/35">
        <section className="border-b border-papyrus-line bg-paper-card">
          <div className="mx-auto max-w-[1580px] px-5 py-8 md:px-8 md:py-10">
            <nav className="text-sm text-ink-faint" aria-label="Percorso">
              <Link href="/" className="hover:text-bronze">Bibbia</Link>
              <span className="mx-2">/</span>
              <Link href={`/bibbia/${slug}`} className="hover:text-bronze">{bookTitle}</Link>
              {context.chapter && <><span className="mx-2">/</span><Link href={`/bibbia/${slug}/${context.chapter}`} className="hover:text-bronze">Capitolo {context.chapter}</Link></>}
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Storia</span>
            </nav>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Prospettiva · Storia</p>
                <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">{context.chapter ? `${bookTitle} ${context.chapter} nella storia` : `Esploratore storico · ${bookTitle}`}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-soft">{displayDataset.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-faint">
                  <span className={`rounded-full border px-3 py-1.5 ${chapterContext.contextualized ? 'border-bronze/45 bg-bronze/5 text-bronze' : 'border-papyrus-line bg-papyrus/60'}`}>{entryLabel}</span>
                  {chapterContext.contextualized && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">{chapterContext.primaryEntityIds.length} relazioni direttamente collegate</span>}
                  {context.year !== undefined && <span className="rounded-full border border-papyrus-line bg-papyrus/60 px-3 py-1.5">Anno: {Math.abs(context.year)} {context.year < 0 ? 'a.C.' : 'd.C.'}</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ExplorerShareButton />
                <Link href={returnHref} className="rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze">← {context.chapter ? `Torna a ${bookTitle} ${context.chapter}` : 'Torna allo studio del libro'}</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1580px] px-3 pt-5 md:px-6 md:pt-8">
          <HistoricalDatasetMethodology diagnostics={diagnostics} />
        </section>

        <section className="mx-auto max-w-[1580px] px-3 py-5 md:px-6 md:py-8">
          <HistoricalExplorerShell dataset={displayDataset} originBookSlug={slug} initialYear={context.year} initialEntityId={context.entity || chapterContext.primaryEntityIds[0]} syncUrlState />
        </section>
      </main>
    </AppShell>
  );
}
