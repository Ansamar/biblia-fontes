'use client';

import { useEffect, useRef, useState } from 'react';
import type { HistoricalEntity } from '../historical-explorer/types';

type HistoricalExplorerMapProps = {
  entities: HistoricalEntity[];
  selectedId?: string;
  year: number;
  onSelect: (id: string) => void;
};

type MapInstance = {
  addControl: (control: unknown, position?: string) => void;
  fitBounds: (bounds: unknown, options?: Record<string, unknown>) => void;
  flyTo: (options: Record<string, unknown>) => void;
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
      existing.addEventListener('load', () => window.maplibregl ? resolve(window.maplibregl) : reject(new Error('MapLibre non disponibile')),
        { once: true });
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

export default function HistoricalExplorerMap({ entities, selectedId, year, onSelect }: HistoricalExplorerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);
  const mapLibreRef = useRef<MapLibreGlobal | null>(null);
  const fittedRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  onSelectRef.current = onSelect;

  const mapped = entities.filter(
    (entity) => entity.spatial?.lat !== undefined && entity.spatial?.lng !== undefined,
  );

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
                  'raster-saturation': -0.72,
                  'raster-contrast': -0.08,
                  'raster-brightness-max': 0.92,
                },
              },
            ],
          },
        });

        map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
        mapRef.current = map;
        setStatus('ready');
        window.setTimeout(() => map.resize(), 50);
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
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${entity.label} · ${markerLabel(entity)}`);
      button.title = entity.label;
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.gap = '6px';
      button.style.padding = selected ? '7px 10px' : '6px 9px';
      button.style.borderRadius = '999px';
      button.style.border = selected ? '2px solid #9b6a38' : '1px solid rgba(80,63,47,.34)';
      button.style.background = selected ? '#9b6a38' : 'rgba(250,247,240,.94)';
      button.style.color = selected ? '#fff' : '#30271f';
      button.style.boxShadow = selected ? '0 8px 22px rgba(48,39,31,.24)' : '0 3px 10px rgba(48,39,31,.13)';
      button.style.cursor = 'pointer';
      button.style.opacity = active ? '1' : '.42';
      button.style.whiteSpace = 'nowrap';
      button.style.fontSize = '12px';
      button.style.fontWeight = '700';
      button.style.fontFamily = 'Georgia, serif';
      button.style.transition = 'opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease';

      const dot = document.createElement('span');
      dot.style.width = selected ? '8px' : '7px';
      dot.style.height = selected ? '8px' : '7px';
      dot.style.borderRadius = '999px';
      dot.style.background = selected ? '#fff' : '#9b6a38';
      dot.style.flex = '0 0 auto';

      const text = document.createElement('span');
      text.textContent = entity.label;
      button.append(dot, text);
      button.addEventListener('click', () => onSelectRef.current(entity.id));
      button.addEventListener('mouseenter', () => { button.style.opacity = '1'; });
      button.addEventListener('mouseleave', () => { button.style.opacity = active ? '1' : '.42'; });

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
        <span className="text-[11px] text-ink-faint">base contemporanea · layer storici sovrapposti</span>
      </div>

      <div className="relative h-[390px] md:h-[430px]">
        <div ref={containerRef} className="absolute inset-0" aria-label="Mappa interattiva del Vicino Oriente" />

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
        <span>I punti indicano ancoraggi geografici; non rappresentano ancora estensioni territoriali storiche.</span>
        <span>Base © OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
