import Link from 'next/link';
import AppShell from '../../src/components/AppShell';
import { canonicalHistoricalBookSlug } from '../../src/lib/historicalRouting';
import { italianizeVisibleCopy } from '../../src/lib/italianUi';
import { client } from '../../src/sanity/client';

const fieldsQuery = `*[_type == "historicalExplorerDataset"]{
  _id,
  id,
  title,
  subtitle,
  "bookRef": bookRef._ref,
  "book": bookRef->{_id,titolo,categoriaId,ordine},
  "entities": count(entities),
  "areas": count(areas),
  "scenarios": count(scenarios)
}`;

function slugFromField(field: any) {
  const bookId = field?.book?._id || field?.bookRef;
  if (typeof bookId === 'string' && bookId.startsWith('libro-')) return canonicalHistoricalBookSlug(bookId);
  if (typeof field?.id === 'string') return canonicalHistoricalBookSlug(field.id);
  return '';
}

export default async function HistoricalExplorerLanding() {
  const raw = await client.fetch(fieldsQuery).catch(() => []);
  const fields = (Array.isArray(raw) ? raw : [])
    .map((field: any) => ({ ...field, bookSlug: slugFromField(field) }))
    .filter((field: any) => field.bookSlug)
    .sort((a: any, b: any) => {
      const ao = Number.isFinite(a?.book?.ordine) ? a.book.ordine : 999;
      const bo = Number.isFinite(b?.book?.ordine) ? b.book.ordine : 999;
      return ao - bo || String(a?.book?.titolo || a?.title || '').localeCompare(String(b?.book?.titolo || b?.title || ''), 'it');
    });

  return (
    <AppShell>
      <main>
        <section className="border-b border-papyrus-line bg-paper-card/35">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Esploratore storico di Biblia Fontes</p>
            <h1 className="mt-4 max-w-5xl font-serif text-5xl font-bold leading-[.95] md:text-7xl">Interroga la storia intorno al testo.</h1>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">Tempo, spazio, popoli, poteri, eventi, culture e processi di formazione vengono esplorati come relazioni storiche, distinguendo dati attestati, ricostruzioni, ipotesi e memorie. Il testo biblico resta collegato, ma non viene trasformato automaticamente in cronaca storica.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Campi storici disponibili</p>
                  <h2 className="mt-2 font-serif text-3xl font-bold">Esplora per libro</h2>
                </div>
                <span className="text-xs text-ink-faint">{fields.length} libri collegati</span>
              </div>

              {fields.length ? fields.map((field: any) => (
                <article key={field._id || field.id} className="rounded-2xl border border-papyrus-line bg-paper-card p-6 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-bronze">{italianizeVisibleCopy(field.book?.titolo || field.title)}</p>
                      <h3 className="mt-2 font-serif text-3xl font-bold">{italianizeVisibleCopy(field.title)}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-ink-faint">
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1">{field.entities} entità</span>
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1">{field.areas} aree</span>
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1">{field.scenarios} scenari</span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-3xl leading-7 text-ink-soft">{italianizeVisibleCopy(field.subtitle)}</p>
                  <Link href={`/historical-explorer/${field.bookSlug}`} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-papyrus hover:opacity-90">Apri l’esploratore storico →</Link>
                </article>
              )) : (
                <div className="rounded-2xl border border-papyrus-line bg-paper-card p-6 text-ink-soft">Nessun campo storico collegato ai libri è disponibile.</div>
              )}
            </div>

            <aside className="rounded-2xl border border-papyrus-line bg-papyrus/55 p-6 md:p-8 lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Come leggere questa sezione</p>
              <h2 className="mt-3 font-serif text-2xl font-bold">Il testo resta il punto di partenza.</h2>
              <p className="mt-4 leading-7 text-ink-soft">L’esploratore storico mette in relazione il libro biblico con cronologie, luoghi, culture, poteri ed eventi attestati o ricostruiti. Le relazioni sono presentate con il loro grado di certezza e non trasformano automaticamente la narrazione biblica in cronaca.</p>
              <p className="mt-5 border-t border-papyrus-line pt-5 text-sm leading-6 text-ink-faint">La struttura tecnica con cui questi contenuti sono conservati rimane invisibile all’utente: qui si navigano libri, periodi, entità e relazioni storiche.</p>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
