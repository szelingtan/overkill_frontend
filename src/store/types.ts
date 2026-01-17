// Position in the arena grid
export interface Position {
  x: number
  y: number
}

// Judge types and configuration
export type JudgePersonality = 'funny' | 'sarcastic' | 'nerd' | 'serious' | 'custom'

export interface Judge {
  id: string
  name: string
  personality: JudgePersonality
  customPrompt?: string
  avatar?: string
}

// Choice/Agent types
export interface Choice {
  id: string
  description: string
  name?: string
}

export interface Agent {
  id: string
  choiceId: string
  name: string
  description: string
  position: Position
  hp: number
  maxHp: number
  globalHp: number
  maxGlobalHp: number
  status: 'active' | 'battling' | 'eliminated'
  color: string
  sprite?: string
}

// Battle types
export interface BattleArgument {
  agentId: string
  agentName: string
  argument: string
  timestamp: number
}

export interface JudgeVote {
  judgeId: string
  judgeName: string
  votedFor: string
  reaction: string
  reasoning: string
}

export interface BattleTurn {
  turnNumber: number
  arguments: BattleArgument[]
  votes: JudgeVote[]
  damage: number
  loser: string
}

export interface Battle {
  id: string
  agent1: Agent
  agent2: Agent
  turns: BattleTurn[]
  currentTurn: number
  winner?: string
  loser?: string
  status: 'in_progress' | 'ended'
}

// Encounter types
export interface Encounter {
  id: string
  agent1Id: string
  agent2Id: string
  position: Position
  timestamp: number
}

// WebSocket event types
export type WSEventType =
  | 'game:started'
  | 'agent:moved'
  | 'agent:spawned'
  | 'encounter:started'
  | 'battle:turn'
  | 'battle:damage'
  | 'battle:ended'
  | 'agent:eliminated'
  | 'game:finished'
  | 'connection:established'
  | 'error'

export interface WSEvent<T = unknown> {
  type: WSEventType
  data: T
}

// Specific event data types
export interface GameStartedData {
  sessionId: string
  agents: Agent[]
  arenaSize: { width: number; height: number }
}

export interface AgentMovedData {
  agentId: string
  from: Position
  to: Position
}

export interface AgentSpawnedData {
  agent: Agent
}

export interface EncounterStartedData {
  encounter: Encounter
  agent1: Agent
  agent2: Agent
}

export interface BattleTurnData {
  battleId: string
  turn: BattleTurn
}

export interface BattleDamageData {
  battleId: string
  agentId: string
  damage: number
  newHp: number
}

export interface BattleEndedData {
  battleId: string
  winner: Agent
  loser: Agent
}

export interface AgentEliminatedData {
  agentId: string
  eliminatedBy?: string
}

export interface GameFinishedData {
  winner: Agent
  rankings: Agent[]
  totalBattles: number
}

// Game setup types
export interface GameSetupData {
  background: string
  choices: Choice[]
  judges: Judge[]
}

// Animation types
export interface DamageAnimation {
  id: string
  agentId: string
  damage: number
  position: Position
  timestamp: number
}

// Game state types
export interface GameState {
  // Setup
  background: string
  choices: Choice[]
  judges: Judge[]

  // Session
  sessionId: string | null
  connected: boolean

  // Arena
  agents: Agent[]
  arenaSize: { width: number; height: number }
  encounters: Encounter[]

  // Battle
  currentBattle: Battle | null
  battleHistory: Battle[]

  // Results
  winner: Agent | null
  rankings: Agent[]
  isGameOver: boolean

  // UI State
  currentScreen: 'setup' | 'arena' | 'battle' | 'victory'
  isLoading: boolean
  error: string | null

  // Actions
  setSetupData: (data: Partial<GameSetupData>) => void
  addChoice: (choice: Choice) => void
  removeChoice: (id: string) => void
  updateChoice: (id: string, data: Partial<Choice>) => void
  addJudge: (judge: Judge) => void
  removeJudge: (id: string) => void
  updateJudge: (id: string, data: Partial<Judge>) => void

  setSessionId: (id: string) => void
  setConnected: (connected: boolean) => void
  setCurrentScreen: (screen: 'setup' | 'arena' | 'battle' | 'victory') => void

  updateAgent: (id: string, data: Partial<Agent>) => void
  setAgents: (agents: Agent[]) => void
  addEncounter: (encounter: Encounter) => void

  startBattle: (battle: Battle) => void
  updateBattle: (data: Partial<Battle>) => void
  endBattle: (winner: Agent, loser: Agent) => void

  setWinner: (winner: Agent) => void
  setRankings: (rankings: Agent[]) => void

  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}
