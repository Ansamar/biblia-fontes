export const categoryLabels: Record<string, string> = {
  pentateuco: 'Pentateuco',
  storici: 'Libri storici',
  sapienziali: 'Sapienziali e poetici',
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
  '1-re': '1Re', '2-re': '2Re', isaia: 'Is', geremia: 'Ger', ezechiele: 'Ez', daniele: 'Dn',
  matteo: 'Mt', marco: 'Mc', luca: 'Lc', giovanni: 'Gv', atti: 'At', romani: 'Rm',
  apocalisse: 'Ap', ebrei: 'Eb', giacomo: 'Gc',
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
