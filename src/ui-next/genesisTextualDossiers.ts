export type TextualDossier = {
  id: string;
  startVerse: number;
  endVerse: number;
  title: string;
  question: string;
  witnessComparison: string;
  interpretation: string;
  methodologicalNote: string;
  reception?: string;
  bibliography: string[];
};

const WENHAM = 'G. J. Wenham, Genesis 1–15, Word Biblical Commentary 1, 1987, pp. 11–33.';
const WESTERMANN = 'C. Westermann, Genesis 1–11: A Commentary, 1984, pp. 93–161.';
const SARNA = 'N. M. Sarna, Genesis, JPS Torah Commentary, 1989, pp. 5–14.';
const CARR = 'D. M. Carr, The Formation of Genesis 1–11, Oxford University Press, 2020, pp. 15–63.';

export const genesisOneTextualDossiers: TextualDossier[] = [
  {
    id: 'gen-1-1-3',
    startVerse: 1,
    endVerse: 3,
    title: 'Inizio, stato primordiale e prima parola',
    question: 'Gen 1,1 è una frase principale compiuta oppure introduce temporalmente ciò che segue? E come va inteso ruach elohim in 1,2?',
    witnessComparison: 'Il MT consente di discutere bereshit come inizio assoluto oppure come forma legata a una proposizione successiva. La LXX (en archē) e la Vulgata (in principio) sostengono la lettura tradizionale come apertura autonoma, seguita dalla descrizione della terra e dal comando della luce. CEI segue questa linea. In 1,2 LXX traduce pneuma theou e Vulgata spiritus Dei; l’ebraico ruach può però indicare spirito, vento o soffio.',
    interpretation: 'Sono grammaticalmente difendibili sia “In principio Dio creò…” sia, con diverse articolazioni, “Quando Dio cominciò a creare…”. La scelta modifica il rapporto sintattico fra 1,1 e 1,2, ma non introduce nei testimoni una narrazione alternativa. Ruach elohim può essere letto come presenza/azione divina oppure come vento impetuoso proveniente da Dio; il solo lessico non chiude la questione.',
    methodologicalNote: 'La sintassi e la polisemia non sono varianti manoscritte. MT, LXX e Vulgata attestano qui soprattutto diverse possibilità di comprensione e traduzione dello stesso avvio narrativo.',
    reception: 'La lettura cristiana collega legittimamente “principio”, parola e Spirito ad altri testi canonici, soprattutto Gv 1. Questa è una rilettura teologica della forma canonica, non la prova che la grammatica ebraica di Gen 1,1–3 esprima già una formulazione trinitaria.',
    bibliography: [WENHAM, WESTERMANN, SARNA],
  },
  {
    id: 'gen-1-14-18',
    startVerse: 14,
    endVerse: 18,
    title: 'I luminari senza nome',
    question: 'Perché il racconto parla di “luminare maggiore” e “luminare minore” invece di nominare sole e luna?',
    witnessComparison: 'Il MT usa me’orot, “luminari”, e distingue il grande e il piccolo luminare. LXX rende phōstēres e Vulgata luminaria; anche le versioni conservano dunque la designazione funzionale. La differenza più visibile è traduttiva e lessicale, non una variante che aggiunga o elimini gli astri.',
    interpretation: 'Gli astri sono collocati nel firmamento per illuminare, distinguere giorno e notte e regolare feste, giorni e anni. Il racconto li presenta come opere create e assegna loro funzioni; non li tratta come potenze divine autonome. L’assenza dei nomi ordinari di sole e luna rafforza letterariamente questa subordinazione.',
    methodologicalNote: 'Parlare di “demitizzazione” è una sintesi interpretativa plausibile, non la dimostrazione di una polemica diretta contro un singolo mito o culto. Il confronto con il Vicino Oriente antico illumina il contrasto culturale, ma non prova dipendenza letteraria puntuale.',
    bibliography: [WENHAM, WESTERMANN, CARR],
  },
  {
    id: 'gen-1-26-28',
    startVerse: 26,
    endVerse: 28,
    title: 'Immagine di Dio e responsabilità umana',
    question: 'Che cosa indicano “immagine” e “somiglianza”, chi parla nel plurale “facciamo” e quale limite ha il dominio umano?',
    witnessComparison: 'Il MT accosta tselem, “immagine”, e demut, “somiglianza”. LXX rende eikōn e homoiōsis, Vulgata imago e similitudo; nessuno dei tre testimoni impone da solo due componenti antropologiche separate. Tutti conservano il plurale deliberativo di 1,26 e il passaggio al singolare dell’azione creatrice in 1,27.',
    interpretation: 'Nel contesto antico l’immagine richiama soprattutto rappresentanza e funzione regale: Genesi estende questa dignità all’umanità, maschio e femmina, non soltanto al sovrano. Le proposte sul “facciamo” — corte celeste, deliberazione divina, pluralità retorica — restano discusse. I verbi del dominio sono forti, ma il testo li colloca dentro una vocazione ricevuta e un mondo dichiarato buono, non dentro un’autorizzazione allo sfruttamento illimitato.',
    methodologicalNote: 'La somiglianza con ideologie regali del Vicino Oriente non riduce il testo a loro copia: l’estensione universale dell’immagine ne trasforma la portata. La responsabilità ecologica è una conseguenza etica e canonica motivata, ma va distinta dal significato storico immediato dei singoli verbi.',
    reception: 'La tradizione cristiana ha letto il plurale e l’immagine di Dio in prospettiva trinitaria e cristologica. Questa ricezione appartiene alla lettura canonica della Chiesa; non deve essere retroproiettata come unica spiegazione storico-grammaticale del plurale ebraico.',
    bibliography: [WENHAM, WESTERMANN, SARNA, CARR],
  },
];
