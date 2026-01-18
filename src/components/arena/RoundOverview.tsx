import { motion } from 'framer-motion'
import type { Round, ChoiceAgent } from '../../store/types'
import { PixelText } from '../common'
import { AgentAvatar } from '../common/AgentAvatar'
import { useGameStore } from '../../store/gameStore'
import { getChoiceName } from '@/util/flatten'

interface RoundOverviewProps {
  round: Round | null
  roundHistory: Round[]
  aliveAgents: ChoiceAgent[]
  eliminatedAgents: ChoiceAgent[]
}

export const RoundOverview = ({ round, roundHistory, aliveAgents, eliminatedAgents }: RoundOverviewProps) => {
  const { agents } = useGameStore()
  const allAgentIds = agents.map(a => a.id)
  const roundNumber = round?.roundNumber ?? (roundHistory.length + 1)
  const completedBattles = round?.matchups.filter((m) => m.status === 'completed').length ?? 0
  const totalBattles = round?.matchups.length ?? 0

  return (
    <div className="text-center mb-6">
      {/* Round Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <motion.div
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 141, 199, 0.5)',
              '0 0 40px rgba(126, 179, 255, 0.8)',
              '0 0 20px rgba(255, 141, 199, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PixelText variant="h1" shadow className="text-pixel-hot-pink">
            ROUND {roundNumber}
          </PixelText>
        </motion.div>
      </motion.div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-8 mt-4">
        {/* Alive Agents */}
        <div className="text-center">
          <PixelText variant="h3" className="text-pixel-green">
            {aliveAgents.length}
          </PixelText>
          <PixelText variant="small" className="text-pixel-cream">
            Alive
          </PixelText>
        </div>

        {/* Battle Progress */}
        {totalBattles > 0 && (
          <div className="text-center">
            <PixelText variant="h3" className="text-pixel-blue">
              {completedBattles}/{totalBattles}
            </PixelText>
            <PixelText variant="small" className="text-pixel-cream">
              Battles
            </PixelText>
          </div>
        )}

        {/* Eliminated */}
        <div className="text-center">
          <PixelText variant="h3" className="text-pixel-gray">
            {eliminatedAgents.length}
          </PixelText>
          <PixelText variant="small" className="text-pixel-cream">
            Eliminated
          </PixelText>
        </div>

        {/* Rounds Completed */}
        <div className="text-center">
          <PixelText variant="h3" className="text-pixel-pink">
            {roundHistory.length}
          </PixelText>
          <PixelText variant="small" className="text-pixel-cream">
            Rounds Done
          </PixelText>
        </div>
      </div>

      {/* Eliminated Agents Display */}
      {eliminatedAgents.length > 0 && (
        <motion.div
          className="mt-4 flex justify-center gap-2 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <PixelText variant="small" className="text-pixel-gray w-full mb-1">
            Eliminated:
          </PixelText>
          {eliminatedAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-pixel-dark/50 border border-pixel-gray/50 rounded px-2 py-1 opacity-50 flex items-center gap-1"
            >
              <AgentAvatar agentId={agent.id} allAgentIds={allAgentIds} size="lg" grayscale={true} />
              <PixelText variant="small" className="text-pixel-gray">
                {getChoiceName(agent.name)}
              </PixelText>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
