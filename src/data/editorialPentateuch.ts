export type BookEditorialProfile = {
  context: string;
  formation: string;
  textual: string;
  bibliography: string[];
};

export const pentateuchEditorial: Record<string, BookEditorialProfile> = {
  esodo: {
    context: 'Esodo colloca la nascita d’Israele tra Egitto, deserto e Sinai. La memoria di gruppi semitici in Egitto, il lavoro coatto, la geografia del Delta e le tradizioni del deserto possono essere confrontati con dati egiziani e levantini, ma non consentono di identificare l’esodo biblico con un singolo evento documentato. Il racconto elabora una memoria fondativa di liberazione, alleanza e presenza divina.',
    formation: 'Il libro integra tradizioni narrative, materiali sacerdotali, collezioni legislative e racconti cultuali. La distinzione tra strati sacerdotali e non sacerdotali resta robusta, mentre la ricostruzione dei classici documenti J ed E è oggi più discussa. Es 1–18, 19–24 e 25–40 mostrano storie compositive differenti poi coordinate nella forma pentateucale.',
    textual: 'Il Testo Masoretico è il principale testimone ebraico; Settanta, Pentateuco Samaritano e manoscritti del deserto di Giuda conservano varianti significative. Particolare attenzione richiedono il Decalogo, i testi legali e le sezioni del santuario, dove armonizzazioni e differenze di ordine attestano una trasmissione testuale complessa.',
    bibliography: ['Propp, William H. C., Exodus 1–18; Exodus 19–40, Anchor Yale Bible.', 'Dozeman, Thomas B., Commentary on Exodus, Eerdmans, 2009.', 'Sarna, Nahum M., Exodus, JPS Torah Commentary, 1991.', 'Albertz, Rainer, Exodus 1–18, Zurich Exegetical Commentary on the Old Testament, 2012.']
  },
  levitico: {
    context: 'Levitico riflette un mondo cultuale centrato sul santuario, sul sacerdozio, sulla purezza e sulla santità. I rituali sono illuminati dal confronto con pratiche del Vicino Oriente antico, ma la loro configurazione teologica è specificamente israelitica: sacrificio, impurità e santità organizzano il rapporto tra Dio, comunità, corpo e spazio sacro.',
    formation: 'Il libro appartiene in larga parte alla tradizione sacerdotale. La ricerca distingue normalmente un nucleo sacerdotale e il cosiddetto Codice di Santità, soprattutto Lv 17–26, pur discutendo rapporto, datazione e direzione di dipendenza tra questi complessi. La forma finale integra culto, etica e identità comunitaria.',
    textual: 'MT, LXX, Pentateuco Samaritano e frammenti qumranici mostrano un testo relativamente stabile ma non uniforme. Le varianti riguardano soprattutto formulazioni rituali, ripetizioni e armonizzazioni; vanno valutate senza assumere automaticamente la priorità di una singola tradizione.',
    bibliography: ['Milgrom, Jacob, Leviticus 1–16; 17–22; 23–27, Anchor Yale Bible.', 'Nihan, Christophe, From Priestly Torah to Pentateuch, Mohr Siebeck, 2007.', 'Hieke, Thomas, Levitikus 1–15; 16–27, Herder, 2014.', 'Watts, James W., Ritual and Rhetoric in Leviticus, Cambridge University Press, 2007.']
  },
  numeri: {
    context: 'Numeri organizza la memoria del deserto tra Sinai e pianure di Moab. Le tappe, le crisi e i conflitti costruiscono una geografia teologica della generazione uscita dall’Egitto; l’archeologia non permette di trasformare gli itinerari in un diario verificabile, ma il quadro conserva conoscenze di regioni e vie del deserto meridionale e transgiordanico.',
    formation: 'Il libro combina censimenti, norme sacerdotali, racconti di ribellione, itinerari, oracoli e materiali giuridici. Strati sacerdotali e non sacerdotali sono chiaramente intrecciati; molte pericopi mostrano espansioni e riletture successive. Il libro è uno dei testimoni più evidenti della crescita letteraria del Pentateuco.',
    textual: 'La tradizione testuale è plurale: MT, LXX, Samaritano e Qumran presentano differenze di numeri, nomi, ordine e armonizzazioni. I racconti di Balaam e alcune sezioni legali sono particolarmente utili per osservare processi di trasmissione e revisione.',
    bibliography: ['Levine, Baruch A., Numbers 1–20; 21–36, Anchor Yale Bible.', 'Milgrom, Jacob, Numbers, JPS Torah Commentary, 1990.', 'Achenbach, Reinhard, Die Vollendung der Tora, Harrassowitz, 2003.', 'Dozeman, Thomas B. et al. (eds.), The Pentateuch, Mohr Siebeck, 2011.']
  },
  deuteronomio: {
    context: 'Deuteronomio presenta Mosè nelle pianure di Moab mentre rilegge l’esodo, il deserto e la legge per una nuova generazione. Il libro riflette però anche problemi del primo millennio a.C.: centralizzazione del culto, monarchia, profezia, guerra, giustizia sociale e rapporto con le nazioni.',
    formation: 'Il nucleo legislativo di Dt 12–26 e la cornice esortativa appartengono a una lunga storia compositiva collegata alla tradizione deuteronomica e alla successiva storiografia deuteronomistica. Le relazioni con la riforma di Giosia, l’esilio e il periodo persiano restano discusse nei dettagli, ma una crescita in più fasi è ampiamente riconosciuta.',
    textual: 'Deuteronomio è particolarmente importante per la critica testuale: manoscritti qumranici, LXX e Pentateuco Samaritano mostrano forme divergenti, incluse varianti teologicamente sensibili come Dt 32,8 e differenze relative al luogo del culto. Il testo va studiato come tradizione in movimento, non come linea unica.',
    bibliography: ['Nelson, Richard D., Deuteronomy, Old Testament Library, 2002.', 'Otto, Eckart, Deuteronomium 1–34, HThKAT, Herder.', 'Tigay, Jeffrey H., Deuteronomy, JPS Torah Commentary, 1996.', 'Schmid, Konrad, The Old Testament: A Literary History, Fortress Press, 2012.']
  }
};