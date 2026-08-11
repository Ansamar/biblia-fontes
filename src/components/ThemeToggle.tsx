'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita l'hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full border border-papyrus-line bg-card text-bronze hover:text-ink hover:border-ink transition-all duration-200 shadow-sm"
      title="Cambia tema"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
