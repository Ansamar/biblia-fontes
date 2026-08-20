'use client';

import type { HistoricalArea, HistoricalEntity } from '../historical-explorer/types';
import HistoricalProvenance from './HistoricalProvenance';

type HistoricalExplorerMapProps = {
  entities: HistoricalEntity[];
  areas?: HistoricalArea[];
  selectedId?: string;
  year: number;
  onSelect: (id: string) => void;
};

type Point = {
  id: string;
  label: string;
  type: HistoricalEntity['type'];
  lat: number;
  lng: number;
  active: boolean;
  selected: boolean;
};

const WIDTH = 1000;
const HEIGHT = 530;
const PAD_X = 72;
const PAD_Y = 48;

function activeAt(entity: HistoricalEntity, year: number) {
  const { start, end, precision } = entity.temporal;
  if (precision === 'unknown' || start === undefined) return true;
  return start <= year && (end ?? start) >= year;
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function markerLabel(entity: HistoricalEntity) {
  if (entity.type === 'empire') return 'potere';
  if (entity.type === 'region') return 'regione';
  if (entity.type === 'city') return 'città';
  if (entity.type === 'event') return 'evento';
  if (entity.type === 'redaction' || entity.type === 'text') return 'testo';
  if (entity.type === 'witness') return 'testimone';
  return entity.type;
}

function markerAppearance(type: HistoricalEntity['type'], selected: boolean) {
  if (selected) return { fill: '#9b6a38', stroke: '#6e4b29', text: '#30271f', radius: 10 };
  if (type === 'event') return { fill: '#703026', stroke: '#4f211b', text: '#5b2821', radius: 8 };
  if (type === 'city') return { fill: '#30271f', stroke: '#30271f', text: '#30271f', radius: 7 };
  if (type === 'empire') return { fill: '#443222', stroke: '#30271f', text: '#443222', radius: 9 };
  if (type === 'region') return { fill: '#9b6a38', stroke: '#6e4b29', text: '#6e4b29', radius: 8 };
  if (type === 'redaction' || type === 'text') return { fill: '#9b6a38', stroke: '#6e4b29', text: '#6e4b29', radius: 8 };
  return { fill: '#6e4b29', stroke: '#443222', text: '#443222', radius: 8 };
}

export default function HistoricalExplorerMap({ entities, areas = [], selectedId, year, onSelect }: HistoricalExplorerMapProps) {
  const points: Point[] = entities.flatMap((entity) => {
    const lat = entity.spatial?.lat;
    const lng = entity.spatial?.lng;
    if (!finite(lat) || !finite(lng)) return [];
    return [{
      id: entity.id,
      label: entity.label,
      type: entity.type,
      lat,
      lng,
      active: activeAt(entity, year),
      selected: entity.id === selectedId,
    }];
  });

  const activeAreaRecords = areas.filter((area) => area.temporal.start <= year && area.temporal.end >= year);
  const areaCoordinates = activeAreaRecords.flatMap((area) => area.geometry.coordinates.flatMap((ring) => ring));
  const lngValues = [
    ...points.map((point) => point.lng),
    ...areaCoordinates.map(([lng]) => lng).filter(finite),
  ];
  const latValues = [
    ...points.map((point) => point.lat),
    ...areaCoordinates.map(([, lat]) => lat).filter(finite),
  ];

  const minLng = lngValues.length ? Math.min(...lngValues) : 25;
  const maxLng = lngValues.length ? Math.max(...lngValues) : 52;
  const minLat = latValues.length ? Math.min(...latValues) : 22;
  const maxLat = latValues.length ? Math.max(...latValues) : 40;
  const lngSpan = Math.max(1, maxLng - minLng);
  const latSpan = Math.max(1, maxLat - minLat);

  function project(lng: number, lat: number) {
    const x = PAD_X + ((lng - minLng) / lngSpan) * (WIDTH - PAD_X * 2);
    const y = HEIGHT - PAD_Y - ((lat - minLat) / latSpan) * (HEIGHT - PAD_Y * 2);
    return { x, y };
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line bg-paper-card/95 px-4 py-2">
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">Mappa storica · coordinate geografiche</span>
        <span className="text-[11px] text-ink-faint">proiezione schematica · nessuna dipendenza cartografica esterna</span>
      </div>

      <div className="relative h-[430px] bg-[#eee5d4] md:h-[500px]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-full w-full"
          role="img"
          aria-label="Mappa storica delle entità georeferenziate"
        >
          <defs>
            <pattern id="historical-map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(80,63,47,.08)" strokeWidth="1" />
            </pattern>
            <filter id="historical-map-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#30271f" floodOpacity="0.18" />
            </filter>
          </defs>

          <rect width={WIDTH} height={HEIGHT} fill="#eee5d4" />
          <rect width={WIDTH} height={HEIGHT} fill="url(#historical-map-grid)" />

          <path d="M55 380 C145 305 215 320 285 250 C350 184 420 176 486 192 C552 208 620 168 688 172 C774 178 835 235 942 238" fill="none" stroke="rgba(155,106,56,.18)" strokeWidth="76" strokeLinecap="round" />
          <path d="M84 390 C175 314 232 324 302 258 C374 190 432 190 498 202 C570 214 622 184 694 188 C778 194 844 246 928 250" fill="none" stroke="rgba(250,247,240,.55)" strokeWidth="34" strokeLinecap="round" />

          {activeAreaRecords.map((area) => {
            const ring = area.geometry.coordinates[0] ?? [];
            const polygonPoints = ring
              .filter(([lng, lat]) => finite(lng) && finite(lat))
              .map(([lng, lat]) => {
                const point = project(lng, lat);
                return `${point.x},${point.y}`;
              })
              .join(' ');

            if (!polygonPoints) return null;
            return (
              <polygon
                key={area.id}
                points={polygonPoints}
                fill="rgba(155,106,56,.14)"
                stroke="rgba(155,106,56,.72)"
                strokeWidth="2"
                strokeDasharray="8 6"
                className="cursor-pointer transition-opacity hover:opacity-75"
                onClick={() => onSelect(area.entityId)}
              >
                <title>{area.label}</title>
              </polygon>
            );
          })}

          {points.map((point, index) => {
            const { x, y } = project(point.lng, point.lat);
            const appearance = markerAppearance(point.type, point.selected);
            const labelAbove = index % 2 === 0;
            const labelY = labelAbove ? y - 16 : y + 25;
            const opacity = point.active || point.selected ? 1 : 0.35;

            return (
              <g
                key={point.id}
                role="button"
                tabIndex={0}
                aria-label={`${point.label} · ${markerLabel(entities.find((entity) => entity.id === point.id) ?? entities[0])}`}
                className="cursor-pointer outline-none"
                opacity={opacity}
                onClick={() => onSelect(point.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(point.id);
                  }
                }}
              >
                {point.selected ? <circle cx={x} cy={y} r={18} fill="none" stroke="#9b6a38" strokeWidth="3" opacity=".32" /> : null}
                <circle
                  cx={x}
                  cy={y}
                  r={appearance.radius}
                  fill={appearance.fill}
                  stroke={appearance.stroke}
                  strokeWidth={point.selected ? 3 : 2}
                  filter="url(#historical-map-shadow)"
                />
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily="Georgia, serif"
                  fontWeight={point.selected ? 700 : 600}
                  fill={appearance.text}
                  stroke="#eee5d4"
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  {point.label}
                </text>
                <title>{point.label}</title>
              </g>
            );
          })}
        </svg>

        {points.length === 0 ? (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <strong className="font-serif text-lg text-ink">Nessuna coordinata disponibile</strong>
              <p className="mt-2 max-w-md text-sm leading-6 text-ink-faint">Per questo insieme di dati non risultano entità georeferenziate.</p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-xl border border-papyrus-line bg-paper-card/92 px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="font-mono text-[8px] uppercase tracking-wider text-ink-faint">Legenda</p>
          <div className="mt-1.5 grid gap-1 text-[10px] text-ink-soft">
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#443222]" />potere / impero</span>
            <span><i className="mr-2 inline-block h-2 w-2 rounded-[2px] bg-[#30271f]" />città storica</span>
            <span><i className="mr-2 inline-block h-2 w-2 rotate-45 bg-[#703026]" />evento puntuale</span>
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#9b6a38]" />regione / testo / relazione</span>
            {areas.length > 0 && <span><i className="mr-2 inline-block h-3 w-5 border border-dashed border-[#9b6a38]/70 bg-[#9b6a38]/15" />area storica · cliccabile</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-papyrus-line bg-papyrus/25 px-4 py-2 text-[10px] leading-5 text-ink-faint">
        <span>{areas.length > 0 ? 'Le aree tratteggiate sono ricostruzioni didattiche approssimate: servono a mostrare il mutamento geo-temporale, non frontiere storiche certe.' : 'Questo dataset non espone geometrie territoriali: la mappa mostra soltanto entità georeferenziate.'}</span>
        <span>Coordinate del dataset Biblia Fontes · rappresentazione schematica</span>
      </div>

      {activeAreaRecords.length > 0 ? (
        <details className="border-t border-papyrus-line bg-paper-card px-4 py-3">
          <summary className="cursor-pointer text-xs font-semibold text-ink-soft hover:text-bronze">Provenienza delle geometrie attive ({activeAreaRecords.length})</summary>
          <div className="mt-3 space-y-4">
            {activeAreaRecords.map((area) => (
              <div key={area.id} className="rounded-xl border border-papyrus-line bg-papyrus/20 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <strong className="font-serif text-base text-ink">{area.label}</strong>
                    <p className="mt-1 text-xs leading-5 text-ink-faint">{area.note}</p>
                  </div>
                  <span className="rounded-full border border-papyrus-line px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-ink-faint">{area.confidence}</span>
                </div>
                <div className="mt-3"><HistoricalProvenance sources={area.sources} compact /></div>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
