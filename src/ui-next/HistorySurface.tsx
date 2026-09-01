'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import HistoricalExplorerMap from '../components/HistoricalExplorerMap';
import type { ExplorerLayer, HistoricalEntity } from '../historical-explorer/types';
import type { HistoryView } from '../data-access/history';
import { historicalEntityTypeLabel, historicalRelationLabel, italianizeVisibleCopy } from '../lib/italianUi';
import { useExplorerUrlState } from '../historical-explorer/useExplorerUrlState';

const layerLabels: Record<ExplorerLayer, string> = { politics: 'Poteri', places: 'Luoghi', events: 'Eventi', institutions: 'Istituzioni', texts: 'Testi', transmission: 'Trasmissione' };
const typeToLayer: Record<HistoricalEntity['type'], ExplorerLayer> = { people: 'politics', empire: 'politics', person: 'politics', city: 'places', region: 'places', event: 'events', institution: 'institutions', practice: 'institutions', text: 'texts', redaction: 'texts', witness: 'transmission' };
const statusLabel: Record<HistoricalEntity['epistemicStatus'], string> = { attested: 'attestato', probable: 'probabile', debated: 'discusso', memory: 'memoria', comparandum: 'comparandum', narrative: 'narrativo', undatable: 'non databile' };

function formatYear(year?: number) {
  if (year === undefined) return 'non databile';
  if (year < 0) return `${Math.abs(year)} a.C.`;
  if (year === 0) return '0';
  return `${year} d.C.`;
}

function activeAt(entity: HistoricalEntity, year: number) {
  if (entity.temporal.start === undefined) return true;
  return entity.temporal.start <= year && (entity.temporal.end ?? entity.temporal.start) >= year;
}

function biblicalRefHref(reference: any) {
  if (!reference || typeof reference === 'string' || !reference.bookSlug) return null;
  const chapter = reference.chapterStart;
  if (!chapter) return `/rebuild/bibbia/${reference.bookSlug}`;
  return `/rebuild/bibbia/${reference.bookSlug}/${chapter}`;
}

