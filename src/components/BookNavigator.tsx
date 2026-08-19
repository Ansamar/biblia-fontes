import Link from 'next/link';

type MacroSection = {
  capitoloInizio?: number;
  capitoloFine?: number;
  etichetta?: string;
  titolo?: string;
};

type Chapter = {
  _id: string;
  numero: number;
  titolo?: string;
};

function sectionBounds(section: MacroSection) {
  return {
    start: Number(section.capitoloInizio ?? 1),
    end: Number(section.capitoloFine ?? section.capitoloInizio ?? 1),
  };
}

export default function BookNavigator({
  bookSlug,
  bookAbbreviation,
  chapters,
  sections,
}: {
  bookSlug: string;
  bookAbbreviation: string;
  chapters: Chapter[];
  sections: MacroSection[];
}) {
  const usableSections = (sections || []).filter((section) => section.capitoloInizio != null);
  const grouped = usableSections.length
    ? usableSections.map((section) => {
        const { start, end } = sectionBounds(section);
        return {
          label: section.etichetta || section.titolo || `${bookAbbreviation} ${start}–${end}`,
          start,
          end,
          chapters: chapters.filter((chapter) => chapter.numero >= start && chapter.numero <= end),
        };
      })
    : [{ label: 'Capitoli', start: chapters[0]?.numero || 1, end: chapters.at(-1)?.numero || 1, chapters }];

  return (
    <section aria-labelledby="book-index-title" className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-papyrus-line pb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">Navigazione strutturata</p>
          <h2 id="book-index-title" className="mt-2 font-serif text-3xl font-bold md:text-4xl">Indice del libro</h2>
        </div>
        <p className="text-sm text-ink-faint">{chapters.length} capitoli</p>
      </div>

      <div className="divide-y divide-papyrus-line">
        {grouped.map((group, groupIndex) => (
          <section key={`${group.start}-${group.end}`} className="py-8 md:py-10">
            <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
              <header>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">{String(groupIndex + 1).padStart(2, '0')} · {bookAbbreviation} {group.start}{group.end !== group.start ? `–${group.end}` : ''}</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">{group.label}</h3>
              </header>

              <div className="grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
                {group.chapters.map((chapter) => (
                  <Link
                    key={chapter._id}
                    href={`/bibbia/${bookSlug}/${chapter.numero}`}
                    className="group grid min-h-16 grid-cols-[2.25rem_1fr] gap-2 border-b border-papyrus-line/70 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
                  >
                    <span className="font-mono text-xs text-bronze">{String(chapter.numero).padStart(2, '0')}</span>
                    <span className="min-w-0 font-serif text-base leading-5 text-ink-soft transition group-hover:text-bronze">
                      {chapter.titolo || `Capitolo ${chapter.numero}`}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
