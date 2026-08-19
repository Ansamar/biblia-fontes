'use client';

import Link from 'next/link';
import { useState } from 'react';
import BiblicalTextReader from '../components/BiblicalTextReader';
import type { ChapterView } from '../data-access/chapter';

type Panel = 'summary' | 'structure' | 'context' | 'critical' | 'sources' | 'bibliography';

const labels: Array<[Panel, string]> = [
  ['summary', 'Sintesi'],
  ['structure', 'Struttura'],
  ['context', 'Contesto'],
  ['critical', 'Critica'],
  ['sources', 'Fonti'],
  ['bibliography', 'Bibliografia'],
];

function text(value: any, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean).join(' · ') || fallback;
  if (typeof value === 'object') return value.descrizione || value.motivazione || value.etichetta || value.citazione || value.titolo || value.nome || value.nota || fallback;
  return fallback;
}

export default function ChapterSurface({ chapter }: { chapter: ChapterView }) {
  const [panel, setPanel] = useState<Panel>('summary');
  const reference = `${chapter.abbreviation} ${chapter.number}`;

  const panelContent = {
    summary: chapter.summary,
    structure: chapter.structure || 'Struttura dettagliata in preparazione.',
    context: chapter.context || 'Contesto storico-culturale in preparazione.',
    critical: [chapter.critical, chapter.textual].filter(Boolean).join('\n\n') || 'Apparato critico in preparazione.',
    sources: '',
    bibliography: '',
  };

  return <main className="mx-auto max-w-[1480px] px-4 py-6 md:px-7 md:py-8">
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-faint" aria-label="Percorso">
      <Link href="/rebuild" className="hover:text-ink">Bibbia</Link><span>/</span>
      <Link href={`/rebuild/bibbia/${chapter.slug}`} className="hover:text-ink">{chapter.bookTitle}</Link><span>/</span>
      <span className="text-ink">{reference}</span>
    </nav>

    <header className="mb-7 border-b border-papyrus-line pb-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">{chapter.category} · {reference}</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold leading-none md:text-5xl">{chapter.title}</h1>
        </div>
        <div className="flex gap-4 text-sm text-ink-soft">
          {chapter.number > 1 && <Link href={`/rebuild/bibbia/${chapter.slug}/${chapter.number - 1}`} className="hover:text-ink">← {chapter.abbreviation} {chapter.number - 1}</Link>}
          {chapter.number < chapter.totalChapters && <Link href={`/rebuild/bibbia/${chapter.slug}/${chapter.number + 1}`} className="hover:text-ink">{chapter.abbreviation} {chapter.number + 1} →</Link>}
        </div>
      </div>
    </header>

    <div className="grid gap-7 xl:grid-cols-[190px_minmax(0,1fr)_330px]">
      <aside className="hidden xl:block">
        <div className="sticky top-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">Capitolo</p>
          <Link href={`/rebuild/bibbia/${chapter.slug}`} className="block border-l-2 border-bronze py-1 pl-3 font-serif text-xl font-semibold">{chapter.bookTitle}</Link>
          <p className="mt-3 pl-3 text-sm leading-6 text-ink-faint">{chapter.number} di {chapter.totalChapters}</p>
          <div className="mt-7 border-t border-papyrus-line pt-5">
            <Link href={`/historical-explorer/${chapter.slug}`} className="text-sm text-ink-soft hover:text-ink">Apri nella storia →</Link>
          </div>
        </div>
      </aside>

      <article className="min-w-0">
        <div className="mb-4 flex items-center justify-between border-b border-papyrus-line pb-3">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">Testo</p><h2 className="mt-1 font-serif text-2xl font-semibold">{reference}</h2></div>
          <span className="text-xs text-ink-faint">Lettura · confronto · sinossi</span>
        </div>
        {chapter.biblicalText
          ? <BiblicalTextReader text={chapter.biblicalText} critical={panel === 'critical' || panel === 'sources'} />
          : <div className="mx-auto max-w-[72ch] py-16 text-center text-ink-faint">Il testo biblico non è ancora collegato a questo capitolo.</div>}
      </article>

      <aside className="min-w-0 border-t border-papyrus-line pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
        <div className="xl:sticky xl:top-6">
          <div className="flex gap-1 overflow-x-auto border-b border-papyrus-line pb-2 xl:flex-wrap">
            {labels.map(([id, label]) => <button key={id} onClick={() => setPanel(id)} className={`shrink-0 px-2.5 py-1.5 text-xs transition ${panel === id ? 'bg-ink text-papyrus' : 'text-ink-soft hover:text-ink'}`}>{label}</button>)}
          </div>

          <section className="py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">Studio</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">{labels.find(([id]) => id === panel)?.[1]}</h2>

            {panel !== 'sources' && panel !== 'bibliography' && <p className="mt-4 whitespace-pre-line text-[0.98rem] leading-7 text-ink-soft">{panelContent[panel]}</p>}

            {panel === 'sources' && <div className="mt-5 space-y-5">{chapter.sourceLayers.length ? chapter.sourceLayers.map((layer: any, index: number) => <div key={layer?._key || index} className="border-t border-papyrus-line pt-4 first:border-t-0 first:pt-0"><div className="flex items-baseline justify-between gap-3"><strong className="font-serif text-xl">{layer?.fonte?.sigla || layer?.fonte?.nome || 'Livello critico'}</strong>{(layer?.versettoInizio != null || layer?.versettoFine != null) && <span className="font-mono text-[10px] text-ink-faint">vv. {layer.versettoInizio ?? '…'}–{layer.versettoFine ?? '…'}</span>}</div>{layer?.fonte?.nome && layer?.fonte?.sigla && <p className="mt-1 text-xs text-ink-faint">{layer.fonte.nome}</p>}<p className="mt-2 text-sm leading-6 text-ink-soft">{text(layer?.descrizione) || text(layer?.motivazione) || text(layer?.fonte?.descrizione, 'Attribuzione registrata nel modello critico.')}</p></div>) : <p className="text-sm leading-6 text-ink-faint">Nessuna attribuzione strutturata disponibile.</p>}</div>}

            {panel === 'bibliography' && <div className="mt-5 divide-y divide-papyrus-line border-y border-papyrus-line">{chapter.bibliography.length ? chapter.bibliography.map((item: any, index: number) => <p key={item?._key || index} className="py-3 text-sm leading-6 text-ink-soft">{text(item, 'Riferimento bibliografico')}</p>) : <p className="py-4 text-sm text-ink-faint">Bibliografia specifica non disponibile.</p>}</div>}
          </section>
        </div>
      </aside>
    </div>
  </main>;
}
