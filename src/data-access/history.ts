import { client } from '../sanity/client';
import { historicalExplorerDatasetQuery } from '../historical-explorer/sanityQuery';
import { historicalExplorerDatasetFromSanity } from '../historical-explorer/sanityAdapter';
import { bookIdFromSlug, categoryLabel } from '../lib/bibleRouting';
import { canonicalBookOrder } from '../lib/canon';
import { canonicalHistoricalBookSlug, historicalDatasetIdCandidates } from '../lib/historicalRouting';
import { italianizeVisibleCopy } from '../lib/italianUi';

const bookQuery = `*[_id == $bookId][0]{_id,titolo,capitoli}`;
const historyDatasetResolverQuery = `*[_type == "historicalExplorerDataset" && (bookRef._ref == $bookId || id in $candidateIds)]{id,"direct":bookRef._ref == $bookId}`;

const historyIndexQuery = `*[_type == "historicalExplorerDataset"]{
  _id,
  id,
  title,
  subtitle,
  defaultRange{start,end},
  quickYears[],
  "bookId": bookRef._ref,
  "book": bookRef->{_id,titolo,categoriaId,ordine},
  "entities": entities[]->{
    id,
    label,
    type,
    epistemicStatus,
    temporal{start,end,precision}
  }
}`;

type HistoryIndexEntity = {
  id: string;
  label: string;
  type: string;
  epistemicStatus: string;
  start?: number;
  end?: number;
};

function slugFromDataset(item: any) {
  if (typeof item?.bookId === 'string') return canonicalHistoricalBookSlug(item.bookId);
  if (typeof item?.book?._id === 'string') return canonicalHistoricalBookSlug(item.book._id);
  if (typeof item?.id === 'string') return canonicalHistoricalBookSlug(item.id);
  return '';
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export async function fetchHistoryIndexView() {
  const raw = await client.fetch(historyIndexQuery).catch(() => []);
  const datasets = (Array.isArray(raw) ? raw : []).flatMap((item: any) => {
    const slug = slugFromDataset(item);
    if (!slug) return [];
    const entities: HistoryIndexEntity[] = (Array.isArray(item.entities) ? item.entities : []).map((entity: any) => {
      const start = entity?.temporal?.start;
      const end = entity?.temporal?.end;
      return {
        id: entity?.id || '',
        label: italianizeVisibleCopy(entity?.label || 'Entità storica'),
        type: entity?.type || 'event',
        epistemicStatus: entity?.epistemicStatus || 'debated',
        start: finite(start) ? start : undefined,
        end: finite(end) ? end : finite(start) ? start : undefined,
      };
    });
    const starts = entities.map((entity) => entity.start).filter(finite);
    const ends = entities.map((entity) => entity.end).filter(finite);
    const fallbackStart = item?.defaultRange?.start;
    const fallbackEnd = item?.defaultRange?.end;
    const start = starts.length ? Math.min(...starts) : finite(fallbackStart) ? fallbackStart : undefined;
    const end = ends.length ? Math.max(...ends) : finite(fallbackEnd) ? fallbackEnd : undefined;
    return [{
      id: item._id,
      datasetId: item.id,
      slug,
      title: italianizeVisibleCopy(item.book?.titolo || item.title || slug),
      category: categoryLabel(item.book?.categoriaId),
      order: canonicalBookOrder(slug, finite(item.book?.ordine) ? item.book.ordine : 999),
      subtitle: italianizeVisibleCopy(item.subtitle || ''),
      start,
      end,
      entities,
    }];
  }).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'it'));

  const datedStarts = datasets.map((item) => item.start).filter(finite);
  const datedEnds = datasets.map((item) => item.end).filter(finite);

  return {
    datasets,
    range: [datedStarts.length ? Math.min(...datedStarts) : -2000, datedEnds.length ? Math.max(...datedEnds) : 200] as [number, number],
  };
}

export async function fetchHistoryView(slug: string) {
  const bookId = bookIdFromSlug(slug);
  const candidateIds = historicalDatasetIdCandidates(slug);
  const [book, candidates] = await Promise.all([
    client.fetch(bookQuery, { bookId }),
    client.fetch(historyDatasetResolverQuery, { bookId, candidateIds }).catch(() => []),
  ]);
  const options = Array.isArray(candidates) ? candidates : [];
  const resolved = options.find((item: any) => item?.direct) || options[0];
  const datasetId = resolved?.id;
  const rawDataset = datasetId ? await client.fetch(historicalExplorerDatasetQuery, { datasetId }).catch(() => null) : null;
  if (!book || !rawDataset) return null;

  try {
    const dataset = historicalExplorerDatasetFromSanity(rawDataset);
    return {
      slug,
      bookTitle: italianizeVisibleCopy(book.titolo || slug),
      chapterCount: book.capitoli || 0,
      dataset: {
        ...dataset,
        title: italianizeVisibleCopy(dataset.title),
        subtitle: italianizeVisibleCopy(dataset.subtitle),
        entities: dataset.entities.map((entity) => ({
          ...entity,
          label: italianizeVisibleCopy(entity.label),
          summary: italianizeVisibleCopy(entity.summary),
          relations: entity.relations.map((relation) => ({ ...relation, label: italianizeVisibleCopy(relation.label) })),
        })),
        scenarios: dataset.scenarios?.map((scenario) => ({ ...scenario, title: italianizeVisibleCopy(scenario.title), summary: italianizeVisibleCopy(scenario.summary) })),
      },
    };
  } catch {
    return null;
  }
}

export type HistoryView = NonNullable<Awaited<ReturnType<typeof fetchHistoryView>>>;
export type HistoryIndexView = Awaited<ReturnType<typeof fetchHistoryIndexView>>;
