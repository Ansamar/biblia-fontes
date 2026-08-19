'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import HistoricalExplorerMap from '../components/HistoricalExplorerMap';
import type { ExplorerLayer, HistoricalEntity } from '../historical-explorer/types';
import type { HistoryView } from '../data-access/history';

const layerLabels: Record<ExplorerLayer, string> = {
  politics: 'Poteri', places: 'Luoghi', events: 'Eventi', institutions: 'Istituzioni', texts: 'Testi', transmission: 'Trasmissione',
};
const typeToLayer: Record<HistoricalEntity['type'], ExplorerLayer> = {
  people: 'politics', empire: 'politics', person: 'politics', city: 'places', region: 'places', event: 'events', institution: 'institutions', practice: 'institutions', text: 'texts', redaction: 'texts', witness: 'transmission',
};
const statusLabel: Record<HistoricalEntity['epistemicStatus'], string> = {
  attested: 'attestato', probable: 'probabile', debated: 'discusso', memory: 'memoria', comparandum: 'comparandum', narrative: 'narrativo', undatable: 'non databile',
};

function formatYear(year?: number) {
  if (year === undefined) return 'non databile';
  if (year < 0) return `${Math.abs(year)} a.C.`;
  return `${year} d.C.`;
}

function activeAt(entity: HistoricalEntity, year: number) {
  if (entity.temporal.start === undefined) return true;
  return entity.temporal.start <= year && (entity.temporal.end ?? entity.temporal.start) >= year;
}

