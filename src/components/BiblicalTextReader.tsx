'use client';

import {useMemo, useState} from 'react';

export type AlternateSystem = 'LXX_VG' | 'MT' | 'ALTRO' | string;

export type BiblicalVerse = {
  _key?: string;
  numero: number;
  testo: string;
  metatesto?: { testo: string; stile?: string };
  marcatoreAlfabetico?: string;
  riferimentoAlternativo?: { salmo?: number; capitolo?: number; versetto: number; sistema?: AlternateSystem };
  statoTestuale?: 'metatesto_solo' | 'omesso_nell_edizione' | 'lacunoso' | 'da_verificare' | string;
  notaEditoriale?: string;
};

export type AlternateChapterNumber = number | { sistema?: AlternateSystem; numero: number };

export type BiblicalTextUnit = {
  numero: number;
  numeroAlternativo?: AlternateChapterNumber;
  sistemaAlternativo?: string;
  edizione?: string;
  lingua?: string;
  tradizione?: string;
  versetti: BiblicalVerse[];
  witnesses?: BiblicalTextUnit[];
};

function systemLabel(system?: AlternateSystem) {
  if (!system || system === 'LXX_VG') return 'LXX/Vg';
  if (system === 'MT') return 'MT';
  return system;
}

function textualStatusLabel(status?: string) {
  if (status === 'metatesto_solo') return 'Solo soprascrizione / metatesto';
  if (status === 'omesso_nell_edizione') return 'Versetto omesso nell’edizione';
  if (status === 'lacunoso') return 'Testo lacunoso';
  if (status === 'da_verificare') return 'Testo da verificare';
  return status ? status.replaceAll('_', ' ') : null;
}

function witnessLabel(text: BiblicalTextUnit) {
  if (text.tradizione === 'ester_ebraico') return 'Testo ebraico';
  if (text.tradizione === 'ester_greco') return 'Testo greco';
  return text.edizione || text.tradizione || 'Testo biblico';
}

function alternateChapter(text: BiblicalTextUnit) {
  if (text.numeroAlternativo == null) return null;
  if (typeof text.numeroAlternativo === 'number') {
    return { numero: text.numeroAlternativo, sistema: text.sistemaAlternativo || 'LXX_VG' };
  }
  return {
    numero: text.numeroAlternativo.numero,
    sistema: text.numeroAlternativo.sistema || text.sistemaAlternativo || 'LXX_VG',
  };
}

function verseLabel(verse: BiblicalVerse) {
  const marker = verse.marcatoreAlfabetico;
  if (marker && /^[a-z]$/i.test(marker)) return `${verse.numero}${marker.toLowerCase()}`;
  return String(verse.numero);
}

function verseAnchor(verse: BiblicalVerse, index: number) {
  return `v${verseLabel(verse).replace(/[^a-z0-9_-]/gi, '-')}-${index}`;
}

