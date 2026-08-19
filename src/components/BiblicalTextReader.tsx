'use client';

import { useEffect, useMemo, useState } from 'react';

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

type WitnessIdentity = {
  badge: string;
  name: string;
};

function normalize(value?: string) {
  return (value || '').trim().toLocaleLowerCase('it-IT');
}

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

function languageBadge(text: BiblicalTextUnit) {
  const language = normalize(text.lingua);
  const tradition = normalize(text.tradizione);

  if (language === 'it' || language.includes('ital') || tradition.includes('cei') || tradition === 'traduzione_italiana') return 'ITA';
  if (language === 'he' || language.includes('ebra') || tradition === 'mt' || tradition === 'ester_ebraico') return 'HEB';
  if (language === 'grc' || language.includes('grec') || tradition.includes('lxx') || tradition.includes('greco') || tradition.includes('teodozione') || tradition.includes('_og')) return 'GRE';
  if (language === 'la' || language.includes('latin') || tradition.includes('vulg')) return 'LAT';

  return (text.lingua || 'TXT').slice(0, 3).toLocaleUpperCase('it-IT');
}

function witnessName(text: BiblicalTextUnit) {
  const tradition = normalize(text.tradizione);
  const witness = text.testimone || '';
  const edition = text.edizione || '';

  if (tradition === 'traduzione_italiana' || tradition.includes('cei')) return 'CEI 2008';
  if (tradition === 'mt' || /westminster leningrad codex|\bwlc\b/i.test(witness)) return 'WLC';
  if (tradition === 'daniele_greco_og') return 'OLD GREEK';
  if (tradition === 'daniele_teodozione') return 'THEODOTION';
  if (tradition === 'susanna_og') return 'SUSANNA · OLD GREEK';
  if (tradition === 'susanna_teodozione') return 'SUSANNA · THEODOTION';
  if (tradition === 'bel_og') return 'BEL · OLD GREEK';
  if (tradition === 'bel_teodozione') return 'BEL · THEODOTION';
  if (tradition === 'lxx') return 'LXX';
  if (tradition === 'vulgata') return 'VULGATA';
  if (tradition === 'ester_ebraico') return 'TESTO EBRAICO';
  if (tradition === 'ester_greco') return 'TESTO GRECO';

  if (/bel e il drago.*old greek/i.test(witness)) return 'BEL · OLD GREEK';
  if (/bel e il drago.*theodotion/i.test(witness)) return 'BEL · THEODOTION';
  if (/susanna.*old greek/i.test(witness)) return 'SUSANNA · OLD GREEK';
  if (/susanna.*theodotion/i.test(witness)) return 'SUSANNA · THEODOTION';
  if (/^old greek$/i.test(witness)) return 'OLD GREEK';
  if (/^theodotion$/i.test(witness)) return 'THEODOTION';
  if (/vulgata/i.test(witness) || /vulgata/i.test(edition)) return 'VULGATA';

  return (witness || edition || text.tradizione || 'Testo biblico').toLocaleUpperCase('it-IT');
}

function witnessIdentity(text: BiblicalTextUnit): WitnessIdentity {
  return { badge: languageBadge(text), name: witnessName(text) };
}

function witnessKey(text: BiblicalTextUnit, index: number) {
  const identity = witnessIdentity(text);
  return [identity.badge, identity.name, text.tradizione, text.edizione, text.numero, index]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .join('-')
    .replace(/[^a-z0-9_-]/gi, '-')
    .toLocaleLowerCase('it-IT');
}

