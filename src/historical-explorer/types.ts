export type EpistemicStatus =
  | 'attested'
  | 'probable'
  | 'debated'
  | 'memory'
  | 'comparandum'
  | 'narrative'
  | 'undatable';

export type HistoricalEntityType =
  | 'event'
  | 'people'
  | 'empire'
  | 'city'
  | 'region'
  | 'person'
  | 'text'
  | 'redaction'
  | 'witness';

export type HistoricalRelation = {
  targetId: string;
  kind: 'context' | 'interaction' | 'memory' | 'composition' | 'transmission' | 'biblical-reference';
  label: string;
};

export type HistoricalSource = {
  label: string;
  note?: string;
};

export type HistoricalGeometryConfidence = 'illustrative' | 'approximate' | 'reconstructed';

export type HistoricalArea = {
  id: string;
  entityId: string;
  label: string;
  temporal: {
    start: number;
    end: number;
  };
  confidence: HistoricalGeometryConfidence;
  note: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
};

export type HistoricalEntity = {
  id: string;
  type: HistoricalEntityType;
  label: string;
  summary: string;
  temporal: {
    start?: number;
    end?: number;
    precision: 'year' | 'range' | 'century' | 'unknown';
  };
  spatial?: {
    lat?: number;
    lng?: number;
    region?: string;
  };
  epistemicStatus: EpistemicStatus;
  biblicalRefs?: string[];
  relations: HistoricalRelation[];
  sources: HistoricalSource[];
};

export type ExplorerLayer = 'politics' | 'places' | 'events' | 'texts' | 'transmission';

export type HistoricalExplorerDataset = {
  id: string;
  title: string;
  subtitle: string;
  defaultRange: [number, number];
  entities: HistoricalEntity[];
};
