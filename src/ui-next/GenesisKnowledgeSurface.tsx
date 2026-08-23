'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ChapterView } from '../data-access/chapter';
import WorkspaceReader from './WorkspaceReader';

type Dimension = 'scrittura' | 'mondo' | 'umanita' | 'tradizione' | 'ricezione';

const dimensionLabels: Record<Dimension, string> = {
  scrittura: 'Scrittura',
  mondo: 'Mondo',
  umanita: 'Umanità',
  tradizione: 'Tradizione',
  ricezione: 'Ricezione',
};

const dimensionIntro: Record<Dimension, string> = {
  scrittura: 'Che cosa dice il testo, come è costruito e quali testimoni permettono di leggerne la trasmissione.',
  mondo: 'Il testo prende forma dentro una storia concreta: popoli, culture, società, geografie e immagini del cosmo.',
  umanita: 'Le domande che il racconto apre sulla condizione umana: limite, responsabilità, relazione, lavoro e custodia.',
  tradizione: 'Come il testo è stato composto, trasmesso e interpretato dalla ricerca storico-critica.',
  ricezione: 'Come il racconto continua nella Scrittura e nella tradizione cristiana, distinguendo ricezione da ricostruzione storica.',
};

function relationTone(dimension: Dimension) {
  if (dimension === 'scrittura') return 'border-bronze/40 bg-bronze/5';
  return 'border-papyrus-line bg-transparent';
}

