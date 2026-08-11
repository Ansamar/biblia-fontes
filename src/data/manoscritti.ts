import type { Libro } from '../types';

export const manoscritti: Libro[] = [
  {
    id: 'qumran',
    titolo: 'I rotoli di Qumran',
    categoriaId: 'manoscritti',
    datazioneIniziale: [-250],
    datazioneFinale: [-68],
    descrizione: 'Copie manoscritte reali dei libri biblici.',
    metodiPrincipali: ['testuale'],
    eventiNarrati: [],
    redazione: [{ id: 'str1', etichetta: 'Attività di copia', inizio: [-250], fine: [-68], colore: '#8C6A3F', certezza: 'alta' }],
    contestoStorico: [{ id: 'ctx1', anno: [-68], etichetta: 'Distruzione di Qumran (Romani)', certezza: 'alta' }]
  }
];