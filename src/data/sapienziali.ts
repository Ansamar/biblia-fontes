import type {
  Libro,
  MetodoAnalisi,
  StratoRedazione,
  EventoFocus,
} from '../types';

const metodi = (...nomi: string[]): MetodoAnalisi[] =>
  nomi.map((metodo) => ({ metodo }));

const fase = (
  etichetta: string,
  inizio: number,
  fine: number,
  certezza: string,
  descrizione?: string,
): StratoRedazione => ({
  etichetta,
  inizio,
  fine,
  datazione:
    inizio === fine
      ? `${Math.abs(inizio)} ${inizio < 0 ? 'a.C.' : 'd.C.'}`
      : `${Math.abs(inizio)}–${Math.abs(fine)} ${
          fine < 0 ? 'a.C.' : 'd.C.'
        }`,
  certezza,
  descrizione,
});

const evento = (
  etichetta: string,
  inizio: number,
  certezza: string,
  descrizione?: string,
): EventoFocus => ({
  etichetta,
  inizio,
  certezza,
  descrizione,
});

export const sapienziali: Libro[] = [
  {
    id: 'giobbe',
    titolo: 'Giobbe',
    categoriaId: 'sapienziali',
    descrizione:
      'Grande poema sapienziale sulla sofferenza innocente, sulla giustizia e sul limite della comprensione umana.',
    datazione: {
      datazioneIniziale: -550,
      datazioneFinale: -350,
      etichettaInizio: 'ca. 550 a.C.',
      etichettaFine: 'ca. 350 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase(
        'Dialoghi poetici',
        -550,
        -450,
        'dibattuta',
        'Nucleo poetico costituito dai dialoghi fra Giobbe e i suoi interlocutori.',
      ),
      fase(
        'Cornice narrativa e forma finale',
        -450,
        -350,
        'dibattuta',
        'Rielaborazione della cornice narrativa e integrazione della forma canonica.',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'salmi',
    titolo: 'Salmi',
    categoriaId: 'sapienziali',
    descrizione:
      'Raccolta canonica di preghiere, inni, suppliche, canti regali, sapienziali e liturgici.',
    datazione: {
      datazioneIniziale: -1000,
      datazioneFinale: -150,
      etichettaInizio: 'tradizioni dal I millennio a.C.',
      etichettaFine: 'forma finale ca. II sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'forme',
      'tradizione',
      'redazione',
      'testuale',
    ),
    eventiNarrati: [
      evento(
        'Tradizioni davidiche',
        -1000,
        'tradizionale',
        'La tradizione canonica collega numerosi salmi alla figura di Davide, senza implicare necessariamente una datazione diretta all’epoca davidica.',
      ),
    ],
    redazione: [
      fase(
        'Tradizioni e raccolte pre-esiliche',
        -1000,
        -586,
        'dibattuta',
      ),
      fase(
        'Raccolte e redazione post-esilica',
        -538,
        -150,
        'plausibile',
      ),
    ],
    contestoStorico: [
      evento('Esilio babilonese', -586, 'storico'),
      evento(
        'Periodo persiano e ricostruzione del culto',
        -538,
        'storico',
      ),
    ],
  },

  {
    id: 'proverbi',
    titolo: 'Proverbi',
    categoriaId: 'sapienziali',
    descrizione:
      'Raccolta stratificata di massime, istruzioni e composizioni sapienziali provenienti da tradizioni differenti.',
    datazione: {
      datazioneIniziale: -950,
      datazioneFinale: -300,
      etichettaInizio: 'tradizioni antiche',
      etichettaFine: 'forma finale ca. IV–III sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'forme',
      'fonti',
      'tradizione',
      'redazione',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Raccolte attribuite alla tradizione salomonica',
        -950,
        -700,
        'tradizionale',
      ),
      fase(
        'Raccolte e redazione finale',
        -500,
        -300,
        'plausibile',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'qoelet',
    titolo: 'Qoèlet',
    categoriaId: 'sapienziali',
    descrizione:
      'Meditazione sapienziale sulla precarietà dell’esistenza, sul tempo, sul lavoro e sui limiti della conoscenza.',
    datazione: {
      datazioneIniziale: -280,
      datazioneFinale: -220,
      etichettaInizio: 'ca. 280 a.C.',
      etichettaFine: 'ca. 220 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi(
      'redazione',
      'tradizione',
      'forme',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Composizione',
        -280,
        -220,
        'plausibile',
      ),
    ],
    contestoStorico: [
      evento(
        'Periodo ellenistico',
        -250,
        'storico',
      ),
    ],
  },

  {
    id: 'cantico',
    titolo: 'Cantico dei Cantici',
    categoriaId: 'sapienziali',
    descrizione:
      'Raccolta poetica di canti d’amore, tradizionalmente associata a Salomone e successivamente riletta in senso teologico.',
    datazione: {
      datazioneIniziale: -350,
      datazioneFinale: -250,
      etichettaInizio: 'ca. IV sec. a.C.',
      etichettaFine: 'ca. III sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'forme',
      'tradizione',
      'redazione',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Composizione e raccolta poetica',
        -350,
        -250,
        'dibattuta',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'sapienza',
    titolo: 'Sapienza',
    categoriaId: 'sapienziali',
    descrizione:
      'Opera sapienziale greca di ambiente giudeo-ellenistico, tradizionalmente posta sotto l’autorità letteraria di Salomone.',
    datazione: {
      datazioneIniziale: -80,
      datazioneFinale: -40,
      etichettaInizio: 'ca. 80 a.C.',
      etichettaFine: 'ca. 40 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi(
      'redazione',
      'forme',
      'tradizione',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Composizione greca',
        -80,
        -40,
        'plausibile',
        'Composizione in ambiente giudeo-ellenistico, probabilmente alessandrino.',
      ),
    ],
    contestoStorico: [
      evento(
        'Giudaismo ellenistico',
        -60,
        'storico',
      ),
    ],
  },

  {
    id: 'siracide',
    titolo: 'Siracide',
    categoriaId: 'sapienziali',
    descrizione:
      'Grande opera sapienziale di Ben Sira, composta originariamente in ebraico e successivamente tradotta in greco.',
    datazione: {
      datazioneIniziale: -190,
      datazioneFinale: -130,
      etichettaInizio: 'ca. 190–175 a.C.',
      etichettaFine: 'traduzione greca ca. 132 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi(
      'redazione',
      'tradizione',
      'testuale',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Composizione ebraica',
        -190,
        -175,
        'plausibile',
      ),
      fase(
        'Traduzione greca',
        -132,
        -130,
        'plausibile',
      ),
    ],
    contestoStorico: [
      evento(
        'Giudaismo ellenistico',
        -180,
        'storico',
      ),
    ],
  },
];
