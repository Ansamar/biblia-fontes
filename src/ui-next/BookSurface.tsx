import Link from 'next/link';
import type { BookView } from '../data-access/book';

function originalTitleProps(value?: string) {
  if (!value) return {};
  if (/[\u0590-\u05FF]/.test(value)) return { lang: 'he', dir: 'rtl' as const };
  if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(value)) return { lang: 'grc' };
  return {};
}

function BookStudy({ book }: { book: BookView }) {
  return <section className="mx-auto max-w-[1320px] px-5 py-10 md:px-8 md:py-14">
    <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)_280px] lg:gap-12">
      <header><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Studio del libro</p><h2 className="mt-2 font-serif text-3xl font-semibold">Quadro critico</h2></header>
      <div className="divide-y divide-papyrus-line border-y border-papyrus-line">
        {book.literaryProfile && <article className="py-6"><h3 className="font-serif text-xl font-semibold">Profilo letterario</h3><p className="mt-3 leading-7 text-ink-soft">{book.literaryProfile}</p></article>}
        {book.context && <article className="py-6"><h3 className="font-serif text-xl font-semibold">Contesto</h3><p className="mt-3 leading-7 text-ink-soft">{book.context}</p></article>}
        <article className="py-6"><h3 className="font-serif text-xl font-semibold">Formazione</h3><p className="mt-3 leading-7 text-ink-soft">{book.formation}</p></article>
        <article className="py-6"><h3 className="font-serif text-xl font-semibold">Modelli e livelli</h3><p className="mt-3 leading-7 text-ink-soft">{book.levels}</p></article>
      </div>
      <aside className="border-l border-papyrus-line pl-5"><p className="text-xs leading-5 text-ink-faint">Lo studio del libro orienta; l’analisi puntuale resta collegata ai singoli capitoli.</p><Link href={`/rebuild/bibbia/${book.slug}`} className="mt-5 inline-flex text-sm font-semibold text-bronze hover:text-ink">Vai all’indice →</Link><Link href={`/rebuild/historical-explorer/${book.slug}`} className="mt-3 block text-sm text-ink-soft hover:text-ink">Apri la prospettiva storica →</Link></aside>
    </div>
  </section>;
}

function BookContents({ book }: { book: BookView }) {
  return <section className="mx-auto max-w-[1320px] px-5 py-10 md:px-8 md:py-14" aria-labelledby="contents-title">
    <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
      <header><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Indice</p><h2 id="contents-title" className="mt-2 font-serif text-3xl font-semibold">{book.abbreviation}</h2><p className="mt-3 max-w-[23ch] text-xs leading-5 text-ink-faint">Le unità letterarie orientano l’accesso ai capitoli.</p></header>
      <div className="border-t border-papyrus-line">
        {book.sections.map((section, sectionIndex) => <section key={`${section.start}-${section.end}`} className="grid gap-5 border-b border-papyrus-line py-7 md:grid-cols-[175px_minmax(0,1fr)] md:gap-7">
          <header><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">{String(sectionIndex + 1).padStart(2, '0')} · {book.abbreviation} {section.start}{section.end !== section.start ? `–${section.end}` : ''}</p><h3 className="mt-1.5 font-serif text-xl font-semibold leading-tight">{section.label}</h3></header>
          <ol className="grid gap-x-7 sm:grid-cols-2 xl:grid-cols-3">{section.chapters.map((chapter) => <li key={chapter._id} className="border-b border-papyrus-line/70"><Link href={`/rebuild/bibbia/${book.slug}/${chapter.numero}`} className="group grid min-h-12 grid-cols-[2rem_1fr] gap-2 py-2.5"><span className="font-mono text-[10px] text-ink-faint group-hover:text-bronze">{String(chapter.numero).padStart(2, '0')}</span><span className="font-serif text-[0.98rem] leading-5 text-ink-soft group-hover:text-ink">{chapter.titolo || `Capitolo ${chapter.numero}`}</span></Link></li>)}</ol>
        </section>)}
      </div>
    </div>
  </section>;
}

export default function BookSurface({ book, mode = 'text' }: { book: BookView; mode?: 'text' | 'study' }) {
  const originalProps = originalTitleProps(book.originalTitle);
  return <main>
    <section className="border-b border-papyrus-line"><div className="mx-auto max-w-[1320px] px-5 py-10 md:px-8 md:py-14"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16 lg:items-end">
      <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">{book.category} · {book.chapterCount} capitoli</p><div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2"><h1 className="font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">{book.title}</h1>{book.originalTitle && <span {...originalProps} className="font-serif text-2xl text-seal md:text-3xl">{book.originalTitle}</span>}</div><p className="reading-text mt-7 max-w-[72ch] text-ink-soft">{book.description}</p></div>
      <dl className="border-y border-papyrus-line text-xs"><div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3"><dt className="text-ink-faint">Lingua</dt><dd>{book.language}</dd></div><div className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Genere</dt><dd>{book.genre}</dd></div><div className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Formazione</dt><dd className="leading-5">{book.formation}</dd></div></dl>
    </div></div></section>
    {mode === 'study' ? <BookStudy book={book} /> : <BookContents book={book} />}
    <section className="border-t border-papyrus-line bg-paper-card/20"><div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-5 py-6 text-sm md:flex-row md:items-center md:justify-between md:px-8"><span className="text-ink-faint">{mode === 'study' ? 'Lo studio del libro resta collegato alla struttura e ai capitoli.' : 'Seleziona un capitolo per leggere, confrontare e studiare il testo.'}</span><Link href={`/rebuild/historical-explorer/${book.slug}`} className="font-semibold text-bronze hover:text-ink">{book.title} nella storia →</Link></div></section>
  </main>;
}
