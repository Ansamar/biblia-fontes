import type { HistoricalDatasetDiagnostics } from '../historical-explorer/diagnostics';

export default function HistoricalDatasetMethodology({ diagnostics }: { diagnostics: HistoricalDatasetDiagnostics }) {
  const warnings = diagnostics.issues.filter((issue) => issue.severity === 'warning');
  const errors = diagnostics.issues.filter((issue) => issue.severity === 'error');
  const classifiedPercent = diagnostics.sourceCount
    ? Math.round((diagnostics.classifiedSourceCount / diagnostics.sourceCount) * 100)
    : 0;
  const structuredRefsPercent = diagnostics.biblicalReferenceCount
    ? Math.round((diagnostics.structuredBiblicalReferenceCount / diagnostics.biblicalReferenceCount) * 100)
    : 100;

  return (
    <details className="rounded-2xl border border-papyrus-line bg-paper-card/75 px-4 py-3 shadow-sm">
      <summary className="cursor-pointer list-none marker:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bronze">Trasparenza del dataset</p>
            <p className="mt-1 text-sm font-semibold text-ink">Provenienza classificata: {classifiedPercent}% · riferimenti strutturati: {structuredRefsPercent}%</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] text-ink-faint">
            <span className="rounded-full border border-papyrus-line px-2.5 py-1">{diagnostics.entityCount} entità</span>
            <span className="rounded-full border border-papyrus-line px-2.5 py-1">{diagnostics.areaCount} geometrie</span>
            <span className="rounded-full border border-papyrus-line px-2.5 py-1">{diagnostics.classifiedSourceCount}/{diagnostics.sourceCount} fonti classificate</span>
            <span className="rounded-full border border-papyrus-line px-2.5 py-1">{diagnostics.structuredBiblicalReferenceCount}/{diagnostics.biblicalReferenceCount} riferimenti strutturati</span>
            <span className={`rounded-full border px-2.5 py-1 ${errors.length ? 'border-seal/40 text-seal' : warnings.length ? 'border-bronze/40 text-bronze' : 'border-papyrus-line text-ink-faint'}`}>{errors.length ? `${errors.length} errori` : warnings.length ? `${warnings.length} avvisi` : 'diagnostica pulita'}</span>
          </div>
        </div>
      </summary>

      <div className="mt-4 border-t border-papyrus-line pt-4 text-xs leading-5 text-ink-faint">
        <p>La diagnostica controlla relazioni, intervalli temporali, target cartografici, provenance e struttura dei riferimenti biblici. Non misura la verità storica delle interpretazioni: quella resta espressa dallo stato epistemico e dalle fonti associate a ciascuna entità.</p>
        {diagnostics.issues.length ? (
          <ul className="mt-3 space-y-2">
            {diagnostics.issues.map((issue, index) => (
              <li key={`${issue.code}-${issue.ownerId}-${index}`} className="rounded-lg border border-papyrus-line bg-papyrus/25 px-3 py-2">
                <span className="font-mono text-[8px] uppercase tracking-wide">{issue.severity === 'error' ? 'errore' : 'avviso'} · {issue.code}</span>
                <span className="ml-2">{issue.message}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}
