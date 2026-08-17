import type { HistoricalArea } from './types';

/**
 * Prime geometrie dimostrative dell'Historical Explorer.
 * Non sono frontiere storiche precise: servono a validare il motore geo-temporale.
 * Ogni area porta quindi un confidence esplicito e una nota metodologica.
 */
export const historicalAreas: HistoricalArea[] = [
  {
    id: 'neo-assyria-demo-area',
    entityId: 'neo-assyria',
    label: 'Sfera neo-assira · ricostruzione didattica',
    temporal: { start: -850, end: -627 },
    confidence: 'illustrative',
    note: 'Inviluppo dimostrativo per testare la variazione territoriale nel tempo; non rappresenta un confine politico puntuale.',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [34.2, 29.3],
        [32.7, 34.6],
        [36.4, 38.3],
        [44.9, 38.1],
        [48.3, 34.0],
        [46.8, 29.8],
        [40.0, 28.3],
        [34.2, 29.3],
      ]],
    },
  },
  {
    id: 'neo-babylon-demo-area',
    entityId: 'neo-babylon',
    label: 'Sfera neobabilonese · ricostruzione didattica',
    temporal: { start: -626, end: -540 },
    confidence: 'illustrative',
    note: 'Inviluppo dimostrativo del sistema babilonese fra Mesopotamia e Levante; non va letto come frontiera amministrativa precisa.',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [34.0, 29.0],
        [33.2, 34.1],
        [37.6, 36.9],
        [46.4, 35.2],
        [48.0, 30.2],
        [44.6, 27.8],
        [37.4, 27.6],
        [34.0, 29.0],
      ]],
    },
  },
  {
    id: 'achaemenid-demo-area',
    entityId: 'achaemenid-persia',
    label: 'Sfera achemenide · ricostruzione didattica',
    temporal: { start: -539, end: -400 },
    confidence: 'illustrative',
    note: 'Inviluppo didattico limitato alla finestra geografica del prototipo. L’impero achemenide reale si estendeva molto oltre la carta mostrata.',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [29.2, 26.0],
        [28.8, 34.8],
        [35.8, 39.0],
        [49.8, 39.0],
        [51.2, 27.0],
        [43.8, 23.4],
        [33.0, 24.2],
        [29.2, 26.0],
      ]],
    },
  },
];
