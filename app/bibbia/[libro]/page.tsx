import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import BookTimeline from '../../../src/components/BookTimeline';
import { client } from '../../../src/sanity/client';
import { bookAbbreviation, bookIdFromSlug, categoryLabel } from '../../../src/lib/bibleRouting';

const query = `{
  "libro": *[_id == $bookId][0]{
    _id, titolo, titoloEbraico, categoriaId, capitoli, lingua, descrizione,
    mondoDietroIlTesto, mondoDelTesto, mondoAttornoAlTesto,
    profiloLetterario, macroSezioni, datazione,
    redazione[]{..., "fonte": fonte->{sigla, nome}}
  },
  "capitoli": *[_type == "capitolo" && libro._ref == $bookId] | order(numero asc){
    _id, numero, titolo, sintesi
  }
}`;

function textFromUnknown(value: any, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => textFromUnknown(item)).filter(Boolean).join(' · ') || fallback;
  if (typeof value === 'object') return value.descrizione || value.etichetta || value.titolo || value.nome || value.nota || fallback;
  return fallback;
}

function levelsFromRedaction(redazione: any) {
  if (!Array.isArray(redazione)) return textFromUnknown(redazione, 'Livelli e modelli critici disponibili nei singoli capitoli');
  const values = redazione.map((r) => r?.fonte?.sigla || r?.etichetta || textFromUnknown(r)).filter(Boolean);
  return values.length ? values.slice(0, 4).join(' · ') : 'Livelli e modelli critici disponibili nei singoli capitoli';
}

function formationFromDate(datazione: any) {
  if (!datazione) return 'Datazione e formazione discusse';
  if (typeof datazione === 'string' || typeof datazione === 'number') return String(datazione);
  return [datazione.etichettaInizio, datazione.etichettaFine].filter(Boolean).join(' — ') || datazione.etichetta || datazione.nota || (datazione.inizio || datazione.fine ? `${datazione.inizio ?? '…'} – ${datazione.fine ?? '…'}` : 'Datazione e formazione discusse');
}

function periodFromDate(datazione: any) {
  if (!datazione || typeof datazione !== 'object') return undefined;
  if (datazione.inizio || datazione.fine) return `Intervallo registrato nel dataset: ${datazione.inizio ?? '…'} – ${datazione.fine ?? '…'}`;
  return undefined;
}

function originalTitleProps(value?: string) {
  if (!value) return {};
  const hasHebrew = /[\u0590-\u05FF]/.test(value);
  const hasGreek = /[\u0370-\u03FF\u1F00-\u1FFF]/.test(value);
  if (hasHebrew) return { lang: 'he', dir: 'rtl' as const };
  if (hasGreek) return { lang: 'grc' };
  return {};
}

function familyLens(categoryId?: string) {
  if (categoryId === 'storici') return {
    title: 'Lente storico-letteraria',
    intro: 'Nei Libri Storici distinguiamo racconto, memoria, storiografia e redazione senza confondere l’evento narrato con la data di composizione.',
    items: ['Contesto politico e sociale', 'Memoria e tradizioni', 'D / Dtr quando pertinente', 'Fonti, redazioni e paralleli'],
  };
  if (['sapienziali', 'sapienziali-poetici'].includes(categoryId || '')) return {
    title: 'Lente poetico-sapienziale',
    intro: 'Nei Sapienziali e Poetici la lettura privilegia forma, voce, genere, raccolte e sviluppo della tradizione, senza ridurre poesia e sapienza a semplici contenitori dottrinali.',
    items: ['Genere e forma poetica', 'Voce parlante e situazione', 'Raccolte, sezioni e superscrizioni', 'Tradizione sapienziale e storia della formazione'],
  };
  if (categoryId === 'pentateuco') return {
    title: 'Lente compositiva',
    intro: 'Nel Pentateuco la lettura mette in relazione macro-unità, tradizioni, legislazione, redazione e forma finale.',
    items: ['Macro-unità letterarie', 'Tradizioni P / H / D e altre', 'Redazione pentateucale', 'Storia testuale'],
  };
  return {
    title: 'Lente di studio',
    intro: 'La pagina mantiene una struttura comune e lascia ai dati del libro il compito di far emergere le categorie critiche pertinenti.',
    items: ['Struttura', 'Contesto', 'Formazione', 'Testo e bibliografia'],
  };
}

