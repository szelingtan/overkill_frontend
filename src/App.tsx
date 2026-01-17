import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import { useWebSocket } from './hooks/useWebSocket'
import { GameSetup } from './components/setup/GameSetup'
import { BattleArena } from './components/arena/BattleArena'
import { BattleScreen } from './components/battle/BattleScreen'
import { VictoryScreen } from './components/results/VictoryScreen'

function App() {
  const { sessionId, currentScreen } = useGameStore()

  // Initialize WebSocket connection when sessionId is available
  useWebSocket(sessionId)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pixel-darker crt-effect">
        <Routes>
          <Route path="/" element={<GameSetup />} />
          <Route
            path="/arena"
            element={
              sessionId && currentScreen === 'arena' ? (
                <BattleArena />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/battle"
            element={
              sessionId && currentScreen === 'battle' ? (
                <BattleScreen />
              ) : (
                <Navigate to="/arena" replace />
              )
            }
          />
          <Route
            path="/victory"
            element={
              sessionId && currentScreen === 'victory' ? (
                <VictoryScreen />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
