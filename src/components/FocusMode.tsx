'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Libro } from '../types';

// Mappa colori per le fonti
const getColorForFonte = (etichetta: string): string => {
  const e = etichetta.toLowerCase();
  if (e.includes('j')) return '#B0532C';
  if (e.includes('e')) return '#7D8C6B';
  if (e.includes('d')) return '#3E6E82';
  if (e.includes('p') || e.includes('sac')) return '#5A4B81';
  return '#2A2420';
};

const getCertezzaEmoji = (certezza?: string): string => {
  if (!certezza) return '';
  if (certezza.startsWith('consenso') || certezza.startsWith('storico') || certezza.startsWith('archeologico')) return '🟢';
  if (certezza.startsWith('ipotesi') || certezza.startsWith('plausibile') || certezza.startsWith('ricostruzione')) return '🟡';
  if (certezza.startsWith('dibattuta') || certezza.startsWith('tradizionale') || certezza.startsWith('discussa')) return '🟠';
  if (certezza.startsWith('speculativa') || certezza.startsWith('non_databile')) return '🔴';
  return '';
};

type DetailItem = {
  id: string;
  type: 'evento' | 'redazione' | 'contesto';
  etichetta: string;
  date: string;
  descrizione?: string;
  certezza?: string;
  colore?: string;
};

