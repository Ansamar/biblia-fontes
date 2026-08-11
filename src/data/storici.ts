import type { Libro } from '../types';

export const storici: Libro[] = [
  {
    id: 'giosue',
    titolo: 'Giosuè',
    categoriaId: 'storici',
    datazioneIniziale: [-650],
    datazioneFinale: [-500],
    descrizione: 'La conquista della Terra Promessa.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [{ id: 'ev1', anno: [-1200], etichetta: 'Conquista di Canaan', certezza: 'bassa' }],
    redazione: [{ id: 'str1', etichetta: 'Storia Deuteronomistica', inizio: [-620], fine: [-550], colore: '#3E6E82', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'giudici',
    titolo: 'Giudici',
    categoriaId: 'storici',
    datazioneIniziale: [-650],
    datazioneFinale: [-500],
    descrizione: 'Il periodo caotico prima della monarchia.',
    metodiPrincipali: ['redazione', 'forme'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Storia Deuteronomistica', inizio: [-620], fine: [-550], colore: '#3E6E82', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'rut',
    titolo: 'Rut',
    categoriaId: 'storici',
    datazioneIniziale: [-500],
    datazioneFinale: [-300],
    descrizione: 'Una novella di pietà familiare.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-500], fine: [-300], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'samuele',
    titolo: '1-2 Samuele',
    categoriaId: 'storici',
    datazioneIniziale: [-950],
    datazioneFinale: [-550],
    descrizione: 'La nascita della monarchia con Saul e Davide.',
    metodiPrincipali: ['redazione', 'fonti'],
    eventiNarrati: [{ id: 'ev1', anno: [-1000], etichetta: 'Regno di Davide', certezza: 'alta' }],
    redazione: [
      { id: 'str1', etichetta: 'Storia della Successione', inizio: [-950], fine: [-850], colore: '#B0532C', certezza: 'alta' },
      { id: 'str2', etichetta: 'Redazione Deuteronomistica', inizio: [-620], fine: [-550], colore: '#3E6E82', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 're',
    titolo: '1-2 Re',
    categoriaId: 'storici',
    datazioneIniziale: [-620],
    datazioneFinale: [-540],
    descrizione: 'Storia dei re di Israele e Giuda fino all\'esilio.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [{ id: 'ev1', anno: [-586], etichetta: 'Distruzione di Gerusalemme', certezza: 'alta' }],
    redazione: [
      { id: 'str1', etichetta: 'Prima Edizione', inizio: [-620], fine: [-609], colore: '#3E6E82', certezza: 'media' },
      { id: 'str2', etichetta: 'Redazione Esilica', inizio: [-560], fine: [-540], colore: '#2A2420', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'cronache',
    titolo: '1-2 Cronache',
    categoriaId: 'storici',
    datazioneIniziale: [-350],
    datazioneFinale: [-250],
    descrizione: 'Rilettura della storia dalla creazione all\'esilio.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Redazione Cronistica', inizio: [-350], fine: [-250], colore: '#3E6E82', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'esdra',
    titolo: 'Esdra-Neemia',
    categoriaId: 'storici',
    datazioneIniziale: [-400],
    datazioneFinale: [-300],
    descrizione: 'Il ritorno dall\'esilio e la riforma religiosa.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [{ id: 'ev1', anno: [-538], etichetta: 'Editto di Ciro', certezza: 'alta' }],
    redazione: [{ id: 'str1', etichetta: 'Redazione Cronistica', inizio: [-400], fine: [-300], colore: '#3E6E82', certezza: 'alta' }],
    contestoStorico: []
  },
  {
    id: 'tobia',
    titolo: 'Tobia',
    categoriaId: 'storici',
    datazioneIniziale: [-225],
    datazioneFinale: [-175],
    descrizione: 'Romanzo di pietà familiare di origine aramaica.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-225], fine: [-175], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'giuditta',
    titolo: 'Giuditta',
    categoriaId: 'storici',
    datazioneIniziale: [-150],
    datazioneFinale: [-100],
    descrizione: 'Racconto di salvezza nazionale.',
    metodiPrincipali: ['forme', 'tradizione'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-150], fine: [-100], colore: '#3E6E82', certezza: 'media' }],
    contestoStorico: []
  },
  {
    id: 'ester',
    titolo: 'Ester',
    categoriaId: 'storici',
    datazioneIniziale: [-350],
    datazioneFinale: [-150],
    descrizione: 'Romanzo di corte a Susa.',
    metodiPrincipali: ['testuale', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Redazione Ebraica', inizio: [-350], fine: [-300], colore: '#3E6E82', certezza: 'alta' },
      { id: 'str2', etichetta: 'Addizioni Greche', inizio: [-150], fine: [-100], colore: '#A68A5B', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'maccabei',
    titolo: '1-2 Maccabei',
    categoriaId: 'storici',
    datazioneIniziale: [-134],
    datazioneFinale: [-63],
    descrizione: 'La rivolta dei Maccabei contro l\'ellenismo.',
    metodiPrincipali: ['redazione', 'tradizione'],
    eventiNarrati: [{ id: 'ev1', anno: [-167], etichetta: 'Profanazione del Tempio', certezza: 'alta' }],
    redazione: [{ id: 'str1', etichetta: 'Composizione', inizio: [-134], fine: [-63], colore: '#3E6E82', certezza: 'alta' }],
    contestoStorico: []
  }
];