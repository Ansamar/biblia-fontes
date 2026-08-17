'use client';

import { useMemo, useState } from 'react';

type GenesisHistoryPrototypeProps = { formationLabel?: string };
type LaneId = 'narrative' | 'history' | 'cultures' | 'formation' | 'transmission';

type ExplorerNode = {
  id: string;
  lane: LaneId;
  label: string;
  kicker: string;
  status: string;
  detail: string;
  relation: string;
  left: number;
  width?: number;
};

type Lane = {
  id: LaneId;
  index: string;
  title: string;
  question: string;
  note?: string;
};

const lanes: Lane[] = [
  { id: 'narrative', index: '01', title: 'Mondo narrato', question: 'Che cosa racconta il testo?', note: 'Corsia narrativa: non forzata sulla scala storica.' },
  { id: 'history', index: '02', title: 'Storia e memoria', question: 'Quali dati e memorie possono illuminarlo?' },
  { id: 'cultures', index: '03', title: 'Popoli, poteri e culture', question: 'Con quali mondi entra in relazione?' },
  { id: 'formation', index: '04', title: 'Formazione del testo', question: 'Quando e come prende forma letteraria?' },
  { id: 'transmission', index: '05', title: 'Trasmissione', question: 'Come il testo giunge fino a noi?' },
];

