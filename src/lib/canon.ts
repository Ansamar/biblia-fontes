export const catholicCanonSlugs = [
  'genesi','esodo','levitico','numeri','deuteronomio','giosue','giudici','rut','1-samuele','2-samuele','1-re','2-re','1-cronache','2-cronache','esdra','neemia','tobia','giuditta','ester','1-maccabei','2-maccabei',
  'giobbe','salmi','proverbi','qoelet','cantico-dei-cantici','sapienza','siracide',
  'isaia','geremia','lamentazioni','baruc','ezechiele','daniele','osea','gioele','amos','abdia','giona','michea','naum','abacuc','sofonia','aggeo','zaccaria','malachia',
  'matteo','marco','luca','giovanni','atti','romani','1-corinti','2-corinti','galati','efesini','filippesi','colossesi','1-tessalonicesi','2-tessalonicesi','1-timoteo','2-timoteo','tito','filemone','ebrei','giacomo','1-pietro','2-pietro','1-giovanni','2-giovanni','3-giovanni','giuda','apocalisse',
] as const;

const order = new Map<string, number>(catholicCanonSlugs.map((slug, index) => [slug, index + 1]));

export function canonicalBookOrder(slug: string, fallback = 999) {
  return order.get(slug) ?? fallback;
}
