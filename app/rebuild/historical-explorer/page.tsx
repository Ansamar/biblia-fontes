import WorkspaceFrame from '../../../src/ui-next/WorkspaceFrame';
import HistoryIndexSurface from '../../../src/ui-next/HistoryIndexSurface';
import { fetchHistoryIndexView } from '../../../src/data-access/history';

export default async function RebuiltHistoricalExplorerIndexPage() {
  const history = await fetchHistoryIndexView();
  return <WorkspaceFrame active="history"><HistoryIndexSurface history={history} /></WorkspaceFrame>;
}
