export const categoryLabels: Record<string, string> = {
  pentateuco: 'Pentateuco',
  storici: 'Libri storici',
  sapienziali: 'Sapienziali e poetici',
  'sapienziali-poetici': 'Sapienziali e poetici',
  profetici: 'Profeti',
  vangeli: 'Vangeli',
  atti: 'Atti degli Apostoli',
  paoline: 'Lettere Paoline',
  'lettere-paoline': 'Lettere Paoline',
  ebrei: 'Ebrei',
  cattoliche: 'Lettere Cattoliche',
  'lettere-cattoliche': 'Lettere Cattoliche',
  apocalittica: 'Apocalittica',
  apocalisse: 'Apocalisse',
};

export const bookAbbreviations: Record<string, string> = {
  genesi: 'Gen', esodo: 'Es', levitico: 'Lv', numeri: 'Nm', deuteronomio: 'Dt',
  giosue: 'Gs', giudici: 'Gdc', rut: 'Rt', '1-samuele': '1Sam', '2-samuele': '2Sam',
  '1-re': '1Re', '2-re': '2Re', '1-cronache': '1Cr', '2-cronache': '2Cr',
  esdra: 'Esd', neemia: 'Ne', tobia: 'Tb', giuditta: 'Gdt', ester: 'Est',
  '1-maccabei': '1Mac', '2-maccabei': '2Mac',
  giobbe: 'Gb', salmi: 'Sal', proverbi: 'Pr', qoelet: 'Qo', qohelet: 'Qo',
  'cantico-dei-cantici': 'Ct', cantico: 'Ct', sapienza: 'Sap', siracide: 'Sir', ecclesiastico: 'Sir',
  isaia: 'Is', geremia: 'Ger', lamentazioni: 'Lam', baruc: 'Bar', ezechiele: 'Ez', daniele: 'Dn',
  osea: 'Os', gioele: 'Gl', amos: 'Am', abdia: 'Abd', giona: 'Gio', michea: 'Mi', naum: 'Na', abacuc: 'Ab', sofia: 'Sof', aggeo: 'Ag', zaccaria: 'Zc', malachia: 'Ml',
  matteo: 'Mt', marco: 'Mc', luca: 'Lc', giovanni: 'Gv', atti: 'At', romani: 'Rm',
  apocalisse: 'Ap', ebrei: 'Eb', giacomo: 'Gc',
};

export const referenceAliases: Record<string, string[]> = {
  genesi: ['gen', 'genesi'], esodo: ['es', 'esodo'], levitico: ['lv', 'lev', 'levitico'], numeri: ['nm', 'num', 'numeri'], deuteronomio: ['dt', 'deut', 'deuteronomio'],
  giosue: ['gs', 'giosue'], giudici: ['gdc', 'giudici'], rut: ['rt', 'rut'], '1-samuele': ['1sam', '1 sam', '1samuele'], '2-samuele': ['2sam', '2 sam', '2samuele'],
  '1-re': ['1re', '1 re'], '2-re': ['2re', '2 re'], '1-cronache': ['1cr', '1 cr', '1cronache'], '2-cronache': ['2cr', '2 cr', '2cronache'],
  esdra: ['esd', 'esdra'], neemia: ['ne', 'neemia'], tobia: ['tb', 'tobia'], giuditta: ['gdt', 'giuditta'], ester: ['est', 'ester'],
  '1-maccabei': ['1mac', '1 mac', '1maccabei'], '2-maccabei': ['2mac', '2 mac', '2maccabei'],
  giobbe: ['gb', 'giobbe'], salmi: ['sal', 'salmo', 'salmi'], proverbi: ['pr', 'prov', 'proverbi'],
  qoelet: ['qo', 'qoelet', 'qoèlet', 'ecclesiaste'], qohelet: ['qo', 'qohelet', 'qoelet', 'ecclesiaste'],
  'cantico-dei-cantici': ['ct', 'cantico', 'cantico dei cantici'], cantico: ['ct', 'cantico', 'cantico dei cantici'],
  sapienza: ['sap', 'sapienza'], siracide: ['sir', 'siracide', 'ecclesiastico'], ecclesiastico: ['sir', 'siracide', 'ecclesiastico'],
};

export function bookIdFromSlug(slug: string) {
  return `libro-${slug}`;
}

export function slugFromBookId(id?: string) {
  return (id || '').replace(/^libro-/, '');
}

export function categoryLabel(categoryId?: string) {
  return categoryLabels[categoryId || ''] || 'Bibbia';
}

export function bookAbbreviation(slug: string, title?: string) {
  if (bookAbbreviations[slug]) return bookAbbreviations[slug];
  const cleaned = (title || slug).replace(/[^A-Za-zÀ-ÿ0-9 ]/g, '').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length > 1 && /^\d+$/.test(parts[0])) return `${parts[0]}${parts[1].slice(0,3)}`;
  return cleaned.slice(0,3) || slug.slice(0,3);
}

export function matchReference(raw: string, books: { id: string; titolo: string; capitoli?: number }[]) {
  const normalized = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ');
  if (!normalized) return null;

  for (const book of books) {
    const slug = slugFromBookId(book.id);
    const aliases = referenceAliases[slug] || [bookAbbreviation(slug, book.titolo).toLowerCase(), book.titolo.toLowerCase()];
    for (const alias of aliases.sort((a, b) => b.length - a.length)) {
      const escaped = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = normalized.match(new RegExp(`^${escaped}\\s*(\\d{1,3})(?:[,:.]\\s*\\d+)?$`, 'i'));
      if (!match) continue;
      const chapter = Number(match[1]);
      if (chapter >= 1 && (!book.capitoli || chapter <= book.capitoli)) return { slug, chapter, label: `${book.titolo} ${chapter}` };
    }
  }
  return null;
}
