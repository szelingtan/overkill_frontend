import { motion } from 'framer-motion'
import { PixelCard, PixelText } from '../common'
import type { BattleTurn } from '../../store/types'

interface BattleLogProps {
  turns: BattleTurn[]
}

export const BattleLog = ({ turns }: BattleLogProps) => {
  if (turns.length === 0) return null

  return (
    <PixelCard className="max-h-48 overflow-y-auto">
      <PixelText variant="h3" className="text-pixel-pink mb-3">
        Battle Log
      </PixelText>
      <div className="space-y-2">
        {turns.map((turn) => (
          <motion.div
            key={turn.turnNumber}
            className="text-xs-pixel text-pixel-gray border-l-2 border-pixel-light-purple pl-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-pixel-cream">Turn {turn.turnNumber}:</span>{' '}
            {turn.loser} took {Math.floor(turn.damage)} damage!
          </motion.div>
        ))}
      </div>
    </PixelCard>
  )
}
