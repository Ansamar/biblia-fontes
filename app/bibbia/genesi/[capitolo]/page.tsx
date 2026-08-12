import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../../src/components/AppShell';
import ChapterStudy from '../../../../src/components/ChapterStudy';
import { client } from '../../../../src/sanity/client';

const query = `*[_type == "capitolo" && libro._ref == "libro-genesi" && numero == $numero][0]{
  _id, numero, titolo, sintesi, struttura, datazione, analisiLetteraria,
  analisiStoricoCritica, tradizione, redazione, contestoStorico, testoCritico,
  attribuzioniFonti[]{..., "fonte": fonte->{_id, sigla, nome, titolo, categoria, descrizione}},
  bibliografia
}`;

export default async function GenesisChapterPage({ params }: { params: Promise<{ capitolo: string }> }) {
  const { capitolo } = await params;
  const numero = Number(capitolo);
  if (!Number.isInteger(numero) || numero < 1 || numero > 50) notFound();
  const chapter = await client.fetch(query, { numero });
  if (!chapter) notFound();

  return <AppShell><main className="mx-auto max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
    <nav className="text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link><span className="mx-2">/</span><Link href="/bibbia/genesi" className="hover:text-bronze">Genesi</Link><span className="mx-2">/</span><span className="text-ink-soft">Capitolo {numero}</span></nav>
    <header className="mt-9"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Genesi · Capitolo {numero}</p><h1 className="mt-3 font-serif text-5xl font-bold md:text-6xl">{chapter.titolo || `Capitolo ${numero}`}</h1></div><div className="flex gap-3 text-sm">{numero > 1 && <Link href={`/bibbia/genesi/${numero-1}`} className="text-ink-soft hover:text-bronze">← Gen {numero-1}</Link>}{numero < 50 && <Link href={`/bibbia/genesi/${numero+1}`} className="text-ink-soft hover:text-bronze">Gen {numero+1} →</Link>}</div></div></header>
    <ChapterStudy chapter={chapter} />
  </main></AppShell>;
}
