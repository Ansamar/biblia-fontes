import { notFound } from 'next/navigation';
import AppFrame from '../../../../src/ui-next/AppFrame';
import HistorySurface from '../../../../src/ui-next/HistorySurface';
import { fetchHistoryView } from '../../../../src/data-access/history';

export default async function RebuiltHistoricalExplorerPage({ params }: { params: Promise<{ libro: string }> }) {
  const { libro } = await params;
  const view = await fetchHistoryView(libro);
  if (!view) notFound();
  return <AppFrame><HistorySurface view={view} /></AppFrame>;
}
