import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { PixelText, PixelButton, PixelCard, HPBar } from '../common'
import { AgentAvatar } from '../common/AgentAvatar'
import { ArgumentDisplay } from './ArgumentDisplay'
import { JudgePanel } from './JudgePanel'
import { DamageAnimation } from './DamageAnimation'
import { BattleLog } from './BattleLog'
import type { Battle } from '../../store/types'
import { getChoiceName } from '@/util/flatten'

export const BattleFocusView = () => {
  const navigate = useNavigate()
  const {
    agents,
    activeBattles,
    focusedBattleId,
    setFocusedBattle,
    setCurrentScreen,
  } = useGameStore()

  const [showDamage, setShowDamage] = useState(false)
  const [lastTurnIndex, setLastTurnIndex] = useState(-1)
  const [showBattleOverBanner, setShowBattleOverBanner] = useState(false)
  const [lastBattle, setLastBattle] = useState<Battle | null>(null)

  // Find the focused battle
  const battle: Battle | undefined = activeBattles.find((b) => b.id === focusedBattleId)
  const allAgentIds = agents.map(a => a.id)

  // Handle back navigation
  const handleBack = () => {
    setFocusedBattle(null)
    setCurrentScreen('arena')
    navigate('/arena')
  }

  // Track when battle transitions from existing to not existing (battle ended and removed)
  useEffect(() => {
    if (battle) {
      setLastBattle(battle)
      setShowBattleOverBanner(false)
    } else if (lastBattle && !battle) {
      // Battle was removed - show banner and navigate back
      setShowBattleOverBanner(true)
      const timer = setTimeout(() => {
        setFocusedBattle(null)
        setCurrentScreen('arena')
        navigate('/arena')
      }, 3000) // Show banner for 3 seconds before navigating back
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle, lastBattle])

  // Show damage animation when new turn arrives
  useEffect(() => {
    if (battle && battle.turns.length > 0) {
      const currentTurnIndex = battle.turns.length - 1
      if (currentTurnIndex > lastTurnIndex) {
        setLastTurnIndex(currentTurnIndex)
        setShowDamage(false)
        // Show damage after arguments are displayed
        const timer = setTimeout(() => setShowDamage(true), 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [battle, lastTurnIndex])

  // Reset when battle changes
  useEffect(() => {
    setLastTurnIndex(-1)
    setShowDamage(false)
  }, [focusedBattleId])

  // Show battle over banner if battle just ended
  if (!battle && showBattleOverBanner && lastBattle) {
    const winner = lastBattle.agent1.id === lastBattle.winner ? lastBattle.agent1 : lastBattle.agent2

    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-pixel-green/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pixel-pink/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Battle Over Banner */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.5, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 20px rgba(134, 239, 172, 0.8)',
                '0 0 40px rgba(134, 239, 172, 1)',
                '0 0 20px rgba(134, 239, 172, 0.8)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <PixelText variant="h1" shadow className="text-pixel-green mb-8">
              BATTLE OVER!
            </PixelText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex flex-col items-center"
          >
            <div className="mb-4">
              <AgentAvatar agentId={winner.id} allAgentIds={allAgentIds} size="6xl" />
            </div>
            <PixelText variant="h2" className="text-pixel-cream mb-2">
              {getChoiceName(winner.name)}
            </PixelText>
            <PixelText variant="h3" className="text-pixel-green">
              VICTORIOUS!
            </PixelText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <PixelText variant="body" className="text-pixel-gray">
              Returning to arena...
            </PixelText>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  if (!battle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <PixelText variant="h2" className="text-pixel-pink mb-4">
          Battle Not Found
        </PixelText>
        <PixelButton onClick={handleBack} variant="secondary">
          Back to Arena
        </PixelButton>
      </div>
    )
  }

  const { agent1, agent2, turns, status } = battle
  const currentTurn = turns.length > 0 ? turns[turns.length - 1] : null
  const isComplete = status === 'ended'

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pixel-pink/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pixel-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <PixelButton onClick={handleBack} variant="secondary" size="sm">
            ← Back to Arena
          </PixelButton>

          <div className="text-center flex-1">
            <motion.div
              animate={{
                textShadow: [
                  '0 0 10px rgba(255, 141, 199, 0.5)',
                  '0 0 20px rgba(255, 141, 199, 0.8)',
                  '0 0 10px rgba(255, 141, 199, 0.5)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <PixelText variant="h2" shadow className="text-pixel-hot-pink">
                {isComplete ? 'BATTLE COMPLETE!' : 'BATTLE!'}
              </PixelText>
            </motion.div>
            <PixelText variant="body" className="text-pixel-cream">
              Turn {turns.length}/3
            </PixelText>
          </div>

          <div className="w-32" /> {/* Spacer for alignment */}
        </div>

        {/* Combatants Display */}
        <div className="grid grid-cols-3 gap-6 items-stretch mb-6">
          {/* Agent 1 */}
          <PixelCard className={`border-pixel-blue ${battle.winner === agent1.id ? 'ring-4 ring-pixel-green' : ''}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AgentAvatar
                  agentId={agent1.id}
                  allAgentIds={allAgentIds}
                  size="4xl"
                  animate={status === 'in_progress' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div className="flex-1">
                  <PixelText variant="h3" className="text-pixel-cream">
                    {getChoiceName(agent1.name)}
                  </PixelText>
                  {agent1.catchphrase && (
                    <PixelText variant="small" className="text-pixel-blue italic">
                      "{agent1.catchphrase}"
                    </PixelText>
                  )}
                </div>
              </div>

              {/* Battle HP */}
              <div>
                <PixelText variant="small" className="text-pixel-gray mb-1">
                  Battle HP
                </PixelText>
                <HPBar
                  current={agent1.currentBattleHp}
                  max={agent1.maxBattleHp}
                  label="HP"
                  size="md"
                  showNumbers={true}
                />
              </div>

              {/* Global HP */}
              <div>
                <PixelText variant="small" className="text-pixel-gray mb-1">
                  Global HP
                </PixelText>
                <HPBar
                  current={agent1.currentGlobalHp}
                  max={agent1.maxGlobalHp}
                  label="Global"
                  size="sm"
                  showNumbers={true}
                />
              </div>
            </div>
          </PixelCard>

          {/* VS */}
          <div className="flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <PixelText variant="h1" shadow className="text-pixel-hot-pink">
                VS
              </PixelText>
            </motion.div>
          </div>

          {/* Agent 2 */}
          <PixelCard className={`border-pixel-pink ${battle.winner === agent2.id ? 'ring-4 ring-pixel-green' : ''}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AgentAvatar
                  agentId={agent2.id}
                  allAgentIds={allAgentIds}
                  size="4xl"
                  animate={status === 'in_progress' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
                <div className="flex-1">
                  <PixelText variant="h3" className="text-pixel-cream">
                    {getChoiceName(agent2.name)}
                  </PixelText>
                  {agent2.catchphrase && (
                    <PixelText variant="small" className="text-pixel-pink italic">
                      "{agent2.catchphrase}"
                    </PixelText>
                  )}
                </div>
              </div>

              {/* Battle HP */}
              <div>
                <PixelText variant="small" className="text-pixel-gray mb-1">
                  Battle HP
                </PixelText>
                <HPBar
                  current={agent2.currentBattleHp}
                  max={agent2.maxBattleHp}
                  label="HP"
                  size="md"
                  showNumbers={true}
                />
              </div>

              {/* Global HP */}
              <div>
                <PixelText variant="small" className="text-pixel-gray mb-1">
                  Global HP
                </PixelText>
                <HPBar
                  current={agent2.currentGlobalHp}
                  max={agent2.maxGlobalHp}
                  label="Global"
                  size="sm"
                  showNumbers={true}
                />
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Current Turn Arguments */}
        <AnimatePresence mode="wait">
          {currentTurn && (
            <motion.div
              key={`turn-${currentTurn.turnNumber}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <PixelCard>
                <PixelText variant="h3" className="text-pixel-pink mb-4 text-center">
                  Turn {currentTurn.turnNumber} Arguments
                </PixelText>

                <div className="grid grid-cols-2 gap-6">
                  {/* Agent 1 Argument */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AgentAvatar agentId={agent1.id} allAgentIds={allAgentIds} size="xl" />
                      <PixelText variant="body" className="text-pixel-blue">
                        {getChoiceName(agent1.name)}
                      </PixelText>
                    </div>
                    <ArgumentDisplay
                      argument={currentTurn.argument1}
                      side="left"
                    />
                  </div>

                  {/* Agent 2 Argument */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AgentAvatar agentId={agent2.id} allAgentIds={allAgentIds} size="xl" />
                      <PixelText variant="body" className="text-pixel-pink">
                        {getChoiceName(agent2.name)}
                      </PixelText>
                    </div>
                    <ArgumentDisplay
                      argument={currentTurn.argument2}
                      side="right"
                    />
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Judge Votes */}
        {currentTurn && currentTurn.votes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <JudgePanel votes={currentTurn.votes} />
          </motion.div>
        )}

        {/* Damage Animation */}
        <AnimatePresence>
          {showDamage && currentTurn && currentTurn.damage > 0 && (
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <DamageAnimation
                damage={currentTurn.damage}
                onComplete={() => {}}
              />
              <div className="ml-4">
                <PixelText variant="body" className="text-pixel-hot-pink">
                  {currentTurn.loserName} takes {Math.floor(currentTurn.damage)} damage!
                  {currentTurn.wasCritical && ' CRITICAL HIT!'}
                </PixelText>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Battle Complete Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <PixelCard className="border-pixel-green bg-pixel-green/10 text-center">
              <PixelText variant="h2" className="text-pixel-green mb-2">
                {getChoiceName(battle.winner === agent1.id ? agent1.name : agent2.name)} WINS!
              </PixelText>
              <PixelText variant="body" className="text-pixel-cream">
                {getChoiceName(battle.loser === agent1.id ? agent1.name : agent2.name)} takes 25 global HP damage!
              </PixelText>
            </PixelCard>
          </motion.div>
        )}

        {/* Battle Log */}
        {turns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <BattleLog turns={turns} />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
