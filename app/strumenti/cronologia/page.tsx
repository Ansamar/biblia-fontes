import AppShell from '../../../src/components/AppShell';
import GlobalTimelineExplorer from '../../../src/components/GlobalTimelineExplorer';
import { client } from '../../../src/sanity/client';

const query = `*[_type == "libro"] | order(titolo asc){_id, titolo, categoriaId, datazione, mondoDietroIlTesto, mondoDelTesto}`;

export default async function GlobalChronologyPage(){
 const books = await client.fetch(query);
 return <AppShell><main><section className="border-b border-papyrus-line bg-paper-card/35"><div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Strumento 01 · Tempo</p><h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">Cronologia globale</h1><p className="reading-text mt-6 max-w-3xl text-ink-soft">Una vista trasversale del corpus che separa tre livelli: mondo rappresentato, contesto storico e formazione letteraria. Filtra per famiglia, cerca un libro e passa dalla timeline alle schede analitiche.</p></div></section><section className="mx-auto max-w-[1180px] px-5 py-10 md:px-8 md:py-14"><GlobalTimelineExplorer books={books||[]} /></section></main></AppShell>;
}
