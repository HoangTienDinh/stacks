import clsx from 'clsx'
import { useEffect } from 'react'

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
    <div role="dialog" aria-modal="true" aria-label={ariaLabel} className="modal-backdrop" onClick={onClose}>
      <div
        className={clsx('modal-card', panelClassName)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
