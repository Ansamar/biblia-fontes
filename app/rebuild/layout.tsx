import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Biblia Fontes · nuova interfaccia',
    template: '%s · Biblia Fontes',
  },
  description: 'Ambiente accademico integrato per leggere, confrontare, studiare e contestualizzare il testo biblico.',
  robots: { index: false, follow: false },
};

export default function RebuildLayout({ children }: { children: React.ReactNode }) {
  return children;
}