export default function GenesisKnowledgeSurface({ chapter }: { chapter: ChapterView }) {
  const [active, setActive] = useState<Dimension>('scrittura');
  const reference = `${chapter.bookTitle} ${chapter.number}`;
  const verseCount = chapter.biblicalText?.versetti?.length || 0;
  const sourceLabel = useMemo(() => {
    const first = chapter.sourceLayers?.[0] as any;
    return first?.fonte?.sigla || first?.fonte?.nome || 'Formazione discussa';
  }, [chapter.sourceLayers]);

  const relations: Array<{label: string; dimension: Dimension}> = [
    { label: 'Creazione', dimension: 'umanita' },
    { label: 'Ordine', dimension: 'umanita' },
    { label: 'Immagine di Dio', dimension: 'umanita' },
    { label: 'Vicino Oriente antico', dimension: 'mondo' },
    { label: sourceLabel, dimension: 'tradizione' },
    { label: 'MT · LXX · Vulgata', dimension: 'scrittura' },
    { label: 'Ricezione cristiana', dimension: 'ricezione' },
  ];

  return <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
    <header className="border-b border-papyrus-line pb-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <Link href={`/rebuild/bibbia/${chapter.slug}`} className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-bronze hover:text-ink">{chapter.bookTitle}</Link>
          <div className="mt-3 flex items-start gap-5 md:gap-7">
            <span className="font-serif text-7xl font-semibold leading-none text-bronze md:text-8xl" aria-hidden="true">{chapter.number}</span>
            <div className="min-w-0 pt-1">
              <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">{chapter.title}</h1>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">{reference}{verseCount ? ` · ${verseCount} versetti` : ''}</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl font-serif text-xl leading-8 text-ink-soft">Creazione · ordine · essere umano · responsabilità</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-soft">{chapter.summary}</p>
        </div>
        <div className="border-l border-papyrus-line pl-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">Come leggere questo capitolo</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">Scrittura, mondo, umanità, tradizione e ricezione sono cinque accessi allo stesso <strong className="font-semibold text-ink">{reference}</strong>.</p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2" aria-label={`Relazioni principali di ${reference}`}>
        {relations.map((item) => <button key={`${item.dimension}-${item.label}`} type="button" onClick={() => setActive(item.dimension)} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition hover:border-bronze hover:text-ink ${active === item.dimension ? 'border-bronze text-ink' : 'border-papyrus-line text-ink-faint'}`}>{item.label}</button>)}
      </div>
    </header>

    <nav className="sticky top-[100px] z-30 -mx-4 mb-8 flex overflow-x-auto border-b border-papyrus-line bg-papyrus/95 px-4 backdrop-blur md:-mx-6 md:px-6" aria-label={`Dimensioni della conoscenza di ${reference}`}>
      {(Object.keys(dimensionLabels) as Dimension[]).map((dimension) => <button key={dimension} type="button" onClick={() => setActive(dimension)} className={`h-12 shrink-0 border-b-2 px-4 text-xs font-semibold ${active === dimension ? 'border-bronze text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>{dimensionLabels[dimension]}</button>)}
    </nav>

    <section className="mb-10 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <article className={`border p-5 md:p-7 ${relationTone(active)}`}>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">{dimensionLabels[active]} · {reference}</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold">{dimensionIntro[active]}</h2>
        {active === 'scrittura' && <div className="mt-5 text-sm leading-7 text-ink-soft"><p>Il capitolo è leggibile attraverso i testimoni già presenti nel corpus. Il confronto non è un'appendice: è una relazione diretta con la storia della trasmissione.</p><p className="mt-3">Usa Lettura, Confronto o Sinossi nel Reader qui sotto per passare dalla traduzione italiana ai testimoni disponibili.</p></div>}
        {active === 'mondo' && <div className="mt-5 text-sm leading-7 text-ink-soft"><p>{chapter.context || 'Il contesto storico-culturale del capitolo è in preparazione.'}</p><Link href={`/rebuild/historical-explorer/${chapter.slug}?chapter=${chapter.number}`} className="mt-4 inline-flex font-semibold text-bronze hover:text-ink">Apri il mondo storico e geografico →</Link></div>}
        {active === 'umanita' && <div className="mt-5 grid gap-3 sm:grid-cols-2"><article className="border-t border-papyrus-line pt-3"><strong className="font-serif text-lg">Essere umano</strong><p className="mt-1 text-sm leading-6 text-ink-soft">La narrazione colloca l'uomo dentro un ordine ricevuto, non come realtà isolata ma come creatura in relazione.</p></article><article className="border-t border-papyrus-line pt-3"><strong className="font-serif text-lg">Responsabilità</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Dominio, lavoro e custodia possono essere seguiti come temi attraverso i racconti successivi della Genesi.</p></article><article className="border-t border-papyrus-line pt-3"><strong className="font-serif text-lg">Limite</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Il creato è ordinato attraverso separazioni, ritmi e confini: il limite è parte della struttura del racconto.</p></article><article className="border-t border-papyrus-line pt-3"><strong className="font-serif text-lg">Relazione</strong><p className="mt-1 text-sm leading-6 text-ink-soft">Maschio e femmina, benedizione e fecondità aprono il percorso antropologico che prosegue nei capitoli successivi.</p></article></div>}
        {active === 'tradizione' && <div className="mt-5"><p className="text-sm leading-7 text-ink-soft">{chapter.formation || chapter.critical || 'La formazione del testo è in preparazione.'}</p><div className="mt-5 divide-y divide-papyrus-line border-y border-papyrus-line">{chapter.sourceLayers.length ? chapter.sourceLayers.map((layer: any,index: number) => <article key={layer?._key || index} className="py-4"><div className="flex items-baseline justify-between gap-4"><strong className="font-serif text-lg">{layer?.fonte?.sigla || layer?.fonte?.nome || 'Livello critico'}</strong>{(layer?.versettoInizio != null || layer?.versettoFine != null) && <span className="font-mono text-[9px] text-ink-faint">vv. {layer?.versettoInizio ?? '…'}–{layer?.versettoFine ?? '…'}</span>}</div><p className="mt-2 text-sm leading-6 text-ink-soft">{layer?.descrizione || layer?.motivazione || layer?.fonte?.descrizione || 'Attribuzione registrata nel modello critico.'}</p></article>) : <p className="py-4 text-sm text-ink-faint">Nessuna attribuzione strutturata disponibile.</p>}</div></div>}
        {active === 'ricezione' && <div className="mt-5 text-sm leading-7 text-ink-soft"><p>Questa dimensione sarà alimentata come livello distinto: non sostituisce la ricostruzione storica, ma mostra come il testo viene ripreso nella Scrittura e nella tradizione cristiana.</p><div className="mt-5 border-l-2 border-bronze/40 pl-4"><strong className="font-serif text-lg text-ink">Principio editoriale</strong><p className="mt-1">Contesto storico, interpretazione critica e ricezione cristiana devono restare distinguibili anche quando vengono esplorati nella stessa esperienza.</p></div></div>}
      </article>

      <aside className="border-y border-papyrus-line py-5 xl:border xl:p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">Orientamento</p>
        <h3 className="mt-2 font-serif text-xl font-semibold">Sei in {reference}</h3>
        <p className="mt-3 text-sm leading-6 text-ink-soft">Questo capitolo viene osservato simultaneamente come testo, prodotto storico-culturale, esperienza umana, tradizione trasmessa e testo ricevuto.</p>
        <div className="mt-5 border-t border-papyrus-line pt-4 text-xs leading-6 text-ink-faint"><p><strong className="text-ink-soft">Dato</strong> — ciò che il corpus registra direttamente.</p><p><strong className="text-ink-soft">Ipotesi</strong> — ricostruzione critica da presentare con il suo grado di certezza.</p><p><strong className="text-ink-soft">Ricezione</strong> — sviluppo interpretativo successivo, esplicitamente distinto dal contesto originario.</p></div>
      </aside>
    </section>

    <section id="scrittura" className="border-t border-papyrus-line pt-7">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">{reference} · Scrittura</p><h2 className="mt-1 font-serif text-3xl font-semibold">Leggere e confrontare</h2><p className="mt-2 text-sm text-ink-faint">Il testo resta leggibile senza apparato; l'approfondimento si apre quando serve.</p></div><Link href={`/rebuild/bibbia/${chapter.slug}`} className="text-xs font-semibold text-bronze hover:text-ink">Indice di {chapter.bookTitle} →</Link></div>
      {chapter.biblicalText ? <WorkspaceReader text={chapter.biblicalText} /> : <div className="border-y border-papyrus-line py-16 text-center text-sm text-ink-faint">Il testo biblico non è ancora collegato a questo capitolo.</div>}
    </section>
  </main>;
}
