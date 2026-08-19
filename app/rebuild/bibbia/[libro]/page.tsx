import { notFound } from 'next/navigation';
import { fetchBookView } from '../../../../src/data-access/book';
import WorkspaceFrame from '../../../../src/ui-next/WorkspaceFrame';
import BookSurface from '../../../../src/ui-next/BookSurface';

export default async function RebuiltBookPage({ params }: { params: Promise<{ libro: string }> }) {
  const { libro } = await params;
  const book = await fetchBookView(libro);
  if (!book) notFound();

  return <WorkspaceFrame context={{bookSlug: book.slug, bookTitle: book.title}} active="text"><BookSurface book={book} /></WorkspaceFrame>;
}
