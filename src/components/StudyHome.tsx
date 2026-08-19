'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Libro } from '../types';
import { bookAbbreviation, matchReference, slugFromBookId } from '../lib/bibleRouting';

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const exploreCards = [
  { title: 'Bibbia', desc: 'Leggi il corpus e mantieni libro e capitolo come centro del percorso di studio.', href: '#bibbia', symbol: '▤' },
  { title: 'Historical Explorer', desc: 'Interroga la storia attestata, ricostruita o discussa intorno al testo.', href: '/historical-explorer', symbol: '◎' },
  { title: 'Fonti', desc: 'Attraversa fonti, tradizioni e modelli critici collegati realmente ai libri e ai capitoli.', href: '/fonti', symbol: '≋' },
  { title: 'Cerca', desc: 'Cerca nel corpus e raggiungi libri, capitoli e progressivamente entità e testimoni.', href: '/cerca', symbol: '⌕' },
];

function CanonSection({ title, subtitle, books, offset = 0 }: { title: string; subtitle: string; books: Libro[]; offset?: number }) {
  if (!books.length) return null;
  return <section className="py-10 first:pt-0 last:pb-0">
    <div className="mb-6 flex items-end justify-between border-b border-papyrus-line pb-4">
      <div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">{subtitle}</p><h2 className="mt-2 font-serif text-3xl font-bold">{title}</h2></div>
      <span className="text-sm text-ink-faint">{books.length} libri</span>
    </div>
    <div className="divide-y divide-papyrus-line">{books.map((libro, index) => {
      const slug = slugFromBookId(libro.id);
      const abbr = bookAbbreviation(slug, libro.titolo);
      return <Link key={libro.id} href={`/bibbia/${slug}`} className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
        <span className="font-mono text-xs text-ink-faint">{String(index + 1 + offset).padStart(2, '0')}</span>
        <span className="min-w-0"><strong className="block truncate font-serif text-2xl group-hover:text-bronze">{libro.titolo}</strong>{libro.titoloEbraico && <span className="mt-1 block truncate text-sm text-ink-faint sm:hidden">{libro.titoloEbraico}</span>}</span>
        <span className="col-start-2 text-sm text-ink-faint sm:col-auto">{abbr} · {libro.capitoli ?? '—'} cap. →</span>
      </Link>;
    })}</div>
  </section>;
}

