import Link from 'next/link';

type MacroSection = {
  capitoloInizio?: number;
  capitoloFine?: number;
  etichetta?: string;
  sigla?: string;
  descrizione?: unknown;
};

type Props = {
  bookSlug: string;
  bookAbbreviation: string;
  totalChapters: number;
  sections: MacroSection[];
  fallback?: string;
};

function text(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(' · ');
  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;
    return text(item.descrizione) || text(item.etichetta) || text(item.titolo) || text(item.nome) || text(item.nota);
  }
  return '';
}

function sectionSize(section: MacroSection) {
  const start = Number(section.capitoloInizio);
  const end = Number(section.capitoloFine);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 1;
  return end - start + 1;
}

export default function LiteraryArchitectureMap({ bookSlug, bookAbbreviation, totalChapters, sections, fallback }: Props) {
  const usable = sections.filter((section) => Number.isFinite(Number(section.capitoloInizio)) && Number.isFinite(Number(section.capitoloFine)));

  if (!usable.length) {
    return <div className="mt-8 rounded-2xl border border-dashed border-papyrus-line bg-paper-card/45 p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Architettura letteraria</p>
      <p className="mt-3 leading-7 text-ink-soft">{fallback || 'Macro-sezioni strutturate non ancora registrate per questo libro.'}</p>
    </div>;
  }

  const sizes = usable.map(sectionSize);
  const measuredTotal = sizes.reduce((sum, value) => sum + value, 0) || totalChapters || 1;

  return <div className="mt-8">
    <div className="hidden overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm md:block">
      <div className="flex min-h-36 w-full">
        {usable.map((section, index) => {
          const start = Number(section.capitoloInizio);
          const end = Number(section.capitoloFine);
          const label = section.etichetta || section.sigla || `Sezione ${index + 1}`;
          const width = Math.max(10, (sizes[index] / measuredTotal) * 100);
          return <Link
            key={`${label}-${start}-${end}`}
            href={`/bibbia/${bookSlug}/${start}`}
            className="group relative flex min-w-[9rem] flex-col justify-between border-r border-papyrus-line p-5 transition last:border-r-0 hover:bg-papyrus-deep/45"
            style={{ width: `${width}%` }}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">{bookAbbreviation} {start}–{end}</p>
              <h3 className="mt-2 font-serif text-xl font-bold leading-tight group-hover:text-bronze">{label}</h3>
            </div>
            <div className="mt-5 flex items-end justify-between gap-3 text-xs text-ink-faint">
              <span>{sizes[index]} {sizes[index] === 1 ? 'capitolo' : 'capitoli'}</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>;
        })}
      </div>
      <div className="flex items-center justify-between border-t border-papyrus-line bg-papyrus/45 px-5 py-3 font-mono text-[10px] text-ink-faint">
        <span>1</span>
        <span>Estensione proporzionale delle macro-sezioni</span>
        <span>{totalChapters || measuredTotal}</span>
      </div>
    </div>

    <div className="space-y-0 md:hidden">
      {usable.map((section, index) => {
        const start = Number(section.capitoloInizio);
        const end = Number(section.capitoloFine);
        const label = section.etichetta || section.sigla || `Sezione ${index + 1}`;
        return <Link key={`${label}-${start}-${end}-mobile`} href={`/bibbia/${bookSlug}/${start}`} className="group grid grid-cols-[2.2rem_1fr_auto] gap-3 border-l border-papyrus-line pb-6 last:pb-0">
          <span className="relative -left-[0.43rem] mt-1 h-3 w-3 rounded-full border-2 border-bronze bg-papyrus" aria-hidden="true" />
          <span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-bronze">{bookAbbreviation} {start}–{end}</span>
            <strong className="mt-1 block font-serif text-xl group-hover:text-bronze">{label}</strong>
            {text(section.descrizione) && <span className="mt-2 block text-sm leading-6 text-ink-soft">{text(section.descrizione)}</span>}
          </span>
          <span className="pt-4 text-sm text-ink-faint" aria-hidden="true">→</span>
        </Link>;
      })}
    </div>

    <div className="mt-6 divide-y divide-papyrus-line border-y border-papyrus-line">
      {usable.map((section, index) => {
        const start = Number(section.capitoloInizio);
        const end = Number(section.capitoloFine);
        const label = section.etichetta || section.sigla || `Sezione ${index + 1}`;
        return <Link key={`${label}-${start}-${end}-detail`} href={`/bibbia/${bookSlug}/${start}`} className="group grid gap-2 py-4 sm:grid-cols-[4.5rem_1fr_auto] sm:items-start">
          <span className="font-mono text-xs text-bronze">{String(index + 1).padStart(2, '0')}</span>
          <span>
            <strong className="font-serif text-xl group-hover:text-bronze">{label}</strong>
            {text(section.descrizione) && <span className="mt-1 block text-sm leading-6 text-ink-soft">{text(section.descrizione)}</span>}
          </span>
          <span className="text-xs text-ink-faint">{bookAbbreviation} {start}–{end} →</span>
        </Link>;
      })}
    </div>
  </div>;
}
