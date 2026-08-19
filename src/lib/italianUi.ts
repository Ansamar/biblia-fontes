import type { HistoricalEntityType, HistoricalRelation } from '../historical-explorer/types';

const productReplacements: Array<[RegExp, string]> = [
  [/\bHistorical Explorer\b/g, 'esploratore storico'],
  [/\bhistorical explorer\b/g, 'esploratore storico'],
  [/\bTimeline\b/g, 'cronologia'],
  [/\btimeline\b/g, 'cronologia'],
  [/\bdataset\b/gi, 'insieme di dati'],
];

export function italianizeVisibleCopy(value?: string) {
  if (!value) return '';
  return productReplacements.reduce((copy, [pattern, replacement]) => copy.replace(pattern, replacement), value);
}

const entityTypeLabels: Record<HistoricalEntityType, string> = {
  event: 'evento',
  people: 'popolo',
  empire: 'impero',
  city: 'città',
  region: 'regione',
  person: 'persona',
  institution: 'istituzione',
  practice: 'pratica',
  text: 'testo',
  redaction: 'redazione',
  witness: 'testimone',
};

const relationLabels: Record<HistoricalRelation['kind'], string> = {
  context: 'contesto',
  interaction: 'interazione',
  memory: 'memoria',
  composition: 'composizione',
  transmission: 'trasmissione',
  'biblical-reference': 'riferimento biblico',
};

export function historicalEntityTypeLabel(type: HistoricalEntityType) {
  return entityTypeLabels[type] || type;
}

export function historicalRelationLabel(kind: HistoricalRelation['kind']) {
  return relationLabels[kind] || kind;
}