export default function HistorySurface({ view, chapter, contextualized = false, primaryEntityIds = [], initialYear, initialEntityId }: { view: HistoryView; chapter?: number; contextualized?: boolean; primaryEntityIds?: string[]; initialYear?: number; initialEntityId?: string }) {
  const { dataset } = view;
  const fallbackYear = Math.round((dataset.defaultRange[0] + dataset.defaultRange[1]) / 2);
  const clampedInitialYear = initialYear === undefined ? fallbackYear : Math.max(dataset.defaultRange[0], Math.min(dataset.defaultRange[1], Math.round(initialYear)));
  const validInitialEntity = initialEntityId && dataset.entities.some((entity) => entity.id === initialEntityId) ? initialEntityId : primaryEntityIds[0] || dataset.entities[0]?.id || '';
  const [year, setYear] = useState(clampedInitialYear);
  const [selectedId, setSelectedId] = useState(validInitialEntity);
  const [layers, setLayers] = useState<ExplorerLayer[]>(['politics', 'places', 'events', 'institutions', 'texts']);

  const visible = useMemo(() => dataset.entities.filter((entity) => layers.includes(typeToLayer[entity.type])), [dataset.entities, layers]);
  const mapEntities = visible.filter((entity) => activeAt(entity, year) || entity.id === selectedId);
  const selected = dataset.entities.find((entity) => entity.id === selectedId) || dataset.entities[0];
  const scenario = dataset.scenarios?.find((item) => item.start <= year && item.end >= year);
  const toggleLayer = (layer: ExplorerLayer) => setLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);
  useExplorerUrlState({ year, entityId: selectedId });

  return <main className="mx-auto max-w-[1560px] px-4 py-6 md:px-7 md:py-8">
    <header className="grid gap-7 border-b border-papyrus-line pb-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
      <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Prospettiva storica</p><h1 className="mt-2 font-serif text-4xl font-semibold md:text-5xl">{view.bookTitle}{chapter ? ` ${chapter}` : ''} nella storia</h1><p className="mt-3 max-w-3xl text-base leading-7 text-ink-soft">{italianizeVisibleCopy(dataset.subtitle)}</p>{chapter && !contextualized && <p className="mt-3 max-w-3xl border-l-2 border-bronze/40 pl-3 text-xs leading-5 text-ink-faint">Non risultano ancora entità collegate direttamente al capitolo {chapter}; viene mostrata la rete storica generale del libro.</p>}</div>
      <p className="border-l border-papyrus-line pl-6 text-xs leading-6 text-ink-faint">Attestazioni, ipotesi, memorie e comparanda conservano il proprio statuto. La cronologia orienta la ricerca, non trasforma il racconto in cronaca.</p>
    </header>

    <section className="border-b border-papyrus-line py-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div><div className="flex items-center justify-between text-xs text-ink-faint"><span>{formatYear(dataset.defaultRange[0])}</span><strong className="font-mono text-base text-bronze">{formatYear(year)}</strong><span>{formatYear(dataset.defaultRange[1])}</span></div><input type="range" min={dataset.defaultRange[0]} max={dataset.defaultRange[1]} value={year} onChange={(event) => setYear(Number(event.target.value))} className="mt-2 w-full accent-current" aria-label="Anno di riferimento" />{(dataset.quickYears?.length ?? 0) > 0 && <div className="mt-3 flex flex-wrap gap-2">{dataset.quickYears!.map((quickYear) => <button key={quickYear} onClick={() => setYear(quickYear)} className={`px-2 py-1 text-[10px] ${year === quickYear ? 'bg-ink text-papyrus' : 'border border-papyrus-line text-ink-faint hover:text-ink'}`}>{formatYear(quickYear)}</button>)}</div>}</div>
        <div className="flex flex-wrap gap-1.5">{(Object.keys(layerLabels) as ExplorerLayer[]).map((layer) => <button key={layer} onClick={() => toggleLayer(layer)} className={`px-3 py-1.5 text-xs ${layers.includes(layer) ? 'bg-ink text-papyrus' : 'border border-papyrus-line text-ink-soft hover:text-ink'}`}>{layerLabels[layer]}</button>)}</div>
      </div>
    </section>

    <section className="grid min-h-[680px] border-b border-papyrus-line xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 border-b border-papyrus-line py-6 xl:border-b-0 xl:border-r xl:pr-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">{formatYear(year)}</p><h2 className="mt-1 font-serif text-2xl font-semibold">{italianizeVisibleCopy(scenario?.title || 'Contesto storico')}</h2>{scenario?.summary && <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-faint">{italianizeVisibleCopy(scenario.summary)}</p>}</div><span className="text-xs text-ink-faint">{mapEntities.length} entità visibili</span></div>
        <HistoricalExplorerMap entities={mapEntities} areas={dataset.areas} selectedId={selected?.id} year={year} onSelect={setSelectedId} />
      </div>

      <aside className="min-w-0 py-6 xl:pl-7">
        {selected ? <div className="xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pb-8">
          <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">{historicalEntityTypeLabel(selected.type)}</p><h2 className="mt-2 font-serif text-3xl font-semibold leading-tight">{italianizeVisibleCopy(selected.label)}</h2></div><span className="shrink-0 border border-papyrus-line px-2 py-1 text-[9px] text-ink-faint">{statusLabel[selected.epistemicStatus]}</span></div>
          <p className="mt-4 text-sm leading-7 text-ink-soft">{italianizeVisibleCopy(selected.summary)}</p>
          <dl className="mt-6 border-y border-papyrus-line text-sm"><div className="grid grid-cols-[86px_1fr] gap-3 py-3"><dt className="text-ink-faint">Datazione</dt><dd>{selected.temporal.start === undefined ? 'Non determinata' : `${formatYear(selected.temporal.start)}${selected.temporal.end !== undefined && selected.temporal.end !== selected.temporal.start ? ` – ${formatYear(selected.temporal.end)}` : ''}`}</dd></div>{selected.spatial?.region && <div className="grid grid-cols-[86px_1fr] gap-3 border-t border-papyrus-line py-3"><dt className="text-ink-faint">Area</dt><dd>{selected.spatial.region}</dd></div>}</dl>

          {selected.biblicalRefs?.length ? <section className="mt-7"><h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Nel corpus</h3><div className="mt-3 flex flex-wrap gap-2">{selected.biblicalRefs.map((reference: any, index) => { const href = biblicalRefHref(reference); const label = typeof reference === 'string' ? reference : reference.display; return href ? <Link key={index} href={href} className="border border-papyrus-line px-2.5 py-1.5 text-xs text-ink-soft hover:border-bronze hover:text-ink">{label} →</Link> : <span key={index} className="border border-papyrus-line px-2.5 py-1.5 text-xs text-ink-faint">{label}</span>; })}</div></section> : null}

          {selected.relations?.length ? <section className="mt-7"><h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Relazioni</h3><div className="mt-3 divide-y divide-papyrus-line border-y border-papyrus-line">{selected.relations.map((relation, index) => <button key={`${relation.targetId}-${index}`} onClick={() => setSelectedId(relation.targetId)} className="block w-full py-2.5 text-left text-sm text-ink-soft hover:text-ink"><span className="text-ink-faint">{historicalRelationLabel(relation.kind)} · </span>{italianizeVisibleCopy(relation.label)}</button>)}</div></section> : null}

          {selected.sources?.length ? <section className="mt-7"><h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Provenienza</h3><div className="mt-3 divide-y divide-papyrus-line border-y border-papyrus-line">{selected.sources.map((source, index) => <div key={`${source.label}-${index}`} className="py-3 text-sm"><strong className="font-medium text-ink">{italianizeVisibleCopy(source.label)}</strong>{source.citation && <p className="mt-1 leading-6 text-ink-soft">{source.citation}</p>}{source.note && <p className="mt-1 text-xs leading-5 text-ink-faint">{italianizeVisibleCopy(source.note)}</p>}</div>)}</div></section> : null}
        </div> : <p className="text-sm text-ink-faint">Nessuna entità selezionata.</p>}
      </aside>
    </section>

    <footer className="flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between"><Link href={`/rebuild/bibbia/${view.slug}${chapter ? `/${chapter}` : ''}`} className="text-ink-soft hover:text-ink">← Torna a {view.bookTitle}{chapter ? ` ${chapter}` : ''}</Link><Link href="/rebuild/historical-explorer" className="text-ink-faint hover:text-ink">Cambia libro o data</Link></footer>
  </main>;
}
