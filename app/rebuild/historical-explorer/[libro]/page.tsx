import { notFound } from 'next/navigation';
import AppFrame from '../../../../src/ui-next/AppFrame';
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

  return <AppFrame><HistorySurface view={view} initialYear={initialYear} initialEntityId={rawEntity} /></AppFrame>;
}
