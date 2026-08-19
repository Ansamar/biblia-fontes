import { client } from '../sanity/client';
import { historicalExplorerDatasetQuery } from '../historical-explorer/sanityQuery';
import { historicalExplorerDatasetFromSanity } from '../historical-explorer/sanityAdapter';
import { bookIdFromSlug } from '../lib/bibleRouting';

const bookQuery = `*[_id == $bookId][0]{_id,titolo,capitoli}`;

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
