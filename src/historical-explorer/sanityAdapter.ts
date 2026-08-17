import type {
  HistoricalArea,
  HistoricalBiblicalReference,
  HistoricalEntity,
  HistoricalExplorerDataset,
  HistoricalScenario,
  HistoricalSource,
} from './types';

export type SanityHistoricalSource = HistoricalSource;

export type SanityHistoricalBiblicalReference = {
  display: string;
  bookSlug: string;
  chapterStart?: number;
  chapterEnd?: number;
  verseStart?: number;
  verseEnd?: number;
};

type SanityGeoPoint = {
  lat: number;
  lng: number;
};

export type SanityHistoricalEntity = Omit<HistoricalEntity, 'biblicalRefs' | 'relations' | 'spatial'> & {
  biblicalRefs?: SanityHistoricalBiblicalReference[];
  spatial?: {
    point?: SanityGeoPoint;
    region?: string;
  };
  relations?: Array<{
    targetId?: string;
    target?: { id?: string };
    kind: HistoricalEntity['relations'][number]['kind'];
    label: string;
  }>;
};

export type SanityHistoricalArea = Omit<HistoricalArea, 'entityId' | 'geometry'> & {
  entityId?: string;
  entity?: { id?: string };
  geometry: {
    type?: 'Polygon';
    rings?: Array<{
      points?: SanityGeoPoint[];
    }>;
  };
};

export type SanityHistoricalExplorerDocument = {
  _id?: string;
  id: string;
  title: string;
  subtitle: string;
  defaultRange: { start: number; end: number };
  quickYears?: number[];
  entities?: SanityHistoricalEntity[];
  scenarios?: HistoricalScenario[];
  areas?: SanityHistoricalArea[];
};

function normalizeReference(reference: SanityHistoricalBiblicalReference): HistoricalBiblicalReference {
  return {
    display: reference.display,
    bookSlug: reference.bookSlug,
    chapterStart: reference.chapterStart,
    chapterEnd: reference.chapterEnd,
    verseStart: reference.verseStart,
    verseEnd: reference.verseEnd,
  };
}

function normalizeEntity(entity: SanityHistoricalEntity): HistoricalEntity {
  const point = entity.spatial?.point;
  return {
    ...entity,
    spatial: point || entity.spatial?.region
      ? {
          lat: point?.lat,
          lng: point?.lng,
          region: entity.spatial?.region,
        }
      : undefined,
    biblicalRefs: entity.biblicalRefs?.map(normalizeReference),
    relations: (entity.relations || []).flatMap((relation) => {
      const targetId = relation.targetId || relation.target?.id;
      return targetId ? [{ targetId, kind: relation.kind, label: relation.label }] : [];
    }),
    sources: entity.sources || [],
  };
}

function closeRing(points: SanityGeoPoint[]) {
  const coordinates = points.map((point) => [point.lng, point.lat]);
  if (coordinates.length < 3) return coordinates;
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push([...first]);
  return coordinates;
}

function normalizeArea(area: SanityHistoricalArea): HistoricalArea | null {
  const entityId = area.entityId || area.entity?.id;
  if (!entityId) return null;

  const coordinates = (area.geometry?.rings || [])
    .map((ring) => closeRing(ring.points || []))
    .filter((ring) => ring.length >= 4);

  if (!coordinates.length) return null;

  return {
    id: area.id,
    entityId,
    label: area.label,
    temporal: area.temporal,
    confidence: area.confidence,
    note: area.note,
    sources: area.sources || [],
    geometry: {
      type: 'Polygon',
      coordinates,
    },
  };
}

export function historicalExplorerDatasetFromSanity(document: SanityHistoricalExplorerDocument): HistoricalExplorerDataset {
  const [start, end] = [document.defaultRange.start, document.defaultRange.end];

  return {
    id: document.id,
    title: document.title,
    subtitle: document.subtitle,
    defaultRange: [start, end],
    quickYears: document.quickYears || [],
    entities: (document.entities || []).map(normalizeEntity),
    scenarios: document.scenarios || [],
    areas: (document.areas || []).map(normalizeArea).filter((area): area is HistoricalArea => Boolean(area)),
  };
}
