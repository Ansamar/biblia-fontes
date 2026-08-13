'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { categoryLabel } from '../lib/bibleRouting';

type Book = { _id:string; titolo:string; categoriaId?:string; datazione?:any; mondoDietroIlTesto?:any; mondoDelTesto?:any };
const text=(v:any,fallback='Non specificato'):string=>{if(v==null)return fallback;if(typeof v==='string'||typeof v==='number')return String(v);if(Array.isArray(v))return v.map(x=>text(x,'')).filter(Boolean).join(' · ')||fallback;if(typeof v==='object')return v.etichetta||v.descrizione||v.nota||[v.etichettaInizio,v.etichettaFine].filter(Boolean).join(' — ')||fallback;return fallback};
const slug=(id:string)=>id.replace(/^libro-/,'');
const numericRange=(d:any)=>{if(!d||typeof d!=='object')return null;const a=typeof d.inizio==='number'?d.inizio:null;const b=typeof d.fine==='number'?d.fine:null;if(a==null&&b==null)return null;return {start:a??b!,end:b??a!};};

export default function GlobalTimelineExplorer({books}:{books:Book[]}){
 const [category,setCategory]=useState('tutti'); const [query,setQuery]=useState(''); const [view,setView]=useState<'timeline'|'table'>('timeline');
 const categories=useMemo(()=>Array.from(new Set(books.map(b=>b.categoriaId).filter(Boolean) as string[])),[books]);
 const filtered=useMemo(()=>books.filter(b=>(category==='tutti'||b.categoriaId===category)&&(!query||b.titolo.toLowerCase().includes(query.toLowerCase()))),[books,category,query]);
 const extent=useMemo(()=>{const nums=filtered.flatMap(b=>{const r=numericRange(b.datazione);return r?[r.start,r.end]:[]});return nums.length?{min:Math.min(...nums),max:Math.max(...nums)}:null},[filtered]);
 const pos=(n:number)=>extent&&extent.max!==extent.min?((n-extent.min)/(extent.max-extent.min))*100:50;
 return <div>
  <div className="flex flex-col gap-4 rounded-2xl border border-papyrus-line bg-paper-card p-4 md:flex-row md:items-center md:justify-between">
   <div className="flex flex-wrap gap-2"><button onClick={()=>setCategory('tutti')} className={`rounded-full px-4 py-2 text-sm ${category==='tutti'?'bg-ink text-papyrus':'border border-papyrus-line text-ink-soft'}`}>Tutti</button>{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-4 py-2 text-sm ${category===c?'bg-ink text-papyrus':'border border-papyrus-line text-ink-soft'}`}>{categoryLabel(c)}</button>)}</div>
   <div className="flex gap-2"><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Filtra libri" placeholder="Filtra libri…" className="min-h-10 rounded-full border border-papyrus-line bg-papyrus px-4 text-sm outline-none focus:border-bronze"/><div className="flex rounded-full border border-papyrus-line p-1"><button onClick={()=>setView('timeline')} aria-pressed={view==='timeline'} className={`rounded-full px-3 py-1 text-xs ${view==='timeline'?'bg-ink text-papyrus':''}`}>Timeline</button><button onClick={()=>setView('table')} aria-pressed={view==='table'} className={`rounded-full px-3 py-1 text-xs ${view==='table'?'bg-ink text-papyrus':''}`}>Schede</button></div></div>
  </div>
  {view==='timeline'?<div className="mt-8">
   <div className="mb-4 rounded-xl border border-papyrus-line bg-paper-card/45 p-4 text-sm leading-6 text-ink-faint">Le fasce visualizzano soltanto gli intervalli numerici effettivamente registrati in Sanity. Quando un libro non possiede un intervallo strutturato, viene mostrato come scheda testuale senza inventare coordinate cronologiche.</div>
   <div className="space-y-3">{filtered.map(b=>{const r=numericRange(b.datazione);return <Link key={b._id} href={`/bibbia/${slug(b._id)}`} className="grid gap-3 rounded-xl border border-papyrus-line bg-paper-card/55 p-4 transition hover:border-bronze md:grid-cols-[170px_1fr]"><div><p className="font-serif text-xl font-bold">{b.titolo}</p><p className="mt-1 text-xs text-ink-faint">{categoryLabel(b.categoriaId)}</p></div><div>{r&&extent?<><div className="relative mt-2 h-7 rounded-full bg-papyrus-deep/60"><span className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-bronze" style={{left:`${Math.min(pos(r.start),pos(r.end))}%`,width:`${Math.max(2,Math.abs(pos(r.end)-pos(r.start)))}%`}}/><span className="absolute inset-y-0 border-l border-ink-faint/30" style={{left:`${pos(r.start)}%`}}/></div><p className="mt-2 text-xs text-ink-faint">{text(b.datazione)}</p></>:<div className="rounded-lg border border-dashed border-papyrus-line px-4 py-3 text-sm text-ink-faint">{text(b.datazione,'Intervallo strutturato non disponibile')}</div>}</div></Link>})}</div>
  </div>:<div className="mt-8 divide-y divide-papyrus-line border-y border-papyrus-line">{filtered.map(b=><Link key={b._id} href={`/bibbia/${slug(b._id)}`} className="grid gap-3 py-5 hover:bg-paper-card/40 md:grid-cols-[170px_1fr_1fr_1fr] md:px-3"><strong className="font-serif text-xl">{b.titolo}</strong><span className="text-sm leading-6 text-ink-soft">{text(b.mondoDelTesto)}</span><span className="text-sm leading-6 text-ink-soft">{text(b.mondoDietroIlTesto)}</span><span className="text-sm leading-6 text-ink-soft">{text(b.datazione)}</span></Link>)}</div>}
  <p className="mt-5 text-sm text-ink-faint">{filtered.length} libri visualizzati.</p>
 </div>
}
