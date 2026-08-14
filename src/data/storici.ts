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

export const storici: Libro[] = [
  {
    id: 'giosue',
    titolo: 'Giosuè',
    categoriaId: 'storici',
    descrizione:
      'Racconto dell’ingresso nella terra, della conquista e della distribuzione territoriale.',
    datazione: {
      datazioneIniziale: -650,
      datazioneFinale: -500,
      etichettaInizio: 'ca. 650 a.C.',
      etichettaFine: 'ca. 500 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione', 'fonti'),
    eventiNarrati: [
      evento(
        'Tradizioni sulla conquista di Canaan',
        -1200,
        'ricostruzione',
        'Le narrazioni bibliche vengono confrontate criticamente con i dati storici e archeologici del passaggio fra tarda età del bronzo ed età del ferro.',
      ),
    ],
    redazione: [
      fase(
        'Redazione deuteronomistica',
        -620,
        -550,
        'plausibile',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'giudici',
    titolo: 'Giudici',
    categoriaId: 'storici',
    descrizione:
      'Ciclo narrativo sul periodo precedente la monarchia, organizzato secondo schemi teologici ricorrenti.',
    datazione: {
      datazioneIniziale: -650,
      datazioneFinale: -500,
      etichettaInizio: 'ca. 650 a.C.',
      etichettaFine: 'ca. 500 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase(
        'Redazione deuteronomistica',
        -620,
        -550,
        'plausibile',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'rut',
    titolo: 'Rut',
    categoriaId: 'storici',
    descrizione:
      'Racconto familiare e teologico ambientato nel periodo dei giudici e collegato alla genealogia davidica.',
    datazione: {
      datazioneIniziale: -500,
      datazioneFinale: -300,
      etichettaInizio: 'ca. 500 a.C.',
      etichettaFine: 'ca. 300 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -500, -300, 'dibattuta'),
    ],
    contestoStorico: [],
  },

  {
    id: 'samuele',
    titolo: '1-2 Samuele',
    categoriaId: 'storici',
    descrizione:
      'Narrazioni sulla nascita della monarchia, su Saul, Davide e la successione dinastica.',
    datazione: {
      datazioneIniziale: -950,
      datazioneFinale: -550,
      etichettaInizio: 'tradizioni dal X sec. a.C.',
      etichettaFine: 'redazione fino al VI sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'fonti', 'tradizione'),
    eventiNarrati: [
      evento(
        'Regno di Davide',
        -1000,
        'ricostruzione',
      ),
    ],
    redazione: [
      fase(
        'Tradizioni monarchiche e successione',
        -950,
        -850,
        'dibattuta',
      ),
      fase(
        'Redazione deuteronomistica',
        -620,
        -550,
        'plausibile',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 're',
    titolo: '1-2 Re',
    categoriaId: 'storici',
    descrizione:
      'Storia teologica delle monarchie di Israele e Giuda fino alla caduta di Gerusalemme e all’esilio.',
    datazione: {
      datazioneIniziale: -620,
      datazioneFinale: -540,
      etichettaInizio: 'ca. 620 a.C.',
      etichettaFine: 'ca. 540 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione', 'fonti'),
    eventiNarrati: [
      evento(
        'Distruzione di Gerusalemme',
        -586,
        'storico',
      ),
    ],
    redazione: [
      fase(
        'Prima fase deuteronomistica',
        -620,
        -609,
        'dibattuta',
      ),
      fase(
        'Redazione esilica',
        -560,
        -540,
        'plausibile',
      ),
    ],
    contestoStorico: [
      evento('Caduta di Gerusalemme', -586, 'storico'),
    ],
  },

  {
    id: 'cronache',
    titolo: '1-2 Cronache',
    categoriaId: 'storici',
    descrizione:
      'Rilettura post-esilica della storia di Israele con forte interesse per culto, Tempio, genealogie e dinastia davidica.',
    datazione: {
      datazioneIniziale: -350,
      datazioneFinale: -250,
      etichettaInizio: 'ca. 350 a.C.',
      etichettaFine: 'ca. 250 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione', 'fonti'),
    eventiNarrati: [],
    redazione: [
      fase(
        'Redazione cronistica',
        -350,
        -250,
        'plausibile',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'esdra',
    titolo: 'Esdra-Neemia',
    categoriaId: 'storici',
    descrizione:
      'Racconti sul ritorno dall’esilio, sulla ricostruzione di Gerusalemme e sulle riforme religiose e sociali.',
    datazione: {
      datazioneIniziale: -400,
      datazioneFinale: -300,
      etichettaInizio: 'ca. 400 a.C.',
      etichettaFine: 'ca. 300 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione', 'fonti'),
    eventiNarrati: [
      evento(
        'Editto di Ciro',
        -538,
        'storico',
      ),
    ],
    redazione: [
      fase(
        'Raccolta e redazione post-esilica',
        -400,
        -300,
        'dibattuta',
      ),
    ],
    contestoStorico: [
      evento(
        'Periodo persiano',
        -538,
        'storico',
      ),
    ],
  },

  {
    id: 'tobia',
    titolo: 'Tobia',
    categoriaId: 'storici',
    descrizione:
      'Racconto didattico di pietà familiare, diaspora, provvidenza e fedeltà alla legge.',
    datazione: {
      datazioneIniziale: -225,
      datazioneFinale: -175,
      etichettaInizio: 'ca. 225 a.C.',
      etichettaFine: 'ca. 175 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'testuale'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -225, -175, 'plausibile'),
    ],
    contestoStorico: [],
  },

  {
    id: 'giuditta',
    titolo: 'Giuditta',
    categoriaId: 'storici',
    descrizione:
      'Racconto teologico di salvezza nazionale che rielabora liberamente coordinate storiche differenti.',
    datazione: {
      datazioneIniziale: -150,
      datazioneFinale: -100,
      etichettaInizio: 'ca. 150 a.C.',
      etichettaFine: 'ca. 100 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -150, -100, 'plausibile'),
    ],
    contestoStorico: [],
  },

  {
    id: 'ester',
    titolo: 'Ester',
    categoriaId: 'storici',
    descrizione:
      'Racconto di corte ambientato a Susa, trasmesso in forme testuali ebraiche e greche differenti.',
    datazione: {
      datazioneIniziale: -350,
      datazioneFinale: -100,
      etichettaInizio: 'ca. IV–III sec. a.C.',
      etichettaFine: 'addizioni greche entro il II–I sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'testuale',
      'tradizione',
      'redazione',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Tradizione ebraica',
        -350,
        -300,
        'dibattuta',
      ),
      fase(
        'Tradizione e addizioni greche',
        -150,
        -100,
        'plausibile',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'maccabei',
    titolo: '1-2 Maccabei',
    categoriaId: 'storici',
    descrizione:
      'Testimonianze differenti sulla crisi ellenistica, sulla persecuzione e sulla rivolta maccabaica.',
    datazione: {
      datazioneIniziale: -134,
      datazioneFinale: -63,
      etichettaInizio: 'ca. 134 a.C.',
      etichettaFine: 'I sec. a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi(
      'redazione',
      'tradizione',
      'fonti',
    ),
    eventiNarrati: [
      evento(
        'Profanazione del Tempio',
        -167,
        'storico',
      ),
    ],
    redazione: [
      fase(
        'Composizione delle opere maccabaiche',
        -134,
        -63,
        'plausibile',
      ),
    ],
    contestoStorico: [
      evento(
        'Rivolta maccabaica',
        -167,
        'storico',
      ),
    ],
  },
];
