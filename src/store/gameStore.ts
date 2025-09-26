
import { create } from 'zustand'
import type { DailyPuzzle, GameState } from '@/game/models'
import puzzles from '@/puzzles/puzzles.json'
import { counts } from '@/game/counts'
import { validateMove } from '@/game/validate'
import { applyMove, replayUsedIndices } from '@/game/apply'

export type Actions = {
  loadToday: (dateKey?: string) => void
  setCandidate: (s: string) => void
  pushLetter: (l: string) => void
  popLetter: () => void
  clearRow: () => void
  shuffleBag: () => void
  submit: () => void
  undo: () => void
  undoTo: (index: number) => void
}

export type UIState = {
  candidate: string
  error: string | null
}

export const useGameStore = create<GameState & Actions & UIState>((set, get) => ({
  puzzle: { date: '0000-00-00', wordOfDay: 'QUEUE', bagList: [] },
  currentStack: 'QUEUE',
  usedIndices: new Set<number>(),
  bagCounts: {},
  history: [],
  status: 'playing',
  startedAt: null,
  endedAt: null,

  candidate: '',
  error: null,

  loadToday: (dateKey) => {
    const key = dateKey || new Date().toISOString().slice(0,10)
    const p = (puzzles as Record<string, Omit<DailyPuzzle, 'date'>>)[key] || (puzzles as any)[Object.keys(puzzles)[0]]
    const puzzle: DailyPuzzle = { date: key, wordOfDay: p.wordOfDay, bagList: p.bagList }
    const bagCounts = counts(p.bagList.join(''))
    set({
      puzzle,
      currentStack: puzzle.wordOfDay.toUpperCase(),
      usedIndices: new Set<number>(),
      bagCounts,
      history: [],
      status: 'playing',
      startedAt: null,
      endedAt: null,
      candidate: '',
      error: null,
    })
  },

  setCandidate: (s) => set({ candidate: s.toUpperCase().slice(0,5) }),

  pushLetter: (l) => set((state) => {
    if (state.candidate.length >= 5) return state
    return { candidate: (state.candidate + l.toUpperCase()).slice(0,5) }
  }),

  popLetter: () => set((s) => ({ candidate: s.candidate.slice(0, -1) })),

  clearRow: () => set({ candidate: '' }),

  shuffleBag: () => set((s) => {
    // Pair each tile with its used flag
    const paired = s.puzzle.bagList.map((ch, i) => ({ ch, used: s.usedIndices.has(i) }))
    // Fisher–Yates shuffle of ALL tiles (muted included)
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[paired[i], paired[j]] = [paired[j], paired[i]]
    }
    // Rebuild bag list and usedIndices by new positions
    const newBagList = paired.map(p => p.ch)
    const newUsed = new Set<number>()
    paired.forEach((p, i) => { if (p.used) newUsed.add(i) })
    return { puzzle: { ...s.puzzle, bagList: newBagList }, usedIndices: newUsed }
  }),

  submit: () => {
    const s = get()
    const cand = s.candidate.toUpperCase()
    const v = validateMove(s, cand)
    if (!('ok' in v) || !v.ok) { set({ error: v.reason }); setTimeout(() => set({ error: null }), 1600); return }
    const ns = applyMove(s, cand, v.need, v.overlap)
    set({ ...ns, candidate: '' })
  },

  undo: () => set((state) => {
    if (state.history.length === 0) return state
    const keep = state.history.length - 1
    const hist = state.history.slice(0, keep)
    const bagCounts = counts(state.puzzle.bagList.join(''))
    for (const h of hist) for (const [l, n] of Object.entries(h.spent)) bagCounts[l] = (bagCounts[l] || 0) - n
    const usedIndices = replayUsedIndices(state.puzzle.bagList, hist)
    const currentStack = hist.length ? hist[hist.length-1].word : state.puzzle.wordOfDay
    return { history: hist, bagCounts, usedIndices, currentStack, status: 'playing', endedAt: null, candidate: '' }
  }),

  undoTo: (index) => set((state) => {
    const keep = Math.max(0, Math.min(index, state.history.length))
    const hist = state.history.slice(0, keep)
    const bagCounts = counts(state.puzzle.bagList.join(''))
    for (const h of hist) for (const [l, n] of Object.entries(h.spent)) bagCounts[l] = (bagCounts[l] || 0) - n
    const usedIndices = replayUsedIndices(state.puzzle.bagList, hist)
    const currentStack = hist.length ? hist[hist.length-1].word : state.puzzle.wordOfDay
    return { history: hist, bagCounts, usedIndices, currentStack, status: 'playing', endedAt: null, candidate: '' }
  }),
}))
