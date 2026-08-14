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

export const torah: Libro[] = [
  {
    id: 'genesi',
    titolo: 'Genesi',
    categoriaId: 'torah',
    descrizione:
      'Il libro delle origini: dalla creazione del mondo alle tradizioni patriarcali e alla discesa in Egitto.',
    datazione: {
      datazioneIniziale: -950,
      datazioneFinale: -400,
      etichettaInizio: 'tradizioni dal I millennio a.C.',
      etichettaFine: 'forma finale ca. V-IV sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'fonti',
      'forme',
      'tradizione',
      'redazione',
      'testuale',
    ),
    eventiNarrati: [
      evento(
        'Tradizioni patriarcali',
        -2000,
        'ricostruzione',
        'La collocazione dei patriarchi nel II millennio a.C. appartiene alla ricostruzione storica tradizionale; non esistono attestazioni archeologiche dirette di Abramo, Isacco o Giacobbe.',
      ),
      evento(
        'Tradizione di Giuseppe in Egitto',
        -1700,
        'ricostruzione',
        'Il racconto presenta motivi compatibili con ambienti egiziani e con la presenza di gruppi semitici, ma non consente un’identificazione storica diretta.',
      ),
      evento(
        'Tradizione dell’Esodo',
        -1250,
        'ricostruzione',
        'L’Esodo costituisce un evento fondativo della memoria d’Israele; la ricostruzione storica resta discussa.',
      ),
    ],
    redazione: [
      fase(
        'Tradizioni narrative non sacerdotali',
        -950,
        -700,
        'dibattuta',
        'Il modello critico contemporaneo tende a distinguere tradizioni narrative e strati non sacerdotali senza assumere necessariamente la ricostruzione documentaria classica J/E come certa.',
      ),
      fase(
        'Tradizione sacerdotale (P)',
        -550,
        -450,
        'plausibile',
        'Materiali sacerdotali caratterizzati da genealogie, ordinamento, culto e attenzione alla struttura della creazione e dell’alleanza.',
      ),
      fase(
        'Redazione e forma finale del Pentateuco',
        -450,
        -400,
        'dibattuta',
        'Processo di integrazione e raccordo delle differenti tradizioni nella forma pentateucale.',
      ),
    ],
    contestoStorico: [
      evento(
        'Tradizioni del Vicino Oriente antico',
        -1800,
        'storico',
        'Il mondo culturale della Genesi presenta numerosi punti di confronto con tradizioni mesopotamiche e levantine del Vicino Oriente antico.',
      ),
      evento(
        'Tradizioni mesopotamiche sul diluvio',
        -1600,
        'storico',
        'Il racconto biblico del diluvio può essere confrontato con tradizioni mesopotamiche più antiche, fra cui Atrahasis e l’epopea di Gilgamesh.',
      ),
      evento(
        'Stele di Merneptah',
        -1208,
        'storico',
        'La stele di Merneptah contiene una delle più antiche attestazioni extrabibliche del nome Israele in Canaan.',
      ),
    ],
  },

  {
    id: 'esodo',
    titolo: 'Esodo',
    categoriaId: 'torah',
    descrizione:
      'Il racconto dell’uscita dall’Egitto, dell’alleanza del Sinai e della costituzione di Israele come popolo dell’alleanza.',
    datazione: {
      datazioneIniziale: -950,
      datazioneFinale: -400,
      etichettaInizio: 'tradizioni dal I millennio a.C.',
      etichettaFine: 'forma finale ca. V-IV sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'fonti',
      'forme',
      'tradizione',
      'redazione',
      'testuale',
    ),
    eventiNarrati: [
      evento(
        'Tradizione dell’uscita dall’Egitto',
        -1250,
        'ricostruzione',
        'La memoria dell’Esodo è centrale per l’identità d’Israele, ma non è documentato dalle fonti egizie come un unico esodo di massa.',
      ),
      evento(
        'Tradizione del Sinai',
        -1250,
        'tradizionale',
        'La narrazione collega la liberazione dall’Egitto all’alleanza, alla legge e alla costituzione religiosa d’Israele.',
      ),
    ],
    redazione: [
      fase(
        'Tradizioni narrative non sacerdotali',
        -950,
        -700,
        'dibattuta',
      ),
      fase(
        'Tradizione sacerdotale (P)',
        -550,
        -450,
        'plausibile',
      ),
      fase(
        'Redazione pentateucale',
        -450,
        -400,
        'dibattuta',
      ),
    ],
    contestoStorico: [
      evento(
        'Egitto del Nuovo Regno',
        -1250,
        'storico',
        'Le tradizioni dell’Esodo vengono normalmente confrontate con il quadro storico dell’Egitto e del Levante nella tarda età del bronzo.',
      ),
    ],
  },

  {
    id: 'levitico',
    titolo: 'Levitico',
    categoriaId: 'torah',
    descrizione:
      'Raccolta legislativa e cultuale centrata su santità, sacrificio, impurità, sacerdozio e vita comunitaria.',
    datazione: {
      datazioneIniziale: -550,
      datazioneFinale: -400,
      etichettaInizio: 'ca. VI sec. a.C.',
      etichettaFine: 'forma finale ca. V-IV sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'redazione',
      'forme',
      'tradizione',
      'fonti',
      'testuale',
    ),
    eventiNarrati: [],
    redazione: [
      fase(
        'Tradizione sacerdotale (P)',
        -550,
        -450,
        'plausibile',
        'Il Levitico appartiene in larga misura all’orizzonte sacerdotale del Pentateuco.',
      ),
      fase(
        'Codice di Santità (H)',
        -500,
        -430,
        'dibattuta',
        'Lev 17–26 viene spesso distinto come complesso letterario specifico, comunemente denominato Codice di Santità.',
      ),
      fase(
        'Redazione finale',
        -450,
        -400,
        'dibattuta',
      ),
    ],
    contestoStorico: [
      evento(
        'Periodo esilico e post-esilico',
        -500,
        'storico',
        'Le forme sacerdotali vengono studiate nel quadro della riorganizzazione cultuale e comunitaria d’Israele.',
      ),
    ],
  },

  {
    id: 'numeri',
    titolo: 'Numeri',
    categoriaId: 'torah',
    descrizione:
      'Narrazioni, censimenti e materiali legislativi sul cammino nel deserto e sulla preparazione all’ingresso nella terra.',
    datazione: {
      datazioneIniziale: -900,
      datazioneFinale: -400,
      etichettaInizio: 'tradizioni antiche',
      etichettaFine: 'forma finale ca. V-IV sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'fonti',
      'tradizione',
      'redazione',
      'forme',
      'testuale',
    ),
    eventiNarrati: [
      evento(
        'Peregrinazione nel deserto',
        -1250,
        'tradizionale',
        'La narrazione colloca Israele nel deserto fra il Sinai e le pianure di Moab.',
      ),
    ],
    redazione: [
      fase(
        'Tradizioni narrative non sacerdotali',
        -900,
        -700,
        'dibattuta',
      ),
      fase(
        'Tradizione sacerdotale (P)',
        -550,
        -450,
        'plausibile',
      ),
      fase(
        'Materiali di santità e rielaborazioni sacerdotali',
        -500,
        -430,
        'dibattuta',
      ),
      fase(
        'Redazione pentateucale',
        -450,
        -400,
        'dibattuta',
      ),
    ],
    contestoStorico: [],
  },

  {
    id: 'deuteronomio',
    titolo: 'Deuteronomio',
    categoriaId: 'torah',
    descrizione:
      'Riformulazione della legge in forma di discorsi mosaici, centrata sull’alleanza, sull’unicità di YHWH e sulla fedeltà alla Torah.',
    datazione: {
      datazioneIniziale: -700,
      datazioneFinale: -500,
      etichettaInizio: 'tradizioni dal VII sec. a.C.',
      etichettaFine: 'redazioni fino al VI-V sec. a.C.',
      certezza: 'dibattuta',
    },
    metodiAnalisi: metodi(
      'fonti',
      'redazione',
      'tradizione',
      'forme',
      'testuale',
    ),
    eventiNarrati: [
      evento(
        'Discorsi di Mosè nelle pianure di Moab',
        -1250,
        'tradizionale',
        'La cornice narrativa presenta Mosè mentre trasmette la legge prima dell’ingresso nella terra.',
      ),
    ],
    redazione: [
      fase(
        'Nucleo deuteronomico',
        -700,
        -622,
        'dibattuta',
        'Un nucleo legislativo viene spesso collegato agli sviluppi religiosi e politici del VII secolo a.C.',
      ),
      fase(
        'Rielaborazione deuteronomistica',
        -620,
        -580,
        'plausibile',
      ),
      fase(
        'Redazione esilica e post-esilica',
        -560,
        -500,
        'plausibile',
      ),
    ],
    contestoStorico: [
      evento(
        'Riforma di Giosia',
        -622,
        'storico',
        'La narrazione di 2 Re 22–23 collega la riforma cultuale al ritrovamento di un libro della legge nel Tempio.',
      ),
      evento(
        'Esilio babilonese',
        -586,
        'storico',
        'L’esperienza dell’esilio costituisce uno sfondo fondamentale per le riletture deuteronomistiche dell’alleanza e della storia.',
      ),
    ],
  },
];
