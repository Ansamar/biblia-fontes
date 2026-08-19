import { client } from '../sanity/client';
import { bookAbbreviation, bookIdFromSlug, categoryLabel } from '../lib/bibleRouting';
import type { BiblicalTextUnit } from '../components/BiblicalTextReader';
import { textFixtureFor } from '../data/textFixtures';

type ReaderWitness = BiblicalTextUnit & { _id?: string };

const query = `{
  "libro": *[_id == $bookId][0]{_id, titolo, categoriaId, capitoli},
  "capitolo": *[_type == "capitolo" && libro._ref == $bookId && numero == $numero][0]{
    _id, numero, titolo, sintesi, struttura, analisiLetteraria, analisiStoricoCritica,
    tradizione, redazione, contestoStorico, testoCritico,
    attribuzioniFonti[]{..., "fonte": fonte->{_id, sigla, nome, titolo, categoria, descrizione}},
    bibliografia
  },
  "testiBiblici": *[_type == "testoBiblicoCapitolo" && libro._ref == $bookId && numero == $numero]{
    _id, numero, numeroAlternativo, edizione, lingua, tradizione, testimone, direzione,
    versetti[]{_key, numero, testo, metatesto, marcatoreAlfabetico, riferimentoAlternativo, statoTestuale, notaEditoriale, apparatoMasoretico}
  }
}`;

function text(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean).join(' · ') || fallback;
  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;
    return text(item.descrizione || item.motivazione || item.etichetta || item.citazione || item.titolo || item.nome || item.nota, fallback);
  }
  return fallback;
}

const normalized = (value?: string) => (value || '').trim().toLocaleLowerCase('it-IT');

function witnessPriority(item: ReaderWitness) {
  const language = normalized(item.lingua);
  const tradition = normalized(item.tradizione);
  const edition = normalized(item.edizione);
  if (language === 'it' || tradition.includes('cei') || edition.includes('cei')) return 0;
  if (language === 'he' || tradition === 'mt' || tradition.includes('masoret')) return 1;
  if (language === 'grc' || tradition.includes('lxx') || edition.includes('settanta')) return 2;
  if (language === 'la' || tradition.includes('vulg')) return 3;
  return 4;
}

function fingerprint(item: ReaderWitness) {
  return (item.versetti || []).map((verse) => `${verse.numero}:${normalized(verse.testo)}`).join('|');
}

function witnesses(items: ReaderWitness[]) {
  const seen = new Set<string>();
  return items
    .filter((item) => {
      const key = [normalized(item.tradizione), normalized(item.lingua), normalized(item.edizione), fingerprint(item)].join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => witnessPriority(a) - witnessPriority(b));
}

export async function fetchChapterView(slug: string, numero: number) {
  const bookId = bookIdFromSlug(slug);
  const data = await client.fetch(query, { bookId, numero });
  if (!data?.libro || !data?.capitolo) return null;

  const fixture = textFixtureFor(slug, numero);
  const sanityWitnesses: ReaderWitness[] = Array.isArray(data.testiBiblici) ? data.testiBiblici : [];
  const hasItalian = sanityWitnesses.some((item) => witnessPriority(item) === 0);
  const orderedWitnesses = witnesses([...(!hasItalian && fixture ? [fixture] : []), ...sanityWitnesses]);
  const chapter = data.capitolo;
  const book = data.libro;

  return {
    slug,
    bookTitle: book.titolo,
    category: categoryLabel(book.categoriaId),
    abbreviation: bookAbbreviation(slug, book.titolo),
    number: numero,
    totalChapters: book.capitoli || numero,
    title: chapter.titolo || `Capitolo ${numero}`,
    summary: text(chapter.sintesi, 'Sintesi didattica in preparazione.'),
    structure: text(chapter.struttura) || text(chapter.analisiLetteraria?.storiaCompositiva) || text(chapter.analisiLetteraria?.strutturaPoetica),
    context: text(chapter.contestoStorico),
    formation: text(chapter.tradizione) || text(chapter.redazione),
    critical: text(chapter.analisiStoricoCritica),
    textual: text(chapter.testoCritico),
    sourceLayers: Array.isArray(chapter.attribuzioniFonti) ? chapter.attribuzioniFonti : [],
    bibliography: Array.isArray(chapter.bibliografia) ? chapter.bibliografia : [],
    biblicalText: orderedWitnesses.length ? { ...orderedWitnesses[0], witnesses: orderedWitnesses } : null,
  };
}

export type ChapterView = NonNullable<Awaited<ReturnType<typeof fetchChapterView>>>;
