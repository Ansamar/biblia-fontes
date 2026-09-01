'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AlternateChapterNumber, AlternateSystem, BiblicalTextUnit, BiblicalVerse } from '../components/BiblicalTextReader';
import { alignWitnessVerses } from './alignedWitnesses';
import type { TextualDossier } from './genesisTextualDossiers';

type Mode = 'read' | 'compare' | 'synopsis';
const norm = (value?: string) => (value || '').trim().toLocaleLowerCase('it-IT');

function badge(unit: BiblicalTextUnit) {
  const language = norm(unit.lingua); const tradition = norm(unit.tradizione);
  if (language === 'it' || tradition.includes('cei')) return 'ITA';
  if (language === 'he' || tradition === 'mt' || tradition.includes('ebra')) return 'HEB';
  if (language === 'grc' || tradition.includes('lxx') || tradition.includes('greco') || tradition.includes('teodo') || tradition.endsWith('_og')) return 'GRE';
  if (language === 'la' || tradition.includes('vulg')) return 'LAT';
  return (unit.lingua || 'TXT').slice(0,3).toUpperCase();
}

function name(unit: BiblicalTextUnit) {
  const tradition = norm(unit.tradizione);
  if (tradition.includes('cei') || tradition === 'traduzione_italiana') return 'CEI 2008';
  if (tradition === 'mt') return unit.testimone || 'Testo masoretico';
  if (tradition === 'lxx') return 'Settanta';
  if (tradition.includes('vulg')) return 'Vulgata';
  if (tradition === 'daniele_greco_og') return 'Daniele · Old Greek';
  if (tradition === 'daniele_teodozione') return 'Daniele · Teodozione';
  if (tradition === 'susanna_og') return 'Susanna · Old Greek';
  if (tradition === 'susanna_teodozione') return 'Susanna · Teodozione';
  if (tradition === 'bel_og') return 'Bel · Old Greek';
  if (tradition === 'bel_teodozione') return 'Bel · Teodozione';
  if (tradition === 'ester_ebraico') return 'Ester · testo ebraico';
  if (tradition === 'ester_greco') return 'Ester · testo greco';
  if (tradition.includes('teodo')) return 'Teodozione';
  if (tradition.includes('old') || tradition.endsWith('_og')) return 'Old Greek';
  return unit.testimone || unit.edizione || unit.tradizione || 'Testo';
}

function systemLabel(system?: AlternateSystem) {
  if (!system || system === 'LXX_VG') return 'LXX/Vg';
  if (system === 'MT') return 'MT';
  return String(system);
}

function alternateChapter(unit: BiblicalTextUnit) {
  const alternate: AlternateChapterNumber | undefined = unit.numeroAlternativo;
  if (alternate == null) return null;
  if (typeof alternate === 'number') return { numero: alternate, sistema: unit.sistemaAlternativo || 'LXX_VG' };
  return { numero: alternate.numero, sistema: alternate.sistema || unit.sistemaAlternativo || 'LXX_VG' };
}

function isRtl(unit: BiblicalTextUnit) { return unit.direzione === 'rtl' || norm(unit.lingua) === 'he' || norm(unit.lingua).includes('ebra'); }
function verseLabel(verse: BiblicalVerse) { return `${verse.numero}${verse.marcatoreAlfabetico || ''}`; }

function WitnessHeader({ unit }: { unit: BiblicalTextUnit }) {
  const alternate = alternateChapter(unit);
  return <div className="mb-5 flex min-h-9 items-start justify-between gap-4 border-b border-papyrus-line pb-3" dir="ltr">
    <div className="min-w-0"><div className="flex items-center gap-2"><span className="font-mono text-[9px] font-semibold tracking-[0.12em] text-bronze">{badge(unit)}</span><strong className="truncate text-xs font-semibold text-ink">{name(unit)}</strong></div>{unit.edizione && norm(unit.edizione) !== norm(name(unit)) && <p className="mt-1 truncate text-[10px] text-ink-faint">{unit.edizione}</p>}</div>
    <span className="shrink-0 text-right font-mono text-[9px] leading-4 text-ink-faint">cap. {unit.numero}{alternate && <><br />{systemLabel(alternate.sistema)} {alternate.numero}</>}</span>
  </div>;
}

