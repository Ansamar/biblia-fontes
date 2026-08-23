'use client';

import Link from 'next/link';
import ReadingPreferences from '../components/ReadingPreferences';
import { bookHref, perspectiveHref, type WorkspaceContext, type WorkspacePerspective } from './workspace';

const knowledgeDimensions = [
  ['scrittura', 'Scrittura'],
  ['mondo', 'Mondo'],
  ['umanita', 'Umanità'],
  ['tradizione', 'Tradizione'],
  ['ricezione', 'Ricezione'],
] as const;

export default function WorkspaceFrame({ children, context = {}, active = 'text', knowledgeMode = false }: { children: React.ReactNode; context?: WorkspaceContext; active?: WorkspacePerspective; knowledgeMode?: boolean }) {
  const base = context.bookSlug ? bookHref(context.bookSlug) : '/';
  const perspectives: Array<{id: WorkspacePerspective; label: string}> = context.chapter
    ? [{id:'text', label:'Testo'}, {id:'study', label:'Studio'}, {id:'history', label:'Storia'}, {id:'sources', label:'Fonti'}]
    : [{id:'text', label:'Libro'}, {id:'study', label:'Studio'}, {id:'history', label:'Storia'}];

  const persistentChapterLabel = context.bookTitle && context.chapter
    ? `${context.bookTitle} ${context.chapter}${context.chapterTitle ? ` · ${context.chapterTitle}` : ''}`
    : context.bookTitle;

  return <div data-workspace="true" data-knowledge-mode={knowledgeMode ? 'true' : 'false'} className="min-h-screen bg-papyrus text-ink">
    <header className="sticky top-0 z-50 border-b border-papyrus-line bg-papyrus/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center px-4 md:px-6">
        <Link href="/" className="shrink-0 font-serif text-sm font-bold tracking-[0.16em]">BIBLIA <span className="text-bronze">FONTES</span></Link>
        <div className="mx-5 hidden h-5 w-px bg-papyrus-line sm:block" />
        <div className="hidden min-w-0 items-baseline gap-2 sm:flex">
          {knowledgeMode && persistentChapterLabel ? (
            <span className="truncate font-serif text-sm font-semibold text-ink">{persistentChapterLabel}</span>
          ) : (
            <>{context.bookTitle && <Link href={base} className="truncate text-sm text-ink-soft hover:text-ink">{context.bookTitle}</Link>}{context.reference && <><span className="text-ink-faint">/</span><span className="truncate text-sm font-semibold">{context.reference}</span></>}</>
          )}
        </div>
        <div className="ml-auto flex items-center gap-3"><Link href="/historical-explorer" className="hidden text-xs text-ink-faint hover:text-ink sm:inline">Storia</Link><Link href="/cerca" className="text-xs text-ink-faint hover:text-ink">Cerca</Link><ReadingPreferences /></div>
      </div>
      {context.bookSlug && (knowledgeMode ? <nav className="mx-auto flex h-11 max-w-[1600px] items-end gap-5 overflow-x-auto px-4 md:px-6" aria-label="Dimensioni di conoscenza">{knowledgeDimensions.map(([id,label]) => <a key={id} href={`#${id}`} className="h-11 shrink-0 border-b-2 border-transparent px-0.5 pt-3 text-xs font-medium text-ink-faint hover:border-bronze hover:text-ink">{label}</a>)}</nav> : <nav className="mx-auto flex h-11 max-w-[1600px] items-end gap-5 overflow-x-auto px-4 md:px-6" aria-label="Prospettiva di studio">{perspectives.map((item) => <Link key={item.id} href={perspectiveHref(context, item.id)} className={`h-11 shrink-0 border-b-2 px-0.5 pt-3 text-xs font-medium ${active === item.id ? 'border-bronze text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>{item.label}</Link>)}</nav>)}
    </header>
    {children}
  </div>;
}
