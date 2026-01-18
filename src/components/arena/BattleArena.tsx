import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { AgentAvatar } from '../common/AgentAvatar'
import { RoundOverview } from './RoundOverview'
import { BattleGrid } from './BattleGrid'
import { ArenaHUD } from './ArenaHUD'
import { PixelText, PixelButton, LoadingSpinner } from '../common'
import { getChoiceName } from '@/util/flatten'

export const BattleArena = () => {
  const navigate = useNavigate()
  const {
    agents,
    connected,
    currentScreen,
    currentRound,
    roundHistory,
    activeBattles,
    focusedBattleId,
    setFocusedBattle,
    setCurrentScreen,
  } = useGameStore()

  const allAgentIds = agents.map(a => a.id)

  // Navigate to battle detail view when a battle is focused
  useEffect(() => {
    if (currentScreen === 'battle' && focusedBattleId) {
      navigate('/battle')
    }
  }, [currentScreen, focusedBattleId, navigate])

  // Navigate to victory when game ends
  useEffect(() => {
    if (currentScreen === 'victory') {
      navigate('/victory')
    }
  }, [currentScreen, navigate])

  // Compute alive and eliminated agents
  const { aliveAgents, eliminatedAgents, byeAgent } = useMemo(() => {
    const alive = agents.filter((a) => a.status !== 'eliminated')
    const eliminated = agents.filter((a) => a.status === 'eliminated')
    const bye = currentRound?.byeAgentId
      ? agents.find((a) => a.id === currentRound.byeAgentId)
      : null
    return { aliveAgents: alive, eliminatedAgents: eliminated, byeAgent: bye }
  }, [agents, currentRound])

  const handleSelectBattle = (battleId: string) => {
    setFocusedBattle(battleId)
    setCurrentScreen('battle')
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="CONNECTING TO SERVER..." size="lg" />
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="WAITING FOR GLADIATORS..." size="lg" />
      </div>
    )
  }

  // Waiting for round to start
  const waitingForRound = !currentRound && activeBattles.length === 0

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pixel-pink/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pixel-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Logo */}
        <div className="text-center mb-4">
          <motion.img
            src="/overkill_logo.png"
            alt="OVERKILL"
            className="w-24 h-24 mx-auto"
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(212, 181, 255, 0.4))',
                'drop-shadow(0 0 20px rgba(255, 141, 199, 0.6))',
                'drop-shadow(0 0 10px rgba(212, 181, 255, 0.4))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Round Overview */}
        <RoundOverview
          round={currentRound}
          roundHistory={roundHistory}
          aliveAgents={aliveAgents}
          eliminatedAgents={eliminatedAgents}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Battle Area */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {waitingForRound ? (
                <motion.div
                  key="waiting"
                  className="flex flex-col items-center justify-center h-full py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <PixelText variant="h2" className="text-pixel-pink mb-4">
                      Preparing Next Round...
                    </PixelText>
                  </motion.div>
                  <LoadingSpinner />

                  {/* Agent preview while waiting */}
                  <div className="mt-8 flex justify-center gap-3 flex-wrap">
                    {aliveAgents.map((agent, i) => (
                      <motion.div
                        key={agent.id}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <AgentAvatar
                          agentId={agent.id}
                          allAgentIds={allAgentIds}
                          size="3xl"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <PixelText variant="small" className="text-pixel-cream">
                          {getChoiceName(agent.name)}
                        </PixelText>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="battles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BattleGrid
                    battles={activeBattles}
                    byeAgent={byeAgent}
                    onSelectBattle={handleSelectBattle}
                    focusedBattleId={focusedBattleId}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Side HUD */}
          <div className="space-y-4">
            <ArenaHUD agents={agents} />

            {/* Quick Battle Access */}
            {activeBattles.length > 0 && (
              <div className="bg-pixel-dark/80 border-2 border-pixel-purple rounded-lg p-3">
                <PixelText variant="small" className="text-pixel-pink mb-2">
                  Active Battles
                </PixelText>
                <div className="space-y-2">
                  {activeBattles.map((battle) => (
                    <PixelButton
                      key={battle.id}
                      onClick={() => handleSelectBattle(battle.id)}
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                    >
                      {getChoiceName(battle.agent1.name)} vs {getChoiceName(battle.agent2.name)}
                    </PixelButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <PixelText variant="small" className="text-pixel-gray">
            Click any battle to watch the full argument exchange!
          </PixelText>
        </motion.div>
      </motion.div>
    </div>
  )
}
