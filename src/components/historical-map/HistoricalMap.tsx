'use client';

import { useState, type ReactNode } from 'react';
import { historicalMapPresets, inferHistoricalMapPreset, type HistoricalMapPresetId } from './mapPresets';

export type HistoricalMapPoint = { id: string; label: string; type: string; lat: number; lng: number; active?: boolean; selected?: boolean; subtitle?: string };
export type HistoricalMapArea = { id: string; entityId: string; label: string; coordinates: number[][] };
type MapLayer = 'places' | 'powers' | 'events' | 'texts';
type HistoricalMapProps = { points: HistoricalMapPoint[]; areas?: HistoricalMapArea[]; selectedId?: string; onSelect?: (id: string) => void; preset?: HistoricalMapPresetId; heightClassName?: string; headerRight?: ReactNode; footer?: ReactNode; contextTitle?: string; contextSummary?: string };
type DisplayPoint = HistoricalMapPoint & { x: number; y: number; dx: number; dy: number; groupSize: number };

const W = 1200, H = 680;
const baseAssets: Record<HistoricalMapPresetId, string> = { 'near-east': '/maps/historical-near-east.svg', levant: '/maps/historical-levant.svg', 'eastern-mediterranean': '/maps/historical-eastern-mediterranean.svg' };
const layerMeta: Record<MapLayer, { label: string; description: string; color: string; glyph: string }> = {
  places: { label: 'Luoghi', description: 'città = punto; regioni = anello. Il simbolo indica il luogo stesso', color: '#2f2924', glyph: '●' },
  powers: { label: 'Popoli e poteri', description: 'aree campite quando disponibili; esagono quando il potere è solo georeferenziato', color: '#443222', glyph: '⬡' },
  events: { label: 'Eventi', description: 'rombo: indica il luogo in cui l’evento avviene o a cui viene collegato', color: '#7a3028', glyph: '◆' },
  texts: { label: 'Testi e tradizioni', description: 'quadrato: indica un contesto di formazione, redazione o trasmissione', color: '#9b6a38', glyph: '▣' },
};

function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function pointLayer(type: string): MapLayer { if (type === 'city' || type === 'region') return 'places'; if (type === 'empire' || type === 'people' || type === 'person') return 'powers'; if (type === 'event') return 'events'; return 'texts'; }
function markerStyle(type: string, selected: boolean) {
  if (selected) return { fill: '#a06c35', stroke: '#f8f1e5', radius: 11, text: '#2c241d' };
  const layer = pointLayer(type); const fill = layerMeta[layer].color;
  return { fill, stroke: '#f8f1e5', radius: layer === 'places' ? 7 : layer === 'powers' ? 10 : 8, text: fill };
}
function spreadCoincidentPoints(points: Array<HistoricalMapPoint & { x: number; y: number }>): DisplayPoint[] {
  const groups = new Map<string, Array<HistoricalMapPoint & { x: number; y: number }>>();
  points.forEach((point) => { const key = `${point.lat.toFixed(3)}:${point.lng.toFixed(3)}`; groups.set(key, [...(groups.get(key) ?? []), point]); });
  return Array.from(groups.values()).flatMap((group) => group.length === 1 ? [{ ...group[0], dx: 0, dy: 0, groupSize: 1 }] : group.map((point, index) => { const radius = group.length <= 3 ? 15 : group.length <= 6 ? 21 : 27; const angle = -Math.PI / 2 + Math.PI * 2 * index / group.length; return { ...point, dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius, groupSize: group.length }; }));
}
function hexPoints(x: number, y: number, r: number) { return Array.from({ length: 6 }, (_, index) => { const angle = Math.PI / 6 + index * Math.PI / 3; return `${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`; }).join(' '); }