export default function StudyHome({ libri }: { libri: Libro[] }) {
  const [query, setQuery] = useState('');
  const referenceHit = useMemo(() => matchReference(query, libri), [query, libri]);
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return libri.filter((l) => normalize(l.titolo).includes(q)).slice(0, 8);
  }, [query, libri]);

  const pentateuco = libri.filter((l) => l.categoriaId === 'pentateuco');
  const storici = libri.filter((l) => l.categoriaId === 'storici');
  const sapienziali = libri.filter((l) => ['sapienziali', 'sapienziali-poetici'].includes(l.categoriaId || ''));
  const profeti = libri.filter((l) => ['profetici', 'profeti'].includes(l.categoriaId || ''));

  const vangeli = libri.filter((l) => l.categoriaId === 'vangeli');
  const atti = libri.filter((l) => l.categoriaId === 'atti');
  const paoline = libri.filter((l) => ['paoline', 'lettere-paoline'].includes(l.categoriaId || ''));
  const ebrei = libri.filter((l) => l.categoriaId === 'ebrei');
  const cattoliche = libri.filter((l) => ['cattoliche', 'lettere-cattoliche'].includes(l.categoriaId || ''));
  const apocalisse = libri.filter((l) => ['apocalisse', 'apocalittica'].includes(l.categoriaId || '') || slugFromBookId(l.id) === 'apocalisse');

  const oldTestamentCount = pentateuco.length + storici.length + sapienziali.length + profeti.length;
  const offsetStorici = pentateuco.length;
  const offsetSapienziali = offsetStorici + storici.length;
  const offsetProfeti = offsetSapienziali + sapienziali.length;

  const offsetVangeli = oldTestamentCount;
  const offsetAtti = offsetVangeli + vangeli.length;
  const offsetPaoline = offsetAtti + atti.length;
  const offsetEbrei = offsetPaoline + paoline.length;
  const offsetCattoliche = offsetEbrei + ebrei.length;
  const offsetApocalisse = offsetCattoliche + cattoliche.length;

  return <main>
    <section className="relative overflow-hidden border-b border-papyrus-line">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,154,74,0.13),transparent_34%),linear-gradient(135deg,transparent,rgba(11,42,74,0.04))] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(211,168,95,0.12),transparent_34%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1220px] items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">Testo · studio · tempo · storia</p>
          <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.98] md:text-7xl">La Scrittura<br />in profondità.</h1>
          <p className="mt-5 font-serif text-2xl italic text-seal dark:text-bronze-light md:text-3xl">Con rigore. Con chiarezza.</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">Biblia Fontes è un ambiente integrato di studio: il testo resta il centro, mentre fonti, Timeline e Historical Explorer aprono prospettive diverse senza spezzare il contesto.</p>

          <div id="cerca" className="relative mt-9 max-w-2xl">
            <label htmlFor="global-search" className="sr-only">Cerca nella Bibbia</label>
            <input id="global-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca libro o riferimento, es. Rm 8…" autoComplete="off" className="w-full rounded-xl border border-papyrus-line bg-paper-card px-5 py-4 pr-14 text-lg text-ink shadow-sm outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20" />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl text-bronze" aria-hidden="true">⌕</span>
            {query && <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-papyrus-line bg-paper-card shadow-xl" role="listbox" aria-label="Risultati di ricerca">
              {referenceHit && <Link href={`/bibbia/${referenceHit.slug}/${referenceHit.chapter}`} className="flex items-center justify-between border-b border-papyrus-line/60 px-5 py-4 hover:bg-papyrus-deep/40"><span><span className="block text-[10px] uppercase tracking-widest text-bronze">Passo</span><strong className="font-serif text-xl">{referenceHit.label}</strong></span><span className="text-sm text-ink-faint">Apri →</span></Link>}
              {results.map((libro) => { const slug = slugFromBookId(libro.id); return <Link key={libro.id} href={`/bibbia/${slug}`} className="flex items-center justify-between border-b border-papyrus-line/60 px-5 py-4 last:border-0 hover:bg-papyrus-deep/40"><span><span className="block text-[10px] uppercase tracking-widest text-bronze">Libro</span><strong className="font-serif text-xl">{libro.titolo}</strong></span><span className="text-sm text-ink-faint">{libro.capitoli ?? '—'} capitoli →</span></Link>; })}
              {!referenceHit && !results.length && <p className="px-5 py-5 text-ink-soft">Nessun libro o riferimento riconosciuto. La ricerca globale continuerà ad ampliarsi a temi, fonti ed entità storiche.</p>}
            </div>}
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-ink-faint"><span>Prova:</span><Link href="/bibbia/isaia/6" className="rounded-full border border-papyrus-line px-3 py-1 hover:border-bronze hover:text-bronze">Is 6</Link><Link href="/bibbia/giovanni/1" className="rounded-full border border-papyrus-line px-3 py-1 hover:border-bronze hover:text-bronze">Gv 1</Link><Link href="/bibbia/romani/8" className="rounded-full border border-papyrus-line px-3 py-1 hover:border-bronze hover:text-bronze">Rm 8</Link><Link href="/bibbia/apocalisse/13" className="rounded-full border border-papyrus-line px-3 py-1 hover:border-bronze hover:text-bronze">Ap 13</Link></div>
          </div>
        </div>

        <aside className="rounded-[1.6rem] border border-papyrus-line bg-paper-card/75 p-7 shadow-[0_18px_70px_rgba(11,42,74,0.08)] backdrop-blur dark:shadow-black/20 md:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Metodo Biblia Fontes</p><h2 className="mt-3 font-serif text-3xl font-bold">Un testo, tre profondità</h2>
          <div className="mt-7 space-y-5">{[['Essenziale','Che cosa sto leggendo?'],['Studio','Come posso comprenderlo nel suo contesto?'],['Critica','Come si ricostruisce la sua formazione e trasmissione?']].map(([title, desc], i) => <div key={title} className="grid grid-cols-[2.25rem_1fr] gap-4 border-t border-papyrus-line pt-4"><span className="font-mono text-sm text-bronze">0{i+1}</span><div><h3 className="font-serif text-xl font-semibold">{title}</h3><p className="mt-1 leading-6 text-ink-soft">{desc}</p></div></div>)}</div>
          <Link href="/bibbia/romani/8" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-papyrus transition hover:opacity-90">Prova Romani 8 →</Link>
        </aside>
      </div>
    </section>

    <section id="esplora" className="mx-auto max-w-[1220px] px-5 py-14 md:px-8 md:py-20"><div className="text-center"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Ambiente di studio</p><h2 className="mt-2 font-serif text-4xl font-bold">Scegli da dove entrare.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-ink-soft">Le funzioni non sono più strumenti isolati: ogni ingresso porta nello stesso sistema di testi, relazioni e contesti.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{exploreCards.map((card) => <Link key={card.title} href={card.href} className="group rounded-2xl border border-papyrus-line bg-paper-card/55 p-6 transition hover:-translate-y-0.5 hover:border-bronze hover:shadow-lg"><span className="text-3xl text-bronze" aria-hidden="true">{card.symbol}</span><h3 className="mt-5 font-serif text-2xl font-bold group-hover:text-bronze">{card.title}</h3><p className="mt-3 leading-7 text-ink-soft">{card.desc}</p><span className="mt-6 inline-block text-sm font-semibold text-bronze">Esplora →</span></Link>)}</div></section>

    <section id="bibbia" className="border-y border-papyrus-line bg-paper-card/35"><div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-16">
      <CanonSection title="Pentateuco" subtitle="Antico Testamento" books={pentateuco} />
      <div className="border-t border-papyrus-line"><CanonSection title="Libri storici" subtitle="Storia, memoria e interpretazione" books={storici} offset={offsetStorici} /></div>
      <div className="border-t border-papyrus-line"><CanonSection title="Sapienziali e poetici" subtitle="Poesia, sapienza e voce" books={sapienziali} offset={offsetSapienziali} /></div>
      <div className="border-t border-papyrus-line"><CanonSection title="Profeti" subtitle="Oracolo, storia, raccolte e redazione" books={profeti} offset={offsetProfeti} /></div>

      <div className="my-12 border-t-2 border-bronze/40 pt-12"><p className="font-mono text-[11px] uppercase tracking-[0.24em] text-bronze">Nuovo Testamento</p><p className="mt-3 max-w-2xl text-ink-soft">Il Reader conserva la stessa grammatica, ma cambia lente: tradizioni evangeliche, storia della missione, retorica epistolare, autorialità, comunità e trasmissione del testo greco.</p></div>
      <CanonSection title="Vangeli" subtitle="Gesù, tradizioni e redazione evangelica" books={vangeli} offset={offsetVangeli} />
      <div className="border-t border-papyrus-line"><CanonSection title="Atti degli Apostoli" subtitle="Missione, narrazione e storia testuale" books={atti} offset={offsetAtti} /></div>
      <div className="border-t border-papyrus-line"><CanonSection title="Lettere Paoline" subtitle="Comunità, argomentazione e tradizione paolina" books={paoline} offset={offsetPaoline} /></div>
      <div className="border-t border-papyrus-line"><CanonSection title="Ebrei" subtitle="Omelia, cristologia e Scrittura" books={ebrei} offset={offsetEbrei} /></div>
      <div className="border-t border-papyrus-line"><CanonSection title="Lettere Cattoliche" subtitle="Voci, comunità e tradizioni apostoliche" books={cattoliche} offset={offsetCattoliche} /></div>
      <div className="border-t border-papyrus-line"><CanonSection title="Apocalisse" subtitle="Visione, simbolo e resistenza" books={apocalisse} offset={offsetApocalisse} /></div>

      <p className="mt-10 text-sm leading-6 text-ink-faint">L’intero corpus disponibile in Sanity è instradato attraverso lo stesso motore, con lenti metodologiche differenziate per famiglia letteraria.</p>
    </div></section>
  </main>;
}
