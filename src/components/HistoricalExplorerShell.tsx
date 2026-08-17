'use client';

import { useMemo, useState } from 'react';
import type { ExplorerLayer, HistoricalEntity, HistoricalExplorerDataset } from '../historical-explorer/types';

const layerLabels: Record<ExplorerLayer, string> = {
  politics: 'Popoli e poteri',
  places: 'Luoghi',
  events: 'Eventi e memorie',
  texts: 'Testi e formazione',
  transmission: 'Trasmissione',
};

const typeToLayer: Record<HistoricalEntity['type'], ExplorerLayer> = {
  people: 'politics', empire: 'politics', person: 'politics',
  city: 'places', region: 'places',
  event: 'events',
  text: 'texts', redaction: 'texts',
  witness: 'transmission',
};

const statusLabels: Record<HistoricalEntity['epistemicStatus'], string> = {
  attested: 'attestato', probable: 'probabile', debated: 'discusso', memory: 'memoria',
  comparandum: 'comparandum', narrative: 'narrativo', undatable: 'non databile',
};

function formatYear(year?: number) {
  if (year === undefined) return 'non databile';
  if (year < 0) return `${Math.abs(year)} a.C.`;
  if (year === 0) return '0';
  return `${year} d.C.`;
}

function temporalLabel(entity: HistoricalEntity) {
  const { start, end, precision } = entity.temporal;
  if (precision === 'unknown' || start === undefined) return 'cronologia non determinata';
  if (end === undefined || end === start) return formatYear(start);
  return `${formatYear(start)} – ${formatYear(end)}`;
}

