import { motion } from 'framer-motion'
import { PixelCard } from '../common'
import type { BattleArgument } from '../../store/types'
import { getChoiceName } from '@/util/flatten'

interface ArgumentDisplayProps {
  argument: BattleArgument
  side: 'left' | 'right'
}

// Helper to extract clean argument text without Choice/Description prefixes
const cleanArgumentText = (text: string): string => {
  // Remove "Choice: [name], Description: [text]" and just return [text]
  const descMatch = text.match(/Description:\s*(.+)$/s)
  if (descMatch) return descMatch[1].trim()
  
  // If only "Choice: [name]" exists, return [name]
  const choiceMatch = text.match(/Choice:\s*(.+)$/s)
  if (choiceMatch) return choiceMatch[1].trim()
  
  // Fallback: return original text if no pattern matches
  return text
}

export const ArgumentDisplay = ({ argument, side }: ArgumentDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <PixelCard className={side === 'left' ? 'bg-pixel-blue/20 border-pixel-light-blue' : 'bg-pixel-pink/20 border-pixel-pink'}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 ${
                side === 'left' ? 'bg-pixel-blue' : 'bg-pixel-hot-pink'
              }`}
            />
            <span className="text-md-pixel text-pixel-cream">
              {getChoiceName(argument.agentName)}
            </span>
          </div>
          <p className="text-lg-pixel text-pixel-cream leading-relaxed">
            {cleanArgumentText(argument.argument)}
          </p>
        </div>
      </PixelCard>
    </motion.div>
  )
}
