import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { ArenaGrid } from './ArenaGrid'
import { ArenaHUD } from './ArenaHUD'
import { PixelText, LoadingSpinner } from '../common'

export const BattleArena = () => {
  const navigate = useNavigate()
  const { agents, arenaSize, connected, currentScreen } = useGameStore()

  useEffect(() => {
    // Navigate to battle screen when battle starts
    if (currentScreen === 'battle') {
      navigate('/battle')
    }
  }, [currentScreen, navigate])

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="CONNECTING TO SERVER..." size="lg" />
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="SPAWNING GLADIATORS..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <PixelText variant="h1" shadow className="text-pixel-yellow mb-2">
            OVERKILL
          </PixelText>
          <PixelText variant="body" className="text-pixel-white">
            Let the battle begin!
          </PixelText>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Arena */}
          <div className="flex items-center justify-center">
            <ArenaGrid
              width={arenaSize.width}
              height={arenaSize.height}
              agents={agents}
              cellSize={35}
            />
          </div>

          {/* HUD */}
          <div>
            <ArenaHUD agents={agents} />
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <PixelText variant="small" className="text-pixel-gray">
            Watch as your choices battle it out in the arena!
            <br />
            When two agents collide, they'll enter combat!
          </PixelText>
        </motion.div>
      </motion.div>
    </div>
  )
}
