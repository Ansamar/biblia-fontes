'use client';

import type { HistoricalEntity } from '../historical-explorer/types';

type HistoricalExplorerMapProps = {
  entities: HistoricalEntity[];
  selectedId?: string;
  year: number;
  onSelect: (id: string) => void;
};

const bounds = {
  minLng: 24,
  maxLng: 49,
  minLat: 22,
  maxLat: 39,
};

function project(lat: number, lng: number) {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
  return { x, y };
}

function activeAt(entity: HistoricalEntity, year: number) {
  const { start, end, precision } = entity.temporal;
  if (precision === 'unknown' || start === undefined) return true;
  const entityEnd = end ?? start;
  return start <= year && entityEnd >= year;
}

function markerLabel(entity: HistoricalEntity) {
  if (entity.type === 'empire') return 'potere';
  if (entity.type === 'region') return 'regione';
  if (entity.type === 'city') return 'città';
  if (entity.type === 'event') return 'evento';
  if (entity.type === 'redaction' || entity.type === 'text') return 'testo';
  return entity.type;
}

export default function HistoricalExplorerMap({ entities, selectedId, year, onSelect }: HistoricalExplorerMapProps) {
  const mapped = entities.filter((entity) => entity.spatial?.lat !== undefined && entity.spatial?.lng !== undefined);

  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card/70">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 border-b border-papyrus-line bg-paper-card/90 px-4 py-2 backdrop-blur-sm">
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">Carta schematica georeferenziata</span>
        <span className="text-[11px] text-ink-faint">ancoraggi rappresentativi, non confini ricostruiti</span>
      </div>

      <div className="absolute inset-0 top-9">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '12.5% 16.66%',
            color: 'var(--papyrus-line)',
          }}
        />

        <div aria-hidden="true" className="absolute left-[8%] top-[22%] font-serif text-xl italic text-ink-faint/35">Mediterraneo</div>
        <div aria-hidden="true" className="absolute left-[6%] bottom-[17%] font-serif text-base italic text-ink-faint/30">Egitto</div>
        <div aria-hidden="true" className="absolute left-[43%] top-[32%] font-serif text-base italic text-ink-faint/30">Levante</div>
        <div aria-hidden="true" className="absolute right-[8%] top-[34%] font-serif text-base italic text-ink-faint/30">Mesopotamia</div>

        {mapped.map((entity) => {
          const { x, y } = project(entity.spatial!.lat!, entity.spatial!.lng!);
          const selected = selectedId === entity.id;
          const active = activeAt(entity, year);
          return (
            <button
              key={entity.id}
              type="button"
              onClick={() => onSelect(entity.id)}
              aria-pressed={selected}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-left shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze ${
                selected
                  ? 'border-bronze bg-bronze text-white shadow-lg'
                  : active
                    ? 'border-bronze/45 bg-paper-card text-ink hover:border-bronze'
                    : 'border-papyrus-line bg-paper-card/80 text-ink-faint opacity-45 hover:opacity-100'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className={`block font-mono text-[8px] uppercase tracking-wider ${selected ? 'text-white/70' : 'text-bronze'}`}>{markerLabel(entity)}</span>
              <span className="mt-0.5 block whitespace-nowrap font-serif text-sm font-bold">{entity.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
