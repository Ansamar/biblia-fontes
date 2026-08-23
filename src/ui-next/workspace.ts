export type WorkspacePerspective = 'text' | 'study' | 'history' | 'sources';

export type WorkspaceContext = {
  bookSlug?: string;
  bookTitle?: string;
  chapter?: number;
  chapterTitle?: string;
  reference?: string;
  year?: number;
  entityId?: string;
};

export function bookHref(bookSlug: string) {
  return `/bibbia/${bookSlug}`;
}

export function chapterHref(bookSlug: string, chapter: number) {
  return `${bookHref(bookSlug)}/${chapter}`;
}

export function historyHref(context: WorkspaceContext) {
  if (!context.bookSlug) return '/historical-explorer';
  const params = new URLSearchParams();
  if (context.chapter) params.set('chapter', String(context.chapter));
  if (context.year !== undefined) params.set('year', String(context.year));
  if (context.entityId) params.set('entity', context.entityId);
  const query = params.toString();
  return `/historical-explorer/${context.bookSlug}${query ? `?${query}` : ''}`;
}

export function perspectiveHref(context: WorkspaceContext, perspective: WorkspacePerspective) {
  const base = context.bookSlug ? (context.chapter ? chapterHref(context.bookSlug, context.chapter) : bookHref(context.bookSlug)) : '/';
  if (perspective === 'text') return base;
  if (perspective === 'study') return `${base}?view=study`;
  if (perspective === 'sources') return `${base}?view=sources`;
  return historyHref(context);
}
