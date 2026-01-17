import { motion } from 'framer-motion'
import { PixelCard, PixelText } from '../common'
import type { Battle } from '../../store/types'

interface HighlightReelProps {
  battles: Battle[]
}

export const HighlightReel = ({ battles }: HighlightReelProps) => {
  // Get some notable moments from battles
  const highlights = battles
    .flatMap((battle) =>
      battle.turns.map((turn) => ({
        battleId: battle.id,
        agent1: battle.agent1.name,
        agent2: battle.agent2.name,
        ...turn,
      }))
    )
    .sort((a, b) => b.damage - a.damage)
    .slice(0, 5)

  if (highlights.length === 0) return null

  return (
    <div className="space-y-4">
      <PixelText variant="h3" className="text-pixel-yellow text-center">
        HIGHLIGHT REEL
      </PixelText>

      <div className="space-y-3">
        {highlights.map((highlight, index) => (
          <motion.div
            key={`${highlight.battleId}-${highlight.turnNumber}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <PixelCard className="border-pixel-yellow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm-pixel text-pixel-yellow">
                    {highlight.agent1} vs {highlight.agent2}
                  </span>
                  <span className="text-sm-pixel text-pixel-red">
                    {Math.floor(highlight.damage)} DMG!
                  </span>
                </div>

                {highlight.arguments[0] && (
                  <div className="text-xs-pixel text-pixel-white bg-pixel-darker p-2 border border-pixel-blue">
                    "{highlight.arguments[0].argument.slice(0, 150)}
                    {highlight.arguments[0].argument.length > 150 ? '...' : ''}"
                  </div>
                )}

                {highlight.votes[0] && (
                  <div className="text-xs-pixel text-pixel-gray">
                    <span className="text-pixel-light-blue">
                      {highlight.votes[0].judgeName}:
                    </span>{' '}
                    {highlight.votes[0].reaction}
                  </div>
                )}
              </div>
            </PixelCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
