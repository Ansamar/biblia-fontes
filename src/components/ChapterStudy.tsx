'use client';

import { useEffect, useMemo, useState } from 'react';
import DepthSelector, { type StudyDepth } from './DepthSelector';

function certaintyLabel(value?: string) {
  if (!value) return 'Da verificare';
  return value.replaceAll('_', ' ').replace(/^./, (c) => c.toUpperCase());
}

function chapterReference(numero: number) {
  return numero === 1 ? 'Gen 1,1–2,4a' : `Gen ${numero}`;
}

export default function ChapterStudy({ chapter }: { chapter: any }) {
  const [depth, setDepth] = useState<StudyDepth>('study');
  const layers = chapter.attribuzioniFonti ?? [];
  const bibliography = chapter.bibliografia ?? [];
  const reference = chapterReference(chapter.numero ?? 1);

  useEffect(() => {
    const saved = window.localStorage.getItem('biblia-study-depth') as StudyDepth | null;
    if (saved && ['essential', 'study', 'critical'].includes(saved)) setDepth(saved);
  }, []);

  const changeDepth = (value: StudyDepth) => {
    setDepth(value);
    window.localStorage.setItem('biblia-study-depth', value);
  };

  const timelineLabel = useMemo(() => {
    const d = chapter.datazione;
    if (!d) return 'Datazione compositiva da definire';
    if (d.etichetta) return d.etichetta;
    if (d.etichettaInizio || d.etichettaFine) return [d.etichettaInizio, d.etichettaFine].filter(Boolean).join(' — ');
    if (d.inizio || d.fine) return `${d.inizio ?? '…'} – ${d.fine ?? '…'}`;
    return 'Datazione compositiva da definire';
  }, [chapter.datazione]);

  return (
    <>
      <div className="mt-7 rounded-xl border border-papyrus-line bg-paper-card/50 p-4 md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Livello di lettura</p>
          <p className="mt-1 text-sm text-ink-faint">La pagina resta la stessa: cambia soltanto la profondità dell’apparato.</p>
        </div>
        <div className="mt-4 md:mt-0"><DepthSelector value={depth} onChange={changeDepth} /></div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0">
          <section id="testo" className="scroll-mt-24 border-y border-papyrus-line py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-bronze">{reference}</p>
                <h2 className="mt-2 font-serif text-3xl font-bold">Testo / riferimento</h2>
              </div>
              <button className="text-sm text-ink-faint" type="button" disabled title="Confronto testuale in preparazione">MT ↔ LXX · in preparazione</button>
            </div>
            <div className="mt-8 rounded-xl border border-dashed border-papyrus-line bg-paper-card/50 p-7 md:p-10">
              <div className="reading-text mx-auto text-center">
                <p className="font-serif text-[1.35em] font-semibold leading-snug text-ink">Il Reader è pronto ad accogliere il testo biblico.</p>
                <p className="mt-3 text-[0.88em] text-ink-soft">Per ora il riferimento resta l’ancora del percorso di studio. Un’edizione autorizzata potrà essere collegata qui senza modificare l’architettura della pagina.</p>
              </div>
            </div>
          </section>

          <section id="in-breve" className="scroll-mt-24 py-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">In breve</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{chapter.titolo || `Capitolo ${chapter.numero}`}</h2>
            <p className="reading-text mt-5 text-ink-soft">{chapter.sintesi || 'Sintesi didattica in preparazione.'}</p>
          </section>

          {depth !== 'essential' && (
            <section id="struttura" className="scroll-mt-24 border-t border-papyrus-line py-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Studio</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">Struttura e contesto</h2>
              <p className="reading-text mt-5 whitespace-pre-line text-ink-soft">{chapter.struttura || chapter.analisiLetteraria?.strutturaPoetica || 'La struttura dettagliata sarà visualizzata qui a partire dai dati del capitolo.'}</p>
              <div id="contesto" className="mt-9 grid scroll-mt-24 gap-8 md:grid-cols-2">
                <div><h3 className="font-serif text-xl font-bold">Contesto storico-culturale</h3><p className="mt-3 leading-7 text-ink-soft">{chapter.contestoStorico || 'Distinguere sempre il mondo rappresentato dal racconto dal contesto culturale e dalla storia della composizione.'}</p></div>
                <div><h3 className="font-serif text-xl font-bold">Tradizione</h3><p className="mt-3 leading-7 text-ink-soft">{chapter.tradizione || 'Il rapporto con tradizioni precedenti viene descritto solo quando i dati lo permettono.'}</p></div>
              </div>
            </section>
          )}

          {depth !== 'essential' && (
            <section id="cronologia" className="scroll-mt-24 border-t border-papyrus-line py-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Cronologia</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">Tre tempi da non confondere</h2>
              <p className="mt-3 max-w-2xl text-ink-soft">Biblia Fontes separa il tempo rappresentato dal racconto, il contesto storico pertinente e la formazione letteraria del testo.</p>
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                <div className="border-t-2 border-ink pt-4"><p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Mondo narrato</p><p className="mt-2 leading-7 text-ink-soft">{chapter.numero === 1 ? 'Tempo primordiale: non è una data storica misurabile.' : 'Periodo o scena rappresentata dal racconto.'}</p></div>
                <div className="border-t-2 border-bronze pt-4"><p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Contesto storico</p><p className="mt-2 leading-7 text-ink-soft">{chapter.contestoStorico || 'Eventi e ambienti storici pertinenti saranno collegati come livello distinto.'}</p></div>
                <div className="border-t-2 border-seal pt-4"><p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Formazione del testo</p><p className="mt-2 leading-7 text-ink-soft">{timelineLabel}</p></div>
              </div>
              {chapter.datazione?.nota && <p className="mt-5 text-sm leading-6 text-ink-faint">{chapter.datazione.nota}</p>}
            </section>
          )}

          {depth === 'critical' && (
            <section id="livelli-critici" className="scroll-mt-24 border-t border-papyrus-line py-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Critica</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">Livelli critici / attribuzioni</h2>
              <p className="mt-3 max-w-2xl leading-7 text-ink-soft">Qui distinguiamo dati testuali, tradizioni, modelli ricostruttivi e redazione. La presenza di un livello non implica automaticamente che sia una fonte documentaria certa.</p>
              <div className="mt-7 divide-y divide-papyrus-line border-y border-papyrus-line">
                {layers.length ? layers.map((layer:any, i:number) => (
                  <div key={layer._key || i} className="py-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <strong className="font-serif text-xl">{layer.fonte?.sigla || layer.fonte?.nome || 'Livello critico'}</strong>
                      <span className="rounded-full border border-papyrus-line px-2.5 py-1 text-[11px] text-ink-soft">{certaintyLabel(layer.certezza)}</span>
                      {(layer.versettoInizio || layer.versettoFine) && <span className="font-mono text-[11px] text-ink-faint">vv. {layer.versettoInizio ?? '…'}–{layer.versettoFine ?? '…'}</span>}
                    </div>
                    {layer.fonte?.nome && layer.fonte?.sigla && <p className="mt-1 font-medium text-ink">{layer.fonte.nome}</p>}
                    <p className="mt-3 leading-7 text-ink-soft">{layer.descrizione || layer.motivazione || layer.fonte?.descrizione || 'Attribuzione registrata nel modello critico.'}</p>
                    {layer.motivazione && layer.descrizione && <details className="mt-3"><summary className="cursor-pointer text-bronze">Perché questa attribuzione?</summary><p className="mt-3 leading-7 text-ink-soft">{layer.motivazione}</p></details>}
                  </div>
                )) : <p className="py-6 text-ink-soft">Nessuna attribuzione critica strutturata disponibile per questo capitolo.</p>}
              </div>
            </section>
          )}

          <section id="bibliografia" className="scroll-mt-24 border-t border-papyrus-line py-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Riferimenti</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">Bibliografia</h2>
            {bibliography.length ? <div className="mt-6 divide-y divide-papyrus-line border-y border-papyrus-line">{bibliography.map((item:any, i:number) => <div key={item._key || i} className="py-4"><p className="leading-7 text-ink">{item.citazione || item.titolo || String(item)}</p>{item.tipo && <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{item.tipo}</p>}</div>)}</div> : <p className="mt-5 leading-7 text-ink-soft">Bibliografia specifica del capitolo non ancora disponibile.</p>}
          </section>
        </article>

        <aside className="hidden h-fit lg:sticky lg:top-24 lg:block">
          <div className="border-l border-papyrus-line pl-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Approfondisci</p>
            <nav className="mt-4 space-y-1 text-sm" aria-label="Indice del capitolo">
              <a href="#testo" className="block py-2 text-ink-soft hover:text-bronze">Testo / riferimento</a>
              <a href="#in-breve" className="block py-2 font-semibold text-ink hover:text-bronze">In breve</a>
              {depth !== 'essential' && <><a href="#struttura" className="block py-2 text-ink-soft hover:text-bronze">Struttura</a><a href="#contesto" className="block py-2 text-ink-soft hover:text-bronze">Contesto</a><a href="#cronologia" className="block py-2 text-ink-soft hover:text-bronze">Cronologia</a></>}
              {depth === 'critical' && <><a href="#livelli-critici" className="block py-2 text-ink-soft hover:text-bronze">Livelli critici</a><span className="block py-2 text-ink-faint">MT ↔ LXX · presto</span></>}
              <a href="#bibliografia" className="block py-2 text-ink-soft hover:text-bronze">Bibliografia</a>
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}
