'use client';

import { useState } from 'react';

const ntAbbreviations = new Set(['Mt','Mc','Lc','Gv','At','Rm','1Cor','2Cor','Gal','Ef','Fil','Col','1Ts','2Ts','1Tm','2Tm','Tt','Fm','Eb','Gc','1Pt','2Pt','1Gv','2Gv','3Gv','Gd','Ap']);

function isNewTestament(reference: string) {
  const sigla = reference.trim().split(/\s+/)[0];
  return ntAbbreviations.has(sigla);
}

export default function TextWitnessCompare({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const nt = isNewTestament(reference);
  const leftSigla = nt ? 'GNT' : 'MT';
  const rightSigla = nt ? 'VAR' : 'LXX';
  const leftTitle = nt ? 'Testo greco del NT' : 'Testo masoretico';
  const rightTitle = nt ? 'Varianti e testimoni' : 'Septuaginta';
  const compactLabel = nt ? 'Greco ↔ varianti' : 'MT ↔ LXX';

  return (
    <div id="confronto-testuale" className="scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="text-witness-panel"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft transition hover:border-bronze hover:text-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
      >
        <span className="font-mono text-[11px]">{compactLabel}</span>
        <span>{open ? 'Chiudi confronto' : 'Confronta il testo'}</span>
      </button>

      {open && (
        <section id="text-witness-panel" className="mt-5 overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card shadow-sm">
          <header className="border-b border-papyrus-line px-5 py-4 md:flex md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Confronto testuale</p>
              <h3 className="mt-1 font-serif text-2xl font-bold">{reference}</h3>
            </div>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink-faint md:mt-0 md:text-right">{nt ? 'Il componente è predisposto per testo greco, famiglie testuali e varianti manoscritte dove il modello Sanity le rende disponibili.' : 'Nell’Antico Testamento il confronto prioritario resta MT ↔ LXX, con possibilità di aggiungere altri testimoni.'}</p>
          </header>

          <div className="grid md:grid-cols-2">
            <div className="border-b border-papyrus-line p-5 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-mono text-[11px] font-semibold text-bronze">{leftSigla}</p><h4 className="font-serif text-xl font-bold">{leftTitle}</h4></div>
                <span className="rounded-full border border-papyrus-line px-2.5 py-1 text-[10px] text-ink-faint">Testo non collegato</span>
              </div>
              <div className="mt-6 min-h-36 rounded-xl border border-dashed border-papyrus-line bg-papyrus/45 p-5">
                <p className="text-sm leading-7 text-ink-soft">{nt ? 'Qui potrà comparire il testo greco dell’edizione scelta, mantenendo separati testo, edizione e apparato critico.' : 'Qui potrà comparire il testo ebraico autorizzato o di pubblico dominio, mantenendo separati testo, edizione e apparato critico.'}</p>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-mono text-[11px] font-semibold text-bronze">{rightSigla}</p><h4 className="font-serif text-xl font-bold">{rightTitle}</h4></div>
                <span className="rounded-full border border-papyrus-line px-2.5 py-1 text-[10px] text-ink-faint">Dati in collegamento</span>
              </div>
              <div className="mt-6 min-h-36 rounded-xl border border-dashed border-papyrus-line bg-papyrus/45 p-5">
                <p className="text-sm leading-7 text-ink-soft">{nt ? 'Qui saranno mostrate varianti, testimoni e famiglie testuali. Per Atti il modello potrà distinguere in modo esplicito testo alessandrino e testo occidentale.' : 'Qui potrà comparire il testo greco della LXX con segmenti allineati al MT quando il modello dati lo consentirà.'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-papyrus-line bg-papyrus-deep/35 px-5 py-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Differenze rilevanti</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">Le differenze vengono trattate prima come dato testuale — aggiunta, omissione, sostituzione, ordine o lezione — e solo in un secondo livello vengono presentate le possibili implicazioni interpretative.</p>
          </div>
        </section>
      )}
    </div>
  );
}
