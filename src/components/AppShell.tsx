import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-papyrus text-ink">
      <header className="sticky top-0 z-40 border-b border-papyrus-line/80 bg-papyrus/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-8 px-5 md:px-8">
          <Link href="/" className="font-serif text-xl font-bold tracking-wide text-ink">Biblia Fontes</Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex" aria-label="Navigazione principale">
            <Link href="/#bibbia" className="hover:text-bronze">Bibbia</Link>
            <Link href="/#esplora" className="hover:text-bronze">Esplora</Link>
            <Link href="/#cronologia" className="hover:text-bronze">Cronologia</Link>
            <Link href="/#fonti" className="hover:text-bronze">Fonti & modelli</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/#cerca" className="rounded-full border border-papyrus-line px-4 py-2 text-sm text-ink-soft hover:border-bronze hover:text-bronze">Cerca <span className="hidden lg:inline">⌘K</span></Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
