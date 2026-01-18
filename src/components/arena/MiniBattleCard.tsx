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
    <motion.div
      className={`
        relative bg-gradient-to-br from-pixel-dark/90 to-pixel-purple/90
        border-4 rounded-lg p-4 cursor-pointer
        transition-all duration-200 hover:scale-105
        ${isActive ? 'border-pixel-hot-pink shadow-lg shadow-pixel-hot-pink/30' : 'border-pixel-light-purple'}
        ${isComplete ? 'opacity-75' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Battle Status Badge */}
      <div className="absolute -top-2 -right-2">
        {status === 'in_progress' && (
          <motion.div
            className="bg-pixel-green text-pixel-dark px-2 py-0.5 rounded text-xs font-pixel"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LIVE
          </motion.div>
        )}
        {isComplete && (
          <div className="bg-pixel-gray text-pixel-dark px-2 py-0.5 rounded text-xs font-pixel">
            DONE
          </div>
        )}
      </div>

      {/* Turn Counter */}
      <div className="text-center mb-2">
        <PixelText variant="small" className="text-pixel-pink">
          Turn {turns.length}/3
        </PixelText>
      </div>

      {/* Agents Face-off */}
      <div className="flex items-center justify-between gap-2">
        {/* Agent 1 */}
        <div className={`flex-1 text-center ${agent1Won ? 'ring-2 ring-pixel-green rounded p-1' : ''}`}>
          <motion.div
            className="text-3xl mb-1"
            animate={status === 'in_progress' ? { rotate: [-5, 5, -5] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {agent1.avatarEmoji || '🎭'}
          </motion.div>
          <PixelText variant="small" className="text-pixel-cream truncate block">
            {agent1.name}
          </PixelText>
          <div className="mt-1">
            <HPBar
              current={agent1.currentBattleHp}
              max={agent1.maxBattleHp}
              size="sm"
              showNumbers={false}
            />
          </div>
        </div>

        {/* VS */}
        <div className="px-2">
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
        <div className={`flex-1 text-center ${agent2Won ? 'ring-2 ring-pixel-green rounded p-1' : ''}`}>
          <motion.div
            className="text-3xl mb-1"
            animate={status === 'in_progress' ? { rotate: [5, -5, 5] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {agent2.avatarEmoji || '🎭'}
          </motion.div>
          <PixelText variant="small" className="text-pixel-cream truncate block">
            {agent2.name}
          </PixelText>
          <div className="mt-1">
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
      {currentTurn && (
        <motion.div
          className="mt-3 p-2 bg-pixel-darker/50 rounded text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {currentTurn.damage > 0 && (
            <PixelText variant="small" className="text-pixel-pink">
              {currentTurn.loserName} takes {Math.floor(currentTurn.damage)} DMG!
            </PixelText>
          )}
        </motion.div>
      )}

      {/* Click hint */}
      <div className="mt-2 text-center opacity-50">
        <PixelText variant="small" className="text-pixel-gray">
          Click to watch
        </PixelText>
      </div>
    </motion.div>
  )
}
