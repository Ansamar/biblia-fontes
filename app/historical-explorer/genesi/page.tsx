import Link from 'next/link';
import AppShell from '../../../src/components/AppShell';
import GenesisHistoryPrototype from '../../../src/components/GenesisHistoryPrototype';
import { client } from '../../../src/sanity/client';

const query = `*[_id == "libro-genesi"][0]{
  titolo,
  datazione
}`;

export default async function GenesisHistoricalExplorerPage() {
  const libro = await client.fetch(query);
  const formationLabel = [libro?.datazione?.etichettaInizio, libro?.datazione?.etichettaFine]
    .filter(Boolean)
    .join(' — ') || 'Processo compositivo pluristratificato, con fasi e datazioni discusse.';

  return (
    <AppShell>
      <main className="bg-paper-card/35">
        <section className="border-b border-papyrus-line bg-paper-card">
          <div className="mx-auto max-w-[1520px] px-5 py-8 md:px-8 md:py-10">
            <nav className="text-sm text-ink-faint" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-bronze">Bibbia</Link>
              <span className="mx-2">/</span>
              <Link href="/bibbia/genesi" className="hover:text-bronze">Genesi</Link>
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Historical Explorer</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">Ambiente parallelo di studio</p>
                <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">Biblia Fontes Historical Explorer</h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-soft">Un ambiente autonomo per esplorare relazioni tra racconto, storia, popoli, formazione e trasmissione senza sovraccaricare la Timeline della scheda libro.</p>
              </div>
              <Link href="/bibbia/genesi#cronologia" className="rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze">← Torna alla Timeline</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1520px] px-3 py-5 md:px-6 md:py-8">
          <GenesisHistoryPrototype formationLabel={formationLabel} />
        </section>
      </main>
    </AppShell>
  );
}
