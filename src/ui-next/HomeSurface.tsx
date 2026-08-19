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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Biblia Fontes</p>
            <h1 className="mt-4 max-w-4xl font-serif text-6xl font-semibold leading-[0.94] md:text-8xl">La Scrittura come spazio di ricerca.</h1>
            <p className="reading-text mt-7 max-w-[70ch] text-ink-soft">Il libro e il capitolo restano il contesto. Testo, confronto, studio, fonti e storia sono prospettive dello stesso corpus, non strumenti separati.</p>
          </div>
          <aside className="border-l border-papyrus-line pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Accessi</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/rebuild/bibbia/genesi" className="block font-semibold text-ink hover:text-bronze">Genesi →</Link>
              <Link href="/rebuild/bibbia/isaia" className="block text-ink-soft hover:text-ink">Isaia →</Link>
              <Link href="/rebuild/bibbia/giovanni" className="block text-ink-soft hover:text-ink">Giovanni →</Link>
              <Link href="/rebuild/historical-explorer" className="block border-t border-papyrus-line pt-3 text-ink-soft hover:text-ink">Esplora la storia →</Link>
            </div>
          </aside>
        </div>

        <div className="relative mt-12 max-w-3xl">
          <label htmlFor="rebuild-search" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Vai a un libro</label>
          <input id="rebuild-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Genesi, Isaia, Romani…" className="mt-2 w-full border-0 border-b border-papyrus-line bg-transparent px-0 py-3 font-serif text-2xl text-ink outline-none transition placeholder:text-ink-faint/55 focus:border-bronze" />
          {query && <div className="absolute left-0 right-0 top-full z-20 border-x border-b border-papyrus-line bg-papyrus shadow-xl">
            {results.length ? results.map((book) => <Link key={book.id} href={`/rebuild/bibbia/${book.slug}`} className="grid grid-cols-[1fr_auto] gap-4 border-t border-papyrus-line px-4 py-3 hover:bg-paper-card/60"><span className="font-serif text-lg">{book.title}</span><span className="text-xs text-ink-faint">{book.chapterCount} cap. →</span></Link>) : <p className="px-4 py-4 text-sm text-ink-faint">Nessun libro trovato.</p>}
          </div>}
        </div>
      </div>
    </section>

    <section id="bibbia" className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Corpus</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">Bibbia</h2>
          <p className="mt-4 text-sm leading-6 text-ink-faint">L’ordine canonico è la struttura primaria dell’ambiente.</p>
        </header>

        <div className="border-t border-papyrus-line">
          {corpus.sections.map((section) => <section key={section.name} className="grid gap-5 border-b border-papyrus-line py-8 md:grid-cols-[190px_minmax(0,1fr)] md:gap-8">
            <header><h3 className="font-serif text-2xl font-semibold">{section.name}</h3><p className="mt-1 text-xs text-ink-faint">{section.books.length} libri</p></header>
            <div className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
              {section.books.map((book) => <Link key={book.id} href={`/rebuild/bibbia/${book.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-papyrus-line/70 py-3">
                <span className="font-serif text-lg text-ink-soft group-hover:text-ink">{book.title}</span>
                <span className="shrink-0 font-mono text-[10px] text-ink-faint group-hover:text-bronze">{book.chapterCount}</span>
              </Link>)}
            </div>
          </section>)}
        </div>
      </div>
    </section>

    <section className="border-t border-papyrus-line bg-paper-card/20">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-10 md:px-8 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:gap-14">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Metodo</p><h2 className="mt-2 font-serif text-3xl font-semibold">Un solo contesto</h2></div>
        <p className="max-w-[70ch] leading-7 text-ink-soft">Una selezione — libro, capitolo, tradizione o data — cambia la prospettiva senza spezzare il percorso di studio.</p>
        <Link href="/rebuild/historical-explorer" className="self-start border-l border-papyrus-line pl-6 text-sm font-semibold text-bronze hover:text-ink">Interroga il tempo →</Link>
      </div>
    </section>
  </main>;
}
