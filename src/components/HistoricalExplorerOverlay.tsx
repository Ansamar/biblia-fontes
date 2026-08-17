'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { genesisDemoData } from '../historical-explorer/genesisDemoData';
import { studyContextHref } from '../study-context/context';
import HistoricalExplorerShell from './HistoricalExplorerShell';

type HistoricalExplorerOverlayProps = {
  formationLabel?: string;
};

export default function HistoricalExplorerOverlay({ formationLabel }: HistoricalExplorerOverlayProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const dataset = formationLabel
    ? {
        ...genesisDemoData,
        entities: genesisDemoData.entities.map((entity) => entity.id === 'genesis-formation'
          ? { ...entity, summary: `${entity.summary} Dataset Biblia Fontes: ${formationLabel}` }
          : entity),
      }
    : genesisDemoData;
  const fullPageHref = studyContextHref('/historical-explorer/genesi', { book: 'genesi', source: 'timeline' });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-bronze bg-bronze/8 px-5 py-3 text-sm font-semibold text-bronze transition hover:bg-bronze hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze">
        Apri nella storia
        <span aria-hidden="true">↗</span>
      </button>

      {open ? (
        <div role="dialog" aria-modal="true" aria-label="Biblia Fontes Historical Explorer — Genesi" className="fixed inset-0 z-[100] bg-ink/80 p-2 backdrop-blur-sm md:p-4">
          <div className="mx-auto flex h-full max-w-[1740px] flex-col overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-papyrus-line bg-paper-card px-4 py-3 md:px-6">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">Biblia Fontes Historical Explorer</p>
                <p className="truncate font-serif text-lg font-bold text-ink">Genesi · la storia intorno al testo</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={fullPageHref} className="hidden rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft transition hover:border-bronze hover:text-bronze sm:inline-flex">Apri a piena pagina</Link>
                <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi Historical Explorer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-papyrus-line text-xl text-ink-soft transition hover:border-bronze hover:text-bronze">×</button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-papyrus/20 p-3 md:p-5">
              <HistoricalExplorerShell dataset={dataset} originBookSlug="genesi" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
