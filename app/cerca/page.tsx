import Link from 'next/link';
import AppShell from '../../src/components/AppShell';
import { client } from '../../src/sanity/client';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; intent?: string }> }) {
  const { q = '', intent = '' } = await searchParams;
  const term = q.trim();
  const compareIntent = intent === 'confronto';
  const results = term
    ? await client.fetch(
        `*[_type in ["libro","capitolo"] && (titolo match $term || descrizione match $term || sintesi match $term)] | order(_type asc, titolo asc)[0...60]{_id,_type,titolo,numero,"libroId":libro._ref,sintesi}`,
        { term: `*${term}*` },
      )
    : [];

  const href = (result: any) => {
    if (result._type === 'libro') return `/bibbia/${result._id.replace(/^libro-/, '')}`;
    const chapterPath = `/bibbia/${String(result.libroId || '').replace(/^libro-/, '')}/${result.numero}`;
    return compareIntent ? `${chapterPath}?mode=compare#testo` : chapterPath;
  };

  return (
    <AppShell>
      <main>
        <section className="border-b border-papyrus-line bg-paper-card/35">
          <div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Biblia Fontes · ricerca globale</p>
            <h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">{compareIntent ? 'Scegli il testo da confrontare.' : 'Cerca nel corpus.'}</h1>
            <p className="mt-5 max-w-2xl leading-7 text-ink-soft">{compareIntent ? 'Il confronto non è più uno strumento separato: scegli un capitolo e continua nel Reader, dove i testimoni disponibili possono essere letti, confrontati o aperti in sinossi.' : 'La ricerca attraversa libri e capitoli. Progressivamente includerà fonti, entità storiche, luoghi, persone e testimoni mantenendo il contesto di studio.'}</p>
            <form className="mt-8 flex gap-2">
              {compareIntent && <input type="hidden" name="intent" value="confronto" />}
              <label htmlFor="q" className="sr-only">Cerca nel corpus</label>
              <input id="q" name="q" defaultValue={term} placeholder={compareIntent ? 'es. Genesi 1, Isaia 6, Romani 8…' : 'es. alleanza, giustizia, creazione…'} className="min-h-12 flex-1 rounded-full border border-papyrus-line bg-papyrus px-5 text-ink outline-none focus:border-bronze" />
              <button className="rounded-full bg-ink px-6 font-semibold text-papyrus">Cerca</button>
            </form>
            {compareIntent && <p className="mt-3 text-sm text-ink-faint">Nei risultati di capitolo, “Apri in confronto” porta al Reader mantenendo l’intenzione di confronto.</p>}
          </div>
        </section>
        <section className="mx-auto max-w-[900px] px-5 py-10 md:px-8">
          {term && <p className="mb-5 text-sm text-ink-faint">{results.length} risultati per “{term}”</p>}
          <div className="divide-y divide-papyrus-line border-y border-papyrus-line">
            {results.map((result: any) => (
              <Link key={result._id} href={href(result)} className="block py-5 hover:bg-paper-card/40 md:px-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-bronze">{result._type === 'libro' ? 'Libro' : `Capitolo ${result.numero}`}</span>
                <div className="flex items-baseline justify-between gap-4"><h2 className="mt-1 font-serif text-2xl font-bold">{result.titolo || result._id}</h2>{compareIntent && result._type === 'capitolo' && <span className="shrink-0 text-xs font-semibold text-bronze">Apri in confronto →</span>}</div>
                {result.sintesi && <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{typeof result.sintesi === 'string' ? result.sintesi : ''}</p>}
              </Link>
            ))}
          </div>
          {term && !results.length && <p className="rounded-xl border border-papyrus-line p-6 text-ink-soft">Nessun risultato. Prova un termine più generale.</p>}
        </section>
      </main>
    </AppShell>
  );
}
