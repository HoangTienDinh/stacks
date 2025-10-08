import React from 'react'
import clsx from 'clsx'

type Item = { index: number; word: string }

/**
 * Compact, muted list of submitted stacks shown ABOVE the current stack.
 * Example rows: "0 QUEUE", "1 BREAD", "2 TRACE"
 */
export function HistoryTape({
  items,
  className,
}: { items: Item[]; className?: string }) {
  if (!items?.length) return null

  return (
    <div className={clsx('mb-2 flex flex-col items-center gap-1', className)}>
      {items.map(({ index, word }) => (
        <div
          key={`${index}-${word}`}
          className="text-[12px] sm:text-[13px] tracking-[0.35em] text-gray-400 uppercase"
        >
          <span className="mr-2 tabular-nums">{index}</span>
          <span>{word}</span>
        </div>
      ))}
    </div>
  )
}
