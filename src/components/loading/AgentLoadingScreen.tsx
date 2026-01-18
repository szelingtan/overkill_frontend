import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { api } from '../../services/api'
import { PixelText, PixelButton, LoadingSpinner } from '../common'
import { AgentAvatar } from '../common/AgentAvatar'
import { AgentRevealCard } from './AgentRevealCard'
import { JudgeRevealCard } from './JudgeRevealCard'
import { getChoiceName } from '@/util/flatten'

export const AgentLoadingScreen = () => {
  const navigate = useNavigate()
  const {
    agents,
    judges,
    sessionId,
    setCurrentScreen,
  } = useGameStore()

  const [phase, setPhase] = useState<'intro' | 'agents' | 'judges' | 'ready'>('intro')
  const [revealedAgents, setRevealedAgents] = useState<Set<number>>(new Set())
  const [revealedJudges, setRevealedJudges] = useState<Set<number>>(new Set())
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(3)
  const isNavigatingRef = useRef(false) // Synchronous guard against rapid clicks

  // Redirect if no session (check both Zustand and sessionStorage)
  useEffect(() => {
    const hasValidSession = sessionId || sessionStorage.getItem('gameSessionId')
    if (!hasValidSession) {
      navigate('/')
    }
  }, [sessionId, navigate])

  // Phase transitions
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('agents'), 2000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Reveal agents one by one
  useEffect(() => {
    if (phase === 'agents' && agents.length > 0) {
      const revealNext = () => {
        setRevealedAgents((prev) => {
          const next = new Set(prev)
          if (next.size < agents.length) {
            next.add(next.size)
          }
          return next
        })
      }

      // Start revealing after a short delay
      const initialDelay = setTimeout(revealNext, 500)

      // Reveal each agent
      const intervals: ReturnType<typeof setTimeout>[] = []
      for (let i = 1; i < agents.length; i++) {
        intervals.push(setTimeout(revealNext, 500 + i * 800))
      }

      // Move to judges phase after all agents revealed
      const judgesTimer = setTimeout(() => {
        setPhase('judges')
      }, 500 + agents.length * 800 + 1500)

      return () => {
        clearTimeout(initialDelay)
        clearTimeout(judgesTimer)
        intervals.forEach(clearTimeout)
      }
    }
  }, [phase, agents.length])

  // Reveal judges one by one
  useEffect(() => {
    if (phase === 'judges' && judges.length > 0) {
      const revealNext = () => {
        setRevealedJudges((prev) => {
          const next = new Set(prev)
          if (next.size < judges.length) {
            next.add(next.size)
          }
          return next
        })
      }

      // Reveal each judge
      const intervals: ReturnType<typeof setTimeout>[] = [setTimeout(revealNext, 300)]
      for (let i = 1; i < judges.length; i++) {
        intervals.push(setTimeout(revealNext, 300 + i * 400))
      }

      // Move to ready phase
      const readyTimer = setTimeout(() => {
        setPhase('ready')
      }, 300 + judges.length * 400 + 1000)

      return () => {
        clearTimeout(readyTimer)
        intervals.forEach(clearTimeout)
      }
    }
  }, [phase, judges.length])

  // Countdown timer for "Enter Arena" button
  useEffect(() => {
    if (phase === 'ready' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, countdown])

  const handleEnterArena = async () => {
    // Synchronous guard - refs update immediately, preventing rapid clicks
    if (!sessionId || isNavigatingRef.current) return
    isNavigatingRef.current = true

    setIsStarting(true)
    setError(null)

    try {
      // Start the game (triggers WebSocket events)
      await api.startGame(sessionId)

      // Navigate to arena
      setCurrentScreen('arena')
      navigate('/arena')
    } catch (err) {
      console.error('Failed to start game:', err)
      setError('Failed to start game. Please try again.')
      setIsStarting(false)
      isNavigatingRef.current = false // Reset on error so user can retry
    }
  }

  // Check both Zustand and sessionStorage for valid session
  const hasValidSession = sessionId || sessionStorage.getItem('gameSessionId')
  if (!hasValidSession) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pixel-pink/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pixel-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    '0 0 20px rgba(212, 181, 255, 0.5)',
                    '0 0 40px rgba(255, 141, 199, 0.8)',
                    '0 0 20px rgba(212, 181, 255, 0.5)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <PixelText variant="h1" shadow className="text-pixel-hot-pink">
                  GENERATING GLADIATORS...
                </PixelText>
              </motion.div>
              <LoadingSpinner className="mt-8" />
            </motion.div>
          )}

          {/* Agents Phase */}
          {phase === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center mb-8"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <PixelText variant="h2" shadow className="text-pixel-blue">
                  YOUR CHAMPIONS
                </PixelText>
                <PixelText variant="body" className="text-pixel-cream mt-2">
                  {agents.length} gladiators enter the arena
                </PixelText>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {agents.map((agent, index) => (
                  <AgentRevealCard
                    key={agent.id}
                    agent={agent}
                    index={index}
                    isRevealed={revealedAgents.has(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Judges Phase */}
          {phase === 'judges' && (
            <motion.div
              key="judges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center mb-8"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <PixelText variant="h2" shadow className="text-pixel-pink">
                  THE JUDGES
                </PixelText>
                <PixelText variant="body" className="text-pixel-cream mt-2">
                  They will determine the fate of your choices
                </PixelText>
              </motion.div>

              {/* Show agents in background (smaller) */}
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-8 opacity-50">
                {agents.map((agent, idx) => (
                  <div key={agent.id} className="text-center flex flex-col items-center">
                    <AgentAvatar index={idx} size="2xl" />
                    <PixelText variant="small" className="text-pixel-cream truncate">
                      {getChoiceName(agent.name)}
                    </PixelText>
                  </div>
                ))}
              </div>

              {/* Judges */}
              <div className="flex justify-center gap-4 flex-wrap">
                {judges.map((judge, index) => (
                  <JudgeRevealCard
                    key={judge.id}
                    judge={judge}
                    index={index}
                    isRevealed={revealedJudges.has(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Ready Phase */}
          {phase === 'ready' && (
            <motion.div
              key="ready"
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PixelText variant="h1" shadow className="text-pixel-hot-pink mb-4">
                  READY TO BATTLE!
                </PixelText>
              </motion.div>

              {/* Summary */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <PixelText variant="h2" className="text-pixel-blue">
                    {agents.length}
                  </PixelText>
                  <PixelText variant="small" className="text-pixel-cream">
                    Gladiators
                  </PixelText>
                </div>
                <div className="text-center">
                  <PixelText variant="h2" className="text-pixel-pink">
                    {judges.length}
                  </PixelText>
                  <PixelText variant="small" className="text-pixel-cream">
                    Judges
                  </PixelText>
                </div>
              </div>

              {/* Mini agent display */}
              <div className="flex justify-center gap-2 flex-wrap mb-8">
                {agents.map((agent, idx) => (
                  <AgentAvatar
                    key={agent.id}
                    index={idx}
                    size="2xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: Math.random() * 0.5 }}
                  />
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4"
                >
                  <PixelText variant="body" className="text-red-400">
                    {error}
                  </PixelText>
                </motion.div>
              )}

              {isStarting ? (
                <LoadingSpinner text="ENTERING ARENA..." />
              ) : countdown > 0 ? (
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block"
                >
                  <PixelText variant="h1" shadow className="text-pixel-hot-pink">
                    {countdown}
                  </PixelText>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(126, 179, 255, 0.5)',
                        '0 0 40px rgba(255, 141, 199, 0.8)',
                        '0 0 20px rgba(126, 179, 255, 0.5)',
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block rounded-lg"
                  >
                    <PixelButton
                      onClick={handleEnterArena}
                      size="lg"
                      variant="primary"
                      className="px-12"
                    >
                      ENTER THE ARENA
                    </PixelButton>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