const nodes: ExplorerNode[] = [
  { id: 'origins', lane: 'narrative', label: 'Origini', kicker: 'Gen 1–11', status: 'tempo narrativo', detail: 'Creazione, genealogie, diluvio e Babele appartengono al mondo rappresentato dal testo.', relation: 'Questa corsia è volutamente separata dalla scala storica: il racconto non viene trasformato in una datazione degli eventi.', left: 6, width: 23 },
  { id: 'patriarchs', lane: 'narrative', label: 'Patriarchi', kicker: 'Gen 12–36', status: 'memoria narrativa', detail: 'Abramo, Isacco, Giacobbe ed Esaù organizzano la memoria delle origini familiari e territoriali.', relation: 'Il confronto con società e pratiche del Levante può illuminare il racconto senza fissare automaticamente una cronologia dei personaggi.', left: 38, width: 25 },
  { id: 'joseph', lane: 'narrative', label: 'Giuseppe', kicker: 'Gen 37–50', status: 'scenario egiziano', detail: 'Il ciclo di Giuseppe porta la narrazione in Egitto e prepara il passaggio all’Esodo.', relation: 'L’Egitto è insieme spazio narrativo, memoria culturale e potenza storica: i tre livelli devono restare distinguibili.', left: 72, width: 20 },

  { id: 'flood', lane: 'history', label: 'Tradizioni di diluvio', kicker: 'comparandum', status: 'memoria / parallelo', detail: 'Tradizioni di grandi inondazioni sono attestate in culture del Vicino Oriente antico.', relation: 'Il confronto chiarisce l’orizzonte culturale del racconto; non costituisce da solo prova storica dell’evento così come narrato.', left: 8, width: 27 },
  { id: 'social', lane: 'history', label: 'Pratiche sociali', kicker: 'famiglia · diritto', status: 'contesto comparabile', detail: 'Parentela, eredità, alleanze, pastorizia e pratiche giuridiche hanno confronti nel mondo antico.', relation: 'Sono strumenti storico-comparativi utili a leggere istituzioni e comportamenti presupposti dal testo.', left: 42, width: 25 },
  { id: 'egypt-memory', lane: 'history', label: 'Memorie d’Egitto', kicker: 'Gen 37–50', status: 'quadro discusso', detail: 'Il ciclo di Giuseppe conserva elementi egiziani e memorie di mobilità tra Levante ed Egitto.', relation: 'Scenario plausibile, memoria culturale e costruzione letteraria devono essere valutati separatamente.', left: 72, width: 22 },

  { id: 'mesopotamia', lane: 'cultures', label: 'Mesopotamia', kicker: 'cosmogonie · diluvio', status: 'parallelo culturale', detail: 'Cosmogonie, genealogie, racconti di diluvio e culture urbane mesopotamiche offrono un grande campo comparativo.', relation: 'La relazione può essere tradizione condivisa, ricezione, contrasto o rielaborazione: non viene presupposta una dipendenza unica.', left: 4, width: 31 },
  { id: 'canaan', lane: 'cultures', label: 'Canaan / Levante', kicker: 'città · culti · territori', status: 'ambiente culturale', detail: 'Le società e le religioni del Levante costituiscono il mondo geografico e culturale di gran parte delle tradizioni patriarcali.', relation: 'Israele viene letto dentro reti di vicinanza, conflitto, parentela, commercio e scambio culturale.', left: 36, width: 34 },
  { id: 'egypt', lane: 'cultures', label: 'Egitto', kicker: 'potere regionale', status: 'interazione storica', detail: 'L’Egitto è una grande potenza regionale e una presenza decisiva nella memoria biblica.', relation: 'La sua funzione cambia tra scenario narrativo, rapporto politico e memoria teologica: l’Explorer deve rendere visibile questa pluralità.', left: 70, width: 26 },

  { id: 'traditions', lane: 'formation', label: 'Tradizioni e raccolte', kicker: 'I millennio a.C.', status: 'ipotesi critica', detail: 'Genesi conserva materiali di diversa origine e profilo letterario, discussi attraverso modelli compositivi plurali.', relation: 'La formazione è un processo: tradizione, raccolta, riscrittura e redazione non coincidono con il tempo narrato.', left: 48, width: 23 },
  { id: 'exilic', lane: 'formation', label: 'Fase esilica', kicker: 'VI sec. a.C.', status: 'fase decisiva', detail: 'La fase esilica è spesso considerata importante nella rielaborazione di identità, origini, terra, genealogia e alleanza.', relation: 'La pressione imperiale e la perdita delle istituzioni modificano il modo in cui memorie più antiche vengono organizzate e interpretate.', left: 69, width: 13 },
  { id: 'persian', lane: 'formation', label: 'Età persiana', kicker: 'VI–V sec. a.C.', status: 'forma finale discussa', detail: 'Molti modelli collocano in età persiana fasi importanti dell’assetto pentateucale e della forma finale.', relation: 'È una proposta storico-critica sulla composizione, non una data del mondo narrato.', left: 79, width: 14 },

  { id: 'lxx', lane: 'transmission', label: 'Settanta', kicker: 'III–II sec. a.C.', status: 'traduzione / testimone', detail: 'La tradizione greca documenta una fase antica della ricezione e una storia testuale che non si riduce al solo testo masoretico.', relation: 'Il confronto tra ebraico e greco rende visibile la trasmissione come processo storico.', left: 84, width: 9 },
  { id: 'hebrew', lane: 'transmission', label: 'Tradizione ebraica', kicker: 'storia testuale', status: 'testimone testuale', detail: 'La tradizione ebraica conduce alle forme medievali del testo masoretico attraverso una storia testuale molto più antica.', relation: 'Il Reader presenta l’ebraico come testimone con una storia, non come un “originale” privo di trasmissione.', left: 76, width: 17 },
  { id: 'vulgate', lane: 'transmission', label: 'Vulgata', kicker: 'IV–V sec. d.C.', status: 'ricezione occidentale', detail: 'La tradizione latina porta Genesi nella storia culturale, liturgica e interpretativa dell’Occidente cristiano.', relation: 'È una tappa della ricezione e della trasmissione che può essere confrontata con le altre tradizioni nel Reader.', left: 92, width: 8 },
];

const axis = [
  { label: '2500 a.C.', left: 0 },
  { label: '2000', left: 17 },
  { label: '1500', left: 34 },
  { label: '1000', left: 51 },
  { label: '500', left: 68 },
  { label: '0', left: 84 },
  { label: '500 d.C.', left: 100 },
];

