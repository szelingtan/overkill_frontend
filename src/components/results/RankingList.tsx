import { motion } from 'framer-motion'
import { PixelCard, HPBar } from '../common'
import { AgentAvatar } from '../common/AgentAvatar'
import type { ChoiceAgent } from '../../store/types'
import { getChoiceName } from '@/util/flatten'

interface RankingListProps {
  rankings: ChoiceAgent[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export const RankingList = ({ rankings }: RankingListProps) => {
  const allAgentIds = rankings.map(a => a.id)
  return (
    <div className="space-y-4">
      {rankings.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.2,
            type: 'spring',
            stiffness: 200,
          }}
        >
          <PixelCard
            className={`${
              index === 0
                ? 'border-pixel-pink bg-pixel-pink/10'
                : index === 1
                ? 'border-pixel-blue bg-pixel-blue/10'
                : index === 2
                ? 'border-pixel-light-purple bg-pixel-light-purple/10'
                : 'border-pixel-gray'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="text-xl-pixel w-12 text-center">
                {index < 3 ? MEDALS[index] : `#${index + 1}`}
              </div>

              {/* Agent Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <AgentAvatar agentId={agent.id} allAgentIds={allAgentIds} size="2xl" />
                  <span className="text-md-pixel text-pixel-cream">
                    {getChoiceName(agent.name)}
                  </span>
                  {agent.status === 'eliminated' && (
                    <span className="text-xs text-pixel-gray">(Eliminated)</span>
                  )}
                </div>
                <HPBar
                  current={agent.currentGlobalHp}
                  max={agent.maxGlobalHp}
                  label="Final HP"
                  size="sm"
                  showNumbers={true}
                />
                {agent.choice?.description && (
                  <p className="text-xs-pixel text-pixel-gray">
                    {agent.choice.description.length > 100
                      ? agent.choice.description.slice(0, 100) + '...'
                      : agent.choice.description}
                  </p>
                )}
              </div>
            </div>
          </PixelCard>
        </motion.div>
      ))}
    </div>
  )
}
