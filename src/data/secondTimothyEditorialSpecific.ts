import type { GenesisEditorialChapter } from './genesisEditorial';

const BIB = [
  'Marshall, I. Howard, The Pastoral Epistles, ICC, T&T Clark, 1999.',
  'Johnson, Luke Timothy, The First and Second Letters to Timothy, Anchor Bible 35A, Doubleday, 2001.',
  'Towner, Philip H., The Letters to Timothy and Titus, NICNT, Eerdmans, 2006.',
  'Collins, Raymond F., 1 & 2 Timothy and Titus, New Testament Library, Westminster John Knox, 2002.',
  'NET Bible, nota a 2 Timothy 3:16, https://www.biblegateway.com/passage/?search=2+Timothy+3%3A16&version=NET (consultato il 30 agosto 2026).',
];
const formation = '2 Timoteo appartiene alle Pastorali ma presenta un tono personale e testamentario più marcato di 1 Timoteo e Tito. La cornice è una prigionia romana prossima alla morte di Paolo; chi difende l’autenticità la colloca negli anni 60, mentre molti studiosi propongono un testamento letterario postpaolino fra fine I e inizio II secolo. Altri riconoscono frammenti di corrispondenza autentica riutilizzati. I nomi e le richieste concrete rendono plausibile una memoria personale, senza dimostrare da soli autore e cronologia. Il testo trasmette una figura apostolica esemplare, un insegnamento affidato e un modello di perseveranza; la ricostruzione storica va distinta dalla ricezione canonica.';
const textualBase = '2 Timoteo è trasmessa dal codice Sinaitico, Alessandrino e da testimoni successivi. Il Vaticano non conserva le Pastorali e P46 non offre testo superstite di questa lettera: nessuno dei due va usato come testimone positivo dei suoi versetti. Molte divergenze esegetiche dipendono da sintassi, metafore e ricostruzione storica, non da varianti manoscritte.';
const rows: Record<number, [string, string, string, string, string]> = {
  1: [
    'Ravvivare il dono e custodire la fede senza vergogna',
    '1,1–2 saluto; 1,3–7 memoria familiare e dono; 1,8–14 testimonianza e deposito; 1,15–18 abbandono e Onesiforo.',
    'La lettera ricorda la fede di Loide ed Eunice e invita Timoteo a ravvivare il dono ricevuto mediante l’imposizione delle mani. Lo Spirito sostiene forza, amore e saggezza, non timore. La prigionia apostolica non deve diventare vergogna: il vangelo annuncia la vittoria di Cristo sulla morte. Il contrasto fra abbandoni e solidarietà di Onesiforo concretizza la fedeltà.',
    'Nonna e madre sono trasmettitrici nominate della fede, non semplice sfondo della formazione maschile. L’imposizione delle mani è importante nella ricezione ministeriale cattolica, ma il passo non descrive da solo tutti i gradi dell’ordine successivo. La preghiera per Onesiforo in 1,18 è stata letta come intercessione per un defunto, benché il testo non ne dichiari la morte. Perseveranza non significa accettazione passiva dell’abuso.',
    '“Il mio deposito” in 1,12 può designare ciò che Paolo ha affidato a Dio oppure ciò che gli è stato affidato: sono interpretazioni della medesima espressione, non due testi concorrenti. Il “buon deposito” di 1,14 chiarisce la dimensione di insegnamento da custodire nello Spirito senza eliminare ogni ambiguità del v. 12.',
  ],
  2: [
    'Trasmettere la parola con perseveranza e mitezza',
    '2,1–7 trasmissione, soldato, atleta e contadino; 2,8–13 memoria di Gesù e detto fedele; 2,14–19 disputa sulla risurrezione; 2,20–26 casa, purificazione e correzione.',
    'Timoteo deve affidare l’insegnamento a persone capaci di istruire altri. Soldato, atleta e contadino raffigurano impegno e pazienza; al centro resta Gesù risorto, della stirpe di Davide, la cui parola non è incatenata. Imeneo e Fileto sostengono che la risurrezione sia già avvenuta. Il ministro deve evitare litigi, essere capace d’insegnare e correggere con mitezza.',
    'La catena dell’insegnamento attesta trasmissione organizzata, non dimostra da sola la forma completa della successione ministeriale successiva. L’errore sulla risurrezione può riflettere un’escatologia radicalmente realizzata: identificarlo con uno specifico sistema gnostico è congettura. La metafora militare non autorizza violenza religiosa; il criterio pratico è proprio la correzione non litigiosa, aperta alla conversione dell’interlocutore.',
    'Orthotomein in 2,15, letteralmente “tagliare diritto”, è reso come trattare o esporre rettamente la parola: non prescrive di suddividere la Bibbia in sistemi cronologici. La formula di 2,11–13 viene spesso riconosciuta come materiale tradizionale, ma struttura poetica e origine preesistente sono ipotesi letterarie, non varianti di copiatura.',
  ],
  3: [
    'Discernere l’inganno e formarsi nelle Scritture',
    '3,1–9 catalogo dei vizi e opposizione; 3,10–13 esempio apostolico; 3,14–17 apprendimento, Scritture e opere buone.',
    'Un catalogo di vizi descrive persone che mantengono l’apparenza religiosa negandone l’efficacia; l’inganno penetra nelle case e si oppone alla verità come Iannes e Iambres a Mosè. Timoteo è chiamato a restare nell’insegnamento ricevuto e nelle Scritture conosciute dall’infanzia, che rendono sapienti per la salvezza e preparano alle opere buone.',
    'Gli “ultimi giorni” interpretano la crisi presente, non forniscono indicatori esclusivi per datare la fine. La descrizione dispregiativa delle donne raggirate in 3,6 appartiene alla polemica dell’autore e non è un giudizio sull’intelligenza femminile. Iannes e Iambres provengono dalla tradizione interpretativa su Mosè. Le Scritture dell’infanzia rinviano anzitutto alle Scritture d’Israele: il versetto non elenca il futuro canone cristiano completo. La ricezione ecclesiale dell’ispirazione va distinta da questo primo orizzonte.',
    'La proposizione senza copula di 3,16 è normalmente resa “ogni Scrittura è ispirata da Dio e utile”; è stata proposta anche la lettura “ogni Scrittura ispirata è anche utile”. La nota NET sostiene la prima per il parallelismo degli aggettivi. Si tratta di analisi sintattica, non di un manoscritto che aggiunga o elimini l’ispirazione. Theopneustos ne afferma l’origine divina senza descrivere un meccanismo di dettatura.',
  ],
  4: [
    'Il commiato apostolico fra annuncio, solitudine e speranza',
    '4,1–5 incarico di annunciare; 4,6–8 libagione, corsa e corona; 4,9–15 collaboratori e richieste; 4,16–18 difesa e liberazione; 4,19–22 saluti.',
    'Timoteo deve annunciare con pazienza anche quando gli ascoltatori cercano insegnamenti compiacenti. Paolo si raffigura come libagione versata e atleta giunto al termine, fiducioso nella corona condivisa con quanti attendono il Signore. Chiede compagnia, mantello, libri e pergamene; racconta abbandono alla prima difesa ma presenza del Signore e conclude con saluti concreti.',
    'La densità di nomi e oggetti alimenta l’ipotesi di memorie o biglietti autentici, senza risolvere la paternità dell’intera lettera. La liberazione dalla bocca del leone è immagine biblica e non prova un’esposizione alle belve. La corona non glorifica la morte cercata: il testo manifesta bisogno di cura, calore e relazione. Il giudizio su Dema è la voce del mittente; non permette di ricostruirne tutta la biografia o una condanna definitiva.',
    'In 4,10 la destinazione di Crescente varia fra Galazia e Gallia: la variante va registrata prima di ricostruire itinerari missionari occidentali. “Libri” e “pergamene” in 4,13 non identificano con certezza specifici scritti biblici o copie delle lettere paoline. Il singolare del saluto allo spirito di Timoteo e il plurale finale “con voi” indicano un orizzonte comunitario oltre il destinatario nominale.',
  ],
};

export const secondTimothyEditorialSpecific: Record<number, GenesisEditorialChapter> =
  Object.fromEntries(Object.entries(rows).map(([n, [summary, structure, context, critical, textual]]) => [
    Number(n),
    { summary, structure, context, formation, critical, textual: textualBase + ' ' + textual, bibliography: BIB },
  ]));
