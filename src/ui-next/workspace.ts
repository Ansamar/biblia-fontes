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

export function bookHref(bookSlug: string, routePrefix = '/rebuild') {
  return `${routePrefix}/bibbia/${bookSlug}`;
}

export function chapterHref(bookSlug: string, chapter: number, routePrefix = '/rebuild') {
  return `${bookHref(bookSlug, routePrefix)}/${chapter}`;
}

export function historyHref(context: WorkspaceContext, routePrefix = '/rebuild') {
  if (!context.bookSlug) return `${routePrefix}/historical-explorer`;
  const params = new URLSearchParams();
  if (context.chapter) params.set('chapter', String(context.chapter));
  if (context.year !== undefined) params.set('year', String(context.year));
  if (context.entityId) params.set('entity', context.entityId);
  const query = params.toString();
  return `${routePrefix}/historical-explorer/${context.bookSlug}${query ? `?${query}` : ''}`;
}

export function perspectiveHref(context: WorkspaceContext, perspective: WorkspacePerspective, routePrefix = '/rebuild') {
  const base = context.bookSlug ? (context.chapter ? chapterHref(context.bookSlug, context.chapter, routePrefix) : bookHref(context.bookSlug, routePrefix)) : routePrefix || '/';
  if (perspective === 'text') return base;
  if (perspective === 'study') return `${base}?view=study`;
  if (perspective === 'sources') return `${base}?view=sources`;
  return historyHref(context, routePrefix);
}