export default function HistorySurface({ view }: { view: HistoryView }) {
  const { dataset } = view;
  const initialYear = Math.round((dataset.defaultRange[0] + dataset.defaultRange[1]) / 2);
  const [year, setYear] = useState(initialYear);
  const [selectedId, setSelectedId] = useState(dataset.entities[0]?.id || '');
  const [layers, setLayers] = useState<ExplorerLayer[]>(['politics', 'places', 'events', 'institutions', 'texts']);

  const visible = useMemo(() => dataset.entities.filter((entity) => layers.includes(typeToLayer[entity.type])), [dataset.entities, layers]);
  const mapEntities = visible.filter((entity) => activeAt(entity, year) || entity.id === selectedId);
  const selected = dataset.entities.find((entity) => entity.id === selectedId) || dataset.entities[0];
  const scenario = dataset.scenarios?.find((item) => item.start <= year && item.end >= year);

  const toggleLayer = (layer: ExplorerLayer) => setLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);

  return <main className="mx-auto max-w-[1560px] px-4 py-6 md:px-7 md:py-8">
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-faint" aria-label="Percorso">
      <Link href="/rebuild" className="hover:text-ink">Bibbia</Link><span>/</span>
      <Link href={`/rebuild/bibbia/${view.slug}`} className="hover:text-ink">{view.bookTitle}</Link><span>/</span>
      <span className="text-ink">Storia</span>
    </nav>

    <header className="grid gap-7 border-b border-papyrus-line pb-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Historical Explorer</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold md:text-5xl">{view.bookTitle} nella storia</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink-soft">{dataset.subtitle}</p>
      </div>
      <div className="border-l border-papyrus-line pl-6 text-sm leading-6 text-ink-faint">
        Il testo biblico resta distinto dalla ricostruzione storica. L’Explorer espone attestazioni, ipotesi, memorie e comparanda con il loro diverso statuto epistemico.
      </div>
    </header>

    <section className="border-b border-papyrus-line py-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="flex items-center justify-between text-xs text-ink-faint"><span>{formatYear(dataset.defaultRange[0])}</span><strong className="font-mono text-base text-bronze">{formatYear(year)}</strong><span>{formatYear(dataset.defaultRange[1])}</span></div>
          <input type="range" min={dataset.defaultRange[0]} max={dataset.defaultRange[1]} value={year} onChange={(event) => setYear(Number(event.target.value))} className="mt-2 w-full accent-current" aria-label="Anno di riferimento" />
          {(dataset.quickYears?.length ?? 0) > 0 && <div className="mt-3 flex flex-wrap gap-2">{dataset.quickYears!.map((quickYear) => <button key={quickYear} onClick={() => setYear(quickYear)} className={`px-2 py-1 text-[10px] ${year === quickYear ? 'bg-ink text-papyrus' : 'border border-papyrus-line text-ink-faint hover:text-ink'}`}>{formatYear(quickYear)}</button>)}</div>}
        </div>
        <div className="flex flex-wrap gap-1.5">{(Object.keys(layerLabels) as ExplorerLayer[]).map((layer) => <button key={layer} onClick={() => toggleLayer(layer)} className={`px-3 py-1.5 text-xs ${layers.includes(layer) ? 'bg-ink text-papyrus' : 'border border-papyrus-line text-ink-soft hover:text-ink'}`}>{layerLabels[layer]}</button>)}</div>
      </div>
    </section>

    <section className="grid min-h-[680px] gap-0 border-b border-papyrus-line xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 border-b border-papyrus-line py-6 xl:border-b-0 xl:border-r xl:pr-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Scena storica · {formatYear(year)}</p><h2 className="mt-1 font-serif text-2xl font-semibold">{scenario?.title || 'Contesto storico'}</h2>{scenario?.summary && <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-faint">{scenario.summary}</p>}</div>
          <span className="text-xs text-ink-faint">{mapEntities.length} entità visibili</span>
        </div>
        <HistoricalExplorerMap entities={mapEntities} areas={dataset.areas} selectedId={selected?.id} year={year} onSelect={setSelectedId} />
      </div>

      <aside className="min-w-0 py-6 xl:pl-7">
        {selected ? <div className="xl:sticky xl:top-6">
          <div className="flex items-start justify-between gap-4">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">{selected.type}</p><h2 className="mt-2 font-serif text-3xl font-semibold leading-tight">{selected.label}</h2></div>
            <span className="shrink-0 border border-papyrus-line px-2 py-1 text-[10px] text-ink-faint">{statusLabel[selected.epistemicStatus]}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-ink-soft">{selected.summary}</p>
          <dl className="mt-6 border-y border-papyrus-line text-sm">
            <div className="grid grid-cols-[90px_1fr] gap-3 py-3"><dt className="text-ink-faint">Datazione</dt><dd>{selected.temporal.start === undefined ? 'Non determinata' : `${formatYear(selected.temporal.start)}${selected.temporal.end !== undefined && selected.temporal.end !== selected.temporal.start ? ` – ${formatYear(selected.temporal.end)}` : ''}`}</dd></div>
            {selected.spatial?.region && <div className="grid grid-cols-[90px_1fr] gap-3 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Area</dt><dd>{selected.spatial.region}</dd></div>}
          </dl>

          {selected.relations?.length ? <section className="mt-7"><h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">Relazioni</h3><div className="mt-3 space-y-2">{selected.relations.map((relation, index) => <button key={`${relation.targetId}-${index}`} onClick={() => setSelectedId(relation.targetId)} className="block w-full border-t border-papyrus-line pt-2 text-left text-sm text-ink-soft hover:text-ink"><span className="text-ink-faint">{relation.kind} · </span>{relation.label}</button>)}</div></section> : null}

          {selected.sources?.length ? <section className="mt-7"><h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">Fonti e provenienza</h3><div className="mt-3 space-y-3">{selected.sources.map((source, index) => <div key={`${source.label}-${index}`} className="border-t border-papyrus-line pt-3 text-sm"><strong className="font-medium text-ink">{source.label}</strong>{source.citation && <p className="mt-1 leading-6 text-ink-soft">{source.citation}</p>}{source.note && <p className="mt-1 text-xs leading-5 text-ink-faint">{source.note}</p>}</div>)}</div></section> : null}

          {selected.biblicalRefs?.length ? <section className="mt-7"><h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">Riferimenti biblici</h3><div className="mt-3 flex flex-wrap gap-2">{selected.biblicalRefs.map((reference: any, index) => <span key={index} className="border border-papyrus-line px-2.5 py-1.5 text-xs text-ink-soft">{typeof reference === 'string' ? reference : reference.display}</span>)}</div></section> : null}
        </div> : <p className="text-sm text-ink-faint">Nessuna entità selezionata.</p>}
      </aside>
    </section>

    <footer className="flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
      <Link href={`/rebuild/bibbia/${view.slug}`} className="text-ink-soft hover:text-ink">← Torna a {view.bookTitle}</Link>
      <span className="text-ink-faint">Dati Historical Explorer da Sanity production</span>
    </footer>
  </main>;
}
