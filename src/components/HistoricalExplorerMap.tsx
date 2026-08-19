'use client';

import { useEffect, useRef, useState } from 'react';
import type { HistoricalArea, HistoricalEntity } from '../historical-explorer/types';
import HistoricalProvenance from './HistoricalProvenance';

type HistoricalExplorerMapProps = {
  entities: HistoricalEntity[];
  areas?: HistoricalArea[];
  selectedId?: string;
  year: number;
  onSelect: (id: string) => void;
};

type GeoJsonSource = {
  setData: (data: unknown) => void;
};

type MapInstance = {
  addControl: (control: unknown, position?: string) => void;
  fitBounds: (bounds: unknown, options?: Record<string, unknown>) => void;
  flyTo: (options: Record<string, unknown>) => void;
  addSource: (id: string, source: Record<string, unknown>) => void;
  getSource: (id: string) => GeoJsonSource | undefined;
  addLayer: (layer: Record<string, unknown>) => void;
  on: (...args: any[]) => void;
  getCanvas: () => HTMLCanvasElement;
  remove: () => void;
  resize: () => void;
};

type MarkerInstance = {
  setLngLat: (lngLat: [number, number]) => MarkerInstance;
  addTo: (map: MapInstance) => MarkerInstance;
  remove: () => void;
};

type BoundsInstance = {
  extend: (lngLat: [number, number]) => BoundsInstance;
};

type MapLibreGlobal = {
  Map: new (options: Record<string, unknown>) => MapInstance;
  Marker: new (options?: Record<string, unknown>) => MarkerInstance;
  NavigationControl: new (options?: Record<string, unknown>) => unknown;
  LngLatBounds: new () => BoundsInstance;
};

declare global {
  interface Window {
    maplibregl?: MapLibreGlobal;
  }
}

const MAPLIBRE_VERSION = '5.6.0';
const MAPLIBRE_SCRIPT_ID = 'biblia-fontes-maplibre-script';
const MAPLIBRE_STYLE_ID = 'biblia-fontes-maplibre-style';
const HISTORICAL_AREAS_SOURCE = 'biblia-fontes-historical-areas';
const HISTORICAL_AREAS_FILL = 'biblia-fontes-historical-areas-fill';
const HISTORICAL_AREAS_LINE = 'biblia-fontes-historical-areas-line';

function activeAt(entity: HistoricalEntity, year: number) {
  const { start, end, precision } = entity.temporal;
  if (precision === 'unknown' || start === undefined) return true;
  return start <= year && (end ?? start) >= year;
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

function markerStyle(entity: HistoricalEntity, selected: boolean) {
  if (selected) return { background: '#9b6a38', color: '#fff', border: '#9b6a38', dot: '#fff' };
  if (entity.type === 'event') return { background: 'rgba(112,48,38,.95)', color: '#fff', border: 'rgba(112,48,38,1)', dot: '#fff' };
  if (entity.type === 'city') return { background: 'rgba(250,247,240,.96)', color: '#30271f', border: 'rgba(80,63,47,.38)', dot: '#30271f' };
  if (entity.type === 'empire') return { background: 'rgba(68,50,34,.94)', color: '#fff', border: 'rgba(68,50,34,.95)', dot: '#d9b07d' };
  if (entity.type === 'region') return { background: 'rgba(239,229,210,.94)', color: '#4f4032', border: 'rgba(155,106,56,.45)', dot: '#9b6a38' };
  if (entity.type === 'redaction' || entity.type === 'text') return { background: 'rgba(255,249,238,.96)', color: '#6e4b29', border: 'rgba(155,106,56,.65)', dot: '#9b6a38' };
  return { background: 'rgba(250,247,240,.94)', color: '#30271f', border: 'rgba(80,63,47,.34)', dot: '#9b6a38' };
}

function loadMapLibre(): Promise<MapLibreGlobal> {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);

  if (!document.getElementById(MAPLIBRE_STYLE_ID)) {
    const link = document.createElement('link');
    link.id = MAPLIBRE_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`;
    document.head.appendChild(link);
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(MAPLIBRE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => window.maplibregl ? resolve(window.maplibregl) : reject(new Error('MapLibre non disponibile')), { once: true });
      existing.addEventListener('error', () => reject(new Error('Impossibile caricare MapLibre')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = MAPLIBRE_SCRIPT_ID;
    script.src = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`;
    script.async = true;
    script.onload = () => window.maplibregl ? resolve(window.maplibregl) : reject(new Error('MapLibre non disponibile'));
    script.onerror = () => reject(new Error('Impossibile caricare MapLibre'));
    document.head.appendChild(script);
  });
}

