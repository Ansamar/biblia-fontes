'use client';

import Link from 'next/link';
import ReadingPreferences from '../components/ReadingPreferences';

type Perspective = 'text' | 'study' | 'history' | 'sources';

const perspectives: Array<{id: Perspective; label: string}> = [
  {id:'text', label:'Testo'},
  {id:'study', label:'Studio'},
  {id:'history', label:'Storia'},
  {id:'sources', label:'Fonti'},
];

export default function WorkspaceFrame({
  children,
  context,
  active = 'text',
}: {
  children: React.ReactNode;
  context?: { bookSlug?: string; bookTitle?: string; chapter?: number; reference?: string };
  active?: Perspective;
}) {
  const base = context?.bookSlug ? `/rebuild/bibbia/${context.bookSlug}` : '/rebuild';
  const chapterPath = context?.chapter ? `${base}/${context.chapter}` : base;
  const hrefFor = (id: Perspective) => {
    if (id === 'text') return chapterPath;
    if (id === 'study') return `${chapterPath}?view=study`;
    if (id === 'history') return context?.bookSlug ? `/rebuild/historical-explorer/${context.bookSlug}${context.chapter ? `?chapter=${context.chapter}` : ''}` : '/rebuild/historical-explorer';
    return `${chapterPath}?view=sources`;
  };

  return <div className="min-h-screen bg-papyrus text-ink">
    <header className="sticky top-0 z-50 border-b border-papyrus-line bg-papyrus/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center px-4 md:px-6">
        <Link href="/rebuild" className="shrink-0 font-serif text-sm font-bold tracking-[0.16em]">BIBLIA <span className="text-bronze">FONTES</span></Link>
        <div className="mx-5 hidden h-5 w-px bg-papyrus-line sm:block" />
        <div className="hidden min-w-0 items-baseline gap-2 sm:flex">
          {context?.bookTitle && <Link href={base} className="truncate text-sm text-ink-soft hover:text-ink">{context.bookTitle}</Link>}
          {context?.reference && <><span className="text-ink-faint">/</span><span className="truncate text-sm font-semibold">{context.reference}</span></>}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/rebuild/historical-explorer" className="hidden text-xs text-ink-faint hover:text-ink sm:inline">Storia</Link>
          <Link href="/rebuild/search" className="text-xs text-ink-faint hover:text-ink">Cerca</Link>
          <ReadingPreferences />
        </div>
      </div>
      {context?.bookSlug && <nav className="mx-auto flex h-11 max-w-[1600px] items-end gap-5 overflow-x-auto px-4 md:px-6" aria-label="Prospettiva di studio">
        {perspectives.map((item) => <Link key={item.id} href={hrefFor(item.id)} className={`h-11 shrink-0 border-b-2 px-0.5 pt-3 text-xs font-medium ${active === item.id ? 'border-bronze text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>{item.label}</Link>)}
      </nav>}
    </header>
    {children}
  </div>;
}
