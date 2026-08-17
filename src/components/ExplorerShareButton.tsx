'use client';

import { useState } from 'react';

export default function ExplorerShareButton() {
  const [copied, setCopied] = useState(false);

  const copyScene = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" onClick={copyScene} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-papyrus-line bg-paper-card px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-bronze hover:text-bronze" aria-live="polite">
      <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
      {copied ? 'Scena copiata' : 'Copia scena'}
    </button>
  );
}
