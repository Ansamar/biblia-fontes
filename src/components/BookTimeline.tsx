type BookTimelineProps = {
  formationLabel?: string;
  worldNarratedLabel?: string;
  contextLabel?: string;
  note?: string;
  periodLabel?: string;
};

export default function BookTimeline({ formationLabel, worldNarratedLabel, contextLabel, note, periodLabel }: BookTimelineProps) {
  return (
    <section aria-labelledby="timeline-title" className="rounded-2xl border border-papyrus-line bg-paper-card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Biblia Fontes Timeline</p>
          <h3 id="timeline-title" className="mt-2 font-serif text-2xl font-bold">Il testo nel tempo</h3>
        </div>
        <span className="rounded-full border border-papyrus-line px-3 py-1 text-[11px] text-ink-faint">focus · testo biblico</span>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft">La Timeline parte dal testo: orienta nella sequenza narrata, nei contesti richiamati dal libro e nella sua formazione letteraria. Non pretende di trasformare il mondo narrato in una cronologia storica unica.</p>

      {periodLabel && <div className="mt-6 border-y border-papyrus-line py-3 text-center font-mono text-[11px] text-ink-faint">{periodLabel}</div>}

      <div className="mt-7 space-y-5">
        <div className="grid gap-2 sm:grid-cols-[130px_1fr] sm:items-center sm:gap-4">
          <span className="text-xs font-medium text-ink">Racconto</span>
          <div className="relative min-h-9 rounded-full bg-papyrus-deep/60 px-4 py-2"><div className="absolute inset-y-1 left-[4%] right-[4%] rounded-full border border-dashed border-ink-faint/60" /><span className="relative z-10 flex min-h-5 items-center justify-center text-center text-[11px] leading-5 text-ink-faint">{worldNarratedLabel || 'Sequenza e mondo rappresentato dal testo'}</span></div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[130px_1fr] sm:items-center sm:gap-4">
          <span className="text-xs font-medium text-ink">Risonanze storiche</span>
          <div className="relative min-h-9"><div className="absolute inset-x-0 top-1/2 border-t border-papyrus-line" /><span className="relative z-10 mx-auto flex min-h-9 max-w-[88%] items-center justify-center bg-paper-card px-4 text-center text-[11px] leading-5 text-ink-faint">{contextLabel || 'Contesti e memorie pertinenti alla lettura del testo'}</span></div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[130px_1fr] sm:items-center sm:gap-4">
          <span className="text-xs font-medium text-ink">Formazione</span>
          <div className="relative min-h-9 rounded-full bg-papyrus-deep/60 px-4 py-2"><div className="absolute inset-y-1 left-[18%] right-[10%] rounded-full bg-bronze/20 ring-1 ring-inset ring-bronze/45"/><div className="absolute inset-y-2 left-[40%] right-[22%] rounded-full bg-bronze/55"/><span className="relative z-10 flex min-h-5 items-center justify-center text-center text-[11px] leading-5 text-ink">{formationLabel || 'Processo compositivo e redazionale'}</span></div>
        </div>
      </div>

      <p className="mt-6 border-t border-papyrus-line pt-4 text-xs leading-5 text-ink-faint">{note || 'La Timeline orienta nel testo. Per interrogare la storia attestata, ricostruita o discussa intorno al testo, apri Historical Explorer.'}</p>
    </section>
  );
}
