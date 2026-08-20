'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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
function markerClass(type:string, selected:boolean){
  if (selected) return 'fill-bronze stroke-ink';
  if (type === 'event') return 'fill-[#703026] stroke-white';
  if (type === 'empire' || type === 'people') return 'fill-[#443222] stroke-white';
  if (type === 'city') return 'fill-[#30271f] stroke-white';
  return 'fill-[#9b6a38] stroke-white';
}

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
  const bounds = useMemo(() => {
    if (!plotted.length) return {minLat:20,maxLat:42,minLng:20,maxLng:58};
    const lats = plotted.map(r=>r.lat), lngs = plotted.map(r=>r.lng);
    let minLat=Math.min(...lats), maxLat=Math.max(...lats), minLng=Math.min(...lngs), maxLng=Math.max(...lngs);
    const latPad=Math.max(2,(maxLat-minLat)*0.12), lngPad=Math.max(3,(maxLng-minLng)*0.12);
    minLat-=latPad; maxLat+=latPad; minLng-=lngPad; maxLng+=lngPad;
    return {minLat,maxLat,minLng,maxLng};
  },[plotted]);
  const project=(lat:number,lng:number)=>({
    x: 40 + ((lng-bounds.minLng)/(bounds.maxLng-bounds.minLng||1))*920,
    y: 30 + ((bounds.maxLat-lat)/(bounds.maxLat-bounds.minLat||1))*470,
  });

  return <section className="mt-9">
    <div className="grid gap-6 border-b border-papyrus-line pb-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
      <header><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Tempo sulla mappa</p><h2 className="mt-2 font-serif text-4xl font-semibold">{formatYear(year)}</h2><p className="mt-3 text-xs leading-5 text-ink-faint">La carta mostra le entità georeferenziate attive nell’anno selezionato. I punti usano le coordinate storiche presenti nei dataset.</p></header>
      <div><div className="mb-2 flex justify-between text-[10px] text-ink-faint"><span>{formatYear(history.range[0])}</span><span>{formatYear(history.range[1])}</span></div><input type="range" min={history.range[0]} max={history.range[1]} value={year} onChange={e=>setYear(Number(e.target.value))} aria-label="Anno della mappa storica" className="w-full accent-current"/><div className="mt-4 flex flex-wrap gap-2">{presets.filter(p=>p>=history.range[0]&&p<=history.range[1]).map(p=><button key={p} type="button" onClick={()=>setYear(p)} className={`border px-2.5 py-1 text-[10px] ${year===p?'border-ink bg-ink text-papyrus':'border-papyrus-line text-ink-faint hover:border-bronze'}`}>{formatYear(p)}</button>)}</div><div className="mt-3 flex flex-wrap gap-2">{([['all','Tutto'],['places','Luoghi'],['powers','Poteri e popoli'],['events','Eventi'],['texts','Testi e trasmissione']] as const).map(([id,label])=><button key={id} type="button" onClick={()=>setLayer(id)} className={`border px-2.5 py-1 text-[10px] ${layer===id?'border-ink bg-ink text-papyrus':'border-papyrus-line text-ink-faint hover:border-bronze hover:text-bronze'}`}>{label}</button>)}</div></div>
    </div>

    <div className="grid gap-6 py-7 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="overflow-hidden rounded-2xl border border-papyrus-line bg-paper-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-papyrus-line px-4 py-2"><span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">Carta storica · coordinate reali</span><span className="text-[11px] text-ink-faint">{visible.length} elementi nell’anno selezionato</span></div>
        <div className="relative bg-[radial-gradient(circle_at_center,rgba(155,106,56,.08),transparent_68%)]">
          <svg viewBox="0 0 1000 530" className="block h-[430px] w-full md:h-[500px]" role="img" aria-label="Mappa schematica delle entità storiche georeferenziate">
            <rect x="0" y="0" width="1000" height="530" className="fill-[#f4efe5]" />
            {[1,2,3,4].map(i=><line key={`h${i}`} x1="0" x2="1000" y1={i*106} y2={i*106} className="stroke-[#d8cdbb]" strokeWidth="1" strokeDasharray="4 8"/>)}
            {[1,2,3,4,5].map(i=><line key={`v${i}`} y1="0" y2="530" x1={i*166.7} x2={i*166.7} className="stroke-[#d8cdbb]" strokeWidth="1" strokeDasharray="4 8"/>)}
            <path d="M78 376 C155 314 237 296 316 328 C380 354 423 348 475 303 C528 257 582 222 645 215 C710 208 775 234 829 204 C872 180 912 142 959 126" fill="none" className="stroke-[#b8ab97]" strokeWidth="18" strokeLinecap="round" opacity=".28"/>
            <path d="M224 44 C280 95 305 159 284 216 C263 272 220 305 187 343" fill="none" className="stroke-[#b9c5c2]" strokeWidth="36" strokeLinecap="round" opacity=".34"/>
            {plotted.map(record=>{const p=project(record.lat,record.lng);const isSelected=selectedId===record.compositeId;return <g key={record.compositeId} className="cursor-pointer" role="button" tabIndex={0} onClick={()=>setSelectedId(record.compositeId)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedId(record.compositeId)}}} aria-label={record.entity.label}><circle cx={p.x} cy={p.y} r={isSelected?9:6} className={markerClass(record.entity.type,isSelected)} strokeWidth={isSelected?3:2}/><title>{record.entity.label} · {record.field.title}</title>{isSelected&&<text x={p.x+13} y={p.y+4} className="fill-[#30271f] text-[13px] font-semibold" style={{paintOrder:'stroke',stroke:'#f4efe5',strokeWidth:5,strokeLinejoin:'round'}}>{record.entity.label}</text>}</g>})}
            {!plotted.length&&<text x="500" y="265" textAnchor="middle" className="fill-[#766b5e] text-[18px]">Nessuna coordinata disponibile</text>}
          </svg>
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-papyrus-line bg-paper-card/95 px-3 py-2 shadow-sm"><p className="font-mono text-[8px] uppercase tracking-wider text-ink-faint">Legenda</p><p className="mt-1 text-[10px] text-ink-soft">● città · ● poteri/popoli · ● eventi · ● altre relazioni</p></div>
        </div>
        <div className="border-t border-papyrus-line bg-papyrus/25 px-4 py-2 text-[10px] leading-5 text-ink-faint">Carta schematica indipendente da servizi cartografici esterni. La posizione dei marker deriva da latitudine e longitudine archiviate nei dataset; lo sfondo è solo orientativo.</div>
      </div>

      <aside className="border-t border-papyrus-line pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        {selected ? <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-bronze">{typeLabels[selected.entity.type] || selected.entity.type} · {statusLabels[selected.entity.epistemicStatus] || selected.entity.epistemicStatus}</p><h3 className="mt-2 font-serif text-2xl font-semibold">{selected.entity.label}</h3><p className="mt-2 text-sm text-ink-soft">{selected.field.title}</p>{selected.entity.spatial?.region && <p className="mt-1 text-xs text-ink-faint">{selected.entity.spatial.region}</p>}<p className="mt-3 font-mono text-[9px] text-ink-faint">{selected.lat.toFixed(2)}°, {selected.lng.toFixed(2)}°</p><Link href={`${basePath}/${selected.field.slug}?year=${year}&entity=${encodeURIComponent(selected.entity.id)}`} className="mt-5 inline-flex border-b border-bronze pb-1 text-xs font-semibold text-bronze hover:text-ink">Apri nel contesto del libro →</Link></div> : <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">Mappa</p><h3 className="mt-2 font-serif text-2xl font-semibold">Seleziona un punto</h3><p className="mt-3 text-sm leading-6 text-ink-faint">Ogni punto collega una coordinata al libro biblico e alla relativa entità storica.</p><p className="mt-5 font-serif text-3xl font-semibold">{visible.length}</p><p className="text-xs text-ink-faint">elementi cartografici visibili</p>{visible.length===0&&records.length>0?<p className="mt-3 text-xs leading-5 text-ink-faint">Nessuna entità datata coincide con l’anno scelto: la carta mantiene in secondo piano tutte le coordinate disponibili.</p>:null}</div>}
      </aside>
    </div>
  </section>;
}
