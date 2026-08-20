'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { categoryLabel } from '../lib/bibleRouting';
import { studyContextHref } from '../study-context/context';

type Source = {_id:string;sigla?:string;nome?:string;descrizione?:any;tipo?:any;periodo?:any;datazione?:any;note?:any};
type Usage = {_id:string;numero:number;titolo?:string;libro?:{_id:string;titolo:string;categoriaId?:string};sourceIds:string[]};

type CanonGroup = {id:string;label:string;books:string[]};

const text = (v:any):string => {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return v.map(text).filter(Boolean).join(' · ');
  return v.etichetta || v.descrizione || v.nota || v.nome || v.titolo || '';
};

const slug = (id:string) => id.replace(/^libro-/, '');

const CANON_GROUPS: CanonGroup[] = [
  {id:'pentateuco', label:'Pentateuco', books:['libro-genesi','libro-esodo','libro-levitico','libro-numeri','libro-deuteronomio']},
  {id:'storici', label:'Libri storici', books:['libro-giosue','libro-giudici','libro-rut','libro-1-samuele','libro-2-samuele','libro-1-re','libro-2-re','libro-1-cronache','libro-2-cronache','libro-esdra','libro-neemia','libro-tobia','libro-giuditta','libro-ester','libro-1-maccabei','libro-2-maccabei']},
  {id:'sapienziali', label:'Sapienziali e poetici', books:['libro-giobbe','libro-salmi','libro-proverbi','libro-qoelet','libro-cantico-dei-cantici','libro-sapienza','libro-siracide']},
  {id:'profeti', label:'Profeti', books:['libro-isaia','libro-geremia','libro-lamentazioni','libro-baruc','libro-ezechiele','libro-daniele','libro-osea','libro-gioele','libro-amos','libro-abdia','libro-giona','libro-michea','libro-naum','libro-abacuc','libro-sofonia','libro-aggeo','libro-zaccaria','libro-malachia']},
  {id:'vangeli', label:'Vangeli', books:['libro-matteo','libro-marco','libro-luca','libro-giovanni']},
  {id:'atti', label:'Atti degli Apostoli', books:['libro-atti']},
  {id:'paoline', label:'Lettere paoline', books:['libro-romani','libro-1-corinti','libro-2-corinti','libro-galati','libro-efesini','libro-filippesi','libro-colossesi','libro-1-tessalonicesi','libro-2-tessalonicesi','libro-1-timoteo','libro-2-timoteo','libro-tito','libro-filemone']},
  {id:'ebrei', label:'Ebrei', books:['libro-ebrei']},
  {id:'cattoliche', label:'Lettere cattoliche', books:['libro-giacomo','libro-1-pietro','libro-2-pietro','libro-1-giovanni','libro-2-giovanni','libro-3-giovanni','libro-giuda']},
  {id:'apocalisse', label:'Apocalisse', books:['libro-apocalisse']},
];

const CANON_ORDER = new Map(CANON_GROUPS.flatMap(group => group.books).map((id, index) => [id, index]));

