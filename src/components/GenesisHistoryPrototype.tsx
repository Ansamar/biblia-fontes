type GenesisHistoryPrototypeProps = {
  formationLabel?: string;
};

type EpistemicTag = {
  label: string;
  tone?: 'bronze' | 'neutral' | 'seal';
};

type HistoryLayer = {
  index: string;
  eyebrow: string;
  title: string;
  question: string;
  description: string;
  items: string[];
  tags?: EpistemicTag[];
};

const layers: HistoryLayer[] = [
  {
    index: '01',
    eyebrow: 'Racconto',
    title: 'Mondo narrato',
    question: 'In quale tempo il testo colloca ciò che racconta?',
    description:
      'Genesi attraversa tempi narrativi molto diversi: origini del cosmo e dell’umanità, genealogie, diluvio, dispersione dei popoli, cicli patriarcali e discesa della famiglia di Giacobbe in Egitto.',
    items: [
      'Gen 1–11 · origini, genealogie, diluvio e Babele',
      'Gen 12–36 · Abramo, Isacco, Giacobbe ed Esaù',
      'Gen 37–50 · Giuseppe, i fratelli e l’Egitto',
    ],
    tags: [
      { label: 'tempo narrativo', tone: 'neutral' },
      { label: 'non sempre databile', tone: 'seal' },
    ],
  },
  {
    index: '02',
    eyebrow: 'Storia',
    title: 'Storia e memoria',
    question: 'Quali dati o memorie possono essere messi criticamente in relazione con il racconto?',
    description:
      'Qui non si cerca di trasformare il racconto in cronaca. Si distinguono riscontri, comparanda, possibili memorie storiche, dati archeologici o ambientali e tradizioni culturali che possono illuminare il testo.',
    items: [
      'Tradizioni di grandi inondazioni nel Vicino Oriente antico',
      'Pratiche familiari, pastorali e giuridiche confrontabili con ambienti antichi',
      'Memorie e scenari egiziani pertinenti al ciclo di Giuseppe',
    ],
    tags: [
      { label: 'comparabile', tone: 'bronze' },
      { label: 'memoria culturale', tone: 'neutral' },
      { label: 'grado di certezza esplicito', tone: 'seal' },
    ],
  },
  {
    index: '03',
    eyebrow: 'Relazioni',
    title: 'Popoli, poteri e culture',
    question: 'Quali società e culture contribuiscono al mondo nel quale la narrazione acquista significato?',
    description:
      'La storia biblica viene letta come storia di relazione: incontri, conflitti, scambi, dipendenze e rielaborazioni culturali concorrono alla formazione dell’identità e del linguaggio biblico.',
    items: [
      'Mesopotamia · cosmogonie, genealogie, racconti di diluvio e culture urbane',
      'Canaan · città, società, religioni e ambienti culturali del Levante',
      'Egitto · potere regionale, amministrazione, memoria e ambiente narrativo',
    ],
    tags: [
      { label: 'interazione culturale', tone: 'bronze' },
      { label: 'conflitto e scambio', tone: 'neutral' },
    ],
  },
  {
    index: '04',
    eyebrow: 'Composizione',
    title: 'Formazione del testo',
    question: 'Quando e attraverso quali processi il libro ha preso forma?',
    description:
      'Il tempo della composizione non coincide con il tempo narrato. Tradizioni, raccolte, riletture e redazioni vengono rappresentate come un processo pluristratificato, con ipotesi e datazioni esplicitamente qualificate.',
    items: [
      'Tradizioni sacerdotali e non sacerdotali',
      'Rielaborazioni e integrazioni in più fasi',
      'Forma pentateucale e assetto letterario finale',
    ],
    tags: [
      { label: 'ipotesi critica', tone: 'neutral' },
      { label: 'datazioni discusse', tone: 'seal' },
    ],
  },
  {
    index: '05',
    eyebrow: 'Testo',
    title: 'Trasmissione',
    question: 'Come il testo di Genesi è giunto fino a noi?',
    description:
      'La storia del libro continua dopo la sua formazione: testimoni manoscritti, tradizioni testuali e traduzioni documentano una trasmissione plurale che Biblia Fontes rende confrontabile nel Reader.',
    items: [
      'Tradizione ebraica e testo masoretico',
      'Settanta e tradizione greca',
      'Testimoni antichi, Vulgata e successive tradizioni di ricezione',
    ],
    tags: [
      { label: 'testimoni testuali', tone: 'bronze' },
      { label: 'storia della trasmissione', tone: 'neutral' },
    ],
  },
];

