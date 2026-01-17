import { motion } from 'framer-motion'
import { PixelCard, HPBar } from '../common'
import type { Agent } from '../../store/types'

interface RankingListProps {
  rankings: Agent[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export const RankingList = ({ rankings }: RankingListProps) => {
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
                  <div
                    className="w-8 h-8 border-4 border-black"
                    style={{ backgroundColor: agent.color }}
                  />
                  <span className="text-md-pixel text-pixel-cream">
                    {agent.name}
                  </span>
                </div>
                <HPBar
                  current={agent.globalHp}
                  max={agent.maxGlobalHp}
                  label="Final HP"
                  size="sm"
                  showNumbers={true}
                  animated={false}
                />
                <p className="text-xs-pixel text-pixel-gray">
                  {agent.description.length > 100
                    ? agent.description.slice(0, 100) + '...'
                    : agent.description}
                </p>
              </div>
            </div>
          </PixelCard>
        </motion.div>
      ))}
    </div>
  )
}
