import { motion } from 'framer-motion'
import { AgentSprite } from './AgentSprite'
import type { ChoiceAgent } from '../../store/types'

interface ArenaGridProps {
  width: number
  height: number
  agents: ChoiceAgent[]
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
    <div className="relative border-4 border-pixel-light-purple/60 bg-gradient-to-br from-pixel-purple/20 to-pixel-dark/40 shadow-2xl">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pixel-pink/20 via-pixel-blue/20 to-pixel-light-purple/20 blur-xl -z-10" />

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
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pixel-purple via-pixel-pink/30 to-pixel-purple border-4 border-pixel-pink px-8 py-3 shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          boxShadow: '0 0 30px rgba(255, 179, 217, 0.4), 4px 4px 0px rgba(26, 15, 38, 0.6)'
        }}
      >
        <span className="text-md-pixel text-pixel-cream">BATTLE ARENA</span>
      </motion.div>
    </div>
  )
}
