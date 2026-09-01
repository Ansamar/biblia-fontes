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
const WENHAM_2_3 = 'G. J. Wenham, Genesis 1–15, Word Biblical Commentary 1, 1987, commento a Gen 2,1–3,24.';
const WESTERMANN_2_3 = 'C. Westermann, Genesis 1–11: A Commentary, 1984, commento a Gen 2,4b–3,24.';
const SARNA_2_3 = 'N. M. Sarna, Genesis, JPS Torah Commentary, 1989, commento a Gen 2–3.';

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

export const genesisTwoTextualDossiers: TextualDossier[] = [
  {
    id: 'gen-2-1-3',
    startVerse: 1,
    endVerse: 3,
    title: 'Il compimento: sesto o settimo giorno?',
    question: 'In quale giorno Dio “portò a compimento” l’opera e quale rapporto lega compimento, cessazione e santificazione del settimo giorno?',
    witnessComparison: 'Il MT legge che Dio completò la propria opera “nel settimo giorno” e cessò nel settimo; la Vulgata segue con die septimo. La LXX, invece, pone il compimento “nel sesto giorno” e la cessazione nel settimo, probabilmente per evitare l’impressione che un’attività fosse ancora compiuta durante il sabato. CEI conserva la lettura del MT. È una differenza testuale reale, non una semplice scelta stilistica italiana.',
    interpretation: 'Nel MT il settimo giorno non è un’aggiunta dopo la creazione: ne costituisce il compimento. Il verbo shabat indica innanzitutto il cessare dall’opera; il testo benedice e santifica il tempo, mentre non prescrive ancora direttamente a Israele l’osservanza sabbatica. La variante greca rende più netta la separazione fra lavoro concluso e riposo.',
    methodologicalNote: 'La LXX può riflettere una diversa Vorlage ebraica oppure una chiarificazione intenzionale del traduttore; senza un testimone ebraico antico corrispondente non è possibile decidere con certezza. Entrambe le forme sono antiche e teologicamente coerenti.',
    reception: 'La tradizione ebraica e cristiana leggerà questi versetti alla luce dei comandamenti sul sabato. Questa ricezione è fondata sul testo canonico, ma va distinta dalla funzione letteraria originaria dei vv. 1–3 come conclusione di Gen 1,1–2,3.',
    bibliography: [WENHAM_2_3, WESTERMANN, SARNA_2_3],
  },
  {
    id: 'gen-2-4-7',
    startVerse: 4,
    endVerse: 7,
    title: 'Adam dalla adamah: terra, polvere e vita',
    question: 'Il testo racconta una seconda creazione e che cosa afferma dell’essere umano quando lo descrive come polvere animata dal soffio divino?',
    witnessComparison: 'Il MT costruisce un gioco intraducibile fra ha-adam, l’essere umano, e ha-adamah, il suolo. LXX rende anthrōpos e gē; Vulgata homo e terra/limus. In 2,6 il raro ’ed è interpretato dalla LXX e dalla Vulgata come sorgente, seguito dalla CEI con “polla d’acqua”, ma sono state proposte anche umidità o corrente. In 2,7 tutti i testimoni descrivono l’umano che diviene un essere vivente, non l’inserimento di un’anima separata in un corpo già completo.',
    interpretation: 'Gen 2,4b apre un racconto non sacerdotale con ordine, stile e nome divino differenti da Gen 1. Non è una ripetizione armonizzata: focalizza su suolo, acqua, lavoro e relazione. L’essere umano è simultaneamente fragile — polvere della terra — e vivente per il respiro ricevuto da Dio. Nephesh hayyah indica la persona/creatura vivente nella sua totalità.',
    methodologicalNote: 'Parlare di “secondo racconto della creazione” descrive una distinzione letteraria, non due eventi storici consecutivi. Le ricostruzioni J/P restano modelli critici; la forma canonica conserva intenzionalmente entrambe le prospettive.',
    reception: 'L’antropologia cristiana può articolare corpo e anima alla luce dell’intero canone e della tradizione dottrinale. Non deve però trasformare nephesh hayyah, da sola, in un tecnicismo filosofico estraneo al lessico narrativo ebraico.',
    bibliography: [WENHAM_2_3, WESTERMANN_2_3, SARNA_2_3, CARR],
  },
  {
    id: 'gen-2-18-24',
    startVerse: 18,
    endVerse: 24,
    title: 'Un aiuto corrispondente e il “lato” dell’umano',
    question: 'Ezer kenegdo indica subordinazione? E il termine tsela designa necessariamente una costola?',
    witnessComparison: 'Il MT definisce la donna ezer kenegdo: un aiuto “di fronte/corrispondente a lui”. Ezer è usato frequentemente anche per l’aiuto divino e non implica inferiorità. Il termine tsela significa normalmente lato o fianco; LXX pleura e Vulgata costa hanno consolidato la resa anatomica “costola”, seguita dalla CEI. Il gioco ’ish/’ishah di 2,23 lega letterariamente uomo e donna, ma non è un’etimologia scientifica.',
    interpretation: 'La scena risponde all’unico “non è bene” del racconto: la solitudine. Gli animali non costituiscono una corrispondenza adeguata; la donna viene riconosciuta come stessa carne e stessa ossatura. Gen 2,24 interpreta narrativamente il vincolo di coppia come nuova parentela e “una sola carne”. Il racconto descrive reciprocità e appartenenza comune, pur provenendo da un mondo sociale patriarcale.',
    methodologicalNote: 'La scelta fra “costola” e “lato” è lessicale ed esegetica, non una differenza fra MT e versioni che narrino due origini diverse. Il testo non fornisce un resoconto biologico della differenziazione sessuale né giustifica da solo una gerarchia permanente fra uomo e donna.',
    reception: 'Gesù riprende Gen 2,24 nei Sinottici e la tradizione cristiana vi legge un fondamento della comunione matrimoniale. Questa ricezione canonica approfondisce il testo senza cancellarne la prima affermazione: la solitudine umana non è il bene voluto da Dio.',
    bibliography: [WENHAM_2_3, WESTERMANN_2_3, SARNA_2_3],
  },
];

