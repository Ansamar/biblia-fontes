'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CorpusView } from '../data-access/corpus';

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function HomeSurface({ corpus }: { corpus: CorpusView }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return corpus.books.filter((book) => normalize(book.title).includes(q) || normalize(book.originalTitle || '').includes(q)).slice(0, 12);
  }, [query, corpus.books]);

  return <main>
    <section className="border-b border-papyrus-line">
      <div className="mx-auto max-w-[1320px] px-5 py-14 md:px-8 md:py-20">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-bronze">Biblia Fontes</p>
        <h1 className="mt-4 max-w-5xl font-serif text-5xl font-semibold leading-[0.96] md:text-7xl">La Scrittura come spazio di ricerca.</h1>
        <p className="reading-text mt-6 max-w-[74ch] text-ink-soft">Testo, tradizioni, studio critico e storia restano collegati allo stesso libro e allo stesso capitolo.</p>

        <div className="mt-11 grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end">
          <div className="relative max-w-3xl">
            <label htmlFor="rebuild-search" className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">Vai a un libro</label>
            <input id="rebuild-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Genesi, Isaia, Romani…" className="mt-1 w-full border-0 border-b border-papyrus-line bg-transparent px-0 py-3 font-serif text-2xl text-ink outline-none transition placeholder:text-ink-faint/55 focus:border-bronze" />
            {query && <div className="absolute left-0 right-0 top-full z-20 border-x border-b border-papyrus-line bg-papyrus shadow-xl">{results.length ? results.map((book) => <Link key={book.id} href={`/rebuild/bibbia/${book.slug}`} className="grid grid-cols-[1fr_auto] gap-4 border-t border-papyrus-line px-4 py-3 hover:bg-paper-card/60"><span className="font-serif text-lg">{book.title}</span><span className="text-xs text-ink-faint">{book.chapterCount} cap. →</span></Link>) : <p className="px-4 py-4 text-sm text-ink-faint">Nessun libro trovato.</p>}</div>}
          </div>
          <div className="border-l border-papyrus-line pl-5"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Altra prospettiva</p><Link href="/rebuild/historical-explorer" className="mt-2 inline-flex font-serif text-xl font-semibold text-ink hover:text-bronze">Interroga la storia →</Link></div>
        </div>
      </div>
    </section>

    <section id="bibbia" className="mx-auto max-w-[1320px] px-5 py-11 md:px-8 md:py-14">
      <div className="grid gap-9 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <header><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Corpus</p><h2 className="mt-2 font-serif text-3xl font-semibold">Bibbia</h2><p className="mt-3 text-xs leading-5 text-ink-faint">Ordine canonico.</p></header>
        <div className="border-t border-papyrus-line">{corpus.sections.map((section) => <section key={section.name} className="grid gap-5 border-b border-papyrus-line py-7 md:grid-cols-[180px_minmax(0,1fr)] md:gap-7"><header><h3 className="font-serif text-xl font-semibold">{section.name}</h3><p className="mt-1 text-[10px] text-ink-faint">{section.books.length} libri</p></header><div className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">{section.books.map((book) => <Link key={book.id} href={`/rebuild/bibbia/${book.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-papyrus-line/70 py-2.5"><span className="font-serif text-[1.02rem] text-ink-soft group-hover:text-ink">{book.title}</span><span className="shrink-0 font-mono text-[9px] text-ink-faint group-hover:text-bronze">{book.chapterCount}</span></Link>)}</div></section>)}</div>
      </div>
    </section>
  </main>;
}
