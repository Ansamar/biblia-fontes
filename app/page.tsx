import { client } from '../src/sanity/client';
import AppShell from '../src/components/AppShell';
import StudyHome from '../src/components/StudyHome';
import type { Libro } from '../src/types';

const query = `*[_type == "libro"] | order(ordine asc, titolo asc) {
  "id": _id,
  titolo,
  titoloEbraico,
  categoriaId,
  ordine,
  capitoli,
  lingua
}`;

export default async function Home() {
  const libri: Libro[] = await client.fetch(query);

  return (
    <AppShell>
      <StudyHome libri={libri} />
    </AppShell>
  );
}
