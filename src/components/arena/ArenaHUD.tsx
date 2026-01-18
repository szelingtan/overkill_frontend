import { motion } from 'framer-motion'
import { PixelCard, HPBar, PixelText } from '../common'
import type { ChoiceAgent } from '../../store/types'
import { getChoiceName } from '@/util/flatten'

interface ArenaHUDProps {
  agents: ChoiceAgent[]
}

export const ArenaHUD = ({ agents }: ArenaHUDProps) => {
  const activeAgents = agents.filter((a) => a.status !== 'eliminated')
  const eliminatedCount = agents.length - activeAgents.length

  return (
    <div className="space-y-4">
      {/* Stats Panel */}
      <PixelCard>
        <div className="space-y-3">
          <PixelText variant="h3" className="text-pixel-pink">
            Battle Stats
          </PixelText>
          <div className="grid grid-cols-2 gap-4 text-sm-pixel">
            <div>
              <span className="text-pixel-gray">Active:</span>{' '}
              <span className="text-pixel-green">{activeAgents.length}</span>
            </div>
            <div>
              <span className="text-pixel-gray">Eliminated:</span>{' '}
              <span className="text-pixel-red">{eliminatedCount}</span>
            </div>
          </div>
        </div>
      </PixelCard>

      {/* Agents List */}
      <PixelCard>
        <div className="space-y-3">
          <PixelText variant="h3" className="text-pixel-pink">
            Gladiators
          </PixelText>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                className={`p-2 border-2 ${
                  agent.status === 'eliminated'
                    ? 'border-pixel-gray opacity-50'
                    : agent.status === 'battling'
                    ? 'border-pixel-hot-pink bg-pixel-hot-pink/10'
                    : 'border-pixel-light-purple'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-black"
                      style={{ backgroundColor: agent.color }}
                    />
                    <span className="text-sm-pixel text-pixel-cream flex-1">
                      {getChoiceName(agent.name)}
                    </span>
                    {agent.status === 'battling' && (
                      <span className="text-xs-pixel text-pixel-hot-pink">
                        FIGHTING!
                      </span>
                    )}
                    {agent.status === 'eliminated' && (
                      <span className="text-xs-pixel text-pixel-gray">KO</span>
                    )}
                  </div>
                  <HPBar
                    current={agent.currentGlobalHp}
                    max={agent.maxGlobalHp}
                    label="Global HP"
                    size="sm"
                    showNumbers={true}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}
