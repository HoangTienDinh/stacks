import { useState } from 'react'
import { useDraggable, useDndMonitor } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useGameStore } from '@/store/gameStore'
import { Tile } from './Tile'

export function BagGrid() {
  const { puzzle, usedIndices, pushLetter } = useGameStore(s => ({
    puzzle: s.puzzle, usedIndices: s.usedIndices, pushLetter: s.pushLetter
  }))

  // Track if a drag is currently in-flight to avoid firing click during drags
  const [isDragging, setIsDragging] = useState(false)
  useDndMonitor({
    onDragStart() { setIsDragging(true) },
    onDragEnd()   { setTimeout(() => setIsDragging(false), 0) },
    onDragCancel(){ setIsDragging(false) },
  })

  return (
    <div className="bag-grid mt-4">
      {puzzle.bagList.map((ch, i) => (
        <DraggableTile
          key={i}
          id={`bag-${i}`}
          letter={ch}
          muted={usedIndices.has(i)}
          onActivate={() => !usedIndices.has(i) && !isDragging && pushLetter(ch)}
        />
      ))}
    </div>
  )
}

function DraggableTile({
  id, letter, muted, onActivate,
}: { id: string; letter: string; muted: boolean; onActivate: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { letter },
  })

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    // Important for iOS Safari touch dragging
    touchAction: 'none' as const,
  }

  // Use a <button> for perfect click semantics on desktop
  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!muted ? listeners : {})}
      onClick={onActivate}
      disabled={muted}
      className={muted ? 'pointer-events-none' : ''}
      aria-label={`Bag tile ${letter}`}
    >
      <Tile letter={letter} muted={muted} />
    </button>
  )
}
