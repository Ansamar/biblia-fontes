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

function nonOverlappingSections(sections: RawMacroSection[], chapters: RawChapter[]) {
  const sorted = [...sections]
    .filter((section) => Number.isFinite(section.capitoloInizio))
    .sort((a, b) => Number(a.capitoloInizio) - Number(b.capitoloInizio));

  if (!sorted.length) {
    return [{
      label: 'Capitoli',
      start: chapters[0]?.numero || 1,
      end: chapters.at(-1)?.numero || 1,
      chapters,
    }];
  }

  let previousEnd = 0;
  return sorted.flatMap((section) => {
    const sourceStart = Number(section.capitoloInizio || 1);
    const sourceEnd = Number(section.capitoloFine || sourceStart);
    const start = Math.max(sourceStart, previousEnd + 1);
    const end = Math.max(start, sourceEnd);
    previousEnd = end;
    const groupChapters = chapters.filter((chapter) => chapter.numero >= start && chapter.numero <= end);
    if (!groupChapters.length) return [];
    return [{
      label: section.etichetta || section.titolo || `Capitoli ${start}–${end}`,
      start,
      end,
      chapters: groupChapters,
    }];
  });
}

export async function fetchBookView(slug: string) {
  const bookId = bookIdFromSlug(slug);
  const data = await client.fetch(query, { bookId });
  if (!data?.libro) return null;

  const book = data.libro;
  const chapters: RawChapter[] = Array.isArray(data.capitoli) ? data.capitoli : [];
  const sections = nonOverlappingSections(Array.isArray(book.macroSezioni) ? book.macroSezioni : [], chapters);

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
