import { motion } from 'framer-motion'
import type { Battle } from '../../store/types'
import { PixelText, HPBar } from '../common'

interface MiniBattleCardProps {
  battle: Battle
  onClick: () => void
  isActive?: boolean
}

export const MiniBattleCard = ({ battle, onClick, isActive }: MiniBattleCardProps) => {
  const { agent1, agent2, turns, status } = battle
  const currentTurn = turns[turns.length - 1]
  const isComplete = status === 'ended'

  // Determine winner highlight
  const winnerId = battle.winner
  const agent1Won = winnerId === agent1.id
  const agent2Won = winnerId === agent2.id

  return (
    <div className="relative pt-2 pr-2">
      {/* Battle Status Badge - outside overflow container */}
      <div className="absolute top-0 right-0 z-10">
        {status === 'in_progress' && (
          <motion.div
            className="bg-pixel-green text-pixel-dark px-2 py-0.5 rounded text-xs font-pixel shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LIVE
          </motion.div>
        )}
        {isComplete && (
          <div className="bg-pixel-gray text-pixel-dark px-2 py-0.5 rounded text-xs font-pixel shadow-lg">
            DONE
          </div>
        )}
      </div>

      <motion.div
        className={`
          bg-gradient-to-br from-pixel-dark/90 to-pixel-purple/90
          border-4 rounded-lg p-3 cursor-pointer overflow-hidden
          transition-all duration-200 hover:scale-105
          ${isActive ? 'border-pixel-hot-pink shadow-lg shadow-pixel-hot-pink/30' : 'border-pixel-light-purple'}
          ${isComplete ? 'opacity-75' : ''}
        `}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Turn Counter */}
        <div className="text-center mb-2">
          <PixelText variant="small" className="text-pixel-pink">
            Turn {turns.length}
          </PixelText>
        </div>

        {/* Agents Face-off */}
        <div className="flex items-center justify-between gap-1">
          {/* Agent 1 */}
          <div className={`flex-1 min-w-0 text-center ${agent1Won ? 'ring-2 ring-pixel-green rounded p-1' : ''}`}>
            <motion.div
              className="text-2xl mb-1"
              animate={status === 'in_progress' ? { rotate: [-5, 5, -5] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {agent1.avatarEmoji || '🎭'}
            </motion.div>
            <PixelText variant="small" className="text-pixel-cream truncate block max-w-full">
              {agent1.name}
            </PixelText>
            <div className="mt-1 overflow-hidden">
              <HPBar
                current={agent1.currentBattleHp}
                max={agent1.maxBattleHp}
                size="sm"
                showNumbers={false}
              />
            </div>
          </div>

          {/* VS */}
          <div className="px-1 flex-shrink-0">
            <motion.div
              animate={status === 'in_progress' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <PixelText variant="small" className="text-pixel-hot-pink">
                VS
              </PixelText>
            </motion.div>
          </div>

          {/* Agent 2 */}
          <div className={`flex-1 min-w-0 text-center ${agent2Won ? 'ring-2 ring-pixel-green rounded p-1' : ''}`}>
            <motion.div
              className="text-2xl mb-1"
              animate={status === 'in_progress' ? { rotate: [5, -5, 5] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {agent2.avatarEmoji || '🎭'}
            </motion.div>
            <PixelText variant="small" className="text-pixel-cream truncate block max-w-full">
              {agent2.name}
            </PixelText>
            <div className="mt-1 overflow-hidden">
              <HPBar
                current={agent2.currentBattleHp}
                max={agent2.maxBattleHp}
                size="sm"
                showNumbers={false}
              />
            </div>
          </div>
        </div>

        {/* Latest Action Preview */}
        {currentTurn && currentTurn.damage > 0 && (
          <motion.div
            className="mt-2 p-1.5 bg-pixel-darker/50 rounded text-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PixelText variant="small" className="text-pixel-pink truncate block">
              {currentTurn.loserName} takes {Math.floor(currentTurn.damage)} DMG!
            </PixelText>
          </motion.div>
        )}

        {/* Click hint */}
        <div className="mt-2 text-center opacity-50">
          <PixelText variant="small" className="text-pixel-gray">
            Click to watch
          </PixelText>
        </div>
      </motion.div>
    </div>
  )
}
