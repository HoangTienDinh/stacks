
export type Letter = string // 'A'..'Z'

export type DailyPuzzle = {
  date: string // ISO date
  wordOfDay: string // 5 letters
  bagList: Letter[] // exactly 15 letters
}

export type GameHistoryItem = {
  word: string
  spent: Record<Letter, number>
  overlap: number // 1..4
  ts: number
}

export type GameState = {
  puzzle: DailyPuzzle
  currentStack: string
  usedIndices: Set<number> // muted tiles by index
  bagCounts: Record<Letter, number>
  history: GameHistoryItem[]
  status: 'playing' | 'cleared'
  startedAt: number | null
  endedAt: number | null
}
