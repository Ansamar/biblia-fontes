import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import BookNavigator from '../../../src/components/BookNavigator';
import StudyContextNav from '../../../src/components/StudyContextNav';
import { client } from '../../../src/sanity/client';

const query = `{
  "libro": *[_id == "libro-genesi"][0]{
    _id, titolo, titoloEbraico, categoriaId, capitoli, lingua, descrizione,
    profiloLetterario, macroSezioni, datazione,
    redazione[]{..., "fonte": fonte->{sigla, nome}}
  },
  "capitoli": *[_type == "capitolo" && libro._ref == "libro-genesi"] | order(numero asc){
    _id, numero, titolo, sintesi
  }
}`;

export default async function GenesisPage() {
  const data = await client.fetch(query);
  if (!data?.libro) notFound();
  const { libro, capitoli } = data;
  const macro = libro.macroSezioni?.length ? libro.macroSezioni : [
    {capitoloInizio:1, capitoloFine:11, etichetta:'Storia delle origini'},
    {capitoloInizio:12, capitoloFine:25, etichetta:'Abramo e Sara'},
    {capitoloInizio:26, capitoloFine:36, etichetta:'Isacco, Giacobbe ed Esaù'},
    {capitoloInizio:37, capitoloFine:50, etichetta:'Giuseppe e la famiglia di Giacobbe'},
  ];
  const formationLabel = [libro.datazione?.etichettaInizio, libro.datazione?.etichettaFine].filter(Boolean).join(' — ') || 'Processo compositivo pluristratificato, con fasi e datazioni discusse.';

  return <AppShell><main>
    <section id="panoramica" className="scroll-mt-36 border-b border-papyrus-line bg-paper-card/35">
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <nav className="mb-10 text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link> <span className="mx-2">/</span> Pentateuco <span className="mx-2">/</span> <span className="text-ink-soft">Genesi</span></nav>
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Pentateuco · {libro.capitoli ?? 50} capitoli</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2"><h1 className="font-serif text-6xl font-bold leading-none md:text-7xl">{libro.titolo}</h1>{libro.titoloEbraico && <span lang="he" dir="rtl" className="font-serif text-2xl text-seal md:text-3xl">{libro.titoloEbraico}</span>}</div>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">{libro.descrizione || 'Dalle origini del mondo alle tradizioni patriarcali e alla discesa della famiglia di Giacobbe in Egitto.'}</p>
          </div>
          <div className="rounded-2xl border border-papyrus-line bg-papyrus/70 p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Quadro rapido</p>
            <dl className="mt-5 divide-y divide-papyrus-line text-sm">
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Lingua</dt><dd className="text-ink">{libro.lingua || 'Ebraico biblico'}</dd></div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Genere</dt><dd className="text-ink">{libro.profiloLetterario?.generePrincipale || 'Narrazione teologica e genealogica'}</dd></div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Formazione</dt><dd className="text-ink">{formationLabel}</dd></div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Livelli</dt><dd className="text-ink">P · tradizioni non sacerdotali · redazione pentateucale</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <StudyContextNav bookSlug="genesi" bookTitle={libro.titolo} firstChapter={1} active="overview" historyAvailable />

    <BookNavigator
      bookSlug="genesi"
      bookAbbreviation="Gen"
      chapters={capitoli ?? []}
      sections={macro}
    />

    <section id="studio" className="scroll-mt-36 border-t border-papyrus-line bg-paper-card/25">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Comprendere il libro</p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Genesi come testo</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">L’indice segue le grandi unità letterarie del libro e le usa come orientamento per la lettura. Le ipotesi su fonti, livelli compositivi e redazione restano invece materia dello Studio critico e non vengono confuse con la semplice navigazione.</p>
        </div>
        <aside className="border-l border-papyrus-line pl-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Prospettive</p>
          <dl className="mt-5 space-y-5 text-sm">
            <div><dt className="font-semibold text-ink">Formazione</dt><dd className="mt-1 leading-6 text-ink-soft">{formationLabel}</dd></div>
            <div><dt className="font-semibold text-ink">Studio</dt><dd className="mt-1 leading-6 text-ink-soft">Fonti, redazione, critica testuale e contesto nei singoli capitoli.</dd></div>
            <div><dt className="font-semibold text-ink">Storia</dt><dd className="mt-1 leading-6 text-ink-soft">Historical Explorer interroga luoghi, culture, cronologie e relazioni intorno al testo.</dd></div>
          </dl>
          <Link href="/historical-explorer/genesi" className="mt-6 inline-flex text-sm font-semibold text-bronze hover:underline">Esplora la storia di Genesi →</Link>
        </aside>
      </div>
    </section>
  </main></AppShell>;
}
