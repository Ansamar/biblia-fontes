'use client';

import { useEffect, useMemo, useState } from 'react';
import HistoricalExplorerMap from './HistoricalExplorerMap';
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

const scenarios = [
  { start: -911, end: -627, title: 'Orizzonte neo-assiro', summary: 'L’Assiria costituisce il principale quadro imperiale del Vicino Oriente. Ninive emerge come centro politico e il Levante vive dentro una rete di pressioni, tributi e conflitti regionali.' },
  { start: -626, end: -540, title: 'Orizzonte neobabilonese', summary: 'Babilonia sostituisce l’Assiria come potenza dominante. Le conquiste nel Levante, la crisi di Giuda e l’esilio diventano un contesto decisivo per la memoria e la rielaborazione delle tradizioni bibliche.' },
  { start: -539, end: -400, title: 'Orizzonte persiano', summary: 'Con la conquista di Babilonia da parte di Ciro, il Levante entra nel sistema achemenide. Yehud, Gerusalemme e la ricostruzione comunitaria costituiscono un contesto importante per la storia del Pentateuco.' },
];

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

function activeAt(entity: HistoricalEntity, year: number) {
  const { start, end, precision } = entity.temporal;
  if (precision === 'unknown' || start === undefined) return false;
  return start <= year && (end ?? start) >= year;
}

