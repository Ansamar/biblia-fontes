'use client';

import {useEffect, useMemo, useState} from 'react';

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
  testimone?: string;
  direzione?: 'ltr' | 'rtl' | string;
  versetti: BiblicalVerse[];
  witnesses?: BiblicalTextUnit[];
};

type ReaderMode = 'single' | 'compare' | 'synopsis';

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
  if (text.tradizione === 'mt') return 'Ebraico · MT';
  if (text.tradizione === 'lxx') return 'Greco · LXX';
  return text.edizione || text.tradizione || 'Testo biblico';
}

function witnessShortLabel(text: BiblicalTextUnit) {
  const language = (text.lingua || '').toLocaleLowerCase('it-IT');
  if (language.includes('ital') || (text.tradizione || '').includes('cei')) return 'Italiano';
  if (language.includes('ebra') || text.tradizione === 'mt') return 'Ebraico';
  if (language.includes('grec') || (text.tradizione || '').includes('lxx')) return 'Greco';
  if (language.includes('latin') || (text.tradizione || '').includes('vulg')) return 'Latino';
  return witnessLabel(text);
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
  const rtl = text.direzione === 'rtl' || (text.lingua || '').toLocaleLowerCase('it-IT').includes('ebra');

  return <div className={compact ? '' : 'reading-text mx-auto max-w-[820px]'} dir={rtl ? 'rtl' : 'ltr'}>
    <div className="mb-7 border-b border-papyrus-line pb-5" dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-faint">
        <span>{text.edizione || 'Testo biblico'}</span>
        <span>{text.lingua || 'Italiano'}</span>
      </div>
      {text.testimone && <p className="mt-2 text-xs leading-5 text-ink-faint">{text.testimone}</p>}

      {hasAlternate && <div className="mt-4 rounded-xl border border-papyrus-line bg-papyrus/55 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-bronze/50 bg-paper-card px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-bronze">Numerazione parallela</span>
          {chapterAlt && <span className="text-sm font-medium text-ink">{systemLabel(chapterAlt.sistema)}: Salmo {chapterAlt.numero}</span>}
        </div>
      </div>}
    </div>

    <div className={`space-y-5 font-serif text-[1.22em] leading-[1.8] text-ink ${rtl ? 'text-right' : ''}`}>
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
              <a href={`#${anchor}`} aria-label={`Versetto ${label}`} className="mx-2 inline-block align-[0.12em] font-sans text-[0.62em] font-semibold text-bronze no-underline hover:text-seal" dir="ltr">[{label}]</a>
              <span>{verse.testo}</span>
            </p>
            {critical && altLabel && <aside className="self-start pt-1 font-sans text-[0.58em] leading-5 text-ink-faint md:max-w-[150px]" aria-label={`Numerazione parallela del versetto ${label}`} dir="ltr">
              <span className="inline-flex rounded-md border border-papyrus-line bg-paper-card px-2 py-1 font-mono text-[10px] tracking-wide text-ink-soft">{altLabel}</span>
            </aside>}
          </div>}
          {!verse.testo && statusLabel && <div className="rounded-xl border border-papyrus-line bg-papyrus/45 px-4 py-3 font-sans text-sm leading-6 text-ink-soft" dir="ltr">
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

function WitnessPicker({label, value, witnesses, onChange, disabledIndex}: {label: string; value: number; witnesses: BiblicalTextUnit[]; onChange: (index: number) => void; disabledIndex?: number}) {
  return <label className="flex min-w-[180px] flex-1 flex-col gap-1.5 text-xs text-ink-faint">
    <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
    <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="rounded-xl border border-papyrus-line bg-paper-card px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-bronze">
      {witnesses.map((witness, index) => <option key={`${witnessLabel(witness)}-${index}`} value={index} disabled={index === disabledIndex}>{witnessShortLabel(witness)} — {witnessLabel(witness)}</option>)}
    </select>
  </label>;
}

export default function BiblicalTextReader({ text, critical = false }: { text: BiblicalTextUnit; critical?: boolean }) {
  const witnesses = useMemo(() => {
    const supplied = Array.isArray(text.witnesses) ? text.witnesses : [];
    return supplied.length ? supplied : [text];
  }, [text]);

  const [selected, setSelected] = useState(0);
  const [secondary, setSecondary] = useState(1);
  const [mode, setMode] = useState<ReaderMode>('single');
  const multiple = witnesses.length > 1;

  useEffect(() => {
    if (secondary >= witnesses.length || secondary === selected) {
      const next = witnesses.findIndex((_, index) => index !== selected);
      setSecondary(next >= 0 ? next : 0);
    }
  }, [selected, secondary, witnesses]);

  const current = witnesses[Math.min(selected, witnesses.length - 1)] || text;
  const second = witnesses[Math.min(secondary, witnesses.length - 1)] || witnesses[0] || text;

  return <div>
    {multiple && <div className="mb-8 rounded-2xl border border-papyrus-line bg-papyrus/45 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Tradizioni testuali</p>
          <p className="mt-1 text-sm leading-6 text-ink-faint">Leggi una versione, confrontane due oppure apri la sinossi completa.</p>
        </div>
        <div className="inline-flex rounded-full border border-papyrus-line bg-paper-card p-1" role="group" aria-label="Modalità del Reader">
          {([['single','Lettura'],['compare','Confronto'],['synopsis','Sinossi']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setMode(value)} disabled={value === 'synopsis' && witnesses.length < 3} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${mode === value ? 'bg-bronze text-white' : 'text-ink-soft hover:text-bronze'} disabled:cursor-not-allowed disabled:opacity-35`} aria-pressed={mode === value}>{label}</button>)}
        </div>
      </div>

      {mode === 'single' && <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Tradizione testuale">
        {witnesses.map((witness, index) => <button key={`${witness.tradizione || witness.edizione || index}-${index}`} type="button" role="tab" aria-selected={selected === index} onClick={() => setSelected(index)} className={`rounded-full border px-4 py-2 text-xs font-semibold ${selected === index ? 'border-bronze text-bronze' : 'border-papyrus-line text-ink-soft hover:border-bronze/60 hover:text-bronze'}`}>{witnessShortLabel(witness)}</button>)}
      </div>}

      {mode === 'compare' && <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <WitnessPicker label="Testo A" value={selected} witnesses={witnesses} onChange={setSelected} disabledIndex={secondary} />
        <WitnessPicker label="Testo B" value={secondary} witnesses={witnesses} onChange={setSecondary} disabledIndex={selected} />
      </div>}
    </div>}

    {mode === 'compare' && multiple
      ? <div className="grid gap-6 2xl:grid-cols-2">{[current, second].map((witness,index) => <section key={`${witness.tradizione || witness.edizione || index}-compare-${index}`} className="min-w-0 rounded-2xl border border-papyrus-line bg-paper-card/35 p-5 md:p-6"><p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-bronze" dir="ltr">{witnessShortLabel(witness)} · {witnessLabel(witness)}</p><SingleWitness text={witness} critical={critical} compact /></section>)}</div>
      : mode === 'synopsis' && witnesses.length >= 3
        ? <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">{witnesses.map((witness,index) => <section key={`${witness.tradizione || witness.edizione || index}-synopsis`} className="min-w-0 rounded-2xl border border-papyrus-line bg-paper-card/35 p-5"><p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-bronze" dir="ltr">{witnessShortLabel(witness)} · {witnessLabel(witness)}</p><SingleWitness text={witness} critical={critical} compact /></section>)}</div>
        : <SingleWitness text={current} critical={critical} />}
  </div>;
}
