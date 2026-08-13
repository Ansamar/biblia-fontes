'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  ['Bibbia', '/#bibbia'],
  ['Strumenti', '/strumenti'],
  ['Cronologia', '/strumenti/cronologia'],
  ['Fonti & modelli', '/strumenti/fonti'],
  ['Confronto testuale', '/strumenti/confronto'],
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  return <div className="md:hidden"><button type="button" onClick={() => setOpen((v) => !v)} className="flex h-11 w-11 items-center justify-center rounded-full border border-papyrus-line text-xl text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Chiudi menu' : 'Apri menu'}><span aria-hidden="true">{open ? '×' : '≡'}</span></button>{open && <div id="mobile-navigation" className="absolute left-4 right-4 top-[68px] z-50 rounded-2xl border border-papyrus-line bg-paper-card p-3 shadow-2xl"><nav aria-label="Navigazione mobile" className="divide-y divide-papyrus-line">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between px-3 py-3 font-serif text-xl font-semibold text-ink hover:text-bronze">{label}<span aria-hidden="true" className="text-sm text-bronze">→</span></Link>)}</nav><Link href="/strumenti/ricerca" onClick={() => setOpen(false)} className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-papyrus">Cerca nel corpus</Link></div>}</div>;
}