export default function HistoricalExplorerShell({ dataset }: { dataset: HistoricalExplorerDataset }) {
  const [selectedId, setSelectedId] = useState(dataset.entities[0]?.id ?? '');
  const [year, setYear] = useState(Math.round((dataset.defaultRange[0] + dataset.defaultRange[1]) / 2));
  const [layers, setLayers] = useState<ExplorerLayer[]>(['politics', 'places', 'events', 'texts']);

  const selected = dataset.entities.find((entity) => entity.id === selectedId) ?? dataset.entities[0];
  const visibleEntities = useMemo(() => dataset.entities.filter((entity) => layers.includes(typeToLayer[entity.type])), [dataset.entities, layers]);
  const datedEntities = visibleEntities.filter((entity) => entity.temporal.start !== undefined);
  const undatedEntities = visibleEntities.filter((entity) => entity.temporal.start === undefined);

  const toggleLayer = (layer: ExplorerLayer) => {
    setLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);
  };

  return (
    <section aria-labelledby="historical-explorer-shell-title" className="overflow-hidden rounded-3xl border border-papyrus-line bg-paper-card shadow-sm">
      <header className="border-b border-papyrus-line p-5 md:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Biblia Fontes Historical Explorer · architecture v0.2</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 id="historical-explorer-shell-title" className="font-serif text-3xl font-bold md:text-4xl">{dataset.title}</h2>
            <p className="mt-3 max-w-4xl text-base leading-7 text-ink-soft">{dataset.subtitle}</p>
          </div>
          <div className="rounded-xl border border-bronze/30 bg-bronze/5 px-4 py-3 text-sm leading-6 text-ink-soft">
            <strong className="text-ink">Focus:</strong> storia attestata, ricostruita o discussa intorno al testo.
          </div>
        </div>
      </header>

      <div className="border-b border-papyrus-line bg-papyrus/20 px-5 py-4 md:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center justify-between gap-4 text-xs text-ink-faint">
              <span>{formatYear(dataset.defaultRange[0])}</span>
              <strong className="font-mono text-sm text-bronze">{formatYear(year)}</strong>
              <span>{formatYear(dataset.defaultRange[1])}</span>
            </div>
            <input
              aria-label="Anno di riferimento"
              type="range"
              min={dataset.defaultRange[0]}
              max={dataset.defaultRange[1]}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="mt-2 w-full accent-current"
            />
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Layer storici">
            {(Object.keys(layerLabels) as ExplorerLayer[]).map((layer) => {
              const active = layers.includes(layer);
              return <button key={layer} type="button" onClick={() => toggleLayer(layer)} aria-pressed={active} className={`rounded-full border px-3 py-2 text-xs transition ${active ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line text-ink-soft hover:border-bronze'}`}>{layerLabels[layer]}</button>;
            })}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="min-w-0">
          <div className="grid border-b border-papyrus-line lg:grid-cols-[minmax(0,1fr)_minmax(320px,.75fr)]">
            <div className="min-h-[330px] border-b border-papyrus-line bg-papyrus/25 p-5 lg:border-b-0 lg:border-r md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Spazio</p><h3 className="mt-1 font-serif text-2xl font-bold">Mappa storica</h3></div>
                <span className="text-xs text-ink-faint">scheletro geo-temporale</span>
              </div>
              <div className="relative mt-5 min-h-[245px] overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card/70 p-5">
                <div aria-hidden="true" className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '44px 44px', color: 'var(--papyrus-line)' }} />
                <div className="relative flex h-full min-h-[205px] flex-wrap content-center justify-center gap-3">
                  {visibleEntities.filter((entity) => entity.spatial?.region).map((entity) => <button key={entity.id} type="button" onClick={() => setSelectedId(entity.id)} className={`rounded-full border px-4 py-2 text-sm shadow-sm transition ${selected?.id === entity.id ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line bg-paper-card text-ink-soft hover:border-bronze hover:text-bronze'}`}><span className="font-semibold">{entity.label}</span><span className="ml-2 text-[10px] opacity-70">{entity.spatial?.region}</span></button>)}
                </div>
              </div>
            </div>

            <div className="min-h-[330px] p-5 md:p-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Presenza nel tempo</p>
              <h3 className="mt-1 font-serif text-2xl font-bold">Contesto a {formatYear(year)}</h3>
              <div className="mt-5 space-y-2">
                {datedEntities.map((entity) => {
                  const activeAtYear = (entity.temporal.start ?? year) <= year && (entity.temporal.end ?? entity.temporal.start ?? year) >= year;
                  return <button key={entity.id} type="button" onClick={() => setSelectedId(entity.id)} className={`block w-full rounded-xl border p-3 text-left transition ${activeAtYear ? 'border-bronze/50 bg-bronze/8' : 'border-papyrus-line bg-paper-card opacity-60 hover:opacity-100'}`}><div className="flex items-center justify-between gap-3"><strong className="font-serif text-lg">{entity.label}</strong><span className="font-mono text-[9px] uppercase tracking-wide text-ink-faint">{statusLabels[entity.epistemicStatus]}</span></div><p className="mt-1 text-xs text-ink-faint">{temporalLabel(entity)}</p></button>;
                })}
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Relazioni</p><h3 className="mt-1 font-serif text-2xl font-bold">Storia intorno al testo</h3></div><p className="max-w-xl text-sm leading-6 text-ink-faint">Gli elementi non databili restano visibili come comparanda o memorie, senza essere forzati sull’asse cronologico.</p></div>
            {undatedEntities.length ? <div className="mt-5 flex flex-wrap gap-2">{undatedEntities.map((entity) => <button key={entity.id} type="button" onClick={() => setSelectedId(entity.id)} className="rounded-xl border border-dashed border-papyrus-line px-4 py-3 text-left hover:border-bronze"><span className="block font-serif font-bold">{entity.label}</span><span className="mt-1 block text-xs text-ink-faint">{statusLabels[entity.epistemicStatus]} · {entity.biblicalRefs?.join(', ')}</span></button>)}</div> : null}
          </div>
        </div>

        <aside className="border-t border-papyrus-line bg-papyrus/30 p-6 xl:border-l xl:border-t-0" aria-live="polite">
          {selected ? <>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">Inspector · {selected.type}</p>
            <h3 className="mt-2 font-serif text-3xl font-bold">{selected.label}</h3>
            <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full border border-papyrus-line bg-paper-card px-3 py-1 text-xs font-semibold text-ink-soft">{statusLabels[selected.epistemicStatus]}</span><span className="rounded-full border border-papyrus-line px-3 py-1 text-xs text-ink-faint">{temporalLabel(selected)}</span></div>
            <p className="mt-6 text-base leading-7 text-ink">{selected.summary}</p>
            {selected.biblicalRefs?.length ? <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Nei testi</p><p className="mt-2 text-sm leading-6 text-ink-soft">{selected.biblicalRefs.join(' · ')}</p></div> : null}
            {selected.relations.length ? <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Relazioni</p><ul className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">{selected.relations.map((relation) => <li key={`${relation.targetId}-${relation.kind}`}>{relation.label}</li>)}</ul></div> : null}
            <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Fonti / provenienza</p><ul className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">{selected.sources.map((source) => <li key={source.label}><strong className="text-ink">{source.label}</strong>{source.note ? ` — ${source.note}` : ''}</li>)}</ul></div>
          </> : null}
        </aside>
      </div>
    </section>
  );
}
