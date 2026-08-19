import Link from 'next/link';
import type { CorpusView } from '../data-access/corpus';

export default function HistoryIndexSurface({ corpus }: { corpus: CorpusView }) {
  return <main className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
    <header className="grid gap-8 border-b border-papyrus-line pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
      <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Historical Explorer</p><h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">La storia intorno al testo.</h1><p className="reading-text mt-5 max-w-[70ch] text-ink-soft">Ogni libro apre un campo storico distinto: luoghi, poteri, eventi, istituzioni, testi e trasmissione vengono interrogati senza trasformare la narrazione biblica in cronaca.</p></div>
      <p className="border-l border-papyrus-line pl-6 text-sm leading-6 text-ink-faint">L’Explorer conserva lo statuto epistemico di ciascuna entità: attestato, probabile, discusso, memoria, comparandum o elemento narrativo.</p>
    </header>

    <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
      <aside><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Scegli un libro</p><Link href="/rebuild" className="mt-4 inline-flex text-sm text-ink-soft hover:text-ink">← Torna alla Bibbia</Link></aside>
      <div className="border-t border-papyrus-line">{corpus.sections.map((section) => <section key={section.name} className="grid gap-5 border-b border-papyrus-line py-7 md:grid-cols-[190px_minmax(0,1fr)]"><header><h2 className="font-serif text-2xl font-semibold">{section.name}</h2></header><div className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">{section.books.map((book) => <Link key={book.id} href={`/rebuild/historical-explorer/${book.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-papyrus-line/70 py-3"><span className="font-serif text-lg text-ink-soft group-hover:text-ink">{book.title}</span><span className="text-xs text-ink-faint group-hover:text-bronze">storia →</span></Link>)}</div></section>)}</div>
    </div>
  </main>;
}
