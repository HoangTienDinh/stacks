import { create } from 'zustand'
import type { DailyPuzzle, GameState } from '@/game/models'
import puzzles from '@/puzzles/puzzles.json'
import { counts } from '@/game/counts'
import { validateMove } from '@/game/validate'
import { applyMove, replayUsedIndices } from '@/game/apply'
import { signalError } from '@/utils/sound'
import { BAG_SIZE } from '@/game/constants'

type SlotMeta = { source: 'bag' | 'stack' | 'error' | null; bagIndex?: number; stackPos?: number }
type Flight = { id: string; letter: string; from: { type: 'bag'; index: number } | { type: 'stack'; pos: number }; to: { slot: number } }

export type Actions = {
  loadToday: (dateKey?: string) => void
  setCandidate: (s: string) => void
  pushLetter: (l: string) => void
  typeLetter: (l: string) => void
  popLetter: () => void
  clearRow: () => void
  shuffleBag: () => void
  submit: () => void
  undo: () => void
  undoTo: (index: number) => void
  consumeFlight: (id: string) => void
  setKeyboardOpen: (open: boolean) => void
  toggleKeyboard: () => void
  pickStackPos: (pos: number) => void
}

export type UIState = {
  candidate: string
  error: string | null
  slotMeta: SlotMeta[]
  previewReserved: Set<number> // bag indices reserved during typing
  reduceMotion: boolean
  flights: Flight[]
  keyboardOpen: boolean
}

const firstEmpty = (s: string) => s.padEnd(5, ' ').slice(0,5).indexOf(' ')
const lastFilled = (s: string) => s.trimEnd().length - 1

