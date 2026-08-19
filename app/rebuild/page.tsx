import AppFrame from '../../src/ui-next/AppFrame';
import HomeSurface from '../../src/ui-next/HomeSurface';
import { fetchCorpusView } from '../../src/data-access/corpus';

export default async function RebuildEntryPage() {
  const corpus = await fetchCorpusView();
  return <AppFrame><HomeSurface corpus={corpus} /></AppFrame>;
}
