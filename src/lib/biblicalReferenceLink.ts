import { referenceAliases } from './bibleRouting';
import { studyContextHref } from '../study-context/context';

type BiblicalReferenceTarget = {
  href: string;
  bookSlug: string;
  chapter?: number;
  endChapter?: number;
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

export function historicalBiblicalReferenceTarget(
  raw: string,
  context: { year?: number; entity?: string },
): BiblicalReferenceTarget | null {
  const normalized = normalize(raw);
  if (!normalized) return null;

  const match = aliasIndex.find(({ alias }) => normalized === alias || normalized.startsWith(`${alias} `));
  if (!match) return null;

  const remainder = normalized.slice(match.alias.length).trim();
  const range = remainder.match(/^(\d{1,3})(?:\s*-\s*(\d{1,3}))?(?:[,:.]\s*\d+)?/);
  const chapter = range ? Number(range[1]) : undefined;
  const endChapter = range?.[2] ? Number(range[2]) : undefined;
  const pathname = chapter ? `/bibbia/${match.slug}/${chapter}` : `/bibbia/${match.slug}`;

  return {
    href: studyContextHref(pathname, {
      book: match.slug,
      chapter,
      source: 'history',
      year: context.year,
      entity: context.entity,
    }) + (chapter ? '#testo' : '#panoramica'),
    bookSlug: match.slug,
    chapter,
    endChapter,
    label: raw,
  };
}
