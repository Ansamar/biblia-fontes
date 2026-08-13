'use client';

export type BiblicalVerse = {
  numero: number;
  testo: string;
  metatesto?: { testo: string; stile?: string };
  marcatoreAlfabetico?: string;
  riferimentoAlternativo?: { salmo?: number; capitolo?: number; versetto: number };
};

export type BiblicalTextUnit = {
  numero: number;
  numeroAlternativo?: number;
  edizione?: string;
  lingua?: string;
  versetti: BiblicalVerse[];
};

export default function BiblicalTextReader({ text, critical = false }: { text: BiblicalTextUnit; critical?: boolean }) {
  return <div className="reading-text mx-auto max-w-[760px]">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-papyrus-line pb-4 text-xs text-ink-faint">
      <span>{text.edizione || 'Testo biblico'}</span>
      <span>{text.lingua || 'Italiano'}{text.numeroAlternativo != null ? ` · numerazione alternativa ${text.numeroAlternativo}` : ''}</span>
    </div>
    <div className="space-y-5 font-serif text-[1.22em] leading-[1.75] text-ink">
      {text.versetti.map((verse) => {
        const alt = verse.riferimentoAlternativo;
        const altLabel = alt ? `${alt.salmo ?? alt.capitolo ?? ''}${alt.salmo || alt.capitolo ? ',' : ''}${alt.versetto}` : null;
        return <div key={verse.numero} id={`v${verse.numero}`} className="scroll-mt-28">
          {verse.metatesto?.testo && <p className="mb-3 text-[0.86em] italic leading-7 text-ink-soft">{verse.metatesto.testo}</p>}
          {verse.testo && <p>
            {verse.marcatoreAlfabetico && <span className="mr-2 font-sans text-[0.58em] font-semibold uppercase tracking-wider text-bronze">{verse.marcatoreAlfabetico}</span>}
            <a href={`#v${verse.numero}`} aria-label={`Versetto ${verse.numero}`} className="mr-2 inline-block align-[0.12em] font-sans text-[0.62em] font-semibold text-bronze no-underline hover:text-seal">[{verse.numero}{critical && altLabel ? ` | ${altLabel}` : ''}]</a>
            <span>{verse.testo}</span>
          </p>}
        </div>;
      })}
    </div>
  </div>;
}
