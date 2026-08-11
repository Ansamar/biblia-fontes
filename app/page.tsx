import { client } from '../src/sanity/client';
import HomePage from '../src/components/HomePage';
import type { Libro } from '../src/types';

const query = `*[_type == "libro"] | order(ordine asc, titolo asc) {
  "id": _id,
  titolo,
  titoloEbraico,
  categoriaId,
  ordine,
  capitoli,
  lingua,
  
  // NUOVI CAMPI SCARICATI DA SANITY
  profiloLetterario,
  macroSezioni,
  
  datazione,
  descrizione,
  metodiAnalisi,
  mondoDietroIlTesto,
  eventiNarrati,
  mondoDelTesto,
  redazione[]{
    ..., 
    "fonte": fonte->{sigla, nome}
  },
  mondoAttornoAlTesto,
  contestoStorico
}`;

export default async function Home() {
  const libri: Libro[] = await client.fetch(query);

  return (
    <main>
      <HomePage initialLibri={libri} />
    </main>
  );
}