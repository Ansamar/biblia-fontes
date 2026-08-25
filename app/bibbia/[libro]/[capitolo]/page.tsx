import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../../src/components/AppShell';
import StudyContextNav from '../../../../src/components/StudyContextNav';
import UniversalChapterStudy from '../../../../src/components/UniversalChapterStudy';
import type { BiblicalTextUnit } from '../../../../src/components/BiblicalTextReader';
import { client } from '../../../../src/sanity/client';
import { bookAbbreviation, bookIdFromSlug, categoryLabel } from '../../../../src/lib/bibleRouting';
import { textFixtureFor } from '../../../../src/data/textFixtures';
import { enrichEditorialChapter } from '../../../../src/data/editorialRegistry';
import { parseStudyContext, studyContextHref } from '../../../../src/study-context/context';

const DANIEL_SPECIAL_TRADITIONS = ['susanna_og','susanna_teodozione','bel_og','bel_teodozione'];
const query = `{
  "libro": *[_id == $bookId][0]{_id, titolo, categoriaId, capitoli, mondoDelTesto},
  "capitolo": *[_type == "capitolo" && libro._ref == $bookId && numero == $numero][0]{
    _id, numero, titolo, sintesi, struttura, eventiNarrati, datazione, analisiLetteraria,
    analisiStoricoCritica, tradizione, redazione, contestoStorico, testoCritico,
    attribuzioniFonti[]{..., "fonte": fonte->{_id, sigla, nome, titolo, categoria, descrizione}}, bibliografia
  },
  "testiBiblici": *[_type == "testoBiblicoCapitolo" && libro._ref == $bookId && ((numero == $numero && !($bookId == "libro-daniele" && tradizione in ["susanna_og", "susanna_teodozione", "bel_og", "bel_teodozione"])) || ($bookId == "libro-daniele" && $numero == 13 && tradizione in ["susanna_og", "susanna_teodozione"]) || ($bookId == "libro-daniele" && $numero == 14 && tradizione in ["bel_og", "bel_teodozione"]))]{_id,numero,numeroAlternativo,edizione,lingua,tradizione,testimone,direzione,versetti[]{_key,numero,testo,metatesto,marcatoreAlfabetico,riferimentoAlternativo,statoTestuale,notaEditoriale,apparatoMasoretico}}
}`;

type ReaderWitness = BiblicalTextUnit & {_id?: string};
const normalized = (value?: string) => (value || '').trim().toLocaleLowerCase('it-IT');
function isItalianWitness(t:ReaderWitness){const l=normalized(t.lingua),r=normalized(t.tradizione),e=normalized(t.edizione);return l==='it'||l.includes('italian')||r.includes('cei')||e.includes('cei');}
function priority(t:ReaderWitness){const l=normalized(t.lingua),r=normalized(t.tradizione),e=normalized(t.edizione);if(isItalianWitness(t))return 0;if(!l&&!r&&!e)return 1;if(l==='he'||l.includes('ebra')||r==='mt'||r.includes('masoret'))return 2;if(l==='grc'||l.includes('grec')||r.includes('lxx')||e.includes('settanta'))return 3;if(l==='la'||l.includes('latin')||r.includes('vulg'))return 4;return 5;}
function orderWitnesses(texts:ReaderWitness[]){const seen=new Set<string>();return texts.filter(t=>{const k=[normalized(t.tradizione),normalized(t.lingua),normalized(t.testimone),normalized(t.edizione),String(t.numero??'')].join('|');if(seen.has(k))return false;seen.add(k);return true;}).map((text,index)=>({text,index})).sort((a,b)=>priority(a.text)-priority(b.text)||a.index-b.index).map(x=>x.text);}
function relevant(slug:string,n:number,t:ReaderWitness){if(slug!=='daniele')return true;const tr=normalized(t.tradizione);if(n===13)return !DANIEL_SPECIAL_TRADITIONS.includes(tr)||['susanna_og','susanna_teodozione'].includes(tr);if(n===14)return !DANIEL_SPECIAL_TRADITIONS.includes(tr)||['bel_og','bel_teodozione'].includes(tr);return !DANIEL_SPECIAL_TRADITIONS.includes(tr);}
function titleFromSlug(slug?:string){return slug?slug.split('-').map(p=>p?p[0].toLocaleUpperCase('it-IT')+p.slice(1):p).join(' '):'Historical Explorer';}