function VerseParallel({ verse }: { verse: BiblicalVerse }) {
  const alternate = verse.riferimentoAlternativo;
  if (!alternate) return null;
  const location = alternate.salmo != null ? `Sal ${alternate.salmo},${alternate.versetto}` : alternate.capitolo != null ? `${alternate.capitolo},${alternate.versetto}` : String(alternate.versetto);
  return <span dir="ltr" className="ml-2 inline-block align-[0.12em] font-sans text-[0.48em] font-medium text-ink-faint">{systemLabel(alternate.sistema)} {location}</span>;
}

function WitnessText({ unit, compact = false }: { unit: BiblicalTextUnit; compact?: boolean }) {
  const rtl = isRtl(unit);
  return <div dir={rtl ? 'rtl' : 'ltr'} className={rtl ? 'text-right' : ''}><WitnessHeader unit={unit} /><div className={`${compact ? 'text-[1.02rem] leading-[1.75]' : 'reading-text text-[1.12rem] leading-[1.86]'} font-serif text-ink`}>{(unit.versetti || []).map((verse,index) => <div key={verse._key || `${verse.numero}-${index}`} className="mb-4 break-words">{verse.metatesto?.testo && <p className="mb-2 text-[0.82em] italic leading-6 text-ink-faint">{verse.metatesto.testo}</p>}{verse.testo ? <p><span dir="ltr" className="mr-2 inline-block align-[0.15em] font-sans text-[0.58em] font-semibold text-bronze">{verseLabel(verse)}</span>{verse.testo}<VerseParallel verse={verse} /></p> : <p className="border-l-2 border-papyrus-line pl-3 font-sans text-sm text-ink-faint">{verse.notaEditoriale || verse.statoTestuale || `Versetto ${verseLabel(verse)} senza testo`}</p>}</div>)}</div></div>;
}

