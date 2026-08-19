import { notFound } from 'next/navigation';
import WorkspaceFrame from '../../../../src/ui-next/WorkspaceFrame';
import HistorySurface from '../../../../src/ui-next/HistorySurface';
import { fetchHistoryView } from '../../../../src/data-access/history';
import { bookAbbreviation } from '../../../../src/lib/bibleRouting';

export default async function RebuiltHistoricalExplorerPage({
  params,
  searchParams,
}: {
  params: Promise<{ libro: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { libro } = await params;
  const query = await searchParams;
  const rawYear = Array.isArray(query.year) ? query.year[0] : query.year;
  const rawEntity = Array.isArray(query.entity) ? query.entity[0] : query.entity;
  const rawChapter = Array.isArray(query.chapter) ? query.chapter[0] : query.chapter;
  const parsedYear = rawYear !== undefined ? Number(rawYear) : undefined;
  const parsedChapter = rawChapter !== undefined ? Number(rawChapter) : undefined;
  const initialYear = parsedYear !== undefined && Number.isFinite(parsedYear) ? parsedYear : undefined;
  const chapter = parsedChapter !== undefined && Number.isInteger(parsedChapter) && parsedChapter > 0 ? parsedChapter : undefined;

  const view = await fetchHistoryView(libro);
  if (!view) notFound();
  const reference = chapter ? `${bookAbbreviation(view.slug, view.bookTitle)} ${chapter}` : undefined;

  return <WorkspaceFrame context={{bookSlug: view.slug, bookTitle: view.bookTitle, chapter, reference}} active="history"><HistorySurface view={view} initialYear={initialYear} initialEntityId={rawEntity} /></WorkspaceFrame>;
}
