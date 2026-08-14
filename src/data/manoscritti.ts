import type { Libro } from '../types';

export const manoscritti: Libro[] = [
  {
    id: 'qumran',
    titolo: 'I rotoli di Qumran',
    categoriaId: 'manoscritti',

    datazione: {
      datazioneIniziale: -250,
      datazioneFinale: -68,
      etichettaInizio: 'ca. 250 a.C.',
      etichettaFine: '68 d.C.',
      certezza: 'consenso',
      nota:
        'Intervallo generale di produzione e uso dei manoscritti rinvenuti nell’area di Qumran.',
    },

    descrizione:
      'Copie manoscritte reali di testi biblici e di altri scritti del giudaismo del Secondo Tempio, rilevanti soprattutto per la critica testuale e per la storia della trasmissione del testo.',

    metodiAnalisi: [
      {
        metodo: 'testuale',
        domanda:
          'Quale forma del testo biblico attestano i manoscritti e quale rapporto mostrano con le successive tradizioni testuali?',
        sintesi:
          'I manoscritti di Qumran documentano la pluralità testuale del periodo del Secondo Tempio e permettono il confronto con il testo masoretico, la Settanta e altre forme testuali.',
      },
    ],

    eventiNarrati: [],

    redazione: [
      {
        etichetta: 'Attività di copia e trasmissione',
        inizio: -250,
        fine: -68,
        datazione: 'ca. 250 a.C. – 68 d.C.',
        certezza: 'consenso',
        descrizione:
          'Periodo generale nel quale vengono collocati la copia, l’uso e la conservazione dei manoscritti associati ai ritrovamenti di Qumran.',
        motivazione:
          'La datazione deriva dall’insieme delle evidenze paleografiche, archeologiche e materiali disponibili.',
      },
    ],

    contestoStorico: [
      {
        etichetta: 'Distruzione dell’insediamento di Qumran',
        inizio: 68,
        certezza: 'storico',
        descrizione:
          'La distruzione dell’insediamento nel contesto della prima guerra giudaica costituisce il termine storico finale generalmente associato alla fase di utilizzo del sito.',
      },
    ],

    mondoDietroIlTesto:
      'Il corpus di Qumran appartiene al giudaismo del Secondo Tempio e documenta pratiche di copia, conservazione, interpretazione e trasmissione delle Scritture.',

    mondoDelTesto:
      'I manoscritti mostrano che, prima della stabilizzazione successiva delle tradizioni testuali, circolavano forme testuali differenti e talvolta concorrenti.',

    mondoAttornoAlTesto:
      'Il contesto comprende il giudaismo ellenistico e romano, la pluralità dei gruppi giudaici e le trasformazioni culminate nella guerra giudaica del I secolo d.C.',
  },
];
