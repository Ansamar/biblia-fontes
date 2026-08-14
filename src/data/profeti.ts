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
});

const evento = (
  etichetta: string,
  inizio: number,
  certezza: string = 'storico',
  descrizione?: string,
): EventoFocus => ({
  etichetta,
  inizio,
  certezza,
  descrizione,
});

export const profeti: Libro[] = [
  {
    id: 'isaia',
    titolo: 'Isaia (Proto · Deutero · Trito)',
    categoriaId: 'profeti',
    descrizione:
      'Un solo libro canonico, ma una composizione sviluppatasi attraverso differenti epoche storiche.',
    datazione: {
      datazioneIniziale: -740,
      datazioneFinale: -450,
      etichettaInizio: 'ca. 740 a.C.',
      etichettaFine: 'ca. 450 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('tradizione', 'redazione', 'fonti', 'testuale'),
    eventiNarrati: [],
    redazione: [
      fase('Proto-Isaia', -740, -700, 'consenso'),
      fase('Deutero-Isaia', -550, -539, 'consenso'),
      fase('Trito-Isaia', -539, -450, 'dibattuta'),
    ],
    contestoStorico: [
      evento(
        'Caduta di Samaria',
        -722,
        'storico',
        'Conquista assira di Samaria e fine del regno settentrionale d’Israele.',
      ),
    ],
  },

  {
    id: 'geremia',
    titolo: 'Geremia',
    categoriaId: 'profeti',
    descrizione:
      'Il profeta legato alla crisi finale del regno di Giuda e alla caduta di Gerusalemme.',
    datazione: {
      datazioneIniziale: -627,
      datazioneFinale: -500,
      etichettaInizio: 'ca. 627 a.C.',
      etichettaFine: 'ca. 500 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione', 'testuale'),
    eventiNarrati: [
      evento('Distruzione del Tempio di Gerusalemme', -586),
    ],
    redazione: [
      fase('Oracoli profetici', -627, -580, 'plausibile'),
      fase('Redazione deuteronomistica', -560, -500, 'dibattuta'),
    ],
    contestoStorico: [
      evento('Caduta di Gerusalemme', -586),
    ],
  },

  {
    id: 'lamentazioni',
    titolo: 'Lamentazioni',
    categoriaId: 'profeti',
    descrizione:
      'Cinque poemi poetici legati alla distruzione di Gerusalemme e al trauma dell’esilio.',
    datazione: {
      datazioneIniziale: -586,
      datazioneFinale: -520,
      etichettaInizio: 'dopo il 586 a.C.',
      etichettaFine: 'ca. 520 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione dei poemi', -586, -520, 'plausibile'),
    ],
    contestoStorico: [
      evento('Distruzione di Gerusalemme', -586),
    ],
  },

  {
    id: 'baruc',
    titolo: 'Baruc',
    categoriaId: 'profeti',
    descrizione:
      'Opera composita che raccoglie sezioni di carattere penitenziale, sapienziale e profetico.',
    datazione: {
      datazioneIniziale: -150,
      datazioneFinale: -50,
      etichettaInizio: 'ca. 150 a.C.',
      etichettaFine: 'ca. 50 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione e raccolta', -150, -50, 'dibattuta'),
    ],
    contestoStorico: [],
  },

  {
    id: 'ezechiele',
    titolo: 'Ezechiele',
    categoriaId: 'profeti',
    descrizione:
      'Visioni e oracoli ambientati nell’esilio babilonese, culminanti nella visione del nuovo Tempio.',
    datazione: {
      datazioneIniziale: -593,
      datazioneFinale: -530,
      etichettaInizio: 'ca. 593 a.C.',
      etichettaFine: 'ca. 530 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Oracoli dell’esilio', -593, -571, 'plausibile'),
      fase('Rielaborazione e raccolta', -570, -530, 'dibattuta'),
    ],
    contestoStorico: [
      evento('Esilio babilonese', -586),
    ],
  },

  {
    id: 'daniele',
    titolo: 'Daniele',
    categoriaId: 'profeti',
    descrizione:
      'Racconti di corte e visioni apocalittiche confluiti nella forma canonica durante il periodo ellenistico.',
    datazione: {
      datazioneIniziale: -300,
      datazioneFinale: -164,
      etichettaInizio: 'ca. 300 a.C.',
      etichettaFine: 'ca. 164 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Racconti di corte', -300, -200, 'dibattuta'),
      fase('Visioni apocalittiche', -167, -164, 'consenso'),
    ],
    contestoStorico: [
      evento('Crisi maccabaica', -164),
    ],
  },

  {
    id: 'osea',
    titolo: 'Osea',
    categoriaId: 'profeti',
    descrizione:
      'Profeta del regno del Nord, caratterizzato dalla metafora matrimoniale dell’alleanza.',
    datazione: {
      datazioneIniziale: -750,
      datazioneFinale: -720,
      etichettaInizio: 'ca. 750 a.C.',
      etichettaFine: 'ca. 720 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('tradizione', 'forme', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Tradizione profetica e raccolta', -750, -720, 'plausibile'),
    ],
    contestoStorico: [
      evento('Crisi del regno settentrionale', -722),
    ],
  },

  {
    id: 'gioele',
    titolo: 'Gioele',
    categoriaId: 'profeti',
    descrizione:
      'Libro profetico costruito attorno al motivo della calamità e del giorno del Signore.',
    datazione: {
      datazioneIniziale: -400,
      datazioneFinale: -300,
      etichettaInizio: 'ca. 400 a.C.',
      etichettaFine: 'ca. 300 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('tradizione', 'forme'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -400, -300, 'dibattuta'),
    ],
    contestoStorico: [],
  },

  {
    id: 'amos',
    titolo: 'Amos',
    categoriaId: 'profeti',
    descrizione:
      'Profeta dell’VIII secolo a.C. legato alla denuncia dell’ingiustizia sociale e religiosa.',
    datazione: {
      datazioneIniziale: -760,
      datazioneFinale: -740,
      etichettaInizio: 'ca. 760 a.C.',
      etichettaFine: 'ca. 740 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Oracoli e raccolta', -760, -740, 'plausibile'),
    ],
    contestoStorico: [],
  },

  {
    id: 'abdia',
    titolo: 'Abdia',
    categoriaId: 'profeti',
    descrizione:
      'Breve oracolo profetico contro Edom, collegato alla catastrofe di Gerusalemme.',
    datazione: {
      datazioneIniziale: -586,
      datazioneFinale: -500,
      etichettaInizio: 'dopo il 586 a.C.',
      etichettaFine: 'ca. 500 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -586, -500, 'plausibile'),
    ],
    contestoStorico: [
      evento('Caduta di Gerusalemme', -586),
    ],
  },

  {
    id: 'giona',
    titolo: 'Giona',
    categoriaId: 'profeti',
    descrizione:
      'Racconto didattico e teologico centrato sulla misericordia divina verso le nazioni.',
    datazione: {
      datazioneIniziale: -400,
      datazioneFinale: -300,
      etichettaInizio: 'ca. 400 a.C.',
      etichettaFine: 'ca. 300 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('forme', 'tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -400, -300, 'dibattuta'),
    ],
    contestoStorico: [],
  },

  {
    id: 'michea',
    titolo: 'Michea',
    categoriaId: 'profeti',
    descrizione:
      'Oracoli contro Samaria e Gerusalemme, con temi di giudizio e restaurazione.',
    datazione: {
      datazioneIniziale: -740,
      datazioneFinale: -700,
      etichettaInizio: 'ca. 740 a.C.',
      etichettaFine: 'ca. 700 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Tradizione profetica e raccolta', -740, -700, 'plausibile'),
    ],
    contestoStorico: [],
  },

  {
    id: 'naum',
    titolo: 'Naum',
    categoriaId: 'profeti',
    descrizione:
      'Oracolo poetico imperniato sulla caduta di Ninive e sulla fine della potenza assira.',
    datazione: {
      datazioneIniziale: -650,
      datazioneFinale: -610,
      etichettaInizio: 'ca. 650 a.C.',
      etichettaFine: 'ca. 610 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -650, -610, 'plausibile'),
    ],
    contestoStorico: [
      evento('Caduta di Ninive', -612),
    ],
  },

  {
    id: 'abacuc',
    titolo: 'Abacuc',
    categoriaId: 'profeti',
    descrizione:
      'Dialogo profetico sulla violenza, sull’ingiustizia e sul governo divino della storia.',
    datazione: {
      datazioneIniziale: -620,
      datazioneFinale: -600,
      etichettaInizio: 'ca. 620 a.C.',
      etichettaFine: 'ca. 600 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -620, -600, 'plausibile'),
    ],
    contestoStorico: [],
  },

  {
    id: 'sofonia',
    titolo: 'Sofonia',
    categoriaId: 'profeti',
    descrizione:
      'Libro profetico dominato dal tema del giorno del Signore e della purificazione.',
    datazione: {
      datazioneIniziale: -640,
      datazioneFinale: -620,
      etichettaInizio: 'ca. 640 a.C.',
      etichettaFine: 'ca. 620 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('forme', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -640, -620, 'plausibile'),
    ],
    contestoStorico: [],
  },

  {
    id: 'aggeo',
    titolo: 'Aggeo',
    categoriaId: 'profeti',
    descrizione:
      'Oracoli legati alla ricostruzione del Tempio nel periodo persiano.',
    datazione: {
      datazioneIniziale: -520,
      datazioneFinale: -515,
      etichettaInizio: 'ca. 520 a.C.',
      etichettaFine: 'ca. 515 a.C.',
      certezza: 'consenso',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Oracoli e raccolta', -520, -515, 'consenso'),
    ],
    contestoStorico: [
      evento('Ricostruzione del Secondo Tempio', -520),
    ],
  },

  {
    id: 'zaccaria',
    titolo: 'Zaccaria',
    categoriaId: 'profeti',
    descrizione:
      'Libro profetico composito, con visioni del periodo persiano e successive raccolte profetiche.',
    datazione: {
      datazioneIniziale: -520,
      datazioneFinale: -480,
      etichettaInizio: 'ca. 520 a.C.',
      etichettaFine: 'ca. 480 a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi('tradizione', 'redazione'),
    eventiNarrati: [],
    redazione: [
      fase('Proto-Zaccaria', -520, -518, 'consenso'),
      fase('Seconda fase redazionale', -500, -480, 'dibattuta'),
    ],
    contestoStorico: [
      evento('Ricostruzione del Tempio', -520),
    ],
  },

  {
    id: 'malachia',
    titolo: 'Malachia',
    categoriaId: 'profeti',
    descrizione:
      'Oracoli post-esilici sulle pratiche cultuali, sull’alleanza e sulla vita della comunità.',
    datazione: {
      datazioneIniziale: -460,
      datazioneFinale: -450,
      etichettaInizio: 'ca. 460 a.C.',
      etichettaFine: 'ca. 450 a.C.',
      certezza: 'plausibile',
    },
    metodiAnalisi: metodi('redazione', 'tradizione'),
    eventiNarrati: [],
    redazione: [
      fase('Composizione', -460, -450, 'plausibile'),
    ],
    contestoStorico: [],
  },
];