function canonicalOrder(bookId?: string) {
  return bookId ? (CANON_ORDER.get(bookId) ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;
}

export default function SourcesModelsMap({sources, usages}:{sources:Source[];usages:Usage[]}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string|null>(null);
  const [group, setGroup] = useState('pentateuco');

  const stats = useMemo(() => new Map(sources.map(source => {
    const hits = usages.filter(usage => usage.sourceIds.includes(source._id));
    const books = Array.from(new Map(hits.filter(hit => hit.libro).map(hit => [hit.libro!._id, hit.libro!])).values())
      .sort((a,b) => canonicalOrder(a._id) - canonicalOrder(b._id));
    const firstOrder = books.length ? canonicalOrder(books[0]._id) : Number.MAX_SAFE_INTEGER;
    return [source._id, {hits, books, firstOrder}];
  })), [sources, usages]);

  const selectedGroup = CANON_GROUPS.find(item => item.id === group) || CANON_GROUPS[0];
  const selectedBooks = useMemo(() => new Set(selectedGroup.books), [selectedGroup]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('it-IT');
    return sources
      .filter(source => {
        const stat = stats.get(source._id);
        const inGroup = stat?.books.some(book => selectedBooks.has(book._id));
        if (!inGroup) return false;
        if (!q) return true;
        return [source.sigla, source.nome, text(source.descrizione), text(source.tipo)]
          .some(value => (value || '').toLocaleLowerCase('it-IT').includes(q));
      })
      .sort((a,b) => {
        const aStat = stats.get(a._id);
        const bStat = stats.get(b._id);
        const first = (aStat?.firstOrder ?? Number.MAX_SAFE_INTEGER) - (bStat?.firstOrder ?? Number.MAX_SAFE_INTEGER);
        if (first !== 0) return first;
        return (a.nome || a.sigla || a._id).localeCompare(b.nome || b.sigla || b._id, 'it');
      });
  }, [sources, stats, selectedBooks, query]);

  const active = selected ? sources.find(source => source._id === selected) : null;
  const activeStat = active ? stats.get(active._id) : null;

  const contextualHref = (bookId:string, chapter?:number) => {
    const bookSlug = slug(bookId);
    const base = chapter ? `/bibbia/${bookSlug}/${chapter}` : `/bibbia/${bookSlug}`;
    const href = studyContextHref(base, {book:bookSlug, chapter, source:'source', entity:active?._id});
    return chapter ? `${href}#livelli-critici` : href;
  };

  const chooseGroup = (id:string) => {
    setGroup(id);
    setSelected(null);
  };

  return <div>
    <header className="mb-8 border-b border-papyrus-line pb-7">
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-bronze">Esplora il corpus</p>
      <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Fonti e modelli per ambito biblico</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft">Scegli una sezione del canone. Le fonti e i modelli sono presentati secondo il primo libro in cui risultano collegati, non secondo la loro sigla tecnica.</p>
    </header>

    <nav className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-papyrus-line" aria-label="Ambiti del canone">
      {CANON_GROUPS.map(item => <button key={item.id} type="button" onClick={() => chooseGroup(item.id)} className={`border-b-2 px-0.5 pb-3 text-sm transition ${group === item.id ? 'border-bronze font-semibold text-ink' : 'border-transparent text-ink-faint hover:text-ink'}`}>{item.label}</button>)}
    </nav>

    <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="h-fit lg:sticky lg:top-36">
        <div className="mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">{selectedGroup.label}</p>
          <p className="mt-1 text-sm text-ink-faint">{filtered.length} {filtered.length === 1 ? 'voce collegata' : 'voci collegate'}</p>
        </div>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cerca in questa sezione…" aria-label={`Cerca fonti in ${selectedGroup.label}`} className="min-h-11 w-full rounded-full border border-papyrus-line bg-paper-card px-4 text-sm outline-none focus:border-bronze" />
        <div className="mt-4 max-h-[62vh] divide-y divide-papyrus-line overflow-auto border-y border-papyrus-line">
          {filtered.map(source => {
            const stat = stats.get(source._id);
            const firstBook = stat?.books.find(book => selectedBooks.has(book._id));
            return <button key={source._id} type="button" onClick={() => setSelected(source._id)} className={`w-full px-1 py-4 text-left transition ${selected === source._id ? 'text-bronze' : 'text-ink hover:text-bronze'}`}>
              <div className="flex items-baseline justify-between gap-3">
                <strong className="font-serif text-lg leading-tight">{source.nome || source._id}</strong>
                {source.sigla && <span className="shrink-0 font-mono text-[10px] font-semibold text-ink-faint">{source.sigla}</span>}
              </div>
              {firstBook && <p className="mt-1 text-xs text-ink-faint">da {firstBook.titolo}</p>}
            </button>;
          })}
          {!filtered.length && <p className="py-6 text-sm leading-6 text-ink-faint">Nessuna fonte collegata ai capitoli di questa sezione con i criteri correnti.</p>}
        </div>
      </aside>

      <section>
        {active && activeStat ? <>
          <article className="border-b border-papyrus-line pb-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                {active.sigla && <p className="font-mono text-xs font-semibold text-bronze">{active.sigla}</p>}
                <h2 className="mt-2 font-serif text-4xl font-bold md:text-5xl">{active.nome || active._id}</h2>
              </div>
              {text(active.tipo) && <span className="rounded-full border border-papyrus-line px-3 py-1 text-xs text-ink-faint">{text(active.tipo)}</span>}
            </div>
            {text(active.descrizione) && <p className="reading-text mt-6 text-ink-soft">{text(active.descrizione)}</p>}
            {(text(active.periodo) || text(active.datazione) || text(active.note)) && <div className="mt-6 border-l-2 border-bronze pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Datazione / nota</p><p className="mt-1 text-sm leading-6 text-ink-soft">{text(active.periodo) || text(active.datazione) || text(active.note)}</p></div>}
          </article>

          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Nel corpus</p>
            <h3 className="mt-2 font-serif text-3xl font-bold">Libri e capitoli collegati</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-faint">Sono mostrate le attribuzioni effettivamente registrate nei capitoli. Selezionando un capitolo si apre direttamente il relativo apparato critico.</p>
            <div className="mt-5 divide-y divide-papyrus-line border-y border-papyrus-line">
              {activeStat.books.map(book => {
                const chapters = activeStat.hits.filter(hit => hit.libro?._id === book._id).sort((a,b) => a.numero - b.numero);
                return <article key={book._id} className="grid gap-3 py-5 md:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <p className="text-xs text-ink-faint">{categoryLabel(book.categoriaId)}</p>
                    <Link href={contextualHref(book._id)} className="font-serif text-xl font-bold hover:text-bronze">{book.titolo}</Link>
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    {chapters.map(chapter => <Link key={chapter._id} href={contextualHref(book._id, chapter.numero)} title={chapter.titolo || `Capitolo ${chapter.numero}`} className="min-w-9 rounded-full border border-papyrus-line px-3 py-1.5 text-center text-sm text-ink-soft hover:border-bronze hover:text-bronze">{chapter.numero}</Link>)}
                  </div>
                </article>;
              })}
              {!activeStat.books.length && <p className="py-6 text-ink-faint">Nessuna attribuzione di capitolo registrata per questa voce.</p>}
            </div>
          </div>
        </> : <div className="border-l border-papyrus-line px-6 py-4 md:px-10 md:py-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">{selectedGroup.label}</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold">Scegli una fonte o un modello</h2>
          <p className="mt-4 max-w-xl leading-7 text-ink-soft">La selezione mostra dove quella fonte, tradizione o ipotesi critica è collegata ai libri e ai capitoli del corpus.</p>
        </div>}
      </section>
    </div>
  </div>;
}
