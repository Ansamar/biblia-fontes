'use client';

import type { HistoricalArea, HistoricalEntity } from '../historical-explorer/types';
import HistoricalProvenance from './HistoricalProvenance';
import HistoricalMap, { type HistoricalMapArea, type HistoricalMapPoint } from './historical-map/HistoricalMap';

function activeAt(entity: HistoricalEntity, year: number) { const { start, end, precision } = entity.temporal; if (precision === 'unknown' || start === undefined) return true; return start <= year && (end ?? start) >= year; }
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }

export default function HistoricalExplorerMap({ entities, areas = [], selectedId, year, onSelect, contextTitle, contextSummary }: { entities: HistoricalEntity[]; areas?: HistoricalArea[]; selectedId?: string; year: number; onSelect: (id: string) => void; contextTitle?: string; contextSummary?: string }) {
  const points: HistoricalMapPoint[] = entities.flatMap((entity) => { const lat = entity.spatial?.lat, lng = entity.spatial?.lng; if (!finite(lat) || !finite(lng)) return []; return [{ id: entity.id, label: entity.label, type: entity.type, lat, lng, active: activeAt(entity, year), selected: entity.id === selectedId, subtitle: entity.spatial?.region }]; });
  const activeAreaRecords = areas.filter((area) => area.temporal.start <= year && area.temporal.end >= year);
  const mapAreas: HistoricalMapArea[] = activeAreaRecords.map((area) => ({ id: area.id, entityId: area.entityId, label: area.label, coordinates: area.geometry.coordinates[0] ?? [] }));

  return <div>
    <HistoricalMap points={points} areas={mapAreas} selectedId={selectedId} onSelect={onSelect} contextTitle={contextTitle} contextSummary={contextSummary} headerRight={<span>{points.filter((point) => point.active !== false).length} elementi attivi · {points.length} georeferenziati</span>} footer={areas.length > 0 ? 'Le aree tratteggiate rappresentano ricostruzioni storico-didattiche approssimate, non frontiere certe.' : 'I marker derivano dalle coordinate archiviate nel dataset; i livelli distinguono la natura delle entità rappresentate.'} />
    {activeAreaRecords.length > 0 ? <details className="border-x border-b border-papyrus-line bg-paper-card px-4 py-3"><summary className="cursor-pointer text-xs font-semibold text-ink-soft hover:text-bronze">Provenienza delle geometrie attive ({activeAreaRecords.length})</summary><div className="mt-3 space-y-4">{activeAreaRecords.map((area) => <div key={area.id} className="rounded-xl border border-papyrus-line bg-papyrus/20 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><strong className="font-serif text-base text-ink">{area.label}</strong><p className="mt-1 text-xs leading-5 text-ink-faint">{area.note}</p></div><span className="rounded-full border border-papyrus-line px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-ink-faint">{area.confidence}</span></div><div className="mt-3"><HistoricalProvenance sources={area.sources} compact /></div></div>)}</div></details> : null}
  </div>;
}
