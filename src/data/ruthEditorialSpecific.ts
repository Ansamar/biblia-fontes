import type { GenesisEditorialChapter } from './genesisEditorial';

const BIB = [
  'Hubbard, Robert L., The Book of Ruth, New International Commentary on the Old Testament, Eerdmans, 1988.',
  'Sasson, Jack M., Ruth: A New Translation with a Philological Commentary and a Formalist-Folklorist Interpretation, Johns Hopkins University Press, 1979.',
  'Sakenfeld, Katharine Doob, Ruth, Interpretation, John Knox Press, 1999.',
  'Lau, Peter H. W., Identity and Ethics in the Book of Ruth, de Gruyter, 2010.',
  'Fischer, Irmtraud, Rut, Herders Theologischer Kommentar zum Alten Testament, Herder, 2001.',
];

const textual = 'Il testo ebraico di Rut è relativamente ben conservato, ma la Settanta, la Vulgata, la Peshitta e i targumim attestano varianti lessicali e interpretative, specialmente nei termini di parentela, nelle formule giuridiche e nella genealogia. La brevità e la raffinata costruzione narrativa rendono significative anche divergenze minori; nessuna versione sostituisce automaticamente il Testo Masoretico.';
const formation = 'Rut è una novella sapientemente costruita, ambientata “al tempo dei giudici” ma probabilmente composta molto più tardi. Lingua, istituzioni e rapporto con Deuteronomio non consentono una datazione unanime; un contesto monarchico tardo o post-esilico è spesso proposto. Il possibile dialogo con politiche esclusiviste verso le donne straniere è plausibile, ma non dimostrabile come unica ragione della composizione.';

const rows: Record<number, [string, string, string, string]> = {
  1: ['Da Moab a Betlemme', '1,1–5 carestia, migrazione e lutti; 1,6–18 ritorno e scelta di Rut; 1,19–22 Noemi a Betlemme.', 'Carestia e migrazione trasformano una famiglia di Betlemme in una casa di vedove in terra straniera. Rut, la moabita, sceglie liberamente solidarietà con Noemi, il suo popolo e il suo Dio; Noemi torna dichiarandosi vuota.', 'L’apertura colloca la storia nell’epoca caotica di Giudici ma usa una forma narrativa posteriore. La confessione di Rut non deve essere ridotta a romanticismo: comporta abbandono della sicurezza di origine, migrazione e futuro socialmente precario.'],
  2: ['Rut spigola nel campo di Booz', '2,1–7 incontro nel campo; 2,8–16 protezione e generosità di Booz; 2,17–23 ritorno da Noemi.', 'La spigolatura prevista dalla Torah offre una risorsa ai poveri, ma Rut resta esposta a fame e molestie. Booz amplia la tutela legale e riconosce la sua solidarietà verso Noemi.', 'Il capitolo dialoga con Lv 19,9–10 e Dt 24,19–22 senza presentare una semplice applicazione burocratica. Il termine ḥesed emerge nelle azioni concrete, mentre la provvidenza opera attraverso coincidenze, lavoro e responsabilità umana.'],
  3: ['Rut e Booz sull’aia', '3,1–5 progetto di Noemi; 3,6–13 incontro notturno; 3,14–18 promessa e ritorno.', 'Noemi cerca per Rut una “sicurezza” domestica e Rut chiede a Booz di stendere il lembo del mantello come gesto di protezione e riscatto. La scena è carica di rischio, ambiguità e iniziativa femminile.', 'Il linguaggio dei “piedi” può contenere allusioni sessuali, ma il narratore evita di descrivere un rapporto. Rut combina audacia e formula giuridico-familiare; Booz riconosce un riscattatore più prossimo, impedendo una soluzione privata immediata.'],
  4: ['Riscatto, nascita e genealogia di Davide', '4,1–8 negoziazione alla porta; 4,9–12 matrimonio e benedizioni; 4,13–17 nascita di Obed; 4,18–22 genealogia.', 'Alla porta cittadina Booz coordina campo, memoria del defunto e matrimonio con Rut. La nascita di Obed restituisce futuro a Noemi e inserisce una donna moabita nella genealogia davidica.', 'Le pratiche combinano riscatto fondiario, continuità familiare e matrimonio, ma non coincidono perfettamente con il levirato di Dt 25. La genealogia finale può essere parte del disegno originario o un raccordo redazionale; in ogni caso orienta l’intera novella verso Davide.'],
};

export const ruthEditorialSpecific: Record<number, GenesisEditorialChapter> = Object.fromEntries(
  Object.entries(rows).map(([n, [summary, structure, context, critical]]) => [Number(n), {
    summary,
    structure,
    context,
    formation,
    critical,
    textual,
    bibliography: BIB,
  }]),
);
