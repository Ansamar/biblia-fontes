'use client';

import { useEffect, useState } from 'react';
import type { EpistemicStatus, HistoricalArea, HistoricalEntity } from '../historical-explorer/types';
import HistoricalProvenance from './HistoricalProvenance';
import HistoricalMap, { type HistoricalMapArea, type HistoricalMapPoint, type MapEpistemicStatus, type MapLayer } from './historical-map/HistoricalMapV2';

function activeAt(entity: HistoricalEntity, year: number) { const { start, end, precision } = entity.temporal; if (precision === 'unknown' || start === undefined) return true; return start <= year && (end ?? start) >= year; }
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function areaActiveAt(area: HistoricalArea, year: number) {
  const start = area?.temporal?.start;
  const end = area?.temporal?.end;
  if (!finite(start) || !finite(end)) return false;
  return start <= year && end >= year;
}
function validRing(area: HistoricalArea): number[][] | null {
  const ring = area?.geometry?.coordinates?.[0];
  if (!Array.isArray(ring)) return null;
  const coordinates = ring.filter((pair): pair is number[] => Array.isArray(pair) && pair.length >= 2 && finite(pair[0]) && finite(pair[1]));
  return coordinates.length >= 4 ? coordinates : null;
}

export default function HistoricalExplorerMap({ entities, areas = [], selectedId, year, onSelect, contextTitle, contextSummary, visibleLayers, onVisibleLayersChange, visibleStatuses, onVisibleStatusesChange }: { entities: HistoricalEntity[]; areas?: HistoricalArea[]; selectedId?: string; year: number; onSelect: (id: string) => void; contextTitle?: string; contextSummary?: string; visibleLayers?: MapLayer[]; onVisibleLayersChange?: (layers: MapLayer[]) => void; visibleStatuses?: EpistemicStatus[]; onVisibleStatusesChange?: (statuses: EpistemicStatus[]) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const points: HistoricalMapPoint[] = entities.flatMap((entity) => { const lat = entity.spatial?.lat, lng = entity.spatial?.lng; if (!finite(lat) || !finite(lng)) return []; return [{ id: entity.id, label: entity.label, type: entity.type, lat, lng, active: activeAt(entity, year), selected: entity.id === selectedId, subtitle: entity.spatial?.region, epistemicStatus: entity.epistemicStatus as MapEpistemicStatus }]; });
  const activeAreaRecords = areas.filter((area) => areaActiveAt(area, year) && Boolean(validRing(area)));
  const mapAreas: HistoricalMapArea[] = activeAreaRecords.flatMap((area) => {
    const coordinates = validRing(area);
    if (!coordinates) return [];
    return [{ id: area.id, entityId: area.entityId, label: area.label, coordinates }];
  });

  if (!mounted) {
    return <div className="h-[430px] rounded-2xl border border-papyrus-line bg-paper-card md:h-[520px]" aria-label="Caricamento mappa storica" />;
  }

  return <div>
    <HistoricalMap points={points} areas={mapAreas} selectedId={selectedId} onSelect={onSelect} contextTitle={contextTitle} contextSummary={contextSummary} visibleLayers={visibleLayers} onVisibleLayersChange={onVisibleLayersChange} visibleStatuses={visibleStatuses as MapEpistemicStatus[] | undefined} onVisibleStatusesChange={onVisibleStatusesChange as ((statuses: MapEpistemicStatus[]) => void) | undefined} headerRight={<span>{points.filter((point) => point.active !== false).length} elementi attivi · {points.length} georeferenziati</span>} footer={areas.length > 0 ? 'Le aree campite rappresentano ricostruzioni storico-didattiche approssimate, non frontiere certe.' : 'I marker derivano dalle coordinate archiviate nel dataset.'} />
    {activeAreaRecords.length > 0 ? <details className="border-x border-b border-papyrus-line bg-paper-card px-4 py-3"><summary className="cursor-pointer text-xs font-semibold text-ink-soft hover:text-bronze">Provenienza delle geometrie attive ({activeAreaRecords.length})</summary><div className="mt-3 space-y-4">{activeAreaRecords.map((area) => <div key={area.id} className="rounded-xl border border-papyrus-line bg-papyrus/20 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><strong className="font-serif text-base text-ink">{area.label}</strong><p className="mt-1 text-xs leading-5 text-ink-faint">{area.note}</p></div><span className="rounded-full border border-papyrus-line px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-ink-faint">{area.confidence}</span></div><div className="mt-3"><HistoricalProvenance sources={area.sources || []} compact /></div></div>)}</div></details> : null}
  </div>;
}