import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../src/components/AppShell';
import { client } from '../../../src/sanity/client';

const query = `{
  "libro": *[_id == "libro-genesi"][0]{
    _id, titolo, titoloEbraico, categoriaId, capitoli, lingua, descrizione,
    profiloLetterario, macroSezioni, datazione,
    redazione[]{..., "fonte": fonte->{sigla, nome}}
  },
  "capitoli": *[_type == "capitolo" && libro._ref == "libro-genesi"] | order(numero asc){
    _id, numero, titolo, sintesi
  }
}`;

export default async function GenesisPage() {
  const data = await client.fetch(query);
  if (!data?.libro) notFound();
  const { libro, capitoli } = data;

  return <AppShell><main className="mx-auto max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
    <nav className="mb-10 text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link> <span className="mx-2">/</span> Pentateuco <span className="mx-2">/</span> <span className="text-ink-soft">Genesi</span></nav>

    <section className="border-b border-papyrus-line pb-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">Pentateuco · {libro.capitoli ?? 50} capitoli</p>
      <h1 className="mt-4 font-serif text-6xl font-bold md:text-7xl">{libro.titolo}</h1>
      {libro.titoloEbraico && <p lang="he" dir="rtl" className="mt-3 inline-block font-serif text-2xl text-seal">{libro.titoloEbraico}</p>}
      <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-soft">{libro.descrizione || 'Dalle origini del mondo alle tradizioni patriarcali e alla discesa della famiglia di Giacobbe in Egitto.'}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/bibbia/genesi/1" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-papyrus">Inizia dal capitolo 1 →</Link><a href="#cronologia" className="rounded-full border border-papyrus-line px-5 py-3 text-sm text-ink-soft hover:border-bronze">Cronologia</a></div>
    </section>

    <section className="py-12">
      <p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Architettura letteraria</p><h2 className="mt-2 font-serif text-3xl font-bold">Struttura del libro</h2>
      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {(libro.macroSezioni?.length ? libro.macroSezioni : [
          {capitoloInizio:1, capitoloFine:11, etichetta:'Storia delle origini'},
          {capitoloInizio:12, capitoloFine:25, etichetta:'Abramo'},
          {capitoloInizio:26, capitoloFine:36, etichetta:'Isacco e Giacobbe'},
          {capitoloInizio:37, capitoloFine:50, etichetta:'Giuseppe e la famiglia di Giacobbe'},
        ]).map((m:any, i:number) => <div key={`${m.etichetta}-${i}`} className="flex gap-5 border-t border-papyrus-line py-4"><span className="min-w-16 font-mono text-xs text-bronze">{m.capitoloInizio}–{m.capitoloFine}</span><div><h3 className="font-serif text-xl font-bold">{m.etichetta}</h3>{m.descrizione && <p className="mt-1 text-sm leading-6 text-ink-soft">{m.descrizione}</p>}</div></div>)}
      </div>
    </section>

    <div className="grid gap-12 border-t border-papyrus-line pt-12 lg:grid-cols-[1fr_320px]">
      <section><div className="mb-6 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Navigazione</p><h2 className="mt-2 font-serif text-3xl font-bold">Capitoli</h2></div><span className="text-sm text-ink-faint">{capitoli?.length ?? 0} disponibili</span></div>
        <div className="divide-y divide-papyrus-line">{(capitoli ?? []).map((c:any) => <Link key={c._id} href={`/bibbia/genesi/${c.numero}`} className="group grid grid-cols-[3.2rem_1fr_auto] items-center gap-3 py-4"><span className="font-mono text-xs text-ink-faint">{String(c.numero).padStart(2,'0')}</span><span className="font-serif text-xl font-semibold group-hover:text-bronze">{c.titolo || `Capitolo ${c.numero}`}</span><span className="text-xs text-ink-faint">Gen {c.numero} →</span></Link>)}</div>
      </section>

      <aside id="cronologia" className="h-fit border-l border-papyrus-line pl-0 lg:pl-8"><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Quadro di studio</p><h2 className="mt-2 font-serif text-2xl font-bold">Tempo e formazione</h2><div className="mt-6 space-y-6 text-sm leading-6 text-ink-soft"><div><strong className="block text-ink">Mondo narrato</strong>Tempo primordiale e tradizioni patriarcali: il piano narrativo non coincide con la data di composizione.</div><div><strong className="block text-ink">Formazione letteraria</strong>{libro.datazione?.etichettaInizio || 'Processo compositivo pluristratificato'} {libro.datazione?.etichettaFine ? `— ${libro.datazione.etichettaFine}` : ''}</div><div><strong className="block text-ink">Livelli principali</strong>P · tradizioni non sacerdotali · redazione pentateucale.</div></div><div className="mt-8 rounded-lg border border-papyrus-line bg-paper-card p-4 text-xs leading-5 text-ink-faint">La timeline visuale completa verrà costruita dopo aver modellato separatamente mondo narrato, eventi storici documentabili e formazione del testo.</div></aside>
    </div>
  </main></AppShell>;
}