const bands = [
  { label: 'Mesopotamia', left: 0, width: 35 },
  { label: 'Egitto', left: 8, width: 62 },
  { label: 'Levante / Canaan', left: 20, width: 52 },
  { label: 'Assiria', left: 58, width: 10 },
  { label: 'Babilonia', left: 67, width: 7 },
  { label: 'Persia', left: 73, width: 9 },
  { label: 'Mondo ellenistico', left: 82, width: 12 },
  { label: 'Roma', left: 92, width: 8 },
];

function NodeButton({ node, selected, onSelect }: { node: ExplorerNode; selected: boolean; onSelect: () => void }) {
  return <button
    type="button"
    onClick={onSelect}
    aria-pressed={selected}
    className={`absolute top-1/2 min-h-14 -translate-y-1/2 rounded-xl border px-3 py-2 text-left shadow-sm transition focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze ${selected ? 'z-20 border-bronze bg-bronze text-white shadow-lg' : 'z-10 border-papyrus-line bg-paper-card/95 text-ink hover:border-bronze/70 hover:bg-paper-card'}`}
    style={{ left: `${node.left}%`, width: `${node.width ?? 14}%` }}
  >
    <span className={`block font-mono text-[9px] uppercase tracking-wider ${selected ? 'text-white/75' : 'text-bronze'}`}>{node.kicker}</span>
    <span className="mt-1 block truncate font-serif text-base font-bold leading-5">{node.label}</span>
  </button>;
}

