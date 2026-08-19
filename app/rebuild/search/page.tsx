import WorkspaceFrame from '../../../src/ui-next/WorkspaceFrame';
import SearchSurface from '../../../src/ui-next/SearchSurface';
import { searchCorpus } from '../../../src/data-access/search';

export default async function RebuildSearchPage({ searchParams }: { searchParams: Promise<{q?: string}> }) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const results = await searchCorpus(term);
  return <WorkspaceFrame><SearchSurface term={term} results={results} /></WorkspaceFrame>;
}
