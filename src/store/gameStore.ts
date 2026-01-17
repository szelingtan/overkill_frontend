import { create } from 'zustand'
import type { GameState, Choice, Judge, Agent, Battle, Encounter } from './types'

const initialState = {
  background: '',
  choices: [],
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
      background: data.background ?? state.background,
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

  addJudge: (judge: Judge) =>
    set((state) => ({
      judges: [...state.judges, judge],
    })),

  removeJudge: (id: string) =>
    set((state) => ({
      judges: state.judges.filter((j) => j.id !== id),
    })),

  updateJudge: (id: string, data: Partial<Judge>) =>
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
  updateAgent: (id: string, data: Partial<Agent>) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),

  setAgents: (agents: Agent[]) => set({ agents }),

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

  endBattle: (winner: Agent, loser: Agent) =>
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
  setWinner: (winner: Agent) =>
    set({
      winner,
      isGameOver: true,
      currentScreen: 'victory',
    }),

  setRankings: (rankings: Agent[]) => set({ rankings }),

  // UI actions
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Reset
  reset: () => set(initialState),
}))
