import { motion } from 'framer-motion'
import { HPBar } from '../common'
import type { Agent } from '../../store/types'

interface AgentSpriteProps {
  agent: Agent
  cellSize: number
}

export const AgentSprite = ({ agent, cellSize }: AgentSpriteProps) => {
  const isEliminated = agent.status === 'eliminated'
  const isBattling = agent.status === 'battling'

  // Generate a simple pixel art sprite based on agent color
  const spriteStyle = {
    width: cellSize * 0.6,
    height: cellSize * 0.6,
    backgroundColor: agent.color,
  }

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        x: agent.position.x * cellSize + cellSize / 2 - (cellSize * 0.6) / 2,
        y: agent.position.y * cellSize + cellSize / 2 - (cellSize * 0.6) / 2,
        opacity: isEliminated ? 0.3 : 1,
        scale: isEliminated ? 0.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      }}
      style={{ pointerEvents: isEliminated ? 'none' : 'auto' }}
    >
      {/* Agent Sprite */}
      <motion.div
        className="relative border-4 border-black"
        style={spriteStyle}
        animate={{
          boxShadow: isBattling
            ? '0 0 20px ' + agent.color
            : '4px 4px 0px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Simple pixel face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1">
            {/* Eyes */}
            <div className="w-1 h-1 bg-black"></div>
            <div></div>
            <div className="w-1 h-1 bg-black"></div>
          </div>
        </div>

        {/* Status indicator */}
        {isBattling && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-pixel-red rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Name Label */}
      <div
        className="text-xs-pixel text-pixel-white text-center px-2 py-1 bg-pixel-dark/90 border border-pixel-blue whitespace-nowrap"
        style={{ maxWidth: cellSize * 2 }}
      >
        {agent.name.length > 10 ? agent.name.slice(0, 10) + '...' : agent.name}
      </div>

      {/* HP Bar */}
      <div style={{ width: cellSize * 0.8 }}>
        <HPBar
          current={agent.hp}
          max={agent.maxHp}
          size="sm"
          showNumbers={false}
          animated={true}
        />
      </div>
    </motion.div>
  )
}
