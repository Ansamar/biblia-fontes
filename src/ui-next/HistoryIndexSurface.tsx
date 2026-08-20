'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { HistoryIndexView } from '../data-access/history';

type Mode = 'book' | 'date';

const categoryOrder = ['Pentateuco','Libri storici','Sapienziali e poetici','Profeti','Vangeli','Atti degli Apostoli','Lettere Paoline','Ebrei','Lettere Cattoliche','Apocalisse'];
const presets = [-1200,-1000,-722,-586,-539,-332,-167,-63,30,70,100];
const typeLabels: Record<string,string> = { event:'evento', people:'popolo', empire:'impero', city:'città', region:'regione', person:'persona', institution:'istituzione', practice:'pratica', text:'testo', redaction:'redazione', witness:'testimone' };
const statusLabels: Record<string,string> = { attested:'attestato', probable:'probabile', debated:'discusso', memory:'memoria', comparandum:'comparandum', narrative:'narrativo', undatable:'non databile' };

function formatYear(year: number) {
  if (year < 0) return `${Math.abs(year)} a.C.`;
  if (year === 0) return '0';
  return `${year} d.C.`;
}

function activeAt(entity: { start?: number; end?: number }, year: number) {
  if (entity.start === undefined) return false;
  return entity.start <= year && (entity.end ?? entity.start) >= year;
}

