import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import BookTimeline from '../../../src/components/BookTimeline';
import HistoricalExplorerOverlay from '../../../src/components/HistoricalExplorerOverlay';
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
    {capitoloInizio:12, capitoloFine:25, etichetta:'Abramo'},
    {capitoloInizio:26, capitoloFine:36, etichetta:'Isacco e Giacobbe'},
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
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/bibbia/genesi/1#testo" className="min-h-11 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-papyrus transition hover:opacity-90">Inizia dal capitolo 1 →</Link><a href="#timeline" className="min-h-11 rounded-full border border-papyrus-line px-5 py-3 text-sm text-ink-soft hover:border-bronze hover:text-bronze">Apri la Timeline</a></div>
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

    <section id="studio" className="scroll-mt-36 mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
      <div className="flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Architettura letteraria</p><h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Struttura del libro</h2></div><span className="hidden text-sm text-ink-faint md:block">4 grandi movimenti narrativi</span></div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {macro.map((m:any, i:number) => <div key={`${m.etichetta}-${i}`} className="rounded-xl border border-papyrus-line bg-paper-card p-5"><span className="font-mono text-xs text-bronze">{m.capitoloInizio}–{m.capitoloFine}</span><h3 className="mt-3 font-serif text-xl font-bold">{m.etichetta}</h3>{m.descrizione && <p className="mt-2 text-sm leading-6 text-ink-soft">{m.descrizione}</p>}</div>)}
      </div>
    </section>

    <section id="timeline" className="scroll-mt-36 border-y border-papyrus-line bg-paper-card/35">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Biblia Fontes Timeline</p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Il testo nel tempo</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-ink-soft">La Timeline orienta dentro Genesi: racconto, risonanze storiche e formazione del testo restano distinti. Quando la domanda diventa storica, Historical Explorer apre la storia intorno al testo senza perdere il contesto del libro.</p>
          </div>
          <HistoricalExplorerOverlay formationLabel={formationLabel} />
        </div>
        <BookTimeline
          formationLabel={formationLabel}
          worldNarratedLabel="Dalle origini e genealogie ai cicli patriarcali e alla discesa in Egitto: sequenza narrativa non forzata su una scala storica unica."
          contextLabel="Memorie, pratiche sociali e mondi culturali del Vicino Oriente antico da valutare criticamente caso per caso."
          note="La Timeline racconta il testo nel tempo. Historical Explorer interroga la storia attestata, ricostruita o discussa intorno al testo."
        />
      </div>
    </section>

    <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-6 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Navigazione</p><h2 className="mt-2 font-serif text-3xl font-bold">Capitoli</h2></div><span className="text-sm text-ink-faint">{capitoli?.length ?? 0} disponibili</span></div>
          <div className="divide-y divide-papyrus-line border-y border-papyrus-line">{(capitoli ?? []).map((c:any) => <Link key={c._id} href={`/bibbia/genesi/${c.numero}`} className="group grid min-h-16 grid-cols-[3.4rem_1fr_auto] items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"><span className="font-mono text-xs text-ink-faint">{String(c.numero).padStart(2,'0')}</span><span className="font-serif text-xl font-semibold group-hover:text-bronze">{c.titolo || `Capitolo ${c.numero}`}</span><span className="text-xs text-ink-faint">Gen {c.numero} →</span></Link>)}</div>
        </div>

        <aside className="h-fit rounded-2xl border border-papyrus-line bg-paper-card p-6 lg:sticky lg:top-36">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Come studiare Genesi</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">Tre profondità, più prospettive</h2>
          <div className="mt-6 space-y-5">
            <div><strong className="text-ink">Essenziale</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Sintesi, struttura e orientamento rapido.</p></div>
            <div><strong className="text-ink">Studio</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Contesto, tradizione e forma letteraria.</p></div>
            <div><strong className="text-ink">Critica</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Livelli compositivi, certezza, motivazioni e bibliografia.</p></div>
          </div>
          <Link href="/bibbia/genesi/1#testo" className="mt-7 inline-flex min-h-11 items-center rounded-full border border-bronze px-4 py-2 text-sm text-bronze hover:bg-bronze hover:text-papyrus">Apri Genesi 1 →</Link>
        </aside>
      </div>
    </section>
  </main></AppShell>;
}
