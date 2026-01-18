import { motion } from 'framer-motion'
import { PixelCard, PixelText } from '../common'
import { AgentAvatar } from '../common/AgentAvatar'
import { useGameStore } from '../../store/gameStore'
import type { Battle } from '../../store/types'
import { getChoiceName } from '@/util/flatten'

interface HighlightReelProps {
  battles: Battle[]
}

export const HighlightReel = ({ battles }: HighlightReelProps) => {
  const { agents } = useGameStore()
  const allAgentIds = agents.map(a => a.id)

  // Get some notable moments from battles
  const highlights = battles
    .flatMap((battle) =>
      battle.turns.map((turn) => ({
        battleId: battle.id,
        agent1Id: battle.agent1.id,
        agent1Name: getChoiceName(battle.agent1.name),
        agent2Id: battle.agent2.id,
        agent2Name: getChoiceName(battle.agent2.name),
        winnerName: turn.winnerName,
        loserName: turn.loserName,
        argument1: turn.argument1,
        argument2: turn.argument2,
        votes: turn.votes,
        damage: turn.damage,
        turnNumber: turn.turnNumber,
        wasCritical: turn.wasCritical,
      }))
    )
    .filter((h) => h.damage > 0)
    .sort((a, b) => b.damage - a.damage)
    .slice(0, 5)

  if (highlights.length === 0) return null

  return (
    <div className="space-y-4">
      <PixelText variant="h3" className="text-pixel-pink text-center">
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
            <PixelCard className="border-pixel-pink">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm-pixel text-pixel-cream">
                    <AgentAvatar agentId={highlight.agent1Id} allAgentIds={allAgentIds} size="sm" />
                    {highlight.agent1Name} vs {highlight.agent2Name}
                    <AgentAvatar agentId={highlight.agent2Id} allAgentIds={allAgentIds} size="sm" />
                  </div>
                  <span className="text-sm-pixel text-pixel-hot-pink">
                    {Math.floor(highlight.damage)} DMG{highlight.wasCritical ? ' CRIT!' : '!'}
                  </span>
                </div>

                {/* Show the winning argument */}
                {highlight.argument1 && (
                  <div className="text-xs-pixel text-pixel-cream bg-pixel-darker p-2 border border-pixel-light-purple">
                    <span className="text-pixel-blue">{highlight.argument1.agentName}:</span>{' '}
                    "{highlight.argument1.argument.slice(0, 150)}
                    {highlight.argument1.argument.length > 150 ? '...' : ''}"
                  </div>
                )}

                {highlight.votes && highlight.votes[0] && (
                  <div className="text-xs-pixel text-pixel-gray">
                    <span className="text-pixel-blue">
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
