'use client';

import { useState } from 'react';

type GenesisHistoryPrototypeProps = {
  formationLabel?: string;
};

type NodeTone = 'narrative' | 'history' | 'culture' | 'formation' | 'transmission';

type HistoryNode = {
  id: string;
  layer: string;
  label: string;
  kicker: string;
  tone: NodeTone;
  status: string;
  detail: string;
  relation?: string;
};

type HistoryLane = {
  id: string;
  index: string;
  title: string;
  question: string;
  tone: NodeTone;
  nodes: HistoryNode[];
};

const lanes: HistoryLane[] = [
  {
    id: 'narrative',
    index: '01',
    title: 'Mondo narrato',
    question: 'Che cosa racconta Genesi, e in quale orizzonte temporale lo colloca?',
    tone: 'narrative',
    nodes: [
      { id: 'origins', layer: 'Mondo narrato', label: 'Origini', kicker: 'Gen 1–11', tone: 'narrative', status: 'tempo narrativo', detail: 'Creazione, genealogie, diluvio e Babele appartengono al mondo narrato dal testo. Non vengono trattati come una cronologia storica continua.', relation: 'Da mettere in relazione con memorie, immagini e tradizioni del Vicino Oriente antico senza trasformare il racconto in cronaca.' },
      { id: 'patriarchs', layer: 'Mondo narrato', label: 'Patriarchi', kicker: 'Gen 12–36', tone: 'narrative', status: 'memoria narrativa', detail: 'Abramo, Isacco, Giacobbe ed Esaù costruiscono una memoria delle origini familiari e territoriali di Israele.', relation: 'Pratiche sociali, mobilità pastorale e geografia levantina possono illuminare il racconto, senza fornire una datazione automatica dei personaggi.' },
      { id: 'joseph', layer: 'Mondo narrato', label: 'Giuseppe', kicker: 'Gen 37–50', tone: 'narrative', status: 'scenario egiziano', detail: 'Il ciclo di Giuseppe sposta il racconto verso l’Egitto e prepara narrativamente il libro dell’Esodo.', relation: 'L’Egitto funziona insieme come spazio narrativo, memoria culturale e grande potenza del mondo vicino-orientale.' },
    ],
  },
  {
    id: 'history',
    index: '02',
    title: 'Storia e memoria',
    question: 'Quali dati, memorie o comparanda possono illuminare ciò che viene raccontato?',
    tone: 'history',
    nodes: [
      { id: 'flood', layer: 'Storia e memoria', label: 'Grandi inondazioni', kicker: 'comparazione', tone: 'history', status: 'memoria / comparandum', detail: 'Tradizioni di grandi inondazioni sono attestate in più culture del Vicino Oriente antico.', relation: 'Il confronto può chiarire il patrimonio culturale nel quale il racconto del diluvio è leggibile; non dimostra automaticamente la storicità dell’evento così come narrato.' },
      { id: 'social', layer: 'Storia e memoria', label: 'Pratiche sociali', kicker: 'famiglia · diritto', tone: 'history', status: 'contesto comparabile', detail: 'Parentela, eredità, alleanze familiari, pastorizia e pratiche giuridiche trovano confronti nel mondo antico.', relation: 'Il valore è storico-comparativo: aiuta a comprendere il comportamento dei personaggi e le istituzioni presupposte dal racconto.' },
      { id: 'egypt-memory', layer: 'Storia e memoria', label: 'Memorie d’Egitto', kicker: 'Gen 37–50', tone: 'history', status: 'quadro discusso', detail: 'Il ciclo di Giuseppe conserva elementi egiziani e memorie di mobilità tra Levante ed Egitto.', relation: 'La pertinenza storica va valutata elemento per elemento, distinguendo scenario plausibile, memoria culturale e costruzione letteraria.' },
    ],
  },
  {
    id: 'cultures',
    index: '03',
    title: 'Popoli, poteri e culture',
    question: 'Con quali mondi culturali entra in relazione la narrazione?',
    tone: 'culture',
    nodes: [
      { id: 'mesopotamia', layer: 'Popoli, poteri e culture', label: 'Mesopotamia', kicker: 'cosmogonie · diluvio', tone: 'culture', status: 'parallelo culturale', detail: 'Mesopotamia offre un vasto repertorio di cosmogonie, genealogie, racconti di diluvio e culture urbane con cui Genesi può essere confrontata.', relation: 'Non si presuppone una dipendenza unica: la relazione può essere tradizione condivisa, ricezione, contrasto o rielaborazione.' },
      { id: 'canaan', layer: 'Popoli, poteri e culture', label: 'Canaan / Levante', kicker: 'città · culti · territori', tone: 'culture', status: 'ambiente culturale', detail: 'Le città, le società e le religioni del Levante costituiscono il mondo geografico e culturale di gran parte delle tradizioni patriarcali.', relation: 'Israele non viene rappresentato come realtà isolata, ma dentro reti di vicinanza, conflitto, parentela, commercio e scambio culturale.' },
      { id: 'egypt', layer: 'Popoli, poteri e culture', label: 'Egitto', kicker: 'potere regionale', tone: 'culture', status: 'interazione storica', detail: 'L’Egitto è una delle grandi potenze che condizionano la storia del Levante e occupa un posto decisivo nella memoria biblica.', relation: 'In Genesi è contemporaneamente luogo narrativo e orizzonte culturale; nei libri successivi diventerà anche polo politico e teologico.' },
    ],
  },
  {
    id: 'formation',
    index: '04',
    title: 'Formazione del testo',
    question: 'Quando e attraverso quali processi Genesi prende forma letteraria?',
    tone: 'formation',
    nodes: [
      { id: 'traditions', layer: 'Formazione del testo', label: 'Tradizioni', kicker: 'strati e raccolte', tone: 'formation', status: 'ipotesi critica', detail: 'Il libro conserva materiali di diversa origine e profilo letterario, tradizionalmente discussi attraverso modelli compositivi plurali.', relation: 'La formazione è un processo: tradizione, raccolta, riscrittura e redazione non coincidono con il tempo degli eventi raccontati.' },
      { id: 'exilic', layer: 'Formazione del testo', label: 'Esilio', kicker: 'VI sec. a.C.', tone: 'formation', status: 'fase decisiva', detail: 'La fase esilica è spesso considerata importante per la rielaborazione di identità, origini, terra, genealogia e alleanza.', relation: 'La pressione dell’impero e la perdita delle istituzioni cambiano il modo in cui memorie più antiche vengono organizzate e interpretate.' },
      { id: 'persian', layer: 'Formazione del testo', label: 'Età persiana', kicker: 'VI–V sec. a.C.', tone: 'formation', status: 'forma finale discussa', detail: 'Molti modelli collocano in età persiana fasi importanti dell’assetto pentateucale e della forma finale del libro.', relation: 'La datazione resta un modello storico-critico, non una data del mondo narrato.' },
    ],
  },
  {
    id: 'transmission',
    index: '05',
    title: 'Trasmissione',
    question: 'Come il testo continua a vivere e trasformarsi nella sua storia testuale?',
    tone: 'transmission',
    nodes: [
      { id: 'hebrew', layer: 'Trasmissione', label: 'Tradizione ebraica', kicker: 'testo consonantico · MT', tone: 'transmission', status: 'testimone testuale', detail: 'La tradizione ebraica conduce alle forme medievali del testo masoretico attraverso una storia testuale molto più antica.', relation: 'Il Reader può mostrare il testo ebraico come testimone, non come semplice “originale” privo di storia.' },
      { id: 'lxx', layer: 'Trasmissione', label: 'Settanta', kicker: 'tradizione greca', tone: 'transmission', status: 'traduzione / testimone', detail: 'La traduzione greca documenta una fase antica della ricezione e, in alcuni luoghi, una storia testuale non riducibile al solo MT.', relation: 'Confrontare ebraico e greco rende visibile la trasmissione come processo storico.' },
      { id: 'vulgate', layer: 'Trasmissione', label: 'Vulgata', kicker: 'tradizione latina', tone: 'transmission', status: 'ricezione occidentale', detail: 'La tradizione latina porta Genesi nella storia culturale e liturgica dell’Occidente cristiano.', relation: 'È uno dei testimoni della ricezione che Biblia Fontes rende leggibile accanto alle altre tradizioni.' },
    ],
  },
];