export default function HistoricalMap({ points, areas = [], selectedId, onSelect, preset, heightClassName = 'h-[430px] md:h-[520px]', headerRight, footer, contextTitle, contextSummary }: HistoricalMapProps) {
  const [layers, setLayers] = useState<MapLayer[]>(['places', 'powers', 'events', 'texts']);
  const cleanPoints = points.filter((p) => finite(p.lat) && finite(p.lng));
  const presetId = preset ?? inferHistoricalMapPreset(cleanPoints); const mapPreset = historicalMapPresets[presetId];
  const { minLat, maxLat, minLng, maxLng } = mapPreset.bounds;
  const project = (lng: number, lat: number) => ({ x: (lng - minLng) / (maxLng - minLng) * W, y: (maxLat - lat) / (maxLat - minLat) * H });
  const polygon = (coords: number[][]) => coords.map(([lng, lat]) => { const p = project(lng, lat); return `${p.x},${p.y}`; }).join(' ');
  const areaCenter = (coords: number[][]) => { const valid = coords.filter(([lng, lat]) => finite(lng) && finite(lat)); if (!valid.length) return null; const lng = valid.reduce((sum, item) => sum + item[0], 0) / valid.length; const lat = valid.reduce((sum, item) => sum + item[1], 0) / valid.length; return project(lng, lat); };
  const layerPoints = cleanPoints.filter((p) => layers.includes(pointLayer(p.type)));
  const projected = layerPoints.filter((p) => p.lng >= minLng && p.lng <= maxLng && p.lat >= minLat && p.lat <= maxLat).map((p) => ({ ...p, ...project(p.lng, p.lat) }));
  const displayPoints = spreadCoincidentPoints(projected); const hiddenOutsidePreset = layerPoints.length - projected.length;
  const toggle = (layer: MapLayer) => setLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);

  return <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line bg-[#132630] px-4 py-2 text-[#e8dfd2]">
      <div><span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#c9bca9]">Carta storica · {mapPreset.label}</span><span className="ml-3 hidden text-[10px] text-[#9e9487] md:inline">geografia reale · livelli interpretativi sovrapponibili</span></div>
      <div className="text-[11px] text-[#c9bca9]">{headerRight}</div>
    </div>

    <div className="border-b border-papyrus-line bg-[#f3ecdf] px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#756957]">Sovrapponi</span>
        {(Object.keys(layerMeta) as MapLayer[]).map((layer) => { const active = layers.includes(layer); const meta = layerMeta[layer]; return <button key={layer} type="button" aria-pressed={active} onClick={() => toggle(layer)} className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${active ? 'border-[#9b6a38] bg-[#9b6a38] text-white' : 'border-[#cdbfae] bg-transparent text-[#756957] hover:border-[#9b6a38]'}`}><span className="mr-1.5" aria-hidden="true">{meta.glyph}</span>{meta.label}</button>; })}
      </div>
    </div>

    <div className={`relative overflow-hidden bg-[#dfe7e8] ${heightClassName}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" role="img" aria-label={`Mappa storica: ${mapPreset.label}`}>
        <defs><filter id={`shadow-${presetId}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.6" floodColor="#30271f" floodOpacity="0.2" /></filter></defs>
        <image href={baseAssets[presetId]} x="0" y="0" width={W} height={H} preserveAspectRatio="none" />
        {mapPreset.waterLabels.map((label) => { const p = project(label.lng, label.lat); return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#647d84" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" letterSpacing="5" opacity=".7">{label.label}</text>; })}
        {mapPreset.regionLabels.map((label) => { const p = project(label.lng, label.lat); const size = label.size === 'lg' ? 18 : label.size === 'md' ? 15 : 12; return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#756957" fontFamily="Georgia, serif" fontSize={size} fontWeight="600" letterSpacing={label.size === 'sm' ? 2.5 : 4.5} opacity=".76">{label.label}</text>; })}

        {layers.includes('powers') && areas.map((area) => { const center = areaCenter(area.coordinates); const selected = area.entityId === selectedId; return <g key={area.id} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} className={onSelect ? 'cursor-pointer outline-none' : ''} onClick={() => onSelect?.(area.entityId)} onKeyDown={(event) => { if (onSelect && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onSelect(area.entityId); } }}><polygon points={polygon(area.coordinates)} fill={selected ? 'rgba(160,108,53,.22)' : 'rgba(155,106,56,.13)'} stroke={selected ? '#a06c35' : 'rgba(128,84,43,.76)'} strokeWidth={selected ? 3 : 2} strokeDasharray="8 7"><title>{area.label}</title></polygon>{center && <g pointerEvents="none"><rect x={center.x - 82} y={center.y - 15} width="164" height="30" rx="15" fill="#f5eddf" fillOpacity=".9" stroke="#8f673e" strokeOpacity=".55" /><text x={center.x} y={center.y + 4} textAnchor="middle" fill="#5b422c" fontFamily="Georgia, serif" fontSize="11" fontWeight="700">{area.label.replace(/ · .*/, '')}</text></g>}</g>; })}

        {displayPoints.map((point, index) => { const x = point.x + point.dx, y = point.y + point.dy; const selected = point.selected || point.id === selectedId; const style = markerStyle(point.type, selected); const layer = pointLayer(point.type); const opacity = point.active === false && !selected ? .28 : 1; const showLabel = selected || (displayPoints.length <= 18 && point.active !== false) || (point.type === 'city' && index % 2 === 0); return <g key={point.id} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} opacity={opacity} className={onSelect ? 'cursor-pointer outline-none' : ''} onClick={() => onSelect?.(point.id)} onKeyDown={(e) => { if (onSelect && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(point.id); } }} aria-label={point.label}>
          {point.groupSize > 1 && <line x1={point.x} y1={point.y} x2={x} y2={y} stroke="#7f6d59" strokeWidth="1" opacity=".32" />}
          {selected && <circle cx={x} cy={y} r="19" fill="none" stroke="#a06c35" strokeWidth="3" opacity=".36" />}
          {layer === 'places' && point.type === 'region' ? <><circle cx={x} cy={y} r={selected ? 11 : 9} fill="#f7f1e7" fillOpacity=".78" stroke={style.fill} strokeWidth={selected ? 3 : 2} strokeDasharray="3 2" /><circle cx={x} cy={y} r="2.8" fill={style.fill} /></> : null}
          {layer === 'places' && point.type !== 'region' ? <circle cx={x} cy={y} r={style.radius} fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} filter={`url(#shadow-${presetId})`} /> : null}
          {layer === 'powers' ? <polygon points={hexPoints(x, y, style.radius)} fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} filter={`url(#shadow-${presetId})`} /> : null}
          {layer === 'events' ? <rect x={x - style.radius * .72} y={y - style.radius * .72} width={style.radius * 1.44} height={style.radius * 1.44} rx="1.5" fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} transform={`rotate(45 ${x} ${y})`} filter={`url(#shadow-${presetId})`} /> : null}
          {layer === 'texts' ? <><rect x={x - style.radius} y={y - style.radius} width={style.radius * 2} height={style.radius * 2} rx="2" fill="#f6eddf" stroke={style.fill} strokeWidth={selected ? 3 : 2} filter={`url(#shadow-${presetId})`} /><circle cx={x} cy={y} r="3.2" fill={style.fill} /></> : null}
          {showLabel && <text x={x + 13} y={y - 12} fill={style.text} fontFamily="Georgia, serif" fontSize={selected ? 15 : 12} fontWeight={selected ? '700' : '600'} stroke="#f1e8d8" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{point.label}</text>}
          <title>{layerMeta[layer].label}: {point.label}{point.subtitle ? ` · ${point.subtitle}` : ''}</title>
        </g>; })}
      </svg>
    </div>

    <div className="border-t border-papyrus-line bg-[#132630] px-4 py-2 text-[10px] leading-5 text-[#b9aa94]">{footer ?? 'Base geografica comune di Biblia Fontes.'}{hiddenOutsidePreset > 0 && <span className="ml-2">{hiddenOutsidePreset} elementi restano fuori dalla finestra geografica corrente.</span>}</div>

    <div className="border-t border-papyrus-line bg-[#f7f1e7] p-4 md:p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#9b6a38]">Come leggere questa carta</p>
      <h4 className="mt-1 font-serif text-lg font-bold text-[#2f2924]">{contextTitle ? `La geografia di ${contextTitle}` : 'Che cosa stai vedendo'}</h4>
      <p className="mt-2 max-w-4xl text-xs leading-5 text-[#756957]">{contextSummary ?? `Questa carta mette in relazione la geografia di ${mapPreset.label} con le entità storiche e testuali attive nel periodo selezionato. Accendi o spegni i livelli per leggere separatamente territorio, poteri, eventi e processi testuali.`}</p>
      <p className="mt-2 rounded-lg border border-[#d8cbbb] bg-white/45 px-3 py-2 text-xs leading-5 text-[#5f5548]"><strong>Regola di lettura:</strong> la posizione di un simbolo indica sempre una coordinata o un contesto geografico; <strong>non significa che tutto ciò che appare sulla carta sia un luogo.</strong> Una città è un punto; un potere può occupare un’area; un evento è localizzato; un testo è associato a un contesto.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{(Object.keys(layerMeta) as MapLayer[]).map((layer) => { const meta = layerMeta[layer]; return <div key={layer} className={`rounded-lg border px-3 py-2 ${layers.includes(layer) ? 'border-[#cdbfae] bg-white/55' : 'border-[#ddd4c8] opacity-45'}`}><div className="flex items-center gap-2 text-xs font-bold text-[#2f2924]"><span style={{ color: meta.color }} aria-hidden="true">{meta.glyph}</span>{meta.label}</div><p className="mt-1 text-[10px] leading-4 text-[#756957]">{meta.description}</p></div>; })}</div>
    </div>
  </div>;
}