export default function HistoricalExplorerMap({ entities, areas = [], selectedId, year, onSelect }: HistoricalExplorerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);
  const mapLibreRef = useRef<MapLibreGlobal | null>(null);
  const fittedRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  onSelectRef.current = onSelect;

  const mapped = entities.filter((entity) => entity.spatial?.lat !== undefined && entity.spatial?.lng !== undefined);
  const activeAreaRecords = areas.filter((area) => area.temporal.start <= year && area.temporal.end >= year);

  useEffect(() => {
    let cancelled = false;

    loadMapLibre()
      .then((maplibre) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        mapLibreRef.current = maplibre;

        const map = new maplibre.Map({
          container: containerRef.current,
          center: [36.5, 31.8],
          zoom: 3.35,
          minZoom: 2.2,
          maxZoom: 10,
          attributionControl: true,
          style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              },
            },
            layers: [
              {
                id: 'osm-basemap',
                type: 'raster',
                source: 'osm',
                paint: {
                  'raster-saturation': -0.78,
                  'raster-contrast': -0.1,
                  'raster-brightness-max': 0.9,
                },
              },
            ],
          },
        });

        map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
        mapRef.current = map;
        map.on('load', () => {
          if (cancelled) return;
          setStatus('ready');
          window.setTimeout(() => map.resize(), 50);
        });
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      fittedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !mapRef.current) return;
    const map = mapRef.current;
    const visibleIds = new Set(entities.map((entity) => entity.id));
    const activeAreas = areas.filter(
      (area) => visibleIds.has(area.entityId) && area.temporal.start <= year && area.temporal.end >= year,
    );

    const featureCollection = {
      type: 'FeatureCollection',
      features: activeAreas.map((area) => ({
        type: 'Feature',
        id: area.id,
        properties: {
          entityId: area.entityId,
          label: area.label,
          confidence: area.confidence,
          note: area.note,
        },
        geometry: area.geometry,
      })),
    };

    const existing = map.getSource(HISTORICAL_AREAS_SOURCE);
    if (existing) {
      existing.setData(featureCollection);
      return;
    }

    map.addSource(HISTORICAL_AREAS_SOURCE, { type: 'geojson', data: featureCollection });
    map.addLayer({
      id: HISTORICAL_AREAS_FILL,
      type: 'fill',
      source: HISTORICAL_AREAS_SOURCE,
      paint: {
        'fill-color': '#9b6a38',
        'fill-opacity': 0.13,
      },
    });
    map.addLayer({
      id: HISTORICAL_AREAS_LINE,
      type: 'line',
      source: HISTORICAL_AREAS_SOURCE,
      paint: {
        'line-color': '#9b6a38',
        'line-width': 1.5,
        'line-opacity': 0.72,
        'line-dasharray': [3, 2],
      },
    });

    map.on('click', HISTORICAL_AREAS_FILL, (event: any) => {
      const entityId = event?.features?.[0]?.properties?.entityId;
      if (typeof entityId === 'string') onSelectRef.current(entityId);
    });
    map.on('mouseenter', HISTORICAL_AREAS_FILL, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', HISTORICAL_AREAS_FILL, () => {
      map.getCanvas().style.cursor = '';
    });
  }, [areas, entities, status, year]);

  useEffect(() => {
    if (status !== 'ready' || !mapRef.current || !mapLibreRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const map = mapRef.current;
    const maplibre = mapLibreRef.current;
    const bounds = new maplibre.LngLatBounds();
    let boundsCount = 0;

    mapped.forEach((entity) => {
      const lat = entity.spatial?.lat;
      const lng = entity.spatial?.lng;
      if (lat === undefined || lng === undefined) return;

      const selected = entity.id === selectedId;
      const active = activeAt(entity, year);
      const style = markerStyle(entity, selected);
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${entity.label} · ${markerLabel(entity)}`);
      button.title = `${entity.label} · ${markerLabel(entity)}`;
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.gap = entity.type === 'city' ? '5px' : '6px';
      button.style.padding = selected ? '7px 10px' : entity.type === 'city' ? '5px 8px' : '6px 9px';
      button.style.borderRadius = entity.type === 'city' ? '9px' : '999px';
      button.style.border = `${selected ? 2 : 1}px solid ${style.border}`;
      button.style.background = style.background;
      button.style.color = style.color;
      button.style.boxShadow = selected ? '0 8px 22px rgba(48,39,31,.24)' : '0 3px 10px rgba(48,39,31,.13)';
      button.style.cursor = 'pointer';
      button.style.opacity = active ? '1' : '.32';
      button.style.whiteSpace = 'nowrap';
      button.style.fontSize = entity.type === 'city' ? '11px' : '12px';
      button.style.fontWeight = '700';
      button.style.fontFamily = 'Georgia, serif';
      button.style.transition = 'opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease';

      const dot = document.createElement('span');
      dot.style.width = entity.type === 'city' ? '6px' : selected ? '8px' : '7px';
      dot.style.height = dot.style.width;
      dot.style.borderRadius = entity.type === 'city' ? '2px' : '999px';
      dot.style.background = style.dot;
      dot.style.flex = '0 0 auto';

      const text = document.createElement('span');
      text.textContent = entity.label;
      button.append(dot, text);
      button.addEventListener('click', () => onSelectRef.current(entity.id));
      button.addEventListener('mouseenter', () => { button.style.opacity = '1'; });
      button.addEventListener('mouseleave', () => { button.style.opacity = active ? '1' : '.32'; });

      const marker = new maplibre.Marker({ element: button, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([lng, lat]);
      boundsCount += 1;
    });

    if (!fittedRef.current && boundsCount > 1) {
      map.fitBounds(bounds, { padding: 55, maxZoom: 4.6, duration: 0 });
      fittedRef.current = true;
    }
  }, [mapped, selectedId, status, year]);

  useEffect(() => {
    if (status !== 'ready' || !mapRef.current || !selectedId) return;
    const selected = mapped.find((entity) => entity.id === selectedId);
    const lat = selected?.spatial?.lat;
    const lng = selected?.spatial?.lng;
    if (lat === undefined || lng === undefined) return;
    mapRef.current.flyTo({ center: [lng, lat], duration: 650, essential: true });
  }, [mapped, selectedId, status]);

  return (
    <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line bg-paper-card/95 px-4 py-2">
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">Mappa interattiva · pan + zoom</span>
        <span className="text-[11px] text-ink-faint">base contemporanea · geometrie storiche temporali</span>
      </div>

      <div className="relative h-[430px] md:h-[500px]">
        <div ref={containerRef} className="absolute inset-0" aria-label="Mappa interattiva del Vicino Oriente" />

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

        {status === 'loading' ? (
          <div className="absolute inset-0 grid place-items-center bg-paper-card/90 text-sm text-ink-faint">Caricamento della base cartografica…</div>
        ) : null}

        {status === 'error' ? (
          <div className="absolute inset-0 grid place-items-center bg-paper-card p-6 text-center">
            <div>
              <strong className="font-serif text-lg text-ink">Base cartografica non disponibile</strong>
              <p className="mt-2 max-w-md text-sm leading-6 text-ink-faint">La componente storica resta valida; la mappa richiede connettività verso il servizio cartografico esterno.</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-papyrus-line bg-papyrus/25 px-4 py-2 text-[10px] leading-5 text-ink-faint">
        <span>{areas.length > 0 ? 'Le aree tratteggiate sono ricostruzioni didattiche approssimate: servono a mostrare il mutamento geo-temporale, non frontiere storiche certe.' : 'Questo dataset non espone geometrie territoriali: la mappa mostra soltanto entità georeferenziate.'}</span>
        <span>Base © OpenStreetMap contributors</span>
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
