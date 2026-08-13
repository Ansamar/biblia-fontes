import Link from 'next/link';
import AppShell from '../../../src/components/AppShell';
import { client } from '../../../src/sanity/client';

const query = `*[_type == "libro"] | order(datazione.inizio asc){_id, titolo, categoriaId, datazione, mondoDietroIlTesto, mondoDelTesto}`;
function text(v:any, fallback='Non specificato'){ if(v==null)return fallback; if(typeof v==='string'||typeof v==='number')return String(v); if(Array.isArray(v))return v.map(x=>text(x,'')).filter(Boolean).join(' · ')||fallback; return v.etichetta||v.descrizione||v.nota||fallback; }
function slug(id:string){return id.replace(/^libro-/,'');}

export default async function GlobalChronologyPage(){
 const books = await client.fetch(query);
 return <AppShell><main><section className="border-b border-papyrus-line bg-paper-card/35"><div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-bronze">Strumento 01 · Tempo</p><h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">Cronologia del corpus</h1><p className="reading-text mt-6 max-w-3xl text-ink-soft">Tre piani da non confondere: il tempo rappresentato dal testo, i contesti storici pertinenti e la formazione letteraria. Le date restano intervalli critici, non coordinate assolute.</p></div></section><section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8"><div className="mb-6 grid gap-3 text-xs uppercase tracking-wider text-ink-faint md:grid-cols-[180px_1fr_1fr_1fr]"><span>Libro</span><span>Mondo del testo</span><span>Contesto</span><span>Formazione</span></div><div className="divide-y divide-papyrus-line border-y border-papyrus-line">{(books||[]).map((b:any)=><Link key={b._id} href={`/bibbia/${slug(b._id)}`} className="grid gap-3 py-5 hover:bg-paper-card/40 md:grid-cols-[180px_1fr_1fr_1fr] md:px-3"><strong className="font-serif text-xl">{b.titolo}</strong><span className="text-sm leading-6 text-ink-soft">{text(b.mondoDelTesto)}</span><span className="text-sm leading-6 text-ink-soft">{text(b.mondoDietroIlTesto)}</span><span className="text-sm leading-6 text-ink-soft">{text(b.datazione)}</span></Link>)}</div></section></main></AppShell>;
}
