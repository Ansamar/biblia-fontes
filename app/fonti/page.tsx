import AppShell from '../../src/components/AppShell';
import SourcesModelsMap from '../../src/components/SourcesModelsMap';
import { client } from '../../src/sanity/client';

const query = `{
  "sources": *[_type == "fonteBiblica"] | order(sigla asc){_id, sigla, nome, descrizione, tipo, periodo, datazione, note},
  "usages": *[_type == "capitolo" && defined(attribuzioniFonti)]{
    _id, numero, titolo,
    "libro": libro->{_id, titolo, categoriaId},
    "sourceIds": attribuzioniFonti[].fonte._ref
  }
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
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[.95] md:text-7xl">Fonti, tradizioni e modelli.</h1>
            <p className="reading-text mt-7 max-w-3xl text-ink-soft">Un indice trasversale dei modelli critici realmente collegati al corpus. Le fonti non sono uno strumento separato dal testo: da qui si attraversano libri e capitoli, mentre nelle schede di studio riappaiono nel loro contesto.</p>
          </div>
        </section>
        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14">
          <SourcesModelsMap sources={data?.sources || []} usages={usages} />
        </section>
      </main>
    </AppShell>
  );
}
