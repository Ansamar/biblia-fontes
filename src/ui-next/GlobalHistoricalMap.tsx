'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import HistoricalExplorerMap from '../components/HistoricalExplorerMap';
import type { HistoricalEntity } from '../historical-explorer/types';
import type { HistoryIndexView } from '../data-access/history';

const typeLabels: Record<string,string> = { event:'evento', people:'popolo', empire:'impero', city:'città', region:'regione', person:'persona', institution:'istituzione', practice:'pratica', text:'testo', redaction:'redazione', witness:'testimone' };
const statusLabels: Record<string,string> = { attested:'attestato', probable:'probabile', debated:'discusso', memory:'memoria', comparandum:'comparandum', narrative:'narrativo', undatable:'non databile' };

function formatYear(year:number){ return year < 0 ? `${Math.abs(year)} a.C.` : year === 0 ? '0' : `${year} d.C.`; }
function activeAt(entity:{start?:number;end?:number}, year:number){ return entity.start !== undefined && entity.start <= year && (entity.end ?? entity.start) >= year; }

export default function GlobalHistoricalMap({history,basePath='/historical-explorer'}:{history:HistoryIndexView;basePath?:string}){
  const initialYear = history.range[0] <= -586 && history.range[1] >= -586 ? -586 : Math.round((history.range[0]+history.range[1])/2);
  const [year,setYear] = useState(initialYear);
  const [selectedId,setSelectedId] = useState<string>();
  const [layer,setLayer] = useState<'all'|'places'|'powers'|'events'|'texts'>('all');

  const records = useMemo(() => history.datasets.flatMap(field => field.entities.flatMap(entity => {
    if (!entity.spatial?.lat || !entity.spatial?.lng) return [];
    const compositeId = `${field.slug}::${entity.id}`;
    const mapEntity: HistoricalEntity = {
      id: compositeId,
      type: entity.type as HistoricalEntity['type'],
      label: entity.label,
      summary: '',
      temporal: { start: entity.start, end: entity.end, precision: (entity.precision as HistoricalEntity['temporal']['precision']) || 'unknown' },
      spatial: entity.spatial,
      epistemicStatus: entity.epistemicStatus as HistoricalEntity['epistemicStatus'],
      relations: [],
      sources: [],
    };
    return [{field,entity,compositeId,mapEntity}];
  })), [history.datasets]);

  const visible = useMemo(() => records.filter(record => {
    if (!activeAt(record.entity,year)) return false;
    if (layer === 'places') return ['city','region'].includes(record.entity.type);
    if (layer === 'powers') return ['empire','people','institution','person'].includes(record.entity.type);
    if (layer === 'events') return record.entity.type === 'event';
    if (layer === 'texts') return ['text','redaction','witness','practice'].includes(record.entity.type);
    return true;
  }),[records,year,layer]);

  const selected = records.find(record => record.compositeId === selectedId);

  return <section className="mt-9">
    <div className="grid gap-6 border-b border-papyrus-line pb-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
      <header><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Tempo sulla mappa</p><h2 className="mt-2 font-serif text-4xl font-semibold">{formatYear(year)}</h2><p className="mt-3 text-xs leading-5 text-ink-faint">La carta mostra solo le entità collocate nello spazio e attive nell’anno selezionato.</p></header>
      <div><div className="mb-2 flex justify-between text-[10px] text-ink-faint"><span>{formatYear(history.range[0])}</span><span>{formatYear(history.range[1])}</span></div><input type="range" min={history.range[0]} max={history.range[1]} value={year} onChange={e=>setYear(Number(e.target.value))} aria-label="Anno della mappa storica" className="w-full accent-current"/><div className="mt-4 flex flex-wrap gap-2">{[['all','Tutto'],['places','Luoghi'],['powers','Poteri e popoli'],['events','Eventi'],['texts','Testi e trasmissione']].map(([id,label])=><button key={id} type="button" onClick={()=>setLayer(id as typeof layer)} className={`border px-2.5 py-1 text-[10px] ${layer===id?'border-ink bg-ink text-papyrus':'border-papyrus-line text-ink-faint hover:border-bronze hover:text-bronze'}`}>{label}</button>)}</div></div>
    </div>

    <div className="grid gap-6 py-7 xl:grid-cols-[minmax(0,1fr)_300px]">
      <HistoricalExplorerMap entities={visible.map(record=>record.mapEntity)} year={year} selectedId={selectedId} onSelect={setSelectedId}/>
      <aside className="border-t border-papyrus-line pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        {selected ? <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-bronze">{typeLabels[selected.entity.type] || selected.entity.type} · {statusLabels[selected.entity.epistemicStatus] || selected.entity.epistemicStatus}</p><h3 className="mt-2 font-serif text-2xl font-semibold">{selected.entity.label}</h3><p className="mt-2 text-sm text-ink-soft">{selected.field.title}</p>{selected.entity.spatial?.region && <p className="mt-1 text-xs text-ink-faint">{selected.entity.spatial.region}</p>}<Link href={`${basePath}/${selected.field.slug}?year=${year}&entity=${encodeURIComponent(selected.entity.id)}`} className="mt-5 inline-flex border-b border-bronze pb-1 text-xs font-semibold text-bronze hover:text-ink">Apri nel contesto del libro →</Link></div> : <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">Mappa</p><h3 className="mt-2 font-serif text-2xl font-semibold">Seleziona un luogo o un evento</h3><p className="mt-3 text-sm leading-6 text-ink-faint">La selezione collega immediatamente la posizione geografica al libro biblico e alla rete storica da cui proviene.</p><p className="mt-5 font-serif text-3xl font-semibold">{visible.length}</p><p className="text-xs text-ink-faint">elementi cartografici visibili</p></div>}
      </aside>
    </div>
  </section>;
}
