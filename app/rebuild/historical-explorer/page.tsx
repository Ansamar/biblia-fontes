import AppFrame from '../../../src/ui-next/AppFrame';
import HistoryIndexSurface from '../../../src/ui-next/HistoryIndexSurface';
import { fetchCorpusView } from '../../../src/data-access/corpus';

export default async function RebuiltHistoricalExplorerIndexPage() {
  const corpus = await fetchCorpusView();
  return <AppFrame><HistoryIndexSurface corpus={corpus} /></AppFrame>;
}
