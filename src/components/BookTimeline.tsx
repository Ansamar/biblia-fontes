type BookTimelineProps = {
  formationLabel?: string;
};

const markers = [
  { label: '1200', x: '10%' },
  { label: '1000', x: '28%' },
  { label: '800', x: '46%' },
  { label: '600', x: '64%' },
  { label: '400 a.C.', x: '84%' },
];

export default function BookTimeline({ formationLabel }: BookTimelineProps) {
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
            <div className="relative h-5 rounded-full bg-papyrus-deep/60"><div className="absolute inset-y-1 left-[5%] right-[12%] rounded-full border border-dashed border-ink-faint/70" /><span className="absolute inset-0 flex items-center justify-center text-[10px] text-ink-faint">tempo primordiale → patriarchi</span></div>
          </div>

          <div className="grid grid-cols-[108px_1fr] items-center gap-4">
            <span className="text-xs font-medium text-ink">Contesti</span>
            <div className="relative h-5"><span className="absolute left-[27%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-bronze" title="Età del ferro e monarchie levantine"/><span className="absolute left-[58%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-bronze" title="Crisi assiro-babilonesi"/><span className="absolute left-[73%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-bronze" title="Esilio e periodo persiano"/><div className="absolute inset-x-0 top-1/2 border-t border-papyrus-line" /></div>
          </div>

          <div className="grid grid-cols-[108px_1fr] items-center gap-4">
            <span className="text-xs font-medium text-ink">Formazione</span>
            <div className="relative h-5 rounded-full bg-papyrus-deep/60"><div className="absolute inset-y-0 left-[36%] right-[8%] rounded-full bg-bronze/20 ring-1 ring-inset ring-bronze/50"/><div className="absolute inset-y-1 left-[54%] right-[18%] rounded-full bg-bronze/55" /></div>
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-papyrus-line pt-4 text-xs leading-5 text-ink-faint">{formationLabel || 'La datazione della formazione del Pentateuco è pluristratificata e discussa: le fasce visualizzano intervalli di plausibilità, non date puntuali.'}</p>
    </section>
  );
}
