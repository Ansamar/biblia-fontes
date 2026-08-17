'use client';

import { useEffect, useMemo, useState } from 'react';
import DepthSelector, { type StudyDepth } from './DepthSelector';
import BiblicalTextReader, { type BiblicalTextUnit } from './BiblicalTextReader';

function certaintyLabel(value?: string) {
  if (!value) return 'Da verificare';
  return value.replaceAll('_', ' ').replace(/^./, (c) => c.toUpperCase());
}

function certaintySymbol(value?: string) {
  if (['ampio_consenso', 'consenso', 'alta'].includes(value || '')) return '●';
  if (['probabile', 'medio_alta'].includes(value || '')) return '◕';
  if (['dibattuta', 'dibattuto', 'media'].includes(value || '')) return '◑';
  return '○';
}

function textFromUnknown(value: any, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => textFromUnknown(item)).filter(Boolean).join(' · ') || fallback;
  if (typeof value === 'object') return value.descrizione || value.motivazione || value.etichetta || value.citazione || value.titolo || value.nome || value.nota || fallback;
  return fallback;
}

function bibliographyText(item: any) {
  return textFromUnknown(item, 'Riferimento bibliografico');
}

export default function UniversalChapterStudy({ chapter, reference, worldNarratedLabel, biblicalText }: { chapter: any; reference: string; worldNarratedLabel?: string; biblicalText?: BiblicalTextUnit | null }) {
  const [depth, setDepth] = useState<StudyDepth>('study');
  const layers = Array.isArray(chapter.attribuzioniFonti) ? chapter.attribuzioniFonti : [];
  const bibliography = Array.isArray(chapter.bibliografia) ? chapter.bibliografia : [];

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
    if (typeof d === 'string') return d;
    return d.etichetta || [d.etichettaInizio, d.etichettaFine].filter(Boolean).join(' — ') || (d.inizio || d.fine ? `${d.inizio ?? '…'} – ${d.fine ?? '…'}` : 'Datazione compositiva da definire');
  }, [chapter.datazione]);

  const structureText = textFromUnknown(chapter.struttura) || textFromUnknown(chapter.analisiLetteraria?.storiaCompositiva) || textFromUnknown(chapter.analisiLetteraria?.strutturaPoetica) || 'Struttura dettagliata in preparazione.';
  const contextText = textFromUnknown(chapter.contestoStorico, 'Contesto in preparazione.');
  const traditionText = textFromUnknown(chapter.tradizione) || textFromUnknown(chapter.redazione) || 'Dati compositivi in preparazione.';
  const narratedText = textFromUnknown(worldNarratedLabel) || textFromUnknown(chapter.eventiNarrati) || 'Periodo o scena rappresentata dal testo.';
  const criticalText = textFromUnknown(chapter.analisiStoricoCritica);
  const textualText = textFromUnknown(chapter.testoCritico);

  return <>
    <div className="mt-7 rounded-2xl border border-papyrus-line bg-paper-card/65 p-4 shadow-sm md:flex md:items-center md:justify-between md:gap-6">
      <div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Livello di lettura</p><p className="mt-1 text-sm text-ink-faint">La pagina resta la stessa: cambia soltanto la profondità dell’apparato.</p></div>
      <div className="mt-4 md:mt-0"><DepthSelector value={depth} onChange={changeDepth} /></div>
    </div>

    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="min-w-0">
        <section id="testo" className="scroll-mt-36 overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm">
          <header className="border-b border-papyrus-line px-6 py-5 md:px-8"><div><p className="font-mono text-xs text-bronze">{reference}</p><h2 className="mt-2 font-serif text-3xl font-bold">Reader</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-faint">{biblicalText ? 'Testo strutturato per versetti. Se sono disponibili più testimoni, Lettura, Confronto e Sinossi fanno parte dello stesso Reader.' : 'Il riferimento resta stabile anche quando collegheremo un testo autorizzato o altri testimoni.'}</p></div></header>
          <div className="px-6 py-10 md:px-10 md:py-14">{biblicalText ? <BiblicalTextReader text={biblicalText} critical={depth === 'critical'} /> : <div className="reading-text mx-auto"><p className="font-serif text-[1.55em] font-semibold leading-tight text-ink">{chapter.titolo || `Capitolo ${chapter.numero}`}</p><p className="mt-4 text-[0.9em] text-ink-soft">Il testo biblico integrale non è ancora collegato. Sintesi, apparato, tempi del testo e bibliografia restano pienamente consultabili.</p><div className="mt-8 border-l-2 border-bronze pl-5 text-[0.82em] leading-7 text-ink-faint"><strong className="text-ink">Riferimento di studio:</strong> {reference}</div></div>}</div>
        </section>

        <section id="in-breve" className="scroll-mt-36 py-12"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">In breve</p><h2 className="mt-2 font-serif text-3xl font-bold">Che cosa sto leggendo?</h2><p className="reading-text mt-5 text-ink-soft">{textFromUnknown(chapter.sintesi, 'Sintesi didattica in preparazione.')}</p></section>

        {depth !== 'essential' && <section id="struttura" className="scroll-mt-36 border-t border-papyrus-line py-12"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Studio</p><h2 className="mt-2 font-serif text-3xl font-bold">Struttura e contesto</h2><p className="reading-text mt-5 whitespace-pre-line text-ink-soft">{structureText}</p><div id="contesto" className="mt-10 grid scroll-mt-36 gap-5 md:grid-cols-2"><div className="rounded-xl border border-papyrus-line bg-paper-card/50 p-5"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Mondo dietro il testo</p><h3 className="mt-2 font-serif text-xl font-bold">Contesto storico-culturale</h3><p className="mt-3 leading-7 text-ink-soft">{contextText}</p></div><div className="rounded-xl border border-papyrus-line bg-paper-card/50 p-5"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Formazione</p><h3 className="mt-2 font-serif text-xl font-bold">Tradizione / redazione</h3><p className="mt-3 leading-7 text-ink-soft">{traditionText}</p></div></div></section>}

        {depth !== 'essential' && <section id="tempi-del-testo" className="scroll-mt-36 border-t border-papyrus-line py-12"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Timeline del capitolo</p><h2 className="mt-2 font-serif text-3xl font-bold">Tempi del testo</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-ink-faint">Il tempo della scena raccontata, il contesto storico pertinente e il tempo di formazione non coincidono automaticamente. Questa vista li tiene distinti senza trasformare il racconto in cronaca storica.</p><div className="mt-8 grid gap-5 md:grid-cols-3"><div className="rounded-xl border border-papyrus-line bg-paper-card/45 p-5"><div className="mb-4 h-1.5 rounded-full bg-ink"/><p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Mondo narrato</p><p className="mt-2 leading-7 text-ink-soft">{narratedText}</p></div><div className="rounded-xl border border-papyrus-line bg-paper-card/45 p-5"><div className="mb-4 h-1.5 rounded-full bg-bronze"/><p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Contesto pertinente</p><p className="mt-2 leading-7 text-ink-soft">{contextText}</p></div><div className="rounded-xl border border-papyrus-line bg-paper-card/45 p-5"><div className="mb-4 h-1.5 rounded-full bg-seal"/><p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Formazione del testo</p><p className="mt-2 leading-7 text-ink-soft">{timelineLabel}</p></div></div>{typeof chapter.datazione === 'object' && chapter.datazione?.nota && <p className="mt-5 text-sm leading-6 text-ink-faint">{chapter.datazione.nota}</p>}</section>}

        {depth === 'critical' && <section id="livelli-critici" className="scroll-mt-36 border-t border-papyrus-line py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Critica</p><h2 className="mt-2 font-serif text-3xl font-bold">Livelli critici / attribuzioni</h2></div><p className="text-sm text-ink-faint">{layers.length} livelli registrati</p></div>{criticalText && <p className="reading-text mt-5 text-ink-soft">{criticalText}</p>}<div className="mt-8 space-y-4">{layers.length ? layers.map((layer:any, i:number) => <article key={layer._key || i} className="rounded-2xl border border-papyrus-line bg-paper-card/55 p-5 shadow-sm md:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="mt-1 font-mono text-lg text-bronze" aria-hidden="true">{certaintySymbol(layer.certezza)}</span><div><div className="flex flex-wrap items-center gap-2"><strong className="font-serif text-2xl">{layer.fonte?.sigla || layer.fonte?.nome || 'Livello critico'}</strong>{(layer.versettoInizio != null || layer.versettoFine != null) && <span className="font-mono text-[11px] text-ink-faint">vv. {layer.versettoInizio ?? '…'}–{layer.versettoFine ?? '…'}</span>}</div>{layer.fonte?.nome && layer.fonte?.sigla && <p className="mt-1 text-sm font-medium text-ink">{layer.fonte.nome}</p>}</div></div><span className="rounded-full border border-papyrus-line px-3 py-1 text-[11px] text-ink-soft">{certaintyLabel(layer.certezza)}</span></div><p className="mt-4 leading-7 text-ink-soft">{textFromUnknown(layer.descrizione) || textFromUnknown(layer.motivazione) || textFromUnknown(layer.fonte?.descrizione) || 'Attribuzione registrata nel modello critico.'}</p>{layer.motivazione && layer.descrizione && <details className="mt-4 border-t border-papyrus-line pt-4"><summary className="cursor-pointer font-medium text-bronze">Perché questa attribuzione?</summary><p className="mt-3 leading-7 text-ink-soft">{textFromUnknown(layer.motivazione)}</p></details>}</article>) : <p className="rounded-xl border border-papyrus-line p-5 text-ink-soft">Nessuna attribuzione critica strutturata disponibile.</p>}</div></section>}

        {depth === 'critical' && textualText && <section id="testo-critico" className="scroll-mt-36 border-t border-papyrus-line py-12"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Trasmissione</p><h2 className="mt-2 font-serif text-3xl font-bold">Testo critico</h2><p className="reading-text mt-5 text-ink-soft">{textualText}</p></section>}

        <section id="bibliografia" className="scroll-mt-36 border-t border-papyrus-line py-12"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Riferimenti</p><h2 className="mt-2 font-serif text-3xl font-bold">Bibliografia</h2>{bibliography.length ? <div className="mt-6 divide-y divide-papyrus-line border-y border-papyrus-line">{bibliography.map((item:any, i:number) => <div key={item?._key || i} className="py-5"><p className="leading-7 text-ink">{bibliographyText(item)}</p>{item?.tipo && <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{item.tipo}</p>}</div>)}</div> : <p className="mt-5 leading-7 text-ink-soft">Bibliografia specifica non ancora disponibile.</p>}</section>
      </article>

      <aside className="hidden h-fit lg:sticky lg:top-36 lg:block"><div className="rounded-2xl border border-papyrus-line bg-paper-card/55 p-5 shadow-sm"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Approfondisci</p><nav className="mt-4 space-y-1 text-sm" aria-label="Indice del capitolo"><a href="#testo" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Reader</a><a href="#in-breve" className="block rounded-lg px-2 py-2 font-semibold text-ink hover:bg-papyrus-deep/50 hover:text-bronze">In breve</a>{depth !== 'essential' && <><a href="#struttura" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Struttura</a><a href="#contesto" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Contesto</a><a href="#tempi-del-testo" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Tempi del testo</a></>}{depth === 'critical' && <><a href="#livelli-critici" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Livelli critici</a>{textualText && <a href="#testo-critico" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Testo critico</a>}</>}<a href="#bibliografia" className="block rounded-lg px-2 py-2 text-ink-soft hover:bg-papyrus-deep/50 hover:text-bronze">Bibliografia</a></nav></div></aside>
    </div>
  </>;
}
