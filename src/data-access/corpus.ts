import { client } from '../sanity/client';
import { categoryLabel, slugFromBookId } from '../lib/bibleRouting';

const query = `*[_type == "libro"]{_id,titolo,titoloEbraico,categoriaId,capitoli,ordine}`;

const canonical = [
  'genesi','esodo','levitico','numeri','deuteronomio','giosue','giudici','rut','1-samuele','2-samuele','1-re','2-re','1-cronache','2-cronache','esdra','neemia','tobia','giuditta','ester','1-maccabei','2-maccabei',
  'giobbe','salmi','proverbi','qoelet','cantico-dei-cantici','sapienza','siracide',
  'isaia','geremia','lamentazioni','baruc','ezechiele','daniele','osea','gioele','amos','abdia','giona','michea','naum','abacuc','sofonia','aggeo','zaccaria','malachia',
  'matteo','marco','luca','giovanni','atti','romani','1-corinti','2-corinti','galati','efesini','filippesi','colossesi','1-tessalonicesi','2-tessalonicesi','1-timoteo','2-timoteo','tito','filemone','ebrei','giacomo','1-pietro','2-pietro','1-giovanni','2-giovanni','3-giovanni','giuda','apocalisse',
];
const canonicalOrder = new Map(canonical.map((slug, index) => [slug, index + 1]));

const sectionOrder = ['Pentateuco','Libri storici','Sapienziali e poetici','Profeti','Vangeli','Atti degli Apostoli','Lettere Paoline','Ebrei','Lettere Cattoliche','Apocalisse'];

function normalizedSection(categoryId?: string, title?: string) {
  const id = (categoryId || '').toLowerCase();
  if (id === 'pentateuco') return 'Pentateuco';
  if (id === 'storici') return 'Libri storici';
  if (['sapienziali','sapienziali-poetici'].includes(id)) return 'Sapienziali e poetici';
  if (['profetici','profeti'].includes(id)) return 'Profeti';
  if (id === 'vangeli') return 'Vangeli';
  if (id === 'atti') return 'Atti degli Apostoli';
  if (['paoline','lettere-paoline'].includes(id)) return 'Lettere Paoline';
  if (id === 'ebrei') return 'Ebrei';
  if (['cattoliche','lettere-cattoliche'].includes(id)) return 'Lettere Cattoliche';
  if (['apocalisse','apocalittica'].includes(id) || (title || '').toLowerCase().includes('apocalisse')) return 'Apocalisse';
  return categoryLabel(categoryId) || 'Altri libri';
}

export async function fetchCorpusView() {
  const books = await client.fetch(query);
  const normalized = (Array.isArray(books) ? books : []).map((book: any) => {
    const slug = slugFromBookId(book._id);
    return {
      id: book._id,
      slug,
      title: book.titolo,
      originalTitle: book.titoloEbraico || '',
      category: normalizedSection(book.categoriaId, book.titolo),
      chapterCount: book.capitoli || 0,
      order: canonicalOrder.get(slug) ?? book.ordine ?? 999,
    };
  }).sort((a: any, b: any) => a.order - b.order || a.title.localeCompare(b.title, 'it'));

  const sections = sectionOrder.map((name) => ({ name, books: normalized.filter((book: any) => book.category === name) })).filter((section) => section.books.length);
  const known = new Set(sectionOrder);
  const extraNames = [...new Set(normalized.map((book: any) => book.category).filter((name: string) => !known.has(name)))];
  for (const name of extraNames) sections.push({ name, books: normalized.filter((book: any) => book.category === name) });
  return { books: normalized, sections };
}

export type CorpusView = Awaited<ReturnType<typeof fetchCorpusView>>;
