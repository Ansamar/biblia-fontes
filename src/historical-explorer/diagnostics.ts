import type { HistoricalExplorerDataset } from './types';

export type HistoricalDatasetIssue = {
  severity: 'error' | 'warning';
  code:
    | 'missing-entity-source'
    | 'unclassified-source'
    | 'broken-relation'
    | 'broken-area-target'
    | 'missing-area-source'
    | 'invalid-area-range'
    | 'invalid-entity-range';
  ownerId: string;
  message: string;
};

export type HistoricalDatasetDiagnostics = {
  entityCount: number;
  areaCount: number;
  sourceCount: number;
  classifiedSourceCount: number;
  issues: HistoricalDatasetIssue[];
  hasErrors: boolean;
};

export function diagnoseHistoricalDataset(dataset: HistoricalExplorerDataset): HistoricalDatasetDiagnostics {
  const issues: HistoricalDatasetIssue[] = [];
  const entityIds = new Set(dataset.entities.map((entity) => entity.id));
  let sourceCount = 0;
  let classifiedSourceCount = 0;

  for (const entity of dataset.entities) {
    if (!entity.sources.length) {
      issues.push({
        severity: 'warning',
        code: 'missing-entity-source',
        ownerId: entity.id,
        message: `${entity.label}: nessuna fonte o provenance registrata.`,
      });
    }

    for (const source of entity.sources) {
      sourceCount += 1;
      if (source.kind) classifiedSourceCount += 1;
      else {
        issues.push({
          severity: 'warning',
          code: 'unclassified-source',
          ownerId: entity.id,
          message: `${entity.label}: la fonte “${source.label}” non è ancora classificata.`,
        });
      }
    }

    for (const relation of entity.relations) {
      if (!entityIds.has(relation.targetId)) {
        issues.push({
          severity: 'error',
          code: 'broken-relation',
          ownerId: entity.id,
          message: `${entity.label}: relazione verso entità inesistente “${relation.targetId}”.`,
        });
      }
    }

    const { start, end } = entity.temporal;
    if (start !== undefined && end !== undefined && start > end) {
      issues.push({
        severity: 'error',
        code: 'invalid-entity-range',
        ownerId: entity.id,
        message: `${entity.label}: intervallo temporale invertito (${start} > ${end}).`,
      });
    }
  }

  for (const area of dataset.areas || []) {
    if (!entityIds.has(area.entityId)) {
      issues.push({
        severity: 'error',
        code: 'broken-area-target',
        ownerId: area.id,
        message: `${area.label}: entityId “${area.entityId}” non esiste nel dataset.`,
      });
    }

    if (area.temporal.start > area.temporal.end) {
      issues.push({
        severity: 'error',
        code: 'invalid-area-range',
        ownerId: area.id,
        message: `${area.label}: intervallo temporale invertito (${area.temporal.start} > ${area.temporal.end}).`,
      });
    }

    if (!area.sources?.length) {
      issues.push({
        severity: 'warning',
        code: 'missing-area-source',
        ownerId: area.id,
        message: `${area.label}: provenance della geometria non registrata.`,
      });
    }

    for (const source of area.sources || []) {
      sourceCount += 1;
      if (source.kind) classifiedSourceCount += 1;
      else {
        issues.push({
          severity: 'warning',
          code: 'unclassified-source',
          ownerId: area.id,
          message: `${area.label}: la fonte geometrica “${source.label}” non è ancora classificata.`,
        });
      }
    }
  }

  return {
    entityCount: dataset.entities.length,
    areaCount: dataset.areas?.length || 0,
    sourceCount,
    classifiedSourceCount,
    issues,
    hasErrors: issues.some((issue) => issue.severity === 'error'),
  };
}