export default async function DynamicBookPage({ params }: { params: Promise<{ libro: string }> }) {
  const { libro: slug } = await params;
  if (slug === 'genesi') notFound();
  const bookId = bookIdFromSlug(slug);
  const data = await client.fetch(query, { bookId });
  if (!data?.libro) notFound();

  const { libro } = data;
  const capitoli = Array.isArray(data.capitoli) ? data.capitoli : [];
  const category = categoryLabel(libro.categoriaId);
  const abbr = bookAbbreviation(slug, libro.titolo);
  const firstChapter = capitoli?.[0]?.numero || 1;
  const formationLabel = formationFromDate(libro.datazione);
  const periodLabel = periodFromDate(libro.datazione);
  const macro = Array.isArray(libro.macroSezioni) ? libro.macroSezioni : [];
  const worldLabel = textFromUnknown(libro.mondoDelTesto) || textFromUnknown(libro.profiloLetterario?.strutturaGenerale) || 'Periodo e mondo rappresentato dal testo';
  const contextLabel = textFromUnknown(libro.mondoDietroIlTesto) || textFromUnknown(libro.mondoAttornoAlTesto) || 'Contesti storici pertinenti al libro';
  const originalProps = originalTitleProps(libro.titoloEbraico);
  const lens = familyLens(libro.categoriaId);

  return <AppShell><main>
    <section className="border-b border-papyrus-line bg-paper-card/35">
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <nav className="mb-10 text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link><span className="mx-2">/</span><span>{category}</span><span className="mx-2">/</span><span className="text-ink-soft">{libro.titolo}</span></nav>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">{category} · {libro.capitoli ?? capitoli.length} capitoli</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2"><h1 className="font-serif text-5xl font-bold leading-none md:text-7xl">{libro.titolo}</h1>{libro.titoloEbraico && <span {...originalProps} className="font-serif text-2xl text-seal md:text-3xl">{libro.titoloEbraico}</span>}</div>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">{textFromUnknown(libro.descrizione, 'Scheda introduttiva e percorso di studio del libro biblico.')}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href={`/bibbia/${slug}/${firstChapter}`} className="min-h-11 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-papyrus transition hover:opacity-90">Inizia dal capitolo {firstChapter} →</Link><a href="#cronologia" className="min-h-11 rounded-full border border-papyrus-line px-5 py-3 text-sm text-ink-soft hover:border-bronze hover:text-bronze">Vedi la cronologia</a></div>
          </div>

          <div className="rounded-2xl border border-papyrus-line bg-papyrus/70 p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Quadro rapido</p>
            <dl className="mt-5 divide-y divide-papyrus-line text-sm">
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Lingua</dt><dd className="text-ink">{textFromUnknown(libro.lingua, 'Da definire')}</dd></div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Genere</dt><dd className="text-ink">{textFromUnknown(libro.profiloLetterario?.generePrincipale, 'Profilo letterario disponibile nella scheda critica')}</dd></div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Formazione</dt><dd className="text-ink">{formationLabel}</dd></div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Livelli</dt><dd className="text-ink">{levelsFromRedaction(libro.redazione)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    {macro.length > 0 && <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
      <div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Architettura letteraria</p><h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Struttura del libro</h2></div>
      <div className={`mt-8 grid gap-4 ${macro.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {macro.map((m:any, i:number) => <div key={`${m?.etichetta || m?.sigla || i}-${i}`} className="rounded-xl border border-papyrus-line bg-paper-card p-5"><span className="font-mono text-xs text-bronze">{m?.capitoloInizio ?? '…'}–{m?.capitoloFine ?? '…'}</span><h3 className="mt-3 font-serif text-xl font-bold">{m?.etichetta || m?.sigla || `Sezione ${i+1}`}</h3>{textFromUnknown(m?.descrizione) && <p className="mt-2 text-sm leading-6 text-ink-soft">{textFromUnknown(m.descrizione)}</p>}</div>)}
      </div>
    </section>}

    <section id="cronologia" className="border-y border-papyrus-line bg-paper-card/35">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16"><BookTimeline formationLabel={formationLabel} worldNarratedLabel={worldLabel} contextLabel={contextLabel} periodLabel={periodLabel} note={typeof libro.datazione === 'object' ? libro.datazione?.nota || formationLabel : formationLabel} /></div>
    </section>

    <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-6 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Navigazione</p><h2 className="mt-2 font-serif text-3xl font-bold">Capitoli</h2></div><span className="text-sm text-ink-faint">{capitoli.length} disponibili</span></div>
          <div className="divide-y divide-papyrus-line border-y border-papyrus-line">{capitoli.map((c:any) => <Link key={c._id} href={`/bibbia/${slug}/${c.numero}`} className="group grid min-h-16 grid-cols-[3.4rem_1fr_auto] items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"><span className="font-mono text-xs text-ink-faint">{String(c.numero).padStart(2,'0')}</span><span className="font-serif text-xl font-semibold group-hover:text-bronze">{c.titolo || `Capitolo ${c.numero}`}</span><span className="text-xs text-ink-faint">{abbr} {c.numero} →</span></Link>)}</div>
          {!capitoli.length && <p className="mt-5 rounded-xl border border-papyrus-line bg-paper-card/50 p-5 text-ink-soft">Nessun capitolo collegato a questo libro nel dataset corrente.</p>}
        </div>

        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-papyrus-line bg-paper-card p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">{lens.title}</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{lens.intro}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink">{lens.items.map((item) => <li key={item} className="flex gap-2"><span className="text-bronze" aria-hidden="true">—</span><span>{item}</span></li>)}</ul>
          </div>
          <div className="rounded-2xl border border-papyrus-line bg-paper-card p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Metodo di lettura</p>
            <h2 className="mt-2 font-serif text-2xl font-bold">Tre livelli, una sola pagina</h2>
            <div className="mt-6 space-y-5"><div><strong>Essenziale</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Sintesi e orientamento rapido.</p></div><div><strong>Studio</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Struttura, contesto e cronologia.</p></div><div><strong>Critica</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Livelli critici, motivazioni, testo e bibliografia.</p></div></div>
            {capitoli.length > 0 && <Link href={`/bibbia/${slug}/${firstChapter}`} className="mt-7 inline-flex min-h-11 items-center rounded-full border border-bronze px-4 py-2 text-sm text-bronze hover:bg-bronze hover:text-papyrus">Apri {abbr} {firstChapter} →</Link>}
          </div>
        </aside>
      </div>
    </section>
  </main></AppShell>;
}