export default function HistoryIndexSurface({ history, basePath = '/historical-explorer', corpusPath = '/' }: { history: HistoryIndexView; basePath?: string; corpusPath?: string }) {
  const [mode, setMode] = useState<Mode>('book');
  const initialYear = history.range[0] <= -586 && history.range[1] >= -586 ? -586 : Math.round((history.range[0] + history.range[1]) / 2);
  const [year, setYear] = useState(initialYear);
  const [yearInput, setYearInput] = useState(String(initialYear));

  const grouped = useMemo(() => {
    const map = new Map<string, typeof history.datasets>();
    for (const field of history.datasets) {
      const key = field.category || 'Altri libri';
      map.set(key, [...(map.get(key) || []), field]);
    }
    return [...map.entries()].sort((a, b) => {
      const ai = categoryOrder.indexOf(a[0]); const bi = categoryOrder.indexOf(b[0]);
      if (ai === -1 && bi === -1) return a[0].localeCompare(b[0], 'it');
      if (ai === -1) return 1; if (bi === -1) return -1; return ai - bi;
    });
  }, [history.datasets]);

  const dateResults = useMemo(() => history.datasets.flatMap((field) => {
    const entities = field.entities.filter((entity) => activeAt(entity, year));
    return entities.length ? [{...field, activeEntities: entities}] : [];
  }), [history.datasets, year]);

  function commitYear(value: number) {
    const next = Math.max(history.range[0], Math.min(history.range[1], Math.round(value)));
    setYear(next); setYearInput(String(next));
  }

  return <main className="mx-auto max-w-[1320px] px-5 py-10 md:px-8 md:py-14">
    <header className="grid gap-8 border-b border-papyrus-line pb-9 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
      <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Storia</p><h1 className="mt-2 font-serif text-5xl font-semibold md:text-6xl">Interroga il tempo intorno al testo.</h1><p className="reading-text mt-5 max-w-[72ch] text-ink-soft">Puoi partire da un libro oppure da una data. Per libro segui l’ordine canonico; per data attraversi il corpus secondo il contesto storico selezionato.</p></div>
      <p className="border-l border-papyrus-line pl-6 text-xs leading-6 text-ink-faint">Luoghi, poteri, eventi, istituzioni e testi mantengono il proprio grado di affidabilità: attestato, probabile, discusso, memoria, comparandum o narrativo.</p>
    </header>

    <nav className="mt-6 flex gap-5 border-b border-papyrus-line" aria-label="Ingresso nella ricerca storica">
      <button type="button" onClick={() => setMode('book')} className={`border-b-2 pb-3 text-sm font-semibold ${mode === 'book' ? 'border-bronze text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>Per libro</button>
      <button type="button" onClick={() => setMode('date')} className={`border-b-2 pb-3 text-sm font-semibold ${mode === 'date' ? 'border-bronze text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>Per data</button>
    </nav>

    {mode === 'book' && <div className="mt-9 grid gap-9 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10">
      <aside><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Ordine canonico</p><h2 className="mt-2 font-serif text-2xl font-semibold">Scegli un libro</h2><p className="mt-2 text-xs leading-5 text-ink-faint">Entra nella rete storica dal testo biblico che stai studiando.</p><p className="mt-4 border-l border-papyrus-line pl-3 text-[10px] leading-5 text-ink-faint">Le date sotto i titoli indicano l’orizzonte storico coperto dalla rete di eventi, luoghi, istituzioni e testi. Non sono la datazione del libro biblico.</p><Link href={corpusPath} className="mt-6 inline-flex text-xs text-ink-soft hover:text-ink">← Corpus biblico</Link></aside>
      <div className="border-t border-papyrus-line">{grouped.map(([category, fields]) => <section key={category} className="grid gap-5 border-b border-papyrus-line py-6 md:grid-cols-[160px_minmax(0,1fr)]"><header><h2 className="font-serif text-lg font-semibold">{category}</h2></header><div className="grid gap-x-6 gap-y-0 sm:grid-cols-2 xl:grid-cols-3">{fields.map((field) => <Link key={field.id} href={`${basePath}/${field.slug}`} className="group block border-b border-papyrus-line/70 py-3 transition hover:border-bronze/50"><span className="font-serif text-[1.05rem] font-semibold text-ink-soft transition group-hover:text-ink">{field.title}</span>{(field.start !== undefined || field.end !== undefined) && <span className="mt-1 block font-mono text-[9px] tracking-wide text-ink-faint"><span className="uppercase tracking-[0.08em]">Orizzonte storico</span> · {field.start !== undefined ? formatYear(field.start) : '…'} — {field.end !== undefined ? formatYear(field.end) : '…'}</span>}</Link>)}</div></section>)}</div>
    </div>}

    {mode === 'date' && <section className="mt-9">
      <div className="grid gap-8 border-b border-papyrus-line pb-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
        <header><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Anno</p><h2 className="mt-2 font-serif text-4xl font-semibold">{formatYear(year)}</h2><p className="mt-3 text-xs leading-5 text-ink-faint">Mostra le entità i cui intervalli includono l’anno scelto.</p></header>
        <div><div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_145px] md:items-end"><div><div className="mb-2 flex justify-between text-[10px] text-ink-faint"><span>{formatYear(history.range[0])}</span><span>{formatYear(history.range[1])}</span></div><input type="range" aria-label="Anno della ricerca storica" min={history.range[0]} max={history.range[1]} value={year} onChange={(event) => commitYear(Number(event.target.value))} className="w-full accent-current" /></div><label className="text-[10px] text-ink-faint">Anno numerico<input value={yearInput} onChange={(event) => setYearInput(event.target.value)} onBlur={() => { const parsed = Number(yearInput); Number.isFinite(parsed) ? commitYear(parsed) : setYearInput(String(year)); }} onKeyDown={(event) => { if (event.key === 'Enter') { const parsed = Number(yearInput); if (Number.isFinite(parsed)) commitYear(parsed); } }} inputMode="numeric" className="mt-1 w-full border-0 border-b border-papyrus-line bg-transparent px-0 py-2 text-sm text-ink outline-none focus:border-bronze" /></label></div><div className="mt-4 flex flex-wrap gap-2">{presets.filter((item) => item >= history.range[0] && item <= history.range[1]).map((item) => <button key={item} type="button" onClick={() => commitYear(item)} className={`border px-2.5 py-1 text-[10px] ${year === item ? 'border-ink bg-ink text-papyrus' : 'border-papyrus-line text-ink-faint hover:border-bronze hover:text-bronze'}`}>{formatYear(item)}</button>)}</div></div>
      </div>

      <div className="grid gap-9 py-9 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12"><aside><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Nel corpus</p><p className="mt-2 font-serif text-4xl font-semibold">{dateResults.length}</p><p className="text-xs text-ink-faint">libri coinvolti</p></aside><div className="border-t border-papyrus-line">{dateResults.length ? dateResults.map((field) => <article key={field.id} className="grid gap-5 border-b border-papyrus-line py-7 md:grid-cols-[180px_minmax(0,1fr)]"><header><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bronze">{field.category}</p><h3 className="mt-1 font-serif text-xl font-semibold">{field.title}</h3><Link href={`${basePath}/${field.slug}?year=${year}`} className="mt-3 inline-flex text-xs font-semibold text-bronze hover:text-ink">Vai al {formatYear(year)} →</Link></header><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{field.activeEntities.slice(0, 9).map((entity) => <Link key={entity.id} href={`${basePath}/${field.slug}?year=${year}&entity=${encodeURIComponent(entity.id)}`} className="border-l border-papyrus-line pl-3 hover:border-bronze"><strong className="font-serif text-base font-semibold text-ink-soft">{entity.label}</strong><span className="mt-1 block text-[10px] text-ink-faint">{typeLabels[entity.type] || entity.type} · {statusLabels[entity.epistemicStatus] || entity.epistemicStatus}</span></Link>)}{field.activeEntities.length > 9 && <p className="pl-3 text-[10px] text-ink-faint">+ {field.activeEntities.length - 9} altre relazioni</p>}</div></article>) : <div className="border-b border-papyrus-line py-10"><h3 className="font-serif text-2xl font-semibold">Nessuna relazione datata</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-faint">Sposta la data per interrogare un altro contesto.</p></div>}</div></div>
    </section>}
  </main>;
}
