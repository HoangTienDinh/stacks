import { useUIStore } from '@/store/uiStore'

export function BackHomeButton() {
  const go = useUIStore(s => s.go)

  return (
    <button
      type="button"
      aria-label="Back to Home"
      onClick={() => go('landing')}
      className="fixed left-3 z-40 rounded-full border border-gray-300
                 bg-white/80 shadow-sm backdrop-blur
                 hover:bg-white active:translate-y-[1px] transition
                 h-10 w-10 grid place-items-center"
      style={{
        // keep clear of the notch / status bar
        top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
      }}
    >
      {/* simple chevron */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           className="text-gray-700">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  )
}
