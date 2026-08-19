import Image from 'next/image';
import Link from 'next/link';
import ReadingPreferences from '../components/ReadingPreferences';

export default function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-papyrus text-ink">
      <header className="border-b border-papyrus-line/80 bg-papyrus">
        <div className="mx-auto flex min-h-16 max-w-[1320px] items-center gap-6 px-5 md:px-8">
          <Link href="/rebuild" className="flex shrink-0 items-center gap-2.5" aria-label="Biblia Fontes — nuova interfaccia">
            <Image src="/biblia-fontes-mark.svg" width={42} height={35} alt="" priority className="h-9 w-auto dark:brightness-0 dark:invert" />
            <span className="hidden sm:block">
              <strong className="block font-serif text-base tracking-[0.12em]">BIBLIA</strong>
              <span className="block text-[0.58rem] tracking-[0.26em] text-bronze">FONTES</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigazione principale">
            <Link href="/rebuild#bibbia" className="px-3 py-2 text-sm text-ink-soft hover:text-ink">Bibbia</Link>
            <Link href="/rebuild/historical-explorer" className="px-3 py-2 text-sm text-ink-soft hover:text-ink">Storia</Link>
            <Link href="/cerca" className="px-3 py-2 text-sm text-ink-soft hover:text-ink">Ricerca</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/cerca" className="hidden text-sm text-ink-faint hover:text-ink lg:inline">Cerca ⌘K</Link>
            <ReadingPreferences />
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-papyrus-line">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-7 text-xs text-ink-faint md:flex-row md:items-center md:justify-between md:px-8">
          <span>Biblia Fontes · ambiente di studio della Scrittura</span>
          <span>Testo · studio · storia</span>
        </div>
      </footer>
    </div>
  );
}
