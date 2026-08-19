'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { categoryLabel } from '../lib/bibleRouting';

type Book = { _id: string; titolo: string; categoriaId?: string; datazione?: any };

function slug(id: string) { return id.replace(/^libro-/, ''); }
function text(value: any, fallback = 'Intervallo strutturato non disponibile'): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') return value.etichetta || value.descrizione || value.nota || [value.etichettaInizio, value.etichettaFine].filter(Boolean).join(' — ') || fallback;
  return fallback;
}
function numericRange(datazione: any) {
  if (!datazione || typeof datazione !== 'object') return null;
  const a = typeof datazione.inizio === 'number' ? datazione.inizio : null;
  const b = typeof datazione.fine === 'number' ? datazione.fine : null;
  if (a == null && b == null) return null;
  const start = a ?? b;
  const end = b ?? a;
  return start == null || end == null ? null : { start, end };
}

export default function CorpusFormationOverview({ books }: { books: Book[] }) {
  const [category, setCategory] = useState('tutti');
  const [query, setQuery] = useState('');
  const categories = useMemo(() => Array.from(new Set(books.map((book) => book.categoriaId).filter(Boolean) as string[])), [books]);
  const filtered = useMemo(() => books.filter((book) => (category === 'tutti' || book.categoriaId === category) && (!query || book.titolo.toLowerCase().includes(query.toLowerCase()))), [books, category, query]);
  const extent = useMemo(() => {
    const values = filtered.flatMap((book) => {
      const range = numericRange(book.datazione);
      return range ? [range.start, range.end] : [];
    });
    return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null;
  }, [filtered]);
  const position = (value: number) => !extent || extent.max === extent.min ? 50 : ((value - extent.min) / (extent.max - extent.min)) * 100;

  return <div>
    <div className="flex flex-col gap-4 rounded-2xl border border-papyrus-line bg-paper-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setCategory('tutti')} className={`rounded-full px-4 py-2 text-sm ${category === 'tutti' ? 'bg-ink text-papyrus' : 'border border-papyrus-line text-ink-soft'}`}>Tutti</button>{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm ${category === item ? 'bg-ink text-papyrus' : 'border border-papyrus-line text-ink-soft'}`}>{categoryLabel(item)}</button>)}</div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Filtra libri" placeholder="Filtra libri…" className="min-h-10 rounded-full border border-papyrus-line bg-papyrus px-4 text-sm outline-none focus:border-bronze" />
    </div>

    <div className="mt-6 rounded-xl border border-papyrus-line bg-paper-card/45 p-4 text-sm leading-6 text-ink-faint">Questa vista riguarda esclusivamente la formazione dei testi. Le fasce derivano dagli intervalli numerici registrati in Sanity e non rappresentano la data degli eventi narrati.</div>

    <div className="mt-6 space-y-3">{filtered.map((book) => {
      const range = numericRange(book.datazione);
      return <Link key={book._id} href={`/bibbia/${slug(book._id)}#timeline`} className="grid gap-3 rounded-xl border border-papyrus-line bg-paper-card/55 p-4 transition hover:border-bronze md:grid-cols-[170px_1fr]">
        <div><p className="font-serif text-xl font-bold">{book.titolo}</p><p className="mt-1 text-xs text-ink-faint">{categoryLabel(book.categoriaId)}</p></div>
        <div>{range && extent ? <><div className="relative mt-2 h-7 rounded-full bg-papyrus-deep/60"><span className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-bronze" style={{ left: `${Math.min(position(range.start), position(range.end))}%`, width: `${Math.max(2, Math.abs(position(range.end) - position(range.start)))}%` }} /></div><p className="mt-2 text-xs text-ink-faint">{text(book.datazione)}</p></> : <div className="rounded-lg border border-dashed border-papyrus-line px-4 py-3 text-sm text-ink-faint">{text(book.datazione)}</div>}</div>
      </Link>;
    })}</div>
    <p className="mt-5 text-sm text-ink-faint">{filtered.length} libri visualizzati.</p>
  </div>;
}
