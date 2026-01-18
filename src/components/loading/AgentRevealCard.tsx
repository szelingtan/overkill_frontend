import { motion } from 'framer-motion'
import type { ChoiceAgent } from '../../store/types'
import { PixelText, HPBar } from '../common'

interface AgentRevealCardProps {
  agent: ChoiceAgent
  index: number
  isRevealed: boolean
}

export const AgentRevealCard = ({ agent, index, isRevealed }: AgentRevealCardProps) => {
  return (
    <motion.div
      className="relative w-full h-64 perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.3, duration: 0.5 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={{ rotateY: 180 }}
        animate={{ rotateY: isRevealed ? 0 : 180 }}
        transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back of card (hidden initially) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-pixel-purple to-pixel-dark border-4 border-pixel-light-purple rounded-lg flex items-center justify-center backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <PixelText variant="h2" className="text-pixel-light-purple">?</PixelText>
        </div>

        {/* Front of card (agent details) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-pixel-dark/90 to-pixel-purple/90 border-4 border-pixel-light-purple rounded-lg p-4 backface-hidden overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col h-full">
            {/* Header with emoji and name */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {agent.avatarEmoji || '🎭'}
              </motion.div>
              <div className="flex-1 min-w-0">
                <PixelText variant="h3" className="text-pixel-cream truncate">
                  {agent.name}
                </PixelText>
                <PixelText variant="small" className="text-pixel-blue">
                  {agent.choice?.description || 'Ready to battle!'}
                </PixelText>
              </div>
            </div>

            {/* Stats */}
            {agent.stats && (
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-pixel-pink">ATK</span>
                  <span className="text-pixel-cream">{agent.stats.attack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pixel-blue">DEF</span>
                  <span className="text-pixel-cream">{agent.stats.defense}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pixel-green">SPD</span>
                  <span className="text-pixel-cream">{agent.stats.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pixel-hot-pink">CHA</span>
                  <span className="text-pixel-cream">{agent.stats.charisma}</span>
                </div>
              </div>
            )}

            {/* HP Bar */}
            <div className="mb-2">
              <HPBar
                current={agent.currentGlobalHp}
                max={agent.maxGlobalHp}
                label="HP"
                size="sm"
              />
            </div>

            {/* Personality (typewriter effect) */}
            {isRevealed && agent.personality && (
              <motion.div
                className="flex-1 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.3 + 1.3 }}
              >
                <PixelText variant="small" className="text-pixel-light-purple italic line-clamp-2">
                  "{agent.personality}"
                </PixelText>
              </motion.div>
            )}

            {/* Catchphrase */}
            {isRevealed && agent.catchphrase && (
              <motion.div
                className="mt-auto pt-2 border-t border-pixel-purple/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.3 + 1.6 }}
              >
                <PixelText variant="small" className="text-pixel-hot-pink">
                  "{agent.catchphrase}"
                </PixelText>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