function TextualDossierPanel({ dossier, onClose }: { dossier: TextualDossier; onClose: () => void }) {
  return <article className="border-l-2 border-bronze bg-white/25 px-5 py-5 md:px-7" aria-labelledby={`${dossier.id}-title`}>
    <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Gen {dossier.startVerse}–{dossier.endVerse} · Dossier testuale</p><h3 id={`${dossier.id}-title`} className="mt-1 font-serif text-2xl font-semibold">{dossier.title}</h3></div><button type="button" onClick={onClose} className="shrink-0 text-xs text-ink-faint hover:text-ink" aria-label={`Chiudi il dossier ${dossier.title}`}>Chiudi ×</button></div>
    <p className="mt-4 max-w-4xl font-serif text-lg leading-7 text-ink-soft">{dossier.question}</p>
    <div className="mt-5 grid gap-5 lg:grid-cols-3"><section><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bronze">Testimoni</p><p className="mt-2 text-sm leading-6 text-ink-soft">{dossier.witnessComparison}</p></section><section><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bronze">Interpretazione</p><p className="mt-2 text-sm leading-6 text-ink-soft">{dossier.interpretation}</p></section><section><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bronze">Cautela metodologica</p><p className="mt-2 text-sm leading-6 text-ink-soft">{dossier.methodologicalNote}</p></section></div>
    {dossier.reception && <div className="mt-5 border-t border-papyrus-line pt-4"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bronze">Ricezione cristiana</p><p className="mt-2 max-w-5xl text-sm leading-6 text-ink-soft">{dossier.reception}</p></div>}
    <details className="mt-5 border-t border-papyrus-line pt-3"><summary className="cursor-pointer text-[11px] font-semibold text-ink-faint">Bibliografia essenziale</summary><ul className="mt-2 space-y-1 text-xs leading-5 text-ink-faint">{dossier.bibliography.map(source => <li key={source}>{source}</li>)}</ul></details>
  </article>;
}

function AlignedWitnesses({ witnesses, dossiers = [] }: { witnesses: BiblicalTextUnit[]; dossiers?: TextualDossier[] }) {
  const rows = useMemo(() => alignWitnessVerses(witnesses), [witnesses]);
  const [openDossierId, setOpenDossierId] = useState<string | null>(null);
  const columns = `72px repeat(${witnesses.length}, minmax(310px, 1fr))`;
  const minWidth = 72 + witnesses.length * 310;

  return <div className="overflow-x-auto pb-3" aria-label="Testimoni allineati per versetto">
    <div role="table" className="border-x border-papyrus-line" style={{minWidth: `${minWidth}px`}}>
      <div role="row" className="sticky top-0 z-10 grid border-b border-papyrus-line bg-papyrus" style={{gridTemplateColumns: columns}}>
        <div role="columnheader" className="px-3 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">Vers.</div>
        {witnesses.map((unit, index) => <div role="columnheader" key={`${name(unit)}-${index}`} className="border-l border-papyrus-line px-5 py-4"><WitnessHeader unit={unit} /></div>)}
      </div>
      <div className="divide-y divide-papyrus-line">
        {rows.map((row) => {
          const dossier = dossiers.find(item => item.startVerse === row.numero);
          const isOpen = dossier?.id === openDossierId;
          return <div key={row.key}>
          <div role="row" className="grid items-stretch" style={{gridTemplateColumns: columns}}>
          <div role="rowheader" className="px-3 py-5 font-mono text-[11px] font-semibold text-bronze" dir="ltr"><span>{row.label}</span>{dossier && <button type="button" onClick={() => setOpenDossierId(isOpen ? null : dossier.id)} className="mt-2 block font-sans text-[9px] font-semibold leading-3 text-ink-faint hover:text-bronze" aria-expanded={isOpen} aria-controls={dossier.id}>Dossier<br />{dossier.startVerse}–{dossier.endVerse}</button>}</div>
          {row.verses.map((verse, index) => {
            const unit = witnesses[index];
            const rtl = isRtl(unit);
            return <div role="cell" key={`${row.key}-${index}`} dir={rtl ? 'rtl' : 'ltr'} className={`border-l border-papyrus-line px-5 py-5 font-serif text-[1.02rem] leading-[1.75] text-ink ${rtl ? 'text-right' : ''}`}>
              {verse ? <>{verse.metatesto?.testo && <p className="mb-2 text-[0.82em] italic leading-6 text-ink-faint">{verse.metatesto.testo}</p>}{verse.testo ? <p className="break-words">{verse.testo}<VerseParallel verse={verse} /></p> : <p className="font-sans text-sm text-ink-faint">{verse.notaEditoriale || verse.statoTestuale || 'Testo non disponibile'}</p>}</> : <p dir="ltr" className="font-sans text-xs italic text-ink-faint">Non presente nel testimone</p>}
            </div>;
          })}
        </div>{dossier && isOpen && <div id={dossier.id}><TextualDossierPanel dossier={dossier} onClose={() => setOpenDossierId(null)} /></div>}</div>;
        })}
      </div>
    </div>
  </div>;
}

function WitnessSelect({ value, onChange, witnesses, label, disabledIndex }: { value: number; onChange: (value: number) => void; witnesses: BiblicalTextUnit[]; label: string; disabledIndex?: number }) {
  return <label className="flex items-center gap-2 text-xs text-ink-faint"><span className="font-mono text-[9px] uppercase tracking-[0.12em]">{label}</span><select value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-w-0 border-0 border-b border-papyrus-line bg-transparent py-1.5 text-xs font-semibold text-ink outline-none focus:border-bronze">{witnesses.map((unit,index) => <option key={`${badge(unit)}-${name(unit)}-${index}`} value={index} disabled={index === disabledIndex}>{badge(unit)} · {name(unit)}</option>)}</select></label>;
}

export default function WorkspaceReader({ text, textualNote, textualDossiers = [] }: { text: BiblicalTextUnit; textualNote?: string; textualDossiers?: TextualDossier[] }) {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const witnesses = useMemo(() => Array.isArray(text.witnesses) && text.witnesses.length ? text.witnesses : [text], [text]);
  const requestedMode = searchParams.get('reader');
  const requestedPrimary = Number(searchParams.get('a'));
  const requestedSecondary = Number(searchParams.get('b'));
  const initialMode: Mode = requestedMode === 'compare' && witnesses.length > 1 ? 'compare' : requestedMode === 'synopsis' && witnesses.length > 2 ? 'synopsis' : 'read';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [primary, setPrimary] = useState(Number.isInteger(requestedPrimary) && requestedPrimary >= 0 && requestedPrimary < witnesses.length ? requestedPrimary : 0);
  const [secondary, setSecondary] = useState(Number.isInteger(requestedSecondary) && requestedSecondary >= 0 && requestedSecondary < witnesses.length && requestedSecondary !== primary ? requestedSecondary : Math.min(1, witnesses.length - 1));
  const canCompare = witnesses.length > 1; const canSynopsis = witnesses.length > 2;

  useEffect(() => {
    if (primary >= witnesses.length) setPrimary(0);
    if (secondary >= witnesses.length || secondary === primary) {
      const next = witnesses.findIndex((_, index) => index !== primary);
      setSecondary(next >= 0 ? next : 0);
    }
    if (mode === 'compare' && !canCompare) setMode('read');
    if (mode === 'synopsis' && !canSynopsis) setMode(canCompare ? 'compare' : 'read');
  }, [primary, secondary, witnesses, mode, canCompare, canSynopsis]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'read') params.delete('reader'); else params.set('reader', mode);
    if (primary === 0) params.delete('a'); else params.set('a', String(primary));
    if (mode === 'compare') params.set('b', String(secondary)); else params.delete('b');
    const next = params.toString(); const current = searchParams.toString();
    if (next !== current) router.replace(`${pathname}${next ? `?${next}` : ''}`, { scroll: false });
  }, [mode, primary, secondary, pathname, router, searchParams]);

  const modes: Array<{id: Mode; label: string; disabled?: boolean}> = [{id:'read',label:'Lettura'},{id:'compare',label:'Confronto',disabled:!canCompare},{id:'synopsis',label:'Sinossi',disabled:!canSynopsis}];
  const comparedWitnesses = [witnesses[primary] || witnesses[0], witnesses[secondary] || witnesses[1] || witnesses[0]];
  const alignedMode = mode === 'compare' || mode === 'synopsis';

  return <div className="min-w-0">
    <div className="mb-7 flex flex-col gap-4 border-y border-papyrus-line py-3 md:flex-row md:items-center md:justify-between"><div className="flex gap-5">{modes.map((item) => <button key={item.id} type="button" disabled={item.disabled} onClick={() => !item.disabled && setMode(item.id)} className={`border-b py-1.5 text-xs font-semibold ${mode === item.id ? 'border-bronze text-ink' : item.disabled ? 'border-transparent text-ink-faint/40' : 'border-transparent text-ink-faint hover:text-ink'}`}>{item.label}</button>)}</div><div className="flex flex-wrap gap-4">{mode !== 'synopsis' && <WitnessSelect value={primary} onChange={setPrimary} witnesses={witnesses} label={mode === 'compare' ? 'A' : 'Testo'} disabledIndex={mode === 'compare' ? secondary : undefined} />}{mode === 'compare' && <WitnessSelect value={secondary} onChange={setSecondary} witnesses={witnesses} label="B" disabledIndex={primary} />}{mode === 'synopsis' && <span className="text-xs text-ink-faint">{witnesses.length} tradizioni disponibili</span>}</div></div>
    {mode === 'read' && <div className="mx-auto max-w-[760px]"><WitnessText unit={witnesses[primary] || witnesses[0]} /></div>}
    {alignedMode && <aside className="mb-5 grid gap-3 border-l-2 border-bronze/40 bg-white/15 px-4 py-3 text-xs leading-5 text-ink-soft md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><p><strong className="text-ink">Allineamento editoriale.</strong> Le righe seguono la numerazione dei versetti; un’eventuale assenza resta visibile e non sposta le corrispondenze successive.</p><p><strong className="text-ink">Come leggere le differenze.</strong> Una resa diversa non equivale automaticamente a una variante del testo: può dipendere da lingua, sintassi o scelta di traduzione.</p></aside>}
    {mode === 'compare' && <AlignedWitnesses witnesses={comparedWitnesses} dossiers={textualDossiers} />}
    {mode === 'synopsis' && <AlignedWitnesses witnesses={witnesses} dossiers={textualDossiers} />}
    {alignedMode && textualNote && <details className="mt-4 border-y border-papyrus-line py-4"><summary className="cursor-pointer text-xs font-semibold text-bronze">Nota critico-testuale del capitolo</summary><p className="mt-3 max-w-4xl text-sm leading-7 text-ink-soft">{textualNote}</p></details>}
  </div>;
}
