import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

type Rect = { x: number; y: number; w: number; h: number }
function getRect(sel: string): Rect | null {
  const el = document.querySelector(sel) as HTMLElement | null
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

export function FlightLayer() {
  const { flights, consumeFlight, reduceMotion } = useGameStore(s => ({
    flights: s.flights,
    consumeFlight: s.consumeFlight,
    reduceMotion: s.reduceMotion,
  }))
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {flights.map(f => (
        <Flight
          key={f.id}
          id={f.id}
          letter={f.letter}
          from={f.from}
          to={f.to}
          onDone={() => consumeFlight(f.id)}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>,
    document.body
  )
}

function Flight({
  id, letter, from, to, onDone, reduceMotion,
}: {
  id: string
  letter: string
  from: { type: 'bag'; index: number } | { type: 'stack'; pos: number }
  to: { slot: number }
  onDone: () => void
  reduceMotion: boolean
}) {
  const [fromRect, setFromRect] = useState<Rect | null>(null)
  const [toRect, setToRect] = useState<Rect | null>(null)

  // measure immediately and retry next frame if needed
  useLayoutEffect(() => {
    const fSel = from.type === 'bag' ? `[data-bag-idx="${from.index}"]` : `[data-stack-pos="${from.pos}"]`
    const tSel = `[data-slot-idx="${to.slot}"]`

    const measure = () => {
      setFromRect(getRect(fSel))
      setToRect(getRect(tSel))
    }
    measure()
    if (!fromRect || !toRect) {
      const raf = requestAnimationFrame(measure)
      return () => cancelAnimationFrame(raf)
    }
  }, [from, to])

  if (!fromRect || !toRect) return null

  const style = {
    position: 'fixed' as const,
    left: fromRect.x,
    top: fromRect.y,
    width: fromRect.w,
    height: fromRect.h,
  }
  const dx = toRect.x - fromRect.x
  const dy = toRect.y - fromRect.y
  const duration = reduceMotion ? 0.01 : 0.18

  return (
    <motion.div
      style={style}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: dx, y: dy, opacity: 1, scale: 1 }}
      transition={{ type: 'tween', duration }}
      onAnimationComplete={onDone}
      className="flex items-center justify-center"
    >
      <div className="tile tile-lg w-16 h-16 sm:w-20 sm:h-20">{letter}</div>
    </motion.div>
  )
}
