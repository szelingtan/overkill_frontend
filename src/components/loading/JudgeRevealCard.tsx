import { motion } from 'framer-motion'
import type { JudgeAgent } from '../../store/types'
import { PixelText } from '../common'

interface JudgeRevealCardProps {
  judge: JudgeAgent
  index: number
  isRevealed: boolean
}

const personalityEmoji: Record<string, string> = {
  funny: '🤡',
  sarcastic: '😏',
  nerd: '🤓',
  serious: '🧐',
  custom: '⚡',
}

export const JudgeRevealCard = ({ judge, index, isRevealed }: JudgeRevealCardProps) => {
  const emoji = judge.avatarEmoji || judge.avatar || personalityEmoji[judge.personality] || '⚖️'

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2, duration: 0.4 }}
    >
      <motion.div
        className="bg-gradient-to-br from-pixel-dark/80 to-pixel-purple/80 border-2 border-pixel-pink rounded-lg p-3 text-center"
        animate={isRevealed ? {
          boxShadow: [
            '0 0 10px rgba(255, 179, 217, 0.3)',
            '0 0 20px rgba(255, 179, 217, 0.5)',
            '0 0 10px rgba(255, 179, 217, 0.3)',
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="text-3xl mb-2"
          animate={isRevealed ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {emoji}
        </motion.div>
        <PixelText variant="small" className="text-pixel-cream">
          {judge.name}
        </PixelText>
        <PixelText variant="small" className="text-pixel-pink capitalize">
          {judge.personality}
        </PixelText>
      </motion.div>
    </motion.div>
  )
}
