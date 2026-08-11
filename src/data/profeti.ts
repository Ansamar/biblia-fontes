import type { Libro } from '../types';

export const profeti: Libro[] = [
  {
    id: 'isaia',
    titolo: 'Isaia (Proto · Deutero · Trito)',
    categoriaId: 'profeti',
    datazioneIniziale: [-740],
    datazioneFinale: [-450],
    descrizione: 'Un solo rotolo, tre epoche storiche.',
    metodiPrincipali: ['tradizione', 'redazione', 'fonti'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Proto-Isaia', inizio: [-740], fine: [-700], colore: '#B0532C', certezza: 'alta' },
      { id: 'str2', etichetta: 'Deutero-Isaia', inizio: [-550], fine: [-539], colore: '#3E6E82', certezza: 'alta' },
      { id: 'str3', etichetta: 'Trito-Isaia', inizio: [-539], fine: [-450], colore: '#5A4B81', certezza: 'bassa' }
    ],
    contestoStorico: [{ id: 'ctx1', anno: [-722], etichetta: 'Caduta di Samaria', certezza: 'alta' }]
  },
  {
    id: 'geremia',
    titolo: 'Geremia',
    categoriaId: 'profeti',
    datazioneIniziale: [-627],
    datazioneFinale: [-500],
    descrizione: 'Il profeta della caduta di Gerusalemme.',
    metodiPrincipali: ['redazione', 'tradizione', 'testuale'],
    eventiNarrati: [{ id: 'ev1', anno: [-586], etichetta: 'Distruzione del Tempio', certezza: 'alta' }],
    redazione: [
      { id: 'str1', etichetta: 'Oracoli Profetici', inizio: [-627], fine: [-580], colore: '#B0532C', certezza: 'alta' },
      { id: 'str2', etichetta: 'Redazione Deuteronomistica', inizio: [-560], fine: [-500], colore: '#3E6E82', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'lamentazioni',
    titolo: 'Lamentazioni',
    categoriaId: 'profeti',
    datazioneIniziale: [-586],
    datazioneFinale: [-520],
    descrizione: 'Cinque poemi sulla distruzione di Gerusalemme.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-586], fine: [-520], colore: '#B0532C', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'baruc',
    titolo: 'Baruc',
    categoriaId: 'profeti',
    datazioneIniziale: [-150],
    datazioneFinale: [-50],
    descrizione: 'Mosaico di sezioni indipendenti.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-150], fine: [-50], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'ezechiele',
    titolo: 'Ezechiele',
    categoriaId: 'profeti',
    datazioneIniziale: [-593],
    datazioneFinale: [-530],
    descrizione: 'Visioni dell\'esilio babilonese e del nuovo Tempio.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Oracoli dell\'Esilio', inizio: [-593], fine: [-571], colore: '#5A4B81', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'daniele',
    titolo: 'Daniele',
    categoriaId: 'profeti',
    datazioneIniziale: [-300],
    datazioneFinale: [-164],
    descrizione: 'Apocalittica e racconti di corte nel periodo maccabaico.',
    metodiPrincipali: ['redazione', 'forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Racconti di Corte', inizio: [-300], fine: [-200], colore: '#8C6A3F', certezza: 'media' },
      { id: 'str2', etichetta: 'Visioni Apocalittiche', inizio: [-167], fine: [-164], colore: '#7A2E2E', certezza: 'alta' }
    ],
    contestoStorico: [{ id: 'ctx1', anno: [-164], etichetta: 'Rivolta dei Maccabei', certezza: 'alta' }]
  },
  {
    id: 'osea',
    titolo: 'Osea',
    categoriaId: 'profeti',
    datazioneIniziale: [-750],
    datazioneFinale: [-720],
    descrizione: 'Profeta del regno del Nord.',
    metodiPrincipali: ['tradizione', 'forme'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-750], fine: [-720], colore: '#B0532C', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'gioele',
    titolo: 'Gioele',
    categoriaId: 'profeti',
    datazioneIniziale: [-400],
    datazioneFinale: [-300],
    descrizione: 'L\'invasione delle cavallette.',
    metodiPrincipali: ['tradizione', 'forme'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-400], fine: [-300], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'amos',
    titolo: 'Amos',
    categoriaId: 'profeti',
    datazioneIniziale: [-760],
    datazioneFinale: [-740],
    descrizione: 'Il pastore di Tekoa.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-760], fine: [-740], colore: '#B0532C', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'abdia',
    titolo: 'Abdia',
    categoriaId: 'profeti',
    datazioneIniziale: [-586],
    datazioneFinale: [-500],
    descrizione: 'Contro Edom.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-586], fine: [-500], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'giona',
    titolo: 'Giona',
    categoriaId: 'profeti',
    datazioneIniziale: [-400],
    datazioneFinale: [-300],
    descrizione: 'Novella didattica.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-400], fine: [-300], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'michea',
    titolo: 'Michea',
    categoriaId: 'profeti',
    datazioneIniziale: [-740],
    datazioneFinale: [-700],
    descrizione: 'Contro Samaria e Gerusalemme.',
    metodiPrincipali: ['tradizione', 'redazione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-740], fine: [-700], colore: '#B0532C', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'naum',
    titolo: 'Naum',
    categoriaId: 'profeti',
    datazioneIniziale: [-650],
    datazioneFinale: [-610],
    descrizione: 'La caduta di Ninive.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-650], fine: [-610], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'abacuc',
    titolo: 'Abacuc',
    categoriaId: 'profeti',
    datazioneIniziale: [-620],
    datazioneFinale: [-600],
    descrizione: 'Il dialogo con Dio sull\'ingiustizia.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-620], fine: [-600], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'sofonia',
    titolo: 'Sofonia',
    categoriaId: 'profeti',
    datazioneIniziale: [-640],
    datazioneFinale: [-620],
    descrizione: 'Il giorno del Signore.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-640], fine: [-620], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'aggeo',
    titolo: 'Aggeo',
    categoriaId: 'profeti',
    datazioneIniziale: [-520],
    datazioneFinale: [-515],
    descrizione: 'La ricostruzione del Tempio.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-520], fine: [-515], colore: '#3E6E82', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'zaccaria',
    titolo: 'Zaccaria',
    categoriaId: 'profeti',
    datazioneIniziale: [-520],
    datazioneFinale: [-480],
    descrizione: 'Visioni per il futuro di Gerusalemme.',
    metodiPrincipali: ['tradizione', 'redazione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Proto-Zaccaria', inizio: [-520], fine: [-518], colore: '#3E6E82', certezza: 'alta' },
      { id: 'str2', etichetta: 'Trito-Zaccaria', inizio: [-500], fine: [-480], colore: '#5A4B81', certezza: 'media' }
    ],
    contestoStorico: []
  },
  {
    id: 'malachia',
    titolo: 'Malachia',
    categoriaId: 'profeti',
    datazioneIniziale: [-460],
    datazioneFinale: [-450],
    descrizione: 'Contro i matrimoni misti e le offerte inique.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-460], fine: [-450], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  }
];