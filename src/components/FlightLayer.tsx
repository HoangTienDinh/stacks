import { motion } from 'framer-motion'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { useGameStore } from '@/store/gameStore'

type Rect = { x: number; y: number; w: number; h: number }
function getRect(sel: string): Rect | null {
  const el = document.querySelector(sel) as HTMLElement | null
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

export function FlightLayer() {
  const { flights, consumeFlight, reduceMotion } = useGameStore((s) => ({
    flights: s.flights,
    consumeFlight: s.consumeFlight,
    reduceMotion: s.reduceMotion,
  }))
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {flights.map((f) => (
        <Flight
          key={f.id}
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
  letter,
  from,
  to,
  onDone,
  reduceMotion,
}: {
  letter: string
  from: { type: 'bag'; index: number } | { type: 'stack'; pos: number }
  to: { slot: number }
  onDone: () => void
  reduceMotion: boolean
}) {
  const [fromRect, setFromRect] = useState<Rect | null>(null)
  const [toRect, setToRect] = useState<Rect | null>(null)

  useLayoutEffect(() => {
    const fSel = from.type === 'bag' ? `[data-bag-idx="${from.index}"]` : `[data-stack-pos="${from.pos}"]`
    const tSel = `[data-slot-idx="${to.slot}"]`
    let raf = 0
    const tick = () => {
      const f = getRect(fSel)
      const t = getRect(tSel)
      setFromRect(f)
      setToRect(t)
      if (!f || !t) raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
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
      <div className="tile" data-size="lg" aria-hidden>
        {letter}
      </div>
    </motion.div>
  )
}