export const genesisThreeTextualDossiers: TextualDossier[] = [
  {
    id: 'gen-3-1-7',
    startVerse: 1,
    endVerse: 7,
    title: 'Serpente, desiderio e conoscenza',
    question: 'Chi è il serpente nel racconto e che cosa significa diventare “come Dio/dèi, conoscitori del bene e del male”?',
    witnessComparison: 'MT, LXX e Vulgata presentano il serpente come creatura particolarmente astuta; Gen 3 non lo chiama Satana. In 3,5 l’ebraico ke’elohim può essere inteso “come Dio” oppure “come esseri divini”; LXX usa il plurale theoi e Vulgata dii. CEI sceglie “come Dio”. Tutti i testimoni conservano la sequenza vedere–desiderare–prendere–mangiare e l’esito ironico: gli occhi si aprono, ma la prima conoscenza è la propria nudità.',
    interpretation: 'Il serpente altera il comando trasformandolo in sospetto sulla generosità divina; la donna aggiunge il divieto di toccare, assente in 2,17. La “conoscenza del bene e del male” può indicare discernimento, autonomia morale o totalità della conoscenza; il contesto non consente di ridurla a sessualità. L’uomo è presente con la donna in 3,6 e partecipa senza che il testo gli attribuisca un ruolo passivo innocente.',
    methodologicalNote: 'L’identificazione del serpente con Satana appartiene alla ricezione biblica successiva, non alla caratterizzazione storico-letteraria esplicita di Gen 3. Anche “peccato originale” è una sintesi teologica canonica: il sostantivo peccato non compare in questo capitolo.',
    reception: 'Sap 2,24 e Ap 12 contribuiscono alla successiva identificazione del serpente con il diavolo; Rm 5 sviluppa la relazione fra Adamo, peccato e morte. La lettura cattolica accoglie questa unità canonica distinguendola dal primo livello narrativo di Genesi.',
    bibliography: [WENHAM_2_3, WESTERMANN_2_3, SARNA_2_3],
  },
  {
    id: 'gen-3-14-15',
    startVerse: 14,
    endVerse: 15,
    title: 'La discendenza della donna e il “protovangelo”',
    question: 'Chi colpisce la testa del serpente in 3,15 e il versetto annuncia già direttamente Cristo o Maria?',
    witnessComparison: 'Il MT usa il pronome maschile hu’, riferito collettivamente o individualmente alla “discendenza” della donna: essa/egli colpirà la testa, mentre il serpente colpirà il calcagno. La LXX ha autos, maschile, e la Vulgata testuale Stuttgartensia presenta ipsa, femminile, forma divenuta influente nella ricezione mariana latina. Le traduzioni divergono anche sul verbo shuf: colpire, schiacciare o insidiare. Non è una variante che nomini esplicitamente Cristo o Maria.',
    interpretation: 'Nel contesto immediato il versetto descrive inimicizia duratura fra serpente e umanità, con colpi reciproci ma non equivalenti fra testa e calcagno. La forma grammaticale permette che la discendenza collettiva venga focalizzata in un rappresentante, ma questa specificazione nasce dalla lettura canonica successiva.',
    methodologicalNote: 'Il titolo tradizionale “protovangelo” esprime una lettura cristiana retrospettiva, non il significato storico esauriente del versetto. La forma femminile latina non deve essere proiettata nel pronome maschile del MT o della LXX come se tutti i testimoni fossero identici.',
    reception: 'La Chiesa legge Gen 3,15 come primo annuncio figurale della vittoria sul male, compiuta in Cristo, e associa Maria a questa inimicizia nella sua partecipazione alla storia della salvezza. La ricezione teologica resta distinta dalla referenza grammaticale immediata della “discendenza”.',
    bibliography: [WENHAM_2_3, WESTERMANN_2_3, SARNA_2_3],
  },
  {
    id: 'gen-3-16-19',
    startVerse: 16,
    endVerse: 19,
    title: 'Dolore, dominio, lavoro e mortalità',
    question: 'Le parole rivolte alla donna e all’uomo prescrivono un ordine sociale voluto da Dio oppure descrivono le relazioni ferite?',
    witnessComparison: 'I testimoni concordano sulla sequenza dolore–desiderio–dominio e fatica–suolo–polvere, ma interpretano alcuni termini. In 3,16 teshuqah indica orientamento/desiderio ed è resa diversamente; la Vulgata esplicita sub viri potestate eris, più gerarchico del MT. In 3,17 è maledetto il suolo, non l’uomo; il gioco adam/adamah culmina nel ritorno alla polvere in 3,19.',
    interpretation: 'Le sentenze narrano la disarticolazione di relazioni fondamentali: generazione, coppia, lavoro e terra. “Egli ti dominerà” descrive il dominio che emerge nella condizione ferita; non è formulato come comando rivolto all’uomo. La mortalità rende esplicito il limite della creatura tratta dal suolo, mentre la fatica altera il lavoro già presente positivamente in 2,15.',
    methodologicalNote: 'Usare 3,16 per prescrivere la subordinazione femminile confonde descrizione della frattura e norma etica. Allo stesso modo, il testo non autorizza a imputare alla sola donna la colpa: entrambi mangiano, sono interrogati e subiscono le conseguenze.',
    reception: 'La lettura cristiana interpreta queste ferite alla luce della redenzione e della dignità comune di uomo e donna. Tale prospettiva non cancella la durezza storica del testo, ma impedisce di trasformare il dominio conseguente al peccato in ideale teologico.',
    bibliography: [WENHAM_2_3, WESTERMANN_2_3, SARNA_2_3],
  },
  {
    id: 'gen-3-22-24',
    startVerse: 22,
    endVerse: 24,
    title: 'Espulsione e via dell’albero della vita',
    question: 'Perché l’umanità viene espulsa e che funzione hanno i cherubini e la spada fiammeggiante?',
    witnessComparison: 'MT, LXX e Vulgata conservano il plurale divino “come uno di noi” e motivano l’espulsione con il rischio di prendere anche dall’albero della vita. I cherubini e la lama fiammeggiante custodiscono la via; la LXX aggiunge una formulazione che può sembrare collocare Adamo di fronte al giardino, ma la funzione di interdizione resta comune.',
    interpretation: 'L’espulsione impedisce che l’umanità viva per sempre nella condizione ormai segnata dalla frattura. I cherubini appartengono all’immaginario di custodia dello spazio sacro del Vicino Oriente e, nel canone, saranno associati anche al santuario. Il ritorno al suolo chiude il movimento iniziato in 2,7 e trasforma il giardino in spazio perduto ma ricordato.',
    methodologicalNote: 'Eden non è localizzabile mediante questi simboli come un sito archeologico accessibile. Il confronto con figure di custodia antiche chiarisce l’immaginario, ma non rende i cherubini copie di una singola iconografia esterna.',
    reception: 'La tradizione cristiana legge la riapertura dell’accesso alla vita entro l’intero arco canonico, fino all’albero della vita di Ap 22. È una relazione canonica esplicita, distinta dalla geografia narrativa originaria di Gen 3.',
    bibliography: [WENHAM_2_3, WESTERMANN_2_3, SARNA_2_3, CARR],
  },
];

export const genesisTextualDossiersByChapter: Record<number, TextualDossier[]> = {
  1: genesisOneTextualDossiers,
  2: genesisTwoTextualDossiers,
  3: genesisThreeTextualDossiers,
};
