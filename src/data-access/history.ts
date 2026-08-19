import { client } from '../sanity/client';
import { historicalExplorerDatasetQuery } from '../historical-explorer/sanityQuery';
import { historicalExplorerDatasetFromSanity } from '../historical-explorer/sanityAdapter';
import { bookIdFromSlug, categoryLabel } from '../lib/bibleRouting';
import { canonicalBookOrder } from '../lib/canon';

const bookQuery = `*[_id == $bookId][0]{_id,titolo,capitoli}`;

const historyIndexQuery = `*[_type == "historicalExplorerDataset"]{
  _id,
  id,
  title,
  subtitle,
  defaultRange{start,end},
  quickYears[],
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
  if (item?.book?._id?.startsWith('libro-')) return item.book._id.slice('libro-'.length);
  if (typeof item?.id === 'string' && item.id.endsWith('-history')) return item.id.slice(0, -'-history'.length);
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
    const entities: HistoryIndexEntity[] = (Array.isArray(item.entities) ? item.entities : []).flatMap((entity: any) => {
      const start = entity?.temporal?.start;
      const end = entity?.temporal?.end;
      return [{
        id: entity?.id || '',
        label: entity?.label || 'Entità storica',
        type: entity?.type || 'event',
        epistemicStatus: entity?.epistemicStatus || 'debated',
        start: finite(start) ? start : undefined,
        end: finite(end) ? end : finite(start) ? start : undefined,
      }];
    });
    const starts = entities.map((entity: HistoryIndexEntity) => entity.start).filter(finite);
    const ends = entities.map((entity: HistoryIndexEntity) => entity.end).filter(finite);
    const fallbackStart = item?.defaultRange?.start;
    const fallbackEnd = item?.defaultRange?.end;
    const start = starts.length ? Math.min(...starts) : finite(fallbackStart) ? fallbackStart : undefined;
    const end = ends.length ? Math.max(...ends) : finite(fallbackEnd) ? fallbackEnd : undefined;
    return [{
      id: item._id,
      datasetId: item.id,
      slug,
      title: item.book?.titolo || item.title || slug,
      category: categoryLabel(item.book?.categoriaId),
      order: canonicalBookOrder(slug, finite(item.book?.ordine) ? item.book.ordine : 999),
      subtitle: item.subtitle || '',
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
  const datasetId = `${slug}-history`;
  const [book, rawDataset] = await Promise.all([
    client.fetch(bookQuery, { bookId }),
    client.fetch(historicalExplorerDatasetQuery, { datasetId }).catch(() => null),
  ]);
  if (!book || !rawDataset) return null;

  try {
    return {
      slug,
      bookTitle: book.titolo || slug,
      chapterCount: book.capitoli || 0,
      dataset: historicalExplorerDatasetFromSanity(rawDataset),
    };
  } catch {
    return null;
  }
}

export type HistoryView = NonNullable<Awaited<ReturnType<typeof fetchHistoryView>>>;
export type HistoryIndexView = Awaited<ReturnType<typeof fetchHistoryIndexView>>;
