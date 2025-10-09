import { useEffect } from 'react'
import clsx from 'clsx'

type ModalProps = {
  open: boolean
  onClose: () => void
  ariaLabel: string
  panelClassName?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, ariaLabel, panelClassName, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={ariaLabel} className="fixed inset-0 z-50">
      {/* Visual backdrop (no click needed here) */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Wrapper sits on top. Click anywhere in here that's NOT the panel → close */}
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className={clsx(
            'max-h-[88dvh] w-[min(92vw,560px)] overflow-auto rounded-2xl border bg-white shadow-2xl',
            panelClassName
          )}
          onClick={(e) => e.stopPropagation()} // don’t close when clicking inside the panel
        >
          {children}
        </div>
      </div>
    </div>
  )
}
