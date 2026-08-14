export interface Datazione {
  etichettaInizio?: string;
  etichettaFine?: string;
  datazioneIniziale?: number;
  datazioneFinale?: number;
  certezza?: string;
  nota?: string;
}

// NUOVO: Profilo Letterario
export interface ProfiloLetterario {
  generePrincipale?: string;
  generiSecondari?: string[];
  strutturaGenerale?: string;
  criteriCompositivi?: string;
  notaMetodologica?: string;
}

// NUOVO: Macro-Sezioni
export interface MacroSezione {
  etichetta?: string;
  sigla?: string;
  capitoloInizio?: number;
  versettoInizio?: number;
  capitoloFine?: number;
  versettoFine?: number;
  tipo?: string;
  certezza?: string;
  descrizione?: string;
  notaCritica?: string;
}

export interface MetodoAnalisi {
  metodo: string;
  domanda?: string;
  sintesi?: string;
  analisi?: string;
}

export interface EventoFocus {
  etichetta: string;
  inizio?: number;
  fine?: number;
  certezza?: string;
  descrizione?: string;
}

export interface StratoRedazione {
  etichetta: string;
  fonte?: { sigla?: string; nome?: string };
  inizio: number;
  fine: number;
  datazione?: string;
  certezza?: string;
  descrizione?: string;
  motivazione?: string;
}

export interface Libro {
  id: string;
  titolo: string;
  titoloEbraico?: string;
  categoriaId: string;
  ordine?: number;
  capitoli?: number;
  lingua?: string;
  
  // NUOVI CAMPI
  profiloLetterario?: ProfiloLetterario;
  macroSezioni?: MacroSezione[];

  datazione?: Datazione;
  descrizione?: string;
  metodiAnalisi?: MetodoAnalisi[];
  mondoDietroIlTesto?: string;
  eventiNarrati?: EventoFocus[];
  mondoDelTesto?: string;
  redazione?: StratoRedazione[];
  mondoAttornoAlTesto?: string;
  contestoStorico?: EventoFocus[];
}
export interface Categoria {
  id: string;
  etichetta: string;
  colore: string;
}
