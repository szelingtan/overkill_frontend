import { flattenGameSetupData } from '@/util/flatten'
import type { GameSetupData } from '../store/types'

const API_BASE_URL = 'http://localhost:8000/api'

export interface CreateGameResponse {
  sessionId: string
  message: string
}

export const api = {
  async createGame(setupData: GameSetupData): Promise<CreateGameResponse> {
    console.log(flattenGameSetupData(setupData));
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
