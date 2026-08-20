'use client';

import type React from 'react';
import { historicalMapPresets, inferHistoricalMapPreset, type HistoricalMapPresetId } from './mapPresets';

export type HistoricalMapPoint = {
  id: string;
  label: string;
  type: string;
  lat: number;
  lng: number;
  active?: boolean;
  selected?: boolean;
  subtitle?: string;
};

export type HistoricalMapArea = {
  id: string;
  entityId: string;
  label: string;
  coordinates: number[][];
};

type HistoricalMapProps = {
  points: HistoricalMapPoint[];
  areas?: HistoricalMapArea[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  preset?: HistoricalMapPresetId;
  heightClassName?: string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
};

type DisplayPoint = HistoricalMapPoint & { x: number; y: number; dx: number; dy: number; groupSize: number };

const W = 1200;
const H = 680;

const baseAssets: Record<HistoricalMapPresetId, string> = {
  'near-east': '/maps/historical-near-east.svg',
  levant: '/maps/historical-levant.svg',
  'eastern-mediterranean': '/maps/historical-eastern-mediterranean.svg',
};

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function markerStyle(type: string, selected: boolean) {
  if (selected) return { fill: '#a06c35', stroke: '#f8f1e5', radius: 11, text: '#2c241d' };
  if (type === 'event') return { fill: '#7a3028', stroke: '#f8f1e5', radius: 8, text: '#5f251f' };
  if (type === 'empire' || type === 'people') return { fill: '#443222', stroke: '#f8f1e5', radius: 9, text: '#443222' };
  if (type === 'city') return { fill: '#2f2924', stroke: '#f8f1e5', radius: 7, text: '#2f2924' };
  if (type === 'text' || type === 'redaction' || type === 'witness') return { fill: '#9b6a38', stroke: '#f8f1e5', radius: 8, text: '#6e4b29' };
  return { fill: '#8f673e', stroke: '#f8f1e5', radius: 8, text: '#6e4b29' };
}

function spreadCoincidentPoints(points: Array<HistoricalMapPoint & { x: number; y: number }>): DisplayPoint[] {
  const groups = new Map<string, Array<HistoricalMapPoint & { x: number; y: number }>>();
  points.forEach((point) => {
    const key = `${point.lat.toFixed(3)}:${point.lng.toFixed(3)}`;
    const group = groups.get(key) ?? [];
    group.push(point);
    groups.set(key, group);
  });

  return Array.from(groups.values()).flatMap((group) => {
    if (group.length === 1) return [{ ...group[0], dx: 0, dy: 0, groupSize: 1 }];
    const radius = group.length <= 3 ? 13 : group.length <= 6 ? 18 : 23;
    return group.map((point, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / group.length;
      return {
        ...point,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius,
        groupSize: group.length,
      };
    });
  });
}

export default function HistoricalMap({
  points,
  areas = [],
  selectedId,
  onSelect,
  preset,
  heightClassName = 'h-[430px] md:h-[520px]',
  headerRight,
  footer,
}: HistoricalMapProps) {
  const cleanPoints = points.filter((point) => finite(point.lat) && finite(point.lng));
  const presetId = preset ?? inferHistoricalMapPreset(cleanPoints);
  const mapPreset = historicalMapPresets[presetId];
  const { minLat, maxLat, minLng, maxLng } = mapPreset.bounds;

  const project = (lng: number, lat: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * W,
    y: ((maxLat - lat) / (maxLat - minLat)) * H,
  });

  const polygon = (coords: number[][]) => coords.map(([lng, lat]) => {
    const point = project(lng, lat);
    return `${point.x},${point.y}`;
  }).join(' ');

  const projected = cleanPoints
    .filter((point) => point.lng >= minLng && point.lng <= maxLng && point.lat >= minLat && point.lat <= maxLat)
    .map((point) => ({ ...point, ...project(point.lng, point.lat) }));
  const displayPoints = spreadCoincidentPoints(projected);
  const hiddenOutsidePreset = cleanPoints.length - projected.length;
  const coincidentCount = displayPoints.filter((point) => point.groupSize > 1).length;

  return <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line bg-[#132630] px-4 py-2 text-[#e8dfd2]">
      <div>
        <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#c9bca9]">Carta storica · {mapPreset.label}</span>
        <span className="ml-3 hidden text-[10px] text-[#9e9487] md:inline">coste e idrografia reali · nessun confine moderno</span>
      </div>
      <div className="text-[11px] text-[#c9bca9]">{headerRight}</div>
    </div>

    <div className={`relative overflow-hidden bg-[#dfe7e8] ${heightClassName}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" role="img" aria-label={`Mappa storica: ${mapPreset.label}`}>
        <defs>
          <filter id={`shadow-${presetId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.6" floodColor="#30271f" floodOpacity="0.2" />
          </filter>
        </defs>

        <image href={baseAssets[presetId]} x="0" y="0" width={W} height={H} preserveAspectRatio="none" />

        {mapPreset.waterLabels.map((label) => {
          const p = project(label.lng, label.lat);
          return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#647d84" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" letterSpacing="5" opacity=".7">{label.label}</text>;
        })}
        {mapPreset.regionLabels.map((label) => {
          const p = project(label.lng, label.lat);
          const size = label.size === 'lg' ? 18 : label.size === 'md' ? 15 : 12;
          return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#756957" fontFamily="Georgia, serif" fontSize={size} fontWeight="600" letterSpacing={label.size === 'sm' ? 2.5 : 4.5} opacity=".76">{label.label}</text>;
        })}

        {areas.map((area) => {
          const inside = area.coordinates.filter(([lng, lat]) => lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat);
          if (inside.length < 3) return null;
          return <polygon
            key={area.id}
            points={polygon(area.coordinates)}
            fill="rgba(155,106,56,.12)"
            stroke="rgba(128,84,43,.76)"
            strokeWidth="2"
            strokeDasharray="8 7"
            className={onSelect ? 'cursor-pointer' : ''}
            onClick={() => onSelect?.(area.entityId)}
          ><title>{area.label}</title></polygon>;
        })}

        {displayPoints.map((point, index) => {
          const x = point.x + point.dx;
          const y = point.y + point.dy;
          const selected = point.selected || point.id === selectedId;
          const style = markerStyle(point.type, selected);
          const opacity = point.active === false && !selected ? .28 : 1;
          const showLabel = selected || (displayPoints.length <= 18 && point.active !== false) || (point.type === 'city' && index % 2 === 0);
          return <g
            key={point.id}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            opacity={opacity}
            className={onSelect ? 'cursor-pointer outline-none' : ''}
            onClick={() => onSelect?.(point.id)}
            onKeyDown={(event) => {
              if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onSelect(point.id);
              }
            }}
            aria-label={point.label}
          >
            {point.groupSize > 1 ? <line x1={point.x} y1={point.y} x2={x} y2={y} stroke="#7f6d59" strokeWidth="1" opacity=".32" /> : null}
            {selected ? <circle cx={x} cy={y} r="18" fill="none" stroke="#a06c35" strokeWidth="3" opacity=".34" /> : null}
            <circle cx={x} cy={y} r={style.radius} fill={style.fill} stroke={style.stroke} strokeWidth={selected ? 3 : 2} filter={`url(#shadow-${presetId})`} />
            {showLabel ? <text x={x + 12} y={y - 11} textAnchor="start" fill={style.text} fontFamily="Georgia, serif" fontSize={selected ? 15 : 12} fontWeight={selected ? '700' : '600'} stroke="#f1e8d8" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{point.label}</text> : null}
            <title>{point.label}{point.subtitle ? ` · ${point.subtitle}` : ''}</title>
          </g>;
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-[#4c5d62]/30 bg-[#132630]/94 px-3 py-2 text-[#dfd5c7] shadow-sm backdrop-blur-sm">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#b9aa94]">Legenda</p>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px]"><span>● città</span><span>● poteri/popoli</span><span>● eventi</span><span>● testi/relazioni</span></div>
      </div>
    </div>

    <div className="border-t border-papyrus-line bg-[#132630] px-4 py-2 text-[10px] leading-5 text-[#b9aa94]">
      {footer ?? 'Base geografica comune di Biblia Fontes. Le coordinate derivano dai dataset; aree e confini storici restano ricostruzioni didattiche quando indicato.'}
      {coincidentCount > 0 ? <span className="ml-2">I punti con coordinate coincidenti sono leggermente separati graficamente.</span> : null}
      {hiddenOutsidePreset > 0 ? <span className="ml-2">{hiddenOutsidePreset} elementi restano fuori dalla finestra geografica corrente.</span> : null}
    </div>
  </div>;
}
