import WorkspaceFrame from '../../src/ui-next/WorkspaceFrame';
import HomeSurface from '../../src/ui-next/HomeSurface';
import { fetchCorpusView } from '../../src/data-access/corpus';

export default async function RebuildEntryPage() {
  const corpus = await fetchCorpusView();
  return <WorkspaceFrame><HomeSurface corpus={corpus} /></WorkspaceFrame>;
}
