'use client';

import { useMemo, useState } from 'react';
import type { BiblicalTextUnit, BiblicalVerse } from '../components/BiblicalTextReader';

type Mode = 'read' | 'compare' | 'synopsis';

const norm = (value?: string) => (value || '').trim().toLocaleLowerCase('it-IT');

function badge(unit: BiblicalTextUnit) {
  const language = norm(unit.lingua);
  const tradition = norm(unit.tradizione);
  if (language === 'it' || tradition.includes('cei')) return 'ITA';
  if (language === 'he' || tradition === 'mt' || tradition.includes('ebra')) return 'HEB';
  if (language === 'grc' || tradition.includes('lxx') || tradition.includes('greco') || tradition.includes('teodo')) return 'GRE';
  if (language === 'la' || tradition.includes('vulg')) return 'LAT';
  return (unit.lingua || 'TXT').slice(0, 3).toUpperCase();
}

function name(unit: BiblicalTextUnit) {
  const tradition = norm(unit.tradizione);
  if (tradition.includes('cei') || tradition === 'traduzione_italiana') return 'CEI 2008';
  if (tradition === 'mt') return unit.testimone || 'Testo masoretico';
  if (tradition === 'lxx') return 'Settanta';
  if (tradition.includes('vulg')) return 'Vulgata';
  if (tradition.includes('teodo')) return 'Teodozione';
  if (tradition.includes('old') || tradition.endsWith('_og')) return 'Old Greek';
  return unit.testimone || unit.edizione || unit.tradizione || 'Testo';
}

function isRtl(unit: BiblicalTextUnit) {
  return unit.direzione === 'rtl' || norm(unit.lingua) === 'he' || norm(unit.lingua).includes('ebra');
}

function verseLabel(verse: BiblicalVerse) {
  return `${verse.numero}${verse.marcatoreAlfabetico || ''}`;
}

function WitnessHeader({ unit }: { unit: BiblicalTextUnit }) {
  return <div className="mb-5 flex min-h-9 items-start justify-between gap-4 border-b border-papyrus-line pb-3" dir="ltr">
    <div className="min-w-0">
      <div className="flex items-center gap-2"><span className="font-mono text-[9px] font-semibold tracking-[0.12em] text-bronze">{badge(unit)}</span><strong className="truncate text-xs font-semibold text-ink">{name(unit)}</strong></div>
      {unit.edizione && norm(unit.edizione) !== norm(name(unit)) && <p className="mt-1 truncate text-[10px] text-ink-faint">{unit.edizione}</p>}
    </div>
    <span className="shrink-0 font-mono text-[9px] text-ink-faint">cap. {unit.numero}</span>
  </div>;
}

function WitnessText({ unit, compact = false }: { unit: BiblicalTextUnit; compact?: boolean }) {
  const rtl = isRtl(unit);
  return <div dir={rtl ? 'rtl' : 'ltr'} className={rtl ? 'text-right' : ''}>
    <WitnessHeader unit={unit} />
    <div className={`${compact ? 'text-[1.02rem] leading-[1.75]' : 'reading-text text-[1.12rem] leading-[1.86]'} font-serif text-ink`}>
      {(unit.versetti || []).map((verse, index) => <div key={verse._key || `${verse.numero}-${index}`} className="mb-4 break-words">
        {verse.metatesto?.testo && <p className="mb-2 text-[0.82em] italic leading-6 text-ink-faint">{verse.metatesto.testo}</p>}
        {verse.testo ? <p><span dir="ltr" className="mr-2 inline-block align-[0.15em] font-sans text-[0.58em] font-semibold text-bronze">{verseLabel(verse)}</span>{verse.testo}</p> : <p className="border-l-2 border-papyrus-line pl-3 font-sans text-sm text-ink-faint">{verse.notaEditoriale || verse.statoTestuale || `Versetto ${verseLabel(verse)} senza testo`}</p>}
      </div>)}
    </div>
  </div>;
}

function WitnessSelect({ value, onChange, witnesses, label }: { value: number; onChange: (value: number) => void; witnesses: BiblicalTextUnit[]; label: string }) {
  return <label className="flex items-center gap-2 text-xs text-ink-faint"><span className="font-mono text-[9px] uppercase tracking-[0.12em]">{label}</span><select value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-w-0 border-0 border-b border-papyrus-line bg-transparent py-1.5 text-xs font-semibold text-ink outline-none focus:border-bronze">{witnesses.map((unit, index) => <option key={`${badge(unit)}-${name(unit)}-${index}`} value={index}>{badge(unit)} · {name(unit)}</option>)}</select></label>;
}

export default function WorkspaceReader({ text }: { text: BiblicalTextUnit }) {
  const witnesses = useMemo(() => Array.isArray(text.witnesses) && text.witnesses.length ? text.witnesses : [text], [text]);
  const [mode, setMode] = useState<Mode>('read');
  const [primary, setPrimary] = useState(0);
  const [secondary, setSecondary] = useState(Math.min(1, witnesses.length - 1));
  const canCompare = witnesses.length > 1;
  const canSynopsis = witnesses.length > 2;

  const modes: Array<{id: Mode; label: string; disabled?: boolean}> = [
    {id:'read', label:'Lettura'},
    {id:'compare', label:'Confronto', disabled: !canCompare},
    {id:'synopsis', label:'Sinossi', disabled: !canSynopsis},
  ];

  return <div className="min-w-0">
    <div className="mb-7 flex flex-col gap-4 border-y border-papyrus-line py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-5">{modes.map((item) => <button key={item.id} type="button" disabled={item.disabled} onClick={() => !item.disabled && setMode(item.id)} className={`border-b py-1.5 text-xs font-semibold ${mode === item.id ? 'border-bronze text-ink' : item.disabled ? 'border-transparent text-ink-faint/40' : 'border-transparent text-ink-faint hover:text-ink'}`}>{item.label}</button>)}</div>
      <div className="flex flex-wrap gap-4">
        {mode !== 'synopsis' && <WitnessSelect value={primary} onChange={setPrimary} witnesses={witnesses} label={mode === 'compare' ? 'A' : 'Testo'} />}
        {mode === 'compare' && <WitnessSelect value={secondary} onChange={setSecondary} witnesses={witnesses} label="B" />}
        {mode === 'synopsis' && <span className="text-xs text-ink-faint">{witnesses.length} tradizioni disponibili</span>}
      </div>
    </div>

    {mode === 'read' && <div className="mx-auto max-w-[760px]"><WitnessText unit={witnesses[primary] || witnesses[0]} /></div>}

    {mode === 'compare' && <div className="overflow-x-auto pb-3"><div className="grid min-w-[820px] grid-cols-2 divide-x divide-papyrus-line border-x border-papyrus-line"><div className="px-5 md:px-7"><WitnessText compact unit={witnesses[primary] || witnesses[0]} /></div><div className="px-5 md:px-7"><WitnessText compact unit={witnesses[secondary] || witnesses[1] || witnesses[0]} /></div></div></div>}

    {mode === 'synopsis' && <div className="overflow-x-auto pb-3"><div className="grid divide-x divide-papyrus-line border-x border-papyrus-line" style={{gridTemplateColumns:`repeat(${witnesses.length}, minmax(310px, 1fr))`, minWidth:`${Math.max(930, witnesses.length * 310)}px`}}>{witnesses.map((unit, index) => <div key={`${name(unit)}-${index}`} className="px-5"><WitnessText compact unit={unit} /></div>)}</div></div>}
  </div>;
}
