import Link from 'next/link';
import AppFrame from '../../src/ui-next/AppFrame';

export default function RebuildEntryPage() {
  return (
    <AppFrame>
      <main className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Biblia Fontes · nuova interfaccia</p>
          <h1 className="mt-4 max-w-3xl font-serif text-6xl font-semibold leading-[0.95] md:text-8xl">Leggere. Studiare. Esplorare.</h1>
          <p className="reading-text mt-8 text-ink-soft">Questa superficie è la ricostruzione UI/UX di Biblia Fontes. Usa il corpus Sanity esistente senza duplicare o riscrivere i contenuti.</p>
          <div className="mt-10 border-t border-papyrus-line pt-6">
            <Link href="/rebuild/bibbia/genesi" className="font-serif text-2xl font-semibold text-ink hover:text-bronze">Apri Genesi →</Link>
            <p className="mt-2 text-sm text-ink-faint">Prima vertical slice: pagina libro completa. Le altre superfici vengono migrate dopo l'approvazione della grammatica visiva.</p>
          </div>
        </div>
      </main>
    </AppFrame>
  );
}
