import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { api } from '../../services/api'
import { PixelButton, PixelCard, PixelText, LoadingSpinner } from '../common'
import { ChoiceInput } from './ChoiceInput'
import { JudgeConfig } from './JudgeConfig'

export const GameSetup = () => {
  const navigate = useNavigate()
  const {
    context,
    choices,
    judges,
    setSetupData,
    addChoice,
    removeChoice,
    updateChoice,
    addJudge,
    removeJudge,
    setSessionId,
    setCurrentScreen,
    sessionId,
    currentScreen,
  } = useGameStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Navigate to arena when session is created and screen is set to arena
  useEffect(() => {
    if (sessionId && currentScreen === 'arena') {
      navigate('/arena')
    }
  }, [sessionId, currentScreen, navigate])

  const handleContextChange = (value: string) => {
    setSetupData({ context: value })
  }

  const canStartGame = () => {
    return (
      choices.length >= 2 &&
      judges.length >= 1 &&
      context.trim() !== ''
    )
  }

  const handleStartGame = async () => {
    if (!canStartGame()) return

    setIsLoading(true)
    setError(null)

    try {
      // Create game session
      const response = await api.createGame({
        context,
        choices,
        judges,
      })

      console.log(response);

      // Store session ID and set screen
      setSessionId(response.game_id)
      setCurrentScreen('arena')

      // Navigation will happen via useEffect when state updates
    } catch (err) {
      console.error('Failed to create game:', err)
      setError('Failed to start game. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 py-16 relative overflow-hidden">
      <motion.div
        className="w-full max-w-4xl space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <img
              src="/overkill_logo.png"
              alt="OVERKILL"
              className="w-72 h-72 mx-auto drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 40px rgba(212, 181, 255, 0.3))' }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <PixelText variant="h3" className="text-pixel-cream">
              Battle Royale Decision Maker
            </PixelText>
            <PixelText variant="small" className="text-pixel-gray mt-2">
              Overkill your overthinking
            </PixelText>
            <PixelText variant="small" className="text-pixel-pink mt-1">
              By watching AI agents battle your decisions out!
            </PixelText>
          </motion.div>
        </div>

        {/* Background Input */}
        <PixelCard animate>
          <div className="space-y-3">
            <label className="text-md-pixel text-pixel-pink">
              Decision Background
            </label>
            <textarea
              value={context}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder="What are you trying to decide? Provide context..."
              rows={4}
              className="w-full bg-pixel-darker text-pixel-cream border-2 border-pixel-light-purple p-3 text-sm-pixel font-pixel resize-none focus:border-pixel-pink outline-none placeholder:text-pixel-gray"
            />
            <p className="text-xs-pixel text-pixel-gray">
              Example: "I need to choose a restaurant for dinner with friends.
              Budget is $20 per person. Looking for good vibes!"
            </p>
          </div>
        </PixelCard>

        {/* Choices */}
        <PixelCard animate>
          <ChoiceInput
            choices={choices}
            onAdd={addChoice}
            onRemove={removeChoice}
            onUpdate={updateChoice}
          />
        </PixelCard>

        {/* Judges */}
        <PixelCard animate>
          <JudgeConfig
            judges={judges}
            onAdd={addJudge}
            onRemove={removeJudge}
          />
        </PixelCard>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <PixelCard className="border-pixel-red bg-pixel-red/20">
              <PixelText variant="body" className="text-pixel-red">
                {error}
              </PixelText>
            </PixelCard>
          </motion.div>
        )}

        {/* Start Button */}
        <div className="flex justify-center">
          {isLoading ? (
            <LoadingSpinner text="STARTING BATTLE..." />
          ) : (
            <PixelButton
              onClick={handleStartGame}
              disabled={!canStartGame()}
              size="lg"
              variant="primary"
              className="px-12"
            >
              START BATTLE!
            </PixelButton>
          )}
        </div>

        {/* Instructions */}
        {!canStartGame() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <PixelText variant="small" className="text-pixel-gray">
              {choices.length < 2 && '⚠ Add at least 2 choices\n'}
              {judges.length < 1 && '⚠ Select at least 1 judge\n'}
              {!context.trim() && '⚠ Provide decision background\n'}
            </PixelText>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