function WitnessIdentityMark({ text, selected = false, compact = false }: { text: BiblicalTextUnit; selected?: boolean; compact?: boolean }) {
  const identity = witnessIdentity(text);
  return (
    <span className="inline-flex min-w-0 items-center gap-2" dir="ltr">
      <span className={`inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.08em] ${selected ? 'border-bronze bg-bronze/10 text-bronze' : 'border-papyrus-line bg-paper-card text-ink-faint'}`}>
        {identity.badge}
      </span>
      <span className={`${compact ? 'text-[10px]' : 'text-xs'} min-w-0 truncate font-semibold tracking-[0.02em]`}>
        {identity.name}
      </span>
    </span>
  );
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

function verseAnchor(prefix: string, verse: BiblicalVerse, index: number) {
  const label = verseLabel(verse).replace(/[^a-z0-9_-]/gi, '-');
  return `${prefix}-v${label}-${index}`;
}

function SingleWitness({
  text,
  critical = false,
  compact = false,
  anchorPrefix = 'reader',
}: {
  text: BiblicalTextUnit;
  critical?: boolean;
  compact?: boolean;
  anchorPrefix?: string;
}) {
  const chapterAlt = alternateChapter(text);
  const verses = Array.isArray(text.versetti) ? text.versetti : [];
  const hasAlternate = chapterAlt != null || verses.some((verse) => verse.riferimentoAlternativo);
  const rtl = text.direzione === 'rtl' || normalize(text.lingua).includes('ebra') || normalize(text.lingua) === 'he';

  return (
    <div className={compact ? '' : 'reading-text mx-auto max-w-[820px]'} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="mb-7 border-b border-papyrus-line pb-5" dir="ltr">
        <div className="flex flex-wrap items-start justify-between gap-3 text-xs text-ink-faint">
          <WitnessIdentityMark text={text} />
          {text.edizione && <span className="max-w-[55%] text-right leading-5">{text.edizione}</span>}
        </div>
        {text.testimone && normalize(text.testimone) !== normalize(witnessName(text)) && (
          <p className="mt-2 text-xs leading-5 text-ink-faint">{text.testimone}</p>
        )}

        {hasAlternate && (
          <div className="mt-4 rounded-xl border border-papyrus-line bg-papyrus/55 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-bronze/50 bg-paper-card px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-bronze">Numerazione parallela</span>
              {chapterAlt && <span className="text-sm font-medium text-ink">{systemLabel(chapterAlt.sistema)}: {chapterAlt.numero}</span>}
            </div>
          </div>
        )}
      </div>

      <div className={`space-y-5 font-serif text-[1.22em] leading-[1.8] text-ink ${rtl ? 'text-right' : ''}`}>
        {verses.map((verse, index) => {
          const alt = verse.riferimentoAlternativo;
          const verseSystem = systemLabel(alt?.sistema || chapterAlt?.sistema);
          const altBook = alt?.salmo != null ? `Sal ${alt.salmo}` : alt?.capitolo != null ? `cap. ${alt.capitolo}` : null;
          const altLabel = alt ? `${verseSystem} → ${altBook ? `${altBook},` : ''}${alt.versetto}` : null;
          const statusLabel = textualStatusLabel(verse.statoTestuale);
          const label = verseLabel(verse);
          const anchor = verseAnchor(anchorPrefix, verse, index);
          const suffixMarker = verse.marcatoreAlfabetico && !/^[a-z]$/i.test(verse.marcatoreAlfabetico) ? verse.marcatoreAlfabetico : null;

          return (
            <div key={verse._key || `${label}-${index}`} id={anchor} className="scroll-mt-28">
              {verse.metatesto?.testo && <p className="mb-3 text-[0.86em] italic leading-7 text-ink-soft">{verse.metatesto.testo}</p>}
              {verse.testo && (
                <div className={critical && altLabel ? 'grid gap-1 md:grid-cols-[minmax(0,1fr)_auto] md:gap-5' : ''}>
                  <p className="min-w-0 break-words">
                    {suffixMarker && <span className="mr-2 font-sans text-[0.58em] font-semibold uppercase tracking-wider text-bronze">{suffixMarker}</span>}
                    <a href={`#${anchor}`} aria-label={`Versetto ${label}`} className="mx-2 inline-block align-[0.12em] font-sans text-[0.62em] font-semibold text-bronze no-underline hover:text-seal" dir="ltr">[{label}]</a>
                    <span>{verse.testo}</span>
                  </p>
                  {critical && altLabel && (
                    <aside className="self-start pt-1 font-sans text-[0.58em] leading-5 text-ink-faint md:max-w-[150px]" aria-label={`Numerazione parallela del versetto ${label}`} dir="ltr">
                      <span className="inline-flex rounded-md border border-papyrus-line bg-paper-card px-2 py-1 font-mono text-[10px] tracking-wide text-ink-soft">{altLabel}</span>
                    </aside>
                  )}
                </div>
              )}
              {!verse.testo && statusLabel && (
                <div className="rounded-xl border border-papyrus-line bg-papyrus/45 px-4 py-3 font-sans text-sm leading-6 text-ink-soft" dir="ltr">
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`#${anchor}`} aria-label={`Versetto ${label}`} className="font-semibold text-bronze no-underline hover:text-seal">[{label}]</a>
                    <span className="font-medium text-ink">{statusLabel}</span>
                  </div>
                  {verse.notaEditoriale && <p className="mt-1 text-xs leading-5 text-ink-faint">{verse.notaEditoriale}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WitnessPicker({
  label,
  value,
  witnesses,
  onChange,
  disabledIndex,
}: {
  label: string;
  value: number;
  witnesses: BiblicalTextUnit[];
  onChange: (index: number) => void;
  disabledIndex?: number;
}) {
  return (
    <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-xs text-ink-faint">
      <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="rounded-xl border border-papyrus-line bg-paper-card px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-bronze">
        {witnesses.map((witness, index) => {
          const identity = witnessIdentity(witness);
          return <option key={witnessKey(witness, index)} value={index} disabled={index === disabledIndex}>{identity.badge} · {identity.name}</option>;
        })}
      </select>
    </label>
  );
}

export default function BiblicalTextReader({ text, critical = false }: { text: BiblicalTextUnit; critical?: boolean }) {
  const witnesses = useMemo(() => {
    const supplied = Array.isArray(text.witnesses) ? text.witnesses.filter(Boolean) : [];
    return supplied.length ? supplied : [text];
  }, [text]);

  const [selected, setSelected] = useState(0);
  const [secondary, setSecondary] = useState(1);
  const [mode, setMode] = useState<ReaderMode>('single');
  const multiple = witnesses.length > 1;

  useEffect(() => {
    if (selected >= witnesses.length) setSelected(0);
    if (secondary >= witnesses.length || secondary === selected) {
      const next = witnesses.findIndex((_, index) => index !== selected);
      setSecondary(next >= 0 ? next : 0);
    }
  }, [selected, secondary, witnesses]);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('mode');
    if (requested === 'compare' && witnesses.length > 1) setMode('compare');
    else if (requested === 'synopsis' && witnesses.length >= 3) setMode('synopsis');
    else if (requested === 'single') setMode('single');
  }, [witnesses.length]);

  const current = witnesses[Math.min(selected, witnesses.length - 1)] || text;
  const second = witnesses[Math.min(secondary, witnesses.length - 1)] || witnesses[0] || text;

  return (
    <div className="min-w-0">
      {multiple && (
        <div className="mb-8 rounded-2xl border border-papyrus-line bg-papyrus/45 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Tradizioni testuali</p>
              <p className="mt-1 text-sm leading-6 text-ink-faint">Leggi un testimone, confrontane due oppure apri la sinossi completa.</p>
            </div>
            <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-papyrus-line bg-paper-card p-1" role="group" aria-label="Modalità del Reader">
              {([['single', 'Lettura'], ['compare', 'Confronto'], ['synopsis', 'Sinossi']] as const).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setMode(value)} disabled={value === 'synopsis' && witnesses.length < 3} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${mode === value ? 'bg-bronze text-white' : 'text-ink-soft hover:text-bronze'} disabled:cursor-not-allowed disabled:opacity-35`} aria-pressed={mode === value}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'single' && (
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Testimone testuale">
              {witnesses.map((witness, index) => {
                const active = selected === index;
                return (
                  <button key={witnessKey(witness, index)} type="button" role="tab" aria-selected={active} onClick={() => setSelected(index)} className={`inline-flex min-w-0 items-center rounded-full border px-3 py-2 transition ${active ? 'border-bronze bg-paper-card text-bronze shadow-sm' : 'border-papyrus-line text-ink-soft hover:border-bronze/60 hover:text-bronze'}`}>
                    <WitnessIdentityMark text={witness} selected={active} />
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'compare' && (
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <WitnessPicker label="Testo A" value={selected} witnesses={witnesses} onChange={setSelected} disabledIndex={secondary} />
              <WitnessPicker label="Testo B" value={secondary} witnesses={witnesses} onChange={setSecondary} disabledIndex={selected} />
            </div>
          )}

          {mode === 'synopsis' && witnesses.length >= 3 && (
            <p className="mt-4 text-xs leading-5 text-ink-faint">La sinossi conserva una larghezza minima leggibile per ogni testimone. Su schermi più stretti scorri orizzontalmente.</p>
          )}
        </div>
      )}

      {mode === 'compare' && multiple ? (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[760px] grid-cols-2 gap-6">
            {[current, second].map((witness, index) => (
              <section key={`${witnessKey(witness, index)}-compare`} className="min-w-0 rounded-2xl border border-papyrus-line bg-paper-card/35 p-5 md:p-6">
                <SingleWitness text={witness} critical={critical} compact anchorPrefix={`compare-${index}-${witnessKey(witness, index)}`} />
              </section>
            ))}
          </div>
        </div>
      ) : mode === 'synopsis' && witnesses.length >= 3 ? (
        <div className="overflow-x-auto pb-3">
          <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${witnesses.length}, minmax(320px, 1fr))`, minWidth: `${witnesses.length * 320}px` }}>
            {witnesses.map((witness, index) => (
              <section key={`${witnessKey(witness, index)}-synopsis`} className="min-w-0 rounded-2xl border border-papyrus-line bg-paper-card/35 p-5">
                <SingleWitness text={witness} critical={critical} compact anchorPrefix={`synopsis-${index}-${witnessKey(witness, index)}`} />
              </section>
            ))}
          </div>
        </div>
      ) : (
        <SingleWitness text={current} critical={critical} anchorPrefix={`single-${witnessKey(current, selected)}`} />
      )}
    </div>
  );
}
