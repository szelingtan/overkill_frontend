import { create } from 'zustand'
import type { GameState, Choice, JudgeAgent, ChoiceAgent, Battle, Encounter } from './types'

const initialState = {
  context: '',
  choices: [],
  choiceAgents: [],
  judges: [],
  sessionId: null,
  connected: false,
  agents: [],
  arenaSize: { width: 20, height: 15 },
  encounters: [],
  currentBattle: null,
  battleHistory: [],
  winner: null,
  rankings: [],
  isGameOver: false,
  currentScreen: 'setup' as const,
  isLoading: false,
  error: null,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // Setup actions
  setSetupData: (data) =>
    set((state) => ({
      context: data.context ?? state.context,
      choices: data.choices ?? state.choices,
      judges: data.judges ?? state.judges,
    })),

  addChoice: (choice: Choice) =>
    set((state) => ({
      choices: [...state.choices, choice],
    })),

  removeChoice: (id: string) =>
    set((state) => ({
      choices: state.choices.filter((c) => c.id !== id),
    })),

  updateChoice: (id: string, data: Partial<Choice>) =>
    set((state) => ({
      choices: state.choices.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),

  addJudge: (judge: JudgeAgent) =>
    set((state) => ({
      judges: [...state.judges, judge],
    })),

  removeJudge: (id: string) =>
    set((state) => ({
      judges: state.judges.filter((j) => j.id !== id),
    })),

  updateJudge: (id: string, data: Partial<JudgeAgent>) =>
    set((state) => ({
      judges: state.judges.map((j) =>
        j.id === id ? { ...j, ...data } : j
      ),
    })),

  // Session actions
  setSessionId: (id: string) => set({ sessionId: id }),
  setConnected: (connected: boolean) => set({ connected }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  // Agent actions
  updateChoiceAgent: (id: string, data: Partial<ChoiceAgent>) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),

  setChoiceAgents: (agents: ChoiceAgent[]) => set({ agents }),

  addEncounter: (encounter: Encounter) =>
    set((state) => ({
      encounters: [...state.encounters, encounter],
    })),

  // Battle actions
  startBattle: (battle: Battle) =>
    set({
      currentBattle: battle,
      currentScreen: 'battle',
    }),

  updateBattle: (data: Partial<Battle>) =>
    set((state) => ({
      currentBattle: state.currentBattle
        ? { ...state.currentBattle, ...data }
        : null,
    })),

  endBattle: (winner: ChoiceAgent, loser: ChoiceAgent) =>
    set((state) => ({
      currentBattle: state.currentBattle
        ? { ...state.currentBattle, winner: winner.id, loser: loser.id, status: 'ended' }
        : null,
      battleHistory: state.currentBattle
        ? [...state.battleHistory, { ...state.currentBattle, winner: winner.id, loser: loser.id, status: 'ended' as const }]
        : state.battleHistory,
      currentScreen: 'arena',
    })),

  // Results actions
  setWinner: (winner: ChoiceAgent) =>
    set({
      winner,
      isGameOver: true,
      currentScreen: 'victory',
    }),

  setRankings: (rankings: ChoiceAgent[]) => set({ rankings }),

  // UI actions
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Reset
  reset: () => set(initialState),
}))
