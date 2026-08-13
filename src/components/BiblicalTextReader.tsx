'use client';

export type BiblicalVerse = {
  numero: number;
  testo: string;
  metatesto?: { testo: string; stile?: string };
  marcatoreAlfabetico?: string;
  riferimentoAlternativo?: { salmo?: number; capitolo?: number; versetto: number; sistema?: string };
};

export type BiblicalTextUnit = {
  numero: number;
  numeroAlternativo?: number;
  sistemaAlternativo?: string;
  edizione?: string;
  lingua?: string;
  versetti: BiblicalVerse[];
};

function alternateSystem(text: BiblicalTextUnit) {
  return text.sistemaAlternativo || 'LXX/Vg';
}

export default function BiblicalTextReader({ text, critical = false }: { text: BiblicalTextUnit; critical?: boolean }) {
  const system = alternateSystem(text);
  const hasAlternate = text.numeroAlternativo != null || text.versetti.some((verse) => verse.riferimentoAlternativo);

  return <div className="reading-text mx-auto max-w-[760px]">
    <div className="mb-7 border-b border-papyrus-line pb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-faint">
        <span>{text.edizione || 'Testo biblico'}</span>
        <span>{text.lingua || 'Italiano'}</span>
      </div>

      {hasAlternate && <div className="mt-4 rounded-xl border border-papyrus-line bg-papyrus/55 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-bronze/50 bg-paper-card px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-bronze">Numerazione parallela</span>
          {text.numeroAlternativo != null && <span className="text-sm font-medium text-ink">{system}: Salmo {text.numeroAlternativo}</span>}
        </div>
        <details className="mt-3 text-sm leading-6 text-ink-soft">
          <summary className="cursor-pointer font-medium text-bronze">Perché due numerazioni?</summary>
          <p className="mt-2">La numerazione dei Salmi della tradizione ebraica/masoretica non coincide sempre con quella della Settanta e della Vulgata. Biblia Fontes mantiene il riferimento principale nel testo e segnala separatamente la numerazione parallela, così i due sistemi non vengono confusi.</p>
        </details>
      </div>}
    </div>

    <div className="space-y-5 font-serif text-[1.22em] leading-[1.75] text-ink">
      {text.versetti.map((verse) => {
        const alt = verse.riferimentoAlternativo;
        const altBook = alt?.salmo != null ? `Sal ${alt.salmo}` : alt?.capitolo != null ? `cap. ${alt.capitolo}` : null;
        const altLabel = alt ? `${system} → ${altBook ? `${altBook},` : ''}${alt.versetto}` : null;

        return <div key={verse.numero} id={`v${verse.numero}`} className="scroll-mt-28">
          {verse.metatesto?.testo && <p className="mb-3 text-[0.86em] italic leading-7 text-ink-soft">{verse.metatesto.testo}</p>}
          {verse.testo && <div className={critical && altLabel ? 'grid gap-1 md:grid-cols-[1fr_auto] md:gap-5' : ''}>
            <p>
              {verse.marcatoreAlfabetico && <span className="mr-2 font-sans text-[0.58em] font-semibold uppercase tracking-wider text-bronze">{verse.marcatoreAlfabetico}</span>}
              <a href={`#v${verse.numero}`} aria-label={`Versetto ${verse.numero}`} className="mr-2 inline-block align-[0.12em] font-sans text-[0.62em] font-semibold text-bronze no-underline hover:text-seal">[{verse.numero}]</a>
              <span>{verse.testo}</span>
            </p>
            {critical && altLabel && <aside className="self-start pt-1 font-sans text-[0.58em] leading-5 text-ink-faint md:max-w-[150px]" aria-label={`Numerazione parallela del versetto ${verse.numero}`}>
              <span className="inline-flex rounded-md border border-papyrus-line bg-paper-card px-2 py-1 font-mono text-[10px] tracking-wide text-ink-soft">{altLabel}</span>
            </aside>}
          </div>}
        </div>;
      })}
    </div>
  </div>;
}
