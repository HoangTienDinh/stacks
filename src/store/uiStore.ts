import { create } from 'zustand'

type View = 'landing' | 'game'

type UIState = {
  view: View
  go: (v: View) => void
}

export const useUIStore = create<UIState>((set) => ({
  view: 'landing',              // ← default to Landing
  go: (v) => set({ view: v }),
}))
