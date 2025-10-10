export type Letter = string; // 'A'..'Z'

export type DailyPuzzle = {
  date: string;          // ISO date
  wordOfDay: string;     // 5 letters
  bagList: Letter[];     // exactly 12 letters (BAG_SIZE)
};

export type GameHistoryItem = {
  word: string;
  spent: Record<Letter, number>;
  overlap: number;       // 1..4
  ts: number;
};

export type GameState = {
  puzzle: DailyPuzzle;
  currentStack: string;                // 5 letters
  usedIndices: Set<number>;            // muted bag tiles by index
  bagCounts: Record<Letter, number>;   // remaining multiset
  history: GameHistoryItem[];
  status: 'playing' | 'cleared';
  startedAt: number | null;
  endedAt: number | null;
};
