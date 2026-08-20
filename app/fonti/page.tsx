import AppShell from '../../src/components/AppShell';
import CorpusFormationOverview from '../../src/components/CorpusFormationOverview';
import SourcesModelsMap from '../../src/components/SourcesModelsMap';
import { client } from '../../src/sanity/client';

const query = `{
  "sources": *[_type == "fonteBiblica"] | order(sigla asc){_id, sigla, nome, descrizione, tipo, periodo, datazione, note},
  "usages": *[_type == "capitolo" && defined(attribuzioniFonti)]{
    _id, numero, titolo,
    "libro": libro->{_id, titolo, categoriaId},
    "sourceIds": attribuzioniFonti[].fonte._ref
  },
  "books": *[_type == "libro"]{_id, titolo, categoriaId, datazione}
}`;

export default async function SourcesPage() {
  const data = await client.fetch(query);
  const usages = (data?.usages || []).map((usage: any) => ({
    ...usage,
    sourceIds: (usage.sourceIds || []).filter(Boolean),
  }));

  return (
    <AppShell>
      <main>
        <section className="border-b border-papyrus-line bg-paper-card/35">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Biblia Fontes · apparato trasversale</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[.95] md:text-7xl">Fonti, tradizioni e formazione.</h1>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">Uno spazio per seguire la formazione letteraria dei testi, le tradizioni che li attraversano e i modelli proposti dalla ricerca critica. La ricostruzione dei contesti storici è sviluppata nell’Esploratore storico.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <SourcesModelsMap sources={data?.sources || []} usages={usages} />
        </section>

        <section id="formazione" className="scroll-mt-28 border-t border-papyrus-line bg-paper-card/35">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Cronologia della formazione</p>
            <h2 className="mt-3 max-w-4xl font-serif text-4xl font-bold md:text-5xl">Quando prendono forma i libri biblici?</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">Una lettura cronologica degli intervalli di composizione e redazione: dai nuclei più antichi alle forme letterarie più tarde. Le sovrapposizioni rendono visibile che la formazione del corpus è un processo lungo, stratificato e non lineare.</p>
            <div className="mt-8"><CorpusFormationOverview books={data?.books || []} /></div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
