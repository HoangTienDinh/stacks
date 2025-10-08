// src/App.tsx
import { useUIStore } from '@/store/uiStore'
import { GameScreen } from '@/screens/GameScreen'
import LandingScreen from '@/screens/LandingScreen'
import ViewPuzzleScreen from '@/screens/ViewPuzzleScreen'

export default function App() {
  const screen = useUIStore(s => s.screen)

  return (
    <div className="min-h-dvh w-full bg-white text-gray-900">
      {screen === 'landing' && <LandingScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'view' && <ViewPuzzleScreen />}
    </div>
  )
}
