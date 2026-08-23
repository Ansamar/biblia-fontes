'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ChapterView } from '../data-access/chapter';
import WorkspaceReader from './WorkspaceReader';
import { bfrgGenesisPilot, claimModeLabels, confidenceLabels, familyLabels, type BfrgPilotRelation } from './bfrgGenesisPilot';

type Dimension = 'scrittura' | 'mondo' | 'umanita' | 'tradizione' | 'ricezione';

const labels: Record<Dimension, string> = {scrittura:'Scrittura',mondo:'Mondo',umanita:'Umanità',tradizione:'Tradizione',ricezione:'Ricezione'};
const intros: Record<Dimension, string> = {
  scrittura:'Il testo e i testimoni attraverso cui può essere letto e confrontato.',
  mondo:'Storia, società, culture e geografie che aiutano a collocare il capitolo.',
  umanita:'L’esperienza umana che il racconto, la poesia, la profezia o l’argomentazione mettono in questione.',
  tradizione:'Formazione, redazione, fonti e interpretazione storico-critica del testo.',
  ricezione:'La vita successiva del testo nella Scrittura e nella tradizione cristiana, distinta dal suo contesto originario.',
};

function firstSourceLabel(chapter: ChapterView) { const first = chapter.sourceLayers?.[0] as any; return first?.fonte?.sigla || first?.fonte?.nome || ''; }
function verseCount(chapter: ChapterView) { const text:any = chapter.biblicalText; return Array.isArray(text?.versetti) ? text.versetti.length : 0; }
function witnessCount(chapter: ChapterView) { const text:any = chapter.biblicalText; return Array.isArray(text?.witnesses) ? text.witnesses.length : text ? 1 : 0; }

function relationDimension(relation: BfrgPilotRelation): Dimension {
  if (relation.family === 'HUMANITY') return 'umanita';
  if (relation.family === 'WORLD' || relation.family === 'CULTURE') return 'mondo';
  if (relation.family === 'TRADITION') return 'tradizione';
  return 'ricezione';
}

