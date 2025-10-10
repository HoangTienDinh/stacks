import clsx from 'clsx'
import React from 'react'

type Item = { index: number; word: string }

export function HistoryTape({ items, className }: { items: Item[]; className?: string }) {
  if (!items?.length) return null

  return (
    <div className={clsx('mb-2 flex flex-col items-center gap-1', className)}>
      {items.map(({ index, word }) => (
        <div
          key={`${index}-${word}`}
          className="text-[12px] uppercase tracking-[0.35em] text-muted sm:text-[13px]"
        >
          <span className="mr-2 tabular-nums">{index}</span>
          <span>{word}</span>
        </div>
      ))}
    </div>
  )
}
