import { notFound } from 'next/navigation';
import AppFrame from '../../../../../src/ui-next/AppFrame';
import ChapterSurface from '../../../../../src/ui-next/ChapterSurface';
import { fetchChapterView } from '../../../../../src/data-access/chapter';

export default async function RebuiltChapterPage({ params }: { params: Promise<{ libro: string; capitolo: string }> }) {
  const { libro, capitolo } = await params;
  const numero = Number(capitolo);
  if (!Number.isInteger(numero) || numero < 1) notFound();

  const chapter = await fetchChapterView(libro, numero);
  if (!chapter) notFound();

  return <AppFrame><ChapterSurface chapter={chapter} /></AppFrame>;
}
