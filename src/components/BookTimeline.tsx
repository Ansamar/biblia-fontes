type BookTimelineProps = {
  formationLabel?: string;
  worldNarratedLabel?: string;
  contextLabel?: string;
  note?: string;
};

const markers = [
  { label: '1200', x: '10%' },
  { label: '1000', x: '28%' },
  { label: '800', x: '46%' },
  { label: '600', x: '64%' },
  { label: '400 a.C.', x: '84%' },
];

export default function BookTimeline({ formationLabel, worldNarratedLabel, contextLabel, note }: BookTimelineProps) {
  return (
    <section aria-labelledby="timeline-title" className="rounded-2xl border border-papyrus-line bg-paper-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Cronologia</p>
          <h3 id="timeline-title" className="mt-2 font-serif text-2xl font-bold">Tre tempi diversi</h3>
        </div>
        <span className="rounded-full border border-papyrus-line px-3 py-1 text-[11px] text-ink-faint">lettura orientativa</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink-soft">La linea non pretende una precisione impossibile: distingue il mondo rappresentato, i contesti storici pertinenti e la formazione letteraria.</p>

      <div className="mt-7">
        <div className="relative h-8 border-t border-papyrus-line">
          {markers.map((m) => <span key={m.label} className="absolute -top-2 -translate-x-1/2 text-[10px] text-ink-faint" style={{ left: m.x }}><span className="mx-auto block h-2 w-px bg-papyrus-line" />{m.label}</span>)}
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-[108px_1fr] items-center gap-4">
            <span className="text-xs font-medium text-ink">Mondo narrato</span>
            <div className="relative min-h-7 rounded-full bg-papyrus-deep/60 px-3 py-1"><div className="absolute inset-y-1 left-[5%] right-[12%] rounded-full border border-dashed border-ink-faint/70" /><span className="relative z-10 flex min-h-5 items-center justify-center text-center text-[10px] text-ink-faint">{worldNarratedLabel || 'tempo primordiale → patriarchi'}</span></div>
          </div>

          <div className="grid grid-cols-[108px_1fr] items-center gap-4">
            <span className="text-xs font-medium text-ink">Contesti</span>
            <div className="relative min-h-7"><div className="absolute inset-x-0 top-1/2 border-t border-papyrus-line" /><span className="relative z-10 mx-auto flex min-h-7 max-w-[78%] items-center justify-center bg-paper-card px-3 text-center text-[10px] text-ink-faint">{contextLabel || 'monarchie levantine · crisi assiro-babilonesi · esilio e periodo persiano'}</span></div>
          </div>

          <div className="grid grid-cols-[108px_1fr] items-center gap-4">
            <span className="text-xs font-medium text-ink">Formazione</span>
            <div className="relative h-5 rounded-full bg-papyrus-deep/60"><div className="absolute inset-y-0 left-[36%] right-[8%] rounded-full bg-bronze/20 ring-1 ring-inset ring-bronze/50"/><div className="absolute inset-y-1 left-[54%] right-[18%] rounded-full bg-bronze/55" /></div>
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-papyrus-line pt-4 text-xs leading-5 text-ink-faint">{note || formationLabel || 'Le fasce visualizzano intervalli di plausibilità, non date puntuali.'}</p>
    </section>
  );
}
