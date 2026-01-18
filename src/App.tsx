import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import { useWebSocket } from './hooks/useWebSocket'
import { GameSetup } from './components/setup/GameSetup'
import { AgentLoadingScreen } from './components/loading/AgentLoadingScreen'
import { BattleArena } from './components/arena/BattleArena'
import { BattleScreen } from './components/battle/BattleScreen'
import { VictoryScreen } from './components/results/VictoryScreen'
import { StarField } from './components/common/StarField'

function App() {
  const { sessionId, currentScreen } = useGameStore()

  // Use sessionStorage as fallback for route guards (avoids Zustand race conditions)
  const hasValidSession = sessionId || sessionStorage.getItem('gameSessionId')

  // Initialize WebSocket connection when sessionId is available
  useWebSocket(sessionId)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#3d2b54] crt-effect">
        <StarField />
        <Routes>
          <Route path="/" element={<GameSetup />} />
          <Route
            path="/loading"
            element={
              hasValidSession && currentScreen === 'loading' ? (
                <AgentLoadingScreen />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/arena"
            element={
              hasValidSession ? (
                <BattleArena />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/battle"
            element={
              hasValidSession && currentScreen === 'battle' ? (
                <BattleScreen />
              ) : (
                <Navigate to="/arena" replace />
              )
            }
          />
          <Route
            path="/victory"
            element={
              hasValidSession && currentScreen === 'victory' ? (
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
