import type { Libro, MetodoAnalisi } from '../types';

const metodi = (...nomi: string[]): MetodoAnalisi[] =>
  nomi.map((metodo) => ({ metodo }));

export const nuovoTestamento: Libro[] = [
  {
    id: 'matteo',
    titolo: 'Vangelo di Matteo',
    categoriaId: 'nt',
    descrizione: 'Il vangelo rivolto agli ebrei-cristiani.',
    datazione: {
      datazioneIniziale: 75,
      datazioneFinale: 90,
      etichettaInizio: 'ca. 75 d.C.',
      etichettaFine: 'ca. 90 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('fonti', 'redazione'),
    eventiNarrati: [
      {
        etichetta: 'Crocifissione',
        inizio: 30,
        certezza: 'storico',
      },
    ],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 75,
        fine: 90,
        datazione: 'ca. 75–90 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [
      {
        etichetta: 'Distruzione del Tempio di Gerusalemme',
        inizio: 70,
        certezza: 'storico',
      },
    ],
  },

  {
    id: 'marco',
    titolo: 'Vangelo di Marco',
    categoriaId: 'nt',
    descrizione: 'Il primo vangelo canonico.',
    datazione: {
      datazioneIniziale: 65,
      datazioneFinale: 75,
      etichettaInizio: 'ca. 65 d.C.',
      etichettaFine: 'ca. 75 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('fonti', 'redazione'),
    eventiNarrati: [
      {
        etichetta: 'Crocifissione',
        inizio: 30,
        certezza: 'storico',
      },
    ],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 65,
        fine: 75,
        datazione: 'ca. 65–75 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'luca',
    titolo: 'Vangelo di Luca',
    categoriaId: 'nt',
    descrizione: 'Il vangelo della misericordia e degli emarginati.',
    datazione: {
      datazioneIniziale: 80,
      datazioneFinale: 90,
      etichettaInizio: 'ca. 80 d.C.',
      etichettaFine: 'ca. 90 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('fonti', 'redazione'),
    eventiNarrati: [
      {
        etichetta: 'Crocifissione',
        inizio: 30,
        certezza: 'storico',
      },
    ],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 80,
        fine: 90,
        datazione: 'ca. 80–90 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'giovanni',
    titolo: 'Vangelo di Giovanni',
    categoriaId: 'nt',
    descrizione: 'Il vangelo teologico e simbolico.',
    datazione: {
      datazioneIniziale: 90,
      datazioneFinale: 110,
      etichettaInizio: 'ca. 90 d.C.',
      etichettaFine: 'ca. 110 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [
      {
        etichetta: 'Crocifissione',
        inizio: 30,
        certezza: 'storico',
      },
    ],
    redazione: [
      {
        etichetta: 'Tradizione giovannea',
        inizio: 90,
        fine: 110,
        datazione: 'ca. 90–110 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'atti',
    titolo: 'Atti degli Apostoli',
    categoriaId: 'nt',
    descrizione: 'La storia della Chiesa primitiva.',
    datazione: {
      datazioneIniziale: 80,
      datazioneFinale: 95,
      etichettaInizio: 'ca. 80 d.C.',
      etichettaFine: 'ca. 95 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'fonti'),
    eventiNarrati: [
      {
        etichetta: 'Pentecoste',
        inizio: 30,
        certezza: 'tradizionale',
      },
      {
        etichetta: 'Concilio di Gerusalemme',
        inizio: 50,
        certezza: 'storico',
      },
    ],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 80,
        fine: 95,
        datazione: 'ca. 80–95 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'romani',
    titolo: 'Lettera ai Romani',
    categoriaId: 'nt',
    descrizione: 'Il vangelo di Paolo alla Chiesa di Roma.',
    datazione: {
      datazioneIniziale: 57,
      datazioneFinale: 57,
      etichettaInizio: 'ca. 57 d.C.',
      etichettaFine: 'ca. 57 d.C.',
      certezza: 'consenso',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 57,
        fine: 57,
        datazione: 'ca. 57 d.C.',
        certezza: 'consenso',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'corinzi',
    titolo: '1-2 Corinzi',
    categoriaId: 'nt',
    descrizione: 'Correzioni e insegnamenti alla Chiesa di Corinto.',
    datazione: {
      datazioneIniziale: 53,
      datazioneFinale: 55,
      etichettaInizio: 'ca. 53 d.C.',
      etichettaFine: 'ca. 55 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 53,
        fine: 55,
        datazione: 'ca. 53–55 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'galati',
    titolo: 'Lettera ai Galati',
    categoriaId: 'nt',
    descrizione: 'Difesa della libertà cristiana dalla Legge.',
    datazione: {
      datazioneIniziale: 54,
      datazioneFinale: 55,
      etichettaInizio: 'ca. 54 d.C.',
      etichettaFine: 'ca. 55 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 54,
        fine: 55,
        datazione: 'ca. 54–55 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'efesini',
    titolo: 'Lettera agli Efesini',
    categoriaId: 'nt',
    descrizione: 'Lettera circolare ai cristiani d’Asia Minore.',
    datazione: {
      datazioneIniziale: 80,
      datazioneFinale: 90,
      etichettaInizio: 'ca. 80 d.C.',
      etichettaFine: 'ca. 90 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 80,
        fine: 90,
        datazione: 'ca. 80–90 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'filippesi',
    titolo: 'Lettera ai Filippesi',
    categoriaId: 'nt',
    descrizione: 'Lettera di prigione, gioia e umiltà.',
    datazione: {
      datazioneIniziale: 61,
      datazioneFinale: 62,
      etichettaInizio: 'ca. 61 d.C.',
      etichettaFine: 'ca. 62 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 61,
        fine: 62,
        datazione: 'ca. 61–62 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'colossesi',
    titolo: 'Lettera ai Colossesi',
    categoriaId: 'nt',
    descrizione: 'Lettera cristologica alla comunità di Colossi.',
    datazione: {
      datazioneIniziale: 61,
      datazioneFinale: 62,
      etichettaInizio: 'ca. 61 d.C.',
      etichettaFine: 'ca. 62 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 61,
        fine: 62,
        datazione: 'ca. 61–62 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'tessalonicesi',
    titolo: '1-2 Tessalonicesi',
    categoriaId: 'nt',
    descrizione: 'Lettere dedicate anche all’attesa della venuta di Cristo.',
    datazione: {
      datazioneIniziale: 50,
      datazioneFinale: 51,
      etichettaInizio: 'ca. 50 d.C.',
      etichettaFine: 'ca. 51 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 50,
        fine: 51,
        datazione: 'ca. 50–51 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'timoteo',
    titolo: '1-2 Timoteo, Tito',
    categoriaId: 'nt',
    descrizione: 'Lettere pastorali dedicate alla guida delle comunità.',
    datazione: {
      datazioneIniziale: 85,
      datazioneFinale: 100,
      etichettaInizio: 'ca. 85 d.C.',
      etichettaFine: 'ca. 100 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione delle Pastorali',
        inizio: 85,
        fine: 100,
        datazione: 'ca. 85–100 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'filemone',
    titolo: 'Lettera a Filemone',
    categoriaId: 'nt',
    descrizione: 'Intervento di Paolo in favore di Onesimo.',
    datazione: {
      datazioneIniziale: 61,
      datazioneFinale: 62,
      etichettaInizio: 'ca. 61 d.C.',
      etichettaFine: 'ca. 62 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 61,
        fine: 62,
        datazione: 'ca. 61–62 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'ebrei',
    titolo: 'Lettera agli Ebrei',
    categoriaId: 'nt',
    descrizione: 'Cristo presentato come sommo sacerdote.',
    datazione: {
      datazioneIniziale: 80,
      datazioneFinale: 95,
      etichettaInizio: 'ca. 80 d.C.',
      etichettaFine: 'ca. 95 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 80,
        fine: 95,
        datazione: 'ca. 80–95 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'giacomo',
    titolo: 'Lettera di Giacomo',
    categoriaId: 'nt',
    descrizione: 'Esortazione sapienziale sul rapporto fra fede e opere.',
    datazione: {
      datazioneIniziale: 70,
      datazioneFinale: 90,
      etichettaInizio: 'ca. 70 d.C.',
      etichettaFine: 'ca. 90 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 70,
        fine: 90,
        datazione: 'ca. 70–90 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'pietro',
    titolo: '1-2 Pietro',
    categoriaId: 'nt',
    descrizione: 'Speranza cristiana e confronto con insegnamenti avversari.',
    datazione: {
      datazioneIniziale: 80,
      datazioneFinale: 120,
      etichettaInizio: 'ca. 80 d.C.',
      etichettaFine: 'ca. 120 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 80,
        fine: 120,
        datazione: 'ca. 80–120 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'giovanni_lettere',
    titolo: '1-2-3 Giovanni',
    categoriaId: 'nt',
    descrizione: 'Scritti della tradizione giovannea dedicati alla comunione e al discernimento.',
    datazione: {
      datazioneIniziale: 95,
      datazioneFinale: 110,
      etichettaInizio: 'ca. 95 d.C.',
      etichettaFine: 'ca. 110 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Tradizione giovannea',
        inizio: 95,
        fine: 110,
        datazione: 'ca. 95–110 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'giuda',
    titolo: 'Lettera di Giuda',
    categoriaId: 'nt',
    descrizione: 'Esortazione polemica contro maestri considerati devianti.',
    datazione: {
      datazioneIniziale: 90,
      datazioneFinale: 110,
      etichettaInizio: 'ca. 90 d.C.',
      etichettaFine: 'ca. 110 d.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione',
        inizio: 90,
        fine: 110,
        datazione: 'ca. 90–110 d.C.',
        certezza: 'dibattuta',
      },
    ],
    contestoStorico: [],
  },

  {
    id: 'apocalisse',
    titolo: 'Apocalisse',
    categoriaId: 'nt',
    descrizione: 'Il grande testo apocalittico del Nuovo Testamento.',
    datazione: {
      datazioneIniziale: 90,
      datazioneFinale: 96,
      etichettaInizio: 'ca. 90 d.C.',
      etichettaFine: 'ca. 96 d.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      {
        etichetta: 'Composizione delle visioni',
        inizio: 90,
        fine: 96,
        datazione: 'ca. 90–96 d.C.',
        certezza: 'plausibile',
      },
    ],
    contestoStorico: [
      {
        etichetta: 'Fine del regno di Domiziano',
        inizio: 96,
        certezza: 'storico',
      },
    ],
  },
];
