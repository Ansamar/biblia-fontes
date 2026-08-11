import type { Libro } from '../types';

export const sapienziali: Libro[] = [
  {
    id: 'giobbe',
    titolo: 'Giobbe',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-550],
    datazioneFinale: [-350],
    descrizione: 'Il dramma della sofferenza innocente.',
    metodiPrincipali: ['redazione', 'forme'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Dialoghi Poetici', inizio: [-550], fine: [-450], colore: '#7D8C6B', certezza: 'media' },
      { id: 'str2', etichetta: 'Cornice Narrativa', inizio: [-450], fine: [-350], colore: '#2A2420', certezza: 'media' }
    ],
    contestoStorico: []
  },
  {
    id: 'salmi',
    titolo: 'Salmi',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-1000],
    datazioneFinale: [-150],
    descrizione: 'Il libro di preghiere e inni di Israele.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [{ id: 'ev1', anno: [-1000], etichetta: 'Era di Davide', certezza: 'media' }],
    redazione: [
      { id: 'str1', etichetta: 'Salmi Pre-esilici', inizio: [-1000], fine: [-586], colore: '#7D8C6B', certezza: 'media' },
      { id: 'str2', etichetta: 'Salmi Post-esilici', inizio: [-538], fine: [-150], colore: '#5A4B81', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'proverbi',
    titolo: 'Proverbi',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-950],
    datazioneFinale: [-300],
    descrizione: 'Raccolta di massime sapienziali.',
    metodiPrincipali: ['forme', 'fonti'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Raccolte Salomoniche', inizio: [-950], fine: [-700], colore: '#7D8C6B', certezza: 'media' },
      { id: 'str2', etichetta: 'Redazione Finale', inizio: [-500], fine: [-300], colore: '#2A2420', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'qoelet',
    titolo: 'Qoelet',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-280],
    datazioneFinale: [-220],
    descrizione: 'La meditazione scettica sulla vanità.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Composizione', inizio: [-280], fine: [-220], colore: '#7D8C6B', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'cantico',
    titolo: 'Cantico dei Cantici',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-350],
    datazioneFinale: [-250],
    descrizione: 'Poesia d\'amore attribuita a Salomone.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Composizione', inizio: [-350], fine: [-250], colore: '#7D8C6B', certezza: 'media' }
    ],
    contestoStorico: []
  },
  {
    id: 'sapienza',
    titolo: 'Sapienza',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-80],
    datazioneFinale: [-40],
    descrizione: 'Composizione greca di ispirazione salomonica.',
    metodiPrincipali: ['redazione', 'forme'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Composizione', inizio: [-80], fine: [-40], colore: '#A68A5B', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'siracide',
    titolo: 'Siracide',
    categoriaId: 'sapienziali',
    datazioneIniziale: [-190],
    datazioneFinale: [-175],
    descrizione: 'Sapienza di Ben Sira.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Composizione Ebraica', inizio: [-190], fine: [-175], colore: '#7D8C6B', certezza: 'alta' },
      { id: 'str2', etichetta: 'Traduzione Greca', inizio: [-132], fine: [-130], colore: '#A68A5B', certezza: 'alta' }
    ],
    contestoStorico: []
  }
];