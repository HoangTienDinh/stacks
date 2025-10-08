// v1 local-storage stats util (no external deps)
export type LetterSource = 'stack' | 'bag';

export type RowRecord = {
  word: string;
  sources: LetterSource[]; // length 5
};

export type GameRecordV1 = {
  dateKey: string;          // "YYYY-MM-DD"
  finishedAt: number;       // epoch ms
  durationSec: number;      // active seconds
  stacksCleared: number;    // 3..10 (12 at extreme, but we bucket to 8 by default)
  undos: number;
  rows: RowRecord[];
};

const GKEY = 'stacks.v1.games';

export function loadGames(): GameRecordV1[] {
  try { return JSON.parse(localStorage.getItem(GKEY) || '[]'); }
  catch { return []; }
}

export function saveGame(rec: GameRecordV1) {
  const all = loadGames();
  // Guard: if a record for this date already exists, keep the first (no replay)
  if (all.some(r => r.dateKey === rec.dateKey)) return;
  localStorage.setItem(GKEY, JSON.stringify([...all, rec]));
}

export function formatClock(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function computeStats(games: GameRecordV1[]) {
  // We count one record per date (you said: no replay once finished)
  const dates = new Set(games.map(g => g.dateKey));

  const gamesPlayed = games.length;
  const avgStacks = gamesPlayed
    ? +(games.reduce((a,g)=>a+g.stacksCleared,0)/gamesPlayed).toFixed(2)
    : 0;

  // Streak (by puzzle date, midnight PST handled by your daily key)
  const ordered = [...dates].sort();
  let cur = 0, max = 0;
  for (let i=0; i<ordered.length; i++) {
    if (i === 0) { cur = 1; max = 1; continue; }
    const prev = new Date(ordered[i-1]);
    const now  = new Date(ordered[i]);
    const diffDays = Math.round((+now - +prev) / 86400000);
    cur = (diffDays === 1) ? cur + 1 : 1;
    if (cur > max) max = cur;
  }

  // Histogram buckets 3..8 by default
  const hist: Record<number, number> = {3:0,4:0,5:0,6:0,7:0,8:0};
  for (const g of games) {
    const k = Math.min(Math.max(g.stacksCleared,3), 8);
    hist[k] = (hist[k] || 0) + 1;
  }

  return { gamesPlayed, avgStacks, currentStreak: cur, maxStreak: max, hist };
}

export function makeShare(rec: GameRecordV1) {
  const header = `I finished ${rec.stacksCleared} Stacks in ${formatClock(rec.durationSec)}`;
  const body = rec.rows.map(r =>
    r.sources.map(s => (s === 'stack' ? '🟦' : '🟩')).join('')
  ).join('\n');
  const footer = `Can you beat my score?\nhttps://github.com/HoangTienDinh/stacks`;
  return `${header}\n${body}\n${footer}`;
}

// --- helpers for Landing / View Puzzle ---
export function todayKey(): string {
  // Must match gameStore's loadToday default
  return new Date().toISOString().slice(0,10);
}

export function getRecordByDate(dateKey: string): GameRecordV1 | null {
  const all = loadGames();
  return all.find(g => g.dateKey === dateKey) || null;
}

export function hasRecord(dateKey: string): boolean {
  return !!getRecordByDate(dateKey);
}
