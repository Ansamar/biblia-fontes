export const catholicCanonSlugs = [
  'genesi','esodo','levitico','numeri','deuteronomio','giosue','giudici','rut','1-samuele','2-samuele','1-re','2-re','1-cronache','2-cronache','esdra','neemia','tobia','giuditta','ester','1-maccabei','2-maccabei',
  'giobbe','salmi','proverbi','qoelet','cantico-dei-cantici','sapienza','siracide',
  'isaia','geremia','lamentazioni','baruc','ezechiele','daniele','osea','gioele','amos','abdia','giona','michea','naum','abacuc','sofonia','aggeo','zaccaria','malachia',
  'matteo','marco','luca','giovanni','atti','romani','1-corinti','2-corinti','galati','efesini','filippesi','colossesi','1-tessalonicesi','2-tessalonicesi','1-timoteo','2-timoteo','tito','filemone','ebrei','giacomo','1-pietro','2-pietro','1-giovanni','2-giovanni','3-giovanni','giuda','apocalisse',
] as const;

const order = new Map<string, number>(catholicCanonSlugs.map((slug, index) => [slug, index + 1]));

// Normalize lookup keys only; do not rewrite persisted Sanity IDs or public URLs.
export function canonicalBookSlug(slug: string) {
  if (slug === '1-corinzi') return '1-corinti';
  if (slug === '2-corinzi') return '2-corinti';
  return slug;
}

export function canonicalBookOrder(slug: string, fallback = 999) {
  return order.get(canonicalBookSlug(slug)) ?? fallback;
}

export function canonicalBookCategory(slug: string) {
  const position = canonicalBookOrder(slug, 999);
  if (position <= 5) return 'Pentateuco';
  if (position <= 21) return 'Libri storici';
  if (position <= 28) return 'Sapienziali e poetici';
  if (position <= 46) return 'Profeti';
  if (position <= 50) return 'Vangeli';
  if (position === 51) return 'Atti degli Apostoli';
  if (position <= 64) return 'Lettere Paoline';
  if (position === 65) return 'Ebrei';
  if (position <= 72) return 'Lettere Cattoliche';
  if (position === 73) return 'Apocalisse';
  return 'Altri libri';
}
