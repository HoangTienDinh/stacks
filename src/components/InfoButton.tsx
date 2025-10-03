export function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="How to play"
      className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40
                 inline-flex h-9 w-9 items-center justify-center rounded-full
                 border bg-white/90 shadow-sm hover:bg-white active:scale-[0.98]"
    >
      {/* Lightbulb */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" className="text-gray-700">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M2 12h2" /><path d="M20 12h2" />
        <path d="M5 5l1.5 1.5" /><path d="M17.5 6.5L19 5" />
        <path d="M8 14s-2-2-2-5a6 6 0 0 1 12 0c0 3-2 5-2 5" />
      </svg>
    </button>
  )
}
