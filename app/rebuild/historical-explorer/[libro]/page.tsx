import { notFound } from 'next/navigation';
import WorkspaceFrame from '../../../../src/ui-next/WorkspaceFrame';
import HistorySurface from '../../../../src/ui-next/HistorySurface';
import { fetchHistoryView } from '../../../../src/data-access/history';

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
  const parsedYear = rawYear !== undefined ? Number(rawYear) : undefined;
  const initialYear = parsedYear !== undefined && Number.isFinite(parsedYear) ? parsedYear : undefined;

  const view = await fetchHistoryView(libro);
  if (!view) notFound();

  return <WorkspaceFrame context={{bookSlug: view.slug, bookTitle: view.bookTitle}} active="history"><HistorySurface view={view} initialYear={initialYear} initialEntityId={rawEntity} /></WorkspaceFrame>;
}
