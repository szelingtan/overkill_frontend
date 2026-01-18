import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/gameStore'
import { PixelText, PixelButton, PixelCard } from '../common'
import { RankingList } from './RankingList'
import { HighlightReel } from './HighlightReel'
import { getChoiceName } from '@/util/flatten'

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
    <div className="min-h-screen p-8 py-16 relative overflow-hidden">
      {/* Confetti-like decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-pixel-pink/30 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-5xl mx-auto space-y-8 relative z-10"
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
          <motion.img
            src="/overkill_logo.png"
            alt="OVERKILL"
            className="w-32 h-32 mx-auto mb-4"
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(212, 181, 255, 0.6))',
                'drop-shadow(0 0 40px rgba(255, 179, 217, 0.8))',
                'drop-shadow(0 0 20px rgba(212, 181, 255, 0.6))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            animate={{
              textShadow: [
                '0 0 20px rgba(126, 179, 255, 0.8)',
                '0 0 40px rgba(255, 179, 217, 0.8)',
                '0 0 20px rgba(126, 179, 255, 0.8)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <PixelText variant="h1" shadow className="text-pixel-blue">
              VICTORY!
            </PixelText>
          </motion.div>

          <PixelCard className="border-pixel-pink bg-pixel-pink/20 inline-block">
            <div className="space-y-3">
              <div className="flex items-center gap-4 justify-center">
                <motion.div
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {winner.avatarEmoji || '🏆'}
                </motion.div>
                <div className="text-left">
                  <PixelText variant="h2" className="text-pixel-cream">
                    {getChoiceName(winner.name)}
                  </PixelText>
                  <PixelText variant="body" className="text-pixel-blue">
                    The Ultimate Choice!
                  </PixelText>
                </div>
              </div>

              {winner.catchphrase && (
                <div className="text-sm-pixel text-pixel-hot-pink max-w-lg italic">
                  "{winner.catchphrase}"
                </div>
              )}

              {winner.choice?.description && (
                <div className="text-sm-pixel text-pixel-cream max-w-lg">
                  {winner.choice.description}
                </div>
              )}
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
                <PixelText variant="h2" className="text-pixel-pink">
                  {battleHistory.length}
                </PixelText>
              </div>
              <div>
                <PixelText variant="body" className="text-pixel-gray mb-1">
                  Contestants
                </PixelText>
                <PixelText variant="h2" className="text-pixel-blue">
                  {rankings.length}
                </PixelText>
              </div>
              <div>
                <PixelText variant="body" className="text-pixel-gray mb-1">
                  Final HP
                </PixelText>
                <PixelText variant="h2" className="text-pixel-green">
                  {Math.floor(winner.currentGlobalHp)}
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
          <PixelText variant="h2" className="text-pixel-pink mb-4 text-center">
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