export default function ChapterKnowledgeSurface({ chapter }: { chapter: ChapterView }) {
  const [active, setActive] = useState<Dimension>('scrittura');
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null);
  const sourceLabel = useMemo(() => firstSourceLabel(chapter), [chapter]);
  const verses = verseCount(chapter);
  const witnesses = witnessCount(chapter);
  const chapterRelations = useMemo(() => chapter.slug === 'genesi' && chapter.number <= 11 ? bfrgGenesisPilot.filter(r => r.chapter === chapter.number) : [], [chapter.slug, chapter.number]);
  const selectedRelation = chapterRelations.find(r => r.id === selectedRelationId) || chapterRelations[0] || null;

  const relations: Array<{label:string;dimension:Dimension}> = [
    ...(chapter.context ? [{label:'Mondo storico-culturale',dimension:'mondo' as Dimension}] : []),
    ...chapterRelations.slice(0,4).map(r => ({label:r.target,dimension:relationDimension(r)})),
    ...(sourceLabel ? [{label:sourceLabel,dimension:'tradizione' as Dimension}] : []),
    ...(chapter.formation || chapter.critical ? [{label:'Formazione del testo',dimension:'tradizione' as Dimension}] : []),
    ...(witnesses ? [{label:`${witnesses} ${witnesses===1?'testimone':'testimoni'}`,dimension:'scrittura' as Dimension}] : []),
  ];

  return <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
    <header className="border-b border-papyrus-line pb-7">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-bronze">{chapter.bookTitle}</p>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-5xl font-semibold leading-none md:text-6xl"><span className="text-bronze">{chapter.number}</span><span className="mx-3 text-papyrus-line">·</span>{chapter.title}</h1>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">{chapter.bookTitle} {chapter.number}{verses ? ` · ${verses} versetti` : ''}</p>
        </div>
        <Link href={`/rebuild/bibbia/${chapter.slug}`} className="text-xs font-semibold text-bronze hover:text-ink">Indice di {chapter.bookTitle} →</Link>
      </div>
      <p className="mt-6 max-w-4xl font-serif text-xl leading-8 text-ink-soft">{chapter.summary}</p>
      {relations.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{relations.map(item => <button key={`${item.dimension}-${item.label}`} type="button" onClick={() => setActive(item.dimension)} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition hover:border-bronze hover:text-ink ${active===item.dimension?'border-bronze text-ink':'border-papyrus-line text-ink-faint'}`}>{item.label}</button>)}</div>}
    </header>

    <nav className="sticky top-14 z-40 -mx-4 mb-8 flex overflow-x-auto border-b border-papyrus-line bg-papyrus/95 px-4 backdrop-blur md:-mx-6 md:px-6">
      {(Object.keys(labels) as Dimension[]).map(d => <button key={d} type="button" onClick={() => setActive(d)} className={`h-12 shrink-0 border-b-2 px-4 text-xs font-semibold ${active===d?'border-bronze text-ink':'border-transparent text-ink-faint hover:text-ink'}`}>{labels[d]}</button>)}
    </nav>

    {chapterRelations.length > 0 && <section className="mb-10 border-y border-papyrus-line py-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Relazioni curate · BFRG</p><h2 className="mt-1 font-serif text-3xl font-semibold">Esplora ciò che questo capitolo mette in relazione</h2></div>
        <p className="max-w-xl text-xs leading-5 text-ink-faint">Ogni relazione è una micro-tesi: distingue dato testuale, interpretazione, confronto culturale e rilettura canonica.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.55fr)]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {chapterRelations.map(r => <button key={r.id} type="button" onClick={() => {setSelectedRelationId(r.id); setActive(relationDimension(r));}} className={`min-h-28 border p-4 text-left transition ${selectedRelation?.id===r.id?'border-bronze bg-white/25':'border-papyrus-line hover:border-bronze/60'}`}>
            <div className="flex items-center justify-between gap-3"><span className="font-mono text-[9px] text-bronze">{r.source}</span><span className="text-[9px] uppercase tracking-[0.12em] text-ink-faint">{familyLabels[r.family]}</span></div>
            <div className="mt-3 font-serif text-lg font-semibold leading-5">{r.target}</div>
            <div className="mt-2 text-[10px] text-ink-faint">{r.predicate.replaceAll('_',' ')}</div>
          </button>)}
        </div>
        {selectedRelation && <aside className="border border-bronze/40 p-5">
          <div className="flex flex-wrap gap-2"><span className="rounded-full border border-papyrus-line px-2 py-1 text-[9px] uppercase tracking-[0.12em]">{claimModeLabels[selectedRelation.claimMode]}</span><span className="rounded-full border border-papyrus-line px-2 py-1 text-[9px] uppercase tracking-[0.12em]">{confidenceLabels[selectedRelation.confidence]}</span></div>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">{selectedRelation.source} · {selectedRelation.predicate.replaceAll('_',' ')}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold">{selectedRelation.target}</h3>
          <p className="mt-4 text-sm leading-7 text-ink-soft">{selectedRelation.thesis}</p>
          {selectedRelation.claimMode==='comparative' && <p className="mt-5 border-l-2 border-bronze/40 pl-3 text-xs leading-5 text-ink-faint"><strong className="text-ink-soft">Cautela metodologica.</strong> Il confronto culturale non implica dipendenza diretta né identifica automaticamente una fonte.</p>}
          {selectedRelation.claimMode==='canonical' && <p className="mt-5 border-l-2 border-bronze/40 pl-3 text-xs leading-5 text-ink-faint"><strong className="text-ink-soft">Livello canonico.</strong> Questa relazione descrive una rilettura interna alla Scrittura, distinta dalla ricostruzione storico-critica del testo di Genesi.</p>}
        </aside>}
      </div>
    </section>}

    <section className="mb-10 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <article className="border border-papyrus-line p-5 md:p-7">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">{labels[active]}</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold">{intros[active]}</h2>
        {active==='scrittura' && <div className="mt-5 text-sm leading-7 text-ink-soft"><p>{witnesses ? `Il corpus mette a disposizione ${witnesses} ${witnesses===1?'testimone':'testimoni'} per questo capitolo.` : 'Il testo biblico non è ancora collegato a questo capitolo.'}</p><p className="mt-3">Il Reader mantiene separata la lettura continua dal confronto testuale.</p></div>}
        {active==='mondo' && <div className="mt-5 text-sm leading-7 text-ink-soft">{chapter.context ? <p>{chapter.context}</p> : <p className="text-ink-faint">Il dataset non contiene ancora un contesto storico-culturale strutturato per questo capitolo.</p>}<Link href={`/rebuild/historical-explorer/${chapter.slug}?chapter=${chapter.number}`} className="mt-4 inline-flex font-semibold text-bronze hover:text-ink">Apri il mondo storico e geografico →</Link></div>}
        {active==='umanita' && <div className="mt-5 text-sm leading-7 text-ink-soft"><p>{chapter.summary}</p>{chapter.structure && <div className="mt-5 border-l-2 border-bronze/35 pl-4"><strong className="font-serif text-lg text-ink">Come il capitolo costruisce l’esperienza</strong><p className="mt-1">{chapter.structure}</p></div>}</div>}
        {active==='tradizione' && <div className="mt-5"><p className="text-sm leading-7 text-ink-soft">{chapter.formation || chapter.critical || 'La formazione del testo non è ancora strutturata per questo capitolo.'}</p>{chapter.sourceLayers.length>0 && <div className="mt-5 divide-y divide-papyrus-line border-y border-papyrus-line">{chapter.sourceLayers.map((layer:any,index:number) => <article key={layer?._key||index} className="py-4"><div className="flex items-baseline justify-between gap-4"><strong className="font-serif text-lg">{layer?.fonte?.sigla || layer?.fonte?.nome || 'Livello critico'}</strong></div><p className="mt-2 text-sm leading-6 text-ink-soft">{layer?.descrizione || layer?.motivazione || layer?.fonte?.descrizione || 'Attribuzione registrata nel modello critico.'}</p></article>)}</div>}</div>}
        {active==='ricezione' && <div className="mt-5 text-sm leading-7 text-ink-soft"><p>Le riletture canoniche sono mostrate come relazioni esplicite e separate dalla ricostruzione storica.</p></div>}
      </article>
      <aside className="border-y border-papyrus-line py-5 xl:border xl:p-5"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">Orientamento</p><h3 className="mt-2 font-serif text-xl font-semibold">Che cosa sto guardando?</h3><p className="mt-3 text-sm leading-6 text-ink-soft"><strong>{chapter.bookTitle} {chapter.number}</strong>, osservato come Scrittura, realtà storico-culturale, esperienza umana, tradizione trasmessa e testo ricevuto.</p></aside>
    </section>

    <section id="scrittura" className="border-t border-papyrus-line pt-7"><div className="mb-6"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">Scrittura</p><h2 className="mt-1 font-serif text-3xl font-semibold">Leggere e confrontare</h2></div>{chapter.biblicalText ? <WorkspaceReader text={chapter.biblicalText} /> : <div className="border-y border-papyrus-line py-16 text-center text-sm text-ink-faint">Il testo biblico non è ancora collegato a questo capitolo.</div>}</section>
  </main>;
}