// --- NEW: keep bag at 12 tiles safely (legacy puzzles may have 15) ---
function normalizeBag12(list: string[]): string[] {
  if (!Array.isArray(list)) return []
  if (list.length === BAG_SIZE) return list
  if (list.length > BAG_SIZE) {
    console.warn(`[Stacks] bag has ${list.length} tiles; slicing to ${BAG_SIZE}.`)
    return list.slice(0, BAG_SIZE)
  }
  console.warn(`[Stacks] bag has ${list.length} tiles; expected ${BAG_SIZE}. Using as-is.`)
  return list
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
  keyboardOpen: false,

  candidate: '',
  error: null,
  slotMeta: Array.from({ length: 5 }, () => ({ source: null })),
  previewReserved: new Set<number>(),
  reduceMotion: typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false : false,
  flights: [],

  loadToday: (dateKey) => {
    const key = dateKey || new Date().toISOString().slice(0,10)
    const p = (puzzles as Record<string, Omit<DailyPuzzle, 'date'>>)[key] || (puzzles as any)[Object.keys(puzzles)[0]]
    const normalizedBag = normalizeBag12(p.bagList)
    const puzzle: DailyPuzzle = { date: key, wordOfDay: p.wordOfDay, bagList: normalizedBag }
    const bagCounts = counts(normalizedBag.join(''))
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
      slotMeta: Array.from({ length: 5 }, () => ({ source: null })),
      previewReserved: new Set<number>(),
      flights: [],
    })
  },

  setCandidate: (s) => set({ candidate: s.toUpperCase().slice(0,5) }),

  pushLetter: (l) => {
    const S = get()
    const arr = S.candidate.padEnd(5, ' ').slice(0,5).split('')
    const idx = firstEmpty(S.candidate)
    if (idx === -1) return

    const letter = l.toUpperCase()

    if (S.currentStack[idx] === letter) {
      const meta = [...S.slotMeta]
      meta[idx] = { source: 'stack', stackPos: idx }
      const candidate = putAt(arr, idx, letter).join('')
      const flight: Flight = { id: cryptoId(), letter, from: { type: 'stack', pos: idx }, to: { slot: idx } }
      set({ candidate, slotMeta: meta, flights: [...S.flights, flight] })
      import('@/utils/sound').then(m => m.signalSnap?.())
      return
    }

    const bagIdx = findBagIndexForLetter(S, letter)
    if (bagIdx === -1) {
      set({ error: `No ${letter} left in bag` })
      signalError()
      setTimeout(() => set({ error: null }), 1200)
      return
    }
    const preview = new Set(S.previewReserved); preview.add(bagIdx)
    const meta = [...S.slotMeta]; meta[idx] = { source: 'bag', bagIndex: bagIdx }
    const candidate = putAt(arr, idx, letter).join('')
    const flight: Flight = { id: cryptoId(), letter, from: { type: 'bag', index: bagIdx }, to: { slot: idx } }
    set({ candidate, slotMeta: meta, previewReserved: preview, flights: [...S.flights, flight] })
    import('@/utils/sound').then(m => m.signalBag?.())
  },

  // Keyboard with positional preference
  typeLetter: (l) => {
    const S = get()
    const letter = l.toUpperCase()
    if (!/^[A-Z]$/.test(letter)) return
    const arr = S.candidate.padEnd(5, ' ').slice(0,5).split('')
    const idx = firstEmpty(S.candidate)
    if (idx === -1) return

    const meta = [...S.slotMeta]
    const preview = new Set(S.previewReserved)

    // 1) positional overlap from current stack
    if (S.currentStack[idx] === letter) {
      meta[idx] = { source: 'stack', stackPos: idx }
      const candidate = putAt(arr, idx, letter).join('')
      const flight: Flight = { id: cryptoId(), letter, from: { type: 'stack', pos: idx }, to: { slot: idx } }
      set({ candidate, slotMeta: meta, flights: [...S.flights, flight] })
      return
    }

    // 2) try bag
    const bagIdx = findBagIndexForLetter(S, letter)
    if (bagIdx !== -1) {
      preview.add(bagIdx)
      meta[idx] = { source: 'bag', bagIndex: bagIdx }
      const candidate = putAt(arr, idx, letter).join('')
      const flight: Flight = { id: cryptoId(), letter, from: { type: 'bag', index: bagIdx }, to: { slot: idx } }
      set({ candidate, slotMeta: meta, previewReserved: preview, flights: [...S.flights, flight] })
      return
    }

    // 3) error state (fill + shake + haptic/tone)
    meta[idx] = { source: 'error' }
    const candidate = putAt(arr, idx, letter).join('')
    signalError()
    set({ candidate, slotMeta: meta })
  },

  popLetter: () => {
    const S = get()
    if (!S.candidate) return
    const arr = S.candidate.padEnd(5,' ').slice(0,5).split('')
    const last = lastFilled(S.candidate)
    if (last < 0) return
    const meta = [...S.slotMeta]
    const m = meta[last]
    if (m?.source === 'bag' && m.bagIndex != null) {
      const preview = new Set(S.previewReserved); preview.delete(m.bagIndex)
      set({ previewReserved: preview })
    }
    meta[last] = { source: null }
    arr[last] = ' '
    set({ candidate: arr.join(''), slotMeta: meta })
  },

  clearRow: () => set(() => ({
    candidate: '',
    slotMeta: Array.from({ length: 5 }, () => ({ source: null })),
    previewReserved: new Set<number>(),
  })),

  shuffleBag: () => set((s) => {
    // shuffle letters and keep used + preview flags attached
    const paired = s.puzzle.bagList.map((ch, i) => ({ ch, used: s.usedIndices.has(i), preview: s.previewReserved.has(i) }))
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[paired[i], paired[j]] = [paired[j], paired[i]]
    }
    const newBagList = paired.map(p => p.ch)
    const newUsed = new Set<number>(); const newPreview = new Set<number>()
    paired.forEach((p, i) => { if (p.used) newUsed.add(i); if (p.preview) newPreview.add(i) })
    return { puzzle: { ...s.puzzle, bagList: newBagList }, usedIndices: newUsed, previewReserved: newPreview }
  }),

  submit: () => {
    const s = get()
    // must be 5 letters and no error slots
    if (s.candidate.length < 5 || s.slotMeta.some(m => m.source === 'error' || m.source === null)) {
      set({ error: 'Invalid letters in row' })
      signalError()
      setTimeout(() => set({ error: null }), 1200)
      return
    }
    const v = validateMove(s, s.candidate.toUpperCase())
    if (!('ok' in v) || !v.ok) {
      set({ error: v.reason })
      signalError()
      setTimeout(() => set({ error: null }), 1600)
      return
    }
    const ns = applyMove(s, s.candidate.toUpperCase(), v.need, v.overlap)
    set({
      ...ns,
      candidate: '',
      slotMeta: Array.from({ length: 5 }, () => ({ source: null })),
      previewReserved: new Set<number>(),
    })
  },

  undo: () => set((state) => {
    if (state.history.length === 0) return state
    const keep = state.history.length - 1
    const hist = state.history.slice(0, keep)
    const bagCounts = counts(state.puzzle.bagList.join(''))
    for (const h of hist) for (const [l, n] of Object.entries(h.spent)) bagCounts[l] = (bagCounts[l] || 0) - n
    const usedIndices = replayUsedIndices(state.puzzle.bagList, hist)
    const currentStack = hist.length ? hist[hist.length-1].word : state.puzzle.wordOfDay
    return {
      history: hist,
      bagCounts,
      usedIndices,
      currentStack,
      status: 'playing',
      endedAt: null,
      candidate: '',
      slotMeta: Array.from({ length: 5 }, () => ({ source: null })),
      previewReserved: new Set<number>(),
    }
  }),

  undoTo: (index) => set((state) => {
    const keep = Math.max(0, Math.min(index, state.history.length))
    const hist = state.history.slice(0, keep)
    const bagCounts = counts(state.puzzle.bagList.join(''))
    for (const h of hist) for (const [l, n] of Object.entries(h.spent)) bagCounts[l] = (bagCounts[l] || 0) - n
    const usedIndices = replayUsedIndices(state.puzzle.bagList, hist)
    const currentStack = hist.length ? hist[hist.length-1].word : state.puzzle.wordOfDay
    return {
      history: hist,
      bagCounts,
      usedIndices,
      currentStack,
      status: 'playing',
      endedAt: null,
      candidate: '',
      slotMeta: Array.from({ length: 5 }, () => ({ source: null })),
      previewReserved: new Set<number>(),
    }
  }),

  consumeFlight: (id) => set((s) => ({ flights: s.flights.filter(f => f.id !== id) })),

  setKeyboardOpen: (open) => set({ keyboardOpen: open }),
  toggleKeyboard: () => set((s) => ({ keyboardOpen: !s.keyboardOpen })),

  // Tap a letter from the current stack at position `pos`
  pickStackPos: (pos) => {
    const S = get()
    const idx = S.candidate.padEnd(5, ' ').slice(0,5).indexOf(' ')
    if (idx === -1) return // row full
    // Must be positional: only allowed if next empty slot equals pos
    if (idx !== pos) {
      set({ error: 'Use the letter in the matching slot' })
      import('@/utils/sound').then(m => m.signalError?.())
      setTimeout(() => set({ error: null }), 900)
      return
    }
    const letter = S.currentStack[pos]
    const arr = S.candidate.padEnd(5, ' ').slice(0,5).split('')
    const meta = [...S.slotMeta]
    meta[idx] = { source: 'stack', stackPos: pos }
    const candidate = (() => { arr[idx] = letter; return arr.join('') })()
    const flight = { id: Math.random().toString(36).slice(2,10), letter, from: { type: 'stack' as const, pos }, to: { slot: idx } }
    set({ candidate, slotMeta: meta, flights: [...S.flights, flight] })
  },

}))

function putAt(arr: string[], idx: number, ch: string) { const a = [...arr]; a[idx] = ch; return a }
function cryptoId() { return Math.random().toString(36).slice(2, 10) }
function findBagIndexForLetter(S: ReturnType<typeof useGameStore.getState>, letter: string) {
  const L = letter.toUpperCase()
  for (let i = 0; i < S.puzzle.bagList.length; i++) {
    if (S.puzzle.bagList[i] !== L) continue
    if (S.usedIndices.has(i)) continue
    if (S.previewReserved.has(i)) continue
    return i
  }
  return -1
}