export default function FocusMode({ libro, onClose }: { libro: Libro | null; onClose: () => void }) {
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);

  if (!libro) return null;

  const dat = libro.datazione;
  
  // Prendiamo gli array in modo sicuro
  const eventiNarrati = Array.isArray(libro.eventiNarrati) ? libro.eventiNarrati : [];
  const redazione = Array.isArray(libro.redazione) ? libro.redazione : [];
  const contestoStorico = Array.isArray(libro.contestoStorico) ? libro.contestoStorico : [];
  const metodiAnalisi = Array.isArray(libro.metodiAnalisi) ? libro.metodiAnalisi : [];

  const allDates = [
    dat?.datazioneIniziale, dat?.datazioneFinale,
    ...(eventiNarrati.map(e => e.inizio) || []),
    ...(redazione.map(s => s.inizio) || []),
    ...(redazione.map(s => s.fine) || []),
    ...(contestoStorico.map(e => e.inizio) || [])
  ].filter((d): d is number => typeof d === 'number');
  
  let minYear = Math.min(...allDates, -1000);
  let maxYear = Math.max(...allDates, 0);
  const range = maxYear - minYear;
  const padding = range * 0.1;
  minYear -= padding;
  maxYear += padding;
  const totalRange = maxYear - minYear;

  const getLeftPercent = (year: number) => ((year - minYear) / totalRange) * 100;
  const formatAnno = (y: number) => y < 0 ? `${Math.abs(y)} a.C.` : `${y} d.C.`;

  const handleSelect = (item: DetailItem) => setSelectedItem(item);

  return (
    <Dialog.Root open={!!libro} onOpenChange={(open) => { if (!open) { onClose(); setSelectedItem(null); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1200px] h-[90vh] bg-[var(--papyrus)] rounded-xl shadow-2xl border border-[var(--papyrus-line)] z-[101] flex flex-col outline-none">
          
          {/* HEADER */}
          <div className="flex justify-between items-start p-6 md:p-8 border-b border-[var(--papyrus-line)]">
            <div>
              <Dialog.Title className="text-3xl md:text-4xl font-bold text-[var(--ink)] font-serif">
                {libro.titolo}
              </Dialog.Title>
              {libro.titoloEbraico && (
                <p className="text-sm text-[var(--ink-faint)] mt-1 font-mono" dir="rtl">{libro.titoloEbraico}</p>
              )}
              <p className="text-sm text-[var(--ink-soft)] mt-2 max-w-2xl italic">
                {libro.descrizione}
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="text-[var(--ink-soft)] hover:text-[var(--ink)] text-2xl font-bold px-3 py-1 rounded-full hover:bg-black/5 transition-colors">
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* CORPO PRINCIPALE */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* COLONNA SINISTRA: METODI E TIMELINE */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto relative">
              
              {/* DATARIONE SINTETICA */}
              {dat && (
                <div className="mb-8 p-4 border border-[var(--papyrus-line)] rounded-lg bg-[var(--paper-card)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-[var(--bronze)] font-bold font-mono">Datazione Redazione</span>
                    <span>{getCertezzaEmoji(dat.certezza)}</span>
                  </div>
                  <div className="text-lg font-bold text-[var(--ink)] font-serif">
                    {dat.etichettaInizio || (dat.datazioneIniziale ? formatAnno(dat.datazioneIniziale) : '?')} 
                    <span className="mx-2 text-[var(--ink-faint)]">→</span> 
                    {dat.etichettaFine || (dat.datazioneFinale ? formatAnno(dat.datazioneFinale) : '?')}
                  </div>
                  {dat.nota && <p className="text-xs text-[var(--ink-soft)] mt-2 italic">{dat.nota}</p>}
                </div>
              )}

              {/* METODI STORICO-CRITICI */}
              {metodiAnalisi.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--ink)] font-serif mb-4 border-b border-[var(--papyrus-line)] pb-2">Metodi Storico-Critici</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metodiAnalisi.map((m, i) => (
                      <div key={i} className="p-4 border border-[var(--papyrus-line)] rounded-lg bg-[var(--paper-card)]/50">
                        <div className="text-sm font-bold text-[var(--bronze)] capitalize mb-1">{m.metodo.replace('_', ' ')}</div>
                        {m.domanda && <p className="text-xs italic text-[var(--ink-faint)] mb-2">{m.domanda}</p>}
                        {m.sintesi && <p className="text-sm text-[var(--ink-soft)]">{m.sintesi}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIMELINE */}
              <div className="mt-12">
                <div className="flex items-center mb-6">
                  <div className="w-[130px]"></div>
                  <div className="relative flex-1 h-2 mx-[20px] border-l border-r border-[var(--papyrus-line)]">
                    <div className="absolute top-0 left-0 text-[10px] text-[var(--ink-faint)] -translate-x-1/2 -translate-y-5 font-mono">{formatAnno(Math.round(minYear))}</div>
                    <div className="absolute top-0 left-1/2 text-[10px] text-[var(--ink-faint)] -translate-x-1/2 -translate-y-5 font-mono">{formatAnno(Math.round(minYear + range/2))}</div>
                    <div className="absolute top-0 left-full text-[10px] text-[var(--ink-faint)] -translate-x-1/2 -translate-y-5 font-mono">{formatAnno(Math.round(maxYear))}</div>
                  </div>
                </div>

                {/* TRACCIA 1: EVENTI */}
                {eventiNarrati.length > 0 && (
                  <div className="flex items-center mb-8">
                    <div className="w-[130px] text-right pr-4">
                      <div className="text-sm font-bold text-[var(--ink)]">Eventi Narrati</div>
                      <div className="text-[10px] text-[var(--ink-faint)] uppercase">Dietro il testo</div>
                    </div>
                    <div className="relative flex-1 h-8 mx-[20px]">
                      {eventiNarrati.map((e, i) => e.inizio && (
                        <button key={i} onClick={() => handleSelect({ id: `ev${i}`, type: 'evento', etichetta: e.etichetta, date: formatAnno(e.inizio), descrizione: e.descrizione, certezza: e.certezza })}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10"
                          style={{ left: `${getLeftPercent(e.inizio)}%` }}>
                          <div className={`w-3 h-3 rounded-full bg-[var(--bronze)] group-hover:scale-125 transition-transform`}></div>
                          <span className="text-[10px] mt-1 whitespace-nowrap text-[var(--ink-soft)] group-hover:text-[var(--ink)] font-medium">{e.etichetta}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TRACCIA 2: REDAZIONE */}
                {redazione.length > 0 && (
                  <div className="flex items-center mb-8">
                    <div className="w-[130px] text-right pr-4">
                      <div className="text-sm font-bold text-[var(--ink)]">Redazione</div>
                      <div className="text-[10px] text-[var(--ink-faint)] uppercase">Del testo</div>
                    </div>
                    <div className="relative flex-1 h-10 mx-[20px]">
                      {redazione.map((s, i) => {
                        const left = getLeftPercent(s.inizio);
                        const width = getLeftPercent(s.fine) - left;
                        const color = getColorForFonte(s.etichetta);
                        return (
                          <button key={i} onClick={() => handleSelect({ id: `str${i}`, type: 'redazione', etichetta: s.etichetta, date: `${formatAnno(s.inizio)} - ${formatAnno(s.fine)}`, descrizione: s.descrizione, certezza: s.certezza, colore: color })}
                            className="absolute top-1/2 -translate-y-1/2 h-8 rounded flex items-center justify-center overflow-visible group cursor-pointer transition-all hover:scale-y-110"
                            style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color, opacity: s.certezza?.includes('dibattuta') ? 0.6 : 1 }}>
                            <span className="text-[10px] text-white font-bold px-2 truncate pointer-events-none">{s.etichetta}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TRACCIA 3: CONTESTO */}
                {contestoStorico.length > 0 && (
                  <div className="flex items-center mb-8">
                    <div className="w-[130px] text-right pr-4">
                      <div className="text-sm font-bold text-[var(--ink)]">Contesto Storico</div>
                      <div className="text-[10px] text-[var(--ink-faint)] uppercase">Attorno al testo</div>
                    </div>
                    <div className="relative flex-1 h-8 mx-[20px]">
                      {contestoStorico.map((e, i) => e.inizio && (
                        <button key={i} onClick={() => handleSelect({ id: `ctx${i}`, type: 'contesto', etichetta: e.etichetta, date: formatAnno(e.inizio), descrizione: e.descrizione, certezza: e.certezza })}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10"
                          style={{ left: `${getLeftPercent(e.inizio)}%` }}>
                          <div className={`w-3 h-3 rotate-45 bg-[var(--seal)] group-hover:scale-125 transition-transform`}></div>
                          <span className="text-[10px] mt-1 whitespace-nowrap text-[var(--ink-soft)] group-hover:text-[var(--ink)] font-medium">{e.etichetta}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLONNA DESTRA: PANNELLO DETTAGLI */}
            <aside className="w-full md:w-[300px] border-l border-[var(--papyrus-line)] p-6 flex flex-col bg-[var(--paper-card)]/30">
              {selectedItem ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--bronze)] font-mono font-bold">
                      {selectedItem.type === 'evento' ? 'Evento Narrato' : selectedItem.type === 'redazione' ? 'Fase di Redazione' : 'Contesto Storico'}
                    </span>
                    <h4 className="text-2xl font-bold text-[var(--ink)] font-serif mt-1">{selectedItem.etichetta}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--ink-soft)] bg-[var(--papyrus)] px-2 py-1 rounded">
                      {selectedItem.date}
                    </span>
                    {selectedItem.certezza && (
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-[var(--ink)] text-[var(--papyrus)] flex items-center gap-1">
                        {getCertezzaEmoji(selectedItem.certezza)} {selectedItem.certezza.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {selectedItem.descrizione ? (
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                      {selectedItem.descrizione}
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--ink-faint)] italic">
                      Nessuna descrizione testuale aggiuntiva per questo elemento.
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center px-4">
                  <p className="text-sm text-[var(--ink-faint)] italic">
                    Seleziona un elemento sulla mappa temporale o un metodo per leggere l'analisi storica e accademica.
                  </p>
                </div>
              )}
            </aside>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}