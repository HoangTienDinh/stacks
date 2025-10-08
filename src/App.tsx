import { useUIStore } from '@/store/uiStore'
import { GameScreen } from '@/screens/GameScreen'
import LandingScreen from '@/screens/LandingScreen'

export default function App() {
  const view = useUIStore(s => s.view)

  return (
    <div className="min-h-dvh w-full bg-white text-gray-900">
      {view === 'landing' ? <LandingScreen /> : <GameScreen />}
    </div>
  )
}
