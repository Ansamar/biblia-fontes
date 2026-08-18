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
  | 'institution'
  | 'practice'
  | 'text'
  | 'redaction'
  | 'witness';

export type HistoricalRelation = {
  targetId: string;
  kind: 'context' | 'interaction' | 'memory' | 'composition' | 'transmission' | 'biblical-reference';
  label: string;
};

export type HistoricalSourceKind =
  | 'primary'
  | 'secondary'
  | 'dataset'
  | 'bibliography'
  | 'editorial';

export type HistoricalSource = {
  label: string;
  kind?: HistoricalSourceKind;
  citation?: string;
  locator?: string;
  url?: string;
  note?: string;
};

export type HistoricalBiblicalReference = {
  display: string;
  bookSlug: string;
  chapterStart?: number;
  chapterEnd?: number;
  verseStart?: number;
  verseEnd?: number;
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
  sources?: HistoricalSource[];
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
  biblicalRefs?: Array<string | HistoricalBiblicalReference>;
  relations: HistoricalRelation[];
  sources: HistoricalSource[];
};

export type HistoricalScenario = {
  id: string;
  start: number;
  end: number;
  title: string;
  summary: string;
};

export type ExplorerLayer = 'politics' | 'places' | 'events' | 'institutions' | 'texts' | 'transmission';

export type HistoricalExplorerDataset = {
  id: string;
  title: string;
  subtitle: string;
  defaultRange: [number, number];
  entities: HistoricalEntity[];
  scenarios?: HistoricalScenario[];
  quickYears?: number[];
  areas?: HistoricalArea[];
};
