import { create } from 'zustand'

type UIScreen = 'landing' | 'game' | 'view'

type UIState = {
  screen: UIScreen
  go: (s: UIScreen) => void
}

export const useUIStore = create<UIState>((set) => ({
  screen: 'landing',
  go: (s) => set({ screen: s }),
}))
