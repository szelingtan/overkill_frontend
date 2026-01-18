import { useEffect, useRef } from 'react'
import { WebSocketService } from '../services/websocket'
import { useGameStore } from '../store/gameStore'
import type { ChoiceAgent } from '../store/types'

export const useWebSocket = (sessionId: string | null) => {
  const wsRef = useRef<WebSocketService | null>(null)

  useEffect(() => {
    if (!sessionId) return

    const {
      setConnected,
      setChoiceAgents,
      updateChoiceAgent,
      setCurrentScreen,
      startRound,
      updateRound,
      completeRound,
      addActiveBattle,
      updateActiveBattle,
      removeActiveBattle,
      setWinner,
      setRankings,
      setError,
    } = useGameStore.getState()

    const wsUrl = `ws://localhost:8000/ws/${sessionId}`
    const ws = new WebSocketService(wsUrl)
    wsRef.current = ws

    // Connect to WebSocket
    ws.connect()
      .then(() => {
        setConnected(true)
        console.log('WebSocket connected for session:', sessionId)
      })
      .catch((error) => {
        console.error('Failed to connect to WebSocket:', error)
        setError('Failed to connect to server')
        setConnected(false)
      })

    // Game started - initialize agents (may already be set from API)
    ws.on('game_started', (data) => {
      const gameData = data as GameStartedData
      console.log('Game started:', gameData)
      // Only update if we don't have agents yet
      if (useGameStore.getState().agents.length === 0 && gameData.agents) {
        setChoiceAgents(gameData.agents)
      }
      setCurrentScreen('arena')
    })

    // Round started - set up matchups
    // Backend sends: { round_number, matchups: [{agent1_id, agent1_name, agent2_id, agent2_name}], bye_agent_id }
    ws.on('round_started', (data) => {
      const rawData = data as {
        round_number: number
        round_id: string
        matchups: Array<{
          agent1_id: string
          agent1_name: string
          agent2_id: string
          agent2_name: string
        }>
        bye_agent_id?: string
        bye_agent_name?: string
        total_battles: number
      }
      console.log('Round started:', rawData)

      startRound({
        roundNumber: rawData.round_number,
        matchups: rawData.matchups.map((m, index) => ({
          id: `${rawData.round_id}-${index}`,
          agent1Id: m.agent1_id,
          agent2Id: m.agent2_id,
          status: 'pending',
        })),
        status: 'in_progress',
        byeAgentId: rawData.bye_agent_id,
      })

      // Update agents to battling status
      rawData.matchups.forEach((m) => {
        updateChoiceAgent(m.agent1_id, { status: 'battling' })
        updateChoiceAgent(m.agent2_id, { status: 'battling' })
      })
    })

    // Battle started - add to active battles
    // Backend sends: { battle_id, round_id, round_number, agent1: {...}, agent2: {...} }
    ws.on('battle_started', (data) => {
      const rawData = data as {
        battle_id: string
        round_id: string
        round_number: number
        agent1: {
          id: string
          name: string
          personality?: string
          fighting_style?: string
          catchphrase?: string
          avatar_emoji?: string
          battle_hp: number
          max_battle_hp: number
          global_hp: number
          max_global_hp: number
        }
        agent2: {
          id: string
          name: string
          personality?: string
          fighting_style?: string
          catchphrase?: string
          avatar_emoji?: string
          battle_hp: number
          max_battle_hp: number
          global_hp: number
          max_global_hp: number
        }
      }
      console.log('Battle started:', rawData)

      // Transform snake_case to camelCase for frontend
      const transformAgent = (agent: typeof rawData.agent1): ChoiceAgent => ({
        id: agent.id,
        name: agent.name,
        choice: { id: agent.id, name: agent.name },
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        personality: agent.personality,
        fightingStyle: agent.fighting_style,
        catchphrase: agent.catchphrase,
        avatarEmoji: agent.avatar_emoji,
        currentBattleHp: agent.battle_hp,
        maxBattleHp: agent.max_battle_hp,
        currentGlobalHp: agent.global_hp,
        maxGlobalHp: agent.max_global_hp,
        position: { x: 0, y: 0 },
        status: 'battling',
      })

      addActiveBattle({
        id: rawData.battle_id,
        agent1: transformAgent(rawData.agent1),
        agent2: transformAgent(rawData.agent2),
        turns: [],
        currentTurn: 0,
        status: 'in_progress',
      })

      // Update matchup status
      const currentRound = useGameStore.getState().currentRound
      if (currentRound) {
        const updatedMatchups = currentRound.matchups.map((m) =>
          (m.agent1Id === rawData.agent1.id && m.agent2Id === rawData.agent2.id) ||
          (m.agent1Id === rawData.agent2.id && m.agent2Id === rawData.agent1.id)
            ? { ...m, battleId: rawData.battle_id, status: 'in_progress' as const }
            : m
        )
        updateRound({ matchups: updatedMatchups })
      }
    })

    // Turn completed - update battle with new turn data
    // Backend sends: { battle_id, round_id, turn: { turn_number, agent1_id, agent1_argument, ... } }
    ws.on('turn_completed', (data) => {
      const rawData = data as {
        battle_id: string
        round_id: string
        turn: {
          turn_number: number
          agent1_id: string
          agent1_name: string
          agent1_argument: string
          agent2_id: string
          agent2_name: string
          agent2_argument: string
          judge_votes: Array<{
            judge_id: string
            judge_name: string
            voted_for_id: string
            voted_for_name: string
            rating: number
            reaction: string
            reasoning: string
          }>
          winner_id: string
          winner_name: string
          loser_id: string
          loser_name: string
          total_damage: number
          loser_hp_after: number
          was_critical: boolean
        }
      }
      console.log('Turn completed:', rawData)

      // Transform to frontend format
      const turn: import('../store/types').BattleTurn = {
        turnNumber: rawData.turn.turn_number,
        argument1: {
          agentName: rawData.turn.agent1_name,
          argument: rawData.turn.agent1_argument,
          timestamp: Date.now(),
        },
        argument2: {
          agentName: rawData.turn.agent2_name,
          argument: rawData.turn.agent2_argument,
          timestamp: Date.now(),
        },
        votes: rawData.turn.judge_votes.map((v) => ({
          judgeId: v.judge_id,
          judgeName: v.judge_name,
          votedForId: v.voted_for_id,
          votedForName: v.voted_for_name,
          rating: v.rating,
          reaction: v.reaction,
          reasoning: v.reasoning,
        })),
        winnerId: rawData.turn.winner_id,
        winnerName: rawData.turn.winner_name,
        loserId: rawData.turn.loser_id,
        loserName: rawData.turn.loser_name,
        damage: rawData.turn.total_damage,
        wasCritical: rawData.turn.was_critical,
      }

      const battle = useGameStore.getState().activeBattles.find((b) => b.id === rawData.battle_id)
      if (battle) {
        updateActiveBattle(rawData.battle_id, {
          turns: [...battle.turns, turn],
          currentTurn: turn.turnNumber,
        })

        // Update agent HP
        if (turn.loserId) {
          updateChoiceAgent(turn.loserId, {
            currentBattleHp: rawData.turn.loser_hp_after
          })
        }
      }
    })

    // Battle ended - finalize battle, apply global damage
    // Backend sends: { battle_id, round_id, winner_id, winner_name, loser_id, loser_name, global_hp_lost, loser_global_hp }
    ws.on('battle_ended', (data) => {
      const rawData = data as {
        battle_id: string
        round_id: string
        winner_id: string
        winner_name: string
        loser_id: string
        loser_name: string
        global_hp_lost: number
        loser_global_hp: number | null
      }
      console.log('Battle ended:', rawData)

      // Mark battle as ended
      updateActiveBattle(rawData.battle_id, {
        status: 'ended',
        winner: rawData.winner_id,
        loser: rawData.loser_id,
      })

      // Update winner status
      updateChoiceAgent(rawData.winner_id, {
        status: 'active',
        currentBattleHp: 50, // Reset battle HP
      })

      // Update loser - apply global HP damage
      const loserAgent = useGameStore.getState().agents.find((a) => a.id === rawData.loser_id)
      if (loserAgent) {
        const newGlobalHp = rawData.loser_global_hp ?? Math.max(0, loserAgent.currentGlobalHp - rawData.global_hp_lost)
        updateChoiceAgent(rawData.loser_id, {
          status: newGlobalHp <= 0 ? 'eliminated' : 'active',
          currentGlobalHp: newGlobalHp,
          currentBattleHp: 50, // Reset battle HP
        })
      }

      // Update matchup status
      const currentRound = useGameStore.getState().currentRound
      if (currentRound) {
        const updatedMatchups = currentRound.matchups.map((m) =>
          m.battleId === rawData.battle_id
            ? { ...m, status: 'completed' as const, winnerId: rawData.winner_id }
            : m
        )
        updateRound({ matchups: updatedMatchups })
      }

      // Remove from active battles after a short delay (to show result)
      setTimeout(() => {
        removeActiveBattle(rawData.battle_id)
      }, 3000)
    })

    // Round ended
    // Backend sends: { round_id, round_number, battles_completed }
    ws.on('round_ended', (data) => {
      const rawData = data as {
        round_id: string
        round_number: number
        battles_completed: number
      }
      console.log('Round ended:', rawData)

      completeRound()

      // Reset all battling agents to active
      useGameStore.getState().agents.forEach((agent) => {
        if (agent.status === 'battling') {
          updateChoiceAgent(agent.id, { status: 'active' })
        }
      })
    })

    // Agent eliminated
    // Backend sends: { agent_id, agent_name, final_rank, global_hp }
    ws.on('agent_eliminated', (data) => {
      const rawData = data as {
        agent_id: string
        agent_name: string
        final_rank: number
        global_hp: number
      }
      console.log('Agent eliminated:', rawData)

      updateChoiceAgent(rawData.agent_id, {
        status: 'eliminated',
        currentBattleHp: 0,
        currentGlobalHp: rawData.global_hp,
      })
    })

    // Game ended - set winner and rankings
    // Backend sends: { winner_id, winner_name, eliminated_order, total_battles }
    ws.on('game_ended', (data) => {
      const rawData = data as {
        winner_id: string | null
        winner_name: string
        eliminated_order: string[]
        total_battles: number
      }
      console.log('Game ended:', rawData)

      // Find the winner agent from our stored agents
      const agents = useGameStore.getState().agents
      const winner = agents.find((a) => a.id === rawData.winner_id)
      
      if (winner) {
        setWinner(winner)
      }

      // Build rankings: winner first, then eliminated in reverse order (last eliminated = 2nd place)
      const rankings: ChoiceAgent[] = []
      if (winner) {
        rankings.push(winner)
      }
      // Reverse eliminated order so last eliminated is highest ranked
      for (const eliminatedId of [...rawData.eliminated_order].reverse()) {
        const agent = agents.find((a) => a.id === eliminatedId)
        if (agent) {
          rankings.push(agent)
        }
      }
      setRankings(rankings)
      
      setCurrentScreen('victory')
    })

    // Error handling
    ws.on('error', (data) => {
      const errorData = data as { message: string }
      console.error('WebSocket error:', errorData)
      setError(errorData.message)
    })

    // State sync (for reconnection)
    ws.on('state_sync', (data) => {
      console.log('State sync received:', data)
      // Could restore full state from server here
    })

    // Cleanup on unmount
    return () => {
      ws.disconnect()
      useGameStore.getState().setConnected(false)
    }
  }, [sessionId])

  const sendMessage = <T,>(type: string, data: T) => {
    if (wsRef.current) {
      wsRef.current.send(type, data)
    }
  }

  const isConnected = () => {
    return wsRef.current?.isConnected() ?? false
  }

  return { sendMessage, isConnected }
}