export default async function DynamicChapterPage({params,searchParams}:{params:Promise<{libro:string;capitolo:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const {libro:slug,capitolo}=await params;const context=parseStudyContext(await searchParams);const numero=Number(capitolo);if(!Number.isInteger(numero)||numero<1)notFound();
  const bookId=bookIdFromSlug(slug);const data=await client.fetch(query,{bookId,numero});if(!data?.libro||!data?.capitolo)notFound();
  const libro=data.libro;const chapter=enrichEditorialChapter(slug,data.capitolo,numero);const total=libro.capitoli||numero;if(numero>total)notFound();const abbr=bookAbbreviation(slug,libro.titolo);const reference=`${abbr} ${numero}`;const category=categoryLabel(libro.categoriaId);
  const sanityTexts=(Array.isArray(data.testiBiblici)?data.testiBiblici:[]).filter((t:ReaderWitness)=>relevant(slug,numero,t));const fixture=textFixtureFor(slug,numero);const hasItalian=sanityTexts.some(isItalianWitness);const witnesses=orderWitnesses([...(!hasItalian&&fixture?[fixture]:[]),...sanityTexts]);const biblicalText=witnesses.length?{...witnesses[0],witnesses}:fixture;
  const fromHistory=context.source==='history'&&Boolean(context.book);const historyBackHref=fromHistory&&context.book?studyContextHref(`/historical-explorer/${context.book}`,{book:context.book,source:'history',year:context.year,entity:context.entity}):null;const chapterHref=(n:number)=>fromHistory?studyContextHref(`/bibbia/${slug}/${n}`,{book:context.book,chapter:n,source:'history',year:context.year,entity:context.entity}):`/bibbia/${slug}/${n}`;
  return <AppShell><StudyContextNav bookSlug={slug} bookTitle={libro.titolo} firstChapter={1} active="text" historyAvailable/><main className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-14 xl:px-10"><nav className="text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link><span className="mx-2">/</span><span>{category}</span><span className="mx-2">/</span><Link href={`/bibbia/${slug}`} className="hover:text-bronze">{libro.titolo}</Link><span className="mx-2">/</span><span className="text-ink-soft">Capitolo {numero}</span></nav><header className="mt-9"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">{libro.titolo} · Capitolo {numero}</p><h1 className="mt-3 font-serif text-5xl font-bold md:text-6xl">{chapter.titolo||`Capitolo ${numero}`}</h1></div><div className="flex gap-4 text-sm">{numero>1&&<Link href={chapterHref(numero-1)} className="text-ink-soft hover:text-bronze">← {abbr} {numero-1}</Link>}{numero<total&&<Link href={chapterHref(numero+1)} className="text-ink-soft hover:text-bronze">{abbr} {numero+1} →</Link>}</div></div></header>{fromHistory&&historyBackHref&&<section className="mt-7 rounded-2xl border border-bronze/45 bg-bronze/8 p-4 md:flex md:items-center md:justify-between md:gap-5"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Contesto conservato · Storia</p><p className="mt-1 text-sm leading-6 text-ink-soft">Hai aperto {reference} dall’Historical Explorer di {titleFromSlug(context.book)}{context.entity?`, entità “${context.entity}”`:''}{context.year!==undefined?`, alla data di ${Math.abs(context.year)} ${context.year<0?'a.C.':'d.C.'}`:''}. Il collegamento indica pertinenza documentaria o comparativa, non identifica automaticamente il racconto con un evento storico.</p></div><Link href={historyBackHref} className="mt-3 inline-flex shrink-0 rounded-full border border-bronze px-4 py-2 text-sm font-semibold text-bronze hover:bg-bronze hover:text-white md:mt-0">← Torna alla scena storica</Link></section>}<UniversalChapterStudy chapter={chapter} reference={reference} worldNarratedLabel={chapter.eventiNarrati||libro.mondoDelTesto} biblicalText={biblicalText}/></main></AppShell>;
}
