import { useEffect, useState, useRef } from 'react'
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

  // Animation states for gladiator clash
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'approach' | 'clash' | 'impact'>('idle')
  const [lastTurnLoser, setLastTurnLoser] = useState<string | null>(null)
  const [lastTurnWinner, setLastTurnWinner] = useState<string | null>(null)

  // Use refs to store timers so they persist across renders
  const animationTimersRef = useRef<NodeJS.Timeout[]>([])

  // Debug: Log animation phase changes
  useEffect(() => {
    console.log('🎭 Animation Phase Changed:', animationPhase)
  }, [animationPhase])

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

  // Show damage animation and clash sequence when new turn arrives
  useEffect(() => {
    if (battle && battle.turns.length > 0) {
      const currentTurnIndex = battle.turns.length - 1
      if (currentTurnIndex > lastTurnIndex) {
        setLastTurnIndex(currentTurnIndex)
        setShowDamage(false)

        const currentTurn = battle.turns[currentTurnIndex]
        const loserId = currentTurn.loserName === battle.agent1.name ? battle.agent1.id : battle.agent2.id
        const winnerId = currentTurn.winnerName === battle.agent1.name ? battle.agent1.id : battle.agent2.id
        setLastTurnLoser(loserId)
        setLastTurnWinner(winnerId)

        // Clear any existing timers
        animationTimersRef.current.forEach(timer => clearTimeout(timer))
        animationTimersRef.current = []

        // Simplified animation: approach -> clash -> impact (shake & disappear)
        console.log('🎬 ====== NEW TURN ====== Turn #', currentTurnIndex + 1)
        console.log('Winner:', winnerId, 'Loser:', loserId)
        console.log('⏰ STEP 1: APPROACH - Both moving toward each other')
        setAnimationPhase('approach')

        // Step 2: Clash - Attacker lunges
        const clashTimer = setTimeout(() => {
          console.log('⏰ STEP 2: CLASH - Attacker lunges forward!')
          setAnimationPhase('clash')
        }, 1500)
        animationTimersRef.current.push(clashTimer)

        // Step 3: Impact - Loser shakes and disappears
        const impactTimer = setTimeout(() => {
          console.log('⏰ STEP 3: IMPACT - Loser shakes and disappears!')
          setAnimationPhase('impact')
          setShowDamage(true)
        }, 3500)
        animationTimersRef.current.push(impactTimer)

        // Reset back to approach for next turn
        const resetTimer = setTimeout(() => {
          console.log('✅ Animation complete')
          setAnimationPhase('approach')
        }, 5000)
        animationTimersRef.current.push(resetTimer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.turns.length])

  // Reset when battle changes
  useEffect(() => {
    setLastTurnIndex(-1)
    setShowDamage(false)
    setAnimationPhase('idle')
    setLastTurnLoser(null)
    setLastTurnWinner(null)
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

  // Determine if gladiators should be in center arena
  const showCenterArena = ['approach', 'clash', 'impact'].includes(animationPhase)

  // Get animation for center arena gladiators (absolute positioned)
  const getCenterGladiatorAnimation = (agentId: string, isLeftSide: boolean) => {
    const isLoser = lastTurnLoser === agentId
    const isWinner = lastTurnWinner === agentId

    switch (animationPhase) {
      case 'approach':
        // STEP 1: Both gladiators move towards each other
        return {
          x: isLeftSide ? -100 : 100,  // Both move inward to face each other
          y: 0,
          scale: 1.8,
          opacity: 1,
        }

      case 'clash':
        // STEP 2: Attacker lunges forward, loser stays still
        if (isWinner) {
          // Attacker LUNGES FORWARD dramatically
          return {
            x: isLeftSide ? 80 : -80,  // HUGE lunge toward opponent
            y: -30,  // Big jump
            scale: 2.5,
            opacity: 1,
          }
        } else {
          // Loser DOES NOT MOVE
          return {
            x: isLeftSide ? -100 : 100,  // Stay exactly where they were
            y: 0,
            scale: 1.8,
            opacity: 1,
          }
        }

      case 'impact':
        // STEP 3: Loser shakes violently and disappears, winner at full extension
        if (isLoser) {
          // Loser SHAKES AND DISAPPEARS
          return {
            x: isLeftSide ? -100 : 100,
            y: [0, -15, 15, -15, 0],
            rotate: [0, -40, 40, -40, 40, 0],  // HUGE shake
            scale: [1.8, 1.2, 1.8, 1.2, 0.5],
            opacity: [1, 0.7, 0.4, 0.2, 0],  // Fade to INVISIBLE
          }
        } else {
          // Winner stays at attack position
          return {
            x: isLeftSide ? 80 : -80,
            y: -30,
            scale: 2.5,
            opacity: 1,
          }
        }

      default:
        // Initial position (off-screen)
        return {
          x: isLeftSide ? -300 : 300,
          y: 0,
          scale: 1.5,
          opacity: 0,
        }
    }
  }

  // Get animation for card gladiators
  const getCardGladiatorAnimation = (agentId: string) => {
    const isWinner = battle.winner === agentId && isComplete

    // Victory celebration when battle is complete
    if (isWinner && isComplete) {
      return {
        scale: [1, 1.2, 1.1],
        rotate: [0, -10, 10, 0],
        y: [0, -10, 0],
        opacity: 1,
      }
    }

    // Hide during center arena fight
    if (showCenterArena) {
      return {
        opacity: 0.3,
        scale: 0.9,
      }
    }

    // Idle breathing animation
    if (status === 'in_progress' && !isComplete) {
      return { scale: [1, 1.05, 1], opacity: 1 }
    }

    return { scale: 1, opacity: 1 }
  }

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
        animate={
          animationPhase === 'impact'
            ? {
                opacity: 1,
                x: [0, -8, 8, -8, 8, 0],
                y: [0, -4, 4, -4, 4, 0],
              }
            : { opacity: 1 }
        }
        transition={
          animationPhase === 'impact'
            ? { duration: 0.3, ease: 'easeInOut' }
            : {}
        }
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
                  animate={getCardGladiatorAnimation(agent1.id)}
                  transition={{
                    duration: 0.3,
                    repeat: !showCenterArena && status === 'in_progress' ? Infinity : 0,
                  }}
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
          <div className="flex items-center justify-center relative">
            <motion.div
              animate={
                animationPhase === 'impact'
                  ? {
                      scale: [1.2, 2.5, 1.2],
                      rotate: [0, 180, 360],
                    }
                  : animationPhase === 'clash'
                  ? {
                      scale: [1, 1.8, 1.3],
                      rotate: [0, 10, -10, 0],
                    }
                  : animationPhase === 'approach'
                  ? {
                      scale: [1, 1.3, 1.2],
                      opacity: [1, 0.8, 1],
                    }
                  : {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }
              }
              transition={{
                duration:
                  animationPhase === 'impact' ? 0.8 :
                  animationPhase === 'clash' ? 2.0 :
                  animationPhase === 'approach' ? 1.5 :
                  2.0,
                repeat: animationPhase === 'idle' ? Infinity : 0,
              }}
            >
              <PixelText variant="h1" shadow className="text-pixel-hot-pink">
                VS
              </PixelText>
            </motion.div>

            {/* Impact Flash Effect */}
            <AnimatePresence>
              {animationPhase === 'impact' && (
                <motion.div
                  className="absolute inset-0 bg-white/60 rounded-full blur-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 3, opacity: [0, 1, 0] }}
                  exit={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Agent 2 */}
          <PixelCard className={`border-pixel-pink ${battle.winner === agent2.id ? 'ring-4 ring-pixel-green' : ''}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AgentAvatar
                  agentId={agent2.id}
                  allAgentIds={allAgentIds}
                  size="4xl"
                  animate={getCardGladiatorAnimation(agent2.id)}
                  transition={{
                    duration: 0.3,
                    repeat: !showCenterArena && status === 'in_progress' ? Infinity : 0,
                    delay: !showCenterArena && status === 'in_progress' ? 0.5 : 0,
                  }}
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

        {/* Central Fighting Arena - Absolute positioned overlay */}
        <AnimatePresence>
          {showCenterArena && (
            <motion.div
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Fighting gladiators */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Agent 1 - Left Fighter */}
                <motion.div
                  className="absolute left-[30%]"
                  initial={{ x: -300, opacity: 0, scale: 1.2 }}
                  animate={getCenterGladiatorAnimation(agent1.id, true)}
                  transition={{
                    duration:
                      animationPhase === 'approach' ? 1.2 :  // Step 1: Both approach
                      animationPhase === 'clash' ? 1.5 :      // Step 2: Attacker lunges
                      animationPhase === 'impact' ? 1.0 :     // Step 3: Shake & disappear
                      0.5,
                    type: animationPhase === 'impact' ? 'spring' : 'tween',
                    ease: 'easeInOut',
                    stiffness: 300,
                  }}
                  style={{
                    filter: animationPhase === 'impact' && lastTurnLoser === agent1.id ? 'brightness(0.7)' : 'brightness(1)',
                  }}
                >
                  <AgentAvatar
                    agentId={agent1.id}
                    allAgentIds={allAgentIds}
                    size="6xl"
                  />
                </motion.div>

                {/* Agent 2 - Right Fighter */}
                <motion.div
                  className="absolute right-[30%]"
                  initial={{ x: 300, opacity: 0, scale: 1.2 }}
                  animate={getCenterGladiatorAnimation(agent2.id, false)}
                  transition={{
                    duration:
                      animationPhase === 'approach' ? 1.2 :  // Step 1: Both approach
                      animationPhase === 'clash' ? 1.5 :      // Step 2: Attacker lunges
                      animationPhase === 'impact' ? 1.0 :     // Step 3: Shake & disappear
                      0.5,
                    type: animationPhase === 'impact' ? 'spring' : 'tween',
                    ease: 'easeInOut',
                    stiffness: 300,
                  }}
                  style={{
                    filter: animationPhase === 'impact' && lastTurnLoser === agent2.id ? 'brightness(0.7)' : 'brightness(1)',
                  }}
                >
                  <AgentAvatar
                    agentId={agent2.id}
                    allAgentIds={allAgentIds}
                    size="6xl"
                  />
                </motion.div>

                {/* Impact Effect Lines */}
                <AnimatePresence>
                  {animationPhase === 'impact' && (
                    <>
                      {/* Horizontal impact lines */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={`impact-h-${i}`}
                          className="absolute h-1 bg-white"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 400, opacity: [0, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          style={{
                            top: `${45 + i * 2}%`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        />
                      ))}
                      {/* Radial impact lines */}
                      {[...Array(8)].map((_, i) => {
                        const angle = (i * 360) / 8
                        return (
                          <motion.div
                            key={`impact-rad-${i}`}
                            className="absolute w-2 bg-gradient-to-r from-white to-transparent"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 200, opacity: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            style={{
                              top: '50%',
                              left: '50%',
                              transformOrigin: 'top center',
                              transform: `rotate(${angle}deg) translateX(-50%)`,
                            }}
                          />
                        )
                      })}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
