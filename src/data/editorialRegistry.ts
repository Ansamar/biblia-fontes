import { genesisEditorial } from './genesisEditorial';
import { pentateuchEditorial, type BookEditorialProfile } from './editorialPentateuch';
import { historicalEditorial } from './editorialHistorical';
import { wisdomEditorial } from './editorialWisdom';
import { propheticEditorial } from './editorialProphets';
import { newTestamentEditorial } from './editorialNewTestament';

const profiles: Record<string, BookEditorialProfile> = {
  ...pentateuchEditorial,
  ...historicalEditorial,
  ...wisdomEditorial,
  ...propheticEditorial,
  ...newTestamentEditorial,
};

const PLACEHOLDER_PATTERNS = [
  /in preparazione/i,
  /da definire/i,
  /non ancora disponibile/i,
  /attribuzione registrata/i,
  /scheda introduttiva/i,
  /dati compositivi/i,
  /contesto storico pertinente/i,
];

function textFromUnknown(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (Array.isArray(value)) return value.map(textFromUnknown).filter(Boolean).join(' · ');
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    return textFromUnknown(v.descrizione ?? v.motivazione ?? v.etichetta ?? v.citazione ?? v.titolo ?? v.nome ?? v.nota);
  }
  return '';
}

function usable(value: unknown) {
  const text = textFromUnknown(value);
  return Boolean(text) && !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

export function enrichEditorialChapter(slug: string, chapter: any, numero: number) {
  if (slug === 'genesi') {
    const e = genesisEditorial[numero];
    if (!e) return chapter;
    return {
      ...chapter,
      sintesi: e.summary,
      struttura: e.structure,
      contestoStorico: e.context,
      tradizione: e.formation,
      analisiStoricoCritica: e.critical,
      testoCritico: e.textual,
      bibliografia: e.bibliography,
    };
  }

  const profile = profiles[slug];
  if (!profile) return chapter;

  return {
    ...chapter,
    contestoStorico: usable(chapter?.contestoStorico) ? chapter.contestoStorico : profile.context,
    tradizione: usable(chapter?.tradizione) || usable(chapter?.redazione) ? chapter.tradizione : profile.formation,
    analisiStoricoCritica: usable(chapter?.analisiStoricoCritica)
      ? chapter.analisiStoricoCritica
      : `Il capitolo va interpretato nel quadro compositivo specifico del libro. ${profile.formation}`,
    testoCritico: usable(chapter?.testoCritico) ? chapter.testoCritico : profile.textual,
    bibliografia: Array.isArray(chapter?.bibliografia) && chapter.bibliografia.length
      ? chapter.bibliografia
      : profile.bibliography,
  };
}

export function hasCanonicalEditorialProfile(slug: string) {
  return slug === 'genesi' || Boolean(profiles[slug]);
}

export const canonicalEditorialBookCount = 73;
