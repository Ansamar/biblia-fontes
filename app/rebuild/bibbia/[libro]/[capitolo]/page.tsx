import { notFound } from 'next/navigation';
import WorkspaceFrame from '../../../../../src/ui-next/WorkspaceFrame';
import ChapterKnowledgeSurface from '../../../../../src/ui-next/ChapterKnowledgeSurface';
import { fetchChapterView } from '../../../../../src/data-access/chapter';

export default async function RebuiltChapterPage({ params, searchParams }: { params: Promise<{ libro: string; capitolo: string }>; searchParams: Promise<{view?: string}> }) {
  const { libro, capitolo } = await params;
  const { view } = await searchParams;
  const numero = Number(capitolo);
  if (!Number.isInteger(numero) || numero < 1) notFound();

  const chapter = await fetchChapterView(libro, numero);
  if (!chapter) notFound();
  const active = view === 'sources' ? 'sources' : view === 'study' ? 'study' : 'text';

  return <WorkspaceFrame context={{bookSlug: chapter.slug, bookTitle: chapter.bookTitle, chapter: chapter.number, chapterTitle: chapter.title, reference: `${chapter.abbreviation} ${chapter.number}`}} active={active} knowledgeMode>
    <ChapterKnowledgeSurface key={active} chapter={chapter} initialView={active} />
  </WorkspaceFrame>;
}
