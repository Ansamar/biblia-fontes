'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import HistoricalMap, { type HistoricalMapPoint } from '../components/historical-map/HistoricalMap';
import type { HistoryIndexView } from '../data-access/history';

const typeLabels: Record<string,string> = { event:'evento', people:'popolo', empire:'impero', city:'città', region:'regione', person:'persona', institution:'istituzione', practice:'pratica', text:'testo', redaction:'redazione', witness:'testimone' };
const statusLabels: Record<string,string> = { attested:'attestato', probable:'probabile', debated:'discusso', memory:'memoria', comparandum:'comparandum', narrative:'narrativo', undatable:'non databile' };
const presets = [-1200,-1000,-722,-586,-539,-332,-167,-63,30,70,100];

function formatYear(year:number){ return year < 0 ? `${Math.abs(year)} a.C.` : year === 0 ? '0' : `${year} d.C.`; }
function activeAt(entity:{start?:number;end?:number;precision?:string}, year:number){
  if (entity.precision === 'unknown' || entity.start === undefined) return true;
  return entity.start <= year && (entity.end ?? entity.start) >= year;
}
function finite(value:unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }

export default function GlobalHistoricalMap({history,basePath='/historical-explorer'}:{history:HistoryIndexView;basePath?:string}){
  const initialYear = history.range[0] <= -586 && history.range[1] >= -586 ? -586 : Math.round((history.range[0]+history.range[1])/2);
  const [year,setYear] = useState(initialYear);
  const [selectedId,setSelectedId] = useState<string>();
  const [layer,setLayer] = useState<'all'|'places'|'powers'|'events'|'texts'>('all');

  const records = useMemo(() => history.datasets.flatMap(field => field.entities.flatMap(entity => {
    const lat = entity.spatial?.lat;
    const lng = entity.spatial?.lng;
    if (!finite(lat) || !finite(lng)) return [];
    return [{field,entity,compositeId:`${field.slug}::${entity.id}`,lat,lng}];
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
  const plotted = visible.length ? visible : records;
  const points: HistoricalMapPoint[] = plotted.map(record => ({
    id: record.compositeId,
    label: record.entity.label,
    type: record.entity.type,
    lat: record.lat,
    lng: record.lng,
    active: visible.some(item => item.compositeId === record.compositeId),
    selected: selectedId === record.compositeId,
    subtitle: record.field.title,
  }));

  return <section className="mt-9">
    <div className="grid gap-6 border-b border-papyrus-line pb-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
      <header><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Tempo sulla mappa</p><h2 className="mt-2 font-serif text-4xl font-semibold">{formatYear(year)}</h2><p className="mt-3 text-xs leading-5 text-ink-faint">La carta mostra le entità georeferenziate attive nell’anno selezionato sullo stesso sistema cartografico usato nei singoli libri.</p></header>
      <div><div className="mb-2 flex justify-between text-[10px] text-ink-faint"><span>{formatYear(history.range[0])}</span><span>{formatYear(history.range[1])}</span></div><input type="range" min={history.range[0]} max={history.range[1]} value={year} onChange={e=>setYear(Number(e.target.value))} aria-label="Anno della mappa storica" className="w-full accent-current"/><div className="mt-4 flex flex-wrap gap-2">{presets.filter(p=>p>=history.range[0]&&p<=history.range[1]).map(p=><button key={p} type="button" onClick={()=>setYear(p)} className={`border px-2.5 py-1 text-[10px] ${year===p?'border-ink bg-ink text-papyrus':'border-papyrus-line text-ink-faint hover:border-bronze'}`}>{formatYear(p)}</button>)}</div><div className="mt-3 flex flex-wrap gap-2">{([['all','Tutto'],['places','Luoghi'],['powers','Poteri e popoli'],['events','Eventi'],['texts','Testi e trasmissione']] as const).map(([id,label])=><button key={id} type="button" onClick={()=>setLayer(id)} className={`border px-2.5 py-1 text-[10px] ${layer===id?'border-ink bg-ink text-papyrus':'border-papyrus-line text-ink-faint hover:border-bronze hover:text-bronze'}`}>{label}</button>)}</div></div>
    </div>

    <div className="grid gap-6 py-7 xl:grid-cols-[minmax(0,1fr)_300px]">
      <HistoricalMap
        points={points}
        selectedId={selectedId}
        onSelect={setSelectedId}
        headerRight={<span>{visible.length} elementi nell’anno selezionato</span>}
        footer="Carta geografica editoriale comune di Biblia Fontes. La base serve all’orientamento storico; i marker derivano dalle coordinate archiviate nei dataset."
      />

      <aside className="border-t border-papyrus-line pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        {selected ? <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-bronze">{typeLabels[selected.entity.type] || selected.entity.type} · {statusLabels[selected.entity.epistemicStatus] || selected.entity.epistemicStatus}</p><h3 className="mt-2 font-serif text-2xl font-semibold">{selected.entity.label}</h3><p className="mt-2 text-sm text-ink-soft">{selected.field.title}</p>{selected.entity.spatial?.region && <p className="mt-1 text-xs text-ink-faint">{selected.entity.spatial.region}</p>}<p className="mt-3 font-mono text-[9px] text-ink-faint">{selected.lat.toFixed(2)}°, {selected.lng.toFixed(2)}°</p><Link href={`${basePath}/${selected.field.slug}?year=${year}&entity=${encodeURIComponent(selected.entity.id)}`} className="mt-5 inline-flex border-b border-bronze pb-1 text-xs font-semibold text-bronze hover:text-ink">Apri nel contesto del libro →</Link></div> : <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">Mappa</p><h3 className="mt-2 font-serif text-2xl font-semibold">Seleziona un punto</h3><p className="mt-3 text-sm leading-6 text-ink-faint">Ogni punto collega una coordinata al libro biblico e alla relativa entità storica, sulla stessa base geografica dell’intero Historical Explorer.</p><p className="mt-5 font-serif text-3xl font-semibold">{visible.length}</p><p className="text-xs text-ink-faint">elementi cartografici visibili</p>{visible.length===0&&records.length>0?<p className="mt-3 text-xs leading-5 text-ink-faint">Nessuna entità datata coincide con l’anno scelto: la carta mantiene in secondo piano tutte le coordinate disponibili.</p>:null}</div>}
      </aside>
    </div>
  </section>;
}