export default function GenesisHistoryPrototype({ formationLabel }: GenesisHistoryPrototypeProps) {
  const [selectedId, setSelectedId] = useState('mesopotamia');
  const [focus, setFocus] = useState<'all' | LaneId>('all');
  const selected = useMemo(() => nodes.find((node) => node.id === selectedId) ?? nodes[0], [selectedId]);
  const visibleLanes = focus === 'all' ? lanes : lanes.filter((lane) => lane.id === focus);

  return <section aria-labelledby="historical-explorer-title" className="overflow-hidden rounded-3xl border border-papyrus-line bg-paper-card shadow-sm">
    <header className="border-b border-papyrus-line p-6 md:p-8 lg:p-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-bronze">Biblia Fontes Historical Explorer · v0.1</p>
      <div className="mt-3 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-end">
        <div>
          <h2 id="historical-explorer-title" className="font-serif text-4xl font-bold leading-tight md:text-5xl">Genesi dentro la storia</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-soft">Una superficie da esplorare: racconto, memoria, culture, formazione e trasmissione restano distinti, ma diventano leggibili nello stesso campo storico.</p>
        </div>
        <div className="rounded-2xl border border-bronze/30 bg-bronze/5 p-4 text-base leading-7 text-ink-soft"><strong className="text-ink">Regola del modello.</strong> La posizione di un nodo non equivale a certezza storica. La corsia “Mondo narrato” è volutamente non sincronizzata con l’asse cronologico.</div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtra i piani dell’Explorer">
        <button type="button" onClick={() => setFocus('all')} aria-pressed={focus === 'all'} className={`rounded-full border px-4 py-2 text-sm font-semibold ${focus === 'all' ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line text-ink-soft hover:border-bronze'}`}>Tutti i piani</button>
        {lanes.map((lane) => <button key={lane.id} type="button" onClick={() => setFocus(lane.id)} aria-pressed={focus === lane.id} className={`rounded-full border px-4 py-2 text-sm ${focus === lane.id ? 'border-bronze bg-bronze text-white' : 'border-papyrus-line text-ink-soft hover:border-bronze'}`}>{lane.title}</button>)}
      </div>
    </header>

    <div className="grid xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 border-b border-papyrus-line xl:border-b-0 xl:border-r">
        <div className="overflow-x-auto p-5 md:p-7 lg:p-8">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[180px_1fr] gap-4">
              <div />
              <div className="relative h-12 border-b border-papyrus-line">
                {axis.map((tick) => <div key={tick.label} className="absolute bottom-0 -translate-x-1/2" style={{ left: `${tick.left}%` }}><span className="block h-2 border-l border-papyrus-line"/><span className="mt-1 block whitespace-nowrap font-mono text-[10px] text-ink-faint">{tick.label}</span></div>)}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[180px_1fr] gap-4">
              <div className="pt-3"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Sfondo storico</p><p className="mt-1 text-sm leading-5 text-ink-faint">Potenze e aree culturali</p></div>
              <div className="relative h-20 overflow-hidden rounded-2xl border border-papyrus-line bg-papyrus/30">
                {bands.map((band, index) => <button key={band.label} type="button" onClick={() => { const target = nodes.find((node) => node.label.startsWith(band.label.split(' / ')[0])); if (target) setSelectedId(target.id); }} className="absolute rounded-lg border border-papyrus-line/80 bg-paper-card/70 px-2 py-1 text-left font-mono text-[9px] uppercase tracking-wide text-ink-faint hover:border-bronze hover:text-bronze" style={{ left: `${band.left}%`, width: `${band.width}%`, top: `${8 + (index % 3) * 22}px` }}>{band.label}</button>)}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {visibleLanes.map((lane) => {
                const laneNodes = nodes.filter((node) => node.lane === lane.id);
                const narrative = lane.id === 'narrative';
                return <div key={lane.id} className="grid grid-cols-[180px_1fr] gap-4">
                  <div className="rounded-xl border border-papyrus-line bg-papyrus/30 p-3"><div className="flex items-center gap-2"><span className="font-mono text-[10px] text-bronze">{lane.index}</span><span className="h-px flex-1 bg-papyrus-line"/></div><h3 className="mt-2 font-serif text-lg font-bold">{lane.title}</h3><p className="mt-1 text-xs leading-5 text-ink-faint">{lane.question}</p></div>
                  <div className={`relative min-h-24 overflow-hidden rounded-xl border ${narrative ? 'border-dashed border-bronze/45 bg-bronze/5' : 'border-papyrus-line bg-papyrus/20'}`}>
                    {!narrative && axis.slice(1, -1).map((tick) => <span key={tick.label} aria-hidden="true" className="absolute inset-y-0 border-l border-papyrus-line/40" style={{ left: `${tick.left}%` }}/>) }
                    {narrative ? <div className="absolute left-3 top-2 rounded-full border border-bronze/30 bg-paper-card px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-bronze">sequenza narrativa · non in scala</div> : null}
                    {laneNodes.map((node) => <NodeButton key={node.id} node={node} selected={selected.id === node.id} onSelect={() => setSelectedId(node.id)} />)}
                  </div>
                </div>;
              })}
            </div>

            {formationLabel ? <div className="mt-5 grid grid-cols-[180px_1fr] gap-4"><div/><div className="rounded-xl border border-bronze/30 bg-bronze/5 px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-wider text-bronze">Dataset · formazione</span><p className="mt-1 text-sm leading-6 text-ink-soft">{formationLabel}</p></div></div> : null}
          </div>
        </div>
      </div>

      <aside className="bg-papyrus/30 p-6 md:p-8" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bronze">{lanes.find((lane) => lane.id === selected.lane)?.title}</p>
        <h3 className="mt-3 font-serif text-3xl font-bold">{selected.label}</h3>
        <span className="mt-4 inline-flex rounded-full border border-papyrus-line bg-paper-card px-3 py-1.5 text-xs font-semibold text-ink-soft">{selected.status}</span>
        <p className="mt-6 text-lg leading-8 text-ink">{selected.detail}</p>
        <div className="mt-6 border-t border-papyrus-line pt-5"><p className="font-mono text-[10px] uppercase tracking-wider text-bronze">Perché è collegato</p><p className="mt-2 text-base leading-7 text-ink-soft">{selected.relation}</p></div>
        <div className="mt-8 rounded-2xl border border-papyrus-line bg-paper-card p-4"><p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Chiave epistemica</p><p className="mt-2 text-sm leading-6 text-ink-soft">Nodo, banda e corsia descrivono il tipo di relazione. La visualizzazione non trasforma una possibilità storico-critica in un fatto.</p></div>
      </aside>
    </div>
  </section>;
}
