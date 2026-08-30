import { canonicalBookSlug } from './canon';

export const categoryLabels: Record<string, string> = {
  pentateuco: 'Pentateuco',
  storici: 'Libri storici',
  sapienziali: 'Sapienziali e poetici',
  'sapienziali-poetici': 'Sapienziali e poetici',
  profetici: 'Profeti',
  profeti: 'Profeti',
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
  matteo: 'Mt', marco: 'Mc', luca: 'Lc', giovanni: 'Gv', atti: 'At',
  romani: 'Rm', '1-corinzi': '1Cor', '2-corinzi': '2Cor', galati: 'Gal', efesini: 'Ef', filippesi: 'Fil', colossesi: 'Col',
  '1-tessalonicesi': '1Ts', '2-tessalonicesi': '2Ts', '1-timoteo': '1Tm', '2-timoteo': '2Tm', tito: 'Tt', filemone: 'Fm',
  ebrei: 'Eb', giacomo: 'Gc', '1-pietro': '1Pt', '2-pietro': '2Pt', '1-giovanni': '1Gv', '2-giovanni': '2Gv', '3-giovanni': '3Gv', giuda: 'Gd',
  apocalisse: 'Ap',
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
  isaia: ['is', 'isaia'], geremia: ['ger', 'geremia'], lamentazioni: ['lam', 'lamentazioni'], baruc: ['bar', 'baruc'], ezechiele: ['ez', 'ezechiele'], daniele: ['dn', 'dan', 'daniele'],
  osea: ['os', 'osea'], gioele: ['gl', 'gioele'], amos: ['am', 'amos'], abdia: ['abd', 'abdia'], giona: ['gio', 'giona'], michea: ['mi', 'michea'], naum: ['na', 'naum'], abacuc: ['ab', 'abacuc'], sofia: ['sof', 'sofonia', 'sofia'], aggeo: ['ag', 'aggeo'], zaccaria: ['zc', 'zaccaria'], malachia: ['ml', 'malachia'],
  matteo: ['mt', 'matteo'], marco: ['mc', 'marco'], luca: ['lc', 'luca'], giovanni: ['gv', 'giovanni'], atti: ['at', 'atti', 'atti degli apostoli'],
  romani: ['rm', 'rom', 'romani'], '1-corinzi': ['1cor', '1 cor', '1corinzi', '1 corinzi', '1corinti', '1 corinti'], '2-corinzi': ['2cor', '2 cor', '2corinzi', '2 corinzi', '2corinti', '2 corinti'],
  galati: ['gal', 'galati'], efesini: ['ef', 'efesini'], filippesi: ['fil', 'filippesi'], colossesi: ['col', 'colossesi'],
  '1-tessalonicesi': ['1ts', '1 ts', '1tessalonicesi', '1 tessalonicesi'], '2-tessalonicesi': ['2ts', '2 ts', '2tessalonicesi', '2 tessalonicesi'],
  '1-timoteo': ['1tm', '1 tm', '1timoteo', '1 timoteo'], '2-timoteo': ['2tm', '2 tm', '2timoteo', '2 timoteo'],
  tito: ['tt', 'tito'], filemone: ['fm', 'filemone'], ebrei: ['eb', 'ebrei'], giacomo: ['gc', 'giacomo'],
  '1-pietro': ['1pt', '1 pt', '1pietro', '1 pietro'], '2-pietro': ['2pt', '2 pt', '2pietro', '2 pietro'],
  '1-giovanni': ['1gv', '1 gv', '1giovanni', '1 giovanni'], '2-giovanni': ['2gv', '2 gv', '2giovanni', '2 giovanni'], '3-giovanni': ['3gv', '3 gv', '3giovanni', '3 giovanni'],
  giuda: ['gd', 'giuda'], apocalisse: ['ap', 'apocalisse'],
};

// The reference tables retain their legacy spelling; resolve either lookup form.
function referenceLookupSlug(slug: string) {
  const canonical = canonicalBookSlug(slug);
  if (canonical === '1-corinti') return '1-corinzi';
  if (canonical === '2-corinti') return '2-corinzi';
  return canonical;
}

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
  slug = referenceLookupSlug(slug);
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
    const aliases = referenceAliases[referenceLookupSlug(slug)] || [bookAbbreviation(slug, book.titolo).toLowerCase(), book.titolo.toLowerCase()];
    for (const alias of [...aliases].sort((a, b) => b.length - a.length)) {
      const escaped = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = normalized.match(new RegExp(`^${escaped}\\s*(\\d{1,3})(?:[,:.]\\s*\\d+)?$`, 'i'));
      if (!match) continue;
      const chapter = Number(match[1]);
      if (chapter >= 1 && (!book.capitoli || chapter <= book.capitoli)) return { slug, chapter, label: `${book.titolo} ${chapter}` };
    }
  }
  return null;
}
