export type HistoricalMapPresetId = 'near-east' | 'levant' | 'eastern-mediterranean';

export type HistoricalMapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export type HistoricalMapPreset = {
  id: HistoricalMapPresetId;
  label: string;
  bounds: HistoricalMapBounds;
  regionLabels: Array<{ label: string; lat: number; lng: number; size?: 'sm' | 'md' | 'lg' }>;
  waterLabels: Array<{ label: string; lat: number; lng: number }>;
};

export const historicalMapPresets: Record<HistoricalMapPresetId, HistoricalMapPreset> = {
  'near-east': {
    id: 'near-east',
    label: 'Vicino Oriente antico',
    bounds: { minLat: 22, maxLat: 42, minLng: 24, maxLng: 58 },
    regionLabels: [
      { label: 'EGITTO', lat: 27.8, lng: 28.6, size: 'lg' },
      { label: 'SINAI', lat: 29.0, lng: 33.3, size: 'md' },
      { label: 'CANAAN / LEVANTE', lat: 32.2, lng: 35.7, size: 'md' },
      { label: 'ANATOLIA', lat: 38.4, lng: 34.6, size: 'lg' },
      { label: 'MESOPOTAMIA', lat: 33.5, lng: 44.3, size: 'lg' },
      { label: 'ARABIA', lat: 26.2, lng: 43.5, size: 'lg' },
    ],
    waterLabels: [
      { label: 'MEDITERRANEO', lat: 34.5, lng: 29.8 },
      { label: 'MAR ROSSO', lat: 25.7, lng: 36.0 },
    ],
  },
  levant: {
    id: 'levant',
    label: 'Levante meridionale',
    bounds: { minLat: 27, maxLat: 37, minLng: 29, maxLng: 40.5 },
    regionLabels: [
      { label: 'FENICIA', lat: 34.0, lng: 35.4, size: 'sm' },
      { label: 'GALILEA', lat: 32.9, lng: 35.4, size: 'sm' },
      { label: 'SAMARIA', lat: 32.1, lng: 35.2, size: 'sm' },
      { label: 'GIUDA', lat: 31.5, lng: 35.2, size: 'md' },
      { label: 'FILISTIA', lat: 31.7, lng: 34.6, size: 'sm' },
      { label: 'TRANS-GIORDANIA', lat: 31.8, lng: 36.3, size: 'md' },
      { label: 'SINAI', lat: 29.5, lng: 33.3, size: 'lg' },
      { label: 'EGITTO', lat: 29.4, lng: 30.3, size: 'lg' },
      { label: 'ARABIA', lat: 29.4, lng: 38.3, size: 'lg' },
    ],
    waterLabels: [
      { label: 'MEDITERRANEO', lat: 33.0, lng: 31.7 },
      { label: 'MAR MORTO', lat: 31.1, lng: 35.55 },
    ],
  },
  'eastern-mediterranean': {
    id: 'eastern-mediterranean',
    label: 'Mediterraneo orientale',
    bounds: { minLat: 27, maxLat: 43, minLng: 10, maxLng: 43 },
    regionLabels: [
      { label: 'ITALIA', lat: 40.7, lng: 13.2, size: 'md' },
      { label: 'MACEDONIA', lat: 40.7, lng: 22.0, size: 'md' },
      { label: 'ACAIA', lat: 37.9, lng: 22.0, size: 'md' },
      { label: 'ASIA MINORE / ANATOLIA', lat: 38.1, lng: 31.7, size: 'lg' },
      { label: 'SIRIA', lat: 34.7, lng: 37.2, size: 'md' },
      { label: 'GIUDEA', lat: 31.5, lng: 35.2, size: 'sm' },
      { label: 'EGITTO', lat: 29.2, lng: 28.2, size: 'lg' },
    ],
    waterLabels: [
      { label: 'MAR EGEO', lat: 38.1, lng: 25.2 },
      { label: 'MEDITERRANEO', lat: 32.4, lng: 23.0 },
    ],
  },
};

export function inferHistoricalMapPreset(points: Array<{ lat: number; lng: number }>): HistoricalMapPresetId {
  if (!points.length) return 'near-east';
  const minLng = Math.min(...points.map((point) => point.lng));
  const maxLng = Math.max(...points.map((point) => point.lng));
  const minLat = Math.min(...points.map((point) => point.lat));
  const maxLat = Math.max(...points.map((point) => point.lat));
  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;

  if (minLng < 25 || lngSpan > 18) return 'eastern-mediterranean';
  if (minLng >= 29 && maxLng <= 41 && minLat >= 27 && maxLat <= 37 && lngSpan < 10 && latSpan < 9) return 'levant';
  return 'near-east';
}