function tagClass(tone: EpistemicTag['tone']) {
  if (tone === 'bronze') return 'border-bronze/45 bg-bronze/10 text-bronze';
  if (tone === 'seal') return 'border-seal/35 bg-seal/5 text-seal';
  return 'border-papyrus-line bg-paper-card text-ink-faint';
}

export default function GenesisHistoryPrototype({ formationLabel }: GenesisHistoryPrototypeProps) {
  return (
    <section aria-labelledby="genesis-history-title" className="rounded-3xl border border-papyrus-line bg-paper-card p-6 shadow-sm md:p-8 lg:p-10">
      <div className="grid gap-7 border-b border-papyrus-line pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-bronze">Cronologia · prototipo Genesi</p>
          <h2 id="genesis-history-title" className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl">Il testo nella storia</h2>
          <p className="reading-text mt-4 text-ink-soft">
            Un testo biblico appartiene a più storie contemporaneamente. Biblia Fontes distingue il tempo del racconto, le possibili relazioni con la storia, il mondo dei popoli e delle culture, la formazione letteraria e la trasmissione del testo.
          </p>
        </div>
        <div className="rounded-2xl border border-bronze/35 bg-bronze/5 p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-bronze">Principio di lettura</p>
          <p className="mt-2 font-serif text-xl font-semibold leading-7 text-ink">Le cinque fasce non indicano cinque date dello stesso tipo.</p>
          <p className="mt-2 text-base leading-7 text-ink-soft">La differenza tra i piani è parte dell’informazione, non un difetto da uniformare.</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {layers.map((layer) => (
          <article key={layer.index} className="grid gap-5 rounded-2xl border border-papyrus-line bg-papyrus/35 p-5 md:p-6 lg:grid-cols-[92px_minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-7">
            <div>
              <span className="font-mono text-sm font-semibold text-bronze">{layer.index}</span>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">{layer.eyebrow}</p>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold md:text-3xl">{layer.title}</h3>
              <p className="mt-2 text-base font-semibold leading-6 text-ink">{layer.question}</p>
              <p className="mt-3 text-base leading-7 text-ink-soft">{layer.description}</p>
              {layer.index === '04' && formationLabel ? (
                <div className="mt-4 rounded-xl border border-bronze/35 bg-paper-card px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-bronze">Dataset · formazione</span>
                  <p className="mt-1 text-base font-medium leading-6 text-ink">{formationLabel}</p>
                </div>
              ) : null}
            </div>

            <div className="lg:border-l lg:border-papyrus-line lg:pl-7">
              <ul className="space-y-3">
                {layer.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-7 text-ink-soft">
                    <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {layer.tags?.length ? (
                <div className="mt-5 flex flex-wrap gap-2" aria-label={`Indicatori per ${layer.title}`}>
                  {layer.tags.map((tag) => (
                    <span key={tag.label} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${tagClass(tag.tone)}`}>{tag.label}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-5 border-t border-papyrus-line pt-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-bronze">Regola epistemica</p>
          <p className="mt-2 text-base leading-7 text-ink-soft">Ogni relazione proposta dovrà dichiarare il proprio statuto: dato attestato, ricostruzione plausibile, ipotesi discussa, parallelo culturale o memoria tradizionale.</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-bronze">Prospettiva</p>
          <p className="mt-2 text-base leading-7 text-ink-soft">Il livello storico-critico resta distinto dalla lettura canonica e dalla prospettiva cattolica, che potranno dialogare senza essere confuse con la ricostruzione storica.</p>
        </div>
      </div>
    </section>
  );
}
