import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../../src/components/AppShell';
import UniversalChapterStudy from '../../../../src/components/UniversalChapterStudy';
import { client } from '../../../../src/sanity/client';
import { bookAbbreviation, bookIdFromSlug, categoryLabel } from '../../../../src/lib/bibleRouting';
import { textFixtureFor } from '../../../../src/data/textFixtures';

const query = `{
  "libro": *[_id == $bookId][0]{_id, titolo, categoriaId, capitoli, mondoDelTesto},
  "capitolo": *[_type == "capitolo" && libro._ref == $bookId && numero == $numero][0]{
    _id, numero, titolo, sintesi, struttura, eventiNarrati, datazione, analisiLetteraria,
    analisiStoricoCritica, tradizione, redazione, contestoStorico, testoCritico,
    attribuzioniFonti[]{..., "fonte": fonte->{_id, sigla, nome, titolo, categoria, descrizione}},
    bibliografia
  },
  "testoBiblico": *[_type == "testoBiblicoCapitolo" && libro._ref == $bookId && numero == $numero][0]{
    numero, numeroAlternativo, edizione, lingua, tradizione,
    versetti[]{
      numero,
      testo,
      metatesto,
      marcatoreAlfabetico,
      riferimentoAlternativo,
      statoTestuale,
      notaEditoriale
    }
  }
}`;

export default async function DynamicChapterPage({ params }: { params: Promise<{ libro: string; capitolo: string }> }) {
  const { libro: slug, capitolo } = await params;
  const numero = Number(capitolo);
  if (!Number.isInteger(numero) || numero < 1) notFound();

  const bookId = bookIdFromSlug(slug);
  const data = await client.fetch(query, { bookId, numero });
  if (!data?.libro || !data?.capitolo) notFound();

  const { libro, capitolo: chapter } = data;
  const total = libro.capitoli || numero;
  if (numero > total) notFound();
  const abbr = bookAbbreviation(slug, libro.titolo);
  const reference = `${abbr} ${numero}`;
  const category = categoryLabel(libro.categoriaId);
  const biblicalText = data.testoBiblico || textFixtureFor(slug, numero);

  return <AppShell><main className="mx-auto max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
    <nav className="text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link><span className="mx-2">/</span><span>{category}</span><span className="mx-2">/</span><Link href={`/bibbia/${slug}`} className="hover:text-bronze">{libro.titolo}</Link><span className="mx-2">/</span><span className="text-ink-soft">Capitolo {numero}</span></nav>

    <header className="mt-9"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">{libro.titolo} · Capitolo {numero}</p><h1 className="mt-3 font-serif text-5xl font-bold md:text-6xl">{chapter.titolo || `Capitolo ${numero}`}</h1></div><div className="flex gap-4 text-sm">{numero > 1 && <Link href={`/bibbia/${slug}/${numero-1}`} className="text-ink-soft hover:text-bronze">← {abbr} {numero-1}</Link>}{numero < total && <Link href={`/bibbia/${slug}/${numero+1}`} className="text-ink-soft hover:text-bronze">{abbr} {numero+1} →</Link>}</div></div></header>

    <UniversalChapterStudy chapter={chapter} reference={reference} worldNarratedLabel={chapter.eventiNarrati || libro.mondoDelTesto} biblicalText={biblicalText} />
  </main></AppShell>;
}
