import { motion } from 'framer-motion'
import { AgentSprite } from './AgentSprite'
import type { Agent } from '../../store/types'

interface ArenaGridProps {
  width: number
  height: number
  agents: Agent[]
  cellSize?: number
}

export const ArenaGrid = ({
  width,
  height,
  agents,
  cellSize = 40,
}: ArenaGridProps) => {
  // Generate grid cells
  const cells = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells.push({ x, y, key: `${x}-${y}` })
    }
  }

  return (
    <div className="relative border-4 border-pixel-blue bg-pixel-dark shadow-pixel">
      {/* Grid Background */}
      <div
        className="relative"
        style={{
          width: width * cellSize,
          height: height * cellSize,
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        }}
      >
        {cells.map((cell) => (
          <div
            key={cell.key}
            className="grid-cell"
            style={{
              width: cellSize,
              height: cellSize,
            }}
          />
        ))}

        {/* Agents Layer */}
        <div className="absolute inset-0">
          {agents.map((agent) => (
            <AgentSprite key={agent.id} agent={agent} cellSize={cellSize} />
          ))}
        </div>
      </div>

      {/* Arena Title */}
      <motion.div
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-pixel-blue border-4 border-pixel-light-blue px-6 py-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-md-pixel text-pixel-yellow">BATTLE ARENA</span>
      </motion.div>
    </div>
  )
}
