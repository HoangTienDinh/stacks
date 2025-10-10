import { useUIStore } from '@/store/uiStore'

export function BackHomeButton() {
  const go = useUIStore((s) => s.go)

  return (
    <button
      type="button"
      aria-label="Back to Home"
      onClick={() => go('landing')}
      className="btn btn-circle focus-ring fixed left-3 z-40 border-token bg-surface/80 backdrop-blur"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}
      data-variant="outline"
      data-size="sm"
    >
      {/* chevron */}
      <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-text"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  )
}
