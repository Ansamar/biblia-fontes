'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from 'react';
import { historicalMapPresets, inferHistoricalMapPreset, type HistoricalMapPresetId } from './mapPresets';

export type MapLayer = 'places' | 'powers' | 'events' | 'texts';
export type MapEpistemicStatus = 'attested' | 'probable' | 'debated' | 'memory' | 'comparandum' | 'narrative' | 'undatable';
export type HistoricalMapPoint = { id: string; label: string; type: string; lat: number; lng: number; active?: boolean; selected?: boolean; subtitle?: string; epistemicStatus?: MapEpistemicStatus };
export type HistoricalMapArea = { id: string; entityId: string; label: string; coordinates: number[][] };
type HistoricalMapProps = {
  points: HistoricalMapPoint[];
  areas?: HistoricalMapArea[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  preset?: HistoricalMapPresetId;
  heightClassName?: string;
  headerRight?: ReactNode;
  footer?: ReactNode;
  contextTitle?: string;
  contextSummary?: string;
  visibleLayers?: MapLayer[];
  onVisibleLayersChange?: (layers: MapLayer[]) => void;
  visibleStatuses?: MapEpistemicStatus[];
  onVisibleStatusesChange?: (statuses: MapEpistemicStatus[]) => void;
};
type DisplayPoint = HistoricalMapPoint & { x: number; y: number; dx: number; dy: number; groupSize: number };

type Camera = { zoom: number; x: number; y: number };

const W = 1200, H = 680;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ALL_LAYERS: MapLayer[] = ['places', 'powers', 'events', 'texts'];
const ALL_STATUSES: MapEpistemicStatus[] = ['attested', 'probable', 'debated', 'memory', 'comparandum', 'narrative', 'undatable'];
const baseAssets: Record<HistoricalMapPresetId, string> = { 'near-east': '/maps/historical-near-east.svg', levant: '/maps/historical-levant.svg', 'eastern-mediterranean': '/maps/historical-eastern-mediterranean.svg' };

const layerMeta: Record<MapLayer, { label: string; description: string; color: string; glyph: string }> = {
  places: { label: 'Luoghi', description: '● città · ◉ regione', color: '#2f2924', glyph: '●' },
  powers: { label: 'Territori e poteri', description: '⬡ potere · area campita se disponibile', color: '#443222', glyph: '⬡' },
  events: { label: 'Eventi', description: '◆ evento localizzato o collegato a un luogo', color: '#7a3028', glyph: '◆' },
  texts: { label: 'Testi e tradizioni', description: '▣ formazione, redazione, trasmissione e pratiche', color: '#9b6a38', glyph: '▣' },
};

const statusGroups: Array<{ label: string; statuses: MapEpistemicStatus[]; description: string }> = [
  { label: 'Attestato', statuses: ['attested'], description: 'bordo pieno' },
  { label: 'Probabile', statuses: ['probable'], description: 'bordo quasi pieno' },
  { label: 'Discusso', statuses: ['debated'], description: 'bordo tratteggiato' },
  { label: 'Memoria / comparandum', statuses: ['memory', 'comparandum'], description: 'tratteggio marcato' },
  { label: 'Narrativo / non databile', statuses: ['narrative', 'undatable'], description: 'tratteggio fine' },
];

function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
export function historicalMapLayerForType(type: string): MapLayer {
  if (type === 'city' || type === 'region') return 'places';
  if (type === 'empire' || type === 'people' || type === 'person') return 'powers';
  if (type === 'event') return 'events';
  return 'texts';
}
function markerStyle(type: string, selected: boolean) {
  if (selected) return { fill: '#a06c35', stroke: '#f8f1e5', radius: 11, text: '#2c241d' };
  const layer = historicalMapLayerForType(type); const fill = layerMeta[layer].color;
  return { fill, stroke: '#f8f1e5', radius: layer === 'places' ? 7 : layer === 'powers' ? 10 : 8, text: fill };
}
function statusStroke(status?: MapEpistemicStatus) {
  if (!status || status === 'attested') return undefined;
  if (status === 'probable') return '8 2';
  if (status === 'debated') return '6 4';
  if (status === 'memory' || status === 'comparandum') return '3 4';
  return '2 3';
}
function statusOpacity(status?: MapEpistemicStatus) {
  if (!status || status === 'attested') return 1;
  if (status === 'probable') return .92;
  if (status === 'debated') return .84;
  if (status === 'memory' || status === 'comparandum') return .76;
  return .7;
}
function spreadCoincidentPoints(points: Array<HistoricalMapPoint & { x: number; y: number }>): DisplayPoint[] {
  const groups = new Map<string, Array<HistoricalMapPoint & { x: number; y: number }>>();
  points.forEach((point) => { const key = `${point.lat.toFixed(3)}:${point.lng.toFixed(3)}`; groups.set(key, [...(groups.get(key) ?? []), point]); });
  return Array.from(groups.values()).flatMap((group) => group.length === 1 ? [{ ...group[0], dx: 0, dy: 0, groupSize: 1 }] : group.map((point, index) => { const radius = group.length <= 3 ? 15 : group.length <= 6 ? 21 : 27; const angle = -Math.PI / 2 + Math.PI * 2 * index / group.length; return { ...point, dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius, groupSize: group.length }; }));
}
function hexPoints(x: number, y: number, r: number) { return Array.from({ length: 6 }, (_, index) => { const angle = Math.PI / 6 + index * Math.PI / 3; return `${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`; }).join(' '); }
function clampZoom(value: number) { return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value)); }
function nextSelection<T extends string>(current: T[], values: T[]) {
  const allActive = values.every((value) => current.includes(value));
  return allActive ? current.filter((value) => !values.includes(value)) : Array.from(new Set([...current, ...values]));
}

