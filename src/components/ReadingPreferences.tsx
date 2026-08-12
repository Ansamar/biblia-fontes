'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type FontScale = 'normal' | 'large' | 'xlarge';

const scales: { value: FontScale; label: string; short: string }[] = [
  { value: 'normal', label: 'Testo normale', short: 'A' },
  { value: 'large', label: 'Testo grande', short: 'A' },
  { value: 'xlarge', label: 'Testo molto grande', short: 'A' },
];

export default function ReadingPreferences() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>('normal');

  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem('biblia-font-scale') as FontScale | null;
    if (saved && ['normal', 'large', 'xlarge'].includes(saved)) setFontScale(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.fontScale = fontScale;
    window.localStorage.setItem('biblia-font-scale', fontScale);
  }, [fontScale, mounted]);

  if (!mounted) return <div className="h-10 w-36" aria-hidden="true" />;

  return (
    <div className="flex items-center gap-1 rounded-full border border-papyrus-line bg-paper-card p-1 shadow-sm" aria-label="Preferenze di lettura">
      <div className="flex items-center" role="group" aria-label="Dimensione del testo">
        {scales.map((scale, index) => (
          <button
            key={scale.value}
            type="button"
            onClick={() => setFontScale(scale.value)}
            aria-label={scale.label}
            aria-pressed={fontScale === scale.value}
            className={`flex h-8 w-8 items-center justify-center rounded-full font-serif leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze ${fontScale === scale.value ? 'bg-ink text-papyrus' : 'text-ink-soft hover:bg-papyrus-deep hover:text-ink'}`}
            style={{ fontSize: `${14 + index * 3}px` }}
          >
            {scale.short}
          </button>
        ))}
      </div>
      <span className="mx-1 h-5 w-px bg-papyrus-line" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm text-ink-soft transition-colors hover:bg-papyrus-deep hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        aria-label={resolvedTheme === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
        title={resolvedTheme === 'dark' ? 'Modalità chiara' : 'Modalità scura'}
      >
        <span aria-hidden="true">{resolvedTheme === 'dark' ? '☀' : '☾'}</span>
      </button>
    </div>
  );
}
