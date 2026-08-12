export default function NabhaWorksBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5" aria-label="NabhaWorks">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-[#3c2c91]/25 bg-white/90 shadow-sm dark:bg-white">
        <svg viewBox="0 0 36 36" className="h-8 w-8" aria-hidden="true">
          <path d="M5 28V7l20 15V7h6v22L11 14v14z" fill="#3c2c91" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-[0.84] text-[#3c2c91] dark:text-[#8e80ff]">
          <strong className="block text-[0.72rem] tracking-[0.18em]">NABHA</strong>
          <strong className="mt-1 block text-[0.72rem] tracking-[0.18em]">WORKS</strong>
        </span>
      )}
    </div>
  );
}
