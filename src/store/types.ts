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
  avatarEmoji?: string
}

// Alias for backwards compatibility
export type Judge = JudgeAgent

// Agent stats from backend
export interface AgentStats {
  attack: number
  defense: number
  speed: number
  charisma: number
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

  // LLM-generated personality (from backend)
  personality?: string
  fightingStyle?: string
  catchphrase?: string
  avatarEmoji?: string
  stats?: AgentStats

  // per-battle stats
  currentBattleHp: number
  maxBattleHp: number

  // overall stats
  currentGlobalHp: number
  maxGlobalHp: number
  position: Position
  status: 'active' | 'battling' | 'eliminated'

  // record
  wins?: number
  losses?: number
}

// Battle types
export interface BattleArgument {
  agentName: string
  argument: string
  timestamp: number
}

export interface JudgeVote {
  judgeId: string
  judgeName: string
  votedForId: string     // agent ID they voted for
  votedForName: string   // agent name they voted for
  rating: number
  reaction: string
  reasoning: string
}

export interface BattleTurn {
  turnNumber: number
  argument1: BattleArgument
  argument2: BattleArgument
  votes: JudgeVote[]
  winnerId?: string
  winnerName?: string
  loserId?: string
  loserName?: string
  damage: number
  wasCritical?: boolean
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

// Round management (TFT-style)
export interface Matchup {
  id: string
  agent1Id: string
  agent2Id: string
  battleId?: string
  status: 'pending' | 'in_progress' | 'completed'
  winnerId?: string
}

export interface Round {
  roundNumber: number
  matchups: Matchup[]
  status: 'pending' | 'in_progress' | 'completed'
  byeAgentId?: string  // agent sitting out this round (odd number)
}

// WebSocket event types (matching backend)
export type WSEventType =
  | 'game_started'
  | 'round_started'
  | 'battle_started'
  | 'turn_started'
  | 'argument_made'
  | 'judges_voted'
  | 'turn_completed'
  | 'battle_ended'
  | 'round_ended'
  | 'agent_eliminated'
  | 'game_ended'
  | 'connection:established'
  | 'error'
  | 'state_sync'

export interface WSEvent<T = unknown> {
  type: WSEventType
  data: T
}

// Specific event data types (matching backend)
export interface GameStartedData {
  gameId: string
  agents: ChoiceAgent[]
  judges: JudgeAgent[]
}

export interface RoundStartedData {
  roundNumber: number
  matchups: Array<{
    id: string
    agent1: ChoiceAgent
    agent2: ChoiceAgent
  }>
  byeAgentId?: string
}

export interface BattleStartedData {
  battleId: string
  agent1: ChoiceAgent
  agent2: ChoiceAgent
}

export interface TurnCompletedData {
  battleId: string
  turn: BattleTurn
}

export interface BattleEndedData {
  battleId: string
  winnerId: string
  winnerName: string
  loserId: string
  loserName: string
  globalHpLost: number  // 25 HP damage to loser's global HP
}

export interface RoundEndedData {
  roundNumber: number
  results: Array<{
    battleId: string
    winnerId: string
    loserId: string
  }>
}

export interface AgentEliminatedData {
  agentId: string
  agentName: string
  rank: number  // final ranking position
}

export interface GameEndedData {
  winnerId: string
  winner: ChoiceAgent
  rankings: Array<{
    rank: number
    agent: ChoiceAgent
    eliminatedRound?: number
  }>
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

// Screen types
export type ScreenType = 'setup' | 'loading' | 'arena' | 'battle' | 'victory'

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

  // Round management (TFT-style)
  currentRound: Round | null
  roundHistory: Round[]
  activeBattles: Battle[]  // for simultaneous battles
  focusedBattleId: string | null  // which battle user is viewing in detail

  // Battle (legacy single battle)
  currentBattle: Battle | null
  battleHistory: Battle[]

  // Results
  winner: ChoiceAgent | null
  rankings: ChoiceAgent[]
  isGameOver: boolean

  // UI State
  currentScreen: ScreenType
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
  setCurrentScreen: (screen: ScreenType) => void

  updateChoiceAgent: (id: string, data: Partial<ChoiceAgent>) => void
  setChoiceAgents: (agents: ChoiceAgent[]) => void
  addEncounter: (encounter: Encounter) => void

  // Round management
  startRound: (round: Round) => void
  updateRound: (data: Partial<Round>) => void
  completeRound: () => void

  // Multi-battle support
  addActiveBattle: (battle: Battle) => void
  updateActiveBattle: (battleId: string, data: Partial<Battle>) => void
  removeActiveBattle: (battleId: string) => void
  setFocusedBattle: (battleId: string | null) => void

  // Legacy single battle (still useful for detail view)
  startBattle: (battle: Battle) => void
  updateBattle: (data: Partial<Battle>) => void
  endBattle: (winner: ChoiceAgent, loser: ChoiceAgent) => void

  setWinner: (winner: ChoiceAgent) => void
  setRankings: (rankings: ChoiceAgent[]) => void

  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}
