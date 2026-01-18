import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Battle } from '../../store/types'
import { useGameStore } from '../../store/gameStore'
import { PixelText, HPBar } from '../common'
import { AgentAvatar } from '../common/AgentAvatar'
import { getChoiceName } from '@/util/flatten'

interface MiniBattleCardProps {
  battle: Battle
  onClick: () => void
  isActive?: boolean
}

export const MiniBattleCard = ({ battle, onClick, isActive }: MiniBattleCardProps) => {
  const { agent1, agent2, turns, status } = battle
  const { agents } = useGameStore()
  const currentTurn = turns[turns.length - 1]
  const isComplete = status === 'ended'

  // Animation states
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'clash' | 'impact' | 'recoil'>('idle')
  const [lastTurnCount, setLastTurnCount] = useState(0)
  const [lastTurnLoser, setLastTurnLoser] = useState<string | null>(null)

  // Determine winner highlight
  const winnerId = battle.winner
  const agent1Won = winnerId === agent1.id
  const agent2Won = winnerId === agent2.id

  // Get all agent IDs for sprite mapping
  const allAgentIds = agents.map(a => a.id)

  // Trigger clash animation when new turn arrives
  useEffect(() => {
    if (turns.length > lastTurnCount && currentTurn) {
      setLastTurnCount(turns.length)
      const loserId = currentTurn.loserName === agent1.name ? agent1.id : agent2.id
      setLastTurnLoser(loserId)

      // Animation sequence
      setAnimationPhase('clash')
      const impactTimer = setTimeout(() => setAnimationPhase('impact'), 800)
      const recoilTimer = setTimeout(() => setAnimationPhase('recoil'), 1100)
      const resetTimer = setTimeout(() => setAnimationPhase('idle'), 1600)

      return () => {
        clearTimeout(impactTimer)
        clearTimeout(recoilTimer)
        clearTimeout(resetTimer)
      }
    }
  }, [turns.length, lastTurnCount, currentTurn, agent1.name, agent1.id, agent2.id])

  // Get animation for gladiators
  const getGladiatorAnimation = (agentId: string, isLeftSide: boolean) => {
    const isLoser = lastTurnLoser === agentId

    switch (animationPhase) {
      case 'clash':
        // Move toward center
        return {
          x: isLeftSide ? 25 : -25,
          scale: 1.15,
        }
      case 'impact':
        // Impact shake
        if (isLoser) {
          return {
            x: isLeftSide ? 25 : -25,
            rotate: [0, -8, 8, -8, 8, 0],
            scale: [1.15, 1, 1.15],
          }
        }
        return {
          x: isLeftSide ? 25 : -25,
          scale: 1.15,
        }
      case 'recoil':
        // Loser recoils back
        if (isLoser) {
          return {
            x: isLeftSide ? -15 : 15,
            rotate: isLeftSide ? -10 : 10,
            scale: 0.95,
          }
        }
        return {
          x: isLeftSide ? 15 : -15,
          scale: 1.1,
        }
      case 'idle':
      default:
        // Gentle idle animation
        if (status === 'in_progress' && !isComplete) {
          return {
            rotate: isLeftSide ? [-3, 3, -3] : [3, -3, 3],
          }
        }
        return {}
    }
  }

  return (
    <div className="relative pt-2 pr-2">
      {/* Battle Status Badge - outside overflow container */}
      <div className="absolute top-0 right-0 z-10">
        {status === 'in_progress' && (
          <motion.div
            className="bg-pixel-green text-pixel-dark px-2 py-0.5 rounded text-xs font-pixel shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LIVE
          </motion.div>
        )}
        {isComplete && (
          <div className="bg-pixel-gray text-pixel-dark px-2 py-0.5 rounded text-xs font-pixel shadow-lg">
            DONE
          </div>
        )}
      </div>

      <motion.div
        className={`
          bg-gradient-to-br from-pixel-dark/90 to-pixel-purple/90
          border-4 rounded-lg p-3 cursor-pointer overflow-hidden
          transition-all duration-200 hover:scale-105
          ${isActive ? 'border-pixel-hot-pink shadow-lg shadow-pixel-hot-pink/30' : 'border-pixel-light-purple'}
          ${isComplete ? 'opacity-75' : ''}
        `}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={
          animationPhase === 'impact'
            ? {
                x: [0, -3, 3, -3, 3, 0],
                y: [0, -2, 2, -2, 2, 0],
              }
            : {}
        }
        transition={
          animationPhase === 'impact'
            ? { duration: 0.25 }
            : {}
        }
        layout
      >
        {/* Turn Counter */}
        <div className="text-center mb-2">
          <PixelText variant="small" className="text-pixel-pink">
            Turn {turns.length}
          </PixelText>
        </div>

        {/* Agents Face-off */}
        <div className="flex items-center justify-between gap-1">
          {/* Agent 1 */}
          <div className={`flex-1 min-w-0 text-center ${agent1Won ? 'ring-2 ring-pixel-green rounded p-1' : ''}`}>
            <div className="flex justify-center mb-1">
              <AgentAvatar
                agentId={agent1.id}
                allAgentIds={allAgentIds}
                size="2xl"
                animate={getGladiatorAnimation(agent1.id, true)}
                transition={{
                  duration: animationPhase === 'impact' ? 0.25 : 0.4,
                  repeat: animationPhase === 'idle' && status === 'in_progress' ? Infinity : 0,
                  type: animationPhase === 'impact' ? 'spring' : 'tween',
                  stiffness: 500,
                }}
              />
            </div>
            <PixelText variant="small" className="text-pixel-cream truncate block max-w-full">
              {getChoiceName(agent1.name)}
            </PixelText>
            <div className="mt-1 overflow-hidden">
              <HPBar
                current={agent1.currentBattleHp}
                max={agent1.maxBattleHp}
                size="sm"
                showNumbers={false}
              />
            </div>
          </div>

          {/* VS */}
          <div className="px-1 flex-shrink-0 relative">
            <motion.div
              animate={
                animationPhase === 'impact'
                  ? {
                      scale: [1.2, 1.8, 1.2],
                      rotate: [0, 180, 0],
                    }
                  : animationPhase === 'clash'
                  ? {
                      scale: [1, 1.4, 1],
                    }
                  : status === 'in_progress'
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{
                duration: animationPhase === 'impact' ? 0.3 : animationPhase === 'clash' ? 0.4 : 0.8,
                repeat: animationPhase === 'idle' && status === 'in_progress' ? Infinity : 0,
              }}
            >
              <PixelText variant="small" className="text-pixel-hot-pink">
                VS
              </PixelText>
            </motion.div>
            {/* Mini flash effect on impact */}
            {animationPhase === 'impact' && (
              <motion.div
                className="absolute inset-0 bg-white/40 rounded-full blur-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {/* Agent 2 */}
          <div className={`flex-1 min-w-0 text-center ${agent2Won ? 'ring-2 ring-pixel-green rounded p-1' : ''}`}>
            <div className="flex justify-center mb-1">
              <AgentAvatar
                agentId={agent2.id}
                allAgentIds={allAgentIds}
                size="2xl"
                animate={getGladiatorAnimation(agent2.id, false)}
                transition={{
                  duration: animationPhase === 'impact' ? 0.25 : 0.4,
                  repeat: animationPhase === 'idle' && status === 'in_progress' ? Infinity : 0,
                  type: animationPhase === 'impact' ? 'spring' : 'tween',
                  stiffness: 500,
                }}
              />
            </div>
            <PixelText variant="small" className="text-pixel-cream truncate block max-w-full">
              {getChoiceName(agent2.name)}
            </PixelText>
            <div className="mt-1 overflow-hidden">
              <HPBar
                current={agent2.currentBattleHp}
                max={agent2.maxBattleHp}
                size="sm"
                showNumbers={false}
              />
            </div>
          </div>
        </div>

        {/* Latest Action Preview */}
        {currentTurn && currentTurn.damage > 0 && (
          <motion.div
            className="mt-2 p-1.5 bg-pixel-darker/50 rounded text-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PixelText variant="small" className="text-pixel-pink truncate block">
              {currentTurn.loserName} takes {Math.floor(currentTurn.damage)} DMG!
            </PixelText>
          </motion.div>
        )}

        {/* Click hint */}
        <div className="mt-2 text-center opacity-50">
          <PixelText variant="small" className="text-pixel-gray">
            Click to watch
          </PixelText>
        </div>
      </motion.div>
    </div>
  )
}
