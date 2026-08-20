import WorkspaceFrame from '../../src/ui-next/WorkspaceFrame';
import HistoryHubSurface from '../../src/ui-next/HistoryHubSurface';
import { fetchHistoryIndexView } from '../../src/data-access/history';

export default async function HistoricalExplorerLanding() {
  const history = await fetchHistoryIndexView();
  return (
    <WorkspaceFrame active="history">
      <HistoryHubSurface history={history} basePath="/historical-explorer" corpusPath="/" />
    </WorkspaceFrame>
  );
}