export default function HistoricalMap({ points, areas = [], selectedId, onSelect, preset, heightClassName = 'h-[430px] md:h-[520px]', headerRight, footer, contextTitle, contextSummary, visibleLayers, onVisibleLayersChange, visibleStatuses, onVisibleStatusesChange }: HistoricalMapProps) {
  const [localLayers, setLocalLayers] = useState<MapLayer[]>(ALL_LAYERS);
  const [localStatuses, setLocalStatuses] = useState<MapEpistemicStatus[]>(ALL_STATUSES);
  const [camera, setCamera] = useState<Camera>({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ x: number; y: number; cameraX: number; cameraY: number } | null>(null);

  const layers = visibleLayers ?? localLayers;
  const statuses = visibleStatuses ?? localStatuses;
  const setLayers = onVisibleLayersChange ?? setLocalLayers;
  const setStatuses = onVisibleStatusesChange ?? setLocalStatuses;
  const cleanPoints = points.filter((p) => finite(p.lat) && finite(p.lng));
  const presetId = preset ?? inferHistoricalMapPreset(cleanPoints); const mapPreset = historicalMapPresets[presetId];
  const { minLat, maxLat, minLng, maxLng } = mapPreset.bounds;
  const project = (lng: number, lat: number) => ({ x: (lng - minLng) / (maxLng - minLng) * W, y: (maxLat - lat) / (maxLat - minLat) * H });
  const polygon = (coords: number[][]) => coords.map(([lng, lat]) => { const p = project(lng, lat); return `${p.x},${p.y}`; }).join(' ');
  const areaCenter = (coords: number[][]) => { const valid = coords.filter(([lng, lat]) => finite(lng) && finite(lat)); if (!valid.length) return null; const lng = valid.reduce((sum, item) => sum + item[0], 0) / valid.length; const lat = valid.reduce((sum, item) => sum + item[1], 0) / valid.length; return project(lng, lat); };

  const filteredPoints = cleanPoints.filter((p) => layers.includes(historicalMapLayerForType(p.type)) && statuses.includes(p.epistemicStatus ?? 'attested'));
  const projected = filteredPoints.filter((p) => p.lng >= minLng && p.lng <= maxLng && p.lat >= minLat && p.lat <= maxLat).map((p) => ({ ...p, ...project(p.lng, p.lat) }));
  const displayPoints = spreadCoincidentPoints(projected); const hiddenOutsidePreset = filteredPoints.length - projected.length;
  const visibleAreas = layers.includes('powers') ? areas.filter((area) => {
    const owner = cleanPoints.find((point) => point.id === area.entityId);
    return !owner || statuses.includes(owner.epistemicStatus ?? 'attested');
  }) : [];

  const selectedTarget = useMemo(() => {
    const point = cleanPoints.find((item) => item.id === selectedId);
    if (point) return project(point.lng, point.lat);
    const area = areas.find((item) => item.entityId === selectedId);
    return area ? areaCenter(area.coordinates) : null;
  }, [selectedId, presetId, points, areas]);

  useEffect(() => {
    if (!selectedTarget) return;
    const zoom = Math.max(camera.zoom, 1.65);
    setCamera({ zoom, x: W / 2 - selectedTarget.x * zoom, y: H / 2 - selectedTarget.y * zoom });
  }, [selectedId]);

  const resetCamera = () => setCamera({ zoom: 1, x: 0, y: 0 });
  const zoomBy = (factor: number) => setCamera((current) => {
    const zoom = clampZoom(current.zoom * factor);
    const cx = W / 2, cy = H / 2;
    const worldX = (cx - current.x) / current.zoom;
    const worldY = (cy - current.y) / current.zoom;
    return { zoom, x: cx - worldX * zoom, y: cy - worldY * zoom };
  });
  const handleWheel = (event: ReactWheelEvent<SVGSVGElement>) => { event.preventDefault(); zoomBy(event.deltaY < 0 ? 1.16 : .86); };
  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    const rect = svgRef.current?.getBoundingClientRect(); if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, cameraX: camera.x, cameraY: camera.y };
    setDragging(true);
  };
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = (event.clientX - dragRef.current.x) * W / rect.width;
    const dy = (event.clientY - dragRef.current.y) * H / rect.height;
    setCamera((current) => ({ ...current, x: dragRef.current!.cameraX + dx, y: dragRef.current!.cameraY + dy }));
  };
  const handlePointerUp = (event: ReactPointerEvent<SVGSVGElement>) => { dragRef.current = null; setDragging(false); try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {} };

  const labels = displayPoints.filter((point) => {
    const selected = point.selected || point.id === selectedId;
    if (selected) return true;
    if (camera.zoom >= 2.5) return point.active !== false;
    if (camera.zoom >= 1.7) return point.active !== false && (point.type === 'city' || point.type === 'region' || point.type === 'empire' || point.type === 'event');
    return point.active !== false && (point.type === 'city' || point.type === 'empire') && displayPoints.length <= 14;
  });
  const labelIds = new Set(labels.map((point) => point.id));

  return <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line bg-[#132630] px-4 py-2 text-[#e8dfd2]">
      <div><span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#c9bca9]">Carta storica · {mapPreset.label}</span><span className="ml-3 hidden text-[10px] text-[#9e9487] md:inline">Historical Map UX 1.0</span></div>
      <div className="flex items-center gap-3 text-[11px] text-[#c9bca9]"><span>{headerRight}</span><span className="font-mono">{Math.round(camera.zoom * 100)}%</span></div>
    </div>

    <div className="border-b border-papyrus-line bg-[#f3ecdf] px-4 py-3">
      <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
        <div className="flex flex-wrap items-center gap-2" aria-label="Livelli della carta">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#756957]">Cosa vuoi vedere?</span>
          {(Object.keys(layerMeta) as MapLayer[]).map((layer) => { const active = layers.includes(layer); const meta = layerMeta[layer]; return <button key={layer} type="button" aria-pressed={active} onClick={() => setLayers(nextSelection(layers, [layer]))} className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${active ? 'border-[#9b6a38] bg-[#9b6a38] text-white' : 'border-[#cdbfae] bg-transparent text-[#756957] hover:border-[#9b6a38]'}`}><span className="mr-1.5" aria-hidden="true">{meta.glyph}</span>{meta.label}</button>; })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Statuto storico">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#756957]">Statuto</span>
          {statusGroups.map((group) => { const active = group.statuses.every((status) => statuses.includes(status)); return <button key={group.label} type="button" title={group.description} aria-pressed={active} onClick={() => setStatuses(nextSelection(statuses, group.statuses))} className={`rounded-full border px-2.5 py-1.5 text-[9px] transition ${active ? 'border-[#756957] bg-white/70 text-[#4e4438]' : 'border-[#d6cab9] text-[#9a8f80]'}`}>{group.label}</button>; })}
        </div>
      </div>
    </div>

    <div className={`relative overflow-hidden bg-[#dfe7e8] ${heightClassName}`}>
      <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-lg border border-[#b7aa97] bg-[#f8f2e7]/95 shadow-sm" aria-label="Controlli mappa">
        <button type="button" onClick={() => zoomBy(1.28)} className="h-9 w-9 border-b border-[#d8cbbb] text-lg font-bold text-[#44382d] hover:bg-white" aria-label="Ingrandisci">+</button>
        <button type="button" onClick={() => zoomBy(.78)} className="h-9 w-9 border-b border-[#d8cbbb] text-lg font-bold text-[#44382d] hover:bg-white" aria-label="Riduci">−</button>
        <button type="button" onClick={resetCamera} className="h-9 w-9 text-[15px] text-[#44382d] hover:bg-white" aria-label="Mostra intera carta" title="Mostra intera carta">⌂</button>
      </div>
      <div className="absolute bottom-3 left-3 z-10 rounded-md border border-[#b7aa97] bg-[#f8f2e7]/90 px-2 py-1 text-[9px] text-[#756957] shadow-sm">Trascina per spostare · rotella/pinch per zoom</div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className={`block h-full w-full touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`} role="img" aria-label={`Mappa storica interattiva: ${mapPreset.label}`} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <defs><filter id={`shadow-${presetId}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.6" floodColor="#30271f" floodOpacity="0.2" /></filter></defs>
        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}>
          <image href={baseAssets[presetId]} x="0" y="0" width={W} height={H} preserveAspectRatio="none" />
          {mapPreset.waterLabels.map((label) => { const p = project(label.lng, label.lat); return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#647d84" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" letterSpacing="5" opacity={camera.zoom > 2.6 ? .35 : .7}>{label.label}</text>; })}
          {mapPreset.regionLabels.map((label) => { const p = project(label.lng, label.lat); const size = label.size === 'lg' ? 18 : label.size === 'md' ? 15 : 12; return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#756957" fontFamily="Georgia, serif" fontSize={size} fontWeight="600" letterSpacing={label.size === 'sm' ? 2.5 : 4.5} opacity={camera.zoom > 2.6 ? .32 : .72}>{label.label}</text>; })}

          {visibleAreas.map((area) => { const center = areaCenter(area.coordinates); const selected = area.entityId === selectedId; const owner = cleanPoints.find((point) => point.id === area.entityId); const dash = statusStroke(owner?.epistemicStatus) ?? '8 7'; return <g key={area.id} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} className={onSelect ? 'cursor-pointer focus:outline-none focus-visible:[filter:drop-shadow(0_0_5px_#a06c35)]' : ''} onPointerDown={(event) => event.stopPropagation()} onClick={() => onSelect?.(area.entityId)} onKeyDown={(event) => { if (onSelect && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onSelect(area.entityId); } }}><polygon points={polygon(area.coordinates)} fill={selected ? 'rgba(160,108,53,.24)' : 'rgba(155,106,56,.13)'} stroke={selected ? '#a06c35' : 'rgba(128,84,43,.76)'} strokeWidth={selected ? 3 : 2} strokeDasharray={dash}><title>{area.label}</title></polygon>{center && camera.zoom < 2.3 && <g pointerEvents="none"><rect x={center.x - 82} y={center.y - 15} width="164" height="30" rx="15" fill="#f5eddf" fillOpacity=".9" stroke="#8f673e" strokeOpacity=".55" /><text x={center.x} y={center.y + 4} textAnchor="middle" fill="#5b422c" fontFamily="Georgia, serif" fontSize="11" fontWeight="700">{area.label.replace(/ · .*/, '')}</text></g>}</g>; })}

          {displayPoints.map((point) => { const x = point.x + point.dx, y = point.y + point.dy; const selected = point.selected || point.id === selectedId; const style = markerStyle(point.type, selected); const layer = historicalMapLayerForType(point.type); const opacity = (point.active === false && !selected ? .28 : 1) * statusOpacity(point.epistemicStatus); const dash = statusStroke(point.epistemicStatus); const showLabel = labelIds.has(point.id); return <g key={point.id} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} opacity={opacity} className={onSelect ? 'cursor-pointer focus:outline-none focus-visible:[filter:drop-shadow(0_0_5px_#a06c35)]' : ''} onPointerDown={(event) => event.stopPropagation()} onClick={() => onSelect?.(point.id)} onKeyDown={(e) => { if (onSelect && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(point.id); } }} aria-label={point.label}>
            {point.groupSize > 1 && <line x1={point.x} y1={point.y} x2={x} y2={y} stroke="#7f6d59" strokeWidth="1" opacity=".32"><title>Separazione grafica di elementi con la stessa coordinata</title></line>}
            {selected && <circle cx={x} cy={y} r="19" fill="none" stroke="#a06c35" strokeWidth="3" opacity=".42"><title>Elemento selezionato</title></circle>}
            {layer === 'places' && point.type === 'region' ? <><circle cx={x} cy={y} r={selected ? 11 : 9} fill="#f7f1e7" fillOpacity=".78" stroke={style.fill} strokeWidth={selected ? 3 : 2} strokeDasharray={dash ?? '3 2'} /><circle cx={x} cy={y} r="2.8" fill={style.fill} /></> : null}
            {layer === 'places' && point.type !== 'region' ? <circle cx={x} cy={y} r={style.radius} fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} strokeDasharray={dash} filter={`url(#shadow-${presetId})`} /> : null}
            {layer === 'powers' ? <polygon points={hexPoints(x, y, style.radius)} fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} strokeDasharray={dash} filter={`url(#shadow-${presetId})`} /> : null}
            {layer === 'events' ? <rect x={x - style.radius * .72} y={y - style.radius * .72} width={style.radius * 1.44} height={style.radius * 1.44} rx="1.5" fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} strokeDasharray={dash} transform={`rotate(45 ${x} ${y})`} filter={`url(#shadow-${presetId})`} /> : null}
            {layer === 'texts' ? <><rect x={x - style.radius} y={y - style.radius} width={style.radius * 2} height={style.radius * 2} rx="2" fill="#f6eddf" stroke={style.fill} strokeWidth={selected ? 3 : 2} strokeDasharray={dash} filter={`url(#shadow-${presetId})`} /><circle cx={x} cy={y} r="3.2" fill={style.fill} /></> : null}
            {showLabel && <text x={x + 13} y={y - 12} fill={style.text} fontFamily="Georgia, serif" fontSize={selected ? 15 : 12} fontWeight={selected ? '700' : '600'} stroke="#f1e8d8" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{point.label}</text>}
            <title>{layerMeta[layer].label}: {point.label}{point.subtitle ? ` · ${point.subtitle}` : ''}{point.epistemicStatus ? ` · ${point.epistemicStatus}` : ''}</title>
          </g>; })}
        </g>
      </svg>
    </div>

    <div className="border-t border-papyrus-line bg-[#132630] px-4 py-2 text-[10px] leading-5 text-[#b9aa94]">{footer ?? 'Base geografica comune di Biblia Fontes.'}{hiddenOutsidePreset > 0 && <span className="ml-2">{hiddenOutsidePreset} elementi restano fuori dalla finestra geografica corrente.</span>}</div>

    <div className="border-t border-papyrus-line bg-[#f7f1e7] p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#9b6a38]">Come leggere questa carta</p><h4 className="mt-1 font-serif text-lg font-bold text-[#2f2924]">{contextTitle ? `La geografia di ${contextTitle}` : 'Che cosa stai vedendo'}</h4></div>
        <button type="button" onClick={() => setGuideOpen((open) => !open)} aria-expanded={guideOpen} className="rounded-full border border-[#cdbfae] px-3 py-1.5 text-[10px] font-semibold text-[#675947] hover:border-[#9b6a38]">{guideOpen ? 'Riduci guida' : 'Apri guida completa'}</button>
      </div>
      <p className="mt-2 max-w-4xl text-xs leading-5 text-[#756957]">{contextSummary ?? `La carta mette in relazione la geografia di ${mapPreset.label} con luoghi, poteri, eventi e processi testuali pertinenti alla scena selezionata.`}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-[#d8cbbb] bg-white/45 px-3 py-2 text-[10px] text-[#5f5548]" aria-label="Legenda essenziale">
        <span><strong>●</strong> città</span><span><strong>◉</strong> regione</span><span><strong>⬡</strong> potere</span><span><strong>◆</strong> evento</span><span><strong>▣</strong> testo/tradizione</span><span><strong>area</strong> territorio ricostruito</span><span><strong>○</strong> alone = selezione</span><span><strong>—</strong> linea = stessa coordinata</span>
      </div>
      {guideOpen && <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-[#d8cbbb] bg-white/35 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#756957]">Natura dell'entità</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{(Object.keys(layerMeta) as MapLayer[]).map((layer) => { const meta = layerMeta[layer]; return <div key={layer} className="text-[10px] leading-4 text-[#756957]"><strong className="text-[#2f2924]"><span className="mr-1" style={{ color: meta.color }}>{meta.glyph}</span>{meta.label}</strong><br />{meta.description}</div>; })}</div></div>
        <div className="rounded-lg border border-[#d8cbbb] bg-white/35 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#756957]">Statuto epistemico</p><p className="mt-1 text-[10px] leading-4 text-[#756957]">La forma dice <strong>che cosa</strong> è l'elemento; il bordo dice <strong>con quale statuto</strong> viene mostrato.</p><div className="mt-2 flex flex-wrap gap-2">{statusGroups.map((group) => <span key={group.label} className="rounded-full border border-[#d8cbbb] px-2 py-1 text-[9px] text-[#5f5548]">{group.label} · {group.description}</span>)}</div></div>
        <p className="lg:col-span-2 rounded-lg border border-[#d8cbbb] bg-white/45 px-3 py-2 text-xs leading-5 text-[#5f5548]"><strong>Regola di lettura:</strong> la posizione di un simbolo indica una coordinata o un contesto geografico; non significa che tutto ciò che appare sulla carta sia un luogo. Zoom e selezione fanno emergere progressivamente le etichette per evitare sovrapposizioni.</p>
      </div>}
    </div>
  </div>;
}
