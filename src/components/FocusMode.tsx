'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Libro } from '../types';

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

  if (
    certezza.startsWith('consenso') ||
    certezza.startsWith('storico') ||
    certezza.startsWith('archeologico')
  ) {
    return '🟢';
  }

  if (
    certezza.startsWith('ipotesi') ||
    certezza.startsWith('plausibile') ||
    certezza.startsWith('ricostruzione')
  ) {
    return '🟡';
  }

  if (
    certezza.startsWith('dibattuta') ||
    certezza.startsWith('tradizionale') ||
    certezza.startsWith('discussa')
  ) {
    return '🟠';
  }

  if (
    certezza.startsWith('speculativa') ||
    certezza.startsWith('non_databile')
  ) {
    return '🔴';
  }

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

type FocusModeProps = {
  libro: Libro | null;
  onClose: () => void;
};

export default function FocusMode({
  libro,
  onClose,
}: FocusModeProps) {
  const [selectedItem, setSelectedItem] =
    useState<DetailItem | null>(null);

  if (!libro) return null;

  const dat = libro.datazione;

  const eventiNarrati = Array.isArray(libro.eventiNarrati)
    ? libro.eventiNarrati
    : [];

  const redazione = Array.isArray(libro.redazione)
    ? libro.redazione
    : [];

  const contestoStorico = Array.isArray(libro.contestoStorico)
    ? libro.contestoStorico
    : [];

  const metodiAnalisi = Array.isArray(libro.metodiAnalisi)
    ? libro.metodiAnalisi
    : [];

  const allDates = [
    dat?.datazioneIniziale,
    dat?.datazioneFinale,
    ...eventiNarrati.map((evento) => evento.inizio),
    ...redazione.map((strato) => strato.inizio),
    ...redazione.map((strato) => strato.fine),
    ...contestoStorico.map((evento) => evento.inizio),
  ].filter((value): value is number => typeof value === 'number');

  let minYear = Math.min(...allDates, -1000);
  let maxYear = Math.max(...allDates, 0);

  const rawRange = maxYear - minYear;
  const padding = rawRange > 0 ? rawRange * 0.1 : 100;

  minYear -= padding;
  maxYear += padding;

  const totalRange = Math.max(maxYear - minYear, 1);

  const getLeftPercent = (year: number) =>
    ((year - minYear) / totalRange) * 100;

  const formatAnno = (year: number) =>
    year < 0
      ? `${Math.abs(year)} a.C.`
      : `${year} d.C.`;

  const handleSelect = (item: DetailItem) => {
    setSelectedItem(item);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedItem(null);
      onClose();
    }
  };

  return (
    <Dialog.Root
      open={Boolean(libro)}
      onOpenChange={handleOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] flex h-[90vh] w-[95vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-[var(--papyrus-line)] bg-[var(--papyrus)] shadow-2xl outline-none">

          {/* HEADER */}
          <div className="flex items-start justify-between border-b border-[var(--papyrus-line)] p-6 md:p-8">
            <div>
              <Dialog.Title className="font-serif text-3xl font-bold text-[var(--ink)] md:text-4xl">
                {libro.titolo}
              </Dialog.Title>

              {libro.titoloEbraico && (
                <p
                  className="mt-1 font-mono text-sm text-[var(--ink-faint)]"
                  dir="rtl"
                >
                  {libro.titoloEbraico}
                </p>
              )}

              {libro.descrizione && (
                <p className="mt-2 max-w-2xl text-sm italic text-[var(--ink-soft)]">
                  {libro.descrizione}
                </p>
              )}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Chiudi"
                className="rounded-full px-3 py-1 text-2xl font-bold text-[var(--ink-soft)] transition-colors hover:bg-black/5 hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* CORPO */}
          <div className="flex flex-1 overflow-hidden">

            {/* COLONNA PRINCIPALE */}
            <div className="relative flex-1 overflow-y-auto p-6 md:p-8">

              {/* DATAZIONE */}
              {dat && (
                <div className="mb-8 rounded-lg border border-[var(--papyrus-line)] bg-[var(--paper-card)] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--bronze)]">
                      Datazione Redazione
                    </span>

                    <span>
                      {getCertezzaEmoji(dat.certezza)}
                    </span>
                  </div>

                  <div className="font-serif text-lg font-bold text-[var(--ink)]">
                    {dat.etichettaInizio ??
                      (typeof dat.datazioneIniziale === 'number'
                        ? formatAnno(dat.datazioneIniziale)
                        : '?')}

                    <span className="mx-2 text-[var(--ink-faint)]">
                      →
                    </span>

                    {dat.etichettaFine ??
                      (typeof dat.datazioneFinale === 'number'
                        ? formatAnno(dat.datazioneFinale)
                        : '?')}
                  </div>

                  {dat.nota && (
                    <p className="mt-2 text-xs italic text-[var(--ink-soft)]">
                      {dat.nota}
                    </p>
                  )}
                </div>
              )}

              {/* METODI */}
              {metodiAnalisi.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 border-b border-[var(--papyrus-line)] pb-2 font-serif text-lg font-bold text-[var(--ink)]">
                    Metodi Storico-Critici
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {metodiAnalisi.map((metodo, index) => (
                      <div
                        key={`${metodo.metodo}-${index}`}
                        className="rounded-lg border border-[var(--papyrus-line)] bg-[var(--paper-card)]/50 p-4"
                      >
                        <div className="mb-1 text-sm font-bold capitalize text-[var(--bronze)]">
                          {metodo.metodo.replaceAll('_', ' ')}
                        </div>

                        {metodo.domanda && (
                          <p className="mb-2 text-xs italic text-[var(--ink-faint)]">
                            {metodo.domanda}
                          </p>
                        )}

                        {metodo.sintesi && (
                          <p className="text-sm text-[var(--ink-soft)]">
                            {metodo.sintesi}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIMELINE */}
              <div className="mt-12">

                {/* ASSE */}
                <div className="mb-6 flex items-center">
                  <div className="w-[130px]" />

                  <div className="relative mx-[20px] h-2 flex-1 border-l border-r border-[var(--papyrus-line)]">
                    <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-5 font-mono text-[10px] text-[var(--ink-faint)]">
                      {formatAnno(Math.round(minYear))}
                    </div>

                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-5 font-mono text-[10px] text-[var(--ink-faint)]">
                      {formatAnno(
                        Math.round(
                          minYear + totalRange / 2,
                        ),
                      )}
                    </div>

                    <div className="absolute left-full top-0 -translate-x-1/2 -translate-y-5 font-mono text-[10px] text-[var(--ink-faint)]">
                      {formatAnno(Math.round(maxYear))}
                    </div>
                  </div>
                </div>

                {/* EVENTI NARRATI */}
                {eventiNarrati.length > 0 && (
                  <div className="mb-8 flex items-center">
                    <div className="w-[130px] pr-4 text-right">
                      <div className="text-sm font-bold text-[var(--ink)]">
                        Eventi Narrati
                      </div>
                      <div className="text-[10px] uppercase text-[var(--ink-faint)]">
                        Dietro il testo
                      </div>
                    </div>

                    <div className="relative mx-[20px] h-8 flex-1">
                      {eventiNarrati.map((evento, index) => {
                        if (evento.inizio == null) {
                          return null;
                        }

                        const inizio = evento.inizio;

                        return (
                          <button
                            key={`evento-${index}`}
                            type="button"
                            onClick={() =>
                              handleSelect({
                                id: `ev${index}`,
                                type: 'evento',
                                etichetta: evento.etichetta,
                                date: formatAnno(inizio),
                                descrizione:
                                  evento.descrizione,
                                certezza:
                                  evento.certezza,
                              })
                            }
                            className="group absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
                            style={{
                              left: `${getLeftPercent(
                                inizio,
                              )}%`,
                            }}
                          >
                            <div className="h-3 w-3 rounded-full bg-[var(--bronze)] transition-transform group-hover:scale-125" />

                            <span className="mt-1 whitespace-nowrap text-[10px] font-medium text-[var(--ink-soft)] group-hover:text-[var(--ink)]">
                              {evento.etichetta}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* REDAZIONE */}
                {redazione.length > 0 && (
                  <div className="mb-8 flex items-center">
                    <div className="w-[130px] pr-4 text-right">
                      <div className="text-sm font-bold text-[var(--ink)]">
                        Redazione
                      </div>
                      <div className="text-[10px] uppercase text-[var(--ink-faint)]">
                        Del testo
                      </div>
                    </div>

                    <div className="relative mx-[20px] h-10 flex-1">
                      {redazione.map((strato, index) => {
                        const left =
                          getLeftPercent(strato.inizio);

                        const right =
                          getLeftPercent(strato.fine);

                        const width = Math.max(
                          right - left,
                          0.5,
                        );

                        const color =
                          getColorForFonte(
                            strato.etichetta,
                          );

                        return (
                          <button
                            key={`redazione-${index}`}
                            type="button"
                            onClick={() =>
                              handleSelect({
                                id: `str${index}`,
                                type: 'redazione',
                                etichetta:
                                  strato.etichetta,
                                date: `${formatAnno(
                                  strato.inizio,
                                )} - ${formatAnno(
                                  strato.fine,
                                )}`,
                                descrizione:
                                  strato.descrizione,
                                certezza:
                                  strato.certezza,
                                colore: color,
                              })
                            }
                            className="group absolute top-1/2 flex h-8 -translate-y-1/2 cursor-pointer items-center justify-center overflow-visible rounded transition-all hover:scale-y-110"
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              backgroundColor: color,
                              opacity:
                                strato.certezza?.includes(
                                  'dibattuta',
                                )
                                  ? 0.6
                                  : 1,
                            }}
                          >
                            <span className="pointer-events-none truncate px-2 text-[10px] font-bold text-white">
                              {strato.etichetta}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CONTESTO STORICO */}
                {contestoStorico.length > 0 && (
                  <div className="mb-8 flex items-center">
                    <div className="w-[130px] pr-4 text-right">
                      <div className="text-sm font-bold text-[var(--ink)]">
                        Contesto Storico
                      </div>
                      <div className="text-[10px] uppercase text-[var(--ink-faint)]">
                        Attorno al testo
                      </div>
                    </div>

                    <div className="relative mx-[20px] h-8 flex-1">
                      {contestoStorico.map(
                        (evento, index) => {
                          if (evento.inizio == null) {
                            return null;
                          }

                          const inizio =
                            evento.inizio;

                          return (
                            <button
                              key={`contesto-${index}`}
                              type="button"
                              onClick={() =>
                                handleSelect({
                                  id: `ctx${index}`,
                                  type: 'contesto',
                                  etichetta:
                                    evento.etichetta,
                                  date: formatAnno(
                                    inizio,
                                  ),
                                  descrizione:
                                    evento.descrizione,
                                  certezza:
                                    evento.certezza,
                                })
                              }
                              className="group absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
                              style={{
                                left: `${getLeftPercent(
                                  inizio,
                                )}%`,
                              }}
                            >
                              <div className="h-3 w-3 rotate-45 bg-[var(--seal)] transition-transform group-hover:scale-125" />

                              <span className="mt-1 whitespace-nowrap text-[10px] font-medium text-[var(--ink-soft)] group-hover:text-[var(--ink)]">
                                {evento.etichetta}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DETTAGLI */}
            <aside className="flex w-full flex-col border-l border-[var(--papyrus-line)] bg-[var(--paper-card)]/30 p-6 md:w-[300px]">
              {selectedItem ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--bronze)]">
                      {selectedItem.type === 'evento'
                        ? 'Evento Narrato'
                        : selectedItem.type ===
                            'redazione'
                          ? 'Fase di Redazione'
                          : 'Contesto Storico'}
                    </span>

                    <h4 className="mt-1 font-serif text-2xl font-bold text-[var(--ink)]">
                      {selectedItem.etichetta}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[var(--papyrus)] px-2 py-1 font-mono text-xs text-[var(--ink-soft)]">
                      {selectedItem.date}
                    </span>

                    {selectedItem.certezza && (
                      <span className="flex items-center gap-1 rounded bg-[var(--ink)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--papyrus)]">
                        {getCertezzaEmoji(
                          selectedItem.certezza,
                        )}

                        {selectedItem.certezza.replaceAll(
                          '_',
                          ' ',
                        )}
                      </span>
                    )}
                  </div>

                  {selectedItem.descrizione ? (
                    <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                      {selectedItem.descrizione}
                    </p>
                  ) : (
                    <p className="text-sm italic text-[var(--ink-faint)]">
                      Nessuna descrizione testuale
                      aggiuntiva per questo elemento.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center">
                  <p className="text-sm italic text-[var(--ink-faint)]">
                    Seleziona un elemento sulla mappa
                    temporale per leggere l&apos;analisi
                    storica e accademica.
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