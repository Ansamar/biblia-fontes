import type { Libro } from '../types';

export const torah: Libro[] = [
  {
    id: 'genesi',
    titolo: 'Genesi',
    categoriaId: 'torah',
    datazioneIniziale: [-950],
    datazioneFinale: [-400],
    descrizione: 'Il libro delle origini: dalla creazione del mondo ai patriarchi.',
    metodiPrincipali: ['fonti', 'forme', 'tradizione'],
    eventiNarrati: [
      { 
        id: 'ev1', 
        anno: [-2000], 
        etichetta: 'Patriarchi (Abramo)', 
        certezza: 'bassa', 
        descrizione: 'La tradizione biblica colloca Abramo, Isacco e Giacobbe nell\'età del Bronzo Medio. Sebbene non ci siano prove archeologiche dirette dei patriarchi, i costumi giuridici e i nomi raccontati riflettono l\'ambiente del II millennio a.C.' 
      },
      { 
        id: 'ev2', 
        anno: [-1700], 
        etichetta: 'Giuseppe in Egitto', 
        certezza: 'bassa', 
        descrizione: 'Racconto di ascesa di uno straniero a corte. Presenta echi della storia di figure semitiche in Egitto (come gli Hyksos), ma manca di conferme storiche dirette.' 
      },
      { 
        id: 'ev3', 
        anno: [-1250], 
        etichetta: 'Esodo (Mosè)', 
        certezza: 'bassa', 
        descrizione: 'L\'evento fondativo di Israele. Nessuna fonte egizia menziona un esodo di massa o le dieci piaghe, ma la stele di Merneptah (1208 a.C.) attesta che Israele era già presente in Canaan in quest\'epoca.' 
      }
    ],
    redazione: [
      { 
        id: 'str1', 
        etichetta: 'Fonte J', 
        inizio: [-950], 
        fine: [-850], 
        colore: '#B0532C', 
        certezza: 'media', 
        descrizione: 'La fonte Jahwista (J) prende il nome dall\'uso del nome proprio di Dio (YHWH). Si ritiene sia stata composta nel Regno del Sud (Giuda) intorno al X-IX sec a.C. Usa un linguaggio antropomorfico.' 
      },
      { 
        id: 'str2', 
        etichetta: 'Fonte E', 
        inizio: [-850], 
        fine: [-750], 
        colore: '#7D8C6B', 
        certezza: 'bassa', 
        descrizione: 'La fonte Elohista (E) usa il termine generico "Elohim" per Dio. Originaria del Regno del Nord (Israele), enfatizza i sogni e i profeti.' 
      },
      { 
        id: 'str3', 
        etichetta: 'Fonte P', 
        inizio: [-550], 
        fine: [-450], 
        colore: '#5A4B81', 
        certezza: 'alta', 
        descrizione: 'La fonte Sacerdotale (P) riflette la teologia del post-esilio. Ha uno stile sobrio, ripetitivo e liturgico. Sottolinea l\'ordine della creazione e le genealogie.' 
      },
      { 
        id: 'str4', 
        etichetta: 'Redazione Finale', 
        inizio: [-450], 
        fine: [-400], 
        colore: '#2A2420', 
        certezza: 'alta', 
        descrizione: 'Un redatore (spesso identificato come Ezra) ha intrecciato le fonti J, E, D e P in un unico rotolo continuo, dando alla Genesi la forma in cui la leggiamo oggi.' 
      }
    ],
    contestoStorico: [
      { 
        id: 'ctx1', 
        anno: [-1800], 
        etichetta: 'Archivi di Ebla', 
        certezza: 'alta', 
        descrizione: 'Gli scavi di Tell Mardikh in Siria hanno riportato alla luce tavolette cuneiformi contenenti nomi semitici come Abramo, Ismaele, Israele.' 
      },
      { 
        id: 'ctx2', 
        anno: [-1600], 
        etichetta: 'Poema di Gilgamesh', 
        certezza: 'alta', 
        descrizione: 'La versione babilonese del diluvio universale (Tavola XI), antecedente alla stesura biblica, dimostra che il mito del diluvio era diffuso in Mesopotamia.' 
      },
      { 
        id: 'ctx3', 
        anno: [-1208], 
        etichetta: 'Stele di Merneptah', 
        certezza: 'alta', 
        descrizione: 'La prima menzione extrabiblica di "Israele". Il faraone Merneptah si vanta di aver sconfitto questo popolo, dimostrando che Israele era già insediato in Canaan.' 
      }
    ]
  },
  {
    id: 'esodo',
    titolo: 'Esodo',
    categoriaId: 'torah',
    datazioneIniziale: [-950],
    datazioneFinale: [-400],
    descrizione: 'L\'uscita dall\'Egitto, l\'alleanza del Sinai e la donazione della Legge.',
    metodiPrincipali: ['fonti', 'forme'],
    eventiNarrati: [
      { id: 'ev1', anno: [-1250], etichetta: 'Esodo dall\'Egitto', certezza: 'bassa', descrizione: 'Nessuna fonte egizia menziona un esodo di massa.' }
    ],
    redazione: [
      { id: 'str1', etichetta: 'Fonte J', inizio: [-950], fine: [-850], colore: '#B0532C', certezza: 'media' },
      { id: 'str2', etichetta: 'Fonte P', inizio: [-550], fine: [-450], colore: '#5A4B81', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'levitico',
    titolo: 'Levitico',
    categoriaId: 'torah',
    datazioneIniziale: [-550],
    datazioneFinale: [-450],
    descrizione: 'Il manuale liturgico e di santità dei sacerdoti.',
    metodiPrincipali: ['redazione', 'forme'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Fonte P', inizio: [-550], fine: [-450], colore: '#5A4B81', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'numeri',
    titolo: 'Numeri',
    categoriaId: 'torah',
    datazioneIniziale: [-950],
    datazioneFinale: [-400],
    descrizione: 'Il censimento e il viaggio nel deserto verso la Terra Promessa.',
    metodiPrincipali: ['fonti', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Fonte J', inizio: [-950], fine: [-850], colore: '#B0532C', certezza: 'media' },
      { id: 'str2', etichetta: 'Fonte P', inizio: [-550], fine: [-450], colore: '#5A4B81', certezza: 'alta' }
    ],
    contestoStorico: []
  },
  {
    id: 'deuteronomio',
    titolo: 'Deuteronomio',
    categoriaId: 'torah',
    datazioneIniziale: [-700],
    datazioneFinale: [-500],
    descrizione: 'La ripetizione della Legge e l\'alleanza moabitica.',
    metodiPrincipali: ['fonti', 'redazione', 'tradizione'],
    eventiNarrati: [],
    redazione: [
      { id: 'str1', etichetta: 'Nucleo Deuteronomico', inizio: [-700], fine: [-622], colore: '#3E6E82', certezza: 'alta' },
      { id: 'str2', etichetta: 'Redazione Esilica', inizio: [-560], fine: [-540], colore: '#2A2420', certezza: 'alta' }
    ],
    contestoStorico: [
      { id: 'ctx1', anno: [-622], etichetta: 'Riforma di Giosia', certezza: 'alta', descrizione: 'Ritrovamento del rotolo della Legge nel Tempio.' }
    ]
  }
];