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

const exploreCards = [
  { title: 'Leggi la Bibbia', desc: 'Sfoglia i libri e apri il percorso di studio capitolo per capitolo.', href: '#bibbia', symbol: '▤' },
  { title: 'Cronologia', desc: 'Distingui mondo narrato, storia documentabile e formazione del testo.', href: '#cronologia', symbol: '◴' },
  { title: 'Fonti & modelli', desc: 'Esplora tradizioni, redazioni e modelli della ricerca biblica.', href: '#fonti', symbol: '≋' },
  { title: 'Confronta', desc: 'Predisposizione al confronto MT ↔ LXX e ai testimoni testuali.', href: '#confronta', symbol: '⇄' },
];

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
      <section className="relative overflow-hidden border-b border-papyrus-line">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,154,74,0.13),transparent_34%),linear-gradient(135deg,transparent,rgba(11,42,74,0.04))] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(211,168,95,0.12),transparent_34%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1220px] items-center gap-9 px-5 py-14 sm:py-16 md:px-8 md:py-24 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-bronze sm:text-[11px]">Testo · storia · formazione · trasmissione</p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.96] sm:text-6xl md:text-7xl">La Scrittura<br />in profondità.</h1>
            <p className="mt-5 font-serif text-2xl italic text-seal dark:text-bronze-light md:text-3xl">Con rigore. Con chiarezza.</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">Biblia Fontes è un ambiente di studio pensato per studenti universitari, lettori colti e studiosi: dal quadro essenziale fino all’apparato critico.</p>

            <div id="cerca" className="relative mt-8 max-w-2xl">
              <label htmlFor="global-search" className="sr-only">Cerca nella Bibbia</label>
              <input id="global-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca libro o riferimento, es. Gen 1…" autoComplete="off" className="w-full rounded-xl border border-papyrus-line bg-paper-card px-4 py-4 pr-12 text-base text-ink shadow-sm outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20 sm:px-5 sm:pr-14 sm:text-lg" />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-bronze sm:right-5" aria-hidden="true">⌕</span>
              {query && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-papyrus-line bg-paper-card shadow-xl" role="listbox" aria-label="Risultati di ricerca">
                  {chapterHit && <Link href={`/bibbia/genesi/${chapterHit}`} className="flex items-center justify-between border-b border-papyrus-line/60 px-4 py-4 hover:bg-papyrus-deep/40 sm:px-5"><span><span className="block text-[10px] uppercase tracking-widest text-bronze">Passo</span><strong className="font-serif text-xl">Genesi {chapterHit}</strong></span><span className="text-sm text-ink-faint">Gen {chapterHit} →</span></Link>}
                  {results.map((libro) => {
                    const isGenesis = normalize(libro.titolo) === 'genesi';
                    return <Link key={libro.id} href={isGenesis ? '/bibbia/genesi' : '#bibbia'} className="flex items-center justify-between border-b border-papyrus-line/60 px-4 py-4 last:border-0 hover:bg-papyrus-deep/40 sm:px-5"><span><span className="block text-[10px] uppercase tracking-widest text-bronze">Libro</span><strong className="font-serif text-xl">{libro.titolo}</strong></span><span className="text-sm text-ink-faint">{libro.capitoli ?? '—'} cap. {isGenesis ? '→' : ''}</span></Link>;
                  })}
                  {!chapterHit && !results.length && <p className="px-4 py-5 text-ink-soft sm:px-5">Nessun risultato nel vertical slice. In questa fase riconosciamo libri e riferimenti di Genesi; temi e fonti arriveranno dopo.</p>}
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-faint"><span className="w-full sm:w-auto">Prova:</span><Link href="/bibbia/genesi/1" className="rounded-full border border-papyrus-line px-3 py-1 hover:border-bronze hover:text-bronze">Gen 1</Link><span className="rounded-full border border-papyrus-line px-3 py-1">Rom 8</span><span className="rounded-full border border-papyrus-line px-3 py-1">Alleanza</span><span className="rounded-full border border-papyrus-line px-3 py-1">P</span></div>
            </div>
          </div>

          <aside className="rounded-[1.4rem] border border-papyrus-line bg-paper-card/75 p-6 shadow-[0_18px_70px_rgba(11,42,74,0.08)] backdrop-blur dark:shadow-black/20 sm:p-7 md:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Metodo Biblia Fontes</p>
            <h2 className="mt-3 font-serif text-3xl font-bold">Un testo, tre profondità</h2>
            <div className="mt-7 space-y-5">
              {[['Essenziale','Che cosa sto leggendo?'],['Studio','Come posso comprenderlo nel suo contesto?'],['Critica','Come si ricostruisce la sua formazione?']].map(([title, desc], i) => <div key={title} className="grid grid-cols-[2.25rem_1fr] gap-4 border-t border-papyrus-line pt-4"><span className="font-mono text-sm text-bronze">0{i+1}</span><div><h3 className="font-serif text-xl font-semibold">{title}</h3><p className="mt-1 leading-6 text-ink-soft">{desc}</p></div></div>)}
            </div>
            <Link href="/bibbia/genesi/1" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-papyrus transition hover:opacity-90">Apri Genesi 1 →</Link>
          </aside>
        </div>
      </section>

      <section id="esplora" className="mx-auto max-w-[1220px] px-5 py-14 md:px-8 md:py-20">
        <div className="text-center"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Percorsi</p><h2 className="mt-2 font-serif text-4xl font-bold">Inizia a esplorare</h2></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exploreCards.map((card) => <Link key={card.title} id={card.title === 'Cronologia' ? 'cronologia' : card.title === 'Fonti & modelli' ? 'fonti' : card.title === 'Confronta' ? 'confronta' : undefined} href={card.href} className="group rounded-2xl border border-papyrus-line bg-paper-card/55 p-5 transition hover:-translate-y-0.5 hover:border-bronze hover:shadow-lg sm:p-6"><span className="text-3xl text-bronze" aria-hidden="true">{card.symbol}</span><h3 className="mt-5 font-serif text-2xl font-bold group-hover:text-bronze">{card.title}</h3><p className="mt-3 leading-7 text-ink-soft">{card.desc}</p><span className="mt-6 inline-block text-sm font-semibold text-bronze">Esplora →</span></Link>)}
        </div>
      </section>

      <section id="bibbia" className="border-y border-papyrus-line bg-paper-card/35">
        <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-16">
          <div className="mb-8 flex items-end justify-between border-b border-papyrus-line pb-4"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Antico Testamento</p><h2 className="mt-2 font-serif text-3xl font-bold">Pentateuco</h2></div><span className="text-sm text-ink-faint">{pentateuco.length} libri</span></div>
          <div className="divide-y divide-papyrus-line">{pentateuco.map((libro, index) => {
            const isGenesis = normalize(libro.titolo) === 'genesi';
            return <div key={libro.id} className={`grid grid-cols-[2.5rem_1fr] gap-3 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-4 ${isGenesis ? 'group' : 'opacity-55'}`}>
              <span className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
              <span className="min-w-0"><strong className="block font-serif text-2xl group-hover:text-bronze">{isGenesis ? <Link href="/bibbia/genesi">{libro.titolo}</Link> : libro.titolo}</strong>{libro.titoloEbraico && <span className="mt-1 block truncate text-sm text-ink-faint sm:ml-3 sm:mt-0 sm:inline">{libro.titoloEbraico}</span>}</span>
              <span className="col-start-2 text-sm text-ink-faint sm:col-auto">{libro.capitoli ?? '—'} cap. {isGenesis ? '→' : ''}</span>
            </div>;
          })}</div>
          <p className="mt-6 text-sm leading-6 text-ink-faint">In questo vertical slice Genesi è navigabile; gli altri libri restano visibili per verificare la futura architettura canonica senza creare link fittizi.</p>
        </div>
      </section>
    </main>
  );
}
