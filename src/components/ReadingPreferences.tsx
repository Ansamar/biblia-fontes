'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type FontScale = 'normal' | 'large' | 'xlarge';

const scales: { value: FontScale; label: string; size: string }[] = [
  { value: 'normal', label: 'Testo normale', size: 'text-[11px]' },
  { value: 'large', label: 'Testo grande', size: 'text-[13px]' },
  { value: 'xlarge', label: 'Testo molto grande', size: 'text-[15px]' },
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

  if (!mounted) return <div className="h-8 w-28" aria-hidden="true" />;

  return <div className="flex h-8 items-center border-l border-papyrus-line pl-2" aria-label="Preferenze di lettura">
    <div className="flex items-center" role="group" aria-label="Dimensione del testo">
      {scales.map((scale) => <button key={scale.value} type="button" onClick={() => setFontScale(scale.value)} aria-label={scale.label} aria-pressed={fontScale === scale.value} className={`flex h-8 w-7 items-center justify-center font-serif transition ${scale.size} ${fontScale === scale.value ? 'text-bronze' : 'text-ink-faint hover:text-ink'}`}>A</button>)}
    </div>
    <button type="button" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="ml-1 flex h-8 w-8 items-center justify-center text-xs text-ink-faint hover:text-ink" aria-label={resolvedTheme === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'} title={resolvedTheme === 'dark' ? 'Modalità chiara' : 'Modalità scura'}><span aria-hidden="true">{resolvedTheme === 'dark' ? '☀' : '☾'}</span></button>
  </div>;
}
