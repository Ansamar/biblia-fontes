import type { HistoricalSource, HistoricalSourceKind } from '../historical-explorer/types';

const kindLabels: Record<HistoricalSourceKind, string> = {
  primary: 'fonte primaria',
  secondary: 'studio secondario',
  dataset: 'dataset',
  bibliography: 'bibliografia',
  editorial: 'elaborazione editoriale',
};

export default function HistoricalProvenance({ sources, compact = false }: { sources?: HistoricalSource[]; compact?: boolean }) {
  if (!sources?.length) {
    return <p className="text-xs leading-5 text-ink-faint">Provenienza non ancora strutturata nel dataset.</p>;
  }

  return (
    <ul className={compact ? 'space-y-2' : 'space-y-3'}>
      {sources.map((source, index) => (
        <li key={`${source.label}-${source.kind || 'unspecified'}-${index}`} className="rounded-xl border border-papyrus-line bg-paper-card/65 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <strong className="text-sm leading-5 text-ink">{source.label}</strong>
            {source.kind ? (
              <span className="rounded-full border border-papyrus-line bg-papyrus/70 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-ink-faint">
                {kindLabels[source.kind]}
              </span>
            ) : (
              <span className="rounded-full border border-dashed border-papyrus-line px-2 py-0.5 font-mono text-[8px] uppercase tracking-wide text-ink-faint">
                da classificare
              </span>
            )}
          </div>
          {source.citation ? <p className="mt-2 text-xs leading-5 text-ink-soft">{source.citation}{source.locator ? ` · ${source.locator}` : ''}</p> : source.locator ? <p className="mt-2 text-xs leading-5 text-ink-soft">{source.locator}</p> : null}
          {source.note ? <p className="mt-2 text-xs leading-5 text-ink-faint">{source.note}</p> : null}
          {source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-bronze hover:underline">Apri la fonte ↗</a> : null}
        </li>
      ))}
    </ul>
  );
}
