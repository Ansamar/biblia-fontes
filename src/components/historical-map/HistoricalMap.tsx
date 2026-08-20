'use client';

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

const W = 1200;
const H = 680;
const PAD = 24;

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

function baseGeometry(presetId: HistoricalMapPresetId) {
  if (presetId === 'levant') {
    return {
      land: [
        [[29,27],[29,37],[34.45,37],[34.6,35.6],[34.85,34.8],[34.95,33.8],[34.9,32.8],[34.7,31.8],[34.55,30.8],[34.2,29.8],[33.3,28.5],[32.5,27],[29,27]],
        [[35.0,27],[40.5,27],[40.5,37],[35.9,37],[35.7,35.7],[35.5,34.8],[35.55,33.9],[35.5,32.8],[35.55,31.8],[35.5,30.7],[35.2,29.6],[35.0,27]],
      ],
      rivers: [
        [[35.55,33.25],[35.58,32.9],[35.58,32.55],[35.55,32.2],[35.53,31.85],[35.55,31.45],[35.53,31.1]],
        [[31.25,30.2],[31.1,29.9],[30.9,29.55],[30.7,29.1],[30.65,28.7],[30.55,28.2]],
      ],
      lakes: [
        {lng:35.6,lat:32.82,rx:0.08,ry:0.16},
        {lng:35.53,lat:31.15,rx:0.1,ry:0.35},
      ],
    };
  }

  if (presetId === 'eastern-mediterranean') {
    return {
      land: [
        [[10,43],[10,37.5],[12.2,36.5],[14.2,37.3],[15.6,39.3],[16.0,41.0],[14.9,43],[10,43]],
        [[19.2,43],[20.2,41.2],[21.0,40.1],[22.0,39.4],[23.0,38.2],[22.4,37.0],[21.4,36.4],[20.0,37.4],[19.1,39.0],[19.2,43]],
        [[26.0,43],[43,43],[43,34.0],[40.3,34.8],[38.0,35.6],[36.0,36.4],[34.8,36.1],[33.0,36.6],[31.0,36.0],[29.0,36.2],[27.0,37.2],[26.0,39.0],[26.0,43]],
        [[25.5,27],[43,27],[43,34.0],[40.0,33.9],[37.0,33.0],[34.0,31.0],[31.0,29.3],[28.0,28.2],[25.5,27]],
        [[10,27],[25.5,27],[23.8,29.0],[20.0,30.4],[16.0,31.2],[12.0,31.0],[10,30.2],[10,27]],
      ],
      rivers: [
        [[31.2,31.4],[31.0,30.7],[30.9,29.9],[30.8,29.2],[30.7,28.4]],
        [[35.55,33.3],[35.55,32.7],[35.55,32.0],[35.53,31.1]],
      ],
      lakes: [{lng:35.53,lat:31.15,rx:0.08,ry:0.28}],
    };
  }

  return {
    land: [
      [[24,42],[24,36],[27,34.5],[30.5,33.5],[33.0,32],[34.0,30],[33.5,27.5],[34,22],[24,22],[24,42]],
      [[27,42],[31,40.8],[34,39.8],[37,39.2],[40,39.5],[43,40.0],[46,41.0],[50,42],[27,42]],
      [[34,22],[58,22],[58,42],[50,42],[48,39],[46,37],[44,36],[42,35],[40,34],[38,33],[36,31],[35,28],[34,22]],
    ],
    rivers: [
      [[31.2,31.4],[31.0,30.6],[30.8,29.6],[30.6,28.5],[30.5,27.4],[30.4,26.0]],
      [[35.5,33.3],[35.5,32.7],[35.5,32.0],[35.53,31.1]],
      [[39.5,38.5],[40.3,37.4],[41.0,36.3],[41.8,35.4],[42.5,34.0],[43.2,32.8],[44.2,31.5],[46.0,30.5]],
      [[42.2,38.8],[43.0,37.8],[44.0,36.5],[45.0,35.2],[46.0,33.8],[47.0,32.3],[48.0,30.8]],
    ],
    lakes: [{lng:35.53,lat:31.15,rx:0.09,ry:0.32}],
  };
}

