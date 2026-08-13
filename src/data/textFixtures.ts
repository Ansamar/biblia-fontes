import type { BiblicalTextUnit } from '../components/BiblicalTextReader';

// Temporary application fixture generated from the validated DOCX parser.
// It exists only to prove the Reader integration before the same shape is served by Sanity.
export const psalm23Fixture: BiblicalTextUnit = {
  numero: 23,
  numeroAlternativo: 22,
  edizione: 'Testo di lavoro · import DOCX',
  lingua: 'Italiano',
  versetti: [
    { numero: 1, testo: 'Il Signore è il mio pastore: non manco di nulla.', metatesto: { testo: 'Salmo. Di Davide.', stile: 'corsivo' }, riferimentoAlternativo: { salmo: 22, versetto: 1 } },
    { numero: 2, testo: 'Su pascoli erbosi mi fa riposare, ad acque tranquille mi conduce.', riferimentoAlternativo: { salmo: 22, versetto: 2 } },
    { numero: 3, testo: 'Rinfranca l’anima mia, mi guida per il giusto cammino a motivo del suo nome.', riferimentoAlternativo: { salmo: 22, versetto: 3 } },
    { numero: 4, testo: 'Anche se vado per una valle oscura, non temo alcun male, perché tu sei con me. Il tuo bastone e il tuo vincastro mi danno sicurezza.', riferimentoAlternativo: { salmo: 22, versetto: 4 } },
    { numero: 5, testo: 'Davanti a me tu prepari una mensa sotto gli occhi dei miei nemici. Ungi di olio il mio capo; il mio calice trabocca.', riferimentoAlternativo: { salmo: 22, versetto: 5 } },
    { numero: 6, testo: 'Sì, bontà e fedeltà mi saranno compagne tutti i giorni della mia vita, abiterò ancora nella casa del Signore per lunghi giorni.', riferimentoAlternativo: { salmo: 22, versetto: 6 } },
  ],
};

export function textFixtureFor(slug: string, chapter: number): BiblicalTextUnit | null {
  if (slug === 'salmi' && chapter === 23) return psalm23Fixture;
  return null;
}
