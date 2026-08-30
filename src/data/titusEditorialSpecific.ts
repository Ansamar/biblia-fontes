import type { GenesisEditorialChapter } from './genesisEditorial';

const BIB = [
  'Quinn, Jerome D., The Letter to Titus, Anchor Bible 35, Doubleday, 1990.',
  'Marshall, I. Howard, The Pastoral Epistles, ICC, T&T Clark, 1999.',
  'Towner, Philip H., The Letters to Timothy and Titus, NICNT, Eerdmans, 2006.',
  'Collins, Raymond F., 1 & 2 Timothy and Titus, New Testament Library, Westminster John Knox, 2002.',
  'USCCB, Titus 2, testo e note, https://bible.usccb.org/bible/titus/2 (consultato il 30 agosto 2026).',
];
const formation = 'Tito appartiene alle Pastorali. La cornice presenta Paolo che lascia Tito a Creta per organizzare le comunità e gli chiede poi di raggiungerlo a Nicopoli (1,5; 3,12). Chi difende l’autenticità colloca generalmente la lettera negli anni 60, ricostruendo attività non narrate negli Atti; molti studiosi propongono una composizione postpaolina fra fine I e inizio II secolo, eventualmente nutrita di memorie autentiche. La cornice epistolare non basta a verificare tutti gli itinerari. Insegnamento affidabile, reputazione pubblica, gestione delle case e opere buone strutturano un testo che intreccia consolidamento istituzionale e proclamazione della grazia.';
const textualBase = 'La trasmissione di Tito comprende i codici Sinaitico e Alessandrino e testimoni successivi; il Vaticano non conserva le Pastorali e P46 non offre testo superstite della lettera. Occorre distinguere varianti manoscritte, problemi sintattici e ricostruzioni storiche: una diversa traduzione non prova da sola l’esistenza di una diversa redazione.';
const rows: Record<number, [string, string, string, string, string]> = {
  1: [
    'Responsabili affidabili e polemica nella Creta narrata',
    '1,1–4 saluto e promessa; 1,5–9 anziani e sorvegliante; 1,10–16 avversari, stereotipo cretese e purezza.',
    'La promessa del Dio veritiero fonda l’incarico di Paolo e il legame con Tito. Nelle città devono essere stabiliti responsabili ospitali, giusti, non violenti né avidi, capaci di insegnare. Il testo contrasta maestri che destabilizzano le case e sfruttano l’insegnamento; ricorre poi a una citazione ostile sui Cretesi e denuncia chi professa Dio ma lo rinnega nelle opere.',
    'Presbyteroi in 1,5 ed episkopos in 1,7 sembrano riferirsi a responsabilità strettamente connesse: non è già dimostrata la distinzione successiva fra presbiteri e vescovo monarchico. La citazione di 1,12, tradizionalmente attribuita a Epimenide, è uno stereotipo etnico assunto nella polemica, non una descrizione scientifica degli abitanti di Creta. Gli avversari legati alla circoncisione non rappresentano tutto il giudaismo; la loro ricostruzione dipende dalla voce ostile dell’autore.',
    'In 1,4 parte della tradizione amplia il saluto con “misericordia”, avvicinandolo alle lettere a Timoteo. In 1,6 tekna pista può indicare figli credenti oppure affidabili: è questione semantica e contestuale. L’uso alternato di anziano e sorvegliante richiede storia dei ministeri, non la sostituzione di un termine nel testo.',
  ],
  2: [
    'Educazione della comunità e grazia che forma alla vita buona',
    '2,1–8 anziani, donne, giovani ed esempio di Tito; 2,9–10 schiavi; 2,11–15 manifestazione della grazia e attesa.',
    'L’insegnamento si traduce in condotte differenziate per età e posizione sociale. Le donne anziane insegnano il bene alle giovani, mentre Tito deve dare esempio di integrità. Agli schiavi è prescritta obbedienza ai padroni. Una proclamazione della grazia motiva la vita giusta: la salvezza manifestata educa nell’attesa di Cristo e forma un popolo dedito alle opere buone.',
    'La preoccupazione per la reputazione esterna accoglie gerarchie domestiche greco-romane e attribuisce alle donne una funzione educativa circoscritta. Non equivale a riconoscimento della piena parità, ma neppure a totale assenza di voce femminile. Il comando agli schiavi conserva la struttura servile e deve essere letto riconoscendone la storia d’uso oppressivo. La grazia non può diventare giustificazione teologica di sfruttamento o sottomissione abusiva.',
    'In 2,5 oikourgous, riferito al lavoro domestico, varia con oikourous, riferito alla custodia della casa. Nessuna delle due lezioni risolve da sola la questione moderna del lavoro femminile. In 2,13 “del nostro grande Dio e salvatore Gesù Cristo” è sostenuto dalla costruzione greca con articolo condiviso; la lettura che distingue Padre e Figlio è un’alternativa sintattica, non necessariamente un’altra lezione manoscritta.',
  ],
  3: [
    'Misericordia, rinnovamento e responsabilità pubblica',
    '3,1–2 condotta civile e mitezza; 3,3–8 salvezza per misericordia e opere buone; 3,9–11 controversie e divisione; 3,12–15 collaboratori e bisogni.',
    'La comunità è invitata a una presenza pubblica non litigiosa e pronta al bene, ricordando la propria precedente fragilità. La benevolenza divina salva non per meriti accumulati ma mediante misericordia, lavacro di rigenerazione e rinnovamento dello Spirito. Seguono limiti alle dispute sterili e alla condotta divisiva; i saluti chiedono di sostenere i viaggiatori e rispondere a necessità concrete.',
    'Il linguaggio di 3,4–7 è spesso riconosciuto come tradizione confessionale o liturgica rielaborata, non come fonte separata dimostrabile. Il lavacro ha forte riferimento battesimale e una centrale ricezione sacramentale cattolica; gratuità della salvezza e opere buone non sono rivali, perché queste seguono il dono. Il richiamo all’obbedienza civile non rende giusto ogni ordine del potere romano. La disciplina del divisivo è preceduta da ammonimenti e non autorizza coercizione contro chi dissente.',
    'Loutron palingenesias in 3,5 significa lavacro di rigenerazione; il rapporto sintattico con il rinnovamento dello Spirito ammette accenti esegetici diversi senza cancellare il nesso fra acqua, Spirito e vita nuova. Hairetikos in 3,10 indica una persona faziosa o divisiva: tradurlo “eretico” non deve importarvi automaticamente tutte le definizioni dogmatiche successive. La Nicopoli di 3,12 è comunemente identificata con quella dell’Epiro, ma il nome da solo non ne prova l’identificazione.',
  ],
};

export const titusEditorialSpecific: Record<number, GenesisEditorialChapter> =
  Object.fromEntries(Object.entries(rows).map(([n, [summary, structure, context, critical, textual]]) => [
    Number(n),
    { summary, structure, context, formation, critical, textual: textualBase + ' ' + textual, bibliography: BIB },
  ]));
