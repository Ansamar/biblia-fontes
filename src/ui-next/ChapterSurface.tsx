'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ChapterView } from '../data-access/chapter';
import WorkspaceReader from './WorkspaceReader';

type Panel = 'summary' | 'structure' | 'context' | 'critical' | 'sources' | 'bibliography';
const labels: Array<[Panel, string]> = [['summary','Sintesi'],['structure','Struttura'],['context','Contesto'],['critical','Critica'],['sources','Fonti'],['bibliography','Bibliografia']];

function toText(value: any, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => toText(item)).filter(Boolean).join(' · ') || fallback;
  if (typeof value === 'object') return value.descrizione || value.motivazione || value.etichetta || value.citazione || value.titolo || value.nome || value.nota || fallback;
  return fallback;
}

export default function ChapterSurface({ chapter }: { chapter: ChapterView }) {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get('view');
  const [panel, setPanel] = useState<Panel>(requestedView === 'sources' ? 'sources' : 'summary');
  const reference = `${chapter.abbreviation} ${chapter.number}`;

  useEffect(() => {
    if (requestedView === 'sources') setPanel('sources');
    else if (requestedView === 'study' && panel === 'sources') setPanel('summary');
  }, [requestedView, panel]);

  const nearby = useMemo(() => {
    const currentIndex = chapter.chapters.findIndex((item: any) => item.numero === chapter.number);
    const start = Math.max(0, currentIndex - 5);
    return chapter.chapters.slice(start, start + 11);
  }, [chapter.chapters, chapter.number]);

  const panelContent: Record<Exclude<Panel, 'sources' | 'bibliography'>, string> = {
    summary: chapter.summary,
    structure: chapter.structure || 'Struttura dettagliata in preparazione.',
    context: chapter.context || 'Contesto storico-culturale in preparazione.',
    critical: [chapter.critical, chapter.textual, chapter.formation].filter(Boolean).join('\n\n') || 'Apparato critico in preparazione.',
  };

  return <main className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-7">
    <header className="mb-5 grid gap-4 border-b border-papyrus-line pb-5 lg:grid-cols-[170px_minmax(0,1fr)_310px] lg:items-end">
      <div className="hidden lg:block"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">{chapter.category}</p></div>
      <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">{reference}</p><h1 className="mt-1 font-serif text-3xl font-semibold leading-tight md:text-4xl">{chapter.title}</h1></div>
      <div className="flex justify-start gap-4 text-xs text-ink-faint lg:justify-end">{chapter.number > 1 && <Link href={`/rebuild/bibbia/${chapter.slug}/${chapter.number - 1}`} className="hover:text-ink">← {chapter.abbreviation} {chapter.number - 1}</Link>}{chapter.number < chapter.totalChapters && <Link href={`/rebuild/bibbia/${chapter.slug}/${chapter.number + 1}`} className="hover:text-ink">{chapter.abbreviation} {chapter.number + 1} →</Link>}</div>
    </header>

    <details className="mb-6 border-y border-papyrus-line py-3 xl:hidden">
      <summary className="cursor-pointer list-none text-xs font-semibold text-ink-soft">Capitoli di {chapter.bookTitle} · {chapter.number}/{chapter.totalChapters} <span className="text-bronze">▾</span></summary>
      <nav className="mt-3 grid grid-cols-2 gap-x-5 sm:grid-cols-3" aria-label={`Capitoli di ${chapter.bookTitle}`}>{nearby.map((item: any) => <Link key={item._id} href={`/rebuild/bibbia/${chapter.slug}/${item.numero}`} className={`grid grid-cols-[2rem_1fr] gap-2 border-t border-papyrus-line py-2.5 text-xs ${item.numero === chapter.number ? 'text-ink' : 'text-ink-faint hover:text-ink'}`}><span className={item.numero === chapter.number ? 'font-semibold text-bronze' : ''}>{String(item.numero).padStart(2,'0')}</span><span className="line-clamp-2">{item.titolo || `Capitolo ${item.numero}`}</span></Link>)}</nav>
      <Link href={`/rebuild/bibbia/${chapter.slug}`} className="mt-3 inline-flex text-[11px] font-semibold text-bronze">Indice completo →</Link>
    </details>

    <div className="grid gap-0 xl:grid-cols-[170px_minmax(0,1fr)_330px]">
      <aside className="hidden border-r border-papyrus-line pr-4 xl:block"><div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8"><Link href={`/rebuild/bibbia/${chapter.slug}`} className="font-serif text-lg font-semibold hover:text-bronze">{chapter.bookTitle}</Link><p className="mt-1 text-[11px] text-ink-faint">{chapter.totalChapters} capitoli</p><nav className="mt-5" aria-label={`Capitoli di ${chapter.bookTitle}`}>{nearby.map((item: any) => <Link key={item._id} href={`/rebuild/bibbia/${chapter.slug}/${item.numero}`} className={`grid grid-cols-[2rem_1fr] gap-2 border-t border-papyrus-line py-2.5 text-xs ${item.numero === chapter.number ? 'text-ink' : 'text-ink-faint hover:text-ink'}`}><span className={item.numero === chapter.number ? 'font-semibold text-bronze' : ''}>{String(item.numero).padStart(2,'0')}</span><span className="line-clamp-2 leading-4">{item.titolo || `Capitolo ${item.numero}`}</span></Link>)}</nav><Link href={`/rebuild/bibbia/${chapter.slug}`} className="mt-4 inline-flex text-[11px] font-semibold text-bronze hover:text-ink">Indice completo →</Link></div></aside>

      <article className="min-w-0 px-0 xl:px-7"><div className="mb-5 flex items-center justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">Testo biblico</p><p className="mt-1 text-xs text-ink-faint">Tradizioni disponibili nello stesso contesto di studio</p></div><Link href={`/rebuild/historical-explorer/${chapter.slug}?chapter=${chapter.number}`} className="text-xs text-ink-faint hover:text-ink xl:hidden">Storia →</Link></div>{chapter.biblicalText ? <WorkspaceReader text={chapter.biblicalText} /> : <div className="border-y border-papyrus-line py-16 text-center text-sm text-ink-faint">Il testo biblico non è ancora collegato a questo capitolo.</div>}</article>

      <aside className="mt-8 min-w-0 border-t border-papyrus-line pt-5 xl:mt-0 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><div className="xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pb-8"><div className="flex gap-4 overflow-x-auto border-b border-papyrus-line">{labels.map(([id,label]) => <button key={id} type="button" onClick={() => setPanel(id)} className={`shrink-0 border-b-2 px-0.5 pb-2 text-[11px] font-semibold ${panel === id ? 'border-bronze text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>{label}</button>)}</div><section className="py-5"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Studio del capitolo</p><h2 className="mt-1 font-serif text-2xl font-semibold">{labels.find(([id]) => id === panel)?.[1]}</h2>{panel !== 'sources' && panel !== 'bibliography' && <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-7 text-ink-soft">{panelContent[panel]}</p>}{panel === 'sources' && <div className="mt-4 divide-y divide-papyrus-line border-y border-papyrus-line">{chapter.sourceLayers.length ? chapter.sourceLayers.map((layer: any,index:number) => <article key={layer?._key || index} className="py-4"><div className="flex items-baseline justify-between gap-3"><strong className="font-serif text-lg">{layer?.fonte?.sigla || layer?.fonte?.nome || 'Livello critico'}</strong>{(layer?.versettoInizio != null || layer?.versettoFine != null) && <span className="font-mono text-[9px] text-ink-faint">vv. {layer.versettoInizio ?? '…'}–{layer.versettoFine ?? '…'}</span>}</div>{layer?.fonte?.nome && layer?.fonte?.sigla && <p className="mt-1 text-[11px] text-ink-faint">{layer.fonte.nome}</p>}<p className="mt-2 text-sm leading-6 text-ink-soft">{toText(layer?.descrizione) || toText(layer?.motivazione) || toText(layer?.fonte?.descrizione,'Attribuzione registrata nel modello critico.')}</p></article>) : <p className="py-4 text-sm text-ink-faint">Nessuna attribuzione strutturata disponibile.</p>}</div>}{panel === 'bibliography' && <div className="mt-4 divide-y divide-papyrus-line border-y border-papyrus-line">{chapter.bibliography.length ? chapter.bibliography.map((item:any,index:number) => <p key={item?._key || index} className="py-3 text-sm leading-6 text-ink-soft">{toText(item,'Riferimento bibliografico')}</p>) : <p className="py-4 text-sm text-ink-faint">Bibliografia specifica non disponibile.</p>}</div>}</section></div></aside>
    </div>
  </main>;
}
