'use client';

import React, { useState } from 'react';
import { CATEGORIE } from '../data/categorie';
import BookCard from './BookCard';
import ThemeToggle from './ThemeToggle';
import FocusMode from './FocusMode';
import type { Libro } from '../types';

// Definizione dei 5 Metodi Storico-Critici
const METODI = [
  { 
    id: 'testuale', 
    etichetta: 'Critica Testuale o Bassa Critica', 
    tooltip: 'Ricostruire il testo più antico e originale possibile, confrontando i manoscritti (Sinaiticus, Vaticanus, Rotoli del Mar Morto).' 
  },
  { 
    id: 'fonti', 
    etichetta: 'Critica delle Fonti', 
    tooltip: 'Smontare il testo per risalire alle sue matrici documentarie scritte, spesso di epoche e teologie diverse (es. J, E, D, P).' 
  },
  { 
    id: 'forme', 
    etichetta: 'Critica delle Forme', 
    tooltip: 'Cercare le unità narrative orali e il loro "Sitz im Leben" (ambiente vitale) prima della messa per iscritto.' 
  },
  { 
    id: 'tradizione', 
    etichetta: 'Critica della Tradizione', 
    tooltip: 'Ricostruire lo sviluppo teologico di un tema nel corso dei secoli prima di essere fissato nella Bibbia.' 
  },
  { 
    id: 'redazione', 
    etichetta: 'Critica della Redazione', 
    tooltip: 'Capire la "teologia dell\'editore" e come ha cucito insieme i materiali preesistenti.' 
  }
];

interface HomePageProps {
  initialLibri: Libro[];
}

export default function HomePage({ initialLibri }: HomePageProps) {
  const [libroSelezionato, setLibroSelezionato] = useState<Libro | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [metodoAttivo, setMetodoAttivo] = useState<string | null>(null);

  // Usiamo i dati passati dal server (database Sanity)
  const LIBRI = initialLibri;

  // Logica di filtro combinata (Ricerca + Metodi)
  const libriFiltrati = LIBRI.filter(libro => {
    // 1. Filtro per ricerca testuale
    const matchSearch = libro.titolo.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;

    // 2. Filtro per Metodo Storico-Critico (cerca dentro l'array metodiAnalisi)
    if (metodoAttivo && libro.metodiAnalisi) {
      return libro.metodiAnalisi.some(m => m.metodo === metodoAttivo);
    }

    return true; // Se nessuna lente attiva, mostra tutti
  });

  return (
    <div className="min-h-screen w-full bg-papyrus flex justify-center">
      
      <div className="w-full max-w-[1000px] mx-auto px-8 md:px-16 py-12">
        
        {/* HEADER */}
        <header className="relative mb-10 pb-8 border-b border-papyrus-line">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          
          <div className="text-xs uppercase tracking-[0.2em] text-bronze mb-6 font-mono">
            Mappa Interattiva · Storia della Formazione · Critica Storica
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-ink mb-3 font-serif">Biblia Fontes</h1>
          <h2 className="text-2xl md:text-3xl italic text-seal mb-8 font-serif">L'atlante cronologico della Bibbia</h2>
          
          <p className="text-lg text-ink-soft leading-relaxed max-w-3xl">
            Esplora come i libri della Scrittura si sono stratificati nel tempo, <strong className="text-ink font-semibold">dalla tradizione orale fino alla redazione finale</strong>. 
            Applica un metodo per filtrare la lista secondo l'approccio accademico.
          </p>
        </header>

        {/* RICERCA */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Cerca un libro della Bibbia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-lg border border-papyrus-line bg-paper-card text-ink placeholder:text-ink-faint focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze transition-all text-lg"
          />
        </div>

        {/* METODI STORICO-CRITICI */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-ink font-serif mb-4">Applica un Metodo Storico-Critico</h3>
          
          <p className="text-sm text-ink-soft leading-relaxed max-w-2xl mb-8 italic">
            Tutti i metodi storico-critici possono essere applicati a ogni libro della Bibbia, ma il loro "peso" e la loro "fruttuosità" variano radicalmente a seconda del testo. 
            Cliccando su un metodo, l'elenco evidenzierà i libri per cui quell'approccio rappresenta lo strumento "regina", ovvero il più fecondo e decisivo per l'analisi esegetica. 
            Passa il mouse sui pulsanti per leggere la definizione accademica di ciascun metodo.
          </p>
          
          {/* Pulsanti dei Metodi con Tooltip CSS */}
          <div className="flex flex-wrap justify-center gap-3 items-center">
            {METODI.map(metodo => (
              <div key={metodo.id} className="relative group">
                <button
                  onClick={() => setMetodoAttivo(prev => prev === metodo.id ? null : metodo.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    metodoAttivo === metodo.id 
                      ? 'bg-ink text-papyrus border-ink shadow-md' 
                      : 'bg-paper-card text-ink-soft border-papyrus-line hover:border-bronze hover:text-bronze'
                  }`}
                >
                  {metodo.etichetta}
                </button>
                
                {/* Tooltip grafico */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-ink text-papyrus text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 text-left font-sans">
                  {metodo.tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
                </div>
              </div>
            ))}
            
            {metodoAttivo && (
              <button 
                onClick={() => setMetodoAttivo(null)}
                className="text-xs text-seal hover:underline ml-2"
              >
                Rimuovi filtro ✕
              </button>
            )}
          </div>
        </div>

        {/* LISTA */}
        <main className="flex flex-col gap-14">
          
          {CATEGORIE.map(cat => {
            const libriCategoria = libriFiltrati.filter(l => l.categoriaId === cat.id);
            if (libriCategoria.length === 0) return null;

            return (
              <section key={cat.id}>
                <div className="flex items-center gap-4 mb-8 pb-3 border-b-2" style={{ borderColor: cat.colore }}>
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.colore }}></span>
                  <h3 className="text-2xl font-bold uppercase tracking-wider text-ink-soft font-serif">
                    {cat.etichetta}
                  </h3>
                  <span className="text-sm text-ink-faint ml-auto font-mono">
                    {libriCategoria.length} {libriCategoria.length === 1 ? 'voce' : 'voci'}
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {libriCategoria.map(libro => (
                    <BookCard 
                      key={libro.id} 
                      libro={libro} 
                      categoria={cat} 
                      onClick={() => setLibroSelezionato(libro)} 
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {libriFiltrati.length === 0 && (
            <div className="text-center py-10 text-ink-faint italic text-lg">
              Nessun libro trovato per i criteri selezionati.
            </div>
          )}

        </main>
      </div>

      {/* FOCUS MODE */}
      <FocusMode libro={libroSelezionato} onClose={() => setLibroSelezionato(null)} />

    </div>
  );
}