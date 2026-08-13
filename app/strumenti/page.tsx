import Link from 'next/link';
import AppShell from '../../src/components/AppShell';

const tools = [
  { href: '/strumenti/cronologia', eyebrow: 'Tempo', title: 'Cronologia', text: 'Metti in relazione mondo narrato, contesti storici e periodi di formazione dei testi senza confonderli.', status: 'Prima versione' },
  { href: '/strumenti/fonti', eyebrow: 'Composizione', title: 'Fonti & modelli', text: 'Esplora fonti, tradizioni, redazioni e modelli critici collegati ai libri e ai capitoli del corpus.', status: 'Prima versione' },
  { href: '/strumenti/ricerca', eyebrow: 'Corpus', title: 'Ricerca accademica', text: 'Cerca libri, capitoli, riferimenti e contenuti Sanity con filtri progressivamente più specialistici.', status: 'In sviluppo' },
  { href: '/strumenti/confronto', eyebrow: 'Testo', title: 'Confronto testuale', text: 'Un unico ambiente predisposto per MT ↔ LXX e, nel NT, greco ↔ varianti e testimoni.', status: 'In sviluppo' },
];

export default function ToolsPage() {
  return <AppShell><main>
    <section className="border-b border-papyrus-line bg-paper-card/35"><div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Biblia Fontes · strumenti trasversali</p><h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[.95] md:text-7xl">Dal singolo testo al corpus.</h1><p className="reading-text mt-7 max-w-3xl text-ink-soft">Questi strumenti attraversano libri e famiglie letterarie. Servono a vedere relazioni che una pagina isolata non può mostrare: tempo, formazione, modelli critici, ricerca e trasmissione testuale.</p></div></section>
    <section className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16"><div className="grid gap-5 md:grid-cols-2">{tools.map((tool, i) => <Link key={tool.href} href={tool.href} className="group rounded-2xl border border-papyrus-line bg-paper-card p-6 transition hover:-translate-y-0.5 hover:border-bronze md:p-8"><div className="flex items-start justify-between gap-5"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">0{i+1} · {tool.eyebrow}</span><span className="rounded-full border border-papyrus-line px-3 py-1 text-[10px] uppercase tracking-wider text-ink-faint">{tool.status}</span></div><h2 className="mt-8 font-serif text-3xl font-bold md:text-4xl">{tool.title}</h2><p className="mt-3 max-w-xl leading-7 text-ink-soft">{tool.text}</p><span className="mt-8 inline-flex text-sm font-semibold text-bronze">Apri lo strumento →</span></Link>)}</div></section>
  </main></AppShell>;
}
