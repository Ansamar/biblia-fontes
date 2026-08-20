import type { HistoricalBiblicalReference, HistoricalEntity, HistoricalExplorerDataset } from './types';

const aliases: Record<string, string[]> = {
  genesi: ['gen', 'genesi'], esodo: ['es', 'eso', 'esodo'], levitico: ['lv', 'lev', 'levitico'], numeri: ['nm', 'num', 'numeri'], deuteronomio: ['dt', 'deut', 'deuteronomio'],
  giosue: ['gs', 'gios', 'giosuè', 'giosue'], giudici: ['gc', 'gdc', 'giudici'], rut: ['rt', 'rut'],
  salmi: ['sal', 'sl', 'salmi'], isaia: ['is', 'isaia'], geremia: ['ger', 'gr', 'geremia'], ezechiele: ['ez', 'ezechiele'], daniele: ['dn', 'dan', 'daniele'],
  matteo: ['mt', 'matteo'], marco: ['mc', 'marco'], luca: ['lc', 'luca'], giovanni: ['gv', 'giovanni'], atti: ['at', 'atti'],
  romani: ['rm', 'rom', 'romani'], '1-corinti': ['1cor', '1 cor', '1 corinzi'], '2-corinti': ['2cor', '2 cor', '2 corinzi'],
  apocalisse: ['ap', 'apocalisse'],
};

function normalize(value: string) {
  return value.toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function structuredReferenceMatches(reference: HistoricalBiblicalReference, bookSlug: string, chapter: number) {
  if (reference.bookSlug && normalize(reference.bookSlug) !== normalize(bookSlug)) return false;
  const start = reference.chapterStart;
  const end = reference.chapterEnd ?? start;
  if (start === undefined) return false;
  return start <= chapter && (end ?? start) >= chapter;
}

function stringReferenceMatches(reference: string, bookSlug: string, chapter: number) {
  const value = normalize(reference);
  const candidates = aliases[bookSlug] || [bookSlug.replaceAll('-', ' ')];
  const hasBook = candidates.some((alias) => value.includes(normalize(alias)));
  if (!hasBook) return false;
  return new RegExp(`(^|[^0-9])${chapter}(?=[:;,.–—\\-\\s]|$)`).test(value);
}

export function entityMatchesChapter(entity: HistoricalEntity, bookSlug: string, chapter: number) {
  return (entity.biblicalRefs || []).some((reference) => typeof reference === 'string'
    ? stringReferenceMatches(reference, bookSlug, chapter)
    : structuredReferenceMatches(reference, bookSlug, chapter));
}

export function historicalDatasetForChapter(dataset: HistoricalExplorerDataset, bookSlug: string, chapter?: number) {
  if (!chapter || chapter < 1) return { dataset, contextualized: false, primaryEntityIds: [] as string[] };

  const primary = dataset.entities.filter((entity) => entityMatchesChapter(entity, bookSlug, chapter));
  if (!primary.length) return { dataset, contextualized: false, primaryEntityIds: [] as string[] };

  const primaryIds = new Set(primary.map((entity) => entity.id));
  const relatedIds = new Set(primary.flatMap((entity) => entity.relations?.map((relation) => relation.targetId) || []));
  const entities = dataset.entities.filter((entity) => primaryIds.has(entity.id) || relatedIds.has(entity.id));
  const visibleIds = new Set(entities.map((entity) => entity.id));

  return {
    contextualized: true,
    primaryEntityIds: primary.map((entity) => entity.id),
    dataset: {
      ...dataset,
      subtitle: `Contesto storico collegato al capitolo ${chapter}. ${dataset.subtitle}`,
      entities,
      areas: dataset.areas?.filter((area) => visibleIds.has(area.entityId)),
    },
  };
}
