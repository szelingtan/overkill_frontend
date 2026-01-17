export interface Position {
  x: number
  y: number
}

export type JudgePersonality = 'funny' | 'sarcastic' | 'nerd' | 'serious' | 'custom'
export interface JudgeAgent {
  id: string
  name: string
  personality: JudgePersonality
  customPrompt?: string
  avatar?: string
}

export interface Choice {
  id: string
  name: string
  description?: string
}

export interface ChoiceAgent {
  // identity
  id: string
  name: string
  choice: Choice
  color: string
  sprite?: string
  
  // per-battle stats
  currentBattleHp: number
  maxBattleHp: number

  // overall stats
  currentGlobalHp: number
  maxGlobalHp: number
  position: Position
  status: 'active' | 'battling' | 'eliminated'
}

// Battle types
export interface BattleArgument {
  agentId: string
  opponentId: string
  argument: string
  timestamp: number
}

export interface JudgeVote {
  judgeId: string
  judgeName: string
  rating: number
  reaction: string
  reasoning: string
}

export interface BattleTurn {
  turnNumber: number
  argument1: BattleArgument
  argument2: BattleArgument
  votes: JudgeVote[]
  damage: number
}

export interface Battle {
  id: string
  agent1: ChoiceAgent
  agent2: ChoiceAgent
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
  agents: ChoiceAgent[]
  judges: JudgeAgent[]
  arenaSize: { width: number; height: number }
}

export interface AgentMovedData {
  agentId: string
  from: Position
  to: Position
}

export interface AgentSpawnedData {
  agent: ChoiceAgent
}

export interface EncounterStartedData {
  encounter: Encounter
  agent1: ChoiceAgent
  agent2: ChoiceAgent
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
  winner: ChoiceAgent
  loser: ChoiceAgent
}

export interface AgentEliminatedData {
  agentId: string
  eliminatedBy?: string
}

export interface GameFinishedData {
  winner: ChoiceAgent
  rankings: ChoiceAgent[]
  totalBattles: number
}

// Game setup types
export interface GameSetupData {
  judges: JudgeAgent[]
  choices: Choice[]
  context: string
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
  context: string
  choices: Choice[] // before backend setup of agents
  choiceAgents: ChoiceAgent[] // after backend setup
  judges: JudgeAgent[]

  // Session
  sessionId: string | null
  connected: boolean

  // Arena
  agents: ChoiceAgent[]
  arenaSize: { width: number; height: number }
  encounters: Encounter[]

  // Battle
  currentBattle: Battle | null
  battleHistory: Battle[]

  // Results
  winner: ChoiceAgent | null
  rankings: ChoiceAgent[]
  isGameOver: boolean

  // UI State
  currentScreen: 'setup' | 'arena' | 'battle' | 'victory'
  isLoading: boolean
  error: string | null

  // Initialisation
  setSetupData: (data: Partial<GameSetupData>) => void

  // just name and description here - need backend to generate personality
  addChoice: (choice: Choice) => void
  removeChoice: (id: string) => void
  updateChoice: (id: string, data: Partial<Choice>) => void

  // can use full judge agent descriptions here since they are preset
  addJudge: (judge: JudgeAgent) => void
  removeJudge: (id: string) => void
  updateJudge: (id: string, data: Partial<JudgeAgent>) => void

  setSessionId: (id: string) => void
  setConnected: (connected: boolean) => void
  setCurrentScreen: (screen: 'setup' | 'arena' | 'battle' | 'victory') => void

  updateChoiceAgent: (id: string, data: Partial<ChoiceAgent>) => void
  setChoiceAgents: (agents: ChoiceAgent[]) => void
  addEncounter: (encounter: Encounter) => void

  startBattle: (battle: Battle) => void
  updateBattle: (data: Partial<Battle>) => void
  endBattle: (winner: ChoiceAgent, loser: ChoiceAgent) => void

  setWinner: (winner: ChoiceAgent) => void
  setRankings: (rankings: ChoiceAgent[]) => void

  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}
