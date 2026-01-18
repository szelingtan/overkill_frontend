import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { api, type ChoiceAgentInitResponse, type JudgeAgentInitResponse } from '../../services/api'
import { PixelButton, PixelCard, PixelText, LoadingSpinner } from '../common'
import { ChoiceInput } from './ChoiceInput'
import { JudgeConfig } from './JudgeConfig'
import type { ChoiceAgent, JudgeAgent as JudgeAgentType, Choice, JudgePersonality } from '../../store/types'

// Test data for random fill
const TEST_SCENARIOS = [
  {
    context: "I need to choose what to have for dinner tonight. I'm feeling hungry but can't decide between something quick and easy or something more elaborate. Budget is around $15-20.",
    choices: [
      { name: "Pizza", description: "Classic comfort food, quick delivery" },
      { name: "Sushi", description: "Fresh and healthy, but pricier" },
      { name: "Tacos", description: "Fun and customizable" },
      { name: "Pasta", description: "Hearty and filling" },
    ],
  },
  {
    context: "Planning a weekend trip with friends. We have 2 days and want something fun and memorable. Budget is flexible but prefer not to break the bank.",
    choices: [
      { name: "Beach Getaway", description: "Relaxing by the ocean" },
      { name: "Mountain Hiking", description: "Adventure and nature" },
      { name: "City Exploration", description: "Food, culture, and nightlife" },
    ],
  },
  {
    context: "Need to pick a new TV show to binge watch. I have a week off and want something engaging that I can't stop watching.",
    choices: [
      { name: "Breaking Bad", description: "Intense drama about a chemistry teacher" },
      { name: "The Office", description: "Lighthearted workplace comedy" },
      { name: "Game of Thrones", description: "Epic fantasy adventure" },
      { name: "Stranger Things", description: "Nostalgic sci-fi horror" },
      { name: "Ted Lasso", description: "Feel-good sports comedy" },
    ],
  },
  {
    context: "Deciding on a new hobby to pick up. I have some free time on weekends and want something fulfilling and social.",
    choices: [
      { name: "Photography", description: "Capture beautiful moments" },
      { name: "Rock Climbing", description: "Physical challenge and community" },
      { name: "Cooking Classes", description: "Learn new cuisines" },
      { name: "Board Gaming", description: "Strategy and social fun" },
    ],
  },
  {
    context: "Choosing a programming language to learn next. I already know JavaScript and want to expand my skills for career growth.",
    choices: [
      { name: "Python", description: "Versatile, great for AI/ML" },
      { name: "Rust", description: "Fast and safe systems programming" },
      { name: "Go", description: "Simple and great for backend" },
      { name: "TypeScript", description: "Level up my JS skills" },
    ],
  },
]

const JUDGE_PRESETS: Array<{ personality: JudgePersonality; name: string }> = [
  { personality: 'funny', name: 'The Comedian' },
  { personality: 'sarcastic', name: 'The Roaster' },
  { personality: 'nerd', name: 'The Professor' },
  { personality: 'serious', name: 'The Judge' },
]

// Transform API response to store format
const transformAgent = (apiAgent: ChoiceAgentInitResponse, choice: Choice): ChoiceAgent => ({
  id: apiAgent.id,
  name: apiAgent.name,
  choice: choice,
  color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  personality: apiAgent.personality,
  fightingStyle: apiAgent.fighting_style,
  catchphrase: apiAgent.catchphrase,
  avatarEmoji: apiAgent.avatar_emoji,
  currentBattleHp: apiAgent.battle_hp,
  maxBattleHp: apiAgent.max_battle_hp,
  currentGlobalHp: apiAgent.global_hp,
  maxGlobalHp: apiAgent.max_global_hp,
  position: { x: 0, y: 0 },
  status: 'active',
  wins: 0,
  losses: apiAgent.losses,
})

const transformJudge = (apiJudge: JudgeAgentInitResponse): JudgeAgentType => ({
  id: apiJudge.id,
  name: apiJudge.name,
  personality: apiJudge.personality_type as JudgeAgentType['personality'],
  customPrompt: apiJudge.custom_prompt || undefined,
  avatarEmoji: apiJudge.avatar_emoji,
})

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
    setChoiceAgents,
    sessionId,
    currentScreen,
  } = useGameStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Navigate to loading screen when session is created
  useEffect(() => {
    if (sessionId && currentScreen === 'loading') {
      navigate('/loading')
    }
  }, [sessionId, currentScreen, navigate])

  const handleContextChange = (value: string) => {
    setSetupData({ context: value })
  }

  const handleRandomFill = () => {
    // Pick a random scenario
    const scenario = TEST_SCENARIOS[Math.floor(Math.random() * TEST_SCENARIOS.length)]
    
    // Clear existing choices and judges
    choices.forEach((c) => removeChoice(c.id))
    judges.forEach((j) => removeJudge(j.id))
    
    // Set the context
    setSetupData({ context: scenario.context })
    
    // Add choices
    scenario.choices.forEach((choice) => {
      addChoice({
        id: `choice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: choice.name,
        description: choice.description,
      })
    })
    
    // Add 2-3 random judges
    const numJudges = Math.floor(Math.random() * 2) + 2 // 2 or 3 judges
    const shuffledJudges = [...JUDGE_PRESETS].sort(() => Math.random() - 0.5)
    shuffledJudges.slice(0, numJudges).forEach((judge) => {
      addJudge({
        id: `judge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: judge.name,
        personality: judge.personality,
      })
    })
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

      // Store session ID
      setSessionId(response.game_id)

      // Transform and store generated agents
      const transformedAgents = response.agents.map((apiAgent) => {
        // Find the matching choice by name
        const choice = choices.find((c) => c.name === apiAgent.name) || {
          id: apiAgent.id,
          name: apiAgent.name,
        }
        return transformAgent(apiAgent, choice)
      })
      setChoiceAgents(transformedAgents)

      // Transform and store judges (update with backend-generated data)
      const transformedJudges = response.judges.map(transformJudge)
      setSetupData({ judges: transformedJudges })

      // Navigate to loading screen (will start game from there)
      setCurrentScreen('loading')

    } catch (err) {
      console.error('Failed to create game:', err)
      setError('Failed to create game. Make sure the backend is running.')
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
            
            {/* Random Fill Button for Testing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <PixelButton
                onClick={handleRandomFill}
                size="sm"
                variant="secondary"
                className="text-xs"
              >
                Random Fill (Testing)
              </PixelButton>
            </motion.div>
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
            <LoadingSpinner text="GENERATING GLADIATORS..." />
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
