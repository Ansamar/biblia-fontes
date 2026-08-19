import { client } from '../sanity/client';
import { bookAbbreviation, bookIdFromSlug, categoryLabel } from '../lib/bibleRouting';

type RawMacroSection = {
  capitoloInizio?: number;
  capitoloFine?: number;
  etichetta?: string;
  titolo?: string;
};

type RawChapter = {
  _id: string;
  numero: number;
  titolo?: string;
  sintesi?: unknown;
};

const query = `{
  "libro": *[_id == $bookId][0]{
    _id, titolo, titoloEbraico, categoriaId, capitoli, lingua, descrizione,
    mondoDietroIlTesto, mondoDelTesto, mondoAttornoAlTesto,
    profiloLetterario, macroSezioni, datazione,
    redazione[]{..., "fonte": fonte->{sigla, nome}}
  },
  "capitoli": *[_type == "capitolo" && libro._ref == $bookId] | order(numero asc){
    _id, numero, titolo, sintesi
  }
}`;

function text(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean).join(' · ') || fallback;
  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;
    return text(item.descrizione || item.etichetta || item.titolo || item.nome || item.nota, fallback);
  }
  return fallback;
}

function formation(datazione: any) {
  if (!datazione) return 'Datazione e formazione discusse';
  if (typeof datazione === 'string' || typeof datazione === 'number') return String(datazione);
  return [datazione.etichettaInizio, datazione.etichettaFine].filter(Boolean).join(' — ')
    || datazione.etichetta
    || datazione.nota
    || (datazione.inizio || datazione.fine ? `${datazione.inizio ?? '…'} – ${datazione.fine ?? '…'}` : 'Datazione e formazione discusse');
}

function levels(redazione: any) {
  if (!Array.isArray(redazione)) return text(redazione, 'Modelli critici disponibili nei capitoli');
  const values = redazione.map((item) => item?.fonte?.sigla || item?.etichetta || text(item)).filter(Boolean);
  return values.length ? values.slice(0, 5).join(' · ') : 'Modelli critici disponibili nei capitoli';
}

type ChapterGroup = {
  label: string;
  start: number;
  end: number;
  chapters: RawChapter[];
};

function contiguousGroups(chapters: RawChapter[], labelPrefix = 'Capitoli'): ChapterGroup[] {
  if (!chapters.length) return [];
  const sorted = [...chapters].sort((a, b) => a.numero - b.numero);
  const groups: RawChapter[][] = [];
  let current: RawChapter[] = [];
  for (const chapter of sorted) {
    if (!current.length || chapter.numero === current[current.length - 1].numero + 1) current.push(chapter);
    else { groups.push(current); current = [chapter]; }
  }
  if (current.length) groups.push(current);
  return groups.map((items) => ({
    label: items.length === 1 ? `Capitolo ${items[0].numero}` : labelPrefix,
    start: items[0].numero,
    end: items[items.length - 1].numero,
    chapters: items,
  }));
}

function completeSections(sections: RawMacroSection[], chapters: RawChapter[]) {
  const sortedSections = [...sections]
    .filter((section) => Number.isFinite(section.capitoloInizio))
    .sort((a, b) => Number(a.capitoloInizio) - Number(b.capitoloInizio));

  if (!sortedSections.length) return contiguousGroups(chapters);

  const assigned = new Set<number>();
  const groups: ChapterGroup[] = [];

  for (const section of sortedSections) {
    const start = Number(section.capitoloInizio);
    const end = Number.isFinite(section.capitoloFine) ? Number(section.capitoloFine) : start;
    const groupChapters = chapters.filter((chapter) => chapter.numero >= start && chapter.numero <= end && !assigned.has(chapter.numero));
    if (!groupChapters.length) continue;
    groupChapters.forEach((chapter) => assigned.add(chapter.numero));
    groups.push({
      label: section.etichetta || section.titolo || `Capitoli ${groupChapters[0].numero}–${groupChapters[groupChapters.length - 1].numero}`,
      start: groupChapters[0].numero,
      end: groupChapters[groupChapters.length - 1].numero,
      chapters: groupChapters,
    });
  }

  const uncovered = chapters.filter((chapter) => !assigned.has(chapter.numero));
  groups.push(...contiguousGroups(uncovered));
  return groups.sort((a, b) => a.start - b.start);
}

export async function fetchBookView(slug: string) {
  const bookId = bookIdFromSlug(slug);
  const data = await client.fetch(query, { bookId });
  if (!data?.libro) return null;

  const book = data.libro;
  const chapters: RawChapter[] = Array.isArray(data.capitoli) ? data.capitoli : [];
  const sections = completeSections(Array.isArray(book.macroSezioni) ? book.macroSezioni : [], chapters);

  return {
    slug,
    id: book._id,
    title: book.titolo,
    originalTitle: book.titoloEbraico || '',
    category: categoryLabel(book.categoriaId),
    abbreviation: bookAbbreviation(slug, book.titolo),
    chapterCount: book.capitoli || chapters.length,
    description: text(book.descrizione, 'Scheda introduttiva del libro.'),
    language: text(book.lingua, '—'),
    genre: text(book.profiloLetterario?.generePrincipale, '—'),
    formation: formation(book.datazione),
    levels: levels(book.redazione),
    literaryProfile: text(book.profiloLetterario?.strutturaGenerale),
    context: text(book.mondoDietroIlTesto) || text(book.mondoAttornoAlTesto),
    chapters,
    sections,
  };
}

export type BookView = NonNullable<Awaited<ReturnType<typeof fetchBookView>>>;
