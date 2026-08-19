import Link from 'next/link';

export default function RebuildNotFound() {
  return <main className="mx-auto max-w-[920px] px-5 py-20 md:px-8 md:py-28">
    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bronze">Biblia Fontes</p>
    <h1 className="mt-3 font-serif text-5xl font-semibold">Contesto non disponibile.</h1>
    <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">Il libro, capitolo o campo storico richiesto non è disponibile in questa vista. Torna al corpus e scegli un nuovo punto di ingresso.</p>
    <div className="mt-8 flex gap-5 text-sm"><Link href="/rebuild" className="font-semibold text-bronze hover:text-ink">Corpus biblico →</Link><Link href="/rebuild/historical-explorer" className="text-ink-soft hover:text-ink">Storia →</Link></div>
  </main>;
}
