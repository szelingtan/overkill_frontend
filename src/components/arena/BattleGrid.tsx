import { motion } from 'framer-motion'
import type { Battle, ChoiceAgent } from '../../store/types'
import { PixelText } from '../common'
import { MiniBattleCard } from './MiniBattleCard'

interface BattleGridProps {
  battles: Battle[]
  byeAgent?: ChoiceAgent | null
  onSelectBattle: (battleId: string) => void
  focusedBattleId?: string | null
}

export const BattleGrid = ({ battles, byeAgent, onSelectBattle, focusedBattleId }: BattleGridProps) => {
  // Calculate grid columns based on number of battles
  const getGridCols = () => {
    if (battles.length <= 1) return 'grid-cols-1 max-w-md'
    if (battles.length === 2) return 'grid-cols-2 max-w-2xl'
    if (battles.length <= 4) return 'grid-cols-2 max-w-3xl'
    return 'grid-cols-3 max-w-5xl'
  }

  if (battles.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PixelText variant="h2" className="text-pixel-pink">
            Preparing Battles...
          </PixelText>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Battle Grid */}
      <motion.div
        className={`grid gap-4 mx-auto ${getGridCols()}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {battles.map((battle, index) => (
          <motion.div
            key={battle.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <MiniBattleCard
              battle={battle}
              onClick={() => onSelectBattle(battle.id)}
              isActive={focusedBattleId === battle.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bye Agent Display */}
      {byeAgent && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-block bg-pixel-dark/80 border-2 border-pixel-gray rounded-lg px-6 py-3">
            <PixelText variant="small" className="text-pixel-gray mb-2">
              Sitting out this round:
            </PixelText>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{byeAgent.avatarEmoji || '🎭'}</span>
              <PixelText variant="body" className="text-pixel-cream">
                {byeAgent.name}
              </PixelText>
              <span className="text-pixel-green text-sm">(BYE)</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
