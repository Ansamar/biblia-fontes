'use client';

import Link from 'next/link';
import { historicalBiblicalReferenceTarget } from '../lib/biblicalReferenceLink';
import { studyContextHref } from '../study-context/context';

type Props = {
  references: string[];
  originBookSlug?: string;
  year: number;
  entityId: string;
};

function chapterHref(bookSlug: string, chapter: number, originBookSlug: string | undefined, year: number, entityId: string) {
  return `${studyContextHref(`/bibbia/${bookSlug}/${chapter}`, {
    book: originBookSlug || bookSlug,
    chapter,
    source: 'history',
    year,
    entity: entityId,
  })}#testo`;
}

export default function HistoricalBiblicalReferences({ references, originBookSlug, year, entityId }: Props) {
  return (
    <div className="mt-3 space-y-2">
      {references.map((reference) => {
        const target = historicalBiblicalReferenceTarget(reference, { originBook: originBookSlug, year, entity: entityId });
        if (!target) {
          return <span key={reference} className="inline-flex min-h-9 items-center rounded-full border border-papyrus-line px-3 py-2 text-xs text-ink-soft">{reference}</span>;
        }

        const hasRange = target.chapter !== undefined && target.endChapter !== undefined && target.endChapter > target.chapter;
        if (!hasRange) {
          return <Link key={reference} href={target.href} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-bronze/45 bg-paper-card px-3 py-2 text-xs font-semibold text-bronze transition hover:border-bronze hover:bg-bronze hover:text-white"><span>{reference}</span><span aria-hidden="true">→</span></Link>;
        }

        const chapters = Array.from({ length: target.endChapter! - target.chapter! + 1 }, (_, index) => target.chapter! + index);
        return (
          <details key={reference} className="rounded-xl border border-bronze/35 bg-paper-card/70 p-2.5">
            <summary className="cursor-pointer list-none rounded-lg px-1 py-1 text-xs font-semibold text-bronze marker:hidden">
              <span className="inline-flex items-center gap-2"><span>{reference}</span><span className="text-ink-faint">· scegli capitolo</span><span aria-hidden="true">▾</span></span>
            </summary>
            <div className="mt-2 border-t border-papyrus-line pt-2">
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {chapters.map((chapter) => (
                  <Link key={chapter} href={chapterHref(target.bookSlug, chapter, originBookSlug, year, entityId)} className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-papyrus-line bg-papyrus/50 px-2 text-[11px] font-semibold text-ink-soft transition hover:border-bronze hover:text-bronze" title={`Apri capitolo ${chapter}`}>
                    {chapter}
                  </Link>
                ))}
              </div>
              <Link href={target.href} className="mt-2 inline-flex text-[11px] font-semibold text-bronze hover:underline">Apri dal capitolo {target.chapter} →</Link>
            </div>
          </details>
        );
      })}
    </div>
  );
}
