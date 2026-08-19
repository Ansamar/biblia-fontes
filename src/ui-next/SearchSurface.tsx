import Link from 'next/link';
import type { CorpusSearchResult } from '../data-access/search';

export default function SearchSurface({ term, results }: { term: string; results: CorpusSearchResult[] }) {
  return <main className="mx-auto max-w-[1120px] px-5 py-12 md:px-8 md:py-16">
    <header className="grid gap-8 border-b border-papyrus-line pb-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Ricerca</p><h1 className="mt-2 font-serif text-4xl font-semibold">Nel corpus</h1></div>
      <div>
        <form className="flex gap-3" action="/rebuild/search">
          <label htmlFor="q" className="sr-only">Cerca nel corpus</label>
          <input id="q" name="q" defaultValue={term} autoFocus placeholder="Libro, capitolo, tema…" className="min-h-11 flex-1 border-0 border-b border-papyrus-line bg-transparent px-0 font-serif text-xl outline-none placeholder:text-ink-faint/60 focus:border-bronze" />
          <button className="border-b border-ink px-2 text-xs font-semibold">Cerca</button>
        </form>
        <p className="mt-3 text-xs leading-5 text-ink-faint">La ricerca mantiene libro e capitolo come destinazioni. Le relazioni storiche e le fonti entrano nel workspace dal contesto selezionato.</p>
      </div>
    </header>

    <section className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <aside>{term ? <><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Risultati</p><p className="mt-2 font-serif text-4xl font-semibold">{results.length}</p><p className="text-xs text-ink-faint">per “{term}”</p></> : <p className="text-sm leading-6 text-ink-faint">Inserisci un termine per attraversare libri e capitoli.</p>}</aside>
      <div className="border-t border-papyrus-line">
        {results.map((result) => {
          const href = result.type === 'libro' ? `/rebuild/bibbia/${result.bookSlug}` : `/rebuild/bibbia/${result.bookSlug}/${result.number}`;
          return <Link key={result.id} href={href} className="grid gap-2 border-b border-papyrus-line py-5 md:grid-cols-[130px_minmax(0,1fr)_auto] md:items-baseline md:gap-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-bronze">{result.type === 'libro' ? 'Libro' : `Capitolo ${result.number}`}</span>
            <span><strong className="font-serif text-xl font-semibold">{result.title}</strong>{result.summary && <span className="mt-1 block line-clamp-2 text-sm leading-6 text-ink-faint">{result.summary}</span>}</span>
            <span className="text-xs text-ink-faint">Apri →</span>
          </Link>;
        })}
        {term && results.length === 0 && <div className="border-b border-papyrus-line py-10"><h2 className="font-serif text-2xl font-semibold">Nessun risultato</h2><p className="mt-2 text-sm text-ink-faint">Prova un termine più generale.</p></div>}
      </div>
    </section>
  </main>;
}
