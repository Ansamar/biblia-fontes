export type BfrgFamily = 'HUMANITY' | 'WORLD' | 'CULTURE' | 'TRADITION' | 'TEXT';
export type BfrgClaimMode = 'textual' | 'interpretive' | 'comparative' | 'canonical';
export type BfrgConfidence = 'explicit' | 'strong' | 'plausible' | 'debated';

export type BfrgPilotRelation = {
  id: string;
  chapter: number;
  source: string;
  predicate: string;
  target: string;
  family: BfrgFamily;
  claimMode: BfrgClaimMode;
  confidence: BfrgConfidence;
  thesis: string;
  note?: string;
};

export const bfrgGenesisPilot: BfrgPilotRelation[] = [
  {id:'G01',chapter:1,source:'Gen 1',predicate:'THEMATIZES',target:'Creazione',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'La realtà è narrata come creazione ordinata mediante l’azione e la parola divina.'},
  {id:'G02',chapter:1,source:'Gen 1',predicate:'THEMATIZES',target:'Ordine',family:'HUMANITY',claimMode:'interpretive',confidence:'strong',thesis:'Separazioni, denominazioni e sequenza dei giorni costruiscono il cosmo come ordine.'},
  {id:'G03',chapter:1,source:'Gen 1,26–28',predicate:'THEMATIZES',target:'Dignità umana',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'L’essere umano è distinto mediante il linguaggio dell’immagine di Dio.'},
  {id:'G04',chapter:1,source:'Gen 1,26–30',predicate:'PROBLEMATIZES',target:'Potere e responsabilità',family:'HUMANITY',claimMode:'interpretive',confidence:'plausible',thesis:'Il dominio sul vivente apre la questione del rapporto fra autorità, responsabilità e creato.'},
  {id:'G07',chapter:1,source:'Gen 1',predicate:'CULTURAL_PARALLEL_WITH',target:'Cosmogonie mesopotamiche',family:'CULTURE',claimMode:'comparative',confidence:'strong',thesis:'Gen 1 condivide con il Vicino Oriente antico domande cosmologiche e immagini di ordinamento senza implicare dipendenza diretta.'},
  {id:'G08',chapter:1,source:'Gen 1,26–28',predicate:'CULTURAL_PARALLEL_WITH',target:'Ideologie regali mesopotamiche',family:'CULTURE',claimMode:'comparative',confidence:'plausible',thesis:'Il linguaggio di immagine e dominio può essere confrontato con ideologie regali antiche, mantenendo distinta la funzione del testo biblico.'},
  {id:'G09',chapter:1,source:'LXX Gen 1',predicate:'TRANSLATES',target:'Vorlage ebraica di Gen 1',family:'TRADITION',claimMode:'textual',confidence:'strong',thesis:'La LXX è una traduzione greca antica di una forma ebraica del racconto, con proprie scelte interpretative.'},
  {id:'G10',chapter:1,source:'Gv 1,1–5',predicate:'REINTERPRETS',target:'Gen 1,1–5',family:'TEXT',claimMode:'canonical',confidence:'strong',thesis:'Il prologo giovanneo riprende principio, parola, vita e luce in una nuova configurazione cristologica.'},
  {id:'G12',chapter:2,source:'Gen 2,5–15',predicate:'THEMATIZES',target:'Lavoro',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'Coltivare e custodire il giardino colloca il lavoro nella condizione umana originaria.'},
  {id:'G14',chapter:2,source:'Gen 2,16–17',predicate:'THEMATIZES',target:'Limite',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'Il comando relativo all’albero introduce un limite normativo nella libertà umana.'},
  {id:'G15',chapter:2,source:'Gen 2,16–17',predicate:'PROBLEMATIZES',target:'Libertà',family:'HUMANITY',claimMode:'interpretive',confidence:'strong',thesis:'La libertà appare reale ma non assoluta, definita dentro una relazione e un limite.'},
  {id:'G18',chapter:3,source:'Gen 3',predicate:'PROBLEMATIZES',target:'Libertà',family:'HUMANITY',claimMode:'interpretive',confidence:'strong',thesis:'La libertà viene narrata nella possibilità di scelta, desiderio, inganno e conseguenza.'},
  {id:'G20',chapter:3,source:'Gen 3,19',predicate:'THEMATIZES',target:'Mortalità',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'Il ritorno alla polvere rende esplicita la finitezza mortale dell’essere umano.'},
  {id:'G21',chapter:3,source:'Rm 5,12–21',predicate:'REINTERPRETS',target:'Gen 3',family:'TEXT',claimMode:'canonical',confidence:'strong',thesis:'Paolo rilegge Adamo entro una costruzione cristologica di peccato, morte e grazia.'},
  {id:'G23',chapter:4,source:'Gen 4,1–16',predicate:'THEMATIZES',target:'Fraternità',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'Caino e Abele pongono la fraternità al centro del conflitto umano.'},
  {id:'G24',chapter:4,source:'Gen 4,8',predicate:'THEMATIZES',target:'Violenza',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'Il primo omicidio narrato rende la violenza fratricida una rottura fondamentale della relazione umana.'},
  {id:'G25',chapter:4,source:'Gen 4,9',predicate:'PROBLEMATIZES',target:'Responsabilità verso l’altro',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'«Sono forse io il custode di mio fratello?» problematizza direttamente la responsabilità reciproca.'},
  {id:'G29',chapter:4,source:'Gen 4,17',predicate:'DEPICTS',target:'Urbanità',family:'WORLD',claimMode:'textual',confidence:'explicit',thesis:'La fondazione di una città introduce la vita urbana nel mondo narrato.'},
  {id:'G30',chapter:4,source:'Gen 4,20–22',predicate:'DEPICTS',target:'Tecniche e arti',family:'CULTURE',claimMode:'textual',confidence:'explicit',thesis:'Pastorizia, musica e metallurgia sono rappresentate come sviluppi della vita culturale umana.'},
  {id:'G33',chapter:5,source:'Gen 5',predicate:'THEMATIZES',target:'Mortalità',family:'HUMANITY',claimMode:'interpretive',confidence:'strong',thesis:'La formula ricorrente della morte struttura la genealogia come memoria della mortalità.'},
  {id:'G36',chapter:6,source:'Gen 6,5.11–13',predicate:'DEVELOPS',target:'Violenza',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'La violenza non è più episodio individuale ma condizione generalizzata della terra.'},
  {id:'G39',chapter:6,source:'Gen 6–9',predicate:'CULTURAL_PARALLEL_WITH',target:'Tradizioni mesopotamiche del diluvio',family:'CULTURE',claimMode:'comparative',confidence:'strong',thesis:'Il ciclo del diluvio condivide motivi strutturali con tradizioni mesopotamiche, senza provare dipendenza da un unico testo.'},
  {id:'G43',chapter:9,source:'Gen 9,1–17',predicate:'THEMATIZES',target:'Alleanza universale',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'L’alleanza con Noè estende la relazione divina all’umanità post-diluviana e al mondo vivente.'},
  {id:'G45',chapter:9,source:'Gen 9,4–6',predicate:'THEMATIZES',target:'Vita',family:'HUMANITY',claimMode:'textual',confidence:'explicit',thesis:'Sangue, vita e divieto di omicidio sono strettamente connessi nella normativa post-diluviana.'},
  {id:'G49',chapter:10,source:'Gen 10',predicate:'DEPICTS',target:'Pluralità dei popoli',family:'WORLD',claimMode:'textual',confidence:'explicit',thesis:'La tavola delle nazioni rappresenta la pluralità dei popoli nel mondo umano post-diluviano.'},
  {id:'G51',chapter:10,source:'Gen 10',predicate:'EMERGES_IN',target:'Orizzonte del Vicino Oriente antico',family:'WORLD',claimMode:'interpretive',confidence:'plausible',thesis:'La geografia etnica della tavola riflette un orizzonte del Vicino Oriente antico da distinguere dal tempo narrato.'},
  {id:'G52',chapter:11,source:'Gen 11,1–9',predicate:'DEPICTS',target:'Pluralità linguistica',family:'CULTURE',claimMode:'textual',confidence:'explicit',thesis:'Unità e pluralità linguistica costituiscono il dispositivo narrativo centrale di Babele.'},
  {id:'G53',chapter:11,source:'Gen 11,1–9',predicate:'PROBLEMATIZES',target:'Potere',family:'HUMANITY',claimMode:'interpretive',confidence:'strong',thesis:'Progetto urbano, torre, nome e concentrazione collettiva costruiscono una domanda sul potere e sulla sicurezza umana.'},
  {id:'G57',chapter:11,source:'Gen 11,1–9',predicate:'CULTURAL_PARALLEL_WITH',target:'Cultura urbana mesopotamica',family:'CULTURE',claimMode:'comparative',confidence:'strong',thesis:'Città monumentale, mattoni e torre invitano al confronto con la cultura urbana mesopotamica senza identificare un referente unico.'},
  {id:'G58',chapter:11,source:'Gen 11,1–9',predicate:'CULTURAL_PARALLEL_WITH',target:'Ziggurat mesopotamiche',family:'CULTURE',claimMode:'comparative',confidence:'plausible',thesis:'La torre può essere confrontata con l’architettura monumentale a terrazze della Mesopotamia senza dedurre un rapporto diretto.'}
];

export const familyLabels: Record<BfrgFamily,string> = {HUMANITY:'Umanità',WORLD:'Mondo',CULTURE:'Culture',TRADITION:'Tradizione',TEXT:'Scrittura'};
export const claimModeLabels: Record<BfrgClaimMode,string> = {textual:'Dato testuale',interpretive:'Interpretazione',comparative:'Confronto culturale',canonical:'Relazione canonica'};
export const confidenceLabels: Record<BfrgConfidence,string> = {explicit:'Esplicita',strong:'Fortemente sostenuta',plausible:'Plausibile',debated:'Dibattuta'};
export const predicateLabels: Record<string,string> = {
  THEMATIZES:'Tematizza',
  PROBLEMATIZES:'Problematizza',
  CULTURAL_PARALLEL_WITH:'Confronto culturale',
  TRANSLATES:'Traduce',
  REINTERPRETS:'Rilegge',
  DEPICTS:'Rappresenta',
  DEVELOPS:'Sviluppa',
  EMERGES_IN:'Si colloca in',
  BELONGS_TO:'Appartiene a',
  PARALLELS_TEXT:'Presenta un parallelo con',
  RECEIVES:'Riceve'
};
