import { flattenGameSetupData } from '@/util/flatten'
import type { GameSetupData } from '../store/types'

const API_BASE_URL = 'http://localhost:8000/api'

export interface ChoiceAgentInitResponse {
  // identity
  id: string
  game_id: string
  name: string
  catchphrase: string
  personality: string
  fighting_style: string
  avatar_emoji: string

  // stats
  battle_hp: number
  max_battle_hp: number
  global_hp: number
  max_global_hp: number

  // meta-stats
  losses: number
}

export interface JudgeAgentInitResponse {
  // identity
  id: string
  game_id: string
  avatar_emoji: string
  name: string
  bias_keywords: string[]
  custom_prompt: string | null
  personality: string
  personality_type: string
  scoring_style: string
  is_custom?: boolean
}

export interface CreateGameResponse {
  game_id: string
  status: string
  agents: ChoiceAgentInitResponse[]
  judges: JudgeAgentInitResponse[]
}

export const api = {
  async createGame(setupData: GameSetupData): Promise<CreateGameResponse> {
    const response = await fetch(`${API_BASE_URL}/game/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flattenGameSetupData(setupData)),
    })

    if (!response.ok) {
      throw new Error(`Failed to create game: ${response.statusText}`)
    }

    return response.json()
  },

  async startGame(sessionId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/game/${sessionId}/start`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Failed to start game: ${response.statusText}`)
    }
  },

  async getGameState(sessionId: string): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/game/${sessionId}/state`)

    if (!response.ok) {
      throw new Error(`Failed to get game state: ${response.statusText}`)
    }

    return response.json()
  },
}
