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

export type SanityHistoricalEntity = Omit<HistoricalEntity, 'biblicalRefs' | 'relations'> & {
  biblicalRefs?: SanityHistoricalBiblicalReference[];
  relations?: Array<{
    targetId?: string;
    target?: { _id?: string };
    kind: HistoricalEntity['relations'][number]['kind'];
    label: string;
  }>;
};

export type SanityHistoricalArea = Omit<HistoricalArea, 'entityId'> & {
  entityId?: string;
  entity?: { _id?: string };
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
  return {
    ...entity,
    biblicalRefs: entity.biblicalRefs?.map(normalizeReference),
    relations: (entity.relations || []).flatMap((relation) => {
      const targetId = relation.targetId || relation.target?._id;
      return targetId ? [{ targetId, kind: relation.kind, label: relation.label }] : [];
    }),
    sources: entity.sources || [],
  };
}

function normalizeArea(area: SanityHistoricalArea): HistoricalArea | null {
  const entityId = area.entityId || area.entity?._id;
  if (!entityId) return null;
  return {
    ...area,
    entityId,
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
