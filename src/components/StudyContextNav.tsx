'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { studyContextHref } from '../study-context/context';

type StudyMode = 'overview' | 'text' | 'study' | 'timeline' | 'history';

type StudyContextNavProps = {
  bookSlug: string;
  bookTitle: string;
  firstChapter?: number;
  active?: StudyMode;
  historyAvailable?: boolean;
};

const baseItem = 'inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-medium transition';
const activeItem = `${baseItem} bg-ink text-papyrus`;
const idleItem = `${baseItem} text-ink-soft hover:bg-papyrus-deep/60 hover:text-bronze`;
const disabledItem = `${baseItem} cursor-default text-ink-faint/60`;

function modeFromLocation(fallback: StudyMode): StudyMode {
  if (typeof window === 'undefined') return fallback;
  if (window.location.pathname.startsWith('/historical-explorer/')) return 'history';
  const hash = window.location.hash;
  if (hash === '#testo') return 'text';
  if (hash === '#studio') return 'study';
  if (hash === '#timeline') return 'timeline';
  if (hash === '#panoramica' || !hash) return fallback;
  return fallback;
}

export default function StudyContextNav({
  bookSlug,
  bookTitle,
  firstChapter = 1,
  active = 'overview',
  historyAvailable = false,
}: StudyContextNavProps) {
  const [currentMode, setCurrentMode] = useState<StudyMode>(active);

  useEffect(() => {
    const sync = () => setCurrentMode(modeFromLocation(active));
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [active]);

  const items = [
    { key: 'overview' as const, label: 'Panoramica', href: `/bibbia/${bookSlug}#panoramica` },
    { key: 'text' as const, label: 'Testo', href: `/bibbia/${bookSlug}/${firstChapter}#testo` },
    { key: 'study' as const, label: 'Studio', href: `/bibbia/${bookSlug}#studio` },
    { key: 'timeline' as const, label: 'Timeline', href: `/bibbia/${bookSlug}#timeline` },
  ];
  const historyHref = studyContextHref(`/historical-explorer/${bookSlug}`, { book: bookSlug, source: currentMode === 'timeline' ? 'timeline' : 'book' });

  return (
    <div className="sticky top-[72px] z-30 border-b border-papyrus-line/80 bg-papyrus/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 overflow-x-auto px-5 py-3 md:px-8">
        <div className="mr-2 hidden shrink-0 border-r border-papyrus-line pr-5 lg:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-bronze">Contesto di studio</p>
          <p className="mt-0.5 max-w-[180px] truncate font-serif text-sm font-semibold text-ink">{bookTitle}</p>
        </div>

        <nav aria-label={`Modalità di studio di ${bookTitle}`} className="flex shrink-0 items-center gap-1 rounded-full border border-papyrus-line bg-paper-card/65 p-1">
          {items.map((item) => (
            <Link key={item.key} href={item.href} aria-current={currentMode === item.key ? 'page' : undefined} className={currentMode === item.key ? activeItem : idleItem} onClick={() => setCurrentMode(item.key)}>
              {item.label}
            </Link>
          ))}
          {historyAvailable ? (
            <Link href={historyHref} aria-current={currentMode === 'history' ? 'page' : undefined} className={currentMode === 'history' ? activeItem : idleItem} onClick={() => setCurrentMode('history')}>
              Storia
            </Link>
          ) : (
            <span className={disabledItem} title="Historical Explorer non ancora modellato per questo libro">Storia</span>
          )}
        </nav>

        <p className="ml-auto hidden max-w-[310px] text-right text-xs leading-5 text-ink-faint xl:block">
          Cambia prospettiva senza perdere il libro che stai studiando.
        </p>
      </div>
    </div>
  );
}
