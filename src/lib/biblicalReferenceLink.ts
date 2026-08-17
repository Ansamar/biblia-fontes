import { referenceAliases } from './bibleRouting';
import { studyContextHref } from '../study-context/context';
import type { HistoricalBiblicalReference } from '../historical-explorer/types';

export type HistoricalBiblicalReferenceInput = string | HistoricalBiblicalReference;

type BiblicalReferenceTarget = {
  href: string;
  bookSlug: string;
  chapter?: number;
  endChapter?: number;
  verseStart?: number;
  verseEnd?: number;
  label: string;
};

function normalize(value: string) {
  return value
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const aliasIndex = Object.entries(referenceAliases)
  .flatMap(([slug, aliases]) => aliases.map((alias) => ({ slug, alias: normalize(alias) })))
  .sort((a, b) => b.alias.length - a.alias.length);

function buildTarget(
  reference: HistoricalBiblicalReference,
  context: { originBook?: string; year?: number; entity?: string },
): BiblicalReferenceTarget {
  const chapter = reference.chapterStart;
  const pathname = chapter ? `/bibbia/${reference.bookSlug}/${chapter}` : `/bibbia/${reference.bookSlug}`;

  return {
    href: studyContextHref(pathname, {
      book: context.originBook || reference.bookSlug,
      chapter,
      source: 'history',
      year: context.year,
      entity: context.entity,
    }) + (chapter ? '#testo' : '#panoramica'),
    bookSlug: reference.bookSlug,
    chapter,
    endChapter: reference.chapterEnd,
    verseStart: reference.verseStart,
    verseEnd: reference.verseEnd,
    label: reference.display,
  };
}

function parseLegacyReference(raw: string): HistoricalBiblicalReference | null {
  const normalized = normalize(raw);
  if (!normalized) return null;

  const match = aliasIndex.find(({ alias }) => normalized === alias || normalized.startsWith(`${alias} `));
  if (!match) return null;

  const remainder = normalized.slice(match.alias.length).trim();
  const range = remainder.match(/^(\d{1,3})(?:\s*-\s*(\d{1,3}))?(?:[,:.]\s*(\d+)(?:\s*-\s*(\d+))?)?/);

  return {
    display: raw,
    bookSlug: match.slug,
    chapterStart: range ? Number(range[1]) : undefined,
    chapterEnd: range?.[2] ? Number(range[2]) : undefined,
    verseStart: range?.[3] ? Number(range[3]) : undefined,
    verseEnd: range?.[4] ? Number(range[4]) : undefined,
  };
}

export function historicalBiblicalReferenceTarget(
  input: HistoricalBiblicalReferenceInput,
  context: { originBook?: string; year?: number; entity?: string },
): BiblicalReferenceTarget | null {
  const reference = typeof input === 'string' ? parseLegacyReference(input) : input;
  if (!reference?.bookSlug) return null;
  return buildTarget(reference, context);
}

export function historicalBiblicalReferenceLabel(input: HistoricalBiblicalReferenceInput) {
  return typeof input === 'string' ? input : input.display;
}
