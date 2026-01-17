import { motion } from 'framer-motion'
import { PixelCard } from '../common'
import type { BattleArgument } from '../../store/types'

interface ArgumentDisplayProps {
  argument: BattleArgument
  side: 'left' | 'right'
}

export const ArgumentDisplay = ({ argument, side }: ArgumentDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <PixelCard className={side === 'left' ? 'bg-pixel-blue/20' : 'bg-pixel-red/20'}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 ${
                side === 'left' ? 'bg-pixel-blue' : 'bg-pixel-red'
              }`}
            />
            <span className="text-sm-pixel text-pixel-yellow">
              {argument.agentName}
            </span>
          </div>
          <p className="text-xs-pixel text-pixel-white leading-relaxed">
            {argument.argument}
          </p>
        </div>
      </PixelCard>
    </motion.div>
  )
}
