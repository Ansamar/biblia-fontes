import { notFound } from 'next/navigation';
import { fetchBookView } from '../../../../src/data-access/book';
import WorkspaceFrame from '../../../../src/ui-next/WorkspaceFrame';
import BookSurface from '../../../../src/ui-next/BookSurface';

export default async function RebuiltBookPage({ params, searchParams }: { params: Promise<{ libro: string }>; searchParams: Promise<{view?: string}> }) {
  const { libro } = await params;
  const { view } = await searchParams;
  const book = await fetchBookView(libro);
  if (!book) notFound();
  const mode = view === 'study' ? 'study' : 'text';

  return <WorkspaceFrame context={{bookSlug: book.slug, bookTitle: book.title}} active={mode}><BookSurface book={book} mode={mode} /></WorkspaceFrame>;
}
