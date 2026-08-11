import React from 'react';
import type { Libro, Categoria } from '../types';

interface BookCardProps {
  libro: Libro;
  categoria: Categoria;
  onClick: () => void;
}

export default function BookCard({ libro, categoria, onClick }: BookCardProps) {
  const formatAnno = (y: number) => {
    return y < 0 ? `${Math.abs(y)} a.C.` : `${y} d.C.`;
  };

  const dat = libro.datazione;
  const annoInizio = dat?.datazioneIniziale;
  const annoFine = dat?.datazioneFinale;
  const etichettaInizio = dat?.etichettaInizio;
  const etichettaFine = dat?.etichettaFine;

  // Se c'è l'etichetta testuale la usa, altrimenti usa la data numerica
  const inizioDisplay = etichettaInizio || (annoInizio ? formatAnno(annoInizio) : '?');
  const fineDisplay = etichettaFine || (annoFine ? formatAnno(annoFine) : '?');
  
  // Se le etichette sono lunghe, le dividiamo su due righe per non far sformare la card
  const isLongText = (etichettaInizio && etichettaInizio.length > 20) || (etichettaFine && etichettaFine.length > 20);

  return (
    <div 
      onClick={onClick}
      className="group flex items-center justify-between p-8 rounded-xl border border-papyrus-line bg-paper-card shadow-sm hover:shadow-lg hover:border-bronze transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <span 
          className="w-1.5 h-16 rounded-full flex-shrink-0" 
          style={{ backgroundColor: categoria.colore }}
        ></span>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold text-ink font-serif">
            {libro.titolo}
          </h3>
          <span className="text-xs uppercase tracking-wider text-ink-faint font-mono">
            {categoria.etichetta}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right ml-4">
        <div className="text-sm text-bronze font-bold max-w-[280px]">
          {isLongText ? (
            <div className="flex flex-col items-end">
              <span>{inizioDisplay}</span>
              <span className="text-ink-faint">→ {fineDisplay}</span>
            </div>
          ) : (
            <span>{inizioDisplay} <span className="text-ink-faint">→</span> {fineDisplay}</span>
          )}
        </div>
        <div className="text-xs text-ink-faint uppercase tracking-wide group-hover:text-seal transition-colors mt-1">
          Apri Scheda Esegetica →
        </div>
      </div>
    </div>
  );
}