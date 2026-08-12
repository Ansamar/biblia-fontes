import Image from 'next/image';
import Link from 'next/link';
import ReadingPreferences from './ReadingPreferences';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-papyrus text-ink">
      <header className="sticky top-0 z-40 border-b border-papyrus-line/80 bg-papyrus/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1220px] items-center gap-6 px-5 py-2 md:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Biblia Fontes — Home">
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
            <Link href="/#cerca" className="hidden rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze sm:block">Cerca <span className="hidden lg:inline">⌘K</span></Link>
            <ReadingPreferences />
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-papyrus-line bg-paper-card/45">
        <div className="mx-auto flex max-w-[1220px] flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <Image src="/biblia-fontes-mark.svg" width={46} height={38} alt="" className="h-9 w-auto opacity-90 dark:brightness-0 dark:invert" />
            <div><p className="font-serif text-lg font-semibold tracking-wide">Biblia Fontes</p><p className="text-sm text-ink-faint">Studio · fonti · contesto</p></div>
          </div>
          <div className="text-sm text-ink-faint md:text-right"><p>Un progetto <strong className="font-semibold tracking-wide text-ink-soft">NabhaWorks</strong></p><p className="mt-1">Tecnologia e design per la conoscenza.</p></div>
        </div>
      </footer>
    </div>
  );
}
