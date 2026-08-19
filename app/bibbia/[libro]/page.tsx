import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import BookNavigator from '../../../src/components/BookNavigator';
import StudyContextNav from '../../../src/components/StudyContextNav';
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

function originalTitleProps(value?: string) {
  if (!value) return {};
  if (/[\u0590-\u05FF]/.test(value)) return { lang: 'he', dir: 'rtl' as const };
  if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(value)) return { lang: 'grc' };
  return {};
}

function familyLens(categoryId?: string, slug?: string) {
  if (categoryId === 'storici') return { title: 'Lente storico-letteraria', intro: 'Racconto, memoria, storiografia e redazione vengono distinti senza confondere l’evento narrato con la data di composizione.' };
  if (['sapienziali', 'sapienziali-poetici'].includes(categoryId || '')) return { title: 'Lente poetico-sapienziale', intro: 'Forma, voce, genere, raccolte e sviluppo della tradizione orientano la lettura dei testi poetici e sapienziali.' };
  if (['profetici', 'profeti'].includes(categoryId || '')) return { title: 'Lente profetica', intro: 'Contesto degli oracoli, raccolta, rielaborazione, macro-redazioni e trasmissione testuale restano piani distinti.' };
  if (categoryId === 'pentateuco') return { title: 'Lente compositiva', intro: 'Macro-unità, tradizioni, legislazione, redazione e forma finale vengono messe in relazione senza identificarle.' };
  if (categoryId === 'vangeli' && slug === 'giovanni') return { title: 'Lente giovannea', intro: 'Segni, discorsi, sviluppo narrativo e storia della tradizione sono distinti dalle ipotesi sulla formazione del Vangelo.' };
  if (categoryId === 'vangeli') return { title: 'Lente sinottica', intro: 'Tradizioni pre-evangeliche, forme, relazioni letterarie e lavoro redazionale vengono trattati con gradi di certezza espliciti.' };
  if (categoryId === 'atti' || slug === 'atti') return { title: 'Lente lucano-atti', intro: 'Narrazione, discorsi, itinerari, contesto storico, fonti e trasmissione testuale costituiscono livelli di analisi distinti.' };
  if (['paoline', 'lettere-paoline'].includes(categoryId || '')) return { title: 'Lente paolina', intro: 'Comunità, occasione, argomentazione e storia della composizione precedono la sintesi teologica.' };
  if (categoryId === 'ebrei' || slug === 'ebrei') return { title: 'Lente per Ebrei', intro: 'Genere, omiletica, uso della Scrittura e cristologia sacerdotale richiedono categorie proprie.' };
  if (['cattoliche', 'lettere-cattoliche'].includes(categoryId || '')) return { title: 'Lente delle Lettere Cattoliche', intro: 'Voce autoriale, destinatari, tradizioni e problemi di composizione vengono trattati per ciascun testo.' };
  if (['apocalittica', 'apocalisse'].includes(categoryId || '') || slug === 'apocalisse') return { title: 'Lente apocalittica', intro: 'Simboli e visioni sono situati nel contesto storico e nella rete intertestuale del libro.' };
  return { title: 'Lente di studio', intro: 'I dati del libro fanno emergere le categorie critiche pertinenti mantenendo una struttura comune.' };
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
  const macro = Array.isArray(libro.macroSezioni) ? libro.macroSezioni : [];
  const contextLabel = textFromUnknown(libro.mondoDietroIlTesto) || textFromUnknown(libro.mondoAttornoAlTesto) || 'Contesti storici pertinenti al libro';
  const originalProps = originalTitleProps(libro.titoloEbraico);
  const lens = familyLens(libro.categoriaId, slug);

  return <AppShell><main>
    <section id="panoramica" className="scroll-mt-36 border-b border-papyrus-line bg-paper-card/35">
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
        <nav className="mb-10 text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link><span className="mx-2">/</span><span>{category}</span><span className="mx-2">/</span><span className="text-ink-soft">{libro.titolo}</span></nav>
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">{category} · {libro.capitoli ?? capitoli.length} capitoli</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2"><h1 className="font-serif text-5xl font-bold leading-none md:text-7xl">{libro.titolo}</h1>{libro.titoloEbraico && <span {...originalProps} className="font-serif text-2xl text-seal md:text-3xl">{libro.titoloEbraico}</span>}</div>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">{textFromUnknown(libro.descrizione, 'Scheda introduttiva e percorso di studio del libro biblico.')}</p>
          </div>
          <div className="rounded-2xl border border-papyrus-line bg-papyrus/70 p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Quadro rapido</p>
            <dl className="mt-5 divide-y divide-papyrus-line text-sm"><div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Lingua</dt><dd className="text-ink">{textFromUnknown(libro.lingua, 'Da definire')}</dd></div><div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Genere</dt><dd className="text-ink">{textFromUnknown(libro.profiloLetterario?.generePrincipale, 'Profilo letterario disponibile nella scheda critica')}</dd></div><div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Formazione</dt><dd className="text-ink">{formationLabel}</dd></div><div className="grid grid-cols-[110px_1fr] gap-4 py-3"><dt className="text-ink-faint">Livelli</dt><dd className="text-ink">{levelsFromRedaction(libro.redazione)}</dd></div></dl>
          </div>
        </div>
      </div>
    </section>

    <StudyContextNav bookSlug={slug} bookTitle={libro.titolo} firstChapter={firstChapter} active="overview" historyAvailable />

    <BookNavigator bookSlug={slug} bookAbbreviation={abbr} chapters={capitoli} sections={macro} />

    <section id="studio" className="scroll-mt-36 border-t border-papyrus-line bg-paper-card/25">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Comprendere il libro</p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">{lens.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">{lens.intro}</p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-ink-soft">L’indice usa le macro-unità come orientamento di lettura; fonti, livelli compositivi e redazioni restano oggetto dello studio critico e non vengono trasformati automaticamente in divisioni del testo.</p>
        </div>
        <aside className="border-l border-papyrus-line pl-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Prospettive</p>
          <dl className="mt-5 space-y-5 text-sm">
            <div><dt className="font-semibold text-ink">Contesto</dt><dd className="mt-1 leading-6 text-ink-soft">{contextLabel}</dd></div>
            <div><dt className="font-semibold text-ink">Formazione</dt><dd className="mt-1 leading-6 text-ink-soft">{formationLabel}</dd></div>
            <div><dt className="font-semibold text-ink">Storia</dt><dd className="mt-1 leading-6 text-ink-soft">Historical Explorer interroga luoghi, culture, cronologie e relazioni intorno al testo.</dd></div>
          </dl>
          <Link href={`/historical-explorer/${slug}`} className="mt-6 inline-flex text-sm font-semibold text-bronze hover:underline">Esplora la storia →</Link>
        </aside>
      </div>
    </section>
  </main></AppShell>;
}
