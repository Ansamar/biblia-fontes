import type { BiblicalTextUnit, BiblicalVerse } from '../components/BiblicalTextReader';

export type AlignedVerseRow = {
  key: string;
  label: string;
  numero: number;
  marker: string;
  verses: Array<BiblicalVerse | null>;
};

function marker(verse: BiblicalVerse) {
  return (verse.marcatoreAlfabetico || '').trim();
}

export function verseAlignmentKey(verse: BiblicalVerse) {
  return `${verse.numero}:${marker(verse)}`;
}

export function alignWitnessVerses(witnesses: BiblicalTextUnit[]): AlignedVerseRow[] {
  const references = new Map<string, { numero: number; marker: string }>();
  const indexes = witnesses.map((witness) => {
    const index = new Map<string, BiblicalVerse>();
    for (const verse of witness.versetti || []) {
      const key = verseAlignmentKey(verse);
      if (!references.has(key)) references.set(key, { numero: verse.numero, marker: marker(verse) });
      if (!index.has(key)) index.set(key, verse);
    }
    return index;
  });

  return [...references.entries()]
    .sort(([, a], [, b]) => a.numero - b.numero || a.marker.localeCompare(b.marker, 'it'))
    .map(([key, reference]) => ({
      key,
      label: `${reference.numero}${reference.marker}`,
      numero: reference.numero,
      marker: reference.marker,
      verses: indexes.map((index) => index.get(key) || null),
    }));
}
