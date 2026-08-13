import AppShell from '../../../src/components/AppShell';
import SourcesModelsMap from '../../../src/components/SourcesModelsMap';
import { client } from '../../../src/sanity/client';

const query = `{
  "sources": *[_type == "fonteBiblica"] | order(sigla asc){_id, sigla, nome, descrizione, tipo, periodo, datazione, note},
  "usages": *[_type == "capitolo" && defined(attribuzioniFonti)]{
    _id, numero, titolo,
    "libro": libro->{_id, titolo, categoriaId},
    "sourceIds": attribuzioniFonti[].fonte._ref
  }
}`;

export default async function SourcesPage(){
 const data=await client.fetch(query);
 return <AppShell><main><section className="border-b border-papyrus-line bg-paper-card/35"><div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Strumento 02 · Composizione</p><h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">Mappa Fonti & modelli</h1><p className="reading-text mt-6 max-w-3xl text-ink-soft">Non un catalogo astratto di sigle: questa vista parte dai documenti <code>fonteBiblica</code> e mostra soltanto i collegamenti realmente presenti nelle attribuzioni dei capitoli. Seleziona un modello e attraversa direttamente il corpus.</p></div></section><section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14"><SourcesModelsMap sources={data?.sources||[]} usages={(data?.usages||[]).map((u:any)=>({...u,sourceIds:(u.sourceIds||[]).filter(Boolean)}))}/></section></main></AppShell>;
}
