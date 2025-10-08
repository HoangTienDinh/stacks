// Lightweight, versioned session snapshot for resuming in-progress games.
const SKEY = 'stacks.v1.session';

export type SlotMetaSnap = {
  source: 'bag' | 'stack' | 'error' | null;
  bagIndex?: number;
  stackPos?: number;
};

export type TimerSnap = {
  running: boolean;
  startedAt: number | null;
  pausedAt: number | null;
  accumSec: number;
};

export type SessionSnapshotV1 = {
  version: 1;
  dateKey: string;                 // puzzle key "YYYY-MM-DD"
  puzzle: { wordOfDay: string; bagList: string[] };

  // Progress
  history: any[];                  // your existing history items (kept as-is)
  usedIndices: number[];           // Set<number> → array for storage
  bagCounts: Record<string, number>;
  currentStack: string;

  // Typing row state (so the row resumes nicely)
  candidate: string;
  slotMeta: SlotMetaSnap[];
  previewReserved: number[];

  // UI / stats helpers
  undoCount: number;
  timer: TimerSnap;
};

export function saveSession(s: SessionSnapshotV1) {
  try { localStorage.setItem(SKEY, JSON.stringify(s)); } catch {}
}

export function loadSession(): SessionSnapshotV1 | null {
  try {
    const raw = localStorage.getItem(SKEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && obj.version === 1) return obj as SessionSnapshotV1;
    return null;
  } catch { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(SKEY); } catch {}
}
