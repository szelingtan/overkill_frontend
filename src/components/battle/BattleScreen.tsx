import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { PixelText, HPBar, PixelCard } from '../common'
import { BattleDialog } from './BattleDialog'
import { ArgumentDisplay } from './ArgumentDisplay'
import { JudgePanel } from './JudgePanel'
import { DamageAnimation } from './DamageAnimation'
import { BattleLog } from './BattleLog'

export const BattleScreen = () => {
  const navigate = useNavigate()
  const { currentBattle, currentScreen } = useGameStore()
  const [showDamage, setShowDamage] = useState(false)
  const [currentTurnIndex, setCurrentTurnIndex] = useState(-1)

  useEffect(() => {
    // Navigate back to arena when battle ends
    if (currentScreen === 'arena') {
      navigate('/arena')
    }
  }, [currentScreen, navigate])

  useEffect(() => {
    // Update current turn index when new turns arrive
    if (currentBattle && currentBattle.turns.length > 0) {
      const latestTurnIndex = currentBattle.turns.length - 1
      if (latestTurnIndex > currentTurnIndex) {
        setCurrentTurnIndex(latestTurnIndex)
        setShowDamage(false)
        // Show damage animation after a delay
        setTimeout(() => setShowDamage(true), 2000)
      }
    }
  }, [currentBattle, currentTurnIndex])

  if (!currentBattle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelText variant="h2" className="text-pixel-red">
          No battle in progress
        </PixelText>
      </div>
    )
  }

  const { agent1, agent2, turns } = currentBattle
  const currentTurn = currentTurnIndex >= 0 ? turns[currentTurnIndex] : null

  return (
    <div className="min-h-screen p-8">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Battle Title */}
        <div className="text-center">
          <PixelText variant="h2" shadow className="text-pixel-hot-pink mb-2">
            BATTLE!
          </PixelText>
          <PixelText variant="body" className="text-pixel-cream">
            Turn {currentBattle.currentTurn + 1}
          </PixelText>
        </div>

        {/* Combatants Display */}
        <div className="grid grid-cols-3 gap-8 items-center">
          {/* Agent 1 */}
          <div className="space-y-4">
            <PixelCard className="border-pixel-light-blue">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 border-4 border-black"
                    style={{ backgroundColor: agent1.color }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <PixelText variant="body" className="text-pixel-cream">
                    {agent1.name}
                  </PixelText>
                </div>
                <HPBar
                  current={agent1.hp}
                  max={agent1.maxHp}
                  label="HP"
                  size="lg"
                  showNumbers={true}
                />
              </div>
            </PixelCard>
          </div>

          {/* VS */}
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <PixelText variant="h1" shadow className="text-pixel-hot-pink">
                VS
              </PixelText>
            </motion.div>
          </div>

          {/* Agent 2 */}
          <div className="space-y-4">
            <PixelCard className="border-pixel-pink">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 border-4 border-black"
                    style={{ backgroundColor: agent2.color }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <PixelText variant="body" className="text-pixel-cream">
                    {agent2.name}
                  </PixelText>
                </div>
                <HPBar
                  current={agent2.hp}
                  max={agent2.maxHp}
                  label="HP"
                  size="lg"
                  showNumbers={true}
                />
              </div>
            </PixelCard>
          </div>
        </div>

        {/* Arguments */}
        {currentTurn && currentTurn.arguments.length > 0 && (
          <div className="grid grid-cols-2 gap-8">
            {currentTurn.arguments.map((arg, index) => (
              <ArgumentDisplay
                key={arg.agentId}
                argument={arg}
                side={index === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        )}

        {/* Judge Votes */}
        {currentTurn && currentTurn.votes.length > 0 && (
          <div>
            <JudgePanel votes={currentTurn.votes} />
          </div>
        )}

        {/* Damage Animation */}
        {showDamage && currentTurn && (
          <div className="flex justify-center relative">
            <DamageAnimation
              damage={currentTurn.damage}
              onComplete={() => setShowDamage(false)}
            />
          </div>
        )}

        {/* Battle Dialog */}
        {currentTurn && (
          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <BattleDialog
                text={`${currentTurn.loser} takes ${Math.floor(currentTurn.damage)} damage!`}
                speaker="ANNOUNCER"
              />
            </div>
          </div>
        )}

        {/* Battle Log */}
        {turns.length > 0 && (
          <div>
            <BattleLog turns={turns} />
          </div>
        )}
      </motion.div>
    </div>
  )
}
