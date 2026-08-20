'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { categoryLabel } from '../lib/bibleRouting';

type Book = { _id: string; titolo: string; categoriaId?: string; datazione?: any };
type Range = { start: number; end: number };

function slug(id: string) { return id.replace(/^libro-/, ''); }

function numericRange(datazione: any): Range | null {
  if (!datazione || typeof datazione !== 'object') return null;
  const a = typeof datazione.inizio === 'number' ? datazione.inizio : null;
  const b = typeof datazione.fine === 'number' ? datazione.fine : null;
  if (a == null && b == null) return null;
  const start = a ?? b;
  const end = b ?? a;
  if (start == null || end == null) return null;
  return { start: Math.min(start, end), end: Math.max(start, end) };
}

function yearLabel(year: number) {
  if (year < 0) return `${Math.abs(Math.round(year))} a.C.`;
  if (year > 0) return `${Math.round(year)} d.C.`;
  return '1 a.C./1 d.C.';
}

function rangeLabel(range: Range) {
  if (range.start === range.end) return `circa ${yearLabel(range.start)}`;
  if (range.start < 0 && range.end < 0) return `${Math.abs(Math.round(range.start))}–${Math.abs(Math.round(range.end))} a.C.`;
  if (range.start > 0 && range.end > 0) return `${Math.round(range.start)}–${Math.round(range.end)} d.C.`;
  return `${yearLabel(range.start)} – ${yearLabel(range.end)}`;
}

function note(datazione: any) {
  if (!datazione || typeof datazione !== 'object') return '';
  return datazione.etichetta || datazione.descrizione || datazione.nota || '';
}

export default function CorpusFormationOverview({ books }: { books: Book[] }) {
  const [query, setQuery] = useState('');

  const dated = useMemo(() => books
    .map((book) => ({ book, range: numericRange(book.datazione) }))
    .filter((item): item is { book: Book; range: Range } => Boolean(item.range))
    .filter(({ book }) => !query || book.titolo.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end || a.book.titolo.localeCompare(b.book.titolo, 'it')),
  [books, query]);

  const undated = useMemo(() => books
    .filter((book) => !numericRange(book.datazione))
    .filter((book) => !query || book.titolo.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.titolo.localeCompare(b.titolo, 'it')),
  [books, query]);

  const extent = useMemo(() => {
    if (!dated.length) return null;
    return {
      min: Math.min(...dated.map(({ range }) => range.start)),
      max: Math.max(...dated.map(({ range }) => range.end)),
    };
  }, [dated]);

  const position = (value: number) => !extent || extent.max === extent.min ? 50 : ((value - extent.min) / (extent.max - extent.min)) * 100;
  const ticks = useMemo(() => {
    if (!extent) return [];
    const count = 6;
    return Array.from({ length: count }, (_, index) => extent.min + ((extent.max - extent.min) * index) / (count - 1));
  }, [extent]);

  return <div>
    <div className="flex flex-col gap-4 border-y border-papyrus-line py-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-bronze">Ordine cronologico</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">I libri sono disposti secondo l’inizio dell’intervallo di formazione attribuito alla loro composizione, non secondo l’ordine canonico.</p>
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Cerca un libro" placeholder="Cerca un libro…" className="min-h-10 w-full rounded-full border border-papyrus-line bg-papyrus px-4 text-sm outline-none focus:border-bronze md:w-56" />
    </div>

    {extent && <div className="mt-8 hidden md:block" aria-hidden="true">
      <div className="relative h-8 border-b border-papyrus-line">
        {ticks.map((tick) => <span key={tick} className="absolute bottom-2 -translate-x-1/2 text-[11px] tabular-nums text-ink-faint" style={{ left: `${position(tick)}%` }}>{yearLabel(tick)}</span>)}
      </div>
    </div>}

    <div className="mt-3 divide-y divide-papyrus-line border-y border-papyrus-line">
      {dated.map(({ book, range }) => {
        const description = note(book.datazione);
        const left = Math.min(position(range.start), position(range.end));
        const width = Math.max(1.25, Math.abs(position(range.end) - position(range.start)));
        return <Link key={book._id} href={`/bibbia/${slug(book._id)}`} className="group grid gap-3 py-5 transition md:grid-cols-[210px_1fr] md:items-center">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-serif text-xl font-bold transition group-hover:text-bronze">{book.titolo}</p>
              <p className="text-[11px] text-ink-faint md:hidden">{categoryLabel(book.categoriaId)}</p>
            </div>
            <p className="mt-1 font-mono text-xs font-semibold tracking-wide text-bronze">{rangeLabel(range)}</p>
            <p className="mt-1 hidden text-xs text-ink-faint md:block">{categoryLabel(book.categoriaId)}</p>
          </div>
          <div>
            {extent && <div className="relative h-6">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-papyrus-line" />
              <span className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-bronze transition-all group-hover:h-3.5" style={{ left: `${left}%`, width: `${width}%` }} />
            </div>}
            {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-ink-soft">{description}</p>}
          </div>
        </Link>;
      })}
    </div>

    {dated.length === 0 && <p className="py-10 text-sm text-ink-faint">Nessun libro corrisponde alla ricerca.</p>}

    {undated.length > 0 && <details className="mt-8 border-t border-papyrus-line pt-5">
      <summary className="cursor-pointer text-sm font-semibold text-ink-soft">Libri senza un intervallo numerico definito ({undated.length})</summary>
      <div className="mt-4 flex flex-wrap gap-2">{undated.map((book) => <Link key={book._id} href={`/bibbia/${slug(book._id)}`} className="rounded-full border border-papyrus-line px-3 py-1.5 text-sm text-ink-soft hover:border-bronze hover:text-ink">{book.titolo}</Link>)}</div>
    </details>}
  </div>;
}
