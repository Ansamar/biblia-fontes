import type { GenesisEditorialChapter } from './genesisEditorial';

const BIB = [
  'Marshall, I. Howard, The Pastoral Epistles, ICC, T&T Clark, 1999.',
  'Johnson, Luke Timothy, The First and Second Letters to Timothy, Anchor Bible 35A, Doubleday, 2001.',
  'Towner, Philip H., The Letters to Timothy and Titus, NICNT, Eerdmans, 2006.',
  'Collins, Raymond F., 1 & 2 Timothy and Titus, New Testament Library, Westminster John Knox, 2002.',
  'USCCB, introduzione e note a 1 Timothy, https://bible.usccb.org/bible/1timothy/0 (consultato il 30 agosto 2026).',
];
const formation = '1 Timoteo, con 2 Timoteo e Tito, appartiene alle Pastorali. La cornice presenta Paolo in viaggio verso la Macedonia e Timoteo responsabile a Efeso (1,3). La maggioranza della ricerca critica propone una composizione postpaolina fra fine I e inizio II secolo; altri difendono Paolo negli anni 60, una mediazione segretariale o la rielaborazione di memorie autentiche. Vocabolario, itinerario e organizzazione comunitaria sono argomenti cumulativi, non prove isolate. Il testo adatta la memoria apostolica a conflitti di insegnamento e alla gestione della casa di Dio. L’ipotesi pseudepigrafica non elimina le domande antiche su autorità e veridicità, né determina da sola il valore canonico.';
const textualBase = 'La tradizione di 1 Timoteo comprende il codice Sinaitico, Alessandrino e testimoni successivi. Il Vaticano non conserva le Pastorali e nessuna porzione superstite di P46 attesta 1 Timoteo: non vanno citati come testimoni positivi della lettera. Varianti di copiatura, problemi semantici e ipotesi sulla paternità sono livelli distinti.';
const rows: Record<number, [string, string, string, string, string]> = {
  1: [
    'L’insegnamento serve l’amore, non la disputa',
    '1,1–2 saluto; 1,3–11 incarico e uso della legge; 1,12–17 misericordia nella memoria di Paolo; 1,18–20 fedeltà e disciplina.',
    'Timoteo deve contrastare insegnamenti che alimentano speculazioni anziché una vita di fede. La finalità dell’incarico è l’amore da cuore puro e buona coscienza. La legge è buona se usata legittimamente; la figura di Paolo, già persecutore e ora accolto, esemplifica misericordia e responsabilità.',
    'Efeso è la collocazione narrativa, non una ricostruzione indipendente di ogni avversario. Miti e genealogie non permettono di identificare un sistema gnostico preciso. Il catalogo morale rielabora comandamenti e convenzioni antiche: termini discussi come arsenokoitai non corrispondono automaticamente a identità sessuali moderne. Consegnare Imeneo e Alessandro a Satana è linguaggio disciplinare severo con intento correttivo, non licenza di maltrattamento.',
    'In 1,4 la lezione oikonomian, amministrazione o disegno di Dio, va distinta dall’interpretazione edificante spesso resa nelle traduzioni. Il confronto fra traduzioni di 1,10 richiede studio lessicale: una divergenza di resa non implica necessariamente manoscritti differenti.',
  ],
  2: [
    'Preghiera universale e restrizioni alla parola delle donne',
    '2,1–7 preghiera, volontà salvifica e unico mediatore; 2,8–10 condotta di uomini e donne; 2,11–15 apprendimento, autorità e generazione.',
    'La preghiera abbraccia tutti, compresi i governanti, nella speranza di una vita pacifica. L’unico Dio vuole la salvezza di tutti e Cristo è mediatore. Seguono prescrizioni contro ira e ostentazione e una restrizione all’insegnamento e all’autorità femminile, motivata con Adamo ed Eva e conclusa dall’enigmatico riferimento alla generazione.',
    'La richiesta di pregare per il potere imperiale non ne sacralizza le azioni. Il testo permette alla donna di apprendere ma ne limita il ruolo secondo un ordine patriarcale. Alcuni interpreti vedono una norma generale, altri un intervento locale: la ricostruzione di donne eretiche a Efeso non è dimostrata dal solo passo. 2,15 non promette parti sicuri né rende maternità condizione necessaria della salvezza; interpretazioni domestiche e cristologiche restano discusse.',
    'Authentein in 2,12 è raro e il suo significato oscilla nelle interpretazioni fra esercitare autorità e dominare; il problema è semantico e contestuale, non una variante che consenta di cancellare il divieto. Anche il singolare e il plurale di 2,15 e il valore di dia tēs teknogonias richiedono analisi sintattica.',
  ],
  3: [
    'Ministri affidabili e confessione del mistero di Cristo',
    '3,1–7 requisiti del sorvegliante; 3,8–13 diaconi e donne; 3,14–16 casa di Dio e confessione cristologica.',
    'Chi assume responsabilità deve essere ospitale, capace di insegnare, mite, non avido e affidabile nella casa e davanti agli esterni. Anche i diaconi devono essere provati; una prescrizione parallela riguarda le donne. La comunità è casa del Dio vivente e sostegno della verità, centrata sulla manifestazione di Cristo nella carne e sulla sua proclamazione alle nazioni.',
    'Episkopos indica sorveglianza e non coincide senza residui col vescovo diocesano successivo. Le donne di 3,11 possono essere ministre o mogli dei diaconi; il testo non aggiunge “loro”, e il parallelismo sostiene la lettura ministeriale senza chiudere il dibattito. Il modello della casa assume gerarchie antiche, ma i requisiti di nonviolenza e disinteresse economico giudicano ogni esercizio del ministero.',
    'In 3,16 le lezioni principali sono hos (“colui che”), ho (“ciò che”) e theos (“Dio”). Le edizioni critiche preferiscono hos, con riferimento a Cristo; la lezione theos prevale nella tradizione bizantina successiva. La cristologia dell’inno non dipende dall’adozione della variante “Dio”. In 3,11 la questione donne/mogli è soprattutto interpretativa.',
  ],
  4: [
    'Bontà della creazione e formazione del ministro',
    '4,1–5 critica dell’ascetismo imposto; 4,6–10 esercizio nella pietà; 4,11–16 esempio, lettura pubblica e dono ministeriale.',
    'Contro chi vieta matrimonio e alimenti, l’autore afferma la bontà dei doni creati, accolti con ringraziamento. Timoteo deve nutrirsi dell’insegnamento, esercitarsi nella pietà ed essere esempio senza lasciarsi svalutare per la giovane età. Lettura pubblica, esortazione e insegnamento accompagnano il dono ricevuto con profezia e imposizione delle mani del collegio degli anziani.',
    'La polemica attesta pratiche ascetiche, non identifica da sola una scuola gnostica del II secolo. Il rifiuto del matrimonio obbligatoriamente proibito non condanna il celibato liberamente scelto. Il dono e l’imposizione delle mani sono importanti per la ricezione cattolica del ministero, ma il passo non descrive da solo un ordinamento sacramentale completo. Formazione e condotta contano più del rango.',
    'In 4,10 esistono lezioni corrispondenti a “lottiamo” e “siamo oltraggiati”; le edizioni critiche adottano normalmente la prima. “Salvatore di tutti, soprattutto dei credenti” è un problema teologico ed esegetico, non risolvibile sostituendo una parola senza evidenza manoscritta.',
  ],
  5: [
    'Sostenere le vedove e rendere responsabili gli anziani',
    '5,1–2 relazioni come famiglia; 5,3–16 vedove, parenti e iscrizione; 5,17–22 sostegno e responsabilità degli anziani; 5,23–25 consiglio personale e discernimento.',
    'La comunità deve onorare persone di età e condizioni diverse. Le famiglie sono chiamate a sostenere le vedove, mentre l’assistenza comune si concentra su quelle sole; un elenco richiede età e condotta determinate. Gli anziani che lavorano nell’insegnamento ricevono onore e sostegno, ma accuse e peccati richiedono esame imparziale, senza nomine affrettate.',
    'Il registro delle vedove può unire assistenza e impegno comunitario: non è certo che coincida con un ordine formalizzato successivo. Le restrizioni alle giovani vedove riflettono controllo della rispettabilità femminile e non devono essere assunte come ritratto delle donne. La richiesta di testimoni per gli anziani tutela il procedimento, non autorizza a ignorare denunce o impedire indagini su abusi.',
    'In 5,16 la lezione breve “se una credente” è ampliata in parte della tradizione in “un credente o una credente”, mutando l’enfasi sulla responsabilità femminile nell’assistenza. La citazione sul salario in 5,18 coincide con una tradizione di Gesù attestata in Lc 10,7; il rapporto letterario e l’estensione di “Scrittura” restano discussi.',
  ],
  6: [
    'Schiavitù, ricchezza e custodia dell’insegnamento',
    '6,1–2 schiavi e padroni; 6,3–10 disputa e avidità; 6,11–16 esortazione e dossologia; 6,17–19 ricchi e condivisione; 6,20–21 deposito affidato.',
    'Agli schiavi è chiesto rispetto verso padroni, anche credenti, per la reputazione dell’insegnamento. Il testo denuncia chi usa la pietà come guadagno e il desiderio di arricchirsi; Timoteo deve perseguire giustizia, fede, amore e mitezza. Ai ricchi è chiesto di confidare in Dio, condividere e accumulare un fondamento per la vita vera; il deposito ricevuto va custodito.',
    'L’esortazione agli schiavi conserva l’istituzione e non è abolizionismo implicito: la sua storia di impiego oppressivo va riconosciuta, senza convertirla in norma sociale cristiana. La radice dei mali è l’amore del denaro, non il denaro in sé; il criterio è condivisione concreta. La “conoscenza falsamente chiamata tale” non dimostra un’allusione specifica a Marcione. Custodire non significa sottrarre ministri alla critica.',
    'In 6,19 le edizioni critiche leggono “la vita realmente tale”, mentre altri testimoni hanno “vita eterna”. Questa variazione non cambia la richiesta di generosità. Gnōsis in 6,20 significa conoscenza: identificare un movimento storico preciso è questione di ricostruzione, non di semplice traduzione.',
  ],
};

export const firstTimothyEditorialSpecific: Record<number, GenesisEditorialChapter> =
  Object.fromEntries(Object.entries(rows).map(([n, [summary, structure, context, critical, textual]]) => [
    Number(n),
    { summary, structure, context, formation, critical, textual: textualBase + ' ' + textual, bibliography: BIB },
  ]));
