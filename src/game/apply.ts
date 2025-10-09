import type { GameHistoryItem, GameState } from './models'

export function applyMove(
  state: GameState,
  next: string,
  need: Record<string, number>,
  overlap: number
): GameState {
  const bagCounts = { ...state.bagCounts }
  for (const l of Object.keys(need)) bagCounts[l] = (bagCounts[l] || 0) - need[l]

  const used = new Set(state.usedIndices)
  for (const [l, n] of Object.entries(need)) {
    let remain = n
    for (let i = 0; i < state.puzzle.bagList.length && remain > 0; i++) {
      if (state.puzzle.bagList[i] === l && !used.has(i)) {
        used.add(i)
        remain--
      }
    }
  }

  const startedAt = state.startedAt ?? Date.now()
  const historyItem: GameHistoryItem = {
    word: next.toUpperCase(),
    spent: need,
    overlap,
    ts: Date.now(),
  }

  const totalLeft = Object.values(bagCounts).reduce((a, b) => a + b, 0)
  const cleared = totalLeft === 0

  return {
    ...state,
    currentStack: next.toUpperCase(),
    bagCounts,
    usedIndices: used,
    history: [...state.history, historyItem],
    status: cleared ? 'cleared' : 'playing',
    startedAt,
    endedAt: cleared ? Date.now() : state.endedAt,
  }
}

export function replayUsedIndices(puzzleBag: string[], history: GameHistoryItem[]): Set<number> {
  const used = new Set<number>()
  for (const h of history) {
    for (const [l, nRaw] of Object.entries(h.spent)) {
      let n = nRaw
      for (let i = 0; i < puzzleBag.length && n > 0; i++) {
        if (puzzleBag[i] === l && !used.has(i)) {
          used.add(i)
          n--
        }
      }
    }
  }
  return used
}
