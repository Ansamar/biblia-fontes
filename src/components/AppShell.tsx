import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import NabhaWorksBadge from './NabhaWorksBadge';
import ReadingPreferences from './ReadingPreferences';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-papyrus text-ink">
      <header className="sticky top-0 z-40 border-b border-papyrus-line/80 bg-papyrus/95 backdrop-blur">
        <div className="relative mx-auto flex min-h-[72px] max-w-[1220px] items-center gap-5 px-4 py-2 sm:px-5 md:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Biblia Fontes — Home">
            <Image src="/biblia-fontes-mark.svg" width={48} height={40} alt="" priority className="h-10 w-auto dark:brightness-0 dark:invert" />
            <span className="hidden leading-none sm:block">
              <strong className="block font-serif text-[1.08rem] tracking-[0.12em] text-ink">BIBLIA</strong>
              <span className="mt-1 block text-[0.64rem] tracking-[0.28em] text-bronze">FONTES</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-ink-soft md:flex" aria-label="Navigazione principale">
            <Link href="/#bibbia" className="hover:text-bronze">Bibbia</Link>
            <Link href="/#esplora" className="hover:text-bronze">Esplora</Link>
            <Link href="/#cronologia" className="hover:text-bronze">Cronologia</Link>
            <Link href="/#fonti" className="hover:text-bronze">Fonti & modelli</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/#cerca" className="hidden min-h-11 items-center rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze lg:flex">Cerca <span className="ml-1 hidden xl:inline">⌘K</span></Link>
            <ReadingPreferences />
            <MobileMenu />
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-papyrus-line bg-paper-card/55">
        <div className="mx-auto max-w-[1220px] px-5 py-10 md:px-8 md:py-12">
          <div className="grid gap-9 md:grid-cols-[1.1fr_.9fr] md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/biblia-fontes-mark.svg" width={46} height={38} alt="" className="h-9 w-auto opacity-90 dark:brightness-0 dark:invert" />
                <div><p className="font-serif text-lg font-semibold tracking-wide">Biblia Fontes</p><p className="text-sm text-ink-faint">Studio · fonti · contesto</p></div>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-ink-faint">Un ambiente di studio biblico stratificato: dal quadro essenziale all’analisi critica, con attenzione a storia, formazione e trasmissione del testo.</p>
            </div>

            <div className="border-t border-papyrus-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Progetto e design</p>
              <NabhaWorksBadge />
              <p className="mt-3 text-sm text-ink-faint">Tecnologia e design per la conoscenza.</p>
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-3 border-t border-papyrus-line pt-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 NabhaWorks · Biblia Fontes</span>
            <span>Vertical slice di studio · Home → Genesi → Genesi 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