function SingleWitness({text, critical = false, compact = false}: {text: BiblicalTextUnit; critical?: boolean; compact?: boolean}) {
  const chapterAlt = alternateChapter(text);
  const hasAlternate = chapterAlt != null || text.versetti.some((verse) => verse.riferimentoAlternativo);

  return <div className={compact ? '' : 'reading-text mx-auto max-w-[760px]'}>
    <div className="mb-7 border-b border-papyrus-line pb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-faint">
        <span>{text.edizione || 'Testo biblico'}</span>
        <span>{text.lingua || 'Italiano'}</span>
      </div>

      {hasAlternate && <div className="mt-4 rounded-xl border border-papyrus-line bg-papyrus/55 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-bronze/50 bg-paper-card px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-bronze">Numerazione parallela</span>
          {chapterAlt && <span className="text-sm font-medium text-ink">{systemLabel(chapterAlt.sistema)}: Salmo {chapterAlt.numero}</span>}
        </div>
        <details className="mt-3 text-sm leading-6 text-ink-soft">
          <summary className="cursor-pointer font-medium text-bronze">Perché due numerazioni?</summary>
          <p className="mt-2">La numerazione dei Salmi della tradizione ebraica/masoretica non coincide sempre con quella della Settanta e della Vulgata. Biblia Fontes mantiene il riferimento principale nel testo e segnala separatamente la numerazione parallela.</p>
        </details>
      </div>}
    </div>

    <div className="space-y-5 font-serif text-[1.22em] leading-[1.75] text-ink">
      {text.versetti.map((verse, index) => {
        const alt = verse.riferimentoAlternativo;
        const verseSystem = systemLabel(alt?.sistema || chapterAlt?.sistema);
        const altBook = alt?.salmo != null ? `Sal ${alt.salmo}` : alt?.capitolo != null ? `cap. ${alt.capitolo}` : null;
        const altLabel = alt ? `${verseSystem} → ${altBook ? `${altBook},` : ''}${alt.versetto}` : null;
        const statusLabel = textualStatusLabel(verse.statoTestuale);
        const label = verseLabel(verse);
        const anchor = verseAnchor(verse, index);
        const suffixMarker = verse.marcatoreAlfabetico && !/^[a-z]$/i.test(verse.marcatoreAlfabetico) ? verse.marcatoreAlfabetico : null;

        return <div key={verse._key || `${label}-${index}`} id={anchor} className="scroll-mt-28">
          {verse.metatesto?.testo && <p className="mb-3 text-[0.86em] italic leading-7 text-ink-soft">{verse.metatesto.testo}</p>}
          {verse.testo && <div className={critical && altLabel ? 'grid gap-1 md:grid-cols-[1fr_auto] md:gap-5' : ''}>
            <p>
              {suffixMarker && <span className="mr-2 font-sans text-[0.58em] font-semibold uppercase tracking-wider text-bronze">{suffixMarker}</span>}
              <a href={`#${anchor}`} aria-label={`Versetto ${label}`} className="mr-2 inline-block align-[0.12em] font-sans text-[0.62em] font-semibold text-bronze no-underline hover:text-seal">[{label}]</a>
              <span>{verse.testo}</span>
            </p>
            {critical && altLabel && <aside className="self-start pt-1 font-sans text-[0.58em] leading-5 text-ink-faint md:max-w-[150px]" aria-label={`Numerazione parallela del versetto ${label}`}>
              <span className="inline-flex rounded-md border border-papyrus-line bg-paper-card px-2 py-1 font-mono text-[10px] tracking-wide text-ink-soft">{altLabel}</span>
            </aside>}
          </div>}
          {!verse.testo && statusLabel && <div className="rounded-xl border border-papyrus-line bg-papyrus/45 px-4 py-3 font-sans text-sm leading-6 text-ink-soft">
            <div className="flex flex-wrap items-center gap-2">
              <a href={`#${anchor}`} aria-label={`Versetto ${label}`} className="font-semibold text-bronze no-underline hover:text-seal">[{label}]</a>
              <span className="font-medium text-ink">{statusLabel}</span>
            </div>
            {verse.notaEditoriale && <p className="mt-1 text-xs leading-5 text-ink-faint">{verse.notaEditoriale}</p>}
          </div>}
        </div>;
      })}
    </div>
  </div>;
}

export default function BiblicalTextReader({ text, critical = false }: { text: BiblicalTextUnit; critical?: boolean }) {
  const witnesses = useMemo(() => {
    const supplied = Array.isArray(text.witnesses) ? text.witnesses : [];
    return supplied.length ? supplied : [text];
  }, [text]);
  const [selected, setSelected] = useState(0);
  const [compare, setCompare] = useState(false);
  const current = witnesses[Math.min(selected, witnesses.length - 1)] || text;
  const multiple = witnesses.length > 1;

  return <div>
    {multiple && <div className="mb-8 rounded-2xl border border-papyrus-line bg-papyrus/45 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Tradizioni testuali</p>
          <p className="mt-1 text-sm leading-6 text-ink-faint">Le forme testuali restano distinte: puoi leggerle separatamente oppure affiancarle.</p>
        </div>
        <button type="button" onClick={() => setCompare((value) => !value)} className="rounded-full border border-papyrus-line px-4 py-2 text-xs font-semibold text-ink-soft hover:border-bronze hover:text-bronze" aria-pressed={compare}>{compare ? 'Vista singola' : 'Affianca'}</button>
      </div>
      {!compare && <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Tradizione testuale">
        {witnesses.map((witness, index) => <button key={`${witness.tradizione || witness.edizione || index}-${index}`} type="button" role="tab" aria-selected={selected === index} onClick={() => setSelected(index)} className={`rounded-full border px-4 py-2 text-xs font-semibold ${selected === index ? 'border-bronze text-bronze' : 'border-papyrus-line text-ink-soft hover:border-bronze/60 hover:text-bronze'}`}>{witnessLabel(witness)}</button>)}
      </div>}
    </div>}

    {compare && multiple
      ? <div className="grid gap-8 xl:grid-cols-2">{witnesses.slice(0,2).map((witness,index) => <section key={`${witness.tradizione || index}-compare`} className="min-w-0 rounded-2xl border border-papyrus-line bg-paper-card/35 p-5"><p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-bronze">{witnessLabel(witness)}</p><SingleWitness text={witness} critical={critical} compact /></section>)}</div>
      : <SingleWitness text={current} critical={critical} />}
  </div>;
}
