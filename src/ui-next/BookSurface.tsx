import Link from 'next/link';
import type { BookView } from '../data-access/book';

function originalTitleProps(value?: string) {
  if (!value) return {};
  if (/[\u0590-\u05FF]/.test(value)) return { lang: 'he', dir: 'rtl' as const };
  if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(value)) return { lang: 'grc' };
  return {};
}

export default function BookSurface({ book }: { book: BookView }) {
  const originalProps = originalTitleProps(book.originalTitle);

  return (
    <main>
      <section className="border-b border-papyrus-line">
        <div className="mx-auto max-w-[1320px] px-5 py-10 md:px-8 md:py-16">
          <nav className="text-xs text-ink-faint" aria-label="Breadcrumb">
            <Link href="/rebuild" className="hover:text-ink">Bibbia</Link>
            <span className="mx-2">/</span>
            <span>{book.category}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">{book.category} · {book.chapterCount} capitoli</p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <h1 className="font-serif text-6xl font-semibold leading-[0.92] md:text-8xl">{book.title}</h1>
                {book.originalTitle && <span {...originalProps} className="font-serif text-2xl text-seal md:text-3xl">{book.originalTitle}</span>}
              </div>
              <p className="reading-text mt-8 max-w-[70ch] text-ink-soft">{book.description}</p>
            </div>

            <dl className="self-end border-y border-papyrus-line text-sm">
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3"><dt className="text-ink-faint">Lingua</dt><dd>{book.language}</dd></div>
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Genere</dt><dd>{book.genre}</dd></div>
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Formazione</dt><dd className="leading-6">{book.formation}</dd></div>
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Modelli</dt><dd className="leading-6">{book.levels}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16" aria-labelledby="contents-title">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Indice</p>
            <h2 id="contents-title" className="mt-2 font-serif text-3xl font-semibold">Il libro</h2>
            <p className="mt-4 max-w-[24ch] text-sm leading-6 text-ink-faint">Le unità letterarie organizzano la navigazione; non equivalgono automaticamente a fonti o strati compositivi.</p>
          </header>

          <div className="border-t border-papyrus-line">
            {book.sections.map((section, sectionIndex) => (
              <section key={`${section.start}-${section.end}`} className="grid gap-5 border-b border-papyrus-line py-8 md:grid-cols-[190px_minmax(0,1fr)] md:gap-8">
                <header>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">{String(sectionIndex + 1).padStart(2, '0')} · {book.abbreviation} {section.start}{section.end !== section.start ? `–${section.end}` : ''}</p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">{section.label}</h3>
                </header>

                <ol className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
                  {section.chapters.map((chapter) => (
                    <li key={chapter._id} className="border-b border-papyrus-line/70 last:border-b-0 sm:last:border-b">
                      <Link href={`/rebuild/bibbia/${book.slug}/${chapter.numero}`} className="group grid min-h-14 grid-cols-[2.25rem_1fr] gap-2 py-3">
                        <span className="font-mono text-[11px] text-ink-faint group-hover:text-bronze">{String(chapter.numero).padStart(2, '0')}</span>
                        <span className="font-serif text-base leading-5 text-ink-soft group-hover:text-ink">{chapter.titolo || `Capitolo ${chapter.numero}`}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-papyrus-line bg-paper-card/30">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:gap-14">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Studio</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Il libro come testo</h2>
          </div>
          <div className="space-y-8">
            {book.literaryProfile && <div><h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Profilo letterario</h3><p className="mt-3 leading-7 text-ink-soft">{book.literaryProfile}</p></div>}
            {book.context && <div><h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Contesto</h3><p className="mt-3 leading-7 text-ink-soft">{book.context}</p></div>}
            <div><h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Formazione</h3><p className="mt-3 leading-7 text-ink-soft">{book.formation}</p></div>
          </div>
          <aside className="border-l border-papyrus-line pl-6">
            <p className="text-sm leading-6 text-ink-faint">La ricostruzione storica resta distinta dalla struttura letteraria del libro.</p>
            <Link href={`/historical-explorer/${book.slug}`} className="mt-5 inline-flex text-sm font-semibold text-bronze hover:text-ink">Apri Historical Explorer →</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
