import AppFrame from '../../../src/ui-next/AppFrame';
import HistoryIndexSurface from '../../../src/ui-next/HistoryIndexSurface';
import { fetchHistoryIndexView } from '../../../src/data-access/history';

export default async function RebuiltHistoricalExplorerIndexPage() {
  const history = await fetchHistoryIndexView();
  return <AppFrame><HistoryIndexSurface history={history} /></AppFrame>;
}
