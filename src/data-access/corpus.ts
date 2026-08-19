import { client } from '../sanity/client';
import { categoryLabel, slugFromBookId } from '../lib/bibleRouting';

const query = `*[_type == "libro"] | order(ordine asc){_id,titolo,titoloEbraico,categoriaId,capitoli,ordine}`;

const sectionOrder = [
  'Pentateuco',
  'Libri storici',
  'Sapienziali e poetici',
  'Profeti',
  'Vangeli',
  'Atti degli Apostoli',
  'Lettere Paoline',
  'Ebrei',
  'Lettere Cattoliche',
  'Apocalisse',
];

function normalizedSection(categoryId?: string, title?: string) {
  const id = (categoryId || '').toLowerCase();
  if (id === 'pentateuco') return 'Pentateuco';
  if (id === 'storici') return 'Libri storici';
  if (['sapienziali', 'sapienziali-poetici'].includes(id)) return 'Sapienziali e poetici';
  if (['profetici', 'profeti'].includes(id)) return 'Profeti';
  if (id === 'vangeli') return 'Vangeli';
  if (id === 'atti') return 'Atti degli Apostoli';
  if (['paoline', 'lettere-paoline'].includes(id)) return 'Lettere Paoline';
  if (id === 'ebrei') return 'Ebrei';
  if (['cattoliche', 'lettere-cattoliche'].includes(id)) return 'Lettere Cattoliche';
  if (['apocalisse', 'apocalittica'].includes(id) || (title || '').toLowerCase().includes('apocalisse')) return 'Apocalisse';
  return categoryLabel(categoryId) || 'Altri libri';
}

export async function fetchCorpusView() {
  const books = await client.fetch(query);
  const normalized = (Array.isArray(books) ? books : []).map((book: any) => ({
    id: book._id,
    slug: slugFromBookId(book._id),
    title: book.titolo,
    originalTitle: book.titoloEbraico || '',
    category: normalizedSection(book.categoriaId, book.titolo),
    chapterCount: book.capitoli || 0,
    order: book.ordine ?? 999,
  }));

  const sections = sectionOrder.map((name) => ({
    name,
    books: normalized.filter((book: any) => book.category === name),
  })).filter((section) => section.books.length);

  const known = new Set(sectionOrder);
  const extraNames = [...new Set(normalized.map((book: any) => book.category).filter((name: string) => !known.has(name)))];
  for (const name of extraNames) {
    sections.push({ name, books: normalized.filter((book: any) => book.category === name) });
  }

  return { books: normalized, sections };
}

export type CorpusView = Awaited<ReturnType<typeof fetchCorpusView>>;