export default function HistoricalMap({ points, areas = [], selectedId, onSelect, preset, heightClassName = 'h-[430px] md:h-[520px]', headerRight, footer }: HistoricalMapProps) {
  const cleanPoints = points.filter((point) => finite(point.lat) && finite(point.lng));
  const presetId = preset ?? inferHistoricalMapPreset(cleanPoints);
  const mapPreset = historicalMapPresets[presetId];
  const geometry = baseGeometry(presetId);
  const { minLat, maxLat, minLng, maxLng } = mapPreset.bounds;

  const project = (lng: number, lat: number) => ({
    x: PAD + ((lng - minLng) / (maxLng - minLng)) * (W - PAD * 2),
    y: PAD + ((maxLat - lat) / (maxLat - minLat)) * (H - PAD * 2),
  });

  const polygon = (coords: number[][]) => coords.map(([lng, lat]) => {
    const point = project(lng, lat);
    return `${point.x},${point.y}`;
  }).join(' ');

  const line = (coords: number[][]) => coords.map(([lng, lat], index) => {
    const point = project(lng, lat);
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');

  return <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line bg-[#132630] px-4 py-2 text-[#e8dfd2]">
      <div>
        <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#c9bca9]">Carta storica · {mapPreset.label}</span>
        <span className="ml-3 hidden text-[10px] text-[#9e9487] md:inline">base geografica comune · coordinate reali</span>
      </div>
      <div className="text-[11px] text-[#c9bca9]">{headerRight}</div>
    </div>

    <div className={`relative overflow-hidden bg-[#dfe7e8] ${heightClassName}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" role="img" aria-label={`Mappa storica: ${mapPreset.label}`}>
        <defs>
          <linearGradient id={`sea-${presetId}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dce7e9"/><stop offset="1" stopColor="#c9d8dc"/></linearGradient>
          <filter id={`shadow-${presetId}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.6" floodColor="#30271f" floodOpacity="0.2"/></filter>
          <pattern id={`paper-${presetId}`} width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r="0.7" fill="#7d684f" opacity=".08"/><circle cx="19" cy="15" r="0.55" fill="#7d684f" opacity=".06"/></pattern>
        </defs>

        <rect width={W} height={H} fill={`url(#sea-${presetId})`} />
        {geometry.land.map((coords, index) => <polygon key={index} points={polygon(coords)} fill="#f1e8d8" stroke="#b9aa94" strokeWidth="1.5" />)}
        <rect width={W} height={H} fill={`url(#paper-${presetId})`} opacity=".55" pointerEvents="none" />

        {geometry.rivers.map((coords, index) => <path key={index} d={line(coords)} fill="none" stroke="#8fb0b7" strokeWidth="3" strokeLinecap="round" opacity=".9" />)}
        {geometry.lakes.map((lake, index) => { const p = project(lake.lng,lake.lat); const px = (lake.rx/(maxLng-minLng))*(W-PAD*2); const py=(lake.ry/(maxLat-minLat))*(H-PAD*2); return <ellipse key={index} cx={p.x} cy={p.y} rx={Math.max(3,px)} ry={Math.max(5,py)} fill="#9fbcc2" stroke="#7fa2aa" strokeWidth="1"/>; })}

        {mapPreset.waterLabels.map((label) => { const p=project(label.lng,label.lat); return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#647d84" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" letterSpacing="5" opacity=".72">{label.label}</text>; })}
        {mapPreset.regionLabels.map((label) => { const p=project(label.lng,label.lat); const size=label.size==='lg'?18:label.size==='md'?15:12; return <text key={label.label} x={p.x} y={p.y} textAnchor="middle" fill="#756957" fontFamily="Georgia, serif" fontSize={size} fontWeight="600" letterSpacing={label.size==='sm'?2.5:4.5} opacity=".82">{label.label}</text>; })}

        {areas.map((area) => {
          const visible = area.coordinates.filter(([lng,lat]) => lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat);
          if (visible.length < 3) return null;
          return <polygon key={area.id} points={polygon(area.coordinates)} fill="rgba(155,106,56,.12)" stroke="rgba(128,84,43,.72)" strokeWidth="2" strokeDasharray="8 7" className={onSelect?'cursor-pointer':''} onClick={()=>onSelect?.(area.entityId)}><title>{area.label}</title></polygon>;
        })}

        {cleanPoints.map((point, index) => {
          if (point.lng < minLng || point.lng > maxLng || point.lat < minLat || point.lat > maxLat) return null;
          const p = project(point.lng, point.lat);
          const selected = point.selected || point.id === selectedId;
          const style = markerStyle(point.type, selected);
          const opacity = point.active === false && !selected ? .28 : 1;
          const showLabel = selected || (cleanPoints.length <= 18 && point.active !== false) || point.type === 'city' && index % 2 === 0;
          return <g key={point.id} role={onSelect?'button':undefined} tabIndex={onSelect?0:undefined} opacity={opacity} className={onSelect?'cursor-pointer outline-none':''} onClick={()=>onSelect?.(point.id)} onKeyDown={(event)=>{if(onSelect&&(event.key==='Enter'||event.key===' ')){event.preventDefault();onSelect(point.id)}}} aria-label={point.label}>
            {selected ? <circle cx={p.x} cy={p.y} r="18" fill="none" stroke="#a06c35" strokeWidth="3" opacity=".34"/> : null}
            <circle cx={p.x} cy={p.y} r={style.radius} fill={style.fill} stroke={style.stroke} strokeWidth={selected?3:2} filter={`url(#shadow-${presetId})`}/>
            {showLabel ? <text x={p.x+12} y={p.y-11} textAnchor="start" fill={style.text} fontFamily="Georgia, serif" fontSize={selected?15:12} fontWeight={selected?'700':'600'} stroke="#f1e8d8" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{point.label}</text> : null}
            <title>{point.label}{point.subtitle ? ` · ${point.subtitle}` : ''}</title>
          </g>;
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-[#4c5d62]/30 bg-[#132630]/94 px-3 py-2 text-[#dfd5c7] shadow-sm backdrop-blur-sm">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#b9aa94]">Legenda</p>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px]"><span>● città</span><span>● poteri/popoli</span><span>● eventi</span><span>● testi/relazioni</span></div>
      </div>
    </div>

    <div className="border-t border-papyrus-line bg-[#132630] px-4 py-2 text-[10px] leading-5 text-[#b9aa94]">{footer ?? 'Base geografica editoriale comune di Biblia Fontes. Le coordinate dei marker derivano dai dataset; aree e confini storici restano ricostruzioni didattiche quando indicato.'}</div>
  </div>;
}