const allNodes = lanes.flatMap((lane) => lane.nodes);

function toneClasses(tone: NodeTone, active: boolean) {
  const base = 'border-papyrus-line bg-paper-card text-ink hover:border-bronze/60';
  if (!active) return base;
  if (tone === 'narrative') return 'border-ink bg-ink text-papyrus shadow-md';
  if (tone === 'history') return 'border-bronze bg-bronze/15 text-ink shadow-md';
  if (tone === 'culture') return 'border-seal/60 bg-seal/10 text-ink shadow-md';
  if (tone === 'formation') return 'border-bronze-light bg-bronze/20 text-ink shadow-md';
  return 'border-ink-soft bg-papyrus-deep text-ink shadow-md';
}

export default function GenesisHistoryPrototype({ formationLabel }: GenesisHistoryPrototypeProps) {
  const [selectedId, setSelectedId] = useState('mesopotamia');
  const selected = allNodes.find((node) => node.id === selectedId) || allNodes[0];

  return (
    <section aria-labelledby="genesis-history-title" className="overflow-hidden rounded-3xl border border-papyrus-line bg-paper-card shadow-sm">
      <div className="border-b border-papyrus-line p-6 md:p-8 lg:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-bronze">Cronologia · laboratorio Genesi</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <h2 id="genesis-history-title" className="font-serif text-4xl font-bold leading-tight md:text-5xl">Dentro e intorno al testo</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-soft">Esplora ciò che Genesi racconta, le memorie e i mondi storici con cui può essere messa in relazione, il processo della sua formazione e la storia della sua trasmissione.</p>
          </div>
          <p className="border-l-2 border-bronze pl-4 text-base leading-7 text-ink-soft"><strong className="text-ink">Non è una sola timeline.</strong> Le fasce rappresentano relazioni di natura diversa. Seleziona un nodo per capire che cosa possiamo — e che cosa non possiamo — affermare.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.7fr)]">
        <div className="p-5 md:p-7 lg:p-8">
          <div className="space-y-3">
            {lanes.map((lane) => (
              <div key={lane.id} className="grid gap-3 rounded-2xl border border-papyrus-line/80 bg-papyrus/25 p-4 md:grid-cols-[170px_1fr] md:items-center md:p-5">
                <div>
                  <div className="flex items-center gap-2"><span className="font-mono text-xs text-bronze">{lane.index}</span><span className="h-px flex-1 bg-papyrus-line" /></div>
                  <h3 className="mt-2 font-serif text-xl font-bold">{lane.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-ink-faint">{lane.question}</p>
                </div>
                <div className="relative">
                  <div className="absolute left-2 right-2 top-1/2 h-px bg-papyrus-line" aria-hidden="true" />
                  <div className="relative flex flex-wrap gap-2 md:gap-3">
                    {lane.nodes.map((node) => {
                      const active = node.id === selected.id;
                      return (
                        <button key={node.id} type="button" onClick={() => setSelectedId(node.id)} aria-pressed={active} className={`group min-w-[130px] flex-1 rounded-xl border px-4 py-3 text-left transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze ${toneClasses(node.tone, active)}`}>
                          <span className={`block font-mono text-[10px] uppercase tracking-wider ${active && node.tone === 'narrative' ? 'text-papyrus/70' : 'text-bronze'}`}>{node.kicker}</span>
                          <span className="mt-1 block font-serif text-lg font-bold leading-5">{node.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {formationLabel ? <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-bronze/30 bg-bronze/5 px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-wider text-bronze">Dataset · formazione</span><span className="text-sm leading-6 text-ink-soft">{formationLabel}</span></div> : null}
        </div>

        <aside className="border-t border-papyrus-line bg-papyrus/35 p-6 lg:border-l lg:border-t-0 lg:p-8" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">{selected.layer}</p>
          <h3 className="mt-3 font-serif text-3xl font-bold">{selected.label}</h3>
          <span className="mt-4 inline-flex rounded-full border border-papyrus-line bg-paper-card px-3 py-1.5 text-xs font-semibold text-ink-soft">{selected.status}</span>
          <p className="mt-6 text-lg leading-8 text-ink">{selected.detail}</p>
          {selected.relation ? <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Perché è collegato</p><p className="mt-2 text-base leading-7 text-ink-soft">{selected.relation}</p></div> : null}
          <div className="mt-8 rounded-2xl border border-papyrus-line bg-paper-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Chiave epistemica</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">La posizione nella mappa non equivale a certezza storica. Ogni nodo dichiara il proprio statuto: racconto, comparazione, contesto, ipotesi critica o testimone testuale.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
