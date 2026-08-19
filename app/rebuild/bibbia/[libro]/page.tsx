import { notFound } from 'next/navigation';
import { fetchBookView } from '../../../../src/data-access/book';
import AppFrame from '../../../../src/ui-next/AppFrame';
import BookSurface from '../../../../src/ui-next/BookSurface';

export default async function RebuiltBookPage({ params }: { params: Promise<{ libro: string }> }) {
  const { libro } = await params;
  const book = await fetchBookView(libro);
  if (!book) notFound();

  return (
    <AppFrame>
      <BookSurface book={book} />
    </AppFrame>
  );
}
