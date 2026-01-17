import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/gameStore'
import { PixelText, PixelButton, PixelCard } from '../common'
import { RankingList } from './RankingList'
import { HighlightReel } from './HighlightReel'

export const VictoryScreen = () => {
  const navigate = useNavigate()
  const { winner, rankings, battleHistory, reset } = useGameStore()

  const handleNewGame = () => {
    reset()
    navigate('/')
  }

  if (!winner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelText variant="h2" className="text-pixel-red">
          No winner yet!
        </PixelText>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        className="max-w-5xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Victory Banner */}
        <motion.div
          className="text-center space-y-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <PixelText variant="h1" shadow className="text-pixel-yellow">
            VICTORY!
          </PixelText>

          <PixelCard className="border-pixel-yellow bg-pixel-yellow/20 inline-block">
            <div className="space-y-3">
              <div className="flex items-center gap-4 justify-center">
                <motion.div
                  className="w-16 h-16 border-4 border-black"
                  style={{ backgroundColor: winner.color }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="text-left">
                  <PixelText variant="h2" className="text-pixel-yellow">
                    {winner.name}
                  </PixelText>
                  <PixelText variant="body" className="text-pixel-white">
                    The Ultimate Choice!
                  </PixelText>
                </div>
              </div>

              <div className="text-sm-pixel text-pixel-white max-w-lg">
                {winner.description}
              </div>
            </div>
          </PixelCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PixelCard>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <PixelText variant="body" className="text-pixel-gray mb-1">
                  Total Battles
                </PixelText>
                <PixelText variant="h2" className="text-pixel-yellow">
                  {battleHistory.length}
                </PixelText>
              </div>
              <div>
                <PixelText variant="body" className="text-pixel-gray mb-1">
                  Contestants
                </PixelText>
                <PixelText variant="h2" className="text-pixel-yellow">
                  {rankings.length}
                </PixelText>
              </div>
              <div>
                <PixelText variant="body" className="text-pixel-gray mb-1">
                  Final HP
                </PixelText>
                <PixelText variant="h2" className="text-pixel-green">
                  {Math.floor(winner.globalHp)}
                </PixelText>
              </div>
            </div>
          </PixelCard>
        </motion.div>

        {/* Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <PixelText variant="h2" className="text-pixel-yellow mb-4 text-center">
            FINAL RANKINGS
          </PixelText>
          <RankingList rankings={rankings} />
        </motion.div>

        {/* Highlight Reel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <HighlightReel battles={battleHistory} />
        </motion.div>

        {/* New Game Button */}
        <motion.div
          className="flex justify-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <PixelButton onClick={handleNewGame} size="lg" variant="primary">
            NEW GAME
          </PixelButton>
        </motion.div>
      </motion.div>
    </div>
  )
}
