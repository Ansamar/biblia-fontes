'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { HistoryIndexView } from '../data-access/history';

type Mode = 'book' | 'date';

const categoryOrder = [
  'Pentateuco',
  'Libri storici',
  'Sapienziali e poetici',
  'Profeti',
  'Vangeli',
  'Atti degli Apostoli',
  'Lettere Paoline',
  'Ebrei',
  'Lettere Cattoliche',
  'Apocalisse',
];

const presets = [-1200, -1000, -722, -586, -539, -332, -167, -63, 30, 70, 100];

function formatYear(year: number) {
  if (year < 0) return `${Math.abs(year)} a.C.`;
  if (year === 0) return '0';
  return `${year} d.C.`;
}

function activeAt(entity: { start?: number; end?: number }, year: number) {
  if (entity.start === undefined) return false;
  return entity.start <= year && (entity.end ?? entity.start) >= year;
}

export default function HistoryIndexSurface({ history }: { history: HistoryIndexView }) {
  const [mode, setMode] = useState<Mode>('book');
  const initialYear = history.range[0] <= -586 && history.range[1] >= -586
    ? -586
    : Math.round((history.range[0] + history.range[1]) / 2);
  const [year, setYear] = useState(initialYear);
  const [yearInput, setYearInput] = useState(String(initialYear));

  const grouped = useMemo(() => {
    const map = new Map<string, typeof history.datasets>();
    for (const dataset of history.datasets) {
      const key = dataset.category || 'Altri libri';
      map.set(key, [...(map.get(key) || []), dataset]);
    }
    return [...map.entries()].sort((a, b) => {
      const ai = categoryOrder.indexOf(a[0]);
      const bi = categoryOrder.indexOf(b[0]);
      if (ai === -1 && bi === -1) return a[0].localeCompare(b[0], 'it');
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [history.datasets]);

  const dateResults = useMemo(() => history.datasets.flatMap((dataset) => {
    const entities = dataset.entities.filter((entity) => activeAt(entity, year));
    if (!entities.length) return [];
    return [{ ...dataset, activeEntities: entities }];
  }), [history.datasets, year]);

  function commitYear(value: number) {
    const next = Math.max(history.range[0], Math.min(history.range[1], Math.round(value)));
    setYear(next);
    setYearInput(String(next));
  }

  return <main className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
    <header className="grid gap-8 border-b border-papyrus-line pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Historical Explorer</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">La storia intorno al testo.</h1>
        <p className="reading-text mt-5 max-w-[70ch] text-ink-soft">Entra dalla Bibbia oppure da una data. Il primo percorso conserva il libro come contesto; il secondo attraversa l’intero canone e mostra quali realtà storiche risultano attive nello stesso momento.</p>
      </div>
      <p className="border-l border-papyrus-line pl-6 text-sm leading-6 text-ink-faint">L’Explorer mantiene distinto ciò che è attestato, probabile, discusso, memoria, comparandum o elemento narrativo. La data non trasforma un’ipotesi in un fatto.</p>
    </header>

    <div className="mt-8 flex gap-2 border-b border-papyrus-line pb-4" role="tablist" aria-label="Modalità di esplorazione storica">
      <button type="button" role="tab" aria-selected={mode === 'book'} onClick={() => setMode('book')} className={`px-4 py-2 text-sm transition ${mode === 'book' ? 'bg-ink text-papyrus' : 'text-ink-soft hover:text-ink'}`}>Esplora per libro</button>
      <button type="button" role="tab" aria-selected={mode === 'date'} onClick={() => setMode('date')} className={`px-4 py-2 text-sm transition ${mode === 'date' ? 'bg-ink text-papyrus' : 'text-ink-soft hover:text-ink'}`}>Esplora per date</button>
    </div>

    {mode === 'book' && <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
      <aside>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Dataset disponibili</p>
        <p className="mt-3 text-sm leading-6 text-ink-faint">Qui compaiono soltanto i libri che possiedono realmente un dataset Historical Explorer in Sanity.</p>
        <p className="mt-4 font-serif text-3xl font-semibold">{history.datasets.length}</p>
        <p className="text-xs text-ink-faint">campi storici</p>
        <Link href="/rebuild" className="mt-6 inline-flex text-sm text-ink-soft hover:text-ink">← Torna alla Bibbia</Link>
      </aside>

      <div className="border-t border-papyrus-line">
        {grouped.map(([category, datasets]) => <section key={category} className="grid gap-5 border-b border-papyrus-line py-7 md:grid-cols-[190px_minmax(0,1fr)]">
          <header><h2 className="font-serif text-2xl font-semibold">{category}</h2><p className="mt-1 text-xs text-ink-faint">{datasets.length} dataset</p></header>
          <div className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
            {datasets.map((dataset) => <Link key={dataset.id} href={`/rebuild/historical-explorer/${dataset.slug}`} className="group border-b border-papyrus-line/70 py-3">
              <span className="flex items-baseline justify-between gap-4"><span className="font-serif text-lg text-ink-soft group-hover:text-ink">{dataset.title}</span><span className="text-xs text-ink-faint group-hover:text-bronze">storia →</span></span>
              {(dataset.start !== undefined || dataset.end !== undefined) && <span className="mt-1 block text-[11px] text-ink-faint">{dataset.start !== undefined ? formatYear(dataset.start) : '…'} — {dataset.end !== undefined ? formatYear(dataset.end) : '…'}</span>}
            </Link>)}
          </div>
        </section>)}
      </div>
    </div>}

    {mode === 'date' && <section className="mt-10">
      <div className="grid gap-8 border-b border-papyrus-line pb-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Data di riferimento</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">{formatYear(year)}</h2>
          <p className="mt-3 text-sm leading-6 text-ink-faint">La ricerca individua le entità il cui intervallo temporale include l’anno scelto.</p>
        </header>

        <div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px] md:items-end">
            <div>
              <div className="mb-2 flex justify-between text-xs text-ink-faint"><span>{formatYear(history.range[0])}</span><span>{formatYear(history.range[1])}</span></div>
              <input type="range" aria-label="Anno della ricerca storica" min={history.range[0]} max={history.range[1]} value={year} onChange={(event) => commitYear(Number(event.target.value))} className="w-full accent-current" />
            </div>
            <label className="text-xs text-ink-faint">Anno numerico
              <input value={yearInput} onChange={(event) => setYearInput(event.target.value)} onBlur={() => { const parsed = Number(yearInput); if (Number.isFinite(parsed)) commitYear(parsed); else setYearInput(String(year)); }} onKeyDown={(event) => { if (event.key === 'Enter') { const parsed = Number(yearInput); if (Number.isFinite(parsed)) commitYear(parsed); } }} inputMode="numeric" className="mt-1 w-full border border-papyrus-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-bronze" />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Date storiche rapide">
            {presets.filter((item) => item >= history.range[0] && item <= history.range[1]).map((item) => <button key={item} type="button" onClick={() => commitYear(item)} className={`border px-3 py-1.5 text-xs transition ${year === item ? 'border-ink bg-ink text-papyrus' : 'border-papyrus-line text-ink-soft hover:border-bronze hover:text-bronze'}`}>{formatYear(item)}</button>)}
          </div>
        </div>
      </div>

      <div className="grid gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <aside>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Risultati</p>
          <p className="mt-2 font-serif text-4xl font-semibold">{dateResults.length}</p>
          <p className="text-sm text-ink-faint">libri con elementi attivi</p>
        </aside>

        <div className="border-t border-papyrus-line">
          {dateResults.length ? dateResults.map((dataset) => <article key={dataset.id} className="grid gap-5 border-b border-papyrus-line py-7 md:grid-cols-[190px_minmax(0,1fr)]">
            <header>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">{dataset.category}</p>
              <h3 className="mt-1 font-serif text-2xl font-semibold">{dataset.title}</h3>
              <Link href={`/rebuild/historical-explorer/${dataset.slug}?year=${year}`} className="mt-3 inline-flex text-sm font-semibold text-bronze hover:text-ink">Apri a {formatYear(year)} →</Link>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dataset.activeEntities.slice(0, 9).map((entity) => <Link key={entity.id} href={`/rebuild/historical-explorer/${dataset.slug}?year=${year}&entity=${encodeURIComponent(entity.id)}`} className="border-l border-papyrus-line pl-4 hover:border-bronze">
                <strong className="font-serif text-lg font-semibold text-ink-soft">{entity.label}</strong>
                <span className="mt-1 block text-[11px] text-ink-faint">{entity.type} · {entity.epistemicStatus}</span>
              </Link>)}
              {dataset.activeEntities.length > 9 && <p className="pl-4 text-xs text-ink-faint">+ {dataset.activeEntities.length - 9} altre entità</p>}
            </div>
          </article>) : <div className="border-b border-papyrus-line py-12"><h3 className="font-serif text-2xl font-semibold">Nessuna entità datata attiva</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-faint">Per questo anno i dataset disponibili non contengono entità con un intervallo temporale che includa la data scelta. Prova una data vicina o uno dei riferimenti rapidi.</p></div>}
        </div>
      </div>
    </section>}
  </main>;
}