export default function HistoricalExplorerShell({ dataset }: { dataset: HistoricalExplorerDataset }) {
  const [selectedId, setSelectedId] = useState(dataset.entities[0]?.id ?? '');
  const [year, setYear] = useState(Math.round((dataset.defaultRange[0] + dataset.defaultRange[1]) / 2));
  const [layers, setLayers] = useState<ExplorerLayer[]>(['politics', 'places', 'events', 'texts']);
  const [playing, setPlaying] = useState(false);

  const selected = dataset.entities.find((entity) => entity.id === selectedId) ?? dataset.entities[0];
  const visibleEntities = useMemo(() => dataset.entities.filter((entity) => layers.includes(typeToLayer[entity.type])), [dataset.entities, layers]);
  const datedEntities = visibleEntities.filter((entity) => entity.temporal.start !== undefined);
  const activeEntities = datedEntities.filter((entity) => activeAt(entity, year));
  const inactiveEntities = datedEntities.filter((entity) => !activeAt(entity, year));
  const undatedEntities = visibleEntities.filter((entity) => entity.temporal.start === undefined);
  const mapEntities = visibleEntities.filter((entity) => entity.temporal.start === undefined || activeAt(entity, year) || entity.id === selectedId);
  const activeScenario = scenarios.find((scenario) => scenario.start <= year && scenario.end >= year);
  const punctualEvents = activeEntities.filter((entity) => entity.type === 'event' && entity.temporal.start === entity.temporal.end);
  const activePowers = activeEntities.filter((entity) => entity.type === 'empire' || entity.type === 'people');

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((current) => {
        if (current >= dataset.defaultRange[1]) {
          setPlaying(false);
          return dataset.defaultRange[1];
        }
        return Math.min(dataset.defaultRange[1], current + 10);
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [dataset.defaultRange, playing]);

  const toggleLayer = (layer: ExplorerLayer) => {
    setLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);
  };

  const jumpYear = (nextYear: number) => {
    setPlaying(false);
    setYear(Math.max(dataset.defaultRange[0], Math.min(dataset.defaultRange[1], nextYear)));
  };

  const selectEntity = (id: string) => {
    const entity = dataset.entities.find((item) => item.id === id);
    if (!entity) return;
    setPlaying(false);
    setSelectedId(id);
    if (entity.temporal.start !== undefined) {
      const targetYear = entity.temporal.end !== undefined ? Math.round((entity.temporal.start + entity.temporal.end) / 2) : entity.temporal.start;
      setYear(Math.max(dataset.defaultRange[0], Math.min(dataset.defaultRange[1], targetYear)));
    }
  };

  return (
    <section aria-labelledby="historical-explorer-shell-title" className="overflow-hidden rounded-3xl border border-papyrus-line bg-paper-card shadow-sm">
      <header className="border-b border-papyrus-line p-5 md:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Biblia Fontes Historical Explorer · architecture v0.4</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <div><h2 id="historical-explorer-shell-title" className="font-serif text-3xl font-bold md:text-4xl">{dataset.title}</h2><p className="mt-3 max-w-4xl text-base leading-7 text-ink-soft">{dataset.subtitle}</p></div>
          <div className="rounded-xl border border-bronze/30 bg-bronze/5 px-4 py-3 text-sm leading-6 text-ink-soft"><strong className="text-ink">Focus:</strong> storia attestata, ricostruita o discussa intorno al testo.</div>
        </div>
      </header>

      <div className="border-b border-papyrus-line bg-papyrus/20 px-5 py-4 md:px-7">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className="flex items-center justify-between gap-4 text-xs text-ink-faint"><span>{formatYear(dataset.defaultRange[0])}</span><strong className="font-mono text-base text-bronze">{formatYear(year)}</strong><span>{formatYear(dataset.defaultRange[1])}</span></div>
            <input aria-label="Anno di riferimento" type="range" min={dataset.defaultRange[0]} max={dataset.defaultRange[1]} value={year} onChange={(event) => jumpYear(Number(event.target.value))} className="mt-2 w-full accent-current" />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => jumpYear(year - 25)} className="rounded-full border border-papyrus-line px-3 py-1.5 text-[10px] text-ink-faint hover:border-bronze hover:text-bronze">← 25 anni</button>
              <button type="button" onClick={() => setPlaying((current) => !current)} className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${playing ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line text-ink hover:border-bronze'}`}>{playing ? '❚❚ Pausa' : '▶ Riproduci'}</button>
              <button type="button" onClick={() => jumpYear(year + 25)} className="rounded-full border border-papyrus-line px-3 py-1.5 text-[10px] text-ink-faint hover:border-bronze hover:text-bronze">25 anni →</button>
              <span className="mx-1 h-4 w-px bg-papyrus-line" aria-hidden="true" />
              {[-900, -700, -612, -586, -539, -500, -400].filter((item) => item >= dataset.defaultRange[0] && item <= dataset.defaultRange[1]).map((item) => <button key={item} type="button" onClick={() => jumpYear(item)} className={`rounded-full border px-2.5 py-1 text-[10px] transition ${year === item ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line text-ink-faint hover:border-bronze hover:text-bronze'}`}>{formatYear(item)}</button>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Layer storici">{(Object.keys(layerLabels) as ExplorerLayer[]).map((layer) => { const active = layers.includes(layer); return <button key={layer} type="button" onClick={() => toggleLayer(layer)} aria-pressed={active} className={`rounded-full border px-3 py-2 text-xs transition ${active ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line text-ink-soft hover:border-bronze'}`}>{layerLabels[layer]}</button>; })}</div>
        </div>
      </div>

      <div className="border-b border-papyrus-line bg-ink px-5 py-4 text-papyrus md:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-papyrus/55">Scenario storico · {formatYear(year)}</p><h3 className="mt-1 font-serif text-2xl font-bold">{activeScenario?.title ?? 'Transizione storica'}</h3><p className="mt-2 max-w-4xl text-sm leading-6 text-papyrus/75">{activeScenario?.summary ?? 'L’anno selezionato cade in una fase di transizione tra quadri politici. L’Explorer mostra gli elementi attestati pertinenti senza imporre una singola lettura totalizzante.'}</p></div>
          <div className="flex flex-wrap gap-2 text-[10px]">{activePowers.map((entity) => <button key={entity.id} type="button" onClick={() => setSelectedId(entity.id)} className="rounded-full border border-papyrus/25 px-3 py-1.5 text-papyrus/85 hover:border-papyrus/60">{entity.label}</button>)}{punctualEvents.map((entity) => <button key={entity.id} type="button" onClick={() => setSelectedId(entity.id)} className="rounded-full border border-bronze bg-bronze px-3 py-1.5 text-white">◆ {entity.label}</button>)}</div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="min-w-0">
          <div className="grid border-b border-papyrus-line lg:grid-cols-[minmax(0,1.18fr)_minmax(300px,.82fr)]">
            <div className="border-b border-papyrus-line bg-papyrus/25 p-5 lg:border-b-0 lg:border-r md:p-6"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Spazio</p><h3 className="mt-1 font-serif text-2xl font-bold">Mappa storica</h3></div><span className="text-xs text-ink-faint">{activeEntities.length} entità attive</span></div><p className="mt-2 text-xs leading-5 text-ink-faint">La carta mostra la scena dell’anno selezionato; gli elementi fuori periodo vengono rimossi dalla mappa ma restano interrogabili nel pannello accanto.</p><div className="mt-5"><HistoricalExplorerMap entities={mapEntities} selectedId={selected?.id} year={year} onSelect={selectEntity} /></div></div>

            <div className="p-5 md:p-6"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Presenza nel tempo</p><h3 className="mt-1 font-serif text-2xl font-bold">Contesto a {formatYear(year)}</h3><p className="mt-2 text-sm leading-6 text-ink-faint">Prima ciò che è attivo in questa data; sotto, gli altri elementi datati del campo selezionato.</p><div className="mt-5 space-y-2">{activeEntities.length ? activeEntities.map((entity) => <button key={entity.id} type="button" onClick={() => selectEntity(entity.id)} className={`block w-full rounded-xl border p-3 text-left transition ${selected?.id === entity.id ? 'border-bronze bg-bronze text-white' : 'border-bronze/45 bg-bronze/8 hover:border-bronze'}`}><div className="flex items-center justify-between gap-3"><strong className="font-serif text-lg">{entity.label}</strong><span className={`font-mono text-[9px] uppercase tracking-wide ${selected?.id === entity.id ? 'text-white/70' : 'text-ink-faint'}`}>{statusLabels[entity.epistemicStatus]}</span></div><p className={`mt-1 text-xs ${selected?.id === entity.id ? 'text-white/75' : 'text-ink-faint'}`}>{temporalLabel(entity)}</p></button>) : <div className="rounded-xl border border-dashed border-papyrus-line p-4 text-sm leading-6 text-ink-faint">Nessuna entità datata attiva con i layer correnti.</div>}</div>{inactiveEntities.length ? <details className="mt-4"><summary className="cursor-pointer text-xs font-semibold text-ink-faint hover:text-bronze">Altri elementi datati ({inactiveEntities.length})</summary><div className="mt-2 space-y-2">{inactiveEntities.map((entity) => <button key={entity.id} type="button" onClick={() => selectEntity(entity.id)} className="block w-full rounded-xl border border-papyrus-line bg-paper-card p-3 text-left opacity-65 transition hover:border-bronze hover:opacity-100"><strong className="font-serif">{entity.label}</strong><p className="mt-1 text-xs text-ink-faint">{temporalLabel(entity)}</p></button>)}</div></details> : null}</div>
          </div>

          <div className="p-5 md:p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Fuori scala</p><h3 className="mt-1 font-serif text-2xl font-bold">Relazioni non databili</h3></div><p className="max-w-xl text-sm leading-6 text-ink-faint">Comparanda, aree culturali e memorie restano interrogabili senza ricevere una data artificiale.</p></div>{undatedEntities.length ? <div className="mt-5 flex flex-wrap gap-2">{undatedEntities.map((entity) => <button key={entity.id} type="button" onClick={() => selectEntity(entity.id)} className={`rounded-xl border border-dashed px-4 py-3 text-left transition ${selected?.id === entity.id ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line hover:border-bronze'}`}><span className="block font-serif font-bold">{entity.label}</span><span className={`mt-1 block text-xs ${selected?.id === entity.id ? 'text-white/70' : 'text-ink-faint'}`}>{statusLabels[entity.epistemicStatus]} · {entity.biblicalRefs?.join(', ')}</span></button>)}</div> : null}</div>
        </div>

        <aside className="border-t border-papyrus-line bg-papyrus/30 p-6 xl:border-l xl:border-t-0" aria-live="polite">{selected ? <><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">Inspector · {selected.type}</p><h3 className="mt-2 font-serif text-3xl font-bold">{selected.label}</h3><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full border border-papyrus-line bg-paper-card px-3 py-1 text-xs font-semibold text-ink-soft">{statusLabels[selected.epistemicStatus]}</span><span className="rounded-full border border-papyrus-line px-3 py-1 text-xs text-ink-faint">{temporalLabel(selected)}</span></div>{selected.spatial?.region ? <p className="mt-3 text-sm text-ink-faint">Spazio: {selected.spatial.region}</p> : null}<p className="mt-6 text-base leading-7 text-ink">{selected.summary}</p>{selected.biblicalRefs?.length ? <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Nei testi</p><p className="mt-2 text-sm leading-6 text-ink-soft">{selected.biblicalRefs.join(' · ')}</p></div> : null}{selected.relations.length ? <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Relazioni</p><ul className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">{selected.relations.map((relation) => <li key={`${relation.targetId}-${relation.kind}`}><button type="button" onClick={() => selectEntity(relation.targetId)} className="text-left hover:text-bronze">→ {relation.label}</button></li>)}</ul></div> : null}<div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Fonti / provenienza</p><ul className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">{selected.sources.map((source) => <li key={source.label}><strong className="text-ink">{source.label}</strong>{source.note ? ` — ${source.note}` : ''}</li>)}</ul></div></> : null}</aside>
      </div>
    </section>
  );
}
