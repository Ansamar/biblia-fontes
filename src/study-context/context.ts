export type StudyContextSource = 'book' | 'chapter' | 'timeline' | 'history' | 'search' | 'source';

export type StudyContext = {
  book?: string;
  chapter?: number;
  source?: StudyContextSource;
  year?: number;
  entity?: string;
};

export function studyContextParams(context: StudyContext) {
  const params = new URLSearchParams();
  if (context.book) params.set('book', context.book);
  if (context.chapter !== undefined) params.set('chapter', String(context.chapter));
  if (context.source) params.set('source', context.source);
  if (context.year !== undefined) params.set('year', String(context.year));
  if (context.entity) params.set('entity', context.entity);
  return params;
}

export function studyContextHref(pathname: string, context: StudyContext) {
  const query = studyContextParams(context).toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function parseStudyContext(input: Record<string, string | string[] | undefined>): StudyContext {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const chapterRaw = first(input.chapter);
  const yearRaw = first(input.year);
  const sourceRaw = first(input.source);
  const allowedSources: StudyContextSource[] = ['book', 'chapter', 'timeline', 'history', 'search', 'source'];

  return {
    book: first(input.book),
    chapter: chapterRaw !== undefined && Number.isFinite(Number(chapterRaw)) ? Number(chapterRaw) : undefined,
    source: allowedSources.includes(sourceRaw as StudyContextSource) ? sourceRaw as StudyContextSource : undefined,
    year: yearRaw !== undefined && Number.isFinite(Number(yearRaw)) ? Number(yearRaw) : undefined,
    entity: first(input.entity),
  };
}
