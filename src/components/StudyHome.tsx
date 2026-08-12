'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Libro } from '../types';

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function parseGenesisReference(raw: string) {
  const q = normalize(raw.trim()).replace(/\s+/g, ' ');
  const match = q.match(/^(?:gen|genesi)\s*(\d{1,2})(?:[,:.]\s*\d+)?/);
  if (!match) return null;
  const chapter = Number(match[1]);
  return chapter >= 1 && chapter <= 50 ? chapter : null;
}

export default function StudyHome({ libri }: { libri: Libro[] }) {
  const [query, setQuery] = useState('');
  const chapterHit = useMemo(() => parseGenesisReference(query), [query]);
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return libri.filter((l) => normalize(l.titolo).includes(q)).slice(0, 6);
  }, [query, libri]);

  const pentateuco = libri.filter((l) => l.categoriaId === 'pentateuco');

  return (
    <main>
      <section className="mx-auto max-w-[980px] px-5 pb-20 pt-20 text-center md:px-8 md:pt-28">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">Testo · storia · formazione · trasmissione</p>
        <h1 className="font-serif text-5xl font-bold leading-none md:text-7xl">Biblia Fontes</h1>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-seal md:text-3xl">Studia il testo. Esplora la sua storia.</p>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink-soft">Un ambiente di studio per leggere la Scrittura e comprendere contesti, formazione letteraria, tradizioni e trasmissione del testo.</p>

        <div id="cerca" className="relative mx-auto mt-10 max-w-2xl text-left">
          <label htmlFor="global-search" className="sr-only">Cerca nella Bibbia</label>
          <input id="global-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca libro o riferimento, es. Gen 1…" autoComplete="off" className="w-full rounded-xl border border-papyrus-line bg-paper-card px-5 py-4 text-lg text-ink shadow-sm outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20" />
          {query && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-papyrus-line bg-paper-card shadow-xl" role="listbox" aria-label="Risultati di ricerca">
              {chapterHit && <Link href={`/bibbia/genesi/${chapterHit}`} className="flex items-center justify-between border-b border-papyrus-line/60 px-5 py-4 hover:bg-papyrus-deep/40"><span><span className="block text-[10px] uppercase tracking-widest text-bronze">Passo</span><strong className="font-serif text-xl">Genesi {chapterHit}</strong></span><span className="text-sm text-ink-faint">Gen {chapterHit} →</span></Link>}
              {results.map((libro) => {
                const isGenesis = normalize(libro.titolo) === 'genesi';
                return <Link key={libro.id} href={isGenesis ? '/bibbia/genesi' : '#bibbia'} className="flex items-center justify-between border-b border-papyrus-line/60 px-5 py-4 last:border-0 hover:bg-papyrus-deep/40">
                  <span><span className="block text-[10px] uppercase tracking-widest text-bronze">Libro</span><strong className="font-serif text-xl">{libro.titolo}</strong></span>
                  <span className="text-sm text-ink-faint">{libro.capitoli ?? '—'} capitoli {isGenesis ? '→' : ''}</span>
                </Link>;
              })}
              {!chapterHit && !results.length && <p className="px-5 py-5 text-ink-soft">Nessun risultato nel vertical slice. In questa fase riconosciamo libri e riferimenti di Genesi; temi e fonti arriveranno dopo.</p>}
            </div>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-ink-faint">
            <Link href="/bibbia/genesi/1" className="hover:text-bronze">Gen 1</Link><span>Rom 8</span><span>Alleanza</span><span>P</span><span>Esilio</span>
          </div>
        </div>
      </section>

      <section id="esplora" className="border-y border-papyrus-line/80 bg-paper-card/40">
        <div className="mx-auto grid max-w-[1100px] gap-px px-5 py-12 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          {[
            ['Bibbia', `${libri.length} libri`, '#bibbia'],
            ['Cronologia', 'Testo, storia e formazione', '#cronologia'],
            ['Fonti & modelli', 'P · H · Dtr · Q…', '#fonti'],
            ['Confronta', 'MT ↔ LXX', '#confronta'],
          ].map(([title, desc, href]) => (
            <Link key={title} id={title === 'Cronologia' ? 'cronologia' : title === 'Fonti & modelli' ? 'fonti' : title === 'Confronta' ? 'confronta' : undefined} href={href} className="group border-b border-papyrus-line p-6 text-left md:border-b-0 md:border-r last:border-r-0">
              <h2 className="font-serif text-2xl font-bold group-hover:text-bronze">{title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{desc}</p><span className="mt-5 inline-block text-sm text-bronze">Esplora →</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="bibbia" className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between border-b border-papyrus-line pb-4">
          <div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Antico Testamento</p><h2 className="mt-2 font-serif text-3xl font-bold">Pentateuco</h2></div>
          <span className="text-sm text-ink-faint">{pentateuco.length} libri</span>
        </div>
        <div className="divide-y divide-papyrus-line">
          {pentateuco.map((libro, index) => {
            const isGenesis = normalize(libro.titolo) === 'genesi';
            return <div key={libro.id} className={`grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 ${isGenesis ? 'group' : 'opacity-55'}`}>
              <span className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
              <span><strong className="font-serif text-2xl group-hover:text-bronze">{isGenesis ? <Link href="/bibbia/genesi">{libro.titolo}</Link> : libro.titolo}</strong>{libro.titoloEbraico && <span className="ml-3 text-sm text-ink-faint">{libro.titoloEbraico}</span>}</span>
              <span className="text-sm text-ink-faint">{libro.capitoli ?? '—'} cap. {isGenesis ? '→' : ''}</span>
            </div>;
          })}
        </div>
        <p className="mt-6 text-sm text-ink-faint">In questo vertical slice Genesi è navigabile; gli altri libri restano visibili per verificare la futura architettura canonica senza creare link fittizi.</p>
      </section>
    </main>
  );
}
