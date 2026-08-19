const legacyDatasetSlugAliases: Record<string, string> = {
  genesis: 'genesi',
  exodus: 'esodo',
  cantico: 'cantico-dei-cantici',
};

const legacyDatasetIdAliases: Record<string, string[]> = {
  genesi: ['genesis-history', 'genesi-history'],
  esodo: ['exodus-history', 'esodo-history'],
  'cantico-dei-cantici': ['cantico-history', 'cantico-dei-cantici-history'],
};

export function canonicalHistoricalBookSlug(value?: string) {
  const raw = (value || '').replace(/^libro-/, '').replace(/-history$/, '');
  return legacyDatasetSlugAliases[raw] || raw;
}

export function historicalDatasetIdCandidates(bookSlug: string) {
  return legacyDatasetIdAliases[bookSlug] || [`${bookSlug}-history`];
}
